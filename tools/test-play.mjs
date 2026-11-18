// Headless gameplay tests (player, interactions, rules, scenario, input).
// Does NOT run the NPC sim: NPCs come from the sim's createNpc but are placed by hand, and the tick is
// stepped here in contract order: player -> interactions -> [npcs skipped] -> rules -> scenario -> clock
// (loop.js advanceClock).
//
//   node tools/test-play.mjs
import {
  FIXED_DT, GAME_MIN_PER_SEC, CAUGHT_DELAY, WORK_PENALTY_MIN,
  PLAYER_RADIUS, PLAYER_SPEED, PLAYER_BUSY_SPEED, SUSPICION_FILL_SEC, HOLD_TIME, MARKS,
} from '../src/config.js';
import { createHarness, observe } from '../src/agent/harness.js';
import { fixShot } from './press-stops.mjs';
import { getLevel } from '../src/levels/index.js';
import { createGame, resetLoop } from '../src/state.js';
import { createRng } from '../src/core/rng.js';
import { DIRS } from '../src/core/vision.js';
import { spotPos } from '../src/game/perception.js';
import { updatePlayer } from '../src/play/player.js';
import { updateInteractions } from '../src/play/interactions.js';
import { updateRules, NOTICE, SCENE_RADIUS } from '../src/play/rules.js';
import { updateScenario, END_BEAT } from '../src/play/scenario.js';
import { advanceClock } from '../src/game/loop.js';
import { createNpc } from '../src/sim/npcs.js';
import { createInput } from '../src/play/input.js';

let fails = 0;
let passes = 0;
const ok = (c, m) => {
  if (c) { passes++; console.log('ok  ', m); } else { fails++; console.log('FAIL', m); }
};
const section = (name) => console.log(`\n# ${name}`);
const near = (a, b, eps = 1e-3) => Math.abs(a - b) <= eps;

// --- Scripted fake input ------------------------------------------------------------
function createFakeInput() {
  const down = new Set();
  const queue = new Map(); // action -> age (sim seconds)
  let steer = null;
  return {
    hold(...a) { for (const x of a) down.add(x); },
    release(...a) { for (const x of a) down.delete(x); },
    clear() { down.clear(); queue.clear(); steer = null; },
    press(a) { queue.set(a, 0); },
    steer(x, y) {
      if (x === null) { steer = null; return; }
      const l = Math.hypot(x, y);
      steer = l ? { x: x / l, y: y / l } : null;
    },
    age(dt) { for (const [a, t] of queue) { if (t + dt > 0.2) queue.delete(a); else queue.set(a, t + dt); } },
    isDown: (a) => down.has(a),
    pressed(a) { if (!queue.has(a)) return false; queue.delete(a); return true; },
    axis() {
      if (steer) return steer;
      const x = (down.has('right') ? 1 : 0) - (down.has('left') ? 1 : 0);
      const y = (down.has('down') ? 1 : 0) - (down.has('up') ? 1 : 0);
      if (!x && !y) return { x: 0, y: 0 };
      const l = Math.hypot(x, y);
      return { x: x / l, y: y / l };
    },
    destroy() {},
  };
}

// --- Harness ------------------------------------------------------------------------
const input = createFakeInput();
const game = createGame({ input });
const MEETING_AT = game.level.day.meetingAt;
const VISION = Object.fromEntries(game.level.cast.map((d) => [d.id, d.vision])); // each cast member's own
const log = [];
game.events.on('*', (name, payload) => log.push({ name, payload, t: game.loopTime }));
// The boss's office is private in level 1 (roles.private): most sections stage the engine inside it, so it is off
// until the trespass section below puts it back.
const PRIVATE = game.level.roles.private;
delete game.level.roles.private;
const evs = (name) => log.filter((e) => e.name === name);
const p = () => game.player;

function fakeNpc(id, spot, extra = {}) {
  const s = spotPos(game, spot);
  return Object.assign(createNpc(game, game.level.cast.find((d) => d.id === id)), {
    x: s.x, y: s.y, dir: s.dir, pose: 'sit', label: 'fake',
    ...extra,
  });
}

// An owner who walks over for his thing (an item with `walk`, sim/mechanics/claim.js): the sim is skipped here, so
// the test starts his walk and puts him at your elbow.
function walksOver(npc) {
  const c = npc._claim;
  if (!c || c.started) return false;
  c.started = true;
  c.was = npc.override;
  npc.x = p().x;
  npc.y = p().y + 1;
  run(0.1);
  return true;
}

// Equivalent of loop.startLoop without the sim.
function newDay(npcs = [], minute = 0) {
  resetLoop(game);
  input.clear();
  log.length = 0;
  game.npcs = npcs;
  game.persist.loop += 1;
  game.phase = 'day';
  game.clock.minute = minute;
}

function circleClear(x, y, r = PLAYER_RADIUS - 1e-4) {
  for (let ty = Math.floor(y - r); ty <= Math.floor(y + r); ty++) {
    for (let tx = Math.floor(x - r); tx <= Math.floor(x + r); tx++) {
      if (game.map.isWalkable(tx, ty, 'player')) continue;
      const cx = Math.max(tx, Math.min(x, tx + 1));
      const cy = Math.max(ty, Math.min(y, ty + 1));
      if (Math.hypot(x - cx, y - cy) < r) return false;
    }
  }
  return true;
}

let violations = 0;
function step(n = 1) {
  for (let i = 0; i < n; i++) {
    if (game.phase !== 'day') return;
    updatePlayer(game, FIXED_DT);
    updateInteractions(game, FIXED_DT);
    // updateNpcs skipped: fake NPCs stay where the test puts them.
    updateRules(game, FIXED_DT);
    updateScenario(game, FIXED_DT);
    advanceClock(game, FIXED_DT);
    input.age(FIXED_DT);
    if (!circleClear(p().x, p().y)) violations++;
  }
}
const run = (sec) => step(Math.round(sec / FIXED_DT));
// Hold E standing still until the hold verb fires (eating), then let go.
function holdE() {
  input.press('interact');
  input.hold('interact');
  run(HOLD_TIME + 0.05);
  input.release('interact');
}

// Steer through waypoints (tile-unit points). Returns false if stuck / interrupted.
function walk(path, { busy = false, maxSec = 20 } = {}) {
  if (busy) input.hold('busy');
  let okk = true;
  outer: for (const [tx, ty] of path) {
    let t = 0;
    while (Math.hypot(tx - p().x, ty - p().y) > 0.06) {
      input.steer(tx - p().x, ty - p().y);
      step();
      t += FIXED_DT;
      if (t > maxSec || game.phase !== 'day' || p().locked) { okk = false; break outer; }
    }
  }
  input.steer(null);
  if (busy) input.release('busy');
  return okk;
}

function place(x, y) {
  p().x = x;
  p().y = y;
  p().seated = false;
}

// Routes through the office (tile centres).
const DESK = [13.5, 9.5];
const DESK_TO_COFFEE = [[24.5, 9.5], [24.5, 7.5], [23.5, 7.5], [23.5, 5.5], [22.5, 2.5]];
const COFFEE_TO_PROJECTOR = [[23.5, 5.5], [23.5, 7.5], [14.5, 7.5], [14.5, 5.5], [17.5, 5.5], [17.5, 2.5], [13.5, 2.5]];
const DESK_TO_RACK = [[6.5, 9.5], [6.5, 5.5], [6.5, 1.5], [2.5, 1.5]];
const RACK_TO_DESK = [[6.5, 1.5], [6.5, 5.5], [6.5, 9.5], DESK];
const DESK_TO_FRIDGE = [[24.5, 9.5], [24.5, 7.5], [23.5, 7.5], [23.5, 5.5], [20.5, 2.5]];

// =====================================================================================
section('walking + collision');
{
  newDay();
  ok(p().seated && near(p().x, 13.5) && near(p().y, 9.5), 'starts seated at the desk');
  violations = 0;
  ok(walk(DESK_TO_COFFEE), 'walks desk -> coffee machine');
  ok(violations === 0, 'never overlaps a solid tile on the way');
  ok(!p().seated && evs('player:stand').length === 1, 'movement stood the player up (player:stand once)');
  step();
  ok(p().focus?.id === 'coffee_machine' && p().focus.action === 'brew_coffee' && p().focus.icon === undefined, 'focus = coffee machine: brew_coffee (no icon: it lights up)');

  // Glass wall of the boss office (row 6).
  place(3.5, 7.5);
  input.hold('up'); run(1); input.release('up');
  ok(p().y >= 7.3 - 1e-3 && p().y < 7.31, `glass blocks (y=${p().y.toFixed(3)})`);
  // Sliding: push diagonally into the glass -> slides east.
  place(3.5, 7.5);
  input.hold('up', 'right'); run(0.4); input.release('up', 'right');
  ok(p().x > 4.5 && p().y >= 7.299 && p().y < 7.31, `slides along the wall (x=${p().x.toFixed(2)}, y=${p().y.toFixed(3)})`);
  // The entrance L lets NPCs through, not the player.
  place(4.5, 12.5);
  input.hold('down'); run(1); input.release('down');
  ok(p().y <= 12.7 + 1e-3, `entrance L blocks the player (y=${p().y.toFixed(3)})`);
  ok(game.map.isWalkable(4, 13, 'npc') && !game.map.isWalkable(4, 13, 'player'), 'L walkable for npc only');

  // Fuzz: random 8-way walking for 60 s never ends up inside geometry or outside the office.
  newDay();
  const rng = createRng(7);
  violations = 0;
  let escaped = false;
  const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  for (let i = 0; i < 200; i++) {
    const [dx, dy] = rng.pick(dirs);
    input.steer(dx, dy);
    run(0.3);
    if (p().y > 13 || p().x < 1 || p().x > 29 || p().y < 1) escaped = true;
  }
  input.steer(null);
  ok(violations === 0, 'fuzz: 60 s of random walking, never inside a solid tile');
  ok(!escaped, 'fuzz: never left the office floor');
}

section('brew -> carry -> spill');
{
  newDay();
  walk(DESK_TO_COFFEE);
  step();
  input.press('interact');
  step();
  ok(p().action?.type === 'brew_coffee' && evs('action:start').length === 1, 'brew starts (action:start)');
  run(0.5);
  ok(p().action && p().action.t > 0.45 && !p().held, 'action.t counts up while brewing');
  run(0.6);
  ok(p().held === 'coffee' && !p().action, 'brewed: holding coffee');
  ok(evs('action:done').some((e) => e.payload.type === 'brew_coffee'), 'action:done brew_coffee');
  ok(game.world.coffee === 'taken' && evs('coffee:taken')[0]?.payload.by === 'player', "one cup: world.coffee 'taken', coffee:taken {by:'player'}");
  input.press('interact'); step(); // drop it at the machine
  step();
  ok(p().focus?.id !== 'coffee_machine', 'empty pot: the machine offers nothing');
  input.press('interact'); run(0.4); // pick it back up
  ok(p().held === 'coffee', 'picked the cup back up');
  input.hold('busy'); step();
  ok(p().busy && p().busyPose === 'phone', 'the full cup to your ear like a phone (level 1)');
  input.release('busy'); step();
  // A bulky thing (pinned on the cup here: player.js reads the flag live) leaves no hand for a phone.
  game.level.items.coffee.bulky = true;
  input.hold('busy'); step();
  ok(!p().busy && p().busyPose === null, 'a bulky thing in hand: busy gives no phone pose');
  input.release('busy'); step();
  delete game.level.items.coffee.bulky;
  violations = 0;
  ok(walk(COFFEE_TO_PROJECTOR), 'carries coffee to the projector');
  ok(violations === 0, 'no wall overlap on the way');
  step();
  ok(p().focus?.id === 'projector' && p().focus.action === 'spill_coffee', 'focus = projector: spill_coffee');
  input.press('interact');
  step();
  ok(p().action?.type === 'spill_coffee' && p().action.sneaky, 'spill is a sneaky action');
  run(1.3);
  ok(game.world.projector === 'broken' && p().held === 'mug' && game.world.mug === 'player', 'projector broken, the empty mug in hand (level 1: evidence)');
  ok(evs('projector:broken').length === 1, 'projector:broken emitted once');
  ok(game.fx.particles.some((q) => q.kind === 'sparks') && game.fx.particles.some((q) => q.kind === 'puff'), 'sparks + puff burst');
  step();
  ok(p().focus === null, 'no focus at a broken projector with the mug (kept: no drop; no put spot here)');
}

section('cancel on movement, drop / pick-up, E while busy');
// The cup keeps (`keep`): it goes down only on a spot, here the machine. (Drop at the feet: the keycard, below.)
{
  newDay();
  walk(DESK_TO_COFFEE);
  step();
  input.press('interact');
  run(0.5);
  input.hold('left'); step(); input.release('left');
  ok(!p().action && !p().held, 'moving cancels the brew');
  ok(evs('action:cancel').some((e) => e.payload.reason === 'moved' && e.payload.type === 'brew_coffee'), "action:cancel {reason:'moved'}");

  walk([[22.5, 2.5]]);
  input.hold('busy');
  step();
  ok(p().busy && p().busyPose === 'phone', 'standing + busy = phone pose');
  input.press('interact');
  step();
  ok(p().action?.type === 'brew_coffee' && !p().busy && p().busyPose === null, 'E while busy starts the action, busy pose dropped');
  run(1.1);
  step();
  ok(p().held === 'coffee' && p().busy && p().busyPose === 'phone', 'busy pose resumes after the action (coffee to the ear)');
  input.release('busy');
  step();

  ok(p().focus?.action === 'put', 'holding coffee at the machine: focus = put it back (no drop: the cup keeps)');
  input.press('interact');
  step();
  const items = game.world.items;
  ok(!p().held && items.length === 1 && items[0].type === 'coffee' && items[0].spot === 'coffee', 'the cup set down on the machine');
  ok(evs('item:put').some((e) => e.payload.type === 'coffee' && e.payload.spot === 'coffee'), "item:put {type:coffee, spot:'coffee'}");
  step();
  ok(p().focus?.kind === 'item' && p().focus.icon === '✋', 'floor item beats the farther coffee machine (✋)');
  input.press('interact');
  run(0.4);
  ok(p().held === 'coffee' && game.world.items.length === 0, 'picked the coffee back up');
  ok(evs('item:pickup').some((e) => e.payload.type === 'coffee'), 'item:pickup {type:coffee}');

  // Spamming E doesn't chain actions (press during an action is swallowed).
  input.press('interact'); step(); // drop
  input.press('interact'); step(); // pick up starts
  input.press('interact');         // pressed during pick-up: must not drop right after
  run(0.5);
  ok(p().held === 'coffee', 'E pressed mid-action is swallowed (no instant re-drop)');
}

section('keycard: steal behind the boss (facing S)');
{
  const boss = fakeNpc('boss', 'boss_desk');
  newDay([boss]);
  ok(walk(DESK_TO_RACK, { busy: true }), 'folder-stride into the boss office');
  ok(game.suspicion.boss === 0 && evs('boss:suspicious').length === 0, 'busy stride: no suspicion');
  step();
  ok(p().focus?.id === 'coat_rack' && p().focus.action === 'take_keycard', 'focus = coat rack: take_keycard');
  input.press('interact');
  run(1.1);
  ok(p().held === 'keycard' && game.world.keycard === 'player', 'keycard taken');
  ok(evs('keycard:taken').length === 1 && !game.caught, 'keycard:taken, not caught');
  // Drop / pick up the keycard behind his back.
  input.press('interact'); step();
  ok(game.world.keycard === 'dropped' && !p().held && game.world.items[0]?.type === 'keycard', "dropped keycard -> 'dropped' floor item");
  input.press('interact'); run(0.4);
  ok(game.world.keycard === 'player' && p().held === 'keycard', "picked keycard back up -> 'player'");
  ok(walk(RACK_TO_DESK, { busy: true }), 'walks out busy with the card');
  ok(!game.caught && game.suspicion.boss === 0, 'busy + keycard past the boss: fine');
}

section('keycard: boss facing the player -> caught');
{
  const boss = fakeNpc('boss', 'boss_desk', { dir: DIRS.W });
  newDay([boss]);
  place(2.5, 1.5);
  step();
  ok(Object.keys(game.watch).length === 0, 'game.watch: nothing in sight yet');
  input.press('interact');
  step();
  ok(game.watch.boss === 'action', "game.watch.boss = 'action': the rules see the steal (the cone glows from this)");
  const t0 = game.loopTime;
  let tCaught = null;
  for (let i = 0; i < 60 && !game.caught; i++) { step(); if (game.caught) tCaught = game.loopTime; }
  ok(Object.keys(game.watch).length === 0, 'game.watch empty once caught');
  ok(evs('witness:notice').some((e) => e.payload.by === 'boss'), 'boss ❓ (witness:notice) at first sight');
  ok(game.caught?.by === 'boss' && game.caught.reason === 'action', "caught {by:'boss', reason:'action'}");
  ok(tCaught !== null && tCaught - t0 >= NOTICE - 0.05 && tCaught - t0 <= NOTICE + 0.05, `caught after ~NOTICE (${tCaught && (tCaught - t0).toFixed(2)} s)`);
  ok(evs('action:cancel').some((e) => e.payload.reason === 'caught'), "action:cancel {reason:'caught'}");
  ok(game.world.keycard === 'rack' && p().locked, 'keycard stays on the rack, player locked');
  ok(evs('say').some((e) => e.payload.owner === 'boss' && e.payload.kind === 'alert' && e.payload.icons.join('') === '❗👉@player'), 'boss says ❗👉 and your face (alert)');
  ok(game.fx.shake.t > 0, 'screen shake');
  const x0 = p().x;
  input.hold('right'); run(0.5); input.release('right');
  ok(p().x === x0, 'locked: no movement after the catch');
  run(CAUGHT_DELAY - 0.6);
  ok(game.phase === 'day' && !game.outcome, 'still in the busted beat before CAUGHT_DELAY');
  run(0.3);
  ok(game.phase === 'end' && game.outcome?.result === 'caught', "after CAUGHT_DELAY: phase 'end', outcome 'caught'");
  ok(evs('caught').length === 1 && evs('day:end').length === 1 && evs('boss:workAssigned').length === 0, 'caught + day:end once, no work assigned on top');
  ok(game.outcome.loop === game.persist.loop && typeof game.outcome.minute === 'number', 'outcome.loop / minute filled');
}

section('witnesses: Lin tattles; the boss hears -> forced work');
// Engine paths: pin the authority to the engine default (a heard tattle = forced work; locked out = helpless), not
// level 1's choice (its tattle is 'caught'), so this tests the engine whatever the level decides. Restored below.
const authSaved = game.level.roles.authority;
game.level.roles.authority = { ...authSaved, tattle: undefined, helpless: ['lockedOut'], offDuty: ['lockedOut', 'meeting'] };
try {
  // Boss away (restroom): Lin's shout lands on nobody. She only interrupts.
  const away = fakeNpc('boss', 'boss_desk', { active: false });
  const lin = fakeNpc('lin', 'lin_desk');
  newDay([away, lin]);
  place(2.5, 1.5);
  step();
  for (let i = 1; i <= 3; i++) {
    input.press('interact');
    step();
    ok(p().action?.type === 'take_keycard', `boss away, attempt ${i}: steal starts`);
    run(0.5);
    ok(!p().action && game.world.keycard === 'rack' && !p().held, `boss away, attempt ${i}: cancelled before completion`);
  }
  ok(evs('witness:notice').some((e) => e.payload.by === 'lin'), 'Lin ❓ (witness:notice)');
  ok(evs('say').some((e) => e.payload.owner === 'lin' && e.payload.kind === 'thought' && e.payload.icons.length === 2 && e.payload.icons[1] === '❓' && e.payload.icons[0] !== '❓'), "Lin's ❓ says what she noticed first");
  const t = evs('witness:tattle');
  ok(t.length === 3 && t.every((e) => e.payload.by === 'lin' && e.payload.reason === 'action' && e.payload.heard === false), "witness:tattle {by:'lin', reason:'action', heard:false} x3");
  ok(evs('action:cancel').filter((e) => e.payload.reason === 'witnessed').length === 3, "action:cancel {reason:'witnessed'} x3");
  ok(evs('say').some((e) => e.payload.owner === 'lin' && e.payload.kind === 'alert' && e.payload.icons.join('') === '❗👉@player'), 'Lin shouts ❗👉 and your face (alert)');
  ok(game.fx.lines.some((l) => l.from === 'lin' && l.kind === 'tattle'), "tattle sightline from Lin");
  ok(evs('boss:workAssigned').length === 0 && !p().locked && game.clock.forced === 0, 'nobody heard: no work, not locked');

  // ...but Lin remembers. The boss comes back from the restroom: she points you out.
  place(13.5, 9.5); // back at your desk, innocent
  input.hold('busy');
  run(3);
  ok(evs('boss:workAssigned').length === 0, 'boss still away: nothing happens');
  away.active = true;
  away.dir = DIRS.E;
  away.vision = { ...VISION.boss, radius: 0.1 };
  run(1.0);
  ok(evs('boss:workAssigned').length === 0, 'boss back: a short beat first');
  run(0.4);
  const late = evs('witness:tattle').filter((e) => e.payload.late);
  ok(late.length === 1 && late[0].payload.by === 'lin' && late[0].payload.heard && late[0].payload.icon === '🪪', "late tattle {by:'lin', heard, late, icon:'🪪'} (once, for 3 attempts)");
  ok(evs('say').some((e) => e.payload.owner === 'lin' && e.payload.icons.join('') === '👉@player🪪'), 'Lin says 👉, your face, 🪪 (what she saw)');
  ok(evs('boss:workAssigned')[0]?.payload.reason === 'tattle' && p().locked, 'sent to work, even though you are pretending at your desk now');
  input.release('busy');

  // A boss smoking in the lobby can't be told; once he's back inside, she tells.
  const smoker = fakeNpc('boss', 'door_out');
  newDay([smoker, fakeNpc('lin', 'lin_desk')]);
  place(2.5, 1.5);
  step();
  input.press('interact');
  run(0.6);
  run(4);
  ok(evs('boss:workAssigned').length === 0, 'boss in the lobby: no tell yet');
  smoker.x = 6.5; smoker.y = 9.5; smoker.dir = DIRS.E; smoker.vision = { ...VISION.boss, radius: 0.1 };
  run(1.5);
  ok(evs('witness:tattle').some((e) => e.payload.late) && evs('boss:workAssigned').length === 1, 'boss back inside: Lin tells, work assigned');

  // Locked out for good: the grudge never lands.
  const locked = fakeNpc('boss', 'door_out', { override: 'lockedOut' });
  newDay([locked, fakeNpc('lin', 'lin_desk')]);
  place(2.5, 1.5);
  step();
  input.press('interact');
  run(5);
  ok(evs('witness:tattle').length === 1 && evs('boss:workAssigned').length === 0, 'boss locked out: nobody to tell');

  // Boss in the lobby (smoke break): still can't hear.
  newDay([fakeNpc('boss', 'door_out'), fakeNpc('lin', 'lin_desk')]);
  place(2.5, 1.5);
  step();
  input.press('interact');
  run(0.6);
  ok(evs('witness:tattle')[0]?.payload.heard === false && evs('boss:workAssigned').length === 0, 'boss outside smoking: tattle unheard');

  // Boss on the floor (back turned, out of sight): he hears, you go to your desk.
  const boss = fakeNpc('boss', 'boss_desk', { dir: DIRS.E, vision: { ...VISION.boss, radius: 0.1 } });
  newDay([boss, fakeNpc('lin', 'lin_desk')]);
  place(2.5, 1.5);
  step();
  input.press('interact');
  step();
  ok(p().action?.type === 'take_keycard', 'boss here, blind: steal starts');
  run(0.5);
  ok(!game.caught && evs('witness:tattle')[0]?.payload.heard === true, 'Lin tattles, heard (not caught: the boss never saw it)');
  const wa = evs('boss:workAssigned');
  ok(wa.length === 1 && wa[0].payload.reason === 'tattle', "boss:workAssigned {reason:'tattle'}");
  ok(game.clock.forced > WORK_PENALTY_MIN - 0.3 && game.clock.forced <= WORK_PENALTY_MIN, `clock.forced = WORK_PENALTY_MIN (minus the ticks since: ${game.clock.forced.toFixed(2)})`);
  ok(!p().seated && near(p().x, 2.5) && p().locked && game.rules.sent?.by === 'lin', 'not snapped: still where you were, locked, being sent');
  ok(!game.fx.lines.some((l) => l.from === 'lin' && l.to === 'boss'), 'her shout first has a beat of its own (no relay yet)');
  for (let i = 0; i < 120 && !game.fx.lines.some((l) => l.from === 'lin' && l.to === 'boss'); i++) step();
  ok(near(game.rules.sent.t, 1.0, 0.02) && game.fx.lines.some((l) => l.kind === 'relay'), `then it runs to the boss (a 'relay' line, ${game.rules.sent.t.toFixed(2)} s)`);
  ok(!evs('say').some((e) => e.payload.owner === 'boss'), 'no order yet: he looks at her first');
  for (let i = 0; i < 120 && !game.rules.sent?.said; i++) step();
  ok(near(game.rules.sent.t, 1.7, 0.02), `the order comes 1.7 s after the shout (${game.rules.sent.t.toFixed(2)})`);
  ok(game.rules.sent?.look === 'player' && evs('say').some((e) => e.payload.owner === 'boss' && e.payload.icons.join('') === '📄👉@player'), 'then at you, and the order 📄👉 you');
  ok(game.rules.stackAt == null, 'no stack on your desk yet: it lands as you sit');
  input.hold('left'); run(1.0);
  ok(!p().seated && p().moving && p().x > 2.6 && p().locked, 'you walk to your desk yourself (input ignored)');
  run(4); input.release('left');
  ok(p().seated && near(p().x, 13.5) && near(p().y, 9.5) && !game.rules.sent, 'arrived: seated at the desk');
  ok(game.rules.stackAt != null, 'the stack landed on the desk as you sat (rules.stackAt)');
  ok(p().busyPose === 'typing' && !game.clock.ff && near(game.rules.workFrom, game.clock.forced, 3), 'forced work: no movement, typing, ff off');
  input.press('interact'); step();
  ok(!p().action && p().focus === null, 'forced work: no interactions');
  const left = game.clock.forced / GAME_MIN_PER_SEC; // sim seconds left
  run(left - 0.2);
  ok(evs('work:done').length === 0 && p().locked, 'still working just before the end');
  run(0.4);
  ok(evs('work:done').length === 1 && !p().locked && game.clock.forced === 0, 'work:done, unlocked');
  input.hold('right'); step(); input.release('right');
  ok(!p().seated && p().x > 13.5, 'can stand up after the work is done');

  // What a heard tattle costs is the level's call (roles.authority.tattle): 'caught' ends the day on her word; a
  // function answers it itself. Her shout runs to him either way.
  const authRole = game.level.roles.authority;
  const tattleTo = (how) => {
    authRole.tattle = how;
    newDay([fakeNpc('boss', 'boss_desk', { dir: DIRS.E, vision: { ...VISION.boss, radius: 0.1 } }), fakeNpc('lin', 'lin_desk')]);
    place(2.5, 1.5);
    step();
    input.press('interact');
    step();
    run(0.5);
  };
  try {
    tattleTo('caught');
    ok(game.caught?.by === 'boss' && game.caught.reason === 'action' && !game.rules.sent && game.clock.forced === 0
      && evs('boss:workAssigned').length === 0, "tattle: 'caught': caught on her word, no work");
    ok(game.fx.lines.some((l) => l.from === 'lin' && l.to === 'boss' && l.kind === 'relay'), "tattle: 'caught': her shout runs to him");
    const calls = [];
    tattleTo((g, e) => calls.push(e));
    ok(calls.length === 1 && calls[0].by === 'lin' && calls[0].reason === 'action' && !game.caught && !game.rules.sent,
      'tattle: a function: the level answers it ({ by, reason })');
  } finally {
    authRole.tattle = undefined;
  }
} finally {
  game.level.roles.authority = authSaved;
}

section('Kev at the scene: the projector is broken, who did it?');
{
  // Kev hurrying to his broken projector ('alerted'), standing in the hallway facing the door.
  const kevAt = (x, y, dir, extra = {}) => fakeNpc('kev', 'kev_desk', { x, y, dir, pose: 'stand', override: 'alerted', ...extra });
  const boss = () => fakeNpc('boss', 'boss_desk', { dir: DIRS.W, vision: { ...VISION.boss, radius: 0.1 } });

  // In the meeting room: always.
  newDay([boss(), kevAt(14.5, 7.5, DIRS.N)]);
  game.world.projector = 'broken';
  place(14.5, 4.5);
  input.hold('busy');
  run(0.6);
  let t = evs('witness:tattle');
  ok(t.length === 1 && t[0].payload.by === 'kev' && t[0].payload.reason === 'scene' && t[0].payload.heard, "in the room (even pretending): Kev tattles {reason:'scene'}, heard");
  ok(game.caught?.by === 'boss' && evs('boss:workAssigned').length === 0, "the boss hears: caught on Kev's word (level 1: roles.authority.tattle 'caught')");
  input.release('busy');

  // Just outside the door, walking: he makes the leap.
  newDay([boss(), kevAt(14.5, 9.5, DIRS.N)]);
  game.world.projector = 'broken';
  place(14.5, 7.5);
  run(0.6);
  ok(evs('witness:tattle')[0]?.payload.reason === 'scene', `within ${SCENE_RADIUS} tiles of the door, not pretending: tattle`);

  // Same spot, pretending: just someone on a call.
  newDay([boss(), kevAt(14.5, 9.5, DIRS.N)]);
  game.world.projector = 'broken';
  place(14.5, 7.5);
  input.hold('busy');
  run(1);
  ok(evs('witness:tattle').length === 0 && evs('boss:workAssigned').length === 0, 'near the door but pretending: no tattle');
  input.release('busy');

  // Far from the door: nothing.
  newDay([boss(), kevAt(20.5, 9.5, DIRS.W)]);
  game.world.projector = 'broken';
  place(9.5, 9.5); // ~5.8 tiles from the door
  run(1);
  ok(evs('witness:tattle').length === 0, 'away from the scene: Kev ignores you');

  // Only once per break.
  newDay([boss(), kevAt(14.5, 7.5, DIRS.N, { vision: { ...VISION.kev, radius: 12 } })]);
  game.world.projector = 'broken';
  place(14.5, 4.5);
  run(0.6);
  ok(evs('witness:tattle').length === 1, 'first sighting: tattle');
  const fp = game.clock.forced;
  // Pretend the work is done and walk back in view.
  run(fp / GAME_MIN_PER_SEC + 0.2);
  place(14.5, 4.5);
  run(1);
  ok(evs('witness:tattle').length === 1, 'once per break: no second tattle');

  // Projector working again: not a scene any more.
  newDay([boss(), kevAt(14.5, 7.5, DIRS.N, { override: null })]);
  place(14.5, 4.5);
  run(1);
  ok(evs('witness:tattle').length === 0, "Kev not alerted (projector fine): no scene");
}

section('boss suspicion');
{
  const boss = fakeNpc('boss', 'boss_desk');
  newDay([boss]);
  place(4.5, 5.5); // in his office, right in front of his desk
  p().held = 'coffee';
  run(1.0);
  ok(game.suspicion.boss > 0.5 && game.suspicion.boss < 0.7, `idle in view: meter fills (${game.suspicion.boss.toFixed(2)} after 1 s)`);
  ok(evs('boss:suspicious').length === 1, 'boss:suspicious once when it starts filling');
  run(SUSPICION_FILL_SEC - 1.0 + 0.05);
  const wa = evs('boss:workAssigned');
  ok(wa.length === 1 && wa[0].payload.reason === 'idle', "full meter -> boss:workAssigned {reason:'idle'}");
  ok(evs('say').some((e) => e.payload.owner === 'boss' && e.payload.icons.join('') === '📄👉@player'), 'boss says 📄👉 you');
  ok(p().held === 'coffee' && !game.world.items.some((i) => i.type === 'coffee'), 'the held cup stays in your hand (it keeps: it goes down only on a spot)');
  ok(game.rules.sent && !game.rules.sent.by && game.suspicion.boss === 0 && near(game.clock.forced, WORK_PENALTY_MIN, 0.05), 'sent to the desk, meter reset, forced work');
  run(4);
  ok(p().seated && near(p().x, 13.5) && !game.rules.sent, 'walked there and sat down');
  ok(game.suspicion.boss === 0, 'no suspicion during forced work');

  newDay([boss]);
  place(4.5, 5.5);
  input.hold('busy');
  run(3);
  ok(game.suspicion.boss === 0 && evs('boss:workAssigned').length === 0 && p().busyPose === 'phone', 'busy (phone) in front of him: no suspicion');
  input.release('busy');
  run(0.5);
  ok(game.suspicion.boss > 0, 'stop looking busy: meter starts');
  input.hold('busy');
  run(2);
  ok(game.suspicion.boss === 0, 'meter decays while busy again');
  input.release('busy');

  // Override 'meeting' / inactive (in the lift, out for good): ignored.
  for (const extra of [{ override: 'meeting' }, { active: false }]) {
    newDay([fakeNpc('boss', 'boss_desk', extra)]);
    place(4.5, 5.5);
    p().held = 'keycard';
    game.world.keycard = 'player';
    run(2);
    ok(game.suspicion.boss === 0 && !game.caught, `no suspicion/contraband when boss ${JSON.stringify(extra)}`);
  }
}

section('contraband');
{
  const boss = fakeNpc('boss', 'boss_desk');
  newDay([boss]);
  place(4.5, 5.5);
  p().held = 'keycard';
  game.world.keycard = 'player';
  run(0.5);
  ok(game.caught?.reason === 'contraband', "keycard in hand, not busy, boss sees -> caught 'contraband'");
  ok(evs('witness:notice').some((e) => e.payload.by === 'boss'), 'boss ❓ first');

  newDay([boss]);
  place(4.5, 5.5);
  p().held = 'keycard';
  game.world.keycard = 'player';
  input.hold('busy');
  run(3);
  ok(!game.caught && p().busyPose === 'phone' && game.suspicion.boss === 0, 'keycard held to the ear (phone): fine');
  input.release('busy');
  run(0.5);
  ok(game.caught?.reason === 'contraband', 'hang up the "phone" -> caught');

  const lin = fakeNpc('lin', 'lin_desk');
  newDay([lin]);
  place(4.5, 7.5); // two tiles in front of Lin
  p().held = 'sandwich';
  game.world.sandwich = 'player';
  run(0.5);
  ok(p().held === 'sandwich' && lin._claim?.item === 'sandwich' && evs('witness:tattle').length === 0, 'Lin sees her sandwich two tiles off: she gets up to come for it (walk), not a snatch');
  ok(walksOver(lin) && game.world.sandwich === 'lin' && !p().held && evs('sandwich:returned').length === 1, 'Lin at your elbow: takes it back (keeps it)');
  ok(evs('witness:tattle')[0]?.payload.reason === 'contraband' && evs('witness:tattle')[0].payload.heard === false, "Lin {reason:'contraband'}: takes it, no tattle");
  ok(evs('say').some((e) => e.payload.owner === 'lin' && e.payload.icons.join('') === '😠🥪'), 'Lin says 😠🥪');

  newDay([lin]);
  place(4.5, 7.5);
  p().held = 'sandwich';
  game.world.sandwich = 'player';
  input.hold('busy');
  run(2);
  ok(game.world.sandwich === 'player' && p().held === 'sandwich' && evs('witness:tattle').length === 0, 'sandwich held to the ear: Lin fooled');
  input.release('busy');

  // Lin catches you eating her sandwich: one tattle, and she takes it back.
  newDay([lin]);
  place(4.5, 7.5);
  p().held = 'sandwich';
  game.world.sandwich = 'player';
  lin.active = false; // she isn't looking when you start
  holdE();
  ok(p().action?.type === 'eat_sandwich', 'hold E: eating starts');
  lin.active = true;
  run(1.1);
  walksOver(lin);
  ok(evs('witness:tattle').length === 1 && evs('witness:tattle')[0].payload.reason === 'action' && game.world.sandwich === 'lin' && !p().held, 'Lin witnesses eating: one tattle + takes it back');

  // Lifting it to your mouth in front of her is just carrying her sandwich: she has it back before the first bite.
  newDay([lin]);
  place(4.5, 7.5);
  p().held = 'sandwich';
  game.world.sandwich = 'player';
  holdE();
  run(0.5);
  walksOver(lin);
  ok(evs('witness:tattle').length === 1 && evs('witness:tattle')[0].payload.reason === 'contraband' && game.world.sandwich === 'lin' && evs('sandwich:eaten').length === 0, 'hold E in her sight: she takes it back before you eat (contraband)');

  // Mid-hunt, catching you with it ends her hunt: she has found it.
  const hunter = fakeNpc('lin', 'lin_desk', { override: 'hunting' });
  newDay([hunter]);
  place(4.5, 7.5);
  p().held = 'sandwich';
  game.world.sandwich = 'player';
  run(0.5);
  walksOver(hunter);
  ok(game.world.sandwich === 'lin' && !p().held, "hunting Lin takes it back -> it's hers again ('lin'), hunt over");

  // Eating leaves mustard down your sweater.
  newDay([]);
  place(22.5, 7.5);
  p().held = 'sandwich';
  game.world.sandwich = 'player';
  holdE();
  run(2.1);
  ok(p().smeared === 'splat' && game.world.sandwich === 'eaten' && !p().held, "eating: mustard down your sweater (player.smeared = the item's edible.leaves)");

  // Lin, hunting, sees the mustard: she knows. Boss on the floor -> he hears it.
  {
    const boss = fakeNpc('boss', 'boss_desk');
    const hl = fakeNpc('lin', 'lin_desk', { override: 'hunting' });
    newDay([boss, hl]);
    place(4.5, 7.5);
    p().smeared = 'splat';
    input.hold('busy'); // pretending doesn't hide a stain
    run(0.5);
    input.release('busy');
    const t = evs('witness:tattle');
    ok(t.length === 1 && t[0].payload.reason === 'evidence' && t[0].payload.heard === true && game.caught?.by === 'boss', 'hunting Lin sees the mustard (even pretending): 🥪❗👉, boss hears -> caught');
    ok(game.world.linKnows === true, 'world.linKnows (ends her hunt)');
    ok(evs('say').some((e) => e.payload.owner === 'lin' && e.payload.icons.join('') === '🥪❗👉@player'), 'Lin says 🥪❗👉 and your face');
  }
  { // boss away: she remembers, tells him 👉🥪 when he's back; only once
    const away = fakeNpc('boss', 'boss_desk', { active: false });
    const hl = fakeNpc('lin', 'lin_desk', { override: 'hunting' });
    newDay([away, hl]);
    place(4.5, 7.5);
    p().smeared = 'splat';
    run(2);
    ok(evs('witness:tattle').length === 1 && evs('witness:tattle')[0].payload.heard === false && evs('boss:workAssigned').length === 0, 'boss away: mustard spotted, once, unheard');
    away.active = true;
    run(2);
    const late = evs('witness:tattle').find((e) => e.payload.late);
    ok(late?.payload.icon === '🥪' && game.caught?.by === 'boss', 'boss back: Lin points you out 👉🥪 -> caught');
  }
  { // not hunting (before 3:00 or after she gives up): a stain is just a stain
    newDay([fakeNpc('lin', 'lin_desk')]);
    place(4.5, 7.5);
    p().smeared = 'splat';
    run(1);
    ok(evs('witness:tattle').length === 0, 'Lin not hunting: ignores the mustard');
    newDay([fakeNpc('kev', 'kev_desk', { override: 'hunting' })]);
    place(22.5, 7.5);
    p().smeared = 'splat';
    run(1);
    ok(evs('witness:tattle').length === 0, 'Kev never cares about mustard');
  }

  // Only Lin knows it's her sandwich. To Kev it's just lunch.
  const kev = fakeNpc('kev', 'kev_desk');
  newDay([kev]);
  place(22.5, 7.5);
  p().held = 'sandwich';
  game.world.sandwich = 'player';
  holdE();
  run(2.1);
  ok(evs('witness:tattle').length === 0 && game.world.sandwich === 'eaten', "Kev watches you eat Lin's sandwich: shrug (he doesn't know whose it is)");

  newDay([kev]);
  place(22.5, 7.5);
  p().held = 'sandwich';
  game.world.sandwich = 'player';
  run(1);
  ok(p().held === 'sandwich' && evs('witness:tattle').length === 0, 'Kev ignores a sandwich in hand');

  // The boss doesn't know whose it is either: eating is slacking, not a firing offence.
  const boss2 = fakeNpc('boss', 'boss_desk');
  newDay([boss2]);
  place(4.5, 5.5);
  p().held = 'sandwich';
  game.world.sandwich = 'player';
  holdE();
  run(2.1);
  ok(!game.caught && evs('boss:workAssigned')[0]?.payload.reason === 'idle', 'boss watches you eat: ❓ fills -> desk work, not fired');
  ok(evs('action:cancel').some((e) => e.payload.type === 'eat_sandwich' && e.payload.reason === 'idle'), "the meal ends as action:cancel {reason:'idle'}, not 'witnessed'");

  // Kev's coffee: before he's found the pot empty, a colleague with a coffee is nothing to him.
  newDay([kev]);
  kev.wants = null;
  place(22.5, 7.5);
  p().held = 'coffee';
  game.world.coffee = 'taken';
  run(1);
  ok(p().held === 'coffee' && !kev.carry && evs('witness:tattle').length === 0, 'Kev ignores your coffee until he has seen the empty pot');

  // After ☕❓😩 at the empty pot he wants that cup, but the one in your hand is yours: the office rules never take it
  // off you (no owner, no contraband). He asks for it now and then; that, and taking a cup left where it's anyone's,
  // is the level's sim clock (clocks.js), checked by the routes, not here.
  newDay([kev]);
  kev.wants = 'coffee';
  place(22.5, 7.5);
  p().held = 'coffee';
  game.world.coffee = 'taken';
  run(2);
  ok(p().held === 'coffee' && !kev.carry && evs('witness:tattle').length === 0, 'Kev wants the cup: still in your hand, no tattle (he asks: the sim)');
  ok(evs('boss:workAssigned').length === 0 && !game.caught, 'no work, not caught');

  // Lin doesn't care about coffee.
  newDay([fakeNpc('lin', 'lin_desk')]);
  place(4.5, 7.5);
  p().held = 'coffee';
  game.world.coffee = 'taken';
  run(1);
  ok(p().held === 'coffee' && evs('witness:tattle').length === 0, 'Lin ignores the coffee');
}

section('pretending in place = fast-forward');
{
  newDay();
  step();
  ok(!game.clock.ff, 'seated, not busy: no ff');
  input.hold('busy');
  step();
  ok(game.clock.ff && p().busyPose === 'typing' && evs('busy:start')[0]?.payload.pose === 'typing', 'seated + busy: typing, clock.ff');
  const x0 = p().x;
  input.hold('right');
  step();
  ok(!p().seated && !game.clock.ff && p().busyPose === 'folder', 'walking busy: folder, no ff');
  ok(near(p().x - x0, PLAYER_BUSY_SPEED * FIXED_DT, 1e-6), 'folder stride uses PLAYER_BUSY_SPEED');
  input.release('right');
  step();
  ok(p().busyPose === 'phone' && game.clock.ff, 'standing busy: phone call, clock.ff (anywhere)');
  input.release('busy');
  step();
  ok(!p().busy && evs('busy:end').length === 1, 'busy:end on release');
  const x1 = p().x;
  input.hold('right'); step(); input.release('right');
  ok(near(p().x - x1, PLAYER_SPEED * FIXED_DT, 1e-6), 'normal walk uses PLAYER_SPEED');
  step();
  ok(p().focus?.id === 'own_desk' && p().focus.icon === '🪑', 'focus = own desk 🪑');
  input.press('interact');
  step();
  ok(p().seated && near(p().x, 13.5) && near(p().y, 9.5) && near(p().dir, DIRS.N), 'sit snaps to the chair, facing N');
  ok(evs('player:sit').length === 1, 'player:sit');
  step();
  ok(p().focus === null, 'seated with empty hands: no focus');
}

section('sandwich: take + eat');
{
  newDay();
  ok(walk(DESK_TO_FRIDGE), 'walks to the fridge');
  step();
  ok(p().focus?.id === 'fridge' && p().focus.action === 'take_sandwich', 'focus = fridge: take_sandwich');
  input.press('interact');
  run(0.9);
  ok(p().held === 'sandwich' && game.world.sandwich === 'player' && evs('sandwich:taken').length === 1, 'sandwich taken');
  step();
  ok(p().focus?.kind === 'self' && p().focus.action === 'drop' && p().focus.hold === 'eat_sandwich',
    'holding sandwich: tap E = drop, hold E = eat');
  ok(p().focus.preview === 'holdout' && p().focus.holdPreview === 'lift', 'self focus previews: arm out (drop), lift (eat)');
  holdE();
  run(1.0);
  ok(p().action?.type === 'eat_sandwich', 'eating (2 s)');
  run(1.0);
  ok(game.world.sandwich === 'eaten' && !p().held && evs('sandwich:eaten').length === 1, 'sandwich eaten');
  ok(game.fx.particles.some((q) => q.kind === 'crumbs'), 'crumbs');
}

section('tap E drops, hold E eats (an edible item, nothing else in reach)');
{
  const holding = () => { newDay(); place(22.5, 7.5); p().held = 'sandwich'; game.world.sandwich = 'player'; step(); };
  const dropped = () => !p().held && !p().action && evs('sandwich:eaten').length === 0 && game.world.items.some((i) => i.type === 'sandwich');
  holding();
  input.press('interact');
  input.hold('interact');
  run(0.15);
  ok(p().held === 'sandwich' && !p().action, 'E down: nothing yet (a tap or a hold?)');
  input.release('interact');
  step();
  ok(dropped(), 'let go before HOLD_TIME: a tap -> dropped, not eaten');

  holding();
  input.press('interact');
  input.hold('interact');
  run(0.25);
  input.steer(1, 0);
  step(3);
  input.steer(null);
  run(0.25);
  ok(p().held === 'sandwich' && !p().action && p().hold, 'moving while E is down starts the hold over');
  run(0.15);
  ok(p().action?.type === 'eat_sandwich', 'standing still with E down: eats');
  input.release('interact');

  // An item with `keep` has no drop: a tap eats it (no drop key to protect).
  const lvl = game.level;
  const variant = (sandwich) => ({ ...lvl, items: { ...lvl.items, sandwich: { ...lvl.items.sandwich, ...sandwich } } });
  game.level = variant({ keep: true });
  holding();
  ok(p().focus?.action === 'eat_sandwich' && p().focus.hold === null && p().focus.preview === 'lift', 'a kept edible item: E eats, the lift previewed');
  input.press('interact');
  step();
  ok(p().action?.type === 'eat_sandwich', 'a tap eats it');

  // edible: { leaves: null } -> eaten, nothing on you.
  game.level = variant({ edible: { leaves: null } });
  holding();
  holdE();
  run(2.1);
  ok(game.world.sandwich === 'eaten' && p().smeared === false, 'edible: { leaves: null }: eaten, nothing on you');
  game.level = lvl;

  // The harness: `eat` holds E; `interact` taps (drops); the words for the mark are the renderer's (MARKS).
  const h = createHarness({ level: lvl });
  h.begin();
  const hp = h.game.player;
  Object.assign(hp, { x: 22.5, y: 7.5, seated: false, held: 'sandwich' });
  h.game.world.sandwich = 'player';
  h.frame();
  ok(/drop the sandwich \(hold E: eat the sandwich\)/.test(observe(h.game)), 'harness observe: tap drops, hold E eats');
  h.run('eat');
  ok(h.game.world.sandwich === 'eaten' && hp.smeared === 'splat', 'harness eat: eaten, splat');
  ok(observe(h.game).includes(MARKS.splat.words), `harness observe: "${MARKS.splat.words}"`);
}

section('action invalidated mid-way');
{
  newDay();
  place(2.5, 1.5);
  step();
  input.press('interact');
  run(0.5);
  game.world.keycard = 'boss'; // the boss grabbed his jacket
  step();
  ok(!p().action && !p().held && evs('action:cancel').some((e) => e.payload.reason === 'invalid'), "keycard gone mid-steal: cancelled ('invalid')");
}

section('4:00 meeting outcomes + persist.routesFound');
{
  game.persist.routesFound = [];
  // where: 'room' (your meeting chair) | 'desk' (start position: still at your desk at 4:00).
  function meeting(setup, where = 'room') {
    const boss = fakeNpc('boss', 'meeting_head', { override: 'meeting' });
    newDay([boss], MEETING_AT - 0.05);
    if (where === 'room') place(13.5, 5.5);
    setup();
    run(0.2);
    const o = game.outcome;
    const locked = p().locked;
    const phaseAtDecision = game.phase;
    run(END_BEAT - 0.3);
    const phaseMid = game.phase;
    run(0.3);
    const beatEnd = game.phase;
    for (let i = 0; i < 600 && game.phase === 'day'; i++) step(); // a fail walks you to the front first
    return { o, locked, phaseAtDecision, phaseMid, beatEnd };
  }

  let r = meeting(() => {});
  ok(r.o?.result === 'fail' && r.o.routes.length === 0, 'nothing done: a plain fail');
  ok(r.locked && r.phaseAtDecision === 'day' && r.phaseMid === 'day', '2 s in-world beat, player locked');
  ok(near(p().x, 17.5) && near(p().y, 3.5), 'fail: player stands at the presenter spot');
  ok(evs('say').some((e) => e.payload.owner === 'player' && e.payload.icons.includes('😩')), 'fail: player says 😩 up front');
  ok(!evs('say').some((e) => e.payload.owner === 'player' && /[😅😄😀😁😆]/u.test(e.payload.icons.join(''))), 'fail: the player never smiles');
  ok(game.phase === 'end' && evs('day:end').length === 1 && evs('day:end')[0].payload.outcome === game.outcome, "phase 'end', day:end {outcome}");
  ok(r.o.loop === game.persist.loop && r.o.minute >= MEETING_AT && r.o.minute < MEETING_AT + 0.1, 'outcome.loop / minute');

  { // no presenter spot: the fail plays where you stand
    const lvl = game.level;
    game.level = { ...lvl, meeting: { ...lvl.meeting, presenter: undefined } };
    meeting(() => {});
    ok(near(p().x, 13.5) && near(p().y, 5.5) && game.outcome?.result === 'fail', 'fail, no presenter: you stay where you were');
    game.level = lvl;
  }

  r = meeting(() => { game.world.projector = 'broken'; });
  ok(r.o?.result === 'win' && r.o.routes.join() === 'projector' && r.o.newRoutes.join() === 'projector', 'projector broken: WIN (projector), new route');
  ok(game.fx.particles.some((q) => q.kind === 'confetti'), 'win: 🎉 confetti');
  ok(game.persist.routesFound.join() === 'projector', 'routesFound = [projector]');

  r = meeting(() => { game.world.bossLockedOut = true; game.npcs[0].override = 'lockedOut'; });
  ok(r.o?.result === 'win' && r.o.routes.join() === 'keycard' && r.o.newRoutes.join() === 'keycard', 'boss locked out: WIN (keycard), new route');
  ok(game.persist.routesFound.slice().sort().join() === 'keycard,projector', 'routesFound accumulates both');

  r = meeting(() => { game.world.bossLockedOut = true; game.world.projector = 'broken'; });
  ok(r.o?.result === 'win' && r.o.routes.join() === 'keycard,projector' && r.o.newRoutes.length === 0, 'both: routes [keycard, projector], nothing new');
  ok(game.persist.routesFound.length === 2, 'no duplicates in routesFound');

  r = meeting(() => { game.world.projector = 'fixing'; });
  ok(r.o?.result === 'fail', "projector being fixed ('fixing') doesn't count");

  // Attendance: solved it but not in the room at 4:00 -> blamed. Not a discovery.
  game.persist.routesFound = [];
  r = meeting(() => { game.world.projector = 'broken'; }, 'desk');
  ok(r.o?.result === 'blamed' && r.o.routes.join() === 'projector' && r.o.newRoutes.length === 0, "projector broken, you at your desk: BLAMED, routes [projector], nothing new");
  ok(game.persist.routesFound.length === 0, 'blamed: routesFound unchanged');
  ok(r.locked && r.phaseMid === 'day' && near(p().x, 13.5) && near(p().y, 9.5), 'blamed: 2 s beat, you stay where you were');
  ok(evs('say').some((e) => e.payload.owner === 'boss' && e.payload.icons.join('') === '🪑❓'), 'blamed: the room stares at your empty chair (🪑❓)');
  ok(evs('say').some((e) => e.payload.owner === 'player' && e.payload.icons.includes('😰')), 'blamed: player thinks 😰');
  ok(!game.fx.particles.some((q) => q.kind === 'confetti'), 'blamed: no confetti');

  r = meeting(() => { game.world.projector = 'broken'; place(14.5, 7.5); }, 'desk');
  ok(r.o?.result === 'blamed', 'just outside the door at 4:00: still blamed');
  r = meeting(() => { game.world.projector = 'broken'; place(10.5, 2.5); }, 'desk');
  ok(r.o?.result === 'win', 'anywhere inside the meeting room counts');
  r = meeting(() => {}, 'desk');
  ok(r.o?.result === 'fail', 'nothing done, absent: plain fail (not blamed)');

  // Forced work running into 4:00: outcome still decided, no work:done afterwards.
  const boss = fakeNpc('boss', 'boss_desk');
  newDay([boss], MEETING_AT - 2); // 2 game min = 3.3 s
  place(4.5, 5.5);
  run(SUSPICION_FILL_SEC + 0.1);
  ok(game.clock.forced > 0, 'work assigned near 4:00');
  run(7); // meeting at ~3.3 s + the walk to the front + 2 s beat (the harness has no FORCED_MULT)
  ok(game.phase === 'end' && game.outcome?.result === 'fail' && evs('work:done').length === 0, 'meeting ends forced work cleanly (fail, no work:done)');
}

// =====================================================================================
section('trespass: the owner shows you out of his private place');
game.level.roles.private = PRIVATE;
{
  newDay([fakeNpc('boss', 'boss_desk')]);
  place(4.5, 5.5); // in his office, right in front of his desk
  game.world.keycard = 'player';
  p().held = 'keycard';
  input.hold('busy');
  step();
  ok(evs('trespass:notice').some((e) => e.payload.by === 'boss') && !evs('witness:notice').length, 'boss notices you at once (trespass:notice, not a witness:notice: nothing for a harness to stop on)');
  ok(evs('say').some((e) => e.payload.owner === 'boss' && e.payload.kind === 'thought' && e.payload.icons.join('') === '@player🤨'), 'boss thinks your face 🤨');
  run(0.4);
  ok(evs('trespass').length === 0, 'not yet: a beat to take you in');
  run(0.4);
  const t = evs('trespass');
  ok(t.length === 1 && t[0].payload.by === 'boss' && t[0].payload.zone === 'boss_office', "trespass {by:'boss', zone:'boss_office'}, pretending or not");
  ok(evs('say').some((e) => e.payload.owner === 'boss' && e.payload.icons.join('') === '👉@player🚪'), 'boss says 👉 your face 🚪');
  ok(!game.caught && !game.outcome && p().locked && game.rules.out, 'shown out: locked, not caught');
  ok(!p().held && game.world.keycard !== 'player', `he takes his keycard back (keycard: ${game.world.keycard})`);
  input.release('busy');
  run(12);
  ok(evs('trespass:out').length === 1 && !game.rules.out && !p().locked, 'back at your desk, free again');
  ok(Math.hypot(p().x - 13.5, p().y - 9.5) < 1.5, `walked to your desk (${p().x.toFixed(1)}, ${p().y.toFixed(1)})`);
  ok(evs('boss:workAssigned').length === 0 && !game.caught, 'no work, no catch: only time and position lost');

  // Away, his office is open.
  newDay([fakeNpc('boss', 'boss_desk', { active: false })]);
  place(4.5, 5.5);
  run(2);
  ok(evs('trespass').length === 0, 'boss away: nobody shows you out');
}

section('input module (createInput on a fake EventTarget)');
{
  const target = new EventTarget();
  const inp = createInput(target);
  const key = (type, code, extra = {}) => {
    const e = new Event(type, { cancelable: true });
    Object.assign(e, { code, key: '', repeat: false, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, ...extra });
    target.dispatchEvent(e);
    return e;
  };
  key('keydown', 'KeyW');
  ok(inp.isDown('up') && inp.axis().x === 0 && inp.axis().y === -1, 'W -> up, axis (0,-1)');
  key('keydown', 'KeyD');
  const a = inp.axis();
  ok(near(a.x, Math.SQRT1_2) && near(a.y, -Math.SQRT1_2), 'W+D -> normalised diagonal');
  key('keyup', 'KeyW'); key('keyup', 'KeyD');
  ok(inp.axis().x === 0 && inp.axis().y === 0, 'released -> axis 0');
  const sp = key('keydown', 'Space');
  ok(sp.defaultPrevented, 'Space: preventDefault');
  ok(inp.pressed('start'), 'Space = start');
  ok(!inp.pressed('interact'), 'Space is not a use key (only E is)');
  key('keyup', 'Space');
  key('keydown', 'Enter');
  ok(inp.pressed('start') && !inp.pressed('interact'), 'Enter = start only');
  key('keyup', 'Enter');
  key('keydown', 'KeyE');
  ok(inp.pressed('interact') && !inp.pressed('interact'), 'E = interact; pressed() is consume-on-read');
  ok(inp.pressed('start'), 'E also = start');
  key('keyup', 'KeyE');
  ok(key('keydown', 'ArrowDown').defaultPrevented && inp.isDown('down'), 'arrows: preventDefault + mapped');
  key('keyup', 'ArrowDown');
  key('keydown', 'KeyE', { repeat: true });
  ok(!inp.pressed('interact'), 'auto-repeat is not a press');
  key('keyup', 'KeyE');
  const rr = key('keydown', 'KeyR', { metaKey: true });
  ok(!rr.defaultPrevented && !inp.pressed('restart'), 'Cmd+R left to the browser');
  ok(!key('keydown', 'KeyQ').defaultPrevented, 'unmapped key not prevented');
  ok(key('keydown', 'Escape').defaultPrevented && inp.pressed('pause'), 'Esc -> pause');
  key('keyup', 'Escape');
  key('keydown', 'ShiftLeft', { shiftKey: true });
  ok(inp.isDown('busy'), 'Shift -> busy');
  key('keydown', 'KeyW', { shiftKey: false });
  ok(!inp.isDown('busy'), 'lost Shift keyup recovered from e.shiftKey');
  key('keyup', 'KeyW');
  key('keydown', 'BracketRight'); key('keydown', 'KeyM'); key('keydown', 'KeyV');
  ok(inp.pressed('faster') && inp.pressed('mute') && inp.pressed('cones'), '] M V mapped');
  key('keydown', 'KeyA');
  target.dispatchEvent(new Event('blur'));
  ok(!inp.isDown('left'), 'blur clears held keys');
  key('keydown', 'KeyE');
  await new Promise((res) => setTimeout(res, 260));
  ok(!inp.pressed('interact'), 'unconsumed press expires after 0.2 s');
  inp.destroy();
  key('keydown', 'KeyW');
  ok(!inp.isDown('up'), 'destroy() removes listeners');
}

// The harness's interact watches for stop events from the key press's own frame: Layoffs, the boss walking back
// into sight of his office as you start on his list (witness:notice, a soft stop, fires on the press frame), and
// the command pauses on it.
{
  const PLAN = ['pretend until 3:14', 'goto behind_his_desk', 'interact', 'goto my_seat pretend', 'pretend until 3:30.3',
    'goto behind_his_desk', 'interact', 'goto his_screen', 'wait until 3:41.12']; // pull, plug back in, wait for him
  const press = (pressStops) => {
    const h = createHarness({ level: 'layoffs', pressStops });
    h.begin();
    for (const c of PLAN) h.run(c);
    return [h.run('interact').text, h];
  };
  const [r, h] = press(true);
  ok(/^paused at 0% .*\(witness:notice\)/.test(r), `pressStops: a stop on the press frame pauses interact (${r})`);
  const again = h.run('interact').text;
  ok(/^tried .*\(action:cancel\)/.test(again), `pressStops: a second interact carries on with the act (he stops it) (${again})`);
  const [old] = press(false);
  ok(/^tried .*\(action:cancel\)/.test(old), `without pressStops the press frame's stop is missed (${old})`);
  // tools/press-stops.mjs: the extra interact that brings the old command results back.
  const fix = fixShot(getLevel('layoffs'), [...PLAN, 'interact']);
  ok(fix.adds.length === 1 && fix.adds[0].i === PLAN.length && fix.cmds.join() === [...PLAN, 'interact', 'interact'].join() && fix.same,
    `press-stops: one interact after the paused one, and every old result comes back (${fix.cmds.join(' ; ')})`);
}

console.log(`\n${passes} passed, ${fails} failed`);
console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
