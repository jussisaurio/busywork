// The Last Bus's end cards (src/levels/meeting/end-scenes.js documents the format): small drawn scenes, the people in
// level 1's looks, the clocks, stepladders and bus from painters.js. Each icon row retells its picture left to right.
import { easeOutCubic, rrect } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble, floorCarpet, confetti } from '../../render/tableau.js';
import { drawBigClock, drawStepladder, drawBus, drawExhaust, drawStopSign, drawCoatStand } from './painters.js';
import { faceFor, HOME_AT } from './clocks.js';

const START = 15 * 60; // the clock faces' day (cast.js START)
const BUS_AT = 90; // 4:30, in game minutes (index.js day.meetingAt)
const BOTTOM = TAB.y + TAB.h;
const STONE = ['#c4bcad', '#a99f8e'];
const SLAB = '#cfcbc1';

// --- pieces -----------------------------------------------------------------------------------------------------

// An office back wall across [x, x + w), h px tall, with a baseboard.
function wall(ctx, x, w, h) {
  ctx.fillStyle = C.wallFront;
  ctx.fillRect(x, TAB.y, w, h);
  ctx.fillStyle = C.wallGroove;
  for (let gx = x + 24; gx < x + w; gx += 48) ctx.fillRect(gx, TAB.y, 2, h);
  ctx.fillStyle = C.baseboard;
  ctx.fillRect(x, TAB.y + h - 5, w, 5);
  ctx.fillStyle = 'rgba(20,12,8,0.18)';
  ctx.fillRect(x, TAB.y + h, w, 6);
}

// The street, seen from the pavement: the building's stone front (h px), the pavement, the kerb at kerbY, the road.
function street(ctx, x, w, h, kerbY) {
  ctx.fillStyle = STONE[0];
  ctx.fillRect(x, TAB.y, w, h);
  ctx.fillStyle = STONE[1];
  for (let gy = TAB.y + 22; gy < TAB.y + h; gy += 22) ctx.fillRect(x, gy, w, 1.5);
  for (let gy = TAB.y, r = 0; gy < TAB.y + h; gy += 22, r++) {
    for (let gx = x + (r % 2 ? 0 : 30); gx < x + w; gx += 60) ctx.fillRect(gx, gy, 1.5, 22);
  }
  ctx.fillStyle = 'rgba(20,12,8,0.2)';
  ctx.fillRect(x, TAB.y + h, w, 5);
  ctx.fillStyle = SLAB;
  ctx.fillRect(x, TAB.y + h + 5, w, kerbY - TAB.y - h - 5);
  ctx.fillStyle = 'rgba(80,72,60,0.2)';
  for (let gx = x; gx < x + w; gx += 44) ctx.fillRect(gx, TAB.y + h, 1.5, kerbY - TAB.y - h);
  for (let gy = TAB.y + h + 30; gy < kerbY; gy += 30) ctx.fillRect(x, gy, w, 1.5);
  ctx.fillStyle = '#4b4b50';
  ctx.fillRect(x, kerbY, w, BOTTOM - kerbY);
  ctx.fillStyle = '#e7e2d6';
  ctx.fillRect(x, kerbY - 3, w, 6);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(x, kerbY + 3, w, 3);
}

// A glass door in the stone front: frame, glass, a handle.
function glassDoor(ctx, x, w, h) {
  ctx.fillStyle = C.glassFrame;
  ctx.fillRect(x - 4, TAB.y + 8, w + 8, h - 4);
  ctx.fillStyle = 'rgba(168,214,234,0.75)';
  ctx.fillRect(x, TAB.y + 12, w, h - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(x + 8, TAB.y + 20, 4, h - 30);
  ctx.fillRect(x + 16, TAB.y + 20, 2, h - 40);
  ctx.fillStyle = C.glassPost;
  ctx.fillRect(x + w / 2 - 1, TAB.y + 12, 2, h - 8);
}

// A glass wall between two panels, floor to ceiling.
function glassWall(ctx, x) {
  ctx.fillStyle = 'rgba(170,215,234,0.55)';
  ctx.fillRect(x, TAB.y, 14, TAB.h);
  ctx.fillStyle = C.glassEdge;
  ctx.fillRect(x - 2, TAB.y, 3, TAB.h);
  ctx.fillRect(x + 13, TAB.y, 3, TAB.h);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 3; i++) ctx.fillRect(x + 4 + i * 3, TAB.y + 30 + i * 70, 2, 34);
}

// The big clock with its stepladder under it, on a wall of height wallH.
function clockAndLadder(ctx, x, r, minute, tilt, wallH, ladderH, ahead = 0) {
  const feet = TAB.y + wallH + ladderH - 4;
  drawStepladder(ctx, x, feet, ladderH);
  drawBigClock(ctx, x, TAB.y + r + 10, r, minute, START, tilt, ahead);
}

// An office window at (wx, TAB.y + 14), ww x wh: the street outside, the bus pulling away (empty, without you).
function windowWithBus(ctx, t, e, wx, ww, wh) {
  const wy = TAB.y + 14;
  ctx.save();
  ctx.beginPath();
  ctx.rect(wx, wy, ww, wh);
  ctx.clip();
  ctx.fillStyle = '#f2d9b0'; // late afternoon
  ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = STONE[0];
  ctx.fillRect(wx, wy + 40, ww, 34);
  ctx.fillStyle = SLAB;
  ctx.fillRect(wx, wy + 74, ww, 26);
  ctx.fillStyle = '#4b4b50';
  ctx.fillRect(wx, wy + 100, ww, wh - 100);
  ctx.fillStyle = '#e7e2d6';
  ctx.fillRect(wx, wy + 98, ww, 4);
  const bx = wx + 70 - e * 18 - e * e * 1.2; // pulls away slowly, so it stays in the window for a while
  drawBus(ctx, bx, wy + wh - 4, 150, 64, 0);
  drawExhaust(ctx, bx + 150, wy + wh - 12, t, 5);
  ctx.restore();
  ctx.strokeStyle = C.glassFrame;
  ctx.lineWidth = 6;
  ctx.strokeRect(wx, wy, ww, wh);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(wx + 20, wy + 10, 6, wh - 20);
  ctx.fillRect(wx + 32, wy + 10, 3, wh - 30);
}

// Your desk seen from the side, its top at y, x..x+w: walnut, a monitor, a paper or two.
function desk(ctx, x, y, w) {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, x + 4, y + 8, w, 46, 10);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, x, y, w, 48, 10);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, x, y, w, 38, 10);
  ctx.fill();
  ctx.fillStyle = '#37494c';
  rrect(ctx, x + w * 0.55, y - 34, 44, 32, 3);
  ctx.fill();
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(x + w * 0.55 + 19, y - 3, 6, 6);
}

// A soft glow behind something the card is about (the coat still on its stand).
function glow(ctx, x, y, r, t) {
  const g = ctx.createRadialGradient(x, y, 2, x, y, r);
  const a = 0.55 + Math.sin(t * 4) * 0.15;
  g.addColorStop(0, `rgba(255,236,150,${a})`);
  g.addColorStop(1, 'rgba(255,236,150,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function figure(t, scale, dir, extra) {
  const p = person(t);
  p.dir = dir;
  p.head = dir;
  p.scale = scale;
  return Object.assign(p, extra);
}

// A backpack on the back of a person drawn at (x, y) at scale sc, walking right: drawn before the person, so the body
// covers its front. Going home, drawn (nothing in a hand or on a back is an emoji).
const PACK = ['#7a4b2a', '#5b361d'];
function backpack(ctx, x, y, sc, color = PACK) {
  const w = 6.5 * sc;
  const h = 10 * sc;
  const x0 = x - 9.5 * sc;
  const y0 = y - 9 * sc;
  ctx.fillStyle = color[1];
  rrect(ctx, x0, y0, w + 3 * sc, h, 2.2 * sc);
  ctx.fill();
  ctx.fillStyle = color[0];
  rrect(ctx, x0 + 0.6 * sc, y0 + 0.4 * sc, w + 2 * sc, h - 1.6 * sc, 2 * sc);
  ctx.fill();
  ctx.fillStyle = color[1]; // the flap and its buckle
  ctx.fillRect(x0 + 0.6 * sc, y0 + 3.2 * sc, w + 2 * sc, 0.8 * sc);
  ctx.fillStyle = '#d9c38a';
  ctx.fillRect(x0 + 1.8 * sc, y0 + 3 * sc, 1.4 * sc, 1.4 * sc);
}

// Walk-in: x eased from x0 to x1 over dur seconds of the card.
const walkIn = (e, x0, x1, dur) => x0 + (x1 - x0) * easeOutCubic(e / dur);

// You in the bus door, cheering, smug: the payoff of both wins. The bus stands at the kerb, its doors open.
function youOnTheBus(ctx, game, t, e, x, kerbY, len, h) {
  drawStopSign(ctx, x + len * 0.62, kerbY - 6, 150);
  const busY = kerbY + 38;
  drawBus(ctx, x, busY, len, h, 1);
  const doorX = x + h * 0.32 + h * 0.21;
  const p = figure(t, 2.1, Math.PI / 2, { arms: 'cheer', smug: true });
  p.head = Math.PI / 2 + Math.sin(t * 4) * 0.25;
  drawPerson(ctx, game.level.looks.player, p, doorX, busY - 30 - Math.abs(Math.sin(t * 6)) * 5);
}

// --- the scenes -------------------------------------------------------------------------------------------------

// The clock win: under his crooked clock (it says 4:50) the boss heads home with his backpack, waving; you are
// already in the door of the bus.
function sceneClock(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, 260, TAB.h, C.officeA, C.officeB);
  wall(ctx, TAB.x, 260, 104);
  clockAndLadder(ctx, 280, 30, 110, 0.4, 104, 64, game.world?.bossClock || 30);
  const b = figure(t, 2.3, 0, { pose: 'walk', moving: true, phase: t * 7 });
  b.head = 0.9;
  const bx = walkIn(e, 230, 360, 2.4);
  backpack(ctx, bx, 284, 2.3);
  drawPerson(ctx, game.level.looks.boss, b, bx, 284);
  if (e > 0.6) bubble(ctx, ['👋'], bx + 6, 210, e - 0.6);
  street(ctx, TAB.x + 274, TAB.w - 274, 64, 286);
  glassWall(ctx, TAB.x + 260);
  confetti(ctx, TAB.x + 280, TAB.w - 280, TAB.y, TAB.h, e, 26);
  youOnTheBus(ctx, game, t, e, 500, 286, 250, 104);
}

// The herd win: under the crooked open-plan clock (the time it showed him, red where it gained) the boss, his
// coffee mug still in his hand, heads home in his coat, 😮 at the clock; the coat rack stands empty. You are in the
// door of the bus.
function sceneHerd(ctx, game, t, e) {
  const W = 330;
  floorCarpet(ctx, TAB.x, TAB.y, W, TAB.h, C.officeA, C.officeB);
  wall(ctx, TAB.x, W, 96);
  const shown = game.world?.herdShown || HOME_AT;
  clockAndLadder(ctx, 430, 26, shown, -0.45, 96, 56, game.world?.openClock || 60);
  drawCoatStand(ctx, 212, 250, 110, false);
  const dx = walkIn(e, -40, 0, 2.6);
  const b = figure(t, 1.9, 0, { pose: 'walk', moving: true, phase: t * 7 + 440, arms: 'carry', item: '#mug' });
  b.head = -1.2; // in his coat, mug in hand, a look up at the clock
  drawPerson(ctx, game.level.looks.boss, b, 440 + dx, 292);
  if (e > 0.4) bubble(ctx, [faceFor(shown), '😮'], 476 + dx, 236, e - 0.4, 'realize');
  street(ctx, TAB.x + W + 14, TAB.w - W - 14, 64, 286);
  glassWall(ctx, TAB.x + W);
  confetti(ctx, TAB.x + W + 20, TAB.w - W - 20, TAB.y, TAB.h, e, 20);
  youOnTheBus(ctx, game, t, e, 556, 286, 206, 96);
}

// Caught in the street, early: you left while he was still in. Through the lobby window, in bright daylight, his
// coat hangs on the hallway rack (glowing: the thing you didn't check) under the clock at the time it was; he comes
// out of the lobby door in his shirtsleeves, pointing you back in. No bus: it is hours off.
function sceneFetched(ctx, game, t, e) {
  const w = game.world || {};
  const minute = game.clock?.minute ?? 16;
  ctx.fillStyle = '#d8eef6'; // daylight over the street
  ctx.fillRect(TAB.x, TAB.y, TAB.w, TAB.h);
  street(ctx, TAB.x, TAB.w, 124, 280);
  glassDoor(ctx, 656, 80, 124);
  const wx = 236;
  const wy = TAB.y + 12;
  const ww = 150;
  const wh = 96;
  ctx.save();
  ctx.beginPath();
  ctx.rect(wx, wy, ww, wh);
  ctx.clip();
  ctx.fillStyle = C.officeA;
  ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = C.wallFront;
  ctx.fillRect(wx, wy, ww, 50);
  drawBigClock(ctx, wx + 46, wy + 25, 17, minute + (w.openClock || 0), START, w.openClock ? 0.4 : 0, w.openClock || 0);
  glow(ctx, wx + 108, wy + wh - 42, 40, t);
  drawCoatStand(ctx, wx + 108, wy + wh - 6, 80, w.coat !== 'boss');
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(wx + 70, wy, 7, wh);
  ctx.fillRect(wx + 82, wy, 3, wh);
  ctx.restore();
  ctx.strokeStyle = C.glassFrame;
  ctx.lineWidth = 6;
  ctx.strokeRect(wx, wy, ww, wh);
  drawStopSign(ctx, 470, 272, 150);
  // you, caught at the stop, a look back over your shoulder
  const p = figure(t, 2.3, 0, { sweat: true });
  p.head = Math.PI - 0.5 + Math.sin(t * 1.6) * 0.15;
  drawPerson(ctx, game.level.looks.player, p, 540, 270);
  bubble(ctx, ['😳'], 530, 196, e, 'thought');
  // the boss in the door, pointing
  const b = figure(t, 2.4, Math.PI, { arms: 'point', angry: true, jacket: w.coat === 'boss' });
  b.head = Math.PI - 0.15;
  drawPerson(ctx, game.level.looks.boss, b, walkIn(e, 720, 690, 1), 274);
  bubble(ctx, ['😠'], 700, 192, e, 'alert');
}

// Fetched back at 4:30: you went to the stop while he was still in, and he rang you (📳). He brought you back to your desk (the last frame
// of the day has you there), stands over you pointing at the screen, his coat still on the rack behind him; out of
// the window the bus pulls away without you.
function sceneStop(ctx, game, t, e) {
  const w = game.world || {};
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  wall(ctx, TAB.x, TAB.w, 170);
  windowWithBus(ctx, t, e, 470, 270, 136);
  glow(ctx, 244, 240, 60, t);
  drawCoatStand(ctx, 244, 306, 130, w.coat !== 'boss');
  const p = figure(t, 2.3, -Math.PI / 2 + 0.6, { pose: 'sit', arms: 'type', sweat: true });
  p.head = -Math.PI / 2 + 1.2 + Math.sin(t * 1.5) * 0.15; // a look at the window
  drawPerson(ctx, game.level.looks.player, p, 480, 262);
  desk(ctx, 390, 280, 180);
  bubble(ctx, ['📳', '😩'], 490, 182, e, 'thought');
  const b = figure(t, 2.4, 0, { arms: 'point', angry: true, jacket: w.coat === 'boss' });
  b.head = 0.2;
  drawPerson(ctx, game.level.looks.boss, b, walkIn(e, 280, 340, 1.2), 280);
  bubble(ctx, ['😠'], 340, 196, e, 'alert');
}

// The fail: 4:30 and the boss still at his desk in his shirtsleeves, his coat on its rack, under his clock (the
// time it shows, crooked if you pushed it), so you are still at your desk. Out of the window your bus drives off.
function sceneFail(ctx, game, t, e) {
  const w = game.world || {};
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  wall(ctx, TAB.x, TAB.w, 170);
  windowWithBus(ctx, t, e, 520, 226, 136);
  // his clock, his coat; he works on
  drawBigClock(ctx, 300, TAB.y + 48, 30, BUS_AT + (w.bossClock || 0), START, w.bossClock ? 0.4 : 0, w.bossClock || 0);
  drawCoatStand(ctx, 448, 306, 130, w.coat !== 'boss');
  const b = figure(t, 2.2, Math.PI / 2, { pose: 'sit', arms: 'type', jacket: w.coat === 'boss' });
  b.head = Math.PI / 2 + Math.sin(t * 1.3) * 0.1;
  drawPerson(ctx, game.level.looks.boss, b, 300, 262);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, 226, 282, 156, 46, 10);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, 222, 274, 156, 48, 10);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, 222, 274, 156, 38, 10);
  ctx.fill();
  // you, at your desk (where the day's last frame leaves you), looking out at the bus
  const p = figure(t, 2.3, -Math.PI / 2 + 0.4, { pose: 'sit', arms: 'idle', sweat: true });
  p.head = -Math.PI / 2 + 0.3 + Math.sin(t * 2) * 0.15;
  drawPerson(ctx, game.level.looks.player, p, 640, 268);
  desk(ctx, 570, 288, 150);
  bubble(ctx, ['😩'], 660, 190, e, 'thought');
}

// Caught: you are up the stepladder at his clock (the time you pushed it to); the boss is right below, pointing up
// at you. Caught out in the street instead: he fetches you (sceneFetched).
function sceneCaught(ctx, game, t, e) {
  if (game.caught?.reason === 'scene') {
    sceneFetched(ctx, game, t, e);
    return;
  }
  const w = game.world || {};
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  wall(ctx, TAB.x, TAB.w, 120);
  const x = 420;
  drawStepladder(ctx, x, 318, 92);
  drawBigClock(ctx, x - 4, TAB.y + 29, 24, (game.clock?.minute ?? 25) + (w.bossClock || 0), START, w.bossClock ? 0.22 : 0);
  const p = figure(t, 2.1, -Math.PI / 2, { arms: 'reach', sweat: true });
  p.head = -Math.PI / 2 + 1.1 + Math.sin(t * 9) * 0.2; // looking down over his shoulder
  drawPerson(ctx, game.level.looks.player, p, x, 222);
  const b = figure(t, 2.6, Math.PI - 0.3, { arms: 'point', angry: true, jacket: w.coat === 'boss' });
  b.head = Math.PI - 0.6;
  const jab = Math.max(0, Math.sin(t * 5)) * 3;
  drawPerson(ctx, game.level.looks.boss, b, 610 - jab, 290);
  bubble(ctx, ['😠'], 616, 210, e, 'alert');
}

// Blamed: it worked, the boss went home (the coat rack stands empty, his office dark), and the others with him;
// you are still at your desk in the empty office (where the day's last frame left you), and out of the window the
// bus pulls away.
function sceneBlamed(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  wall(ctx, TAB.x, TAB.w, 170);
  windowWithBus(ctx, t, e, 470, 270, 136);
  drawCoatStand(ctx, 250, 270, 130, false); // the empty rack
  desk(ctx, 210, 292, 110); // an empty desk
  const p = figure(t, 2.3, -Math.PI / 2 + 0.6, { pose: 'sit', arms: 'idle', sweat: true });
  p.head = -Math.PI / 2 + 1.2 + Math.sin(t * 3) * 0.2;
  drawPerson(ctx, game.level.looks.player, p, 480, 262);
  desk(ctx, 390, 280, 180);
  bubble(ctx, ['😰'], 490, 182, e, 'thought');
}

export const END_SCENES = {
  kindOf: (o) => {
    if (o?.result === 'win') return o.routes?.includes?.('herd') ? 'herd' : 'clock';
    if (o?.result === 'fail' && o.why === 'stop') return 'stop'; // index.js meeting.verdict: at the stop, he still in
    if (o?.result === 'caught' && o.why === 'street') return 'street'; // clocks.js: caught by the scene role
    return o?.result ?? 'fail';
  },
  scenes: {
    clock: { win: true, icons: ['🕐', '@boss', '👋', '🚌', '@player'], draw: sceneClock },
    herd: { win: true, icons: ['@boss', '☕', '🕔', '😮', '🚌', '@player'], draw: sceneHerd },
    fail: { win: false, icons: ['@boss', '🕐', '@player', '😩', '🚌', '💨'], draw: sceneFail },
    // at the stop while his coat was still on the rack: fetched back to your desk, the bus goes
    stop: { win: false, icons: ['🧥', '📱', '@player', '@boss', '😠', '🚌', '💨'], draw: sceneStop },
    // out in the street while his coat still hung on the rack
    street: { win: false, icons: ['🧥', '@player', '😳', '@boss', '😠'], draw: sceneFetched },
    // up the stepladder (sceneCaught; it draws the street too if an outcome reaches it without its why)
    caught: { win: false, icons: ['@player', '😳', '@boss', '😠'], draw: sceneCaught },
    blamed: { win: false, icons: ['@boss', '👋', '🚌', '💨', '@player', '😰'], draw: sceneBlamed },
  },
};
