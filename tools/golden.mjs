#!/usr/bin/env node
// Golden traces: proof that a refactor changed nothing. Replays a fixed corpus of harness plans (one per
// distinct outcome the fuzzer found, plus hand-written ones that use raw movement and multiple loops) and
// compares, command by command, a digest of every event (name, exact minute, payload) and a snapshot of
// the contract-level state (player, NPCs, world, suspicion, clock) against the level's golden file,
// src/levels/<id>/golden.json.
//
//   node tools/golden.mjs [--level meeting]    check; exit 1 and show the first divergence on a mismatch
//   node tools/golden.mjs --all                 check every level (also: --write --all)
//   node tools/golden.mjs --write              re-record digests for the current corpus (after an intended change)
//   node tools/golden.mjs --write --from f.json  rebuild the corpus from a `tools/fuzz.mjs --json` dump, plus the
//                                              level's hand-written plans (level.gate.goldenPlans)
//
// Re-record only when a behaviour change is intended, and say so in the commit.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { relative } from 'node:path';
import { createHarness, describeEvents } from '../src/agent/harness.js';
import { allArg, levelArg, levelFile } from './lib/level-arg.mjs';

await allArg('golden');
const LEVEL = levelArg('golden');
const FILE = levelFile(LEVEL, 'golden.json');
const MAX_DRAIN_FRAMES = 60 * 60 * 5;

// Hand-written plans: things the fuzzer's plan language never does (the level's own, in its gate data).
const HAND = LEVEL.gate?.goldenPlans ?? [];

const r6 = (v) => (typeof v === 'number' ? v : v);
function snapshot(g) {
  const p = g.player;
  const prim = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v === null || typeof v !== 'object'));
  return {
    phase: g.phase,
    loop: g.persist.loop,
    routesFound: g.persist.routesFound,
    clock: { minute: g.clock.minute, forced: g.clock.forced, ff: g.clock.ff },
    player: { x: p.x, y: p.y, held: p.held, busy: p.busy, busyPose: p.busyPose, seated: p.seated, smeared: p.smeared, locked: p.locked },
    npcs: g.npcs.map((n) => ({ id: n.id, x: n.x, y: n.y, dir: r6(n.dir), active: n.active, pose: n.pose, override: n.override, carry: n.carry, wants: n.wants })),
    world: { ...prim(g.world), items: g.world.items.map((i) => ({ type: i.type, x: i.x, y: i.y })) },
    suspicion: g.level.roles?.authority ? g.suspicion[g.level.roles.authority.id] : null, // level 1: boss; none without an authority
    outcome: g.outcome ? { result: g.outcome.result, routes: g.outcome.routes } : null,
    caught: g.caught ? g.caught.reason : null,
  };
}

function safeJson(v) {
  const seen = new WeakSet();
  return JSON.stringify(v, (k, x) => {
    if (typeof x === 'function') return undefined;
    if (x && typeof x === 'object') {
      if (seen.has(x)) return '[cycle]';
      seen.add(x);
    }
    return x;
  });
}

const digest = (s) => createHash('sha1').update(s).digest('hex').slice(0, 16);

// Replays one plan; returns one digest per command plus a final one after the day ends.
export function trace(cmds, level = LEVEL) {
  const h = createHarness({ level });
  h.begin();
  const g = h.game;
  let from = 0;
  const step = () => {
    const evs = h.log.slice(from);
    from = h.log.length;
    const s = evs.map((e) => `${e.loop} ${e.minute} ${e.name} ${safeJson(e.payload)}`).join('\n') + '\n' + safeJson(snapshot(g));
    return { d: digest(s), evs };
  };
  const steps = [];
  for (const cmd of cmds) {
    const r = h.run(cmd);
    steps.push({ cmd, ...step(), text: r.text });
  }
  for (let i = 0; i < MAX_DRAIN_FRAMES && g.phase === 'day'; i++) h.frame();
  steps.push({ cmd: '(to end of day)', ...step(), text: '' });
  const o = g.outcome;
  return { digests: steps.map((s) => s.d), steps, summary: o ? `${o.result}${o.routes?.length ? ' ' + [...o.routes].sort().join('+') : ''}` : g.phase };
}

function corpusFromFuzz(path) {
  const j = JSON.parse(readFileSync(path, 'utf8'));
  const plans = Object.values(j.bins).map((b) => b.cmds);
  for (const w of Object.values(j.wins)) if (w.minimal) plans.push(w.minimal);
  return plans;
}

const write = process.argv.includes('--write');
const fromIdx = process.argv.indexOf('--from');
if (write) {
  let plans;
  if (fromIdx > 0) plans = [...corpusFromFuzz(process.argv[fromIdx + 1]), ...HAND];
  else if (existsSync(FILE)) plans = JSON.parse(readFileSync(FILE, 'utf8')).plans.map((p) => p.cmds);
  else throw new Error(`no ${relative(process.cwd(), FILE)} yet: pass --from <fuzz.json> (node tools/fuzz.mjs --level ${LEVEL.id} --json f.json)`);
  const seen = new Set();
  plans = plans.filter((c) => !seen.has(c.join(';')) && seen.add(c.join(';')));
  const out = plans.map((cmds) => {
    const t = trace(cmds);
    return { cmds, summary: t.summary, digests: t.digests };
  });
  writeFileSync(FILE, JSON.stringify({ note: 'written by tools/golden.mjs --write; do not edit by hand', plans: out }, null, 1) + '\n');
  const by = {};
  for (const p of out) by[p.summary.split(' ')[0]] = (by[p.summary.split(' ')[0]] ?? 0) + 1;
  console.log(`golden: ${LEVEL.id}: recorded ${out.length} plans (${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(', ')})`);
} else {
  const { plans } = JSON.parse(readFileSync(FILE, 'utf8'));
  let bad = 0;
  const t0 = performance.now();
  for (const [i, p] of plans.entries()) {
    const t = trace(p.cmds);
    const k = p.digests.findIndex((d, j) => d !== t.digests[j]);
    if (k < 0 && t.digests.length === p.digests.length) continue;
    bad++;
    if (bad > 3) continue;
    const s = t.steps[k] ?? t.steps[t.steps.length - 1];
    console.log(`MISMATCH plan ${i} (expected ${p.summary}, got ${t.summary}) at step ${k + 1}: ${s.cmd}`);
    console.log(`  plan: ${p.cmds.join(' ; ')}`);
    if (s.text) console.log(`  harness: ${s.text.replace(/\n/g, ' / ')}`);
    for (const l of describeEvents(s.evs, { level: LEVEL }).slice(0, 12)) console.log(`  ${l}`);
  }
  const secs = ((performance.now() - t0) / 1000).toFixed(1);
  if (bad) {
    console.log(`golden: ${LEVEL.id}: ${bad}/${plans.length} plans diverged (${secs} s)`);
    process.exit(1);
  }
  console.log(`golden: ${LEVEL.id}: all ${plans.length} plans identical (${secs} s)`);
}
