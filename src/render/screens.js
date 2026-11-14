// Title and end screens. Both are drawn over the (dimmed) office.
import {
  VIEW_W, VIEW_H, clamp, fin, hash, easeOutBack, easeOutCubic, emoji, text, font, textWidth,
  rrect, circle, fillEllipse, loopIcon, keycap,
  MONO_FAMILY, TYPE_FAMILY, TITLE_FAMILY, UI_FAMILY, ROUTE_ICONS,
} from './util.js';
import { C } from './palette.js';
import { LOOKS, personState, resetState, drawPerson } from './characters.js';
import { drawRouteSlots, clockDigits, drawLegendRow, LEGEND_PLAY } from './hud.js';
import { drawProjector, drawChair, sparkle } from './world.js';
import { drawBubble } from './effects.js';
import { findNpc } from '../game/perception.js';

const P = personState();
function person(t) {
  resetState(P, t);
  P.dir = Math.PI / 2; P.head = P.dir;
  return P;
}

const BUBBLE = { icons: null, kind: 'speech', age: 1, ttl: 1e9 };
function bubble(ctx, icons, x, y, age, kind = 'speech', scale = 1) {
  BUBBLE.icons = icons;
  BUBBLE.kind = kind;
  BUBBLE.age = age;
  if (scale === 1) {
    drawBubble(ctx, BUBBLE, x, y);
    return;
  }
  // drawBubble keeps bubbles inside the map, so scale about a point well inside it
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-VIEW_W / 2, -VIEW_H / 2);
  drawBubble(ctx, BUBBLE, VIEW_W / 2, VIEW_H / 2);
  ctx.restore();
}

// Wide key cap with a procedural ▶ glyph.
function playKey(ctx, cx, cy, w, h, t) {
  const s = 1 + 0.06 * Math.sin(t * 5);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  keycap(ctx, -w / 2, -h / 2, w, h, '', 16);
  ctx.fillStyle = C.tomato;
  ctx.beginPath();
  ctx.moveTo(-7, -10);
  ctx.lineTo(11, 1);
  ctx.lineTo(-7, 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// =============================================================================
// Title
// =============================================================================
const TITLE = 'BUSYWORK';
const MISSION = ['4:00 PM. You promised slides. You made none.', 'Make sure the meeting never happens.'];

export function drawTitle(ctx, game, t, mem) {
  const e = Math.max(0, t - fin(mem.titleStart, t));
  ctx.fillStyle = 'rgba(22,16,12,0.76)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  // mid-century stripes
  ctx.fillStyle = C.mustard;
  ctx.fillRect(0, 0, VIEW_W, 6);
  ctx.fillStyle = C.teal;
  ctx.fillRect(0, 6, VIEW_W, 4);
  ctx.fillStyle = C.tomato;
  ctx.fillRect(0, VIEW_H - 6, VIEW_W, 6);

  // BUSYWORK, letter by letter
  const tf = font(86, TITLE_FAMILY, 'bold');
  const spacing = 4;
  let total = -spacing;
  for (let i = 0; i < TITLE.length; i++) total += textWidth(ctx, tf, TITLE[i]) + spacing;
  let x = VIEW_W / 2 - total / 2;
  for (let i = 0; i < TITLE.length; i++) {
    const ch = TITLE[i];
    const w = textWidth(ctx, tf, ch);
    const d = clamp((e - i * 0.06) / 0.45, 0, 1);
    const drop = (1 - easeOutBack(d)) * -70;
    const bob = Math.sin(t * 2.4 + i * 0.7) * 3;
    ctx.globalAlpha = clamp(d * 3, 0, 1);
    text(ctx, ch, x + w / 2 + 5, 118 + drop + bob + 6, tf, C.tomato);
    text(ctx, ch, x + w / 2, 118 + drop + bob, tf, C.cream);
    x += w + spacing;
  }
  ctx.globalAlpha = 1;
  const ul = clamp((e - 0.5) / 0.4, 0, 1);
  ctx.fillStyle = C.mustard;
  rrect(ctx, VIEW_W / 2 - 190 * ul, 168, 380 * ul, 6, 3);
  ctx.fill();
  ctx.fillStyle = C.teal;
  rrect(ctx, VIEW_W / 2 - 60 * ul, 178, 120 * ul, 4, 2);
  ctx.fill();

  // Mission card (typed out)
  ctx.save();
  ctx.translate(VIEW_W / 2, 230);
  ctx.rotate(-0.012);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  rrect(ctx, -306, -30, 616, 68, 4);
  ctx.fill();
  ctx.fillStyle = C.paper;
  rrect(ctx, -310, -36, 620, 68, 4);
  ctx.fill();
  ctx.fillStyle = 'rgba(214,162,58,0.25)';
  ctx.fillRect(-310, -36, 620, 4);
  let size = 21;
  const base = font(size, TYPE_FAMILY, 'bold');
  const maxW = Math.max(textWidth(ctx, base, MISSION[0]), textWidth(ctx, base, MISSION[1]), 1);
  if (maxW > 580) size = Math.max(10, Math.floor((size * 580) / maxW));
  const mf = font(size, TYPE_FAMILY, 'bold');
  let shown = Math.floor(Math.max(0, e - 0.7) * 48);
  for (let l = 0; l < 2; l++) {
    const line = MISSION[l];
    const lw = textWidth(ctx, mf, line);
    const part = line.slice(0, clamp(shown, 0, line.length));
    const ly = -18 + l * 28;
    text(ctx, part, -lw / 2, ly, mf, C.ink, 'left');
    if (shown >= 0 && shown <= line.length && Math.floor(t * 2.5) % 2 === 0) {
      const pw = textWidth(ctx, mf, part);
      ctx.fillStyle = C.tomato;
      ctx.fillRect(-lw / 2 + pw + 1, ly - size * 0.45, size * 0.5, size * 0.9);
    }
    shown -= line.length;
  }
  ctx.restore();

  // Hero strut (left) and the deadline (right)
  const hp = person(t);
  hp.dir = Math.PI / 2;
  hp.head = hp.dir + Math.sin(t * 1.3) * 0.15;
  hp.pose = 'walk';
  hp.moving = true;
  hp.phase = t * 7;
  hp.arms = 'folder';
  hp.smug = true;
  hp.scale = 2.6;
  drawPerson(ctx, LOOKS.player, hp, 120, 352);
  ctx.save();
  ctx.translate(842, 330);
  ctx.rotate(Math.sin(t * 3) * 0.07);
  emoji(ctx, '🕓', 0, 0, 72);
  ctx.restore();
  emoji(ctx, '📊', 826, 394, 30);
  emoji(ctx, '❌', 842, 404, 18);

  // Controls: a key cap and one plain word each (same words as the in-play legend).
  const wf = font(TITLE_KEYS_STYLE.font, UI_FAMILY, 'bold');
  const lead = 92 + 8 + 92 + TITLE_KEYS_STYLE.capGap + textWidth(ctx, wf, 'walk');
  const kx = drawLegendRow(ctx, TITLE_KEYS, 482, 321, TITLE_KEYS_STYLE, null, lead);
  cluster(ctx, kx, 292, ['W', 'A', 'S', 'D']);
  cluster(ctx, kx + 100, 292, ['↑', '←', '↓', '→']);
  text(ctx, 'walk', kx + 192 + TITLE_KEYS_STYLE.capGap, 321, wf, C.cream, 'left');
  drawLegendRow(ctx, TITLE_KEYS_2, 482, 386, TITLE_KEYS_STYLE_2);

  // Routes found so far + loop count
  const found = game.persist ? game.persist.routesFound : [];
  drawRouteSlots(ctx, found, VIEW_W / 2 - 44, 424, 42, 4);
  const loops = (game.persist && game.persist.loop) | 0;
  if (loops > 0) {
    loopIcon(ctx, VIEW_W / 2 + 70, 445, 8, C.cream, 2.5);
    text(ctx, String(loops), VIEW_W / 2 + 84, 446, font(20, MONO_FAMILY, 'bold'), C.cream, 'left');
  }
  if (e > 0.4) playKey(ctx, VIEW_W / 2, 528, 132, 40, t);
}

const TITLE_KEYS = LEGEND_PLAY.filter((k) => k.key === 'E' || k.key === '⇧' || k.key === 'R');
const TITLE_KEYS_2 = LEGEND_PLAY.filter((k) => k.key === 'M' || k.key === 'V' || k.key === 'Esc');
const TITLE_KEYS_STYLE = { font: 18, keyFont: 16, capW: 32, wideW: 50, capH: 28, capGap: 8, gap: 30, color: C.cream };
const TITLE_KEYS_STYLE_2 = { font: 15, keyFont: 13, capW: 26, wideW: 40, capH: 24, capGap: 7, gap: 30, color: 'rgba(243,230,200,0.75)' };

function cluster(ctx, x, y, keys) {
  const kw = 28;
  const kh = 24;
  keycap(ctx, x + kw + 4, y, kw, kh, keys[0], 14);
  for (let i = 0; i < 3; i++) keycap(ctx, x + i * (kw + 4), y + kh + 6, kw, kh, keys[i + 1], 14);
}

// =============================================================================
// End screen
// =============================================================================
const ROW_ICONS = {
  keycard: ['🪪', '✅', '🎉'],
  projector: ['📽️', '💥', '🤷'],
  fail: ['📊', '❌', '🦗'],
  caught: ['😠', '👉', '📦'], // fired: box of desk stuff, pointed at the elevator
  blamed: ['🪑', '👉', '😠'], // the meeting happened; your chair was empty
};
const B_ANGRY = ['😠'];
const B_POINT = ['👉'];
const B_WHAT = ['❓'];
const B_BLAME = ['😠', '👉'];
const B_PROJ = ['📽️', '💥', '🤷'];
const B_DOTS = ['📊', '❓'];

const CARD = { x: 170, y: 74, w: 620, h: 452 };
const TAB = { x: 190, y: 94, w: 580, h: 240 };

export function endKind(o) {
  if (!o) return 'fail';
  const routes = Array.isArray(o.routes) ? o.routes : [];
  if (o.result === 'caught') return 'caught';
  if (o.result === 'blamed') return 'blamed';
  if (o.result === 'win') return routes.includes('keycard') ? 'keycard' : 'projector';
  return 'fail';
}

export function drawEnd(ctx, game, t, mem) {
  const o = game.outcome || { result: 'fail', routes: [], newRoutes: [], loop: 0, minute: 0 };
  const e = Math.max(0, t - fin(mem.endStart, t));
  const kind = endKind(o);
  const newRoutes = Array.isArray(o.newRoutes) ? o.newRoutes : [];
  const stampAt = (j) => 0.7 + j * 0.35;

  ctx.fillStyle = `rgba(18,13,10,${(0.62 * easeOutCubic(e / 0.4)).toFixed(3)})`;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  let shakeX = 0;
  let shakeY = 0;
  let j = 0;
  for (let i = 0; i < ROUTE_ICONS.length; i++) {
    if (!newRoutes.includes(ROUTE_ICONS[i][0])) continue;
    const se = e - stampAt(j++);
    if (se >= 0.16 && se < 0.34) {
      const f = 1 - (se - 0.16) / 0.18;
      shakeX += Math.sin(se * 140) * 4 * f;
      shakeY += Math.cos(se * 110) * 3 * f;
    }
  }
  const slide = (1 - easeOutCubic(e / 0.45)) * 60;
  ctx.save();
  ctx.globalAlpha = clamp(e / 0.25, 0, 1);
  ctx.translate(shakeX, slide + shakeY);

  // card
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  rrect(ctx, CARD.x + 6, CARD.y + 10, CARD.w, CARD.h, 16);
  ctx.fill();
  ctx.fillStyle = C.paper;
  rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, 16);
  ctx.fill();
  ctx.strokeStyle = kind === 'caught' || kind === 'fail' || kind === 'blamed' ? C.tomato : C.teal;
  ctx.lineWidth = 4;
  rrect(ctx, CARD.x + 6, CARD.y + 6, CARD.w - 12, CARD.h - 12, 12);
  ctx.stroke();

  // tableau
  ctx.save();
  rrect(ctx, TAB.x, TAB.y, TAB.w, TAB.h, 10);
  ctx.clip();
  if (kind === 'keycard') tableauKeycard(ctx, game, t, e);
  else if (kind === 'projector') tableauProjector(ctx, game, t, e);
  else if (kind === 'caught') tableauCaught(ctx, game, t, e);
  else if (kind === 'blamed') tableauBlamed(ctx, game, t, e, o);
  else tableauFail(ctx, game, t, e);
  ctx.restore();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  rrect(ctx, TAB.x, TAB.y, TAB.w, TAB.h, 10);
  ctx.stroke();

  // outcome icons
  const icons = ROW_ICONS[kind];
  for (let i = 0; i < icons.length; i++) {
    const d = clamp((e - 0.35 - i * 0.12) / 0.3, 0, 1);
    if (d <= 0) continue;
    const s = easeOutBack(d);
    ctx.save();
    ctx.translate(VIEW_W / 2 + (i - 1) * 58, 368);
    ctx.scale(s, s);
    emoji(ctx, icons[i], 0, 0, 36);
    ctx.restore();
  }

  // route slots, new ones stamp in
  const size = 50;
  const gap = 10;
  const sx = VIEW_W / 2 - size - gap / 2;
  const sy = 404;
  const found = (game.persist && game.persist.routesFound) || [];
  drawRouteSlots(ctx, found, sx, sy, size, gap, { hide: newRoutes });
  j = 0;
  for (let i = 0; i < ROUTE_ICONS.length; i++) {
    const [id, icon] = ROUTE_ICONS[i];
    if (!newRoutes.includes(id)) continue;
    const se = e - stampAt(j++);
    if (se < 0) continue;
    const cx = sx + i * (size + gap) + size / 2;
    const cy = sy + size / 2;
    const k = easeOutCubic(se / 0.18);
    const sc = 2.6 - 1.6 * k;
    ctx.save();
    ctx.globalAlpha *= clamp(se / 0.08, 0, 1);
    ctx.translate(cx, cy);
    ctx.rotate(-0.15 * (1 - k) - 0.06);
    ctx.scale(sc, sc);
    ctx.fillStyle = '#3d3027';
    rrect(ctx, -size / 2, -size / 2, size, size, 7);
    ctx.fill();
    ctx.strokeStyle = C.tomato;
    ctx.lineWidth = 3;
    rrect(ctx, -size / 2 + 2, -size / 2 + 2, size - 4, size - 4, 6);
    ctx.stroke();
    emoji(ctx, icon, 0, 1, size * 0.6);
    ctx.restore();
    if (se > 0.16 && se < 0.6) {
      const pe = (se - 0.16) / 0.44;
      ctx.fillStyle = `rgba(160,140,110,${(0.5 * (1 - pe)).toFixed(3)})`;
      for (let p = 0; p < 8; p++) {
        const a = (p / 8) * Math.PI * 2 + 0.3;
        const r = size * 0.55 + pe * 22;
        circle(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8, 3 + pe * 4);
        ctx.fill();
      }
      if (se < 0.3) sparkle(ctx, cx + size * 0.45, cy - size * 0.45, 7, '#fff3b0');
    }
  }

  // bottom row: loop number, clock, continue
  const by = 492;
  loopIcon(ctx, 226, by, 9, C.ink, 3);
  text(ctx, String(Math.max(0, fin(o.loop) | 0)), 242, by + 1, font(24, MONO_FAMILY, 'bold'), C.ink, 'left');
  emoji(ctx, '🕓', 404, by, 22);
  text(ctx, clockDigits(fin(o.minute)), 422, by + 1, font(22, MONO_FAMILY, 'bold'), C.ink, 'left');
  if (e > 0.6) playKey(ctx, 700, by, 110, 38, t);
  ctx.restore();
}

// --- tableau helpers ------------------------------------------------------------
function floorCarpet(ctx, x, y, w, h, a = C.carpetA, b = C.carpetB) {
  ctx.fillStyle = a;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = b;
  for (let gy = 0; gy < h; gy += 64) for (let gx = (gy / 64) % 2 ? 64 : 0; gx < w; gx += 128) ctx.fillRect(x + gx, y + gy, 64, 64);
}

function floorTiles(ctx, x, y, w, h) {
  ctx.fillStyle = C.lobbyA;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C.grout;
  for (let gx = 0; gx <= w; gx += 40) ctx.fillRect(x + gx, y, 1.5, h);
  for (let gy = 0; gy <= h; gy += 40) ctx.fillRect(x, y + gy, w, 1.5);
}

function confetti(ctx, x0, w, y0, h, e, n) {
  const cols = [C.tomato, C.mustard, C.teal, '#7fb3c8', '#f2ead3'];
  for (let i = 0; i < n; i++) {
    const sp = 40 + hash(i, 1) * 50;
    const x = x0 + hash(i, 2) * w + Math.sin(e * 3 + i) * 6;
    const y = y0 + ((hash(i, 3) * h + e * sp) % h);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(e * 4 + i);
    ctx.fillStyle = cols[i % cols.length];
    const fw = 6 * Math.abs(Math.cos(e * 8 + i)) + 1;
    ctx.fillRect(-fw / 2, -2, fw, 4);
    ctx.restore();
  }
}

function bossJacket(game) {
  const boss = game.npcs && findNpc(game, 'boss');
  return boss ? boss.hasJacket !== false : true;
}

function tableauKeycard(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, 290, TAB.h);
  floorTiles(ctx, 480, TAB.y, 290, TAB.h);
  confetti(ctx, TAB.x, 280, TAB.y, TAB.h, e, 36);
  // cheering player inside
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = p.dir + Math.sin(t * 4) * 0.25;
  p.arms = 'cheer';
  p.smug = true;
  p.scale = 2.3;
  drawPerson(ctx, LOOKS.player, p, 340, 280 - Math.abs(Math.sin(t * 6)) * 8);
  // boss outside, banging on the glass
  const b = person(t);
  b.dir = Math.PI;
  b.head = Math.PI + Math.sin(t * 2) * 0.1;
  b.arms = 'bang';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, LOOKS.boss, b, 548, 272);
  // the glass wall between them
  ctx.fillStyle = 'rgba(170,215,234,0.5)';
  ctx.fillRect(472, TAB.y, 16, TAB.h);
  ctx.fillStyle = C.glassEdge;
  ctx.fillRect(470, TAB.y, 3, TAB.h);
  ctx.fillRect(487, TAB.y, 3, TAB.h);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  for (let i = 0; i < 3; i++) ctx.fillRect(476 + i * 3, TAB.y + 30 + i * 70, 2, 34);
  // smudges + impact rings
  fillEllipse(ctx, 480, 230, 5, 7, 'rgba(255,255,255,0.22)');
  fillEllipse(ctx, 481, 214, 4, 6, 'rgba(255,255,255,0.18)');
  if (Math.sin(t * 14) > 0.6 || Math.sin(t * 14 + Math.PI / 2) > 0.6) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    for (let r = 0; r < 2; r++) {
      ctx.beginPath();
      ctx.arc(482, 222, 8 + r * 7, Math.PI * 0.6, Math.PI * 1.4);
      ctx.stroke();
    }
  }
  bubble(ctx, B_ANGRY, 560, 196, e);
  const pe = clamp((e - 0.3) / 0.3, 0, 1);
  if (pe > 0) {
    ctx.save();
    ctx.translate(250, 140);
    ctx.scale(easeOutBack(pe), easeOutBack(pe));
    ctx.rotate(Math.sin(t * 3) * 0.12);
    emoji(ctx, '🎉', 0, 0, 44);
    ctx.restore();
  }
}

function tableauProjector(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, '#3d7a72', '#397369');
  // dead screen
  ctx.fillStyle = '#4a4440';
  ctx.fillRect(386, 100, 188, 6);
  ctx.fillStyle = '#d9d6cc';
  ctx.fillRect(392, 106, 176, 70);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let i = 0; i < 6; i++) ctx.fillRect(392, 112 + i * 11 + ((t * 30) % 11), 176, 2);
  // seated Lin (behind the table)
  const l = person(t);
  l.dir = 0;
  l.head = Math.sin(t * 1.5) * 0.3 + 0.2;
  l.pose = 'sit';
  l.arms = 'desk';
  l.scale = 2;
  drawPerson(ctx, LOOKS.lin, l, 270, 222);
  // boss shrugging
  const b = person(t);
  b.dir = Math.PI / 2;
  b.head = b.dir + Math.sin(t * 2.2) * 0.35;
  b.arms = 'shrug';
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, LOOKS.boss, b, 660, 222);
  // table
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, 262, 238, 440, 86, 30);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, 256, 228, 440, 86, 30);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, 256, 228, 440, 76, 30);
  ctx.fill();
  // the projector, large and smoking
  ctx.save();
  ctx.translate(470, 268);
  ctx.scale(3, 3);
  drawProjector(ctx, 0, 0, 'broken', 0, t);
  ctx.restore();
  bubble(ctx, B_PROJ, 660, 150, e);
}

function tableauFail(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  // blank white slide, glowing
  ctx.fillStyle = 'rgba(255,255,235,0.35)';
  ctx.fillRect(372, 98, 216, 96);
  ctx.fillStyle = '#4a4440';
  ctx.fillRect(376, 98, 208, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(382, 104, 196, 84);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(382.5, 104.5, 195, 83);
  // presenter
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = p.dir + Math.sin(t * 2.6) * 0.5;
  p.sweat = true;
  p.scale = 2.3;
  drawPerson(ctx, LOOKS.player, p, 480, 262);
  // staring coworkers
  const k = person(t);
  k.dir = 0.25;
  k.head = 0.05;
  k.pose = 'sit';
  k.arms = 'desk';
  k.glance = 1;
  k.scale = 2;
  if (!game.world || !game.world.kevGone) drawPerson(ctx, LOOKS.kev, k, 262, 206); // he went home at 3:00 (unless kept late)
  const l = person(t);
  l.dir = -0.15;
  l.head = -0.25;
  l.pose = 'sit';
  l.arms = 'desk';
  l.glance = 1;
  l.scale = 2;
  drawPerson(ctx, LOOKS.lin, l, 300, 300);
  const b = person(t);
  b.dir = Math.PI;
  b.head = Math.PI + 0.15;
  b.glance = 1;
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, LOOKS.boss, b, 676, 268);
  bubble(ctx, B_DOTS, 676, 186, e, 'thought');
  // the lone cricket
  const hop = Math.abs(Math.sin(e * 5));
  emoji(ctx, '🦗', 480 + Math.sin(e * 0.9) * 80, 322 - hop * 14, 22);
}

// Fired: you shuffle off to the elevator with your desk in a box; the boss points the way.
const LIFT = { x: 612, y: TAB.y, w: 104, h: 104 };

function tableauCaught(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  backWall(ctx, 92);
  drawLift(ctx, t);
  // the walk of shame: slow, then a stop at the open doors
  const walkK = clamp(e / 3.6, 0, 1);
  const px = 350 + (LIFT.x + LIFT.w / 2 - 350) * easeOutCubic(walkK);
  const walking = walkK < 0.98;
  const p = person(t);
  p.dir = walking ? 0.12 : -Math.PI / 2 + 0.25;
  p.head = walking ? 0.55 : -Math.PI / 2 + 0.6; // eyes on the floor, then on the lift
  p.pose = walking ? 'walk' : 'stand';
  p.moving = walking;
  p.phase = t * 7;
  p.arms = 'box';
  p.sweat = true;
  p.jacket = false;
  p.scale = 2.4;
  drawPerson(ctx, LOOKS.player, p, px, 268);
  // the boss, rooted to the spot, pointing the way out
  const b = person(t);
  b.dir = 0.08;
  b.head = 0.08 + Math.sin(t * 2.4) * 0.08;
  b.arms = 'point';
  b.item = '👉';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.6;
  const jab = Math.max(0, Math.sin(t * 5)) * 3; // little jabs at the door
  drawPerson(ctx, LOOKS.boss, b, 262 + jab, 282);
  bubble(ctx, B_ANGRY, 276, 206, e, 'alert');
}

// A plain back wall across the top of a tableau, with a baseboard.
function backWall(ctx, h) {
  ctx.fillStyle = C.wallFront;
  ctx.fillRect(TAB.x, TAB.y, TAB.w, h);
  ctx.fillStyle = C.wallGroove;
  for (let x = TAB.x + 24; x < TAB.x + TAB.w; x += 48) ctx.fillRect(x, TAB.y, 2, h);
  ctx.fillStyle = C.baseboard;
  ctx.fillRect(TAB.x, TAB.y + h - 5, TAB.w, 5);
  ctx.fillStyle = 'rgba(20,12,8,0.18)';
  ctx.fillRect(TAB.x, TAB.y + h, TAB.w, 6);
}

// Elevator set into the back wall, doors open, cab lit, the down arrow glowing.
function drawLift(ctx, t) {
  const { x, y, w, h } = LIFT;
  ctx.fillStyle = C.steelDark;
  ctx.fillRect(x - 6, y + 14, w + 12, h - 14);
  ctx.fillStyle = '#f2d9a2'; // lit cab
  ctx.fillRect(x, y + 20, w, h - 20);
  ctx.fillStyle = '#d9bc84';
  ctx.fillRect(x, y + h - 22, w, 22); // cab floor
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x + 8, y + 24, w - 16, 3); // ceiling light
  ctx.fillStyle = C.steel; // doors, slid into the frame
  ctx.fillRect(x, y + 20, 12, h - 20);
  ctx.fillRect(x + w - 12, y + 20, 12, h - 20);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(x + 3, y + 22, 1.5, h - 24);
  ctx.fillRect(x + w - 9, y + 22, 1.5, h - 24);
  // light spilling onto the carpet
  ctx.fillStyle = 'rgba(255,236,190,0.22)';
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w + 26, y + h + 44);
  ctx.lineTo(x - 26, y + h + 44);
  ctx.closePath();
  ctx.fill();
  // floor indicator: a blinking down arrow
  ctx.fillStyle = '#1f1814';
  rrect(ctx, x + w / 2 - 12, y + 2, 24, 12, 3);
  ctx.fill();
  ctx.fillStyle = Math.sin(t * 5) > -0.3 ? '#f0b24a' : '#7a5a2a';
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - 5, y + 5);
  ctx.lineTo(x + w / 2 + 5, y + 5);
  ctx.lineTo(x + w / 2, y + 11);
  ctx.closePath();
  ctx.fill();
}

// Blamed: the meeting went ahead without you. Everyone glares at your empty mustard chair.
// routes add their scars: 'projector' leaves it smoking on the table, 'keycard' leaves the boss
// stuck outside, glowering in through the window.
function tableauBlamed(ctx, game, t, e, o) {
  const routes = Array.isArray(o.routes) ? o.routes : [];
  const smoke = routes.includes('projector');
  const lockedOut = routes.includes('keycard');
  const kev = !game.world || !game.world.kevGone;
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.meetingRug, '#397369');
  // locked out, the boss's spot is empty: the screen slides over for the window he glares through
  meetingScreen(ctx, t, smoke, lockedOut ? -90 : 0);
  if (lockedOut) bossAtWindow(ctx, game, t);
  // the boss behind the table, fists on it
  if (!lockedOut) {
    const b = person(t);
    b.dir = Math.PI / 2;
    b.head = Math.PI / 2;
    b.arms = 'bang';
    b.angry = true;
    b.jacket = bossJacket(game);
    b.scale = 2.5;
    drawPerson(ctx, LOOKS.boss, b, 476, 222);
  }
  // table, with a slide printout at each place but yours
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, 302, 236, 350, 54, 24);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, 296, 228, 350, 56, 24);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, 296, 228, 350, 47, 24);
  ctx.fill();
  for (const x of [336, 606]) {
    ctx.fillStyle = C.white;
    ctx.fillRect(x - 12, 240, 24, 17);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(x - 8, 245, 16, 1.4);
    ctx.fillRect(x - 8, 249, 11, 1.4);
  }
  if (smoke) {
    ctx.save();
    ctx.translate(420, 254);
    ctx.scale(2.4, 2.4);
    drawProjector(ctx, 0, 0, 'broken', 0, t);
    ctx.restore();
  }
  // Lin and Kev at the table ends, turned to the chair
  const l = person(t);
  l.dir = 0.42;
  l.head = 0.42;
  l.arms = 'point';
  l.item = '👉';
  l.angry = true;
  l.scale = 2.4;
  drawPerson(ctx, LOOKS.lin, l, 272, 262);
  if (kev) {
    const k = person(t);
    k.dir = Math.PI - 0.42;
    k.head = Math.PI - 0.3 + Math.sin(t * 1.7) * 0.2;
    k.glance = 1;
    k.scale = 2.4;
    drawPerson(ctx, LOOKS.kev, k, 680, 262);
  }
  // your chair: empty, in a pool of light
  for (let i = 3; i >= 1; i--) fillEllipse(ctx, 476, 316, 26 + i * 14, 7 + i * 4, `rgba(255,240,200,${(0.08 * (4 - i)).toFixed(3)})`);
  ctx.save();
  ctx.translate(476, 302);
  ctx.scale(2.6, 2.6);
  drawChair(ctx, 0, 0, -Math.PI / 2, C.mustard, C.mustardDark);
  ctx.restore();
  // what they're saying
  bubble(ctx, lockedOut && !kev ? B_BLAME : B_POINT, 272, 206, e, 'speech', 1.4);
  if (!lockedOut) bubble(ctx, B_ANGRY, 476, 168, e, 'alert');
  if (kev) bubble(ctx, B_WHAT, 680, 206, e, 'thought', 1.4);
}

// The meeting-room screen: a blank glowing slide (nobody presented), or dead if the projector went.
function meetingScreen(ctx, t, dead, dx) {
  const x = 386 + dx;
  ctx.fillStyle = '#4a4440';
  ctx.fillRect(x, 98, 188, 6);
  if (dead) {
    ctx.fillStyle = '#9d9a92';
    ctx.fillRect(x + 6, 104, 176, 62);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < 6; i++) ctx.fillRect(x + 6, 108 + i * 10 + ((t * 30) % 10), 176, 2);
    return;
  }
  ctx.fillStyle = 'rgba(255,255,235,0.3)';
  ctx.fillRect(x, 104, 188, 68);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, 104, 176, 62);
}

// Locked out: the boss's face pressed to a window in the back corner, fists on the glass.
function bossAtWindow(ctx, game, t) {
  const wx = 512;
  const wy = 100;
  const ww = 116;
  const wh = 72;
  ctx.fillStyle = C.glassFrame;
  ctx.fillRect(wx - 4, wy - 4, ww + 8, wh + 8);
  ctx.save();
  ctx.beginPath();
  ctx.rect(wx, wy, ww, wh);
  ctx.clip();
  ctx.fillStyle = C.lobbyA; // the lobby outside
  ctx.fillRect(wx, wy, ww, wh);
  const b = person(t);
  b.dir = Math.PI / 2;
  b.head = Math.PI / 2 + Math.sin(t * 1.3) * 0.15;
  b.arms = 'bang';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, LOOKS.boss, b, wx + ww / 2, wy + wh - 4); // face centred, fists on the glass
  ctx.fillStyle = C.glass;
  ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = C.glassHi;
  ctx.beginPath();
  ctx.moveTo(wx + 14, wy + wh);
  ctx.lineTo(wx + 26, wy + wh);
  ctx.lineTo(wx + 56, wy);
  ctx.lineTo(wx + 44, wy);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = C.glassPost;
  ctx.fillRect(wx + ww * 0.82 - 1.5, wy, 3, wh); // mullion off to the side, clear of his face
}
