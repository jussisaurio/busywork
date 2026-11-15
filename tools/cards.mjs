// Every level's mission card, side by side: node tools/cards.mjs. Read it after any card change.
import { readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'levels');
for (const id of readdirSync(dir).filter((d) => !d.startsWith('fixture') && existsSync(join(dir, d, 'index.js'))).sort()) {
  const mod = await import(pathToFileURL(join(dir, id, 'index.js')).href);
  const lvl = mod.default ?? Object.values(mod).find((v) => v && v.title);
  const t = lvl?.title ?? {};
  console.log(`${id} (${lvl?.name ?? '?'})\n  ${(t.mission ?? ['?']).join('\n  ')}\n`);
}
