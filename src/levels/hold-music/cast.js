// Hold Music's three people and their hooks (cast.js and behaviours.js in level 1 document the fields).
import { at, deg } from '../../config.js';
import { START } from './phones.js';

const s = (time, entry) => ({ at: at(time, START), ...entry });

export const CAST = [
  {
    id: 'boss',
    icon: '@boss',
    color: '#2b3a55',
    voice: 'boss',
    meetingSpot: 'boss_desk', // 3:30 is not his call: he stays at his desk
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5],
    coneTint: [255, 160, 82],
    schedule: [
      s('3:00', { do: 'sit', spot: 'boss_desk' }), // watching the office through his glass all afternoon
    ],
  },
  {
    id: 'lin',
    icon: '@lin',
    color: '#2f8f83',
    voice: 'lin',
    meetingSpot: 'lin_desk', // the call
    vision: { fov: deg(100), radius: 8.5 },
    coneTint: [150, 230, 214],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }), // waiting by her phone (phones.js: she checks it)
      s('3:04', { do: 'sit', spot: 'kitchen_lin' }), // nerves: tea
      s('3:22', { do: 'sit', spot: 'lin_desk' }), // back in time for the call
    ],
  },
  {
    id: 'kev',
    icon: '@kev',
    color: '#5f6b3a',
    voice: 'kev',
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:00', { do: 'visit', spot: 'kitchen_kev' }), // coffee
      s('3:03', { do: 'visit', spot: 'socket_lin', arrive: 'plugIn' }), // his cable round: the socket by Lin's desk
      s('3:09', { do: 'visit', spot: 'kitchen_kev' }), // more coffee
      s('3:27', { do: 'sit', spot: 'kev_desk' }),
    ],
  },
];

export const BEHAVIOURS = {
  // Kev's cable round: he crouches at the socket; a cord lying loose goes back in.
  plugIn: {
    arrive(game, npc, sim) {
      const w = game.world;
      sim.holdFor(npc, 1.6);
      w.kevReach = game.clock.minute + 1;
      if (w.cord !== 'out') return sim.speak(game, npc, [{ say: ['👌'], kind: 'thought', ttl: 1, after: 0.8 }]);
      w.cord = 'in';
      sim.speak(game, npc, [{ say: ['❗'], ttl: 0.8 }, { say: ['👍'], after: 1, ttl: 1 }]);
      game.events.emit('cord:in', {});
    },
  },
};
