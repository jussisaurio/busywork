// Discreet Packaging's things, drawn (the level's id is still 'monitor'): no emoji stands in for an object. Mum's
// pink parcel, the pigeonholes it waits in, Bob's monitor and the wall camera that feeds it, the power strip with
// the monitor's plug, the broom, the label printer and your desk drawer. The world painters are presentation.js
// DECOR.props draw functions ((ctx, info, at, shown, t), map px); the end scenes (end-scenes.js) reuse the parcel.
import { T, rrect, fillCircle, fillEllipse, emoji, hash, clamp } from '../../render/util.js';
import { C } from '../../render/palette.js';
import { cameraFeed } from '../../game/perception.js';
import { cameraViewer } from '../../sim/mechanics/camera.js';
import { canSee, angleDiff } from '../../core/vision.js';

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
  // the label, its face the addressee
  const lw = w * 0.44;
  const lh = h * 0.66;
  const lx = x + w * 0.02;
  const ly = y - h * 0.84;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(lx + 0.6, ly + 0.8, lw, lh);
  ctx.fillStyle = LABEL;
  ctx.fillRect(lx, ly, lw, lh);
  emoji(ctx, '@' + who, lx + lw / 2, ly + lh / 2, Math.min(lw, lh) * 0.95);
}

// --- the pigeonholes (tile S) -------------------------------------------------------------------------------------

// A tall oak cabinet against the wall: three rows of cubbies with envelopes, and the big parcel shelf at the bottom.
// shown: { parcel: whose face is on the label of the parcel on the shelf, or null when the shelf is empty }.
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
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cx = x + 2 + c * (cw + 1);
      const cy = top + 7 + r * 11;
      ctx.fillStyle = CUBBY;
      ctx.fillRect(cx, cy, cw, 9);
      if (hash(r, c, 7) > 0.35) { // an envelope or two
        ctx.fillStyle = hash(r, c, 3) > 0.5 ? C.white : '#e9dcc0';
        ctx.fillRect(cx + 0.8, cy + 3.5, cw - 1.6, 5);
        ctx.fillStyle = 'rgba(120,96,62,0.45)';
        ctx.fillRect(cx + 1.6, cy + 5, cw - 3.2, 0.8);
      }
    }
  }
  // the parcel shelf
  const sy = top + 41;
  ctx.fillStyle = CUBBY;
  ctx.fillRect(x + 2, sy, w - 4, bottom - sy - 5);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x + 2, sy, w - 4, 2);
  if (shown.parcel) drawParcel(ctx, x + w / 2, bottom - 6, 20, shown.parcel, false);
}

export const pigeonholesState = (w) => ({ parcel: w.parcel === 'shelf' ? w.parcelFor : null });

// --- Bob's monitor (tile M) -----------------------------------------------------------------------------------------

// Where the camera sees a point: u -1..1 across the picture (left to right), v 0..1 near to far (camera.js blips).
function project(view, x, y) {
  const u = angleDiff(Math.atan2(y - view.y, x - view.x), view.dir) / (view.fov / 2);
  return { u: clamp(u, -1, 1), v: Math.min(1, Math.hypot(x - view.x, y - view.y) / view.radius) };
}

const CABINET = { x: 13.6, y: 7.9 }; // the pigeonholes, as the camera aims at them

// What the screen shows: the feed ('live' | 'wall' | 'static'), and in a live picture who is on it, the pigeonholes
// (with the pink box on the shelf or not) and any parcel on the floor in view.
export function monitorState(w, game) {
  const feed = cameraFeed(game, CAM_ID);
  const out = { feed: feed.feed, blips: feed.blips, cabinet: null, parcels: [] };
  if (feed.feed !== 'live') return out;
  const cam = game.level.cameras.find((c) => c.id === CAM_ID);
  const view = cameraViewer(game, cam);
  if (canSee(game.map, view, CABINET.x, CABINET.y)) out.cabinet = { ...project(view, CABINET.x, CABINET.y), full: w.parcel === 'shelf' };
  for (const it of w.items) {
    if (it.type === 'parcel' && !it.spot && canSee(game.map, view, it.x, it.y)) out.parcels.push(project(view, it.x, it.y));
  }
  return out;
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
    if (shown.cabinet.full) {
      ctx.fillStyle = PINK;
      ctx.fillRect(p.px - 1.9 * p.s, p.py - 2.8 * p.s, 3.8 * p.s, 2.2 * p.s);
      fillCircle(ctx, p.px, p.py - 1.7 * p.s, 0.55 * p.s, HEART);
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
  } });
  things.sort((a, b) => b.v - a.v);
  for (const th of things) th.draw();
  if (Math.floor(t * 1.5) % 2 === 0) fillCircle(ctx, x + 2.2 * k, y + 2.2 * k, 1.1 * k, '#ff3b30'); // REC
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
// shown: { x, y (the lens, tile units), dir, live, stuck }.
export function wallCamera(ctx, info, at, shown, t) {
  drawWallCamera(ctx, shown.x * T, shown.y * T, shown.dir, shown.live, shown.stuck, t);
}

export function wallCameraState(w, game) {
  const f = cameraFeed(game, CAM_ID);
  return { x: f.x, y: f.y, dir: f.dir, live: f.live, stuck: w.camAim === 'plant' };
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
  fillCircle(ctx, 11, 0, 2.9, '#2a2e35');
  fillCircle(ctx, 11.3, -0.6, 1.2, '#6d8fb0');
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

// The monitor's cable runs off the back of the counter to a power strip in the corner. shown: { plugged }.
// Pulled: the plug lies on the floor beside the strip, a spark at its pins now and then.
export function socket(ctx, info, at, shown, t) {
  const sx = at.x * T + 6;
  const sy = at.y * T + 14;
  const mx = 16 * T + T - 1; // the monitor's back (tile M (16,10), monitor() above)
  const plugX = shown.plugged ? sx + 3 : sx - 4;
  const plugY = shown.plugged ? sy + 3 : sy + 13;
  ctx.strokeStyle = '#2a2622';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(mx - 2, 10 * T + 8);
  ctx.lineTo(mx + 4, 10 * T + 2);
  ctx.lineTo(at.x * T - 10, 10 * T + 2);
  ctx.quadraticCurveTo(at.x * T - 2, 10 * T + 2, plugX - 3, plugY + 1);
  ctx.stroke();
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

// A broom leaning in the mailroom's corner on a wall clip; taken, only the clip is left. shown: { there }.
export function broomStand(ctx, info, at, shown) {
  const x = at.x * T;
  const y = at.y * T;
  ctx.fillStyle = '#5f6469';
  ctx.fillRect(x + 22, y - 10, 5, 3);
  if (shown.there) drawBroom(ctx, x + 24, y - 10, x + 13, y + 26);
}

export const broomState = (w) => ({ there: w.broom === 'stand' });

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

// --- the label printer (tile A) -----------------------------------------------------------------------------------------

// A grey label printer on the mailroom table. Someone printed a spare address label for Bob and left it in the
// tray: it sticks out, his face on it, until you take it. shown: { label }.
export function labelPrinter(ctx, info, at, shown) {
  const x = at.x * T + 7;
  const y = at.y * T + 6;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  rrect(ctx, x + 1, y + 2, 19, 13, 3);
  ctx.fill();
  ctx.fillStyle = '#6f757b';
  rrect(ctx, x, y, 19, 13, 3);
  ctx.fill();
  ctx.fillStyle = '#9aa1a7';
  rrect(ctx, x, y, 19, 9, 3);
  ctx.fill();
  ctx.fillStyle = '#3a3f44'; // the window on top, the slot at the front
  ctx.fillRect(x + 4, y + 2.5, 8, 3);
  ctx.fillStyle = '#26292c';
  ctx.fillRect(x + 3, y + 10, 13, 1.5);
  fillCircle(ctx, x + 15.5, y + 4, 1.1, '#7fd17a');
  if (shown.label) drawLabel(ctx, x + 9.5, y + 16, 12, 'bob');
}

export const labelPrinterState = (w) => ({ label: w.label === 'printer' });

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

// With the parcel stuffed inside, your desk's right-hand drawer won't shut: it sticks out, a pink corner with a
// heart showing. shown: { full }.
export function drawer(ctx, info, at, shown) {
  if (!shown.full) return;
  const x = at.x * T + 38;
  const y = at.y * T + 22;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x + 1, y + 2, 20, 10);
  ctx.fillStyle = C.walnutEdge;
  ctx.fillRect(x, y, 20, 10);
  ctx.fillStyle = '#3a2416';
  ctx.fillRect(x + 1.5, y + 1, 17, 4);
  ctx.fillStyle = PINK;
  ctx.beginPath();
  ctx.moveTo(x + 2, y + 5);
  ctx.lineTo(x + 4, y - 2);
  ctx.lineTo(x + 17, y - 1);
  ctx.lineTo(x + 18, y + 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PINK_TOP;
  ctx.fillRect(x + 4, y - 2, 13, 2);
  heart(ctx, x + 10, y + 1.5, 1.8);
  ctx.fillStyle = C.walnutTop;
  ctx.fillRect(x, y + 5, 20, 5);
  ctx.fillStyle = C.steel;
  ctx.fillRect(x + 7, y + 7, 6, 1.4);
}

export const drawerState = (w) => ({ full: w.parcel === 'drawer' });

// --- things on the floor ------------------------------------------------------------------------------------------------

// Under the engine's own floor-item glyph: the real thing, so a dropped parcel is a pink box lying where it fell.
// shown: the loose items, [{ type, x, y }] (tile units).
export function floorThings(ctx, info, at, shown) {
  for (const it of shown) {
    const x = it.x * T;
    const y = it.y * T;
    if (it.type === 'parcel') drawParcel(ctx, x, y + 9, 26, null);
    else if (it.type === 'broom') drawBroom(ctx, x - 14, y + 4, x + 14, y + 7);
    else if (it.type === 'label') drawLabel(ctx, x + 2, y + 6, 11, 'bob');
  }
}

export const floorThingsState = (w) => w.items.filter((it) => !it.spot);

