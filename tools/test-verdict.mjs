// Headless tests for the 4:00 verdict seam (src/play/scenario.js level.meeting.verdict; src/sim/npcs.js stareAt),
// on variants of the fixture level "The Suggestion Box" (src/levels/fixture-putdown): its winning plan, with a
// verdict that looks at the room itself.
//
//   node tools/test-verdict.mjs
import { createHarness } from '../src/agent/harness.js';
import { levels } from '../src/levels/index.js';
import { validateLevel } from '../src/levels/validate.js';
import { angleDiff } from '../src/core/vision.js';
import { spotPos } from '../src/game/perception.js';

const FP = levels['fixture-putdown'];
let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

const WIN = ['pretend until 2:39', 'interact', 'put box pretend', 'goto meeting_seat pretend', 'wait until 3:00'];
const withVerdict = (verdict) => ({ ...FP, meeting: { ...FP.meeting, verdict } });

// Play to the meeting, then `beat` more sim seconds of the end beat (the sim keeps running until day:end).
function play(level, beat = 0) {
  const h = createHarness({ level });
  h.begin();
  for (const c of WIN) if (h.game.phase === 'day' && !h.game.outcome) h.run(c);
  while (h.game.phase === 'day' && !h.game.outcome) h.frame();
  for (let i = Math.round(beat * 60); i > 0 && h.game.phase === 'day'; i--) h.frame();
  return h;
}
const bubbles = (h, owner) => h.game.fx.bubbles.filter((b) => b.owner === owner).map((b) => b.icons.join(''));
const facing = (n, x, y) => Math.abs(angleDiff(n._faceTarget, Math.atan2(y - n.y, x - n.x))) < 1e-6;

// 1. No verdict, or one that returns null: the rule as before.
{
  const a = play(FP).game.outcome;
  let args = null;
  const b = play(withVerdict((game, x) => { args = x; return null; })).game.outcome;
  ok(a.result === 'win' && b.result === 'win' && !('why' in b), `null keeps the rule (${a.result}, ${b.result})`);
  ok(args && args.result === 'win' && args.present === true && args.routes.join() === 'box', `verdict(game, ${JSON.stringify(args)})`);
}

// 2. It can overturn the result, say why, and point the whole table at you.
{
  const h = play(withVerdict(() => ({ result: 'blamed', why: 'test', stare: { at: 'player', think: ['📝'], say: ['😠', '🫵'], line: 'tattle' } })));
  const o = h.game.outcome;
  const boss = h.game.npcs.find((n) => n.id === 'boss');
  ok(o.result === 'blamed' && o.why === 'test' && o.newRoutes.length === 0, `blamed, why 'test', no new route (${JSON.stringify(o)})`);
  const end = h.log.find((e) => e.name === 'day:end');
  ok(!end, 'the beat is still running');
  ok(facing(boss, h.game.player.x, h.game.player.y), 'the boss turns to you');
  ok(bubbles(h, 'boss').includes('📝'), `he thinks the verdict's thought (${bubbles(h, 'boss')})`);
  ok(h.game.fx.lines.some((l) => l.from === 'boss' && l.kind === 'tattle'), 'with a sightline to you');
  for (let i = 0; i < 70; i++) h.frame();
  ok(bubbles(h, 'boss').includes('😠🫵'), `then says it (${bubbles(h, 'boss')})`);
}

// 3. A win can stare somewhere else (someone else gets the blame): the result stays, confetti and all.
{
  const h = play(withVerdict(() => ({ stare: { at: 'meeting_presenter' } })));
  const boss = h.game.npcs.find((n) => n.id === 'boss');
  const c = spotPos(h.game, 'meeting_presenter');
  ok(h.game.outcome.result === 'win' && facing(boss, c.x, c.y), 'win, and the table stares at the spot');
  ok(bubbles(h, 'boss').includes('🪑❓'), 'with the default bubbles');
}

// 4. Blamed without a stare: your empty chair, as before.
{
  const h = play(withVerdict(() => ({ result: 'blamed' })));
  const boss = h.game.npcs.find((n) => n.id === 'boss');
  const c = spotPos(h.game, FP.meeting.chair);
  ok(h.game.outcome.result === 'blamed' && facing(boss, c.x, c.y) && bubbles(h, 'boss').includes('🪑❓'), 'blamed: the empty chair by default');
}

// 5. The validator wants a function.
{
  let msg = '';
  try { validateLevel(withVerdict('blame kev'), 'bad-verdict'); } catch (e) { msg = e.message; }
  ok(/meeting\.verdict/.test(msg), `validator: ${msg.split('\n').find((l) => /meeting\.verdict/.test(l))?.trim()}`);
}

console.log(fails ? `\n${fails} FAILED` : '\nall passed');
process.exit(fails ? 1 : 0);
