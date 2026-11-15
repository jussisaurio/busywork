// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
// (COLD-READ.md: the pictures reader sees these without the intents.) The three routes: the microwave's DING
// (the roster), the desk phone while Lin heats her fish (the roster), the jammed copier (Kev's sign-off sheet).
const DING = ['goto microwave pretend', 'interact', 'goto roster pretend', 'pretend until 4:13'];
const SWAP = ['goto copier pretend', 'interact', 'goto tray pretend', 'interact'];

export default [
  // The office, and the things you can use.
  { name: 'start', cmds: [], intent: '4:00. You at your desk (bottom left, a phone on it); the boss behind the glass, watching the office; Lin and Kev at their desks; a whiteboard on a stand in the middle of the room; the clock at 4:00.' },
  { name: 'roster', cmds: ['goto roster pretend'], intent: 'The whiteboard is the Saturday roster: a week strip with Saturday ringed, and your photo at the top. You can write on it (✏️).' },
  { name: 'tray', cmds: ['goto tray pretend'], intent: "Kev's in-tray, at the front of his desk, holds a sheet with your photo on it; Kev sits right behind it, facing it." },
  { name: 'copier', cmds: ['goto copier pretend'], intent: 'The photocopier in the corner, working. You could jam a paper clip in it (📎).' },
  { name: 'microwave', cmds: ['goto microwave pretend'], intent: 'The microwave on the counter by the east wall, dark and empty. You could heat your noodles (🍜).' },

  // The DING: be at the board when it goes off.
  { name: 'noodles-cooking', cmds: ['goto microwave pretend', 'interact', 'wait 2s'], intent: 'Your noodles turn in the lit microwave and its display counts down the seconds to the ding.' },
  { name: 'ding', cmds: DING, intent: 'DING: a ripple from the microwave, and every head and sight cone snaps east toward it, away from the board, where you stand.' },
  { name: 'roster-written', cmds: [...DING, 'interact', 'wait 2s'], intent: "While everyone still looks at the microwave, the boss's photo is now at the top of the Saturday roster; you whistle, innocent." },
  { name: 'reading-boss', cmds: [...DING, 'interact', 'pretend until 4:59', 'wait 1.7s'], intent: '5:00, everyone round the board: the boss reads the top name, his own, and goes red (😳).' },

  // The phone: the boss at his window while Lin is at the microwave.
  { name: 'lin-watches', cmds: ['pretend 0.5s', 'interact', 'goto board pretend'], intent: "The boss is away at his window on the phone, but Lin, at her desk, faces the board: her sight cone covers you there." },
  { name: 'phone-ring', cmds: ['pretend 0.5s', 'interact', 'wait 1s'], intent: "Your desk phone rings the boss's: a dashed line from your phone to his, his phone shaking, and the boss jumps (☎️❗)." },
  { name: 'lin-fish', cmds: ['pretend until 4:35'], intent: "4:35: Lin stands at the microwave, her fish turning in it (it smells), her back to the board; she's been gone since 4:30." },
  { name: 'phone-window', cmds: ['pretend until 4:31', 'interact', 'wait 5s'], intent: 'The boss takes the call at his window, his back to the office, puzzled (nobody on the line), while Lin is at the microwave: nobody watches the board.' },

  // The copier: Kev leaves his tray to fix it.
  { name: 'copier-jam', cmds: ['goto copier pretend', 'interact', 'wait 2s'], intent: 'The copier is jammed: crumpled paper, a red light, red beeping ripples; heads turn to it and Kev jumps up (🖨️❗).' },
  { name: 'kev-fixing', cmds: ['goto copier pretend', 'interact', 'goto tray pretend', 'pretend until 4:10'], intent: "Kev kneels at the copier with a spanner, his back to his desk; his tray is unwatched and you stand at it." },
  { name: 'sheet-swapped', cmds: [...SWAP, 'wait 1.8s'], intent: "The sheet in Kev's tray now has Kev's photo on it instead of yours; you whistle." },
  { name: 'kev-takes-sheet', cmds: ['pretend until 4:53'], intent: '4:52, every day: Kev takes the sheet out of his tray and carries it to the boss, who now stands guard by the board.' },
  { name: 'reading-kev', cmds: [...SWAP, 'goto board pretend', 'pretend until 4:59', 'wait 1.4s'], intent: '5:00: Kev holds the sheet with his own photo on it; the boss points at Kev (❗).' },

  // How it goes wrong.
  { name: 'teaching-fail', cmds: ['goto microwave pretend', 'interact', 'goto tray pretend', 'pretend until 4:13'], intent: "You at Kev's tray when it dings: Lin turns toward the microwave and so looks straight at you; the tray is the wrong place to be at the ding." },
  { name: 'mirror-fail', cmds: ['goto copier pretend', 'interact', 'goto roster pretend'], intent: 'The copier beeps behind the board: every head is turned toward the copier, so the board, and you at it, are in plain view.' },
  { name: 'gather', cmds: ['pretend until 4:56'], intent: '4:55: everyone gathers on chairs round the board; one chair, mustard like your desk chair, waits for you.' },

  // The end cards.
  { name: 'end-roster', cmds: [...DING, 'interact', 'pretend until 5:00', 'wait 3s'], intent: "Win: the boss's photo tops the Saturday roster; he stands in front of it, red and sweating, while you cheer." },
  { name: 'end-sheet', cmds: [...SWAP, 'goto board pretend', 'pretend until 5:00', 'wait 3s'], intent: 'Win: Kev holds up the sheet with his own photo, red-faced; the boss points at him; you cheer.' },
  { name: 'end-fail', cmds: ['pretend until 5:00', 'wait 3s'], intent: "Loss: your photo tops the roster and the boss points at you; you hold a box of Saturday's work, more piled beside you, while Lin and Kev wave and leave." },
  { name: 'end-caught', cmds: ['goto roster pretend', 'interact', 'wait 4s'], intent: 'Loss: the boss caught you at the board, pen in hand; now your photo is on every row of the roster.' },
  { name: 'end-blamed', cmds: [...DING, 'interact', 'goto microwave pretend', 'pretend until 5:00', 'wait 3s'], intent: "Loss: you weren't at the board at 5:00. The change is crossed out and your photo ringed back in; the boss and Lin point at your empty chair." },
];
