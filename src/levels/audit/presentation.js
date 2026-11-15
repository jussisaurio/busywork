// How the audit looks and sounds: title card, set dressing, people, voices, sounds and the end card (level 1's
// decor.js, looks.js, voices.js and sounds.js document the fields). Level 1's people are imported
// read-only; the auditor is new.
import { C } from '../../render/palette.js';
import { LOOKS as OFFICE_LOOKS } from '../meeting/looks.js';
import { DESK_MARKS, penShake, penScribble } from './things.js';

// The card names the trouble, the time first, and never the way out.
export const TITLE = {
  mission: ['3:00 PM. Laptop audit at 3:30.', 'You sold yours.'],
  badge: ['📋', '💻'], // his clipboard, a laptop
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

export const DECOR = {
  chairs: [
    { spot: 'boss_desk', face: 'N', color: OXBLOOD }, // his back to the glass
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { x: 13, y: 12, face: 'N', color: MUSTARD },
    { x: 22, y: 12, face: 'N', color: TEAL },
    { x: 4, y: 12, face: 'N', color: TEAL },
    { x: 12, y: 5, face: 'N', color: TEAL },
    { x: 14, y: 5, face: 'N', color: TEAL },
    { x: 12, y: 2, face: 'S', color: TEAL },
    { x: 14, y: 2, face: 'S', color: TEAL },
  ],
  windows: [{ x0: 2, x1: 6, y: 0 }, { x0: 10, x1: 12, y: 0 }, { x0: 25, x1: 27, y: 0 }],
  paintings: [{ x: 10, y: 6, variant: 0 }, { x: 25, y: 6, variant: 1 }, { x: 2, y: 0, variant: 1 }],
  cabinets: { x0: 21, x1: 23, y: 0 },
  clock: { x: 17, y: 6 },
  props: [
    // Both pots full all afternoon, and both pour (index.js LEGEND, meeting/coffee.js).
    { tile: 'C', draw: 'carafe', state: () => ({ full: true }) },
    { tile: 'M', draw: 'carafe', state: () => ({ full: true }) },
    { tile: 'K', draw: 'coatRack', state: () => ({ coat: false, tag: false }) },
    DESK_MARKS, // the cable on an empty desk, his sticker on a counted one, Lin's paper pile (things.js)
  ],
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#2a2a2a', screenArt: 'blankSlide', mug: C.tomato, prop: null }, // no laptop, just a dock
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: 'earbuds' },
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: 'plant' },
  },
  ashtray: { spot: 'smoke' },
  elevator: { spot: 'elevator' },
  zoneSeeds: [
    { zone: 'office', x: 4, y: 2 },
    { zone: 'meeting', x: 13, y: 2 },
    { zone: 'kitchen', x: 20, y: 2 },
    { zone: 'lobby', x: 4, y: 14 },
  ],
  legendAt: { x: 20, y: 15.5 },
  things: { penShake, penScribble }, // his dry pen at your desk (POSES)
};

export const LOOKS = {
  ...OFFICE_LOOKS,
  // A man from outside: short salt-and-pepper hair, a mustache, glasses, a blue tie, the badge on a lanyard (POSES
  // marks), clipboard and coffee cup in hand (POSES arms). Built square, taller than the rest.
  auditor: {
    body: '#6b6f78', bodyDark: '#4d5058', torso: 'suit', shirt: '#f1f1ee', shirtDark: '#c9c9c4', tie: '#2f4f8f',
    skin: '#e3b48f', skinDark: '#c4926c', hair: '#4a4641', hairStyle: 'cap', glasses: true, mustache: true,
    legs: '#33353b', wide: 1.05, tall: 1.12, head: 6.6, bubbleDy: 34, eyeDy: 13,
  },
};

// At Lin's desk he goes through her paper pile (things.js) before he writes: why her desk takes him longer.
const atLinsPile = (n) => n.override === 'audit' && n._insp?.i === 2 && !n.moving && n._wait > 1.25;

// At your desk his pen runs dry, every loop: why he stands there so long (index.js INSPECTIONS, look PEN_LOOK s).
// Seconds into the stay: he writes and nothing comes, shakes the pen, scribbles on the clipboard's corner, shakes it
// again, and writes. Head down over the clipboard, facing your desk: Kev slips home behind his back (cast.js).
export const PEN_LOOK = 4.2;
const PEN_BEATS = [[0.5, null], [1.4, 'shake'], [2.6, 'scribble'], [3.4, 'shake']];
export function penBeat(n) {
  if (n.override !== 'audit' || n._insp?.i !== 3 || n.moving || !(n._wait > 0)) return null;
  const into = PEN_LOOK - n._wait;
  return PEN_BEATS.find(([until]) => into < until)?.[1] ?? null;
}

export const POSES = {
  arms: [
    // A coffee, standing: the auditor before 3:30, Kev and Lin in the kitchen.
    { when: (n) => !n.override && n.anim === 'coffee' && !n.moving, arms: 'carry', item: '#cup' },
    { when: (n) => n.id === 'auditor' && atLinsPile(n), arms: 'reach' },
    { when: (n) => n.id === 'auditor' && penBeat(n) === 'shake', arms: 'type', item: '#penShake' },
    { when: (n) => n.id === 'auditor' && penBeat(n) === 'scribble', arms: 'type', item: '#penScribble' },
    // The auditor's clipboard: at his side while he walks, written on while he stands at a desk.
    { when: (n) => n.id === 'auditor', arms: (n) => (n.moving ? 'mug' : 'type'), item: '#clipboard' },
    { when: (n) => !n.override && n.anim === 'smoking', arms: (n) => (n.moving ? 'walk' : 'puff'), item: '#cigarette' },
  ],
  marks: [
    { when: (n) => n.id === 'auditor', badge: true },
  ],
};

// level.voices (fields: src/audio/babble.js VOICES). Level 1's three, copied from meeting/voices.js, and the auditor.
export const VOICES = {
  // The auditor: flat, nasal, precise, no rise or fall.
  auditor: {
    wave: 'square', f0: 165, spread: 0.02, decl: 0.02, syl: [0.06, 0.08], gap: [0.05, 0.07], atk: 0.004,
    fmt: 1.05, q: [7, 9], mk: 2.2, f2amp: 0.6, body: 0.05, bodyF: 700,
    vowels: ['i', 'e', 'i', 'a'], cons: 0.7, consF: 4200, consAmp: 0.22,
    post: [['peaking', 1400, 3, 7], ['lowpass', 3200, 0.7]], gain: 0.6,
    pitch: { notice: 400, tattle: 1, grumble: 200 },
  },
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

export const SOUNDS = {
  actions: {
    start: { pick_up: { sfx: 'rustle', who: 'player', opts: { gain: 0.6 } }, pour_coffee: { sfx: 'pour', who: 'player' } },
    done: {},
  },
  events: {
    'auditor:suspicious': { sfx: 'tension', who: 'auditor' },
    'auditor:workAssigned': { sfx: 'workAssigned' },
    'inspect:pass': { sfx: 'scratch', who: 'auditor' }, // a tick on the clipboard
    'inspect:fail': { sfx: 'doom', who: 'auditor' },
    'audit:passed': { sfx: 'relief' },
    'laptop:reclaimed': { sfx: 'swish' },
    'kev:fetched': { sfx: 'swish' },
    'kev:forgot': { sfx: 'rustle', who: 'kev', opts: { gain: 0.5 } }, // his laptop down on your desk
  },
  signs: {},
  contraband: {},
  drops: { laptop_boss: 'soft', laptop_lin: 'soft', laptop_kev: 'soft' },
  repeats: {},
  elevator: { spot: 'elevator', radius: 2.5 },
};

// The end card: a drawn scene per outcome (end-scenes.js).
export { END_SCENES } from './end-scenes.js';
