// Audio: synthesized WebAudio babble, sound effects and muzak.
//
// createAudio() -> { attach(game), unlock(), update(game, realDt), setMuted(bool) }
// Nothing touches WebAudio (or `window`) until the first unlock(); every method is a safe no-op
// before that, or when WebAudio is unavailable. Event handlers are wrapped so an audio bug can
// never throw into the game.
//
// Graph: [one-shot sounds] -> sfx / voice / music buses -> master -> compressor -> destination.
// One-shot sounds disconnect themselves when they end (see synth.js sound()). The only
// long-lived nodes are the buses, the compressor and the music's tremolo chain.
//
// What the level's own actions, events and things sound like comes from the level (level.sounds,
// e.g. src/levels/meeting/sounds.js); this file plays the engine's events and the level's recipes.

import { spotPos, findNpc } from '../game/perception.js';
import { dayCue } from '../config.js';
import { P, fin, clamp, rand, chain, makeBuffers } from './synth.js';
import { babble, hum, voiceOf, sfxPitch, voicesFor } from './babble.js';
import * as sfx from './sfx.js';
import { createMusic } from './music.js';

const MASTER = 0.55;
const BUS = { sfx: 0.9, voice: 0.32, music: 0.12 }; // babble is dense: ~9 dB under the sfx bus
const MAP_W = 30; // fallback when game.map is missing
const MAX_TALK = 3; // overlapping utterances
const NO_SOUNDS = {};
const REPEAT_FIRST = 1; // seconds before a repeat's first sound when no event rearmed it

// Looked up only inside unlock().
function getAudioContextClass() {
  const g = globalThis;
  const w = g.window && typeof g.window === 'object' ? g.window : null;
  return (w && (w.AudioContext || w.webkitAudioContext)) || g.AudioContext || g.webkitAudioContext || null;
}

function buildEngine(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0; // faded in by applyMute()
  let comp = null;
  if (typeof ctx.createDynamicsCompressor === 'function') {
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 12;
    comp.ratio.value = 3;
    comp.attack.value = 0.004;
    comp.release.value = 0.25;
  }
  chain(master, comp, ctx.destination);
  const bus = (v) => {
    const g = ctx.createGain();
    g.gain.value = v;
    g.connect(master);
    return g;
  };
  return {
    ctx,
    master,
    sfx: bus(BUS.sfx),
    voice: bus(BUS.voice),
    music: bus(BUS.music),
    buffers: makeBuffers(ctx),
    now: () => fin(ctx.currentTime, 0) + 0.01, // a hair ahead so starts are never in the past
  };
}

export function createAudio(opts = {}) {
  const wantMusic = opts.music !== false;
  const dbg = { errors: 0, lastError: null, contexts: 0, unavailable: false };

  let E = null; // engine (after unlock)
  let music = null;
  let game = null;
  let attached = false;
  let failures = 0;
  let mutedFlag = false;
  let pausedFlag = false; // context suspended while the game is paused
  let appliedMute = null;

  // Babble bookkeeping: voice key -> { start, end, kill, kind }.
  const talking = new Map();
  const last = Object.create(null); // dedupe timestamps (ctx seconds)
  // update() state
  let typeT = 0;
  let typeN = 0;
  let stepT = 0;
  let stepAlt = false;
  const repeatT = Object.create(null); // level.sounds.repeats name -> seconds to the next sound
  let clockIdx = null;
  let prevMinute = null;
  let lastTick = -1;

  const report = (e) => {
    dbg.errors++;
    dbg.lastError = e;
    if (dbg.errors <= 3 && typeof console !== 'undefined') console.warn('[audio]', e);
  };
  const isMuted = () => mutedFlag || !!game?.settings?.muted;
  const live = () => !!E && !isMuted() && E.ctx.state !== 'closed';
  const now = () => E.now();
  // Dedupe: true if `key` fired less than `gap` seconds ago (and records this call otherwise).
  const recently = (key, gap) => {
    const t = fin(E.ctx.currentTime, 0);
    if (last[key] !== undefined && t - last[key] < gap) return true;
    last[key] = t;
    return false;
  };

  // --- Positions -------------------------------------------------------------------------
  function entity(id) {
    if (!game || typeof id !== 'string') return null;
    if (id === 'player') return game.player ?? null;
    return (Array.isArray(game.npcs) && findNpc(game, id)) || null;
  }
  function posOf(owner) {
    if (owner && typeof owner === 'object') return owner;
    if (typeof owner !== 'string') return null;
    return entity(owner);
  }
  // -> { pan, gain, muffle } for a world position (pan by x; quieter far from the player;
  // muffled through the glass when the source and the player are on different sides).
  function place(pos) {
    const x = fin(pos?.x, NaN);
    const y = fin(pos?.y, NaN);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return { pan: 0, gain: 1, muffle: 0 };
    const w = fin(game?.map?.w, MAP_W) > 0 ? fin(game?.map?.w, MAP_W) : MAP_W;
    const pan = clamp(((x / w) * 2 - 1) * 0.7, -0.7, 0.7);
    const p = game?.player;
    const px = fin(p?.x, NaN);
    const py = fin(p?.y, NaN);
    if (!Number.isFinite(px) || !Number.isFinite(py)) return { pan, gain: 1, muffle: 0 };
    const gain = clamp(1.1 - Math.hypot(x - px, y - py) / 30, 0.5, 1);
    const lobbyY = fin(game?.level?.zones?.outside?.y0, Infinity) - 0.5; // the glass wall's mid-line, just above the lobby
    const muffle = y >= lobbyY !== py >= lobbyY ? 1100 : 0;
    return { pan, gain, muffle };
  }
  // Recipe options for a sound at an entity / spot / point.
  const atPos = (pos, extra) => {
    const pl = place(pos);
    return { t: now(), pan: pl.pan, gain: pl.gain * (pl.muffle ? 0.6 : 1), ...extra };
  };
  const spotAt = (name) => (game?.level ? spotPos(game, name) : null); // a level spot, null on a game without a level
  const atSpot = (name, extra) => atPos(spotAt(name), extra);
  const atEnt = (id, extra) => atPos(entity(id), extra);
  const sounds = () => game?.level?.sounds ?? NO_SOUNDS;
  const entry = (table, key) => (table && typeof key === 'string' && Object.hasOwn(table, key) ? table[key] : null);
  // The voice an NPC (or the player) speaks with: its `voice`, else its id.
  const voices = () => voicesFor(game?.level?.voices); // the engine's voices plus the level's cast's
  const voiceFor = (id) => {
    const n = entity(id);
    return n && typeof n.voice === 'string' ? n.voice : id;
  };
  // The talking-map key of that voice (as onSay files it).
  const voiceKey = (id) => {
    const v = voiceFor(id);
    const vid = voiceOf(v, voices());
    return vid === 'generic' && typeof v === 'string' ? v : vid;
  };

  // Play a level sound spec { sfx, spot | who, opts, when, rearm } (see src/levels/meeting/sounds.js).
  // `sfx` names a recipe in sfx.js or one of the shared deduped sounds below; a spot or who places it,
  // otherwise it has no position.
  function play(spec, payload) {
    if (!spec || typeof spec !== 'object') return;
    if (typeof spec.when === 'function' && !spec.when(payload)) return;
    if (spec.rearm) for (const k of Object.keys(spec.rearm)) repeatT[k] = fin(spec.rearm[k], REPEAT_FIRST);
    if (typeof spec.sfx === 'string' && Object.hasOwn(SHARED, spec.sfx)) return SHARED[spec.sfx]();
    const fn = typeof spec.sfx === 'string' ? sfx[spec.sfx] : null;
    if (typeof fn !== 'function') return;
    if (spec.spot) fn(E, atSpot(spec.spot, spec.opts));
    else if (spec.who) fn(E, atEnt(spec.who, spec.opts));
    else fn(E, { t: now(), ...spec.opts });
  }

  // --- Babble ----------------------------------------------------------------------------
  function killAllBabble() {
    if (!E) return;
    const t = now();
    for (const b of talking.values()) {
      if (b.end > t) {
        b.kill(t);
        b.end = Math.min(b.end, t + 0.05);
      }
    }
  }
  function speak(key, o) {
    const t = now();
    const cur = talking.get(key);
    const busy = cur && cur.end > t;
    if (busy) {
      // Same bubble burst (e.g. two says in one step): keep the first.
      if (t - cur.start < 0.12 && cur.kind === o.kind) return;
      cur.kill(t);
      cur.end = Math.min(cur.end, t + 0.05);
    }
    let n = 0;
    let oldest = null;
    for (const b of talking.values()) {
      if (b.end <= t + 0.05) continue;
      n++;
      if (!oldest || b.start < oldest.start) oldest = b;
    }
    if (n >= MAX_TALK && oldest) {
      oldest.kill(t);
      oldest.end = t + 0.05;
    }
    const start = busy ? t + 0.04 : t;
    const b = (o.kind === 'thought' ? hum : babble)(E, { ...o, voices: voices(), t: start });
    talking.set(key, { start: b.start, end: b.end, kill: b.kill, kind: o.kind });
  }
  function onSay(p) {
    if (!p || typeof p !== 'object') return;
    const icons = Array.isArray(p.icons) ? p.icons : [];
    const pl = place(posOf(p.owner));
    if (p.kind === 'sign') {
      // A sign makes the sound its say names (p.sfx), else the level's sound for one of its icons
      // (level.sounds.signs); other signs are silent.
      if (typeof p.sfx === 'string') return play({ sfx: p.sfx }, p);
      const signs = sounds().signs;
      const icon = icons.find((i) => entry(signs, i));
      if (icon !== undefined) play(signs[icon], p);
      return;
    }
    const vid = voiceOf(typeof p.voice === 'string' ? p.voice : p.owner, voices());
    const key = vid === 'generic' && typeof p.voice === 'string' ? p.voice : vid;
    if (p.kind === 'thought') {
      const cur = talking.get(key);
      if (cur && cur.end > now() && cur.kind !== 'thought') return; // never hum over own speech
      last[`hum:${vid}`] = fin(E.ctx.currentTime, 0);
      speak(key, { voiceId: vid, icons, kind: 'thought', pan: pl.pan, gain: 0.8 * pl.gain });
      return;
    }
    const alert = p.kind === 'alert';
    speak(key, {
      voiceId: vid,
      icons,
      kind: alert ? 'alert' : p.kind === 'realize' ? 'realize' : 'speech',
      pan: pl.pan,
      gain: (alert ? 0.75 : 1) * pl.gain,
      muffle: pl.muffle,
    });
  }

  function cricketsOnce() {
    if (recently('crickets', 3.5)) return;
    sfx.crickets(E, { t: now() });
  }
  function tattleOnce(p) {
    if (recently('tattle', 0.3)) return;
    const by = typeof p?.by === 'string' ? p.by : null;
    const pitch = sfxPitch(voiceFor(by), voices());
    // Contraband: the witness takes their thing back, by default with a grumble ("hey, that's mine");
    // level.sounds.contraband can give someone another reaction. A real tattle is the playground "nyah-nyah".
    if (p?.reason === 'contraband') {
      const name = entry(sounds().contraband, by)?.sfx;
      const fn = typeof name === 'string' && typeof sfx[name] === 'function' ? sfx[name] : sfx.grumble;
      fn(E, atEnt(by, { f: pitch.grumble }));
    } else sfx.tattle(E, atEnt(by, { k: pitch.tattle }));
  }
  // NPCs leaving or arriving near level.sounds.elevator's spot take the lift: a ding instead of a door.
  function elevatorOnce() {
    const lift = sounds().elevator;
    if (!lift || recently('elevator', 1.5)) return;
    sfx.elevatorDing(E, atSpot(lift.spot));
  }
  const byLift = (n) => {
    const lift = sounds().elevator;
    return !!(n && lift && nearSpot(n, lift.spot, fin(lift.radius, 0)));
  };
  // Shared sounds a level spec can name: deduped, so two triggers in a moment play once. No position.
  const SHARED = { crickets: cricketsOnce, elevator: elevatorOnce };
  const nearSpot = (pos, name, r) => {
    const s = spotAt(name);
    return !!(pos && s && Math.hypot(fin(pos.x, 1e9) - s.x, fin(pos.y, 1e9) - s.y) <= r);
  };

  // --- Event handlers --------------------------------------------------------------------
  const H = {
    'loop:start': () => {
      killAllBabble();
      sfx.rewind(E, { t: now() });
      music?.restart(0.9);
      resetTimers();
      clockIdx = null;
      prevMinute = null;
    },
    say: onSay,
    'action:start': (p) => play(entry(sounds().actions?.start, p?.type), p),
    'action:done': (p) => play(entry(sounds().actions?.done, p?.type), p),
    'item:drop': (p) => sfx.drop(E, atEnt('player', { type: entry(sounds().drops, p?.type) })),
    'item:pickup': () => sfx.pickup(E, atEnt('player')),
    'player:sit': () => sfx.creak(E, atEnt('player')),
    'player:stand': () => sfx.creak(E, atEnt('player', { up: true })),
    'busy:start': (p) => sfx.shuffle(E, atEnt('player', { pose: p?.pose })),
    'witness:notice': (p) => {
      // rules.js says a ❓ thought right before this; its hum already is the "hm?".
      const vid = voiceOf(p?.by, voices());
      const h = last[`hum:${vid}`];
      if (h !== undefined && fin(E.ctx.currentTime, 0) - h < 0.15) return;
      sfx.notice(E, atEnt(p?.by, { f: sfxPitch(voiceFor(p?.by), voices()).notice }));
    },
    'trespass:notice': (p) => {
      // his 🤨 in his private place (rules.js): the same "hm?" as a ❓.
      const vid = voiceOf(p?.by, voices());
      const h = last[`hum:${vid}`];
      if (h !== undefined && fin(E.ctx.currentTime, 0) - h < 0.15) return;
      sfx.notice(E, atEnt(p?.by, { f: sfxPitch(voiceFor(p?.by), voices()).notice }));
    },
    'witness:tattle': (p) => tattleOnce(p),
    'work:done': () => sfx.relief(E, { t: now() }),
    caught: (p) => {
      music?.kill();
      // Freeze-frame: everyone but the catcher's "❗" shuts up.
      const t = now();
      const keep = voiceKey(p?.by);
      for (const [k, b] of talking) {
        if (k !== keep && b.end > t) {
          b.kill(t);
          b.end = t + 0.05;
        }
      }
      sfx.caught(E, { t });
    },
    'npc:vanish': (p) => {
      const n = entity(p?.id);
      if (byLift(n)) return elevatorOnce();
      sfx.door(E, atPos(n));
    },
    'npc:appear': (p) => {
      const n = entity(p?.id);
      if (byLift(n)) return elevatorOnce();
      sfx.door(E, atPos(n, { open: true }));
    },
    noise: (p) => {
      // A noise that names its sound (sim/mechanics/attention.js noise.sfx), played where it is.
      const name = p && typeof p.sfx === 'string' ? p.sfx : null;
      if (!name) return;
      if (Object.hasOwn(SHARED, name)) return SHARED[name]();
      const fn = sfx[name];
      if (typeof fn === 'function') fn(E, atPos(p));
    },
    'meeting:gather': () => {
      // Distant murmur from the meeting (level.sounds.murmur's spot; bypasses the per-voice throttle):
      // the whole cast, spread left to right by meeting seat.
      const m = sounds().murmur;
      const pl = place(m && m.spot ? spotAt(m.spot) : null);
      const t = now();
      const cast = murmurCast();
      cast.forEach((n, i) => {
        babble(E, {
          voiceId: typeof n.voice === 'string' ? n.voice : n.id,
          voices: voices(),
          icons: ['💬', '💬', '💬'],
          kind: 'speech',
          t: t + 0.25 * i,
          pan: pl.pan + (i - (cast.length - 1) / 2) * 0.15,
          gain: 0.35 * pl.gain,
          muffle: 900,
        });
      });
    },
    'day:end': (p) => {
      music?.kill();
      const r = p?.outcome?.result ?? game?.outcome?.result;
      const t = now() + 0.1;
      if (r === 'win') sfx.winJingle(E, { t });
      else if (r === 'fail') cricketsOnce();
      else if (r === 'caught') sfx.doom(E, { t: t + 0.15, gain: 0.8 });
      else if (r === 'blamed') sfx.sadTrombone(E, { t: t + 0.3, gain: 0.9 });
    },
  };

  // The cast in meeting-seat order, left to right (seatless NPCs last, in cast order).
  function murmurCast() {
    const spots = game?.level?.spots;
    const seatX = (n) => {
      const s = spots && typeof n.meetingSpot === 'string' && Object.hasOwn(spots, n.meetingSpot) ? spots[n.meetingSpot] : null;
      return s ? fin(s.x, Infinity) : Infinity;
    };
    const npcs = Array.isArray(game?.npcs) ? game.npcs.filter((n) => n && typeof n === 'object') : [];
    return npcs.sort((a, b) => seatX(a) - seatX(b) || 0);
  }

  const guard = (fn) => (payload) => {
    if (!live()) return;
    try {
      fn(payload);
    } catch (e) {
      report(e);
    }
  };

  function applyMute() {
    if (!E) return;
    const m = isMuted();
    if (m === appliedMute) return;
    appliedMute = m;
    P.to(E.master.gain, m ? 0 : MASTER, E.ctx.currentTime, m ? 0.02 : 0.05);
    if (m) {
      killAllBabble();
      music?.kill();
    }
  }

  function resetTimers() {
    typeT = 0;
    typeN = 0;
    stepT = 0;
  }

  // --- Per-frame state-driven sounds -----------------------------------------------------
  function typing(dt, fast) {
    typeT -= dt;
    if (typeT > 0) return;
    typeN++;
    const space = typeN % 6 === 0 && Math.random() < 0.8;
    sfx.key(E, atEnt('player', { fast, space, gain: fast ? 0.85 : 1 }));
    if (fast) typeT = rand(0.035, 0.07);
    else typeT = Math.random() < 0.06 ? rand(0.25, 0.4) : rand(0.06, 0.13);
  }
  function footsteps(p, dt, speed) {
    stepT -= dt;
    if (stepT > 0) return;
    stepAlt = !stepAlt;
    sfx.step(E, atEnt('player', { alt: stepAlt }));
    stepT = (p.busyPose === 'folder' ? 0.36 : 0.27) / speed;
  }
  // quiet: no ticks (meeting outcome or caught); the 4:00 chime still rings unless caught.
  // day: the level's times (meetingAt; clockTickAt: the wall clock starts ticking; tockAt: tick-tock;
  // halfMinuteAt: a tick every half minute; config.js dayCue gives the defaults).
  function clockTicks(minute, quiet, caught, day) {
    const { meetingAt } = day;
    const [clockTickAt, tockAt, halfMinuteAt] = ['clockTickAt', 'tockAt', 'halfMinuteAt'].map((n) => dayCue(day, n));
    const m = fin(minute, 0);
    if (prevMinute === null || m < prevMinute) {
      prevMinute = m;
      clockIdx = Math.floor(m * 2);
      return;
    }
    if (prevMinute < meetingAt && m >= meetingAt && !caught) sfx.fourOClock(E, { t: now() });
    prevMinute = m;
    const idx = Math.floor(m * 2); // half-minute index
    if (idx <= clockIdx) return;
    clockIdx = idx;
    if (quiet) return;
    const mm = idx / 2; // the crossed mark
    if (mm < clockTickAt || mm >= meetingAt) return;
    if (idx % 2 === 1 && mm < halfMinuteAt) return; // half minutes only near the end
    const t = fin(E.ctx.currentTime, 0);
    if (t - lastTick < 0.12) return; // fast-forward: don't machine-gun
    lastTick = t;
    const u = (mm - clockTickAt) / (meetingAt - clockTickAt);
    sfx.clockTick(E, { t: now(), urgency: u, tock: mm >= tockAt && idx % 2 === 0 });
  }

  function step(g, realDt) {
    const dt = clamp(fin(realDt, 0), 0, 0.25);
    applyMute();
    const muted = isMuted();
    const ctxOk = E.ctx.state === 'running';
    const day = g.phase === 'day';
    const clock = g.clock ?? {};
    const fast = !!clock.ff || fin(clock.forced, 0) > 0;
    if (music) {
      let ducking = false;
      const t = now();
      for (const b of talking.values()) if (b.end > t && b.kind !== 'thought') ducking = true;
      music.update(dt, {
        play: wantMusic && !muted && ctxOk && day && !g.outcome && !g.caught,
        duck: ducking,
        rate: fin(clock.forced, 0) > 0 ? 1.45 : clock.ff ? 1.3 : 1,
        level: fin(clock.minute, 0) >= fin(g.level?.day && dayCue(g.level.day, 'clockTickAt'), Infinity) ? 0.6 : 1, // make room for the clock
      });
    }
    if (muted || !ctxOk || !day) {
      resetTimers();
      prevMinute = null;
      return;
    }
    const p = g.player ?? {};
    if (p.busy !== false && p.busyPose === 'typing') typing(dt, fast);
    else typeT = 0;
    if (p.moving) footsteps(p, dt, clamp(fin(g.debug?.speed, 1), 1, 3));
    else stepT = 0;
    // level.sounds.repeats: a sound every few seconds while the world is in some state.
    const reps = g.level?.sounds?.repeats;
    if (reps && g.world) {
      for (const name of Object.keys(reps)) {
        const r = reps[name];
        if (!r || typeof r.while !== 'function' || !r.while(g.world)) continue;
        repeatT[name] = fin(repeatT[name], REPEAT_FIRST) - dt;
        if (repeatT[name] > 0) continue;
        repeatT[name] = rand(r.every[0], r.every[1]);
        play(r);
      }
    }
    if (g.level?.day) clockTicks(clock.minute, !!(g.outcome || g.caught), !!g.caught, g.level.day);
  }

  return {
    attach(g) {
      if (attached || !g?.events || typeof g.events.on !== 'function') return;
      attached = true;
      game = g;
      for (const [name, fn] of Object.entries(H)) g.events.on(name, guard(fn));
      // The level's own events (level.sounds.events): one spec each.
      const evs = g.level?.sounds?.events;
      if (evs) for (const [name, spec] of Object.entries(evs)) g.events.on(name, guard((p) => play(spec, p)));
      // A toy's sound (level.toys react.sfx, sim/mechanics/toy.js): at the prop.
      for (const toy of g.level?.toys ?? []) {
        const fn = typeof toy.react?.sfx === 'string' ? sfx[toy.react.sfx] : null;
        if (typeof fn === 'function') g.events.on(`toy:${toy.id}`, guard((p) => { if (E) fn(E, atPos(p, {})); }));
      }
    },

    unlock() {
      try {
        if (!E) {
          if (dbg.unavailable) return;
          const AC = getAudioContextClass();
          if (typeof AC !== 'function') {
            dbg.unavailable = true;
            return;
          }
          const ctx = new AC();
          dbg.contexts++;
          try {
            E = buildEngine(ctx);
            music = wantMusic ? createMusic(E, E.music) : null;
          } catch (e) {
            E = null;
            music = null;
            try {
              ctx.close?.();
            } catch {
              /* ignore */
            }
            throw e;
          }
          appliedMute = null;
          applyMute();
        }
        const c = E.ctx;
        if (!pausedFlag && c.state === 'suspended' && typeof c.resume === 'function') {
          const r = c.resume();
          if (r && typeof r.catch === 'function') r.catch(() => {});
        }
      } catch (e) {
        report(e);
        if (++failures >= 3) dbg.unavailable = true;
      }
    },

    update(g, realDt) {
      if (!E || !g || pausedFlag) return;
      if (!game) game = g;
      try {
        step(g, realDt);
      } catch (e) {
        report(e);
      }
    },

    // Pause freezes everything mid-sound (music included) and resumes it where it was.
    setPaused(b) {
      pausedFlag = !!b;
      if (!E) return;
      try {
        const c = E.ctx;
        const r = pausedFlag ? c.suspend?.() : c.state === 'suspended' ? c.resume?.() : null;
        if (r && typeof r.catch === 'function') r.catch(() => {});
      } catch (e) {
        report(e);
      }
    },

    setMuted(b) {
      mutedFlag = !!b;
      if (!E) return;
      try {
        applyMute();
      } catch (e) {
        report(e);
      }
    },

    _debug: dbg, // for tools/test-audio.mjs
  };
}
