// "The Layoff List": the same office as level 1, an hour later. At 3:45 the boss emails HR the layoff list, and you
// are on it: a row of faces on his screen, yours framed in red (list.js). Get your name off it.
//
// Nobody lets you at his computer as yourself. But clothes are who you are, to people who don't know better
// (src/play/disguise.js):
//   - 3:00: his computer acts up (static), he waves Kev over, and Kev fixes it (🔧) while he stands aside and
//     watches. Kev is the one person allowed at that computer. Back at his desk, hot (🥵), Kev hangs his hoodie
//     over his chair. At 3:19, while the boss is in the restroom (so the boss doesn't know), Kev picks up his bag,
//     waves goodbye to Lin (👋🏠, so she knows) and goes home, the hoodie left on his chair. At 3:35 the computer
//     acts up again and the boss waves for Kev, who isn't there. In the hoodie, the boss sees Kev (🙂 + his face),
//     and while it acts up (to 3:37.5) "Kev" may offer to fix it (🙋🔧): he steps aside and watches, as he did at
//     3:00. Lin sees through it (Kev's face, ❓, then ❗👉), so go while she's in the restroom (3:32 to 3:40).
//     And put the hoodie back on Kev's chair: whoever sits at your desk in it at 3:45 is Kev to the boss, so your
//     chair is empty (verdict below). But not while he watches: Kev's hoodie coming off you tells him who "Kev"
//     was (unmask below).
//   - The boss's suit jacket hangs on his coat rack. In it, Lin sees the boss at his own computer while he's in
//     the restroom (3:12). He knows his own jacket, and she sees through it if she sees you put it on, so put it
//     on while she glances away.
// Then be at your desk at 3:45: if your chair is empty when he looks up to send it, he puts you back on.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at, PICK_UP_TIME, GAME_MIN_PER_SEC } from '../../config.js';
import { say, sightline, shake } from '../../core/fx.js';
import { npcSees, findNpc } from '../../game/perception.js';
import { C } from '../../render/palette.js';
import { CAST, BEHAVIOURS, START } from './cast.js';
import { TITLE, DECOR, LOOKS, POSES, END_SCENES, VOICES, SOUNDS } from './presentation.js';
import { hoodie, jacket } from './painters.js';
import harness from './harness.js';
import gate from './gate.js';

// Level 1's floor (src/levels/meeting/map.js), with the boss's computer Q on his desk and no projector.
//  Boss office (glass S/E walls)  | Meeting room                    | Kitchen
//  ------------------------------ hallway (row 7) --------------------------------------------
//  Open plan: Lin's desk (x3-5, row 8) with Kev's behind it (row 11, V), your desk P (x12-14)
//  Glass wall + entrance L (row 13) | lobby (outside) + elevator E   | restroom door R
const MAP = [
  '##############################', // 0
  '#K......G..........#TTCT.....#', // 1
  '#.......G..........#.........#', // 2
  '#..TQT..G..TTJTTT..#....TTT..#', // 3
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG..........#.........#', // 5
  '#GGGGGDGG#####D#######DD######', // 6
  '#............................#', // 7
  '#..TTT......TPT......TTT.....#', // 8
  '#............................#', // 9
  '#............................#', // 10
  '#..TVT......TTT......TTT.....#', // 11
  '#...........................H#', // 12
  '#GGGLGGGGG###############R####', // 13
  '#:::::::::####################', // 14
  '#:::::::::####################', // 15
  '##EE##########################', // 16
];

const LEGEND = {
  K: { kind: 'coat_rack', solid: true, opaque: false, interactable: 'coat_rack' }, // the boss's jacket hangs here
  Q: { kind: 'boss_pc', solid: true, opaque: false, interactable: 'boss_pc', draw: 'desk' }, // his computer
  C: { kind: 'coffee_machine', solid: true, opaque: false },
  J: { kind: 'meeting_table', solid: true, opaque: false },
  V: { kind: 'kev_desk', solid: true, opaque: false, interactable: 'kev_hoodie', draw: 'desk' }, // Kev's: his hoodie ends up on his chair
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  L: { kind: 'entrance', solid: true, opaque: false, npcPassable: true },
  R: { kind: 'restroom', solid: true, opaque: true },
  E: { kind: 'elevator', solid: true, opaque: true },
};

const SPOTS = {
  player_desk: { x: 13, y: 9, face: 'N' }, // your seat; you start here
  boss_desk: { x: 4, y: 2, face: 'S' }, // at his computer, watching the floor through the glass
  lin_desk: { x: 4, y: 9, face: 'N' }, // facing the boss's office: she sees his screen through the glass
  kev_desk: { x: 4, y: 12, face: 'N' }, // behind Lin, by the entrance: his hoodie ends up on this chair
  coat_rack: { x: 2, y: 1, face: 'W' },
  boss_aside: { x: 6, y: 3, face: 'W' }, // where the boss stands to watch Kev fix his computer
  pc_front: { x: 4, y: 4, face: 'N' }, // in front of his desk: where Kev types (and where you stand at 3:45 if you fail)
  kev_bye: { x: 5, y: 7, face: 'S' }, // in front of Lin's desk: Kev waves goodbye
  boss_door: { x: 6, y: 7, face: 'S' },
  door_in: { x: 4, y: 12, face: 'S' },
  elevator: { x: 2, y: 15, face: 'S' }, // Kev goes home here
  restroom: { x: 25, y: 12, face: 'S' },
  kitchen_table: { x: 25, y: 4, face: 'N' },
};

const ZONES = {
  desk: { x0: 11, y0: 9, x1: 16, y1: 11 }, // at your desk at 3:45, like nothing happened
  outside: { x0: 0, y0: 14, x1: 30, y1: 17 },
};

// Who you were when you took your name off (who the people watching took you for).
const AS = { hoodie: 'kev', jacket: 'boss' };

const INTERACTIONS = {
  // His hoodie, left on his chair (presentation.js draws it there): on, and back off onto the chair.
  take_hoodie: { // once Kev is up and away from his chair (cast.js grabBag)
    on: 'kev_hoodie', text: "put on Kev's hoodie", duration: PICK_UP_TIME, sneaky: false,
    can: (p, w) => !p.held && w.hoodie === 'chair' && w.kevUp,
    done(game) {
      game.player.held = 'hoodie';
      game.world.hoodie = 'player';
      game.events.emit('hoodie:taken', {});
    },
  },
  leave_hoodie: {
    on: 'kev_hoodie', text: 'leave his hoodie on his chair', instant: true,
    can: (p) => p.held === 'hoodie',
    done(game) {
      const p = game.player;
      const w = game.world;
      p.held = null;
      w.hoodie = 'chair';
      game.events.emit('hoodie:left', {});
      // "Kev" took your name off. If the boss watches Kev's hoodie come off you, he knows who it was.
      const boss = findNpc(game, 'boss');
      if (w.list === 'off' && w.offAs === 'kev' && boss && npcSees(game, boss, p.x, p.y)) unmask(game, boss);
    },
  },
  take_jacket: {
    on: 'coat_rack', text: "put on the boss's jacket", duration: 0.4, sneaky: false,
    can: (p, w) => !p.held && w.jacket === 'rack',
    done(game) {
      game.player.held = 'jacket';
      game.world.jacket = 'player';
      game.events.emit('jacket:taken', {});
    },
  },
  hang_jacket: {
    on: 'coat_rack', text: 'hang his jacket back up', instant: true,
    can: (p) => p.held === 'jacket',
    done(game) {
      game.player.held = null;
      game.world.jacket = 'rack';
      game.events.emit('jacket:hung', {});
    },
  },
  fix_pc: { // only Kev may touch the boss's computer, and only while it acts up (3:35 to 3:37.5: cast.js actsUp)
    on: 'boss_pc', text: 'offer to fix his computer', instant: true,
    can: (p, w) => p.held === 'hoodie' && w.pc === 'boss' && w.fix === 'none' && w.glitch,
    done(game, a) {
      game.world.fix = 'asked';
      const b = game.npcs.find((n) => n.id === 'boss');
      if (b) b._sayQ.length = 0; // "Kev" came: no more waving for him, no "where's Kev?"
      say(game, 'player', ['🙋', '🔧'], { ttl: 1.5 }); // me: I'll fix it (Kev's 🔧 at 3:04)
      game.events.emit('pc:asked', { x: a.x, y: a.y });
    },
  },
  strike_name: {
    on: 'boss_pc', text: 'take your name off the list', duration: 3.0, sneaky: true, saw: '🖥️', // longer than any glance away; saw: what a late tattle says she saw you at
    can: (p, w) => w.list === 'on' && w.pc === 'free' && w.unmaskedAt == null, // once he knows, he won't send it without you
    done(game, a) {
      const w = game.world;
      const as = AS[game.player.held] ?? 'you';
      w.list = 'off';
      w.listOffAt = game.clock.minute; // your face drops off his screen (list.js)
      w.offAs = as;
      if (w.fix === 'asked') { // "Kev" is done: the boss thanks him and takes his chair back
        w.fix = 'done';
        w.pc = 'boss';
        say(game, 'boss', ['😊', '@kev'], { voice: 'boss', ttl: 2.5 }); // thanks, Kev
      }
      game.events.emit('list:edited', { as, x: a.x, y: a.y });
    },
  },
};

// The boss saw "Kev" turn into you, after "Kev" had been at his computer: he catches it as he catches anything
// (❗😠, his sightline on you, the shake: play/rules.js caught), and a beat later your face is back on his list
// (list.js pops it out). The day goes on, but at 3:45 it goes out with you on it (verdict: blamed, why 'seen').
const BACK_AFTER = 1.2; // seconds from his ❗ to your face back on the list
function unmask(game, boss) {
  const w = game.world;
  w.list = 'on';
  w.unmaskedAt = game.clock.minute;
  w.listBackAt = game.clock.minute + BACK_AFTER * GAME_MIN_PER_SEC;
  boss._sayQ.length = 0;
  game.clock.ff = false;
  say(game, 'boss', ['❗', '😠'], { kind: 'alert', voice: 'boss' });
  sightline(game, 'boss', 'caught', 1.6);
  shake(game, 0.3, 0.4);
  game.events.emit('boss:unmasked', {});
}

// Both are worn, never carried, and come off only where they came from (keep: no drop, so neither ever lies on the
// floor; play/interactions.js): the hoodie back on Kev's chair, the jacket back on the rack.
const ITEMS = {
  hoodie: {
    icon: '🧥',
    draw: hoodie,
    keep: true,
    // Kev's olive hoodie, hood up: Kev, to anyone who didn't see him go home.
    disguise: {
      as: 'kev',
      look: { body: C.olive, bodyDark: C.oliveDark, torso: 'hoodie', hood: true, hoodColor: C.oliveDark, hair: C.olive, hairStyle: 'cap' },
      greet: [{ say: ['🙂', '@kev'] }], // oh, Kev (a face and a wave is the boss calling him over: cast.js)
    },
  },
  jacket: {
    icon: '👔',
    draw: jacket,
    keep: true,
    disguise: {
      as: 'boss',
      look: { body: C.navy, bodyDark: C.navyDark, torso: 'suit', shirt: '#d7e4ee', shirtDark: '#a9bccb', tie: '#9c2a22' },
      greet: [{ say: ['😳', '@boss'] }], // eek, the boss
    },
  },
};

// 3:45, and you're at your desk: in Kev's hoodie you're Kev to the boss, so your chair is empty to him (the hood,
// not you, is in it): he wonders what Kev is doing there, asks where you are, and puts you back on (blamed, why
// 'kev': end-scenes.js). Hang it back on Kev's chair first, as the jacket goes back on its rack.
// And if he saw the hoodie come off you after "Kev" was at his computer (unmask above), it goes out with you on it,
// wherever you are (blamed, why 'seen').
function verdict(game, { result, present }) {
  if (game.world.unmaskedAt != null) return { result: 'blamed', why: 'seen', stare: { at: 'player', think: ['@kev', '❗'], say: ['😠', '👉', '@player'] } };
  if (result !== 'win' || !present || game.player.held !== 'hoodie') return null;
  return { result: 'blamed', why: 'kev', stare: { at: 'player', think: ['@kev', '❓'], say: ['@player', '❓'] } };
}

const ROLES = {
  authority: { id: 'boss', offDuty: [], helpless: [], deafIn: null },
};

const LURES = [
  { // "Kev" offers to fix his computer: the boss gets up and watches him do it, for a few minutes.
    npc: 'boss',
    when: (w) => w.fix === 'asked',
    override: 'stepAside',
    plan: 'aside',
    label: 'let Kev fix it',
    spot: 'boss_aside',
    react: { wait: 0.4, says: [{ say: ['😊', '🖥️'] }], event: 'boss:stepsAside' },
    work: {
      override: 'watching',
      minutes: 4,
      progress: 'fixProgress',
      start: { set: { pc: 'free', glitch: false }, event: 'pc:free' }, // "Kev" at it: it works again
      done: { set: { pc: 'boss', fix: 'done' }, event: 'boss:impatient', says: [{ say: ['😠'] }] },
    },
  },
];

export default {
  id: 'layoffs',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START, // 3:00 PM; at() times count from it
    gatherAt: at('3:42', START), // the boss sits down to send it
    meetingAt: at('3:45', START), // he sends it to HR
    clockRedAt: at('3:40', START),
    clockTickAt: at('3:40', START),
    tockAt: at('3:43', START),
    halfMinuteAt: at('3:44', START),
  },
  interactions: INTERACTIONS,
  items: ITEMS,
  roles: ROLES,
  lures: LURES,
  hunts: [],
  doors: [],
  behaviours: BEHAVIOURS,
  meeting: { override: 'send', room: 'desk', chair: 'player_desk', presenter: 'pc_front', verdict }, // fail: called in as it goes
  routes: [
    { id: 'hoodie', icon: '@kev', achieved: (w) => w.list === 'off' && w.offAs === 'kev' },
    { id: 'jacket', icon: '@boss', achieved: (w) => w.list === 'off' && w.offAs !== 'kev' }, // also a plain edit: the gate flags one
  ],
  outcomeOrder: ['hoodie', 'jacket'],
  initialWorld: () => ({
    list: 'on', // your name on the layoff list: 'on' | 'off'
    listUpAt: null, // the game minute the list came up on his screen, once Kev fixed it (list.js pops it out)
    listOffAt: 0, // the game minute it came off (list.js animates it)
    offAs: null, // who took it off, to the people watching: 'kev' | 'boss' | 'you'
    unmaskedAt: null, // the game minute the boss saw Kev's hoodie come off you, after "Kev" took you off (unmask)
    listBackAt: null, // the game minute he puts you back on, then (list.js pops it out)
    glitch: true, // his screen is acting up (static): at 3:00 until Kev fixes it, and again at 3:35 (cast.js)
    pc: 'boss', // 'boss' (he's at it) | 'kev' (the real Kev fixing it) | 'free' (nobody at it: he's out, or watching "Kev")
    fix: 'none', // 'none' | 'asked' ("Kev" offered) | 'done'
    fixProgress: 0,
    jacket: 'rack', // the boss's jacket: 'rack' | 'player'
    hoodie: 'kev', // 'kev' (he's wearing it) | 'chair' (over his chair's back) | 'player'
    kevUp: false, // Kev has picked up his bag to go home (cast.js grabBag): his chair is free
    kevGone: false,
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
