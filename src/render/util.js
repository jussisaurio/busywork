// Small drawing helpers shared by the render modules. Pure functions, no DOM access.
import { TILE } from '../config.js';
import { MAP } from '../data/level.js';

export const T = TILE;
export const HUD_H = 56; // HUD band on top of the map (logical px)
export const MAP_W = MAP[0].length * TILE; // 960
export const MAP_H = MAP.length * TILE; // 544
export const VIEW_W = MAP_W;
export const VIEW_H = MAP_H + HUD_H; // 600

export const EMOJI_FAMILY = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';
export const UI_FAMILY = '"Avenir Next","Trebuchet MS","Helvetica Neue",Arial,sans-serif';
export const MONO_FAMILY = 'ui-monospace,"SF Mono",Menlo,Consolas,monospace';
export const TYPE_FAMILY = '"Courier New",Courier,monospace';
export const TITLE_FAMILY = '"Arial Black","Helvetica Neue",Impact,sans-serif';

export const ITEM_ICON = { coffee: '☕', keycard: '🪪', sandwich: '🥪' };
export const ROUTE_ICONS = [['projector', '📽️'], ['keycard', '🪪']];

// --- fonts / text -------------------------------------------------------------
const fontCache = new Map();
export function font(size, family = UI_FAMILY, weight = '') {
  const px = Math.max(1, Math.round(size));
  let byFam = fontCache.get(family);
  if (!byFam) fontCache.set(family, (byFam = new Map()));
  const key = weight ? weight + px : px;
  let f = byFam.get(key);
  if (!f) {
    f = `${weight ? weight + ' ' : ''}${px}px ${family}`;
    byFam.set(key, f);
  }
  return f;
}

const widthCache = new Map();
export function textWidth(ctx, fontStr, text) {
  const key = fontStr + '\u0000' + text;
  let w = widthCache.get(key);
  if (w === undefined) {
    ctx.font = fontStr;
    w = ctx.measureText(text).width || 0;
    if (widthCache.size > 4000) widthCache.clear();
    widthCache.set(key, w);
  }
  return w;
}

// Emoji drawn centred on (x, y).
export function emoji(ctx, ch, x, y, size) {
  ctx.font = font(size, EMOJI_FAMILY);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(ch, x, y);
}

export function text(ctx, str, x, y, fontStr, color, align = 'center', baseline = 'middle') {
  ctx.font = fontStr;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
}

// --- math ---------------------------------------------------------------------
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
export function easeOutBack(t) {
  t = clamp(t, 0, 1);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
export const fin = (v, d = 0) => (Number.isFinite(v) ? v : d);

// Deterministic 0..1 hash for procedural texture (stable across frames).
export function hash(a, b = 0, c = 0) {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// --- paths --------------------------------------------------------------------
export function rrect(ctx, x, y, w, h, r) {
  w = Math.max(0, w);
  h = Math.max(0, h);
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
}

export function ellipse(ctx, x, y, rx, ry, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, Math.PI * 2);
}

export function fillCircle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  circle(ctx, x, y, r);
  ctx.fill();
}

export function fillEllipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, rx, ry);
  ctx.fill();
}

// Star / burst polygon (alert bubbles, stamps).
export function starPath(ctx, x, y, rOuter, rInner, points, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? rInner : rOuter;
    const a = rot + (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  }
  ctx.closePath();
}

// Procedural "loop" arrow icon (⟳), so we don't depend on font coverage.
export function loopIcon(ctx, x, y, r, color, lw = 2.5) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y, r, -Math.PI * 0.35, Math.PI * 1.45);
  ctx.stroke();
  // arrowhead at the arc start, pointing clockwise
  const a = -Math.PI * 0.35;
  const hx = x + Math.cos(a) * r;
  const hy = y + Math.sin(a) * r;
  const s = r * 0.62;
  ctx.beginPath();
  ctx.moveTo(hx + s * 0.9, hy - s * 0.15);
  ctx.lineTo(hx - s * 0.35, hy - s * 0.75);
  ctx.lineTo(hx - s * 0.15, hy + s * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.lineCap = 'butt';
}

// Keyboard key cap with a 3D bottom edge. label is drawn as text (or emoji if isEmoji).
// pressed: drawn pushed down and lit (a held key / a toggle that is on).
export function keycap(ctx, x, y, w, h, label, size = 16, isEmoji = false, pressed = false) {
  ctx.fillStyle = '#8f8270';
  rrect(ctx, x, y + 4, w, h, 6);
  ctx.fill();
  if (pressed) y += 3; // pushed down onto its edge
  ctx.fillStyle = pressed ? '#f2cf6b' : '#efe6d2';
  rrect(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  rrect(ctx, x + 3, y + 2, w - 6, 3, 1.5);
  ctx.fill();
  if (isEmoji) emoji(ctx, label, x + w / 2, y + h / 2 + 1, size);
  else text(ctx, label, x + w / 2, y + h / 2 + 1, font(size, MONO_FAMILY, 'bold'), '#2a211b');
}
