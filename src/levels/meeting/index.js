// Level 1, "The 4 PM Meeting": everything the engine needs to know about this level, in one object.
// Engine code reads it through game.level (state.js createGame({ level })), never by importing these files.
//
//   map      { rows, legend }  the tile grid (map.js MAP, LEGEND); core/map.js parseMap builds game.map
//   spots    named positions (perception.js spotPos)
//   zones    named rectangles (perception.js inZone)
//   patrols  named point lists for { do: 'patrol', route } schedule entries
//   cast     the NPC definitions, in order: the order is behaviour (update, witness and event order)
import { MAP, LEGEND, SPOTS, ZONES, ROUTES } from './map.js';
import { NPC_DEFS } from './cast.js';

export default {
  id: 'meeting',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: ROUTES,
  cast: NPC_DEFS,
};
