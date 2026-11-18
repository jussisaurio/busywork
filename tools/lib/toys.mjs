// The gate's two checks on a level's toys (level.toys, src/sim/mechanics/toy.js):
//   toysCheck(levelId)        `toys`: each toy's `try` plan makes it fire, and the frame it fires draws differently
//                             from the same frame with the toy unfired (its prop state, its bubble or its pose shows)
//   toyNeutralCheck(levelId)  `toy-neutral`: every winning plan in the level's golden.json, replayed with every toy
//                             fired over and over (each by the player, and by each of its npcs), gives the same
//                             behaviour trace (tools/lib/trace.mjs) as without: no toy can change what happens
// Each returns { name, ok, text, detail }. Both are cheap (seconds) and need no real canvas (the fake one records
// the draw calls), so tools/test-toys.mjs runs them for every level in tools/check.mjs too.
import { readFileSync, existsSync } from 'node:fs';
import { getLevel } from '../../src/levels/index.js';
import { createRenderer } from '../../src/render/renderer.js';
import { createHarness } from '../../src/agent/harness.js';
import { fire } from '../../src/sim/mechanics/toy.js';
import { createFakeCanvas } from './fake-canvas.mjs';
import { trace } from './trace.mjs';
import { levelFile } from './level-arg.mjs';

const FIRE_EVERY = 20; // frames between forced firings in toy-neutral

let fake = null;
let drawn = [];
function canvas() {
  if (!fake) {
    fake = createFakeCanvas({ onCall: (label, method, args) => { if (label === 'toys') drawn.push(`${method}(${args.map(String).join(',')})`); } });
    fake.installDom({ innerWidth: 960, innerHeight: 600, devicePixelRatio: 1 });
  }
  return fake;
}

// The draw calls of one render of g.
function drawCalls(renderer, g) {
  drawn = [];
  renderer.render(g);
  return drawn.join(';');
}

export function toysCheck(levelId) {
  const level = getLevel(levelId);
  const toys = level.toys ?? [];
  if (!toys.length) return { name: 'toys', ok: true, text: 'no toys', detail: [] };
  const bad = [];
  for (const toy of toys) {
    const renderer = createRenderer(canvas().makeCanvas('toys'), { strict: true });
    let before = null; // the toy and the bubbles a frame ago, to draw the frame it fired without it
    let seen = null;
    const h = createHarness({
      level,
      onFrame(g) {
        if (seen === null && h?.log.some((e) => e.name === `toy:${toy.id}`)) {
          const fired = drawCalls(renderer, g);
          const now = { t: g.toys.byId[toy.id], poses: g.toys.poses, bubbles: g.fx.bubbles };
          g.toys.byId[toy.id] = before.t;
          g.toys.poses = before.poses;
          g.fx.bubbles = g.fx.bubbles.filter((b) => b.toy !== toy.id);
          const unfired = drawCalls(renderer, g);
          g.toys.byId[toy.id] = now.t;
          g.toys.poses = now.poses;
          g.fx.bubbles = now.bubbles;
          seen = fired !== unfired;
        }
        before = { t: structuredClone(g.toys.byId[toy.id]), poses: structuredClone(g.toys.poses) };
      },
    });
    h.begin();
    for (const cmd of toy.try) h.run(cmd);
    if (seen === null) bad.push(`${toy.id}: its try plan never fired it (${toy.try.join(' ; ')})`);
    else if (!seen) bad.push(`${toy.id}: fired, but nothing on screen changed (draw its state, a bubble or a pose)`);
  }
  return bad.length
    ? { name: 'toys', ok: false, text: `${bad.length} of ${toys.length} toys do not fire or show`, detail: bad }
    : { name: 'toys', ok: true, text: `all ${toys.length} toys fire and show: ${toys.map((t) => t.id).join(', ')}`, detail: [] };
}

export function toyNeutralCheck(levelId) {
  const level = getLevel(levelId);
  const toys = level.toys ?? [];
  if (!toys.length) return { name: 'toy-neutral', ok: true, text: 'no toys', detail: [] };
  const file = levelFile(level, 'golden.json');
  const plans = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).plans.filter((p) => p.summary.startsWith('win')) : [];
  if (!plans.length) return { name: 'toy-neutral', ok: false, text: 'no winning plan in golden.json to replay', detail: [] };
  const bad = [];
  for (const p of plans) {
    let n = 0;
    const poke = (g) => {
      if (g.phase !== 'day' || ++n % FIRE_EVERY) return;
      for (const toy of toys) for (const who of ['player', ...(toy.npcs ?? [])]) fire(g, toy, who);
    };
    const plain = trace(p.cmds, level);
    const poked = trace(p.cmds, level, { onFrame: poke });
    const k = plain.digests.findIndex((d, j) => d !== poked.digests[j]);
    if (k >= 0 || plain.summary !== poked.summary) bad.push(`${p.summary}: toys changed step ${k + 1} (${plain.steps[k]?.cmd}), outcome ${poked.summary}: ${p.cmds.join(' ; ')}`);
  }
  return bad.length
    ? { name: 'toy-neutral', ok: false, text: `toys change ${bad.length} of ${plans.length} winning golden plans`, detail: bad.slice(0, 3) }
    : { name: 'toy-neutral', ok: true, text: `toys fired over and over change none of ${plans.length} winning golden plans`, detail: [] };
}
