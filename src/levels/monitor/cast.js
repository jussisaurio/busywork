// The Monitor's two people and their hooks (cast.js and behaviours.js in level 1 document the fields).
import { at, deg } from '../../config.js';

export const START = 15 * 60 + 20; // 3:20 PM: the day's start (level.day.start), what at() counts from
export const t = (time) => at(time, START);
const s = (time, entry) => ({ at: t(time), ...entry });

export const CAST = [
  {
    id: 'bob',
    icon: '💂',
    color: '#2f3d5c', // navy uniform
    voice: 'bob',
    meetingSpot: 'bob_desk', // the mail is none of his business: he stays at his desk
    meetingArrive: 'stayPut',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [9999, 9999], // eyes on the lobby and the screen, never anywhere else
    coneTint: [130, 170, 245],
    schedule: [
      s('3:20', { do: 'sit', spot: 'bob_desk' }),
    ],
  },
  {
    id: 'lin',
    icon: '📬',
    color: '#2f8f8a', // teal cardigan
    voice: 'lin',
    meetingSpot: 'pigeonholes',
    meetingArrive: 'collectMail',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [120, 220, 200],
    schedule: [
      s('3:20', { do: 'sit', spot: 'lin_desk' }),
      s('3:40', { do: 'say', icons: ['📬', '🎶'], kind: 'thought' }),
    ],
  },
];

export const BEHAVIOURS = {
  // Bob at the gather: already where he wants to be.
  stayPut: {
    arrive() {},
  },
  // Lin at the pigeonholes: she takes whatever is in them and reads out the name.
  collectMail: {
    arrive(game, npc, sim) {
      if (npc._collected) return;
      npc._collected = true;
      const w = game.world;
      if (w.parcel !== 'shelf') {
        sim.speak(game, npc, [{ say: ['📭', '❓'], kind: 'thought' }]);
        game.events.emit('parcel:missing', {});
        return;
      }
      w.parcel = 'lin';
      game.events.emit('parcel:collected', { for: w.parcelFor });
      if (w.parcelFor === 'bob') {
        sim.faceSpot(game, npc, 'bob_desk');
        sim.speak(game, npc, [{ say: ['📦', '👉', '💂'] }]);
        const bob = game.npcs.find((n) => n.id === 'bob');
        if (bob) sim.speak(game, bob, [{ say: ['😳'], kind: 'thought', after: 1.4 }]);
      } else {
        sim.speak(game, npc, [{ say: ['📦', '😏'] }]);
      }
    },
  },
};
