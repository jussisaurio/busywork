// How the fixture looks: title card, set dressing, people and the end card (level 1's decor.js, looks.js and
// end-scenes.js document the fields).
import { C } from '../../render/palette.js';
import { fillEllipse } from '../../render/util.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { TAB, person, bubble, floorCarpet, backWall, confetti } from '../../render/tableau.js';
import { cakeStand, microwave, calendar, drawStand } from './painters.js';

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
    { tile: 'B', draw: cakeStand, state: (w) => ({ cake: w.cake === 'stand' }) },
    { tile: 'M', draw: microwave, state: (w) => ({ state: w.popcorn }) },
    { tile: 'W', draw: calendar, state: (w) => ({ who: w.birthday }) },
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

// The end card: small drawn scenes round the cake stand (painters.js); the icon rows are the punchline.
const room = (ctx) => {
  backWall(ctx, 72);
  floorCarpet(ctx, TAB.x, TAB.y + 72, TAB.w, TAB.h - 72);
};
const figure = (ctx, game, t, id, x, y, set) => {
  const p = person(t);
  p.scale = 2.2;
  set(p);
  drawPerson(ctx, game.level.looks[id], p, x, y);
};
const stand = (ctx, x, y, full) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(3, 3);
  drawStand(ctx, 0, 0, full);
  ctx.restore();
};
const CX = TAB.x + TAB.w / 2;
const FLOOR = TAB.y + 200;

export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? (o.routes.includes('calendar') ? 'calendar' : 'cake') : o?.result ?? 'fail'),
  scenes: {
    // Gus gets sung at instead: Doreen beams at him over the cake; you hang back.
    calendar: { win: true, icons: ['📅', '🧁', '🎶'], draw(ctx, game, t, e) {
      room(ctx);
      figure(ctx, game, t, 'gus', CX, FLOOR - 18, (p) => { p.head = p.dir + Math.sin(t * 2) * 0.3; p.sweat = true; });
      stand(ctx, CX, FLOOR + 6, true);
      figure(ctx, game, t, 'doreen', CX - 150, FLOOR, (p) => { p.dir = 0.2; p.head = 0.2; p.arms = 'cheer'; });
      figure(ctx, game, t, 'player', CX + 170, FLOOR, (p) => { p.smug = true; p.head = Math.PI / 2 + Math.sin(t) * 0.2; });
      bubble(ctx, ['🎶'], CX - 150, FLOOR - 82, e);
      bubble(ctx, ['🤨'], CX + 30, FLOOR - 100, e, 'thought');
    } },
    // Nothing to sing over: an empty plate, and you, full.
    cake: { win: true, icons: ['🎂', '😋', '🤷'], draw(ctx, game, t, e) {
      room(ctx);
      confetti(ctx, TAB.x, TAB.w, TAB.y, TAB.h, e, 24);
      stand(ctx, CX - 60, FLOOR + 6, false);
      figure(ctx, game, t, 'player', CX + 60, FLOOR - Math.abs(Math.sin(t * 6)) * 6, (p) => { p.smug = true; p.arms = 'cheer'; });
      figure(ctx, game, t, 'doreen', CX - 190, FLOOR, (p) => { p.arms = 'shrug'; });
      bubble(ctx, ['😋'], CX + 110, FLOOR - 92, e, 'thought');
    } },
    // They sing at you, candles and all.
    fail: { win: false, icons: ['🎂', '🎶', '😅'], draw(ctx, game, t, e) {
      room(ctx);
      figure(ctx, game, t, 'player', CX, FLOOR - 18, (p) => { p.sweat = true; p.head = p.dir + Math.sin(t * 2.6) * 0.5; });
      stand(ctx, CX, FLOOR + 6, true);
      figure(ctx, game, t, 'doreen', CX - 150, FLOOR, (p) => { p.dir = 0.2; p.head = 0.2; p.arms = 'cheer'; });
      figure(ctx, game, t, 'gus', CX + 150, FLOOR, (p) => { p.dir = Math.PI - 0.2; p.head = Math.PI - 0.2; p.arms = 'cheer'; });
      bubble(ctx, ['🎶'], CX - 150, FLOOR - 82, e);
      bubble(ctx, ['🎶'], CX + 150, FLOOR - 82, e);
    } },
    // Doreen, clipboard under her arm, points you back to your desk.
    caught: { win: false, icons: ['📋', '👉', '😠'], draw(ctx, game, t, e) {
      room(ctx);
      figure(ctx, game, t, 'doreen', CX - 90, FLOOR, (p) => { p.dir = 0.1; p.head = 0.1; p.arms = 'point'; p.angry = true; });
      figure(ctx, game, t, 'player', CX + 90, FLOOR, (p) => { p.sweat = true; p.dir = Math.PI - 0.3; p.head = Math.PI - 0.3; });
      bubble(ctx, ['😠', '👉', '@player'], CX - 90, FLOOR - 82, e, 'alert');
    } },
    // Your own party, and you skipped it: everyone looks at your empty chair behind the cake.
    blamed: { win: false, icons: ['🪑', '👉', '🎂'], draw(ctx, game, t, e) {
      room(ctx);
      for (let i = 3; i >= 1; i--) fillEllipse(ctx, CX, FLOOR + 8, 26 + i * 14, 7 + i * 4, `rgba(255,240,200,${(0.08 * (4 - i)).toFixed(3)})`);
      ctx.save();
      ctx.translate(CX, FLOOR - 44);
      ctx.scale(2.6, 2.6);
      drawChair(ctx, 0, 0, -Math.PI / 2, C.ochre, C.ochreDark);
      ctx.restore();
      stand(ctx, CX, FLOOR + 30, true);
      figure(ctx, game, t, 'doreen', CX - 170, FLOOR, (p) => { p.dir = 0.3; p.head = 0.3; p.arms = 'point'; p.angry = true; });
      figure(ctx, game, t, 'gus', CX + 170, FLOOR, (p) => { p.dir = Math.PI - 0.3; p.head = Math.PI - 0.3; p.glance = 1; });
      bubble(ctx, ['👉', '@player'], CX - 170, FLOOR - 82, e);
      bubble(ctx, ['❓'], CX + 170, FLOOR - 82, e, 'thought');
    } },
  },
};
