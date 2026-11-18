// Still more of the meeting's end scenes (end-scenes.js reads them into END_SCENES; same draw signature:
// draw(ctx, game, t, e, outcome), inside TAB, screen space). Kept apart so builders working in parallel touch
// different files. Objects are drawn, never emoji; only bubbles speak emoji.
//   bib       caught, why 'bib' (clocks.js: hunting Lin saw the mustard on you and told): you type at your desk in a
//             giant paper bib, and Lin stands at your elbow eating a fresh sandwich, slowly, staring at you.
//   campfire  a win by both routes in one loop (the projector dead and the boss locked out): nobody left to run the
//             meeting, the lights down, and you and Lin warm your hands at the smoking projector while she toasts a
//             marshmallow over it on a straightened paperclip.
import { rrect, fillEllipse, fillCircle } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble } from '../../render/tableau.js';
import { walnutDesk, officeRoom } from '../../render/tableau-furniture.js';
import { meetingRoom, brokenProjector } from './end-set.js';

const B_LIN_STARE = [['👀', '@player'], ['😋']];
const B_YOU_WANT = ['🥪', '🥺'];

// Caught over the mustard: back at your desk, typing, in a paper bib down to the desk (the mess you made of her
// lunch). Lin, at your elbow, eats a fresh sandwich: a slow bite, a long chew, her eyes on you the whole time.
// Now and then you glance at the sandwich.
export function tableauBib(ctx, game, t, e) {
  officeRoom(ctx, 92);
  const looks = game.level.looks;
  const px = 420;
  const py = 262;
  const sc = 2.4;
  // you, seated, typing; a glance at her sandwich every few seconds
  const p = person(t);
  p.pose = 'sit';
  p.arms = 'type';
  p.scale = sc;
  const glance = e % 4.2 > 3;
  p.head = glance ? 0.35 : Math.PI / 2;
  drawPerson(ctx, looks.player, p, px, py);
  paperBib(ctx, px, py, sc, t);
  // your desk in front: the monitor to one side, the keyboard under your hands
  walnutDesk(ctx, px - 110, 282, 220, { depth: 34, skirt: 46, r: 10, shadow: { color: 'rgba(0,0,0,0.25)', dx: 4, h: 44 } });
  ctx.fillStyle = C.monitor;
  rrect(ctx, px - 98, 236, 58, 48, 5);
  ctx.fill();
  ctx.fillStyle = '#f4f1e6'; // your slide: still blank (decor.js desks.player)
  ctx.fillRect(px - 92, 242, 46, 32);
  ctx.fillStyle = C.keyboard;
  rrect(ctx, px - 30, 288, 60, 14, 3);
  ctx.fill();
  ctx.fillStyle = '#a9a294';
  for (let k = 0; k < 7; k++) ctx.fillRect(px - 26 + k * 8, 291 + ((t * 9 + k * 3) % 2 < 1 ? 1 : 0), 6, 4); // keys going
  // Lin, standing at your elbow, side on to you, eating it slowly: up to her mouth, a long chew, down again
  const lx = 560;
  const l = person(t);
  l.dir = Math.PI - 0.35;
  l.head = Math.PI - 0.5; // on you
  l.arms = 'lift';
  l.item = '#sandwich';
  const cyc = e % 3.4;
  l.lift = cyc < 0.7 ? cyc / 0.7 : cyc < 2.2 ? 1 : Math.max(0, 1 - (cyc - 2.2) / 0.7);
  l.scale = 2.5;
  drawPerson(ctx, looks.lin, l, lx, 272);
  bubble(ctx, B_LIN_STARE[Math.floor(e / 1.7) % 2], lx + 6, 190, e % 1.7, 'speech', 1.2);
  if (glance) bubble(ctx, B_YOU_WANT, px - 14, 178, e % 4.2 - 3, 'thought', 1.1);
}

// A giant paper bib tied round your neck, white with a crinkled scalloped hem, down past the desk's edge.
// (x, y): the seated person's feet, sc their scale.
function paperBib(ctx, x, y, sc, t) {
  const top = y - 4.5 * sc; // just under the chin (characters.js: a seated head's foot is about 4 px over y)
  const w = 11 * sc;
  const h = 14 * sc; // down to the desk's top, and on under it
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  rrect(ctx, x - w + 2, top + 3, w * 2, h, 6);
  ctx.fill();
  ctx.fillStyle = '#fbfaf5';
  ctx.beginPath();
  ctx.moveTo(x - w * 0.55, top);
  ctx.quadraticCurveTo(x, top + 7, x + w * 0.55, top);
  ctx.lineTo(x + w, top + h * 0.3);
  ctx.lineTo(x + w, top + h);
  for (let i = 0; i <= 8; i++) { // scalloped hem
    const hx = x + w - (i * 2 * w) / 8;
    ctx.quadraticCurveTo(hx + w / 8, top + h + 5, hx, top + h);
  }
  ctx.lineTo(x - w, top + h * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,110,95,0.35)'; // creases
  ctx.lineWidth = 1.2;
  for (const dx of [-0.45, 0.1, 0.55]) {
    ctx.beginPath();
    ctx.moveTo(x + dx * w, top + h * 0.35);
    ctx.lineTo(x + dx * w + 3, top + h * 0.95);
    ctx.stroke();
  }
  // the ties at the back of the neck, sticking out either side
  ctx.strokeStyle = '#e8e3d6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - w * 0.5, top + 1);
  ctx.lineTo(x - w * 0.85, top - 6 + Math.sin(t * 2) * 1);
  ctx.moveTo(x + w * 0.5, top + 1);
  ctx.lineTo(x + w * 0.85, top - 6 + Math.sin(t * 2 + 1) * 1);
  ctx.stroke();
  // and already a blob of mustard on it
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#e8b923';
  fillCircle(ctx, x - w * 0.3, top + h * 0.55, 3, '#e8b923');
  fillCircle(ctx, x - w * 0.22, top + h * 0.62, 2, '#e8b923');
  ctx.restore();
}

// Both routes in one loop (end-scenes.js endKind: a win with routes keycard and projector): the boss is out on the
// balcony, the projector is dead and smoking on the meeting table, and with nobody to run the meeting the lights are
// down. You and Lin stand at the table and warm your hands at it; she toasts a marshmallow over it on a straightened
// paperclip: white, then golden, then drawn back to her and eaten, and on to the next.
const MALLOW = 5.2; // s per marshmallow: held over the smoke, browning, then pulled back
const PJ = { x: 480, y: 262, sc: 3 }; // the projector on the table
const B_COSY = ['😌'];
const B_YUM = ['😋'];
export function tableauCampfire(ctx, game, t, e) {
  const looks = game.level.looks;
  meetingRoom(ctx, t, 'dead');
  // lights down: the room dark but for the glow off the projector
  ctx.fillStyle = 'rgba(14,18,30,0.5)';
  ctx.fillRect(TAB.x, TAB.y, TAB.w, TAB.h);
  const flick = 0.85 + Math.sin(t * 7.3) * 0.08 + Math.sin(t * 13.1) * 0.05;
  const glow = ctx.createRadialGradient(PJ.x, PJ.y - 14, 4, PJ.x, PJ.y - 14, 190);
  glow.addColorStop(0, `rgba(255,170,80,${(0.55 * flick).toFixed(3)})`);
  glow.addColorStop(0.45, `rgba(255,130,50,${(0.22 * flick).toFixed(3)})`);
  glow.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(TAB.x, TAB.y, TAB.w, TAB.h);
  // you (left) and Lin (right), standing at the table's far side, side on to it and to each other
  const sc = 2.3;
  const py = 236;
  const p = person(t);
  p.dir = 0;
  p.head = Math.sin(t * 0.6) * 0.15;
  p.arms = 'reach'; // palms out to the warmth, rubbing
  p.scale = sc;
  drawPerson(ctx, looks.player, p, PJ.x - 78, py);
  const k = (e % MALLOW) / MALLOW;
  const out = k < 0.8 ? 1 : 1 - (k - 0.8) / 0.2; // over the fire, then drawn back to her to eat
  const lx = PJ.x + 80;
  const l = person(t);
  l.dir = Math.PI;
  l.head = Math.PI + (k > 0.85 ? 0.25 : 0.05); // eyes on the marshmallow
  l.arms = 'holdout';
  l.scale = sc;
  drawPerson(ctx, looks.lin, l, lx, py);
  // the table in front of you both, the projector on it
  walnutDesk(ctx, PJ.x - 156, 238, 312, { depth: 62, skirt: 72, r: 26, shadow: { color: 'rgba(0,0,0,0.25)', dx: 6, dy: 10, h: 70 } });
  fillEllipse(ctx, PJ.x, PJ.y + 4, 120, 26, 'rgba(255,150,70,0.16)'); // firelight on the table top
  brokenProjector(ctx, t, PJ.x, PJ.y, PJ.sc);
  // the smoke off it, a column lit orange from below, and embers going up in it
  for (let i = 0; i < 6; i++) {
    const q = (t * 0.32 + i / 6) % 1;
    const sx = PJ.x - 6 + Math.sin(t * 1.1 + i * 2.1) * 6 * q;
    const sy = PJ.y - 22 - q * 120;
    const warm = Math.max(0, 1 - q * 2.5);
    fillCircle(ctx, sx, sy, 7 + q * 16, `rgba(${Math.round(120 + 110 * warm)},${Math.round(115 + 30 * warm)},${Math.round(110 - 40 * warm)},${(0.5 * (1 - q)).toFixed(3)})`);
  }
  for (let i = 0; i < 5; i++) {
    const q = (t * 0.55 + i * 0.37) % 1;
    fillCircle(ctx, PJ.x - 8 + Math.sin(i * 5.3 + t * 2) * 14 * q, PJ.y - 22 - q * 70, 1.6 * (1 - q) + 0.4, `rgba(255,${Math.round(150 + 80 * q)},70,${(1 - q).toFixed(3)})`);
  }
  fillEllipse(ctx, PJ.x - 6, PJ.y - 20, 22 * flick, 6, 'rgba(255,140,50,0.35)'); // the glow off its hot vents
  // her hand (characters.js holdout, in profile facing left: 13 px out, 3 px up), and the paperclip from it
  const hx = lx - 13 * sc;
  const hy = py - 3 * sc;
  const tipX = hx - (16 + 42 * out);
  const tipY = hy - 4 + 2 * out; // in the smoke, just over the projector's top
  ctx.strokeStyle = '#c9cdd2';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(hx + 4, hy + 2); // the clip's last loop, still bent round her fingers
  ctx.quadraticCurveTo(hx - 4, hy + 4, hx - 2, hy);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
  // the marshmallow on the end: white, browning while it's over the smoke
  const brown = Math.min(1, k / 0.75);
  const mc = (a, b) => Math.round(a + (b - a) * brown);
  ctx.fillStyle = `rgb(${mc(250, 196)},${mc(246, 128)},${mc(236, 58)})`;
  rrect(ctx, tipX - 9, tipY - 8, 15, 15, 4);
  ctx.fill();
  ctx.fillStyle = `rgba(110,60,25,${(0.7 * brown).toFixed(3)})`; // the toasted side, toward the projector
  rrect(ctx, tipX - 9, tipY - 8, 6, 15, 3);
  ctx.fill();
  fillCircle(ctx, tipX + 1, tipY - 4, 2, 'rgba(255,255,255,0.6)');
  // faces: you, at peace; Lin, at her marshmallow
  bubble(ctx, B_COSY, PJ.x - 84, 160, e % 6, 'thought', 1.1);
  if (k > 0.82) bubble(ctx, B_YUM, lx + 4, 160, (k - 0.82) * MALLOW, 'speech', 1.1);
}
