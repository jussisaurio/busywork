// The dark (level.darkness: src/game/darkness.js), drawn over the people and under the bubbles: a navy veil on
// every dark room, cut open where a torch beam falls. Everyone in the dark is drawn again over the veil in their own
// colours mixed toward the night, so you know who is who, with eyes looking where they look (you also get a red
// outline, so you can find yourself). A torch lights its holder (a small pool of light: him, his chair) and is drawn
// in his hand: his arm raised along the beam, a white phone, its LED; the beam starts at the LED and washes out with
// a crisp edge on each side. Pose torch holders with free hands (level.poses: not 'reach'): the torch arm is drawn
// here. With cones on (settings.showCones), everyone's arm's-length sight shows over the veil as a dim fan with an
// edge, and when a room has just gone dark each daylight cone in it shrinks to that fan (DARK_FADE s), so you watch
// the dark take their sight away. A lit room that dips (rooms[].dip) gets the veil at that fraction: a flicker.
// Lit rooms and levels without darkness draw nothing here, except the light controls (darkness.controls): a wall
// switch or a breaker panel on its wall tile, on the face that looks into the room, and the little lamp that glows
// on it while it is off.
import { T, fin, clamp, fillCircle, ellipse, circle } from './util.js';
import { C, CONE_TINT_DEFAULT } from './palette.js';
import { castRay } from './cones.js';
import { headY, lookFor, drawCharacters } from './characters.js';
import { viewerOf } from '../game/perception.js';
import { darkZones, dimZones, isDark, nearViewer, torchViewer } from '../game/darkness.js';

const VEIL = 'rgba(14,20,46,0.8)';
const VEIL_A = 0.8;
const BEAM_RAYS = 18;
const DARK_FADE = 1.2; // s: a daylight cone shrinking to arm's length after its room goes dark
const DARK_GAP = 0.5; // s: frames further apart than this cannot tell when the dark came (no shrink drawn)

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

// A beam (viewer v, tiles) as the current subpath, starting at `from` (px: the torch's LED) and ending where the
// fan's rays from the holder meet a wall, so the light leaves the phone, not his chest.
function beamPath(ctx, map, v, from, fov = v.fov) {
  const ox = fin(v.x);
  const oy = fin(v.y);
  const f = clamp(fin(fov, 0.5), 0.05, Math.PI * 2);
  const a0 = fin(v.dir) - f / 2;
  ctx.moveTo(from.x, from.y);
  for (let i = 0; i <= BEAM_RAYS; i++) {
    const ang = a0 + (f * i) / BEAM_RAYS;
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

// A wall switch centred at (x, y): a cream plate with a rocker, up when on. Its locator lamp (amber) is lit while it
// is off. Returns the lamp ({ x, y, r, color: [r, g, b] while lit, else null }). Exported for end scenes.
const SWITCH = { w: 9, h: 13 };
export function paintSwitch(ctx, x, y, on) {
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
  return { x, y: y + 4.5, color: on ? null : [255, 176, 64], r: 1.8 };
}

// A breaker panel centred at (x, y): a grey metal box. On, its door is shut (a yellow lightning sticker, a green
// lamp). Off, its door hangs open on a dark row of breakers with the red main lever down, and its lamp blinks red.
// Returns the lamp, as paintSwitch (idle: the colour of an unlit lamp's dot). Exported for end scenes.
const BREAKER = { w: 16, h: 20 };
export function paintBreaker(ctx, x, y, on, t) {
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
    ctx.fillStyle = '#6f777f'; // its seam, all the way round, and the hinge side
    ctx.fillRect(l + 1, top + 1, w - 2, 0.8);
    ctx.fillRect(l + 1, top + h - 1.8, w - 2, 0.8);
    ctx.fillRect(l + 1, top + 1, 0.8, h - 2);
    ctx.fillRect(l + w - 1.8, top + 1, 0.8, h - 2);
    ctx.fillStyle = '#7e868e'; // hinges, handle
    ctx.fillRect(l + 1.8, top + 4, 1, 2);
    ctx.fillRect(l + 1.8, top + h - 6, 1, 2);
    ctx.fillRect(l + w - 4.5, y - 1, 1.6, 4);
    // a small sticker low on the door: a yellow triangle with a black bolt
    const cy = y + 5;
    ctx.beginPath();
    ctx.moveTo(x - 1, cy - 3.6);
    ctx.lineTo(x + 2.6, cy + 2.6);
    ctx.lineTo(x - 4.6, cy + 2.6);
    ctx.closePath();
    ctx.fillStyle = '#f2c230';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 0.6, cy - 1.8);
    ctx.lineTo(x - 1.8, cy + 0.4);
    ctx.lineTo(x - 0.9, cy + 0.4);
    ctx.lineTo(x - 1.5, cy + 2);
    ctx.lineTo(x + 0.2, cy - 0.4);
    ctx.lineTo(x - 0.7, cy - 0.4);
    ctx.closePath();
    ctx.fillStyle = '#1d1d1d';
    ctx.fill();
    ctx.fillStyle = '#2b3036'; // the lamp's bezel
    ctx.beginPath();
    ctx.arc(x, top + 5, 2.9, 0, Math.PI * 2);
    ctx.fill();
    return { x, y: top + 5, color: null, r: 2.1, idle: '#5fd36a' };
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
  return { x: l + w - 3, y: top + 2.5, color: blink ? [255, 70, 60] : null, r: 2 };
}

function drawControl(ctx, k, game, t) {
  const on = isOn(k, game);
  const size = k.kind === 'breaker' ? BREAKER : SWITCH;
  const { x, y } = anchor(k, size.w, size.h);
  const lamp = k.kind === 'breaker' ? paintBreaker(ctx, x, y, on, t) : paintSwitch(ctx, x, y, on);
  if (lamp.idle) fillCircle(ctx, lamp.x, lamp.y, lamp.r, lamp.idle);
  return lamp;
}

// A lit lamp: the dot and a soft glow around it, brighter when the room it looks into is dark. Exported for end
// scenes (dark: draw the bright glow).
export function paintLamp(ctx, lamp, dark, t) {
  if (!lamp.color) return;
  const [r, g, b] = lamp.color;
  const a = (dark ? 0.55 : 0.28) * (0.8 + 0.2 * Math.sin(fin(t) * 3));
  const rad = dark ? 11 : 6;
  const grad = ctx.createRadialGradient(lamp.x, lamp.y, 0.5, lamp.x, lamp.y, rad);
  grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(lamp.x - rad, lamp.y - rad, rad * 2, rad * 2);
  fillCircle(ctx, lamp.x, lamp.y, lamp.r, `rgb(${r},${g},${b})`);
}

// ---- People in the dark ----------------------------------------------------------------------------------------

// Whoever stands in the dark is drawn again over the veil in their own colours, mixed this far toward the night:
// you still know who it is (shirt, hair, build), and that they stand in the dark. Torch holders get a small pool of
// their own light instead (POOL px), so a torch lights its holder and his chair.
const NIGHT = 0.5;
const NIGHT_RGB = [14, 20, 46];
const POOL = 21;

const nightColors = new Map();
function parseColor(c) {
  let m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(c);
  if (m) return [...m.slice(1, 4).map((h) => parseInt(h + h, 16)), 1];
  m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i.exec(c);
  if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16), m[4] ? parseInt(m[4], 16) / 255 : 1];
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(c);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] === undefined ? 1 : Number(m[4])];
  return null;
}
// A colour as it shows in the dark (exported for tests). Anything but a hex or rgb() colour is left alone.
export function nightColor(c) {
  if (typeof c !== 'string') return c;
  let v = nightColors.get(c);
  if (v === undefined) {
    const p = parseColor(c);
    const mix = (i) => Math.round(clamp(p[i] + (NIGHT_RGB[i] - p[i]) * NIGHT, 0, 255));
    v = p ? `rgba(${mix(0)},${mix(1)},${mix(2)},${clamp(p[3], 0, 1)})` : c;
    nightColors.set(c, v);
  }
  return v;
}

// The same context, but every colour set on it is its night colour.
const nightCtxs = new WeakMap();
function nightCtx(ctx) {
  let p = nightCtxs.get(ctx);
  if (p) return p;
  const bound = new Map();
  p = new Proxy(ctx, {
    get(target, key) {
      const v = target[key];
      if (typeof v !== 'function') return v;
      let f = bound.get(key);
      if (!f) bound.set(key, (f = v.bind(target)));
      return f;
    },
    set(target, key, value) {
      target[key] = key === 'fillStyle' || key === 'strokeStyle' ? nightColor(value) : value;
      return true;
    },
  });
  nightCtxs.set(ctx, p);
  return p;
}

// Where a torch holder's phone is: in the hand on the side his beam leans to, held out along the beam (so it
// sweeps with his glance), at the height render/characters.js puts a hand for someone sitting or standing.
// Returns px { sx, sy (shoulder), hx, hy (hand), lx, ly (the LED), a (screen angle), hidden (beam points away from
// the screen: his body hides the phone) }.
const TORCH_REACH = 12;
function torchHand(game, n, beamDir, t) {
  const look = lookFor(game.level.looks, n.id, n.color);
  const x = fin(n.x) * T;
  const y = fin(n.y) * T;
  const d = fin(n.dir);
  const sit = n.pose === 'sit';
  const walking = !sit && (n.pose === 'walk' || !!n.moving);
  const bob = walking ? Math.abs(Math.sin(t * 10 + (n.id ? n.id.length * 1.3 : 0))) * 1.6 : 0;
  const bodyY = (sit ? 1 : -2) - bob;
  const rx = -Math.sin(d);
  const ry = Math.cos(d) * 0.6;
  const side = Math.sin(beamDir - d) < -0.3 ? -1 : 1; // the beam leaning to his left: his left hand
  const sl = (9 - 2.5 * Math.abs(Math.cos(d))) * (look.wide || 1) * 0.85;
  const bfx = Math.cos(beamDir);
  const bfy = Math.sin(beamDir) * 0.6;
  const reach = TORCH_REACH + Math.sin(fin(t) * 5) * 0.4;
  const hx = x + side * rx * 3 + bfx * reach;
  const hy = y + bodyY - 5 + side * ry * 3 + bfy * reach; // held up, above the desk

  return {
    look,
    sx: x + side * rx * sl,
    sy: y + bodyY - 2 + side * ry * sl,
    hx, hy,
    lx: hx + bfx * 7.2,
    ly: hy + bfy * 7.2,
    a: Math.atan2(bfy, bfx),
    hidden: Math.sin(beamDir) < -0.25 && Math.abs(hx - x) < 8, // up the screen, behind his back
  };
}

// The torch: his arm raised along the beam, a white phone in his fist, its LED and a glow. Drawn over the veil (he
// is in his own light). Facing away from the screen, his body hides it: nothing is drawn.
function paintTorch(ctx, h) {
  if (h.hidden) return;
  ctx.strokeStyle = h.look.bodyDark || '#333333';
  ctx.lineWidth = 3.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(h.sx, h.sy);
  ctx.lineTo(h.hx, h.hy);
  ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.save();
  ctx.translate(h.hx + Math.cos(h.a) * 3, h.hy + Math.sin(h.a) * 3);
  ctx.rotate(h.a);
  ctx.fillStyle = '#20232a'; // the phone, end-on along his arm: a dark rim, a bright white back
  ctx.fillRect(-4.6, -3.2, 9.2, 6.4);
  ctx.fillStyle = '#f2f4f8';
  ctx.fillRect(-4, -2.6, 8, 5.2);
  ctx.fillStyle = '#c9ced8';
  ctx.fillRect(-4, 1.4, 8, 1.2);
  ctx.restore();
  fillCircle(ctx, h.hx, h.hy, 2.4, h.look.skin || '#e2b58d');
  const glow = ctx.createRadialGradient(h.lx, h.ly, 0.5, h.lx, h.ly, 13);
  glow.addColorStop(0, 'rgba(255,252,235,1)');
  glow.addColorStop(0.3, 'rgba(255,244,200,0.6)');
  glow.addColorStop(1, 'rgba(255,240,190,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(h.lx - 13, h.ly - 13, 26, 26);
  fillCircle(ctx, h.lx, h.ly, 1.9, '#ffffff'); // the LED
}

// ---- The dark -----------------------------------------------------------------------------------------------

export function drawDarkness(ctx, game, t) {
  const map = game.map;
  if (!map) return;
  const controls = controlsOf(game);
  const lamps = controls.map((k) => drawControl(ctx, k, game, t));
  const zones = darkZones(game);
  const fade = freshDark(game, zones, fin(t));
  if (zones.length) drawVeil(ctx, game, map, zones, t, fade);
  for (const d of dimZones(game)) { // a lit room dipping: the veil at that fraction
    darkPath(ctx, d.zones);
    ctx.fillStyle = `rgba(14,20,46,${(VEIL_A * d.k).toFixed(3)})`;
    ctx.fill();
  }
  controls.forEach((k, i) => paintLamp(ctx, lamps[i], !!k.room && isDark(game, k.room.x, k.room.y), t));
}

// The zones that went dark within the last DARK_FADE s, and how much of the fade is left: { zones, k (1..0) }, or
// null. Remembered per game between frames; the first frame seen, or a frame long after the last, starts no fade
// (nobody saw the lights go). Nothing lights up on a first frame.
const darkSeen = new WeakMap(); // game -> { zones, t, fresh, at }
function freshDark(game, zones, t) {
  const prev = darkSeen.get(game);
  if (!prev || t < prev.t) {
    darkSeen.set(game, { zones, t, fresh: null, at: 0 });
    return null;
  }
  const changed = zones.length !== prev.zones.length || zones.some((z, i) => z !== prev.zones[i]);
  if (changed) {
    const newly = zones.filter((z) => !prev.zones.includes(z));
    prev.fresh = newly.length && t - prev.t <= DARK_GAP ? newly : null;
    prev.at = t;
    prev.zones = zones;
  }
  prev.t = t;
  if (!prev.fresh || t - prev.at >= DARK_FADE) return null;
  return { zones: prev.fresh, k: 1 - (t - prev.at) / DARK_FADE };
}

const tintOf = (n) => (Array.isArray(n.coneTint) ? n.coneTint : CONE_TINT_DEFAULT);
const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${clamp(a, 0, 1).toFixed(3)})`;

// Everyone's arm's-length sight into the dark (cones on): a dim fan with an edge, over the veil. And, while a room
// has just gone dark, each daylight cone shrinking from its full reach to that fan.
function drawNearSight(ctx, game, map, zones, fade) {
  if (!game.settings?.showCones) return;
  const npcs = (game.npcs || []).filter((n) => n && n.active && n.vision);
  if (fade) {
    ctx.save();
    darkPath(ctx, fade.zones);
    ctx.clip();
    for (const n of npcs) {
      const v = viewerOf(n);
      const near = nearViewer(game, v);
      const r = fin(near.radius, 1) + (fin(v.radius, 1) - fin(near.radius, 1)) * fade.k;
      const fov = fin(near.fov, 1) + (fin(v.fov, 1) - fin(near.fov, 1)) * fade.k;
      ctx.beginPath();
      fanPath(ctx, map, { ...v, radius: r, fov }, BEAM_RAYS);
      ctx.fillStyle = rgba(tintOf(n), 0.26 * fade.k);
      ctx.fill();
      ctx.strokeStyle = rgba(tintOf(n), 0.5 * fade.k);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.save();
  darkPath(ctx, zones);
  ctx.clip();
  for (const n of npcs) {
    ctx.beginPath();
    fanPath(ctx, map, nearViewer(game, viewerOf(n)), 12);
    ctx.fillStyle = rgba(tintOf(n), 0.1);
    ctx.fill();
    ctx.strokeStyle = rgba(tintOf(n), 0.55);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

// The fan's two edge rays' far ends (px), for a crisp beam edge.
function fanEdges(map, v) {
  const ox = fin(v.x);
  const oy = fin(v.y);
  const fov = clamp(fin(v.fov, 0.5), 0.05, Math.PI * 2);
  return [-1, 1].map((s) => {
    const ang = fin(v.dir) + (s * fov) / 2;
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    const d = castRay(map, ox, oy, dx, dy, Math.max(0.5, fin(v.radius, 1)));
    return { x: (ox + dx * d) * T, y: (oy + dy * d) * T };
  });
}

function drawVeil(ctx, game, map, zones, t, fade = null) {
  const mw = map.w * T;
  const mh = map.h * T;
  const beams = [];
  const holders = [];
  if (game.phase === 'day') {
    for (const n of game.npcs || []) {
      if (!n || !n.active || !n.vision) continue;
      const b = torchViewer(game, n, viewerOf(n));
      if (b) { beams.push(b); holders.push(n); }
    }
  }
  const pools = holders.map((n) => ({ x: fin(n.x) * T, y: fin(n.y) * T - 5 }));
  const hands = holders.map((n, i) => torchHand(game, n, fin(beams[i].dir), t));
  const leds = hands.map((h) => ({ x: h.lx, y: h.ly }));
  // The dark rects, minus every beam (one clip per beam: the clips intersect, so all are cut out).
  const clipDark = () => {
    darkPath(ctx, zones);
    ctx.clip();
    beams.forEach((b, i) => {
      ctx.beginPath();
      ctx.rect(0, 0, mw, mh);
      beamPath(ctx, map, b, leds[i]);
      ctx.clip('evenodd');
    });
  };

  // The veil, and everyone under it drawn again in their night colours.
  ctx.save();
  clipDark();
  ctx.fillStyle = VEIL;
  ctx.fillRect(0, 0, mw, mh);
  drawCharacters(nightCtx(ctx), game, t, null);
  ctx.restore();

  // A torch lights its holder: within its pool he is drawn in his own colours, in a soft warm glow.
  if (pools.length) {
    ctx.save();
    darkPath(ctx, zones);
    ctx.clip();
    ctx.beginPath();
    for (const p of pools) {
      ctx.moveTo(p.x + POOL, p.y);
      ctx.arc(p.x, p.y, POOL, 0, Math.PI * 2);
    }
    ctx.clip();
    drawCharacters(ctx, game, t, null);
    for (const p of pools) {
      const g = ctx.createRadialGradient(p.x, p.y, 4, p.x, p.y, POOL);
      g.addColorStop(0, 'rgba(255,240,190,0.22)');
      g.addColorStop(1, 'rgba(255,240,190,0)');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - POOL, p.y - POOL, POOL * 2, POOL * 2);
    }
    ctx.restore();
  }

  // The beams: a warm wash out of the phone, brightest at the LED, a brighter core down the middle, and a crisp
  // edge on each side (inside it you are seen; a step outside, you are in the dark).
  if (beams.length) {
    ctx.save();
    darkPath(ctx, zones);
    ctx.clip();
    beams.forEach((b, i) => {
      const { x: lx, y: ly } = leds[i];
      const r = Math.max(POOL * 2, fin(b.radius, 1) * T);
      const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
      grad.addColorStop(0, 'rgba(255,244,205,0.55)');
      grad.addColorStop(0.25, 'rgba(255,240,190,0.36)');
      grad.addColorStop(1, 'rgba(255,240,190,0.05)');
      ctx.beginPath();
      beamPath(ctx, map, b, leds[i]);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      beamPath(ctx, map, b, leds[i], fin(b.fov, 0.5) * 0.4);
      ctx.fillStyle = 'rgba(255,246,215,0.12)';
      ctx.fill();
    });
    ctx.strokeStyle = 'rgba(255,236,170,0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    beams.forEach((b, i) => {
      for (const e of fanEdges(map, b)) {
        ctx.moveTo(leds[i].x, leds[i].y);
        ctx.lineTo(e.x, e.y);
      }
    });
    ctx.stroke();
    ctx.restore();
  }
  drawNearSight(ctx, game, map, zones, fade);
  // The torch itself, in the holder's hand (the beam is not a glow from nowhere).
  hands.forEach((h) => paintTorch(ctx, h));

  // Eyes in the dark (nobody's eyes while a beam or his own torch lights him).
  const lit = (x, y) => beams.some((b) => {
    const d = Math.hypot(x - b.x, y - b.y);
    if (d > b.radius) return false;
    const a = Math.atan2(y - b.y, x - b.x) - b.dir;
    return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= b.fov / 2;
  });
  for (const n of game.npcs || []) {
    if (!n || !n.active || holders.includes(n) || !isDark(game, n.x, n.y) || lit(n.x, n.y)) continue;
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
