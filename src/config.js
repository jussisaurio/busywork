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
export const PLAYER_SPEED = 4.2;
export const PLAYER_BUSY_SPEED = 2.4; // striding with a folder
export const PLAYER_RADIUS = 0.3; // collision circle
export const NPC_SPEED = 2.6;
export const INTERACT_RADIUS = 1.5; // from player centre to interactable tile centre

// Generic action timings (real seconds). The level's own actions carry theirs (level.interactions).
export const PICK_UP_TIME = 0.3; // a floor item
export const EAT_TIME = 2.0; // an edible item in hand

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
export const SUSPICION_DECAY_SEC = 3.0;
export const CAUGHT_DELAY = 1.6; // seconds of "busted" beat before the end screen
