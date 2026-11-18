// Level 1, "The 4 PM Meeting": everything the engine needs to know about this level, in one object.
// Engine code reads it through game.level (state.js createGame({ level })), never by importing these files.
//
//   map      { rows, legend }  the tile grid (map.js MAP, LEGEND); core/map.js parseMap builds game.map
//   spots    named positions (perception.js spotPos)
//   zones    named rectangles (perception.js inZone)
//   patrols  named point lists for { do: 'patrol', route } schedule entries
//   cast     the NPC definitions, in order: the order is behaviour (update, witness and event order)
//   day      the day's times, in game minutes since 2:30 PM (config.js at())
//   interactions  the player's actions here (interactions.js; play/interactions.js adds eat_<type> per edible
//                 item, then sit, drop, pick_up, put)
//   items    carryable item types and their flags: icon (what people say for it), draw (how it is drawn: held,
//            carried, dropped, the HUD; painters.js), place, edible, contraband, owner (items.js)
//   roles    who plays which part in the office rules: authority, evidence, scene (roles.js; play/rules.js)
//   lures    NPC mechanics (mechanics.js; src/sim/mechanics/*): a world condition pulls an NPC over to deal with it
//   hunts    ... an NPC searches for something until she finds it or gives up
//   doors    ... listed NPCs coming in from a zone must open it, or they're shut out for the day
//   behaviours  level-only hooks the cast names: schedule preludes and arrivals, meeting arrival (behaviours.js)
//   clockFor    the minute each NPC's schedule reads (src/sim/npcs.js): Kev and the cup, the card taken back (below)
//   meeting  the day's frame: { override, room, chair, presenter }. At day.gatherAt every NPC on the floor gets
//            override `override` and walks to its cast `meetingSpot` (sim; plan key `<override>#<n>`); at
//            day.meetingAt you win only standing in zone `room`; blamed, the table stares at spot `chair`;
//            a failed meeting puts you at spot `presenter` (play/scenario.js); verdict: the room judges the
//            coffee cup (verdict.js)
//   failSign    { spot, offset: [dx, dy] }: where a failed meeting's 🦗 sign appears (tiles from the spot's corner)
//   routes   the ways to cancel the meeting, in route-slot order (HUD, title and end screens):
//            { id, icon, achieved(world) }, checked at day.meetingAt (play/scenario.js)
//   outcomeOrder  the order outcome.routes (and so persist.routesFound) lists achieved routes in
//   initialWorld()  a fresh game.world for a new loop (state.js resetLoop)
//   harness  the AI-agent harness's words for this level: goto landmarks, stop events, observe/event text
//            (harness.js; read by src/agent/harness.js)
//   gate     what the fuzzer and the gate know beyond this object: mustUse lessons, plan targets, milestones
//            (gate.js; read by tools/fuzz.mjs levelData())
//   title    the title card: { mission: [line, line], badge: [icon, overlay] }, the two typed mission lines and the
//            emoji under the 🕓 (render screens.js)
//   decor    set dressing: chairs, wall decor, desk clutter, the key legend (decor.js; render world.js, hud.js)
//   looks    how each person is drawn, by id (looks.js; render characters.js lookFor)
//   poses    what the cast is drawn doing: arms rules and marks (looks.js; render characters.js)
//   cones    what makes a vision cone flare besides the rules' game.watch: alert overrides (looks.js; render cones.js)
//   endScenes  the end card: outcome -> scene, its icon row and hand-drawn picture (end-scenes.js; render screens.js)
//   sounds   what the level's actions, events, signs and things sound like (sounds.js; audio/audio.js)
//   voices   how the cast talks, by cast `voice` name (voices.js; audio/babble.js)
//   toys     props that answer back and decide nothing: the fire door's bar (toys.js; src/sim/mechanics/toy.js)
import { at } from '../../config.js';
import { TOYS } from './toys.js';
import { MAP, LEGEND, SPOTS, ZONES, ROUTES } from './map.js';
import { NPC_DEFS } from './cast.js';
import harness from './harness.js';
import gate from './gate.js';
import { DECOR } from './decor.js';
import { LOOKS, POSES, CONES } from './looks.js';
import { END_SCENES } from './end-scenes.js';
import { SOUNDS } from './sounds.js';
import { VOICES } from './voices.js';
import { INTERACTIONS } from './interactions.js';
import { ITEMS } from './items.js';
import { ROLES } from './roles.js';
import { LURES, HUNTS, DOORS } from './mechanics.js';
import { BEHAVIOURS } from './behaviours.js';
import { verdict } from './verdict.js';
import { clockFor } from './clocks.js';

export default {
  id: 'meeting',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: ROUTES,
  cast: NPC_DEFS,
  day: {
    start: 14 * 60 + 30, // 2:30 PM as minute-of-day. The clock reads it; the at('3:10') times here count from
    // at()'s default start, config.js DAY_START, the same 2:30 PM (another start passes it: at('9:30', START))
    gatherAt: at('3:54'), // everyone still on the floor heads to their meeting seat (sim)
    meetingAt: at('4:00'), // the meeting: the day's outcome (scenario)
    // Cosmetic cues: separate times, not rules. Each is optional: config.js dayCue defaults it to a few minutes
    // before meetingAt (red and ticking at -5, tock -2, half minutes -1, beam -5).
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
  hunts: HUNTS,
  doors: DOORS,
  behaviours: BEHAVIOURS,
  toys: TOYS,
  clockFor,
  meeting: { override: 'meeting', room: 'meeting_room', chair: 'meeting_player', presenter: 'meeting_presenter', verdict, where: ['restroom'] }, // where: 4:00 in the restroom (restroom.js)
  failSign: { spot: 'projector', offset: [0.5, 1.5] }, // a failed meeting's 🦗 sign: under the projector (scenario)
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
    bossLockedOut: false, // out on the balcony without his card: the fire door keeps him out (mechanics.js DOORS)
    sandwich: 'fridge',
    coffee: 'pot', // 'pot' (the last cup, from the last of the beans) | 'taken' (none left today)
    items: [],
    kevGone: false,
    linKnows: false, // hunting Lin saw the mustard on you: hunt over, she knows who did it
    mug: null, // the cup after the spill: 'player' | a spot it was put on (coffee, kev_desk, my_desk)
    _cardTry: null, // when Lin's shout stopped your hand at the jacket (clocks.js)
    letIn: null, // the loop time you let the locked-out boss back in through the fire door (interactions.js let_boss_in)
    hugAt: null, // when he hugged you for it (clocks.js bossLetIn)
    hugDone: false, // he has let go
    samaritan: false, // he hugged you and saw no keycard: he's grateful, and you still have no slides (verdict.js)
    cardBack: false, // caught with the keycard: the boss took it back off you (clocks.js listen; the end card)
  }),
  harness,
  gate,
  title: { mission: ['4:00 PM. You promised slides. You made none.', 'Make sure the meeting never happens.'], badge: ['📊', '❌'] },
  decor: DECOR,
  looks: LOOKS,
  poses: POSES,
  cones: CONES,
  endScenes: END_SCENES,
  sounds: SOUNDS,
  voices: VOICES,
};
