// Discreet Packaging's end cards (the level's id is still 'monitor'): a drawn scene per outcome (contract:
// src/levels/meeting/end-scenes.js). Each shows the day as it ended at the 4:00 mail call: where Lin and Bob are,
// who has the pink box and whose face is on its label, and what you hold. The icon row retells the picture.
// Every object is drawn (painters.js: the parcel, the broom, the label, Bob's monitor picture); only bubbles speak.
import { clamp, easeOutBack, rrect, fillCircle, fillEllipse } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { drawPerson, itemGlyph } from '../../render/characters.js';
import { drawChair } from '../../render/world.js';
import { drawClock } from '../../render/things.js';
import { TAB, person, bubble, floorCarpet, floorTiles, confetti, backWall } from '../../render/tableau.js';
import { angleDiff } from '../../core/vision.js';
import { drawParcel, drawPicture, PINK, PINK_TOP, heart } from './painters.js';

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

// Where something happened, as a backdrop: your office's carpet, or the lino everywhere else.
function backdropAt(ctx, game, x, y) {
  if (inZone(game, x, y, 'office')) office(ctx);
  else backRoom(ctx);
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

// Your desk from the front: top slab at y, front panel below. drawer: your parcel jammed in the right-hand drawer,
// which won't shut (as on the map).
function desk(ctx, cx, y, w, drawer = false) {
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
  if (drawer) {
    // the top drawer pulled out at us, the pink box bulging out of it, a heart on its corner
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(dx - 4, y + 26, 46, 6);
    ctx.fillStyle = PINK;
    ctx.beginPath();
    ctx.moveTo(dx - 1, y + 14);
    ctx.lineTo(dx + 3, y - 2);
    ctx.lineTo(dx + 35, y - 1);
    ctx.lineTo(dx + 39, y + 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PINK_TOP;
    ctx.fillRect(dx + 3, y - 2, 32, 4);
    heart(ctx, dx + 12, y + 6, 3.4);
    heart(ctx, dx + 27, y + 4, 2.6);
    ctx.fillStyle = WOOD;
    ctx.fillRect(dx - 3, y + 13, 42, 15);
    ctx.fillStyle = C.steel;
    ctx.fillRect(dx + 13, y + 19, 12, 2.2);
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

// The pink box held out at the waist, label to the person holding it.
function boxHeldOut(ctx, look, x, y, sc, who) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  drawParcel(ctx, 0, 8, 20, who, false);
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

// Lin, standing; with the parcel if she has it (carried, or held overhead for the whole office), shrugging if the
// parcel shelf was empty.
function lin(ctx, game, t, x, y, { dir = Math.PI / 2, head = dir, smug = false, overhead = false } = {}) {
  const w = game.world;
  const p = person(t);
  p.dir = dir;
  p.head = head;
  p.smug = smug;
  p.scale = 2.3;
  const has = w.parcel === 'lin';
  if (has && overhead) p.arms = 'cheer';
  else if (has) { p.arms = 'carry'; p.item = '#parcel'; } else if (w.mailEmpty) p.arms = 'shrug';
  drawPerson(ctx, looks(game).lin, p, x, y);
  if (has && overhead) boxOverhead(ctx, looks(game).lin, x, y, p.scale, w.parcelFor, t);
  return p;
}

// Bob in his navy uniform and cap; hugging the parcel once it's his.
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
  drawPerson(ctx, looks(game).bob, p, x, y);
  if (hugs) boxHugged(ctx, looks(game).bob, x, y, sc, w.parcelFor, t);
  return p;
}

// --- Scenes ------------------------------------------------------------------------------------------------------

// bob: Lin has handed big, stern Bob a pink box covered in hearts with his face on the label. He hugs it, in tears.
// You stand by, smug.
function bobScene(ctx, game, t, e) {
  office(ctx, 560);
  confetti(ctx, TAB.x + 360, 220, TAB.y, TAB.h, e, 22);
  lin(ctx, game, t, 300, 292, { dir: Math.PI / 2 - 0.5, head: Math.PI / 2 - 0.7, smug: true });
  bob(ctx, game, t, 450, 300 - Math.abs(Math.sin(t * 2)) * 1.5, { sc: 2.6 });
  if (game.world.parcel === 'bob') tears(ctx, looks(game).bob, 450, 300, 2.6, t);
  bubble(ctx, ['🥹'], 450, 196, e, 'thought');
  you(ctx, game, t, 650, 318, { smug: true, head: Math.PI / 2 + Math.sin(t * 1.3) * 0.15, wob: Math.abs(Math.sin(t * 3)) * 2 });
}

// hidden: nothing on the parcel shelf today. Lin shrugs at the mail call, Bob beside her; you stand at your desk
// whistling, the drawer jammed open on a pink corner (or the box in your arms, or under your desk).
function hiddenScene(ctx, game, t, e) {
  const w = game.world;
  office(ctx, 420);
  const loose = w.items.find((it) => it.type === 'parcel' && !it.spot);
  const looseHere = loose && inZone(game, loose.x, loose.y, 'office');
  if (looseHere) drawParcel(ctx, 640, 318, 40, w.parcelFor);
  desk(ctx, 600, 262, 190, w.parcel === 'drawer');
  lin(ctx, game, t, 290, 296, { head: Math.PI / 2 + Math.sin(t * 1.5) * 0.2 });
  bubble(ctx, ['📭', '🤷'], 290, 204, e);
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

// Who found your parcel: whoever caught you with it, or is holding it, or went for it.
function finderOf(game) {
  if (game.caught?.reason === 'found' && game.caught.by) return game.caught.by;
  const n = game.npcs.find((m) => m.carry === 'parcel') ?? game.npcs.find((m) => m.override === 'fetching' || m._fetch);
  return n?.id ?? 'lin';
}

// found: someone picked up the pink box (off the floor, or off you) and read the label: your face. They hold it
// out and look at you; you go red.
let foundIcons = ['@lin', '💝', '@player', '😳'];
function foundScene(ctx, game, t, e) {
  const id = finderOf(game);
  foundIcons = ['@' + id, '💝', '@player', '😳'];
  const n = npcAt(game, id);
  backdropAt(ctx, game, n?.x ?? 4, n?.y ?? 4);
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

// Where the camera sees a point on the map, as the monitor draws it (u across, v near to far).
function project(cam, x, y) {
  const u = angleDiff(Math.atan2(y - cam.y, x - cam.x), cam.dir) / (cam.fov / 2);
  return { u: clamp(u, -1, 1), v: Math.min(1, Math.hypot(x - cam.x, y - cam.y) / cam.radius) };
}

// caught on camera: Bob, behind his counter, jabs a finger at his monitor; on it, you, at the pigeonholes. You stand
// in the back office behind him, frozen, with what you were holding.
function caughtOnCamera(ctx, game, t, e) {
  backRoom(ctx);
  const cam = game.level.cameras[0];
  const pl = game.player;
  const me = project(cam, pl.x, pl.y);
  const shown = {
    feed: 'live',
    blips: [{ u: me.u, v: me.v, color: C.tomato }],
    cabinet: { ...project(cam, 13.6, 7.9), full: game.world.parcel === 'shelf' },
    parcels: [],
  };
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

// blamed: the mail call went to plan, but you weren't in the office for it. Lin and Bob look at your empty chair.
function blamedScene(ctx, game, t, e) {
  office(ctx, 380);
  ctx.save();
  ctx.globalAlpha = 0.25;
  fillEllipse(ctx, 610, 290, 90, 26, '#fff7d0');
  ctx.restore();
  ctx.save();
  ctx.translate(610, 270);
  ctx.scale(2.6, 2.6);
  drawChair(ctx, 0, 0, Math.PI / 2, '#d6a23a', '#a97b22');
  ctx.restore();
  desk(ctx, 610, 290, 170, game.world.parcel === 'drawer');
  lin(ctx, game, t, 300, 300, { dir: Math.PI / 2 - 0.8, head: -0.1 });
  bob(ctx, game, t, 430, 304, { dir: Math.PI / 2 - 0.25, head: -0.15, sc: 2.5 });
  bubble(ctx, ['@player', '❓'], 360, 196, e);
}

function kindOf(o) {
  if (!o) return 'mail';
  const routes = Array.isArray(o.routes) ? o.routes : [];
  if (o.result === 'caught') return 'caught';
  if (o.result === 'blamed') return 'blamed';
  if (o.result === 'win') return routes.includes('bob') ? 'bob' : 'hidden';
  return o.why === 'found' ? 'found' : 'mail';
}

export const END_SCENES = {
  kindOf,
  scenes: {
    bob: { win: true, icons: ['💝', '@bob', '🥹'], draw: bobScene },
    hidden: { win: true, icons: ['@lin', '🤷', '@player', '🎵'], draw: hiddenScene },
    mail: { win: false, icons: ['💝', '@player', '😳'], draw: mailScene },
    // found and caught: whose face leads the row is decided by the picture (draw runs before the row is read)
    found: { win: false, get icons() { return foundIcons; }, draw: foundScene },
    caught: { win: false, get icons() { return caughtIcons; }, draw: caughtScene },
    blamed: { win: false, icons: ['🪑', '❓'], draw: blamedScene },
  },
};
