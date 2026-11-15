// How The Interview looks and sounds: title card, set dressing, people, poses, voices and sounds (level 1's decor.js,
// looks.js, voices.js and sounds.js document the fields). The phones and the switchboard are painters.js.
import { C } from '../../render/palette.js';
import { LOOKS as MEETING_LOOKS } from '../meeting/looks.js';
import { PHONE_PROPS } from './painters.js';
import { PHONE_IDS, PHONES, holdOf } from './phones.js';

export const TITLE = {
  mission: ["3:00 PM. Lin wants your job. Her phone interview is at 3:30.", 'She must miss it.'],
  badge: ['@lin', '❌'],
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

export const DECOR = {
  zoneSeeds: [{ x: 3, y: 2, zone: 'office' }, { x: 20, y: 3, zone: 'kitchen' }],
  chairs: [
    { spot: 'boss_desk', face: 'S', color: OXBLOOD },
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { x: 17, y: 4, face: 'N', color: MUSTARD }, // kitchen table
    { x: 18, y: 4, face: 'N', color: MUSTARD },
  ],
  windows: [{ x0: 2, x1: 5, y: 0 }, { x0: 24, x1: 27, y: 0 }],
  paintings: [{ x: 18, y: 5, variant: 1 }, { x: 23, y: 5, variant: 0 }],
  clock: { x: 7, y: 5 },
  props: PHONE_PROPS,
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
    lin: { screen: '#cfe2ee', screenArt: 'blankSlide', mug: C.teal, prop: 'plant' },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: null },
  },
  legendAt: { x: 15, y: 14.8 },
};

export const LOOKS = MEETING_LOOKS;

// What the cast are seen doing (level 1's looks.js POSES documents the fields): a receiver to the ear on a line, or
// while Lin checks hers; a shrug at someone else's interview; Kev crouched at the socket.
export const POSES = {
  arms: [
    { when: (n, w) => n.override === 'on_job' && n.id !== 'lin' && w[`job_${n.id}`] > 0.55, arms: 'shrug' },
    { when: (n) => n.override === 'on_job' || (!!holdOf(n) && n.override.startsWith('on_')), arms: 'phone' },
    { when: (n, w) => n.id === 'lin' && !!w.linCheck, arms: 'phone' },
    { when: (n, w, game) => n.id === 'kev' && game.clock && game.clock.minute < w.kevReach, arms: 'reach' },
  ],
  marks: [],
};

// Level 1's voices (src/levels/meeting/voices.js), copied: the same three people.
export const VOICES = {
  boss: {
    wave: 'sawtooth', f0: 92, spread: 0.06, decl: 0.24, syl: [0.15, 0.21], gap: [0.04, 0.07], atk: 0.02,
    fmt: 0.82, q: [7, 9], mk: 3.2, f2amp: 0.6, body: 0.22, bodyF: 520, vowels: ['a', 'o', 'u', 'uh', 'ae'],
    cons: 0.3, consF: 1700, consAmp: 0.18, growl: 31, post: [['lowpass', 2600, 0.7]], gain: 1.15,
    pitch: { notice: 300, tattle: 1, grumble: 220 },
  },
  lin: {
    wave: 'sawtooth', f0: 245, spread: 0.13, decl: 0.08, syl: [0.075, 0.105], gap: [0.02, 0.04], atk: 0.006,
    fmt: 1.15, q: [5, 7], mk: 2.4, f2amp: 0.75, body: 0.05, bodyF: 600, vowels: ['i', 'e', 'a', 'ae', 'o'],
    cons: 0.6, consF: 5200, consAmp: 0.22, gain: 0.8, pitch: { notice: 620, tattle: 1.12, grumble: 260 },
  },
  kev: {
    wave: 'square', f0: 148, spread: 0.04, decl: 0.06, syl: [0.12, 0.16], gap: [0.008, 0.02], atk: 0.025,
    fmt: 0.95, q: [5, 6], mk: 2.0, f2amp: 0.5, body: 0.06, bodyF: 450, vowels: ['uh', 'u', 'o', 'oe', 'e'],
    cons: 0.15, consF: 2600, consAmp: 0.12, post: [['peaking', 1150, 3, 9], ['lowpass', 1700, 0.8]], gain: 0.55,
    pitch: { notice: 440, tattle: 0.84, grumble: 190 },
  },
};

// The bell is the rings' noise (phones.js NOISES, sfx 'phoneRing'); a phone on hold plays a little tune.
const holdTune = (p) => ({ while: (w) => !!w[`line_${p}`] && !(p === 'lin' && (w.interview === 'lin' || w.interview === 'other')), every: [1.6, 2.4], sfx: 'jingle', spot: PHONES[p].at, opts: { gain: 0.35 } });

export const SOUNDS = {
  actions: {
    start: { unplug: { sfx: 'rustle', spot: 'lin_side', opts: { gain: 0.6 } } },
    done: { unplug: { sfx: 'pickup', spot: 'lin_side' } },
  },
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'cord:in': { sfx: 'pickup', spot: 'lin_side' },
    'interview:busy': { sfx: 'machineBeep', spot: 'lin_side', opts: { gain: 0.5 } },
    'interview:lin': { sfx: 'pickup', spot: 'lin_side' },
    'interview:other': { sfx: 'pickup', spot: 'lin_side' },
  },
  repeats: Object.fromEntries(PHONE_IDS.map((p) => [`hold_${p}`, holdTune(p)])),
};
