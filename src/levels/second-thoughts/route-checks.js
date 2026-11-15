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
    name: 'switch: flip his light behind his back, take it while he walks his torch to the switch → win',
    expect: { result: 'win', routes: ['switch'] },
    play({ run, waitFor, npc, g, log }) {
      run('goto office_switch pretend');
      run('interact'); // his office goes dark: ❓, he holds up his phone; as he gets up his beam swings east
      run('goto 1,4'); // into the shadow under his plants, behind the swing
      if (!waitFor(() => npc('boss').x < 3.5, { busy: false, maxSec: 6 })) throw new Error('he never set off for the switch');
      run('goto tray'); // he walks his torch to the switch, his back to the tray
      run('interact');
      took(log, 'switch');
      atDesk(run, g);
    },
  },
  {
    name: 'switch: flip it and stay by the switch → his torch finds you there → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, g }) {
      run('goto office_switch pretend');
      run('interact');
      waitFor((gg) => gg.caught, { maxSec: 30 });
      caughtFor(g, 'evidence'); // pretending doesn't help: whoever is in his dark office flipped it
    },
  },
  {
    name: 'blackout: tip the jug over the coffee machine, Lin shorts it at 3:10, take it from beside his desk (off his torch) → win',
    expect: { result: 'win', routes: ['blackout'] },
    play({ run, g, log }) {
      run('goto 20,2 pretend'); // by the fridge, beside the machine: out of Kev's sight through the kitchen door
      run('interact'); // tip the jug over the machine
      if (!g.world.rigged) throw new Error('never rigged the machine');
      run('goto my_seat');
      run('pretend until 3:11'); // stops when it shorts
      run('pretend 5s'); // and when the fuse blows
      if (g.world.fuse !== 'off' || g.world.fuseBy !== 'coffee') throw new Error('the coffee machine never blew the fuse');
      run('goto desk_side pretend');
      run('goto desk_side pretend');
      run('interact');
      took(log, 'blackout');
      atDesk(run, g);
    },
  },
  {
    name: 'blackout: take it, then spend 3:40 in the kitchen → still a win (nobody knew the letter was there)',
    expect: { result: 'win', routes: ['blackout'] },
    play({ run, g, log }) {
      run('goto 20,2 pretend'); // by the fridge, beside the machine: out of Kev's sight through the kitchen door
      run('interact'); // tip the jug over the machine
      if (!g.world.rigged) throw new Error('never rigged the machine');
      run('goto my_seat');
      run('pretend until 3:11'); // stops when it shorts
      run('pretend 5s'); // and when the fuse blows
      if (g.world.fuse !== 'off' || g.world.fuseBy !== 'coffee') throw new Error('the coffee machine never blew the fuse');
      run('goto desk_side pretend');
      run('goto desk_side pretend');
      run('interact');
      took(log, 'blackout');
      const k = g.level.zones.kitchen; // off the floor: without the verdict this would be 'blamed'
      const inKitchen = () => g.player.x >= k.x0 && g.player.x < k.x1 && g.player.y >= k.y0 && g.player.y < k.y1;
      for (let i = 0; i < 3 && !inKitchen(); i++) run('goto kitchen_table'); // out by the side door; a torch's notice can cut the walk short
      if (!inKitchen()) throw new Error('not in the kitchen');
    },
  },
  {
    name: 'blackout: take it from in front of his desk → frozen in his phone torch → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, g }) {
      run('goto 20,2 pretend'); // by the fridge, beside the machine: out of Kev's sight through the kitchen door
      run('interact'); // tip the jug over the machine
      if (!g.world.rigged) throw new Error('never rigged the machine');
      run('goto my_seat');
      run('pretend until 3:11'); // stops when it shorts
      run('pretend 5s'); // and when the fuse blows
      if (g.world.fuse !== 'off' || g.world.fuseBy !== 'coffee') throw new Error('the coffee machine never blew the fuse');
      run('goto tray pretend');
      run('goto tray pretend');
      try { run('interact'); } catch { /* caught mid-take */ }
      waitFor((gg) => gg.caught, { maxSec: 10 });
      caughtFor(g, 'action');
    },
  },
  {
    name: 'blackout: tip the jug from the front of the counter → Kev sees you through the kitchen door ❗👉 → desk work → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, g, log }) {
      run('goto 21,2 pretend');
      try { run('interact'); } catch { /* stopped mid-tip */ }
      waitFor(() => log.some((e) => e.name === 'boss:workAssigned'), { busy: false, maxSec: 10 });
      const t = log.find((e) => e.name === 'witness:tattle');
      if (!(t && t.payload.by === 'kev' && t.payload.reason === 'action')) throw new Error('no tattle from Kev');
      if (g.world.rigged) throw new Error('the jug got tipped anyway');
    },
  },
  {
    name: 'breaker: pull it, take the letter from beside his desk, back to your seat → win',
    expect: { result: 'win', routes: ['breaker'] },
    play({ run, g, log }) {
      run('goto fuse_box pretend');
      run('interact');
      run('goto desk_side pretend');
      run('interact');
      took(log, 'breaker');
      atDesk(run, g);
    },
  },
  {
    name: 'breaker: pull it and hang about at the fuse box → Kev\'s torch finds you → desk work → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, log }) {
      run('goto fuse_box pretend');
      run('interact');
      waitFor(() => log.some((e) => e.name === 'boss:workAssigned'), { busy: false, maxSec: 60 });
      const t = log.find((e) => e.name === 'witness:tattle');
      if (!(t && t.payload.by === 'kev' && t.payload.reason === 'scene')) throw new Error('no scene tattle from Kev');
    },
  },
  {
    name: 'breaker, then eat it after 3:30 → still inside you at 3:40 → win (eaten)',
    expect: { result: 'win', routes: ['breaker'] },
    play({ run, g, log }) {
      run('goto fuse_box pretend'); run('interact'); run('goto desk_side pretend'); run('interact');
      took(log, 'breaker');
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
    name: 'breaker, then eat it early → it comes back up, Lin pinches it into his tray → fail (soggy)',
    expect: { result: 'fail' },
    play({ run, g, log }) {
      run('goto fuse_box pretend'); run('interact'); run('goto desk_side pretend'); run('interact');
      run('goto my_seat pretend'); run('goto my_seat pretend');
      run('move S 0.4s');
      run('eat');
      for (let i = 0; i < 4 && !log.some((e) => e.name === 'player:sick'); i++) run('wait until 3:23');
      if (!g.world.sick || g.world.letter !== 'dropped') throw new Error('it never came back up');
      run('move E 0.6s'); // step off the puddle and let Lin deal with it
      for (let i = 0; i < 6 && !log.some((e) => e.name === 'lin:files'); i++) run('wait 5s');
      if (g.world.letter !== 'tray') throw new Error(`Lin left it ${g.world.letter}`);
      for (let i = 0; i < 4 && !g.outcome; i++) run('wait until 3:41');
      if (g.outcome?.why !== 'soggy') throw new Error(`end card ${g.outcome?.why}, not soggy`);
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
