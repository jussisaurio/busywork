#!/usr/bin/env node
// Headless audio checks with a fake WebAudio. Run: node tools/test-audio.mjs
//
// The fake validates everything the audio code writes: no NaN/Infinity in param values or
// scheduled times, no exponential ramp to <= 0 (or from a <= 0 value), sources started/stopped
// exactly once, nodes connected only to nodes/params of the same context. It also counts node
// creation (idle frames must stay cheap) and fires `onended` as time advances, so leaks show up.
import { createEvents } from '../src/core/events.js';
import { levels } from '../src/levels/index.js';

let fails = 0;
const ok = (c, m) => {
  if (!c) {
    fails++;
    console.log('FAIL', m);
  } else console.log('ok  ', m);
};

// ---------------------------------------------------------------------------------------
// Fake WebAudio

const problems = []; // validation failures (strings)
const bad = (m) => {
  if (problems.length < 50) problems.push(m);
};
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

class FakeParam {
  constructor(ctx, name, v) {
    this.ctx = ctx;
    this.name = name;
    this._v = v;
    this.lastV = v; // value of the last scheduled event (call order)
  }
  get value() {
    return this._v;
  }
  set value(v) {
    if (!isNum(v)) bad(`${this.name}.value = ${v}`);
    this._v = v;
    this.lastV = v;
  }
  _t(t, what) {
    if (!isNum(t) || t < 0) bad(`${this.name}.${what} bad time ${t}`);
    else if (t > this.ctx.currentTime + 60) bad(`${this.name}.${what} time too far ahead ${t}`);
  }
  _v2(v, what) {
    if (!isNum(v)) bad(`${this.name}.${what} bad value ${v}`);
    if (this.name.endsWith('frequency') && isNum(v) && (v < 0 || v > 24000)) bad(`${this.name}.${what} freq out of range ${v}`);
  }
  setValueAtTime(v, t) {
    this._v2(v, 'setValueAtTime');
    this._t(t, 'setValueAtTime');
    this.lastV = v;
    return this;
  }
  linearRampToValueAtTime(v, t) {
    this._v2(v, 'linearRamp');
    this._t(t, 'linearRamp');
    this.lastV = v;
    return this;
  }
  exponentialRampToValueAtTime(v, t) {
    this._v2(v, 'exponentialRamp');
    this._t(t, 'exponentialRamp');
    if (!(v > 0)) bad(`${this.name}.exponentialRamp target ${v} <= 0`);
    if (!(this.lastV > 0)) bad(`${this.name}.exponentialRamp from value ${this.lastV} <= 0`);
    this.lastV = v;
    return this;
  }
  setTargetAtTime(v, t, tc) {
    this._v2(v, 'setTarget');
    this._t(t, 'setTarget');
    if (!isNum(tc) || tc <= 0) bad(`${this.name}.setTarget bad time constant ${tc}`);
    this.lastV = v;
    return this;
  }
  cancelScheduledValues(t) {
    this._t(t, 'cancelScheduledValues');
    return this;
  }
}

const OSC_TYPES = new Set(['sine', 'square', 'sawtooth', 'triangle']);
const BIQUAD_TYPES = new Set(['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']);

class FakeNode {
  constructor(ctx, kind) {
    this.ctx = ctx;
    this.kind = kind;
    this.outs = new Set();
    if (kind !== 'destination') {
      ctx.created++;
      ctx.nodes.add(this);
    }
  }
  connect(dest) {
    if (!(dest instanceof FakeNode || dest instanceof FakeParam)) bad(`${this.kind}.connect to ${dest}`);
    else if (dest.ctx !== this.ctx) bad(`${this.kind}.connect across contexts`);
    this.outs.add(dest);
    return dest;
  }
  disconnect() {
    this.outs.clear();
  }
}

class FakeSource extends FakeNode {
  constructor(ctx, kind) {
    super(ctx, kind);
    this.started = false;
    this.stopped = false;
    this.onended = null;
  }
  start(t = 0, offset = 0) {
    if (this.started) bad(`${this.kind} started twice`);
    if (!isNum(t) || t < 0) bad(`${this.kind}.start bad time ${t}`);
    if (!isNum(offset) || offset < 0) bad(`${this.kind}.start bad offset ${offset}`);
    if (this.kind === 'bufferSource' && !this.buffer) bad('bufferSource started without a buffer');
    this.started = true;
    this.startT = t;
    this.ctx.sources.add(this);
  }
  stop(t = 0) {
    if (!this.started) bad(`${this.kind} stopped before start`);
    if (this.stopped) bad(`${this.kind} stopped twice`);
    if (!isNum(t) || t < 0) bad(`${this.kind}.stop bad time ${t}`);
    if (t > this.ctx.currentTime + 60) bad(`${this.kind}.stop too far ahead ${t}`);
    this.stopped = true;
    this.stopT = t;
  }
}

class FakeOsc extends FakeSource {
  constructor(ctx) {
    super(ctx, 'oscillator');
    this.frequency = new FakeParam(ctx, 'osc.frequency', 440);
    this.detune = new FakeParam(ctx, 'osc.detune', 0);
    this._type = 'sine';
  }
  get type() {
    return this._type;
  }
  set type(v) {
    if (!OSC_TYPES.has(v)) bad(`oscillator type ${v}`);
    this._type = v;
  }
}

class FakeBufferSource extends FakeSource {
  constructor(ctx) {
    super(ctx, 'bufferSource');
    this.playbackRate = new FakeParam(ctx, 'buf.playbackRate', 1);
    this.detune = new FakeParam(ctx, 'buf.detune', 0);
    this.loop = false;
    this.buffer = null;
  }
}

class FakeBiquad extends FakeNode {
  constructor(ctx) {
    super(ctx, 'biquad');
    this.frequency = new FakeParam(ctx, 'biquad.frequency', 350);
    this.Q = new FakeParam(ctx, 'biquad.Q', 1);
    this.gain = new FakeParam(ctx, 'biquad.gain', 0);
    this.detune = new FakeParam(ctx, 'biquad.detune', 0);
    this._type = 'lowpass';
  }
  get type() {
    return this._type;
  }
  set type(v) {
    if (!BIQUAD_TYPES.has(v)) bad(`biquad type ${v}`);
    this._type = v;
  }
}

class FakeAudioContext {
  static instances = 0;
  static last = null;
  constructor() {
    FakeAudioContext.instances++;
    FakeAudioContext.last = this;
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.state = 'suspended';
    this.created = 0;
    this.nodes = new Set();
    this.sources = new Set();
    this.buffers = [];
    this.destination = new FakeNode(this, 'destination');
  }
  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
  suspend() {
    this.state = 'suspended';
    return Promise.resolve();
  }
  close() {
    this.state = 'closed';
    return Promise.resolve();
  }
  createGain() {
    const n = new FakeNode(this, 'gain');
    n.gain = new FakeParam(this, 'gain.gain', 1);
    return n;
  }
  createOscillator() {
    return new FakeOsc(this);
  }
  createBufferSource() {
    return new FakeBufferSource(this);
  }
  createBiquadFilter() {
    return new FakeBiquad(this);
  }
  createStereoPanner() {
    const n = new FakeNode(this, 'panner');
    n.pan = new FakeParam(this, 'panner.pan', 0);
    return n;
  }
  createDynamicsCompressor() {
    const n = new FakeNode(this, 'compressor');
    for (const [k, v] of [['threshold', -24], ['knee', 30], ['ratio', 12], ['attack', 0.003], ['release', 0.25]]) {
      n[k] = new FakeParam(this, `comp.${k}`, v);
    }
    n.reduction = 0;
    return n;
  }
  createBuffer(channels, length, sampleRate) {
    if (!(channels >= 1) || !Number.isInteger(length) || length < 1 || !(sampleRate >= 3000 && sampleRate <= 768000)) {
      bad(`createBuffer(${channels}, ${length}, ${sampleRate})`);
    }
    const data = Array.from({ length: channels }, () => new Float32Array(Math.max(1, length | 0)));
    const b = { numberOfChannels: channels, length, sampleRate, duration: length / sampleRate, getChannelData: (i) => data[i] };
    this.buffers.push(b);
    return b;
  }
  // Test helper: advance the clock and fire `ended` for sources whose stop time passed.
  advance(dt) {
    if (this.state !== 'running') return;
    this.currentTime += dt;
    for (const s of this.sources) {
      if (s.stopped && s.stopT <= this.currentTime) {
        this.sources.delete(s);
        if (typeof s.onended === 'function') s.onended({ target: s });
      }
    }
  }
  connectedCount() {
    let n = 0;
    for (const node of this.nodes) if (node.outs.size) n++;
    return n;
  }
}

// `window` that records every property touched (the import must touch nothing).
const touched = [];
const winTarget = {};
globalThis.window = new Proxy(winTarget, {
  get(t, k) {
    touched.push(String(k));
    return Reflect.get(t, k);
  },
  has(t, k) {
    touched.push(String(k));
    return Reflect.has(t, k);
  },
});
const installAC = (C) => {
  winTarget.AudioContext = C;
  globalThis.AudioContext = C;
};
const uninstallAC = () => {
  delete winTarget.AudioContext;
  delete globalThis.AudioContext;
};
installAC(FakeAudioContext);

// ---------------------------------------------------------------------------------------
// Import (must have no side effects)

const { createAudio } = await import('../src/audio/audio.js');
const { planBabble: planWith, VOICES, voicesFor } = await import('../src/audio/babble.js');
const MEETING_VOICES = voicesFor(levels.meeting.voices);
const planBabble = (v, icons, kind) => planWith(v, icons, kind, MEETING_VOICES); // level 1's cast, as the game speaks
ok(FakeAudioContext.instances === 0, 'import creates no AudioContext');
ok(touched.length === 0, `import touches no window property${touched.length ? ` (touched: ${touched.join(',')})` : ''}`);

// ---------------------------------------------------------------------------------------
// Fake game + event table

function makeGame() {
  return {
    events: createEvents(),
    level: levels.meeting,
    phase: 'day',
    settings: { showCones: true, muted: false },
    debug: { speed: 1 },
    time: 0,
    map: { w: 30, h: 17 },
    persist: { loop: 1, routesFound: [] },
    clock: { minute: 10, ff: false, forced: 0 },
    player: { id: 'player', x: 13.5, y: 9.5, dir: 0, moving: false, held: null, busy: false, busyPose: null, seated: true, locked: false },
    npcs: [
      { id: 'boss', x: 4.5, y: 2.5, active: true, voice: 'boss' },
      { id: 'lin', x: 4.5, y: 9.5, active: true, voice: 'lin' },
      { id: 'kev', x: 22.5, y: 9.5, active: true, voice: 'kev' },
    ],
    world: { projector: 'ok', fixProgress: 0, keycard: 'rack', sandwich: 'fridge', coffee: 'pot', items: [], kevGone: false },
    suspicion: { boss: 0 },
    caught: null,
    outcome: null,
  };
}

const ICON_SETS = [
  ['❓'],
  ['😠', '🚪', '🪪'],
  ['📄', '📄', '👉', '🖥️'],
  ['❗', '😠'],
  ['🔧', '❗'],
  ['👍'],
  [],
  Array.from({ length: 24 }, () => '💬'),
  ['🥪', '❓'],
  [42, null, '💢'], // junk entries
];
const OWNERS = ['boss', 'lin', 'kev', 'player', { x: 13.5, y: 3.5 }, { x: NaN, y: Infinity }, 'nobody', '3.5,15.5'];
const KINDS = ['speech', 'alert', 'thought', 'sign', undefined, 'weird'];

// [name, payload] for every event in CONTRACTS.md (plus junk payloads).
function eventList() {
  const ev = [['loop:start', { loop: 1 }]];
  for (const owner of OWNERS) {
    for (const kind of KINDS) {
      for (const icons of ICON_SETS) {
        const voice = typeof owner === 'string' ? owner : `${owner.x},${owner.y}`;
        ev.push(['say', { owner, icons, kind, voice }]);
      }
    }
  }
  ev.push(['say', { owner: { x: 13.5, y: 3.5 }, icons: ['🦗'], kind: 'sign', voice: '13.5,3.5' }]);
  for (const type of ['brew_coffee', 'spill_coffee', 'take_keycard', 'take_sandwich', 'eat_sandwich', 'pick_up', 'nope']) {
    ev.push(['action:start', { type, targetId: type }], ['action:done', { type, targetId: type }]);
    ev.push(['action:cancel', { type, reason: 'moved' }]);
  }
  for (const type of ['coffee', 'keycard', 'sandwich', 'banana', undefined]) ev.push(['item:drop', { type }], ['item:pickup', { type }]);
  ev.push(['player:sit', {}], ['player:stand', {}]);
  for (const pose of ['typing', 'folder', 'phone', null]) ev.push(['busy:start', { pose }], ['busy:end', { pose }]);
  ev.push(['witness:notice', { by: 'lin' }], ['witness:notice', { by: 'kev' }], ['witness:notice', { by: 'boss' }]);
  for (const by of ['lin', 'kev', 'ghost', undefined]) {
    for (const reason of ['action', 'scene', 'contraband', undefined]) ev.push(['witness:tattle', { by, reason, heard: by === 'lin' }]);
  }
  ev.push(['witness:tattle', { by: 'lin', reason: 'action', heard: true, late: true, icon: '🪪' }]);
  ev.push(['coffee:taken', { by: 'player' }], ['coffee:taken', { by: 'kev' }], ['coffee:missing', { by: 'kev' }], ['coffee:confiscated', { by: 'kev' }]);
  ev.push(['boss:suspicious', {}], ['boss:workAssigned', { reason: 'idle' }], ['boss:workAssigned', { reason: 'tattle' }], ['work:done', {}]);
  ev.push(['caught', { by: 'boss', reason: 'action' }]);
  ev.push(['projector:broken', {}], ['kev:alerted', {}], ['projector:fixing', {}], ['projector:fixed', {}]);
  ev.push(['keycard:taken', {}], ['sandwich:taken', {}], ['sandwich:eaten', {}], ['sandwich:returned', {}], ['sandwich:missing', {}]);
  ev.push(['boss:jacket', {}], ['boss:lockedOut', {}], ['boss:bang', {}], ['boss:bang', {}]);
  ev.push(['kev:left', {}], ['npc:vanish', { id: 'kev' }], ['npc:vanish', { id: 'lin' }], ['npc:appear', { id: 'lin' }], ['npc:vanish', { id: 'ghost' }]);
  ev.push(['meeting:gather', {}]);
  ev.push(['noise', { x: 4.5, y: 9.5, radius: 5 }], ['noise', { x: 4.5, y: 9.5, radius: 5, sfx: 'elevatorDing' }], ['noise', { x: NaN, y: 1, radius: 2, sfx: 'machineBeep' }]);
  for (const result of ['win', 'fail', 'caught', 'blamed', 'huh']) ev.push(['day:end', { outcome: { result } }]);
  ev.push(['day:end', undefined], ['day:end', { outcome: null }]);
  return ev;
}
const EVENT_NAMES = [...new Set(eventList().map((e) => e[0]))];

// Emit every event (also with undefined / garbage payloads), advancing time between them.
function emitAll(game, ctx, audio, { junk = true, step = 0.05 } = {}) {
  let threw = null;
  for (const [name, payload] of eventList()) {
    try {
      game.events.emit(name, payload);
      ctx?.advance(step);
      audio?.update(game, step);
    } catch (e) {
      threw = threw ?? `${name}: ${e.message}`;
    }
  }
  if (junk) {
    for (const name of EVENT_NAMES) {
      for (const p of [undefined, null, {}, 7, 'x', { owner: {}, icons: 'abc', kind: 3 }]) {
        try {
          game.events.emit(name, p);
        } catch (e) {
          threw = threw ?? `${name}(${JSON.stringify(p)}): ${e.message}`;
        }
      }
    }
  }
  return threw;
}

// Run update frames; returns nodes created and max nodes in one frame.
function frames(game, ctx, audio, n, dt = 1 / 60, each) {
  const before = ctx ? ctx.created : 0;
  let maxFrame = 0;
  for (let i = 0; i < n; i++) {
    if (each) each(i);
    const c0 = ctx ? ctx.created : 0;
    ctx?.advance(dt);
    audio.update(game, dt);
    if (ctx) maxFrame = Math.max(maxFrame, ctx.created - c0);
  }
  return { created: ctx ? ctx.created - before : 0, maxFrame };
}

// ---------------------------------------------------------------------------------------
// 1. Before unlock: everything is a no-op

{
  const game = makeGame();
  const audio = createAudio();
  let threw = null;
  try {
    audio.attach(game);
    audio.attach(game); // idempotent
    audio.setMuted(true);
    audio.setMuted(false);
    threw = emitAll(game, null, audio);
    for (let i = 0; i < 30; i++) audio.update(game, 1 / 60);
    audio.update(undefined, NaN);
    audio.update(null);
  } catch (e) {
    threw = e.message;
  }
  ok(!threw, `pre-unlock calls never throw${threw ? `: ${threw}` : ''}`);
  ok(FakeAudioContext.instances === 0, 'no AudioContext before unlock()');
  ok(touched.length === 0, 'no window access before unlock()');
  ok(audio._debug.errors === 0, 'pre-unlock: no internal errors');
}

// 2. WebAudio unavailable / broken: unlock never throws

{
  uninstallAC();
  const game = makeGame();
  const audio = createAudio();
  let threw = null;
  try {
    audio.attach(game);
    audio.unlock();
    audio.unlock();
    threw = emitAll(game, null, audio, { junk: false });
    for (let i = 0; i < 10; i++) audio.update(game, 1 / 60);
    audio.setMuted(true);
  } catch (e) {
    threw = e.message;
  }
  ok(!threw && audio._debug.unavailable && audio._debug.contexts === 0, 'no AudioContext: unlock/emit/update are silent no-ops');

  let built = 0;
  installAC(
    class Throwing {
      constructor() {
        built++;
        throw new Error('NotAllowedError (test)');
      }
    },
  );
  const quietWarn = console.warn;
  console.warn = () => {};
  const a2 = createAudio();
  threw = null;
  try {
    a2.attach(makeGame());
    for (let i = 0; i < 6; i++) a2.unlock();
    a2.update(makeGame(), 0.016);
  } catch (e) {
    threw = e.message;
  }
  console.warn = quietWarn;
  ok(!threw && built === 3 && a2._debug.unavailable, `throwing AudioContext constructor: no throw, gives up after 3 tries (tried ${built})`);

  // Old-Safari-ish context: no StereoPanner, no compressor.
  class Minimal extends FakeAudioContext {}
  Minimal.prototype.createStereoPanner = undefined;
  Minimal.prototype.createDynamicsCompressor = undefined;
  installAC(Minimal);
  const before = problems.length;
  const g3 = makeGame();
  const a3 = createAudio();
  threw = null;
  try {
    a3.attach(g3);
    a3.unlock();
    threw = emitAll(g3, FakeAudioContext.last, a3, { junk: false });
    frames(g3, FakeAudioContext.last, a3, 120);
  } catch (e) {
    threw = e.message;
  }
  ok(!threw && a3._debug.errors === 0 && problems.length === before && FakeAudioContext.last.created > 0, 'context without StereoPanner/compressor still works');
  installAC(FakeAudioContext);
}

// ---------------------------------------------------------------------------------------
// 3. Main run

const game = makeGame();
const audio = createAudio();
audio.attach(game);
const instancesBefore = FakeAudioContext.instances;
audio.unlock();
const ctx = FakeAudioContext.last;
audio.unlock();
audio.unlock();
ok(FakeAudioContext.instances === instancesBefore + 1, 'unlock() creates exactly one AudioContext (repeat calls reuse it)');
await Promise.resolve();
ok(ctx.state === 'running', 'unlock() resumes the context');
// Pause suspends the context; a keypress while paused (unlock) must not wake it; unpause resumes.
audio.setPaused(true);
ok(ctx.state === 'suspended', 'setPaused(true) suspends the context');
audio.unlock();
ok(ctx.state === 'suspended', 'unlock() while paused leaves it suspended');
{
  const before = ctx.created;
  audio.update(game, 0.5);
  ok(ctx.created === before, 'update() while paused schedules nothing');
}
audio.setPaused(false);
await Promise.resolve();
ok(ctx.state === 'running', 'setPaused(false) resumes it');
ok(ctx.buffers.length >= 4 && ctx.buffers.every((b) => b.getChannelData(0).every(isNum)), 'pre-rendered buffers are finite');
const baseline = ctx.created; // buses + compressor (music chain is built on first play)

// Each event (fresh, spaced out so dedupe doesn't interfere) produces sound.
{
  const mustSound = [
    ['loop:start', { loop: 1 }],
    ['say', { owner: 'boss', icons: ['😠', '🚪'], kind: 'speech', voice: 'boss' }],
    ['say', { owner: 'lin', icons: ['❓'], kind: 'speech', voice: 'lin' }],
    ['say', { owner: 'kev', icons: ['🔧', '❗'], kind: 'alert', voice: 'kev' }],
    ['say', { owner: 'player', icons: ['😋'], kind: 'thought', voice: 'player' }],
    ['say', { owner: { x: 13.5, y: 3.5 }, icons: ['🦗'], kind: 'sign', voice: '13.5,3.5' }],
    ['action:start', { type: 'brew_coffee' }],
    ['action:start', { type: 'spill_coffee' }],
    ['action:start', { type: 'take_sandwich' }],
    ['action:done', { type: 'brew_coffee' }],
    ['item:drop', { type: 'coffee' }],
    ['item:pickup', { type: 'coffee' }],
    ['player:sit', {}],
    ['player:stand', {}],
    ['busy:start', { pose: 'folder' }],
    ['witness:notice', { by: 'lin' }],
    ['witness:tattle', { by: 'lin', reason: 'action', heard: true }],
    ['witness:tattle', { by: 'kev', reason: 'contraband', heard: false }],
    ['coffee:taken', { by: 'kev' }],
    ['coffee:confiscated', { by: 'kev' }],
    ['boss:suspicious', {}],
    ['boss:workAssigned', { reason: 'idle' }],
    ['work:done', {}],
    ['caught', { by: 'boss', reason: 'action' }],
    ['projector:broken', {}],
    ['kev:alerted', {}],
    ['projector:fixing', {}],
    ['projector:fixed', {}],
    ['keycard:taken', {}],
    ['sandwich:taken', {}],
    ['sandwich:eaten', {}],
    ['sandwich:returned', {}],
    ['sandwich:missing', {}],
    ['boss:jacket', {}],
    ['boss:lockedOut', {}],
    ['boss:bang', {}],
    ['kev:left', {}],
    ['npc:vanish', { id: 'lin' }],
    ['npc:appear', { id: 'lin' }],
    ['meeting:gather', {}],
    ['noise', { x: 4.5, y: 9.5, radius: 5, sfx: 'machineBeep' }],
    ['day:end', { outcome: { result: 'win' } }],
    ['day:end', { outcome: { result: 'caught' } }],
    ['day:end', { outcome: { result: 'blamed' } }],
  ];
  const silent = [];
  for (const [name, payload] of mustSound) {
    const c0 = ctx.created;
    game.events.emit(name, payload);
    if (ctx.created === c0) silent.push(name + (payload?.type ? `:${payload.type}` : payload?.kind ? `:${payload.kind}` : ''));
    for (let i = 0; i < 240; i++) ctx.advance(1 / 60); // 4 s apart (past every dedupe window)
  }
  ok(silent.length === 0, `every mapped event makes a sound${silent.length ? ` (silent: ${silent.join(', ')})` : ''}`);
  {
    // A noise without an sfx (or naming none that exists) is silent: its sound is the level's business.
    const c0 = ctx.created;
    game.events.emit('noise', { x: 4.5, y: 9.5, radius: 5 });
    game.events.emit('noise', { x: 4.5, y: 9.5, radius: 5, sfx: 'nope' });
    ok(ctx.created === c0, "a 'noise' without a known sfx makes no sound");
    for (let i = 0; i < 240; i++) ctx.advance(1 / 60);
  }

  // Dedupes: two tattles in one step = one nyah-nyah; kev:left + vanish at the elevator = one ding; 🦗 sign + day:end fail = one crickets.
  const cost = (fn) => {
    const c0 = ctx.created;
    fn();
    const d = ctx.created - c0;
    for (let i = 0; i < 300; i++) ctx.advance(1 / 60);
    return d;
  };
  const tattleOnce = cost(() => game.events.emit('witness:tattle', { by: 'lin', reason: 'action', heard: true }));
  const tattleTwice = cost(() => {
    game.events.emit('witness:tattle', { by: 'lin', reason: 'action', heard: true });
    game.events.emit('witness:tattle', { by: 'kev', reason: 'scene', heard: true });
  });
  ok(tattleOnce > 0 && tattleTwice === tattleOnce, 'two tattles in the same step → one nyah-nyah');
  game.npcs[2].x = 2.5;
  game.npcs[2].y = 15.5;
  const ding = cost(() => game.events.emit('kev:left', {}));
  const dingBoth = cost(() => {
    game.events.emit('npc:vanish', { id: 'kev' });
    game.events.emit('kev:left', {});
  });
  ok(dingBoth === ding, 'npc:vanish at the elevator + kev:left → one elevator ding');
  const cr = cost(() => game.events.emit('day:end', { outcome: { result: 'fail' } }));
  const crBoth = cost(() => {
    game.events.emit('say', { owner: { x: 13.5, y: 3.5 }, icons: ['🦗'], kind: 'sign', voice: '13.5,3.5' });
    for (let i = 0; i < 66; i++) ctx.advance(1 / 60); // scenario: sign at 0.9 s, day:end at 2.0 s
    game.events.emit('day:end', { outcome: { result: 'fail' } });
  });
  ok(cr > 0 && crBoth === cr, '🦗 sign + day:end fail → one crickets');
  game.npcs[2].x = 22.5;
  game.npcs[2].y = 9.5;
}

// The full table, all voices × kinds × icon sets, odd owners and junk payloads.
{
  const threw = emitAll(game, ctx, audio);
  ok(!threw, `emitting every event (all voices/kinds/junk) never throws${threw ? `: ${threw}` : ''}`);
}

// State-driven frames: typing, ff typing, moving, fixing, late clock, odd dt values.
{
  game.phase = 'day';
  game.caught = null;
  game.outcome = null;
  game.clock.minute = 20;
  const p = game.player;
  let threw = null;
  try {
    p.busy = true;
    p.busyPose = 'typing';
    const slow = frames(game, ctx, audio, 180);
    game.clock.ff = true;
    const fast = frames(game, ctx, audio, 180);
    game.clock.ff = false;
    game.clock.forced = 20;
    frames(game, ctx, audio, 60);
    game.clock.forced = 0;
    p.busy = false;
    p.busyPose = null;
    ok(fast.created > slow.created * 1.3, `typing clatter is faster during fast-forward (${slow.created} → ${fast.created} nodes / 3 s)`);

    p.moving = true;
    const walk = frames(game, ctx, audio, 120, 1 / 60, (i) => (p.x = 5 + i * 0.07));
    p.busy = true;
    p.busyPose = 'folder';
    frames(game, ctx, audio, 60);
    p.busy = false;
    p.busyPose = null;
    p.moving = false;
    p.x = 13.5;
    ok(walk.created > 0, 'footsteps while moving');

    game.world.projector = 'fixing';
    const fix = frames(game, ctx, audio, 240);
    game.world.projector = 'ok';
    ok(fix.created > 0, 'repair clanks while the projector is being fixed');

    // Late clock: 3:49 → 4:01 at fast-forward speed (3.6 game min / s).
    game.clock.minute = 79;
    game.clock.ff = true;
    p.busy = true;
    p.busyPose = 'typing';
    let ticksAt = [];
    const tickFrames = frames(game, ctx, audio, 220, 1 / 60, (i) => {
      game.clock.minute = 79 + i * 0.06;
      if (game.clock.minute >= 90 && !game.outcome) game.outcome = { result: 'win', routes: [], newRoutes: [] };
      ticksAt.push(ctx.created);
    });
    ok(tickFrames.created > 0, 'clock ticks / 4:00 chime in the last ten minutes');
    game.clock.ff = false;
    p.busy = false;
    p.busyPose = null;
    game.outcome = null;

    // Odd dt values.
    for (const dt of [0, -1, NaN, Infinity, 10, undefined, 1e-9, 0.1]) audio.update(game, dt);
  } catch (e) {
    threw = e.message;
  }
  ok(!threw, `update frames never throw${threw ? `: ${threw}` : ''}`);
}

// Idle budgets.
{
  game.phase = 'day';
  game.clock.minute = 30;
  const idle = frames(game, ctx, audio, 600); // 10 s with muzak
  ok(idle.created / 10 < 60, `idle day with music: ${(idle.created / 10).toFixed(1)} nodes/s (< 60)`);
  ok(idle.maxFrame < 80, `idle day with music: at most ${idle.maxFrame} nodes in one frame (< 80)`);

  // Stall (hidden tab): the music scheduler must skip ahead, not burst.
  ctx.advance(5);
  const stall = frames(game, ctx, audio, 2);
  ok(stall.created < 80, `after a 5 s stall the scheduler doesn't burst (${stall.created} nodes)`);

  game.phase = 'title';
  frames(game, ctx, audio, 30);
  const title = frames(game, ctx, audio, 300);
  ok(title.created === 0, `title phase: no nodes created (${title.created})`);
  game.phase = 'end';
  const end = frames(game, ctx, audio, 300);
  ok(end.created === 0, `end phase: no nodes created (${end.created})`);
  game.phase = 'day';

  // Without music, an idle day creates nothing at all.
  const g2 = makeGame();
  const a2 = createAudio({ music: false });
  a2.attach(g2);
  a2.unlock();
  const c2 = FakeAudioContext.last;
  frames(g2, c2, a2, 5);
  const idle2 = frames(g2, c2, a2, 600);
  ok(idle2.created === 0, `idle day without music: no nodes created (${idle2.created})`);

  // A level that sets no cue times gets config.js dayCue's defaults: no wall clock until 5 minutes before the
  // meeting (it used to tick every half minute all day), then ticks.
  const { day } = levels.meeting;
  const g3 = makeGame();
  g3.level = { ...levels.meeting, day: { start: day.start, gatherAt: day.gatherAt, meetingAt: day.meetingAt } };
  const a3 = createAudio({ music: false });
  a3.attach(g3);
  a3.unlock();
  const c3 = FakeAudioContext.last;
  frames(g3, c3, a3, 5);
  const early = frames(g3, c3, a3, 200, 1 / 60, (i) => (g3.clock.minute = 20 + i * 0.05));
  ok(early.created === 0, `no cue times: the clock is silent before the default (${early.created} nodes)`);
  const late = frames(g3, c3, a3, 60, 1 / 60, (i) => (g3.clock.minute = day.meetingAt - 4.6 + i * 0.05));
  ok(late.created > 0, 'no cue times: the clock ticks from 5 minutes before the meeting');
}

// Mute: via setMuted and via game.settings.muted.
{
  audio.setMuted(true);
  game.settings.muted = true;
  const c0 = ctx.created;
  let threw = emitAll(game, ctx, audio, { junk: false });
  game.player.busy = true;
  game.player.busyPose = 'typing';
  game.player.moving = true;
  frames(game, ctx, audio, 300);
  ok(!threw && ctx.created === c0, `muted (setMuted + settings.muted): nothing created (${ctx.created - c0})`);

  audio.setMuted(false); // settings.muted still true → still muted
  const c1 = ctx.created;
  frames(game, ctx, audio, 120);
  game.events.emit('keycard:taken', {});
  ok(ctx.created === c1, 'settings.muted alone also mutes');

  game.settings.muted = false;
  const c2 = ctx.created;
  frames(game, ctx, audio, 60);
  game.events.emit('keycard:taken', {});
  ok(ctx.created > c2, 'unmuted again: sounds resume');
  game.player.busy = false;
  game.player.busyPose = null;
  game.player.moving = false;
}

// Leaks: once everything has finished, only the persistent graph stays connected.
{
  game.phase = 'title';
  for (let i = 0; i < 900; i++) {
    ctx.advance(1 / 60);
    audio.update(game, 1 / 60);
  }
  const connected = ctx.connectedCount();
  const pending = [...ctx.sources].filter((s) => s.stopped).length;
  const unstopped = [...ctx.sources].filter((s) => !s.stopped).length;
  ok(pending === 0, `all one-shot sources ended (${pending} pending)`);
  ok(unstopped <= 1, `only the music LFO runs forever (${unstopped} unstopped sources)`);
  ok(connected <= baseline + 6, `no leaked connections: ${connected} connected nodes (persistent graph ≈ ${baseline + 6})`);
}

ok(audio._debug.errors === 0, `no internal audio errors${audio._debug.lastError ? ` (last: ${audio._debug.lastError?.stack ?? audio._debug.lastError})` : ''}`);

// ---------------------------------------------------------------------------------------
// 4. Babble planning (pure)

{
  const avg = (fn, n = 200) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += fn();
    return s / n;
  };
  let range1 = true;
  let range3 = true;
  for (let i = 0; i < 200; i++) {
    const a = planBabble('lin', ['👍'], 'speech').syl.length;
    const b = planBabble('lin', ['📄', '👉', '🖥️'], 'speech').syl.length;
    if (a < 2 || a > 3) range1 = false;
    if (b < 6 || b > 9) range3 = false;
  }
  ok(range1, '1 icon → 2-3 syllables');
  ok(range3, '3 icons → 6-9 syllables');
  ok(avg(() => planBabble('boss', ['❗', '😠'], 'alert').length) < avg(() => planBabble('boss', ['❗', '😠'], 'speech').length), 'alerts are shorter than speech');
  ok(
    avg(() => {
      const s = planBabble('kev', ['🥪', '❓']).syl;
      return s[s.length - 1].f2 > s[0].f ? 1 : 0;
    }) > 0.95,
    'questions end higher than they start',
  );
  ok(
    avg(() => {
      const s = planBabble('kev', ['🥪', '👍']).syl;
      return s[s.length - 1].f2 < s[0].f * 1.05 ? 1 : 0;
    }) > 0.9,
    'statements end level or lower',
  );
  const f0 = (v) => avg(() => planBabble(v, ['👍', '👍']).syl[0].f);
  ok(f0('boss') < f0('kev') && f0('kev') < f0('lin') && f0('lin') < f0('player'), 'pitch order: boss < kev < lin < player');
  const sylLen = (v) => avg(() => planBabble(v, ['👍', '👍']).syl[0].dur);
  ok(sylLen('boss') > sylLen('lin') * 1.4, 'boss speaks slower than lin');
  const angry = avg(() => planBabble('boss', ['😠', '👊']).syl[0].dur);
  ok(angry < sylLen('boss'), 'angry speech is punchier (shorter syllables)');
  let maxLen = 0;
  let mono = true;
  let finite = true;
  for (let i = 0; i < 300; i++) {
    const v = ['boss', 'lin', 'kev', 'player', 'generic', 'constructor', undefined][i % 7];
    const pl = planBabble(v, Array.from({ length: (i % 30) + 1 }, () => '💬'), i % 2 ? 'speech' : 'alert');
    maxLen = Math.max(maxLen, pl.length);
    for (let k = 0; k < pl.syl.length; k++) {
      const s = pl.syl[k];
      if (![s.t, s.dur, s.f, s.f2, s.amp, s.atk].every(isNum) || s.f <= 0 || s.f2 <= 0) finite = false;
      if (k && s.t < pl.syl[k - 1].t + pl.syl[k - 1].dur) mono = false;
    }
  }
  ok(finite, 'plans are finite for every voice (incl. unknown / prototype names)');
  ok(mono, 'syllables never overlap');
  ok(maxLen <= 2.21, `long bubbles are capped (${maxLen.toFixed(2)} s)`);
  ok(Object.keys(VOICES).includes('generic'), 'generic fallback voice exists');
}

// ---------------------------------------------------------------------------------------
// 5. Integration: real game days through the agent harness, audio attached, one update per frame

{
  let harnessMod = null;
  try {
    harnessMod = await import('../src/agent/harness.js');
  } catch (e) {
    console.log(`skip  integration (harness not importable: ${e.message})`);
  }
  if (harnessMod) {
    const scripts = {
      'idle (fail)': (run) => run('busy until 4:00'),
      'projector after Kev leaves (win)': (run, g) => {
        run('goto coffee_machine busy');
        run('interact');
        run('sit busy');
        while (!g.world.kevGone && g.phase === 'day') run('busy 1s');
        run('goto projector busy');
        run('interact');
        run('goto meeting_seat busy');
        run('busy until 4:00');
      },
      'wander + sandwich (tattles, work)': (run) => {
        run('goto fridge');
        run('interact');
        run('interact');
        run('goto kev_desk');
        run('wait 20s');
        run('goto lin_desk');
        run('wait 20s');
        run('sit');
        run('busy until 4:00');
      },
    };
    const before = problems.length;
    let gameErr = null;
    const seen = new Set();
    let created = 0;
    for (const [name, script] of Object.entries(scripts)) {
      const h = harnessMod.createHarness();
      const g = h.game;
      const a = createAudio();
      a.attach(g);
      a.unlock();
      const c = FakeAudioContext.last;
      g.events.on('*', (n) => seen.add(n));
      const orig = g.input.clearPresses.bind(g.input);
      g.input.clearPresses = () => {
        orig();
        c.advance(1 / 60);
        a.update(g, 1 / 60);
      };
      try {
        h.begin();
        script((cmd) => h.run(cmd), g);
        for (let i = 0; i < 60 * 300 && g.phase === 'day'; i++) h.frame();
        for (let i = 0; i < 300; i++) {
          c.advance(1 / 60);
          a.update(g, 1 / 60);
        }
      } catch (e) {
        gameErr = gameErr ?? `${name}: ${e.message}`;
      }
      created += c.created;
      if (a._debug.errors) gameErr = gameErr ?? `${name}: audio error ${a._debug.lastError?.stack ?? a._debug.lastError}`;
      console.log(`      ${name}: ${g.outcome ? g.outcome.result : 'no outcome'}, ${c.created} nodes`);
    }
    ok(!gameErr, `integration: real days with audio attached run clean${gameErr ? ` (${gameErr})` : ''}`);
    ok(problems.length === before, 'integration: no invalid WebAudio calls');
    ok(created > 0, `integration: sound produced (${seen.size} distinct events seen)`);
  }
}

// ---------------------------------------------------------------------------------------

ok(problems.length === 0, `fake WebAudio saw no invalid calls${problems.length ? `:\n      ${problems.slice(0, 12).join('\n      ')}` : ''}`);
console.log(fails ? `\n${fails} check(s) failed` : '\nall audio checks passed');
process.exit(fails ? 1 : 0);
