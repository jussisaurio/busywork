// Lights Out's end cards: which scene an outcome gets, the icon row under it and its hand-drawn picture (level 1's
// end-scenes.js documents the fields). Every card is the boss's office at 3:40, or the moment it went wrong:
//   switch    he's back at the light switch, fuming; his tray is empty; you stroll off with the letter
//   blackout  dark: Lin's coffee machine still sparking, his phone torch on the front of his desk, you beside it
//   breaker   dark: Kev cranking the open fuse box, his phone torch on the front of his desk, you beside it
//   fail      he holds your letter up, furious; you're in front of his desk with a cardboard box
//   caught    he points at you, red-handed at his tray with the letter
//   blamed    his tray is empty and he points out through the glass at your empty chair
// The switch and the fuse box are the ones drawn on the floor (render/darkness.js), only bigger.
import { clamp, easeOutBack, rrect, fillCircle, fillEllipse, emoji } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { paintSwitch, paintBreaker, paintLamp } from '../../render/darkness.js';
import { TAB, person, bubble, floorCarpet, backWall } from '../../render/tableau.js';

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

// His in-tray on the desk top at (x, y): the 📥 it is on the floor, bigger, your letter in it or not.
function tray(ctx, x, y, letter) {
  emoji(ctx, '📥', x, y - 12, 38);
  if (letter) emoji(ctx, '✉️', x, y - 22, 24);
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

function boss(ctx, game, t, x, y, o) {
  const b = person(t);
  Object.assign(b, { scale: 2.5 }, o);
  drawPerson(ctx, game.level.looks.boss, b, x, y);
}

// You, smug, the letter in your hand.
function youWithLetter(ctx, game, t, x, y, o = {}) {
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = Math.PI / 2 + (Math.sin(t * 0.8) > 0.6 ? -0.9 : 0); // now and then a glance back at the boss
  p.arms = 'carry';
  p.item = '✉️';
  p.smug = true;
  p.scale = 2.4;
  Object.assign(p, o);
  drawPerson(ctx, game.level.looks.player, p, x, y - Math.abs(Math.sin(t * 2.2)) * 2);
}

// ---- Scenes -------------------------------------------------------------------------------------------------

// The switch: the light is back on, he's at the switch fuming, his tray is empty, you have the letter.
function sceneSwitch(ctx, game, t, e) {
  office(ctx);
  control(ctx, 'switch', 250, 150, 3.4, true, false, t);
  lamp(ctx, 500, true, t);
  desk(ctx, 520, 252, true);
  tray(ctx, 574, 252, false);
  boss(ctx, game, t, 292, 240, { dir: Math.PI + 0.5, head: Math.PI + 0.7, arms: 'reach', angry: true });
  youWithLetter(ctx, game, t, 700, 300);
  bubble(ctx, ['😠'], 330, 156, e, 'alert');
}

function bossWithTorch(ctx, game, t) {
  boss(ctx, game, t, 520, 236, { arms: 'reach', item: '📱', head: Math.PI / 2 + Math.sin(t * 1.4) * 0.35 });
}
const BOSS_BEAM = (t) => ({ x: 520, y: 214, dir: Math.PI / 2 + Math.sin(t * 1.4) * 0.35, fov: 0.95, len: 140 });

// The dark side of each dark win: his desk in his own torchlight, the tray empty, you just outside the beam,
// grinning, the letter catching a little light.
function darkDesk(ctx, game, t) {
  bossWithTorch(ctx, game, t);
  desk(ctx, 520, 252, false);
  tray(ctx, 574, 252, false);
  youWithLetter(ctx, game, t, 700, 300);
}

// The blackout: Lin's coffee machine sparks, the floor is dark, the boss's torch misses you.
function sceneBlackout(ctx, game, t, e) {
  office(ctx);
  counter(ctx, TAB.x, 360);
  coffeeMachine(ctx, 270, t, true);
  const l = person(t);
  Object.assign(l, { dir: Math.PI / 2, head: Math.PI / 2 - 0.6, arms: 'reach', item: '📱', scale: 2.3 });
  drawPerson(ctx, game.level.looks.lin, l, 330, 282);
  darkDesk(ctx, game, t);
  darkness(ctx, [BOSS_BEAM(t), { x: 336, y: 232, dir: -2.1, fov: 0.8, len: 120 }]);
  coffeeMachine(ctx, 270, t, true); // its sparks light themselves
  bubble(ctx, ['😳'], 330, 196, e);
}

// The breaker: the fuse box hangs open, Kev cranks it by his torch, the boss's torch misses you.
function sceneBreaker(ctx, game, t, e) {
  office(ctx);
  const k = person(t);
  Object.assign(k, { dir: Math.PI + 0.7, head: Math.PI + 0.9, arms: 'reach', item: '🔧', crank: true, scale: 2.4 });
  drawPerson(ctx, game.level.looks.kev, k, 318, 228);
  darkDesk(ctx, game, t);
  darkness(ctx, [BOSS_BEAM(t), { x: 300, y: 204, dir: -2.0, fov: 0.8, len: 100 }]);
  control(ctx, 'breaker', 250, 146, 3.2, false, true, t); // in his torchlight, its red lamp blinking
  warning(ctx, 308, 128, 2.2);
}

// He read it: the letter held up, furious. You stand in front of his desk with your box.
function sceneFail(ctx, game, t, e) {
  office(ctx);
  lamp(ctx, 440, true, t);
  boss(ctx, game, t, 440, 238, { arms: 'mug', item: '✉️', angry: true, head: Math.PI / 2 + Math.sin(t * 6) * 0.06 });
  desk(ctx, 440, 252, false);
  tray(ctx, 496, 252, false);
  const p = person(t);
  Object.assign(p, { dir: Math.PI - 0.5, head: Math.PI - 0.5, arms: 'box', sweat: true, jacket: false, scale: 2.4 });
  drawPerson(ctx, game.level.looks.player, p, 640, 306);
  const pe = clamp((e - 0.4) / 0.3, 0, 1);
  if (pe > 0) {
    ctx.save();
    ctx.translate(440, 166);
    ctx.scale(easeOutBack(pe), easeOutBack(pe));
    bubble(ctx, ['✉️', '😠'], 0, 0, e, 'alert');
    ctx.restore();
  }
}

// Caught: red-handed beside his tray, the letter in your hand; he points at you.
function sceneCaught(ctx, game, t, e) {
  office(ctx);
  lamp(ctx, 470, true, t);
  desk(ctx, 470, 252, true);
  tray(ctx, 526, 252, false);
  const p = person(t);
  Object.assign(p, { dir: Math.PI / 2, head: Math.PI / 2 + Math.sin(t * 9) * 0.4, arms: 'carry', item: '✉️', sweat: true, scale: 2.4 });
  drawPerson(ctx, game.level.looks.player, p, 620, 300);
  const jab = Math.max(0, Math.sin(t * 5)) * 3;
  boss(ctx, game, t, 300 + jab, 290, { dir: 0, head: 0, arms: 'point', item: '👉', angry: true, scale: 2.6 });
  bubble(ctx, ['❗', '😠'], 300, 204, e, 'alert');
}

// A plain open-plan desk with its monitor, centred at x, its top at y.
function floorDesk(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  rrect(ctx, x - 70, y + 6, 144, 46, 5);
  ctx.fill();
  ctx.fillStyle = C.walnutEdge;
  rrect(ctx, x - 72, y, 144, 46, 5);
  ctx.fill();
  ctx.fillStyle = C.walnutTop;
  rrect(ctx, x - 72, y, 144, 16, 5);
  ctx.fill();
  ctx.fillStyle = '#3a3f45';
  ctx.fillRect(x - 22, y - 30, 44, 30);
  ctx.fillStyle = '#7fb4c4';
  ctx.fillRect(x - 18, y - 27, 36, 22);
  ctx.fillStyle = '#3a3f45';
  ctx.fillRect(x - 4, y - 2, 8, 4);
}

// Blamed: 3:40, his tray is empty, and yours is the empty chair. He and Lin point at it.
function sceneBlamed(ctx, game, t, e) {
  office(ctx);
  // his office, left: desk, empty tray, him pointing out through the glass
  boss(ctx, game, t, 290, 238, { dir: 0, head: 0, arms: 'point', item: '👉', angry: true });
  desk(ctx, 290, 252, false);
  tray(ctx, 346, 252, false);
  ctx.fillStyle = 'rgba(170,215,234,0.45)';
  ctx.fillRect(420, TAB.y, 14, TAB.h);
  ctx.fillStyle = C.glassEdge;
  ctx.fillRect(418, TAB.y, 3, TAB.h);
  ctx.fillRect(433, TAB.y, 3, TAB.h);
  // the floor, right: your desk, your chair pulled out and empty, a pool of light on it
  const g = ctx.createRadialGradient(620, 280, 4, 620, 280, 96);
  g.addColorStop(0, 'rgba(255,244,200,0.55)');
  g.addColorStop(1, 'rgba(255,244,200,0)');
  ctx.fillStyle = g;
  ctx.fillRect(520, 180, 200, 154);
  floorDesk(ctx, 620, 224);
  ctx.save();
  ctx.translate(620, 300);
  ctx.scale(3, 3);
  drawChair(ctx, 0, 0, Math.PI / 2 + Math.sin(t * 1.5) * 0.25, C.ochre, C.ochreDark); // still turning
  ctx.restore();
  const l = person(t);
  Object.assign(l, { dir: Math.PI, head: Math.PI, arms: 'point', item: '👉', scale: 2.3 });
  drawPerson(ctx, game.level.looks.lin, l, 724, 292);
  bubble(ctx, ['😠'], 290, 168, e, 'alert');
}

export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? ({ breaker: 'breaker', blackout: 'blackout' })[o.routes?.[0]] ?? 'switch' : o?.result ?? 'fail'),
  scenes: {
    switch: { win: true, icons: ['💡', '😠', '✉️'], draw: sceneSwitch }, // the switch back on, him fuming, the letter yours
    blackout: { win: true, icons: ['☕', '💥', '✉️'], draw: sceneBlackout }, // the coffee machine sparked, the dark, the letter
    breaker: { win: true, icons: ['⚡', '🔧', '✉️'], draw: sceneBreaker }, // the fuse box, Kev fixing it, the letter
    fail: { win: false, icons: ['✉️', '😠', '📦'], draw: sceneFail }, // he read it; you pack your box
    caught: { win: false, icons: ['✉️', '👉', '😠'], draw: sceneCaught }, // the letter in your hand, he points, furious
    blamed: { win: false, icons: ['📥', '👉', '🪑'], draw: sceneBlamed }, // his tray empty, he points at your empty chair
  },
};
