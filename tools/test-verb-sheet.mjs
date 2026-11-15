// Tests for the verb sheets (tools/lib/verbs.mjs), with a fake canvas (no @napi-rs/canvas): every item of a level
// gets a sheet, and the sheet covers every verb the engine has for it. The verbs expected here come from the level's
// data and the engine's own rows (play/interactions.js actionRow, sim/mechanics/putdown.js putSpots), not from
// verbs.mjs: a verb is either drawn or named as not drawn, with the reason.
//
//   node tools/test-verb-sheet.mjs
import { createHash } from 'node:crypto';
import { createFakeCanvas } from './lib/fake-canvas.mjs';
import { captureVerbs, verbsIntents } from './lib/verbs.mjs';
import { getLevel } from '../src/levels/index.js';
import { createHarness } from '../src/agent/harness.js';
import { actionRow } from '../src/play/interactions.js';
import { putSpots } from '../src/sim/mechanics/putdown.js';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

// A canvas whose PNG is a hash of what was drawn on it, a drawn canvas standing for its own hash: the same picture
// gives the same bytes, different pictures different bytes.
function fakeLib() {
  const ops = new Map();
  const content = (label) => createHash('sha256').update((ops.get(label) ?? []).join(';')).digest();
  const str = (a) => (a && typeof a === 'object' ? (a.label ? content(a.label).toString('hex') : 'obj') : String(a));
  const fake = createFakeCanvas({
    onCall: (label, m, args) => { if (!ops.has(label)) ops.set(label, []); ops.get(label).push(`${m}(${args.map(str).join(',')})`); },
    onSet: (label, p, v) => { if (!ops.has(label)) ops.set(label, []); ops.get(label).push(`${p}=${str(v)}`); },
  });
  let n = 0;
  return {
    fake,
    createCanvas(w, h) {
      const c = fake.makeCanvas(`c${n++}`, w, h);
      c.toBuffer = () => content(c.label);
      return c;
    },
  };
}

// What the engine lets you do with `type` in hand, from the level and its rows: { selves: ['self' verbs that take
// it], drop, spots: [{ name, taken: the other item lying there at day start, or null }], pickUp }.
function expected(level, type) {
  const h = createHarness({ level });
  h.begin();
  const g = h.game;
  const atStart = g.world.items.map((i) => ({ type: i.type, spot: i.spot }));
  g.player.held = type;
  g.player.seated = false;
  const names = [...Object.keys(level.interactions ?? {}), ...Object.keys(level.items).map((t) => `eat_${t}`), 'drop'];
  const selves = [...new Set(names)].filter((v) => {
    const row = actionRow(g, v);
    return row?.on === 'self' && row.can(g.player, g.world, null);
  });
  const spots = putSpots(level).filter((e) => e.accepts.includes(type))
    .map((e) => ({ name: e.name, taken: atStart.find((i) => i.spot === e.name && i.type !== type)?.type ?? null }));
  const drop = selves.includes('drop');
  return { selves, drop, spots, pickUp: drop || spots.some((s) => !s.taken) };
}

const has = (sheet, verb, phase, label = '') => sheet.panels.some((p) => p.verb === verb && p.phase === phase && p.label.includes(label));

// Every item × verb on a level's sheets: drawn, or named as not drawn.
function coverage(id) {
  const level = getLevel(id);
  const lib = fakeLib();
  const { tiles, sheets } = captureVerbs(level, { lib });
  const items = Object.keys(level.items ?? {});
  ok(lib.fake.errors.length === 0, `${id}: the sheets draw with no bad canvas calls${lib.fake.errors.length ? `: ${lib.fake.errors.slice(0, 3).join('; ')}` : ''}`);
  ok(sheets.map((s) => s.type).join() === items.join(), `${id}: one sheet per item, in level.items order (${items.join(', ')})`);
  ok(sheets.every((s, i) => s.file === `${String(i + 1).padStart(2, '0')}.png` && !s.png.equals(s.labelled)), `${id}: sheets are numbered, and the labelled copy differs from the plain one`);
  for (const s of sheets) {
    const e = expected(level, s.type);
    const T = `${id}: the ${s.type}`;
    ok(has(s, 'carry', 'walking') && has(s, 'pretend', 'standing') && has(s, 'pretend', 'walking'), `${T}: carried walking, pretending standing and walking`);
    // E: the first 'self' row that takes it wins (interactions.js), and its before and after are drawn.
    const eWin = e.selves[0] ?? null;
    ok(s.eVerb === eWin, `${T}: E runs ${eWin ?? 'nothing'} (sheet: ${s.eVerb ?? 'nothing'})`);
    if (eWin) ok(has(s, eWin, 'before', 'E →') && has(s, eWin, 'after'), `${T}: E → ${eWin}, before and after`);
    else ok(has(s, 'E', 'none'), `${T}: E with nothing to do, drawn as no prompt`);
    for (const v of e.selves.slice(1)) ok(has(s, v, 'after'), `${T}: ${v} (not on E), its result drawn`);
    ok(e.pickUp === has(s, 'pick_up', 'after'), `${T}: picked up again ${e.pickUp ? 'drawn' : 'not drawn, as nothing puts it down'}`);
    if (e.drop) ok(has(s, 'pick_up', 'before', 'on the floor'), `${T}: on the floor after the drop, a step away`);
    for (const sp of e.spots) {
      if (sp.taken) ok(s.missing.some((m) => m.startsWith(`put on ${sp.name}:`) && m.includes(sp.taken)), `${T}: put on ${sp.name} named as not drawn (the ${sp.taken} lies there)`);
      else ok(has(s, 'put', 'before', `put on ${sp.name}`) && has(s, 'put', 'after', `put on ${sp.name}`), `${T}: put on ${sp.name}, before and after`);
    }
    // Every panel of the sheet has an intent in intents.md, and every missing verb is named there.
    ok(s.panels.every((p, k) => s.intent.includes(`\n${k + 1}. ${p.label}: `)) && s.missing.every((m) => s.intent.includes(`Not drawn: ${m}`)),
      `${T}: every panel and every verb not drawn is in its intents`);
  }
  // The tiles items are carried on are walkable.
  const h = createHarness({ level });
  h.begin();
  ok(tiles.length > 0 && tiles.every((t) => h.game.map.isWalkable(t.x, t.y, 'player')), `${id}: empty tiles found, all walkable`);
  return { level, sheets, lib };
}

// --- meeting: four items (drop, eat, keep + put on spots) ---
const meeting = coverage('meeting');
const sandwich = meeting.sheets.find((s) => s.type === 'sandwich');
const eaten = sandwich.panels.find((p) => p.verb === 'eat_sandwich' && p.phase === 'after');
ok(eaten && eaten.smeared && eaten.held === null, 'meeting: after eating the sandwich, your hand is empty and the stain is on you');
ok(sandwich.panels.some((p) => p.verb === 'eat_sandwich' && p.phase === 'during'), 'meeting: eating (2 s) gets a during panel');
const mug = meeting.sheets.find((s) => s.type === 'mug');
ok(!mug.panels.some((p) => p.verb === 'drop'), 'meeting: the mug (keep) is never dropped');

// --- second-thoughts: the letter is edible, and eating it puts the mustard on your shirt ---
const st = coverage('second-thoughts');
const letter = st.sheets.find((s) => s.type === 'letter');
const ate = letter.panels.find((p) => p.verb === 'eat_letter' && p.phase === 'after');
ok(letter.eVerb === 'eat_letter' && ate?.smeared === true, 'second-thoughts: E with the letter eats it, and the stain is drawn after');
ok(/eat_letter done\. It changed: [^\n]*player\.smeared: false → true \(drawn as a stain on your shirt/.test(letter.intent), 'second-thoughts: the letter\'s intents say the stain is drawn on your shirt');
ok(has(letter, 'drop', 'after', 'not on E'), 'second-thoughts: dropping the letter, which E does not reach, is drawn too');
ok(verbsIntents(st.sheets).startsWith('## Verb sheets') && verbsIntents([]) === '', 'verbsIntents: a section when there are sheets, nothing when there are none');

// --- audit: spots taken at day start are named, not drawn; reactions are marked on their panel ---
const audit = coverage('audit');
const boss = audit.sheets.find((s) => s.type === 'laptop_boss');
const seen = boss.panels.find((p) => p.reacted.length);
ok(!seen || (boss.intent.includes('Someone reacted to you by this panel') && boss.trouble.length > 0), 'audit: a reaction to the player is marked on the panel where it happens');

// --- a level with no items: no sheets ---
ok(captureVerbs({ ...getLevel('meeting'), items: {} }, { lib: fakeLib() }).sheets.length === 0, 'a level with no items: no sheets'); // early-bus had none until its redesign

// --- the same level gives the same bytes ---
const again = captureVerbs(getLevel('second-thoughts'), { lib: fakeLib(), items: ['letter'] }).sheets[0];
ok(again.png.equals(letter.png) && again.labelled.equals(letter.labelled) && again.intent === letter.intent, 'second-thoughts: drawing the letter\'s sheet again gives the same bytes');
let threw = false;
try { captureVerbs(getLevel('meeting'), { lib: fakeLib(), items: ['nope'] }); } catch { threw = true; }
ok(threw, 'an item the level does not have is an error');

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
