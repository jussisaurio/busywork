// The tools' --level flag. A level's tool files (its goldens) live in its own folder, src/levels/<id>/:
// the folder name is the level id.
import { fileURLToPath } from 'node:url';
import { getLevel, defaultLevel } from '../../src/levels/index.js';

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

// The path of a file in the level's folder.
export const levelFile = (level, name) => fileURLToPath(new URL(`../../src/levels/${level.id}/${name}`, import.meta.url));
