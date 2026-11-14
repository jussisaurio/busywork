import { parseMap } from '../src/core/map.js';
import { canSee, hasLineOfSight, inCone, DIRS } from '../src/core/vision.js';
import { createRng } from '../src/core/rng.js';
import { createEvents } from '../src/core/events.js';
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

const map = parseMap([
  '##########',
  '#....#...#',
  '#....G...#',
  '#....#...#',
  '#.F......#',
  '##########',
], { F: { kind: 'fridge', solid: true, opaque: false, interactable: 'fridge' } });

ok(map.interactables.length === 1 && map.interactables[0].id === 'fridge', 'interactable parsed');
ok(hasLineOfSight(map, 1.5, 1.5, 4.5, 1.5), 'clear LOS in room');
ok(!hasLineOfSight(map, 1.5, 1.5, 7.5, 1.5), 'wall blocks LOS');
ok(hasLineOfSight(map, 1.5, 2.5, 7.5, 2.5), 'glass does not block LOS');
ok(hasLineOfSight(map, 1.5, 4.5, 8.5, 4.5), 'open corridor LOS');
ok(!hasLineOfSight(map, 4.5, 3.5, 6.5, 1.5) || true, 'diagonal near wall (no crash)');
ok(hasLineOfSight(map, 2.5, 2.5, 2.5, 2.5), 'same cell');
// corner peek: cells (5,1) and (5,3) are walls; ray from (4,2)->(6,4)... glass at (5,2) transparent
ok(!hasLineOfSight(map, 4.0, 3.0, 6.0, 1.0) , 'corner between opaque cells blocks');
const v = { x: 1.5, y: 1.5, dir: DIRS.E, fov: Math.PI / 2, radius: 5 };
ok(inCone(v, 4.5, 1.5), 'in cone ahead');
ok(!inCone(v, 1.5, 4.5), 'not in cone 90deg off');
ok(!inCone(v, -2, 1.5), 'not in cone behind');
ok(canSee(map, { ...v, x: 1.5, y: 2.5 }, 6.5, 2.5), 'see through glass');
ok(!canSee(map, v, 6.5, 1.5), 'cannot see through wall');
ok(map.isWalkable(1, 1) && !map.isWalkable(2, 4) && !map.isWalkable(0, 0), 'walkable');

const r1 = createRng(42), r2 = createRng(42);
ok([1,2,3].every(() => r1.next() === r2.next()), 'rng deterministic');
const ev = createEvents(); let got = null; ev.on('x', p => got = p); ev.emit('x', 5);
ok(got === 5, 'events');
console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
