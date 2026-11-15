// The audit's spots (index.js and cast.js both need them).

export const LAPTOPS = ['laptop_boss', 'laptop_lin', 'laptop_kev'];

// Desks take any laptop. A desk's spot is where its owner sits; the laptop lies on the desk tile it faces.
export const SPOTS = {
  player_desk: { x: 13, y: 9, face: 'N' }, // your seat; you start here
  your_desk: { x: 14, y: 9, face: 'N', accepts: LAPTOPS }, // beside your seat: the east end of your desk
  boss_desk: { x: 4, y: 4, face: 'N', accepts: LAPTOPS }, // he sits with his back to the glass
  lin_desk: { x: 4, y: 9, face: 'N', accepts: LAPTOPS },
  kev_desk: { x: 22, y: 9, face: 'N', accepts: LAPTOPS },

  // Where the auditor stands to tick each desk off, facing it.
  audit_boss: { x: 4, y: 2, face: 'S' },
  audit_lin: { x: 3, y: 7, face: 'S' }, // over her paper pile (things.js), the laptop at his side
  audit_you: { x: 13, y: 7, face: 'S' },
  audit_kev: { x: 22, y: 7, face: 'S' },

  // Places to stand.
  office_door: { x: 6, y: 7, face: 'N' }, // outside the boss's door
  hallway_west: { x: 5, y: 7, face: 'S' }, // beside where he stands to tick Lin's desk
  hallway_mid: { x: 15, y: 8, face: 'W' }, // the east end of your desk, from the hallway side
  kev_wait: { x: 16, y: 8, face: 'W' }, // one step further: Kev waits here while the auditor is at your desk
  door_in: { x: 4, y: 12, face: 'S' },
  restroom: { x: 25, y: 12, face: 'S' },
  smoke: { x: 7, y: 15, face: 'N' }, // the lobby: the boss smokes facing the glass
  elevator: { x: 2, y: 15, face: 'S' },
  kitchen: { x: 25, y: 2, face: 'E' }, // Kev's coffee: side-on, the cup in view; his back to the door
  pot: { x: 22, y: 2, face: 'N' }, // the kitchen's coffee machine: Lin's coffee, 3:35 on
  coffee: { x: 11, y: 7, face: 'N' }, // the hallway coffee machine, on the auditor's way to your desk
};
