// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
// (COLD-READ.md: the pictures reader sees these without the intents.) One whiteboard decides who works Saturday;
// you change the face on it while every head is turned: at the microwave's DING, or while the boss is on the phone
// in the corner of his office and Lin is heating her fish. The copier is a trap: it beeps from behind the board.
const DING = ['goto microwave pretend', 'interact', 'goto roster pretend', 'pretend until 4:13'];
const BOSS = [...DING, 'interact']; // the boss's face written in
const KEV = [...DING, 'interact', 'interact']; // written over again: Kev's
const READ = ['pretend until 4:58', 'wait 1.4s']; // the boss turns to the board and points at it
const REACT = ['pretend until 4:58', 'wait 2.9s']; // ... then at whoever's face is on it
const RING = ['goto desk_phone pretend', 'interact']; // stand up, step to the phone at the far end of your desk, ring

export default [
  // The office, and the things you can use.
  { name: 'start', cmds: [], intent: "4:00. You seated at your desk, bottom left, a phone at its far end; nothing lit. The boss in his glass office at the top, a phone on a little table in its top-right corner; Lin at her desk with a lunch box on it, Kev at his; a whiteboard on a stand mid-room with your face in a red box under Saturday." },
  { name: 'board', cmds: ['goto roster pretend'], intent: "At the whiteboard (seven day boxes along the top, Saturday's red, a red line down to the box with your face): it lights up with the E key cap; you could write on it." },
  { name: 'microwave', cmds: ['goto microwave pretend'], intent: 'The microwave on the kitchen counter, east wall, dark and empty, lit up with the E key cap. You could heat noodles in it.' },
  { name: 'copier', cmds: ['goto copier pretend'], intent: 'The photocopier in the corner behind the board, working, its light green; lit up with the E key cap. You could jam it.' },
  { name: 'phone', cmds: ['goto desk_phone pretend'], intent: "You stood up and stepped to the phone at the far end of your desk: it lights up with the E key cap. You could ring the boss's phone, on the little table in the corner of his office." },

  // The DING: be at the board when it goes off.
  { name: 'noodles-cooking', cmds: ['goto microwave pretend', 'interact', 'wait 2s'], intent: 'Your noodles turn in the lit microwave; big green digits on its display count down.' },
  { name: 'too-early', cmds: ['goto microwave pretend', 'interact', 'goto roster pretend'], intent: "You at the board while the noodles cook: the boss's and Lin's sight cones cover you; writing now would be seen." },
  { name: 'ding', cmds: DING, intent: 'DING: a ripple from the microwave, and every head and sight cone snaps east toward it, away from the board where you stand.' },
  { name: 'written-boss', cmds: [...BOSS, 'wait 1.2s'], intent: "While they still look at the microwave, the boss's face pops up big off the board's Saturday box for a beat: freshly written. You whistle." },
  { name: 'written-kev', cmds: [...KEV, 'wait 1.2s'], intent: "Written over again: Kev's face pops up big off the Saturday box." },

  // The phone: the boss on the phone in his corner while Lin is at the microwave.
  { name: 'phone-ring', cmds: [...RING, 'wait 1s'], intent: "Your phone rings the boss's: a dotted line from the phone at the end of your desk to the phone in his corner, shaking, the boss startled at his desk." },
  { name: 'lin-watches', cmds: [...RING, 'goto board pretend'], intent: "The boss is in his corner on the phone, but Lin, at her desk, faces the board: her cone covers you there." },
  { name: 'lin-up', cmds: ['pretend until 4:30', 'wait 2s'], intent: "4:30: Lin has got up from her desk carrying her lunch box, on her way to the kitchen; her desk is empty behind her." },
  { name: 'lin-fish', cmds: ['pretend until 4:35'], intent: "4:35: Lin at the microwave with her back to the room, her fish turning inside, the digits counting down; her desk is empty." },
  { name: 'phone-window', cmds: ['pretend until 4:31', ...RING, 'wait 6s'], intent: 'The boss takes the call standing at the phone in his corner, facing the window, his back to the office: the handset is off the base, at his ear on a coiled cord. Lin is at the microwave: no cone touches the board.' },
  { name: 'written-phone', cmds: ['pretend until 4:31', ...RING, 'goto board pretend', 'interact', 'wait 1.2s'], intent: "With nobody looking, the boss's face pops up big off the board's Saturday box." },

  // The copier: a trap.
  { name: 'copier-jam', cmds: ['goto copier pretend', 'interact', 'wait 2s'], intent: 'The copier is jammed: a crumpled sheet sticking out of its top, a red light flashing, red beeps coming off it; heads turn to it and Kev, at his desk, shows a small ❗.' },
  { name: 'kev-fixing', cmds: ['goto copier pretend', 'interact', 'goto kev_desk pretend', 'pretend until 4:09'], intent: 'Kev kneels at the copier, its front open and its light amber, cranking a spanner.' },
  { name: 'mirror-fail', cmds: ['goto copier pretend', 'interact', 'goto roster pretend'], intent: 'The copier beeps from behind the board: every cone turns toward it, so the board, and you at it, are in plain view.' },

  // 5:00: the boss reads the board.
  { name: 'gather', cmds: ['pretend until 4:56'], intent: '4:55: the boss stands beside the board; Lin and Kev gather facing it; your place between them is a dashed outline on the floor, waiting for you.' },
  { name: 'reading-points', cmds: ['goto board pretend', ...READ], intent: 'Just before 5:00 the boss turns to the board and announces it; its Saturday box glows red round your face.' },
  { name: 'reading-you', cmds: ['goto board pretend', ...REACT], intent: 'Your face was on it: the boss turns from the board and points at you.' },
  { name: 'reading-boss', cmds: [...BOSS, ...REACT], intent: 'His own face was on it: the boss goes red at the board, embarrassed.' },
  { name: 'reading-kev', cmds: [...KEV, ...REACT], intent: "Kev's face was on it: the boss points at Kev, and Kev groans." },
  { name: 'away-at-five', cmds: [...BOSS, 'goto microwave pretend', 'pretend until 4:59', 'wait 1.4s'], intent: "Just before 5:00, and you're in the kitchen: the boss, by the board, goes red at his own face on it; your chair between Lin and Kev is empty, a red dashed outline on it." },

  // The end cards: the office on Saturday, and who sits in it (blamed: Friday at 5:00, round the board).
  { name: 'end-win-boss', cmds: [...BOSS, 'pretend until 5:00', 'wait 3s'], intent: 'Win: Saturday, sun in the window, the office empty but for the boss at a desk, working; the board beside him shows his face.' },
  { name: 'end-win-kev', cmds: [...KEV, 'pretend until 5:00', 'wait 3s'], intent: 'Win: Saturday, and Kev is the one at the desk, his face on the board.' },
  { name: 'end-fail', cmds: ['pretend until 5:00', 'wait 3s'], intent: 'Loss: Saturday, sun outside, and you at the desk with a pile of work; your face is on the board.' },
  { name: 'end-caught', cmds: ['goto roster pretend', 'interact', 'wait 4s'], intent: 'Loss, caught: you at the desk on Saturday, and the boss beside the board, angry, pointing at you.' },
  { name: 'end-blamed', cmds: [...BOSS, 'goto microwave pretend', 'pretend until 5:00', 'wait 3s'], intent: "Loss: Friday, 5:00, round the board. It shows the boss's face, but you weren't there: the boss points at your empty place, outlined red on the floor, and Lin and Kev turn to look at it." },
];
