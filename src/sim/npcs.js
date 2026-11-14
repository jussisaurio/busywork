// NPC simulation: schedule execution, walking, smooth turning, glances, and the five
// sim overrides from CONTRACTS.md (Kev repairs, jacket/keycard, lockout, sandwich hunt, meeting).
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
  SEED, NPC_SPEED, GAME_MIN_PER_SEC, VISION, KEV_FIX_MIN, MEETING_AT, at,
  GLANCE_EVERY, GLANCE_EVERY_BY, GLANCE_ANGLE, GLANCE_HOLD, GLANCE_TURN_TIME,
} from '../config.js';
import { MEETING_GATHER_AT } from '../levels/meeting/cast.js';
import { DIRS, angleDiff } from '../core/vision.js';
import { createRng } from '../core/rng.js';
import { say, shake } from '../core/fx.js';
import { spotPos, inZone } from '../game/perception.js';
import { findPath, smoothPath } from './nav.js';

// --- Tunables ------------------------------------------------------------------
const TURN_RATE = 9; // body turn speed (rad/s)
const BODY_R = 0.3; // half-size of the body box kept clear of solid tiles when smoothing paths
const HUNT_END = at('3:24'); // Lin gives up hunting for her sandwich (covers the boss's restroom walk)
const HUNT_LOOK = 1.25; // rad: head sweep at each hunt waypoint (~72 deg each side)
const HUNT_LOOK_TIME = 1.4; // s paused at each hunt waypoint (look right, look left, back)
const HUNT_SHOCK_TIME = 1.8; // s standing at the empty fridge before the hunt starts
const KEV_REACT_TIME = 0.4; // s between 🔧❗ and Kev setting off
const JACKET_TIME = 0.8; // s the boss spends at the coat rack
const POUR_TIME = 1.0; // s Kev spends pouring the day's cup
const EMPTY_POT_TIME = 1.6; // s Kev stares at the empty pot
const SANDWICH_TIME = 0.6; // s Lin spends taking her sandwich out of the fridge
const BANGS = [['😠', '🚪', '🪪'], ['🪪', '❓'], ['👊', '🚪']]; // cycled (deterministic)
const BANG_EVERY = [2.5, 2.2, 2.8]; // s until the next bang, cycled alongside BANGS
const FIRST_BANG = 0.8; // s after the door doesn't open
// Walking to the meeting, NPCs speed up just enough to be seated by MEETING_AT when the walk from where they
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

const nextNonSay = (sched, i) => {
  for (let j = i + 1; j < sched.length; j++) if (sched[j].do !== 'say') return j;
  return -1;
};

export function createNpcs(game) {
  const now = game.clock ? game.clock.minute : 0;
  return game.level.cast.map((def) => createNpc(game, def, now));
}

// One NPC as the sim builds it at game minute `now` (test fakes come from here too, so they carry the
// private fields). The schedule is copied: tests edit the level's cast, and NPCs must not see that mid-day.
export function createNpc(game, def, now = 0) {
  const sched = def.schedule.map((e) => ({ ...e }));
  const first = sched.find((e) => e.spot);
  const p = spotPos(game, first.spot);
  const rng = createRng((SEED ^ hash(def.id)) >>> 0);
  const fridgeIdx = sched.findIndex((e) => e.do !== 'say' && e.spot === 'fridge');
  return {
    id: def.id,
    icon: def.icon,
    color: def.color,
    voice: def.voice,
    meetingSpot: def.meetingSpot,
    x: p.x,
    y: p.y,
    dir: p.dir,
    glance: { offset: 0 },
    vision: { ...(VISION[def.id] ?? VISION.default) },
    active: true,
    pose: first.do === 'sit' ? 'sit' : 'stand',
    moving: false,
    override: null,
    hasJacket: false,
    carry: null, // null | 'coffee' (Kev, once he has the day's cup)
    wants: null, // null | 'coffee': Kev found the pot empty, and now he knows someone has his cup
    label: `${first.do} ${first.spot}`,
    rng,
    // --- private sim state ---
    _schedule: sched,
    _said: sched.map((e) => e.do === 'say' && e.at < now), // schedule 'say' entries fire once
    _fridgeIdx: fridgeIdx, // Lin: the fridge visit...
    _fridgeNext: fridgeIdx >= 0 ? nextNonSay(sched, fridgeIdx) : -1, // ...and the entry after it
    _smokeIdx: sched.findIndex((e) => e.do !== 'say' && e.spot === 'smoke'), // boss: jacket first
    _plan: null,
    _wait: 0, // s to stand still before continuing the plan
    _sayQ: [], // delayed bubbles: { t, icons, kind }
    _faceTarget: p.dir,
    _look: null, // hunt look-around: { t }
    _gone: false, // left for the day
    _fridgeChecked: false,
    _gathered: false, // the 3:54 gather has been processed for this NPC
    _ovSeq: 0, // bumped whenever an override starts, so a repeated override gets a fresh plan
    _reacted: false, // boss meeting reaction done
    _bangT: 0,
    _bangI: 0,
    _navFail: 0, // unreachable destinations (should stay 0; the test checks)
    _gl: { timer: rng.range(...glanceEvery(def.id)), target: 0, hold: 0, speed: 0 },
  };
}

// A speech bubble `t` seconds from now, queued behind any already waiting.
export function npcSayLater(npc, t, icons, kind) {
  npc._sayQ.push({ t, icons, kind });
}

export function updateNpcs(game, dt) {
  const now = game.clock.minute;
  const npcs = game.npcs;

  // 5. Meeting gather, once per loop. The flag lives on the NPCs, so a new loop starts clean.
  if (now >= MEETING_GATHER_AT && npcs.length && !npcs.some((n) => n._gathered)) {
    for (const n of npcs) {
      n._gathered = true;
      // Kev finishes a repair first (endOverride sends him to the meeting afterwards).
      if (n._gone || n.override === 'lockedOut' || n.override === 'alerted' || n.override === 'fixing') continue;
      setOverride(n, 'meeting');
    }
    game.events.emit('meeting:gather', {});
  }

  for (const npc of npcs) updateNpc(game, npc, dt, now);
}

function updateNpc(game, npc, dt, now) {
  fireScheduleSays(game, npc, now);
  tickSayQueue(game, npc, dt);
  crave(game, npc, dt);
  checkOverrides(game, npc, now);

  const key = planKey(npc, now);
  if (!npc._plan || npc._plan.key !== key) setPlan(game, npc, buildPlan(game, npc, now, key));

  const px = npc.x;
  const py = npc.y;
  stepPlan(game, npc, dt);
  npc.moving = npc.x !== px || npc.y !== py;
  if (npc.moving && !npc._plan.done) npc.pose = 'walk'; // (the arrival step keeps finishPlan's pose)
  updateFacing(npc, dt);
  updateGlance(npc, dt);
  npc.label = npc.override === 'fixing'
    ? `fixing ${Math.round(game.world.fixProgress * 100)}%`
    : npc._plan.label;
}

// --- Schedule ---------------------------------------------------------------------

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

// Kev without his afternoon coffee: a yawn and a ☕ daydream every few seconds, until he gets one.
// It's the setup for the grab: a desperate man sees your cup.
const CRAVE_FIRST = 4; // s after the 😩 at the empty pot
const CRAVE_EVERY = 6;
function crave(game, npc, dt) {
  if (npc.wants !== 'coffee' || !npc.active || npc.override === 'fixing') return;
  npc._craveT = (npc._craveT ?? CRAVE_FIRST) - dt;
  if (npc._craveT > 0) return;
  npc._craveT = CRAVE_EVERY;
  say(game, npc.id, ['🥱', '☕'], { kind: 'thought', voice: npc.voice, ttl: 1.4 });
}

function tickSayQueue(game, npc, dt) {
  if (!npc._sayQ.length) return;
  for (const q of npc._sayQ) q.t -= dt;
  while (npc._sayQ.length && npc._sayQ[0].t <= 0) {
    const q = npc._sayQ.shift();
    if (npc.active) say(game, npc.id, q.icons, { kind: q.kind, voice: npc.voice });
  }
}

function setOverride(npc, ov) {
  npc.override = ov;
  npc._ovSeq++;
}

// Leaving an override: resume whatever the schedule says now (or the meeting after 3:54).
function endOverride(npc) {
  if (npc._gathered && !npc._gone) setOverride(npc, 'meeting');
  else npc.override = null;
  npc._look = null;
}

function checkOverrides(game, npc, now) {
  const w = game.world;
  // 1. Kev repairs (polled from world state, so no event subscriptions leak across loops).
  if (npc.id === 'kev' && npc.active && !npc._gone && w.projector === 'broken'
      && npc.override !== 'alerted' && npc.override !== 'fixing') {
    setOverride(npc, 'alerted');
    npc._wait = Math.max(npc._wait, KEV_REACT_TIME);
    say(game, npc.id, ['🔧', '❗'], { kind: 'alert', voice: npc.voice });
    game.events.emit('kev:alerted', {});
  }
  // 4. Lin stops hunting at 3:24, as soon as she has her sandwich back, or when she knows who ate it.
  if (npc.override === 'hunting' && (now >= HUNT_END || w.sandwich === 'lin' || w.linKnows)) {
    say(game, npc.id, ['😤'], { kind: 'speech', voice: npc.voice });
    endOverride(npc);
  }
}

// Special prelude legs for a schedule entry.
function entryFlags(npc, i) {
  return {
    // Lin must actually open the fridge, even if her 3:04 entry starts while she's still walking.
    fridge: npc._fridgeIdx >= 0 && !npc._fridgeChecked && (i === npc._fridgeIdx || i === npc._fridgeNext),
    // The boss collects his jacket on his way out for a smoke.
    jacket: npc._smokeIdx >= 0 && i === npc._smokeIdx && !npc.hasJacket,
  };
}

function planKey(npc, now) {
  if (npc._gone) return 'gone';
  const seq = npc._ovSeq;
  switch (npc.override) {
    case 'lockedOut': return 'lockout';
    case 'alerted':
    case 'fixing': return `fix#${seq}`; // alerted -> fixing keeps the same plan
    case 'hunting': return `hunt#${seq}`;
    case 'meeting': return `meeting#${seq}`;
    default: {
      const i = entryIndex(npc, now);
      const f = entryFlags(npc, i);
      return `e${i}${f.fridge ? 'F' : ''}${f.jacket ? 'J' : ''}`;
    }
  }
}

const spotLeg = (game, name, extra = {}) => {
  const s = game.level.spots[name];
  return { x: s.x, y: s.y, face: DIRS[s.face], name, ...extra };
};

// plan: { key, label, legs[{x, y, face?, arrive?}], li, path, wp, done, pose, vanish, loop, onDone }
function buildPlan(game, npc, now, key) {
  const plan = {
    key, label: key, legs: [], li: 0, path: null, wp: 0, done: false,
    pose: 'stand', vanish: null, loop: false, onDone: null, hurry: false,
  };
  if (key === 'gone' || key === 'lockout') {
    plan.done = true;
    plan.label = key === 'gone' ? 'gone' : 'locked out';
    return plan;
  }
  const kind = key.split('#')[0];
  if (kind === 'fix') {
    plan.legs.push(spotLeg(game, 'projector', { arrive: kevArrive }));
    plan.label = 'fix projector';
  } else if (kind === 'hunt') {
    plan.legs = game.level.patrols.lin_hunt.map(([x, y]) => ({ x, y, arrive: huntLook }));
    plan.loop = true; // back and forth until the override ends
    plan.label = 'hunt sandwich';
  } else if (kind === 'meeting') {
    plan.legs.push(spotLeg(game, npc.meetingSpot));
    plan.pose = 'sit';
    plan.hurry = true;
    plan.onDone = meetingArrive;
    plan.label = `meeting ${npc.meetingSpot}`;
  } else {
    const i = entryIndex(npc, now);
    const e = npc._schedule[i];
    const f = entryFlags(npc, i);
    if (f.fridge) plan.legs.push(spotLeg(game, 'fridge', { arrive: linFridge }));
    if (f.jacket) plan.legs.push(spotLeg(game, 'coat_rack', { arrive: bossJacket }));
    if (e.do === 'patrol') plan.legs.push(...game.level.patrols[e.route].map(([x, y]) => ({ x, y })));
    else if (!(f.fridge && e.spot === 'fridge')) {
      plan.legs.push(spotLeg(game, e.spot, e.spot === 'coffee' ? { arrive: coffeeArrive } : {}));
    }
    plan.pose = e.do === 'sit' ? 'sit' : 'stand';
    plan.vanish = e.do === 'away' || e.do === 'leave' ? e.do : null;
    plan.label = `${e.do} ${e.spot ?? e.route}`;
  }
  // 3. Lockout check: the boss coming in from the lobby must get through the glass door first.
  // (Only when heading inside, so walking out through door_out never triggers it.)
  const inLobby = npc.id === 'boss' && inZone(game, 'outside', npc.x, npc.y);
  if (inLobby && plan.legs.length && !inZone(game, 'outside', plan.legs[0].x, plan.legs[0].y)) {
    plan.legs.unshift(spotLeg(game, 'door_out', { arrive: bossDoorCheck }));
  }
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
  if (npc.override === 'fixing') tickFix(game, npc, dt);
  if (npc.override === 'lockedOut') tickBang(game, npc, dt);
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

// Speed needed to finish the remaining legs by MEETING_AT, clamped to [1, MEETING_HURRY_MAX] x NPC_SPEED.
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
  const realLeft = (MEETING_AT - game.clock.minute) / GAME_MIN_PER_SEC - 0.2; // small margin
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
      if (npc.id === 'kev') {
        game.world.kevGone = true;
        game.events.emit('kev:left', {});
      }
    }
  }
  if (plan.onDone) plan.onDone(game, npc);
}

// --- Override behaviours (leg arrival callbacks and per-step ticks) -------------------

// 1. Kev at the projector.
function kevArrive(game, npc) {
  const w = game.world;
  if (w.projector !== 'broken') return endOverride(npc);
  npc.override = 'fixing'; // same episode as 'alerted': no _ovSeq bump, keep the plan
  w.projector = 'fixing';
  w.fixProgress = 0;
  game.events.emit('projector:fixing', {});
}

function tickFix(game, npc, dt) {
  const w = game.world;
  if (w.projector !== 'fixing') return endOverride(npc);
  w.fixProgress = Math.min(1, w.fixProgress + (dt * GAME_MIN_PER_SEC) / KEV_FIX_MIN);
  if (w.fixProgress >= 1 - 1e-9) {
    w.projector = 'ok';
    w.fixProgress = 0;
    game.events.emit('projector:fixed', {});
    say(game, npc.id, ['👍'], { kind: 'speech', voice: npc.voice });
    endOverride(npc); // resumes the schedule: he still goes home, just later
  }
}

// 2. Boss at the coat rack.
function bossJacket(game, npc) {
  const w = game.world;
  w.jacket = 'boss';
  npc.hasJacket = true;
  if (w.keycard === 'rack') w.keycard = 'boss';
  npc._wait = Math.max(npc._wait, JACKET_TIME);
  game.events.emit('boss:jacket', {});
}

// 3. Boss reaches the glass door from outside.
function bossDoorCheck(game, npc) {
  const w = game.world;
  if (w.keycard === 'boss') return; // badge in, carry on
  setOverride(npc, 'lockedOut');
  w.bossLockedOut = true;
  npc._faceTarget = DIRS.N;
  npc.pose = 'stand';
  npc._bangT = FIRST_BANG;
  game.events.emit('boss:lockedOut', {});
}

function tickBang(game, npc, dt) {
  npc._bangT -= dt;
  if (npc._bangT > 0) return;
  const i = npc._bangI++ % BANGS.length;
  say(game, npc.id, BANGS[i], { kind: 'speech', voice: npc.voice });
  game.events.emit('boss:bang', {});
  shake(game, 0.12, 0.25);
  npc._bangT += BANG_EVERY[i];
}

// 4. Lin opens the fridge.
function linFridge(game, npc) {
  const w = game.world;
  npc._fridgeChecked = true;
  if (w.sandwich === 'fridge' || w.sandwich === 'lin') {
    w.sandwich = 'lin';
    npc._wait = Math.max(npc._wait, SANDWICH_TIME);
    return;
  }
  game.events.emit('sandwich:missing', {});
  say(game, npc.id, ['🥪', '❓'], { kind: 'thought', voice: npc.voice, ttl: 1.4 });
  npcSayLater(npc, 1.4, ['😠'], 'speech');
  setOverride(npc, 'hunting');
  npc._wait = Math.max(npc._wait, HUNT_SHOCK_TIME);
}

// 6. The coffee pot holds one cup a day. Whoever gets there first has it.
function coffeeArrive(game, npc) {
  const w = game.world;
  if (w.coffee === 'pot' && !npc.carry) {
    w.coffee = 'taken';
    npc.carry = 'coffee';
    npc._wait = Math.max(npc._wait, POUR_TIME);
    game.events.emit('coffee:taken', { by: npc.id });
    return;
  }
  if (npc.carry) return;
  npc.wants = 'coffee';
  npc._craveT = CRAVE_FIRST;
  say(game, npc.id, ['☕', '❓'], { kind: 'thought', voice: npc.voice, ttl: 1.2 });
  npcSayLater(npc, 1.2, ['😩'], 'speech');
  npc._wait = Math.max(npc._wait, EMPTY_POT_TIME);
  game.events.emit('coffee:missing', { by: npc.id });
}

// A witness takes their thing back (rules.js: Kev and the coffee).
export function npcTakes(npc, item) {
  npc.carry = item;
  if (npc.wants === item) npc.wants = null;
}

// 4:00, attendance rule: everyone at the table turns to your empty chair. 🪑❓ … 😠👉
export function stareAtEmptyChair(game) {
  const c = spotPos(game, 'meeting_player');
  for (const n of game.npcs) {
    if (!n.active || n.override !== 'meeting') continue;
    n._faceTarget = Math.atan2(c.y - n.y, c.x - n.x);
    n._gl.hold = 0; // stop any glance: all eyes on the chair
    say(game, n.id, ['🪑', '❓'], { kind: 'thought', voice: n.voice, ttl: 1.0 });
    npcSayLater(n, 1.0, ['😠', '👉'], 'speech');
  }
}

function huntLook(game, npc) {
  npc._look = { t: 0 };
  npc._wait = Math.max(npc._wait, HUNT_LOOK_TIME);
}

// 5. Arrival at the meeting seat.
function meetingArrive(game, npc) {
  if (npc.id !== 'boss' || npc._reacted) return;
  npc._reacted = true;
  if (game.world.projector !== 'ok') {
    say(game, npc.id, ['📽️', '💥', '🤷'], { kind: 'speech', voice: npc.voice });
  } else {
    const p = spotPos(game, 'meeting_presenter'); // looks expectantly at where the presenter stands
    npc._faceTarget = Math.atan2(p.y - npc.y, p.x - npc.x);
    say(game, npc.id, ['📊', '👀'], { kind: 'speech', voice: npc.voice });
  }
}

// --- Facing and glances ---------------------------------------------------------------

const glanceEvery = (id) => GLANCE_EVERY_BY[id] ?? GLANCE_EVERY;

function updateFacing(npc, dt) {
  const d = angleDiff(npc._faceTarget, npc.dir);
  const step = TURN_RATE * dt;
  npc.dir = angleDiff(Math.abs(d) <= step ? npc._faceTarget : npc.dir + Math.sign(d) * step, 0);
}

function updateGlance(npc, dt) {
  const g = npc._gl;
  const can = npc.active && !npc.moving && !npc._look;

  // Fixed timeline: the rng is drawn at every timer expiry whether or not the glance is shown.
  g.timer -= dt;
  if (g.timer <= 0) {
    const ang = npc.rng.range(GLANCE_ANGLE[0], GLANCE_ANGLE[1]);
    const side = npc.rng.chance(0.5) ? 1 : -1;
    g.timer += npc.rng.range(...glanceEvery(npc.id));
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
    const t = npc._look.t;
    target = t < 0.55 ? HUNT_LOOK : t < 1.1 ? -HUNT_LOOK : 0;
    speed = HUNT_LOOK / 0.2;
  }
  if (npc.moving || !npc.active) target = 0;
  const o = npc.glance.offset;
  const d = target - o;
  const step = speed * dt;
  npc.glance.offset = Math.abs(d) <= step ? target : o + Math.sign(d) * step;
}
