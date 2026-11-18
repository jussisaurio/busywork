// The office cast's skeleton and the schedule helper every level's cast.js uses (level 1's cast.js documents the
// schedule fields). A person is `{ ...OFFICE_PEOPLE.boss, meetingSpot, vision, schedule, ... }`: id, icon (an '@id'
// look icon), colour, voice (voices.js) and the colour of the drawn vision cone. A level's own flavour is a field
// after the spread (e.g. a different `coneTint`).
import { at } from '../../config.js';

export const OFFICE_PEOPLE = {
  boss: { id: 'boss', icon: '@boss', color: '#2b3a55', /* navy suit */ voice: 'boss', coneTint: [255, 160, 82] },
  lin: { id: 'lin', icon: '@lin', color: '#2f8f83', /* teal cardigan */ voice: 'lin', coneTint: [150, 230, 214] },
  kev: { id: 'kev', icon: '@kev', color: '#5f6b3a', /* olive hoodie */ voice: 'kev', coneTint: [214, 230, 140] },
};

// How the AI-agent harness names the office people (harness `names`); a level adds its own.
export const OFFICE_NAMES = Object.freeze({ boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' });

// A schedule entry maker for a day that starts at `start` (minutes after midnight, level.day.start):
// `const s = scheduler(START); s('3:12', { do: 'sit', spot: 'boss_desk' })`.
export const scheduler = (start) => (time, entry) => ({ at: at(time, start), ...entry });
