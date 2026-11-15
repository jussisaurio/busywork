// The Interview's end cards: a drawn scene per outcome (contract: src/levels/meeting/end-scenes.js). Each shows what
// happened to the 3:30 call and what it means for you; the icon row under it retells the picture left to right.
// The phones are the level's own (painters.js): ivory rotary bodies, handsets in the line's colour, curly cords,
// the hold tune as drawn notes. A desk says whose it is the way it does in the office: Lin's has her teal chair, her
// plant, her teal mug and her nameplate; yours has the mustard chair, your red mug and your nameplate.
import { clamp, easeOutBack, rrect, fillCircle, fillEllipse, emoji } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { TAB, person, bubble, floorCarpet, floorTiles, backWall } from '../../render/tableau.js';
import { handset, curlyCord, briefcase, wallPhone, mainsPlug, cable, notesFrom, bigMug, glow } from './painters.js';
import { PHONES, OUTSIDE } from './phones.js';

const IVORY = '#e8dfc8';
const IVORY_DARK = '#b5a888';
const IVORY_SHADE = '#d2c6a8';
const WOOD = '#7a4a2a';
const WOOD_DARK = '#4e2e1a';
const WOOD_TOP = '#93603a';
const CARD = '#c9a26b';
const CARD_DARK = '#9c7745';
const BRASS = '#c9a24a';
const WALL_Y = 196; // the back wall's foot
const TEAL_CHAIR = [C.teal, C.tealDark];
const MUSTARD_CHAIR = ['#d6a23a', '#a97b22'];
const OXBLOOD_CHAIR = ['#6b2f24', '#4e2019'];
const OLIVE_CHAIR = [C.olive, C.oliveDark];

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

// An office chair seen from the front (its seat toward us), scale s, centred at (x, y).
function chair(ctx, x, y, colours, s = 2.6, dir = Math.PI / 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  drawChair(ctx, 0, 0, dir, colours[0], colours[1]);
  ctx.restore();
}

// A potted plant standing at (x, y), scale s.
function plant(ctx, x, y, s, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.6 + Math.sin(t * 2 + i) * 0.06;
    fillEllipse(ctx, Math.cos(a) * 4.5, -9 + Math.sin(a) * 4, 2.6, 1.7, i % 2 ? '#4fa35b' : '#3f8f4a');
  }
  ctx.fillStyle = '#b85c38';
  ctx.beginPath();
  ctx.moveTo(-4, -6);
  ctx.lineTo(4, -6);
  ctx.lineTo(3, 0);
  ctx.lineTo(-3, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9a4a2c';
  ctx.fillRect(-4.5, -7, 9, 1.6);
  ctx.restore();
}

// A desk nameplate standing at (x, y): a dark block with a brass foot and the owner's face.
function nameplate(ctx, x, y, face, s = 1) {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, x - 6.5 * s, y - 8.5 * s, 14 * s, 9 * s, 1.5 * s);
  ctx.fill();
  ctx.fillStyle = '#2d2a26';
  rrect(ctx, x - 7 * s, y - 9 * s, 14 * s, 9 * s, 1.5 * s);
  ctx.fill();
  ctx.fillStyle = BRASS;
  ctx.fillRect(x - 7 * s, y - 1.4 * s, 14 * s, 1.4 * s);
  emoji(ctx, face, x, y - 5 * s, 7.5 * s);
}

// Lin's things on her desk top (top slab at y): her plant at px, her teal mug at mx, her nameplate at nx.
function linsThings(ctx, y, t, s, { px, mx, nx }) {
  if (px != null) plant(ctx, px, y + 3 * s, s * 1.15, t);
  if (mx != null) bigMug(ctx, mx, y - 1 * s, C.teal, s, t);
  if (nx != null) nameplate(ctx, nx, y + 4 * s, '@lin', s);
}

// A desk phone, scale s, centred at (x, y). opts: ring (glow colour), lifted (no handset on the cradle).
function phone(ctx, x, y, s, colour, t, { ring = null, lifted = false } = {}) {
  ctx.save();
  if (ring) {
    glow(ctx, x, y, 30 * s, ring, 0.45 + 0.25 * Math.sin(t * 14));
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

// The handset a person holds to the ear, drawn over drawPerson's 'phone' arm (which draws a mobile), on a curly
// cord down to (cx, cy). Feet at (px, py); works for any facing (s.dir). Returns the ear, where the notes start.
const EAR = { x: 0, y: 0 };
function heldHandset(ctx, look, s, px, py, colour, cx, cy) {
  const sc = s.scale || 1;
  const bodyY = s.pose === 'sit' ? 1 : -2;
  const headY = bodyY - 10 * (look.tall || 1) - (s.smug ? 1.2 : 0);
  const k = look.head + 0.8;
  const ex = px + sc * -Math.sin(s.dir) * k;
  const ey = py + sc * (headY + 1 + Math.cos(s.dir) * 0.6 * k);
  if (cx != null) curlyCord(ctx, ex + 1.5 * sc, ey + 8 * sc, cx, cy, colour);
  ctx.save();
  ctx.translate(ex, ey);
  ctx.scale(sc, sc);
  ctx.rotate(Math.PI / 2 - 0.25);
  handset(ctx, 0, 0, colour, 17);
  ctx.restore();
  fillCircle(ctx, ex + 0.5 * sc, ey + 1 * sc, 2.3 * sc, look.skin);
  EAR.x = ex;
  EAR.y = ey;
  return EAR;
}

// The hold tune: notes in the line's colour out of the handset at an ear.
const notes = (ctx, ear, colour, t, k = 2) => notesFrom(ctx, ear.x + 2, ear.y - 6, colour, t, k);

// A cardboard box held at the belly of a person facing the viewer (feet at x, y, scale sc), your plant in its corner.
function box(ctx, x, y, sc, t) {
  const L = (v) => v * sc;
  const top = y + L(-2);
  plant(ctx, x + L(10), top + L(2), sc, t);
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

// Lin's double wall socket, low on the back wall at (x, y), scale s: her phone's plug goes in the top outlet.
function socket(ctx, x, y, s) {
  ctx.fillStyle = IVORY_DARK;
  rrect(ctx, x - 6.5 * s, y - 12.5 * s, 13 * s, 25 * s, 2 * s);
  ctx.fill();
  ctx.fillStyle = '#f2ece0';
  rrect(ctx, x - 6 * s, y - 12 * s, 12 * s, 24 * s, 2 * s);
  ctx.fill();
  for (const oy of [-5.5, 5.5]) {
    fillCircle(ctx, x - 2 * s, y + oy * s, 1.1 * s, '#3b3430');
    fillCircle(ctx, x + 2 * s, y + oy * s, 1.1 * s, '#3b3430');
  }
}

// A mains plug at (x, y), scale s, prongs toward dir; bare: out of the wall, its brass prongs showing.
function plugAt(ctx, x, y, s, dir, bare) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  mainsPlug(ctx, 0, 0, dir, bare);
  ctx.restore();
}

// A bright window in the back wall, x0..x1, y0..y1: sky, the sun, the city.
function view(ctx, x0, y0, x1, y1) {
  const w = x1 - x0;
  const h = y1 - y0;
  ctx.fillStyle = 'rgba(255,246,214,0.18)';
  ctx.beginPath();
  ctx.moveTo(x0, WALL_Y);
  ctx.lineTo(x1, WALL_Y);
  ctx.lineTo(x1 + 30, TAB.y + TAB.h);
  ctx.lineTo(x0 - 20, TAB.y + TAB.h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e9e4da';
  rrect(ctx, x0 - 5, y0 - 4, w + 10, h + 8, 3);
  ctx.fill();
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, '#8fcdf2');
  g.addColorStop(1, '#e4f5ff');
  ctx.fillStyle = g;
  ctx.fillRect(x0, y0, w, h);
  glow(ctx, x0 + w * 0.2, y0 + h * 0.25, h * 0.55, '#fffbe0', 0.7);
  fillCircle(ctx, x0 + w * 0.2, y0 + h * 0.25, h * 0.12, 'rgba(255,253,230,0.95)');
  fillEllipse(ctx, x0 + w * 0.65, y0 + h * 0.22, w * 0.09, h * 0.06, 'rgba(255,255,255,0.85)');
  fillEllipse(ctx, x0 + w * 0.7, y0 + h * 0.17, w * 0.06, h * 0.06, 'rgba(255,255,255,0.85)');
  ctx.fillStyle = '#7fa3bd';
  const towers = [[0.02, 0.35], [0.12, 0.5], [0.22, 0.3], [0.31, 0.6], [0.43, 0.38], [0.52, 0.48], [0.63, 0.26], [0.71, 0.55], [0.82, 0.4], [0.9, 0.62]];
  const tw = w * 0.08;
  for (const [dx, th] of towers) ctx.fillRect(x0 + dx * w, y1 - th * h, tw, th * h);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (const [dx, th] of towers) for (let r = y1 - th * h + 4; r < y1 - 3; r += 7) ctx.fillRect(x0 + dx * w + 2, r, tw - 4, 2);
  ctx.fillStyle = '#e9e4da';
  ctx.fillRect(x0 + w / 2 - 2, y0, 4, h);
  ctx.fillRect(x0, y0 + h * 0.45, w, 3);
  ctx.fillStyle = '#c9c1b2';
  ctx.fillRect(x0 - 7, y1 + 2, w + 14, 5);
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

// The kitchen's red wall phone (the outside line) at (x, y), scale s; held: its handset is off the hook.
const kitchenPhone = (ctx, x, y, s, held) => wallPhone(ctx, x, y, OUTSIDE, held ? {} : null, s);

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

// answered: the boss took Lin's ringing phone at her desk and is puzzled by the interviewer asking for her. Lin,
// back from a long wait at the kitchen phone (hung up behind her), comes in empty-handed and cross, too late.
function answered(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  kitchenSide(ctx, 590);
  clock(ctx, 470, 128, 15, 32);
  // the boss behind Lin's desk, her chair pushed aside, her receiver at his ear
  chair(ctx, 246, 250, TEAL_CHAIR, 2.4);
  const b = person(t);
  b.arms = 'phone';
  b.head = Math.PI / 2 + Math.sin(t * 1.8) * 0.2;
  b.scale = 2.3;
  drawPerson(ctx, looks(game).boss, b, 316, 252);
  desk(ctx, 330, 246, 230);
  linsThings(ctx, 246, t, 2, { px: 236, nx: 418 });
  phone(ctx, 370, 244, 2.1, PHONES.lin.lamp, t, { lifted: true });
  heldHandset(ctx, looks(game).boss, b, 316, 252, PHONES.lin.lamp, 356, 252);
  bubble(ctx, ['💼', '@lin', '❓'], 316, 160, e);
  // the kitchen phone back on its hook; Lin walking in from it, empty-handed
  kitchenPhone(ctx, 700, 150, 2.2, false);
  const l = person(t);
  l.dir = Math.PI - 0.25;
  l.head = l.dir;
  l.moving = true;
  l.phase = t * 9;
  l.arms = 'walk';
  l.angry = true;
  l.scale = 2.3;
  drawPerson(ctx, looks(game).lin, l, 650 - enter(e, 0.2) * 14, 268);
  smugYou(ctx, game, t, 480, 322);
}

// busy: the boss is on Lin's phone at her desk, happily on hold, and won't get off it; Lin, back for her call,
// fumes at him.
function busy(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  clock(ctx, 640, 130, 15, 31);
  chair(ctx, 436, 244, TEAL_CHAIR, 2.4);
  const b = person(t);
  b.arms = 'phone';
  b.smug = true;
  b.head = Math.PI / 2 + Math.sin(t * 1.1) * 0.25;
  b.scale = 2.3;
  const by = 252 - Math.abs(Math.sin(t * 2.2)) * 2;
  drawPerson(ctx, looks(game).boss, b, 350, by);
  desk(ctx, 390, 246, 220);
  linsThings(ctx, 246, t, 2, { px: 300, mx: 470, nx: 440 });
  phone(ctx, 400, 244, 2.1, PHONES.lin.lamp, t, { lifted: true });
  const ear = heldHandset(ctx, looks(game).boss, b, 350, by, PHONES.lin.lamp, 386, 252);
  notes(ctx, ear, PHONES.lin.lamp, t);
  // Lin beside her own desk: hands up at him
  const l = person(t);
  l.dir = Math.PI - 0.8;
  l.head = Math.PI - 0.5;
  l.arms = 'shrug';
  l.angry = true;
  l.scale = 2.3;
  drawPerson(ctx, looks(game).lin, l, 580, 286);
  bubble(ctx, ['💼', '🕞', '😠'], 580, 200, e);
  smugYou(ctx, game, t, 260, 322);
}

// unplugged: Lin at her desk at 3:31, staring at her silent phone; its cable lies coiled on the floor, its plug out
// of the wall.
function unplugged(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  clock(ctx, 340, 130, 17, 31);
  socket(ctx, 248, 176, 1.7);
  chair(ctx, 420, 250, TEAL_CHAIR, 2.6);
  const l = person(t);
  l.pose = 'sit';
  l.arms = 'desk';
  l.head = Math.PI / 2 + 0.35 + Math.sin(t * 0.7) * 0.1;
  l.scale = 2.3;
  drawPerson(ctx, looks(game).lin, l, 420, 248);
  desk(ctx, 440, 246, 230);
  linsThings(ctx, 246, t, 2, { px: 346, mx: 534, nx: 380 });
  // her cable: from the phone along the desk top, down its end, two coils on the floor, the plug lying loose
  cable(ctx, () => {
    ctx.moveTo(468, 250);
    ctx.lineTo(340, 251);
    ctx.quadraticCurveTo(330, 252, 330, 264);
    ctx.lineTo(330, 292);
    ctx.bezierCurveTo(330, 306, 324, 312, 318, 306);
    for (let i = 0; i < 2; i++) {
      const cx = 306 - i * 12;
      ctx.bezierCurveTo(cx + 14, cx === 306 ? 290 : 292, cx - 18, 290, cx - 16, 304);
      ctx.bezierCurveTo(cx - 14, 316, cx + 8, 316, cx - 2, 306);
    }
    ctx.bezierCurveTo(270, 300, 262, 306, 256, 304);
  }, 5.5);
  plugAt(ctx, 248, 302, 2, Math.PI - 0.3, true);
  phone(ctx, 488, 244, 2.1, PHONES.lin.lamp, t);
  bubble(ctx, ['🕞', '❓'], 420, 160, e, 'thought');
  smugYou(ctx, game, t, 650, 322);
}

// ringout: Lin's phone rings red on her empty desk and nobody comes. The boss is on hold at his window, his back to
// the room: he hears it (!) and stays with the tune. Lin is on hold at the kitchen phone. Kev types at his desk
// across the office, too far off to hear it.
function ringout(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  kitchenSide(ctx, 612);
  view(ctx, 214, 112, 322, 180);
  clock(ctx, 446, 126, 15, 31);
  // Kev, far off at his own desk, typing
  chair(ctx, 552, 214, OLIVE_CHAIR, 1.4);
  const k = person(t);
  k.pose = 'sit';
  k.arms = 'type';
  k.typing = true;
  k.head = Math.PI / 2 + 0.15;
  k.scale = 1.4;
  drawPerson(ctx, looks(game).kev, k, 552, 214);
  desk(ctx, 556, 220, 70, 22);
  // the boss, at his window, his back to the room: his desk phone on the desk at his side
  desk(ctx, 228, 268, 90, 40);
  phone(ctx, 246, 266, 2, PHONES.boss.lamp, t, { lifted: true });
  const b = person(t);
  b.dir = -Math.PI / 2;
  b.head = -Math.PI / 2 + 0.55;
  b.arms = 'phone';
  b.scale = 2.2;
  drawPerson(ctx, looks(game).boss, b, 282, 238);
  const ear = heldHandset(ctx, looks(game).boss, b, 282, 238, PHONES.boss.lamp, 236, 264);
  notes(ctx, ear, PHONES.boss.lamp, t);
  bubble(ctx, ['❗'], 282, 158, e);
  // Lin's empty desk, her phone ringing with the outside line
  chair(ctx, 446, 226, TEAL_CHAIR, 2.4);
  desk(ctx, 446, 236, 160);
  linsThings(ctx, 236, t, 2, { px: 386, mx: 510, nx: 410 });
  phone(ctx, 462, 234, 2.3, PHONES.lin.lamp, t, { ring: OUTSIDE });
  // Lin on hold at the kitchen's wall phone, her back half to us
  kitchenPhone(ctx, 716, 150, 2.2, true);
  const l = person(t);
  l.dir = -Math.PI / 2 + 0.5;
  l.head = l.dir + Math.sin(t * 0.8) * 0.15;
  l.arms = 'phone';
  l.scale = 2.2;
  drawPerson(ctx, looks(game).lin, l, 686, 252);
  const lear = heldHandset(ctx, looks(game).lin, l, 686, 252, OUTSIDE, 728, 164);
  notes(ctx, lear, OUTSIDE, t + 0.3);
  smugYou(ctx, game, t, 380, 328);
}

// fail: Lin got your job. She sits in your chair at your desk (your nameplate, your red mug), beaming into the
// phone; her own desk stands empty at the back. You stand beside her with your things in a cardboard box.
function fail(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  clock(ctx, 660, 128, 15, 34);
  // her old desk at the back, empty
  chair(ctx, 248, 204, TEAL_CHAIR, 1.3);
  desk(ctx, 252, 206, 80, 24);
  linsThings(ctx, 206, t, 1, { px: 222, mx: 282, nx: 252 });
  // your desk, with her in your chair
  chair(ctx, 400, 252, MUSTARD_CHAIR, 2.6);
  const l = person(t);
  l.pose = 'sit';
  l.arms = 'phone';
  l.smug = true;
  l.head = Math.PI / 2 + Math.sin(t * 2) * 0.2;
  l.scale = 2.3;
  const ly = 250 - Math.abs(Math.sin(t * 3)) * 1.5;
  drawPerson(ctx, looks(game).lin, l, 400, ly);
  desk(ctx, 415, 250, 250);
  phone(ctx, 458, 248, 2.1, PHONES.lin.lamp, t, { lifted: true });
  heldHandset(ctx, looks(game).lin, l, 400, ly, PHONES.lin.lamp, 444, 256);
  briefcase(ctx, 330, 250, 2.2);
  nameplate(ctx, 526, 262, '@player', 2);
  bigMug(ctx, 494, 238, C.tomato, 2.2, t);
  bubble(ctx, ['💼', '😊'], 400, 160, e);
  // you, beside the desk, holding the box
  const p = person(t);
  p.arms = 'desk';
  p.head = Math.PI / 2 + 0.5;
  p.sweat = true;
  p.scale = 2.3;
  const py = 298;
  drawPerson(ctx, looks(game).player, p, 630, py);
  box(ctx, 630, py, 2.3, t);
}

// The switchboard as on the map, big: cards (a band in each line's colour; the outside line a briefcase, the
// kitchen its red wall phone, the rest a face), lamps (dark ones still show their colour, dim), jacks, plugs resting
// below. `pulled` is the column whose plug is out on its cord (to plugTo), or -1.
const COLS = [OUTSIDE, PHONES.lin.lamp, PHONES.boss.lamp, PHONES.kev.lamp, OUTSIDE];
const CARDS = [null, '@lin', '@boss', '@kev', null];
function dim(hex, k) {
  const v = parseInt(hex.slice(1), 16);
  const ch = (s) => Math.round(((v >> s) & 255) * k + 20 * (1 - k));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}
function board(ctx, x0, y0, t, pulled = -1, plugTo = null) {
  const W = 190;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x0 + 6, y0 + 6, W, 118);
  ctx.fillStyle = WOOD_DARK;
  ctx.fillRect(x0, y0, W, 118);
  ctx.fillStyle = WOOD;
  ctx.fillRect(x0 + 6, y0 + 6, W - 12, 104);
  COLS.forEach((c, i) => {
    const x = x0 + 23 + i * 36;
    // card
    ctx.fillStyle = C.paper;
    rrect(ctx, x - 14, y0 + 12, 28, 28, 3);
    ctx.fill();
    ctx.fillStyle = c;
    rrect(ctx, x - 14, y0 + 12, 28, 6, 3);
    ctx.fill();
    ctx.fillRect(x - 14, y0 + 15, 28, 3);
    if (CARDS[i]) emoji(ctx, CARDS[i], x, y0 + 29, 18);
    else if (i === 0) briefcase(ctx, x, y0 + 30, 1.6);
    else wallPhone(ctx, x - 1, y0 + 29, OUTSIDE, null, 0.75);
    // lamp
    fillCircle(ctx, x, y0 + 52, 6.5, '#1b1410');
    fillCircle(ctx, x, y0 + 52, 5.5, BRASS);
    if (i === pulled) {
      glow(ctx, x, y0 + 52, 16, c, 0.85);
      fillCircle(ctx, x, y0 + 52, 4.4, c);
    } else fillCircle(ctx, x, y0 + 52, 4.4, dim(c, 0.42));
    // jack
    fillCircle(ctx, x, y0 + 72, 4, '#1b1410');
    fillCircle(ctx, x, y0 + 72, 1.6, BRASS);
    // plug at rest
    if (i !== pulled && i !== 0) {
      ctx.fillStyle = '#2b2420';
      rrect(ctx, x - 4, y0 + 92, 8, 11, 2);
      ctx.fill();
      ctx.fillStyle = c;
      ctx.fillRect(x - 4, y0 + 95, 8, 2.6);
      ctx.fillStyle = BRASS;
      ctx.fillRect(x - 1.2, y0 + 88, 2.4, 4);
    }
  });
  ctx.fillStyle = WOOD_TOP;
  ctx.fillRect(x0 - 4, y0 + 108, W + 8, 10);
  if (pulled >= 0 && plugTo) {
    const x = x0 + 23 + pulled * 36;
    ctx.strokeStyle = '#2b2420';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x, y0 + 110);
    ctx.bezierCurveTo(x + 30, y0 + 170, plugTo.x + 40, plugTo.y + 20, plugTo.x, plugTo.y + 6);
    ctx.stroke();
  }
}

// The patch plug in a hand at (x, y): brass tip up, a band in the line's colour.
function heldPlug(ctx, x, y, colour) {
  ctx.fillStyle = BRASS;
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
  const to = { x: 556, y: 300 };
  board(ctx, 500, 104, t, 2, to);
  const p = person(t);
  p.dir = Math.PI / 2 - 0.3;
  p.head = Math.PI / 2 + 0.9 + Math.sin(t * 9) * 0.04;
  p.arms = 'carry';
  p.sweat = true;
  p.scale = 2.3;
  drawPerson(ctx, looks(game).player, p, 560, 294);
  heldPlug(ctx, to.x, to.y, PHONES.boss.lamp);
  fillCircle(ctx, to.x, to.y + 4, 2.3 * 2.3, looks(game).player.skin);
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
  // Lin's desk and phone on the right; her socket on the wall, empty: the plug is in your hand, its cable to her
  // phone
  chair(ctx, 640, 262, TEAL_CHAIR, 2.4);
  desk(ctx, 650, 262, 190);
  linsThings(ctx, 262, t, 2, { px: 728, nx: 610 });
  phone(ctx, 676, 258, 2.1, PHONES.lin.lamp, t);
  socket(ctx, 470, 172, 1.6);
  const hx = 503;
  const hy = 232 + Math.sin(t * 9) * 0.8;
  cable(ctx, () => {
    ctx.moveTo(hx + 6, hy + 4);
    ctx.bezierCurveTo(hx + 30, hy + 70, 600, 318, 592, 290);
    ctx.bezierCurveTo(588, 276, 600, 266, 660, 264);
  }, 5.5);
  const p = person(t);
  p.dir = 0;
  p.head = Math.PI - 0.35 + Math.sin(t * 9) * 0.04;
  p.arms = 'point';
  p.sweat = true;
  p.scale = 2.3;
  drawPerson(ctx, looks(game).player, p, 470, 236);
  // the plug, prongs up, in your fist
  plugAt(ctx, hx, hy - 4, 2.2, -Math.PI / 2 - 0.4, true);
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
  chair(ctx, 560, 262, MUSTARD_CHAIR, 2.6);
  desk(ctx, 560, 262, 180);
  nameplate(ctx, 530, 278, '@player', 2);
  bigMug(ctx, 606, 254, C.tomato, 2.2, t);
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
    answered: { win: true, icons: ['@boss', '💼', '❓', '@lin', '😠'], draw: answered },
    busy: { win: true, icons: ['@boss', '🎵', '@lin', '😠'], draw: busy },
    unplugged: { win: true, icons: ['🔌', '@lin', '🕞', '❓'], draw: unplugged },
    ringout: { win: true, icons: ['@boss', '🎵', '🔔', '@lin', '🎵'], draw: ringout },
    fail: { win: false, icons: ['@lin', '💼', '😊', '📦'], draw: fail },
    caught: { win: false, icons: ['@boss', '👉', '@player'], draw: caught },
    blamed: { win: false, icons: ['@boss', '👉', '🪑'], draw: blamed },
  },
};
