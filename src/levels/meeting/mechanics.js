// The meeting's NPC mechanics: the engine's generic lure and hunt (src/sim/mechanics/*, where each field is
// documented) set up as Kev's projector repair, Lin's sandwich hunt and the boss's hunt for the cup. (The keycard
// lockout happens downstairs, out of sight: clocks.js.)
// Order is behaviour: the sim checks each list in this order.

import { at } from '../../config.js';
import { npcSees } from '../../game/perception.js';
import { speak } from '../../sim/override.js';

const SEES_CUP = 3.5; // tiles: how close the hunting boss must be to spot the cup on a desk or the machine

// The hunting boss spots the cup where it lies (not in your hand: that's the rules' business, items.js; not on your
// desk: that's put down's, and he catches you). On Kev's desk: Kev did it. On the machine: back where it belongs.
// Not while you stand beside it: then it's anybody's guess whose it is, and he keeps looking.
const NEAR_CUP = 2.5; // tiles
function cupFound(game, npc) {
  const it = game.world.items.find((i) => i.type === 'mug');
  if (!it || it.spot === 'my_desk') return false;
  const p = game.player;
  if (Math.hypot(it.x - p.x, it.y - p.y) < NEAR_CUP) return false;
  if (Math.hypot(it.x - npc.x, it.y - npc.y) > SEES_CUP || !npcSees(game, npc, it.x, it.y)) return false;
  const kev = it.spot === 'kev_desk';
  speak(game, npc, kev ? [{ say: ['☕', '❗'], kind: 'alert' }, { say: ['😠', '@kev'], after: 1.2 }] : [{ say: ['☕', '🤷'] }]);
  game.events.emit('mug:found', { spot: it.spot });
  return true;
}

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
// (behaviours.js: Lin finding the fridge empty; the boss looking in on a dead projector).
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
  { // The boss, having seen the projector (behaviours.js peek), looks for the cup the coffee came from.
    npc: 'boss',
    override: 'hunting',
    plan: 'mughunt',
    label: 'hunt mug',
    route: 'mug_hunt',
    look: { angle: 1.1, time: 1.2 },
    start: {
      event: 'boss:mugHunt',
      says: [{ say: ['📽️', '💥'], kind: 'thought', ttl: 1.3 }, { say: ['☕', '❓'], kind: 'thought', after: 1.3, ttl: 1.4 }],
      wait: 2.4, // staring in at the sparks
    },
    until: at('3:34'), // gives up in time for his smoke
    found: cupFound,
  },
];
