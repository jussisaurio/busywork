// Tunables. Units: distances in tiles, speeds in tiles per REAL second,
// game time in minutes since DAY_START, angles in radians.

export const TILE = 32; // pixels per tile at 1x zoom
export const FIXED_DT = 1 / 60; // simulation step (real seconds)
export const SEED = 20261114; // same seed every loop -> deterministic days

// --- Clock -----------------------------------------------------------------
export const DAY_START = 14 * 60 + 30; // 2:30 PM as minute-of-day
export const DAY_END = 16 * 60; // 4:00 PM, meeting starts
export const GAME_MIN_PER_SEC = 0.6; // 90 game minutes ~= 150 real seconds
export const FF_MULT = 6; // look busy while seated at own desk = fast-forward
export const FORCED_MULT = 8; // speed while serving a "work assigned" penalty
export const WORK_PENALTY_MIN = 20; // game minutes lost to assigned work

// "3:10" -> minutes since DAY_START. Hours 1..11 are PM.
export function at(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const hh = h < 12 ? h + 12 : h;
  return hh * 60 + m - DAY_START;
}
export const MEETING_AT = at('4:00');

// minutes since DAY_START -> "3:12 PM"
export function formatClock(minute) {
  const total = Math.floor(DAY_START + minute);
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`;
}

// --- Movement / interaction -----------------------------------------------
export const PLAYER_SPEED = 4.2;
export const PLAYER_BUSY_SPEED = 2.4; // striding with a folder
export const PLAYER_RADIUS = 0.3; // collision circle
export const NPC_SPEED = 2.6;
export const INTERACT_RADIUS = 1.5; // from player centre to interactable tile centre

// Timed actions (real seconds). sneaky: witnesses matter while in progress.
// owner: only that NPC knows it's wrong (a sandwich is just a sandwich to everyone but Lin).
// idle: the boss reads it as slacking (his ❓ meter fills while he watches).
export const ACTIONS = {
  brew_coffee: { duration: 1.0, sneaky: false }, // pours the day's only cup (Kev's, at 2:38)
  spill_coffee: { duration: 1.2, sneaky: true },
  take_keycard: { duration: 1.0, sneaky: true },
  take_sandwich: { duration: 0.8, sneaky: true, owner: 'lin' },
  eat_sandwich: { duration: 2.0, sneaky: true, owner: 'lin', idle: true },
  pick_up: { duration: 0.3, sneaky: false },
};

// --- Perception --------------------------------------------------------------
const deg = (d) => (d * Math.PI) / 180;
export const VISION = {
  boss: { fov: deg(100), radius: 8 },
  lin: { fov: deg(100), radius: 8.5 },
  kev: { fov: deg(90), radius: 7 },
  default: { fov: deg(90), radius: 7 },
};
// Seated NPCs glance around: every GLANCE_EVERY (real s, random range) they turn
// their head by GLANCE_ANGLE (random range, random side) for GLANCE_HOLD seconds.
export const GLANCE_EVERY = [5, 9];
// Per-NPC override of GLANCE_EVERY. The boss is twitchy, so the 'Lin is away' windows still carry risk.
export const GLANCE_EVERY_BY = { boss: [3, 5.5] };
export const GLANCE_ANGLE = [deg(60), deg(125)];
export const GLANCE_HOLD = 1.3;
export const GLANCE_TURN_TIME = 0.25; // head turn tween, gives a tiny telegraph

// --- Rules -----------------------------------------------------------------
export const SUSPICION_FILL_SEC = 1.6; // boss sees you idle this long -> work assigned
export const SUSPICION_DECAY_SEC = 3.0;
export const CAUGHT_DELAY = 1.6; // seconds of "busted" beat before the end screen
export const KEV_FIX_MIN = 5; // game minutes to repair the projector
