#!/usr/bin/env node
// Route verification: each level's scripted "speedrun" solutions, played through the AI-agent harness. Each check
// must end with the expected outcome. The checks are the default export of src/levels/<id>/route-checks.js
// (src/levels/meeting/route-checks.js documents the format); a registered level without one fails.
//
//   node tools/routes.mjs [--level <id>] [--verbose]   without --level: every registered level
import { createHarness } from '../src/agent/harness.js';
import { formatClock } from '../src/config.js';
import { levels } from '../src/levels/index.js';
import { levelArg } from './lib/level-arg.mjs';
import { loadChecks, playCheck } from './lib/route-ctx.mjs';

const verbose = process.argv.includes('--verbose');
const LEVELS = process.argv.includes('--level') ? [levelArg('routes')] : Object.values(levels);

let failed = 0;
for (const level of LEVELS) {
  const checks = await loadChecks(level);
  if (!checks) {
    failed++;
    console.log(`FAIL  ${level.id}: no src/levels/${level.id}/route-checks.js`);
    continue;
  }
  if (!Array.isArray(checks) || !checks.length) {
    failed++;
    console.log(`FAIL  ${level.id}: route-checks.js exports no checks`);
    continue;
  }
  for (const sc of checks) {
    const h = createHarness({ level });
    h.begin();
    const { ctx, err } = playCheck(h, sc);
    const o = h.game.outcome;
    const okResult = o && o.result === sc.expect.result;
    const okRoutes = !sc.expect.routes || (o && sc.expect.routes.every((r) => o.routes.includes(r)));
    const pass = !err && okResult && okRoutes;
    if (!pass) failed++;
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${level.id}: ${sc.name}  → ${o ? `${o.result} [${o.routes.join(',')}] @ ${formatClock(o.minute, level.day.start)}` : 'no outcome'}${err ? `  (error: ${err.message})` : ''}`);
    if (verbose || !pass) console.log(ctx.transcript.map((l) => '      ' + l).join('\n'));
  }
}
console.log(failed ? `\n${failed} check(s) failed` : '\nall routes verified');
process.exit(failed ? 1 : 0);
