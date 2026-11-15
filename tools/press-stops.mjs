#!/usr/bin/env node
// Press-frame stops (PRESS_STOPS in src/agent/harness.js): what turning them on changes in each level, and the fix.
// With them on, an interact (or eat) whose press frame fires a stop event pauses at once; the game swallows E
// presses during an act, so one more 'interact' after it finishes the act as before.
//
// Shots: each command that newly pauses gets one 'interact' after it; the shot is drawn the old way (stops on, off)
// and the new way (stops on, with the extra interacts), and the two pictures must be pixel-identical.
// Route checks: their play() is code, so they are only played both ways and each outcome change is listed with the
// commands that newly pause (add an 'interact' after each).
//
//   node tools/press-stops.mjs [--level <id>] [--no-draw]   exit 1 when a shot's fix does not reproduce its picture
import { createHarness } from '../src/agent/harness.js';
import { levels } from '../src/levels/index.js';
import { levelArg } from './lib/level-arg.mjs';
import { loadChecks, playCheck } from './lib/route-ctx.mjs';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { shotsFile, loadShots, renderShot, loadCanvas } from './shots.mjs';

const paused = (text) => /^paused at /.test(text);

// The command texts of `cmds` played from the start of the day.
export function playTexts(level, cmds, pressStops) {
  const h = createHarness({ level, pressStops });
  h.begin();
  return cmds.map((c) => h.run(c).text);
}

// The shot's commands for press-frame stops. Returns { cmds, adds: [{ i, cmd, text }], same } where adds are the
// commands (index into the old cmds) that newly pause, and same says whether every old command's text comes back.
export function fixShot(level, cmds) {
  const old = playTexts(level, cmds, false);
  const h = createHarness({ level, pressStops: true });
  h.begin();
  const out = [];
  const adds = [];
  let same = true;
  cmds.forEach((c, i) => {
    let t = h.run(c).text;
    out.push(c);
    if (paused(t) && !paused(old[i])) {
      adds.push({ i, cmd: c, text: t });
      out.push('interact');
      t = h.run('interact').text;
    }
    if (t !== old[i]) same = false;
  });
  return { cmds: out, adds, same };
}

// Route checks played both ways: [{ name, was, now, pauses: [transcript line] }] for each check whose outcome changes.
export async function checkChanges(level) {
  const checks = (await loadChecks(level)) ?? [];
  const out = [];
  for (const sc of checks) {
    const run = (pressStops) => {
      const h = createHarness({ level, pressStops });
      h.begin();
      const { ctx, err } = playCheck(h, sc);
      const o = h.game.outcome;
      return { ctx, said: `${o ? `${o.result} [${o.routes.join(',')}]` : 'no outcome'}${err ? ` (error: ${err.message})` : ''}` };
    };
    const [a, b] = [run(false), run(true)];
    if (a.said === b.said) continue;
    const before = new Set(a.ctx.transcript.filter((l) => / :: paused at /.test(l)));
    out.push({ name: sc.name, was: a.said, now: b.said, pauses: b.ctx.transcript.filter((l) => / :: paused at /.test(l) && !before.has(l)) });
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const LEVELS = process.argv.includes('--level') ? [levelArg('press-stops')] : Object.values(levels);
  const draw = !process.argv.includes('--no-draw');
  const lib = draw ? loadCanvas() : null;
  let bad = 0;
  for (const level of LEVELS) {
    const lines = [];
    if (existsSync(shotsFile(level.id))) {
      for (const shot of await loadShots(level.id)) {
        const fix = fixShot(level, shot.cmds);
        if (!fix.adds.length) continue;
        let verdict = fix.same ? 'same command results' : 'command results DIFFER';
        if (draw) {
          const a = renderShot(level, shot, lib, { pressStops: false });
          const b = renderShot(level, { ...shot, cmds: fix.cmds }, lib, { pressStops: true });
          verdict = a.png.equals(b.png) ? 'pixel-identical' : `picture DIFFERS (${a.at} before, ${b.at} now)`;
          if (!a.png.equals(b.png)) bad++;
        } else if (!fix.same) bad++;
        lines.push(`  shot ${shot.name}: ${verdict}`);
        for (const x of fix.adds) lines.push(`    add 'interact' after cmds[${x.i}] '${x.cmd}' (now: ${x.text.slice(0, 90)})`);
      }
    }
    for (const c of await checkChanges(level)) {
      lines.push(`  route check "${c.name}": ${c.was} → ${c.now}`);
      for (const l of c.pauses) lines.push(`    newly pauses: ${l.slice(0, 140)}`);
    }
    console.log(`${level.id}: ${lines.length ? '' : 'nothing changes'}`);
    if (lines.length) console.log(lines.join('\n'));
  }
  if (bad) console.log(`\n${bad} shot(s) whose fix does not reproduce the old picture`);
  process.exit(bad ? 1 : 0);
}
