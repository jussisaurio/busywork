// Saturday's people (id weekend-shift) and their hooks (cast.js and behaviours.js in level 1 document the fields). Cast order is
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
    // he keeps his eyes on the office (his cone stays on the board, so a head snapping away from it shows); a glance
    // away is never long enough to write on the board anyway
    glanceEvery: [30, 50],
    coneTint: [255, 160, 82],
    schedule: [
      s('4:00', { do: 'sit', spot: 'boss_desk' }),
      s('4:20', { do: 'visit', spot: 'copier_boss', arrive: 'photocopy' }), // his back to the room
      s('4:25', { do: 'sit', spot: 'boss_desk' }),
      // he stays at his desk until everyone gathers at 4:55 (index.js day.gatherAt): only then does he come out to the
      // board, and he's waiting for the meeting, not watching who's working (a player there early is just early)
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
      s('4:30', { do: 'say', icons: ['🐟'], kind: 'thought' }), // lunch: she gets up with it (her chair stays pushed out)
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

// The reading, READ_S s before 5:00. The boss sits (from the 4:55 gather) with his back to the board, facing the room,
// the board's marker in his hand. 📢: hear this. At ANNOUNCE_S he turns to the board: he filled it in on Monday and
// doesn't remember whom he put down, so he looks (🧐, LOOK_S), then points the marker at the face in Saturday's slot
// (it lights up: presentation.js), says whose, and holds it to 5:00. His own face: he goes red, hands out (he never
// put himself down). What happens then is the verdict's (index.js punchline).
export const READ_S = 3.4;
export const ANNOUNCE_S = 0.9;
export const LOOK_S = 0.7;
// At 5:00 with your chair empty (blamed), or his own face on the board (fail), the boss redraws the slot: your face,
// from REDRAW_AT s into the end beat, for REDRAW_S s (presentation.js draws it), then points at your chair (or glares
// at you).
export const REDRAW_AT = 0.6;
export const REDRAW_S = 0.7;
// s from now to the reading (the gather sits him down at about 4:56)
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
  // At the board, before 5:00: the boss reads out the face in Saturday's slot (see READ_S).
  readRoster: {
    state: { _read: false },
    arrive(game, n, sim) {
      const w = game.world;
      if (n._read) return;
      n._read = true;
      const t = lastMoment(game);
      const face = w.roster === 'boss' ? '@boss' : w.roster === 'kev' ? '@kev' : '@player';
      const r = t + ANNOUNCE_S; // he turns to the board: he filled it in on Monday, and only now looks to see whom
      const lines = [
        ...(t > 2 ? [{ say: ['😏'], ttl: 1.6 }] : []), // pleased with himself: the weekend's sorted
        { say: ['📢'], ttl: ANNOUNCE_S, after: t, face: 'meeting_player' }, // to the room
        { say: ['🧐'], kind: 'thought', ttl: LOOK_S, after: r, face: 'board_look' }, // whom did he put down?
        // that face, there, to 5:00 (index.js punchline: then whose it is). His own: he never put himself down.
        { say: w.roster === 'boss' ? [face, '😳'] : ['👈', face], ttl: READ_S - ANNOUNCE_S - LOOK_S + 0.2, after: r + LOOK_S, face: 'board_look' },
      ];
      sim.speak(game, n, lines);
      // His own face: he doesn't know whose it was, but Lin and Kev have looked at that board all week, and now the
      // board is plainly wrong he looks to them. They point at you: it was yours (and that's whose he draws back in at
      // 5:00: index.js punchline). (Kev says the same when it's his face, but then the board looks right, and the
      // boss believes his board over the man it names.)
      if (w.roster === 'boss') {
        for (const c of game.npcs) {
          if (c.id !== 'lin' && c.id !== 'kev') continue;
          sim.speak(game, c, [{ say: ['👉', '@player'], ttl: READ_S - ANNOUNCE_S - LOOK_S - 0.2, after: r + LOOK_S + 0.4, face: game.level.meeting.chair }]);
        }
      }
    },
  },
  // Lin and Kev sit down round the board: if your chair is empty, a look at it. (The reading hasn't started.)
  whereAreYou: {
    arrive(game, n, sim) {
      const p = game.player;
      if (inZone(game, game.level.meeting.room, p.x, p.y)) return;
      if ((game.level.day.meetingAt - game.clock.minute) / GAME_MIN_PER_SEC < READ_S + 1) return;
      sim.lookAt(game, n, game.level.meeting.chair, 2.6);
      sim.speak(game, n, [{ say: ['❓'], kind: 'thought', ttl: 2.6 }]);
    },
  },
};
