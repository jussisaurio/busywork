// The end scenes for the cup on someone else's desk (end-scenes.js reads them into
// END_SCENES; same draw signature: draw(ctx, game, t, e, outcome), inside TAB, screen space). Kept apart so builders
// working in parallel touch different files. Objects are drawn, never emoji; only bubbles speak emoji. Both stand on
// end-set.js atTheTable; what the room says is the verdict's own (endings.js WHYS, as in the day).
//   lin / linHungry  win, verdict.js verdictDesks: the empty mug was on Lin's desk. The boss points at her across the
//                    table; she shrinks. You ate her lunch too: she is in tears. You stand among them, nodding along.
//   bossMug          win: the mug was on the boss's own desk. The table looks at him; he sputters, hands up.
import { clamp } from '../../render/util.js';
import { bubble } from '../../render/tableau.js';
import { WHYS } from './endings.js';
import { atTheTable, youNodding } from './end-set.js';

export function tableauLin(ctx, game, t, e, o) {
  const hungry = o?.why === 'linHungry';
  const why = WHYS[hungry ? 'linHungry' : 'lin'];
  atTheTable(ctx, game, t, e, {
    boss: { dir: Math.PI - 0.35, head: Math.PI - 0.35, arms: why.boss, angry: true },
    smoke: 560,
    spot: { light: [300, 290], mug: [352, 246], pop: true }, // Lin's place: the evidence in front of her
    // she shrinks into her cardigan, a little tremble; in tears, she looks down
    lin: { dir: 0.2, head: hungry ? Math.PI / 2 : 0.2 + Math.sin(t * 7) * 0.08, arms: hungry ? 'facepalm' : 'shrug',
      sweat: true, scale: 2.4 - clamp(e / 2, 0, 1) * 0.3 },
    kev: { glance: 1 }, // kept late: he says nothing
    you: youNodding(t, Math.PI - 0.3),
  });
  bubble(ctx, why.stare.say, 476, 150, e, 'alert');
  bubble(ctx, why.stare.by.lin.say, 272, 206, e, 'speech', 1.4);
}

export function tableauBossMug(ctx, game, t, e) {
  const why = WHYS.bossMug;
  atTheTable(ctx, game, t, e, {
    // looking from face to face
    boss: { head: Math.PI / 2 + Math.sin(t * 2.3) * 0.4, arms: why.boss, sweat: true },
    smoke: 380,
    spot: { light: [520, 252], mug: [520, 248], pop: true }, // his place: the evidence in front of him
    lin: { dir: 0.42, head: 0.42, arms: 'point' },
    kev: { head: Math.PI - 0.6, glance: 1 }, // kept late: eyes on the boss
    you: youNodding(t, -Math.PI / 2),
  });
  bubble(ctx, why.stare.by.boss.say, 476, 150, e, 'speech');
  bubble(ctx, why.stare.say, 272, 206, e, 'thought', 1.4);
}
