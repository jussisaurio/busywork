#!/usr/bin/env node
// Golden renders: proof that a refactor didn't change a pixel's worth of drawing. Replays a small corpus of
// harness plans and renders frames into the recording fake canvas (tools/lib/fake-canvas.mjs): after every
// command, paused after the first one, at the end of the frame of each notable event and again 20 frames
// later (particles in flight, forced work under way), and over the end screen. Each render is digested (every ctx call and property set, numbers rounded to
// 1e-3, measureText and other queries left out) and compared against tools/golden-render.json. A property set only
// counts once a call on that canvas follows it, so a set overwritten before any call (it draws nothing) is left out,
// and the sets between two calls are digested in name order (they commute).
// Math.random (only fx particles use it) is seeded per plan here, and each plan gets a fresh game and renderer.
//
//   node tools/golden-render.mjs           check; exit 1 and name the first render that differs
//   node tools/golden-render.mjs --write   re-record (plans come from golden-render.json, else PICK below)
//
// Re-record only when a visual change is intended, and say so in the commit.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRenderer } from '../src/render/renderer.js';
import { createHarness } from '../src/agent/harness.js';
import { updateFx } from '../src/core/fx.js';
import { createFakeCanvas } from './lib/fake-canvas.mjs';

const FILE = fileURLToPath(new URL('./golden-render.json', import.meta.url));
const GOLDEN = fileURLToPath(new URL('./golden.json', import.meta.url));
const MAX_DRAIN_FRAMES = 60 * 60 * 5;
const LATER = 20;
// Indices into tools/golden.json for the first --write. Between them: projector broken + sparks and the fix,
// keycard lockout and recovery, sandwich eaten (mustard) and returned, coffee confiscated, caught, every
// blamed and win end screen, forced work, item drop/pickup, and the multi-loop hand-written plan.
const PICK = [0, 5, 6, 8, 10, 12, 14, 18, 19, 21, 23, 41, 55, 82, 111, 134, 159, 160, 161, 162];
const NOTABLE = new Set([
  'caught', 'projector:broken', 'projector:fixing', 'projector:fixed', 'boss:bang', 'boss:lockedOut', 'boss:workAssigned',
  'work:done', 'sandwich:eaten', 'sandwich:returned', 'keycard:taken', 'keycard:recovered', 'coffee:confiscated',
  'item:drop', 'item:pickup', 'witness:tattle', 'kev:alerted', 'meeting:gather', 'day:end', 'loop:start', 'player:sit',
]);
const END_STEPS = [0, 0.15, 0.4, 0.8, 1.5, 3, 6];

const r3 = (v) => {
  const x = Math.round(v * 1000) / 1000;
  return Object.is(x, -0) ? 0 : x;
};
function fmt(v) {
  if (typeof v === 'number') return String(r3(v));
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(fmt).join(',')}]`;
  if (v && typeof v === 'object') return v.getContext ? 'canvas' : 'obj';
  return String(v);
}
const QUERY = /^(get|measureText|isPointIn)/;

let hash = null;
const pending = new Map(); // canvas label -> Map(prop -> value) set since that canvas's last call
function flush(label) {
  const sets = pending.get(label);
  if (!sets || !sets.size) return;
  const name = label.replace(/\d+$/, '');
  for (const key of [...sets.keys()].sort()) hash.update(`${name} ${key}=${fmt(sets.get(key))}\n`);
  sets.clear();
}
const fake = createFakeCanvas({
  onCall(label, key, args) {
    if (!hash) return;
    flush(label);
    if (!QUERY.test(key)) hash.update(`${label.replace(/\d+$/, '')} ${key} ${args.map(fmt).join(',')}\n`);
  },
  onSet(label, key, value) {
    if (!hash) return;
    if (!pending.has(label)) pending.set(label, new Map());
    pending.get(label).set(key, value);
  },
});
fake.installDom({ innerWidth: 960, innerHeight: 600, devicePixelRatio: 1 });

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Replays one plan; returns one digest per render plus a label saying where it was taken.
function renderTrace(cmds, seed) {
  Math.random = seeded(seed);
  const h = createHarness();
  const g = h.game;
  const renderer = createRenderer(fake.makeCanvas('main'), { strict: true });
  const out = [];
  const draw = (label) => {
    fake.scene = label;
    hash = createHash('sha1');
    pending.clear();
    renderer.render(g);
    for (const l of pending.keys()) flush(l);
    out.push({ label, d: hash.digest('hex').slice(0, 16) });
    hash = null;
    for (const c of fake.contexts) {
      const st = c.__state;
      if (st.depth || st.underflow) fake.fail(`save/restore imbalance on ${st.label}: depth ${st.depth} underflow ${st.underflow}`);
      st.depth = 0;
      st.underflow = 0;
    }
  };

  let frameNo = 0;
  let now = [];
  const later = new Map();
  g.events.on('*', (name) => {
    if (NOTABLE.has(name)) now.push(name);
  });
  const clear = g.input.clearPresses;
  g.input.clearPresses = () => {
    clear();
    frameNo++;
    const due = later.get(frameNo);
    if (due) {
      later.delete(frameNo);
      draw(`${due.join('+')} +${LATER}f`);
    }
    if (now.length) {
      const names = now;
      now = [];
      draw(names.join('+'));
      later.set(frameNo + LATER, names);
    }
  };

  h.begin();
  draw('begin');
  for (const [i, cmd] of cmds.entries()) {
    h.run(cmd);
    draw(`after cmd ${i + 1}: ${cmd}`);
    if (i === 0 && g.phase === 'day') {
      g.paused = true;
      draw('paused');
      g.paused = false;
    }
  }
  for (let i = 0; i < MAX_DRAIN_FRAMES && g.phase === 'day'; i++) h.frame();
  for (const dt of END_STEPS) {
    g.time += dt;
    updateFx(g, dt);
    draw(`${g.phase} +${dt}s`);
  }
  const o = g.outcome;
  return { renders: out, summary: o ? `${o.result}${o.routes?.length ? ' ' + [...o.routes].sort().join('+') : ''}` : g.phase };
}

function finish() {
  if (!fake.errors.length) return;
  console.log(`golden-render: the fake canvas saw ${fake.errors.length} bad draw calls:`);
  for (const e of fake.errors.slice(0, 20)) console.log(`  ${e}`);
  process.exit(1);
}

const write = process.argv.includes('--write');
if (write) {
  const plans = existsSync(FILE)
    ? JSON.parse(readFileSync(FILE, 'utf8')).plans.map((p) => p.cmds)
    : PICK.map((i) => JSON.parse(readFileSync(GOLDEN, 'utf8')).plans[i].cmds);
  const out = plans.map((cmds, i) => {
    const t = renderTrace(cmds, i + 1);
    return { cmds, summary: t.summary, renders: t.renders.map((r) => r.d) };
  });
  finish();
  writeFileSync(FILE, JSON.stringify({ note: 'written by tools/golden-render.mjs --write; do not edit by hand', plans: out }, null, 1) + '\n');
  const n = out.reduce((s, p) => s + p.renders.length, 0);
  console.log(`golden-render: recorded ${n} renders over ${out.length} plans (${[...new Set(out.map((p) => p.summary))].join(', ')})`);
} else {
  const { plans } = JSON.parse(readFileSync(FILE, 'utf8'));
  let bad = 0;
  let n = 0;
  const t0 = performance.now();
  for (const [i, p] of plans.entries()) {
    const t = renderTrace(p.cmds, i + 1);
    n += t.renders.length;
    const k = p.renders.findIndex((d, j) => d !== t.renders[j]?.d);
    if (k < 0 && t.renders.length === p.renders.length) continue;
    bad++;
    if (bad > 3) continue;
    const at = k < 0 ? p.renders.length : k;
    console.log(`MISMATCH plan ${i} (expected ${p.summary}, got ${t.summary}) at render ${at + 1}/${p.renders.length}: ${t.renders[at]?.label ?? '(missing)'}`);
    console.log(`  plan: ${p.cmds.join(' ; ')}`);
  }
  finish();
  const secs = ((performance.now() - t0) / 1000).toFixed(1);
  if (bad) {
    console.log(`golden-render: ${bad}/${plans.length} plans drew differently (${secs} s)`);
    process.exit(1);
  }
  console.log(`golden-render: all ${n} renders over ${plans.length} plans identical (${secs} s)`);
}
