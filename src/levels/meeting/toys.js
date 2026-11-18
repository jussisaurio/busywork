// Level 1's toys (level.toys; the fields are in src/sim/mechanics/toy.js): things you poke that answer back and
// decide nothing.
//   pound      out on the balcony without his card (balcony.js), the door shut: you pound on it 👊🚪, the way he does.
//              Nobody comes. (With the card, or the door open, E is the way in instead: the rows win.)
//   smoke_offer  the boss out there with you, smoking or locked out: he holds out his packet 🚬❓. Off the clock.
//   knock_*    the restroom door while someone is in there (restroom.js): you knock, and he answers through the door,
//              cross, with his face (🚽😠: you just knocked on the boss). Free, the door is yours to go in by.
//   mustard    Kev, near you while the mustard is down your sweater, helpfully points at his own chest and at the
//              restroom (👕🟡👉🚽). He doesn't care whose sandwich it was.
//   picture_*  the picture in the hallway by the kitchen door (24,6). You tilt it; Kev, passing on his coffee run,
//              can't stand it and tilts it the other way (😒); Lin, on her way to the fridge, straightens it, cross
//              (😤). Each steps out of their way to stand under it (toy `stand`), fixes it at arm's length, and hurries
//              back to their errand; the frame scrapes on its nail (creak). Three people, one nail.
//              Its tilt is whoever touched it last (pictureTilt: you +1, Kev -1, Lin straight); painters.js draws it.
//   ficus      the boss's plant, after you pour the coffee into it (interactions.js water_ficus): on his next look
//              at it he is delighted, once (🌿😍, his head turned to it).
//   kev_doze   Kev without his coffee (you poured the last cup; npcs.js want: 🥱☕ every few seconds): back at his
//              desk, from 2:48 he nods off, head on the keyboard 💤, and a line of one letter runs across his screen
//              (painters-more.js kevPage), until his 2:58 goodbye. Drawn only: asleep, he sees just as awake.
//   kev_wake   come within 2.5 tiles of a dozing Kev and he jolts awake 😳 (and stays awake). So you can't walk
//              past a sleeping Kev: the sight he keeps never surprises anyone.
//   type_*     any free workstation (Lin's or Kev's while they are away, the three empty ones), unless the full cup
//              is in your hand (then E pours it in: interactions.js drownComputer): stand at the
//              keyboard and mash it, a clatter of keys, and a document of gibberish fills the screen, a line a press
//              (typedScreen in painters-more.js). Nothing else: it is not your desk, so it is not looking busy
//              (your own desk is where sitting and typing counts). The owners answer back:
//   lin_reads, lin_wipes  Lin sits down to it: she reads it 😳⌨️, then hammers delete, cross (😤), and it is gone.
//   kev_reads  Kev sits down to it, reads it, and nods 🤔👍. He leaves it there, under his code.
//   lin_sees, kev_sees  catching you at their keyboard: Lin points 😠⌨️, Kev 🤨⌨️.
import { at as clockAt } from '../../config.js';
import { findNpc, inZone } from '../../game/perception.js';
import { toyState } from '../../sim/mechanics/toy.js';
import { outside } from './balcony.js';

export const PICTURE = { x: 24.5, y: 6 }; // centred on tiles 24-25 of the wall's front face, by the kitchen door
const UNDER_PICTURE = { x: 25, y: 7.4 }; // where Kev and Lin stand to fix it: right under it, at arm's length
const hallSide = (npc) => npc.y > PICTURE.y + 0.6; // in the hallway, not the kitchen behind the wall
const PICTURE_TOYS = [['picture', 1], ['picture_kev', -1], ['picture_lin', 0]];
export function pictureTilt(game) {
  let f = null;
  let v = 0;
  for (const [id, tilt] of PICTURE_TOYS) {
    const at = game.toys?.byId[id]?.landsAt; // when the hand is on it: Kev's and Lin's on arrival (toy stand)
    if (at != null && at <= game.loopTime && (f === null || at >= f)) { f = at; v = tilt; }
  }
  return { tilt: v, since: f === null ? null : game.loopTime - f };
}
const FIX = { sfx: 'creak', pose: { arms: 'reach', face: true, angry: true, for: 1.4 } };
const KNOCK = { sfx: 'bang', pose: { arms: 'bang', face: true, for: 0.6 } };
const inside = (id) => (w, s, game) => game.player._stall === id && game.player.y < 13.5; // (not from the balcony)

const DOZE_FROM = clockAt('2:48');
const DOZE_TO = clockAt('2:58'); // his 🎒👋
const dozing = (game, n) => n.wants === 'coffee' && n.pose === 'sit' && !n.moving && !n.override
  && game.clock.minute >= DOZE_FROM && game.clock.minute < DOZE_TO && !toyState(game, 'kev_wake').woke;

// --- typing on any keyboard ---------------------------------------------------------------------------------------
// The free workstations: the monitor's tile, and whose it is (they sit at the chair one tile south).
export const KEYBOARDS = [
  { id: 'type_lin', x: 4, y: 8, owner: 'lin' },
  { id: 'type_kev', x: 22, y: 8, owner: 'kev' },
  { id: 'type_west', x: 4, y: 11 },
  { id: 'type_mustard', x: 13, y: 11 }, // the mustard chair's, behind yours
  { id: 'type_east', x: 22, y: 11 },
];
const seatedAt = (game, id, k) => {
  const n = findNpc(game, id);
  return !!n && n.active && n.pose === 'sit' && Math.hypot(n.x - (k.x + 0.5), n.y - (k.y + 1.5)) < 0.6;
};
// Free to type on: nobody sitting at it, and not the full cup in your hand (the cup at a computer pours, every one:
// interactions.js drownComputer). The empty mug, or anything else in hand, types as empty hands do.
const freeKeyboard = (k) => (w, s, game) => game.player.held !== 'coffee' && (!k.owner || !seatedAt(game, k.owner, k));
const typed = (game, k) => toyState(game, k.id).keys > 0;
// Not yet read since your last press.
const unread = (game, k, readId) => {
  const r = toyState(game, readId).since;
  return typed(game, k) && (r === null || r > toyState(game, k.id).since);
};
const atIt = (game, k) => Math.hypot(game.player.x - (k.x + 0.5), game.player.y - (k.y + 1.5)) < 1.6;
const caughtTyping = (k) => (w, s, game) => {
  const t = toyState(game, k.id).since;
  return t !== null && t < 1.5 && atIt(game, k) && !game.player.hidden;
};
const [LIN_KB, KEV_KB] = KEYBOARDS;
const TYPE_TOYS = [
  ...KEYBOARDS.map((k) => ({
    id: k.id, at: { x: k.x, y: k.y }, on: 'press', text: 'type on the keyboard', every: 0.5,
    state: { keys: 0 }, when: freeKeyboard(k),
    line: k.owner ? `you mash ${k.owner === 'lin' ? 'Lin' : 'Kev'}'s keyboard: a line of gibberish on the screen`
      : 'you mash the keyboard: a line of gibberish on the screen',
    react: { sfx: 'clatter', pose: { arms: 'type', face: true, for: 0.6 }, add: { keys: 1 } },
    try: k.owner === 'lin' ? ['pretend until 2:59', 'goto lin_desk busy', 'interact']
      : k.owner === 'kev' ? ['pretend until 2:40', 'goto type_kev busy', 'interact'] : [`goto ${k.id} busy`, 'interact'],
  })),
  {
    id: 'lin_reads', at: { x: LIN_KB.x, y: LIN_KB.y }, on: 'pass', npcs: ['lin'], radius: 1.4, every: 2,
    when: (w, s, game, n) => seatedAt(game, 'lin', LIN_KB) && unread(game, LIN_KB, 'lin_reads'),
    line: 'Lin sits down to her screen and reads what you typed 😳⌨️',
    react: { say: { icons: ['😳', '⌨️'], ttl: 1.8 }, pose: { face: true, for: 1.8 } },
    try: ['pretend until 2:59', 'goto lin_desk busy', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot busy', 'pretend until 3:13'],
  },
  {
    id: 'lin_wipes', at: { x: LIN_KB.x, y: LIN_KB.y }, on: 'pass', npcs: ['lin'], radius: 1.4, every: 2,
    when: (w, s, game) => seatedAt(game, 'lin', LIN_KB) && typed(game, LIN_KB) && toyState(game, 'lin_reads').since >= 1.8,
    line: 'Lin hammers delete, cross 😤, and your gibberish is gone',
    react: { say: { icons: ['😤'], ttl: 1.6 }, sfx: 'clatter', pose: { arms: 'type', angry: true, for: 1.6 }, reset: ['type_lin'] },
    try: ['pretend until 2:59', 'goto lin_desk busy', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot busy', 'pretend until 3:14'],
  },
  {
    id: 'kev_reads', at: { x: KEV_KB.x, y: KEV_KB.y }, on: 'pass', npcs: ['kev'], radius: 1.4, every: 2,
    when: (w, s, game) => seatedAt(game, 'kev', KEV_KB) && unread(game, KEV_KB, 'kev_reads'),
    line: 'Kev sits down, reads what you typed on his screen, and nods 🤔👍',
    react: { say: { icons: ['🤔', '👍'], ttl: 2.2 }, pose: { face: true, for: 2 } },
    try: ['pretend until 2:40', 'goto type_kev busy', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot busy', 'pretend until 2:50'],
  },
  {
    id: 'lin_sees', at: { x: LIN_KB.x, y: LIN_KB.y }, on: 'near', npcs: ['lin'], radius: 10, sees: true, every: 6,
    when: caughtTyping(LIN_KB),
    line: 'Lin sees you at her keyboard and points 😠⌨️',
    react: { say: { icons: ['😠', '⌨️'], ttl: 1.8 }, pose: { arms: 'point', angry: true, face: true, for: 1.4 } },
    try: ['pretend until 3:06', 'goto lin_desk busy', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact'],
  },
  {
    id: 'kev_sees', at: { x: KEV_KB.x, y: KEV_KB.y }, on: 'near', npcs: ['kev'], radius: 10, sees: true, every: 6,
    when: caughtTyping(KEV_KB),
    line: 'Kev sees you at his keyboard 🤨⌨️',
    react: { say: { icons: ['🤨', '⌨️'], ttl: 1.8 }, pose: { face: true, for: 1.4 } },
    try: ['pretend until 2:41', 'goto type_kev busy', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact'],
  },
];

// The hallway wall clock (decor.clock, 17,6): you push its minute hand on, ten minutes a press, as on The Last Bus
// (render/things.js drawBigClock, shared: the red wedge is how fast it runs). Drawn only (painters-more.js
// pushedClock): nobody's day reads it. Lin and Kev glance up passing it and check their watches; the boss steps over
// and sets it right. Making someone act on it (Lin leaving early) would be a route, left for a decision.
export const CLOCK = { x: 17, y: 6 };
const UNDER_CLOCK = { x: 17.5, y: 7.4 };
const PUSH_MAX = 60; // minutes fast at most: past 4:55 the joke is the same
const clockAhead = (game) => toyState(game, 'clock').ahead;
const fastClock = (min) => (w, s, game, npc) => npc.y > CLOCK.y + 0.6 && clockAhead(game) >= min;
const CLOCK_TOYS = [
  {
    id: 'clock', at: CLOCK, on: 'press', text: 'push the clock on', every: 0.5, state: { ahead: 0 },
    when: (w, s) => s.ahead < PUSH_MAX,
    line: 'you push the hallway clock ten minutes on',
    react: { sfx: 'clockTick', pose: { arms: 'reach', face: true, for: 0.5 }, add: { ahead: 10 } },
    try: ['goto clock pretend', 'interact'],
  },
  {
    id: 'clock_lin', at: CLOCK, on: 'pass', npcs: ['lin'], radius: 3, sees: true, every: 20, when: fastClock(20),
    line: '<by> glances up at the hallway clock 😱🕔, checks her watch ⌚ and scowls 😒',
    react: { say: { icons: ['😱', '🕔', '⌚', '😒'], ttl: 2.6 }, pose: { arms: 'shrug', face: true, for: 1.6 } },
    try: ['goto clock pretend', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot', 'pretend until 3:02'],
  },
  {
    id: 'clock_kev', at: CLOCK, on: 'pass', npcs: ['kev'], radius: 6, every: 90, when: fastClock(20),
    line: '<by> looks up from his desk at the hallway clock 🤩🕔, checks his watch ⌚ and slumps 😞',
    react: { say: { icons: ['🤩', '🕔', '⌚', '😞'], ttl: 2.6 }, pose: { arms: 'shrug', face: true, for: 1.6 } },
    try: ['goto clock pretend', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 1s'],
  },
  {
    id: 'clock_boss', at: CLOCK, on: 'pass', npcs: ['boss'], radius: 4, sees: true, every: 6, stand: UNDER_CLOCK,
    when: fastClock(10),
    line: '<by> stops, frowns at the hallway clock 🤨 and sets it right',
    react: { sfx: 'clockTick', say: { icons: ['🤨'], ttl: 3 }, pose: { arms: 'reach', face: true, for: 1.4 }, reset: ['clock'] },
    try: ['goto clock pretend', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot', 'pretend until 3:26'],
  },
];

export const TOYS = [
  ...TYPE_TOYS,
  ...CLOCK_TOYS,
  // ---- The balcony (balcony.js)
  {
    id: 'pound', at: { x: 27, y: 13 }, on: 'press', text: 'pound on the door', every: 0.8,
    when: (w, s, game) => outside(game.player),
    line: 'you pound on the fire door 👊🚪: the reader blinks red, and nobody comes',
    react: { sfx: 'bang', say: { icons: ['👊', '🚪'], ttl: 1.2 }, pose: { arms: 'bang', face: true, for: 0.7 } },
    try: ['goto fire_door', 'interact', 'wait 1s', 'interact'],
  },
  {
    id: 'smoke_offer', on: 'near', npcs: ['boss'], radius: 2.2, sees: true, every: 20, at: 'smoke',
    when: (w, s, game, n) => outside(game.player) && inZone(game, 'balcony', n.x, n.y) && !n.moving && !w.snatched
      && (n.override === 'lockedOut' || (!n.override && n.anim === 'smoking')), // his smoke, or stuck out there with you
    line: '<by> holds out his cigarettes to you 🚬❓',
    react: { say: { icons: ['🚬', '❓'], ttl: 1.8 }, pose: { arms: 'holdout', for: 1.8 } },
    try: ['goto fire_door', 'interact', 'pretend until 3:47'],
  },
  {
    id: 'knock_boss', at: { x: 25, y: 13 }, on: 'press', text: 'knock', when: inside('boss'), every: 2,
    line: 'you knock on the restroom door: the boss answers from inside 🚽😠',
    react: { ...KNOCK, say: { icons: ['🚽', '😠', '@boss'], who: 'prop', ttl: 1.8 } },
    try: ['goto restroom_door', 'pretend until 3:19', 'interact'],
  },
  {
    id: 'knock_lin', at: { x: 25, y: 13 }, on: 'press', text: 'knock', when: inside('lin'), every: 2,
    line: 'you knock on the restroom door: Lin answers from inside 🚽😤',
    react: { ...KNOCK, say: { icons: ['🚽', '😤', '@lin'], who: 'prop', ttl: 1.8 } },
    try: ['goto restroom_door', 'pretend until 3:35.5', 'interact'],
  },
  {
    id: 'picture', at: PICTURE, on: 'press', text: 'tilt the picture', every: 1,
    when: (w, s, game) => pictureTilt(game).tilt !== 1,
    line: 'you knock the hallway picture crooked',
    react: { sfx: 'creak', pose: { arms: 'reach', face: true, for: 0.6 } },
    try: ['goto picture', 'interact'],
  },
  {
    id: 'picture_kev', at: PICTURE, on: 'pass', npcs: ['kev'], radius: 3, every: 4, stand: UNDER_PICTURE,
    when: (w, s, game, npc) => hallSide(npc) && pictureTilt(game).tilt === 1,
    line: '<by> stops, steps over to the crooked picture 😒 and tilts it the other way',
    react: { ...FIX, say: { icons: ['😒'], ttl: 3 } }, // up from setting off until the fix is done
    try: ['goto picture', 'interact', 'goto my_desk_spot', 'pretend until 2:46'],
  },
  {
    id: 'picture_lin', at: PICTURE, on: 'pass', npcs: ['lin'], radius: 3, every: 4, stand: UNDER_PICTURE,
    when: (w, s, game, npc) => hallSide(npc) && pictureTilt(game).tilt !== 0,
    line: '<by> stops, steps over to the crooked picture 😤 and straightens it',
    react: { ...FIX, say: { icons: ['😤'], ttl: 3 } },
    try: ['goto picture', 'interact', 'goto my_desk_spot', 'pretend until 3:08'],
  },
  {
    id: 'mustard', on: 'near', npcs: ['kev'], radius: 2.5, sees: true, every: 25, at: 'restroom',
    when: (w, s, game) => !!game.player.smeared && !game.player.hidden,
    line: '<by> points at his own chest, then at the restroom 👕🟡👉🚽 (mustard, down your sweater)',
    react: { say: ['👕', '🟡', '👉', '🚽'], pose: { arms: 'point', for: 1.6 } },
    try: ['goto fridge pretend', 'interact', 'eat', 'goto kev_desk'],
  },
  {
    id: 'ficus', at: { x: 7, y: 5 }, on: 'pass', npcs: ['boss'], radius: 9, sees: true, every: 999,
    state: { admired: false },
    when: (w, s) => w.cup === 'ficus' && !s.admired,
    line: 'the boss looks at his ficus, sprouting a glossy new leaf, and is delighted 🌿😍',
    react: { say: { icons: ['🌿', '😍'], ttl: 2.2 }, sfx: 'relief', pose: { arms: 'cheer', face: true, for: 1.8 }, set: { admired: true } },
    try: ['goto coffee_machine pretend', 'interact', 'goto boss_doorway pretend', 'interact', 'wait 3s'],
  },
  {
    id: 'kev_doze', at: { x: 22, y: 8 }, on: 'pass', npcs: ['kev'], radius: 1.3, every: 3,
    when: (w, s, game, n) => dozing(game, n),
    line: 'Kev nods off at his desk, his face on the keyboard 💤',
    // No 💤 bubble: his 🥱☕ craving (a real line) was up whenever it fired, and a toy's bubble never covers one, so
    // it never showed. The 💤 is drawn instead, rising off his head without a break while the pose lasts
    // (painters-more.js kevPage); fired every 3 s, the pose (3.4 s) never lapses while he sleeps.
    react: { pose: { arms: 'desk', slump: true, for: 3.4 } }, // forearms on the desk, his head down on them
    try: ['goto coffee_machine busy', 'interact', 'goto my_desk_spot busy', 'put my_desk', 'sit busy', 'busy until 2:50'],
  },
  {
    id: 'kev_wake', on: 'near', at: 'kev_desk', npcs: ['kev'], radius: 2.5, every: 999, state: { woke: false },
    when: (w, s, game, n) => dozing(game, n),
    line: 'Kev jolts awake 😳',
    react: { say: { icons: ['😳'], ttl: 1.6 }, sfx: 'swish', pose: { arms: 'type', for: 2 }, set: { woke: true } },
    try: ['goto coffee_machine busy', 'interact', 'goto my_desk_spot busy', 'put my_desk', 'sit busy', 'busy until 2:50',
      'goto kev_desk busy'],
  },
];
