// The audit's four people and their hooks (cast.js and behaviours.js in level 1 document the fields).
// The day runs from 3:00 to the sign-off at about 3:47.7; every time below is on that clock (at(time, START)).
//
// The half hour before the audit is the level: everyone's routine opens and closes windows.
//   3:08-3:16  the boss smokes in the lobby. Lin sees into his office through the glass, and he sees her desk.
//   3:10-3:22  Kev goes to lunch. He packs his laptop, sets it down on your desk to wave, and leaves without it;
//              back, he finds it there (💻🤦: silly him) and takes it home. Every loop: he's like that.
//   3:13-3:19  Lin is in the restroom. Her desk is ticked second: an empty desk is a ❌.
//   Back at their desks, the boss and Lin miss a laptop that's gone (💻❓). The boss looks for his along the hallway
//   till 3:24; seen on your desk, it goes home in his hands, 😠 (index.js HUNTS). Lin, back at 3:24, stays put.
//   3:24-3:37  Kev has a coffee in the kitchen, in view. Back, he waits a step short of your desk while the auditor
//              is at it, if his laptop lies there again: just after the tick he takes it (💻🤦) to his own desk.
//   3:25       the auditor is out of the lift, coffee at the hallway machine, clipboard. 3:30 he starts ticking:
//              the boss's desk, Lin's (she goes for a coffee in the kitchen at 3:35), yours, Kev's. A ❌ makes
//              him angry; he finishes his list all the same and fires you at the sign-off.
//   3:33-      the boss, ticked off, goes for his smoke. He and Lin stay out through the sign-off (index.js clockFor).
import { at as atClock, deg } from '../../config.js';
import { itemOn } from '../../sim/mechanics/putdown.js';
import { setOverride } from '../../sim/override.js';
import { SPOTS } from './spots.js';

export const START = 15 * 60; // 3:00 PM
const at = (time) => atClock(time, START);
const s = (time, entry) => ({ at: at(time), ...entry });
const KEV_BACK = '3:36.5'; // out of the kitchen: a step short of your desk before the auditor gets to it
export const KEV_GO = at('3:39.9'); // on to his desk via yours (index.js clockFor holds him for your desk's tick)

export const CAST = [
  {
    id: 'auditor',
    icon: '@auditor',
    color: '#6b6f78', // grey suit
    voice: 'auditor',
    meetingSpot: 'audit_you', // he signs off at your desk
    meetingArrive: 'signOff',
    vision: { fov: deg(90), radius: 7 },
    glanceEvery: [9999, 9999], // he looks where his list says, and nowhere else
    coneTint: [235, 235, 245],
    schedule: [
      s('3:00', { do: 'away', spot: 'elevator' }), // on his way up
      s('3:25', { do: 'visit', spot: 'coffee', anim: 'coffee' }), // out of the lift; the audit is at 3:30 (index.js)
    ],
  },
  {
    id: 'boss',
    icon: '@boss',
    color: '#2b3a55', // navy suit
    voice: 'boss',
    meetingSpot: 'boss_desk',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5],
    coneTint: [255, 160, 82],
    schedule: [
      s('3:00', { do: 'sit', spot: 'boss_desk' }), // back to the glass, facing his window
      s('3:08', { do: 'visit', spot: 'smoke', anim: 'smoking' }),
      s('3:16', { do: 'sit', spot: 'boss_desk', arrive: 'bossCheck' }),
      s('3:33', { do: 'visit', spot: 'smoke', anim: 'smoking' }), // his desk is ticked off: smoke
    ],
  },
  {
    id: 'lin',
    icon: '@lin',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'lin_desk',
    vision: { fov: deg(100), radius: 8.5 },
    coneTint: [150, 230, 214],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }), // she sees into the boss's office through the glass
      s('3:13', { do: 'away', spot: 'restroom' }),
      s('3:19', { do: 'sit', spot: 'lin_desk', arrive: 'linCheck' }),
      s('3:35', { do: 'visit', spot: 'pot', anim: 'coffee' }), // a coffee in the kitchen, while he ticks off her desk
    ],
  },
  {
    id: 'kev',
    icon: '@kev',
    color: '#5f6b3a', // olive hoodie
    voice: 'kev',
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:00', { do: 'sit', spot: 'kev_desk' }),
      s('3:10', { do: 'away', spot: 'elevator', prelude: ['kevPacks', 'kevLeavesIt'] }), // lunch: forgets his laptop
      s('3:18', { do: 'sit', spot: 'kev_desk', prelude: 'kevStops', arrive: 'kevSits' }), // via your desk
      s('3:24', { do: 'visit', spot: 'kitchen', anim: 'coffee' }), // a coffee in the kitchen; his laptop stays home
      s(KEV_BACK, { do: 'visit', spot: 'kev_wait' }), // waits for the auditor to be done at your desk
      { at: KEV_GO, do: 'sit', spot: 'kev_desk', prelude: 'kevStopsAgain', arrive: 'kevSits' }, // via your desk
    ],
  },
];

const on = (w, spot) => w.items.find((i) => i.spot === spot);

// An NPC carrying his laptop puts it down where it lives. If something else lies there (you put it there), a
// stranger's laptop puzzles him (💻❓) and his own goes into his drawer, out of sight: nobody holds a laptop where the
// auditor can see it (DESIGN.md: the card's rule binds everyone).
function homeLaptop(game, npc, type, spot, sim) {
  const w = game.world;
  if (npc.carry !== type) return false;
  npc.carry = null;
  if (on(w, spot)) {
    w[type] = 'drawer';
    sim.speak(game, npc, [{ say: ['💻', '❓'], kind: 'thought', ttl: 1.6 }]);
    game.events.emit('laptop:drawer', { type, by: npc.id });
    return true;
  }
  w.items.push(itemOn(SPOTS, spot, type));
  w[type] = spot;
  game.events.emit('laptop:home', { type, by: npc.id });
  return true;
}

// Back at his desk: his laptop, home if he carries it; gone, he wonders, then (hunts) looks for it once (index.js
// HUNTS). Lin doesn't look: she's back at 3:24 and the auditor is on the floor at 3:25, where he'd see her carry it.
const deskCheck = (type, spot, hunts) => ({
  state: { _hunted: false },
  arrive(game, npc, sim) {
    if (homeLaptop(game, npc, type, spot, sim) || on(game.world, spot)) return;
    sim.speak(game, npc, [{ say: ['💻', '❓'], kind: 'thought', ttl: 1.6 }]);
    game.events.emit('laptop:missing', { by: npc.id });
    if (!hunts || npc._hunted) return;
    npc._hunted = true;
    sim.startHunt(game, npc);
  },
});

// Kev at the end of your desk, back from lunch or from the kitchen: his laptop on it, he blames himself (💻🤦) and
// takes it. He never thinks anyone moved it: he's the one who leaves it about. flag: which return this is.
const stopBy = (flag, expects) => ({
  spot: 'hallway_mid',
  state: { [flag]: false },
  pending: (npc) => !npc[flag],
  arrive(game, npc, sim) {
    npc[flag] = true;
    const w = game.world;
    const it = on(w, 'your_desk');
    if (it?.type === 'laptop_kev') {
      w.items = w.items.filter((i) => i !== it);
      npc.carry = 'laptop_kev';
      w.laptop_kev = npc.id;
      sim.speak(game, npc, [{ say: ['💻', '🤦'] }]);
      game.events.emit('kev:fetched', {});
    } else if (expects && npc.carry !== 'laptop_kev') {
      sim.speak(game, npc, [{ say: ['💻', '❓'], kind: 'thought', ttl: 1.6 }]); // not where he left it
    } else {
      sim.speak(game, npc, [{ say: ['👋'] }]);
    }
  },
});

export const BEHAVIOURS = {
  bossCheck: deskCheck('laptop_boss', 'boss_desk', true),
  linCheck: deskCheck('laptop_lin', 'lin_desk', false),

  // Kev's lunch: his laptop off his desk into his hands, then down on yours while he waves, and off he goes.
  kevPacks: {
    spot: 'kev_desk',
    state: { _packed: false },
    pending: (npc) => !npc._packed,
    arrive(game, npc, sim) {
      npc._packed = true;
      const w = game.world;
      const it = on(w, 'kev_desk');
      if (it?.type !== 'laptop_kev') return;
      w.items = w.items.filter((i) => i !== it);
      npc.carry = 'laptop_kev';
      w.laptop_kev = npc.id;
      game.events.emit('kev:packed', {});
    },
  },
  kevLeavesIt: {
    spot: 'hallway_mid',
    state: { _left: false },
    pending: (npc) => !npc._left,
    arrive(game, npc, sim) {
      npc._left = true;
      const w = game.world;
      if (npc.carry === 'laptop_kev' && !on(w, 'your_desk')) {
        npc.carry = null;
        w.items.push(itemOn(SPOTS, 'your_desk', 'laptop_kev'));
        w.laptop_kev = 'your_desk';
        game.events.emit('kev:forgot', {});
      }
      sim.speak(game, npc, [{ say: ['👋'] }]);
    },
  },
  kevStops: stopBy('_lunch', true),
  kevStopsAgain: stopBy('_coffee', false),
  // At his own desk: his laptop goes back where it lives.
  kevSits: {
    arrive(game, npc, sim) {
      if (homeLaptop(game, npc, 'laptop_kev', 'kev_desk', sim) || on(game.world, 'kev_desk')) return;
      sim.speak(game, npc, [{ say: ['💻', '❓'], kind: 'thought', ttl: 1.6 }]);
    },
  },

  // A ❌: angry (index.js INSPECTIONS fail.says), a look at you if it's your desk, then on down his list. Picks the
  // inspection up again where it stopped (its internals: sim/mechanics/inspection.js check/build), keeping the
  // desks he ticked before the ❌, so a laptop moved off one still counts as moved.
  auditGoesOn: {
    arrive(game, npc, sim, { index }) {
      const w = game.world;
      w.crossed = [...w.crossed, index];
      game.events.emit('audit:crossed', { index });
      if (index === 2) sim.lookAt(game, npc, 'player_desk', 1.2);
      const insp = game.level.inspections[0];
      if (index + 1 >= insp.checks.length) return;
      const passed = [];
      insp.checks.forEach((c, j) => {
        if (j >= index || !c.record || !w[c.record]) return;
        const item = w.items.find((i) => i.spot === c.spot && i.type === w[c.record]);
        passed.push({ index: j, item: item ?? { spot: null }, spot: c.spot, moved: !item });
      });
      npc._insp = { data: insp, i: index + 1, passed, sim };
      setOverride(npc, insp.override);
    },
  },

  // At your desk for the sign-off: four ticks, a smile; a ❌ on his list, he points you to the door.
  signOff: {
    state: { _signed: false },
    arrive(game, npc, sim) {
      if (npc._signed) return;
      npc._signed = true;
      sim.faceSpot(game, npc, 'player_desk');
      const w = game.world;
      if (['atBoss', 'atLin', 'atYou', 'atKev'].every((r) => w[r])) {
        sim.speak(game, npc, [{ say: ['😊'] }]);
        game.events.emit('audit:passed', {});
      } else {
        const fired = [{ say: ['💻', '❌'], kind: 'thought', ttl: 1.2 }, { say: ['😠', '👉', '@player'], after: 1.2 }];
        sim.speak(game, npc, fired);
        game.events.emit('audit:fired', {});
      }
    },
  },
};
