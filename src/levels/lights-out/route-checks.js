// Lights Out's route checks for tools/routes.mjs (level 1's route-checks.js documents the format): the shortest
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
    name: 'do nothing → fail (he empties his tray and reads it)',
    expect: { result: 'fail' },
    cmds: ['wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait until 3:41'],
  },
  {
    name: 'switch: flip his light, take it from the front while he gropes along the wall → win',
    expect: { result: 'win', routes: ['switch'] },
    play({ run, g, log }) {
      run('goto office_switch pretend');
      run('interact'); // clack: he turns to the noise, then gets up
      run('goto tray');
      run('interact');
      took(log, 'switch');
      atDesk(run, g);
    },
  },
  {
    name: 'switch: flip it and stay by the switch → he gropes along the wall straight into you → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, g }) {
      run('goto office_switch pretend');
      run('interact');
      waitFor((gg) => gg.caught, { maxSec: 30 });
      caughtFor(g, 'evidence'); // pretending doesn't help: he walked into you
    },
  },
  {
    name: 'blackout: wait for Lin\'s microwave, take it from beside his desk (off his torch) → win',
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
