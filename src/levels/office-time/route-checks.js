// Office Time's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
const BUS = 'pretend until 4:30';

export default [
  { name: 'do nothing → fail', expect: { result: 'fail' }, cmds: ['wait until 4:30'] },
  {
    // The foreshadowing: while Lin is in the restroom the boss turns to her empty desk and wonders where she is.
    name: "a normal day: the boss turns to Lin's empty desk while she is in the restroom",
    expect: { result: 'fail' },
    play({ run, log }) {
      run('pretend until 3:28');
      const f = log.find((e) => e.name === 'boss:frown' && e.payload?.at === 'lin' && !e.payload?.gone);
      if (!f) throw new Error('the boss never noticed her empty desk');
      run('sit');
      run(BUS);
    },
  },
  {
    // The teaching fail: he looks up at his clock (🕐) every quarter hour or so, and it hangs right behind his chair.
    // You are on the stepladder when he turns round.
    name: "push the boss's clock behind his back too close to 3:30 → he looks up at it → caught",
    expect: { result: 'caught' },
    play({ run, log }) {
      run('pretend until 3:25');
      run('goto boss_clock pretend');
      run('interact');
      run('interact');
      run('interact');
      const caught = log.find((e) => e.name === 'caught');
      const look = log.find((e) => e.name === 'clock:look' && e.payload?.id === 'boss' && caught && e.minute <= caught.minute && caught.minute - e.minute < 1);
      if (!look) throw new Error('caught, but not by his look up at the clock');
    },
  },
  {
    name: "push the boss's clock while Lin watches it through the glass → she tells him → work → fail",
    expect: { result: 'fail' },
    play({ run, log }) {
      run('goto boss_clock pretend');
      run('interact');
      run('sit');
      run(BUS);
      if (!log.some((e) => e.name === 'witness:tattle' && e.payload?.by === 'lin')) throw new Error('Lin never tattled');
      if (!log.some((e) => e.name === 'boss:workAssigned')) throw new Error('no work assigned');
    },
  },
  {
    name: "Lin in the restroom, the boss's back turned: his clock +30 → he leaves at 4:20 → win",
    expect: { result: 'win', routes: ['clock'] },
    cmds: ['pretend until 3:20', 'goto boss_clock pretend', 'interact', 'interact', 'interact', 'goto bus_stop pretend', BUS],
  },
  {
    name: "open-plan clock +10 sends Lin to the restroom early, the boss's clock +30 before he is back → win",
    expect: { result: 'win', routes: ['clock'] },
    cmds: ['goto open_clock pretend', 'interact', 'goto boss_clock pretend', 'pretend until 3:12', 'interact', 'interact', 'interact', 'goto bus_stop pretend', BUS],
  },
  {
    name: 'open-plan clock +40 while Kev gets coffee → Lin and Kev go home at 4:11 → the boss follows the herd → win',
    expect: { result: 'win', routes: ['herd'] },
    cmds: ['goto open_clock pretend', 'interact', 'interact', 'interact', 'interact', 'goto bus_stop pretend', BUS],
  },
  {
    name: 'the herd, but you are still at your desk → blamed',
    expect: { result: 'blamed', routes: ['herd'] },
    cmds: ['goto open_clock pretend', 'interact', 'interact', 'interact', 'interact', 'sit', BUS],
  },
  {
    name: 'open-plan clock only +30 → they leave at 4:21, the boss frowns and packs up too late → fail',
    expect: { result: 'fail' },
    play({ run, log }) {
      run('goto open_clock pretend');
      run('interact');
      run('interact');
      run('interact');
      run('goto bus_stop pretend');
      run(BUS);
      if (!log.some((e) => e.name === 'boss:herd')) throw new Error('the boss never followed the herd');
    },
  },
];
