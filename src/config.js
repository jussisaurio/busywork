// Tunables. Units: distances in tiles, speeds in tiles per REAL second,
// game time in minutes since the day's start (level.day.start, a minute-of-day), angles in radians.

export const TILE = 32; // pixels per tile at 1x zoom
export const FIXED_DT = 1 / 60; // simulation step (real seconds)
export const SEED = 20261114; // same seed every loop -> deterministic days

// --- Clock -----------------------------------------------------------------
export const DAY_START = 14 * 60 + 30; // 2:30 PM as minute-of-day: the default `start` of at() and formatClock()
export const GAME_MIN_PER_SEC = 0.6; // 90 game minutes ~= 150 real seconds
export const FF_MULT = 6; // look busy while seated at own desk = fast-forward
export const FORCED_MULT = 8; // speed while serving a "work assigned" penalty
export const WORK_PENALTY_MIN = 20; // game minutes lost to assigned work

// "3:10" -> game minutes since the day's start (`start`: the level's day.start, a minute-of-day). Hours 1..11 are
// in the start's half of the day: PM in an afternoon day (2:30 PM: '3:10' is 3:10 PM), AM in a morning one
// (9:00 AM: '9:30' is 9:30 AM). 12 is noon, 13..23 are 24-hour ('13:15' is 1:15 PM in a morning day).
// A level whose day doesn't start at 2:30 PM passes its start: at('9:30', START).
export function at(hhmm, start = DAY_START) {
  const [h, m] = hhmm.split(':').map(Number);
  const hh = h < 12 && start >= 12 * 60 ? h + 12 : h;
  return hh * 60 + m - start;
}

// game minutes since the day's start (`start`, as at()) -> "3:12 PM"
export function formatClock(minute, start = DAY_START) {
  const total = Math.floor(start + minute);
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`;
}

// game minutes since the day's start -> "3:12", the short form at(_, start) reads back: 12-hour in an afternoon
// day, 24-hour from noon on in a morning one ('9:30', '13:15').
export function clockArg(minute, start = DAY_START) {
  const total = Math.floor(start + minute);
  const h24 = Math.floor(total / 60) % 24;
  const h = start >= 12 * 60 ? ((h24 + 11) % 12) + 1 : h24;
  return `${h}:${String(total % 60).padStart(2, '0')}`;
}

// --- Movement / interaction -----------------------------------------------
// Cosmetic cue times, game minutes like day.meetingAt. A level may set any of them in its day; the rest default to
// day.meetingAt or a few minutes before it (dayCue reads one). They are not rules: nothing in the sim reads them.
const CUE_DEFAULTS = {
  clockRedAt: (d) => d.meetingAt - 5, // the HUD clock turns red
  clockTickAt: (d) => dayCue(d, 'clockRedAt'), // audio: the wall clock starts ticking (with the red clock)
  tockAt: (d) => d.meetingAt - 2, // audio: tick-tock
  halfMinuteAt: (d) => d.meetingAt - 1, // audio: a tick every half minute
  beamAt: (d) => d.meetingAt - 5, // the meeting projector's beam lights the screen
  deadlineAt: (d) => d.meetingAt, // the deadline clock face (mission panel, title screen): earlier if the moment
  //                                 that counts comes before the verdict (a call at 3:30, judged at 3:34)
};
export const DAY_CUES = Object.keys(CUE_DEFAULTS);
export function dayCue(day, name) {
  const d = day ?? {};
  return d[name] ?? CUE_DEFAULTS[name](d);
}

export const PLAYER_SPEED = 4.2;
export const PLAYER_BUSY_SPEED = 2.4; // striding with a folder
export const PLAYER_RADIUS = 0.3; // collision circle
export const NPC_SPEED = 2.6;
export const INTERACT_RADIUS = 1.5; // from player centre to interactable tile centre

// Generic action timings (real seconds). The level's own actions carry theirs (level.interactions).
export const PICK_UP_TIME = 0.3; // a floor item
export const EAT_TIME = 2.0; // an edible item in hand
// One E key, two verbs on what you hold: a tap drops it, holding E this long (standing still) eats it
// (play/interactions.js: a 'self' row with `hold`). A tap is the drop, so eating never takes the drop key.
export const HOLD_TIME = 0.35;
// What eating leaves on you (an edible item's `edible: { leaves }`, null for nothing; player.smeared holds the
// name). The renderer paints the mark in these colours and the agent harness names it with these words, so a
// level can't describe it differently from what the screen shows.
export const MARKS = {
  splat: { color: '#f2c230', dark: '#c99512', words: 'a yellow splat down your front' },
};

// --- Perception --------------------------------------------------------------
export const deg = (d) => (d * Math.PI) / 180;
// Vision for a cast member without its own `vision` (the level's cast sets each NPC's).
export const VISION_DEFAULT = { fov: deg(90), radius: 7 };
// Seated NPCs glance around: every GLANCE_EVERY (real s, random range; a cast member's
// `glanceEvery` overrides it) they turn their head by GLANCE_ANGLE (random range, random side)
// for GLANCE_HOLD seconds.
export const GLANCE_EVERY = [5, 9];
export const GLANCE_ANGLE = [deg(60), deg(125)];
export const GLANCE_HOLD = 1.3;
export const GLANCE_TURN_TIME = 0.25; // head turn tween, gives a tiny telegraph

// --- Rules -----------------------------------------------------------------
export const SUSPICION_FILL_SEC = 1.6; // boss sees you idle this long -> work assigned
export const NOTICE = 0.3; // seconds of continuous sight before a witness reacts (play/rules.js; render: her eye)
export const DOUBLE_TAKE = 0.8; // seconds of sight before a knowing NPC objects to a disguise (play/disguise.js)
export const SUSPICION_DECAY_SEC = 3.0;
export const CAUGHT_DELAY = 1.6; // seconds of "busted" beat before the end screen
