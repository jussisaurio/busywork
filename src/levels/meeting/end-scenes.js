// The meeting level's end screens: which scene an outcome gets, the icon row under it and its hand-drawn
// picture. src/render/screens.js reads this as level.endScenes:
//   kindOf(outcome)  -> a key of scenes (outcome may be null, outcome.routes may not be an array)
//   scenes[kind]     -> { win, icons, draw }
//     win            -> card border: teal when true, tomato when false
//     icons          -> emoji row under the picture, centred (any count): the punchline, speech
//     draw(ctx, game, t, e, outcome) -> paints the picture inside TAB (screen space, already clipped);
//                       e = seconds since the card came up. Objects in it are drawn (drawThing, painters.js), never
//                       emoji; only bubbles speak emoji (DESIGN.md "Visual language" rule 5)
import { clamp, easeOutBack, easeOutCubic, rrect, fillEllipse, drawScreen, hash } from '../../render/util.js';
import { drawThing } from '../../render/things.js';
import { C, TOMATO, OLIVE } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawProjector } from '../../render/world.js';
import { TAB, person, bubble, floorCarpet, floorTiles, confetti, backWall } from '../../render/tableau.js';
import { chair } from '../../render/tableau-furniture.js';
import { findNpc } from '../../game/perception.js';
import { tableauBib } from './end-scenes-combo.js';
import { popper, cricket } from './painters.js';
import { tableauTypewriter } from './end-scenes-more.js';

// Catches with a scene of their own (outcome.why from rules.js catchNow; the scene key is the why).
const MORE_CAUGHT = new Set(['typewriter']);
MORE_CAUGHT.add('bib'); // caught over the mustard (clocks.js): end-scenes-combo.js

const B_ANGRY = ['😠'];
const B_POINT_YOU = ['👉', '@player'];
const B_WHAT = ['❓'];
const B_BLAME_YOU = ['😠', '👉', '@player'];
const B_BLAME_KEV = ['😠', '👉', '@kev'];
const B_PROJ = ['📽️', '💥', '🙅'];
const B_OUT = ['👋', '🚪'];
const B_DOTS = ['📊', '❓'];
const B_MUG = ['☕', '😠', '👉', '@player'];
const B_KEV = ['☕', '@kev'];

function endKind(o) {
  if (!o) return 'fail';
  const routes = Array.isArray(o.routes) ? o.routes : [];
  // why 'samaritan': you let the boss in off the balcony (clocks.js bossLetIn). Holding his card: caught, and locked
  // out yourself. Without it: no route, and his arm round you at the blank screen.
  if (o.result === 'caught') {
    if (o.why === 'samaritan') return 'samaritanCaught';
    return MORE_CAUGHT.has(o.why) ? o.why : 'caught'; // end-scenes-more.js
  }
  if (o.result === 'fail' && o.why === 'samaritan') return 'samaritan';
  // why 'home' / 'homeKev': you just went home (interactions.js go_home); with Kev, if he was on his way out too.
  if (o.result === 'fail' && (o.why === 'home' || o.why === 'homeKev')) return o.why;
  // o.why: the verdict's reason (verdict.js): 'mug'/'desk' the empty mug was yours; 'kev' it was on Kev's desk.
  if (o.result === 'blamed' && (o.why === 'mug' || o.why === 'desk')) return 'mug';
  // o.where (scenario.js, meeting.where): at 4:00 you were in the restroom; you come out late, drying your hands.
  if (o.result === 'blamed') return o.where === 'restroom' ? 'restroom' : 'blamed';
  if (o.result === 'win') return routes.includes('keycard') ? 'keycard' : o.why === 'kev' ? 'kev' : 'projector';
  return 'fail';
}

function bossJacket(game) {
  const boss = game.npcs && findNpc(game, 'boss');
  return boss ? game.world.jacket === boss.id : true;
}

// The keycard win, either side of the fire door. Inside (left) you cheer in the empty office. Outside (right), on
// the smokers' balcony, the boss pounds on the fire door, its card reader blinking red, butts ground out at his feet.
const B_LOCKED = [['😠', '🚪', '🪪'], ['👊', '👊', '🚪']];
function tableauKeycard(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, 286, TAB.h);
  balconySlab(ctx, 484, TAB.y, 286, TAB.h);
  confetti(ctx, TAB.x, 280, TAB.y, TAB.h, e, 36);
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = p.dir + Math.sin(t * 4) * 0.25;
  p.arms = 'cheer';
  p.smug = true;
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, 340, 280 - Math.abs(Math.sin(t * 6)) * 8);
  // his fists land about twice a second; the door jumps on each
  const beat = (t * 2.2) % 1;
  const hit = beat < 0.18;
  fireDoorSide(ctx, 470, t, hit ? Math.sin(beat * 90) * 2 : 0);
  const b = person(t);
  b.dir = Math.PI; // facing the door
  b.head = Math.PI + Math.sin(t * 2) * 0.1;
  b.arms = 'bang';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, game.level.looks.boss, b, 548, 272);
  if (hit) { // impact rings off the steel
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2;
    for (let r = 0; r < 2; r++) {
      ctx.beginPath();
      ctx.arc(494, 222, 8 + r * 7 + beat * 20, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    }
  }
  bubble(ctx, B_LOCKED[Math.floor(e / 1.6) % 2], 560, 196, e % 1.6, 'alert');
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

// The balcony: the sky and the rooftops over the railing at the back, concrete pavers, a sand-bucket ashtray in
// the far corner and his butts all round it.
function balconySlab(ctx, x, y, w, h) {
  ctx.fillStyle = '#a7c9de';
  ctx.fillRect(x, y, w, 70);
  for (const [cx, cy] of [[560, y + 22], [700, y + 34]]) fillEllipse(ctx, cx, cy, 30, 8, '#c9dde8');
  ctx.fillStyle = '#7d8a96';
  for (let i = 0; i < 6; i++) ctx.fillRect(x + 10 + i * 48, y + 44 - (i % 3) * 10, 36, 30 + (i % 3) * 10);
  ctx.fillStyle = '#a3a8ab';
  ctx.fillRect(x, y + 70, w, h - 70);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let gx = 0; gx <= w; gx += 48) ctx.fillRect(x + gx, y + 70, 1.5, h - 70);
  for (let gy = 70; gy <= h; gy += 40) ctx.fillRect(x, y + gy, w, 1.5);
  ctx.fillStyle = '#5c6670';
  ctx.fillRect(x, y + 62, w, 5);
  for (let rx = x + 10; rx < x + w; rx += 22) ctx.fillRect(rx, y + 62, 3, 14);
  ctx.fillStyle = '#c0392b';
  rrect(ctx, 720, 250, 24, 24, 4);
  ctx.fill();
  fillEllipse(ctx, 732, 251, 12, 4, '#d8c690');
  for (let i = 0; i < 14; i++) {
    const a = i * 2.39996;
    const r = 18 + (i % 5) * 7;
    ctx.save();
    ctx.translate(722 + Math.cos(a) * r, 282 + Math.sin(a) * r * 0.35);
    ctx.rotate(a);
    ctx.fillStyle = '#f2ede2';
    ctx.fillRect(-4, -1.2, 5, 2.4);
    ctx.fillStyle = '#d58a3a';
    ctx.fillRect(1, -1.2, 3, 2.4);
    ctx.restore();
  }
}

// The wall between them, end on, with the red fire door in it (shoved dx px by his fists), the EXIT sign over it
// and the card reader on his side, blinking red.
function fireDoorSide(ctx, x, t, dx) {
  ctx.fillStyle = C.wallFront;
  ctx.fillRect(x, TAB.y, 18, TAB.h);
  ctx.fillStyle = '#4a4f55';
  ctx.fillRect(x - 2, 150, 22, 140);
  ctx.fillStyle = '#b8402f';
  ctx.fillRect(x + 2 + dx, 154, 14, 134);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(x + 2 + dx, 154, 3, 134);
  ctx.fillStyle = '#b9bfc3'; // push bar, on the inside
  ctx.fillRect(x - 6 + dx, 222, 8, 4);
  ctx.fillStyle = '#1f7a3e'; // EXIT
  rrect(ctx, x - 12, 132, 42, 14, 2);
  ctx.fill();
  ctx.fillStyle = '#d9ffe4';
  ctx.fillRect(x - 6, 137, 30, 4);
  ctx.fillStyle = '#2b2e33'; // the reader, outside
  rrect(ctx, x + 22, 200, 10, 16, 2);
  ctx.fill();
  const on = Math.sin(t * 7) > 0;
  if (on) fillEllipse(ctx, x + 27, 206, 7, 7, 'rgba(255,59,48,0.3)');
  fillEllipse(ctx, x + 27, 206, 3, 3, on ? '#ff3b30' : '#5a1f18');
}

// The projector win: no projector, no slides. The boss points at the smoking projector, then waves everyone out;
// Lin is already getting up. You sit at your place, the picture of patience.
function tableauProjector(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, '#3d7a72', '#397369');
  drawScreen(ctx, 392, 106, 176, 70, { bar: [6, 6, 6], face: '#d9d6cc', scan: ['rgba(0,0,0,0.08)', 6, 11, t] });
  const out = e > 2.2; // he points, then waves them out
  const l = person(t);
  l.dir = out ? Math.PI * 0.9 : 0;
  l.head = out ? Math.PI * 0.9 : Math.sin(t * 1.5) * 0.3 + 0.2;
  l.pose = out ? 'stand' : 'sit';
  l.arms = out ? 'folder' : 'desk';
  l.scale = 2;
  drawPerson(ctx, game.level.looks.lin, l, out ? 250 : 270, 222);
  const b = person(t);
  b.dir = out ? Math.PI : Math.PI * 0.75; // at the projector, then at the door (left)
  b.head = b.dir;
  b.arms = 'point';
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, game.level.looks.boss, b, 660, 222);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, 262, 238, 440, 86, 30);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, 256, 228, 440, 86, 30);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, 256, 228, 440, 76, 30);
  ctx.fill();
  ctx.save();
  ctx.translate(470, 268);
  ctx.scale(3, 3);
  drawProjector(ctx, 0, 0, 'broken', 0, t);
  ctx.restore();
  // you, in your tomato chair in front of the table, hands folded
  chair(ctx, 560, 330, TOMATO, 2.4, -Math.PI / 2);
  const p = person(t);
  p.dir = -Math.PI / 2;
  p.head = -Math.PI / 2 + Math.sin(t * 0.8) * 0.2;
  p.pose = 'sit';
  p.arms = 'desk';
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, 560, 322);
  bubble(ctx, out ? B_OUT : B_PROJ, 660, 150, e);
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

// The Good Samaritan, caught: you let him in, he hugged you, and over your shoulder saw his card in your hand. The
// keycard win the other way round: you on the balcony, fists on the fire door; he, inside, dangles his card at you.
const B_LET_ME_IN = [['🙏', '🚪'], ['👊', '👊', '🚪']];
function tableauSamaritanCaught(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, 286, TAB.h);
  balconySlab(ctx, 484, TAB.y, 286, TAB.h);
  const b = person(t);
  b.dir = 0; // facing the door, and you behind it
  b.head = Math.sin(t * 1.6) * 0.12;
  b.arms = 'holdout';
  b.item = '#keycard';
  b.smug = true;
  b.jacket = bossJacket(game);
  b.scale = 2.3;
  drawPerson(ctx, game.level.looks.boss, b, 380, 276);
  bubble(ctx, e < 2.4 ? ['🪪', '😏'] : ['👋'], 380, 186, e < 2.4 ? e : e - 2.4);
  const beat = (t * 2.2) % 1;
  const hit = beat < 0.18;
  fireDoorSide(ctx, 470, t, hit ? Math.sin(beat * 90) * 2 : 0);
  const p = person(t);
  p.dir = Math.PI;
  p.head = Math.PI + Math.sin(t * 2) * 0.1;
  p.arms = 'bang';
  p.sweat = true;
  p.scale = 2.2;
  drawPerson(ctx, game.level.looks.player, p, 548, 272);
  bubble(ctx, B_LET_ME_IN[Math.floor(e / 1.6) % 2], 560, 196, e % 1.6, 'alert');
}

// The Good Samaritan, not caught: you let him in and he's so grateful he presents with you, his arm round your
// shoulder, beaming at the room, in front of the blank screen. The cricket hops.
function tableauSamaritan(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  drawScreen(ctx, 382, 104, 196, 84, {
    glow: ['rgba(255,255,235,0.35)', 10, 6, 6], bar: [6, 6, 6], face: '#ffffff', edge: 'rgba(0,0,0,0.12)',
  });
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = p.dir + Math.sin(t * 2.6) * 0.5;
  p.sweat = true;
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, 456, 266);
  const b = person(t);
  b.dir = Math.PI / 2;
  b.head = Math.PI / 2 - 0.5 + Math.sin(t * 1.2) * 0.15; // beaming at you, then the room
  b.smug = true;
  b.jacket = bossJacket(game);
  b.scale = 2.3;
  const squeeze = Math.max(0, Math.sin(t * 3)) * 2;
  drawPerson(ctx, game.level.looks.boss, b, 516 - squeeze, 262);
  // his arm, round your shoulder: a sleeve from his shoulder across your back to a hand on your far shoulder
  const sleeve = bossJacket(game) ? game.level.looks.boss.body : game.level.looks.boss.shirt;
  ctx.strokeStyle = sleeve;
  ctx.lineCap = 'round';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(502 - squeeze, 257);
  ctx.quadraticCurveTo(474, 246, 444 + squeeze, 256);
  ctx.stroke();
  fillEllipse(ctx, 442 + squeeze, 257, 5.5, 5, game.level.looks.boss.skin);
  const k = person(t);
  k.dir = 0.25;
  k.head = 0.05;
  k.pose = 'sit';
  k.arms = 'desk';
  k.glance = 1;
  k.scale = 2;
  if (!game.world || !game.world.kevGone) drawPerson(ctx, game.level.looks.kev, k, 262, 206);
  const l = person(t);
  l.dir = -0.15;
  l.head = -0.25;
  l.pose = 'sit';
  l.arms = 'desk';
  l.glance = 1;
  l.scale = 2;
  drawPerson(ctx, game.level.looks.lin, l, 300, 300);
  bubble(ctx, e < 2.6 ? ['🤗'] : ['👏', '@player'], 530, 180, e < 2.6 ? e : e - 2.6);
  const hop = Math.abs(Math.sin(e * 5));
  cricket(ctx, 600 + Math.sin(e * 0.9) * 60, 322 - hop * 14, 22);
}

// You went home. On the bus, by the window, the town sliding past; the phone in your lap buzzes, and buzzes, the boss's
// face on its screen. With Kev (you left together at 3:00) he sits beside you, untroubled.
const BUS_SEATS = [300, 410, 520, 630];
const BUS_BLUE = ['#3f6d9e', '#2b4e74'];
function tableauHome(ctx, game, t, e, o) {
  const withKev = o?.why === 'homeKev';
  busInside(ctx, t);
  for (const x of BUS_SEATS) chair(ctx, x, 268, BUS_BLUE, 2.6, Math.PI / 2);
  const buzz = e > 1.2 && (e % 1.4) < 0.7; // the phone buzzes in bursts, from a beat after the card comes up
  // Kev beside you (he left at 3:00 as always; today you went with him), smug, eyes out of the window
  if (withKev) {
    const k = person(t);
    k.pose = 'sit';
    k.arms = 'desk';
    k.smug = true;
    k.head = Math.PI / 2 - 0.5 + Math.sin(t * 0.7) * 0.15;
    k.scale = 2.3;
    drawPerson(ctx, game.level.looks.kev, k, BUS_SEATS[2], 252);
  }
  // you, eyes down on the phone; the guilt shows once it buzzes
  const p = person(t);
  p.pose = 'sit';
  p.arms = 'desk';
  p.head = Math.PI / 2 + (buzz ? Math.sin(t * 9) * 0.2 : 0);
  p.sweat = buzz;
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, BUS_SEATS[1], 252);
  phoneWithBoss(ctx, game, t, BUS_SEATS[1] + 2, 286, buzz);
  bubble(ctx, e < 1.2 ? ['😌'] : ['😬'], BUS_SEATS[1], 178, e < 1.2 ? e : e - 1.2, 'thought', 1.2);
  if (withKev) bubble(ctx, ['😌'], BUS_SEATS[2], 178, e, 'thought', 1.2);
}

// The inside of a city bus: a panelled side under a band of windows, the town scrolling past, a yellow grab rail,
// and a ribbed grey floor.
const TOWN = ['#c98a6a', '#9fb2a0', '#d8c69a', '#a89cb8'];
function busInside(ctx, t) {
  ctx.fillStyle = '#596067';
  ctx.fillRect(TAB.x, TAB.y, TAB.w, TAB.h); // floor
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let y = TAB.y + 130; y < TAB.y + TAB.h; y += 9) ctx.fillRect(TAB.x, y, TAB.w, 3);
  ctx.fillStyle = '#d5dbdf'; // the side panel
  ctx.fillRect(TAB.x, TAB.y, TAB.w, 124);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(TAB.x, TAB.y + 124, TAB.w, 6);
  const top = TAB.y + 10;
  const h = 78;
  const scroll = (t * 70) % 1840;
  for (const [x, w] of [[TAB.x + 16, 170], [TAB.x + 204, 170], [TAB.x + 392, 172]]) {
    ctx.save();
    ctx.beginPath();
    rrect(ctx, x, top, w, h, 8);
    ctx.clip();
    ctx.fillStyle = '#bfe0ee';
    ctx.fillRect(x, top, w, h);
    // the town going by: houses, and a lamp post now and then
    for (let i = 0; i < 40; i++) {
      let bx = TAB.x + i * 46 - scroll;
      if (bx < TAB.x - 60) bx += 1840;
      if (bx + 50 < x || bx > x + w) continue;
      const bh = 26 + hash(i, 7) * 40;
      ctx.fillStyle = TOWN[i % 4];
      ctx.fillRect(bx, top + h - bh, 42, bh);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      for (let wy = top + h - bh + 6; wy < top + h - 8; wy += 12) {
        ctx.fillRect(bx + 8, wy, 8, 6);
        ctx.fillRect(bx + 26, wy, 8, 6);
      }
      if (i % 3 === 0) {
        ctx.fillStyle = '#3e4448';
        ctx.fillRect(bx + 44, top + 10, 3, h);
        ctx.fillRect(bx + 36, top + 10, 14, 3);
      }
    }
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; // glare
    ctx.fillRect(x, top + 6, w, 6);
    ctx.restore();
    ctx.strokeStyle = '#3c4247';
    ctx.lineWidth = 5;
    rrect(ctx, x, top, w, h, 8);
    ctx.stroke();
  }
  ctx.fillStyle = '#e8b830'; // the grab rail along the side
  ctx.fillRect(TAB.x, TAB.y + 104, TAB.w, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(TAB.x, TAB.y + 104, TAB.w, 1.5);
}

// Your phone, in your lap: the boss's face on the screen, and when it buzzes it shivers, with buzz marks either side.
function phoneWithBoss(ctx, game, t, x, y, buzz) {
  const jx = buzz ? Math.sin(t * 70) * 1.6 : 0;
  ctx.save();
  ctx.translate(x + jx, y);
  ctx.fillStyle = '#22262a';
  rrect(ctx, -13, -20, 26, 40, 5);
  ctx.fill();
  ctx.fillStyle = buzz ? '#f2f7fb' : '#c9d6df';
  rrect(ctx, -10, -16, 20, 30, 3);
  ctx.fill();
  ctx.beginPath();
  rrect(ctx, -10, -16, 20, 30, 3);
  ctx.clip();
  const b = person(t);
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 1.1;
  drawPerson(ctx, game.level.looks.boss, b, 0, 4);
  ctx.restore();
  if (!buzz) return;
  ctx.strokeStyle = 'rgba(40,40,40,0.75)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    for (const r of [19, 25]) {
      ctx.beginPath();
      ctx.arc(x, y, r, side < 0 ? Math.PI - 0.5 : -0.5, side < 0 ? Math.PI + 0.5 : 0.5);
      ctx.stroke();
    }
  }
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
  b.badge = !!game.world?.cardBack; // caught with his keycard: it's back on his pocket
  drawPerson(ctx, game.level.looks.boss, b, 262 + jab, 282);
  bubble(ctx, game.world?.cardBack ? ['😠', '🪪'] : B_ANGRY, 276, 206, e, 'alert');
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

// Blamed: the meeting fell apart, but you weren't there. Everyone glares at your empty tomato chair.
// routes add their scars: 'projector' leaves it smoking on the table; 'keycard' leaves the boss's place empty
// (he is locked out on the smokers' balcony).
function tableauBlamed(ctx, game, t, e, o) {
  const routes = Array.isArray(o.routes) ? o.routes : [];
  const smoke = routes.includes('projector');
  const lockedOut = routes.includes('keycard');
  const kev = !game.world || !game.world.kevGone;
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.meetingRug, '#397369');
  meetingScreen(ctx, t, smoke, 0);
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
  chair(ctx, 476, 302, TOMATO, 2.6, -Math.PI / 2); // yours (decor.js)
  // what they're saying
  bubble(ctx, lockedOut && !kev ? B_BLAME_YOU : B_POINT_YOU, 272, 206, e, 'speech', 1.4);
  if (!lockedOut) bubble(ctx, B_ANGRY, 476, 168, e, 'alert');
  if (kev) bubble(ctx, B_WHAT, 680, 206, e, 'thought', 1.4);
}

// Blamed, from the restroom (o.where): the same table staring at your empty chair, and then, after the flush, you
// walk in from the right, wiping your wet hands on your trousers. Everyone turns.
const B_LOO = ['🚽', '🙂'];
function tableauRestroom(ctx, game, t, e, o) {
  tableauBlamed(ctx, game, t, e, o);
  const k = clamp((e - 0.9) / 1.1, 0, 1);
  if (k <= 0) return;
  const p = person(t);
  const walking = k < 1;
  p.dir = Math.PI;
  p.head = Math.PI;
  p.pose = walking ? 'walk' : 'stand';
  p.moving = walking;
  p.phase = t * 7;
  p.arms = walking ? 'walk' : 'pat';
  p.scale = 2.4;
  drawPerson(ctx, game.level.looks.player, p, 800 - easeOutCubic(k) * 60, 282);
  if (!walking) bubble(ctx, B_LOO, 740, 222, e - 2, 'speech', 1.2);
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
  // you, in front of the table, caught with it: eyes darting, the empty mug in your hands
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
  bubble(ctx, B_POINT_YOU, 272, 206, e, 'speech', 1.4);
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
  chair(ctx, 682, 276, OLIVE, 2.6, Math.PI); // Kev's (decor.js)
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
  bubble(ctx, B_BLAME_KEV, 476, 150, e, 'alert');
  bubble(ctx, B_KEV, 272, 206, e, 'thought', 1.4);
}

// The meeting-room screen: a blank glowing slide (nobody presented), or dead if the projector went.
function meetingScreen(ctx, t, dead, dx) {
  const x = 392 + dx;
  const bar = [6, 6, 6];
  if (dead) drawScreen(ctx, x, 104, 176, 62, { bar, face: '#9d9a92', scan: ['rgba(0,0,0,0.1)', 4, 10, t] });
  else drawScreen(ctx, x, 104, 176, 62, { bar, glow: ['rgba(255,255,235,0.3)', 6, 0, 6], glowOverBar: true, face: '#ffffff' });
}

export const END_SCENES = {
  kindOf: endKind,
  scenes: {
    bib: { win: false, icons: ['🥪', '🟡', '⌨️'], draw: tableauBib }, // Lin saw the mustard: you type in a bib (end-scenes-combo.js)
    keycard: { win: true, icons: ['🔒', '🪪', '👊'], draw: tableauKeycard }, // locked out: his card is in your pocket
    projector: { win: true, icons: ['📽️', '💥', '🙅'], draw: tableauProjector }, // the projector died; no meeting
    fail: { win: false, icons: ['📊', '❌', '🦗'], draw: tableauFail },
    caught: { win: false, icons: ['😠', '👉', '📦'], draw: tableauCaught }, // fired: box of desk stuff, pointed at the elevator
    blamed: { win: false, icons: ['🪑', '👉', '😠'], draw: tableauBlamed }, // the meeting happened; your chair was empty
    restroom: { win: false, icons: ['🪑', '🚽', '🙂'], draw: tableauRestroom }, // blamed, and in walks you, hands wet
    mug: { win: false, icons: ['☕', '👉', '😠'], draw: tableauMug }, // the empty mug was yours: in your hand, on your desk
    kev: { win: true, icons: ['☕', '👉', '🪑'], draw: tableauKev }, // the empty mug was on Kev's desk; Kev went home
    samaritan: { win: false, icons: ['🚪', '🤗', '🦗'], draw: tableauSamaritan }, // let him in: grateful, and no slides
    samaritanCaught: { win: false, icons: ['🤗', '🪪', '🔒'], draw: tableauSamaritanCaught }, // let him in, holding his card
    home: { win: false, icons: ['🚌', '📱', '😠'], draw: tableauHome }, // you just went home; the boss is calling
    homeKev: { win: false, icons: ['👋', '🚌', '📱'], draw: tableauHome }, // you went home with Kev at 3:00
    // ---- More scenes (end-scenes-more.js)
    typewriter: { win: false, icons: ['☕', '⌨️', '💥'], draw: tableauTypewriter }, // the coffee went into a typewriter
  },
};
