// The office floor. 30 x 17 tiles. See LEVEL.md for the intended sightlines.
//
//  Boss office (glass S/E walls)  | Meeting room (projector J)      | Kitchen (fridge F, coffee C)
//  ------------------------------ hallway (row 7) --------------------------------------------
//  Open plan: Lin's desk (x3-5), player's desk P (x12-14), Kev's desk (x21-23)
//  Glass wall + entrance L (row 13) | lobby (outside) + elevator E   | restroom door R, fire door X
//                                                                     onto the smokers' balcony (outside, rows 14-15)
export const MAP = [
  '##############################', // 0
  '#K......G..........#FTCT.....#', // 1
  '#.......G..........#.........#', // 2
  '#..TBT..G..TTJTTT..#....TTT..#', // 3
  '#.......G..TTTTTT..#.........#', // 4
  '#......YG..........#.........#', // 5
  '#GGGGGDGG#####D#######DD######', // 6
  '#............................#', // 7
  '#..TNT......TPT......TUT.....#', // 8
  '#............................#', // 9
  '#............................#', // 10
  '#..TWT......TWT......TWT.....#', // 11
  '#...........................V#', // 12
  '#GGGLGGGGG###############R#X##', // 13
  '#:::::::::################===#', // 14
  '#:::::::::################===#', // 15
  '##EE##########################', // 16
];

// Each letter: { kind, solid, opaque, interactable?, npcPassable?, draw? } (core/map.js). draw: what the renderer
// draws it as (render/world.js TILE_DRAWS); without one, its kind (coat_rack, coffee_machine, own_desk, entrance,
// restroom and elevator are draws too).
export const LEGEND = {
  K: { kind: 'coat_rack', solid: true, opaque: false, interactable: 'coat_rack' },
  F: { kind: 'fridge', solid: true, opaque: true, interactable: 'fridge', draw: 'refrigerator' },
  C: { kind: 'coffee_machine', solid: true, opaque: false, interactable: 'coffee_machine' },
  J: { kind: 'projector', solid: true, opaque: false, interactable: 'projector', draw: 'meeting_table' }, // the slideProjector prop on top
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  // The glass entrance onto the lobby and the elevator. Solid to you all day, but you can always just go home
  // (interactions.js go_home: you walk out to the elevator, and the day is lost).
  L: { kind: 'entrance', solid: true, opaque: false, npcPassable: true, interactable: 'exit' },
  R: { kind: 'restroom', solid: true, opaque: true, interactable: 'restroom' }, // one cubicle: knock, or go in (restroom.js)
  E: { kind: 'elevator', solid: true, opaque: true },
  // The fire door at the far end, past the toilets: a steel door with a wired-glass window, onto the balcony where the
  // boss smokes. It locks behind whoever goes through; from outside only a keycard opens it (mechanics.js DOORS for
  // NPCs). Solid to you: you go through it by its rows (balcony.js: push the bar out; badge or slip back in), open to
  // NPCs. Drawn as wall, the door painted on (painters.js fireDoor). With him locked out, the push lets him in
  // instead (interactions.js let_boss_in).
  X: { kind: 'fire_door', solid: true, opaque: false, npcPassable: true, draw: 'wall', interactable: 'fire_door' },
  // The balcony: a concrete slab four floors up with a railing (painters.js balcony). Outside, like the lobby.
  '=': { kind: 'balcony', solid: false, opaque: false, draw: 'outside' },
  // The boss's ficus, in the corner of his office by the glass: a potted plant like the other (core/map.js H), but
  // you can pour the day's only cup into it, from his doorway (interactions.js water_ficus; painters-more.js ficus).
  Y: { kind: 'plant', solid: true, opaque: false, interactable: 'ficus', draw: 'plant' },
  // The other ficus, in the hallway corner by the fire door: it takes the coffee too (interactions.js water_plant), and
  // just grows its leaf; only the boss's own plant delights him (toys.js ficus).
  V: { kind: 'plant', solid: true, opaque: false, interactable: 'plant', draw: 'plant' },
  // The computers, each in the middle of its desk (the keyboard in front of the chair): the day's cup goes into the
  // keys, the same on every one (interactions.js drownComputer; COMPUTERS below). W: the three empty desks along the
  // south row (spare_computer_0, _1, _2, west to east; _1 is behind yours, the mustard chair). Yours is P (own_desk).
  // Setting a cup down is the desk's free end beside the computer (SPOTS lies), a target of its own.
  W: { kind: 'desk', solid: true, opaque: false, interactable: 'spare_computer', draw: 'desk' },
  B: { kind: 'desk', solid: true, opaque: false, interactable: 'boss_computer', draw: 'desk' },
  N: { kind: 'desk', solid: true, opaque: false, interactable: 'lin_computer', draw: 'desk' },
  U: { kind: 'desk', solid: true, opaque: false, interactable: 'kev_computer', draw: 'desk' },
};

// Every computer on the floor: its interactable type -> whose it is (null: nobody's, an empty desk). The one list
// the pour (interactions.js), its sound (sounds.js) and the checks read: a machine is in it or it is not a computer.
export const COMPUTERS = { spare_computer: null, own_desk: 'player', lin_computer: 'lin', kev_computer: 'kev', boss_computer: 'boss' };

// Named spots: tile coords + facing ('N'|'E'|'S'|'W'). Entities stand at (x+0.5, y+0.5).
export const SPOTS = {
  player_desk: { x: 13, y: 9, face: 'N' }, // player's seat; player spawns here
  // Put down (sim/mechanics/putdown.js): the empty mug lies on the tile the spot faces. Kev's desk is where it
  // frames Kev (verdict.js); your own is where it frames you (owner 'player': the boss who knows sees it there).
  // The full cup goes on them too: on yours it is yours, and Kev leaves it be; on Kev's desk or the machine it looks
  // free to him, and he takes it (clocks.js).
  kev_desk: { x: 22, y: 9, face: 'N', accepts: ['mug', 'coffee'], lies: { dx: 1 }, shown: { dx: 0, dy: 0.12 } },
  my_desk: { x: 12, y: 9, face: 'N', accepts: ['mug', 'coffee'], owner: 'player' }, // the desk left of P: sit wins at P
  // Their desks take the empty mug too (verdict.js verdictDesks): Lin takes the fall; the boss's own desk is plain to
  // Lin through his glass. Only the mug: a full cup left there is a different story, not told yet.
  // Every desk's cup lies at its free end, one tile right of the computer (lies), drawn on the near half of the desk
  // top (shown), not over the keyboard (Jussi's playtest: it floated on Kev's keys).
  boss_desk: { x: 4, y: 2, face: 'S', accepts: ['mug'], lies: { dx: 1 }, shown: { dx: 0, dy: -0.12 } },
  lin_desk: { x: 4, y: 9, face: 'N', accepts: ['mug'], lies: { dx: 1 }, shown: { dx: 0, dy: 0.12 } },

  coat_rack: { x: 2, y: 1, face: 'W' }, // stand here to reach K
  projector: { x: 13, y: 2, face: 'S' }, // stand here to reach J (Kev repairs from here)
  // A cup back by the machine: it lies on the machine's tile (Kev's finding and every sightline use that), drawn on
  // the counter beside it, on the saucer (shown), not standing over the pot.
  coffee: { x: 22, y: 2, face: 'N', accepts: ['mug', 'coffee'], shown: { dx: -0.9, dy: 0 } },
  fridge: { x: 20, y: 2, face: 'N' },
  kitchen_table: { x: 25, y: 4, face: 'N' },

  boss_door: { x: 6, y: 7, face: 'S' }, // hallway outside the boss's office door
  boss_doorway: { x: 6, y: 6, face: 'E' }, // in his doorway, not in his office: the ficus (Y) is in reach
  spare_desk: { x: 13, y: 12, face: 'N' }, // in the empty mustard chair's place: its computer (W, spare_computer_1) in front of you
  meeting_door: { x: 14, y: 7, face: 'N' }, // hallway outside the meeting room: the boss looks in (behaviours.js peek)
  door_in: { x: 4, y: 12, face: 'S' }, // inside the entrance
  door_out: { x: 4, y: 14, face: 'N' }, // outside the entrance (the lobby)
  // The smokers' balcony, beyond the fire door X (27,13). He smokes at the railing; coming back in, he stands at the
  // door and badges in, or, without his card, bangs on it for the rest of the day (mechanics.js DOORS).
  fire_door: { x: 27, y: 14, face: 'N' },
  smoke: { x: 26, y: 15, face: 'S' }, // at the railing, looking out over the street; the ashtray in the corner by the door
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
  boss_office: { x0: 1, y0: 1, x1: 8, y1: 6 }, // his glass office: he shows you out if he finds you in it (roles.js private)
  outside: { x0: 0, y0: 14, x1: 30, y1: 17 }, // the lobby, beyond the glass entrance; the balcony, beyond the fire door
  balcony: { x0: 26, y0: 14, x1: 29, y1: 16 }, // the smokers' balcony: you can go out there too (balcony.js)
};

// Patrol routes: lists of tile coords walked in order.
export const ROUTES = {
  boss_patrol: [
    [6, 7], [10, 10], [19, 10], [19, 12], [10, 12], [3, 12], [6, 7],
  ],
  lin_hunt: [
    [23, 7], [17, 10], [13, 10], [10, 10], [7, 10], [4, 10],
  ],
  // The boss looking for the cup: the kitchen it came from, Kev's desk, yours, and back.
  mug_hunt: [
    [14, 7], [22, 4], [22, 10], [13, 10],
  ],
};
