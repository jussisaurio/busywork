// NPC schedules. Each entry starts at `at` (game clock string, PM) and runs until
// the next entry starts. The sim executes the latest entry whose time has passed.
//
// do:
//   sit     { spot }          walk to spot, face spot.face, seated (glances enabled)
//   visit   { spot }          walk to spot, face spot.face, stand
//   patrol  { route }         walk the level's patrols[route] points in order, then stand at the last
//   away    { spot }          walk to spot, then vanish (inactive: not drawn, sees nothing)
//                             until the next entry starts; reappear at that spot
//   leave   { spot, gone? }   walk to spot and vanish for the rest of the day; gone: { set?, event? } applied then
//   say     { icons, kind }   instant: pictogram bubble (does not change activity)
// Any moving entry may carry `anim`: a name the renderer draws him with while he follows it (npc.anim; 'smoking': arms and 🚬).
// Hooks (behaviours.js): an entry's `prelude` (a leg first) and `arrive` (on reaching its spot), and a cast
// member's `meetingArrive` (on sitting down at the meeting).
//
// Layered on top (mechanics.js; CONTRACTS.md "Sim overrides"):
//   - Kev repairs a broken projector whenever he is on the floor (a lure).
//   - The boss smokes on the balcony beyond the fire door, which locks behind him. Coming back in without the keycard
//     in his jacket, he's shut out there for the day, banging on the door (a door).
//   - Lin hunts for her sandwich if it's gone when she checks the fridge (a hunt).
//   - The boss hunts for the coffee cup once he has seen the projector dead (a hunt; behaviours.js peek).
//   - At 3:54 everyone still on the floor goes to their meeting seat.
//
// Per NPC: vision { fov, radius } (config VISION_DEFAULT if absent), glanceEvery (real s between seated
// glances, random range; config GLANCE_EVERY if absent), coneTint (r,g,b of the drawn vision cone).

import { at, deg } from '../../config.js';

const s = (time, entry) => ({ at: at(time), ...entry });

export const NPC_DEFS = [
  {
    id: 'boss',
    icon: '👔',
    color: '#2b3a55', // navy suit
    voice: 'boss',
    meetingSpot: 'meeting_head',
    meetingArrive: 'presenter',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5], // twitchy, so the 'Lin is away' windows still carry risk
    coneTint: [255, 160, 82],
    schedule: [
      s('2:30', { do: 'sit', spot: 'boss_desk' }),
      s('2:44', { do: 'patrol', route: 'boss_patrol' }),
      s('2:56', { do: 'sit', spot: 'boss_desk' }),
      s('3:12', { do: 'away', spot: 'restroom', prelude: 'peekOut' }), // office empty ~3:12–3:29 (long walk), but Lin is watching
      s('3:22', { do: 'sit', spot: 'boss_desk', prelude: 'peekBack' }), // both walks look in on the meeting room
      s('3:33', { do: 'say', icons: ['🚬', '❓'], kind: 'thought' }),
      // Out through the fire door for a smoke on the balcony, jacket (and keycard) on. The door swings shut behind him.
      s('3:35', { do: 'visit', spot: 'smoke', prelude: 'fetchJacket', anim: 'smoking' }),
      // Back in: the fire door first (mechanics.js DOORS). His card opens it (🪪, a beep); without it he's stuck.
      s('3:48', { do: 'sit', spot: 'boss_desk' }), // late enough that a boss held up by his mug hunt still gets out there
    ],
  },
  {
    id: 'kev',
    icon: '🔧',
    color: '#5f6b3a', // olive hoodie
    voice: 'kev',
    meetingSpot: 'meeting_kev',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('2:30', { do: 'sit', spot: 'kev_desk' }),
      s('2:38', { do: 'visit', spot: 'coffee', arrive: 'pourCoffee' }),
      s('2:44', { do: 'sit', spot: 'kev_desk' }),
      s('2:58', { do: 'say', icons: ['🎒', '👋'], kind: 'speech' }),
      s('3:00', { do: 'leave', spot: 'elevator', gone: { set: { kevGone: true }, event: 'kev:left' } }),
    ],
  },
  {
    id: 'lin',
    icon: '👓',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'meeting_lin',
    vision: { fov: deg(100), radius: 8.5 },
    coneTint: [150, 230, 214],
    schedule: [
      s('2:30', { do: 'sit', spot: 'lin_desk' }),
      s('2:58', { do: 'visit', spot: 'fridge', prelude: 'checkFridge' }), // away ~2:58–3:12, but the boss is at his desk
      s('3:04', { do: 'visit', spot: 'kitchen_table', prelude: 'checkFridge' }),
      s('3:07', { do: 'sit', spot: 'lin_desk' }),
      s('3:30', { do: 'away', spot: 'restroom' }), // away ~3:30–3:42, boss at desk until 3:35
      s('3:37', { do: 'sit', spot: 'lin_desk' }),
    ],
  },
];
