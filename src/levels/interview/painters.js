// The Interview's own painters: the props (decor.props draws: (ctx, info, at, shown, t), shown = { w, game }) and
// the things (decor.things: (ctx, x, y, size, t, game, opts)). Everything the outcome depends on is drawn on the
// object: a ringing phone shakes and rings spread from it in its line's colour; its handset is off the cradle on a
// curly cord to whoever holds it, and notes rise from it while the hold tune plays; the switchboard's patch cords,
// lamps and jacks; Lin's power cord coiled on the floor, its plug in the wall socket or lying loose.
import { T, rrect, circle, fillCircle, fillEllipse, emoji, clamp, starPath } from '../../render/util.js';
import { box } from '../../render/things.js';
import { C } from '../../render/palette.js';
import { GAME_MIN_PER_SEC } from '../../config.js';
import { PHONES, PHONE_IDS, OUTSIDE, RING_RADIUS, RING_EVERY, JOB_EVERY, SLAM } from './phones.js';

const IVORY = '#e8dfc8';
const IVORY_DARK = '#b5a888';
const IVORY_SHADE = '#d2c6a8';
const WOOD = '#7a4a2a';
const WOOD_DARK = '#4e2e1a';
const WOOD_TOP = '#93603a';
const BRASS = '#c9a24a';
const CABLE = '#2a2522';
const CABLE_HI = '#57504a';

// Where each phone sits (px): over the desk's built-in phone, the kitchen one on the wall's front face.
const SEAT = {
  lin: { x: 46, y: 207 },
  boss: { x: 78, y: 108 },
  kev: { x: 784, y: 238 },
};
const KITCHEN = { x: 656, y: 20 };

const npcById = (game, id) => (id && game.npcs ? game.npcs.find((n) => n.id === id) : null);
const minuteOf = (game) => (game.clock ? game.clock.minute : 0);
const sinceMin = (game, minute) => (minuteOf(game) - minute) / GAME_MIN_PER_SEC; // sim s

// Lin slams her own phone down (phones.js SLAM): back on the cradle.
const slammed = (w) => w.line_lin === 'lin' && w.hold_lin > SLAM;

// Who holds phone p's handset (an npc), or null: someone on its line, or Lin checking her own.
function holderOf(w, game, p) {
  if (p === 'lin' && slammed(w)) return null;
  if (w[`line_${p}`]) return npcById(game, w[`line_${p}`]);
  if (p === 'lin' && w.linCheck) return npcById(game, 'lin');
  return null;
}
const ringColour = (w, p) => (w[`ring_${p}`] === 'job' ? OUTSIDE : PHONES[p].lamp);

function glow(ctx, x, y, r, colour, a) {
  const g = ctx.createRadialGradient(x, y, 1, x, y, r);
  g.addColorStop(0, colour);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = a;
  ctx.fillStyle = g;
  circle(ctx, x, y, r);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// Short ring arcs either side of (x, y): the bell itself.
function arcs(ctx, x, y, colour, t, r0 = 9) {
  const k = (t * 2.2) % 1;
  ctx.lineCap = 'round';
  for (let i = 0; i < 2; i++) {
    const r = r0 + (i + k) * 5;
    ctx.globalAlpha = clamp(1 - (i + k) / 2, 0, 1);
    ctx.strokeStyle = colour;
    ctx.lineWidth = 2.2;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(x, y, r, s > 0 ? -0.55 : Math.PI - 0.55, s > 0 ? 0.55 : Math.PI + 0.55);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.lineCap = 'butt';
}

// A curly cord from (x0, y0) to (x1, y1).
function curlyCord(ctx, x0, y0, x1, y1, colour) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const turns = Math.max(4, Math.round(len / 4));
  ctx.strokeStyle = colour;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let i = 0; i <= turns * 4; i++) {
    const k = i / (turns * 4);
    const sag = Math.sin(k * Math.PI) * Math.min(10, len * 0.18);
    const wob = Math.sin(k * turns * Math.PI * 2) * 1.8;
    const x = x0 + dx * k + nx * wob;
    const y = y0 + dy * k + ny * wob + sag;
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.stroke();
}

// The handset lying on its cradle: a bar with an earpiece and a mouthpiece, in the line's colour.
function handset(ctx, x, y, colour, w = 18) {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, x - w / 2, y - 1, w, 5, 2.5);
  ctx.fill();
  ctx.fillStyle = colour;
  rrect(ctx, x - w / 2 + 2, y - 2.5, w - 4, 4, 2);
  ctx.fill();
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + s * (w / 2 - 2.5), y - 0.5, 3.2, 3.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 0.8;
  rrect(ctx, x - w / 2 + 2, y - 2.5, w - 4, 4, 2);
  ctx.stroke();
}

// An upright handset, centred on (x, y), h px tall: what a person holds to the ear, or hangs on a wall phone.
function uprightHandset(ctx, x, y, colour, h = 16) {
  const k = h / 16;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  rrect(ctx, -1.2, -6.2, 4, 13.5, 2);
  ctx.fill();
  ctx.fillStyle = colour;
  rrect(ctx, -1.9, -6.5, 3.8, 13, 1.9);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -5.6, 3.3, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(0, 5.6, 3.3, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.ellipse(0, -5.6, 3.3, 2.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, 5.6, 3.3, 2.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// A rotary desk phone at (x, y): ivory body, dial, the handset on its cradle or off it (a curly cord to `holder`),
// shaking with a glow and the bell's arcs while it rings.
function deskPhone(ctx, game, w, p, x, y, t) {
  const ringing = !!w[`ring_${p}`];
  const colour = ringColour(w, p);
  if (ringing) {
    glow(ctx, x, y, 20, colour, 0.45 + 0.25 * Math.sin(t * 14));
    x += Math.sin(t * 55) * 1.3;
  }
  if (p === 'lin' && slammed(w)) y += Math.abs(Math.sin(t * 40)) * 1.5; // slammed down: it rattles
  // body
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, x - 9, y - 4, 18, 13, 4);
  ctx.fill();
  ctx.fillStyle = IVORY_SHADE;
  rrect(ctx, x - 9, y - 6, 18, 13, 4);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, x - 8, y - 7, 16, 10, 4);
  ctx.fill();
  ctx.strokeStyle = IVORY_DARK;
  ctx.lineWidth = 1;
  rrect(ctx, x - 9, y - 7, 18, 14, 4);
  ctx.stroke();
  // dial
  fillCircle(ctx, x, y + 1, 3.6, '#f7f1e2');
  ctx.strokeStyle = IVORY_DARK;
  circle(ctx, x, y + 1, 3.6);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = -2.4 + i * 0.75;
    fillCircle(ctx, x + Math.cos(a) * 2.4, y + 1 + Math.sin(a) * 2.4, 0.55, '#6f6553');
  }
  const holder = holderOf(w, game, p);
  if (holder) {
    // cradle prongs, and the handset at his ear on a curly cord
    fillCircle(ctx, x - 6, y - 6, 1.6, IVORY_DARK);
    fillCircle(ctx, x + 6, y - 6, 1.6, IVORY_DARK);
    curlyCord(ctx, x - 7, y + 3, holder.x * T + 2, holder.y * T - 12, PHONES[p].lamp);
  } else {
    handset(ctx, x, y - 6, PHONES[p].lamp);
  }
  if (ringing) arcs(ctx, x, y - 3, colour, t);
}

const DESK = (p) => (ctx, info, at, { w, game }, t) => deskPhone(ctx, game, w, p, SEAT[p].x, SEAT[p].y, t);

// A wall phone: an ivory box with a dial, its handset hanging upright on the right side (or off it, on a curly
// cord to whoever holds it).
function wallPhone(ctx, x, y, colour, holder = null, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, -6, -9, 13, 21, 3);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, -7, -11, 13, 21, 3);
  ctx.fill();
  ctx.strokeStyle = IVORY_DARK;
  ctx.lineWidth = 1;
  rrect(ctx, -7, -11, 13, 21, 3);
  ctx.stroke();
  fillCircle(ctx, -0.5, 3, 3.2, '#f7f1e2');
  ctx.strokeStyle = IVORY_DARK;
  circle(ctx, -0.5, 3, 3.2);
  ctx.stroke();
  if (holder) fillCircle(ctx, 7, -6, 1.4, IVORY_DARK);
  else uprightHandset(ctx, 8, -1, colour, 20);
  ctx.restore();
}

// The kitchen's wall phone, by the fridge: on the outside line, so red.
function kitchenPhone(ctx, info, at, { w, game }, t) {
  let { x, y } = KITCHEN;
  const ringing = !!w.ring_kitchen;
  const colour = PHONES.kitchen.lamp;
  if (ringing) {
    glow(ctx, x, y + 2, 22, colour, 0.45 + 0.25 * Math.sin(t * 14));
    x += Math.sin(t * 55) * 1.2;
  }
  const holder = holderOf(w, game, 'kitchen');
  wallPhone(ctx, x, y, colour, holder);
  if (holder) curlyCord(ctx, x + 6, y + 6, holder.x * T + 2, holder.y * T - 12, colour);
  if (ringing) arcs(ctx, x + 2, y, colour, t, 12);
}

// --- Rings and notes ----------------------------------------------------------------------------------
// A ring spreads from the phone itself, as far as its earshot (phones.js RING_RADIUS), in the line's colour, once
// a bell (phones.js RING_EVERY: the noise and its sound keep the same beat).
const RINGS = 3;
const RING_GAP = 0.12;
const RING_SPAN = 1 - RING_GAP * (RINGS - 1);
function rings(ctx, info, at, { w, game }) {
  for (const p of PHONE_IDS) {
    const kind = w[`ring_${p}`];
    if (!kind) continue;
    const age = sinceMin(game, w[`ringAt_${p}`]);
    if (!(age >= 0)) continue;
    const ph = age % (kind === 'job' ? JOB_EVERY : RING_EVERY);
    const bx = PHONES[p].bell.x * T;
    const by = PHONES[p].bell.y * T;
    const R = RING_RADIUS * T;
    ctx.strokeStyle = ringColour(w, p);
    for (let k = 0; k < RINGS; k++) {
      const q = (ph - k * RING_GAP) / RING_SPAN;
      if (q <= 0 || q >= 1) continue;
      const e = 1 - (1 - q) * (1 - q);
      ctx.globalAlpha = 0.75 * (1 - q);
      ctx.lineWidth = 1 + 2.5 * (1 - q);
      circle(ctx, bx, by, 6 + e * (R - 6));
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

// A note, (x, y) its head: one with a flag, or a beamed pair. s: scale.
export function note(ctx, x, y, colour, pair = false, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineCap = 'round';
  for (const [c, dx] of [['rgba(20,12,8,0.55)', 0.8], [colour, 0]]) {
    ctx.save();
    ctx.translate(dx, dx);
    ctx.fillStyle = c;
    ctx.strokeStyle = c;
    ctx.lineWidth = 1.5;
    const head = (hx, hy) => {
      ctx.beginPath();
      ctx.ellipse(hx, hy, 2.8, 2.1, -0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(hx + 2.4, hy - 0.6);
      ctx.lineTo(hx + 2.4, hy - 10);
      ctx.stroke();
    };
    if (pair) {
      head(-3.5, 1);
      head(3.5, -1);
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-1.1, -9);
      ctx.lineTo(5.9, -11);
      ctx.stroke();
    } else {
      head(0, 0);
      ctx.beginPath();
      ctx.moveTo(2.4, -10);
      ctx.quadraticCurveTo(6.5, -7.5, 5.4, -3.5);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.lineCap = 'butt';
  ctx.restore();
}

// Notes rising from (x, y), the handset at someone's ear: a new one every 0.65 s, drifting up and fading.
export function notesFrom(ctx, x, y, colour, t, k = 1) {
  const EVERY = 0.65;
  const LIFE = 1.9;
  for (let i = 0; i < 3; i++) {
    const age = ((t + i * EVERY) % LIFE);
    const n = Math.floor((t + i * EVERY) / LIFE) * 3 + i;
    const q = age / LIFE;
    ctx.globalAlpha = clamp(Math.min(q * 5, (1 - q) * 2.2), 0, 1);
    note(ctx, x + (6 + q * 10 + Math.sin(age * 4 + n) * 2) * k, y - (2 + q * 24) * k, colour, n % 2 === 1, 0.9 * k);
  }
  ctx.globalAlpha = 1;
}

// The hold tune (phones.js tune_<p>): notes out of the handset at the holder's ear.
function holdNotes(ctx, info, at, { w, game }, t) {
  for (const p of PHONE_IDS) {
    if (!w[`tune_${p}`]) continue;
    const n = npcById(game, w[`line_${p}`]);
    if (!n) continue;
    notesFrom(ctx, n.x * T + 4, n.y * T - 20, PHONES[p].lamp, t);
  }
}

// --- The switchboard ---------------------------------------------------------------------------------
// A wooden console along the nook's back wall, tiles x 8..12: the outside line (a briefcase card, red), then Lin,
// the boss, Kev (their faces, each with a band in the line's colour) and the kitchen (a red wall phone: it is on
// the outside line). Each column: a card, a lamp (a dim glass in the line's colour until it lights), a brass jack,
// and a patch cord whose plug rests on the shelf's front edge, the cord hanging below. Your ring: the plug rises
// into the jack, the jack lights in the line's colour and the lamp blinks; steady while someone is on the line. The
// 3:30 call: the outside lamp blinks red and a red cord joins it to Lin's jack.
const COLS = ['out', 'lin', 'boss', 'kev', 'kitchen'];
const X0 = 8; // tile x of the first column
const colX = (i) => (X0 + i) * T + T / 2;
const PANEL = { y0: 2, y1: 40 };
const CARD_Y = 6;
const LAMP_Y = 32;
const JACK_Y = 46;
const REST_Y = 57;
const FRONT_Y = 64; // the shelf's front edge
const colourOf = (p) => (p === 'out' ? OUTSIDE : PHONES[p].lamp);

function briefcase(ctx, x, y, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#7b4a25';
  rrect(ctx, -6, -3, 12, 8, 1.5);
  ctx.fill();
  ctx.strokeStyle = '#7b4a25';
  ctx.lineWidth = 1.4;
  rrect(ctx, -2.5, -6, 5, 4, 1);
  ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(-6, 0, 12, 0.9);
  ctx.fillStyle = BRASS;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

// A lamp: lit, it glows in its colour; dark, its glass still shows the colour, dim.
function dim(hex, k) {
  const v = parseInt(hex.slice(1), 16);
  const ch = (s) => Math.round(((v >> s) & 255) * k + 20 * (1 - k));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}
function lamp(ctx, x, y, colour, on) {
  fillCircle(ctx, x, y, 5, '#1b1410');
  fillCircle(ctx, x, y, 4.2, BRASS);
  if (on) {
    glow(ctx, x, y, 13, colour, 0.85);
    fillCircle(ctx, x, y, 3.4, colour);
    fillCircle(ctx, x - 1.1, y - 1.1, 1.2, 'rgba(255,255,255,0.75)');
  } else {
    fillCircle(ctx, x, y, 3.4, dim(colour, 0.42));
    fillCircle(ctx, x - 1.1, y - 1.1, 1, 'rgba(255,255,255,0.22)');
  }
}

function plug(ctx, x, y, colour) {
  ctx.fillStyle = '#2b2420';
  rrect(ctx, x - 3, y - 1, 6, 7, 1.6);
  ctx.fill();
  ctx.fillStyle = colour;
  ctx.fillRect(x - 3, y + 1.2, 6, 2);
  ctx.fillStyle = BRASS;
  ctx.fillRect(x - 1.1, y - 3.5, 2.2, 3);
}

function cord(ctx, x0, y0, x1, y1, colour, sag = 10, width = 2.2) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.bezierCurveTo(x0, y0 + sag, x1, y1 + sag, x1, y1);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function card(ctx, p, x, y) {
  ctx.fillStyle = C.paper;
  rrect(ctx, x - 11, y, 22, 19, 2);
  ctx.fill();
  ctx.fillStyle = colourOf(p);
  rrect(ctx, x - 11, y, 22, 4, 2);
  ctx.fill();
  ctx.fillRect(x - 11, y + 2, 22, 2);
  if (p === 'out') briefcase(ctx, x, y + 12);
  else if (p === 'kitchen') wallPhone(ctx, x - 1, y + 11.5, OUTSIDE, null, 0.58);
  else emoji(ctx, `@${p}`, x, y + 11.5, 14);
}

function switchboard(ctx, info, at, { w, game }, t) {
  const x0 = X0 * T + 1;
  const x1 = (X0 + COLS.length) * T - 1;
  // upright panel against the wall
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(x0 + 2, PANEL.y0 + 3, x1 - x0, PANEL.y1 - PANEL.y0);
  ctx.fillStyle = WOOD;
  rrect(ctx, x0, PANEL.y0, x1 - x0, PANEL.y1 - PANEL.y0, 3);
  ctx.fill();
  ctx.fillStyle = '#2e221b';
  ctx.fillRect(x0 + 3, PANEL.y0 + 3, x1 - x0 - 6, PANEL.y1 - PANEL.y0 - 6);
  // the shelf with the jacks
  ctx.fillStyle = WOOD_DARK;
  ctx.fillRect(x0 - 2, PANEL.y1 - 2, x1 - x0 + 4, FRONT_Y - PANEL.y1 + 2);
  ctx.fillStyle = WOOD_TOP;
  ctx.fillRect(x0 - 2, PANEL.y1 - 2, x1 - x0 + 4, 14);
  ctx.fillStyle = 'rgba(255,220,180,0.18)';
  ctx.fillRect(x0 - 2, PANEL.y1 - 2, x1 - x0 + 4, 2);
  // legs
  ctx.fillStyle = WOOD_DARK;
  ctx.fillRect(x0 + 2, FRONT_Y, 4, 6);
  ctx.fillRect(x1 - 6, FRONT_Y, 4, 6);

  const blink = Math.sin(t * 12) > -0.2;
  const minute = minuteOf(game);
  const job = w.interview === 'ringing' || ((w.interview === 'lin' || w.interview === 'other') && !!w.line_lin);
  const busyFlash = w.interview === 'busy' && minute - w.busyAt < 1.6;
  const act = game.player && game.player.action;
  const pressing = act && /^ring_/.test(act.type) ? act.type.slice(5) : null;
  for (let i = 0; i < COLS.length; i++) {
    const p = COLS[i];
    const x = colX(i);
    const colour = colourOf(p);
    card(ctx, p, x, CARD_Y);
    let on = false;
    if (p === 'out') on = (w.interview === 'ringing' && blink) || job || (busyFlash && blink);
    else if (p === 'lin' && w.interview === 'ringing') on = blink;
    else if (p === 'lin' && job) on = true;
    else if (w[`ring_${p}`] === 'you') on = blink;
    else if (w[`line_${p}`]) on = true;
    lamp(ctx, x, LAMP_Y, colour, on);
    // jack: lit in its line's colour while your hand is at it, and while its cord is in
    const patched = p !== 'out' && (w[`ring_${p}`] === 'you' || !!w[`call_${p}`] || !!w[`line_${p}`]);
    if (pressing === p || patched || (job && (p === 'out' || p === 'lin'))) {
      glow(ctx, x, JACK_Y, 13, colour, pressing === p ? 0.75 + 0.2 * Math.sin(t * 10) : 0.5);
    }
    fillCircle(ctx, x, JACK_Y, 4.6, BRASS);
    fillCircle(ctx, x, JACK_Y, 2.6, '#120d0a');
    if (pressing === p) {
      ctx.strokeStyle = colour;
      ctx.lineWidth = 1.8;
      circle(ctx, x, JACK_Y, 6.5);
      ctx.stroke();
    }
  }
  // patch cords: each plug rests on the shelf's front edge, its cord hanging in a loop below; or it is up in its
  // jack (rising over 0.3 s from the ring), the cord running up to it from the edge
  for (let i = 1; i < COLS.length; i++) {
    const p = COLS[i];
    const x = colX(i);
    const patched = w[`ring_${p}`] === 'you' || !!w[`call_${p}`] || !!w[`line_${p}`];
    const k = patched ? clamp(sinceMin(game, w[`ringAt_${p}`]) / 0.3, 0, 1) : 0;
    const restX = x + 7;
    // the hanging loop below the shelf (a weight keeps it taut)
    cord(ctx, restX, FRONT_Y - 1, x - 5, FRONT_Y - 1, CABLE, 14 - k * 6);
    if (k > 0) {
      const px = restX + (x - restX) * k;
      const py = REST_Y + (JACK_Y + 2 - REST_Y) * k;
      cord(ctx, restX, FRONT_Y - 1, px, py + 5, CABLE, -4);
      plug(ctx, px, py, PHONES[p].lamp);
    } else {
      cord(ctx, restX, FRONT_Y - 1, restX, REST_Y + 5, CABLE, 0);
      plug(ctx, restX, REST_Y, PHONES[p].lamp);
    }
  }
  // the 3:30 call: a red cord from the outside jack to Lin's
  if (job) {
    cord(ctx, colX(0), JACK_Y + 5, colX(1), JACK_Y + 5, OUTSIDE, 9);
    plug(ctx, colX(0), JACK_Y + 2, OUTSIDE);
    plug(ctx, colX(1), JACK_Y + 2, OUTSIDE);
  }
}

// --- Lin's power cord and the socket -------------------------------------------------------------------
// From her phone, off the desk's left edge, down to the floor, coiled there, and up to the double socket on the wall
// by her desk: her plug in the top outlet. Pulled out, the plug lies loose on the floor, prongs bare. Kev charges his
// mobile at the bottom outlet (a white cable to his hand); when he jams her plug back in, it sparks.
const SOCKET = { x: 29, y: 238 };
const TOP = { x: SOCKET.x + 1, y: SOCKET.y - 5 };
const BOTTOM = { x: SOCKET.x + 1, y: SOCKET.y + 5 };
const LOOSE = { x: 58, y: 251 };

function cable(ctx, path, width = 3.2) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const [c, lw] of [[CABLE, width], [CABLE_HI, width * 0.32]]) {
    ctx.strokeStyle = c;
    ctx.lineWidth = lw;
    ctx.beginPath();
    path();
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
}

// A mains plug, its body at (x, y), prongs pointing left (into the wall) or toward `dir` radians.
function mainsPlug(ctx, x, y, dir = Math.PI, bare = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(dir - Math.PI);
  if (bare) {
    ctx.fillStyle = BRASS;
    ctx.fillRect(-7.5, -2.4, 4, 1.4);
    ctx.fillRect(-7.5, 1, 4, 1.4);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  rrect(ctx, -3.5, -3, 9, 7.5, 1.8);
  ctx.fill();
  ctx.fillStyle = '#3a3330';
  rrect(ctx, -4, -3.8, 9, 7.5, 1.8);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(-3, -3, 7, 1.2);
  ctx.restore();
}

function linCord(ctx, info, at, { w, game }, t) {
  const sx = SOCKET.x;
  const sy = SOCKET.y;
  const minute = minuteOf(game);
  // the double socket plate on the wall's side
  ctx.fillStyle = IVORY_DARK;
  rrect(ctx, sx - 4, sy - 11, 7, 22, 1.8);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, sx - 3.5, sy - 10.5, 6, 21, 1.8);
  ctx.fill();
  for (const o of [TOP, BOTTOM]) {
    ctx.fillStyle = '#3b302a';
    ctx.fillRect(o.x - 1.5, o.y - 2.2, 1.2, 1.6);
    ctx.fillRect(o.x - 1.5, o.y + 0.6, 1.2, 1.6);
  }
  // her cord: off the desk, down to the floor, two coils there
  const from = { x: SEAT.lin.x - 9, y: SEAT.lin.y + 2 };
  const coil = { x: 44, y: 250 };
  const end = w.cord === 'in' ? { x: TOP.x + 6, y: TOP.y } : { x: LOOSE.x + 5, y: LOOSE.y };
  cable(ctx, () => {
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(33, from.y, 34, 222);
    ctx.bezierCurveTo(34, 240, 36, 252, coil.x - 6, coil.y + 1);
    for (let i = 0; i < 2; i++) {
      const cx = coil.x + i * 5;
      ctx.bezierCurveTo(cx - 6, coil.y - 8, cx + 8, coil.y - 8, cx + 7, coil.y);
      ctx.bezierCurveTo(cx + 6, coil.y + 5, cx - 4, coil.y + 5, cx - 1, coil.y + 1);
    }
    if (w.cord === 'in') ctx.bezierCurveTo(coil.x + 2, coil.y - 2, end.x + 4, end.y + 10, end.x + 3, end.y);
    else ctx.bezierCurveTo(coil.x + 12, coil.y + 4, end.x + 6, end.y + 3, end.x + 3, end.y);
  });
  if (w.cord === 'in') mainsPlug(ctx, TOP.x + 4, TOP.y, Math.PI);
  else mainsPlug(ctx, LOOSE.x, LOOSE.y, Math.PI - 0.25, true);
  // the spark of her plug jammed back in
  const sp = sinceMin(game, w.sparkAt);
  if (sp >= 0 && sp < 0.7) {
    const k = 1 - sp / 0.7;
    ctx.fillStyle = '#fff3a0';
    starPath(ctx, TOP.x + 2, TOP.y, 4 + 7 * k, 1.8 + 2 * k, 6, t * 9);
    ctx.fill();
    fillCircle(ctx, TOP.x + 2, TOP.y, 2 + 1.5 * k, '#ffffff');
  }
  // Kev's charger in the bottom outlet, its white cable up to his hand
  const kev = npcById(game, 'kev');
  if (w.kevCharge && minute >= w.kevCharge && kev) {
    ctx.fillStyle = '#f4f1e8';
    rrect(ctx, BOTTOM.x, BOTTOM.y - 3, 7, 6, 1.5);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 0.7;
    rrect(ctx, BOTTOM.x, BOTTOM.y - 3, 7, 6, 1.5);
    ctx.stroke();
    const hx = kev.x * T + Math.cos(kev.dir) * 8 + Math.cos(kev.dir + Math.PI / 2) * 3;
    const hy = kev.y * T + Math.sin(kev.dir) * 8 + Math.sin(kev.dir + Math.PI / 2) * 3;
    ctx.strokeStyle = '#f4f1e8';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(BOTTOM.x + 7, BOTTOM.y);
    ctx.bezierCurveTo(BOTTOM.x + 14, BOTTOM.y + 12, hx - 4, hy + 10, hx, hy);
    ctx.stroke();
  }
}

// --- The boss's window ---------------------------------------------------------------------------------
// A wide bright window in his office's back wall: sky, the city, a patch of daylight on his floor. On his own phone
// he stands facing it, his back to the room.
const WIN = { x0: 38, x1: 188, y0: 3, y1: 30 };
function bossWindow(ctx) {
  const { x0, x1, y0, y1 } = WIN;
  // daylight on the floor
  ctx.fillStyle = 'rgba(255,246,214,0.16)';
  ctx.beginPath();
  ctx.moveTo(x0 + 4, y1 + 2);
  ctx.lineTo(x1 - 4, y1 + 2);
  ctx.lineTo(x1 + 14, 150);
  ctx.lineTo(x0 - 6, 150);
  ctx.closePath();
  ctx.fill();
  // frame
  ctx.fillStyle = '#e9e4da';
  rrect(ctx, x0 - 3, y0 - 2, x1 - x0 + 6, y1 - y0 + 4, 2);
  ctx.fill();
  // sky
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, '#8fcdf2');
  g.addColorStop(1, '#e4f5ff');
  ctx.fillStyle = g;
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  // the sun's glare, a cloud
  fillCircle(ctx, x0 + 22, y0 + 8, 5, 'rgba(255,253,230,0.95)');
  glow(ctx, x0 + 22, y0 + 8, 16, '#fffbe0', 0.7);
  fillEllipse(ctx, x0 + 92, y0 + 7, 11, 3, 'rgba(255,255,255,0.85)');
  fillEllipse(ctx, x0 + 99, y0 + 5, 7, 3, 'rgba(255,255,255,0.85)');
  // the city
  ctx.fillStyle = '#7fa3bd';
  const towers = [[4, 10], [16, 15], [27, 8], [38, 18], [52, 11], [63, 14], [76, 7], [86, 16], [100, 12], [112, 19], [126, 9], [136, 13]];
  for (const [dx, h] of towers) ctx.fillRect(x0 + dx, y1 - h, 10, h);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (const [dx, h] of towers) for (let r = y1 - h + 2; r < y1 - 2; r += 4) ctx.fillRect(x0 + dx + 2, r, 6, 1);
  // mullions and the sill
  ctx.fillStyle = '#e9e4da';
  for (let i = 1; i < 4; i++) ctx.fillRect(x0 + ((x1 - x0) * i) / 4 - 1.5, y0, 3, y1 - y0);
  ctx.fillRect(x0, y0 + (y1 - y0) * 0.45, x1 - x0, 2);
  ctx.fillStyle = '#c9c1b2';
  ctx.fillRect(x0 - 4, y1, x1 - x0 + 8, 3);
}

// --- Your desk: your red mug, big ------------------------------------------------------------------------
export function bigMug(ctx, x, y, colour = C.tomato, s = 1, t = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillEllipse(ctx, 0.5, 6.5, 7, 2, 'rgba(0,0,0,0.25)');
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(5.6, 1, 3, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = colour;
  rrect(ctx, -5.5, -5, 11, 11.5, 2.2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(2.5, -4.5, 3, 10.5);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(-4, -3.5, 1.4, 7);
  fillEllipse(ctx, 0, -5, 5.5, 1.8, '#5a3418');
  ctx.strokeStyle = 'rgba(240,235,225,0.55)';
  ctx.lineWidth = 1;
  for (const dx of [-2, 1.5]) {
    const k = Math.sin(t * 2 + dx) * 1.2;
    ctx.beginPath();
    ctx.moveTo(dx, -7);
    ctx.quadraticCurveTo(dx + 2 + k, -9.5, dx, -12);
    ctx.stroke();
  }
  ctx.restore();
}
function yourDesk(ctx, info, at, shown, t) {
  bigMug(ctx, 334, 239, C.tomato, 1, t);
}

// decor.props entries: the window, one per phone, the switchboard, Lin's cord, your mug; then the rings and the
// hold tune's notes over all of them (state is the same for all).
const state = (w, game) => ({ w, game });
export const PHONE_PROPS = [
  { tile: 'B', draw: bossWindow, state },
  { tile: '5', draw: switchboard, state },
  { tile: 'O', draw: linCord, state },
  { tile: 'L', draw: DESK('lin'), state },
  { tile: 'B', draw: DESK('boss'), state },
  { tile: 'V', draw: DESK('kev'), state },
  { tile: 'W', draw: kitchenPhone, state },
  { tile: 'P', draw: yourDesk, state },
  { tile: '5', draw: rings, state },
  { tile: '5', draw: holdNotes, state },
];

// --- Things (decor.things): drawn wherever an icon slot says '#<name>' ---------------------------------
const handsetThing = (p) => (ctx, x, y, size) => {
  box(ctx, x, y, size);
  uprightHandset(ctx, 0, 0, PHONES[p].lamp, 15);
};
export const THINGS = {
  // Kev's mobile: a dark slab, its screen lit.
  mobile(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    rrect(ctx, -3.2, -6, 7.4, 13, 1.8);
    ctx.fill();
    ctx.fillStyle = '#26282c';
    rrect(ctx, -3.8, -6.8, 7.4, 13, 1.8);
    ctx.fill();
    ctx.fillStyle = '#86d3ea';
    ctx.fillRect(-2.8, -5.2, 5.4, 8.6);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(-2.8, -5.2, 5.4, 1.4);
    fillCircle(ctx, -0.1, 4.6, 0.8, '#55585e');
  },
  handset_lin: handsetThing('lin'),
  handset_boss: handsetThing('boss'),
  handset_kev: handsetThing('kev'),
  handset_kitchen: handsetThing('kitchen'),
  // The 3:30 call (the title and the HUD): Lin, and her interview's briefcase.
  interview(ctx, x, y, size) {
    box(ctx, x, y, size);
    emoji(ctx, '@lin', -2, -1, 14);
    briefcase(ctx, 4.5, 5, 0.62);
  },
};

// The end cards draw these too.
export { deskPhone, handset, uprightHandset, curlyCord, briefcase, wallPhone, glow, mainsPlug, cable };
