// NPC simulation: schedule execution, walking, smooth turning, glances, the meeting gather, and the level's
// mechanics (mechanics/*: lures, ...) and the rest of the sim overrides from CONTRACTS.md.
//
// Design notes
// - All per-loop state lives on the NPC objects (fields with a leading underscore). There is no
//   module-level mutable state, so createNpcs() on a fresh/reset game starts a clean day.
// - Each step an NPC derives a "plan key" from (override, current schedule entry, a few flags).
//   When the key changes we build a new plan (a list of legs = destination tiles) and path to
//   the first leg. Paths are computed once per leg, never per step.
// - Glances run on a per-NPC rng whose draws happen on a fixed real-time timer, whether or not
//   the glance is shown. So glance timing is a pure function of loop time per NPC: independent
//   of the player and of the other NPCs (learnable across loops).
import {
  SEED, NPC_SPEED, GAME_MIN_PER_SEC, VISION_DEFAULT,
  GLANCE_EVERY, GLANCE_ANGLE, GLANCE_HOLD, GLANCE_TURN_TIME,
} from '../config.js';
import { angleDiff } from '../core/vision.js';
import { createRng } from '../core/rng.js';
import { say, sightline } from '../core/fx.js';
import { spotPos } from '../game/perception.js';
import { findPath, smoothPath } from './nav.js';
import { setOverride, npcSayLater, holdFor, speak, applyEffect, spotLeg } from './override.js';
import { mechanicsFor, mechanicOf, startHunt } from './mechanics/index.js';
import { listenForNoises, resetNoises, tickNoises, heardFacing, heardHead, tickAttention } from './mechanics/attention.js';

export { npcSayLater };

// --- Tunables ------------------------------------------------------------------
const TURN_RATE = 9; // body turn speed (rad/s)
const BODY_R = 0.3; // half-size of the body box kept clear of solid tiles when smoothing paths
const LOOK_RIGHT = 0.55; // s into a look-around (_look, a hunt's): head right until then, then left...
const LOOK_LEFT = 1.1; // ...until then, then back to centre
const LOOK_TURN = 0.2; // s to swing the head by the look angle
// Walking to the meeting, NPCs speed up just enough to be seated by the meeting (level day.meetingAt) when the walk from where they
// are at the gather is longer than the time left. Capped multiplier:
const MEETING_HURRY_MAX = 1.3;

// FNV-1a: stable 32-bit hash of the NPC id for its rng seed.
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function createNpcs(game) {
  const now = game.clock ? game.clock.minute : 0;
  listenForNoises(game); // level.noises (mechanics/attention.js): subscribes once per game
  resetNoises(game); // a noise still waiting to sound belongs to the old loop
  return game.level.cast.map((def) => createNpc(game, def, now));
}

// One NPC as the sim builds it at game minute `now` (test fakes come from here too, so they carry the
// private fields). The schedule is copied: tests edit the level's cast, and NPCs must not see that mid-day.
// Every copy has all the entry fields (CONTRACTS.md), in one order: one hidden class keeps the schedule scans
// that run every step (entryIndex, fireScheduleSays) fast.
export function createNpc(game, def, now = 0) {
  const sched = def.schedule.map((e) => ({
    at: e.at, do: e.do, spot: e.spot, route: e.route, icons: e.icons, kind: e.kind,
    gone: e.gone, prelude: e.prelude, arrive: e.arrive, anim: e.anim,
  }));
  const first = sched.find((e) => e.spot);
  const p = spotPos(game, first.spot);
  const rng = createRng((SEED ^ hash(def.id)) >>> 0);
  for (const name of hookNames(def, sched)) hook(game, name); // an unknown name throws now, not mid-day
  const glanceEvery = def.glanceEvery ?? GLANCE_EVERY;
  const npc = {
    id: def.id,
    icon: def.icon,
    color: def.color,
    voice: def.voice,
    meetingSpot: def.meetingSpot,
    _meetingArrive: def.meetingArrive ?? null, // behaviour hook on sitting down at the meeting
    x: p.x,
    y: p.y,
    dir: p.dir,
    glance: { offset: 0 },
    vision: { ...(def.vision ?? VISION_DEFAULT) },
    coneTint: def.coneTint, // render only
    active: true,
    pose: first.do === 'sit' ? 'sit' : 'stand',
    moving: false,
    override: null,
    carry: null, // null | item type he carries (Kev's coffee, once he has the day's cup)
    wants: null, // null | item type he now knows is his and misses (Kev found the pot empty: someone has his cup)
    label: `${first.do} ${first.spot}`,
    anim: first.anim ?? null, // render: the schedule entry's `anim` while he follows it (no override)
    rng,
    // --- private sim state ---
    _schedule: sched,
    _said: sched.map((e) => e.do === 'say' && e.at < now), // schedule 'say' entries fire once
    _plan: null,
    _wait: 0, // s to stand still before continuing the plan
    _sayQ: [], // delayed bubbles: { t, icons, kind, ttl }
    _faceTarget: p.dir,
    _look: null, // look-around (a hunt's): { t, angle }
    _stare: null, // a hook's lookAt: { t: s left, dir, back: the facing to return to }
    _heard: null, // a noise holding his attention (mechanics/attention.js)
    _gone: false, // left for the day
    _gathered: false, // the gather has been processed for this NPC: then the meeting's override name (endOverride)
    _ovSeq: 0, // bumped whenever an override starts, so a repeated override gets a fresh plan
    _bangT: 0, // a door's knocking: s to the next bang...
    _bangI: 0, // ...and which line
    _navFail: 0, // unreachable destinations (should stay 0; the test checks)
    _glanceEvery: glanceEvery, // real s between glances (random range)
    _gl: { timer: rng.range(...glanceEvery), target: 0, hold: 0, speed: 0 },
    _mechanics: mechanicsFor(game.level, def.id), // the level's mechanics that name him (read every step)
    _entryKey: null, // the last plan key for a schedule entry with preludes: { i, names, pending, key } (entryKey)
    _craveT: undefined, // s to the next daydream about what he wants (want/crave)
    _insp: undefined, // the inspection he is on (mechanics/inspection.js)...
    _inspected: undefined, // ...and the ones he has started today
  };
  // The fields the level's hooks keep (a behaviour's `state`). Every field an NPC will ever get is on it from the
  // start: NPCs that differ in shape make every NPC field read in the sim slow.
  for (const b of Object.values(game.level.behaviours ?? {})) Object.assign(npc, b.state);
  return npc;
}

export function updateNpcs(game, dt) {
  const now = game.clock.minute;
  const npcs = game.npcs;
  tickNoises(game, dt); // delayed and repeating noises (mechanics/attention.js)

  // 5. Meeting gather, once per loop. The flag lives on the NPCs, so a new loop starts clean.
  if (now >= game.level.day.gatherAt && npcs.length && !npcs.some((n) => n._gathered)) {
    const ov = game.level.meeting.override;
    for (const n of npcs) {
      n._gathered = ov;
      // A lure's job is finished first (endOverride sends him to the meeting afterwards).
      if (n._gone || mechanicOf(game, n)?.kind.keepsThroughMeeting) continue;
      setOverride(n, ov);
    }
    game.events.emit('meeting:gather', {});
  }

  for (const npc of npcs) updateNpc(game, npc, dt, now);
}

function updateNpc(game, npc, dt, now) {
  // The minute his schedule reads: the level's per-NPC clock, or the game clock (level.clockFor, below).
  const t = game.level.clockFor ? game.level.clockFor(game, npc, HOOK_API) : now;
  fireScheduleSays(game, npc, t);
  tickSayQueue(game, npc, dt);
  crave(game, npc, dt);
  checkOverrides(game, npc, now);

  const key = planKey(game, npc, t);
  if (!npc._plan || npc._plan.key !== key) setPlan(game, npc, buildPlan(game, npc, t, key));

  const px = npc.x;
  const py = npc.y;
  stepPlan(game, npc, dt);
  npc.moving = npc.x !== px || npc.y !== py;
  if (npc.moving && !npc._plan.done) npc.pose = 'walk'; // (the arrival step keeps finishPlan's pose)
  updateFacing(npc, dt);
  updateGlance(npc, dt);
  tickAttention(npc, dt);
  const m = mechanicOf(game, npc);
  npc.label = (m && m.kind.label?.(game, npc, m.data)) ?? npc._plan.label;
  npc.anim = npc._plan.anim;
}

// --- Schedule ---------------------------------------------------------------------
// Each NPC's schedule reads a minute: the game clock, unless the level has a per-NPC clock,
//   level.clockFor(game, npc, sim)  the minute (game minutes since day.start) npc's schedule reads this step:
//                                   which entry is current, which `say` entries have fired. Called exactly once per
//                                   NPC per step, in cast order, before anything else of his; it may keep state on
//                                   the NPC (underscore fields) and use sim (HOOK_API: speak, holdFor, faceSpot...).
// Only the schedule reads it. The gather, the meeting, mechanics (a hunt's `until`, an inspection's `at`) and
// everything outside the sim keep the game clock. Without clockFor the schedule reads game.clock.minute.

// Index of the activity entry (not 'say') that is current at `now`.
function entryIndex(npc, now) {
  const s = npc._schedule;
  let idx = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i].at > now) break;
    if (s[i].do !== 'say') idx = i;
  }
  return idx >= 0 ? idx : s.findIndex((e) => e.do !== 'say');
}

function fireScheduleSays(game, npc, now) {
  const s = npc._schedule;
  for (let i = 0; i < s.length; i++) {
    const e = s[i];
    if (e.do !== 'say' || npc._said[i] || e.at > now) continue;
    npc._said[i] = true; // dropped (not deferred) if the NPC is vanished at the time
    if (npc.active) say(game, npc.id, e.icons, { kind: e.kind, voice: npc.voice });
  }
}

// Wanting an item (npc.wants): a yawn and a daydream of it every few seconds until he has it, except while
// working a lure's job. Level 1: Kev without his afternoon coffee 🥱☕, the setup for the grab: a desperate man
// sees your cup.
const CRAVE_FIRST = 4; // s after he learns it's gone (want())
const CRAVE_EVERY = 6;
function want(npc, item) {
  npc.wants = item;
  npc._craveT = CRAVE_FIRST;
}
function crave(game, npc, dt) {
  if (!npc.wants || !npc.active) return;
  const m = mechanicOf(game, npc);
  if (m?.kind.working?.(m.data, npc)) return;
  npc._craveT = (npc._craveT ?? CRAVE_FIRST) - dt;
  if (npc._craveT > 0) return;
  npc._craveT = CRAVE_EVERY;
  const icon = game.level.items?.[npc.wants]?.icon ?? npc.wants;
  say(game, npc.id, ['🥱', icon], { kind: 'thought', voice: npc.voice, ttl: 1.4 });
}

// --- Behaviour hooks (level.behaviours) ------------------------------------------------

// What a hook gets as its third argument (documented in levels/meeting/behaviours.js).
const HOOK_API = {
  holdFor,
  speak,
  want,
  startHunt,
  faceSpot(game, npc, name) {
    const p = spotPos(game, name);
    npc._faceTarget = Math.atan2(p.y - npc.y, p.x - npc.x);
  },
  // Look at a spot for s seconds: he turns to it and stands still (holdFor), his head stays on it (no glance
  // starts, a running one ends), then he turns back to the facing he had, unless something turned him meanwhile.
  lookAt(game, npc, name, s) {
    const p = spotPos(game, name);
    const dir = Math.atan2(p.y - npc.y, p.x - npc.x);
    npc._stare = { t: s, dir, back: npc._stare ? npc._stare.back : npc._faceTarget };
    npc._faceTarget = dir;
    npc._gl.hold = 0;
    holdFor(npc, s);
  },
};

function hook(game, name) {
  const b = game.level.behaviours?.[name];
  if (!b) throw new Error(`no behaviour '${name}' in level.behaviours`);
  return b;
}

const runHook = (b) => (game, npc) => b.arrive(game, npc, HOOK_API);

function* hookNames(def, sched) {
  if (def.meetingArrive) yield def.meetingArrive;
  for (const e of sched) {
    if (e.prelude) yield* [].concat(e.prelude);
    if (e.arrive) yield e.arrive;
  }
}

// Is prelude `name` still to walk?
const pending = (game, npc, name) => hook(game, name).pending?.(npc) ?? true;

// The preludes of schedule entry i still to walk, in the entry's order.
function preludes(game, npc, i) {
  const names = npc._schedule[i].prelude;
  return names ? [].concat(names).filter((name) => pending(game, npc, name)) : [];
}

// The plan key for schedule entry i: e<i>, then +<name> for each of its preludes still to walk. Asked for every
// step, so the NPC keeps the last one he built (npc._entryKey) and builds a new one only when it changes.
function entryKey(game, npc, i) {
  const names = npc._schedule[i].prelude;
  if (!names) return `e${i}`; // the common case
  let c = npc._entryKey;
  if (c?.i !== i) c = npc._entryKey = { i, names: [].concat(names), pending: [], key: null };
  let changed = c.key === null;
  c.names.forEach((name, j) => {
    const p = !!pending(game, npc, name);
    if (p !== c.pending[j]) changed = true;
    c.pending[j] = p;
  });
  if (changed) c.key = `e${i}${c.names.filter((_, j) => c.pending[j]).map((name) => `+${name}`).join('')}`;
  return c.key;
}

function tickSayQueue(game, npc, dt) {
  if (!npc._sayQ.length) return;
  for (const q of npc._sayQ) q.t -= dt;
  while (npc._sayQ.length && npc._sayQ[0].t <= 0) {
    const q = npc._sayQ.shift();
    if (npc.active) say(game, npc.id, q.icons, { kind: q.kind, voice: npc.voice, ttl: q.ttl });
  }
}

// Lures start and hunts end (polled from world state, so no event subscriptions leak across loops). A check that
// runs level hooks gets HOOK_API.
function checkOverrides(game, npc, now) {
  for (const m of npc._mechanics) m.kind.check?.(game, npc, m.data, now, HOOK_API);
}

function planKey(game, npc, now) {
  if (npc._gone) return 'gone';
  const m = mechanicOf(game, npc);
  if (m) return m.kind.key(m.data, npc);
  const seq = npc._ovSeq;
  switch (npc.override) {
    case game.level.meeting.override: return `${npc.override}#${seq}`;
    default: return entryKey(game, npc, entryIndex(npc, now));
  }
}

// plan: { key, label, legs[{x, y, face?, arrive?}], li, path, wp, done, pose, vanish, loop, onDone }
function buildPlan(game, npc, now, key) {
  const plan = {
    key, label: key, legs: [], li: 0, path: null, wp: 0, done: false,
    pose: 'stand', vanish: null, loop: false, onDone: null, hurry: false, anim: null,
  };
  if (key === 'gone') {
    plan.done = true;
    plan.label = 'gone';
    return plan;
  }
  const kind = key.split('#')[0];
  const m = mechanicOf(game, npc);
  if (m) {
    m.kind.build(game, npc, plan, m.data);
  } else if (kind === game.level.meeting.override) {
    plan.legs.push(spotLeg(game, npc.meetingSpot));
    plan.pose = 'sit';
    plan.hurry = true;
    plan.onDone = npc._meetingArrive ? runHook(hook(game, npc._meetingArrive)) : null;
    plan.label = `${kind} ${npc.meetingSpot}`;
  } else {
    const i = entryIndex(npc, now);
    const e = npc._schedule[i];
    const pre = preludes(game, npc, i).map((name) => hook(game, name));
    for (const b of pre) plan.legs.push(spotLeg(game, b.spot, { arrive: runHook(b) }));
    if (e.do === 'patrol') plan.legs.push(...game.level.patrols[e.route].map(([x, y]) => ({ x, y })));
    else if (!pre.some((b) => b.spot === e.spot)) {
      plan.legs.push(spotLeg(game, e.spot, e.arrive ? { arrive: runHook(hook(game, e.arrive)) } : {}));
    }
    plan.pose = e.do === 'sit' ? 'sit' : 'stand';
    plan.vanish = e.do === 'away' || e.do === 'leave' ? e.do : null;
    plan.gone = e.do === 'leave' ? e.gone ?? null : null;
    plan.anim = e.anim ?? null;
    plan.label = `${e.do} ${e.spot ?? e.route}`;
  }
  if (plan.done) return plan; // (a door's lockout)
  // Doors: coming in from a door's zone, its NPCs go through the door first.
  for (const d of npc._mechanics) d.kind.prelude?.(game, npc, plan, d.data);
  return plan;
}

function setPlan(game, npc, plan) {
  // An 'away' window ended (or an override pulled them out): reappear where they vanished.
  if (!npc.active && !npc._gone) {
    npc.active = true;
    game.events.emit('npc:appear', { id: npc.id });
  }
  npc._plan = plan;
  npc._look = null;
}

function stepPlan(game, npc, dt) {
  const plan = npc._plan;
  const m = mechanicOf(game, npc);
  if (m) m.kind.tick?.(game, npc, dt, m.data);
  if (npc._look) npc._look.t += dt;
  if (npc._wait > 0) {
    npc._wait = Math.max(0, npc._wait - dt);
    if (npc._wait === 0) npc._look = null;
    if (!plan.done) npc.pose = 'stand';
    return;
  }
  if (plan.done) return;
  if (plan.li >= plan.legs.length) return finishPlan(game, npc, plan); // (empty plan)

  const leg = plan.legs[plan.li];
  if (!plan.path) {
    const tiles = findPath(game.map, npc, leg, 'npc');
    if (tiles) {
      plan.path = smoothPath(game.map, tiles, npc.x, npc.y, 'npc', BODY_R);
    } else {
      npc._navFail++; // shouldn't happen; snap so the day can't stall
      npc.x = leg.x + 0.5;
      npc.y = leg.y + 0.5;
      plan.path = [];
    }
    plan.wp = 0;
  }

  let budget = (plan.hurry ? hurrySpeed(game, npc, plan) : NPC_SPEED) * dt;
  while (budget > 1e-9 && plan.wp < plan.path.length) {
    const p = plan.path[plan.wp];
    const dx = p.x - npc.x;
    const dy = p.y - npc.y;
    const d = Math.hypot(dx, dy);
    if (d > 1e-6) npc._faceTarget = Math.atan2(dy, dx);
    if (d <= budget) {
      npc.x = p.x;
      npc.y = p.y;
      budget -= d;
      plan.wp++;
    } else {
      npc.x += (dx / d) * budget;
      npc.y += (dy / d) * budget;
      budget = 0;
    }
  }
  if (plan.wp < plan.path.length) return;

  // Leg reached.
  plan.li++;
  plan.path = null;
  if (leg.face !== undefined) npc._faceTarget = leg.face;
  if (leg.arrive) leg.arrive(game, npc);
  if (plan.li >= plan.legs.length) {
    if (plan.loop) {
      plan.legs = plan.legs.slice().reverse();
      plan.li = 1; // legs[0] is where we are now
    } else {
      finishPlan(game, npc, plan);
    }
  }
}

// Speed needed to finish the remaining legs by day.meetingAt, clamped to [1, MEETING_HURRY_MAX] x NPC_SPEED.
function hurrySpeed(game, npc, plan) {
  let dist = 0;
  let px = npc.x;
  let py = npc.y;
  for (let i = plan.wp; i < plan.path.length; i++) {
    dist += Math.hypot(plan.path[i].x - px, plan.path[i].y - py);
    px = plan.path[i].x;
    py = plan.path[i].y;
  }
  for (let i = plan.li + 1; i < plan.legs.length; i++) { // later legs: straight-line estimate
    dist += Math.hypot(plan.legs[i].x + 0.5 - px, plan.legs[i].y + 0.5 - py);
    px = plan.legs[i].x + 0.5;
    py = plan.legs[i].y + 0.5;
  }
  const realLeft = (game.level.day.meetingAt - game.clock.minute) / GAME_MIN_PER_SEC - 0.2; // small margin
  const need = realLeft > 0 ? dist / realLeft : Infinity;
  return Math.min(NPC_SPEED * MEETING_HURRY_MAX, Math.max(NPC_SPEED, need));
}

function finishPlan(game, npc, plan) {
  plan.done = true;
  npc.pose = plan.pose;
  if (plan.vanish) {
    npc.active = false;
    npc.glance.offset = 0;
    game.events.emit('npc:vanish', { id: npc.id });
    if (plan.vanish === 'leave') {
      npc._gone = true;
      applyEffect(game, plan.gone);
    }
  }
  if (plan.onDone) plan.onDone(game, npc);
}

// --- Witnesses and the meeting ------------------------------------------------------

// Walking out for the day right now (a schedule 'leave' entry, its preludes included), not yet gone.
// Rules read it (play/disguise.js: whoever sees him go knows he's gone).
export function leaving(npc) {
  return npc.active && !npc._gone && npc._plan?.vanish === 'leave' && !npc._plan.done;
}

// A witness takes their thing back (rules.js: Kev and the coffee).
export function npcTakes(npc, item) {
  npc.carry = item;
  if (npc.wants === item) npc.wants = null;
}

// 4:00: everyone at the table turns to one place, thinks, then says it. The default is the attendance rule: your
// empty chair, 🪑❓ … 😠👉. A level's meeting.verdict can name another (scenario.js):
//   at     a spot name, or 'player' (default: meeting.chair)
//   think  the thought bubble (default ['🪑', '❓']); say  the speech 1 s later (default ['😠', '👉'])
//   line   a sightline kind (fx.js) from each of them to the player, for the beat (optional)
export function stareAt(game, stare = {}) {
  const m = game.level.meeting;
  const c = stare.at === 'player' ? game.player : spotPos(game, stare.at ?? m.chair);
  for (const n of game.npcs) {
    if (!n.active || n.override !== m.override) continue;
    n._faceTarget = Math.atan2(c.y - n.y, c.x - n.x);
    n._gl.hold = 0; // stop any glance: all eyes on the chair
    say(game, n.id, stare.think ?? ['🪑', '❓'], { kind: 'thought', voice: n.voice, ttl: 1.0 });
    npcSayLater(n, 1.0, stare.say ?? ['😠', '👉'], 'speech');
    if (stare.line) sightline(game, n.id, stare.line, 2.0);
  }
}

// --- Facing and glances ---------------------------------------------------------------

// A lookAt running out: he turns back, if he still faces what he looked at.
function tickStare(npc, dt) {
  const st = npc._stare;
  if (!st) return;
  st.t -= dt;
  if (st.t > 0) return;
  if (npc._faceTarget === st.dir) npc._faceTarget = st.back;
  npc._stare = null;
}

function updateFacing(npc, dt) {
  const want = heardFacing(npc) ?? npc._faceTarget; // a noise turns him (mechanics/attention.js)
  const d = angleDiff(want, npc.dir);
  const step = TURN_RATE * dt;
  npc.dir = angleDiff(Math.abs(d) <= step ? want : npc.dir + Math.sign(d) * step, 0);
}

function updateGlance(npc, dt) {
  const g = npc._gl;
  tickStare(npc, dt);
  const can = npc.active && !npc.moving && !npc._look && !npc._heard && !npc._stare;

  // Fixed timeline: the rng is drawn at every timer expiry whether or not the glance is shown.
  g.timer -= dt;
  if (g.timer <= 0) {
    const ang = npc.rng.range(GLANCE_ANGLE[0], GLANCE_ANGLE[1]);
    const side = npc.rng.chance(0.5) ? 1 : -1;
    g.timer += npc.rng.range(...npc._glanceEvery);
    if (can) {
      g.target = side * ang;
      g.hold = GLANCE_TURN_TIME + GLANCE_HOLD; // turn in, then fully turned for GLANCE_HOLD
      g.speed = ang / GLANCE_TURN_TIME;
    }
  }
  if (g.hold > 0) {
    g.hold -= dt;
    if (g.hold <= 0 || !can) g.hold = 0;
  }

  let target = g.hold > 0 ? g.target : 0;
  let speed = g.speed || GLANCE_ANGLE[1] / GLANCE_TURN_TIME;
  if (npc._look) {
    const { t, angle } = npc._look;
    target = t < LOOK_RIGHT ? angle : t < LOOK_LEFT ? -angle : 0;
    speed = angle / LOOK_TURN;
  }
  if (npc.moving || !npc.active) target = 0;
  const heard = heardHead(npc); // a noise holds his head (mechanics/attention.js)
  if (heard) ({ target, speed } = heard);
  const o = npc.glance.offset;
  const d = target - o;
  const step = speed * dt;
  npc.glance.offset = Math.abs(d) <= step ? target : o + Math.sign(d) * step;
}
