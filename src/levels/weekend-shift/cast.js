// Weekend Shift's people and their hooks (cast.js and behaviours.js in level 1 document the fields). Cast order is
// behaviour: the sim updates them in this order.
import { at, deg, GAME_MIN_PER_SEC } from '../../config.js';

const START = 16 * 60;
const s = (time, entry) => ({ at: at(time, START), ...entry });

export const CAST = [
  {
    id: 'boss',
    icon: '@boss',
    color: '#2b3a55', // navy suit
    voice: 'boss',
    meetingSpot: 'board_boss',
    meetingArrive: 'readRoster',
    vision: { fov: deg(100), radius: 9 },
    glanceEvery: [3, 5.5], // twitchy: a glance away is never long enough to write on the board
    coneTint: [255, 160, 82],
    schedule: [
      s('4:00', { do: 'sit', spot: 'boss_desk' }),
      s('4:20', { do: 'visit', spot: 'copier_boss', arrive: 'photocopy' }), // his back to the room
      s('4:25', { do: 'sit', spot: 'boss_desk' }),
      s('4:50', { do: 'visit', spot: 'board_boss', arrive: 'checkRoster' }), // from here on he guards the board
    ],
  },
  {
    id: 'lin',
    icon: '@lin',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'meeting_lin',
    vision: { fov: deg(100), radius: 8.5 },
    coneTint: [150, 230, 214],
    schedule: [
      s('4:00', { do: 'sit', spot: 'lin_desk' }), // she watches the board all day
      s('4:30', { do: 'visit', spot: 'microwave', arrive: 'fish', anim: 'fishIn' }), // fish, in the office microwave
      s('4:37', { do: 'sit', spot: 'lin_desk', arrive: 'eatFish', anim: 'fish' }),
    ],
  },
  {
    id: 'kev',
    icon: '@kev',
    color: '#5f6b3a', // olive hoodie
    voice: 'kev',
    meetingSpot: 'meeting_kev',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('4:00', { do: 'sit', spot: 'kev_desk' }), // he gets up when a machine needs fixing (index.js lures)
    ],
  },
];

// The reading: READ_S s before 5:00 the boss turns to the board and points at it (presentation.js poses, and the
// board's slot throbs); POINT_S s later he turns to whoever's face is on it, and that person reacts.
export const READ_S = 2.4;
export const POINT_S = 1.1;
// s from now to the reading (he has usually been at the board since 4:50, so the gather sits him down at 4:55)
const lastMoment = (game) => Math.max(0, (game.level.day.meetingAt - game.clock.minute) / GAME_MIN_PER_SEC - READ_S);

export const BEHAVIOURS = {
  // The boss at the copier: it works, or it doesn't.
  photocopy: {
    arrive(game, n, sim) {
      const c = game.world.copier;
      if (c === 'jammed' || c === 'fixing') sim.speak(game, n, [{ say: ['😠'] }]);
    },
  },
  // Lin heats her fish: it turns in the lit microwave while she waits in front of it, her back to the room (props.js).
  fish: {
    arrive() {},
  },
  // Back at her desk with it.
  eatFish: {
    state: { _ate: false },
    arrive(game, n, sim) {
      if (n._ate) return;
      n._ate = true;
      sim.speak(game, n, [{ say: ['🐟', '😊'], ttl: 1.6 }]);
    },
  },
  // 4:50: the boss comes out to the board. Nobody writes on it under his nose.
  checkRoster: {
    state: { _checked: false },
    arrive(game, n, sim) {
      game.world.rosterLocked = true; // he stands guard by it: his cone covers it
    },
  },
  // At the board, before 5:00: the boss reads out the face in Saturday's slot. He turns to the board and points at
  // it (📢: hear this), then turns to whose face it is: Kev's (he groans), yours (at 5:00 you stand up, there's
  // no way out), or his own (he goes red).
  readRoster: {
    state: { _read: false },
    arrive(game, n, sim) {
      const w = game.world;
      w.rosterLocked = true;
      if (n._read) return;
      n._read = true;
      const t = lastMoment(game);
      const at = t + POINT_S;
      const lines = [{ say: ['📢'], ttl: POINT_S, after: t, face: 'board_look' }];
      if (w.roster === 'boss') lines.push({ say: ['@boss', '😳'], ttl: 2.4, after: at, face: 'meeting_player' });
      else if (w.roster === 'kev') {
        lines.push({ say: ['👉', '@kev'], ttl: 2, after: at, face: 'meeting_kev' });
        const kev = game.npcs.find((k) => k.id === 'kev');
        if (kev) sim.speak(game, kev, [{ say: ['😩'], ttl: 2.2, after: at + 0.7, face: 'board_look' }]);
      } else {
        lines.push({ say: ['👉', '@player'], ttl: 1.3, after: at, face: 'meeting_player' });
        lines.push({ say: ['👉'], ttl: 1.6, after: t + READ_S + 0.1, face: 'meeting_presenter' }); // where 5:00 stands you
      }
      sim.speak(game, n, lines);
    },
  },
};
