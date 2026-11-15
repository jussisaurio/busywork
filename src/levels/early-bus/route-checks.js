// The Last Bus's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
// At your desk you type ('pretend' while seated); walking about you take a call ('goto ... pretend'): the boss
// sends anyone he sees standing around back to work.
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
    name: 'wait at the bus stop from 3:00 → the boss comes back from lunch past it → caught in the street',
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
      ctx.run('pretend until 3:23');
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
      need(ctx.log, 'boss:desk', 'he never looked at your empty chair', (p) => p.empty);
      need(ctx.log, 'boss:hunt', 'he never came looking');
      need(ctx.log, 'caught', 'caught, but not in the street', (p) => p.reason === 'scene');
    },
  },
  {
    // The teaching fail: he looks up at his clock (a clock face) every quarter hour or so, and it hangs right behind
    // his chair. You are on the stepladder when he turns round.
    name: "push the boss's clock behind his back too close to 3:35 → he looks up at it → caught",
    expect: { result: 'caught' },
    play(ctx) {
      const { run, log } = ctx;
      run('pretend until 3:29');
      run('goto boss_clock pretend');
      run('interact');
      run('interact');
      run('interact');
      until(ctx, 'wait 1s', (g) => !!g.caught);
      const caught = log.find((e) => e.name === 'caught');
      const look = log.find((e) => e.name === 'clock:look' && e.payload?.id === 'boss' && caught && e.minute <= caught.minute && caught.minute - e.minute < 1);
      if (!look) throw new Error('caught, but not by his look up at the clock');
    },
  },
  {
    // Out at the stop while he is still in: he is still looking for you when the bus comes, and you don't get on.
    name: 'slip out at 4:24 → his look at your empty chair → at 4:30 his coat is still on the rack: back to your desk, the bus goes → fail',
    expect: { result: 'fail' },
    play(ctx) {
      ctx.run('pretend until 4:24');
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
      need(ctx.log, 'boss:hunt', 'he never came looking');
      if (ctx.g.outcome?.why !== 'stop') throw new Error('not at the stop');
    },
  },
  {
    // Told about the stepladder, the boss sets the clock right before he sits down again.
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
    // His clock jumps while you are still in his office: he looks from it to you, and sets it right.
    name: "push the boss's clock, but still in his office when he looks up at 3:35 → he looks at you → sets it right → fail",
    expect: { result: 'fail' },
    play(ctx) {
      const { run, log } = ctx;
      run('pretend until 3:24');
      run('goto boss_clock pretend');
      run('interact');
      run('interact');
      run('interact');
      until(ctx, 'pretend until 3:38', (g) => g.clock.minute >= 38);
      need(log, 'clock:jump', 'his clock never jumped', (p) => p.id === 'boss');
      need(log, 'boss:suspect', 'he never looked at you');
      need(log, 'clock:reset', 'he never set his clock right', (p) => p.clock === 'boss');
      sit(ctx);
      finish(ctx);
      if (has(log, 'boss:coat')) throw new Error('he went home early anyway');
    },
  },
  {
    name: "Lin in the restroom, the boss's back turned: his clock +30, back at your desk before he looks up → he takes his coat at 4:20 → follow him out → win",
    expect: { result: 'win', routes: ['clock'] },
    play(ctx) {
      const { run, log, waitFor, npc } = ctx;
      run('pretend until 3:22');
      run('wait 1.3s');
      run('goto boss_clock pretend');
      run('interact');
      run('interact');
      run('interact');
      sit(ctx);
      need(log, 'clock:jump', 'his clock never jumped', (p) => p.id === 'boss');
      if (has(log, 'boss:suspect')) throw new Error('he saw you in his office');
      waitFor((g) => g.world.coat !== 'hook', { maxSec: 200 });
      need(log, 'boss:coat', 'he never took his coat');
      waitFor(() => npc('boss').y >= 14, { maxSec: 60 }); // out behind him, never in front of him
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
    },
  },
  {
    // Route 2: the open-plan clock while Kev fetches his coffee. On his way back from his own coffee the boss walks
    // under it, sees home time and goes; Lin and Kev, who have been eyeing his coat, follow him out.
    name: 'open-plan clock +60 while Kev gets coffee → Lin and Kev eye the coat → the boss reads it after his coffee → all go → win',
    expect: { result: 'win', routes: ['herd'] },
    play(ctx) {
      const { run, log, waitFor } = ctx;
      run('goto open_clock pretend');
      for (let i = 0; i < 6; i++) run('interact');
      sit(ctx);
      waitFor((g) => g.world.bossGone, { maxSec: 200 });
      need(log, 'coat:seen', 'Lin never looked at his coat while it was there', (p) => p.by === 'lin' && p.coat);
      need(log, 'boss:herd', 'he never read home time on the open-plan clock');
      const left = (id) => log.find((e) => e.name === `${id}:left`);
      if (!left('boss')) throw new Error('the boss never left');
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
      for (const id of ['lin', 'kev']) {
        if (!left(id) || left(id).minute < left('boss').minute) throw new Error(`${id} did not follow him out`);
      }
    },
  },
  {
    name: 'route 2, but you are still at your desk → blamed',
    expect: { result: 'blamed', routes: ['herd'] },
    play(ctx) {
      ctx.run('goto open_clock pretend');
      for (let i = 0; i < 6; i++) ctx.run('interact');
      sit(ctx);
      finish(ctx);
    },
  },
  {
    name: 'open-plan clock only +50 → 4:49 when he walks under it → a shrug → fail',
    expect: { result: 'fail' },
    play(ctx) {
      const { run, log } = ctx;
      run('goto open_clock pretend');
      for (let i = 0; i < 5; i++) run('interact');
      sit(ctx);
      finish(ctx);
      need(log, 'boss:shrug', 'he never shrugged at the open-plan clock');
      if (has(log, 'boss:herd')) throw new Error('he went home by it');
    },
  },
  {
    name: 'route 2, then straight to the bus stop → the boss, back from lunch, walks past it → caught in the street',
    expect: { result: 'caught' },
    play(ctx) {
      const { run, log } = ctx;
      run('goto open_clock pretend');
      for (let i = 0; i < 6; i++) run('interact');
      until(ctx, 'goto bus_stop pretend', near('bus_stop'));
      finish(ctx);
      need(log, 'caught', 'caught, but not in the street', (p) => p.reason === 'scene');
    },
  },
];
