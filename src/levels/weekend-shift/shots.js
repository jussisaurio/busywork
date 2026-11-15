// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
// (COLD-READ.md: the pictures reader sees these without the intents.) One whiteboard decides who works Saturday;
// you change the face on it while every head is turned: at the microwave's DING, or while the boss is on the phone
// at his window and Lin is heating her fish. The copier is a trap: it beeps from behind the board.
const DING = ['goto microwave pretend', 'interact', 'goto roster pretend', 'pretend until 4:13'];
const BOSS = [...DING, 'interact']; // the boss's face written in
const KEV = [...DING, 'interact', 'interact']; // written over again: Kev's
const READ = ['pretend until 4:58', 'wait 1.4s']; // the boss turns to the board and points at it
const REACT = ['pretend until 4:58', 'wait 2.9s']; // ... then at whoever's face is on it

export default [
  // The office, and the things you can use.
  { name: 'start', cmds: [], intent: "4:00. You at your desk, bottom left, a phone on it; the boss in his glass office at the top; Lin and Kev at their desks; a whiteboard on a stand mid-room with your face in a red box under Saturday." },
  { name: 'board', cmds: ['goto roster pretend'], intent: "At the whiteboard (seven day boxes along the top, Saturday's red, a red line down to the box with your face): a pencil prompt; you could write on it." },
  { name: 'microwave', cmds: ['goto microwave pretend'], intent: 'The microwave on the kitchen counter, east wall, dark and empty. You could heat noodles in it.' },
  { name: 'copier', cmds: ['goto copier pretend'], intent: 'The photocopier in the corner behind the board, working. You could jam it.' },
  { name: 'phone', cmds: ['wait 0.5s'], intent: "Your desk phone has a line to the boss's phone, on his desk: you could ring him." },

  // The DING: be at the board when it goes off.
  { name: 'noodles-cooking', cmds: ['goto microwave pretend', 'interact', 'wait 2s'], intent: 'Your noodles turn in the lit microwave; its display counts down.' },
  { name: 'too-early', cmds: ['goto microwave pretend', 'interact', 'goto roster pretend'], intent: "You at the board while the noodles cook: the boss's and Lin's sight cones cover you; writing now would be seen." },
  { name: 'ding', cmds: DING, intent: 'DING: a ripple from the microwave, and every head and sight cone snaps east toward it, away from the board where you stand.' },
  { name: 'written-boss', cmds: [...BOSS, 'wait 1.2s'], intent: "While they still look at the microwave, the board's Saturday box now shows the boss's face, freshly written; you whistle." },
  { name: 'written-kev', cmds: [...KEV, 'wait 1.2s'], intent: "Written over again: now the Saturday box shows Kev's face." },

  // The phone: the boss at his window while Lin is at the microwave.
  { name: 'phone-ring', cmds: ['pretend 0.5s', 'interact', 'wait 1s'], intent: "Your phone rings the boss's: a dashed line from your desk to his, his phone shaking, the boss startled." },
  { name: 'lin-watches', cmds: ['pretend 0.5s', 'interact', 'goto board pretend'], intent: "The boss is at his window on the phone, but Lin, at her desk, faces the board: her cone covers you there." },
  { name: 'lin-fish', cmds: ['pretend until 4:35'], intent: "4:35: Lin at the microwave with her back to the room, a fish turning inside; she's been there since 4:30." },
  { name: 'phone-window', cmds: ['pretend until 4:31', 'interact', 'wait 5s'], intent: 'The boss takes the call at his window, his back to the office, while Lin is at the microwave: no cone touches the board.' },
  { name: 'written-phone', cmds: ['pretend until 4:31', 'interact', 'goto board pretend', 'interact', 'wait 1.2s'], intent: "With nobody looking, the board's Saturday box now shows the boss's face." },

  // The copier: a trap.
  { name: 'copier-jam', cmds: ['goto copier pretend', 'interact', 'wait 2s'], intent: 'The copier is jammed: crumpled paper, a red light, red beeping ripples; heads turn to it and Kev gets up.' },
  { name: 'kev-fixing', cmds: ['goto copier pretend', 'interact', 'goto kev_desk pretend', 'pretend until 4:09'], intent: 'Kev kneels at the copier with a spanner, fixing it.' },
  { name: 'mirror-fail', cmds: ['goto copier pretend', 'interact', 'goto roster pretend'], intent: 'The copier beeps from behind the board: every cone turns toward it, so the board, and you at it, are in plain view.' },

  // 5:00: the boss reads the board.
  { name: 'gather', cmds: ['pretend until 4:56'], intent: '4:55: the boss stands beside the board; Lin and Kev gather facing it; one spot, in front of it, waits for you.' },
  { name: 'reading-points', cmds: ['goto board pretend', ...READ], intent: 'Just before 5:00 the boss turns to the board and announces it; its Saturday box glows red round your face.' },
  { name: 'reading-you', cmds: ['goto board pretend', ...REACT], intent: 'Your face was on it: the boss turns from the board and points at you.' },
  { name: 'reading-boss', cmds: [...BOSS, ...REACT], intent: 'His own face was on it: the boss turns to the room red-faced, embarrassed, shrugging.' },
  { name: 'reading-kev', cmds: [...KEV, ...REACT], intent: "Kev's face was on it: the boss points at Kev, and Kev groans." },
  { name: 'away-at-five', cmds: [...BOSS, 'goto microwave pretend', 'pretend until 5:00'], intent: "You changed the board but aren't in front of it at 5:00: everyone stares at your empty spot." },

  // The end cards: the office on Saturday, and who sits in it.
  { name: 'end-win-boss', cmds: [...BOSS, 'pretend until 5:00', 'wait 3s'], intent: 'Win: Saturday, sun in the window, the office empty but for the boss at a desk, working; the board beside him shows his face.' },
  { name: 'end-win-kev', cmds: [...KEV, 'pretend until 5:00', 'wait 3s'], intent: 'Win: Saturday, and Kev is the one at the desk, his face on the board.' },
  { name: 'end-fail', cmds: ['pretend until 5:00', 'wait 3s'], intent: 'Loss: Saturday, sun outside, and you at the desk with a pile of work; your face is on the board.' },
  { name: 'end-caught', cmds: ['goto roster pretend', 'interact', 'wait 4s'], intent: 'Loss, caught: you at the desk on Saturday, and the boss beside the board, angry, pointing at you.' },
  { name: 'end-blamed', cmds: [...BOSS, 'goto microwave pretend', 'pretend until 5:00', 'wait 3s'], intent: "Loss: you weren't there at 5:00; the board shows the boss's face crossed out and yours back, and you work Saturday." },
];
