// The audit's end screens (src/render/screens.js reads this as level.endScenes; level 1's end-scenes.js documents
// the fields). Each picture is a small scene: who did what, and what it cost or won you. Desks keep the colours
// they have on the floor (presentation.js DECOR: the chair, the mug, the prop on the desk), so a desk reads as
// that person's.
import { clamp, easeOutCubic, emoji, rrect, fillCircle, fillEllipse, clockHands } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble, floorCarpet, floorTiles, backWall } from '../../render/tableau.js';

const WALL = 78; // back wall height in the pictures

// Each desk's owner colours, as on the floor: chair [seat, back], mug, the prop on the desk.
const DESKS = {
  player: { chair: ['#d6a23a', '#a97b22'], mug: C.tomato, prop: null },
  boss: { chair: ['#6b2f24', '#4e2019'], mug: C.navyLight, prop: 'lamp' },
  lin: { chair: ['#2f8f83', '#22675f'], mug: C.teal, prop: 'plant' },
  kev: { chair: ['#5f6b3a', '#47512a'], mug: C.olive, prop: 'earbuds' },
};

// Whose desk each of his four checks is, in order (index.js INSPECTIONS), and the world field it records.
const CHECKED = [['boss', 'atBoss'], ['lin', 'atLin'], ['player', 'atYou'], ['kev', 'atKev']];

function office(ctx) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  backWall(ctx, WALL);
}

// A desk seen from the front, its owner sitting (or not) behind it: (x, y) the top-left of the desk top, w wide.
// The owner's chair back shows behind it; on it, the owner's mug and prop, the back of the monitor, and the
// laptop, or the cable it was unplugged from.
function desk(ctx, x, y, w, owner, laptop, t) {
  const st = DESKS[owner];
  const d = 50; // depth of the top
  ctx.fillStyle = 'rgba(40,25,15,0.25)';
  rrect(ctx, x + 4, y + 8, w, d + 14, 8);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, x, y, w, d + 14, 8);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, x, y, w, d, 8);
  ctx.fill();
  ctx.fillStyle = C.walnutHi;
  ctx.fillRect(x + 8, y + 2, w - 16, 2);
  // the monitor, its back to us, on a stand
  const mx = x + w * 0.62;
  ctx.fillStyle = C.monitorDark;
  ctx.fillRect(mx - 4, y + 22, 8, 14);
  rrect(ctx, mx - 14, y + 34, 28, 6, 2);
  ctx.fill();
  ctx.fillStyle = C.monitor;
  rrect(ctx, mx - 30, y - 10, 60, 34, 4);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(mx - 26, y - 7, 52, 2);
  // mug, left
  const ux = x + 26;
  const uy = y + 24;
  ctx.fillStyle = st.mug;
  rrect(ctx, ux - 8, uy - 10, 16, 20, 3);
  ctx.fill();
  ctx.strokeStyle = st.mug;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(ux - 9, uy, 5, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  fillEllipse(ctx, ux, uy - 10, 8, 2.5, '#4a2e1a');
  // the prop, right
  const px = x + w - 24;
  if (st.prop === 'plant') {
    ctx.fillStyle = C.pot;
    rrect(ctx, px - 9, y + 18, 18, 18, 3);
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * 0.55 + Math.sin(t * 1.5 + i) * 0.04;
      ctx.save();
      ctx.translate(px, y + 18);
      ctx.rotate(a);
      fillEllipse(ctx, 10, 0, 10, 3.6, i % 2 ? C.plantA : C.plantB);
      ctx.restore();
    }
  } else if (st.prop === 'earbuds') {
    fillCircle(ctx, px, y + 26, 6, '#9aa45a');
    fillCircle(ctx, px, y + 26, 3, '#c8ccd0');
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px - 18, y + 40);
    ctx.bezierCurveTo(px - 6, y + 22, px + 4, y + 44, px + 12, y + 34);
    ctx.stroke();
  } else if (st.prop === 'lamp') {
    ctx.fillStyle = '#3b3430';
    ctx.fillRect(px - 1.5, y + 4, 3, 30);
    fillEllipse(ctx, px, y + 36, 9, 3, '#3b3430');
    ctx.fillStyle = C.ochre;
    ctx.beginPath();
    ctx.moveTo(px - 12, y + 10);
    ctx.lineTo(px + 12, y + 10);
    ctx.lineTo(px + 6, y - 4);
    ctx.lineTo(px - 6, y - 4);
    ctx.closePath();
    ctx.fill();
  }
  // the laptop, or the loose cable where it was
  const lx = x + w * 0.3;
  if (laptop) emoji(ctx, '💻', lx, y + 24, 32);
  else {
    ctx.strokeStyle = '#2b2622';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(mx - 20, y + 30);
    ctx.bezierCurveTo(mx - 40, y + 44, lx + 10, y + 20, lx, y + 34);
    ctx.stroke();
    ctx.fillStyle = '#2b2622';
    rrect(ctx, lx - 5, y + 32, 10, 6, 1.5);
    ctx.fill();
    ctx.fillStyle = '#c8ccd0';
    ctx.fillRect(lx - 3, y + 38, 2, 3);
    ctx.fillRect(lx + 1, y + 38, 2, 3);
  }
}

// The back of the owner's chair, behind the desk.
function chairBack(ctx, x, y, owner) {
  const [seat, back] = DESKS[owner].chair;
  ctx.fillStyle = back;
  rrect(ctx, x - 26, y, 52, 44, 12);
  ctx.fill();
  ctx.fillStyle = seat;
  rrect(ctx, x - 22, y + 4, 44, 36, 10);
  ctx.fill();
}

// The auditor's clipboard held up to us: one row per desk, a laptop and a tick on each row he has passed.
function clipboard(ctx, x, y, ticks, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(t * 1.6) * 0.03);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  rrect(ctx, -19, -23, 42, 54, 4);
  ctx.fill();
  ctx.fillStyle = '#9c6b38';
  rrect(ctx, -21, -26, 42, 54, 4);
  ctx.fill();
  ctx.fillStyle = C.white;
  ctx.fillRect(-17, -20, 34, 45);
  ctx.fillStyle = C.steel;
  rrect(ctx, -9, -29, 18, 8, 2);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    const ry = -13 + i * 11;
    emoji(ctx, '💻', -8, ry, 9);
    if (i < ticks) emoji(ctx, '✔️', 8, ry, 9);
    else {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(3, ry + 3, 10, 1.2);
    }
  }
  ctx.restore();
}

function auditor(game, t) {
  const a = person(t);
  a.badge = true;
  a.scale = 2.4;
  return a;
}

// --- Wins: he counted four. You smug at your desk, the auditor pleased with four ticks, and the laptop's owner
// in the act that let it run: smoking in the lobby, out with a coffee, carrying it back to his own desk.
function tableauWin(owner) {
  return (ctx, game, t, e) => {
    office(ctx);
    if (owner === 'boss') lobbySmoke(ctx, game, t);
    // you, behind your desk; the laptop is on it, unless Kev has carried his back
    chairBack(ctx, 300, 170, 'player');
    const p = person(t);
    p.pose = 'sit';
    p.arms = 'desk';
    p.smug = true;
    p.head = Math.PI / 2 - 0.5 + Math.sin(t * 1.4) * 0.12;
    p.scale = 2.3;
    drawPerson(ctx, game.level.looks.player, p, 300, 226 - Math.abs(Math.sin(t * 3)) * 2);
    desk(ctx, 214, 236, 190, 'player', owner !== 'kev', t);
    // the auditor, pleased: four ticks
    const a = auditor(game, t);
    a.dir = Math.PI / 2 + 0.25;
    a.head = Math.PI / 2 + 0.35;
    a.arms = 'desk';
    drawPerson(ctx, game.level.looks.auditor, a, 476, 290);
    clipboard(ctx, 486, 304, 4, t);
    bubble(ctx, ['😊'], 476, 196, e, 'speech', 1.4);
    if (owner === 'lin') walker(ctx, game, t, e, 'lin', '☕');
    if (owner === 'kev') walker(ctx, game, t, e, 'kev', '💻');
  };
}

// The boss in the lobby beyond the glass, smoking, his back to it all.
function lobbySmoke(ctx, game, t) {
  const gx = 604;
  floorTiles(ctx, gx, TAB.y, TAB.x + TAB.w - gx, TAB.h);
  const b = person(t);
  b.dir = -0.2;
  b.head = -0.5 + Math.sin(t * 0.8) * 0.15;
  b.arms = 'puff';
  b.item = '🚬';
  b.scale = 2.3;
  drawPerson(ctx, game.level.looks.boss, b, 696, 262);
  ctx.fillStyle = 'rgba(170,215,234,0.45)';
  ctx.fillRect(gx - 8, TAB.y, 16, TAB.h);
  ctx.fillStyle = C.glassEdge;
  ctx.fillRect(gx - 10, TAB.y, 3, TAB.h);
  ctx.fillRect(gx + 7, TAB.y, 3, TAB.h);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 3; i++) ctx.fillRect(gx - 4 + i * 3, TAB.y + 30 + i * 70, 2, 34);
}

// Lin with her coffee, or Kev with his laptop, walking off to the right, humming: none the wiser.
function walker(ctx, game, t, e, id, item) {
  const k = clamp(e / 3.2, 0, 1);
  const x = (id === 'kev' ? 560 : 590) + (id === 'kev' ? 70 : 100) * easeOutCubic(k);
  const walking = k < 0.98;
  if (id === 'kev') { // his desk at the edge of the picture, where it goes back: his chair, his mug, the loose cable
    chairBack(ctx, 742, 176, 'kev');
    desk(ctx, 690, 220, 150, 'kev', false, t);
  }
  const w = person(t);
  w.dir = walking ? 0.15 : Math.PI / 2 - 0.3;
  w.head = w.dir - 0.2;
  w.pose = walking ? 'walk' : 'stand';
  w.moving = walking;
  w.phase = t * 7;
  w.arms = 'mug';
  w.item = item;
  w.scale = 2.3;
  drawPerson(ctx, game.level.looks[id], w, x, 290);
  bubble(ctx, ['🎵'], x + 4, 206, e, 'speech', 1.3);
}

// --- Caught: you carry your desk in a box to the lift, and he points the way. What he found: a desk with no
// laptop (its owner's chair and mug, the cable hanging loose, his 💻❌ sign), or you with a laptop in your hands.
const LIFT = { x: 626, y: TAB.y, w: 100, h: 96 };

function tableauCaught(ctx, game, t, e) {
  office(ctx);
  drawLift(ctx, t);
  const why = game.caught?.reason ?? 'inspection';
  let ax = 300;
  if (why === 'inspection') {
    const w = game.world || {};
    const empty = CHECKED.find(([, rec]) => !w[rec])?.[0] ?? 'player';
    chairBack(ctx, 286, 170, empty);
    desk(ctx, 206, 214, 160, empty, false, t);
    bubble(ctx, ['💻', '❌'], 286, 180, e, 'sign', 1.5);
    ax = 420;
  } else {
    // seen with it: the laptop where it fell
    fillEllipse(ctx, 386, 318, 18, 5, 'rgba(0,0,0,0.2)');
    emoji(ctx, '💻', 386, 306, 34);
    bubble(ctx, ['💻', '❗'], ax + 10, 200, e, 'alert');
  }
  // the auditor, rooted to the spot, pointing the way out
  const a = auditor(game, t);
  a.dir = 0.08;
  a.head = 0.08 + Math.sin(t * 2.4) * 0.08;
  a.arms = 'point';
  a.item = '👉';
  a.angry = true;
  drawPerson(ctx, game.level.looks.auditor, a, ax + Math.max(0, Math.sin(t * 5)) * 3, 290);
  walkOfShame(ctx, game, t, e, why === 'inspection' ? 500 : 440);
}

// You, your desk in a box, walking from x0 to the open lift: slow, then a stop at the doors.
function walkOfShame(ctx, game, t, e, x0) {
  const walkK = clamp(e / 3.6, 0, 1);
  const px = x0 + (LIFT.x + LIFT.w / 2 - x0) * easeOutCubic(walkK);
  const walking = walkK < 0.98;
  const p = person(t);
  p.dir = walking ? 0.12 : -Math.PI / 2 + 0.25;
  p.head = walking ? 0.55 : -Math.PI / 2 + 0.6;
  p.pose = walking ? 'walk' : 'stand';
  p.moving = walking;
  p.phase = t * 7;
  p.arms = 'box';
  p.sweat = true;
  p.scale = 2.4;
  drawPerson(ctx, game.level.looks.player, p, px, 268);
}

// The lift set into the back wall, doors open, cab lit, the down arrow blinking (level 1's, a little lower).
function drawLift(ctx, t) {
  const { x, y, w, h } = LIFT;
  ctx.fillStyle = C.steelDark;
  ctx.fillRect(x - 6, y + 14, w + 12, h - 14);
  ctx.fillStyle = '#f2d9a2';
  ctx.fillRect(x, y + 20, w, h - 20);
  ctx.fillStyle = '#d9bc84';
  ctx.fillRect(x, y + h - 22, w, 22);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x + 8, y + 24, w - 16, 3);
  ctx.fillStyle = C.steel;
  ctx.fillRect(x, y + 20, 12, h - 20);
  ctx.fillRect(x + w - 12, y + 20, 12, h - 20);
  ctx.fillStyle = 'rgba(255,236,190,0.22)';
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w + 26, y + h + 44);
  ctx.lineTo(x - 26, y + h + 44);
  ctx.closePath();
  ctx.fill();
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

// --- Blamed: four ticks, and he came back to your desk to sign it off with you. Your chair stands empty in a pool
// of light behind your desk; he glares at it, list in hand, and you carry your desk in a box to the lift.
function tableauBlamed(ctx, game, t, e, o) {
  office(ctx);
  drawLift(ctx, t);
  const kev = Array.isArray(o?.routes) && o.routes[0] === 'kev';
  ctx.fillStyle = 'rgba(255,240,200,0.28)'; // a pool of light on the empty chair
  ctx.beginPath();
  ctx.moveTo(272, TAB.y + WALL);
  ctx.lineTo(328, TAB.y + WALL);
  ctx.lineTo(352, 236);
  ctx.lineTo(248, 236);
  ctx.closePath();
  ctx.fill();
  chairBack(ctx, 300, 176, 'player');
  desk(ctx, 214, 226, 190, 'player', !kev, t);
  const a = auditor(game, t);
  a.dir = Math.PI - 0.15;
  a.head = Math.PI - 0.35 + Math.sin(t * 1.3) * 0.08; // at your empty chair
  a.arms = 'desk';
  a.angry = true;
  drawPerson(ctx, game.level.looks.auditor, a, 446, 290);
  clipboard(ctx, 432, 304, 4, t);
  bubble(ctx, ['🪑', '😠'], 446, 196, e, 'speech', 1.3);
  walkOfShame(ctx, game, t, e, 520);
}

// --- Fail (the sign-off came before he finished): the clock on the wall past the time, his list half ticked.
function tableauFail(ctx, game, t, e, o) {
  office(ctx);
  const cx = 480;
  const cy = TAB.y + 38;
  fillCircle(ctx, cx, cy, 26, C.ink);
  fillCircle(ctx, cx, cy, 23, C.cream);
  clockHands(ctx, cx, cy, o?.minute ?? game.clock?.minute ?? 47, 12, 3, 18, 2, C.tomato, game.level.day.start);
  chairBack(ctx, 330, 170, 'player');
  const p = person(t);
  p.pose = 'sit';
  p.arms = 'desk';
  p.sweat = true;
  p.head = Math.PI / 2 + Math.sin(t * 2.4) * 0.4;
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, 330, 226);
  desk(ctx, 244, 236, 190, 'player', false, t);
  const a = auditor(game, t);
  a.dir = Math.PI / 2 + 0.3;
  a.head = -Math.PI / 2 - 0.4; // up at the clock
  a.arms = 'desk';
  drawPerson(ctx, game.level.looks.auditor, a, 600, 290);
  const w = game.world || {};
  clipboard(ctx, 612, 304, CHECKED.filter(([, rec]) => w[rec]).length, t);
  bubble(ctx, ['❓'], 600, 196, e, 'thought', 1.4);
}

export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? o.routes[0] : o?.result ?? 'fail'),
  scenes: {
    // icon rows: what let the laptop run, the laptop, his two ticks for it
    boss: { win: true, icons: ['🚬', '💻', '✔️', '✔️'], draw: tableauWin('boss') },
    lin: { win: true, icons: ['☕', '💻', '✔️', '✔️'], draw: tableauWin('lin') },
    kev: { win: true, icons: ['💻', '✔️', '✔️', '🎵'], draw: tableauWin('kev') },
    fail: { win: false, icons: ['📋', '❓'], draw: tableauFail },
    caught: { win: false, icons: ['💻', '👉', '📦'], draw: tableauCaught }, // what he saw, he points, your box
    blamed: { win: false, icons: ['🪑', '😠', '📦'], draw: tableauBlamed }, // your empty chair at the sign-off, he glares, your box
  },
};
