// Title and end screens. Both are drawn over the (dimmed) office.
// The end card's picture and icon row come from the level (level.endScenes, e.g.
// src/levels/meeting/end-scenes.js), else DEFAULT_END_SCENES below; the route slots take any number of routes.
import {
  VIEW_W, VIEW_H, clamp, fin, easeOutBack, easeOutCubic, emoji, glyphScope, text, font, textWidth,
  rrect, circle, loopIcon, keycap,
  MONO_FAMILY, TYPE_FAMILY, TITLE_FAMILY, UI_FAMILY,
} from './util.js';
import { C } from './palette.js';
import { lookFor, drawPerson } from './characters.js';
import { drawRouteSlots, clockDigits, drawLegendRow, LEGEND_PLAY } from './hud.js';
import { sparkle } from './world.js';
import { TAB, person, bubble, floorCarpet, confetti, backWall } from './tableau.js';
import { clockFace } from './things.js';
import { drawShelf } from './shelf.js';

// Width of a row of n route slots.
const rowSpan = (n, size, gap) => (n > 0 ? n * size + (n - 1) * gap : 0);

// Where the ▶ key cap was last drawn, in view coordinates, so a click on it starts the day like E/Space/Enter
// (main.js). null while no card shows it. Recording it changes no pixels.
export const playButton = { rect: null };

// Wide key cap with a procedural ▶ glyph.
function playKey(ctx, cx, cy, w, h, t) {
  playButton.rect = { x: cx - w / 2, y: cy - h / 2, w, h };
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
const NO_TITLE = { mission: ['', ''], badge: [] };

export function drawTitle(ctx, game, t, mem) {
  playButton.rect = null; // set again below once the ▶ shows
  const e = Math.max(0, t - fin(mem.titleStart, t));
  ctx.fillStyle = 'rgba(22,16,12,0.76)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  // mid-century stripes
  ctx.fillStyle = C.ochre;
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
  ctx.fillStyle = C.ochre;
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
  const { mission: MISSION, badge } = game.level.title || NO_TITLE;
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
  drawPerson(ctx, lookFor(game.level.looks, 'player'), hp, 120, 352);
  ctx.save();
  ctx.translate(842, 330);
  ctx.rotate(Math.sin(t * 3) * 0.07);
  emoji(ctx, '#clock', 0, 0, 72);
  ctx.restore();
  if (badge[0]) emoji(ctx, badge[0], 826, 394, 30);
  if (badge[1]) emoji(ctx, badge[1], 842, 404, 18);

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
  const routes = game.level.routes;
  const span = rowSpan(routes.length, 42, 4);
  const rx = VIEW_W / 2 - span / 2;
  drawRouteSlots(ctx, routes, found, rx, 424, 42, 4);
  const loops = (game.persist && game.persist.loop) | 0;
  if (loops > 0) {
    loopIcon(ctx, rx + span + 26, 445, 8, C.cream, 2.5);
    text(ctx, String(loops), rx + span + 40, 446, font(20, MONO_FAMILY, 'bold'), C.cream, 'left');
  }
  if (e > 0.4) playKey(ctx, VIEW_W / 2, 528, 132, 40, t);
  drawShelf(ctx, game, mem, { alpha: clamp((e - 0.6) / 0.4, 0, 1) }); // the endings found here
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
const CARD = { x: 170, y: 74, w: 620, h: 452 };
const NO_SCENE = { win: false, icons: [], draw() {} };

// The end card of a level without endScenes: one plain scene per result. The picture is you in an empty office,
// a thought over your head; a win throws confetti and you cheer.
const plainScene = (win, icons, thought) => ({
  win,
  icons,
  draw(ctx, game, t, e) {
    backWall(ctx, 72);
    floorCarpet(ctx, TAB.x, TAB.y + 72, TAB.w, TAB.h - 72);
    if (win) confetti(ctx, TAB.x, TAB.w, TAB.y, TAB.h, e, 36);
    const p = person(t);
    p.head = p.dir + Math.sin(t * 2) * 0.15;
    p.arms = win ? 'cheer' : 'idle';
    p.smug = win;
    p.scale = 2.3;
    const x = TAB.x + TAB.w / 2;
    const y = TAB.y + 190 - (win ? Math.abs(Math.sin(t * 6)) * 8 : 0);
    drawPerson(ctx, lookFor(game.level.looks, 'player'), p, x, y);
    bubble(ctx, thought, x + 58, TAB.y + 92, e, 'thought');
  },
});
// The day lost with you still at the desk work you were sent to (outcome.stopped.working, play/scenario.js): whoever
// stopped you points at you, and you sit behind the paper stack. Any level's lost card gives way to it unless the level draws its own
// (endScenes.scenes.stopped, or a kindOf that answers 'stopped'). The icons: the face that told, 👉, the stack.
const STOPPED_SCENE = {
  win: false,
  icons: ['👉', '📄'],
  iconsFor: (o) => ['@' + o.stopped.by, '👉', '📄'],
  draw(ctx, game, t, e, o) {
    backWall(ctx, 72);
    floorCarpet(ctx, TAB.x, TAB.y + 72, TAB.w, TAB.h - 72);
    const by = o && o.stopped ? o.stopped.by : null;
    const mx = TAB.x + TAB.w * 0.66;
    const fy = TAB.y + 196;
    // you, at your desk, behind the stack
    const p = person(t);
    p.dir = Math.PI / 2;
    p.head = p.dir + Math.sin(t * 7) * 0.05;
    p.pose = 'sit';
    p.arms = 'type';
    p.typing = true;
    p.sweat = true;
    p.scale = 2.3;
    drawPerson(ctx, lookFor(game.level.looks, 'player'), p, mx, fy - 24);
    ctx.fillStyle = '#7a5a3e';
    ctx.fillRect(mx - 78, fy - 6, 156, 16);
    ctx.fillStyle = '#5e4430';
    ctx.fillRect(mx - 70, fy + 10, 10, 34);
    ctx.fillRect(mx + 60, fy + 10, 10, 34);
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(mx + 14, fy - 8 - i * 4 + 3, 40, 1.5);
      ctx.fillStyle = i % 2 ? '#e9e4d6' : C.white;
      ctx.fillRect(mx + 14 + (i % 3) - 1, fy - 8 - i * 4, 40, 4);
    }
    bubble(ctx, ['😩'], mx - 30, TAB.y + 70, e, 'thought');
    // whoever stopped you, pointing
    if (by) {
      const w = person(t);
      w.dir = 0.15;
      w.head = 0.15;
      w.arms = 'point';
      w.angry = true;
      w.scale = 2.3;
      const wx = TAB.x + TAB.w * 0.24;
      drawPerson(ctx, lookFor(game.level.looks, by), w, wx, fy + 10);
      bubble(ctx, ['❗', '👉', '@player'], wx + 40, TAB.y + 64, e, 'speech');
    }
  },
};

export const DEFAULT_END_SCENES = {
  kindOf: (o) => (o && (o.result === 'win' || o.result === 'caught' || o.result === 'blamed') ? o.result : 'fail'),
  scenes: {
    win: plainScene(true, ['🎉', '😎'], ['😎']),
    caught: plainScene(false, ['❗', '😠'], ['😳']),
    blamed: plainScene(false, ['👉', '😠'], ['😰']),
    fail: plainScene(false, ['📊', '😩'], ['😩']),
  },
};

// The scene an outcome's end card draws: { kind, scene, key }. kind names the scene (the level's kindOf, or
// 'stopped'); key names the ending on the shelf (game/endings.js): the scene, plus outcome.why when it has one, since
// a scene may draw a why its own way (Meeting's 'mug' scene: the mug in your hand, or on the table).
export function endScene(level, o) {
  const ends = level.endScenes || DEFAULT_END_SCENES;
  let kind = ends.kindOf(o);
  let scene = ends.scenes[kind] || NO_SCENE;
  // Only while you were still at the work you were sent to: then the order is what lost you the day. Sent back
  // earlier and lost some other way later, the card shows that other way (the step that broke).
  if (o?.stopped?.working && !scene.win && kind !== 'stopped') {
    scene = ends.scenes.stopped || STOPPED_SCENE;
    kind = 'stopped';
  }
  const key = o?.why !== undefined && o?.why !== null ? `${kind}:${o.why}` : kind;
  return { kind, scene, key, known: scene !== NO_SCENE };
}

export function drawEnd(ctx, game, t, mem) {
  playButton.rect = null; // set again below once the ▶ shows
  const o = game.outcome || { result: 'fail', routes: [], newRoutes: [], loop: 0, minute: 0 };
  const e = Math.max(0, t - fin(mem.endStart, t));
  const { scene } = endScene(game.level, o);
  const newRoutes = Array.isArray(o.newRoutes) ? o.newRoutes : [];
  const stampAt = (j) => 0.7 + j * 0.35;

  ctx.fillStyle = `rgba(18,13,10,${(0.62 * easeOutCubic(e / 0.4)).toFixed(3)})`;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  let shakeX = 0;
  let shakeY = 0;
  let j = 0;
  const slots = game.level.routes;
  for (let i = 0; i < slots.length; i++) {
    if (!newRoutes.includes(slots[i].id)) continue;
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
  ctx.strokeStyle = scene.win ? C.teal : C.tomato;
  ctx.lineWidth = 4;
  rrect(ctx, CARD.x + 6, CARD.y + 6, CARD.w - 12, CARD.h - 12, 12);
  ctx.stroke();

  // tableau
  ctx.save();
  rrect(ctx, TAB.x, TAB.y, TAB.w, TAB.h, 10);
  ctx.clip();
  const was = glyphScope('world'); // a drawn scene: no emoji objects in it (its bubbles are speech)
  scene.draw(ctx, game, t, e, o);
  glyphScope(was);
  ctx.restore();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  rrect(ctx, TAB.x, TAB.y, TAB.w, TAB.h, 10);
  ctx.stroke();

  // outcome icons: the punchline, speech (DESIGN.md "Visual language" rule 5)
  const icons = scene.iconsFor ? scene.iconsFor(o) : scene.icons;
  for (let i = 0; i < icons.length; i++) {
    const d = clamp((e - 0.35 - i * 0.12) / 0.3, 0, 1);
    if (d <= 0) continue;
    const s = easeOutBack(d);
    ctx.save();
    ctx.translate(VIEW_W / 2 + (i - (icons.length - 1) / 2) * 58, 368);
    ctx.scale(s, s);
    emoji(ctx, icons[i], 0, 0, 36);
    ctx.restore();
  }

  // route slots, new ones stamp in
  const size = 50;
  const gap = 10;
  const sx = VIEW_W / 2 - rowSpan(slots.length, size, gap) / 2;
  const sy = 404;
  const found = (game.persist && game.persist.routesFound) || [];
  drawRouteSlots(ctx, slots, found, sx, sy, size, gap, { hide: newRoutes });
  j = 0;
  for (let i = 0; i < slots.length; i++) {
    const { id, icon } = slots[i];
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
  // its face at the minute beside it, as the HUD's clock reads behind the card
  ctx.save();
  clockFace(ctx, 404, by, 22, fin(o.minute), game.level.day.start);
  ctx.restore();
  text(ctx, clockDigits(fin(o.minute), game.level.day.start), 422, by + 1, font(22, MONO_FAMILY, 'bold'), C.ink, 'left');
  if (e > 0.6) playKey(ctx, 700, by, 110, 38, t);
  ctx.restore();

  // the endings found here, under the card; this one stamps in after the routes if it is new
  drawShelf(ctx, game, mem, { e, stampAt: stampAt(j), alpha: clamp(e / 0.25, 0, 1) });
}
