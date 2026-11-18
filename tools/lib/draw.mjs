// Headless drawing for the cold-read tools (tools/shots.mjs, tools/lib/replay.mjs): the game's own renderer on an
// @napi-rs/canvas canvas, with the browser globals it reads stubbed and Math.random (fx particles only) seeded.
//
// @napi-rs/canvas is a native module the game itself doesn't use. It is loaded from the folder named by
// BUSYWORK_CANVAS_DIR (from its node_modules), else from tools/.deps; BUSYWORK_CANVAS_DIR=none says there is no canvas
// (no fallback), so a test sees the same thing on every checkout. One-time setup:
//   npm install --prefix tools/.deps @napi-rs/canvas
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import { updateFx } from '../../src/core/fx.js';
import { FIXED_DT } from '../../src/config.js';
import { noteEndCard } from '../../src/render/shelf.js';

export const TOOLS = fileURLToPath(new URL('..', import.meta.url));
export const DEPS = join(TOOLS, '.deps');
export const SHOTS_DIR = join(TOOLS, '.shots');
export const SETUP = 'npm install --prefix tools/.deps @napi-rs/canvas';
export const W = 1280;
export const H = 800;
export const END_AFTER = 2; // seconds of end card before the picture: the card, icons and route stamps are all in
const MAX_DRAIN_FRAMES = 60 * 60; // from the end of the commands to the end card (the in-world beat is a second or two)
const EMOJI_FONT = '/System/Library/Fonts/Apple Color Emoji.ttc';

let canvasLib = null;
// @napi-rs/canvas, from BUSYWORK_CANVAS_DIR, then tools/.deps. Throws, with the setup line, when neither has it.
export function loadCanvas() {
  if (canvasLib) return canvasLib;
  const set = process.env.BUSYWORK_CANVAS_DIR;
  const dirs = set === 'none' ? [] : [set, DEPS].filter(Boolean);
  for (const d of dirs) {
    try {
      canvasLib = createRequire(join(resolve(d), 'noop.js'))('@napi-rs/canvas');
    } catch {
      continue;
    }
    if (existsSync(EMOJI_FONT)) canvasLib.GlobalFonts.registerFromPath(EMOJI_FONT, 'Apple Color Emoji');
    return canvasLib;
  }
  throw new Error(`@napi-rs/canvas not found in ${dirs.join(' or ') || 'BUSYWORK_CANVAS_DIR=none'}. One-time setup: ${SETUP} (or set BUSYWORK_CANVAS_DIR to a folder whose node_modules has it)`);
}

// A seeded stand-in for Math.random (mulberry32), so particles land the same way every time.
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const nameSeed = (name) => [...name].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);

// Runs fn with the browser globals the renderer reads (window for the size, document for its offscreen layer),
// and Math.random seeded from `seed` (a string), then puts the old ones back.
export function withDom(lib, seed, fn, { w = W, h = H } = {}) {
  const had = { window: globalThis.window, document: globalThis.document, random: Math.random };
  Math.random = seeded(nameSeed(seed));
  globalThis.window = { innerWidth: w, innerHeight: h, devicePixelRatio: 1, addEventListener() {}, removeEventListener() {} };
  globalThis.document = { createElement: () => lib.createCanvas(10, 10) };
  try {
    return fn();
  } finally {
    Math.random = had.random;
    for (const k of ['window', 'document']) {
      if (had[k] === undefined) delete globalThis[k];
      else globalThis[k] = had[k];
    }
  }
}

// After the commands that end a day: plays on to the end card (a catch's beat, the meeting's), and lets it come up
// for END_AFTER seconds, drawing as a player's screen would. h: the harness, r: the renderer.
export function playToEndCard(h, r, what) {
  const g = h.game;
  for (let i = 0; i < MAX_DRAIN_FRAMES && g.phase === 'day'; i++) h.frame();
  if (g.phase !== 'end') throw new Error(`${what}: the day never reached its end card`);
  noteEndCard(g); // its ending goes on the shelf, as main.js does
  r.render(g); // the end card comes up
  for (let s = 0; s < END_AFTER - 1e-9; s += FIXED_DT) {
    g.time += FIXED_DT;
    updateFx(g, FIXED_DT);
  }
}


// What a player sees at normal speed. In the game, bubbles, sightlines, ripples and particles live `ttl` real
// seconds, but pretending (and forced work) runs the sim 6 to 8 times faster than real time. The harness pretends in
// no time at all, so without this a picture taken at 3:29 could show a bubble from 3:24 as if it were a reaction to
// what is on screen now. playerView(game) notes when each of them appears, in sim seconds (game.loopTime): a bubble
// exactly, from its 'say' event; the others at the end of the frame they appear in (call note() after every harness
// frame: its onFrame). draw(fn) runs fn (the renderer) with each one aged by the sim time since it appeared, as at
// normal speed, and the expired ones gone. Once the day is over, the end card's real seconds count too (the sim has
// stopped). The game's own fx are left as they are: the day plays on exactly as it would.
const FX_LISTS = ['bubbles', 'lines', 'ripples', 'particles'];
export function playerView(game) {
  const born = new WeakMap();
  let end = null; // { loop: game.loopTime, time: game.time } when the day ended
  const now = () => (end ? end.loop + (game.time - end.time) : game.loopTime);
  game.events.on('say', () => {
    const b = game.fx.bubbles[game.fx.bubbles.length - 1];
    if (b && !born.has(b)) born.set(b, game.loopTime);
  });
  game.events.on('day:end', () => { end = { loop: game.loopTime, time: game.time }; });
  game.events.on('loop:start', () => { end = null; });
  const note = () => {
    for (const k of FX_LISTS) for (const x of game.fx[k] ?? []) if (!born.has(x)) born.set(x, game.loopTime);
  };
  // How old x looks to a player at normal speed, in seconds.
  const age = (x) => (born.has(x) ? Math.max(0, now() - born.get(x)) : x.age);
  const shown = (list) => (list ?? []).filter((x) => age(x) < x.ttl);
  return {
    note,
    age,
    bubbles: () => shown(game.fx.bubbles), // the game's own bubble objects a player would still see
    draw(fn) {
      note();
      const real = game.fx;
      const fx = { ...real };
      for (const k of FX_LISTS) if (real[k]) fx[k] = shown(real[k]).map((x) => ({ ...x, age: age(x) }));
      game.fx = fx;
      try {
        return fn();
      } finally {
        game.fx = real;
      }
    },
  };
}
