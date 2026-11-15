// How the audit looks and sounds: title card, set dressing, people, voices, sounds and the end card (level 1's
// decor.js, looks.js, voices.js, sounds.js and end-scenes.js document the fields). Level 1's people are imported
// read-only; the auditor is new.
import { C } from '../../render/palette.js';
import { emoji } from '../../render/util.js';
import { TAB, floorCarpet } from '../../render/tableau.js';
import { LOOKS as OFFICE_LOOKS } from '../meeting/looks.js';

export const TITLE = {
  mission: ['3:30 PM. Laptop audit. There should be four.', 'You sold yours.'],
  badge: ['🧾', '💻'],
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

export const DECOR = {
  chairs: [
    { spot: 'boss_desk', face: 'N', color: OXBLOOD }, // his back to the glass
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { x: 13, y: 12, face: 'N', color: MUSTARD },
    { x: 22, y: 12, face: 'N', color: TEAL },
    { x: 4, y: 12, face: 'N', color: TEAL },
    { x: 12, y: 5, face: 'N', color: TEAL },
    { x: 14, y: 5, face: 'N', color: TEAL },
    { x: 12, y: 2, face: 'S', color: TEAL },
    { x: 14, y: 2, face: 'S', color: TEAL },
  ],
  windows: [{ x0: 2, x1: 6, y: 0 }, { x0: 10, x1: 12, y: 0 }, { x0: 25, x1: 27, y: 0 }],
  paintings: [{ x: 10, y: 6, variant: 0 }, { x: 25, y: 6, variant: 1 }, { x: 2, y: 0, variant: 1 }],
  cabinets: { x0: 21, x1: 23, y: 0 },
  clock: { x: 17, y: 6 },
  props: [
    { tile: 'C', draw: 'carafe', state: () => ({ full: true }) },
    { tile: 'K', draw: 'coatRack', state: () => ({ coat: false, tag: false }) },
  ],
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#2a2a2a', screenArt: 'blankSlide', mug: C.tomato, prop: null }, // no laptop, just a dock
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: 'earbuds' },
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: 'plant' },
  },
  ashtray: { spot: 'smoke' },
  elevator: { spot: 'elevator' },
  zoneSeeds: [
    { zone: 'office', x: 4, y: 2 },
    { zone: 'meeting', x: 13, y: 2 },
    { zone: 'kitchen', x: 20, y: 2 },
    { zone: 'lobby', x: 4, y: 14 },
  ],
  legendAt: { x: 20, y: 15.5 },
};

export const LOOKS = {
  ...OFFICE_LOOKS,
  auditor: {
    body: '#6b6f78', bodyDark: '#4d5058', torso: 'suit', shirt: '#f1f1ee', shirtDark: '#c9c9c4', tie: '#2d2d33',
    skin: '#e3b48f', skinDark: '#c4926c', hair: '#2b2622', hairStyle: 'tuft', glasses: true,
    legs: '#33353b', wide: 0.95, tall: 1.14, head: 6.6, bubbleDy: 34, eyeDy: 13,
  },
};

export const POSES = {
  arms: [
    { when: (n) => n.override === 'audit' && !n.moving, arms: 'carry', item: '🧾' }, // clipboard up
    { when: (n) => !n.override && n.anim === 'smoking', arms: (n) => (n.moving ? 'walk' : 'puff'), item: '🚬' },
  ],
  marks: [
    { when: (n) => n.id === 'auditor', badge: true },
  ],
};

// level.voices (fields: src/audio/babble.js VOICES). Level 1's three, copied from meeting/voices.js, and the auditor.
export const VOICES = {
  // The auditor: flat, nasal, precise, no rise or fall.
  auditor: {
    wave: 'square', f0: 165, spread: 0.02, decl: 0.02, syl: [0.06, 0.08], gap: [0.05, 0.07], atk: 0.004,
    fmt: 1.05, q: [7, 9], mk: 2.2, f2amp: 0.6, body: 0.05, bodyF: 700,
    vowels: ['i', 'e', 'i', 'a'], cons: 0.7, consF: 4200, consAmp: 0.22,
    post: [['peaking', 1400, 3, 7], ['lowpass', 3200, 0.7]], gain: 0.6,
    pitch: { notice: 400, tattle: 1, grumble: 200 },
  },
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

export const SOUNDS = {
  actions: {
    start: { pick_up: { sfx: 'rustle', who: 'player', opts: { gain: 0.6 } } }, // unplugging
    done: {},
  },
  events: {
    'auditor:suspicious': { sfx: 'tension', who: 'auditor' },
    'auditor:workAssigned': { sfx: 'workAssigned' },
    'inspect:pass': { sfx: 'scratch', who: 'auditor' }, // a tick on the clipboard
    'inspect:fail': { sfx: 'doom', who: 'auditor' },
    'audit:passed': { sfx: 'relief' },
    'laptop:reclaimed': { sfx: 'swish' },
    'kev:left': { sfx: 'elevator' },
  },
  signs: {},
  contraband: {},
  drops: { laptop_boss: 'soft', laptop_lin: 'soft', laptop_kev: 'soft' },
  repeats: {},
  elevator: { spot: 'elevator', radius: 2.5 },
};

const picture = (icon) => (ctx, game, t) => {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  emoji(ctx, icon, TAB.x + TAB.w / 2, TAB.y + TAB.h / 2 + Math.sin(t * 2) * 3, 72);
};

// The end card: the carpet and the outcome's picture, big.
export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? o.routes[0] : o?.result ?? 'fail'),
  scenes: {
    boss: { win: true, icons: ['💻', '👔', '✔️', '✔️'], draw: picture('🧾') },
    lin: { win: true, icons: ['💻', '👓', '✔️', '✔️'], draw: picture('🧾') },
    kev: { win: true, icons: ['💻', '🔧', '✔️', '✔️'], draw: picture('🧾') },
    fail: { win: false, icons: ['🧾', '⏰', '🤷'], draw: picture('⏰') },
    caught: { win: false, icons: ['🕵️', '❌', '👉'], draw: picture('❌') },
    blamed: { win: false, icons: ['🪑', '🧾', '❓'], draw: picture('🪑') }, // he came to sign off and you weren't there
  },
};
