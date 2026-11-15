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
export function letter(ctx, x, y, size) {
  paintLetter(ctx, x, y, size / 14); // as wide as an emoji of that size
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
  paintTray(ctx, at.x * T + T / 2, at.y * T + T / 2 - 1, shown.letter);
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

// The glass water jug on the counter right of the machine. tipped: you tipped it over the machine: it lies on its
// side, empty, its mouth on the machine's top; water runs down the machine's front and pools on the floor in front.
const WATER = 'rgba(96,170,232,';
export function jugProp(ctx, info, at, shown, t) {
  const px = at.x * T;
  const py = at.y * T;
  if (!shown.tipped) {
    const x = px + T + 12; // upright on the counter, full
    const y = py + 6;
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    rrect(ctx, x - 5, y + 13, 12, 3, 1.5);
    ctx.fill();
    ctx.fillStyle = 'rgba(214,236,246,0.55)'; // the glass
    rrect(ctx, x - 5.5, y, 11, 15, 2.5);
    ctx.fill();
    ctx.fillStyle = `${WATER}0.95)`; // the water in it, most of the way up
    rrect(ctx, x - 4.5, y + 4, 9, 10, 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(235,248,255,0.9)';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); // the handle
    ctx.arc(x + 6, y + 7, 3.2, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(x - 3.5, y + 2, 1.3, 10); // a glint down the glass
    return;
  }
  // The puddle in front of the machine (on the floor tile below it), with a glint.
  const fx = px + 15;
  const fy = py + T + 9;
  ctx.fillStyle = `${WATER}0.5)`;
  ctx.beginPath();
  ctx.ellipse(fx, fy, 12, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(fx + 8, fy + 2, 6, 3.5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(230,246,255,0.7)';
  ctx.beginPath();
  ctx.ellipse(fx - 4, fy - 1.5, 3.5, 1, 0, 0, Math.PI * 2);
  ctx.fill();
  // Water down the machine's front, drips running.
  ctx.strokeStyle = `${WATER}0.85)`;
  ctx.lineCap = 'round';
  for (const [dx, w] of [[9, 2.2], [16, 1.6], [23, 2]]) {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(px + dx, py + 2);
    ctx.lineTo(px + dx + Math.sin(dx) * 1.2, py + 24);
    ctx.stroke();
  }
  for (let i = 0; i < 3; i++) {
    const k = (t * 1.3 + i / 3) % 1;
    fillCircle(ctx, px + 9 + i * 7, py + 24 + k * 9, 1.4, `${WATER}${0.9 * (1 - k)})`);
  }
  ctx.lineCap = 'butt';
  // The jug, on its side on the counter, empty, mouth on the machine's top.
  ctx.save();
  ctx.translate(px + T + 6, py + 6);
  ctx.rotate(-Math.PI / 2 - 0.25);
  ctx.fillStyle = 'rgba(214,236,246,0.6)';
  rrect(ctx, -5.5, -1, 11, 15, 2.5);
  ctx.fill();
  ctx.strokeStyle = 'rgba(235,248,255,0.9)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(6, 6, 3.2, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.restore();
}

// The machine itself. lamp: 'brewing' (a small green lamp, blinking) | 'brewed' (a big green lamp, steady) | null.
// steam: a full hot pot. scorch: it shorted: soot up its top and the wall behind it, for the rest of the day.
// smoke: it shorted and the fuse it blew is still out: smoke off its back, its socket glowing orange, so in the
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
    const r = big ? 9 : 5;
    const g = ctx.createRadialGradient(lx, ly, 0.2, lx, ly, r);
    g.addColorStop(0, 'rgba(150,255,140,0.9)');
    g.addColorStop(1, 'rgba(150,255,140,0)');
    ctx.fillStyle = g;
    ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
    fillCircle(ctx, lx, ly, big ? 2.6 : 1.6, '#e2ffd8');
  }
  if (shown.steam) {
    for (let i = 0; i < 3; i++) {
      const k = (t * 0.5 + i / 3) % 1;
      fillCircle(ctx, px + 14.5 + Math.sin(t * 1.7 + i * 2.1) * 3 * k, py + 10 - k * 20, 2 + k * 4, `rgba(255,255,255,${0.55 * (1 - k)})`);
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
