// Level 1's toys (level.toys; the fields are in src/sim/mechanics/toy.js): things you poke that answer back and
// decide nothing.
//   fire_door  push the bar from inside: the door opens a crack onto the balcony, the reader blinks red and the
//              held-door alarm buzzes, and you let it swing shut. You don't go out there. It shows the card reader
//              long before the boss needs his card at it, and that the push opens it: with him locked out, the
//              same push lets him in (interactions.js let_boss_in; the interactable wins while it can).
//   knock_*    the restroom door while someone is in there (restroom.js): you knock, and he answers through the door,
//              cross, with his face (🚽😠: you just knocked on the boss). Free, the door is yours to go in by.
//   mustard    Kev, near you while the mustard is down your sweater, helpfully points at his own chest and at the
//              restroom (👕🟡👉🚽). He doesn't care whose sandwich it was.
//   picture_*  the picture in the hallway by the kitchen door (24,6). You tilt it; Kev, passing on his coffee run,
//              can't stand it and tilts it the other way (😒); Lin, on her way to the fridge, straightens it, cross
//              (😤). Each turns to it and fixes it, and the frame scrapes on its nail (creak). Three people, one nail.
//              Its tilt is whoever touched it last (pictureTilt: you +1, Kev -1, Lin straight); painters.js draws it.
//   ficus      the boss's plant, after you pour the coffee into it (interactions.js water_ficus): on his next look
//              at it he is delighted, once (🌿😍, his head turned to it).
//   kev_doze   Kev without his coffee (you poured the last cup; npcs.js want: 🥱☕ every few seconds): back at his
//              desk, from 2:48 he nods off, head on the keyboard 💤, and a line of one letter runs across his screen
//              (painters-more.js kevPage), until his 2:58 goodbye. Drawn only: asleep, he sees just as awake.
//   kev_wake   come within 2.5 tiles of a dozing Kev and he jolts awake 😳 (and stays awake). So you can't walk
//              past a sleeping Kev: the sight he keeps never surprises anyone.
import { at as clockAt } from '../../config.js';
import { toyState } from '../../sim/mechanics/toy.js';

export const PICTURE = { x: 24.5, y: 6 }; // centred on tiles 24-25 of the wall's front face, by the kitchen door
const hallSide = (npc) => npc.y > PICTURE.y + 0.6; // in the hallway, not the kitchen behind the wall
const PICTURE_TOYS = [['picture', 1], ['picture_kev', -1], ['picture_lin', 0]];
export function pictureTilt(game) {
  let f = null;
  let v = 0;
  for (const [id, tilt] of PICTURE_TOYS) {
    const at = game.toys?.byId[id]?.firedAt;
    if (at != null && (f === null || at >= f)) { f = at; v = tilt; }
  }
  return { tilt: v, since: f === null ? null : game.loopTime - f };
}
const FIX = { sfx: 'creak', pose: { arms: 'reach', face: true, for: 1.4 } };
const KNOCK = { sfx: 'bang', pose: { arms: 'bang', face: true, for: 0.6 } };
const inside = (id) => (w, s, game) => game.player._stall === id;

const DOZE_FROM = clockAt('2:48');
const DOZE_TO = clockAt('2:58'); // his 🎒👋
const dozing = (game, n) => n.wants === 'coffee' && n.pose === 'sit' && !n.moving && !n.override
  && game.clock.minute >= DOZE_FROM && game.clock.minute < DOZE_TO && !toyState(game, 'kev_wake').woke;

export const TOYS = [
  {
    id: 'fire_door', at: { x: 27, y: 13 }, on: 'press', text: 'push the bar',
    line: 'you push the fire door\'s bar: it opens a crack, the alarm buzzes and the reader blinks red, and you let it swing shut',
    react: { sfx: 'denied', pose: { arms: 'reach', face: true, for: 0.6 } },
    try: ['goto fire_door', 'interact'],
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
    id: 'picture_kev', at: PICTURE, on: 'pass', npcs: ['kev'], radius: 3, every: 4,
    when: (w, s, game, npc) => hallSide(npc) && pictureTilt(game).tilt === 1,
    line: 'on his way past, <by> reaches up to the crooked picture 😒 and tilts it the other way',
    react: { ...FIX, say: ['😒'] },
    try: ['goto picture', 'interact', 'goto my_desk_spot', 'pretend until 2:46'],
  },
  {
    id: 'picture_lin', at: PICTURE, on: 'pass', npcs: ['lin'], radius: 3, every: 4,
    when: (w, s, game, npc) => hallSide(npc) && pictureTilt(game).tilt !== 0,
    line: 'on her way past, <by> reaches up to the crooked picture 😤 and straightens it',
    react: { ...FIX, say: ['😤'] },
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
    react: { pose: { arms: 'folder', slump: true, for: 3.4 } },
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
