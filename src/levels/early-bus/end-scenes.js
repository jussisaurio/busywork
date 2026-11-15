// Early Bus's end cards (src/levels/meeting/end-scenes.js documents the format): small drawn scenes, the people in
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
function clockAndLadder(ctx, x, r, minute, tilt, wallH, ladderH) {
  const feet = TAB.y + wallH + ladderH - 4;
  drawStepladder(ctx, x, feet, ladderH);
  drawBigClock(ctx, x, TAB.y + r + 10, r, minute, START, tilt);
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
  clockAndLadder(ctx, 280, 30, 110, 0.34, 104, 64);
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

// The herd win: under the crooked open-plan clock (the time it showed him) the boss, back from his coffee, heads
// home in his coat, ❗ at the clock; his coat stand stands empty, and Lin and Kev follow him out with their backpacks.
// You are in the door of the bus.
function sceneHerd(ctx, game, t, e) {
  const W = 330;
  floorCarpet(ctx, TAB.x, TAB.y, W, TAB.h, C.officeA, C.officeB);
  wall(ctx, TAB.x, W, 96);
  const shown = game.world?.herdShown || HOME_AT;
  clockAndLadder(ctx, 430, 26, shown, -0.34, 96, 56);
  drawCoatStand(ctx, 212, 250, 110, false);
  const dx = walkIn(e, -40, 0, 2.6);
  const walker = (id, x, head, pack) => {
    const p = figure(t, 1.9, 0, { pose: 'walk', moving: true, phase: t * 7 + x });
    p.head = head;
    if (pack) backpack(ctx, x + dx, 292, 1.9);
    drawPerson(ctx, game.level.looks[id], p, x + dx, 292);
  };
  walker('lin', 262, 0.2, true);
  walker('kev', 346, 0.3, true);
  walker('boss', 440, -1.2, false); // in his coat, a look up at the clock
  if (e > 0.4) bubble(ctx, [faceFor(shown), '😮'], 476 + dx, 236, e - 0.4, 'realize');
  street(ctx, TAB.x + W + 14, TAB.w - W - 14, 64, 286);
  glassWall(ctx, TAB.x + W);
  confetti(ctx, TAB.x + W + 20, TAB.w - W - 20, TAB.y, TAB.h, e, 20);
  youOnTheBus(ctx, game, t, e, 556, 286, 206, 96);
}

// The boss fetching you from the street: out of the lobby door in his shirtsleeves (through the window, his coat
// still on its stand and his clock at the time it showed), pointing you back in. At 4:30 the bus pulls away without
// you; earlier, the kerb is empty. Drawn from the day as it ended.
function sceneFetched(ctx, game, t, e) {
  const w = game.world || {};
  const minute = game.clock?.minute ?? BUS_AT;
  street(ctx, TAB.x, TAB.w, 124, 280);
  glassDoor(ctx, 656, 80, 124);
  // the window: his clock, his coat stand
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
  drawBigClock(ctx, wx + 46, wy + 25, 17, minute + (w.bossClock || 0), START, w.bossClock ? 0.3 : 0);
  drawCoatStand(ctx, wx + 108, wy + wh - 6, 80, w.coat !== 'boss');
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(wx + 70, wy, 7, wh);
  ctx.fillRect(wx + 82, wy, 3, wh);
  ctx.restore();
  ctx.strokeStyle = C.glassFrame;
  ctx.lineWidth = 6;
  ctx.strokeRect(wx, wy, ww, wh);
  drawStopSign(ctx, 470, 272, 150);
  if (minute >= BUS_AT - 1) { // the bus, pulling away to the left, empty
    const len = 230;
    const busY = 332;
    const bx = TAB.x + 10 - e * 18 - e * e * 1.2;
    drawBus(ctx, bx, busY, len, 96, 0);
    drawExhaust(ctx, bx + len + 2, busY - 14, t, 6);
  }
  // you, trudging back to the door, a look back over your shoulder
  const p = figure(t, 2.3, 0, { pose: 'walk', moving: true, phase: t * 4, sweat: true });
  p.head = Math.PI - 0.5 + Math.sin(t * 1.6) * 0.15;
  drawPerson(ctx, game.level.looks.player, p, walkIn(e, 520, 566, 3), 270);
  bubble(ctx, ['😳'], 556, 196, e, 'thought');
  // the boss in the door, pointing
  const b = figure(t, 2.4, Math.PI, { arms: 'point', angry: true, jacket: w.coat === 'boss' });
  b.head = Math.PI - 0.15;
  drawPerson(ctx, game.level.looks.boss, b, 700, 274);
  bubble(ctx, ['😠'], 708, 192, e, 'alert');
}

// The fail: 4:30 and the boss still at his desk in his shirtsleeves, his coat on its stand, under his clock (the
// time it shows, crooked if you pushed it), so you are still in the office. Out of the window your bus drives off.
function sceneFail(ctx, game, t, e) {
  const w = game.world || {};
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  wall(ctx, TAB.x, TAB.w, 170);
  // the window: the street outside, the bus pulling away
  const wx = 520;
  const ww = 226;
  const wy = TAB.y + 14;
  const wh = 136;
  ctx.save();
  ctx.beginPath();
  ctx.rect(wx, wy, ww, wh);
  ctx.clip();
  ctx.fillStyle = '#cfe6ef';
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
  // his clock, his coat; he works on
  drawBigClock(ctx, 300, TAB.y + 48, 30, BUS_AT + (w.bossClock || 0), START, w.bossClock ? 0.3 : 0);
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
  // you, at the window, hands on the glass
  const p = figure(t, 2.4, -Math.PI / 2, { arms: 'bang', sweat: true });
  p.head = -Math.PI / 2 + Math.sin(t * 2) * 0.15;
  drawPerson(ctx, game.level.looks.player, p, 634, 262);
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

// Blamed: the boss went home, and the bus with him; the stop is empty and the bus pulls away. You come running out
// of the lobby door too late.
function sceneBlamed(ctx, game, t, e) {
  street(ctx, TAB.x, TAB.w, 92, 280);
  glassDoor(ctx, 660, 76, 92);
  const len = 270;
  const h = 104;
  const busY = 330;
  const bx = 230 - easeOutCubic(e / 4) * 90 - e * 6;
  drawStopSign(ctx, 520, 272, 150);
  drawBus(ctx, bx, busY, len, h, 0);
  drawExhaust(ctx, bx + len + 2, busY - 14, t, 6);
  // you, out of the door, running after it
  const p = figure(t, 2.3, Math.PI - 0.15, { pose: 'walk', moving: true, phase: t * 13, arms: 'reach', sweat: true });
  const px = walkIn(e, 700, 600, 1.2);
  drawPerson(ctx, game.level.looks.player, p, px, 262);
  if (e > 1) bubble(ctx, ['😳'], px + 10, 190, e - 1, 'thought');
}

export const END_SCENES = {
  kindOf: (o) => {
    if (o?.result === 'win') return o.routes?.includes?.('herd') ? 'herd' : 'clock';
    if (o?.result === 'fail' && o.why === 'stop') return 'stop'; // index.js meeting.verdict: at the stop, he still in
    return o?.result ?? 'fail';
  },
  scenes: {
    clock: { win: true, icons: ['🕐', '@boss', '👋', '🚌', '@player'], draw: sceneClock },
    herd: { win: true, icons: ['@lin', '@kev', '@boss', '🕔', '❗', '🚌', '@player'], draw: sceneHerd },
    fail: { win: false, icons: ['@boss', '🕐', '@player', '😩', '🚌', '💨'], draw: sceneFail },
    stop: { win: false, icons: ['🚌', '💨', '@player', '😳', '@boss', '😠'], draw: sceneFetched },
    // the stepladder or the street (sceneCaught): either way you, then him
    caught: { win: false, icons: ['@player', '😳', '@boss', '😠'], draw: sceneCaught },
    blamed: { win: false, icons: ['🚌', '💨', '@player', '😳'], draw: sceneBlamed },
  },
};
