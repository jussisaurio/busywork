// Early Bus's mechanic: people live by the wall clock of the zone they stand in, not by the time.
//
// The boss reads Q in his office; Lin and Kev read O in the open plan (each sits within a few tiles of it). On every
// beat (each schedule entry and each of cast.js LOOK_UPS) and when he sits down (the `lookUp` behaviour) a person
// turns to his clock for a second and thinks the time it shows (a clock face). He adopts it, earlier or later: if
// that moves him, ❗ (the face and ❗), and he does whatever his schedule says for that time (skipped bubbles fire at
// once). Nobody ever acts against a clock he has just read.
//
// The boss reads O only when he passes under it on his way back from the kitchen (passO): if it shows 4:50 or
// later, ❗ he goes home (world.herd); otherwise he shrugs and walks on.
//
// Nobody leaves before the boss, and his coat on the rack says he is in (world.coat). At their 4:50 Lin and Kev
// stand up and look at the rack: coat there, 😬, they sit down again (and glance at their clock) and try again a few
// seconds later. Once the coat is gone and he is out of the door, they follow him out.
//
// After each look at his own clock the boss glances at your desk. Empty: [@player, ❓], and he goes looking for you
// (index.js hunts: office, open plan, lobby, the street). Seen out in the street before he has gone home, you are
// caught (index.js roles.scene). Told about a clock (a tattle), he sets the pushed clocks right (fixQ, fixO).
//
// The schedule reads it through level.clockFor (src/sim/npcs.js). The HUD clock, the deadline, the gather and the
// rules keep the true time. A clock you pushed hangs crooked (presentation.js).
import { FIXED_DT, at } from '../../config.js';
import { say, burst } from '../../core/fx.js';
import { inZone, findNpc, npcSees } from '../../game/perception.js';
import { leaving } from '../../sim/npcs.js';
import { LOOK_UPS, START } from './cast.js';

// Clock -> where it hangs: its interactable id, the zone it rules, the stepladder under it, its world field (minutes
// fast).
export const CLOCKS = {
  boss: { id: 'boss_clock', zone: 'boss_office', spot: 'boss_clock_chair', field: 'bossClock' },
  open: { id: 'open_clock', zone: 'open_plan', spot: 'open_clock_chair', field: 'openClock' },
};

export const HOME_AT = at('4:50', START); // everyone's home time, by his own clock
const LOOK_S = 1.0; // real s he stares at the clock (he stands still: his plan waits)
const LOOK_GAP_S = 3.0; // real s after a look before sitting down makes him look again
const DESK_S = 0.8; // real s the boss looks over at your desk after his clock
const FROWN_S = 1.0; // real s the boss frowns at an empty desk
const COAT_S = 1.2; // real s Lin or Kev looks at the boss's coat rack
const RECHECK_S = 8; // real s sitting before Lin or Kev stands up to look at the rack again
const REACH_S = 1.2; // real s the boss reaches up to set a clock right

// The clock of the zone he stands in (null: none).
function zoneClock(game, npc) {
  for (const [name, c] of Object.entries(CLOCKS)) if (inZone(game, c.zone, npc.x, npc.y)) return name;
  return null;
}

// The minute a clock shows now.
const shown = (game, clock) => game.clock.minute + (game.world[CLOCKS[clock].field] || 0);

// A clock face for a believed minute: the nearest half hour, and five o'clock only from 4:50.
const FACES = ['🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕'];
export function faceFor(minute) {
  let i = Math.round(minute / 30); // (minutes since 3:00)
  if (i >= 4 && minute < HOME_AT) i = 3;
  return FACES[Math.max(0, Math.min(FACES.length - 1, i))];
}

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

// Tattles reach the boss through the event bus, once per game object (events persist across loops).
const listening = new WeakSet();
function listen(game) {
  if (listening.has(game.events)) return;
  listening.add(game.events);
  game.events.on('witness:tattle', (p) => {
    if (game.level?.id !== 'early-bus' || game.phase !== 'day') return;
    const w = game.world;
    // Told about someone on a stepladder: he sets every pushed clock right.
    if (p?.heard && p.reason === 'action' && (w.bossClock || w.openClock)) w.fix = true;
  });
}

// level.clockFor: the minute npc's schedule reads this step.
export function clockFor(game, npc, sim) {
  listen(game);
  const st = (npc._clk ??= {
    off: 0, beat: null, beats: beatsOf(npc), lookT: 0, saw: {}, timers: [],
    check: 'stand', recheck: 0, coat: game.world.coat, w: null,
  });
  st.w = game.world;
  st.lookT = Math.max(0, st.lookT - FIXED_DT);
  tickTimers(st);
  if (npc.id === 'boss') frown(game, npc, sim, st);
  else homeCheck(game, st);
  let t = believed(game, npc, st);
  const b = beatAt(npc, t);
  if (st.beat === null) st.beat = b; // the first step of the day: no look-up
  if (b !== st.beat) {
    st.beat = b;
    if (t < HOME_AT && reads(game, npc)) lookUp(game, npc, sim); // going home, nobody checks the time
    t = believed(game, npc, st);
    st.beat = beatAt(npc, t);
  }
  return t;
}

// Lin and Kev at home time, while the boss is in: 'stand' (up to look at his coat rack, coatCheck), 'looking',
// 'sit' (back in the chair until the next look, or until the coat moves), 'wait' (the coat is gone: standing until
// he is out of the door), 'free' (going home).
function homeCheck(game, st) {
  if (game.clock.minute + st.off < HOME_AT) return;
  const w = game.world;
  if (st.check === 'sit') {
    st.recheck -= FIXED_DT;
    if (st.recheck <= 0 || st.coat !== w.coat) st.check = 'stand';
  }
  if (st.check === 'wait' && bossOut(game)) st.check = 'free';
}

// What he believes it is, held at home time while the boss is still in (Lin and Kev).
function believed(game, npc, st) {
  const t = game.clock.minute + st.off;
  if (npc.id === 'boss' || t < HOME_AT || st.check === 'free') return t;
  return st.check === 'sit' ? HOME_AT - 0.001 : HOME_AT; // 'sit': back in his chair; else standing at it
}

// The boss has taken his coat and is out of the open plan (or gone).
function bossOut(game) {
  const w = game.world;
  if (w.coat === 'hook') return false;
  const boss = findNpc(game, 'boss');
  return w.bossGone || !boss || !boss.active || boss.y >= 13.5;
}

function tickTimers(st) {
  if (!st.timers.length) return;
  const due = [];
  for (const tm of st.timers) {
    tm.t -= FIXED_DT;
    if (tm.t <= 1e-9) due.push(tm);
  }
  if (!due.length) return;
  st.timers = st.timers.filter((tm) => !due.includes(tm));
  for (const tm of due) tm.fn();
}

// He can read a clock: on the floor, on his own schedule, in a clock's zone. The boss reads O only under it (passO).
function reads(game, npc) {
  if (!npc.active || npc._gone || npc.override) return false;
  const c = zoneClock(game, npc);
  return c === 'boss' ? npc.id === 'boss' : c === 'open' && npc.id !== 'boss';
}

// A bubble by a clock (its face and ❗, a frown or a shrug; the boss's ❓ at his desk): beside his head on the side
// away from the clock when he stands under it, so it never hides the clock.
const SIDE = { boss: 1, open: -1 };
function clockSay(game, npc, clock, icons, kind, ttl) {
  const c = game.level.spots[CLOCKS[clock].spot];
  const under = Math.abs(npc.x - 0.5 - c.x) < 2 && npc.y - 0.5 - c.y < 3.5;
  const owner = under ? { x: npc.x + SIDE[clock] * (0.7 + 0.5 * icons.length), y: npc.y + 0.8 } : npc.id;
  say(game, owner, icons, { kind, voice: npc.voice, ttl });
}

// He turns to his zone's clock for a second and thinks its time; he adopts it.
function lookUp(game, npc, sim) {
  const st = npc._clk;
  const clock = zoneClock(game, npc);
  const c = CLOCKS[clock];
  sim.lookAt(game, npc, c.spot, LOOK_S);
  st.lookT = LOOK_GAP_S;
  game.events.emit('clock:look', { id: npc.id, clock: c.id });
  const off = game.world[c.field] || 0;
  const face = faceFor(shown(game, clock));
  if (off !== st.off) {
    const ahead = off > st.off;
    st.off = off;
    st.beat = beatAt(npc, believed(game, npc, st)); // (no second look for the jump itself)
    clockSay(game, npc, clock, [face, '😮'], 'realize', LOOK_S + 0.3); // "oh, that late!" (CONTRACTS "Bubbles")
    game.events.emit('clock:jump', { id: npc.id, clock: c.id, off, ahead });
  } else {
    clockSay(game, npc, clock, [face], 'thought', LOOK_S);
  }
  // The boss: his clock, then your desk.
  if (npc.id === 'boss' && clock === 'boss') st.timers.push({ t: LOOK_S, fn: () => deskGlance(game, npc, sim) });
}

// Your seat, or near enough to it.
export function playerAtDesk(game) {
  const p = game.player;
  const d = game.level.spots.player_desk;
  return p.seated || Math.hypot(p.x - d.x, p.y - d.y) < 1.5;
}

function deskGlance(game, npc, sim) {
  if (npc.override || !npc.active || leaving(npc) || !inZone(game, 'boss_office', npc.x, npc.y)) return;
  sim.lookAt(game, npc, 'player_desk', DESK_S);
  game.events.emit('boss:desk', { empty: !playerAtDesk(game) });
  npc._clk.timers.push({ t: DESK_S, fn: () => deskCheck(game, npc, sim) });
}

// Your chair still empty when he looks: he goes looking for you (index.js hunts).
function deskCheck(game, npc, sim) {
  if (npc.override || !npc.active || leaving(npc) || playerAtDesk(game)) return;
  if (game.phase !== 'day' || game.caught || game.outcome) return;
  sim.startHunt(game, npc);
  clockSay(game, npc, 'boss', ['@player', '❓'], 'thought', 1.4); // where are you? (index.js HUNTS start)
}

// The hunt is over: you are at your desk (or sent back to it), he sees you working inside, or it is his home time.
export function huntOver(game, npc) {
  const p = game.player;
  if (playerAtDesk(game) || game.rules?.working) return true;
  if (p.busy && !inZone(game, 'street', p.x, p.y) && npcSees(game, npc, p.x, p.y)) return true;
  return game.clock.minute + (npc._clk?.off ?? 0) >= HOME_AT;
}

// The boss in his office notices an empty desk (Lin's or Kev's): he turns to it with that person's face and ❓,
// once each time the person disappears. Nothing comes of it.
function frown(game, npc, sim, st) {
  if (!npc.active || npc._gone || npc.override || leaving(npc) || !inZone(game, 'boss_office', npc.x, npc.y)) return;
  for (const id of ['lin', 'kev']) {
    if (findNpc(game, id)?.active !== false) { st.saw[id] = false; continue; } // at work (or walking about)
    if (st.saw[id]) continue;
    st.saw[id] = true;
    sim.lookAt(game, npc, `${id}_desk`, FROWN_S);
    clockSay(game, npc, 'boss', [`@${id}`, '❓'], 'thought', FROWN_S + 0.2);
    game.events.emit('boss:frown', { at: id, gone: !!game.world[`${id}Gone`] });
  }
}

// Set a pushed clock right: he climbs to it and turns the hands back; he knows the time again.
function fixRow(clock) {
  const c = CLOCKS[clock];
  return {
    spot: c.spot,
    pending: (npc) => !!npc._clk?.w?.fix && !!npc._clk.w[c.field],
    arrive(game, npc, sim) {
      const w = game.world;
      w[c.field] = 0;
      if (clock === 'boss') {
        npc._clk.off = 0;
        npc._clk.beat = beatAt(npc, game.clock.minute);
      }
      if (!w.bossClock && !w.openClock) w.fix = false;
      npc._reachUntil = game.loopTime + REACH_S;
      sim.holdFor(npc, REACH_S);
      clockSay(game, npc, clock, [faceFor(game.clock.minute), '😠'], 'speech', REACH_S + 0.3);
      game.events.emit('clock:reset', { clock });
    },
  };
}

export const CLOCK_BEHAVIOURS = {
  // Sitting down, he checks the time.
  lookUp: {
    arrive(game, npc, sim) {
      if (npc._clk && npc._clk.lookT <= 0 && reads(game, npc)) lookUp(game, npc, sim); // not twice in a row
    },
  },

  // A cup from the full pot (level 1's coffee machine). The boss's cup starts his break.
  pour: {
    arrive(game, npc, sim) {
      npc.carry = 'coffee';
      if (npc.id === 'boss') npc._onBreak = true;
      sim.holdFor(npc, 1.0);
      const p = game.level.spots.coffee;
      burst(game, 'puff', p.x + 0.5, p.y - 0.5, 4, { speed: 0.4, lift: 0.8, ttl: 1.0 }); // steam
      game.events.emit('coffee:taken', { by: npc.id });
    },
  },

  // Back from the kitchen he walks under O and looks up at it. 4:50 or later: ❗ home time. Earlier: a shrug.
  passO: {
    spot: 'open_clock_chair',
    state: { _onBreak: false },
    pending: (npc) => npc._onBreak,
    arrive(game, npc, sim) {
      npc._onBreak = false;
      const st = npc._clk;
      const time = shown(game, 'open');
      const face = faceFor(time);
      sim.holdFor(npc, LOOK_S + 0.4);
      st.lookT = LOOK_GAP_S;
      game.events.emit('clock:look', { id: npc.id, clock: CLOCKS.open.id });
      if (time >= HOME_AT) {
        st.off = Math.max(st.off, game.world.openClock);
        st.beat = beatAt(npc, game.clock.minute + st.off);
        game.world.herd = true;
        game.world.herdShown = time; // the end card's clock
        clockSay(game, npc, 'open', [face, '😮'], 'realize', LOOK_S + 0.4);
        game.events.emit('boss:herd', { shown: time });
      } else {
        npc._shrugUntil = game.loopTime + LOOK_S + 0.4;
        clockSay(game, npc, 'open', [face, '🤷'], 'thought', LOOK_S + 0.4);
        game.events.emit('boss:shrug', { shown: time });
      }
    },
  },

  fixQ: fixRow('boss'),
  fixO: fixRow('open'),

  // Going home, he takes his coat off the rack (and leaves his cup).
  coat: {
    spot: 'coat',
    pending: (npc) => npc._clk?.w?.coat === 'hook',
    arrive(game, npc, sim) {
      game.world.coat = 'boss';
      npc.carry = null;
      sim.holdFor(npc, 0.9);
      sim.speak(game, npc, [{ say: ['👋'], kind: 'speech', after: 0.5 }]);
      game.events.emit('boss:coat', {});
    },
  },

  // Lin or Kev at home time: up, a look at the boss's coat rack. His coat there: 😬, sit down again (the beat back
  // makes him glance at his clock). Gone: wait for the boss to be out of the door, then go.
  coatCheck: {
    arrive(game, npc, sim) {
      const st = npc._clk;
      const w = game.world;
      st.coat = w.coat;
      sim.lookAt(game, npc, 'coat', COAT_S);
      if (w.coat === 'hook') {
        sim.speak(game, npc, [{ say: ['@boss', '😬'], kind: 'thought', ttl: COAT_S }]);
        st.check = 'looking';
        st.timers.push({ t: COAT_S, fn: () => { st.check = 'sit'; st.recheck = RECHECK_S; } });
        game.events.emit('coat:seen', { by: npc.id, coat: true });
      } else {
        st.check = 'wait';
        game.events.emit('coat:seen', { by: npc.id, coat: false });
      }
    },
  },
};

// Push a clock forward ten minutes: sneaky, 1.5 s up the stepladder under it.
export function pushRow(clock) {
  const c = CLOCKS[clock];
  return {
    on: c.id,
    text: 'climb the stepladder and push the clock 10 minutes forward',
    duration: 1.5,
    sneaky: true,
    saw: '🕐',
    can: (p) => !p.held,
    done(game) {
      game.world[c.field] += 10;
      game.events.emit('clock:pushed', { clock, off: game.world[c.field] });
    },
  };
}
