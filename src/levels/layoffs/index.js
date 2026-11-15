// "The Layoff List": the same office as level 1, an hour later. At 3:45 the boss emails HR the layoff list, and you
// are on it: a column of faces on his screen, yours marked in red (list.js). Get your name off it.
//
// Nobody lets you at his computer as yourself. But clothes are who you are, to people who don't know better
// (src/play/disguise.js):
//   - 3:00: his computer acts up (static), he waves Kev over, and Kev types at it while he stands aside and watches.
//     Kev is the one person allowed at that computer. Kev slips out early while the boss is in the restroom (so
//     the boss doesn't know): he waves to Lin first (so she knows), then, hot, leaves his hoodie on his chair. At
//     3:35 the computer acts up again and the boss waves for Kev, who isn't there. In the hoodie, the boss sees
//     Kev (👋), and Kev may fix his computer: he steps aside and watches, as he did at 3:00. Lin sees through it
//     (🧥❓, then ❗👉), so go while she's in the restroom (3:32).
//   - The boss's suit jacket hangs on his coat rack. In it, Lin sees the boss at his own computer while he's in
//     the restroom (3:12). He knows his own jacket, and she sees through it if she sees you put it on, so put it
//     on while she glances away.
// Then be at your desk at 3:45: if your chair is empty when he looks up to send it, he puts you back on.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { say } from '../../core/fx.js';
import { C } from '../../render/palette.js';
import { CAST, BEHAVIOURS, START } from './cast.js';
import { TITLE, DECOR, LOOKS, POSES, END_SCENES, VOICES, SOUNDS } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

// Level 1's floor (src/levels/meeting/map.js), with the boss's computer Q on his desk and no projector.
//  Boss office (glass S/E walls)  | Meeting room                    | Kitchen
//  ------------------------------ hallway (row 7) --------------------------------------------
//  Open plan: Lin's desk (x3-5, row 8) with Kev's behind it (row 11), your desk P (x12-14)
//  Glass wall + entrance L (row 13) | lobby (outside) + elevator E   | restroom door R
const MAP = [
  '##############################', // 0
  '#K......G..........#FTCT.....#', // 1
  '#.......G..........#.........#', // 2
  '#..TQT..G..TTJTTT..#....TTT..#', // 3
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG..........#.........#', // 5
  '#GGGGGDGG#####D#######DD######', // 6
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
  K: { kind: 'coat_rack', solid: true, opaque: false, interactable: 'coat_rack' }, // the boss's jacket hangs here
  Q: { kind: 'boss_pc', solid: true, opaque: false, interactable: 'boss_pc', draw: 'desk' }, // his computer
  F: { kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' },
  C: { kind: 'coffee_machine', solid: true, opaque: false },
  J: { kind: 'meeting_table', solid: true, opaque: false },
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
  take_jacket: {
    on: 'coat_rack', icon: '👔', text: "put on the boss's jacket", duration: 0.4, sneaky: false,
    can: (p, w) => !p.held && w.jacket === 'rack',
    done(game) {
      game.player.held = 'jacket';
      game.world.jacket = 'player';
      game.events.emit('jacket:taken', {});
    },
  },
  hang_jacket: {
    on: 'coat_rack', icon: '👔', text: 'hang his jacket back up', instant: true,
    can: (p) => p.held === 'jacket',
    done(game) {
      game.player.held = null;
      game.world.jacket = 'rack';
      game.events.emit('jacket:hung', {});
    },
  },
  fix_pc: { // only Kev may touch the boss's computer
    on: 'boss_pc', icon: '🔧', text: 'offer to fix his computer', instant: true,
    can: (p, w) => p.held === 'hoodie' && w.pc === 'boss' && w.fix === 'none',
    done(game, a) {
      game.world.fix = 'asked';
      say(game, 'player', ['🖥️', '❓'], { ttl: 1.5 }); // "trouble with your computer?"
      game.events.emit('pc:asked', { x: a.x, y: a.y });
    },
  },
  strike_name: {
    on: 'boss_pc', icon: '🗑️', text: 'take your name off the list', duration: 3.0, sneaky: true, saw: '🖥️', // longer than any glance away
    can: (p, w) => w.list === 'on' && w.pc === 'free',
    done(game, a) {
      const w = game.world;
      const as = AS[game.player.held] ?? 'you';
      w.list = 'off';
      w.listOffAt = game.clock.minute; // your face drops off his screen (list.js)
      w.offAs = as;
      if (w.fix === 'asked') { // "Kev" is done: the boss thanks him and takes his chair back
        w.fix = 'done';
        w.pc = 'boss';
        say(game, 'boss', ['😊', '👋'], { voice: 'boss', ttl: 2.5 });
      }
      game.events.emit('list:edited', { as, x: a.x, y: a.y });
    },
  },
};

const ITEMS = {
  hoodie: {
    icon: '🧥',
    place: 'hoodie',
    // Kev's olive hoodie, hood up: Kev, to anyone who didn't see him go home.
    disguise: {
      as: 'kev',
      look: { body: C.olive, bodyDark: C.oliveDark, torso: 'hoodie', hood: true, hoodColor: C.oliveDark, hair: C.olive, hairStyle: 'cap' },
      greet: [{ say: ['👋'] }],
    },
  },
  jacket: {
    icon: '👔',
    place: 'jacket',
    disguise: {
      as: 'boss',
      look: { body: C.navy, bodyDark: C.navyDark, torso: 'suit', shirt: '#d7e4ee', shirtDark: '#a9bccb', tie: '#9c2a22' },
      greet: [{ say: ['😳', '👋'] }],
    },
  },
};

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
  meeting: { override: 'send', room: 'desk', chair: 'player_desk', presenter: 'pc_front' }, // fail: called in as it goes
  routes: [
    { id: 'hoodie', icon: '🧥', achieved: (w) => w.list === 'off' && w.offAs === 'kev' },
    { id: 'jacket', icon: '👔', achieved: (w) => w.list === 'off' && w.offAs !== 'kev' }, // also a plain edit: the gate flags one
  ],
  outcomeOrder: ['hoodie', 'jacket'],
  initialWorld: () => ({
    list: 'on', // your name on the layoff list: 'on' | 'off'
    listOffAt: 0, // the game minute it came off (list.js animates it)
    offAs: null, // who took it off, to the people watching: 'kev' | 'boss' | 'you'
    glitch: true, // his screen is acting up (static): at 3:00 until Kev fixes it, and again at 3:35 (cast.js)
    pc: 'boss', // 'boss' (he's at it) | 'kev' (the real Kev fixing it) | 'free' (nobody at it: he's out, or watching "Kev")
    fix: 'none', // 'none' | 'asked' ("Kev" offered) | 'done'
    fixProgress: 0,
    jacket: 'rack', // the boss's jacket: 'rack' | 'player' | 'dropped'
    hoodie: 'kev', // 'kev' (he's wearing it) | 'chair' | 'player' | 'dropped'
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
