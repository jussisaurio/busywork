// Level 1's toys (level.toys; the fields are in src/sim/mechanics/toy.js): things you poke that answer back and
// decide nothing.
//   fire_door  push the bar from inside: the door opens a crack onto the balcony, the reader blinks red and the
//              held-door alarm buzzes, and you let it swing shut. You don't go out there. It shows the card reader
//              long before the boss needs his card at it, and that the push opens it: with him locked out, the
//              same push lets him in (interactions.js let_boss_in; the interactable wins while it can).
export const TOYS = [
  {
    id: 'fire_door', at: { x: 27, y: 13 }, on: 'press', text: 'push the bar',
    line: 'you push the fire door\'s bar: it opens a crack, the alarm buzzes and the reader blinks red, and you let it swing shut',
    react: { sfx: 'denied', pose: { arms: 'reach', face: true, for: 0.6 } },
    try: ['goto fire_door', 'interact'],
  },
];
