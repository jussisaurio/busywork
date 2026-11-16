// Discreet Packaging. Mum has sent a parcel to your office: a pink box covered in
// red hearts, your face on the label. It waits on the parcel shelf in the back office, stacked on Bob's
// own parcel (a plain brown box, his face on it: he gets one every day). At 3:50 Lin goes to collect the mail, and at
// 4:00 she hands it out in your office, in front of everyone; each box goes to the face on its label.
// Bob, the office manager, sits at the counter with his back to the pigeonholes, facing the lobby. He doesn't need to turn round: the
// camera on the wall sweeps the back office, and he watches its monitor.
//
// Lesson: you can be seen from somewhere else. The camera (src/sim/mechanics/camera.js) counts as Bob's eyes while
// he watches the screen. Pull the camera's plug and its picture goes to static: Bob walks over to the camera, gives
// it a whack, then follows the cable to the power strip. Poke the camera with the broom (while it sweeps the other
// way) and it swivels into the potted plant for the rest of the day: the monitor shows one giant leaf. Bob grumbles,
// goes to tug it free, can't shift it (it is up high and jammed), and leaves it for facilities tomorrow.
//
// The parcel never has to reach your drawer: anywhere nobody looks will do. You lose only when someone ends up with
// it (Lin hands it out with your face on it, or someone finds it on the floor and reads the label: fetch.js) or sees
// you take it or carry it. Or swap the two boxes' labels: Lin hands Bob the pink box, and you the brown one.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { deg } from '../../config.js';
import { say, burst, shake } from '../../core/fx.js';
import { npcTakes } from '../../sim/npcs.js';
import { CAST, BEHAVIOURS, START, t as at } from './cast.js';
import { DECOR, LOOKS, POSES, TITLE, END_SCENES, VOICES, SOUNDS, CONES } from './presentation.js';
import { parcelThing, broomThing } from './painters.js';
import harness from './harness.js';
import gate from './gate.js';

// 30 x 17. Your office (west), the corridor (north), the back office behind the counter (middle), the store room
// (east), the lobby (south). Bob sits behind the counter facing the lobby, his monitor on the counter.
//   P your desk (R its drawer end)   Q/S the pigeonholes, S the parcel shelf (your parcel)   C the camera, on the wall over the back office
//   F the potted plant in the corner beside it   O the power strip with the camera's plug    M Bob's monitor
//   B the broom   E the lobby's glass front door
const MAP = [
  '##############################', // 0
  '#H..........#................#', // 1
  '#...........D................#', // 2
  '#..TPR......#................#', // 3
  '#...........#####D#C#####D####', // 4
  '#...........#.......F#......B#', // 5
  '#......TTT..#........#.......#', // 6
  '#...........#Q.......#.......#', // 7
  '#...........#S.......#.......#', // 8
  '#..........H#.......O#......H#', // 9
  '######D######TTTMTTT#####D####', // 10
  '#............................#', // 11
  '#............................#', // 12
  '#............................#', // 13
  '#............................#', // 14
  '#H..........................H#', // 15
  '###EEE########################', // 16
];

const LEGEND = {
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  R: { kind: 'drawer', solid: true, opaque: false, interactable: 'drawer', draw: 'desk' }, // your desk's drawer end
  Q: { kind: 'pigeonholes', solid: true, opaque: false, draw: 'floor' }, // the cabinet's top half (painters.js)
  S: { kind: 'pigeonholes', solid: true, opaque: false, interactable: 'pigeonholes', draw: 'floor' }, // its parcel shelf
  C: { kind: 'wall_camera', solid: true, opaque: true, interactable: 'cctv', draw: 'wall' }, // the camera on its bracket
  F: { kind: 'plant', solid: true, opaque: true, draw: 'plant' }, // tall and leafy: the camera can't see past it
  O: { kind: 'socket', solid: true, opaque: false, interactable: 'socket' },
  M: { kind: 'monitor', solid: true, opaque: false, draw: 'desk' }, // the monitor prop on the counter
  B: { kind: 'broom_stand', solid: true, opaque: false, interactable: 'broom_stand' },
  E: { kind: 'entrance', solid: true, opaque: false },
};

const SPOTS = {
  player_desk: { x: 4, y: 4, face: 'N' }, // your seat; you start here
  lin_desk: { x: 8, y: 5, face: 'S' },
  bob_desk: { x: 16, y: 9, face: 'S' }, // behind the counter, his monitor in front of him, the lobby beyond
  pigeonholes: { x: 14, y: 8, face: 'W' }, // where Lin collects the mail
  camera: { x: 19, y: 5, face: 'N' }, // right under the camera: Bob whacks it from here, you poke it from here
  socket: { x: 20, y: 8, face: 'S' }, // Bob plugs the camera back in from here
  corridor: { x: 16, y: 2, face: 'S' },
  mailroom: { x: 25, y: 7, face: 'E' },
  lobby: { x: 9, y: 13, face: 'N' },
  mail_call: { x: 7, y: 4, face: 'W' }, // 4:00: Lin hands out the mail here, facing your desk
  bob_mail: { x: 10, y: 4, face: 'W' }, // and Bob stands beside her for it
};

const ZONES = {
  office: { x0: 1, y0: 1, x1: 12, y1: 10 }, // the mail call: where you should be at 4:00, like nothing happened
  back_office: { x0: 13, y0: 5, x1: 21, y1: 10 },
  mailroom: { x0: 22, y0: 5, x1: 29, y1: 10 },
  corridor: { x0: 13, y0: 1, x1: 29, y1: 4 },
  lobby: { x0: 1, y0: 11, x1: 29, y1: 16 },
};

// The camera on the back office's north wall, by the door. It sweeps the room (the pigeonholes are always on it);
// Bob sees what it sees while he sits at his monitor. The spot under it is on it at one end of each sweep; the
// power strip never is. Poked with the broom, it swivels into the plant beside it and stays there.
const CAMERAS = [
  {
    id: 'back_office_cam',
    x: 19.5, y: 5.05, // the lens, just under the wall
    dir: deg(143), fov: deg(70), radius: 9,
    // Half a period on: its plant end comes at 3:21.5, while Bob is still watching the screen, smiling at the fronds.
    sweep: { arc: deg(64), period: 10, phase: 0.5 },
    aim: (w) => (w.camAim === 'plant' ? deg(15) : null), // stuck staring point-blank at the plant
    live: (w) => w.plug === 'in',
    monitor: { x: 16.5, y: 10.5 },
    npcs: ['bob'],
  },
];

const blind = (game, how) => {
  game.events.emit(`camera:${how}`, {});
  game.events.emit('camera:blind', { how });
};

const INTERACTIONS = {
  unplug: {
    on: 'socket', text: "pull the camera's plug out of the power strip", duration: 0.8, sneaky: true, saw: '🔌',
    can: (p, w) => w.plug === 'in',
    done(game, a) {
      game.world.plug = 'out';
      burst(game, 'sparks', a.x, a.y, 8, { speed: 1.2, ttl: 0.5 });
      say(game, 'player', ['🎵'], { kind: 'thought', ttl: 1.2 });
      blind(game, 'unplugged');
    },
  },
  push_camera: {
    on: 'cctv', text: 'poke the camera with the broom', duration: 1.0, sneaky: true, saw: '📹',
    // From the back office only: it hangs on that side of the wall, not the corridor's.
    can: (p, w) => p.held === 'broom' && w.camAim !== 'plant' && p.y > 5,
    done(game) {
      game.world.camAim = 'plant'; // clunk: it swivels into the plant and sticks; the broom comes back down with you
      burst(game, 'puff', 20.4, 5.2, 7, { speed: 0.9, ttl: 0.6 }); // the fronds shake where it hit
      burst(game, 'crumbs', 20.4, 5.1, 6, { speed: 1.1, ttl: 0.7 });
      shake(game, 0.06, 0.15);
      blind(game, 'pushed'); // Bob sees the leaf on his screen and goes to sort it out (LURES: he can't)
    },
  },
  take_broom: {
    on: 'broom_stand', text: 'take the broom', duration: 0.4, sneaky: false,
    can: (p, w) => !p.held && w.broom === 'stand',
    done(game) {
      game.player.held = 'broom';
      game.world.broom = 'player';
      game.events.emit('broom:taken', {});
    },
  },
  return_broom: {
    on: 'broom_stand', text: 'put the broom back', duration: 0.4, sneaky: false,
    can: (p, w) => p.held === 'broom',
    done(game) {
      game.player.held = null;
      game.world.broom = 'stand';
      game.events.emit('broom:returned', {});
    },
  },
  take_parcel: {
    on: 'pigeonholes', text: 'take your parcel', duration: 1.0, sneaky: true, saw: '💝',
    can: (p, w) => !p.held && w.parcel === 'shelf' && w.parcelFor === 'player',
    done(game) {
      game.player.held = 'parcel';
      game.world.parcel = 'player';
      game.events.emit('parcel:taken', {});
    },
  },
  // Holding your box at the shelf, peel your label off it and Bob's off his, and swap them: now the pink box is his.
  swap_labels: {
    on: 'pigeonholes', text: "swap your box's label with Bob's", duration: 1.5, sneaky: true, saw: '💝',
    can: (p, w) => p.held === 'parcel' && w.brown === 'shelf' && w.parcelFor === 'player',
    done(game, a) {
      const w = game.world;
      w.parcelFor = 'bob';
      w.parcel = 'shelf';
      game.player.held = null;
      burst(game, 'puff', a.x, a.y, 6, { speed: 0.8, ttl: 0.45 });
      game.events.emit('parcel:swapped', {});
    },
  },
  stash_parcel: {
    on: 'drawer', text: 'stuff it in your desk drawer', duration: 1.0, sneaky: true, saw: '💝',
    can: (p) => p.held === 'parcel',
    done(game, a) {
      game.player.held = null;
      game.world.parcel = 'drawer';
      burst(game, 'puff', a.x, a.y, 5, { speed: 0.7, ttl: 0.4 }); // slam
      shake(game, 0.04, 0.12);
      game.events.emit('parcel:stashed', {});
    },
  },
};

// The parcel: Bob's business if he sees you with it (contraband: caught). Lin's if she does, but only as the post's
// keeper who knows a pink heart box when she sees one: she doesn't take your own parcel off you, she exclaims over
// it out loud ("Ooh, hearts! From your mum?"), and that's the whole office looking at you. Too big to hide behind a
// folder. It has no `place`: world.parcel stays 'player' wherever you drop it, and nothing tidies it away.
const ITEMS = {
  parcel: {
    icon: '💝',
    draw: parcelThing,
    contraband: 'bob',
    bulky: true,
    owner: {
      id: 'lin',
      when: (npc) => !npc._fetch, // once is enough: the clock to the catch is running
      says: [{ say: ['💝', '😍'] }, { say: ['@player', '💝', '❓'], after: 0.8 }],
      // Only ever runs with the box in your arms here: the level fetch replaces the engine's floor pickup, and you
      // have no put spots. The engine has just emptied your hands; the box stays in them while she exclaims.
      reclaim(game, npc) {
        game.player.held = 'parcel'; // the engine's owner takes it back; Lin only stares at it in your arms
        game.world.parcel = 'spotted';
        game.world.spotT = game.loopTime; // her clasped hands (presentation.js POSES)
        npc._fetch = { t: game.loopTime }; // fetch.js: the clock to the catch, as if she had found it
        game.events.emit('parcel:spotted_on_you', { by: npc.id });
      },
    },
  },
  broom: { icon: '🧹', draw: broomThing, place: 'broom', bulky: true }, // both hands on it: no pretending to work
};

const ROLES = {
  authority: { id: 'bob', offDuty: ['mail'], helpless: [], deafIn: null }, // at the mail call he's just Bob
};

// Whoever sees the pink box lying loose walks over, picks it up and reads the label (src/sim/mechanics/fetch.js).
const FETCHES = [
  {
    item: 'parcel',
    npcs: ['bob', 'lin'],
    override: 'fetching',
    plan: 'parcel',
    label: 'the parcel',
    react: { wait: 0.5, says: [{ say: ['💝', '❗'], kind: 'thought' }], event: 'parcel:spotted' },
    found: {
      set: { parcel: 'found' },
      says: [{ say: ['💝', '@player'], kind: 'thought' }, { say: ['@player', '❗'], after: 0.8 }],
      event: 'parcel:found',
    },
    caught: 1.5,
    alert: ['💝', '@player', '❗'], // her box is yours: holding it up, no pointing off at some empty tile
  },
];

// Static on the monitor: Bob goes to look at the camera (it's always the camera), gives it a whack, then follows
// the cable to the power strip and plugs it back in.
const LURES = [
  {
    npc: 'bob',
    when: (w) => w.plug === 'out' && !w.camChecked,
    override: 'checking',
    plan: 'camera',
    label: 'static',
    spot: 'camera',
    react: { wait: 0.6, says: [{ say: ['#static', '❓'], kind: 'thought' }], event: 'bob:static' },
    work: {
      override: 'whacking',
      minutes: 2,
      progress: 'whackProgress',
      start: { event: 'bob:whacking' },
      done: { set: { camChecked: true }, event: 'bob:checked', says: [{ say: ['📹', '❓'], kind: 'thought' }] },
    },
  },
  // A leaf filling his screen: he grumbles, walks over and tugs at the camera, but it's jammed in the plant up there
  // and won't shift. He gives up and leaves it for facilities (tomorrow), and goes back to his counter. Once.
  {
    npc: 'bob',
    when: (w) => w.camAim === 'plant' && w.plug === 'in' && !w.camReported,
    override: 'grumbling',
    plan: 'camera',
    label: 'the leaf',
    spot: 'camera',
    react: { wait: 1.0, says: [{ say: ['#leafscreen', '😠'], kind: 'thought' }], event: 'bob:leaf' },
    work: {
      override: 'tugging',
      minutes: 1,
      progress: 'tugProgress',
      start: { event: 'bob:tugging' },
      done: {
        set: { camReported: true },
        event: 'bob:gave_up',
        says: [{ say: ['📹', '😤'], kind: 'thought' }, { say: ['🔧', '🤷'], after: 1.2 }],
      },
    },
  },
  {
    npc: 'bob',
    when: (w) => w.plug === 'out' && w.camChecked,
    override: 'tracing',
    plan: 'socket',
    label: 'the plug',
    spot: 'socket',
    react: { wait: 0.3, says: [{ say: ['🔌', '❗'], kind: 'thought' }], event: 'bob:tracing' },
    work: {
      override: 'plugging',
      minutes: 0.5,
      progress: 'plugProgress',
      done: { set: { plug: 'in', camChecked: false }, event: 'camera:replugged', says: [{ say: ['😊'] }] },
    },
  },
];

// At 4:00 the mail goes round. Anyone with the parcel in hand, or on the way to it, has found it: fail. Otherwise:
//   no route, there:       Lin holds up your parcel and everyone looks at you ('mail')
//   no route, not there:   she holds it up over your empty chair ('noshow')
//   a route, not there:    still a win: nothing is missing that anyone knew about, so nobody wonders where you are
//                          (swapped: Bob has his pink box and a dull brown one waits for you; hidden: nothing for you)
function verdict(game, { routes, present }) {
  const w = game.world;
  const fetching = game.npcs.some((n) => n.override === 'fetching' || n._fetch);
  if (fetching || w.parcel === 'found' || w.parcel === 'spotted') return { result: 'fail', why: 'found' };
  if (!routes.length && present) return { why: 'mail', stare: { at: 'player', think: ['💝'], say: ['@player', '❗'] } };
  if (!routes.length) return { result: 'blamed', why: 'noshow', stare: { think: ['🪑', '❓'], say: ['💝', '@player'] } };
  if (present) return null;
  return { result: 'win', why: 'away' };
}

export default {
  id: 'discreet-packaging',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START,
    gatherAt: at('3:56'), // Lin (at the pigeonholes since about 3:54) and Bob go to the mail call
    meetingAt: at('4:00'), // and she hands it out
    clockRedAt: at('3:50'),
    clockTickAt: at('3:50'),
    tockAt: at('3:58'),
    halfMinuteAt: at('3:59'),
  },
  interactions: INTERACTIONS,
  items: ITEMS,
  roles: ROLES,
  lures: LURES,
  hunts: [],
  doors: [],
  fetches: FETCHES,
  cameras: CAMERAS,
  behaviours: BEHAVIOURS,
  meeting: { override: 'mail', room: 'office', chair: 'player_desk', verdict },
  routes: [
    // At the mail call Lin hands Bob the pink box with his face on it (and you his brown one).
    { id: 'bob', icon: '@bob', achieved: (w) => w.parcelFor === 'bob' && ['shelf', 'lin', 'bob'].includes(w.parcel) },
    // The shelf is empty and nobody has your parcel: Lin has nothing for you, and shrugs.
    { id: 'hidden', icon: '@lin', achieved: (w) => w.parcel === 'drawer' || w.parcel === 'player' },
  ],
  outcomeOrder: ['bob', 'hidden'],
  initialWorld: () => ({
    parcel: 'shelf', // 'shelf' | 'player' (held, or dropped somewhere) | 'drawer' | 'lin' (she collected it)
    //                  | 'bob' (she handed it to him) | 'found' (someone picked it up off the floor)
    //                  | 'spotted' (in your arms, and Lin saw it: still yours, but everyone knows)
    parcelFor: 'player', // whose face is on the label: 'player' | 'bob'
    plug: 'in', // the camera's plug: 'in' | 'out'
    camChecked: false, // Bob has given the camera its whack (and goes for the plug next)
    whackProgress: 0,
    tugProgress: 0,
    plugProgress: 0,
    camReported: false, // Bob has tried the camera in the plant, given up, and left it for facilities tomorrow
    camAim: 'room', // 'room' (sweeping) | 'plant' (poked round into the plant)
    broom: 'stand', // 'stand' | 'player' | 'dropped'
    brown: 'shelf', // Bob's brown box: 'shelf' | 'lin' (collected) | 'bob' (handed to whoever's face is on it)
    mailEmpty: false, // Lin found no pink box on the parcel shelf
    spotT: null, // when Lin saw the parcel in your arms (loopTime)
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
