// People: top-down with a hint of 3/4. Body ellipse + head circle + facing cues
// (hair cap, eyes, nose nub). The head turns independently of the body: that is the
// glance telegraph, so it gets extra "sight dashes" when the turn is large.
import {
  T, clamp, fin, hash, emoji, setFacePainter, strictGlyphs, fillCircle, fillEllipse, circle, ellipse, rrect, drawDrop, drawPaper,
} from './util.js';
import { C } from './palette.js';
import { NOTICE, MARKS, HOLD_TIME, WORK_PENALTY_MIN } from '../config.js';

const genericLooks = new Map();
function shade(hex, f) {
  if (typeof hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(hex)) return '#555555';
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => clamp(Math.round(v * f), 0, 255).toString(16).padStart(2, '0');
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
}
// How to draw person `id`: the level's look for them (level.looks, e.g. src/levels/meeting/looks.js; fields
// listed there), else a generic look in their colour.
export function lookFor(looks, id, color) {
  if (looks && looks[id]) return looks[id];
  const key = color || '#888888';
  let l = genericLooks.get(key);
  if (!l) {
    l = {
      body: shade(key, 1), bodyDark: shade(key, 0.72), skin: '#e2b58d', skinDark: '#c4936b', hair: '#3a2a1c',
      hairStyle: 'cap', legs: '#3a3640', wide: 1, tall: 1, head: 6.6, bubbleDy: 30, eyeDy: 12,
    };
    genericLooks.set(key, l);
  }
  return l;
}

// Screen y (px) of a person's eyes (key 'eyeDy') or bubble anchor ('bubbleDy'); sitting lowers both 3 px.
// d is the tile y used when n.y is not a finite number. looks: the level's (game.level.looks).
export function headY(looks, n, key, d = 0) {
  return fin(n.y, d) * T - lookFor(looks, n.id, n.color)[key] + (n.seated || n.pose === 'sit' ? 3 : 0);
}

// Reusable per-draw description.
export function personState() {
  return {
    dir: 0, head: 0, pose: 'stand', moving: false, phase: 0, arms: 'idle', item: null,
    scale: 1, jacket: true, smug: false, sweat: false, glance: 0, t: 0, typing: false, angry: false,
    badge: false, crank: false, stain: null, lift: 0, seed: 0,
  };
}

// The arm poses computeHands draws (personState().arms). A level 'self' row's `preview` names one (the validator
// checks it): the pose the player strikes while that row is what E would do, and while doing it.
export const ARM_POSES = ['idle', 'walk', 'desk', 'type', 'folder', 'carry', 'reach', 'phone', 'bang', 'shrug', 'puff',
  'mug', 'box', 'point', 'cheer', 'lift', 'sip', 'holdout', 'facepalm'];

// What a hand holds is drawn with this `how` (render/util.js emoji): a thing may look different in a hand.
const HELD = { held: true };

// Hand positions are written here to avoid allocating per frame (fx, fy: the floor under the held-out hand).
const HAND = { lx: 0, ly: 0, rx: 0, ry: 0, lsx: 0, lsy: 0, rsx: 0, rsy: 0, fx: 0, fy: 0 };

function computeHands(s, g) {
  const { fx, fy, rx, ry, bodyY, brx, headY, hr } = g;
  const t = s.t;
  const shY = bodyY - 2;
  const sl = brx * 0.85;
  // shoulders: left = -R, right = +R
  const lsx = -rx * sl;
  const lsy = shY - ry * sl;
  const rsx = rx * sl;
  const rsy = shY + ry * sl;
  let lx, ly, rxh, ryh;
  switch (s.arms) {
    case 'walk': {
      const sw = Math.sin(s.phase) * 3;
      lx = lsx + fx * sw; ly = lsy + 5 + fy * sw;
      rxh = rsx - fx * sw; ryh = rsy + 5 - fy * sw;
      break;
    }
    case 'desk':
    case 'type': {
      const fl = s.arms === 'type' ? 1.5 : 0.25;
      const sp = s.arms === 'type' ? 28 : 3;
      lx = fx * 9 - rx * 3.4; ly = bodyY + 2 + fy * 9 - ry * 3.4 + Math.sin(t * sp) * fl;
      rxh = fx * 9 + rx * 3.4; ryh = bodyY + 2 + fy * 9 + ry * 3.4 + Math.sin(t * sp + 1.9) * fl;
      break;
    }
    case 'folder':
      lx = fx * 7 - rx * 6; ly = bodyY + 1 + fy * 7 - ry * 6;
      rxh = fx * 7 + rx * 6; ryh = bodyY + 1 + fy * 7 + ry * 6;
      break;
    case 'carry':
      lx = lsx + fx * 1.5; ly = lsy + 5 + fy * 1.5;
      rxh = fx * 8 + rx * 3; ryh = bodyY + fy * 8 + ry * 3;
      break;
    case 'reach': {
      const o = Math.sin(t * 9) * 1.5;
      lx = fx * (12 + o) - rx * 3; ly = bodyY - 1 + fy * (12 + o) - ry * 3;
      rxh = fx * (12 - o) + rx * 3; ryh = bodyY - 1 + fy * (12 - o) + ry * 3;
      break;
    }
    case 'phone':
      lx = lsx + fx * 1.5; ly = lsy + 5 + fy * 1.5;
      rxh = rx * (hr + 0.8); ryh = headY + 1 + ry * (hr + 0.8);
      break;
    case 'bang': {
      const a = Math.sin(t * 14) > 0 ? -2 : 1;
      const b = Math.sin(t * 14 + Math.PI / 2) > 0 ? -2 : 1;
      lx = fx * 11 - rx * 4; ly = bodyY - 6 + a + fy * 11 - ry * 4;
      rxh = fx * 11 + rx * 4; ryh = bodyY - 6 + b + fy * 11 + ry * 4;
      break;
    }
    case 'shrug':
      lx = lsx - rx * 5; ly = lsy - 4 - ry * 5;
      rxh = rsx + rx * 5; ryh = rsy - 4 + ry * 5;
      break;
    case 'puff': {
      const k = smokeLift(t);
      lx = lsx + fx * 1.5; ly = lsy + 5 + fy * 1.5;
      const dx = rsx + rx * 3 + fx * 2;
      const dy = rsy + 5 + ry * 3 + fy * 2;
      const mx = fx * (hr + 1) + rx * 2;
      const my = headY + 2 + fy * (hr + 1) + ry * 2;
      rxh = dx + (mx - dx) * k; ryh = dy + (my - dy) * k;
      break;
    }
    case 'mug': {
      // Free arm swings; the mug hand stays steady: out at the side facing N/S, in front at the
      // waist in profile (so the head never hides the cup).
      const sw = s.moving ? Math.sin(s.phase) * 3 : 0;
      lx = lsx + fx * sw; ly = lsy + 5 + fy * sw;
      const side = 1 - Math.abs(fx);
      rxh = (rsx + rx * 2.5) * side + fx * (4 + 4 * (1 - side));
      ryh = (rsy + 4 + ry * 2.5) * side + (bodyY + 2) * (1 - side) + fy * 4;
      break;
    }
    case 'box':
      // both hands gripping the sides of a cardboard box held at the belly
      lx = fx * 9 - rx * 8; ly = bodyY + 3 + fy * 8 - ry * 8;
      rxh = fx * 9 + rx * 8; ryh = bodyY + 3 + fy * 8 + ry * 8;
      break;
    case 'point':
      // free fist on the hip, pointing arm straight out at shoulder height
      lx = lsx - rx * 1.5 + fx * 1; ly = lsy + 7;
      rxh = rsx * 0.4 + fx * 13; ryh = rsy - 1 + fy * 13;
      break;
    case 'cheer':
      lx = lsx - rx * 2; ly = lsy - 14 + Math.sin(t * 12) * 2;
      rxh = rsx + rx * 2; ryh = rsy - 14 + Math.sin(t * 12 + 2) * 2;
      break;
    case 'sip': // a drink: lifted like a bite, then tipped at the lips (drawHeldItem tilts it)
    case 'lift': {
      // what you hold, lifted from the carry hold toward the mouth (s.lift 0..1; 1 = at the mouth: eating). Facing
      // away it goes up beside the head (drawn behind it, half showing), the way an elbow-up bite looks from behind.
      const k = s.lift;
      lx = lsx + fx * 1.5; ly = lsy + 5 + fy * 1.5;
      const cx = fx * 8 + rx * 3;
      const cy = bodyY + fy * 8 + ry * 3;
      const out = g.sd < -0.25 ? hr + 2 : hr * 0.5 + 1.5;
      const mx = fx * (hr + 1) + rx * out;
      const my = headY + hr * 0.5 + fy * (hr + 1) + ry * out;
      rxh = cx + (mx - cx) * k; ryh = cy + (my - cy) * k;
      break;
    }
    case 'holdout': {
      // what you hold, held out at arm's length over the floor, ready to let go: out at the side facing N/S, out in
      // front in profile (clear of the body either way), at chest height so the floor shows under it. HAND.fx/fy:
      // the floor under it (its shadow).
      const side = 1 - Math.abs(fx);
      const ox = rx * (brx + 6) * side + fx * 13 * (1 - side);
      const oy = ry * (brx + 6) * side + fy * 13 * (1 - side);
      lx = lsx + fx * 1.5; ly = lsy + 5 + fy * 1.5;
      rxh = ox; ryh = bodyY - 1 + oy;
      HAND.fx = ox; HAND.fy = 8 + oy;
      break;
    }
    case 'facepalm':
      // the free hand hangs; the other is flat over the face, the head bowed into it (a slow small rub)
      lx = lsx + fx * 1.5; ly = lsy + 5 + fy * 1.5;
      rxh = fx * hr * 0.75 + rx * 1.2 + Math.sin(t * 3) * 0.6; ryh = headY + 0.5 + fy * hr * 0.45 + ry * 1.2;
      break;
    default:
      lx = lsx + fx * 1.5; ly = lsy + 5 + fy * 1.5;
      rxh = rsx + fx * 1.5; ryh = rsy + 5 + fy * 1.5;
  }
  HAND.lx = lx; HAND.ly = ly; HAND.rx = rxh; HAND.ry = ryh;
  HAND.lsx = lsx; HAND.lsy = lsy; HAND.rsx = rsx; HAND.rsy = rsy;
}

// Smoke break rhythm: a drag every SMOKE_CYCLE seconds (hand up, hold, down), then an exhale.
const SMOKE_CYCLE = 4;
const smooth = (x) => x * x * (3 - 2 * x);
function smokeLift(t) {
  const p = (t / SMOKE_CYCLE) % 1;
  if (p < 0.1 || p > 0.5) return 0;
  if (p < 0.2) return smooth((p - 0.1) / 0.1);
  if (p < 0.4) return 1;
  return 1 - smooth((p - 0.4) / 0.1);
}

// A thin curl off the cigarette, plus the exhale puff after each drag. Drawn last, over the head,
// so it reads even when the smoker has his back to the camera.
function drawSmoke(ctx, s, g) {
  const t = s.t;
  const tipX = HAND.rx + g.fx * 5;
  const tipY = HAND.ry - 3 + g.fy * 5;
  for (let i = 0; i < 4; i++) {
    const ph = (t * 0.7 + i / 4) % 1;
    ctx.globalAlpha = 0.45 * (1 - ph);
    fillCircle(ctx, tipX + Math.sin(t * 2 + i * 1.7 + ph * 5) * (1 + ph * 3), tipY - ph * 16, 1.2 + ph * 2.2, '#d9d4cc');
  }
  const p = (t / SMOKE_CYCLE) % 1;
  if (p > 0.45 && p < 0.9) {
    const q = (p - 0.45) / 0.45;
    const x = g.fx * (g.hr + 3) + Math.sin(q * 4) * 2;
    const y = g.headY + 1 + g.fy * (g.hr + 3) - q * 12;
    ctx.globalAlpha = 0.5 * (1 - q);
    for (let i = 0; i < 3; i++) fillCircle(ctx, x + (i - 1) * (2 + q * 4), y - Math.abs(i - 1) * 1.5, 2.2 + q * 3.5, '#e4e0d8');
  }
  ctx.globalAlpha = 1;
}

function drawArms(ctx, look, s, g, sleeve) {
  const H = HAND;
  if (s.arms === 'folder') drawFolder(ctx, g);
  else if (s.arms === 'box') drawBox(ctx, g);
  ctx.strokeStyle = sleeve;
  ctx.lineWidth = 3.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(H.lsx, H.lsy);
  ctx.lineTo(H.lx, H.ly);
  const late = s.arms === 'phone' || palmOverFace(s); // that arm is drawn after the head
  if (!late) {
    ctx.moveTo(H.rsx, H.rsy);
    ctx.lineTo(H.rx, H.ry);
  }
  ctx.stroke();
  ctx.lineCap = 'butt';
  fillCircle(ctx, H.lx, H.ly, 2.3, look.skin);
  if (!late && !(s.item && liftOverHead(s))) {
    if (s.item && s.arms !== 'folder' && !mugOverTorso(s, g)) drawHeldItem(ctx, s, H.rx, H.ry);
    else if (!s.item && s.arms === 'point' && strictGlyphs()) drawFinger(ctx, H.rx, H.ry, look.skin);
    fillCircle(ctx, H.rx, H.ry, 2.3, look.skin);
    if (s.item && s.arms === 'folder') drawHeldItem(ctx, s, H.rx + 2, H.ry - 5);
  }
  if (s.arms === 'bang') {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (const side of [0, 1]) {
      if (Math.sin(s.t * 14 + side * Math.PI / 2) < 0.75) continue;
      const hx = side ? H.rx : H.lx;
      const hy = side ? H.ry : H.ly;
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i - 1) * 0.7 + g.d;
        ctx.moveTo(hx + Math.cos(a) * 4, hy + Math.sin(a) * 4);
        ctx.lineTo(hx + Math.cos(a) * 8, hy + Math.sin(a) * 8);
      }
    }
    ctx.stroke();
  }
}

// Facing away, the arms are drawn behind the torso; a mug (or anything held out) at the side is drawn again
// on top so it still reads from behind.
function mugOverTorso(s, g) {
  return (s.arms === 'mug' || s.arms === 'holdout') && g.sd < -0.25;
}

// What you hold lifted to your mouth is drawn over your head (the head would hide it), except facing away: then it
// is behind the head, the way the mouth is.
const liftOverHead = (s) => (s.arms === 'lift' || s.arms === 'sip') && s.lift > 0.4 && G.sd >= -0.25;
// A hand over the face is drawn over the head, except facing away (then the head hides it, as it should).
const palmOverFace = (s) => s.arms === 'facepalm' && G.sd >= -0.25;

function drawHeldItem(ctx, s, x, y) {
  if (s.crank) {
    // ratcheting wrench: quick turn, pause, turn back
    ctx.save();
    ctx.translate(x, y - 2);
    ctx.rotate(Math.sin(s.t * 9) * 0.7);
    emoji(ctx, s.item, 0, 0, 13, HELD);
    ctx.restore();
    return;
  }
  if (s.arms === 'point') {
    // the finger (👉) continues the arm: rotated along it, mirrored when pointing left
    const a = Math.atan2(G.fy, Math.abs(G.fx));
    ctx.save();
    ctx.translate(x + G.fx * 5, y + G.fy * 5);
    if (G.fx < 0) ctx.scale(-1, 1);
    ctx.rotate(a);
    emoji(ctx, s.item, 0, 0, 12, HELD);
    ctx.restore();
    return;
  }
  if (s.arms === 'sip' && s.lift > 0.5) {
    // tipped toward the mouth, more the closer it gets (facing left it tips the other way)
    ctx.save();
    ctx.translate(x, y - 2);
    ctx.rotate((G.fx < 0 ? 1 : -1) * (s.lift - 0.5) * 1.6);
    emoji(ctx, s.item, 0, 0, 12, HELD);
    ctx.restore();
    return;
  }
  emoji(ctx, s.item, x, y - 2 + heldWobble(s), s.arms === 'reach' ? 13 : 12, HELD);
}
const heldWobble = (s) => (s.arms === 'reach' ? Math.sin(s.t * 10) * 1.5 : 0);

// Where the held item's centre is drawn, in the person's own coordinates (drawPerson's origin, unscaled), or
// null when nothing is in a hand: the self action's glow traces it (render/effects.js drawLitTarget).
function heldItemAt(s, out) {
  if (!s.item) return null;
  const H = HAND;
  if (s.arms === 'phone') { out.x = H.rx + G.rx * 2; out.y = H.ry - 2; }
  else if (s.arms === 'folder') { out.x = H.rx + 2; out.y = H.ry - 7; }
  else if (s.arms === 'point') { out.x = H.rx + G.fx * 5; out.y = H.ry + G.fy * 5; }
  else { out.x = H.rx; out.y = H.ry - 2 + heldWobble(s); }
  return out;
}

// A bare pointing hand (arms 'point' with nothing in it): the index finger continues the arm. In a migrated level
// only (render/util.js strictGlyphs); the legacy ones point with a 👉 item.
function drawFinger(ctx, x, y, skin) {
  const a = Math.atan2(G.fy, Math.abs(G.fx));
  ctx.save();
  ctx.translate(x, y);
  if (G.fx < 0) ctx.scale(-1, 1);
  ctx.rotate(a);
  ctx.fillStyle = skin;
  rrect(ctx, 0, -1.1, 7.5, 2.2, 1.1);
  ctx.fill();
  fillCircle(ctx, 1.2, 1.4, 1.5, skin); // the curled fingers under it
  ctx.restore();
}

function drawFolder(ctx, g) {
  const cx = g.fx * 7;
  const cy = g.bodyY + 1 + g.fy * 7;
  const profile = Math.abs(g.cd) > 0.7;
  ctx.fillStyle = C.manilaDark;
  if (profile) {
    rrect(ctx, cx - 2.5, cy - 7, 5, 13, 1);
    ctx.fill();
    ctx.fillStyle = C.manila;
    rrect(ctx, cx - 2, cy - 7, 3.5, 12, 1);
    ctx.fill();
    return;
  }
  rrect(ctx, cx - 7.5, cy - 6, 15, 11.5, 1.5);
  ctx.fill();
  ctx.fillStyle = C.manila;
  rrect(ctx, cx - 7, cy - 5.5, 14, 10.5, 1.5);
  ctx.fill();
  ctx.fillRect(cx - 6, cy - 7.5, 6, 3); // tab
  ctx.fillStyle = 'rgba(120,80,20,0.35)';
  ctx.fillRect(cx - 4, cy - 2, 8, 0.9);
  ctx.fillRect(cx - 4, cy + 0.5, 6, 0.9);
  ctx.fillStyle = C.tomato; // "IMPORTANT" stamp blob
  ctx.fillRect(cx + 2, cy + 2, 3.5, 1.6);
}

// Cardboard box of desk belongings, open at the top with a potted plant poking out.
function drawBox(ctx, g) {
  const cx = g.fx * 9;
  const cy = g.bodyY + 3 + g.fy * 8;
  const w = Math.abs(g.cd) > 0.7 ? 13 : 18;
  const top = cy - 5;
  ctx.fillStyle = '#6e4a26'; // dark open top
  rrect(ctx, cx - w / 2, top - 3, w, 5, 1.5);
  ctx.fill();
  emoji(ctx, strictGlyphs() ? '#plant' : '🪴', cx + 1.5, top - 6, 12); // legacy: drop with the legacy list
  ctx.fillStyle = '#c38f55'; // flaps, splayed out
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, top - 2); ctx.lineTo(cx - w / 2 - 3, top - 5); ctx.lineTo(cx - w / 2 + 3, top - 4.5); ctx.closePath();
  ctx.moveTo(cx + w / 2, top - 2); ctx.lineTo(cx + w / 2 + 3, top - 5.5); ctx.lineTo(cx + w / 2 - 3, top - 4.5); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9c6b38';
  rrect(ctx, cx - w / 2, top, w, 11, 1.5);
  ctx.fill();
  ctx.fillStyle = '#d0a066'; // front face
  rrect(ctx, cx - w / 2 + 0.5, top, w - 1, 10, 1.5);
  ctx.fill();
  ctx.fillStyle = '#5a3c1e'; // hand hole
  rrect(ctx, cx - 2.5, top + 2.5, 5, 1.8, 0.9);
  ctx.fill();
}

const G = { d: 0, cd: 0, sd: 0, fx: 0, fy: 0, rx: 0, ry: 0, bodyY: 0, brx: 0, bry: 0, headY: 0, hr: 0 };

// Draw a person whose feet/centre are at (x, y) in the current transform.
export function drawPerson(ctx, look, s, x, y) {
  const sc = s.scale || 1;
  ctx.save();
  ctx.translate(fin(x), fin(y));
  if (sc !== 1) ctx.scale(sc, sc);
  const d = fin(s.dir);
  const h = fin(s.head, d);
  const cd = Math.cos(d);
  const sd = Math.sin(d);
  const wide = look.wide || 1;
  const tall = look.tall || 1;
  const sit = s.pose === 'sit';
  const walking = !sit && (s.pose === 'walk' || s.moving);
  const bob = walking ? Math.abs(Math.sin(s.phase)) * (s.arms === 'folder' || s.arms === 'box' ? 2.4 : 1.6) : 0;
  const bodyY = (sit ? 1 : -2) - bob;
  const brx = (9 - 2.5 * Math.abs(cd)) * wide;
  const bry = 7 * tall;
  const hr = look.head;
  const headY = bodyY - 10 * tall - (s.smug ? 1.2 : 0);
  G.d = d; G.cd = cd; G.sd = sd;
  G.fx = cd; G.fy = sd * 0.6;
  G.rx = -sd; G.ry = cd * 0.6;
  G.bodyY = bodyY; G.brx = brx; G.bry = bry; G.headY = headY; G.hr = hr;
  const noJacket = look.shirt && !s.jacket;
  const bodyCol = noJacket ? look.shirt : look.body;
  const bodyDark = noJacket ? look.shirtDark : look.bodyDark;
  const north = sd < -0.25;

  // shadow
  fillEllipse(ctx, 0, 9, 10 * wide, 3.5, 'rgba(25,15,8,0.25)');

  // legs / feet
  ctx.fillStyle = look.legs;
  if (sit) {
    for (const side of [-1, 1]) {
      ellipse(ctx, G.fx * 7 + G.rx * 3.2 * side, bodyY + 5 + G.fy * 7 + G.ry * 3.2 * side, 3.2, 2.5);
      ctx.fill();
    }
  } else {
    const sw = walking ? Math.sin(s.phase) * 4 : 0;
    for (const side of [-1, 1]) {
      const k = sw * side;
      ellipse(ctx, G.rx * 3.3 * side + G.fx * k, 6 + G.ry * 3.3 * side + G.fy * k, 2.8, 2.2);
      ctx.fill();
    }
  }

  computeHands(s, G);
  if (s.arms === 'holdout' && s.item) fillEllipse(ctx, HAND.fx, HAND.fy, 4.5, 1.8, 'rgba(25,15,8,0.4)'); // the floor under it
  if (north) drawArms(ctx, look, s, G, bodyDark);

  // torso
  fillEllipse(ctx, 0, bodyY + 1.5, brx, bry, bodyDark);
  fillEllipse(ctx, 0, bodyY, brx * 0.97, bry * 0.9, bodyCol);
  drawTorsoDetail(ctx, look, s, noJacket);
  if (s.stain) drawMark(ctx, s.stain);
  if (s.item && mugOverTorso(s, G)) {
    drawHeldItem(ctx, s, HAND.rx, HAND.ry);
    fillCircle(ctx, HAND.rx, HAND.ry, 2.3, look.skin);
  }

  if (look.hood && !noJacket) fillEllipse(ctx, -G.fx * hr * 0.55, headY + hr * 0.95 - G.fy * hr * 0.4, hr * 1.05, hr * 0.62, look.hoodColor ?? look.bodyDark);
  if (!north) drawArms(ctx, look, s, G, bodyDark);

  drawHead(ctx, look, s, h, 0, headY, hr);
  if (s.arms === 'type' && !s.typing) drawKeys(ctx, s, G);
  if (s.item && liftOverHead(s)) {
    drawHeldItem(ctx, s, HAND.rx, HAND.ry);
    fillCircle(ctx, HAND.rx, HAND.ry, 2.3, look.skin);
  }
  if (palmOverFace(s)) {
    ctx.strokeStyle = bodyDark;
    ctx.lineWidth = 3.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(HAND.rsx, HAND.rsy);
    ctx.lineTo(HAND.rx, HAND.ry + 3);
    ctx.stroke();
    ctx.lineCap = 'butt';
    fillEllipse(ctx, HAND.rx, HAND.ry, 3.2, 2.8, look.skin); // the flat palm
  }

  if (s.arms === 'phone') {
    const ex = HAND.rx;
    const ey = HAND.ry;
    ctx.strokeStyle = bodyDark;
    ctx.lineWidth = 3.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(HAND.rsx, HAND.rsy);
    ctx.lineTo(ex, ey + 3);
    ctx.stroke();
    ctx.lineCap = 'butt';
    if (s.item) {
      emoji(ctx, s.item, ex + G.rx * 2, ey - 2, 13, HELD); // the gag: whatever you're holding is your "phone"
    } else {
      ctx.fillStyle = '#26221f';
      rrect(ctx, ex - 2, ey - 6, 4.5, 9, 1.2);
      ctx.fill();
      ctx.fillStyle = '#7fb3c8';
      ctx.fillRect(ex - 1.2, ey - 5, 2.9, 4);
    }
    fillCircle(ctx, ex, ey + 1, 2.3, look.skin);
  }

  if (s.sweat) {
    const ph = (s.t * 1.4) % 1;
    const sx = hr * 0.95;
    const sy = headY - hr * 0.3 + ph * 6;
    ctx.globalAlpha = 1 - ph * 0.6;
    drawDrop(ctx, sx, sy, 3.5, 2.4, 1.6);
    ctx.globalAlpha = 1;
  }

  if (s.arms === 'puff') drawSmoke(ctx, s, G);

  if (s.typing) {
    for (let i = 0; i < 3; i++) {
      const ph = (s.t * 1.2 + i / 3) % 1;
      const px = Math.sin(i * 2.3 + Math.floor(s.t * 1.2 + i / 3) * 1.7) * 10;
      const py = bodyY - 6 - ph * 18;
      ctx.save();
      ctx.globalAlpha = 1 - ph;
      ctx.translate(px, py);
      ctx.rotate(Math.sin(s.t * 5 + i) * 0.6);
      drawPaper(ctx, 6, 8, 2);
      ctx.restore();
    }
  }
  ctx.restore();
}

// Typing without the paper flurry (a coworker at work: drawNpc atWork; a level's 'type' pose): keystrokes tick over
// his hands, left and right in turn, so a back turned to you still reads as busy. s.seed staggers one typist from
// the next.
function drawKeys(ctx, s, g) {
  const north = g.sd < -0.25;
  const beat = s.t * 1.6 + fin(s.seed);
  ctx.save();
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const ph = (beat + (side > 0 ? 0.5 : 0)) % 1; // each hand taps in turn
    if (ph > 0.4) continue;
    const a = 0.45 + 0.55 * (1 - ph / 0.4); // a tap: bright, then fading, never quite gone before the next
    const hx = side < 0 ? HAND.lx : HAND.rx;
    const hy = side < 0 ? HAND.ly : HAND.ry;
    const x = north ? hx * 1.6 : hx;
    const y = north ? g.headY - g.hr - 2 : hy - 4;
    const up = 2.5 + 2.5 * a;
    for (const [w, c, k] of [[3, 'rgba(30,20,14,0.5)', 1], [1.4, C.cream, 1]]) {
      ctx.globalAlpha = a * k;
      ctx.strokeStyle = c;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x - 1.6, y);
      ctx.lineTo(x - 2.4, y - up);
      ctx.moveTo(x + 1.6, y);
      ctx.lineTo(x + 2.4, y - up);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// A badge (level 1: the boss's keycard) on a teal lanyard, clipped to the jacket pocket.
function drawBadge(ctx) {
  const { cd, sd, bodyY, brx, bry } = G;
  if (sd < -0.25) return; // pocket is on the front
  const side = cd >= 0 ? 1 : -1;
  const x = cd * brx * 0.45 + side * brx * 0.38 * Math.max(0.3, sd + 0.3);
  const y = bodyY + bry * 0.15;
  ctx.strokeStyle = C.teal;
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(x - 1.2, y - 4);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = C.white;
  ctx.fillRect(x - 1.6, y, 3.4, 4.2);
  ctx.fillStyle = C.teal;
  ctx.fillRect(x - 1.6, y, 3.4, 1.2);
}

// What eating left on you (config.js MARKS[name]: the harness names it with the same entry's words): a splat
// with a drip down the chest (on the shoulder from behind).
function drawMark(ctx, name) {
  const mark = MARKS[name];
  if (!mark) return;
  const { color, dark } = mark;
  const { fx, fy, sd, bodyY, brx, bry } = G;
  const back = sd < -0.25;
  const cx = back ? brx * 0.5 : fx * brx * 0.35;
  const cy = bodyY - bry * (back ? 0.45 : 0.15) + fy * 2;
  const r = back ? 2.2 : 3.2;
  fillEllipse(ctx, cx + 0.4, cy + 0.6, r * 1.1, r * 0.85, dark);
  fillEllipse(ctx, cx, cy, r, r * 0.8, color);
  fillCircle(ctx, cx + r * 0.95, cy - r * 0.55, r * 0.38, color);
  fillCircle(ctx, cx - r * 0.9, cy + r * 0.2, r * 0.32, color);
  if (!back) {
    fillEllipse(ctx, cx - r * 0.25, cy + r * 1.05, r * 0.32, r * 0.65, color); // drip
    fillCircle(ctx, cx - r * 0.25, cy + r * 1.6, r * 0.36, color);
  }
}

function drawTorsoDetail(ctx, look, s, noJacket) {
  const { fx, sd, bodyY, brx, bry } = G;
  const south = sd > 0.2;
  const cx = fx * brx * 0.45;
  const top = bodyY - bry * 0.78;
  if (look.torso === 'suit') {
    if (noJacket) {
      // suspenders + tie
      ctx.strokeStyle = '#7a2a22';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx - brx * 0.42, top + 1);
      ctx.lineTo(cx - brx * 0.32, bodyY + bry * 0.7);
      ctx.moveTo(cx + brx * 0.42, top + 1);
      ctx.lineTo(cx + brx * 0.32, bodyY + bry * 0.7);
      ctx.stroke();
      if (south) {
        ctx.fillStyle = look.tie;
        ctx.beginPath();
        ctx.moveTo(cx - 1.4, top + 1);
        ctx.lineTo(cx + 1.4, top + 1);
        ctx.lineTo(cx + 1.8, top + 9);
        ctx.lineTo(cx, top + 11);
        ctx.lineTo(cx - 1.8, top + 9);
        ctx.closePath();
        ctx.fill();
      }
    } else if (south) {
      ctx.fillStyle = look.shirt;
      ctx.beginPath();
      ctx.moveTo(cx - 3.5, top);
      ctx.lineTo(cx + 3.5, top);
      ctx.lineTo(cx, top + 9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = look.tie;
      ctx.beginPath();
      ctx.moveTo(cx - 1, top + 0.5);
      ctx.lineTo(cx + 1, top + 0.5);
      ctx.lineTo(cx + 1.3, top + 7);
      ctx.lineTo(cx, top + 8.5);
      ctx.lineTo(cx - 1.3, top + 7);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = C.navyLight;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 3.5, top);
      ctx.lineTo(cx - 0.5, top + 9);
      ctx.moveTo(cx + 3.5, top);
      ctx.lineTo(cx + 0.5, top + 9);
      ctx.stroke();
    } else if (sd < -0.2) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(-0.5, top + 2, 1, bry * 1.3);
    }
    if (s.badge && !noJacket) drawBadge(ctx);
    return;
  }
  if (look.torso === 'sweater') {
    if (south) {
      ctx.fillStyle = look.trim; // shirt collar
      ctx.beginPath();
      ctx.moveTo(cx - 3.5, top + 0.5);
      ctx.lineTo(cx, top + 4);
      ctx.lineTo(cx + 3.5, top + 0.5);
      ctx.lineTo(cx, top + 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(80,10,5,0.35)'; // ribbed hem
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = -2; i <= 2; i++) {
      ctx.moveTo(i * brx * 0.3, bodyY + bry * 0.55);
      ctx.lineTo(i * brx * 0.3, bodyY + bry * 0.85);
    }
    ctx.stroke();
    return;
  }
  if (look.torso === 'cardigan') {
    if (south) {
      ctx.fillStyle = look.trim;
      ctx.beginPath();
      ctx.moveTo(cx - 2.5, top);
      ctx.lineTo(cx + 2.5, top);
      ctx.lineTo(cx + 1.2, bodyY + bry * 0.8);
      ctx.lineTo(cx - 1.2, bodyY + bry * 0.8);
      ctx.closePath();
      ctx.fill();
      fillCircle(ctx, cx + 2.4, bodyY - 1, 0.8, C.ochre);
      fillCircle(ctx, cx + 2.2, bodyY + 2.5, 0.8, C.ochre);
    }
    return;
  }
  if (look.torso === 'hoodie' && south && !noJacket) {
    ctx.fillStyle = look.bodyDark;
    rrect(ctx, cx - 4.5, bodyY + 1, 9, 4, 1.5); // hoodie pocket
    ctx.fill();
    ctx.strokeStyle = '#d8d2c4';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - 1.5, top + 1);
    ctx.lineTo(cx - 1.8, top + 6);
    ctx.moveTo(cx + 1.5, top + 1);
    ctx.lineTo(cx + 1.8, top + 6);
    ctx.stroke();
  }
}

function drawHead(ctx, look, s, h, hx, hy, hr) {
  const ch = Math.cos(h);
  const sh = Math.sin(h);
  const faceSeen = sh > -0.45;
  // ears when facing N/S
  if (Math.abs(sh) > 0.55) {
    fillCircle(ctx, hx - hr, hy + 0.6, 1.7, look.skinDark);
    fillCircle(ctx, hx + hr, hy + 0.6, 1.7, look.skinDark);
  }
  // Lin's bun sits behind the head when she faces the camera
  const bunX = hx - ch * hr * 0.78;
  const bunY = hy - sh * hr * 0.5 - hr * 0.45;
  if (look.hairStyle === 'bun' && sh > 0.2) fillCircle(ctx, bunX, bunY, hr * 0.45, look.hair);

  fillCircle(ctx, hx, hy + 0.8, hr, look.skinDark); // jaw shade
  fillCircle(ctx, hx, hy, hr, look.skin);

  // nose nub pokes out of the silhouette in the facing direction
  if (sh > -0.7) fillCircle(ctx, hx + ch * (hr + 0.2), hy + sh * hr * 0.5 + 1, 1.6, look.skinDark);

  // hair cap: an offset circle clipped to the head
  ctx.save();
  circle(ctx, hx, hy, hr);
  ctx.clip();
  const k = hr * (0.5 + 0.28 * sh);
  ctx.fillStyle = look.hair;
  circle(ctx, hx - ch * k, hy - sh * 0.7 * k - 0.15 * hr, hr);
  ctx.fill();
  if (look.hairStyle === 'horseshoe') {
    fillCircle(ctx, hx - ch * hr * 0.12, hy - hr * 0.35 - sh * hr * 0.1, hr * 0.8, look.skin);
    fillEllipse(ctx, hx - hr * 0.3, hy - hr * 0.6, hr * 0.32, hr * 0.18, 'rgba(255,255,255,0.35)');
  }
  ctx.restore();

  if (look.hairStyle === 'tuft') {
    ctx.fillStyle = look.hair;
    ctx.save();
    ctx.translate(hx - ch * hr * 0.15, hy - hr * 0.9);
    ctx.rotate(-0.5 + ch * 0.3);
    ellipse(ctx, 0, -1.5, 1.8, 3);
    ctx.fill();
    ctx.rotate(0.9);
    ellipse(ctx, 0.5, -1, 1.4, 2.4);
    ctx.fill();
    ctx.restore();
  } else if (look.hairStyle === 'spiky') {
    ctx.fillStyle = look.hair;
    ctx.beginPath();
    for (let i = -1; i <= 1; i++) {
      const bx = hx + i * 2.6 - ch * 1.5;
      const by = hy - hr * 0.75;
      ctx.moveTo(bx - 2, by + 1);
      ctx.lineTo(bx - ch * 1.2 + i * 0.8, by - 3.2);
      ctx.lineTo(bx + 2, by + 1);
    }
    ctx.fill();
  } else if (look.hairStyle === 'bun' && sh <= 0.2) {
    fillCircle(ctx, bunX, bunY, hr * 0.45, look.hair);
    fillCircle(ctx, bunX - 0.8, bunY - 0.8, hr * 0.15, 'rgba(255,255,255,0.15)');
  }

  if (faceSeen) {
    const fcx = hx + ch * hr * 0.5;
    const fcy = hy + sh * hr * 0.3 + 0.6;
    const profile = Math.abs(ch) > 0.78;
    const ex = -sh * 2.5;
    const ey = ch * 0.5;
    const pupX = ch * 0.45;
    const pupY = sh * 0.3;
    const eyes = profile ? 1 : 2;
    for (let i = 0; i < eyes; i++) {
      const sgn = eyes === 1 ? 0 : i ? 1 : -1;
      const x = fcx + ex * sgn + (profile ? ch * 0.6 : 0);
      const y = fcy + ey * sgn - 0.6;
      if (s.smug) {
        ctx.strokeStyle = '#2a211b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y + 0.6, 1.3, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      } else {
        fillCircle(ctx, x, y, 1.55, '#fbf8f0');
        fillCircle(ctx, x + pupX, y + pupY, 0.95, '#1d1712');
      }
      if (look.glasses) {
        ctx.strokeStyle = '#1d1712';
        ctx.lineWidth = 0.8;
        circle(ctx, x, y, 2.1);
        ctx.stroke();
      }
    }
    if (look.glasses && eyes === 2) {
      ctx.beginPath();
      ctx.moveTo(fcx - ex * 0.45, fcy - ey * 0.45 - 0.8);
      ctx.lineTo(fcx + ex * 0.45, fcy + ey * 0.45 - 0.8);
      ctx.stroke();
    }
    if (s.angry) {
      ctx.strokeStyle = '#1d1712';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(fcx - 3.4, fcy - 3.4);
      ctx.lineTo(fcx - 0.8, fcy - 2.2);
      ctx.moveTo(fcx + 3.4, fcy - 3.4);
      ctx.lineTo(fcx + 0.8, fcy - 2.2);
      ctx.stroke();
    }
    if (look.mustache && sh > -0.3) {
      fillEllipse(ctx, hx + ch * hr * 0.62, hy + sh * hr * 0.5 + 2.8, profile ? 1.6 : 2.8, 1.1, '#6f6a64');
    }
    if (s.smug && sh > 0.2) {
      ctx.strokeStyle = '#7a3020';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(fcx, fcy + 2.4, 1.6, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  }

  // Glance telegraph: dashes radiating from the face in the head direction.
  if (s.glance > 0.35) {
    const pulse = 0.55 + 0.45 * Math.abs(Math.sin(s.t * 6));
    ctx.strokeStyle = `rgba(42,33,27,${(0.75 * pulse).toFixed(3)})`;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = -1; i <= 1; i++) {
      const a = h + i * 0.34;
      const ca = Math.cos(a);
      const sa = Math.sin(a) * 0.8;
      ctx.moveTo(hx + ca * (hr + 2.5), hy + sa * (hr + 2.5));
      ctx.lineTo(hx + ca * (hr + 6.5), hy + sa * (hr + 6.5));
    }
    ctx.stroke();
    ctx.lineCap = 'butt';
  }
}

// ---------------------------------------------------------------------------
// Faces as icons: emoji(ctx, '@<castId>', ...) anywhere (bubbles, end-card rows, props) draws that person's head
// and shoulders facing you, in an icon-sized box. The renderer calls useFaces(game) every frame so the painter
// can find the level's looks; '@player' is you.
const FACE = personState();
let faceGame = null;
export function useFaces(game) {
  faceGame = game || null;
}

function faceLook(game, id) {
  const level = game && game.level;
  if (!level) return null;
  if (level.looks && level.looks[id]) return level.looks[id];
  const who = id === 'player' ? game.player : (game.npcs || []).find((n) => n && n.id === id)
    || (level.cast || []).find((d) => d && d.id === id);
  return who ? lookFor(level.looks, id, who.color) : null;
}

// Head and shoulders of `look` centred on (x, y), about `size` px tall, like an emoji of that size.
export function drawFace(ctx, look, x, y, size) {
  const hr = look.head || 6.6;
  const k = fin(size, 16) / (2.55 * hr);
  ctx.save();
  ctx.translate(fin(x), fin(y) - 0.1 * hr * k);
  ctx.scale(k, k);
  // shoulders, cut off flat like a portrait
  ctx.save();
  ctx.beginPath();
  ctx.rect(-2 * hr, 0, 4 * hr, hr * 1.3);
  ctx.clip();
  fillEllipse(ctx, 0, hr * 1.6, hr * 1.32, hr * 0.95, look.bodyDark || look.body);
  fillEllipse(ctx, 0, hr * 1.7, hr * 1.2, hr * 0.88, look.body);
  ctx.restore();
  if (look.hood) fillEllipse(ctx, 0, hr * 0.75, hr * 1.12, hr * 0.62, look.bodyDark);
  FACE.t = faceGame ? fin(faceGame.time) : 0;
  drawHead(ctx, look, FACE, Math.PI / 2, 0, 0, hr);
  ctx.restore();
}

setFacePainter((ctx, id, x, y, size) => {
  const look = faceLook(faceGame, id);
  if (!look) return false;
  drawFace(ctx, look, x, y, size);
  return true;
});

// ---------------------------------------------------------------------------
// In-world characters for a day.
const S = personState();
const order = [];

export function drawCharacters(ctx, game, t, mem) {
  drawPlayerRing(ctx, game, t, mem);
  order.length = 0;
  const npcs = game.npcs || [];
  for (let i = 0; i < npcs.length; i++) if (npcs[i] && npcs[i].active) order.push(npcs[i]);
  if (game.player) order.push(game.player);
  order.sort((a, b) => fin(a.y) - fin(b.y));
  for (let i = 0; i < order.length; i++) {
    const e = order[i];
    if (e === game.player) drawPlayer(ctx, game, t);
    else drawNpc(ctx, game, e, t);
  }
}

// "You are here", under every character. You: a steady ring at your feet, never pulsing or spreading (spreading rings are a noise: effects.js ripples).
// At the loop's start a chevron bobs over your head: no rings at all, so nothing about you reads as a sound.
function drawPlayerRing(ctx, game, t, mem) {
  const p = game.player;
  if (!p || game.phase !== 'day') return;
  const x = fin(p.x) * T;
  const y = fin(p.y) * T + 7;
  const since = t - fin(mem && mem.dayStart, -10);
  if (since >= 0 && since < 2.4) {
    const a = clamp((2.4 - since) / 0.4, 0, 1);
    const bob = Math.abs(Math.sin(since * Math.PI * 2.2)) * 5;
    const cy = fin(p.y) * T - 34 - bob;
    ctx.globalAlpha = a;
    ctx.fillStyle = C.tomato;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 7, cy - 5);
    ctx.lineTo(x + 7, cy - 5);
    ctx.lineTo(x, cy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  fillEllipse(ctx, x, y, 14, 6, 'rgba(255,90,67,0.16)');
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = C.tomato;
  ctx.lineWidth = 2;
  ellipse(ctx, x, y, 14, 6);
  ctx.stroke();
  ctx.globalAlpha = 1;
  drawActionProgress(ctx, p, x, y);
}

// A hold-E action's progress: an ochre arc filling round the floor under her, from the front, clockwise. On the
// floor, under her, so it never covers her or what she holds. Same look for every action: colouring "sneaky" ones
// would explain a rule (no hand-holding).
function drawActionProgress(ctx, p, x, y) {
  const a = p.action;
  if (!a) return;
  const k = clamp(fin(a.t) / Math.max(0.001, fin(a.duration, 1)), 0, 1);
  const rx = 18;
  const ry = 8;
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(24,19,15,0.5)';
  ellipse(ctx, x, y, rx, ry);
  ctx.stroke();
  ctx.strokeStyle = C.ochre;
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, Math.PI / 2, Math.PI / 2 + Math.PI * 2 * k);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

const NONE = [];
const NO_POSES = {};

export function resetState(s, t) {
  s.dir = 0; s.head = 0; s.pose = 'stand'; s.moving = false; s.phase = 0; s.arms = 'idle'; s.item = null;
  s.scale = 1; s.jacket = true; s.smug = false; s.sweat = false; s.glance = 0; s.t = t; s.typing = false; s.angry = false;
  s.badge = false; s.crank = false; s.stain = null; s.lift = 0; s.seed = 0;
}

// The emoji for a held item type: its level.items[type].icon (the validator requires one), '❔' for something
// that isn't a level item, null for empty hands.
export function itemIcon(items, held) {
  if (!held) return null;
  return (items && items[held]?.icon) || '❔';
}

// The glyph an item is drawn with, on the floor, in a hand and in the HUD: '#<type>' (its `draw`, render/things.js)
// when it has one, else its emoji (a level on the legacy list, src/levels/legacy.js). null for empty hands.
export function itemGlyph(items, type) {
  if (!type) return null;
  return items && items[type]?.draw !== undefined ? `#${type}` : itemIcon(items, type);
}

// The player's look in a disguise she wears (level.items[type].disguise.look over her own; play/disguise.js).
const wornLooks = new WeakMap();
function wornLook(looks, disguise) {
  let look = wornLooks.get(disguise);
  if (!look) wornLooks.set(disguise, (look = { ...lookFor(looks, 'player'), ...disguise.look }));
  return look;
}

function drawPlayer(ctx, game, t) {
  const p = game.player;
  const s = S;
  resetState(s, t);
  const worn = p.held ? game.level.items?.[p.held]?.disguise : null; // worn, not carried: not in her hand
  s.dir = fin(p.dir, -Math.PI / 2);
  s.head = s.dir;
  s.pose = p.seated ? 'sit' : p.moving ? 'walk' : 'stand';
  s.moving = !!p.moving && !p.seated;
  s.phase = t * 11;
  s.item = worn ? null : itemGlyph(game.level.items, p.held);
  const bp = p.busyPose;
  s.arms = bp === 'typing' ? 'type' : bp === 'folder' ? 'folder' : bp === 'phone' ? 'phone'
    : p.action ? p.action.pose ?? 'reach' : selfPreview(p, s, t) ?? (p.seated ? 'desk' : s.item ? 'carry' : p.moving ? 'walk' : 'idle');
  if (p.action && s.arms === 'lift') s.lift = 1 - 0.12 * Math.max(0, Math.sin(t * 14)); // eating: bites
  if (p.action && s.arms === 'sip') s.lift = 1 - 0.05 * Math.max(0, Math.sin(t * 5)); // drinking: long sips
  s.smug = bp === 'folder';
  s.typing = bp === 'typing';
  s.sweat = !!game.caught || (game.clock && game.clock.forced > 0);
  s.stain = p.smeared || null;
  if (game.caught) s.head = s.dir + Math.sin(t * 9) * 0.5; // panicked looking around
  const x = fin(p.x) * T;
  const y = fin(p.y) * T;
  drawPerson(ctx, worn ? wornLook(game.level.looks, worn) : lookFor(game.level.looks, 'player'), s, x, y);
  const at = heldItemAt(s, playerHeld);
  playerHeld.on = !!at;
  playerHeld.t = t;
  if (at) { playerHeld.x = x + at.x * (s.scale || 1); playerHeld.y = y + at.y * (s.scale || 1); }
  const forced = game.clock ? fin(game.clock.forced) : 0;
  if (forced > 0 && !game.outcome) drawWorkMeter(ctx, x, y - 40, clamp(forced / WORK_PENALTY_MIN, 0, 1));
}

// The assigned work over your head while it lasts (game.clock.forced): a sheet of paper and the bar of it left.
function drawWorkMeter(ctx, x, y, left) {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x - 14, y - 5, 30, 12);
  ctx.fillStyle = C.white;
  ctx.fillRect(x - 13, y - 4, 8, 10);
  ctx.fillStyle = 'rgba(42,33,27,0.55)';
  for (let i = 0; i < 3; i++) ctx.fillRect(x - 12, y - 2 + i * 2.5, 6, 0.9);
  ctx.fillStyle = '#2a211b';
  ctx.fillRect(x - 3, y - 1, 18, 4);
  ctx.fillStyle = C.tomato;
  ctx.fillRect(x - 3, y - 1, 18 * left, 4);
}

// What E would do to what you hold, before the press (player.focus a 'self' target, play/interactions.js): its
// row's preview pose, standing still. E held down on a target with a hold verb shows that verb's pose growing
// over HOLD_TIME (eating: the item rising to the mouth). null: no preview.
function selfPreview(p, s, t) {
  const f = p.focus;
  if (!f || f.kind !== 'self' || !s.item) return null;
  if (p.hold && f.holdPreview) {
    s.lift = 0.25 + 0.75 * clamp(fin(p.hold.t) / HOLD_TIME, 0, 1);
    return f.holdPreview;
  }
  if (p.moving) return null;
  s.lift = 0.55 + 0.06 * Math.sin(t * 4);
  return f.preview;
}

// Where the player's held item was last drawn (world px; on: something in her hand; t: that frame's time), for the
// self action's glow (render/effects.js drawLitTarget, drawn after the characters in the same frame).
export const playerHeld = { on: false, x: 0, y: 0, t: -1 };

function drawNpc(ctx, game, n, t) {
  const s = S;
  resetState(s, t);
  const look = lookFor(game.level.looks, n.id, n.color);
  const world = game.world || {};
  const off = n.glance ? fin(n.glance.offset) : 0;
  s.dir = fin(n.dir);
  s.head = s.dir + off;
  s.glance = Math.abs(off);
  s.pose = n.pose === 'sit' ? 'sit' : n.pose === 'walk' || n.moving ? 'walk' : 'stand';
  s.moving = !!n.moving;
  s.phase = t * 10 + (n.id ? n.id.length * 1.3 : 0);
  s.seed = n.id ? hash(n.id.length, n.id.charCodeAt(0), n.id.charCodeAt(n.id.length - 1)) : 0;
  // The level's poses (level.poses, e.g. src/levels/meeting/looks.js): the first arms rule that holds, else
  // sitting at a desk (typing, atWork) or walking; then every marks rule that holds.
  const poses = game.level.poses || NO_POSES;
  let rule = null;
  for (const r of poses.arms || NONE) if (r.when(n, world, game)) { rule = r; break; }
  if (rule) {
    s.arms = typeof rule.arms === 'function' ? rule.arms(n) : rule.arms;
    if (rule.item) s.item = rule.item;
    if (rule.angry) s.angry = true;
    if (rule.crank) s.crank = true;
  } else if (s.pose === 'sit') {
    s.arms = atWork(n, s) ? 'type' : 'desk';
  } else if (s.pose === 'walk') {
    s.arms = 'walk';
  }
  // Picking his thing up off the floor (npc.pocketing, sim/mechanics/fetch.js): bent over it a moment, then holding it
  // up in both hands to look at, until it goes in his pocket.
  let stoop = 0;
  if (n.pocketing) {
    const k = fin(game.loopTime) - fin(n.pocketing.at);
    stoop = k < POCKET_STOOP ? Math.sin((k / POCKET_STOOP) * Math.PI) * 4 : 0;
    s.arms = 'reach';
    s.item = itemGlyph(game.level.items, n.pocketing.type);
  }
  if (strictGlyphs()) pointAt(game, n, s);
  orderTurn(game, n, s);
  // What he carries (npc.carry): in hand while the hands are free, otherwise set down beside him.
  let mug = false;
  if (n.carry) {
    if (!s.item && s.pose !== 'sit' && (s.arms === 'walk' || s.arms === 'idle')) {
      s.arms = 'mug';
      s.item = itemGlyph(game.level.items, n.carry);
    } else mug = true;
  }
  for (const r of poses.marks || NONE) {
    if (!r.when(n, world, game)) continue;
    if (r.angry) s.angry = true;
    if (r.badge) s.badge = true;
    if (r.jacket === false) s.jacket = false;
  }
  const auth = game.level.roles?.authority?.id;
  if (game.caught && n.id && n.id === auth) s.angry = true; // the authority, catching you
  if (game.rules?.grudge?.by === n.id && n.id) s.angry = true; // she saw you, and she'll tell him when he's back
  const px = fin(n.x) * T;
  let py = fin(n.y) * T + stoop;
  // A witness who just saw you at it (game.watch, play/rules.js) starts: a little hop (render/effects.js drawWitnesses
  // opens the eye beside her head).
  if (n.id !== auth && game.watch && Object.hasOwn(game.watch, n.id)) {
    const seen = fin(game.rules?.seen?.[n.id]);
    if (seen > 0 && seen < NOTICE) py -= Math.sin((seen / NOTICE) * Math.PI) * 3;
  }
  const mugBehind = mug && Math.sin(s.dir) < 0; // on the far side of him: he overlaps it
  if (mugBehind) drawSetDownMug(ctx, px, py, s.dir, itemGlyph(game.level.items, n.carry));
  drawPerson(ctx, look, s, px, py);
  if (mug && !mugBehind) drawSetDownMug(ctx, px, py, s.dir, itemGlyph(game.level.items, n.carry));
}

const POCKET_STOOP = 0.4; // s of the bend down to pick his thing up (drawNpc)

// Sat at his desk in his own routine, he types: no scripted moment (override), no look of the schedule's own
// (anim), nothing holding his eyes (npc.heeding: a noise, a stare) and his head straight. A glance or a turn to a
// noise rests his hands, so it reads as a break from typing. Silent, and without the paper flurry over you when
// you type (drawPerson s.typing): your typing stays your own.
const GLANCE_REST = 0.3; // rad of head turn that stops his hands
function atWork(n, s) {
  return !n.override && !n.anim && !n.heeding && s.glance < GLANCE_REST;
}

// Telling on you, or catching you (a 'tattle' or 'caught' sightline from him, core/fx.js): he turns to you, or to
// the screen he saw you on, and points with his bare hand, whatever the pose said. In a migrated level only.
function pointAt(game, n, s) {
  const lines = game.fx && game.fx.lines;
  const p = game.player;
  if (!Array.isArray(lines) || !p) return;
  const l = lines.find((v) => v && v.from === n.id && (v.kind === 'tattle' || v.kind === 'caught') && fin(v.age) < fin(v.ttl, 0.8));
  if (!l) return;
  const to = l.via?.screen ?? p;
  const dx = fin(to.x) - fin(n.x);
  const dy = fin(to.y) - fin(n.y);
  if (Math.abs(dx) + Math.abs(dy) > 0.01) s.dir = Math.atan2(dy, dx);
  s.head = s.dir;
  s.glance = 0;
  s.arms = 'point';
  s.item = null;
  s.crank = false;
}

// Sending you to your desk (game.rules.sent, play/player.js): the authority turns to the witness whose shout reached
// him, then to you; once he has given the order he points at you (bare hand: a migrated level only) until you're
// at your desk.
function orderTurn(game, n, s) {
  const sent = game.rules && game.rules.sent;
  if (!sent || !n.id || sent.auth !== n.id || !sent.look) return;
  const to = sent.look === 'player' ? game.player : game.npcs && game.npcs.find((m) => m && m.id === sent.look);
  if (!to) return;
  const dx = fin(to.x) - fin(n.x);
  const dy = fin(to.y) - fin(n.y);
  if (Math.abs(dx) + Math.abs(dy) > 0.01) s.dir = Math.atan2(dy, dx);
  s.head = s.dir;
  s.glance = 0;
  if (sent.said && sent.look === 'player' && strictGlyphs()) {
    s.arms = 'point';
    s.item = null;
    s.crank = false;
  }
}

// A cup set down on the desk or table in front of someone, a little to their right.
function drawSetDownMug(ctx, px, py, d, icon) {
  const c = Math.cos(d);
  const sn = Math.sin(d);
  const x = px + c * 16 - sn * 10;
  const y = py + sn * 18 + c * 3 - 4;
  fillEllipse(ctx, x, y + 5, 5, 2, 'rgba(30,18,10,0.25)');
  emoji(ctx, icon, x, y, 11);
}
