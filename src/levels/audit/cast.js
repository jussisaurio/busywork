// The audit's four people and their hooks (cast.js and behaviours.js in level 1 document the fields).
// The day runs from 3:00 to the sign-off at about 3:46; every time below is on that clock (at(time, START)).
//
// The half hour before the audit is the level: everyone's routine opens and closes windows.
//   3:08-3:16  the boss smokes in the lobby. Lin sees into his office through the glass, and he sees her desk.
//   3:10-3:22  Kev is out for lunch; back, he stops by your desk first (👋), and takes his laptop if it's there.
//   3:13-3:24  Lin is in the restroom. Her desk is ticked second: an empty desk is a ❌, and she misses it (💻❓).
//   3:24-3:41  Kev is in the kitchen; back, by your desk again: just after the auditor has ticked it.
//   3:25       the auditor is out of the lift, coffee at the hallway machine, clipboard. 3:30 he starts ticking:
//              the boss's desk, Lin's (she gets coffee 3:35-3:38 and walks right past you), yours, Kev's.
//   3:33-      the boss, ticked off, goes for his smoke.
import { at as atClock, deg } from '../../config.js';
import { itemOn } from '../../sim/mechanics/putdown.js';
import { SPOTS } from './spots.js';

export const START = 15 * 60; // 3:00 PM
const at = (time) => atClock(time, START);
const s = (time, entry) => ({ at: at(time), ...entry });
const KEV_BACK = '3:37.4'; // out of the kitchen: at your desk just after the auditor has ticked it

export const CAST = [
  {
    id: 'auditor',
    icon: '🕵️',
    color: '#6b6f78', // grey suit
    voice: 'auditor',
    meetingSpot: 'audit_you', // he signs off at your desk
    meetingArrive: 'signOff',
    vision: { fov: deg(90), radius: 7 },
    glanceEvery: [9999, 9999], // he looks where his list says, and nowhere else
    coneTint: [235, 235, 245],
    schedule: [
      s('3:00', { do: 'away', spot: 'elevator' }), // on his way up
      s('3:25', { do: 'visit', spot: 'coffee', anim: 'coffee' }), // out of the lift; the audit starts at 3:30 (index.js)
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
      s('3:00', { do: 'sit', spot: 'boss_desk' }), // back to the glass, facing his window
      s('3:08', { do: 'visit', spot: 'smoke', anim: 'smoking' }),
      s('3:16', { do: 'sit', spot: 'boss_desk', arrive: 'bossCheck' }),
      s('3:33', { do: 'visit', spot: 'smoke', anim: 'smoking' }), // his desk is ticked off: smoke
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
      s('3:00', { do: 'sit', spot: 'lin_desk' }), // she sees into the boss's office through the glass
      s('3:13', { do: 'away', spot: 'restroom' }),
      s('3:19', { do: 'sit', spot: 'lin_desk', arrive: 'checkLaptop' }),
      s('3:35', { do: 'visit', spot: 'coffee' }), // coffee, while he ticks off her desk
      s('3:38', { do: 'sit', spot: 'lin_desk', arrive: 'checkLaptop' }), // back down the hallway
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
      s('3:00', { do: 'sit', spot: 'kev_desk' }),
      s('3:09.5', { do: 'say', icons: ['👋'], kind: 'speech' }), // off to lunch
      s('3:10', { do: 'away', spot: 'elevator' }), // his laptop stays on his desk
      s('3:18', { do: 'sit', spot: 'kev_desk', prelude: 'kevStops', arrive: 'kevSits' }), // via your desk
      s('3:24', { do: 'away', spot: 'kitchen' }), // his laptop stays on his desk
      s(KEV_BACK, { do: 'sit', spot: 'kev_desk', prelude: 'kevStopsAgain', arrive: 'kevSits' }), // via your desk
    ],
  },
];

const on = (w, spot) => w.items.find((i) => i.spot === spot);

// Kev's stop at your desk on his way back to his own (once per return: flag names the return).
const stopBy = (flag) => ({
  spot: 'hallway_mid',
  pending: (npc) => !npc[flag],
  arrive(game, npc, sim) {
    npc[flag] = true;
    const w = game.world;
    const it = on(w, 'your_desk');
    if (it?.type === 'laptop_kev') {
      w.items = w.items.filter((i) => i !== it);
      npc.carry = 'laptop_kev';
      w.laptop_kev = npc.id;
      sim.speak(game, npc, [{ say: ['💻', '❗'] }]);
      game.events.emit('kev:fetched', {});
    } else {
      sim.speak(game, npc, [{ say: ['👋'] }]);
    }
  },
});

export const BEHAVIOURS = {
  // Back at her desk: where's her laptop? (She takes it back if she sees you with it: index.js ITEMS.)
  checkLaptop: {
    arrive(game, npc, sim) {
      if (on(game.world, 'lin_desk')) return;
      sim.speak(game, npc, [{ say: ['💻', '❓'], kind: 'thought', ttl: 1.6 }]);
      game.events.emit('lin:missing', {});
    },
  },
  // Back from his smoke: where's his laptop?
  bossCheck: {
    arrive(game, npc, sim) {
      if (on(game.world, 'boss_desk')) return;
      sim.speak(game, npc, [{ say: ['💻', '❓'], kind: 'thought', ttl: 1.6 }]);
    },
  },
  // Kev, back from lunch and back from the kitchen, stops by your desk first: a wave, or his laptop, which he takes.
  kevStops: stopBy('_lunch'),
  kevStopsAgain: stopBy('_coffee'),
  // At his own desk: his laptop goes back where it lives.
  kevSits: {
    arrive(game, npc, sim) {
      const w = game.world;
      if (npc.carry !== 'laptop_kev' || on(w, 'kev_desk')) {
        if (!on(w, 'kev_desk')) sim.speak(game, npc, [{ say: ['💻', '❓'], kind: 'thought', ttl: 1.6 }]);
        return;
      }
      npc.carry = null;
      w.items.push(itemOn(SPOTS, 'kev_desk', 'laptop_kev'));
      w.laptop_kev = 'kev_desk';
      game.events.emit('kev:plugged', {});
    },
  },
  // At your desk for the sign-off: a nod if the audit passed.
  signOff: {
    arrive(game, npc, sim) {
      if (npc._signed) return;
      npc._signed = true;
      sim.faceSpot(game, npc, 'player_desk');
      if (game.world.audited) sim.speak(game, npc, [{ say: ['😊'] }]);
    },
  },
};
