// The meeting's carryable items (level.items), keyed by item type (player.held, floor items' type).
//   icon        what people say for it, in bubbles (speech: 🤤☕, 😠🥪)
//   draw        how it is drawn in a hand, on the floor and in the HUD: an engine thing (render/things.js THINGS)
//               or a painter of ours (painters.js). Never an emoji (DESIGN.md "Visual language")
//   place       the world field that says where it is: set to 'player' on pick up, 'dropped' on drop,
//               'eaten' when eaten, and the confiscator's id when contraband is picked up off the floor
//               (coffee has none: world.coffee is the pot, and the poured cup is just held)
//   edible      { leaves }: the engine offers eat_<type> while you hold it (hold E; play/interactions.js), sneaky
//               to its owner; leaves: what it leaves on you, a config.js MARKS name (player.smeared) or null
//   contraband  the NPC (id) who catches you holding it, and pockets it if he sees it on the floor
//   owner       { id, when?(npc), says?, reclaim?(game, npc) }: who takes it back on sight (play/rules.js).
//               when: only while this holds does the owner know it's theirs. says: what they say on catching
//               you just carrying it ({ say: icons, after?: seconds }). reclaim: what taking it back does
//               (default: they carry it off, '<type>:confiscated' { by })
//   put         seconds: putting it down on a spot is a sneaky timed action, not an instant one (putdown.js)
//   keep        it leaves your hand only by a put: no drop, and assigned work sends you to your desk holding it
import { sandwich } from './painters.js';

export const ITEMS = {
  coffee: {
    icon: '☕',
    draw: 'cup', // full and steaming
    // Only once he has found the pot empty (☕❓😩) does Kev know the cup is his. A desperate man: 🤤☕ … 😌
    owner: {
      id: 'kev',
      when: (npc) => npc.wants === 'coffee',
      says: [{ say: ['🤤', '☕'] }, { say: ['😌'], after: 1.3 }],
    },
  },
  keycard: { icon: '🪪', draw: 'card', place: 'keycard', contraband: 'boss' }, // an ID card on a lanyard
  // The cup, empty, once its coffee is all over the projector (interactions.js spill_coffee). It's evidence: you
  // can't just let it fall (keep), and setting it down anywhere is a furtive 0.8 s (put). Once the boss has seen
  // the projector (behaviours.js peek) the cup in your hand is all the proof he needs: he catches you with it.
  // Not at the meeting table, nor locked out: at 4:00 the verdict judges it instead (verdict.js).
  mug: {
    icon: '☕',
    draw: 'mug', // the same cup, empty: a dried ring inside, a drip down its side
    place: 'mug',
    put: 0.8,
    keep: true,
    owner: { id: 'boss', when: (npc) => !!npc._knows && npc.override !== 'meeting' && npc.override !== 'lockedOut' },
  },
  sandwich: {
    icon: '🥪',
    draw: sandwich,
    place: 'sandwich',
    edible: { leaves: 'splat' }, // the mustard down your front: Lin's evidence (roles.js)
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
