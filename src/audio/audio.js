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

import { spotPos, findNpc } from '../game/perception.js';
import { P, fin, clamp, rand, chain, makeBuffers } from './synth.js';
import { babble, hum, voiceOf } from './babble.js';
import * as sfx from './sfx.js';
import { createMusic } from './music.js';

const MASTER = 0.55;
const BUS = { sfx: 0.9, voice: 0.32, music: 0.12 }; // babble is dense: ~9 dB under the sfx bus
const MAP_W = 30; // fallback when game.map is missing
const MAX_TALK = 3; // overlapping utterances

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
  let fixT = 1;
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
    const b = (o.kind === 'thought' ? hum : babble)(E, { ...o, t: start });
    talking.set(key, { start: b.start, end: b.end, kill: b.kill, kind: o.kind });
  }
  function onSay(p) {
    if (!p || typeof p !== 'object') return;
    const icons = Array.isArray(p.icons) ? p.icons : [];
    const pl = place(posOf(p.owner));
    if (p.kind === 'sign') {
      // The 🦗 sign of a failed meeting gets real crickets; other signs are silent.
      if (icons.some((i) => typeof i === 'string' && i.includes('🦗'))) cricketsOnce();
      return;
    }
    const vid = voiceOf(typeof p.voice === 'string' ? p.voice : p.owner);
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
      kind: alert ? 'alert' : 'speech',
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
    const by = typeof p?.by === 'string' ? p.by : 'lin';
    // Contraband: Lin grumbles ("hey, that's mine"), Kev is delighted (a coffee!). A real tattle is the playground "nyah-nyah".
    if (p?.reason === 'contraband') (by === 'kev' ? sfx.slurp : sfx.grumble)(E, atEnt(by, { by }));
    else sfx.tattle(E, atEnt(by, { by }));
  }
  function elevatorOnce() {
    if (recently('elevator', 1.5)) return;
    sfx.elevatorDing(E, atSpot('elevator'));
  }
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
    'action:start': (p) => {
      switch (p?.type) {
        case 'brew_coffee':
          return sfx.gurgle(E, atSpot('coffee'));
        case 'spill_coffee':
          return sfx.pour(E, atSpot('projector'));
        case 'take_sandwich':
          return sfx.fridgeOpen(E, atSpot('fridge'));
        case 'take_keycard':
          return sfx.rustle(E, atSpot('coat_rack', { gain: 0.6 }));
      }
    },
    'action:done': (p) => {
      if (p?.type === 'brew_coffee') sfx.machineBeep(E, atSpot('coffee'));
    },
    'item:drop': (p) => sfx.drop(E, atEnt('player', { type: p?.type })),
    'item:pickup': () => sfx.pickup(E, atEnt('player')),
    'player:sit': () => sfx.creak(E, atEnt('player')),
    'player:stand': () => sfx.creak(E, atEnt('player', { up: true })),
    'busy:start': (p) => sfx.shuffle(E, atEnt('player', { pose: p?.pose })),
    'witness:notice': (p) => {
      // rules.js says a ❓ thought right before this; its hum already is the "hm?".
      const vid = voiceOf(p?.by);
      const h = last[`hum:${vid}`];
      if (h !== undefined && fin(E.ctx.currentTime, 0) - h < 0.15) return;
      sfx.notice(E, atEnt(p?.by, { by: p?.by }));
    },
    'witness:tattle': (p) => tattleOnce(p),
    'boss:suspicious': () => sfx.tension(E, atEnt('boss')),
    'boss:workAssigned': () => sfx.workAssigned(E, { t: now() }),
    'work:done': () => sfx.relief(E, { t: now() }),
    caught: () => {
      music?.kill();
      // Freeze-frame: everyone but the boss's "❗" shuts up.
      const t = now();
      for (const [k, b] of talking) {
        if (k !== 'boss' && b.end > t) {
          b.kill(t);
          b.end = t + 0.05;
        }
      }
      sfx.caught(E, { t });
    },
    'projector:broken': () => sfx.splashZap(E, atSpot('projector')),
    'kev:alerted': () => sfx.clank(E, atEnt('kev')),
    'projector:fixing': () => {
      fixT = 0.9;
      sfx.clank(E, atSpot('projector', { soft: true }));
    },
    'projector:fixed': () => sfx.fixed(E, atSpot('projector')),
    'keycard:taken': () => sfx.jingle(E, atEnt('player')),
    'sandwich:taken': () => sfx.fridgeClose(E, atSpot('fridge')),
    'sandwich:eaten': () => sfx.munch(E, atEnt('player')),
    'sandwich:returned': () => sfx.swish(E, atEnt('player')),
    'coffee:confiscated': () => sfx.swish(E, atEnt('player')),
    'coffee:taken': (p) => {
      if (p?.by && p.by !== 'player') sfx.machineBeep(E, atSpot('coffee'));
    },
    'sandwich:missing': () => sfx.fridgeOpen(E, atSpot('fridge', { short: true })),
    'boss:jacket': () => sfx.rustle(E, atEnt('boss')),
    'boss:lockedOut': () => sfx.rattle(E, atSpot('door_out')),
    'boss:bang': () => sfx.bang(E, atSpot('door_out')),
    'kev:left': () => elevatorOnce(),
    'npc:vanish': (p) => {
      const n = entity(p?.id);
      if (n && nearSpot(n, 'elevator', 2.5)) return elevatorOnce();
      sfx.door(E, atPos(n));
    },
    'npc:appear': (p) => {
      const n = entity(p?.id);
      if (n && nearSpot(n, 'elevator', 2.5)) return elevatorOnce();
      sfx.door(E, atPos(n, { open: true }));
    },
    'meeting:gather': () => {
      // Distant murmur from the meeting room (bypasses the per-voice throttle).
      const pl = place(spotAt('projector'));
      const t = now();
      ['boss', 'lin', 'kev'].forEach((v, i) => {
        babble(E, {
          voiceId: v,
          icons: ['💬', '💬', '💬'],
          kind: 'speech',
          t: t + 0.25 * i,
          pan: pl.pan + (i - 1) * 0.15,
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
  // halfMinuteAt: a tick every half minute).
  function clockTicks(minute, quiet, caught, day) {
    const { meetingAt, clockTickAt, tockAt, halfMinuteAt } = day;
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
        level: fin(clock.minute, 0) >= fin(g.level?.day?.clockTickAt, Infinity) ? 0.6 : 1, // make room for the clock
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
    if (g.world?.projector === 'fixing') {
      fixT -= dt;
      if (fixT <= 0) {
        fixT = rand(1.1, 2.0);
        sfx.clank(E, atSpot('projector', { soft: true, gain: 0.7 }));
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
