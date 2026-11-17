#!/usr/bin/env node
// Perf: "did this get slower?". Per level, one line: sim cost (ms per 1000 harness frames), render cost (ms per frame through the recording
// fake canvas) and the wall time of replaying the golden corpus, each the median of a few runs, with how noisy the runs were (tools/lib/perf.mjs).
// The numbers are compared with tools/perf-budget.json; exit 1 when one is over 2.5x its budget (wide on purpose: machines and load differ;
// this catches a 10x, not a 10%). Not a test-*.mjs: timing under the parallel check runner would be flaky. Run it on a quiet machine.
//
//   node tools/perf.mjs [--level meeting | --all] [--json] [--repeats 3]
//   node tools/perf.mjs --all --write      record the current numbers as the budget (--level: only that level's line)
import { writeFileSync } from 'node:fs';
import { levels, getLevel, defaultLevel } from '../src/levels/index.js';
import { measureLevel, readBudget, overBudget, perfLine, BUDGET_FILE, LIMIT } from './lib/perf.mjs';

const argv = process.argv;
const arg = (name, def) => { const i = argv.indexOf(`--${name}`); return i > 0 ? argv[i + 1] : def; };
const ids = argv.includes('--all') ? Object.keys(levels) : [arg('level', defaultLevel.id)];
try { ids.forEach(getLevel); } catch (e) { console.error(`perf: ${e.message}`); process.exit(2); }
const repeats = Number(arg('repeats', 3));
process.env.BUSYWORK_CANVAS_DIR ??= new URL('./.deps', import.meta.url).pathname;

const budget = readBudget();
const results = {};
let bad = 0;
for (const id of ids) {
  const m = await measureLevel(id, { repeats });
  results[id] = m;
  const over = overBudget(m, budget[id]);
  if (over.length) bad++;
  if (!argv.includes('--json')) console.log(perfLine(id, m, budget[id], repeats) + (over.length ? `\n  OVER BUDGET (> ${LIMIT}x): ${over.map((o) => `${o.key} ${o.v.toFixed(2)} vs ${o.budget}`).join(', ')}` : ''));
}
if (argv.includes('--json')) console.log(JSON.stringify(results, null, 1));

if (argv.includes('--write')) {
  const r3 = (x) => (x ? Math.round(x.v * 1000) / 1000 : undefined);
  const next = { ...budget };
  for (const id of ids) next[id] = { sim: r3(results[id].sim), render: r3(results[id].render), golden: r3(results[id].golden) };
  const keys = Object.keys(next).sort();
  writeFileSync(BUDGET_FILE, `{\n${keys.map((k) => ` ${JSON.stringify(k)}: ${JSON.stringify(next[k])}`).join(',\n')}\n}\n`);
  console.log(`perf: wrote ${keys.length} levels to tools/perf-budget.json (units: ms/kframe, ms/frame, s)`);
} else if (bad) {
  console.log(`perf: OVER BUDGET on ${bad} level${bad === 1 ? '' : 's'}`);
  process.exit(1);
}
