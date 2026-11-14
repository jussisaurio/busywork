// Quiet office muzak: an 8-bar F-major bossa loop with a soft FM electric piano, a round
// triangle bass and a vibraphone-ish melody. Notes are scheduled a little ahead from update()
// (lookahead scheduler), so nothing is created on frames where no note starts.
// During fast-forward the tempo speeds up and the pitch rises (sqrt of the rate: tape-ish
// but not chipmunk). It ducks under babble.

import { P, fin, clamp, midiHz, sound, chain, perc, EPS } from './synth.js';

const BPM = 92;
const EIGHTH = 60 / BPM / 2; // seconds per eighth note at rate 1
const LOOKAHEAD = 0.12; // seconds scheduled ahead of currentTime
const DUCK = 0.35; // music level under babble
const STRUM = 0.012; // seconds between chord notes

// ch: e-piano voicing (MIDI), bass: root, mel: [[midi, startEighth, lengthEighths], ...]
const BARS = [
  { ch: [57, 60, 64], bass: 41, mel: [[69, 0, 3], [67, 3, 1], [69, 4, 2], [72, 6, 2]] }, // Fmaj7
  { ch: [57, 60, 65], bass: 50, mel: [[74, 0, 4], [72, 4, 2], [69, 6, 2]] }, // Dm7
  { ch: [58, 62, 65], bass: 43, mel: [[70, 0, 3], [69, 3, 1], [67, 4, 2], [65, 6, 2]] }, // Gm7
  { ch: [58, 62, 64], bass: 48, mel: [[64, 0, 4], [67, 4, 4]] }, // C9
  { ch: [55, 60, 64], bass: 45, mel: [[72, 0, 3], [76, 3, 1], [74, 4, 2], [72, 6, 2]] }, // Am7
  { ch: [54, 57, 60], bass: 50, mel: [[69, 0, 3], [66, 3, 1], [69, 4, 2], [72, 6, 2]] }, // D7
  { ch: [53, 58, 62], bass: 43, mel: [[70, 0, 4], [69, 4, 2], [67, 6, 2]] }, // Gm7
  { ch: [52, 58, 62], bass: 48, mel: [[64, 0, 6]] }, // C9
];
const STEPS = BARS.length * 8;
const fifth = (root) => (root + 7 <= 52 ? root + 7 : root - 5);

export function createMusic(E, out) {
  const ctx = E.ctx;
  let built = false;
  let lp, duck, level;
  let playing = false;
  let step = 0;
  let cycle = 0;
  let next = 0;
  let rate = 1;
  let duckOn = false;
  let levelTarget = 0;
  let holdUntil = 0; // silent until the restart point

  // Persistent chain (built on first play): notes -> lowpass -> tremolo -> duck -> level -> out.
  function build() {
    built = true;
    lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2600;
    lp.Q.value = 0.5;
    const trem = ctx.createGain();
    trem.gain.value = 0.9;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 4.6;
    const depth = ctx.createGain();
    depth.gain.value = 0.1;
    duck = ctx.createGain();
    duck.gain.value = 1;
    level = ctx.createGain();
    level.gain.value = 0;
    chain(lfo, depth, trem.gain);
    chain(lp, trem, duck, level, out);
    lfo.start(); // the one long-lived source: a 4.6 Hz tremolo LFO
  }

  // Soft FM electric piano (carrier + 1:1 modulator with a decaying index).
  function epiano(t, midi, dur, vel, pm) {
    const f = midiHz(midi) * pm;
    const s = sound(E);
    const car = s.osc('sine', f);
    const mod = s.osc('sine', f);
    const mg = s.gain(0);
    const env = s.gain(0);
    const rel = Math.min(2.0, dur + 0.5);
    P.set(mg.gain, f * 1.6 * vel, t);
    P.exp(mg.gain, f * 0.25, t + 0.5);
    P.set(env.gain, 0, t);
    P.ramp(env.gain, 0.15 * vel, t + 0.004);
    P.exp(env.gain, 0.05 * vel, t + clamp(dur, 0.1, rel - 0.05));
    P.exp(env.gain, EPS, t + rel);
    chain(mod, mg, car.frequency);
    chain(car, env, lp);
    s.play(car, t, t + rel + 0.02);
    s.play(mod, t, t + rel + 0.02);
    s.done();
  }

  function bass(t, midi, dur, vel, pm) {
    const s = sound(E);
    const osc = s.osc('triangle', midiHz(midi) * pm);
    const env = s.gain(0);
    const d = Math.min(dur + 0.15, 1.2);
    perc(env.gain, t, 0.008, d, 0.3 * vel);
    chain(osc, env, lp);
    s.play(osc, t, t + d + 0.02);
    s.done();
  }

  // Vibraphone-ish: sine + a quickly fading 4th partial.
  function vibes(t, midi, dur, vel, pm) {
    const f = midiHz(midi) * pm;
    const s = sound(E);
    const o1 = s.osc('sine', f);
    const o2 = s.osc('sine', f * 4);
    const g2 = s.gain(0);
    const env = s.gain(0);
    const d = Math.min(dur + 0.6, 1.8);
    perc(g2.gain, t, 0.002, 0.15, 0.25);
    perc(env.gain, t, 0.004, d, 0.13 * vel);
    chain(o2, g2, env);
    chain(o1, env, lp);
    s.play(o1, t, t + d + 0.02);
    s.play(o2, t, t + 0.17);
    s.done();
  }

  function scheduleStep(st, t) {
    const B = BARS[Math.floor(st / 8)];
    const e = st % 8;
    const pm = Math.sqrt(rate);
    const len = (n) => (n * EIGHTH) / rate;
    const chord = (vel, n) => B.ch.forEach((m, i) => epiano(t + i * STRUM, m, len(n), vel, pm));
    if (e === 0) {
      chord(0.9, 3);
      bass(t, B.bass, len(3), 1, pm);
    } else if (e === 3) {
      chord(0.55, 2);
    } else if (e === 4) {
      bass(t, fifth(B.bass), len(3), 0.8, pm);
    }
    // Melody on two cycles out of three (a little variety on a 21 s loop).
    if (cycle % 3 !== 2) for (const [m, s0, l] of B.mel) if (s0 === e) vibes(t, m, len(l), 0.8, pm);
  }

  return {
    // o: { play, duck, rate, level }
    update(dt, o) {
      const now = fin(ctx.currentTime, 0);
      const want = !!o.play;
      if (want && !built) build();
      if (!built) return;
      const lvl = want && now >= holdUntil ? clamp(fin(o.level, 1), 0, 1) : 0;
      if (Math.abs(lvl - levelTarget) > 0.01) {
        P.to(level.gain, lvl, now, lvl > levelTarget ? 0.25 : 0.12);
        levelTarget = lvl;
      }
      if (!!o.duck !== duckOn) {
        duckOn = !!o.duck;
        P.to(duck.gain, duckOn ? DUCK : 1, now, duckOn ? 0.05 : 0.3);
      }
      rate += (clamp(fin(o.rate, 1), 0.5, 2) - rate) * Math.min(1, clamp(dt, 0, 0.25) * 3);
      if (!want) {
        playing = false;
        return;
      }
      if (!playing) {
        playing = true;
        if (next < now) next = now + 0.05;
      }
      if (next < now - 0.25) next = now + 0.05; // stalled (hidden tab): skip ahead, don't burst
      let n = 0;
      while (next < now + LOOKAHEAD + clamp(dt, 0, 0.1) && n++ < 6) {
        scheduleStep(step, next);
        step = (step + 1) % STEPS;
        if (step === 0) cycle++;
        next += EIGHTH / rate;
      }
    },
    // Start from the top after `delay` seconds (new loop).
    restart(delay = 0) {
      step = 0;
      cycle = 0;
      next = fin(ctx.currentTime, 0) + Math.max(0, fin(delay, 0));
      holdUntil = next - 0.03;
      if (built) {
        P.to(level.gain, 0, ctx.currentTime, 0.05);
        levelTarget = 0;
      }
    },
    // Cut the music fast (record scratch, end of day).
    kill() {
      if (!built) return;
      P.to(level.gain, 0, ctx.currentTime, 0.03);
      levelTarget = 0;
      playing = false;
    },
  };
}
