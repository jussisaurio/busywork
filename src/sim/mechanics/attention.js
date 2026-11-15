// Attention: a noise turns every head in earshot toward it for a moment, so the player can make a glance happen
// instead of waiting for one.
//
// A noise is { x, y, radius, npcs? } in tiles. Earshot is straight-line distance: walls don't stop sound. Every NPC
// in earshot who is on the floor (active, not gone) faces the noise for TURN_TIME s. A second noise meanwhile turns
// him to the new one and restarts the clock. The authority (level.roles.authority) hears nothing while he is in his
// `deafIn` zone. `npcs` (cast ids) limits who can hear it; default everyone. This is the one mechanic that acts on
// NPCs its data doesn't name (mechanics/index.js): a noise is heard by whoever is near.
//   - An NPC without an override turns his body and stands still meanwhile (holdFor): his plan waits.
//   - An NPC in a scripted moment (any override: the meeting, a hunt, a lure's job, a door, ...) turns only his
//     head, at most HEAD_MAX, and keeps to his plan: no script waits on a noise.
// The vision cone follows (perception.js viewerOf: dir + glance offset). Glances that fall due meanwhile are drawn
// but not shown (npcs.js updateGlance), so the per-NPC rng draws exactly as without the noise.
//
// Level data (both optional):
//   interactions[verb].noise   { radius, at?, npcs?, ...timing }: the action makes a noise when it is done
//                              (play/interactions.js), at the level spot `at`, or else where it was aimed (the
//                              target's centre; you, for 'self')
//   noises     { [eventName]: { at, radius, npcs?, ...timing } }: whenever that event fires, a noise at the level
//              spot `at` (e.g. { 'door:bang': { at: 'door', radius: 8 } }). Not 'noise' or 'npc:heard' themselves.
// Timing (all optional; s are sim seconds, like holdFor's, so fast-forward speeds them up with the clock):
//   delay      s from the trigger to the sound (a microwave's ding): the noise waits, then sounds where it was set
//   every      s between repeats after the first sound (a copier's beeping), for as long as `while` holds
//   while(w)   (world) -> bool, asked at every sound, the first one too: false drops the noise, now and for good. A
//              delayed noise with it is cancelled if the world changes meanwhile; without it a repeat goes all day
//   turn       s heads stay turned (default TURN_TIME)
// Show (optional): ripple   true or { color }: rings spread from the noise to its earshot each time it sounds
//                           (core/fx.js ripple; render only, game.fx)
// A waiting or repeating noise belongs to the loop: a new loop (createNpcs) drops it.
// Events: 'noise' { x, y, radius }, then 'npc:heard' { id } for each NPC who heard it, in cast order, every time
// it sounds. Nothing is emitted (and nothing is subscribed) unless a noise happens.
//
// State: npc._heard = null | { x, y, t, head } (t: s left; head: only the head turns), private to this file; the
// waiting and repeating noises, per game in `pending`.
import { GLANCE_ANGLE, GLANCE_TURN_TIME } from '../../config.js';
import { angleDiff } from '../../core/vision.js';
import { spotPos, inZone } from '../../game/perception.js';
import { holdFor } from '../override.js';
import { ripple as showRipple } from '../../core/fx.js';

// --- Tunables ------------------------------------------------------------------
const TURN_TIME = 1.5; // s an NPC faces a noise
const HEAD_MAX = GLANCE_ANGLE[1]; // a head-only turn goes no further than the widest glance
const HEAD_SPEED = GLANCE_ANGLE[1] / GLANCE_TURN_TIME; // rad/s: as quick as a glance

// Make a noise now: every NPC in earshot turns toward it, for `turn` s (default TURN_TIME). `ripple`: show it.
export function makeNoise(game, { x, y, radius, npcs, turn = TURN_TIME, ripple }) {
  game.events.emit('noise', { x, y, radius });
  if (ripple && game.fx) showRipple(game, x, y, radius, ripple === true ? {} : ripple);
  const auth = game.level.roles?.authority;
  for (const npc of game.npcs) {
    if (npcs && !npcs.includes(npc.id)) continue;
    if (!npc.active || npc._gone) continue;
    if (Math.hypot(npc.x - x, npc.y - y) > radius) continue;
    if (auth?.deafIn && npc.id === auth.id && inZone(game, auth.deafIn, npc.x, npc.y)) continue;
    const head = !!npc.override; // the mode is fixed when he hears it
    npc._heard = { x, y, t: turn, head };
    if (!head) holdFor(npc, turn);
    game.events.emit('npc:heard', { id: npc.id });
  }
}

// An action row's noise once the action is done (play/interactions.js). (x, y): where the action was aimed.
export function actionNoise(game, row, x, y) {
  const n = row?.noise;
  if (!n) return;
  const p = n.at ? spotPos(game, n.at) : { x, y };
  setNoise(game, n, p.x, p.y);
}

// A level's noise (an action row's, or level.noises') set off at (x, y): now, or later and again (`delay`, `every`).
const pending = new WeakMap(); // game -> [{ n, x, y, t }]: t s to the next sound
export function setNoise(game, n, x, y) {
  if (!(n.delay > 0)) {
    if (!sound(game, n, x, y) || !(n.every > 0)) return;
  }
  let list = pending.get(game);
  if (!list) pending.set(game, (list = []));
  list.push({ n, x, y, t: n.delay > 0 ? n.delay : n.every });
}
function sound(game, n, x, y) {
  if (n.while && !n.while(game.world)) return false;
  makeNoise(game, { x, y, radius: n.radius, npcs: n.npcs, turn: n.turn, ripple: n.ripple });
  return true;
}

// Every step of the day, before the NPCs move (npcs.js updateNpcs): the waiting noises count down and sound, in
// the order they were set.
export function tickNoises(game, dt) {
  const list = pending.get(game);
  if (!list?.length) return;
  for (const q of list.slice()) {
    q.t -= dt;
    if (q.t > 1e-9) continue;
    if (sound(game, q.n, q.x, q.y) && q.n.every > 0) q.t += q.n.every;
    else list.splice(list.indexOf(q), 1);
  }
}

// A new loop (npcs.js createNpcs): nothing is waiting to sound.
export function resetNoises(game) {
  pending.delete(game);
}

// level.noises: subscribe each event the level names, once per game (the bus outlives loops; npcs.js createNpcs
// calls this every loop). The handler reads game.level when the event fires. An unknown spot throws now.
const listening = new WeakMap(); // game -> Set of event names
export function listenForNoises(game) {
  const noises = game.level.noises;
  if (!noises) return;
  let names = listening.get(game);
  if (!names) listening.set(game, (names = new Set()));
  for (const [name, n] of Object.entries(noises)) {
    if (name === 'noise' || name === 'npc:heard') throw new Error(`level.noises: '${name}' would make a noise forever`);
    spotPos(game, n.at);
    if (names.has(name)) continue;
    names.add(name);
    game.events.on(name, () => {
      const cur = game.phase === 'day' ? game.level.noises?.[name] : null;
      if (!cur) return;
      const p = spotPos(game, cur.at);
      setNoise(game, cur, p.x, p.y);
    });
  }
}

// The way his body faces while a noise turns it (npcs.js updateFacing), or null: no noise, or only his head turns.
export function heardFacing(npc) {
  const h = npc._heard;
  if (!h || h.head) return null;
  const dx = h.x - npc.x;
  const dy = h.y - npc.y;
  return dx || dy ? Math.atan2(dy, dx) : null;
}

// His head while a noise holds his attention (npcs.js updateGlance): { target, speed } for the glance offset, or
// null. A turned body keeps the head straight; a head-only turn looks at the noise, at most HEAD_MAX.
const HEAD = { target: 0, speed: HEAD_SPEED };
export function heardHead(npc) {
  const h = npc._heard;
  if (!h || !npc.active) return null;
  HEAD.target = 0;
  if (h.head) {
    const dx = h.x - npc.x;
    const dy = h.y - npc.y;
    const a = dx || dy ? angleDiff(Math.atan2(dy, dx), npc.dir) : 0;
    HEAD.target = Math.max(-HEAD_MAX, Math.min(HEAD_MAX, a));
  }
  return HEAD;
}

// Every step, after the glance (npcs.js updateNpc): the turn runs out, or ends when he leaves the floor.
export function tickAttention(npc, dt) {
  const h = npc._heard;
  if (!h) return;
  h.t -= dt;
  if (h.t <= 1e-9 || !npc.active) npc._heard = null;
}
