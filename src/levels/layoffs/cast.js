// The Layoff List: the boss, Kev and Lin, and their hooks (cast.js and behaviours.js in level 1 document the fields).
// Their day in prose is premise.md "Who does what". The beats that are not schedule entries (the phones, Lin's
// glances, the coffee) are index.js clockFor's.
import { deg, GAME_MIN_PER_SEC } from '../../config.js';
import { OFFICE_PEOPLE, scheduler } from '../office/cast.js';
import { say } from '../../core/fx.js';

export const START = 15 * 60; // 3:00 PM
const s = scheduler(START);
export const SECS = (n) => n * GAME_MIN_PER_SEC; // real seconds as game minutes

export const CAST = [
  {
    ...OFFICE_PEOPLE.boss,
    meetingSpot: 'boss_desk',
    meetingArrive: 'sendList',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5],
    schedule: [
      s('3:00', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }), // his monitor black (index.js glitch): he bangs on it
      s('3:00.3', { do: 'say', icons: ['😠'] }),
      s('3:00.8', { do: 'sit', spot: 'boss_desk', arrive: 'callKev' }), // ☎️ Kev's desk: it rings behind Lin
      s('3:03.6', { do: 'visit', spot: 'boss_aside' }), // he stands over Kev while Kev plugs the cable back in
      s('3:08.3', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }),
      s('3:10', { do: 'away', spot: 'restroom', prelude: 'leaveDesk' }), // he locks his screen: the list is on it
      // Back from the restroom about 3:22. If you pulled his plug while he was out, the screen is dead: he types his
      // password into the black screen (✱✱✱✱✱ ⏎), stares, thumps it, calls Kev, who went home, then gives up and goes for a coffee
      // (index.js clockFor, the coffee lure). Left alone, it keeps working and he works on until 3:42.
      s('3:16.5', { do: 'sit', spot: 'boss_desk', arrive: 'backAtDesk' }),
      s('3:35', { do: 'sit', spot: 'boss_desk', arrive: 'atDesk' }), // back with his coffee
    ],
  },
  {
    ...OFFICE_PEOPLE.kev,
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
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
    ...OFFICE_PEOPLE.lin,
    meetingSpot: 'lin_desk',
    vision: { fov: deg(100), radius: 9.5 }, // the whole boss's office, his chair and his screen
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
  w.ringBy = null; // the caller who has one says so (index.js call_kev)
  w.ringUntil = secs == null ? null : game.clock.minute + SECS(secs);
  // Set now, not on the next frame (index.js bossClock): the ring's noise asks ringLook on its first sound, and a
  // false there drops it for good: Lin would never turn round.
  w.ringFrom = game.clock.minute;
  w.ringLook = true;
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
  // Done: the plug goes home, the screen blinks on and the list comes up (it pops out big: list.js). Lin reads it over
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
  // About 3:22, back in his chair from the restroom: he types his password and the padlock goes. If you pulled his
  // monitor's plug while he was out, he types it blind into the black screen (✱✱✱✱✱ ⏎), stares (🖥️❓), thumps it
  // (😠); then he calls Kev's desk
  // (index.js clockFor: the ring, the ❓, coffee).
  backAtDesk: {
    arrive(game, npc, sim) {
      const w = game.world;
      const st = (npc._lay ??= {});
      w.pc = 'boss';
      w.locked = false;
      if (!w.glitch || st.actedUp || w.coffee !== 'none') return;
      st.actedUp = true;
      const now = game.clock.minute;
      // His password, typed into the black screen: five asterisks, one clack each (index.js bossClock), then a hard
      // Enter. The PC behind the dark monitor logs him in; he can't see it. He stares (🖥️❓), thumps it (😠).
      w.loginUntil = now + SECS(1.8); // typing arms (presentation.js POSES)
      w.thumpFrom = now + SECS(3.1); // after that, the bang arms at the black screen again
      st.keys = [0.2, 0.42, 0.62, 0.86, 1.06].map((k) => now + SECS(k));
      st.enterAt = now + SECS(1.55);
      st.callAt = now + SECS(4.6);
      const star = '#pwstar';
      sim.speak(game, npc, [
        { say: [star, star, star, star, star], ttl: 1.45 },
        { say: ['#enterkey'], ttl: 0.9, after: 1.45 }, // (each `after` counts from now: the queue ticks together)
        { say: ['🖥️', '❓'], kind: 'thought', ttl: 1.3, after: 2.35 },
        { say: ['😠'], ttl: 1.0, after: 3.6 },
      ]);
      game.events.emit('pc:actsUp', {});
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
  // 3:42: he opens the attachment one last time and counts the faces (the sheet pops out big: list.js, w.countAt).
  // Yours on it: he ticks it (✔️). Yours gone: one short? He frowns, and it's Friday: he shrugs (📋🤨🤷). Then coat on
  // (🧥📧), and at 3:45 he clicks send (the sheet flies off his screen, big: list.js sending).
  // His screen still dead (nobody plugged it in): he sends the same email from his mobile (📱📧), the screen still black.
  sendList: {
    arrive(game, npc, sim) {
      const w = game.world;
      w.pc = 'boss';
      const dead = !!w.glitch;
      if (w.check !== 'done') w.locked = false; // told: he locked it after putting you back, and sends it locked
      // Lin named you: he glares across the floor at your desk (whatever he says, it waits for Monday).
      sim.lookAt(game, npc, game.player.named ? 'player_desk' : 'screen', 2.6);
      if (game.player.named) sim.speak(game, npc, [{ say: ['👉', '@player', '😠'], after: 0.9 }]);
      else if (dead) sim.speak(game, npc, [{ say: ['🧥', '📱', '📧'], after: 0.9 }]);
      else {
        w.countAt = game.clock.minute; // the sheet pops out: three faces, or four with yours
        const on = w.list === 'on';
        sim.speak(game, npc, [
          { say: on ? ['📋', '@player', '✔️'] : ['📋', '🤨', '🤷'], after: 0.9 },
          { say: ['🧥', '📧'], after: 2.2 },
        ]);
        game.events.emit('boss:headCount', { on });
      }
      game.events.emit('boss:packsUp', {});
    },
  },
};
