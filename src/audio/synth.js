// Low-level WebAudio helpers shared by the audio modules.
//
// Every value and time that reaches an AudioParam goes through these helpers, so a stray
// NaN/Infinity (or a <=0 exponential-ramp target) can never be scheduled. Every short-lived
// sound is built with sound(), which disconnects its nodes once its last source has ended.
// Nothing here touches browser globals: the engine object `E` is passed in.
//
// E = { ctx, now(), sfx, voice, buffers: { noise, key, step, tick } }

export const EPS = 1e-4; // floor for exponential ramps (WebAudio rejects 0)

export const fin = (v, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, fin(v, lo)));
export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const midiHz = (m) => 440 * Math.pow(2, (fin(m, 69) - 69) / 12);

const tm = (t) => Math.max(0, fin(t, 0));
const hz = (f) => clamp(f, 1, 20000);

// Sanitised AudioParam automation.
export const P = {
  set: (p, v, t) => p.setValueAtTime(fin(v), tm(t)),
  ramp: (p, v, t) => p.linearRampToValueAtTime(fin(v), tm(t)),
  exp: (p, v, t) => p.exponentialRampToValueAtTime(Math.max(EPS, fin(v, EPS)), tm(t)),
  // Glide toward v from whatever the param is doing now (no jumps). Used for buses.
  to: (p, v, t, tc) => p.setTargetAtTime(fin(v), tm(t), Math.max(0.002, fin(tc, 0.05))),
  // Frequencies: clamped to the audible range.
  setF: (p, f, t) => p.setValueAtTime(hz(f), tm(t)),
  expF: (p, f, t) => p.exponentialRampToValueAtTime(hz(f), tm(t)),
};

// Percussive gain envelope: 0 -> peak over `a`, exponential decay to silence by t+dur.
export function perc(param, t, a, dur, peak) {
  const pk = Math.max(EPS * 4, fin(peak, 0));
  const d = Math.max(0.01, fin(dur, 0.1));
  const at = clamp(a, 0.001, d * 0.8);
  P.set(param, 0, t);
  P.ramp(param, pk, t + at);
  P.exp(param, EPS, t + d);
}

// Flat gain envelope (beeps): quick attack, hold, quick release.
function flat(param, t, a, dur, peak) {
  const pk = Math.max(0, fin(peak, 0));
  const d = Math.max(0.02, fin(dur, 0.1));
  const at = clamp(a, 0.001, d * 0.4);
  const rel = Math.min(0.03, d * 0.4);
  P.set(param, 0, t);
  P.ramp(param, pk, t + at);
  P.ramp(param, pk, t + d - rel);
  P.ramp(param, 0, t + d);
}

// Connect nodes in order (nulls are skipped). Returns the last node.
export function chain(...nodes) {
  let prev = null;
  for (const n of nodes) {
    if (!n) continue;
    if (prev) prev.connect(n);
    prev = n;
  }
  return prev;
}

// A disposable sound: create nodes through it, schedule sources with play(), then call done().
// When the last-ending source fires `ended`, every node it created is disconnected.
export function sound(E) {
  const ctx = E.ctx;
  const nodes = [];
  let lastSrc = null;
  let lastEnd = -Infinity;
  const add = (n) => (nodes.push(n), n);
  return {
    gain(v = 1) {
      const g = add(ctx.createGain());
      g.gain.value = fin(v, 0);
      return g;
    },
    filter(type, f, Q = 0.707, dB = 0) {
      const b = add(ctx.createBiquadFilter());
      b.type = type;
      b.frequency.value = hz(f);
      b.Q.value = clamp(Q, 0.0001, 60);
      if (dB) b.gain.value = clamp(dB, -40, 40);
      return b;
    },
    osc(type, f) {
      const o = add(ctx.createOscillator());
      o.type = type;
      o.frequency.value = hz(f);
      return o;
    },
    noise(rate = 1) {
      const s = add(ctx.createBufferSource());
      s.buffer = E.buffers.noise;
      s.loop = true;
      s.playbackRate.value = clamp(rate, 0.05, 16);
      return s;
    },
    buffer(buf, rate = 1) {
      const s = add(ctx.createBufferSource());
      s.buffer = buf;
      s.playbackRate.value = clamp(rate, 0.05, 16);
      return s;
    },
    // Where to connect the end of the chain: a stereo panner feeding `dest`, or `dest` itself.
    out(dest, pan) {
      const p = fin(pan, 0);
      if (Math.abs(p) < 0.02 || typeof ctx.createStereoPanner !== 'function') return dest;
      const sp = add(ctx.createStereoPanner());
      sp.pan.value = clamp(p, -1, 1);
      sp.connect(dest);
      return sp;
    },
    // Start a source at t0 and stop it at t1 (each source is started/stopped exactly once).
    play(src, t0, t1, offset) {
      const a = tm(t0);
      const b = Math.max(a + 0.01, tm(t1));
      if (offset != null) src.start(a, clamp(offset, 0, 600));
      else src.start(a);
      src.stop(b);
      if (b >= lastEnd) {
        lastEnd = b;
        lastSrc = src;
      }
    },
    done() {
      const all = nodes.slice();
      const cleanup = () => {
        for (const n of all) {
          try {
            n.disconnect();
          } catch {
            /* already gone */
          }
        }
      };
      if (lastSrc) lastSrc.onended = cleanup;
      else cleanup();
      return lastEnd;
    },
  };
}

// ---------------------------------------------------------------------------------------
// Primitive recipes. Options: t (start time, ctx seconds), gain, pan, dest (default E.sfx).

// A pitched blip with an optional glide (f -> f2) and an optional filter.
// shape: 'perc' (decaying) | 'flat' (beep).
export function tone(E, o) {
  const t = fin(o.t, E.now());
  const dur = Math.max(0.02, fin(o.dur, 0.15));
  const f = fin(o.f, 440);
  const s = sound(E);
  const osc = s.osc(o.type ?? 'sine', f);
  P.setF(osc.frequency, f, t);
  if (o.f2 != null && o.f2 !== f) P.expF(osc.frequency, o.f2, t + dur);
  const g = s.gain(0);
  if (o.shape === 'flat') flat(g.gain, t, o.attack ?? 0.005, dur, o.gain ?? 0.2);
  else perc(g.gain, t, o.attack ?? 0.005, dur, o.gain ?? 0.2);
  const filt = o.lp ? s.filter('lowpass', o.lp, o.q ?? 0.707) : o.bp ? s.filter('bandpass', o.bp, o.q ?? 1) : null;
  chain(osc, filt, g, s.out(o.dest ?? E.sfx, o.pan));
  s.play(osc, t, t + dur + 0.02);
  return s.done();
}

// Filtered noise burst with an optional filter sweep (f -> f2).
export function hiss(E, o) {
  const t = fin(o.t, E.now());
  const dur = Math.max(0.02, fin(o.dur, 0.1));
  const s = sound(E);
  const n = s.noise(o.rate ?? 1);
  const fl = s.filter(o.type ?? 'bandpass', o.f ?? 2000, o.q ?? 1);
  if (o.f2 != null) {
    P.setF(fl.frequency, o.f ?? 2000, t);
    P.expF(fl.frequency, o.f2, t + dur);
  }
  const g = s.gain(0);
  if (o.shape === 'flat') flat(g.gain, t, o.attack ?? 0.005, dur, o.gain ?? 0.1);
  else perc(g.gain, t, o.attack ?? 0.003, dur, o.gain ?? 0.1);
  chain(n, fl, g, s.out(o.dest ?? E.sfx, o.pan));
  s.play(n, t, t + dur + 0.02, Math.random() * 0.8);
  return s.done();
}

// Additive bell/metal: partials = [[ratio, amp, decayScale], ...].
const BELL = [
  [1, 1, 1],
  [2.76, 0.4, 0.45],
  [5.4, 0.2, 0.25],
];
export function bell(E, o) {
  const t = fin(o.t, E.now());
  const f = fin(o.f, 880);
  const dur = Math.max(0.03, fin(o.dur, 1));
  const s = sound(E);
  const out = s.out(o.dest ?? E.sfx, o.pan);
  for (const [r, a, d] of o.partials ?? BELL) {
    if (f * r > 16000) continue;
    const osc = s.osc(o.type ?? 'sine', f * r);
    const g = s.gain(0);
    perc(g.gain, t, 0.002, dur * d, (o.gain ?? 0.1) * a);
    chain(osc, g, out);
    s.play(osc, t, t + dur * d + 0.02);
  }
  return s.done();
}

// Play a pre-rendered buffer.
export function sample(E, buf, o) {
  if (!buf) return 0;
  const t = fin(o.t, E.now());
  const rate = clamp(o.rate ?? 1, 0.05, 16);
  const s = sound(E);
  const src = s.buffer(buf, rate);
  const g = s.gain(clamp(o.gain ?? 0.3, 0, 4));
  chain(src, o.lp ? s.filter('lowpass', o.lp, 0.707) : null, g, s.out(o.dest ?? E.sfx, o.pan));
  const len = fin(buf.length, 0) / Math.max(1, fin(buf.sampleRate, 44100));
  s.play(src, t, t + len / rate + 0.02);
  return s.done();
}

// A brassy chord stab (stings): detuned saws through a closing low-pass.
export function stab(E, o) {
  const t = fin(o.t, E.now());
  const dur = Math.max(0.05, fin(o.dur, 0.5));
  const s = sound(E);
  const lp = s.filter('lowpass', 2400, 1.1);
  const env = s.gain(0);
  for (const m of o.notes ?? [48]) {
    const osc = s.osc('sawtooth', midiHz(m));
    osc.connect(lp);
    s.play(osc, t, t + dur + 0.03);
  }
  P.setF(lp.frequency, o.bright ?? 2400, t);
  P.expF(lp.frequency, 280, t + dur);
  perc(env.gain, t, o.attack ?? 0.012, dur, o.gain ?? 0.06);
  chain(lp, env, s.out(o.dest ?? E.sfx, o.pan));
  return s.done();
}

// ---------------------------------------------------------------------------------------
// Pre-rendered one-shot buffers (computed once in JS at unlock; tiny).

function normalize(d, peak) {
  let m = 0;
  for (let i = 0; i < d.length; i++) m = Math.max(m, Math.abs(d[i]));
  if (m > 0) for (let i = 0; i < d.length; i++) d[i] = (d[i] / m) * peak;
}

export function makeBuffers(ctx) {
  const sr = clamp(ctx.sampleRate || 44100, 8000, 192000);
  const make = (sec, fill) => {
    const n = Math.max(1, Math.round(sec * sr));
    const b = ctx.createBuffer(1, n, sr);
    const d = b.getChannelData(0);
    fill(d, sr);
    normalize(d, 0.9);
    return b;
  };
  const TAU = Math.PI * 2;
  return {
    // 1 s of white noise, looped by noise sources (random start offset).
    noise: make(1.0, (d) => {
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }),
    // Keyboard key: high-passed click + plastic tick + low "thock".
    key: make(0.05, (d, r) => {
      let hp = 0;
      let prev = 0;
      for (let i = 0; i < d.length; i++) {
        const t = i / r;
        const w = Math.random() * 2 - 1;
        hp = 0.8 * (hp + w - prev);
        prev = w;
        d[i] =
          hp * Math.exp(-t / 0.004) * 0.7 +
          Math.sin(TAU * 2900 * t) * Math.exp(-t / 0.004) * 0.35 +
          Math.sin(TAU * 230 * t) * Math.exp(-t / 0.012) * 0.5;
      }
    }),
    // Carpet footstep: soft low-passed scuff + a little thump.
    step: make(0.09, (d, r) => {
      let lp = 0;
      for (let i = 0; i < d.length; i++) {
        const t = i / r;
        lp += 0.07 * (Math.random() * 2 - 1 - lp);
        const env = (1 - Math.exp(-t / 0.004)) * Math.exp(-t / 0.028);
        d[i] = lp * 4 * env + Math.sin(TAU * 78 * t) * env * 0.6;
      }
    }),
    // Wall-clock tick: sharp resonant click.
    tick: make(0.035, (d, r) => {
      for (let i = 0; i < d.length; i++) {
        const t = i / r;
        d[i] =
          Math.sin(TAU * 3100 * t) * Math.exp(-t / 0.0025) +
          (Math.random() * 2 - 1) * Math.exp(-t / 0.0008) * 0.6 +
          Math.sin(TAU * 1250 * t) * Math.exp(-t / 0.007) * 0.35;
      }
    }),
  };
}
