// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player
// (the cold-read format: COLD-READ.md). The times come from the schedules in cast.js and the audit in index.js.
// The fail card has no shot: no play reaches it (the audit always ends in a pass or a catch before the sign-off).
const KEV = ['pretend until 3:24', 'goto kev_desk pretend', 'interact', 'put your_desk pretend', 'sit pretend'];
const LIN = ['goto hallway_west pretend', 'pretend until 3:36.1', 'interact', 'put your_desk pretend', 'sit pretend'];
const BOSS = ['goto boss_desk pretend', 'pretend until 3:35.1', 'interact', 'put your_desk pretend', 'sit pretend'];
const KEV_LUNCH = ['pretend until 3:12', 'goto kev_desk pretend', 'interact', 'put your_desk pretend', 'sit pretend'];
const LIN_EARLY = ['goto hallway_west pretend', 'pretend until 3:14', 'interact', 'put your_desk pretend', 'sit pretend'];
const END = ['pretend until 3:47', 'pretend until 3:47']; // to the end card (a catch stops the first: the second plays it out)

export default [
  // The afternoon, before anyone moves.
  { name: 'start', cmds: ['wait 3s'],
    intent: 'The start of the afternoon. The boss sits in his glass office; Lin, you and Kev sit at desks in the open office. The boss, Lin and Kev each have a laptop on their desk. Your desk has none.' },
  { name: 'kev-waves', cmds: ['pretend until 3:09.6'],
    intent: 'Kev waves goodbye and heads out for lunch. His laptop stays on his desk.' },
  { name: 'boss-smokes', cmds: ['pretend until 3:12'],
    intent: 'The boss is down in the lobby, smoking. His office is empty, his laptop on his desk. Lin, at her desk, looks into his office through the glass.' },
  { name: 'lin-restroom', cmds: ['pretend until 3:15'],
    intent: 'Lin walks off to the restroom. Her laptop stays on her desk.' },
  { name: 'kev-laptop', cmds: ['pretend until 3:12', 'goto kev_desk pretend'],
    intent: 'You stand at Kev\'s empty desk. His laptop is a thing you can take (the hand prompt).' },
  { name: 'put-down', cmds: ['pretend until 3:12', 'goto kev_desk pretend', 'interact', 'goto hallway_mid pretend'],
    intent: 'You stand at your own desk holding Kev\'s laptop. You can put it down on your desk.' },
  { name: 'kev-back-wave', cmds: ['pretend until 3:22.1'],
    intent: 'Back from lunch, Kev stops at the end of your desk and waves at you, then goes on to his own desk.' },
  { name: 'kev-takes-it-back', cmds: [...KEV_LUNCH, 'pretend until 3:22.2'],
    intent: 'His laptop was on your desk: Kev picks it up (laptop, !) on his way past and carries it back to his own desk.' },
  { name: 'lin-misses-it', cmds: [...LIN_EARLY, 'pretend until 3:24.1'],
    intent: 'Back from the restroom, Lin sits at her empty desk and wonders where her laptop went (laptop, ?). It is on your desk.' },
  { name: 'auditor-arrives', cmds: ['pretend until 3:29.5'],
    intent: 'A man in a grey suit with glasses and a badge has come up in the lift. He drinks a coffee by the hallway machine: the auditor, a few minutes early. Kev stands in the kitchen with a coffee of his own.' },

  // 3:30: the audit, desk by desk.
  { name: 'tick-boss', cmds: ['pretend until 3:32.9'],
    intent: 'The audit starts at the boss\'s desk. The auditor holds up his clipboard; a sign over the desk shows a laptop and a tick, and a green sticker with a tick appears on the front edge of the desk.' },
  { name: 'boss-leaves', cmds: ['pretend until 3:34.3'],
    intent: 'His desk ticked off (the green sticker stays on it), the boss walks out for another smoke and leaves his laptop behind. The auditor walks on to Lin\'s desk.' },
  { name: 'tick-lin', cmds: ['pretend until 3:36.2'],
    intent: 'Lin\'s desk gets its tick and its sticker while Lin is away at the coffee machine. Her laptop stays on her desk.' },
  { name: 'cross-you', cmds: ['pretend until 3:40.3'],
    intent: 'Third desk, yours: no laptop on it. The sign shows a laptop and a cross, the auditor bursts out angry and his view cone turns red on you: caught. Kev, out of the kitchen, is just walking back down the hallway.' },

  // The boss's laptop, counted on his desk and on yours.
  { name: 'boss-grab', cmds: ['goto boss_desk pretend', 'pretend until 3:35.1', 'interact'],
    intent: 'The boss is out smoking and Lin is at the coffee machine, so nobody watches the boss\'s office. You unplug his laptop, already ticked, as the auditor walks away to Lin\'s desk.' },
  { name: 'boss-recount', cmds: [...BOSS, 'pretend until 3:40.3'],
    intent: 'The boss\'s laptop now sits on your desk, and the auditor ticks your desk too. The boss\'s desk keeps its sticker with no laptop on it; yours gets one now.' },

  // Lin's laptop, counted on her desk and on yours.
  { name: 'lin-grab', cmds: ['goto hallway_west pretend', 'pretend until 3:36.1', 'interact'],
    intent: 'He has just ticked Lin\'s desk, and Lin is away getting coffee. You unplug her laptop behind his back.' },
  { name: 'lin-back', cmds: [...LIN, 'pretend until 3:39.75'],
    intent: 'Lin, back with her coffee, finds her desk empty (laptop, ?). Her laptop sits on your desk, which the auditor is about to check; coming down the hallway, he wonders (?) for a moment: he nearly saw you carry it.' },

  // Kev's laptop, counted on your desk and then on his.
  { name: 'kev-grab', cmds: ['pretend until 3:24', 'goto kev_desk pretend', 'interact'],
    intent: 'Kev is in the kitchen with a coffee. You unplug his laptop from his empty desk.' },
  { name: 'kev-tick-you', cmds: [...KEV, 'pretend until 3:40.3'],
    intent: 'Kev\'s laptop on your desk gets your desk its tick, and Kev is walking back toward your desk.' },
  { name: 'kev-fetch', cmds: [...KEV, 'pretend until 3:40.8'],
    intent: 'Right after the tick, Kev takes his laptop back from your desk (laptop, !) and carries it to his own desk, which the auditor has not checked yet.' },
  { name: 'kev-fourth', cmds: [...KEV, 'pretend until 3:42', 'wait until 3:43.6'],
    intent: 'Kev\'s desk gets the fourth tick and the fourth sticker, and the auditor is pleased (laptop, smile): he counted four. Your desk is empty again but keeps its sticker.' },
  { name: 'sign-off', cmds: [...KEV, 'pretend until 3:43', 'wait until 3:46.45'],
    intent: 'The audit done, the auditor comes back to your desk to sign it off and smiles at you, sitting there.' },

  // The end cards.
  { name: 'end-win-boss', cmds: [...BOSS, ...END],
    intent: 'Win: you sit smug behind your desk with a laptop on it; the auditor smiles over four ticks on his clipboard; the boss smokes in the lobby, none the wiser. Row: the boss, a cigarette, the laptop, two ticks.' },
  { name: 'end-win-lin', cmds: [...LIN, ...END],
    intent: 'Win: you sit smug with a laptop on your desk; the auditor smiles over four ticks; Lin strolls off with her coffee, humming. Row: Lin, a coffee, the laptop, two ticks.' },
  { name: 'end-win-kev', cmds: [...KEV, ...END],
    intent: 'Win: your desk is empty again and you are smug; the auditor smiles over four ticks; Kev carries his laptop back to his desk, humming. Row: the laptop, two ticks, Kev humming.' },
  { name: 'end-caught-your-desk', cmds: [...END],
    intent: 'Loss: your desk, empty, got the cross. The auditor points the way out and you carry your things in a box to the lift. Row: the auditor points at you; a box.' },
  { name: 'end-caught-lin-desk', cmds: [...LIN_EARLY, ...END],
    intent: 'Loss: you moved Lin\'s laptop too early. Her desk (teal chair, plant) got the cross, and you go to the lift with a box.' },
  { name: 'end-caught-seen', cmds: ['goto boss_desk pretend', 'wait until 3:33', 'interact', ...END],
    intent: 'Loss: the auditor saw you with a laptop in your hands. It lies on the floor, he points, and you go to the lift with a box.' },
  { name: 'end-blamed', cmds: [...BOSS.slice(0, 4), 'goto hallway_west pretend', ...END],
    intent: 'Loss: the audit passed, but your chair was empty when he came to sign it off. He glares at it and asks where you are (your face, ?), and you go to the lift with a box.' },
];
