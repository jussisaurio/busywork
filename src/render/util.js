// Small drawing helpers shared by the render modules. Pure functions, no DOM access.
import { TILE, DAY_START } from '../config.js';
import { C } from './palette.js';

export const T = TILE;
export const HUD_H = 56; // HUD band on top of the map (logical px)
// The play area: a fixed 30 x 17-tile view under the HUD (HUD and screen layouts are pixel positions in it).
// The map itself is drawn at game.map's size (map.w * T, map.h * T) from the view's top-left corner.
export const PLAY_W = 30 * TILE; // 960
export const PLAY_H = 17 * TILE; // 544
export const VIEW_W = PLAY_W;
export const VIEW_H = PLAY_H + HUD_H; // 600

export const EMOJI_FAMILY = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';
export const UI_FAMILY = '"Avenir Next","Trebuchet MS","Helvetica Neue",Arial,sans-serif';
export const MONO_FAMILY = 'ui-monospace,"SF Mono",Menlo,Consolas,monospace';
export const TYPE_FAMILY = '"Courier New",Courier,monospace';
export const TITLE_FAMILY = '"Arial Black","Helvetica Neue",Impact,sans-serif';

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

// Sweat drop centred on (x, y): tip `up` px above, belly `half` px wide each side, bottom `down` px below.
export function drawDrop(ctx, x, y, up, half, down) {
  ctx.fillStyle = '#8fd0ff';
  ctx.beginPath();
  ctx.moveTo(x, y - up);
  ctx.quadraticCurveTo(x + half, y, x, y + down);
  ctx.quadraticCurveTo(x - half, y, x, y - up);
  ctx.fill();
}

// A w x h sheet of paper centred on the origin (the caller translates and rotates) with `lines`
// rule lines, the third one short.
export function drawPaper(ctx, w, h, lines) {
  ctx.fillStyle = C.white;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  for (let i = 0; i < lines; i++) ctx.fillRect(-w / 2 + 1, -h / 2 + 2 + i * 2, i === 2 ? w - 3.5 : w - 2, 0.7);
}

// Analog clock hands at (cx, cy) for a game minute of a day starting at `start` (level.day.start): hour hand in
// ink, minute hand in mColor.
export function clockHands(ctx, cx, cy, minute, hLen, hW, mLen, mW, mColor, start = DAY_START) {
  const total = start + fin(minute);
  const mA = ((total % 60) / 60) * Math.PI * 2 - Math.PI / 2;
  const hA = (((total / 60) % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = hW;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(hA) * hLen, cy + Math.sin(hA) * hLen);
  ctx.stroke();
  ctx.strokeStyle = mColor;
  ctx.lineWidth = mW;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(mA) * mLen, cy + Math.sin(mA) * mLen);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

// Projection screen; (x, y, w, h) is the slide. Parts in o, drawn in this order (all optional but face):
//   shadow: colour, offset 2 px down-right
//   glow: [colour, side, top, bottom] margins around the slide; under the bar unless glowOverBar
//   bar: [lip, rise, height, radius] roller bar, lip px wider each side, top `rise` px above the slide
//   face: slide colour
//   scan: [colour, top, gap, t] six rolling 2 px lines
//   hem: colour of a 2 px strip 1 px above the bottom edge
//   edge: colour of a 1 px outline
export function drawScreen(ctx, x, y, w, h, o) {
  if (o.shadow) {
    ctx.fillStyle = o.shadow;
    ctx.fillRect(x + 2, y + 2, w, h);
  }
  if (o.glow && !o.glowOverBar) screenGlow(ctx, x, y, w, h, o.glow);
  if (o.bar) {
    const [lip, rise, bh, r] = o.bar;
    ctx.fillStyle = '#4a4440';
    if (r) {
      rrect(ctx, x - lip, y - rise, w + lip * 2, bh, r);
      ctx.fill();
    } else ctx.fillRect(x - lip, y - rise, w + lip * 2, bh);
  }
  if (o.glow && o.glowOverBar) screenGlow(ctx, x, y, w, h, o.glow);
  ctx.fillStyle = o.face;
  ctx.fillRect(x, y, w, h);
  if (o.scan) {
    const [col, top, gap, t] = o.scan;
    ctx.fillStyle = col;
    for (let i = 0; i < 6; i++) ctx.fillRect(x, y + top + i * gap + ((t * 30) % gap), w, 2);
  }
  if (o.hem) {
    ctx.fillStyle = o.hem;
    ctx.fillRect(x, y + h - 3, w, 2);
  }
  if (o.edge) {
    ctx.strokeStyle = o.edge;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
}

function screenGlow(ctx, x, y, w, h, [col, side, top, bottom]) {
  ctx.fillStyle = col;
  ctx.fillRect(x - side, y - top, w + side * 2, h + top + bottom);
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
