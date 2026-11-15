// The Layoff List route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
const said = (log, who, icons) => log.some((e) => e.name === 'say' && e.payload.owner === who && e.payload.icons.join('') === icons.join(''));
const mustSay = (log, who, icons) => {
  if (!said(log, who, icons)) throw new Error(`${who} never said ${icons.join('')}`);
};
const mustFire = (log, name) => {
  if (!log.some((e) => e.name === name)) throw new Error(`${name} never fired`);
};

// 3:26: his screen is static again and Kev went home. Kneel at the plug behind his desk while he sits there: he
// leaves you to it (☕👉 you) and goes for a coffee.
const FIX = ['pretend until 3:25.5', 'goto behind_his_desk pretend', 'interact'];

export default [
  {
    name: 'do nothing → Kev fixes it, the list comes up (Lin 😨😌), Kev goes home (👋🏠, Lin waves back), the boss fixes it himself at 3:31 → 🧥📧 → fail',
    expect: { result: 'fail' },
    play({ run, log }) {
      run('pretend until 3:45');
      mustSay(log, 'boss', ['☎️', '@kev']);
      mustSay(log, 'lin', ['😨']);
      mustSay(log, 'lin', ['😌']);
      mustSay(log, 'kev', ['👋', '🏠']);
      mustSay(log, 'lin', ['👋']);
      mustSay(log, 'boss', ['@kev', '❓']); // 3:26: he rang Kev's desk, and nobody picked up
      mustSay(log, 'lin', ['🤷']); // not her business where Kev went
      mustSay(log, 'boss', ['😮‍💨']); // 3:31: a sigh, then down to the cable himself
      mustSay(log, 'boss', ['🔌']);
      mustSay(log, 'boss', ['🧥', '📧']); // coat on, he sends it
    },
  },
  {
    name: "his cable while Kev is still here → 🙅 Kev's job",
    expect: { result: 'fail' },
    play({ run, log, g }) {
      for (const c of ['goto behind_his_desk pretend', 'interact']) run(c);
      mustSay(log, 'boss', ['🙅', '@kev']);
      if (!g.world.glitch) throw new Error('the cable was fixed by you while Kev was here');
      run('goto my_seat pretend');
      run('pretend until 3:45');
    },
  },
  {
    name: 'his screen while he is in the restroom → locked: nothing to do',
    expect: { result: 'fail' },
    play({ run, g }) {
      for (const c of ['pretend until 3:17', 'goto his_screen pretend', 'interact']) run(c);
      if (g.world.list !== 'on') throw new Error('edited a locked screen');
      run('goto my_seat pretend');
      run('pretend until 3:45');
    },
  },
  {
    name: "ring: plug his cable in (☕👉 you), ring Kev's empty desk (Lin turns round to it), edit → win",
    expect: { result: 'win', routes: ['ring'] },
    play({ run, log }) {
      for (const c of [...FIX, 'goto boss_phone', 'interact', 'goto his_screen', 'interact', 'goto my_seat pretend', 'pretend until 3:45']) run(c);
      mustSay(log, 'boss', ['🔌', '🚪']); // plug it in and get out
      mustSay(log, 'boss', ['☕', '👉', '@player']);
      mustFire(log, 'phone:called');
      mustSay(log, 'boss', ['🧥', '📧']); // coat on, he sends it unread
    },
  },
  {
    name: 'phone: plug his cable in, wait for Lin\'s mobile to buzz (she turns away to read it), edit → win',
    expect: { result: 'win', routes: ['phone'] },
    play({ run, log }) {
      for (const c of [...FIX, 'goto his_screen', 'wait until 3:32.75', 'interact', 'goto my_seat pretend', 'pretend until 3:45']) run(c);
      mustFire(log, 'lin:reads');
    },
  },
  {
    name: 'edit while Lin is looking → she thinks of her own face on the list (📋 her 😨) and goes to tell him; he checks his screen, puts your face back, locks it and sends it at 3:45 → caught',
    expect: { result: 'caught' },
    play({ run, log, g }) {
      for (const c of [...FIX, 'goto his_screen', 'wait until 3:35.4', 'interact', 'wait until 3:37.5', 'goto restroom']) run(c); // interact pauses as she sees you: finish the edit, then keep out of his way
      for (let i = 0; i < 8 && !g.outcome; i++) run('wait until 3:45'); // (her telling him stops a wait)
      mustSay(log, 'lin', ['📋', '@lin', '😨']); // why she tells, before she does
      if (log.some((e) => e.name === 'witness:tattle')) throw new Error('Lin shouted: she should tell him, not the floor');
      mustFire(log, 'list:edited'); // she lets you finish: your face comes off, then goes back on
      mustSay(log, 'lin', ['👉', '@player', '🖥️']); // she told him to his face
      mustFire(log, 'boss:checks');
      mustFire(log, 'boss:checked');
      mustSay(log, 'boss', ['👉', '@player', '😠']); // he knows who it was
      if (g.outcome?.why !== 'told') throw new Error(`caught, but not on Lin's word (why: ${g.outcome?.why})`);
      // No hunt: once he has locked it he stays in his office and sends it from his desk.
      const sat = log.find((e) => e.name === 'boss:packsUp');
      if (!sat || sat.minute > g.level.day.meetingAt) throw new Error('he was not at his desk for the send');
    },
  },
  {
    name: 'edit too late: the boss is back with his coffee and sees you at his screen → caught',
    expect: { result: 'caught' },
    cmds: [...FIX, 'goto his_screen', 'wait until 3:39.8', 'interact', 'interact', 'interact', 'pretend until 3:45'],
  },
];
