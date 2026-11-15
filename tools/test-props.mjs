// Level prop painters: a decor.props entry's draw names a renderer painter (render/world.js PROP_PAINTERS) or is
// the level's own function, called the same way, (ctx, info, tile, shown, t), so a level can draw its own
// furniture from its folder. Checks the validator, one rendered frame on a fake canvas, and every level's props
// over a whole day (a frame every half second).
//   node tools/test-props.mjs
import { createFakeCanvas } from './lib/fake-canvas.mjs';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

const fake = createFakeCanvas({});
const { createRenderer } = await import('../src/render/renderer.js');
const { levelProblems } = await import('../src/levels/validate.js');
const { levels } = await import('../src/levels/index.js');
fake.installDom();
const { createHarness } = await import('../src/agent/harness.js');

const M = levels.meeting;
const calls = [];
function painter(ctx, info, tile, shown, t) {
  calls.push({ ctx, info, tile, shown, t });
  ctx.save();
  ctx.fillStyle = '#123456';
  ctx.fillRect(tile.x * 32, tile.y * 32, 8, 8);
  ctx.restore();
}
const i = M.decor.props.findIndex((p) => p.draw === 'coatRack');
const props = M.decor.props.map((p, k) => (k === i ? { ...p, draw: painter } : p));
const level = { ...M, decor: { ...M.decor, props } };

// 1. The validator takes a function, and still rejects a name it has no painter for.
ok(levelProblems(level, 'meeting').length === 0, 'a level painter function is a valid draw');
const named = levelProblems({ ...M, decor: { ...M.decor, props: [{ ...M.decor.props[0], draw: 'hologram' }] } }, 'meeting');
ok(named.some((p) => /draw: no painter 'hologram' \(a function, or one of /.test(p)), 'an unknown painter name is still an error');

// 2. A frame calls it once, with the canvas, the map info, the prop's tile, its state(world, game) and the time.
const h = createHarness({ level: 'meeting' });
const g = h.game;
h.begin();
h.run('wait 1s');
g.level = level;
const canvas = fake.makeCanvas('main');
const renderer = createRenderer(canvas, { strict: true });
renderer.render(g);
const row = M.map.rows.findIndex((r) => r.includes(M.decor.props[i].tile));
const col = M.map.rows[row].indexOf(M.decor.props[i].tile);
const c = calls[0];
ok(calls.length === 1, `called once per frame (${calls.length})`);
ok(c && c.tile.x === col && c.tile.y === row, `on the prop's tile (${c && c.tile.x},${c && c.tile.y}) = (${col},${row})`);
ok(c && JSON.stringify(c.shown) === JSON.stringify(M.decor.props[i].state(g.world, g)), 'shown is state(world, game)');
ok(c && typeof c.t === 'number' && c.info && c.info.props && typeof c.ctx.fillRect === 'function', 'with the time, the map info and a canvas');
ok(fake.errors.length === 0, `the frame draws cleanly ${fake.errors.slice(0, 3).join(' ')}`);

// 3. Every level's props over the whole day, not one frame: a do-nothing day rendered every SWEEP frames, so a
// prop that changes or moves mid-loop (its state, the time) is drawn in each of its looks. Every frame clean.
const SWEEP = 30;
for (const id of Object.keys(levels)) {
  const lh = createHarness({ level: id });
  const lg = lh.game;
  const r = createRenderer(fake.makeCanvas(`sweep ${id}`), { strict: true });
  const before = fake.errors.length;
  const looks = new Set();
  let frames = 0;
  let threw = null;
  const clear = lg.input.clearPresses;
  lg.input.clearPresses = () => {
    clear();
    if (++frames % SWEEP || threw) return;
    try { r.render(lg); } catch (e) { threw = e; }
    for (const pr of lg.level.decor?.props ?? []) if (pr.state) looks.add(`${pr.tile}:${JSON.stringify(pr.state(lg.world, lg))}`);
  };
  lh.begin();
  for (let k = 0; k < 60 * 60 * 5 && lg.phase === 'day' && !threw; k++) lh.frame();
  ok(!threw && fake.errors.length === before, `${id}: props drawn over the day, ${Math.floor(frames / SWEEP)} frames, ${looks.size} prop looks${threw ? `: threw ${threw.message}` : ''} ${fake.errors.slice(before, before + 2).join(' ')}`);
}

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
