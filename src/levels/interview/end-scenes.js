// The Interview's end cards: a drawn scene per outcome (contract: src/levels/meeting/end-scenes.js). Each shows what
// happened to the 3:30 call and what it means for you; the icon row under it retells the picture left to right.
// The phones are the level's own (painters.js): ivory rotary bodies, handsets in the owner's colour, curly cords.
import { clamp, easeOutBack, rrect, fillCircle, fillEllipse, emoji } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { TAB, person, bubble, floorCarpet, floorTiles, backWall } from '../../render/tableau.js';
import { handset, curlyCord, briefcase, mug } from './painters.js';
import { PHONES, OUTSIDE } from './phones.js';

const IVORY = '#e8dfc8';
const IVORY_DARK = '#b5a888';
const IVORY_SHADE = '#d2c6a8';
const WOOD = '#7a4a2a';
const WOOD_DARK = '#4e2e1a';
const WOOD_TOP = '#93603a';
const CARD = '#c9a26b';
const CARD_DARK = '#9c7745';
const WALL_Y = 196; // the back wall's foot

// --- Props ----------------------------------------------------------------------------------------

// A desk seen from the front: top slab at y, front panel below it.
function desk(ctx, cx, y, w, h = 46) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(cx - w / 2 + 6, y + h - 2, w, 8);
  ctx.fillStyle = WOOD;
  ctx.fillRect(cx - w / 2 + 4, y + 8, w - 8, h - 8);
  ctx.fillStyle = WOOD_DARK;
  ctx.fillRect(cx - w / 2 + 4, y + 8, w - 8, 3);
  ctx.fillStyle = WOOD_TOP;
  rrect(ctx, cx - w / 2, y, w, 10, 3);
  ctx.fill();
}

// A desk phone, scale s, centred at (x, y). opts: ring (glow colour), lifted (no handset on the cradle).
function phone(ctx, x, y, s, colour, t, { ring = null, lifted = false } = {}) {
  ctx.save();
  if (ring) {
    const g = ctx.createRadialGradient(x, y, 2, x, y, 30 * s);
    g.addColorStop(0, ring);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.45 + 0.25 * Math.sin(t * 14);
    ctx.fillStyle = g;
    ctx.fillRect(x - 30 * s, y - 30 * s, 60 * s, 60 * s);
    ctx.globalAlpha = 1;
    x += Math.sin(t * 55) * 1.2 * s;
  }
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, -9, -4, 18, 13, 4);
  ctx.fill();
  ctx.fillStyle = IVORY_SHADE;
  rrect(ctx, -9, -6, 18, 13, 4);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, -8, -7, 16, 10, 4);
  ctx.fill();
  ctx.strokeStyle = IVORY_DARK;
  ctx.lineWidth = 1;
  rrect(ctx, -9, -7, 18, 14, 4);
  ctx.stroke();
  fillCircle(ctx, 0, 1, 3.6, '#f7f1e2');
  for (let i = 0; i < 6; i++) {
    const a = -2.4 + i * 0.75;
    fillCircle(ctx, Math.cos(a) * 2.4, 1 + Math.sin(a) * 2.4, 0.55, '#6f6553');
  }
  if (lifted) {
    fillCircle(ctx, -6, -6, 1.6, IVORY_DARK);
    fillCircle(ctx, 6, -6, 1.6, IVORY_DARK);
  } else handset(ctx, 0, -6, colour);
  ctx.restore();
  if (ring) ringArcs(ctx, x, y - 3 * s, ring, t, 9 * s, s);
}

function ringArcs(ctx, x, y, colour, t, r0, s = 1) {
  const k = (t * 2.2) % 1;
  ctx.lineCap = 'round';
  for (let i = 0; i < 2; i++) {
    const r = r0 + (i + k) * 5 * s;
    ctx.globalAlpha = clamp(1 - (i + k) / 2, 0, 1);
    ctx.strokeStyle = colour;
    ctx.lineWidth = 2.2 * Math.min(1.6, s);
    for (const d of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(x, y, r, d > 0 ? -0.55 : Math.PI - 0.55, d > 0 ? 0.55 : Math.PI + 0.55);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.lineCap = 'butt';
}

// The kitchen wall phone on the back wall at (x, y), scale s; its handset hangs on the side unless lifted.
function wallPhone(ctx, x, y, s, lifted) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  rrect(ctx, -7, -9, 16, 22, 3);
  ctx.fill();
  ctx.fillStyle = IVORY;
  rrect(ctx, -8, -11, 16, 22, 3);
  ctx.fill();
  ctx.strokeStyle = IVORY_DARK;
  ctx.lineWidth = 1;
  rrect(ctx, -8, -11, 16, 22, 3);
  ctx.stroke();
  fillCircle(ctx, 0, 2, 4.2, '#f7f1e2');
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = -2.4 + i * 0.75;
    fillCircle(ctx, Math.cos(a) * 2.8, 2 + Math.sin(a) * 2.8, 0.6, '#6f6553');
  }
  fillCircle(ctx, 10, -6, 1.4, IVORY_DARK); // the hook
  if (!lifted) {
    ctx.save();
    ctx.translate(11, 0);
    ctx.rotate(Math.PI / 2);
    handset(ctx, 0, 0, PHONES.kitchen.lamp, 18);
    ctx.restore();
  }
  ctx.restore();
}

// The handset a person holds to his ear, drawn over drawPerson's 'phone' arm (which draws a mobile), on a curly cord
// down to (cx, cy). The person faces the viewer, feet at (px, py), scale s.
function heldHandset(ctx, look, s, px, py, colour, cx, cy) {
  const sc = s.scale || 1;
  const bodyY = s.pose === 'sit' ? 1 : -2;
  const headY = bodyY - 10 * (look.tall || 1) - (s.smug ? 1.2 : 0);
  const hr = look.head;
  const ex = px + sc * -(hr + 0.8);
  const ey = py + sc * (headY + 1);
  curlyCord(ctx, ex - 2 * sc, ey + 7 * sc, cx, cy, colour);
  ctx.save();
  ctx.translate(ex, ey);
  ctx.scale(sc, sc);
  ctx.rotate(Math.PI / 2 - 0.25);
  handset(ctx, 0, 0, colour, 17);
  ctx.restore();
  fillCircle(ctx, ex + 0.5 * sc, ey + 1 * sc, 2.3 * sc, look.skin);
}

// A cardboard box held at the belly of a person facing the viewer (feet at x, y, scale sc): your plant in its right
// corner and your desk nameplate, with your face, leaning out of its left one. Both stand clear of your face.
function box(ctx, x, y, sc, t) {
  const L = (v) => v * sc;
  const top = y + L(-2);
  // the plant
  ctx.fillStyle = '#b85c38';
  ctx.fillRect(x + L(9), top - L(4), L(6), L(5));
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.6 + Math.sin(t * 2 + i) * 0.06;
    fillEllipse(ctx, x + L(12) + Math.cos(a) * L(4.5), top - L(6) + Math.sin(a) * L(4), L(2.6), L(1.7), i % 2 ? '#4fa35b' : '#3f8f4a');
  }
  // the nameplate
  ctx.save();
  ctx.translate(x - L(12), top + L(1));
  ctx.rotate(-0.3);
  ctx.fillStyle = '#2d2a26';
  rrect(ctx, -L(5.5), -L(8), L(11), L(9), L(1.5));
  ctx.fill();
  emoji(ctx, '@player', 0, -L(3.6), L(7.5));
  ctx.restore();
  // the box
  const w = L(32);
  const h = L(13);
  ctx.fillStyle = CARD;
  ctx.fillRect(x - w / 2, top, w, h);
  ctx.fillStyle = CARD_DARK;
  ctx.fillRect(x - w / 2, top, w, L(2));
  ctx.fillRect(x - 1, top, 2, h * 0.45); // tape
  ctx.strokeStyle = CARD_DARK;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - w / 2, top, w, h);
}

// A round wall clock at (x, y), radius r, showing 3:mm.
function clock(ctx, x, y, r, mm) {
  fillCircle(ctx, x, y, r + 2, '#3b3430');
  fillCircle(ctx, x, y, r, '#fbf7ee');
  ctx.strokeStyle = '#3b3430';
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8);
    ctx.lineTo(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92);
    ctx.stroke();
  }
  const hand = (frac, len, wdt, col) => {
    const a = frac * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = col;
    ctx.lineWidth = wdt;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * r * len, y + Math.sin(a) * r * len);
    ctx.stroke();
  };
  hand((3 + mm / 60) / 12, 0.5, 2.4, '#3b3430');
  hand(mm / 60, 0.78, 1.6, '#3b3430');
  fillCircle(ctx, x, y, 1.6, '#e5432f');
  ctx.lineCap = 'butt';
}

// Lin's wall socket, low on the back wall at (x, y): an empty plate.
function socket(ctx, x, y, s) {
  ctx.fillStyle = '#f2ece0';
  rrect(ctx, x - 6 * s, y - 7 * s, 12 * s, 14 * s, 2 * s);
  ctx.fill();
  ctx.strokeStyle = '#9b9183';
  ctx.lineWidth = 1;
  ctx.stroke();
  fillCircle(ctx, x - 2 * s, y, 1.1 * s, '#3b3430');
  fillCircle(ctx, x + 2 * s, y, 1.1 * s, '#3b3430');
}

// Hold-music notes rising from (x, y).
function notes(ctx, x, y, t, s = 1) {
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.6 + i / 3) % 1;
    ctx.globalAlpha = Math.sin(k * Math.PI);
    emoji(ctx, i % 2 ? '🎶' : '🎵', x + Math.sin(k * 6 + i) * 8 * s + i * 6 * s, y - k * 40 * s, 13 * s);
  }
  ctx.globalAlpha = 1;
}

// A doorway into the kitchen: a wall stub with the kitchen's tiles beyond, from x to the right edge.
function kitchenSide(ctx, x) {
  floorTiles(ctx, x, TAB.y, TAB.x + TAB.w - x, TAB.h);
  ctx.fillStyle = '#e9e1d0';
  ctx.fillRect(x, TAB.y, TAB.x + TAB.w - x, WALL_Y - TAB.y);
  ctx.fillStyle = '#d6ccb8';
  ctx.fillRect(x, WALL_Y - 5, TAB.x + TAB.w - x, 5);
  ctx.fillStyle = C.wallFront;
  ctx.fillRect(x - 8, TAB.y, 12, TAB.h);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(x + 4, TAB.y, 4, TAB.h);
}

// Your red mug (top-left corner at x, y), the one on your desk in the office.
function yourMug(ctx, x, y) {
  ctx.fillStyle = C.tomato;
  rrect(ctx, x, y, 11, 13, 2);
  ctx.fill();
  ctx.strokeStyle = C.tomato;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(x + 12, y + 6.5, 3.6, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
}

const looks = (game) => game.level.looks;
const enter = (e, d = 0) => easeOutBack(clamp((e - d) / 0.35, 0, 1));

// You, smug, standing at the front: the payoff of every win.
function smugYou(ctx, game, t, x, y) {
  const p = person(t);
  p.smug = true;
  p.head = Math.PI / 2 + Math.sin(t * 1.3) * 0.15;
  p.arms = 'idle';
  p.scale = 2.3;
  drawPerson(ctx, looks(game).player, p, x, y - Math.abs(Math.sin(t * 3)) * 2);
}

// --- Scenes ---------------------------------------------------------------------------------------

// answered: Lin is stuck on hold at the kitchen wall phone; the boss picked up her ringing phone and is puzzled by
// the interviewer asking for her.
function answered(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  kitchenSide(ctx, 560);
  clock(ctx, 470, 128, 15, 31);
  // the boss behind Lin's desk with her receiver
  const b = person(t);
  b.arms = 'phone';
  b.head = Math.PI / 2 + Math.sin(t * 1.8) * 0.2;
  b.scale = 2.3;
  drawPerson(ctx, looks(game).boss, b, 300, 252);
  desk(ctx, 300, 246, 170);
  phone(ctx, 340, 244, 2.1, PHONES.lin.lamp, t, { lifted: true });
  heldHandset(ctx, looks(game).boss, b, 300, 252, PHONES.lin.lamp, 326, 252);
  bubble(ctx, ['💼', '@lin', '❓'], 300, 160, e);
  // Lin at the wall phone, on hold, her back half to us
  wallPhone(ctx, 690, 150, 2.2, true);
  const l = person(t);
  l.dir = Math.PI / 2 - 0.5;
  l.head = l.dir + Math.sin(t * 0.8) * 0.2;
  l.arms = 'phone';
  l.scale = 2.3;
  drawPerson(ctx, looks(game).lin, l, 650, 262);
  heldHandset(ctx, looks(game).lin, l, 650, 262, PHONES.kitchen.lamp, 700, 166);
  notes(ctx, 640, 200, t);
  smugYou(ctx, game, t, 470, 322);
}

// busy: the boss is on Lin's phone, happily on hold, and won't get off it; Lin, back at her desk, fumes at him.
function busy(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  clock(ctx, 640, 130, 15, 31);
  const b = person(t);
  b.arms = 'phone';
  b.smug = true;
  b.head = Math.PI / 2 + Math.sin(t * 1.1) * 0.25;
  b.scale = 2.3;
  drawPerson(ctx, looks(game).boss, b, 360, 252 - Math.abs(Math.sin(t * 2.2)) * 2);
  desk(ctx, 380, 246, 200);
  phone(ctx, 420, 244, 2.1, PHONES.lin.lamp, t, { lifted: true });
  heldHandset(ctx, looks(game).boss, b, 360, 252, PHONES.lin.lamp, 404, 252);
  notes(ctx, 340, 196, t);
  // Lin beside her own desk: hands up at him
  const l = person(t);
  l.dir = Math.PI - 0.8;
  l.head = Math.PI - 0.5;
  l.arms = 'shrug';
  l.angry = true;
  l.scale = 2.3;
  drawPerson(ctx, looks(game).lin, l, 560, 282);
  bubble(ctx, ['💼', '🕞', '😠'], 560, 196, e);
  smugYou(ctx, game, t, 280, 322);
}

// unplugged: Lin at her desk at 3:31 staring at her silent phone; its cord lies on the floor, out of the wall.
function unplugged(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  clock(ctx, 330, 130, 17, 31);
  const l = person(t);
  l.pose = 'sit';
  l.arms = 'desk';
  l.head = Math.PI / 2 + 0.35 + Math.sin(t * 0.7) * 0.1;
  l.scale = 2.3;
  socket(ctx, 262, 184, 1.6);
  drawPerson(ctx, looks(game).lin, l, 420, 248);
  desk(ctx, 430, 246, 190);
  // her cord: from the phone along the desk top, down its end, across the floor to the plug lying loose
  ctx.strokeStyle = '#2b2420';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(452, 250);
  ctx.lineTo(340, 251);
  ctx.quadraticCurveTo(332, 252, 332, 262);
  ctx.lineTo(332, 296);
  ctx.bezierCurveTo(332, 312, 300, 316, 296, 300);
  ctx.bezierCurveTo(293, 290, 280, 292, 272, 296);
  ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.save();
  ctx.translate(272, 296);
  ctx.rotate(0.3);
  ctx.fillStyle = '#2b2420';
  rrect(ctx, -14, -5, 14, 10, 2.5);
  ctx.fill();
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(-19, -3.5, 5, 2);
  ctx.fillRect(-19, 1.5, 5, 2);
  ctx.restore();
  phone(ctx, 470, 244, 2.1, PHONES.lin.lamp, t);
  bubble(ctx, ['🕞', '❓'], 420, 160, e, 'thought');
  smugYou(ctx, game, t, 640, 322);
}

// ringout: Lin's phone rings red on her empty desk; everyone who might answer it is on hold somewhere else.
function ringout(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  kitchenSide(ctx, 600);
  clock(ctx, 430, 128, 15, 31);
  // Lin's empty desk, her phone ringing with the outside line
  desk(ctx, 430, 236, 150);
  phone(ctx, 430, 234, 2.3, PHONES.lin.lamp, t, { ring: OUTSIDE });
  // the boss on his phone at the left, Kev on his at the right, Lin on the kitchen's
  const b = person(t);
  b.dir = Math.PI / 2 + 0.4;
  b.head = b.dir;
  b.arms = 'phone';
  b.scale = 2.1;
  drawPerson(ctx, looks(game).boss, b, 250, 262);
  heldHandset(ctx, looks(game).boss, b, 250, 262, PHONES.boss.lamp, 236, 300);
  notes(ctx, 240, 200, t, 0.9);
  const k = person(t);
  k.dir = Math.PI / 2 - 0.3;
  k.head = k.dir;
  k.arms = 'phone';
  k.scale = 2.1;
  drawPerson(ctx, looks(game).kev, k, 560, 286);
  heldHandset(ctx, looks(game).kev, k, 560, 286, PHONES.kev.lamp, 548, 326);
  notes(ctx, 552, 222, t + 0.4, 0.9);
  wallPhone(ctx, 712, 150, 2, true);
  const l = person(t);
  l.dir = Math.PI / 2 - 0.5;
  l.head = l.dir;
  l.arms = 'phone';
  l.scale = 2.1;
  drawPerson(ctx, looks(game).lin, l, 676, 258);
  heldHandset(ctx, looks(game).lin, l, 676, 258, PHONES.kitchen.lamp, 720, 166);
  notes(ctx, 668, 200, t + 0.8, 0.9);
  smugYou(ctx, game, t, 400, 326);
}

// fail: Lin got your job. She sits in your chair at your desk, beaming into the phone; you stand beside her with your
// things in a cardboard box.
function fail(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  clock(ctx, 640, 128, 15, 34);
  ctx.save();
  ctx.translate(380, 252);
  ctx.scale(2.6, 2.6);
  drawChair(ctx, 0, 0, Math.PI / 2, '#d8a548', '#a87a2c');
  ctx.restore();
  const l = person(t);
  l.pose = 'sit';
  l.arms = 'phone';
  l.smug = true;
  l.head = Math.PI / 2 + Math.sin(t * 2) * 0.2;
  l.scale = 2.3;
  drawPerson(ctx, looks(game).lin, l, 380, 250 - Math.abs(Math.sin(t * 3)) * 1.5);
  desk(ctx, 390, 250, 200);
  phone(ctx, 440, 248, 2.1, PHONES.lin.lamp, t, { lifted: true });
  heldHandset(ctx, looks(game).lin, l, 380, 250, PHONES.lin.lamp, 424, 256);
  briefcase(ctx, 330, 252);
  yourMug(ctx, 474, 236); // as on your desk in the office: it is your desk
  bubble(ctx, ['💼', '😊'], 380, 160, e);
  // you, beside the desk, holding the box
  const p = person(t);
  p.arms = 'desk';
  p.head = Math.PI / 2 + 0.5;
  p.sweat = true;
  p.scale = 2.3;
  const py = 298;
  drawPerson(ctx, looks(game).player, p, 610, py);
  box(ctx, 610, py, 2.3, t);
}

// The switchboard as on the map, big: face cards, lamps, jacks, plugs resting below. `pulled` is the column whose plug
// is out on its cord (to plugAt), or -1.
function board(ctx, x0, y0, t, pulled = -1, plugAt = null) {
  const cols = [OUTSIDE, PHONES.lin.lamp, PHONES.boss.lamp, PHONES.kev.lamp, PHONES.kitchen.lamp];
  const cards = [null, '@lin', '@boss', '@kev', null];
  const W = 190;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x0 + 6, y0 + 6, W, 118);
  ctx.fillStyle = WOOD_DARK;
  ctx.fillRect(x0, y0, W, 118);
  ctx.fillStyle = WOOD;
  ctx.fillRect(x0 + 6, y0 + 6, W - 12, 104);
  cols.forEach((c, i) => {
    const x = x0 + 23 + i * 36;
    // card
    ctx.fillStyle = '#f4ecd8';
    rrect(ctx, x - 14, y0 + 12, 28, 26, 3);
    ctx.fill();
    if (cards[i]) emoji(ctx, cards[i], x, y0 + 25, 20);
    else {
      ctx.save();
      ctx.translate(x, y0 + 26);
      ctx.scale(1.7, 1.7);
      (i === 0 ? briefcase : mug)(ctx, 0, 0);
      ctx.restore();
    }
    // lamp
    fillCircle(ctx, x, y0 + 50, 6, '#1b1410');
    fillCircle(ctx, x, y0 + 50, 4.5, i === pulled ? c : '#3b302a');
    // jack
    fillCircle(ctx, x, y0 + 72, 4, '#1b1410');
    fillCircle(ctx, x, y0 + 72, 1.6, '#c9a24a');
    // plug at rest
    if (i !== pulled && i !== 0) {
      ctx.fillStyle = '#2b2420';
      rrect(ctx, x - 4, y0 + 92, 8, 11, 2);
      ctx.fill();
      ctx.fillStyle = c;
      ctx.fillRect(x - 4, y0 + 95, 8, 2.6);
      ctx.fillStyle = '#c9a24a';
      ctx.fillRect(x - 1.2, y0 + 88, 2.4, 4);
    }
  });
  ctx.fillStyle = WOOD_TOP;
  ctx.fillRect(x0 - 4, y0 + 108, W + 8, 10);
  if (pulled >= 0 && plugAt) {
    const x = x0 + 23 + pulled * 36;
    ctx.strokeStyle = '#2b2420';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x, y0 + 110);
    ctx.bezierCurveTo(x + 30, y0 + 170, plugAt.x + 40, plugAt.y + 20, plugAt.x, plugAt.y + 6);
    ctx.stroke();
  }
}

// The plug in a hand at (x, y): brass tip up, a band in the phone's colour.
function heldPlug(ctx, x, y, colour) {
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(x - 1.5, y - 10, 3, 6);
  ctx.fillStyle = '#2b2420';
  rrect(ctx, x - 4.5, y - 5, 9, 12, 2);
  ctx.fill();
  ctx.fillStyle = colour;
  ctx.fillRect(x - 4.5, y - 2, 9, 2.6);
}

// caught: the boss saw you at it. He points; you freeze, a plug in your hand. Where you were decides the picture:
// at Lin's socket (the only place he can catch you in practice), or at the switchboard.
function caught(ctx, game, t, e) {
  const pl = game.player;
  const sock = game.level.map.rows[7].indexOf('O');
  if (pl && Math.hypot(pl.x - (sock + 0.5), pl.y - 7.5) < 3) return caughtAtSocket(ctx, game, t, e);
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  const plugAt = { x: 556, y: 300 };
  board(ctx, 500, 104, t, 2, plugAt);
  const p = person(t);
  p.dir = Math.PI / 2 - 0.3;
  p.head = Math.PI / 2 + 0.9 + Math.sin(t * 9) * 0.04;
  p.arms = 'carry';
  p.sweat = true;
  p.scale = 2.3;
  drawPerson(ctx, looks(game).player, p, 560, 294);
  heldPlug(ctx, plugAt.x, plugAt.y, PHONES.boss.lamp);
  fillCircle(ctx, plugAt.x, plugAt.y + 4, 2.3 * 2.3, looks(game).player.skin);
  const b = person(t);
  b.dir = 0;
  b.head = 0;
  b.arms = 'point';
  b.angry = true;
  b.scale = 2.4;
  drawPerson(ctx, looks(game).boss, b, 330 + (1 - enter(e)) * -80, 296);
  bubble(ctx, ['😠', '👉'], 330, 200, e);
}

function caughtAtSocket(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  // Lin's desk and phone on the right; her socket on the wall, empty: the plug is in your hand, its cord to her phone
  desk(ctx, 640, 262, 170);
  phone(ctx, 676, 258, 2.1, PHONES.lin.lamp, t);
  socket(ctx, 470, 180, 1.6);
  const hx = 503;
  const hy = 232 + Math.sin(t * 9) * 0.8;
  ctx.strokeStyle = '#2b2420';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hx + 10, hy);
  ctx.bezierCurveTo(hx + 40, hy + 30, 600, 290, 662, 262);
  ctx.stroke();
  ctx.lineCap = 'butt';
  const p = person(t);
  p.dir = 0;
  p.head = Math.PI - 0.35 + Math.sin(t * 9) * 0.04;
  p.arms = 'point';
  p.sweat = true;
  p.scale = 2.3;
  drawPerson(ctx, looks(game).player, p, 470, 236);
  // the plug, prongs up, in your fist
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(-0.5);
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(-4, -14, 2.5, 7);
  ctx.fillRect(1.5, -14, 2.5, 7);
  ctx.fillStyle = '#2b2420';
  rrect(ctx, -6, -8, 12, 15, 3);
  ctx.fill();
  ctx.restore();
  fillCircle(ctx, hx - 2, hy + 2, 2.3 * 2.3, looks(game).player.skin);
  const b = person(t);
  b.dir = 0;
  b.head = 0;
  b.arms = 'point';
  b.angry = true;
  b.scale = 2.4;
  drawPerson(ctx, looks(game).boss, b, 300 + (1 - enter(e)) * -80, 300);
  bubble(ctx, ['😠', '👉'], 300, 204, e);
}

// blamed: you got Lin off the phone, but you weren't at your desk during the call for your job. The boss points at
// your empty chair.
function blamed(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  clock(ctx, 470, 128, 15, 33);
  // your desk and empty chair in a pool of light
  ctx.save();
  ctx.globalAlpha = 0.25;
  fillEllipse(ctx, 560, 274, 90, 26, '#fff7d0');
  ctx.restore();
  ctx.save();
  ctx.translate(560, 262);
  ctx.scale(2.6, 2.6);
  drawChair(ctx, 0, 0, Math.PI / 2, '#d8a548', '#a87a2c');
  ctx.restore();
  desk(ctx, 560, 262, 180);
  yourMug(ctx, 600, 252);
  const b = person(t);
  b.dir = 0;
  b.head = 0;
  b.arms = 'point';
  b.angry = true;
  b.scale = 2.4;
  drawPerson(ctx, looks(game).boss, b, 330, 296);
  bubble(ctx, ['@player', '❓', '😠'], 330, 200, e);
  // you, too late, hurrying in at the far side
  const p = person(t);
  p.dir = Math.PI - 0.3;
  p.head = p.dir;
  p.moving = true;
  p.phase = t * 14;
  p.arms = 'walk';
  p.sweat = true;
  p.scale = 2.2;
  drawPerson(ctx, looks(game).player, p, 724 - enter(e, 0.3) * 20, 318);
}

export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? (Array.isArray(o.routes) && o.routes[0]) || 'fail' : o?.result ?? 'fail'),
  scenes: {
    answered: { win: true, icons: ['@lin', '🎵', '@boss', '💼', '❓'], draw: answered },
    busy: { win: true, icons: ['@boss', '🎵', '@lin', '😠'], draw: busy },
    unplugged: { win: true, icons: ['🔌', '@lin', '🕞', '❓'], draw: unplugged },
    ringout: { win: true, icons: ['🎵', '🎵', '🎵', '🔔'], draw: ringout },
    fail: { win: false, icons: ['@lin', '💼', '😊', '📦'], draw: fail },
    caught: { win: false, icons: ['@boss', '👉', '@player'], draw: caught },
    blamed: { win: false, icons: ['@boss', '👉', '🪑'], draw: blamed },
  },
};
