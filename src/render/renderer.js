// Renderer entry point. createRenderer(canvas) -> { render(game) }.
// Owns canvas sizing (fit-to-window, HiDPI), caches the static office in an offscreen
// canvas and composes world, HUD and screens. Never mutates game state: the only memory
// it keeps (screen start times, the end-beat zoom, the day-start ping) lives in this closure.
import { T, HUD_H, PLAY_W, PLAY_H, VIEW_W, VIEW_H, clamp, fin, easeOutCubic } from './util.js';
import { C } from './palette.js';
import { drawStaticLayer, drawWorldDynamic } from './world.js';
import { drawCharacters } from './characters.js';
import { drawCones } from './cones.js';
import { drawDarkness } from './darkness.js';
import {
  drawBubbles, drawParticles, drawSightlines, drawFocusHint, drawActionRing, drawSuspicion, drawLoopStamp, drawVignette,
} from './effects.js';
import { drawHud } from './hud.js';
import { drawTitle, drawEnd } from './screens.js';
import { findNpc } from '../game/perception.js';

export function createRenderer(canvas, opts = {}) {
  const strict = !!opts.strict;
  const ctx = canvas.getContext('2d');
  const win = typeof window !== 'undefined' ? window : null;
  let kx = 1;
  let ky = 1;
  let lastW = -1;
  let lastH = -1;
  let lastDpr = -1;
  let layer = null;
  let layerK = -1;
  let layerMap = null;
  const mem = {
    titleStart: 0, endStart: 0, endOutcome: null, beatStart: -1, beatFocusX: 0, beatFocusY: 0,
    lastPhase: null, errors: 0, dayStart: -10, dayPhase: null, lastMinute: 0,
  };

  function fit() {
    const iw = win ? fin(win.innerWidth, VIEW_W) : VIEW_W;
    const ih = win ? fin(win.innerHeight, VIEW_H) : VIEW_H;
    const dpr = win ? clamp(fin(win.devicePixelRatio, 1) || 1, 0.5, 4) : 1;
    if (iw === lastW && ih === lastH && dpr === lastDpr) return;
    lastW = iw;
    lastH = ih;
    lastDpr = dpr;
    const scale = Math.max(0.05, Math.min(iw / VIEW_W, ih / VIEW_H));
    const cssW = Math.max(1, Math.floor(VIEW_W * scale));
    const cssH = Math.max(1, Math.floor(VIEW_H * scale));
    if (canvas.style) {
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    }
    const bw = Math.max(1, Math.round(cssW * dpr));
    const bh = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width !== bw) canvas.width = bw;
    if (canvas.height !== bh) canvas.height = bh;
    kx = bw / VIEW_W;
    ky = bh / VIEW_H;
  }
  if (win && typeof win.addEventListener === 'function') {
    win.addEventListener('resize', () => {
      lastW = -1;
    });
  }

  function ensureLayer(map, level) {
    const k = kx;
    if (layer && layerK === k && layerMap === map) return;
    const doc = typeof document !== 'undefined' ? document : null;
    if (!doc || typeof doc.createElement !== 'function') {
      layer = null;
      return;
    }
    if (!layer) layer = doc.createElement('canvas');
    const mw = map.w * T;
    const mh = map.h * T;
    layer.width = Math.max(1, Math.round(mw * k));
    layer.height = Math.max(1, Math.round(mh * ky));
    const lc = layer.getContext('2d');
    lc.setTransform(layer.width / mw, 0, 0, layer.height / mh, 0, 0);
    drawStaticLayer(lc, map, level);
    layerK = k;
    layerMap = map;
  }

  // Renderer-local bookkeeping (not gameplay state).
  function track(game, t) {
    if (game.phase !== mem.lastPhase) {
      if (game.phase === 'title') mem.titleStart = t;
      if (game.phase === 'end') {
        mem.endStart = t;
        mem.endOutcome = game.outcome;
      }
      mem.lastPhase = game.phase;
    }
    if (game.phase === 'end' && game.outcome !== mem.endOutcome) {
      mem.endStart = t;
      mem.endOutcome = game.outcome;
    }
    const minute = game.clock ? fin(game.clock.minute) : 0;
    // A new day: entering 'day', or the clock jumping back (R restarts without leaving 'day').
    if (game.phase === 'day' && (mem.dayPhase !== 'day' || minute < mem.lastMinute - 0.001)) mem.dayStart = t;
    mem.dayPhase = game.phase;
    mem.lastMinute = minute;
    const beat = game.phase === 'day' && (!!game.caught || minute >= game.level.day.meetingAt);
    if (beat && mem.beatStart < 0) mem.beatStart = t;
    else if (!beat) mem.beatStart = -1;
  }

  function drawWorld(game, t, title) {
    const map = game.map;
    const mw = map ? map.w * T : PLAY_W;
    const mh = map ? map.h * T : PLAY_H;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, HUD_H, PLAY_W, PLAY_H);
    ctx.clip();
    ctx.translate(0, HUD_H);

    let beatK = 0;
    if (mem.beatStart >= 0) {
      beatK = easeOutCubic((t - mem.beatStart) / 0.8);
      const p = game.player;
      let fx = p ? fin(p.x) * T : mw / 2;
      let fy = p ? fin(p.y) * T : mh / 2;
      const by = game.caught && game.npcs && findNpc(game, game.caught.by);
      if (by && by.active) {
        fx = (fx + fin(by.x) * T) / 2;
        fy = (fy + fin(by.y) * T) / 2;
      }
      fx = clamp(fx, 0, mw);
      fy = clamp(fy, 0, mh);
      const z = 1 + 0.06 * beatK;
      ctx.translate(fx, fy);
      ctx.scale(z, z);
      ctx.translate(-fx, -fy);
    }
    const sh = game.fx && game.fx.shake;
    if (sh && fin(sh.t) > 0 && fin(sh.amount) > 0) {
      const a = fin(sh.amount) * T * Math.min(1, fin(sh.t) / 0.3);
      ctx.translate(Math.sin(t * 91) * a, Math.cos(t * 73) * a);
    }

    if (map) {
      if (layer) ctx.drawImage(layer, 0, 0, mw, mh);
      else drawStaticLayer(ctx, map, game.level);
      drawWorldDynamic(ctx, game, t);
    }
    if (!title && game.phase === 'day') drawCones(ctx, game, t);
    drawCharacters(ctx, game, t, mem);
    if (game.level?.darkness) drawDarkness(ctx, game, t); // dark rooms (game/darkness.js)
    if (!title) {
      drawParticles(ctx, game, t);
      drawSightlines(ctx, game, t); // above people, below the bubbles
      drawActionRing(ctx, game, t);
      drawSuspicion(ctx, game, t);
      drawFocusHint(ctx, game, t);
      drawBubbles(ctx, game);
    }
    ctx.restore();
    if (beatK > 0) drawVignette(ctx, beatK, 0, HUD_H, PLAY_W, PLAY_H);
  }

  function frame(game) {
    fit();
    const t = fin(game.time);
    track(game, t);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(kx, 0, 0, ky, 0, 0);
    ctx.imageSmoothingEnabled = true;
    if (game.map) ensureLayer(game.map, game.level);

    if (game.phase === 'title') {
      drawWorld(game, t, true);
      drawTitle(ctx, game, t, mem);
      return;
    }
    drawWorld(game, t, false);
    drawHud(ctx, game, t, mem);
    if (game.phase === 'end') drawEnd(ctx, game, t, mem);
    else drawLoopStamp(ctx, game, PLAY_W / 2, HUD_H + PLAY_H / 2 - 40);
  }

  function render(game) {
    if (!game) return;
    try {
      frame(game);
    } catch (err) {
      if (strict) throw err;
      // A throw here would stop main.js's requestAnimationFrame chain: log once, unwind, keep going.
      if (mem.errors++ === 0 && typeof console !== 'undefined') console.error('[render]', err);
      for (let i = 0; i < 32; i++) ctx.restore();
    }
  }

  return { render };
}
