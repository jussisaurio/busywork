// Weekend Shift's people and their hooks (cast.js and behaviours.js in level 1 document the fields). Cast order is
// behaviour: the sim updates them in this order.
import { at, deg, GAME_MIN_PER_SEC } from '../../config.js';

const START = 16 * 60;
const s = (time, entry) => ({ at: at(time, START), ...entry });

export const CAST = [
  {
    id: 'boss',
    icon: '👔',
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
    icon: '👓',
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
    icon: '🔧',
    color: '#5f6b3a', // olive hoodie
    voice: 'kev',
    meetingSpot: 'meeting_kev',
    meetingArrive: 'handSheet',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('4:00', { do: 'sit', spot: 'kev_desk' }), // he never leaves his tray, unless something needs fixing
      s('4:52', { do: 'visit', spot: 'kev_tray', arrive: 'takeSheet' }), // the sign-off sheet, for the boss
    ],
  },
];

// s until just before 5:00: he has usually been at the board since 4:50, so the gather sits him down at 4:55
const lastMoment = (game) => Math.max(0, (game.level.day.meetingAt - game.clock.minute) / GAME_MIN_PER_SEC - 2.4);

export const BEHAVIOURS = {
  // The boss at the copier: it works, or it doesn't.
  photocopy: {
    arrive(game, n, sim) {
      const c = game.world.copier;
      if (c === 'jammed' || c === 'fixing') sim.speak(game, n, [{ say: ['😠'] }]);
    },
  },
  // Lin heats her fish: she carries it there and back, and it turns in the microwave meanwhile (presentation.js).
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
  // 4:52: Kev takes the sign-off sheet out of his tray, for the boss.
  takeSheet: {
    arrive(game, n, sim) {
      const w = game.world;
      if (w.sheet !== 'tray') return;
      w.sheet = 'kev';
      sim.holdFor(n, 0.6);
      game.events.emit('sheet:taken', {});
    },
  },
  // At the board: the boss reads out the Saturday name. His own, Kev's (off the sheet), or yours.
  readRoster: {
    state: { _read: false },
    arrive(game, n, sim) {
      const w = game.world;
      w.rosterLocked = true;
      if (n._read) return;
      n._read = true;
      const t = lastMoment(game);
      if (w.roster === 'boss') {
        sim.faceSpot(game, n, 'meeting_presenter');
        sim.speak(game, n, [{ say: ['❓'], kind: 'thought', ttl: 1.6, after: t }, { say: ['😳'], after: t + 1.6 }]);
      } else if (w.sheetName === 'kev') {
        sim.faceSpot(game, n, 'meeting_kev'); // and points (presentation.js)
        sim.speak(game, n, [{ say: ['❗'], after: t }]);
      } else {
        sim.faceSpot(game, n, 'meeting_player');
        sim.speak(game, n, [{ say: ['❗'], after: t }]);
      }
    },
  },
  // Kev hands over the sheet, and reads whose name is on it.
  handSheet: {
    state: { _handed: false },
    arrive(game, n, sim) {
      if (n._handed) return;
      n._handed = true;
      const w = game.world;
      if (w.sheetName === 'kev' && w.roster !== 'boss') sim.speak(game, n, [{ say: ['😳'], after: Math.max(2.2, lastMoment(game) + 1.2) }]);
    },
  },
};
