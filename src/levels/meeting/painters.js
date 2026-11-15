// The meeting's own drawn things (DESIGN.md "Visual language": the world is drawn, never an emoji).
//   sandwich  Lin's lunch: items.sandwich.draw, so it is drawn in the fridge thief's hand, on the floor, in the HUD
//             and in Lin's arms (looks.js poses '#sandwich')
//   popper    the keycard win's party popper (end-scenes.js)
//   cricket   the failed meeting's lone cricket (end-scenes.js)
//   emptyBag  a decor prop (decor.js; render/world.js PROP_PAINTERS signature): the empty coffee bag on the counter
//             east of the machine, rolled open and flat. Why the pot's cup is the last one today
// Each is a things.js painter (ctx, x, y, size, t): centred on (x, y), about `size` px tall, in the 16 px box.
import { box } from '../../render/things.js';
import { fillEllipse, fillCircle, rrect, fin, T } from '../../render/util.js';

// A sandwich from the side: two slices of bread, ham, a frill of lettuce and a smear of mustard.
export function sandwich(ctx, x, y, size) {
  box(ctx, x, y, size);
  fillEllipse(ctx, 0.5, 6.4, 7.4, 1.4, 'rgba(25,15,8,0.22)');
  const slice = (top, crust, crumb) => {
    ctx.fillStyle = crust;
    rrect(ctx, -7, top, 14, 3.8, 1.8);
    ctx.fill();
    ctx.fillStyle = crumb;
    rrect(ctx, -6.2, top + 0.7, 12.4, 2.4, 1.2);
    ctx.fill();
  };
  slice(1.8, '#b97a3e', '#f1dba6'); // bottom slice
  ctx.fillStyle = '#e48b86'; // ham
  rrect(ctx, -7.4, 0.4, 14.8, 1.9, 0.9);
  ctx.fill();
  ctx.fillStyle = '#5fae45'; // lettuce, frilly at the edges
  ctx.beginPath();
  ctx.moveTo(-7.8, 0.6);
  for (let i = 0; i <= 8; i++) ctx.lineTo(-7.8 + i * 1.95, i % 2 ? -1.4 : 0.2);
  ctx.lineTo(7.8, 1);
  ctx.lineTo(-7.8, 1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8b923'; // mustard, dripping
  ctx.fillRect(-5.6, -1.6, 11, 0.9);
  fillCircle(ctx, -2.4, -0.4, 0.7, '#e8b923');
  fillCircle(ctx, 3.2, -0.2, 0.6, '#e8b923');
  ctx.fillStyle = '#c4843f'; // top slice, domed
  ctx.beginPath();
  ctx.moveTo(-7, -1.2);
  ctx.quadraticCurveTo(-7.2, -6.6, 0, -6.8);
  ctx.quadraticCurveTo(7.2, -6.6, 7, -1.2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e2b26a';
  ctx.beginPath();
  ctx.moveTo(-5.4, -2.4);
  ctx.quadraticCurveTo(-5, -5.4, 0, -5.6);
  ctx.quadraticCurveTo(-3.6, -4.6, -4, -2.4);
  ctx.closePath();
  ctx.fill();
}

// A party popper, just pulled: a striped cone with streamers and confetti flying out of its mouth.
export function popper(ctx, x, y, size, t) {
  box(ctx, x, y, size);
  ctx.save();
  ctx.translate(-2.5, 2.5);
  ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = '#e8b923';
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.lineTo(-3.2, -3.6);
  ctx.lineTo(3.2, -3.6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d2453a'; // stripes
  ctx.beginPath();
  ctx.moveTo(-2.5, -1.4);
  ctx.lineTo(2.5, -1.4);
  ctx.lineTo(2.1, 0);
  ctx.lineTo(-2.1, 0);
  ctx.closePath();
  ctx.moveTo(-1.5, 1.6);
  ctx.lineTo(1.5, 1.6);
  ctx.lineTo(1.1, 3);
  ctx.lineTo(-1.1, 3);
  ctx.closePath();
  ctx.fill();
  fillEllipse(ctx, 0, -3.6, 3.2, 0.9, '#f6e7b0');
  ctx.restore();
  const wob = Math.sin(fin(t) * 6) * 0.5;
  ctx.lineWidth = 0.9;
  ctx.lineCap = 'round';
  const streamer = (col, ax, ay, bx, by) => {
    ctx.strokeStyle = col;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(ax + wob, ay, bx, by + wob);
    ctx.stroke();
  };
  streamer('#3aa7d6', 3, -5, 6.5, -2.5);
  streamer('#d2453a', 1, -6, 2.5, -7.5);
  streamer('#5fae45', 5, -1, 7.5, 1.5);
  const bits = [['#e8b923', 4.5, -6.5], ['#3aa7d6', 7, -5], ['#d2453a', 6, 0], ['#5fae45', 2, -4.4], ['#c86fd6', 4.4, -3]];
  for (const [col, bx, by] of bits) {
    ctx.fillStyle = col;
    ctx.fillRect(bx - 0.6, by - 0.6 + wob, 1.2, 1.2);
  }
}

// A cricket from the side, facing left: a long green-brown body, folded wings, big bent hind legs, long antennae.
export function cricket(ctx, x, y, size) {
  box(ctx, x, y, size);
  ctx.strokeStyle = '#4a4a22';
  ctx.lineWidth = 0.7;
  ctx.lineCap = 'round';
  ctx.beginPath(); // antennae
  ctx.moveTo(-5, -1);
  ctx.quadraticCurveTo(-8, -6, -3, -8);
  ctx.moveTo(-5, -1);
  ctx.quadraticCurveTo(-9, -4, -8, -8);
  ctx.moveTo(-3, 1); // front legs
  ctx.lineTo(-4.2, 4);
  ctx.moveTo(-0.5, 1.2);
  ctx.lineTo(-0.8, 4);
  ctx.stroke();
  ctx.lineWidth = 1.1; // the hind leg: up to the knee, down to the foot
  ctx.beginPath();
  ctx.moveTo(1.5, 0.8);
  ctx.lineTo(4.6, -3.6);
  ctx.lineTo(6.6, 4);
  ctx.stroke();
  fillEllipse(ctx, 0.8, 0.2, 5.4, 2, '#6b6a2a'); // body
  ctx.fillStyle = '#4f4e1e'; // folded wings
  ctx.beginPath();
  ctx.moveTo(-2.4, -1.2);
  ctx.quadraticCurveTo(2.4, -2.6, 7, -0.4);
  ctx.quadraticCurveTo(2.4, 0.2, -2.4, -0.2);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, -4.6, -0.4, 1.9, '#6b6a2a'); // head
  fillCircle(ctx, -5.4, -0.9, 0.6, '#1f1a12'); // eye
}

// The coffee bag, empty: a kraft bag tipped on its side, its top torn open, flat as paper, two lone beans by it.
export function emptyBag(ctx, info, at) {
  const x = (at.x + 1) * T + T / 2 - 1;
  const y = at.y * T + T / 2 + 3;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.25);
  fillEllipse(ctx, 0.8, 4.2, 7.6, 1.6, 'rgba(25,15,8,0.25)');
  ctx.fillStyle = '#b98a55'; // kraft paper, flat
  ctx.beginPath();
  ctx.moveTo(-7, -2.6);
  ctx.lineTo(4, -3.2);
  ctx.lineTo(7.4, -1.6); // the torn mouth, jagged
  ctx.lineTo(6.2, -0.4);
  ctx.lineTo(7.6, 0.8);
  ctx.lineTo(6.4, 2);
  ctx.lineTo(7.2, 3.2);
  ctx.lineTo(4, 3.4);
  ctx.lineTo(-7, 3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a6237'; // the crease down its middle, and the folded bottom
  ctx.fillRect(-7, -0.1, 11, 0.8);
  ctx.fillRect(-7, -2.6, 1.6, 5.6);
  ctx.fillStyle = '#3b2412'; // the open mouth: dark, nothing in it
  ctx.beginPath();
  ctx.moveTo(5.2, -2.2);
  ctx.lineTo(6.6, -0.6);
  ctx.lineTo(5.6, 2.4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f3e6c8'; // the label
  rrect(ctx, -4, -1.9, 5, 3.6, 0.8);
  ctx.fill();
  fillCircle(ctx, -1.5, -0.1, 1.1, '#5a3a1e'); // a bean on the label
  ctx.restore();
  fillEllipse(ctx, x + 9.5, y + 2.5, 1.2, 0.8, '#4a2c16'); // two stray beans: all that's left
  fillEllipse(ctx, x + 8, y + 4.6, 1.1, 0.75, '#4a2c16');
}
