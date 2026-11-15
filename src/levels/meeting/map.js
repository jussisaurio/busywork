// The office floor. 30 x 17 tiles. See LEVEL.md for the intended sightlines.
//
//  Boss office (glass S/E walls)  | Meeting room (projector J)      | Kitchen (fridge F, coffee C)
//  ------------------------------ hallway (row 7) --------------------------------------------
//  Open plan: Lin's desk (x3-5), player's desk P (x12-14), Kev's desk (x21-23)
//  Glass wall + entrance L (row 13) | lobby (outside) + elevator E   | restroom door R
export const MAP = [
  '##############################', // 0
  '#K......G..........#FTCT.....#', // 1
  '#.......G..........#.........#', // 2
  '#..TTT..G..TTJTTT..#....TTT..#', // 3
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG..........#.........#', // 5
  '#GGGGGDGG#####D#######DD######', // 6
  '#............................#', // 7
  '#..TTT......TPT......TTT.....#', // 8
  '#............................#', // 9
  '#............................#', // 10
  '#..TTT......TTT......TTT.....#', // 11
  '#...........................H#', // 12
  '#GGGLGGGGG###############R####', // 13
  '#:::::::::####################', // 14
  '#:::::::::####################', // 15
  '##EE##########################', // 16
];

export const LEGEND = {
  K: { kind: 'coat_rack', solid: true, opaque: false, interactable: 'coat_rack' },
  F: { kind: 'fridge', solid: true, opaque: true, interactable: 'fridge' },
  C: { kind: 'coffee_machine', solid: true, opaque: false, interactable: 'coffee_machine' },
  J: { kind: 'projector', solid: true, opaque: false, interactable: 'projector' },
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  L: { kind: 'entrance', solid: true, opaque: false, npcPassable: true },
  R: { kind: 'restroom', solid: true, opaque: true },
  E: { kind: 'elevator', solid: true, opaque: true },
};

// Named spots: tile coords + facing ('N'|'E'|'S'|'W'). Entities stand at (x+0.5, y+0.5).
export const SPOTS = {
  player_desk: { x: 13, y: 9, face: 'N' }, // player's seat; player spawns here
  boss_desk: { x: 4, y: 2, face: 'S' },
  lin_desk: { x: 4, y: 9, face: 'N' },
  kev_desk: { x: 22, y: 9, face: 'N' },

  coat_rack: { x: 2, y: 1, face: 'W' }, // stand here to reach K
  projector: { x: 13, y: 2, face: 'S' }, // stand here to reach J (Kev repairs from here)
  coffee: { x: 22, y: 2, face: 'N' },
  fridge: { x: 20, y: 2, face: 'N' },
  kitchen_table: { x: 25, y: 4, face: 'N' },

  boss_door: { x: 6, y: 7, face: 'S' }, // hallway outside the boss's office door
  door_in: { x: 4, y: 12, face: 'S' }, // inside the entrance
  door_out: { x: 4, y: 14, face: 'N' }, // outside the entrance (locked-out boss stands here)
  smoke: { x: 7, y: 15, face: 'N' }, // lobby; faces the glass, can see into the office
  elevator: { x: 2, y: 15, face: 'S' }, // NPCs vanish here when leaving
  restroom: { x: 25, y: 12, face: 'S' }, // NPCs vanish here for restroom breaks

  meeting_head: { x: 10, y: 3, face: 'E' }, // boss
  meeting_lin: { x: 12, y: 5, face: 'N' },
  meeting_kev: { x: 15, y: 5, face: 'N' },
  meeting_presenter: { x: 17, y: 3, face: 'W' }, // where the player ends up if the meeting happens
  meeting_player: { x: 13, y: 5, face: 'N' }, // your (empty, mustard) chair at the meeting table
};

// Areas in tile units, half-open: x0 <= x < x1, y0 <= y < y1 (perception.js inZone(game, name, x, y)).
export const ZONES = {
  meeting_room: { x0: 9, y0: 1, x1: 19, y1: 6 }, // where you must be at 4:00 (attendance rule)
  outside: { x0: 0, y0: 14, x1: 30, y1: 17 }, // the lobby, beyond the glass entrance
};

// Patrol routes: lists of tile coords walked in order.
export const ROUTES = {
  boss_patrol: [
    [6, 7], [10, 10], [19, 10], [19, 12], [10, 12], [3, 12], [6, 7],
  ],
  lin_hunt: [
    [23, 7], [17, 10], [13, 10], [10, 10], [7, 10], [4, 10],
  ],
};
