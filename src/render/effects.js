// game.fx drawing (bubbles, particles, ripples, sightlines) plus small in-world overlays: interaction hint,
// action progress ring, boss suspicion meter, the "loop N" stamp and the end-beat vignette.
import {
  T, PLAY_W, PLAY_H, clamp, fin, hash, easeOutBack, emoji, strictGlyphs, glyphScope, rrect, circle, ellipse, fillCircle,
  starPath, loopIcon, drawDrop, drawPaper, keycap, text, font, MONO_FAMILY,
} from './util.js';
import { C } from './palette.js';
import { headY, lookFor } from './characters.js';
import { findNpc } from '../game/perception.js';

// --- bubbles -------------------------------------------------------------------
const ANCHOR = { x: 0, y: 0 };

function anchorOf(game, owner) {
  if (typeof owner === 'string') {
    const p = game.player;
    if (p && (owner === 'player' || owner === p.id)) {
      ANCHOR.x = fin(p.x) * T;
      ANCHOR.y = headY(game.level.looks, p, 'bubbleDy');
      return true;
    }
    const n = game.npcs && findNpc(game, owner);
    if (!n || !n.active) return false;
    ANCHOR.x = fin(n.x) * T;
    ANCHOR.y = headY(game.level.looks, n, 'bubbleDy');
    return true;
  }
  if (owner && typeof owner === 'object' && Number.isFinite(owner.x) && Number.isFinite(owner.y)) {
    ANCHOR.x = owner.x * T;
    ANCHOR.y = owner.y * T - 6;
    return true;
  }
  return false;
}

export function drawBubbles(ctx, game) {
  const list = game.fx && game.fx.bubbles;
  if (!list || !list.length) return;
  const strict = strictGlyphs();
  for (let i = 0; i < list.length; i++) {
    const b = list[i];
    if (!b || !anchorOf(game, b.owner)) continue;
    const place = strict && b.kind === 'sign' && typeof b.owner === 'object' ? signPlace(game, b, ANCHOR.x, ANCHOR.y) : null;
    drawBubble(ctx, b, ANCHOR.x, ANCHOR.y, place);
  }
}

// Where a sign over a point (an inspection's tick or cross, sim/mechanics/inspection.js) stands so it covers
// nobody: above the point, else below it, else to its right or left; its post leans to the point. (A migrated
// level only; the legacy ones keep it above.) Returns the board's centre, or null for the default.
const SIGN_AT = { x: 0, y: 0 };
function signPlace(game, b, ax, ay) {
  const icons = Array.isArray(b.icons) ? b.icons : [];
  const n = Math.max(1, icons.length);
  const w = n * 15 + (n - 1) * 3 + 12 + 4;
  const h = 25 + 4;
  const tries = [[0, -14 - h / 2], [0, 22 + h / 2], [w / 2 + 18, -h / 2], [-w / 2 - 18, -h / 2]];
  const people = [];
  const add = (e) => {
    if (!e || !Number.isFinite(e.x) || !Number.isFinite(e.y)) return;
    const top = headY(game.level.looks, e, 'bubbleDy') - 6;
    people.push([e.x * T - 13, top, e.x * T + 13, e.y * T + 9]);
  };
  for (const e of game.npcs || []) if (e && e.active) add(e);
  add(game.player);
  for (let i = 0; i < tries.length; i++) {
    const x = clamp(ax + tries[i][0], w / 2 + 4, PLAY_W - w / 2 - 4);
    const y = clamp(ay + tries[i][1], h / 2 + 4, PLAY_H - h / 2 - 4);
    const hit = people.some((r) => x + w / 2 > r[0] && x - w / 2 < r[2] && y + h / 2 > r[1] && y - h / 2 < r[3]);
    if (!hit) {
      if (i === 0) return null;
      SIGN_AT.x = x;
      SIGN_AT.y = y;
      return SIGN_AT;
    }
  }
  return null;
}

// place: { x, y } the bubble's centre instead of above the anchor (a sign moved aside: signPlace).
export function drawBubble(ctx, b, ax, ay, place = null) {
  const icons = Array.isArray(b.icons) ? b.icons : b.icons != null ? [String(b.icons)] : [];
  const age = Math.max(0, fin(b.age));
  const ttl = fin(b.ttl, 2.5);
  const pop = easeOutBack(age / 0.18);
  const alpha = clamp((ttl - age) / 0.3, 0, 1);
  if (alpha <= 0 || pop <= 0.01) return;
  const kind = b.kind || 'speech';
  const isz = kind === 'alert' ? 24 : 15;
  const gap = 3;
  const n = Math.max(1, icons.length);
  const cw = n * isz + (n - 1) * gap;
  const pad = kind === 'thought' ? 9 : 6;
  const w = cw + pad * 2;
  const h = isz + (kind === 'thought' ? 12 : 10);
  const lift = kind === 'sign' ? 14 : kind === 'thought' ? 12 : 8;
  // bubble centre, clamped inside the play area
  const bx = clamp(place ? place.x : ax, w / 2 + 4, PLAY_W - w / 2 - 4);
  const by = clamp(place ? place.y : ay - lift - h / 2, h / 2 + 4, PLAY_H - h / 2 - 4);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(bx, by + h / 2);
  ctx.scale(pop, pop);
  ctx.translate(0, -h / 2);
  const tailX = clamp(ax - bx, -w / 2 + 8, w / 2 - 8);
  const tailY = ay - by; // anchor relative to bubble centre

  if (kind === 'alert') {
    const wob = Math.sin(age * 30) * 0.35 * Math.exp(-age * 4);
    ctx.rotate(wob);
    ctx.fillStyle = '#fff6c9';
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 2;
    starPath(ctx, 0, 0, Math.max(w, h) * 0.62 + 4, Math.max(w, h) * 0.42, 10, age * 0.5);
    ctx.fill();
    ctx.stroke();
  } else if (kind === 'thought') {
    ctx.strokeStyle = C.ink;
    ctx.fillStyle = C.white;
    cloudPath(ctx, w, h);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fill();
    ctx.fillRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8);
    // trailing dots toward the thinker
    const dx = tailX * 0.6;
    for (let k = 0; k < 2; k++) {
      const f = 0.45 + k * 0.3;
      const px = dx * (1 - f * 0.5);
      const py = h / 2 + (tailY - h / 2) * f;
      ctx.lineWidth = 1.5;
      circle(ctx, px, py, 3 - k * 1.2);
      ctx.fill();
      ctx.stroke();
    }
  } else if (kind === 'sign') {
    if (place) { // the post leans from the board to the point it judges
      ctx.strokeStyle = C.walnutEdge;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(ax - bx, ay - by);
      ctx.stroke();
      fillCircle(ctx, ax - bx, ay - by, 2.2, C.walnutEdge);
    } else {
      ctx.fillStyle = C.walnutEdge;
      ctx.fillRect(-1.5, h / 2 - 2, 3, Math.max(0, tailY - h / 2 + 4));
    }
    ctx.fillStyle = C.ochre;
    rrect(ctx, -w / 2 - 2, -h / 2 - 2, w + 4, h + 4, 4);
    ctx.fill();
    ctx.fillStyle = C.cream;
    rrect(ctx, -w / 2 + 1, -h / 2 + 1, w - 2, h - 2, 2.5);
    ctx.fill();
  } else {
    ctx.fillStyle = C.white;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.6;
    rrect(ctx, -w / 2, -h / 2, w, h, 7);
    ctx.fill();
    ctx.stroke();
    const tb = h / 2 - 0.5;
    const ty = Math.max(tb + 4, Math.min(tb + 9, tailY));
    ctx.beginPath();
    ctx.moveTo(tailX - 5, tb - 2);
    ctx.lineTo(tailX + 4, tb - 2);
    ctx.lineTo(tailX - 1, ty);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(tailX - 5, tb + 0.5);
    ctx.lineTo(tailX - 1, ty);
    ctx.lineTo(tailX + 4, tb + 0.5);
    ctx.stroke();
  }
  let x = -cw / 2 + isz / 2;
  const was = glyphScope('speech'); // any emoji may be said (DESIGN.md "Visual language" rule 1)
  for (let i = 0; i < icons.length; i++) {
    const ic = icons[i] == null ? '' : String(icons[i]);
    const hop = kind === 'speech' && age < 0.6 ? Math.sin(clamp((age - i * 0.06) / 0.25, 0, 1) * Math.PI) * -2 : 0;
    emoji(ctx, ic, x, 1 + hop, isz);
    x += isz + gap;
  }
  glyphScope(was);
  ctx.restore();
}

function cloudPath(ctx, w, h) {
  ctx.beginPath();
  const n = Math.max(2, Math.ceil(w / 13));
  const x0 = -w / 2 + 6;
  const x1 = w / 2 - 6;
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 0 : x0 + ((x1 - x0) * i) / (n - 1);
    const rt = 7.5 + (i % 2) * 1.5;
    ctx.moveTo(x + rt, -h / 2 + 3);
    ctx.arc(x, -h / 2 + 3, rt, 0, Math.PI * 2);
    const rb = 6.5 + ((i + 1) % 2) * 1.5;
    ctx.moveTo(x + rb, h / 2 - 3);
    ctx.arc(x, h / 2 - 3, rb, 0, Math.PI * 2);
  }
  const re = h / 2;
  ctx.moveTo(-w / 2 + 2 + re, 0);
  ctx.arc(-w / 2 + 2, 0, re, 0, Math.PI * 2);
  ctx.moveTo(w / 2 - 2 + re, 0);
  ctx.arc(w / 2 - 2, 0, re, 0, Math.PI * 2);
}

// --- particles -----------------------------------------------------------------
export const CONFETTI = [C.tomato, C.ochre, C.teal, '#7fb3c8', '#f2ead3', C.olive];

export function drawParticles(ctx, game, t) {
  const list = game.fx && game.fx.particles;
  if (!list || !list.length) return;
  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    if (!p) continue;
    const x = fin(p.x, NaN) * T;
    const y = fin(p.y, NaN) * T;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const ttl = Math.max(0.01, fin(p.ttl, 1));
    const age = Math.max(0, fin(p.age));
    const k = clamp(age / ttl, 0, 1);
    const seed = hash(Math.floor(ttl * 100003)); // ttl is random per particle; an index would shift as others die
    const vx = fin(p.vx);
    const vy = fin(p.vy);
    ctx.globalAlpha = 1;
    switch (p.kind) {
      case 'puff': {
        ctx.globalAlpha = 0.5 * (1 - k);
        fillCircle(ctx, x + Math.sin(age * 3 + seed * 6) * 2, y - k * 12, 3 + k * 9, seed < 0.5 ? '#8a8580' : '#a29d97');
        break;
      }
      case 'sparks': {
        ctx.globalAlpha = 1 - k;
        ctx.strokeStyle = seed < 0.5 ? '#ffd34d' : '#fff3b0';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - vx * T * 0.05, y - vy * T * 0.05);
        ctx.stroke();
        break;
      }
      case 'crumbs': {
        ctx.globalAlpha = 1 - k * 0.5;
        ctx.fillStyle = seed < 0.5 ? '#c99a5b' : '#e3c08a';
        ctx.fillRect(x - 1.2, y - 1.2 + k * k * 8, 2.4, 2.4);
        break;
      }
      case 'paper': {
        ctx.globalAlpha = 1 - k * k;
        ctx.save();
        ctx.translate(x, y + k * 6);
        ctx.rotate(age * 5 * (seed < 0.5 ? -1 : 1) + seed * 6);
        drawPaper(ctx, 7, 9, 3);
        ctx.restore();
        break;
      }
      case 'zzz': {
        ctx.globalAlpha = 1 - k;
        const was = glyphScope('speech'); // a sleeper's Zs are a sound, not a thing
        emoji(ctx, '💤', x + Math.sin(age * 4 + seed * 6) * 3, y - k * 14, 8 + k * 8);
        glyphScope(was);
        break;
      }
      case 'sweat': {
        ctx.globalAlpha = 1 - k;
        drawDrop(ctx, x, y + k * 5, 3, 2.2, 1.5);
        break;
      }
      case 'confetti': {
        ctx.globalAlpha = 1 - k * k;
        ctx.save();
        ctx.translate(x + Math.sin(age * 6 + seed * 9) * 3, y + k * 14);
        ctx.rotate(seed * 6 + age * 4);
        ctx.fillStyle = CONFETTI[Math.floor(seed * CONFETTI.length) % CONFETTI.length];
        const fw = 5 * Math.abs(Math.cos(age * 10 + seed * 7)) + 0.6;
        ctx.fillRect(-fw / 2, -1.5, fw, 3);
        ctx.restore();
        break;
      }
      default: {
        ctx.globalAlpha = 1 - k;
        fillCircle(ctx, x, y, 2, C.cream);
      }
    }
  }
  ctx.globalAlpha = 1;
}

// --- ripples -------------------------------------------------------------------
// game.fx.ripples: [{ x, y, radius, color, age, ttl }] (core/fx.js ripple). The noise starts at its source: a flash
// there, then short bold rings pulse out of it for as long as it sounds. Three earshot rings, a beat apart, leave
// the source on the first frame and spread to its earshot, fading as they go: who is inside the last ring heard it.
const RIPPLE_RINGS = 3;
const RIPPLE_GAP = 0.12; // s between earshot rings
const SOURCE_SPAN = 0.42; // s a source ring lives
const SOURCE_GAP = 0.16; // s between source rings
const SOURCE_R = 1.3 * T; // px a source ring reaches
function ring(ctx, x, y, r, a, w, color) {
  ctx.globalAlpha = a * 0.4;
  ctx.strokeStyle = 'rgb(30,20,14)'; // a dark under-stroke: it reads on carpet and on tile
  ctx.lineWidth = w + 2;
  circle(ctx, x, y, r);
  ctx.stroke();
  ctx.globalAlpha = a;
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.stroke();
}
export function drawRipples(ctx, game) {
  const list = game.fx && game.fx.ripples;
  if (!Array.isArray(list) || !list.length) return;
  ctx.save();
  for (let i = 0; i < list.length; i++) {
    const r = list[i];
    const x = fin(r && r.x, NaN) * T;
    const y = fin(r && r.y, NaN) * T;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const R = Math.max(0.5, fin(r.radius, 3)) * T;
    const ttl = Math.max(0.1, fin(r.ttl, 1));
    const age = Math.max(0, fin(r.age));
    const color = typeof r.color === 'string' ? r.color : C.cream;
    if (age < 0.15) { // the flash at the source
      ctx.globalAlpha = 0.85 * (1 - age / 0.15);
      fillCircle(ctx, x, y, 6 + 40 * age, color);
    }
    for (let k = 0; k * SOURCE_GAP <= ttl - SOURCE_SPAN; k++) {
      const q = (age - k * SOURCE_GAP) / SOURCE_SPAN;
      if (q < 0) break;
      if (q >= 1) continue;
      ring(ctx, x, y, 5 + q * (SOURCE_R - 5), 0.95 * (1 - q), 1 + 3 * (1 - q), color);
    }
    const span = Math.max(0.1, ttl - RIPPLE_GAP * (RIPPLE_RINGS - 1));
    for (let k = 0; k < RIPPLE_RINGS; k++) {
      const q = (age - k * RIPPLE_GAP) / span;
      if (q < 0 || q >= 1) continue;
      const e = 1 - (1 - q) * (1 - q); // fast out, slow at the edge
      ring(ctx, x, y, 6 + e * (R - 6), 0.7 * (1 - q), 1 + 2 * (1 - q), color);
    }
  }
  ctx.restore();
}

// --- sightlines -----------------------------------------------------------------
// game.fx.lines: [{ from: npcId, to: 'player', kind, age, ttl, via? }]. A dashed line from the
// watcher's eyes to your body, using live positions so it follows both of you. It draws on fast,
// then fades. 'notice' is a faint cream glance; 'tattle'/'caught' are thick tomato with a mark on you.
const LINE_STYLE = {
  notice: { w: 1.4, dash: [5, 4], color: '243,214,150', alpha: 0.6, mark: false },
  tattle: { w: 2.6, dash: [7, 4], color: '229,67,47', alpha: 0.9, mark: true },
  caught: { w: 3, dash: [8, 3], color: '229,67,47', alpha: 1, mark: true },
};
const DRAW_ON = 0.1; // seconds for the dash to reach you

export function drawSightlines(ctx, game, t) {
  const lines = game.fx && game.fx.lines;
  const p = game.player;
  if (!Array.isArray(lines) || !lines.length || !p) return;
  const px = fin(p.x, NaN) * T;
  const py = fin(p.y, NaN) * T - (p.seated ? 1 : 4); // chest, not feet
  if (!Number.isFinite(px) || !Number.isFinite(py)) return;
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l) continue;
    const n = game.npcs && findNpc(game, l.from);
    if (!n || !n.active) continue;
    const st = LINE_STYLE[l.kind] || LINE_STYLE.notice;
    const ttl = fin(l.ttl, 0.8) > 0 ? fin(l.ttl, 0.8) : 0.8;
    const age = clamp(fin(l.age), 0, ttl);
    const fade = 1 - age / ttl;
    if (!(fade > 0.01)) continue;
    // eyes: head centre, nudged toward you so the line leaves the face, not the hair
    let ex = fin(n.x, NaN) * T;
    let ey = headY(game.level.looks, n, 'eyeDy', NaN);
    if (!Number.isFinite(ex) || !Number.isFinite(ey)) continue;
    if (l.via) {
      drawScreenChain(ctx, l.via, ex, ey, px, py, st, age, fade, t);
      continue;
    }
    const dx = px - ex;
    const dy = py - ey;
    const len = Math.hypot(dx, dy);
    if (len < 6) continue;
    ex += (dx / len) * 4;
    ey += (dy / len) * 4;
    const k = clamp(age / DRAW_ON, 0, 1);
    const tx = ex + (px - ex) * k;
    const ty = ey + (py - ey) * k;
    const a = clamp(st.alpha * fade, 0, 1);
    // soft dark under-stroke so the dashes read on both carpet and tile
    ctx.setLineDash(st.dash);
    ctx.lineDashOffset = -t * 30;
    ctx.strokeStyle = `rgba(30,20,14,${(a * 0.35).toFixed(3)})`;
    ctx.lineWidth = st.w + 2;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.strokeStyle = `rgba(${st.color},${a.toFixed(3)})`;
    ctx.lineWidth = st.w;
    ctx.stroke();
    ctx.setLineDash([]);
    if (st.mark && k >= 1) drawLineMark(ctx, px, py, age, a, st.color);
  }
  ctx.setLineDash([]);
  ctx.restore();
}

// Seen on a camera's screen (fx.js sightline `via`): two dashed legs, his eyes to the screen, then the lens to you.
// The second leg draws on after the first.
function drawScreenChain(ctx, via, ex, ey, px, py, st, age, fade, t) {
  const a = clamp(st.alpha * fade, 0, 1);
  const sx = fin(via.screen.x) * T;
  const sy = fin(via.screen.y) * T - 6;
  const lx = fin(via.lens.x) * T;
  const ly = fin(via.lens.y) * T;
  const legs = [[ex, ey, sx, sy, clamp(age / DRAW_ON, 0, 1)], [lx, ly, px, py, clamp((age - DRAW_ON) / DRAW_ON, 0, 1)]];
  for (const [x0, y0, x1, y1, k] of legs) {
    if (!(k > 0)) continue;
    const tx = x0 + (x1 - x0) * k;
    const ty = y0 + (y1 - y0) * k;
    ctx.setLineDash(st.dash);
    ctx.lineDashOffset = -t * 30;
    ctx.strokeStyle = `rgba(30,20,14,${(a * 0.35).toFixed(3)})`;
    ctx.lineWidth = st.w + 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.strokeStyle = `rgba(${st.color},${a.toFixed(3)})`;
    ctx.lineWidth = st.w;
    ctx.stroke();
  }
  ctx.setLineDash([]);
  if (st.mark && age >= 2 * DRAW_ON) drawLineMark(ctx, px, py, age - DRAW_ON, a, st.color);
}

// The hit mark on you: a ring that snaps in, then a small cross.
function drawLineMark(ctx, x, y, age, a, color) {
  const pop = clamp((age - DRAW_ON) / 0.12, 0, 1);
  const r = 4 + 4 * easeOutBack(pop);
  ctx.strokeStyle = `rgba(${color},${a.toFixed(3)})`;
  ctx.lineWidth = 2;
  circle(ctx, x, y, r);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 2.5, y - 2.5);
  ctx.lineTo(x + 2.5, y + 2.5);
  ctx.moveTo(x + 2.5, y - 2.5);
  ctx.lineTo(x - 2.5, y + 2.5);
  ctx.stroke();
}

// --- overlays --------------------------------------------------------------------
// What E would do now (player.focus, play/interactions.js). A migrated level lights the target up (drawLitTarget);
// a legacy one (src/levels/legacy.js) floats the row's icon over it.
export function drawFocusHint(ctx, game, t) {
  const p = game.player;
  if (!p || !p.focus || p.action || p.locked || game.phase !== 'day') return;
  const f = p.focus;
  if (!Number.isFinite(f.x) || !Number.isFinite(f.y)) return;
  if (strictGlyphs()) {
    drawLitTarget(ctx, f, p, t);
    return;
  }
  const self = f.kind === 'self';
  const x = f.x * T;
  const y = f.y * T - (self ? 44 : 24) + Math.sin(t * 5) * 2.5;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  circle(ctx, x + 1, y + 2, 11);
  ctx.fill();
  ctx.fillStyle = C.white;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 9);
  ctx.lineTo(x, y + 14);
  ctx.lineTo(x + 4, y + 9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  circle(ctx, x, y, 11);
  ctx.fill();
  ctx.stroke();
  emoji(ctx, f.icon || '✋', x, y + 1, 14);
}

// DESIGN.md "Visual language" rule 4: the object itself lights up, with the E key cap over it, and no icon (an icon
// over a tile reads as the object). The glow traces the target: the interactable's tile, the item or the free spot
// on a desk; an action on yourself (eating what you hold) shows the key cap over your head alone. The key cap sits
// on the target's far side from you, so your body never hides it.
function drawLitTarget(ctx, f, p, t) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 5);
  const x = f.x * T;
  const y = f.y * T;
  const self = f.kind === 'self';
  if (!self) {
    ctx.save();
    const shape = () => {
      if (f.kind === 'interactable') rrect(ctx, x - T / 2 - 1.5, y - T / 2 - 1.5, T + 3, T + 3, 6);
      else ellipse(ctx, x, y + 1, 12 + pulse, 9 + pulse * 0.6);
    };
    ctx.fillStyle = `rgba(255,226,122,${(0.1 + 0.12 * pulse).toFixed(3)})`;
    shape();
    ctx.fill();
    ctx.strokeStyle = 'rgba(30,20,14,0.35)';
    ctx.lineWidth = 4.5;
    shape();
    ctx.stroke();
    ctx.strokeStyle = `rgba(255,214,90,${(0.65 + 0.35 * pulse).toFixed(3)})`;
    ctx.lineWidth = 2.2;
    shape();
    ctx.stroke();
    ctx.restore();
  }
  const bob = Math.sin(t * 5) * 2;
  if (self) {
    keycap(ctx, x - 9, y - 50 + bob, 18, 15, 'E', 11);
    return;
  }
  const r = f.kind === 'interactable' ? T / 2 + 3 : 14; // the glow's half size
  const dx = f.x - fin(p.x, f.x);
  const dy = f.y - fin(p.y, f.y);
  if (Math.abs(dy) >= Math.abs(dx)) keycap(ctx, x - 9, (dy > 0 ? y + r + 1 : y - r - 16) + bob, 18, 15, 'E', 11);
  else keycap(ctx, (dx > 0 ? x + r + 1 : x - r - 19) + bob, y - 7.5, 18, 15, 'E', 11);
}

export function drawActionRing(ctx, game, t) {
  const p = game.player;
  const a = p && p.action;
  if (!a) return;
  const k = clamp(fin(a.t) / Math.max(0.001, fin(a.duration, 1)), 0, 1);
  const x = fin(p.x) * T;
  const y = fin(p.y) * T - 6;
  const r = 17;
  ctx.lineWidth = 4.5;
  ctx.strokeStyle = 'rgba(24,19,15,0.45)';
  circle(ctx, x, y, r);
  ctx.stroke();
  // Same look for every action: colouring "sneaky" ones would explain a rule (no hand-holding).
  ctx.strokeStyle = C.ochre;
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
  ctx.stroke();
  ctx.lineCap = 'butt';
  if (p.focus && p.focus.icon && !strictGlyphs()) { // legacy: drop with the legacy list
    fillCircle(ctx, x + r * 0.75, y - r * 0.75, 7.5, C.white);
    emoji(ctx, p.focus.icon, x + r * 0.75, y - r * 0.75 + 0.5, 10);
  }
}

// The authority's ❓ meter over his head (game.suspicion, keyed by level.roles.authority.id).
export function drawSuspicion(ctx, game, t) {
  const id = game.level?.roles?.authority?.id;
  const s = game.suspicion && id ? fin(game.suspicion[id]) : 0;
  if (!(s > 0)) return;
  const boss = game.npcs && findNpc(game, id);
  if (!boss || !boss.active) return;
  const lvl = clamp(s, 0, 1);
  const jit = lvl > 0.75 ? Math.sin(t * 47) * 1.2 : 0;
  const x = fin(boss.x) * T + 17 + jit;
  const y = fin(boss.y) * T - lookFor(game.level.looks, boss.id, boss.color).bubbleDy - 10;
  const h = 20;
  ctx.fillStyle = 'rgba(24,19,15,0.8)';
  rrect(ctx, x - 1.5, y - 1.5, 8, h + 3, 3);
  ctx.fill();
  const r = Math.round(214 + 41 * lvl);
  const g = Math.round(162 - 110 * lvl);
  ctx.fillStyle = `rgb(${r},${g},47)`;
  rrect(ctx, x, y + h * (1 - lvl), 5, h * lvl, 2);
  ctx.fill();
  const sz = 13 + lvl * 5 + (lvl > 0.75 ? Math.abs(Math.sin(t * 10)) * 2 : 0);
  const was = glyphScope('speech'); // his reaction, not a thing
  emoji(ctx, lvl > 0.75 ? '❗' : '❓', x + 3 + jit * 0.5, y - 9, sz);
  glyphScope(was);
}

export function drawLoopStamp(ctx, game, cx, cy) {
  const lt = fin(game.loopTime, 99);
  if (game.phase !== 'day' || lt >= 1.2 || lt < 0) return;
  const loop = Math.max(1, (game.persist && game.persist.loop) | 0);
  const slam = clamp(lt / 0.16, 0, 1);
  const sc = 2.4 - 1.4 * slam;
  const alpha = clamp((1.2 - lt) / 0.3, 0, 1) * clamp(lt / 0.06, 0, 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(-0.12);
  ctx.scale(sc, sc);
  const w = 176;
  const h = 76;
  ctx.fillStyle = 'rgba(251,248,240,0.82)';
  rrect(ctx, -w / 2, -h / 2, w, h, 10);
  ctx.fill();
  ctx.strokeStyle = C.tomato;
  ctx.lineWidth = 5;
  rrect(ctx, -w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 8);
  ctx.stroke();
  loopIcon(ctx, -36, 0, 18, C.tomato, 5);
  text(ctx, String(loop), 22, 3, font(46, MONO_FAMILY, 'bold'), C.tomato);
  // ink speckle
  ctx.fillStyle = 'rgba(251,248,240,0.6)';
  for (let i = 0; i < 9; i++) ctx.fillRect(-w / 2 + hash(i, loop) * w, -h / 2 + hash(loop, i) * h, 3, 2);
  ctx.restore();
}

// Vignette over the map area during the busted/meeting beat.
export function drawVignette(ctx, k, x0, y0, w, h) {
  if (k <= 0) return;
  const cx = x0 + w / 2;
  const cy = y0 + h / 2;
  const g = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.28, cx, cy, Math.max(w, h) * 0.72);
  g.addColorStop(0, 'rgba(20,10,6,0)');
  g.addColorStop(1, `rgba(20,10,6,${(0.75 * k).toFixed(3)})`);
  ctx.fillStyle = g;
  ctx.fillRect(x0, y0, w, h);
}
