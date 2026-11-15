// The meeting level's end screens: which scene an outcome gets, the icon row under it and its hand-drawn
// picture. src/render/screens.js reads this as level.endScenes:
//   kindOf(outcome)  -> a key of scenes (outcome may be null, outcome.routes may not be an array)
//   scenes[kind]     -> { win, icons, draw }
//     win            -> card border: teal when true, tomato when false
//     icons          -> emoji row under the picture, centred (any count): the punchline, speech
//     draw(ctx, game, t, e, outcome) -> paints the picture inside TAB (screen space, already clipped);
//                       e = seconds since the card came up. Objects in it are drawn (drawThing, painters.js), never
//                       emoji; only bubbles speak emoji (DESIGN.md "Visual language" rule 5)
import { clamp, easeOutBack, easeOutCubic, rrect, fillEllipse, drawScreen } from '../../render/util.js';
import { drawThing } from '../../render/things.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawProjector, drawChair } from '../../render/world.js';
import { TAB, person, bubble, floorCarpet, floorTiles, confetti, backWall } from '../../render/tableau.js';
import { findNpc } from '../../game/perception.js';
import { popper, cricket } from './painters.js';

const B_ANGRY = ['😠'];
const B_POINT = ['👉'];
const B_WHAT = ['❓'];
const B_BLAME = ['😠', '👉'];
const B_PROJ = ['📽️', '💥', '🤷'];
const B_DOTS = ['📊', '❓'];
const B_MUG = ['☕', '😠', '👉'];
const B_KEV = ['☕', '🔧'];

function endKind(o) {
  if (!o) return 'fail';
  const routes = Array.isArray(o.routes) ? o.routes : [];
  if (o.result === 'caught') return 'caught';
  // o.why: the verdict's reason (verdict.js): 'mug'/'desk' the empty mug was yours; 'kev' it was on Kev's desk.
  if (o.result === 'blamed') return o.why === 'mug' || o.why === 'desk' ? 'mug' : 'blamed';
  if (o.result === 'win') return routes.includes('keycard') ? 'keycard' : o.why === 'kev' ? 'kev' : 'projector';
  return 'fail';
}

function bossJacket(game) {
  const boss = game.npcs && findNpc(game, 'boss');
  return boss ? game.world.jacket === boss.id : true;
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
  drawPerson(ctx, game.level.looks.player, p, 340, 280 - Math.abs(Math.sin(t * 6)) * 8);
  // boss outside, banging on the glass
  const b = person(t);
  b.dir = Math.PI;
  b.head = Math.PI + Math.sin(t * 2) * 0.1;
  b.arms = 'bang';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, game.level.looks.boss, b, 548, 272);
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
    popper(ctx, 0, 0, 44, t);
    ctx.restore();
  }
}

function tableauProjector(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, '#3d7a72', '#397369');
  // dead screen
  drawScreen(ctx, 392, 106, 176, 70, { bar: [6, 6, 6], face: '#d9d6cc', scan: ['rgba(0,0,0,0.08)', 6, 11, t] });
  // seated Lin (behind the table)
  const l = person(t);
  l.dir = 0;
  l.head = Math.sin(t * 1.5) * 0.3 + 0.2;
  l.pose = 'sit';
  l.arms = 'desk';
  l.scale = 2;
  drawPerson(ctx, game.level.looks.lin, l, 270, 222);
  // boss shrugging
  const b = person(t);
  b.dir = Math.PI / 2;
  b.head = b.dir + Math.sin(t * 2.2) * 0.35;
  b.arms = 'shrug';
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, game.level.looks.boss, b, 660, 222);
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
  drawScreen(ctx, 382, 104, 196, 84, {
    glow: ['rgba(255,255,235,0.35)', 10, 6, 6], bar: [6, 6, 6], face: '#ffffff', edge: 'rgba(0,0,0,0.12)',
  });
  // presenter
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = p.dir + Math.sin(t * 2.6) * 0.5;
  p.sweat = true;
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, 480, 262);
  // staring coworkers
  const k = person(t);
  k.dir = 0.25;
  k.head = 0.05;
  k.pose = 'sit';
  k.arms = 'desk';
  k.glance = 1;
  k.scale = 2;
  if (!game.world || !game.world.kevGone) drawPerson(ctx, game.level.looks.kev, k, 262, 206); // he went home at 3:00 (unless kept late)
  const l = person(t);
  l.dir = -0.15;
  l.head = -0.25;
  l.pose = 'sit';
  l.arms = 'desk';
  l.glance = 1;
  l.scale = 2;
  drawPerson(ctx, game.level.looks.lin, l, 300, 300);
  const b = person(t);
  b.dir = Math.PI;
  b.head = Math.PI + 0.15;
  b.glance = 1;
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, game.level.looks.boss, b, 676, 268);
  bubble(ctx, B_DOTS, 676, 186, e, 'thought');
  // the lone cricket
  const hop = Math.abs(Math.sin(e * 5));
  cricket(ctx, 480 + Math.sin(e * 0.9) * 80, 322 - hop * 14, 22);
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
  drawPerson(ctx, game.level.looks.player, p, px, 268);
  // the boss, rooted to the spot, pointing the way out
  const b = person(t);
  b.dir = 0.08;
  b.head = 0.08 + Math.sin(t * 2.4) * 0.08;
  b.arms = 'point';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.6;
  const jab = Math.max(0, Math.sin(t * 5)) * 3; // little jabs at the door
  drawPerson(ctx, game.level.looks.boss, b, 262 + jab, 282);
  bubble(ctx, B_ANGRY, 276, 206, e, 'alert');
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
    drawPerson(ctx, game.level.looks.boss, b, 476, 222);
  }
  meetingTable(ctx); // a slide printout at each place but yours
  if (smoke) smokingProjector(ctx, t, 420);
  // Lin and Kev at the table ends, turned to the chair
  const l = person(t);
  l.dir = 0.42;
  l.head = 0.42;
  l.arms = 'point';
  l.angry = true;
  l.scale = 2.4;
  drawPerson(ctx, game.level.looks.lin, l, 272, 262);
  if (kev) {
    const k = person(t);
    k.dir = Math.PI - 0.42;
    k.head = Math.PI - 0.3 + Math.sin(t * 1.7) * 0.2;
    k.glance = 1;
    k.scale = 2.4;
    drawPerson(ctx, game.level.looks.kev, k, 680, 262);
  }
  poolOfLight(ctx, 476, 316); // your chair: empty, in a pool of light
  ctx.save();
  ctx.translate(476, 302);
  ctx.scale(2.6, 2.6);
  drawChair(ctx, 0, 0, -Math.PI / 2, C.ochre, C.ochreDark);
  ctx.restore();
  // what they're saying
  bubble(ctx, lockedOut && !kev ? B_BLAME : B_POINT, 272, 206, e, 'speech', 1.4);
  if (!lockedOut) bubble(ctx, B_ANGRY, 476, 168, e, 'alert');
  if (kev) bubble(ctx, B_WHAT, 680, 206, e, 'thought', 1.4);
}

// The meeting table (the blamed scene's): shadow, walnut top, a slide printout at each end place.
function meetingTable(ctx) {
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
}

function smokingProjector(ctx, t, x) {
  ctx.save();
  ctx.translate(x, 254);
  ctx.scale(2.4, 2.4);
  drawProjector(ctx, 0, 0, 'broken', 0, t);
  ctx.restore();
}

function poolOfLight(ctx, x, y) {
  for (let i = 3; i >= 1; i--) fillEllipse(ctx, x, y, 26 + i * 14, 7 + i * 4, `rgba(255,240,200,${(0.08 * (4 - i)).toFixed(3)})`);
}

// Blamed by the mug (verdict.js why 'mug'/'desk'): the projector smokes on the table, and the empty mug is in your
// hand (or, found on your desk, back on the table in front of you). The boss pounds the table; the room points.
function tableauMug(ctx, game, t, e, o) {
  const inHand = o.why !== 'desk';
  const kev = !game.world || !game.world.kevGone;
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.meetingRug, '#397369');
  meetingScreen(ctx, t, true, 0);
  const b = person(t);
  b.dir = Math.PI / 2;
  b.head = Math.PI / 2;
  b.arms = 'bang';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.5;
  drawPerson(ctx, game.level.looks.boss, b, 476, 222);
  meetingTable(ctx);
  smokingProjector(ctx, t, 380);
  if (!inHand) {
    poolOfLight(ctx, 560, 252);
    drawThing(ctx, game, 'mug', 560, 248, 26);
  }
  const l = person(t);
  l.dir = 0.42;
  l.head = 0.42;
  l.arms = 'point';
  l.angry = true;
  l.scale = 2.4;
  drawPerson(ctx, game.level.looks.lin, l, 272, 262);
  if (kev) {
    const k = person(t);
    k.dir = Math.PI - 0.42;
    k.head = Math.PI - 0.42;
    k.arms = 'point';
    k.scale = 2.4;
    drawPerson(ctx, game.level.looks.kev, k, 680, 262);
  }
  // you, in front of the table, caught with it: eyes darting, the mug held up like a phone that isn't one
  poolOfLight(ctx, 476, 324);
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = Math.PI / 2 + Math.sin(t * 3.1) * 0.5;
  p.sweat = true;
  p.scale = 2.4;
  if (inHand) {
    p.arms = 'mug';
    p.item = '#mug';
  }
  drawPerson(ctx, game.level.looks.player, p, 476, 312);
  bubble(ctx, B_MUG, 476, 150, e, 'alert');
  bubble(ctx, B_POINT, 272, 206, e, 'speech', 1.4);
}

// The win the mug buys (verdict.js why 'kev'): the boss found it on Kev's desk. Kev went home at 3:00, so the whole
// table turns on his empty chair, the empty mug in front of it. You sit among them, nodding along.
function tableauKev(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.meetingRug, '#397369');
  meetingScreen(ctx, t, true, 0);
  const b = person(t);
  b.dir = 0.35;
  b.head = 0.35;
  b.arms = 'point';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.5;
  drawPerson(ctx, game.level.looks.boss, b, 476, 222);
  meetingTable(ctx);
  smokingProjector(ctx, t, 400);
  // Kev's place: the empty chair in a pool of light, the evidence in front of it
  poolOfLight(ctx, 682, 290);
  ctx.save();
  ctx.translate(682, 276);
  ctx.scale(2.6, 2.6);
  drawChair(ctx, 0, 0, Math.PI, C.ochre, C.ochreDark);
  ctx.restore();
  const pe = clamp((e - 0.4) / 0.3, 0, 1);
  if (pe > 0) {
    ctx.save();
    ctx.translate(620, 246);
    ctx.scale(easeOutBack(pe), easeOutBack(pe));
    drawThing(ctx, game, 'mug', 0, 0, 26);
    ctx.restore();
  }
  const l = person(t);
  l.dir = 0;
  l.head = 0;
  l.arms = 'point';
  l.angry = true;
  l.scale = 2.4;
  drawPerson(ctx, game.level.looks.lin, l, 272, 262);
  // you, in front of the table, turned to the chair with everyone else; now and then a glance at us
  const p = person(t);
  p.dir = -0.3;
  p.head = Math.sin(t * 0.9) > 0.85 ? Math.PI / 2 : -0.3;
  p.smug = true;
  p.scale = 2.4;
  drawPerson(ctx, game.level.looks.player, p, 476, 312);
  bubble(ctx, B_BLAME, 476, 150, e, 'alert');
  bubble(ctx, B_KEV, 272, 206, e, 'thought', 1.4);
}

// The meeting-room screen: a blank glowing slide (nobody presented), or dead if the projector went.
function meetingScreen(ctx, t, dead, dx) {
  const x = 392 + dx;
  const bar = [6, 6, 6];
  if (dead) drawScreen(ctx, x, 104, 176, 62, { bar, face: '#9d9a92', scan: ['rgba(0,0,0,0.1)', 4, 10, t] });
  else drawScreen(ctx, x, 104, 176, 62, { bar, glow: ['rgba(255,255,235,0.3)', 6, 0, 6], glowOverBar: true, face: '#ffffff' });
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
  drawPerson(ctx, game.level.looks.boss, b, wx + ww / 2, wy + wh - 4); // face centred, fists on the glass
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

export const END_SCENES = {
  kindOf: endKind,
  scenes: {
    keycard: { win: true, icons: ['🪪', '✅', '🎉'], draw: tableauKeycard },
    projector: { win: true, icons: ['📽️', '💥', '🤷'], draw: tableauProjector },
    fail: { win: false, icons: ['📊', '❌', '🦗'], draw: tableauFail },
    caught: { win: false, icons: ['😠', '👉', '📦'], draw: tableauCaught }, // fired: box of desk stuff, pointed at the elevator
    blamed: { win: false, icons: ['🪑', '👉', '😠'], draw: tableauBlamed }, // the meeting happened; your chair was empty
    mug: { win: false, icons: ['☕', '👉', '😠'], draw: tableauMug }, // the empty mug was yours: in your hand, on your desk
    kev: { win: true, icons: ['☕', '👉', '🪑'], draw: tableauKev }, // the empty mug was on Kev's desk; Kev went home
  },
};
