// The Interview's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
// Each route has a winning plan and one teaching fail.

// Who answered which ring (the phone tick's 'phone:answering').
const rang = (log, phone, by) => log.some((e) => e.name === 'phone:answering' && e.payload.phone === phone && e.payload.by === by);
const saw = (log, name) => log.some((e) => e.name === name);
const kevJammed = (log) => log.some((e) => e.name === 'cord:in' && e.payload.by === 'kev');
const must = (ok, why) => { if (!ok) throw new Error(why); };
// goto again after a soft stop (the boss eyeing you, say) until you get there.
const go = (run, target) => { for (let i = 0; i < 4 && /stopped/.test(run(`goto ${target}`).text); i++); };
const backToDesk = (run) => { go(run, 'my_seat'); run('sit'); };
// Pretend to the end of the call (3:30 is a soft stop), then let the day end.
const toTheEnd = (run, g) => {
  while (g.phase === 'day' && g.clock.minute < g.level.day.meetingAt) run('pretend until 3:34');
  while (g.phase === 'day') run('wait 1s');
};

export default [
  {
    name: 'do nothing → Lin takes her call',
    expect: { result: 'fail' },
    play({ run, log, g }) {
      toTheEnd(run, g);
      must(saw(log, 'lin:checks'), 'Lin never checked her phone');
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },

  // answered: Kev is on his own phone, so Lin answers the kitchen phone and is still on hold at 3:30. The boss
  // answers her interview, puzzled, and hangs up.
  {
    name: 'answered: ring Kev, then the kitchen → Lin is on hold in the kitchen, the boss answers her call → win',
    expect: { result: 'win', routes: ['answered'] },
    play({ run, log, g }) {
      run('pretend until 3:18');
      go(run, 'ring_kev');
      run('interact');
      go(run, 'ring_kitchen');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'kev', 'kev') && rang(log, 'kitchen', 'lin'), 'Kev and Lin did not answer');
      must(saw(log, 'interview:other'), 'nobody else answered the call');
    },
  },
  {
    name: 'answered, teaching fail: ring only the kitchen → Kev answers it, Lin takes her call → fail',
    expect: { result: 'fail' },
    play({ run, log, g }) {
      run('pretend until 3:18');
      go(run, 'ring_kitchen');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'kitchen', 'kev'), 'Kev did not answer the kitchen phone');
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },

  // busy: the boss answers Lin's phone while she is in the kitchen, and he is still on her line at 3:30.
  {
    name: "busy: ring Lin's phone late in her tea break → the boss answers it, still on her line at 3:30 → win",
    expect: { result: 'win', routes: ['busy'] },
    play({ run, log, g }) {
      run('pretend until 3:20');
      go(run, 'ring_lin');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'lin', 'boss'), "the boss did not answer Lin's phone");
      must(saw(log, 'interview:busy'), 'the line was not busy');
    },
  },
  {
    name: "busy, teaching fail: ring Lin's phone while she is at her desk → she hangs up at once → fail",
    expect: { result: 'fail' },
    play({ run, log, g }) {
      run('pretend until 3:01');
      go(run, 'ring_lin');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'lin', 'lin'), 'Lin did not answer her own phone');
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },

  // unplugged: the boss is on his own phone with his back to the room, Lin is in the kitchen, and Kev has been to the
  // socket to charge his mobile (about 3:12) and gone.
  {
    name: "unplugged: ring the boss, pull Lin's cord after Kev's charging stop → it never rings → win",
    expect: { result: 'win', routes: ['unplugged'] },
    play({ run, log, g }) {
      run('pretend until 3:12');
      go(run, 'ring_boss');
      run('interact');
      go(run, 'lin_socket');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(saw(log, 'cord:out') && !saw(log, 'cord:in'), 'the cord was not left out');
      must(saw(log, 'interview:dead'), 'the phone rang');
    },
  },
  {
    name: "unplugged, teaching fail: ring the boss and pull the cord before Kev's charging stop → he jams it back in → fail",
    expect: { result: 'fail' },
    play({ run, log, g }) {
      run('pretend until 3:02');
      go(run, 'ring_boss');
      run('interact');
      go(run, 'lin_socket');
      run('wait until 3:06'); // Lin is off to the kitchen
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(saw(log, 'cord:out') && kevJammed(log), 'Kev did not jam it back in');
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },

  // ringout: Kev and Lin are on hold as for answered, and the boss is on his own phone too. Nobody answers.
  {
    name: 'ringout: ring Kev, the kitchen, then the boss → nobody is free at 3:30 → win',
    expect: { result: 'win', routes: ['ringout'] },
    play({ run, log, g }) {
      run('pretend until 3:18');
      go(run, 'ring_kev');
      run('interact');
      go(run, 'ring_kitchen');
      run('interact');
      run('pretend until 3:25');
      go(run, 'ring_boss');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'boss', 'boss'), 'the boss did not answer his phone');
      must(saw(log, 'interview:rangOut'), 'it did not ring out');
    },
  },
  {
    name: 'ringout, teaching fail: ring only the boss → Lin is back at her desk and takes her call → fail',
    expect: { result: 'fail' },
    play({ run, log, g }) {
      run('pretend until 3:25');
      go(run, 'ring_boss');
      run('interact');
      backToDesk(run);
      toTheEnd(run, g);
      must(rang(log, 'boss', 'boss'), 'the boss did not answer his phone');
      must(saw(log, 'interview:lin'), 'Lin never took her call');
    },
  },
];
