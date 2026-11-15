// Early Bus's own drawings: the big wall clocks with a stepladder under each, the street (pavement, kerb, road,
// bus stop sign) and the 4:30 bus. The two world painters are the level's own prop painters (presentation.js
// decor.props names them as draw functions); the end scenes (end-scenes.js) reuse the same pieces at a larger scale.
// All coordinates are logical px.
import { T, clamp, easeOutCubic, fillCircle, fillEllipse, rrect, clockHands } from '../../render/util.js';
import { C } from '../../render/palette.js';

const FRONT = 14; // the wall front face's height (world.js)
const frontY = (y) => y * T + T - FRONT;

export const BUS = ['#e0aa36', '#a97b22']; // the town's buses: mustard, a darker skirt
const ASPHALT = '#4b4b50';
const SLAB = '#c9c5bb';
const SLAB_LINE = 'rgba(80,72,60,0.22)';
const KERB = '#e7e2d6';

// --- the wall clock -------------------------------------------------------------------------------------------
// A round wall clock of radius r centred on (cx, cy), reading `minute` (game minutes since `start`), hung `tilt`
// radians askew. Ticks at every hour, bold at 12/3/6/9; the 12 is a red pip, so a crooked clock reads as crooked.
export function drawBigClock(ctx, cx, cy, r, minute, start, tilt = 0) {
  fillEllipse(ctx, cx + r * 0.15, cy + r * 0.2, r, r, 'rgba(20,12,8,0.30)'); // its shadow on the wall
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  fillCircle(ctx, 0, 0, r, '#1f1814');
  fillCircle(ctx, 0, 0, r * 0.84, C.cream);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const big = i % 3 === 0;
    fillCircle(ctx, Math.cos(a) * r * 0.68, Math.sin(a) * r * 0.68, r * (big ? 0.09 : 0.05), C.ink);
  }
  fillCircle(ctx, 0, -r * 0.68, r * 0.11, C.tomato);
  clockHands(ctx, 0, 0, minute, r * 0.38, r * 0.15, r * 0.62, r * 0.09, C.tomatoDark, start);
  fillCircle(ctx, 0, 0, r * 0.1, C.ink);
  ctx.restore();
}

// --- the stepladder ---------------------------------------------------------------------------------------------
// An aluminium A-frame stepladder seen from the front, standing on (cx, by) (its feet), h px tall.
export function drawStepladder(ctx, cx, by, h) {
  const k = h / 28;
  const top = by - h;
  fillEllipse(ctx, cx, by, 12 * k, 3 * k, 'rgba(30,20,10,0.22)');
  ctx.lineCap = 'round';
  // the back legs, behind
  ctx.strokeStyle = '#6f777c';
  ctx.lineWidth = 2 * k;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + s * 4 * k, top + 3 * k);
    ctx.lineTo(cx + s * 7 * k, by - 2 * k);
    ctx.stroke();
  }
  // the treads
  for (let i = 0; i < 3; i++) {
    const f = (i + 1) / 4;
    const y = top + 3 * k + f * (h - 4 * k);
    const half = 5 * k + f * 4 * k;
    ctx.fillStyle = '#3a3633';
    ctx.fillRect(cx - half, y - 1.2 * k, half * 2, 3.2 * k);
    ctx.fillStyle = C.steel;
    ctx.fillRect(cx - half, y - 1.2 * k, half * 2, 2 * k);
  }
  // the front rails: dark outline, then aluminium
  for (const [w, col] of [[3.4 * k, '#3a3633'], [2 * k, '#d3d8db']]) {
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + s * 5 * k, top + 2 * k);
      ctx.lineTo(cx + s * 9.5 * k, by);
      ctx.stroke();
    }
  }
  ctx.lineCap = 'butt';
  // the top cap, red so the ladder reads from across the room
  ctx.fillStyle = '#3a3633';
  rrect(ctx, cx - 7 * k, top - 1 * k, 14 * k, 5 * k, 1.5 * k);
  ctx.fill();
  ctx.fillStyle = C.tomato;
  rrect(ctx, cx - 6 * k, top - 0.2 * k, 12 * k, 3.2 * k, 1.2 * k);
  ctx.fill();
}

// --- the bus ----------------------------------------------------------------------------------------------------
// A side view of a single-decker bus facing left: front at x, wheels on y (the road), len px long and h px tall.
// doors 0..1: how far its front doors stand open.
export function drawBus(ctx, x, y, len, h, doors = 0) {
  const top = y - h;
  const wr = h * 0.13; // wheel radius
  fillEllipse(ctx, x + len / 2, y - 1, len / 2 + 2, h * 0.08, 'rgba(0,0,0,0.30)');
  // body and skirt
  ctx.fillStyle = BUS[1];
  rrect(ctx, x, top, len, h - wr * 0.6, h * 0.14);
  ctx.fill();
  ctx.fillStyle = BUS[0];
  rrect(ctx, x, top, len, h * 0.72, h * 0.14);
  ctx.fill();
  // roof: a pale strip, the 3/4 view
  ctx.fillStyle = '#f1dca4';
  rrect(ctx, x + h * 0.08, top, len - h * 0.16, h * 0.1, h * 0.05);
  ctx.fill();
  // the windscreen, raked at the front
  const wy0 = top + h * 0.16;
  const wy1 = top + h * 0.5;
  ctx.fillStyle = '#2d3d47';
  ctx.beginPath();
  ctx.moveTo(x + h * 0.06, wy0);
  ctx.lineTo(x + h * 0.26, wy0);
  ctx.lineTo(x + h * 0.26, wy1 + h * 0.12);
  ctx.lineTo(x + h * 0.03, wy1 + h * 0.12);
  ctx.closePath();
  ctx.fill();
  // the door, just behind the windscreen
  const dx = x + h * 0.32;
  const dw = h * 0.42;
  const dTop = top + h * 0.16;
  const dBot = y - wr * 0.7;
  ctx.fillStyle = '#1e2a31';
  ctx.fillRect(dx, dTop, dw, dBot - dTop);
  if (doors > 0) {
    ctx.fillStyle = 'rgba(255,226,160,0.55)'; // the lit step inside
    ctx.fillRect(dx + 1, dBot - h * 0.14, dw - 2, h * 0.12);
  }
  const leaf = (dw / 2) * (1 - 0.8 * clamp(doors, 0, 1));
  ctx.fillStyle = '#3e5360';
  ctx.fillRect(dx, dTop, leaf, dBot - dTop);
  ctx.fillRect(dx + dw - leaf, dTop, leaf, dBot - dTop);
  ctx.fillStyle = BUS[1];
  ctx.fillRect(dx - 1, dTop, 1.5, dBot - dTop);
  ctx.fillRect(dx + dw - 0.5, dTop, 1.5, dBot - dTop);
  // the passenger windows
  const w0 = dx + dw + h * 0.08;
  const w1 = x + len - h * 0.1;
  ctx.fillStyle = '#2d3d47';
  ctx.fillRect(w0, wy0, w1 - w0, wy1 - wy0);
  ctx.fillStyle = BUS[0];
  const panes = Math.max(2, Math.round((w1 - w0) / (h * 0.55)));
  for (let i = 1; i < panes; i++) ctx.fillRect(w0 + ((w1 - w0) * i) / panes - 0.75, wy0, 1.5, wy1 - wy0);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  for (let i = 0; i < panes; i++) ctx.fillRect(w0 + ((w1 - w0) * i) / panes + 2, wy0 + 1.5, 1.6, wy1 - wy0 - 3);
  // a stripe, the headlight, the route board over the windscreen
  ctx.fillStyle = C.tealDark;
  ctx.fillRect(x + 1, top + h * 0.6, len - 2, h * 0.06);
  fillCircle(ctx, x + h * 0.07, top + h * 0.72, h * 0.05, '#fff6d8');
  ctx.fillStyle = '#1f1814';
  ctx.fillRect(x + h * 0.08, top + h * 0.03, h * 0.5, h * 0.1);
  ctx.fillStyle = '#ffb347';
  ctx.fillRect(x + h * 0.12, top + h * 0.055, h * 0.3, h * 0.05);
  // wheels
  for (const wx of [x + h * 0.42 + dw, x + len - h * 0.45]) {
    fillCircle(ctx, wx, y - wr, wr, '#1c1a19');
    fillCircle(ctx, wx, y - wr, wr * 0.45, C.steelDark);
  }
}

// A puff of exhaust behind a bus driving off: three grey blobs drifting back from (x, y), k = 0..1 cycling.
export function drawExhaust(ctx, x, y, t, size = 4) {
  for (let i = 0; i < 3; i++) {
    const f = (t * 1.6 + i / 3) % 1;
    fillCircle(ctx, x + f * size * 7, y - f * size * 2, size * (0.5 + f), `rgba(120,120,125,${(0.5 * (1 - f)).toFixed(3)})`);
  }
}

// --- the bus stop sign ------------------------------------------------------------------------------------------
// A pole standing on (x, by), h px tall, with a round teal head showing a white bus and a timetable board.
export function drawStopSign(ctx, x, by, h) {
  const k = h / 44;
  fillEllipse(ctx, x, by, 6 * k, 2 * k, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = '#56606a';
  ctx.fillRect(x - 1.3 * k, by - h, 2.6 * k, h);
  // the timetable board
  ctx.fillStyle = '#2f3940';
  ctx.fillRect(x - 6 * k, by - h * 0.55, 12 * k, 10 * k);
  ctx.fillStyle = C.white;
  ctx.fillRect(x - 5 * k, by - h * 0.55 + k, 10 * k, 8 * k);
  ctx.fillStyle = 'rgba(40,40,40,0.55)';
  for (let i = 0; i < 3; i++) ctx.fillRect(x - 3.6 * k, by - h * 0.55 + 2.5 * k + i * 2.2 * k, 7.2 * k, 0.9 * k);
  // the head
  const hy = by - h + 6 * k;
  fillCircle(ctx, x, hy, 8.5 * k, '#1f1814');
  fillCircle(ctx, x, hy, 7.3 * k, C.teal);
  // a white bus pictogram
  ctx.fillStyle = C.white;
  rrect(ctx, x - 4.6 * k, hy - 3.4 * k, 9.2 * k, 6 * k, 1.5 * k);
  ctx.fill();
  ctx.fillStyle = C.teal;
  ctx.fillRect(x - 3.4 * k, hy - 2.2 * k, 6.8 * k, 2.2 * k);
  fillCircle(ctx, x - 2.6 * k, hy + 3 * k, 1.2 * k, C.white);
  fillCircle(ctx, x + 2.6 * k, hy + 3 * k, 1.2 * k, C.white);
}

// --- the world painters -----------------------------------------------------------------------------------------

// { minute, start, tilt }: the clock on wall tile `at` (radius 10, hung low on the front face) and the stepladder
// on the floor tile under it, its top just under the clock.
export function officeTimeClock(ctx, info, tile, shown) {
  const cx = tile.x * T + T / 2;
  drawStepladder(ctx, cx, (tile.y + 1) * T + T - 3, 25);
  drawBigClock(ctx, cx, frontY(tile.y) + 5, 10, shown.minute, shown.start, shown.tilt || 0);
}

// The bus timetable (minutes of the day): it pulls in from the right edge at 4:26, stops by 4:27:30 and opens its
// doors at 4:28.
const BUS_IN = 16 * 60 + 26;
const BUS_STOP = 16 * 60 + 27.5;
const BUS_DOORS = 16 * 60 + 28;
const BUS_LEN = 104;
const BUS_H = 40;

// { minute, start }: the pavement outside the lobby's glass door (every ',' tile, and the sign's), the kerb, the road
// along the bottom edge from the door to the right side of the map with the zebra crossing ('=') people go home
// over, the bus stop sign on tile `at`, and the bus when it is due. The road is painted over the bottom wall row:
// only the crossing is walkable.
export function officeTimeStreet(ctx, info, tile, shown) {
  const sx = tile.x * T + T / 2 + 4; // the sign's pole
  const by = (tile.y + 1) * T; // the kerb line
  const rows = shown.rows || null; // the level's map rows (presentation.js)
  const slab = (x, y) => {
    ctx.fillStyle = SLAB;
    ctx.fillRect(x * T, y * T, T, T);
    ctx.fillStyle = SLAB_LINE;
    for (let g = 0; g < T; g += 16) {
      ctx.fillRect(x * T + g, y * T, 1, T);
      ctx.fillRect(x * T, y * T + g, T, 1);
    }
  };
  let cross = null;
  if (rows) {
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === ',' || ch === 'B') slab(x, y);
      if (ch === '=') cross = { x, y };
    }));
  } else {
    for (let y = tile.y - 1; y <= tile.y; y++) for (let x = tile.x - 1; x <= tile.x; x++) slab(x, y);
  }
  // the road: from the lobby's corner to the map's right edge
  const rx0 = (tile.x - 2) * T;
  ctx.fillStyle = ASPHALT;
  ctx.fillRect(rx0, by, 960 - rx0, T);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let x = rx0; x < 960; x += 7) ctx.fillRect(x + ((x * 13) % 5), by + 6 + ((x * 7) % 19), 1.5, 1.5);
  // the bus box at the stop: a yellow outline on the road
  ctx.strokeStyle = '#e8c048';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(rx0 + 6, by + 5, BUS_LEN + 14, T - 9);
  ctx.setLineDash([]);
  // the centre line, further along (not across the crossing)
  ctx.fillStyle = 'rgba(240,236,220,0.7)';
  for (let x = rx0 + BUS_LEN + 40; x < 960; x += 34) {
    if (cross && x + 18 > cross.x * T - 4 && x < (cross.x + 1) * T + 4) continue;
    ctx.fillRect(x, by + T - 4, 18, 2);
  }
  // the zebra crossing: white bars across the road
  if (cross) {
    ctx.fillStyle = 'rgba(244,240,228,0.92)';
    for (let i = 0; i < 4; i++) ctx.fillRect(cross.x * T + 3, by + 3 + i * 7.5, T - 6, 4);
  }
  // the kerb (open at the crossing)
  ctx.fillStyle = KERB;
  ctx.fillRect(rx0, by - 2, 960 - rx0, 4);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(rx0, by + 2, 960 - rx0, 2);
  if (cross) {
    ctx.fillStyle = SLAB;
    ctx.fillRect(cross.x * T + 2, by - 2, T - 4, 4);
  }
  drawStopSign(ctx, sx, by - 3, 40);
  // the bus
  const m = (shown.minute ?? 0) + (shown.start ?? 0);
  if (m < BUS_IN) return;
  const k = easeOutCubic((m - BUS_IN) / (BUS_STOP - BUS_IN));
  const stopX = rx0 + 12;
  const bx = 968 + (stopX - 968) * k;
  const doors = clamp((m - BUS_DOORS) / 0.5, 0, 1);
  drawBus(ctx, bx, by + T - 2, BUS_LEN, BUS_H, doors);
}
