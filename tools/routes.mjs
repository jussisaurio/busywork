#!/usr/bin/env node
// Route verification: each level's scripted "speedrun" solutions, played through the AI-agent harness. Each check
// must end with the expected outcome. The checks are the default export of src/levels/<id>/route-checks.js
// (src/levels/meeting/route-checks.js documents the format); a registered level without one fails.
//
//   node tools/routes.mjs [--level <id>] [--verbose]   without --level: every registered level
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createHarness, describeEvents } from '../src/agent/harness.js';
import { formatClock } from '../src/config.js';
import { findNpc } from '../src/game/perception.js';
import { levels } from '../src/levels/index.js';
import { levelArg, levelFile } from './lib/level-arg.mjs';

const verbose = process.argv.includes('--verbose');
const LEVELS = process.argv.includes('--level') ? [levelArg('routes')] : Object.values(levels);

// Helpers usable inside scenarios ------------------------------------------------------------
function makeCtx(h) {
  const g = h.game;
  const transcript = [];
  const run = (cmd) => {
    const r = h.run(cmd);
    transcript.push(`[${formatClock(g.clock.minute)}] > ${cmd} :: ${r.text.replace(/\n/g, ' / ')}`);
    for (const l of describeEvents(r.events, { level: g.level })) transcript.push(l);
    if (!r.ok) throw new Error(r.text);
    return r;
  };
  // Tick small slices until pred() is true (pred sees the game). Uses `busy` or `wait` slices.
  const waitFor = (pred, { busy = true, maxSec = 120 } = {}) => {
    for (let i = 0; i < maxSec * 20 && g.phase === 'day'; i++) {
      if (pred(g)) return true;
      run(`${busy ? 'busy' : 'wait'} 0.05s`);
    }
    return pred(g);
  };
  const npc = (id) => findNpc(g, id);
  return { g, run, waitFor, npc, transcript, log: h.log };
}


let failed = 0;
for (const level of LEVELS) {
  const file = levelFile(level, 'route-checks.js');
  if (!existsSync(file)) {
    failed++;
    console.log(`FAIL  ${level.id}: no src/levels/${level.id}/route-checks.js`);
    continue;
  }
  const checks = (await import(pathToFileURL(file).href)).default;
  if (!Array.isArray(checks) || !checks.length) {
    failed++;
    console.log(`FAIL  ${level.id}: route-checks.js exports no checks`);
    continue;
  }
  for (const sc of checks) {
    const h = createHarness({ level });
    h.begin();
    const ctx = makeCtx(h);
    let err = null;
    try {
      if (sc.cmds) for (const cmd of sc.cmds) ctx.run(cmd);
      else sc.play(ctx);
      // make sure the day finishes
      for (let i = 0; i < 60 * 300 && h.game.phase === 'day'; i++) h.frame();
    } catch (e) {
      err = e;
    }
    const o = h.game.outcome;
    const okResult = o && o.result === sc.expect.result;
    const okRoutes = !sc.expect.routes || (o && sc.expect.routes.every((r) => o.routes.includes(r)));
    const pass = !err && okResult && okRoutes;
    if (!pass) failed++;
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${level.id}: ${sc.name}  → ${o ? `${o.result} [${o.routes.join(',')}] @ ${formatClock(o.minute)}` : 'no outcome'}${err ? `  (error: ${err.message})` : ''}`);
    if (verbose || !pass) console.log(ctx.transcript.map((l) => '      ' + l).join('\n'));
  }
}
console.log(failed ? `\n${failed} check(s) failed` : '\nall routes verified');
process.exit(failed ? 1 : 0);
