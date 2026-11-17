#!/usr/bin/env node
// State-space fuzzer: searches for player plans that do surprising things, especially wins that are
// too easy. A plan is a short list of harness macro-steps (goto X [pretend], do, sit, pretend/wait
// until T, pretend/wait N seconds, and put S [pretend] in levels with spots that take items), then a stance held
// until the level's day.meetingAt. The day is deterministic, so every
// candidate replays from 2:30 (a day costs ~5-30 ms headless).
//
// Search: MAP-Elites. Every run is binned by what happened (result, routes, milestones such as
// "coffee poured", "keycard taken", "caught"). Each bin keeps its simplest plan (fewest steps); new
// candidates are mutations/crossovers of elites. Winning elites are then shrunk (drop steps while the
// same win survives), so the report shows the minimal plan for every way to win.
//
//   node tools/fuzz.mjs [--level meeting] [--budget 6000] [--seed 1] [--batch 288] [--workers N] [--json out.json] [--verbose]
//
// The archive depends only on --level, --seed, --budget and --batch (plans per generation), never on --workers
// or the machine, so a seed reproduces anywhere.
//
// Flags in the report are heuristics for a designer to look at, not test failures (tools/gate.mjs turns
// them into a pass/fail verdict):
//   EASY      a win whose minimal plan has <= EASY_STEPS steps, or random plans win too often
//   NO-<LESSON> a win that skips one of the level's mustUse lessons (level 1: NO-PRETEND; a lesson with `routes`
//             binds only the wins that include one of them)
//   NO-WIN    a route of the level that no plan won
//   CRASH     a command threw or a day never ended (a game bug, or a harness bug)
// The report also lists the time span of each route's key action across all wins found: the real
// windows, to compare with the ones the level's LEVEL.md claims.
//
// As a module: fuzz(opts) runs the search and returns plain results; report(), winLines() and toJson()
// format them; evaluate(plan, L) plays one plan of the level levelData(id) describes. tools/gate.mjs uses
// all of these.
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { availableParallelism } from 'node:os';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { jobs } from './lib/jobs.mjs';
import { createHarness } from '../src/agent/harness.js';
import { createRng } from '../src/core/rng.js';
import { at, clockArg } from '../src/config.js';
import { getLevel, defaultLevel } from '../src/levels/index.js';

// =================================================================================================
// LEVEL DATA: everything tools/fuzz.mjs and tools/gate.mjs know about a level comes from its folder: the
// route ids (level.routes), the level's day (day.meetingAt ends every plan) and level.gate (mustUse lessons,
// goto targets, milestones, bins, key actions; src/levels/meeting/gate.js documents the shape).
export const DEFAULT_LEVEL = defaultLevel.id;
// Milestones every level gets for the engine's own mechanics (the level's gate.milestones win on a clash):
// attention's noises (src/sim/mechanics/attention.js), put-downs (putdown.js) and inspections (inspection.js).
// 'noise' is also a bin key; the others count in a level's bins only if its gate.binKeys lists them. A level
// that never fires one never sees it, so its results don't change.
const ENGINE_MILESTONES = {
  noise: () => 'noise',
  'npc:heard': (p) => `heard:${p.id}`,
  'item:put': (p) => `put@${p.spot}`,
  'inspect:pass': (p) => `tick${p.index}`,
  'inspect:fail': (p) => `cross${p.index}`,
  'inspect:done': (p) => (p.failed === null ? 'inspected' : 'flunked'),
  'inspect:moved': () => 'moved',
};
const ENGINE_BIN_KEYS = ['noise'];
const data = {};
export function levelData(id) {
  if (data[id]) return data[id];
  const level = getLevel(id); // throws on an unknown id, listing the registry
  if (!level.gate) throw new Error(`level '${id}' has no gate data (level.gate, see src/levels/meeting/gate.js)`);
  const meetingAt = level.day.meetingAt;
  // lastMinute: the last minute a timed wait can end on (3:59 in level 1).
  // putSpots: where a plan can `put` (the spots that take items, mechanics/putdown.js).
  // edible: some item can be eaten (a plan's `eat`: holding E, since a tap drops it).
  const putSpots = Object.keys(level.spots).filter((name) => level.spots[name].accepts?.length);
  const edible = Object.values(level.items ?? {}).some((item) => item.edible);
  const { milestones, binKeys } = level.gate;
  return (data[id] = {
    id,
    routes: level.routes.map((r) => r.id),
    ...level.gate,
    milestones: { ...ENGINE_MILESTONES, ...milestones },
    binKeys: [...binKeys, ...ENGINE_BIN_KEYS.filter((k) => !binKeys.includes(k))],
    start: level.day.start,
    meetingAt,
    lastMinute: meetingAt - 1,
    putSpots,
    edible,
  });
}
// =================================================================================================

const SELF = fileURLToPath(import.meta.url);
export const EASY_STEPS = 3; // a win in this few steps is suspicious
export const EASY_RATE = 0.01; // so is a random plan winning more than 1% of the time
// Plans per MAP-Elites generation. A constant, not derived from the core count: the archive must not depend
// on the machine. 288 = 12 workers x 24.
export const BATCH = 288;
export const defaultWorkers = () => jobs(Math.max(1, availableParallelism() - 2));
const DRAIN_FRAMES = 20000; // frames run after the plan's last command; a day still going after that is a bug

// Game minute -> "3:12", the clock form `wait/pretend until` takes, in the level's day (L.start).
export const fmt = (m, L) => clockArg(Math.round(m), L.start);

// ---------------------------------------------------------------------------------------------
// Plans

function stepToCmd(s, L) {
  switch (s.k) {
    case 'goto': return `goto ${s.t}${s.busy ? ' pretend' : ''}`;
    case 'do': return 'interact';
    case 'eat': return 'eat';
    case 'sit': return 'sit pretend';
    case 'put': return `put ${s.t}${s.busy ? ' pretend' : ''}`;
    case 'until': return `${s.busy ? 'pretend' : 'wait'} until ${fmt(s.m, L)}`;
    case 'for': return `${s.busy ? 'pretend' : 'wait'} ${s.s}s`;
    default: throw new Error(`bad step ${JSON.stringify(s)}`);
  }
}
// L: levelData(id); the final stance is held until the level's meeting.
export const planToCmds = (plan, L) => [...plan.steps.map((s) => stepToCmd(s, L)), `${plan.endBusy ? 'pretend' : 'wait'} until ${fmt(L.meetingAt, L)}`];

function randomStep(rng, L) {
  // Only levels with spots that take items put things down (no rng draw otherwise: level 1's plans stay the same).
  if (L.putSpots?.length && rng.chance(0.12)) return { k: 'put', t: rng.pick(L.putSpots), busy: rng.chance(0.6) };
  const r = rng.next();
  if (r < 0.42) {
    const t = rng.chance(0.55) ? rng.pick(L.interactable) : rng.pick(L.targets);
    return { k: 'goto', t, busy: rng.chance(0.6) };
  }
  // Only levels with something edible eat (no rng draw otherwise).
  if (r < 0.62) return L.edible && rng.chance(0.3) ? { k: 'eat' } : { k: 'do' };
  if (r < 0.82) return { k: 'until', m: rng.int(1, L.lastMinute), busy: rng.chance(0.7) };
  if (r < 0.94) return { k: 'for', s: rng.pick([0.5, 1, 1.5, 2, 3, 5, 8]), busy: rng.chance(0.6) };
  return { k: 'sit' };
}

function randomPlan(rng, L) {
  const steps = [];
  const n = rng.int(2, 10);
  while (steps.length < n) {
    const s = randomStep(rng, L);
    steps.push(s);
    if (s.k === 'goto' && L.interactable.includes(s.t) && rng.chance(0.65)) steps.push({ k: 'do' });
  }
  return { steps, endBusy: rng.chance(0.7) };
}

const clone = (p) => ({ steps: p.steps.map((s) => ({ ...s })), endBusy: p.endBusy });

function mutate(rng, L, plan, other) {
  const p = clone(plan);
  const ops = rng.int(1, 3);
  for (let i = 0; i < ops; i++) {
    const n = p.steps.length;
    const pos = rng.int(0, Math.max(0, n - 1));
    const r = rng.next();
    if (r < 0.22 || n === 0) {
      const s = randomStep(rng, L);
      p.steps.splice(rng.int(0, n), 0, s);
      if (s.k === 'goto' && L.interactable.includes(s.t) && rng.chance(0.5)) p.steps.splice(p.steps.indexOf(s) + 1, 0, { k: 'do' });
    } else if (r < 0.37) {
      p.steps.splice(pos, 1);
    } else if (r < 0.5) {
      p.steps[pos] = randomStep(rng, L);
    } else if (r < 0.7) {
      // Nudge a time: the main way to find (and probe the edges of) a window.
      const idx = p.steps.findIndex((s, j) => j >= pos && (s.k === 'until' || s.k === 'for'));
      const s = p.steps[idx];
      if (s?.k === 'until') s.m = Math.max(1, Math.min(L.lastMinute, s.m + rng.pick([-6, -3, -2, -1, 1, 2, 3, 6])));
      else if (s?.k === 'for') s.s = Math.max(0.25, +(s.s * rng.pick([0.5, 0.75, 1.5, 2])).toFixed(2));
    } else if (r < 0.8) {
      const s = p.steps[pos];
      if (s && 'busy' in s) s.busy = !s.busy;
      else p.endBusy = !p.endBusy;
    } else if (r < 0.88 && n > 1) {
      const j = Math.min(n - 1, pos + 1);
      [p.steps[pos], p.steps[j]] = [p.steps[j], p.steps[pos]];
    } else if (other) {
      // Crossover: our head + their tail.
      const cut = rng.int(0, n);
      const cut2 = rng.int(0, other.steps.length);
      p.steps = [...p.steps.slice(0, cut), ...other.steps.slice(cut2).map((s) => ({ ...s }))];
    }
  }
  if (p.steps.length > 16) p.steps.length = 16;
  return p;
}

// ---------------------------------------------------------------------------------------------
// Evaluation (runs in workers)

// The ids of the level's mustUse lessons a day used. ran: the plan commands that actually ran;
// log: the harness event log.
export function usedLessons(L, ran, log) {
  const used = (l) => {
    if (l.cmd) return ran.some((c) => c.split(' ').includes(l.cmd));
    if (l.event) return log.some((e) => e.name === l.event);
    throw new Error(`mustUse ${l.id}: needs cmd or event`);
  };
  return L.mustUse.filter(used).map((l) => l.id);
}

// The ids of the mustUse lessons a win skipped. A lesson with `routes` only binds wins that include one of them
// (a level whose mechanic is one route's: the other routes needn't use it). res: { routes, used }.
export function skippedLessons(L, res) {
  return L.mustUse.filter((l) => !res.used.includes(l.id) && (!l.routes || l.routes.some((r) => res.routes.includes(r)))).map((l) => l.id);
}

export function evaluate(plan, L = levelData(DEFAULT_LEVEL)) {
  const h = createHarness({ level: L.id });
  h.begin();
  const g = h.game;
  let error = null;
  const ran = [];
  for (const cmd of planToCmds(plan, L)) {
    if (g.phase !== 'day' || g.outcome || g.caught) break;
    // Skip a wait whose time has passed (the harness would no-op it anyway).
    const until = cmd.match(/until (\d+:\d+)$/);
    if (until && at(until[1], L.start) <= g.clock.minute) continue;
    const r = h.run(cmd);
    const noop = /no path|nothing to interact|nothing to put down/.test(r.text);
    if (!r.ok && !noop) {
      error = `${cmd} :: ${r.text}`;
      break;
    }
    if (!noop) ran.push(cmd);
  }
  for (let i = 0; i < DRAIN_FRAMES && g.phase === 'day' && !g.outcome; i++) h.frame();
  if (!error && !g.outcome) error = `the day never ended (${DRAIN_FRAMES} frames after the plan)`;
  const ms = {};
  for (const e of h.log) {
    const f = L.milestones[e.name];
    const k = f && f(e.payload ?? {});
    if (k && ms[k] === undefined) ms[k] = +e.minute.toFixed(1);
  }
  const o = g.outcome ?? { result: 'error', routes: [] };
  return {
    result: o.result,
    routes: [...(o.routes ?? [])].sort(),
    caughtBy: g.caught?.reason ?? null,
    ms,
    used: usedLessons(L, ran, h.log),
    error,
  };
}

const winKey = (r) => (r.result === 'win' ? r.routes.join('+') : null);
const size = (p) => p.steps.length;
// Win combos in report order: single routes first, then combos, alphabetically within each.
export const combosOf = (r) => Object.keys(r.wins).sort((a, b) => a.split('+').length - b.split('+').length || (a < b ? -1 : 1));

// ---------------------------------------------------------------------------------------------
// Parallel batches

function makePool(n, level) {
  const workers = Array.from({ length: n }, () => new Worker(SELF, { workerData: { worker: true, level } }));
  return {
    async run(plans) {
      const out = new Array(plans.length);
      const chunks = workers.map(() => []);
      plans.forEach((p, i) => chunks[i % workers.length].push([i, p]));
      await Promise.all(workers.map((w, wi) => new Promise((resolve, reject) => {
        if (!chunks[wi].length) return resolve();
        const onMsg = (res) => {
          for (const [i, r] of res) out[i] = r;
          w.off('message', onMsg);
          w.off('error', reject);
          resolve();
        };
        w.on('message', onMsg);
        w.on('error', reject);
        w.postMessage(chunks[wi]);
      })));
      return out;
    },
    close: () => Promise.all(workers.map((w) => w.terminate())),
  };
}

if (!isMainThread && workerData?.worker) {
  const L = levelData(workerData.level);
  parentPort.on('message', (chunk) => {
    parentPort.postMessage(chunk.map(([i, plan]) => {
      try {
        return [i, evaluate(plan, L)];
      } catch (e) {
        return [i, { result: 'error', routes: [], ms: {}, used: [], error: `throw: ${e?.stack?.split('\n').slice(0, 3).join(' | ')}` }];
      }
    }));
  });
}

// ---------------------------------------------------------------------------------------------
// Search

// Runs the search. Returns plain data:
//   { level, seed, budget, batch, workers, evaluated, secs, randomWins, randomEvaluated,
//     bins: Map(bin -> { plan, res }),
//     wins: { [routes joined by '+']: { count, randomCount, keyTimes: { milestone: [min, max] },
//             without: { lessonId: smallest winning plan that skipped it }, minimal: plan, windows: [...] } },
//     crashes: [{ cmds, error }] (the first 10), crashCount }
export async function fuzz({ level = DEFAULT_LEVEL, budget = 6000, seed = 1, batch = BATCH, workers = defaultWorkers(), progress = null } = {}) {
  const L = levelData(level);
  const rng = createRng(seed);
  const pool = makePool(workers, level);
  const t0 = performance.now();
  const binOf = (r) => `${r.result}|${r.routes.join('+')}|${L.binKeys.filter((k) => r.ms[k] !== undefined).join(',')}`;

  const elites = new Map(); // bin -> { plan, res }
  const wins = {}; // route combo -> stats (see above)
  const crashes = [];
  let crashCount = 0;
  let evaluated = 0;
  let randomEvaluated = 0;
  let randomWins = 0;

  // Every evaluation goes through here, so a crash in any phase is recorded.
  const run = async (plans) => {
    const res = await pool.run(plans);
    res.forEach((r, i) => {
      if (!r.error) return;
      crashCount++;
      if (crashes.length < 10) crashes.push({ cmds: planToCmds(plans[i], L), error: r.error });
    });
    return res;
  };

  const offer = (plan, res, random) => {
    evaluated++;
    if (random) randomEvaluated++;
    if (res.error) return;
    const wk = winKey(res);
    if (wk) {
      if (random) randomWins++;
      const s = (wins[wk] ??= { count: 0, randomCount: 0, keyTimes: {}, without: {} });
      s.count++;
      if (random) s.randomCount++;
      for (const k of L.keyActions) {
        const m = res.ms[k];
        if (m === undefined) continue;
        const kt = (s.keyTimes[k] ??= [m, m]);
        kt[0] = Math.min(kt[0], m);
        kt[1] = Math.max(kt[1], m);
      }
      for (const id of skippedLessons(L, res)) {
        if (!s.without[id] || size(plan) < size(s.without[id])) s.without[id] = clone(plan);
      }
    }
    const bin = binOf(res);
    const cur = elites.get(bin);
    if (!cur || size(plan) < size(cur.plan)) elites.set(bin, { plan: clone(plan), res });
  };

  try {
    // 1. Random sampling (also the baseline for "how often does a random plan win?").
    const initN = Math.min(Math.floor(budget * 0.3), 3000);
    {
      const plans = Array.from({ length: initN }, () => randomPlan(rng, L));
      const res = await run(plans);
      plans.forEach((p, i) => offer(p, res[i], true));
    }

    // 2. MAP-Elites: mutate elites, wins and rare bins more often.
    while (evaluated < budget) {
      const bins = [...elites.values()];
      const winBins = bins.filter((e) => winKey(e.res));
      const plans = [];
      for (let i = 0; i < batch && evaluated + plans.length < budget; i++) {
        const pickWin = winBins.length && rng.chance(0.35);
        const a = pickWin ? rng.pick(winBins) : rng.pick(bins);
        const b = rng.chance(0.25) ? rng.pick(bins) : null;
        plans.push(mutate(rng, L, a.plan, b?.plan));
      }
      const res = await run(plans);
      plans.forEach((p, i) => offer(p, res[i], false));
      progress?.(`  ${evaluated} days, ${elites.size} bins, ${winBins.length} winning bins`);
    }

    // 3. Shrink each route combo's simplest win: drop steps while the same win survives.
    for (const wk of Object.keys(wins)) {
      const best = [...elites.values()].filter((e) => winKey(e.res) === wk).sort((x, y) => size(x.plan) - size(y.plan))[0];
      let plan = clone(best.plan);
      for (let changed = true; changed;) {
        changed = false;
        const cands = plan.steps.map((_, i) => ({ steps: plan.steps.filter((__, j) => j !== i), endBusy: plan.endBusy }));
        if (!cands.length) break;
        const out = await run(cands);
        const i = out.findIndex((r) => winKey(r) === wk);
        if (i >= 0) {
          plan = cands[i];
          changed = true;
          evaluated += i + 1;
        }
      }
      wins[wk].minimal = plan;
    }

    // 4. Windows: slide each timed wait of each minimal win across the whole day (the other steps
    // fixed) and record the minutes where the same win still happens. These are the real windows.
    for (const [wk, w] of Object.entries(wins)) {
      const plan = w.minimal;
      w.windows = [];
      for (let i = 0; i < plan.steps.length; i++) {
        if (plan.steps[i].k !== 'until') continue;
        const ms = Array.from({ length: L.lastMinute }, (_, j) => j + 1);
        const cands = ms.map((m) => {
          const p = clone(plan);
          p.steps[i].m = m;
          return p;
        });
        const res = await run(cands);
        evaluated += cands.length;
        const spans = [];
        ms.forEach((m, j) => {
          if (winKey(res[j]) !== wk) return;
          const last = spans[spans.length - 1];
          if (last && last[1] === m - 1) last[1] = m;
          else spans.push([m, m]);
        });
        w.windows.push({ step: i, cmd: stepToCmd(plan.steps[i], L), spans });
      }
    }
  } finally {
    await pool.close();
  }

  const secs = (performance.now() - t0) / 1000;
  return { level, seed, budget, batch, workers, evaluated, secs, randomWins, randomEvaluated, bins: elites, wins, crashes, crashCount };
}

// ---------------------------------------------------------------------------------------------
// Report

const pct = (n, d) => `${((100 * n) / Math.max(1, d)).toFixed(2)}%`;

// One way to win: counts, key action times, the minimal plan and its timing windows.
export function winLines(r, wk) {
  const L = levelData(r.level);
  const w = r.wins[wk];
  const out = [`WIN ${wk}: ${w.count} winning days found, ${w.randomCount} of them from random plans`];
  const kt = Object.entries(w.keyTimes).map(([k, [a, b]]) => `${k} ${fmt(a, L)}–${fmt(b, L)}`).join(', ');
  if (kt) out.push(`  key actions seen in wins: ${kt}`);
  out.push(`  minimal plan (${size(w.minimal)} steps):`);
  for (const c of planToCmds(w.minimal, L)) out.push(`    ${c}`);
  for (const win of w.windows) {
    const spans = win.spans.map(([a, b]) => (a === b ? fmt(a, L) : `${fmt(a, L)}–${fmt(b, L)}`)).join(', ') || 'none';
    out.push(`  window for step ${win.step + 1} (${win.cmd}): wins when it ends at ${spans}`);
  }
  return out;
}

export function report(r, { verbose = false } = {}) {
  const L = levelData(r.level);
  const lines = [];
  const say = (s = '') => lines.push(s);
  say(`fuzz: ${r.evaluated} days in ${r.secs.toFixed(1)} s (${r.workers} workers, batch ${r.batch}, seed ${r.seed}), ${r.bins.size} distinct outcomes`);
  const results = {};
  for (const e of r.bins.values()) results[e.res.result] = (results[e.res.result] ?? 0) + 1;
  say(`outcome bins by result: ${Object.entries(results).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  say(`random plans that win: ${r.randomWins}/${r.randomEvaluated} (${pct(r.randomWins, r.randomEvaluated)})`);
  const flags = [];
  const combos = combosOf(r);
  if (!combos.length) say('\nno wins found (raise --budget?)');
  for (const wk of combos) {
    const w = r.wins[wk];
    say();
    for (const l of winLines(r, wk)) say(l);
    if (size(w.minimal) <= EASY_STEPS) flags.push(`EASY      ${wk}: wins in ${size(w.minimal)} steps`);
    if (w.randomCount / Math.max(1, r.randomEvaluated) > EASY_RATE) flags.push(`EASY      ${wk}: ${w.randomCount}/${r.randomEvaluated} random plans win`);
    for (const [id, p] of Object.entries(w.without)) {
      flags.push(`NO-${id.toUpperCase()} ${wk}: a win without ${id} (${size(p)} steps)`);
      if (verbose) for (const c of planToCmds(p, L)) say(`    (no ${id}) ${c}`);
    }
  }
  for (const id of L.routes) if (!combos.some((wk) => wk.split('+').includes(id))) flags.push(`NO-WIN    route ${id}: no plan won it`);
  for (const c of r.crashes) flags.push(`CRASH     ${c.error}\n            plan: ${c.cmds.join(' ; ')}`);
  if (r.crashCount > r.crashes.length) flags.push(`CRASH     ... ${r.crashCount - r.crashes.length} more`);
  say(`\nflags (${flags.length}):`);
  for (const f of flags) say(`  ${f}`);
  if (verbose) {
    say('\nall outcome bins (simplest plan size):');
    for (const [bin, e] of [...r.bins.entries()].sort()) say(`  ${String(size(e.plan)).padStart(2)}  ${bin}`);
  }
  return lines.join('\n');
}

// The --json archive (tools/golden.mjs --from reads bins[].cmds and wins[].minimal). Everything but secs
// depends only on level, seed, budget and batch.
export const toJson = (r, L = levelData(r.level)) => ({
  level: r.level, evaluated: r.evaluated, seed: r.seed, budget: r.budget, batch: r.batch, secs: r.secs,
  randomWins: r.randomWins, randomEvaluated: r.randomEvaluated,
  wins: Object.fromEntries(Object.entries(r.wins).map(([k, w]) => [k, {
    count: w.count, randomCount: w.randomCount, keyTimes: w.keyTimes,
    without: Object.fromEntries(Object.entries(w.without).map(([id, p]) => [id, planToCmds(p, L)])),
    minimal: planToCmds(w.minimal, L), windows: w.windows,
  }])),
  bins: Object.fromEntries([...r.bins.entries()].map(([k, e]) => [k, { cmds: planToCmds(e.plan, L), res: e.res }])),
  crashes: r.crashes, crashCount: r.crashCount,
});

// ---------------------------------------------------------------------------------------------
// CLI

if (isMainThread && process.argv[1] === SELF) {
  const arg = (name, def) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : def;
  };
  const verbose = process.argv.includes('--verbose');
  const jsonOut = arg('json', null);
  const level = arg('level', DEFAULT_LEVEL);
  try {
    levelData(level);
  } catch (e) {
    console.error(`fuzz: ${e.message}`);
    process.exit(2);
  }
  const r = await fuzz({
    level,
    budget: Number(arg('budget', 6000)),
    seed: Number(arg('seed', 1)),
    batch: Number(arg('batch', BATCH)),
    workers: Number(arg('workers', defaultWorkers())),
    progress: verbose ? console.log : null,
  });
  console.log(report(r, { verbose }));
  if (jsonOut) writeFileSync(jsonOut, JSON.stringify(toJson(r), null, 2));
}
