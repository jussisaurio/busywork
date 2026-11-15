// The Layoff List's own drawn things (DESIGN.md "Visual language": the world is drawn, never an emoji).
// Things (things.js painters (ctx, x, y, size, t): centred on (x, y), about `size` px tall, in the 16 px box):
//   kevbag    Kev's bag, in his hand as he goes home (presentation.js POSES '#kevbag', decor.things)
//   handset   a desk phone's handset, at Kev's ear when he picks up at 3:01 (POSES '#handset')
// Map-scale painters (presentation.js props), (x, y) in world px:
//   deskPhone  a desk phone: the handset on its cradle (or off it), shaking with a glow and ring arcs while it rings
//   mobile     Lin's mobile lying on her desk, shaking with buzz lines while it buzzes
//   socket     the boss's loose cable: a floor socket behind his desk, the plug half out (static) or pushed home
// The phone pieces follow the interview level's painters (src/levels/interview/painters.js), copied, not shared.
import { box } from '../../render/things.js';
import { fillCircle, rrect, circle, clamp } from '../../render/util.js';

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

const IVORY = '#efe6cf';
const IVORY_SHADE = '#d8ccae';
const IVORY_DARK = '#9d8f6e';
const RING = '#f3e6c8';

// An upright handset in the 16 px box: what Kev holds to his ear.
export function handset(ctx, x, y, size) {
  box(ctx, x, y, size);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  rrect(ctx, -1.2, -6.2, 4, 13.5, 2);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, -1.9, -6.5, 3.8, 13, 1.9);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -5.6, 3.3, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(0, 5.6, 3.3, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = IVORY_DARK;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.ellipse(0, -5.6, 3.3, 2.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, 5.6, 3.3, 2.5, 0, 0, Math.PI * 2);
  ctx.stroke();
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

// The handset lying on its cradle: a bar with an earpiece and a mouthpiece.
function cradled(ctx, x, y, w = 16) {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, x - w / 2, y - 1, w, 5, 2.5);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, x - w / 2 + 2, y - 2.5, w - 4, 4, 2);
  ctx.fill();
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + s * (w / 2 - 2.5), y - 0.5, 3, 3.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = IVORY_DARK;
  ctx.lineWidth = 0.8;
  rrect(ctx, x - w / 2 + 2, y - 2.5, w - 4, 4, 2);
  ctx.stroke();
}

// A desk phone at (x, y): ivory body with a keypad, the handset on its cradle (or gone: `off`, someone holds it),
// shaking with a glow and the bell's arcs while it rings.
export function deskPhone(ctx, x, y, t, { ringing = false, off = false } = {}) {
  if (ringing) {
    glow(ctx, x, y, 20, RING, 0.45 + 0.25 * Math.sin(t * 14));
    x += Math.sin(t * 55) * 1.3;
  }
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, x - 8, y - 3, 16, 11, 3.5);
  ctx.fill();
  ctx.fillStyle = IVORY_SHADE;
  rrect(ctx, x - 8, y - 5, 16, 11, 3.5);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, x - 7, y - 6, 14, 9, 3.5);
  ctx.fill();
  ctx.strokeStyle = IVORY_DARK;
  ctx.lineWidth = 1;
  rrect(ctx, x - 8, y - 6, 16, 12, 3.5);
  ctx.stroke();
  for (let i = 0; i < 3; i++) { // the keypad
    for (let j = 0; j < 2; j++) fillCircle(ctx, x - 3 + i * 3, y + j * 2.4, 0.7, '#6f6553');
  }
  if (off) {
    fillCircle(ctx, x - 5, y - 5, 1.4, IVORY_DARK);
    fillCircle(ctx, x + 5, y - 5, 1.4, IVORY_DARK);
  } else {
    cradled(ctx, x, y - 5);
  }
  if (ringing) arcs(ctx, x, y - 3, RING, t);
}

// Lin's mobile lying on her desk at (x, y), screen up. Buzzing: it rattles sideways, its screen lit, with short buzz
// lines either side.
export function mobile(ctx, x, y, t, buzzing = false) {
  if (buzzing) x += Math.sin(t * 70) * 1.2;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, x - 3, y - 4.5, 7, 10.5, 1.6);
  ctx.fill();
  ctx.fillStyle = '#23262b';
  rrect(ctx, x - 3.5, y - 5.5, 7, 10.5, 1.6);
  ctx.fill();
  ctx.fillStyle = buzzing ? '#bfe3f2' : '#3c4651';
  ctx.fillRect(x - 2.5, y - 4.3, 5, 7.8);
  if (!buzzing) return;
  ctx.strokeStyle = '#2b2f36';
  ctx.lineWidth = 1.1;
  ctx.lineCap = 'round';
  const k = Math.sin(t * 30) > 0 ? 0 : 1;
  for (const s of [-1, 1]) {
    for (let i = 0; i < 2; i++) {
      const bx = x + s * (6 + i * 2.6 + k);
      ctx.beginPath();
      ctx.moveTo(bx, y - 3 + i);
      ctx.lineTo(bx, y + 2 - i);
      ctx.stroke();
    }
  }
  ctx.lineCap = 'butt';
}

// The boss's cable: from the back of his desk (x, y) down to a socket on the floor behind it (sx, sy). out: the
// plug half out of the socket, its brass prongs showing (the static); else pushed home.
export function socket(ctx, x, y, sx, sy, out) {
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; // the socket plate
  rrect(ctx, sx - 4.5, sy - 3.5, 10, 8, 1.6);
  ctx.fill();
  ctx.fillStyle = '#e9e4d8';
  rrect(ctx, sx - 5, sy - 4, 10, 8, 1.6);
  ctx.fill();
  fillCircle(ctx, sx - 1.6, sy, 0.8, '#5a554c');
  fillCircle(ctx, sx + 1.6, sy, 0.8, '#5a554c');
  const px = sx + (out ? 7 : 3.5);
  ctx.strokeStyle = '#26282c'; // the cable, sagging from the desk
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo((x + px) / 2 + 4, (y + sy) / 2 + 3, px + 2.5, sy);
  ctx.stroke();
  ctx.lineCap = 'butt';
  if (out) {
    ctx.fillStyle = '#c9a54a';
    ctx.fillRect(px - 3, sy - 1.8, 3, 1.1);
    ctx.fillRect(px - 3, sy + 0.7, 3, 1.1);
  }
  ctx.fillStyle = '#34363b';
  rrect(ctx, px, sy - 3, 5, 6, 1.4);
  ctx.fill();
}
