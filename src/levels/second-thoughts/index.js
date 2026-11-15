// "Second Thoughts": your angry resignation letter is in the boss's tray, and at 3:40 he goes through it. Get it
// back. He sits facing his tray all afternoon, so you can't take it in the light. In the dark, every view shrinks to
// arm's length, except along a phone torch (src/game/darkness.js): anyone in a dark room holds up a phone. Three
// ways to make it dark:
//   switch    flip his office light switch (in the corner behind his back). He says ❓, holds up his phone, and as he
//             gets up his beam swings across the east half of the office; then he walks it over to the switch. Be
//             anywhere but in that beam, because whoever he finds in his dark office flipped it. He flips it back and
//             the tubes blink a few times before they catch.
//   blackout  tip the water jug over the coffee machine before Lin switches it on at 3:10 (from beside it, by the
//             fridge: from in front of it, Kev sees you from his desk through the kitchen door). Left alone the old
//             machine only makes the lights flicker; soaked, it shorts, and the short runs down the wiring to the fuse
//             box and trips it for the whole floor. Everyone holds up a phone as a torch; his rests on his hallway door,
//             so take it from the side of his desk and leave by the side door. Kev walks his torch down the hallway to
//             the fuse box (its door hangs open, its red lamp blinking) and resets it.
//   breaker   pull the breaker yourself. Kev comes to the fuse box with his torch: don't be there.
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at, deg } from '../../config.js';
import { say, burst, shake } from '../../core/fx.js';
import { isDark } from '../../game/darkness.js';
import { sitAtDesk } from '../../play/player.js';
import { CAST, BEHAVIOURS, START } from './cast.js';
import { DECOR, TITLE, END_SCENES, VOICES, LOOKS, POSES, CONES, SOUNDS } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';
import { letter } from './things.js';
import { COFFEE_CUP, pourCoffee } from '../meeting/coffee.js';

const t = (hhmm) => at(hhmm, START);

// Level 1's floor (src/levels/meeting/map.js), rewired:
//   Y the boss's in-tray (on his desk)   S his office light switch (in the north-west corner, behind his back)
//   X the fuse box (on the hallway's end wall, facing the hallway)   M the coffee machine   F fridge   P your desk
// The switch and the fuse box are drawn by darkness.controls (render/darkness.js), the coffee machine by the map.
// His chair is boxed in by plants and his desk (the tray on its east end): he gets out behind it. The office's south-west wall is solid,
// so from his chair he can't see down the hallway to the fuse box. Two doors: the hallway door (south) and a side
// door into the meeting room (east, beside the tray). In the dark his torch rests on the hallway door.
const MAP = [
  '#S############################', // 0
  '#.......G..........#FMTT.....#', // 1
  '#..H.HH.G..........#.........#', // 2
  '#..TTY..D..TTTTTT..#....TTT..#', // 3
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG..........#.........#', // 5
  '#X##GGDGG#####D#######DD######', // 6
  '#............................#', // 7
  '#..TTT......TPT......TTT.....#', // 8
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
  Y: { kind: 'tray', solid: true, opaque: false, interactable: 'tray', draw: 'desk' },
  S: { kind: 'light_switch', solid: true, opaque: true, interactable: 'office_switch', draw: 'wall' },
  X: { kind: 'fuse_box', solid: true, opaque: true, interactable: 'fuse_box', draw: 'wall' },
  M: { kind: 'coffee_machine', solid: true, opaque: false, interactable: 'coffee_machine' }, // the counter's machine
  F: { kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' },
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  L: { kind: 'entrance', solid: true, opaque: false, npcPassable: true },
  R: { kind: 'restroom', solid: true, opaque: true },
  E: { kind: 'elevator', solid: true, opaque: true },
};

const SPOTS = {
  player_desk: { x: 13, y: 9, face: 'N' }, // your seat; you start here
  boss_desk: { x: 4, y: 2, face: 'S' }, // facing his tray, all afternoon
  lin_desk: { x: 4, y: 9, face: 'N' },
  kev_desk: { x: 22, y: 9, face: 'N' },
  office_switch: { x: 1, y: 1, face: 'N' }, // stand here to reach S: behind him, out of his view and his reach
  fuse_box: { x: 1, y: 7, face: 'N' }, // stand here to reach X
  coffee_machine: { x: 21, y: 2, face: 'N' }, // in front of M: Kev sees it from his desk, through the kitchen door
  desk_side: { x: 6, y: 3, face: 'W' }, // beside the tray, by the side door: his torch never rests here
  in_front: { x: 5, y: 4, face: 'N' }, // in front of his desk
  called_in: { x: 5, y: 5, face: 'N' }, // where you're summoned at 3:40 if he reads it: a step back from his desk
  boss_door: { x: 6, y: 7, face: 'N' },
  kitchen_table: { x: 25, y: 4, face: 'N' },
  restroom: { x: 25, y: 12, face: 'S' },
  elevator: { x: 2, y: 15, face: 'S' },
};

const ZONES = {
  office: { x0: 1, y0: 1, x1: 8, y1: 6 }, // the boss's glass office (its own light switch)
  floor: { x0: 1, y0: 7, x1: 29, y1: 13 }, // the open-plan floor and hallway: be here at 3:40
  floor_dark: { x0: 1, y0: 7, x1: 29, y1: 12 }, // what the fuse darkens of it (the last row gets daylight
  floor_back: { x0: 10, y0: 12, x1: 29, y1: 13 }, // from the glass entrance, except past its end)
  meeting_room: { x0: 9, y0: 1, x1: 19, y1: 6 },
  kitchen: { x0: 20, y0: 1, x1: 29, y1: 6 },
  fuse_nook: { x0: 1, y0: 7, x1: 3, y1: 9 }, // right at the fuse box: whoever Kev finds here pulled it
  outside: { x0: 0, y0: 14, x1: 30, y1: 17 },
};

// Where you took the letter decides the route: how the tray was dark at that moment.
function howDark(game, x, y) {
  const w = game.world;
  if (!isDark(game, x, y)) return null;
  if (w.fuse !== 'on') return w.fuseBy === 'player' ? 'breaker' : 'blackout';
  return 'switch';
}

// His office tubes, switched back on, blink a few times before they catch (the switch work's progress, 0 -> 1).
const BLINKS = [[0.2, 0.24], [0.42, 0.45], [0.6, 0.66], [0.76, 0.79], [0.86, 0.94]];
const tubesLit = (w) => w.officeLight === 'on'
  || (w.officeLight === 'starting' && BLINKS.some(([a, b]) => w.switchProgress >= a && w.switchProgress < b));
// Anyone in a dark room holds up a phone: in the blackout everyone, in his switched-off office whoever is in it.
const atBossDesk = (n) => Math.abs(n.x - (SPOTS.boss_desk.x + 0.5)) < 0.3 && Math.abs(n.y - (SPOTS.boss_desk.y + 0.5)) < 0.3;
const inOffice = (n) => n.x >= ZONES.office.x0 && n.x < ZONES.office.x1 && n.y >= ZONES.office.y0 && n.y < ZONES.office.y1;

const INTERACTIONS = {
  take_letter: {
    on: 'tray', text: 'take your letter back', duration: 2.5, sneaky: true, saw: '✉️', // longer than any glance
    can: (p, w) => !p.held && w.letter === 'tray',
    done(game, a) {
      const w = game.world;
      game.player.held = 'letter';
      w.letter = 'player';
      w.snatched = howDark(game, a.x, a.y) ?? (w.officeLight === 'starting' ? 'switch' : 'light'); // a blink is still his dark
      game.events.emit('letter:taken', { how: w.snatched });
      if (w.snatched !== 'light') game.events.emit('letter:snatched', { how: w.snatched });
    },
  },
  // Your desk while you hold the letter: it goes in your drawer and you sit down (out of everyone's sight for good).
  stash_letter: {
    on: 'own_desk', text: 'put your letter in your drawer', instant: true,
    can: (p) => p.held === 'letter',
    done(game) {
      const w = game.world;
      game.player.held = null;
      w.letter = 'drawer';
      w.stashAt = game.loopTime;
      sitAtDesk(game);
      game.events.emit('letter:stashed', {});
    },
  },
  flip_switch: {
    on: 'office_switch', text: 'flip the light switch', duration: 0.5, sneaky: false,
    noise: { radius: 2 }, // the clack: too far from his chair to turn him, but the office goes dark
    can: () => true,
    done(game) {
      const w = game.world;
      w.officeLight = w.officeLight === 'off' ? 'on' : 'off';
      if (w.officeLight === 'off') game.player.switched = true; // it was you, if he finds you in the dark
      shake(game, 0.04, 0.12);
      game.events.emit(w.officeLight === 'off' ? 'switch:off' : 'switch:on', {});
    },
  },
  // The water jug beside the coffee machine, tipped over it: when Lin switches it on, it shorts and blows the fuse.
  // Only before she does (the jug is full and upright till then, and stays tipped after).
  rig_coffee: {
    on: 'coffee_machine', text: 'tip the water jug over the coffee machine', duration: 1.5, sneaky: true, saw: '💦',
    can: (p, w) => !p.held && !w.rigged && w.coffee === 'none',
    done(game) {
      game.world.rigged = true;
      burst(game, 'sweat', 21.5, 1.9, 10, { speed: 1.4, ttl: 0.7 }); // the splash
      game.events.emit('coffee:rigged', {});
    },
  },
  // Once Lin's coffee has brewed, the full pot pours a cup (DESIGN.md "A thing that looks usable is usable"). The cup
  // leads nowhere: it only fills your hands.
  pour_coffee: { ...pourCoffee(), can: (p, w) => !p.held && w.coffee === 'brewed' && w.fuse === 'on' },
  pull_breaker: {
    on: 'fuse_box', text: 'pull the main breaker', duration: 1.0, sneaky: true, saw: '⚡',
    can: (p, w) => w.fuse === 'on',
    done(game, a) {
      const w = game.world;
      w.fuse = 'off';
      w.fuseBy = 'player';
      burst(game, 'puff', a.x, a.y, 6, { speed: 0.5, ttl: 0.8 });
      game.events.emit('fuse:pulled', {});
    },
  },
};

const ITEMS = {
  letter: {
    icon: '✉️',
    draw: letter, // the envelope (things.js), wherever it is held or lies
    place: 'letter',
    contraband: 'boss', // in your hand where he can see it: caught. Dropped where he can see it: back in his pocket
    edible: { leaves: null }, // eat your words
  },
  coffee: COFFEE_CUP,
};

const ROLES = {
  authority: { id: 'boss', offDuty: ['meeting'], helpless: [], deafIn: null },
  // He walks his torch to the switch: whoever it finds in his dark office flipped it (pretending doesn't help).
  evidence: { by: 'boss', while: 'dark', mark: 'switched', knows: 'bossKnows', icon: '💡' },
  // Kev at the fuse box: whoever he finds standing at it pulled the breaker.
  scene: {
    by: 'kev', while: ['fuse', 'fixing'], zone: 'fuse_nook', door: { x: 1, y: 7.5 }, radius: 2.5,
    fresh: (w) => w.fuse === 'on', icon: '⚡',
  },
};

const LURES = [
  { // His office goes dark (the switch, not the fuse): he holds up his phone and walks his torch to the switch.
    npc: 'boss',
    when: (w) => w.fuse === 'on' && w.officeLight === 'off',
    override: 'dark',
    plan: 'switch',
    label: 'light switch',
    spot: 'office_switch',
    react: { wait: 0.8, says: [{ say: ['❓'], kind: 'thought' }], event: 'boss:dark' },
    work: {
      override: 'switching',
      minutes: 2,
      progress: 'switchProgress',
      start: { set: { officeLight: 'starting' }, event: 'switch:starting' }, // flipped back: the tubes blink
      done: { set: { officeLight: 'on' }, event: 'switch:fixed', says: [{ say: ['😠'] }] },
    },
  },
  { // The fuse is out: Kev walks his phone torch down the hallway to the fuse box and resets it.
    npc: 'kev',
    when: (w) => w.fuse === 'off',
    override: 'fuse',
    plan: 'fuse',
    label: 'fuse box',
    spot: 'fuse_box',
    react: { wait: 1.2, says: [{ say: ['❓'], kind: 'thought', ttl: 1 }, { say: ['🔧'], kind: 'thought', after: 1.1, ttl: 2.4 }], event: 'kev:fuse' },
    work: {
      override: 'fixing',
      minutes: 3,
      progress: 'fixProgress',
      start: { set: { fuse: 'off' }, event: 'fuse:fixing' },
      done: { set: { fuse: 'on', fuseBy: null }, event: 'fuse:fixed' },
    },
  },
];

const gotIt = (w) => w.letter === 'player' || w.letter === 'drawer' || w.letter === 'eaten';

// The level's own clock work, once a step (from clockFor, on the boss's turn: he is first in the cast).
const SURGE = 1.2; // s: the short runs down the wiring from the coffee machine to the fuse box
const BREW_MIN = 3; // game minutes the machine brews (with the power on)
function tick(game) {
  const w = game.world;
  // The short reaches the fuse box: it blows, and its door flies open.
  if (w.coffee === 'shorted' && !w.tripped) {
    const k = (game.loopTime - w.shortAt) / SURGE;
    w.surge = k < 1 ? k : null;
    if (k >= 1) {
      w.tripped = true;
      if (w.fuse === 'on') {
        w.fuse = 'off';
        w.fuseBy = 'coffee';
        burst(game, 'sparks', 1.5, 6.9, 22, { speed: 3, ttl: 0.9 });
        shake(game, 0.08, 0.25);
        game.events.emit('fuse:tripped', {});
      }
    }
  }
  if (w.coffee === 'brewing' && w.fuse === 'on' && game.clock.minute - w.brewAt >= BREW_MIN) w.coffee = 'brewed';
  dread(game);
  // 3:05: Lin gets up for her afternoon coffee, and thinks of it.
  if (game.clock.minute >= 5 && !w.linCoffee) {
    w.linCoffee = true;
    say(game, 'lin', ['☕'], { kind: 'thought', ttl: 2.2 });
  }
  // Whoever had you sent to your desk (a tattle: the shout's sightline is still up; else the boss himself), for the
  // 3:40 card.
  if (game.rules?.working && !w.deskwork) w.deskwork = game.fx?.lines?.find((l) => l && l.kind === 'tattle')?.from ?? 'boss';
}

// The boss dreads his tray. Acting only: his facing and his cone never change. A fixed five-minute round from 3:01,
// the same every loop, while he sits at his desk in his own light with nothing else to do: he looks at the tray and
// sighs, drums his fingers, checks his desk clock. At 3:39 the desk clock chimes, he sighs and drags the tray over;
// a moment later he looks in it.
const ROUND = 5; // game minutes
const ACTS = [[0, 0.9, 'sigh'], [1.4, 3.0, 'drum'], [3.5, 4.2, 'clock']]; // [from, to, act], minutes into the round
const CHIME = 39; // 3:39
const PULL = 0.4; // game minutes the drag takes
const READ = 39.6; // he looks in the tray
function dread(game) {
  const w = game.world;
  const boss = game.npcs[0];
  const m = game.clock.minute;
  const seated = atBossDesk(boss) && boss.pose === 'sit';
  const free = seated && !boss.override && !game.outcome && !game.caught && w.fuse === 'on' && w.officeLight === 'on';
  let act = null;
  if (free && m >= 1 && m < CHIME) {
    const r = (m - 1) % ROUND;
    for (const [a, b, name] of ACTS) if (r >= a && r < b) act = name;
  }
  if (act !== w.bossAct) {
    w.bossAct = act;
    if (act === 'sigh') {
      say(game, 'boss', ['📥', '😮‍💨'], { kind: 'thought', ttl: 1.6 });
      game.events.emit('boss:sigh', {});
    } else if (act === 'clock') {
      say(game, 'boss', ['⏰', '😮‍💨'], { kind: 'thought', ttl: 1.4 });
      game.events.emit('boss:checksClock', {});
    }
  }
  if (m >= CHIME && !w.chimed) {
    w.chimed = true;
    game.events.emit('boss:chime', {});
  }
  if (w.chimed && w.pullAt === null && seated && !game.outcome && !game.caught) {
    w.pullAt = m;
    say(game, 'boss', ['😮‍💨'], { kind: 'thought', ttl: 1.2 });
    game.events.emit('boss:pullsTray', {});
  }
  if (w.pullAt !== null) w.trayPull = Math.min(1, (m - w.pullAt) / PULL);
  if (w.trayPull === 1 && !w.trayRead && m >= READ) {
    w.trayRead = true;
    if (w.letter === 'tray' || w.letter === 'boss') say(game, 'boss', ['✉️', '😠'], { ttl: 2.6 });
  }
}

// The lights flickering as the old machine starts (or as it shorts): how far a lit room dims, by seconds since.
const FLICKER = [[0, 0.1, 0.75], [0.17, 0.25, 0.45], [0.36, 0.5, 0.85], [0.62, 0.68, 0.35], [0.8, 0.88, 0.6]];
function flicker(since) {
  for (const [a, b, k] of FLICKER) if (since >= a && since < b) return k;
  return 0;
}
const dip = (w, game) => Math.max(
  w.flickerAt === null ? 0 : flicker(game.loopTime - w.flickerAt),
  w.shortAt === null ? 0 : flicker(game.loopTime - w.shortAt),
);

export default {
  id: 'second-thoughts',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START,
    gatherAt: t('3:38'), // he sits down to his tray
    meetingAt: t('3:40'), // and goes through it
    clockRedAt: t('3:35'),
    clockTickAt: t('3:35'),
    tockAt: t('3:38'),
    halfMinuteAt: t('3:39'),
  },
  interactions: INTERACTIONS,
  items: ITEMS,
  roles: ROLES,
  lures: LURES,
  hunts: [],
  doors: [],
  behaviours: BEHAVIOURS,
  clockFor(game, npc) {
    if (npc === game.npcs[0]) tick(game);
    return game.clock.minute;
  },
  darkness: {
    rooms: [
      { zone: 'office', lit: (w) => w.fuse === 'on' && tubesLit(w), dip },
      { zone: ['floor_dark', 'floor_back', 'meeting_room', 'kitchen'], lit: (w) => w.fuse === 'on', dip },
    ],
    // Seated in the dark, he points his phone at his hallway door (waiting for someone to come and fix it): the
    // front of his desk and that door are lit, the side of his desk and the side door stay dark, the same every loop.
    // Up and walking, his beam goes where he looks.
    torch: {
      when: (n, w) => w.fuse !== 'on' || (w.officeLight !== 'on' && inOffice(n)), fov: deg(60), radius: 7,
      aim: (n) => (n.id === 'boss' && atBossDesk(n) ? 'boss_door'
        : n.id === 'kev' && (n.override === 'fuse' || n.override === 'fixing') ? 'fuse_box' : null),
    },
    controls: [
      { tile: 'S', kind: 'switch', on: (w) => w.officeLight !== 'off' }, // its amber lamp lights while it's off
      { tile: 'X', kind: 'breaker', on: (w) => w.fuse === 'on' }, // off: its door hangs open, its red lamp blinks
    ],
  },
  // 3:40 is no meeting: he goes through his tray at his desk. Nobody knows the letter ever existed, so wherever you are
  // with it, you got away with it (never 'blamed').
  meeting: {
    override: 'meeting', room: 'floor', chair: 'player_desk', presenter: 'called_in',
    verdict: (game, { result }) => (result === 'blamed' ? { result: 'win' }
      : result === 'fail' && game.world.deskwork === 'kev' && game.world.letter !== 'eaten' ? { why: 'deskwork' } : null),
  },
  // A route's icon names your move: you flip his light 💡, you soak Lin's coffee machine ☕, you pull the breaker ⚡.
  routes: [
    { id: 'switch', icon: '💡', achieved: (w) => gotIt(w) && w.snatched === 'switch' },
    { id: 'blackout', icon: '☕', achieved: (w) => gotIt(w) && w.snatched === 'blackout' },
    { id: 'breaker', icon: '⚡', achieved: (w) => gotIt(w) && w.snatched === 'breaker' },
  ],
  outcomeOrder: ['breaker', 'blackout', 'switch'],
  initialWorld: () => ({
    letter: 'tray', // 'tray' | 'player' | 'dropped' | 'boss' (he picked it up) | 'eaten'
    snatched: null, // how dark it was when you took it: 'switch' | 'blackout' | 'breaker' | 'light'
    fuse: 'on', // 'on' | 'off'
    fuseBy: null, // what tripped it: 'coffee' (the soaked coffee machine) | 'player' (the breaker)
    officeLight: 'on', // his office switch: 'on' | 'off' | 'starting' (flipped back on, the tubes blinking)
    switchProgress: 0,
    fixProgress: 0,
    bossKnows: false,
    coffee: 'none', // Lin's: 'none' | 'brewing' | 'brewed' (the pot full) | 'shorted' (soaked, it blew) | 'cold' (no power)
    rigged: false, // you tipped the water jug over the machine
    flickerAt: null, // loop seconds when it started and the lights flickered
    shortAt: null, // loop seconds when it shorted
    surge: null, // how far the short has run down the wiring to the fuse box (0..1), while it runs
    tripped: false, // the short reached the fuse box
    brewAt: null, // the game minute it started brewing
    bossAct: null, // what he is doing at his desk while he dreads the tray: 'sigh' | 'drum' | 'clock'
    chimed: false, // his desk clock chimed 3:39
    pullAt: null, // the game minute he started dragging the tray over
    trayPull: 0, // how far he has dragged it (0..1)
    trayRead: false, // he looked in it
    stashAt: null, // loop seconds when you put it in your drawer
    linCoffee: false,
    deskwork: null, // who had you sent to your desk with a pile of work: 'kev' | 'lin' | 'boss'
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
