// The dark (level.darkness: src/game/darkness.js), drawn over the people and under the bubbles: a navy
// veil on every dark room, cut open where a torch beam falls, and eyes for whoever stands in the dark (you also get
// a red outline, so you can find yourself). Lit rooms and levels without darkness draw nothing here, except the
// light controls (darkness.controls): a wall switch or a breaker panel on its wall tile, on the face that looks into
// the room, and the little lamp that glows on it while it is off.
import { T, fin, clamp, fillCircle, ellipse, circle } from './util.js';
import { C } from './palette.js';
import { castRay } from './cones.js';
import { headY } from './characters.js';
import { viewerOf } from '../game/perception.js';
import { darkZones, isDark, torchViewer } from '../game/darkness.js';

const VEIL = 'rgba(14,20,46,0.8)';
const BEAM_RAYS = 18;

// Union of the dark rects as the current path.
export function darkPath(ctx, zones) {
  ctx.beginPath();
  for (const z of zones) ctx.rect(z.x0 * T, z.y0 * T, (z.x1 - z.x0) * T, (z.y1 - z.y0) * T);
}

// A fan (viewer v, tiles) cut by walls, as the current subpath: the polygon a cone or beam fills.
export function fanPath(ctx, map, v, rays) {
  const ox = fin(v.x);
  const oy = fin(v.y);
  const fov = clamp(fin(v.fov, 0.5), 0.05, Math.PI * 2);
  const a0 = fin(v.dir) - fov / 2;
  ctx.moveTo(ox * T, oy * T);
  for (let i = 0; i <= rays; i++) {
    const ang = a0 + (fov * i) / rays;
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    const d = castRay(map, ox, oy, dx, dy, Math.max(0.5, fin(v.radius, 1)));
    ctx.lineTo((ox + dx * d) * T, (oy + dy * d) * T);
  }
  ctx.closePath();
}

// Two eyes where a person's head is, looking along `dir`.
function eyes(ctx, game, n, dir) {
  const x = fin(n.x) * T + Math.cos(dir) * 2;
  const y = headY(game.level.looks, n, 'eyeDy') + Math.sin(dir) * 1.2;
  const px = -Math.sin(dir) * 2.6;
  const py = Math.cos(dir) * 0.8;
  for (const s of [-1, 1]) {
    fillCircle(ctx, x + px * s, y + py * s, 1.7, '#f4efe2');
    fillCircle(ctx, x + px * s + Math.cos(dir) * 0.6, y + py * s + Math.sin(dir) * 0.5, 0.8, '#15151c');
  }
}

// ---- Light controls -------------------------------------------------------------------------------------------

const NEIGHBOURS = [['S', 0, 1], ['E', 1, 0], ['W', -1, 0], ['N', 0, -1]]; // the face that looks into the room
const placed = new WeakMap(); // map -> [{ kind, on, tx, ty, face }]

// The level's controls, each found on its map letter's first tile and facing its first open neighbour.
function controlsOf(game) {
  const list = game.level?.darkness?.controls;
  const map = game.map;
  if (!list?.length || !map) return [];
  let out = placed.get(map);
  if (out) return out;
  const rows = game.level.map?.rows ?? [];
  out = [];
  for (const c of list) {
    const ty = rows.findIndex((r) => r.includes(c.tile));
    if (ty < 0) continue;
    const tx = rows[ty].indexOf(c.tile);
    const open = NEIGHBOURS.find(([, dx, dy]) => {
      const x = tx + dx;
      const y = ty + dy;
      return x >= 0 && y >= 0 && x < map.w && y < map.h && !map.isSolid(x, y);
    });
    out.push({ kind: c.kind, on: c.on, tx, ty, face: open ? open[0] : 'S', room: open ? { x: tx + open[1] + 0.5, y: ty + open[2] + 0.5 } : null });
  }
  placed.set(map, out);
  return out;
}

// Where a control of size w x h sits on its tile: on the front face (S), against a side edge of the wall cap (E, W),
// or at its top edge (N). Returns its centre and scale.
function anchor(k, w, h) {
  const px = k.tx * T;
  const py = k.ty * T;
  if (k.face === 'S') return { x: px + T / 2, y: py + T - 2 - h / 2, s: 1 };
  if (k.face === 'E') return { x: px + T - 3 - w / 2, y: py + T / 2, s: 1 };
  if (k.face === 'W') return { x: px + 3 + w / 2, y: py + T / 2, s: 1 };
  return { x: px + T / 2, y: py + 2 + h / 2, s: 1 };
}

function isOn(k, game) {
  try { return !!k.on(game.world); } catch { return true; }
}

// A wall switch: a cream plate with a rocker, up when on. Its locator lamp (amber) is lit while it is off.
const SWITCH = { w: 9, h: 13 };
function drawSwitch(ctx, k, on) {
  const { x, y } = anchor(k, SWITCH.w, SWITCH.h);
  const { w, h } = SWITCH;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x - w / 2 + 1, y - h / 2 + 1, w, h);
  ctx.fillStyle = '#3a2e26';
  ctx.fillRect(x - w / 2 - 0.5, y - h / 2 - 0.5, w + 1, h + 1);
  ctx.fillStyle = '#efe6d2';
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.fillStyle = '#c9bea6'; // the rocker's well
  ctx.fillRect(x - 2.5, y - 4.5, 5, 7);
  ctx.fillStyle = '#fffaf0'; // the half pushed out catches the light
  ctx.fillRect(x - 2, on ? y - 4 : y - 1, 4, 3);
  ctx.fillStyle = '#a89c84';
  ctx.fillRect(x - 2, on ? y - 1 : y - 4, 4, 3);
  ctx.fillStyle = '#7d7262'; // two screws
  ctx.fillRect(x - 0.5, y - h / 2 + 1, 1, 1);
  ctx.fillRect(x - 0.5, y + h / 2 - 2, 1, 1);
  return { x, y: y + 4.5, color: on ? null : [255, 176, 64], r: 1.3 };
}

// A breaker panel: a grey metal box. On, its door is shut (a yellow lightning sticker, a green lamp). Off, its door
// hangs open on a dark row of breakers with the red main lever down, and its lamp blinks red.
const BREAKER = { w: 16, h: 20 };
function drawBreaker(ctx, k, on, t) {
  const { x, y } = anchor(k, BREAKER.w, BREAKER.h);
  const { w, h } = BREAKER;
  const l = x - w / 2;
  const top = y - h / 2;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(l + 1.5, top + 1.5, w, h);
  ctx.fillStyle = '#2b3036';
  ctx.fillRect(l - 1, top - 1, w + 2, h + 2);
  ctx.fillStyle = '#9aa3ab';
  ctx.fillRect(l, top, w, h);
  if (on) {
    ctx.fillStyle = '#b6bec5'; // the door
    ctx.fillRect(l + 1, top + 1, w - 2, h - 2);
    ctx.fillStyle = '#7e868e'; // hinge side, handle
    ctx.fillRect(l + 1, top + 1, 1, h - 2);
    ctx.fillRect(l + w - 4, y - 1, 2, 4);
    // the sticker: a yellow triangle with a black bolt
    const cy = y + 1;
    ctx.beginPath();
    ctx.moveTo(x - 0.5, cy - 6);
    ctx.lineTo(x + 5, cy + 4);
    ctx.lineTo(x - 6, cy + 4);
    ctx.closePath();
    ctx.fillStyle = '#1d1d1d';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 0.5, cy - 4.4);
    ctx.lineTo(x + 3.7, cy + 3.2);
    ctx.lineTo(x - 4.7, cy + 3.2);
    ctx.closePath();
    ctx.fillStyle = '#f2c230';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, cy - 2.8);
    ctx.lineTo(x - 1.8, cy + 0.6);
    ctx.lineTo(x - 0.2, cy + 0.6);
    ctx.lineTo(x - 1.2, cy + 2.8);
    ctx.lineTo(x + 1.6, cy - 0.6);
    ctx.lineTo(x, cy - 0.6);
    ctx.closePath();
    ctx.fillStyle = '#1d1d1d';
    ctx.fill();
    return { x: l + w - 3, y: top + 3, color: null, r: 1.2, idle: '#5fd36a' };
  }
  ctx.fillStyle = '#23272c'; // the open box
  ctx.fillRect(l + 1, top + 1, w - 2, h - 2);
  ctx.fillStyle = '#cfd3d6'; // two rows of small breakers
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(l + 3 + i * 3, top + 9, 2, 3);
    ctx.fillRect(l + 3 + i * 3, top + 14, 2, 3);
  }
  ctx.fillStyle = '#d0413a'; // the main lever, down
  ctx.fillRect(l + 3, top + 4, w - 6, 2);
  ctx.fillRect(x - 1, top + 4, 2, 4);
  // the door, swung open on its hinge: a thin slanted panel off the left edge
  ctx.beginPath();
  ctx.moveTo(l - 1, top - 1);
  ctx.lineTo(l - 5, top + 2);
  ctx.lineTo(l - 5, top + h - 1);
  ctx.lineTo(l - 1, top + h + 1);
  ctx.closePath();
  ctx.fillStyle = '#7e868e';
  ctx.fill();
  const blink = Math.sin(fin(t) * 7) > -0.2;
  return { x: l + w - 3, y: top + 2.5, color: blink ? [255, 70, 60] : null, r: 1.3 };
}

function drawControl(ctx, k, game, t) {
  const on = isOn(k, game);
  const lamp = k.kind === 'breaker' ? drawBreaker(ctx, k, on, t) : drawSwitch(ctx, k, on);
  if (lamp.idle) fillCircle(ctx, lamp.x, lamp.y, lamp.r, lamp.idle);
  return lamp;
}

// A lit lamp: the dot and a soft glow around it, brighter when the room it looks into is dark.
function drawLamp(ctx, game, k, lamp, t) {
  if (!lamp.color) return;
  const [r, g, b] = lamp.color;
  const dark = k.room && isDark(game, k.room.x, k.room.y);
  const a = (dark ? 0.55 : 0.28) * (0.8 + 0.2 * Math.sin(fin(t) * 3));
  const rad = dark ? 11 : 6;
  const grad = ctx.createRadialGradient(lamp.x, lamp.y, 0.5, lamp.x, lamp.y, rad);
  grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(lamp.x - rad, lamp.y - rad, rad * 2, rad * 2);
  fillCircle(ctx, lamp.x, lamp.y, lamp.r, `rgb(${r},${g},${b})`);
}

// ---- The dark -----------------------------------------------------------------------------------------------

export function drawDarkness(ctx, game, t) {
  const map = game.map;
  if (!map) return;
  const controls = controlsOf(game);
  const lamps = controls.map((k) => drawControl(ctx, k, game, t));
  const zones = darkZones(game);
  if (zones.length) drawVeil(ctx, game, map, zones, t);
  controls.forEach((k, i) => drawLamp(ctx, game, k, lamps[i], t));
}

function drawVeil(ctx, game, map, zones, t) {
  const mw = map.w * T;
  const mh = map.h * T;
  const beams = [];
  if (game.phase === 'day') {
    for (const n of game.npcs || []) {
      if (!n || !n.active || !n.vision) continue;
      const b = torchViewer(game, n, viewerOf(n));
      if (b) beams.push(b);
    }
  }

  // The veil: the dark rects, minus every beam (one clip per beam: the clips intersect, so all are cut out).
  ctx.save();
  darkPath(ctx, zones);
  ctx.clip();
  for (const b of beams) {
    ctx.beginPath();
    ctx.rect(0, 0, mw, mh);
    fanPath(ctx, map, b, BEAM_RAYS);
    ctx.clip('evenodd');
  }
  ctx.fillStyle = VEIL;
  ctx.fillRect(0, 0, mw, mh);
  ctx.restore();

  // The beams themselves: a warm wash, brightest at the phone.
  if (beams.length) {
    ctx.save();
    darkPath(ctx, zones);
    ctx.clip();
    for (const b of beams) {
      const cx = fin(b.x) * T;
      const cy = fin(b.y) * T;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, Math.max(4, fin(b.radius, 1) * T));
      grad.addColorStop(0, 'rgba(255,240,190,0.34)');
      grad.addColorStop(1, 'rgba(255,240,190,0)');
      ctx.beginPath();
      fanPath(ctx, map, b, BEAM_RAYS);
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.restore();
  }

  // Eyes in the dark (nobody's eyes while a beam is on him: he's lit).
  const lit = (x, y) => beams.some((b) => {
    const d = Math.hypot(x - b.x, y - b.y);
    if (d > b.radius) return false;
    const a = Math.atan2(y - b.y, x - b.x) - b.dir;
    return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= b.fov / 2;
  });
  for (const n of game.npcs || []) {
    if (!n || !n.active || !isDark(game, n.x, n.y) || lit(n.x, n.y)) continue;
    eyes(ctx, game, n, fin(n.dir) + (n.glance ? fin(n.glance.offset) : 0));
  }
  const p = game.player;
  if (p && game.phase === 'day' && isDark(game, p.x, p.y) && !lit(p.x, p.y)) {
    const x = fin(p.x) * T;
    const y = fin(p.y) * T;
    const sit = p.seated || p.pose === 'sit' ? 3 : 0;
    ctx.strokeStyle = C.tomato;
    ctx.globalAlpha = 0.75 + 0.25 * Math.sin(fin(t) * 4);
    ctx.lineWidth = 1.5;
    ellipse(ctx, x, y - 2 + sit, 9, 7);
    ctx.stroke();
    circle(ctx, x, headY(game.level.looks, p, 'eyeDy'), 6.6);
    ctx.stroke();
    ctx.globalAlpha = 1;
    eyes(ctx, game, p, fin(p.dir));
  }
}
