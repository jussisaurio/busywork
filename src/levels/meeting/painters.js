// The meeting's own drawn things (DESIGN.md "Visual language": the world is drawn, never an emoji).
//   sandwich  Lin's lunch: items.sandwich.draw, so it is drawn in the fridge thief's hand, on the floor, in the HUD
//             and in Lin's arms (looks.js poses '#sandwich')
//   popper    the keycard win's party popper (end-scenes.js)
//   cricket   the failed meeting's lone cricket (end-scenes.js)
//   emptyBag  a decor prop (decor.js; render/world.js PROP_PAINTERS signature): the empty coffee bag on the counter
//             east of the machine, rolled open and flat. Why the pot's cup is the last one today
//   fireDoor, balcony  decor props, same signature: the fire door onto the smokers' balcony and the balcony, where
//             the boss ends up locked out without his keycard (mechanics.js DOORS)
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

// The fire door onto the smokers' balcony (decor prop on the X tile; mechanics.js DOORS): a red steel door set in
// the wall, a wired window, a push bar, a green EXIT sign over it and a card reader by the handle. state:
//   locked  the boss is out there without his card: the reader blinks red
//   beep    seconds since his card opened it (green for a moment), or null
//   hit     seconds since his last go at it, or null: the door shudders and dust puffs off it
//   denied  seconds since you pushed the bar from inside (toys.js), or null: the bar gives a little and the reader
//           blinks red three times
export function fireDoor(ctx, info, at, state, t) {
  const px = at.x * T;
  const py = at.y * T;
  const hit = Number.isFinite(state.hit) && state.hit >= 0 && state.hit < 0.45 ? state.hit : null;
  const dx = hit === null ? 0 : Math.sin(hit * 70) * 2.2 * (1 - hit / 0.45);
  ctx.fillStyle = '#4a4f55'; // steel frame
  ctx.fillRect(px + 2, py, T - 4, T - 1);
  // Ajar: your push opens it a crack, then it swings shut (state.denied); letting him in, it opens wide (state.open).
  // The daylight off the balcony shows in the gap on the handle side; the door swings on its hinge, left.
  const den = Number.isFinite(state.denied) && state.denied >= 0 ? state.denied : null;
  const crack = den === null ? 0 : den < 0.2 ? den / 0.2 : den < 0.9 ? 1 : Math.max(0, 1 - (den - 0.9) / 0.3);
  const op = Number.isFinite(state.open) && state.open >= 0 ? state.open : null;
  const wide = op === null ? 0 : op < 0.4 ? op / 0.4 : op < 2.4 ? 1 : Math.max(0, 1 - (op - 2.4) / 0.5);
  const gap = Math.max(crack * 5, wide * (T - 8) * 0.75);
  if (gap > 0) {
    ctx.fillStyle = '#d6e8f0';
    ctx.fillRect(px + T - 4 - gap, py + 2, gap, T - 4);
    ctx.fillStyle = 'rgba(163,168,171,0.9)'; // the balcony's concrete at the bottom of the gap
    ctx.fillRect(px + T - 4 - gap, py + T - 8, gap, 6);
  }
  ctx.save();
  ctx.translate(dx, 0);
  if (gap > 0) { // the door, foreshortened as it swings
    ctx.translate(px + 4, 0);
    ctx.scale((T - 8 - gap) / (T - 8), 1);
    ctx.translate(-(px + 4), 0);
  }
  ctx.fillStyle = '#b8402f'; // the door, fire red
  ctx.fillRect(px + 4, py + 2, T - 8, T - 4);
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.fillRect(px + 4, py + 2, T - 8, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(px + T - 6, py + 2, 2, T - 4);
  ctx.fillStyle = '#cfe0e6'; // the wired window
  ctx.fillRect(px + 10, py + 5, 12, 8);
  ctx.strokeStyle = 'rgba(70,80,90,0.55)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  for (let k = 0; k <= 12; k += 4) { ctx.moveTo(px + 10 + k, py + 5); ctx.lineTo(px + 10 + k, py + 13); }
  for (let k = 0; k <= 8; k += 4) { ctx.moveTo(px + 10, py + 5 + k); ctx.lineTo(px + 22, py + 5 + k); }
  ctx.stroke();
  const denied = den !== null && den < 1.2 ? den : null;
  const push = denied !== null && denied < 0.3 ? 1.5 : 0; // the bar, pushed in
  ctx.fillStyle = '#b9bfc3'; // push bar
  ctx.fillRect(px + 6, py + 18 + push, T - 12, 3);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(px + 6, py + 21 + push, T - 12, 1);
  ctx.restore();
  ctx.fillStyle = '#1f7a3e'; // EXIT sign over the door, green
  rrect(ctx, px + 9, py - 6, 14, 6, 1);
  ctx.fill();
  ctx.fillStyle = '#d9ffe4';
  ctx.fillRect(px + 11, py - 4, 10, 1.4);
  ctx.fillRect(px + 11, py - 2.6, 6, 1);
  // the card reader by the handle: dark; blinking red while he's locked out, green on his card
  ctx.fillStyle = '#2b2e33';
  rrect(ctx, px + T - 4, py + 12, 4, 8, 1);
  ctx.fill();
  const green = Number.isFinite(state.beep) && state.beep >= 0 && state.beep < 1.2;
  const no = denied !== null && Math.floor(denied * 6) % 2 === 0; // your push: red blinks while it's held open
  const red = (state.locked && Math.floor(t * 2.5) % 2 === 0) || no;
  if (no) fillCircle(ctx, px + T - 2, py + 14.5, 5, 'rgba(255,59,48,0.35)');
  else if (red) fillCircle(ctx, px + T - 2, py + 14.5, 3.2, 'rgba(255,59,48,0.3)');
  fillCircle(ctx, px + T - 2, py + 14.5, 1.3, green ? '#5dff8a' : red ? '#ff3b30' : '#5a2a28');
  if (hit !== null) { // dust off the door, and thud lines in the air
    const k = hit / 0.45;
    const dust = `rgba(230,225,215,${0.6 * (1 - k)})`;
    for (let i = 0; i < 5; i++) {
      const a = i * 1.3 + 0.4;
      fillCircle(ctx, px + T / 2 + Math.cos(a) * (6 + k * 10), py + T - 2 + Math.sin(a) * 3 + k * 4, 1.2, dust);
    }
    ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - k)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (const s of [-1, 1]) {
      ctx.moveTo(px + T / 2 + s * (10 + k * 6), py + 10);
      ctx.lineTo(px + T / 2 + s * (14 + k * 8), py + 7);
      ctx.moveTo(px + T / 2 + s * (11 + k * 6), py + 16);
      ctx.lineTo(px + T / 2 + s * (16 + k * 8), py + 16);
    }
    ctx.stroke();
  }
}

// The smokers' balcony (decor prop on its first = tile, spanning the = tiles: 3 x 2 here): concrete pavers, a
// railing on its open side, a sand-bucket ashtray, and the butts he grinds out while locked out. state:
//   butts  cigarette butts on the slab (more the longer he's been out there)
export function balcony(ctx, info, at, state) {
  const w = 3, h = 2;
  const px = at.x * T;
  const py = at.y * T;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      ctx.fillStyle = (x + y) & 1 ? '#9ea3a6' : '#a7acaf';
      ctx.fillRect(px + x * T, py + y * T, T, T);
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(px + x * T, py + y * T, T, 1);
      ctx.fillRect(px + x * T, py + y * T, 1, T);
    }
  }
  fillEllipse(ctx, px + 9, py + 40, 4, 2.4, 'rgba(60,60,60,0.22)'); // an old stain
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; // the wall's shadow along the top
  ctx.fillRect(px, py, w * T, 4);
  const ry = py + h * T - 5; // railing along the south edge: a rail on posts
  ctx.fillStyle = '#5c6670';
  ctx.fillRect(px, ry, w * T, 2.5);
  for (let x = 4; x < w * T; x += 10) ctx.fillRect(px + x, ry, 1.6, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(px, ry, w * T, 0.8);
  const ax = px + w * T - 9; // the ashtray: a sand bucket in the east corner
  const ay = py + 13;
  fillEllipse(ctx, ax + 1, ay + 6, 6, 2, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = '#c0392b';
  rrect(ctx, ax - 5, ay - 4, 10, 10, 2);
  ctx.fill();
  fillEllipse(ctx, ax, ay - 4, 5, 2, '#d8c690'); // sand
  const butts = Math.max(0, Math.min(24, Math.floor(fin(state.butts, 0))));
  for (let i = 0; i < 3 + butts; i++) { // three in the sand, the rest ground out on the slab around it
    const inSand = i < 3;
    const a = i * 2.39996;
    const r = inSand ? 2 : 8 + (i % 5) * 2.2;
    const bx = ax + Math.cos(a) * r - (inSand ? 0 : 6);
    const by = (inSand ? ay - 4 : ay + 4) + Math.sin(a) * (inSand ? 1 : r * 0.45);
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(a);
    ctx.fillStyle = '#f2ede2';
    ctx.fillRect(-1.6, -0.5, 2.2, 1);
    ctx.fillStyle = '#d58a3a';
    ctx.fillRect(0.6, -0.5, 1.2, 1);
    ctx.restore();
  }
}
