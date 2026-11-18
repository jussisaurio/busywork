// The meeting's carryable items (level.items), keyed by item type (player.held, floor items' type).
//   icon        what people say for it, in bubbles (speech: 🤤☕, 😠🥪)
//   draw        how it is drawn in a hand, on the floor and in the HUD: an engine thing (render/things.js THINGS)
//               or a painter of ours (painters.js). Never an emoji (DESIGN.md "Visual language")
//   place       the world field that says where it is: set to 'player' on pick up, 'dropped' on drop,
//               'eaten' when eaten, and the taker's id when it is taken back (sim/take.js)
//               (coffee has none: world.coffee is the pot, and the poured cup is just held)
//   edible      { leaves }: the engine offers eat_<type> while you hold it (hold E; play/interactions.js), sneaky
//               to its owner; leaves: what it leaves on you, a config.js MARKS name (player.smeared) or null
//   contraband  the NPC (id) who catches you holding it, and walks over and pockets it if he sees it on the floor
//   owner       { id, when?(npc), says?, reclaim?(game, npc) }: who takes it back on sight (play/rules.js).
//               when: only while this holds does the owner know it's theirs. says: what they say on catching
//               you just carrying it ({ say: icons, after?: seconds }). reclaim: what taking it back does
//               (default: they carry it off, '<type>:recovered' { by, type, from })
//   put         seconds: putting it down on a spot is a sneaky timed action, not an instant one (putdown.js)
//   keep        it leaves your hand only by a put: no drop, and assigned work sends you to your desk holding it
//   bulky       no pretending while you hold it (no hand free for a phone or a folder)
// Whoever takes a thing back (its owner, its confiscator) always walks over and takes it at arm's length
// (sim/mechanics/claim.js, sim/take.js takesBack), never out of your hand from across the room.
import { sandwich } from './painters.js';

export const ITEMS = {
  // The day's last cup (decor.js: the empty coffee bag by the machine). Nobody's but whoever poured it, and it leaves
  // your hand only when you set it down (keep). Kev never takes it from you; he asks (clocks.js). Pretend and it goes
  // to your ear like a phone, steam and all: Kev squints at it (☕❓) and decides you're on a call (📱🤷). Set down
  // where he finds it unattended (the machine, his own desk), he takes it as free.
  coffee: { icon: '☕', draw: 'cup', keep: true }, // full and steaming
  keycard: { icon: '🪪', draw: 'card', place: 'keycard', contraband: 'boss' }, // an ID card on a lanyard; caught with it, the boss walks over for it (clocks.js)
  // The cup, empty, once its coffee is all over the projector (interactions.js spill_coffee). It's evidence: you
  // can't just let it fall (keep), and setting it down anywhere is a furtive 0.8 s (put). Once the boss has seen
  // the projector (behaviours.js peek) the cup in your hand is all the proof he needs: he catches you with it.
  // Not at the meeting table: at 4:00 the verdict judges it instead (verdict.js).
  mug: {
    icon: '☕',
    draw: 'mug', // the same cup, empty: a dried ring inside, a drip down its side
    place: 'mug',
    put: 0.8,
    keep: true,
    owner: { id: 'boss', when: (npc) => !!npc._knows && npc.override !== 'meeting' },
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
      // She keeps it: from then on it is in her hand (looks.js), and her fridge check finds she has it already. Mid-hunt
      // that is the end of the hunt. (It used to go back to the fridge before lunch: it vanished from her hand and
      // was in the fridge again at once, a second sandwich to the player who had just watched her take it.)
      reclaim(game) {
        game.world.sandwich = 'lin';
        game.events.emit('sandwich:returned', {});
      },
    },
  },
};
