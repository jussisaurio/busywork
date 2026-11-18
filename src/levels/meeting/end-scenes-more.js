// More of the meeting's end scenes (end-scenes.js reads them into END_SCENES; same draw signature:
// draw(ctx, game, t, e, outcome), inside TAB, screen space). Kept apart so builders working in parallel touch
// different files. Objects are drawn, never emoji; only bubbles speak emoji.
//   computer  caught, why 'computer' (interactions.js drownComputer: the cup into any computer on the floor): the
//             drowned machine sparks and drips on its desk; you stand by it sooty, hair on end; the boss points at
//             it and holds out an empty box for your things. Its owner, if it has one and they are in (Lin; Kev
//             until he goes home), stands at the right edge, horrified 😱💻. Yours, an empty desk's and the boss's
//             own (he is already there, pointing) add nobody.
import { rrect, fillEllipse, fillCircle } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble, floorCarpet, backWall } from '../../render/tableau.js';
import { findNpc } from '../../game/perception.js';

const B_COMPUTER = [['⌨️', '💥', '👉', '@player'], ['📦', '👉', '@player']];

function bossJacket(game) {
  const boss = game.npcs && findNpc(game, 'boss');
  return boss ? game.world.jacket === boss.id : true;
}

const OWNER_SAYS = ['😱', '💻'];
const OWNER_IN = { lin: () => true, kev: (w) => !w.kevGone }; // whose machine brings them onto the card, and when

export function tableauComputer(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  backWall(ctx, 92);
  // the desk, the dead machine on it
  deadDesk(ctx, 470, 214, t, e);
  // you, beside it: blackened, hair on end, frozen
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = Math.PI / 2 + Math.sin(t * 9) * 0.05; // a little tremble
  p.arms = 'shrug';
  p.sweat = true;
  p.scale = 2.4;
  const px = 640;
  const py = 300;
  drawPerson(ctx, game.level.looks.player, p, px, py);
  soot(ctx, px, py - 29, 2.4, t);
  // the boss, pointing at it, the empty box held out for your desk
  const b = person(t);
  b.dir = Math.PI / 2 - 0.25;
  b.head = e % 3.2 < 1.6 ? 0.2 : Math.PI / 2 - 0.3; // at the machine, then at you
  b.arms = e % 3.2 < 1.6 ? 'point' : 'box';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.6;
  drawPerson(ctx, game.level.looks.boss, b, 262, 290);
  bubble(ctx, B_COMPUTER[Math.floor(e / 1.6) % 2], 276, 206, e % 1.6, 'alert');
  // its owner, at the right edge, past you, turned to the dead machine
  const who = game.world?.drowned?.owner;
  if (!OWNER_IN[who]?.(game.world)) return;
  const o = person(t);
  o.dir = Math.PI - 0.3;
  o.head = Math.PI - 0.3;
  o.arms = 'facepalm';
  o.sweat = true;
  o.scale = 2.2;
  drawPerson(ctx, game.level.looks[who], o, 728, 300);
  bubble(ctx, OWNER_SAYS, 722, 214, e, 'speech', 1.2);
}

// The desk end on, its workstation drowned: a dead, cracked screen, coffee over the keys, dripping off the
// front into a puddle, smoke rising, sparks jumping. (x, y): the desk top's centre.
function deadDesk(ctx, x, y, t, e) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, x - 118, y + 8, 236, 70, 8);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, x - 120, y - 6, 240, 78, 8);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, x - 120, y - 6, 240, 66, 8);
  ctx.fill();
  // the monitor: a beige box, its face black and cracked, a dying flicker
  ctx.fillStyle = C.monitor;
  rrect(ctx, x - 48, y - 70, 96, 72, 8);
  ctx.fill();
  ctx.fillStyle = C.bezel;
  rrect(ctx, x - 40, y - 62, 80, 52, 4);
  ctx.fill();
  const flick = Math.sin(t * 23) > 0.93;
  ctx.fillStyle = flick ? '#3a4a3a' : '#121212';
  ctx.fillRect(x - 35, y - 57, 70, 42);
  ctx.strokeStyle = 'rgba(230,230,230,0.75)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x - 30, y - 52);
  ctx.lineTo(x - 8, y - 36);
  ctx.lineTo(x + 2, y - 44);
  ctx.lineTo(x + 30, y - 20);
  ctx.moveTo(x - 8, y - 36);
  ctx.lineTo(x - 14, y - 18);
  ctx.stroke();
  // keyboard, drowned
  ctx.fillStyle = C.keyboard;
  rrect(ctx, x - 50, y + 12, 100, 28, 4);
  ctx.fill();
  ctx.fillStyle = '#a9a294';
  for (let r = 0; r < 3; r++) for (let k = 0; k < 10; k++) ctx.fillRect(x - 45 + k * 9.5, y + 16 + r * 8, 7, 5);
  fillEllipse(ctx, x + 6, y + 26, 46, 13, 'rgba(74,42,20,0.92)');
  fillEllipse(ctx, x - 6, y + 22, 14, 3, 'rgba(255,255,255,0.25)');
  // down the front edge and onto the carpet
  ctx.fillStyle = '#4a2a14';
  ctx.fillRect(x + 28, y + 30, 6, 42);
  const fall = (t * 1.6) % 1;
  fillCircle(ctx, x + 31, y + 76 + fall * 26, 3.4, '#4a2a14');
  fillEllipse(ctx, x + 31, y + 104, 22 + Math.min(e, 4) * 4, 6, '#3b2212');
  // smoke from the back of the box
  for (let i = 0; i < 5; i++) {
    const k = (t * 0.35 + i / 5) % 1;
    fillCircle(ctx, x + Math.sin(t * 1.2 + i * 1.7) * 14 * k, y - 74 - k * 70, 7 + k * 16, `rgba(80,80,80,${(0.5 * (1 - k)).toFixed(3)})`);
  }
  // sparks off the keys: a crackle every so often, with a flash
  const sp = (t * 1.1) % 1;
  if (sp < 0.22) {
    const q = sp / 0.22;
    fillCircle(ctx, x - 10, y + 20, 18 * (1 - q) + 4, `rgba(255,236,140,${(0.6 * (1 - q)).toFixed(3)})`);
    ctx.strokeStyle = '#ffe36b';
    ctx.lineWidth = 2.4;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.42;
      const r0 = 8 + q * 46;
      ctx.beginPath();
      ctx.moveTo(x - 10 + Math.cos(a) * r0, y + 20 + Math.sin(a) * r0);
      ctx.lineTo(x - 10 + Math.cos(a) * (r0 + 10), y + 20 + Math.sin(a) * (r0 + 10));
      ctx.stroke();
    }
  }
}

// Soot on your face and hair blown on end, round the head at (x, y) (its centre), at person scale sc.
function soot(ctx, x, y, sc, t) {
  ctx.strokeStyle = '#2a2420';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * 0.3;
    const r0 = 6.5 * sc;
    const r1 = r0 + (5 + (i % 3) * 2 + Math.sin(t * 14 + i) * 0.8) * sc * 0.6;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0);
    ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
  for (const [dx, dy, r] of [[-7, 3, 5], [6, 5, 4], [0, 9, 3.5], [-3, -4, 3]]) fillEllipse(ctx, x + dx, y + dy, r, r * 0.7, 'rgba(30,24,20,0.55)');
  // a last wisp off the top of your head
  const k = (t * 0.6) % 1;
  fillCircle(ctx, x + Math.sin(t * 2) * 4, y - 8 * sc - k * 30, 3 + k * 6, `rgba(90,90,90,${(0.45 * (1 - k)).toFixed(3)})`);
}
