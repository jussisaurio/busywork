// The Layoff List's own drawn things (DESIGN.md "Visual language": the world is drawn, never an emoji).
//   hoodie   Kev's olive hoodie, hood up: items.hoodie.draw (the HUD's hand slot while you wear it)
//   jacket   the boss's navy suit jacket: items.jacket.draw
//   kevbag   Kev's bag, in his hand as he goes home (presentation.js POSES '#kevbag', decor.things)
// Each is a things.js painter (ctx, x, y, size, t): centred on (x, y), about `size` px tall, in the 16 px box.
//   drapedHoodie  the hoodie hung over a chair's backrest, at map scale (presentation.js, end-scenes.js)
import { box } from '../../render/things.js';
import { fillEllipse, fillCircle, rrect } from '../../render/util.js';

const OLIVE = '#738243';
const OLIVE_DARK = '#56622f';
const OLIVE_LINE = '#262b14';
const STRING = '#efe9da';

// A hoodie laid flat, front up: hood at the top, sleeves out, a pocket across the front, drawstrings.
export function hoodie(ctx, x, y, size) {
  box(ctx, x, y, size);
  fillEllipse(ctx, 0.5, 7, 7, 1.3, 'rgba(25,15,8,0.2)');
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = OLIVE_LINE;
  for (const side of [-1, 1]) { // sleeves
    ctx.save();
    ctx.translate(side * 4.6, -3.2);
    ctx.rotate(side * -0.38);
    ctx.fillStyle = OLIVE_DARK;
    rrect(ctx, -1.7, 0, 3.4, 9.4, 1.4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = OLIVE; // body
  rrect(ctx, -4.8, -4, 9.6, 10.6, 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = OLIVE_DARK; // hem and pocket
  ctx.fillRect(-4.4, 5, 8.8, 1.2);
  rrect(ctx, -3, 1.2, 6, 2.6, 1);
  ctx.fill();
  ctx.fillStyle = OLIVE; // hood, its opening dark
  ctx.beginPath();
  ctx.ellipse(0, -4.6, 3.8, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  fillEllipse(ctx, 0, -4.3, 2.2, 1.8, '#1d2010');
  ctx.fillStyle = STRING;
  ctx.fillRect(-1.6, -2.4, 0.7, 3);
  ctx.fillRect(0.9, -2.4, 0.7, 3);
}

// A suit jacket, front on: navy, lapels open on a pale shirt and a red tie.
export function jacket(ctx, x, y, size) {
  box(ctx, x, y, size);
  fillEllipse(ctx, 0.5, 7, 7, 1.3, 'rgba(25,15,8,0.2)');
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = '#0f1726';
  for (const side of [-1, 1]) { // sleeves
    ctx.save();
    ctx.translate(side * 5, -4.6);
    ctx.rotate(side * -0.2);
    ctx.fillStyle = '#1f2c44';
    rrect(ctx, -1.6, 0, 3.2, 10.6, 1.2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = '#2b3a55'; // body
  ctx.beginPath();
  ctx.moveTo(-5.4, -5.6);
  ctx.lineTo(5.4, -5.6);
  ctx.lineTo(5.8, 6.6);
  ctx.lineTo(-5.8, 6.6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#d7e4ee'; // the shirt in the V
  ctx.beginPath();
  ctx.moveTo(-2.6, -5.6);
  ctx.lineTo(2.6, -5.6);
  ctx.lineTo(0, 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9c2a22'; // tie
  ctx.beginPath();
  ctx.moveTo(-0.7, -5.2);
  ctx.lineTo(0.7, -5.2);
  ctx.lineTo(1, -0.8);
  ctx.lineTo(0, 0.4);
  ctx.lineTo(-1, -0.8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4a5d80'; // lapel edges
  ctx.beginPath();
  ctx.moveTo(-2.6, -5.6);
  ctx.lineTo(0, 0.8);
  ctx.lineTo(2.6, -5.6);
  ctx.stroke();
  fillCircle(ctx, 0, 2.6, 0.6, '#c9b26a'); // a button
  fillCircle(ctx, 0, 4.6, 0.6, '#c9b26a');
}

// A slate messenger bag, carried by its top handle: a flap with a buckle.
export function kevbag(ctx, x, y, size) {
  box(ctx, x, y, size);
  ctx.strokeStyle = '#1e2329';
  ctx.lineWidth = 1.4;
  ctx.beginPath(); // the handle
  ctx.moveTo(-3, -2);
  ctx.quadraticCurveTo(0, -8, 3, -2);
  ctx.stroke();
  ctx.lineWidth = 0.8;
  ctx.fillStyle = '#4a5a6a';
  rrect(ctx, -6.5, -2.4, 13, 9.6, 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#3a4754'; // flap
  rrect(ctx, -6.5, -2.4, 13, 5.4, 2);
  ctx.fill();
  ctx.fillStyle = '#c9b26a'; // buckle
  ctx.fillRect(-1.2, 1.6, 2.4, 2);
}

// Kev's hoodie hung over a chair's backrest, at map scale: (cx, backY) the backrest's middle, the seat to the
// north (smaller y) left bare. The shoulders fold over the top rail; the body, hood and sleeves hang down the back
// of the chair, towards the viewer.
export function drapedHoodie(ctx, cx, backY) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = OLIVE_LINE;
  for (const side of [-1, 1]) { // the sleeves, hanging down the sides
    ctx.save();
    ctx.translate(cx + side * 8.2, backY - 1.5);
    ctx.rotate(side * -0.12);
    ctx.fillStyle = OLIVE_DARK;
    rrect(ctx, -2.4, 0, 4.8, 14, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = OLIVE; // cuff
    ctx.fillRect(-2, 11.6, 4, 1.8);
    ctx.restore();
  }
  ctx.fillStyle = OLIVE; // the body, hanging behind the backrest
  ctx.beginPath();
  ctx.moveTo(cx - 8, backY - 2);
  ctx.lineTo(cx + 8, backY - 2);
  ctx.lineTo(cx + 8.6, backY + 13);
  ctx.lineTo(cx - 8.6, backY + 13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = OLIVE_DARK; // hem, and the pocket
  ctx.fillRect(cx - 8.1, backY + 10.6, 16.2, 2);
  rrect(ctx, cx - 5, backY + 6, 10, 3.6, 1.4);
  ctx.fill();
  fillEllipse(ctx, cx, backY + 2.6, 6, 3.8, OLIVE_DARK); // the hood, hanging at the back
  fillEllipse(ctx, cx, backY + 2.2, 3.4, 2, '#1d2010');
  ctx.fillStyle = OLIVE; // the shoulders, folded over the top rail
  rrect(ctx, cx - 9, backY - 4.6, 18, 4.4, 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(cx - 7, backY - 3.8, 14, 1);
}
