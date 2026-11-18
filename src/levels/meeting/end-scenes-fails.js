// The meeting's plain fails (DESIGN.md "More endings is more"): 4:00, no slides, the projector working, and you
// up front. Which one you get has a cause you can see (verdict.js verdictFull: outcome.why):
//   sip      the day's last cup in your hand: you hold up a finger and drink it, slowly, in front of everyone.
//            The boss waits. (Kept late, Kev, who wanted that cup all afternoon, watches it go.)
//   call     on the phone (pretending, standing) when 4:00 came: you keep the call going up front, one finger up
//            at the room. The boss taps his watch.
//   puppets  already in the meeting room: you stand in the beam with nothing to show, and make a duck on the screen.
//            The boss stares; Lin bites her lip.
//   (none)   anywhere else: you hurry in, sweating, to a blank screen and a cricket (end-scenes.js tableauFail).
// Same draw signature as end-scenes.js (draw(ctx, game, t, e, outcome), inside TAB, screen space). Objects are
// drawn, never emoji; only bubbles speak emoji.
import { rrect, fillEllipse, drawScreen } from '../../render/util.js';
import { C, TEAL, OLIVE } from '../../render/palette.js';
import { chair } from '../../render/tableau-furniture.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble, floorCarpet } from '../../render/tableau.js';
import { findNpc } from '../../game/perception.js';

function bossJacket(game) {
  const boss = game.npcs && findNpc(game, 'boss');
  return boss ? game.world.jacket === boss.id : true;
}
const kevHere = (game) => !game.world || !game.world.kevGone;

// The meeting room from the foot of the table: carpet, the screen on the back wall, the long walnut table across
// the middle. glow: the screen lit by the projector beam.
function room(ctx, t) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.meetingRug, '#397369');
  drawScreen(ctx, 372, 100, 216, 92, {
    glow: ['rgba(255,255,235,0.35)', 10, 6, 6], bar: [6, 6, 6], face: '#ffffff', edge: 'rgba(0,0,0,0.12)',
  });
}

// Lin and Kev in their chairs on the left (teal, olive: decor.js), both turned to the front; the boss standing at
// the right of the screen, facing you. who: per-figure tweaks ({ lin, kev, boss } fields merged onto the person).
function audience(ctx, game, t, who = {}) {
  if (kevHere(game)) chair(ctx, 250, 222, OLIVE, 2.2, 0.2);
  chair(ctx, 286, 304, TEAL, 2.2, -0.2);
  if (kevHere(game)) {
    const k = person(t);
    k.pose = 'sit';
    k.arms = 'desk';
    k.dir = 0.2;
    k.head = 0.1;
    k.scale = 2.1;
    Object.assign(k, who.kev);
    drawPerson(ctx, game.level.looks.kev, k, 250, 214);
  }
  const l = person(t);
  l.pose = 'sit';
  l.arms = 'desk';
  l.dir = -0.2;
  l.head = -0.15;
  l.scale = 2.1;
  Object.assign(l, who.lin);
  drawPerson(ctx, game.level.looks.lin, l, 286, 296);
  const b = person(t);
  b.dir = Math.PI;
  b.head = Math.PI + 0.1;
  b.jacket = bossJacket(game);
  b.scale = 2.3;
  Object.assign(b, who.boss);
  drawPerson(ctx, game.level.looks.boss, b, 690, 262);
}

// The last cup: up front, you hold up one finger (☝️: just a moment) and drink it, slowly, tipped right back. Kev
// watches it go.
function tableauSip(ctx, game, t, e) {
  room(ctx, t);
  audience(ctx, game, t, {
    kev: { head: -0.25, sweat: false }, // eyes on the cup
    boss: { arms: 'idle' },
  });
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = Math.PI / 2;
  p.arms = 'sip';
  p.item = '#cup';
  p.lift = e < 1.2 ? 0.3 + 0.5 * (e / 1.2) : 0.95 - 0.04 * Math.max(0, Math.sin(t * 2.5));
  p.scale = 2.5;
  drawPerson(ctx, game.level.looks.player, p, 480, 276);
  bubble(ctx, e < 1.6 ? ['☝️'] : ['☕', '😌'], 480, 176, e < 1.6 ? e : e - 1.6, 'speech', 1.2);
  bubble(ctx, ['😐'], 690, 180, e - 1.2, 'thought');
  if (kevHere(game)) bubble(ctx, ['☕', '🥺'], 250, 140, e - 2.4, 'thought');
  else bubble(ctx, ['😐'], 286, 222, e - 2.4, 'thought');
}

// The call: up front, phone to your ear, nodding into it, your free hand up with one finger (☝️: sorry, one sec).
// The boss taps his wrist.
function tableauCall(ctx, game, t, e) {
  room(ctx, t);
  audience(ctx, game, t, {
    boss: { arms: 'point', angry: e > 1.6 },
  });
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = Math.PI / 2 + Math.sin(t * 5) * 0.12; // nodding along
  p.arms = 'phone';
  p.scale = 2.5;
  drawPerson(ctx, game.level.looks.player, p, 480, 276);
  raisedFinger(ctx, game, 514, 230, t);
  bubble(ctx, ['☝️', '📱'], 480, 176, e, 'speech', 1.2);
  bubble(ctx, ['⌚', '😠'], 690, 180, e - 0.8, 'speech');
}

// Your free hand, up at shoulder height, index finger raised: a sleeve, a fist, a finger.
function raisedFinger(ctx, game, x, y, t) {
  const look = game.level.looks.player;
  const bob = Math.sin(t * 5) * 1;
  ctx.strokeStyle = look.body;
  ctx.lineCap = 'round';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 28);
  ctx.lineTo(x, y + 6 + bob);
  ctx.stroke();
  fillEllipse(ctx, x, y + 3 + bob, 6, 5.5, look.skin);
  ctx.fillStyle = look.skin;
  rrect(ctx, x - 2.5, y - 12 + bob, 5, 14, 2.5);
  ctx.fill();
  ctx.lineCap = 'butt';
}

// The duck: you stand in the projector's beam, your back to us, hands up, and on the white screen your shadow makes
// a duck, its beak quacking. The boss stares (😐); Lin, a hand over her mouth, shakes (🤭).
function tableauPuppets(ctx, game, t, e) {
  room(ctx, t);
  // the beam, from the projector behind us up to the screen
  ctx.fillStyle = 'rgba(255,250,220,0.16)';
  ctx.beginPath();
  ctx.moveTo(458, TAB.y + TAB.h);
  ctx.lineTo(502, TAB.y + TAB.h);
  ctx.lineTo(588, 192);
  ctx.lineTo(372, 192);
  ctx.closePath();
  ctx.fill();
  duckShadow(ctx, 480, 148, t, e);
  const shake = e > 1.4 ? Math.sin(t * 30) * 1.2 : 0;
  audience(ctx, game, t, {
    lin: e > 1.4 ? { arms: 'facepalm', head: -0.5 + shake * 0.05 } : {},
    kev: { head: -0.6, glance: 1 },
    boss: { head: Math.PI + 0.35 },
  });
  const p = person(t);
  p.dir = -Math.PI / 2; // facing the screen, back to us
  p.head = -Math.PI / 2;
  p.arms = 'cheer';
  p.scale = 2.5;
  drawPerson(ctx, game.level.looks.player, p, 480, 272);
  bubble(ctx, ['😐'], 690, 180, e - 0.9, 'thought');
  if (e > 1.4) bubble(ctx, ['🤭'], 286 + shake, 222, e - 1.4, 'speech');
}

// The shadow on the screen: the top of your head and shoulders at the bottom edge, and above them, your hands
// making a duck: a round head, a long beak that opens and shuts, an eye of light.
function duckShadow(ctx, x, y, t, e) {
  const sh = 'rgba(40,36,34,0.82)';
  ctx.save();
  ctx.beginPath();
  ctx.rect(372, 100, 216, 92);
  ctx.clip();
  fillEllipse(ctx, x, 196, 34, 22, sh); // your head
  fillEllipse(ctx, x, 210, 70, 18, sh); // shoulders
  ctx.strokeStyle = sh; // your arms up into the beam
  ctx.lineCap = 'round';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(x - 46, 200);
  ctx.lineTo(x - 12, y + 18);
  ctx.moveTo(x + 46, 200);
  ctx.lineTo(x + 2, y + 18);
  ctx.stroke();
  const quack = e > 0.6 ? Math.max(0, Math.sin(t * 7)) * 0.35 : 0;
  ctx.fillStyle = sh;
  ctx.beginPath(); // the duck's head: the back of your hands
  ctx.ellipse(x - 6, y, 24, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.save(); // the beak: two fingers, upper and lower
  ctx.translate(x + 12, y + 2);
  ctx.rotate(-quack);
  rrect(ctx, 0, -9, 40, 9, 4);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(x + 12, y + 2);
  ctx.rotate(quack * 0.6);
  rrect(ctx, 0, 0, 34, 8, 4);
  ctx.fill();
  ctx.restore();
  fillEllipse(ctx, x + 2, y - 7, 3.2, 3.2, '#ffffff'); // the eye: light through your fingers
  ctx.restore();
  ctx.lineCap = 'butt';
}

export const FAIL_SCENES = {
  sip: { win: false, icons: ['☝️', '☕', '😐'], draw: tableauSip }, // the last cup in your hand: you drink it up front
  call: { win: false, icons: ['☝️', '📱', '⌚'], draw: tableauCall }, // on the phone at 4:00: you keep the call going
  puppets: { win: false, icons: ['📽️', '🦆', '😐'], draw: tableauPuppets }, // in the room: a duck in the beam
};
