// The Layoff List's cold-read shots (format: the cold-read framework's COLD-READ.md). Each shot: harness commands
// from the start of the day, and what the picture must tell a first-time player. An end card is the picture after
// the day ends; the last command of each end shot is the one that ends the day. A command that stops early (on a
// soft stop such as someone noticing you) is repeated.
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
    intent: "The boss waves someone over: his bubble shows Kev's face and a wave. Kev is the young man in the olive hoodie at the desk behind Lin.",
  },
  {
    name: 'kev-fixes',
    cmds: ['pretend until 3:05'],
    intent: "Kev stands at the boss's computer typing, while the boss has left his chair and stands aside, watching him. Kev is the one person allowed at that computer.",
  },
  {
    name: 'list-before',
    cmds: ['pretend until 3:06.3'],
    intent: "Kev fixed it: the boss is pleased and the screen works again. On it, a white sheet with a red title bar and a row of four faces; yours is framed in red. That is the list, and you are on it.",
  },
  {
    name: 'coat-rack',
    cmds: ['pretend until 3:13', 'goto coat_rack pretend'],
    intent: "The boss has gone to the restroom. You stand at his coat rack in the corner of his office; his dark suit jacket hangs on it, and the rack lights up to show you can take it.",
  },
  {
    name: 'kev-waves-lin',
    cmds: ['pretend until 3:20.9'],
    intent: "Kev goes home early while the boss is out: he waves goodbye to Lin and she waves back. She knows he's gone; the boss doesn't.",
  },
  {
    name: 'hoodie-on-chair',
    cmds: ['pretend until 3:25'],
    intent: "Kev, sweating, has taken off his olive hoodie and left it draped over his chair on his way out. He walks to the elevator in a T-shirt.",
  },
  {
    name: 'hoodie-on',
    cmds: HOODIE,
    intent: "You put on Kev's hoodie: you are olive now, like Kev. His chair is empty. From a distance you look like Kev.",
  },
  {
    name: 'boss-greets-kev',
    cmds: [...HOODIE, 'pretend until 3:30'],
    intent: "Back at his desk, the boss sees you in the hoodie and waves, with Kev's face in his bubble: he takes you for Kev.",
  },
  {
    name: 'acts-up',
    cmds: ['pretend until 3:35.9'],
    intent: "3:35: the boss's screen goes to static again. Angry, he waves for Kev (Kev's face and a wave), but Kev went home; he wonders where Kev is (a thought with Kev's face and a question mark).",
  },
  {
    name: 'kev-asks',
    cmds: [...ASK, 'wait 0.5s'],
    intent: "In the hoodie, you offer to fix his computer. The boss is happy to see \"Kev\" and steps out of his chair to stand aside and watch, as he did for the real Kev at 3:00.",
  },
  {
    name: 'list-after',
    cmds: [...EDIT, 'wait 0.5s'],
    intent: "Your face is gone from the sheet on his screen; three faces remain. The boss thanks \"Kev\" (a smile and Kev's face) and goes back to his chair.",
  },
  {
    name: 'lin-double-take',
    cmds: [...HOODIE, 'goto boss_pc'],
    intent: "Lin saw Kev leave, so \"Kev\" walking into the boss's office is wrong: her double take (Kev's face and a question mark), then she points you out. Do it while she's away.",
  },
  {
    name: 'lin-greets-boss',
    cmds: [...JACKET, 'goto boss_pc'],
    intent: "You walk to his computer in the boss's dark jacket. Lin, looking in through the glass, takes you for the boss: a nervous face and the boss's face in her bubble.",
  },
  {
    name: 'jacket-edit',
    cmds: [...JACKET, 'goto boss_pc', 'interact'],
    intent: "Your face comes off the sheet on his screen while, to anyone looking in, the boss is at his own computer.",
  },
  {
    name: 'caught',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:45', 'pretend until 3:45'],
    intent: "The boss is back and you're still in his jacket. He knows his own jacket: he stops, angry, and points at you.",
  },
  {
    name: 'end-win-hoodie',
    cmds: [...EDIT, 'goto my_seat', 'pretend until 3:45', 'pretend until 3:45', 'pretend until 3:45'],
    intent: "Win. You, in Kev's hoodie, at the boss's keyboard, the boss over your shoulder, pleased; the list on his screen has no red face, and a copy flies off to HR.",
  },
  {
    name: 'end-win-jacket',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'goto coat_rack', 'interact', 'goto my_seat', 'pretend until 3:45', 'wait 2s'],
    intent: "Win. The boss sends the list himself, with no red face on it; his jacket is back on its rack; you sit at your desk looking smug.",
  },
  {
    name: 'end-fail',
    cmds: ['pretend until 3:45', 'wait 2s'],
    intent: "Lose. The boss sends the list with your red face on it; you carry your desk out in a cardboard box with your plant, past your empty desk and chair.",
  },
  {
    name: 'end-caught',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:45', 'pretend until 3:45', 'wait 2s'],
    intent: "Lose. Caught: the boss, furious, points the way out; you go with your box, still in his jacket. Your red face is still on the list.",
  },
  {
    name: 'end-blamed',
    cmds: [...EDIT, 'goto kitchen_table', 'pretend until 3:45', 'wait 2s'],
    intent: "Lose. Your chair is empty in a pool of light; the boss, angry, puts your red face back on the list and it goes out.",
  },
];
