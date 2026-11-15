// The Layoff List: the boss, Kev and Lin, and their hooks (cast.js and behaviours.js in level 1 document the fields).
import { at, deg } from '../../config.js';
import { burst, say } from '../../core/fx.js';

export const START = 15 * 60; // 3:00 PM
const s = (time, entry) => ({ at: at(time, START), ...entry });
const ACTS_UP_UNTIL = at('3:37.5', START); // nobody came: he thumps the desk and it works again

export const CAST = [
  {
    id: 'boss',
    icon: '@boss', // his face: who a double take in his jacket questions (play/disguise.js shows the as NPC's icon)
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
      s('3:01.4', { do: 'say', icons: ['@kev', '👋'] }), // Kev, over here
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
    icon: '@kev', // his face, the same for a double take in his hoodie
    color: '#5f6b3a',
    voice: 'kev',
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:00', { do: 'sit', spot: 'kev_desk' }),
      s('3:01.6', { do: 'visit', spot: 'pc_front', arrive: 'fixPc' }), // the boss waved him over
      // Back from the boss's stuffy glass office, hot: the hoodie comes off, over his chair's back.
      s('3:06', { do: 'sit', spot: 'kev_desk', prelude: 'pcFixed', arrive: 'shedHoodie' }),
      // Home early, once the boss is out of sight: his bag, a wave to Lin (she waves back), out past his chair,
      // where his hoodie stays.
      s('3:19', {
        do: 'leave', spot: 'elevator', prelude: ['grabBag', 'waveLin'], gone: { set: { kevGone: true }, event: 'kev:left' },
      }),
    ],
  },
  {
    id: 'lin',
    icon: '@lin',
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
    arrive(game, npc, sim) {
      game.world.pc = 'kev';
      sim.speak(game, npc, [{ say: ['🔧'] }]); // the one who fixes things
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
      w.listUpAt = game.clock.minute; // the list comes up on his screen: it pops out big, your face framed (list.js)
      say(game, 'player', ['😨'], { kind: 'thought', ttl: 1.8 }); // that's me on it
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
      sim.speak(game, npc, [{ say: ['😠'] }, { say: ['@kev', '👋'], after: 1.4 }, { say: ['@kev', '❓'], kind: 'thought', after: 3.2 }]);
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
  // Back at his desk at about 3:08.5, hot (🥵, sweat flying): the hoodie comes off and hangs over his chair's back.
  shedHoodie: {
    arrive(game, npc, sim) {
      const w = game.world;
      if (w.hoodie !== 'kev') return;
      w.hoodie = 'chair'; // drawn over his chair's back (presentation.js)
      burst(game, 'sweat', npc.x, npc.y - 0.6, 10, { speed: 1.0 });
      sim.speak(game, npc, [{ say: ['🥵'] }]);
      sim.holdFor(npc, 1.0);
      game.events.emit('kev:hoodieOff', {});
    },
  },
  // 3:19: he gets up with his bag (presentation.js POSES), leaving the hoodie on his chair.
  grabBag: {
    spot: 'kev_desk',
    pending: (npc) => !npc._bag,
    arrive(game, npc, sim) {
      npc._bag = true;
      game.world.kevUp = true;
      sim.holdFor(npc, 0.8);
      game.events.emit('kev:up', {});
    },
  },
  // On his way out, Kev waves goodbye in front of Lin's desk, going home; she waves back. Now she knows he's gone.
  waveLin: {
    spot: 'kev_bye',
    pending: (npc) => !npc._waved,
    arrive(game, npc, sim) {
      npc._waved = true;
      sim.speak(game, npc, [{ say: ['👋', '🏠'] }]); // bye, I'm off home
      const lin = game.npcs.find((n) => n.id === 'lin');
      if (lin?.active && !lin.override) sim.speak(game, lin, [{ say: ['👋'], after: 0.9 }]); // bye
      sim.holdFor(npc, 1.8);
      game.events.emit('kev:bye', {});
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
