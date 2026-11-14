// Tests for tools/gate.mjs: the verdict logic on synthetic fuzz results (no fuzzing), plus how a day's
// mustUse lessons are matched (two real days through the harness).
import { checkGate, gateReport } from './gate.mjs';
import { evaluate, usedLessons, levelData } from './fuzz.mjs';

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
const failed = (r) => checkGate(r, L).filter((c) => !c.ok).map((c) => c.name).join(',');

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
const report = gateReport(r, checkGate(r, L));
ok(/verdict: FAIL \(easy, crash, pretend\)/.test(report), 'the report names every failed check in the verdict');
ok(/verdict: PASS/.test(gateReport(healthy(), checkGate(healthy(), L))), 'the report says PASS for a healthy level');

// Lesson matching: cmd = a command that ran contains the word; event = the event fired.
const LL = { mustUse: [{ id: 'pretend', cmd: 'pretend' }, { id: 'fridge', event: 'sandwich:taken' }] };
ok(usedLessons(LL, ['goto fridge pretend'], []).join() === 'pretend', 'cmd lesson: matched by a word of a command that ran');
ok(usedLessons(LL, ['goto pretender'], [{ name: 'sandwich:taken' }]).join() === 'fridge', 'event lesson: matched by event name; cmd needs the whole word');

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
