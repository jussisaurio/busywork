// Claim: whoever takes a thing back walks over first and takes it at arm's length, never out of your hand (or off
// your desk) from across the room. One entry per item with an owner (items[type].owner.id) or a confiscator
// (items[type].contraband), for each of them. The floor is fetch.js's (he walks over and picks it up there).
//
// Ways in, each setting npc._claim = { item, at?, word?, any?, onCatch?, was }:
//   - the office rules (play/rules.js comeFor): an owner who sees you with his thing, or sees it on your desk (`at`:
//     that world item; putdown.js judge), or the owner or confiscator who shows you out of his office holding it.
//     The rules take it (sim/take.js takesBack, with his `says` if `word`) once he is there (claimDue);
//   - a level, on a catch (startClaim, onCatch: true): the day's end waits for him (play/scenario.js), and the rules
//     emit 'claim:done' { by, item } when he gets there, for the level to do the take.
// This mechanic walks him to it, following you if you move, and stops him at arm's length (CLAIM_REACH). He gives up
// when it is no longer where he was going for it: you let go of it (unless `any`: a catch over a thing you had your
// hand on), or it left your desk. With no way to it (no path) he waits where he is, turned to it, until there is one
// or it moves: he never takes it from where he stands. Afterwards he goes back to the override he was in (`was`: a
// hunt that the take ends, or not), else to his day. Override 'claiming' (plan `claim_<type>#<seq>`).
import { findPath } from '../nav.js';
import { setOverride, endOverride } from '../override.js';

export const CLAIM_REACH = 1.2; // tiles between him and you when he takes it

export const keepsThroughMeeting = true; // he finishes taking it back, then goes to the meeting

export function entries(level) {
  const list = [];
  for (const [type, flags] of Object.entries(level.items ?? {})) {
    const ids = [flags?.owner?.id, flags?.contraband].filter((id) => id && id !== 'player');
    if (ids.length) list.push({ item: type, npcs: [...new Set(ids)], override: 'claiming', plan: `claim_${type}`, label: `coming for his ${type}` });
  }
  return list;
}

const tileOf = (p) => ({ x: Math.floor(p.x), y: Math.floor(p.y) });
const NEAR = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];

const withinReach = (npc, p) => Math.hypot(p.x - npc.x, p.y - npc.y) <= CLAIM_REACH;

// What he is going for: you, or the world item `at` (on your desk).
const target = (game, c) => c.at ?? game.player;

// Still where he is going for it: in your hand (or, `any`, you had your hand on it), or the item still lies there.
function stillThere(game, c) {
  if (c.at) return game.world.items.includes(c.at);
  return c.any || game.player.held === c.item;
}

// The tile he walks to: yours; for an item, its own tile if he can stand there, else the nearest he can get to
// beside it (a desk). Null: no way there.
function approach(game, npc, c) {
  const t = tileOf(target(game, c));
  const near = c.at ? NEAR : [[0, 0]];
  for (const [dx, dy] of near) {
    const to = { x: t.x + dx, y: t.y + dy };
    if (findPath(game.map, npc, to, 'npc')) return to;
  }
  return null;
}

// He is there: at arm's length, or (an item) at the tile he walked to beside it.
const there = (game, npc, c) => withinReach(npc, target(game, c)) || !!(c.at && c.arrived);

// For the rules (claimsDue): he is there, and it is still where he was going for it.
export const claimDue = (game, npc) => stillThere(game, npc._claim) && there(game, npc, npc._claim);

// The way in (the rules' comeFor; a level, on a catch). item: the type; opts.at: the world item, if not your hand.
// True if he is now on his way; false: he is there already, take it now.
export function startClaim(game, npc, item, opts = {}) {
  const c = { item, ...opts };
  if (there(game, npc, c)) return false;
  npc._claim = c;
  return true;
}

// A claim the day's end waits for (scenario.js): a catch's take, not done yet.
export const claimPending = (game) => game.npcs.some((n) => n._claim?.onCatch && !n._claim.done);

export const owns = (f, npc) => npc.override === f.override && npc._claim?.item === f.item;

// Starts the walk the step after it was asked for, whatever he was doing (remembered in `was`).
export function check(game, npc, f) {
  const c = npc._claim;
  if (!c || c.item !== f.item || c.started) return;
  c.started = true;
  c.was = npc.override === f.override ? null : npc.override;
  npc._wait = 0;
  setOverride(npc, f.override);
}

export const key = (f, npc) => `${f.plan}#${npc._ovSeq}`;

export function build(game, npc, plan, f) {
  plan.label = f.label;
  const c = npc._claim;
  npc._claimAt = tileOf(target(game, c));
  const to = approach(game, npc, c);
  if (to) plan.legs.push({ ...to, arrive: (g, n) => { c.arrived = true; face(g, n); } });
  else face(game, npc); // no way to it: he waits, turned to it
}

function face(game, npc) {
  const t = target(game, npc._claim);
  npc._faceTarget = Math.atan2(t.y - npc.y, t.x - npc.x);
}

// Done, or given up: back to what he was doing.
function finish(npc) {
  const was = npc._claim?.was;
  npc._claim = null;
  npc._claimAt = null;
  if (was && !(npc._gathered && !npc._gone)) setOverride(npc, was);
  else endOverride(npc);
}

export function tick(game, npc, dt, f) {
  const c = npc._claim;
  if (!c || c.done || !stillThere(game, c)) return finish(npc);
  if (there(game, npc, c)) { // there: he stops and holds out his hand (the rules take it)
    face(game, npc);
    const plan = npc._plan;
    plan.path = null;
    plan.legs = [];
    plan.li = 0;
    return;
  }
  const to = tileOf(target(game, c));
  const at = npc._claimAt;
  if (at && (at.x !== to.x || at.y !== to.y)) npc._ovSeq++; // you moved: after you (build finds the way, or he waits)
}
