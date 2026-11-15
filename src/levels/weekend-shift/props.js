// Weekend Shift's furniture with moving parts, drawn as the real things (presentation.js's decor.props):
//   the Saturday roster: a whiteboard on a stand, the week across the top and a big photo of whoever works
//     Saturday in the slot under it
//   the photocopier: a green light, or a red one, a beep and paper sticking out of it while it's jammed; its front
//     open and a spanner turning in it while Kev fixes it
//   the microwave: the noodles (or Lin's fish) turning in a lit window, and the seconds left to the DING
//   the desk phones: yours off the hook and the boss's shaking, with the call between them, while it rings
// The painters are plain functions (a decor.props draw may be the level's own). The end cards (end-scenes.js) draw
// the board and the photos too.
import { T, rrect, fillCircle, fillEllipse, font, text, hash } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { person } from '../../render/tableau.js';

const INK = '#2a2f3a';
const MARKER = '#c8372d';
const ALU = '#b9bec4';
const ALU_DARK = '#8a9097';

// A head-and-shoulders photo of someone, in a circle of radius r: how the game writes a name.
export function portrait(ctx, look, cx, cy, r, t, bg = '#dfe8ee') {
  if (!look) return;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = bg;
  ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  const p = person(t);
  const k = (0.6 * r) / (look.head || 6.6);
  p.scale = k;
  drawPerson(ctx, look, p, cx, cy - 0.12 * r + (2 + 10 * (look.tall || 1)) * k);
  ctx.restore();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = Math.max(0.8, r * 0.12);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// A marker scrawl: a wobbly line, like a name in handwriting.
function scrawl(ctx, x, y, w, color, lw, seed) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  const n = Math.max(3, Math.round(w / 3));
  for (let i = 1; i <= n; i++) ctx.lineTo(x + (w * i) / n, y + (hash(seed, i) - 0.5) * lw * 2.2);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

// The Saturday roster: a whiteboard on a stand, its feet at (x, y), s times its map size (46 x 36 px). Across the
// top, the week in boxes, Saturday's red; under it, a line down to Saturday's slot: a big photo of who works it.
//   look: whose face is in the slot (null: none)
//   opts.fresh: a wet-ink glint (just written); opts.pulse: 0..1, the slot's ring throbs (the boss reading it out)
//   opts.crossed: a face struck out in red beside the slot's (a change someone was found out in)
export function drawBoard(ctx, x, y, s, look, t, opts = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const w = 46;
  const h = 36;
  const bx = -w / 2;
  const by = -14 - h;
  fillEllipse(ctx, 0, 0, 22, 4, 'rgba(25,15,8,0.22)');
  // the stand: two legs and feet
  ctx.fillStyle = ALU_DARK;
  for (const lx of [-15, 15]) {
    ctx.fillRect(lx - 1.2, by + h - 2, 2.4, 16);
    rrect(ctx, lx - 6, -2, 12, 3, 1.5);
    ctx.fill();
  }
  // frame and face
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, bx + 1.5, by + 2, w, h, 2);
  ctx.fill();
  ctx.fillStyle = ALU;
  rrect(ctx, bx, by, w, h, 2);
  ctx.fill();
  ctx.fillStyle = '#fbfcfd';
  ctx.fillRect(bx + 2, by + 2, w - 4, h - 4);
  ctx.fillStyle = 'rgba(160,190,210,0.16)'; // a shine
  ctx.beginPath();
  ctx.moveTo(bx + 6, by + 2);
  ctx.lineTo(bx + 12, by + 2);
  ctx.lineTo(bx + 6, by + h - 2);
  ctx.lineTo(bx + 2, by + h - 2);
  ctx.closePath();
  ctx.fill();
  // the week: seven boxes, the weekdays ticked off, Saturday's red
  const cw = 5.8;
  const c0 = bx + 3.2;
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = i === 5 ? MARKER : i === 6 ? 'rgba(200,55,45,0.28)' : 'rgba(42,47,58,0.2)';
    ctx.fillRect(c0 + i * cw, by + 3.4, cw - 1.3, 3.6);
  }
  const satX = c0 + 5 * cw + (cw - 1.3) / 2;
  // the weekdays' names, faint, down the left
  for (let i = 0; i < 4; i++) scrawl(ctx, bx + 4, by + 12 + i * 5.6, 7, 'rgba(42,47,58,0.3)', 0.9, i * 5 + 2);
  // Saturday's slot, joined to its box
  const sx = bx + 14.5;
  const sw = 28;
  const sy = by + 10;
  const sh = 23;
  const pulse = opts.pulse ?? 0;
  if (pulse > 0) {
    ctx.fillStyle = `rgba(255,80,60,${(0.28 * pulse).toFixed(3)})`;
    rrect(ctx, sx - 2.5, sy - 2.5, sw + 5, sh + 5, 4);
    ctx.fill();
  }
  ctx.strokeStyle = MARKER;
  ctx.lineWidth = 1.1 + pulse * 1.1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(satX, by + 7.4);
  ctx.lineTo(satX, sy);
  ctx.stroke();
  rrect(ctx, sx, sy, sw, sh, 2.5);
  ctx.stroke();
  ctx.lineCap = 'butt';
  const fy = sy + sh / 2;
  if (opts.crossed) {
    portrait(ctx, opts.crossed, sx + 6.5, fy, 5, t);
    ctx.strokeStyle = MARKER;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sx + 1, fy - 5.5);
    ctx.lineTo(sx + 12, fy + 5.5);
    ctx.moveTo(sx + 1, fy + 5.5);
    ctx.lineTo(sx + 12, fy - 5.5);
    ctx.stroke();
    ctx.lineCap = 'butt';
    portrait(ctx, look, sx + 19.5, fy, 8, t);
  } else portrait(ctx, look, sx + sw / 2, fy, 10, t);
  if (opts.fresh) {
    // wet ink: a glint sliding across the new face
    const k = (t * 1.4) % 1;
    ctx.save();
    ctx.beginPath();
    ctx.arc(sx + sw / 2, fy, 10, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = `rgba(255,255,255,${(0.75 * Math.sin(k * Math.PI)).toFixed(3)})`;
    ctx.translate(sx + sw / 2 - 12 + k * 24, fy);
    ctx.rotate(0.5);
    ctx.fillRect(-1.6, -14, 3.2, 28);
    ctx.restore();
  }
  // marker tray along the bottom
  ctx.fillStyle = ALU_DARK;
  ctx.fillRect(bx + 4, by + h - 1, w - 8, 2.5);
  ctx.fillStyle = MARKER;
  ctx.fillRect(bx + 8, by + h - 2, 6, 1.6);
  ctx.fillStyle = INK;
  ctx.fillRect(bx + 16, by + h - 2, 6, 1.6);
  ctx.restore();
}

// A spanner, its jaw at (x, y), turned by rot, len px long.
export function drawSpanner(ctx, x, y, rot, len = 11) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#9aa1a8';
  ctx.fillRect(0, -1.1, len, 2.2);
  fillCircle(ctx, 0, 0, 2.6, '#9aa1a8');
  fillCircle(ctx, -0.9, 0, 1.2, '#2b2a28'); // the jaw's gap
  fillCircle(ctx, len, 0, 1.8, '#9aa1a8');
  ctx.fillStyle = '#c23a2e'; // a red grip
  ctx.fillRect(len * 0.45, -1.4, len * 0.45, 2.8);
  ctx.restore();
}

// A fish, side on, its middle at (x, y), len px long: Lin's lunch.
export function drawFish(ctx, x, y, len, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  const r = len / 2;
  ctx.fillStyle = '#5f7784';
  ctx.beginPath(); // the tail
  ctx.moveTo(r * 0.6, 0);
  ctx.lineTo(r * 1.15, -r * 0.55);
  ctx.lineTo(r * 1.15, r * 0.55);
  ctx.closePath();
  ctx.fill();
  fillEllipse(ctx, -r * 0.15, 0, r * 0.85, r * 0.42, '#7f97a3'); // the body
  fillEllipse(ctx, -r * 0.15, r * 0.14, r * 0.7, r * 0.2, '#d7e1e4'); // its pale belly
  fillCircle(ctx, -r * 0.68, -r * 0.08, Math.max(0.6, r * 0.11), '#1f2326'); // the eye
  ctx.restore();
}

// The photocopier against the wall, seen from the front, its body over the tile at (x, y) (top-left, px).
//   state: 'ok' | 'jammed' (beeping) | 'fixing' (front open) | 'fixed'
export function drawCopier(ctx, x, y, state, t, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const jam = state === 'jammed';
  const fixing = state === 'fixing';
  fillEllipse(ctx, 16, 31, 17, 4, 'rgba(25,15,8,0.25)');
  // output tray on the left, with a copy in it
  ctx.fillStyle = '#9aa0a6';
  ctx.fillRect(-5, 14, 8, 3);
  ctx.fillStyle = C.white;
  ctx.fillRect(-4, 12, 7, 3);
  // body
  ctx.fillStyle = '#7d848b';
  rrect(ctx, 1, 4, 30, 27, 3);
  ctx.fill();
  ctx.fillStyle = '#d8d6cf';
  rrect(ctx, 1, 3, 30, 25, 3);
  ctx.fill();
  // the lid on top
  ctx.fillStyle = '#efede6';
  rrect(ctx, 2, -3, 28, 9, 2);
  ctx.fill();
  ctx.fillStyle = '#b9b6ad';
  ctx.fillRect(2, 5, 28, 1.4);
  // control panel: a little screen and the status light
  ctx.fillStyle = '#5d636a';
  rrect(ctx, 18, 8, 11, 7, 1.5);
  ctx.fill();
  const blink = Math.sin(t * 9) > 0;
  ctx.fillStyle = jam ? (blink ? '#ffcf4a' : '#6b5a2a') : fixing ? '#ffcf4a' : '#9fd7b0';
  ctx.fillRect(19.5, 9.5, 6, 4);
  if (jam || fixing) {
    ctx.fillStyle = '#3a2a10'; // a warning triangle on the screen
    ctx.beginPath();
    ctx.moveTo(22.5, 10);
    ctx.lineTo(25, 13.2);
    ctx.lineTo(20, 13.2);
    ctx.closePath();
    ctx.fill();
  }
  fillCircle(ctx, 27.5, 11.5, 1.3, jam ? (blink ? '#ff3b2f' : '#6b1f1a') : fixing ? '#ffb02e' : '#3fd16b');
  // paper drawers
  for (let i = 0; i < 2; i++) {
    ctx.fillStyle = '#c9c6be';
    ctx.fillRect(3, 17 + i * 5.5, 26, 4.5);
    ctx.fillStyle = '#8f8c85';
    ctx.fillRect(13, 18.5 + i * 5.5, 6, 1.2);
  }
  if (fixing) {
    // the front swung open: the dark insides and a roller
    ctx.fillStyle = '#2b2a28';
    ctx.fillRect(3, 9, 14, 7);
    ctx.fillStyle = '#5a5751';
    ctx.fillRect(4, 11.5, 12, 2);
    ctx.fillStyle = '#c9c6be';
    ctx.save();
    ctx.translate(3, 16);
    ctx.rotate(0.9 + Math.sin(t * 5) * 0.05);
    ctx.fillRect(0, -1, 9, 2.4);
    ctx.restore();
    drawSpanner(ctx, 10, 13, -0.6 + Math.sin(t * 9) * 0.6, 10); // Kev's, turning in the works
  }
  if (jam) {
    // a crumpled page stuck in the slot, shivering with each beep
    const sh = Math.sin(t * 30) * 0.6;
    ctx.fillStyle = C.white;
    ctx.beginPath();
    ctx.moveTo(4 + sh, 9);
    ctx.lineTo(9 + sh, 6.5);
    ctx.lineTo(12 + sh, 9.5);
    ctx.lineTo(15 + sh, 6);
    ctx.lineTo(16 + sh, 12);
    ctx.lineTo(5 + sh, 12.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
  ctx.restore();
}

// The microwave on the counter, at (x, y) (top-left, px). left: seconds to the DING while cooking, else null.
// fish: Lin's fish is in it (she stands there): lit, the fish going round, a smell coming off it.
function drawMicrowave(ctx, x, y, noodles, left, t, fish = false) {
  const cooking = noodles === 'cooking' && left > 0;
  const done = noodles === 'cooking' && !cooking;
  fillEllipse(ctx, x + 14, y + 23, 15, 3, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = '#9a968c';
  rrect(ctx, x, y + 1, 29, 22, 3);
  ctx.fill();
  ctx.fillStyle = '#ecebe5';
  rrect(ctx, x, y, 29, 20, 3);
  ctx.fill();
  // the door window
  ctx.fillStyle = '#2a2724';
  rrect(ctx, x + 2.5, y + 3, 17, 14, 2);
  ctx.fill();
  if (cooking) {
    const pulse = 0.75 + 0.25 * Math.sin(t * 6);
    ctx.fillStyle = `rgba(255,205,96,${pulse.toFixed(3)})`;
    rrect(ctx, x + 3.5, y + 4, 15, 12, 1.5);
    ctx.fill();
    // the bowl going round on the plate
    const a = t * 2.4;
    fillEllipse(ctx, x + 11, y + 13, 6, 2, 'rgba(120,80,30,0.35)');
    fillEllipse(ctx, x + 11 + Math.cos(a) * 1.5, y + 11, 4.2, 2.6, '#f7f3ea');
    fillEllipse(ctx, x + 11 + Math.cos(a) * 1.5, y + 10.3, 3.2, 1.3, '#e3a33c');
  } else if (fish && !done) {
    const pulse = 0.75 + 0.25 * Math.sin(t * 6);
    ctx.fillStyle = `rgba(255,205,96,${pulse.toFixed(3)})`;
    rrect(ctx, x + 3.5, y + 4, 15, 12, 1.5);
    ctx.fill();
    fillEllipse(ctx, x + 11, y + 13, 6, 2, 'rgba(120,80,30,0.35)');
    const a = t * 2.4; // going round on the plate: side on, then end on, then the other side
    drawFish(ctx, x + 11 + Math.cos(a) * 0.8, y + 10.5, 12.5 * Math.max(0.6, Math.abs(Math.cos(a))), Math.cos(a) < 0);
  } else {
    fillEllipse(ctx, x + 11, y + 11, 4.2, 2.6, done ? '#d8d2c4' : 'rgba(255,255,255,0.08)');
    if (done) fillEllipse(ctx, x + 11, y + 10.3, 3.2, 1.3, '#b98a3a');
  }
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(x + 5, y + 4, 2, 12);
  // the panel: the display and two buttons
  ctx.fillStyle = '#1d2a22';
  ctx.fillRect(x + 21, y + 4, 6.5, 4.5);
  if (cooking || (done && Math.sin(t * 7) > 0)) {
    const s = cooking ? Math.ceil(left) : 0;
    text(ctx, s >= 10 ? String(s) : `0${s}`, x + 24.25, y + 6.4, font(4.6, 'ui-monospace,Menlo,monospace', 'bold'), '#7dff9a');
  }
  fillCircle(ctx, x + 24.25, y + 12, 1.6, '#b8b4aa');
  ctx.fillStyle = '#b8b4aa';
  ctx.fillRect(x + 22, y + 15, 4.5, 2);
  if (fish && !done) {
    // the smell: green wisps out of the door
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.5 + i / 3) % 1;
      ctx.strokeStyle = `rgba(150,200,90,${(0.7 * (1 - ph)).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const sx = x + 6 + i * 6;
      const sy = y - 1 - ph * 16;
      ctx.moveTo(sx, sy + 6);
      ctx.quadraticCurveTo(sx + 4 * Math.sin(t * 2 + i), sy + 3, sx, sy);
      ctx.stroke();
    }
  }
  if (done) {
    // steam off the noodles
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.7 + i / 3) % 1;
      ctx.fillStyle = `rgba(255,255,255,${(0.55 * (1 - ph)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x + 8 + i * 6 + Math.sin(t * 2 + i) * 2, y - 2 - ph * 14, 2 + ph * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// The counter under the microwave and the sink beside it, down the east wall: tiles (tx, ty0..ty1).
function drawCounter(ctx, tx, ty0, ty1) {
  const x = tx * T;
  ctx.fillStyle = C.tealDark;
  ctx.fillRect(x + 1, ty0 * T, T - 1, (ty1 - ty0 + 1) * T);
  ctx.fillStyle = C.laminate;
  ctx.fillRect(x + 3, ty0 * T, T - 3, (ty1 - ty0 + 1) * T - 3);
  // a sink and a tap on the lower tile
  const sy = ty1 * T + 6;
  ctx.fillStyle = C.steelDark;
  rrect(ctx, x + 6, sy, 22, 17, 3);
  ctx.fill();
  ctx.fillStyle = '#d5dade';
  rrect(ctx, x + 8, sy + 2, 18, 13, 2);
  ctx.fill();
  fillCircle(ctx, x + 26, sy + 8, 2, C.steelDark);
  fillCircle(ctx, x + 17, sy + 8.5, 1.2, '#9aa3aa');
}

// A desk phone at (cx, cy): its base, and its handset on it unless lifted. ring: shaking, with sound marks.
function drawPhone(ctx, cx, cy, { lifted = false, ring = false, gone = false } = {}, t) {
  fillEllipse(ctx, cx, cy + 5, 8, 2.5, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = '#2c2a28';
  rrect(ctx, cx - 7, cy - 4, 14, 9, 2.5);
  ctx.fill();
  ctx.fillStyle = '#5b5752';
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) ctx.fillRect(cx - 3.5 + i * 2.6, cy + 0.3 + j * 2, 1.5, 1.2);
  if (gone) return;
  const jig = ring ? Math.sin(t * 50) * 1.2 : 0;
  ctx.save();
  if (lifted) {
    ctx.translate(cx + 9, cy - 9);
    ctx.rotate(-0.7);
  } else ctx.translate(cx + jig, cy - 4 - (ring ? Math.abs(Math.sin(t * 25)) * 1.2 : 0));
  ctx.fillStyle = '#3a3734';
  rrect(ctx, -8, -2.2, 16, 4.4, 2);
  ctx.fill();
  fillCircle(ctx, -7, 0, 2.6, '#3a3734');
  fillCircle(ctx, 7, 0, 2.6, '#3a3734');
  ctx.restore();
  if (lifted) {
    ctx.strokeStyle = '#3a3734';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy);
    for (let i = 1; i <= 6; i++) ctx.lineTo(cx - 6 + i * 2.2, cy - 4 - i * 0.8 + (i % 2 ? -1.5 : 1.5));
    ctx.stroke();
  }
  if (ring && Math.sin(t * 8) > -0.2) {
    ctx.strokeStyle = 'rgba(255,240,200,0.95)';
    ctx.lineWidth = 1.4;
    for (const sd of [-1, 1]) {
      for (let k = 0; k < 2; k++) {
        ctx.beginPath();
        ctx.arc(cx, cy - 4, 10 + k * 4, sd < 0 ? Math.PI * 0.8 : -Math.PI * 0.2, sd < 0 ? Math.PI * 1.2 : Math.PI * 0.2);
        ctx.stroke();
      }
    }
  }
}

// While the boss's phone rings: the call, a line of dashes running from your phone to his.
function drawCall(ctx, ax, ay, bx, by, t) {
  const mx = (ax + bx) / 2 - 30;
  const my = Math.min(ay, by) + (Math.abs(ay - by) * 0.35);
  ctx.save();
  ctx.strokeStyle = 'rgba(255,240,200,0.85)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 7]);
  ctx.lineDashOffset = -t * 40;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.quadraticCurveTo(mx, my, bx, by);
  ctx.stroke();
  ctx.restore();
}

// decor.props painters, (ctx, info, tile, shown, t).

// { look, fresh, pulse }: the roster board standing on its tile; pulse: its slot throbs (being read out).
export function paintRoster(ctx, info, at, shown, t) {
  const pulse = shown.pulse ? 0.6 + 0.4 * Math.sin(t * 12) : 0;
  drawBoard(ctx, at.x * T + T / 2, at.y * T + T - 3, 1, shown.look, t, { fresh: shown.fresh, pulse });
}

// { copier }: the copier against the north wall.
export function paintCopier(ctx, info, at, shown, t) {
  drawCopier(ctx, at.x * T, at.y * T - 4, shown.copier, t);
}

// { noodles, left, fish }: the microwave on the counter, and the counter on down to the sink.
export function paintMicrowave(ctx, info, at, shown, t) {
  drawCounter(ctx, at.x, at.y, at.y + 1);
  drawMicrowave(ctx, at.x * T + 2, at.y * T + 4, shown.noodles, shown.left, t, shown.fish);
}

// { phone, boss: {x, y} the boss's desk tile }: your desk phone, his, and the call between them.
export function paintPhones(ctx, info, at, shown, t) {
  const ax = at.x * T + T + 14;
  const ay = at.y * T + 13;
  const bx = shown.boss.x * T - T + 14;
  const by = shown.boss.y * T + 11;
  const ringing = shown.phone === 'ringing';
  if (ringing) drawCall(ctx, ax, ay - 4, bx, by - 4, t);
  drawPhone(ctx, ax, ay, { lifted: ringing }, t);
  drawPhone(ctx, bx, by, { ring: ringing, gone: shown.phone === 'talking' }, t);
}
