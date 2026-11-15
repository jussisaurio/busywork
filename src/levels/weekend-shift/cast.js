// Weekend Shift's people and their hooks (cast.js and behaviours.js in level 1 document the fields). Cast order is
// behaviour: the sim updates them in this order.
import { at, deg, GAME_MIN_PER_SEC } from '../../config.js';
import { inZone } from '../../game/perception.js';

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
    meetingArrive: 'whereAreYou',
    vision: { fov: deg(100), radius: 8.5 },
    coneTint: [150, 230, 214],
    schedule: [
      s('4:00', { do: 'sit', spot: 'lin_desk' }), // she watches the board all day
      s('4:30', { do: 'visit', spot: 'lin_wait', arrive: 'fish', anim: 'fishIn' }), // fish, in the office microwave
      s('4:37', { do: 'sit', spot: 'lin_desk', arrive: 'eatFish', anim: 'fish' }),
    ],
  },
  {
    id: 'kev',
    icon: '@kev',
    color: '#5f6b3a', // olive hoodie
    voice: 'kev',
    meetingSpot: 'meeting_kev',
    meetingArrive: 'whereAreYou',
    vision: { fov: deg(90), radius: 7 },
    glanceEvery: [20, 35], // heads down in his code: he hardly ever looks up
    coneTint: [214, 230, 140],
    schedule: [
      s('4:00', { do: 'sit', spot: 'kev_desk' }), // he gets up when a machine needs fixing (index.js lures)
    ],
  },
];

// The reading, READ_S s before 5:00. The boss has stood (from 4:55 sat) with his back to the board, facing the room,
// the board's marker in his hand. 📢: hear this. At ANNOUNCE_S he turns to the board and points the marker at the
// face in Saturday's slot (it lights up: presentation.js); at POINT_S, whose it is: Kev's (he turns to him, Kev
// groans), yours (he keeps pointing at it), or his own (he goes red, and Lin and Kev clap: CLAP_S).
export const READ_S = 3.4;
export const ANNOUNCE_S = 0.9;
export const POINT_S = 2.2;
export const CLAP_S = 1.8;
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
  // Back at her desk with it, and it stinks.
  eatFish: {
    state: { _ate: false },
    arrive(game, n, sim) {
      if (n._ate) return;
      n._ate = true;
      sim.speak(game, n, [{ say: ['🐟', '😊'], ttl: 1.6 }]);
      // the smell reaches Kev, two desks down (if he's at his)
      const kev = game.npcs.find((k) => k.id === 'kev');
      if (kev && !kev.override && !kev.moving) {
        sim.lookAt(game, kev, 'lin_desk', 1.6);
        sim.speak(game, kev, [{ say: ['🤢'], ttl: 1.6 }]);
      }
    },
  },
  // 4:50: the boss comes out to the board. Nobody writes on it under his nose.
  checkRoster: {
    state: { _checked: false },
    arrive(game, n, sim) {
      game.world.rosterLocked = true; // he stands guard by it: his cone covers it
    },
  },
  // At the board, before 5:00: the boss reads out the face in Saturday's slot (see READ_S).
  readRoster: {
    state: { _read: false },
    arrive(game, n, sim) {
      const w = game.world;
      w.rosterLocked = true;
      if (n._read) return;
      n._read = true;
      const t = lastMoment(game);
      const at = t + POINT_S;
      const face = w.roster === 'boss' ? '@boss' : w.roster === 'kev' ? '@kev' : '@player';
      const lines = [
        { say: ['📢'], ttl: ANNOUNCE_S, after: t, face: 'meeting_player' }, // to the room
        // that face, there (yours: he holds it there up to 5:00)
        { say: ['👈', face], ttl: (face === '@player' ? READ_S : POINT_S) - ANNOUNCE_S, after: t + ANNOUNCE_S, face: 'board_look' },
      ];
      if (w.roster === 'boss') {
        // his own: he goes red at the board, and the room claps him into it
        lines.push({ say: ['@boss', '😳'], ttl: 2.4, after: at, face: 'board_look' });
        for (const id of ['lin', 'kev']) {
          const o = game.npcs.find((k) => k.id === id);
          if (o) sim.speak(game, o, [{ say: ['👏'], ttl: CLAP_S, after: at }]);
        }
      } else if (w.roster === 'kev') {
        lines.push({ say: ['👉', '@kev'], ttl: 2, after: at, face: 'meeting_kev' });
        const kev = game.npcs.find((k) => k.id === 'kev');
        if (kev) sim.speak(game, kev, [{ say: ['😩'], ttl: 2.2, after: at + 0.7, face: 'board_look' }]);
      } else {
        // yours: he keeps the marker on your face; at 5:00 he waves you up in front of it
        lines.push({ say: ['👈'], ttl: 1.6, after: t + READ_S + 0.1, face: 'meeting_presenter' });
      }
      sim.speak(game, n, lines);
    },
  },
  // Lin and Kev sit down round the board: if your chair is empty, a look at it. (The reading hasn't started.)
  whereAreYou: {
    arrive(game, n, sim) {
      const p = game.player;
      if (inZone(game, game.level.meeting.room, p.x, p.y)) return;
      if ((game.level.day.meetingAt - game.clock.minute) / GAME_MIN_PER_SEC < READ_S + 1) return;
      sim.lookAt(game, n, game.level.meeting.chair, 1.6);
      sim.speak(game, n, [{ say: ['❓'], kind: 'thought', ttl: 1.6 }]);
    },
  },
};
