// The Layoff List route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
const said = (log, who, icons) => log.some((e) => e.name === 'say' && e.payload.owner === who && e.payload.icons.join('') === icons.join(''));
const mustSay = (log, who, icons) => {
  if (!said(log, who, icons)) throw new Error(`${who} never said ${icons.join('')}`);
};
const mustFire = (log, name) => {
  if (!log.some((e) => e.name === name)) throw new Error(`${name} never fired`);
};

// While he is in the restroom, pull his plug half out. About 3:22 he is back to a dead screen, and Kev went home.
// Nobody answers Kev's phone: he gives up and goes for a coffee. Then kneel at the plug and push it home.
const PULL = ['pretend until 3:14', 'goto behind_his_desk', 'interact', 'goto my_seat pretend'];
const FIX = [...PULL, 'pretend until 3:30.3', 'goto behind_his_desk', 'interact'];

export default [
  {
    name: 'do nothing → Kev fixes it, the list comes up (Lin 😨😌), Kev goes home (👋🏠, Lin waves back), the boss works on at his desk; 3:42 he counts the list and ticks your face (📋✔️) → 🧥📧 → fail',
    expect: { result: 'fail' },
    play({ run, log }) {
      run('pretend until 3:45');
      mustSay(log, 'boss', ['☎️', '@kev']);
      mustSay(log, 'lin', ['😨']);
      mustSay(log, 'lin', ['😌']);
      mustSay(log, 'kev', ['👋', '🏠']);
      mustSay(log, 'lin', ['👋']);
      if (log.some((e) => e.name === 'boss:coffee')) throw new Error('he went for coffee with nobody at his plug');
      mustSay(log, 'boss', ['📋', '@player', '✔️']); // the head count: your face is on it
      mustSay(log, 'boss', ['🧥', '📧']); // coat on, he sends it
    },
  },
  {
    name: 'pull his plug while he is in the restroom → back, he types his password into the black screen (✱✱✱✱✱ ⏎ 🖥️❓ 😠), nobody answers at Kev\'s desk (❓, Lin 🤷), he goes for a coffee (😮‍💨☕); leave it dead and he sends it from his mobile → 🧥📱📧 → fail',
    expect: { result: 'fail' },
    play({ run, log, g }) {
      for (const c of PULL) run(c);
      mustFire(log, 'pc:pulled');
      run('pretend until 3:45');
      mustSay(log, 'boss', ['#pwstar', '#pwstar', '#pwstar', '#pwstar', '#pwstar']); // his password, blind
      mustSay(log, 'boss', ['#enterkey']);
      mustSay(log, 'boss', ['🖥️', '❓']); // he stares at the black screen
      mustSay(log, 'boss', ['😠']);
      mustFire(log, 'boss:enter');
      mustSay(log, 'boss', ['@kev', '❓']); // he rang Kev's desk, and nobody picked up
      mustSay(log, 'lin', ['🤷']); // not her business where Kev went
      mustSay(log, 'boss', ['😮‍💨', '☕']); // he gives up and goes for a coffee
      if (!g.world.glitch) throw new Error('his screen came back with nobody at the plug');
      mustSay(log, 'boss', ['🧥', '📱', '📧']); // coat on, he sends it from his mobile
    },
  },
  {
    name: 'his plug while he sits at his desk → nothing to do there (he sends you back to work)',
    expect: { result: 'fail' },
    play({ run, g, log }) {
      for (const c of ['pretend until 3:25', 'goto behind_his_desk', 'interact']) run(c);
      if (g.world.glitch || log.some((e) => e.name === 'pc:pulled')) throw new Error('pulled his plug under his nose');
      run('goto my_seat pretend');
      run('pretend until 3:45');
    },
  },
  {
    name: 'his screen while he is in the restroom → locked: the padlock jolts (🔒), nothing to do',
    expect: { result: 'fail' },
    play({ run, g, log }) {
      for (const c of ['pretend until 3:13', 'goto his_screen pretend', 'interact']) run(c);
      if (g.world.list !== 'on') throw new Error('edited a locked screen');
      mustFire(log, 'pc:triedLocked');
      run('goto my_seat pretend');
      run('pretend until 3:45');
    },
  },
  {
    name: "ring: he's gone for coffee, plug his cable in, ring Kev's empty desk (Lin turns round to it), edit → win",
    expect: { result: 'win', routes: ['ring'] },
    play({ run, log }) {
      for (const c of [...FIX, 'goto boss_phone', 'wait until 3:33', 'interact', 'goto his_screen', 'interact', 'goto my_seat pretend', 'pretend until 3:45']) run(c);
      mustFire(log, 'pc:fixedByYou');
      mustFire(log, 'phone:called');
      // She really turned round to it, before the edit was done (not saved by a buzz of her mobile).
      const look = log.find((e) => e.name === 'say' && e.payload.owner === 'lin' && e.payload.icons.join('') === '👀☎️');
      const edit = log.find((e) => e.name === 'list:edited');
      if (!look || !edit || look.minute > edit.minute) throw new Error('Lin never turned round to the ring before the edit');
      if (log.some((e) => e.name === 'lin:reads' && e.minute >= look.minute - 0.5 && e.minute <= edit.minute)) throw new Error('her mobile turned her away, not the ring');
      mustSay(log, 'boss', ['📋', '🤨', '🤷']); // the head count: one short? It's Friday
      mustSay(log, 'boss', ['🧥', '📧']); // coat on, he sends it
    },
  },
  {
    name: 'phone: plug his cable in, wait for Lin\'s mobile to buzz (she turns away to read it), edit → win',
    expect: { result: 'win', routes: ['phone'] },
    play({ run, log }) {
      for (const c of [...FIX, 'goto his_screen', 'wait until 3:34.1', 'interact', 'goto my_seat pretend', 'pretend until 3:45']) run(c);
      mustFire(log, 'lin:reads');
      mustSay(log, 'boss', ['📋', '🤨', '🤷']);
    },
  },
  {
    name: 'edit while Lin is looking → she shouts (❗👉 you), thinks of her own face on the list (📋 her 😨) and goes to tell him; he checks his screen, puts your face back, locks it and sends it at 3:45 → caught',
    expect: { result: 'caught' },
    play({ run, log, g }) {
      for (const c of [...FIX, 'goto his_screen', 'wait until 3:35.4', 'interact', 'wait until 3:37.5', 'goto restroom']) run(c); // interact pauses as she sees you: finish the edit, then keep out of his way
      for (let i = 0; i < 8 && !g.outcome; i++) run('wait until 3:45'); // (her telling him stops a wait)
      mustSay(log, 'lin', ['❗', '👉', '@player']); // she shouts as she sees it
      mustSay(log, 'lin', ['📋', '@lin', '😨']); // and why she tells
      if (log.some((e) => e.name === 'witness:tattle')) throw new Error('the engine tattled: Lin tells him herself');
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
