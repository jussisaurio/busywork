// "The Interview": Lin's interview for your job is a phone call at 3:30. She must miss it.
//
// A cord switchboard stands in the reception nook above your desk: one jack per phone (Lin's desk, the boss's
// desk, Kev's desk, the kitchen wall phone), each under a card with its owner's face. Plug in and that phone rings:
// its owner comes to answer it if he hears it, else whoever is nearest in earshot, and gets the hold music
// (phones.js). The lesson: you can move people. Lin's phone cord runs to a wall socket by her desk: pull it out and
// her phone can't ring, unless Lin finds her line dead when she checks it, or Kev, who charges his mobile at that
// socket, finds her plug in his way and jams it back in.
//
// The 3:30 call is the meeting frame (phones.js tick): it settles how the call goes. Be at your desk by the end of
// it (meeting.room): an empty chair during the call for your job looks bad.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { CAST, BEHAVIOURS } from './cast.js';
import { START, INTERACTIONS, LURES, NOISES, initialPhones, phoneTick } from './phones.js';
import { DECOR, LOOKS, POSES, TITLE, VOICES, SOUNDS } from './presentation.js';
import { END_SCENES } from './end-scenes.js';
import harness from './harness.js';
import gate from './gate.js';

//   W the kitchen wall phone   B the boss's desk phone   L Lin's desk phone   V Kev's desk phone
//   5 1 2 3 4 the switchboard: the outside line, Lin, the boss, Kev, the kitchen   O the socket of Lin's phone cord
//   P your desk   F fridge   C coffee machine   H plant
const MAP = [
  '####################W#########', // 0
  '#......#51234H#....F.TTC.....#', // 1
  '#......#......#..............#', // 2
  '#.BTT..#......#..TT..........#', // 3
  '#......#......#..............#', // 4
  '#GGGGGD#......##D#########D###', // 5
  '#LTT.........................#', // 6
  'O.........TPT.........TTV....#', // 7
  '#............................#', // 8
  '#............................#', // 9
  '#............................#', // 10
  '#............................#', // 11
  '#H..........................H#', // 12
  '##############################', // 13
  '##############################', // 14
  '##############################', // 15
  '##############################', // 16
];

const jack = (phone) => ({ kind: 'switchboard', solid: true, opaque: false, draw: 'floor', interactable: `ring_${phone}` });
const LEGEND = {
  W: { kind: 'wall_phone', solid: true, opaque: true, draw: 'wall' },
  B: { kind: 'desk', solid: true, opaque: false, draw: 'desk' },
  L: { kind: 'desk', solid: true, opaque: false, draw: 'desk' },
  V: { kind: 'desk', solid: true, opaque: false, draw: 'desk' },
  O: { kind: 'socket', solid: true, opaque: true, draw: 'wall', interactable: 'lin_socket' },
  5: { kind: 'switchboard', solid: true, opaque: false, draw: 'floor' },
  1: jack('lin'),
  2: jack('boss'),
  3: jack('kev'),
  4: jack('kitchen'),
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  F: { kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' },
  C: { kind: 'coffee_machine', solid: true, opaque: false },
};

const SPOTS = {
  player_desk: { x: 11, y: 8, face: 'N' }, // your seat; you start here
  switchboard: { x: 10, y: 2, face: 'N' }, // in front of the switchboard
  boss_desk: { x: 3, y: 2, face: 'S' }, // behind his desk, watching the office through the glass
  boss_rise: { x: 4, y: 2, face: 'S' }, // half up from his chair, at Lin's phone ringing
  boss_window: { x: 2, y: 2, face: 'N' }, // the boss on his own phone, back to the room
  boss_window_view: { x: 2, y: 1 }, // what he stares at meanwhile: the window
  boss_front: { x: 2, y: 4, face: 'N' }, // anyone else at the boss's phone
  lin_desk: { x: 2, y: 7, face: 'N' },
  lin_notes: { x: 2, y: 7, face: 'E' }, // Lin back from her tea, rehearsing from her notes, her back to the socket
  lin_side: { x: 1, y: 7, face: 'N' }, // anyone else at Lin's phone
  socket_lin: { x: 1, y: 7, face: 'W' }, // Kev at the socket
  kev_desk: { x: 23, y: 8, face: 'N' },
  kev_side: { x: 25, y: 7, face: 'W' }, // anyone else at Kev's phone
  kitchen_phone: { x: 20, y: 1, face: 'N' },
  kitchen_door: { x: 16, y: 5 }, // the kitchen doorway (the boss looks that way for Lin)
  kitchen_lin: { x: 18, y: 4, face: 'N' }, // her tea, at the kitchen table
  kitchen_kev: { x: 23, y: 2, face: 'N' }, // the coffee machine
  clock_view: { x: 7, y: 6, face: 'N' }, // under the wall clock (Lin glances at it)
};

const ZONES = {
  my_desk: { x0: 9, y0: 8, x1: 14, y1: 11 }, // be here at the end of the call
};

const ROLES = {
  authority: { id: 'boss', offDuty: [], helpless: [], deafIn: null },
};

export default {
  id: 'interview',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START,
    gatherAt: at('3:30', START), // the interview calls
    meetingAt: at('3:34', START), // the call is over, one way or another
    deadlineAt: at('3:30', START), // the time on the card's clock face: the call
    clockRedAt: at('3:25', START),
    clockTickAt: at('3:25', START),
    tockAt: at('3:28', START),
    halfMinuteAt: at('3:29', START),
  },
  clockFor(game, npc, sim) {
    if (npc === game.npcs[0]) phoneTick(game, sim);
    return game.clock.minute;
  },
  interactions: INTERACTIONS,
  items: {},
  roles: ROLES,
  lures: LURES,
  noises: NOISES,
  hunts: [],
  doors: [],
  behaviours: BEHAVIOURS,
  meeting: { override: 'interview', room: 'my_desk', chair: 'player_desk', presenter: 'player_desk' },
  routes: [
    { id: 'answered', icon: '🤷', achieved: (w) => w.interview === 'other' || (w.interview === 'ringing' && !!w.jobBy && w.jobBy !== 'lin') },
    { id: 'busy', icon: '🎵', achieved: (w) => w.interview === 'busy' },
    { id: 'unplugged', icon: '🔌', achieved: (w) => w.interview === 'dead' },
    { id: 'ringout', icon: '🔔', achieved: (w) => w.interview === 'rangOut' },
  ],
  outcomeOrder: ['unplugged', 'busy', 'answered', 'ringout'],
  initialWorld: () => ({
    ...initialPhones(),
    stared: false,
    hold_boss: 0, hold_lin: 0, hold_kev: 0, // time on hold, 0..1 (the lures' progress)
    job_boss: 0, job_lin: 0, job_kev: 0, fix_lin: 0, rise_boss: 0,
    items: [],
  }),
  harness,
  gate,
  title: TITLE,
  decor: DECOR,
  looks: LOOKS,
  poses: POSES,
  endScenes: END_SCENES,
  voices: VOICES,
  sounds: SOUNDS,
};
