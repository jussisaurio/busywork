// "Weekend Shift": level 1's office, an hour later. At 5:00 the boss reads the Saturday roster on the whiteboard,
// and the top name (yours) works this weekend. Get someone else named: write the boss's name at the top of the
// board, or put Kev's on the sign-off sheet in Kev's tray. Level 1 taught "wait for a glance"; this one teaches
// "make one". Three toys make noises that turn heads (sim/mechanics/attention.js):
//   - the microwave DINGs a while after you start it: every head in earshot snaps east, to the kitchen, for 4 s.
//     The board is on the west side: be there when it dings. The sheet is on the east side, between the
//     microwave and Lin: swap it at the ding and Lin turns to look straight at you (the teaching fail).
//   - a paper clip jams the copier: it beeps until Kev fixes it (a lure). Every head turns west, and Kev leaves
//     his desk (and his tray). The board is west: at the beeping, it's in plain view.
//   - your desk phone rings the boss's: he answers it at his window, his back to the office. Lin still watches
//     the board, except while she's in the kitchen with her fish (4:08-4:19).
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at, GAME_MIN_PER_SEC } from '../../config.js';
import { say, burst } from '../../core/fx.js';
import { CAST, BEHAVIOURS } from './cast.js';
import { DECOR, LOOKS, POSES, TITLE, END_SCENES, VOICES, SOUNDS } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

const START = 16 * 60; // 4:00 PM
const DING_S = 10; // s from starting the microwave to the ding (6 game minutes of noodles)

// 30 x 17, no camera. North: a supply room, the boss's glass office, the break room. The open office below.
//   X copier   R the Saturday roster (a whiteboard on a stand)   K Kev's in-tray (the sign-off sheet)
//   M microwave   C kitchen counter   F fridge   P your desk   H plant   T desk/table   G glass   D door
const MAP = [
  '##############################', // 0
  '#.....#.............#........#', // 1
  '#.....#.............#........#', // 2
  '#.....#.............#..TTTT..#', // 3
  '#.....#.....TTT.....#........#', // 4
  '#H....#............H#........#', // 5
  '###D###GGGGGGDGGGGGG####D#####', // 6
  '#............................#', // 7
  '#...........................C#', // 8
  '#X.......R..................M#', // 9
  '#...........................C#', // 10
  '#...........................F#', // 11
  '#............................#', // 12
  '#...TPT...TTT....TKT.........#', // 13
  '#H...............H.H........H#', // 14
  '#............................#', // 15
  '##############################', // 16
];

const LEGEND = {
  X: { kind: 'copier', solid: true, opaque: false, interactable: 'copier' },
  R: { kind: 'roster', solid: true, opaque: false, interactable: 'roster' },
  K: { kind: 'desk', solid: true, opaque: false, interactable: 'tray' },
  M: { kind: 'microwave', solid: true, opaque: true, draw: 'desk', interactable: 'microwave' },
  C: { kind: 'counter', solid: true, opaque: false, draw: 'coffee_machine' },
  F: { kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' },
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
};

const SPOTS = {
  player_desk: { x: 5, y: 14, face: 'N' }, // your seat; you start here
  boss_desk: { x: 13, y: 3, face: 'S' }, // watching the office through the glass
  lin_desk: { x: 11, y: 14, face: 'N' },
  kev_desk: { x: 18, y: 14, face: 'N' }, // facing his own tray
  kev_tray: { x: 18, y: 12, face: 'S' }, // in front of Kev's desk: where his tray is reached from
  copier: { x: 2, y: 9, face: 'W' }, // Kev repairs from here
  copier_boss: { x: 1, y: 10, face: 'N' }, // the boss photocopying
  microwave: { x: 27, y: 9, face: 'E' },
  boss_window: { x: 19, y: 1, face: 'N' }, // the boss on the phone, his back to the office, the board out of sight
  board_boss: { x: 9, y: 10, face: 'E' }, // beside the board, facing the room: the boss reads the roster from here
  meeting_lin: { x: 11, y: 10, face: 'W' },
  meeting_kev: { x: 11, y: 8, face: 'W' },
  meeting_player: { x: 12, y: 9, face: 'W' }, // your empty spot, stared at if you're elsewhere at 5:00
  meeting_presenter: { x: 10, y: 9, face: 'W' }, // where a failed meeting puts you: in front of your name
};

const ZONES = {
  roster_area: { x0: 6, y0: 7, x1: 14, y1: 13 }, // around the board: be here at 5:00
};

const INTERACTIONS = {
  start_microwave: {
    on: 'microwave', icon: '🍜', text: 'microwave your noodles', duration: 1.0, sneaky: false,
    can: (p, w) => w.noodles === 'cold',
    noise: { at: 'microwave', radius: 20, delay: DING_S, turn: 4, ripple: true, sfx: 'elevatorDing' }, // DING
    done(game) {
      const w = game.world;
      w.noodles = 'cooking';
      w.dingAt = game.clock.minute + DING_S * GAME_MIN_PER_SEC;
      game.events.emit('microwave:started', {});
    },
  },
  jam_copier: {
    on: 'copier', icon: '📎', text: 'jam a paper clip in the copier', duration: 1.0, sneaky: true, saw: '📎',
    can: (p, w) => w.copier === 'ok' || w.copier === 'fixed',
    done(game, a) {
      game.world.copier = 'jammed';
      burst(game, 'puff', a.x, a.y, 6, { speed: 0.4, lift: 0.6, ttl: 1.0 });
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.2 });
      game.events.emit('copier:jammed', {});
    },
  },
  call_boss: {
    on: 'own_desk', icon: '📞', text: "ring the boss's desk phone", duration: 1.0, sneaky: false,
    can: (p, w) => !!p.seated && w.phone === 'idle',
    done(game) {
      game.world.phone = 'ringing';
      game.events.emit('phone:ringing', {});
    },
  },
  fix_roster: {
    on: 'roster', icon: '✏️', text: "write the boss's name at the top of the Saturday roster", duration: 2.5, sneaky: true,
    saw: '📋', // longer than any glance away
    can: (p, w) => w.roster === 'player' && !w.rosterLocked,
    done(game) {
      game.world.roster = 'boss';
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('roster:changed', {});
    },
  },
  swap_sheet: {
    on: 'tray', icon: '📝', text: "put Kev's name on the Saturday sign-off sheet", duration: 2.5, sneaky: true, saw: '📝',
    can: (p, w) => w.sheet === 'tray' && w.sheetName === 'player',
    done(game) {
      game.world.sheetName = 'kev';
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('sheet:swapped', {});
    },
  },
};

// level.noises: an event sets off a noise at a spot (sim/mechanics/attention.js).
const NOISES = {
  // The jammed copier beeps every 2 s until Kev has fixed it: heads stay turned west the whole time.
  'copier:jammed': {
    at: 'copier', radius: 22, delay: 1, every: 2, turn: 2.4,
    while: (w) => w.copier === 'jammed' || w.copier === 'fixing',
    ripple: { color: '#e0533d' }, sfx: 'machineBeep',
  },
  // The boss's desk phone rings until he answers it. He doesn't stare at it, he goes for it (the lure): only the
  // others turn to a ringing phone, and they're out of earshot at their desks.
  'phone:ringing': {
    at: 'boss_desk', radius: 6, every: 1.5, turn: 1.5, npcs: ['lin', 'kev'],
    while: (w) => w.phone === 'ringing',
    ripple: { color: '#f3e6c8' }, sfx: 'jingle',
  },
};

const ROLES = {
  authority: { id: 'boss', offDuty: ['meeting'], helpless: [] },
};

const LURES = [
  { // The copier's beeping fetches Kev, wherever he is on the floor.
    npc: 'kev',
    when: (w) => w.copier === 'jammed',
    override: 'alerted',
    plan: 'copier',
    label: 'fix copier',
    spot: 'copier',
    react: { wait: 1.5, says: [{ say: ['🖨️', '❗'], kind: 'alert' }], event: 'kev:alerted' },
    work: {
      override: 'fixing',
      minutes: 4,
      progress: 'fixProgress',
      start: { set: { copier: 'fixing' }, event: 'copier:fixing', says: [{ say: ['🔧'] }] },
      done: { set: { copier: 'fixed' }, event: 'copier:fixed', says: [{ say: ['👍'] }] },
    },
  },
  { // The desk phone: the boss takes the call at his window, his back to the office.
    npc: 'boss',
    when: (w) => w.phone === 'ringing',
    override: 'phone',
    plan: 'phone',
    label: 'answer phone',
    spot: 'boss_window',
    react: { wait: 1.0, says: [{ say: ['☎️', '❗'], kind: 'alert' }], event: 'boss:phone' },
    work: {
      override: 'onPhone',
      minutes: 5,
      progress: 'callProgress',
      start: {
        set: { phone: 'talking' },
        event: 'phone:answered',
        says: [{ say: ['📞', '❓'] }, { say: ['📞', '😐'], after: 3 }],
      },
      done: { set: { phone: 'done' }, event: 'phone:hungUp', says: [{ say: ['📞', '🤨'] }] },
    },
  },
];

export default {
  id: 'weekend-shift',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START,
    gatherAt: at('4:55', START), // everyone gathers at the board
    meetingAt: at('5:00', START), // the boss reads out the Saturday name
    clockRedAt: at('4:50', START),
    clockTickAt: at('4:50', START),
    tockAt: at('4:55', START),
    halfMinuteAt: at('4:58', START),
  },
  interactions: INTERACTIONS,
  noises: NOISES,
  roles: ROLES,
  lures: LURES,
  hunts: [],
  doors: [],
  behaviours: BEHAVIOURS,
  meeting: { override: 'meeting', room: 'roster_area', chair: 'meeting_player', presenter: 'meeting_presenter' },
  routes: [
    { id: 'roster', icon: '📋', achieved: (w) => w.roster === 'boss' },
    { id: 'sheet', icon: '📝', achieved: (w) => w.sheetName === 'kev' },
  ],
  outcomeOrder: ['roster', 'sheet'],
  initialWorld: () => ({
    roster: 'player', // whose name is at the top of the board: 'player' | 'boss'
    rosterLocked: false, // the boss is at the board (from about 4:51): no more writing on it
    sheet: 'tray', // the sign-off sheet: 'tray' | 'kev' (he takes it to the board at 4:52)
    sheetName: 'player', // whose name is on it: 'player' | 'kev'
    copier: 'ok', // 'ok' | 'jammed' (beeping) | 'fixing' (Kev, still beeping) | 'fixed'
    fixProgress: 0,
    phone: 'idle', // the boss's desk phone: 'idle' | 'ringing' | 'talking' | 'done'
    callProgress: 0,
    noodles: 'cold', // 'cold' | 'cooking' (dings at dingAt, a game minute)
    dingAt: null,
    items: [],
  }),
  harness,
  gate,
  title: TITLE,
  decor: DECOR,
  looks: LOOKS,
  poses: POSES,
  endScenes: END_SCENES,
  sounds: SOUNDS,
  voices: VOICES,
};
