// The checking behind tools/check.mjs and tools/merge.mjs: every tools/test-*.mjs, routes.mjs, and the sim and render
// goldens for every registered level, in parallel. One line per piece as it finishes, then the tail of each failure.
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { cpus } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { levels } from '../../src/levels/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const COLD = 'test-cold-read.mjs';
const TAIL = 30;

// Resolves true when every piece passed. { fast } skips test-cold-read.mjs (about 90 s alone).
export async function runChecks({ fast = false, workers = Math.min(cpus().length, 6) } = {}) {
  process.env.BUSYWORK_CANVAS_DIR ??= join(root, 'tools', '.deps');
  const tests = readdirSync(join(root, 'tools')).filter((f) => /^test-.*\.mjs$/.test(f)).sort();
  const pieces = [
    ...tests.filter((t) => !(fast && t === COLD)).map((t) => ({ name: t, args: [`tools/${t}`] })),
    { name: 'routes.mjs', args: ['tools/routes.mjs'] },
    ...Object.keys(levels).flatMap((id) => ['golden', 'golden-render'].map((g) => ({ name: `${g}.mjs --level ${id}`, args: [`tools/${g}.mjs`, '--level', id] }))),
  ];
  pieces.sort((a, b) => (b.name === COLD) - (a.name === COLD)); // the slowest first, so it overlaps the rest
  if (fast) console.log(`check: --fast skips ${COLD} (about 90 s)`);
  const t0 = performance.now();
  const failures = [];
  let next = 0;
  const worker = async () => {
    while (next < pieces.length) {
      const p = pieces[next++];
      const t = performance.now();
      const out = [];
      const code = await new Promise((res) => {
        const c = spawn(process.execPath, p.args, { cwd: root, env: process.env });
        c.stdout.on('data', (d) => out.push(d));
        c.stderr.on('data', (d) => out.push(d));
        c.on('error', () => res(1));
        c.on('close', (k) => res(k ?? 1));
      });
      console.log(`${code === 0 ? 'ok  ' : 'FAIL'} ${p.name} ${((performance.now() - t) / 1000).toFixed(1)}s`);
      if (code !== 0) failures.push({ name: p.name, text: Buffer.concat(out).toString().trimEnd() });
    }
  };
  await Promise.all(Array.from({ length: workers }, worker));
  for (const f of failures) console.log(`\n--- ${f.name} (last ${TAIL} lines) ---\n${f.text.split('\n').slice(-TAIL).join('\n')}`);
  const secs = ((performance.now() - t0) / 1000).toFixed(1);
  console.log(`\ncheck: ${failures.length ? `FAILED ${failures.length}/${pieces.length}: ${failures.slice(0, 4).map((f) => f.name).join(', ')}${failures.length > 4 ? ', ...' : ''}` : `all ${pieces.length} pieces passed`} (${secs} s${fast ? ', --fast' : ''})`);
  return !failures.length;
}
