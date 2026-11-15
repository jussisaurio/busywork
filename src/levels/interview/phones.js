// The Interview's phones: the switchboard, the four phones, Lin's cord and the 3:30 call.
//
// A ring (you plug a cord into a jack) sets ring_<p> = 'you'. Every step (tick, below) a ringing phone is answered
// by its owner if he is free and in earshot, else by the nearest free NPC in earshot (call_<p>). He walks over,
// picks up (line_<p>) and gets the hold music until he gives up (HOLD minutes). Nobody hears it: it stops after
// RING_FOR minutes. The ring is also a noise (index.js noises): heads in earshot turn. Earshot and the drawn rings
// are measured from the phone itself (PHONES bell).
//
// Two lines: the desk phones are internal (each rings in its owner's colour); the kitchen wall phone shares the
// outside line with the interviewer, so it rings red like her call will. Lin, waiting for that call, hopes on a red
// ring and holds on; on an internal one she hangs up (her own phone: she slams it down).
//
// 3:30 (day.gatherAt), the interview calls Lin's phone:
//   the cord is out                       'dead'     it never rings; Lin stares at it        route 'unplugged'
//   someone else is on Lin's line         'busy'     the outside lamp flashes and goes dark  route 'busy'
//   else it rings ('ringing', red rings); Lin answers if she is free and in earshot   'lin'   fail
//                                         else the nearest free NPC: 💼❓ 🤷, hangs up   'other'  route 'answered'
//   nobody answers by RING_OUT minutes    'rangOut'                                       route 'ringout'
// A ring of yours on Lin's phone is let finish before the call.
import { spotPos, inZone } from '../../game/perception.js';

export const START = 15 * 60; // 3:00 PM
export const RING_RADIUS = 6; // tiles, straight line: earshot of a ring
export const RING_EVERY = 1.3; // s between a ring's bells (the drawn rings and the noise)
export const JOB_EVERY = 1.1; // the interview's
const RING_FOR = 1.5; // game minutes a ring nobody hears goes on
const RING_OUT = 2; // game minutes the interviewer lets it ring
const CHECK_EVERY = 2.6; // game minutes between Lin's checks of her line, before her tea
const CHECK_FOR = 0.8; // game minutes she holds the receiver to her ear
const GLANCE_EVERY = 1.7; // game minutes between her glances at the clock after her tea, rehearsing
export const BACK_AT = START + 21; // from here on Lin is back from her tea (cast.js: 3:22) with her notes
export const NOTES_AFTER = 0.6; // game minutes from picking up to the hold tune
export const TUNE_ENDS = 0.9; // hold progress where the tune stops; he hangs up when it reaches 1
export const SLAM = 0.6; // Lin on her own phone: the hold progress where she slams it down (😠)

// tile: the map letter the phone is drawn on; at: the spot its noise comes from (heads turn to it); bell: where the
// phone itself is (tiles): earshot and the rings; lamp: its colour on the switchboard, its handset and its rings.
export const OUTSIDE = '#e5432f'; // the outside line: the interviewer, and the kitchen wall phone
export const PHONES = {
  lin: { owner: 'lin', tile: 'L', at: 'lin_side', bell: { x: 1.44, y: 6.47 }, lamp: '#3fd0bd' },
  boss: { owner: 'boss', tile: 'B', at: 'boss_window', bell: { x: 2.44, y: 3.38 }, lamp: '#5a7fd0' },
  kev: { owner: 'kev', tile: 'V', at: 'kev_side', bell: { x: 24.5, y: 7.44 }, lamp: '#a8bb4a' },
  kitchen: { owner: null, tile: 'W', at: 'kitchen_phone', bell: { x: 20.5, y: 0.7 }, lamp: OUTSIDE },
};
export const PHONE_IDS = Object.keys(PHONES);

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
    checkAt: START + 0.6, // her next check
    glanceAt: 0, // her next glance at the clock, rehearsing
    linFix: false, // she found her line dead: she is going to push the plug back in
    kevAt: 0, // Kev crouched at the socket at this minute (cast.js plugIn)
    kevJamAt: 0, // he jams Lin's loose plug back in at this minute (0: not going to)
    kevJam: 0, // ... and is at it (the jam pose) until this minute
    kevReach: 0, // he reaches into the socket with his charger until this minute
    kevCharge: 0, // his mobile charges at the socket from this minute (0: not)
    sparkAt: -9, // the spark of the jammed plug
    busyAt: 0, // the minute the interviewer got the busy line
    chairAt: 0, // the boss's next look at your chair, from 3:30
    heardJob: '', // who on hold has heard the interview ring (ids, space separated)
    bossRise: false, // the boss half-rises at Lin's phone ringing (LURES)
    roseFor: -1, // ... once per ring: the ring's ringAt_lin
  };
  for (const p of PHONE_IDS) {
    w[`ring_${p}`] = null; // null | 'you' (your ring) | 'job' (the interview)
    w[`ringAt_${p}`] = 0;
    w[`call_${p}`] = null; // who is going to answer your ring
    w[`line_${p}`] = null; // who is on it
    w[`lineAt_${p}`] = 0; // when he picked up
    w[`tune_${p}`] = false; // the hold tune plays on it
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
    const where = PHONES[p].bell;
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
  // When each line was picked up, and the hold tune: from a moment after, until it ends (TUNE_ENDS) a moment
  // before he hangs up. (Drawn as notes out of his handset: painters.js; and heard: presentation.js SOUNDS.)
  for (const p of PHONE_IDS) {
    const who = w[`line_${p}`];
    if (who && !w[`lineAt_${p}`]) w[`lineAt_${p}`] = m;
    else if (!who) w[`lineAt_${p}`] = 0;
    const holder = who && byId(who);
    const until = who === 'lin' && p === 'lin' ? SLAM : TUNE_ENDS;
    w[`tune_${p}`] = !!holder && holder.override === `on_${p}_phone` && m - w[`lineAt_${p}`] >= NOTES_AFTER
      && w[`hold_${who}`] < until;
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
  // Someone on hold in earshot of the interview's ring: ❗, a look its way, and the tune keeps him.
  if (w.ring_lin === 'job') {
    for (const n of npcs) {
      const h = holdOf(n);
      if (!h || h[1] !== 'on' || w.heardJob.includes(n.id) || dist(n, PHONES.lin.bell) > RING_RADIUS) continue;
      w.heardJob += ` ${n.id}`;
      sim.lookAt(game, n, 'lin_side', 1.2);
      sim.speak(game, n, [{ say: ['❗'], ttl: 1.1 }]);
    }
  }
  // Lin's stare at a dead phone: a moment after 3:30, once she is at her desk.
  if (w.interview === 'dead' && lin && !w.stared && m >= day.gatherAt + 0.6 && nearSpot(game, lin, 'lin_desk', 0.6)) {
    w.stared = true;
    sim.lookAt(game, lin, 'lin_side', 2);
    sim.speak(game, lin, [{ say: ['🕞', '❓'], kind: 'thought', ttl: 1.8 }]);
  }

  // On hold he stares into space: his eyes stay ahead (no glances over his shoulder), though a ring still turns
  // his head. This is what makes ringing someone a way past him. (The tune is drawn: painters.js.)
  for (const p of PHONE_IDS) {
    const who = w[`line_${p}`];
    if (!who || (p === 'lin' && (w.interview === 'lin' || w.interview === 'other'))) continue;
    const holder = byId(who);
    const gaze = GAZE[who]?.[p];
    if (holder && gaze && holder.override === `on_${p}_phone` && !holder._stare) sim.lookAt(game, holder, gaze, 0.3);
  }

  // Lin waits for her call. Before her tea she checks her line now and then: lifts the receiver, listens, puts it
  // back and looks at the clock; a dead line (the cord out) gets a ❓ and she pushes the plug back in (LURES). Back
  // from her tea she rehearses from her notes, with a glance at the clock now and then.
  if (lin && m < day.gatherAt) {
    const seated = !lin.override && !lin.moving && nearSpot(game, lin, 'lin_desk');
    if (w.linCheck && m >= w.linCheck) {
      w.linCheck = 0;
      if (w.cord === 'out') {
        w.linFix = true;
        game.events.emit('lin:deadLine', {});
      } else {
        sim.lookAt(game, lin, 'clock_view', 1.4);
        sim.speak(game, lin, [{ say: ['🕞'], kind: 'thought', ttl: 1.3 }]);
      }
    } else if (!w.linCheck && seated && m < BACK_AT && m >= w.checkAt && !w.ring_lin && !w.line_lin) {
      w.linCheck = m + CHECK_FOR;
      w.checkAt = m + CHECK_EVERY;
      sim.holdFor(lin, CHECK_FOR / 0.6 + 0.2);
      if (w.cord === 'out') sim.speak(game, lin, [{ say: ['❓'], after: 0.7, ttl: 0.9 }]);
      game.events.emit('lin:checks', {});
    } else if (seated && m >= BACK_AT && m >= w.glanceAt) {
      w.glanceAt = m + GLANCE_EVERY;
      sim.lookAt(game, lin, 'clock_view', 1.1);
      sim.speak(game, lin, [{ say: ['🕞'], kind: 'thought', ttl: 1.1 }]);
    }
  }

  // Kev at the socket: Lin's loose plug in his way gets jammed back in, with a spark; his mobile charges there
  // while he stands by it. He takes it with him when he goes (or is called away).
  const kev = byId('kev');
  const kevThere = kev && !kev.override && nearSpot(game, kev, 'socket_lin', 0.5);
  if (w.kevJamAt && m >= w.kevJamAt) {
    w.kevJamAt = 0;
    if (kevThere && w.cord === 'out') {
      w.cord = 'in';
      w.sparkAt = m;
      game.events.emit('cord:in', { by: 'kev' });
    }
  }
  if (w.kevCharge && !kevThere) w.kevCharge = 0;

  // The boss at his desk hears Lin's phone ring and someone else go for it: he half-rises (LURES), once a ring.
  const boss = byId('boss');
  if (boss && w.ring_lin === 'you' && w.call_lin && w.call_lin !== 'boss' && !w.line_lin && w.roseFor !== w.ringAt_lin
    && m < day.gatherAt && !boss.override && !boss.moving && dist(boss, PHONES.lin.bell) <= RING_RADIUS) {
    w.roseFor = w.ringAt_lin;
    w.bossRise = true;
  }
  if (boss && (boss.override === 'to_rise' || boss.override === 'on_rise')) w.bossRise = false;

  // From 3:30 the boss keeps an eye on your chair (the call is about your job): away from your desk, @you❓.
  const player = game.player;
  if (boss && player && m >= day.gatherAt && m >= w.chairAt && (!boss.override || boss.override === game.level.meeting.override)
    && !boss.moving && nearSpot(game, boss, 'boss_desk', 0.5)) {
    w.chairAt = m + 1.3;
    sim.lookAt(game, boss, 'player_desk', 1.2);
    if (!inZone(game, 'my_desk', player.x, player.y)) {
      sim.speak(game, boss, [{ say: ['@player', '❓'], kind: 'thought', ttl: 1.2, after: 0.3 }]);
    }
  }
}

// --- The switchboard and the cord ------------------------------------------------------------------
const WHOSE = { lin: "Lin's phone", boss: "the boss's phone", kev: "Kev's phone", kitchen: 'the kitchen phone' };
export const ringable = (w, p) => !w[`ring_${p}`] && !w[`call_${p}`] && !w[`line_${p}`]
  && (p !== 'lin' || (w.cord === 'in' && !w.linCheck));
const ring = (p) => ({
  on: `ring_${p}`, text: `ring ${WHOSE[p]}`, duration: 0.6, sneaky: true, saw: '☎️',
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
    on: 'lin_socket', text: "pull Lin's phone cord out of the wall", duration: 2.5, sneaky: true, saw: '🔌',
    can: (pl, w) => w.cord === 'in' && !w.ring_lin && !w.call_lin && !w.line_lin && !w.linCheck,
    done(game) {
      game.world.cord = 'out';
      game.events.emit('cord:out', {});
    },
  },
};

// Every ring is a noise at its phone: heads in earshot turn, and the bell. (Its rings are drawn on the phone
// itself: painters.js.)
export const NOISES = {
  ...Object.fromEntries(PHONE_IDS.map((p) => [`ring:${p}`, {
    at: PHONES[p].at, radius: RING_RADIUS, every: RING_EVERY, turn: 1.1, while: (w) => w[`ring_${p}`] === 'you',
    sfx: 'phoneRing',
  }])),
  'ring:job': {
    at: 'lin_side', radius: RING_RADIUS, every: JOB_EVERY, turn: 1.1, while: (w) => w.ring_lin === 'job',
    sfx: 'phoneRing',
  },
};

// --- Answering: one lure per (person, phone) --------------------------------------------------------
//   HOLD[npc][phone]: game minutes on the line. The boss loves the hold music: one tune, wherever he picks up. Kev
//   gives it a while. Lin holds on the outside line (the kitchen), hoping; an internal line is not her call: on her
//   own phone she hears the tune and slams it down (SLAM), on another she hangs up at once.
const BOSS_HOLD = 9;
const HOLD = {
  boss: { boss: BOSS_HOLD, lin: BOSS_HOLD, kev: BOSS_HOLD, kitchen: BOSS_HOLD },
  lin: { lin: 1.3, boss: 0.55, kev: 0.55, kitchen: 10 },
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
// His first words on picking up, and on hanging up. Lin on the outside line hopes it is her interviewer (💼❓)
// before the tune starts; on her own phone she slams it down (presentation.js POSES), on another internal one
// she shrugs.
const SUMMONED = [{ say: ['❗'], ttl: 1.4 }];
const PICK_UP = (npc, p) => {
  if (npc === 'boss') return [{ say: ['❓'], ttl: 0.9 }, { say: ['😌'], after: 1.1, ttl: 1.4 }];
  if (npc === 'kev') return [{ say: ['❓'], ttl: 0.9 }, { say: ['😑'], after: 1.1, ttl: 1.2 }];
  if (p === 'kitchen') return [{ say: ['💼', '❓'], ttl: 1.2 }];
  if (p === 'lin') return [{ say: ['❓'], ttl: 0.8 }, { say: ['😠'], after: 1.25, ttl: 1.3 }];
  return [{ say: ['❓'], ttl: 0.8 }];
};
const HUNG_UP = (npc, p) => {
  if (npc === 'boss') return [{ say: ['😊'], ttl: 1.2 }];
  if (npc === 'kev') return [{ say: ['🤷'] }];
  if (p === 'kitchen') return [{ say: ['😠'] }];
  if (p === 'lin') return [];
  return [{ say: ['🤷'] }];
};

const CAST_IDS = ['boss', 'lin', 'kev'];
export const LURES = [
  // Lin finds her line dead on a check: she pushes the plug back into the wall.
  {
    npc: 'lin',
    when: (w) => w.linFix && w.cord === 'out',
    override: 'to_socket',
    plan: 'replug',
    label: 'push her phone plug back in',
    spot: 'socket_lin',
    react: { wait: 0.6 },
    work: {
      override: 'at_socket',
      minutes: 0.6,
      progress: 'fix_lin',
      start: { set: { cord: 'in', linFix: false }, event: 'cord:in' },
      done: {},
    },
  },
  // The boss at Lin's phone ringing while someone else answers it: he half-rises, ❗, and sits back down.
  {
    npc: 'boss',
    when: (w) => w.bossRise,
    override: 'to_rise',
    plan: 'rise',
    label: "half-rise at Lin's ringing phone",
    spot: 'boss_rise',
    react: { wait: 0.3, says: [{ say: ['❗'], ttl: 1.2 }] },
    work: { override: 'on_rise', minutes: 0.2, progress: 'rise_boss', start: {}, done: {} },
  },
];
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
    react: { wait: mine ? 0.2 : 0.5, says: SUMMONED },
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
    LURES.push({
      npc,
      when: (w) => w[`call_${p}`] === npc,
      override: `to_${p}_phone`,
      plan: `phone_${p}`,
      label: `answer ${WHOSE[p]}`,
      spot: STAND[npc][p],
      react: { wait: 0.4, says: SUMMONED, event: `${npc}:answering` },
      work: {
        override: `on_${p}_phone`,
        minutes: HOLD[npc][p],
        progress: `hold_${npc}`,
        start: {
          set: { [`line_${p}`]: npc, [`ring_${p}`]: null },
          event: `${npc}:onHold`,
          says: PICK_UP(npc, p),
        },
        done: { set: { [`line_${p}`]: null, [`call_${p}`]: null }, event: `${npc}:hungUp`, says: HUNG_UP(npc, p) },
      },
    });
  }
}
