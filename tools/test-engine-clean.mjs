// Engine-clean: engine code (every src/ file outside src/levels/) must not name level-1 things. Fails on any
// quoted string equal to an identifier ('boss'), or a `.boss` or `boss:` use. There is no allow-list: what a
// level names belongs in its folder, and the engine reads it from game.level.
// Raw tile coordinates in render are not matched; they need a person's eye.
//
//   node tools/test-engine-clean.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const IDS = [
  'boss', 'kev', 'lin', 'sandwich', 'keycard', 'projector', 'coffee', 'fridge', 'smoke', 'mustard',
  'meeting_room', 'meeting_player', 'meeting_presenter', // the meeting frame (level.meeting)
];
const id = IDS.join('|');
const PATTERNS = [
  new RegExp(`(['"\`])(${id})\\1`, 'g'),
  new RegExp(`\\.(${id})\\b`, 'g'),
  new RegExp(`\\b(${id}):`, 'g'),
];

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

function files(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (relative(root, p) !== join('src', 'levels')) out.push(...files(p));
    } else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}

const hits = [];
for (const f of files(join(root, 'src')).sort()) {
  const src = readFileSync(f, 'utf8');
  const count = {};
  for (const re of PATTERNS) for (const m of src.matchAll(re)) {
    const name = m[2] ?? m[1];
    count[name] = (count[name] ?? 0) + 1;
  }
  for (const name of IDS) if (count[name]) hits.push({ file: relative(root, f).split('\\').join('/'), identifier: name, count: count[name] });
}

ok(hits.length === 0, 'no level-1 identifier outside src/levels/');
for (const h of hits) console.log(`   ${h.file}: '${h.identifier}' x${h.count}`);
console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
