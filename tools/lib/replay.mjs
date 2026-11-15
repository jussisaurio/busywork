// Replay strips: each route check of a level (src/levels/<id>/route-checks.js), played through the harness, drawn as
// a strip of frames that nobody chose by hand. The replay cold read (docs/COLD-READ.md) shows them to a fresh reader.
// A frame is drawn when
//   - the player finishes an interaction (a timed one's action:done, or an instant one: the harness's "interacted")
//   - a speech or thought bubble comes up (drawn once it has popped in: BUBBLE_AGE s old, or half its life)
// Every frame shows what a player at normal speed sees at that clock time: a bubble lasts its ttl in game seconds,
// even while the player pretends (tools/lib/draw.mjs playerView).
//   - a noise fires (the 'noise' event), or a lure pulls someone (his override turns to the lure's)
//   - the day ends: the end card, END_AFTER s after it comes up (tools/lib/draw.mjs)
// Moments less than MERGE_SEC after the first of a group share a frame (the last one's), unless that would lose a
// bubble an earlier one showed, or put two of the player's own actions in one frame (each changes what the player
// holds or where things are, and a player sees each one happen). A run
// keeps at most MAX_FRAMES: the end card, every one of the player's own moments, and an even spread of the rest.
//
// Captions say only what the player knows: the clock, "You used the thing here" with where the player stands in the
// picture, a sound (the player hears it), the day's end. Never the interaction's text or icon: the player sees
// neither.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHarness } from '../../src/agent/harness.js';
import { createRenderer } from '../../src/render/renderer.js';
import { findNpc } from '../../src/game/perception.js';
import { formatClock } from '../../src/config.js';
import { HUD_H, VIEW_W } from '../../src/render/util.js';
import { loadCanvas, withDom, playToEndCard, playerView } from './draw.mjs';
import { playCheck } from './route-ctx.mjs';

export const REPLAY_W = 960; // the game's own logical view: half the pixels of a shot, so a dozen runs fit one reader
export const REPLAY_H = 600;
export const MAX_FRAMES = 20;
export const MERGE_SEC = 0.75;
// A bubble pops in over 0.18 s (src/render/effects.js). Drawn as soon as it has (in game seconds): the next bubble from
// the same person can replace it soon after it came up.
export const BUBBLE_AGE = 0.18;
const TILE = 32;

const pad2 = (n) => String(n).padStart(2, '0');
export const runDir = (i) => `run-${pad2(i + 1)}`;
export const frameFile = (i) => `${pad2(i + 1)}.png`;

// Keeps at most max moments: the last (the end card), every 'you' moment, then an even spread of the others.
export function thin(moments, max = MAX_FRAMES) {
  if (moments.length <= max) return moments;
  const last = moments[moments.length - 1];
  const rest = moments.slice(0, -1);
  const mine = rest.filter((m) => m.you.length);
  const other = rest.filter((m) => !m.you.length);
  let keep;
  if (mine.length >= max - 1) keep = spread(mine, max - 1);
  else keep = [...mine, ...spread(other, max - 1 - mine.length)];
  const set = new Set(keep);
  return [...rest.filter((m) => set.has(m)), last];
}
function spread(list, n) {
  if (n <= 0) return [];
  if (list.length <= n) return list;
  return Array.from({ length: n }, (_, k) => list[Math.round(((k + 0.5) * list.length) / n - 0.5)]);
}

// One caption line for a moment.
export function caption(m) {
  const bits = [`${m.clock}.`];
  for (const y of m.you) bits.push(`You used the thing here (you are at about x ${y.x}, y ${y.y} in the picture).`);
  if (m.sound) bits.push('You hear a sound.');
  if (m.end) bits.push('The day is over.');
  return bits.join(' ');
}

// Plays check (a route-checks.js entry) on level and draws its strip. Returns
// { frames: [{ file, png, caption }], outcome, err, total } (total: moments before thinning).
export function captureRun(level, check, { lib = loadCanvas(), w = REPLAY_W, h = REPLAY_H, max = MAX_FRAMES } = {}) {
  return withDom(lib, check.name, () => {
    const canvas = lib.createCanvas(w, h);
    const k = w / VIEW_W;
    let r = null;
    let harness = null;
    let view = null; // what a player at normal speed sees
    const moments = [];
    const seen = new WeakSet(); // bubbles already drawn
    const lureWas = new Map();
    let logAt = 0;

    function snap(game, what) {
      const p = game.player;
      const m = {
        t: game.time,
        t0: game.time, // when the moments merged into this frame began
        clock: formatClock(game.clock.minute, game.level.day.start),
        you: what.you ? [{ x: Math.round(p.x * TILE * k), y: Math.round((HUD_H + p.y * TILE) * k) }] : [],
        sound: !!what.sound,
        end: !!what.end,
        bubbles: new Set(view.bubbles()),
      };
      view.draw(() => r.render(game));
      m.png = canvas.toBuffer('image/png');
      const prev = moments[moments.length - 1];
      const alive = m.bubbles;
      const twoActions = prev?.you.length && m.you.length;
      if (prev && !prev.end && !m.end && !twoActions && m.t - prev.t0 < MERGE_SEC && [...prev.bubbles].every((b) => alive.has(b))) {
        m.t0 = prev.t0;
        m.you = [...prev.you, ...m.you];
        m.sound ||= prev.sound;
        moments[moments.length - 1] = m;
      } else moments.push(m);
    }

    function watch(game) {
      view.note();
      if (!r) return;
      const log = harness.log;
      let you = false;
      let sound = false;
      for (; logAt < log.length; logAt++) {
        const n = log[logAt].name;
        if (n === 'action:done') you = true;
        if (n === 'noise') sound = true;
      }
      let lured = false;
      for (const lure of game.level.lures ?? []) {
        const npc = findNpc(game, lure.npc);
        const on = !!npc && npc.override === lure.override;
        if (on && !lureWas.get(lure)) lured = true;
        lureWas.set(lure, on);
      }
      let bubble = false;
      for (const b of view.bubbles()) {
        if (seen.has(b) || view.age(b) < Math.min(BUBBLE_AGE, b.ttl / 2)) continue;
        seen.add(b);
        bubble = true;
      }
      if (you || sound || lured || bubble) snap(game, { you, sound });
    }

    harness = createHarness({ level, onFrame: watch });
    const g = harness.game;
    view = playerView(g);
    r = createRenderer(canvas, { strict: true });
    harness.begin();
    r.render(g); // the renderer sees the day start
    // An instant interaction (sitting down, a drop) has no action:done: the harness's own word for it is "interacted".
    const run = harness.run;
    harness.run = (line) => {
      const res = run(line);
      if (res.ok && /(^|\n)interacted: /.test(res.text) && g.phase === 'day') snap(g, { you: true });
      return res;
    };
    const { err } = playCheck(harness, check);
    playToEndCard(harness, r, `replay '${check.name}'`);
    snap(g, { end: true });
    const kept = thin(moments, max);
    return {
      frames: kept.map((m, i) => ({ file: frameFile(i), png: m.png, caption: caption(m) })),
      outcome: g.outcome ?? null,
      err: err ? err.message : null,
      total: moments.length,
    };
  }, { w, h });
}

// The captions file of one run: the frames in order, one line each.
export function captionsText(n, run) {
  const head = `Run ${n}: ${run.frames.length} pictures, in order. The time in each line is the in-game clock.` +
    (run.total > run.frames.length ? ' Some moments in between are not shown.' : '');
  return [head, '', ...run.frames.map((f) => `${f.file}  ${f.caption}`), ''].join('\n');
}

// Every check of the level, captured. checks: the route-checks list. Returns [{ dir, name, expect, ...captureRun }].
export function captureRuns(level, checks, opts = {}) {
  return checks.map((c, i) => ({ dir: runDir(i), name: c.name, expect: c.expect, ...captureRun(level, c, opts) }));
}

// Writes captured runs under dir: run-NN/NN.png and run-NN/captions.md, plus runs.md (which check each run is: for
// people, never for the step 1 reader). Clears what a previous capture left there.
export function writeRuns(runs, dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  runs.forEach((run, i) => {
    const d = join(dir, run.dir);
    mkdirSync(d);
    for (const f of run.frames) writeFileSync(join(d, f.file), f.png);
    writeFileSync(join(d, 'captions.md'), captionsText(i + 1, run));
  });
  writeFileSync(join(dir, 'runs.md'), runsIndex(runs));
  return dir;
}

// Which check each run is, with its expected and actual outcome.
export function runsIndex(runs) {
  const out = (o) => (o ? `${o.result}${o.routes?.length ? ` via ${o.routes.join(' + ')}` : ''}` : 'no outcome');
  return runs.map((run, i) => `- Run ${i + 1} (${run.dir}): "${run.name}". Expected: ${run.expect?.result ?? '?'}. Ended: ${out(run.outcome)}.${run.err ? ` (The check failed: ${run.err})` : ''}`).join('\n') + '\n';
}
