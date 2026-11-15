// Tests for tools/gate.mjs: the verdict logic on synthetic fuzz results (no fuzzing), plus how a day's
// mustUse lessons are matched (two real days through the harness).
import { checkGate, gateReport } from './gate.mjs';
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
// Cold reads (tools/cold-read.mjs coldReadChecks): every stage works and is fresh.
const STAGES = ['premise', 'pictures', 'replay'];
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

// Cold reads: a level that is not a fixture is not ready for a human until every stage works and is fresh.
r = healthy();
ok(failed(r, null) === 'cold-read', 'a level whose cold reads were not checked fails "cold-read"');
ok(!/ready for a human playtest/.test(gateReport(r, checkGate(r, L))), 'without cold reads the report never says "ready for a human playtest"');
const cold = coldOk();
cold[1] = { name: 'cold-read:pictures', ok: false, text: 'no cold read yet', detail: ['run: node tools/cold-read.mjs --level meeting --stage pictures'] };
cold[2] = { name: 'cold-read:replay', ok: false, text: 'works (2026-11-01, abc1234), but stale: the replay strips changed since', detail: ['run: node tools/cold-read.mjs --level meeting --stage replay'] };
ok(failed(r, cold) === 'cold-read:pictures,cold-read:replay', 'a missing stage and a stale stage each fail');
const coldReport = gateReport(r, checkGate(r, L, { coldRead: cold }));
ok(/verdict: FAIL \(cold-read:pictures, cold-read:replay\)/.test(coldReport) && !/ready for a human playtest/.test(coldReport),
  'the verdict names the stages that are missing or stale');
ok(coldReport.includes('stale: the replay strips changed since') && coldReport.includes('node tools/cold-read.mjs --level meeting --stage pictures'),
  'the report says what is stale and the command to run');
cold[1] = { ...cold[1], text: 'fixable (2026-11-15, abc1234): fix the problems src/levels/meeting/cold-read.md lists, then run the stage again' };
ok(failed(r, cold.slice(0, 2)) === 'cold-read:pictures', 'a stage recorded fixable fails');
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
}

// Two real days (level 1, design-jam/FUZZ.md's minimal keycard win, with and without pretend).
const keycard = (busy) => ({ steps: [{ k: 'until', m: 16, busy }, { k: 'goto', t: 'coat_rack', busy }, { k: 'do' }, { k: 'goto', t: 'meeting_seat', busy }], endBusy: busy });
let d = evaluate(keycard(true), levelData('meeting'));
ok(d.result === 'win' && d.routes.join() === 'keycard' && d.used.join() === 'pretend' && !d.error, 'level 1: the minimal keycard plan wins and uses pretend');
d = evaluate(keycard(false), levelData('meeting'));
ok(d.result !== 'win' && d.used.length === 0, 'level 1: the same plan without pretend does not win, and uses no lesson');
d = evaluate({ steps: [{ k: 'until', m: 80, busy: false }, { k: 'until', m: 1, busy: true }], endBusy: false }, levelData('meeting'));
ok(d.used.length === 0, 'level 1: a pretend wait skipped because its time had passed does not count');

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
