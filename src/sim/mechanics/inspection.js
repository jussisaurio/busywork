// Inspection: at a set time one NPC walks an ordered list of checks and ticks each one off where it stands. Each
// check is judged when he gets to it, not all at once: once ticked, what happens to it no longer matters to him.
//
// Level data (level.inspections, a list, checked in order every step, after the spots):
//   npc       the cast id who inspects
//   at        game minute he sets off (the first step after it that he is on the floor with no override of his own;
//             never after the gather). Once a loop.
//   override  his override while inspecting
//   plan, label  the plan key prefix (`${plan}#${seq}`) and the debug label (`${label} i/n`: checks done)
//   look      seconds he stands at each check (default 1)
//   sign      what his signs show: 'mark' (default: ✔️ or ❌ alone) or 'item' (what he checked, then the mark:
//             💻✔️ for an item, 💻❌ for a missing one, the person's icon for a who check; 🚫 first for an absent
//             check: 🚫💻✔️)
//   checks    in order, each one of:
//               { item, spot, from? }  an item of type `item` lies on spot `spot` (put down, or itemOn() in
//                                      initialWorld; putdown.js). `item` may be a list of types: any of them
//                                      counts. He stands at `from` (default: the spot itself).
//               { who, zone, from }    `who` ('player' or a cast id, active) is in zone `zone`. He stands at `from`.
//             and optionally:
//               absent: true           turned round: it passes when no such item lies there (who: she isn't there)
//               icon                   what the sign shows before the mark (an icon or a list), whatever `sign` says
//             On arrival: a sign over what he checked (the item's place, the person, or the zone if she isn't
//             there), then he stands `look` s.
//   pass      { set?, event?, says? } once every check passed; then he resumes his day
//   fail      { set?, event?, says?, then? } at the first ❌ (he checks no further). then:
//               'caught'  he catches the player (rules.js caught, reason 'inspection'): the day is over
//               'stare'   he turns on the player, 😠, then resumes his day
//               'hunt'    he starts his hunt (level.hunts)
//               a name    a behaviour hook: level.behaviours[then].arrive(game, npc, sim, { index })
//               (none)    he resumes his day
// Events: inspect:start { by }; inspect:pass / inspect:fail { by, index } (index: the check's place in `checks`);
// inspect:done { by, failed } (failed: the index of the ❌, or null); inspect:moved { by, index } once when an item
// he has already ticked off leaves its spot while he is still inspecting.
// A lure can pull him away mid-inspection: the inspection is dropped. The gather leaves him to finish.
import { say, sightline } from '../../core/fx.js';
import { inZone, findNpc } from '../../game/perception.js';
import { setOverride, endOverride, holdFor, speak, applyEffect, spotLeg } from '../override.js';
import { restOf } from './putdown.js';

export const keepsThroughMeeting = true;
export const LOOK = 1; // s at each check
const SIGN_TTL = 2.5;

export const owns = (insp, npc) => npc.override === insp.override && npc._insp?.data === insp;

export const working = () => true; // no daydreaming on the job

export function check(game, npc, insp, now, sim) {
  if (npc._insp && npc._insp.data === insp && !owns(insp, npc)) npc._insp = null; // pulled away: dropped
  if (now < insp.at || npc._insp || npc.override || !npc.active || npc._gone || npc._gathered) return;
  if (npc._inspected?.includes(insp)) return;
  (npc._inspected ??= []).push(insp);
  npc._insp = { data: insp, i: 0, passed: [], sim };
  setOverride(npc, insp.override);
  game.events.emit('inspect:start', { by: npc.id });
}

export const key = (insp, npc) => `${insp.plan}#${npc._ovSeq}`;

export function build(game, npc, plan, insp) {
  const from = npc._insp.i;
  plan.legs = insp.checks.slice(from).map((c, k) => spotLeg(game, c.from ?? c.spot, { arrive: (g, n) => arrive(g, n, insp, from + k) }));
  plan.label = insp.label;
}

export const label = (game, npc, insp) => `${insp.label} ${npc._insp.i}/${insp.checks.length}`;

// The item types an item check counts (`item`: one type or a list).
const typesOf = (c) => [c.item].flat();
const PLAYER_ICON = '🧍'; // a who check's sign, for the player

// The check at a glance: { ok, at (where the sign goes), found (the items he sees there) }.
function inspect(game, c) {
  if (c.item !== undefined) {
    const types = typesOf(c);
    const item = game.world.items.find((i) => types.includes(i.type) && i.spot === c.spot);
    return { ok: !item === !!c.absent, at: restOf(game.level.spots[c.spot]), found: item ? [item] : [] };
  }
  const p = c.who === 'player' ? game.player : findNpc(game, c.who);
  const here = !!p && (c.who === 'player' || p.active) && inZone(game, c.zone, p.x, p.y);
  if (here) return { ok: !c.absent, at: c.who, found: [] };
  const z = game.level.zones[c.zone];
  return { ok: !!c.absent, at: { x: (z.x0 + z.x1) / 2, y: (z.y0 + z.y1) / 2 }, found: [] };
}

// The sign over a check: what it shows (the check's `icon`, else with sign: 'item' what he checked), then the mark.
function signOf(game, insp, c, r) {
  const what = c.icon ?? (insp.sign === 'item' ? shows(game, c, r) : []);
  return [...[what].flat(), r.ok ? '✔️' : '❌'];
}
function shows(game, c, r) {
  const no = c.absent ? ['🚫'] : [];
  if (c.item === undefined) return [...no, c.who === 'player' ? PLAYER_ICON : findNpc(game, c.who)?.icon ?? []].flat();
  const icon = (type) => game.level.items[type].icon;
  return [...no, ...(r.found.length ? r.found.map((i) => icon(i.type)) : [icon(typesOf(c)[0])])];
}

function arrive(game, npc, insp, index) {
  const st = npc._insp;
  if (!st || st.data !== insp) return;
  const c = insp.checks[index];
  const r = inspect(game, c);
  st.i = index + 1;
  say(game, r.at, signOf(game, insp, c, r), { kind: 'sign', ttl: SIGN_TTL });
  game.events.emit(r.ok ? 'inspect:pass' : 'inspect:fail', { by: npc.id, index });
  holdFor(npc, insp.look ?? LOOK);
  if (!r.ok) return fail(game, npc, insp, index);
  for (const item of r.found) st.passed.push({ index, item, spot: item.spot, moved: false }); // (none if absent)
  if (st.i < insp.checks.length) return;
  npc._insp = null;
  applyEffect(game, insp.pass);
  speak(game, npc, insp.pass?.says);
  game.events.emit('inspect:done', { by: npc.id, failed: null });
  endOverride(npc);
}

function fail(game, npc, insp, index) {
  const st = npc._insp;
  const f = insp.fail ?? {};
  applyEffect(game, f);
  speak(game, npc, f.says);
  game.events.emit('inspect:done', { by: npc.id, failed: index });
  if (f.then === 'caught') {
    st.caught = true; // he stays on it, checking no further, and the rules catch the player (judge)
    npc._plan.legs.length = npc._plan.li;
    sightline(game, npc.id, 'caught', 1.6);
    return;
  }
  npc._insp = null;
  const sim = st.sim;
  if (f.then === 'hunt') return sim.startHunt(game, npc);
  endOverride(npc);
  if (f.then === 'stare') {
    const p = game.player;
    npc._faceTarget = Math.atan2(p.y - npc.y, p.x - npc.x);
    sightline(game, npc.id, 'notice', 1.2);
    say(game, npc.id, ['😠'], { kind: 'speech', voice: npc.voice });
    holdFor(npc, 1.5);
  } else if (f.then) {
    game.level.behaviours[f.then].arrive(game, npc, sim, { index });
  }
}

// While he inspects: what he already ticked off leaves its spot (picked up, taken).
export function tick(game, npc, dt, insp) {
  const st = npc._insp;
  if (st.caught) return;
  for (const rec of st.passed) {
    if (rec.moved || (rec.item.spot === rec.spot && game.world.items.includes(rec.item))) continue;
    rec.moved = true;
    game.events.emit('inspect:moved', { by: npc.id, index: rec.index });
  }
}

// The office rules (play/rules.js via mechanics/index.js): a failed inspection that ends in 'caught'.
export function judge(game, rules) {
  if (!game.level.inspections) return false;
  const npc = game.npcs.find((n) => n._insp?.caught);
  if (!npc) return false;
  rules.caught(game, 'inspection', npc.id);
  return true;
}

// Level data errors (a check's spot or zone, fail.then) are src/levels/validate.js's, at load.
