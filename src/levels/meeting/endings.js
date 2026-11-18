// Every reason Meeting's day can end on (outcome.why), once: which end scene it gets for which result, and for the
// verdicts at the table (verdict.js), where the room looks and what it says (stare: npcs.js stareAt) and what the
// boss does with his hands while it lands (boss: poses.js). The end scenes take their bubbles from here too, so the
// room says the same thing in the day and on the card.
//   [result]  the end scene (a key of end-scenes.js END_SCENES.scenes) for an outcome with this why and result
//   stare     verdict.js returns it with the why
//   boss      his arms at the head of the table once the verdict is in (a characters.js arm pose)
// Where the whys come from:
//   samaritan            you let the boss in off the balcony (clocks.js bossLetIn): holding his card, caught and
//                        locked out yourself; without it, the fail, his arm round you at the blank screen
//   computer, bib        catches with a scene of their own (interactions.js drownComputer, clocks.js: the mustard)
//   home, homeKev        you just went home (interactions.js go_home); with Kev, if he was on his way out too
//   balcony, snatched,   4:00 found you on the balcony (balcony.js balconyVerdict)
//   together
//   mug, desk, kev,      the verdict on the empty mug (verdict.js): in your hand, on your desk, on Kev's, Lin's
//   lin, linHungry,      (and you ate her lunch), the boss's own
//   bossMug
//   sip, call, puppets   the plain fails with a cause (verdict.js verdictFull)
//   working              blamed, and you were at your desk typing (verdict.js verdictWhere)
const YOURS = { at: 'player', think: ['📽️', '💥'], say: ['☕', '😠', '👉', '@player'], line: 'tattle' }; // the empty mug is yours
const linsDesk = (linSays) => ({ at: 'meeting_lin', think: ['☕', '@lin'], say: ['😠', '👉', '@lin'],
  by: { lin: { at: 'meeting_head', think: ['☕', '❓'], say: linSays } } });
export const WHYS = {
  samaritan: { caught: 'samaritanCaught', fail: 'samaritan', stare: { at: 'player', think: ['🤗'], say: ['👏', '@player'] } },
  computer: { caught: 'computer' },
  bib: { caught: 'bib' },
  home: { fail: 'home' },
  homeKev: { fail: 'homeKev' },
  balcony: { fail: 'balcony', blamed: 'balcony', win: 'balcony' },
  snatched: { fail: 'snatched', blamed: 'snatched', win: 'snatched' },
  together: { fail: 'together', blamed: 'together', win: 'together' },
  mug: { blamed: 'mug', stare: YOURS },
  desk: { blamed: 'mug', stare: YOURS },
  kev: { win: 'kev', boss: 'point', stare: { at: 'meeting_kev', think: ['☕', '@kev'], say: ['😠', '👉', '@kev'] } },
  lin: { win: 'lin', boss: 'point', stare: linsDesk(['😨']) }, // she shrinks
  linHungry: { win: 'linHungry', boss: 'point', stare: linsDesk(['😭', '🥪']) }, // you ate her lunch too: in tears
  bossMug: { win: 'bossMug', boss: 'shrug', stare: { at: 'meeting_head', think: ['☕', '@boss'], say: ['🤨', '👉', '@boss'],
    by: { boss: { at: 'meeting_lin', think: ['☕', '❓'], say: ['😳', '☕', '❓'] } } } },
  sip: { fail: 'sip' },
  call: { fail: 'call' },
  puppets: { fail: 'puppets' },
  working: { blamed: 'working', fail: 'working', stare: { at: 'player', think: ['🪑', '❓'], say: ['👀', '⌨️', '@player'] } },
};

// The end scene an outcome gets: its why's scene for its result, else the result's own. A win's own scene says which
// routes did it: both at once, the keycard, the projector. Blamed from the restroom (outcome.where), you walk in late.
export function endKind(o) {
  if (!o) return 'fail';
  const own = WHYS[o.why]?.[o.result];
  if (own) return own;
  const routes = Array.isArray(o.routes) ? o.routes : [];
  if (o.result === 'caught') return 'caught';
  if (o.result === 'blamed') return o.where === 'restroom' ? 'restroom' : 'blamed';
  if (o.result === 'win') {
    if (routes.includes('keycard')) return routes.includes('projector') ? 'campfire' : 'keycard';
    return 'projector';
  }
  return 'fail';
}
