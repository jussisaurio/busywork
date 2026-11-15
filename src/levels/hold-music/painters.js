// The Interview's own prop painters (decor.props draws: (ctx, info, at, shown, t), shown = { w, game }). Everything the
// outcome depends on is drawn on the object: a phone rings (shakes, arcs, glows in its colour), its handset is off
// the cradle and on a curly cord to whoever holds it, the switchboard's plugs, lamps and cords, Lin's cord in its
// socket or loose on the floor.
import { T, rrect, circle, fillCircle, fillEllipse, emoji, clamp } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { GAME_MIN_PER_SEC } from '../../config.js';
import { PHONES, OUTSIDE } from './phones.js';

const IVORY = '#e8dfc8';
const IVORY_DARK = '#b5a888';
const IVORY_SHADE = '#d2c6a8';
const WOOD = '#7a4a2a';
const WOOD_DARK = '#4e2e1a';
const WOOD_TOP = '#93603a';
const BRASS = '#c9a24a';

// Where each phone sits (px): over the desk's mug or built-in phone, the kitchen one on the wall's front face.
const SEAT = {
  lin: { x: 46, y: 207 },
  boss: { x: 78, y: 108 },
  kev: { x: 784, y: 238 },
};
const KITCHEN = { x: 656, y: 20 };

const npcById = (game, id) => (id && game.npcs ? game.npcs.find((n) => n.id === id) : null);
const sinceMin = (game, minute) => ((game.clock ? game.clock.minute : 0) - minute) / GAME_MIN_PER_SEC; // sim s
const focused = (game, x, y) => {
  const f = game.player && game.player.focus;
  return !!f && f.kind === 'interactable' && game.phase === 'day' && Math.floor(f.x) === x && Math.floor(f.y) === y;
};

// Who holds phone p's handset (an npc), or null: someone on its line, or Lin checking her own.
function holderOf(w, game, p) {
  if (w[`line_${p}`]) return npcById(game, w[`line_${p}`]);
  if (p === 'lin' && w.linCheck) return npcById(game, 'lin');
  return null;
}
const ringColour = (w, p) => (w[`ring_${p}`] === 'job' ? OUTSIDE : PHONES[p].lamp);

// Ring arcs either side of (x, y), in colour, pulsing with t.
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

// The handset: a bar with an earpiece and a mouthpiece, in the owner's colour, centred on (x, y).
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

// A rotary desk phone at (x, y): ivory body, dial, the handset on its cradle or off it (a curly cord to `holder`),
// shaking with arcs and a glow while it rings.
function deskPhone(ctx, game, w, p, x, y, t) {
  const ringing = !!w[`ring_${p}`];
  const colour = ringColour(w, p);
  if (ringing) {
    glow(ctx, x, y, 20, colour, 0.45 + 0.25 * Math.sin(t * 14));
    x += Math.sin(t * 55) * 1.3;
  }
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

// The kitchen's wall phone: an ivory box on the wall's front face, its handset hanging on the side.
function kitchenPhone(ctx, info, at, { w, game }, t) {
  let { x, y } = KITCHEN;
  const p = 'kitchen';
  const ringing = !!w.ring_kitchen;
  if (ringing) {
    glow(ctx, x, y + 2, 22, PHONES.kitchen.lamp, 0.45 + 0.25 * Math.sin(t * 14));
    x += Math.sin(t * 55) * 1.2;
  }
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, x - 6, y - 9, 13, 21, 3);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, x - 7, y - 11, 13, 21, 3);
  ctx.fill();
  ctx.strokeStyle = IVORY_DARK;
  ctx.lineWidth = 1;
  rrect(ctx, x - 7, y - 11, 13, 21, 3);
  ctx.stroke();
  fillCircle(ctx, x - 0.5, y + 3, 3.2, '#f7f1e2');
  ctx.strokeStyle = IVORY_DARK;
  circle(ctx, x - 0.5, y + 3, 3.2);
  ctx.stroke();
  const holder = holderOf(w, game, p);
  if (holder) {
    fillCircle(ctx, x + 7, y - 6, 1.4, IVORY_DARK);
    curlyCord(ctx, x + 6, y + 6, holder.x * T + 2, holder.y * T - 12, PHONES.kitchen.lamp);
  } else {
    // the handset hangs upright on the right side
    ctx.fillStyle = PHONES.kitchen.lamp;
    rrect(ctx, x + 6, y - 10, 4, 19, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 8, y - 8, 3, 3.4, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 8, y + 7, 3, 3.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 0.8;
    rrect(ctx, x + 6, y - 10, 4, 19, 2);
    ctx.stroke();
  }
  if (ringing) arcs(ctx, x, y, PHONES.kitchen.lamp, t, 12);
}

// --- The switchboard ---------------------------------------------------------------------------------
// A wooden console along the nook's back wall, tiles x 8..12: the outside line (a briefcase card), then Lin, the
// boss, Kev (their faces) and the kitchen (a mug). Each column: a card, a lamp in the phone's colour, a jack, and a
// plug with its cord resting at the front edge. Your ring: the plug rises into the jack and its lamp blinks; steady
// while someone is on the line. The 3:30 call: the outside lamp blinks red and a red cord joins it to Lin's jack.
const COLS = ['out', 'lin', 'boss', 'kev', 'kitchen'];
const X0 = 8; // tile x of the first column
const colX = (i) => (X0 + i) * T + T / 2;
const PANEL = { y0: 3, y1: 40 };
const JACK_Y = 45;
const REST_Y = 58;

function mug(ctx, x, y) {
  ctx.fillStyle = PHONES.kitchen.lamp;
  rrect(ctx, x - 4, y - 4, 7, 8, 1.5);
  ctx.fill();
  ctx.strokeStyle = PHONES.kitchen.lamp;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x + 3.5, y, 2.4, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(120,110,100,0.7)';
  ctx.lineWidth = 0.9;
  for (const dx of [-2, 1]) {
    ctx.beginPath();
    ctx.moveTo(x + dx, y - 6);
    ctx.quadraticCurveTo(x + dx + 1.5, y - 8, x + dx, y - 10);
    ctx.stroke();
  }
}

function briefcase(ctx, x, y) {
  ctx.fillStyle = '#7b4a25';
  rrect(ctx, x - 6, y - 3, 12, 8, 1.5);
  ctx.fill();
  ctx.strokeStyle = '#7b4a25';
  ctx.lineWidth = 1.4;
  rrect(ctx, x - 2.5, y - 6, 5, 4, 1);
  ctx.stroke();
  ctx.fillStyle = BRASS;
  ctx.fillRect(x - 1, y - 1, 2, 2);
}

function lamp(ctx, x, y, colour, on) {
  fillCircle(ctx, x, y, 4.2, '#1b1410');
  if (on) {
    glow(ctx, x, y, 11, colour, 0.8);
    fillCircle(ctx, x, y, 3.2, colour);
    fillCircle(ctx, x - 1, y - 1, 1.1, 'rgba(255,255,255,0.7)');
  } else {
    fillCircle(ctx, x, y, 3.2, '#3b302a');
    fillCircle(ctx, x - 1, y - 1, 1, 'rgba(255,255,255,0.15)');
  }
}

function plug(ctx, x, y, colour) {
  ctx.fillStyle = '#2b2420';
  rrect(ctx, x - 2.5, y - 1, 5, 6, 1.5);
  ctx.fill();
  ctx.fillStyle = colour;
  ctx.fillRect(x - 2.5, y + 1, 5, 1.6);
  ctx.fillStyle = BRASS;
  ctx.fillRect(x - 1, y - 3, 2, 2.5);
}

function cord(ctx, x0, y0, x1, y1, colour, sag = 10) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.bezierCurveTo(x0, y0 + sag, x1, y1 + sag, x1, y1);
  ctx.stroke();
  ctx.lineCap = 'butt';
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
  ctx.fillRect(x0 + 4, PANEL.y0 + 4, x1 - x0 - 8, PANEL.y1 - PANEL.y0 - 8);
  // the shelf with the jacks
  ctx.fillStyle = WOOD_DARK;
  ctx.fillRect(x0 - 2, PANEL.y1 - 2, x1 - x0 + 4, 26);
  ctx.fillStyle = WOOD_TOP;
  ctx.fillRect(x0 - 2, PANEL.y1 - 2, x1 - x0 + 4, 14);
  ctx.fillStyle = 'rgba(255,220,180,0.18)';
  ctx.fillRect(x0 - 2, PANEL.y1 - 2, x1 - x0 + 4, 2);
  // legs
  ctx.fillStyle = WOOD_DARK;
  ctx.fillRect(x0 + 2, PANEL.y1 + 24, 4, 6);
  ctx.fillRect(x1 - 6, PANEL.y1 + 24, 4, 6);

  const blink = Math.sin(t * 12) > -0.2;
  const minute = game.clock ? game.clock.minute : 0;
  const job = w.interview === 'ringing' || ((w.interview === 'lin' || w.interview === 'other') && !!w.line_lin);
  const busyFlash = w.interview === 'busy' && minute - w.busyAt < 1.6;
  for (let i = 0; i < COLS.length; i++) {
    const p = COLS[i];
    const x = colX(i);
    const isFocus = p !== 'out' && focused(game, X0 + i, 1);
    // card
    ctx.fillStyle = isFocus ? '#fff6d8' : C.paper;
    rrect(ctx, x - 10, PANEL.y0 + 6, 20, 17, 2);
    ctx.fill();
    if (p === 'out') briefcase(ctx, x, PANEL.y0 + 15);
    else if (p === 'kitchen') mug(ctx, x - 1, PANEL.y0 + 16);
    else emoji(ctx, `@${p}`, x, PANEL.y0 + 15, 15);
    // lamp
    const colour = p === 'out' ? OUTSIDE : PHONES[p].lamp;
    let on = false;
    if (p === 'out') on = (w.interview === 'ringing' && blink) || job || (busyFlash && blink);
    else if (p === 'lin' && w.interview === 'ringing') on = blink;
    else if (p === 'lin' && job) on = true;
    else if (w[`ring_${p}`] === 'you') on = blink;
    else if (w[`line_${p}`]) on = true;
    lamp(ctx, x, PANEL.y1 - 8, colour, on);
    // jack
    fillCircle(ctx, x, JACK_Y, 3.4, BRASS);
    fillCircle(ctx, x, JACK_Y, 2, '#120d0a');
    if (isFocus) {
      glow(ctx, x, JACK_Y, 14, '#fff3b0', 0.55 + 0.25 * Math.sin(t * 6));
      ctx.strokeStyle = '#fff3b0';
      ctx.lineWidth = 1.5;
      circle(ctx, x, JACK_Y, 5.5);
      ctx.stroke();
    }
  }
  // plugs: resting at the front edge, or up in their jack (rising over 0.3 s from the ring) with the cord behind
  for (let i = 1; i < COLS.length; i++) {
    const p = COLS[i];
    const x = colX(i);
    const patched = w[`ring_${p}`] === 'you' || !!w[`call_${p}`];
    const k = patched ? clamp(sinceMin(game, w[`ringAt_${p}`]) / 0.3, 0, 1) : 0;
    const restX = x + 6;
    if (k > 0) {
      const px = restX + (x - restX) * k;
      const py = REST_Y + (JACK_Y + 2 - REST_Y) * k;
      cord(ctx, restX, REST_Y + 6, px, py + 4, '#3a2e27', 6);
      plug(ctx, px, py, PHONES[p].lamp);
    } else {
      ctx.strokeStyle = '#3a2e27';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(restX, REST_Y + 4);
      ctx.lineTo(restX, REST_Y + 9);
      ctx.stroke();
      plug(ctx, restX, REST_Y, PHONES[p].lamp);
    }
  }
  // the 3:30 call: a red cord from the outside jack to Lin's
  if (job) {
    cord(ctx, colX(0), JACK_Y + 4, colX(1), JACK_Y + 4, OUTSIDE, 9);
    plug(ctx, colX(0), JACK_Y + 2, OUTSIDE);
    plug(ctx, colX(1), JACK_Y + 2, OUTSIDE);
  }
}

// --- Lin's cord ---------------------------------------------------------------------------------------
// From her phone, off the desk's left edge, down to a socket on the wall by her desk; pulled out, it lies loose on
// the floor with the plug at its end. The socket glows while you can reach it.
const SOCKET = { x: 29, y: 236 };
const LOOSE = { x: 46, y: 248 };

function linCord(ctx, info, at, { w, game }, t) {
  const sx = SOCKET.x;
  const sy = SOCKET.y;
  // the socket plate on the wall's side
  if (focused(game, at.x, at.y)) glow(ctx, sx, sy, 15, '#fff3b0', 0.55 + 0.25 * Math.sin(t * 6));
  ctx.fillStyle = IVORY_DARK;
  rrect(ctx, sx - 3, sy - 7, 6, 14, 1.5);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, sx - 2.5, sy - 6.5, 5, 13, 1.5);
  ctx.fill();
  fillCircle(ctx, sx, sy - 2.5, 0.9, '#3b302a');
  fillCircle(ctx, sx, sy + 2.5, 0.9, '#3b302a');
  const from = { x: SEAT.lin.x - 9, y: SEAT.lin.y + 2 };
  const edge = { x: 33, y: 222 };
  ctx.strokeStyle = '#3a3330';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.quadraticCurveTo(edge.x, from.y, edge.x, edge.y);
  if (w.cord === 'in') {
    ctx.quadraticCurveTo(edge.x + 1, sy - 4, sx + 3, sy);
    ctx.stroke();
    ctx.fillStyle = '#2b2420';
    rrect(ctx, sx + 1, sy - 2.5, 5, 5, 1.2);
    ctx.fill();
  } else {
    // loose: down to the floor, a loop, the plug lying on its side
    ctx.bezierCurveTo(edge.x + 2, 248, 58, 236, 56, 246);
    ctx.bezierCurveTo(54, 254, LOOSE.x + 4, 254, LOOSE.x + 2, LOOSE.y);
    ctx.stroke();
    ctx.fillStyle = '#2b2420';
    rrect(ctx, LOOSE.x - 4, LOOSE.y - 2.5, 6, 5, 1.2);
    ctx.fill();
    ctx.fillStyle = BRASS;
    ctx.fillRect(LOOSE.x - 7, LOOSE.y - 1.6, 3, 1.1);
    ctx.fillRect(LOOSE.x - 7, LOOSE.y + 0.6, 3, 1.1);
  }
  ctx.lineCap = 'butt';
}

// decor.props entries: one per phone, the switchboard and Lin's cord (state is the same for all).
const state = (w, game) => ({ w, game });
export const PHONE_PROPS = [
  { tile: '5', draw: switchboard, state },
  { tile: 'O', draw: linCord, state },
  { tile: 'L', draw: DESK('lin'), state },
  { tile: 'B', draw: DESK('boss'), state },
  { tile: 'V', draw: DESK('kev'), state },
  { tile: 'W', draw: kitchenPhone, state },
];

// The end cards draw these too.
export { deskPhone, handset, curlyCord, briefcase, mug };
