// "Weekend Shift": level 1's office, an hour later. At 5:00 the boss reads the Saturday roster: a whiteboard with
// one face in Saturday's slot (yours, at 4:00), and that person works this weekend. Write someone else's name in
// it: the boss's (he reads out his own name) or, write again, Kev's. Both watchers face the board, so you have to
// make them look away: level 1 taught "wait for a glance"; this one teaches "make one". The routes are the two
// ways to make one (sim/mechanics/attention.js), and a third that backfires:
//   - the microwave DINGs 10 s after you start it: every head in earshot snaps east, to the kitchen, for 6 s
//     (long enough to notice it while fast-forwarding at your pretend, let go, and still finish writing).
//     The board is on the west side: be there when it dings.
//   - your desk phone rings the boss's: he answers it at his window, his back to the office, for 5 minutes. Lin
//     still watches the board, except while she heats her fish at the microwave (4:30-4:37): ring then.
//   - the trap: a paper clip jams the copier, and it beeps until Kev fixes it. Every head turns toward it, and
//     the board stands between the copier and both watchers: at the beeping, it's in plain view.
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
//   X copier   R the Saturday roster (a whiteboard on a stand)
//   M microwave   C coffee machine   S sink   F fridge   P your desk   H plant   T desk/table   G glass   D door
const MAP = [
  '##############################', // 0
  '#.....#.............#........#', // 1
  '#.....#.............#........#', // 2
  '#.....#.............#..TTTT..#', // 3
  '#.....#.....TTT.....#........#', // 4
  '#H....#............H#........#', // 5
  '###D###GGGGGGDGGGGGG####D#####', // 6
  '#...X........................#', // 7
  '#...........................C#', // 8
  '#........R..................M#', // 9
  '#...........................S#', // 10
  '#...........................F#', // 11
  '#............................#', // 12
  '#...TPT...TTT....TTT.........#', // 13
  '#H..........................H#', // 14
  '#............................#', // 15
  '##############################', // 16
];

const LEGEND = {
  X: { kind: 'copier', solid: true, opaque: false, interactable: 'copier' },
  R: { kind: 'roster', solid: true, opaque: false, interactable: 'roster' },
  M: { kind: 'microwave', solid: true, opaque: true, draw: 'desk', interactable: 'microwave' },
  C: { kind: 'counter', solid: true, opaque: false, draw: 'coffee_machine' },
  S: { kind: 'counter', solid: true, opaque: false, draw: 'desk' }, // the counter and sink: props.js draws them
  F: { kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' },
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
};

const SPOTS = {
  player_desk: { x: 5, y: 14, face: 'N' }, // your seat; you start here
  boss_desk: { x: 13, y: 3, face: 'S' }, // watching the office through the glass
  lin_desk: { x: 11, y: 14, face: 'N' },
  kev_desk: { x: 18, y: 14, face: 'N' }, // too far off to read the board
  copier: { x: 4, y: 8, face: 'N' }, // Kev repairs from here
  copier_boss: { x: 5, y: 7, face: 'W' }, // the boss photocopying, his back to the board
  microwave: { x: 27, y: 9, face: 'E' },
  boss_window: { x: 19, y: 1, face: 'N' }, // the boss on the phone, his back to the office, the board out of sight
  board_boss: { x: 9, y: 11, face: 'E' }, // a step back from the board, facing the room: he reads the roster from here (and his bubble doesn't hide it)
  roster_board: { x: 9, y: 10, face: 'N' }, // just south of the board: what the boss turns to when he reads it out
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
    noise: { at: 'microwave', radius: 20, delay: DING_S, turn: 6, ripple: true, sfx: 'elevatorDing' }, // DING
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
      say(game, 'player', ['🎵'], { kind: 'thought', ttl: 1.2 }); // whistling, innocent
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
  // The board's Saturday slot: the boss's face, then (write again) Kev's, then the boss's again...
  write_boss: {
    on: 'roster', icon: '✏️', text: "write the boss's name in Saturday's slot on the roster", duration: 2.5, sneaky: true,
    saw: '🗓️', // the roster (its week strip, Saturday ringed); longer than any glance away
    can: (p, w) => w.roster !== 'boss' && !w.rosterLocked,
    done: (game) => write(game, 'boss'),
  },
  write_kev: {
    on: 'roster', icon: '✏️', text: "write Kev's name in Saturday's slot on the roster", duration: 2.5, sneaky: true,
    saw: '🗓️',
    can: (p, w) => w.roster === 'boss' && !w.rosterLocked,
    done: (game) => write(game, 'kev'),
  },
};

// A new face in Saturday's slot, and what kept the watchers off you: the boss's phone, or (any other way) a noise.
function write(game, who) {
  const w = game.world;
  w.roster = who;
  w.wrote = w.phone === 'ringing' || w.phone === 'talking' ? 'phone' : 'ding';
  say(game, 'player', ['🎵'], { kind: 'thought', ttl: 1.5 }); // whistling, innocent
  game.events.emit('roster:changed', { to: who });
}

// level.noises: an event sets off a noise at a spot (sim/mechanics/attention.js).
const NOISES = {
  // The jammed copier beeps every 2 s until Kev has fixed it: heads stay turned toward it (and the board) the whole time.
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
  { // The copier's beeping fetches Kev, wherever he is on the floor: he fixes the office's machines.
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
      start: { set: { copier: 'fixing' }, event: 'copier:fixing' }, // the spanner is in his hand (presentation.js)
      done: { set: { copier: 'fixed' }, event: 'copier:fixed', says: [{ say: ['😊'] }] },
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
        says: [{ say: ['❓'] }], // nobody on the line
      },
      done: { set: { phone: 'done' }, event: 'phone:hungUp', says: [{ say: ['😠'] }] },
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
  // How you got a name onto the board unseen (the end card shows whose: world.roster).
  routes: [
    { id: 'ding', icon: '🍜', achieved: (w) => w.roster !== 'player' && w.wrote === 'ding' },
    { id: 'phone', icon: '📞', achieved: (w) => w.roster !== 'player' && w.wrote === 'phone' },
  ],
  outcomeOrder: ['ding', 'phone'],
  initialWorld: () => ({
    roster: 'player', // whose face is in Saturday's slot: 'player' | 'boss' | 'kev'
    wrote: null, // what kept the watchers off you at the last write: 'ding' | 'phone' (see write())
    rosterLocked: false, // the boss is at the board (from about 4:51): no more writing on it
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
