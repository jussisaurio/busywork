// The Layoff List's cold-read shots (format: the cold-read framework's COLD-READ.md). Each shot: harness commands
// from the start of the day, and what the picture must tell a first-time player. An end card is the picture after
// the day ends; the last command of each end shot is the one that ends the day. A command that stops early (on a
// soft stop such as someone noticing you) is repeated.
const PULL = ['pretend until 3:14', 'goto behind_his_desk', 'interact']; // he's in the restroom: pull his plug
const FIX = [...PULL, 'goto my_seat pretend', 'pretend until 3:30.3', 'goto behind_his_desk', 'interact']; // he's off to the coffee: plug it in
const RING = [...FIX, 'goto boss_phone', 'wait until 3:33', 'interact']; // ring Kev's empty desk
const RING_EDIT = [...RING, 'goto his_screen', 'interact'];
const SEEN = [...FIX, 'goto his_screen', 'wait until 3:35.4', 'interact']; // Lin sees you at it, the boss in the kitchen
const TOLD = [...SEEN, 'interact']; // her shout pauses the edit: finish it
const PHONE = [...FIX, 'goto his_screen', 'wait until 3:34.1']; // Lin's mobile buzzes at 3:33.6: she turns to read it
const END = ['goto my_seat pretend', 'pretend until 3:45', 'pretend until 3:45']; // to your desk, then the end card

export default [
  {
    name: 'start',
    cmds: ['pretend until 3:00.5'],
    intent: "3:00. You at your desk on the open floor; nothing near you to use. Behind glass, the boss at his desk is angry at his computer: its screen is plain black, the monitor off. Behind his desk, on the floor, a socket with the plug of the monitor's cable hanging out of it, sparking.",
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
    intent: "Kev kneels behind the boss's desk at the floor socket, pushing the plug in (a plug in his bubble). The boss stands aside, watching. His screen is still black.",
  },
  {
    name: 'list-pops',
    cmds: ['pretend until 3:08.6'],
    intent: "Fixed: the screen blinks on and what's on the boss's screen pops out big beside it: a white sheet with a red title bar and a row of faces, yours in a throbbing red frame. You're on the list (your own frightened thought). Lin, through the glass, is frightened too.",
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
    name: 'padlock-jolts',
    cmds: ['pretend until 3:13', 'goto his_screen pretend', 'interact'],
    intent: "You stand at the boss's screen while he's in the restroom and try it: the padlock on it shakes and flashes red, and you think of a padlock. It's locked; nothing to do here.",
  },
  {
    name: 'kev-waves-lin',
    cmds: ['pretend until 3:16.4'],
    intent: "Kev goes home early while the boss is out: bag in hand, he waves goodbye beside Lin (a wave and a house) and she waves back.",
  },
  {
    name: 'kev-gone',
    cmds: ['pretend until 3:18.6'],
    intent: "Kev has gone: his chair is empty, his monitor dark, his desk phone on its cradle. The boss is walking back to his office from the restroom.",
  },
  {
    name: 'you-pull-the-plug',
    cmds: [...PULL, 'wait 0.3s'],
    intent: "The boss is in the restroom. You've crept behind his desk and yanked his monitor's plug out of the floor socket (its cable runs from the back of his screen down to the socket): it hangs out, sparking, and his screen has gone plain black, its power light dark. A bang.",
  },
  {
    name: 'types-blind',
    cmds: [...PULL, 'goto my_seat pretend', 'pretend until 3:22.9'],
    intent: "You're back at your desk. The boss is back from the restroom at his desk, typing (hands on the keys), his screen plain black (behind him the plug you pulled hangs out, sparking). Over his head: five asterisks, a password going in.",
  },
  {
    name: 'hard-enter',
    cmds: [...PULL, 'goto my_seat pretend', 'pretend until 3:23.6'],
    intent: "The boss hits Enter, hard: a big key with a return arrow and impact lines over his head. His screen is still black.",
  },
  {
    name: 'stares-at-black',
    cmds: [...PULL, 'goto my_seat pretend', 'pretend until 3:24.3'],
    intent: "Nothing on the screen. The boss stares at it, puzzled (a thought cloud: a monitor and a question mark). It stays black.",
  },
  {
    name: 'thumps-it',
    cmds: [...PULL, 'goto my_seat pretend', 'pretend until 3:24.95'],
    intent: "The boss thumps the black screen, angry. It stays black.",
  },
  {
    name: 'nobody-answers',
    cmds: [...PULL, 'goto my_seat pretend', 'pretend until 3:25.8'],
    intent: "The boss phones Kev's desk, handset at his ear. Kev's empty desk phone rings and rings; Lin turns round to it.",
  },
  {
    name: 'gives-up',
    cmds: [...PULL, 'goto my_seat pretend', 'pretend until 3:27.25'],
    intent: "Nobody came. The boss sighs and thinks of coffee, and gets up. His screen is still black: no padlock on it.",
  },
  {
    name: 'walks-to-kitchen',
    cmds: [...PULL, 'goto my_seat pretend', 'pretend until 3:29'],
    intent: "Your trick worked: the boss walks out across the floor towards the kitchen. Behind him, his office is empty and his screen is black.",
  },
  {
    name: 'you-at-the-plug',
    cmds: [...PULL, 'goto my_seat pretend', 'pretend until 3:30.3', 'goto behind_his_desk pretend'],
    intent: "You stand behind the boss's empty desk at the floor socket again: the plug hangs out of it, sparking, and lights up to show you can use it. The boss is out of sight, at the coffee machine.",
  },
  {
    name: 'powers-on',
    cmds: [...FIX, 'wait 0.15s'],
    intent: "You've pushed the plug home: the boss's screen blinks on, a white flash, straight onto his open desktop (no padlock): the PC behind it took the password he typed into the dark.",
  },
  {
    name: 'list-up-alone',
    cmds: [...FIX, 'wait 1s'],
    intent: "The plug is home. The boss is gone, at the coffee machine in the kitchen. His screen is on again, straight onto his desktop with the list open, unlocked (no padlock: he logged in blind): your face in its red frame.",
  },
  {
    name: 'ring-empty-desk',
    cmds: [...RING, 'wait 0.4s'],
    intent: "You've picked up the boss's desk phone and called Kev's desk: its handset lies off the cradle on his desk, on its coiled cord. Kev's empty desk phone, behind Lin, rings and glows. Lin turns round in her chair to look at it (eyes and a phone in her thought), her back to the boss's office.",
  },
  {
    name: 'face-off',
    cmds: [...RING_EDIT, 'wait 0.5s'],
    intent: "Done: the sheet pops out beside his screen with three faces; yours has gone from the row. Lin still has her back turned to the office, at Kev's ringing phone. The boss is still at the coffee machine.",
  },
  {
    name: 'lin-buzz',
    cmds: [...FIX, 'goto his_screen', 'wait until 3:34.2'],
    intent: "Lin's mobile, lying on her desk, buzzes: it rattles, its screen lit. She picks it up and turns away to read it (a mobile in her thought).",
  },
  {
    name: 'phone-edit',
    cmds: [...PHONE, 'interact', 'wait 3s'],
    intent: "You struck your face off while Lin read her mobile, and closed the sheet: the boss's screen shows his email again (a white window, a little attached sheet with a red top, a blue send button), with no faces on it. Lin has put her mobile down and faces the office again; she never saw. The boss is at the coffee machine.",
  },
  {
    name: 'told-on',
    cmds: SEEN,
    intent: "Lin, facing the office, sees a red X being drawn across your face on the big sheet beside the screen. She shouts and points at you (an exclamation, a pointing hand, your face). The boss is far off in the kitchen at the coffee machine.",
  },
  {
    name: 'lin-thinks',
    cmds: [...SEEN, 'wait 1.6s'],
    intent: "After shouting, Lin thinks it through (a thought cloud): the list, her own face, frightened. If you go, she's next.",
  },
  {
    name: 'lin-goes-to-tell',
    cmds: [...TOLD, 'wait until 3:37.6'],
    intent: "Lin has left her desk and walks along the hallway towards the kitchen, where the boss is. The boss's screen shows his email again: you closed the sheet.",
  },
  {
    name: 'lin-tells-him',
    cmds: [...TOLD, 'wait until 3:45'], // stops as she tells him
    intent: "In the hallway, Lin points the boss to you (a pointing hand, your face, a screen). A line runs from her to him.",
  },
  {
    name: 'face-back',
    cmds: [...TOLD, 'goto my_seat pretend', 'goto my_seat pretend', 'pretend until 3:43.3', 'pretend until 3:43.3'],
    intent: "The boss is back at his screen, angry (😠). The list pops out of it again with your face on it, the red line gone: he has put you back.",
  },
  {
    name: 'he-knows',
    cmds: [...TOLD, 'goto my_seat pretend', 'goto my_seat pretend', 'pretend until 3:44.9', 'pretend until 3:44.9'],
    intent: "The boss sits back at his desk, the list open on his screen again with your face back on it, and looks out across the floor at you: a pointing hand, your face, angry. He doesn't get up.",
  },
  {
    name: 'caught',
    cmds: [...FIX, 'goto his_screen', 'wait until 3:41.2', 'interact'],
    beat: true,
    intent: "The boss is back with his coffee and sees you at his screen, editing his list: he stops, angry, and points at you.",
  },
  {
    name: 'head-count-gone',
    cmds: [...RING_EDIT, 'goto my_seat pretend', 'pretend until 3:43.9'],
    intent: "Nearly 3:44: the boss, back at his desk with his coffee, opens the list one last time: it pops out big beside his screen with three faces, yours gone. Over his head: the list, a raised eyebrow, a shrug. He didn't notice.",
  },
  {
    name: 'head-count-you',
    cmds: ['pretend until 3:42.9'],
    intent: "You did nothing: 3:42, the boss at his desk opens the list one last time: it pops out big with four faces, yours in its red frame. Over his head: the list, your face, a tick.",
  },
  {
    name: 'packs-up',
    cmds: [...RING_EDIT, 'goto my_seat pretend', 'pretend until 3:44.4'],
    intent: "3:44: the boss is back at his desk, packing up for the weekend after his head count: a coat and an email over his head.",
  },
  {
    name: 'sends-from-mobile',
    cmds: [...PULL, 'goto my_seat pretend', 'pretend until 3:43.9'],
    intent: "You pulled his plug and never put it back: 3:43, the boss at his desk, coat on, his screen still black. Over his head: a coat, a mobile phone and an email. He sends it from his phone.",
  },
  {
    name: 'list-flies',
    cmds: [...RING_EDIT, 'goto my_seat pretend', 'pretend until 3:44.9'],
    beat: 0.3,
    intent: "3:45: the boss clicks send. The attached sheet pops out big beside his screen, three faces on it and none of them yours, and starts to fly off. You sit at your desk, celebrating.",
  },
  {
    name: 'trespass-eyebrow',
    cmds: ['pretend until 3:25', 'goto boss_office_door pretend', 'move N 2s pretend', 'move W 0.6s pretend'], // his 🤨, a beat before he shows you out
    intent: "You walk into the boss's glass office while he sits at his desk, pretending with your folder. He has looked up at you: a thought with your face and a raised eyebrow. Whose office do you think this is?",
  },
  {
    name: 'trespass-shown-out',
    cmds: ['pretend until 3:25', 'goto behind_his_desk pretend'], // a walk stops as he shows you out
    intent: "The boss points you out of his office: a speech bubble, a pointing hand, your face and a door. He stares after you; you turn for the door, empty-handed.",
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
    name: 'end-told',
    cmds: [...TOLD, 'wait until 3:37.5', 'goto restroom', 'wait until 3:45', 'wait until 3:45', 'wait until 3:45', 'wait until 3:45', 'wait 2s'],
    intent: "Lose. Lin told on you: Lin stands at the boss's desk pointing you out while he sends the list with your red face back on it; you carry your box out. Lin's face, a pointing hand and a box in the card.",
  },
  {
    name: 'end-caught',
    cmds: [...FIX, 'goto his_screen', 'wait until 3:41.2', 'interact', 'interact', 'interact', 'pretend until 3:45', 'wait 2s'],
    intent: "Lose. Caught: the boss, furious, points the way out; you go with your box. Your red face is still on the list.",
  },
];
