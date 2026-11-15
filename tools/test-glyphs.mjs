// The visual language (DESIGN.md "Visual language": people speak emoji, the world is drawn). Run: node tools/test-glyphs.mjs
//   1. glyphs: '@id' draws a face, '#name' a thing; an emoji in the world of a migrated level is recorded
//      (render/util.js worldEmoji), in speech or in a legacy level it is not
//   2. things: the lookup (item draw, decor.things, engine THINGS), the held and tint opts, 'owner' tint
//   3. validator: a migrated level is refused an item without a draw, an emoji in a hand, an 'icon' prop and an
//      interaction icon; a legacy one is not
//   4. presentation: the lit target with the E key cap on its far side and no icon, the bare pointing hand, a
//      judgement sign moved off a person
//   5. the runtime check: tools/lib/drawn.mjs on a real plan, and the gate's `drawn` check
import { createFakeCanvas } from './lib/fake-canvas.mjs';

let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

const log = [];
let rec = false;
const fake = createFakeCanvas({
  onCall(label, method, args) {
    if (rec) log.push([method, ...args]);
  },
});
fake.installDom({ innerWidth: 960, innerHeight: 600, devicePixelRatio: 1 });
const ctx = fake.makeCanvas('glyphs').getContext('2d');
const record = (fn) => {
  log.length = 0;
  rec = true;
  try { fn(); } finally { rec = false; }
  return log.slice();
};
const texts = (calls) => calls.filter((c) => c[0] === 'fillText').map((c) => c[1]);

const { emoji, worldEmoji, useGlyphs, glyphScope, T } = await import('../src/render/util.js');
const { THINGS, thingFor, drawThing, useThings } = await import('../src/render/things.js');
const { useFaces, drawPerson, personState, lookFor } = await import('../src/render/characters.js');
const { drawFocusHint, drawBubbles } = await import('../src/render/effects.js');
const { levelProblems } = await import('../src/levels/validate.js');
const { LEGACY_LEVELS, isLegacyLevel } = await import('../src/levels/legacy.js');
const LEGACY_ID = LEGACY_LEVELS[0]; // any level still on the list (none left: the legacy checks below are skipped)
const legacyOk = (cond, msg) => (LEGACY_ID ? ok(cond, msg) : console.log(`skip ${msg} (the legacy list is empty)`));
const { levels, getLevel } = await import('../src/levels/index.js');
const { worldGlyphs, drawnCheck } = await import('./lib/drawn.mjs');

const meeting = getLevel('meeting');
const fixture = getLevel('fixture');
const game = { level: meeting, player: { id: 'player', x: 4, y: 4 }, npcs: [], time: 1 };
useFaces(game);
useThings(game);

// --- 1. glyphs ------------------------------------------------------------------------
{
  const was = glyphScope('world');
  useGlyphs(true, 'test-strict');
  const before = worldEmoji.length;
  ok(texts(record(() => emoji(ctx, '@player', 10, 10, 16))).length === 0, "'@player' draws your face, not text");
  ok(texts(record(() => emoji(ctx, '@kev', 10, 10, 16))).length === 0, "'@kev' draws Kev's face");
  ok(texts(record(() => emoji(ctx, '#sandwich', 10, 10, 16))).length === 0, "'#sandwich' draws the level's item painter");
  ok(texts(record(() => emoji(ctx, '#clock', 10, 10, 16))).length === 0, "'#clock' draws the engine thing");
  ok(worldEmoji.length === before, 'faces and things in the world are not recorded');
  record(() => emoji(ctx, '🥪', 10, 10, 16));
  ok(worldEmoji.some((v) => v.glyph === '🥪' && v.level === 'test-strict'), 'an emoji in the world of a migrated level is recorded');
  record(() => emoji(ctx, '#nothing', 10, 10, 16));
  ok(worldEmoji.some((v) => v.glyph === '#nothing'), "a '#name' that nothing draws falls back to text, and is recorded");
  const n = worldEmoji.length;
  record(() => emoji(ctx, '🥪', 10, 10, 16));
  ok(worldEmoji.length === n, 'each glyph is recorded once per level');
  glyphScope('speech');
  record(() => emoji(ctx, '🍩', 10, 10, 16));
  glyphScope(null);
  record(() => emoji(ctx, '🍪', 10, 10, 16));
  ok(!worldEmoji.some((v) => v.glyph === '🍩' || v.glyph === '🍪'), 'speech and the HUD are not checked');
  glyphScope('world');
  useGlyphs(false, 'test-legacy');
  record(() => emoji(ctx, '🍕', 10, 10, 16));
  ok(!worldEmoji.some((v) => v.glyph === '🍕'), 'a legacy level is not checked');
  glyphScope(was);
}

// --- 2. things ------------------------------------------------------------------------
{
  ok(thingFor(meeting, 'coffee') === THINGS.cup, "an item's draw names an engine thing (meeting coffee: 'cup')");
  ok(typeof thingFor(meeting, 'sandwich') === 'function' && thingFor(meeting, 'sandwich') !== THINGS.cup, "an item's draw is the level's painter");
  ok(thingFor(meeting, 'wrench') === THINGS.wrench, 'a name that is no item falls through to the engine thing');
  ok(thingFor(meeting, 'nothing') === null, 'an unknown name draws nothing');
  const seen = [];
  const spy = (c, x, y, size, t, g, opts) => seen.push(opts);
  const lvl = {
    ...meeting,
    items: { ...meeting.items, stapler: { icon: '📎', draw: spy, tint: 'owner', owner: { id: 'kev' } }, pen: { icon: '🖊️', draw: spy, tint: '#123456' } },
    decor: { ...meeting.decor, things: { trophy: 'mug' } },
  };
  const g = { ...game, level: lvl };
  useThings(g);
  ok(thingFor(lvl, 'trophy') === THINGS.mug, 'decor.things names a painter for a thing that is not an item');
  drawThing(ctx, g, 'stapler', 0, 0, 16);
  ok(seen[0]?.tint === lookFor(meeting.looks, 'kev').body && seen[0]?.type === 'stapler' && seen[0]?.held === false, "tint 'owner' is the owner's clothes colour; opts carry the type");
  const sw = glyphScope('world');
  record(() => emoji(ctx, '#pen', 0, 0, 16, { held: true }));
  glyphScope(sw);
  ok(seen[1]?.tint === '#123456' && seen[1]?.held === true, "a held '#name' passes held: true and the item's tint colour");
  ok(drawThing(ctx, g, 'nothing', 0, 0, 16) === false, 'drawThing of an unknown name is false');
  for (const [name, fn] of Object.entries(THINGS)) {
    const calls = record(() => fn(ctx, 20, 20, 16, 0.5, game, { held: true, tint: '#7799aa', type: null }));
    ok(calls.length > 0 && texts(calls).length === 0, `engine thing '${name}' draws shapes, no text`);
  }
  useThings(game);
}

// --- 3. validator ---------------------------------------------------------------------
{
  const strictLevels = Object.values(levels).filter((l) => !isLegacyLevel(l));
  for (const l of strictLevels) ok(levelProblems(l, l.id).length === 0, `${l.id}: a migrated level passes the visual-language rules`);
  ok(LEGACY_LEVELS.every((id) => !levels[id] || isLegacyLevel(levels[id])), 'the legacy list names levels by id');
  const probs = (lvl) => levelProblems(lvl, lvl.id);
  const has = (list, path) => list.some((p) => p.startsWith(path));
  const noDraw = { ...meeting, items: { ...meeting.items, coffee: { ...meeting.items.coffee, draw: undefined } } };
  delete noDraw.items.coffee.draw;
  ok(has(probs(noDraw), 'items.coffee.draw'), 'an item without a draw is refused');
  legacyOk(!has(probs({ ...noDraw, id: LEGACY_ID }), 'items.coffee.draw'), 'a legacy level may leave an item undrawn');
  const badDraw = { ...meeting, items: { ...meeting.items, coffee: { ...meeting.items.coffee, draw: 'teapot' } } };
  ok(has(probs(badDraw), 'items.coffee.draw'), 'an item draw that names no thing is refused');
  const ownerless = { ...meeting, items: { ...meeting.items, keycard: { ...meeting.items.keycard, tint: 'owner' } } };
  ok(has(probs(ownerless), 'items.keycard.tint'), "tint 'owner' without an owner is refused");
  const arms = (item) => ({ ...meeting, poses: { ...meeting.poses, arms: [{ when: () => false, arms: 'carry', item }, ...meeting.poses.arms] } });
  ok(has(probs(arms('☕')), 'poses.arms[0].item'), 'an emoji in a hand is refused');
  ok(has(probs(arms('#teapot')), 'poses.arms[0].item'), "a '#name' that draws nothing in a hand is refused");
  ok(!has(probs(arms('#coffee')), 'poses.arms[0].item'), "a '#<item>' with a draw in a hand is fine");
  legacyOk(!has(probs({ ...arms('☕'), id: LEGACY_ID }), 'poses.arms[0].item'), 'a legacy level may hold an emoji');
  const iconProp = { ...fixture, decor: { ...fixture.decor, props: [{ ...fixture.decor.props[0], draw: 'icon' }, ...fixture.decor.props.slice(1)] } };
  ok(has(probs(iconProp), 'decor.props[0].draw'), "an 'icon' prop painter is refused");
  const verb = Object.keys(meeting.interactions)[0];
  const iconRow = { ...meeting, interactions: { ...meeting.interactions, [verb]: { ...meeting.interactions[verb], icon: '☕' } } };
  ok(has(probs(iconRow), `interactions.${verb}.icon`), 'an interaction icon is refused');
  const things = { ...meeting, decor: { ...meeting.decor, things: { trophy: 'teapot' } } };
  ok(has(probs(things), 'decor.things.trophy'), 'a decor.things entry that is no painter is refused');
}

// --- 4. presentation ------------------------------------------------------------------
{
  // The lit target: the E key cap on the far side of the target from you, no icon (legacy: the icon).
  const keyAt = (calls) => calls.find((c) => c[0] === 'fillText' && c[1] === 'E');
  const hint = (px, py, focus, strict) => {
    useGlyphs(strict, strict ? 'meeting' : 'audit');
    const g = { ...game, phase: 'day', player: { ...game.player, x: px, y: py, focus } };
    return record(() => drawFocusHint(ctx, g, 0));
  };
  const up = hint(5, 6, { kind: 'interactable', x: 5, y: 3, icon: '☕' }, true);
  ok(texts(up).join('') === 'E', 'the lit target draws the E key cap and nothing else as text (no icon)');
  ok(keyAt(up)[3] < 3 * T, 'you below the target: the key cap sits above it');
  const right = hint(2, 5, { kind: 'item', x: 6, y: 5 }, true);
  ok(keyAt(right)[2] > 6 * T, 'you left of the target: the key cap sits right of it');
  const below = hint(5, 1, { kind: 'interactable', x: 5, y: 4 }, true);
  ok(keyAt(below)[3] > 4 * T, 'you above the target: the key cap sits below it');
  const self = hint(5, 5, { kind: 'self', x: 5, y: 5 }, true);
  ok(keyAt(self) && keyAt(self)[3] < 5 * T - 30, 'an action on yourself: the key cap over your head');
  ok(texts(hint(5, 6, { kind: 'interactable', x: 5, y: 3, icon: '☕' }, false)).includes('☕'), 'a legacy level floats the row icon');
  ok(texts(hint(5, 6, { kind: 'interactable', x: 5, y: 3 }, false)).includes('✋'), 'a legacy level falls back to the hand');

  // The bare pointing hand: arms 'point' with nothing in it draws a finger in a migrated level.
  const look = lookFor(meeting.looks, 'lin');
  const point = (strict) => {
    useGlyphs(strict, strict ? 'meeting' : 'audit');
    const s = personState();
    s.arms = 'point';
    s.item = null;
    s.dir = 0;
    s.head = 0;
    return record(() => drawPerson(ctx, look, s, 100, 100));
  };
  const finger = point(true);
  ok(finger.length > point(false).length && texts(finger).length === 0, 'pointing with a bare hand draws the finger, no 👉');

  // A judgement sign over a point stands off the person in front of it (legacy: above the point).
  const signAt = (strict) => {
    useGlyphs(strict, strict ? 'meeting' : 'audit');
    const g = {
      ...game,
      npcs: [{ id: 'kev', active: true, x: 10, y: 7.4 }],
      player: { id: 'player', x: 20, y: 12 },
      fx: { bubbles: [{ owner: { x: 10, y: 8 }, icons: ['✅'], kind: 'sign', age: 1, ttl: 3 }] },
    };
    return record(() => drawBubbles(ctx, g)).find((c) => c[0] === 'translate');
  };
  const [, sx, sy] = signAt(true);
  const [, lx, ly] = signAt(false);
  const head = 7.4 * T - 30 - 6;
  ok(lx === 10 * T && ly - 12.5 < 7.4 * T + 9 && ly + 12.5 > head, 'legacy: the sign stands above the point, over the person');
  ok(!(Math.abs(sx - 10 * T) < 13 + 22 && sy - 12.5 < 7.4 * T + 9 && sy + 12.5 > head), 'migrated: the sign moves off the person');
}

// --- 5. the runtime check -------------------------------------------------------------
{
  const tattle = ['goto coat_rack pretend', 'interact', 'goto coat_rack pretend', 'interact', 'wait until 3:10'];
  const seen = worldGlyphs('meeting', [tattle]);
  ok(Array.isArray(seen) && seen.length === 0, `meeting, a tattle (Lin points) and the end card: no emoji drawn as objects${seen.length ? ` (${seen.map((v) => v.glyph).join(' ')})` : ''}`);
  const coffee = meeting.items.coffee;
  const draw = coffee.draw;
  coffee.draw = (c, x, y, size) => emoji(c, '🫖', x, y, size); // a painter that cheats with an emoji
  let caught;
  try {
    caught = worldGlyphs('meeting', [['goto coffee_machine', 'interact', 'wait 3s']]);
  } finally {
    coffee.draw = draw;
  }
  ok(caught.some((v) => v.glyph === '🫖'), 'a painter that draws an emoji in your hand is caught');
  ok(fake.errors.length === 0, `the painters made no bad canvas calls${fake.errors.length ? `: ${fake.errors.slice(0, 3).join('; ')}` : ''}`);
  legacyOk(!drawnCheck({ level: LEGACY_ID }).ok, 'the gate fails a level on the legacy list');
  ok(drawnCheck({ level: 'meeting', glyphs: [] }).ok, 'the gate passes a migrated level that draws no emoji objects');
  ok(!drawnCheck({ level: 'meeting', glyphs: [{ glyph: '🥪', level: 'meeting' }] }).ok, 'the gate fails a level that draws an emoji object');
}

console.log(fails ? `\n${fails} FAILED` : '\nall ok');
process.exit(fails ? 1 : 0);
