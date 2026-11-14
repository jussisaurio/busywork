// Engine-clean ratchet: engine code (every src/ file outside src/levels/) must not name level-1 things.
// Counts, per file and identifier, quoted strings equal to an identifier ('boss') plus `.boss` and `boss:`
// uses, and fails if any count rises above tools/engine-clean-allow.json or a new file gains hits.
// Raw tile coordinates in render are not matched; they need a person's eye.
//
//   node tools/test-engine-clean.mjs           check
//   node tools/test-engine-clean.mjs --write   rewrite the allow-list from the current hits (to shrink it)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const ALLOW = fileURLToPath(new URL('./engine-clean-allow.json', import.meta.url));
const IDS = ['boss', 'kev', 'lin', 'sandwich', 'keycard', 'projector', 'coffee', 'fridge', 'smoke', 'mustard'];
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

if (process.argv.includes('--write')) {
  writeFileSync(ALLOW, JSON.stringify(hits, null, 1) + '\n');
  console.log(`engine-clean: wrote ${hits.length} allow-list entries (${hits.reduce((s, h) => s + h.count, 0)} hits)`);
  process.exit(0);
}

const allowed = new Map(JSON.parse(readFileSync(ALLOW, 'utf8')).map((a) => [`${a.file} ${a.identifier}`, a.count]));
const worse = hits.filter((h) => h.count > (allowed.get(`${h.file} ${h.identifier}`) ?? 0));
ok(worse.length === 0, `no level-1 identifier gained hits outside src/levels/ (${hits.length} file/identifier pairs allowed)`);
for (const h of worse) console.log(`   ${h.file}: '${h.identifier}' ${h.count} > ${allowed.get(`${h.file} ${h.identifier}`) ?? 0}`);
const now = new Map(hits.map((h) => [`${h.file} ${h.identifier}`, h.count]));
const slack = [...allowed].filter(([k, n]) => (now.get(k) ?? 0) < n).length;
if (slack) console.log(`note: ${slack} allow-list entries can shrink; run node tools/test-engine-clean.mjs --write`);
console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
