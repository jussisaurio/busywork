// Face icons: in any icons array, '@<castId>' draws that cast member's head from the level's looks, and
// '@player' draws yours. Checks bubbles, the end-card icon row and a bare emoji() call on a fake canvas.
//   node tools/test-faces.mjs
import { createFakeCanvas } from './lib/fake-canvas.mjs';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

const texts = [];
const fills = [];
const fake = createFakeCanvas({
  onCall(label, method, args) { if (method === 'fillText') texts.push(String(args[0])); },
  onSet(label, prop, value) { if (prop === 'fillStyle') fills.push(value); },
});
const { createRenderer } = await import('../src/render/renderer.js');
const { emoji } = await import('../src/render/util.js');
const { lookFor } = await import('../src/render/characters.js');
const { C } = await import('../src/render/palette.js');
fake.installDom();
const { createHarness } = await import('../src/agent/harness.js');
const { say } = await import('../src/core/fx.js');

const h = createHarness({ level: 'meeting' });
const g = h.game;
h.begin();
h.run('wait 1s');
const canvas = fake.makeCanvas('main');
const renderer = createRenderer(canvas, { strict: true });
const looks = g.level.looks;
const [someone, other] = g.npcs;
const reset = () => { texts.length = 0; fills.length = 0; fake.errors.length = 0; };
const drew = (look, from = 0) => [look.skin, look.hair, look.body].every((c) => fills.indexOf(c, from) >= 0);

// 1. A speech bubble with a face and a glyph.
reset();
say(g, someone.id, [`@${someone.id}`, '📞']);
for (const b of g.fx.bubbles) b.age = 0.6;
fake.scene = 'bubble';
renderer.render(g);
ok(fake.errors.length === 0, `bubble frame draws cleanly ${fake.errors.slice(0, 3).join(' ')}`);
ok(!texts.some((t) => t.startsWith('@')), 'no face id is drawn as text');
ok(texts.includes('📞'), 'the glyph next to the face is still drawn as text');
ok(drew(lookFor(looks, someone.id, someone.color)), `the face uses ${someone.id}'s skin, hair and body colours`);

// 2. '@player' is you; an id nobody has stays visible as text, so a typo is seen.
reset();
say(g, other.id, ['@player', '@nobody'], { kind: 'thought' });
for (const b of g.fx.bubbles) b.age = 0.6;
fake.scene = 'thought';
renderer.render(g);
ok(drew(lookFor(looks, 'player')), "'@player' draws the player's face");
ok(texts.includes('@nobody') && !texts.includes('@player'), 'an unknown id falls back to text; a known one does not');

// 3. The end-card icon row.
reset();
g.fx.bubbles.length = 0;
g.level = { ...g.level, endScenes: { kindOf: () => 'one', scenes: { one: { win: false, icons: [`@${other.id}`, '😠'], draw() {} } } } };
g.phase = 'end';
g.outcome = { result: 'fail', routes: [], newRoutes: [], loop: 1, minute: 0 };
fake.scene = 'end';
renderer.render(g);
g.time += 2; // the row pops in after the card
renderer.render(g);
ok(fake.errors.length === 0, `end frame draws cleanly ${fake.errors.slice(0, 3).join(' ')}`);
const card = fills.lastIndexOf(C.paper); // drawn after the card itself, so it is the row, not the world behind
ok(card > 0 && !texts.some((t) => t.startsWith('@')) && drew(lookFor(looks, other.id, other.color), card), 'the end-card row draws the face');

// 4. emoji() keeps its old calls for a plain glyph (other levels' render goldens depend on it), and a face leaves
//    the same text state behind as a glyph would.
const calls = [];
const spy = createFakeCanvas({ onCall: (l, m, a) => calls.push([m, ...a]), onSet: (l, p, v) => calls.push([p, v]) });
const ctx = spy.makeCanvas('spy').getContext('2d');
emoji(ctx, '☕', 10, 20, 15);
ok(JSON.stringify(calls) === JSON.stringify([
  ['font', calls[0][1]], ['textAlign', 'center'], ['textBaseline', 'middle'], ['fillStyle', '#000'], ['fillText', '☕', 10, 20],
]), 'a plain glyph is one fillText, as before');
calls.length = 0;
emoji(ctx, `@${someone.id}`, 10, 20, 15);
ok(calls.slice(0, 4).map((c) => c[0]).join() === 'font,textAlign,textBaseline,fillStyle' && !calls.some((c) => c[0] === 'fillText'),
  'a face sets the same text state, then draws shapes, no text');
ok(ctx.__state.depth === 0 && spy.errors.length === 0, 'a face balances save/restore and draws cleanly');

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
