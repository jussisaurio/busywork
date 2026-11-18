// Level 1's toys (level.toys; the fields are in src/sim/mechanics/toy.js): things you poke that answer back and
// decide nothing.
//   fire_door  push the bar from inside: the door opens a crack onto the balcony, the reader blinks red and the
//              held-door alarm buzzes, and you let it swing shut. You don't go out there. It shows the card reader
//              long before the boss needs his card at it, and that the push opens it: with him locked out, the
//              same push lets him in (interactions.js let_boss_in; the interactable wins while it can).
//   knock_*    the restroom door while someone is in there (restroom.js): you knock, and he answers through the door,
//              cross, with his face (🚽😠: you just knocked on the boss). Free, the door is yours to go in by.
//   mustard    Kev, near you while the mustard is down your sweater, helpfully points at his own chest and at the
//              restroom (👕🟡👉🚽). He doesn't care whose sandwich it was.
const KNOCK = { sfx: 'bang', pose: { arms: 'bang', face: true, for: 0.6 } };
const inside = (id) => (w, s, game) => game.player._stall === id;
export const TOYS = [
  {
    id: 'fire_door', at: { x: 27, y: 13 }, on: 'press', text: 'push the bar',
    line: 'you push the fire door\'s bar: it opens a crack, the alarm buzzes and the reader blinks red, and you let it swing shut',
    react: { sfx: 'denied', pose: { arms: 'reach', face: true, for: 0.6 } },
    try: ['goto fire_door', 'interact'],
  },
  {
    id: 'knock_boss', at: { x: 25, y: 13 }, on: 'press', text: 'knock', when: inside('boss'), every: 2,
    line: 'you knock on the restroom door: the boss answers from inside 🚽😠',
    react: { ...KNOCK, say: { icons: ['🚽', '😠', '@boss'], who: 'prop', ttl: 1.8 } },
    try: ['goto restroom_door', 'pretend until 3:19', 'interact'],
  },
  {
    id: 'knock_lin', at: { x: 25, y: 13 }, on: 'press', text: 'knock', when: inside('lin'), every: 2,
    line: 'you knock on the restroom door: Lin answers from inside 🚽😤',
    react: { ...KNOCK, say: { icons: ['🚽', '😤', '@lin'], who: 'prop', ttl: 1.8 } },
    try: ['goto restroom_door', 'pretend until 3:35.5', 'interact'],
  },
  {
    id: 'mustard', on: 'near', npcs: ['kev'], radius: 2.5, sees: true, every: 25, at: 'restroom',
    when: (w, s, game) => !!game.player.smeared && !game.player.hidden,
    line: '<by> points at his own chest, then at the restroom 👕🟡👉🚽 (mustard, down your sweater)',
    react: { say: ['👕', '🟡', '👉', '🚽'], pose: { arms: 'point', for: 1.6 } },
    try: ['goto fridge pretend', 'interact', 'eat', 'goto kev_desk'],
  },
];
