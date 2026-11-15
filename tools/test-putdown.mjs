// Headless tests for the put-down extensions (src/sim/mechanics/putdown.js), on variants of the fixture level
// "The Suggestion Box" (src/levels/fixture-putdown): the boss is in the restroom 2:36-2:44, then back at his desk
// behind the glass, watching the open plan.
//
//   node tools/test-putdown.mjs
import { at } from '../src/config.js';
import { createHarness } from '../src/agent/harness.js';
import { levels } from '../src/levels/index.js';
import { validateLevel } from '../src/levels/validate.js';

const FP = levels['fixture-putdown'];
let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

// A shelf on the open-plan floor in full view of the boss's desk (it takes the note; nobody owns it).
const SHELF = { shelf: { x: 4, y: 7, accepts: ['note'] } };
const variant = ({ put, spots = {} } = {}) => ({
  ...FP,
  spots: { ...FP.spots, ...spots },
  items: { ...FP.items, note: { ...FP.items.note, ...(put ? { put } : {}) } },
});

function play(level, cmds) {
  const h = createHarness({ level });
  h.begin();
  const out = [];
  for (const c of cmds) if (h.game.phase === 'day' && !h.game.outcome && !h.game.caught) out.push(h.run(c));
  return { h, out, names: h.log.map((e) => e.name) };
}
const put = (h) => h.log.find((e) => e.name === 'item:put');
const started = (h) => h.log.find((e) => e.name === 'action:start' && e.payload.type === 'put');

// Write the note while the boss is out (2:39), then wait at the desk until he is back watching (2:46).
const WRITE = ['pretend until 2:39', 'interact'];
const BACK = [...WRITE, 'pretend until 2:46'];

// 1. Without `put`, putting down is instant (as before): right in front of the boss, on the shelf.
{
  const { h } = play(variant({ spots: SHELF }), [...BACK, 'put shelf pretend']);
  ok(put(h)?.payload.spot === 'shelf' && !started(h), 'no `put`: instant, no timed action');
  ok(!h.game.caught, 'and the boss watching from his desk does nothing (the gap the flag closes)');
}

// 2. With `put: 0.8`, it's a timed sneaky action: the item lands only when it's done.
{
  const { h } = play(variant({ put: 0.8 }), [...WRITE, 'put box']);
  const s = started(h);
  const done = h.log.find((e) => e.name === 'action:done' && e.payload.type === 'put');
  ok(s && done, `put: 0.8 starts and finishes a 'put' action (${s?.payload.targetId})`);
  const i = h.log.indexOf(done);
  ok(put(h) && h.log.indexOf(put(h)) > i, 'item:put comes after action:done');
  ok(h.game.world.note === 'box' && h.game.world.items.some((it) => it.spot === 'box'), 'the note lies in the box');
}

// 3. The boss watching sees a timed put and catches you for it (reason 'action'), and the note stays in your hand.
{
  const { h } = play(variant({ put: 0.8, spots: SHELF }), [...BACK, 'put shelf pretend']);
  ok(started(h) && h.game.caught?.reason === 'action', `seen: caught for the action (${h.game.caught?.reason})`);
  ok(!put(h) && h.game.player.held === 'note', 'nothing was put down');
}

// 4. Moving stops a timed put.
{
  const { h } = play(variant({ put: 0.8 }), [...WRITE, 'goto box']);
  const p = h.game.player;
  ok(p.focus?.action === 'put' && p.focus.timed?.duration === 0.8 && p.focus.timed.sneaky, 'the ✋ focus carries the timing');
  h.run('wait 0.2s'); // no-op settle
  const before = h.log.length;
  h.game.input.press('interact');
  h.frame();
  ok(p.action?.type === 'put' && p.action.sneaky && p.action.owner === null && p.action.saw === '📝', 'the action is sneaky to everyone and saw the note');
  h.run('move W 0.3s');
  const cancel = h.log.slice(before).find((e) => e.name === 'action:cancel');
  ok(cancel?.payload.reason === 'moved' && !put(h) && p.held === 'note', `moving cancels it (${cancel?.payload.reason})`);
}

// 5. The validator rejects a bad `put`.
{
  let msg = '';
  try { validateLevel({ ...FP, items: { note: { ...FP.items.note, put: 'slow' } } }, 'bad-put'); } catch (e) { msg = e.message; }
  ok(/items\.note\.put/.test(msg), `validator: ${msg.split('\n').find((l) => /items\.note\.put/.test(l))?.trim()}`);
}

// 6. The fixture level itself is unchanged: its route still wins with an instant put.
{
  const { h } = play(FP, [...WRITE, 'put box pretend', 'goto meeting_seat pretend', 'wait until 3:00']);
  while (h.game.phase === 'day' && !h.game.outcome) h.frame();
  ok(!started(h) && h.game.outcome?.result === 'win', `fixture-putdown: instant put, ${h.game.outcome?.result}`);
}

console.log(fails ? `\n${fails} FAILED` : '\nall passed');
process.exit(fails ? 1 : 0);
