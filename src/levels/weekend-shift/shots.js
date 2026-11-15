// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
// (COLD-READ.md: the pictures reader sees these without the intents.) One whiteboard decides who works Saturday;
// you change the face on it while every head is turned: at the microwave's DING, or while the boss is on the phone
// in the corner of his office and Lin is heating her fish. The copier is a trap: the boss's look at it crosses the
// board.
const DING = ['goto microwave pretend', 'interact', 'goto roster pretend', 'pretend until 4:13'];
const BOSS = [...DING, 'interact']; // the boss's face written in
const KEV = [...DING, 'interact', 'interact']; // written over again: Kev's
const READ = ['pretend until 4:58', 'wait 1.5s']; // the boss turns to the board and points the marker at the face
const REACT = ['pretend until 4:58', 'wait 2.9s']; // ... then whose it is
const RING = ['goto desk_phone pretend', 'interact']; // the phone in the supply room, out of the boss's sight: ring his

export default [
  // The office, and the things you can use.
  { name: 'start', cmds: [], intent: "4:00. You seated at your desk, bottom left; nothing lit. The boss in his glass office at the top, a folder on his desk and a phone on a little table in its top-right corner; another phone on a little table in the supply room, top left, behind a wall. Lin at her desk with a lunch box on it, Kev at his; a whiteboard on a stand mid-room with your face in a red box under Saturday, a copier below-left of it; a cup of noodles on the kitchen counter, east." },
  { name: 'board', cmds: ['goto roster pretend'], intent: "At the whiteboard (seven day boxes along the top, Saturday's red, a red line down to the box with your face, two markers in its tray): it lights up with the E key cap; you could write on it." },
  { name: 'microwave', cmds: ['goto microwave pretend'], intent: 'The microwave on the kitchen counter, east wall, dark and empty, a cup of instant noodles on the counter under it; lit up with the E key cap. You could heat your noodles.' },
  { name: 'copier', cmds: ['goto copier pretend'], intent: "The photocopier below-left of the board, working, its light green; lit up with the E key cap. You could jam it. The boss's cone, from his desk, reaches toward it across the board." },
  { name: 'phone', cmds: ['wait 1.5s', 'goto desk_phone pretend'], intent: "You went into the supply room, behind the wall, to the phone on its little table: it lights up with the E key cap. The boss can't see you here." },

  // The DING: be at the board when it goes off.
  { name: 'noodles-cooking', cmds: ['goto microwave pretend', 'interact', 'wait 2s'], intent: 'The cup of noodles is gone from the counter: it turns in the lit microwave, steaming; big green digits on its display count down.' },
  { name: 'too-early', cmds: ['goto microwave pretend', 'interact', 'goto roster pretend'], intent: "You at the board while the noodles cook: the boss's and Lin's sight cones cover you; writing now would be seen." },
  { name: 'ding', cmds: DING, intent: 'DING: a ripple from the microwave, and every head and sight cone snaps east toward it, away from the board where you stand.' },
  { name: 'written-boss', cmds: [...BOSS, 'wait 1.2s'], intent: "Written: the boss's face pops up big off the board's Saturday box for a beat, a soft white ring spreading off it, and settles into the box." },
  { name: 'written-kev', cmds: [...KEV, 'wait 1.2s'], intent: "Written over again: Kev's face pops up big off the Saturday box." },

  // The phone: the boss on the phone in his corner while Lin is at the microwave.
  { name: 'phone-ring', cmds: [...RING, 'wait 1s'], intent: "You lifted the supply room's phone: its handset is off, and a dotted line runs from it over to the phone in the boss's corner, shaking; the boss is startled at his desk." },
  { name: 'lin-watches', cmds: [...RING, 'goto board pretend'], intent: "The boss is in his corner on the phone, the dotted line still running from the supply room's phone to his, but Lin, at her desk, faces the board: her cone covers you there." },
  { name: 'lin-up', cmds: ['pretend until 4:30', 'wait 2s'], intent: "4:30: Lin has got up from her desk carrying her lunch box, on her way to the kitchen; her desk is empty behind her." },
  { name: 'lin-fish', cmds: ['pretend until 4:35'], intent: "4:35: Lin waits at the microwave, her back to the room and her cone pointing east, away from the board; her fish turning inside, the digits counting down; her desk is empty." },
  { name: 'phone-window', cmds: ['pretend until 4:28', ...RING, 'wait 4.5s'], intent: "The boss takes the call standing at the phone in his corner, facing the window, his back to the office: the handset at his ear on a coiled cord. The supply room's phone is still off its base, the dotted line still running: it's your call. Lin is at the microwave: no cone touches the board." },
  { name: 'written-phone', cmds: ['pretend until 4:31', ...RING, 'goto board pretend', 'interact', 'wait 1.2s'], intent: "With nobody looking, the boss's face pops up big off the board's Saturday box." },
  { name: 'writing-seen', cmds: ['pretend until 4:32', ...RING, 'goto board pretend', 'wait 1s', 'interact'], intent: "The boss is still on the phone in his corner, and you're halfway through writing: the boss's face half drawn over yours in the Saturday box, line by line from the top, the black marker at it (gone from the tray). But Lin, on her way back to her desk with her fish, has just seen you: her cone, gone red, is on you." },

  // The copier: a trap.
  { name: 'copier-jam', cmds: ['goto copier pretend', 'interact', 'wait 2s'], intent: 'The copier is jammed: a crumpled sheet sticking out of its top, a red light flashing, red arcs spreading off it; Kev, at his desk, turns to it with a ❗, a dashed line from him to the copier.' },
  { name: 'kev-fixing', cmds: ['goto copier pretend', 'interact', 'goto kev_desk pretend', 'pretend until 4:07'], intent: 'Kev kneels at the copier, its front open, a spanner in it and in his hand, its light amber; the crumpled sheet is gone, but it still beeps until he is done.' },
  { name: 'mirror-fail', cmds: ['goto copier pretend', 'interact', 'goto roster pretend'], intent: "The copier beeps: every cone turns toward it, and the boss's, from his desk, crosses the board on its way there; you at the board are in plain view." },

  // 5:00: the boss reads the board.
  { name: 'gather', cmds: ['pretend until 4:57', 'wait 0.5s'], intent: "4:57: the boss sits beside the board with his back to it, facing the room, the board's black marker in his hand (gone from its tray); Lin and Kev sit facing it, and each looks at the empty chair between them with a ❓: it's yours, and you're at your desk." },
  { name: 'reading-points', cmds: ['goto board pretend', ...READ], intent: 'Just before 5:00 the boss turns to the board and points the marker at it; the Saturday box glows yellow round your face.' },
  { name: 'reading-you', cmds: ['goto board pretend', ...REACT], intent: "Your face is on it: the boss keeps the marker on it, the box glowing, the bubble over him still pointing at your face." },
  { name: 'reading-boss', cmds: [...BOSS, ...REACT], intent: 'His own face is on it: the boss goes red at the board, hands spread, and Lin and Kev clap.' },
  { name: 'reading-kev', cmds: [...KEV, ...REACT], intent: "Kev's face is on it: the boss points at Kev, and Kev groans." },
  { name: 'away-at-five', cmds: [...BOSS, 'goto microwave pretend', 'pretend until 4:59', 'wait 1.4s'], intent: "Just before 5:00, and you're in the kitchen: the boss, by the board, goes red at his own face on it, Lin and Kev clapping; your chair between them is empty." },

  // The end cards: the office on Saturday, and who sits in it (blamed: Friday at 5:00, round the board).
  { name: 'end-win-boss', cmds: [...BOSS, 'pretend until 5:00', 'wait 3s'], intent: 'Win: Saturday, sun in the window, the office empty but for the boss at a desk, working; the board beside him shows his face. The row: a pencil, his face, your face, a beach: his Saturday, your weekend.' },
  { name: 'end-win-kev', cmds: [...KEV, 'pretend until 5:00', 'wait 3s'], intent: 'Win: Saturday, and Kev is the one at the desk, his face on the board.' },
  { name: 'end-fail', cmds: ['pretend until 5:00', 'wait 3s'], intent: 'Loss: Saturday, sun outside, and you at the desk with a pile of work; your face is on the board.' },
  { name: 'end-caught', cmds: ['goto roster pretend', 'interact', 'wait 4s'], intent: "Loss, caught: you at the desk on Saturday, and the boss beside the board, angry, pointing at you; on the board, the boss's face half drawn over yours, the marker still at it." },
  { name: 'end-blamed', cmds: [...BOSS, 'goto microwave pretend', 'pretend until 5:00', 'wait 3s'], intent: "Loss: Friday, 5:00, round the board. It shows the boss's face, but you weren't there: the boss points at your empty place, outlined red on the floor, and Lin and Kev turn to look at it." },
];
