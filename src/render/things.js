// Things: objects drawn at icon size, so nothing in the world is an emoji (DESIGN.md "Visual language").
// A glyph '#<name>' in any icon slot (render/util.js emoji: a dropped item, a hand, a pose's item, the HUD's hand
// slot, a person in an end scene, a bubble if a level wants one) draws the thing called <name>, found in order:
//   1. level.items[<name>].draw   the item's look: an engine thing's name, or a painter function of the level's
//   2. level.decor.things[<name>] the level's other things: an engine thing's name, or a painter function
//   3. THINGS[<name>]             the engine's things, below
// A painter is (ctx, x, y, size, t, game, opts): draw centred on (x, y), about `size` px tall like an emoji of that
// size (a held item is 12-13 px, a dropped one 14, the HUD's hand slot 24); t is game time in seconds. The caller
// saves and restores around it. opts:
//   held   true when a hand holds it (a person's, on the map or in an end scene): a laptop may be shut, a cup tilted
//   tint   the item's `tint`: a colour, or the owner's clothes colour with tint: 'owner' (items[name].owner.id),
//          so same-kind things show whose they are; null when the item has none
//   type   the item type, or null for a thing that is not an item
// A name nothing draws shows as text (and is a world emoji in a migrated level: the runtime check catches it).
// End scenes and level painters call drawThing(ctx, game, name, x, y, size, held) directly; box() sets up the
// 16 px design box the engine's painters draw in.
import { setThingPainter, fillCircle, fillEllipse, ellipse, rrect, drawPaper, fin } from './util.js';
import { C } from './palette.js';
import { lookFor } from './characters.js';

// Every painter below draws in a 16 px box centred on the origin; this sets that up. Level painters may use it too.
export function box(ctx, x, y, size) {
  const k = fin(size, 16) / 16;
  ctx.translate(fin(x), fin(y));
  ctx.scale(k, k);
}

// A cup's body, saucer-less: white china, a handle on the right, its rim at y = -3.
function cupBody(ctx) {
  fillEllipse(ctx, 0.5, 6.6, 6, 1.6, 'rgba(25,15,8,0.22)');
  ctx.strokeStyle = '#ddd5c6';
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.arc(5.2, 1.2, 2.5, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = '#f6f2ea';
  ctx.beginPath();
  ctx.moveTo(-5, -3);
  ctx.lineTo(5, -3);
  ctx.lineTo(4, 6);
  ctx.quadraticCurveTo(0, 7.4, -4, 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(120,100,80,0.18)'; // shade on the far side
  ctx.beginPath();
  ctx.moveTo(2.6, -3);
  ctx.lineTo(5, -3);
  ctx.lineTo(4, 6);
  ctx.lineTo(2.2, 6.6);
  ctx.closePath();
  ctx.fill();
  fillEllipse(ctx, 0, -3, 5, 1.8, '#e6dfd2');
}

export const THINGS = {
  // A full cup of coffee, steaming.
  cup(ctx, x, y, size, t) {
    box(ctx, x, y, size);
    cupBody(ctx);
    fillEllipse(ctx, 0, -3, 4.1, 1.3, '#6b3f1d');
    fillEllipse(ctx, -1.2, -3.3, 1.4, 0.45, '#9a6a40');
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.1;
    ctx.lineCap = 'round';
    for (let i = 0; i < 2; i++) {
      const ph = (fin(t) * 0.7 + i * 0.5) % 1;
      const sx = -1.6 + i * 3;
      ctx.globalAlpha = 0.75 * (1 - ph);
      ctx.beginPath();
      ctx.moveTo(sx, -5 - ph * 3);
      ctx.quadraticCurveTo(sx + 1.6, -7 - ph * 3, sx, -9 - ph * 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  },
  // An empty cup: pale inside, a dried ring at the bottom, a brown drip down its side.
  mug(ctx, x, y, size) {
    box(ctx, x, y, size);
    cupBody(ctx);
    fillEllipse(ctx, 0, -3, 4.1, 1.3, '#d6cbb9');
    ctx.strokeStyle = 'rgba(120,72,34,0.75)';
    ctx.lineWidth = 0.6;
    ellipse(ctx, 0, -2.8, 2.6, 0.8);
    ctx.stroke();
    ctx.strokeStyle = '#8a5a32';
    ctx.lineWidth = 1.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-2.6, -1.8);
    ctx.quadraticCurveTo(-2.9, 0.5, -2.4, 2.4);
    ctx.stroke();
    fillCircle(ctx, -2.4, 2.6, 0.75, '#8a5a32');
  },
  // An ID card on a lanyard: photo, name lines, chip.
  card(ctx, x, y, size, t) {
    box(ctx, x, y, size);
    ctx.strokeStyle = C.teal;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-3.6, -8.2);
    ctx.lineTo(-0.6, -4);
    ctx.moveTo(3.6, -8.2);
    ctx.lineTo(0.6, -4);
    ctx.stroke();
    ctx.fillStyle = '#9a958c';
    ctx.fillRect(-1.2, -4.8, 2.4, 2);
    ctx.fillStyle = 'rgba(25,15,8,0.25)';
    rrect(ctx, -4.1, -2.6, 9.2, 11.6, 1.2);
    ctx.fill();
    ctx.fillStyle = C.white;
    rrect(ctx, -4.6, -3.2, 9.2, 11.6, 1.2);
    ctx.fill();
    ctx.fillStyle = C.teal;
    ctx.fillRect(-4.6, -3.2, 9.2, 2.6);
    ctx.fillStyle = '#b9cfd8';
    ctx.fillRect(-3.4, 0.4, 3.6, 4.2);
    fillCircle(ctx, -1.6, 1.8, 1.05, '#c99872');
    fillEllipse(ctx, -1.6, 4.4, 1.6, 1, '#55627a');
    ctx.fillStyle = 'rgba(40,30,20,0.55)';
    ctx.fillRect(1.1, 1, 2.6, 0.7);
    ctx.fillRect(1.1, 2.7, 2, 0.7);
    ctx.fillStyle = '#c9a43a';
    ctx.fillRect(-3.4, 5.8, 2.8, 1.8);
    if (fin(t) % 2.6 < 0.25) fillCircle(ctx, 3.4, -1.6, 0.9, 'rgba(255,255,255,0.9)');
  },
  // A spanner, held diagonally.
  wrench(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.rotate(-0.7);
    ctx.fillStyle = '#6d757c';
    rrect(ctx, -7.4, -1.6, 11, 3.2, 1.4);
    ctx.fill();
    ctx.fillStyle = '#a9b1b8';
    rrect(ctx, -7.4, -1.6, 11, 2.2, 1.1);
    ctx.fill();
    ctx.fillStyle = '#8c949b';
    ctx.beginPath();
    ctx.arc(5, 0, 3.8, 0.7, Math.PI * 2 - 0.7);
    ctx.arc(5, 0, 1.5, Math.PI * 2 - 0.9, 0.9, true);
    ctx.closePath();
    ctx.fill();
    fillCircle(ctx, -6, 0, 0.8, '#4b5258');
  },
  // A lit cigarette.
  cigarette(ctx, x, y, size, t) {
    box(ctx, x, y, size);
    ctx.rotate(-0.35);
    ctx.fillStyle = '#f4f1ea';
    rrect(ctx, -6, -1.1, 9.5, 2.2, 0.8);
    ctx.fill();
    ctx.fillStyle = '#d98c3a';
    rrect(ctx, 3, -1.1, 3.4, 2.2, 0.8);
    ctx.fill();
    ctx.fillStyle = '#8a8580';
    ctx.fillRect(-6.8, -1, 1.2, 2);
    fillCircle(ctx, -7.1, 0, 1.15, '#ff6a2a');
    ctx.globalAlpha = 0.35 + 0.25 * Math.sin(fin(t) * 5);
    fillCircle(ctx, -7.1, 0, 2.2, '#ffb36b');
    ctx.globalAlpha = 1;
  },
  // A sheet of paper.
  paper(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.rotate(-0.08);
    ctx.fillStyle = 'rgba(25,15,8,0.2)';
    ctx.fillRect(-4.2, -5.6, 10, 13);
    ctx.scale(1.6, 1.6);
    drawPaper(ctx, 6, 8, 3);
  },
  // A yellow notepad page with writing on it.
  note(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.rotate(0.1);
    ctx.fillStyle = 'rgba(25,15,8,0.2)';
    ctx.fillRect(-4.4, -4.4, 10, 10);
    ctx.fillStyle = '#f6e27a';
    ctx.fillRect(-5, -5, 10, 10);
    ctx.fillStyle = '#e2c64a';
    ctx.fillRect(-5, -5, 10, 1.8);
    ctx.fillStyle = 'rgba(60,50,90,0.75)';
    ctx.fillRect(-3.6, -1.4, 7, 0.8);
    ctx.fillRect(-3.6, 0.8, 6, 0.8);
    ctx.fillRect(-3.6, 3, 4, 0.8);
  },
  // A laptop: open on a desk or the floor; shut and hanging from the hand when held. A tint colours its lid.
  laptop(ctx, x, y, size, t, game, opts) {
    box(ctx, x, y, size);
    const lid = opts?.tint || '#3b3f46';
    if (opts?.held) {
      ctx.rotate(0.12);
      ctx.fillStyle = '#8e939a';
      rrect(ctx, -6.5, -4.2, 13, 9.6, 1.4);
      ctx.fill();
      ctx.fillStyle = lid;
      rrect(ctx, -6.5, -4.6, 13, 9, 1.4);
      ctx.fill();
      fillCircle(ctx, 0, -0.2, 1.3, 'rgba(255,255,255,0.7)');
      return;
    }
    fillEllipse(ctx, 0.5, 7.2, 7.5, 1.4, 'rgba(25,15,8,0.22)');
    ctx.fillStyle = lid;
    rrect(ctx, -6.2, -7, 12.4, 9.4, 1.2);
    ctx.fill();
    ctx.fillStyle = '#7fb3c8';
    ctx.fillRect(-5.1, -6, 10.2, 7.2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(-5.1, -6, 10.2, 1.6);
    ctx.fillStyle = '#b8bcc2';
    ctx.beginPath();
    ctx.moveTo(-6.2, 2.4);
    ctx.lineTo(6.2, 2.4);
    ctx.lineTo(7.6, 6.6);
    ctx.lineTo(-7.6, 6.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#8e939a';
    ctx.fillRect(-5, 3.2, 10, 2);
  },
  // A clipboard with a sheet on it.
  clipboard(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.rotate(-0.06);
    ctx.fillStyle = 'rgba(25,15,8,0.22)';
    rrect(ctx, -5, -6.4, 11, 14, 1.2);
    ctx.fill();
    ctx.fillStyle = '#9a6a3c';
    rrect(ctx, -5.5, -7, 11, 14, 1.2);
    ctx.fill();
    ctx.fillStyle = C.white;
    ctx.fillRect(-4.2, -4.6, 8.4, 10.6);
    ctx.fillStyle = 'rgba(40,30,20,0.55)';
    for (let i = 0; i < 4; i++) ctx.fillRect(-3, -2.6 + i * 2.2, i === 3 ? 3.6 : 6, 0.7);
    ctx.fillStyle = '#b9bcc1';
    rrect(ctx, -2.6, -8, 5.2, 2.6, 0.8);
    ctx.fill();
  },
  // A potted plant.
  plant(ctx, x, y, size) {
    box(ctx, x, y, size);
    const leaf = (lx, ly, rx, ry, rot, col) => {
      ctx.fillStyle = col;
      ellipse(ctx, lx, ly, rx, ry, rot);
      ctx.fill();
    };
    leaf(-3.4, -2.6, 1.8, 4.4, -0.8, '#4a8a3c');
    leaf(3.4, -2.6, 1.8, 4.4, 0.8, '#4a8a3c');
    leaf(0, -4.6, 2, 5, 0, '#5c9a4a');
    leaf(-1.6, -5.6, 1.3, 3.4, -0.35, '#6aaa56');
    ctx.fillStyle = '#b55f33';
    ctx.beginPath();
    ctx.moveTo(-4, 1.2);
    ctx.lineTo(4, 1.2);
    ctx.lineTo(3, 7);
    ctx.lineTo(-3, 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d27a48';
    rrect(ctx, -4.6, 0, 9.2, 2.2, 0.6);
    ctx.fill();
  },
  // A wall clock face at four o'clock (the 🕓 it replaces).
  clock(ctx, x, y, size) {
    drawClock(ctx, x, y, size);
  },
  // A loudspeaker with a line through it (sound off).
  muted(ctx, x, y, size) {
    box(ctx, x, y, size);
    ctx.fillStyle = '#efe6d2';
    ctx.beginPath();
    ctx.moveTo(-6, -2.4);
    ctx.lineTo(-3, -2.4);
    ctx.lineTo(1.4, -6.2);
    ctx.lineTo(1.4, 6.2);
    ctx.lineTo(-3, 2.4);
    ctx.lineTo(-6, 2.4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d23a2a';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(3.4, -3.4);
    ctx.lineTo(7.4, 3.4);
    ctx.moveTo(7.4, -3.4);
    ctx.lineTo(3.4, 3.4);
    ctx.stroke();
  },
};

// A wall clock face centred on (x, y), about `size` px tall, its hands at `minute` minutes past three (60: four
// o'clock). Leaves the transform moved: save and restore around it.
export function drawClock(ctx, x, y, size, minute = 60) {
  box(ctx, x, y, size);
  fillCircle(ctx, 0.4, 0.6, 7.6, 'rgba(25,15,8,0.25)');
  fillCircle(ctx, 0, 0, 7.6, '#3a2c22');
  fillCircle(ctx, 0, 0, 6.3, C.cream);
  ctx.fillStyle = C.ink;
  for (let i = 0; i < 12; i += 3) {
    const a = (i / 12) * Math.PI * 2;
    ctx.fillRect(Math.sin(a) * 5.2 - 0.5, -Math.cos(a) * 5.2 - 0.5, 1, 1);
  }
  ctx.lineCap = 'round';
  const hand = (a, len, w, col) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.sin(a) * len, -Math.cos(a) * len);
    ctx.stroke();
  };
  hand((((3 + minute / 60) % 12) / 12) * Math.PI * 2, 3.4, 1.5, C.ink);
  hand((minute / 60) * Math.PI * 2, 5, 1, C.tomatoDark);
  fillCircle(ctx, 0, 0, 0.9, C.ink);
}

// The painter that draws `name` in this level (the lookup order above), or null.
export function thingFor(level, name) {
  const paint = (d) => (typeof d === 'function' ? d : typeof d === 'string' && Object.hasOwn(THINGS, d) ? THINGS[d] : null);
  const it = level?.items && Object.hasOwn(level.items, name) ? level.items[name] : null;
  if (it && it.draw !== undefined) return paint(it.draw);
  const own = level?.decor?.things;
  if (own && Object.hasOwn(own, name)) return paint(own[name]);
  return Object.hasOwn(THINGS, name) ? THINGS[name] : null;
}

// The colour item `type` is tinted (its `tint`; 'owner': its owner's clothes), or null.
export function tintOf(game, type) {
  const level = game?.level;
  const it = level?.items && Object.hasOwn(level.items, type) ? level.items[type] : null;
  if (!it || !it.tint) return null;
  if (it.tint !== 'owner') return it.tint;
  const id = it.owner?.id;
  if (!id) return null;
  const who = (game.npcs || []).find((n) => n && n.id === id) || (level.cast || []).find((d) => d && d.id === id);
  return lookFor(level.looks, id, who?.color).body || null;
}

// Draws thing `name` of the game's level centred on (x, y), about `size` px tall (held: in a hand); false if
// nothing draws it.
export function drawThing(ctx, game, name, x, y, size, held = false) {
  const fn = thingFor(game?.level, name);
  if (!fn) return false;
  const isItem = !!game?.level?.items && Object.hasOwn(game.level.items, name);
  const opts = { held: !!held, tint: isItem ? tintOf(game, name) : null, type: isItem ? name : null };
  ctx.save();
  fn(ctx, x, y, size, fin(game?.time), game, opts);
  ctx.restore();
  return true;
}

// The renderer calls useThings(game) every frame, so '#<name>' glyphs find the level's things.
let thingGame = null;
export function useThings(game) {
  thingGame = game || null;
}
setThingPainter((ctx, name, x, y, size, how) => drawThing(ctx, thingGame, name, x, y, size, !!how?.held));
