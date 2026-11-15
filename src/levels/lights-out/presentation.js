// How Lights Out looks and sounds: title card, set dressing, poses and sounds (level 1's decor.js, looks.js and
// sounds.js document the fields). The end cards are in end-scenes.js. People look as in level 1 (its looks.js,
// read-only).
import { C } from '../../render/palette.js';
import { LOOKS } from '../meeting/looks.js';

export { LOOKS };
export { END_SCENES } from './end-scenes.js';

export const TITLE = {
  mission: ["3:00 PM. Your angry resignation letter is in the boss's tray.", 'He empties it at 3:40. Get it back first.'],
  badge: ['✉️', '📥'],
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

export const DECOR = {
  chairs: [
    { spot: 'boss_desk', face: 'S', color: OXBLOOD },
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { x: 13, y: 12, face: 'N', color: MUSTARD },
    { x: 22, y: 12, face: 'N', color: TEAL },
    { x: 10, y: 3, face: 'E', color: OXBLOOD },
    { x: 12, y: 5, face: 'N', color: TEAL },
    { x: 14, y: 5, face: 'N', color: TEAL },
    { x: 15, y: 5, face: 'N', color: TEAL },
    { x: 12, y: 2, face: 'S', color: TEAL },
    { x: 14, y: 2, face: 'S', color: TEAL },
    { x: 15, y: 2, face: 'S', color: TEAL },
    { x: 24, y: 4, face: 'N', color: MUSTARD },
    { x: 26, y: 4, face: 'N', color: MUSTARD },
    { x: 25, y: 2, face: 'S', color: MUSTARD },
  ],
  windows: [
    { x0: 2, x1: 6, y: 0 },
    { x0: 10, x1: 12, y: 0 },
    { x0: 25, x1: 27, y: 0 },
  ],
  paintings: [
    { x: 10, y: 6, variant: 0 },
    { x: 25, y: 6, variant: 1 },
  ],
  clock: { x: 17, y: 6 },
  // The in-tray on his desk, your letter on top while it's there. (The switch and the fuse box: darkness.controls.)
  props: [
    { tile: 'Y', draw: 'icon', state: () => ({ icon: '📥', size: 20 }) },
    { tile: 'Y', draw: 'icon', state: (w) => ({ icon: w.letter === 'tray' ? '✉️' : '', size: 13 }) },
    { tile: 'M', draw: 'carafe', state: (w) => ({ full: w.coffee === 'tripped' && w.fuse === 'on' }) }, // brewed once the power's back
  ],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
  },
  legendAt: { x: 19.5, y: 15.5 }, // over the blank wall right of the lobby
};

// level.poses (level 1's looks.js documents it): a phone torch held up while the fuse is out, the boss feeling
// his way along the wall, Kev at the fuse box, Lin with her coffee once it has brewed.
export const POSES = {
  arms: [
    { when: (n) => n.override === 'fixing', arms: 'reach', item: '🔧', crank: true },
    { when: (n) => n.override === 'dark' || n.override === 'groping', arms: 'reach' },
    { when: (n, w) => w.fuse !== 'on', arms: 'reach', item: '📱' },
    { when: (n, w) => n.id === 'lin' && n.pose !== 'sit' && w.coffee === 'tripped', arms: 'mug', item: '☕' },
  ],
  marks: [
    { when: (n) => n.override === 'groping', angry: true },
  ],
};

export const CONES = { alert: [] };

// What it sounds like (level 1's sounds.js documents the fields; recipes in src/audio/sfx.js).
export const SOUNDS = {
  actions: {
    start: {
      take_letter: { sfx: 'rustle', spot: 'desk_side', opts: { gain: 0.6 } },
      pull_breaker: { sfx: 'rattle', spot: 'fuse_box', opts: { gain: 0.6 } },
    },
    done: {
      flip_switch: { sfx: 'clank', spot: 'office_switch' },
    },
  },
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'fuse:tripped': { sfx: 'splashZap', spot: 'coffee_machine' },
    'fuse:pulled': { sfx: 'splashZap', spot: 'fuse_box', opts: { gain: 0.7 } },
    'fuse:fixing': { sfx: 'clank', spot: 'fuse_box', opts: { soft: true } },
    'fuse:fixed': { sfx: 'fixed', spot: 'fuse_box' },
    'switch:fixed': { sfx: 'clank', spot: 'office_switch' },
    'letter:taken': { sfx: 'jingle', who: 'player', opts: { gain: 0.5 } },
    'letter:eaten': { sfx: 'munch', who: 'player' },
  },
  signs: {},
  contraband: {},
  drops: { letter: 'soft' },
  repeats: {
    fixing: { while: (world) => world.fixProgress > 0, every: [1.1, 2.0], sfx: 'clank', spot: 'fuse_box', opts: { soft: true, gain: 0.6 } },
  },
  murmur: { spot: 'boss_desk' },
  elevator: { spot: 'elevator', radius: 2.5 },
};

// How the cast talks (level.voices; fields: src/audio/babble.js VOICES), copied from level 1.
export const VOICES = {
  boss: {
    wave: 'sawtooth', f0: 92, spread: 0.06, decl: 0.24, syl: [0.15, 0.21], gap: [0.04, 0.07], atk: 0.02,
    fmt: 0.82, q: [7, 9], mk: 3.2, f2amp: 0.6, body: 0.22, bodyF: 520,
    vowels: ['a', 'o', 'u', 'uh', 'ae'], cons: 0.3, consF: 1700, consAmp: 0.18,
    growl: 31, post: [['lowpass', 2600, 0.7]], gain: 1.15,
    pitch: { notice: 300, tattle: 1, grumble: 220 },
  },
  lin: {
    wave: 'sawtooth', f0: 245, spread: 0.13, decl: 0.08, syl: [0.075, 0.105], gap: [0.02, 0.04], atk: 0.006,
    fmt: 1.15, q: [5, 7], mk: 2.4, f2amp: 0.75, body: 0.05, bodyF: 600,
    vowels: ['i', 'e', 'a', 'ae', 'o'], cons: 0.6, consF: 5200, consAmp: 0.22,
    gain: 0.8,
    pitch: { notice: 620, tattle: 1.12, grumble: 260 },
  },
  kev: {
    wave: 'square', f0: 148, spread: 0.04, decl: 0.06, syl: [0.12, 0.16], gap: [0.008, 0.02], atk: 0.025,
    fmt: 0.95, q: [5, 6], mk: 2.0, f2amp: 0.5, body: 0.06, bodyF: 450,
    vowels: ['uh', 'u', 'o', 'oe', 'e'], cons: 0.15, consF: 2600, consAmp: 0.12,
    post: [['peaking', 1150, 3, 9], ['lowpass', 1700, 0.8]], gain: 0.55,
    pitch: { notice: 440, tattle: 0.84, grumble: 190 },
  },
};
