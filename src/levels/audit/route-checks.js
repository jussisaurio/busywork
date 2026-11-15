// The Audit's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
// The auditor ticks the desks in index.js INSPECTIONS order: 0 the boss's, 1 Lin's, 2 yours, 3 Kev's. A ❌ doesn't
// stop him: he finishes his list and fires you at the sign-off (result 'fail', outcome.why: whose desk).
const ev = (log, name, p = {}) => log.find((e) => e.name === name && Object.entries(p).every(([k, v]) => e.payload?.[k] === v));
const failedAt = (log) => ev(log, 'inspect:fail')?.payload.index;
const HOME = ['put your_desk pretend', 'goto my_seat pretend', 'sit', 'pretend until 3:47']; // the laptop onto your desk, sit

// After a ❌ he goes on down his list: Kev's desk still gets its tick, and the sign-off fires you.
function goesOn(log) {
  if (!ev(log, 'inspect:pass', { index: 3 })) throw new Error('after the ❌ he should go on and tick Kev\'s desk');
  if (!ev(log, 'audit:fired')) throw new Error('he should fire you at the sign-off');
}

export default [
  {
    name: 'do nothing: Kev forgets his laptop on your desk and fetches it (💻🤦) → ❌ at your desk, fired',
    expect: { result: 'fail' },
    play({ run, log, g: game }) {
      run('pretend until 3:47');
      const forgot = ev(log, 'kev:forgot'), fetched = ev(log, 'kev:fetched');
      if (!forgot || !fetched || fetched.minute > 23) throw new Error('Kev should leave his laptop on your desk at lunch and fetch it');
      if (failedAt(log) !== 2) throw new Error(`expected the ❌ at your desk, got check ${failedAt(log)}`);
      goesOn(log);
      if (game.outcome.why !== 'you') throw new Error(`the end card should name your desk, got ${game.outcome.why}`);
    },
  },
  {
    name: 'the boss smokes after his tick: his laptop onto your desk → win',
    expect: { result: 'win', routes: ['boss'] },
    cmds: ['goto boss_desk pretend', 'pretend until 3:35.1', 'interact', ...HOME],
  },
  {
    name: 'Lin\'s laptop off her desk right after the tick, behind his back to yours → win',
    expect: { result: 'win', routes: ['lin'] },
    cmds: ['goto hallway_west pretend', 'pretend until 3:36.4', 'interact', ...HOME],
  },
  {
    name: 'Kev\'s laptop onto your desk while he\'s in the kitchen: he waits for the tick, then fetches it → win',
    expect: { result: 'win', routes: ['kev'] },
    play({ run, log }) {
      for (const c of ['pretend until 3:24', 'goto kev_desk pretend', 'interact', ...HOME]) run(c);
      const tick = ev(log, 'inspect:pass', { index: 2 }), fetched = log.filter((e) => e.name === 'kev:fetched').pop();
      if (!tick || !fetched || fetched.minute < tick.minute) throw new Error('Kev should fetch his laptop after your desk is ticked');
    },
  },
  {
    name: 'Lin\'s laptop while she\'s in the restroom, kept → 💻❓, she hunts, ❌ at her desk, fired',
    expect: { result: 'fail' },
    play({ run, log, g: game }) {
      for (const c of ['goto hallway_west pretend', 'pretend until 3:14', 'interact', 'goto my_seat pretend', 'sit', 'pretend until 3:47']) run(c);
      if (!ev(log, 'laptop:missing', { by: 'lin' })) throw new Error('Lin should miss her laptop');
      if (failedAt(log) !== 1) throw new Error(`expected the ❌ at Lin's desk, got check ${failedAt(log)}`);
      goesOn(log);
      if (game.outcome.why !== 'lin') throw new Error(`the end card should name Lin's desk, got ${game.outcome.why}`);
    },
  },
  {
    name: 'the boss\'s laptop while Lin is in the restroom, onto your desk → he hunts and takes it back 😠💻',
    expect: { result: 'fail' },
    play({ run, log }) {
      for (const c of ['pretend until 3:13.5', 'goto boss_desk pretend', 'interact', 'goto my_seat pretend', 'sit', 'pretend until 3:22.5', ...HOME, 'pretend until 3:47']) run(c);
      if (!ev(log, 'laptop:missing', { by: 'boss' })) throw new Error('the boss should miss his laptop');
      if (!ev(log, 'laptop:reclaimed', { type: 'laptop_boss', by: 'boss' })) throw new Error('the boss should find it and take it back');
      if (failedAt(log) !== 2) throw new Error(`expected the ❌ at your desk, got check ${failedAt(log)}`);
    },
  },
  {
    name: 'the boss\'s laptop during his smoke → Lin sees through the glass, tells the auditor at 3:25',
    expect: { result: 'fail' },
    play({ run, log }) {
      for (const c of ['pretend until 3:09', 'goto boss_desk pretend', 'interact', 'pretend until 3:47']) run(c);
      if (!ev(log, 'witness:tattle', { by: 'lin', late: true })) throw new Error('Lin should tell the auditor when he arrives');
    },
  },
  {
    name: 'a coffee from the hallway pot: hands full, Kev\'s laptop won\'t come; drunk, it does',
    expect: { result: 'fail' },
    play({ run, g: game }) {
      for (const c of ['goto hallway_coffee', 'interact']) run(c);
      if (game.player.held !== 'coffee') throw new Error('the pot should pour a cup');
      for (const c of ['pretend until 3:24', 'goto kev_desk pretend', 'interact']) run(c);
      if (game.player.held !== null) throw new Error('with a cup in hand, interact should drink it, not take the laptop');
      run('interact');
      if (game.player.held !== 'laptop_kev') throw new Error('hands empty, the laptop should come');
      for (const c of ['put kev_desk pretend', 'goto my_seat pretend', 'sit', 'pretend until 3:47']) run(c);
    },
  },
];
