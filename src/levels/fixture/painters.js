// The fixture's drawn furniture and things (DESIGN.md "Visual language": the world is drawn, never an emoji; the
// state that decides the outcome is drawn on the object).
//   cake        Gus's birthday cake: items.cake.draw (in your hand, on the floor, in the HUD) and on its stand
//   cakeStand   decor.props B: the cake on its pedestal, or an empty plate with crumbs once it is gone
//   microwave   decor.props M: the popcorn in it, glowing and pouring black smoke while it burns, grey after
//   calendar    decor.props W: Doreen's calendar on its easel, the circled day showing whose birthday it is
// cake is a things.js painter (ctx, x, y, size, t); the rest are decor.props painters (ctx, info, at, shown, t),
// drawn in map pixels (at: the tile; T px a tile).
import { T, emoji, fillEllipse, fillCircle, rrect, fin } from '../../render/util.js';
import { box } from '../../render/things.js';

// A round cake from the side: pink icing dripping over a sponge, sprinkles and three candles on top.
export function cake(ctx, x, y, size) {
  box(ctx, x, y, size);
  fillEllipse(ctx, 0.5, 6.6, 7.6, 1.5, 'rgba(25,15,8,0.22)');
  ctx.fillStyle = '#d9a56a'; // sponge
  rrect(ctx, -7, -1.6, 14, 7.8, 2);
  ctx.fill();
  ctx.fillStyle = '#f3e2c4'; // cream layer
  ctx.fillRect(-7, 1.8, 14, 1.1);
  ctx.fillStyle = '#f08fb0'; // icing, dripping down the sides
  ctx.beginPath();
  ctx.moveTo(-7.2, -1.8);
  ctx.lineTo(7.2, -1.8);
  ctx.lineTo(7.2, 0.6);
  for (let i = 0; i <= 6; i++) ctx.lineTo(7.2 - i * 2.4, i % 2 ? 0.4 : 1.8);
  ctx.closePath();
  ctx.fill();
  fillEllipse(ctx, 0, -1.8, 7.2, 2, '#f7a9c4');
  const dots = [['#3aa7d6', -4, -2], ['#e8b923', -1, -1.2], ['#5fae45', 2.6, -2.2], ['#ffffff', 4.6, -1.4], ['#3aa7d6', 1, -2.8]];
  for (const [col, dx, dy] of dots) {
    ctx.fillStyle = col;
    ctx.fillRect(dx - 0.45, dy - 0.3, 0.9, 0.6);
  }
  for (const cx of [-3, 0, 3]) {
    ctx.fillStyle = cx === 0 ? '#7fc7e8' : '#f6e27a';
    ctx.fillRect(cx - 0.55, -6.6, 1.1, 4.4);
    ctx.fillStyle = '#3a3030'; // wick: unlit until the song
    ctx.fillRect(cx - 0.2, -7.6, 0.4, 1);
  }
}

// The pedestal stand on its tile: the cake on it ({ cake: true }), or an empty plate, crumbs and a fork.
export function cakeStand(ctx, info, at, shown) {
  drawStand(ctx, at.x * T + T / 2, at.y * T + T / 2, shown.cake);
}

// The stand centred on (cx, cy), tile-sized (the end card scales it up), with the cake on it or not.
export function drawStand(ctx, cx, cy, full) {
  fillEllipse(ctx, cx, cy + 12, 11, 3, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = '#c9ced4'; // stem and foot
  ctx.fillRect(cx - 1.6, cy + 2, 3.2, 9);
  fillEllipse(ctx, cx, cy + 11, 7, 2.2, '#b4bac1');
  fillEllipse(ctx, cx, cy + 2, 13, 3.6, '#aeb5bd'); // the plate
  fillEllipse(ctx, cx, cy + 1.2, 12, 3, '#eef1f4');
  if (full) {
    ctx.save();
    cake(ctx, cx, cy - 6, 22);
    ctx.restore();
    return;
  }
  ctx.fillStyle = '#c99a62'; // crumbs, a smear of icing, a fork
  for (const [dx, dy] of [[-6, 0.6], [-3, 2], [2, 0], [5, 1.6], [0, 2.4], [7, 0.2]]) ctx.fillRect(cx + dx, cy + dy, 1.2, 1);
  fillEllipse(ctx, cx - 1, cy + 0.8, 3.6, 1, '#f08fb0');
  ctx.strokeStyle = '#8c949b';
  ctx.lineWidth = 1.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 2, cy - 0.4);
  ctx.lineTo(cx + 9, cy + 1.6);
  ctx.stroke();
}

// The microwave on a little cart. shown.state is the popcorn: 'bag' and 'binned' a dark window; 'burning' the window
// glows and flickers and black smoke pours from the vent; 'smoking' (being fanned) grey smoke, the glow gone.
export function microwave(ctx, info, at, shown, t) {
  const px = at.x * T;
  const py = at.y * T;
  const burning = shown.state === 'burning';
  const smoking = burning || shown.state === 'smoking';
  fillEllipse(ctx, px + 16, py + 30, 13, 3, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = '#7a6a5a'; // the cart
  ctx.fillRect(px + 5, py + 14, 22, 15);
  ctx.fillStyle = '#5e5044';
  ctx.fillRect(px + 5, py + 21, 22, 1.2);
  ctx.fillStyle = '#e9e5dc'; // the oven: top face, then front
  rrect(ctx, px + 3, py - 4, 26, 8, 2);
  ctx.fill();
  ctx.fillStyle = '#d3cdc1';
  rrect(ctx, px + 3, py + 2, 26, 15, 2);
  ctx.fill();
  const flicker = burning ? 0.7 + 0.3 * Math.sin(fin(t) * 23) * Math.sin(fin(t) * 7) : 0;
  ctx.fillStyle = burning ? `rgba(255,${Math.round(120 + 60 * flicker)},40,1)` : '#2e3236'; // the window
  rrect(ctx, px + 5, py + 4, 16, 11, 1.5);
  ctx.fill();
  if (!burning) {
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(px + 6.5, py + 5, 2, 9);
  } else fillEllipse(ctx, px + 13, py + 11, 5, 2.4, '#3a2416'); // the bag, charring
  ctx.fillStyle = '#9b958a'; // the control panel
  ctx.fillRect(px + 22.5, py + 4, 5, 11);
  fillCircle(ctx, px + 25, py + 7, 1.2, burning ? '#e5432f' : '#5e5a52');
  ctx.fillStyle = '#5e5a52';
  for (let i = 0; i < 3; i++) ctx.fillRect(px + 23.5, py + 10 + i * 1.6, 3, 0.8);
  if (!smoking) return;
  for (let i = 0; i < 4; i++) { // smoke from the vent, rising and spreading
    const ph = (fin(t) * 0.55 + i / 4) % 1;
    const sx = px + 12 + Math.sin(ph * 5 + i) * 4 + ph * 4;
    const sy = py - 6 - ph * 26;
    ctx.globalAlpha = (burning ? 0.75 : 0.5) * (1 - ph);
    fillCircle(ctx, sx, sy, 3 + ph * 6, burning ? '#2b2724' : '#9a9a96');
  }
  ctx.globalAlpha = 1;
}

// Doreen's wall calendar on an easel: the month's grid, one day ringed in red with the face of whose birthday it says
// it is (shown.who: 'player' or a cast id). Changing it to Gus's is the calendar route, so the face is the fact.
export function calendar(ctx, info, at, shown) {
  const cx = at.x * T + T / 2;
  const py = at.y * T;
  fillEllipse(ctx, cx, py + 30, 12, 2.6, 'rgba(0,0,0,0.2)');
  ctx.strokeStyle = '#7a5434'; // easel legs
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 6, py + 6);
  ctx.lineTo(cx - 10, py + 30);
  ctx.moveTo(cx + 6, py + 6);
  ctx.lineTo(cx + 10, py + 30);
  ctx.moveTo(cx, py + 4);
  ctx.lineTo(cx, py + 28);
  ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(cx - 12, py - 9, 25, 24);
  ctx.fillStyle = '#fbf8f0'; // the page
  ctx.fillRect(cx - 13, py - 10, 25, 24);
  ctx.fillStyle = '#c8442f'; // month header, rings
  ctx.fillRect(cx - 13, py - 10, 25, 5);
  ctx.fillStyle = '#3a3030';
  for (const dx of [-8, 0, 7]) ctx.fillRect(cx + dx, py - 12, 1.4, 3.4);
  ctx.fillStyle = 'rgba(40,30,20,0.35)'; // the days
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) ctx.fillRect(cx - 11 + c * 4, py - 3 + r * 4, 2, 1.6);
  const dx = cx + 5;
  const dy = py + 5;
  emoji(ctx, `@${shown.who}`, dx, dy - 0.5, 9); // whose birthday: their face
  ctx.strokeStyle = '#d23a2a';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(dx, dy - 0.5, 6, 5.4, -0.2, 0, Math.PI * 2);
  ctx.stroke();
}
