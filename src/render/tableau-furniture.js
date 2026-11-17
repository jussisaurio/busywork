// Furniture and rooms for the end tableaux (render/tableau.js is the rest of the kit). Screen-space coordinates.
import { rrect } from './util.js';
import { C } from './palette.js';
import { drawChair } from './world.js';
import { TAB, floorCarpet, backWall } from './tableau.js';

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
