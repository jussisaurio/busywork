// Weekend Shift's end cards: a drawn scene each (level 1's end-scenes.js documents the fields). Each picture says
// what happened and why it's a win or a loss for you; the icon row under it retells it left to right: cause,
// effect, you. Names are photos on the roster board and the sign-off sheet (props.js).
import { clamp, easeOutBack, emoji, fillEllipse } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { TAB, person, bubble, floorCarpet, confetti, backWall } from '../../render/tableau.js';
import { drawBoard, portrait } from './props.js';

const SOUTH = Math.PI / 2;
const looks = (game) => game.level.looks;

// You, smug, arms up, hopping; confetti over you.
function youCheer(ctx, game, t, e, x, y) {
  confetti(ctx, x - 110, 220, TAB.y, TAB.h, e, 30);
  const p = person(t);
  p.head = SOUTH + Math.sin(t * 4) * 0.25;
  p.arms = 'cheer';
  p.smug = true;
  p.scale = 2.3;
  drawPerson(ctx, looks(game).player, p, x, y - Math.abs(Math.sin(t * 6)) * 8);
  const k = clamp((e - 0.3) / 0.3, 0, 1);
  if (k > 0) {
    ctx.save();
    ctx.translate(x + 62, y - 120);
    ctx.scale(easeOutBack(k), easeOutBack(k));
    ctx.rotate(Math.sin(t * 3) * 0.12);
    emoji(ctx, '🎉', 0, 0, 40);
    ctx.restore();
  }
}

// The boss, pointing along dir (radians: 0 east, PI west), mid-reading.
function bossPointing(ctx, game, t, x, y, dir, angry = false) {
  const b = person(t);
  b.dir = dir;
  b.head = dir + Math.sin(t * 2.4) * 0.06;
  b.arms = 'point';
  b.item = '👉';
  b.angry = angry;
  b.scale = 2.4;
  drawPerson(ctx, looks(game).boss, b, x + Math.max(0, Math.sin(t * 5)) * 3 * Math.cos(dir), y);
}

// The sign-off sheet, held up at (x, y) (its centre), with a photo of whose name is on it.
function bigSheet(ctx, look, x, y, t, rot = 0, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(k, k);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(-27, -33, 58, 72);
  ctx.fillStyle = C.white;
  ctx.fillRect(-30, -36, 58, 72);
  ctx.fillStyle = 'rgba(42,47,58,0.25)';
  for (let i = 0; i < 5; i++) ctx.fillRect(-22, 4 + i * 6, 42, 1.6);
  portrait(ctx, look, -12, -16, 13, t);
  ctx.fillStyle = '#2a2f3a';
  ctx.fillRect(4, -18, 20, 2.4);
  ctx.restore();
}

// Win: the boss's photo tops the Saturday roster; he reads it out, red-faced. You cheer.
function sceneRoster(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, 64);
  drawBoard(ctx, 360, 322, 4.1, [looks(game).boss, null, null], t, { ring: 0 });
  const b = person(t);
  b.head = SOUTH + 0.55 + Math.sin(t * 1.6) * 0.08; // eyes on the board
  b.arms = 'shrug';
  b.sweat = true;
  b.scale = 2.4;
  drawPerson(ctx, looks(game).boss, b, 530, 284);
  bubble(ctx, ['😳'], 530, 214, e, 'speech', 1.3);
  youCheer(ctx, game, t, e, 680, 290);
}

// Win: Kev holds up the sign-off sheet with his own photo on it; the boss points at him. You cheer.
function sceneSheet(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, 64);
  bossPointing(ctx, game, t, 290, 288, 0);
  bubble(ctx, ['❗'], 290, 208, e, 'alert', 1.2);
  const k = person(t);
  k.head = SOUTH + 0.25;
  k.arms = 'box';
  k.sweat = true;
  k.scale = 2.4;
  drawPerson(ctx, looks(game).kev, k, 450, 290);
  bigSheet(ctx, looks(game).kev, 452, 300, t, Math.sin(t * 9) * 0.02, 0.85); // under his chin; his hands shake
  bubble(ctx, ['😳'], 450, 206, e, 'speech', 1.2);
  youCheer(ctx, game, t, e, 660, 290);
}

// Loss: your photo tops the roster and the boss points at you, Saturday's work piled beside you. Lin and Kev wave
// and go home; you stay.
function sceneFail(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, 64);
  drawBoard(ctx, 300, 322, 3.7, [looks(game).player, null, null], t, { ring: 0 });
  bossPointing(ctx, game, t, 440, 290, 0.12);
  // you, with a box of Saturday's work, and the rest of it piled beside you
  const p = person(t);
  p.head = SOUTH + 0.15;
  p.arms = 'box';
  p.sweat = true;
  p.scale = 2.4;
  drawPerson(ctx, looks(game).player, p, 560, 296);
  fillEllipse(ctx, 610, 330, 26, 5, 'rgba(0,0,0,0.18)');
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = i % 2 ? '#e9e4d6' : C.white;
    ctx.fillRect(590 + Math.sin(i * 1.7 + t * 0.5) * 1.5, 324 - i * 5, 40, 5);
  }
  bubble(ctx, ['😳'], 560, 208, e, 'speech', 1.2);
  // the others, off for the weekend
  const walk = clamp(e / 3, 0, 1);
  for (const [id, x0, y] of [['lin', 650, 262], ['kev', 700, 300]]) {
    const n = person(t);
    n.dir = 0.1;
    n.head = Math.PI - 0.6; // looking back over the shoulder
    n.pose = 'walk';
    n.moving = true;
    n.phase = t * 7 + x0;
    n.arms = 'walk';
    n.scale = 2;
    drawPerson(ctx, looks(game)[id], n, x0 + walk * 40, y);
    bubble(ctx, ['👋'], x0 + walk * 40, y - 64, e - 0.6);
  }
}

// Caught: the boss caught you at the board, pen in hand. Now your photo is on every Saturday.
function sceneCaught(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, 64);
  const me = looks(game).player;
  drawBoard(ctx, 330, 322, 4, [me, me, me], t, { big: true });
  const p = person(t);
  p.dir = SOUTH;
  p.head = SOUTH - 0.9 + Math.sin(t * 9) * 0.15; // a panicked look at the boss
  p.arms = 'reach';
  p.item = '🖊️';
  p.sweat = true;
  p.scale = 2.4;
  drawPerson(ctx, me, p, 480, 292);
  bossPointing(ctx, game, t, 640, 290, Math.PI, true);
  bubble(ctx, ['😠'], 640, 204, e, 'alert', 1.3);
}

// Blamed: you weren't there when the roster was read. They saw the change, crossed it out, and wrote you back
// in; everyone points at your empty chair.
function sceneBlamed(ctx, game, t, e, o) {
  const routes = Array.isArray(o?.routes) ? o.routes : [];
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, 64);
  const L = looks(game);
  drawBoard(ctx, 330, 322, 3.9, [routes.includes('roster') ? L.boss : L.kev, L.player, null], t, { cross: 0, ring: 1, big: true });
  bossPointing(ctx, game, t, 470, 286, 0.35, true);
  bubble(ctx, ['😠'], 470, 204, e, 'alert', 1.2);
  // your chair: empty, in a pool of light
  for (let i = 3; i >= 1; i--) fillEllipse(ctx, 580, 318, 24 + i * 13, 6 + i * 4, `rgba(255,240,200,${(0.08 * (4 - i)).toFixed(3)})`);
  ctx.save();
  ctx.translate(580, 304);
  ctx.scale(2.6, 2.6);
  drawChair(ctx, 0, 0, -Math.PI / 2, C.ochre, C.ochreDark);
  ctx.restore();
  const l = person(t);
  l.dir = Math.PI - 0.35;
  l.head = l.dir;
  l.arms = 'point';
  l.item = '👉';
  l.scale = 2.2;
  drawPerson(ctx, L.lin, l, 690, 280);
  bubble(ctx, ['❓'], 690, 210, e - 0.4);
}

function kindOf(o) {
  if (o?.result === 'win') return Array.isArray(o.routes) && o.routes.includes('roster') ? 'roster' : 'sheet';
  return o?.result === 'caught' || o?.result === 'blamed' ? o.result : 'fail';
}

export const END_SCENES = {
  kindOf,
  scenes: {
    roster: { win: true, icons: ['🗓️', '😳', '🎉'], draw: sceneRoster },
    sheet: { win: true, icons: ['📝', '👉', '🎉'], draw: sceneSheet },
    fail: { win: false, icons: ['🗓️', '👉', '😳'], draw: sceneFail },
    caught: { win: false, icons: ['🖊️', '😠', '🗓️'], draw: sceneCaught },
    blamed: { win: false, icons: ['🗓️', '👉', '🪑'], draw: sceneBlamed },
  },
};
