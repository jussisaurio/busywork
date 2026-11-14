// The meeting's NPC mechanics: the engine's generic lure, hunt and door (src/sim/mechanics/*, where each field is
// documented) set up as Kev's projector repair, Lin's sandwich hunt and the boss's keycard lockout.
// Order is behaviour: the sim checks each list in this order.

import { at } from '../../config.js';

// Lures (level.lures): a world condition pulls an NPC over to deal with it.
export const LURES = [
  { // Kev repairs a broken projector whenever he is on the floor (even walking out to the elevator: he turns back).
    npc: 'kev',
    when: (w) => w.projector === 'broken',
    override: 'alerted',
    plan: 'fix',
    label: 'fix projector',
    spot: 'projector',
    react: { wait: 0.4, says: [{ say: ['🔧', '❗'], kind: 'alert' }], event: 'kev:alerted' },
    work: {
      override: 'fixing',
      minutes: 5, // game minutes to repair it
      progress: 'fixProgress',
      start: { set: { projector: 'fixing' }, event: 'projector:fixing' },
      done: { set: { projector: 'ok' }, event: 'projector:fixed', says: [{ say: ['👍'] }] },
    },
  },
];

// Hunts (level.hunts): an NPC searches for something until she finds it or gives up. Started by a behaviour hook
// (behaviours.js: Lin finding the fridge empty).
export const HUNTS = [
  { // Lin walks the kitchen and the open office looking for her sandwich.
    npc: 'lin',
    override: 'hunting',
    plan: 'hunt',
    label: 'hunt sandwich',
    route: 'lin_hunt',
    look: { angle: 1.25, time: 1.4 }, // ~72 deg each side: right, left, back
    start: {
      event: 'sandwich:missing',
      says: [{ say: ['🥪', '❓'], kind: 'thought', ttl: 1.4 }, { say: ['😠'], after: 1.4 }],
      wait: 1.8, // standing at the empty fridge
    },
    until: at('3:24'), // covers the boss's restroom walk
    // She has it back, or she saw the mustard on you and knows who ate it.
    found: (game) => game.world.sandwich === 'lin' || game.world.linKnows,
    end: { says: [{ say: ['😤'] }] },
  },
];
