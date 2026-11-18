// "Saturday" (id weekend-shift): level 1's office, an hour later. At 5:00 the boss reads the Saturday board: a
// whiteboard with one face in Saturday's slot (yours, at 4:00), and that person works this weekend. He filled it in
// on Monday and doesn't remember whom he put down: write Kev's name in it, and he reads out Kev's. (Write again and it's
// his own: he's announced it to the room before he looks, so he's stuck with it.) Both watchers face the board, so
// you have to make them look away: level 1 taught "wait for a glance"; this one teaches "make one". The routes are
// the two ways to make one (sim/mechanics/attention.js), and a third that backfires:
//   - the microwave DINGs 6 s after you start it, about the walk back past the board to your desk, and your noodles
//     boil over: steam pours out of it for 6 s, and every head in earshot snaps east, to the kitchen, and stays
//     there watching it (nobody gets up). The board is on the west side, on your way back: you're walking past it
//     when it dings, not hanging about at it.
//   - the phone in the supply room (behind a wall, out of the boss's sight; his desk has none) rings his, on a
//     side table in the corner of his office. He walks over and answers it standing there, facing the window, his
//     back to the office: "Hello? ... Hello?" into a silent line, a few seconds, then he hangs up (🙄). The ring and
//     the walk and the hellos are your window. Lin still watches the board, except while she heats her fish at the
//     microwave (4:30-4:37), her back to the board: ring then.
// Nothing is in reach of your seat (DESIGN.md): you start with nothing lit.
//   - the trap: a paper clip jams the copier, and it beeps until Kev fixes it. Every head turns toward it, and
//     the copier sits on the line from the boss's desk through the board: his look at it crosses the board.
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at, GAME_MIN_PER_SEC, EAT_TIME, PICK_UP_TIME } from '../../config.js';
import { burst, say } from '../../core/fx.js';
import { speak, npcSayLater } from '../../sim/override.js';
import { CAST, BEHAVIOURS, REDRAW_AT, REDRAW_S, onPhone } from './cast.js';
import { DECOR, LOOKS, POSES, TITLE, END_SCENES, SOUNDS } from './presentation.js';
import { OFFICE_VOICES } from '../office/voices.js';
import { THINGS as PROP_THINGS } from './props.js';
import harness from './harness.js';
import gate from './gate.js';
import { OWN_DESK } from '../office/legend.js';
import { oncePerGame } from '../../core/events.js';

const START = 16 * 60; // 4:00 PM
const DING_S = 6; // s from starting the microwave to the ding (3.6 game minutes of noodles): about the walk back past the board
const DING_TURN = 6; // s every head in earshot stays turned to the ding: as long as the noodles boil over (props.js BOIL_S)
const WRITE_S = 3; // s a write takes (wipe, then draw): longer than any glance away, and too long for two in one window
const CALL_MIN = 3; // game minutes (5 s) the boss says hello into the dead line before he hangs up
// Ring him again and he's onto it: each call buys less. The 2nd: he's up at once (😤), one sharp hello, and slams it
// down (😠). The 3rd: up at once, he snatches it up and lays the handset down beside the base, off the hook (📞❌):
// after that every ring you make gets the engaged tone (your 📞🚫), and his phone lies off the hook all day.
const SLURP_S = 3.5; // s the hot noodles take to slurp down (the dry block: the engine's EAT_TIME)
const CALL2_MIN = 1.2; // game minutes (2 s)
const CALL3_MIN = 0.5; // game minutes (under 1 s)

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
  // the counter above the microwave, where your noodle cup stands (props.js draws it): pick it up, put it back
  C: { kind: 'counter', solid: true, opaque: false, draw: 'desk', interactable: 'noodles' },
  // the counter on down the wall, bare (props.js draws it): the microwave is the kitchen's one thing to use
  S: { kind: 'counter', solid: true, opaque: false, draw: 'desk' },
  P: OWN_DESK,
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
    can: (p, w) => w.noodles === 'cold' || p.held === 'noodles', // off the counter, or out of your hand
    noise: { at: 'microwave', radius: 20, delay: DING_S, turn: DING_TURN, ripple: true, sfx: 'elevatorDing' }, // DING
    done(game) {
      const w = game.world;
      if (game.player.held === 'noodles') game.player.held = null;
      w.noodles = 'cooking';
      w.dingAt = game.clock.minute + DING_S * GAME_MIN_PER_SEC;
      // at the DING the noodles boil over, steam pouring out of the microwave (props.js), and every head turns to
      // it at once (the ripple is the noise's) and stays there watching it, as people do
      for (const n of game.npcs) npcSayLater(n, DING_S, ['😮', '🍜'], 'thought', 2.4);
      game.events.emit('microwave:started', {});
    },
  },
  // Your noodle cup (C): it's your snack, so you can pick it up and eat it (hold E). Dry, before the microwave: a
  // crunch, a wince, and no cup left to heat (no ding this loop). Hot, after the ding: a long happy slurp. Neither is
  // a noise (nobody turns: the ding is the level's one distraction); both are eating, not working, so the boss's
  // usual slacking rule applies if he sees you. Put it back on the counter and it's as it was.
  take_noodles: {
    on: 'noodles', text: 'pick up your noodles', duration: PICK_UP_TIME, sneaky: false,
    hand: 'empty', can: (p, w) => (w.noodles === 'cold' || w.noodles === 'ready'),
    done(game) {
      const w = game.world;
      game.player.held = w.noodles === 'cold' ? 'noodles' : 'hot_noodles';
      w.noodles = w.noodles === 'cold' ? 'held' : 'heldHot';
      game.events.emit('item:pickup', { type: game.player.held });
    },
  },
  put_noodles: {
    on: 'noodles', text: 'put your noodles back on the counter', duration: PICK_UP_TIME, sneaky: false,
    hand: ['noodles', 'hot_noodles'],
    done(game) {
      const w = game.world;
      w.noodles = game.player.held === 'noodles' ? 'cold' : 'ready';
      game.player.held = null;
      game.events.emit('item:drop', { type: 'noodles' });
    },
  },
  eat_noodles: { // raw: you crunch the dry block out of the cup (😬). The cup's gone: nothing to heat
    on: 'self', text: 'eat your noodles dry', duration: EAT_TIME, hold: true, preview: 'lift', idle: true, saw: '🍜',
    hand: 'noodles',
    done(game) {
      const p = game.player;
      p.held = null;
      game.world.noodles = 'crunched';
      burst(game, 'crumbs', p.x, p.y, 14, { speed: 1.1, ttl: 0.7 });
      say(game, 'player', ['😬'], { kind: 'thought', ttl: 1.6 });
      game.events.emit('noodles:crunched', {});
    },
  },
  eat_hot_noodles: { // cooked: a long, happy slurp (😋🍜), content
    on: 'self', text: 'eat your noodles', duration: SLURP_S, hold: true, preview: 'lift', idle: true, saw: '🍜',
    hand: 'hot_noodles',
    done(game) {
      const p = game.player;
      p.held = null;
      game.world.noodles = 'slurped';
      say(game, 'player', ['😋', '🍜'], { kind: 'thought', ttl: 2 });
      game.events.emit('noodles:slurped', {});
    },
  },
  jam_copier: {
    on: 'copier', text: 'jam a paper clip in the copier', duration: 1.0, sneaky: true, saw: '📎',
    can: (p, w) => w.copier === 'ok' || w.copier === 'fixed',
    done(game, a) {
      game.world.copier = 'jammed';
      game.world.jamAt = game.clock.minute; // its beacon flashes in time with the beeps (presentation.js)
      game.world.jamFrom = { x: game.player.x, y: game.player.y }; // you whistle once you've walked off (tick)
      burst(game, 'puff', a.x, a.y, 6, { speed: 0.4, lift: 0.6, ttl: 1.0 });
      // at the first beep both watchers think of the copier (the boss's look at it: a dashed line through the board,
      // props.js paintCopier)
      for (const n of game.npcs) if (n.id === 'boss' || n.id === 'lin') npcSayLater(n, 1.0, ['🖨️'], 'thought', 2);
      game.events.emit('copier:jammed', {});
    },
  },
  call_boss: {
    on: 'desk_phone', text: "ring the boss's phone", duration: 1.0, sneaky: false,
    can: (p, w) => w.phone === 'idle' || w.phone === 'offhook',
    done(game) {
      const w = game.world;
      if (w.phone === 'offhook') { // engaged: he took it off the hook
        say(game, 'player', ['📞', '🚫'], { ttl: 1.6 });
        game.events.emit('phone:engaged', {});
        return;
      }
      say(game, 'player', ['📞'], { ttl: 1.4 }); // you, ringing his number
      w.calls += 1;
      w.phone = 'ringing';
      game.events.emit('phone:ringing', {});
    },
  },
  // The board's Saturday slot: Kev's face, then (write again) the boss's, then Kev's again...
  write_kev: {
    on: 'roster', text: "write Kev's name in Saturday's slot on the board", duration: WRITE_S, sneaky: true,
    saw: '🗓️', // the board (its week strip, Saturday ringed); longer than any glance away
    can: (p, w) => w.roster !== 'kev' && !w.rosterLocked,
    over: ['write_boss'], // (never both)
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
  say(game, 'player', ['🎵'], { kind: 'thought', ttl: 1.5 }); // whistling, innocent
  game.events.emit('roster:changed', { to: who });
}

// 5:00, the end beat (2 s): who the board says it is. The boss filled it in on Monday and doesn't remember whom he
// put down: he announced it to the room before he looked, and now he reads out whatever face is in the slot
// (cast.js readRoster). Now: his own (he went red reading it out; he can't take it back in front of everyone: Lin and
// Kev clap him into his own Saturday, he sags and keeps it: a win), Kev's (he points at Kev; Kev protests, not knowing
// who did it, and the boss taps the board: it says Kev), yours with you here (fail: he waves you up front), or
// anyone's with your chair empty (blamed: he redraws the slot with your face, then points at your chair; scenario.js
// has the room stare at it).
function punchline(game, result) {
  const get = (id) => game.npcs.find((n) => n.id === id && n.active);
  const boss = get('boss');
  if (!boss) return;
  const kev = get('kev');
  if (result === 'blamed') {
    npcSayLater(boss, REDRAW_AT, ['✏️', '@player'], 'speech', REDRAW_S, 'board_look'); // writing you in
    npcSayLater(boss, REDRAW_AT + REDRAW_S, ['👉', '@player'], 'speech', 2 - REDRAW_AT - REDRAW_S, game.level.meeting.chair);
  } else if (result === 'fail') {
    speak(game, boss, [{ say: ['👈', '@player'], ttl: 2, face: game.level.meeting.presenter }]);
  } else if (game.world.roster === 'boss') {
    // he read out his own name, to the whole room: the room claps, and he's stuck with it
    for (const n of [get('lin'), kev]) if (n) speak(game, n, [{ say: ['👏'], ttl: 2, face: 'board_boss' }]);
    speak(game, boss, [
      { say: ['😳'], ttl: SAG_S, face: 'meeting_player' }, // to the room, who heard him
      { say: ['😩'], ttl: 2 - SAG_S, after: SAG_S, face: 'board_look' }, // he sags, and keeps it
    ]);
  } else {
    // Kev's: he points at Kev; Kev protests (🙅❓: I wasn't on it! who did this?); the boss taps the board: it says Kev
    speak(game, boss, [
      { say: ['👉', '@kev'], ttl: TAP_S, face: 'meeting_kev' },
      { say: ['👈', '🗓️'], ttl: 2 - TAP_S, after: TAP_S, face: 'board_look' },
    ]);
    if (kev) speak(game, kev, [
      { say: ['🙅', '❓'], ttl: 0.9, after: KEV_PROTEST_S, face: 'board_boss' },
      { say: ['😩'], ttl: 2 - KEV_PROTEST_S - 1.0, after: KEV_PROTEST_S + 1.0, face: 'board_look' },
    ]);
  }
}
const KEV_PROTEST_S = 0.3; // s into the beat Kev protests
const TAP_S = 0.9; // s into the beat the boss taps the board at him
const SAG_S = 0.8; // s into the beat the boss, clapped, sags

// After a tell (Lin or Kev saw you at the board, pointed at you, and the boss heard), the boss walks over to the board,
// looks at it and puts your face in Saturday's slot: he doesn't remember whose it was, but you were messing with it,
// so it's your Saturday now (the lure 'check', below). The engine has
// already sent you to your desk. Subscribed once per game.events, from the boss's clock (clockFor).
const JAM_WHISTLE_D = 2; // tiles off from the copier you whistle at (a few steps)
function tick(game) {
  // The board is shut only while the boss sits right by it, holding its only marker (the tray shows it empty). If he
  // gets up (his phone), he puts the marker back and the board is open again.
  const b = game.npcs.find((n) => n.id === 'boss');
  const spot = SPOTS.board_boss;
  game.world.rosterLocked = !!b && b.active !== false && !b.moving && !onPhone(b)
    && Math.abs(b.x - spot.x) < 0.6 && Math.abs(b.y - spot.y) < 0.6;
  // Walked a few steps off from the copier you jammed: whistling, innocent (not at the copier, where ♪ would read
  // as its beeping).
  const p = game.player;
  const w = game.world;
  // the boil-over done, your cup is back on the counter, open and steaming (props.js draws it from 'cooking' till then)
  if (w.noodles === 'cooking' && w.dingAt !== null && game.clock.minute >= w.dingAt + DING_TURN * GAME_MIN_PER_SEC) w.noodles = 'ready';
  const jf = game.world.jamFrom;
  if (jf && p && Math.hypot(p.x - jf.x, p.y - jf.y) > JAM_WHISTLE_D) {
    game.world.jamFrom = null;
    say(game, 'player', ['🎵'], { kind: 'thought', ttl: 1.5 });
  }
  watch(game);
}
const watch = oncePerGame((game) => {
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
});

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
    // answers his own ringing phone; nobody's there, so "Hello? ... Hello?" for a few seconds, and he hangs up (🙄).
    npc: 'boss',
    when: (w) => w.phone === 'ringing' && w.calls === 1,
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
        says: [{ say: ['📞', '❓'], ttl: 1.6 }, { say: ['📞', '❓', '❓'], ttl: 1.8, after: 2.2 }], // (into the phone) hello? ... hello??
      },
      done: { set: { phone: 'idle' }, event: 'phone:hungUp', says: [{ say: ['🙄'] }] }, // a wrong number
    },
  },
  { // Again?! Up at once, one sharp hello, and he slams it down.
    npc: 'boss',
    when: (w) => w.phone === 'ringing' && w.calls === 2,
    override: 'phone2',
    plan: 'phone2',
    label: 'answer phone again',
    spot: 'boss_window',
    react: { wait: 0.3, says: [{ say: ['☎️', '😤'], kind: 'alert' }], event: 'boss:phone' },
    work: {
      override: 'onPhone2',
      minutes: CALL2_MIN,
      progress: 'callProgress',
      start: { set: { phone: 'talking' }, event: 'phone:answered', says: [{ say: ['📞', '❗', '❓'], ttl: 1.6 }] },
      done: { set: { phone: 'idle' }, event: 'phone:slammed', says: [{ say: ['😠'], ttl: 1.6 }] },
    },
  },
  { // A third time: he snatches it up and lays the handset down beside it, off the hook, for good.
    npc: 'boss',
    when: (w) => w.phone === 'ringing' && w.calls >= 3,
    override: 'phone3',
    plan: 'phone3',
    label: 'take phone off the hook',
    spot: 'boss_window',
    react: { wait: 0.3, says: [{ say: ['☎️', '😠'], kind: 'alert' }], event: 'boss:phone' },
    work: {
      override: 'onPhone3',
      minutes: CALL3_MIN,
      progress: 'callProgress',
      start: { set: { phone: 'talking' }, event: 'phone:answered' },
      done: { set: { phone: 'offhook' }, event: 'phone:offhook', says: [{ say: ['📞', '❌'], ttl: 2 }] },
    },
  },
];

// Your noodle cup in your hand (take_noodles): never on the floor (keep), only back on its counter (put_noodles).
// Eating it leaves nothing on you; index.js's own eat rows say how it goes down.
const ITEMS = {
  noodles: { icon: '🍜', draw: PROP_THINGS.noodles, keep: true, edible: { leaves: null, icon: '😬' } },
  hot_noodles: { icon: '🍜', draw: PROP_THINGS.hotnoodles, keep: true, edible: { leaves: null } },
};

export default {
  id: 'weekend-shift',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  items: ITEMS,
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
  // verdict: the board decides: someone else's face there (Kev's, or the boss's own: he read it out to the room before
  // he looked) is a win if you're in your place (blamed if you aren't), however you got it there (a write with no
  // route still counts; the engine's rule would call it a fail). It records
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
      const result = r === 'player' ? 'fail' : present ? 'win' : 'blamed';
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
    { id: 'ding', icon: '#microwave', achieved: (w) => w.roster !== 'player' && w.wrote === 'ding' },
    { id: 'phone', icon: '#deskphone', achieved: (w) => w.roster !== 'player' && w.wrote === 'phone' },
  ],
  outcomeOrder: ['ding', 'phone'],
  initialWorld: () => ({
    roster: 'player', // whose face is in Saturday's slot: 'player' | 'boss' | 'kev'
    wrote: null, // what kept the watchers off you at the last write: 'ding' | 'phone' | null (see write())
    wroteAt: null, // game minute of the last write
    jamFrom: null, // where you stood to jam the copier, till you've walked off from it and whistled (tick)
    rosterLocked: false, // the boss sits by the board holding its marker (tick): no writing on it while he does
    copier: 'ok', // 'ok' | 'jammed' (beeping) | 'fixing' (Kev, still beeping) | 'fixed'
    jamAt: null, // game minute of the last jam
    fixProgress: 0,
    phone: 'idle', // the boss's phone (B): 'idle' | 'ringing' | 'talking' (in his hand) | 'offhook' (3rd call: for good)
    calls: 0, // how many times you've rung him (each call buys less: LURES)
    callProgress: 0,
    // your cup: 'cold' (on the counter, lid on) | 'held' (in your hand, dry) | 'cooking' (dings at dingAt, a game
    // minute, then boils over) | 'ready' (back on the counter, open, steaming) | 'heldHot' | 'crunched' | 'slurped'
    noodles: 'cold',
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
  voices: OFFICE_VOICES,
};
