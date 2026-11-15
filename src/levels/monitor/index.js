// Discreet Packaging (the level's id is still 'monitor'). Mum has sent a parcel to your office: a pink box covered in
// red hearts, your face on the label. It waits in the pigeonholes in the back office. At 3:50 Lin goes to collect
// the mail, and at 4:00 she hands it out in your office, in front of everyone (Security Bob comes over for it too).
// Bob sits at the counter with his back to the pigeonholes, facing the lobby. He doesn't need to turn round: the
// camera on the wall sweeps the back office, and he watches its monitor.
//
// Lesson: you can be seen from somewhere else. The camera (src/sim/mechanics/camera.js) counts as Bob's eyes while
// he watches the screen. Pull the monitor's plug and the screen turns to static: Bob walks over to the camera, gives
// it a whack, then follows the cable to the power strip. Poke the camera with the broom (while it sweeps the other
// way) and it swivels into the potted plant for the rest of the day: the monitor shows one giant leaf, and Bob
// watches that, content.
//
// The parcel never has to reach your drawer: anywhere nobody looks will do. You lose only when someone ends up with
// it (Lin hands it out with your face on it, or someone finds it on the floor and reads the label: fetch.js) or sees
// you take it or carry it. Stick the spare label with Bob's face over yours and Lin hands it to him instead.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { deg } from '../../config.js';
import { say, burst, shake } from '../../core/fx.js';
import { npcSayLater } from '../../sim/override.js';
import { npcTakes } from '../../sim/npcs.js';
import { CAST, BEHAVIOURS, START, t as at } from './cast.js';
import { DECOR, LOOKS, POSES, TITLE, END_SCENES, VOICES, SOUNDS, CONES } from './presentation.js';
import { parcelThing, broomThing, labelThing } from './painters.js';
import harness from './harness.js';
import gate from './gate.js';

// 30 x 17. Your office (west), the corridor (north), the back office behind the counter (middle), the mailroom
// (east), the lobby (south). Bob sits behind the counter facing the lobby, his monitor on the counter.
//   P your desk   Q/S the pigeonholes, S the parcel shelf (your parcel)   C the camera, on the wall over the back office
//   F the potted plant in the corner beside it   O the power strip with the monitor's plug   M Bob's monitor
//   A the label printer   B the broom   E the lobby's glass front door
const MAP = [
  '##############################', // 0
  '#H..........#................#', // 1
  '#...........D................#', // 2
  '#..TPT......#................#', // 3
  '#...........#####D#C#####D####', // 4
  '#...........#.......F#A.....B#', // 5
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
  Q: { kind: 'pigeonholes', solid: true, opaque: false, draw: 'floor' }, // the cabinet's top half (painters.js)
  S: { kind: 'pigeonholes', solid: true, opaque: false, interactable: 'pigeonholes', draw: 'floor' }, // its parcel shelf
  C: { kind: 'wall_camera', solid: true, opaque: true, interactable: 'cctv', draw: 'wall' }, // the camera on its bracket
  F: { kind: 'plant', solid: true, opaque: true, draw: 'plant' }, // tall and leafy: the camera can't see past it
  O: { kind: 'socket', solid: true, opaque: false, interactable: 'socket' },
  M: { kind: 'monitor', solid: true, opaque: false, draw: 'desk' }, // the monitor prop on the counter
  A: { kind: 'label_printer', solid: true, opaque: false, interactable: 'label_printer', draw: 'desk' },
  B: { kind: 'broom_stand', solid: true, opaque: false, interactable: 'broom_stand' },
  E: { kind: 'entrance', solid: true, opaque: false },
};

const SPOTS = {
  player_desk: { x: 4, y: 4, face: 'N' }, // your seat; you start here
  lin_desk: { x: 8, y: 5, face: 'S' },
  bob_desk: { x: 16, y: 9, face: 'S' }, // behind the counter, his monitor in front of him, the lobby beyond
  pigeonholes: { x: 14, y: 8, face: 'W' }, // where Lin collects the mail
  camera: { x: 19, y: 5, face: 'N' }, // right under the camera: Bob whacks it from here, you poke it from here
  socket: { x: 20, y: 8, face: 'S' }, // Bob plugs the monitor back in from here
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
    sweep: { arc: deg(64), period: 10 },
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
    on: 'socket', text: "pull the monitor's plug out of the power strip", duration: 0.8, sneaky: true, saw: '🔌',
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
      shake(game, 0.06, 0.15);
      const bob = game.npcs.find((n) => n.id === 'bob');
      if (bob) npcSayLater(bob, 1.0, ['🪴', '😊'], 'thought'); // he looks at the leaf on his screen, content
      blind(game, 'pushed');
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
  print_label: {
    on: 'label_printer', text: "take the spare address label with Bob's face on it", duration: 0.6, sneaky: false,
    can: (p, w) => !p.held && w.label === 'printer',
    done(game) {
      game.player.held = 'label';
      game.world.label = 'player';
      game.events.emit('label:printed', {});
    },
  },
  relabel: {
    on: 'pigeonholes', text: "stick Bob's label over yours", duration: 1.5, sneaky: true, saw: '💝',
    can: (p, w) => p.held === 'label' && w.parcel === 'shelf' && w.parcelFor === 'player',
    done(game) {
      const w = game.world;
      w.parcelFor = 'bob';
      w.label = 'parcel';
      game.player.held = null;
      game.events.emit('parcel:relabelled', {});
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
  stash_parcel: {
    on: 'own_desk', text: 'stuff it in your desk drawer', duration: 1.0, sneaky: true, saw: '💝',
    can: (p) => p.held === 'parcel',
    done(game) {
      game.player.held = null;
      game.world.parcel = 'drawer';
      game.events.emit('parcel:stashed', {});
    },
  },
};

// The parcel: Bob's business if he sees you with it (contraband: caught), Lin's if she does (the mail is hers to
// hand out: she takes it off you, reads the label, and that's you found out). Too big to hide behind a folder.
// It has no `place`: world.parcel stays 'player' wherever you drop it, and nothing tidies it away.
const ITEMS = {
  parcel: {
    icon: '💝',
    draw: parcelThing,
    contraband: 'bob',
    bulky: true,
    owner: {
      id: 'lin',
      says: [{ say: ['💝', '❗'], kind: 'thought' }, { say: ['@player', '❗'], after: 0.8 }],
      reclaim(game, npc) {
        npcTakes(npc, 'parcel');
        game.world.parcel = 'snatched';
        npc._fetch = { t: game.loopTime }; // fetch.js: the clock to the catch, as if she had found it
        game.events.emit('parcel:snatched', { by: npc.id });
      },
    },
  },
  broom: { icon: '🧹', draw: broomThing, place: 'broom' },
  label: { icon: '🏷️', draw: labelThing, place: 'label' },
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
      says: [{ say: ['💝', '❓'], kind: 'thought' }, { say: ['@player', '❗'], after: 0.8 }],
      event: 'parcel:found',
    },
    caught: 1.5,
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
    react: { wait: 0.6, says: [{ say: ['📺', '❓'], kind: 'thought' }], event: 'bob:static' },
    work: {
      override: 'whacking',
      minutes: 2,
      progress: 'whackProgress',
      start: { event: 'bob:whacking' },
      done: { set: { camChecked: true }, event: 'bob:checked', says: [{ say: ['📹', '❓'], kind: 'thought' }] },
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

// At 4:00 the mail goes round. Anyone with the parcel in hand, or on the way to it, has found it: fail. A route
// achieved and you at the mail call: win. Not there: blamed (they look at your empty chair). No route: Lin holds
// up your parcel and everyone looks at you.
function verdict(game, { routes }) {
  const w = game.world;
  const fetching = game.npcs.some((n) => n.override === 'fetching' || n._fetch);
  if (fetching || w.parcel === 'found' || w.parcel === 'snatched') return { result: 'fail', why: 'found' };
  if (!routes.length) return { why: 'mail', stare: { at: 'player', think: ['💝'], say: ['@player', '❗'] } };
  return null;
}

export default {
  id: 'monitor',
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
  meeting: { override: 'mail', room: 'office', chair: 'player_desk', presenter: 'player_desk', verdict },
  routes: [
    // Lin hands Bob a pink box with his face on it, at the mail call.
    { id: 'bob', icon: '@bob', achieved: (w) => w.parcelFor === 'bob' && ['shelf', 'lin', 'bob'].includes(w.parcel) },
    // The shelf is empty and nobody has your parcel: Lin shrugs.
    { id: 'hidden', icon: '@lin', achieved: (w) => w.parcel === 'drawer' || w.parcel === 'player' },
  ],
  outcomeOrder: ['bob', 'hidden'],
  initialWorld: () => ({
    parcel: 'shelf', // 'shelf' | 'player' (held, or dropped somewhere) | 'drawer' | 'lin' (she collected it)
    //                  | 'bob' (she handed it to him) | 'found' (someone picked it up off the floor)
    //                  | 'snatched' (Lin took it off you)
    parcelFor: 'player', // whose face is on the label: 'player' | 'bob'
    plug: 'in', // the monitor's plug: 'in' | 'out'
    camChecked: false, // Bob has given the camera its whack (and goes for the plug next)
    whackProgress: 0,
    plugProgress: 0,
    camAim: 'room', // 'room' (sweeping) | 'plant' (poked round into the plant)
    broom: 'stand', // 'stand' | 'player' | 'dropped'
    label: 'printer', // 'printer' | 'player' | 'dropped' | 'parcel'
    mailEmpty: false, // Lin found the parcel shelf empty
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
