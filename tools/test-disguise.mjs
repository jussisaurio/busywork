// Headless tests for the disguise rules (src/play/disguise.js, via src/play/rules.js): a worn item makes the
// player someone else to whoever doesn't know better. Uses the fixture level with a mask that passes for Gus,
// and places people by hand (no NPC sim, so no glances): only updateRules runs.
//
//   node tools/test-disguise.mjs
import { FIXED_DT, at } from '../src/config.js';
import { createGame } from '../src/state.js';
import { createNpcs, updateNpcs, leaving } from '../src/sim/npcs.js';
import { advanceClock } from '../src/game/loop.js';
import { npcSees, findNpc } from '../src/game/perception.js';
import { updateRules } from '../src/play/rules.js';
import { DOUBLE_TAKE, disguiseView } from '../src/play/disguise.js';
import { levelProblems } from '../src/levels/validate.js';
import { levels } from '../src/levels/index.js';
import { createFakeCanvas } from './lib/fake-canvas.mjs';

let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

const BASE = levels.fixture;
const MASK = { icon: '🎭', place: 'mask', disguise: { as: 'gus', look: { hair: '#c27b2c' }, greet: [{ say: ['🧁', '👋'] }] } };
const LEVEL = {
  ...BASE,
  items: { ...BASE.items, mask: MASK },
  initialWorld: () => ({ ...BASE.initialWorld(), mask: 'player' }),
};

function day(level = LEVEL) {
  const game = createGame({ level });
  game.npcs = createNpcs(game);
  game.phase = 'day';
  const log = [];
  game.events.on('*', (name, payload) => log.push({ name, payload }));
  const doreen = findNpc(game, 'doreen');
  const gus = findNpc(game, 'gus');
  return { game, log, doreen, gus, p: game.player };
}
const rules = (game, s) => {
  for (let i = Math.round(s / FIXED_DT); i > 0; i--) updateRules(game, FIXED_DT);
};
const named = (log, name) => log.filter((e) => e.name === name);
const place = (who, x, y, dir) => Object.assign(who, { x, y }, dir === undefined ? {} : { dir });
// Doreen sits at her desk facing south; IN is in her cone, FAR is out of everyone's sight.
const IN = { x: 6.5, y: 5.5 };
const FAR = { x: 19.5, y: 10.5 };
// Put the mask on where nobody sees, then walk to (x, y).
function wearUnseen(game, p, { x, y }) {
  place(p, FAR.x, FAR.y);
  p.seated = false;
  p.held = 'mask';
  rules(game, FIXED_DT);
  place(p, x, y);
}
const sneaky = { type: 'fix_calendar', targetId: 'calendar', t: 0, duration: 99, sneaky: true, owner: null, idle: false, x: 3.5, y: 4.5, item: null };

// 0. A level without a disguise item: nothing to track, no events, the rules as before.
{
  const { game, log, doreen, p } = day(BASE);
  place(p, IN.x, IN.y);
  p.seated = false;
  ok(npcSees(game, doreen, p.x, p.y), 'setup: Doreen sees the spot in front of her desk');
  p.held = 'cake';
  rules(game, 0.1);
  ok(game.rules.worn === null && disguiseView(game, doreen) === null, 'no disguise item: no disguise view, nothing worn');
  ok(!log.some((e) => e.name.startsWith('disguise:')), 'no disguise events');
}

// 1. Fooled: she passes for Gus. Doreen greets "Gus" once, lets her do something sneaky and doesn't mind her idling.
{
  const { game, log, doreen, gus, p } = day();
  gus.active = false; // out for candles
  wearUnseen(game, p, IN);
  ok(game.rules.worn === 'mask' && !named(log, 'disguise:knows').length, 'put on unseen: nobody knows');
  ok(disguiseView(game, doreen) === 'fooled', "Doreen's view: fooled");
  p.action = { ...sneaky };
  rules(game, 2);
  ok(!game.caught, 'a sneaky action in front of the authority: not caught');
  const fooled = named(log, 'disguise:fooled');
  ok(fooled.length === 1 && fooled[0].payload.by === 'doreen' && fooled[0].payload.as === 'gus', "'disguise:fooled' {by: doreen, as: gus}, once");
  ok(named(log, 'say').some((e) => e.payload.owner === 'doreen' && e.payload.icons.join('') === '🧁👋'), 'she says the greet line');
  ok(!game.watch.doreen, "her cone doesn't flare");
  p.action = null;
  rules(game, 3);
  ok(game.suspicion.doreen === 0, 'idling in her view: no suspicion (she sees Gus standing around)');
  ok(named(log, 'disguise:fooled').length === 1, 'still just the one greeting');
  p.held = null; // take it off out of her sight
  place(p, FAR.x, FAR.y);
  rules(game, FIXED_DT);
  place(p, IN.x, IN.y);
  rules(game, 2);
  ok(named(log, 'doreen:workAssigned').length === 1, 'without it, the same idling gets her sent to her desk');
}

// 2. She saw him walk out: she knows. The double take (🧁❓), then caught.
{
  const { game, log, doreen, gus, p } = day();
  place(gus, 5.5, 4.5);
  gus._plan = { vanish: 'leave', done: false }; // walking out for the day
  ok(leaving(gus), 'leaving(): a leave plan, not finished');
  rules(game, FIXED_DT);
  const k = named(log, 'disguise:knows');
  ok(k.length === 1 && k[0].payload.by === 'doreen' && k[0].payload.as === 'gus' && k[0].payload.how === 'left', "'disguise:knows' {by: doreen, as: gus, how: 'left'}");
  gus._plan.done = true;
  gus.active = false;
  gus._gone = true;
  ok(!leaving(gus), 'leaving(): false once gone');
  wearUnseen(game, p, IN);
  ok(disguiseView(game, doreen) === 'unmask', "Doreen's view: unmask");
  rules(game, FIXED_DT);
  const n = named(log, 'witness:notice');
  ok(n.length === 1 && n[0].payload.by === 'doreen', 'she notices at once');
  ok(named(log, 'say').some((e) => e.payload.owner === 'doreen' && e.payload.icons.join('') === '🧁❓'), 'a double take: 🧁❓ (the icon of who she is dressed as)');
  ok(game.watch.doreen === 'disguise', "her cone flares ('disguise')");
  rules(game, DOUBLE_TAKE - 0.1);
  ok(!game.caught, `not caught before ${DOUBLE_TAKE} s`);
  rules(game, 0.2);
  ok(game.caught?.by === 'doreen' && game.caught.reason === 'disguise', "then caught {by: doreen, reason: 'disguise'}");
  ok(!named(log, 'disguise:fooled').length, 'no greeting from someone who knows');
}

// 3. She saw her put it on: she knows.
{
  const { game, log, doreen, gus, p } = day();
  gus.active = false;
  place(p, IN.x, IN.y);
  p.seated = false;
  p.held = 'mask';
  rules(game, FIXED_DT);
  const k = named(log, 'disguise:knows');
  ok(k.length === 1 && k[0].payload.by === 'doreen' && k[0].payload.how === 'saw', "put on in her sight: 'disguise:knows' {how: 'saw'}");
  rules(game, DOUBLE_TAKE + 0.1);
  ok(game.caught?.reason === 'disguise', 'and caught');
}

// 4. The real one knows his own face. A witness who sees through it shouts once; the authority hears.
{
  const { game, log, doreen, gus, p } = day();
  place(gus, 10.5, 8.5, Math.PI); // facing away while she puts it on
  place(doreen, 3.5, 1.5, -Math.PI / 2); // facing the wall: she hears, doesn't see
  wearUnseen(game, p, { x: 13.5, y: 8.5 });
  gus.dir = 0;
  ok(npcSees(game, gus, p.x, p.y) && !npcSees(game, doreen, p.x, p.y), 'setup: Gus sees her, Doreen does not');
  ok(disguiseView(game, gus) === 'unmask', "Gus's view of himself: unmask");
  rules(game, DOUBLE_TAKE + 0.1);
  const t = named(log, 'witness:tattle');
  ok(t.length === 1 && t[0].payload.by === 'gus' && t[0].payload.reason === 'disguise' && t[0].payload.heard, "Gus tattles {reason: 'disguise', heard: true}");
  ok(named(log, 'doreen:workAssigned').length === 1, 'Doreen sends her to her desk');
  ok(game.world.mask === 'dropped' && !p.held, 'and the mask stays where she stood');
}

// 5. Unmasked once: with the authority out, the witness holds a grudge, shouts once, and tells her later (👉🎭).
{
  const { game, log, doreen, gus, p } = day();
  place(gus, 10.5, 8.5, Math.PI);
  doreen.active = false; // out of the room
  wearUnseen(game, p, { x: 13.5, y: 8.5 });
  gus.dir = 0;
  rules(game, 3);
  ok(named(log, 'witness:tattle').length === 1, 'one tattle in 3 s of staring, not one per double take');
  ok(game.rules.grudge?.by === 'gus' && game.rules.grudge.icon === '🎭', "a grudge, pointing at the item's icon");
  ok(disguiseView(game, gus) === null, 'to Gus she is just herself now');
  doreen.active = true;
  place(doreen, 3.5, 1.5, -Math.PI / 2);
  rules(game, 1.5);
  const late = named(log, 'witness:tattle').filter((e) => e.payload.late);
  ok(late.length === 1 && late[0].payload.icon === '🎭', 'Doreen is back: Gus points her out, 👉🎭');
}

// 6. leaving() in the real sim: level 1's Kev walks out at 3:00.
{
  const game = createGame({ level: levels.meeting });
  game.npcs = createNpcs(game);
  game.phase = 'day';
  const kev = findNpc(game, 'kev');
  let seen = false;
  let gone = false;
  for (let i = 0; i < 60 * 60 * 3 && !gone; i++) {
    updateNpcs(game, FIXED_DT);
    advanceClock(game, FIXED_DT);
    if (leaving(kev)) seen = true;
    gone = kev._gone;
  }
  ok(seen && gone && !leaving(kev), `level 1: Kev is leaving() on his walk out, not once gone (${game.clock.minute >= at('3:00')})`);
}

// 7. The validator checks disguise.as.
{
  const bad = { ...LEVEL, items: { ...LEVEL.items, mask: { ...MASK, disguise: { as: 'nobody' } } } };
  const probs = levelProblems(bad, 'test').join('\n');
  ok(/items\.mask\.disguise\.as/.test(probs), 'validator: an unknown disguise.as is a problem');
  ok(!levelProblems(LEVEL, 'test').some((s) => /disguise/.test(s)), 'validator: the test level is fine');
}

// 8. Render: a worn disguise is not drawn in her hand; a carried item is. (The HUD's held slot draws either once.)
{
  const drawn = new Map();
  const fake = createFakeCanvas({ onCall(label, key, [txt]) { if (key === 'fillText') drawn.set(String(txt), (drawn.get(String(txt)) ?? 0) + 1); } });
  fake.installDom();
  const { createRenderer } = await import('../src/render/renderer.js');
  const draw = (level) => {
    drawn.clear();
    const { game, p } = day(level);
    Object.assign(p, { held: 'mask', seated: false, x: IN.x, y: IN.y });
    createRenderer(fake.makeCanvas('main'), { strict: true }).render(game);
    return drawn.get('🎭') ?? 0;
  };
  const plain = { ...LEVEL, items: { ...LEVEL.items, mask: { icon: '🎭', place: 'mask' } } };
  const carried = draw(plain);
  const worn = draw(LEVEL);
  ok(carried === 2 && worn === 1, `render: a carried mask is drawn in her hand and the HUD (${carried}), a worn one only in the HUD (${worn})`);
  ok(!fake.errors.length, `render: no fake-canvas errors${fake.errors.length ? ` (${fake.errors[0]})` : ''}`);
}

if (fails) {
  console.log(`\n${fails} FAILED`);
  process.exit(1);
}
console.log('\nall disguise tests passed');
