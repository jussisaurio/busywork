// The fixture level, "Happy Birthday to Nobody": a tiny second level that exists to prove a level is one folder.
// It is your birthday and nobody was supposed to know. At 3:00 Doreen brings out Gus's cake and the office sings.
// Make sure nobody sings: eat the cake before anyone can light it, or move your birthday on Doreen's calendar to
// Gus's (burn the popcorn first: the smoke alarm is the only thing that gets her out of her chair).
//
// One room, two people (Doreen, the office manager, is the authority; Gus baked the cake and owns it), one lure.
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { say, burst, shake } from '../../core/fx.js';
import { playerHolds } from '../../sim/take.js';
import { CAST, BEHAVIOURS } from './cast.js';
import { DECOR, LOOKS, TITLE, END_SCENES, VOICES } from './presentation.js';
import { cake } from './painters.js';
import harness from './harness.js';
import gate from './gate.js';
import { OWN_DESK, FRIDGE } from '../office/legend.js';

// 30 x 17 so it fills the view like level 1; the room is the top-left 22 x 12, the rest is wall.
//   W Doreen's birthday calendar (on an easel, in front of her desk)   M microwave   F fridge (decor)
//   B the cake, on its stand   P your desk   D the door (Gus goes out for candles)
const MAP = [
  '##############################', // 0
  '#.................MF.#########', // 1
  '#.TTT...............H#########', // 2
  '#....................#########', // 3
  '#..W.................#########', // 4
  '#....................#########', // 5
  '#....................#########', // 6
  '#..........T.........#########', // 7
  '#..........T....B....#########', // 8
  '#....TPT.............#########', // 9
  '#H...................#########', // 10
  '############D#################', // 11
  '##############################', // 12
  '##############################', // 13
  '##############################', // 14
  '##############################', // 15
  '##############################', // 16
];

const LEGEND = {
  W: { kind: 'calendar', solid: true, opaque: false, interactable: 'calendar' },
  M: { kind: 'microwave', solid: true, opaque: true, interactable: 'microwave' },
  F: FRIDGE, // render/world.js TILE_DRAWS
  B: { kind: 'cake_stand', solid: true, opaque: false, interactable: 'cake_stand' },
  P: OWN_DESK,
};

const SPOTS = {
  player_desk: { x: 6, y: 10, face: 'N' }, // your seat; you start here
  doreen_desk: { x: 3, y: 1, face: 'S' }, // behind her desk, watching the room (and her calendar)
  gus_desk: { x: 10, y: 8, face: 'E' }, // watching his cake
  microwave: { x: 18, y: 2, face: 'N' },
  door: { x: 12, y: 10, face: 'S' },
  birthday_chair: { x: 16, y: 7, face: 'S' }, // behind the cake: where the birthday person sits to be sung at
  party_doreen: { x: 14, y: 8, face: 'E' },
  party_gus: { x: 18, y: 8, face: 'W' },
};

const ZONES = {
  party: { x0: 13, y0: 5, x1: 21, y1: 11 }, // around the cake: be here at 3:00
};

const INTERACTIONS = {
  nuke_popcorn: {
    on: 'microwave', text: 'microwave the popcorn for twenty minutes', duration: 1.0, sneaky: true, saw: '🍿',
    hand: 'empty', can: (p, w) => w.popcorn === 'bag',
    done(game, a) {
      game.world.popcorn = 'burning';
      burst(game, 'puff', a.x, a.y, 12, { speed: 0.6, lift: 1.0, ttl: 1.8 });
      shake(game, 0.08, 0.2);
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('popcorn:burning', {});
    },
  },
  fix_calendar: {
    on: 'calendar', text: "move your birthday to Gus's", duration: 2.5, sneaky: true, saw: '📅', // longer than any glance away
    can: (p, w) => w.birthday === 'player',
    done(game) {
      game.world.birthday = 'gus';
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('calendar:changed', {});
    },
  },
  take_cake: {
    on: 'cake_stand', text: 'take the cake', duration: 0.8, sneaky: true, owner: 'gus', saw: '🎂',
    hand: 'empty', can: (p, w) => w.cake === 'stand',
    done(game) {
      playerHolds(game, 'cake');
      game.events.emit('cake:taken', {});
    },
  },
};

const ITEMS = {
  cake: {
    icon: '🎂', // what people say for it; draw: how it looks in a hand, on the floor and in the HUD (painters.js)
    draw: cake,
    place: 'cake',
    edible: { leaves: 'splat' }, // eat_cake: sneaky to Gus, and Doreen reads it as slacking; frosting down your front
    owner: {
      id: 'gus',
      says: [{ say: ['😠', '🎂'] }],
      reclaim(game) { // straight back on its stand
        game.world.cake = 'stand';
        game.events.emit('cake:returned', {});
      },
    },
  },
};

const ROLES = {
  authority: { id: 'doreen', offDuty: ['party'], helpless: [], deafIn: null },
};

const LURES = [
  { // Burnt popcorn sets off the smoke alarm: Doreen fans it with her clipboard until it stops, back to the room.
    npc: 'doreen',
    when: (w) => w.popcorn === 'burning',
    override: 'alerted',
    plan: 'alarm',
    label: 'smoke alarm',
    spot: 'microwave',
    react: { wait: 0.5, says: [{ say: ['🚨', '❗'], kind: 'alert' }], event: 'doreen:alerted' },
    work: {
      override: 'fanning',
      minutes: 4,
      progress: 'fanProgress',
      start: { set: { popcorn: 'smoking' }, event: 'popcorn:fanning' },
      done: { set: { popcorn: 'binned' }, event: 'popcorn:binned', says: [{ say: ['😮‍💨'] }] },
    },
  },
];

export default {
  id: 'fixture',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: 14 * 60 + 30,
    gatherAt: at('2:57'), // everyone gathers round the cake
    meetingAt: at('3:00'), // the song
    clockRedAt: at('2:55'),
    clockTickAt: at('2:55'),
    tockAt: at('2:58'),
    halfMinuteAt: at('2:59'),
  },
  interactions: INTERACTIONS,
  items: ITEMS,
  roles: ROLES,
  lures: LURES,
  hunts: [],
  doors: [],
  behaviours: BEHAVIOURS,
  meeting: { override: 'party', room: 'party', chair: 'birthday_chair', presenter: 'birthday_chair' },
  routes: [
    { id: 'cake', icon: '🎂', achieved: (w) => w.cake === 'eaten' },
    { id: 'calendar', icon: '📅', achieved: (w) => w.birthday === 'gus' },
  ],
  outcomeOrder: ['calendar', 'cake'],
  initialWorld: () => ({
    cake: 'stand', // 'stand' | 'player' | 'dropped' | 'eaten'
    popcorn: 'bag', // 'bag' | 'burning' | 'smoking' (Doreen fanning) | 'binned'
    fanProgress: 0,
    birthday: 'player', // whose birthday Doreen's calendar says it is
    items: [],
  }),
  harness,
  gate,
  title: TITLE,
  decor: DECOR,
  looks: LOOKS,
  endScenes: END_SCENES,
  voices: VOICES,
};
