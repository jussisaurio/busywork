// Discreet Packaging's things, drawn: no emoji stands in for an object. Mum's
// pink parcel and Bob's plain brown one, the pigeonholes they wait in, Bob's monitor and the wall camera that feeds
// it, the power strip with the camera's plug, the broom and your desk drawer. The furniture painters are
// presentation.js DECOR.props draw functions ((ctx, info, at, shown, t), map px); the things you can carry (the
// parcel, the broom) are items[type].draw painters (render/things.js), and the things only bubbles and poses show
// (Bob's box, Lin's armful of post, static) are DECOR.things; the end scenes (end-scenes.js) reuse them all.
import { T, rrect, fillCircle, fillEllipse, emoji, hash, clamp } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { box } from '../../render/things.js';
import { cameraFeed } from '../../game/perception.js';
import { cameraViewer } from '../../sim/mechanics/camera.js';
import { canSee, angleDiff } from '../../core/vision.js';
import { deg } from '../../config.js';

export const PINK = '#f4a6c6';
export const PINK_TOP = '#f9c6dc';
export const PINK_DARK = '#d97aa3';
export const HEART = '#d83a4a';
const LABEL = '#fbfaf5';
const CUBBY = '#4a3422';
const CAM_ID = 'back_office_cam';

// --- the parcel -------------------------------------------------------------------------------------------------

// A little heart centred on (x, y), s about half its width.
export function heart(ctx, x, y, s, color = HEART) {
  fillCircle(ctx, x - s * 0.5, y - s * 0.3, s * 0.55, color);
  fillCircle(ctx, x + s * 0.5, y - s * 0.3, s * 0.55, color);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - s * 1.03, y - s * 0.12);
  ctx.lineTo(x + s * 1.03, y - s * 0.12);
  ctx.lineTo(x, y + s * 0.95);
  ctx.closePath();
  ctx.fill();
}

// Mum's parcel: a pink box covered in red hearts, an address label on its front with the face of whoever it is for
// (`who`: a cast id, 'player', or null for no label showing). (x, y) is the middle of its bottom edge, w its width.
export function drawParcel(ctx, x, y, w, who = null, shadow = true) {
  const h = w * 0.62; // the front face
  const d = w * 0.3; // the lid, seen from above
  if (shadow) fillEllipse(ctx, x + w * 0.04, y, w * 0.58, w * 0.11, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = PINK_DARK;
  rrect(ctx, x - w / 2, y - h - d, w, h + d, w * 0.07);
  ctx.fill();
  ctx.fillStyle = PINK;
  rrect(ctx, x - w / 2 + w * 0.03, y - h, w - w * 0.06, h - w * 0.05, w * 0.05);
  ctx.fill();
  ctx.fillStyle = PINK_TOP;
  rrect(ctx, x - w / 2 + w * 0.03, y - h - d + w * 0.03, w - w * 0.06, d - w * 0.03, w * 0.05);
  ctx.fill();
  // hearts on the lid and the front
  heart(ctx, x - w * 0.24, y - h - d * 0.45, w * 0.06);
  heart(ctx, x + w * 0.2, y - h - d * 0.55, w * 0.05);
  heart(ctx, x - w * 0.33, y - h * 0.7, w * 0.075);
  heart(ctx, x - w * 0.12, y - h * 0.3, w * 0.06);
  heart(ctx, x - w * 0.36, y - h * 0.22, w * 0.05);
  if (!who) {
    heart(ctx, x + w * 0.2, y - h * 0.45, w * 0.08);
    return;
  }
  addressLabel(ctx, x + w * 0.02, y - h * 0.84, w * 0.44, h * 0.66, who);
}

// An address label stuck on a box: white, `who`'s face on it. (lx, ly) its top left corner.
function addressLabel(ctx, lx, ly, lw, lh, who) {
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(lx + 0.6, ly + 0.8, lw, lh);
  ctx.fillStyle = LABEL;
  ctx.fillRect(lx, ly, lw, lh);
  emoji(ctx, '@' + who, lx + lw / 2, ly + lh / 2, Math.min(lw, lh) * 0.95);
}

// Whose face is on Bob's brown box: his, until you swap the labels (then yours, and his is on the pink one).
export const brownFace = (w) => (w.parcelFor === 'bob' ? 'player' : 'bob');

const CARD = '#c89a63';
const CARD_DARK = '#9f7446';
const CARD_TOP = '#dcb47e';
const TAPE = '#ead6aa';

// Bob's parcel: a plain brown cardboard box, taped shut, an address label with `who`'s face. Flatter and duller
// than Mum's. (x, y) is the middle of its bottom edge, w its width.
export function drawBrownBox(ctx, x, y, w, who = null, shadow = true) {
  const h = w * 0.5;
  const d = w * 0.28;
  if (shadow) fillEllipse(ctx, x + w * 0.04, y, w * 0.58, w * 0.11, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = CARD_DARK;
  rrect(ctx, x - w / 2, y - h - d, w, h + d, w * 0.05);
  ctx.fill();
  ctx.fillStyle = CARD;
  rrect(ctx, x - w / 2 + w * 0.03, y - h, w - w * 0.06, h - w * 0.05, w * 0.04);
  ctx.fill();
  ctx.fillStyle = CARD_TOP;
  rrect(ctx, x - w / 2 + w * 0.03, y - h - d + w * 0.03, w - w * 0.06, d - w * 0.03, w * 0.04);
  ctx.fill();
  ctx.fillStyle = TAPE; // the tape over the lid and down the front
  ctx.fillRect(x - w * 0.3, y - h - d + w * 0.03, w * 0.1, d - w * 0.03);
  ctx.fillRect(x - w * 0.3, y - h, w * 0.1, h * 0.35);
  if (who) addressLabel(ctx, x + w * 0.02, y - h * 0.86, w * 0.4, h * 0.72, who);
}

// --- the pigeonholes (tiles Q over S) -----------------------------------------------------------------------------

// A tall oak cabinet against the wall: two rows of empty cubbies, each with a name tag, and the big parcel shelf at
// the bottom, where today's post waits: Bob's plain brown box, Mum's pink one stacked on it. The cubbies stay empty:
// envelopes would look like things to take (DESIGN.md: a thing kept only as set dressing is drawn spent).
// shown: { pink, brown: whose face is on each box's label, or null when it is gone; near: you are at the shelf, so
// the boxes show up close beside it, labels readable }.
export function pigeonholes(ctx, info, at, shown) {
  const x = at.x * T + 3;
  const w = 26;
  const top = at.y * T - 12;
  const bottom = at.y * T + 2 * T - 4;
  fillEllipse(ctx, x + w / 2 + 2, bottom, w / 2 + 3, 3, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = C.oakEdge;
  rrect(ctx, x, top, w, bottom - top, 2);
  ctx.fill();
  ctx.fillStyle = C.oak;
  rrect(ctx, x + 1, top + 1, w - 2, bottom - top - 4, 2);
  ctx.fill();
  ctx.fillStyle = '#dcb98c';
  ctx.fillRect(x + 1, top + 1, w - 2, 4);
  const cw = (w - 6) / 3;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const cx = x + 2 + c * (cw + 1);
      const cy = top + 7 + r * 11;
      ctx.fillStyle = CUBBY;
      ctx.fillRect(cx, cy, cw, 9);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; // the empty cubby's back wall in shadow
      ctx.fillRect(cx, cy, cw, 2);
      ctx.fillStyle = '#efe6d2'; // the name tag on the rail under it
      ctx.fillRect(cx + cw / 2 - 1.8, cy + 9, 3.6, 1.4);
    }
  }
  // the parcel shelf: Bob's box at the bottom, yours on top of it
  const sy = top + 30;
  ctx.fillStyle = CUBBY;
  ctx.fillRect(x + 2, sy, w - 4, bottom - sy - 5);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x + 2, sy, w - 4, 2);
  const base = bottom - 6;
  if (shown.brown) drawBrownBox(ctx, x + w / 2, base, 21, shown.brown, false);
  if (shown.pink) drawParcel(ctx, x + w / 2, shown.brown ? base - 15 : base, 17, shown.pink, false);
  if (shown.near && (shown.pink || shown.brown)) shelfCloseUp(ctx, x + w, sy + 14, shown);
}

// The shelf's boxes up close, in a card beside the cabinet (its pointer at (px, py)): big enough to read the faces.
function shelfCloseUp(ctx, px, py, shown) {
  const cx = px + 8;
  const cy = py - 62;
  const cw = 78;
  const ch = 40;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, cx + 1.5, cy + 2, cw, ch, 5);
  ctx.fill();
  ctx.fillStyle = '#fbf6ea';
  ctx.strokeStyle = '#4a3422';
  ctx.lineWidth = 1.2;
  rrect(ctx, cx, cy, cw, ch, 5);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath(); // the pointer down to the shelf
  ctx.moveTo(cx + 6, cy + ch - 0.6);
  ctx.lineTo(px + 1, py);
  ctx.lineTo(cx + 16, cy + ch - 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy + ch);
  ctx.lineTo(px + 1, py);
  ctx.lineTo(cx + 16, cy + ch);
  ctx.stroke();
  if (shown.brown) drawBrownBox(ctx, cx + 22, cy + ch - 6, 32, shown.brown);
  if (shown.pink) drawParcel(ctx, cx + 58, cy + ch - 6, 28, shown.pink);
}

export function pigeonholesState(w, game) {
  const p = game?.player;
  const near = !!p && Math.hypot(p.x - 14.5, p.y - 8.5) < 1.3; // at the shelf (SPOTS.pigeonholes)
  return { pink: w.parcel === 'shelf' ? w.parcelFor : null, brown: w.brown === 'shelf' ? brownFace(w) : null, near };
}

// --- Bob's monitor (tile M) -----------------------------------------------------------------------------------------

// Where the camera sees a point: u -1..1 across the picture (left to right), v 0..1 near to far (camera.js blips).
function project(view, x, y) {
  const u = angleDiff(Math.atan2(y - view.y, x - view.x), view.dir) / (view.fov / 2);
  return { u: clamp(u, -1, 1), v: Math.min(1, Math.hypot(x - view.x, y - view.y) / view.radius) };
}

const CABINET = { x: 13.6, y: 7.9 }; // the pigeonholes, as the camera aims at them

// What the screen shows: the feed ('live' | 'wall' | 'static'), and in a live picture who is on it (you with what you
// carry: the box or the broom), the pigeonholes (with the boxes on the shelf or not), any parcel on the floor in
// view, and how far the plant's fronds reach in from the left edge (frond 0..1).
export function monitorState(w, game) {
  const feed = cameraFeed(game, CAM_ID);
  const held = game.player?.held ?? null;
  const blips = feed.blips.map((b) => (b.id === 'player' && held ? { ...b, held } : b));
  const out = { feed: feed.feed, blips, cabinet: null, parcels: [], frond: 0 };
  if (feed.feed !== 'live') return out;
  const cam = game.level.cameras.find((c) => c.id === CAM_ID);
  // The plant's fronds drift into the picture's left edge as the sweep nears its plant end (Bob likes that bit).
  const frond = clamp(1 - Math.abs(angleDiff(feed.dir, cam.dir - cam.sweep.arc / 2)) / deg(14), 0, 1);
  return { ...out, frond, ...fixtures(w, game, cameraViewer(game, cam)) };
}

// The pigeonholes and any parcel on the floor, as `view` sees them.
function fixtures(w, game, view) {
  const out = { cabinet: null, parcels: [] };
  if (canSee(game.map, view, CABINET.x, CABINET.y)) {
    out.cabinet = { ...project(view, CABINET.x, CABINET.y), pink: w.parcel === 'shelf', brown: w.brown === 'shelf' };
  }
  for (const it of w.items) {
    if (it.type === 'parcel' && !it.spot && canSee(game.map, view, it.x, it.y)) out.parcels.push(project(view, it.x, it.y));
  }
  return out;
}

// The picture Bob caught you in, for the caught-on-camera end card: the camera turned from the middle of its sweep just
// far enough to have you on it, with what you held. (The live sweep moves on in the second between Bob seeing you and
// the card, and keeps moving under it; this frame holds still.)
export function caughtPicture(w, game) {
  const cam = game.level.cameras.find((c) => c.id === CAM_ID);
  const p = game.player;
  const toYou = Math.atan2(p.y - cam.y, p.x - cam.x);
  const lim = (cam.fov / 2) * 0.75; // you near the edge, the pigeonholes still on it
  const view = { x: cam.x, y: cam.y, dir: toYou + clamp(angleDiff(cam.dir, toYou), -lim, lim), fov: cam.fov, radius: cam.radius };
  const blips = [];
  for (const n of game.npcs) {
    if (n.active && canSee(game.map, view, n.x, n.y)) blips.push({ id: n.id, ...project(view, n.x, n.y), color: n.color });
  }
  const fix = fixtures(w, game, view);
  const you = { id: 'player', ...project(view, p.x, p.y), color: null, held: p.held ?? null }; // he saw you: you're on it
  // Stood at the shelf you would overlap it, and read as holding the box: a clear gap between you and the cabinet.
  if (fix.cabinet && Math.abs(you.u - fix.cabinet.u) < 0.45) {
    const right = fix.cabinet.u + 0.45;
    you.u = right <= 0.95 ? right : fix.cabinet.u - 0.45;
  }
  blips.push(you);
  blips.sort((a, b) => b.v - a.v);
  return { feed: 'live', blips, frond: 0, ...fix };
}

// A grey CRT on the counter, its screen turned to us: the camera's picture, one leaf, or static.
export function monitor(ctx, info, at, shown, t) {
  const bw = 32;
  const bh = 24;
  const x = at.x * T + T / 2 - bw / 2;
  const y = at.y * T - 4;
  fillEllipse(ctx, x + bw / 2, y + bh + 3, 14, 3, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = '#2b2828';
  ctx.fillRect(x + bw / 2 - 5, y + bh - 1, 10, 4);
  ctx.fillStyle = '#4a4646';
  rrect(ctx, x, y, bw, bh, 3.5);
  ctx.fill();
  ctx.fillStyle = '#5d5858';
  rrect(ctx, x + 1, y + 1, bw - 2, bh - 3, 3);
  ctx.fill();
  drawPicture(ctx, x + 3, y + 3, bw - 6, bh - 8, shown, t);
  fillCircle(ctx, x + bw - 4, y + bh - 3, 0.9, shown.feed === 'static' ? '#d9a33a' : '#7fd17a'); // power light
}

// The picture on a w x h screen at (x, y). Also used by the end scenes at a larger size (k scales the blips).
export function drawPicture(ctx, x, y, w, h, shown, t, k = 1) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (shown.feed === 'static') {
    const f = Math.floor(t * 14);
    const s = Math.max(1, Math.round(k * 1.5));
    for (let j = 0; j < h; j += s) {
      for (let i = 0; i < w; i += s) {
        const g = Math.round(60 + 170 * hash(i, j, f));
        ctx.fillStyle = `rgb(${g},${g},${g})`;
        ctx.fillRect(x + i, y + j, s, s);
      }
    }
  } else if (shown.feed === 'wall') {
    drawLeafPicture(ctx, x, y, w, h, t);
  } else {
    drawRoomPicture(ctx, x, y, w, h, shown, t, k);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.16)'; // scanlines
  for (let j = 1; j < h; j += 2 * k) ctx.fillRect(x, y + j, w, Math.max(0.5, 0.5 * k));
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; // glare
  ctx.fillRect(x, y, w * 0.35, h * 0.25);
  ctx.restore();
}

// The back office from the corner: far wall, lino, the pigeonholes, people and parcels at their place in the view.
function drawRoomPicture(ctx, x, y, w, h, shown, t, k) {
  const hz = y + h * 0.32; // the foot of the far wall
  ctx.fillStyle = '#9db3ae';
  ctx.fillRect(x, y, w, hz - y);
  ctx.fillStyle = '#6e8984';
  ctx.fillRect(x, hz, w, y + h - hz);
  ctx.strokeStyle = 'rgba(40,60,58,0.35)';
  ctx.lineWidth = 0.6 * k;
  ctx.beginPath();
  for (const f of [-0.6, 0, 0.6]) {
    ctx.moveTo(x + w / 2 + f * w * 0.3, hz);
    ctx.lineTo(x + w / 2 + f * w * 0.9, y + h);
  }
  ctx.stroke();
  const at = (u, v) => {
    const vv = clamp(v * 1.3, 0, 1);
    return { px: x + w / 2 + u * (w / 2 - 1.5 * k) * (1 - 0.35 * vv), py: hz + (1 - vv) * (y + h - hz), s: k * (1.3 - 0.6 * vv) };
  };
  const things = [];
  if (shown.cabinet) things.push({ v: shown.cabinet.v, draw: () => {
    const p = at(shown.cabinet.u, shown.cabinet.v);
    ctx.fillStyle = '#7a5a3a';
    ctx.fillRect(p.px - 2.6 * p.s, p.py - 7.5 * p.s, 5.2 * p.s, 7.5 * p.s);
    ctx.fillStyle = CUBBY;
    ctx.fillRect(p.px - 1.9 * p.s, p.py - 6.8 * p.s, 3.8 * p.s, 3.4 * p.s);
    if (shown.cabinet.brown) {
      ctx.fillStyle = CARD;
      ctx.fillRect(p.px - 1.9 * p.s, p.py - 2 * p.s, 3.8 * p.s, 1.4 * p.s);
    }
    if (shown.cabinet.pink) {
      const py = shown.cabinet.brown ? p.py - 2 * p.s : p.py - 0.6 * p.s;
      ctx.fillStyle = PINK;
      ctx.fillRect(p.px - 1.6 * p.s, py - 1.6 * p.s, 3.2 * p.s, 1.6 * p.s);
      fillCircle(ctx, p.px, py - 0.8 * p.s, 0.5 * p.s, HEART);
    }
  } });
  for (const pc of shown.parcels) things.push({ v: pc.v, draw: () => {
    const p = at(pc.u, pc.v);
    ctx.fillStyle = PINK;
    ctx.fillRect(p.px - 2 * p.s, p.py - 2 * p.s, 4 * p.s, 2.4 * p.s);
    fillCircle(ctx, p.px, p.py - 0.9 * p.s, 0.6 * p.s, HEART);
  } });
  for (const b of shown.blips) things.push({ v: b.v, draw: () => {
    const p = at(b.u, b.v);
    ctx.fillStyle = b.color ?? C.tomato;
    ctx.fillRect(p.px - 1.6 * p.s, p.py - 4.6 * p.s, 3.2 * p.s, 4.6 * p.s);
    fillCircle(ctx, p.px, p.py - 5.8 * p.s, 1.3 * p.s, '#e8c4a0');
    if (b.held) blipHolds(ctx, b.held, p.px, p.py, p.s);
    else { // empty hands, down at the sides
      ctx.fillStyle = '#e8c4a0';
      ctx.fillRect(p.px - 2.3 * p.s, p.py - 4.2 * p.s, 0.7 * p.s, 2.6 * p.s);
      ctx.fillRect(p.px + 1.6 * p.s, p.py - 4.2 * p.s, 0.7 * p.s, 2.6 * p.s);
    }
  } });
  things.sort((a, b) => b.v - a.v);
  for (const th of things) th.draw();
  if (shown.frond > 0) drawFronds(ctx, x, y, h, shown.frond, t, k);
  if (Math.floor(t * 1.5) % 2 === 0) fillCircle(ctx, x + 2.2 * k, y + 2.2 * k, 1.1 * k, '#ff3b30'); // REC
}

// The potted plant's fronds poking into the picture from its left edge, `f` 0..1 of the way in.
function drawFronds(ctx, x, y, h, f, t, k) {
  const sway = Math.sin(t * 1.3) * 0.06;
  for (const [fy, len, rot, c] of [[0.25, 0.9, 0.25, C.plantB], [0.55, 1.1, -0.1, C.plantA], [0.8, 0.8, -0.35, C.plantB]]) {
    leaf(ctx, x - 3 * k + f * len * h * 0.45, y + fy * h, len * h * 0.45, rot + sway, c);
  }
}

// What a person on the screen carries, in front of them (feet at px, py, scale s): the pink box hugged to the chest,
// or the broom raised at the lens.
function blipHolds(ctx, held, px, py, s) {
  if (held === 'parcel') {
    ctx.fillStyle = PINK;
    ctx.fillRect(px - 2.1 * s, py - 3.9 * s, 4.2 * s, 2.6 * s);
    fillCircle(ctx, px, py - 2.6 * s, 0.6 * s, HEART);
  } else if (held === 'broom') {
    drawBroom(ctx, px + 1.6 * s, py - 1.2 * s, px + 3.6 * s, py - 11 * s, s * 0.45);
  }
}

// The camera shoved round into the potted plant: the whole picture is one leaf.
function drawLeafPicture(ctx, x, y, w, h, t) {
  ctx.fillStyle = '#2c4f2a';
  ctx.fillRect(x, y, w, h);
  const L = w * 0.62;
  const H = h * 0.62;
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2 + Math.sin(t * 0.8) * h * 0.02);
  ctx.rotate(-0.35);
  ctx.fillStyle = C.plantB;
  ctx.beginPath();
  ctx.moveTo(-L, H * 0.1);
  ctx.quadraticCurveTo(-L * 0.1, -H * 1.5, L, 0);
  ctx.quadraticCurveTo(-L * 0.1, H * 1.5, -L, H * 0.1);
  ctx.fill();
  ctx.strokeStyle = '#b5d89a';
  ctx.lineWidth = Math.max(0.6, h * 0.05);
  ctx.beginPath();
  ctx.moveTo(-L, H * 0.1);
  ctx.lineTo(L * 0.9, 0);
  for (let i = 1; i < 5; i++) {
    const vx = -L + (i / 5) * L * 1.8;
    ctx.moveTo(vx, 0.05 * H);
    ctx.lineTo(vx + L * 0.22, -H * 0.42 * (1 - i / 7));
    ctx.moveTo(vx, 0.05 * H);
    ctx.lineTo(vx + L * 0.22, H * 0.42 * (1 - i / 7));
  }
  ctx.stroke();
  ctx.restore();
}

// --- the wall camera (tile C) ----------------------------------------------------------------------------------------

// On a bracket over the back office's north-east corner, turned to where it looks; its red light blinks while the
// picture is live. Shoved into the plant, it sits askew with leaves over its lens.
// Its lens is an eye in Bob's blue while he can see through it (grey on a dead screen), so where it looks reads at a
// glance. While Bob thumps it, it rattles on its bracket under an impact star.
// shown: { x, y (the lens, tile units), dir, live, stuck, whack }.
export function wallCamera(ctx, info, at, shown, t) {
  const rattle = shown.whack ? Math.sin(t * 38) * 0.14 : 0;
  drawWallCamera(ctx, shown.x * T, shown.y * T, shown.dir + rattle, shown.live, shown.stuck, t);
  if (shown.whack && !shown.stuck && (t * 2.2) % 1 < 0.45) star(ctx, shown.x * T - 9, shown.y * T - 4, 6);
}

export function wallCameraState(w, game) {
  const f = cameraFeed(game, CAM_ID);
  const whack = !!game?.npcs?.some((n) => n.id === 'bob' && (n.override === 'whacking' || n.override === 'tugging'));
  return { x: f.x, y: f.y, dir: f.dir, live: f.live, stuck: w.camAim === 'plant', whack };
}

// A comic impact star, r its outer radius, centred on (x, y).
function star(ctx, x, y, r) {
  ctx.fillStyle = '#ffe36b';
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function drawWallCamera(ctx, x, y, dir, live, stuck, t, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#4f5459'; // the bracket plate on the wall face, and its arm
  rrect(ctx, -5, -15, 10, 8, 1.5);
  ctx.fill();
  ctx.fillStyle = '#7c8187';
  ctx.fillRect(-1.3, -8, 2.6, 6);
  ctx.save();
  ctx.translate(0, -2);
  ctx.rotate(dir + (stuck ? 0.12 : 0));
  fillEllipse(ctx, 3, 5, 9, 2.5, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = '#7c8187';
  rrect(ctx, -5, -4, 16, 8, 2);
  ctx.fill();
  ctx.fillStyle = '#d9dcdf';
  rrect(ctx, -5, -3.6, 15, 6.4, 2);
  ctx.fill();
  ctx.fillStyle = '#b4b8bc'; // the sun hood
  ctx.fillRect(4, -4.4, 8, 1.6);
  fillCircle(ctx, 11, 0, 3.4, '#2a2e35'); // the lens: an eye, Bob's blue while it feeds his screen
  fillCircle(ctx, 11.6, 0, 2.1, live ? '#82aaf5' : '#7d8088');
  fillCircle(ctx, 12.1, 0, 1, '#10141c');
  fillCircle(ctx, 11.3, -1, 0.6, 'rgba(255,255,255,0.85)');
  ctx.restore();
  if (live && Math.floor(t * 2) % 2 === 0) fillCircle(ctx, -3, -11, 1.4, '#ff3b30');
  else fillCircle(ctx, -3, -11, 1.4, '#5a2a26');
  if (stuck) { // leaves pressed against the lens
    const lx = Math.cos(dir) * 11;
    const ly = -2 + Math.sin(dir) * 11;
    for (const [dx, dy, r, c] of [[2, -2, -0.6, C.plantB], [3, 2.5, 0.5, C.plantA], [0, 0.5, 0.1, C.plantB]]) leaf(ctx, lx + dx, ly + dy, 5, r, c);
  }
  ctx.restore();
}

function leaf(ctx, x, y, len, rot, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-len * 0.4, 0);
  ctx.quadraticCurveTo(0, -len * 0.55, len, 0);
  ctx.quadraticCurveTo(0, len * 0.55, -len * 0.4, 0);
  ctx.fill();
  ctx.restore();
}

// --- the power strip (tile O) ------------------------------------------------------------------------------------------

// The camera's cable: from the camera's bracket on the north wall it runs along the top of the wall, behind the plant,
// and down the east wall to a power strip on the floor by the counter's far end. Pulled, the camera's light goes out,
// Bob's screen gets no picture (static), and the plug lies on the floor beside the strip, a spark at its pins now and
// then. shown: { plugged }.
export function socket(ctx, info, at, shown, t) {
  const sx = at.x * T + 6;
  const sy = at.y * T + 14;
  const plugX = shown.plugged ? sx + 3 : sx - 4;
  const plugY = shown.plugged ? sy + 3 : sy + 13;
  const wallX = (at.x + 1) * T - 3; // down the east wall, just inside it
  const topY = 5 * T + 1; // along the foot of the north wall
  const camX = 19.5 * T + 4; // the camera's bracket (CAMERAS in index.js; drawWallCamera)
  ctx.strokeStyle = '#2a2622';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(camX, 5 * T - 8);
  ctx.lineTo(camX, topY);
  ctx.lineTo(wallX, topY);
  ctx.lineTo(wallX, sy - 6);
  ctx.quadraticCurveTo(wallX, plugY + 1, plugX + 3, plugY + 1);
  ctx.stroke();
  ctx.lineJoin = 'miter';
  ctx.lineCap = 'butt';
  // the strip
  fillEllipse(ctx, sx + 10, sy + 7, 12, 2.5, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = '#cfcfca';
  rrect(ctx, sx, sy, 20, 7, 2);
  ctx.fill();
  ctx.fillStyle = '#e9e8e2';
  rrect(ctx, sx, sy, 20, 5.5, 2);
  ctx.fill();
  for (let i = 0; i < 3; i++) {
    fillCircle(ctx, sx + 4 + i * 6, sy + 2.8, 1.6, '#9a9a94');
    ctx.fillStyle = '#3a3633';
    ctx.fillRect(sx + 3.2 + i * 6, sy + 2.2, 0.6, 1.2);
    ctx.fillRect(sx + 4.4 + i * 6, sy + 2.2, 0.6, 1.2);
  }
  fillCircle(ctx, sx + 17.5, sy + 2.8, 1.1, shown.plugged ? '#e5432f' : '#7a3a30'); // the switch light
  // the plug
  ctx.fillStyle = '#2f2b28';
  rrect(ctx, plugX - 3, plugY - 2.5, 6, 5, 1.2);
  ctx.fill();
  if (!shown.plugged) {
    ctx.fillStyle = '#c9b26a';
    ctx.fillRect(plugX + 3, plugY - 1.6, 2, 0.8);
    ctx.fillRect(plugX + 3, plugY + 0.8, 2, 0.8);
    if ((t * 1.3) % 1 < 0.18) {
      ctx.strokeStyle = '#ffe36b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plugX + 6, plugY - 3);
      ctx.lineTo(plugX + 8, plugY - 1);
      ctx.lineTo(plugX + 7, plugY);
      ctx.lineTo(plugX + 9.5, plugY + 2);
      ctx.stroke();
    }
  }
}

export const socketState = (w) => ({ plugged: w.plug === 'in' });

// --- the broom (tile B) ------------------------------------------------------------------------------------------------

// A broom leaning in the store room's corner on a wall clip; taken, only the clip is left. shown: { there }.
// It also draws the store room's neglect: cobwebs in its corners, dust bunnies on the floor. Nobody opens it before the cleaner comes at 6.
export function broomStand(ctx, info, at, shown) {
  const x = at.x * T;
  const y = at.y * T;
  cobweb(ctx, 22 * T, 5 * T, 1);
  cobweb(ctx, 29 * T, 5 * T, -1);
  for (const [bx, by, r] of [[23.4, 8.6, 2.6], [26.2, 6.3, 2], [27.6, 9.5, 2.8], [24.8, 9.7, 1.8]]) {
    fillCircle(ctx, bx * T, by * T, r, 'rgba(150,140,128,0.55)');
    fillCircle(ctx, bx * T + r * 0.8, by * T + 0.6, r * 0.7, 'rgba(150,140,128,0.45)');
  }
  ctx.fillStyle = '#5f6469';
  ctx.fillRect(x + 22, y - 10, 5, 3);
  if (shown.there) drawBroom(ctx, x + 24, y - 10, x + 13, y + 26);
}

export const broomState = (w) => ({ there: w.broom === 'stand' });

// A cobweb strung in a room's top corner at (x, y); dir 1 for a left-hand corner, -1 for a right-hand one.
function cobweb(ctx, x, y, dir) {
  ctx.strokeStyle = 'rgba(235,235,235,0.55)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  for (let i = 0; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2);
    ctx.moveTo(x, y);
    ctx.lineTo(x + dir * Math.cos(a) * 14, y + Math.sin(a) * 14);
  }
  for (const r of [5, 9, 13]) {
    for (let i = 0; i < 4; i++) {
      const a0 = (i / 4) * (Math.PI / 2);
      const a1 = ((i + 1) / 4) * (Math.PI / 2);
      ctx.moveTo(x + dir * Math.cos(a0) * r, y + Math.sin(a0) * r);
      ctx.quadraticCurveTo(x + dir * Math.cos((a0 + a1) / 2) * r * 0.8, y + Math.sin((a0 + a1) / 2) * r * 0.8,
        x + dir * Math.cos(a1) * r, y + Math.sin(a1) * r);
    }
  }
  ctx.stroke();
}

// A broom from its handle's top (x0, y0) to the foot of its bristles (x1, y1).
export function drawBroom(ctx, x0, y0, x1, y1, s = 1) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  const len = Math.hypot(x1 - x0, y1 - y0);
  ctx.save();
  ctx.translate(x0, y0);
  ctx.rotate(a);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(2 * s, 1.5 * s, len - 8 * s, 2 * s);
  ctx.fillStyle = '#b07a43';
  ctx.fillRect(0, -1.1 * s, len - 7 * s, 2.2 * s);
  ctx.fillStyle = '#d33f2f'; // the bristle head's band
  ctx.fillRect(len - 9 * s, -3 * s, 3 * s, 6 * s);
  ctx.fillStyle = '#d9b45a';
  ctx.beginPath();
  ctx.moveTo(len - 6 * s, -3 * s);
  ctx.lineTo(len, -5 * s);
  ctx.lineTo(len, 5 * s);
  ctx.lineTo(len - 6 * s, 3 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#a8862f';
  ctx.lineWidth = 0.6 * s;
  ctx.beginPath();
  for (let i = -3; i <= 3; i += 1.5) {
    ctx.moveTo(len - 5 * s, i * s * 0.6);
    ctx.lineTo(len, i * s);
  }
  ctx.stroke();
  ctx.restore();
}

// --- labels ----------------------------------------------------------------------------------------------------------

// An address label w wide with `who`'s face on it, its middle at (x, y).
export function drawLabel(ctx, x, y, w, who) {
  const h = w * 0.78;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x - w / 2 + 0.8, y - h / 2 + 1, w, h);
  ctx.fillStyle = LABEL;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.fillStyle = '#c9c4b5';
  ctx.fillRect(x - w / 2, y + h / 2 - 1, w, 1);
  emoji(ctx, '@' + who, x, y, h * 0.92);
}

// --- your desk drawer (tile P) ----------------------------------------------------------------------------------------

// Your desk's right-hand drawer, always shut. While you stuff the parcel in, it hangs open and the box squashes down
// into it; then it slams, and nothing pink shows. shown: { open: 0..1 how far through the stuffing you are, or -1 }.
export function drawer(ctx, info, at, shown) {
  const x = at.x * T + 38;
  const y = at.y * T + 22;
  if (shown.open < 0) return; // shut: the desk's own front is all there is
  const q = shown.open;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x + 1, y + 2, 20, 12);
  ctx.fillStyle = C.walnutEdge;
  ctx.fillRect(x, y, 20, 12);
  ctx.fillStyle = '#3a2416';
  ctx.fillRect(x + 1.5, y + 1, 17, 5);
  // the box going in: squashing flatter as it sinks
  const sink = q * 7;
  const squash = 1 - q * 0.45;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - 6, y - 20, 32, 26);
  ctx.clip();
  ctx.translate(x + 10, y + 5 + sink);
  ctx.scale(1 + q * 0.12, squash);
  drawParcel(ctx, 0, 0, 16, null, false);
  ctx.restore();
  ctx.fillStyle = C.walnutTop;
  ctx.fillRect(x, y + 6, 20, 6);
  ctx.fillStyle = C.steel;
  ctx.fillRect(x + 7, y + 8, 6, 1.4);
}

export function drawerState(w, game) {
  const a = game?.player?.action;
  if (a?.type !== 'stash_parcel') return { open: -1 };
  return { open: clamp((game.loopTime - a.t) / (a.duration || 1), 0, 1) };
}

// --- the things people hold (items[type].draw) ---------------------------------------------------------------------

// render/things.js painters (ctx, x, y, size, t, game, opts): centred on (x, y), about `size` px tall. The engine
// draws them in a hand, on the floor where they were dropped, and in the HUD's held slot.

// The parcel: the pink box, with the face of whoever it is addressed to on its label (yours, or Bob's once you have
// stuck his label over it). Whoever picks it up off the floor reads that face.
export function parcelThing(ctx, x, y, size, t, game) {
  box(ctx, x, y, size);
  drawParcel(ctx, 0, 7.5, 17, game?.world?.parcelFor ?? 'player', false);
}

// The broom: upright in a hand, longer than the hand is tall; lying flat on the floor.
export function broomThing(ctx, x, y, size, t, game, opts) {
  box(ctx, x, y, size);
  if (opts?.held) drawBroom(ctx, -3, -15, 3, 11, 0.55);
  else drawBroom(ctx, -13, 1, 13, 3, 0.6);
}

// Bob's brown box, his face on the label (or yours, once you have swapped them): in Lin's or Bob's hands, in bubbles.
export function brownBoxThing(ctx, x, y, size, t, game) {
  box(ctx, x, y, size);
  drawBrownBox(ctx, 0, 6, 19, game?.world ? brownFace(game.world) : 'bob', false);
}

// Today's post in Lin's arms: Bob's brown box with the pink one stacked on top.
export function postThing(ctx, x, y, size, t, game) {
  box(ctx, x, y, size);
  const w = game?.world;
  drawBrownBox(ctx, 0, 8, 18, w ? brownFace(w) : 'bob', false);
  drawParcel(ctx, 0, -1, 14, w?.parcelFor ?? 'player', false);
}

// A little TV full of snow: the dead picture on Bob's screen.
export function staticThing(ctx, x, y, size, t) {
  box(ctx, x, y, size);
  ctx.fillStyle = '#4a4646';
  rrect(ctx, -7.5, -6, 15, 11.5, 2);
  ctx.fill();
  ctx.fillStyle = '#2b2828';
  ctx.fillRect(-2.5, 5.5, 5, 1.6);
  const f = Math.floor((t ?? 0) * 12);
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 11; i++) {
      const g = Math.round(70 + 170 * hash(i, j, f));
      ctx.fillStyle = `rgb(${g},${g},${g})`;
      ctx.fillRect(-5.5 + i, -4 + j, 1, 1);
    }
  }
}

// The pink box hitting the floor: fall lines over it, a puff of dust either side.
export function droppedThing(ctx, x, y, size, t) {
  box(ctx, x, y, size);
  drawParcel(ctx, 0, 7, 13, null, false);
  ctx.strokeStyle = '#6a5a52';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const dx of [-4, 0, 4]) {
    ctx.moveTo(dx, -8);
    ctx.lineTo(dx, -4.5);
  }
  ctx.stroke();
  for (const [dx, r] of [[-7.5, 1.8], [-6, 1.2], [7.5, 1.8], [6, 1.2]]) fillCircle(ctx, dx, 6.2, r, 'rgba(170,160,150,0.8)');
}
