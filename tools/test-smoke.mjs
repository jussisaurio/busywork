// Smoke test: what a player runs. Boots the real src/main.js (the index.html entry) once per registered level with
// ?level=<id>, in node, against a stub DOM, a manual requestAnimationFrame queue and a clock the test owns, then plays
// it with real key events: title card -> day (move, interact, pretend, wait) -> fast-forward to an end screen ->
// retry -> day again. No headless browser, no src/ changes. Nothing here uses the agent harness.
//
//   node tools/test-smoke.mjs [levelId ...]
import { createFakeCanvas } from './lib/fake-canvas.mjs';
import { levels } from '../src/levels/index.js';

// Known failures: 'levelId:step' -> why. A listed failure must still fail (a pass is an error: delete the line).
const KNOWN_FAILURES = {};

const FRAME = 1 / 60;
const MAX_END_FRAMES = 12000; // the day at 8x speed is ~1100 frames; this is a stall guard

class StepError extends Error {}

const fake = createFakeCanvas();
let clock = 0;
Object.defineProperty(globalThis, 'performance', { value: { now: () => clock * 1000 }, configurable: true, writable: true });
globalThis.AudioContext = undefined; // audio.unlock() finds none and stays a silent no-op, as on a browser without WebAudio
const consoleErrors = [];
const realError = console.error;
console.error = (...a) => consoleErrors.push(a.map(String).join(' '));

function bootDom(levelId) {
  const listeners = {};
  const on = (t) => (type, fn) => (t[type] ||= []).push(fn);
  const canvas = fake.makeCanvas('main', 300, 150);
  const canvasL = {};
  canvas.addEventListener = on(canvasL);
  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 960, height: 600 });
  canvas.replaceWith = () => { throw new Error('canvas replaced: bad level id?'); };
  const el = (tag) => {
    if (tag === 'canvas') { fake.created++; return fake.makeCanvas(`offscreen${fake.created}`); }
    return { tagName: tag, style: {}, children: [], append(...c) { this.children.push(...c); }, addEventListener() {} };
  };
  const docL = {};
  globalThis.window = { innerWidth: 960, innerHeight: 600, devicePixelRatio: 1, addEventListener: on(listeners), removeEventListener() {} };
  globalThis.document = {
    hidden: false, activeElement: null, body: el('body'), addEventListener: on(docL),
    getElementById: (id) => (id === 'game' ? canvas : null), createElement: el,
  };
  globalThis.location = { search: `?level=${levelId}` };
  let raf = null;
  globalThis.requestAnimationFrame = (fn) => { raf = fn; return 1; };
  return {
    canvas,
    key(type, code, extra = {}) {
      const e = { type, code, key: extra.key ?? code, shiftKey: code.startsWith('Shift'), repeat: false, ctrlKey: false, metaKey: false, altKey: false, preventDefault() {}, ...extra };
      for (const fn of listeners[type] ?? []) fn(e);
    },
    frame() { // one display frame: the queued callback, with the clock moved on
      const fn = raf;
      if (!fn) throw new Error('requestAnimationFrame queue is empty: the frame loop stopped (an exception in a frame?)');
      raf = null;
      clock += FRAME;
      fn(clock * 1000);
    },
  };
}

async function playLevel(id) {
  const stepLog = [];
  let step = 'boot';
  const must = (cond, msg) => { if (!cond) throw new StepError(msg); };
  const failures = {};
  try {
    fake.errors.length = 0;
    consoleErrors.length = 0;
    const dom = bootDom(id);
    // A fresh evaluation of the real entry point per level (its state lives at module top level).
    await import(`../src/main.js?smoke=${id}`);
    const game = globalThis.window.__game;
    must(game, 'main.js did not set window.__game');
    must(game.level === levels[id], `?level=${id} gave level ${game.level.id}`);

    // Every frame: it must draw and must not throw or log an error.
    let framesDrawn = 0;
    const pump = (n) => {
      for (let i = 0; i < n; i++) {
        const before = fake.calls;
        dom.frame();
        must(fake.calls > before, `frame drew nothing (phase ${game.phase})`);
        must(!consoleErrors.length, `console.error: ${consoleErrors[0]}`);
        must(!fake.errors.length, `bad canvas call: ${fake.errors[0]}`);
        framesDrawn++;
      }
    };
    const tap = (code, frames = 2) => { dom.key('keydown', code); pump(frames); dom.key('keyup', code); pump(1); };
    const hold = (code, frames) => { dom.key('keydown', code); pump(frames); dom.key('keyup', code); };
    const run = (name, fn) => { step = name; fn(); stepLog.push(name); };

    run('title', () => {
      pump(30);
      must(game.phase === 'title', `expected title phase, got ${game.phase}`);
    });
    run('start day', () => {
      tap('Space');
      must(game.phase === 'day', `Space on the title card left phase ${game.phase}`);
      must(game.persist.loop === 1, `loop counter ${game.persist.loop}`);
    });
    run('play inputs', () => {
      pump(30);
      let moved = 0;
      for (const code of ['KeyD', 'KeyS', 'KeyA', 'KeyW']) {
        const { x, y } = game.player;
        hold(code, 40);
        if (Math.hypot(game.player.x - x, game.player.y - y) > 0.01) moved++;
        pump(2);
      }
      must(moved > 0, 'the player did not move for any of D S A W held 40 frames');
      tap('KeyE');
      dom.key('keydown', 'ShiftLeft'); pump(30); dom.key('keyup', 'ShiftLeft');
      tap('KeyP');
      pump(60); // wait
      must(game.phase === 'day', `phase ${game.phase} after the inputs (caught: ${game.caught ? 'yes' : 'no'})`);
    });
    run('hold R to restart', () => {
      const loop = game.persist.loop;
      tap('KeyR', 3);
      must(game.persist.loop === loop, 'a tap on R restarted the day');
      hold('KeyR', 20); pump(1);
      must(game.persist.loop === loop, 'R released early restarted the day');
      hold('KeyR', 90); pump(1);
      must(game.persist.loop === loop + 1, `R held did not restart (loop ${game.persist.loop})`);
      pump(5);
    });
    run('fast-forward to end', () => {
      for (let i = 0; i < 3; i++) tap('BracketRight', 1);
      must(game.debug.speed === 8, `] x3 gave speed ${game.debug.speed}`);
      let n = 0;
      while (game.phase === 'day' && n++ < MAX_END_FRAMES) pump(1);
      must(game.phase === 'end', `day never ended in ${MAX_END_FRAMES} frames (clock ${game.clock.minute.toFixed(0)} min)`);
      pump(60); // the end card draws
    });
    run('retry', () => {
      tap('Enter', 2);
      must(game.phase === 'day', `Enter on the end card left phase ${game.phase}`);
      must(game.persist.loop === 3, `loop counter ${game.persist.loop} after retry`);
      must(game.loopTime < 1 && game.clock.minute < 1, 'retry did not reset the day');
      pump(60);
      must(game.phase === 'day', `phase ${game.phase} after retry`);
    });
    stepLog.push(`${framesDrawn} frames`);
  } catch (e) {
    failures[step] = e instanceof StepError ? e.message : `${e.message}\n${e.stack}`;
  }
  return { failures, stepLog };
}

let bad = 0;
const t0 = Date.now();
const only = process.argv.slice(2);
const ids = Object.keys(levels).filter((id) => !only.length || only.includes(id));
const knownUsed = new Set();
for (const id of ids) {
  const t = Date.now();
  const { failures, stepLog } = await playLevel(id);
  const steps = Object.keys(failures);
  const unexpected = [];
  for (const s of steps) {
    const key = `${id}:${s}`;
    if (key in KNOWN_FAILURES) knownUsed.add(key);
    else unexpected.push(s);
  }
  if (unexpected.length) {
    bad++;
    for (const s of unexpected) realError(`FAIL ${id} at step '${s}': ${failures[s]}`);
  } else if (steps.length) {
    console.log(`ok   ${id}: known failure at '${steps[0]}' (${KNOWN_FAILURES[`${id}:${steps[0]}`]})`);
  } else {
    console.log(`ok   ${id}: ${stepLog.join(' -> ')} (${Date.now() - t} ms)`);
  }
}
if (!only.length) {
  for (const key of Object.keys(KNOWN_FAILURES)) {
    if (!knownUsed.has(key)) { bad++; realError(`FAIL known failure '${key}' no longer fails: remove it from KNOWN_FAILURES`); }
  }
}
console.error = realError;
console.log(`${bad ? 'FAIL' : 'ok  '} smoke: ${ids.length} levels in ${Date.now() - t0} ms`);
process.exit(bad ? 1 : 0);
