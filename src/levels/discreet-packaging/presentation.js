// How Discreet Packaging looks: title card, set dressing, people and their
// poses, sounds and voices (level 1's decor.js, looks.js and sounds.js document the fields). Every object on the
// map is drawn by painters.js; the end scenes are in end-scenes.js.
import { C } from '../../render/palette.js';
import { LOOKS as L1 } from '../meeting/looks.js';
import {
  pigeonholes, pigeonholesState, monitor, monitorState, wallCamera, wallCameraState, socket, socketState,
  broomStand, broomState, drawer, drawerState, brownBoxThing, postThing, staticThing, droppedThing,
} from './painters.js';
export { END_SCENES } from './end-scenes.js';

export const TITLE = {
  mission: ['3:20 PM. Mum sent a parcel to your office: pink, covered in hearts.', "Lin hands out the mail at 4:00. Don't let anyone see it."],
  badge: ['@player', '😳'],
};

const NAVY = [C.navy, C.navyDark];
const TEAL = [C.teal, C.tealDark];
const MUSTARD = ['#d6a23a', '#a97b22'];

export const DECOR = {
  chairs: [
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'S', color: TEAL },
    { spot: 'bob_desk', face: 'S', color: NAVY }, // behind the counter, his back to the pigeonholes
  ],
  windows: [{ x0: 2, x1: 5, y: 0 }, { x0: 8, x1: 10, y: 0 }, { x0: 14, x1: 17, y: 0 }, { x0: 21, x1: 26, y: 0 }],
  paintings: [{ x: 3, y: 10, variant: 0 }, { x: 23, y: 10, variant: 1 }, { x: 23, y: 4, variant: 1 }],
  clock: { x: 6, y: 0 },
  props: [
    { tile: 'Q', draw: pigeonholes, state: pigeonholesState }, // Bob's brown box and your pink one on the shelf
    { tile: 'M', draw: monitor, state: monitorState }, // Bob's screen: the back office, one leaf, or static
    { tile: 'C', draw: wallCamera, state: wallCameraState }, // turned where it looks; askew in the plant once poked
    { tile: 'O', draw: socket, state: socketState }, // the monitor's plug in the power strip, or hanging out
    { tile: 'B', draw: broomStand, state: broomState }, // and the mailroom's cobwebs and dust
    { tile: 'P', draw: drawer, state: drawerState }, // your drawer: open only while you stuff the box in
  ],
  // '#brownbox' Bob's parcel, '#post' both boxes in Lin's arms, '#static' a snowy screen, '#dropped' a fallen box
  things: { brownbox: brownBoxThing, post: postThing, static: staticThing, dropped: droppedThing },
  deskOwners: ['lin_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
  },
  zoneSeeds: [
    { zone: 'office', x: 4, y: 2 },
    { zone: 'kitchen', x: 16, y: 7 }, // the back office: lino, strip light
    { zone: 'kitchen', x: 25, y: 7 }, // the mailroom
    { zone: 'meeting', x: 20, y: 2 }, // the corridor
    { zone: 'lobby', x: 9, y: 13 },
  ],
  legendAt: { x: 20, y: 15.5 },
};

export const LOOKS = {
  player: L1.player,
  lin: L1.lin,
  // Bob: security. Big, navy uniform, cap, moustache, a badge.
  bob: {
    body: C.navy, bodyDark: C.navyDark, torso: 'suit', shirt: '#c9d6e6', shirtDark: '#9fb0c6', tie: '#1c2639',
    skin: '#e3ad86', skinDark: '#c68e66', hair: '#1c2639', hairStyle: 'cap', mustache: true,
    legs: '#1c2232', wide: 1.2, tall: 1.06, head: 7.2, bubbleDy: 34, eyeDy: 13,
  },
};

const LIN = (n) => n.id === 'lin';
const BOB = (n) => n.id === 'bob';

export const POSES = {
  arms: [
    { when: (n) => n.override === 'whacking', arms: 'bang' }, // a thump on the side of the camera
    { when: (n) => n.override === 'plugging', arms: 'reach' }, // pushing the plug back into the power strip
    // Lin grabbing the pink box out of your hands
    { when: (n, w, game) => LIN(n) && w.snatchT != null && game.loopTime - w.snatchT < 0.9, arms: 'reach', item: '#parcel' },
    // Lin with your parcel at the mail call: up over her head for the whole office to see.
    { when: (n, w) => LIN(n) && n._atMail && w.parcel === 'lin' && w.parcelFor !== 'bob', arms: 'cheer', item: '#parcel' },
    // On the way back from the shelf: both boxes, or what was there.
    { when: (n, w) => LIN(n) && w.parcel === 'lin' && w.brown === 'lin', arms: 'carry', item: '#post' },
    { when: (n, w) => LIN(n) && w.parcel === 'lin', arms: 'carry', item: '#parcel' },
    // Labels swapped: Bob has the pink box, and she holds the brown one out to you.
    { when: (n, w) => LIN(n) && n._atMail && w.brown === 'lin' && w.parcel === 'bob', arms: 'reach', item: '#brownbox' },
    { when: (n, w) => LIN(n) && w.brown === 'lin', arms: 'carry', item: '#brownbox' },
    { when: (n, w) => BOB(n) && w.parcel === 'bob', arms: 'carry', item: '#parcel' }, // his now: he hugs it
    { when: (n, w) => BOB(n) && w.brown === 'bob', arms: 'carry', item: '#brownbox' },
    { when: (n, w) => LIN(n) && w.mailEmpty && n._atMail, arms: 'shrug' }, // nothing for you on the shelf today
  ],
  marks: [
    { when: (n) => n.id === 'bob', badge: true },
  ],
};

// Whoever has spotted your parcel lying about, and is on the way to it, flares their cone.
export const CONES = { alert: ['fetching'] };

export const SOUNDS = {
  actions: {
    start: {
      take_parcel: { sfx: 'rustle', spot: 'pigeonholes' },
      swap_labels: { sfx: 'rustle', spot: 'pigeonholes', opts: { gain: 0.5 } },
    },
  },
  events: {
    'bob:suspicious': { sfx: 'tension', who: 'bob' },
    'bob:workAssigned': { sfx: 'workAssigned' },
    'camera:unplugged': { sfx: 'key', spot: 'socket' },
    'camera:pushed': { sfx: 'bang', spot: 'camera' }, // the clunk of it swivelling into the plant
    'bob:static': { sfx: 'notice', who: 'bob' },
    'bob:whacking': { sfx: 'bang', who: 'bob' },
    'camera:replugged': { sfx: 'fixed', spot: 'socket' },
    'broom:taken': { sfx: 'rustle', who: 'player' },
    'broom:returned': { sfx: 'swish', who: 'player' },
    'parcel:swapped': { sfx: 'swish', spot: 'pigeonholes' },
    'parcel:stashed': { sfx: 'creak', spot: 'player_desk' },
    'parcel:spotted': { sfx: 'tension' },
    'parcel:found': { sfx: 'notice' },
    'parcel:snatched': { sfx: 'notice' },
    'parcel:missing': { sfx: 'crickets' },
  },
  drops: { parcel: 'soft', broom: 'card' },
};

// How the cast talks (level.voices; fields: src/audio/babble.js VOICES), by cast `voice` name.
export const VOICES = {
  // Bob: low, slow, a grunt more than a word.
  bob: {
    wave: 'triangle', f0: 98, spread: 0.06, decl: 0.1, syl: [0.13, 0.19], gap: [0.03, 0.06], atk: 0.02,
    fmt: 0.85, q: [5, 7], mk: 3.2, f2amp: 0.5, body: 0.24, bodyF: 420,
    vowels: ['o', 'u', 'uh', 'a'], cons: 0.3, consF: 2200, consAmp: 0.16, gain: 1.15,
    pitch: { notice: 180, tattle: 1.08, grumble: 80 },
  },
  // Lin: level 1's voice (src/levels/meeting/voices.js).
  lin: {
    wave: 'sawtooth', f0: 245, spread: 0.13, decl: 0.08, syl: [0.075, 0.105], gap: [0.02, 0.04], atk: 0.006,
    fmt: 1.15, q: [5, 7], mk: 2.4, f2amp: 0.75, body: 0.05, bodyF: 600,
    vowels: ['i', 'e', 'a', 'ae', 'o'], cons: 0.6, consF: 5200, consAmp: 0.22, gain: 0.8,
    pitch: { notice: 620, tattle: 1.12, grumble: 260 },
  },
};
