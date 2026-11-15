// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player
// (the cold-read format: COLD-READ.md). The times come from the schedules in cast.js and the audit in index.js.
// 'pretend', not 'wait': standing idle while the auditor is about stops a wait at his suspicion.
// The plain fail card has no shot: no play reaches it (a ❌ always names a desk: fired_<desk>; four ticks always
// count one laptop twice: a win).
const HOME = ['put your_desk', 'goto my_seat pretend', 'sit']; // the laptop onto your desk, back in your seat
const BOSS = ['goto boss_desk pretend', 'pretend until 3:39.6', 'interact', 'wait until 3:41.3', ...HOME];
const LIN = ['goto hallway_west pretend', 'pretend until 3:39.6', 'interact', 'wait until 3:41.3', ...HOME];
const KEV = ['pretend until 3:24', 'goto kev_desk', 'interact', ...HOME];
// Lin's laptop while she's in the restroom, kept in the meeting room till Kev's is off your desk.
const LIN_EARLY = ['goto hallway_west pretend', 'pretend until 3:12', 'interact', 'goto pens', 'wait until 3:20.5', ...HOME];
// The boss's laptop while he smokes and Lin is in the restroom, held in the hallway till Kev's is off your desk.
const BOSS_EARLY = ['goto office_door pretend', 'pretend until 3:11.4', 'goto boss_desk', 'interact', 'goto hallway_mid', 'wait until 3:20', ...HOME];
const POUR = ['goto hallway_coffee', 'interact']; // the hallway pot, at 3:02
const END = ['pretend until 4:05', 'pretend until 4:05']; // to the end card (a soft stop ends the first)

export default [
  // The afternoon, before anyone moves.
  { name: 'start', cmds: ['wait 1s'],
    intent: 'The start of the afternoon. The boss sits in his glass office; Lin, you and Kev sit at desks in the open office. The boss, Lin and Kev each have a laptop on their desk, each lid in its owner\'s colour. Your desk has none. Nothing near you is lit up as something to use.' },

  // The boss's smoke, Kev's lunch, Lin's restroom break.
  { name: 'kev-packs', cmds: ['pretend until 3:10.4'],
    intent: 'Kev gets up for lunch with his laptop (olive lid) in his hands. His desk is bare. Down in the lobby the boss smokes; Lin, at her desk, looks into his empty office through the glass.' },
  { name: 'lin-restroom', cmds: ['pretend until 3:11.5'],
    intent: 'Lin gets up and walks off toward the restroom. Her laptop (teal lid) stays on her desk behind her. Kev stops at the end of your desk with his laptop.' },
  { name: 'kev-forgets', cmds: ['pretend until 3:11.8'],
    intent: 'Kev sets his laptop down on the end of your desk and waves goodbye (👋), and walks off to the lift without it.' },
  { name: 'kev-laptop-here', cmds: ['pretend until 3:12.9', 'goto my_seat'],
    intent: 'Kev is on his way to the lift; his laptop lies on your desk, and it lights up as something you can take. Lin is walking off toward the restroom; the boss smokes in the lobby.' },
  { name: 'kev-facepalm', cmds: ['pretend until 3:20.1'],
    intent: 'Back from lunch, Kev finds his laptop on your desk, where he left it, and slaps his forehead (💻🤦): silly him. He picks it up to take it to his own desk.' },

  // Owners miss their laptops, look for them, and take them back.
  { name: 'boss-misses-it', cmds: [...BOSS_EARLY.slice(0, 5), 'pretend until 3:18'],
    intent: 'Back from his smoke, the boss sits down at a bare desk and wonders where his laptop went (💻❓). You stand in the hallway at the end of your desk with it in your hands (navy lid); Kev\'s laptop (olive lid) lies on your desk.' },
  { name: 'boss-spots-it', cmds: [...BOSS_EARLY, 'pretend until 3:21.6'],
    intent: 'The boss, out in the hallway looking for his laptop, has seen it on your desk: he glares at it (😠👀💻). You sit at your desk beside it.' },
  { name: 'boss-takes-it-back', cmds: [...BOSS_EARLY, 'pretend until 3:22.7', 'pretend until 3:22.7'],
    intent: 'The boss stands at the end of your desk and picks up his laptop, angry (😠💻), right beside you in your seat.' },
  { name: 'boss-carries-it-home', cmds: [...BOSS_EARLY, 'pretend until 3:24', 'pretend until 3:24'],
    intent: 'The boss carries his laptop (navy lid) back along the hallway to his office; your desk is bare.' },
  { name: 'lin-misses-it', cmds: [...LIN_EARLY, 'pretend until 3:22.3'],
    intent: 'Back from the restroom, Lin finds her desk bare and wonders where her laptop went (💻❓). Her laptop (teal lid) lies on your desk; you sit beside it.' },
  { name: 'lin-sees-you', cmds: ['pretend until 3:06.5', 'goto boss_desk pretend', 'interact'],
    intent: 'You reach for the boss\'s laptop while he is out smoking. Through the glass, Lin sees you and points at you, shocked (❗👉 you). You let go of it.' },
  { name: 'lin-tells', cmds: ['pretend until 3:06.5', 'goto boss_desk pretend', 'interact', 'pretend until 3:25.9'],
    intent: 'The auditor is out of the lift. Lin points you out to him with a laptop (👉 you 💻), and he sends you to your desk to do paperwork (📄📄👉 screen): you sit typing.' },

  // A coffee: your hands are full.
  { name: 'pour', cmds: POUR,
    intent: 'You fill a cup from the full pot on the hallway coffee machine. The cup is in your hand.' },
  { name: 'cup-in-hand', cmds: [...POUR, 'pretend until 3:24', 'goto kev_desk pretend'],
    intent: 'You stand at Kev\'s desk, holding the cup, while Kev has a coffee in the kitchen. His laptop does not light up: what you can do is drink your coffee.' },

  // 3:25: the auditor.
  { name: 'kev-grab', cmds: ['pretend until 3:24', 'goto kev_desk', 'interact', 'move W 0.7s'],
    intent: 'Kev is in the kitchen with a coffee. You have unplugged his laptop from his empty desk and step away with it, his desk bare behind you.' },
  { name: 'auditor-arrives', cmds: ['pretend until 3:29.5'],
    intent: 'A man in a grey suit, a stranger to this office, has come up from the lobby and stands at the hallway coffee machine with his back to you, having a coffee: the auditor, a few minutes early. Kev stands in the kitchen with a coffee of his own.' },
  { name: 'tick-boss', cmds: ['pretend until 3:32.9'],
    intent: 'The audit starts at the boss\'s desk. The auditor writes on his clipboard; a sign over the desk shows a laptop and a tick, and a green tick sticker appears on the front edge of the desk.' },
  { name: 'boss-leaves', cmds: ['pretend until 3:34.3'],
    intent: 'His desk ticked off (the sticker stays), the boss walks out for another smoke and leaves his laptop behind. The auditor, done at that desk, is on his way out of the glass office behind him.' },
  { name: 'tick-lin', cmds: ['pretend until 3:36.35'],
    intent: 'Lin\'s desk gets its tick (a sign: laptop and tick) and its sticker while Lin walks off down the hallway toward the kitchen. Her laptop stays on her desk.' },
  { name: 'pen-dry', cmds: ['pretend until 3:37'],
    intent: 'At Lin\'s desk, the auditor stands head down over his clipboard, scribbling on its corner to get his dry pen going (a thought over him: pen, question mark). Lin\'s desk has its tick sticker and her laptop on it; Lin is almost at the kitchen.' },
  { name: 'pen-errand', cmds: ['pretend until 3:40.5'],
    intent: 'The auditor walks off along the hallway into the meeting room, away from Lin\'s desk. Her laptop lies alone on her ticked desk.' },
  { name: 'pen-pot', cmds: ['pretend until 3:42.7'],
    intent: 'In the meeting room, his back to the door, the auditor reaches into a mug of pens on the table (a thought: a pen).' },
  { name: 'cross-you', cmds: ['pretend until 3:45.1'],
    intent: 'Third desk, yours: no laptop on it. The sign shows a laptop and a cross, the auditor is angry (😠) and looks at you.' },
  { name: 'phone-rings', cmds: ['pretend until 3:46.3'],
    intent: 'The auditor\'s phone rings: he holds it to his ear (📱) and walks off toward the meeting room.' },
  { name: 'on-the-call', cmds: ['pretend until 3:50'],
    intent: 'The auditor stands at the meeting-room window on the phone, talking (💬), his back to the door and the office.' },

  // The boss's laptop, counted on his desk and on yours.
  { name: 'boss-grab', cmds: ['goto boss_desk pretend', 'pretend until 3:39.6', 'interact'],
    intent: 'The boss is out smoking, Lin is in the kitchen, and the auditor has walked off down the hallway toward the meeting room: nobody watches the boss\'s office. You unplug the boss\'s laptop, already ticked.' },
  { name: 'boss-recount', cmds: [...BOSS, 'pretend until 3:45.1'],
    intent: 'The boss\'s laptop (navy lid) now sits on your desk, and the auditor ticks your desk too. The boss\'s desk keeps its sticker with no laptop on it; yours gets one now.' },

  // Lin's laptop, counted on her desk and on yours.
  { name: 'lin-grab', cmds: ['goto hallway_west pretend', 'pretend until 3:39.6', 'interact'],
    intent: 'Lin\'s desk is ticked, Lin is in the kitchen, and the auditor has walked off down the hallway toward the meeting room. You unplug her laptop from her desk.' },
  { name: 'lin-recount', cmds: [...LIN, 'pretend until 3:45.1'],
    intent: 'Lin\'s laptop (teal lid) sits on your desk, and the auditor ticks your desk too. Lin\'s desk keeps its sticker with no laptop on it.' },

  // Kev's laptop, counted on your desk and then on his.
  { name: 'kev-tick-you', cmds: [...KEV, 'pretend until 3:45.1'],
    intent: 'Kev\'s laptop on your desk gets your desk its tick. Kev is still in the kitchen with his coffee.' },
  { name: 'kev-looks', cmds: [...KEV, 'pretend until 3:48'],
    intent: 'The auditor is off on his phone call. Kev, back from the kitchen, stands in the hallway by his bare desk, puzzled (💻❓), and looks over at his laptop on your desk.' },
  { name: 'kev-fetch', cmds: [...KEV, 'pretend until 3:49.9'],
    intent: 'Kev picks up his laptop from your desk, slapping his forehead (💻🤦), in plain view of the office. The auditor is in the meeting room on the phone, his back to the door. Your desk is bare but keeps its sticker.' },
  { name: 'kev-home', cmds: [...KEV, 'pretend until 3:51'],
    intent: 'Kev carries his laptop (olive lid) along the hallway to his own desk, which the auditor has not checked yet. The auditor is still on the phone in the meeting room.' },
  { name: 'kev-fourth', cmds: [...KEV, 'pretend until 3:56.7'],
    intent: 'Kev\'s desk, his laptop back on it, gets the fourth tick and the fourth sticker.' },
  { name: 'sign-off', cmds: [...KEV, 'pretend until 4:00.1'],
    intent: 'The audit done, the auditor comes back to your desk to sign it off and smiles at you, sitting there (😊).' },
  { name: 'fired', cmds: ['pretend until 4:00.1'],
    intent: 'The audit done, the auditor is back at your desk, over you in your seat, thinking of the cross on his list (a laptop and a cross). Your desk has a red cross sticker.' },

  // The end cards.
  { name: 'end-win-boss', cmds: [...BOSS, ...END],
    intent: 'Win: you sit smug behind your desk with the boss\'s laptop (navy lid) on it; the auditor smiles over four ticks on his clipboard; the boss smokes in the lobby, none the wiser. Row: the boss, a cigarette, the laptop, two ticks.' },
  { name: 'end-win-lin', cmds: [...LIN, ...END],
    intent: 'Win: you sit smug with Lin\'s laptop (teal lid) on your desk; the auditor smiles over four ticks; Lin strolls off with her coffee cup, humming. Row: Lin, a coffee, the laptop, two ticks.' },
  { name: 'end-win-kev', cmds: [...KEV, ...END],
    intent: 'Win: your desk is bare again and you are smug; the auditor smiles over four ticks; Kev carries his laptop (olive lid) back to his desk, humming. Row: the laptop, two ticks, Kev humming.' },
  { name: 'end-fired-you', cmds: END,
    intent: 'Loss: your desk got the cross: it has no laptop. The auditor holds a clipboard with a cross on it and points the way out, and you carry your things in a box to the lift.' },
  { name: 'end-fired-lin', cmds: [...LIN_EARLY, ...END],
    intent: 'Loss: you took Lin\'s laptop too early. Her desk (teal chair) got the first cross and stands bare; the auditor points the way out, and you go to the lift with a box.' },
  { name: 'end-fired-boss', cmds: [...BOSS_EARLY, ...END],
    intent: 'Loss: the boss took his laptop back off your desk, and your desk got the cross; the auditor points the way out, and you go to the lift with a box.' },
  { name: 'caught-seen', cmds: ['goto boss_desk pretend', 'pretend until 3:33', 'interact'], beat: true,
    intent: 'Caught: you reach for the boss\'s laptop at his desk, and the auditor, at the glass office door on his way out, has seen you. An alert (❗😠) goes up over the desk; his view cone fills the office doorway.' },
  { name: 'caught-holding', cmds: [...LIN.slice(0, 4), 'goto my_seat', 'sit', 'wait until 3:47'], beat: 0.4,
    intent: 'Caught: you sit at your desk holding Lin\'s laptop (it shows in your hand slot) as the auditor comes to tick it. His view cone goes red over you and an alert (❗👉 you) goes up over him.' },
  { name: 'end-caught-seen', cmds: ['goto boss_desk pretend', 'pretend until 3:33', 'interact', ...END],
    intent: 'Loss: the auditor saw you reach for a laptop. It lies on the floor, he points, and you go to the lift with a box.' },
  { name: 'end-blamed', cmds: [...BOSS.slice(0, 5), 'goto hallway_west pretend', ...END],
    intent: 'Loss: the audit passed, but your chair was empty when he came to sign it off. He glares at it and asks where you are (your face, ?), and you go to the lift with a box.' },
];
