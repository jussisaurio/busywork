// How Weekend Shift looks and sounds: title card, set dressing, poses, the end card, voices and sounds (level 1's
// decor.js, looks.js, end-scenes.js, voices.js and sounds.js document the fields). The people look as they do in
// level 1: same office, an hour later.
import { C } from '../../render/palette.js';
import { GAME_MIN_PER_SEC } from '../../config.js';
import { LOOKS as LEVEL1_LOOKS } from '../meeting/looks.js';
import { READ_S, POINT_S } from './cast.js';
import { paintRoster, paintCopier, paintMicrowave, paintPhones } from './props.js'; // decor.props' painters
export { END_SCENES } from './end-scenes.js';

export const TITLE = {
  mission: ['5:00 PM. Someone works this Saturday.', "Make sure it isn't you."],
  badge: ['🗓️', '✏️'], // the roster's week, and writing on it
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

const look = (game, id) => game?.level?.looks?.[id] ?? null;
// s to the DING while the noodles cook, else null
const dingIn = (w, game) => (w.noodles === 'cooking' && w.dingAt !== null ? (w.dingAt - (game?.clock?.minute ?? 0)) / GAME_MIN_PER_SEC : null);

// Lin stands at the microwave with her fish in it (4:30-4:37): the window lights up with a fish going round
const linHeatsFish = (game) => !!(game?.npcs || []).find((n) => n.id === 'lin' && n.anim === 'fishIn' && !n.moving && !n.override);

// The reading (cast.js readRoster): READ_S s before 5:00 the boss turns to the board and points at it; at POINT_S
// he turns to whoever's face is on it. readS: s into it, else null.
const boss = (game) => (game?.npcs || []).find((n) => n.id === 'boss');
function readS(game) {
  const b = boss(game);
  if (!b || !b._read || b.moving || !game.clock) return null;
  const s = (game.clock.minute - (game.level.day.meetingAt - READ_S * GAME_MIN_PER_SEC)) / GAME_MIN_PER_SEC;
  return s >= 0 ? s : null;
}
const WROTE_FRESH_MIN = 3; // game minutes the ink glints after you write

export const DECOR = {
  chairs: [
    { spot: 'boss_desk', face: 'S', color: OXBLOOD },
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    // round the roster: everyone pulls up a chair at 5:00; yours is the mustard one
    { spot: 'board_boss', face: 'E', color: OXBLOOD },
    { spot: 'meeting_kev', face: 'W', color: OLIVE },
    { spot: 'meeting_lin', face: 'W', color: TEAL },
    { spot: 'meeting_player', face: 'W', color: MUSTARD },
    // break room table
    { x: 23, y: 4, face: 'N', color: MUSTARD },
    { x: 24, y: 4, face: 'N', color: MUSTARD },
    { x: 26, y: 4, face: 'N', color: MUSTARD },
    { x: 25, y: 2, face: 'S', color: MUSTARD },
  ],
  windows: [
    { x0: 2, x1: 4, y: 0 }, // supply room
    { x0: 15, x1: 19, y: 0 }, // the boss's office: where he takes his calls
    { x0: 24, x1: 27, y: 0 }, // break room
  ],
  paintings: [
    { x: 9, y: 0, variant: 0 },
    { x: 27, y: 6, variant: 1 },
  ],
  clock: { x: 22, y: 6 },
  // drawn by props.js: who works Saturday is a face on the board
  props: [
    {
      tile: 'R',
      draw: paintRoster,
      state: (w, game) => {
        const s = readS(game);
        return {
          look: look(game, w.roster),
          fresh: w.wroteAt !== null && (game?.clock?.minute ?? 0) - w.wroteAt < WROTE_FRESH_MIN,
          pulse: s !== null && s < POINT_S, // the boss is reading it out
        };
      },
    },
    { tile: 'X', draw: paintCopier, state: (w) => ({ copier: w.copier }) },
    {
      tile: 'M',
      draw: paintMicrowave,
      state: (w, game) => ({ noodles: w.noodles, left: dingIn(w, game), fish: linHeatsFish(game) }),
    },
    {
      tile: 'P',
      draw: paintPhones,
      state: (w, game) => {
        const b = game?.level?.spots?.boss_desk;
        return { phone: w.phone, boss: { x: b?.x ?? 0, y: (b?.y ?? 0) + 1 } }; // his desk, south of his chair
      },
    },
  ],
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: null },
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: 'plant' },
  },
  zoneSeeds: [
    { zone: 'office', x: 10, y: 2 }, // the boss's office (his desk draws as an exec desk)
    { zone: 'kitchen', x: 22, y: 2 }, // the break room
  ],
  legendAt: { x: 15, y: 16.5 },
};

export const LOOKS = LEVEL1_LOOKS;

// level.poses (level 1's looks.js documents the fields). Things in hand are drawn by the renderer from emoji, so
// nobody holds anything here: Kev reaches into the copier (props.js draws his spanner in it), the boss holds the
// phone to his ear (the renderer draws a handset), and pointing is the arm.
export const POSES = {
  arms: [
    // the reading: he points at the board, then at whoever's face is on it; at his own, he spreads his hands
    { when: (n, w, game) => n.id === 'boss' && readS(game) !== null && (w.roster !== 'boss' || readS(game) < POINT_S), arms: 'point' },
    { when: (n, w, game) => n.id === 'boss' && readS(game) !== null, arms: 'shrug' },
    { when: (n) => n.override === 'fixing', arms: 'reach' },
    { when: (n) => n.override === 'onPhone', arms: 'phone' },
  ],
  marks: [
    { when: (n, w, game) => n.id === 'boss' && w.roster === 'boss' && readS(game) >= POINT_S, angry: true }, // red to the ears
  ],
};

// level.voices: as in level 1 (src/levels/meeting/voices.js, copied: the same three people).
export const VOICES = {
  boss: {
    wave: 'sawtooth', f0: 92, spread: 0.06, decl: 0.24, syl: [0.15, 0.21], gap: [0.04, 0.07], atk: 0.02,
    fmt: 0.82, q: [7, 9], mk: 3.2, f2amp: 0.6, body: 0.22, bodyF: 520,
    vowels: ['a', 'o', 'u', 'uh', 'ae'], cons: 0.3, consF: 1700, consAmp: 0.18,
    growl: 31, post: [['lowpass', 2600, 0.7]], gain: 1.15,
    pitch: { notice: 300, tattle: 1, grumble: 220 },
  },
  lin: {
    wave: 'sawtooth', f0: 245, spread: 0.13, decl: 0.08, syl: [0.075, 0.105], gap: [0.02, 0.04], atk: 0.006,
    fmt: 1.15, q: [5, 7], mk: 2.4, f2amp: 0.75, body: 0.05, bodyF: 600,
    vowels: ['i', 'e', 'a', 'ae', 'o'], cons: 0.6, consF: 5200, consAmp: 0.22,
    gain: 0.8,
    pitch: { notice: 620, tattle: 1.12, grumble: 260 },
  },
  kev: {
    wave: 'square', f0: 148, spread: 0.04, decl: 0.06, syl: [0.12, 0.16], gap: [0.008, 0.02], atk: 0.025,
    fmt: 0.95, q: [5, 6], mk: 2.0, f2amp: 0.5, body: 0.06, bodyF: 450,
    vowels: ['uh', 'u', 'o', 'oe', 'e'], cons: 0.15, consF: 2600, consAmp: 0.12,
    post: [['peaking', 1150, 3, 9], ['lowpass', 1700, 0.8]], gain: 0.55,
    pitch: { notice: 440, tattle: 0.84, grumble: 190 },
  },
};

// level.sounds (level 1's sounds.js documents the fields). The ding, the beeping and the ringing are the noises'
// own sfx (index.js); these are the rest.
export const SOUNDS = {
  actions: {
    start: {
      start_microwave: { sfx: 'machineBeep', spot: 'microwave', opts: { gain: 0.5 } },
      jam_copier: { sfx: 'scratch', spot: 'copier' },
      call_boss: { sfx: 'clockTick', who: 'player', opts: { gain: 0.6 } },
      write_boss: { sfx: 'scratch', spot: 'meeting_presenter', opts: { gain: 0.5 } },
      write_kev: { sfx: 'scratch', spot: 'meeting_presenter', opts: { gain: 0.5 } },
    },
  },
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'copier:jammed': { sfx: 'clank', spot: 'copier' },
    'kev:alerted': { sfx: 'grumble', who: 'kev' },
    'copier:fixing': { sfx: 'clank', spot: 'copier', opts: { soft: true }, rearm: { repair: 0.9 } },
    'copier:fixed': { sfx: 'fixed', spot: 'copier' },
    'phone:answered': { sfx: 'pickup', who: 'boss' },
    'phone:hungUp': { sfx: 'drop', who: 'boss', opts: { gain: 0.5 } },
  },
  repeats: {
    repair: { while: (w) => w.copier === 'fixing', every: [1.1, 2.0], sfx: 'clank', spot: 'copier', opts: { soft: true, gain: 0.7 } },
  },
  murmur: { spot: 'meeting_presenter' },
};
