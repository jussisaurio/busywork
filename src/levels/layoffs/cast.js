// The Layoff List: the boss, Kev and Lin, and their hooks (cast.js and behaviours.js in level 1 document the fields).
// Their day in prose is premise.md "Who does what". The beats that are not schedule entries (the phones, Lin's
// glances, the coffee) are index.js clockFor's.
import { at, deg, GAME_MIN_PER_SEC } from '../../config.js';
import { say } from '../../core/fx.js';

export const START = 15 * 60; // 3:00 PM
const s = (time, entry) => ({ at: at(time, START), ...entry });
export const SECS = (n) => n * GAME_MIN_PER_SEC; // real seconds as game minutes

export const CAST = [
  {
    id: 'boss',
    icon: '@boss',
    color: '#2b3a55',
    voice: 'boss',
    meetingSpot: 'boss_desk',
    meetingArrive: 'sendList',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5],
    coneTint: [255, 160, 82],
    schedule: [
      s('3:00', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }), // static on his screen (index.js glitch): he bangs on it
      s('3:00.3', { do: 'say', icons: ['😠'] }),
      s('3:00.8', { do: 'sit', spot: 'boss_desk', arrive: 'callKev' }), // ☎️ Kev's desk: it rings behind Lin
      s('3:03.6', { do: 'visit', spot: 'boss_aside' }), // he stands over Kev while Kev plugs the cable back in
      s('3:08.3', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }),
      s('3:11', { do: 'away', spot: 'restroom', prelude: 'leaveDesk' }), // he locks his screen: the list is on it
      s('3:19', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }),
      s('3:26', { do: 'sit', spot: 'boss_desk', arrive: 'actsUp' }), // static again; he calls Kev, who went home
      s('3:31', { do: 'sit', spot: 'cable', arrive: 'selfFix' }), // nobody came: he kneels at the cable himself
      s('3:32', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }),
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
      s('3:00', { do: 'sit', spot: 'kev_desk' }),
      s('3:01.6', { do: 'sit', spot: 'cable', prelude: 'pickUp', arrive: 'fixPc' }), // the boss called: he goes in
      s('3:08', { do: 'sit', spot: 'kev_desk', prelude: 'pcFixed' }),
      // Home early, once the boss has left his office for the restroom: his bag, a goodbye to Lin (she waves back).
      s('3:14.5', {
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
    vision: { fov: deg(100), radius: 9.5 }, // the whole boss's office, his chair and his screen
    coneTint: [150, 230, 214],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }), // all day: her phone and Kev's are index.js clockFor's
    ],
  },
];

const npcById = (game, id) => game.npcs.find((n) => n.id === id);
const free = (n) => n?.active && !n.override;

// Ring Kev's desk phone (index.js noises 'phone:ring': Lin turns round to it while it rings). secs: how long, or
// until Kev picks up (null).
export function ringKev(game, secs = null) {
  const w = game.world;
  w.ringing = true;
  w.ringUntil = secs == null ? null : game.clock.minute + SECS(secs);
  game.events.emit('phone:ring', {});
}

export const BEHAVIOURS = {
  // At his computer: nobody else touches it, and it isn't locked.
  atDesk: {
    state: { _lay: null }, // index.js clockFor's per-NPC script state
    arrive(game) {
      game.world.pc = 'boss';
      game.world.locked = false;
    },
  },
  // 3:00.8: he phones Kev's desk.
  callKev: {
    arrive(game, npc, sim) {
      if (npc._lay?.called) return;
      (npc._lay ??= {}).called = true;
      sim.speak(game, npc, [{ say: ['☎️', '@kev'] }]);
      game.world.bossPhoneUntil = game.clock.minute + SECS(2.2); // the handset at his ear (presentation.js POSES)
      ringKev(game);
    },
  },
  // He gets up for the restroom and locks his screen: the list is open on it.
  leaveDesk: {
    spot: 'boss_desk',
    pending: (npc) => !npc._lay?.leftDesk,
    arrive(game, npc) {
      (npc._lay ??= {}).leftDesk = true;
      game.world.locked = true;
      if (game.world.pc === 'boss') game.world.pc = 'free';
      game.events.emit('pc:locked', {});
    },
  },
  // 3:01.6: Kev picks up his ringing phone, listens, and goes.
  pickUp: {
    spot: 'kev_desk',
    pending: (npc) => !npc._lay?.picked,
    arrive(game, npc, sim) {
      (npc._lay ??= {}).picked = true;
      game.world.ringing = false;
      game.world.kevCall = true; // the handset at his ear (presentation.js POSES), until he walks off
      sim.holdFor(npc, 1.5);
      sim.speak(game, npc, [{ say: ['👍'], after: 0.6 }]);
    },
  },
  // Kev kneels at the boss's cable (the plug half out: presentation.js) while the boss watches.
  fixPc: {
    arrive(game, npc, sim) {
      game.world.pc = 'kev';
      sim.speak(game, npc, [{ say: ['🔌'], after: 1.2 }]);
      game.events.emit('kev:fixing', {});
    },
  },
  // Done: the plug goes home, the static clears and the list comes up (it pops out big: list.js). Lin reads it over
  // the boss's shoulder (index.js clockFor: 😨, 😌, a look at you).
  pcFixed: {
    spot: 'cable',
    pending: (npc) => !npc._lay?.fixed,
    arrive(game, npc, sim) {
      (npc._lay ??= {}).fixed = true;
      const w = game.world;
      w.glitch = false;
      w.listUpAt = game.clock.minute;
      w.linReadAt = game.clock.minute;
      say(game, 'player', ['😨'], { kind: 'thought', ttl: 1.8 }); // that's me on it
      if (w.pc === 'kev') w.pc = 'boss';
      const b = npcById(game, 'boss');
      if (free(b)) sim.speak(game, b, [{ say: ['😊'] }]);
      game.events.emit('pc:fixed', {});
    },
  },
  // 3:26: the static is back. He bangs on it; then he calls Kev's desk (index.js clockFor: the ring, the ❓).
  actsUp: {
    arrive(game, npc, sim) {
      const w = game.world;
      const st = (npc._lay ??= {});
      if (st.actedUp || w.coffee !== 'none') return;
      st.actedUp = true;
      st.callAt = game.clock.minute + SECS(1.6);
      w.glitch = true;
      sim.speak(game, npc, [{ say: ['😠'] }]);
      game.events.emit('pc:actsUp', {});
    },
  },
  // 3:31: nobody came. He kneels at his cable himself and pushes the plug home.
  selfFix: {
    arrive(game, npc, sim) {
      const w = game.world;
      if (!w.glitch) return;
      w.glitch = false;
      sim.speak(game, npc, [{ say: ['🔌'] }]);
      sim.holdFor(npc, 1.0);
      game.events.emit('pc:selfFixed', {});
    },
  },
  // About 3:14.5: he gets up with his bag (presentation.js POSES).
  grabBag: {
    spot: 'kev_desk',
    pending: (npc) => !npc._lay?.bag,
    arrive(game, npc, sim) {
      (npc._lay ??= {}).bag = true;
      game.world.kevUp = true;
      sim.holdFor(npc, 0.8);
      game.events.emit('kev:up', {});
    },
  },
  // On his way out, Kev says goodbye beside Lin's desk, going home; she waves back and watches him go.
  waveLin: {
    spot: 'kev_bye',
    pending: (npc) => !npc._lay?.waved,
    arrive(game, npc, sim) {
      (npc._lay ??= {}).waved = true;
      sim.speak(game, npc, [{ say: ['👋', '🏠'] }]); // bye, I'm off home
      const lin = npcById(game, 'lin');
      if (free(lin)) {
        sim.lookAt(game, lin, 'kev_bye', 3.2); // and watches him to the door
        sim.speak(game, lin, [{ say: ['👋'], after: 0.9 }]);
      }
      sim.holdFor(npc, 1.8);
      game.events.emit('kev:bye', {});
    },
  },
  // 3:42: he packs up for the weekend at his desk, coat on (🧥), and at 3:45 clicks send on the email he left open,
  // without opening the attachment (the list flies off his screen: list.js sending). Nobody reads the list again.
  sendList: {
    arrive(game, npc, sim) {
      const w = game.world;
      w.pc = 'boss';
      w.glitch = false;
      w.locked = false;
      // Lin named you: he glares across the floor at your desk (whatever he says, it waits for Monday).
      sim.lookAt(game, npc, game.player.named ? 'player_desk' : 'screen', 2.6);
      if (game.player.named) sim.speak(game, npc, [{ say: ['👉', '@player', '😠'], after: 0.9 }]);
      else sim.speak(game, npc, [{ say: ['🧥', '📧'], after: 0.9 }]);
      game.events.emit('boss:packsUp', {});
    },
  },
};
