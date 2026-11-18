// The gate's toy checks (tools/lib/toys.mjs) for every level with level.toys: each toy fires from its `try` plan
// and shows on screen, and firing every toy over and over changes no winning golden plan.
//
//   node tools/test-toys.mjs
import { levels } from '../src/levels/index.js';
import { toysCheck, toyNeutralCheck } from './lib/toys.mjs';

let fails = 0;
for (const [id, level] of Object.entries(levels)) {
  if (!level.toys?.length) continue;
  for (const r of [toysCheck(id), toyNeutralCheck(id)]) {
    console.log(r.ok ? 'ok  ' : 'FAIL', `${id} ${r.name}: ${r.text}`);
    for (const d of r.detail) console.log('      ', d);
    if (!r.ok) fails++;
  }
}
if (fails) { console.log(`${fails} failed`); process.exit(1); }
console.log('toys ok');
