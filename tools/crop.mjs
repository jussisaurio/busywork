#!/usr/bin/env node
// Crop and zoom part of a picture (a shot, a strip frame) to look at it closely.
//
//   node tools/crop.mjs --in <file.png> --out <file.png> --x <px> --y <px> --w <px> --h <px> [--scale 2]
//
// Every argument is named, and each is checked before anything is written. An ad-hoc crop script that took
// positional arguments (file x y w h out) was once called as (file out x y w h scale): its "out" was 280, the
// crop's height, and it wrote a blank 720x800 PNG named "280" into the folder it ran from, the main repo's root.
// So: numbers must be numbers, the box must lie inside the picture, and the output must be a .png outside the
// repo (the scratchpad or another temp folder) or under tools/.shots/. Nothing is ever written to the working
// directory by default.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCanvas } from './lib/draw.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NAMES = ['in', 'out', 'x', 'y', 'w', 'h', 'scale'];
const NUMS = ['x', 'y', 'w', 'h', 'scale'];

const inside = (dir, p) => {
  const r = relative(dir, p);
  return r === '' || (!r.startsWith('..') && !isAbsolute(r));
};

// The checked arguments, or throws with what is wrong. argv: the arguments after the script.
export function parseCropArgs(argv, root = ROOT) {
  const a = {};
  for (let i = 0; i < argv.length; i += 2) {
    const k = /^--([a-z]+)$/.exec(argv[i])?.[1];
    if (!k || !NAMES.includes(k)) throw new Error(`unknown argument ${JSON.stringify(argv[i])}: every argument is named (--${NAMES.join(', --')})`);
    if (i + 1 >= argv.length) throw new Error(`--${k} needs a value`);
    a[k] = argv[i + 1];
  }
  for (const k of NAMES.filter((n) => n !== 'scale')) if (a[k] == null) throw new Error(`--${k} is missing`);
  a.scale ??= '2';
  for (const k of NUMS) {
    if (!/^\d+(\.\d+)?$/.test(a[k])) throw new Error(`--${k} must be a number of pixels, not ${JSON.stringify(a[k])}`);
    a[k] = Number(a[k]);
  }
  if (!a.w || !a.h || !a.scale) throw new Error('--w, --h and --scale must be above 0');
  if (a.scale > 8) throw new Error('--scale is at most 8');
  a.in = resolve(a.in);
  a.out = resolve(a.out);
  if (!/\.png$/i.test(a.out)) throw new Error(`--out must name a .png file, not ${JSON.stringify(a.out)}`);
  if (inside(resolve(root), a.out) && !inside(resolve(root, 'tools/.shots'), a.out)) {
    throw new Error(`--out ${a.out} is inside the repo: write crops to the scratchpad (or another temp folder), or under tools/.shots/`);
  }
  if (a.out === a.in) throw new Error('--out must not be the input picture');
  if (!existsSync(a.in)) throw new Error(`--in ${a.in} does not exist`);
  return a;
}

export async function crop(a) {
  const { createCanvas, loadImage } = loadCanvas();
  const img = await loadImage(readFileSync(a.in));
  if (a.x + a.w > img.width || a.y + a.h > img.height) {
    throw new Error(`the box ${a.x},${a.y} ${a.w}x${a.h} is outside the ${img.width}x${img.height} picture`);
  }
  const c = createCanvas(Math.round(a.w * a.scale), Math.round(a.h * a.scale));
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, a.x, a.y, a.w, a.h, 0, 0, c.width, c.height);
  mkdirSync(dirname(a.out), { recursive: true });
  writeFileSync(a.out, c.toBuffer('image/png'));
  return a.out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(await crop(parseCropArgs(process.argv.slice(2))));
  } catch (e) {
    console.error(`crop: ${e.message}\nusage: node tools/crop.mjs --in <file.png> --out <file.png> --x <px> --y <px> --w <px> --h <px> [--scale 2]`);
    process.exit(2);
  }
}
