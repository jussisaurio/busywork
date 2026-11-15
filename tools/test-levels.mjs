// Level validation (src/levels/validate.js): every registered level passes, and a level that names something it
// doesn't have throws at load, naming the level and the field.
//
//   node tools/test-levels.mjs
import { levels } from '../src/levels/index.js';
import { validateLevel, levelProblems } from '../src/levels/validate.js';

let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

// 1. Every registered level is valid under its registry key.
for (const [key, level] of Object.entries(levels)) {
  const problems = levelProblems(level, key);
  ok(problems.length === 0, `${key}: valid${problems.length ? `\n     ${problems.join('\n     ')}` : ''}`);
}

// 2. Broken levels: each one change to a good level, the error naming the level and the field.
const M = levels.meeting;
const FP = levels['fixture-putdown'];
const FI = levels['fixture-inspection'];
const FA = levels['fixture-attention'];
const castWith = (level, i, change) => level.cast.map((d, k) => (k === i ? { ...d, ...change } : d));
const schedWith = (level, i, j, change) => castWith(level, i, { schedule: level.cast[i].schedule.map((e, k) => (k === j ? { ...e, ...change } : e)) });
const without = (level, field) => { const l = { ...level }; delete l[field]; return l; };

const CASES = [
  ['registry key differs from id', M, 'other', /id: 'meeting' differs from its registry key 'other'/],
  ['no title', without(M, 'title'), 'meeting', /title: missing/],
  ['no initialWorld', without(M, 'initialWorld'), 'meeting', /initialWorld: not a function/],
  ['map: a letter not in the legend', { ...M, map: { ...M.map, rows: [M.map.rows[0].replace('#', 'Z'), ...M.map.rows.slice(1)] } }, 'meeting', /map: map row 0: unknown tile 'Z'/],
  ['day start not a minute-of-day', { ...M, day: { ...M.day, start: 2230 } }, 'meeting', /day\.start: 2230 is not a minute-of-day/],
  ['spot off the map', { ...M, spots: { ...M.spots, far: { x: 99, y: 2 } } }, 'meeting', /spots\.far: \(99, 2\) is off the map/],
  ['spot on a wall', { ...M, spots: { ...M.spots, inwall: { x: 0, y: 0 } } }, 'meeting', /spots\.inwall: \(0, 0\) is a solid tile/],
  ['cast meetingSpot', { ...M, cast: castWith(M, 1, { meetingSpot: 'meeting_kevv' }) }, 'meeting', /cast\[1\] \(kev\)\.meetingSpot: no spot 'meeting_kevv'/],
  ['cast meetingArrive', { ...M, cast: castWith(M, 0, { meetingArrive: 'nobody' }) }, 'meeting', /cast\[0\] \(boss\)\.meetingArrive: no behaviour 'nobody'/],
  ['schedule spot', { ...M, cast: schedWith(M, 2, 0, { spot: 'lin_dsk' }) }, 'meeting', /cast\[2\] \(lin\)\.schedule\[0\]\.spot: no spot 'lin_dsk'/],
  ['schedule patrol route', { ...M, cast: schedWith(M, 0, 1, { route: 'nowhere' }) }, 'meeting', /cast\[0\] \(boss\)\.schedule\[1\]\.route: no route 'nowhere'/],
  ['schedule prelude', { ...M, cast: schedWith(M, 2, 1, { prelude: 'checkFrige' }) }, 'meeting', /cast\[2\] \(lin\)\.schedule\[1\]\.prelude: no behaviour 'checkFrige'/],
  ['schedule do', { ...M, cast: schedWith(M, 1, 0, { do: 'nap' }) }, 'meeting', /cast\[1\] \(kev\)\.schedule\[0\]\.do: 'nap' is not one of/],
  ['unknown voice (was a silent fallback to generic)', { ...M, cast: castWith(M, 2, { voice: 'linn' }) }, 'meeting', /cast\[2\] \(lin\)\.voice: no voice 'linn'/],
  ['meeting room zone', { ...M, meeting: { ...M.meeting, room: 'boardroom' } }, 'meeting', /meeting\.room: no zone 'boardroom'/],
  ['interaction on a missing interactable', { ...M, interactions: { ...M.interactions, kick: { on: 'vending_machine', done() {} } } }, 'meeting', /interactions\.kick\.on: no interactable 'vending_machine'/],
  ['lure spot', { ...M, lures: [{ ...M.lures[0], spot: 'projektor' }] }, 'meeting', /lures\[0\]\.spot: no spot 'projektor'/],
  ['hunt route', { ...M, hunts: [{ ...M.hunts[0], route: 'gone' }] }, 'meeting', /hunts\[0\]\.route: no route 'gone'/],
  ['door zone and npc', { ...M, doors: [{ ...M.doors[0], zone: 'lobby', npcs: ['bos'] }] }, 'meeting', /doors\[0\]\.zone: no zone 'lobby'[^]*doors\[0\]\.npcs\[0\]: no cast member 'bos'/],
  ['item without an icon (drew as ❔)', { ...M, items: { ...M.items, keycard: { ...M.items.keycard, icon: undefined } } }, 'meeting', /items\.keycard\.icon: missing/],
  ['item contraband npc', { ...M, items: { ...M.items, keycard: { ...M.items.keycard, contraband: 'security' } } }, 'meeting', /items\.keycard\.contraband: no cast member 'security'/],
  ['roles authority', { ...M, roles: { ...M.roles, authority: { ...M.roles.authority, id: 'ceo' } } }, 'meeting', /roles\.authority\.id: no cast member 'ceo'/],
  ['outcomeOrder misses a route', { ...M, outcomeOrder: ['keycard'] }, 'meeting', /outcomeOrder: lists route 'projector' 0 times/],
  ['harness landmark', { ...M, harness: { ...M.harness, landmarks: { ...M.harness.landmarks, sofa: 'sofa' } } }, 'meeting', /harness\.landmarks\.sofa: no spot 'sofa'/],
  ['gate target', { ...M, gate: { ...M.gate, targets: [...M.gate.targets, 'sofa'] } }, 'meeting', /gate\.targets\[\d+\]: 'sofa' is no interactable id, landmark or x,y/],
  ['gate renderEvents', { ...M, gate: { ...M.gate, renderEvents: 'projector:broken' } }, 'meeting', /gate\.renderEvents: not a list of event names/],
  ['legend draw', { ...M, map: { ...M.map, legend: { ...M.map.legend, F: { ...M.map.legend.F, draw: 'icebox' } } } }, 'meeting', /map\.legend\['F'\]\.draw: no tile draw 'icebox'/],
  ['decor elevator spot', { ...M, decor: { ...M.decor, elevator: { spot: 'lift' } } }, 'meeting', /decor\.elevator\.spot: no spot 'lift'/],
  ['decor desk owner faces no desk', { ...M, spots: { ...M.spots, kev_desk: { ...M.spots.kev_desk, face: 'S' } } }, 'meeting', /decor\.deskOwners\[1\]: spot 'kev_desk' faces S onto no desk/],
  ['decor prop painter', { ...M, decor: { ...M.decor, props: [{ ...M.decor.props[0], draw: 'hologram' }] } }, 'meeting', /decor\.props\[0\]\.draw: no painter 'hologram'/],
  ['decor prop tile', { ...M, decor: { ...M.decor, props: [{ ...M.decor.props[0], tile: 'Q' }] } }, 'meeting', /decor\.props\[0\]\.tile: 'Q' is not on the map/],
  ['decor chair spot', { ...M, decor: { ...M.decor, chairs: [{ spot: 'throne', face: 'S', color: ['#000', '#000'] }] } }, 'meeting', /decor\.chairs\[0\]\.spot: no spot 'throne'/],
  ['sounds spot', { ...M, sounds: { ...M.sounds, murmur: { spot: 'stage' } } }, 'meeting', /sounds\.murmur\.spot: no spot 'stage'/],
  ['endScenes: a kind with no scene', { ...M, endScenes: { ...M.endScenes, kindOf: (o) => o.result } }, 'meeting', /endScenes\.kindOf: win \[keycard\] gives 'win', which is not in scenes/],
  ['putdown found behaviour', { ...FP, spots: { ...FP.spots, box: { ...FP.spots.box, found: 'shred' } } }, 'fixture-putdown', /spots\.box\.found: no behaviour 'shred'/],
  ['putdown accepts an item type', { ...FP, spots: { ...FP.spots, box: { ...FP.spots.box, accepts: ['memo'] } } }, 'fixture-putdown', /spots\.box\.accepts\[0\]: no item type 'memo'/],
  ['inspection check spot', { ...FI, inspections: [{ ...FI.inspections[0], checks: [{ item: 'laptop', spot: 'dave_dsk' }] }] }, 'fixture-inspection', /inspections\[0\]\.checks\[0\]\.spot: no spot 'dave_dsk'/],
  ['inspection fail.then', { ...FI, inspections: [{ ...FI.inspections[0], fail: { then: 'fire' } }] }, 'fixture-inspection', /inspections\[0\]\.fail\.then: no behaviour 'fire'/],
  ['inspection fail.then hunt without a hunt', { ...FI, inspections: [{ ...FI.inspections[0], fail: { then: 'hunt' } }] }, 'fixture-inspection', /inspections\[0\]\.fail\.then: no hunt for 'auditor'/],
  ['noise at a spot', { ...FA, noises: { 'donut:eaten': { at: 'kitchen', radius: 4 } } }, 'fixture-attention', /noises\['donut:eaten'\]\.at: no spot 'kitchen'/],
  ['noise on the noise event', { ...FA, noises: { noise: { at: 'printer', radius: 4 } } }, 'fixture-attention', /noises\['noise'\]: would make a noise forever/],
  ['interaction noise at a spot', { ...FA, interactions: { ...FA.interactions, print: { ...FA.interactions.print, noise: { at: 'copier', radius: 5 } } } }, 'fixture-attention', /interactions\.print\.noise\.at: no spot 'copier'/],
];
for (const [what, level, key, re] of CASES) {
  let msg = '';
  try { validateLevel(level, key); } catch (e) { msg = e.message; }
  ok(msg.startsWith(`level '${key}' is broken:`) && re.test(msg), `broken: ${what}${msg ? '' : ' (no throw)'}${msg && !re.test(msg) ? `\n     ${msg}` : ''}`);
}

// 3. Every problem is reported at once, one line each.
{
  const broken = { ...M, title: undefined, cast: castWith(M, 1, { meetingSpot: 'x', voice: 'y' }) };
  ok(levelProblems(broken, 'meeting').length === 3, 'all problems listed, one per line');
}

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
