// The sets Meeting's end scenes are played on, each built once (end-scenes*.js draw on them; screen space, inside
// TAB). A scene draws its set, then its own layer on top: a pose, a prop, a bubble only it has.
//   meetingRoom   the meeting room's rug and screen: lit and blank (nobody presented), or dead (the projector went)
//   presenting    the room from the foot of the table, you up front: the big lit screen, Lin and Kev in their chairs on
//                 the left, the boss standing at the right (the plain fails, the Samaritan)
//   atTheTable    the meeting at the table, the screen behind: the boss at the head, Lin at the left end, Kev at the
//                 right end (his empty chair when he has gone home), your place at the front (the blame scenes)
//   balconySet    the office on the left, the balcony on the right, the fire door end on between (fireDoor, drawn
//                 where the scene wants it in the stack)
// Objects are drawn, never emoji; only bubbles speak emoji.
import { clamp, easeOutBack, rrect, fillEllipse, drawScreen } from '../../render/util.js';
import { drawThing } from '../../render/things.js';
import { C, TEAL, OLIVE, TOMATO } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawProjector } from '../../render/world.js';
import { TAB, person, floorCarpet } from '../../render/tableau.js';
import { chair, walnutDesk } from '../../render/tableau-furniture.js';
import { findNpc } from '../../game/perception.js';
import { FISTS } from './knocks.js';

// Is the boss in his jacket (behaviours.js: he fetches it off the rack)? Not in a game: yes.
export function bossJacket(game) {
  const boss = game.npcs && findNpc(game, 'boss');
  return boss ? game.world.jacket === boss.id : true;
}
export const kevHere = (game) => !game.world || !game.world.kevGone; // he goes home at 3:00 (unless kept late)

// One of the cast (`who`: a key of level.looks) at (x, y): a fresh person with `fields` on it. The boss comes in his
// jacket or not, as he is in the day.
function figure(ctx, game, who, t, x, y, fields) {
  const p = person(t);
  if (who === 'boss') p.jacket = bossJacket(game);
  Object.assign(p, fields);
  drawPerson(ctx, game.level.looks[who], p, x, y);
}

// ---- The meeting room
const RUG = [C.meetingRug, '#397369'];
const BAR = [6, 6, 6];
const LIT = { glow: ['rgba(255,255,235,0.35)', 10, 6, 6], bar: BAR, face: '#ffffff', edge: 'rgba(0,0,0,0.12)' };
// The screen on the back wall: from up front (presenting, big and lit) or past the table (blank or dead).
export const SCREEN = { x: 372, y: 100, w: 216, h: 92 }; // the presenting view's: the duck's shadow lands on it
export function meetingRoom(ctx, t, screen) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, ...RUG);
  if (screen === 'lit') drawScreen(ctx, SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, LIT);
  else if (screen === 'dead') drawScreen(ctx, 392, 104, 176, 62, { bar: BAR, face: '#9d9a92', scan: ['rgba(0,0,0,0.1)', 4, 10, t] });
  else drawScreen(ctx, 392, 104, 176, 62, { bar: BAR, glow: ['rgba(255,255,235,0.3)', 6, 0, 6], glowOverBar: true, face: '#ffffff' });
}

// ---- Presenting: the room from the foot of the table, you up front. Lin and Kev in their chairs on the left (teal,
// olive: decor.js), turned to the front; the boss standing right of the screen, facing you. who: per-figure fields
// ({ lin, kev, boss }) on top of the defaults; boss: false leaves him out (the scene draws him itself).
export const AUDIENCE = { kev: [250, 214], lin: [286, 296], boss: [690, 262] };
export function presenting(ctx, game, t, who = {}) {
  meetingRoom(ctx, t, 'lit');
  if (kevHere(game)) chair(ctx, 250, 222, OLIVE, 2.2, 0.2);
  chair(ctx, 286, 304, TEAL, 2.2, -0.2);
  if (kevHere(game)) figure(ctx, game, 'kev', t, ...AUDIENCE.kev, { pose: 'sit', arms: 'desk', dir: 0.2, head: 0.1, scale: 2.1, ...who.kev });
  figure(ctx, game, 'lin', t, ...AUDIENCE.lin, { pose: 'sit', arms: 'desk', dir: -0.2, head: -0.15, scale: 2.1, ...who.lin });
  if (who.boss !== false) figure(ctx, game, 'boss', t, ...AUDIENCE.boss, { dir: Math.PI, head: Math.PI + 0.1, scale: 2.3, ...who.boss });
}

// ---- At the table: the meeting room past the long walnut table. Draws, back to front: the room, the boss behind the
// table (unless absent), the table, the dead projector smoking on it at x `smoke`, the evidence (`spot`: a pool of
// light at `light`, the empty mug at `mug`, popping in when `pop`), Lin at the left end, Kev at the right end, and your
// place at the front: you standing (`you`, in a pool of light when `youLit`), or your empty chair in one (you: null).
// Kev, gone home (or `kevAway`): his empty chair at his place. boss/lin/kev/you: person fields on the defaults.
const PLACE = { boss: [476, 222], lin: [272, 262], kev: [680, 262], kevChair: [682, 276], you: [476, 312] };
export function atTheTable(ctx, game, t, e, { screen = 'dead', boss = null, smoke = null, spot = null, lin = {}, kev = {},
  kevAway = false, you = null, youLit = false }) {
  meetingRoom(ctx, t, screen);
  if (boss) figure(ctx, game, 'boss', t, ...PLACE.boss, { dir: Math.PI / 2, head: Math.PI / 2, scale: 2.5, ...boss });
  meetingTable(ctx);
  if (smoke != null) smokingProjector(ctx, t, smoke);
  if (spot?.light) poolOfLight(ctx, ...spot.light);
  const kevIn = kevHere(game) && !kevAway;
  if (!kevIn) chair(ctx, ...PLACE.kevChair, OLIVE, 2.6, Math.PI); // Kev's (decor.js)
  if (spot?.mug) mugOnTable(ctx, game, ...spot.mug, spot.pop ? e : null);
  figure(ctx, game, 'lin', t, ...PLACE.lin, { scale: 2.4, ...lin });
  if (kevIn) figure(ctx, game, 'kev', t, ...PLACE.kev, { dir: Math.PI - 0.42, head: Math.PI - 0.42, scale: 2.4, ...kev });
  if (you) {
    if (youLit) poolOfLight(ctx, PLACE.you[0], PLACE.you[1] + 12);
    figure(ctx, game, 'player', t, ...PLACE.you, { scale: 2.4, ...you });
  } else {
    poolOfLight(ctx, PLACE.you[0], PLACE.you[1] + 4); // your chair: empty, in a pool of light
    chair(ctx, PLACE.you[0], PLACE.you[1] - 10, TOMATO, 2.6, -Math.PI / 2); // yours (decor.js)
  }
}

// You at your place (atTheTable `you` fields), turned where everyone looks (dir), smug; now and then a glance at us.
// The mug wins: someone else takes the fall.
export function youNodding(t, dir) {
  return { dir, head: Math.sin(t * 0.9) > 0.85 ? Math.PI / 2 : dir, smug: true };
}

// The meeting table: shadow, walnut top, a slide printout at each end place.
function meetingTable(ctx) {
  walnutDesk(ctx, 296, 228, 350, { depth: 47, skirt: 56, r: 24, shadow: { color: 'rgba(0,0,0,0.25)', dx: 6, h: 54 } });
  for (const x of [336, 606]) {
    ctx.fillStyle = C.white;
    ctx.fillRect(x - 12, 240, 24, 17);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(x - 8, 245, 16, 1.4);
    ctx.fillRect(x - 8, 249, 11, 1.4);
  }
}

// The dead projector at (x, y), `scale` times its size in the world.
export function brokenProjector(ctx, t, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawProjector(ctx, 0, 0, 'broken', 0, t);
  ctx.restore();
}
const smokingProjector = (ctx, t, x) => brokenProjector(ctx, t, x, 254, 2.4); // on the meeting table

function poolOfLight(ctx, x, y) {
  for (let i = 3; i >= 1; i--) fillEllipse(ctx, x, y, 26 + i * 14, 7 + i * 4, `rgba(255,240,200,${(0.08 * (4 - i)).toFixed(3)})`);
}

// The empty mug on the table at (x, y); with e (seconds since the card came up), it lands there with a pop.
function mugOnTable(ctx, game, x, y, e) {
  if (e == null) {
    drawThing(ctx, game, 'mug', x, y, 26);
    return;
  }
  const pe = clamp((e - 0.4) / 0.3, 0, 1);
  if (pe <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(easeOutBack(pe), easeOutBack(pe));
  drawThing(ctx, game, 'mug', 0, 0, 26);
  ctx.restore();
}

// ---- The balcony set: the office carpet on the left, the smokers' balcony on the right. The sky and the rooftops
// over the railing at the back, concrete pavers, a sand-bucket ashtray in the far corner and his butts all round it.
export function balconySet(ctx) {
  const x = 484, y = TAB.y, w = 286, h = TAB.h;
  floorCarpet(ctx, TAB.x, TAB.y, 286, TAB.h);
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

// Whoever is locked out (`who`), on the balcony side, and the fire door between: fists on it (knocks.js FISTS) about
// twice a second, and the door jumps at each. `fields` on top of the figure; arms other than fists (he gives up and
// lights one) leave the door still. Returns the beat (0..1 through one) and hit (a fist is landing), for whatever
// else a blow shakes (end-scenes.js: rings off the steel).
export function bangingOnTheDoor(ctx, game, who, t, fields) {
  const f = { dir: Math.PI, head: Math.PI + Math.sin(t * 2) * 0.1, arms: FISTS, scale: 2.2, ...fields };
  const beat = (t * 2.2) % 1;
  const hit = f.arms === FISTS && beat < 0.18;
  fireDoor(ctx, t, hit ? Math.sin(beat * 90) * 2 : 0);
  figure(ctx, game, who, t, 548, 272, f);
  return { beat, hit };
}

// The wall between them, end on, with the red fire door in it (shoved dx px by the fists), the EXIT sign over it
// and the card reader on the balcony side, blinking red.
export function fireDoor(ctx, t, dx = 0) {
  const x = 470;
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
