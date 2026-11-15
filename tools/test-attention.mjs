// Headless tests for the attention mechanic (src/sim/mechanics/attention.js): noises turn heads.
// Drives level 1's cast with the sim alone (updateNpcs + advanceClock), plus the harness for action rows.
//
//   node tools/test-attention.mjs
import { FIXED_DT, at } from '../src/config.js';
import { createGame } from '../src/state.js';
import { createNpcs, updateNpcs } from '../src/sim/npcs.js';
import { advanceClock } from '../src/game/loop.js';
import { angleDiff } from '../src/core/vision.js';
import { viewerOf, spotPos } from '../src/game/perception.js';
import { makeNoise, setNoise } from '../src/sim/mechanics/attention.js';
import { levelProblems } from '../src/levels/validate.js';
import { updateFx } from '../src/core/fx.js';
import { drawRipples } from '../src/render/effects.js';
import { createHarness } from '../src/agent/harness.js';
import { levels } from '../src/levels/index.js';
import { levelData } from './fuzz.mjs';

const BASE = levels.meeting;
let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

function day(level = BASE) {
  const game = createGame({ level });
  game.npcs = createNpcs(game);
  game.phase = 'day';
  const log = [];
  game.events.on('*', (name, payload) => log.push({ name, payload }));
  return { game, log };
}
const step = (game, s) => {
  for (let i = Math.round(s / FIXED_DT); i > 0; i--) {
    updateNpcs(game, FIXED_DT);
    advanceClock(game, FIXED_DT);
  }
};
const angleTo = (n, x, y) => Math.atan2(y - n.y, x - n.x);
const idle = (game) => game.npcs.find((n) => n.active && !n.moving && !n.override);
// A point `d` tiles behind him.
const behind = (n, d = 3) => ({ x: n.x - Math.cos(n.dir) * d, y: n.y - Math.sin(n.dir) * d });

// 1. Body turn: an NPC with no override faces the noise, stands still, then goes back to what he was doing.
{
  const { game, log } = day();
  step(game, 1);
  const n = idle(game);
  const p = behind(n);
  const before = { x: n.x, y: n.y, face: n._faceTarget };
  makeNoise(game, { ...p, radius: 5 });
  const names = log.map((e) => e.name);
  ok(names[0] === 'noise' && log[0].payload.radius === 5, `the 'noise' event comes first, with {x, y, radius}`);
  ok(log.some((e) => e.name === 'npc:heard' && e.payload.id === n.id), `'npc:heard' {id: ${n.id}}`);
  step(game, 0.5);
  ok(Math.abs(angleDiff(n.dir, angleTo(n, p.x, p.y))) < 0.05, `${n.id} turned his body to the noise behind him in 0.5 s`);
  ok(Math.abs(angleDiff(viewerOf(n).dir, angleTo(n, p.x, p.y))) < 0.05, 'his vision cone follows');
  ok(n.x === before.x && n.y === before.y, 'and stands still');
  step(game, 1.1);
  ok(n._heard === null, 'after 1.5 s the noise has let go');
  step(game, 0.5);
  ok(Math.abs(angleDiff(n.dir, before.face)) < 0.05, 'and he faces where he did before');
}

// 2. A walking NPC (no override) stops for the turn, then walks on.
{
  const { game } = day();
  let n = null;
  for (let i = 0; i < 60 * 600 && !n; i++) {
    step(game, FIXED_DT);
    n = game.npcs.find((m) => m.active && m.moving && !m.override);
  }
  ok(!!n, `someone walks somewhere (${n?.id} at ${n && game.clock.minute.toFixed(1)})`);
  makeNoise(game, { ...behind(n), radius: 5 });
  step(game, FIXED_DT);
  const x = n.x;
  const y = n.y;
  step(game, 1.4);
  ok(n.x === x && n.y === y, `${n.id} stopped walking while he looks`);
  step(game, 0.5);
  ok(n.x !== x || n.y !== y, 'and walks on afterwards');
}

// 3. Earshot: straight-line radius; the npcs filter; the authority's deafIn zone.
{
  const { game, log } = day();
  step(game, 1);
  const n = idle(game);
  const far = game.npcs.filter((m) => Math.hypot(m.x - n.x, m.y - n.y) > 3);
  makeNoise(game, { x: n.x + 1, y: n.y, radius: 2 });
  const heard = log.filter((e) => e.name === 'npc:heard').map((e) => e.payload.id);
  ok(heard.includes(n.id) && far.every((m) => !heard.includes(m.id) && m._heard === null), `radius 2: only those within 2 tiles hear it (${heard})`);

  const { game: g2, log: l2 } = day();
  step(g2, 1);
  const ids = g2.npcs.map((m) => m.id);
  makeNoise(g2, { x: 10, y: 8, radius: 99, npcs: [ids[1]] });
  const h2 = l2.filter((e) => e.name === 'npc:heard').map((e) => e.payload.id);
  ok(h2.length === 1 && h2[0] === ids[1], `npcs: [${ids[1]}] limits who hears it`);

  const auth = BASE.roles.authority.id;
  const deaf = {
    ...BASE,
    zones: { ...BASE.zones, everywhere: { x0: 0, y0: 0, x1: 999, y1: 999 } },
    roles: { ...BASE.roles, authority: { ...BASE.roles.authority, deafIn: 'everywhere' } },
  };
  const { game: g3, log: l3 } = day(deaf);
  step(g3, 1);
  makeNoise(g3, { x: 10, y: 8, radius: 99 });
  const h3 = l3.filter((e) => e.name === 'npc:heard').map((e) => e.payload.id);
  ok(!h3.includes(auth) && h3.length === g3.npcs.filter((m) => m.active).length - 1, `the authority hears nothing in his deafIn zone (heard: ${h3})`);
}

// 4. A scripted moment (an override): head only, the plan goes on.
{
  const { game } = day();
  step(game, (BASE.day.gatherAt + 0.1) / 0.6);
  const n = game.npcs.find((m) => m.active && m.moving && m.override === 'meeting');
  ok(!!n, `someone walks to the meeting (${n?.id})`);
  const side = n.dir + Math.PI / 2;
  const p = { x: n.x + Math.cos(side) * 3, y: n.y + Math.sin(side) * 3 };
  makeNoise(game, { ...p, radius: 5 });
  const x = n.x;
  const y = n.y;
  step(game, 0.4);
  ok(n.x !== x || n.y !== y, `${n.id} keeps walking to the meeting`);
  ok(Math.abs(n.glance.offset) > 1, `and turns his head (offset ${n.glance.offset.toFixed(2)})`);
  ok(Math.abs(angleDiff(viewerOf(n).dir, angleTo(n, p.x, p.y))) < 0.15, 'toward the noise: his cone looks at it');
  step(game, 1.6);
  ok(n._heard === null && Math.abs(n.glance.offset) < 0.05, 'then looks ahead again');
}

// 5. A second noise during a turn retargets and restarts the clock.
{
  const { game } = day();
  step(game, 1);
  const n = idle(game);
  const a = behind(n);
  makeNoise(game, { ...a, radius: 5 });
  step(game, 1.0);
  const b = { x: n.x + Math.cos(n.dir + Math.PI / 2) * 2, y: n.y + Math.sin(n.dir + Math.PI / 2) * 2 };
  makeNoise(game, { ...b, radius: 5 });
  step(game, 0.4);
  ok(Math.abs(angleDiff(n.dir, angleTo(n, b.x, b.y))) < 0.05, 'he turns to the second noise');
  step(game, 1.0);
  ok(n._heard !== null, 'still on it 1.4 s after the second noise (2.4 s after the first)');
  step(game, 0.2);
  ok(n._heard === null, 'free 1.6 s after it');
}

// 6. No rng: noises don't change any NPC's glance draws.
{
  const quiet = day().game;
  const loud = day().game;
  for (let t = 0; t < 40; t++) {
    step(quiet, 1);
    step(loud, 1);
    if (t % 3 === 0) makeNoise(loud, { x: 5 + (t % 20), y: 8, radius: 12 });
  }
  const same = quiet.npcs.every((n, i) => {
    const m = loud.npcs[i];
    return n._gl.timer === m._gl.timer && n.rng.next() === m.rng.next();
  });
  ok(same, 'glance timers and rng state match a day without noises');
}

// 7. level.noises: an event makes a noise at a spot; subscribed once per game however many loops.
{
  const level = { ...BASE, noises: { 'test:clang': { at: 'player_desk', radius: 6 } } };
  const { game, log } = day(level);
  game.npcs = createNpcs(game); // a second loop
  step(game, 1);
  game.events.emit('test:clang', {});
  const noises = log.filter((e) => e.name === 'noise');
  const c = spotPos(game, 'player_desk');
  ok(noises.length === 1 && noises[0].payload.x === c.x && noises[0].payload.y === c.y, 'one noise at the spot per event, after two loops');
  let msg = '';
  try { day({ ...BASE, noises: { 'test:clang': { at: 'nowhere', radius: 6 } } }); } catch (e) { msg = e.message; }
  ok(/nowhere/.test(msg), `an unknown spot throws when the NPCs are created (${msg})`);
  msg = '';
  try { day({ ...BASE, noises: { noise: { at: 'player_desk', radius: 6 } } }); } catch (e) { msg = e.message; }
  ok(/forever/.test(msg), 'mapping the noise event itself throws');
}

// 8. Interaction rows: noise { radius, at? } after done; timed and instant rows.
{
  const rows = BASE.interactions;
  const [verb] = Object.entries(rows).find(([, r]) => r.on === 'coffee_machine');
  const clap = { on: 'self', icon: '👏', text: 'clap', instant: true, can: (p) => !p.held && !p.seated, done() {}, noise: { radius: 30 } };
  const level = { ...BASE, interactions: { ...rows, [verb]: { ...rows[verb], noise: { radius: 30 } }, clap } };
  const h = createHarness({ level });
  h.begin();
  h.run('goto coffee_machine');
  h.run('interact');
  const i = h.log.findIndex((e) => e.name === 'noise');
  const it = h.game.map.interactables.find((m) => m.type === 'coffee_machine');
  ok(i > 0 && h.log[i - 1].name !== 'action:start' && h.log.slice(0, i).some((e) => e.name === 'action:done'), `${verb}: the noise comes after action:done`);
  ok(i > 0 && h.log[i].payload.x === it.cx && h.log[i].payload.y === it.cy, 'at the target');
  ok(h.log.some((e) => e.name === 'npc:heard'), 'and someone heard it');

  const at2 = { ...BASE, interactions: { ...rows, [verb]: { ...rows[verb], noise: { radius: 3, at: 'kitchen_table' } } } };
  const h2 = createHarness({ level: at2 });
  h2.begin();
  h2.run('goto coffee_machine');
  h2.run('interact');
  const n2 = h2.log.find((e) => e.name === 'noise');
  const k = spotPos(h2.game, 'kitchen_table');
  ok(n2 && n2.payload.x === k.x && n2.payload.y === k.y && n2.payload.radius === 3, 'noise.at: at the spot');

  const h3 = createHarness({ level });
  h3.begin();
  h3.run('move S 0.4s');
  const p = h3.game.player;
  h3.run('interact');
  const n3 = h3.log.find((e) => e.name === 'noise');
  ok(n3 && Math.abs(n3.payload.x - p.x) < 1e-9 && Math.abs(n3.payload.y - p.y) < 1e-9, `an instant 'self' row: at you (${h3.game.player.focus?.action ?? 'no focus'})`);
}

// 9. Level 1 makes no noise.
{
  const h = createHarness({ level: 'meeting' });
  h.begin();
  while (h.game.phase === 'day') h.frame();
  ok(h.game.clock.minute >= at('4:00') && !h.log.some((e) => e.name === 'noise' || e.name === 'npc:heard'), 'a level-1 day emits no noise or npc:heard');
}

// 10. Tools: the events are fuzz milestones ('noise' a bin key) and the harness says them.
{
  const L = levelData('meeting');
  ok(L.milestones.noise({}) === 'noise' && L.milestones['npc:heard']({ id: 'x' }) === 'heard:x', 'fuzz: noise and heard:<id> milestones for every level');
  ok(L.binKeys.filter((k) => k === 'noise').length === 1 && L.binKeys.slice(0, -1).join() === BASE.gate.binKeys.join(), "fuzz: 'noise' is a bin key, after the level's own");
  const h = createHarness({ level: 'meeting' });
  const lines = h.describeEvents([
    { minute: 1, name: 'noise', payload: { x: 1, y: 1, radius: 3 } },
    { minute: 1, name: 'npc:heard', payload: { id: 'zed' } },
  ]);
  ok(lines.length === 2 && /noise/.test(lines[0]) && /zed looks toward the noise/.test(lines[1]), `harness: ${lines.map((l) => l.trim()).join(' / ')}`);
}

// 11. The fixture level (src/levels/fixture-attention): the printer's noise is what wins it.
{
  const FA = levels['fixture-attention'];
  const play = (level, cmds) => {
    const h = createHarness({ level });
    h.begin();
    for (const c of cmds) if (h.game.phase === 'day' && !h.game.outcome && !h.game.caught) h.run(c);
    while (h.game.phase === 'day' && !h.game.outcome) h.frame();
    return h.game.outcome.result;
  };
  const route = ['goto workstation', 'interact', 'goto donut', 'interact', 'pretend until 2:40'];
  ok(play(FA, route) === 'win', 'fixture: print, run, eat, look busy: win');
  const { noise, ...silent } = FA.interactions.print;
  ok(noise && play({ ...FA, interactions: { ...FA.interactions, print: silent } }, route) !== 'win', 'fixture: the same plan with a silent printer: no win');
  ok(play(FA, route.map((c) => (c === 'goto donut' ? 'goto donut pretend' : c))) === 'caught', 'fixture: strolling over (pretend) is too slow: caught');
}

// 12. Timing: delay, every + while, turn; a new loop drops what is waiting; the validator checks the fields.
{
  const count = (log) => log.filter((e) => e.name === 'noise').length;
  // delay: the noise waits, then sounds where it was set.
  const level = { ...BASE, noises: { 'test:timer': { at: 'player_desk', radius: 30, delay: 2 } } };
  const { game, log } = day(level);
  step(game, 1);
  game.events.emit('test:timer', {});
  ok(count(log) === 0, 'delay: nothing sounds at once');
  step(game, 1.9);
  ok(count(log) === 0, 'delay: nor after 1.9 s');
  step(game, 0.2);
  const c = spotPos(game, 'player_desk');
  const n1 = log.find((e) => e.name === 'noise');
  ok(count(log) === 1 && n1.payload.x === c.x && n1.payload.y === c.y, 'delay: one noise at the spot after 2 s');
  ok(n1 && Object.keys(n1.payload).join() === 'x,y,radius', `delay: the payload is still {x, y, radius} (${n1 && Object.keys(n1.payload)})`);
  step(game, 5);
  ok(count(log) === 1, 'delay: and only one');

  // every + while: repeats while the world says so, and stops for good when it doesn't.
  const g2 = day(BASE);
  g2.game.world.beeping = true;
  const beep = { radius: 30, every: 1, while: (w) => w.beeping };
  setNoise(g2.game, beep, 5, 5);
  ok(count(g2.log) === 1, 'every: the first beep sounds at once');
  step(g2.game, 3.05);
  ok(count(g2.log) === 4, `every: then one a second (${count(g2.log)} in 3 s)`);
  g2.game.world.beeping = false;
  step(g2.game, 1);
  g2.game.world.beeping = true;
  step(g2.game, 3);
  ok(count(g2.log) === 4, 'while: false once, and it stops for good');
  const g2b = day(BASE);
  g2b.game.world.beeping = false;
  setNoise(g2b.game, beep, 5, 5);
  step(g2b.game, 2);
  ok(count(g2b.log) === 0, 'while: false at the first sound, and nothing sounds');
  const g2c = day(BASE);
  g2c.game.world.ding = true;
  setNoise(g2c.game, { radius: 30, delay: 1, while: (w) => w.ding }, 5, 5);
  g2c.game.world.ding = false;
  step(g2c.game, 2);
  ok(count(g2c.log) === 0, 'while: a delayed noise is cancelled when the world changes meanwhile');
  const g2d = day(BASE);
  setNoise(g2d.game, { radius: 30, delay: 1, every: 0.5 }, 5, 5);
  step(g2d.game, 2.05);
  ok(count(g2d.log) === 3, `delay + every: at 1, 1.5 and 2 s (${count(g2d.log)})`);

  // turn: heads stay turned that long.
  const g3 = day(BASE);
  step(g3.game, 1);
  const n = idle(g3.game);
  setNoise(g3.game, { radius: 5, turn: 4 }, behind(n).x, behind(n).y);
  ok(n._heard && Math.abs(n._heard.t - 4) < 1e-9, 'turn: he looks for 4 s');
  step(g3.game, 3.5);
  ok(n._heard !== null, 'turn: still looking after 3.5 s');
  step(g3.game, 0.6);
  ok(n._heard === null, 'turn: and lets go after 4 s');

  // A new loop drops a noise still waiting to sound.
  const g4 = day(BASE);
  setNoise(g4.game, { radius: 30, delay: 1 }, 5, 5);
  g4.game.npcs = createNpcs(g4.game);
  step(g4.game, 2);
  ok(count(g4.log) === 0, 'a new loop drops a waiting noise');

  // The harness: an action row's delayed noise goes off after the action, during a later command.
  const rows = BASE.interactions;
  const [verb] = Object.entries(rows).find(([, r]) => r.on === 'coffee_machine');
  const h = createHarness({ level: { ...BASE, interactions: { ...rows, [verb]: { ...rows[verb], noise: { radius: 30, delay: 3 } } } } });
  h.begin();
  h.run('goto coffee_machine');
  h.run('interact');
  const before = h.log.filter((e) => e.name === 'noise').length;
  h.run('wait 4s');
  ok(before === 0 && h.log.filter((e) => e.name === 'noise').length === 1, `${verb}: the row's delayed noise sounds during the next command`);

  // The validator.
  const probs = levelProblems({ ...BASE, noises: { 'test:x': { at: 'player_desk', radius: 3, delay: -1, every: 0, turn: 'long', while: true } } }, 'meeting');
  ok(['.delay', '.every', '.turn', '.while'].every((k) => probs.some((p) => p.includes(`noises['test:x']${k}`))), `validator: ${probs.filter((p) => p.startsWith('noises')).length} timing problems listed`);
  const rowProbs = levelProblems({ ...BASE, interactions: { ...rows, [verb]: { ...rows[verb], noise: { radius: 3, every: -2 } } } }, 'meeting');
  ok(rowProbs.some((p) => p.includes(`interactions.${verb}.noise.every`)), 'validator: a row noise too');
  ok(levelProblems(BASE, 'meeting').length === 0, 'validator: level 1 is still fine');
}

// 13. ripple: rings you can see, out to the earshot, each time the noise sounds; render state only.
{
  const { game, log } = day(BASE);
  makeNoise(game, { x: 5, y: 5, radius: 4 });
  ok(game.fx.ripples.length === 0, 'no ripple unless the noise asks');
  setNoise(game, { radius: 6, every: 1, ripple: { color: '#f00' } }, 5, 5);
  const r = game.fx.ripples[0];
  ok(game.fx.ripples.length === 1 && r.x === 5 && r.y === 5 && r.radius === 6 && r.color === '#f00', 'a ripple at the noise, as wide as its earshot');
  ok(Object.keys(log.filter((e) => e.name === 'noise').at(-1).payload).join() === 'x,y,radius', 'the noise payload stays {x, y, radius}');
  step(game, 1.01);
  ok(game.fx.ripples.length === 2, 'a repeat ripples again');
  const calls = [];
  const ctx = new Proxy({}, {
    get: (o, k) => (k in o ? o[k] : (...a) => calls.push([k, ...a])),
    set: (o, k, v) => { o[k] = v; return true; },
  });
  updateFx(game, 0.3);
  drawRipples(ctx, game);
  const arcs = calls.filter((c) => c[0] === 'arc');
  ok(arcs.length > 0 && arcs.every((c) => c[3] <= 6 * 32 + 1e-6) && ctx.strokeStyle === '#f00', `drawn as rings no wider than the earshot (${arcs.length} arcs)`);
  updateFx(game, 1);
  ok(game.fx.ripples.length === 0, 'gone after a second');
  calls.length = 0;
  drawRipples(ctx, game);
  ok(calls.length === 0, 'and nothing is drawn without one');
  const probs = levelProblems({ ...BASE, noises: { 'test:x': { at: 'player_desk', radius: 3, ripple: 'big' } } }, 'meeting');
  ok(probs.some((p) => p.includes(`noises['test:x'].ripple`)), 'validator: ripple is true or { color }');
}

// 14. sfx: the noise event names its sound only when the noise has one (audio plays it: tools/test-audio.mjs).
{
  const { game, log } = day(BASE);
  setNoise(game, { radius: 6, sfx: 'machineBeep' }, 5, 5);
  makeNoise(game, { x: 5, y: 5, radius: 6 });
  const ns = log.filter((e) => e.name === 'noise');
  ok(ns[0].payload.sfx === 'machineBeep' && Object.keys(ns[0].payload).join() === 'x,y,radius,sfx', "noise.sfx: 'noise' {x, y, radius, sfx}");
  ok(!('sfx' in ns[1].payload), 'none without it');
  const probs = levelProblems({ ...BASE, noises: { 'test:x': { at: 'player_desk', radius: 3, sfx: 'kazoo' } } }, 'meeting');
  ok(probs.some((p) => p.includes(`noises['test:x'].sfx`)), 'validator: sfx names a recipe in audio/sfx.js');
  ok(!levelProblems({ ...BASE, noises: { 'test:x': { at: 'player_desk', radius: 3, sfx: 'machineBeep' } } }, 'meeting').length, 'validator: a real one is fine');
}

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
