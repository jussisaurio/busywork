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
    name: 'blackout: wait for Lin\'s coffee machine to trip the fuse, take it from beside his desk (off his torch) → win',
    expect: { result: 'win', routes: ['blackout'] },
    play({ run, g, log }) {
      run('pretend until 3:11'); // stops on fuse:tripped
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
      run('pretend until 3:11');
      run('goto desk_side pretend');
      run('interact');
      took(log, 'blackout');
      run('goto kitchen_table');
      const k = g.level.zones.kitchen; // off the floor: without the verdict this would be 'blamed'
      if (!(g.player.x >= k.x0 && g.player.x < k.x1 && g.player.y >= k.y0 && g.player.y < k.y1)) throw new Error('not in the kitchen');
    },
  },
  {
    name: 'blackout: take it from in front of his desk → frozen in his phone torch → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, g }) {
      run('pretend until 3:11');
      run('goto tray pretend');
      try { run('interact'); } catch { /* caught mid-take */ }
      waitFor((gg) => gg.caught, { maxSec: 10 });
      caughtFor(g, 'action');
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
