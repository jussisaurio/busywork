// Second Thoughts' own objects, drawn as the real thing (no emoji on a tile or in a hand): the boss's in-tray, your
// letter, a phone held up as a torch (end scenes only: on the floor, render/darkness.js draws it), and the coffee
// machine's water jug, lamp, smoke and short. The tray and the machine's are decor.props painters (render/world.js calls them
// as (ctx, info, tile, shown, t)); the end scenes draw the tray, the letter and the phone bigger. Sizes are map
// pixels at s = 1 (a tile is 32).
import { T, rrect, fillCircle } from '../../render/util.js';

// Your letter: a white envelope, 14 x 9, its flap folded down, centred on (x, y), turned `rot`.
export function paintLetter(ctx, x, y, s = 1, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(-6.5, -3.5, 14, 9);
  ctx.fillStyle = '#fbf8f0';
  ctx.fillRect(-7, -4.5, 14, 9);
  ctx.strokeStyle = '#a8a091';
  ctx.lineWidth = 0.9;
  ctx.strokeRect(-7, -4.5, 14, 9);
  ctx.beginPath();
  ctx.moveTo(-7, -4.5);
  ctx.lineTo(0, 0.8);
  ctx.lineTo(7, -4.5);
  ctx.stroke();
  ctx.restore();
}

// The letter as an item's look (items.letter.draw; render/things.js calls it as (ctx, x, y, size, t)): in your hand,
// in the boss's, on the floor and in the HUD slot. `size` is how big an emoji there would be.
export function letter(ctx, x, y, size, t, game) {
  const s = size / 14; // as wide as an emoji of that size
  paintLetter(ctx, x, y, s);
}

// The letter you spat out: a soggy grey-white wad of chewed paper, a few torn flecks round it, a wet shine. It lands
// over a quarter of a second.
export function wadProp(ctx, info, at, shown) {
  if (!shown.at) return;
  const k = Math.min(1, shown.k ?? 1);
  ctx.save();
  ctx.translate(shown.at.x * T, shown.at.y * T);
  ctx.scale(0.6 + 0.6 * k, 0.6 + 0.6 * k);
  fillCircle(ctx, 0, 1.5, 6.5, 'rgba(0,0,0,0.15)');
  fillCircle(ctx, 0, 0, 6, '#d9d6c8');
  fillCircle(ctx, -3, -1, 3.5, '#e8e5d8');
  fillCircle(ctx, 3, 1.5, 3, '#c9c5b4');
  for (const [dx, dy] of [[-9, 3], [8, -4], [10, 5], [-6, -6]]) fillCircle(ctx, dx, dy, 1.2, '#ecebe2'); // flecks
  fillCircle(ctx, -2, -2.5, 1.4, 'rgba(255,255,255,0.7)'); // wet shine
  ctx.restore();
}

// The in-tray: a chrome wire basket, 22 x 12, centred on (x, y). The desk shows through its mesh, so an empty one
// reads empty; your letter lies in it while it's there.
const WIRE = '#dfe4e8';
export function paintTray(ctx, x, y, letter, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; // its shadow on the desk
  rrect(ctx, -10, -3.5, 22, 11, 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(30,24,20,0.16)'; // the inside, a touch darker than the desk
  ctx.fillRect(-10.5, -5.5, 21, 8);
  ctx.save(); // the mesh floor
  ctx.beginPath();
  ctx.rect(-10.5, -5.5, 21, 8);
  ctx.clip();
  ctx.strokeStyle = 'rgba(223,228,232,0.55)';
  ctx.lineWidth = 0.45;
  ctx.beginPath();
  for (let k = -20; k <= 14; k += 2.4) {
    ctx.moveTo(k, -5.5);
    ctx.lineTo(k + 8, 2.5);
    ctx.moveTo(k + 8, -5.5);
    ctx.lineTo(k, 2.5);
  }
  ctx.stroke();
  ctx.restore();
  if (letter) paintLetter(ctx, 0.5, -1.2, 1, -0.08);
  ctx.fillStyle = 'rgba(205,212,218,0.3)'; // the front face, wires running down it
  ctx.fillRect(-10.5, 2.5, 21, 3.5);
  ctx.strokeStyle = 'rgba(223,228,232,0.8)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let k = -9; k <= 9; k += 2) {
    ctx.moveTo(k, 2.5);
    ctx.lineTo(k, 6);
  }
  ctx.stroke();
  ctx.strokeStyle = WIRE; // the rails
  ctx.lineWidth = 1.1;
  ctx.strokeRect(-10.5, -5.5, 21, 8);
  ctx.beginPath();
  ctx.moveTo(-10.5, 6);
  ctx.lineTo(10.5, 6);
  ctx.moveTo(-10.5, 2.5);
  ctx.lineTo(-10.5, 6);
  ctx.moveTo(10.5, 2.5);
  ctx.lineTo(10.5, 6);
  ctx.stroke();
  ctx.restore();
}

// decor.props painter: shown { letter } (is your letter in it).
export function trayProp(ctx, info, at, shown) {
  const k = shown.pull ?? 0; // dragged over toward his chair
  paintTray(ctx, at.x * T + T / 2 - 11 * k, at.y * T + T / 2 - 1 - 4 * k, shown.letter);
}

// Your desk's drawer, on the side you sit at: slid open while you put the letter in (`open` 0..1), and once it's
// shut, the letter's corner sticking out of it for the rest of the day.
export function drawerProp(ctx, info, at, shown) {
  if (!shown.stashed) return;
  const k = shown.open ?? 0;
  const x = at.x * T + T - 4; // right of your chair
  const y = at.y * T + T - 7 + k * 7;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(x, y + 1, 16, 7);
  ctx.fillStyle = '#9a7246';
  ctx.fillRect(x, y, 16, 6);
  ctx.fillStyle = '#c9a86a';
  ctx.fillRect(x + 6, y + 2, 4, 1.5);
  paintLetter(ctx, x + 12, y - 1 + (k > 0 ? -2 : 1), 0.55, -0.35); // its corner
}

// The boss's desk clock, on the west end of his desk two tiles from the tray (keyed on the tray's tile: the first
// desk tile on the map is the kitchen counter). A brass alarm clock, its hands on the real time. While he checks it,
// a glint off its face; when it chimes 3:39, it rattles and rings.
export function deskClockProp(ctx, info, at, shown, t) {
  const ring = shown.ring ?? 0; // 0..1, fading
  const x = (at.x - 2) * T + 24 + (ring > 0 ? Math.sin(t * 70) * 1.2 * ring : 0);
  const y = at.y * T + 11;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; // its shadow
  ctx.beginPath();
  ctx.ellipse(x + 1, y + 6.5, 6, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#6b4a1c'; // the legs
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - 3, y + 3.5);
  ctx.lineTo(x - 4.5, y + 6.5);
  ctx.moveTo(x + 3, y + 3.5);
  ctx.lineTo(x + 4.5, y + 6.5);
  ctx.stroke();
  fillCircle(ctx, x - 3.5, y - 5.5, 2, '#c9962e'); // the bells
  fillCircle(ctx, x + 3.5, y - 5.5, 2, '#c9962e');
  fillCircle(ctx, x, y, 5.6, '#b8862a'); // the brass case
  fillCircle(ctx, x, y, 4.4, '#fbf6e6'); // the face
  ctx.fillStyle = '#4a3a2a';
  for (let i = 0; i < 12; i += 3) {
    const a = (i / 12) * Math.PI * 2;
    ctx.fillRect(x + Math.sin(a) * 3.5 - 0.35, y - Math.cos(a) * 3.5 - 0.35, 0.7, 0.7);
  }
  const min = shown.minute ?? 0; // since 3:00
  const hand = (a, len, w) => {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.sin(a) * len, y - Math.cos(a) * len);
    ctx.stroke();
  };
  ctx.strokeStyle = '#2a211a';
  ctx.lineCap = 'round';
  hand(((3 + min / 60) / 12) * Math.PI * 2, 2.3, 1);
  hand((min / 60) * Math.PI * 2, 3.5, 0.7);
  if (shown.glint) { // light off the glass, sweeping
    const g = (t * 1.3) % 1;
    ctx.globalAlpha = Math.sin(g * Math.PI) * 0.9;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 2.5 + g * 3, y - 2.5);
    ctx.lineTo(x - 0.5 + g * 3, y - 3.6);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  if (ring > 0) { // the ring, lines off both bells
    ctx.globalAlpha = ring;
    ctx.strokeStyle = '#3a2e22';
    ctx.lineWidth = 0.9;
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.arc(x + sx * 3.5, y - 5.5, 4 + i * 2.5, sx < 0 ? Math.PI * 1.05 : -Math.PI * 0.45, sx < 0 ? Math.PI * 1.45 : -Math.PI * 0.05);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// A phone held up as a torch, its back to you, centred on (x, y): a dark slab, the flash lit at its top while `lit`.
// Returns where the flash is (a beam starts there).
export function paintPhone(ctx, x, y, s = 1, lit = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#16181d';
  rrect(ctx, -3, -5, 6, 10, 1.4);
  ctx.fill();
  ctx.fillStyle = '#3a3f48'; // the camera bump
  rrect(ctx, -2.2, -4.2, 4.4, 2.6, 0.8);
  ctx.fill();
  if (lit) {
    const g = ctx.createRadialGradient(0, -3, 0.3, 0, -3, 7);
    g.addColorStop(0, 'rgba(255,250,225,0.95)');
    g.addColorStop(0.35, 'rgba(255,240,190,0.4)');
    g.addColorStop(1, 'rgba(255,240,190,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-7, -10, 14, 14);
    ctx.fillStyle = '#fffdf0';
    ctx.beginPath();
    ctx.arc(0, -3, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return { x, y: y - 3 * s };
}

// decor.things (render/things.js calls them as (ctx, x, y, size)), for the end cards, where render/characters.js puts
// them in a hand: his tray, empty (he holds it up at 3:40), and a phone held up as a torch. `size` is how big an
// emoji there would be.
export function trayThing(ctx, x, y, size) {
  paintTray(ctx, x, y, false, size / 12);
}
export function phoneThing(ctx, x, y, size) {
  paintPhone(ctx, x, y, size / 12);
}

// decor.props painters on the coffee machine's tile (presentation.js says what each is shown). They draw in map
// pixels from the machine's tile: render/world.js draws the machine itself (its body x 6..26, y 1..23 of the tile, its
// pot at x 14.5, a red dot at 23.5, 11) and the pot (the engine's 'carafe').

// The glass water jug on the counter right of the machine, upright. empty: you poured it into the vent on the back
// of the machine and stood it back: nothing at the front gives it away, only a dark wet streak dripping out of it
// down the wall in the gap behind the machine's right shoulder, a drip still running.
const WATER = 'rgba(96,170,232,';
export function jugProp(ctx, info, at, shown, t) {
  const px = at.x * T;
  const py = at.y * T;
  if (shown.empty) {
    ctx.fillStyle = 'rgba(40,52,64,0.35)'; // wet wall behind the machine, peeking out right of it
    rrect(ctx, px + 25, py - 4, 4, 14, 2);
    ctx.fill();
    const k = (t * 0.9) % 1;
    fillCircle(ctx, px + 27, py + 1 + k * 8, 1.1, `${WATER}${(0.85 * (1 - k)).toFixed(3)})`);
  }
  const x = px + T + 12;
  const y = py + 6;
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, x - 5, y + 13, 12, 3, 1.5);
  ctx.fill();
  ctx.fillStyle = 'rgba(214,236,246,0.55)'; // the glass
  rrect(ctx, x - 5.5, y, 11, 15, 2.5);
  ctx.fill();
  if (!shown.empty) {
    ctx.fillStyle = `${WATER}0.95)`; // the water in it, most of the way up
    rrect(ctx, x - 4.5, y + 4, 9, 10, 2);
    ctx.fill();
  } else {
    ctx.fillStyle = `${WATER}0.6)`; // a last drop in the bottom
    rrect(ctx, x - 4.5, y + 12, 9, 2, 1);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(235,248,255,0.9)';
  ctx.lineWidth = 1.2;
  ctx.beginPath(); // the handle
  ctx.arc(x + 6, y + 7, 3.2, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillRect(x - 3.5, y + 2, 1.3, 10); // a glint down the glass
}

// The machine itself. lamp: 'brewing' (a small green lamp, blinking) | 'brewed' (a big green lamp, steady) | null.
// steam: a full hot pot. scorch: it shorted: soot up its top and the wall behind it, for the rest of the day.
// smoke: it shorted and the fuse it blew is still out: smoke off its back, its back glowing orange, so in the
// torchlight it is plain what took the floor down.
export function machineProp(ctx, info, at, shown, t) {
  const px = at.x * T;
  const py = at.y * T;
  if (shown.scorch) {
    ctx.fillStyle = 'rgba(16,12,10,0.8)';
    ctx.beginPath();
    ctx.ellipse(px + 19, py + 4, 8, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(px + 15, py + 2, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(20,16,14,0.55)'; // soot licking up the wall behind it
    for (const [dx, h, w] of [[12, 14, 3], [18, 20, 4], [24, 12, 3]]) {
      ctx.beginPath();
      ctx.moveTo(px + dx - w, py + 1);
      ctx.quadraticCurveTo(px + dx + 2, py - h / 2, px + dx, py - h);
      ctx.quadraticCurveTo(px + dx + 1, py - h / 2, px + dx + w, py + 1);
      ctx.fill();
    }
  }
  const lx = px + 23.5;
  const ly = py + 11;
  if (shown.lamp === 'brewed' || (shown.lamp === 'brewing' && Math.sin(t * 6) > 0)) {
    const big = shown.lamp === 'brewed';
    const r = big ? 13 : 5;
    const g = ctx.createRadialGradient(lx, ly, 0.2, lx, ly, r);
    g.addColorStop(0, 'rgba(150,255,140,0.9)');
    g.addColorStop(1, 'rgba(150,255,140,0)');
    ctx.fillStyle = g;
    ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
    if (big) fillCircle(ctx, lx, ly, 4, '#2f9a3c'); // a big round lamp, lit
    fillCircle(ctx, lx, ly, big ? 3 : 1.6, '#e2ffd8');
  }
  if (shown.steam) {
    for (let i = 0; i < 5; i++) { // a tall plume off the hot pot
      const k = (t * 0.5 + i / 5) % 1;
      fillCircle(ctx, px + 14.5 + Math.sin(t * 1.7 + i * 2.1) * 4 * k, py + 10 - k * 28, 2.5 + k * 6, `rgba(255,255,255,${(0.75 * (1 - k)).toFixed(3)})`);
    }
  }
  if (!shown.smoke) return;
  fillCircle(ctx, px + 22, py + 9, 3 + 0.8 * Math.sin(t * 11), `rgba(255,140,50,${0.6 + 0.3 * Math.sin(t * 17)})`);
  fillCircle(ctx, px + 22, py + 9, 1.3, '#fff0b0');
  for (let i = 0; i < 5; i++) {
    const k = (t * 0.45 + i / 5) % 1;
    fillCircle(ctx, px + 22 + Math.sin(t * 1.3 + i * 2) * 4 * k, py + 6 - k * 22, 3 + k * 6, `rgba(150,147,150,${0.8 * (1 - k)})`);
  }
}

// The short running down the wiring to the fuse box, `k` (0..1) of the way: a crackling spark with a trail, down from
// the machine, out of the kitchen door and along the hallway's wall (tiles). Drawn while the lights are still on.
const SURGE_PATH = [[21.6, 1.95], [21.6, 5.6], [22.5, 5.6], [22.5, 6.95], [1.7, 6.95]];
const SURGE_LEN = SURGE_PATH.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - SURGE_PATH[i][0], p[1] - SURGE_PATH[i][1]), 0);
function along(d) {
  for (let i = 1; i < SURGE_PATH.length; i++) {
    const [ax, ay] = SURGE_PATH[i - 1];
    const [bx, by] = SURGE_PATH[i];
    const l = Math.hypot(bx - ax, by - ay);
    if (d <= l || i === SURGE_PATH.length - 1) {
      const f = Math.max(0, Math.min(1, d / l));
      return [(ax + (bx - ax) * f) * T, (ay + (by - ay) * f) * T];
    }
    d -= l;
  }
  return [0, 0];
}
export function surgeProp(ctx, info, at, shown, t) {
  if (shown.k === null || shown.k === undefined) return;
  const head = shown.k * SURGE_LEN;
  const pts = [];
  for (let d = Math.max(0, head - 3); d <= head; d += 0.3) pts.push(along(d));
  pts.push(along(head));
  ctx.save();
  ctx.lineJoin = 'round';
  for (const [w, c] of [[6, 'rgba(255,214,90,0.35)'], [2, '#fff4b8']]) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    pts.forEach(([x, y], i) => {
      const j = i === pts.length - 1 ? 0 : Math.sin(t * 47 + i * 2.3) * 3;
      if (i === 0) ctx.moveTo(x + j, y - j);
      else ctx.lineTo(x + j, y - j);
    });
    ctx.stroke();
  }
  const [hx, hy] = along(head);
  const g = ctx.createRadialGradient(hx, hy, 0.5, hx, hy, 12);
  g.addColorStop(0, 'rgba(255,250,210,1)');
  g.addColorStop(1, 'rgba(255,220,100,0)');
  ctx.fillStyle = g;
  ctx.fillRect(hx - 12, hy - 12, 24, 24);
  ctx.strokeStyle = '#ffe680';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = t * 31 + i * 1.7;
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + Math.cos(a) * 7, hy + Math.sin(a) * 7);
  }
  ctx.stroke();
  ctx.restore();
}
