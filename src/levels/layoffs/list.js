// The layoff list: who is on it, as the boss's screen shows it.
//   NAMES        top to bottom: three people from other floors (nobody you meet today) and you, second
//   listFeed     in the world, the list is the engine's little 'monitor' screen (render/world.js PROP_PAINTERS):
//                each name is a figure on it, you the tiny red sweater. A level cannot paint its own furniture,
//                so the drawn faces below are for the end cards only.
//   drawList     the list as a big screen of faces on an end card (end-scenes.js), yours marked in red
import { GAME_MIN_PER_SEC } from '../../config.js';
import { drawPerson, personState } from '../../render/characters.js';
import { rrect, clamp, easeOutCubic } from '../../render/util.js';
import { C } from '../../render/palette.js';

const SKIN = { skin: '#eac09a', skinDark: '#cf9d76', legs: '#3a3946', wide: 1, tall: 1, head: 6.6, bubbleDy: 30, eyeDy: 12 };
export const NAMES = [
  { id: 'dee', color: '#8a6aa8', look: { ...SKIN, body: '#8a6aa8', bodyDark: '#6b4f87', hair: '#c9c4bd', hairStyle: 'bun', torso: 'cardigan', trim: '#efe6d6' } },
  { id: 'player' },
  { id: 'raj', color: '#d6a23a', look: { ...SKIN, skin: '#b9845c', skinDark: '#9a6a46', body: '#d6a23a', bodyDark: '#a97b22', hair: '#1f1a1a', hairStyle: 'tuft', torso: 'sweater', trim: '#f3e6c8' } },
  { id: 'mo', color: '#6f8796', look: { ...SKIN, body: '#6f8796', bodyDark: '#556a78', hair: '#d8b25a', hairStyle: 'spiky', torso: 'hoodie' } },
];
const YOU = 1; // your row

const OUT_SECS = 0.7; // your name drops off the list over this long

// How far your row is on the list right now: 1 on it, 0 gone (the rows below close up in between). Blamed (your
// chair was empty at 3:45), he puts you back on before he sends it.
const BACK_SECS = 0.6;
export function youOnList(w, game) {
  if (w.list === 'on') return 1;
  if (game.outcome?.result === 'blamed') return easeOutCubic(clamp((game.scenario?.beatT ?? 0) / BACK_SECS, 0, 1));
  const secs = ((game.clock?.minute ?? 0) - (w.listOffAt ?? 0)) / GAME_MIN_PER_SEC;
  return 1 - easeOutCubic(clamp(secs / OUT_SECS, 0, 1));
}

// The list going out at 3:45: 0 on his screen .. 1 sent (the in-world beat after the outcome; none if caught).
export function sending(game) {
  const o = game.outcome;
  if (!o || o.result === 'caught') return 0;
  const from = o.result === 'blamed' ? BACK_SECS + 0.1 : 0;
  return clamp(((game.scenario?.beatT ?? 0) - from) / 1.2, 0, 1);
}

// decor.props state for the 'monitor' painter: { feed, blips[{ id, u, v, color }] } (render/world.js drawMonitor).
// Acting up (w.glitch): static. Else a row of figures, yours red; while you edit it yours blinks, then it goes
// and the others close up; at 3:45 they slide off the screen, sent.
const BLIPS = NAMES.map((n) => ({ id: n.id, u: 0, v: 0.45, color: n.color }));
const FEED = { feed: 'live', blips: [] };
export function listFeed(w, game) {
  if (w.glitch) {
    FEED.feed = 'static';
    FEED.blips = [];
    return FEED;
  }
  FEED.feed = 'live';
  const you = youOnList(w, game);
  const editing = game.player?.action?.type === 'strike_name';
  const blink = editing && Math.floor((game.clock?.minute ?? 0) * 6) % 2 === 0;
  const out = sending(game);
  const n = NAMES.length - 1 + you; // slots taken
  const blips = [];
  let slot = 0;
  for (let i = 0; i < NAMES.length; i++) {
    const b = BLIPS[i];
    const k = i === YOU ? you : 1;
    if (k <= 0.02) continue;
    b.u = -0.78 + (1.56 * (slot + 0.5)) / Math.max(n, 1) + out * 2.4;
    slot += k;
    if (b.u > 1 || (i === YOU && (blink || k < 0.5))) continue;
    blips.push(b);
  }
  FEED.blips = blips;
  return FEED;
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
