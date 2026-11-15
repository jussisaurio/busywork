// Early Bus's mechanic: people live by the wall clock in their zone, not by the time.
//
// Each person has a home clock (HOME) and reads it only while standing in its zone. He looks up 🕐 on every
// beat (each schedule entry and each of cast.js LOOK_UPS) and when he sits down (the `lookUp` behaviour): he turns
// to the clock for a second, and if it shows a later time than he believed, ❗ he adopts it and jumps to whatever
// his schedule says for that time (skipped bubbles fire at once). Time only ever jumps forward.
//
// The schedule reads it through level.clockFor (src/sim/npcs.js). The HUD clock, the deadline, the gather and the
// rules keep the true time. A clock you pushed hangs crooked (presentation.js).
//
// The boss also watches his staff's desks. Whenever Lin or Kev disappears (Lin's restroom break, or going home) while
// he is in his office, he turns to that desk and wonders where they are (their face, ❓). When both have gone home he
// decides it must be 4:50 ❗ and leaves too (world.herd).
import { FIXED_DT } from '../../config.js';
import { say } from '../../core/fx.js';
import { inZone, findNpc } from '../../game/perception.js';
import { LOOK_UPS } from './cast.js';

// Clock -> where it hangs: its interactable id, the zone it rules, the stepladder under it, its world field (minutes
// fast).
export const CLOCKS = {
  boss: { id: 'boss_clock', zone: 'boss_office', spot: 'boss_clock_chair', field: 'bossClock' },
  open: { id: 'open_clock', zone: 'open_plan', spot: 'open_clock_chair', field: 'openClock' },
};
// Person -> the clock he lives by.
export const HOME = { boss: 'boss', lin: 'open', kev: 'open' };

const LOOK_S = 1.0; // real s he stares at the clock (he stands still: his plan waits)
const FROWN_S = 1.0; // real s the boss frowns at an empty desk
const HERD_S = 1.6; // real s from seeing the second empty desk to packing up

// His beats: the times of his schedule entries and his LOOK_UPS, sorted, once per day.
function beatsOf(npc) {
  const times = new Set([...npc._schedule.map((e) => e.at), ...(LOOK_UPS[npc.id] ?? [])]);
  return [...times].sort((a, b) => a - b);
}

// The last beat whose time has come at believed minute t (-1: none yet).
function beatAt(npc, t) {
  const s = npc._clk.beats;
  let b = -1;
  for (let i = 0; i < s.length && s[i] <= t; i++) b = i;
  return b;
}

// level.clockFor: the minute npc's schedule reads this step.
export function clockFor(game, npc, sim) {
  const now = game.clock.minute;
  const st = (npc._clk ??= { off: 0, beat: null, beats: beatsOf(npc), lookT: 0, saw: {}, herdT: HERD_S });
  st.lookT = Math.max(0, st.lookT - FIXED_DT);
  if (npc.id === 'boss') followHerd(game, npc, sim, st, now);
  const b = beatAt(npc, now + st.off);
  if (st.beat === null) st.beat = b; // the first step of the day: no look-up
  if (b !== st.beat) {
    st.beat = b;
    if (reads(game, npc)) lookUp(game, npc, sim);
  }
  return now + st.off;
}

// He can read his home clock: on the floor, on his own schedule, in its zone.
function reads(game, npc) {
  return npc.active && !npc._gone && !npc.override && inZone(game, CLOCKS[HOME[npc.id]].zone, npc.x, npc.y);
}

// 🕐: turn to the clock (and the stepladder under it) for a second; if it is ahead of him, ❗ and he is ahead too.
function lookUp(game, npc, sim) {
  const st = npc._clk;
  const c = CLOCKS[HOME[npc.id]];
  sim.lookAt(game, npc, c.spot, LOOK_S);
  st.lookT = LOOK_S;
  say(game, npc.id, ['🕐'], { kind: 'thought', voice: npc.voice, ttl: LOOK_S });
  game.events.emit('clock:look', { id: npc.id, clock: c.id });
  const shown = game.world[c.field];
  if (shown > st.off) {
    st.off = shown;
    st.beat = beatAt(npc, game.clock.minute + st.off);
    sim.speak(game, npc, [{ say: ['❗'], kind: 'alert', after: LOOK_S * 0.6, ttl: 0.8 }]);
    game.events.emit('clock:jump', { id: npc.id, clock: c.id, off: st.off });
  }
}

// The boss in his office notices an empty desk: he turns to it with that person's face and ❓, once each time the
// person disappears. At the second desk empty for good ❗ he packs up.
function followHerd(game, npc, sim, st, now) {
  const w = game.world;
  if (w.herd || !npc.active || npc._gone || npc.override || !inZone(game, 'boss_office', npc.x, npc.y)) return;
  for (const id of ['lin', 'kev']) {
    if (findNpc(game, id)?.active !== false) { st.saw[id] = false; continue; } // at work (or walking about)
    if (st.saw[id]) continue;
    st.saw[id] = true;
    sim.lookAt(game, npc, `${id}_desk`, FROWN_S);
    say(game, npc.id, [`@${id}`, '❓'], { kind: 'thought', voice: npc.voice, ttl: FROWN_S + 0.2 });
    game.events.emit('boss:frown', { at: id, gone: !!w[`${id}Gone`] });
  }
  if (!(w.linGone && w.kevGone)) return;
  st.herdT -= FIXED_DT;
  if (st.herdT > 0) return;
  w.herd = true;
  // It must be home time: his clock jumps to his own leaving (its bubble fires at once).
  const leave = npc._schedule.find((e) => e.do === 'leave');
  st.off = Math.max(st.off, leave.at - now);
  st.beat = beatAt(npc, now + st.off);
  sim.speak(game, npc, [{ say: ['❗'], kind: 'alert', ttl: 0.9 }]);
  game.events.emit('boss:herd', {});
}

export const CLOCK_BEHAVIOURS = {
  // Sitting down, he checks the time.
  lookUp: {
    arrive(game, npc, sim) {
      if (npc._clk && npc._clk.lookT <= 0 && reads(game, npc)) lookUp(game, npc, sim); // not twice in a row
    },
  },
};

// Push a clock forward ten minutes: sneaky, 1.5 s up the stepladder under it. You whistle 🎵 as you step down.
export function pushRow(clock) {
  const c = CLOCKS[clock];
  return {
    on: c.id,
    icon: '🕐',
    text: 'climb the stepladder and push the clock 10 minutes forward',
    duration: 1.5,
    sneaky: true,
    saw: '🕐',
    can: (p) => !p.held,
    done(game) {
      game.world[c.field] += 10;
      say(game, 'player', ['🎵'], { kind: 'speech', ttl: 1.2 });
      game.events.emit('clock:pushed', { clock, off: game.world[c.field] });
    },
  };
}
