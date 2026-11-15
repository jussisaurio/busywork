// The Layoff List: the boss, Kev and Lin, and their hooks (cast.js and behaviours.js in level 1 document the fields).
import { at, deg } from '../../config.js';
import { burst } from '../../core/fx.js';

export const START = 15 * 60; // 3:00 PM
const s = (time, entry) => ({ at: at(time, START), ...entry });
const ACTS_UP_UNTIL = at('3:37.5', START); // nobody came: he thumps the desk and it works again

export const CAST = [
  {
    id: 'boss',
    icon: '👔',
    color: '#2b3a55',
    voice: 'boss',
    meetingSpot: 'boss_desk',
    meetingArrive: 'sendList',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5],
    coneTint: [255, 160, 82],
    schedule: [
      s('3:00', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }), // his screen is acting up (index.js glitch)
      s('3:00.8', { do: 'say', icons: ['😠'] }),
      s('3:01.4', { do: 'say', icons: ['👋'] }), // to Kev: over here
      s('3:02', { do: 'visit', spot: 'boss_aside' }), // he stands aside while Kev fixes it
      s('3:06.5', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }),
      s('3:12', { do: 'away', spot: 'restroom', prelude: 'leaveDesk' }), // his computer sits there, unlocked
      s('3:26', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }),
      s('3:35', { do: 'sit', spot: 'boss_desk', arrive: 'actsUp' }), // again: he waves for Kev, who went home
      s('3:37.5', { do: 'sit', spot: 'boss_desk', arrive: 'thump' }),
    ],
  },
  {
    id: 'kev',
    icon: '🧥', // his hoodie: what a double take questions (play/disguise.js shows the as NPC's icon)
    color: '#5f6b3a',
    voice: 'kev',
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:00', { do: 'sit', spot: 'kev_desk' }),
      s('3:01.6', { do: 'visit', spot: 'pc_front', arrive: 'fixPc' }), // the boss waved him over
      s('3:06', { do: 'sit', spot: 'kev_desk', prelude: 'pcFixed' }),
      // Home early, once the boss is out of sight: a wave to Lin (she waves back), the hoodie off onto his chair, out.
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
      s('3:00', { do: 'sit', spot: 'lin_desk' }),
      s('3:32', { do: 'away', spot: 'restroom' }), // once the boss is back at his desk
      s('3:40', { do: 'sit', spot: 'lin_desk' }),
    ],
  },
];

const boss = (game) => game.npcs.find((n) => n.id === 'boss');

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
  // 3:01: Kev at the boss's computer, typing (presentation.js POSES), the boss watching.
  fixPc: {
    arrive(game) {
      game.world.pc = 'kev';
      game.events.emit('kev:fixing', {});
    },
  },
  // Done: the static clears, the boss is pleased and takes his chair back; Kev goes back to his desk.
  pcFixed: {
    spot: 'pc_front',
    pending: (npc) => !npc._fixed,
    arrive(game, npc, sim) {
      npc._fixed = true;
      const w = game.world;
      w.glitch = false;
      if (w.pc === 'kev') w.pc = 'boss';
      const b = boss(game);
      if (b?.active && !b.override) sim.speak(game, b, [{ say: ['😊'] }]);
      game.events.emit('pc:fixed', {});
    },
  },
  // 3:35: the static is back. He waves for Kev, and nobody comes (unless "Kev" does).
  actsUp: {
    arrive(game, npc, sim) {
      const w = game.world;
      if (w.fix !== 'none' || game.clock.minute >= ACTS_UP_UNTIL || npc._actedUp) return;
      npc._actedUp = true;
      w.glitch = true;
      sim.speak(game, npc, [{ say: ['😠'] }, { say: ['👋'], after: 1.4 }, { say: ['❓'], kind: 'thought', after: 3.2 }]);
      game.events.emit('pc:actsUp', {});
    },
  },
  // 3:37.5: nobody came. A thump on the desk, and it works again.
  thump: {
    arrive(game, npc, sim) {
      const w = game.world;
      if (!w.glitch) return;
      w.glitch = false;
      sim.speak(game, npc, [{ say: ['😠'] }]);
      game.events.emit('pc:thumped', {});
    },
  },
  // On his way out, Kev waves goodbye in front of Lin's desk; she waves back. Now she knows he's gone.
  waveLin: {
    spot: 'kev_bye',
    pending: (npc) => !npc._waved,
    arrive(game, npc, sim) {
      npc._waved = true;
      sim.speak(game, npc, [{ say: ['👋'] }]);
      const lin = game.npcs.find((n) => n.id === 'lin');
      if (lin?.active && !lin.override) sim.speak(game, lin, [{ say: ['👋'], after: 0.9 }]);
      sim.holdFor(npc, 1.8);
      game.events.emit('kev:bye', {});
    },
  },
  // Then, hot (sweat), the hoodie comes off and stays on his chair.
  shedHoodie: {
    spot: 'kev_desk',
    pending: (npc) => !npc._shed,
    arrive(game, npc, sim) {
      npc._shed = true;
      const w = game.world;
      w.hoodie = 'chair';
      w.items.push({ type: 'hoodie', x: npc.x, y: npc.y });
      burst(game, 'sweat', npc.x, npc.y - 0.6, 6, { speed: 0.8 });
      sim.holdFor(npc, 1.0);
      game.events.emit('kev:hoodieOff', {});
    },
  },
  // 3:42: he sits down to send it at 3:45 (then the list flies off his screen: list.js sending).
  sendList: {
    arrive(game) {
      game.world.pc = 'boss';
      game.world.glitch = false;
    },
  },
};
