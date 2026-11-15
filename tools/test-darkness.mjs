// Headless tests for the darkness mechanic (src/game/darkness.js): a dark room shrinks every view to
// arm's length, except along a torch beam; a lit point is seen as ever, from the dark or the light.
// Uses level 1's map and cast with a darkness block added (the boss's office as the only room).
//
//   node tools/test-darkness.mjs
import { createGame } from '../src/state.js';
import { createNpcs } from '../src/sim/npcs.js';
import { canSee } from '../src/core/vision.js';
import { npcSees, viewerOf, findNpc } from '../src/game/perception.js';
import { isDark, darkZones, NEAR_RADIUS } from '../src/game/darkness.js';
import { levelProblems } from '../src/levels/validate.js';
import { levels } from '../src/levels/index.js';

const M = levels.meeting;
let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

const DEG = Math.PI / 180;
const office = { x0: 1, y0: 1, x1: 8, y1: 6 }; // the boss's glass office (level 1 map)
const darkLevel = (darkness) => ({ ...M, zones: { ...M.zones, office }, darkness });
const ROOM = { zone: 'office', lit: (w) => w.officeLight !== 'off' };
const TORCH = { when: (n, w) => w.torches === true, fov: 30 * DEG, radius: 7 };

function day(level) {
  const game = createGame({ level });
  game.npcs = createNpcs(game);
  game.phase = 'day';
  return game;
}

// 1. No darkness data: npcSees is exactly canSee, everywhere, for everyone.
{
  const game = day(M);
  let same = true;
  for (const n of game.npcs) {
    for (let y = 0; y < game.map.h; y++) {
      for (let x = 0; x < game.map.w; x++) {
        if (npcSees(game, n, x + 0.5, y + 0.5) !== canSee(game.map, viewerOf(n), x + 0.5, y + 0.5)) same = false;
      }
    }
  }
  ok(same, 'no level.darkness: npcSees === canSee on every tile, for every NPC');
  ok(!isDark(game, 4.5, 3.5) && darkZones(game).length === 0, 'and nothing is dark');
}

// 2. The dark room: the boss at his desk (4,2) faces south through his glass wall.
{
  const level = darkLevel({ rooms: [ROOM], torch: TORCH });
  ok(levelProblems(level, 'meeting').length === 0, 'a level with darkness validates');
  const game = day(level);
  const boss = findNpc(game, 'boss');
  const lin = findNpc(game, 'lin');
  const far = { x: 4.5, y: 5.5 }; // in his office, 3 tiles ahead
  const close = { x: 4.5, y: 3.5 }; // 1 tile ahead
  const floor = { x: 4.5, y: 8.5 }; // the open office, 6 tiles ahead through the glass
  ok(npcSees(game, boss, far.x, far.y), 'lights on: he sees across his office');
  ok(npcSees(game, lin, far.x, far.y), 'lights on: Lin sees into his office through the glass');

  game.world.officeLight = 'off';
  ok(isDark(game, far.x, far.y) && !isDark(game, floor.x, floor.y), 'lights off: his office is dark, the floor is not');
  ok(darkZones(game).length === 1 && darkZones(game)[0] === office, 'darkZones lists the dark rect');
  ok(!npcSees(game, boss, far.x, far.y), 'in the dark he no longer sees 3 tiles ahead');
  ok(npcSees(game, boss, close.x, close.y), `but within ${NEAR_RADIUS} tiles he still does`);
  ok(!npcSees(game, boss, 4.5, 1.5), 'not behind him, though: arm\'s length keeps his field of view');
  ok(npcSees(game, boss, floor.x, floor.y), 'from the dark he sees the lit floor as ever');
  ok(!npcSees(game, lin, far.x, far.y), 'from the light, Lin no longer sees into his dark office');
  ok(npcSees(game, lin, 4.5, 7.5), 'but she sees the lit floor in front of her');

  game.world.torches = true;
  ok(npcSees(game, boss, far.x, far.y), 'his torch on: the beam reaches 3 tiles ahead');
  ok(!npcSees(game, boss, 6.5, 5.5), 'but it is narrow: 34 degrees off his gaze is still dark');
  boss.glance.offset = -34 * DEG; // a glance to his left (east)
  ok(npcSees(game, boss, 6.5, 5.5), 'a glance sweeps the beam onto it');
  ok(!npcSees(game, boss, far.x, far.y), 'and off where he looked before');
  boss.glance.offset = 0;
  game.world.torches = false;
  ok(!npcSees(game, boss, far.x, far.y), 'torch off again: dark again');
  boss.active = false;
  ok(!npcSees(game, boss, close.x, close.y), 'an inactive NPC sees nothing');
}

// 3. Near sight can be tuned; rooms can be lists of zones; a point in no room is lit.
{
  const level = darkLevel({ rooms: [{ zone: ['office', 'meeting_room'], lit: () => false }], near: { radius: 3.2 } });
  const game = day(level);
  const boss = findNpc(game, 'boss');
  ok(isDark(game, 12.5, 3.5) && isDark(game, 4.5, 3.5), 'a room of two zones darkens both');
  ok(npcSees(game, boss, 4.5, 5.5), 'near.radius 3.2: he sees 3 tiles into the dark');
  ok(!npcSees(game, boss, 2.5, 5.5), 'but not 3.6 tiles away');
  ok(!isDark(game, 4.5, 15.5), 'the lobby is in no room: always lit');
}

// 4. The validator names what a darkness block gets wrong.
{
  const bad = darkLevel({ rooms: [{ zone: 'nowhere' }, { zone: ['office', 'nope'], lit: () => true }], near: { radius: 'x' }, torch: { fov: 1 } });
  const probs = levelProblems(bad, 'meeting');
  const has = (re) => probs.some((p) => re.test(p));
  ok(has(/^darkness\.rooms\[0\]\.zone: no zone 'nowhere'/), 'a room naming no zone');
  ok(has(/^darkness\.rooms\[0\]\.lit: not a function/), 'a room without lit()');
  ok(has(/^darkness\.rooms\[1\]\.zone\[1\]: no zone 'nope'/), 'a zone list with a bad name');
  ok(has(/^darkness\.near\.radius: not a number/), 'near.radius not a number');
  ok(has(/^darkness\.torch\.when: not a function/) && has(/^darkness\.torch: fov and radius/), 'a torch without when() or radius');
  const badControls = darkLevel({ rooms: [ROOM], controls: [{ tile: 'Q', kind: 'dimmer' }, { tile: 'R', kind: 'switch', on: () => true }] });
  const cp = levelProblems(badControls, 'meeting');
  const chas = (re) => cp.some((p) => re.test(p));
  ok(chas(/^darkness\.controls\[0\]\.kind: no control 'dimmer'/), 'a control of an unknown kind');
  ok(chas(/^darkness\.controls\[0\]\.tile: 'Q' is not on the map/), 'a control on a letter not on the map');
  ok(chas(/^darkness\.controls\[0\]\.on: not a function/), 'a control without on()');
  ok(!cp.some((p) => p.startsWith('darkness.controls[1]')), 'a good control passes');
}

// 5. Render (fake canvas): a dark room draws its veil, cones clip to the light, a torch cuts a beam; with every
// light on (or no darkness at all) the frame is drawn exactly as before (same calls).
{
  const { createFakeCanvas } = await import('./lib/fake-canvas.mjs');
  const calls = [];
  const fake = createFakeCanvas({ onCall: (label, method, args) => { if (label === 'main') calls.push(method); } });
  fake.installDom({ innerWidth: 960, innerHeight: 600, devicePixelRatio: 1 });
  const { createRenderer } = await import('../src/render/renderer.js');
  const frame = (game) => {
    const r = createRenderer(fake.makeCanvas('main'), { strict: true });
    calls.length = 0;
    r.render(game);
    return calls.slice();
  };
  frame(day(M)); // warm the text-measure cache
  const plain = frame(day(M));
  const level = darkLevel({ rooms: [ROOM], torch: TORCH });
  const lit = frame(day(level));
  ok(JSON.stringify(lit) === JSON.stringify(plain), 'every light on: the same draw calls as a level without darkness');
  const game = day(level);
  game.world.officeLight = 'off';
  const off = frame(game);
  ok(off.filter((m) => m === 'clip').length > plain.filter((m) => m === 'clip').length, 'lights off: the dark is clipped and veiled');
  game.world.torches = true;
  const torch = frame(game);
  ok(torch.filter((m) => m === 'clip').length > off.filter((m) => m === 'clip').length, 'a torch on: its beam is cut out of the veil');
  game.player.x = 3.5;
  game.player.y = 4.5;
  frame(game);
  // Light controls: drawn with every light on too, and differently in each position.
  const CONTROLS = [{ tile: 'R', kind: 'switch', on: (w) => w.officeLight !== 'off' }, { tile: 'E', kind: 'breaker', on: (w) => w.fuse !== 'off' }];
  const withControls = darkLevel({ rooms: [ROOM], torch: TORCH, controls: CONTROLS });
  ok(levelProblems(withControls, 'meeting').length === 0, 'a level with light controls validates');
  const cg = day(withControls);
  const allOn = frame(cg);
  ok(allOn.length > plain.length, 'every light on: the controls still draw');
  cg.world.fuse = 'off';
  const breakerOff = frame(cg);
  ok(JSON.stringify(breakerOff) !== JSON.stringify(allOn), 'the breaker off draws differently from on');
  cg.world.fuse = 'on';
  cg.world.officeLight = 'off';
  const switchOff = frame(cg);
  ok(switchOff.filter((m) => m === 'createRadialGradient').length > allOn.filter((m) => m === 'createRadialGradient').length, 'a switch off lights its lamp');
  ok(fake.errors.length === 0, `no canvas errors${fake.errors.length ? `: ${fake.errors.slice(0, 3).join('; ')}` : ''}`);
}

if (fails) {
  console.log(`\n${fails} FAILED`);
  process.exit(1);
}
console.log('\nall darkness tests passed');
