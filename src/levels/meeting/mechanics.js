// The meeting's NPC mechanics: the engine's generic lure, hunt and door (src/sim/mechanics/*, where each field is
// documented) set up as Kev's projector repair, Lin's sandwich hunt and the boss's keycard lockout.
// Order is behaviour: the sim checks each list in this order.

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
