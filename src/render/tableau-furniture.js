// Furniture and rooms for the end tableaux (render/tableau.js is the rest of the kit). Screen-space coordinates.
import { rrect, clamp, easeOutCubic } from './util.js';
import { C } from './palette.js';
import { drawChair } from './world.js';
import { drawPerson } from './characters.js';
import { TAB, floorCarpet, backWall, person } from './tableau.js';

// An office picture: carpet over the whole window and a plain back wall `wallH` tall.
export function officeRoom(ctx, wallH, a = C.officeA, b = C.officeB) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, a, b);
  backWall(ctx, wallH);
}

// A swivel chair at (x, y), drawn at `scale` and facing `dir` (radians, as drawChair). `colours` is a seat pair
// [fill, dark] (palette.js OXBLOOD, MUSTARD, ...).
export function chair(ctx, x, y, colours, scale = 2.4, dir = Math.PI / 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawChair(ctx, 0, 0, dir, colours[0], colours[1]);
  ctx.restore();
}

// A plain wooden desk seen from the front: a lit top slab over a dark-edged front. cx the centre, y the top
// edge, w wide, h tall in all.
export function woodDesk(ctx, cx, y, w, h = 46) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(cx - w / 2 + 6, y + h - 2, w, 8);
  ctx.fillStyle = C.deskWood;
  ctx.fillRect(cx - w / 2 + 4, y + 8, w - 8, h - 8);
  ctx.fillStyle = C.deskWoodDark;
  ctx.fillRect(cx - w / 2 + 4, y + 8, w - 8, 3);
  ctx.fillStyle = C.deskWoodTop;
  rrect(ctx, cx - w / 2, y, w, 10, 3);
  ctx.fill();
}

// A walnut desk top, front edge showing: (x, y) its top-left, w wide, `depth` the lit top, `skirt` the whole slab
// with its front edge, `r` the corner radius. opts: shadow { color, dx, h } under it; hi (dy) a highlight line
// along the top, or null for none.
export function walnutDesk(ctx, x, y, w, { depth, skirt, r, shadow, hi = null }) {
  ctx.fillStyle = shadow.color;
  rrect(ctx, x + shadow.dx, y + 8, w, shadow.h, r);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, x, y, w, skirt, r);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, x, y, w, depth, r);
  ctx.fill();
  if (hi !== null) {
    ctx.fillStyle = C.walnutHi;
    ctx.fillRect(x + 8, y + hi, w - 16, 2);
  }
}

// The lift set into the back wall, doors open, cab lit, the down arrow blinking. `lift` { x, y, w, h }: where it
// stands. shine: the pale gleam down each door's edge.
export function drawLift(ctx, t, { x, y, w, h }, { shine = false } = {}) {
  ctx.fillStyle = C.steelDark;
  ctx.fillRect(x - 6, y + 14, w + 12, h - 14);
  ctx.fillStyle = '#f2d9a2'; // lit cab
  ctx.fillRect(x, y + 20, w, h - 20);
  ctx.fillStyle = '#d9bc84';
  ctx.fillRect(x, y + h - 22, w, 22); // cab floor
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x + 8, y + 24, w - 16, 3); // ceiling light
  ctx.fillStyle = C.steel; // doors, slid into the frame
  ctx.fillRect(x, y + 20, 12, h - 20);
  ctx.fillRect(x + w - 12, y + 20, 12, h - 20);
  if (shine) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x + 3, y + 22, 1.5, h - 24);
    ctx.fillRect(x + w - 9, y + 22, 1.5, h - 24);
  }
  ctx.fillStyle = 'rgba(255,236,190,0.22)'; // light spilling onto the carpet
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w + 26, y + h + 44);
  ctx.lineTo(x - 26, y + h + 44);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1f1814'; // floor indicator: a blinking down arrow
  rrect(ctx, x + w / 2 - 12, y + 2, 24, 12, 3);
  ctx.fill();
  ctx.fillStyle = Math.sin(t * 5) > -0.3 ? '#f0b24a' : '#7a5a2a';
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - 5, y + 5);
  ctx.lineTo(x + w / 2 + 5, y + 5);
  ctx.lineTo(x + w / 2, y + 11);
  ctx.closePath();
  ctx.fill();
}

// You (`look`, the player's) and your desk in a box, sweating, walking from x0 to x1 over `secs` (slow at the end) and
// stopping. e: seconds into the scene. dir/head: [while walking, once stopped] in radians. The default is the walk of
// shame to the lift: eyes on the floor, then on the doors.
export function walkWithBox(ctx, look, t, e, x0, x1, { y = 268, secs = 3.6, dir = [0.12, -Math.PI / 2 + 0.25], head = [0.55, -Math.PI / 2 + 0.6] } = {}) {
  const k = clamp(e / secs, 0, 1);
  const walking = k < 0.98;
  const p = person(t);
  p.dir = dir[walking ? 0 : 1];
  p.head = head[walking ? 0 : 1];
  p.pose = walking ? 'walk' : 'stand';
  p.moving = walking;
  p.phase = t * 7;
  p.arms = 'box';
  p.sweat = true;
  p.scale = 2.4;
  drawPerson(ctx, look, p, x0 + (x1 - x0) * easeOutCubic(k), y);
}
