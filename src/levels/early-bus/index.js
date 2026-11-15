// "Early Bus": the last bus leaves at 4:30, and nobody leaves before the boss. He leaves at 4:50.
// Everyone lives by the wall clock of the zone he stands in (clocks.js), and you can climb the stepladder under a
// clock and push it forward. Push the boss's clock (Lin watches it through the glass) and he lives his afternoon
// early. Push the open-plan clock (Kev sits facing it) far enough and the boss, walking back under it from his coffee,
// sees home time and goes; Lin and Kev, who have been eyeing his coat on the rack, follow him out. Leave your desk
// while he is in and he comes looking for you; seen out in the street, you are caught. A time loop.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { CAST, START } from './cast.js';
import { clockFor, pushRow, huntOver, CLOCK_BEHAVIOURS } from './clocks.js';
import { COFFEE_CUP, pourCoffee } from '../meeting/coffee.js';
import { DECOR, LOOKS, POSES, CONES, TITLE, END_SCENES, SOUNDS, VOICES } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

// Level 1's floor, rearranged around two clocks. Q the boss's clock (office, north wall), O the open-plan clock
// (hallway wall, on the boss's way to and from the kitchen, over Kev's desk), each with a stepladder under it. K the
// boss's coat rack, in the corner of his glass office: his coat on it means he is in. The entrance L is open
// to you today. The lobby's glass front opens onto the pavement (,) and the bus stop (B); the road runs along the
// bottom edge, and everyone goes home over the zebra crossing (=).
const MAP = [
  '####Q#########################', // 0
  '#......KG..........#FTCT.....#', // 1
  '#.......G..........#.........#', // 2
  '#..TTT..G..TTTTTT..#....TTT..#', // 3
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG.........H#H........#', // 5
  '#GGGGGDGG#O###D#######DD######', // 6
  '#............................#', // 7
  '#..TTT...TTTTPT..............#', // 8
  '#............................#', // 9
  '#............................#', // 10
  '#..TTT......TTT......TTT.....#', // 11
  '#...........................H#', // 12
  '#GGGLGGGGG###############R####', // 13
  '#:::::::::G,,#################', // 14
  '#::::::::::,B,,,##############', // 15
  '###############=##############', // 16
];

const LEGEND = {
  Q: { kind: 'wall_clock', solid: true, opaque: true, interactable: 'boss_clock', draw: 'wall' }, // the wallClock prop on it
  O: { kind: 'wall_clock', solid: true, opaque: true, interactable: 'open_clock', draw: 'wall' },
  F: { kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' },
  C: { kind: 'coffee_machine', solid: true, opaque: false, interactable: 'coffee_machine' }, // a full pot: it pours
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  L: { kind: 'entrance', solid: false, opaque: false },
  R: { kind: 'restroom', solid: true, opaque: true },
  K: { kind: 'coat_rack', solid: true, opaque: false }, // the coatRack prop hangs his coat on it (presentation.js)
  ',': { kind: 'pavement', solid: false, opaque: false, draw: 'outside' }, // the street prop paints it
  B: { kind: 'bus_stop_sign', solid: false, opaque: false, draw: 'outside' }, // the street prop: sign, road, bus
  '=': { kind: 'crossing', solid: false, opaque: false, draw: 'outside' }, // the zebra crossing: the way home
};

const SPOTS = {
  player_desk: { x: 13, y: 9, face: 'N' }, // your seat; you start here
  boss_desk: { x: 4, y: 2, face: 'S' }, // his back to his clock: glancing aside, he never sees the stepladder behind him
  lin_desk: { x: 4, y: 9, face: 'N' }, // facing the glass, and the boss's clock beyond it
  kev_desk: { x: 10, y: 9, face: 'N' }, // right under the open-plan clock, facing it
  boss_clock_chair: { x: 4, y: 1, face: 'N' }, // the stepladder under Q, right behind his seat
  open_clock_chair: { x: 10, y: 7, face: 'N' }, // ... and O, on the boss's way back from the kitchen
  coffee: { x: 22, y: 2, face: 'N' },
  coat: { x: 7, y: 2, face: 'N' }, // in front of the coat rack
  boss_door: { x: 6, y: 7, face: 'S' },
  door_in: { x: 4, y: 12, face: 'S' },
  street_end: { x: 15, y: 16, face: 'S' }, // the zebra crossing: where people go home (and the boss comes back from lunch)
  restroom: { x: 25, y: 12, face: 'S' },
  bus_stop: { x: 11, y: 15, face: 'S' }, // on the kerb by the sign, out of the lobby's glass door
};

// Half-open tile rectangles (perception.js inZone).
const ZONES = {
  boss_office: { x0: 1, y0: 1, x1: 8, y1: 6 }, // the boss reads Q in here
  open_plan: { x0: 1, y0: 7, x1: 29, y1: 13 }, // Lin and Kev read O in here
  lobby: { x0: 0, y0: 14, x1: 10, y1: 17 }, // out of the boss's earshot
  street: { x0: 10, y0: 14, x1: 17, y1: 17 }, // the pavement at the bus stop and the crossing: be here at 4:30
};

const INTERACTIONS = {
  push_boss_clock: pushRow('boss'),
  push_open_clock: pushRow('open'),
  pour_coffee: pourCoffee(), // level 1's pot: Kev and the boss pour from it too
};

const ROLES = {
  authority: { id: 'boss', offDuty: ['bus'], helpless: [], deafIn: 'lobby' },
  // The crime is leaving before him: seen out in the street by the boss while he is still at work (or out looking
  // for you), you are caught, phone or no phone.
  scene: { by: 'boss', while: [null, 'hunting'], zone: 'street', door: { x: 11.5, y: 15.5 }, radius: 0, fresh: () => false, icon: '🚌' },
};

// Your chair empty when he glances at it: he goes looking for you (clocks.js deskCheck).
const HUNTS = [
  {
    npc: 'boss', override: 'hunting', plan: 'hunt', label: 'looking for you', route: 'boss_hunt',
    look: { angle: 0.9, time: 0.7 },
    start: { event: 'boss:hunt', says: [{ say: ['@player', '❓'], kind: 'thought', ttl: 1.4 }], wait: 0.8 },
    found: huntOver,
    end: { says: [] },
  },
];

export default {
  id: 'early-bus',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {
    // The boss looking for you: his office, the open plan past your desk, the lobby, the bus stop.
    boss_hunt: [[6, 4], [6, 8], [13, 10], [4, 12], [6, 15], [11, 14]],
  },
  cast: CAST,
  day: {
    start: START,
    gatherAt: at('4:30', START),
    meetingAt: at('4:30', START), // the bus
  },
  clockFor,
  interactions: INTERACTIONS,
  items: { coffee: COFFEE_CUP },
  roles: ROLES,
  lures: [],
  hunts: HUNTS,
  doors: [],
  behaviours: CLOCK_BEHAVIOURS,
  meeting: {
    override: 'bus', room: 'street', chair: 'bus_stop', presenter: 'player_desk',
    // At the stop while the boss is still in: you can't get on (nobody leaves before him). The end card shows you
    // there, looking back at him, instead of inside at the window.
    verdict: (game, { result, present }) => (result === 'fail' && present ? { why: 'stop' } : null),
  },
  routes: [
    { id: 'clock', icon: '🕐', achieved: (w) => w.bossGone && !w.herd }, // he read his own clock
    { id: 'herd', icon: '☕', achieved: (w) => w.bossGone && w.herd }, // he read the open-plan clock on his break
  ],
  outcomeOrder: ['clock', 'herd'],
  initialWorld: () => ({
    bossClock: 0, // minutes the boss's clock is fast
    openClock: 0, // ... the open-plan clock
    bossGone: false,
    linGone: false,
    kevGone: false,
    herd: false, // the boss went home by the open-plan clock (passing under it after his coffee)
    coat: 'hook', // the boss's coat: on the rack ('hook') or on him ('boss')
    fix: false, // he has been told about the clocks: he sets them right
    items: [],
  }),
  harness,
  gate,
  title: TITLE,
  decor: DECOR,
  looks: LOOKS,
  poses: POSES,
  cones: CONES,
  endScenes: END_SCENES,
  sounds: SOUNDS,
  voices: VOICES,
};
