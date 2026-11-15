// Headless tests for the camera (src/sim/mechanics/camera.js): a remote vision cone that counts as seen by
// whoever watches its monitor. Drives the fixture level with a camera bolted on (level data only), so the tests
// do not depend on any level that ships with cameras.
//
//   node tools/test-camera.mjs
import { FIXED_DT, deg } from '../src/config.js';
import { createGame } from '../src/state.js';
import { createNpcs } from '../src/sim/npcs.js';
import { npcSees, seenVia, watcherOf, cameraFeed, findNpc } from '../src/game/perception.js';
import { cameraDir } from '../src/sim/mechanics/camera.js';
import { createHarness } from '../src/agent/harness.js';
import { levelProblems } from '../src/levels/validate.js';
import { levels } from '../src/levels/index.js';
import { drawCones } from '../src/render/cones.js';
import { PROP_PAINTERS } from '../src/render/world.js';
import { drawSightlines } from '../src/render/effects.js';
import { createFakeCanvas } from './lib/fake-canvas.mjs';

const BASE = levels.fixture;
let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

// Doreen (the fixture's authority) sits at (3, 1) facing south. Her monitor stands on her desk, a tile in front
// of her. The camera hangs on the north wall at x 14 and looks east, over the microwave (18, 1), which is far
// beyond her own 8 tiles.
const CAM = {
  id: 'test_cam', x: 14.5, y: 1.5, dir: 0, fov: deg(90), radius: 7,
  monitor: { x: 3.5, y: 2.5 }, npcs: ['doreen'],
  live: (w) => w.camPlug !== 'out',
  aim: (w) => (w.camPushed ? -Math.PI / 2 : null),
};
const SPOT = { x: 18.5, y: 2.5 }; // at the microwave, where you stand to use it
const withCam = (cam = CAM) => ({ ...BASE, cameras: [cam] });

function day(level) {
  const game = createGame({ level });
  game.npcs = createNpcs(game);
  game.phase = 'day';
  return game;
}

// 1. Without cameras, sight is exactly the NPC's own cone (same answers as with a camera nobody watches).
{
  const plain = day(BASE);
  const unwatched = day(withCam({ ...CAM, npcs: ['gus'] })); // Gus never stands at Doreen's monitor
  let same = true;
  let seenSome = 0;
  for (let y = 0.5; y < plain.map.h; y += 1) {
    for (let x = 0.5; x < plain.map.w; x += 1) {
      for (const n of plain.npcs) {
        const a = npcSees(plain, n, x, y);
        const b = npcSees(unwatched, findNpc(unwatched, n.id), x, y);
        if (a !== b) same = false;
        if (a) seenSome++;
      }
    }
  }
  ok(same && seenSome > 0, `a camera nobody watches changes nobody's sight (${seenSome} cells seen either way)`);
  ok(seenVia(plain, plain.npcs[0], SPOT.x, SPOT.y) === null, 'seenVia without cameras: null');
}

// 2. The sweep is a pure function of loop time.
{
  const sweep = { ...CAM, aim: undefined, sweep: { arc: deg(80), period: 8 } };
  const g = day(withCam(sweep));
  const at = (s) => { g.loopTime = s; return cameraDir(g, sweep); };
  ok(Math.abs(at(0) - 0) < 1e-9, 'at loop time 0 it points at dir');
  ok(Math.abs(at(2) - deg(40)) < 1e-9, 'a quarter period on: dir + arc/2');
  ok(Math.abs(at(6) + deg(40)) < 1e-9, 'three quarters: dir - arc/2');
  ok(Math.abs(at(8) - at(0)) < 1e-9 && Math.abs(at(13.7) - at(5.7)) < 1e-9, 'it repeats every period');
  const g2 = day(withCam({ ...sweep, sweep: { ...sweep.sweep, phase: 0.25 } }));
  g2.loopTime = 0;
  ok(Math.abs(cameraDir(g2, { ...sweep, sweep: { ...sweep.sweep, phase: 0.25 } }) - deg(40)) < 1e-9, 'phase 0.25 starts at dir + arc/2');
  ok(cameraDir(g, { ...CAM, aim: undefined }) === 0, 'no sweep: it holds dir');
}

// 3. Watching: Doreen at her desk sees the microwave on her screen, not with her own eyes.
{
  const g = day(withCam());
  const d = findNpc(g, 'doreen');
  ok(watcherOf(g, CAM)?.id === 'doreen', 'Doreen at her desk is watching the monitor');
  ok(npcSees(g, d, SPOT.x, SPOT.y), 'so she sees the microwave');
  ok(seenVia(g, d, SPOT.x, SPOT.y) === CAM, 'through the camera (seenVia)');
  ok(seenVia(g, d, 3.5, 4.5) === null && npcSees(g, d, 3.5, 4.5), 'what she sees with her own eyes is not "via"');
  ok(!npcSees(g, d, 10.5, 8.5), 'a spot neither she nor the camera covers stays unseen');
  ok(!npcSees(g, findNpc(g, 'gus'), SPOT.x, SPOT.y) || seenVia(g, findNpc(g, 'gus'), SPOT.x, SPOT.y) === null, 'Gus is not on the camera');

  const far = day(withCam());
  const fd = findNpc(far, 'doreen');
  fd.x = 8.5;
  fd.y = 4.5;
  ok(!npcSees(far, fd, SPOT.x, SPOT.y) && watcherOf(far, CAM) === null, 'walk away from the monitor (beyond reach) and the screen shows her nothing');
  const turned = day(withCam());
  const td = findNpc(turned, 'doreen');
  td.dir = -Math.PI / 2; // looking at the wall behind her
  td._faceTarget = td.dir;
  ok(!npcSees(turned, td, SPOT.x, SPOT.y), 'turn her back on the monitor: nothing');
  const gone = day(withCam());
  findNpc(gone, 'doreen').active = false;
  ok(!npcSees(gone, findNpc(gone, 'doreen'), SPOT.x, SPOT.y), 'off the floor (inactive): nothing');
}

// 4. Unplugged and pushed: the feed goes dead, and so does the sight.
{
  const g = day(withCam());
  const d = findNpc(g, 'doreen');
  ok(cameraFeed(g, 'test_cam').feed === 'live', "cameraFeed: 'live'");
  g.player.x = SPOT.x;
  g.player.y = SPOT.y;
  const f = cameraFeed(g, 'test_cam');
  ok(f.watcher === 'doreen' && f.blips.some((b) => b.id === 'player'), 'with you on it as a blip, and Doreen as its watcher');
  g.world.camPlug = 'out';
  ok(!npcSees(g, d, SPOT.x, SPOT.y) && cameraFeed(g, 'test_cam').feed === 'static', "unplugged (live false): static, unseen");
  g.world.camPlug = 'in';
  g.world.camPushed = true;
  const w = cameraFeed(g, 'test_cam');
  ok(!npcSees(g, d, SPOT.x, SPOT.y) && w.feed === 'wall' && w.blips.length === 0, "pushed to face the wall (aim): 'wall', unseen");
  ok(Math.abs(w.dir + Math.PI / 2) < 1e-9, 'aim overrides the sweep');
  let threw = false;
  try { cameraFeed(g, 'nope'); } catch { threw = true; }
  ok(threw, 'cameraFeed of an unknown camera throws');
}

// 5. The rules: a sneaky action seen only on the screen. Without the camera the fixture's microwave is safe.
{
  const run = (level) => {
    const h = createHarness({ level });
    h.begin();
    h.run('goto microwave pretend');
    h.game.events.on('caught', () => { h.lineAtCatch = h.game.fx.lines.find((l) => l.from === 'doreen'); });
    h.run('interact');
    h.run('wait 3s');
    return h;
  };
  const plain = run(BASE);
  ok(!plain.game.caught && plain.log.some((e) => e.name === 'popcorn:burning'), 'no camera: the popcorn burns, nobody sees');
  const h = run(withCam());
  const caught = h.log.find((e) => e.name === 'caught');
  ok(caught && caught.payload.by === 'doreen' && caught.payload.via === 'test_cam', `on camera: caught by Doreen via the camera (${JSON.stringify(caught?.payload)})`);
  const ci = h.log.indexOf(caught);
  const said = h.log.slice(0, ci).reverse().find((e) => e.name === 'say' && e.payload.owner === 'doreen');
  ok(said && said.payload.icons.join('') === '📺❗👉', `she points at the screen, then at you (${said?.payload.icons.join('')})`);
  const line = h.lineAtCatch;
  ok(line && line.via && line.via.screen.x === CAM.monitor.x && line.via.lens.x === CAM.x, 'the sightline runs eyes → screen, lens → you');

  const unplugged = createHarness({ level: withCam() });
  unplugged.begin();
  unplugged.game.world.camPlug = 'out';
  unplugged.run('goto microwave pretend');
  unplugged.run('interact');
  unplugged.run('wait 3s');
  ok(!unplugged.game.caught, 'unplugged first: not caught');
}

// 6. The validator knows level.cameras.
{
  ok(levelProblems(withCam(), 'fixture').length === 0, 'a good camera validates');
  const broken = withCam({ ...CAM, id: '', npcs: ['nobody'], monitor: { x: 99, y: 1 }, live: 3, sweep: { arc: 1, period: 0 } });
  const probs = levelProblems(broken, 'fixture');
  for (const f of ['cameras[0].id', 'cameras[0].npcs[0]', 'cameras[0].monitor', 'cameras[0].live', 'cameras[0].sweep']) {
    ok(probs.some((p) => p.startsWith(f)), `flags ${f}`);
  }
}

// 7. Drawing: the camera's cone, its screen in every state, the camera itself and the screen-chain sightline
// draw cleanly (no NaN, no bad colours, no unknown ctx calls) on the recording fake canvas.
{
  const fake = createFakeCanvas();
  const ctx = fake.makeCanvas('main', 960, 600).getContext('2d');
  const g = day(withCam());
  g.settings = { ...(g.settings ?? {}), showCones: true };
  g.player.x = SPOT.x;
  g.player.y = SPOT.y;
  const at = { x: 3, y: 2 };
  const states = [['live', () => {}], ['static', (w) => { w.camPlug = 'out'; }], ['wall', (w) => { w.camPlug = 'in'; w.camPushed = true; }]];
  for (const [name, set] of states) {
    set(g.world);
    fake.scene = `camera ${name}`;
    const shown = cameraFeed(g, 'test_cam');
    ok(shown.feed === name, `feed '${name}'`);
    drawCones(ctx, g, 1.3);
    PROP_PAINTERS.monitor(ctx, {}, at, shown, 1.3);
    PROP_PAINTERS.cctv(ctx, {}, at, shown, 1.3);
  }
  g.fx.lines = [{ from: 'doreen', to: 'player', kind: 'caught', age: 0.3, ttl: 1.6, via: { screen: CAM.monitor, lens: { x: CAM.x, y: CAM.y } } }];
  fake.scene = 'screen chain';
  drawSightlines(ctx, g, 1.3);
  ok(fake.errors.length === 0, `draws cleanly${fake.errors.length ? `: ${fake.errors.slice(0, 3).join('; ')}` : ''}`);
  ok(fake.dashCalls > 0, 'the screen chain is dashed');
}

void FIXED_DT;
if (fails) {
  console.log(`\n${fails} camera test(s) FAILED`);
  process.exit(1);
}
console.log('\ncamera: all tests pass');
