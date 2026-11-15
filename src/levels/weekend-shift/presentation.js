// How Weekend Shift looks and sounds: title card, set dressing, poses, the end card, voices and sounds (level 1's
// decor.js, looks.js, end-scenes.js, voices.js and sounds.js document the fields). The people look as they do in
// level 1: same office, an hour later.
import { C } from '../../render/palette.js';
import { T } from '../../render/util.js';
import { GAME_MIN_PER_SEC } from '../../config.js';
import { LOOKS as LEVEL1_LOOKS } from '../meeting/looks.js';
import { READ_S, ANNOUNCE_S, POINT_S, CLAP_S } from './cast.js';
import { paintRoster, paintCopier, paintMicrowave, paintMyPhone, paintBossPhone, paintLunch, THINGS, POP_S, scribbleOf } from './props.js'; // decor.props' painters
export { END_SCENES } from './end-scenes.js';

export const TITLE = {
  mission: ["Friday, 4:00 PM. You're down for Saturday.", 'At 5:00 the boss reads it out.'],
  badge: ['🗓️', '@player'], // the roster's week, and you down for it
};

const OXBLOOD = ['#6b2f24', '#4e2019'];
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

const look = (game, id) => game?.level?.looks?.[id] ?? null;
// s to the DING while the noodles cook, else null
const dingIn = (w, game) => (w.noodles === 'cooking' && w.dingAt !== null ? (w.dingAt - (game?.clock?.minute ?? 0)) / GAME_MIN_PER_SEC : null);

// Lin stands at the microwave with her fish in it (4:30-4:37): the window lights up with a fish going round
const lin = (game) => (game?.npcs || []).find((n) => n.id === 'lin');
const linHeatsFish = (game) => !!(game?.npcs || []).find((n) => n.id === 'lin' && n.anim === 'fishIn' && !n.moving && !n.override);
// Lin's lunch box: on her desk ('cold'), with her ('away': in her hands, or in the microwave), back open ('hot')
function lunch(game) {
  const n = lin(game);
  if (!n) return 'cold';
  if (n._ate) return 'hot';
  return n.anim === 'fishIn' || n.anim === 'fish' ? 'away' : 'cold';
}
// She carries it while she isn't standing at the microwave with it inside
function linAtMicrowave(n, game) {
  const m = game?.level?.spots?.lin_wait;
  return !!m && !n.moving && Math.hypot(n.x - (m.x + 0.5), n.y - (m.y + 0.5)) < 0.6;
}

// The reading (cast.js readRoster): READ_S s before 5:00 the boss announces it to the room; at ANNOUNCE_S he turns
// and points the marker at the face on the board; at POINT_S, whose it is. readS: s into it, else null.
const boss = (game) => (game?.npcs || []).find((n) => n.id === 'boss');
function readS(game) {
  const b = boss(game);
  if (!b || !b._read || b.moving || !game.clock) return null;
  const s = (game.clock.minute - (game.level.day.meetingAt - READ_S * GAME_MIN_PER_SEC)) / GAME_MIN_PER_SEC;
  return s >= 0 ? s : null;
}
const reading = (game, from) => {
  const s = readS(game);
  return s !== null && s >= from;
};
// He has the board's marker from 4:50 (the board is his now): in his hand, gone from the tray
const bossHasMarker = (n, w) => n.id === 'boss' && !!w.rosterLocked && n.override !== 'onPhone';
const WROTE_FRESH_MIN = 3; // game minutes the ink glints after you write
const sinceMin = (game, m) => (m === null || m === undefined ? null : ((game?.clock?.minute ?? 0) - m) / GAME_MIN_PER_SEC);
// s into the beat a new face pops up off the board, else null
function popS(w, game) {
  const s = sinceMin(game, w.wroteAt);
  return s !== null && s >= 0 && s < POP_S ? s : null;
}
// the side of the board, -1 west or 1 east, away from you: the popping face drifts that way
function popSide(game) {
  const p = game?.player;
  const bx = (game?.level?.map?.rows || []).reduce((x, row) => (x >= 0 ? x : row.indexOf('R')), -1);
  if (!p || bx < 0 || !Number.isFinite(p.x)) return 0;
  return p.x > bx + 0.5 ? -1 : 1;
}
// s since the jammed copier's last beep (it beeps 1 s after the jam, then every 2 s: index.js NOISES), else null
function beepS(w, game) {
  if (w.copier !== 'jammed' && w.copier !== 'fixing') return null;
  const s = sinceMin(game, w.jamAt);
  return s === null || s < 1 ? null : (s - 1) % 2;
}
// Kev, alerted by the beeping, from his ❗ until he kneels at the copier: where his head is (px), else null
function kevHears(game) {
  const n = (game?.npcs || []).find((k) => k.id === 'kev');
  if (!n || n.override !== 'alerted') return null; // from the ❗ until he kneels at it
  return { x: n.x * T, y: n.y * T - 18 };
}
// Your place round the board, outlined on the floor: only once you're blamed for not being in it
function emptyPlace(game) {
  return game?.outcome?.result === 'blamed';
}
function placePx(game) {
  const s = game?.level?.spots?.[game.level.meeting.chair];
  return s ? { x: s.x * T + T / 2, y: s.y * T + T / 2 } : null;
}

// Where the renderer puts the boss's hand at his ear, on the phone (render/characters.js 'phone' arms, standing):
// px, for the cord to his phone's handset (props.js paintBossPhone). null unless he's standing there talking.
function bossPhoneHand(game) {
  const b = boss(game);
  if (!b || b.override !== 'onPhone' || b.moving) return null;
  const L = LEVEL1_LOOKS.boss;
  const r = L.head + 0.8;
  const d = b.dir ?? 0;
  return { x: b.x * T - Math.sin(d) * r, y: b.y * T - 2 - 10 * L.tall + 1 + Math.cos(d) * 0.6 * r };
}

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
          glow: s !== null && s >= ANNOUNCE_S, // the boss points the marker at it
          pop: popS(w, game), // a new face, just written
          popSide: popSide(game), // ... drifting away from you
          place: placePx(game),
          empty: emptyPlace(game),
          hot: true,
          tray: !w.rosterLocked && !scribbleOf(game), // the marker: in his hand from 4:50, in yours while you write
          scribble: scribbleOf(game), // a write in progress, half drawn (and left so if you're caught at it)
        };
      },
    },
    { tile: 'X', draw: paintCopier, state: (w, game) => ({ copier: w.copier, beep: beepS(w, game), kev: kevHears(game) }) },
    {
      tile: 'M',
      draw: paintMicrowave,
      state: (w, game) => ({ noodles: w.noodles, left: dingIn(w, game), fish: linHeatsFish(game) }),
    },
    { tile: 'Q', draw: paintMyPhone, state: (w, game) => ({ phone: w.phone, to: game?.map?.find?.('B')?.[0] ?? null }) },
    { tile: 'B', draw: paintBossPhone, state: (w, game) => ({ phone: w.phone, hand: bossPhoneHand(game) }) },
    { tile: 'L', draw: paintLunch, state: (w, game) => ({ lunch: lunch(game) }) },
  ],
  things: THINGS, // '#handset', '#lunchbox', '#lunchhot', '#spot', '#microwave', '#deskphone', '#marker' (props.js)
  deskOwners: ['lin_desk', 'kev_desk'],
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: null },
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: null }, // her lunch box goes there (props.js)
  },
  zoneSeeds: [
    { zone: 'office', x: 10, y: 2 }, // the boss's office (his desk draws as an exec desk)
    { zone: 'kitchen', x: 22, y: 2 }, // the break room
  ],
  legendAt: { x: 15, y: 16.5 },
};

export const LOOKS = LEVEL1_LOOKS;

// level.poses (level 1's looks.js documents the fields). Things in hand are '#<name>' things (decor.things, or the
// engine's): Kev kneels at the copier ratcheting a spanner (and props.js turns one in its works), the boss holds his
// phone's handset to his ear (props.js runs its cord to that hand), Lin carries her lunch box there and back, and
// pointing is the arm.
export const POSES = {
  arms: [
    // the reading: he points the marker at the face on the board (and, if it's Kev's, at Kev); at his own, he
    // spreads his hands, and Lin and Kev clap
    { when: (n, w, game) => n.id === 'boss' && reading(game, ANNOUNCE_S) && (w.roster !== 'boss' || readS(game) < POINT_S), arms: 'point', item: '#marker' },
    { when: (n, w, game) => n.id === 'boss' && w.roster === 'boss' && reading(game, POINT_S), arms: 'shrug', item: '#marker' },
    { when: (n, w, game) => (n.id === 'lin' || n.id === 'kev') && w.roster === 'boss' && reading(game, POINT_S) && readS(game) < POINT_S + CLAP_S, arms: 'bang' },
    { when: (n, w) => bossHasMarker(n, w), arms: 'mug', item: '#marker' },
    { when: (n) => n.override === 'fixing', arms: 'reach', item: '#wrench', crank: true },
    { when: (n) => n.override === 'onPhone', arms: 'phone', item: '#handset' },
    // 4:30 she stands up with her lunch box and takes it to the microwave; 4:37 she brings it back, open, hot
    { when: (n, w, game) => n.id === 'lin' && n.anim === 'fishIn' && !n._ate && !linAtMicrowave(n, game), arms: 'mug', item: '#lunchbox' },
    { when: (n, w, game) => n.id === 'lin' && n.anim === 'fish' && !n._ate, arms: 'mug', item: '#lunchhot' },
  ],
  marks: [
    { when: (n, w, game) => n.id === 'boss' && w.roster === 'boss' && reading(game, POINT_S), angry: true }, // red to the ears
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
