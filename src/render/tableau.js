// Kit for the hand-drawn end tableaux. A level's endScenes (e.g. src/levels/meeting/end-scenes.js) paint
// the picture on the end card with these; the title screen borrows person() too. Screen-space coordinates.
import { VIEW_W, VIEW_H, hash } from './util.js';
import { C } from './palette.js';
import { personState, resetState } from './characters.js';
import { drawBubble, CONFETTI } from './effects.js';

// The picture window on the end card. The card clips to it before a scene draws.
export const TAB = { x: 190, y: 94, w: 580, h: 240 };

// One reusable person state, reset per figure, facing the viewer.
const P = personState();
export function person(t) {
  resetState(P, t);
  P.dir = Math.PI / 2; P.head = P.dir;
  return P;
}

const BUBBLE = { icons: null, kind: 'speech', age: 1, ttl: 1e9 };
export function bubble(ctx, icons, x, y, age, kind = 'speech', scale = 1) {
  BUBBLE.icons = icons;
  BUBBLE.kind = kind;
  BUBBLE.age = age;
  if (scale === 1) {
    drawBubble(ctx, BUBBLE, x, y);
    return;
  }
  // drawBubble keeps bubbles inside the map, so scale about a point well inside it
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-VIEW_W / 2, -VIEW_H / 2);
  drawBubble(ctx, BUBBLE, VIEW_W / 2, VIEW_H / 2);
  ctx.restore();
}

export function floorCarpet(ctx, x, y, w, h, a = C.carpetA, b = C.carpetB) {
  ctx.fillStyle = a;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = b;
  for (let gy = 0; gy < h; gy += 64) for (let gx = (gy / 64) % 2 ? 64 : 0; gx < w; gx += 128) ctx.fillRect(x + gx, y + gy, 64, 64);
}

export function floorTiles(ctx, x, y, w, h) {
  ctx.fillStyle = C.lobbyA;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C.grout;
  for (let gx = 0; gx <= w; gx += 40) ctx.fillRect(x + gx, y, 1.5, h);
  for (let gy = 0; gy <= h; gy += 40) ctx.fillRect(x, y + gy, w, 1.5);
}

const END_CONFETTI = CONFETTI.slice(0, 5); // no olive here
export function confetti(ctx, x0, w, y0, h, e, n) {
  for (let i = 0; i < n; i++) {
    const sp = 40 + hash(i, 1) * 50;
    const x = x0 + hash(i, 2) * w + Math.sin(e * 3 + i) * 6;
    const y = y0 + ((hash(i, 3) * h + e * sp) % h);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(e * 4 + i);
    ctx.fillStyle = END_CONFETTI[i % END_CONFETTI.length];
    const fw = 6 * Math.abs(Math.cos(e * 8 + i)) + 1;
    ctx.fillRect(-fw / 2, -2, fw, 4);
    ctx.restore();
  }
}

// A plain back wall across the top of the picture, with a baseboard.
export function backWall(ctx, h) {
  ctx.fillStyle = C.wallFront;
  ctx.fillRect(TAB.x, TAB.y, TAB.w, h);
  ctx.fillStyle = C.wallGroove;
  for (let x = TAB.x + 24; x < TAB.x + TAB.w; x += 48) ctx.fillRect(x, TAB.y, 2, h);
  ctx.fillStyle = C.baseboard;
  ctx.fillRect(TAB.x, TAB.y + h - 5, TAB.w, 5);
  ctx.fillStyle = 'rgba(20,12,8,0.18)';
  ctx.fillRect(TAB.x, TAB.y + h, TAB.w, 6);
}
