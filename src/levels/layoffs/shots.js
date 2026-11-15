// The Layoff List's cold-read shots (format: the cold-read framework's COLD-READ.md). Each shot: harness commands
// from the start of the day, and what the picture must tell a first-time player. An end card is the picture after
// the day ends; the last command of each end shot is the one that ends the day. A command that stops early (on a
// soft stop such as someone noticing you) is repeated.
const FIX = ['pretend until 3:25.5', 'goto behind_his_desk pretend', 'interact']; // 3:26 static: you kneel at his plug
const RING = [...FIX, 'goto boss_phone', 'interact']; // he's off for coffee: ring Kev's empty desk
const RING_EDIT = [...RING, 'goto his_screen', 'interact'];
const TOLD = [...FIX, 'goto his_screen', 'wait until 3:35.4', 'interact']; // Lin sees you at it, the boss in the kitchen
const PHONE = [...FIX, 'goto his_screen', 'wait until 3:32.75']; // Lin's mobile buzzes at 3:32.4: she turns to read it
const END = ['goto my_seat pretend', 'pretend until 3:45', 'pretend until 3:45']; // to your desk, then the end card

export default [
  {
    name: 'start',
    cmds: ['pretend until 3:00.5'],
    intent: "3:00. You at your desk on the open floor; nothing near you to use. Behind glass, the boss at his desk is angry at his computer: its screen is static. Behind his desk, a cable hangs to a floor socket, its plug half out.",
  },
  {
    name: 'boss-rings-kev',
    cmds: ['pretend until 3:01.3'],
    intent: "The boss has his desk phone's handset at his ear and calls Kev (a phone and Kev's face). Kev's desk phone, behind Lin, rings: it shakes and glows. Lin turns round to it.",
  },
  {
    name: 'kev-picks-up',
    cmds: ['pretend until 3:02.4'],
    intent: "Kev, the young man in olive at the desk behind Lin, has the handset at his ear and says OK (a thumbs up).",
  },
  {
    name: 'kev-kneels',
    cmds: ['pretend until 3:06'],
    intent: "Kev kneels behind the boss's desk at the floor socket, pushing the plug in (a plug in his bubble). The boss stands aside, watching. His screen is still static.",
  },
  {
    name: 'list-pops',
    cmds: ['pretend until 3:08.6'],
    intent: "Fixed: the static is gone and what's on the boss's screen pops out big beside it: a white sheet with a red title bar and a row of faces, yours in a throbbing red frame. You're on the list (your own frightened thought). Lin, through the glass, is frightened too.",
  },
  {
    name: 'lin-relieved',
    cmds: ['pretend until 3:09.4'],
    intent: "Lin is relieved: her face isn't on the list (it pops out beside his screen: four faces, yours in red, none of them hers).",
  },
  {
    name: 'lin-looks',
    cmds: ['pretend until 3:10.9'],
    intent: "Lin turns in her chair and looks at you: she knows you're on it, and she's glad it isn't her.",
  },
  {
    name: 'padlock',
    cmds: ['pretend until 3:12.5'],
    intent: "The boss has gone to the restroom. His screen shows a padlock: he locked it before he went. Nobody can use it while he's out.",
  },
  {
    name: 'kev-waves-lin',
    cmds: ['pretend until 3:16.4'],
    intent: "Kev goes home early while the boss is out: bag in hand, he waves goodbye beside Lin (a wave and a house) and she waves back.",
  },
  {
    name: 'kev-gone',
    cmds: ['pretend until 3:21'],
    intent: "Kev has gone: his chair is empty, his monitor dark, his desk phone on its cradle. The boss is still out.",
  },
  {
    name: 'static-again',
    cmds: ['pretend until 3:26.8'],
    intent: "3:26: the boss is back at his desk and his screen goes to static again. He's angry. The plug behind his desk is half out again.",
  },
  {
    name: 'nobody-answers',
    cmds: ['pretend until 3:29'],
    intent: "The boss phones Kev's desk again, handset at his ear. Kev's empty desk phone rings and rings; Lin turns round to it.",
  },
  {
    name: 'you-at-the-plug',
    cmds: ['pretend until 3:25.5', 'goto behind_his_desk pretend'],
    intent: "You stand behind the boss's desk at his floor socket, where Kev knelt at 3:05; its plug is half out and lights up to show you can use it. He sits at his static screen, phone to his ear, calling Kev's desk; it rings, and nobody is there.",
  },
  {
    name: 'he-left-you-to-it',
    cmds: FIX,
    intent: "You pushed the plug home. The boss left you to it the moment you knelt (he said: coffee, pointing at you) and is walking out of his office towards the kitchen. His screen works again, with the list open on it: your face in its red frame. He never locked it: when he left, it was only static.",
  },
  {
    name: 'list-up-alone',
    cmds: [...FIX, 'wait 5s'],
    intent: "The plug is home. The boss is gone, in the kitchen across the floor at the coffee machine. His screen works again, with the list open on it, unlocked: your face in its red frame.",
  },
  {
    name: 'ring-empty-desk',
    cmds: [...RING, 'wait 0.4s'],
    intent: "You've picked up the boss's desk phone and called Kev's desk: Kev's empty desk phone, behind Lin, rings and glows. Lin turns round in her chair to look at it, her back to the boss's office.",
  },
  {
    name: 'face-off',
    cmds: [...RING_EDIT, 'wait 0.5s'],
    intent: "Done: the sheet pops out beside his screen with three faces; yours has gone from the row. Lin still has her back turned to the office, at Kev's ringing phone. The boss is still at the coffee machine.",
  },
  {
    name: 'lin-buzz',
    cmds: [...FIX, 'goto his_screen', 'wait until 3:32.5'],
    intent: "Lin's mobile, lying on her desk, buzzes: it rattles, its screen lit. She picks it up and turns away to read it.",
  },
  {
    name: 'phone-edit',
    cmds: [...PHONE, 'interact', 'wait 1.5s'],
    intent: "You struck your face off while Lin read her mobile: the sheet beside the boss's screen shows three faces. Lin has put her mobile down and faces the office again; she never saw. The boss is at the coffee machine.",
  },
  {
    name: 'told-on',
    cmds: [...FIX, 'goto his_screen', 'wait until 3:35.4', 'interact'],
    intent: "Lin, facing the office, sees your face being struck off the list on the big sheet beside the screen. Her thought: the list, her own face, frightened. The boss is far off in the kitchen at the coffee machine.",
  },
  {
    name: 'lin-goes-to-tell',
    cmds: [...TOLD, 'wait until 3:37.6'],
    intent: "Lin has left her desk and walks along the hallway towards the kitchen, where the boss is. On the boss's screen your face is gone: three faces.",
  },
  {
    name: 'lin-tells-him',
    cmds: [...TOLD, 'wait until 3:45'], // stops as she tells him
    intent: "In the hallway, Lin points the boss to you (a pointing hand, your face, a screen). A line runs from her to him.",
  },
  {
    name: 'face-back',
    cmds: [...TOLD, 'goto my_seat pretend', 'pretend until 3:42.4', 'pretend until 3:42.4', 'pretend until 3:42.4'],
    intent: "The boss is back at his screen, angry (😠). The list pops out of it again with your face on it, the red line gone: he has put you back.",
  },
  {
    name: 'comes-for-you',
    cmds: [...TOLD, 'wait until 3:45', 'goto my_seat pretend', 'pretend until 3:45', 'pretend until 3:45'],
    beat: true,
    intent: "The boss has left his office and stops on the floor, pointing at you at your desk (❗, a pointing hand, your face): caught. His screen behind him shows a padlock.",
  },
  {
    name: 'caught',
    cmds: [...FIX, 'goto his_screen', 'wait until 3:39.8', 'interact', 'interact'],
    beat: true,
    intent: "The boss is back with his coffee and sees you at his screen, editing his list: he stops, angry, and points at you.",
  },
  {
    name: 'head-count',
    cmds: [...RING_EDIT, 'goto my_seat pretend', 'pretend until 3:43'],
    intent: "3:43: the boss, back at his desk with his coffee, turns in his chair to his screen and ticks the sheet (a sheet, a tick): he goes down it name by name, and your face isn't on it, so he has no reason to look at your desk.",
  },
  {
    name: 'end-win-ring',
    cmds: [...RING_EDIT, ...END],
    intent: "Win. The boss sends the list without your face on it; a ringing phone and an email in the card. You sit at your desk, smug.",
  },
  {
    name: 'end-win-phone',
    cmds: [...PHONE, 'interact', ...END],
    intent: "Win. The boss sends the list without your face on it; a mobile and an email in the card. You sit at your desk, smug.",
  },
  {
    name: 'end-fail',
    cmds: ['pretend until 3:45', 'wait 2s'],
    intent: "Lose. The boss sends the list with your red face on it; you carry your desk out in a cardboard box with your plant, past your empty desk and chair.",
  },
  {
    name: 'end-caught',
    cmds: [...FIX, 'goto his_screen', 'wait until 3:39.8', 'interact', 'interact', 'interact', 'pretend until 3:45', 'wait 2s'],
    intent: "Lose. Caught: the boss, furious, points the way out; you go with your box. Your red face is still on the list.",
  },
];
