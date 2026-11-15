// "Saturday" (id weekend-shift): level 1's office, an hour later. At 5:00 the boss reads the Saturday board: a
// whiteboard with one face in Saturday's slot (yours, at 4:00), and that person works this weekend. He filled it in
// on Monday and doesn't remember whom he put down: write Kev's name in it, and he reads out Kev's. (Write again and it's
// his own, which he knows is wrong: he puts yours back.) Both watchers face the board, so
// you have to make them look away: level 1 taught "wait for a glance"; this one teaches "make one". The routes are
// the two ways to make one (sim/mechanics/attention.js), and a third that backfires:
//   - the microwave DINGs 6 s after you start it, about the walk back past the board to your desk, and your noodles
//     boil over: steam pours out of it for 6 s, and every head in earshot snaps east, to the kitchen, and stays
//     there watching it (nobody gets up). The board is on the west side, on your way back: you're walking past it
//     when it dings, not hanging about at it.
//   - the phone in the supply room (behind a wall, out of the boss's sight; his desk has none) rings his, on a
//     side table in the corner of his office. He walks over and answers it standing there, facing the window, his
//     back to the office: "Hello? ... Hello?" into a silent line, a few seconds, then he slams it down. The ring and
//     the walk and the hellos are your window. Lin still watches the board, except while she heats her fish at the
//     microwave (4:30-4:37), her back to the board: ring then.
// Nothing is in reach of your seat (DESIGN.md): you start with nothing lit.
//   - the trap: a paper clip jams the copier, and it beeps until Kev fixes it. Every head turns toward it, and
//     the copier sits on the line from the boss's desk through the board: his look at it crosses the board.
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at, GAME_MIN_PER_SEC } from '../../config.js';
import { burst } from '../../core/fx.js';
import { speak, npcSayLater } from '../../sim/override.js';
import { CAST, BEHAVIOURS, REDRAW_AT, REDRAW_S } from './cast.js';
import { DECOR, LOOKS, POSES, TITLE, END_SCENES, VOICES, SOUNDS } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

const START = 16 * 60; // 4:00 PM
const DING_S = 6; // s from starting the microwave to the ding (3.6 game minutes of noodles): about the walk back past the board
const DING_TURN = 6; // s every head in earshot stays turned to the ding: as long as the noodles boil over (props.js BOIL_S)
const WRITE_S = 2.5; // s a write takes: longer than any glance away
const CALL_MIN = 3; // game minutes (5 s) the boss says hello into the dead line before he slams it down

// 30 x 17, no camera. North: a supply room, the boss's glass office, the break room. The open office below.
//   X copier (on the line from the boss's desk through the board)   R the Saturday board (a whiteboard on a stand)
//   M microwave   C counter (the noodle cup)   S bare counter   P your desk   H plant   T desk/table
//   Q the supply room's phone, behind the wall where the boss can't see it   L Lin's desk, where her lunch box sits
//   B the boss's phone, on a side table (his desk has none)   G glass   D door
const MAP = [
  '##############################', // 0
  '#.....#............B#........#', // 1
  '#.....#.............#........#', // 2
  '#.....#.............#..TTTT..#', // 3
  '#.....#.....TTT.....#........#', // 4
  '#H...Q#............H#........#', // 5
  '###D###GGGGGGDGGGGGG####D#####', // 6
  '#............................#', // 7
  '#...........................C#', // 8
  '#........R..................M#', // 9
  '#...........................S#', // 10
  '#...........................S#', // 11
  '#......X.....................#', // 12
  '#...TPT...TTL....TTT.........#', // 13
  '#H..........................H#', // 14
  '#............................#', // 15
  '##############################', // 16
];

const LEGEND = {
  X: { kind: 'copier', solid: true, opaque: false, interactable: 'copier' },
  R: { kind: 'roster', solid: true, opaque: false, interactable: 'roster' },
  M: { kind: 'microwave', solid: true, opaque: true, draw: 'desk', interactable: 'microwave' },
  C: { kind: 'counter', solid: true, opaque: false, draw: 'desk' }, // bare counter (props.js): no second appliance by the microwave
  // the counter on down the wall, bare (props.js draws it): the microwave is the kitchen's one thing to use
  S: { kind: 'counter', solid: true, opaque: false, draw: 'desk' },
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  // the supply room's phone, on a little table (props.js draws both), out of the boss's sight behind the wall
  Q: { kind: 'desk_phone', solid: true, opaque: false, interactable: 'desk_phone' },
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
  copier: { x: 8, y: 12, face: 'W' }, // Kev kneels here to fix it, his back to the board; it beeps from here
  copier_boss: { x: 7, y: 11, face: 'S' }, // the boss photocopying, his back to the board
  microwave: { x: 27, y: 9, face: 'E' },
  lin_wait: { x: 25, y: 9, face: 'E' }, // Lin waits for her fish a step back from the microwave, facing it
  boss_window: { x: 18, y: 1, face: 'N' }, // beside his phone (B): on a call, his back to the office, the board out of sight
  board_boss: { x: 11, y: 9, face: 'E' }, // from the 4:55 gather: his back to the board, facing the room; he turns to read it
  board_check: { x: 10, y: 9, face: 'W' }, // told on, he comes and looks at it, close up
  board_look: { x: 8, y: 9, face: 'W' }, // past the board, seen from board_boss: what he turns to, to read it
  meeting_lin: { x: 13, y: 10, face: 'W' },
  meeting_kev: { x: 13, y: 8, face: 'W' },
  meeting_player: { x: 14, y: 9, face: 'W' }, // your chair; glanced at if you're elsewhere, stared at at 5:00
  meeting_presenter: { x: 9, y: 10, face: 'N' }, // where a failed meeting puts you: in front of your name
};

const ZONES = {
  roster_area: { x0: 6, y0: 7, x1: 15, y1: 13 }, // around the board: be here at 5:00
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
      // at the DING the noodles boil over, steam pouring out of the microwave (props.js), and every head turns to
      // it at once (the ripple is the noise's) and stays there watching it, as people do
      for (const n of game.npcs) npcSayLater(n, DING_S, ['😮', '🍜'], 'thought', 2.4);
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
      // at the first beep both watchers think of the copier (the boss's look at it: a dashed line through the board,
      // props.js paintCopier)
      for (const n of game.npcs) if (n.id === 'boss' || n.id === 'lin') npcSayLater(n, 1.0, ['🖨️'], 'thought', 2);
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
  // The board's Saturday slot: Kev's face, then (write again) the boss's, then Kev's again...
  write_kev: {
    on: 'roster', text: "write Kev's name in Saturday's slot on the board", duration: WRITE_S, sneaky: true,
    saw: '🗓️', // the board (its week strip, Saturday ringed); longer than any glance away
    can: (p, w) => w.roster !== 'kev' && !w.rosterLocked,
    done: (game) => write(game, 'kev'),
  },
  write_boss: {
    on: 'roster', text: "write the boss's name in Saturday's slot on the board", duration: WRITE_S, sneaky: true,
    saw: '🗓️',
    can: (p, w) => w.roster === 'kev' && !w.rosterLocked,
    done: (game) => write(game, 'boss'),
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

// 5:00, the end beat (2 s): who the board says it is. The boss filled it in on Monday and doesn't remember whom he
// put down: he reads out whatever face is in the slot (cast.js readRoster). Now: Kev's (he points at Kev; Kev
// protests and points at you, he waves it off at the board: the board says Kev), his own (he never put himself down: he wipes it,
// draws yours, since Lin and Kev point at you as the reading ends, and glares at you: a fail), yours with you here (fail: he waves you up front), or anyone's with
// your chair empty (blamed: he redraws the slot with your face, then points at your chair; scenario.js has the room
// stare at it).
function punchline(game, result) {
  const get = (id) => game.npcs.find((n) => n.id === id && n.active);
  const boss = get('boss');
  if (!boss) return;
  const own = game.world.roster === 'boss';
  if (result === 'blamed' || (result === 'fail' && own)) {
    const at = result === 'blamed' ? game.level.meeting.chair : game.level.meeting.presenter;
    npcSayLater(boss, REDRAW_AT, ['✏️'], 'speech', REDRAW_S, 'board_look');
    npcSayLater(boss, REDRAW_AT + REDRAW_S, result === 'blamed' ? ['👉', '@player'] : ['😠', '👉', '@player'], 'speech',
      2 - REDRAW_AT - REDRAW_S, at);
  } else if (result === 'fail') {
    speak(game, boss, [{ say: ['👈'], ttl: 2, face: game.level.meeting.presenter }]);
  } else {
    speak(game, boss, [
      { say: ['👉', '@kev'], ttl: KEV_PROTEST_S + 0.5, face: 'meeting_kev' },
      { say: ['👈', '🗓️'], ttl: 2 - KEV_PROTEST_S - 0.5, after: KEV_PROTEST_S + 0.5, face: 'board_look' }, // the board says Kev
    ]);
    const kev = get('kev');
    if (kev) {
      speak(game, kev, [
        // it wasn't me, it was them all week! The boss doesn't remember, and he doesn't take Kev's word over his own
        // board: of course the one on it says it's someone else (on his own face the board is plainly wrong, and he
        // listens: cast.js readRoster)
        { say: ['🙅', '👉', '@player'], ttl: 1.0, after: KEV_PROTEST_S, face: game.level.meeting.chair },
        { say: ['😩'], ttl: 2 - KEV_PROTEST_S - 1.0, after: KEV_PROTEST_S + 1.0, face: 'board_look' },
      ]);
    }
  }
}
const KEV_PROTEST_S = 0.4; // s into the beat Kev protests

// After a tell (Lin or Kev saw you at the board, pointed at you, and the boss heard), the boss walks over to the board,
// looks at it and puts your face in Saturday's slot: he doesn't remember whose it was, but you were messing with it,
// so it's your Saturday now (the lure 'check', below). The engine has
// already sent you to your desk. Subscribed once per game.events, from the boss's clock (clockFor).
const watched = new WeakSet();
function tick(game) {
  // The board is shut only while the boss sits right by it, holding its only marker (the tray shows it empty). If he
  // gets up (his phone), he puts the marker back and the board is open again.
  const b = game.npcs.find((n) => n.id === 'boss');
  const spot = SPOTS.board_boss;
  game.world.rosterLocked = !!b && b.active !== false && !b.moving && b.override !== 'onPhone'
    && Math.abs(b.x - spot.x) < 0.6 && Math.abs(b.y - spot.y) < 0.6;
  if (watched.has(game.events)) return;
  watched.add(game.events);
  game.events.on('boss:workAssigned', (p) => {
    if (p?.reason === 'tattle') game.world.told = true;
  });
  game.events.on('board:checked', () => {
    const w = game.world;
    w.told = false;
    const boss = game.npcs.find((n) => n.id === 'boss' && n.active);
    if (boss) speak(game, boss, [{ say: ['😠', '👉', '@player'], ttl: 1.8 }]); // she said it was you: then it's your Saturday
    if (w.roster === 'player') return;
    w.roster = 'player';
    w.wrote = null;
    w.wroteAt = game.clock.minute;
    game.events.emit('roster:changed', { to: 'player' });
  });
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
    react: { wait: 1.5, says: [{ say: ['❗'], face: 'copier' }], event: 'kev:alerted' }, // the beeping is his to fix: ❗ at it
    work: {
      override: 'fixing',
      minutes: 4,
      progress: 'fixProgress',
      pose: 'sit', // down on the floor at it, as if kneeling
      start: { set: { copier: 'fixing' }, event: 'copier:fixing', says: [{ say: ['🔧'] }] }, // a spanner in his hand (presentation.js)
      done: { set: { copier: 'fixed' }, event: 'copier:fixed', says: [{ say: ['😊'] }] },
    },
  },
  { // Told on: he walks over to the board and looks at it (tick(), above, puts your face back if it's gone).
    npc: 'boss',
    when: (w) => w.told,
    override: 'checking',
    plan: 'check',
    label: 'check board',
    spot: 'board_check',
    react: { wait: 0.6, says: [{ say: ['🗓️', '❗'], kind: 'alert' }], event: 'boss:checking' },
    work: {
      override: 'checkingBoard',
      minutes: 1,
      progress: 'checkProgress',
      start: { says: [{ say: ['🧐'], kind: 'thought', ttl: 1.4 }] },
      done: { event: 'board:checked' },
    },
  },
  { // The phone: the boss takes the call standing at it, in the corner by his window, his back to the office. Anyone
    // answers his own ringing phone; nobody's there, so "Hello? ... Hello?" for a few seconds, and he slams it down.
    npc: 'boss',
    when: (w) => w.phone === 'ringing',
    override: 'phone',
    plan: 'phone',
    label: 'answer phone',
    spot: 'boss_window',
    react: { wait: 1.0, says: [{ say: ['☎️', '❗'], kind: 'alert' }], event: 'boss:phone' },
    work: {
      override: 'onPhone',
      minutes: CALL_MIN,
      progress: 'callProgress',
      start: {
        set: { phone: 'talking' },
        event: 'phone:answered',
        says: [{ say: ['❓'], ttl: 1.6 }, { say: ['❓', '❓'], ttl: 1.8, after: 2.2 }], // hello? ... hello??
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
  clockFor(game, npc) {
    if (npc === game.npcs[0]) tick(game);
    return game.clock.minute;
  },
  // verdict: the board decides: Kev's face there is a win if you're in your place (blamed if you aren't), however you
  // got it there (a write with no route still counts; the engine's rule would call it a fail). The boss's own face is
  // no use: he knows he didn't put himself down, so he puts yours back (a fail; blamed if you aren't there either). It records
  // whose face the board showed (the end scenes draw them), and plays the reading's punchline (punchline()).
  // Blamed: every head turns to your empty place (outlined on the floor: presentation.js) and wonders where you are;
  // the boss wipes Saturday's slot and draws your face in it, and points it out: the board still decides.
  meeting: {
    override: 'meeting',
    room: 'roster_area',
    chair: 'meeting_player',
    presenter: 'meeting_presenter',
    verdict: (game, { present }) => {
      const r = game.world.roster;
      const result = r === 'kev' ? (present ? 'win' : 'blamed') : r === 'boss' && !present ? 'blamed' : 'fail';
      punchline(game, result);
      return {
        result,
        why: game.world.roster,
        ...(result === 'blamed' ? { stare: { think: ['@player', '❓'], say: ['👉', '@player'] } } : {}), // (the boss's own lines run first)
      };
    },
  },
  // How you got a name onto the board unseen (the end card shows whose: world.roster).
  routes: [
    { id: 'ding', icon: '#microwave', achieved: (w) => w.roster === 'kev' && w.wrote === 'ding' },
    { id: 'phone', icon: '#deskphone', achieved: (w) => w.roster === 'kev' && w.wrote === 'phone' },
  ],
  outcomeOrder: ['ding', 'phone'],
  initialWorld: () => ({
    roster: 'player', // whose face is in Saturday's slot: 'player' | 'boss' | 'kev'
    wrote: null, // what kept the watchers off you at the last write: 'ding' | 'phone' | null (see write())
    wroteAt: null, // game minute of the last write
    rosterLocked: false, // the boss sits by the board holding its marker (tick): no writing on it while he does
    copier: 'ok', // 'ok' | 'jammed' (beeping) | 'fixing' (Kev, still beeping) | 'fixed'
    jamAt: null, // game minute of the last jam
    fixProgress: 0,
    phone: 'idle', // the boss's phone (B): 'idle' | 'ringing' | 'talking' (in his hand) | 'done'
    callProgress: 0,
    noodles: 'cold', // 'cold' | 'cooking' (dings at dingAt, a game minute)
    dingAt: null,
    told: false, // someone told the boss they saw you at the board: he goes and checks it (LURES 'check')
    checkProgress: 0,
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
