// Still more of the meeting's end scenes (end-scenes.js reads them into END_SCENES; same draw signature:
// draw(ctx, game, t, e, outcome), inside TAB, screen space). Kept apart so builders working in parallel touch
// different files. Objects are drawn, never emoji; only bubbles speak emoji.
//   bib       caught, why 'bib' (clocks.js: hunting Lin saw the mustard on you and told): you type at your desk in a
//             giant paper bib, and Lin stands at your elbow eating a fresh sandwich, slowly, staring at you.
import { rrect, fillEllipse, fillCircle } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble, floorCarpet, backWall } from '../../render/tableau.js';
import { walnutDesk } from '../../render/tableau-furniture.js';

const B_LIN_STARE = [['👀', '@player'], ['😋']];
const B_YOU_WANT = ['🥪', '🥺'];

// Caught over the mustard: back at your desk, typing, in a paper bib down to the desk (the mess you made of her
// lunch). Lin, at your elbow, eats a fresh sandwich: a slow bite, a long chew, her eyes on you the whole time.
// Now and then you glance at the sandwich.
export function tableauBib(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  backWall(ctx, 92);
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
