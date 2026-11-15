// Headless tests for the per-NPC clock seam (src/sim/npcs.js, level.clockFor): the minute each NPC's schedule
// reads; and the hook API's lookAt, which a clock-reading level uses to look up. Drives the sim alone (updateNpcs + advanceClock) on the fixture's cast.
//
//   node tools/test-clock.mjs
import { FIXED_DT, at } from '../src/config.js';
import { createGame } from '../src/state.js';
import { createNpcs, updateNpcs } from '../src/sim/npcs.js';
import { advanceClock } from '../src/game/loop.js';
import { levels } from '../src/levels/index.js';

let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

// One sim-only day up to `until`; returns the event log with the true minute of each event.
function run(level, until) {
  const game = createGame({ level });
  game.npcs = createNpcs(game);
  game.phase = 'day';
  const log = [];
  game.events.on('*', (name, p) => log.push({ m: game.clock.minute, name, p }));
  while (game.clock.minute < until) {
    updateNpcs(game, FIXED_DT);
    advanceClock(game, FIXED_DT);
  }
  return { game, log };
}
const firstSay = (log, owner, icon) => log.find((e) => e.name === 'say' && e.p.owner === owner && e.p.icons.includes(icon))?.m;
const firstEvent = (log, name, id) => log.find((e) => e.name === name && e.p.id === id)?.m;
const near = (a, b, tol = 0.05) => a !== undefined && Math.abs(a - b) <= tol;
const fx = levels.fixture;

// 1. No clockFor: the fixture's day as written. Gus wonders about candles at 2:42 and is out of the door ~2:44.
const base = run(fx, at('2:52'));
const gusSay = firstSay(base.log, 'gus', '🕯️');
const gusOut = firstEvent(base.log, 'npc:vanish', 'gus');
ok(near(gusSay, at('2:42')), `no clockFor: Gus's 2:42 bubble at true 2:42 (${gusSay?.toFixed(2)})`);
ok(gusOut !== undefined && gusOut > at('2:43'), `no clockFor: Gus leaves for candles after 2:43 (vanishes at ${gusOut?.toFixed(2)})`);

// 2. Gus's clock runs 5 minutes fast: everything on his schedule happens 5 minutes early; Doreen's doesn't move.
const fast = { ...fx, clockFor: (game, npc) => game.clock.minute + (npc.id === 'gus' ? 5 : 0) };
const f = run(fast, at('2:52'));
ok(near(firstSay(f.log, 'gus', '🕯️'), at('2:37')), `Gus +5: his 2:42 bubble at true 2:37 (${firstSay(f.log, 'gus', '🕯️')?.toFixed(2)})`);
ok(near(firstEvent(f.log, 'npc:vanish', 'gus'), gusOut - 5, 0.1), `Gus +5: he vanishes 5 minutes earlier (${firstEvent(f.log, 'npc:vanish', 'gus')?.toFixed(2)})`);
ok(near(firstSay(f.log, 'doreen', '🎂'), at('2:45')), `Gus +5: Doreen's 2:45 bubble stays at 2:45 (${firstSay(f.log, 'doreen', '🎂')?.toFixed(2)})`);

// 3. Called exactly once per NPC per step, in cast order, with the sim's hook API.
{
  const calls = [];
  let api = null;
  const spy = { ...fx, clockFor: (game, npc, sim) => { calls.push(npc.id); api = sim; return game.clock.minute; } };
  const game = createGame({ level: spy });
  game.npcs = createNpcs(game);
  game.phase = 'day';
  for (let i = 0; i < 10; i++) { updateNpcs(game, FIXED_DT); advanceClock(game, FIXED_DT); }
  const ids = fx.cast.map((c) => c.id);
  ok(calls.length === 10 * ids.length && calls.every((id, i) => id === ids[i % ids.length]), `once per NPC per step, in cast order (${calls.slice(0, 4).join(',')}...)`);
  ok(api && typeof api.speak === 'function' && typeof api.holdFor === 'function' && typeof api.faceSpot === 'function', 'its third argument is the hook API (speak, holdFor, faceSpot)');
}

// 4. A jump mid-day: at true 2:40 Gus's clock leaps 10 minutes. He skips the candle errand (2:43-2:49) and its
// bubble fires at the jump; he stays seated. The gather and the meeting keep the game clock.
{
  const jump = { ...fx, clockFor: (game, npc) => game.clock.minute + (npc.id === 'gus' && game.clock.minute >= at('2:40') ? 10 : 0) };
  const j = run(jump, at('3:00') + 0.2);
  ok(near(firstSay(j.log, 'gus', '🕯️'), at('2:40'), 0.02), `jump: the skipped 2:42 bubble fires at the jump (${firstSay(j.log, 'gus', '🕯️')?.toFixed(2)})`);
  ok(firstEvent(j.log, 'npc:vanish', 'gus') === undefined, 'jump: Gus never goes out for candles');
  ok(near(j.log.find((e) => e.name === 'meeting:gather')?.m, fx.day.gatherAt, 0.02), 'jump: the gather is at the true gatherAt');
}

// 5. An identity clockFor gives exactly the day without one (the default path is the game clock). On the fixture,
// not on a real level: a level may have a clock of its own (level 1 does), and a test must not read its state.
{
  const until = fx.day.meetingAt + 0.5;
  const ra = run({ ...fx, clockFor: undefined }, until);
  const rb = run({ ...fx, clockFor: (game) => game.clock.minute }, until);
  const [a, b] = [ra.log, rb.log];
  const same = a.length === b.length && a.every((e, i) => e.name === b[i].name && e.m === b[i].m && JSON.stringify(e.p) === JSON.stringify(b[i].p));
  ok(same, `with clockFor = game clock: the same ${a.length} events, at the same minutes`);
  const pos = (g) => g.npcs.map((n) => `${n.id}@${n.x},${n.y},${n.dir}`).join(' ');
  ok(pos(ra.game) === pos(rb.game), 'and every NPC ends the day at the same position and facing');
}

// 6. The hook API's lookAt (a clock-reading level's look up): mid-glance, Doreen looks at the door for 1 s. The
// glance ends, no new one starts, she turns to the door and stands still, then turns back to her desk.
{
  let api = null;
  const spy = { ...fx, clockFor: (game, npc, sim) => { api = sim; return game.clock.minute; } };
  const game = createGame({ level: spy });
  game.npcs = createNpcs(game);
  game.phase = 'day';
  const d = game.npcs.find((n) => n.id === 'doreen');
  const step = () => { updateNpcs(game, FIXED_DT); advanceClock(game, FIXED_DT); };
  for (let i = 0; i < 60 * 30 && Math.abs(d.glance.offset) < 0.5; i++) step();
  const midGlance = Math.abs(d.glance.offset) >= 0.5;
  const back = d._faceTarget;
  const [x, y] = [d.x, d.y];
  const door = fx.spots.door;
  const want = Math.atan2(door.y + 0.5 - d.y, door.x + 0.5 - d.x);
  api.lookAt(game, d, 'door', 1.0);
  let headStill = true;
  let faced = false;
  for (let i = 0; i < 60; i++) {
    step();
    if (i >= 18 && d.glance.offset !== 0) headStill = false; // 0.3 s to bring the head back, then no glance
    if (Math.abs(d.dir - want) < 1e-6) faced = true;
  }
  ok(midGlance && headStill, `lookAt: a running glance ends and none starts for the look (${midGlance ? 'was mid-glance' : 'never glanced'})`);
  ok(faced && d.x === x && d.y === y, 'lookAt: she turns to the spot and stands still');
  for (let i = 0; i < 30; i++) step();
  ok(Math.abs(d.dir - back) < 1e-6 && d._stare === null, 'lookAt: after it she turns back to her old facing');
}

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
