// How the Monitor looks: title card, set dressing, people and the end card (level 1's decor.js, looks.js and
// end-scenes.js document the fields).
import { C } from '../../render/palette.js';
import { emoji } from '../../render/util.js';
import { TAB, floorCarpet } from '../../render/tableau.js';
import { cameraFeed } from '../../game/perception.js';
import { LOOKS as L1 } from '../meeting/looks.js';

export const TITLE = {
  mission: ['Your embarrassing parcel is at the front desk.', 'Lin collects the mail at 4:00.'],
  badge: ['📦', '😳'],
};

const NAVY = [C.navy, C.navyDark];
const TEAL = [C.teal, C.tealDark];
const MUSTARD = ['#d6a23a', '#a97b22'];
const feed = (w, game) => cameraFeed(game, 'back_office_cam');

export const DECOR = {
  chairs: [
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'bob_desk', face: 'S', color: NAVY }, // behind the counter, his back to the pigeonholes
  ],
  windows: [{ x0: 2, x1: 5, y: 0 }, { x0: 8, x1: 10, y: 0 }, { x0: 14, x1: 17, y: 0 }, { x0: 21, x1: 26, y: 0 }],
  paintings: [{ x: 3, y: 10, variant: 0 }, { x: 23, y: 10, variant: 1 }, { x: 24, y: 4, variant: 1 }],
  clock: { x: 6, y: 0 },
  props: [
    { tile: 'M', draw: 'monitor', state: feed }, // Bob's screen: what the camera sees
    { tile: 'C', draw: 'cctv', state: feed },
    { tile: 'S', draw: 'icon', state: (w) => ({ icon: w.parcel === 'shelf' ? '📦' : '📭' }) },
    { tile: 'B', draw: 'icon', state: (w) => ({ icon: w.broom === 'stand' ? '🧹' : '' }) },
    { tile: 'A', draw: 'icon', state: (w) => ({ icon: w.label === 'printer' ? '🏷️' : '🖨️', size: 16 }) },
    { tile: 'O', draw: 'icon', state: (w) => ({ icon: w.plug === 'in' ? '🔌' : '⚡', size: 14 }) },
  ],
  deskOwners: ['lin_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
  },
  zoneSeeds: [
    { zone: 'office', x: 4, y: 2 },
    { zone: 'kitchen', x: 16, y: 7 }, // the back office: lino, strip light
    { zone: 'kitchen', x: 25, y: 7 }, // the mailroom
    { zone: 'meeting', x: 20, y: 2 }, // the corridor
    { zone: 'lobby', x: 9, y: 13 },
  ],
  legendAt: { x: 20, y: 15.5 },
};

export const LOOKS = {
  player: L1.player,
  lin: L1.lin,
  // Bob: security. Navy uniform, cap, moustache, a badge.
  bob: {
    body: C.navy, bodyDark: C.navyDark, torso: 'suit', shirt: '#c9d6e6', shirtDark: '#9fb0c6', tie: '#1c2639',
    skin: '#e3ad86', skinDark: '#c68e66', hair: '#1c2639', hairStyle: 'cap', mustache: true,
    legs: '#1c2232', wide: 1.2, tall: 1.06, head: 7.2, bubbleDy: 34, eyeDy: 13,
  },
};

export const POSES = {
  arms: [
    { when: (n) => n.override === 'whacking', arms: 'bang' }, // a thump on the side of the camera
    { when: (n) => n.override === 'plugging', arms: 'reach', item: '🔌' },
    { when: (n, w) => n.id === 'lin' && w.parcel === 'lin', arms: 'carry', item: '📦' },
  ],
  marks: [
    { when: (n) => n.id === 'bob', badge: true },
  ],
};

// How the cast talks (level.voices; fields: src/audio/babble.js VOICES), by cast `voice` name.
export const VOICES = {
  // Bob: low, slow, a grunt more than a word.
  bob: {
    wave: 'triangle', f0: 98, spread: 0.06, decl: 0.1, syl: [0.13, 0.19], gap: [0.03, 0.06], atk: 0.02,
    fmt: 0.85, q: [5, 7], mk: 3.2, f2amp: 0.5, body: 0.24, bodyF: 420,
    vowels: ['o', 'u', 'uh', 'a'], cons: 0.3, consF: 2200, consAmp: 0.16, gain: 1.15,
    pitch: { notice: 180, tattle: 1.08, grumble: 80 },
  },
  // Lin: level 1's voice (src/levels/meeting/voices.js).
  lin: {
    wave: 'sawtooth', f0: 245, spread: 0.13, decl: 0.08, syl: [0.075, 0.105], gap: [0.02, 0.04], atk: 0.006,
    fmt: 1.15, q: [5, 7], mk: 2.4, f2amp: 0.75, body: 0.05, bodyF: 600,
    vowels: ['i', 'e', 'a', 'ae', 'o'], cons: 0.6, consF: 5200, consAmp: 0.22, gain: 0.8,
    pitch: { notice: 620, tattle: 1.12, grumble: 260 },
  },
};

// The end card: the carpet and one big icon.
const picture = (icon) => (ctx, game, t) => {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  emoji(ctx, icon, TAB.x + TAB.w / 2, TAB.y + TAB.h / 2 + Math.sin(t * 2) * 3, 72);
};

export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? (o.routes.includes('bob') ? 'bob' : 'drawer') : o?.result ?? 'fail'),
  scenes: {
    bob: { win: true, icons: ['📦', '👉', '💂'], draw: picture('😳') }, // Bob's parcel, read out to the office
    drawer: { win: true, icons: ['🗄️', '📭', '😌'], draw: picture('📭') }, // no mail today
    fail: { win: false, icons: ['📦', '😏', '😳'], draw: picture('📦') },
    caught: { win: false, icons: ['📺', '👉', '😳'], draw: picture('📺') },
    blamed: { win: false, icons: ['🪑', '👉', '📦'], draw: picture('🪑') }, // not at your desk when the mail came
  },
};
