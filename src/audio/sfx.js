// One-shot sound effects, all synthesized. Each recipe takes (E, o) with
// o = { t?, pan?, gain? (multiplier) } plus recipe-specific fields, and builds short-lived nodes.

import { P, fin, clamp, rand, midiHz, sound, chain, tone, hiss, bell, sample, stab } from './synth.js';

const T = (E, o) => fin(o?.t, E.now());
const G = (o) => clamp(fin(o?.gain, 1), 0, 3);

// ☕ Coffee machine: boiler rumble, steam hiss, bubbles.
export function gurgle(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  hiss(E, { t, dur: 1.0, attack: 0.15, gain: 0.05 * g, type: 'bandpass', f: 2200, f2: 1500, q: 0.9, pan });
  hiss(E, { t, dur: 0.95, attack: 0.1, gain: 0.07 * g, type: 'lowpass', f: 240, q: 0.7, pan });
  for (let i = 0; i < 9; i++) {
    const f = rand(170, 420);
    tone(E, { t: t + 0.05 + Math.random() * 0.85, f, f2: f * rand(1.5, 2.2), dur: rand(0.04, 0.07), gain: 0.07 * g, pan });
  }
}

// Coffee ready: two polite beeps.
export function machineBeep(E, o = {}) {
  const t = T(E, o), g = G(o);
  for (let i = 0; i < 2; i++) tone(E, { t: t + i * 0.12, f: 1760, dur: 0.06, shape: 'flat', gain: 0.045 * g, pan: o.pan });
}

// Coffee being poured (start of the spill).
export function pour(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  hiss(E, { t, dur: 1.0, attack: 0.2, gain: 0.07 * g, type: 'bandpass', f: 1000, f2: 1300, q: 3, pan });
  for (let i = 0; i < 4; i++) {
    const f = rand(500, 900);
    tone(E, { t: t + 0.2 + Math.random() * 0.8, f, f2: f * 1.6, dur: 0.04, gain: 0.04 * g, pan });
  }
}

// 🚽 A flush: the lever clunk, a roaring swirl that drains away, the cistern hissing as it fills.
export function flush(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  tone(E, { t, f: 180, f2: 120, dur: 0.05, gain: 0.08 * g, pan });
  hiss(E, { t: t + 0.05, dur: 1.3, attack: 0.08, gain: 0.16 * g, type: 'bandpass', f: 700, f2: 260, q: 0.8, pan });
  hiss(E, { t: t + 0.1, dur: 1.1, attack: 0.15, gain: 0.08 * g, type: 'lowpass', f: 300, f2: 120, q: 0.7, pan });
  for (let i = 0; i < 6; i++) {
    const f = rand(160, 320);
    tone(E, { t: t + 0.6 + Math.random() * 0.7, f, f2: f * 0.6, dur: 0.06, gain: 0.05 * g, pan });
  }
  hiss(E, { t: t + 1.3, dur: 0.9, attack: 0.2, gain: 0.04 * g, type: 'bandpass', f: 3200, q: 2, pan });
}

// 💥 Liquid meets electronics: splash, then an electric zap and a power-down whine.
export function splashZap(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  hiss(E, { t, dur: 0.4, gain: 0.2 * g, type: 'lowpass', f: 4000, f2: 500, q: 0.8, pan });
  hiss(E, { t: t + 0.02, dur: 0.25, gain: 0.07 * g, type: 'bandpass', f: 1800, f2: 900, q: 1.5, pan });
  for (let i = 0; i < 5; i++) {
    const f = rand(700, 1400);
    tone(E, { t: t + 0.08 + Math.random() * 0.4, f, f2: f * 1.5, dur: 0.04, gain: 0.04 * g, pan });
  }
  // Zap: a square wave jumping between random pitches, with crackly level.
  const tz = t + 0.15;
  const s = sound(E);
  const osc = s.osc('square', 300);
  const bp = s.filter('bandpass', 1600, 1.2);
  const env = s.gain(0);
  P.set(env.gain, 0, tz);
  for (let k = 0; k < 18; k++) {
    const tk = tz + 0.004 + k * 0.022;
    P.setF(osc.frequency, rand(90, 1100), tk);
    P.set(env.gain, rand(0.35, 1) * 0.09 * g, tk);
  }
  P.ramp(env.gain, 0, tz + 0.43);
  chain(osc, bp, env, s.out(E.sfx, pan));
  s.play(osc, tz, tz + 0.45);
  s.done();
  hiss(E, { t: tz, dur: 0.35, gain: 0.05 * g, type: 'highpass', f: 5000, q: 0.7, pan });
  tone(E, { t: tz + 0.3, f: 900, f2: 50, dur: 0.7, attack: 0.01, gain: 0.045 * g, pan });
}

// 🪪 Keycard lifted: a little key-ring jingle.
export function jingle(E, o = {}) {
  const t = T(E, o), g = G(o);
  for (let i = 0; i < 6; i++) {
    bell(E, {
      t: t + i * 0.045 + rand(0, 0.02), f: rand(2400, 3800), dur: rand(0.12, 0.2), gain: 0.04 * g * rand(0.6, 1),
      partials: [[1, 1, 1], [2.6, 0.5, 0.6]], pan: o.pan,
    });
  }
}

// Low fridge compressor hum.
function fridgeHum(E, t, dur, gain, pan) {
  const s = sound(E);
  const osc = s.osc('sawtooth', 60);
  const lp = s.filter('lowpass', 380, 0.9);
  const env = s.gain(0);
  P.set(env.gain, 0, t);
  P.ramp(env.gain, gain, t + 0.1);
  P.ramp(env.gain, gain, t + dur * 0.6);
  P.ramp(env.gain, 0, t + dur);
  chain(osc, lp, env, s.out(E.sfx, pan));
  s.play(osc, t, t + dur + 0.02);
  s.done();
}

// 🥪 Fridge door opens (seal pop + hum).
export function fridgeOpen(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  hiss(E, { t, dur: 0.12, gain: 0.1 * g, type: 'lowpass', f: 700, f2: 200, q: 1, pan });
  tone(E, { t, f: 130, f2: 70, dur: 0.12, gain: 0.1 * g, pan });
  fridgeHum(E, t + 0.05, o.short ? 0.5 : 0.9, 0.05 * g, pan);
}

// Fridge door thunks shut.
export function fridgeClose(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  fridgeHum(E, t, 0.3, 0.04 * g, pan);
  const tc = t + 0.12;
  tone(E, { t: tc, f: 100, f2: 48, dur: 0.2, attack: 0.002, gain: 0.26 * g, pan });
  hiss(E, { t: tc, dur: 0.1, gain: 0.14 * g, type: 'lowpass', f: 380, q: 0.8, pan });
  hiss(E, { t: tc + 0.01, dur: 0.08, gain: 0.06 * g, type: 'bandpass', f: 300, q: 1, pan });
}

// 😋 Munch munch munch, gulp.
export function munch(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  for (const k of [0, 0.24, 0.5]) {
    const tk = t + k + rand(-0.02, 0.02);
    const s = sound(E);
    const n = s.noise(1);
    const bp = s.filter('bandpass', rand(1400, 2400), 0.8);
    const env = s.gain(0);
    P.set(env.gain, 0, tk);
    for (let j = 0; j < 7; j++) P.set(env.gain, rand(0.2, 1) * 0.11 * g, tk + 0.002 + j * 0.012);
    P.ramp(env.gain, 0, tk + 0.11);
    chain(n, bp, env, s.out(E.sfx, pan));
    s.play(n, tk, tk + 0.12, Math.random() * 0.8);
    s.done();
    tone(E, { t: tk, f: 160, f2: 90, dur: 0.07, gain: 0.08 * g, pan });
  }
  tone(E, { t: t + 0.8, f: 420, f2: 140, dur: 0.14, gain: 0.1 * g, lp: 900, pan });
}

// Item dropped at the player's feet. o.type: what it sounds like ('card', 'soft', 'mug'; else a thud).
export function drop(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  switch (o.type) {
    case 'card':
      tone(E, { t, type: 'triangle', f: 1500, f2: 1100, dur: 0.04, gain: 0.06 * g, pan });
      tone(E, { t: t + 0.07, type: 'triangle', f: 1250, f2: 900, dur: 0.03, gain: 0.035 * g, pan });
      break;
    case 'soft':
      tone(E, { t, f: 210, f2: 90, dur: 0.09, gain: 0.12 * g, lp: 800, pan });
      hiss(E, { t, dur: 0.06, gain: 0.05 * g, type: 'lowpass', f: 700, pan });
      break;
    case 'mug':
      bell(E, { t, f: 2100, dur: 0.25, gain: 0.04 * g, pan });
      hiss(E, { t: t + 0.01, dur: 0.2, gain: 0.04 * g, type: 'bandpass', f: 900, q: 2, pan });
      break;
    default:
      tone(E, { t, f: 150, f2: 70, dur: 0.1, gain: 0.12 * g, pan });
  }
}

// Item picked up: quick rising pip + rustle.
export function pickup(E, o = {}) {
  const t = T(E, o), g = G(o);
  tone(E, { t, f: 620, f2: 1150, dur: 0.07, gain: 0.05 * g, pan: o.pan });
  hiss(E, { t, dur: 0.07, gain: 0.025 * g, type: 'bandpass', f: 3000, q: 1, pan: o.pan });
}

// 🪑 Office-chair creak: a stick-slip sawtooth through a resonant band-pass, plus a cushion "pff".
export function creak(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan, up = !!o.up;
  if (!up) hiss(E, { t, dur: 0.16, gain: 0.12 * g, type: 'lowpass', f: 900, f2: 300, q: 0.7, pan });
  const t0 = t + (up ? 0 : 0.06);
  const dur = up ? 0.16 : 0.3;
  const s = sound(E);
  const osc = s.osc('sawtooth', 140);
  const bp = s.filter('bandpass', up ? 1400 : 1100, 6);
  const env = s.gain(0);
  for (let tt = t0; tt < t0 + dur; tt += rand(0.012, 0.03)) P.setF(osc.frequency, rand(95, 210) * (up ? 1.2 : 1), tt);
  P.set(env.gain, 0, t0);
  P.ramp(env.gain, 0.17 * g * (up ? 0.6 : 1), t0 + 0.03);
  P.ramp(env.gain, 0.11 * g * (up ? 0.6 : 1), t0 + dur * 0.7);
  P.ramp(env.gain, 0, t0 + dur);
  chain(osc, bp, env, s.out(E.sfx, pan));
  s.play(osc, t0, t0 + dur + 0.02);
  s.done();
}

// 📁 Look busy: paper shuffle (typing: one soft swish; phone: swish + pickup bips).
export function shuffle(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  const n = o.pose === 'folder' || o.pose == null ? 3 : 1;
  const soft = o.pose === 'typing' ? 0.6 : 1;
  for (let i = 0; i < n; i++) {
    hiss(E, {
      t: t + i * 0.075 + rand(0, 0.02), dur: rand(0.07, 0.11), attack: 0.01, gain: 0.1 * g * soft,
      type: 'bandpass', f: rand(2800, 4200), f2: rand(1800, 2600), q: 1.1, pan,
    });
  }
  if (o.pose === 'phone') {
    tone(E, { t: t + 0.12, f: 1400, dur: 0.05, shape: 'flat', gain: 0.02 * g, pan });
    tone(E, { t: t + 0.2, f: 1400, dur: 0.05, shape: 'flat', gain: 0.02 * g, pan });
  }
}

// 🤤☕ … 😌 Kev gets a coffee at last: a delighted "ooh" (rising), then a long slurp.
export function slurp(E, o = {}) {
  const t = T(E, o); const g = G(o); const pan = o.pan;
  tone(E, { t, type: 'triangle', f: 330, f2: 560, dur: 0.22, attack: 0.03, gain: 0.05 * g, lp: 1600, pan });
  hiss(E, { t: t + 1.3, dur: 0.45, attack: 0.05, gain: 0.07 * g, type: 'bandpass', f: 900, f2: 2400, q: 4, pan });
  tone(E, { t: t + 1.8, type: 'triangle', f: 520, f2: 390, dur: 0.3, attack: 0.04, gain: 0.04 * g, lp: 1200, pan }); // "ahh"
}

// ❓ Soft "hm?" blip, pitched to the witness (o.f, babble.js sfxPitch).
export function notice(E, o = {}) {
  const base = fin(o.f, 500);
  tone(E, { t: T(E, o), type: 'triangle', f: base, f2: base * 1.45, dur: 0.14, attack: 0.02, gain: 0.05 * G(o), lp: 1800, pan: o.pan });
}

// ❗👉 Tattle: the playground "nyah-nyah" (falling minor third, sol-mi-la-sol-mi), pitched per witness
// (o.k, a ratio: babble.js sfxPitch).
export function tattle(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  const k = fin(o.k, 1);
  const notes = [784, 659, 880, 784, 659].map((f) => f * k);
  const durs = [0.13, 0.13, 0.09, 0.09, 0.2];
  let at = t;
  for (let i = 0; i < notes.length; i++) {
    tone(E, { t: at, type: 'triangle', f: notes[i], dur: durs[i], attack: 0.01, gain: 0.045 * g, lp: 2600, pan });
    at += durs[i] + 0.02;
  }
}

// 😠☕ "Hey, that's mine": a short low two-tone grumble, pitched per witness (o.f, babble.js sfxPitch).
export function grumble(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  const base = fin(o.f, 220);
  tone(E, { t, type: 'sawtooth', f: base, f2: base * 0.9, dur: 0.16, attack: 0.01, gain: 0.035 * g, lp: 700, pan });
  tone(E, { t: t + 0.19, type: 'sawtooth', f: base * 0.85, f2: base * 0.75, dur: 0.22, attack: 0.01, gain: 0.035 * g, lp: 600, pan });
}

// 👔❓ Boss starts noticing you: two low woodblock ticks.
export function tension(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  tone(E, { t, type: 'triangle', f: 196, f2: 188, dur: 0.1, attack: 0.003, gain: 0.08 * g, lp: 900, pan });
  tone(E, { t: t + 0.2, type: 'triangle', f: 208, f2: 200, dur: 0.1, attack: 0.003, gain: 0.08 * g, lp: 900, pan });
  tone(E, { t, f: 98, dur: 0.35, gain: 0.05 * g, pan });
}

// Sad trombone: wah, wah, wah, waaaah (sawtooth + wah filter, vibrato on the last note).
export function sadTrombone(E, o = {}) {
  const t = T(E, o), g = G(o);
  const notes = [58, 57, 56, 55].map(midiHz);
  const durs = [0.28, 0.28, 0.28, 0.95];
  const s = sound(E);
  const osc = s.osc('sawtooth', notes[0]);
  const lp = s.filter('lowpass', 400, 2);
  const env = s.gain(0);
  const lfo = s.osc('sine', 5.5);
  const vib = s.gain(0);
  chain(lfo, vib, osc.frequency);
  let tt = t;
  for (let i = 0; i < 4; i++) {
    const f = notes[i], d = durs[i];
    P.setF(osc.frequency, f * 1.01, tt);
    P.expF(osc.frequency, f * (i === 3 ? 0.96 : 0.995), tt + d * 0.9);
    P.setF(lp.frequency, 350, tt);
    P.ramp(lp.frequency, 1500, tt + 0.07);
    P.ramp(lp.frequency, 650, tt + d * 0.9);
    P.set(env.gain, 0, tt);
    P.ramp(env.gain, 0.1 * g, tt + 0.03);
    P.ramp(env.gain, 0.08 * g, tt + d * 0.85);
    P.ramp(env.gain, 0, tt + d * 0.97);
    if (i === 3) {
      P.set(vib.gain, 0, tt + 0.15);
      P.ramp(vib.gain, 5, tt + 0.4);
    }
    tt += d;
  }
  chain(osc, lp, env, s.out(E.sfx, o.pan));
  s.play(osc, t, tt + 0.05);
  s.play(lfo, t, tt + 0.05);
  s.done();
}

// 📄👉 Work assigned: heavy paper-stack thud, then the sad trombone.
export function workAssigned(E, o = {}) {
  const t = T(E, o), g = G(o);
  tone(E, { t, f: 85, f2: 38, dur: 0.3, attack: 0.002, gain: 0.3 * g });
  hiss(E, { t, dur: 0.18, gain: 0.18 * g, type: 'lowpass', f: 700, f2: 200 });
  hiss(E, { t, dur: 0.08, gain: 0.07 * g, type: 'bandpass', f: 2400, q: 1 });
  sadTrombone(E, { t: t + 0.35, gain: g });
}

// Work done: little relieved pling-plong.
export function relief(E, o = {}) {
  const t = T(E, o), g = G(o);
  tone(E, { t, type: 'triangle', f: 1046.5, dur: 0.18, gain: 0.04 * g });
  tone(E, { t: t + 0.12, type: 'triangle', f: 1568, dur: 0.35, gain: 0.04 * g });
}

// Record scratch: band-passed noise and a saw whipped up and down.
export function scratch(E, o = {}) {
  const t = T(E, o), g = G(o);
  const s = sound(E);
  const n = s.noise(1);
  const bp = s.filter('bandpass', 300, 3);
  const osc = s.osc('sawtooth', 100);
  const lp = s.filter('lowpass', 2000, 0.7);
  const og = s.gain(0.3);
  const env = s.gain(0);
  const pts = [[0, 300], [0.07, 2600], [0.13, 400], [0.2, 1900], [0.3, 180]];
  pts.forEach(([dt, f], i) => {
    const fn = i ? P.expF : P.setF;
    fn(bp.frequency, f, t + dt);
    fn(osc.frequency, f * 0.35, t + dt);
  });
  P.set(env.gain, 0, t);
  P.ramp(env.gain, 0.2 * g, t + 0.01);
  P.ramp(env.gain, 0.15 * g, t + 0.25);
  P.ramp(env.gain, 0, t + 0.33);
  chain(n, bp, env);
  chain(osc, lp, og, env);
  env.connect(E.sfx);
  s.play(n, t, t + 0.35, Math.random() * 0.5);
  s.play(osc, t, t + 0.35);
  s.done();
}

// 🚨 Caught: record scratch, then "dun... DUNNN".
export function caught(E, o = {}) {
  const t = T(E, o), g = G(o);
  scratch(E, { t, gain: g });
  stab(E, { t: t + 0.42, notes: [43, 46, 49], dur: 0.14, gain: 0.05 * g });
  stab(E, { t: t + 0.62, notes: [42, 45, 48, 54], dur: 1.1, gain: 0.06 * g });
}

// 🔧 Wrench clank (inharmonic metal partials).
const METAL = [[1, 1, 0.7], [2.32, 0.6, 0.5], [3.97, 0.4, 0.35], [5.86, 0.25, 0.25]];
export function clank(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  bell(E, { t, f: 620, dur: 0.35, gain: 0.06 * g, partials: METAL, pan });
  sample(E, E.buffers.key, { t, rate: 0.5, gain: 0.1 * g, pan });
  if (!o.soft) bell(E, { t: t + 0.14, f: 540, dur: 0.3, gain: 0.045 * g, partials: METAL, pan });
}

// 📽️ Fixed: ratchet, then a bright "ding".
export function fixed(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  for (let i = 0; i < 9; i++) sample(E, E.buffers.key, { t: t + i * 0.032, rate: 1.5 + (i % 2) * 0.2, gain: 0.08 * g, pan, lp: 5000 });
  bell(E, {
    t: t + 0.38, f: 1568, dur: 1.4, gain: 0.07 * g, pan,
    partials: [[1, 1, 1], [2, 0.35, 0.6], [3.01, 0.15, 0.35], [4.2, 0.08, 0.2]],
  });
}

// 🛗 Elevator ding-dong.
export function elevatorDing(E, o = {}) {
  const t = T(E, o), g = G(o);
  const partials = [[1, 1, 1], [2, 0.3, 0.6], [3, 0.12, 0.4]];
  bell(E, { t, f: 1318.5, dur: 1.5, gain: 0.06 * g, partials, pan: o.pan });
  bell(E, { t: t + 0.4, f: 1046.5, dur: 1.9, gain: 0.06 * g, partials, pan: o.pan });
}

// ☎️ A desk phone ringing: one burst of an electromechanical bell, the clapper striking about 20 times a second
// between two small gongs. A level repeats it while the phone rings (o.dur: burst length, default 0.6 s).
export function phoneRing(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  const dur = clamp(fin(o.dur, 0.6), 0.1, 2);
  const partials = [[1, 1, 1], [2.76, 0.35, 0.5], [5.4, 0.12, 0.3]];
  for (let i = 0, n = Math.round(dur * 20); i < n; i++) {
    bell(E, { t: t + i * 0.05, f: i % 2 ? 1568 : 1318.5, dur: 0.12, gain: 0.03 * g, partials, pan });
  }
}

// 🚻 Restroom door (open: latch then thump; close: thump then latch).
export function door(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  tone(E, { t: t + (o.open ? 0.06 : 0), f: 120, f2: 70, dur: 0.12, gain: 0.07 * g, lp: 400, pan });
  sample(E, E.buffers.key, { t: t + (o.open ? 0 : 0.08), rate: 0.7, gain: 0.05 * g, pan, lp: 2500 });
}

// Muffled thumps on the glass entrance door (+ a faint glass ring).
export function bang(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  const hits = clamp(fin(o.hits, 3), 1, 4);
  for (let i = 0; i < hits; i++) {
    const th = t + i * 0.17 + rand(0, 0.02);
    tone(E, { t: th, f: 100, f2: 55, dur: 0.16, attack: 0.002, gain: 0.22 * g, pan });
    hiss(E, { t: th, dur: 0.1, gain: 0.12 * g, type: 'lowpass', f: 380, q: 0.8, pan });
    tone(E, { t: th, f: 2350, dur: 0.3, gain: 0.008 * g, pan });
  }
}

// 🚪🪪 Locked out: handle rattle, then one thump.
export function rattle(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  for (let i = 0; i < 5; i++) sample(E, E.buffers.key, { t: t + i * 0.07 + rand(0, 0.02), rate: rand(0.8, 1.1), gain: 0.07 * g, pan, lp: 1800 });
  bang(E, { t: t + 0.45, pan, gain: g * 0.8, hits: 1 });
}

// Access denied: a push bar clacks against the lock, and the card reader gives one short, low buzz.
export function denied(E, o = {}) {
  const t = T(E, o), g = G(o), pan = o.pan;
  tone(E, { t, f: 140, f2: 80, dur: 0.08, attack: 0.002, gain: 0.16 * g, pan });
  hiss(E, { t, dur: 0.05, gain: 0.08 * g, type: 'bandpass', f: 1400, q: 1.2, pan });
  tone(E, { t: t + 0.14, type: 'square', f: 118, dur: 0.32, attack: 0.01, shape: 'flat', gain: 0.03 * g, lp: 900, pan });
  tone(E, { t: t + 0.14, type: 'sawtooth', f: 236, dur: 0.32, attack: 0.01, shape: 'flat', gain: 0.015 * g, lp: 1200, pan });
}

// Swish (sandwich snatched back).
export function swish(E, o = {}) {
  hiss(E, { t: T(E, o), dur: 0.16, attack: 0.02, gain: 0.13 * G(o), type: 'bandpass', f: 2600, f2: 1100, q: 1.2, pan: o.pan });
}

// Cloth rustle (boss puts on his jacket).
export function rustle(E, o = {}) {
  const t = T(E, o), g = G(o);
  for (let i = 0; i < 3; i++) {
    hiss(E, { t: t + i * 0.13 + rand(0, 0.03), dur: 0.12, attack: 0.03, gain: 0.08 * g, type: 'bandpass', f: rand(1200, 1900), q: 0.8, pan: o.pan });
  }
}

// ⟳ New loop: tape-rewind whoosh, then an alarm-clock "bee-beep".
export function rewind(E, o = {}) {
  const t = T(E, o), g = G(o);
  hiss(E, { t, dur: 0.55, attack: 0.25, gain: 0.08 * g, type: 'bandpass', f: 300, f2: 4500, q: 1.8 });
  const s = sound(E);
  const osc = s.osc('sawtooth', 160);
  const lp = s.filter('lowpass', 1800, 0.8);
  const env = s.gain(0);
  P.setF(osc.frequency, 160, t);
  P.expF(osc.frequency, 1500, t + 0.5);
  P.set(env.gain, 0, t);
  for (let k = 0; k < 12; k++) P.ramp(env.gain, (k % 2 ? 0.012 : 0.035) * g, t + 0.04 * (k + 1));
  P.ramp(env.gain, 0, t + 0.52);
  chain(osc, lp, env, E.sfx);
  s.play(osc, t, t + 0.55);
  s.done();
  const ta = t + 0.62;
  for (let i = 0; i < 2; i++) tone(E, { t: ta + i * 0.13, type: 'square', f: 1760, dur: 0.08, shape: 'flat', gain: 0.03 * g, lp: 4000 });
}

// 🎉 Win: jaunty little "ta-da-da-da-DAAA".
export function winJingle(E, o = {}) {
  const t = T(E, o), g = G(o);
  const seq = [[77, 0, 0.1], [81, 0.1, 0.1], [84, 0.2, 0.1], [81, 0.3, 0.08], [89, 0.42, 0.55]];
  for (const [m, dt, d] of seq) {
    tone(E, { t: t + dt, type: 'square', f: midiHz(m), dur: d, shape: 'flat', gain: 0.03 * g, lp: 3500 });
    tone(E, { t: t + dt, type: 'triangle', f: midiHz(m - 12), dur: d + 0.1, gain: 0.05 * g });
  }
  tone(E, { t, type: 'triangle', f: midiHz(53), dur: 0.25, gain: 0.08 * g });
  tone(E, { t: t + 0.2, type: 'triangle', f: midiHz(48), dur: 0.2, gain: 0.08 * g });
  tone(E, { t: t + 0.42, type: 'triangle', f: midiHz(41), dur: 0.7, gain: 0.09 * g });
  bell(E, { t: t + 0.42, f: midiHz(101), dur: 0.7, gain: 0.02 * g });
}

// 🦗 Fail: two crickets in the awkward silence.
export function crickets(E, o = {}) {
  const t = T(E, o), g = G(o);
  const one = (t0, f, gain, pan) => {
    const s = sound(E);
    const osc = s.osc('sine', f);
    const env = s.gain(0);
    chain(osc, env, s.out(E.sfx, pan));
    let tt = t0;
    P.set(env.gain, 0, tt);
    for (let c = 0; c < 4; c++) {
      for (let p = 0; p < 3; p++) {
        P.set(env.gain, 0, tt);
        P.ramp(env.gain, gain, tt + 0.006);
        P.ramp(env.gain, 0, tt + 0.022);
        tt += 0.035;
      }
      tt += 0.55 + rand(0, 0.1);
    }
    s.play(osc, t0, tt);
    s.done();
  };
  one(t + 0.1, 4400, 0.06 * g, 0.35);
  one(t + 0.45, 4750, 0.035 * g, -0.4);
}

// Caught (end screen): low "dun, dun, duuun".
export function doom(E, o = {}) {
  const t = T(E, o), g = G(o);
  stab(E, { t, notes: [43, 50], dur: 0.2, gain: 0.05 * g, bright: 1600 });
  stab(E, { t: t + 0.28, notes: [43, 50], dur: 0.2, gain: 0.05 * g, bright: 1600 });
  stab(E, { t: t + 0.56, notes: [39, 46, 51], dur: 1.2, gain: 0.06 * g, bright: 1800 });
}

// Wall-clock tick (urgency 0..1: louder, higher; tock = second, lower click).
export function clockTick(E, o = {}) {
  const t = T(E, o), u = clamp(fin(o.urgency, 0), 0, 1), g = G(o);
  sample(E, E.buffers.tick, { t, rate: 1 + 0.35 * u, gain: (0.1 + 0.2 * u) * g });
  if (o.tock) sample(E, E.buffers.tick, { t: t + 0.15, rate: 0.75 + 0.2 * u, gain: (0.08 + 0.15 * u) * g });
}

// 🕓 4:00: a soft office chime.
export function fourOClock(E, o = {}) {
  const t = T(E, o), g = G(o);
  const partials = [[1, 1, 1], [2, 0.25, 0.5], [3, 0.1, 0.3]];
  bell(E, { t, f: 784, dur: 1.4, gain: 0.05 * g, partials });
  bell(E, { t: t + 0.35, f: 523.25, dur: 1.8, gain: 0.05 * g, partials });
}

// Keyboard key (typing clatter). fast = fast-forward typing (higher, brighter).
export function key(E, o = {}) {
  const fast = !!o.fast;
  const space = !!o.space;
  const rate = space ? rand(0.55, 0.65) : rand(0.85, 1.25) * (fast ? 1.25 : 1);
  sample(E, E.buffers.key, { t: T(E, o), rate, gain: (space ? 0.09 : rand(0.05, 0.09)) * G(o), pan: o.pan });
}

// Soft carpet footstep.
export function step(E, o = {}) {
  sample(E, E.buffers.step, { t: T(E, o), rate: rand(0.85, 1.15) * (o.alt ? 0.92 : 1), gain: 0.08 * G(o), pan: o.pan, lp: 1800 });
}
