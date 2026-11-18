// Sims/Animal-Crossing-style gibberish for speech bubbles.
//
// One utterance = one oscillator (glottal source) whose pitch is automated per syllable, fed
// through two band-pass "formant" filters whose centre frequencies jump to a random vowel per
// syllable, a per-syllable gain envelope, and an optional burst of high-passed noise at syllable
// onsets for consonants. That's ~12-16 nodes per utterance regardless of length.

import { P, fin, clamp, rand, pick, sound, chain } from './synth.js';

// Vowel formants [F1, F2] in Hz (adult-ish; each voice scales them with `fmt`).
const VOWELS = {
  a: [800, 1200],
  ae: [690, 1660],
  e: [480, 1900],
  i: [310, 2250],
  o: [500, 880],
  u: [340, 820],
  uh: [580, 1400],
  oe: [430, 1450],
};

// Voice characters. The engine has the player's and a generic one; a level adds its cast's (level.voices, e.g.
// src/levels/office/voices.js; a level's voice of the same name wins).
//   wave: source waveform. f0: base pitch (Hz). spread: random pitch per syllable (+-fraction).
//   decl: pitch drop across the utterance. syl/gap: syllable/gap length ranges (s). atk: attack (s).
//   fmt: formant scale. q: [Q1, Q2] formant sharpness. mk: formant make-up gain. f2amp: F2 level.
//   body: low-passed direct source level (chestiness). cons: consonant chance; consF: its colour.
//   growl: amplitude-wobble rate (Hz) for gruffness. post: extra filters [type, f, Q, dB].
//   gain: overall level. bounce: alternating up/down pitch (sing-song).
//   pitch: pinned pitches for the voice's one-shot sounds (see sfxPitch), instead of the f0-derived ones.
export const VOICES = {
  // Player: bright and squeaky.
  player: {
    wave: 'square', f0: 430, spread: 0.16, decl: 0.0, syl: [0.06, 0.085], gap: [0.02, 0.035], atk: 0.004,
    fmt: 1.35, q: [3.5, 4.5], mk: 1.6, f2amp: 0.7, body: 0.0, bodyF: 800,
    vowels: ['i', 'e', 'a', 'ae', 'o', 'u'], cons: 0.45, consF: 6000, consAmp: 0.16,
    bounce: 0.18, gain: 0.42,
  },
  // Anyone else (signs, unknown owners).
  generic: {
    wave: 'triangle', f0: 190, spread: 0.1, decl: 0.1, syl: [0.09, 0.13], gap: [0.02, 0.04], atk: 0.01,
    fmt: 1.0, q: [5, 7], mk: 3.0, f2amp: 0.6, body: 0.15, bodyF: 600,
    vowels: ['a', 'e', 'i', 'o', 'u'], cons: 0.35, consF: 4000, consAmp: 0.15,
    gain: 1.2,
  },
};

const RE_Q = /❓|❔|\?/u;
const RE_ANGRY = /😠|😡|🤬|💢|👊|😤/u;
const RE_EXCL = /❗|❕|‼|!/u;

const MAX_SYL = 12; // long bubbles get capped
const MAX_LEN = 2.2; // seconds; longer plans are sped up to fit

// The voice table for a level's voices (level.voices): the engine's plus the level's, built once per level table.
const TABLES = new WeakMap();
export function voicesFor(levelVoices) {
  if (!levelVoices || typeof levelVoices !== 'object') return VOICES;
  let table = TABLES.get(levelVoices);
  if (!table) {
    table = { ...VOICES, ...levelVoices };
    TABLES.set(levelVoices, table);
  }
  return table;
}

// The voice an id speaks with in `table` (voicesFor): its own, else 'generic'.
export function voiceOf(id, table = VOICES) {
  return typeof id === 'string' && Object.hasOwn(table, id) ? id : 'generic';
}

// Pitches for a voice's one-shot sounds (sfx.js notice: Hz, tattle: ratio, grumble: Hz): the generic
// voice's scaled by f0, unless the voice pins its own.
export function sfxPitch(voiceId, table = VOICES) {
  const V = table[voiceOf(voiceId, table)];
  const k = V.f0 / table.generic.f0;
  const pin = V.pitch ?? {};
  return { notice: pin.notice ?? 500 * k, tattle: pin.tattle ?? k, grumble: pin.grumble ?? 220 * k };
}

// Plan an utterance (pure; exported for tests). Times are relative to the start.
// Returns { syl: [{ t, dur, f, f2, vowel, vowel2, cons, amp, atk }], length, q, angry, excl }.
export function planBabble(voiceId, icons, kind = 'speech', table = VOICES) {
  const V = table[voiceOf(voiceId, table)];
  const list = Array.isArray(icons) ? icons.filter((x) => typeof x === 'string') : [];
  const text = list.join('');
  const q = RE_Q.test(text);
  const angry = RE_ANGRY.test(text);
  const excl = RE_EXCL.test(text);
  const alert = kind === 'alert';
  const oh = kind === 'realize'; // "oh!": one rising syllable

  // Words: 2-3 syllables per icon (alerts: a single 1-2 syllable word).
  let words = [];
  if (oh) words.push(1);
  else if (alert) words.push(Math.random() < 0.5 ? 1 : 2);
  else for (let i = 0; i < Math.max(1, list.length); i++) words.push(Math.random() < 0.5 ? 2 : 3);
  let total = words.reduce((a, b) => a + b, 0);
  if (total > MAX_SYL) {
    words = words.map(() => 2);
    while (words.length * 2 > MAX_SYL) words.pop();
    total = words.length * 2;
  }

  const syl = [];
  let t = 0;
  let k = 0;
  for (let w = 0; w < words.length; w++) {
    for (let j = 0; j < words[w]; j++, k++) {
      const p = total > 1 ? k / (total - 1) : 0;
      const last = k === total - 1;
      const wordStart = j === 0;
      let f = V.f0 * (1 + rand(-V.spread, V.spread)) * (1 - V.decl * p);
      if (V.bounce) f *= k % 2 ? 1 - V.bounce * 0.5 : 1 + V.bounce * 0.5;
      if (angry) f *= wordStart ? 1.12 : 0.93;
      if (q && k >= total - 2) f *= last ? 1.28 : 1.1;
      if (excl && last) f *= 1.15;
      if (alert) f *= 1.08;
      let glide = rand(0.94, 1.04);
      if (last) glide = oh ? 1.3 : q ? 1.35 : angry ? 0.8 : excl ? 0.85 : 0.9;
      const dur =
        rand(V.syl[0], V.syl[1]) * (angry ? 0.8 : 1) * (last ? (q ? 1.5 : 1.25) : 1) * (alert ? 0.9 : 1);
      const vowel = pick(V.vowels);
      const vowel2 = Math.random() < 0.3 ? pick(V.vowels) : vowel;
      const cons = Math.random() < V.cons * (angry ? 1.3 : 1);
      const amp = (wordStart ? 1 : rand(0.75, 0.92)) * (angry ? 1.25 : 1);
      const atk = Math.min(angry ? Math.min(V.atk, 0.004) : V.atk, dur * 0.4);
      syl.push({ t, dur, f, f2: f * glide, vowel, vowel2, cons, amp, atk });
      const endOfWord = j === words[w] - 1;
      // (+12 ms when the syllable opens with a consonant: its vowel starts late, see babble())
      t += dur + (cons ? 0.012 : 0) + rand(V.gap[0], V.gap[1]) * (endOfWord ? 2.2 : 1) * (angry ? 0.7 : 1);
    }
  }
  const lastS = syl[syl.length - 1];
  let length = lastS.t + lastS.dur + (lastS.cons ? 0.012 : 0);
  if (length > MAX_LEN) {
    const k2 = MAX_LEN / length;
    for (const s of syl) {
      s.t *= k2;
      s.dur *= k2;
      s.atk = Math.min(s.atk, s.dur * 0.4);
    }
    length = MAX_LEN;
  }
  return { syl, length, q, angry, excl };
}

// Speak. opts: { voiceId, icons, kind, t, pan, gain, muffle (low-pass Hz, 0 = off), dest, voices (a voicesFor table;
// default: the engine's) }.
// Returns { start, end, kill(at) } — kill fades the utterance out in 40 ms.
export function babble(E, opts) {
  const table = opts.voices ?? VOICES;
  const vid = voiceOf(opts.voiceId, table);
  const V = table[vid];
  const plan = planBabble(vid, opts.icons, opts.kind, table);
  const t = fin(opts.t, E.now());
  const end = t + plan.length + 0.06;
  const s = sound(E);

  // Source -> two formant band-passes (+ a little direct body) -> envelope.
  const osc = s.osc(V.wave, plan.syl[0].f);
  const f1 = s.filter('bandpass', 700, V.q[0]);
  const f2 = s.filter('bandpass', 1200, V.q[1]);
  const g1 = s.gain(V.mk);
  const g2 = s.gain(V.mk * V.f2amp);
  const env = s.gain(0);
  chain(osc, f1, g1, env);
  chain(osc, f2, g2, env);
  if (V.body > 0) chain(osc, s.filter('lowpass', V.bodyF, 0.7), s.gain(V.body), env);

  // Gruffness: wobble the amplitude at ~30 Hz.
  let tail = env;
  if (V.growl) {
    const gg = s.gain(0.72);
    const lfo = s.osc('sine', V.growl);
    const depth = s.gain(0.28);
    chain(lfo, depth, gg.gain);
    env.connect(gg);
    tail = gg;
    s.play(lfo, t, end);
  }

  // Post filters (nasal/mumble), then the kill gain, optional muffle, pan.
  let postIn = null;
  for (const [type, f, q, db] of V.post ?? []) {
    const b = s.filter(type, f, q, db ?? 0);
    if (!postIn) postIn = b;
    tail.connect(b);
    tail = b;
  }
  const level = clamp(fin(opts.gain, 1) * V.gain, 0, 3);
  const kill = s.gain(level);
  tail.connect(kill);
  if (!postIn) postIn = kill;
  const muffle = fin(opts.muffle, 0) > 0 ? s.filter('lowpass', opts.muffle, 0.7) : null;
  chain(kill, muffle, s.out(opts.dest ?? E.voice, opts.pan));

  // Consonant noise bursts.
  let nEnv = null;
  let nf = null;
  if (plan.syl.some((x) => x.cons)) {
    const ns = s.noise(1);
    nf = s.filter('highpass', V.consF, 1.2);
    nEnv = s.gain(0);
    chain(ns, nf, nEnv);
    nEnv.connect(postIn); // skips the vowel envelope/growl, still gets the voice's post filters
    s.play(ns, t, end, Math.random() * 0.8);
  }

  // Per-syllable automation (always in chronological order per param).
  for (const x of plan.syl) {
    const t0 = t + x.t;
    const tv = t0 + (x.cons ? 0.012 : 0); // vowel starts after the consonant tick
    const d = x.dur;
    P.setF(osc.frequency, x.f, tv);
    P.expF(osc.frequency, x.f2, tv + d);
    const [a1, a2] = VOWELS[x.vowel];
    const [b1, b2] = VOWELS[x.vowel2];
    P.setF(f1.frequency, a1 * V.fmt, tv);
    P.ramp(f1.frequency, b1 * V.fmt, tv + d);
    P.setF(f2.frequency, a2 * V.fmt, tv);
    P.ramp(f2.frequency, b2 * V.fmt, tv + d);
    P.set(env.gain, 0, tv);
    P.ramp(env.gain, x.amp, tv + x.atk);
    P.ramp(env.gain, x.amp * 0.7, tv + Math.max(x.atk + 0.005, d * 0.7));
    P.ramp(env.gain, 0, tv + d);
    if (x.cons && nEnv) {
      P.setF(nf.frequency, V.consF * rand(0.7, 1.4), t0);
      P.set(nEnv.gain, 0, t0);
      P.ramp(nEnv.gain, V.consAmp * x.amp, t0 + 0.004);
      P.ramp(nEnv.gain, 0, t0 + 0.02 + rand(0, 0.012));
    }
  }
  s.play(osc, t, end);
  s.done();

  let killed = false;
  return {
    start: t,
    end,
    kill(at) {
      if (killed) return;
      killed = true;
      const a = Math.max(t, fin(at, t));
      if (a >= end) return;
      P.set(kill.gain, level, a);
      P.ramp(kill.gain, 0, a + 0.04);
    },
  };
}

// Closed-mouth "hmm" for thought bubbles (rises into "hm?" when the thought is a question).
export function hum(E, opts) {
  const table = opts.voices ?? VOICES;
  const vid = voiceOf(opts.voiceId, table);
  const V = table[vid];
  const t = fin(opts.t, E.now());
  const q = RE_Q.test((opts.icons ?? []).join(''));
  const f = V.f0 * (vid === 'player' ? 0.75 : 1) * (q ? 1.05 : 1);
  const dur = rand(0.3, 0.42);
  const s = sound(E);
  const osc = s.osc('triangle', f);
  const lp = s.filter('lowpass', Math.max(320, f * 2.4), 0.8);
  const g = s.gain(0);
  P.setF(osc.frequency, f * 1.02, t);
  if (q) {
    P.expF(osc.frequency, f * 0.97, t + dur * 0.45);
    P.expF(osc.frequency, f * 1.4, t + dur);
  } else {
    P.expF(osc.frequency, f * 0.93, t + dur * 0.6);
    P.expF(osc.frequency, f * 0.98, t + dur);
  }
  const pk = 0.28 * clamp(fin(opts.gain, 1), 0, 3);
  P.set(g.gain, 0, t);
  P.ramp(g.gain, pk, t + 0.05);
  P.ramp(g.gain, pk * 0.75, t + dur * 0.7);
  P.ramp(g.gain, 0, t + dur);
  chain(osc, lp, g, s.out(opts.dest ?? E.voice, opts.pan));
  s.play(osc, t, t + dur + 0.02);
  s.done();
  return { start: t, end: t + dur, kill() {} };
}
