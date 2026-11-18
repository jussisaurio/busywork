// Vision cones: a soft translucent fan per active NPC, clipped by opaque tiles with a
// DDA ray cast. Every cone is as plain as the authority's: anyone can tell on you. Its edge firms up while it has
// you in sight, and the cone flashes warmer/redder while that NPC is "noticing" the player.
import { T, clamp, fin } from './util.js';
import { CONE_TINT_DEFAULT } from './palette.js';
import { viewerOf, findNpc, cameraFeed, npcSees, seenVia } from '../game/perception.js';
import { canSee, angleDiff } from '../core/vision.js';
import { darkZones, nearViewer } from '../game/darkness.js';

const RAYS = 56;
const MAX_STEPS = 64;
const RED = [255, 64, 44];

// Distance (tiles) from (ox, oy) along unit (dx, dy) to the first opaque tile, capped at maxDist.
export function castRay(map, ox, oy, dx, dy, maxDist) {
  let mx = Math.floor(ox);
  let my = Math.floor(oy);
  const stepX = dx > 0 ? 1 : -1;
  const stepY = dy > 0 ? 1 : -1;
  const tdx = dx !== 0 ? Math.abs(1 / dx) : Infinity;
  const tdy = dy !== 0 ? Math.abs(1 / dy) : Infinity;
  let tmx = dx > 0 ? (mx + 1 - ox) * tdx : dx < 0 ? (ox - mx) * tdx : Infinity;
  let tmy = dy > 0 ? (my + 1 - oy) * tdy : dy < 0 ? (oy - my) * tdy : Infinity;
  for (let i = 0; i < MAX_STEPS; i++) {
    let dist;
    if (tmx < tmy) {
      dist = tmx;
      tmx += tdx;
      mx += stepX;
    } else {
      dist = tmy;
      tmy += tdy;
      my += stepY;
    }
    if (!(dist < maxDist)) return maxDist;
    if (map.isOpaque(mx, my)) return dist;
  }
  return maxDist;
}

const NO_CONES = {};

// Red is the cone of whoever sees you, and only his (the notice mix below). A cast tint in the red-to-orange band
// (hue under about 36°) is drawn amber instead, so a cone that sees nothing never passes for one that does.
const calmed = new WeakMap();
export function coneTint(npc) {
  const t = npc.coneTint || CONE_TINT_DEFAULT;
  let c = calmed.get(t);
  if (!c) {
    const [r, g, b] = t;
    c = r > g && g >= b && r > b && (g - b) / (r - b) < 0.6 ? [r, Math.round(b + 0.75 * (r - b)), b] : t;
    calmed.set(t, c);
  }
  return c;
}

// 0..1: how hard this NPC is "noticing" the player right now (derived, read-only): caught by him; the authority's
// suspicion (game.suspicion, keyed by his id); one of the level's alert overrides (level.cones.alert); or something
// the rules object to in his sight (game.watch, published by play/rules.js every step, so the glow is exactly
// what the rules react to).
function noticeLevel(game, npc) {
  let lvl = 0;
  if (game.caught && game.caught.by === npc.id) return 1;
  if (game.suspicion && Object.hasOwn(game.suspicion, npc.id)) {
    const s = fin(game.suspicion[npc.id]);
    if (s > 0) lvl = 0.35 + 0.65 * clamp(s, 0, 1);
  }
  const cones = (game.level && game.level.cones) || NO_CONES;
  if (npc.override && cones.alert && cones.alert.includes(npc.override)) lvl = Math.max(lvl, 0.55);
  if (game.watch && Object.hasOwn(game.watch, npc.id)) lvl = Math.max(lvl, 0.8);
  return lvl;
}

// The colour of this NPC's sight right now, for his cone and for his near sight in the dark (darkness.js) alike: one
// rule decides when sight is hostile. His tint (coneTint), mixed toward red as hard as he notices you (noticeLevel),
// pulsing while he does. Returns { rgb: [r, g, b], notice, pulse }.
export function sightColor(game, npc, t) {
  return mixRed(coneTint(npc), noticeLevel(game, npc), t);
}
function mixRed(tint, notice, t) {
  const pulse = notice > 0 ? 0.75 + 0.25 * Math.sin(t * (8 + notice * 10)) : 1;
  const mix = notice * (0.6 + 0.4 * pulse);
  const rgb = [0, 1, 2].map((i) => Math.round(tint[i] + (RED[i] - tint[i]) * mix));
  return { rgb, notice, pulse };
}

// The cone's fan: from (ox, oy) along dir, cut by walls at most `radius` tiles out (the current path).
function fan(ctx, map, ox, oy, dir, fov, radius) {
  const cx = ox * T;
  const cy = oy * T;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  const a0 = dir - fov / 2;
  for (let i = 0; i <= RAYS; i++) {
    const ang = a0 + (fov * i) / RAYS;
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    const d = castRay(map, ox, oy, dx, dy, radius);
    ctx.lineTo(cx + dx * d * T, cy + dy * d * T);
  }
  ctx.closePath();
}

// Dark rooms (level.darkness): the cone shows only on lit floor, and within arm's length (the near sight) in the
// dark. Torch beams are drawn with the dark itself (render/darkness.js).
function clipTo(ctx, zones, map, outside) {
  ctx.beginPath();
  if (outside) ctx.rect(0, 0, map.w * T, map.h * T);
  for (const z of zones) ctx.rect(z.x0 * T, z.y0 * T, (z.x1 - z.x0) * T, (z.y1 - z.y0) * T);
  ctx.clip(outside ? 'evenodd' : 'nonzero');
}

export function drawCones(ctx, game, t) {
  if (!game.map) return;
  if (game.settings && game.settings.showCones) drawFans(ctx, game, t);
  drawGazes(ctx, game, t);
}

function drawFans(ctx, game, t) {
  const npcs = game.npcs || [];
  const map = game.map;
  const dark = darkZones(game); // [] without level.darkness, or with every light on: the plain path
  const p = game.player;
  for (let n = 0; n < npcs.length; n++) {
    const npc = npcs[n];
    if (!npc || !npc.active || !npc.vision) continue;
    const v = viewerOf(npc);
    const notice = noticeLevel(game, npc);
    const tint = coneTint(npc);
    const near = dark.length ? nearViewer(game, v) : null;
    const sees = !!p && npcSees(game, npc, fin(p.x), fin(p.y)) && !seenVia(game, npc, fin(p.x), fin(p.y)); // his own eyes
    drawFan(ctx, map, v, tint, notice, CONE_BASE, t, dark, near, sees);
  }
  if (game.level?.cameras) drawCameraCones(ctx, game, t);
  drawTurns(ctx, game);
}

const CONE_BASE = 0.2; // a cone's fill at its root, before any notice

// --- what he looks at: a gaze line on each look --------------------------------------------------------------
// When a standing or seated NPC's view settles on a new way (a turn, a glance, a noise), a dotted line runs from his
// eyes to the first thing on it (a solid tile, or the noise he turned to: core/fx.js turned), closed by a viewfinder
// bracket round it, for GAZE_TTL s. Cones overlap; the line says which thing is his. Drawn with or without cones (V).
const GAZE_TTL = 1.6;
const GAZE_MIN = 0.35; // rad his view must move to count as a new look
const gazeMem = new WeakMap(); // npc -> { dir, last, show: { t0, x, y } | null }
function drawGazes(ctx, game, t) {
  const npcs = game.npcs || [];
  const turns = (game.fx && game.fx.turns) || [];
  for (let n = 0; n < npcs.length; n++) {
    const npc = npcs[n];
    if (!npc || !npc.vision) continue;
    const v = viewerOf(npc);
    let m = gazeMem.get(npc);
    if (!m) { gazeMem.set(npc, (m = { dir: v.dir, last: v.dir, show: null })); continue; }
    const step = Math.abs(angleDiff(v.dir, m.last));
    m.last = v.dir;
    if (!npc.active || npc.moving || npc.pose === 'walk') { m.dir = v.dir; m.show = null; continue; }
    if (step < 0.01 && Math.abs(angleDiff(v.dir, m.dir)) > GAZE_MIN) {
      m.dir = v.dir;
      const tr = turns.find((x) => x.id === npc.id);
      m.show = { t0: t, ...(tr ? { x: fin(tr.x), y: fin(tr.y) } : gazeTarget(game.map, v)) };
    }
    if (m.show && t - m.show.t0 < GAZE_TTL) drawGaze(ctx, v, m.show, (t - m.show.t0) / GAZE_TTL, coneTint(npc));
  }
}

// The first solid tile on his gaze (its centre, tiles), past his own tile; else where a wall or his reach stops it.
function gazeTarget(map, v) {
  const dx = Math.cos(v.dir);
  const dy = Math.sin(v.dir);
  const R = Math.max(0.5, fin(v.radius, 6));
  const ox = Math.floor(v.x);
  const oy = Math.floor(v.y);
  for (let d = 0.6; d <= R; d += 0.2) {
    const x = v.x + dx * d;
    const y = v.y + dy * d;
    const mx = Math.floor(x);
    const my = Math.floor(y);
    if (map.isOpaque(mx, my)) return { x, y };
    if ((mx !== ox || my !== oy) && d > 1.1 && map.isSolid(mx, my)) return { x: mx + 0.5, y: my + 0.5 };
  }
  return { x: v.x + dx * R, y: v.y + dy * R };
}

function drawGaze(ctx, v, g, k, tint) {
  const a = (k < 0.15 ? k / 0.15 : 1) * (1 - Math.max(0, (k - 0.7) / 0.3));
  const x0 = v.x * T;
  const y0 = v.y * T;
  const x1 = g.x * T;
  const y1 = g.y * T;
  const L = Math.hypot(x1 - x0, y1 - y0);
  if (!(L > 8)) return;
  const grow = Math.min(1, k / 0.15);
  const col = `rgba(${Math.round(tint[0] * 0.3)},${Math.round(tint[1] * 0.3)},${Math.round(tint[2] * 0.3)},${(0.9 * a).toFixed(3)})`;
  const ex = x0 + (x1 - x0) * grow;
  const ey = y0 + (y1 - y0) * grow;
  const r = 10;
  const c = 4.5;
  const finder = () => {
    ctx.beginPath();
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      ctx.moveTo(x1 + sx * r, y1 + sy * (r - c));
      ctx.lineTo(x1 + sx * r, y1 + sy * r);
      ctx.lineTo(x1 + sx * (r - c), y1 + sy * r);
    }
  };
  ctx.save();
  ctx.lineCap = 'round';
  for (const [w, stroke] of [[4, `rgba(255,250,235,${(0.55 * a).toFixed(3)})`], [2, col]]) { // a light halo, then the ink
    ctx.strokeStyle = stroke;
    ctx.lineWidth = w;
    ctx.setLineDash([2, 5]);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.setLineDash([]);
    if (grow >= 1) { ctx.lineWidth = w + 0.5; finder(); ctx.stroke(); } // a viewfinder round what he looks at
  }
  ctx.restore();
}

// --- a head turned to a noise (core/fx.js turned; sim/mechanics/attention.js) -----------------------------------
// The swing of his cone, drawn where he stands: a dashed arc from the way he was looking to the way he looks now,
// an arrowhead on its end, and a faint ghost of his old cone's edges. It follows his live view, so it grows as he
// turns and fades once he has.
const TURN_R = 1.7; // tiles from his eyes to the arc
function drawTurns(ctx, game) {
  const list = game.fx && game.fx.turns;
  if (!Array.isArray(list) || !list.length) return;
  ctx.save();
  ctx.lineCap = 'round';
  for (const tr of list) {
    const npc = tr && findNpc(game, tr.id);
    if (!npc || !npc.active || !npc.vision) continue;
    const v = viewerOf(npc);
    const ttl = Math.max(0.1, fin(tr.ttl, 1.2));
    const age = clamp(fin(tr.age), 0, ttl);
    const fade = age < ttl * 0.6 ? 1 : 1 - (age - ttl * 0.6) / (ttl * 0.4);
    const from = fin(tr.from);
    const sweep = angleDiff(fin(v.dir), from);
    if (!(Math.abs(sweep) > 0.12) || !(fade > 0.01)) continue;
    const cx = fin(v.x) * T;
    const cy = fin(v.y) * T;
    const R = Math.min(TURN_R, Math.max(0.8, fin(v.radius, 6) * 0.5)) * T;
    const tint = coneTint(npc);
    // the old cone's edges, fading first
    const fov = clamp(fin(v.fov, 1.5), 0.05, Math.PI * 2);
    ctx.setLineDash([3, 4]);
    ctx.globalAlpha = 0.5 * fade * (1 - age / ttl);
    ctx.strokeStyle = `rgb(${tint[0]},${tint[1]},${tint[2]})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (const a of [from - fov / 2, from + fov / 2]) {
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R * 1.6, cy + Math.sin(a) * R * 1.6);
    }
    ctx.stroke();
    // the arc and its head
    const end = from + sweep;
    const ccw = sweep < 0;
    ctx.setLineDash([6, 4]);
    for (const [w, c, a] of [[5, 'rgb(30,20,14)', 0.45], [2.5, 'rgb(255,248,225)', 1]]) {
      ctx.globalAlpha = a * fade;
      ctx.strokeStyle = c;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.arc(cx, cy, R, from, end, ccw);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    const hx = cx + Math.cos(end) * R;
    const hy = cy + Math.sin(end) * R;
    const tx = -Math.sin(end) * Math.sign(sweep); // the way the arc runs at its end
    const ty = Math.cos(end) * Math.sign(sweep);
    const nx = Math.cos(end);
    const ny = Math.sin(end);
    for (const [grow, c, a] of [[2, 'rgb(30,20,14)', 0.45], [0, 'rgb(255,248,225)', 1]]) {
      const s = 6 + grow;
      ctx.globalAlpha = a * fade;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(hx + tx * s * 1.2, hy + ty * s * 1.2);
      ctx.lineTo(hx - tx * s * 0.5 + nx * s * 0.8, hy - ty * s * 0.5 + ny * s * 0.8);
      ctx.lineTo(hx - tx * s * 0.5 - nx * s * 0.8, hy - ty * s * 0.5 - ny * s * 0.8);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

const NO_DARK = [];

// One soft fan: viewer v ({ x, y, dir, fov, radius }), tinted, warmed toward red by `notice` (0..1).
// dark: the dark zones (game/darkness.js darkZones), [] for the plain path. With any, the fan shows only on lit
// floor, and in the dark only the near sight `near` (darkness.js nearViewer(v)) shows, within arm's length.
// Its edge is drawn twice, a darker shade of the tint under the tint itself, so a pale cone reads on a pale floor;
// `sees` (he has you in sight) firms it up.
function drawFan(ctx, map, v, tint, notice, base, t, dark = NO_DARK, near = null, sees = false) {
  const ox = fin(v.x);
  const oy = fin(v.y);
  const fov = clamp(fin(v.fov, 1.5), 0.05, Math.PI * 2);
  const radius = Math.max(0.5, fin(v.radius, 6));
  const dir = fin(v.dir);
  const { rgb: [r, g, b], pulse } = mixRed(tint, notice, t);
  const a = clamp(base + notice * 0.28 * pulse, 0, 0.6);
  const cx = ox * T;
  const cy = oy * T;
  const R = radius * T;

  const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, R);
  grad.addColorStop(0, `rgba(${r},${g},${b},${a.toFixed(3)})`);
  grad.addColorStop(0.65, `rgba(${r},${g},${b},${(a * 0.95).toFixed(3)})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},${(a * 0.8).toFixed(3)})`); // true reach: still plainly there at the edge

  if (dark.length) {
    ctx.save();
    clipTo(ctx, dark, map, true);
  }
  fan(ctx, map, ox, oy, dir, fov, radius);
  ctx.fillStyle = grad;
  ctx.fill();
  const edge = (sees ? 0.5 : 0.36) + notice * 0.3 * pulse;
  ctx.strokeStyle = `rgba(${Math.round(r * 0.45)},${Math.round(g * 0.45)},${Math.round(b * 0.45)},${(edge * 0.8).toFixed(3)})`;
  ctx.lineWidth = sees || notice > 0 ? 2.5 : 2;
  ctx.stroke();
  ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(1, edge + 0.2).toFixed(3)})`;
  ctx.lineWidth = sees || notice > 0 ? 1.5 : 1;
  ctx.stroke();
  if (sees && notice > 0) { // the red starts at his eyes: a ring round its root says whose it is
    ctx.strokeStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},${(0.55 + 0.35 * pulse).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 9 + 2 * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (dark.length) {
    ctx.restore();
    const nr = Math.max(0.5, fin(near.radius, 1));
    ctx.save();
    clipTo(ctx, dark, map, false);
    const ng = ctx.createRadialGradient(cx, cy, 2, cx, cy, nr * T);
    ng.addColorStop(0, `rgba(${r},${g},${b},${Math.min(0.6, a * 1.6).toFixed(3)})`);
    ng.addColorStop(1, `rgba(${r},${g},${b},${(a * 0.5).toFixed(3)})`);
    fan(ctx, map, ox, oy, fin(near.dir), clamp(fin(near.fov, 1.5), 0.05, Math.PI * 2), nr);
    ctx.fillStyle = ng;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

// level.cameras (sim/mechanics/camera.js): a camera's fan is grey while nobody watches its monitor and takes the
// watcher's tint while he does, warming like his own cone when the camera has you in view. A dead screen (static)
// leaves only a faint dashed outline: the lens still turns, but nobody is looking. Camera fans take the plain path
// even in a dark room: a camera's sight ignores level.darkness (game/perception.js), so its fan does too.
const CAMERA_GREY = [150, 150, 160];
function drawCameraCones(ctx, game, t) {
  const p = game.player;
  for (const cam of game.level.cameras) {
    const feed = cameraFeed(game, cam.id);
    const v = feed; // { x, y, dir, fov, radius }: the camera as a viewer
    if (!feed.live) {
      ctx.save();
      ctx.setLineDash([2, 3]);
      drawFan(ctx, game.map, v, CAMERA_GREY, 0, 0.03, t);
      ctx.restore();
      continue;
    }
    const watcher = feed.watcher ? findNpc(game, feed.watcher) : null;
    const tint = watcher ? coneTint(watcher) : CAMERA_GREY;
    const onScreen = watcher && p && canSee(game.map, v, p.x, p.y);
    const notice = onScreen ? Math.max(0.35, noticeLevel(game, watcher)) : 0;
    drawFan(ctx, game.map, v, tint, notice, watcher ? 0.16 : 0.07, t);
  }
}
