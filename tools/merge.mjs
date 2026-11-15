// Merge a branch into main and run every test: node tools/merge.mjs <branch>.
// Stops before merging if the trial merge conflicts (except in cold-read records), and says so if a test fails after.
import { execFileSync, spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const branch = process.argv[2];
if (!branch) { console.error('usage: node tools/merge.mjs <branch>'); process.exit(2); }
const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8' }).trim();
const trial = spawnSync('git', ['merge-tree', '--write-tree', '--name-only', 'main', branch], { cwd: root, encoding: 'utf8' });
// Cold-read records (src/levels/*/cold-read.md) conflict whenever main and the branch both read a level. They are a
// cache of readings, not work: the branch's copy wins, and any pass it makes stale is just read again.
const conflicted = trial.status === 0 ? [] : trial.stdout.split('\n\n')[0].split('\n').slice(1).filter(Boolean);
const records = conflicted.length && conflicted.every((f) => /(^|\/)cold-read\.md$/.test(f));
if (trial.status !== 0 && !records) { console.error(`merge: ${branch} conflicts with main:\n${trial.stdout}`); process.exit(1); }
if (records) {
  spawnSync('git', ['merge', '-q', '--no-edit', '--no-commit', branch], { cwd: root, encoding: 'utf8' });
  for (const f of conflicted) { git('checkout', '--theirs', '--', f); git('add', '--', f); }
  git('commit', '-q', '--no-edit');
  console.log(`merge: took ${branch}'s cold-read records: ${conflicted.join(', ')}`);
} else git('merge', '-q', '--no-edit', branch);
console.log(`merge: ${git('log', '--oneline', '-1')}`);
process.env.BUSYWORK_CANVAS_DIR ??= join(root, 'tools', '.deps');
const failed = [];
for (const t of readdirSync(join(root, 'tools')).filter((f) => /^test-.*\.mjs$/.test(f)).sort()) {
  const r = spawnSync('node', [join('tools', t)], { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) failed.push(t);
}
const routes = spawnSync('node', ['tools/routes.mjs'], { cwd: root, encoding: 'utf8' });
if (routes.status !== 0) failed.push('routes.mjs');
console.log(failed.length ? `merge: FAILED after merge: ${failed.join(', ')}` : 'merge: every test and route passes');
process.exit(failed.length ? 1 : 0);
