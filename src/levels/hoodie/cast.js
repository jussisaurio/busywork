// Kev's Hoodie: the boss, Kev and Lin, and their hooks (cast.js and behaviours.js in level 1 document the fields).
import { at, deg } from '../../config.js';

export const START = 15 * 60 + 5; // 3:05 PM
const s = (time, entry) => ({ at: at(time, START), ...entry });

export const CAST = [
  {
    id: 'boss',
    icon: '👔',
    color: '#2b3a55',
    voice: 'boss',
    meetingSpot: 'boss_desk',
    meetingArrive: 'sendReview',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5],
    coneTint: [255, 160, 82],
    schedule: [
      s('3:05', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }),
      s('3:12', { do: 'away', spot: 'restroom', prelude: 'leaveDesk' }), // his computer sits there, unlocked
      s('3:26', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }),
    ],
  },
  {
    id: 'kev',
    icon: '🔧',
    color: '#5f6b3a',
    voice: 'kev',
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:05', { do: 'sit', spot: 'kev_desk' }),
      s('3:13', { do: 'say', icons: ['🥵'], kind: 'thought' }),
      // Home, once the boss is out of sight: a wave to Lin (she waves back), the hoodie off onto his chair, out.
      s('3:19', {
        do: 'leave', spot: 'elevator', prelude: ['waveLin', 'shedHoodie'], gone: { set: { kevGone: true }, event: 'kev:left' },
      }),
    ],
  },
  {
    id: 'lin',
    icon: '👓',
    color: '#2f8f83',
    voice: 'lin',
    meetingSpot: 'lin_desk',
    vision: { fov: deg(100), radius: 9.5 }, // the whole boss's office, coat rack included
    coneTint: [150, 230, 214],
    schedule: [
      s('3:05', { do: 'sit', spot: 'lin_desk' }),
      s('3:32', { do: 'away', spot: 'restroom' }), // once the boss is back at his desk
      s('3:40', { do: 'sit', spot: 'lin_desk' }),
    ],
  },
];

export const BEHAVIOURS = {
  // At his computer: nobody else touches it.
  atDesk: {
    arrive(game) {
      game.world.pc = 'boss';
    },
  },
  // He gets up and leaves it unlocked.
  leaveDesk: {
    spot: 'boss_desk',
    pending: (npc) => !npc._leftDesk,
    arrive(game, npc) {
      npc._leftDesk = true;
      if (game.world.pc === 'boss') game.world.pc = 'free';
    },
  },
  // Too hot: on his way out, the hoodie comes off and stays on his chair.
  shedHoodie: {
    spot: 'kev_desk',
    pending: (npc) => !npc._shed,
    arrive(game, npc, sim) {
      npc._shed = true;
      const w = game.world;
      w.hoodie = 'chair';
      w.items.push({ type: 'hoodie', x: npc.x, y: npc.y });
      sim.holdFor(npc, 1.0);
      sim.speak(game, npc, [{ say: ['😮‍💨'], after: 0.6 }]);
      game.events.emit('kev:hoodieOff', {});
    },
  },
  // On his way out, Kev waves goodbye in front of Lin's desk; she waves back. Now she knows he's gone.
  waveLin: {
    spot: 'kev_bye',
    pending: (npc) => !npc._waved,
    arrive(game, npc, sim) {
      npc._waved = true;
      sim.speak(game, npc, [{ say: ['🎒', '👋'] }]);
      const lin = game.npcs.find((n) => n.id === 'lin');
      if (lin?.active && !lin.override) sim.speak(game, lin, [{ say: ['👋'], after: 0.9 }]);
      sim.holdFor(npc, 1.8);
      game.events.emit('kev:bye', {});
    },
  },
  // 3:42: he sits down to send it. Is it still there?
  sendReview: {
    arrive(game, npc, sim) {
      game.world.pc = 'boss';
      if (npc._sent) return;
      npc._sent = true;
      if (game.world.review === 'queued') {
        sim.speak(game, npc, [{ say: ['📧', '😈'] }]);
        game.events.emit('review:sending', {});
      } else {
        sim.speak(game, npc, [{ say: ['📧', '❓'], kind: 'thought', ttl: 1.4 }, { say: ['🤷'], after: 1.4 }]);
        game.events.emit('review:missing', {});
      }
    },
  },
};
