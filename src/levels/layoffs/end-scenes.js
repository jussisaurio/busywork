// The Layoff List's end cards (src/levels/meeting/end-scenes.js documents the fields). Each one is the boss's
// desk at 3:45: the list on his screen (list.js drawList: a column of faces, yours in red) and what became of it.
//   ring, phone  the boss, his coffee beside his keyboard, sends it without you; you sit smug at your desk (the
//                icons name how Lin was looking away: Kev's ringing desk, or her mobile)
//   fail         the boss clicks send with you on it; you carry your plant out in a box, past your empty desk
//   caught       the boss points you out; you carry your box out
import { clamp, easeOutCubic, rrect, fillEllipse } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { TAB, person, bubble, floorCarpet, backWall } from '../../render/tableau.js';
import { drawList } from './list.js';

const B_ANGRY = ['😠'];
const MUSTARD = [C.ochre, C.ochreDark];
const OXBLOOD = ['#6b2f24', '#4e2019'];

const yourLook = (game) => game.level.looks.player;

// --- set pieces ----------------------------------------------------------------------------------------------

function office(ctx) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  backWall(ctx, 78);
}

// A walnut desk top, front edge showing: (x, y) its top-left, w x h the top.
function desk(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, x + 6, y + 8, w, h + 10, 6);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, x, y, w, h + 10, 6);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.fillStyle = C.walnutHi;
  ctx.fillRect(x + 8, y + 3, w - 16, 2);
}

function keyboard(ctx, x, y, w) {
  ctx.fillStyle = '#d8d4cb';
  rrect(ctx, x, y, w, 10, 2);
  ctx.fill();
  ctx.fillStyle = '#a9a49a';
  for (let r = 0; r < 2; r++) for (let k = 0; k < Math.floor((w - 6) / 6); k++) ctx.fillRect(x + 3 + k * 6, y + 2 + r * 4, 4, 2);
}

// His screen, facing out: bezel, stand, and the list on it (drawList's options: you, t).
const SCREEN = { x: 248, y: 124, w: 124, h: 100 };
function bossScreen(ctx, game, o) {
  const { x, y, w, h } = SCREEN;
  ctx.fillStyle = '#2b2826';
  ctx.beginPath(); // the stand
  ctx.moveTo(x + w / 2 - 8, y + h + 4);
  ctx.lineTo(x + w / 2 + 8, y + h + 4);
  ctx.lineTo(x + w / 2 + 14, y + h + 18);
  ctx.lineTo(x + w / 2 - 14, y + h + 18);
  ctx.closePath();
  ctx.fill();
  rrect(ctx, x - 7, y - 7, w + 14, h + 14, 7);
  ctx.fill();
  drawList(ctx, x, y, w, h, game.level.looks, o);
  ctx.fillStyle = 'rgba(255,255,255,0.14)'; // glare
  ctx.beginPath();
  ctx.moveTo(x + w - 34, y);
  ctx.lineTo(x + w - 18, y);
  ctx.lineTo(x + w - 46, y + h);
  ctx.lineTo(x + w - 62, y + h);
  ctx.closePath();
  ctx.fill();
}

// The boss's desk with his screen on it and his keyboard at the right end, where whoever is typing sits.
function bossDesk(ctx, game, o) {
  desk(ctx, 214, 236, 248, 30);
  bossScreen(ctx, game, o);
  keyboard(ctx, 396, 244, 50);
}

// The list leaving: a copy of it flies off his screen to the top right, one copy after another.
const SHEET = { you: 1, t: 0 };
function sendList(ctx, game, e, you, delay = 0.9) {
  if (e < delay) return;
  const k = (e - delay) % 1.5; // one sheet after another, no gap: a still at any moment shows one in flight
  const f = k / 1.5;
  const x = SCREEN.x + SCREEN.w - 10 + easeOutCubic(f) * 320;
  const y = SCREEN.y + 16 - f * 30 - Math.sin(f * Math.PI) * 24; // over everyone's heads
  const s = 1 - f * 0.45;
  ctx.save();
  ctx.globalAlpha = clamp((1 - f) * 4, 0, 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; // speed lines
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 26 - i * 4, y - 8 + i * 10);
    ctx.lineTo(x - 48 - i * 10, y - 4 + i * 12);
    ctx.stroke();
  }
  ctx.translate(x, y);
  ctx.rotate(0.35 * f - 0.15);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(-19, -23, 42, 52);
  SHEET.you = you;
  SHEET.t = e;
  drawList(ctx, -22, -27, 42, 52, game.level.looks, SHEET);
  ctx.restore();
}

// Your own desk and mustard chair, small, off to the right: (x, y) the chair.
function yourDesk(ctx, x, y) {
  desk(ctx, x - 44, y - 36, 88, 18);
  ctx.fillStyle = '#3d3a3a'; // your screen, back to us
  rrect(ctx, x - 15, y - 58, 30, 22, 3);
  ctx.fill();
}

function chair(ctx, x, y, color, dir = -Math.PI / 2, scale = 2.4) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawChair(ctx, 0, 0, dir, color[0], color[1]);
  ctx.restore();
}

// The boss at his keyboard, seated at the right end of his desk, turned to the screen (or, glaring, his head
// turned to your chair).
function bossTyping(ctx, game, t, angry, glare = false) {
  chair(ctx, 478, 262, OXBLOOD, Math.PI);
  const b = person(t);
  b.dir = Math.PI - 0.45;
  b.head = glare ? 0.35 : Math.PI - 0.35;
  b.pose = 'sit';
  b.arms = 'type';
  b.angry = !!angry;
  b.scale = 2.4;
  drawPerson(ctx, game.level.looks.boss, b, 478, 262);
}

// You walking out to the right with your desk in a box (a plant in it), eyes down.
function walkOut(ctx, game, t, e, look, x0, x1) {
  const k = clamp(e / 4, 0, 1);
  const walking = k < 0.98;
  const p = person(t);
  p.dir = walking ? 0.15 : Math.PI / 2;
  p.head = walking ? 0.7 : Math.PI / 2 + 0.6;
  p.pose = walking ? 'walk' : 'stand';
  p.moving = walking;
  p.phase = t * 7;
  p.arms = 'box';
  p.sweat = true;
  p.scale = 2.4;
  drawPerson(ctx, look, p, x0 + (x1 - x0) * easeOutCubic(k), 302);
}

// --- the scenes ----------------------------------------------------------------------------------------------

// The coffee he went for, by his keyboard: a white mug, steaming.
function mug(ctx, x, y, t) {
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  fillEllipse(ctx, x + 2, y + 15, 11, 3.5, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = '#f2efe8';
  rrect(ctx, x - 9, y - 4, 18, 19, 3);
  ctx.fill();
  ctx.strokeStyle = '#f2efe8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x + 10, y + 5, 5, -1.2, 1.2);
  ctx.stroke();
  fillEllipse(ctx, x, y - 3, 8, 2.5, '#4a2e1a');
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; // steam
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    const sx = x - 3 + i * 6;
    ctx.moveTo(sx, y - 8);
    ctx.quadraticCurveTo(sx + 4 * Math.sin(t * 2 + i), y - 16, sx, y - 24);
    ctx.stroke();
  }
}

// Your face came off while he got his coffee: he sends it without you, cup by his keyboard; you sit smug at your
// desk.
function tableauWin(ctx, game, t, e) {
  office(ctx);
  bossDesk(ctx, game, { you: 0, t });
  mug(ctx, 372, 238, t);
  bossTyping(ctx, game, t, false);
  yourDesk(ctx, 680, 296);
  chair(ctx, 680, 296, MUSTARD);
  smugAtDesk(ctx, game, t, 680, 296);
  sendList(ctx, game, e, 0);
}

// You at your desk, eyeing the boss, smug.
function smugAtDesk(ctx, game, t, x, y) {
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = Math.PI / 2 + 0.5 + Math.sin(t * 1.3) * 0.15; // eyeing the boss
  p.pose = 'sit';
  p.arms = 'desk';
  p.smug = true;
  p.scale = 2.2;
  drawPerson(ctx, yourLook(game), p, x, y);
}

// He clicks send with you on it. You're already on your way out, plant in your box, past your empty desk.
function tableauFail(ctx, game, t, e) {
  office(ctx);
  bossDesk(ctx, game, { you: 1, t });
  bossTyping(ctx, game, t, false);
  yourDesk(ctx, 650, 262);
  chair(ctx, 650, 262, MUSTARD);
  walkOut(ctx, game, t, e, yourLook(game), 540, 716);
  sendList(ctx, game, e, 1);
}

// Caught at it: the boss on his feet, pointing the way out; you go, box in hand.
function tableauCaught(ctx, game, t, e) {
  office(ctx);
  bossDesk(ctx, game, { you: 1, t });
  chair(ctx, 478, 262, OXBLOOD, Math.PI);
  const b = person(t);
  b.dir = 0.1;
  b.head = 0.1 + Math.sin(t * 2.4) * 0.08;
  b.arms = 'point'; // the arm itself points: nothing in his hand
  b.angry = true;
  b.scale = 2.5;
  const jab = Math.max(0, Math.sin(t * 5)) * 3;
  drawPerson(ctx, game.level.looks.boss, b, 440 + jab, 304);
  bubble(ctx, B_ANGRY, 440, 216, e, 'alert');
  walkOut(ctx, game, t, e, yourLook(game), 560, 716);
}

export const END_SCENES = {
  kindOf: (o) => {
    if (o?.result === 'win') return Array.isArray(o.routes) && o.routes.includes('ring') ? 'ring' : 'phone';
    return o?.result === 'caught' ? 'caught' : 'fail';
  },
  scenes: {
    ring: { win: true, icons: ['☎️', '📧', '😏'], draw: tableauWin }, // Lin turned to Kev's ringing desk
    phone: { win: true, icons: ['📱', '📧', '😏'], draw: tableauWin }, // Lin turned away to her mobile
    fail: { win: false, icons: ['📧', '📦', '😢'], draw: tableauFail },
    caught: { win: false, icons: ['😠', '👉', '📦'], draw: tableauCaught },
  },
};
