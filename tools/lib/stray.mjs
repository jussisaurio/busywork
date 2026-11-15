// Stray pictures: image files at the top of the repo, where no tool writes one. Shots and strips go to
// tools/.shots/, cold-read bundles to temp folders, crops (tools/crop.mjs) to the scratchpad. A picture at the root
// was written by a script run from there with a bad output path: a blank 720x800 PNG named "280" once appeared
// in the main repo's root that way. Pictures are found by their first bytes, so a file with no extension counts.
import { readdirSync, openSync, readSync, closeSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const MAGIC = [
  ['PNG', [0x89, 0x50, 0x4e, 0x47]],
  ['JPEG', [0xff, 0xd8, 0xff]],
  ['GIF', [0x47, 0x49, 0x46, 0x38]],
  ['WebP', [0x52, 0x49, 0x46, 0x46]],
];

function kindOf(file) {
  const buf = Buffer.alloc(4);
  let fd;
  try {
    fd = openSync(file, 'r');
    readSync(fd, buf, 0, 4, 0);
  } catch {
    return null;
  } finally {
    if (fd != null) closeSync(fd);
  }
  return MAGIC.find(([, m]) => m.every((b, i) => buf[i] === b))?.[0] ?? null;
}

// [{ file, kind }] for each picture directly in root (not in its folders).
export function strayPictures(root = REPO_ROOT) {
  const out = [];
  for (const name of readdirSync(root)) {
    const file = join(root, name);
    let st;
    try { st = statSync(file); } catch { continue; }
    if (!st.isFile()) continue;
    const kind = kindOf(file);
    if (kind) out.push({ file, kind });
  }
  return out;
}

export const strayText = (s) => `${s.file} is a ${s.kind} picture at the repo root, where no tool writes one: a script run from there wrote it with a bad output path. Find what wrote it, then delete it (crops: node tools/crop.mjs, which refuses to write into the repo)`;
