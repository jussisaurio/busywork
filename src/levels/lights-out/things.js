// Lights Out's own objects, drawn as the real thing (no emoji on a tile or in a hand): the boss's in-tray, your
// letter, and a phone held up as a torch (end scenes only: on the floor, render/darkness.js draws it). The tray is
// a decor.props painter (render/world.js calls it as (ctx, info, tile, shown, t)); the end scenes draw all three
// bigger. Sizes are map pixels at s = 1 (a tile is 32).
import { T, rrect } from '../../render/util.js';

// Your letter: a white envelope, 14 x 9, its flap folded down, centred on (x, y), turned `rot`.
export function paintLetter(ctx, x, y, s = 1, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(-6.5, -3.5, 14, 9);
  ctx.fillStyle = '#fbf8f0';
  ctx.fillRect(-7, -4.5, 14, 9);
  ctx.strokeStyle = '#a8a091';
  ctx.lineWidth = 0.9;
  ctx.strokeRect(-7, -4.5, 14, 9);
  ctx.beginPath();
  ctx.moveTo(-7, -4.5);
  ctx.lineTo(0, 0.8);
  ctx.lineTo(7, -4.5);
  ctx.stroke();
  ctx.restore();
}

// The in-tray: a chrome wire basket, 22 x 12, centred on (x, y). The desk shows through its mesh, so an empty one
// reads empty; your letter lies in it while it's there.
const WIRE = '#dfe4e8';
export function paintTray(ctx, x, y, letter, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; // its shadow on the desk
  rrect(ctx, -10, -3.5, 22, 11, 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(30,24,20,0.16)'; // the inside, a touch darker than the desk
  ctx.fillRect(-10.5, -5.5, 21, 8);
  ctx.save(); // the mesh floor
  ctx.beginPath();
  ctx.rect(-10.5, -5.5, 21, 8);
  ctx.clip();
  ctx.strokeStyle = 'rgba(223,228,232,0.55)';
  ctx.lineWidth = 0.45;
  ctx.beginPath();
  for (let k = -20; k <= 14; k += 2.4) {
    ctx.moveTo(k, -5.5);
    ctx.lineTo(k + 8, 2.5);
    ctx.moveTo(k + 8, -5.5);
    ctx.lineTo(k, 2.5);
  }
  ctx.stroke();
  ctx.restore();
  if (letter) paintLetter(ctx, 0.5, -1.2, 1, -0.08);
  ctx.fillStyle = 'rgba(205,212,218,0.3)'; // the front face, wires running down it
  ctx.fillRect(-10.5, 2.5, 21, 3.5);
  ctx.strokeStyle = 'rgba(223,228,232,0.8)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let k = -9; k <= 9; k += 2) {
    ctx.moveTo(k, 2.5);
    ctx.lineTo(k, 6);
  }
  ctx.stroke();
  ctx.strokeStyle = WIRE; // the rails
  ctx.lineWidth = 1.1;
  ctx.strokeRect(-10.5, -5.5, 21, 8);
  ctx.beginPath();
  ctx.moveTo(-10.5, 6);
  ctx.lineTo(10.5, 6);
  ctx.moveTo(-10.5, 2.5);
  ctx.lineTo(-10.5, 6);
  ctx.moveTo(10.5, 2.5);
  ctx.lineTo(10.5, 6);
  ctx.stroke();
  ctx.restore();
}

// decor.props painter: shown { letter } (is your letter in it).
export function trayProp(ctx, info, at, shown) {
  paintTray(ctx, at.x * T + T / 2, at.y * T + T / 2 - 1, shown.letter);
}

// A phone held up as a torch, its back to you, centred on (x, y): a dark slab, the flash lit at its top while `lit`.
// Returns where the flash is (a beam starts there).
export function paintPhone(ctx, x, y, s = 1, lit = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#16181d';
  rrect(ctx, -3, -5, 6, 10, 1.4);
  ctx.fill();
  ctx.fillStyle = '#3a3f48'; // the camera bump
  rrect(ctx, -2.2, -4.2, 4.4, 2.6, 0.8);
  ctx.fill();
  if (lit) {
    const g = ctx.createRadialGradient(0, -3, 0.3, 0, -3, 7);
    g.addColorStop(0, 'rgba(255,250,225,0.95)');
    g.addColorStop(0.35, 'rgba(255,240,190,0.4)');
    g.addColorStop(1, 'rgba(255,240,190,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-7, -10, 14, 14);
    ctx.fillStyle = '#fffdf0';
    ctx.beginPath();
    ctx.arc(0, -3, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return { x, y: y - 3 * s };
}
