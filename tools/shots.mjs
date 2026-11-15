#!/usr/bin/env node
// Shots: a level's screenshots for its cold read (docs/COLD-READ.md). src/levels/<id>/shots.js lists them, each
// { name, cmds, intent, beat? }. Each shot is a fresh day: its harness commands (src/agent/harness.js) run from the
// start of the day, then one frame is drawn at 1280 x 800, what a player's window shows. A shot whose commands end the
// day (a catch, or the deadline) draws the end card as it looks END_AFTER seconds after it comes up, its entrance done.
// A shot with `beat` draws a beat instead of its end card: the moment a player sees between a catch, or the
// deadline's outcome, and the end card. The harness can't stop in one: the player is locked, so a command that
// starts in a beat runs it out to the end of the day. `beat: <s>` runs on from where the commands stopped, into the
// beat that is up or comes up next (within BEAT_WAIT seconds), and draws it s seconds old: { cmds: ['pretend until
// 5:00'], beat: 0.8 } draws the deadline's beat (END_BEAT, about 2 s: src/play/scenario.js) 0.8 s in. `beat: true` is
// a catch's beat BEAT_AT seconds in (the alert up, the shake over), or the deadline's beat as the commands left it.
// Bubbles, sightlines and ripples are drawn as a player at normal speed sees them at that clock time, even after the
// commands pretend (tools/lib/draw.mjs playerView).
//
// Each shot reports the game clock its commands landed on, next to its intent: on the command line, and in the
// pictures cold read's intents.md. A builder's intent describes a moment; the clock says which moment was drawn.
// ('pretend 5s' counts real seconds at pretend speed, about 18 game minutes: docs/COLD-READ.md, shots.js.) Two shots
// that render pixel-identical are an error: the second shows nothing the first doesn't.
//
//   node tools/shots.mjs --level <id>             writes tools/.shots/<id>/NN-name.png (01-start.png, ..., in list order)
//                                                 and prints each shot's clock and intent; exits 1 when two shots
//                                                 render pixel-identical (the PNGs are written first, to look at)
//   node tools/shots.mjs --level <id> --replay    writes the replay strips (tools/lib/replay.mjs), one per route check,
//                                                 to tools/.shots/<id>/replay/run-NN/ (NN.png, captions.md), runs.md
//   node tools/shots.mjs --level <id> --verbs     writes the verb sheets (tools/lib/verbs.mjs), one per item, to
//                                                 tools/.shots/<id>/verbs/: NN-item.png labelled, NN.png as the step 1
//                                                 reader sees it (numbers only), verbs.md (what each panel is)
//
// The same input gives the same bytes: fx particles (the only Math.random) are seeded from the shot's name, and the
// renderer's clock is the game's. tools/cold-read.mjs hashes these PNGs to tell a fresh stage from a stale one.
//
// Drawing needs @napi-rs/canvas (tools/lib/draw.mjs). One-time setup:
//   npm install --prefix tools/.deps @napi-rs/canvas
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { createRenderer } from '../src/render/renderer.js';
import { createHarness } from '../src/agent/harness.js';
import { getLevel } from '../src/levels/index.js';
import { formatClock } from '../src/config.js';
import { W, H, SHOTS_DIR, loadCanvas, withDom, playToEndCard, playerView } from './lib/draw.mjs';
import { captureRuns, writeRuns } from './lib/replay.mjs';
import { captureVerbs, verbsIntents } from './lib/verbs.mjs';
import { loadChecks } from './lib/route-ctx.mjs';

export { SETUP, loadCanvas } from './lib/draw.mjs';

// The level's shots file, as a path (it may not exist).
export const shotsFile = (id) => fileURLToPath(new URL(`../src/levels/${id}/shots.js`, import.meta.url));
// Where a level's PNGs go.
export const shotsDir = (id) => join(SHOTS_DIR, id);
// The PNG file name of the i-th shot (0-based).
export const shotFile = (i, name) => `${String(i + 1).padStart(2, '0')}-${name}.png`;

// Checks a shots list; returns the problems (empty when it is good).
export function shotsProblems(shots) {
  if (!Array.isArray(shots)) return ['shots.js must export default a list of { name, cmds, intent }'];
  const out = [];
  const seen = new Set();
  for (const [i, s] of shots.entries()) {
    const at = `shots[${i}]`;
    if (!s || typeof s !== 'object') { out.push(`${at}: not an object`); continue; }
    if (typeof s.name !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(s.name)) out.push(`${at}.name: lowercase letters, digits and dashes`);
    else if (seen.has(s.name)) out.push(`${at}.name: '${s.name}' twice`);
    seen.add(s.name);
    if (!Array.isArray(s.cmds) || !s.cmds.every((c) => typeof c === 'string')) out.push(`${at}.cmds: a list of harness commands`);
    if (typeof s.intent !== 'string' || !s.intent.trim()) out.push(`${at}.intent: what the picture must tell a first-time player`);
    if (s.beat !== undefined && typeof s.beat !== 'boolean' && !(typeof s.beat === 'number' && s.beat >= 0)) out.push(`${at}.beat: true, false or seconds into the beat (draw the beat of a catch or of the deadline, not its end card)`);
  }
  if (!shots.length) out.push('shots.js lists no shots');
  return out;
}

// The level's shots list (validated). Throws when shots.js is missing or wrong.
export async function loadShots(id) {
  const file = shotsFile(id);
  if (!existsSync(file)) throw new Error(`no src/levels/${id}/shots.js (docs/COLD-READ.md says what goes in it)`);
  const shots = (await import(`${pathToFileURL(file).href}?t=${Date.now()}`)).default;
  const bad = shotsProblems(shots);
  if (bad.length) throw new Error(`src/levels/${id}/shots.js: ${bad.join('; ')}`);
  return shots;
}

// How far into the caught beat (CAUGHT_DELAY, 1.6 s) a `beat: true` shot is drawn, in real seconds: the alert has
// popped in, the screen shake is over, the end card is not up yet.
export const BEAT_AT = 0.8;
// How long `beat: <s>` runs on, in real seconds, for a beat to come up after the commands stopped ('pretend until
// 5:00' can stop a frame before the deadline's outcome).
export const BEAT_WAIT = 2;

// Draws one shot of `level` (a level object). Returns { png: Buffer, phase, outcome, beat ('caught', 'outcome' or
// false), beatT (seconds into the beat drawn, or null), clock, at }: clock is the
// game minute of the drawn moment (for an end card, the minute the commands ended on, before it plays on), at the same
// as a wall clock reads it ('3:12 PM').
// harness: extra createHarness options (tools/press-stops.mjs draws a shot with and without pressStops).
export function renderShot(level, shot, lib = loadCanvas(), harness = {}) {
  return withDom(lib, shot.name, () => {
    let view = null;
    const h = createHarness({ level, onFrame: () => view.note(), ...harness });
    const g = h.game;
    view = playerView(g); // bubbles as at normal speed, not as long as pretending stretches them
    const canvas = lib.createCanvas(W, H);
    const r = createRenderer(canvas, { strict: true });
    h.begin();
    r.render(g); // the renderer sees the day start, as a player's screen does ("you are here" rings, then gone)
    for (const c of shot.cmds) {
      const res = h.run(c);
      if (!res.ok) throw new Error(`shot '${shot.name}': '${c}': ${res.text}`);
    }
    let beat = false;
    if (shot.beat !== undefined && shot.beat !== false) {
      const inBeat = () => g.phase === 'day' && !!(g.caught || g.outcome);
      const age = () => (g.caught ? g.caught.t : g.scenario.beatT);
      const want = shot.beat === true ? null : shot.beat;
      if (want !== null) for (let i = 0; i < Math.round(BEAT_WAIT * 60) && g.phase === 'day' && !inBeat(); i++) h.frame();
      if (!inBeat()) {
        throw new Error(`shot '${shot.name}': beat: ${shot.beat}, but its commands do not stop in a beat (${g.phase === 'end' ? 'the day is already over: a command that starts in a beat runs it out, so stop before it and give beat the seconds' : `nobody caught you, and the deadline has not come${want !== null ? ` within ${BEAT_WAIT} s` : ''}`})`);
      }
      beat = g.caught ? 'caught' : 'outcome';
      const until = want ?? (beat === 'caught' ? BEAT_AT : 0);
      for (let i = 0; i < 6000 && inBeat() && age() < until - 1e-9; i++) h.frame();
      if (!inBeat()) throw new Error(`shot '${shot.name}': beat: ${shot.beat} is past the end of the ${beat === 'caught' ? 'caught beat (CAUGHT_DELAY, 1.6 s)' : "deadline's beat (about 2 s)"}`);
    }
    const beatT = beat ? (g.caught ? g.caught.t : g.scenario.beatT) : null;
    const clock = g.clock.minute; // the drawn moment's (an end card has no clock: then the moment the commands ended on)
    if (!beat && (g.phase === 'end' || g.outcome || g.caught)) playToEndCard(h, r, `shot '${shot.name}'`);
    view.draw(() => r.render(g));
    return { png: canvas.toBuffer('image/png'), phase: g.phase, outcome: g.outcome ?? null, beat, beatT, clock, at: formatClock(clock, level.day.start) };
  });
}

// Draws every shot of level `id`. Returns [{ file, name, intent, png, phase, outcome, beat, clock, at }] in list order.
// Throws when two shots render pixel-identical, unless `same: true` (the command line writes them first, to look at).
export async function renderShots(id, { lib = loadCanvas(), shots, same = false } = {}) {
  const level = getLevel(id);
  const list = shots ?? (await loadShots(id));
  const out = list.map((s, i) => ({ file: shotFile(i, s.name), name: s.name, intent: s.intent, ...renderShot(level, s, lib) }));
  const twins = sameShots(out);
  if (twins.length && !same) throw new Error(sameShotsText(id, twins));
  return out;
}

// What a shot's line says about when it was taken: 'landed 3:12 PM', and ', then the end card' when its commands
// end the day (the picture is the end card, not the moment the clock gives), ', the caught beat' or ', 0.8 s into the
// deadline's beat' for a beat.
export const shotWhen = (s) => `landed ${s.at}${s.phase === 'end' ? ', then the end card'
  : s.beat === 'outcome' ? `, ${(s.beatT ?? 0).toFixed(1)} s into the deadline's beat` : s.beat ? ', the caught beat' : ''}`;

// The shots that render pixel-identical to an earlier one: [[earlier, later]]. Same pixels, same PNG bytes (the
// encoder is deterministic), so the bytes are compared.
export function sameShots(rendered) {
  const first = new Map();
  const out = [];
  for (const s of rendered) {
    const k = createHash('sha256').update(s.png).digest('hex');
    const a = first.get(k);
    if (a && a.png.equals(s.png)) out.push([a, s]);
    else if (!a) first.set(k, s);
  }
  return out;
}

// The error for sameShots' pairs.
export function sameShotsText(id, twins) {
  const pair = ([a, b]) => `${a.file} (${shotWhen(a)}) and ${b.file} (${shotWhen(b)})`;
  const caught = twins.some((t) => t.every((s) => s.phase === 'end' && s.outcome?.result === 'caught'));
  return `src/levels/${id}/shots.js: shots render pixel-identical: ${twins.map(pair).join('; ')}. The later one shows nothing `
    + 'the earlier one doesn\'t, so one of them is not the moment its intent describes: change its cmds (the clock it '
    + `landed on says where it went), or drop it${caught ? '. Both are the caught end card: commands that stop at a catch '
    + 'draw its end card; to draw the caught beat itself, give that shot beat: true' : ''}`;
}

// Writes rendered shots to dir (default tools/.shots/<id>/), removing the PNGs a previous run left there.
export function writeShots(id, rendered, dir = shotsDir(id)) {
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (f.endsWith('.png')) rmSync(join(dir, f));
  for (const s of rendered) writeFileSync(join(dir, s.file), s.png);
  return dir;
}

// Captures the replay strips of every route check of level `id` (tools/lib/replay.mjs).
export async function renderReplay(id, { lib = loadCanvas() } = {}) {
  const level = getLevel(id);
  const checks = await loadChecks(level);
  if (!checks?.length) throw new Error(`no route checks in src/levels/${id}/route-checks.js`);
  return captureRuns(level, checks, { lib });
}

// Draws the verb sheets of level `id` and writes them to dir (default tools/.shots/<id>/verbs/), removing what a
// previous run left there. Returns { dir, sheets }.
export function writeVerbs(id, { lib = loadCanvas(), dir = join(shotsDir(id), 'verbs') } = {}) {
  const { sheets } = captureVerbs(getLevel(id), { lib });
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (/\.(png|md)$/.test(f)) rmSync(join(dir, f));
  for (const s of sheets) {
    writeFileSync(join(dir, s.name), s.labelled);
    writeFileSync(join(dir, s.file), s.png);
  }
  writeFileSync(join(dir, 'verbs.md'), verbsIntents(sheets) || 'No items: no verb sheets.\n');
  return { dir, sheets };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const i = process.argv.indexOf('--level');
  const id = i > 0 ? process.argv[i + 1] : null;
  if (!id) {
    console.error('usage: node tools/shots.mjs --level <id> [--replay | --verbs]');
    process.exit(2);
  }
  try {
    getLevel(id);
    const t0 = performance.now();
    if (process.argv.includes('--replay')) {
      const runs = await renderReplay(id);
      const dir = writeRuns(runs, join(shotsDir(id), 'replay'));
      for (const r of runs) console.log(`  ${r.dir}: ${r.frames.length} frames (${r.total} moments)  ${r.outcome?.result ?? 'no outcome'}  ${r.name}${r.err ? `  (check failed: ${r.err})` : ''}`);
      console.log(`shots: ${id}: ${runs.length} replay strips in ${dir} (${((performance.now() - t0) / 1000).toFixed(1)} s)`);
      process.exit(0);
    }
    if (process.argv.includes('--verbs')) {
      const { dir, sheets } = writeVerbs(id);
      for (const s of sheets) {
        const notes = [...s.trouble.map((t) => `reaction: ${t}`), ...s.missing.map((m) => `not drawn: ${m}`)];
        console.log(`  ${s.name}: ${s.panels.length} panels, E: ${s.eVerb ?? 'no prompt'}${notes.length ? `  (${notes.join('; ')})` : ''}`);
      }
      console.log(`shots: ${id}: ${sheets.length} verb sheets in ${dir} (${((performance.now() - t0) / 1000).toFixed(1)} s)`);
      process.exit(0);
    }
    const rendered = await renderShots(id, { same: true });
    const dir = writeShots(id, rendered);
    for (const s of rendered) {
      const o = s.outcome;
      const end = s.phase === 'end' ? `  end card: ${o?.result ?? '?'}${o?.routes?.length ? ` ${o.routes.join('+')}` : ''}${o?.why ? ` (${o.why})` : ''}` : '';
      console.log(`  ${s.file}  ${shotWhen(s)}${end}\n      intent: ${s.intent}`);
    }
    console.log(`shots: ${id}: ${rendered.length} PNGs in ${dir} (${((performance.now() - t0) / 1000).toFixed(1)} s)`);
    const twins = sameShots(rendered);
    if (twins.length) throw new Error(sameShotsText(id, twins));
  } catch (e) {
    console.error(`shots: ${e.message}`);
    process.exit(1);
  }
}
