// Second Thoughts' end cards: which scene an outcome gets, the icon row under it and its hand-drawn picture (level 1's
// end-scenes.js documents the fields). Every card shows the day as it ended (DESIGN.md), drawn from the state:
//   switch    3:40, the lights on: he holds up his empty tray, baffled, and squints at the switch on his wall; you
//   blackout  stand outside his glass office with the letter (at your desk, if that's where you are). Behind you, the
//   breaker   thing that went dark, back to normal: the coffee machine's brew lamp lit (blackout), the fuse box shut
//             (breaker).
//   fail      3:40: he holds your letter up, furious; you stand in front of his desk.
//   caught    where it happened, as it was: in the light he points at you; in the dark his phone torch is on you (by
//             his desk, or under the switch you flipped). Each of you stands where you were; the letter is where it
//             was (your hand, his tray, the floor).
// 3:40 is never 'blamed' here (index.js meeting.verdict): wherever you are with the letter, you got away with it.
// Nothing in a hand or on a desk is an emoji: the tray, the letter and the phone are things.js (in a hand through
// decor.things, so render/characters.js draws them and the hand over them), the switch and the fuse box are the ones
// drawn on the floor (render/darkness.js), only bigger. Speech is free: the bubbles and rows.
import { rrect, fillCircle, fillEllipse } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { paintSwitch, paintBreaker, paintLamp } from '../../render/darkness.js';
import { isDark } from '../../game/darkness.js';
import { TAB, person, bubble, floorCarpet, backWall } from '../../render/tableau.js';
import { paintTray, paintLetter, paintPhone } from './things.js';

const WALL_H = 92;
const VEIL = 'rgba(14,20,46,0.62)';
const GLASS_X = 600; // the win cards: his glass office left of it, the open floor right of it

// ---- Props -------------------------------------------------------------------------------------------------

function office(ctx) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.officeA, C.officeB);
  backWall(ctx, WALL_H);
}

// The glass wall of his office, running from the back wall towards you at x.
function glassWall(ctx, x) {
  const y0 = TAB.y + WALL_H;
  const y1 = TAB.y + TAB.h;
  ctx.fillStyle = 'rgba(196,224,238,0.32)';
  ctx.beginPath();
  ctx.moveTo(x - 4, TAB.y);
  ctx.lineTo(x + 4, TAB.y);
  ctx.lineTo(x + 4, y0);
  ctx.lineTo(x + 34, y1);
  ctx.lineTo(x + 14, y1);
  ctx.lineTo(x - 4, y0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8f9aa3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 4, TAB.y);
  ctx.lineTo(x - 4, y0);
  ctx.lineTo(x + 14, y1);
  ctx.moveTo(x + 4, TAB.y);
  ctx.lineTo(x + 4, y0);
  ctx.lineTo(x + 34, y1);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'; // a glint
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 6, y0 + 30);
  ctx.lineTo(x + 16, y0 + 80);
  ctx.stroke();
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

// His oxblood chair, for a desk centred at x with its top at y (drawn before him, the desk after him).
function chair(ctx, x, y) {
  ctx.save();
  ctx.translate(x - 20, y - 8);
  ctx.scale(2.4, 2.4);
  drawChair(ctx, 0, 0, Math.PI / 2, '#6b2f24', '#4e2019');
  ctx.restore();
}

// The boss's desk, centred at x, its top at y.
function desk(ctx, x, y) {
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

// Your desk front, centred at x, its top at y: a monitor on it, the mustard chair's back showing behind you.
function yourDesk(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rrect(ctx, x - 52, y + 6, 108, 40, 5);
  ctx.fill();
  ctx.fillStyle = '#b68a5a';
  rrect(ctx, x - 54, y, 108, 40, 5);
  ctx.fill();
  ctx.fillStyle = '#cfa575';
  rrect(ctx, x - 54, y, 108, 12, 5);
  ctx.fill();
  ctx.fillStyle = '#3a3f48'; // the monitor's back
  rrect(ctx, x + 10, y - 22, 34, 24, 3);
  ctx.fill();
  ctx.fillRect(x + 25, y - 2, 4, 4);
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

// Kitchen counter along the back wall from x0 to x1.
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

// The coffee machine on the counter at x, as the world shows it (presentation.js decor.props): its pot empty, its brew
// lamp green once it brewed (the power came back after it tripped), smoke off its back while the fuse it blew is out.
function coffeeMachine(ctx, x, t, w) {
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
  fillEllipse(ctx, x - 3, y - 14, 10, 10, 'rgba(214,234,240,0.45)'); // the pot: empty glass
  const tripped = w.coffee === 'tripped';
  const brewed = tripped && w.fuse === 'on';
  if (brewed) {
    const g = ctx.createRadialGradient(x + 16, y - 30, 0.5, x + 16, y - 30, 9);
    g.addColorStop(0, 'rgba(120,235,110,0.8)');
    g.addColorStop(1, 'rgba(120,235,110,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x + 7, y - 39, 18, 18);
  }
  fillCircle(ctx, x + 16, y - 30, 2.6, brewed ? '#d8ffd0' : '#6b2a22');
  if (!tripped || brewed) return;
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.6 + i / 3) % 1;
    fillCircle(ctx, x + 10 + Math.sin(t + i) * 6, y - 56 - k * 40, 6 + k * 8, `rgba(90,90,96,${0.45 * (1 - k)})`);
  }
}

// ---- The dark ------------------------------------------------------------------------------------------------

// A phone torch's light from its flash (x, y) along dir: a fan `len` px long, `fov` wide, and a pool `pool` px round
// the flash, so it lights whoever holds it (render/darkness.js does the same on the floor). One closed outline.
function beamPath(ctx, b) {
  const a0 = b.dir - b.fov / 2;
  const a1 = b.dir + b.fov / 2;
  ctx.moveTo(b.x + Math.cos(a0) * b.len, b.y + Math.sin(a0) * b.len);
  ctx.arc(b.x, b.y, b.len, a0, a1);
  ctx.arc(b.x, b.y, b.pool, a1, a0 + Math.PI * 2);
  ctx.closePath();
}

// Everything so far goes dark, except where the beam falls (it gets a warm wash); then the phone, lit.
function darkness(ctx, b) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(TAB.x, TAB.y, TAB.w, TAB.h);
  if (b) beamPath(ctx, b);
  ctx.fillStyle = VEIL;
  ctx.fill('evenodd');
  ctx.restore();
  if (!b) return;
  const g = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, b.len);
  g.addColorStop(0, 'rgba(255,240,190,0.38)');
  g.addColorStop(1, 'rgba(255,240,190,0)');
  ctx.beginPath();
  beamPath(ctx, b);
  ctx.fillStyle = g;
  ctx.fill();
  paintPhone(ctx, b.x, b.y + 3 * b.sc, b.sc);
}

// ---- People -----------------------------------------------------------------------------------------------

// The boss's pose: his own copy (render/tableau.js person() hands out one shared state, reset per figure).
function boss(t, o) {
  return Object.assign({}, person(t), { scale: 2.5 }, o);
}

// Where the flash is of a phone held in arms 'carry' by s at (x, y), in picture px: render/characters.js puts that
// hand at (fx*8 + rx*3, bodyY + fy*8 + ry*3) and paints what it holds 2 px above it; the flash is 3 px above the
// phone's middle (things.js paintPhone).
function flashOf(s, x, y) {
  const sc = s.scale || 1;
  const fx = Math.cos(s.dir);
  const fy = Math.sin(s.dir) * 0.6;
  const rx = -Math.sin(s.dir);
  const ry = Math.cos(s.dir) * 0.6;
  const bodyY = s.pose === 'sit' ? 1 : -2;
  return { x: x + (fx * 8 + rx * 3) * sc, y: y + (bodyY + fy * 8 + ry * 3 - 5) * sc, sc };
}

// His phone torch, held by s at (x, y), aimed at (tx, ty).
function torchOn(s, x, y, tx, ty) {
  const f = flashOf(s, x, y);
  return { ...f, dir: Math.atan2(ty - f.y, tx - f.x), fov: 0.62, len: Math.hypot(tx - f.x, ty - f.y) + 70, pool: 30 * f.sc / 2.5 };
}

// ---- Wins: 3:40 -------------------------------------------------------------------------------------------------

const near = (game, who, spot, r) => {
  const s = game.level.spots[spot];
  return !!who && Math.hypot(who.x - (s.x + 0.5), who.y - (s.y + 0.5)) < r;
};

// 3:40, the lights on. He holds up his empty tray (it's what he goes through), baffled; on the switch route his eyes
// keep going to the switch behind him. You, outside his glass office, the letter in your hand (at your desk if you're
// at it). Behind you, what went dark on your route, back to normal.
function sceneWin(route) {
  return (ctx, game, t, e) => {
    const w = game.world;
    office(ctx);
    if (route === 'blackout') {
      counter(ctx, GLASS_X + 20, TAB.x + TAB.w);
      coffeeMachine(ctx, 724, t, w);
    } else if (route === 'breaker') {
      control(ctx, 'breaker', 716, 146, 3.2, w.fuse === 'on', false, t); // its door wears the sticker
    }
    glassWall(ctx, GLASS_X);
    lamp(ctx, 420, true, t);
    control(ctx, 'switch', 238, 150, 3.2, w.officeLight !== 'off', false, t);
    chair(ctx, 420, 252);
    const glance = route === 'switch' && Math.sin(t * 0.9) > 0.35; // a squint at the switch over his shoulder
    const b = boss(t, { pose: 'sit', arms: 'shrug', item: '#tray', head: Math.PI / 2 + (glance ? 1.35 : 0.45) + Math.sin(t * 3) * 0.05 });
    drawPerson(ctx, game.level.looks.boss, b, 420, 228);
    desk(ctx, 420, 252);
    const atDesk = near(game, game.player, 'player_desk', 1.6);
    const p = person(t);
    p.dir = Math.PI / 2;
    p.head = Math.PI / 2 + (Math.sin(t * 0.8) > 0.6 ? 0.9 : 0); // now and then a glance back at him
    p.arms = 'carry';
    p.item = '#letter';
    p.smug = true;
    p.scale = 2.4;
    if (atDesk) {
      drawPerson(ctx, game.level.looks.player, p, 690, 262 - Math.abs(Math.sin(t * 2.2)) * 2);
      yourDesk(ctx, 690, 280);
    } else {
      drawPerson(ctx, game.level.looks.player, p, 690, 300 - Math.abs(Math.sin(t * 2.2)) * 2);
    }
    if (e > 0.5) bubble(ctx, ['❓'], 446, 150, e - 0.5);
  };
}

// ---- Losses -------------------------------------------------------------------------------------------------------

// 3:40, he read it: the letter held up, furious; the tray it came out of empty. You stand in front of his desk, where
// you were called.
function sceneFail(ctx, game, t, e) {
  office(ctx);
  lamp(ctx, 440, true, t);
  control(ctx, 'switch', 238, 150, 3.2, true, false, t);
  const b = boss(t, { arms: 'shrug', item: '#letter', angry: true, head: Math.PI / 2 + Math.sin(t * 6) * 0.06 });
  drawPerson(ctx, game.level.looks.boss, b, 440, 238);
  desk(ctx, 440, 252);
  tray(ctx, 496, 252, false);
  const p = person(t);
  Object.assign(p, { dir: Math.PI - 0.5, head: Math.PI - 0.5, sweat: true, scale: 2.4 });
  drawPerson(ctx, game.level.looks.player, p, 640, 306);
  if (e > 0.4) bubble(ctx, ['@player', '😠'], 470, 150, e - 0.4, 'alert');
}

// Where someone stood in his office (tiles), in the picture: the switch's corner top left, his desk (tiles 3..5 of row
// 3, the tray on its east end) across the middle.
const at = (who) => ({
  x: Math.min(TAB.x + TAB.w - 40, Math.max(TAB.x + 40, 236 + (who.x - 1.5) * 64)),
  y: Math.min(TAB.y + TAB.h - 14, Math.max(TAB.y + WALL_H + 30, 216 + (who.y - 1.5) * 30)),
});
const DESK = { x: 428, y: 256 };
const TRAY_X = DESK.x + 58;

// Caught, where it happened and as it was. In the light he points at you; in the dark his phone torch is on you. He
// is at his desk or wherever he walked to; you're where you stood, the letter where it was.
function sceneCaught(ctx, game, t, e) {
  const w = game.world;
  const you = game.player;
  const him = game.npcs.find((n) => n.id === 'boss');
  const dark = isDark(game, you.x, you.y);
  const atHisDesk = near(game, him, 'boss_desk', 0.9);
  const P = at(you);
  // At his desk he is in his chair; off it, he walked over to you (the switch's corner): he stands at arm's length.
  const side = P.x + 120 < TAB.x + TAB.w - 40 ? 1 : -1;
  const B = atHisDesk ? { x: DESK.x, y: DESK.y - 22 } : { x: P.x + side * 120, y: P.y + 6 };

  office(ctx);
  lamp(ctx, DESK.x, !dark, t);
  control(ctx, 'switch', 238, 150, 3.2, w.officeLight !== 'off', dark, t);
  const look = game.level.looks.boss;
  const b = boss(t, { angry: true });
  b.dir = Math.atan2((P.y - B.y) / 0.6, P.x - B.x);
  b.head = b.dir;
  if (atHisDesk) b.pose = 'sit';
  if (dark) { b.arms = 'carry'; b.item = '#phone'; } else b.arms = 'point';
  const drawHim = () => drawPerson(ctx, look, b, B.x, B.y);
  if (atHisDesk) {
    chair(ctx, DESK.x, DESK.y);
    drawHim();
  }
  desk(ctx, DESK.x, DESK.y);
  tray(ctx, TRAY_X, DESK.y, w.letter === 'tray');

  // You: the letter in your hand if you had it; else reaching for the tray if you were at it.
  const p = person(t);
  const held = w.letter === 'player';
  const atTray = !held && w.letter === 'tray' && Math.hypot(P.x - TRAY_X, P.y - DESK.y) < 110;
  Object.assign(p, { sweat: true, scale: 2.4 });
  p.dir = atTray ? Math.atan2((DESK.y - P.y) / 0.6, TRAY_X - P.x) : Math.atan2((B.y - P.y) / 0.6, B.x - P.x);
  p.head = p.dir + Math.sin(t * 9) * 0.25;
  if (held) { p.arms = 'carry'; p.item = '#letter'; } else if (atTray) p.arms = 'reach';
  const drawYou = () => drawPerson(ctx, game.level.looks.player, p, P.x, P.y);
  if (w.letter === 'dropped') paintLetter(ctx, P.x + 26, P.y + 14, 2.2, 0.4);
  if (atHisDesk) drawYou();
  else if (B.y < P.y) { drawHim(); drawYou(); } else { drawYou(); drawHim(); }

  if (dark) darkness(ctx, torchOn(b, B.x, B.y, P.x, P.y - 20));
  bubble(ctx, ['❗', '😠'], B.x + 30, Math.max(TAB.y + 66, B.y - 86), e, 'alert');
}

// A win is the scene of its route (outcomeOrder puts the most dramatic first); 'blamed' never happens here (the
// verdict makes it a win), but scores the same.
const ROUTE_SCENE = { breaker: 'breaker', blackout: 'blackout' };
export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' || o?.result === 'blamed' ? ROUTE_SCENE[o.routes?.[0]] ?? 'switch' : o?.result ?? 'fail'),
  scenes: {
    switch: { win: true, icons: ['💡', '@boss', '❓', '✉️'], draw: sceneWin('switch') }, // his light, him baffled, the letter yours
    blackout: { win: true, icons: ['@lin', '☕', '💥', '✉️'], draw: sceneWin('blackout') }, // Lin's coffee machine blew the fuse, the letter
    breaker: { win: true, icons: ['⚡', '@kev', '🔧', '✉️'], draw: sceneWin('breaker') }, // the fuse box, Kev fixed it, the letter
    fail: { win: false, icons: ['@boss', '✉️', '😠', '📦'], draw: sceneFail }, // he read it; you pack your box
    caught: { win: false, icons: ['@boss', '👉', '@player'], draw: sceneCaught }, // he finds you: in the light or in his torch
  },
};
