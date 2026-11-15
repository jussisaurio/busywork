// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
// (COLD-READ.md: the pictures reader sees these without the intents.) One whiteboard decides who works Saturday;
// you change the face on it while every head is turned: at the microwave's DING, or while the boss is on the phone
// in the corner of his office and Lin is heating her fish. The copier is a trap: the boss's look at it crosses the
// board.
const DING = ['goto microwave pretend', 'interact', 'goto roster pretend', 'pretend until 4:13'];
const KEV = [...DING, 'interact']; // Kev's face written in
const BOSS = [...DING, 'interact', 'interact']; // written over again: the boss's own (a loss)
const READ = ['pretend until 4:58', 'wait 1.5s']; // the boss turns to the board and points the marker at the face
const HOLD = ['pretend until 4:58', 'wait 2.9s']; // ... and holds it there, saying whose, to 5:00
// (5:00 itself, the room's reaction, is the end beat: no shot lands in it, the replay strips show it. Nor does one
// land in your desk work after a tell, when the boss checks the board: the harness runs it through; replays show it.)
const RING = ['goto desk_phone pretend', 'interact']; // the phone in the supply room, out of the boss's sight: ring his

export default [
  // The office, and the things you can use.
  { name: 'start', cmds: [], intent: "4:00. You seated at your desk, bottom left; nothing lit. The boss in his glass office at the top, a folder on his desk and a phone on a little table in its top-right corner; another phone on a little table in the supply room, top left, behind a wall. Lin at her desk with a lunch box on it, Kev at his; a whiteboard on a stand mid-room with your face in a red box under Saturday, a copier below-left of it; a cup of noodles on the kitchen counter, east." },
  { name: 'board', cmds: ['goto roster pretend'], intent: "At the whiteboard (seven day boxes along the top, Saturday's red, a red line down to the box with your face, two markers in its tray): it lights up with the E key cap; you could write on it." },
  { name: 'microwave', cmds: ['goto microwave pretend'], intent: 'The microwave on the kitchen counter, east wall: a white box on its side, a dark door window with a glass turntable plate in it, a panel of buttons beside; a cup of instant noodles stands on the counter next to it. Lit up with the E key cap. You could heat your noodles.' },
  { name: 'copier', cmds: ['goto copier pretend'], intent: "The photocopier below-left of the board, working, its light green; lit up with the E key cap. You could jam it. The boss's cone, from his desk, reaches toward it across the board." },
  { name: 'phone', cmds: ['wait 1.5s', 'goto desk_phone pretend'], intent: "You went into the supply room, behind the wall, to the phone on its little table: it lights up with the E key cap. The boss can't see you here." },

  // The DING: be at the board when it goes off.
  { name: 'noodles-cooking', cmds: ['goto microwave pretend', 'interact', 'wait 2s'], intent: "The cup of noodles is gone from the counter: it goes round on the turntable in the microwave's lit window, steam rising off it inside; green digits on its panel count down." },
  { name: 'too-early', cmds: ['goto microwave pretend', 'interact', 'goto roster pretend'], intent: "You at the board while the noodles cook: the boss's and Lin's sight cones cover you; writing now would be seen." },
  { name: 'ding', cmds: DING, intent: 'DING: a ripple from the microwave, a noodle bowl thought over every head at once, and every head and sight cone snaps east toward it, away from the board where you stand (the boss\'s cone was on the board until now).' },
  { name: 'noodles-done', cmds: [...DING, 'wait 3s', 'goto microwave pretend'], intent: 'After the DING: the noodle cup is back on the counter beside the microwave, its lid off, steaming; the microwave is dark and empty again.' },
  { name: 'written-kev', cmds: [...KEV, 'wait 1.2s'], intent: "Written: Kev's face pops up big off the board's Saturday box for a beat, a soft white ring spreading off it, and settles into the box." },
  { name: 'written-boss', cmds: [...BOSS, 'wait 1.2s'], intent: "Written over again: the boss's face pops up big off the Saturday box." },

  // The phone: the boss on the phone in his corner while Lin is at the microwave.
  { name: 'phone-ring', cmds: [...RING, 'wait 1s'], intent: "You lifted the supply room's phone: its handset is off, and a dotted line runs from it over to the phone in the boss's corner, shaking; the boss is startled at his desk." },
  { name: 'lin-watches', cmds: [...RING, 'goto board pretend'], intent: "The boss is in his corner on the phone, the dotted line still running from the supply room's phone to his, but Lin, at her desk, faces the board: her cone covers you there." },
  { name: 'lin-up', cmds: ['pretend until 4:30', 'wait 1s'], intent: "4:30: Lin has got up from her desk, thinking of fish, carrying her lunch box, on her way to the kitchen; her chair is pushed out from her desk, turned: she's gone off and will be back." },
  { name: 'lin-fish', cmds: ['pretend until 4:35'], intent: "4:35: Lin waits at the microwave, her back to the room and her cone pointing east, away from the board; her fish going round in the lit window; her chair still pushed out from her empty desk." },
  { name: 'phone-window', cmds: ['pretend until 4:28', ...RING, 'wait 4.5s'], intent: "The boss takes the call standing at the phone in his corner, facing the window, his back to the office, the handset at his ear on a coiled cord, a ❓ over him (hello? nobody there). The supply room's phone is still off its base, the dotted line still running: it's your call. Lin is at the microwave: no cone touches the board." },
  { name: 'written-phone', cmds: ['pretend until 4:31', ...RING, 'goto board pretend', 'interact', 'wait 1.2s'], intent: "With nobody looking, Kev's face pops up big off the board's Saturday box." },
  { name: 'writing-seen', cmds: ['pretend until 4:32', ...RING, 'goto board pretend', 'wait 1s', 'interact'], intent: "The boss is still on the phone in his corner, and you're halfway through writing: Kev's face half drawn over yours in the Saturday box, line by line from the top, the black marker at it (gone from the tray). But Lin, on her way back to her desk with her fish, has just seen you: her cone, gone red, is on you." },

  // The copier: a trap.
  { name: 'copier-jam', cmds: ['goto copier pretend', 'interact', 'wait 2s'], intent: 'The copier is jammed: a crumpled sheet sticking out of its top, a red light flashing, red arcs spreading off it; Kev, at his desk, turns to it with a ❗, a dashed line from him to the copier.' },
  { name: 'kev-fixing', cmds: ['goto copier pretend', 'interact', 'goto kev_desk pretend', 'pretend until 4:07'], intent: 'Kev kneels at the copier, its front open, a spanner in it and in his hand, its light amber; the crumpled sheet is gone, but it still beeps until he is done.' },
  { name: 'mirror-fail', cmds: ['goto copier pretend', 'interact', 'goto roster pretend'], intent: "The copier beeps: the boss thinks of the copier, and an orange dashed line runs from his head at his desk to the copier, straight through the board; you at the board are in plain view." },

  // 5:00: the boss reads the board.
  { name: 'boss-out', cmds: ['pretend until 4:50', 'wait 1.2s'], intent: '4:50: the boss comes out of his office toward the board, head down in a folder he carries in both hands, thinking about paperwork; he isn\'t looking at the board.' },
  { name: 'boss-guards', cmds: ['pretend until 4:52.9'], intent: '4:52: the boss sits beside the board with his back to it, facing the room, the board\'s black marker in his hand (gone from its tray), smug.' },
  { name: 'gather', cmds: ['pretend until 4:57', 'wait 0.5s'], intent: "4:57: the boss sits beside the board with his back to it, facing the room, the board's black marker in his hand (gone from its tray); Lin and Kev sit facing it, and each looks at the empty chair between them with a ❓: its dashed outline on the floor marks it as yours, and you're at your desk." },
  { name: 'reading-points', cmds: ['goto board pretend', ...READ], intent: 'Just before 5:00 the boss turns to the board and points the marker at it; the Saturday box glows yellow round your face.' },
  { name: 'reading-you', cmds: ['goto board pretend', ...HOLD], intent: "Your face is on it: the boss keeps the marker on it, the box glowing, the bubble over him pointing at your face." },
  { name: 'reading-kev', cmds: [...KEV, ...HOLD], intent: "Kev's face is on it: the boss points the marker at it, the bubble over him pointing at Kev's face." },
  { name: 'reading-boss', cmds: [...BOSS, ...HOLD], intent: "His own face is on it, and he never put himself down: the boss has turned to the board, red to the ears, hands spread, the bubble over him his own face and a shocked one." },
  { name: 'away-at-five', cmds: [...KEV, 'goto microwave pretend', ...HOLD], intent: "Just before 5:00, and you're in the kitchen: the boss points at Kev's face on the board; your chair round the board is empty, its dashed outline on the floor." },

  // The end cards: the office on Saturday, and who sits in it (blamed: Friday at 5:00, round the board).
  { name: 'end-win-kev', cmds: [...KEV, 'pretend until 5:00', 'wait 3s'], intent: 'Win, of a kind: Saturday, and Kev is the one at the desk, his face on the board, crying. The row: a pencil, his face, a crying face: you put poor Kev there.' },
  { name: 'end-own-face', cmds: [...BOSS, 'pretend until 5:00', 'wait 3s'], intent: "Loss: Saturday, you at the desk, your face back on the board, and the boss beside it, angry, pointing at you. The row: a pencil, the boss's face, angry, your face: you wrote him in, and he knew." },
  { name: 'end-fail', cmds: ['pretend until 5:00', 'wait 3s'], intent: 'Loss: Saturday, sun outside, and you at the desk with a pile of work; your face is on the board.' },
  { name: 'end-caught', cmds: ['goto roster pretend', 'interact', 'wait 4s'], intent: "Loss, caught: you at the desk on Saturday, and the boss beside the board, angry, pointing at you; on the board, the boss's face half drawn over yours, the marker still at it." },
  { name: 'end-blamed', cmds: [...KEV, 'goto microwave pretend', 'pretend until 5:00', 'wait 3s'], intent: "Loss: Friday, 5:00, round the board. You weren't there, so your face is back on the board: the boss points at your empty chair, outlined red, and Lin and Kev turn to look at it." },
];
