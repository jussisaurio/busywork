// Level 1's toys (level.toys; the fields are in src/sim/mechanics/toy.js): things you poke that answer back and
// decide nothing.
//   fire_door  push the bar from inside: it won't give, and the card reader blinks red with a buzz. A locked beat,
//              and it shows the card reader long before the boss needs his card at it.
//   ficus      the boss's plant, after you pour the coffee into it (interactions.js water_ficus): on his next look
//              at it he is delighted, once (🌿😍, his head turned to it).
export const TOYS = [
  {
    id: 'fire_door', at: { x: 27, y: 13 }, on: 'press', text: 'push the bar',
    line: 'you push the fire door\'s bar: it won\'t give, and the card reader by the handle blinks red with a buzz',
    react: { sfx: 'denied', pose: { arms: 'reach', face: true, for: 0.6 } },
    try: ['goto fire_door', 'interact'],
  },
  {
    id: 'ficus', at: { x: 7, y: 5 }, on: 'pass', npcs: ['boss'], radius: 9, sees: true, every: 999,
    state: { admired: false },
    when: (w, s) => w.cup === 'ficus' && !s.admired,
    line: 'the boss looks at his ficus, sprouting a glossy new leaf, and is delighted 🌿😍',
    react: { say: { icons: ['🌿', '😍'], ttl: 2.2 }, sfx: 'relief', pose: { arms: 'cheer', face: true, for: 1.8 }, set: { admired: true } },
    try: ['goto coffee_machine pretend', 'interact', 'goto boss_doorway pretend', 'interact', 'wait 3s'],
  },
];
