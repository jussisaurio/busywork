// Lights Out's three people and their hooks (level 1's cast.js and behaviours.js document the fields).
// The boss never leaves his desk on his own: only the dark gets him up. Lin heats her lunch at 3:10 (and the
// microwave takes the fuse with it). Kev resets fuses: a lure in index.js.
import { at, deg } from '../../config.js';

export const START = 15 * 60; // 3:00 PM
const s = (time, entry) => ({ at: at(time, START), ...entry });

export const CAST = [
  {
    id: 'boss',
    icon: '👔',
    color: '#2b3a55', // navy suit
    voice: 'boss',
    meetingSpot: 'boss_desk',
    meetingArrive: 'emptyTray',
    vision: { fov: deg(150), radius: 8 }, // nothing on his desk escapes him in the light
    coneTint: [255, 160, 82],
    schedule: [
      s('3:00', { do: 'sit', spot: 'boss_desk' }), // facing his tray
      s('3:25', { do: 'say', icons: ['📥', '🤔'], kind: 'thought' }),
    ],
  },
  {
    id: 'lin',
    icon: '🍲',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'lin_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [120, 220, 205],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }),
      s('3:04', { do: 'say', icons: ['🍲', '❓'], kind: 'thought' }),
      s('3:05', { do: 'visit', spot: 'microwave', arrive: 'nukeLunch' }), // about 3:10 at the microwave
      s('3:24', { do: 'visit', spot: 'kitchen_table', arrive: 'eatLunch' }),
      s('3:31', { do: 'sit', spot: 'lin_desk' }),
    ],
  },
  {
    id: 'kev',
    icon: '🔧',
    color: '#5f6b3a', // olive hoodie
    voice: 'kev',
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:00', { do: 'sit', spot: 'kev_desk' }),
    ],
  },
];

export const BEHAVIOURS = {
  // Lin's lunch goes in for ten minutes on full power, and the whole floor goes with it.
  nukeLunch: {
    arrive(game, npc, sim) {
      if (npc._nuked) return;
      npc._nuked = true;
      const w = game.world;
      if (w.fuse !== 'on') { // no power already
        w.lunch = 'cold';
        sim.speak(game, npc, [{ say: ['🍲', '❓'], kind: 'thought', ttl: 1.4 }]);
        return;
      }
      w.lunch = 'nuked';
      w.fuse = 'off';
      w.fuseBy = 'lin';
      game.events.emit('fuse:tripped', {});
      sim.speak(game, npc, [{ say: ['♨️', '💥'], ttl: 1.2 }, { say: ['💡', '❓'], kind: 'thought', after: 1.4, ttl: 1.4 }]);
    },
  },
  eatLunch: {
    arrive(game, npc, sim) {
      if (npc._ate) return;
      npc._ate = true;
      if (game.world.lunch === 'nuked') {
        game.world.lunch = 'eaten';
        sim.speak(game, npc, [{ say: ['🍲', '😋'], ttl: 1.4 }]);
      } else sim.speak(game, npc, [{ say: ['🍲', '🥶'], ttl: 1.4 }]);
    },
  },
  // 3:40: he empties his tray.
  emptyTray: {
    arrive(game, npc, sim) {
      if (npc._emptied) return;
      npc._emptied = true;
      sim.faceSpot(game, npc, 'in_front');
      const w = game.world;
      if (w.letter === 'tray' || w.letter === 'boss') sim.speak(game, npc, [{ say: ['📥'], kind: 'thought', ttl: 1.2 }, { say: ['✉️', '😠'], after: 1.6, ttl: 2.2 }]);
      else sim.speak(game, npc, [{ say: ['📥'], kind: 'thought', ttl: 1.2 }, { say: ['📭', '🤷'], after: 1.6, ttl: 2.2 }]);
    },
  },
};
