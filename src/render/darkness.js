// The dark (level.darkness: src/game/darkness.js), drawn over the people and under the bubbles: a navy
// veil on every dark room, cut open where a torch beam falls, and eyes for whoever stands in the dark (you also get
// a red outline, so you can find yourself). Lit rooms and levels without darkness draw nothing here.
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

export function drawDarkness(ctx, game, t) {
  const map = game.map;
  const zones = map ? darkZones(game) : [];
  if (!zones.length) return;
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
