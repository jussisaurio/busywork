// The endings shelf (DESIGN.md "Endings are the collection"): a row of small pictures, one per distinct ending found
// in this level (game/endings.js), along the bottom of the title card and under the end card. Only what was found:
// no blank slots, no count. Each picture is the real end scene drawn small, once, into an offscreen canvas the
// renderer keeps (mem.thumbs); a new one stamps in on the end card that found it.
import { VIEW_W, clamp, easeOutCubic, rrect, glyphScope } from './util.js';
import { C } from './palette.js';
import { TAB } from './tableau.js';
import { sparkle } from './world.js';
import { noteEnding } from '../game/endings.js';
import { endScene } from './screens.js';

const TW = 92; // a picture's size on screen (TAB's shape)
const TH = Math.round((TW * TAB.h) / TAB.w);
const RES = 2; // offscreen pixels per view pixel (sharp on a HiDPI screen)
const PAD = 3;
const GAP = 8;
export const SHELF_Y = 572; // the row's centre line, below the end card and below the title's ▶

// The end card has come up: its ending goes on the shelf (game/endings.js). Not the renderer's job (it never
// writes game state): main.js calls it when a day ends, and the tools that draw end cards do as main.js does.
export function noteEndCard(game) {
  if (game.outcome && game.persist) noteEnding(game, endScene(game.level, game.outcome).key, game.outcome);
}

// The scene of ending e drawn small, or null where there is no offscreen canvas (or the scene is gone).
function thumb(game, e, mem) {
  const cache = (mem.thumbs ??= new Map());
  const id = `${game.level.id}|${e.key}`;
  if (cache.has(id)) return cache.get(id);
  const doc = typeof document !== 'undefined' ? document : null;
  const { scene, known } = endScene(game.level, e.o);
  let c = null;
  if (known && doc && typeof doc.createElement === 'function') {
    c = doc.createElement('canvas');
    c.width = TW * RES;
    c.height = TH * RES;
    const x = c.getContext('2d');
    const k = (TW * RES) / TAB.w;
    x.setTransform(k, 0, 0, (TH * RES) / TAB.h, -TAB.x * k, -TAB.y * ((TH * RES) / TAB.h));
    x.beginPath();
    x.rect(TAB.x, TAB.y, TAB.w, TAB.h);
    x.clip();
    // The scene as its card shows it once the entrance is over. Some scenes read game.outcome: it is this ending's
    // for the draw, then put back.
    const had = game.outcome;
    const was = glyphScope('world');
    game.outcome = e.o;
    try {
      scene.draw(x, game, 2, 4, e.o);
    } finally {
      game.outcome = had;
      glyphScope(was);
    }
  }
  cache.set(id, c);
  return c;
}

// One framed picture centred at (cx, cy): a paper mat, its border teal for a win, tomato for a loss (the end card's).
function frame(ctx, img, win, cx, cy) {
  const w = TW + PAD * 2;
  const h = TH + PAD * 2;
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  rrect(ctx, cx - w / 2 + 2, cy - h / 2 + 3, w, h, 4);
  ctx.fill();
  ctx.fillStyle = C.cream;
  rrect(ctx, cx - w / 2, cy - h / 2, w, h, 4);
  ctx.fill();
  ctx.drawImage(img, cx - TW / 2, cy - TH / 2, TW, TH);
  ctx.strokeStyle = win ? C.teal : C.tomato;
  ctx.lineWidth = 2;
  rrect(ctx, cx - w / 2 + 1, cy - h / 2 + 1, w - 2, h - 2, 3);
  ctx.stroke();
}

// Draws the shelf. stampAt: on the end card, the seconds after it comes up when the new ending (persist.endingNew)
// stamps in, and e the card's age; the title passes neither.
export function drawShelf(ctx, game, mem, { e = Infinity, stampAt = 0, alpha = 1 } = {}) {
  const list = game.persist?.endingsBy?.[game.level.id] ?? []; // read only: the renderer writes no game state
  const shown = [];
  for (const en of list) {
    const img = thumb(game, en, mem);
    if (img) shown.push({ en, img, win: !!endScene(game.level, en.o).scene.win });
  }
  if (!shown.length) return;
  const n = shown.length;
  const cell = TW + PAD * 2;
  const s = Math.min(1, (VIEW_W - 40 + GAP) / (n * (cell + GAP))); // a long shelf shrinks to fit
  const span = n * cell * s + (n - 1) * GAP * s;
  const fresh = game.persist.endingNew;
  ctx.save();
  ctx.globalAlpha *= alpha;
  for (let i = 0; i < n; i++) {
    const { en, img, win } = shown[i];
    const cx = VIEW_W / 2 - span / 2 + (i + 0.5) * cell * s + i * GAP * s;
    const cy = SHELF_Y;
    if (en.key !== fresh || e === Infinity) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(s, s);
      frame(ctx, img, win, 0, 0);
      ctx.restore();
      continue;
    }
    // the new one stamps in, as a found route's slot does
    const se = e - stampAt;
    if (se < 0) continue;
    const k = easeOutCubic(se / 0.18);
    ctx.save();
    ctx.globalAlpha *= clamp(se / 0.08, 0, 1);
    ctx.translate(cx, cy);
    ctx.rotate(-0.15 * (1 - k) - 0.04);
    ctx.scale(s * (2.2 - 1.2 * k), s * (2.2 - 1.2 * k));
    frame(ctx, img, win, 0, 0);
    ctx.restore();
    if (se > 0.16 && se < 0.3) sparkle(ctx, cx + (cell * s) / 2, cy - (TH * s) / 2, 7, '#fff3b0');
  }
  ctx.restore();
}
