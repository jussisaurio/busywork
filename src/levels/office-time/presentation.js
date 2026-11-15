// How Office Time looks and sounds: title card, set dressing, poses, the end card, sounds and voices (level 1's
// decor.js, looks.js, end-scenes.js, sounds.js and voices.js document the fields). The people are level 1's.
import { C } from '../../render/palette.js';
import { LOOKS as OFFICE_LOOKS } from '../meeting/looks.js';
import { CLOCKS } from './clocks.js';
import { officeTimeClock, officeTimeStreet } from './painters.js';
import { END_SCENES } from './end-scenes.js';

export const TITLE = {
  mission: ['3:00 PM. Your bus leaves at 4:30. The boss leaves at 4:50.', 'Nobody leaves before him. Catch the bus.'],
  badge: ['🚌'],
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

// A wall clock shows the true minute plus however fast it is, and each push hangs it a little more crooked. The
// stepladder under it is part of the same drawing (painters.js).
const wallClock = (clock, lean) => ({
  tile: clock === 'boss' ? 'Q' : 'O',
  draw: officeTimeClock,
  state: (w, game) => {
    const fast = w[CLOCKS[clock].field] || 0;
    return {
      minute: (game.clock ? game.clock.minute : 0) + fast,
      start: game.level.day.start,
      tilt: lean * Math.min(0.45, fast * 0.012),
    };
  },
});

export const DECOR = {
  chairs: [
    { spot: 'boss_desk', face: 'S', color: OXBLOOD },
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { x: 13, y: 12, face: 'N', color: MUSTARD },
    { x: 22, y: 12, face: 'N', color: TEAL },
    // meeting table
    { x: 12, y: 5, face: 'N', color: TEAL },
    { x: 14, y: 5, face: 'N', color: TEAL },
    { x: 12, y: 2, face: 'S', color: TEAL },
    { x: 15, y: 2, face: 'S', color: TEAL },
    // kitchen table
    { x: 24, y: 4, face: 'N', color: MUSTARD },
    { x: 26, y: 4, face: 'N', color: MUSTARD },
  ],
  windows: [
    { x0: 1, x1: 3, y: 0 }, // office (the clock hangs at x 4)
    { x0: 6, x1: 8, y: 0 },
    { x0: 10, x1: 12, y: 0 },
    { x0: 25, x1: 27, y: 0 },
  ],
  paintings: [
    { x: 10, y: 6, variant: 0 },
    { x: 25, y: 6, variant: 1 },
    { x: 15, y: 0, variant: 1 },
  ],
  cabinets: { x0: 21, x1: 23, y: 0 },
  props: [
    wallClock('boss', 1),
    wallClock('open', -1),
    { tile: 'C', draw: 'carafe', state: () => ({ full: true }) },
    // the pavement, the road and the bus stop sign; the bus pulls in at 4:26
    { tile: 'B', draw: officeTimeStreet, state: (w, game) => ({ minute: game.clock ? game.clock.minute : 0, start: game.level.day.start }) },
  ],
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: 'earbuds' },
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: 'plant' },
  },
  ashtray: { spot: 'smoke' },
  elevator: { spot: 'elevator' },
  zoneSeeds: [
    { zone: 'office', x: 4, y: 2 },
    { zone: 'meeting', x: 13, y: 2 },
    { zone: 'kitchen', x: 21, y: 2 },
    { zone: 'lobby', x: 4, y: 14 },
  ],
  legendAt: { x: 21.45, y: 15.5 }, // on the blank strip right of the bus stop, above the road
};

export const LOOKS = OFFICE_LOOKS;

// The boss smokes with his hand to his mouth and the smoke drawn (no glyph in his hand: nothing in a hand is an
// emoji). Going home is the wave and the walk to the elevator.
export const POSES = {
  arms: [
    { when: (n) => !n.override && n.anim === 'smoking', arms: (n) => (n.moving ? 'walk' : 'puff') },
  ],
  marks: [],
};

export const CONES = { alert: [] };

export { END_SCENES };

// What it sounds like (audio/audio.js; recipes in audio/sfx.js).
export const SOUNDS = {
  actions: {
    start: {
      push_boss_clock: { sfx: 'creak', spot: 'boss_clock_chair' }, // the stepladder, climbed
      push_open_clock: { sfx: 'creak', spot: 'open_clock_chair' },
    },
    done: {
      push_boss_clock: { sfx: 'clockTick', spot: 'boss_clock_chair' },
      push_open_clock: { sfx: 'clockTick', spot: 'open_clock_chair' },
    },
  },
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'boss:herd': { sfx: 'shuffle', who: 'boss' },
    'boss:left': { sfx: 'elevator' },
    'lin:left': { sfx: 'elevator' },
    'kev:left': { sfx: 'elevator' },
  },
  elevator: { spot: 'elevator', radius: 2.5 },
};

// Level 1's voices (src/levels/meeting/voices.js), copied.
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
