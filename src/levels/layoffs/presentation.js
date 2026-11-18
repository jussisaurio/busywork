// How The Layoff List looks and sounds: title card, set dressing, people, the end card (level 1's decor.js, looks.js,
// end-scenes.js, sounds.js and voices.js document the fields).
import { OXBLOOD, MUSTARD, TEAL } from '../../render/palette.js';
import { T } from '../../render/util.js';
import { LOOKS as OFFICE } from '../meeting/looks.js';
import { listShown, drawListScreen } from './list.js';
import { END_SCENES } from './end-scenes.js';
import { kevbag, handset, pwstar, enterkey, deskPhone, mobile, socket } from './painters.js';
import { SECS } from './cast.js';
import { OFFICE_WINDOWS, OFFICE_CABINETS, OFFICE_CLOCK, OFFICE_DESK_OWNERS, OFFICE_ELEVATOR, OFFICE_ZONE_SEEDS, officeDesk } from '../office/decor.js';

export { END_SCENES };

export const TITLE = {
  mission: ["Friday, 3:00 PM. You're on the layoff list.", 'It goes to HR at 3:45. Get off it.'],
  badge: ['📧', '📦'], // the trouble: the email at 3:45, and the box you carry out
};

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
  windows: OFFICE_WINDOWS,
  paintings: [{ x: 10, y: 6, variant: 0 }, { x: 25, y: 6, variant: 1 }, { x: 2, y: 0, variant: 1 }],
  cabinets: OFFICE_CABINETS,
  clock: OFFICE_CLOCK,
  props: [
    // His screen: the layoff list, a row of faces, yours framed in red; black while its cable is loose, a padlock
    // while he's in the restroom (list.js).
    { tile: 'Q', draw: drawListScreen, state: listShown },
    { tile: 'W', draw: drawCable, state: (w) => w.glitch }, // the plug half out of the floor socket behind his desk
    { tile: 'F', draw: drawBossPhone, state: bossPhone },
    { tile: 'V', draw: drawKevDesk, state: kevDesk }, // his desk phone; his screen off once he's gone home
    { tile: 'M', draw: drawLinMobile, state: linMobile }, // her mobile on her desk, buzzing now and then
  ],
  things: { kevbag, handset, pwstar, enterkey },
  notepads: { north: [12, 14, 15], south: [12, 13, 14, 15] },
  deskOwners: OFFICE_DESK_OWNERS,
  desks: {
    player: officeDesk('player'),
    kev: officeDesk('kev', { prop: null }), // his desk phone instead (V)
    lin: officeDesk('lin', { prop: null }), // her mobile instead (M)
  },
  elevator: OFFICE_ELEVATOR,
  zoneSeeds: OFFICE_ZONE_SEEDS,
  legendAt: { x: 20, y: 15.5 },
};

// His monitor's cable, from behind the screen down to the floor socket behind his desk (W, row 2), drawn big enough to
// read across the floor: the plug half out and sparking while his screen is black, pushed home once it's fixed.
const SOCKET_ZOOM = 1.7;
const MONITOR = { x: 5, y: 3 }; // Q in the map (index.js)
function drawCable(ctx, info, at, out, t) {
  const sx = at.x * T + T / 2;
  const sy = at.y * T + T / 2 + 2;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(SOCKET_ZOOM, SOCKET_ZOOM);
  // The cable's other end goes in at the left edge of his monitor (Q, three tiles right and a row down), arching over
  // the back of the desk past his phone, so the plug reads as the screen's.
  const z = (v) => v / SOCKET_ZOOM;
  const mx = MONITOR.x * T + T / 2 - 24 - sx;
  const my = MONITOR.y * T + 1 - sy;
  socket(ctx, z(mx), z(my), -3, 0, out, { x: z(4.4 * T - sx), y: z(2.7 * T - sy) });
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

// The boss's desk phone: its handset off while he calls Kev's desk. While your call rings out at Kev's desk, its
// handset lies off the cradle on the desk (line busy: that is why E is gone till the ringing stops).
const BOSS_PHONE = { ringing: false, off: false, aside: false };
function bossPhone(w, game) {
  BOSS_PHONE.off = w.bossPhoneUntil != null && (game.clock?.minute ?? 0) < w.bossPhoneUntil;
  BOSS_PHONE.aside = !!w.ringing && !BOSS_PHONE.off && w.ringBy === 'player';
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
    { when: (n, w, g) => n.id === 'boss' && w.loginUntil != null && g.clock.minute < w.loginUntil && n.pose === 'sit' && !n.moving, arms: 'type' }, // his password, into the black
    { when: (n, w, g) => n.id === 'boss' && w.glitch && n.pose === 'sit' && !n.moving && !n.override && !(w.thumpFrom != null && g.clock.minute < w.thumpFrom), arms: 'bang' }, // at the black screen
    { when: (n, w) => n.id === 'lin' && w.linPhone === 'hand', arms: 'phone' }, // reading her mobile, turned away
  ],
  marks: [],
};

export const SOUNDS = {
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'boss:key': { sfx: 'key', who: 'boss', opts: { gain: 4 } }, // his password, a clack per asterisk
    'boss:enter': { sfx: 'key', who: 'boss', opts: { space: true, gain: 9 } }, // and the Enter, hard
    'pc:fixed': { sfx: 'fixed', who: 'kev' },
    'pc:fixedByYou': { sfx: 'fixed', who: 'player' },
    'pc:pulled': { sfx: 'bang', who: 'player' },
    'lin:buzz': { sfx: 'rattle', spot: 'lin_desk', opts: { gain: 0.25 } },
    'kev:up': { sfx: 'swish', who: 'kev' },
    'list:edited': { sfx: 'swish', who: 'player' },
    'kev:left': { sfx: 'elevator' },
  },
  elevator: { spot: 'elevator', radius: 2.5 },
};
