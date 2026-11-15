// Hold Music's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
// Each route has a winning plan and one teaching fail.

const rang = (log, phone, by) => log.some((e) => e.name === 'switchboard:ring' && e.payload.phone === phone && e.payload.by === by);
const saw = (log, name) => log.some((e) => e.name === name);
const must = (ok, why) => { if (!ok) throw new Error(why); };
// goto again after a soft stop (the boss eyeing you, say) until you get there.
const go = (run, target) => { for (let i = 0; i < 4 && /stopped/.test(run(`goto ${target}`).text); i++); };
const backToDesk = (run) => { go(run, 'my_seat'); run('sit'); };
// Pretend to the meeting time (the 3:30 call is a soft stop), then let the day end.
const toTheEnd = (run, g) => {
  while (g.phase === 'day' && g.clock.minute < g.level.day.meetingAt) run('pretend until 3:33');
  while (g.phase === 'day') run('wait 1s');
};

export default [
  {
    name: 'do nothing → Lin takes her call',
    expect: { result: 'fail' },
    play({ run, log, g }) {
      toTheEnd(run, g);
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },

  // answered: Kev is on his own phone, so Lin answers the kitchen and is still on hold at 3:30. The boss takes the call.
  {
    name: 'answered: ring Kev, then the kitchen → Lin is on hold, the boss takes her call → win',
    expect: { result: 'win', routes: ['answered'] },
    play({ run, log, g }) {
      run('pretend until 3:21');
      go(run, 'ring_kev');
      run('interact');
      run('pretend until 3:23');
      go(run, 'ring_kitchen');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'kev', 'kev') && rang(log, 'kitchen', 'lin'), 'Kev and Lin did not answer');
      must(saw(log, 'interview:boss'), 'the boss never took the call');
    },
  },
  {
    name: 'answered, teaching fail: ring only the kitchen → Kev answers, Lin takes her call → fail',
    expect: { result: 'fail' },
    play({ run, log, g }) {
      run('pretend until 3:22');
      go(run, 'ring_kitchen');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'kitchen', 'kev'), 'Kev did not answer the kitchen');
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },

  // busy: the boss answers Lin's phone while she is in the kitchen, and he is still on hold at 3:30.
  {
    name: 'busy: ring Lin\'s phone while she is away → the boss is on hold on her line at 3:30 → win',
    expect: { result: 'win', routes: ['busy'] },
    play({ run, log, g }) {
      run('pretend until 3:25');
      go(run, 'ring_lin');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'lin', 'boss'), 'the boss did not answer Lin\'s phone');
      must(saw(log, 'interview:busy'), 'the line was not busy');
    },
  },
  {
    name: 'busy, teaching fail: ring Lin\'s phone while she is at her desk → she answers it herself → fail',
    expect: { result: 'fail' },
    play({ run, log, g }) {
      run('pretend until 3:05');
      go(run, 'ring_lin');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'lin', 'lin'), 'Lin did not answer her own phone');
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },

  // unplugged: the boss is on his own phone with his back to the room, Lin is in the kitchen, and Kev has been past.
  {
    name: 'unplugged: ring the boss, unplug Lin\'s phone after Kev\'s cable round → it never rings → win',
    expect: { result: 'win', routes: ['unplugged'] },
    play({ run, log, g }) {
      run('pretend until 3:15');
      go(run, 'ring_boss');
      run('interact');
      go(run, 'lin_phone');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(saw(log, 'cord:out') && !saw(log, 'cord:in'), 'the phone was not left unplugged');
      must(saw(log, 'interview:dead'), 'the phone rang');
    },
  },
  {
    name: 'unplugged, teaching fail: unplug before Kev\'s cable round → Kev plugs it back in → fail',
    expect: { result: 'fail' },
    play({ run, log, g }) {
      run('pretend until 3:08');
      go(run, 'ring_boss');
      run('interact');
      go(run, 'lin_phone');
      run('pretend until 3:11');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(saw(log, 'cord:out') && saw(log, 'cord:in'), 'Kev did not plug it back in');
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },

  // ringout: Kev and Lin are on hold as for answered, and the boss is on his own phone too. Nobody answers.
  {
    name: 'ringout: ring Kev, the kitchen, then the boss → nobody is free at 3:30 → win',
    expect: { result: 'win', routes: ['ringout'] },
    play({ run, log, g }) {
      run('pretend until 3:21');
      go(run, 'ring_kev');
      run('interact');
      run('pretend until 3:23');
      go(run, 'ring_kitchen');
      run('interact');
      run('pretend until 3:27');
      go(run, 'ring_boss');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'boss', 'boss'), 'the boss did not answer his phone');
      must(!['interview:lin', 'interview:boss', 'interview:busy', 'interview:dead'].some((n) => saw(log, n)), 'someone took the call');
    },
  },
  {
    name: 'ringout, teaching fail: ring only the boss → Lin is back at her desk and takes her call → fail',
    expect: { result: 'fail' },
    play({ run, log, g }) {
      run('pretend until 3:27');
      go(run, 'ring_boss');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'boss', 'boss'), 'the boss did not answer his phone');
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },
];
