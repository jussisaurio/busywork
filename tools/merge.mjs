// Merge a branch into main and run every test: node tools/merge.mjs <branch>.
// Stops before merging if the trial merge conflicts (except in cold-read records), and runs the full tools/check.mjs after (tests, routes, goldens for every level).
import { execFileSync, spawnSync } from 'node:child_process';
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
const { runChecks } = await import('./lib/run-checks.mjs'); // after the merge: the checks must see the merged files
const ok = await runChecks();
console.log(ok ? 'merge: every check passes' : 'merge: FAILED after merge (see above)');
process.exit(ok ? 0 : 1);
