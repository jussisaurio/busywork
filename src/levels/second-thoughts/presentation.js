// How Second Thoughts looks and sounds: title card, set dressing, poses and sounds (level 1's decor.js, looks.js and
// sounds.js document the fields). The end cards are in end-scenes.js. People look as in level 1 (its looks.js,
// read-only).
import { OXBLOOD, MUSTARD, TEAL, OLIVE } from '../../render/palette.js';
import { LOOKS } from '../office/looks.js';
import { trayProp, deskClockProp, drawerProp, puddleProp, jugProp, machineProp, surgeProp, trayThing, phoneThing, jugThing } from './things.js';
import { OFFICE_WINDOWS, OFFICE_CLOCK, officeDesk } from '../office/decor.js';

export { LOOKS };
export { END_SCENES } from './end-scenes.js';

export const TITLE = {
  mission: ["3:00 PM. Your angry resignation letter is in the boss's tray.", 'He goes through his tray at 3:40. Keep your job.'],
  badge: ['✉️', '@boss', '📦'],
};


export const DECOR = {
  chairs: [
    { spot: 'boss_desk', face: 'S', color: OXBLOOD },
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { x: 13, y: 12, face: 'N', color: MUSTARD },
    { x: 22, y: 12, face: 'N', color: TEAL },
    { x: 10, y: 3, face: 'E', color: OXBLOOD },
    { x: 12, y: 5, face: 'N', color: TEAL },
    { x: 14, y: 5, face: 'N', color: TEAL },
    { x: 15, y: 5, face: 'N', color: TEAL },
    { x: 12, y: 2, face: 'S', color: TEAL },
    { x: 14, y: 2, face: 'S', color: TEAL },
    { x: 15, y: 2, face: 'S', color: TEAL },
    { x: 24, y: 4, face: 'N', color: MUSTARD },
    { x: 26, y: 4, face: 'N', color: MUSTARD },
    { x: 25, y: 2, face: 'S', color: MUSTARD },
  ],
  windows: OFFICE_WINDOWS,
  paintings: [
    { x: 10, y: 6, variant: 0 },
    { x: 25, y: 6, variant: 1 },
  ],
  clock: OFFICE_CLOCK,
  // The in-tray on his desk, your letter lying in it while it's there (dragged over to him from 3:39), and his
  // desk clock at the other end, which he keeps checking. The coffee machine: the water jug beside it (full, or
  // tipping into its back vent while you pour, empty after, a puddle dripping under the counter till it shorts), its lamp
  // blinking green while it brews and glowing green with the pot full and steaming once it has (a full pot pours a
  // cup: index.js pour_coffee). Shorted: the spark running down the wiring to the fuse box, smoke off it while the fuse
  // is out till Kev unplugs it, and a scorch mark for the rest of the day. (The lighting panel and the fuse box: darkness.controls.)
  props: [
    { // where you threw up (keyed on your desk; drawn where it happened, smaller as Lin wipes it up)
      tile: 'P',
      draw: puddleProp,
      state: (w, game) => ({
        at: w.puddle,
        k: (w.sickAt === null ? 1 : Math.min(1, ((game?.loopTime ?? 0) - w.sickAt) / 0.5)) * (1 - 0.7 * w.wipeProgress),
      }),
    },
    {
      tile: 'P',
      draw: drawerProp,
      state: (w, game) => ({
        stashed: w.letter === 'drawer',
        open: w.stashAt === null ? 0 : Math.max(0, 1 - Math.max(0, (game?.loopTime ?? 0) - w.stashAt - 0.6) / 0.6),
      }),
    },
    { tile: 'Y', draw: trayProp, state: (w) => ({ letter: w.letter === 'tray', pull: w.trayPull }) },
    {
      tile: 'Y',
      draw: deskClockProp,
      state: (w, game) => ({
        minute: Math.floor(game?.clock?.minute ?? 0),
        glint: w.bossAct === 'clock',
        ring: w.chimed ? Math.max(0, 1 - ((game?.clock?.minute ?? 0) - 39) / 0.9) : 0,
      }),
    },
    { tile: 'M', draw: 'carafe', state: (w) => ({ full: w.coffee === 'brewed' }) },
    { tile: 'M', draw: jugProp, state: (w) => ({ empty: w.rigged, pouring: w.pouring, puddle: w.rigged && w.coffee !== 'shorted' }) },
    {
      tile: 'M',
      draw: machineProp,
      state: (w) => ({
        lamp: w.fuse !== 'on' ? null : w.coffee === 'brewed' ? 'brewed' : w.coffee === 'brewing' ? 'brewing' : null,
        steam: w.coffee === 'brewed' && w.fuse === 'on', // power out: the warming plate goes cold, the pot still full
        scorch: w.coffee === 'shorted',
        smoke: w.coffee === 'shorted' && w.fuse !== 'on' && !w.unplugged,
      }),
    },
    { tile: 'M', draw: surgeProp, state: (w) => ({ k: w.surge }) },
  ],
  // Things that are no item, for the end cards (end-scenes.js), where they are drawn in a hand.
  things: { tray: trayThing, phone: phoneThing, jug: jugThing },
  desks: {
    player: officeDesk('player'),
  },
  legendAt: { x: 19.5, y: 15.5 }, // over the blank wall right of the lobby
};

// level.poses (level 1's looks.js documents it): Kev's hands in the fuse box or at the machine's plug, the boss's on
// the lighting panel, fuming; Lin wiping up your sick at arm's length.
// Anyone holding a phone torch keeps free hands: render/darkness.js draws the arm and the phone.
// The boss dreading his tray (index.js dread): a shrug as he sighs at it, one hand drumming on the desk, a hand to
// his desk clock, both hands dragging the tray over at 3:39.
const dreading = (n, w, act) => n.id === 'boss' && w.bossAct === act;
export const POSES = {
  arms: [
    { when: (n) => n.id === 'lin' && n.override === 'wiping', arms: 'holdout' }, // at arm's length
    { when: (n) => n.override === 'fixing' || n.override === 'switching' || n.override === 'unplugging' || n.override === 'tearing', arms: 'reach' },
    { when: (n, w) => n.id === 'boss' && w.pullAt !== null && w.trayPull < 1 && n.pose === 'sit', arms: 'reach' },
    { when: (n, w) => dreading(n, w, 'sigh'), arms: 'shrug' },
    { when: (n, w, game) => dreading(n, w, 'drum') && Math.floor((game?.time ?? 0) * 6) % 2 === 0, arms: 'carry' },
    { when: (n, w) => dreading(n, w, 'clock'), arms: 'carry' },
  ],
  marks: [
    { when: (n) => n.override === 'switching', angry: true },
  ],
};

export const CONES = { alert: [] };

// What it sounds like (level 1's sounds.js documents the fields; recipes in src/audio/sfx.js).
export const SOUNDS = {
  actions: {
    start: {
      pull_breaker: { sfx: 'rattle', spot: 'fuse_box', opts: { gain: 0.6 } },
    },
    done: {
      flip_switch: { sfx: 'clank', spot: 'office_switch' },
      flip_switch_on: { sfx: 'clank', spot: 'office_switch' },
    },
  },
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:checksClock': { sfx: 'clockTick', spot: 'boss_desk', opts: { gain: 0.4 } },
    'boss:chime': { sfx: 'fourOClock', spot: 'boss_desk', opts: { gain: 0.6 } },
    'boss:pullsTray': { sfx: 'shuffle', spot: 'boss_desk', opts: { gain: 0.6 } },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'coffee:rigged': { sfx: 'pour', spot: 'coffee_machine' },
    'coffee:flicker': { sfx: 'gurgle', spot: 'coffee_machine' },
    'coffee:shorted': { sfx: 'splashZap', spot: 'coffee_machine' },
    'fuse:tripped': { sfx: 'clank', spot: 'fuse_box' },
    'fuse:pulled': { sfx: 'splashZap', spot: 'fuse_box', opts: { gain: 0.7 } },
    'fuse:fixing': { sfx: 'clank', spot: 'fuse_box', opts: { soft: true } },
    'fuse:fixed': { sfx: 'fixed', spot: 'fuse_box' },
    'switch:fixed': { sfx: 'clank', spot: 'office_switch' },
    'letter:taken': { sfx: 'jingle', who: 'player', opts: { gain: 0.5 } },
    'letter:eaten': { sfx: 'rustle', who: 'player' },
    'player:sick': { sfx: 'splashZap', who: 'player', opts: { gain: 0.8 } },
    'lin:towels': { sfx: 'rustle', who: 'lin', opts: { gain: 0.6 } },
    'lin:wipes': { sfx: 'shuffle', who: 'lin', opts: { soft: true } },
    'coffee:unplugged': { sfx: 'pickup', spot: 'coffee_machine', opts: { soft: true } },
    'letter:stashed': { sfx: 'shuffle', who: 'player', opts: { gain: 0.5 } },
  },
  signs: {},
  contraband: {},
  drops: { letter: 'soft' },
  repeats: {
    fixing: { while: (world) => world.fixProgress > 0, every: [1.1, 2.0], sfx: 'clank', spot: 'fuse_box', opts: { soft: true, gain: 0.6 } },
  },
  murmur: { spot: 'boss_desk' },
  elevator: { spot: 'elevator', radius: 2.5 },
};
