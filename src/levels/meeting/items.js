// The meeting's carryable items (level.items), keyed by item type (player.held, floor items' type).
//   icon   how it shows in hand and on the floor
//   place  the world field that says where it is: set to 'player' on pick up and 'dropped' on drop
//          (coffee has none: world.coffee is the pot, and the poured cup is just held)
export const ITEMS = {
  coffee: { icon: '☕' },
  keycard: { icon: '🪪', place: 'keycard' },
  sandwich: { icon: '🥪', place: 'sandwich' },
};
