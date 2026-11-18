#!/usr/bin/env node
// Profile: where one level's simulator spends CPU and memory, for someone making it cheaper. tools/perf.mjs says
// whether a level is over its budget; this says why, and gives a number steady enough to compare two versions.
// It replays a spread of the level's golden plans headless (no drawing), once to warm up, then measured.
//
//   node tools/profile.mjs --level <id> [--plans 60] [--reps 3]    CPU: user-CPU ms per 1000 frames (min and median
//                                                                   of the reps), wall ms, minor+major GCs per rep
//   node tools/profile.mjs --level <id> --alloc [--top 28]         memory: bytes allocated per frame, by function
//   node --cpu-prof --cpu-prof-dir=<dir> tools/profile.mjs --level <id>   a .cpuprofile of the same run (Chrome
//                                                                   DevTools, or any reader of that format)
//
// Reading it:
// - Compare user-CPU, not wall: with other jobs on the machine the wall time swings by half, user-CPU by a few
//   percent. Run both versions back to back, under the same load, and trust a difference only above that noise.
// - A frame is one harness frame, which is one or more sim steps (a `pretend until` fast-forwards).
// - --alloc samples every allocation (objects already collected included). A function's bytes are the ones allocated
//   in its own body, and in callees the JIT inlined into it: a small helper's garbage shows on its caller.
//   Boxed numbers show as the builtin that made them (`hypot`), iterator and spread protocol as `next`.
// - Garbage costs twice: the allocation, and the scavenges it causes (GCs per rep).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PerformanceObserver } from 'node:perf_hooks';
import { Session } from 'node:inspector/promises';
import { createHarness } from '../src/agent/harness.js';
import { getLevel, defaultLevel } from '../src/levels/index.js';

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : def;
};
const MAX_DRAIN_FRAMES = 18000; // frames after a plan's last command: the day's end

// n of the level's golden plans, spread evenly over the file (it is ordered by outcome, so this mixes outcomes).
function corpus(id, n) {
  const file = fileURLToPath(new URL(`../src/levels/${id}/golden.json`, import.meta.url));
  const plans = JSON.parse(readFileSync(file, 'utf8')).plans.map((p) => p.cmds);
  if (plans.length <= n) return plans;
  return Array.from({ length: n }, (_, i) => plans[Math.round((i * (plans.length - 1)) / (n - 1))]);
}

// Plays every plan to the end of its day; returns the frames stepped.
function play(level, plans) {
  let frames = 0;
  for (const cmds of plans) {
    const h = createHarness({ level, onFrame: () => { frames++; } });
    h.begin();
    for (const c of cmds) h.run(c);
    for (let i = 0; i < MAX_DRAIN_FRAMES && h.game.phase === 'day'; i++) h.frame();
  }
  return frames;
}

async function cpu(level, plans, reps) {
  let gcs = 0;
  new PerformanceObserver((l) => { gcs += l.getEntries().length; }).observe({ entryTypes: ['gc'] });
  play(level, plans); // warm: the JIT has compiled the sim before anything is measured
  await new Promise((r) => setTimeout(r, 50)); // the observer reports late: drop the warm-up's GCs
  gcs = 0;
  const runs = [];
  for (let r = 0; r < reps; r++) {
    const c0 = process.cpuUsage();
    const t0 = performance.now();
    const frames = play(level, plans);
    runs.push({ cpu: (process.cpuUsage(c0).user / 1000 / frames) * 1000, wall: ((performance.now() - t0) / frames) * 1000, frames });
  }
  await new Promise((r) => setTimeout(r, 50));
  runs.sort((a, b) => a.cpu - b.cpu);
  console.log(`profile: ${level.id}: user-CPU min ${runs[0].cpu.toFixed(2)} / median ${runs[runs.length >> 1].cpu.toFixed(2)} ms per 1000 frames, `
    + `wall min ${Math.min(...runs.map((o) => o.wall)).toFixed(2)}; ${runs[0].frames} frames over ${plans.length} plans, ${(gcs / reps).toFixed(0)} GCs per rep`);
}

async function alloc(level, plans, top) {
  play(level, plans); // warm: optimised code allocates less than the interpreter
  const s = new Session();
  s.connect();
  await s.post('HeapProfiler.startSampling', { samplingInterval: 4096, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
  const frames = play(level, plans);
  const { profile } = await s.post('HeapProfiler.stopSampling');
  const by = new Map();
  let total = 0;
  (function walk(node) {
    const f = node.callFrame;
    const k = `${f.functionName || '(anon)'} ${f.url.replace(/^.*\/(src|tools)\//, '$1/')}:${f.lineNumber + 1}`;
    by.set(k, (by.get(k) ?? 0) + node.selfSize);
    total += node.selfSize;
    for (const c of node.children) walk(c);
  })(profile.head);
  console.log(`profile: ${level.id}: ${(total / frames).toFixed(0)} bytes allocated per frame (${(total / 1e6).toFixed(0)} MB over ${frames} frames, ${plans.length} plans)`);
  for (const [k, v] of [...by].sort((a, b) => b[1] - a[1]).slice(0, top)) {
    console.log(`${((v / total) * 100).toFixed(1).padStart(5)}%  ${(v / frames).toFixed(0).padStart(6)} B/frame  ${k}`);
  }
}

let level;
try {
  level = getLevel(arg('level', defaultLevel.id));
} catch (e) {
  console.error(`profile: ${e.message}`);
  process.exit(2);
}
const plans = corpus(level.id, Number(arg('plans', 60)));
if (process.argv.includes('--alloc')) await alloc(level, plans, Number(arg('top', 28)));
else await cpu(level, plans, Number(arg('reps', 3)));
