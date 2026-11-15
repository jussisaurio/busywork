// The audit's four people and their hooks (cast.js and behaviours.js in level 1 document the fields).
// The day runs from 3:15 to 3:40; every time below is on that clock (at(time, START)).
import { at as atClock, deg } from '../../config.js';

export const START = 15 * 60 + 15; // 3:15 PM
const at = (time) => atClock(time, START);
const s = (time, entry) => ({ at: at(time), ...entry });

export const CAST = [
  {
    id: 'auditor',
    icon: '🕵️',
    color: '#6b6f78', // grey suit
    voice: 'auditor',
    meetingSpot: 'audit_you', // he signs off at your desk
    meetingArrive: 'signOff',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [235, 235, 245],
    schedule: [
      s('3:15', { do: 'away', spot: 'elevator' }), // on his way up
      s('3:20', { do: 'visit', spot: 'audit_you' }), // out of the lift (the audit starts now: index.js INSPECTIONS)
    ],
  },
  {
    id: 'boss',
    icon: '👔',
    color: '#2b3a55', // navy suit
    voice: 'boss',
    meetingSpot: 'boss_desk',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5],
    coneTint: [255, 160, 82],
    schedule: [
      s('3:15', { do: 'sit', spot: 'boss_desk' }),
      s('3:25', { do: 'say', icons: ['🚬', '❓'], kind: 'thought' }), // his desk is ticked off: smoke
      s('3:25.5', { do: 'visit', spot: 'smoke', anim: 'smoking' }),
      s('3:37', { do: 'sit', spot: 'boss_desk' }),
    ],
  },
  {
    id: 'lin',
    icon: '👓',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'lin_desk',
    vision: { fov: deg(100), radius: 8.5 },
    coneTint: [150, 230, 214],
    schedule: [
      s('3:15', { do: 'sit', spot: 'lin_desk' }), // she sees into the boss's office through the glass
      s('3:24', { do: 'away', spot: 'restroom' }),
      s('3:31', { do: 'sit', spot: 'lin_desk', arrive: 'checkLaptop' }),
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
      s('3:15', { do: 'sit', spot: 'kev_desk' }),
      s('3:15.5', { do: 'say', icons: ['🎒', '👋'], kind: 'speech' }),
      s('3:16', { do: 'leave', spot: 'elevator', gone: { set: { kevGone: true }, event: 'kev:left' } }), // his laptop stays
    ],
  },
];

export const BEHAVIOURS = {
  // Back at her desk: where's her laptop? (She takes it back if she sees you with it: index.js ITEMS.)
  checkLaptop: {
    arrive(game, npc, sim) {
      if (npc._checked) return;
      npc._checked = true;
      if (game.world.items.some((i) => i.spot === 'lin_desk')) return;
      sim.speak(game, npc, [{ say: ['💻', '❓'], kind: 'thought', ttl: 1.4 }]);
    },
  },
  // At your desk for the sign-off: a nod if the audit passed.
  signOff: {
    arrive(game, npc, sim) {
      if (npc._signed) return;
      npc._signed = true;
      sim.faceSpot(game, npc, 'player_desk');
      if (game.world.audited) sim.speak(game, npc, [{ say: ['🧾', '✍️'] }]);
    },
  },
};
