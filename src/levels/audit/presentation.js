// How the audit looks and sounds: title card, set dressing, people, voices, sounds and the end card (level 1's
// decor.js, looks.js, voices.js and sounds.js document the fields). Level 1's people are imported
// read-only; the auditor is new.
import { OXBLOOD, MUSTARD, TEAL, OLIVE } from '../../render/palette.js';
import { LOOKS as OFFICE_LOOKS } from '../office/looks.js';
import { OFFICE_VOICES } from '../office/voices.js';
import { GAME_MIN_PER_SEC } from '../../config.js';
import { DESK_MARKS, penShake, penScribble, wallet } from './things.js';
import { KEV_PAT, KEV_FOUND } from './cast.js';
import { OFFICE_WINDOWS, OFFICE_CABINETS, OFFICE_CLOCK, OFFICE_DESK_OWNERS, OFFICE_ELEVATOR, OFFICE_ZONE_SEEDS, officeDesk } from '../office/decor.js';

// The card names the trouble, the time first, and never the way out.
export const TITLE = {
  mission: ['3:00 PM. Laptop audit at 3:30. You sold yours.', 'Pass the audit.'],
  badge: ['📋', '💻'], // his clipboard, a laptop
};


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
  windows: OFFICE_WINDOWS,
  paintings: [{ x: 10, y: 6, variant: 0 }, { x: 25, y: 6, variant: 1 }, { x: 2, y: 0, variant: 1 }],
  cabinets: OFFICE_CABINETS,
  clock: OFFICE_CLOCK,
  props: [
    // Both pots full all afternoon, and both pour (index.js LEGEND, office/coffee.js).
    { tile: 'C', draw: 'carafe', state: () => ({ full: true }) },
    { tile: 'M', draw: 'carafe', state: () => ({ full: true }) },
    { tile: 'K', draw: 'coatRack', state: () => ({ coat: false, tag: false }) },
    DESK_MARKS, // the cable on an empty desk, his sticker on a counted one, Lin's paper pile (things.js)
  ],
  deskOwners: OFFICE_DESK_OWNERS,
  desks: {
    player: officeDesk('player', { screen: '#2a2a2a', screenArt: 'blankSlide' }), // no laptop, just a dock
    kev: officeDesk('kev'),
    lin: officeDesk('lin'),
  },
  ashtray: { spot: 'smoke' },
  elevator: OFFICE_ELEVATOR,
  zoneSeeds: OFFICE_ZONE_SEEDS,
  legendAt: { x: 20, y: 15.5 },
  things: { penShake, penScribble, wallet }, // his dry pen at Lin's desk and yours, Kev's wallet (POSES)
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

// His pen, every loop (index.js INSPECTIONS, look PEN_LOOK / PEN_LOOK_YOU s). Seconds into the stay at a desk:
//   Lin's desk   he writes and nothing comes (🖊️❓), shakes the pen, scribbles on the clipboard's corner, shakes it
//                again, gives up, and goes into the meeting room for a pen from the pot on the table (index.js
//                errands). That walk is Lin's desk unwatched.
//   your desk    the pen from the pot is no better (🖊️😤): shake, scribble, shake, and at last it writes. Then his
//                phone rings.
// Through each fight he is head down over the clipboard, eyes on the nib (headDown: index.js clockFor shrinks his
// view cone onto the clipboard). A hand at his elbow goes unseen: yours on Lin's laptop, Kev's on his own, as Kev
// strolls home with it behind the auditor's back (cast.js kevStopsAgain).
export const PEN_LOOK = 3.6;
export const PEN_LOOK_YOU = 4.8;
const PEN_FIGHTS = {
  2: { look: PEN_LOOK, beats: [[0.5, null], [1.4, 'shake'], [2.6, 'scribble'], [3.4, 'shake']] },
  3: { look: PEN_LOOK_YOU, beats: [[0.5, null], [1.6, 'shake'], [2.8, 'scribble'], [4.0, 'shake']] },
};
// Seconds into his pen fight at this desk and its beats, or null when he isn't standing at a pen desk.
function penFight(n) {
  const atDesk = !n._reaching && !n._phone; // not at the pen pot or on the phone (index.js errands)
  const f = n.override === 'audit' && atDesk && !n.moving && n._wait > 0 && PEN_FIGHTS[n._insp?.i];
  return f ? { into: f.look - n._wait, beats: f.beats } : null;
}
export function penBeat(n) {
  const f = penFight(n);
  return f ? (f.beats.find(([until]) => f.into < until)?.[1] ?? null) : null;
}
// Which desk's pen fight he is in (2 Lin's, 3 yours) while it lasts, head down; 0 otherwise.
export function headDown(n) {
  const f = penFight(n);
  return f && f.into < f.beats[f.beats.length - 1][0] ? n._insp.i : 0;
}

// Game minutes since a stamp npc._...At (Infinity if never).
const since = (game, at) => (at === undefined ? Infinity : game.clock.minute - at);

export const POSES = {
  arms: [
    // A coffee, standing: the auditor before 3:30, Kev and Lin in the kitchen.
    { when: (n) => !n.override && n.anim === 'coffee' && !n.moving, arms: 'carry', item: '#cup' },
    // Kev at the end of your desk before lunch (cast.js kevLeavesIt, kevFindsIt): the laptop down, both hands patting
    // his pockets; then his wallet held up, found.
    { when: (n, w, game) => n.id === 'kev' && since(game, n._patAt) < KEV_PAT * GAME_MIN_PER_SEC, arms: 'pat' },
    { when: (n, w, game) => n.id === 'kev' && since(game, n._walletAt) < KEV_FOUND * GAME_MIN_PER_SEC, arms: 'reach', item: '#wallet' },
    // Kev, his laptop on your desk again: silly him (cast.js stopBy).
    { when: (n, w, game) => n.id === 'kev' && n._palmAt !== undefined && game.clock.minute - n._palmAt < 0.6, arms: 'facepalm' },
    { when: (n) => n.id === 'auditor' && n._reaching, arms: 'reach' }, // a pen out of the pot (index.js errands)
    { when: (n) => n.id === 'auditor' && n._phone, arms: 'phone' }, // his phone: it rang after your desk's tick
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

// level.voices (fields: src/audio/babble.js VOICES). The office three, and the auditor.
export const VOICES = {
  ...OFFICE_VOICES,
  // The auditor: flat, nasal, precise, no rise or fall.
  auditor: {
    wave: 'square', f0: 165, spread: 0.02, decl: 0.02, syl: [0.06, 0.08], gap: [0.05, 0.07], atk: 0.004,
    fmt: 1.05, q: [7, 9], mk: 2.2, f2amp: 0.6, body: 0.05, bodyF: 700,
    vowels: ['i', 'e', 'i', 'a'], cons: 0.7, consF: 4200, consAmp: 0.22,
    post: [['peaking', 1400, 3, 7], ['lowpass', 3200, 0.7]], gain: 0.6,
    pitch: { notice: 400, tattle: 1, grumble: 200 },
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
    'auditor:phone': { sfx: 'phoneRing', who: 'auditor', opts: { dur: 1.2 } }, // after your desk's tick
  },
  signs: {},
  contraband: {},
  drops: { laptop_boss: 'soft', laptop_lin: 'soft', laptop_kev: 'soft' },
  repeats: {},
  elevator: { spot: 'elevator', radius: 2.5 },
};

// The end card: a drawn scene per outcome (end-scenes.js).
export { END_SCENES } from './end-scenes.js';
