#!/usr/bin/env node
// Gate: the automated filter a level must pass before a human plays it (tools/lib/*.mjs holds its checks). It runs the
// fuzzer (tools/fuzz.mjs) and fails (exit 1) on any of:
//   routes    a route of the level that no plan wins
//   easy      a win in EASY_STEPS (3) plan steps or fewer (the final stance held until day.meetingAt is not a step)
//   random    random plans winning more than EASY_RATE (1%) of the time
//   crash     any crash or harness error (a command threw, or a day never ended)
//   <lesson>  a win that skips one of the level's mustUse lessons (level 1: pretend; a lesson with `routes`
//             binds only the wins that include one of them)
//   drawn     an emoji drawn as an object in a winning plan (tools/lib/drawn.mjs)
//   contraband  a coworker carrying an item marked contraband for the authority in his view while he enforces,
//             on the do-nothing day or a winning plan (tools/lib/contraband.mjs)
//   cold-read:<pass>  for every level but the fixtures: a cold-read pass (every one in tools/cold-read.mjs PASSES:
//             title, sense, motives, props, joke, premise, verbs, faces, tells, outcomes, pictures, replay) that has
//             not been recorded `works` in src/levels/<id>/cold-read.md for the level as it is now
//             (docs/COLD-READ.md). The gate reads the record; it never runs the readers. Checking freshness draws
//             what the picture passes show, so it needs @napi-rs/canvas (npm install --prefix tools/.deps @napi-rs/canvas).
//   stray     a picture file at the repo root, where no tool writes one (tools/lib/stray.mjs)
// It prints a one-screen report: each way to win with its minimal plan and timing windows, the checks,
// and the verdict. The result depends only on --seed, --budget and --batch, not on the machine.
//
//   node tools/gate.mjs [--level meeting] [--budget 30000] [--seed 1] [--batch 288] [--workers N]
// --budget defaults to the level's gate.budget (a level whose rarest win needs more days says so), else 30000.
//
// Level data (route ids, mustUse lessons, goto targets) comes from the level's folder: fuzz.mjs levelData(id)
// reads level.routes and level.gate (src/levels/meeting/gate.js).
import { fileURLToPath } from 'node:url';
import { fuzz, winLines, combosOf, planToCmds, levelData, DEFAULT_LEVEL, BATCH, EASY_STEPS, EASY_RATE, defaultWorkers } from './fuzz.mjs';
import { drawnCheck, worldGlyphs } from './lib/drawn.mjs';
import { contrabandSeen, contrabandCheck } from './lib/contraband.mjs';
import { coldReadChecks, isFixture } from './cold-read.mjs';
import { strayPictures, strayText } from './lib/stray.mjs';

// Days to fuzz. 30000 days: ~25 s with 12 workers, ~35 s with 6 (14-core laptop).
export const DEFAULT_BUDGET = 30000;

// The days to fuzz level `id`: the --budget given on the command line (a string, or undefined), else the level's
// gate.budget, else DEFAULT_BUDGET. Returns { budget, from } (from: 'flag', 'level' or 'default'). L: levelData(id).
export function gateBudget(id, flag, L = levelData(id)) {
  if (flag !== undefined) return { budget: Number(flag), from: 'flag' };
  const own = L.budget;
  return own !== undefined ? { budget: own, from: 'level' } : { budget: DEFAULT_BUDGET, from: 'default' };
}

const pct = (x) => `${(100 * x).toFixed(2)}%`;

// The verdict, from fuzz() results (or synthetic ones of the same shape: level, wins, randomWins, randomEvaluated,
// crashes, crashCount). L: { routes, mustUse } (levelData(r.level) by default). coldRead: the level's cold read
// checks (tools/cold-read.mjs coldReadChecks); a level that is not a fixture fails without them. stray: pictures at
// the repo root (tools/lib/stray.mjs strayPictures); given, any fails the gate. Returns one
// { name, ok, text, detail: [lines] } per check; the level passes when all are ok.
export function checkGate(r, L = levelData(r.level), { easySteps = EASY_STEPS, easyRate = EASY_RATE, coldRead, stray } = {}) {
  const oneLine = (plan) => planToCmds(plan, levelData(r.level)).join(' ; ');
  const combos = combosOf(r);
  const checks = [];
  const check = (name, ok, text, detail = []) => checks.push({ name, ok, text, detail });

  const missing = L.routes.filter((id) => !combos.some((wk) => wk.split('+').includes(id)));
  check('routes', !missing.length, missing.length
    ? `no plan wins route ${missing.join(', ')}`
    : `every route has a winning plan: ${L.routes.join(', ')}`);

  const steps = (wk) => r.wins[wk].minimal.steps.length;
  const easy = combos.filter((wk) => steps(wk) <= easySteps);
  const fewest = combos.length ? combos.reduce((a, b) => (steps(b) < steps(a) ? b : a)) : null;
  check('easy', !easy.length, easy.length
    ? `win in ${easySteps} steps or fewer: ${easy.map((wk) => `${wk} (${steps(wk)})`).join(', ')}`
    : `no win in ${easySteps} steps or fewer${fewest ? ` (fewest: ${steps(fewest)}, ${fewest})` : ''}`,
  easy.map((wk) => `${wk}: ${oneLine(r.wins[wk].minimal)}`));

  const rate = r.randomWins / Math.max(1, r.randomEvaluated);
  check('random', rate <= easyRate, `random plans win ${r.randomWins}/${r.randomEvaluated} = ${pct(rate)} (limit ${pct(easyRate)})`);

  const crashCount = Math.max(r.crashCount ?? 0, r.crashes.length);
  check('crash', !crashCount, crashCount ? `${crashCount} crashes or harness errors` : 'no crashes or harness errors',
    r.crashes.slice(0, 2).flatMap((c) => [c.error, `  plan: ${c.cmds.join(' ; ')}`]));

  for (const { id, routes } of L.mustUse) {
    const skips = combos.filter((wk) => r.wins[wk].without?.[id]);
    const which = routes ? `${routes.join(' or ')} win` : 'win';
    check(id, !skips.length, skips.length ? `a ${which} without ${id}: ${skips.join(', ')}` : `every ${which} uses ${id}`,
      skips.map((wk) => `${wk}: ${oneLine(r.wins[wk].without[id])}`));
  }
  const d = drawnCheck(r);
  check(d.name, d.ok, d.text, d.detail);
  if (r.contraband) {
    const c = contrabandCheck(r.contraband);
    check(c.name, c.ok, c.text, c.detail);
  }

  if (!isFixture(r.level)) {
    if (coldRead) checks.push(...coldRead);
    else check('cold-read', false, 'the cold reads were not checked', [`see: node tools/cold-read.mjs --status`]);
  }
  if (stray) {
    check('stray', !stray.length, stray.length ? `${stray.length} stray picture${stray.length === 1 ? '' : 's'} at the repo root` : 'no stray pictures at the repo root',
      stray.map(strayText));
  }
  return checks;
}

export function gateReport(r, checks) {
  const lines = [];
  const say = (s = '') => lines.push(s);
  say(`gate: level ${r.level}, seed ${r.seed}, budget ${r.budget}, batch ${r.batch}: ${r.evaluated} days in ${r.secs.toFixed(1)} s (${r.workers} workers), ${r.bins.size} outcome bins`);
  const combos = combosOf(r);
  if (!combos.length) say('\nno wins found');
  for (const wk of combos) {
    say();
    for (const l of winLines(r, wk)) say(l);
  }
  say('\nchecks:');
  const w = Math.max(...checks.map((c) => c.name.length)) + 2;
  for (const c of checks) {
    say(`  ${c.ok ? 'ok  ' : 'FAIL'}  ${c.name.padEnd(w)}${c.text}`);
    for (const d of c.detail) say(`          ${d}`);
  }
  const failed = checks.filter((c) => !c.ok);
  say(failed.length ? `verdict: FAIL (${failed.map((c) => c.name).join(', ')})` : `verdict: PASS: level ${r.level} is ready for a human playtest`);
  return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = (name, def) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : def;
  };
  const level = arg('level', DEFAULT_LEVEL);
  try {
    levelData(level);
  } catch (e) {
    console.error(`gate: ${e.message}`);
    process.exit(2);
  }
  const days = gateBudget(level, arg('budget'));
  const opts = {
    level,
    budget: days.budget,
    seed: Number(arg('seed', 1)),
    batch: Number(arg('batch', BATCH)),
    workers: Number(arg('workers', defaultWorkers())),
  };
  const from = { flag: '--budget', level: "the level's gate.budget", default: 'the default' }[days.from];
  console.error(`gate: fuzzing level ${opts.level} (budget ${opts.budget}: ${from}, ${opts.workers} workers)...`);
  try {
    const r = await fuzz(opts);
    const plans = combosOf(r).map((wk) => planToCmds(r.wins[wk].minimal, levelData(opts.level)));
    r.glyphs = worldGlyphs(opts.level, plans);
    r.contraband = contrabandSeen(opts.level, [[], ...plans]);
    const coldRead = isFixture(level) ? undefined : await coldReadChecks(level);
    const checks = checkGate(r, levelData(opts.level), { coldRead, stray: strayPictures() });
    console.log(gateReport(r, checks));
    process.exitCode = checks.every((c) => c.ok) ? 0 : 1;
  } catch (e) {
    console.log(`gate: level ${opts.level}\nverdict: FAIL (crash: the fuzzer itself failed)\n${e?.stack ?? e}`);
    process.exitCode = 1;
  }
}
