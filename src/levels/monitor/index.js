// "The Monitor": your embarrassing parcel sits in the pigeonholes behind the front desk, and at 4:00 Lin collects
// the mail and hands it out in front of everyone. Guard Bob sits at the desk with his back to the pigeonholes,
// watching the lobby. He doesn't need to turn round: the camera in the corner sweeps the back office, and he
// watches its monitor. Get the parcel into your desk drawer, or stick Bob's name on it.
//
// Lesson: you can be seen from somewhere else. The camera (src/sim/mechanics/camera.js) counts as Bob's eyes while
// he watches the screen. Pull its plug and the screen turns to static: Bob walks over to the camera, gives it a
// whack, then follows the cable to the socket. Shove the camera round with the broom (while it sweeps the other
// way) and it stares at the corner for the rest of the day: Bob doesn't notice.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { deg } from '../../config.js';
import { say, burst, shake } from '../../core/fx.js';
import { CAST, BEHAVIOURS, START, t as at } from './cast.js';
import { DECOR, LOOKS, POSES, TITLE, END_SCENES, VOICES } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

// 30 x 17. Your office (west), the corridor (north), the back office behind the front desk (middle), the
// mailroom (east), the lobby (south). Bob sits behind the counter facing the lobby, his monitor on the counter.
//   P your desk   S the pigeonholes (your parcel)   C the camera, on a pole in the corner   O the monitor's socket
//   M Bob's monitor   A the label printer   B the broom   E the lobby's glass front door
const MAP = [
  '##############################', // 0
  '#H..........#................#', // 1
  '#...........D................#', // 2
  '#..TPT......#................#', // 3
  '#...........#####D#######D####', // 4
  '#...........#.......C#A.....B#', // 5
  '#......TTT..#.......H#.......#', // 6
  '#...........#........#.......#', // 7
  '#...........#S.......#.......#', // 8
  '#..........H#.......O#......H#', // 9
  '######D######TTTMTTT#####D####', // 10
  '#............................#', // 11
  '#............................#', // 12
  '#............................#', // 13
  '#............................#', // 14
  '#H..........................H#', // 15
  '###############EEE############', // 16
];

const LEGEND = {
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  S: { kind: 'pigeonholes', solid: true, opaque: false, interactable: 'pigeonholes', draw: 'desk' }, // low open shelves: the camera sees over them
  C: { kind: 'camera_pole', solid: true, opaque: false, interactable: 'camera', draw: 'coat_rack' }, // the cctv prop on top
  O: { kind: 'socket', solid: true, opaque: false, interactable: 'socket' },
  M: { kind: 'monitor', solid: true, opaque: false, draw: 'desk' }, // the monitor prop on the counter
  A: { kind: 'label_printer', solid: true, opaque: false, interactable: 'label_printer', draw: 'desk' },
  B: { kind: 'broom_stand', solid: true, opaque: false, interactable: 'broom_stand' },
  E: { kind: 'entrance', solid: true, opaque: false },
};

const SPOTS = {
  player_desk: { x: 4, y: 4, face: 'N' }, // your seat; you start here
  lin_desk: { x: 8, y: 7, face: 'N' },
  bob_desk: { x: 16, y: 9, face: 'S' }, // behind the counter, his monitor in front of him, the lobby beyond
  pigeonholes: { x: 14, y: 8, face: 'W' }, // where Lin collects the mail
  camera: { x: 19, y: 5, face: 'E' }, // Bob checks the camera from here
  socket: { x: 20, y: 8, face: 'S' }, // Bob plugs the monitor back in from here
  corridor: { x: 16, y: 2, face: 'S' },
  mailroom: { x: 25, y: 7, face: 'E' },
  lobby: { x: 9, y: 13, face: 'N' },
};

const ZONES = {
  office: { x0: 1, y0: 1, x1: 12, y1: 10 }, // where you should be at 4:00, at your desk like nothing happened
  back_office: { x0: 13, y0: 5, x1: 21, y1: 10 },
};

// The camera in the back office's north-east corner. It sweeps the room (the pigeonholes are always on it); Bob
// sees what it sees while he sits at his monitor. Its two neighbours you can reach it from are on it only part of
// each sweep: one at each end.
const CAMERAS = [
  {
    id: 'back_office_cam',
    x: 20.45, y: 5.35, // the lens, on top of the pole
    dir: deg(155.5), fov: deg(74), radius: 9,
    sweep: { arc: deg(47), period: 10 },
    aim: (w) => (w.camAim === 'wall' ? deg(-45) : null), // shoved round to stare into the corner
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
    on: 'socket', icon: '🔌', text: "pull the monitor's plug", duration: 0.8, sneaky: true, saw: '🔌',
    can: (p, w) => w.plug === 'in',
    done(game, a) {
      game.world.plug = 'out';
      burst(game, 'sparks', a.x, a.y, 8, { speed: 1.2, ttl: 0.5 });
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.2 });
      blind(game, 'unplugged');
    },
  },
  push_camera: {
    on: 'camera', icon: '🧹', text: 'shove the camera round to face the wall', duration: 1.0, sneaky: true, saw: '📹',
    can: (p, w) => p.held === 'broom' && w.camAim !== 'wall',
    done(game) {
      const w = game.world;
      w.camAim = 'wall';
      w.broom = 'camera'; // it stays up there, wedged
      game.player.held = null;
      shake(game, 0.06, 0.15);
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.2 });
      blind(game, 'pushed');
    },
  },
  take_broom: {
    on: 'broom_stand', icon: '🧹', text: 'take the broom', duration: 0.4, sneaky: false,
    can: (p, w) => !p.held && w.broom === 'stand',
    done(game) {
      game.player.held = 'broom';
      game.world.broom = 'player';
      game.events.emit('broom:taken', {});
    },
  },
  print_label: {
    on: 'label_printer', icon: '🏷️', text: "print an address label with Bob's name on it", duration: 1.0, sneaky: false,
    can: (p, w) => !p.held && w.label === 'printer',
    done(game) {
      game.player.held = 'label';
      game.world.label = 'player';
      game.events.emit('label:printed', {});
    },
  },
  relabel: {
    on: 'pigeonholes', icon: '🏷️', text: "stick Bob's label over your name", duration: 1.5, sneaky: true, saw: '🏷️',
    can: (p, w) => p.held === 'label' && w.parcel === 'shelf' && w.parcelFor === 'player',
    done(game) {
      const w = game.world;
      w.parcelFor = 'bob';
      w.label = 'parcel';
      game.player.held = null;
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.2 });
      game.events.emit('parcel:relabelled', {});
    },
  },
  take_parcel: {
    on: 'pigeonholes', icon: '📦', text: 'take your parcel', duration: 1.0, sneaky: true, saw: '📦',
    can: (p, w) => !p.held && w.parcel === 'shelf',
    done(game) {
      game.player.held = 'parcel';
      game.world.parcel = 'player';
      game.events.emit('parcel:taken', {});
    },
  },
  stash_parcel: {
    on: 'own_desk', icon: '🗄️', text: 'stuff it in your desk drawer', duration: 1.0, sneaky: true, saw: '📦',
    can: (p) => p.held === 'parcel',
    done(game) {
      game.player.held = null;
      game.world.parcel = 'drawer';
      say(game, 'player', ['😌'], { kind: 'thought', ttl: 1.2 });
      game.events.emit('parcel:stashed', {});
    },
  },
};

const ITEMS = {
  parcel: { icon: '📦', place: 'parcel' },
  broom: { icon: '🧹', place: 'broom' },
  label: { icon: '🏷️', place: 'label' },
};

const ROLES = {
  authority: { id: 'bob', offDuty: [], helpless: [], deafIn: null },
};

// Static on the monitor: Bob goes to look at the camera (it's always the camera), gives it a whack, then follows
// the cable to the socket and plugs it back in.
const LURES = [
  {
    npc: 'bob',
    when: (w) => w.plug === 'out' && !w.camChecked,
    override: 'checking',
    plan: 'camera',
    label: 'static',
    spot: 'camera',
    react: { wait: 0.6, says: [{ say: ['📺', '❓'], kind: 'thought' }], event: 'bob:static' },
    work: {
      override: 'whacking',
      minutes: 2,
      progress: 'whackProgress',
      start: { event: 'bob:whacking' },
      done: { set: { camChecked: true }, event: 'bob:checked', says: [{ say: ['🤷'], kind: 'thought' }] },
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
      done: { set: { plug: 'in', camChecked: false }, event: 'camera:replugged', says: [{ say: ['😌'] }] },
    },
  },
];

export default {
  id: 'monitor',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START,
    gatherAt: at('3:54'), // Lin goes for the mail
    meetingAt: at('4:00'), // and hands it out
    clockRedAt: at('3:54'),
    clockTickAt: at('3:54'),
    tockAt: at('3:58'),
    halfMinuteAt: at('3:59'),
  },
  interactions: INTERACTIONS,
  items: ITEMS,
  roles: ROLES,
  lures: LURES,
  hunts: [],
  doors: [],
  cameras: CAMERAS,
  behaviours: BEHAVIOURS,
  meeting: { override: 'mail', room: 'office', chair: 'player_desk', presenter: 'player_desk' },
  routes: [
    { id: 'drawer', icon: '🗄️', achieved: (w) => w.parcel === 'drawer' },
    { id: 'bob', icon: '💂', achieved: (w) => w.parcelFor === 'bob' && (w.parcel === 'shelf' || w.parcel === 'lin') },
  ],
  outcomeOrder: ['bob', 'drawer'],
  initialWorld: () => ({
    parcel: 'shelf', // 'shelf' | 'player' | 'dropped' | 'drawer' | 'lin' (she collected it)
    parcelFor: 'player', // whose name is on it
    plug: 'in', // the monitor's plug: 'in' | 'out'
    camChecked: false, // Bob has given the camera its whack (and goes for the plug next)
    whackProgress: 0,
    plugProgress: 0,
    camAim: 'room', // 'room' (sweeping) | 'wall' (shoved round)
    broom: 'stand', // 'stand' | 'player' | 'dropped' | 'camera'
    label: 'printer', // 'printer' | 'player' | 'dropped' | 'parcel'
    items: [],
  }),
  harness,
  gate,
  title: TITLE,
  decor: DECOR,
  looks: LOOKS,
  poses: POSES,
  endScenes: END_SCENES,
  voices: VOICES,
};
