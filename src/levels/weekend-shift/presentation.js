// How Weekend Shift looks and sounds: title card, set dressing, poses, the end card, voices and sounds (level 1's
// decor.js, looks.js, end-scenes.js, voices.js and sounds.js document the fields). The people look as they do in
// level 1: same office, an hour later.
import { C } from '../../render/palette.js';
import { emoji } from '../../render/util.js';
import { TAB, floorCarpet } from '../../render/tableau.js';
import { LOOKS as LEVEL1_LOOKS } from '../meeting/looks.js';

export const TITLE = {
  mission: ['5:00 PM. Someone works this Saturday.', "Make sure it isn't you."],
  badge: ['📋', '🙅'],
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

const cooking = (w, game) => w.noodles === 'cooking' && w.dingAt !== null && (game?.clock?.minute ?? 0) < w.dingAt;

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
    { x: 17, y: 6, variant: 1 },
  ],
  clock: { x: 22, y: 6 },
  props: [
    { tile: 'R', draw: 'icon', state: (w) => ({ icon: w.roster === 'boss' ? '👔' : '📋', size: 20 }) },
    { tile: 'K', draw: 'icon', state: (w) => ({ icon: w.sheet === 'tray' ? '📥' : '🗂️', size: 16 }) },
    {
      tile: 'X',
      draw: 'icon',
      state: (w) => ({ icon: w.copier === 'jammed' ? '⚠️' : w.copier === 'fixing' ? '🔧' : '🖨️', size: 20 }),
    },
    {
      tile: 'M',
      draw: 'icon',
      state: (w, game) => ({ icon: cooking(w, game) ? '⏲️' : w.noodles === 'cooking' ? '🍜' : '♨️', size: 16 }),
    },
  ],
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: 'earbuds' },
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: 'plant' },
  },
  zoneSeeds: [
    { zone: 'office', x: 10, y: 2 }, // the boss's office (his desk draws as an exec desk)
    { zone: 'kitchen', x: 22, y: 2 }, // the break room
  ],
  legendAt: { x: 15, y: 16.5 },
};

export const LOOKS = LEVEL1_LOOKS;

// level.poses (level 1's looks.js documents the fields).
export const POSES = {
  arms: [
    { when: (n) => n.override === 'fixing', arms: 'reach', item: '🔧', crank: true },
    { when: (n) => n.override === 'onPhone', arms: 'puff', item: '📞' },
    { when: (n) => n.id === 'lin' && !n.override && n.anim === 'fish', arms: (n) => (n.moving ? 'carry' : 'puff'), item: '🐟' },
    { when: (n, w) => n.id === 'kev' && w.sheet === 'kev' && n.moving, arms: 'carry', item: '📝' },
  ],
  marks: [
    { when: (n, w) => n.id === 'boss' && n.override === 'meeting' && w.roster === 'boss' && !n.moving, angry: true },
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
      fix_roster: { sfx: 'scratch', spot: 'meeting_presenter', opts: { gain: 0.5 } },
      swap_sheet: { sfx: 'rustle', spot: 'kev_tray', opts: { gain: 0.5 } },
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
    'sheet:taken': { sfx: 'rustle', who: 'kev' },
  },
  repeats: {
    repair: { while: (w) => w.copier === 'fixing', every: [1.1, 2.0], sfx: 'clank', spot: 'copier', opts: { soft: true, gain: 0.7 } },
  },
  murmur: { spot: 'meeting_presenter' },
};

// The end card: the carpet and one big face.
const picture = (icon) => (ctx, game, t) => {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  emoji(ctx, icon, TAB.x + TAB.w / 2, TAB.y + TAB.h / 2 + Math.sin(t * 2) * 3, 72);
};

export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? (o.routes.includes('roster') ? 'roster' : 'sheet') : o?.result ?? 'fail'),
  scenes: {
    roster: { win: true, icons: ['📋', '👔', '😳'], draw: picture('😳') }, // the boss reads out his own name
    sheet: { win: true, icons: ['📝', '🔧', '😩'], draw: picture('😩') }, // Kev signed up for Saturday
    fail: { win: false, icons: ['📋', '👉', '😩'], draw: picture('📋') },
    caught: { win: false, icons: ['👔', '👉', '😠'], draw: picture('😠') },
    blamed: { win: false, icons: ['🪑', '👉', '📋'], draw: picture('🪑') }, // not there when your name came up
  },
};
