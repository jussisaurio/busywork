// The context a route check's play(ctx) gets (src/levels/meeting/route-checks.js documents the format). Shared by
// tools/routes.mjs, which verifies the checks, and tools/lib/replay.mjs, which draws them for the replay cold read,
// so a check plays the same way in both.
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { describeEvents } from '../../src/agent/harness.js';
import { formatClock } from '../../src/config.js';
import { findNpc } from '../../src/game/perception.js';
import { levelFile } from './level-arg.mjs';

// h: a harness (createHarness). Returns { g, run, waitFor, npc, transcript, log }.
export function makeCtx(h) {
  const g = h.game;
  const transcript = [];
  const run = (cmd) => {
    const r = h.run(cmd);
    transcript.push(`[${formatClock(g.clock.minute, g.level.day.start)}] > ${cmd} :: ${r.text.replace(/\n/g, ' / ')}`);
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

// Plays one check on harness h (begun): its cmds, or its play(ctx), then the rest of the day. Returns
// { ctx, err } (err: what the check threw, or null).
export function playCheck(h, check) {
  const ctx = makeCtx(h);
  let err = null;
  try {
    if (check.cmds) for (const cmd of check.cmds) ctx.run(cmd);
    else check.play(ctx);
    for (let i = 0; i < 60 * 300 && h.game.phase === 'day'; i++) h.frame(); // make sure the day finishes
  } catch (e) {
    err = e;
  }
  return { ctx, err };
}

// The level's route checks (the default export of its route-checks.js), or null when it has none.
export async function loadChecks(level) {
  const file = levelFile(level, 'route-checks.js');
  if (!existsSync(file)) return null;
  return (await import(pathToFileURL(file).href)).default;
}
