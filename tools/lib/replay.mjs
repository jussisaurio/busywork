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
import { HUD_H, VIEW_W, glyphScope } from '../../src/render/util.js';
import { drawBubble } from '../../src/render/effects.js';
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
    const faces = []; // every bubble as it came up: { kind, icons, x, y, clock, png } (the faces pass)
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
      const fresh = [];
      for (const b of view.bubbles()) {
        if (seen.has(b) || view.age(b) < Math.min(BUBBLE_AGE, b.ttl / 2)) continue;
        seen.add(b);
        fresh.push(b);
      }
      if (you || sound || lured || fresh.length) snap(game, { you, sound });
      for (const b of fresh) {
        const at = ownerAt(game, b.owner, k);
        faces.push({
          kind: b.kind ?? 'speech', icons: [].concat(b.icons ?? []).map(String), x: at?.x ?? null, y: at?.y ?? null,
          clock: moments[moments.length - 1].clock, png: moments[moments.length - 1].png, solo: soloBubble(lib, b),
        });
      }
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
      faces,
    };
  }, { w, h });
}

// A bubble drawn alone, fully popped in, on a plain ground, SOLO_K times the game's size: no speaker, no room. Called
// right after a frame is drawn, so the level's face and thing painters are the ones the renderer just used.
export const SOLO = { w: 180, h: 100, ax: 90, ay: 92 };
export const SOLO_K = 2.5;
function soloBubble(lib, b) {
  const c = lib.createCanvas(SOLO.w * SOLO_K, SOLO.h * SOLO_K);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#e9e6df';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.scale(SOLO_K, SOLO_K);
  const was = glyphScope('speech');
  try {
    drawBubble(ctx, { ...b, age: 1, ttl: 1e6 }, SOLO.ax, SOLO.ay);
  } finally {
    glyphScope(was);
  }
  return c.toBuffer('image/png');
}

// Every distinct bubble (kind and icons) across runs, first sighting first: [{ kind, icons, solo, png, x, y, clock,
// run, count }]. runs: captureRuns' result.
export function distinctFaces(runs) {
  const out = new Map();
  for (const run of runs) {
    for (const f of run.faces ?? []) {
      const key = `${f.kind}:${f.icons.join(' ')}`;
      if (out.has(key)) out.get(key).count++;
      else out.set(key, { ...f, run: run.dir, count: 1 });
    }
  }
  return [...out.values()];
}

// The last `n` frames of every run (the end card is the last): the outcomes pass. [{ dir, name, expect, outcome, err,
// frames }].
export const OUTCOME_FRAMES = 3;
export function runEnds(runs, n = OUTCOME_FRAMES) {
  return runs.map((r) => ({ ...r, frames: r.frames.slice(-n) }));
}

// Tells: for each thing the player does in a route check (an interaction, a put, sitting down), the picture just
// before and the picture when it is done, side by side, BEFORE on the left. A route depends on each of these state
// changes; the tells pass asks whether a player can see what changed. The same action (its command and what the
// engine says it did) is drawn once, from the first check that does it. At most max pairs.
// Returns [{ file, png, label, check, clock, x, y }].
export const MAX_TELLS = 40;
export const TELL_GAP = 16;
const ACTS = /^\s*(interact|put|sit)\b/i;
export function captureTells(level, checks, { lib = loadCanvas(), w = REPLAY_W, h = REPLAY_H, max = MAX_TELLS } = {}) {
  const out = [];
  const keys = new Set();
  for (const check of checks) {
    if (out.length >= max) break;
    withDom(lib, `tells:${check.name}`, () => {
      const canvas = lib.createCanvas(w, h);
      const k = w / VIEW_W;
      let r = null;
      let harness = null;
      let view = null;
      let open = null; // { c, line, clock, x, y }
      let logAt = 0;
      const draw = (game) => view.draw(() => r.render(game));
      function close(game, label) {
        const t = open;
        open = null;
        const key = `${t.line.trim()} => ${label}`;
        if (keys.has(key) || out.length >= max) return;
        keys.add(key);
        draw(game);
        t.c.getContext('2d').drawImage(canvas, w + TELL_GAP, 0);
        out.push({ file: `${pad2(out.length + 1)}.png`, png: t.c.toBuffer('image/png'), label, check: check.name, clock: t.clock, x: t.x, y: t.y });
      }
      function watch(game) {
        view.note();
        if (!r) return;
        const log = harness.log;
        for (; logAt < log.length; logAt++) {
          const e = log[logAt];
          if (e.name === 'action:done' && open?.c) close(game, `${e.payload?.type ?? 'action'} ${e.payload?.targetId ?? ''}`.trim());
        }
      }
      harness = createHarness({ level, onFrame: watch });
      const g = harness.game;
      view = playerView(g);
      r = createRenderer(canvas, { strict: true });
      harness.begin();
      r.render(g);
      // The BEFORE half is drawn when the player presses E, after any walk the command makes first (sit, put).
      const press = g.input.press.bind(g.input);
      g.input.press = (name, ...rest) => {
        if (name === 'interact' && open && !open.c && g.phase === 'day') {
          draw(g);
          const c = lib.createCanvas(w * 2 + TELL_GAP, h);
          const cx = c.getContext('2d');
          cx.fillStyle = '#ffffff';
          cx.fillRect(0, 0, c.width, h);
          cx.drawImage(canvas, 0, 0);
          const p = g.player;
          Object.assign(open, { c, clock: formatClock(g.clock.minute, g.level.day.start), x: Math.round(p.x * TILE * k), y: Math.round((HUD_H + p.y * TILE) * k) });
        }
        return press(name, ...rest);
      };
      const run = harness.run;
      harness.run = (line) => {
        if (!ACTS.test(line) || g.phase !== 'day') return run(line);
        logAt = harness.log.length;
        open = { c: null, line };
        try {
          const res = run(line);
          // An instant one (sitting down, a drop) has no action:done: the harness's reply says what it did.
          if (open?.c && res.ok && g.phase === 'day' && /^interacted: /.test(res.text)) close(g, res.text.split('\n')[0].replace(/^interacted: /, ''));
          return res;
        } finally {
          open = null;
        }
      };
      playCheck(harness, check);
    }, { w, h });
  }
  return out;
}

// What the tells reader is told about each pair: where the player stands and the clock, never what they did.
export function tellsCaptions(tells) {
  return ['Each picture is one moment, BEFORE on the left and AFTER on the right. The player used something between them.', '',
    ...tells.map((t) => `${t.file}  ${t.clock}. You are at about x ${t.x}, y ${t.y} in each half.`), ''].join('\n');
}

// Where a bubble's owner stands in a picture k times the game's view: a person (by id) or a point ({ x, y } in tiles).
function ownerAt(game, owner, k) {
  const p = typeof owner === 'string' ? (owner === 'player' || owner === game.player?.id ? game.player : findNpc(game, owner)) : owner;
  if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;
  return { x: Math.round(p.x * TILE * k), y: Math.round((HUD_H + p.y * TILE) * k) };
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
