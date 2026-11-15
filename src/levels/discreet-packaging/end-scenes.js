// Discreet Packaging's end cards: a drawn scene per outcome (contract:
// src/levels/meeting/end-scenes.js). Each shows the day as it ended at the 4:00 mail call: where Lin and Bob are,
// who has the pink box and whose face is on its label, and what you hold. The icon row retells the picture.
// Every object is drawn (painters.js: the two parcels, the broom, Bob's monitor picture); only bubbles speak.
import { clamp, easeOutBack, rrect, fillCircle, fillEllipse } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson, itemGlyph } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { drawClock } from '../../render/things.js';
import { TAB, person, bubble, floorCarpet, floorTiles, confetti, backWall } from '../../render/tableau.js';
import { drawParcel, drawBrownBox, brownFace, drawPicture, caughtPicture } from './painters.js';

const WALL_Y = 196; // the back wall's foot
const WOOD = '#7a4a2a';
const WOOD_DARK = '#4e2e1a';
const WOOD_TOP = '#93603a';
const LAMINATE = '#c9c2b4';
const LAMINATE_DARK = '#9d9586';

const looks = (game) => game.level.looks;
const npcAt = (game, id) => game.npcs?.find((n) => n.id === id) ?? null;
const enter = (e, d = 0) => easeOutBack(clamp((e - d) / 0.35, 0, 1));
const youHold = (game) => itemGlyph(game.level.items, game.player?.held);
const inZone = (game, x, y, zone) => {
  const z = game.level.zones[zone];
  return z && x >= z.x0 && x <= z.x1 + 1 && y >= z.y0 && y <= z.y1 + 1;
};

// --- Backdrops -----------------------------------------------------------------------------------------------------

// Your office at 4:00: carpet, the back wall with a window and the clock at four.
function office(ctx, clockX = 480) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  window_(ctx, 250, 112, 110, 56);
  ctx.save();
  drawClock(ctx, clockX, 128, 30, 60);
  ctx.restore();
}

// The back office or the mailroom: lino and a plain wall.
function backRoom(ctx) {
  floorTiles(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
}

// The corridor: a long plain wall with doors off it, no window, no clock.
function corridor(ctx) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  backWall(ctx, WALL_Y - TAB.y);
  for (const dx of [250, 520, 700]) {
    ctx.fillStyle = WOOD_DARK;
    ctx.fillRect(dx - 2, 118, 54, WALL_Y - 118);
    ctx.fillStyle = WOOD;
    ctx.fillRect(dx + 2, 122, 46, WALL_Y - 122);
    fillCircle(ctx, dx + 40, 162, 2.6, C.steel);
  }
}

// Where something happened, as a backdrop: your office, the corridor, or the lino everywhere else.
function backdropAt(ctx, game, x, y) {
  if (inZone(game, x, y, 'office')) office(ctx);
  else if (inZone(game, x, y, 'corridor')) corridor(ctx);
  else backRoom(ctx);
}

// Where a box hit the floor: a scuff mark and a little cloud of dust, centred on (x, y).
function scuff(ctx, x, y, t) {
  ctx.strokeStyle = 'rgba(70,55,45,0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 26, y + 3);
  ctx.quadraticCurveTo(x, y - 3, x + 24, y + 2);
  ctx.moveTo(x - 18, y + 8);
  ctx.lineTo(x + 12, y + 7);
  ctx.stroke();
  const k = (t * 0.6) % 1;
  for (const [dx, r] of [[-30, 7], [-18, 5], [24, 7], [34, 4.5]]) {
    ctx.globalAlpha = 0.6 * (1 - k * 0.6);
    fillCircle(ctx, x + dx * (1 + k * 0.3), y - 3 - k * 6, r * (1 + k * 0.4), '#cfc6b8');
  }
  ctx.globalAlpha = 1;
}

function window_(ctx, x, y, w, h) {
  ctx.fillStyle = '#e9e3d4';
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  ctx.fillStyle = '#a9cde0';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x + 6, y + 4, w * 0.3, h - 8);
  ctx.fillStyle = '#e9e3d4';
  ctx.fillRect(x + w / 2 - 2, y, 4, h);
}

// Your desk from the front: top slab at y, front panel below, its drawers shut (whatever is in them).
function desk(ctx, cx, y, w) {
  const h = 46;
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(cx - w / 2 + 6, y + h - 2, w, 8);
  ctx.fillStyle = WOOD;
  ctx.fillRect(cx - w / 2 + 4, y + 8, w - 8, h - 8);
  ctx.fillStyle = WOOD_DARK;
  ctx.fillRect(cx - w / 2 + 4, y + 8, w - 8, 3);
  ctx.fillStyle = WOOD_TOP;
  rrect(ctx, cx - w / 2, y, w, 10, 3);
  ctx.fill();
  // your red mug and your screen
  ctx.fillStyle = C.tomato;
  rrect(ctx, cx - w / 2 + 16, y - 13, 11, 13, 2);
  ctx.fill();
  ctx.fillStyle = '#4a4646';
  rrect(ctx, cx - 20, y - 34, 40, 30, 3);
  ctx.fill();
  ctx.fillStyle = '#f4f1e6';
  ctx.fillRect(cx - 16, y - 30, 32, 21);
  ctx.fillStyle = '#4a4646';
  ctx.fillRect(cx - 5, y - 4, 10, 4);
  // the drawers
  const dx = cx + w / 2 - 46;
  for (let i = 0; i < 2; i++) {
    ctx.fillStyle = WOOD_DARK;
    ctx.fillRect(dx, y + 14 + i * 15, 36, 12);
    ctx.fillStyle = C.steel;
    ctx.fillRect(dx + 13, y + 19 + i * 15, 10, 2);
  }
}

// Bob's counter seen from the lobby side, from x0 to x1, top at y.
function counter(ctx, x0, x1, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(x0 + 6, y + 60, x1 - x0, 8);
  ctx.fillStyle = LAMINATE_DARK;
  ctx.fillRect(x0 + 4, y + 8, x1 - x0 - 8, 56);
  ctx.fillStyle = LAMINATE;
  ctx.fillRect(x0 + 4, y + 12, x1 - x0 - 8, 50);
  ctx.fillStyle = WOOD_TOP;
  rrect(ctx, x0, y, x1 - x0, 11, 3);
  ctx.fill();
}

// --- People ------------------------------------------------------------------------------------------------------

// You, standing, holding what you hold at the end (drawn: the broom, Bob's label, the parcel), feet at (x, y).
// red: you've gone red to the ears.
function you(ctx, game, t, x, y, { smug = false, red = false, sweat = false, head = Math.PI / 2, wob = 0 } = {}) {
  const p = person(t);
  p.smug = smug;
  p.sweat = sweat;
  p.head = head;
  p.item = youHold(game);
  p.arms = p.item ? 'carry' : 'idle';
  p.scale = 2.3;
  drawPerson(ctx, looks(game).player, p, x, y - wob);
  if (red) blush(ctx, looks(game).player, p, x, y - wob);
  return p;
}

// A red flush over a viewer-facing head (feet at x, y).
function blush(ctx, look, p, x, y) {
  const sc = p.scale;
  const hy = y + sc * (-2 - 10 * (look.tall || 1) - (p.smug ? 1.2 : 0));
  const r = look.head * sc;
  ctx.save();
  ctx.globalAlpha = 0.38;
  fillCircle(ctx, x, hy + r * 0.1, r * 0.92, '#e8323a');
  ctx.globalAlpha = 0.6;
  fillEllipse(ctx, x - r * 0.5, hy + r * 0.35, r * 0.24, r * 0.15, '#d81f2c');
  fillEllipse(ctx, x + r * 0.5, hy + r * 0.35, r * 0.24, r * 0.15, '#d81f2c');
  ctx.restore();
}

// Sleeves from both shoulders to hands at (±hx, hy), and the hands, over a person drawn facing the viewer (feet at
// x, y, scale sc). For poses the engine has no arms for: a box over the head, a hug.
function arms(ctx, look, x, y, sc, path) {
  const sl = 9 * (look.wide || 1) * 0.85;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  ctx.strokeStyle = look.bodyDark;
  ctx.lineWidth = 3.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * sl, -4);
    for (const [px, py] of path) ctx.lineTo(side * px, py);
    ctx.stroke();
    const [hx, hy] = path[path.length - 1];
    fillCircle(ctx, side * hx, hy, 2.3, look.skin);
  }
  ctx.restore();
}

// The pink box held up over a person's head in both hands (arms 'cheer'), its label `who`'s face.
function boxOverhead(ctx, look, x, y, sc, who, t) {
  const lift = Math.sin(t * 5) * 0.8;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  drawParcel(ctx, 0, -20 + lift, 24, who, false);
  ctx.restore();
  arms(ctx, look, x, y, sc, [[11, -14], [12.5, -23 + lift]]);
}

// The pink box hugged to a person's chest, chin on its lid (Bob, big as he is).
function boxHugged(ctx, look, x, y, sc, who, t) {
  const squeeze = Math.sin(t * 3) * 0.4;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  drawParcel(ctx, 0, 9, 17 + squeeze, who, false);
  ctx.restore();
  arms(ctx, look, x, y, sc, [[11, 0], [9, 4], [4.5, 4.5]]);
}

// A box held out at the waist, label to the person holding it: the pink one, or (brown) Bob's.
function boxHeldOut(ctx, look, x, y, sc, who, brown = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  if (brown) drawBrownBox(ctx, 0, 8, 22, who, false);
  else drawParcel(ctx, 0, 8, 20, who, false);
  ctx.restore();
  arms(ctx, look, x, y, sc, [[11, 1], [10.5, 3]]);
}

// Tears running from a viewer-facing person's eyes (feet at x, y).
function tears(ctx, look, x, y, sc, t) {
  const hy = -2 - 10 * (look.tall || 1);
  for (const side of [-1, 1]) {
    const k = (t * 0.9 + (side > 0 ? 0.5 : 0)) % 1;
    ctx.globalAlpha = 1 - k * 0.7;
    const tx = x + sc * side * look.head * 0.42;
    const ty = y + sc * (hy + 1.5 + k * 5);
    ctx.fillStyle = '#7fc4ef';
    ctx.beginPath();
    ctx.moveTo(tx, ty - 2.6 * sc * 0.5);
    ctx.quadraticCurveTo(tx + 1.6, ty + 1, tx, ty + 1.8);
    ctx.quadraticCurveTo(tx - 1.6, ty + 1, tx, ty - 2.6 * sc * 0.5);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Lin, standing, with what she has left: your parcel (carried, or held overhead for the whole office), Bob's brown
// box held out (to you, once you swapped the labels), or nothing and a shrug (no pink box for you today).
function lin(ctx, game, t, x, y, { dir = Math.PI / 2, head = dir, smug = false, overhead = false, arms: a = null } = {}) {
  const w = game.world;
  const p = person(t);
  p.dir = dir;
  p.head = head;
  p.smug = smug;
  p.scale = 2.3;
  const has = w.parcel === 'lin';
  const brown = w.brown === 'lin';
  if (a) p.arms = a;
  else if (has && overhead) p.arms = 'cheer';
  else if (has) { p.arms = 'carry'; p.item = '#parcel'; } else if (brown) p.arms = 'reach';
  else if (w.mailEmpty) p.arms = 'shrug';
  drawPerson(ctx, looks(game).lin, p, x, y);
  if (!a && has && overhead) boxOverhead(ctx, looks(game).lin, x, y, p.scale, w.parcelFor, t);
  if (!a && !has && brown) boxHeldOut(ctx, looks(game).lin, x, y, p.scale, brownFace(w), true);
  return p;
}

// Bob in his navy uniform and cap; hugging the pink parcel once it's his, or holding his own brown one.
function bob(ctx, game, t, x, y, { dir = Math.PI / 2, head = dir, angry = false, arms: a = 'idle', sc = 2.5 } = {}) {
  const w = game.world;
  const p = person(t);
  p.dir = dir;
  p.head = head;
  p.angry = angry;
  p.badge = true;
  p.arms = a;
  p.scale = sc;
  const hugs = w.parcel === 'bob' && a === 'idle';
  if (hugs) p.arms = 'reach';
  else if (w.brown === 'bob' && a === 'idle') { p.arms = 'carry'; p.item = '#brownbox'; }
  drawPerson(ctx, looks(game).bob, p, x, y);
  if (hugs) boxHugged(ctx, looks(game).bob, x, y, sc, w.parcelFor, t);
  return p;
}

// Your chair, pulled out from your desk and empty, feet at (x, y). spot: in a spotlight (the losses: where are
// you?); the away win leaves it unlit, since nobody is looking for you.
function emptyChair(ctx, x, y, spot = true) {
  if (spot) spotlight(ctx, x, y);
  ctx.save();
  ctx.translate(x, y - 20);
  ctx.scale(2.6, 2.6);
  drawChair(ctx, 0, 0, Math.PI / 2 + 0.5, '#d6a23a', '#a97b22');
  ctx.restore();
}

function spotlight(ctx, x, y) {
  ctx.save();
  ctx.globalAlpha = 0.35;
  fillEllipse(ctx, x, y + 6, 70, 18, '#fff7d0');
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#fff7d0';
  ctx.beginPath();
  ctx.moveTo(x - 30, TAB.y);
  ctx.lineTo(x + 30, TAB.y);
  ctx.lineTo(x + 70, y + 6);
  ctx.lineTo(x - 70, y + 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// --- Scenes ------------------------------------------------------------------------------------------------------

// bob: Lin has handed big, stern Bob the pink box covered in hearts, his face on the label. He hugs it, in tears.
// She holds his dull brown box out to you (your face on it now); you stand by, smug. Away at 4:00: she holds it out
// to your empty chair, and nobody minds.
function bobScene(ctx, game, t, e) {
  const away = game.outcome?.why === 'away';
  office(ctx, 560);
  confetti(ctx, TAB.x + 360, 220, TAB.y, TAB.h, e, 22);
  bob(ctx, game, t, 300, 300 - Math.abs(Math.sin(t * 2)) * 1.5, { sc: 2.6 });
  if (game.world.parcel === 'bob') tears(ctx, looks(game).bob, 300, 300, 2.6, t);
  bubble(ctx, ['🥹'], 300, 196, e, 'thought');
  if (away) emptyChair(ctx, 650, 320, false);
  lin(ctx, game, t, 470, 296, { dir: Math.PI / 2 - 0.5, head: Math.PI / 2 - 0.6 });
  bubble(ctx, ['#brownbox', '@player'], 470, 196, e - 0.2);
  if (!away) you(ctx, game, t, 650, 318, { smug: true, head: Math.PI / 2 + Math.sin(t * 1.3) * 0.15, wob: Math.abs(Math.sin(t * 3)) * 2 });
}

// hidden: no pink box on the parcel shelf today. Lin shrugs at you, nothing for you; Bob has his brown box; you
// stand at your desk whistling, its drawers shut (or the box in your arms, or under your desk).
function hiddenScene(ctx, game, t, e) {
  const w = game.world;
  office(ctx, 420);
  const loose = w.items.find((it) => it.type === 'parcel' && !it.spot);
  const looseHere = loose && inZone(game, loose.x, loose.y, 'office');
  if (looseHere) drawParcel(ctx, 640, 318, 40, w.parcelFor);
  desk(ctx, 600, 262, 190);
  lin(ctx, game, t, 290, 296, { head: Math.PI / 2 + Math.sin(t * 1.5) * 0.2 });
  bubble(ctx, ['📭', '@player'], 290, 204, e);
  bob(ctx, game, t, 390, 300, { dir: Math.PI / 2 - 0.2, sc: 2.5 });
  you(ctx, game, t, 470, 324, { smug: true, head: Math.PI / 2 - 0.4 + Math.sin(t * 1.1) * 0.2 });
  bubble(ctx, ['🎵'], 470, 232, e - 0.3, 'thought');
}

// mail: Lin holds your pink box up over her head, your face on the label, for the whole office to see. Bob turns to
// look at you. You go red.
function mailScene(ctx, game, t, e) {
  office(ctx, 330);
  bob(ctx, game, t, 270, 300, { dir: Math.PI / 2 - 0.9, head: -0.05, sc: 2.5 });
  lin(ctx, game, t, 440, 296, { head: Math.PI / 2 - 0.5, overhead: true });
  bubble(ctx, ['💝', '@player'], 540, 150, e);
  you(ctx, game, t, 650, 318, { red: true, sweat: true, head: Math.PI / 2 + 0.3 });
  bubble(ctx, ['😳'], 650, 226, e - 0.4, 'thought');
}

// noshow: you weren't there, but your parcel was. Lin holds it up over your empty chair, your face on the label.
function noshowScene(ctx, game, t, e) {
  office(ctx, 330);
  desk(ctx, 640, 270, 170);
  emptyChair(ctx, 560, 322);
  bob(ctx, game, t, 270, 300, { dir: Math.PI / 2 - 0.5, head: Math.PI / 2 - 0.6, sc: 2.5 });
  lin(ctx, game, t, 420, 296, { head: Math.PI / 2 - 0.5, overhead: true });
  bubble(ctx, ['💝', '@player'], 420, 140, e);
}

// Who found your parcel: whoever caught you with it, or is holding it, or went for it.
function finderOf(game) {
  if (game.caught?.reason === 'found' && game.caught.by) return game.caught.by;
  const n = game.npcs.find((m) => m.carry === 'parcel') ?? game.npcs.find((m) => m.override === 'fetching' || m._fetch);
  return n?.id ?? 'lin';
}

// found: someone picked up the pink box (off the floor, or off you) and read the label: your face. They hold it
// out and look at you; you go red.
// Off the floor: the icon row opens on the dropped box, and the floor shows where it landed.
let foundIcons = ['@lin', '💝', '@player', '😳'];
function foundScene(ctx, game, t, e) {
  const id = finderOf(game);
  const dropped = game.world.parcel === 'found';
  foundIcons = dropped ? ['#dropped', '@' + id, '@player', '😳'] : ['@' + id, '💝', '@player', '😳'];
  const n = npcAt(game, id);
  backdropAt(ctx, game, n?.x ?? 4, n?.y ?? 4);
  if (dropped) scuff(ctx, 250, 312, t);
  const look = looks(game)[id] ?? looks(game).lin;
  const sc = id === 'bob' ? 2.5 : 2.3;
  const p = person(t);
  p.dir = Math.PI / 2 - 0.35;
  p.head = Math.PI / 2 - 0.7 + Math.sin(t * 1.2) * 0.08; // from the label to you
  p.arms = 'reach';
  p.badge = id === 'bob';
  p.scale = sc;
  drawPerson(ctx, look, p, 380, 298);
  boxHeldOut(ctx, look, 380, 298, sc, game.world.parcelFor);
  bubble(ctx, ['@player', '❗'], 380, 194, e);
  you(ctx, game, t, 620, 316, { red: true, sweat: true, head: Math.PI / 2 + 0.4 });
  bubble(ctx, ['😳'], 620, 224, e - 0.4, 'thought');
}

// caught on camera: Bob, behind his counter, jabs a finger at his monitor; on it, the picture he caught you in (you
// at the pigeonholes, or right up at the lens with the broom, holding what you held: painters.js caughtPicture). You
// stand in the back office behind him, frozen, with what you were holding.
function caughtOnCamera(ctx, game, t, e) {
  backRoom(ctx);
  const shown = caughtPicture(game.world, game);
  you(ctx, game, t, 660, 270, { sweat: true, red: true, head: Math.PI / 2 + 0.5 });
  const b = person(t);
  b.dir = Math.PI - 0.45;
  b.head = b.dir;
  b.arms = 'point';
  b.angry = true;
  b.badge = true;
  b.scale = 2.5;
  drawPerson(ctx, looks(game).bob, b, 500 + (1 - enter(e)) * 30, 300);
  counter(ctx, TAB.x - 10, TAB.x + TAB.w + 10, 292);
  // the monitor on the counter, turned to us
  const mx = 250;
  const my = 196;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  fillEllipse(ctx, mx + 75, my + 104, 70, 8, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = '#2b2828';
  ctx.fillRect(mx + 60, my + 88, 30, 10);
  ctx.fillStyle = '#4a4646';
  rrect(ctx, mx, my, 150, 94, 10);
  ctx.fill();
  ctx.fillStyle = '#5d5858';
  rrect(ctx, mx + 3, my + 3, 144, 86, 8);
  ctx.fill();
  drawPicture(ctx, mx + 10, my + 10, 130, 72, shown, t, 4.2);
  fillCircle(ctx, mx + 140, my + 86, 2.4, '#7fd17a');
  bubble(ctx, ['😠', '@player'], 520, 196, e);
}

// caught: Bob saw you at it, or with his eyes on the camera's screen; or someone found your parcel (foundScene).
let caughtIcons = ['😠', '👉', '@player'];
function caughtScene(ctx, game, t, e) {
  const c = game.caught;
  if (c?.reason === 'found') {
    foundScene(ctx, game, t, e);
    caughtIcons = foundIcons;
    return;
  }
  if (c?.via) {
    caughtIcons = ['📺', '👉', '@player'];
    caughtOnCamera(ctx, game, t, e);
    return;
  }
  caughtIcons = ['😠', '👉', '@player'];
  const pl = game.player;
  backdropAt(ctx, game, pl?.x ?? 4, pl?.y ?? 4);
  you(ctx, game, t, 600, 312, { sweat: true, red: true, head: Math.PI / 2 + 0.6 });
  const b = person(t);
  b.dir = 0;
  b.head = 0;
  b.arms = 'point';
  b.angry = true;
  b.badge = true;
  b.scale = 2.5;
  drawPerson(ctx, looks(game).bob, b, 340 + (1 - enter(e)) * -80, 300);
  bubble(ctx, ['😠', '👉'], 340, 196, e);
}

// blamed: no pink box at the mail call, and no you either. Your chair stands pulled out from your desk, empty in a
// spotlight; Lin and Bob point at it. The drawers stay shut: nothing pink anywhere.
function blamedScene(ctx, game, t, e) {
  office(ctx, 380);
  desk(ctx, 640, 262, 170);
  emptyChair(ctx, 560, 322);
  lin(ctx, game, t, 290, 300, { dir: 0.15, head: 0.1, arms: 'point' });
  bob(ctx, game, t, 410, 304, { dir: 0.25, head: 0.15, arms: 'point', sc: 2.5 });
  bubble(ctx, ['📭', '@player', '❓'], 350, 196, e);
}

function kindOf(o) {
  if (!o) return 'mail';
  const routes = Array.isArray(o.routes) ? o.routes : [];
  if (o.result === 'caught') return 'caught';
  if (o.why === 'noshow') return 'noshow';
  if (o.result === 'blamed') return 'blamed';
  if (o.result === 'win') return routes.includes('bob') ? 'bob' : 'hidden';
  return o.why === 'found' ? 'found' : 'mail';
}

export const END_SCENES = {
  kindOf,
  scenes: {
    bob: { win: true, icons: ['💝', '@bob', '🥹', '#brownbox', '@player'], draw: bobScene },
    hidden: { win: true, icons: ['@lin', '📭', '@player', '🎵'], draw: hiddenScene },
    mail: { win: false, icons: ['💝', '@player', '😳'], draw: mailScene },
    noshow: { win: false, icons: ['💝', '@player', '🪑'], draw: noshowScene },
    // found and caught: whose face leads the row is decided by the picture (draw runs before the row is read)
    found: { win: false, get icons() { return foundIcons; }, draw: foundScene },
    caught: { win: false, get icons() { return caughtIcons; }, draw: caughtScene },
    blamed: { win: false, icons: ['📭', '🪑', '@player', '❓'], draw: blamedScene },
  },
};
