// The Interview's three people and their hooks (cast.js and behaviours.js in level 1 document the fields).
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
      s('3:03', { do: 'sit', spot: 'kitchen_lin' }), // nerves: tea
      s('3:22', { do: 'sit', spot: 'lin_notes' }), // back in time for the call, rehearsing from her notes
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
      s('3:04', { do: 'visit', spot: 'socket_lin', arrive: 'plugIn' }), // his charging spot: the socket by Lin's desk
      s('3:15', { do: 'visit', spot: 'kitchen_kev' }), // more coffee
      s('3:27', { do: 'sit', spot: 'kev_desk' }),
    ],
  },
];

export const BEHAVIOURS = {
  // Kev charges his mobile at the socket by Lin's desk (his own, on the wall by his desk, is taped off and sparks:
  // painters.js): he crouches, plugs his charger in under her plug, and stands by it scrolling until 3:15
  // (phones.js: kevCharge). Her plug lying loose is in his way: ❗, he picks it up and turns to hold it up at her
  // empty chair, 😠, then turns back and jams it into the wall (phones.js: the turn, and the jam with a spark at
  // kevJamAt, if he is still there), and plugs his charger in.
  plugIn: {
    arrive(game, npc, sim) {
      const w = game.world;
      const m = game.clock.minute;
      w.kevAt = m;
      if (w.cord !== 'out') {
        w.kevReach = m + 0.8;
        w.kevCharge = m + 0.6;
        return sim.holdFor(npc, 1.6);
      }
      w.kevLift = m + 0.35; // he picks her plug up off the floor, and holds it up until he jams it in
      w.kevJamAt = m + 1.25;
      w.kevJam = m + 1.6;
      w.kevReach = m + 2.1;
      w.kevCharge = m + 1.9;
      sim.holdFor(npc, 3.7);
      sim.speak(game, npc, [{ say: ['❗'], ttl: 0.7 }, { say: ['😠'], after: 0.75, ttl: 1.2 }]);
    },
  },
};
