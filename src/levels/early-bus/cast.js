// Early Bus's three people (level 1's cast.js documents the schedule fields). Every time below is what the
// person BELIEVES it is: his home clock (clocks.js). He looks up at it on each schedule entry and on each of his
// LOOK_UPS (silent beats: a glance at the clock with nothing else to do).
//
// The normal day: the boss is back from lunch at 3:15, smokes 3:40-3:55 and leaves at 4:50 sharp. Nobody leaves
// before him: Lin and Kev wave and go at 4:51 by their clock, right after him. Your bus is at 4:30.
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
      s('3:00', { do: 'away', spot: 'elevator' }), // a long lunch
      s('3:15', { do: 'sit', spot: 'boss_desk', arrive: 'lookUp' }), // first thing back: what time is it?
      s('3:40', { do: 'visit', spot: 'smoke', anim: 'smoking' }),
      s('3:55', { do: 'sit', spot: 'boss_desk', arrive: 'lookUp' }),
      s('4:48', { do: 'say', icons: ['👋'], kind: 'speech' }),
      s('4:50', { do: 'leave', spot: 'elevator', anim: 'leaving', gone: { set: { bossGone: true }, event: 'boss:left' } }),
    ],
  },
  {
    id: 'lin',
    icon: '@lin',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'lin_desk',
    vision: { fov: deg(100), radius: 9 }, // sharp eyes: through the glass to the boss's clock
    coneTint: [150, 230, 214],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }),
      s('3:20', { do: 'away', spot: 'restroom' }),
      s('3:30', { do: 'sit', spot: 'lin_desk', arrive: 'lookUp' }),
      s('4:50', { do: 'say', icons: ['👋'], kind: 'speech' }), // he has gone: home time
      s('4:51', { do: 'leave', spot: 'elevator', anim: 'leaving', gone: { set: { linGone: true }, event: 'lin:left' } }),
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
      s('3:01', { do: 'visit', spot: 'coffee' }),
      s('3:07', { do: 'sit', spot: 'kev_desk', arrive: 'lookUp' }),
      s('3:35', { do: 'visit', spot: 'coffee' }),
      s('3:41', { do: 'sit', spot: 'kev_desk', arrive: 'lookUp' }),
      s('4:50', { do: 'say', icons: ['👋'], kind: 'speech' }),
      s('4:51', { do: 'leave', spot: 'elevator', anim: 'leaving', gone: { set: { kevGone: true }, event: 'kev:left' } }),
    ],
  },
];

// Extra look-up beats (believed times), so each person checks his clock every quarter hour or so.
export const LOOK_UPS = {
  boss: [at('3:30', START), at('3:38', START), at('4:10', START), at('4:25', START)],
  lin: [at('3:12', START), at('3:50', START), at('4:10', START), at('4:25', START)],
  kev: [at('3:20', START), at('3:55', START), at('4:10', START), at('4:25', START)],
};
