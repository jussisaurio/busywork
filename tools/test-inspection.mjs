// Inspection (src/sim/mechanics/inspection.js): the check kinds and the signs, on variants of the
// fixture-inspection level ("Inventory Day": at 2:40 the auditor ticks the laptop on your desk, then you at your
// desk, then Dave's desk). Each case changes the level a little, plays one plan in the harness and reads the
// signs he puts up and the inspection events.
//
//   node tools/test-inspection.mjs
import { levels } from '../src/levels/index.js';
import { validateLevel } from '../src/levels/validate.js';
import { createHarness } from '../src/agent/harness.js';
import { itemOn } from '../src/sim/mechanics/putdown.js';

let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}${JSON.stringify(a) === JSON.stringify(b) ? '' : `\n     got  ${JSON.stringify(a)}\n     want ${JSON.stringify(b)}`}`);

const FI = levels['fixture-inspection'];
const SPOTS = FI.spots;
const INSP = FI.inspections[0];

// A variant: the inspection's fields changed, extra items, another starting world.
function variant({ insp = {}, items = {}, world } = {}) {
  const level = {
    ...FI,
    inspections: [{ ...INSP, ...insp }],
    items: { ...FI.items, ...items },
    initialWorld: world ? () => ({ ...FI.initialWorld(), ...world() }) : FI.initialWorld,
  };
  validateLevel(level, 'fixture-inspection');
  return level;
}

// Play `cmds` on `level`: the signs (icons joined), the inspection events (name + index/failed), the end.
function play(level, cmds) {
  const h = createHarness({ level });
  h.begin();
  for (const c of cmds) h.run(c);
  const signs = h.log.filter((e) => e.name === 'say' && e.payload.kind === 'sign').map((e) => e.payload.icons.join(''));
  const insp = h.log.filter((e) => e.name.startsWith('inspect:') && e.name !== 'inspect:start')
    .map((e) => `${e.name.slice(8)}${e.payload.index ?? e.payload.failed ?? ''}`);
  return { signs, insp, game: h.game, result: h.game.outcome?.result ?? (h.game.caught ? 'caught' : null) };
}

const STAY = ['pretend until 2:52']; // at your desk while he counts: laptop ✔️, you ✔️, Dave's desk ❌
const tablet = { tablet: { icon: '📱' } };

// 1. The default sign is the mark alone (every level that names no `sign` looks as it did).
{
  const r = play(FI, STAY);
  eq(r.signs, ['✔️', '✔️', '❌'], 'default: mark-only signs');
  eq(r.insp, ['pass0', 'pass1', 'fail2', 'done2'], 'default: events by check index');
}

// 2. sign: 'item' shows what he checked: the item, the person, the missing item.
{
  const r = play(variant({ insp: { sign: 'item' } }), STAY);
  eq(r.signs, ['💻✔️', '🧍✔️', '💻❌'], "sign 'item': 💻✔️, the player, 💻❌");
  eq(r.insp, ['pass0', 'pass1', 'fail2', 'done2'], "sign 'item': same events");
}

// 3. An item check may name several types: any of them counts, and the sign shows the one he found.
{
  const level = variant({
    insp: { sign: 'item', checks: [INSP.checks[0], INSP.checks[1], { ...INSP.checks[2], item: ['laptop', 'tablet'] }] },
    items: tablet,
    world: () => ({ items: [itemOn(SPOTS, 'player_desk', 'laptop'), itemOn(SPOTS, 'dave_desk', 'tablet')] }),
  });
  const r = play(level, STAY);
  eq(r.signs, ['💻✔️', '🧍✔️', '📱✔️'], 'item list: the tablet counts at Dave\'s desk');
  eq(r.insp, ['pass0', 'pass1', 'pass2', 'done'], 'item list: all pass');
  ok(r.game.world.audited === true, 'item list: pass effect applied');
}

// 4. A check's own icon wins over the inspection's sign (and works without one).
{
  const checks = [{ ...INSP.checks[0], icon: '🖥️' }, { ...INSP.checks[1], icon: ['🪑', '👤'] }, INSP.checks[2]];
  eq(play(variant({ insp: { checks } }), STAY).signs, ['🖥️✔️', '🪑👤✔️', '❌'], 'icon: per check, mark-only elsewhere');
  eq(play(variant({ insp: { checks, sign: 'item' } }), STAY).signs, ['🖥️✔️', '🪑👤✔️', '💻❌'], "icon: wins over sign 'item'");
}

// 5. The validator knows the new fields.
{
  const broken = (insp, re, what) => {
    let msg = '';
    try { validateLevel({ ...FI, inspections: [{ ...INSP, ...insp }] }, 'fixture-inspection'); } catch (e) { msg = e.message; }
    ok(re.test(msg), `broken: ${what}${msg ? '' : ' (no throw)'}`);
  };
  broken({ sign: 'emoji' }, /inspections\[0\]\.sign: 'emoji' is not 'mark' or 'item'/, 'sign value');
  broken({ checks: [{ item: ['laptop', 'phone'], spot: 'dave_desk' }] }, /inspections\[0\]\.checks\[0\]\.item\[1\]: no item type 'phone'/, 'item list type');
  broken({ checks: [{ item: [], spot: 'dave_desk' }] }, /inspections\[0\]\.checks\[0\]\.item: empty/, 'empty item list');
  broken({ checks: [{ item: 'laptop', spot: 'dave_desk', icon: 7 }] }, /inspections\[0\]\.checks\[0\]\.icon: not an icon or a list of icons/, 'icon type');
}

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
