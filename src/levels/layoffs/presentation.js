// How The Layoff List looks and sounds: title card, set dressing, people, the end card (level 1's decor.js, looks.js,
// end-scenes.js, sounds.js and voices.js document the fields).
import { C } from '../../render/palette.js';
import { T } from '../../render/util.js';
import { LOOKS as OFFICE } from '../meeting/looks.js';
import { listShown, drawListScreen } from './list.js';
import { END_SCENES } from './end-scenes.js';
import { kevbag, drapedHoodie } from './painters.js';

export { END_SCENES };

export const TITLE = {
  mission: ["3:00 PM. At 3:45 the boss emails HR the layoff list. You're on it.", 'Get your name off it.'],
  badge: ['📧', '📦'], // the trouble: the email at 3:45, and the box you carry out
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const CHARCOAL = ['#4b5056', '#34383d']; // Kev's chair: his olive hoodie must stand out on it

export const DECOR = {
  chairs: [
    { spot: 'boss_desk', face: 'S', color: OXBLOOD },
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: CHARCOAL },
    { x: 13, y: 12, face: 'N', color: MUSTARD },
    { x: 22, y: 9, face: 'N', color: TEAL },
    { x: 22, y: 12, face: 'N', color: TEAL },
    { x: 10, y: 3, face: 'E', color: OXBLOOD },
    { x: 12, y: 5, face: 'N', color: TEAL },
    { x: 13, y: 5, face: 'N', color: TEAL },
    { x: 14, y: 5, face: 'N', color: TEAL },
    { x: 15, y: 5, face: 'N', color: TEAL },
    { x: 12, y: 2, face: 'S', color: TEAL },
    { x: 14, y: 2, face: 'S', color: TEAL },
    { x: 15, y: 2, face: 'S', color: TEAL },
    { x: 24, y: 4, face: 'N', color: MUSTARD },
    { x: 25, y: 4, face: 'N', color: MUSTARD },
    { x: 26, y: 4, face: 'N', color: MUSTARD },
    { x: 25, y: 2, face: 'S', color: MUSTARD },
  ],
  windows: [{ x0: 2, x1: 6, y: 0 }, { x0: 10, x1: 12, y: 0 }, { x0: 25, x1: 27, y: 0 }],
  paintings: [{ x: 10, y: 6, variant: 0 }, { x: 25, y: 6, variant: 1 }, { x: 2, y: 0, variant: 1 }],
  cabinets: { x0: 21, x1: 23, y: 0 },
  clock: { x: 17, y: 6 },
  props: [
    // His screen: the layoff list, a row of faces, yours framed in red; static while it acts up (list.js).
    { tile: 'Q', draw: drawListScreen, state: listShown },
    // Kev's desk (V, which you reach his chair from): his hoodie over his chair's back once he takes it off, and
    // his screen off once he's gone home.
    { tile: 'V', draw: drawKevDesk, state: kevDesk },
    { tile: 'K', draw: 'coatRack', state: (w) => ({ coat: w.jacket === 'rack', tag: false }) },
    { tile: 'C', draw: 'carafe', state: () => ({ full: true }) },
  ],
  things: { kevbag },
  notepads: { north: [12, 14, 15], south: [12, 13, 14, 15] },
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: 'earbuds' },
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: 'plant' },
  },
  elevator: { spot: 'elevator' },
  zoneSeeds: [
    { zone: 'office', x: 4, y: 2 },
    { zone: 'meeting', x: 13, y: 2 },
    { zone: 'kitchen', x: 20, y: 2 },
    { zone: 'lobby', x: 4, y: 14 },
  ],
  legendAt: { x: 20, y: 15.5 },
};

// Kev's desk, as it changes: his hoodie over his chair's back (one tile south of the desk tile; the chair faces the
// desk, so its backrest is to the south and its seat stays bare), and his screen dark once he's gone home.
// Kev's chair is charcoal so the olive stands out.
const KEV = { hoodie: false, off: false };
function kevDesk(w) {
  KEV.hoodie = w.hoodie === 'chair';
  KEV.off = !!w.kevGone;
  return KEV;
}

function drawKevDesk(ctx, info, at, shown) {
  const cx = at.x * T + T / 2;
  if (shown.off) { // the workstation's screen (render/world.js drawWorkstation), switched off
    const sy = at.y * T + 3 + 3 + 8;
    ctx.fillStyle = '#16191c';
    ctx.fillRect(cx - 10, sy, 20, 7);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(cx - 9, sy + 1, 6, 1);
  }
  if (shown.hoodie) drapedHoodie(ctx, cx, (at.y + 1) * T + T / 2 + 5);
}

// Level 1's people. Kev wears a T-shirt under his hoodie (drawn once the hoodie is off: POSES).
export const LOOKS = {
  ...OFFICE,
  kev: { ...OFFICE.kev, shirt: '#e8e2d2', shirtDark: '#c8c0ae' },
};

export const POSES = {
  arms: [
    { when: (n, w) => n.id === 'kev' && w.pc === 'kev' && !n.moving, arms: 'type' }, // fixing the boss's computer
    { when: (n, w) => n.id === 'kev' && w.kevUp, arms: 'carry', item: '#kevbag' }, // going home
    // The boss, watching Kev (or "Kev") at his computer.
    { when: (n, w) => n.id === 'boss' && !n.moving && (n.override === 'watching' || w.pc === 'kev'), arms: 'shrug' },
    { when: (n, w) => n.id === 'boss' && w.glitch && n.pose === 'sit' && !n.moving, arms: 'bang' }, // at the static
  ],
  marks: [
    { when: (n, w) => n.id === 'kev' && w.hoodie !== 'kev', jacket: false }, // in his T-shirt
    { when: (n) => n.id === 'boss', jacket: false }, // shirt and suspenders: his jacket is on the rack
    { when: (n) => n.override === 'stepAside' || n.override === 'watching', angry: false },
  ],
};

// How the cast talks (level 1's voices: src/levels/meeting/voices.js).
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

export const SOUNDS = {
  actions: {
    start: {
      take_jacket: { sfx: 'rustle', spot: 'coat_rack', opts: { gain: 0.6 } },
    },
  },
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'jacket:taken': { sfx: 'rustle', who: 'player' },
    'jacket:hung': { sfx: 'swish', who: 'player' },
    'kev:hoodieOff': { sfx: 'rustle', who: 'kev' },
    'kev:up': { sfx: 'swish', who: 'kev' },
    'pc:actsUp': { sfx: 'rattle', who: 'boss' },
    'pc:fixed': { sfx: 'fixed', who: 'kev' },
    'pc:thumped': { sfx: 'bang', who: 'boss' },
    'list:edited': { sfx: 'swish', who: 'player' },
    'kev:left': { sfx: 'elevator' },
  },
  drops: { hoodie: 'soft', jacket: 'soft' },
  elevator: { spot: 'elevator', radius: 2.5 },
};
