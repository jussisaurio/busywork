// The Last Bus's people: the boss, Lin and Kev, and the caretaker who is done before you can do anything (level 1's cast.js documents the schedule fields). Every time below is what the
// person BELIEVES it is: the clock of the zone he stands in (clocks.js). He looks up at it on each schedule entry
// and on each of his LOOK_UPS (silent beats: a glance at the clock with nothing else to do).
//
// The normal day: at 3:00 the caretaker is up the stepladder under the boss's clock, swapping its battery (he has
// done the open-plan clock already); he leaves both stepladders where they stand and goes. At 3:13 Kev picks up his
// laptop to go, sees the boss's coat on the rack, and puts it down again: the rule, on screen. The boss is back from lunch at 3:15, has a coffee in the kitchen 3:40-3:55 (walking back under the
// open-plan clock), and at 4:50 sharp takes his coat off the rack and goes home. Nobody leaves before him: at their
// 4:50 Lin and Kev stand up, look at his coat, and go only once it has gone with him. Your bus is at 4:30.
import { at, deg } from '../../config.js';

export const START = 15 * 60; // 3:00 PM
const s = (time, entry) => ({ at: at(time, START), ...entry });

export const CAST = [
  {
    id: 'boss',
    icon: '@boss',
    color: '#2b3a55', // navy suit
    voice: 'boss',
    meetingSpot: 'boss_desk',
    vision: { fov: deg(100), radius: 8 },
    coneTint: [255, 160, 82],
    schedule: [
      s('3:00', { do: 'away', spot: 'street_end' }), // a long lunch
      s('3:15', { do: 'sit', spot: 'boss_desk', prelude: ['fixQ', 'fixO'], arrive: 'lookUp' }), // back: what time is it?
      s('3:40', { do: 'visit', spot: 'coffee', prelude: ['fixQ', 'fixO', 'readO'], arrive: 'pour' }), // his break: under O to the kitchen
      s('3:55', { do: 'sit', spot: 'boss_desk', prelude: ['fixO', 'passO', 'fixQ'], arrive: 'lookUp' }), // back under O
      s('4:50', { do: 'leave', spot: 'street_end', prelude: 'coat', anim: 'leaving', gone: { set: { bossGone: true }, event: 'boss:left' } }),
    ],
  },
  {
    id: 'lin',
    icon: '@lin',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'lin_desk',
    vision: { fov: deg(100), radius: 9 }, // sharp eyes: through the glass to the boss's clock (and his coat)
    coneTint: [150, 230, 214],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }),
      s('3:20', { do: 'away', spot: 'restroom' }),
      s('3:21', { do: 'say', icons: ['🚻'], kind: 'thought' }), // where she is off to
      s('3:35', { do: 'sit', spot: 'lin_desk', arrive: 'lookUp' }),
      s('4:50', { do: 'visit', spot: 'lin_desk', arrive: 'coatCheck' }), // up: is his coat still on the rack?
      s('4:51', { do: 'say', icons: ['👋'], kind: 'speech' }),
      s('4:52', { do: 'leave', spot: 'street_end', anim: 'leaving', gone: { set: { linGone: true }, event: 'lin:left' } }),
    ],
  },
  {
    id: 'kev',
    icon: '@kev',
    color: '#5f6b3a', // olive hoodie
    voice: 'kev',
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:00', { do: 'sit', spot: 'kev_desk' }),
      s('3:01', { do: 'visit', spot: 'coffee', arrive: 'pour' }),
      s('3:07', { do: 'sit', spot: 'kev_desk', arrive: 'lookUp' }),
      s('3:13', { do: 'visit', spot: 'kev_desk', arrive: 'bagCheck' }), // up with his laptop: the coat. Down again.
      s('3:14', { do: 'sit', spot: 'kev_desk' }),
      s('3:25', { do: 'visit', spot: 'coffee', arrive: 'pour' }), // done before the boss's break
      s('3:31', { do: 'sit', spot: 'kev_desk', arrive: 'lookUp' }),
      s('4:50', { do: 'visit', spot: 'kev_desk', arrive: 'coatCheck' }),
      s('4:51', { do: 'say', icons: ['👋'], kind: 'speech' }),
      s('4:52', { do: 'leave', spot: 'street_end', anim: 'leaving', gone: { set: { kevGone: true }, event: 'kev:left' } }),
    ],
  },
  {
    // Not one of the office: he swaps a clock battery and goes. He minds his own job (he sees almost nothing).
    id: 'caretaker',
    icon: '@caretaker',
    color: '#3f6f8f', // blue work jacket
    voice: 'caretaker',
    meetingSpot: 'street_end',
    vision: { fov: deg(50), radius: 0.6 },
    glanceEvery: [9999, 9999],
    coneTint: [170, 180, 190],
    schedule: [
      s('3:00', { do: 'visit', spot: 'boss_clock_chair', arrive: 'battery' }),
      s('3:02', { do: 'leave', spot: 'street_end', gone: { set: { caretakerGone: true }, event: 'caretaker:left' } }),
    ],
  },
];

// Extra look-up beats (believed times), so each person checks his clock every quarter hour or so.
export const LOOK_UPS = {
  boss: [at('3:35', START), at('4:10', START), at('4:25', START)],
  lin: [at('3:12', START), at('3:50', START), at('4:10', START), at('4:25', START)],
  kev: [at('3:20', START), at('3:55', START), at('4:10', START), at('4:25', START)],
};
