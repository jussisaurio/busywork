// "Second Thoughts": your angry resignation letter is in the boss's tray, and at 3:40 he goes through it. Get it
// back. He sits facing his tray all afternoon, so you can't take it in the light. In the dark, every view shrinks to
// arm's length, except along a phone torch (src/game/darkness.js): anyone in a dark room holds up a phone. Three
// ways to make it dark:
//   switch    switch his office lights off at the lighting panel out in the hallway. He says ❓, holds up his phone,
//             and goes out to the panel to find out why; there he tries its unlabelled switches one by one (his tubes
//             blink) before he finds his. His desk is empty for minutes: in by the meeting room's side door, out the
//             same way. Whoever he finds at the panel, or in his dark office, switched it off.
//   blackout  pour the water jug down the back of the coffee machine, onto its wall socket, before Lin switches it on
//             at 3:10 (from beside it, by the fridge: from in front of it, Kev sees you from his desk through the
//             kitchen door). Nothing shows from the front. Left alone the old machine only makes the lights flicker;
//             with a wet socket it shorts, and the short trips the fuse for the whole floor. Everyone holds up a phone
//             as a torch. Kev first unplugs the smoking machine, then walks his torch down the hallway to the fuse box
//             (its door hangs open, its red lamp blinking) and finds the breaker that's down by phone light.
//   breaker   pull the breaker yourself, and get away from the box.
// Whenever the whole floor goes dark, the boss gets up with his phone torch and goes out to the fuse box, round the
// corner from his hallway door, and holds his light on it till Kev has the power back (he doesn't touch fuses). His
// desk is empty all that time. Whoever he finds at the box pulled it, as at the panel.
// Eat it: you chew it up, gag and spit a grey wad of pulp on the floor. Nothing left to read: it's gone.
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at, deg, EAT_TIME } from '../../config.js';
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
//   Y the boss's in-tray (on his desk)   S the lighting panel (on the hallway wall, the meeting room's south wall)
//   X the fuse box (on the hallway's end wall, facing the hallway)   M the coffee machine   F fridge   P your desk
// The panel and the fuse box are drawn by darkness.controls (render/darkness.js), the coffee machine by the map.
// His chair is boxed in by plants and his desk (the tray on its east end): he gets out behind it. The office's south-west wall is solid,
// so from his chair he can't see down the hallway to the fuse box. Two doors: the hallway door (south) and a side
// door into the meeting room (east, beside the tray).
const MAP = [
  '##############################', // 0
  '#.......G..........#FMTT.....#', // 1
  '#..H.HH.G..........#.........#', // 2
  '#..TTY..D..TTTTTT..#....TTT..#', // 3
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG..........#.........#', // 5
  '#X##GGDGG#####D##S####DD######', // 6
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
  S: { kind: 'light_panel', solid: true, opaque: true, interactable: 'office_switch', draw: 'wall' },
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
  office_switch: { x: 17, y: 7, face: 'N' }, // stand here to reach S: out in the hallway, round the corner from his door
  fuse_box: { x: 1, y: 7, face: 'N' }, // stand here to reach X
  fuse_watch: { x: 2, y: 8, face: 'N' }, // the boss in a blackout: at Kev's shoulder, his torch on the box
  coffee_machine: { x: 21, y: 2, face: 'N' }, // in front of M: Kev sees it from his desk, through the kitchen door
  desk_side: { x: 6, y: 3, face: 'W' }, // beside the tray, by the side door
  in_front: { x: 5, y: 4, face: 'N' }, // in front of his desk
  called_in: { x: 5, y: 5, face: 'N' }, // where you're summoned at 3:40 if he reads it: a step back from his desk
  boss_door: { x: 6, y: 7, face: 'N' },
  kitchen_table: { x: 25, y: 4, face: 'N' },
  restroom: { x: 25, y: 12, face: 'S' },
  elevator: { x: 2, y: 15, face: 'S' },
};

const ZONES = {
  office: { x0: 1, y0: 1, x1: 8, y1: 6 }, // the boss's glass office (its lights are on the hallway panel)
  floor: { x0: 1, y0: 7, x1: 29, y1: 13 }, // the open-plan floor and hallway: be here at 3:40
  floor_dark: { x0: 1, y0: 7, x1: 29, y1: 12 }, // what the fuse darkens of it (the last row gets daylight
  floor_back: { x0: 10, y0: 12, x1: 29, y1: 13 }, // from the glass entrance, except past its end)
  meeting_room: { x0: 9, y0: 1, x1: 19, y1: 6 },
  kitchen: { x0: 20, y0: 1, x1: 29, y1: 6 },
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
      // A blink is still his dark; and in the light, with him not back at his desk yet, it was whatever dark got
      // him up.
      w.snatched = howDark(game, a.x, a.y)
        ?? (w.officeLight === 'starting' || !atBossDesk(game.npcs[0]) ? (w.bossOut ?? 'switch') : 'light');
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
    on: 'office_switch', text: "switch his office lights off", duration: 0.5, sneaky: false,
    noise: { radius: 2 }, // the clack: out in the hallway, far from his chair
    can: () => true,
    done(game) {
      const w = game.world;
      w.officeLight = w.officeLight === 'off' ? 'on' : 'off';
      if (w.officeLight === 'off') game.player.switched = true; // it was you, if he finds you at it (tick clears it)
      shake(game, 0.04, 0.12);
      game.events.emit(w.officeLight === 'off' ? 'switch:off' : 'switch:on', {});
    },
  },
  // The water jug beside the coffee machine, poured down the back of it onto its wall socket: when Lin switches it
  // on, it shorts and blows the fuse. Nothing shows from the front (the jug goes back empty). Only before she does.
  rig_coffee: {
    on: 'coffee_machine', text: 'pour the water jug down the back of the machine, onto its socket', duration: 1.5, sneaky: true, saw: '💦',
    can: (p, w) => !p.held && !w.rigged && w.coffee === 'none',
    done(game) {
      game.world.rigged = true;
      burst(game, 'sweat', 21.85, 1.2, 8, { speed: 0.9, ttl: 0.6 }); // the splash, behind the machine
      game.events.emit('coffee:rigged', {});
    },
  },
  // Once Lin's coffee has brewed, the full pot pours a cup (DESIGN.md "A thing that looks usable is usable"). The cup
  // leads nowhere: it only fills your hands.
  pour_coffee: { ...pourCoffee(), can: (p, w) => !p.held && w.coffee === 'brewed' && w.fuse === 'on' },
  // Eating your letter (hold E, as any edible thing): paper, not food. You cram it in and chew, then gag (🤢) and spit
  // it out beside you, a soggy grey wad of pulp with nothing left to read on it. Replaces the engine's eat_letter.
  eat_letter: {
    on: 'self', text: 'eat your letter', duration: EAT_TIME, hold: true, preview: 'lift', idle: true, saw: '✉️',
    can: (p) => p.held === 'letter',
    done(game) {
      const w = game.world;
      const p = game.player;
      p.held = null;
      w.letter = 'eaten';
      w.wad = { x: p.x + 0.7, y: p.y - 0.2 }; // beside you, on the open floor
      w.wadAt = game.loopTime;
      burst(game, 'paper', p.x, p.y, 5, { speed: 0.8, ttl: 0.6 });
      say(game, 'player', ['🤢'], { ttl: 1.6 });
      game.events.emit('letter:eaten', {});
    },
  },
  pull_breaker: {
    on: 'fuse_box', text: 'pull the main breaker', duration: 1.0, sneaky: true, saw: '⚡',
    can: (p, w) => w.fuse === 'on',
    done(game, a) {
      const w = game.world;
      w.fuse = 'off';
      w.fuseBy = 'player';
      game.player.switched = true; // it was you, if he finds you at it (tick clears it)
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
    contrabandIn: 'office', // away from his desk, a white envelope in your hand is anyone's envelope
    edible: { leaves: null }, // eat your words
  },
  coffee: COFFEE_CUP,
};

const ROLES = {
  authority: { id: 'boss', offDuty: ['meeting'], helpless: [], deafIn: null },
  // On his way to the panel or the fuse box: whoever he finds at the one you threw, or in his dark office, threw it
  // (pretending doesn't help; tick clears the mark once you are clear of them).
  evidence: { by: 'boss', while: ['dark', 'blackout'], mark: 'switched', knows: 'bossKnows', icon: '💡' },
};

const LURES = [
  { // His office goes dark (the panel, not the fuse): he holds up his phone and goes out to the panel to see why. Its
    // switches have no labels: he tries them one by one (his tubes blink) before he finds his.
    npc: 'boss',
    when: (w) => w.fuse === 'on' && w.officeLight === 'off',
    override: 'dark',
    plan: 'switch',
    label: 'lighting panel',
    spot: 'office_switch',
    react: { wait: 0.8, says: [{ say: ['❓'], kind: 'thought' }], event: 'boss:dark' },
    work: {
      override: 'switching',
      minutes: 2,
      progress: 'switchProgress',
      start: { set: { officeLight: 'starting' }, event: 'switch:starting' }, // trying switches: the tubes blink
      done: { set: { officeLight: 'on' }, event: 'switch:fixed', says: [{ say: ['😠'] }] },
    },
  },
  { // The whole floor goes dark: he holds up his phone and goes out to the fuse box, round the corner from his door,
    // and holds his torch on it for Kev (he doesn't touch fuses) till the power is back, then walks back to his desk.
    // On the way he catches whoever he finds at it (ROLES.evidence), as on his way to the panel.
    npc: 'boss',
    when: (w) => w.fuse === 'off',
    override: 'blackout',
    plan: 'fusebox',
    label: 'fuse box',
    spot: 'fuse_watch',
    react: { wait: 1.0, says: [{ say: ['❓'], kind: 'thought' }], event: 'boss:blackout' },
    work: {
      override: 'waiting',
      minutes: 60, // never runs out: he waits till Kev has the fuse back on (start.set changes)
      progress: 'waitProgress',
      start: { set: { fuse: 'off' } },
      done: {},
    },
  },
  { // The soaked machine shorted and smokes: Kev goes to unplug it first (Lin froze at it), or it would only trip the
    // fuse again.
    npc: 'kev',
    when: (w) => w.coffee === 'shorted' && w.fuse === 'off' && !w.unplugged,
    override: 'smoke',
    plan: 'unplug',
    label: 'the smoking machine',
    spot: 'coffee_machine',
    react: { wait: 1.2, says: [{ say: ['❓'], kind: 'thought', ttl: 1 }] , event: 'kev:smoke' },
    work: {
      override: 'unplugging',
      minutes: 0.4,
      progress: 'unplugProgress',
      start: { set: { unplugged: false } },
      done: { set: { unplugged: true }, event: 'coffee:unplugged' },
    },
  },
  { // The fuse is out: Kev walks his phone torch down the hallway to the fuse box and finds the breaker that's down
    // by phone light (a few seconds of fumbling on screen).
    npc: 'kev',
    when: (w) => w.fuse === 'off' && (w.coffee !== 'shorted' || w.unplugged),
    override: 'fuse',
    plan: 'fuse',
    label: 'fuse box',
    spot: 'fuse_box',
    react: { wait: 1.2, says: [{ say: ['🔧'], kind: 'thought', ttl: 2.4 }], event: 'kev:fuse' },
    work: {
      override: 'fixing',
      minutes: 3,
      progress: 'fixProgress',
      start: { set: { fuse: 'off' }, event: 'fuse:fixing' },
      done: { set: { fuse: 'on', fuseBy: null }, event: 'fuse:fixed' },
    },
  },
];



const gotIt = (w) => ['player', 'drawer', 'eaten'].includes(w.letter);
const gone = (w) => w.letter === 'eaten'; // spat out as pulp: nothing for him to read at 3:40


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
  // You threw his lights or the floor's: a mark only while you are at the panel, the fuse box or in his office
  // (ROLES.evidence).
  const p = game.player;
  const far = (spot) => Math.hypot(p.x - (SPOTS[spot].x + 0.5), p.y - (SPOTS[spot].y + 0.5)) > 2.5;
  if (p.switched && far('office_switch') && far('fuse_box') && !inOffice(p)) p.switched = false;
  // What got him up from his desk, for the route if you take it before he is back.
  const boss = game.npcs[0];
  if (boss.override === 'dark') w.bossOut = 'switch';
  if (boss.override === 'blackout') w.bossOut = w.fuseBy === 'player' ? 'breaker' : 'blackout';
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
  noises: {},
  hunts: [],
  inspections: [],
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
    // At the fuse box the boss and Kev hold their beams on it. Walking, a beam goes where its holder looks.
    torch: {
      when: (n, w) => w.fuse !== 'on' || (w.officeLight !== 'on' && inOffice(n)), fov: deg(60), radius: 7,
      aim: (n) => ((n.id === 'boss' && n.override === 'waiting')
        || (n.id === 'kev' && (n.override === 'fuse' || n.override === 'fixing')) ? 'fuse_box' : null),
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
    verdict: (game, { result }) => {
      const w = game.world;
      if (result === 'blamed') return { result: 'win', why: gone(w) ? 'eaten' : undefined };
      if (result === 'win') return gone(w) ? { why: 'eaten' } : null; // spat out: an empty tray
      return w.deskwork === 'kev' ? { why: 'deskwork' } : null;
    },
  },
  // A route's icon names your move: you flip his light 💡, you soak Lin's coffee machine ☕, you pull the breaker ⚡.
  routes: [
    { id: 'switch', icon: '💡', achieved: (w) => gotIt(w) && w.snatched === 'switch' },
    { id: 'blackout', icon: '☕', achieved: (w) => gotIt(w) && w.snatched === 'blackout' },
    { id: 'breaker', icon: '⚡', achieved: (w) => gotIt(w) && w.snatched === 'breaker' },
  ],
  outcomeOrder: ['breaker', 'blackout', 'switch'],
  initialWorld: () => ({
    letter: 'tray', // 'tray' | 'player' | 'dropped' | 'boss' (he picked it up) | 'drawer' | 'eaten' (spat out as pulp)
    snatched: null, // how dark it was when you took it: 'switch' | 'blackout' | 'breaker' | 'light'
    fuse: 'on', // 'on' | 'off'
    fuseBy: null, // what tripped it: 'coffee' (the soaked coffee machine) | 'player' (the breaker)
    officeLight: 'on', // his office switch: 'on' | 'off' | 'starting' (flipped back on, the tubes blinking)
    switchProgress: 0,
    fixProgress: 0,
    waitProgress: 0,
    bossOut: null, // what last got him up from his desk: 'switch' | 'blackout' | 'breaker'
    bossKnows: false,
    coffee: 'none', // Lin's: 'none' | 'brewing' | 'brewed' (the pot full) | 'shorted' (soaked, it blew) | 'cold' (no power)
    rigged: false, // you poured the water jug down the back of the machine, onto its socket
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
    wad: null, // where you spat the pulp: { x, y } in tiles
    wadAt: null, // loop seconds when
    stashAt: null, // loop seconds when you put it in your drawer
    linCoffee: false,
    unplugged: false, // Kev unplugged the smoking machine
    unplugProgress: 0,
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
