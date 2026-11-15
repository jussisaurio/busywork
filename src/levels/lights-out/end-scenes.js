// Lights Out's end cards: which scene an outcome gets, the icon row under it and its hand-drawn picture (level 1's
// end-scenes.js documents the fields). Every card is the boss's office at 3:40, or the moment it went wrong:
//   switch    his light is back on, his hand still on the switch, fuming; his tray is empty; you have the letter
//   blackout  dark: Lin's coffee machine still sparking in her torchlight, his torch on the front of his desk
//   breaker   dark: Kev at the open fuse box by his torch, the boss's torch on the front of his desk
//   fail      he holds your letter up, furious; you're in front of his desk with a cardboard box
//   caught    he points at you, red-handed by his tray with the letter; or, if he groped his way to the switch and
//             walked into you there (rules.js reason 'evidence'), his office still dark, his hand on you under the
//             switch, the letter wherever it is
// 3:40 is never 'blamed' here (index.js meeting.verdict): wherever you are with the letter, you got away with it.
// Nothing in a hand or on a desk is an emoji: the tray, the letter and the phones are things.js, the switch and the
// fuse box are the ones drawn on the floor (render/darkness.js), only bigger. Speech is free: the bubbles and rows.
import { clamp, easeOutBack, rrect, fillCircle, fillEllipse } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { paintSwitch, paintBreaker, paintLamp } from '../../render/darkness.js';
import { TAB, person, bubble, floorCarpet, backWall } from '../../render/tableau.js';
import { paintTray, paintLetter, paintPhone } from './things.js';

const WALL_H = 92;
const VEIL = 'rgba(14,20,46,0.6)';

// ---- Props -------------------------------------------------------------------------------------------------

function office(ctx) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  backWall(ctx, WALL_H);
}

// A pendant lamp hanging from the top of the picture, lit or dark.
function lamp(ctx, x, on, t) {
  const y = TAB.y + 30;
  ctx.fillStyle = '#2b2420';
  ctx.fillRect(x - 1, TAB.y, 2, 30);
  if (on) {
    const g = ctx.createRadialGradient(x, y + 12, 2, x, y + 12, 120);
    g.addColorStop(0, `rgba(255,236,170,${0.42 + 0.03 * Math.sin(t * 2)})`);
    g.addColorStop(1, 'rgba(255,236,170,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 120, y - 108, 240, 240);
  }
  fillCircle(ctx, x, y + 11, 6, on ? '#fff6cf' : '#6f6a5e');
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + 8, y);
  ctx.lineTo(x + 20, y + 12);
  ctx.lineTo(x - 20, y + 12);
  ctx.closePath();
  ctx.fillStyle = '#2f5b4f';
  ctx.fill();
}

// The boss's desk, centred at x, its top at y; his chair behind it if he isn't in it.
function desk(ctx, x, y, chair) {
  if (chair) {
    ctx.save();
    ctx.translate(x - 20, y - 8);
    ctx.scale(2.4, 2.4);
    drawChair(ctx, 0, 0, Math.PI / 2, '#6b2f24', '#4e2019');
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, x - 92, y + 8, 190, 62, 6);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, x - 96, y, 192, 64, 6);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, x - 96, y, 192, 20, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; // a drawer
  ctx.fillRect(x - 80, y + 30, 56, 18);
  fillCircle(ctx, x - 52, y + 39, 2.2, '#c9a86a');
}

// His in-tray on the desk top at (x, y), as on the floor but bigger, your letter in it or not.
function tray(ctx, x, y, letter) {
  paintTray(ctx, x, y + 2, letter, 2.6);
}

// A wall switch or the fuse box on the back wall, drawn as on the floor, `s` times bigger, with its lamp.
function control(ctx, kind, x, y, s, on, dark, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const l = kind === 'breaker' ? paintBreaker(ctx, 0, 0, on, t) : paintSwitch(ctx, 0, 0, on);
  if (l.idle) fillCircle(ctx, l.x, l.y, l.r, l.idle);
  paintLamp(ctx, l, dark, t);
  ctx.restore();
}

// The yellow high-voltage sticker the fuse box door wears, on the wall beside it, `s` times bigger.
function warning(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const tri = (h, c) => {
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.lineTo(h * 0.95, h * 0.75);
    ctx.lineTo(-h * 0.95, h * 0.75);
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
  };
  tri(7, '#1d1d1d');
  tri(5.4, '#f2c230');
  ctx.beginPath();
  ctx.moveTo(0.5, -3.4);
  ctx.lineTo(-1.8, 0.8);
  ctx.lineTo(-0.2, 0.8);
  ctx.lineTo(-1.2, 3.6);
  ctx.lineTo(1.8, -0.6);
  ctx.lineTo(0.2, -0.6);
  ctx.closePath();
  ctx.fillStyle = '#1d1d1d';
  ctx.fill();
  ctx.restore();
}

// Kitchen counter along the back wall from x0 to x1, and the coffee machine on it at x.
function counter(ctx, x0, x1) {
  const y = TAB.y + WALL_H - 6;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x0, y + 50, x1 - x0, 6);
  ctx.fillStyle = '#a99f8c';
  ctx.fillRect(x0, y + 8, x1 - x0, 44);
  ctx.fillStyle = '#d8d2c4';
  ctx.fillRect(x0, y, x1 - x0, 10);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let x = x0 + 40; x < x1; x += 46) ctx.fillRect(x, y + 12, 2, 38);
}

function coffeeMachine(ctx, x, t, sparking) {
  const y = TAB.y + WALL_H - 6; // sits on the counter
  ctx.fillStyle = '#2f2926';
  rrect(ctx, x - 22, y - 50, 44, 50, 5);
  ctx.fill();
  ctx.fillStyle = '#6a625c';
  rrect(ctx, x - 22, y - 50, 44, 12, 5);
  ctx.fill();
  ctx.fillStyle = '#1c1816';
  rrect(ctx, x - 16, y - 34, 26, 30, 3);
  ctx.fill();
  // the pot: empty glass
  fillEllipse(ctx, x - 3, y - 14, 10, 10, 'rgba(214,234,240,0.45)');
  fillCircle(ctx, x + 16, y - 30, 2.6, sparking && Math.sin(t * 20) > 0 ? '#ffe680' : '#e5432f');
  if (!sparking) return;
  // sparks off the back, and a curl of smoke
  for (let i = 0; i < 9; i++) {
    const a = i * 0.7 + t * 9;
    if (Math.sin(t * 23 + i * 5) < -0.2) continue;
    const r0 = 10 + (i % 3) * 3;
    const r1 = r0 + 10 + 6 * Math.abs(Math.sin(t * 13 + i));
    const cx = x + 18;
    const cy = y - 46;
    ctx.strokeStyle = i % 2 ? '#fff3b0' : '#ffc23d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.stroke();
  }
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.6 + i / 3) % 1;
    fillCircle(ctx, x + 10 + Math.sin(t + i) * 6, y - 56 - k * 40, 6 + k * 8, `rgba(90,90,96,${0.45 * (1 - k)})`);
  }
}

// ---- The dark ------------------------------------------------------------------------------------------------

// A phone torch's beam from (x, y) along dir: a fan `len` px long, `fov` wide.
function beamPath(ctx, b) {
  ctx.moveTo(b.x, b.y);
  ctx.arc(b.x, b.y, b.len, b.dir - b.fov / 2, b.dir + b.fov / 2);
  ctx.closePath();
}

// Everything so far goes dark, except where the beams fall (they get a warm wash).
function darkness(ctx, beams) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(TAB.x, TAB.y, TAB.w, TAB.h);
  for (const b of beams) beamPath(ctx, b);
  ctx.fillStyle = VEIL;
  ctx.fill('evenodd');
  ctx.restore();
  for (const b of beams) {
    const g = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, b.len);
    g.addColorStop(0, 'rgba(255,240,190,0.38)');
    g.addColorStop(1, 'rgba(255,240,190,0)');
    ctx.beginPath();
    beamPath(ctx, b);
    ctx.fillStyle = g;
    ctx.fill();
  }
}

// ---- People -----------------------------------------------------------------------------------------------

// Where render/characters.js puts the right hand of someone standing still at (x, y) in state s (its computeHands,
// for the arms these scenes use), in picture pixels. Things in hands are painted there, then the hand over them.
function handAt(look, s, x, y) {
  const sc = s.scale || 1;
  const fx = Math.cos(s.dir);
  const fy = Math.sin(s.dir) * 0.6;
  const rx = -Math.sin(s.dir);
  const ry = Math.cos(s.dir) * 0.6;
  const bodyY = -2;
  const sl = (9 - 2.5 * Math.abs(fx)) * (look.wide || 1) * 0.85;
  const rsx = rx * sl;
  const rsy = bodyY - 2 + ry * sl;
  let hx;
  let hy;
  if (s.arms === 'reach') {
    const o = Math.sin(s.t * 9) * 1.5;
    hx = fx * (12 - o) + rx * 3;
    hy = bodyY - 1 + fy * (12 - o) + ry * 3;
  } else if (s.arms === 'point') {
    hx = rsx * 0.4 + fx * 13;
    hy = rsy - 1 + fy * 13;
  } else if (s.arms === 'shrug') {
    hx = rsx + rx * 5;
    hy = rsy - 4 + ry * 5;
  } else { // carry
    hx = fx * 8 + rx * 3;
    hy = bodyY + fy * 8 + ry * 3;
  }
  return { x: x + hx * sc, y: y + hy * sc, sc, fx, fy };
}

// Draw a person (nothing in hand), then `paint(hand)` the thing they hold, then their hand over it.
function holding(ctx, look, s, x, y, paint) {
  s.item = null;
  drawPerson(ctx, look, s, x, y);
  const h = handAt(look, s, x, y);
  if (paint) paint(h);
  fillCircle(ctx, h.x, h.y, 2.3 * h.sc, look.skin);
  return h;
}

// A person pointing (arms 'point'): the finger out of the fist, along the arm.
function pointing(ctx, look, s, x, y) {
  s.item = null;
  drawPerson(ctx, look, s, x, y);
  const h = handAt(look, s, x, y);
  const n = Math.hypot(h.fx, h.fy) || 1;
  ctx.strokeStyle = look.skin;
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.8 * h.sc;
  ctx.beginPath();
  ctx.moveTo(h.x, h.y);
  ctx.lineTo(h.x + (h.fx / n) * 5.5 * h.sc, h.y + (h.fy / n) * 5.5 * h.sc);
  ctx.stroke();
  ctx.lineCap = 'butt';
  fillCircle(ctx, h.x, h.y, 2.3 * h.sc, look.skin);
}

// The boss's pose (drawn by holding or pointing).
function boss(t, o) {
  return Object.assign(person(t), { scale: 2.5 }, o);
}

// You, smug, your letter in your hand.
function youWithLetter(ctx, game, t, x, y, o = {}) {
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = Math.PI / 2 + (Math.sin(t * 0.8) > 0.6 ? -0.9 : 0); // now and then a glance back at the boss
  p.arms = 'carry';
  p.smug = true;
  p.scale = 2.4;
  Object.assign(p, o);
  holding(ctx, game.level.looks.player, p, x, y - Math.abs(Math.sin(t * 2.2)) * 2, (h) => paintLetter(ctx, h.x, h.y - 2 * h.sc, h.sc * 0.95, -0.12));
}

// A phone torch held at hand h: its beam (len px, fov wide, along dir) starts at the flash.
const torchAt = (h, dir, fov, len) => ({ hand: h, x: h.x, y: h.y - 3 * h.sc * 0.9, dir, fov, len });
const phone = (ctx, b) => paintPhone(ctx, b.hand.x, b.hand.y, b.hand.sc * 0.9);

// A cardboard box with your things in it (your plant, your mug), held at the belly; centred on (x, y), s big.
function cardboardBox(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillEllipse(ctx, -2.5, -7, 2.4, 3.6, '#4f8f3a'); // the plant
  fillEllipse(ctx, 0.5, -8.5, 2.2, 4, '#62a845');
  fillEllipse(ctx, 3, -6.5, 2.2, 3.2, '#4f8f3a');
  ctx.fillStyle = '#e8e2d6'; // the mug
  ctx.fillRect(-6.5, -6, 3.2, 3.5);
  ctx.fillStyle = '#c69a5b';
  ctx.fillRect(-7.5, -4, 15, 9);
  ctx.fillStyle = '#a97d43';
  ctx.fillRect(-7.5, -4, 15, 1.6);
  ctx.fillStyle = '#d8b273'; // the flaps
  ctx.beginPath();
  ctx.moveTo(-7.5, -4);
  ctx.lineTo(-9.5, -6.5);
  ctx.lineTo(-4.5, -6.5);
  ctx.lineTo(-3, -4);
  ctx.moveTo(7.5, -4);
  ctx.lineTo(9.5, -6.5);
  ctx.lineTo(4.5, -6.5);
  ctx.lineTo(3, -4);
  ctx.fill();
  ctx.restore();
}

// ---- Scenes -------------------------------------------------------------------------------------------------

// The switch: the light is back on, his hand still on the switch, fuming at you; his tray is empty, you have the
// letter.
function sceneSwitch(ctx, game, t, e) {
  office(ctx);
  lamp(ctx, 500, true, t);
  desk(ctx, 520, 252, true);
  tray(ctx, 574, 252, false);
  control(ctx, 'switch', 238, 166, 3.2, true, false, t);
  const look = game.level.looks.boss;
  const b = boss(t, { dir: Math.PI, head: Math.PI / 2 + 0.55, arms: 'reach', angry: true });
  b.t = 0; // the hand rests on the switch
  holding(ctx, look, b, 288, 200, null);
  youWithLetter(ctx, game, t, 700, 300);
  bubble(ctx, ['😠'], 352, 140, e, 'alert');
}

// The boss at his desk in the dark, his phone torch sweeping the front of it; the tray empty; you just outside the
// beam with the letter. Returns his beam.
function darkDesk(ctx, game, t) {
  const sweep = Math.sin(t * 1.4) * 0.35;
  const b = boss(t, { arms: 'reach', head: Math.PI / 2 + sweep });
  const h = holding(ctx, game.level.looks.boss, b, 520, 236, null);
  desk(ctx, 520, 252, false);
  tray(ctx, 574, 252, false);
  youWithLetter(ctx, game, t, 700, 300);
  return torchAt(h, Math.PI / 2 + sweep, 0.95, 140);
}

// The blackout: Lin's coffee machine still sparks in her torchlight, the floor is dark, the boss's torch misses you.
function sceneBlackout(ctx, game, t, e) {
  office(ctx);
  counter(ctx, TAB.x, 360);
  coffeeMachine(ctx, 270, t, true);
  const l = person(t);
  Object.assign(l, { dir: Math.PI, head: Math.PI - 0.3, arms: 'reach', scale: 2.3 });
  const lh = holding(ctx, game.level.looks.lin, l, 336, 214, null);
  const beams = [darkDesk(ctx, game, t), torchAt(lh, -1.85, 0.75, 130)];
  darkness(ctx, beams);
  beams.forEach((b) => phone(ctx, b));
  coffeeMachine(ctx, 270, t, true); // its sparks light themselves
  bubble(ctx, ['😳'], 352, 150, e);
}

// The breaker: the fuse box hangs open, Kev works at it by his torch, the boss's torch misses you.
function sceneBreaker(ctx, game, t, e) {
  office(ctx);
  control(ctx, 'breaker', 246, 158, 3.2, false, true, t);
  warning(ctx, 300, 126, 2.2);
  const k = person(t);
  Object.assign(k, { dir: Math.PI, head: Math.PI - 0.25, arms: 'reach', scale: 2.4 });
  const kh = holding(ctx, game.level.looks.kev, k, 308, 196, null);
  const beams = [darkDesk(ctx, game, t), torchAt(kh, -2.2, 0.8, 90)];
  darkness(ctx, beams);
  beams.forEach((b) => phone(ctx, b));
  control(ctx, 'breaker', 246, 158, 3.2, false, true, t); // in his torchlight, its red lamp blinking
}

// He read it: the letter held up, furious. You stand in front of his desk with your box.
function sceneFail(ctx, game, t, e) {
  office(ctx);
  lamp(ctx, 440, true, t);
  const b = boss(t, { arms: 'shrug', angry: true, head: Math.PI / 2 + Math.sin(t * 6) * 0.06 });
  const shake = Math.sin(t * 16) * 0.12;
  holding(ctx, game.level.looks.boss, b, 440, 238, (h) => paintLetter(ctx, h.x, h.y - 5 * h.sc, h.sc * 1.05, shake));
  desk(ctx, 440, 252, false);
  tray(ctx, 496, 252, false);
  const look = game.level.looks.player;
  const p = person(t);
  Object.assign(p, { dir: Math.PI - 0.5, head: Math.PI - 0.5, sweat: true, jacket: false, scale: 2.4 });
  drawPerson(ctx, look, p, 640, 306);
  const sc = p.scale;
  const fx = Math.cos(p.dir);
  const fy = Math.sin(p.dir) * 0.6;
  const rx = -Math.sin(p.dir);
  const ry = Math.cos(p.dir) * 0.6;
  const bx = 640 + fx * 8 * sc;
  const by = 306 + (1 + fy * 8) * sc;
  cardboardBox(ctx, bx, by, sc);
  for (const side of [-1, 1]) fillCircle(ctx, bx + rx * 7.5 * sc * side, by + (ry * 7.5 * side) * sc, 2.3 * sc, look.skin);
  const pe = clamp((e - 0.4) / 0.3, 0, 1);
  if (pe > 0) {
    ctx.save();
    ctx.translate(470, 150);
    ctx.scale(easeOutBack(pe), easeOutBack(pe));
    bubble(ctx, ['@player', '😠'], 0, 0, e, 'alert');
    ctx.restore();
  }
}

// Caught at the switch: his office still dark, he felt his way along the wall and his hand landed on you, right
// under the switch you flipped. His tray behind him shows where your letter is: still in it, or in your hand.
function sceneBumped(ctx, game, t, e) {
  office(ctx);
  lamp(ctx, 560, false, t);
  desk(ctx, 600, 252, true);
  const held = game.world.letter === 'player';
  tray(ctx, 654, 252, game.world.letter === 'tray');
  control(ctx, 'switch', 238, 166, 3.2, false, true, t);
  const p = person(t);
  Object.assign(p, { dir: Math.PI / 2 - 0.3, head: Math.PI / 2 - 0.5 + Math.sin(t * 9) * 0.2, arms: held ? 'carry' : null, sweat: true, scale: 2.4 });
  if (held) holding(ctx, game.level.looks.player, p, 300, 236, (h) => paintLetter(ctx, h.x, h.y - 2 * h.sc, h.sc * 0.95, 0.1));
  else drawPerson(ctx, game.level.looks.player, p, 300, 236);
  const b = boss(t, { dir: Math.PI, head: Math.PI, arms: 'reach', angry: true });
  b.t = 0; // his hand stays on you
  holding(ctx, game.level.looks.boss, b, 358, 230, null);
  darkness(ctx, []);
  control(ctx, 'switch', 238, 166, 3.2, false, true, t); // its amber lamp: the light is off
  bubble(ctx, ['❗', '😠'], 400, 150, e, 'alert');
}

// Caught: red-handed beside his tray, the letter in your hand; he points at you. (At the switch in the dark:
// sceneBumped.)
function sceneCaught(ctx, game, t, e) {
  if (game.caught?.reason === 'evidence') return sceneBumped(ctx, game, t, e);
  office(ctx);
  lamp(ctx, 470, true, t);
  desk(ctx, 470, 252, true);
  tray(ctx, 526, 252, false);
  const p = person(t);
  Object.assign(p, { dir: Math.PI / 2, head: Math.PI / 2 + Math.sin(t * 9) * 0.4, arms: 'carry', sweat: true, scale: 2.4 });
  holding(ctx, game.level.looks.player, p, 620, 300, (h) => paintLetter(ctx, h.x, h.y - 2 * h.sc, h.sc * 0.95, 0.1));
  const jab = Math.max(0, Math.sin(t * 5)) * 3;
  const b = boss(t, { dir: 0, head: 0, arms: 'point', angry: true, scale: 2.6 });
  pointing(ctx, game.level.looks.boss, b, 300 + jab, 290);
  bubble(ctx, ['❗', '😠'], 300, 204, e, 'alert');
}

// A win is the scene of its route (outcomeOrder puts the most dramatic first); 'blamed' never happens here (the
// verdict makes it a win), but scores the same.
const ROUTE_SCENE = { breaker: 'breaker', blackout: 'blackout' };
export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' || o?.result === 'blamed' ? ROUTE_SCENE[o.routes?.[0]] ?? 'switch' : o?.result ?? 'fail'),
  scenes: {
    switch: { win: true, icons: ['💡', '@boss', '😠', '✉️'], draw: sceneSwitch }, // the light back on, him fuming, the letter yours
    blackout: { win: true, icons: ['@lin', '☕', '💥', '✉️'], draw: sceneBlackout }, // Lin's coffee machine sparked, the dark, the letter
    breaker: { win: true, icons: ['⚡', '@kev', '🔧', '✉️'], draw: sceneBreaker }, // the fuse box, Kev fixing it, the letter
    fail: { win: false, icons: ['@boss', '✉️', '😠', '📦'], draw: sceneFail }, // he read it; you pack your box
    caught: { win: false, icons: ['@boss', '👉', '@player'], draw: sceneCaught }, // he points at you: by his tray, or at the switch
  },
};
