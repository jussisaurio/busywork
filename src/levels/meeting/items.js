// The meeting's carryable items (level.items), keyed by item type (player.held, floor items' type).
//   icon        how it shows in hand, on the floor and in bubbles
//   place       the world field that says where it is: set to 'player' on pick up, 'dropped' on drop,
//               'eaten' when eaten, and the confiscator's id when contraband is picked up off the floor
//               (coffee has none: world.coffee is the pot, and the poured cup is just held)
//   edible      the engine offers eat_<type> while you hold it (play/interactions.js): you get the
//               mustard (player.smeared) and it is sneaky to its owner
//   contraband  the NPC (id) who catches you holding it, and pockets it if he sees it on the floor
//   owner       { id, when?(npc), says?, reclaim?(game, npc) }: who takes it back on sight (play/rules.js).
//               when: only while this holds does the owner know it's theirs. says: what they say on catching
//               you just carrying it ({ say: icons, after?: seconds }). reclaim: what taking it back does
//               (default: they carry it off, '<type>:confiscated' { by })
//   put         seconds: putting it down on a spot is a sneaky timed action, not an instant one (putdown.js)
//   keep        it leaves your hand only by a put: no drop, and assigned work sends you to your desk holding it
export const ITEMS = {
  coffee: {
    icon: '☕',
    // Only once he has found the pot empty (☕❓😩) does Kev know the cup is his. A desperate man: 🤤☕ … 😌
    owner: {
      id: 'kev',
      when: (npc) => npc.wants === 'coffee',
      says: [{ say: ['🤤', '☕'] }, { say: ['😌'], after: 1.3 }],
    },
  },
  keycard: { icon: '🪪', place: 'keycard', contraband: 'boss' },
  // The cup, empty, once its coffee is all over the projector (interactions.js spill_coffee). It's evidence: you
  // can't just let it fall (keep), and setting it down anywhere is a furtive 0.8 s (put). Once the boss has seen
  // the projector (behaviours.js peek) the cup in your hand is all the proof he needs: he catches you with it.
  // Not at the meeting table, nor locked out: at 4:00 the verdict judges it instead (verdict.js).
  mug: {
    icon: '☕',
    place: 'mug',
    put: 0.8,
    keep: true,
    owner: { id: 'boss', when: (npc) => !!npc._knows && npc.override !== 'meeting' && npc.override !== 'lockedOut' },
  },
  sandwich: {
    icon: '🥪',
    place: 'sandwich',
    edible: true,
    // Only Lin knows it's hers: to anyone else, taking or eating it is just lunch.
    owner: {
      id: 'lin',
      says: [{ say: ['😠', '🥪'] }],
      // Before lunch she puts it back in the fridge; mid-hunt she has found it, and that's the end of the hunt.
      reclaim(game, npc) {
        game.world.sandwich = npc.override === 'hunting' ? 'lin' : 'fridge';
        game.events.emit('sandwich:returned', {});
      },
    },
  },
};
