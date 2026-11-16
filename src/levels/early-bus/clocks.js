// The Last Bus's mechanic: people live by the wall clock of the zone they stand in, not by the time.
//
// The boss reads Q in his office; Lin and Kev read O in the open plan (each sits within a few tiles of it). On every
// beat (each schedule entry and each of cast.js LOOK_UPS) and when he sits down (the `lookUp` behaviour) a person
// turns to his clock for a second and thinks the time it shows (a clock face).
//
// Nobody swallows a clock that jumped under his nose. Lin and Kev, who look at O all afternoon, see it jump: the
// face and 🤨, and they keep their own time (they never act by a pushed clock).
//
// The boss is out at a long lunch until about 3:45, with a flat phone (📱🪫): the wall clocks are all he has. Back,
// he fetches a coffee and walks back under O (passO): the first clock he has seen for an hour, so he believes
// whatever it says (later than he thought: the face and 😮). If it says 4:50 or later, he goes home from the
// hallway (world.herd): his coat hangs on a rack there, so he never sees Q. Otherwise he sits down at his desk and
// looks up at Q. Q agrees with O (within ten minutes): he takes Q's time. Q disagrees: he frowns at it (the face and
// 🤨) and sets the clocks right (fixQ, fixO). Once he sits, he has watched Q tick: it can't jump on him. Push it
// behind his back and he hears the stepladder right behind his chair, turns, and sets it right (suspect).
//
// Nobody leaves before the boss, and his coat on the rack says he is in (world.coat). At 3:13 Kev picks up his
// laptop, sees the coat, and puts it down again (bagCheck). Lin and Kev may doubt a clock, but they obey a coat: the
// moment the boss takes his off the rack, whatever the time, they look at it (🧥👀), look at each other and shrug
// (🤷: not their call), and once he is out of the door they wave and follow him out (follow). At their own 4:50 with
// the coat still there they stand up, look at the rack (🧥😬), sit down again and try again a few seconds later.
//
// After each look at his own clock the boss glances at your desk: you there, [@player, ✔️]; empty, [@player, ❓],
// and he goes looking for you (index.js hunts: office, open plan, lobby, the street); you already out of the door,
// he rings you first (📱 @player ❓). Seen out in the street before he has gone home, you are caught (index.js
// roles.scene). If his clock has jumped and you are in his office, he looks from the clock to you (@player 🤨) and
// sets it right. Told about a clock (a tattle), he sets the pushed clocks right (fixQ, fixO).
//
// The schedule reads it through level.clockFor (src/sim/npcs.js). The HUD clock, the deadline, the gather and the
// rules keep the true time. A clock you pushed hangs crooked (presentation.js).
import { FIXED_DT, at } from '../../config.js';
import { say, burst, sightline } from '../../core/fx.js';
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
const SUSPECT_S = 1.2; // real s the boss stares at you in his office after his clock jumped
const COAT_S = 1.2; // real s Lin or Kev looks at the boss's coat rack
const SEE_S = 0.7; // real s after the boss takes his coat (his 👋) before Lin and Kev turn to it
const SHRUG_S = 1.2; // real s Lin and Kev look at each other and shrug, the coat gone
const RECHECK_S = 8; // real s sitting before Lin or Kev stands up to look at the rack again
const REACH_S = 1.2; // real s the boss reaches up to set a clock right
const BATTERY_S = 2.0; // real s the caretaker reaches up to the boss's clock at 3:00
const AGREE_MIN = 10; // two clocks this close agree (nobody minds ten minutes)

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

// His beats: the times of his schedule entries and his LOOK_UPS, sorted, once per day. A bubble entry is not a beat,
// nor are Kev's laptop beat (bagCheck) and his sitting down after it: his eyes are on the coat.
function beatsOf(npc) {
  const s = npc._schedule;
  const quiet = (e, i) => e.do === 'say' || e.arrive === 'bagCheck' || s[i - 1]?.arrive === 'bagCheck';
  const times = new Set([...s.filter((e, i) => !quiet(e, i)).map((e) => e.at), ...(LOOK_UPS[npc.id] ?? [])]);
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
  // Caught out in the street (the scene role) gets its own end card (end-scenes.js 'street').
  game.events.on('day:end', (p) => {
    if (game.level?.id !== 'early-bus') return;
    const o = p?.outcome;
    if (o?.result === 'caught' && game.caught?.reason === 'scene') o.why = 'street';
  });
}

// level.clockFor: the minute npc's schedule reads this step.
export function clockFor(game, npc, sim) {
  if (npc.id === 'caretaker') return game.clock.minute; // not one of the office: his own watch
  listen(game);
  const st = (npc._clk ??= {
    off: 0, beat: null, beats: beatsOf(npc), lookT: 0, saw: {}, timers: [],
    check: 'stand', recheck: 0, coat: game.world.coat, w: null,
  });
  st.w = game.world;
  st.lookT = Math.max(0, st.lookT - FIXED_DT);
  tickTimers(st);
  if (npc.id !== 'boss') {
    follow(game, npc, st, sim);
    homeCheck(game, st);
  }
  else {
    heardLadder(game, npc, st, sim);
    callOut(game, npc, st);
  }
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

// The boss in his office: his clock pushed right behind his chair. He hears the stepladder, turns and looks from the
// clock to you, and sets it right (suspect). Pushed while he was out, it waits for his look at it (lookUp).
function heardLadder(game, npc, st, sim) {
  const w = game.world;
  const here = npc.active && !npc._gone && inZone(game, 'boss_office', npc.x, npc.y);
  if (!here) {
    st.q = null;
    return;
  }
  if (st.q != null && w.bossClock > st.q) {
    game.events.emit('boss:heard', {});
    suspect(game, npc, sim);
  }
  st.q = w.bossClock;
}

// The boss looking for you, and you out of the door: he rings you, once a hunt (where are you?), and keeps looking.
function callOut(game, npc, st) {
  if (npc.override !== 'hunting') {
    st.called = false;
    return;
  }
  const p = game.player;
  if (st.called || !inZone(game, 'outdoors', p.x, p.y) || game.phase !== 'day' || game.caught) return;
  st.called = true;
  say(game, npc.id, ['📱', '@player', '❓'], { kind: 'speech', voice: npc.voice, ttl: 1.8 });
  say(game, { x: p.x, y: p.y - 0.2 }, ['📳'], { kind: 'thought', ttl: 1.8 }); // your phone buzzes
  game.events.emit('boss:call', {});
}

// The boss takes his coat off the rack, whatever the time: Lin (or Kev) at his desk looks at it (🧥👀), then at the
// other one, and shrugs (🤷); then it is home time for him too (he stands up, waits for the boss to be out of the
// door, waves and goes: the schedule's 4:50 entries). Held while he is busy (a shout, say) and fired when he is free.
const OTHER = { lin: 'kev_desk', kev: 'lin_desk' };
function follow(game, npc, st, sim) {
  if (st.follow || game.world.coat !== 'boss' || game.phase !== 'day') return;
  if (!npc.active || npc._gone || npc.override || !inZone(game, 'open_plan', npc.x, npc.y)) return;
  if (game.clock.minute + st.off >= HOME_AT) return; // his own home time came first: coatCheck has it
  st.follow = 'look';
  st.timers.push({
    t: SEE_S,
    fn: () => {
      sim.lookAt(game, npc, 'coat', COAT_S);
      sim.speak(game, npc, [{ say: ['🧥', '👀'], kind: 'thought', ttl: COAT_S }]);
      game.events.emit('coat:seen', { by: npc.id, coat: false, follow: true });
    },
  });
  st.timers.push({
    t: SEE_S + COAT_S,
    fn: () => {
      st.follow = 'shrug';
      sim.lookAt(game, npc, OTHER[npc.id], SHRUG_S);
      npc._shrugUntil = game.loopTime + SHRUG_S;
      sim.speak(game, npc, [{ say: ['🤷'], kind: 'thought', ttl: SHRUG_S }]);
      game.events.emit('coat:shrug', { by: npc.id });
    },
  });
  st.timers.push({
    t: SEE_S + COAT_S + SHRUG_S,
    fn: () => {
      st.follow = 'go';
      st.off = HOME_AT - game.clock.minute; // home time: the boss's coat says so
      st.check = 'wait';
      game.events.emit('coat:follow', { by: npc.id });
    },
  });
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

// A bubble by a clock (its face, a jump, a shrug; the boss's look at your desk): beside his head on the side away
// from the clock when he stands under it, so it never hides the clock. Kev, at his desk under O, gets his on the
// side away from Lin, so it is never between the two of them.
const SIDE = { boss: 1, open: -1 };
function clockSay(game, npc, clock, icons, kind, ttl) {
  const c = game.level.spots[CLOCKS[clock].spot];
  const under = Math.abs(npc.x - 0.5 - c.x) < 2 && npc.y - 0.5 - c.y < 3.5;
  const side = npc.id === 'kev' ? 1 : SIDE[clock];
  const owner = under ? { x: npc.x + side * (0.7 + 0.5 * icons.length), y: npc.y + 0.8 } : npc.id;
  say(game, owner, icons, { kind, voice: npc.voice, ttl });
}

// He turns to his zone's clock for a second and thinks its time.
function lookUp(game, npc, sim) {
  const st = npc._clk;
  const clock = zoneClock(game, npc);
  const c = CLOCKS[clock];
  sim.lookAt(game, npc, c.spot, LOOK_S);
  st.lookT = LOOK_GAP_S;
  st.beat = beatAt(npc, believed(game, npc, st)); // this look covers every beat up to now
  game.events.emit('clock:look', { id: npc.id, clock: c.id });
  const off = game.world[c.field] || 0;
  const face = faceFor(shown(game, clock));
  if (npc.id !== 'boss') {
    // Lin or Kev: O has jumped since his last look. He frowns at it and keeps his own time.
    if (off !== (st.seen ?? 0)) {
      st.seen = off;
      clockSay(game, npc, clock, [face, '🤨'], 'thought', LOOK_S + 0.3);
      game.events.emit('clock:doubt', { id: npc.id, clock: c.id, off });
    } else {
      clockSay(game, npc, clock, [face], 'thought', LOOK_S);
    }
    return;
  }
  // The boss at Q. You in his office with it moved: he looks from it to you (suspect).
  const moved = off !== st.off;
  if (moved && inZone(game, 'boss_office', game.player.x, game.player.y)) {
    clockSay(game, npc, clock, [face, '🤨'], 'thought', LOOK_S + 0.3);
    st.timers.push({ t: LOOK_S, fn: () => suspect(game, npc, sim) });
    return;
  }
  if (moved && (st.settled || Math.abs(off - st.off) > AGREE_MIN)) {
    // It disagrees with O (or it moved while he sat under it): he frowns and sets the clocks right.
    clockSay(game, npc, clock, [face, '🤨'], 'thought', LOOK_S + 0.3);
    game.world.fix = true;
    game.events.emit('boss:mismatch', { off, believed: st.off });
    st.off = Math.min(st.off, off); // he goes by the earlier of the two until he has set them right
    st.beat = beatAt(npc, believed(game, npc, st));
  } else if (moved) {
    const ahead = off > st.off;
    st.off = off;
    st.beat = beatAt(npc, believed(game, npc, st)); // (no second look for the jump itself)
    clockSay(game, npc, clock, [face, '😮'], 'realize', LOOK_S + 0.3);
    game.events.emit('clock:jump', { id: npc.id, clock: c.id, off, ahead });
  } else {
    clockSay(game, npc, clock, [face], 'thought', LOOK_S);
  }
  st.settled = true;
  // His clock, then your desk.
  st.timers.push({ t: LOOK_S, fn: () => deskGlance(game, npc, sim) });
}

// You were in his office when his clock jumped: he stares at you, 🤨, and goes to set it right (fixQ, his next leg).
function suspect(game, npc, sim) {
  if (npc.override || !npc.active || game.phase !== 'day' || game.caught || game.outcome) return;
  const p = game.player;
  const d = Math.atan2(p.y - npc.y, p.x - npc.x);
  npc._stare = { t: SUSPECT_S, dir: d, back: npc._stare ? npc._stare.back : npc._faceTarget };
  npc._faceTarget = d;
  sim.holdFor(npc, SUSPECT_S);
  sightline(game, npc.id, 'notice', SUSPECT_S);
  clockSay(game, npc, 'boss', ['@player', '🤨'], 'thought', SUSPECT_S + 0.2);
  game.world.fix = true;
  game.events.emit('boss:suspect', {});
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
  const empty = !playerAtDesk(game);
  if (!empty) clockSay(game, npc, 'boss', ['@player', '✔️'], 'thought', DESK_S + 0.2); // there: good
  game.events.emit('boss:desk', { empty });
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

// Set a pushed clock right: he climbs to it and turns the hands back; he knows the time again.
function fixRow(clock) {
  const c = CLOCKS[clock];
  return {
    spot: c.spot,
    pending: (npc) => !!npc._clk?.w?.fix && !!npc._clk.w[c.field],
    arrive(game, npc, sim) {
      const w = game.world;
      w[c.field] = 0;
      npc._clk.off = 0; // he knows the time again
      npc._clk.beat = beatAt(npc, game.clock.minute);
      if (clock === 'boss') npc._clk.q = 0;
      if (!w.bossClock && !w.openClock) w.fix = false;
      npc._reachUntil = game.loopTime + REACH_S;
      sim.holdFor(npc, REACH_S);
      clockSay(game, npc, clock, [faceFor(game.clock.minute), '😠'], 'speech', REACH_S + 0.3);
      game.events.emit('clock:reset', { clock });
    },
  };
}

// The boss under O, back from lunch: the first clock he has seen for an hour, so he believes it. 4:50 or later:
// 😮 home time (world.herd). Earlier: its time (later than he thought: 😮).
function readOpen(game, npc, sim) {
  const st = npc._clk;
  const time = shown(game, 'open');
  const face = faceFor(time);
  const off = game.world.openClock || 0;
  sim.lookAt(game, npc, 'open_clock_chair', LOOK_S + 0.4);
  npc._faceTarget = -Math.PI / 2; // up at the clock on the wall
  if (npc._stare) npc._stare.dir = -Math.PI / 2;
  game.events.emit('clock:look', { id: npc.id, clock: CLOCKS.open.id });
  const later = off > st.off;
  st.off = off;
  st.beat = beatAt(npc, game.clock.minute + st.off);
  if (time >= HOME_AT) {
    game.world.herd = true;
    game.world.herdShown = time; // the end card's clock
    clockSay(game, npc, 'open', [face, '😮'], 'realize', LOOK_S + 0.4);
    game.events.emit('boss:herd', { shown: time });
  } else {
    clockSay(game, npc, 'open', later ? [face, '😮'] : [face], later ? 'realize' : 'thought', LOOK_S + 0.4);
    game.events.emit('boss:readO', { shown: time, off });
  }
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

  // Back from the kitchen with his coffee he walks under O and looks up at it (passO).
  passO: {
    spot: 'open_clock_chair',
    state: { _onBreak: false },
    pending: (npc) => npc._onBreak,
    arrive(game, npc, sim) {
      npc._onBreak = false;
      readOpen(game, npc, sim);
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

  // Kev at 3:13: up with his laptop, a look at the boss's coat on the rack, 🧥😬, and he sits down again (3:14).
  bagCheck: {
    state: { _laptopUntil: 0 },
    arrive(game, npc, sim) {
      npc._laptopUntil = game.loopTime + COAT_S + 0.3;
      sim.lookAt(game, npc, 'coat', COAT_S);
      sim.speak(game, npc, [{ say: ['🧥', '😬'], kind: 'thought', ttl: COAT_S }]);
      game.events.emit('coat:seen', { by: npc.id, coat: game.world.coat === 'hook', early: true });
    },
  },

  // The caretaker at 3:00, up the stepladder under the boss's clock: a new battery 🔋.
  battery: {
    arrive(game, npc, sim) {
      npc._reachUntil = game.loopTime + BATTERY_S;
      sim.holdFor(npc, BATTERY_S);
      clockSay(game, npc, 'boss', ['🔋'], 'speech', BATTERY_S);
      game.events.emit('caretaker:battery', {});
    },
  },

  // Lin or Kev at home time: up, a look at the boss's coat rack. His coat there: 🧥😬, sit down again (the beat back
  // makes him glance at his clock). Gone: wait for the boss to be out of the door, then go.
  coatCheck: {
    arrive(game, npc, sim) {
      const st = npc._clk;
      const w = game.world;
      st.coat = w.coat;
      if (st.follow) return; // he saw the coat go (follow): up, and after the boss
      sim.lookAt(game, npc, 'coat', COAT_S);
      if (w.coat === 'hook') {
        sim.speak(game, npc, [{ say: ['🧥', '😬'], kind: 'thought', ttl: COAT_S }]);
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
