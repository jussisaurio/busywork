// The layoff list: who is on it, as the boss's screen shows it.
//   NAMES          left to right: three people from other floors (nobody you meet today) and you, second
//   listShown      decor.props state for the boss's computer: { glitch, locked, you, strike, out, looks, pop... }
//   drawListScreen the level's painter for it (presentation.js DECOR.props): a flat screen on his desk, facing the
//                  floor, with the list on it as a row of faces, yours framed in red. Static while his cable is
//                  loose; a padlock while he's in the restroom; at 3:45 the sheet flies off the screen, sent. The
//                  sheet pops out of the screen, big, beside it: when it comes up (Kev or you plugged the cable back
//                  in: your frame throbs), and all the while you edit it (a red line crosses your face, which then
//                  drops out of the row), so anyone looking at his screen sees what you are doing to it.
//   drawList       the same list as a big screen of faces on an end card (end-scenes.js)
import { GAME_MIN_PER_SEC } from '../../config.js';
import { drawPerson, personState } from '../../render/characters.js';
import { T, rrect, clamp, easeOutCubic, hash, fillEllipse, fillCircle } from '../../render/util.js';
import { C } from '../../render/palette.js';

const SKIN = { skin: '#eac09a', skinDark: '#cf9d76', legs: '#3a3946', wide: 1, tall: 1, head: 6.6, bubbleDy: 30, eyeDy: 12 };
export const NAMES = [
  { id: 'dee', color: '#8a6aa8', look: { ...SKIN, body: '#8a6aa8', bodyDark: '#6b4f87', hair: '#c9c4bd', hairStyle: 'bun', torso: 'cardigan', trim: '#efe6d6' } },
  { id: 'player' },
  { id: 'raj', color: '#d6a23a', look: { ...SKIN, skin: '#b9845c', skinDark: '#9a6a46', body: '#d6a23a', bodyDark: '#a97b22', hair: '#1f1a1a', hairStyle: 'tuft', torso: 'sweater', trim: '#f3e6c8' } },
  { id: 'mo', color: '#6f8796', look: { ...SKIN, body: '#6f8796', bodyDark: '#556a78', hair: '#d8b25a', hairStyle: 'spiky', torso: 'hoodie' } },
];
const YOU = 1; // your place on the list

const OUT_DELAY = 0.6; // once the edit is done, your struck face stays this long (seconds) ...
const OUT_SECS = 0.8; // ... then drops off the list over this long

// How far your face is on the list right now: 1 on it, 0 gone (the others close up in between).
export function youOnList(w, game) {
  if (w.list === 'on') return 1;
  const secs = ((game.clock?.minute ?? 0) - (w.listOffAt ?? 0)) / GAME_MIN_PER_SEC - OUT_DELAY;
  return 1 - easeOutCubic(clamp(secs / OUT_SECS, 0, 1));
}

// The list going out at 3:45: 0 on his screen .. 1 sent (the in-world beat after the outcome; none if caught).
export function sending(game) {
  const o = game.outcome;
  if (!o || (o.result === 'caught' && o.why !== 'told')) return 0; // told on: he sends it, then you're out
  return clamp((game.scenario?.beatT ?? 0) / 1.2, 0, 1);
}

// --- in the world: the boss's screen ---------------------------------------------------------------------------

// The sheet popping out of his screen: 'up' when it first comes up (w.listUpAt: cast.js pcFixed, or you fixed it),
// 'edit' while you edit it (it grows out over POP_IN), 'off' once your face is off (w.listOffAt: it is already out,
// so it stays out, then goes back in). k: 0 in the screen .. 1 out at full size; age: seconds into the pop.
const POP_SECS = 2.8;
const POP_OFF_SECS = 2.2; // after the edit: your face drops out (OUT_DELAY + OUT_SECS), then you close the sheet
const POP_IN = 0.25;
const POP_BACK = 0.35;
function popOf(w, game, into) {
  into.pop = null;
  into.popK = 0;
  into.popAge = 0;
  if (w.glitch || w.locked || game.outcome) return;
  const a = game.player?.action;
  if (a?.type === 'strike_name') {
    into.pop = 'edit';
    into.popAge = a.t;
    into.popK = a.t < POP_IN ? easeOutBack(a.t / POP_IN) : 1;
    return;
  }
  const now = game.clock?.minute ?? 0;
  const from = w.list === 'off' ? ['off', w.listOffAt] : w.listUpAt != null ? ['up', w.listUpAt] : null;
  if (!from) return;
  const age = (now - from[1]) / GAME_MIN_PER_SEC + (from[0] === 'off' ? POP_IN : 0);
  const dur = from[0] === 'off' ? POP_OFF_SECS : POP_SECS;
  if (!(age >= 0 && age < dur)) return;
  into.pop = from[0];
  into.popAge = age;
  into.popK = age < POP_IN ? easeOutBack(age / POP_IN) : age > dur - POP_BACK ? 1 - easeOutCubic((age - dur + POP_BACK) / POP_BACK) : 1;
}
const easeOutBack = (x) => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2;

const SHOWN = { glitch: false, locked: false, closed: false, you: 1, strike: 0, out: 0, looks: null, pop: null, popK: 0, popAge: 0 };
export function listShown(w, game) {
  SHOWN.glitch = !!w.glitch;
  SHOWN.locked = !!w.locked && !w.glitch;
  popOf(w, game, SHOWN);
  SHOWN.you = youOnList(w, game);
  // Your edit saved, you close the sheet as the pop goes back in: his screen is back on his email to HR, the sheet
  // attached. Nothing left on it to read across the floor.
  SHOWN.closed = w.list === 'off' && SHOWN.pop !== 'off' && SHOWN.pop !== 'edit';
  const a = game.player?.action;
  SHOWN.strike = a?.type === 'strike_name' ? clamp(a.t / Math.max(a.duration, 0.001), 0, 1) : w.list === 'off' ? 1 : w.struck || 0; // struck: Lin stopped you mid-edit
  SHOWN.out = sending(game);
  SHOWN.looks = game.level.looks;
  return SHOWN;
}

const MON_W = 50; // body, px
const MON_H = 28;

export function drawListScreen(ctx, info, at, shown, t) {
  const cx = at.x * T + T / 2;
  const top = at.y * T - 4; // stands at the back of the desk, the screen to the floor
  const x = Math.round(cx - MON_W / 2);
  fillEllipse(ctx, cx, top + MON_H + 4, 15, 3, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = '#2b2828'; // the stand and its foot
  ctx.fillRect(cx - 3, top + MON_H - 1, 6, 4);
  rrect(ctx, cx - 9, top + MON_H + 2, 18, 3, 1.5);
  ctx.fill();
  ctx.fillStyle = '#34312f'; // the bezel
  rrect(ctx, x, top, MON_W, MON_H, 3);
  ctx.fill();
  const sx = x + 2;
  const sy = top + 2;
  const sw = MON_W - 4;
  const sh = MON_H - 5;
  ctx.save();
  ctx.beginPath();
  ctx.rect(sx, sy, sw, sh);
  ctx.clip();
  if (shown.glitch) {
    const f = Math.floor(t * 14);
    for (let j = 0; j < sh; j += 2) {
      for (let i = 0; i < sw; i += 2) {
        const g = Math.round(70 + 150 * hash(i, j, f));
        ctx.fillStyle = `rgb(${g},${g},${g})`;
        ctx.fillRect(sx + i, sy + j, 2, 2);
      }
    }
  } else {
    ctx.fillStyle = '#2d5a78'; // the desktop behind the sheet
    ctx.fillRect(sx, sy, sw, sh);
    const out = easeOutCubic(shown.out);
    if (out < 1) {
      ctx.save();
      // Sent: the sheet shrinks and flies off to the top right.
      ctx.translate(sx + sw / 2 + out * sw * 0.9, sy + sh / 2 - out * sh * 0.8);
      ctx.scale(1 - 0.6 * out, 1 - 0.6 * out);
      if (shown.closed) drawEmail(ctx, -sw / 2 + 1, -sh / 2 + 1, sw - 2, sh - 2);
      else drawSheet(ctx, -sw / 2 + 1, -sh / 2 + 1, sw - 2, sh - 2, shown, t);
      ctx.restore();
    }
    if (shown.out > 0 && shown.out < 0.8) { // speed lines behind it
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const lx = sx + sw * (0.2 + out * 0.55) - i * 3;
        const ly = sy + sh * (0.75 - out * 0.5) + i * 3;
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx - 7, ly + 3);
      }
      ctx.stroke();
    }
  }
  if (shown.locked) drawLock(ctx, sx, sy, sw, sh);
  ctx.fillStyle = 'rgba(255,255,255,0.10)'; // glare
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + 14, sy);
  ctx.lineTo(sx, sy + 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  fillCircle(ctx, x + MON_W - 4, top + MON_H - 1.6, 0.9, shown.glitch ? '#c0392b' : '#7be08a');
  if (shown.pop && shown.popK > 0) drawPop(ctx, sx, sy, sw, sh, shown, t);
}

// His email to HR, open: a white window, a blue title bar, the address and a line of text, the list attached (a
// little sheet with a red top and a paperclip), and the blue send button.
function drawEmail(ctx, x, y, w, h) {
  ctx.fillStyle = '#f4f2ec';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#3d7ab8';
  ctx.fillRect(x, y, w, 3);
  ctx.fillStyle = '#a7a39a';
  ctx.fillRect(x + 3, y + 5, w * 0.42, 1.4); // to: HR
  ctx.fillStyle = '#cfcbc2';
  ctx.fillRect(x + 3, y + 8.5, w * 0.6, 1.2); // a line of text
  const ax = x + 3; // the attachment: the list, its red top
  const ay = y + h - 9;
  ctx.fillStyle = '#e6e1d6';
  ctx.fillRect(ax - 1, ay - 1, 18, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(ax, ay, 6, 6);
  ctx.fillStyle = C.tomatoDark;
  ctx.fillRect(ax, ay, 6, 1.5);
  ctx.strokeStyle = '#6f6a62'; // the paperclip
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(ax + 9, ay + 5.5);
  ctx.lineTo(ax + 9, ay + 1.5);
  ctx.arc(ax + 10.5, ay + 1.5, 1.5, Math.PI, 0);
  ctx.lineTo(ax + 12, ay + 5);
  ctx.stroke();
  ctx.fillStyle = '#3d7ab8'; // send
  rrect(ctx, x + w - 11, y + h - 7, 9, 5, 1.2);
  ctx.fill();
}

// Locked: the sheet hidden behind a dark lock screen with a padlock in the middle.
function drawLock(ctx, sx, sy, sw, sh) {
  ctx.fillStyle = '#1d2a36';
  ctx.fillRect(sx, sy, sw, sh);
  const cx = sx + sw / 2;
  const cy = sy + sh / 2 + 2;
  ctx.strokeStyle = '#d8d2c4';
  ctx.lineWidth = 2;
  ctx.beginPath(); // the shackle
  ctx.arc(cx, cy - 3, 4, Math.PI, 0);
  ctx.lineTo(cx + 4, cy);
  ctx.moveTo(cx - 4, cy - 3);
  ctx.lineTo(cx - 4, cy);
  ctx.stroke();
  ctx.fillStyle = '#e3c25a'; // the body
  rrect(ctx, cx - 6, cy - 1, 12, 9, 1.5);
  ctx.fill();
  fillCircle(ctx, cx, cy + 3, 1.3, '#5a4a1c');
}

// The sheet out of his screen, big: it grows out of the screen (sx, sy, sw, sh) to POP_ZOOM times its size, beside
// it to the east (over the glass, the meeting room behind), joined to the screen by a pale zoom wedge.
const POP_ZOOM = 2.8;
const POP_DX = 163; // the pop's centre, from the screen's centre
const POP_DY = -8;
function drawPop(ctx, sx, sy, sw, sh, shown, t) {
  const k = shown.popK;
  const z = 1 + (POP_ZOOM - 1) * k;
  const cx = sx + sw / 2 + POP_DX * Math.min(k, 1);
  const cy = sy + sh / 2 + POP_DY * Math.min(k, 1);
  const hw = (sw / 2) * z;
  const hh = (sh / 2) * z;
  ctx.save();
  ctx.globalAlpha = clamp(k * 1.5, 0, 1);
  ctx.fillStyle = 'rgba(244,242,236,0.22)'; // the zoom wedge, from the screen's right edge to the pop's left
  ctx.beginPath();
  ctx.moveTo(sx + sw, sy);
  ctx.lineTo(cx - hw, cy - hh);
  ctx.lineTo(cx - hw, cy + hh);
  ctx.lineTo(sx + sw, sy + sh);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; // shadow, bezel
  ctx.fillRect(cx - hw - 3, cy - hh - 1, hw * 2 + 8, hh * 2 + 8);
  ctx.fillStyle = '#34312f';
  rrect(ctx, cx - hw - 4, cy - hh - 4, hw * 2 + 8, hh * 2 + 8, 4);
  ctx.fill();
  ctx.translate(cx, cy);
  ctx.scale(z, z);
  ctx.beginPath();
  ctx.rect(-sw / 2, -sh / 2, sw, sh);
  ctx.clip();
  ctx.fillStyle = '#2d5a78';
  ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
  const throbs = shown.pop === 'up';
  drawSheet(ctx, -sw / 2 + 1, -sh / 2 + 1, sw - 2, sh - 2, shown, t, throbs ? 0.5 + 0.5 * Math.sin(shown.popAge * 9) : 0);
  ctx.restore();
}

// The list itself, on screen: a white sheet with a red title bar, a face per name in a row, a name line under each,
// yours framed in red. strike: the red line through your face while you edit it (0..1). throb: 0..1, your frame
// swelling (the pop when the list first comes up).
function drawSheet(ctx, x, y, w, h, shown, t, throb = 0) {
  ctx.fillStyle = '#f4f2ec';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C.tomatoDark;
  ctx.fillRect(x, y, w, 3);
  const you = shown.you;
  const n = NAMES.length - 1 + you;
  const slot = (w - 2) / NAMES.length;
  let fx = x + 1 + (w - 2 - slot * n) / 2; // the row stays centred as yours goes
  const face = Math.min(slot - 1, h - 8);
  const fy = y + 4 + face / 2;
  for (let i = 0; i < NAMES.length; i++) {
    const k = i === YOU ? you : 1;
    if (k <= 0.02) continue;
    const mid = fx + (slot * k) / 2;
    fx += slot * k;
    const mine = i === YOU;
    ctx.save();
    if (mine && k < 1) {
      ctx.globalAlpha *= k;
      ctx.translate(mid, (1 - k) * 9); // dropping out of the row, tipping over
      ctx.rotate((1 - k) * 0.5);
      ctx.translate(-mid, 0);
    }
    if (mine) {
      ctx.fillStyle = `rgba(214,72,52,${0.25 + 0.3 * throb})`;
      ctx.fillRect(mid - slot / 2 + 0.5, y + 3.5, slot - 1, h - 4);
      ctx.strokeStyle = C.tomato;
      ctx.lineWidth = 1 + 0.9 * throb;
      ctx.strokeRect(mid - slot / 2 + 0.5, y + 3.5, slot - 1, h - 4);
    }
    drawFace(ctx, mine ? shown.looks.player : NAMES[i].look, mid, fy, face, t);
    ctx.fillStyle = mine ? C.tomato : '#a7a39a';
    ctx.fillRect(mid - slot * 0.32, y + h - 3, slot * 0.64, 1.2); // the name
    if (mine && shown.strike > 0) {
      ctx.strokeStyle = C.tomatoDark;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(mid - slot / 2 + 1, fy + face * 0.35);
      ctx.lineTo(mid - slot / 2 + 1 + (slot - 2) * shown.strike, fy + face * 0.35 - (face * 0.7) * shown.strike);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// --- end cards -----------------------------------------------------------------------------------------------

// A face: head and shoulders of drawPerson, facing out, `size` px tall, centred on (cx, cy).
const FACE = personState();
export function drawFace(ctx, look, cx, cy, size, t = 0) {
  const k = size / 17; // head and shoulders: person y -20 .. -3
  FACE.dir = Math.PI / 2;
  FACE.head = FACE.dir;
  FACE.scale = k;
  FACE.t = t;
  ctx.save();
  ctx.beginPath();
  ctx.rect(cx - size * 0.7, cy - size / 2, size * 1.4, size);
  ctx.clip();
  drawPerson(ctx, look, FACE, cx, cy + 11.5 * k);
  ctx.restore();
}

// The list on a screen face (x, y, w, h): a red title strip, then a face and a name per row; your row is red.
//   you   1 on the list .. 0 gone (rows close up)
//   t     seconds, for the faces
export function drawList(ctx, x, y, w, h, looks, o = {}) {
  const you = o.you ?? 1;
  const t = o.t ?? 0;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = '#f4f2ec';
  ctx.fillRect(x, y, w, h);
  const head = Math.round(h * 0.16);
  ctx.fillStyle = C.tomatoDark;
  ctx.fillRect(x, y, w, head);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(x + 8, y + head / 2 - 1.5, w * 0.34, 3); // the title: a line of white
  const rh = (h - head - 8) / NAMES.length;
  let ry = y + head + 4;
  for (let i = 0; i < NAMES.length; i++) {
    const k = i === YOU ? you : 1;
    if (k <= 0.01) continue;
    const row = ry;
    ry += rh * k;
    ctx.save();
    ctx.globalAlpha = k;
    const mine = i === YOU;
    if (mine) {
      ctx.fillStyle = 'rgba(214,72,52,0.22)';
      rrect(ctx, x + 4, row + 1, w - 8, rh - 2, 4);
      ctx.fill();
      ctx.strokeStyle = C.tomato;
      ctx.lineWidth = 2.5;
      rrect(ctx, x + 4, row + 1, w - 8, rh - 2, 4);
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.07)';
      ctx.fillRect(x + 6, row + rh - 1, w - 12, 1);
    }
    const look = mine ? looks.player : NAMES[i].look;
    drawFace(ctx, look, x + 8 + rh * 0.5, row + rh / 2, rh * 0.86, t);
    ctx.fillStyle = mine ? C.tomato : '#a7a39a';
    const lx = x + 14 + rh;
    ctx.fillRect(lx, row + rh * 0.36, (w - lx + x) * (mine ? 0.62 : 0.5 + 0.08 * i), Math.max(2, rh * 0.13));
    ctx.fillStyle = mine ? 'rgba(214,72,52,0.55)' : '#cfcbc2';
    ctx.fillRect(lx, row + rh * 0.6, (w - lx + x) * 0.34, Math.max(1.5, rh * 0.09));
    ctx.restore();
  }
  ctx.restore();
}
