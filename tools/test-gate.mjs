// Tests for tools/gate.mjs: the verdict logic on synthetic fuzz results (no fuzzing), plus how a day's
// mustUse lessons are matched (two real days through the harness).
import { checkGate, gateReport, gateBudget, DEFAULT_BUDGET } from './gate.mjs';
import { STAGES } from './cold-read.mjs';
import { getLevel } from '../src/levels/index.js';
import { validateLevel } from '../src/levels/validate.js';
import { evaluate, usedLessons, skippedLessons, levelData } from './fuzz.mjs';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

const L = { routes: ['projector', 'keycard'], mustUse: [{ id: 'pretend', cmd: 'pretend' }] };
const plan = (n) => ({ steps: Array.from({ length: n }, () => ({ k: 'do' })), endBusy: true });
const win = (steps, extra = {}) => ({ count: 1, randomCount: 0, keyTimes: {}, without: {}, minimal: plan(steps), windows: [], ...extra });
// A level that passes: both routes won in 4+ steps, 0.13% random wins, no crashes, every win pretends.
const healthy = () => ({
  level: 'meeting', seed: 1, budget: 0, batch: 0, workers: 0, evaluated: 0, secs: 0, bins: new Map(),
  wins: { keycard: win(4), projector: win(5), 'keycard+projector': win(8) },
  randomWins: 4, randomEvaluated: 3000, crashes: [], crashCount: 0,
});
// Cold reads (tools/cold-read.mjs coldReadChecks): every pass works and is fresh.
const coldOk = () => STAGES.map((s) => ({ name: `cold-read:${s}`, ok: true, text: 'works (2026-11-15, abc1234), fresh', detail: [] }));
const failed = (r, coldRead = coldOk()) => checkGate(r, L, { coldRead }).filter((c) => !c.ok).map((c) => c.name).join(',');

ok(failed(healthy()) === '', 'a healthy level passes every check');

let r = healthy();
r.wins.keycard = win(2);
ok(failed(r) === 'easy', 'a trivial win (2 steps) fails "easy"');
r.wins.keycard = win(3);
ok(failed(r) === 'easy', 'a 3-step win fails "easy"');

r = healthy();
delete r.wins.projector;
delete r.wins['keycard+projector'];
ok(failed(r) === 'routes', 'a route no plan wins fails "routes"');
r = healthy();
delete r.wins.projector;
ok(failed(r) === '', 'a route won only in a combo still counts as won');
r = healthy();
r.wins = {};
ok(failed(r) === 'routes', 'no wins at all fails "routes" only');

r = healthy();
r.crashes = [{ cmds: ['interact', 'wait until 4:00'], error: 'throw: TypeError: x is undefined' }];
r.crashCount = 1;
ok(failed(r) === 'crash', 'a crash fails "crash"');
r = healthy();
r.crashes = [{ cmds: ['wait until 4:00'], error: 'the day never ended (20000 frames after the plan)' }];
ok(failed(r) === 'crash', 'a harness error (day never ended) fails "crash"');

r = healthy();
r.randomWins = 31;
ok(failed(r) === 'random', '31/3000 random wins (>1%) fails "random"');
r.randomWins = 30;
ok(failed(r) === '', '30/3000 random wins (exactly 1%) passes');

r = healthy();
r.wins.keycard.without.pretend = plan(5);
ok(failed(r) === 'pretend', 'a win without the mustUse lesson fails that lesson');

r = healthy();
r.wins.keycard = win(1, { without: { pretend: plan(1) } });
r.crashCount = 7;
const report = gateReport(r, checkGate(r, L, { coldRead: coldOk() }));
ok(/verdict: FAIL \(easy, crash, pretend\)/.test(report), 'the report names every failed check in the verdict');
ok(/verdict: PASS: level meeting is ready for a human playtest/.test(gateReport(healthy(), checkGate(healthy(), L, { coldRead: coldOk() }))),
  'the report says PASS for a healthy level whose cold reads all work');

// Cold reads: a level that is not a fixture is not ready for a human until every pass works and is fresh.
r = healthy();
ok(failed(r, null) === 'cold-read', 'a level whose cold reads were not checked fails "cold-read"');
ok(!/ready for a human playtest/.test(gateReport(r, checkGate(r, L))), 'without cold reads the report never says "ready for a human playtest"');
const cold = coldOk();
const PIC = STAGES.indexOf('pictures'), REP = STAGES.indexOf('replay');
ok(STAGES[0] === 'title' && STAGES.includes('sense') && STAGES.length >= 12, 'the gate checks every cold-read pass, the narrow text passes first');
cold[PIC] = { name: 'cold-read:pictures', ok: false, text: 'no cold read yet', detail: ['run: node tools/cold-read.mjs --level meeting --pass pictures'] };
cold[REP] = { name: 'cold-read:replay', ok: false, text: 'works (2026-11-01, abc1234), but stale: the replay strips changed since', detail: ['run: node tools/cold-read.mjs --level meeting --pass replay'] };
ok(failed(r, cold) === 'cold-read:pictures,cold-read:replay', 'a missing pass and a stale pass each fail');
const coldReport = gateReport(r, checkGate(r, L, { coldRead: cold }));
ok(/verdict: FAIL \(cold-read:pictures, cold-read:replay\)/.test(coldReport) && !/ready for a human playtest/.test(coldReport),
  'the verdict names the passes that are missing or stale');
ok(coldReport.includes('stale: the replay strips changed since') && coldReport.includes('node tools/cold-read.mjs --level meeting --pass pictures'),
  'the report says what is stale and the command to run');
cold[PIC] = { ...cold[PIC], text: 'fixable (2026-11-15, abc1234): fix the problems src/levels/meeting/cold-read.md lists, then run the pass again' };
ok(failed(r, cold.slice(0, PIC + 1)) === 'cold-read:pictures', 'a pass recorded fixable fails');
const sense = coldOk();
sense[STAGES.indexOf('sense')] = { name: 'cold-read:sense', ok: false, text: 'no cold read yet', detail: [] };
ok(failed(r, sense) === 'cold-read:sense', 'a level without a sense pass fails "cold-read:sense"');

// Stray pictures at the repo root fail the gate (tools/lib/stray.mjs).
const gs = (stray) => checkGate(r, L, { coldRead: coldOk(), stray }).find((c) => c.name === 'stray');
ok(gs([]).ok && !gs(undefined), 'no stray pictures passes; without the option there is no stray check');
const bad = gs([{ file: '/repo/280', kind: 'PNG' }]);
ok(!bad.ok && /\/repo\/280 is a PNG picture at the repo root/.test(bad.detail[0]) && /tools\/crop\.mjs/.test(bad.detail[0]), 'a stray picture fails the gate, named, with the safe crop tool');
const fx = { ...healthy(), level: 'fixture' };
ok(failed(fx, null) === '', 'a fixture level needs no cold reads');
ok(/verdict: PASS: level fixture is ready/.test(gateReport(fx, checkGate(fx, L))), 'a fixture can still pass');

// Lesson matching: cmd = a command that ran contains the word; event = the event fired.
const LL = { mustUse: [{ id: 'pretend', cmd: 'pretend' }, { id: 'fridge', event: 'sandwich:taken' }] };
ok(usedLessons(LL, ['goto fridge pretend'], []).join() === 'pretend', 'cmd lesson: matched by a word of a command that ran');
ok(usedLessons(LL, ['goto pretender'], [{ name: 'sandwich:taken' }]).join() === 'fridge', 'event lesson: matched by event name; cmd needs the whole word');

// A lesson with `routes` binds only the wins that include one of them.
const LR = { mustUse: [{ id: 'pretend', cmd: 'pretend' }, { id: 'put', event: 'item:put', routes: ['projector'] }] };
ok(skippedLessons(LR, { routes: ['keycard'], used: ['pretend'] }).length === 0, 'routes: a keycard win needn\'t put');
ok(skippedLessons(LR, { routes: ['keycard', 'projector'], used: ['pretend'] }).join() === 'put', 'routes: a win that includes projector must');
ok(skippedLessons(LR, { routes: ['projector'], used: [] }).join() === 'pretend,put', 'routes: a lesson without routes binds every win');
const RL = { routes: ['projector', 'keycard'], mustUse: LR.mustUse };
const rr = healthy();
ok(checkGate(rr, RL, { coldRead: coldOk() }).find((c) => c.name === 'put')?.text === 'every projector win uses put', 'the gate names the routes a lesson binds');

{
  const M = getLevel('meeting');
  let msg = '';
  try { validateLevel({ ...M, gate: { ...M.gate, mustUse: [{ id: 'put', event: 'item:put', routes: ['nope'] }] } }, 'bad-routes'); } catch (e) { msg = e.message; }
  ok(/gate\.mustUse\[0\]\.routes\[0\]: no route 'nope'/.test(msg), 'validator: a lesson\'s routes name level routes');
  for (const budget of [0, 2.5, '30000']) {
    msg = '';
    try { validateLevel({ ...M, gate: { ...M.gate, budget } }, 'bad-budget'); } catch (e) { msg = e.message; }
    ok(/gate\.budget: not a whole number/.test(msg), `validator: gate.budget ${JSON.stringify(budget)} is refused`);
  }
  let fine = true;
  try { validateLevel({ ...M, gate: { ...M.gate, budget: 60000 } }, 'meeting'); } catch (e) { fine = e.message; }
  ok(fine === true, `validator: gate.budget 60000 is fine (${fine})`);
}

// The gate's budget: --budget, else the level's gate.budget, else the default.
{
  const own = { ...levelData('meeting'), budget: 60000 };
  ok(gateBudget('meeting', undefined, own).budget === 60000 && gateBudget('meeting', undefined, own).from === 'level', 'budget: the level\'s gate.budget without --budget');
  ok(gateBudget('meeting', '500', own).budget === 500 && gateBudget('meeting', '500', own).from === 'flag', 'budget: --budget beats the level\'s');
  ok(gateBudget('meeting', undefined, { ...own, budget: undefined }).budget === DEFAULT_BUDGET, 'budget: the default when the level names none');
}

// Two real days (level 1, design-jam/FUZZ.md's minimal keycard win, with and without pretend).
const keycard = (busy) => ({ steps: [{ k: 'until', m: 16, busy }, { k: 'goto', t: 'coat_rack', busy }, { k: 'do' }, { k: 'goto', t: 'meeting_seat', busy }], endBusy: busy });
let d = evaluate(keycard(true), levelData('meeting'));
ok(d.result === 'win' && d.routes.join() === 'keycard' && d.used.join() === 'pretend' && !d.error, 'level 1: the minimal keycard plan wins and uses pretend');
d = evaluate(keycard(false), levelData('meeting'));
ok(d.result !== 'win' && d.used.length === 0, 'level 1: the same plan without pretend does not win, and uses no lesson');
d = evaluate({ steps: [{ k: 'until', m: 80, busy: false }, { k: 'until', m: 1, busy: true }], endBusy: false }, levelData('meeting'));
ok(d.used.length === 0, 'level 1: a pretend wait skipped because its time had passed does not count');

// contraband: a coworker with the boss's keycard in his view is flagged; the plain day is clean.
{
  const { contrabandSeen, contrabandCheck } = await import('./lib/contraband.mjs');
  ok(contrabandSeen('meeting', [[]]).length === 0 && contrabandCheck([]).ok, 'contraband: level 1 do-nothing day is clean');
  const f = contrabandSeen('meeting', [[]], (g) => { for (const n of g.npcs) if (n.id !== 'boss') n.carry = 'keycard'; });
  ok(f.length > 0 && f.every((x) => x.item === 'keycard') && !contrabandCheck(f).ok, `contraband: coworkers carrying his keycard in view are flagged (${f.map((x) => x.npc).join(',')})`);
}

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
