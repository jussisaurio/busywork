// Level 1, "The 4 PM Meeting": everything the engine needs to know about this level, in one object.
// Engine code reads it through game.level (state.js createGame({ level })), never by importing these files.
//
//   map      { rows, legend }  the tile grid (map.js MAP, LEGEND); core/map.js parseMap builds game.map
//   spots    named positions (perception.js spotPos)
//   zones    named rectangles (perception.js inZone)
//   patrols  named point lists for { do: 'patrol', route } schedule entries
//   cast     the NPC definitions, in order: the order is behaviour (update, witness and event order)
//   day      the day's times, in game minutes since 2:30 PM (config.js at())
//   interactions  the player's actions here (interactions.js; play/interactions.js adds sit, drop, pick_up)
//   items    carryable item types and their flags: icon, place, edible, contraband, owner (items.js)
//   roles    who plays which part in the office rules: authority, evidence, scene (roles.js; play/rules.js)
//   lures    NPC mechanics (mechanics.js; src/sim/mechanics/*): a world condition pulls an NPC over to deal with it
//   routes   the ways to cancel the meeting, in route-slot order (HUD, title and end screens):
//            { id, icon, achieved(world) }, checked at day.meetingAt (play/scenario.js)
//   outcomeOrder  the order outcome.routes (and so persist.routesFound) lists achieved routes in
//   initialWorld()  a fresh game.world for a new loop (state.js resetLoop)
import { at } from '../../config.js';
import { MAP, LEGEND, SPOTS, ZONES, ROUTES } from './map.js';
import { NPC_DEFS } from './cast.js';
import { INTERACTIONS } from './interactions.js';
import { ITEMS } from './items.js';
import { ROLES } from './roles.js';
import { LURES } from './mechanics.js';

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
  interactions: INTERACTIONS,
  items: ITEMS,
  roles: ROLES,
  lures: LURES,
  routes: [
    { id: 'projector', icon: '📽️', achieved: (w) => w.projector === 'broken' },
    { id: 'keycard', icon: '🪪', achieved: (w) => w.bossLockedOut },
  ],
  outcomeOrder: ['keycard', 'projector'],
  initialWorld: () => ({
    projector: 'ok',
    fixProgress: 0,
    keycard: 'rack',
    jacket: 'rack',
    bossLockedOut: false,
    sandwich: 'fridge',
    coffee: 'pot', // 'pot' (one full carafe) | 'taken' (no coffee left today)
    items: [],
    kevGone: false,
    linKnows: false, // hunting Lin saw the mustard on you: hunt over, she knows who did it
  }),
};
