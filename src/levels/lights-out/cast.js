// Lights Out's three people and their hooks (level 1's cast.js and behaviours.js document the fields).
// The boss never leaves his desk on his own: only the dark gets him up. Lin makes her afternoon coffee at 3:10,
// and the old coffee machine takes the fuse with it. Kev resets fuses: a lure in index.js.
import { at, deg } from '../../config.js';
import { burst, shake } from '../../core/fx.js';

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
      s('3:00', { do: 'sit', spot: 'boss_desk' }), // facing his tray, all afternoon
    ],
  },
  {
    id: 'lin',
    icon: '☕',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'lin_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [120, 220, 205],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }),
      s('3:05', { do: 'visit', spot: 'coffee_machine', arrive: 'brew' }), // her afternoon coffee: there about 3:10
      s('3:24', { do: 'visit', spot: 'kitchen_table' }), // drinks it at the kitchen table (once it has brewed)
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
  // Lin switches on the coffee machine: it sparks, and the whole floor goes dark with it (the fuse box's door
  // flies open down the hall). If the power is already out, nothing happens.
  brew: {
    arrive(game, npc, sim) {
      if (npc._brewed) return;
      npc._brewed = true;
      const w = game.world;
      if (w.fuse !== 'on') { // no power already
        w.coffee = 'cold';
        sim.speak(game, npc, [{ say: ['❓'], kind: 'thought', ttl: 1.4 }]);
        return;
      }
      w.coffee = 'tripped';
      w.fuse = 'off';
      w.fuseBy = 'lin';
      burst(game, 'sparks', 22.5, 1.6, 16, { speed: 2.2, ttl: 0.9 });
      burst(game, 'puff', 22.5, 1.4, 5, { speed: 0.6, ttl: 1.2 });
      shake(game, 0.12, 0.3);
      game.events.emit('fuse:tripped', {});
      sim.speak(game, npc, [{ say: ['😳'], ttl: 1.6 }]);
    },
  },
  // 3:40: he empties his tray. If your letter is still in it, he reads it.
  emptyTray: {
    arrive(game, npc, sim) {
      if (npc._emptied) return;
      npc._emptied = true;
      sim.faceSpot(game, npc, 'in_front');
      const w = game.world;
      if (w.letter === 'tray' || w.letter === 'boss') sim.speak(game, npc, [{ say: ['✉️', '😠'], after: 0.6, ttl: 2.6 }]);
    },
  },
};
