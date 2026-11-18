// The gate's toy checks (tools/lib/toys.mjs) for every level with level.toys: each toy fires from its `try` plan
// and shows on screen, and firing every toy over and over changes no winning golden plan. Then the walks (a toy's
// `stand`): what he sets off to do always lands, on arrival or, cut short, at once; never left with nobody coming.
//
//   node tools/test-toys.mjs
import { levels } from '../src/levels/index.js';
import { toysCheck, toyNeutralCheck } from './lib/toys.mjs';
import { createHarness } from '../src/agent/harness.js';
import { updateToys, toyState } from '../src/sim/mechanics/toy.js';
import { pictureTilt } from '../src/levels/meeting/toys.js';

let fails = 0;
const report = (ok, text, detail = []) => {
  console.log(ok ? 'ok  ' : 'FAIL', text);
  for (const d of detail) console.log('      ', d);
  if (!ok) fails++;
};
for (const [id, level] of Object.entries(levels)) {
  if (!level.toys?.length) continue;
  for (const r of [toysCheck(id), toyNeutralCheck(id)]) report(r.ok, `${id} ${r.name}: ${r.text}`, r.detail);
}

// Every frame of a plan: a change still on its way (landsAt or a held state ahead of now) has its walker on the way.
function pending(game) {
  const out = [];
  for (const [id, t] of Object.entries(game.toys.byId)) {
    const due = Math.max(t.landsAt ?? -Infinity, t.held?.until ?? -Infinity);
    if (due <= game.loopTime) continue;
    const walking = Object.values(game.toys.walks).some((w) => w.toy === id || w.resets.includes(id));
    if (!walking) out.push(`${id} due in ${(due - game.loopTime).toFixed(2)} s with nobody walking to it`);
  }
  return out;
}
function landsCheck(level, name, cmds, after) {
  const bad = [];
  const h = createHarness({ level, onFrame: (g) => { if (!bad.length) bad.push(...pending(g)); } });
  h.begin();
  for (const c of cmds) h.run(c);
  const why = after ? after(h) : null;
  if (why) bad.push(why);
  report(!bad.length, `${level.id ?? ''} ${name}: ${bad.length ? 'a fix did not land' : 'every fix landed'}`, bad);
}
for (const [id, level] of Object.entries(levels)) {
  for (const toy of level.toys ?? []) if (toy.stand && toy.try) landsCheck(level, `stand ${toy.id}`, toy.try);
}

// The meeting's picture, as played (Jussi, 2026-11-18: "kev walks up to the crooked picture but doesnt adjust it"):
// you stand by it watching, not pretending; you tilt it again after each fix. Kev's hand turns it the moment he is
// under it, both times, and Lin's straightens it.
const meeting = levels.meeting;
const fixes = (h, toy) => h.log.filter((e) => e.name === `toy:${toy}`).length;
landsCheck(meeting, 'picture watched, tilted again',
  ['goto picture', 'interact', 'wait until 2:40', 'interact', 'pretend until 3:10'],
  (h) => (fixes(h, 'picture_kev') < 2 || fixes(h, 'picture_lin') < 1 ? 'Kev fixed it fewer than twice, or Lin never'
    : pictureTilt(h.game).tilt !== 0 ? `left at tilt ${pictureTilt(h.game).tilt}` : null));
// A walk cut short (here: his task changes as he sets off) lands at once, the pose with it.
landsCheck(meeting, 'picture walk cut short', ['goto picture', 'interact', 'pretend until 2:38.7'], (h) => {
  const g = h.game;
  const kev = g.npcs.find((n) => n.id === 'kev');
  if (!g.toys.walks.kev) return 'no walk to cut (the plan\'s time is off)';
  if (pictureTilt(g).tilt !== 1) return 'the picture turned before he got there';
  const was = kev.override;
  kev.override = 'test-cut';
  updateToys(g);
  kev.override = was;
  const pose = g.toys.poses.kev;
  if (g.toys.walks.kev) return 'the walk was not cut';
  if (pictureTilt(g).tilt !== -1) return `cut short, the picture stayed at tilt ${pictureTilt(g).tilt}`;
  if (!pose || pose.from > g.loopTime) return 'cut short, his reach waits for an arrival that never comes';
  return toyState(g, 'picture_kev').since === null ? 'never fired' : null;
});

if (fails) { console.log(`${fails} failed`); process.exit(1); }
console.log('toys ok');
