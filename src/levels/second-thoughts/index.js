// "Second Thoughts": your angry resignation letter is in the boss's tray, and at 3:40 he goes through it. Get it
// back. He sits facing his tray all afternoon, so you can't take it in the light. In the dark, every view shrinks to
// arm's length, except along a phone torch (src/game/darkness.js): anyone in a dark room holds up a phone. Three
// ways to make it dark:
//   switch    switch his office lights off at the lighting panel out in the hallway. He says ❓, holds up his phone,
//             and goes out to the panel to find out why; there he tries its unlabelled switches one by one (his tubes
//             blink) before he finds his. His desk is empty for minutes: in by the meeting room's side door, out the
//             same way. Whoever he finds at the panel, or in his dark office, switched it off.
//   blackout  pour the water jug into the vent on the back of the coffee machine while the kitchen is empty (Lin
//             gets up at 3:05 and walks in just after 3:09 to switch it on at 3:10). Do it from beside it, by the
//             fridge: in front of it, Kev sees you from his desk through the kitchen door (Lin, walking in, too). The jug goes back empty and a puddle drips under the counter till it
//             shorts. Left alone the old machine only makes the lights flicker;
//             with water in its back it shorts, and the short trips the fuse for the whole floor. Everyone holds up a phone
//             as a torch. Kev first unplugs the smoking machine, then walks his torch down the hallway to the fuse box
//             (its door hangs open, its red lamp blinking) and finds the breaker that's down by phone light.
//   breaker   pull the breaker yourself, and get away from the box.
// Whenever the whole floor goes dark, the boss gets up with his phone torch and goes out to the fuse box, round the
// corner from his hallway door, and holds his light on it till Kev has the power back (he doesn't touch fuses). His
// desk is empty all that time. Whoever he finds at the box pulled it, as at the panel.
// Eat it, and ten minutes later it comes back up (sick). Before he sits down to his tray at 3:38, the retch brings the
// boss over to look, and he knows his envelope in the mess: caught, unless you fished it back out first. Later than
// that, he's busy with his empty tray.
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at, deg, EAT_TIME } from '../../config.js';
import { say, burst, shake } from '../../core/fx.js';
import { isDark } from '../../game/darkness.js';
import { sitAtDesk } from '../../play/player.js';
import { playerHolds, playerLetsGo } from '../../sim/take.js';
import { CAST, BEHAVIOURS, START } from './cast.js';
import { DECOR, TITLE, END_SCENES, LOOKS, POSES, CONES, SOUNDS } from './presentation.js';
import { OFFICE_VOICES } from '../office/voices.js';
import harness from './harness.js';
import gate from './gate.js';
import { letter } from './things.js';
import { COFFEE_CUP, pourCoffee } from '../meeting/coffee.js';
import { OWN_DESK, FRIDGE, COFFEE_POT, ENTRANCE, RESTROOM, ELEVATOR } from '../office/legend.js';
import { oncePerGame } from '../../core/events.js';

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
  M: COFFEE_POT, // the counter's machine
  F: FRIDGE,
  P: OWN_DESK,
  L: ENTRANCE,
  R: RESTROOM,
  E: ELEVATOR,
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
  towels: { x: 22, y: 2, face: 'N' }, // the paper towels on the kitchen counter
  // Where you threw up: moved there when you do (index.js sick), for the boss and Lin to come to. A placeholder till
  // then (the engine has no spot that follows a thing).
  puddle: { x: 13, y: 10, face: 'N' },
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

function flipSwitch(game) {
  const w = game.world;
  w.officeLight = w.officeLight === 'off' ? 'on' : 'off';
  if (w.officeLight === 'off') game.player.switched = true; // it was you, if he finds you at it (tick clears it)
  shake(game, 0.04, 0.12);
  game.events.emit(w.officeLight === 'off' ? 'switch:off' : 'switch:on', {});
}

const INTERACTIONS = {
  take_letter: {
    on: 'tray', text: 'take your letter back', duration: 2.5, sneaky: true, saw: '✉️', // longer than any glance
    can: (p, w) => !p.held && w.letter === 'tray',
    done(game, a) {
      const w = game.world;
      playerHolds(game, 'letter');
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
      playerLetsGo(game, 'drawer');
      w.stashAt = game.loopTime;
      sitAtDesk(game);
      game.events.emit('letter:stashed', {});
    },
  },
  // The hallway lighting panel: one switch, two prompts, so E always says what it will do.
  flip_switch: {
    on: 'office_switch', text: "switch his office lights off", duration: 0.5, sneaky: false,
    noise: { radius: 2 }, // the clack: out in the hallway, far from his chair
    can: (p, w) => w.officeLight !== 'off',
    done: flipSwitch,
  },
  flip_switch_on: {
    on: 'office_switch', text: "switch his office lights back on", duration: 0.5, sneaky: false,
    noise: { radius: 2 },
    can: (p, w) => w.officeLight === 'off',
    done: flipSwitch,
  },
  // The water jug beside the coffee machine, poured into the vent on its back: the machine is off, so nothing happens
  // till Lin switches it on; then its wet insides short and blow the fuse. The jug goes back empty and a puddle drips
  // under the counter till it shorts. Kev sees the front of the machine from his desk, through the kitchen door: pour
  // from there and he wonders (❓), then tells (❗👉). From beside it, by the fridge, he can't see you. Lin, walking in
  // on you mid-pour, tells too.
  rig_coffee: {
    on: 'coffee_machine', text: 'pour the water jug into the vent on the back of the machine', duration: 1.5, sneaky: true, saw: '#jug',
    can: (p, w) => !p.held && !w.rigged && w.coffee === 'none',
    done(game) {
      game.world.rigged = true;
      burst(game, 'sweat', 21.85, 1.2, 8, { speed: 0.9, ttl: 0.6 }); // the splash, behind the machine
      game.events.emit('coffee:rigged', {});
    },
  },
  // Once Lin's coffee has brewed, the full pot pours a cup (DESIGN.md "A thing that looks usable is usable"), power or
  // no power: pouring needs none. The cup leads nowhere: it only fills your hands.
  pour_coffee: { ...pourCoffee(), can: (p, w) => !p.held && w.coffee === 'brewed' },
  // Eating your letter (hold E, as any edible thing): paper, not food, so no 😋 but a wince, and bits of paper, not
  // crumbs. Ten minutes later it comes back up (index.js sick). Replaces the engine's eat_letter.
  eat_letter: {
    on: 'self', text: 'eat your letter', duration: EAT_TIME, hold: true, preview: 'lift', idle: true, saw: '✉️',
    can: (p, w) => p.held === 'letter' && !w.soggy, // once was enough: eat_soggy
    done(game) {
      const w = game.world;
      const p = game.player;
      playerLetsGo(game, 'eaten');
      w.eatenAt = game.clock.minute;
      burst(game, 'paper', p.x, p.y, 5, { speed: 0.8, ttl: 0.6 });
      say(game, 'player', ['😖'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('letter:eaten', {});
    },
  },
  // The soggy letter, back up to your mouth (hold E, as before): you get it as far as your lips, gag (🤢) and lower
  // it. Once was enough, and the screen says so.
  eat_soggy: {
    on: 'self', text: 'try to eat your soggy letter again', duration: 0.9, hold: true, preview: 'lift', idle: true, saw: '✉️',
    can: (p, w) => p.held === 'letter' && w.soggy,
    done(game) {
      say(game, 'player', ['🤢'], { kind: 'thought', ttl: 1.4 });
      shake(game, 0.03, 0.15);
      game.events.emit('letter:gagged', {});
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
    contraband: 'boss', // in your hand where he can see it: caught. Dropped where he can see it: he goes and gets it
    pockets: [{ say: ['😏', '✉️'], after: 0.45, ttl: 1.2 }], // well, well: someone's resignation, on his floor
    contrabandIn: 'office', // away from his desk, a white envelope in your hand is anyone's envelope
    edible: { leaves: null }, // eat your words
  },
  coffee: COFFEE_CUP,
};

const ROLES = {
  authority: { id: 'boss', offDuty: ['meeting'], helpless: [], deafIn: null },
  // On his way to the panel or the fuse box: whoever he finds at the one you threw, or in his dark office, threw it
  // (pretending doesn't help; tick clears the mark once you are clear of them).
  evidence: { by: 'boss', while: ['dark', 'blackout'], mark: 'switched', knows: 'bossKnows', icon: '🌑' },
  // His office: if he finds you in it, he shows you out (👉 you 🚪). The tray is yours only while he is out at a switch.
  private: [{ zone: 'office', owner: 'boss' }],
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
      done: { set: { officeLight: 'on' }, event: 'switch:fixed', says: [{ say: ['💡', '😠'] }] },
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

// Ten minutes after you ate it, your letter comes back up (index.js sick). Lin, 🤢, goes for the paper towels on
// the kitchen counter, and once the boss has had his look she wipes it up (the soggy wad goes in the bin with them).
// The boss comes over to see what the retching was (INSPECT): your envelope is still in the mess, he knows it, and
// you're caught.
const SICK_AFTER = 10; // game minutes
const QUEASY = 0.6; // game minutes of green face before it comes up
LURES.push(
  {
    npc: 'lin',
    when: (w) => w.sick && !w.towels && !w.wiped,
    override: 'towels',
    plan: 'towels',
    label: 'paper towels',
    spot: 'towels',
    react: { wait: 1.0, says: [{ say: ['🤢'], ttl: 2 }], event: 'lin:sees' },
    work: {
      override: 'tearing',
      minutes: 0.2,
      progress: 'towelProgress',
      start: { set: { towels: false } },
      done: { set: { towels: true }, event: 'lin:towels' },
    },
  },
  {
    npc: 'lin',
    when: (w) => w.towels && w.looked && !w.wiped, // she waits for the boss to finish looking
    override: 'mopping',
    plan: 'puddle',
    label: 'the sick',
    spot: 'puddle',
    react: { wait: 0.2 },
    work: {
      override: 'wiping',
      minutes: 0.6,
      progress: 'wipeProgress',
      pose: 'sit',
      start: { set: { wiped: false }, says: [{ say: ['🤢'], ttl: 1.4 }] },
      done: { set: { wiped: true }, event: 'lin:wipes' }, // tick takes the puddle (and the letter, if it's there) away
    },
  },
);

// The boss comes over to see what the retching was: one look at the puddle (the engine's inspection, started by tick
// setting `at`). Your envelope still in it: ✉️❌, caught (the end card: 'soggy'); fish it out first and he sees only
// sick. He comes once he is free (not while he is out at the panel), and not after he sits down to his tray (the
// gather): then he goes through his tray, finds it empty, and never sees the envelope across the floor.
const INSPECT = {
  npc: 'boss', at: Infinity, override: 'retch', plan: 'retch', label: 'the retching', look: 1.4,
  checks: [{ item: 'letter', spot: 'puddle', absent: true, icon: '✉️' }],
  pass: { set: { looked: true }, says: [{ say: ['🤢'] }] },
  fail: { set: { looked: true }, says: [{ say: ['😠'] }], then: 'caught' },
};

// Your letter comes back up: green first, then a puddle at your feet with the soggy letter in it, a noise all over the
// floor (everyone turns), the screen shakes. It lies there (world.letter 'puddle', not 'dropped', so the floor rules
// leave it) till you fish it out, Lin wipes it up or the boss sees it.
function sick(game) {
  const w = game.world;
  const p = game.player;
  if (w.eatenAt === null || w.sick || game.outcome || game.caught) return;
  const m = game.clock.minute - w.eatenAt;
  if (m >= SICK_AFTER - QUEASY && !w.queasy) {
    w.queasy = true;
    say(game, 'player', ['🤢'], { kind: 'thought', ttl: 2.5 });
    game.events.emit('player:queasy', {});
  }
  if (m < SICK_AFTER) return;
  w.sick = true;
  w.sickAt = game.loopTime;
  w.sickMin = game.clock.minute;
  w.puddle = { x: p.x - 0.7, y: p.y - 1 }; // he turns away from the desk: on the open floor behind his chair
  SPOTS.puddle = { x: Math.floor(w.puddle.x), y: Math.floor(w.puddle.y), face: 'N' };
  w.items.push({ type: 'letter', x: w.puddle.x + 0.15, y: w.puddle.y, spot: 'puddle' });
  w.letter = 'puddle';
  w.soggy = true;
  burst(game, 'sweat', w.puddle.x, w.puddle.y, 14, { speed: 1.6, ttl: 0.6 });
  shake(game, 0.1, 0.3);
  say(game, 'player', ['🤢'], { kind: 'speech', ttl: 2.5 });
  game.events.emit('player:sick', {}); // level.noises: everyone on the floor turns to it
}

// Lin has wiped it up: the puddle goes, and the soggy wad in it goes in the bin with her towels.
function wipedUp(game) {
  const w = game.world;
  if (!w.wiped || !w.puddle) return;
  w.puddle = null;
  w.items = w.items.filter((i) => i.spot !== 'puddle');
  if (w.letter === 'puddle') w.letter = 'binned';
}

// Still in the sick at 3:40: it came up after he sat down to his tray, and he never went over to look.
const gotIt = (w) => ['player', 'drawer', 'eaten', 'binned', 'puddle'].includes(w.letter);
const gone = (w) => w.letter === 'eaten' || w.letter === 'binned' || w.letter === 'puddle'; // nothing in his tray at 3:40

// Caught by his look at the puddle (INSPECT) gets the soggy end card. Once per game object (events persist across
// loops).
const listen = oncePerGame((game) => {
  game.events.on('day:end', (e) => {
    if (game.level?.id !== 'second-thoughts') return;
    const o = e?.outcome;
    if (o?.result === 'caught' && game.caught?.reason === 'inspection') o.why = 'soggy';
  });
});

// The level's own clock work, once a step (from clockFor, on the boss's turn: he is first in the cast).
const SURGE = 1.2; // s: the short runs down the wiring from the coffee machine to the fuse box
const BREW_MIN = 3; // game minutes the machine brews (with the power on)
function tick(game) {
  const w = game.world;
  listen(game);
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
  sick(game);
  wipedUp(game);
  // The boss's look at the puddle: due from the retch on (the level object is shared, so set every step, on his
  // turn, before the sim checks his mechanics: see INSPECT).
  INSPECT.at = w.sick && w.puddle ? w.sickMin : Infinity;
  if (w.sick && !w.looked && game.clock.minute >= game.level.day.gatherAt) w.looked = true; // he sat down to his tray instead
  // You threw his lights or the floor's: a mark only while you are at the panel, the fuse box or in his office
  // (ROLES.evidence).
  const p = game.player;
  const far = (spot) => Math.hypot(p.x - (SPOTS[spot].x + 0.5), p.y - (SPOTS[spot].y + 0.5)) > 2.5;
  if (p.switched && far('office_switch') && far('fuse_box') && !inOffice(p)) p.switched = false;
  // What got him up from his desk, for the route if you take it before he is back.
  const boss = game.npcs[0];
  if (boss.override === 'dark') w.bossOut = 'switch';
  if (boss.override === 'blackout') w.bossOut = w.fuseBy === 'player' ? 'breaker' : 'blackout';
  // The jug tipping into the machine's back while you pour (presentation.js draws it): how far, 0..1. Stopped by a
  // shout, you freeze with it still tipped for a moment.
  if (p.action?.type === 'rig_coffee') {
    w.pouring = Math.min(1, p.action.t / p.action.duration);
    w.pourT = game.loopTime;
  } else if (w.pouring !== null && (w.rigged || game.loopTime - w.pourT > 1.5)) w.pouring = null;
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
      say(game, 'boss', ['#tray', '😩'], { kind: 'thought', ttl: 1.6 });
      game.events.emit('boss:sigh', {});
    } else if (act === 'clock') {
      say(game, 'boss', ['⏰', '😩'], { kind: 'thought', ttl: 1.4 });
      game.events.emit('boss:checksClock', {});
    }
  }
  if (m >= CHIME && !w.chimed) {
    w.chimed = true;
    game.events.emit('boss:chime', {});
  }
  if (w.chimed && w.pullAt === null && seated && !game.outcome && !game.caught) {
    w.pullAt = m;
    say(game, 'boss', ['😩'], { kind: 'thought', ttl: 1.2 });
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
// The harmless flicker only half-dims (the tubes stutter, the room stays lit); the short dips nearly to dark.
const dip = (w, game) => Math.max(
  w.flickerAt === null ? 0 : 0.45 * flicker(game.loopTime - w.flickerAt),
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
  noises: { 'player:sick': { at: 'puddle', radius: 40, ripple: true } }, // a retch heard all over the floor
  hunts: [],
  inspections: [INSPECT],
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
      if (result === 'win') return gone(w) ? { why: 'eaten' } : null; // still in you (or binned, or never looked at in the sick): an empty tray
      return w.deskwork === 'kev' || w.deskwork === 'lin' ? { why: 'deskwork', by: w.deskwork } : null;
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
    letter: 'tray', // 'tray' | 'player' | 'dropped' | 'boss' (he picked it up) | 'drawer' | 'eaten' | 'puddle' | 'binned'
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
    rigged: false, // you poured the water jug into the vent on the back of the machine
    pouring: null, // 0..1 while you pour it (and a moment after a shout stops you)
    pourT: 0, // loop seconds you last poured
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
    eatenAt: null, // the game minute you ate it
    queasy: false, // your face went green
    sick: false, // it came back up
    sickAt: null, // loop seconds when
    sickMin: null, // and the game minute
    soggy: false, // the letter has been through you
    puddle: null, // where: { x, y } in tiles
    towels: false, // Lin has the paper towels
    looked: false, // the boss came over and looked at it (or sat down to his tray instead)
    wiped: false, // and wiped it up
    towelProgress: 0,
    wipeProgress: 0,
    unplugged: false, // Kev unplugged the smoking machine
    unplugProgress: 0,
    deskwork: null, // who had you sent to your desk with a pile of work: 'kev' | 'lin' (caught pouring) | 'boss'
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
  voices: OFFICE_VOICES,
};
