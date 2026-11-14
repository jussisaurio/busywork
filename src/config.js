// Tunables. Units: distances in tiles, speeds in tiles per REAL second,
// game time in minutes since DAY_START, angles in radians.

export const TILE = 32; // pixels per tile at 1x zoom
export const FIXED_DT = 1 / 60; // simulation step (real seconds)
export const SEED = 20261114; // same seed every loop -> deterministic days

// --- Clock -----------------------------------------------------------------
export const DAY_START = 14 * 60 + 30; // 2:30 PM as minute-of-day
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

// Picking a floor item up (real seconds). The level's own actions carry their timings (level.interactions).
export const PICK_UP_TIME = 0.3;

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
export const KEV_FIX_MIN = 5; // game minutes to repair the projector
