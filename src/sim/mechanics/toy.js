// Toys (level.toys): a prop plus a cosmetic reaction. You poke something, or someone passes it, and the office
// answers: a bubble, a sound, a pose for a moment, the prop's own drawn state. A toy never decides anything.
//
// What makes that hold, by construction:
//   - A toy's state lives in game.toys (createToys, a fresh one each loop), never in game.world, a person or the
//     player. Its `when` reads; its reaction is data the engine applies (react below), never a function of the game.
//   - The only things a reaction writes: game.toys, game.fx (a bubble, a burst) and one event, `toy:<id>`. Its bubble's
//     'say' event carries `toy: <id>`, and it never covers a real line still showing (core/fx.js say). The behaviour goldens skip both (tools/lib/trace.mjs), so adding a toy moves no
//     golden; the gate's `toy-neutral` check replays every winning golden plan with every toy fired over and over
//     and requires the same trace.
//   - A pose is drawn only (render/characters.js reads game.toys.poses): arms, a scowl, the head turned to the prop.
//     npc.dir, his path and his override never change.
//   - E: a toy is offered only when nothing else is (no route target, nothing in your hand to drop or eat), so it
//     never takes a key press a route would have used (play/interactions.js).
//
// A toy:
//   id       unique; a harness goto target (you walk up to it) and the event `toy:<id>`
//   at       where the prop is: { x, y } (a tile), or a level spot name
//   on       'press' (you press E within reach of it) | 'pass' (one of `npcs` comes within `radius` of it) |
//            'near' (one of `npcs` comes within `radius` of you)
//   npcs     pass / near: who reacts (cast ids)
//   radius   pass / near: tiles (default 2)
//   sees     pass / near: he must also see the prop (pass) or you (near)
//   when(world, state, game, npc)  optional: only while this holds (read only). state: the toy's own (below);
//            npc: who would react (pass / near), the player for press
//   every    seconds before it can fire again (default: press 1, pass / near 3, per person)
//   state    the toy's own starting state ({ tilted: false }); react.set changes it; painters read it (toyState)
//   text     press: the harness's words for the verb ('push the bar')
//   line     the harness's line when it fires (`<by>` is replaced by who did it)
//   react    what happens, all optional:
//     say    [icons] or { icons, kind, ttl, who }: a bubble. who: 'by' (default: whoever fired it), 'prop' (from
//            the prop: a voice behind a door), a cast id or 'player'. Skipped while that speaker has a real
//            (non-toy) bubble up: a toy never talks over the sim's line
//     sfx    a recipe in audio/sfx.js, played at the prop (audio/audio.js)
//     pose   { arms?, angry?, face?, slump?, for? }: drawn on whoever fired it for `for` seconds (default 1.5); face:
//            his head turns to the prop (arms: a render/characters.js pose, e.g. 'point', 'reach', 'shrug'); slump:
//            asleep, his head forward on the desk, glances not shown (drawn only: he sees exactly as before)
//     set    { key: value }: the toy's new state
//     burst  { kind, n?, speed?, lift?, ttl? }: particles at the prop (core/fx.js BURST_KINDS)
//   try      harness commands after which it has fired (the gate's `toys` check plays them)
import { INTERACT_RADIUS } from '../../config.js';
import { say, burst } from '../../core/fx.js';
import { npcSees } from '../../game/perception.js';

const DEFAULT_EVERY = 3;
const DEFAULT_RADIUS = 2;
const DEFAULT_POSE = 1.5;

// A fresh game.toys for a new loop: { focus, byId: { id: { state, firedAt, by, n, last } }, poses: { who: pose } }.
export function createToys(level) {
  const byId = {};
  for (const t of level.toys ?? []) byId[t.id] = { state: { ...t.state }, firedAt: null, by: null, n: 0, last: {} };
  return { focus: null, byId, poses: {} };
}

// The prop's centre in tile units.
export function toyPos(level, toy) {
  if (typeof toy.at === 'string') {
    const s = level.spots[toy.at];
    return { x: s.x + 0.5, y: s.y + 0.5 };
  }
  return { x: toy.at.x + 0.5, y: toy.at.y + 0.5 };
}

// What a painter reads: the toy's state, plus `since` (seconds since it last fired, null if never) and `by`.
const NO_TOY = { since: null, by: null, n: 0 };
export function toyState(game, id) {
  const t = game.toys?.byId[id];
  if (!t) return NO_TOY;
  return { ...t.state, since: t.firedAt === null ? null : game.loopTime - t.firedAt, by: t.by, n: t.n };
}

const ready = (game, toy, t, who) => {
  const last = t.last[who];
  return last === undefined || game.loopTime - last >= (toy.every ?? (toy.on === 'press' ? 1 : DEFAULT_EVERY));
};

// The press toy in reach of the player, as a focus (play/interactions.js asks only when nothing else is), or null.
export function toyFocus(game) {
  const toys = game.level.toys;
  if (!toys) return null;
  const p = game.player;
  let best = null;
  let bestD = Infinity;
  for (const toy of toys) {
    if (toy.on !== 'press') continue;
    const at = toyPos(game.level, toy);
    const d = Math.hypot(at.x - p.x, at.y - p.y);
    if (!(d <= INTERACT_RADIUS && d < bestD)) continue;
    const t = game.toys.byId[toy.id];
    if (toy.when && !toy.when(game.world, t.state, game, p)) continue;
    bestD = d;
    best = { kind: 'interactable', id: toy.id, x: at.x, y: at.y, toy: true };
  }
  return best;
}

// The player pressed E on the toy focus `f`.
export function pressToy(game, f) {
  const toy = game.level.toys.find((t) => t.id === f.id);
  const t = game.toys.byId[toy.id];
  if (!ready(game, toy, t, 'player')) return;
  fire(game, toy, 'player');
}

// Every step (game/loop.js): pass and near toys.
export function updateToys(game) {
  const toys = game.level.toys;
  if (!toys || !game.toys) return;
  const p = game.player;
  for (const toy of toys) {
    if (toy.on === 'press') continue;
    const t = game.toys.byId[toy.id];
    const at = toyPos(game.level, toy);
    const r = toy.radius ?? DEFAULT_RADIUS;
    for (const n of game.npcs) {
      if (!n.active || !toy.npcs.includes(n.id) || !ready(game, toy, t, n.id)) continue;
      const to = toy.on === 'pass' ? at : p;
      if (Math.hypot(to.x - n.x, to.y - n.y) > r) continue;
      if (toy.sees && !npcSees(game, n, to.x, to.y)) continue;
      if (toy.when && !toy.when(game.world, t.state, game, n)) continue;
      fire(game, toy, n.id);
    }
  }
}

// The reaction. who: 'player' or an NPC id.
export function fire(game, toy, who) {
  const t = game.toys.byId[toy.id];
  const at = toyPos(game.level, toy);
  const r = toy.react ?? {};
  t.firedAt = game.loopTime;
  t.last[who] = game.loopTime;
  t.by = who;
  t.n += 1;
  if (r.set) Object.assign(t.state, r.set);
  if (r.pose) game.toys.poses[who] = { ...r.pose, until: game.loopTime + (r.pose.for ?? DEFAULT_POSE), x: at.x, y: at.y };
  if (r.burst) burst(game, r.burst.kind, at.x, at.y, r.burst.n ?? 8, r.burst);
  if (r.say) {
    const s = Array.isArray(r.say) ? { icons: r.say } : r.say;
    const speaker = s.who === undefined || s.who === 'by' ? who : s.who === 'prop' ? { x: at.x, y: at.y } : s.who;
    // A toy never talks over a real line: the sim may wait on that bubble (and it is the one that matters).
    const busy = typeof speaker === 'string' && game.fx.bubbles.some((b) => b.ownerKey === speaker && !b.toy);
    if (!busy) say(game, speaker, s.icons, { kind: s.kind, ttl: s.ttl, toy: toy.id });
  }
  game.events.emit(`toy:${toy.id}`, { id: toy.id, by: who, x: at.x, y: at.y });
}
