// The tools' --level flag. A level's tool files (its goldens) live in its own folder, src/levels/<id>/:
// the folder name is the level id.
import { fileURLToPath } from 'node:url';
import { levels, getLevel, defaultLevel } from '../../src/levels/index.js';
import { jobs } from './jobs.mjs';

// The level named by --level <id> (default: the registry's default level). An unknown id prints the
// registry's ids and exits 2.
export function levelArg(tool, argv = process.argv) {
  const i = argv.indexOf('--level');
  const id = i > 0 ? argv[i + 1] : defaultLevel.id;
  try {
    return getLevel(id);
  } catch (e) {
    console.error(`${tool}: ${e.message}`);
    process.exit(2);
  }
}

// --all: run the calling tool once per registered level (a child process each, a few at a time, other flags passed
// through) and exit 1 if any failed. Call before doing any work; it returns at once without --all. Without --level
// or --all it says which single level the tool is about to check, since a bare run reads like "all levels pass".
export async function allArg(tool, argv = process.argv) {
  if (!argv.includes('--all')) {
    if (!argv.includes('--level')) console.log(`${tool}: checking only the default level '${defaultLevel.id}'; --all checks every level`);
    return;
  }
  const { spawn } = await import('node:child_process');
  const { cpus } = await import('node:os');
  const script = argv[1];
  const rest = argv.slice(2).filter((a) => a !== '--all');
  const ids = Object.keys(levels);
  const failed = [];
  let next = 0;
  const worker = async () => {
    while (next < ids.length) {
      const id = ids[next++];
      const out = [];
      const code = await new Promise((res) => {
        const c = spawn(process.execPath, [script, ...rest, '--level', id], { env: process.env });
        c.stdout.on('data', (d) => out.push(d));
        c.stderr.on('data', (d) => out.push(d));
        c.on('close', res);
      });
      const text = Buffer.concat(out).toString().trimEnd();
      console.log(code === 0 ? text.split('\n').pop() : text);
      if (code !== 0) failed.push(id);
    }
  };
  await Promise.all(Array.from({ length: jobs(Math.min(cpus().length, 6)) }, worker));
  if (failed.length) console.log(`${tool}: FAILED on ${failed.join(', ')}`);
  process.exit(failed.length ? 1 : 0);
}

// The path of a file in the level's folder.
export const levelFile = (level, name) => fileURLToPath(new URL(`../../src/levels/${level.id}/${name}`, import.meta.url));
