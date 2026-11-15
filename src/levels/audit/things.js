// The audit's things, drawn: no emoji stands in for an object (DESIGN.md "Visual language"). The laptop (index.js
// ITEMS: its draw), the marks on the four desks he counts (presentation.js DECOR.props), and painters for the end
// scenes (end-scenes.js). All of them draw in the current transform; sizes are in its pixels.
import { T, rrect, fillCircle, fillEllipse } from '../../render/util.js';
import { box } from '../../render/things.js';
import { SPOTS } from './spots.js';

const SILVER = '#c3c7cd';
const SILVER_DARK = '#8f949c';
const PALE = '#eef2f4';
const TICK_GREEN = '#3e9b4f';
const CROSS_RED = '#c8432f';
const CABLE = '#2b2622';

// --- The laptop ------------------------------------------------------------------------------------------------
// items[type].draw, a things painter (render/things.js): open on a desk, its lid and its wallpaper in its owner's
// colour (tint: 'owner'), so the three laptops show whose they are; shut in a hand, the whole lid in his colour.
export function laptop(ctx, x, y, size, t, game, opts) {
  box(ctx, x, y, size);
  const lid = opts?.tint || '#3b3f46';
  if (opts?.held) {
    ctx.rotate(0.12);
    ctx.fillStyle = SILVER_DARK;
    rrect(ctx, -6.8, -4.4, 13.6, 10, 1.4);
    ctx.fill();
    ctx.fillStyle = lid;
    rrect(ctx, -6.8, -4.8, 13.6, 9.4, 1.4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(-5.8, -4, 11.6, 1.2);
    fillCircle(ctx, 0, -0.2, 1.4, 'rgba(255,255,255,0.75)'); // the logo
    return;
  }
  fillEllipse(ctx, 0.5, 7.2, 7.6, 1.4, 'rgba(25,15,8,0.22)');
  ctx.fillStyle = lid; // a thick lid frame in his colour
  rrect(ctx, -6.6, -7.6, 13.2, 10.2, 1.4);
  ctx.fill();
  ctx.fillStyle = PALE; // his wallpaper: his colour, washed out
  ctx.fillRect(-4.8, -5.9, 9.6, 6.6);
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = lid;
  ctx.fillRect(-4.8, -5.9, 9.6, 6.6);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(-3.8, -4.6, 5, 1);
  ctx.fillRect(-3.8, -2.8, 3.4, 1);
  ctx.fillStyle = SILVER; // the keyboard deck
  ctx.beginPath();
  ctx.moveTo(-6.4, 2.6);
  ctx.lineTo(6.4, 2.6);
  ctx.lineTo(7.8, 6.8);
  ctx.lineTo(-7.8, 6.8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = SILVER_DARK;
  ctx.fillRect(-5.2, 3.4, 10.4, 2);
}

// --- The four desks ---------------------------------------------------------------------------------------------
// The desks he counts, in his order (index.js INSPECTIONS): the world field the tick is recorded in, the spot a
// laptop lies on, and the right-hand end of the desk top on the map (tile units), where his sticker goes.
export const COUNTED = [
  { rec: 'atBoss', spot: 'boss_desk', x: 6, y: 3 },
  { rec: 'atLin', spot: 'lin_desk', x: 6, y: 8 },
  { rec: 'atYou', spot: 'your_desk', x: 15, y: 8 },
  { rec: 'atKev', spot: 'kev_desk', x: 24, y: 8 },
];
// Lin's paper pile: the left end of her desk top (tile units). He goes through it at her desk, which is why her
// desk takes him longer (index.js INSPECTIONS, presentation.js POSES).
const LIN_PILE = { x: 3.35, y: 8.62 };

// DECOR.props entry. On each desk: the loose cable a laptop plugs into, while no laptop lies there (your desk from
// the start); and once he has been to it, his sticker on its front edge, green with a tick or red with a cross,
// whatever lies on the desk afterwards. So a laptop moved off a counted desk leaves the tick and the cable behind.
export const DESK_MARKS = {
  tile: 'P', // any one tile will do: the painter draws on all four desks
  draw(ctx, info, at, shown, t) {
    paperPile(ctx, LIN_PILE.x * T, LIN_PILE.y * T, t);
    for (const d of shown) {
      if (d.empty) cable(ctx, d.lx * T, d.ly * T);
      if (d.mark) sticker(ctx, (d.x - 0.34) * T, (d.y + 0.72) * T, 4.2, d.mark === 'cross');
    }
  },
  state: (w) => COUNTED.map((d, i) => {
    const s = SPOTS[d.spot];
    return {
      x: d.x, y: d.y, lx: s.x + 0.5, ly: s.y - 0.5, // the laptop's place: the desk tile the spot faces (N)
      empty: !w.items.some((it) => it.spot === d.spot),
      mark: w[d.rec] ? 'tick' : w.crossed?.includes(i) ? 'cross' : null,
    };
  }),
};

// A laptop's charging cable lying loose on a desk, its plug where the laptop would sit: (x, y) that place's middle.
function cable(ctx, x, y) {
  ctx.strokeStyle = CABLE;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 4, y - 12);
  ctx.bezierCurveTo(x - 12, y - 4, x + 6, y - 6, x + 1, y + 2);
  ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = CABLE;
  rrect(ctx, x - 1.6, y + 1, 5, 3.4, 0.8);
  ctx.fill();
  ctx.fillStyle = '#c8ccd0';
  ctx.fillRect(x + 3.2, y + 1.6, 1.6, 0.8);
  ctx.fillRect(x + 3.2, y + 3, 1.6, 0.8);
}

// A messy pile of forms, sheets askew: (x, y) its middle.
function paperPile(ctx, x, y) {
  const sheets = [[-1.5, 1.6, 0.22], [1.2, 0.6, -0.18], [-0.4, -0.6, 0.35], [0.8, -1.6, -0.05], [-0.6, -2.6, 0.14]];
  fillEllipse(ctx, x + 1, y + 4, 8, 2.4, 'rgba(25,15,8,0.2)');
  for (const [dx, dy, a] of sheets) {
    ctx.save();
    ctx.translate(x + dx, y + dy);
    ctx.rotate(a);
    ctx.fillStyle = 'rgba(120,110,95,0.35)';
    ctx.fillRect(-5.6, -3.6, 11.2, 8);
    ctx.fillStyle = '#fbfaf5';
    ctx.fillRect(-5.6, -4.2, 11.2, 8);
    ctx.fillStyle = 'rgba(40,44,70,0.35)';
    ctx.fillRect(-4.2, -2.6, 7, 0.7);
    ctx.fillRect(-4.2, -1, 5, 0.7);
    ctx.restore();
  }
  ctx.fillStyle = '#f2d24b'; // a sticky note on top
  ctx.save();
  ctx.translate(x + 2.6, y - 3.4);
  ctx.rotate(-0.2);
  ctx.fillRect(-2, -2, 4, 4);
  ctx.restore();
}

// A round inspection sticker, r the radius: white rim, a green face with a white tick, or a red one with a cross.
export function sticker(ctx, x, y, r, cross = false) {
  fillCircle(ctx, x + 0.7, y + 0.9, r + 0.9, 'rgba(0,0,0,0.25)');
  fillCircle(ctx, x, y, r + 0.9, '#fbfbf7');
  fillCircle(ctx, x, y, r, cross ? CROSS_RED : TICK_GREEN);
  const w = Math.max(1.2, r * 0.32);
  if (cross) crossMark(ctx, x, y, r * 0.5, '#fff', w);
  else tick(ctx, x, y, r * 0.62, '#fff', w);
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

// A cross centred on (x, y), s its half-width.
export function crossMark(ctx, x, y, s, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s, y - s);
  ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s, y - s);
  ctx.lineTo(x - s, y + s);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

// --- End-scene painters ---------------------------------------------------------------------------------------
// An open laptop turned toward us: (x, y) the middle of its front edge, w its width. tilt rotates it about that
// point (one lying where it fell); lid is its owner's colour (the lid frame and the wallpaper), as on the floor.
export function drawLaptop(ctx, x, y, w, tilt = 0, lid = '#2a2e35') {
  ctx.save();
  ctx.translate(x, y);
  if (tilt) ctx.rotate(tilt);
  const d = w * 0.2; // depth of the keyboard deck, seen from above
  const lw = w * 0.84; // the lid
  const lh = w * 0.6;
  const top = -d - lh;
  const b = w * 0.07; // the lid frame
  ctx.fillStyle = lid;
  rrect(ctx, -lw / 2, top, lw, lh + 1, w * 0.05);
  ctx.fill();
  ctx.fillStyle = PALE;
  ctx.fillRect(-lw / 2 + b, top + b, lw - 2 * b, lh - b * 1.6);
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = lid;
  ctx.fillRect(-lw / 2 + b, top + b, lw - 2 * b, lh - b * 1.6);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let i = 0; i < 3; i++) ctx.fillRect(-lw / 2 + w * 0.13, top + w * (0.14 + i * 0.1), lw * (0.5 - i * 0.12), Math.max(1, w * 0.035));
  ctx.fillStyle = SILVER; // keyboard deck: a trapezoid, wider at the front
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

// A charging cable lying loose on an end-scene desk, from the monitor at (mx, my) to its plug at (x, y).
export function drawCable(ctx, mx, my, x, y) {
  ctx.strokeStyle = CABLE;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(mx, my);
  ctx.bezierCurveTo(mx - 20, my + 14, x + 10, y - 14, x, y);
  ctx.stroke();
  ctx.fillStyle = CABLE;
  rrect(ctx, x - 5, y - 2, 10, 6, 1.5);
  ctx.fill();
  ctx.fillStyle = '#c8ccd0';
  ctx.fillRect(x - 3, y + 4, 2, 3);
  ctx.fillRect(x + 1, y + 4, 2, 3);
}
