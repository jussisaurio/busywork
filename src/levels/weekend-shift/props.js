// Weekend Shift's furniture with moving parts, drawn as the real things (presentation.js's decor.props):
//   the Saturday roster: a whiteboard on a stand, the week across the top and a big photo of whoever works
//     Saturday in the slot under it (a new face pops up off it, big, for a beat); at 5:00, your place in the
//     half-circle round it outlined while you aren't there
//   the photocopier: a green light; jammed, a red beacon flashing on its lid, a crumpled sheet sticking out of it
//     and a red beep coming off it at every beep; its front open and a spanner turning in it while Kev fixes it
//   the microwave: big green seconds to the DING on its front and a lit door, the noodles (or Lin's fish) turning
//   the phones: yours at the end of your desk, off the hook while it rings the boss's, shaking on a side table in
//     the corner of his office, a dotted line between them; while he talks, its cord runs to the handset at his ear
//   Lin's lunch box on her desk: there until she takes it to the microwave at 4:30, back open and steaming after
// The painters are plain functions (a decor.props draw may be the level's own); THINGS are the '#<name>' things
// (decor.things: in a hand, in the end cards' rows). The end cards (end-scenes.js) draw the board and the photos too.
import { T, rrect, fillCircle, fillEllipse, font, text, hash } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { person } from '../../render/tableau.js';
import { box } from '../../render/things.js';

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
  portrait(ctx, look, sx + sw / 2, fy, 10, t);
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
//   state: 'ok' | 'jammed' (beeping) | 'fixing' (front open, still beeping) | 'fixed'
//   beep: s since its last beep (null: none yet); the beacon flares and a red beep rings off it in time with it
export function drawCopier(ctx, x, y, state, t, s = 1, beep = null) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const jam = state === 'jammed';
  const fixing = state === 'fixing';
  const alarm = jam || fixing;
  const flare = alarm && beep !== null ? Math.max(0, 1 - beep / 0.6) : 0; // 1 at a beep, gone 0.6 s later
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
  if (jam) {
    // a crumpled sheet stuck in the feed on the lid, sticking up out of it, shivering at each beep
    const sh = flare * Math.sin(t * 40) * 1.2;
    ctx.save();
    ctx.translate(11 + sh, -2);
    ctx.rotate(-0.25);
    ctx.fillStyle = C.white;
    ctx.beginPath();
    ctx.moveTo(-7, 2);
    ctx.lineTo(-6, -8);
    ctx.lineTo(-2, -6);
    ctx.lineTo(1, -11);
    ctx.lineTo(4, -7);
    ctx.lineTo(7, -9);
    ctx.lineTo(7, 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.beginPath(); // its creases
    ctx.moveTo(-2, -6);
    ctx.lineTo(-1, 1);
    ctx.moveTo(4, -7);
    ctx.lineTo(3, 1);
    ctx.stroke();
    ctx.fillStyle = 'rgba(42,47,58,0.35)'; // a smudged line of print
    ctx.fillRect(-5, -3, 9, 0.8);
    ctx.restore();
  }
  // the beacon on the lid: green; red and flashing while it beeps, amber with the front open
  const bx = 25;
  const by = -4;
  if (alarm) {
    const k = fixing ? 0.35 + 0.35 * flare : 0.3 + 0.7 * flare;
    const g = ctx.createRadialGradient(bx, by, 1, bx, by, 13);
    g.addColorStop(0, fixing ? `rgba(255,190,60,${k.toFixed(3)})` : `rgba(255,60,40,${k.toFixed(3)})`);
    g.addColorStop(1, 'rgba(255,60,40,0)');
    ctx.fillStyle = g;
    ctx.fillRect(bx - 13, by - 13, 26, 26);
  }
  ctx.fillStyle = '#4a4f55';
  ctx.fillRect(bx - 3.5, by + 1.5, 7, 2);
  ctx.fillStyle = alarm ? (fixing ? '#ffb02e' : flare > 0.05 ? '#ff3b2f' : '#8f2a22') : '#3fd16b';
  ctx.beginPath();
  ctx.arc(bx, by + 1.5, 3, Math.PI, 0);
  ctx.fill();
  fillCircle(ctx, bx - 1, by, 0.9, 'rgba(255,255,255,0.7)');
  // control panel: a little screen
  ctx.fillStyle = '#5d636a';
  rrect(ctx, 18, 8, 11, 7, 1.5);
  ctx.fill();
  ctx.fillStyle = alarm ? '#ffcf4a' : '#9fd7b0';
  ctx.fillRect(19.5, 9.5, 8, 4);
  if (alarm) {
    ctx.fillStyle = '#3a2a10'; // a warning triangle on the screen
    ctx.beginPath();
    ctx.moveTo(23.5, 10);
    ctx.lineTo(26, 13.2);
    ctx.lineTo(21, 13.2);
    ctx.closePath();
    ctx.fill();
  }
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
  if (flare > 0) {
    // the beep: red arcs off the beacon, both sides, spreading as it fades
    const r = 6 + (1 - flare) * 9;
    ctx.strokeStyle = `rgba(232,60,45,${(0.95 * flare).toFixed(3)})`;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    for (let k = 0; k < 2; k++) {
      for (const [a0, a1] of [[-Math.PI * 0.35, Math.PI * 0.15], [Math.PI * 0.85, Math.PI * 1.35]]) {
        ctx.beginPath();
        ctx.arc(bx, by + 1, r + k * 4.5, a0, a1);
        ctx.stroke();
      }
    }
    ctx.lineCap = 'butt';
  }
  ctx.restore();
}

// The microwave on the counter, at (x, y) (the top-left of its door's row, px). left: seconds to the DING while
// cooking, else null: from the moment you start it, big green digits count them down across its top and the door
// glows. fish: Lin's fish is in it (she stands there): lit, the fish going round, a smell coming off it.
function drawMicrowave(ctx, x, y, noodles, left, t, fish = false, glow = true) {
  const cooking = noodles === 'cooking' && left > 0;
  const done = noodles === 'cooking' && !cooking;
  const lit = cooking || (fish && !done);
  const top = y - 9; // the display strip sits above the door
  if (lit && glow) {
    // the light spilling out of the door onto the counter and the floor in front of it
    const pulse = 0.85 + 0.15 * Math.sin(t * 6);
    const g = ctx.createRadialGradient(x + 13, y + 10, 4, x + 13, y + 10, 34);
    g.addColorStop(0, `rgba(255,214,110,${(0.55 * pulse).toFixed(3)})`);
    g.addColorStop(1, 'rgba(255,214,110,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 24, y - 24, 70, 68);
  }
  fillEllipse(ctx, x + 14, y + 23, 15, 3, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = '#9a968c';
  rrect(ctx, x, top + 1, 29, 32, 3);
  ctx.fill();
  ctx.fillStyle = '#ecebe5';
  rrect(ctx, x, top, 29, 30, 3);
  ctx.fill();
  // the display: big digits, the seconds to the DING
  ctx.fillStyle = '#16211b';
  rrect(ctx, x + 3, top + 2, 23, 9, 1.5);
  ctx.fill();
  if (cooking || (done && Math.sin(t * 7) > 0)) {
    const sec = cooking ? Math.ceil(left) : 0;
    ctx.fillStyle = 'rgba(125,255,154,0.25)';
    rrect(ctx, x + 3, top + 2, 23, 9, 1.5);
    ctx.fill();
    text(ctx, sec >= 10 ? String(sec) : `0${sec}`, x + 14.5, top + 6.8, font(9, 'ui-monospace,Menlo,monospace', 'bold'), '#7dff9a');
  }
  // the door window
  ctx.fillStyle = '#2a2724';
  rrect(ctx, x + 2.5, y + 3, 19, 14, 2);
  ctx.fill();
  if (lit) {
    const pulse = 0.88 + 0.12 * Math.sin(t * 6);
    ctx.fillStyle = `rgba(255,214,110,${pulse.toFixed(3)})`;
    rrect(ctx, x + 3.5, y + 4, 17, 12, 1.5);
    ctx.fill();
    fillEllipse(ctx, x + 12, y + 13, 6.5, 2, 'rgba(120,80,30,0.35)');
    const a = t * 2.4; // going round on the plate
    if (cooking) {
      fillEllipse(ctx, x + 12 + Math.cos(a) * 1.5, y + 11, 4.2, 2.6, '#f7f3ea');
      fillEllipse(ctx, x + 12 + Math.cos(a) * 1.5, y + 10.3, 3.2, 1.3, '#e3a33c');
    } else drawFish(ctx, x + 12 + Math.cos(a) * 0.8, y + 10.5, 12.5 * Math.max(0.6, Math.abs(Math.cos(a))), Math.cos(a) < 0);
  } else {
    fillEllipse(ctx, x + 12, y + 11, 4.2, 2.6, done ? '#d8d2c4' : 'rgba(255,255,255,0.08)');
    if (done) fillEllipse(ctx, x + 12, y + 10.3, 3.2, 1.3, '#b98a3a');
  }
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(x + 5, y + 4, 2, 12);
  // the handle
  ctx.fillStyle = '#b8b4aa';
  rrect(ctx, x + 23.5, y + 3, 3, 14, 1.2);
  ctx.fill();
  if (fish && !done) {
    // the smell: green wisps out of the door
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.5 + i / 3) % 1;
      ctx.strokeStyle = `rgba(150,200,90,${(0.7 * (1 - ph)).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const sx = x + 6 + i * 6;
      const sy = top - 1 - ph * 16;
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
      ctx.arc(x + 8 + i * 6 + Math.sin(t * 2 + i) * 2, top - 2 - ph * 14, 2 + ph * 3, 0, Math.PI * 2);
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

// A desk phone at (cx, cy): its base, and its handset on it unless lifted. ring: shaking, with sound marks; gone:
// the handset is off the base (in the boss's hand: THINGS.handset, drawn there by the renderer).
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

// The coiled cord from a phone's base (x0, y0) to its handset (x1, y1): loops along a slack curve.
function drawCord(ctx, x0, y0, x1, y1) {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const nx = -(y1 - y0) / len;
  const ny = (x1 - x0) / len;
  const cx = (x0 + x1) / 2 + Math.abs(nx) * 2;
  const cy = Math.max(y0, y1) + 6; // the slack hangs down
  const loops = Math.max(4, Math.round(len / 3.2));
  ctx.strokeStyle = '#2c2a28';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  for (let i = 0; i <= loops * 10; i++) {
    const s = i / (loops * 10);
    const px = (1 - s) * (1 - s) * x0 + 2 * (1 - s) * s * cx + s * s * x1;
    const py = (1 - s) * (1 - s) * y0 + 2 * (1 - s) * s * cy + s * s * y1;
    const a = s * loops * Math.PI * 2;
    const r = 2.2 * Math.min(1, s * 6, (1 - s) * 6); // tight at both ends
    const x = px + Math.cos(a) * r * 0.8;
    const y = py + Math.sin(a) * r;
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.stroke();
}

// A little side table, square, against the wall (x, y: its tile's corner).
function drawSideTable(ctx, x, y) {
  fillEllipse(ctx, x + 16, y + 24, 12, 3.5, 'rgba(25,15,8,0.22)');
  ctx.fillStyle = '#5a3b26';
  ctx.fillRect(x + 7, y + 14, 2.4, 10);
  ctx.fillRect(x + 22.6, y + 14, 2.4, 10);
  ctx.fillStyle = '#8a5a3a';
  rrect(ctx, x + 4, y + 2, 24, 15, 2.5);
  ctx.fill();
  ctx.fillStyle = '#a06d48';
  rrect(ctx, x + 4, y + 2, 24, 12, 2.5);
  ctx.fill();
}

// A manila folder, a sheet sticking out of it (x, y: its top-left corner).
function drawFolder(ctx, x, y) {
  ctx.fillStyle = 'rgba(25,15,8,0.2)';
  rrect(ctx, x + 1, y + 2, 15, 11, 1.5);
  ctx.fill();
  ctx.fillStyle = '#f4f1e6';
  ctx.fillRect(x + 2.5, y, 11, 3);
  ctx.fillStyle = '#d9b46a';
  rrect(ctx, x, y + 1.5, 15, 10.5, 1.5);
  ctx.fill();
  ctx.fillStyle = '#c49b52';
  rrect(ctx, x + 1, y + 0.5, 6, 2.5, 1);
  ctx.fill();
}

// Where the boss's phone sits on its table (at: the table's tile).
const cornerPhone = (at) => ({ x: at.x * T + 16, y: at.y * T + 9 });

// While the boss's phone rings: the call, a dotted line running from your phone to his, bowed out to the east
// (away from the board and its chairs).
function drawCall(ctx, ax, ay, bx, by, t) {
  const mx = (ax + bx) / 2 + 40;
  const my = Math.min(ay, by) + (Math.abs(ay - by) * 0.35);
  ctx.save();
  ctx.strokeStyle = 'rgba(255,240,200,0.9)';
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.setLineDash([0.01, 7]);
  ctx.lineDashOffset = -t * 40;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.quadraticCurveTo(mx, my, bx, by);
  ctx.stroke();
  ctx.restore();
}

// A new face in the slot, popping up off the board for a beat: it rises out of the slot (sx, sy: the slot's
// centre), big in a white ring with marks bursting round it, and sinks back. k: 0..1 through the beat. side: -1 or
// 1, it drifts that way as it rises (away from you, so your bubble doesn't cover it); 0 straight up.
const POP_RISE = 46; // px above the slot at the top
const POP_DRIFT = 30; // px aside at the top
function drawPop(ctx, look, sx, sy, k, t, side = 0) {
  if (!look || k <= 0 || k >= 1) return;
  const up = k < 0.22 ? k / 0.22 : k > 0.78 ? (1 - k) / 0.22 : 1;
  const ease = 1 - (1 - up) * (1 - up);
  const over = k < 0.22 ? Math.sin(up * Math.PI) * 0.12 : 0; // overshoots a little on the way up
  const r = 10 + 13 * ease + 13 * over;
  const cx = sx + side * POP_DRIFT * ease;
  const cy = sy - POP_RISE * ease;
  ctx.save();
  if (k > 0.12 && k < 0.85) {
    // marks bursting round it
    const b = Math.min(1, (k - 0.12) / 0.3);
    ctx.strokeStyle = `rgba(200,55,45,${(0.9 * (1 - Math.max(0, k - 0.6) / 0.25)).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      const r0 = r + 3 + b * 4;
      const r1 = r0 + 4 + b * 3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.stroke();
    }
  }
  fillCircle(ctx, cx + 1.5, cy + 2.5, r + 2.5, 'rgba(0,0,0,0.25)');
  fillCircle(ctx, cx, cy, r + 2.5, '#fbfcfd');
  portrait(ctx, look, cx, cy, r, t);
  ctx.strokeStyle = MARKER;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 2.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Your place in the half-circle round the board, while you aren't in it: a dashed outline of someone seated,
// on a ring on the floor, pulsing (x, y: the spot's centre, px). hot: blamed, every head turned to it.
export function drawEmptyPlace(ctx, x, y, t, hot) {
  const k = 0.5 + 0.5 * Math.sin(t * (hot ? 7 : 3.5));
  const a = hot ? 0.7 + 0.3 * k : 0.45 + 0.3 * k;
  ctx.save();
  ctx.strokeStyle = `rgba(214,58,45,${a.toFixed(3)})`;
  ctx.fillStyle = `rgba(214,58,45,${(0.1 + 0.1 * k).toFixed(3)})`;
  ctx.lineWidth = hot ? 2 : 1.6;
  ctx.setLineDash([3, 2.5]);
  ctx.lineDashOffset = -t * 6;
  ctx.beginPath();
  ctx.ellipse(x, y + 8, 13 + k * 1.5, 5 + k * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // someone seated: head and shoulders over the chair
  thingSpot(ctx, x, y - 6, 26, hot ? 2 : 1.6, [3, 2.5]);
  ctx.restore();
}

// The outline of a seated person, dashed (lw, dash: px), in the current stroke style: centred on (x, y), size px tall.
function thingSpot(ctx, x, y, size, lw, dash) {
  ctx.save();
  box(ctx, x, y, size);
  const k = size / 16;
  ctx.lineWidth = lw / k;
  ctx.setLineDash(dash.map((d) => d / k));
  ctx.beginPath();
  ctx.arc(0, -4, 3, 0, Math.PI * 2);
  ctx.moveTo(-5.5, 7);
  ctx.lineTo(-5.5, 2.5);
  ctx.quadraticCurveTo(-5.5, -0.5, -2, -0.5);
  ctx.lineTo(2, -0.5);
  ctx.quadraticCurveTo(5.5, -0.5, 5.5, 2.5);
  ctx.lineTo(5.5, 7);
  ctx.stroke();
  ctx.restore();
}

// Lin's lunch box, a plastic tub, centred on (x, y), w px wide. open: the lid off, the fish in it hot and steaming.
function drawLunchBox(ctx, x, y, w, t, open = false) {
  ctx.save();
  ctx.translate(x, y);
  const k = w / 14;
  ctx.scale(k, k);
  fillEllipse(ctx, 0.5, 5, 7.5, 1.8, 'rgba(25,15,8,0.22)');
  ctx.fillStyle = 'rgba(232,240,244,0.95)'; // the tub
  rrect(ctx, -7, -3, 14, 8, 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(90,110,120,0.55)';
  ctx.lineWidth = 0.7;
  ctx.stroke();
  drawFish(ctx, 0, open ? -1.5 : 1, 10, false);
  if (open) {
    fillEllipse(ctx, -3.5, 2.5, 2.5, 1.1, '#f4efe2'); // a bit of rice
    fillEllipse(ctx, 3.5, 2.6, 2.2, 1, '#f4efe2');
    for (let i = 0; i < 3; i++) {
      const ph = ((t ?? 0) * 0.6 + i / 3) % 1;
      ctx.strokeStyle = `rgba(150,200,90,${(0.75 * (1 - ph)).toFixed(3)})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      const sx = -4 + i * 4;
      const sy = -4 - ph * 9;
      ctx.moveTo(sx, sy + 4);
      ctx.quadraticCurveTo(sx + 2.5 * Math.sin((t ?? 0) * 2 + i), sy + 2, sx, sy);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = 'rgba(60,130,200,0.92)'; // the blue lid, snapped on
    rrect(ctx, -7.6, -4.6, 15.2, 3.2, 1.4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(-6, -4, 5, 0.8);
  }
  ctx.restore();
}

// decor.props painters, (ctx, info, tile, shown, t).

// { look, fresh, pulse, pop, popSide, place, empty, hot }: the roster board standing on its tile; pulse: its slot
// throbs (being read out); pop: s into a new face's beat, popSide: the side it drifts to; place, empty: your spot
// round the board (px) and whether to outline it.
export const POP_S = 1.6;
export function paintRoster(ctx, info, at, shown, t) {
  if (shown.empty && shown.place) drawEmptyPlace(ctx, shown.place.x, shown.place.y, t, shown.hot);
  const pulse = shown.pulse ? 0.6 + 0.4 * Math.sin(t * 12) : 0;
  const x = at.x * T + T / 2;
  // its feet a little past the tile's foot, so Saturday's slot sits inside the tile: when you stand south of the
  // board, the lit target's E key cap (above the tile) clears the slot and the face in it
  const y = at.y * T + T + 7;
  drawBoard(ctx, x, y, 1, shown.look, t, { fresh: shown.fresh, pulse });
  if (shown.pop !== null && shown.pop !== undefined) drawPop(ctx, shown.look, x + 5.5, y - 28.5, shown.pop / POP_S, t, shown.popSide);
}

// { copier, beep }: the copier against the north wall.
export function paintCopier(ctx, info, at, shown, t) {
  drawCopier(ctx, at.x * T, at.y * T - 4, shown.copier, t, 1, shown.beep);
}

// { noodles, left, fish }: the microwave on the counter, and the counter on down to the sink.
export function paintMicrowave(ctx, info, at, shown, t) {
  drawCounter(ctx, at.x, at.y, at.y + 1);
  drawMicrowave(ctx, at.x * T + 2, at.y * T + 4, shown.noodles, shown.left, t, shown.fish);
}

// { phone, to: the boss's phone's tile }: your desk phone (on its own tile, at), off the hook while it rings his, and
// the call: dots from yours to his. His (paintBossPhone) draws after, over the end of them.
export function paintMyPhone(ctx, info, at, shown, t) {
  const ax = at.x * T + 14;
  const ay = at.y * T + 13;
  const ringing = shown.phone === 'ringing';
  if (ringing && shown.to) {
    const b = cornerPhone(shown.to);
    drawCall(ctx, ax, ay - 4, b.x, b.y - 4, t);
  }
  drawPhone(ctx, ax, ay, { lifted: ringing }, t);
}

// { phone, hand: px | null }: the boss's phone on its side table (at), shaking while it rings, and none on his desk.
// While he talks its handset is in his hand at his ear (the renderer draws THINGS.handset there), on a coiled cord
// from the base (hand: where the renderer puts that hand): plainly the same phone. Drawn under him.
export function paintBossPhone(ctx, info, at, shown, t) {
  // his desk (render/world.js draws a phone of its own at its top-left corner): a folder lies there instead
  const desk = info.desks.find((d) => d.kind === 'exec');
  if (desk) drawFolder(ctx, desk.x0 * T + 5, desk.y0 * T + 4);
  drawSideTable(ctx, at.x * T, at.y * T);
  const b = cornerPhone(at);
  if (shown.phone === 'talking' && shown.hand) drawCord(ctx, b.x - 7, b.y + 2, shown.hand.x, shown.hand.y + 3);
  drawPhone(ctx, b.x, b.y, { ring: shown.phone === 'ringing', gone: shown.phone === 'talking' }, t);
}

// { lunch: 'cold' | 'away' | 'hot' }: Lin's lunch box at the end of her desk (at): shut, until she takes it to the
// microwave at 4:30; gone while she's away with it; back open and steaming once she's eating.
export function paintLunch(ctx, info, at, shown, t) {
  if (shown.lunch === 'away') return;
  drawLunchBox(ctx, at.x * T + 18, at.y * T + 16, 15, t, shown.lunch === 'hot');
}

// decor.things: the '#<name>' things, painters (ctx, x, y, size, t), centred, about size px tall.
export const THINGS = {
  // the boss's phone's handset, upright, held to an ear
  handset(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.fillStyle = '#3a3734';
    rrect(ctx, -2.2, -6.5, 4.4, 13, 2);
    ctx.fill();
    fillCircle(ctx, 0, -6, 2.8, '#3a3734');
    fillCircle(ctx, 0, 6, 2.6, '#3a3734');
  },
  // Lin's lunch box, shut (carried to the microwave) and open, the fish hot (carried back)
  lunchbox(ctx, x, y, size, t) {
    box(ctx, x, y, size);
    drawLunchBox(ctx, 0, 0, 15, t, false);
  },
  lunchhot(ctx, x, y, size, t) {
    box(ctx, x, y, size);
    drawLunchBox(ctx, 0, 1, 15, t, true);
  },
  // your place round the board, outlined: an empty seat that everyone is looking at
  spot(ctx, x, y, size) {
    const k = size / 16;
    ctx.strokeStyle = '#d63a2d';
    thingSpot(ctx, x, y, size, 1.7 * k, [2.6 * k, 1.8 * k]);
  },
  // the microwave, its door lit and its digits on (the end card's route row: you got them at the DING)
  microwave(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.scale(0.5, 0.5);
    drawMicrowave(ctx, -14.5, -6, 'cooking', 3, 0, false, false);
  },
  // your desk phone, off the hook (the end card's route row: you rang his)
  deskphone(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.scale(0.8, 0.8);
    drawPhone(ctx, -5, 4, { lifted: true }, 0);
  },
};
