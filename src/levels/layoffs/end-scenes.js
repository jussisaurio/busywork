// The Layoff List's end cards (src/levels/meeting/end-scenes.js documents the fields). Each one is the boss's
// desk at 3:45: the list on his screen (list.js drawList: a column of faces, yours in red) and what became of it.
// Each shows the day as it ended (DESIGN.md "Tone / feel"): you as you are dressed at the end (yourLook).
//   hoodie     the boss sends it, pleased, without you; Kev's hoodie is back over his empty chair (Kev went home),
//              and you sit smug at your desk
//   jacket     the boss sends it himself, without you; you smug at your desk (in his jacket, if you kept it on)
//   fail       the boss clicks send with you on it; you carry your plant out in a box, past your empty desk
//   caught     the boss points you out; you carry your box out, still in your disguise
//   blamed     your chair is empty, so the boss puts you back on; it goes out with you
//   blamedKev  "Kev" sits at your desk in his hoodie: to the boss your chair is empty, so he puts you back on
import { clamp, easeOutCubic, rrect, fillEllipse } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair, PROP_PAINTERS } from '../../render/world.js';
import { TAB, person, bubble, floorCarpet, backWall } from '../../render/tableau.js';
import { drawList } from './list.js';
import { drapedHoodie } from './painters.js';

const B_HAPPY = ['😊'];
const B_ANGRY = ['😠'];
const KEV_Q = ['@kev', '❓'];
const MUSTARD = [C.ochre, C.ochreDark];
const OXBLOOD = ['#6b2f24', '#4e2019'];
const CHARCOAL = ['#4b5056', '#34383d']; // Kev's chair (presentation.js)

// You, as you look in what you're holding (a disguise is worn: play/disguise.js), or as yourself.
function yourLook(game) {
  const looks = game.level.looks;
  const d = game.player?.held ? game.level.items?.[game.player.held]?.disguise : null;
  return d ? { ...looks.player, ...d.look } : looks.player;
}

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

function coatRack(ctx, x, y, coat, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(2.4, 2.4);
  ctx.translate(-16, -16);
  PROP_PAINTERS.coatRack(ctx, null, { x: 0, y: 0 }, { coat, tag: false }, t);
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

// Kev's empty chair, his hoodie hung back over it (as on the map: presentation.js drawKevDesk).
function kevChair(ctx, x, y, hoodie, scale = 2.4) {
  chair(ctx, x, y, CHARCOAL, -Math.PI / 2, scale);
  if (!hoodie) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drapedHoodie(ctx, 0, 5);
  ctx.restore();
}

function poolOfLight(ctx, x, y) {
  for (let i = 3; i >= 1; i--) fillEllipse(ctx, x, y, 26 + i * 14, 7 + i * 4, `rgba(255,240,200,${(0.08 * (4 - i)).toFixed(3)})`);
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
  b.jacket = false; // his jacket lives on the rack
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

// "Kev" fixed it, and the boss sends the list without you, pleased. Kev went home: his hoodie hangs back over his
// empty chair, where you left it, and you sit at your desk, smug.
function tableauHoodie(ctx, game, t, e) {
  office(ctx);
  bossDesk(ctx, game, { you: 0, t });
  bossTyping(ctx, game, t, false);
  bubble(ctx, B_HAPPY, 478, 186, e);
  yourDesk(ctx, 584, 296);
  kevChair(ctx, 584, 296, game.world.hoodie === 'chair');
  yourDesk(ctx, 704, 296);
  chair(ctx, 704, 296, MUSTARD);
  smugAtDesk(ctx, game, t, 704, 296);
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

// The boss sends it himself, with your name gone. His jacket's back on its rack (unless you're still in it, at
// your desk, smug).
function tableauJacket(ctx, game, t, e) {
  office(ctx);
  const inIt = game.player?.held === 'jacket';
  coatRack(ctx, 590, 150, !inIt, t);
  bossDesk(ctx, game, { you: 0, t });
  bossTyping(ctx, game, t, false);
  yourDesk(ctx, 690, 296);
  chair(ctx, 690, 296, MUSTARD);
  smugAtDesk(ctx, game, t, 690, 296);
  sendList(ctx, game, e, 0);
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

// Caught at it: the boss on his feet, pointing the way out; you go, box in hand, still dressed as someone else.
function tableauCaught(ctx, game, t, e) {
  office(ctx);
  bossDesk(ctx, game, { you: 1, t });
  chair(ctx, 478, 262, OXBLOOD, Math.PI);
  const b = person(t);
  b.dir = 0.1;
  b.head = 0.1 + Math.sin(t * 2.4) * 0.08;
  b.arms = 'point'; // the arm itself points: nothing in his hand
  b.angry = true;
  b.jacket = false;
  b.scale = 2.5;
  const jab = Math.max(0, Math.sin(t * 5)) * 3;
  drawPerson(ctx, game.level.looks.boss, b, 440 + jab, 304);
  bubble(ctx, B_ANGRY, 440, 216, e, 'alert');
  walkOut(ctx, game, t, e, yourLook(game), 560, 716);
}

// Your chair is empty when he looks up to send it, so he puts you back on, and it goes out with you on it.
function tableauBlamed(ctx, game, t, e) {
  office(ctx);
  const back = easeOutCubic(clamp((e - 0.5) / 0.7, 0, 1));
  bossDesk(ctx, game, { you: back, t });
  bossTyping(ctx, game, t, true, true);
  bubble(ctx, B_ANGRY, 478, 186, e, 'alert');
  yourDesk(ctx, 670, 290);
  poolOfLight(ctx, 670, 308);
  chair(ctx, 670, 290, MUSTARD);
  sendList(ctx, game, e, 1, 1.6);
}

// Your name came off, but at 3:45 it's Kev, hood up, in your chair (you, in his hoodie): to the boss you're not
// at your desk, so he puts you back on, and it goes out with you.
function tableauBlamedKev(ctx, game, t, e) {
  office(ctx);
  const back = easeOutCubic(clamp((e - 0.9) / 0.7, 0, 1));
  bossDesk(ctx, game, { you: back, t });
  bossTyping(ctx, game, t, e > 0.9, true);
  if (e < 0.9) bubble(ctx, KEV_Q, 478, 186, e, 'thought'); // Kev? at your desk?
  else bubble(ctx, B_ANGRY, 478, 186, e - 0.9, 'alert');
  yourDesk(ctx, 670, 290);
  chair(ctx, 670, 290, MUSTARD);
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = Math.PI / 2 + 0.6;
  p.pose = 'sit';
  p.arms = 'desk';
  p.sweat = true;
  p.scale = 2.2;
  drawPerson(ctx, yourLook(game), p, 670, 290);
  sendList(ctx, game, e, 1, 2.0);
}

export const END_SCENES = {
  kindOf: (o) => {
    if (o?.result === 'win') return Array.isArray(o.routes) && o.routes.includes('hoodie') ? 'hoodie' : 'jacket';
    if (o?.result === 'blamed') return o.why === 'kev' ? 'blamedKev' : 'blamed';
    return o?.result === 'caught' ? 'caught' : 'fail';
  },
  scenes: {
    hoodie: { win: true, icons: ['@kev', '📧', '😏'], draw: tableauHoodie }, // as Kev (in his hoodie) it went out
    jacket: { win: true, icons: ['@boss', '📧', '😏'], draw: tableauJacket }, // as the boss (in his jacket) you fixed it
    fail: { win: false, icons: ['📧', '📦', '😢'], draw: tableauFail },
    caught: { win: false, icons: ['😠', '👉', '📦'], draw: tableauCaught },
    blamed: { win: false, icons: ['🪑', '😠', '📧'], draw: tableauBlamed }, // not at your desk: back on the list
    blamedKev: { win: false, icons: ['@kev', '🪑', '📧'], draw: tableauBlamedKev }, // "Kev" at your desk: back on it
  },
};
