// How The Layoff List looks and sounds: title card, set dressing, people, the end card (level 1's decor.js, looks.js,
// end-scenes.js, sounds.js and voices.js document the fields).
import { C } from '../../render/palette.js';
import { T } from '../../render/util.js';
import { LOOKS as OFFICE } from '../meeting/looks.js';
import { listShown, drawListScreen } from './list.js';
import { END_SCENES } from './end-scenes.js';
import { kevbag, handset, deskPhone, mobile, socket } from './painters.js';
import { SECS } from './cast.js';

export { END_SCENES };

export const TITLE = {
  mission: ["Friday, 3:00 PM. You're on the layoff list.", 'It goes to HR at 3:45. Get off it.'],
  badge: ['📧', '📦'], // the trouble: the email at 3:45, and the box you carry out
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const CHARCOAL = ['#4b5056', '#34383d'];

export const DECOR = {
  chairs: [
    { spot: 'boss_desk', face: 'N', color: OXBLOOD }, // his back to the glass
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
    // His screen: the layoff list, a row of faces, yours framed in red; static while his cable is loose, a padlock
    // while he's in the restroom (list.js).
    { tile: 'Q', draw: drawListScreen, state: listShown },
    { tile: 'W', draw: drawCable, state: (w) => w.glitch }, // the plug half out of the floor socket behind his desk
    { tile: 'F', draw: drawBossPhone, state: bossPhone },
    { tile: 'V', draw: drawKevDesk, state: kevDesk }, // his desk phone; his screen off once he's gone home
    { tile: 'M', draw: drawLinMobile, state: linMobile }, // her mobile on her desk, buzzing now and then
  ],
  things: { kevbag, handset },
  notepads: { north: [12, 14, 15], south: [12, 13, 14, 15] },
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: null }, // his desk phone instead (V)
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: null }, // her mobile instead (M)
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

// The boss's cable, from the back of his desk down to the floor socket behind it (W, row 2), drawn big enough to read
// across the floor: the plug half out and sparking while his screen is static, pushed home once it's fixed.
const SOCKET_ZOOM = 1.7;
function drawCable(ctx, info, at, out, t) {
  const sx = at.x * T + T / 2;
  const sy = at.y * T + T / 2 + 2;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(SOCKET_ZOOM, SOCKET_ZOOM);
  socket(ctx, (T * 0.9) / SOCKET_ZOOM, (T * 0.55) / SOCKET_ZOOM, -3, 0, out);
  if (out && Math.floor(t * 6) % 3 !== 0) { // sparks off the bare prongs
    ctx.strokeStyle = '#ffd84a';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    const k = Math.floor(t * 6) % 2;
    ctx.moveTo(3, -1); ctx.lineTo(1.5, -4 - k);
    ctx.moveTo(3.5, 0); ctx.lineTo(0.5, 1.5 + k);
    ctx.moveTo(3, 1); ctx.lineTo(2, 4);
    ctx.stroke();
  }
  ctx.restore();
}

// The boss's desk phone: its handset off while he calls Kev's desk.
const BOSS_PHONE = { ringing: false, off: false };
function bossPhone(w, game) {
  BOSS_PHONE.off = w.bossPhoneUntil != null && (game.clock?.minute ?? 0) < w.bossPhoneUntil;
  return BOSS_PHONE;
}
function drawBossPhone(ctx, info, at, shown, t) {
  deskPhone(ctx, at.x * T + T / 2, at.y * T + 9, t, shown);
}

// Kev's desk: his phone (ringing, or its handset at his ear) at the right end, his screen dark once he's gone home.
const KEV = { ringing: false, off: false, gone: false };
function kevDesk(w) {
  KEV.ringing = !!w.ringing;
  KEV.off = !!w.kevCall;
  KEV.gone = !!w.kevGone;
  return KEV;
}
function drawKevDesk(ctx, info, at, shown, t) {
  if (shown.gone) { // the workstation's screen (render/world.js drawWorkstation), switched off; the desk's centre tile
    const cx = (at.x - 1) * T + T / 2;
    const sy = at.y * T + 3 + 3 + 8;
    ctx.fillStyle = '#16191c';
    ctx.fillRect(cx - 10, sy, 20, 7);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(cx - 9, sy + 1, 6, 1);
  }
  deskPhone(ctx, at.x * T + T / 2 + 2, at.y * T + 12, t, shown);
}

// Lin's mobile: buzzing for a moment (BUZZ_SECS) when a message comes in, gone while it's in her hand.
const BUZZ_SECS = 1.0;
const LIN = { shown: true, buzzing: false };
function linMobile(w, game) {
  LIN.shown = w.linPhone === 'desk';
  LIN.buzzing = w.buzzAt != null && (game.clock?.minute ?? 0) - w.buzzAt < SECS(BUZZ_SECS);
  return LIN;
}
function drawLinMobile(ctx, info, at, shown, t) {
  if (shown.shown) mobile(ctx, at.x * T + T / 2 + 2, at.y * T + 13, t, shown.buzzing);
}

// Level 1's people.
export const LOOKS = OFFICE;

export const POSES = {
  arms: [
    { when: (n, w) => n.id === 'kev' && w.kevCall, arms: 'phone', item: '#handset' }, // picking up the boss's call
    { when: (n, w) => n.id === 'kev' && w.pc === 'kev' && !n.moving, arms: 'type' }, // at the plug behind his desk
    { when: (n, w) => n.id === 'kev' && w.kevUp, arms: 'carry', item: '#kevbag' }, // going home
    { when: (n, w, g) => n.id === 'boss' && w.bossPhoneUntil != null && g.clock.minute < w.bossPhoneUntil, arms: 'phone', item: '#handset' },
    { when: (n, w) => n.id === 'boss' && w.coffee === 'done' && n.override !== 'brewing', arms: 'mug' }, // his cup, all the way back
    { when: (n, w) => n.id === 'boss' && !n.moving && w.pc === 'kev', arms: 'shrug' }, // standing over Kev
    { when: (n, w) => n.id === 'boss' && w.glitch && n.pose === 'sit' && !n.moving && !n.override, arms: 'bang' }, // at the static
    { when: (n, w) => n.id === 'lin' && w.linPhone === 'hand', arms: 'phone' }, // reading her mobile, turned away
  ],
  marks: [],
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
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'pc:actsUp': { sfx: 'bang', who: 'boss' },
    'pc:fixed': { sfx: 'fixed', who: 'kev' },
    'pc:fixedByYou': { sfx: 'fixed', who: 'player' },
    'pc:selfFixed': { sfx: 'fixed', who: 'boss' },
    'lin:buzz': { sfx: 'rattle', spot: 'lin_desk', opts: { gain: 0.25 } },
    'kev:up': { sfx: 'swish', who: 'kev' },
    'list:edited': { sfx: 'swish', who: 'player' },
    'kev:left': { sfx: 'elevator' },
  },
  elevator: { spot: 'elevator', radius: 2.5 },
};
