// Headless tests for the golden files' layout and merge arithmetic (tools/lib/golden-file.mjs; used by tools/merge.mjs).
//
//   node tools/test-golden-file.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { serializeGolden, unionPlans, unreviewed } from './lib/golden-file.mjs';

let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};
const P = (cmds, summary, digests = ['a']) => ({ cmds, summary, digests });

// Layout: one plan per line, valid JSON, same content.
const g = { note: 'n "q"', plans: [P(['a', 'b'], 'win'), P(['c'], 'fail w+x'), P(['d;e'], 'caught')] };
const text = serializeGolden(g);
const lines = text.split('\n');
ok(isDeepStrictEqual(JSON.parse(text), g), 'serialised golden parses back to the same content');
ok(lines.length === g.plans.length + 3 && lines.at(-1) === '' && lines.at(-2) === ']}', 'header line, one line per plan, closing line');
ok(lines.slice(1, -2).every((l, i) => isDeepStrictEqual(JSON.parse(l.replace(/,$/, '')), g.plans[i])), 'each plan line is that plan alone');
ok(serializeGolden({ note: 'x', plans: [] }) === '{"note":"x","plans":[\n\n]}\n' && JSON.parse(serializeGolden({ note: 'x', plans: [] })).plans.length === 0, 'no plans is still valid JSON');
// Every committed golden file is in this layout (re-serialising it changes nothing).
for (const l of readdirSync('src/levels', { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const f of ['golden.json', 'golden-render.json']) {
    let t;
    try { t = readFileSync(`src/levels/${l.name}/${f}`, 'utf8'); } catch { continue; }
    if (serializeGolden(JSON.parse(t)) !== t) ok(false, `${l.name}/${f} is in the one-plan-per-line layout`);
  }
}
ok(fails === 0, 'every committed golden file is in the one-plan-per-line layout');

// Union: main's plans first, then the branch's new ones; deduplicated by cmds (main's entry wins).
const m = [P(['a'], 'win'), P(['b'], 'fail')];
const b = [P(['b'], 'caught'), P(['c'], 'win'), P(['a'], 'win')];
const u = unionPlans(m, b);
ok(u.map((p) => p.cmds[0]).join() === 'a,b,c', 'union keeps main order, adds the branch only plans, once each');
ok(u[1].summary === 'fail', 'a plan both sides have comes from main');
ok(unionPlans([], []).length === 0 && unionPlans(m, []).length === 2, 'union with an empty side');
ok(unionPlans([P(['a', 'b'], 'x')], [P(['a;b'], 'y')]).length === 1, 'cmds are compared as a whole list (documented limit: joined by ;)');

// unreviewed: a merged summary matching either side is fine; matching neither is a combination change.
const mm = [P(['a'], 'win'), P(['b'], 'fail'), P(['d'], 'win')];
const bb = [P(['a'], 'fail'), P(['b'], 'fail'), P(['c'], 'caught')];
const merged = [P(['a'], 'fail'), P(['b'], 'caught'), P(['c'], 'caught'), P(['d'], 'win'), P(['e'], 'win')];
const r = unreviewed(mm, bb, merged);
ok(r.changed.length === 2 && r.fine === 3, 'two of five plans differ from every side that has them');
ok(r.changed[0].cmds[0] === 'b' && r.changed[0].main === 'fail' && r.changed[0].branch === 'fail' && r.changed[0].merged === 'caught', 'a plan both sides agree on that the merge changed is reported with both sides');
ok(r.changed[1].cmds[0] === 'e' && r.changed[1].main === undefined && r.changed[1].branch === undefined, 'a plan neither side has (cannot happen from a union) counts as unreviewed');
ok(!r.changed.some((p) => p.cmds[0] === 'a'), 'matching the branch only is fine');
ok(!r.changed.some((p) => p.cmds[0] === 'c' || p.cmds[0] === 'd'), 'a plan only one side has, unchanged, is fine');

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
