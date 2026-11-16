// The Audit's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
// The auditor ticks the desks in index.js INSPECTIONS order: 0 the boss's, 1 Lin's, 2 yours, 3 Kev's. A ❌ doesn't
// stop him: he finishes his list and fires you at the sign-off (result 'fail', outcome.why: whose desk).
import { npcSees } from '../../game/perception.js';
import { LAPTOPS } from './spots.js';
import { headDown } from './presentation.js';

const ev = (log, name, p = {}) => log.find((e) => e.name === name && Object.entries(p).every(([k, v]) => e.payload?.[k] === v));
const failedAt = (log) => ev(log, 'inspect:fail')?.payload.index;
const HOME = ['put your_desk', 'goto my_seat pretend', 'sit']; // the laptop onto your desk, sit

// The card's rule binds everyone (DESIGN.md): no coworker carries a laptop where the auditor, on duty, sees it.
// Kev's walk home behind the auditor's back while he fights his pen, the boss's walk home with his laptop before the auditor is on
// the floor: if either strays into his view, the level shows a rule that binds only you.
function carriedInView(g) {
  const a = g.npcs.find((n) => n.id === 'auditor');
  if (!a || (g.level.roles.authority.offDuty ?? []).includes(a.override)) return null;
  const n = g.npcs.find((o) => o !== a && LAPTOPS.includes(o.carry) && npcSees(g, a, o.x, o.y));
  return n && `${n.id} carries ${n.carry} in the auditor's view at ${g.clock.minute.toFixed(2)}`;
}
// Pretend to the end of the day in small slices, looking for that every slice.
function sitOut({ waitFor }) {
  let seen = null;
  waitFor((g) => { seen ??= carriedInView(g); return false; }, { maxSec: 200 });
  if (seen) throw new Error(seen);
}
const home = (ctx, cmds) => { for (const c of [...cmds, ...HOME]) ctx.run(c); sitOut(ctx); };

// After a ❌ he goes on down his list: Kev's desk still gets its tick, and the sign-off fires you.
function goesOn(log) {
  if (!ev(log, 'inspect:pass', { index: 3 })) throw new Error('after the ❌ he should go on and tick Kev\'s desk');
  if (!ev(log, 'audit:fired')) throw new Error('he should fire you at the sign-off');
}

export default [
  {
    name: 'do nothing: Kev forgets his laptop on your desk and fetches it (💻🤦) → ❌ at your desk, fired',
    expect: { result: 'fail' },
    play(ctx) {
      const { log, g: game } = ctx;
      sitOut(ctx);
      const forgot = ev(log, 'kev:forgot'), fetched = ev(log, 'kev:fetched');
      if (!forgot || !fetched || fetched.minute > 21) throw new Error('Kev should leave his laptop on your desk at lunch and fetch it');
      if (failedAt(log) !== 2) throw new Error(`expected the ❌ at your desk, got check ${failedAt(log)}`);
      if (!ev(log, 'auditor:phone') || !ev(log, 'auditor:call')) throw new Error('his phone should ring after your desk, every loop');
      goesOn(log);
      if (game.outcome.why !== 'you') throw new Error(`the end card should name your desk, got ${game.outcome.why}`);
    },
  },
  {
    name: 'the boss smokes after his tick: his laptop once the auditor has walked off for a pen, onto your desk → win',
    expect: { result: 'win', routes: ['boss'] },
    play: (ctx) => home(ctx, ['goto boss_desk pretend', 'pretend until 3:39.6', 'interact', 'wait until 3:41.3']),
  },
  {
    name: 'Lin\'s laptop once the auditor has walked off for a pen, onto your desk while he is in the meeting room → win',
    expect: { result: 'win', routes: ['lin'] },
    play(ctx) {
      const { log, npc } = ctx;
      home(ctx, ['goto hallway_west pretend', 'pretend until 3:39.6', 'interact', 'wait until 3:41.3']);
      // E1 (cold-read.md): the lift happens once he has left her desk for the pen, not at his elbow.
      const lift = ev(log, 'item:pickup', { type: 'laptop_lin' }), pen = ev(log, 'inspect:pass', { index: 1 });
      if (!lift || !pen || lift.minute < pen.minute + 2.2) throw new Error('the lift should come after he leaves Lin\'s desk');
      if (npc('auditor')._penDone !== true) throw new Error('he should fetch a pen from the meeting room');
    },
  },
  {
    name: 'Kev\'s laptop onto your desk while he\'s in the kitchen: he strolls in and takes it home, openly, behind the auditor fighting his dry pen at your desk → win',
    expect: { result: 'win', routes: ['kev'] },
    play(ctx) {
      const { log, npc, waitFor } = ctx;
      for (const c of ['pretend until 3:24', 'goto kev_desk', 'interact', ...HOME]) ctx.run(c);
      // The two in one frame: Kev's 💻🤦 lands while the auditor stands at your desk head down over his pen.
      let atFetch = null;
      waitFor((g) => { if (g.world.laptop_kev === 'kev') atFetch ??= headDown(npc('auditor')); return g.world.laptop_kev === 'kev_desk'; }, { maxSec: 90 });
      sitOut(ctx);
      const tick = ev(log, 'inspect:pass', { index: 2 }), fetched = log.filter((e) => e.name === 'kev:fetched').pop();
      const ring = ev(log, 'auditor:phone');
      if (!tick || !fetched || fetched.minute < tick.minute) throw new Error('Kev should fetch his laptop after your desk is ticked');
      if (!ring || fetched.minute > ring.minute) throw new Error('Kev should take his laptop before the auditor\'s phone rings');
      if (atFetch !== 3) throw new Error(`Kev should take it while the auditor fights his pen at your desk (headDown ${atFetch})`);
      if (!log.some((e) => e.name === 'say' && e.payload.owner === 'kev' && e.payload.icons.includes('🎵'))) throw new Error('Kev should hum on his way home');
    },
  },
  {
    name: 'Lin\'s laptop in hand, sat at your desk as the auditor ticks it → caught (nothing hides a laptop)',
    expect: { result: 'caught' },
    cmds: ['goto hallway_west pretend', 'pretend until 3:39.6', 'interact', 'wait until 3:41.3', 'goto my_seat', 'sit', 'wait until 3:47'],
  },
  {
    // Head down over his dry pen, he sees his clipboard and nothing past it: a hand at his elbow goes unseen. Gone
    // down the hallway before he looks up, you're out of his sight.
    name: 'Lin\'s laptop at his elbow while he shakes his dry pen at her desk, then off down the hallway before he looks up → win',
    expect: { result: 'win', routes: ['lin'] },
    play(ctx) {
      const { log } = ctx;
      home(ctx, ['goto hallway_west pretend', 'pretend until 3:37', 'interact']);
      const lift = ev(log, 'item:pickup', { type: 'laptop_lin' }), tick = ev(log, 'inspect:pass', { index: 1 });
      if (!lift || !tick || lift.minute > tick.minute + 2) throw new Error('the lift should come while he fights his pen at her desk');
    },
  },
  {
    name: 'Lin\'s laptop from her own chair while the auditor shakes his dry pen, still there when he looks up → caught',
    expect: { result: 'caught' },
    cmds: ['pretend until 3:35', 'goto lin_desk pretend', 'interact', 'wait 3s'],
  },
  {
    name: 'Lin\'s laptop while she\'s in the restroom, onto your desk → 💻❓, she stays at her desk, ❌ at her desk, fired',
    expect: { result: 'fail' },
    play(ctx) {
      const { run, log, g: game, npc } = ctx;
      for (const c of ['goto hallway_west pretend', 'pretend until 3:12', 'interact', 'goto pens', 'wait until 3:20.5', 'put your_desk', 'goto my_seat pretend', 'sit', 'pretend until 3:22.5']) run(c);
      if (!ev(log, 'laptop:missing', { by: 'lin' })) throw new Error('Lin should miss her laptop');
      run('pretend until 3:26');
      if (npc('lin').override === 'hunt' || Math.hypot(npc('lin').x - 4.5, npc('lin').y - 9.5) > 0.5) throw new Error('Lin, back at 3:22, should stay at her desk: the auditor is on the floor');
      sitOut(ctx);
      if (failedAt(log) !== 1) throw new Error(`expected the ❌ at Lin's desk, got check ${failedAt(log)}`);
      goesOn(log);
      if (game.outcome.why !== 'lin') throw new Error(`the end card should name Lin's desk, got ${game.outcome.why}`);
    },
  },
  {
    name: 'Lin\'s laptop onto Kev\'s desk while he\'s at lunch → back with his own, he puts it in his drawer 💻❓',
    expect: { result: 'fail' },
    play(ctx) {
      const { run, log, npc } = ctx;
      for (const c of ['pretend until 3:11.5', 'goto hallway_west pretend', 'interact', 'goto kev_desk', 'interact', 'pretend until 3:23']) run(c);
      if (!ev(log, 'laptop:drawer', { type: 'laptop_kev', by: 'kev' })) throw new Error('Kev, his desk taken, should put his laptop in his drawer');
      if (npc('kev').carry) throw new Error(`Kev should not hold ${npc('kev').carry}`);
      sitOut(ctx); // the auditor stands at Kev's desk at the end: no laptop in Kev's hands
    },
  },
  {
    name: 'the boss\'s laptop while Lin is in the restroom, onto your desk → he sees it from the hallway, walks over and takes it home 😠💻',
    expect: { result: 'fail' },
    play(ctx) {
      const { log } = ctx;
      home(ctx, ['goto office_door pretend', 'pretend until 3:11.4', 'goto boss_desk', 'interact', 'goto hallway_mid', 'wait until 3:20']);
      if (!ev(log, 'laptop:missing', { by: 'boss' })) throw new Error('the boss should miss his laptop');
      const spotted = ev(log, 'laptop:spotted', { type: 'laptop_boss', by: 'boss' });
      const back = ev(log, 'laptop:reclaimed', { type: 'laptop_boss', by: 'boss' });
      const home_ = ev(log, 'laptop:home', { type: 'laptop_boss', by: 'boss' });
      if (!spotted || !back || !home_) throw new Error('the boss should see it on your desk, take it there, and carry it home');
      // The replay read: the take-back happened off camera, from 4.5 tiles. Now he takes it standing at your desk.
      if (back.minute - spotted.minute < 0.5) throw new Error('the boss should walk to your desk before he takes it');
      if (failedAt(log) !== 2) throw new Error(`expected the ❌ at your desk, got check ${failedAt(log)}`);
    },
  },
  {
    name: 'the boss\'s laptop during his smoke → Lin sees through the glass, tells the auditor when he arrives',
    expect: { result: 'fail' },
    play(ctx) {
      const { run, log } = ctx;
      for (const c of ['pretend until 3:06.5', 'goto boss_desk pretend', 'interact']) run(c);
      sitOut(ctx);
      if (!ev(log, 'witness:tattle', { by: 'lin', late: true })) throw new Error('Lin should tell the auditor when he arrives');
    },
  },
  {
    name: 'a coffee from the hallway pot: hands full, Kev\'s laptop won\'t come; drunk, it does',
    expect: { result: 'fail' },
    play(ctx) {
      const { run, g: game } = ctx;
      for (const c of ['goto hallway_coffee', 'interact']) run(c);
      if (game.player.held !== 'coffee') throw new Error('the pot should pour a cup');
      for (const c of ['pretend until 3:24', 'goto kev_desk', 'interact']) run(c);
      if (game.player.held !== null) throw new Error('with a cup in hand, interact should drink it, not take the laptop');
      run('interact');
      if (game.player.held !== 'laptop_kev') throw new Error('hands empty, the laptop should come');
      for (const c of ['put kev_desk', 'goto my_seat pretend', 'sit']) run(c);
      sitOut(ctx);
    },
  },
];
