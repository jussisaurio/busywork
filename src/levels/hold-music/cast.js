// Hold Music's three people, their phones and their hooks (cast.js and behaviours.js in level 1 document the fields).
import { at, deg } from '../../config.js';

export const START = 15 * 60; // 3:00 PM
const s = (time, entry) => ({ at: at(time, START), ...entry });

// The phones: who owns each, and the spot its ring comes from (the noise; earshot is measured from here).
export const PHONES = {
  lin: { owner: 'lin', at: 'lin_side' },
  boss: { owner: 'boss', at: 'boss_phone' },
  kev: { owner: 'kev', at: 'kev_side' },
  kitchen: { owner: null, at: 'kitchen_phone' },
};

// On his way to a phone, or on hold on it (the lures' overrides, index.js).
export const onPhone = (npc) => /^(to|on)_\w+_phone$/.test(npc.override ?? '');

export const CAST = [
  {
    id: 'boss',
    icon: '👔',
    color: '#2b3a55',
    voice: 'boss',
    meetingSpot: 'boss_hover', // at 3:30 he pulls up a chair by Lin's desk to listen in
    meetingArrive: 'pickUp',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5],
    coneTint: [255, 160, 82],
    schedule: [
      s('3:00', { do: 'sit', spot: 'boss_desk' }), // watching the office through his glass all afternoon
      s('3:20', { do: 'say', icons: ['🕞', '👓'], kind: 'thought' }),
    ],
  },
  {
    id: 'lin',
    icon: '👓',
    color: '#2f8f83',
    voice: 'lin',
    meetingSpot: 'lin_desk', // the call
    meetingArrive: 'pickUp',
    vision: { fov: deg(100), radius: 8.5 },
    coneTint: [150, 230, 214],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }),
      s('3:03', { do: 'say', icons: ['📞', '🕞', '😬'], kind: 'thought' }),
      s('3:10', { do: 'visit', spot: 'kitchen_lin' }), // nerves: tea
      s('3:26', { do: 'sit', spot: 'lin_desk' }), // back in time for the call
    ],
  },
  {
    id: 'kev',
    icon: '🔧',
    color: '#5f6b3a',
    voice: 'kev',
    meetingSpot: 'kev_desk', // not his call: he just goes back to his desk
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:00', { do: 'visit', spot: 'kitchen_kev' }), // coffee
      s('3:08', { do: 'visit', spot: 'cable_lin', arrive: 'plugIn' }), // his cable round: under Lin's desk
      s('3:14', { do: 'visit', spot: 'kitchen_kev' }), // more coffee
      s('3:27', { do: 'sit', spot: 'kev_desk' }),
    ],
  },
];

// Lin is on her way to her desk and nothing holds her up: the boss leaves her phone to her.
const COMING = 6; // tiles
function linComing(game) {
  const lin = game.npcs.find((n) => n.id === 'lin');
  const s = game.level.spots.lin_desk;
  return lin.active && !onPhone(lin) && Math.hypot(lin.x - (s.x + 0.5), lin.y - (s.y + 0.5)) < COMING;
}

export const BEHAVIOURS = {
  // Kev's cable round: anything unplugged under Lin's desk goes back in.
  plugIn: {
    arrive(game, npc, sim) {
      if (game.world.cord !== 'out') return sim.speak(game, npc, [{ say: ['🔌', '👌'], kind: 'thought', ttl: 1 }]);
      game.world.cord = 'in';
      sim.speak(game, npc, [{ say: ['🔌', '❓'], ttl: 1 }, { say: ['🔌', '👍'], after: 1.1 }]);
      game.events.emit('cord:in', {});
    },
  },
  // 3:30: the interviewer calls Lin's phone, and the first of Lin or the boss to reach it settles it.
  pickUp: {
    arrive(game, npc, sim) {
      if (npc._picked) return;
      npc._picked = true;
      const w = game.world;
      sim.faceSpot(game, npc, 'lin_side');
      if (w.interview !== 'due') { // someone got there first
        if (npc.id === 'lin' && w.interview === 'boss') sim.speak(game, npc, [{ say: ['😱'] }]);
        else if (npc.id === 'boss' && w.interview === 'lin') sim.speak(game, npc, [{ say: ['👀'], kind: 'thought' }]);
        else if (w.interview === 'busy' || w.interview === 'dead') sim.speak(game, npc, [{ say: ['📞', '❓'], kind: 'thought' }]);
        return;
      }
      if (w.cord === 'out') { // it never rings
        w.interview = 'dead';
        sim.speak(game, npc, [{ say: ['📞', '⏳'], kind: 'thought', ttl: 1.2 }, { say: ['📞', '❓'], after: 1.3, kind: 'thought' }]);
      } else if (w.line_lin) { // someone is on her line: the interviewer gets the busy tone
        w.interview = 'busy';
        sim.speak(game, npc, [{ say: ['📞', '⏳'], kind: 'thought', ttl: 1.2 }, { say: ['📵', '😱'], after: 1.3 }]);
      } else if (npc.id === 'boss' && linComing(game)) { // she's nearly here: it's her call
        sim.speak(game, npc, [{ say: ['👀'], kind: 'thought' }]);
        return;
      } else if (npc.id === 'lin') {
        w.interview = 'lin';
        sim.speak(game, npc, [{ say: ['📞', '😊'] }, { say: ['🙋', '💼'], after: 1.3 }]);
      } else { // Lin isn't here: the boss takes it for her
        w.interview = 'boss';
        sim.speak(game, npc, [{ say: ['📞', '😊'] }, { say: ['👓', '💪', '💯'], after: 1.2 }, { say: ['👍', '😉'], after: 1.4 }]);
      }
      game.events.emit(`interview:${w.interview}`, { by: npc.id });
    },
  },
};
