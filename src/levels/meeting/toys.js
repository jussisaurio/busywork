// Level 1's toys (level.toys; the fields are in src/sim/mechanics/toy.js): things you poke that answer back and
// decide nothing.
//   fire_door  push the bar from inside: it won't give, and the card reader blinks red with a buzz. A locked beat,
//              and it shows the card reader long before the boss needs his card at it.
//   ficus      the boss's plant, after you pour the coffee into it (interactions.js water_ficus): on his next look
//              at it he is delighted, once (🌿😍, his head turned to it).
//   kev_doze   Kev without his coffee (you poured the last cup; npcs.js want: 🥱☕ every few seconds): back at his
//              desk, from 2:48 he nods off, head on the keyboard 💤, and a line of one letter runs across his screen
//              (painters-more.js kevPage), until his 2:58 goodbye. Drawn only: asleep, he sees just as awake.
//   kev_wake   come within 2.5 tiles of a dozing Kev and he jolts awake 😳 (and stays awake). So you can't walk
//              past a sleeping Kev: the sight he keeps never surprises anyone.
import { at as clockAt } from '../../config.js';
import { toyState } from '../../sim/mechanics/toy.js';

const DOZE_FROM = clockAt('2:48');
const DOZE_TO = clockAt('2:58'); // his 🎒👋
const dozing = (game, n) => n.wants === 'coffee' && n.pose === 'sit' && !n.moving && !n.override
  && game.clock.minute >= DOZE_FROM && game.clock.minute < DOZE_TO && !toyState(game, 'kev_wake').woke;

export const TOYS = [
  {
    id: 'fire_door', at: { x: 27, y: 13 }, on: 'press', text: 'push the bar',
    line: 'you push the fire door\'s bar: it won\'t give, and the card reader by the handle blinks red with a buzz',
    react: { sfx: 'denied', pose: { arms: 'reach', face: true, for: 0.6 } },
    try: ['goto fire_door', 'interact'],
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
    react: { say: { icons: ['💤'], kind: 'thought', ttl: 2.6 }, pose: { arms: 'desk', slump: true, for: 3.4 } },
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
