// Every reason Meeting's day can end on (outcome.why), once: which end scene it gets for which result, and for the
// verdicts at the table (verdict.js), where the room looks and what it says (stare: npcs.js stareAt) and what the
// boss does with his hands while it lands (boss: poses.js). The end scenes take their bubbles from here too, so the
// room says the same thing in the day and on the card.
//   [result]  the end scene (a key of end-scenes.js END_SCENES.scenes) for an outcome with this why and result
//   stare     verdict.js returns it with the why (judged)
//   catch     a catch with this why: what the catcher says (catchFor), and the end card's opening line
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
import { catchNow } from '../../play/rules.js';

const YOURS = { at: 'player', think: ['📽️', '💥'], say: ['☕', '😠', '👉', '@player'], line: 'tattle' }; // the empty mug is yours
const THROUGH_THE_DOOR = { at: 'player', think: ['🪑', '❓'], say: ['👀', '🚪', '@player'] }; // you, out on the balcony
const linsDesk = (linSays) => ({ at: 'meeting_lin', think: ['☕', '@lin'], say: ['😠', '👉', '@lin'],
  by: { lin: { at: 'meeting_head', think: ['☕', '❓'], say: linSays } } });
export const WHYS = {
  samaritan: { caught: 'samaritanCaught', fail: 'samaritan', stare: { at: 'player', think: ['🤗'], say: ['👏', '@player'] },
    catch: ['🪪', '❗', '👉', '@player'] },
  computer: { caught: 'computer', catch: ['⌨️', '💥', '👉', '@player'] },
  bib: { caught: 'bib' },
  home: { fail: 'home' },
  homeKev: { fail: 'homeKev' },
  balcony: { fail: 'balcony', blamed: 'balcony', win: 'balcony', stare: THROUGH_THE_DOOR },
  snatched: { fail: 'snatched', blamed: 'snatched', win: 'snatched', stare: THROUGH_THE_DOOR },
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

// A verdict for reason `why` (verdict.js, balcony.js): where the room looks and what it says are the why's.
export const judged = (why, result) => ({ result, why, stare: WHYS[why].stare });

// A catch for reason `why` (its end scene's): the catcher says the why's line.
export const catchFor = (game, reason, by, why) => catchNow(game, reason, by, WHYS[why].catch, why);

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

// The DAY OVER line a reader of the AI-agent harness gets (harness.js outcomeText): one per end scene (endKind), so
// the words and the card can't disagree. A scene without its own line reads as its result's.
const via = (o) => o.routes.join(' + ');
const won = (tail) => (o) => `WIN 🎉 (meeting cancelled via: ${via(o)})${tail}`;
const BY_RESULT = {
  win: won(''),
  blamed: (o) => `BLAMED 🪑👉 (the meeting fell apart via ${via(o)}, but everyone was in the meeting room except you)`,
  caught: () => 'CAUGHT by the boss 😠 (fired: you leave with a box 📦)',
  fail: () => 'FAIL: the meeting happened and you presented a blank slide 🦗',
};
const SAYS = {
  together: (o) => `WIN 🔒🚬 (meeting cancelled via: ${via(o)}; you and the boss are both locked out on the balcony, and there's nobody left to hold it)`,
  balcony: () => 'BLAMED 🔒👀 (you were locked out on the balcony at 4:00; the whole table came to stare at you through the fire door\'s window)',
  snatched: () => 'BLAMED 🪪😏 (the boss snatched his keycard off you on the balcony and let the door shut in your face; at 4:00 you\'re still out there pounding)',
  kev: won('; the whole table stares at Kev\'s empty chair ☕👉'),
  lin: won('; the boss glares at Lin, the empty mug on her desk ☕😠👉, and she shrinks 😨'),
  linHungry: won('; the boss glares at Lin, the empty mug on her desk ☕😠👉; she ate no lunch either, and is in tears 😭🥪'),
  bossMug: won('; Lin looks from the dead projector to the boss: the empty mug is on his own desk 🤨☕👉, and he sputters 😳'),
  samaritanCaught: () => 'CAUGHT 🤗🪪 (you let the boss in, he hugged you and saw his keycard in your hand: now you are the one locked out on the balcony)',
  computer: () => 'CAUGHT ⌨️💥 (the coffee shorted a computer with a bang the whole floor heard; fired: you leave with a box 📦)',
  mug: (o) => `BLAMED ☕👉 (the projector died of coffee, and the empty mug is ${o.why === 'desk' ? 'on your desk' : 'in your hand'})`,
  restroom: (o) => `BLAMED 🪑👉 (the meeting fell apart via ${via(o)}; the table stared at your empty chair, then a flush 🚽, and you walked in drying your hands)`,
  home: () => 'FAIL: you just went home 🚌; at 4:00 your phone buzzes on the bus, the boss\'s face on it 📱😠',
  homeKev: () => 'FAIL: you went home with Kev at 3:00 👋👋🚌; at 4:00 your phone buzzes, the boss\'s face on it 📱😠',
  samaritan: () => 'FAIL: you let the boss in off the balcony 🤗; he presented with his arm round you, and a blank slide 🦗',
};
export const endText = (o) => (SAYS[endKind(o)] ?? BY_RESULT[o.result] ?? BY_RESULT.fail)(o);
