// Office Time's three people (level 1's cast.js documents the schedule fields). Every time below is what the
// person BELIEVES it is: his home clock (clocks.js). Each entry is also a beat on which he looks up at it.
//
// The normal day: the boss is back from lunch at 3:15, smokes 3:40-3:55 and leaves at 4:50. Lin and Kev leave at
// 4:40. Your bus is at 4:30, and nobody leaves before the boss.
import { at, deg } from '../../config.js';
import { CLOCK_BEHAVIOURS } from './clocks.js';

export const START = 15 * 60; // 3:00 PM
const s = (time, entry) => ({ at: at(time, START), ...entry });

export const CAST = [
  {
    id: 'boss',
    icon: '👔',
    color: '#2b3a55', // navy suit
    voice: 'boss',
    meetingSpot: 'boss_desk',
    vision: { fov: deg(100), radius: 8 },
    coneTint: [255, 160, 82],
    schedule: [
      s('3:00', { do: 'away', spot: 'elevator' }), // a long lunch
      s('3:15', { do: 'sit', spot: 'boss_desk', arrive: 'lookUp' }), // first thing back: what time is it?
      s('3:30', { do: 'say', icons: ['📄', '📄'], kind: 'thought' }),
      s('3:38', { do: 'say', icons: ['🚬', '❓'], kind: 'thought' }),
      s('3:40', { do: 'visit', spot: 'smoke', anim: 'smoking' }),
      s('3:55', { do: 'sit', spot: 'boss_desk', arrive: 'lookUp' }),
      s('4:10', { do: 'say', icons: ['📞'], kind: 'thought' }),
      s('4:25', { do: 'say', icons: ['📊', '😤'], kind: 'thought' }),
      s('4:48', { do: 'say', icons: ['🎒', '👋'], kind: 'speech' }),
      s('4:50', { do: 'leave', spot: 'elevator', anim: 'leaving', gone: { set: { bossGone: true }, event: 'boss:left' } }),
    ],
  },
  {
    id: 'lin',
    icon: '👓',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'lin_desk',
    vision: { fov: deg(100), radius: 9 }, // sharp eyes: through the glass to the boss's clock
    coneTint: [150, 230, 214],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }),
      s('3:12', { do: 'say', icons: ['☕', '❓'], kind: 'thought' }),
      s('3:20', { do: 'away', spot: 'restroom' }),
      s('3:30', { do: 'sit', spot: 'lin_desk', arrive: 'lookUp' }),
      s('3:50', { do: 'say', icons: ['📎'], kind: 'thought' }),
      s('4:10', { do: 'say', icons: ['📞'], kind: 'thought' }),
      s('4:25', { do: 'say', icons: ['🗂️'], kind: 'thought' }),
      s('4:38', { do: 'say', icons: ['🎒', '👋'], kind: 'speech' }),
      s('4:40', { do: 'leave', spot: 'elevator', anim: 'leaving', gone: { set: { linGone: true }, event: 'lin:left' } }),
    ],
  },
  {
    id: 'kev',
    icon: '🔧',
    color: '#5f6b3a', // olive hoodie
    voice: 'kev',
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:00', { do: 'sit', spot: 'kev_desk' }),
      s('3:01', { do: 'visit', spot: 'coffee' }),
      s('3:07', { do: 'sit', spot: 'kev_desk', arrive: 'lookUp' }),
      s('3:20', { do: 'say', icons: ['🎧'], kind: 'thought' }),
      s('3:35', { do: 'visit', spot: 'coffee' }),
      s('3:41', { do: 'sit', spot: 'kev_desk', arrive: 'lookUp' }),
      s('3:55', { do: 'say', icons: ['💻'], kind: 'thought' }),
      s('4:10', { do: 'say', icons: ['🍕', '❓'], kind: 'thought' }),
      s('4:25', { do: 'say', icons: ['🎧'], kind: 'thought' }),
      s('4:38', { do: 'say', icons: ['🎒', '👋'], kind: 'speech' }),
      s('4:40', { do: 'leave', spot: 'elevator', anim: 'leaving', gone: { set: { kevGone: true }, event: 'kev:left' } }),
    ],
  },
];

export const BEHAVIOURS = { ...CLOCK_BEHAVIOURS };
