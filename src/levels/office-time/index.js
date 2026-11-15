// "Office Time": your bus leaves at 4:30, and nobody leaves before the boss. He leaves at 4:50.
// Everyone lives by the wall clock in their zone (clocks.js), and you can stand on a chair and push a clock
// forward. Push the boss's clock and he lives his afternoon early (Lin watches it through the glass). Push the
// open-plan clock and Lin and Kev go home early; the boss sees two empty desks and follows the herd (Kev's coffee
// run jumps forward too, right past your chair). You cheat time inside a time loop.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { CAST, BEHAVIOURS, START } from './cast.js';
import { clockFor, pushRow } from './clocks.js';
import { DECOR, LOOKS, POSES, CONES, TITLE, END_SCENES, SOUNDS, VOICES } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

// Level 1's floor, rearranged around two clocks. Q the boss's clock (office, north wall), O the open-plan clock
// (hallway wall, over Kev's desk). Plants flank O's wall so it is reached only from the hallway. The entrance L is
// open to you today: the lobby is where the bus is.
const MAP = [
  '##Q###########################', // 0
  '#.......G..........#FTCT.....#', // 1
  '#.......G..........#.........#', // 2
  '#..TTT..G..TTTTTT..#....TTT..#', // 3
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG.........H#H........#', // 5
  '#GGGGGDGG#####D####O##DD######', // 6
  '#............................#', // 7
  '#..TTT......TPT....TTT.......#', // 8
  '#............................#', // 9
  '#............................#', // 10
  '#..TTT......TTT......TTT.....#', // 11
  '#...........................H#', // 12
  '#GGGLGGGGG###############R####', // 13
  '#:::::::::####################', // 14
  '#:::::::::####################', // 15
  '##EE##########################', // 16
];

const LEGEND = {
  Q: { kind: 'wall_clock', solid: true, opaque: true, interactable: 'boss_clock', draw: 'wall' }, // the wallClock prop on it
  O: { kind: 'wall_clock', solid: true, opaque: true, interactable: 'open_clock', draw: 'wall' },
  F: { kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' },
  C: { kind: 'coffee_machine', solid: true, opaque: false },
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  L: { kind: 'entrance', solid: false, opaque: false },
  R: { kind: 'restroom', solid: true, opaque: true },
  E: { kind: 'elevator', solid: true, opaque: true },
};

const SPOTS = {
  player_desk: { x: 13, y: 9, face: 'N' }, // your seat; you start here
  boss_desk: { x: 4, y: 2, face: 'S' }, // his back to his clock
  lin_desk: { x: 4, y: 9, face: 'N' }, // facing the glass, and the boss's clock beyond it
  kev_desk: { x: 19, y: 9, face: 'N' }, // facing the open-plan clock
  boss_clock_chair: { x: 2, y: 1, face: 'N' }, // the chair you stand on to reach Q
  open_clock_chair: { x: 19, y: 7, face: 'N' }, // ... and O
  coffee: { x: 22, y: 2, face: 'N' },
  boss_door: { x: 6, y: 7, face: 'S' },
  door_in: { x: 4, y: 12, face: 'S' },
  smoke: { x: 7, y: 15, face: 'N' }, // lobby; faces the glass
  elevator: { x: 2, y: 15, face: 'S' }, // where people leave (and the boss comes back from lunch)
  restroom: { x: 25, y: 12, face: 'S' },
  bus_stop: { x: 9, y: 14, face: 'S' }, // the far end of the lobby
};

// Half-open tile rectangles (perception.js inZone).
const ZONES = {
  boss_office: { x0: 1, y0: 1, x1: 8, y1: 6 }, // the boss reads Q in here
  open_plan: { x0: 1, y0: 7, x1: 29, y1: 13 }, // Lin and Kev read O in here
  outside: { x0: 0, y0: 14, x1: 30, y1: 17 }, // the lobby: be here at 4:30
};

const INTERACTIONS = {
  push_boss_clock: pushRow('boss'),
  push_open_clock: pushRow('open'),
};

const ROLES = {
  authority: { id: 'boss', offDuty: ['bus'], helpless: [], deafIn: 'outside' },
};

export default {
  id: 'office-time',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START,
    gatherAt: at('4:30', START),
    meetingAt: at('4:30', START), // the bus
  },
  clockFor,
  interactions: INTERACTIONS,
  items: {},
  roles: ROLES,
  lures: [],
  hunts: [],
  doors: [],
  behaviours: BEHAVIOURS,
  meeting: { override: 'bus', room: 'outside', chair: 'bus_stop', presenter: 'player_desk' },
  routes: [
    { id: 'clock', icon: '🕐', achieved: (w) => w.bossGone && !w.herd },
    { id: 'herd', icon: '🐑', achieved: (w) => w.bossGone && w.herd },
  ],
  outcomeOrder: ['clock', 'herd'],
  initialWorld: () => ({
    bossClock: 0, // minutes the boss's clock is fast
    openClock: 0, // ... the open-plan clock
    bossGone: false,
    linGone: false,
    kevGone: false,
    herd: false, // the boss left because everyone else had
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
