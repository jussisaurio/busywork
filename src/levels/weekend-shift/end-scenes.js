// Weekend Shift's end cards (level 1's end-scenes.js documents the fields). Most are the same picture: the office
// on Saturday, sun in the window, the desks empty but one, and the roster board beside it. What changes is who sits
// at that desk, working, with their face on the board: the boss or Kev (a win), or you (a loss). Caught: the boss
// came in too, to point at you. Blamed is the day as it ended instead: Friday, 5:00, everyone in their chairs round
// the board. The board still shows the face you wrote, but you weren't there: the boss points at your empty chair,
// and Lin and Kev have turned to look at it. Whoever isn't here gets Saturday.
// The row under it is the punchline: cause, effect, you.
import { fillCircle, fillEllipse, rrect } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { drawClock } from '../../render/things.js';
import { TAB, person, bubble, floorCarpet, backWall } from '../../render/tableau.js';
import { drawBoard, drawEmptyPlace } from './props.js';

const SOUTH = Math.PI / 2;
const WALL_H = 112;
const looks = (game) => game.level.looks;
// whose face the board showed when it was read (the meeting's verdict puts it in o.why; index.js)
const written = (game, o) => (o?.why === 'boss' || o?.why === 'kev' ? o.why : game.world?.roster === 'kev' ? 'kev' : 'boss');

// The big window in the back wall: blue sky, the sun, a cloud drifting by. Its light falls across the floor.
function sunnyWindow(ctx, t) {
  const x = 452;
  const y = TAB.y + 12;
  const w = 296;
  const h = 84;
  // the light on the floor, slanting in from the window
  ctx.fillStyle = 'rgba(255,236,170,0.16)';
  ctx.beginPath();
  ctx.moveTo(x, TAB.y + WALL_H);
  ctx.lineTo(x + w, TAB.y + WALL_H);
  ctx.lineTo(x + w - 110, TAB.y + TAB.h);
  ctx.lineTo(x - 150, TAB.y + TAB.h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e9e4d6'; // frame and sill
  ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
  const sky = ctx.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, '#5fb7ea');
  sky.addColorStop(1, '#bfe6fb');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  // the sun, its rays turning
  const sx = x + w - 52;
  const sy = y + 30;
  ctx.strokeStyle = 'rgba(255,214,64,0.8)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = t * 0.4 + (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.moveTo(sx + Math.cos(a) * 22, sy + Math.sin(a) * 22);
    ctx.lineTo(sx + Math.cos(a) * 31, sy + Math.sin(a) * 31);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
  fillCircle(ctx, sx, sy, 18, '#ffd640');
  fillCircle(ctx, sx - 4, sy - 4, 9, 'rgba(255,248,200,0.6)');
  // a cloud, and a far-off park: trees on a green hill
  const cx = x + ((t * 9) % (w + 120)) - 60;
  for (const [dx, dy, r] of [[0, 0, 11], [13, -5, 13], [27, 0, 10], [13, 4, 10]]) fillCircle(ctx, cx + dx, y + 26 + dy, r, 'rgba(255,255,255,0.92)');
  fillEllipse(ctx, x + w * 0.45, y + h + 26, w * 0.7, 40, '#7cc46a');
  for (const [tx, r] of [[0.18, 9], [0.3, 12], [0.62, 10], [0.78, 8]]) {
    ctx.fillStyle = '#7a5a3a';
    ctx.fillRect(x + w * tx - 1.5, y + h - 18, 3, 12);
    fillCircle(ctx, x + w * tx, y + h - 20 - r * 0.4, r, '#4f9a48');
  }
  ctx.restore();
  ctx.fillStyle = '#e9e4d6'; // the window's bars
  ctx.fillRect(x + w / 3 - 2, y, 4, h);
  ctx.fillRect(x + (2 * w) / 3 - 2, y, 4, h);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(x + 8, y + 4, 10, h - 8);
}

// An empty desk at (x, y) (its top's centre): a dark monitor, the chair pushed in. Nobody else came in.
function emptyDesk(ctx, x, y, seat) {
  ctx.save();
  ctx.translate(x, y - 24);
  ctx.scale(2, 2);
  drawChair(ctx, 0, 0, Math.PI / 2, seat[0], seat[1]);
  ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  rrect(ctx, x - 52, y + 2, 108, 34, 6);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, x - 54, y - 4, 108, 36, 6);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, x - 54, y - 4, 108, 24, 6);
  ctx.fill();
  ctx.fillStyle = '#2b2d31'; // the monitor, off
  ctx.fillRect(x - 22, y - 30, 44, 28);
  ctx.fillStyle = '#3b3e44';
  ctx.fillRect(x - 19, y - 27, 38, 22);
  ctx.fillStyle = '#2b2d31';
  ctx.fillRect(x - 3, y - 3, 6, 6);
}

// The one desk in use, someone at it working Saturday (the person drawn behind it, facing you): a laptop, and the
// rest of the week's work in a pile beside them. x, y: the desk top's centre.
function workDesk(ctx, look, x, y, t, opts = {}) {
  ctx.save();
  ctx.translate(x, y - 22);
  ctx.scale(2.4, 2.4);
  drawChair(ctx, 0, 0, -Math.PI / 2, opts.seat?.[0] ?? '#555', opts.seat?.[1] ?? '#333');
  ctx.restore();
  const p = person(t);
  p.dir = SOUTH;
  p.head = SOUTH + Math.sin(t * 0.9) * 0.12;
  p.pose = 'sit';
  p.arms = 'type';
  p.sweat = !!opts.sweat;
  p.angry = !!opts.red;
  p.scale = 2.6;
  drawPerson(ctx, look, p, x, y - 30);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, x - 92, y + 4, 190, 44, 8);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, x - 95, y - 4, 190, 48, 8);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, x - 95, y - 4, 190, 30, 8);
  ctx.fill();
  // the laptop's lid, its back to us, glowing round the edges
  ctx.fillStyle = 'rgba(190,225,255,0.35)';
  rrect(ctx, x - 27, y - 22, 54, 26, 4);
  ctx.fill();
  ctx.fillStyle = '#a7adb4';
  rrect(ctx, x - 24, y - 19, 48, 22, 3);
  ctx.fill();
  ctx.fillStyle = '#c3c8ce';
  ctx.fillRect(x - 24, y - 19, 48, 3);
  // the pile of work, and a cold coffee
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = i % 2 ? '#e9e4d6' : C.white;
    ctx.fillRect(x + 42 + Math.sin(i * 1.7) * 2, y + 2 - i * 5, 36, 5);
  }
  ctx.fillStyle = '#d8d4cc';
  rrect(ctx, x - 70, y - 8, 14, 15, 3);
  ctx.fill();
  fillEllipse(ctx, x - 63, y - 7, 6, 2, '#4a3324');
}

// The roster board beside the desk: the same face as the one at the desk.
function board(ctx, look, t, opts = {}) {
  drawBoard(ctx, 286, TAB.y + 222, 3.1, look, t, opts);
}

function room(ctx, t) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_H);
  sunnyWindow(ctx, t);
  emptyDesk(ctx, 690, TAB.y + 176, [C.teal ?? '#2f8f83', C.tealDark ?? '#22675f']);
}

const DESK_X = 520;
const DESK_Y = TAB.y + 196;
const BUBBLE_Y = DESK_Y - 82; // over the worker's head
const SEAT = { boss: ['#6b2f24', '#4e2019'], kev: ['#5f6b3a', '#47512a'], player: ['#d6a23a', '#a97b22'], lin: ['#2f8f83', '#22675f'] };

// Win: the boss, or Kev, works Saturday. Their face on the board, them at the desk, the sun outside.
function sceneWin(ctx, game, t, e, o) {
  const who = written(game, o);
  room(ctx, t);
  board(ctx, looks(game)[who], t);
  workDesk(ctx, looks(game)[who], DESK_X, DESK_Y, t, { seat: SEAT[who], red: who === 'boss' });
  bubble(ctx, ['😩'], DESK_X, BUBBLE_Y, e, 'speech', 1.3);
}

// Fail: your face stayed on the board; you're the one at the desk.
function sceneFail(ctx, game, t, e) {
  room(ctx, t);
  board(ctx, looks(game).player, t);
  workDesk(ctx, looks(game).player, DESK_X, DESK_Y, t, { seat: SEAT.player, sweat: true });
  bubble(ctx, ['😩'], DESK_X, BUBBLE_Y, e, 'speech', 1.3);
}

// Caught: you at the desk, and the boss, in on his Saturday to make sure, at the board pointing at you.
function sceneCaught(ctx, game, t, e) {
  room(ctx, t);
  board(ctx, looks(game).player, t);
  workDesk(ctx, looks(game).player, DESK_X, DESK_Y, t, { seat: SEAT.player, sweat: true });
  const b = person(t);
  b.dir = -0.12;
  b.head = b.dir + Math.sin(t * 2.4) * 0.06;
  b.arms = 'point';
  b.angry = true;
  b.scale = 2.4;
  drawPerson(ctx, looks(game).boss, b, 400 + Math.max(0, Math.sin(t * 5)) * 3, TAB.y + 200);
  bubble(ctx, ['😠'], 400, TAB.y + 132, e, 'alert', 1.3);
  bubble(ctx, ['😳'], DESK_X, BUBBLE_Y, e - 0.5, 'speech', 1.2);
}

// Friday's window, at 5:00: a low sun going down behind the buildings across the street.
function fridayWindow(ctx, t) {
  const x = 520;
  const y = TAB.y + 14;
  const w = 226;
  const h = 72;
  ctx.fillStyle = '#e9e4d6'; // frame and sill
  ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
  const sky = ctx.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, '#8fb3d6');
  sky.addColorStop(1, '#f2c98a');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  fillCircle(ctx, x + w * 0.7, y + h - 14, 15, '#f7a94a');
  // the buildings across the street, a few windows lit
  for (const [bx, bw, bh] of [[0, 34, 40], [38, 46, 56], [90, 30, 34], [124, 52, 48], [182, 44, 62]]) {
    ctx.fillStyle = '#6e6a78';
    ctx.fillRect(x + bx, y + h - bh, bw, bh);
    ctx.fillStyle = 'rgba(255,214,140,0.75)';
    for (let wy = y + h - bh + 6; wy < y + h - 6; wy += 10) {
      for (let wx = x + bx + 5; wx < x + bx + bw - 6; wx += 10) if ((wx * 7 + wy * 3) % 5 < 2) ctx.fillRect(wx, wy, 4, 5);
    }
  }
  ctx.restore();
  ctx.fillStyle = '#e9e4d6'; // the window's bar
  ctx.fillRect(x + w / 2 - 2, y, 4, h);
}

// A chair of the half-circle round the board at (x, y) (its seat, px), facing `dir`, and whoever sits in it (look;
// null: nobody), facing the board, their head turned to face `at`.
function meetingSeat(ctx, look, seat, x, y, dir, at, t, phase) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(2.4, 2.4);
  drawChair(ctx, 0, 0, dir, seat[0], seat[1]);
  ctx.restore();
  if (!look) return;
  const p = person(t);
  p.dir = dir;
  p.head = at ? Math.atan2(at.y - y, at.x - x) + Math.sin(t * 1.3 + phase) * 0.05 : dir;
  p.pose = 'sit';
  p.scale = 2.4;
  drawPerson(ctx, look, p, x, y - 4);
  return p;
}

// Blamed: Friday, 5:00, everyone in their chairs round the board, as the day ended. The board shows the face you
// wrote; the boss read it out, looked for you, and points at your chair: empty, your outline on it. Lin and Kev have
// turned round to look at it.
function sceneBlamed(ctx, game, t, e, o) {
  const who = written(game, o);
  const L = looks(game);
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_H);
  fridayWindow(ctx, t);
  ctx.save();
  drawClock(ctx, 446, TAB.y + 48, 48, 120); // 5:00
  ctx.restore();
  board(ctx, L[who], t);
  const W = Math.PI;
  const mine = { x: 634, y: TAB.y + 170 };
  // the map's meeting spots: Kev north of your chair, Lin south of it, the boss beside the board
  meetingSeat(ctx, L.kev, SEAT.kev, 540, TAB.y + 128, W, mine, t, 0);
  meetingSeat(ctx, null, SEAT.player, mine.x, mine.y, W);
  ctx.save();
  ctx.translate(mine.x, mine.y - 4);
  ctx.scale(2.4, 2.4);
  drawEmptyPlace(ctx, 0, 0, t, true);
  ctx.restore();
  const bx = 400;
  const by = TAB.y + 206;
  const toMine = Math.atan2(mine.y - 14 - by, mine.x - bx);
  ctx.save();
  ctx.translate(bx, by);
  ctx.scale(2.4, 2.4);
  drawChair(ctx, 0, 0, toMine, SEAT.boss[0], SEAT.boss[1]);
  ctx.restore();
  const b = person(t);
  b.dir = toMine;
  b.head = toMine;
  b.pose = 'sit';
  b.arms = 'point';
  b.scale = 2.4;
  drawPerson(ctx, L.boss, b, bx + Math.max(0, Math.sin(t * 5)) * 2, by - 4);
  meetingSeat(ctx, L.lin, SEAT.lin, 540, TAB.y + 214, W, mine, t, 2);
  bubble(ctx, ['👉', '@player'], bx, by - 72, e, 'speech', 1.2);
}

function kindOf(o) {
  if (o?.result === 'win') return o.why === 'kev' ? 'winKev' : 'winBoss';
  return o?.result === 'caught' || o?.result === 'blamed' ? o.result : 'fail';
}

export const END_SCENES = {
  kindOf,
  scenes: {
    winBoss: { win: true, icons: ['✏️', '@boss', '🏖️'], draw: sceneWin },
    winKev: { win: true, icons: ['✏️', '@kev', '🏖️'], draw: sceneWin },
    fail: { win: false, icons: ['🗓️', '@player', '😩'], draw: sceneFail },
    caught: { win: false, icons: ['✏️', '😠', '@player'], draw: sceneCaught },
    blamed: { win: false, icons: ['#spot', '👉', '@player'], draw: sceneBlamed },
  },
};
