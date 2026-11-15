// Vision cones: a soft translucent fan per active NPC, clipped by opaque tiles with a
// DDA ray cast. Cones flash warmer/redder while that NPC is "noticing" the player.
import { T, clamp, fin } from './util.js';
import { CONE_TINT_DEFAULT } from './palette.js';
import { viewerOf, findNpc, cameraFeed } from '../game/perception.js';
import { canSee } from '../core/vision.js';
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
  if (!game.settings || !game.settings.showCones || !game.map) return;
  const npcs = game.npcs || [];
  const map = game.map;
  const dark = darkZones(game); // [] without level.darkness, or with every light on: the plain path
  const authority = game.level?.roles?.authority?.id ?? null; // his cone is a little stronger
  for (let n = 0; n < npcs.length; n++) {
    const npc = npcs[n];
    if (!npc || !npc.active || !npc.vision) continue;
    const v = viewerOf(npc);
    const notice = noticeLevel(game, npc);
    const tint = npc.coneTint || CONE_TINT_DEFAULT;
    const near = dark.length ? nearViewer(game, v) : null;
    drawFan(ctx, map, v, tint, notice, npc.id === authority ? 0.2 : 0.13, t, dark, near);
  }
  if (game.level?.cameras) drawCameraCones(ctx, game, t);
}

const NO_DARK = [];

// One soft fan: viewer v ({ x, y, dir, fov, radius }), tinted, warmed toward red by `notice` (0..1).
// dark: the dark zones (game/darkness.js darkZones), [] for the plain path. With any, the fan shows only on lit
// floor, and in the dark only the near sight `near` (darkness.js nearViewer(v)) shows, within arm's length.
// edge: the outline's alpha while nothing is noticed (people's cones keep a faint 0.18; cameras draw a firm one).
function drawFan(ctx, map, v, tint, notice, base, t, dark = NO_DARK, near = null, edge = 0.18) {
  const ox = fin(v.x);
  const oy = fin(v.y);
  const fov = clamp(fin(v.fov, 1.5), 0.05, Math.PI * 2);
  const radius = Math.max(0.5, fin(v.radius, 6));
  const dir = fin(v.dir);
  const pulse = notice > 0 ? 0.75 + 0.25 * Math.sin(t * (8 + notice * 10)) : 1;
  const mix = notice * (0.6 + 0.4 * pulse);
  const r = Math.round(tint[0] + (RED[0] - tint[0]) * mix);
  const g = Math.round(tint[1] + (RED[1] - tint[1]) * mix);
  const b = Math.round(tint[2] + (RED[2] - tint[2]) * mix);
  const a = clamp(base + notice * 0.28 * pulse, 0, 0.6);
  const cx = ox * T;
  const cy = oy * T;
  const R = radius * T;

  const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, R);
  grad.addColorStop(0, `rgba(${r},${g},${b},${a.toFixed(3)})`);
  grad.addColorStop(0.65, `rgba(${r},${g},${b},${(a * 0.65).toFixed(3)})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

  if (dark.length) {
    ctx.save();
    clipTo(ctx, dark, map, true);
  }
  fan(ctx, map, ox, oy, dir, fov, radius);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = `rgba(${r},${g},${b},${clamp(edge + notice * 0.4 * pulse, 0, 1).toFixed(3)})`;
  ctx.lineWidth = notice > 0 ? 1.5 : 1;
  ctx.stroke();
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
// leaves a faint grey fan with a dashed outline: the lens still turns, but nobody is looking. A camera's outline is
// always firm, so where it points reads in every frame, not only the one where it has you. Camera fans take the
// plain path even in a dark room: a camera's sight ignores level.darkness (game/perception.js), so its fan does too.
const CAMERA_GREY = [150, 150, 160];
function drawCameraCones(ctx, game, t) {
  const p = game.player;
  for (const cam of game.level.cameras) {
    const feed = cameraFeed(game, cam.id);
    const v = feed; // { x, y, dir, fov, radius }: the camera as a viewer
    if (!feed.live) {
      ctx.save();
      ctx.setLineDash([2, 3]);
      drawFan(ctx, game.map, v, CAMERA_GREY, 0, 0.06, t, NO_DARK, null, 0.45);
      ctx.restore();
      continue;
    }
    const watcher = feed.watcher ? findNpc(game, feed.watcher) : null;
    const tint = watcher ? watcher.coneTint || CONE_TINT_DEFAULT : CAMERA_GREY;
    const onScreen = watcher && p && canSee(game.map, v, p.x, p.y);
    const notice = onScreen ? Math.max(0.35, noticeLevel(game, watcher)) : 0;
    drawFan(ctx, game.map, v, tint, notice, watcher ? 0.22 : 0.08, t, NO_DARK, null, watcher ? 0.6 : 0.4);
  }
}
