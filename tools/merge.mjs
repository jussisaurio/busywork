// Merge a branch into main and run every test: node tools/merge.mjs <branch>.
// Stops before merging if the trial merge conflicts, except in cold-read records and golden files (below), and runs the full tools/check.mjs after (tests, routes, goldens for every level).
// Exits 1 if the checks fail, or if re-recording the goldens gave a plan an outcome neither side had (the merge is left in place).
import { execFileSync, spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { serializeGolden, unionPlans, unreviewed } from './lib/golden-file.mjs';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const branch = process.argv[2];
if (!branch) { console.error('usage: node tools/merge.mjs <branch>'); process.exit(2); }
const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8' }).trim();
const trial = spawnSync('git', ['merge-tree', '--write-tree', '--name-only', 'main', branch], { cwd: root, encoding: 'utf8' });
// Cold-read records (src/levels/*/cold-read.md) conflict whenever main and the branch both read a level. They are a
// cache of readings, not work: the branch's copy wins, and any pass it makes stale is just read again.
// Golden files (src/levels/*/golden.json, golden-render.json) conflict whenever both sides changed behaviour. They are derived:
// rebuild the corpus as the union of both sides' plans, re-record the level, and compare the outcomes (below).
const conflicted = trial.status === 0 ? [] : trial.stdout.split('\n\n')[0].split('\n').slice(1).filter(Boolean);
const RECORD = /(^|\/)cold-read\.md$/;
const GOLDEN = /^src\/levels\/([^/]+)\/golden(-render)?\.json$/;
if (trial.status !== 0 && !(conflicted.length && conflicted.every((f) => RECORD.test(f) || GOLDEN.test(f)))) { console.error(`merge: ${branch} conflicts with main:\n${trial.stdout}`); process.exit(1); }
const goldens = conflicted.filter((f) => GOLDEN.test(f));
const records = conflicted.filter((f) => RECORD.test(f));
const side = (ref, f) => { // a golden file's { note, plans } at a ref (no plans when the file is not there)
  const r = spawnSync('git', ['show', `${ref}:${f}`], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 });
  return r.status === 0 ? JSON.parse(r.stdout) : { plans: [] };
};
const compared = []; // per level and file: { id, name, changed, fine }
if (conflicted.length) {
  spawnSync('git', ['merge', '-q', '--no-edit', '--no-commit', branch], { cwd: root, encoding: 'utf8' });
  for (const f of records) { git('checkout', '--theirs', '--', f); git('add', '--', f); }
  const ids = [...new Set(goldens.map((f) => f.match(GOLDEN)[1]))];
  const env = { ...process.env, BUSYWORK_CANVAS_DIR: process.env.BUSYWORK_CANVAS_DIR ?? join(root, 'tools', '.deps') };
  const files = [['golden.json', 'golden'], ['golden-render.json', 'golden-render']];
  for (const id of ids) {
    const was = {};
    for (const [name] of files) { // the union corpus goes in first: --write replays the plans the file holds
      const f = `src/levels/${id}/${name}`;
      const [m, b] = [side('main', f), side(branch, f)];
      was[name] = { m: m.plans, b: b.plans };
      writeFileSync(join(root, f), serializeGolden({ note: m.note ?? b.note, plans: unionPlans(m.plans, b.plans) }));
    }
    for (const [, tool] of files) {
      const r = spawnSync(process.execPath, [`tools/${tool}.mjs`, '--write', '--level', id], { cwd: root, env, encoding: 'utf8' });
      process.stdout.write(r.stdout + r.stderr);
      if (r.status !== 0) { console.error(`merge: re-recording ${tool} for ${id} failed; the merge is left uncommitted`); process.exit(1); }
    }
    for (const [name] of files) {
      const f = `src/levels/${id}/${name}`;
      compared.push({ id, name, ...unreviewed(was[name].m, was[name].b, JSON.parse(readFileSync(join(root, f), 'utf8')).plans) });
      git('add', '--', f);
    }
  }
  git('commit', '-q', '-m', `Merge ${branch}${goldens.length ? ': goldens re-recorded for ' + ids.join(', ') : ''}${records.length ? ': cold-read records from the branch' : ''}`);
  if (records.length) console.log(`merge: took ${branch}'s cold-read records: ${records.join(', ')}`);
  if (goldens.length) console.log(`merge: re-recorded goldens for ${ids.join(', ')} (union of both sides' plans)`);
} else git('merge', '-q', '--no-edit', branch);
console.log(`merge: ${git('log', '--oneline', '-1')}`);
const { runChecks } = await import('./lib/run-checks.mjs'); // after the merge: the checks must see the merged files
const ok = await runChecks();
let changes = 0;
for (const c of compared) {
  console.log(`merge: ${c.id} ${c.name}: ${c.fine} plans match main or the branch, ${c.changed.length} do not`);
  for (const p of c.changed) { changes++; console.log(`  CHANGED: ${p.cmds.join(' ; ')}\n    main ${p.main ?? '(no such plan)'}, branch ${p.branch ?? '(no such plan)'}, merged ${p.merged}`); }
}
if (changes) console.log(`\n*** merge: ${changes} plan(s) have an outcome that neither main nor ${branch} had: the combination changed behaviour and nobody reviewed it. Look at each one before pushing. The merge is in place. ***`);
console.log(ok ? 'merge: every check passes' : 'merge: FAILED after merge (see above)');
process.exit(ok && !changes ? 0 : 1);
