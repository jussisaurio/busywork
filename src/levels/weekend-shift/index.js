// "Weekend Shift": level 1's office, an hour later. At 5:00 the boss reads the Saturday roster: a whiteboard with
// one face in Saturday's slot (yours, at 4:00), and that person works this weekend. Write someone else's name in
// it: the boss's (he reads out his own name) or, write again, Kev's. Both watchers face the board, so you have to
// make them look away: level 1 taught "wait for a glance"; this one teaches "make one". The routes are the two
// ways to make one (sim/mechanics/attention.js), and a third that backfires:
//   - the microwave DINGs 10 s after you start it: every head in earshot snaps east, to the kitchen, for 6 s
//     (long enough to notice it while fast-forwarding at your pretend, let go, and still finish writing).
//     The board is on the west side: be there when it dings.
//   - your desk phone (at the far end of your desk: stand up and step to it) rings the boss's, on a side table in
//     the corner of his office: he answers it standing there, facing the window, his back to the office, for 5
//     minutes. Lin still watches the board, except while she heats her fish at the microwave (4:30-4:37): ring then.
// Nothing is in reach of your seat (DESIGN.md): you start with nothing lit.
//   - the trap: a paper clip jams the copier, and it beeps until Kev fixes it. Every head turns toward it, and
//     the board stands between the copier and both watchers: at the beeping, it's in plain view.
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at, GAME_MIN_PER_SEC } from '../../config.js';
import { burst } from '../../core/fx.js';
import { CAST, BEHAVIOURS } from './cast.js';
import { DECOR, LOOKS, POSES, TITLE, END_SCENES, VOICES, SOUNDS } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

const START = 16 * 60; // 4:00 PM
const DING_S = 10; // s from starting the microwave to the ding (6 game minutes of noodles)
const DING_TURN = 6; // s every head in earshot stays turned to the ding
const WRITE_S = 2.5; // s a write takes: longer than any glance away

// 30 x 17, no camera. North: a supply room, the boss's glass office, the break room. The open office below.
//   X copier   R the Saturday roster (a whiteboard on a stand)
//   M microwave   C coffee machine   S sink   F fridge   P your desk   Q your desk phone   H plant   T desk/table
//   L Lin's desk, where her lunch box sits   B the boss's phone, on a side table   G glass   D door
const MAP = [
  '##############################', // 0
  '#.....#............B#........#', // 1
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
  '#...TPTQ..TTL....TTT.........#', // 13
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
  // the phone at the far end of your desk (props.js draws it), out of reach of your seat: you stand up for it
  Q: { kind: 'desk_phone', solid: true, opaque: false, draw: 'desk', interactable: 'desk_phone' },
  // the end of Lin's desk, where her lunch box sits until 4:30 (props.js draws it)
  L: { kind: 'desk', solid: true, opaque: false },
  // the boss's phone, on a side table in his corner (props.js draws both): he takes calls standing beside it
  B: { kind: 'phone_table', solid: true, opaque: false },
};

const SPOTS = {
  player_desk: { x: 5, y: 14, face: 'N' }, // your seat; you start here
  boss_desk: { x: 13, y: 3, face: 'S' }, // watching the office through the glass
  lin_desk: { x: 11, y: 14, face: 'N' },
  kev_desk: { x: 18, y: 14, face: 'N' }, // too far off to read the board
  copier: { x: 4, y: 8, face: 'N' }, // Kev repairs from here
  copier_boss: { x: 5, y: 7, face: 'W' }, // the boss photocopying, his back to the board
  microwave: { x: 27, y: 9, face: 'E' },
  boss_window: { x: 18, y: 1, face: 'N' }, // beside his phone (B): on a call, his back to the office, the board out of sight
  board_boss: { x: 8, y: 10, face: 'E' }, // beside the board, facing the room: he reads the roster out from here
  board_look: { x: 10, y: 8, face: 'W' }, // past the board's face, seen from board_boss: what he turns to, to read it
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
    on: 'microwave', text: 'microwave your noodles', duration: 1.0, sneaky: false,
    can: (p, w) => w.noodles === 'cold',
    noise: { at: 'microwave', radius: 20, delay: DING_S, turn: DING_TURN, ripple: true, sfx: 'elevatorDing' }, // DING
    done(game) {
      const w = game.world;
      w.noodles = 'cooking';
      w.dingAt = game.clock.minute + DING_S * GAME_MIN_PER_SEC;
      game.events.emit('microwave:started', {});
    },
  },
  jam_copier: {
    on: 'copier', text: 'jam a paper clip in the copier', duration: 1.0, sneaky: true, saw: '📎',
    can: (p, w) => w.copier === 'ok' || w.copier === 'fixed',
    done(game, a) {
      game.world.copier = 'jammed';
      game.world.jamAt = game.clock.minute; // its beacon flashes in time with the beeps (presentation.js)
      burst(game, 'puff', a.x, a.y, 6, { speed: 0.4, lift: 0.6, ttl: 1.0 });
      game.events.emit('copier:jammed', {});
    },
  },
  call_boss: {
    on: 'desk_phone', text: "ring the boss's phone", duration: 1.0, sneaky: false,
    can: (p, w) => w.phone === 'idle',
    done(game) {
      game.world.phone = 'ringing';
      game.events.emit('phone:ringing', {});
    },
  },
  // The board's Saturday slot: the boss's face, then (write again) Kev's, then the boss's again...
  write_boss: {
    on: 'roster', text: "write the boss's name in Saturday's slot on the roster", duration: WRITE_S, sneaky: true,
    saw: '🗓️', // the roster (its week strip, Saturday ringed); longer than any glance away
    can: (p, w) => w.roster !== 'boss' && !w.rosterLocked,
    done: (game) => write(game, 'boss'),
  },
  write_kev: {
    on: 'roster', text: "write Kev's name in Saturday's slot on the roster", duration: WRITE_S, sneaky: true,
    saw: '🗓️',
    can: (p, w) => w.roster === 'boss' && !w.rosterLocked,
    done: (game) => write(game, 'kev'),
  },
};

// A new face in Saturday's slot, and what kept the watchers off you: the boss's phone, the ding (written while every
// head was still turned to it), or neither (null: no route; the copier's beeping is no cover, it turns heads across
// the board).
function write(game, who) {
  const w = game.world;
  const m = game.clock.minute;
  const dinged = w.dingAt !== null && m >= w.dingAt && m <= w.dingAt + (DING_TURN + WRITE_S) * GAME_MIN_PER_SEC;
  w.roster = who;
  w.wrote = w.phone === 'ringing' || w.phone === 'talking' ? 'phone' : dinged ? 'ding' : null;
  w.wroteAt = m; // the face settles into the slot (presentation.js)
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
  // The boss's phone, in the corner of his office, rings until he answers it. He doesn't stare at it, he goes for it
  // (the lure): only the others turn to a ringing phone, and they're out of earshot at their desks. (It sounds from
  // where he stands to answer it: a noise is at a spot, and the phone's table is solid.)
  'phone:ringing': {
    at: 'boss_window', radius: 6, every: 1.5, turn: 1.5, npcs: ['lin', 'kev'],
    while: (w) => w.phone === 'ringing',
    ripple: { color: '#f3e6c8' }, sfx: 'phoneRing',
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
    react: { wait: 1.5, says: [{ say: ['❗'] }], event: 'kev:alerted' }, // the beeping is his to fix: a small ❗
    work: {
      override: 'fixing',
      minutes: 4,
      progress: 'fixProgress',
      pose: 'sit', // down on the floor at it, as if kneeling
      start: { set: { copier: 'fixing' }, event: 'copier:fixing' }, // a spanner in his hand (presentation.js)
      done: { set: { copier: 'fixed' }, event: 'copier:fixed', says: [{ say: ['😊'] }] },
    },
  },
  { // The phone: the boss takes the call standing at it, in the corner by his window, his back to the office.
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
  // verdict: the board decides: someone else's face there is a win if you're in your place (blamed if you aren't),
  // however you got it there (a write with no route still counts; the engine's rule would call it a fail). It records
  // whose face the board showed (the end scenes draw them). Blamed: whoever isn't here gets Saturday. Every head
  // turns to your empty place (outlined on the floor: presentation.js), wonders where you are, and points it out.
  meeting: {
    override: 'meeting',
    room: 'roster_area',
    chair: 'meeting_player',
    presenter: 'meeting_presenter',
    verdict: (game, { present }) => {
      const result = game.world.roster === 'player' ? 'fail' : present ? 'win' : 'blamed';
      return {
        result,
        why: game.world.roster,
        ...(result === 'blamed' ? { stare: { think: ['@player', '❓'], say: ['👉', '@player'] } } : {}),
      };
    },
  },
  // How you got a name onto the board unseen (the end card shows whose: world.roster).
  routes: [
    { id: 'ding', icon: '#microwave', achieved: (w) => w.roster !== 'player' && w.wrote === 'ding' },
    { id: 'phone', icon: '#deskphone', achieved: (w) => w.roster !== 'player' && w.wrote === 'phone' },
  ],
  outcomeOrder: ['ding', 'phone'],
  initialWorld: () => ({
    roster: 'player', // whose face is in Saturday's slot: 'player' | 'boss' | 'kev'
    wrote: null, // what kept the watchers off you at the last write: 'ding' | 'phone' | null (see write())
    wroteAt: null, // game minute of the last write
    rosterLocked: false, // the boss is at the board (from about 4:51): no more writing on it
    copier: 'ok', // 'ok' | 'jammed' (beeping) | 'fixing' (Kev, still beeping) | 'fixed'
    jamAt: null, // game minute of the last jam
    fixProgress: 0,
    phone: 'idle', // the boss's phone (B): 'idle' | 'ringing' | 'talking' (in his hand) | 'done'
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
