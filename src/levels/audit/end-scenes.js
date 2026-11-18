// The audit's end screens (src/render/screens.js reads this as level.endScenes; level 1's end-scenes.js documents
// the fields). Each picture is a small scene: who did what, and what it cost or won you. Desks keep the colours
// they have on the floor (presentation.js DECOR: the chair, the mug, the prop on the desk), so a desk reads as
// that person's.
import { clamp, easeOutCubic, rrect, fillCircle, fillEllipse, clockHands } from '../../render/util.js';
import { C, OXBLOOD, MUSTARD, TEAL, OLIVE } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble, floorTiles } from '../../render/tableau.js';
import { officeRoom, walnutDesk, drawLift as drawLiftAt, walkWithBox } from '../../render/tableau-furniture.js';
import { tintOf } from '../../render/things.js';
import { drawLaptop, tick, crossMark } from './things.js';

const WALL = 78; // back wall height in the pictures

// Each desk's owner colours, as on the floor: chair [seat, back], mug, the prop on the desk.
const DESKS = {
  player: { chair: MUSTARD, mug: C.tomato, prop: null },
  boss: { chair: OXBLOOD, mug: C.navyLight, prop: 'lamp' },
  lin: { chair: TEAL, mug: C.teal, prop: 'plant' },
  kev: { chair: OLIVE, mug: C.olive, prop: 'earbuds' },
};

// His four checks in order (index.js INSPECTIONS): the world field each records. A desk he crossed is in
// world.crossed (cast.js auditGoesOn).
const RECORDS = ['atBoss', 'atLin', 'atYou', 'atKev'];
const marksOf = (w) => RECORDS.map((r, i) => (w?.crossed?.includes(i) ? 'cross' : w?.[r] ? 'tick' : null));

// The colour a laptop's lid is drawn in: its owner's (index.js ITEMS tint 'owner').
const lidOf = (game, owner) => tintOf(game, `laptop_${owner}`) ?? '#2a2e35';

const office = (ctx) => officeRoom(ctx, WALL);

// A desk seen from the front, its owner sitting (or not) behind it: (x, y) the top-left of the desk top, w wide.
// The owner's chair back shows behind it; on it, the owner's mug and prop, the back of the monitor, and a laptop
// (drawn: things.js) with its lid in `lid`, its owner's colour, or with no lid the cable it was unplugged from.
function desk(ctx, x, y, w, owner, lid, t) {
  const st = DESKS[owner];
  const d = 50; // depth of the top
  walnutDesk(ctx, x, y, w, { depth: d, skirt: d + 14, r: 8, shadow: { color: 'rgba(40,25,15,0.25)', dx: 4, h: d + 14 }, hi: 2 });
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
  if (lid) drawLaptop(ctx, lx, y + 40, 42, 0, lid);
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

// The auditor's clipboard held up to us: his list, one written row per desk, a box at the end of each, ticked
// or crossed in pen as he marked it (marks: 'tick', 'cross' or null per desk).
function clipboard(ctx, x, y, marks, t) {
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
    ctx.fillStyle = 'rgba(40,44,70,0.55)';
    ctx.fillRect(-13, ry - 1, 12 - (i % 2) * 3, 2);
    ctx.strokeStyle = 'rgba(40,44,70,0.45)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4.5, ry - 4.5, 8, 8);
    if (marks[i] === 'tick') tick(ctx, 9, ry - 1, 4.6, '#2f7a3d', 2);
    else if (marks[i] === 'cross') crossMark(ctx, 8.5, ry - 0.5, 4, '#c8432f', 2);
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
// in the act that let it run: smoking in the lobby, out with a coffee, carrying it back to his own desk. The
// laptop on your desk is the owner's, in his colour.
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
    desk(ctx, 214, 236, 190, 'player', owner !== 'kev' && lidOf(game, owner), t);
    // the auditor, pleased: four ticks
    const a = auditor(game, t);
    a.dir = Math.PI / 2 + 0.25;
    a.head = Math.PI / 2 + 0.35;
    a.arms = 'desk';
    drawPerson(ctx, game.level.looks.auditor, a, 476, 290);
    clipboard(ctx, 486, 304, ['tick', 'tick', 'tick', 'tick'], t);
    bubble(ctx, ['😊'], 476, 196, e, 'speech', 1.4);
    if (owner === 'lin') walker(ctx, game, t, e, 'lin', '#cup');
    if (owner === 'kev') walker(ctx, game, t, e, 'kev', '#laptop_kev');
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
  b.item = '#cigarette';
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

// Lin with her coffee, or Kev with his laptop, walking off to the right, humming: none the wiser. item: the
// thing in their hand ('#cup', '#laptop_kev': render/things.js, index.js ITEMS).
function walker(ctx, game, t, e, id, item) {
  const k = clamp(e / 3.2, 0, 1);
  const x = (id === 'kev' ? 560 : 590) + (id === 'kev' ? 70 : 100) * easeOutCubic(k);
  const walking = k < 0.98;
  if (id === 'kev') { // his desk at the edge of the picture, where it goes back: his chair, his mug, the loose cable
    chairBack(ctx, 742, 176, 'kev');
    desk(ctx, 690, 220, 150, 'kev', null, t);
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

// --- Fired and caught: you carry your desk in a box to the lift, and he points the way.
const LIFT = { x: 626, y: TAB.y, w: 100, h: 96 };

// The auditor, rooted to the spot, pointing the way out (a bare pointing hand: render/characters.js).
function pointsOut(ctx, game, t, x) {
  const a = auditor(game, t);
  a.dir = 0.08;
  a.head = 0.08 + Math.sin(t * 2.4) * 0.08;
  a.arms = 'point';
  a.angry = true;
  drawPerson(ctx, game.level.looks.auditor, a, x + Math.max(0, Math.sin(t * 5)) * 3, 290);
}

const RECORD = { boss: 'atBoss', lin: 'atLin', you: 'atYou', kev: 'atKev' }; // index.js WHY -> RECORDS

// Fired at the sign-off: the desk he crossed first (why: index.js meeting.verdict), its laptop gone, the cable
// hanging loose, his laptop-and-cross sign over it; his list on the desk, crossed.
const tableauFired = (why) => (ctx, game, t, e) => {
  const owner = why === 'you' ? 'player' : why;
  office(ctx);
  drawLift(ctx, t);
  chairBack(ctx, 286, 170, owner);
  desk(ctx, 206, 214, 160, owner, null, t);
  bubble(ctx, ['💻', '❌'], 286, 180, e, 'sign', 1.5);
  const w = game.world;
  const marks = w?.crossed?.length ? marksOf(w) : RECORDS.map((r) => (r === RECORD[why] ? 'cross' : 'tick'));
  ctx.save();
  ctx.translate(330, 236);
  ctx.rotate(0.2);
  clipboard(ctx, 0, 0, marks, 0);
  ctx.restore();
  pointsOut(ctx, game, t, 420);
  walkOfShame(ctx, game, t, e, 500);
};

// Caught: he saw you with a laptop in your hands. The laptop where it fell, in its owner's colour.
function tableauCaught(ctx, game, t, e) {
  office(ctx);
  drawLift(ctx, t);
  const type = game.player?.held ?? game.caught?.item;
  const lid = typeof type === 'string' && type.startsWith('laptop_') ? tintOf(game, type) : null;
  fillEllipse(ctx, 386, 318, 18, 5, 'rgba(0,0,0,0.2)');
  drawLaptop(ctx, 386, 318, 40, -0.22, lid ?? undefined);
  bubble(ctx, ['💻', '❗'], 310, 200, e, 'alert');
  pointsOut(ctx, game, t, 300);
  walkOfShame(ctx, game, t, e, 440);
}

// You, your desk in a box, walking from x0 to the open lift: slow, then a stop at the doors.
const walkOfShame = (ctx, game, t, e, x0) => walkWithBox(ctx, game.level.looks.player, t, e, x0, LIFT.x + LIFT.w / 2);
const drawLift = (ctx, t) => drawLiftAt(ctx, t, LIFT);

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
  desk(ctx, 214, 226, 190, 'player', !kev && lidOf(game, o.routes[0]), t);
  const a = auditor(game, t);
  a.dir = Math.PI - 0.15;
  a.head = Math.PI - 0.35 + Math.sin(t * 1.3) * 0.08; // at your empty chair
  a.arms = 'desk';
  a.angry = true;
  drawPerson(ctx, game.level.looks.auditor, a, 446, 290);
  clipboard(ctx, 432, 304, ['tick', 'tick', 'tick', 'tick'], t);
  bubble(ctx, ['@player', '❓'], 446, 196, e, 'speech', 1.3); // where are you?
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
  desk(ctx, 244, 236, 190, 'player', null, t);
  const a = auditor(game, t);
  a.dir = Math.PI / 2 + 0.3;
  a.head = -Math.PI / 2 - 0.4; // up at the clock
  a.arms = 'desk';
  drawPerson(ctx, game.level.looks.auditor, a, 600, 290);
  clipboard(ctx, 612, 304, marksOf(game.world), t);
  bubble(ctx, ['❓'], 600, 196, e, 'thought', 1.4);
}

// A fired card names whose desk got the ❌ (the first one: index.js meeting.verdict), then his finger and your box.
const fired = (who, face) => ({ win: false, icons: [face, '💻', '❌', '👉', '📦'], draw: tableauFired(who) });

export const END_SCENES = {
  kindOf: (o) => {
    if (o?.result === 'win') return o.routes[0];
    if (o?.result === 'fail') return o.why ? `fired_${o.why}` : 'fail';
    return o?.result ?? 'fail';
  },
  scenes: {
    // icon rows (the punchline): who let the laptop run and how, the laptop, his two ticks for it
    boss: { win: true, icons: ['@boss', '🚬', '💻', '✔️', '✔️'], draw: tableauWin('boss') },
    lin: { win: true, icons: ['@lin', '☕', '💻', '✔️', '✔️'], draw: tableauWin('lin') },
    kev: { win: true, icons: ['💻', '✔️', '✔️', '@kev', '🎵'], draw: tableauWin('kev') },
    fired_boss: fired('boss', '@boss'),
    fired_lin: fired('lin', '@lin'),
    fired_you: fired('you', '@player'),
    fired_kev: fired('kev', '@kev'),
    fail: { win: false, icons: ['@auditor', '📋', '❓'], draw: tableauFail }, // the sign-off before he finished
    caught: { win: false, icons: ['@auditor', '👀', '💻', '👉', '📦'], draw: tableauCaught }, // he saw it in your hands
    blamed: { win: false, icons: ['@auditor', '😠', '🪑', '📦'], draw: tableauBlamed }, // your empty chair at the sign-off, he glares, your box
  },
};
