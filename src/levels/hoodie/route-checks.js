// Kev's Hoodie route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
const said = (log, who, icons) => log.some((e) => e.name === 'say' && e.payload.owner === who && e.payload.icons.join('') === icons.join(''));
const mustSay = (log, who, icons) => {
  if (!said(log, who, icons)) throw new Error(`${who} never said ${icons.join('')}`);
};

export default [
  { name: 'do nothing → fail', expect: { result: 'fail' }, cmds: ['pretend until 3:45'] },
  {
    name: 'delete it while the boss is in the restroom → Lin sees his screen → fail',
    expect: { result: 'fail' },
    cmds: ['pretend until 3:20', 'goto boss_pc pretend', 'interact', 'goto my_seat', 'pretend until 3:45'],
  },
  {
    name: "hoodie: Kev's hoodie once Lin is in the restroom, let \"Kev\" fix the boss's computer → win",
    expect: { result: 'win', routes: ['hoodie'] },
    play({ run, log }) {
      for (const c of ['pretend until 3:25', 'goto kev_desk pretend', 'interact', 'pretend until 3:33', 'goto boss_pc', 'interact', 'wait 2s', 'interact', 'goto my_seat', 'pretend until 3:45']) run(c);
      mustSay(log, 'boss', ['👋']); // he took you for Kev
      mustSay(log, 'boss', ['😊', '🖥️']); // let "Kev" at his computer
      mustSay(log, 'boss', ['😊', '👋']); // and thanked him for it
    },
  },
  {
    name: 'hoodie in front of Lin, who saw Kev go home → her double take 🧥❓ ❗👉 → desk work → fail',
    expect: { result: 'fail' },
    play({ run, log }) {
      for (const c of ['pretend until 3:25', 'goto kev_desk pretend', 'interact', 'goto boss_pc', 'pretend until 3:45']) run(c);
      mustSay(log, 'lin', ['🧥', '❓']);
      mustSay(log, 'lin', ['❗', '👉']);
    },
  },
  {
    name: "jacket: the boss's jacket while Lin waves Kev off, delete it as \"the boss\", hang it back → win",
    expect: { result: 'win', routes: ['jacket'] },
    play({ run, log }) {
      for (const c of ['pretend until 3:15', 'goto coat_rack pretend', 'wait 3.7s', 'interact', 'goto boss_pc', 'interact', 'goto coat_rack', 'interact', 'goto my_seat', 'pretend until 3:45']) run(c);
      mustSay(log, 'lin', ['😳', '👋']); // she took you for the boss
    },
  },
  {
    name: 'jacket on in front of Lin → her double take 👔❓ ❗👉 → desk work → fail',
    expect: { result: 'fail' },
    play({ run, log }) {
      for (const c of ['pretend until 3:15', 'goto coat_rack pretend', 'interact', 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:45']) run(c);
      mustSay(log, 'lin', ['👔', '❓']);
    },
  },
  {
    name: 'jacket still on when the boss gets back → he knows his own jacket → caught',
    expect: { result: 'caught' },
    cmds: ['pretend until 3:15', 'goto coat_rack pretend', 'wait 3.7s', 'interact', 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:45'],
  },
];
