// Headless tests for the darkness mechanic (src/game/darkness.js): a dark room shrinks every view to
// arm's length, except along a torch beam; a lit point is seen as ever, from the dark or the light.
// Uses level 1's map and cast with a darkness block added (the boss's office as the only room).
//
//   node tools/test-darkness.mjs
import { createGame } from '../src/state.js';
import { createNpcs } from '../src/sim/npcs.js';
import { canSee } from '../src/core/vision.js';
import { npcSees, viewerOf, findNpc } from '../src/game/perception.js';
import { isDark, darkZones, dimZones, torchViewer, NEAR_RADIUS } from '../src/game/darkness.js';
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

// 3b. torch.aim points the beam somewhere fixed: a spot, a point or a direction; his glance no longer moves it.
//     rooms[].dip dims a lit room for the render only: sight ignores it, and a dark room does not dip.
{
  let aim = 'boss_door';
  const level = darkLevel({ rooms: [{ ...ROOM, dip: (w) => w.dip ?? 0 }], torch: { ...TORCH, aim: () => aim } });
  ok(levelProblems(level, 'meeting').length === 0, 'a level with torch.aim and rooms[].dip validates');
  const game = day(level);
  const boss = findNpc(game, 'boss');
  game.world.officeLight = 'off';
  game.world.torches = true;
  aim = { x: 7.5, y: 2.5 }; // due east of his chair (4,2)
  const beam = () => torchViewer(game, boss, viewerOf(boss));
  ok(Math.abs(beam().dir) < 1e-9, 'aim at a point: the beam points at it');
  ok(npcSees(game, boss, 6.5, 2.5) && !npcSees(game, boss, 4.5, 5.5), 'he sees along the aim, not along his gaze');
  boss.glance.offset = 40 * DEG;
  ok(Math.abs(beam().dir) < 1e-9, 'a glance does not move an aimed beam');
  boss.glance.offset = 0;
  aim = Math.PI / 2;
  ok(Math.abs(beam().dir - Math.PI / 2) < 1e-9, 'aim as a direction');
  const sp = M.spots.boss_door;
  aim = 'boss_door';
  ok(sp && Math.abs(beam().dir - Math.atan2(sp.y + 0.5 - boss.y, sp.x + 0.5 - boss.x)) < 1e-9, 'aim at a spot name');
  aim = null;
  ok(Math.abs(beam().dir - viewerOf(boss).dir) < 1e-9, 'aim null: his gaze, as without aim');
  aim = 'no_such_spot';
  ok(Math.abs(beam().dir - viewerOf(boss).dir) < 1e-9, 'aim at an unknown spot: his gaze');
  game.world.officeLight = 'on';
  game.world.dip = 0.6;
  ok(dimZones(game).length === 1 && dimZones(game)[0].k === 0.6 && dimZones(game)[0].zones[0] === office, 'a lit room dipping is listed with its zones');
  ok(!isDark(game, 4.5, 4.5) && npcSees(game, boss, 4.5, 5.5), 'a dip is render only: the room is still lit to sight');
  game.world.dip = 0;
  ok(dimZones(game).length === 0, 'dip 0: nothing dims');
  game.world.dip = 0.6;
  game.world.officeLight = 'off';
  ok(dimZones(game).length === 0, 'a dark room does not dip (it is dark)');
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
  const sets = [];
  const fake = createFakeCanvas({
    onCall: (label, method) => { if (label === 'main') calls.push(method); },
    onSet: (label, prop, value) => { if (label === 'main' && (prop === 'fillStyle' || prop === 'strokeStyle')) sets.push(String(value)); },
  });
  fake.installDom({ innerWidth: 960, innerHeight: 600, devicePixelRatio: 1 });
  const { createRenderer } = await import('../src/render/renderer.js');
  const frame = (game) => {
    const r = createRenderer(fake.makeCanvas('main'), { strict: true });
    calls.length = 0;
    sets.length = 0;
    r.render(game);
    frame.sets = sets.slice();
    return calls.slice();
  };
  frame(day(M)); // warm the text-measure cache
  const plain = frame(day(M));
  const level = darkLevel({ rooms: [ROOM], torch: TORCH });
  const lit = frame(day(level));
  const litSets = frame.sets;
  ok(JSON.stringify(lit) === JSON.stringify(plain), 'every light on: the same draw calls as a level without darkness');
  const game = day(level);
  game.world.officeLight = 'off';
  const off = frame(game);
  const offSets = frame.sets;
  // In the dark everyone is redrawn in night colours, so each person stays recognisable (shirt, hair) but dim.
  const { nightColor } = await import('../src/render/darkness.js');
  const { lookFor } = await import('../src/render/characters.js');
  const bossNpc = findNpc(game, 'boss');
  const bossLook = lookFor(level.looks, 'boss', bossNpc.color);
  const count = (list, c) => list.filter((v) => v === c).length;
  ok(nightColor(bossLook.tie) !== bossLook.tie && offSets.includes(nightColor(bossLook.tie)), 'lights off: people are redrawn in night colours');
  ok(!litSets.includes(nightColor(bossLook.tie)), 'every light on: no night colours');
  ok(off.filter((m) => m === 'clip').length > plain.filter((m) => m === 'clip').length, 'lights off: the dark is clipped and veiled');
  game.world.torches = true;
  const torch = frame(game);
  const torchSets = frame.sets;
  // A torch lights its holder: he is drawn again in full colour inside his pool, and his arm holds the phone.
  ok(count(torchSets, bossLook.tie) > count(offSets, bossLook.tie), 'a torch on: its holder is drawn in full colour');
  ok(count(torchSets, bossLook.bodyDark) > count(offSets, bossLook.bodyDark), 'a torch on: his sleeve reaches out to the phone');
  ok(torch.filter((m) => m === 'clip').length > off.filter((m) => m === 'clip').length, 'a torch on: its beam is cut out of the veil');
  // The torch is drawn in his hand: one glow per holder, none for a holder who faces away (his body hides it).
  const glows = (calls) => calls.filter((m) => m === 'createRadialGradient').length;
  const holder = findNpc(game, 'boss');
  const facing = holder.dir;
  holder.dir = -Math.PI / 2;
  const away = frame(game);
  holder.dir = facing;
  ok(glows(torch) === glows(away) + 1, 'a torch on: the phone shows in his hand, but not while he faces away');
  ok(glows(torch) > glows(off), 'a torch on: the beam and the phone glow');
  // A seated holder keeps his torch: sitting lowers the phone but does not hide it.
  const wasPose = holder.pose;
  holder.pose = 'sit';
  const seated = frame(game);
  holder.pose = wasPose;
  ok(glows(seated) === glows(torch), 'a torch on: a seated holder still shows the phone');
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
  // A lit room dipping is veiled at that fraction; dip 0 draws exactly as no dip.
  const dipLevel = darkLevel({ rooms: [{ ...ROOM, dip: (w) => w.dip ?? 0 }], torch: TORCH });
  const dg = day(dipLevel);
  ok(JSON.stringify(frame(dg)) === JSON.stringify(lit), 'dip 0: the same draw calls as no darkness');
  dg.world.dip = 0.5;
  frame(dg);
  ok(frame.sets.includes('rgba(14,20,46,0.400)'), 'dip 0.5: the room is veiled at half strength');
  // Cones on: everyone's arm's-length sight shows over the veil; cones off, it does not.
  const sg = day(level);
  sg.world.officeLight = 'off';
  const coneOn = frame(sg);
  sg.settings.showCones = false;
  const coneOff = frame(sg);
  sg.settings.showCones = true;
  ok(coneOn.filter((m) => m === 'stroke').length > coneOff.filter((m) => m === 'stroke').length, 'cones on: the near sight is outlined over the veil');
  // The lights going out: the daylight cones shrink over DARK_FADE s; a later frame, or a first frame, shows none.
  const fg = day(level);
  fg.time = 10;
  frame(fg); // lit
  fg.time = 10.1;
  fg.world.officeLight = 'off';
  const justDark = frame(fg);
  fg.time = 13;
  const later = frame(fg);
  const fills = (c) => c.filter((m) => m === 'fill').length;
  ok(fills(justDark) > fills(later), 'just gone dark: the daylight cones shrink over the veil');
  const fresh = day(level);
  fresh.world.officeLight = 'off';
  fresh.time = 10;
  ok(fills(frame(fresh)) === fills(later), 'a first frame already dark: no shrink (nothing lights up on a first frame)');
  const gap = day(level);
  gap.time = 10;
  frame(gap);
  gap.time = 20;
  gap.world.officeLight = 'off';
  ok(fills(frame(gap)) === fills(later), 'a frame long after the last: no shrink (nobody saw the lights go)');
  ok(fake.errors.length === 0, `no canvas errors${fake.errors.length ? `: ${fake.errors.slice(0, 3).join('; ')}` : ''}`);
}

// The controls' lamps read at a glance: the shut breaker's green lamp and the switch's amber one are big dots, the
// breaker's on its door's centre line.
{
  const { paintBreaker, paintSwitch } = await import('../src/render/darkness.js');
  const stub = new Proxy({}, { get: (o, k) => (k in o ? o[k] : () => ({ addColorStop() {} })), set: (o, k, v) => { o[k] = v; return true; } });
  const shut = paintBreaker(stub, 50, 50, true, 0);
  ok(shut.idle && shut.r >= 2 && shut.x === 50, 'a shut breaker: a big green lamp on its door, centred');
  const open = paintBreaker(stub, 50, 50, false, 0);
  ok(open.r >= 2 && !open.idle, 'an open breaker: a big red lamp, blinking');
  ok(paintSwitch(stub, 50, 50, false).r >= 1.8 && paintSwitch(stub, 50, 50, true).color === null, 'a switch off: a big amber lamp; on: none');
}

if (fails) {
  console.log(`\n${fails} FAILED`);
  process.exit(1);
}
console.log('\nall darkness tests passed');
