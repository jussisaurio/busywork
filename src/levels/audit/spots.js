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
  audit_lin: { x: 3, y: 7, face: 'E' }, // over her paper pile (things.js), facing her desk and laptop
  audit_you: { x: 13, y: 7, face: 'S' },
  audit_kev: { x: 22, y: 7, face: 'S' },

  // Places to stand.
  office_door: { x: 6, y: 7, face: 'N' }, // outside the boss's door
  hallway_west: { x: 5, y: 7, face: 'S' }, // beside where he stands to tick Lin's desk
  hallway_mid: { x: 15, y: 8, face: 'W' }, // the east end of your desk, from the hallway side
  kev_pockets: { x: 15, y: 8, face: 'S' }, // the same, turned to the room: Kev hunting his pockets (cast.js kevWallet)
  door_in: { x: 4, y: 12, face: 'S' },
  restroom: { x: 25, y: 12, face: 'S' },
  smoke: { x: 7, y: 15, face: 'W' }, // the lobby: the boss smokes by the ashtray, side-on to the glass, facing the lift
  elevator: { x: 2, y: 15, face: 'S' },
  kitchen: { x: 25, y: 2, face: 'E' }, // Kev's coffee: side-on, the cup in view; his back to the door
  pot: { x: 22, y: 2, face: 'N' }, // the kitchen's coffee machine: Lin's coffee, 3:35 on
  coffee: { x: 11, y: 7, face: 'N' }, // the hallway coffee machine, on the auditor's way to your desk

  // The auditor's two errands (index.js errands), both in the meeting room, his back to its door.
  pens: { x: 16, y: 5, face: 'N' }, // the pen pot on the meeting table: his pen ran dry at Lin's desk
  call: { x: 11, y: 1, face: 'N' }, // at the window, on the phone: it rings after your desk's tick
};
