// Second Thoughts' route checks for tools/routes.mjs (level 1's route-checks.js documents the format): the shortest
// winning plan for each route, and the fail each route teaches.
const sat = (g) => g.player.seated;
const atDesk = (run, g) => { // a soft stop (the lights coming back, say) can cut the walk short
  for (let i = 0; i < 4 && !sat(g); i++) run('sit pretend');
  if (!sat(g)) throw new Error('never got back to my seat');
};
const caughtFor = (g, reason) => {
  if (g.caught?.reason !== reason) throw new Error(`caught for ${g.caught?.reason ?? 'nothing'}, not ${reason}`);
};
const took = (log, how) => {
  const e = log.find((x) => x.name === 'letter:taken');
  if (!e) throw new Error('never took the letter');
  if (e.payload.how !== how) throw new Error(`took it ${e.payload.how}, not ${how}`);
};

// The breaker: pull it, step off onto the floor (on the phone, not standing about in his torch), wait for him to come
// out to the box, then in by his hallway door behind his back and take it.
const breakerTake = ({ run, waitFor, npc, log }) => {
  run('goto fuse_box pretend');
  run('interact');
  run('goto lin_desk pretend');
  if (!waitFor(() => npc('boss').override === 'waiting', { maxSec: 30 })) throw new Error('he never came out to the fuse box');
  run('goto desk_side pretend');
  run('goto desk_side pretend');
  run('interact');
  took(log, 'breaker');
};

export default [
  {
    name: 'do nothing → fail (he goes through his tray and reads it)',
    expect: { result: 'fail' },
    cmds: ['wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait until 3:41'],
  },
  {
    name: 'do nothing till 3:11: Lin\'s coffee machine only makes the lights flicker, and the fuse holds',
    expect: { result: 'fail' },
    play({ run, g, log }) {
      run('wait until 3:11');
      run('wait until 3:11');
      if (!log.some((e) => e.name === 'coffee:flicker')) throw new Error('no flicker at 3:10');
      if (log.some((e) => e.name === 'fuse:tripped') || g.world.fuse !== 'on') throw new Error('the fuse blew by itself');
      for (let i = 0; i < 4; i++) run('wait until 3:41');
    },
  },
  {
    name: 'switch: flip his lights at the hallway panel, walk off; take it while he is out at the panel → win',
    expect: { result: 'win', routes: ['switch'] },
    play({ run, waitFor, npc, g, log }) {
      run('goto office_switch pretend');
      run('interact'); // his office goes dark: ❓, he gets up to see why
      run('goto boss_office_door'); // away from the panel before he gets there
      if (!waitFor(() => npc('boss').y > 6, { busy: false, maxSec: 20 })) throw new Error('he never went out to the panel');
      run('goto tray');
      run('goto tray');
      run('interact');
      took(log, 'switch');
      atDesk(run, g);
    },
  },
  {
    name: 'switch: flip it and stay at the panel → he comes out and finds you there → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, g }) {
      run('goto office_switch pretend');
      run('interact');
      waitFor((gg) => gg.caught, { maxSec: 30 });
      caughtFor(g, 'evidence'); // pretending doesn't help: whoever is at the panel flipped it
    },
  },
  {
    name: 'blackout: pour the jug into the back vent of the coffee machine, Lin shorts it at 3:10, take it from beside his desk (off his torch) → win',
    expect: { result: 'win', routes: ['blackout'] },
    play({ run, g, log }) {
      run('goto 20,2 pretend'); // by the fridge, beside the machine: out of Kev's sight through the kitchen door
      run('interact'); // pour the jug into its back vent
      if (!g.world.rigged) throw new Error('never rigged the machine');
      run('goto my_seat');
      run('pretend until 3:11'); // stops when it shorts
      run('pretend 5s'); // and when the fuse blows
      if (g.world.fuse !== 'off' || g.world.fuseBy !== 'coffee') throw new Error('the coffee machine never blew the fuse');
      run('goto desk_side pretend');
      run('goto desk_side pretend');
      for (let i = 0; i < 3 && g.world.letter !== 'player'; i++) run('interact'); // Kev's unplugging can cut it short
      took(log, 'blackout');
      atDesk(run, g);
    },
  },
  {
    name: 'blackout: take it, then spend 3:40 in the kitchen → still a win (nobody knew the letter was there)',
    expect: { result: 'win', routes: ['blackout'] },
    play({ run, g, log }) {
      run('goto 20,2 pretend'); // by the fridge, beside the machine: out of Kev's sight through the kitchen door
      run('interact'); // pour the jug into its back vent
      if (!g.world.rigged) throw new Error('never rigged the machine');
      run('goto my_seat');
      run('pretend until 3:11'); // stops when it shorts
      run('pretend 5s'); // and when the fuse blows
      if (g.world.fuse !== 'off' || g.world.fuseBy !== 'coffee') throw new Error('the coffee machine never blew the fuse');
      run('goto desk_side pretend');
      run('goto desk_side pretend');
      for (let i = 0; i < 3 && g.world.letter !== 'player'; i++) run('interact'); // Kev's unplugging can cut it short
      took(log, 'blackout');
      const k = g.level.zones.kitchen; // off the floor: without the verdict this would be 'blamed'
      const inKitchen = () => g.player.x >= k.x0 && g.player.x < k.x1 && g.player.y >= k.y0 && g.player.y < k.y1;
      for (let i = 0; i < 3 && !inKitchen(); i++) run('goto kitchen_table'); // out by the side door; a torch's notice can cut the walk short
      if (!inKitchen()) throw new Error('not in the kitchen');
    },
  },
  {
    name: 'blackout: take it and wait in his office till the lights come back → he walks back in and sees it in your hand → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, g, log }) {
      run('goto 20,2 pretend');
      run('interact');
      run('goto my_seat');
      run('pretend until 3:11');
      run('pretend 5s');
      if (g.world.fuse !== 'off' || g.world.fuseBy !== 'coffee') throw new Error('the coffee machine never blew the fuse');
      if (g.npcs[0].override !== 'blackout' && g.npcs[0].override !== 'waiting') throw new Error('the boss stayed at his desk in the dark');
      run('goto desk_side pretend');
      run('goto desk_side pretend');
      for (let i = 0; i < 3 && g.world.letter !== 'player'; i++) run('interact');
      took(log, 'blackout');
      waitFor((gg) => gg.caught, { busy: false, maxSec: 60 });
      caughtFor(g, 'contraband');
    },
  },
  {
    name: 'blackout: pour the jug from the front of the counter → Kev sees you through the kitchen door ❓ then ❗👉 → desk work → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, g, log }) {
      run('goto coffee_machine pretend');
      try { run('interact'); } catch { /* stopped mid-tip */ }
      waitFor(() => log.some((e) => e.name === 'boss:workAssigned'), { busy: false, maxSec: 30 });
      const t = log.find((e) => e.name === 'witness:tattle');
      if (!(t && t.payload.by === 'kev' && t.payload.reason === 'action')) throw new Error('no tattle from Kev');
      if (g.world.rigged) throw new Error('the jug got poured anyway');
    },
  },
  {
    name: 'blackout: still pouring the jug when Lin walks in for her coffee → she shouts ❗👉 → desk work → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, g, log }) {
      run('goto 20,2 pretend'); // out of Kev's view: only Lin can catch you here
      run('pretend until 3:09');
      try { run('interact'); } catch { /* stopped mid-tip */ }
      waitFor(() => log.some((e) => e.name === 'boss:workAssigned'), { busy: false, maxSec: 30 });
      const t = log.find((e) => e.name === 'witness:tattle');
      if (!(t && t.payload.by === 'lin' && t.payload.reason === 'action')) throw new Error('no tattle from Lin');
      if (g.world.rigged) throw new Error('the jug got poured anyway');
    },
  },
  {
    name: 'breaker: pull it, step away, wait for him to come out to the box, take it, back to your seat → win',
    expect: { result: 'win', routes: ['breaker'] },
    play(ctx) {
      breakerTake(ctx);
      atDesk(ctx.run, ctx.g);
    },
  },
  {
    name: 'breaker: pull it and hang about at the fuse box → he comes out with his torch and finds you there → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, g }) {
      run('goto fuse_box pretend');
      run('interact');
      waitFor((gg) => gg.caught, { maxSec: 30 });
      caughtFor(g, 'evidence');
    },
  },
  {
    name: 'breaker, then eat it after 3:30 → still inside you at 3:40 → win (eaten)',
    expect: { result: 'win', routes: ['breaker'] },
    play(ctx) {
      const { run, g } = ctx;
      breakerTake(ctx);
      run('goto my_seat pretend'); run('goto my_seat pretend');
      for (let i = 0; i < 3; i++) run('wait until 3:32');
      run('move S 0.4s'); // at your desk E is the drawer
      run('eat');
      if (g.world.letter !== 'eaten') throw new Error('never ate it');
      for (let i = 0; i < 4 && !g.outcome; i++) run('wait until 3:41');
      if (g.outcome?.why !== 'eaten') throw new Error(`end card ${g.outcome?.why}, not eaten`);
    },
  },
  {
    name: 'breaker, then eat it about 3:28 → it comes up after he sat down to his tray → he finds the tray empty → win (eaten)',
    expect: { result: 'win', routes: ['breaker'] },
    play(ctx) {
      const { run, g, log } = ctx;
      breakerTake(ctx);
      run('goto my_seat pretend'); run('goto my_seat pretend');
      for (let i = 0; i < 3; i++) run('wait until 3:27');
      run('move S 0.4s');
      run('eat');
      if (g.world.letter !== 'eaten') throw new Error('never ate it');
      for (let i = 0; i < 6 && !g.outcome; i++) run('wait until 3:41');
      if (!log.some((e) => e.name === 'player:sick')) throw new Error('it never came up before 3:40');
      if (g.outcome?.why !== 'eaten') throw new Error(`end card ${g.outcome?.why}, not eaten`);
    },
  },
  {
    name: 'breaker, then eat it early → it comes back up, he comes over to see the retching and knows his envelope → caught (soggy)',
    expect: { result: 'caught' },
    play(ctx) {
      const { run, waitFor, g, log } = ctx;
      breakerTake(ctx);
      run('goto my_seat pretend'); run('goto my_seat pretend');
      run('move S 0.4s');
      run('eat');
      for (let i = 0; i < 4 && !log.some((e) => e.name === 'player:sick'); i++) run('wait until 3:30');
      if (!g.world.sick || g.world.letter !== 'puddle') throw new Error('it never came back up');
      waitFor((gg) => gg.caught, { maxSec: 120 });
      caughtFor(g, 'inspection');
      waitFor((gg) => gg.outcome, { maxSec: 30 });
      if (g.outcome?.why !== 'soggy') throw new Error(`end card ${g.outcome?.why}, not soggy`);
    },
  },
  {
    name: 'breaker, eat it early, then fish it back out of the sick and into your drawer before he gets there → win',
    expect: { result: 'win', routes: ['breaker'] },
    play(ctx) {
      const { run, g, log } = ctx;
      breakerTake(ctx);
      run('goto my_seat pretend'); run('goto my_seat pretend');
      run('move S 0.4s');
      run('eat');
      for (let i = 0; i < 4 && !log.some((e) => e.name === 'player:sick'); i++) run('wait until 3:30');
      if (g.world.letter !== 'puddle') throw new Error('it never came back up');
      for (let i = 0; i < 3 && g.world.letter === 'puddle'; i++) run('interact'); // pick it out of the puddle
      if (g.world.letter !== 'player') throw new Error('could not pick it out of the puddle');
      run('eat'); // once was enough: up to your lips, a gag, and it's still in your hand
      if (!log.some((e) => e.name === 'letter:gagged') || g.world.letter !== 'player') throw new Error('no gag at the soggy letter');
      run('goto my_seat'); run('goto my_seat');
      if (g.world.letter !== 'drawer') run('interact');
      if (g.world.letter !== 'drawer') throw new Error('never got it into the drawer');
      for (let i = 0; i < 4 && !g.outcome; i++) run('wait until 3:41');
    },
  },
  {
    name: 'after the brew, pull the breaker and pour a cup in the dark: the full pot pours with the power out',
    expect: { result: 'fail' },
    play({ run, g }) {
      run('wait until 3:15');
      run('goto fuse_box pretend'); run('goto fuse_box pretend');
      run('interact');
      if (g.world.fuse !== 'off' || g.world.coffee !== 'brewed') throw new Error('not dark with a full pot');
      run('goto coffee_machine pretend'); run('goto coffee_machine pretend');
      run('interact');
      if (g.player.held !== 'coffee') throw new Error('the full pot would not pour in the dark');
      for (let i = 0; i < 6 && !g.outcome; i++) run('wait until 3:41');
    },
  },
  {
    name: 'the panel says what it does: off, then back on',
    expect: { result: 'fail' },
    play({ run, g }) {
      run('goto office_switch pretend');
      if (g.player.focus?.action !== 'flip_switch') throw new Error(`at the panel E is ${g.player.focus?.action}`);
      run('interact');
      if (g.world.officeLight !== 'off' || g.player.focus?.action !== 'flip_switch_on') throw new Error(`after the flip E is ${g.player.focus?.action}`);
      run('interact');
      if (g.world.officeLight === 'off') throw new Error('never came back on');
      run('goto my_seat pretend'); run('goto my_seat pretend'); // away from the panel before he gets there
      for (let i = 0; i < 6 && !g.outcome; i++) run('wait until 3:41');
    },
  },
  {
    name: 'in the light: take it from beside his desk → he sees you → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, g }) {
      run('goto desk_side pretend');
      try { run('interact'); } catch { /* caught mid-take */ }
      waitFor((gg) => gg.caught, { maxSec: 10 });
      caughtFor(g, 'action');
    },
  },
];
