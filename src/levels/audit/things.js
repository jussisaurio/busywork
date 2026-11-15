// The audit's things, drawn: no emoji stands in for an object (visual-language.md). Painters for the end scenes
// (end-scenes.js) and for the floor (presentation.js DECOR.props: the sticker on each desk he has counted).
// All of them draw in the current transform; sizes are in its pixels.
import { T, rrect, fillCircle } from '../../render/util.js';

const SILVER = '#c3c7cd';
const SILVER_DARK = '#8f949c';
const BEZEL = '#2a2e35';
const SCREEN = '#86b9dc';
const COUNTED_GREEN = '#3e9b4f';

// The four desks he counts, in his order (index.js INSPECTIONS): the world field the count is recorded in, and the
// right-hand end of the desk top on the map (tile units), where the sticker goes.
const COUNTED = [
  { rec: 'atBoss', x: 6, y: 3 },
  { rec: 'atLin', x: 6, y: 8 },
  { rec: 'atYou', x: 15, y: 8 },
  { rec: 'atKev', x: 24, y: 8 },
];

// DECOR.props entry: once he has counted a desk, a green sticker with a tick stays on its front edge, whatever
// is on the desk afterwards. So a laptop moved off a counted desk leaves the sticker behind.
export const COUNTED_STICKERS = {
  tile: 'P', // any one tile will do: the painter draws on all four desks
  draw: (ctx, info, at, shown) => {
    for (const d of shown) if (d.on) sticker(ctx, (d.x - 0.34) * T, (d.y + 0.72) * T, 4.2);
  },
  state: (w) => COUNTED.map((d) => ({ x: d.x, y: d.y, on: !!w[d.rec] })),
};

// A round inspection sticker, r the radius: white rim, green face, a white tick.
export function sticker(ctx, x, y, r) {
  fillCircle(ctx, x + 0.7, y + 0.9, r + 0.9, 'rgba(0,0,0,0.25)');
  fillCircle(ctx, x, y, r + 0.9, '#fbfbf7');
  fillCircle(ctx, x, y, r, COUNTED_GREEN);
  tick(ctx, x, y, r * 0.62, '#fff', Math.max(1.2, r * 0.32));
}

// A tick mark centred on (x, y), s its half-width.
export function tick(ctx, x, y, s, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s, y + s * 0.05);
  ctx.lineTo(x - s * 0.3, y + s * 0.7);
  ctx.lineTo(x + s, y - s * 0.75);
  ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
}

// An open laptop turned toward us: (x, y) the middle of its front edge, w its width. tilt rotates it about that
// point (one lying where it fell); tag is a sticker colour on the lid's corner (whose it is), or null.
export function drawLaptop(ctx, x, y, w, tilt = 0, tag = null) {
  ctx.save();
  ctx.translate(x, y);
  if (tilt) ctx.rotate(tilt);
  const d = w * 0.2; // depth of the keyboard deck, seen from above
  const lw = w * 0.84; // the lid
  const lh = w * 0.6;
  const top = -d - lh;
  // lid: bezel, lit screen, a few lines of something on it
  ctx.fillStyle = BEZEL;
  rrect(ctx, -lw / 2, top, lw, lh + 1, w * 0.05);
  ctx.fill();
  ctx.fillStyle = SCREEN;
  ctx.fillRect(-lw / 2 + w * 0.05, top + w * 0.05, lw - w * 0.1, lh - w * 0.09);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  for (let i = 0; i < 3; i++) ctx.fillRect(-lw / 2 + w * 0.1, top + w * (0.12 + i * 0.1), lw * (0.55 - i * 0.12), Math.max(1, w * 0.035));
  if (tag) fillCircle(ctx, lw / 2 - w * 0.09, top + w * 0.08, Math.max(1.6, w * 0.045), tag);
  // keyboard deck: a trapezoid, wider at the front
  ctx.fillStyle = SILVER;
  ctx.beginPath();
  ctx.moveTo(-lw / 2, -d);
  ctx.lineTo(lw / 2, -d);
  ctx.lineTo(w / 2, 0);
  ctx.lineTo(-w / 2, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = SILVER_DARK; // the front lip
  ctx.fillRect(-w / 2, 0, w, Math.max(1.5, w * 0.05));
  ctx.fillStyle = 'rgba(40,44,52,0.55)'; // key rows and the trackpad
  for (let r = 0; r < 2; r++) {
    const k = (r + 0.5) / 3;
    const rw = lw + (w - lw) * k;
    ctx.fillRect(-rw * 0.42, -d + d * k - w * 0.012, rw * 0.84, Math.max(1, w * 0.035));
  }
  ctx.fillStyle = 'rgba(40,44,52,0.25)';
  ctx.fillRect(-w * 0.1, -d * 0.28, w * 0.2, d * 0.22);
  ctx.restore();
}

// A shut laptop held by its edge, hanging from the hand at (x, y): w wide; tag a sticker colour on the lid.
export function drawLaptopShut(ctx, x, y, w, tag = null) {
  const h = w * 0.68;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.12);
  ctx.fillStyle = SILVER_DARK;
  rrect(ctx, -w / 2, -1, w, h + 1.2, w * 0.08);
  ctx.fill();
  ctx.fillStyle = SILVER;
  rrect(ctx, -w / 2, -1, w, h, w * 0.08);
  ctx.fill();
  fillCircle(ctx, 0, h * 0.45, w * 0.09, 'rgba(255,255,255,0.7)'); // the logo
  if (tag) fillCircle(ctx, w * 0.28, h * 0.72, w * 0.08, tag);
  ctx.restore();
}

// A takeaway cup from the coffee machine: (x, y) its middle, s its height.
export function drawCup(ctx, x, y, s, t = 0) {
  const top = y - s / 2;
  ctx.fillStyle = '#f4f1ea';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.36, top + s * 0.12);
  ctx.lineTo(x + s * 0.36, top + s * 0.12);
  ctx.lineTo(x + s * 0.27, top + s);
  ctx.lineTo(x - s * 0.27, top + s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#a8763f'; // the sleeve
  ctx.fillRect(x - s * 0.33, top + s * 0.4, s * 0.66, s * 0.3);
  ctx.fillStyle = '#3a3330'; // the lid
  rrect(ctx, x - s * 0.42, top, s * 0.84, s * 0.16, s * 0.06);
  ctx.fill();
  for (let i = 0; i < 2; i++) { // steam
    const ph = (t * 0.6 + i * 0.5) % 1;
    ctx.globalAlpha = 0.5 * (1 - ph);
    fillCircle(ctx, x + (i ? 2 : -2) + Math.sin(t * 2 + i) * 1.2, top - 2 - ph * s * 0.7, 1 + ph * 1.4, '#e8e4dc');
  }
  ctx.globalAlpha = 1;
}

// A cigarette between the fingers at (x, y), pointing along (dx, dy) (a unit vector): s long, the tip glowing.
export function drawCigarette(ctx, x, y, dx, dy, s, t = 0) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#f3efe6';
  ctx.lineWidth = Math.max(1.4, s * 0.24);
  ctx.beginPath();
  ctx.moveTo(x - dx * s * 0.2, y - dy * s * 0.2);
  ctx.lineTo(x + dx * s * 0.8, y + dy * s * 0.8);
  ctx.stroke();
  ctx.strokeStyle = '#d9a35a'; // the filter
  ctx.beginPath();
  ctx.moveTo(x - dx * s * 0.2, y - dy * s * 0.2);
  ctx.lineTo(x + dx * s * 0.05, y + dy * s * 0.05);
  ctx.stroke();
  ctx.lineCap = 'butt';
  const glow = 0.7 + 0.3 * Math.sin(t * 3);
  fillCircle(ctx, x + dx * s * 0.85, y + dy * s * 0.85, Math.max(0.9, s * 0.13), `rgba(240,110,40,${glow})`);
}

// A pointing finger along +x from (x, y) (drawPerson's 'point' arm rotates the hand that way), in skin.
export function drawFinger(ctx, x, y, skin) {
  ctx.fillStyle = skin;
  rrect(ctx, x - 4, y - 1.6, 9, 3.2, 1.6);
  ctx.fill();
}

// Whatever a person in an end scene holds is drawn by one of the painters above, where the engine's drawPerson
// would put an emoji: give the person `item: HELD` and draw them with holding(ctx, paint). paint(ctx, x, y) is
// called in the person's own transform, at the spot drawPerson picked for that hand (and turned along a
// pointing arm).
export const HELD = '⁣held';
export function holding(ctx, paint) {
  return new Proxy(ctx, {
    get(c, k) {
      if (k === 'fillText') return (str, x, y, ...rest) => (str === HELD ? paint(c, x, y) : c.fillText(str, x, y, ...rest));
      const v = c[k];
      return typeof v === 'function' ? v.bind(c) : v;
    },
    set(c, k, v) {
      c[k] = v;
      return true;
    },
  });
}
