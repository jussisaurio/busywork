// How The Last Bus looks and sounds: title card, set dressing, poses, the end card, sounds and voices (level 1's
// decor.js, looks.js, end-scenes.js, sounds.js and voices.js document the fields). The people are level 1's.
import { C, OXBLOOD, MUSTARD, TEAL, OLIVE } from '../../render/palette.js';
import { LOOKS as OFFICE_LOOKS } from '../meeting/looks.js';
import { OFFICE_VOICES } from '../office/voices.js';
import { CLOCKS } from './clocks.js';
import { officeTimeClock, officeTimeStreet } from './painters.js';
import { END_SCENES } from './end-scenes.js';

export const TITLE = {
  mission: ['3:00 PM. Your last bus home is at 4:30. The boss never leaves before ten to five.', 'Nobody goes home before him. Catch the bus.'],
  badge: ['🚌'],
};


// A wall clock shows the true minute plus however fast it is, red over the minutes it gained, and each push hangs it
// more crooked (one push is plain to see). The stepladder under it is part of the same drawing (painters.js).
const wallClock = (clock, lean) => ({
  tile: clock === 'boss' ? 'Q' : 'O',
  draw: officeTimeClock,
  state: (w, game) => {
    const fast = w[CLOCKS[clock].field] || 0;
    return {
      minute: (game.clock ? game.clock.minute : 0) + fast,
      start: game.level.day.start,
      tilt: fast ? lean * Math.min(0.6, 0.25 + fast * 0.006) : 0,
      ahead: fast,
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
    { x: 19, y: 6, variant: 0 },
    { x: 25, y: 6, variant: 1 },
    { x: 15, y: 0, variant: 1 },
  ],
  cabinets: { x0: 21, x1: 23, y: 0 },
  props: [
    wallClock('boss', 1),
    wallClock('open', -1),
    { tile: 'C', draw: 'carafe', state: () => ({ full: true }) }, // refilled all day: it pours (index.js)
    { tile: 'K', draw: 'coatRack', state: (w) => ({ coat: w.coat === 'hook', tag: false }) }, // his coat: he is in
    // the pavement, the road and the bus stop sign; the bus pulls in at 4:26
    { tile: 'B', draw: officeTimeStreet, state: (w, game) => ({ minute: game.clock ? game.clock.minute : 0, start: game.level.day.start, rows: game.level.map.rows }) },
  ],
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: 'earbuds' },
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: 'plant' },
  },
  zoneSeeds: [
    { zone: 'office', x: 4, y: 2 },
    { zone: 'meeting', x: 13, y: 2 },
    { zone: 'kitchen', x: 21, y: 2 },
    { zone: 'lobby', x: 4, y: 14 },
  ],
  legendAt: { x: 21.45, y: 14.55 }, // on the blank wall strip right of the lobby, above the pavement
};

// Level 1's people, and the caretaker: a cap and a blue work jacket, not office clothes.
export const LOOKS = {
  ...OFFICE_LOOKS,
  caretaker: {
    body: '#3f6f8f', bodyDark: '#2c5068', skin: '#e0b08a', skinDark: '#c08e68', hair: '#5a4a3a',
    hairStyle: 'cap', mustache: true, legs: '#4a4038', wide: 1.1, tall: 1.05, head: 6.8, bubbleDy: 32, eyeDy: 13,
  },
};

export const POSES = {
  arms: [
    { when: (n, w, game) => n._reachUntil > game.loopTime, arms: 'reach' }, // setting a clock right (a battery)
    { when: (n, w, game) => n._shrugUntil > game.loopTime, arms: 'shrug' }, // not home time yet
    { when: (n, w, game) => n._laptopUntil > game.loopTime, arms: 'carry', item: '#laptop' }, // Kev, about to go
  ],
  marks: [
    { when: (n) => n.override === 'hunting', angry: true },
    { when: (n, w) => n.id === 'boss' && w.coat === 'hook', jacket: false }, // in shirt sleeves: his coat is on the rack
  ],
};

export const CONES = { alert: ['hunting'] };

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
    'boss:hunt': { sfx: 'tension', who: 'boss' },
    'boss:coat': { sfx: 'shuffle', who: 'boss' },
    'clock:reset': { sfx: 'clockTick', who: 'boss' },
    'boss:left': { sfx: 'door', who: 'boss' },
    'lin:left': { sfx: 'door', who: 'lin' },
    'kev:left': { sfx: 'door', who: 'kev' },
  },
};

// The office voices, and the caretaker's: Kev's, lower and slower.
export const VOICES = {
  ...OFFICE_VOICES,
  caretaker: {
    wave: 'square', f0: 112, spread: 0.05, decl: 0.1, syl: [0.15, 0.2], gap: [0.02, 0.04], atk: 0.03,
    fmt: 0.88, q: [5, 6], mk: 2.0, f2amp: 0.5, body: 0.1, bodyF: 420,
    vowels: ['o', 'u', 'uh', 'a'], cons: 0.2, consF: 2200, consAmp: 0.12,
    post: [['lowpass', 1500, 0.8]], gain: 0.55,
    pitch: { notice: 380, tattle: 0.8, grumble: 170 },
  },
};
