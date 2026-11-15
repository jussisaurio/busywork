// The Layoff List route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
const said = (log, who, icons) => log.some((e) => e.name === 'say' && e.payload.owner === who && e.payload.icons.join('') === icons.join(''));
const mustSay = (log, who, icons) => {
  if (!said(log, who, icons)) throw new Error(`${who} never said ${icons.join('')}`);
};

// Kev's hoodie once he's gone home (3:25), wait at his desk for the computer to act up (3:35), offer, edit.
const HOODIE_EDIT = ['pretend until 3:26', 'goto kev_desk pretend', 'interact', 'pretend until 3:35.1', 'goto boss_pc', 'interact', 'wait 2s', 'interact'];

export default [
  {
    name: 'do nothing → Kev goes home (👋🏠, Lin waves back) → fail',
    expect: { result: 'fail' },
    play({ run, log }) {
      run('pretend until 3:45');
      mustSay(log, 'kev', ['🥵']); // hot: the hoodie comes off, over his chair
      mustSay(log, 'kev', ['👋', '🏠']);
      mustSay(log, 'lin', ['👋']);
    },
  },
  {
    name: 'edit the list as yourself while the boss is in the restroom → Lin sees you at his screen → fail',
    expect: { result: 'fail' },
    cmds: ['pretend until 3:20', 'goto boss_pc pretend', 'interact', 'goto my_seat', 'pretend until 3:45'],
  },
  {
    name: "hoodie: Kev's hoodie once he's gone, offer to fix the boss's computer while it acts up and Lin is in the restroom, put the hoodie back → win",
    expect: { result: 'win', routes: ['hoodie'] },
    play({ run, log }) {
      for (const c of [...HOODIE_EDIT, 'goto kev_desk', 'interact', 'goto my_seat', 'pretend until 3:45']) run(c);
      mustSay(log, 'boss', ['🙂', '@kev']); // he took you for Kev
      mustSay(log, 'player', ['🙋', '🔧']); // "Kev" offers
      mustSay(log, 'boss', ['😊', '🖥️']); // let "Kev" at his computer
      mustSay(log, 'boss', ['😊', '@kev']); // and thanked "Kev" for it
    },
  },
  {
    name: 'hoodie still on at your desk at 3:45 → that\'s Kev in your chair, not you → blamed',
    expect: { result: 'blamed', routes: ['hoodie'] },
    play({ run, log, g }) {
      for (const c of [...HOODIE_EDIT, 'goto my_seat', 'pretend until 3:45', 'wait 5s']) run(c);
      if (g.outcome?.why !== 'kev') throw new Error(`blamed for ${g.outcome?.why}, not for being Kev`);
      mustSay(log, 'boss', ['@kev', '❓']);
    },
  },
  {
    name: 'offer to fix his computer before it acts up → nothing to offer',
    expect: { result: 'fail' },
    play({ run, g }) {
      for (const c of ['pretend until 3:26', 'goto kev_desk pretend', 'interact', 'pretend until 3:33', 'goto boss_pc', 'interact']) run(c);
      if (g.world.fix !== 'none') throw new Error('"Kev" offered while the computer worked');
      run('pretend until 3:45');
    },
  },
  {
    name: "hoodie in front of Lin, who saw Kev go home → her double take (Kev's face ❓) ❗👉 at you → desk work → fail",
    expect: { result: 'fail' },
    play({ run, log }) {
      for (const c of ['pretend until 3:25', 'goto kev_desk pretend', 'interact', 'goto boss_pc', 'pretend until 3:45']) run(c);
      mustSay(log, 'lin', ['@kev', '❓']);
      mustSay(log, 'lin', ['❗', '👉', '@player']); // she points at you (the engine's tattle names you)
    },
  },
  {
    name: "jacket: the boss's jacket while Lin glances away, edit the list as \"the boss\", hang it back → win",
    expect: { result: 'win', routes: ['jacket'] },
    play({ run, log }) {
      for (const c of ['pretend until 3:15', 'goto coat_rack pretend', 'wait 1.7s', 'interact', 'goto boss_pc', 'interact', 'goto coat_rack', 'interact', 'goto my_seat', 'pretend until 3:45']) run(c);
      mustSay(log, 'lin', ['😳', '@boss']); // she took you for the boss
    },
  },
  {
    name: "jacket on in front of Lin → her double take (the boss's face ❓) ❗👉 → desk work → fail",
    expect: { result: 'fail' },
    play({ run, log }) {
      for (const c of ['pretend until 3:15', 'goto coat_rack pretend', 'interact', 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:45']) run(c);
      mustSay(log, 'lin', ['@boss', '❓']);
    },
  },
  {
    name: 'jacket still on when the boss gets back → he knows his own jacket → caught',
    expect: { result: 'caught' },
    cmds: ['pretend until 3:15', 'goto coat_rack pretend', 'wait 1.7s', 'interact', 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:45'],
  },
];
