// Vision cones: a soft translucent fan per active NPC, clipped by opaque tiles with a
// DDA ray cast. Cones flash warmer/redder while that NPC is "noticing" the player.
import { T, clamp, fin } from './util.js';
import { CONE_TINT_DEFAULT } from './palette.js';
import { viewerOf, npcSees } from '../game/perception.js';

const RAYS = 56;
const MAX_STEPS = 64;
const RED = [255, 64, 44];

// Distance (tiles) from (ox, oy) along unit (dx, dy) to the first opaque tile, capped at maxDist.
function castRay(map, ox, oy, dx, dy, maxDist) {
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

// 0..1: how hard this NPC is "noticing" the player right now (derived, read-only).
function noticeLevel(game, npc) {
  let lvl = 0;
  if (game.caught && game.caught.by === npc.id) return 1;
  if (npc.id === 'boss') {
    const s = game.suspicion ? fin(game.suspicion.boss) : 0;
    if (s > 0) lvl = 0.35 + 0.65 * clamp(s, 0, 1);
  }
  if (npc.override === 'alerted' || npc.override === 'hunting') lvl = Math.max(lvl, 0.55);
  const p = game.player;
  if (p && game.phase === 'day') {
    const risky = (p.action && p.action.sneaky) || (npc.id === 'lin' && p.held === 'sandwich');
    if (risky && game.map && npcSees(game, npc, p.x, p.y)) lvl = Math.max(lvl, 0.8);
  }
  return lvl;
}

export function drawCones(ctx, game, t) {
  if (!game.settings || !game.settings.showCones || !game.map) return;
  const npcs = game.npcs || [];
  const map = game.map;
  for (let n = 0; n < npcs.length; n++) {
    const npc = npcs[n];
    if (!npc || !npc.active || !npc.vision) continue;
    const v = viewerOf(npc);
    const ox = fin(v.x);
    const oy = fin(v.y);
    const fov = clamp(fin(v.fov, 1.5), 0.05, Math.PI * 2);
    const radius = Math.max(0.5, fin(v.radius, 6));
    const dir = fin(v.dir);
    const notice = noticeLevel(game, npc);
    const tint = npc.coneTint || CONE_TINT_DEFAULT;
    const pulse = notice > 0 ? 0.75 + 0.25 * Math.sin(t * (8 + notice * 10)) : 1;
    const mix = notice * (0.6 + 0.4 * pulse);
    const r = Math.round(tint[0] + (RED[0] - tint[0]) * mix);
    const g = Math.round(tint[1] + (RED[1] - tint[1]) * mix);
    const b = Math.round(tint[2] + (RED[2] - tint[2]) * mix);
    const base = npc.id === 'boss' ? 0.2 : 0.13;
    const a = clamp(base + notice * 0.28 * pulse, 0, 0.6);
    const cx = ox * T;
    const cy = oy * T;
    const R = radius * T;

    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, R);
    grad.addColorStop(0, `rgba(${r},${g},${b},${a.toFixed(3)})`);
    grad.addColorStop(0.65, `rgba(${r},${g},${b},${(a * 0.65).toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

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
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = `rgba(${r},${g},${b},${(0.18 + notice * 0.4 * pulse).toFixed(3)})`;
    ctx.lineWidth = notice > 0 ? 1.5 : 1;
    ctx.stroke();
  }
}
