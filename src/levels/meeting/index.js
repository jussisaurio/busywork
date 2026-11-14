// Level 1, "The 4 PM Meeting": everything the engine needs to know about this level, in one object.
// Engine code reads it through game.level (state.js createGame({ level })), never by importing these files.
//
//   map      { rows, legend }  the tile grid (map.js MAP, LEGEND); core/map.js parseMap builds game.map
//   spots    named positions (perception.js spotPos)
//   zones    named rectangles (perception.js inZone)
//   patrols  named point lists for { do: 'patrol', route } schedule entries
//   cast     the NPC definitions, in order: the order is behaviour (update, witness and event order)
//   day      the day's times, in game minutes since 2:30 PM (config.js at())
//   owns     who takes which item back on sight (play/rules.js)
//   sceneDoor  the meeting-room door: Kev blames whoever is within rules.js SCENE_RADIUS of it
import { at } from '../../config.js';
import { MAP, LEGEND, SPOTS, ZONES, ROUTES } from './map.js';
import { NPC_DEFS } from './cast.js';

export default {
  id: 'meeting',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: ROUTES,
  cast: NPC_DEFS,
  day: {
    start: 14 * 60 + 30, // 2:30 PM as minute-of-day (at() and formatClock() still use config.js DAY_START)
    gatherAt: at('3:54'), // everyone still on the floor heads to their meeting seat (sim)
    meetingAt: at('4:00'), // the meeting: the day's outcome (scenario)
    // Cosmetic cues: separate times, not rules (none of them follows from gatherAt or meetingAt).
    clockRedAt: at('3:50'), // the HUD clock turns red
    clockTickAt: at('3:50'), // audio: the wall clock starts ticking
    tockAt: at('3:55'), // audio: tick-tock
    halfMinuteAt: at('3:57'), // audio: a tick every half minute
    beamAt: at('3:55'), // the projector beam lights the screen
  },
  owns: { lin: 'sandwich', kev: 'coffee' },
  sceneDoor: { x: 14.5, y: 6.5 },
};
