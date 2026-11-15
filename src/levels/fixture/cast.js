// The fixture's two people and their hooks (cast.js and behaviours.js in level 1 document the fields).
import { at, deg } from '../../config.js';

const s = (time, entry) => ({ at: at(time), ...entry });

export const CAST = [
  {
    id: 'doreen',
    icon: '📋',
    color: '#8a3f6b', // plum cardigan
    voice: 'doreen',
    meetingSpot: 'party_doreen',
    meetingArrive: 'leadSong',
    vision: { fov: deg(110), radius: 8 },
    coneTint: [240, 150, 200],
    schedule: [
      s('2:30', { do: 'sit', spot: 'doreen_desk' }), // she does not leave her desk for anything but an emergency
      s('2:45', { do: 'say', icons: ['🎂', '🎶'], kind: 'thought' }),
    ],
  },
  {
    id: 'gus',
    icon: '🧁',
    color: '#c27b2c', // flour-dusted orange
    voice: 'gus',
    meetingSpot: 'party_gus',
    meetingArrive: 'notMine',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [250, 200, 120],
    schedule: [
      s('2:30', { do: 'sit', spot: 'gus_desk' }), // admiring his cake
      s('2:42', { do: 'say', icons: ['🕯️', '❓'], kind: 'thought' }),
      s('2:43', { do: 'away', spot: 'door' }), // out for candles
      s('2:49', { do: 'sit', spot: 'gus_desk', arrive: 'checkCake' }),
    ],
  },
];

export const BEHAVIOURS = {
  // Back with the candles: is his cake still there?
  checkCake: {
    state: { _checked: false },
    arrive(game, npc, sim) {
      if (npc._checked) return;
      npc._checked = true;
      if (game.world.cake === 'stand') sim.speak(game, npc, [{ say: ['🕯️', '🎂', '😊'] }]);
      else sim.speak(game, npc, [{ say: ['🎂', '❓'], kind: 'thought', ttl: 1.2 }, { say: ['😱'], after: 1.2 }]);
    },
  },
  // At the cake: Doreen starts the song for whoever her calendar says, if there's a cake to sing over.
  leadSong: {
    state: { _led: false },
    arrive(game, npc, sim) {
      if (npc._led) return;
      npc._led = true;
      const w = game.world;
      if (w.cake === 'eaten') return sim.speak(game, npc, [{ say: ['🎂', '❓', '😩'] }]);
      sim.faceSpot(game, npc, w.birthday === 'gus' ? 'party_gus' : 'birthday_chair');
      sim.speak(game, npc, [{ say: ['🎶', '🎂', '👉'] }]);
    },
  },
  // Gus, on finding out it's his birthday.
  notMine: {
    state: { _noted: false },
    arrive(game, npc, sim) {
      if (npc._noted || game.world.birthday !== 'gus' || game.world.cake === 'eaten') return;
      npc._noted = true;
      sim.speak(game, npc, [{ say: ['🤨', '❓'], after: 1.5 }]);
    },
  },
};
