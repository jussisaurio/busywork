// The Layoff List's cold-read shots (format: the cold-read framework's COLD-READ.md). Each shot: harness commands
// from the start of the day, and what the picture must tell a first-time player. An end card is the picture after
// the day ends: whoever renders it must let the card come up (about 2 s) after the last command.
const HOODIE = ['pretend until 3:25', 'goto kev_desk pretend', 'interact']; // Kev's hoodie off his chair, on
const ASK = [...HOODIE, 'pretend until 3:33', 'goto boss_pc', 'interact']; // "Kev" offers to fix it
const EDIT = [...ASK, 'wait 2s', 'interact']; // ...and takes your name off while the boss watches
const JACKET = ['pretend until 3:15', 'goto coat_rack pretend', 'wait 1.7s', 'interact']; // on, as Lin waves Kev off

export default [
  {
    name: 'start',
    cmds: ['pretend until 3:00.9'],
    intent: "3:00. You at your desk on the open floor. Behind glass, the boss at his desk is angry at his computer: its screen is static. His suit jacket hangs on a rack in the corner of his office.",
  },
  {
    name: 'boss-waves-kev',
    cmds: ['pretend until 3:01.5'],
    intent: 'The boss waves someone over (👋): Kev, the young man in the olive hoodie at the desk behind Lin.',
  },
  {
    name: 'kev-fixes',
    cmds: ['pretend until 3:05'],
    intent: "Kev stands at the boss's computer typing, while the boss has left his chair and stands aside, watching him. Kev is the one person allowed at that computer.",
  },
  {
    name: 'list-before',
    cmds: ['pretend until 3:06.3'],
    intent: "Kev fixed it: the boss is pleased (😊) and the screen works again. On it, a row of four little figures, one of them red like your sweater: the list, and you are on it.",
  },
  {
    name: 'coat-rack',
    cmds: ['pretend until 3:13', 'goto coat_rack pretend'],
    intent: "The boss has gone to the restroom. You stand at his coat rack: his suit jacket is there for the taking (👔).",
  },
  {
    name: 'kev-waves-lin',
    cmds: ['pretend until 3:20.9'],
    intent: "Kev goes home early while the boss is out: he waves goodbye to Lin and she waves back. She knows he's gone; the boss doesn't.",
  },
  {
    name: 'hoodie-on-chair',
    cmds: ['pretend until 3:24.2'],
    intent: "Hot, Kev has taken off his olive hoodie and left it on his chair on his way out. Now it's a T-shirt walking to the elevator.",
  },
  {
    name: 'hoodie-on',
    cmds: HOODIE,
    intent: "You put on Kev's hoodie: you are olive now, hood up, cap on. From a distance you look like Kev.",
  },
  {
    name: 'boss-greets-kev',
    cmds: [...HOODIE, 'pretend until 3:30'],
    intent: "Back at his desk, the boss sees you in the hoodie and waves (👋): he takes you for Kev.",
  },
  {
    name: 'acts-up',
    cmds: ['pretend until 3:35.9'],
    intent: "3:35: the boss's screen goes to static again. Angry, he waves for Kev, who isn't there (he went home): Kev is needed.",
  },
  {
    name: 'kev-asks',
    cmds: [...ASK, 'wait 0.5s'],
    intent: "In the hoodie, you offer to fix his computer (🖥️❓). The boss is happy to see \"Kev\" and steps aside to watch, as he did for the real Kev at 3:00.",
  },
  {
    name: 'edit',
    cmds: [...ASK, 'wait 2s', 'interact 1.5s'],
    intent: "You type at his computer while he watches. On the screen your red figure is blinking: you are taking your name off the list.",
  },
  {
    name: 'list-after',
    cmds: [...EDIT, 'wait 0.5s'],
    intent: "Your red figure is gone from his screen; three figures remain. The boss thanks \"Kev\" (😊👋) and goes back to his chair.",
  },
  {
    name: 'lin-double-take',
    cmds: [...HOODIE, 'goto boss_pc'],
    intent: "Lin saw Kev leave, so \"Kev\" walking into the boss's office is wrong: her double take (🧥❓), then she points you out (❗👉). Do it while she's away.",
  },
  {
    name: 'lin-greets-boss',
    cmds: [...JACKET, 'goto boss_pc'],
    intent: "In the boss's jacket at his computer, Lin, looking in through the glass, takes you for the boss and waves (😳👋).",
  },
  {
    name: 'jacket-edit',
    cmds: [...JACKET, 'goto boss_pc', 'interact'],
    intent: "Your name comes off the list while, to anyone looking in, the boss is at his own computer.",
  },
  {
    name: 'caught',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:28.3'],
    intent: "The boss is back and you're still in his jacket. He knows his own jacket: he points at you, angry (❗👉).",
  },
  {
    name: 'end-win-hoodie',
    cmds: [...EDIT, 'goto my_seat', 'pretend until 3:45', 'wait 3s'],
    intent: "Win. You, in Kev's hoodie, at the boss's keyboard, the boss over your shoulder, pleased; the list on his screen has no red face, and a copy flies off to HR.",
  },
  {
    name: 'end-win-jacket',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'goto coat_rack', 'interact', 'goto my_seat', 'pretend until 3:45', 'wait 3s'],
    intent: "Win. The boss sends the list himself, with no red face on it; his jacket is back on its rack; you sit at your desk looking smug.",
  },
  {
    name: 'end-fail',
    cmds: ['pretend until 3:45', 'wait 3s'],
    intent: "Lose. The boss sends the list with your red face on it; you carry your desk out in a cardboard box with your plant, past your empty desk and chair.",
  },
  {
    name: 'end-caught',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:45', 'wait 3s'],
    intent: "Lose. Caught: the boss, furious, points the way out; you go with your box, still in his jacket. Your red face is still on the list.",
  },
  {
    name: 'end-blamed',
    cmds: [...EDIT, 'goto kitchen_table', 'pretend until 3:45', 'wait 3s'],
    intent: "Lose. Your chair is empty in a pool of light; the boss, angry, puts your red face back on the list and it goes out.",
  },
];
