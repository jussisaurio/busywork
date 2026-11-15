// Hold Music's phones: the switchboard, the four phones, Lin's cord and the 3:30 call.
//
// A ring (you plug a cord into a jack) sets ring_<p> = 'you'. Every step (tick, below) a ringing phone is answered
// by its owner if he is free and in earshot, else by the nearest free NPC in earshot (call_<p>). He walks over,
// picks up (line_<p>) and gets the hold music until he gives up (HOLD minutes). Nobody hears it: it stops after
// RING_FOR minutes. The ring is also a noise (index.js noises): heads in earshot turn.
//
// 3:30 (day.gatherAt), the interview calls Lin's phone:
//   the cord is out                       'dead'     it never rings; Lin stares at it        route 'unplugged'
//   someone else is on Lin's line         'busy'     the outside lamp flashes and goes dark  route 'busy'
//   else it rings ('ringing', red ripples); Lin answers if she is free and in earshot   'lin'   fail
//                                         else the nearest free NPC: 💼❓ 🤷, hangs up   'other'  route 'answered'
//   nobody answers by RING_OUT minutes    'rangOut'                                       route 'ringout'
// Lin hangs up her own line at once (she is waiting for a call), and a ring on it is let finish before the call.
import { spotPos } from '../../game/perception.js';

export const START = 15 * 60; // 3:00 PM
export const RING_RADIUS = 6; // tiles, straight line: earshot of a ring
const RING_FOR = 1.5; // game minutes a ring nobody hears goes on
const RING_OUT = 2; // game minutes the interviewer lets it ring
const CHECK_EVERY = 3.5; // game minutes between Lin's checks of her phone
const CHECK_FOR = 0.8; // game minutes she holds the receiver to her ear
const NOTE_EVERY = 1.3; // game minutes between hold-music notes

// tile: the map letter the phone is drawn on; at: the spot its ring comes from (earshot is measured from here);
// lamp: its colour on the switchboard, its handset and its ripples.
export const PHONES = {
  lin: { owner: 'lin', tile: 'L', at: 'lin_side', lamp: '#3fd0bd' },
  boss: { owner: 'boss', tile: 'B', at: 'boss_window', lamp: '#5a7fd0' },
  kev: { owner: 'kev', tile: 'V', at: 'kev_side', lamp: '#a8bb4a' },
  kitchen: { owner: null, tile: 'W', at: 'kitchen_phone', lamp: '#f2c14e' },
};
export const PHONE_IDS = Object.keys(PHONES);
export const OUTSIDE = '#e5432f'; // the outside line: the interviewer

// On his way to a phone, or on it (the lures' overrides, below).
export const holdOf = (npc) => /^(to|on)_(\w+)_phone$/.exec(npc.override ?? '');
export const onPhone = (npc) => !!holdOf(npc) || npc.override === 'to_job' || npc.override === 'on_job';
const dist = (n, p) => Math.hypot(n.x - p.x, n.y - p.y);
const nearSpot = (game, n, name, r = 0.35) => dist(n, spotPos(game, name)) < r;

export function initialPhones() {
  const w = {
    interview: 'due', // 'due' | 'ringing' | 'lin' | 'other' | 'busy' | 'dead' | 'rangOut'
    jobAt: 0, // when it started ringing
    jobBy: null, // who is going to answer it
    cord: 'in', // Lin's phone cord: 'in' | 'out'
    linCheck: 0, // Lin holds her receiver to her ear until this minute
    checkAt: 0.8, // her next check
    kevReach: 0, // Kev is crouched at the socket until this minute
    busyAt: 0, // the minute the interviewer got the busy line
  };
  for (const p of PHONE_IDS) {
    w[`ring_${p}`] = null; // null | 'you' (your ring) | 'job' (the interview)
    w[`ringAt_${p}`] = 0;
    w[`call_${p}`] = null; // who is going to answer your ring
    w[`line_${p}`] = null; // who is on it
    w[`noteAt_${p}`] = 0;
  }
  return w;
}

// The phone tick: from level.clockFor, once per step (the first NPC's). Returns nothing.
export function phoneTick(game, sim) {
  if (game.phase !== 'day') return;
  const w = game.world;
  const m = game.clock.minute;
  const day = game.level.day;
  const npcs = game.npcs;
  const byId = (id) => npcs.find((n) => n.id === id);
  const picked = new Set(PHONE_IDS.map((p) => w[`call_${p}`]).filter(Boolean));
  if (w.jobBy) picked.add(w.jobBy);
  const free = (n) => n.active && !n._gone && !onPhone(n) && !picked.has(n.id);
  const pick = (p, ownerId) => {
    const where = spotPos(game, PHONES[p].at);
    const hears = (n) => dist(n, where) <= RING_RADIUS;
    const owner = ownerId && byId(ownerId);
    if (owner && free(owner) && hears(owner)) return owner;
    let best = null;
    for (const n of npcs) if (free(n) && hears(n) && (!best || dist(n, where) < dist(best, where))) best = n;
    return best;
  };

  // Your rings.
  for (const p of PHONE_IDS) {
    if (w[`ring_${p}`] !== 'you' || w[`call_${p}`]) continue;
    const n = pick(p, PHONES[p].owner);
    if (n) {
      w[`call_${p}`] = n.id;
      picked.add(n.id);
      game.events.emit('phone:answering', { phone: p, by: n.id });
    } else if (m - w[`ringAt_${p}`] > RING_FOR) {
      w[`ring_${p}`] = null;
      game.events.emit('phone:unanswered', { phone: p });
    }
  }

  // The interview.
  const lin = byId('lin');
  if (w.interview === 'due' && m >= day.gatherAt) {
    if (w.cord === 'out') {
      w.interview = 'dead';
      game.events.emit('interview:dead', {});
      if (lin && lin.active && !onPhone(lin)) {
        sim.speak(game, lin, [{ say: ['🕞', '❓'], kind: 'thought', after: 1.6, ttl: 1.6 }]);
      }
    } else if (w.line_lin && w.line_lin !== 'lin') {
      w.interview = 'busy';
      w.busyAt = m;
      game.events.emit('interview:busy', { by: w.line_lin });
      if (lin && lin.active && !onPhone(lin)) sim.speak(game, lin, [{ say: [`@${w.line_lin}`, '😠'], after: 1.2 }]);
    } else if (!w.ring_lin && !w.line_lin) { // (a ring of yours on her phone is let finish first)
      w.interview = 'ringing';
      w.ring_lin = 'job';
      w.ringAt_lin = m;
      w.jobAt = m;
      game.events.emit('interview:ringing', {});
      game.events.emit('ring:job', {});
    }
  }
  if (w.interview === 'ringing' && !w.jobBy) {
    const n = pick('lin', 'lin');
    if (n) {
      w.jobBy = n.id;
      game.events.emit('job:answering', { by: n.id });
    } else if (m - w.jobAt >= RING_OUT) {
      w.interview = 'rangOut';
      w.ring_lin = null;
      game.events.emit('interview:rangOut', {});
    }
  }
  // Lin's stare at a dead phone: a moment after 3:30, once she is at her desk.
  if (w.interview === 'dead' && lin && !w.stared && m >= day.gatherAt + 0.6 && nearSpot(game, lin, 'lin_desk', 0.6)) {
    w.stared = true;
    sim.lookAt(game, lin, 'lin_side', 2);
    sim.speak(game, lin, [{ say: ['🕞', '❓'], kind: 'thought', ttl: 1.8 }]);
  }

  // The hold music: a note now and then over everyone on a line (not the interview).
  for (const p of PHONE_IDS) {
    const who = w[`line_${p}`];
    if (!who || (p === 'lin' && (w.interview === 'lin' || w.interview === 'other'))) continue;
    // On hold he stares into space: his eyes stay ahead (no glances over his shoulder), though a ring still turns
    // his head. This is what makes ringing someone a way past him.
    const holder = byId(who);
    const gaze = GAZE[who]?.[p];
    if (holder && gaze && holder.override === `on_${p}_phone`) sim.lookAt(game, holder, gaze, 0.3);
    if (m < w[`noteAt_${p}`]) continue;
    w[`noteAt_${p}`] = m + NOTE_EVERY;
    const n = byId(who);
    if (n) sim.speak(game, n, [{ say: [Math.floor(m) % 2 ? '🎶' : '🎵'], ttl: 1.1 }]);
  }

  // Lin waits for her call: at her desk she lifts the receiver now and then, listens, puts it back and looks at the
  // clock. (Not with the cord out: she would hear that it's dead.)
  if (lin && m < day.gatherAt) {
    const seated = !lin.override && !lin.moving && nearSpot(game, lin, 'lin_desk');
    if (w.linCheck && m >= w.linCheck) {
      w.linCheck = 0;
      sim.lookAt(game, lin, 'clock_view', 1.4);
      sim.speak(game, lin, [{ say: ['🕞'], kind: 'thought', ttl: 1.3 }]);
    } else if (!w.linCheck && seated && m >= w.checkAt && w.cord === 'in' && !w.ring_lin && !w.line_lin) {
      w.linCheck = m + CHECK_FOR;
      w.checkAt = m + CHECK_EVERY;
      sim.holdFor(lin, CHECK_FOR / 0.6 + 0.2);
      game.events.emit('lin:checks', {});
    }
  }
}

// --- The switchboard and the cord ------------------------------------------------------------------
const WHOSE = { lin: "Lin's phone", boss: "the boss's phone", kev: "Kev's phone", kitchen: 'the kitchen phone' };
export const ringable = (w, p) => !w[`ring_${p}`] && !w[`call_${p}`] && !w[`line_${p}`] && (p !== 'lin' || w.cord === 'in');
const ring = (p) => ({
  on: `ring_${p}`, icon: null, text: `ring ${WHOSE[p]}`, duration: 0.6, sneaky: true, saw: '☎️',
  can: (pl, w) => ringable(w, p),
  done(game) {
    const w = game.world;
    w[`ring_${p}`] = 'you';
    w[`ringAt_${p}`] = game.clock.minute;
    game.events.emit('switchboard:ring', { phone: p });
    game.events.emit(`ring:${p}`, {});
  },
});

export const INTERACTIONS = {
  ring_lin: ring('lin'),
  ring_boss: ring('boss'),
  ring_kev: ring('kev'),
  ring_kitchen: ring('kitchen'),
  unplug: {
    on: 'lin_socket', icon: null, text: "pull Lin's phone cord out of the wall", duration: 2.5, sneaky: true, saw: '🔌',
    can: (pl, w) => w.cord === 'in' && !w.ring_lin && !w.call_lin && !w.line_lin,
    done(game) {
      game.world.cord = 'out';
      game.events.emit('cord:out', {});
    },
  },
};

// Every ring is a noise at its phone: heads in earshot turn, ripples in the phone's colour, the bell.
export const NOISES = {
  ...Object.fromEntries(PHONE_IDS.map((p) => [`ring:${p}`, {
    at: PHONES[p].at, radius: RING_RADIUS, every: 1.3, turn: 1.1, while: (w) => w[`ring_${p}`] === 'you',
    ripple: { color: PHONES[p].lamp }, sfx: 'phoneRing',
  }])),
  'ring:job': {
    at: 'lin_side', radius: RING_RADIUS, every: 1.1, turn: 1.1, while: (w) => w.ring_lin === 'job',
    ripple: { color: OUTSIDE }, sfx: 'phoneRing',
  },
};

// --- Answering: one lure per (person, phone) --------------------------------------------------------
//   HOLD[npc][phone]: game minutes on hold. Lin hangs up her own line at once; anywhere else she hopes it is her
//   interviewer and holds on. The boss loves the hold music.
const HOLD = {
  boss: { boss: 7, lin: 9, kev: 4, kitchen: 4 },
  lin: { lin: 0.3, boss: 10, kev: 10, kitchen: 10 },
  kev: { kev: 4, lin: 4, boss: 4, kitchen: 4 },
};
// Where each stares while on hold at each phone (a spot straight ahead of where he stands).
const GAZE = {
  boss: { boss: 'boss_window_view', lin: 'boss_front', kev: 'kev_desk', kitchen: null },
  lin: { boss: 'boss_window', kev: 'kev_desk', kitchen: null },
  kev: { lin: 'boss_front', boss: 'boss_window', kev: 'kitchen_kev', kitchen: null },
};
export const STAND = { // where each answers each phone
  boss: { boss: 'boss_window', lin: 'lin_side', kev: 'kev_side', kitchen: 'kitchen_phone' },
  lin: { lin: 'lin_desk', boss: 'boss_front', kev: 'kev_side', kitchen: 'kitchen_phone' },
  kev: { kev: 'kev_desk', lin: 'lin_side', boss: 'boss_front', kitchen: 'kitchen_phone' },
};
const PICK_UP = { // his first line on picking up
  boss: [{ say: ['❓'], ttl: 0.9 }, { say: ['🎵', '😌'], after: 1, ttl: 1.4 }],
  lin: [{ say: ['💼', '❓'], ttl: 1.1 }, { say: ['🎵'], after: 1.2, ttl: 1.2 }],
  kev: [{ say: ['❓'], ttl: 0.9 }, { say: ['🎵'], after: 1, ttl: 1.2 }],
};
const LIN_OWN = [{ say: ['❓'], ttl: 0.6 }, { say: ['😠'], after: 0.5, ttl: 1 }];
const HUNG_UP = { boss: [{ say: ['🎵', '😊'] }], lin: [{ say: ['😠'] }], kev: [{ say: ['🤷'] }] };

const CAST_IDS = ['boss', 'lin', 'kev'];
export const LURES = [];
for (const npc of CAST_IDS) {
  // The interview: Lin takes it at her desk; anyone else at her phone, puzzled, and hangs up.
  const mine = npc === 'lin';
  LURES.push({
    npc,
    when: (w) => w.jobBy === npc,
    override: 'to_job',
    plan: 'job',
    label: 'answer the interview call',
    spot: mine ? 'lin_desk' : 'lin_side',
    react: { wait: mine ? 0.2 : 0.5, says: [{ say: ['❗'], ttl: 0.8 }] },
    work: {
      override: 'on_job',
      minutes: mine ? 99 : 1.4,
      progress: `job_${npc}`,
      start: {
        set: { interview: mine ? 'lin' : 'other', line_lin: npc, ring_lin: null },
        event: mine ? 'interview:lin' : 'interview:other',
        says: mine
          ? [{ say: ['💼', '😊'], ttl: 1.6 }, { say: ['😊', '👍'], after: 1.8, ttl: 1.6 }]
          : [{ say: ['💼', '❓'], ttl: 1.2 }, { say: ['@lin', '❓'], after: 1.3, ttl: 1.1 }, { say: ['🤷'], after: 2.2, ttl: 1.2 }],
      },
      done: { set: { jobBy: null, line_lin: null }, event: 'interview:hungUp' },
    },
  });
  for (const p of PHONE_IDS) {
    const own = npc === 'lin' && p === 'lin';
    LURES.push({
      npc,
      when: (w) => w[`call_${p}`] === npc,
      override: `to_${p}_phone`,
      plan: `phone_${p}`,
      label: `answer ${WHOSE[p]}`,
      spot: STAND[npc][p],
      react: { wait: 0.4, says: [{ say: ['❗'], ttl: 0.8 }], event: `${npc}:answering` },
      work: {
        override: `on_${p}_phone`,
        minutes: HOLD[npc][p],
        progress: `hold_${npc}`,
        start: {
          set: { [`line_${p}`]: npc, [`ring_${p}`]: null },
          event: `${npc}:onHold`,
          says: own ? LIN_OWN : PICK_UP[npc],
        },
        done: { set: { [`line_${p}`]: null, [`call_${p}`]: null }, event: `${npc}:hungUp`, says: own ? [] : HUNG_UP[npc] },
      },
    });
  }
}
