// How Hold Music looks and sounds: title card, set dressing, people, voices, sounds and the end card (level 1's
// decor.js, looks.js, voices.js, sounds.js and end-scenes.js document the fields).
import { C } from '../../render/palette.js';
import { emoji } from '../../render/util.js';
import { TAB, floorCarpet } from '../../render/tableau.js';
import { LOOKS as MEETING_LOOKS } from '../meeting/looks.js';

export const TITLE = {
  mission: ["3:00 PM. Lin's interview for your job is a phone call at 3:30.", 'She must miss it.'],
  badge: ['📞', '❌'],
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

// A phone's icon: ringing while someone is on his way to it, in use while someone is on hold on it.
const phone = (p) => (w) => ({ icon: w[`line_${p}`] ? '📞' : w[`call_${p}`] ? '🔔' : '☎️', size: 15 });
// Lin's own phone: unplugged, or ringing for her interview from 3:30.
const linPhone = (w, game) => {
  if (w.cord === 'out') return { icon: '🔌', size: 15 };
  const interview = w.interview === 'due' && game.clock && game.clock.minute >= game.level.day.gatherAt;
  return { icon: w.line_lin ? '📞' : w.call_lin || interview ? '🔔' : '☎️', size: 15 };
};
// The switchboard: one button per phone, with its owner's face.
const button = (icon) => () => ({ icon, size: 16 });

export const DECOR = {
  chairs: [
    { spot: 'boss_desk', face: 'S', color: OXBLOOD },
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { spot: 'boss_hover', face: 'W', color: OXBLOOD }, // the visitor's chair by Lin's desk
    { x: 19, y: 4, face: 'N', color: MUSTARD }, // kitchen table
    { x: 20, y: 4, face: 'N', color: MUSTARD },
  ],
  windows: [{ x0: 4, x1: 7, y: 0 }, { x0: 10, x1: 13, y: 0 }, { x0: 17, x1: 19, y: 0 }],
  paintings: [{ x: 5, y: 12, variant: 1 }, { x: 22, y: 12, variant: 0 }],
  clock: { x: 20, y: 5 },
  props: [
    { tile: 'Y', draw: 'icon', state: phone('boss') },
    { tile: 'Z', draw: 'icon', state: phone('kitchen') },
    { tile: 'L', draw: 'icon', state: linPhone },
    { tile: 'V', draw: 'icon', state: phone('kev') },
    { tile: '1', draw: 'icon', state: button('👓') },
    { tile: '2', draw: 'icon', state: button('👔') },
    { tile: '3', draw: 'icon', state: button('🔧') },
    { tile: '4', draw: 'icon', state: button('☕') },
  ],
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
    lin: { screen: '#cfe2ee', screenArt: 'blankSlide', mug: C.teal, prop: 'plant' },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: 'earbuds' },
  },
  legendAt: { x: 22, y: 14.5 },
};

export const LOOKS = MEETING_LOOKS;

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

// Ringing phones beep until someone picks up; a phone on hold plays a little tune.
const ringing = (p, spot) => ({ while: (w) => !!w[`call_${p}`] && !w[`line_${p}`], every: [0.45, 0.6], sfx: 'machineBeep', spot });
const holdTune = (p, spot) => ({ while: (w) => !!w[`line_${p}`], every: [1.6, 2.4], sfx: 'jingle', spot, opts: { gain: 0.35 } });

export const SOUNDS = {
  actions: {
    start: { unplug: { sfx: 'rustle', spot: 'lin_side', opts: { gain: 0.6 } } },
    done: { unplug: { sfx: 'pickup', spot: 'lin_side' } },
  },
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'meeting:gather': { sfx: 'machineBeep', spot: 'lin_side' }, // 3:30: the interviewer calls
    'cord:in': { sfx: 'pickup', spot: 'lin_side' },
    'interview:busy': { sfx: 'machineBeep', spot: 'lin_side', opts: { gain: 0.5 } },
    'interview:boss': { sfx: 'relief', who: 'boss' },
  },
  repeats: {
    ring_lin: ringing('lin', 'lin_side'),
    ring_boss: ringing('boss', 'boss_phone'),
    ring_kev: ringing('kev', 'kev_side'),
    ring_kitchen: ringing('kitchen', 'kitchen_phone'),
    hold_lin: holdTune('lin', 'lin_side'),
    hold_boss: holdTune('boss', 'boss_phone'),
    hold_kev: holdTune('kev', 'kev_side'),
    hold_kitchen: holdTune('kitchen', 'kitchen_phone'),
  },
};

const picture = (icon) => (ctx, game, t) => {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);
  emoji(ctx, icon, TAB.x + TAB.w / 2, TAB.y + TAB.h / 2 + Math.sin(t * 2) * 3, 72);
};

export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? o.routes[0] : o?.result ?? 'fail'),
  scenes: {
    answered: { win: true, icons: ['📞', '👔', '💪'], draw: picture('👔') }, // "she's very motivated"
    busy: { win: true, icons: ['📞', '📵', '🎵'], draw: picture('📵') },
    unplugged: { win: true, icons: ['🔌', '📞', '🦗'], draw: picture('🔌') },
    ringout: { win: true, icons: ['📞', '🔔', '🤷'], draw: picture('🔔') },
    fail: { win: false, icons: ['📞', '👓', '😊'], draw: picture('😊') }, // she got the call, and your job
    caught: { win: false, icons: ['👔', '👉', '😠'], draw: picture('👔') },
    blamed: { win: false, icons: ['🪑', '👉', '📞'], draw: picture('🪑') }, // nowhere to be seen during the call
  },
};
