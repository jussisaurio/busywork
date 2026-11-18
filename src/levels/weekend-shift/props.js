// Saturday's (id weekend-shift) furniture with moving parts, drawn as the real things (presentation.js's decor.props):
//   the Saturday board: a whiteboard on a stand, the week across the top and a big photo of whoever works
//     Saturday in the slot under it; a write half drawn over it, the marker at it; a new face pops up off it, big,
//     for a beat, and settles in; its black marker in the tray (gone while the boss sits by it: he has it); the slot lit while
//     the boss points at it; your place round it outlined once you're blamed for not being in it
//   the photocopier: a green light; jammed, a red beacon flashing on its lid, a crumpled sheet sticking out of it
//     and red arcs spreading off it at every beep (dashes to Kev while he hears it); its front open, a spanner
//     turning in it and its light amber while Kev fixes it, the sheet gone
//   the microwave: a box on its side, a door window with a turntable in it, a panel of buttons with green digits;
//     your cup of noodles on the counter beside it; started, the seconds to the DING on its panel, the window lit,
//     the cup going round on the turntable and steaming in it (or Lin's fish); after the DING the cup is back on the
//     counter, open and steaming, and the microwave is free
//   the phones: yours at the end of your desk, off the hook while it rings the boss's, shaking on a side table in
//     the corner of his office, a signal running between them; while he talks, its cord runs to the handset at his ear
//   Lin's lunch box on her desk: there until she takes it to the microwave at 4:30, back open and steaming after
// The painters are plain functions (a decor.props draw may be the level's own); THINGS are the '#<name>' things
// (decor.things: in a hand, in the end cards' rows). The end cards (end-scenes.js) draw the board and the photos too.
import { T, rrect, fillCircle, fillEllipse, font, text, hash } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { person } from '../../render/tableau.js';
import { box } from '../../render/things.js';
import { drawChair } from '../../render/world.js';
import { LOOKS } from '../office/looks.js'; // (the board in the end cards' rows: whose face)

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

// The Saturday board: a whiteboard on a stand, its feet at (x, y), s times its map size (46 x 36 px). Across the
// top, the week in boxes, Saturday's red; under it, a line down to Saturday's slot: a big photo of who works it.
//   look: whose face is in the slot (null: none)
//   opts.fresh: a wet-ink glint (just written); opts.glow: the slot lit up (the boss pointing at it)
//   opts.scribble: { look, k }: a new face going in, k of the way: the old one wiped off, then the new one drawn
//   opts.tray: false: the black marker is gone from the tray (in the boss's hand, or in yours)
//   opts.lift: the black marker lifts off its tray (you're at the board, it's there for the taking)
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
  const glow = opts.glow ? 0.75 + 0.25 * Math.sin(t * 6) : 0;
  if (glow > 0) {
    // lit up: a warm light spilling off the slot, past the board's frame
    ctx.save();
    ctx.shadowColor = `rgba(255,190,30,${glow.toFixed(3)})`;
    ctx.shadowBlur = 9 * s;
    ctx.fillStyle = `rgba(255,200,50,${(0.95 * glow).toFixed(3)})`;
    rrect(ctx, sx - 3.5, sy - 3.5, sw + 7, sh + 7, 5);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,240,170,1)';
    rrect(ctx, sx - 1.5, sy - 1.5, sw + 3, sh + 3, 3.5);
    ctx.fill();
    ctx.fillStyle = '#fffdf2';
    ctx.fillRect(sx + 0.5, sy + 0.5, sw - 1, sh - 1);
  }
  ctx.strokeStyle = MARKER;
  ctx.lineWidth = 1.1 + (glow > 0 ? 0.6 : 0);
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
  if (glow > 0) {
    ctx.strokeStyle = `rgba(245,165,20,${glow.toFixed(3)})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(sx + sw / 2, fy, 11.6, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (opts.scribble) drawScribble(ctx, opts.scribble.look, sx + sw / 2, fy, 10, opts.scribble.k, t);
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
  if (opts.lift) {
    // lifting off the tray, bobbing, for you to take: its shadow left on the tray
    const bob = 3.5 + Math.sin(t * 4) * 1.2;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(bx + 16, by + h - 1.5, 7, 1.2);
    drawMarker(ctx, bx + 15, by + h - 2 - bob, -0.18, 10);
  } else if (opts.tray !== false) {
    ctx.fillStyle = INK;
    ctx.fillRect(bx + 16, by + h - 2, 6, 1.6);
  }
  // the eraser sits at the tray's right end, except while it's wiping the slot
  if (!(opts.scribble && opts.scribble.k > 0 && opts.scribble.k < WIPE_K)) drawEraser(ctx, bx + 30, by + h - 1.4, 0.75);
  ctx.restore();
}

// A new face going into the slot (cx, cy, r: the photo's circle), k of the way. First the board's eraser wipes the
// old face off, row by row from the top (k < WIPE_K), leaving clean white; then the black marker draws the new face
// on the clean board, line by line from the top, clean (no hatching: half drawn, it reads as half a face, not a mess).
// No old face shows through.
const SCRIBBLE_ROWS = 5;
export const WIPE_K = 0.35;
function drawScribble(ctx, look, cx, cy, r, k, t) {
  if (!look || k <= 0) return;
  const k1 = Math.min(1, k);
  const wiping = k1 < WIPE_K;
  const kk = wiping ? k1 / WIPE_K : (k1 - WIPE_K) / (1 - WIPE_K);
  const rowH = (2 * r) / SCRIBBLE_ROWS;
  const row = Math.min(SCRIBBLE_ROWS - 1, Math.floor(kk * SCRIBBLE_ROWS));
  const frac = kk >= 1 ? 1 : kk * SCRIBBLE_ROWS - row;
  const top = cy - r;
  const left = cx - r;
  // wiping: rows go left to right, then back (an eraser goes back and forth)
  const penX = wiping && row % 2 ? left + (1 - frac) * 2 * r : left + frac * 2 * r;
  const penY = top + row * rowH + rowH / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  if (wiping) {
    // the wiped part: clean white, a few faint streaks left by the felt
    ctx.beginPath();
    ctx.rect(left, top, 2 * r, row * rowH);
    if (row % 2) ctx.rect(penX, top + row * rowH, left + 2 * r - penX, rowH);
    else ctx.rect(left, top + row * rowH, penX - left, rowH);
    ctx.clip();
    ctx.fillStyle = '#fbfcfd';
    ctx.fillRect(left, top, 2 * r, 2 * r);
    ctx.strokeStyle = 'rgba(42,47,58,0.08)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    for (let i = 0; i <= row; i++) {
      ctx.moveTo(left, top + i * rowH + rowH * 0.5);
      ctx.lineTo(left + 2 * r, top + i * rowH + rowH * 0.5);
    }
    ctx.stroke();
    ctx.restore();
    // the eraser at the edge it's wiping, rubbing
    const jig = Math.sin(t * 30) * 0.9;
    drawEraser(ctx, penX + jig, penY);
    return;
  }
  // drawing: the whole old face is gone, the new one goes on line by line
  ctx.fillStyle = '#fbfcfd';
  ctx.fillRect(left, top, 2 * r, 2 * r);
  ctx.beginPath();
  ctx.rect(left, top, 2 * r, row * rowH);
  ctx.rect(left, top + row * rowH, frac * 2 * r, rowH);
  ctx.clip();
  portrait(ctx, look, cx, cy, r, t, '#fbfcfd');
  ctx.restore();
  // the scribble's leading edge, and the marker at it (jiggling while it draws)
  const jig = Math.sin(t * 40) * 0.8;
  drawMarker(ctx, penX + 0.5, penY + jig, -2.3, 1.3 * r);
}

// The board's eraser, centred at (x, y), s times: a dark plastic back on a pale grey felt pad.
function drawEraser(ctx, x, y, s = 1) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, x - 4 * s + 0.8, y - 2.2 * s + 1, 8 * s, 4.4 * s, 1.2 * s);
  ctx.fill();
  ctx.fillStyle = '#c9ccd0'; // the felt
  rrect(ctx, x - 4 * s, y - 0.4 * s, 8 * s, 2.6 * s, 1 * s);
  ctx.fill();
  ctx.fillStyle = '#3b4250'; // the back
  rrect(ctx, x - 4 * s, y - 2.2 * s, 8 * s, 2.2 * s, 1 * s);
  ctx.fill();
}

// A whiteboard marker, black, its tip at (x, y), pointing along rot (radians), len px long.
export function drawMarker(ctx, x, y, rot, len = 12) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot + Math.PI);
  const w = len * 0.24;
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, 1.5, -w / 2 + 1.2, len - 1.5, w, w / 2);
  ctx.fill();
  ctx.fillStyle = '#1d2027'; // the tip
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len * 0.18, -w * 0.32);
  ctx.lineTo(len * 0.18, w * 0.32);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#eef0f2'; // the barrel
  rrect(ctx, len * 0.16, -w / 2, len * 0.62, w, w * 0.3);
  ctx.fill();
  ctx.fillStyle = INK; // its band, and the cap
  ctx.fillRect(len * 0.34, -w / 2, len * 0.18, w);
  rrect(ctx, len * 0.74, -w / 2 - 0.3, len * 0.26, w + 0.6, w * 0.35);
  ctx.fill();
  ctx.restore();
}

// A spanner, its open jaw at (x, y), turned by rot, len px long: a steel handle, an open jaw at one end (a U), a ring
// at the other.
export function drawSpanner(ctx, x, y, rot, len = 11) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const k = len / 11;
  ctx.scale(k, k);
  const steel = '#c3c9cf';
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(1, -0.4, 10, 2.6);
  ctx.fillStyle = steel;
  ctx.fillRect(1.5, -1.2, 8, 2.4);
  // the open jaw: a disc with a notch out of it
  ctx.beginPath();
  ctx.arc(0, 0, 3.2, 0.75, Math.PI * 2 - 0.75);
  ctx.lineTo(-0.6, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4a4d52';
  ctx.fillRect(-3.4, -0.9, 2.6, 1.8); // the gap between the jaws
  // the ring end
  ctx.strokeStyle = steel;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(11, 0, 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(2.5, -1, 6, 0.6);
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
const BEEP_ARC_S = 1.6; // s a beep's arcs spread (it beeps every 2 s)
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
  // a pot of paper clips on the lid, by the tray end (what jams it: index.js jam_copier)
  ctx.strokeStyle = '#c9ced3';
  ctx.lineWidth = 1.1;
  for (const [cx, a] of [[3.6, -0.35], [5.4, 0.1], [7.2, 0.45]]) {
    ctx.save();
    ctx.translate(cx, -4.5);
    ctx.rotate(a);
    rrect(ctx, -1.1, -4.2, 2.2, 5, 1.1); // a clip's loop, sticking up out of the pot
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = '#3d5a80';
  rrect(ctx, 1.8, -5, 7.4, 6, 1.2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(2.6, -4.4, 1.3, 4.6);
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
    drawSpanner(ctx, 9, 13, -0.6 + Math.sin(t * 9) * 0.6, 13); // Kev's, turning in the works
  }
  const ring = alarm && beep !== null ? Math.max(0, 1 - beep / BEEP_ARC_S) : 0;
  if (ring > 0) {
    // the beep: red arcs off the beacon, both sides, spreading out as they fade (most of the way to the next one)
    const r = 6 + (1 - ring) * 16;
    ctx.strokeStyle = `rgba(232,60,45,${(0.95 * Math.min(1, ring * 1.6)).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let k = 0; k < 3; k++) {
      for (const [a0, a1] of [[-Math.PI * 0.4, Math.PI * 0.2], [Math.PI * 0.8, Math.PI * 1.4]]) {
        ctx.beginPath();
        ctx.arc(bx, by + 1, r + k * 4.5, a0, a1);
        ctx.stroke();
      }
    }
    ctx.lineCap = 'butt';
  }
  ctx.restore();
}

// The microwave on the counter, a box on its side: (x, y) the top-left of its front, px; 31 x 19, its top face
// above. On the left the door: a window, a turntable in it; on the right the panel: digits, buttons. left: seconds
// to the DING while cooking, else null: they count down on the panel, the window lights up, your cup goes round on
// the turntable steaming. fish: Lin's fish is in it (she stands there): lit, the fish going round, a smell coming off
// it. ding: the moment of the DING (the end card's badge): rings off it, the cup in it, 00.
export const BOIL_S = 6; // s the noodles boil over after the ding (index.js DING_TURN: as long as heads stay turned)
const MW_W = 31;
const MW_H = 19;
function drawMicrowave(ctx, x, y, noodles, left, t, fish = false, glow = true, ding = false, boil = 0) {
  const cooking = ding || boil > 0 || (noodles === 'cooking' && left !== null && left > 0);
  const lit = cooking || fish;
  const wx = x + 2.5; // the window
  const wy = y + 3;
  const ww = 18;
  const wh = 13;
  if (lit && glow) {
    // the light spilling out of the window onto the counter and the floor in front of it
    const pulse = 0.85 + 0.15 * Math.sin(t * 6);
    const g = ctx.createRadialGradient(wx + ww / 2, wy + wh, 4, wx + ww / 2, wy + wh, 34);
    g.addColorStop(0, `rgba(255,214,110,${(0.55 * pulse).toFixed(3)})`);
    g.addColorStop(1, 'rgba(255,214,110,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 24, y - 20, 78, 64);
  }
  fillEllipse(ctx, x + MW_W / 2, y + MW_H + 1.5, 16, 3, 'rgba(0,0,0,0.22)');
  // the box: its top, then its front
  ctx.fillStyle = '#d3d0c7';
  rrect(ctx, x + 0.5, y - 5, MW_W - 1, 7, 2.5);
  ctx.fill();
  ctx.fillStyle = '#8d897f';
  rrect(ctx, x, y + 1, MW_W, MW_H + 1, 2.5);
  ctx.fill();
  ctx.fillStyle = '#ecebe5';
  rrect(ctx, x, y, MW_W, MW_H, 2.5);
  ctx.fill();
  // the door window: frame, dark glass, the turntable plate
  ctx.fillStyle = '#b8b4aa';
  rrect(ctx, wx - 1.2, wy - 1.2, ww + 2.4, wh + 2.4, 2.2);
  ctx.fill();
  ctx.fillStyle = '#26231f';
  rrect(ctx, wx, wy, ww, wh, 1.6);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.rect(wx, wy, ww, wh);
  ctx.clip();
  if (lit) {
    const pulse = 0.88 + 0.12 * Math.sin(t * 6);
    ctx.fillStyle = `rgba(255,214,110,${pulse.toFixed(3)})`;
    ctx.fillRect(wx, wy, ww, wh);
  }
  // the turntable: a glass plate, its rim, turning
  fillEllipse(ctx, wx + ww / 2, wy + wh - 3, 7.5, 2.3, lit ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.22)');
  ctx.strokeStyle = lit ? 'rgba(150,110,50,0.6)' : 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.ellipse(wx + ww / 2, wy + wh - 3, 7.5, 2.3, 0, 0, Math.PI * 2);
  ctx.stroke();
  const a = t * 2.4; // going round on the plate
  if (cooking) {
    const cx = wx + ww / 2 + Math.cos(a) * 2.2;
    drawNoodleCup(ctx, cx, wy + wh - 2.5, 0.72, true);
    cupSteam(ctx, cx, wy + wh - 11, t, 0.55); // steam inside the window
  } else if (fish) {
    drawFish(ctx, wx + ww / 2 + Math.cos(a) * 1.5, wy + wh - 5, 12.5 * Math.max(0.6, Math.abs(Math.cos(a))), Math.cos(a) < 0);
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; // the glass's shine
  ctx.fillRect(wx + 2, wy + 1, 1.6, wh - 2);
  // the door's handle, between window and panel
  ctx.fillStyle = '#a9a59b';
  rrect(ctx, x + 21.2, y + 2.5, 1.8, 14, 0.9);
  ctx.fill();
  // the panel: a display (the seconds to the DING), then a grid of buttons and a start button
  const px = x + 24;
  ctx.fillStyle = '#16211b';
  rrect(ctx, px, y + 2.5, 6, 4.6, 1);
  ctx.fill();
  if (cooking) {
    const sec = ding || boil > 0 ? 0 : Math.ceil(left);
    ctx.fillStyle = 'rgba(125,255,154,0.25)';
    rrect(ctx, px, y + 2.5, 6, 4.6, 1);
    ctx.fill();
    text(ctx, sec >= 10 ? String(sec) : `0${sec}`, px + 3, y + 5, font(4.6, 'ui-monospace,Menlo,monospace', 'bold'), '#7dff9a');
  }
  ctx.fillStyle = '#b3afa5';
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) ctx.fillRect(px + 0.5 + i * 3, y + 8.6 + j * 2.2, 2, 1.4);
  ctx.fillStyle = cooking ? '#3fbf63' : '#7d9a86';
  rrect(ctx, px + 0.5, y + 15.4, 5, 1.8, 0.8);
  ctx.fill();
  if (fish && !cooking) {
    // the smell: green wisps off the top
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.5 + i / 3) % 1;
      ctx.strokeStyle = `rgba(150,200,90,${(0.7 * (1 - ph)).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const sx = x + 5 + i * 6;
      const sy = y - 6 - ph * 16;
      ctx.moveTo(sx, sy + 6);
      ctx.quadraticCurveTo(sx + 4 * Math.sin(t * 2 + i), sy + 3, sx, sy);
      ctx.stroke();
    }
  }
  if (boil > 0) drawBoilOver(ctx, x, y, wx, wy, ww, wh, boil, t);
  if (ding) {
    // DING: rings off it, both sides
    ctx.strokeStyle = 'rgba(255,222,120,0.95)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let k = 0; k < 2; k++) {
      for (const [a0, a1] of [[-Math.PI * 0.3, Math.PI * 0.3], [Math.PI * 0.7, Math.PI * 1.3]]) {
        ctx.beginPath();
        ctx.arc(x + MW_W / 2, y + MW_H / 2 - 2, 20 + k * 5, a0, a1);
        ctx.stroke();
      }
    }
    ctx.lineCap = 'butt';
  }
}

// The noodles boiling over (k: 0..1 through it): the window fogs white, foam froths up out of the cup and down the
// glass, and steam pours out round the door and up off the top in big billows, thinning out at the end.
function drawBoilOver(ctx, x, y, wx, wy, ww, wh, k, t) {
  const strong = k < 0.8 ? 1 : (1 - k) / 0.2;
  // fog on the window, and foam piled on the cup and running down the inside of the glass
  ctx.fillStyle = `rgba(250,250,245,${(0.55 * strong + 0.15).toFixed(3)})`;
  rrect(ctx, wx, wy, ww, wh, 1.6);
  ctx.fill();
  ctx.fillStyle = '#fff7e2';
  for (let i = 0; i < 6; i++) {
    const fx = wx + 3 + i * 2.6;
    const drip = 2 + 4 * Math.min(1, k * 3) * hash(i, 7);
    fillCircle(ctx, fx, wy + wh - 6 + Math.sin(t * 5 + i) * 0.5, 1.8, '#fff7e2');
    ctx.fillStyle = '#fff7e2';
    ctx.fillRect(fx - 0.7, wy + wh - 6, 1.4, drip);
  }
  // steam: big billows pouring out of the door's edge and off the top, rolling out into the room (west) and up,
  // each with a soft grey edge so it reads on the pale counter
  for (let i = 0; i < 9; i++) {
    const ph = (t * 0.6 + i / 9) % 1;
    const r = 5 + ph * 14;
    const a = 0.95 * (1 - ph * ph) * strong;
    const px = x + 4 + (i % 3) * 9 - ph * 42 + Math.sin(t * 1.3 + i) * 2;
    const py = y + 2 - ph * 26 - (i % 2) * 5;
    ctx.fillStyle = `rgba(120,120,125,${(0.35 * a).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(px + 0.8, py + 1.2, r + 0.8, 0, Math.PI * 2);
    ctx.fill();
    fillCircle(ctx, px, py, r, `rgba(255,255,255,${a.toFixed(3)})`);
  }
}

// A cup of instant noodles, its foot's centre at (x, y), s times 12 px tall: a paper cup, red band, lid on (open:
// the lid peeled back, the noodles in it).
function drawNoodleCup(ctx, x, y, s, open) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillEllipse(ctx, 0, 0, 6, 1.6, 'rgba(25,15,8,0.25)');
  ctx.fillStyle = '#f7f3ea';
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.lineTo(-5.6, -11);
  ctx.lineTo(5.6, -11);
  ctx.lineTo(4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d6402f'; // the band
  ctx.beginPath();
  ctx.moveTo(-4.9, -6.5);
  ctx.lineTo(-5.3, -9);
  ctx.lineTo(5.3, -9);
  ctx.lineTo(4.9, -6.5);
  ctx.closePath();
  ctx.fill();
  if (open) {
    fillEllipse(ctx, 0, -11, 5.6, 1.6, '#e8b04a'); // the noodles
    ctx.strokeStyle = '#c98a2a';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    for (let i = -4; i <= 3; i += 1.6) {
      ctx.moveTo(i, -11.6);
      ctx.quadraticCurveTo(i + 0.8, -10.2, i + 1.6, -11.4);
    }
    ctx.stroke();
  } else {
    fillEllipse(ctx, 0, -11, 5.8, 1.7, '#e9e6dc'); // the lid
    ctx.fillStyle = '#d6402f';
    ctx.fillRect(4.6, -12.2, 2.4, 1.2); // its tab
  }
  ctx.restore();
}

// Steam curling up off something hot, from (x, y), s times size.
function cupSteam(ctx, x, y, t, s = 1) {
  for (let i = 0; i < 3; i++) {
    const ph = (t * 0.9 + i / 3) % 1;
    ctx.strokeStyle = `rgba(255,255,255,${(0.95 * (1 - ph * 0.8)).toFixed(3)})`;
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    const sx = x + (i - 1) * 2.6 * s;
    const sy = y - ph * 7 * s;
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx + 2 * s * Math.sin(t * 3 + i), sy - 2.5 * s, sx, sy - 5 * s);
    ctx.stroke();
  }
}

// The counter under the microwave, on down the east wall, bare: tiles (tx, ty0..ty1). (No sink, no fridge: nothing
// in the kitchen looks usable but the microwave.)
function drawCounter(ctx, tx, ty0, ty1) {
  const x = tx * T;
  ctx.fillStyle = C.tealDark;
  ctx.fillRect(x + 1, ty0 * T, T - 1, (ty1 - ty0 + 1) * T);
  ctx.fillStyle = C.laminate;
  ctx.fillRect(x + 3, ty0 * T, T - 3, (ty1 - ty0 + 1) * T - 3);
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
    ctx.translate(cx + 13, cy + 1);
    ctx.rotate(0.35);
  } else ctx.translate(cx + jig, cy - 4 - (ring ? Math.abs(Math.sin(t * 25)) * 1.2 : 0));
  ctx.fillStyle = '#3a3734';
  rrect(ctx, -8, -2.2, 16, 4.4, 2);
  ctx.fill();
  fillCircle(ctx, -7, 0, 2.6, '#3a3734');
  fillCircle(ctx, 7, 0, 2.6, '#3a3734');
  ctx.restore();
  if (lifted) drawCord(ctx, cx + 6, cy + 3, cx + 19, cy + 4); // the handset off the hook, beside it, on its coiled cord
  if (ring) {
    // ringing: three arcs either side, dark on a pale halo (they show on any floor), pulsing out
    const pulse = (t * 3) % 1;
    for (const sd of [-1, 1]) {
      for (let k = 0; k < 3; k++) {
        const rad = 9 + k * 4.5 + pulse * 2;
        const a0 = sd < 0 ? Math.PI * 0.78 : -Math.PI * 0.22;
        const a1 = sd < 0 ? Math.PI * 1.22 : Math.PI * 0.22;
        for (const [c, lw] of [['rgba(255,250,235,0.9)', 2.8], ['#2a2f3a', 1.3]]) {
          ctx.strokeStyle = c;
          ctx.lineWidth = lw;
          ctx.beginPath();
          ctx.arc(cx, cy - 2, rad, a0, a1);
          ctx.stroke();
        }
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

// The call: a signal running from your phone to his along a curve bowed up north (over his office, clear of him at
// his desk and of the board): little arcs, like the ones round a ringing phone, travelling towards his. Not dots
// (a row of dots on a curve reads as something thrown).
function drawCall(ctx, ax, ay, bx, by, t) {
  const mx = (ax + bx) / 2;
  const my = Math.min(ay, by) - 34;
  const at = (s) => [(1 - s) * (1 - s) * ax + 2 * (1 - s) * s * mx + s * s * bx, (1 - s) * (1 - s) * ay + 2 * (1 - s) * s * my + s * s * by];
  const len = Math.hypot(bx - ax, by - ay) + 40;
  const n = Math.max(6, Math.round(len / 22));
  const off = (t * 0.6) % (1 / n);
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const s = i / n + off;
    if (s < 0.04 || s > 0.96) continue;
    const [x, y] = at(s);
    const [x2, y2] = at(Math.min(1, s + 0.01));
    const a = Math.atan2(y2 - y, x2 - x);
    for (const [c, lw] of [['rgba(42,47,58,0.5)', 3.4], ['rgba(255,248,225,0.95)', 1.8]]) {
      ctx.strokeStyle = c;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.arc(x - Math.cos(a) * 4, y - Math.sin(a) * 4, 5, a - 0.85, a + 0.85);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// A new face in the slot, popping up off the board for a beat: it rises out of the slot (sx, sy: the slot's
// centre), big in a white ring, a soft ring spreading off it like a ripple, and settles back into the slot. k: 0..1
// through the beat. side: -1 or 1, it drifts that way as it rises (away from you, so your bubble doesn't cover
// it); 0 straight up.
const POP_RISE = 46; // px above the slot at the top
const POP_DRIFT = 30; // px aside at the top
function drawPop(ctx, look, sx, sy, k, t, side = 0) {
  if (!look || k <= 0 || k >= 1) return;
  const up = k < 0.22 ? k / 0.22 : k > 0.7 ? Math.max(0, (1 - k) / 0.3) : 1;
  const ease = up * up * (3 - 2 * up);
  const r = 10 + 13 * ease;
  const cx = sx + side * POP_DRIFT * ease;
  const cy = sy - POP_RISE * ease;
  ctx.save();
  if (k > 0.15 && k < 0.7) {
    // a soft ring spreading off it, fading
    const b = (k - 0.15) / 0.55;
    ctx.strokeStyle = `rgba(255,255,255,${(0.8 * (1 - b)).toFixed(3)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4 + b * 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  fillCircle(ctx, cx + 1.5, cy + 2.5, r + 2.5, 'rgba(0,0,0,0.2)');
  fillCircle(ctx, cx, cy, r + 2.5, '#fbfcfd');
  portrait(ctx, look, cx, cy, r, t);
  ctx.strokeStyle = 'rgba(42,47,58,0.55)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 2.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Your place in the half-circle round the board, while you aren't in it: a dashed outline of your chair (seat, back
// and its five-star foot), on a ring on the floor, pulsing (x, y: the spot's centre, px). Faint while the others
// sit down round the board without you; hot: blamed, every head turned to it.
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
  ctx.ellipse(x, y + 8, 14 + k * 1.5, 5.5 + k * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  thingChair(ctx, x, y, 24, hot ? 2 : 1.6, [3, 2.5]);
  ctx.restore();
}

// The outline of an empty office chair, dashed (lw, dash: px), in the current stroke style, facing you: its back,
// its seat, its post and five-star foot. Centred on (x, y), size px tall.
function thingChair(ctx, x, y, size, lw, dash) {
  ctx.save();
  box(ctx, x, y, size);
  const k = size / 16;
  ctx.lineWidth = lw / k;
  ctx.setLineDash(dash.map((d) => d / k));
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.rect(-4.5, -8, 9, 7); // the back
  ctx.moveTo(-6, 0.5); // the seat
  ctx.lineTo(6, 0.5);
  ctx.lineTo(5, 3);
  ctx.lineTo(-5, 3);
  ctx.closePath();
  ctx.moveTo(0, 3); // the post
  ctx.lineTo(0, 6);
  ctx.moveTo(-5, 8); // the foot
  ctx.lineTo(0, 6);
  ctx.lineTo(5, 8);
  ctx.moveTo(0, 6);
  ctx.lineTo(0, 8.5);
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

// { look, fresh, glow, pop, popSide, place, empty, hot, tray, scribble }: the board standing on its tile; glow:
// its slot lit (the boss pointing at it); pop: s into a new face's beat, popSide: the side it drifts to; place,
// empty: your spot round the board (px) and whether to outline it; tray, scribble: drawBoard's.
export const POP_S = 1.6;
export function paintRoster(ctx, info, at, shown, t) {
  if (shown.empty && shown.place) drawEmptyPlace(ctx, shown.place.x, shown.place.y, t, shown.hot);
  const x = at.x * T + T / 2;
  // its feet a little past the tile's foot, so Saturday's slot sits inside the tile: when you stand south of the
  // board, the lit target's E key cap (above the tile) clears the slot and the face in it
  const y = at.y * T + T + 7;
  drawBoard(ctx, x, y, 1, shown.look, t, { fresh: shown.fresh, glow: shown.glow, tray: shown.tray, lift: shown.lift, scribble: shown.scribble });
  if (shown.pop !== null && shown.pop !== undefined) drawPop(ctx, shown.look, x + 5.5, y - 28.5, shown.pop / POP_S, t, shown.popSide);
}

// A write in progress ({ look, k }), or null: the next face going into Saturday's slot, k of the way drawn. Caught at
// it, it stays half drawn: the caught frame and the end card (end-scenes.js) show it.
const NEXT_FACE = { player: 'kev', kev: 'boss', boss: 'kev' };
export function scribbleOf(game) {
  const w = game?.world;
  const looks = game?.level?.looks;
  if (!w || !looks) return null;
  const a = game.player?.action;
  if (a && (a.type === 'write_boss' || a.type === 'write_kev')) {
    return { look: looks[a.type === 'write_boss' ? 'boss' : 'kev'], k: Math.min(1, a.t / (a.duration || 1)) };
  }
  const c = game.caught;
  const r = game.map?.find?.('R')?.[0];
  const p = game.player;
  if (c && c.reason === 'action' && r && p && Math.hypot(p.x - (r.x + 0.5), p.y - (r.y + 0.5)) < 1.7) {
    return { look: looks[NEXT_FACE[w.roster] ?? 'boss'], k: 0.8 }; // hair and eyes drawn, the chin not yet
  }
  return null;
}

// { copier, beep, kev, gaze }: the copier, on the line from the boss's desk through the board. kev: where Kev's head
// is (px) while he stands at his desk, alerted by the beeping: dashes from him to it (it's his to fix). gaze: the
// boss's head (px) while he sits at his desk looking at it: dashes in his cone's colour from him to it, straight
// through the board (drawn over it: the board paints first).
export function paintCopier(ctx, info, at, shown, t) {
  drawCopier(ctx, at.x * T, at.y * T - 4, shown.copier, t, 1, shown.beep);
  if (shown.gaze) {
    const tx = at.x * T + 16;
    const ty = at.y * T + 6;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,150,60,0.9)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.lineDashOffset = -t * 24;
    ctx.beginPath();
    ctx.moveTo(shown.gaze.x, shown.gaze.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.setLineDash([]);
    // an arrowhead at the copier
    const ang = Math.atan2(ty - shown.gaze.y, tx - shown.gaze.x);
    ctx.fillStyle = 'rgba(255,150,60,0.95)';
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - Math.cos(ang - 0.45) * 8, ty - Math.sin(ang - 0.45) * 8);
    ctx.lineTo(tx - Math.cos(ang + 0.45) * 8, ty - Math.sin(ang + 0.45) * 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  if (shown.kev) {
    ctx.save();
    ctx.strokeStyle = 'rgba(232,60,45,0.75)';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = t * 20;
    ctx.beginPath();
    ctx.moveTo(shown.kev.x, shown.kev.y);
    ctx.lineTo(at.x * T + 30, at.y * T + 8);
    ctx.stroke();
    ctx.restore();
  }
}

// { noodles, left, fish }: the microwave on the counter, your cup of noodles beside it (above it, up the counter),
// and on down the wall. Cold: the cup's lid on. Cooking: the cup's in the microwave. Done (the DING has gone):
// the cup is back on the counter, open and steaming, and the microwave is free (for Lin's fish). In your hand or
// eaten: the counter's bare.
export function paintMicrowave(ctx, info, at, shown, t) {
  drawCounter(ctx, at.x, at.y - 1, at.y + 2);
  const cooking = shown.noodles === 'cooking' && shown.left !== null && shown.left > 0;
  // boiling over: from the ding for BOIL_S s, still in the microwave, nobody coming to stop it
  const since = shown.noodles === 'cooking' && shown.left !== null ? -shown.left : -1;
  const boil = since >= 0 && since < BOIL_S ? Math.max(0.01, since / BOIL_S) : 0;
  const inside = cooking || boil > 0;
  drawMicrowave(ctx, at.x * T + 1, at.y * T + 8, inside ? 'cooking' : 'cold', cooking ? shown.left : null, t, shown.fish && !inside, true, false, boil);
  const cx = at.x * T + 17;
  const cy = (at.y - 1) * T + 26;
  // on the counter unless it's in the microwave, in your hand, or eaten
  const open = shown.noodles === 'ready' || shown.noodles === 'cooking';
  if (!inside && (open || shown.noodles === 'cold')) drawNoodleCup(ctx, cx, cy, 1.5, open);
  if (!inside && open) cupSteam(ctx, cx, cy - 18, t, 1);
}

// { phone, to: the boss's phone's tile }: the supply room's phone on its little table (at), off the hook from the
// moment you ring his until he hangs up, and the call: a signal from yours to his, live the whole time (it's your call).
// His (paintBossPhone) draws after, over the end of them.
export function paintMyPhone(ctx, info, at, shown, t) {
  drawSideTable(ctx, at.x * T, at.y * T);
  const a = cornerPhone(at);
  const live = shown.phone === 'ringing' || shown.phone === 'talking';
  if (live && shown.to) {
    const b = cornerPhone(shown.to);
    drawCall(ctx, a.x, a.y - 4, b.x, b.y - 4, t);
  }
  bigPhone(ctx, a.x, a.y, { lifted: live }, t);
}
// The phones, 1.35 times the size (they're what you go for)
const PHONE_S = 1.35;
function bigPhone(ctx, x, y, opts, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(PHONE_S, PHONE_S);
  drawPhone(ctx, 0, 0, opts, t);
  ctx.restore();
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
  if (shown.phone === 'talking' && shown.hand) drawCord(ctx, b.x - 7 * PHONE_S, b.y + 2 * PHONE_S, shown.hand.x, shown.hand.y + 3);
  // off the hook (3rd call): the handset lies beside the base on its cord, for good
  bigPhone(ctx, b.x, b.y, { ring: shown.phone === 'ringing', gone: shown.phone === 'talking', lifted: shown.phone === 'offhook' }, t);
}

// { lunch: 'cold' | 'away' | 'hot' }: Lin's lunch box at the end of her desk (at): shut, until she takes it to the
// microwave at 4:30; gone while she's away with it; back open and steaming once she's eating.
export function paintLunch(ctx, info, at, shown, t) {
  if (shown.lunch === 'away') return;
  drawLunchBox(ctx, at.x * T + 18, at.y * T + 16, 15, t, shown.lunch === 'hot');
}

// { away, color: [seat, back], at: lin_desk }: Lin's desk chair, at her desk, and while she's away (from 4:30 until
// she's back with her fish) pushed out from it and turned: someone's gone off and will be back.
export function paintLinChair(ctx, info, at, shown, t) {
  const s = shown.at;
  if (!s) return;
  const cx = s.x * T + T / 2 + (shown.away ? 7 : 0);
  const cy = s.y * T + T / 2 + (shown.away ? 8 : 0);
  drawChair(ctx, cx, cy, -Math.PI / 2 + (shown.away ? 0.8 : 0), shown.color[0], shown.color[1]);
}

// decor.things: the '#<name>' things, painters (ctx, x, y, size, t), centred, about size px tall.
// Saturday's slot alone, filling a thing's 16-unit box: the red Saturday tab over a framed photo (scribble: a write
// in it, as drawBoard's).
function miniSlot(ctx, look, scribble, t) {
  ctx.fillStyle = ALU;
  rrect(ctx, -8, -7.5, 16, 15.5, 2);
  ctx.fill();
  ctx.fillStyle = '#fbfcfd';
  ctx.fillRect(-6.8, -6.3, 13.6, 13.1);
  ctx.fillStyle = MARKER;
  ctx.fillRect(-3, -6.3, 6, 2.6);
  portrait(ctx, look, 0, 1.6, 4.8, t ?? 0, '#fbfcfd');
  if (scribble) drawScribble(ctx, scribble.look, 0, 1.6, 4.8, scribble.k, t ?? 0);
}

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
  // your place round the board, outlined: an empty chair that everyone is looking at
  spot(ctx, x, y, size) {
    const k = size / 16;
    ctx.strokeStyle = '#d63a2d';
    thingChair(ctx, x, y, size, 1.7 * k, [2.6 * k, 1.8 * k]);
  },
  // Kev's spanner, in his hand at the copier
  spanner(ctx, x, y, size) {
    box(ctx, x, y, size);
    drawSpanner(ctx, -6, 0, 0, 12);
  },
  // the microwave at its DING: 00 on the display, rings off it (the end card's route row: you got them at the DING)
  microwave(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.scale(0.42, 0.42);
    drawMicrowave(ctx, -MW_W / 2, -MW_H / 2 + 1.5, 'cooking', 0, 0.4, false, false, true);
  },
  // your cup of noodles, in your hand: lid on (dry), and open and steaming (after the ding)
  noodles(ctx, x, y, size) {
    box(ctx, x, y, size);
    drawNoodleCup(ctx, 0, 6, 1.1, false);
  },
  hotnoodles(ctx, x, y, size, t) {
    box(ctx, x, y, size);
    drawNoodleCup(ctx, 0, 6, 1.1, true);
    cupSteam(ctx, 0, -7, t ?? 0, 0.6);
  },
  // the board's black marker, pointing along +x (held, it points where the arm points)
  marker(ctx, x, y, size) {
    box(ctx, x, y, size);
    drawMarker(ctx, 6.5, 0, 0, 13);
  },
  // Saturday's slot, close up, in the end cards' rows: the boss's own face in it (he read it out, and keeps it), and
  // a write caught halfway (your face wiped, Kev's half drawn, the marker at it): what got you in trouble
  rotaboss(ctx, x, y, size, t) {
    box(ctx, x, y, size);
    miniSlot(ctx, LOOKS.boss, null, t);
  },
  rotacaught(ctx, x, y, size, t) {
    box(ctx, x, y, size);
    miniSlot(ctx, LOOKS.player, { look: LOOKS.kev, k: 0.8 }, t);
  },
  // your desk phone, off the hook (the end card's route row: you rang his)
  deskphone(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.scale(0.8, 0.8);
    drawPhone(ctx, -5, 4, { lifted: true }, 0);
  },
};
