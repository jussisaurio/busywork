// How the fixture looks: title card, set dressing, people and the end card (level 1's decor.js, looks.js and
// end-scenes.js document the fields).
import { C } from '../../render/palette.js';
import { emoji } from '../../render/util.js';
import { TAB, floorCarpet } from '../../render/tableau.js';

export const TITLE = {
  mission: ["3:00 PM. It's your birthday. Nobody was supposed to know.", 'Make sure nobody sings.'],
  badge: ['🎂', '❌'],
};

const PLUM = ['#8a3f6b', '#64284c'];
const ORANGE = ['#c27b2c', '#935a1c'];
const MUSTARD = ['#d6a23a', '#a97b22'];

export const DECOR = {
  chairs: [
    { spot: 'doreen_desk', face: 'S', color: PLUM },
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'gus_desk', face: 'E', color: ORANGE },
    { spot: 'birthday_chair', face: 'S', color: MUSTARD }, // yours, with a paper crown on it
  ],
  windows: [{ x0: 6, x1: 9, y: 0 }, { x0: 12, x1: 15, y: 0 }],
  paintings: [{ x: 2, y: 0, variant: 1 }],
  clock: { x: 10, y: 0 },
  props: [
    { tile: 'B', draw: 'icon', state: (w) => ({ icon: w.cake === 'stand' ? '🎂' : '🍽️' }) },
    { tile: 'M', draw: 'icon', state: (w) => ({ icon: w.popcorn === 'burning' || w.popcorn === 'smoking' ? '🔥' : '♨️', size: 16 }) },
    { tile: 'W', draw: 'icon', state: () => ({ icon: '📅' }) },
  ],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
  },
  legendAt: { x: 15, y: 14 },
};

export const LOOKS = {
  player: {
    body: C.tomato, bodyDark: C.tomatoDark, skin: '#f1c9a2', skinDark: '#d9a47c', hair: '#7a3b1e',
    hairStyle: 'tuft', legs: '#3a3946', wide: 1, tall: 1, head: 6.6, torso: 'sweater', trim: '#f3e6c8',
    bubbleDy: 30, eyeDy: 12,
  },
  doreen: {
    body: '#8a3f6b', bodyDark: '#64284c', skin: '#e8b996', skinDark: '#c99470', hair: '#d8d2c8',
    hairStyle: 'bun', glasses: true, legs: '#3b3040', wide: 1.05, tall: 1.02, head: 6.8, torso: 'cardigan',
    trim: '#f3e6c8', bubbleDy: 31, eyeDy: 12,
  },
  gus: {
    body: '#c27b2c', bodyDark: '#935a1c', skin: '#c98d62', skinDark: '#a8714a', hair: '#2a1d14',
    hairStyle: 'cap', legs: '#2f3340', wide: 1.15, tall: 1, head: 6.8, torso: 'hoodie',
    bubbleDy: 30, eyeDy: 12,
  },
};

// The end card: no hand-drawn tableaux, just the carpet and the outcome's first icon, big.
// How the cast talks (level.voices; fields: src/audio/babble.js VOICES), by cast `voice` name.
export const VOICES = {
  // Doreen: brisk, clipped, a little shrill.
  doreen: {
    wave: 'sawtooth', f0: 225, spread: 0.08, decl: 0.12, syl: [0.07, 0.1], gap: [0.03, 0.05], atk: 0.006,
    fmt: 1.1, q: [6, 8], mk: 2.6, f2amp: 0.7, body: 0.06, bodyF: 600,
    vowels: ['e', 'i', 'a', 'o'], cons: 0.55, consF: 5000, consAmp: 0.2, gain: 0.8,
  },
  // Gus: low, warm, slow.
  gus: {
    wave: 'triangle', f0: 120, spread: 0.07, decl: 0.08, syl: [0.12, 0.17], gap: [0.02, 0.04], atk: 0.02,
    fmt: 0.9, q: [5, 7], mk: 3.0, f2amp: 0.55, body: 0.2, bodyF: 500,
    vowels: ['o', 'u', 'a', 'uh'], cons: 0.25, consF: 2400, consAmp: 0.14, gain: 1.1,
  },
};

const picture = (icon) => (ctx, game, t) => {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  emoji(ctx, icon, TAB.x + TAB.w / 2, TAB.y + TAB.h / 2 + Math.sin(t * 2) * 3, 72);
};

export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? (o.routes.includes('calendar') ? 'calendar' : 'cake') : o?.result ?? 'fail'),
  scenes: {
    calendar: { win: true, icons: ['📅', '🧁', '🎶'], draw: picture('🤨') }, // Gus gets sung at instead
    cake: { win: true, icons: ['🎂', '😋', '🤷'], draw: picture('🍽️') }, // nothing to sing over
    fail: { win: false, icons: ['🎂', '🎶', '😅'], draw: picture('🎶') },
    caught: { win: false, icons: ['📋', '👉', '😠'], draw: picture('📋') },
    blamed: { win: false, icons: ['🪑', '👉', '🎂'], draw: picture('🪑') }, // your own party, and you skipped it
  },
};
