// Claim: whoever takes a thing back from you walks over first and takes it at arm's length, instead of taking it
// out of your hand from across the room. Opt-in per item: `walk: true` in level.items (off by default: the owner
// takes it on sight). One entry per such item, for its owner (items[type].owner.id) and its confiscator
// (items[type].contraband).
//
// Two ways in, both setting npc._claim = { item, word?, any?, onCatch?, was }:
//   - the office rules (play/rules.js react): an owner who sees you with his thing (the rules take it in claimsDue
//     once he is within CLAIM_REACH: his reclaim, his `says`);
//   - a level, on a catch (startClaim, onCatch: true): the day's end waits for him (play/scenario.js), and the rules
//     emit 'claim:done' { by, item } when he gets there, for the level to do the take.
// This mechanic walks him to you, following if you move, and stops him at arm's length. He gives up when you no
// longer hold it (unless `any`: a catch over a thing you had your hand on). Afterwards he goes back to the override
// he was in (`was`: a hunt that the take ends, or not), else to his day. Override 'claiming' (plan `claim_<type>#<seq>`).
import { findPath } from '../nav.js';
import { setOverride, endOverride } from '../override.js';

export const CLAIM_REACH = 1.2; // tiles between him and you when he takes it

export const keepsThroughMeeting = true; // he finishes taking it back, then goes to the meeting

export function entries(level) {
  const list = [];
  for (const [type, flags] of Object.entries(level.items ?? {})) {
    if (!flags?.walk) continue;
    const ids = [flags.owner?.id, flags.contraband].filter((id) => id && id !== 'player');
    if (ids.length) list.push({ item: type, npcs: [...new Set(ids)], override: 'claiming', plan: `claim_${type}`, label: `coming for his ${type}` });
  }
  return list;
}

const tileOf = (p) => ({ x: Math.floor(p.x), y: Math.floor(p.y) });

export const withinReach = (npc, p) => Math.hypot(p.x - npc.x, p.y - npc.y) <= CLAIM_REACH;

// Whether he has to walk for it (not within reach, and he can walk to you). The rules and startClaim take it on the
// spot otherwise.
export function mustWalk(game, npc) {
  const p = game.player;
  return !withinReach(npc, p) && !!findPath(game.map, npc, tileOf(p), 'npc');
}

// A level's way in (on a catch): true if he is now on his way; false: take it now.
export function startClaim(game, npc, item, opts = {}) {
  if (!mustWalk(game, npc)) return false;
  npc._claim = { item, ...opts };
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
  const to = tileOf(game.player);
  npc._claimAt = to;
  if (findPath(game.map, npc, to, 'npc')) plan.legs.push({ ...to, arrive: (g, n) => face(g, n) });
}

function face(game, npc) {
  const p = game.player;
  npc._faceTarget = Math.atan2(p.y - npc.y, p.x - npc.x);
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
  const p = game.player;
  if (!c || c.done || (!c.any && p.held !== f.item)) return finish(npc);
  if (withinReach(npc, p)) { // there: he stops and holds out his hand (the rules take it)
    face(game, npc);
    const plan = npc._plan;
    plan.path = null;
    plan.legs = [];
    plan.li = 0;
    return;
  }
  const to = tileOf(p);
  const at = npc._claimAt;
  if (at && (at.x !== to.x || at.y !== to.y) && findPath(game.map, npc, to, 'npc')) npc._ovSeq++; // you moved: after you
}
