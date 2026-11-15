// The Layoff List's cold-read shots (format: the cold-read framework's COLD-READ.md). Each shot: harness commands
// from the start of the day, and what the picture must tell a first-time player. An end card is the picture after
// the day ends; the last command of each end shot is the one that ends the day. A command that stops early (on a
// soft stop such as someone noticing you) is repeated.
const HOODIE = ['pretend until 3:26', 'goto kev_desk pretend', 'interact']; // Kev's gone home: his hoodie off his chair, on
const ASK = [...HOODIE, 'pretend until 3:35.1', 'goto boss_pc', 'interact']; // his screen acts up: "Kev" offers to fix it
const EDIT = [...ASK, 'wait 2s', 'interact']; // ...and takes your name off while the boss watches
const RETURN = [...EDIT, 'goto kev_desk', 'interact']; // ...and hangs the hoodie back over Kev's chair
const SEEN = [...EDIT, 'goto kev_hoodie pretend', 'interact']; // ...a little later, when the boss can see Kev's chair
const JACKET = ['pretend until 3:15', 'goto coat_rack pretend', 'wait 1.7s', 'interact']; // on, while Lin glances away
const END = ['goto my_seat', 'pretend until 3:45', 'pretend until 3:45']; // to your desk, then the end card

export default [
  {
    name: 'start',
    cmds: ['pretend until 3:00.9'],
    intent: "3:00. You at your desk on the open floor; nothing near you to use. Behind glass, the boss at his desk is angry at his computer: its screen is static. His suit jacket hangs on a rack in the corner of his office.",
  },
  {
    name: 'boss-waves-kev',
    cmds: ['pretend until 3:01.5'],
    intent: "The boss waves someone over: his bubble shows Kev's face and a wave. Kev is the young man in the olive hoodie at the desk behind Lin.",
  },
  {
    name: 'kev-fixes',
    cmds: ['pretend until 3:04.6'],
    intent: "Kev stands at the boss's computer, saying he'll fix it (a wrench), while the boss has left his chair and stands aside, watching him. Kev is the one person allowed at that computer.",
  },
  {
    name: 'list-pops',
    cmds: ['pretend until 3:06.6'],
    intent: "Kev fixed it: the screen works again, and what's on it pops out big beside it: a white sheet with a red title bar and a row of four faces, yours in a throbbing red frame. You're on the list (your own frightened thought).",
  },
  {
    name: 'kev-sheds',
    cmds: ['pretend until 3:08.9'],
    intent: "Back at his desk, Kev is hot (sweat, a hot face): his olive hoodie now hangs over the back of his chair, and he sits in a T-shirt.",
  },
  {
    name: 'coat-rack',
    cmds: ['pretend until 3:13', 'goto coat_rack pretend'],
    intent: "The boss has gone to the restroom. You stand at his coat rack in the corner of his office; his dark suit jacket hangs on it, and the rack lights up to show you can take it.",
  },
  {
    name: 'kev-waves-lin',
    cmds: ['pretend until 3:22'],
    intent: "Kev goes home early while the boss is out: bag in hand, he waves goodbye (a wave and a house) and Lin waves back. She knows he's gone; the boss doesn't.",
  },
  {
    name: 'kev-leaves',
    cmds: ['pretend until 3:24'],
    intent: "Kev walks out with his bag, past his chair; his hoodie stays hanging over it.",
  },
  {
    name: 'hoodie-on-chair',
    cmds: ['pretend until 3:26'],
    intent: "Kev has gone: his chair is empty, its seat bare, his olive hoodie hanging over its back; his monitor is off.",
  },
  {
    name: 'hoodie-on',
    cmds: HOODIE,
    intent: "You put on Kev's hoodie: you are olive now, like Kev. His chair is empty. From a distance you look like Kev.",
  },
  {
    name: 'boss-greets-kev',
    cmds: [...HOODIE, 'pretend until 3:30'],
    intent: "Back from the restroom, the boss sees you in the hoodie and greets you, with a smile and Kev's face in his bubble: he takes you for Kev.",
  },
  {
    name: 'acts-up',
    cmds: ['pretend until 3:35.9'],
    intent: "3:35: the boss's screen goes to static again. Angry, he waves for Kev (Kev's face and a wave), but Kev went home.",
  },
  {
    name: 'kev-asks',
    cmds: [...ASK, 'wait 0.5s'],
    intent: "In the hoodie, you offer to fix his static-filled computer (a raised hand and a wrench). The boss is happy to see \"Kev\" and steps out of his chair to stand aside and watch, as he did for the real Kev at 3:00.",
  },
  {
    name: 'list-off',
    cmds: [...EDIT, 'wait 1s'],
    intent: "Your face comes off: the sheet pops out big beside his screen, your red-framed face struck through and falling out of the row, the others closing up. The boss thanks \"Kev\" (a smile and Kev's face).",
  },
  {
    name: 'hoodie-back',
    cmds: RETURN,
    intent: "You hang Kev's hoodie back over his chair and are yourself again, in your red sweater. His screen across the floor shows three faces.",
  },
  {
    name: 'boss-sees-hoodie-off',
    cmds: SEEN,
    intent: "You hang Kev's hoodie back over his chair while the boss can see you: \"Kev\", who was just at his computer, is you. He stops: ❗ and an angry face, a red line from him to you, the screen shakes.",
  },
  {
    name: 'face-back',
    cmds: [...SEEN, 'wait 1.6s'],
    intent: "A beat later the sheet pops out big beside his screen again, and your red-framed face drops back into the row, throbbing. You're back on the list.",
  },
  {
    name: 'lin-double-take',
    cmds: [...HOODIE, 'goto boss_pc'],
    intent: "Lin saw Kev go home, so \"Kev\" walking into the boss's office is wrong: her double take (Kev's face and a question mark), then she points you out. Do it while she's away.",
  },
  {
    name: 'lin-greets-boss',
    cmds: [...JACKET, 'goto boss_pc'],
    intent: "You walk to his computer in the boss's dark jacket. Lin, looking in through the glass, takes you for the boss: a nervous face and the boss's face in her bubble.",
  },
  {
    name: 'jacket-edit',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'wait 1s'],
    intent: "Your face comes off the sheet (it pops out big beside his screen, your face struck and falling out) while, to anyone looking in, the boss is at his own computer.",
  },
  {
    name: 'caught',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:45', 'pretend until 3:45'],
    intent: "The boss is back and you're still in his jacket. He knows his own jacket: he stops, angry, and points at you.",
  },
  {
    name: 'end-win-hoodie',
    cmds: [...RETURN, ...END],
    intent: "Win. The boss, pleased, sends the list with no red face on it. Kev's hoodie hangs over his empty chair, where you put it back; you sit at your desk, in your own sweater, smug.",
  },
  {
    name: 'end-win-jacket',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'goto coat_rack', 'interact', ...END],
    intent: "Win. The boss sends the list himself, with no red face on it; his jacket is back on its rack; you sit at your desk looking smug.",
  },
  {
    name: 'end-fail',
    cmds: ['pretend until 3:45', 'wait 2s'],
    intent: "Lose. The boss sends the list with your red face on it; you carry your desk out in a cardboard box with your plant, past your empty desk and chair.",
  },
  {
    name: 'end-fail-hoodie',
    cmds: [...HOODIE, 'goto boss_pc', 'pretend until 3:45', 'pretend until 3:45', 'wait 3s'],
    intent: "Lose. Told on in Kev's hoodie, you never got to his computer: the list goes out with your red face on it, and you carry your box out still in the olive hoodie.",
  },
  {
    name: 'end-caught',
    cmds: [...JACKET, 'goto boss_pc', 'interact', 'goto my_seat', 'pretend until 3:45', 'pretend until 3:45', 'wait 2s'],
    intent: "Lose. Caught: the boss, furious, points the way out; you go with your box, still in his jacket. Your red face is still on the list.",
  },
  {
    name: 'end-blamed',
    cmds: [...RETURN, 'goto kitchen_table', 'pretend until 3:45', 'wait 3s'],
    intent: "Lose. Your chair is empty in a pool of light; the boss, angry, glares at it and puts your red face back on the list, and it goes out.",
  },
  {
    name: 'end-blamed-kev',
    cmds: [...EDIT, ...END],
    intent: "Lose. You kept Kev's hoodie on: at your desk sits \"Kev\", hood up, sweating. The boss glares (Kev's face and a question mark: Kev, at your desk?), and as you aren't at your desk, he puts your red face back on and it goes out.",
  },
  {
    name: 'end-blamed-seen',
    cmds: [...SEEN, ...END, 'wait 3s'],
    intent: "Lose. The boss saw \"Kev\" was you (he thinks of Kev's face and a ❗), then glares at your desk, angry, and sends the list with your red face on it. Kev's hoodie hangs over Kev's chair where you left it; you sit at your desk in your own sweater, sweating.",
  },
];
