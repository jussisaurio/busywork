// Second Thoughts' end cards: which scene an outcome gets, the icon row under it and its hand-drawn picture (level 1's
// end-scenes.js documents the fields). Every card shows the day as it ended (DESIGN.md), drawn from the state:
//   switch    3:40, the lights on: he holds up his empty tray, baffled; you stand outside his glass office with the
//   blackout  letter (at your desk, if that's where you are). Behind you, the thing that went dark: the hallway's
//   breaker   lighting panel, his eyes going to it (switch); the coffee machine you soaked, scorched, its empty jug
//             beside it and a wet streak down the wall behind it (blackout); the fuse box, shut again (breaker).
//   fail      3:40: he holds your letter up, furious; you stand in front of his desk.
//   eaten     3:40, the letter still in you: he holds up his empty tray, baffled; you sit green at your desk.
//   soggy     it came back up and he came to see what the retching was: he stands over the sick on the floor,
//             pointing at his own envelope in it; you, green, beside it.
//   deskwork  as fail, but Kev told on you and you sit at your desk behind a pile of paperwork.
//   caught    where it happened, as it was: in the light he points at you; in the dark his phone torch is on you (in
//             his office), or in the hallway at the lighting panel you flipped. Each of you stands where you were; the
//             letter is where it was (your hand, his tray, the floor).
// 3:40 is never 'blamed' here (index.js meeting.verdict): wherever you are with the letter, you got away with it.
// Nothing in a hand or on a desk is an emoji: the tray, the letter and the phone are things.js (in a hand through
// decor.things, so render/characters.js draws them and the hand over them), the panel and the fuse box are the ones
// drawn on the floor (render/darkness.js), only bigger. Speech is free: the bubbles and rows.
import { rrect, fillCircle, fillEllipse } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson, itemGlyph } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { paintSwitch, paintBreaker, paintLamp } from '../../render/darkness.js';
import { isDark } from '../../game/darkness.js';
import { TAB, person, bubble, floorCarpet, backWall } from '../../render/tableau.js';
import { paintTray, paintLetter, paintPhone, soggyLetter } from './things.js';

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

// Your desk front, centred at x, its top at y: a monitor on it, the mustard chair's back showing behind you; your
// letter's corner peeking out of its drawer if you put it there; a pile of paperwork on it if you were made to work.
function yourDesk(ctx, x, y, o = {}) {
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
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; // the drawer
  ctx.fillRect(x - 44, y + 18, 40, 14);
  if (o.drawer) {
    ctx.save();
    ctx.translate(x - 30, y + 19);
    ctx.rotate(-0.25);
    paintLetter(ctx, 0, 0, 1.6, 0);
    ctx.restore();
  }
  fillCircle(ctx, x - 24, y + 25, 1.8, '#8a6a3a');
  if (o.pile) {
    for (let i = 0; i < o.pile; i++) { // a slumping stack of paper
      const sx = x - 56 + Math.sin(i * 2.3) * 4;
      ctx.fillStyle = i % 2 ? '#f4f1e6' : '#e6e2d4';
      ctx.fillRect(sx, y - 6 - i * 5, 44, 5);
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(sx, y - 2 - i * 5, 44, 1);
    }
  }
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

// The coffee machine on the counter at x, as the world shows it (presentation.js decor.props): soaked and shorted on
// the blackout route, so scorched black up the wall behind it, its lamp dead, the water jug standing empty beside it
// and a wet streak down the wall behind its shoulder, and smoke off its back while the fuse it blew is out (and Kev
// hasn't unplugged it). Brewed (it never shorted): the pot full and
// its brew lamp green.
function coffeeMachine(ctx, x, t, w) {
  const y = TAB.y + WALL_H - 6; // sits on the counter
  const shorted = w.coffee === 'shorted';
  const brewed = w.coffee === 'brewed';
  if (shorted) { // soot licks up the wall behind it
    ctx.fillStyle = 'rgba(30,26,24,0.55)';
    for (const [dx, h, wd] of [[-12, 46, 9], [2, 62, 11], [14, 40, 8]]) {
      ctx.beginPath();
      ctx.moveTo(x + dx - wd, y - 46);
      ctx.quadraticCurveTo(x + dx - wd * 0.4, y - 46 - h * 0.6, x + dx + 2, y - 46 - h);
      ctx.quadraticCurveTo(x + dx + wd * 0.5, y - 46 - h * 0.5, x + dx + wd, y - 46);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.fillStyle = '#2f2926';
  rrect(ctx, x - 22, y - 50, 44, 50, 5);
  ctx.fill();
  ctx.fillStyle = shorted ? '#3a3330' : '#6a625c';
  rrect(ctx, x - 22, y - 50, 44, 12, 5);
  ctx.fill();
  if (shorted) for (const [dx, r] of [[-10, 7], [4, 9], [15, 6]]) fillEllipse(ctx, x + dx, y - 46, r, 4, 'rgba(12,10,10,0.75)'); // scorched top
  ctx.fillStyle = '#1c1816';
  rrect(ctx, x - 16, y - 34, 26, 30, 3);
  ctx.fill();
  fillEllipse(ctx, x - 3, y - 14, 10, 10, 'rgba(214,234,240,0.45)'); // the pot's glass
  if (brewed) fillEllipse(ctx, x - 3, y - 11, 8.5, 6.5, '#4a2a16'); // full of coffee
  if (brewed) {
    const g = ctx.createRadialGradient(x + 16, y - 30, 0.5, x + 16, y - 30, 9);
    g.addColorStop(0, 'rgba(120,235,110,0.8)');
    g.addColorStop(1, 'rgba(120,235,110,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x + 7, y - 39, 18, 18);
  }
  fillCircle(ctx, x + 16, y - 30, 2.6, brewed ? '#d8ffd0' : shorted ? '#161212' : '#6b2a22');
  if (w.rigged) { // the water went down its back onto the socket: a wet streak behind its shoulder, the jug empty
    ctx.fillStyle = 'rgba(96,140,184,0.6)';
    rrect(ctx, x + 22, y - 44, 7, 44, 3);
    ctx.fill();
    const k = (t * 0.9) % 1;
    fillCircle(ctx, x + 25, y - 30 + k * 30, 2.2, `rgba(110,170,230,${(0.85 * (1 - k)).toFixed(3)})`);
  }
  ctx.fillStyle = 'rgba(214,234,240,0.55)'; // the water jug, standing beside it (on its left: the card's edge is right)
  rrect(ctx, x - 62, y - 30, 22, 30, 5);
  ctx.fill();
  ctx.fillStyle = 'rgba(110,170,230,0.75)';
  if (w.rigged) rrect(ctx, x - 60, y - 6, 18, 4, 2); // a last drop
  else rrect(ctx, x - 60, y - 22, 18, 20, 3);
  ctx.fill();
  ctx.strokeStyle = 'rgba(214,234,240,0.8)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x - 40, y - 15, 6, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  if (!shorted || w.fuse === 'on' || w.unplugged) return;
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

// What you held when the day ended, in your hand (the letter, a cup of coffee; nothing if you ate it).
function inHand(p, game) {
  const g = itemGlyph(game.level.items, game.player.held);
  if (g) { p.arms = 'carry'; p.item = g; }
  return !!g;
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
// keep going out to the lighting panel in the hallway. You, outside his glass office, the letter in your hand (at your
// desk if you're at it). Behind you, what went dark on your route: the panel, the scorched coffee machine, or the fuse
// box shut again.
function sceneWin(route) {
  return (ctx, game, t, e) => {
    const w = game.world;
    office(ctx);
    if (route === 'blackout') {
      counter(ctx, GLASS_X + 20, TAB.x + TAB.w);
      coffeeMachine(ctx, 724, t, w);
    } else if (route === 'breaker') {
      control(ctx, 'breaker', 716, 146, 3.2, w.fuse === 'on', false, t); // its door wears the sticker
    } else {
      control(ctx, 'switch', 716, 150, 3.2, w.officeLight !== 'off', false, t); // the hallway's lighting panel
    }
    glassWall(ctx, GLASS_X);
    lamp(ctx, 420, true, t);
    chair(ctx, 420, 252);
    const glance = route === 'switch' && Math.sin(t * 0.9) > 0.35; // a squint out through the glass at the panel
    const b = boss(t, { pose: 'sit', arms: 'shrug', item: '#tray', head: Math.PI / 2 + (glance ? -1.2 : 0.45) + Math.sin(t * 3) * 0.05 });
    drawPerson(ctx, game.level.looks.boss, b, 420, 228);
    desk(ctx, 420, 252);
    const atDesk = near(game, game.player, 'player_desk', 1.6);
    const p = person(t);
    p.dir = Math.PI / 2;
    p.head = Math.PI / 2 + (Math.sin(t * 0.8) > 0.6 ? 0.9 : 0); // now and then a glance back at him
    inHand(p, game);
    p.smug = true;
    p.scale = 2.4;
    if (atDesk) {
      drawPerson(ctx, game.level.looks.player, p, 690, 262 - Math.abs(Math.sin(t * 2.2)) * 2);
      yourDesk(ctx, 690, 280, { drawer: w.letter === 'drawer' });
    } else {
      drawPerson(ctx, game.level.looks.player, p, 690, 300 - Math.abs(Math.sin(t * 2.2)) * 2);
    }
    if (e > 0.5) bubble(ctx, ['❓'], 446, 150, e - 0.5);
  };
}

// You, green in the face (the letter is still in you, or just came back up).
const green = (look) => ({ ...look, skin: '#a9cf6e', skinDark: '#86ad4b' });

// 3:40, the letter still inside you: he holds up his empty tray, baffled. You sit at your desk outside his glass
// office, green in the face, hand on your stomach.
function sceneEaten(ctx, game, t, e) {
  office(ctx);
  glassWall(ctx, GLASS_X);
  lamp(ctx, 420, true, t);
  chair(ctx, 420, 252);
  const b = boss(t, { pose: 'sit', arms: 'shrug', item: '#tray', head: Math.PI / 2 + 0.45 + Math.sin(t * 3) * 0.05 });
  drawPerson(ctx, game.level.looks.boss, b, 420, 228);
  desk(ctx, 420, 252);
  const p = person(t);
  Object.assign(p, { dir: Math.PI / 2, head: Math.PI / 2 + Math.sin(t * 1.3) * 0.15, sweat: true, scale: 2.4 });
  drawPerson(ctx, green(game.level.looks.player), p, 720, 262 - Math.abs(Math.sin(t * 1.1)) * 3);
  yourDesk(ctx, 720, 280);
  if (e > 0.5) bubble(ctx, ['❓'], 446, 150, e - 0.5);
  if (e > 0.9) bubble(ctx, ['🤢'], 660, 168, e - 0.9, 'thought');
}

// ---- Losses -------------------------------------------------------------------------------------------------------

// 3:40, he read it: the letter held up, furious; the tray it came out of empty. You stand in front of his desk, where
// you were called.
function sceneFail(ctx, game, t, e) {
  office(ctx);
  lamp(ctx, 440, true, t);
  const b = boss(t, { arms: 'shrug', item: '#letter', angry: true, head: Math.PI / 2 + Math.sin(t * 6) * 0.06 });
  drawPerson(ctx, game.level.looks.boss, b, 440, 238);
  desk(ctx, 440, 252);
  tray(ctx, 496, 252, false);
  const p = person(t);
  Object.assign(p, { dir: Math.PI - 0.5, head: Math.PI - 0.5, sweat: true, scale: 2.4 });
  inHand(p, game);
  drawPerson(ctx, game.level.looks.player, p, 640, 306);
  if (e > 0.4) bubble(ctx, ['@player', '😠'], 470, 170, e - 0.4, 'alert');
}

// 3:40, he read it, and you never got near: Kev told on you and you were sent back to your desk with a pile of work.
// He holds the letter up, furious; you, at your desk behind the stack, sweat.
function sceneDeskwork(ctx, game, t, e) {
  office(ctx);
  glassWall(ctx, GLASS_X);
  lamp(ctx, 420, true, t);
  chair(ctx, 420, 252);
  const b = boss(t, { pose: 'sit', arms: 'shrug', item: '#letter', angry: true, head: Math.PI / 2 + Math.sin(t * 6) * 0.06 });
  drawPerson(ctx, game.level.looks.boss, b, 420, 228);
  desk(ctx, 420, 252);
  tray(ctx, 476, 252, false);
  const p = person(t);
  Object.assign(p, { dir: Math.PI / 2, head: Math.PI / 2 + 0.9, sweat: true, scale: 2.4 });
  drawPerson(ctx, game.level.looks.player, p, 744, 262);
  yourDesk(ctx, 720, 280, { pile: 9 });
  if (e > 0.4) bubble(ctx, ['@player', '😠'], 450, 150, e - 0.4, 'alert');
}

// It came back up, and he came over to see what the retching was: he stands over the sick on the open floor,
// pointing down at his own envelope in it, furious and queasy. You stand beside it, still green. Nobody picks a letter
// out of that, so it lies where it landed.
function sceneSoggy(ctx, game, t, e) {
  const w = game.world;
  office(ctx);
  glassWall(ctx, 180);
  puddle(ctx, 470, 300, 1 - 0.7 * (w.wipeProgress || 0));
  soggyLetter(ctx, 470, 298, 2.4, t, 0.3);
  const b = boss(t, { arms: 'point', angry: true, sweat: true });
  b.dir = Math.atan2(60 / 0.6, 470 - 330);
  b.head = b.dir + Math.sin(t * 6) * 0.06;
  drawPerson(ctx, game.level.looks.boss, b, 330, 250);
  const p = person(t);
  Object.assign(p, { dir: Math.PI - 0.4, head: Math.PI - 0.4 + Math.sin(t * 1.3) * 0.15, sweat: true, scale: 2.4 });
  drawPerson(ctx, green(game.level.looks.player), p, 620, 286 - Math.abs(Math.sin(t * 1.1)) * 3);
  if (e > 0.4) bubble(ctx, ['✉️', '😠'], 360, 150, e - 0.4, 'alert');
}

// The sick on the floor at (x, y), as the world draws it but bigger; k shrinks it as Lin wipes.
function puddle(ctx, x, y, k) {
  fillEllipse(ctx, x, y + 4, 70 * k, 20 * k, 'rgba(0,0,0,0.12)');
  fillEllipse(ctx, x, y, 66 * k, 18 * k, '#9dbb3c');
  fillEllipse(ctx, x - 30 * k, y + 6 * k, 22 * k, 9 * k, '#9dbb3c');
  fillEllipse(ctx, x + 34 * k, y - 4 * k, 18 * k, 8 * k, '#9dbb3c');
  for (const [dx, dy, r] of [[-12, 2, 4], [14, -2, 3.4], [30, 4, 3]]) fillCircle(ctx, x + dx * k, y + dy * k, r * k, '#7d9a28'); // lumps
  fillEllipse(ctx, x - 18 * k, y - 6 * k, 14 * k, 4 * k, 'rgba(255,255,255,0.35)');
}

// Where someone stood in his office (tiles), in the picture: its door corner top left, his desk (tiles 3..5 of row
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
  if (you.y >= 6 || you.x >= 9) return caughtOutside(ctx, game, t, e);
  const dark = isDark(game, you.x, you.y);
  const atHisDesk = near(game, him, 'boss_desk', 0.9);
  const P = at(you);
  // At his desk he is in his chair; off it, he walked over to you: he stands at arm's length.
  const side = P.x + 120 < TAB.x + TAB.w - 40 ? 1 : -1;
  const B = atHisDesk ? { x: DESK.x, y: DESK.y - 22 } : { x: P.x + side * 120, y: P.y + 6 };

  office(ctx);
  lamp(ctx, DESK.x, !dark, t);
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
  const held = !!game.player.held;
  const atTray = !held && w.letter === 'tray' && Math.hypot(P.x - TRAY_X, P.y - DESK.y) < 110;
  Object.assign(p, { sweat: true, scale: 2.4 });
  p.dir = atTray ? Math.atan2((DESK.y - P.y) / 0.6, TRAY_X - P.x) : Math.atan2((B.y - P.y) / 0.6, B.x - P.x);
  p.head = p.dir + Math.sin(t * 9) * 0.25;
  if (!inHand(p, game) && atTray) p.arms = 'reach';
  const drawYou = () => drawPerson(ctx, game.level.looks.player, p, P.x, P.y);
  if (w.letter === 'dropped') paintLetter(ctx, P.x + 26, P.y + 14, 2.2, 0.4);
  if (atHisDesk) drawYou();
  else if (B.y < P.y) { drawHim(); drawYou(); } else { drawYou(); drawHim(); }

  if (dark) darkness(ctx, torchOn(b, B.x, B.y, P.x, P.y - 20));
  bubble(ctx, ['❗', '😠'], B.x + 30, Math.max(TAB.y + 66, B.y - 86), e, 'alert');
}

// Caught outside his office: he came out to the lighting panel to see why his lights were off and found you at it, or
// Kev found you at the fuse box he came to fix. Whoever caught you points at you (in the dark, his phone torch is on
// you); you sweat, the letter in your hand if you had it. The panel or the fuse box shows as it was.
function caughtOutside(ctx, game, t, e) {
  const w = game.world;
  const you = game.player;
  const by = game.npcs.find((n) => n.id === game.caught?.by) ?? game.npcs.find((n) => n.id === 'boss');
  const dark = isDark(game, you.x, you.y);
  office(ctx);
  if (near(game, you, 'office_switch', 2.5)) control(ctx, 'switch', 470, 150, 3.2, w.officeLight !== 'off', dark, t);
  else if (you.x < 4 && you.y < 10) control(ctx, 'breaker', 470, 146, 3.2, w.fuse === 'on', dark, t);
  const P = { x: 470, y: 300 };
  const B = { x: by && by.x < you.x ? 290 : 650, y: 290 };
  const b = boss(t, { angry: true });
  b.dir = Math.atan2((P.y - B.y) / 0.6, P.x - B.x);
  b.head = b.dir;
  if (dark) { b.arms = 'carry'; b.item = '#phone'; } else b.arms = 'point';
  drawPerson(ctx, game.level.looks[by?.id ?? 'boss'], b, B.x, B.y);
  const p = person(t);
  Object.assign(p, { sweat: true, scale: 2.4 });
  p.dir = Math.atan2((B.y - P.y) / 0.6, B.x - P.x);
  p.head = p.dir + Math.sin(t * 9) * 0.25;
  inHand(p, game);
  drawPerson(ctx, game.level.looks.player, p, P.x, P.y);
  if (w.letter === 'dropped') paintLetter(ctx, P.x + 26, P.y + 14, 2.2, 0.4);
  if (dark) darkness(ctx, torchOn(b, B.x, B.y, P.x, P.y - 20));
  bubble(ctx, ['❗', '😠'], B.x + 30, B.y - 86, e, 'alert');
}

// A win is the scene of its route (outcomeOrder puts the most dramatic first); 'blamed' never happens here (the
// verdict makes it a win), but scores the same.
const ROUTE_SCENE = { breaker: 'breaker', blackout: 'blackout' };
export const END_SCENES = {
  kindOf: (o) => (o?.why === 'eaten' || o?.why === 'soggy' || o?.why === 'deskwork' ? o.why
    : o?.result === 'win' || o?.result === 'blamed' ? ROUTE_SCENE[o.routes?.[0]] ?? 'switch' : o?.result ?? 'fail'),
  scenes: {
    switch: { win: true, icons: ['💡', '@boss', '❓', '✉️'], draw: sceneWin('switch') }, // his light, him baffled, the letter yours
    blackout: { win: true, icons: ['@lin', '☕', '⚡', '✉️'], draw: sceneWin('blackout') }, // Lin's coffee machine shorted the power, the letter
    breaker: { win: true, icons: ['⚡', '@kev', '🔧', '✉️'], draw: sceneWin('breaker') }, // the fuse box, Kev fixed it, the letter
    eaten: { win: true, icons: ['✉️', '🤢', '@boss', '❓'], draw: sceneEaten }, // you ate it; he finds his tray empty
    soggy: { win: false, icons: ['🤢', '@boss', '✉️', '😠'], draw: sceneSoggy }, // it came back up; he came to look and knew his envelope
    fail: { win: false, icons: ['@boss', '✉️', '😠', '📦'], draw: sceneFail }, // he read it; you pack your box
    deskwork: { win: false, icons: ['@kev', '👉', '📄', '✉️'], draw: sceneDeskwork }, // Kev told; buried in work, you never got it back
    caught: { win: false, icons: ['@boss', '👉', '@player'], draw: sceneCaught }, // he finds you: in the light or in his torch
  },
};
