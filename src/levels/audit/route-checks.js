// The Audit's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
// The auditor ticks the desks in index.js INSPECTIONS order: 0 the boss's, 1 Lin's, 2 yours, 3 Kev's.
const ev = (log, name, p = {}) => log.find((e) => e.name === name && Object.entries(p).every(([k, v]) => e.payload?.[k] === v));
const failedAt = (log) => ev(log, 'inspect:fail')?.payload.index;
const HOME = ['put your_desk pretend', 'goto my_seat pretend', 'pretend until 3:47']; // the laptop onto your desk, sit

export default [
  {
    name: 'do nothing → ❌ at your desk',
    expect: { result: 'caught' },
    play({ run, log }) {
      run('pretend until 3:47');
      if (failedAt(log) !== 2) throw new Error(`expected the ❌ at your desk, got check ${failedAt(log)}`);
    },
  },
  {
    name: 'the boss smokes after his tick: his laptop onto your desk → win',
    expect: { result: 'win', routes: ['boss'] },
    cmds: ['goto boss_desk pretend', 'pretend until 3:35.1', 'interact', ...HOME],
  },
  {
    name: 'Lin\'s laptop off her desk right after the tick, past her with it at your ear → win',
    expect: { result: 'win', routes: ['lin'] },
    cmds: ['goto hallway_west pretend', 'pretend until 3:36.1', 'interact', ...HOME],
  },
  {
    name: 'Kev\'s laptop onto your desk while he\'s in the kitchen: he fetches it after your tick → win',
    expect: { result: 'win', routes: ['kev'] },
    play({ run, log }) {
      for (const c of ['pretend until 3:24', 'goto kev_desk pretend', 'interact', ...HOME]) run(c);
      const tick = ev(log, 'inspect:pass', { index: 2 }), fetched = ev(log, 'kev:fetched');
      if (!tick || !fetched || fetched.minute < tick.minute) throw new Error('Kev should fetch his laptop after your desk is ticked');
    },
  },
  {
    name: 'teaching fail: Lin\'s laptop too early, while she\'s in the restroom → 💻❓, ❌ at her desk',
    expect: { result: 'caught' },
    play({ run, log }) {
      for (const c of ['goto hallway_west pretend', 'pretend until 3:14', 'interact', ...HOME]) run(c);
      if (!ev(log, 'lin:missing')) throw new Error('Lin should miss her laptop');
      if (failedAt(log) !== 1) throw new Error(`expected the ❌ at Lin's desk, got check ${failedAt(log)}`);
    },
  },
  {
    name: 'Lin\'s laptop too late, as she comes back with her coffee → she tells',
    expect: { result: 'caught' },
    play({ run, log }) {
      for (const c of ['goto hallway_west pretend', 'pretend until 3:38', 'interact', 'pretend until 3:47']) run(c);
      if (!ev(log, 'witness:tattle', { by: 'lin' })) throw new Error('Lin should tell on you');
    },
  },
  {
    name: 'Kev\'s laptop onto your desk during his lunch → he takes it back, ❌ at your desk',
    expect: { result: 'caught' },
    play({ run, log }) {
      for (const c of ['pretend until 3:12', 'goto kev_desk pretend', 'interact', ...HOME]) run(c);
      if (!ev(log, 'kev:fetched')) throw new Error('Kev should take his laptop back');
      if (failedAt(log) !== 2) throw new Error(`expected the ❌ at your desk, got check ${failedAt(log)}`);
    },
  },
  {
    name: 'the boss\'s laptop during his smoke → Lin sees through the glass, tells the auditor at 3:25',
    expect: { result: 'caught' },
    play({ run, log }) {
      for (const c of ['pretend until 3:09', 'goto boss_desk pretend', 'interact', 'pretend until 3:47']) run(c);
      if (!ev(log, 'witness:tattle', { by: 'lin', late: true })) throw new Error('Lin should tell the auditor when he arrives');
    },
  },
];
