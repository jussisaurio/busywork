// The Last Bus's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
// At your desk you type ('pretend' while seated); walking about you take a call ('goto ... pretend'): the boss
// sends anyone he sees standing around back to work.
// He is out at lunch until 3:40, back past the bus stop, a coffee, and under the open-plan clock (O) to his desk and
// his own clock (Q) at about 3:57.
const BUS = 'pretend until 4:30';
const has = (log, name, f = () => true) => log.some((e) => e.name === name && f(e.payload ?? {}));
const need = (log, name, what, f) => {
  if (!has(log, name, f)) throw new Error(what);
};
// Commands stop at whatever happens: run one until it gets there, or the day ends.
function until(ctx, cmd, done) {
  for (let i = 0; i < 40 && ctx.g.phase === 'day' && !done(ctx.g); i++) ctx.run(cmd);
}
const finish = (ctx) => until(ctx, BUS, () => false);
const near = (spot) => (g) => {
  const s = g.level.spots[spot];
  return Math.hypot(g.player.x - s.x, g.player.y - s.y) < 0.6;
};
// Back to the desk on the phone, and sit down to type.
const sit = (ctx) => {
  until(ctx, 'goto my_seat pretend', near('player_desk'));
  ctx.run('sit');
};

// Push a clock n times from wherever you are.
const push = (ctx, clock, n) => {
  ctx.run(`goto ${clock} pretend`);
  for (let i = 0; i < n; i++) ctx.run('interact');
};

export default [
  { name: 'do nothing → fail', expect: { result: 'fail' }, cmds: [BUS] },
  {
    // The rule, on screen, before anyone has done anything: Kev picks up his laptop to go, sees the boss's coat on
    // the rack (the boss is still out at lunch), and sits down again.
    name: "a normal day: at 3:13 Kev picks up his laptop, sees the boss's coat on the rack, and stays",
    expect: { result: 'fail' },
    play({ run, log }) {
      run('pretend until 3:15');
      need(log, 'coat:seen', 'Kev never looked at the coat', (p) => p.by === 'kev' && p.coat && p.early);
      if (has(log, 'kev:left')) throw new Error('Kev went');
      run(BUS);
    },
  },
  {
    // Nobody leaves before him: back from lunch through the street, he finds you at the bus stop.
    name: 'wait at the bus stop from 3:00 → the boss comes back from lunch past it at 3:40 → caught in the street',
    expect: { result: 'caught' },
    play(ctx) {
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
      need(ctx.log, 'caught', 'caught, but not in the street', (p) => p.reason === 'scene');
    },
  },
  {
    // The rule: he looks at his clock, then at your desk. Your chair empty: he comes looking for you, and seen out
    // at the bus stop while he is still in, you are caught.
    name: 'slip out after he is back → his look at your empty chair → he comes looking → caught in the street',
    expect: { result: 'caught' },
    play(ctx) {
      ctx.run('pretend until 4:00');
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
      need(ctx.log, 'boss:desk', 'he never looked at your empty chair', (p) => p.empty);
      need(ctx.log, 'boss:hunt', 'he never came looking');
      need(ctx.log, 'caught', 'caught, but not in the street', (p) => p.reason === 'scene');
    },
  },
  {
    // The teaching fail: back from his coffee he walks into his office, and you are up the stepladder at his clock.
    name: "push the boss's clock as he comes back from his coffee → he walks in on you on the stepladder → caught",
    expect: { result: 'caught' },
    play(ctx) {
      ctx.run('pretend until 3:52');
      ctx.run('goto boss_clock pretend');
      until(ctx, 'interact', (g) => !!g.caught);
      until(ctx, 'wait 1s', (g) => !!g.caught);
      need(ctx.log, 'caught', 'not caught by the boss', (p) => p.by === 'boss');
    },
  },
  {
    // Out at the stop while he is still in: his look at your empty chair, he rings you and comes looking. Still
    // looking when the bus comes: back to your desk.
    name: 'slip out at 4:24 → his look at your empty chair → he rings you, comes looking → at 4:30 back to your desk, the bus goes → fail',
    expect: { result: 'fail' },
    play(ctx) {
      ctx.run('pretend until 4:24');
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
      need(ctx.log, 'boss:hunt', 'he never came looking');
      need(ctx.log, 'boss:call', 'he never rang you');
      if (ctx.g.outcome?.why !== 'stop') throw new Error('not at the stop');
    },
  },
  {
    // After his 4:25 look he looks once more at 4:28, before the bus comes.
    name: 'slip out right after his 4:25 look → he looks again at 4:28, rings you → fail',
    expect: { result: 'fail' },
    play(ctx) {
      ctx.run('pretend until 4:25');
      ctx.run('wait 2s'); // his look at the clock, then at your desk: you are there
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
      need(ctx.log, 'boss:call', 'he never rang you');
    },
  },
  {
    // Told about the stepladder, the boss sets the clock right when he is back from lunch.
    name: "push the boss's clock while Lin watches it through the glass → she tells him → work, and he sets it right → fail",
    expect: { result: 'fail' },
    play(ctx) {
      const { run, log } = ctx;
      run('goto boss_clock pretend');
      until(ctx, 'interact', (g) => g.world.bossClock > 0); // her shout stops the first try or two
      sit(ctx);
      finish(ctx);
      need(log, 'witness:tattle', 'Lin never tattled', (p) => p.by === 'lin');
      need(log, 'boss:workAssigned', 'no work assigned');
      need(log, 'clock:reset', 'he never set his clock right', (p) => p.clock === 'boss');
    },
  },
  {
    // Kev, under O all afternoon, sees it jump: he frowns and keeps his own time.
    name: 'Kev back from his coffee to an open-plan clock 30 minutes on → 🤨, he keeps his own time',
    expect: { result: 'fail' },
    play(ctx) {
      push(ctx, 'open_clock', 3);
      sit(ctx);
      ctx.run('pretend until 3:15');
      need(ctx.log, 'clock:doubt', 'Kev never frowned at the clock', (p) => p.id === 'kev');
      if (ctx.log.some((e) => e.name === 'clock:jump' && e.payload?.id === 'kev')) throw new Error('Kev believed it');
      finish(ctx);
    },
  },
  {
    // Only his own clock: back from lunch he has just read the true time under O. Q disagrees: 🤨, he sets it right.
    name: "Lin in the restroom: the boss's clock +30 alone → under O he reads the true time → Q disagrees: 🤨, he sets it right → fail",
    expect: { result: 'fail' },
    play(ctx) {
      const { run, log } = ctx;
      run('pretend until 3:22');
      run('wait 1.3s');
      push(ctx, 'boss_clock', 3);
      sit(ctx);
      finish(ctx);
      need(log, 'boss:mismatch', 'he never frowned at his clock');
      need(log, 'clock:reset', 'he never set his clock right', (p) => p.clock === 'boss');
      if (has(log, 'boss:coat')) throw new Error('he went home early anyway');
    },
  },
  {
    // His clock moved and you are in his office when he looks up: he looks from it to you, and sets it right.
    name: "the boss's clock +30, and you are still in his office when he sits down → he looks from his clock to you → sets it right → fail",
    expect: { result: 'fail' },
    play(ctx) {
      const { run, log } = ctx;
      run('pretend until 3:22');
      run('wait 1.3s');
      push(ctx, 'boss_clock', 3);
      until(ctx, 'pretend until 4:00', (g) => g.clock.minute >= 60);
      need(log, 'boss:suspect', 'he never looked at you');
      need(log, 'clock:reset', 'he never set his clock right', (p) => p.clock === 'boss');
      sit(ctx);
      finish(ctx);
      if (has(log, 'boss:coat')) throw new Error('he went home early anyway');
    },
  },
  {
    // Arm's length: the stepladder is right behind his chair, and Lin is watching through the glass.
    name: "push the boss's clock behind his back while he sits at his desk → Lin shouts, he turns → work → fail",
    expect: { result: 'fail' },
    play(ctx) {
      const { run, log } = ctx;
      run('pretend until 4:00');
      push(ctx, 'boss_clock', 1);
      sit(ctx);
      finish(ctx);
      need(log, 'witness:tattle', 'Lin never shouted', (p) => p.by === 'lin');
      if (ctx.g.world.bossClock) throw new Error('his clock stayed pushed');
      if (has(log, 'boss:coat')) throw new Error('he went home early anyway');
    },
  },
  {
    // Route 1: both clocks, so they agree. The first clock he sees after lunch says 4:24, and so does his own.
    name: "both clocks +30 (O while Kev gets coffee, Q while Lin is in the restroom) → they agree: he takes his coat at 4:20, Lin and Kev follow → follow him out → win",
    expect: { result: 'win', routes: ['clock'] },
    play(ctx) {
      const { run, log, waitFor, npc } = ctx;
      push(ctx, 'open_clock', 3);
      sit(ctx);
      run('pretend until 3:22');
      run('wait 1.3s');
      push(ctx, 'boss_clock', 3);
      sit(ctx);
      waitFor((g) => g.world.coat !== 'hook', { maxSec: 200 });
      need(log, 'boss:readO', 'he never read the open-plan clock', (p) => p.off === 30);
      if (has(log, 'boss:mismatch') || has(log, 'boss:suspect')) throw new Error('he doubted his clock');
      need(log, 'boss:coat', 'he never took his coat');
      waitFor(() => npc('boss').y >= 14, { maxSec: 60 }); // out behind him, never in front of him
      for (const id of ['lin', 'kev']) need(log, 'coat:follow', `${id} never followed him`, (p) => p.by === id);
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
    },
  },
  {
    // Route 2: the open-plan clock while Kev fetches his coffee. Kev frowns at it and keeps his own time; the boss,
    // back from lunch with his coffee, walks under it: the first clock he has seen for an hour says home time, and
    // he goes from the hallway, never seeing his own.
    name: 'open-plan clock +60 while Kev gets coffee → Kev frowns → back from lunch the boss reads 4:54 under it → straight home, Lin and Kev shrug and follow → win',
    expect: { result: 'win', routes: ['herd'] },
    play(ctx) {
      const { run, log, waitFor, npc } = ctx;
      push(ctx, 'open_clock', 6);
      sit(ctx);
      waitFor((g) => g.world.coat !== 'hook', { maxSec: 200 });
      need(log, 'clock:doubt', 'Kev never frowned at the clock', (p) => p.id === 'kev');
      need(log, 'boss:herd', 'he never read home time on the open-plan clock');
      if (log.some((e) => e.name === 'clock:look' && e.payload?.id === 'boss' && e.payload.clock === 'boss_clock')) throw new Error('he looked at his own clock');
      waitFor(() => npc('boss').y >= 14, { maxSec: 60 });
      // Lin and Kev doubted the clock, but they obey the coat: a look at it, at each other, a shrug, and out after him.
      for (const id of ['lin', 'kev']) need(log, 'coat:shrug', `${id} never shrugged at the coat`, (p) => p.by === id);
      waitFor((g) => g.world.linGone && g.world.kevGone, { maxSec: 60 });
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
    },
  },
  {
    name: 'route 2, but you are still at your desk → blamed',
    expect: { result: 'blamed', routes: ['herd'] },
    play(ctx) {
      push(ctx, 'open_clock', 6);
      sit(ctx);
      finish(ctx);
      if (!ctx.g.world.linGone || !ctx.g.world.kevGone) throw new Error('Lin and Kev stayed with you');
    },
  },
  {
    name: 'open-plan clock only +50 → he reads 4:44 under it, then his own clock disagrees → 🤨, he sets them right → fail',
    expect: { result: 'fail' },
    play(ctx) {
      const { log } = ctx;
      push(ctx, 'open_clock', 5);
      sit(ctx);
      finish(ctx);
      need(log, 'boss:readO', 'he never read the open-plan clock', (p) => p.off === 50);
      need(log, 'boss:mismatch', 'he never frowned at his clock');
      need(log, 'clock:reset', 'he never set the open-plan clock right', (p) => p.clock === 'open');
      if (has(log, 'boss:herd')) throw new Error('he went home by it');
    },
  },
  {
    name: 'route 2, then straight to the bus stop → the boss, back from lunch, walks past it → caught in the street',
    expect: { result: 'caught' },
    play(ctx) {
      const { log } = ctx;
      push(ctx, 'open_clock', 6);
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
      need(log, 'caught', 'caught, but not in the street', (p) => p.reason === 'scene');
    },
  },
];
