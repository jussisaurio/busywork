// Timing of a level, for tools/perf.mjs and the gate's advisory line. Three numbers, each the median of `repeats` runs over the level's own
// golden plans (nothing invented): sim (ms per 1000 harness frames: stable across levels whose days differ in length), render (ms per frame
// drawn into the recording fake canvas of golden-render.mjs, every RENDER_EVERY-th frame of a few golden-render plans), and golden (wall
// seconds of `node tools/golden.mjs --level <id>`, process start included). Noise is (max - min) / median over the repeats.
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHarness } from '../../src/agent/harness.js';
import { getLevel } from '../../src/levels/index.js';
import { levelFile } from './level-arg.mjs';

export const BUDGET_FILE = fileURLToPath(new URL('../perf-budget.json', import.meta.url));
export const LIMIT = 2.5; // a number over LIMIT x its budget is a regression worth a look; wide, since machines and load differ
const SIM_PLANS = 40; // golden plans replayed for the sim number, spread evenly over the corpus
const RENDER_PLANS = 6;
const RENDER_EVERY = 10;
const DRAIN_FRAMES = 60 * 60 * 5;
export const UNITS = { sim: 'ms/kframe', render: 'ms/frame', golden: 's' };

const spread = (list, n) => (list.length <= n ? list : Array.from({ length: n }, (_, i) => list[Math.round((i * (list.length - 1)) / (n - 1))]));
const plansOf = (level, file) => JSON.parse(readFileSync(levelFile(level, file), 'utf8')).plans.map((p) => p.cmds);

// Median of the repeats and the spread around it: { v, noise }.
export function summarize(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const v = s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
  return { v, noise: v ? (s[s.length - 1] - s[0]) / v : 0 };
}

// Plays one plan to the end of its day; onFrame sees every frame.
function play(level, cmds, onFrame) {
  const h = createHarness({ level, onFrame });
  h.begin();
  for (const c of cmds) h.run(c);
  for (let i = 0; i < DRAIN_FRAMES && h.game.phase === 'day'; i++) h.frame();
}

function simOnce(level, plans) {
  let frames = 0;
  const t0 = performance.now();
  for (const cmds of plans) play(level, cmds, () => { frames++; });
  return ((performance.now() - t0) / frames) * 1000;
}

// Draws into the recording fake canvas with no digesting (golden-render.mjs's hooks are what cost there, not the drawing).
async function renderer() {
  const { createRenderer } = await import('../../src/render/renderer.js');
  const { createFakeCanvas } = await import('./fake-canvas.mjs');
  const fake = createFakeCanvas({ onCall() {}, onSet() {} });
  fake.installDom({ innerWidth: 960, innerHeight: 600, devicePixelRatio: 1 });
  return (level, plans) => {
    let ms = 0;
    let drawn = 0;
    for (const cmds of plans) {
      const r = createRenderer(fake.makeCanvas('main'), { strict: true });
      let n = 0;
      play(level, cmds, (g) => {
        if (n++ % RENDER_EVERY) return;
        const t = performance.now();
        r.render(g);
        ms += performance.now() - t;
        drawn++;
      });
    }
    return ms / drawn;
  };
}

// { sim, render, golden }, each { v, noise } (null when the level has no such golden file).
export async function measureLevel(id, { repeats = 3 } = {}) {
  const level = getLevel(id);
  const runs = (f, warm = true) => { if (warm) f(); return summarize(Array.from({ length: repeats }, f)); }; // one discarded run first: JIT warm-up
  const has = (f) => existsSync(levelFile(level, f));
  const sim = has('golden.json') ? (() => { const p = spread(plansOf(level, 'golden.json'), SIM_PLANS); return runs(() => simOnce(level, p)); })() : null;
  const render = has('golden-render.json') ? (() => { const p = spread(plansOf(level, 'golden-render.json'), RENDER_PLANS); return renderer().then((draw) => runs(() => draw(level, p))); })() : null;
  const golden = has('golden.json') ? runs(() => {
    const t0 = performance.now();
    spawnSync(process.execPath, [fileURLToPath(new URL('../golden.mjs', import.meta.url)), '--level', id], { env: process.env, stdio: 'ignore' });
    return (performance.now() - t0) / 1000;
  }, false) : null;
  return { sim, render: await render, golden };
}

export const readBudget = () => (existsSync(BUDGET_FILE) ? JSON.parse(readFileSync(BUDGET_FILE, 'utf8')) : {});

// Numbers over LIMIT x their budget: [{ key, v, budget }].
export const overBudget = (m, budget) => (budget ? Object.keys(UNITS).filter((k) => m[k] && budget[k] && m[k].v > LIMIT * budget[k]).map((k) => ({ key: k, v: m[k].v, budget: budget[k] })) : []);

// One line: each number with its ratio to the budget, and how noisy the repeats were.
export function perfLine(id, m, budget, repeats) {
  const parts = Object.entries(UNITS).filter(([k]) => m[k]).map(([k, u]) => `${k} ${m[k].v.toFixed(k === 'sim' ? 1 : 2)} ${u}${budget?.[k] ? ` (x${(m[k].v / budget[k]).toFixed(2)})` : ''}`);
  const noise = Math.max(0, ...Object.keys(UNITS).map((k) => m[k]?.noise ?? 0));
  return `${id}: ${parts.join(', ')}; median of ${repeats}, noise up to ${(100 * noise).toFixed(0)}%${budget ? ' (xN: of budget)' : '; no budget recorded'}`;
}
