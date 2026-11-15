// HUD band across the top: icons and digits only, no words. (The key legend at the bottom names
// the controls in one word each; naming a control is not a hint.) "No hand-holding": it never shows
// route status or rule counters. The projector, keycard, coffee and sandwich show their state in
// the world (world.js / characters.js); the HUD keeps clock, mission icons, held item, loop count,
// found-route slots and a few status icons.
import {
  T, VIEW_W, VIEW_H, HUD_H, clamp, fin, emoji, text, font, textWidth, rrect, fillCircle, loopIcon, keycap, clockHands,
  MONO_FAMILY, UI_FAMILY,
} from './util.js';
import { C } from './palette.js';
import { itemIcon } from './characters.js';
import { formatClock, dayCue, WORK_PENALTY_MIN } from '../config.js';

function panel(ctx, x, y, w, h, color = C.hudPanel) {
  ctx.fillStyle = color;
  rrect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,240,210,0.05)';
  rrect(ctx, x + 2, y + 2, w - 4, 3, 1.5);
  ctx.fill();
}

export function drawHud(ctx, game, t, mem) {
  ctx.fillStyle = C.hudBg;
  ctx.fillRect(0, 0, VIEW_W, HUD_H);
  ctx.fillStyle = C.ochre;
  ctx.fillRect(0, HUD_H - 3, VIEW_W, 1.5);
  ctx.fillStyle = C.teal;
  ctx.fillRect(0, HUD_H - 1.5, VIEW_W, 1.5);

  const clock = game.clock || { minute: 0, ff: false, forced: 0 };
  drawClock(ctx, fin(clock.minute), t, game.level.day);
  drawGoal(ctx, game.level.title?.badge ?? NO_BADGE);
  drawHeld(ctx, game.level.items, game.player && game.player.held);
  // loop counter + found routes
  panel(ctx, 342, 6, 160, 44);
  loopIcon(ctx, 362, 28, 8.5, C.hudText, 3);
  text(ctx, String(Math.max(0, (game.persist && game.persist.loop) | 0)), 377, 29, font(22, MONO_FAMILY, 'bold'), C.hudText, 'left');
  drawRouteSlots(ctx, game.level.routes, game.persist ? game.persist.routesFound : [], 418, 10, 36, 4);
  drawStatus(ctx, game, clock, t);
  if (game.phase === 'day') {
    drawPauseButton(ctx, !!game.paused);
    if (game.paused) drawPaused(ctx, t); // under the legend, so "Esc pause" stays readable
    drawKeyLegend(ctx, game);
  }
}

// --- pause ---------------------------------------------------------------------------
// The ⏸ button, top right. main.js hit-tests this rect (view coordinates) on click.
export const PAUSE_BTN = { x: 918, y: 12, w: 32, h: 32 };

function drawPauseButton(ctx, paused) {
  const b = PAUSE_BTN;
  panel(ctx, b.x, b.y, b.w, b.h);
  ctx.fillStyle = C.hudText;
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  if (paused) {
    // ▶: click to carry on
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy - 8);
    ctx.lineTo(cx + 8, cy);
    ctx.lineTo(cx - 5, cy + 8);
    ctx.closePath();
    ctx.fill();
  } else {
    rrect(ctx, cx - 7, cy - 8, 5, 16, 1.5);
    ctx.fill();
    rrect(ctx, cx + 2, cy - 8, 5, 16, 1.5);
    ctx.fill();
  }
}

// Paused: the office dims and two big bars breathe in the middle. No words.
function drawPaused(ctx, t) {
  const mapH = VIEW_H - HUD_H;
  ctx.fillStyle = 'rgba(18,14,10,0.58)';
  ctx.fillRect(0, HUD_H, VIEW_W, mapH);
  const cx = VIEW_W / 2;
  const cy = HUD_H + mapH / 2 - 20;
  ctx.globalAlpha = 0.78 + 0.18 * Math.sin(t * 2.4);
  ctx.fillStyle = C.cream;
  rrect(ctx, cx - 34, cy - 46, 24, 92, 6);
  ctx.fill();
  rrect(ctx, cx + 10, cy - 46, 24, 92, 6);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// --- key legend -------------------------------------------------------------------
// A key cap and one plain word per control. Shared with the title screen.
export const LEGEND_PLAY = [
  { key: 'E', label: 'do' },
  { key: '⇧', label: 'pretend', wide: true },
  { key: 'R', label: 'restart' },
  { key: 'M', label: 'mute' },
  { key: 'V', label: 'vision' },
  { key: 'Esc', label: 'pause', wide: true },
];
const LEGEND_PLAY_STYLE = { font: 14, keyFont: 12, capW: 24, wideW: 38, capH: 19, capGap: 6, gap: 18, color: 'rgba(243,230,200,0.8)' };
const PRESSED = { E: false, '⇧': false, R: false, M: false, V: false, Esc: false };

// Lays a row of [cap] word pairs out centred on (cx, cy). `lead` reserves room at the start for
// something the caller draws itself (the title's WASD clusters); returns the row's left edge.
export function drawLegendRow(ctx, items, cx, cy, o, pressed = null, lead = 0) {
  const f = font(o.font, UI_FAMILY, 'bold');
  let total = lead;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (lead || i) total += o.gap;
    total += (it.wide ? o.wideW : o.capW) + o.capGap + textWidth(ctx, f, it.label);
  }
  const x0 = cx - total / 2;
  let x = x0 + lead;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (lead || i) x += o.gap;
    const w = it.wide ? o.wideW : o.capW;
    keycap(ctx, x, cy - (o.capH + 4) / 2, w, o.capH, it.key, it.wide ? o.keyFont + 2 : o.keyFont, false, !!(pressed && pressed[it.key]));
    x += w + o.capGap;
    text(ctx, it.label, x, cy, f, o.color, 'left');
    x += textWidth(ctx, f, it.label);
  }
  return x0;
}

// Centred on the level's decor.legendAt (map tiles); no legendAt, no legend.
// Held keys show pushed down (toggles don't: a lit V by default reads as a hint).
function drawKeyLegend(ctx, game) {
  const at = game.level.decor && game.level.decor.legendAt;
  if (!at) return;
  const p = game.player || {};
  PRESSED['⇧'] = !!p.busy;
  PRESSED.E = !!p.action;
  drawLegendRow(ctx, LEGEND_PLAY, at.x * T, HUD_H + at.y * T, LEGEND_PLAY_STYLE, PRESSED);
}

// "3:50 PM" -> "3:50": digits only (the analog face carries the rest). start: the level's day.start.
export function clockDigits(minute, start) {
  const str = formatClock(minute, start);
  const sp = str.indexOf(' ');
  return sp > 0 ? str.slice(0, sp) : str;
}

function drawClock(ctx, minute, t, day) {
  const red = minute >= dayCue(day, 'clockRedAt');
  const last = minute >= day.meetingAt - 2;
  const pulse = last ? 0.5 + 0.5 * Math.sin(t * 8) : 0;
  panel(ctx, 10, 6, 168, 44);
  if (last) {
    ctx.fillStyle = `rgba(255,90,67,${(0.12 + 0.25 * pulse).toFixed(3)})`;
    rrect(ctx, 10, 6, 168, 44, 8);
    ctx.fill();
  }
  // mini analog face
  const cx = 34;
  const cy = 28;
  fillCircle(ctx, cx, cy, 15, red ? C.hudRed : C.ochre);
  fillCircle(ctx, cx, cy, 12.5, C.cream);
  ctx.fillStyle = C.ink;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    fillCircle(ctx, cx + Math.cos(a) * 10, cy + Math.sin(a) * 10, i % 3 ? 0.6 : 1.1, C.ink);
  }
  clockHands(ctx, cx, cy, minute, 6, 2.4, 9.5, 1.5, red ? C.tomatoDark : C.ink, day.start);
  fillCircle(ctx, cx, cy, 1.5, C.tomato);

  const hm = clockDigits(minute, day.start);
  const col = red ? C.hudRed : C.hudText;
  ctx.save();
  ctx.translate(166, 29);
  const s = 1 + 0.07 * pulse;
  ctx.scale(s, s);
  if (last) {
    ctx.shadowColor = 'rgba(255,90,67,0.8)';
    ctx.shadowBlur = 6 + 8 * pulse;
  }
  text(ctx, hm, 0, 0, font(30, MONO_FAMILY, 'bold'), col, 'right');
  ctx.restore();
}

// Mission icons only: 🕓 📊❌.
// The mission: the 🕓 deadline, then the level's title.badge [main icon, small overlay icon], drawn as the title
// screen draws it (screens.js).
const NO_BADGE = [];
function drawGoal(ctx, badge) {
  panel(ctx, 190, 6, 84, 44);
  emoji(ctx, '🕓', 214, 28, 20);
  if (badge[0]) emoji(ctx, badge[0], 248, 28, 20);
  if (badge[1]) emoji(ctx, badge[1], 258, 36, 12);
}

function drawHeld(ctx, items, held) {
  panel(ctx, 286, 6, 44, 44);
  ctx.strokeStyle = 'rgba(243,230,200,0.22)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  rrect(ctx, 292, 12, 32, 32, 6);
  ctx.stroke();
  ctx.setLineDash([]);
  const ic = itemIcon(items, held);
  if (ic) emoji(ctx, ic, 308, 29, 24);
  else {
    ctx.globalAlpha = 0.18;
    emoji(ctx, '✋', 308, 29, 18);
    ctx.globalAlpha = 1;
  }
}

// Route slots, one per route (the level's routes, in order). A found route shows its icon; an unfound
// one is a blank slot (never a greyed-out icon: that would reveal the solution). opts.hide lists found
// routes to draw blank anyway (the end screen stamps them in). Shared with the title and end screens.
export function drawRouteSlots(ctx, routes, found, x, y, size, gap, opts) {
  const list = Array.isArray(found) ? found : [];
  for (let i = 0; i < routes.length; i++) {
    const { id, icon } = routes[i];
    const sx = x + i * (size + gap);
    const hidden = opts && opts.hide && opts.hide.includes(id);
    const on = list.includes(id) && !hidden;
    ctx.fillStyle = on ? '#3d3027' : '#231b16';
    rrect(ctx, sx, y, size, size, 7);
    ctx.fill();
    if (on) {
      ctx.strokeStyle = C.ochre;
      ctx.lineWidth = 2;
      rrect(ctx, sx + 1, y + 1, size - 2, size - 2, 6);
      ctx.stroke();
      emoji(ctx, icon, sx + size / 2, y + size / 2 + 1, size * 0.58);
    } else {
      ctx.strokeStyle = 'rgba(243,230,200,0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      rrect(ctx, sx + 3, y + 3, size - 6, size - 6, 5);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

function drawStatus(ctx, game, clock, t) {
  let x = game.phase === 'day' ? PAUSE_BTN.x - 6 : 950;
  const cy = 28;
  if (game.settings && game.settings.muted) {
    emoji(ctx, '🔇', x - 12, cy, 18);
    x -= 30;
  }
  const forced = fin(clock.forced);
  if (forced > 0) {
    const k = clamp(forced / WORK_PENALTY_MIN, 0, 1);
    emoji(ctx, '📄', x - 50, cy + Math.sin(t * 6) * 1, 18);
    ctx.fillStyle = 'rgba(243,230,200,0.15)';
    rrect(ctx, x - 38, cy - 4, 32, 8, 3);
    ctx.fill();
    ctx.fillStyle = C.hudRed;
    rrect(ctx, x - 37, cy - 3, 30 * k, 6, 2.5);
    ctx.fill();
    x -= 62;
  }
  if (clock.ff) {
    const s = 18 + Math.abs(Math.sin(t * 6)) * 2;
    emoji(ctx, '⏩', x - 13, cy, s);
    x -= 32;
  }
  const speed = game.debug ? fin(game.debug.speed, 1) : 1;
  if (speed !== 1) {
    text(ctx, `×${speed}`, x - 2, cy + 1, font(15, MONO_FAMILY, 'bold'), C.ochre, 'right');
    x -= 40;
  }
  if (game.settings && game.settings.showCones === false) {
    ctx.globalAlpha = 0.35;
    emoji(ctx, '👁️', x - 12, cy, 15);
    ctx.globalAlpha = 1;
  }
}

