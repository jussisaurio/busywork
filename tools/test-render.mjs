// Headless renderer test: fake canvas (recording Proxy), stubbed window/document,
// hand-made game states covering every visual branch. Run: node tools/test-render.mjs
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const renderDir = join(root, 'src', 'render');

let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

// --- 0. syntax + import hygiene --------------------------------------------------
const renderFiles = readdirSync(renderDir).filter((f) => f.endsWith('.js')).map((f) => join(renderDir, f));
let syntaxOk = true;
for (const f of [...renderFiles, fileURLToPath(import.meta.url)]) {
  try {
    execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
  } catch (e) {
    syntaxOk = false;
    console.log(String(e.stderr || e));
  }
}
ok(syntaxOk, `node --check on ${renderFiles.length + 1} files`);
let importsOk = true;
for (const f of renderFiles) {
  const src = readFileSync(f, 'utf8');
  if (/from\s+['"][^'"]*\/(sim|play)\/|from\s+['"][^'"]*game\/loop\.js/.test(src)) {
    importsOk = false;
    console.log('  forbidden import in', f);
  }
}
ok(importsOk, 'render modules do not import sim/, play/ or game/loop.js');

// Import BEFORE any DOM stubs exist: proves there is no DOM work at import time.
let createRenderer;
try {
  ({ createRenderer } = await import('../src/render/renderer.js'));
  ok(typeof createRenderer === 'function', 'renderer imports without window/document');
} catch (e) {
  ok(false, `renderer import without DOM: ${e.message}`);
  process.exit(1);
}

const { createGame, resetLoop } = await import('../src/state.js');
const { say, burst, sightline } = await import('../src/core/fx.js');
const { createRng } = await import('../src/core/rng.js');
const { spotPos } = await import('../src/game/perception.js');
const { NPC_DEFS } = await import('../src/data/schedules.js');
const { VISION, at, MEETING_AT } = await import('../src/config.js');
const { DIRS } = await import('../src/core/vision.js');
const { LEGEND_PLAY } = await import('../src/render/hud.js');

// --- 1. fake canvas ---------------------------------------------------------------
const METHODS = new Set(('arc arcTo beginPath bezierCurveTo clearRect clip closePath createConicGradient createImageData ' +
  'createLinearGradient createPattern createRadialGradient drawFocusIfNeeded drawImage ellipse fill fillRect fillText ' +
  'getContextAttributes getImageData getLineDash getTransform isPointInPath isPointInStroke lineTo measureText moveTo ' +
  'putImageData quadraticCurveTo rect reset resetTransform restore rotate roundRect save scale setLineDash setTransform ' +
  'stroke strokeRect strokeText transform translate').split(' '));
const ENUMS = {
  textAlign: ['left', 'right', 'center', 'start', 'end'],
  textBaseline: ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'],
  lineCap: ['butt', 'round', 'square'],
  lineJoin: ['round', 'bevel', 'miter'],
  globalCompositeOperation: ['source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in',
    'destination-out', 'destination-atop', 'lighter', 'copy', 'xor', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
};
const errors = [];
const wordy = new Set();
const LEGEND_WORDS = new Set(LEGEND_PLAY.flatMap((k) => [k.key, k.label]));
let scene = 'setup';
let calls = 0;
let dashCalls = 0; // dashed strokes started (HUD slots, sightlines)
const fail = (msg) => {
  if (errors.length < 60) errors.push(`[${scene}] ${msg}`);
};
const badStr = (s) => /NaN|undefined|Infinity|\[object/.test(s);
function validColor(v) {
  if (v && typeof v === 'object') return !!v.__fake;
  if (typeof v !== 'string' || badStr(v)) return false;
  if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return true;
  const m = v.match(/^rgba?\(([^)]*)\)$/);
  if (m) {
    const parts = m[1].split(',').map((s) => s.trim());
    if (parts.length < 3 || parts.length > 4) return false;
    if (!parts.every((p) => /^-?\d+(\.\d+)?%?$/.test(p))) return false;
    const a = parts.length === 4 ? Number(parts[3]) : 1;
    return a >= 0 && a <= 1 && parts.slice(0, 3).every((p) => Number(p) >= 0 && Number(p) <= 255);
  }
  return /^[a-z]+$/i.test(v);
}
const gradient = () => ({
  __fake: true,
  addColorStop(off, color) {
    if (!Number.isFinite(off) || off < 0 || off > 1) fail(`addColorStop offset ${off}`);
    if (!validColor(color)) fail(`addColorStop color ${color}`);
  },
});

const contexts = [];
function makeCanvas(label, w = 300, h = 150) {
  const canvas = { width: w, height: h, style: {}, label };
  const state = { depth: 0, underflow: 0, label };
  const props = {
    canvas, globalAlpha: 1, fillStyle: '#000000', strokeStyle: '#000000', lineWidth: 1, lineCap: 'butt',
    lineJoin: 'miter', miterLimit: 10, lineDashOffset: 0, font: '10px sans-serif', textAlign: 'start',
    textBaseline: 'alphabetic', direction: 'inherit', shadowBlur: 0, shadowColor: 'rgba(0,0,0,0)', shadowOffsetX: 0,
    shadowOffsetY: 0, globalCompositeOperation: 'source-over', imageSmoothingEnabled: true, imageSmoothingQuality: 'low',
    filter: 'none', letterSpacing: '0px', fontKerning: 'auto',
  };
  const special = {
    save() { state.depth++; },
    restore() { if (state.depth === 0) state.underflow++; else state.depth--; },
    measureText(s) { return { width: String(s).length * 8 }; },
    createLinearGradient: gradient,
    createConicGradient: gradient,
    createRadialGradient(x0, y0, r0, x1, y1, r1) {
      if (r0 < 0 || r1 < 0) fail(`createRadialGradient negative radius ${r0} ${r1}`);
      return gradient();
    },
    createPattern() { return { __fake: true, setTransform() {} }; },
    arc(x, y, r) { if (r < 0) fail(`arc negative radius ${r}`); },
    arcTo(x1, y1, x2, y2, r) { if (r < 0) fail(`arcTo negative radius ${r}`); },
    ellipse(x, y, rx, ry) { if (rx < 0 || ry < 0) fail(`ellipse negative radius ${rx} ${ry}`); },
    roundRect(x, y, w, h, r) { if (typeof r === 'number' && r < 0) fail(`roundRect negative radius ${r}`); },
    drawImage(img) {
      if (!img || !(img.width > 0) || !(img.height > 0)) fail('drawImage with empty source');
    },
    fillText(txt) {
      if (typeof txt !== 'string' && typeof txt !== 'number') fail(`fillText non-string ${typeof txt}`);
      else if (badStr(String(txt))) fail(`fillText "${txt}"`);
      // "No text except the mission card": outside the title screen only digits, ':', '×', '.', emoji
      // and the key legend (one word naming each control).
      else if (!scene.startsWith('title') && /[A-Za-z]/.test(String(txt)) && !LEGEND_WORDS.has(String(txt))) wordy.add(`${scene}: "${txt}"`);
    },
    setLineDash(arr) {
      if (!Array.isArray(arr) || arr.some((v) => !Number.isFinite(v) || v < 0)) fail(`setLineDash ${arr}`);
      else if (arr.length) dashCalls++;
    },
    getLineDash() { return []; },
    getTransform() { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }; },
  };
  const fns = {};
  const ctx = new Proxy({}, {
    get(_, key) {
      if (key === '__state') return state;
      if (typeof key === 'symbol') return undefined;
      if (Object.prototype.hasOwnProperty.call(props, key)) return props[key];
      if (!fns[key]) {
        if (!METHODS.has(key)) fail(`unknown ctx member read: ${key}`);
        fns[key] = (...args) => {
          calls++;
          for (let i = 0; i < args.length; i++) {
            const a = args[i];
            if (typeof a === 'number' && !Number.isFinite(a)) fail(`${key} arg ${i} = ${a}`);
            if (a === undefined) fail(`${key} arg ${i} undefined`);
          }
          const sp = special[key];
          return sp ? sp(...args) : undefined;
        };
      }
      return fns[key];
    },
    set(_, key, value) {
      if (!Object.prototype.hasOwnProperty.call(props, key)) fail(`unknown ctx property set: ${String(key)}`);
      if (value === undefined || value === null) fail(`${String(key)} = ${value}`);
      else if (typeof value === 'number' && !Number.isFinite(value)) fail(`${String(key)} = ${value}`);
      else if (key === 'fillStyle' || key === 'strokeStyle' || key === 'shadowColor') {
        if (!validColor(value)) fail(`${key} = ${value}`);
      } else if (typeof value === 'string' && badStr(value)) fail(`${String(key)} = ${value}`);
      if (key === 'font' && !/(^|\s)\d+(\.\d+)?px\s/.test(value)) fail(`font = ${value}`);
      if (key === 'globalAlpha' && (value < 0 || value > 1)) fail(`globalAlpha out of range ${value}`);
      if (key === 'lineWidth' && !(value > 0)) fail(`lineWidth ${value}`);
      if (key === 'shadowBlur' && value < 0) fail(`shadowBlur ${value}`);
      if (ENUMS[key] && !ENUMS[key].includes(value)) fail(`${key} = ${value}`);
      props[key] = value;
      return true;
    },
  });
  contexts.push(ctx);
  canvas.getContext = (type) => (type === '2d' ? ctx : null);
  return canvas;
}

// --- 2. DOM stubs -----------------------------------------------------------------
const listeners = {};
globalThis.window = {
  innerWidth: 1280, innerHeight: 800, devicePixelRatio: 2,
  addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
  removeEventListener() {},
};
let created = 0;
globalThis.document = {
  createElement(tag) {
    if (tag !== 'canvas') throw new Error(`unexpected createElement(${tag})`);
    created++;
    return makeCanvas(`offscreen${created}`);
  },
};

// --- 3. game states ---------------------------------------------------------------
const SPOT_FOR = { boss: 'boss_desk', lin: 'lin_desk', kev: 'kev_desk' };
function makeNpcs(game) {
  return NPC_DEFS.map((d, i) => {
    const s = spotPos(SPOT_FOR[d.id] || 'player_desk');
    return {
      id: d.id, icon: d.icon, color: d.color, voice: d.voice, meetingSpot: d.meetingSpot,
      x: s.x, y: s.y, dir: s.dir, glance: { offset: 0 }, vision: { ...(VISION[d.id] || VISION.default) },
      active: true, pose: 'sit', moving: false, override: null, carry: null,
      hasJacket: d.id === 'boss' ? game.world.jacket === 'boss' : false,
      label: d.id, rng: createRng(1000 + i),
    };
  });
}
const npc = (game, id) => game.npcs.find((n) => n.id === id);

const canvas = makeCanvas('main');
const mainCtx = canvas.getContext('2d');
const renderer = createRenderer(canvas, { strict: true });
ok(listeners.resize && listeners.resize.length === 1, 'resize listener registered inside createRenderer');
ok(created === 0, 'no offscreen canvas until first render');

const game = createGame();
const SKIP = new Set(['events', 'map', 'rng', 'input']);
const snap = (g) => JSON.stringify(g, (k, v) => (SKIP.has(k) ? undefined : v));
let renders = 0;
let mutated = 0;
function draw(name) {
  scene = name;
  const before = snap(game);
  try {
    renderer.render(game);
  } catch (e) {
    fail(`threw: ${e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : e}`);
  }
  if (snap(game) !== before) {
    mutated++;
    fail('render mutated game state');
  }
  for (const c of contexts) {
    const st = c.__state;
    if (st.depth !== 0) { fail(`save/restore imbalance on ${st.label}: depth ${st.depth}`); st.depth = 0; }
    if (st.underflow) { fail(`restore underflow on ${st.label}: ${st.underflow}`); st.underflow = 0; }
  }
  renders++;
}
function day(setup) {
  resetLoop(game);
  game.phase = 'day';
  game.npcs = makeNpcs(game);
  game.loopTime = 5;
  game.clock.minute = 20;
  game.persist.loop = 2;
  game.time += 0.37;
  if (setup) setup(game);
}

// Title
game.phase = 'title';
for (const t of [0, 0.05, 0.3, 0.8, 1.5, 3, 10, 30]) {
  game.time = t;
  draw(`title t=${t}`);
}
ok(created === 1, 'offscreen static layer created lazily (once)');
game.persist.routesFound = ['projector'];
game.persist.loop = 4;
game.time = 40;
draw('title with routes + loops');
game.persist.routesFound = ['projector', 'keycard'];
draw('title with all routes');
game.persist.routesFound = [];

// Day: base
day();
draw('day base');

// Player: every busyPose x held x moving x seated, cycling directions
const POSES = [null, 'typing', 'folder', 'phone'];
const HELD = [null, 'coffee', 'keycard', 'sandwich'];
const DIR_LIST = [DIRS.N, DIRS.E, DIRS.S, DIRS.W, -2.4, 0.7, 2.2, -0.8];
let combo = 0;
for (const bp of POSES) for (const held of HELD) for (const moving of [false, true]) for (const seated of [false, true]) {
  day((g) => {
    Object.assign(g.player, { busyPose: bp, busy: !!bp, held, moving: moving && !seated, seated, dir: DIR_LIST[combo % 8] });
    g.time = 3 + combo * 0.13;
  });
  draw(`player pose=${bp} held=${held} moving=${moving} seated=${seated}`);
  combo++;
}
for (const d of DIR_LIST) {
  day((g) => Object.assign(g.player, { seated: false, moving: true, busyPose: 'folder', busy: true, dir: d }));
  draw(`folder strut dir=${d.toFixed(2)}`);
}
for (const d of DIR_LIST) for (const bp of [null, 'typing', 'phone']) {
  day((g) => Object.assign(g.player, { smeared: true, seated: bp === 'typing', busyPose: bp, busy: !!bp, dir: d }));
  draw(`mustard dir=${d.toFixed(2)} pose=${bp}`);
}
day((g) => { g.paused = true; });
draw('day paused (dim + bars, ▶ button)');
day((g) => Object.assign(g.player, { held: { type: 'keycard' }, seated: false }));
draw('held as object');
day((g) => Object.assign(g.player, { held: 'mystery', seated: false, busyPose: 'phone' }));
draw('unknown held item at ear');

// Actions
for (const [t, dur, sneaky] of [[0, 1.2, false], [0.6, 1.2, true], [1.2, 1.2, true], [2, 1.2, false], [0.1, 0, true]]) {
  day((g) => {
    g.player.seated = false;
    g.player.action = { type: 'take_keycard', targetId: 'coat_rack', t, duration: dur, sneaky };
    g.player.focus = { kind: 'interactable', id: 'coat_rack', x: 1.5, y: 1.5, icon: '🪪' };
  });
  draw(`action t=${t}/${dur} sneaky=${sneaky}`);
}

// Focus hints
for (const f of [
  { kind: 'interactable', id: 'fridge', x: 20.5, y: 1.5, icon: '🥪' },
  { kind: 'item', id: 'coffee', x: 9.3, y: 9.8, icon: '✋' },
  { kind: 'self', id: 'self', x: 13.5, y: 9.5, icon: '🍴' },
  { kind: 'interactable', id: 'x', x: 0.5, y: 0.5 },
]) {
  day((g) => { g.player.focus = f; g.player.seated = f.kind !== 'self'; });
  draw(`focus ${f.kind} ${f.icon || '(no icon)'}`);
}

// Bubbles
const KINDS = ['speech', 'thought', 'alert', 'sign', 'weird'];
for (const kind of KINDS) {
  for (const age of [0, 0.08, 0.5, 2.45, 3]) {
    day((g) => {
      say(g, 'boss', ['☕', '❓'], { kind, ttl: 2.5 }).age = age;
      say(g, 'player', ['📊', '❌', '🤷'], { kind, ttl: 2.5 }).age = age;
      say(g, { x: 5, y: 5 }, ['🚧'], { kind, ttl: 2.5 }).age = age;
      say(g, 'lin', [], { kind }).age = age;
      say(g, 'nobody', ['👻'], { kind });
    });
    draw(`bubbles kind=${kind} age=${age}`);
  }
}
day((g) => {
  say(g, { x: 0, y: 0 }, ['1', '2', '3', '4', '5', '6', '7', '8'], { kind: 'sign' });
  say(g, { x: 30, y: 17 }, ['🧭'], { kind: 'thought' });
  npc(g, 'kev').active = false;
  say(g, 'kev', ['🎒'], { kind: 'speech' });
  g.player.x = 29.6; g.player.y = 0.4; g.player.seated = false;
  say(g, 'player', ['🏃', '💨'], { kind: 'speech' });
});
draw('bubbles at map edges / inactive owner');

// Particles
const PKINDS = ['smoke', 'sparks', 'crumbs', 'paper', 'zzz', 'sweat', 'confetti', 'glitter'];
for (const kind of PKINDS) {
  day((g) => {
    burst(g, kind, 12, 8, 10, { lift: 1 });
    g.fx.particles.forEach((p, i) => { p.age = (i / 10) * p.ttl; p.x += p.vx * 0.1; p.y += p.vy * 0.1; });
    g.fx.particles.push({ kind, x: 3, y: 3, vx: 0, vy: 0, age: 5, ttl: 1 });
  });
  draw(`particles ${kind}`);
}

// Shake
day((g) => { g.fx.shake.t = 0.2; g.fx.shake.amount = 0.3; });
draw('screen shake');

// Suspicion
for (const s of [0.01, 0.4, 0.8, 1, 1.5]) {
  day((g) => { g.suspicion.boss = s; });
  draw(`suspicion ${s}`);
}
day((g) => { g.suspicion.boss = 0.6; npc(g, 'boss').active = false; });
draw('suspicion with boss away');

// World chip states
for (const pj of ['ok', 'broken', 'fixing']) for (const kevGone of [false, true]) for (const fp of [0, 0.5, 1]) {
  day((g) => {
    Object.assign(g.world, { projector: pj, kevGone, fixProgress: pj === 'fixing' ? fp : 0 });
    if (pj === 'fixing') {
      const k = npc(g, 'kev');
      const s = spotPos('projector');
      Object.assign(k, { x: s.x, y: s.y, dir: s.dir, override: 'fixing', pose: 'stand' });
    }
    if (kevGone) npc(g, 'kev').active = false;
    g.clock.minute = 86;
  });
  draw(`projector ${pj} kevGone=${kevGone} fix=${fp}`);
}
for (const kc of ['rack', 'player', 'dropped', 'boss']) for (const jacket of ['rack', 'boss']) {
  day((g) => {
    Object.assign(g.world, { keycard: kc, jacket });
    npc(g, 'boss').hasJacket = jacket === 'boss';
    if (kc === 'player') g.player.held = 'keycard';
    if (kc === 'dropped') g.world.items.push({ type: 'keycard', x: 8.2, y: 10.4 });
  });
  draw(`keycard ${kc} jacket ${jacket}`);
}
day((g) => {
  Object.assign(g.world, { keycard: 'boss', jacket: 'boss', bossLockedOut: true });
  const b = npc(g, 'boss');
  const s = spotPos('door_out');
  Object.assign(b, { x: s.x, y: s.y, dir: s.dir, pose: 'stand', override: 'lockedOut', hasJacket: true });
});
draw('boss locked out');
for (const sw of ['fridge', 'player', 'dropped', 'eaten', 'lin']) {
  day((g) => {
    g.world.sandwich = sw;
    if (sw === 'player') { g.player.held = 'sandwich'; g.player.seated = false; }
    if (sw === 'dropped') g.world.items.push({ type: 'sandwich', x: 18, y: 10 });
    if (sw === 'lin') Object.assign(npc(g, 'lin'), { pose: 'walk', moving: true, override: 'hunting' });
  });
  draw(`sandwich ${sw}`);
}
// Coffee: the carafe on the machine, and Kev carrying the only cup
for (const pot of ['pot', 'taken', undefined, 'mystery']) {
  day((g) => {
    if (pot === undefined) delete g.world.coffee;
    else g.world.coffee = pot;
  });
  draw(`coffee carafe ${pot}`);
}
let ck = 0;
for (const pose of ['sit', 'stand', 'walk']) for (const d of DIR_LIST) {
  day((g) => {
    g.world.coffee = 'taken';
    Object.assign(npc(g, 'kev'), { carry: 'coffee', pose, moving: pose === 'walk', dir: d });
    g.time = 2 + ck++ * 0.17;
  });
  draw(`kev carries coffee pose=${pose} dir=${d.toFixed(2)}`);
}
for (const ov of ['fixing', 'alerted', 'meeting', 'hunting']) {
  day((g) => { Object.assign(npc(g, 'kev'), { carry: 'coffee', override: ov, pose: 'stand' }); g.world.projector = 'broken'; });
  draw(`kev carries coffee override=${ov}`);
}
day((g) => { for (const n of g.npcs) { n.carry = 'coffee'; n.pose = 'walk'; n.moving = true; } });
draw('everyone carries coffee');
day((g) => { npc(g, 'kev').carry = 'stapler'; npc(g, 'lin').carry = 42; });
draw('unknown carry values');

// Sightline flashes: every kind across its life, live positions, and garbage.
// dashes(): dashed strokes in one render, compared against the same day without lines.
function dashes(name) {
  const d0 = dashCalls;
  draw(name);
  return dashCalls - d0;
}
day();
const baseDashes = dashes('sightline baseline (no lines)');
const lineDashes = {};
for (const kind of ['notice', 'tattle', 'caught', 'mystery']) for (const age of [0, 0.05, 0.1, 0.2, 0.5, 0.79, 0.8, 1.5]) {
  day((g) => {
    Object.assign(g.player, { seated: false, x: 8.5, y: 9.5 });
    npc(g, 'lin').pose = 'stand';
    g.fx.lines = [{ from: kind === 'caught' ? 'boss' : 'lin', to: 'player', kind, age, ttl: 0.8 }];
  });
  lineDashes[`${kind}@${age}`] = dashes(`sightline ${kind} age=${age}`) - baseDashes;
}
ok(['notice', 'tattle', 'caught', 'mystery'].every((k) => lineDashes[`${k}@0.05`] > 0 && lineDashes[`${k}@0.5`] > 0),
  'sightlines draw a dashed line for every kind while alive');
ok(['notice', 'tattle', 'caught'].every((k) => lineDashes[`${k}@0.8`] === 0 && lineDashes[`${k}@1.5`] === 0),
  'sightlines are gone once age reaches ttl');
day((g) => {
  sightline(g, 'boss', 'caught', 1.2);
  sightline(g, 'lin', 'tattle', 1.2);
  sightline(g, 'kev', 'notice');
  g.fx.lines[0].age = 0.3;
  say(g, 'lin', ['👉', '🪪'], { kind: 'alert' });
});
draw('sightlines from three NPCs at once');
day((g) => {
  g.player.seated = true;
  g.fx.lines = [{ from: 'kev', to: 'player', kind: 'tattle', age: 0.4, ttl: 1 }];
  Object.assign(npc(g, 'kev'), { x: g.player.x + 0.05, y: g.player.y });
});
draw('sightline from right next to the player');
day((g) => { g.fx.lines = [{ from: 'intern', to: 'player', kind: 'notice', age: 0.1, ttl: 0.8 }]; });
const missingDashes = dashes('sightline from a missing NPC') - baseDashes;
day((g) => {
  npc(g, 'kev').active = false;
  g.fx.lines = [{ from: 'kev', to: 'player', kind: 'tattle', age: 0.2, ttl: 0.8 }];
});
const inactiveDashes = dashes('sightline from an inactive NPC') - baseDashes;
ok(missingDashes === 0 && inactiveDashes === 0, 'no sightline from a missing or inactive NPC');
day((g) => {
  g.fx.lines = [
    { from: 'lin', to: 'player', kind: 'notice', age: NaN, ttl: 0.8 },
    { from: 'boss', to: 'player', kind: 'caught', age: 0.2, ttl: NaN },
    { from: 'kev', to: 'player', kind: 'tattle', age: Infinity, ttl: 0 },
    { from: 'lin', to: 'player', kind: 'tattle', age: -3, ttl: -1 },
    { from: 'boss', kind: 'caught' },
    null, 7, 'junk', {},
  ];
});
draw('sightlines with garbage values');
day((g) => {
  npc(g, 'boss').x = NaN;
  g.player.y = undefined;
  g.fx.lines = [{ from: 'boss', to: 'player', kind: 'caught', age: 0.3, ttl: 1 }];
});
draw('sightline with NaN positions');
day((g) => { g.fx.lines = 'nope'; });
draw('fx.lines not an array');
day((g) => { delete g.fx.lines; });
draw('fx.lines missing');
day((g) => { g.fx = { bubbles: [], particles: [], shake: { t: 0, amount: 0 } }; sightline(g, 'lin', 'notice'); });
draw('fx.lines created on demand by sightline()');
day((g) => {
  g.world.keycard = 'boss'; g.world.jacket = 'boss';
  const b = npc(g, 'boss');
  b.hasJacket = true;
  b.pose = 'walk'; b.moving = true;
});
for (const d of DIR_LIST) { npc(game, 'boss').dir = d; game.time += 0.1; draw(`boss wears keycard dir=${d.toFixed(2)}`); }
day((g) => {
  g.world.items.push({ type: 'coffee', x: 9, y: 10 }, { type: 'keycard', x: 10, y: 10 }, { type: 'sandwich', x: 11, y: 10 },
    { type: 'stapler', x: 12, y: 10 }, { type: 'coffee', x: NaN, y: 3 });
});
draw('dropped items');

// Clock + status
for (const m of [0, 45, at('3:49'), at('3:50'), at('3:57'), at('3:58'), 89.9]) {
  day((g) => { g.clock.minute = m; });
  draw(`clock ${m}`);
}
day((g) => { g.clock.ff = true; g.player.busyPose = 'typing'; g.player.busy = true; });
draw('fast-forward');
for (const f of [20, 10, 0.5, 30]) {
  day((g) => { g.clock.forced = f; g.player.locked = true; });
  draw(`forced ${f}`);
}
day((g) => { g.settings.muted = true; g.settings.showCones = false; g.debug.speed = 4; g.clock.ff = true; g.clock.forced = 5; });
draw('muted + no cones + speed 4 + ff + forced');
day((g) => { g.debug.speed = 0.25; });
draw('speed 0.25');

// NPC poses, glances, overrides
let k = 0;
for (const pose of ['sit', 'stand', 'walk']) for (const off of [-2, -0.6, 0, 0.3, 0.6, 2]) {
  day((g) => {
    for (const n of g.npcs) {
      n.pose = pose;
      n.moving = pose === 'walk';
      n.dir = DIR_LIST[(k + n.id.length) % 8];
      n.glance.offset = off;
    }
    g.time = 7 + k * 0.21;
  });
  draw(`npc pose=${pose} glance=${off}`);
  k++;
}
for (const ov of ['alerted', 'fixing', 'hunting', 'lockedOut', 'meeting']) {
  for (const pj of ['ok', 'broken']) {
    day((g) => {
      g.world.projector = pj;
      for (const n of g.npcs) { n.override = ov; n.pose = 'stand'; }
    });
    draw(`override ${ov} projector ${pj}`);
  }
}
day((g) => { npc(g, 'kev').active = false; });
draw('inactive NPC (kev)');
day((g) => {
  const s = spotPos('elevator');
  Object.assign(npc(g, 'kev'), { x: s.x, y: s.y + 0.3, pose: 'walk', moving: true, dir: DIRS.N });
});
draw('NPC at elevator');
day((g) => {
  g.npcs.push({
    id: 'intern', icon: '🧃', color: '#aa5588', x: 18.5, y: 10.5, dir: 1, glance: { offset: 0.8 },
    vision: { fov: 1.2, radius: 4 }, active: true, pose: 'walk', moving: true, override: null, rng: createRng(5),
  });
  g.npcs.push({ id: 'ghost', color: 'teal', x: 19.5, y: 12.5, dir: 0, glance: null, vision: null, active: true, pose: 'stand' });
});
draw('unknown NPC ids');

// Caught beat + meeting beat
day((g) => {
  g.caught = { by: 'boss', reason: 'action', t: 0 };
  g.suspicion.boss = 1;
  g.player.locked = true;
  g.player.seated = false;
  say(g, 'boss', ['❗'], { kind: 'alert' });
  g.fx.shake.t = 0.3; g.fx.shake.amount = 0.15;
});
for (let i = 0; i < 6; i++) { game.time += 0.25; draw(`caught beat ${i}`); }
day((g) => { g.clock.minute = MEETING_AT; for (const n of g.npcs) n.override = 'meeting'; });
for (let i = 0; i < 4; i++) { game.time += 0.3; game.clock.minute += 0.1; draw(`meeting beat ${i}`); }

// Loop stamp
for (const lt of [0, 0.05, 0.16, 0.5, 1.0, 1.19, 1.2, -1]) {
  day((g) => { g.loopTime = lt; g.persist.loop = lt < 0.5 ? 1 : 12; });
  draw(`loop stamp lt=${lt}`);
}

// End screens
const OUTCOMES = [
  { result: 'win', routes: ['keycard'], newRoutes: ['keycard'] },
  { result: 'win', routes: ['projector'], newRoutes: [] },
  { result: 'win', routes: ['projector', 'keycard'], newRoutes: ['projector', 'keycard'] },
  { result: 'win', routes: [], newRoutes: [] },
  { result: 'fail', routes: [], newRoutes: [] },
  { result: 'caught', routes: [], newRoutes: [] },
  { result: 'caught', routes: ['projector'], newRoutes: [], jacketless: true },
  { result: 'blamed', routes: [], newRoutes: [] },
  { result: 'blamed', routes: ['projector'], newRoutes: ['projector'] },
  { result: 'blamed', routes: ['keycard'], newRoutes: [] },
  { result: 'blamed', routes: ['projector', 'keycard'], newRoutes: ['keycard'] },
  { result: 'blamed', routes: ['projector', 'keycard'], newRoutes: [], kevGone: true },
  { result: 'blamed', routes: ['keycard'], newRoutes: [], kevGone: true },
  { result: 'blamed', routes: 'garbage', newRoutes: null },
];
for (const o of OUTCOMES) {
  day((g) => {
    g.persist.routesFound = Array.isArray(o.routes) ? [...new Set(o.routes)] : [];
    const { jacketless, kevGone, ...outcome } = o;
    g.outcome = { ...outcome, loop: 3, minute: o.result === 'caught' ? 47.5 : MEETING_AT };
    if (o.result === 'caught') g.caught = { by: 'boss', reason: 'contraband', t: 1 };
    if (jacketless) npc(g, 'boss').hasJacket = false;
    if (kevGone) { g.world.kevGone = true; npc(g, 'kev').active = false; }
    g.phase = 'end';
  });
  const tag = `${o.result}/${Array.isArray(o.routes) ? o.routes.join('+') || '-' : o.routes}${o.kevGone ? ' kevGone' : ''}${o.jacketless ? ' jacketless' : ''}`;
  for (const dt of [0, 0.1, 0.3, 0.3, 0.2, 0.2, 0.15, 0.2, 0.5, 1, 1, 2, 5]) {
    game.time += dt;
    draw(`end ${tag} +${dt}`);
  }
}
day((g) => { g.phase = 'end'; g.outcome = null; });
draw('end without outcome');

// Resize / DPR changes
for (const [w, h, dpr] of [[1920, 1080, 1], [800, 1200, 3], [1, 1, 1], [3000, 600, 1.5], [1280, 800, 2]]) {
  Object.assign(globalThis.window, { innerWidth: w, innerHeight: h, devicePixelRatio: dpr });
  for (const fn of listeners.resize) fn();
  day();
  draw(`resize ${w}x${h}@${dpr}`);
  const cssW = parseFloat(canvas.style.width);
  const cssH = parseFloat(canvas.style.height);
  // the renderer floors the scale at 0.05 (48x30 css px) for degenerate windows
  const fits = cssW <= Math.max(48, w) + 0.5 && cssH <= Math.max(30, h) + 0.5;
  const aspect = Math.abs(cssW / cssH - 960 / 600) < 0.05 || cssW < 20;
  if (!fits || !aspect || canvas.width !== Math.round(cssW * dpr)) fail(`resize ${w}x${h}@${dpr}: css ${cssW}x${cssH} buffer ${canvas.width}x${canvas.height}`);
}

ok(wordy.size === 0, 'no letters drawn outside the title screen (digits and icons only)');
if (wordy.size) for (const w of [...wordy].slice(0, 15)) console.log('   ', w);

// Report coverage errors so far
ok(errors.length === 0, `${renders} renders: no throws, NaN args, bad styles, negative radii or save/restore leaks`);
if (errors.length) for (const e of errors.slice(0, 40)) console.log('   ', e);
ok(mutated === 0, 'render never mutates game state');
errors.length = 0;

// Strict vs forgiving error handling
{
  const bad = createGame();
  bad.phase = 'day';
  Object.defineProperty(bad, 'clock', { get() { throw new Error('boom'); }, enumerable: false });
  let threw = false;
  try { createRenderer(makeCanvas('strict'), { strict: true }).render(bad); } catch { threw = true; }
  ok(threw, 'strict renderer rethrows');
  const origErr = console.error;
  let logged = 0;
  console.error = () => { logged++; };
  let threw2 = false;
  const soft = createRenderer(makeCanvas('soft'));
  try { soft.render(bad); soft.render(bad); } catch { threw2 = true; }
  console.error = origErr;
  ok(!threw2 && logged === 1, 'default renderer swallows errors and logs once');
  for (const c of contexts) { c.__state.depth = 0; c.__state.underflow = 0; }
  errors.length = 0;
}

// Performance: 300 frames of a busy day
day((g) => {
  g.clock.minute = 70;
  g.suspicion.boss = 0.5;
  g.world.coffee = 'taken';
  g.world.projector = 'broken';
  g.player.seated = false;
  g.player.held = 'coffee';
  g.player.focus = { kind: 'interactable', id: 'projector', x: 13.5, y: 3.5, icon: '☕' };
  for (const n of g.npcs) { n.pose = 'walk'; n.moving = true; }
  npc(g, 'kev').carry = 'coffee';
  sightline(g, 'lin', 'tattle', 99);
  sightline(g, 'boss', 'notice', 99);
  say(g, 'boss', ['☕', '❓'], { kind: 'thought', ttl: 99 });
  say(g, 'lin', ['🥪', '❗'], { kind: 'speech', ttl: 99 });
  burst(g, 'smoke', 13.5, 3.5, 30, { ttl: 99 });
  burst(g, 'paper', 13.5, 9.5, 30, { ttl: 99 });
});
scene = 'perf';
const before = snap(game);
const callsBefore = calls;
const t0 = performance.now();
const FRAMES = 300;
for (let i = 0; i < FRAMES; i++) {
  game.time += 1 / 60;
  game.loopTime += 1 / 60;
  for (const n of game.npcs) { n.x += 0.01 * Math.cos(n.dir); n.y += 0.01 * Math.sin(n.dir); n.glance.offset = Math.sin(game.time) * 1.2; }
  renderer.render(game);
}
const ms = (performance.now() - t0) / FRAMES;
const perFrame = Math.round((calls - callsBefore) / FRAMES);
void before;
ok(errors.length === 0, `perf run clean (${FRAMES} frames)`);
if (errors.length) for (const e of errors.slice(0, 20)) console.log('   ', e);
console.log(`perf: ${ms.toFixed(3)} ms/frame with the recording fake ctx, ~${perFrame} ctx calls/frame`);

console.log(fails ? `\n${fails} FAILED` : '\nall render tests passed');
process.exit(fails ? 1 : 0);
