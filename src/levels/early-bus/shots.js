// The Last Bus's cold-read shots (see the cold-read framework): harness commands from the start of the day, and what
// each picture must tell a first-time player who has read only the card.
const CLOCK = ['pretend until 3:22', 'wait 1.3s', 'goto boss_clock pretend', 'interact', 'interact', 'interact']; // +30, Lin away, out before 3:35
const HERD = ['goto open_clock pretend', 'interact', 'interact', 'interact', 'interact', 'interact', 'interact']; // +60, Kev at the coffee
const SIT = ['goto my_seat pretend', 'goto my_seat pretend', 'sit'];
const TELL = ['goto boss_clock pretend', ...Array(25).fill('interact'), ...SIT]; // Lin's shouts cancel the first tries
const TO_STOP = ['goto bus_stop pretend'];

export default [
  {
    name: 'start',
    cmds: ['wait 1.5s'],
    intent: "3:00: you at your desk; the boss's glass office, empty (he is out), where a caretaker stands up a stepladder at the wall clock, swapping its battery; a second clock and stepladder over Kev's desk; the boss's coat on a rack in the hallway; the kitchen with a coffee pot; the lobby and, outside, a bus stop by the road.",
  },
  {
    name: 'kev-checks-the-clock',
    cmds: ['pretend until 3:01', 'wait 0.4s'],
    intent: 'Kev looks up at the open-plan clock right over his desk and thinks of the time (a clock face, beside him so the clock stays in view): people here go by the wall clock. The caretaker walks off, leaving the stepladder under the boss\'s clock.',
  },
  {
    name: 'kev-pours-a-coffee',
    cmds: ['pretend until 3:05', 'wait 0.5s'],
    intent: 'Kev is in the kitchen pouring himself a coffee from the pot; his desk under the open-plan clock is empty.',
  },
  {
    name: 'open-clock-close',
    cmds: ['goto open_clock pretend'],
    intent: "The open-plan clock up close: a real wall clock with a stepladder under it that you can climb; Kev has just got up from his desk below it and walks off towards the kitchen.",
  },
  {
    name: 'open-clock-pushed',
    cmds: [...HERD],
    intent: 'After six pushes the open-plan clock hangs crooked, red over the hour it gained, and reads an hour later than the HUD clock.',
  },
  {
    name: 'kev-jumps',
    cmds: [...HERD, ...SIT, 'pretend until 3:10', 'wait 2s'],
    intent: 'Back at his desk with his coffee, Kev looks up at the pushed clock and is surprised (a clock face and 😮 in a thought, beside him, the clock still in view): he believes it is an hour later. No alarm, no red.',
  },
  {
    name: 'lin-checks-the-open-clock',
    cmds: ['pretend until 3:12', 'wait 0.5s'],
    intent: "Lin, at her desk a few steps from the open-plan clock, looks up at it and thinks of the time (a clock face).",
  },
  {
    name: 'kev-sees-the-coat',
    cmds: ['pretend until 3:13', 'wait 0.5s'],
    intent: "Kev has stood up with his laptop under his arm, as if to go; he looks at the boss's coat on the hallway rack and grimaces (coat, 😬): the boss is still in, so he can't leave. He sits back down.",
  },
  {
    name: 'boss-back-from-lunch',
    cmds: ['pretend until 3:22', 'wait 0.6s'],
    intent: 'The boss is back: he sits with his back to his clock and turns round to read it (a clock face beside him, the clock still in view).',
  },
  {
    name: 'boss-glances-at-your-desk',
    cmds: ['pretend until 3:22', 'wait 1.7s'],
    intent: 'Straight after his clock the boss turns to look out through the glass at your desk, where you sit typing: you, ✔️ (all is well).',
  },
  {
    name: 'lin-goes-to-the-restroom',
    cmds: ['pretend until 3:21', 'wait 0.6s'],
    intent: "Lin has left her desk and walks off to the restroom (🚻), so nobody faces the boss's clock now.",
  },
  {
    name: 'boss-hunts',
    cmds: ['pretend until 3:23', ...TO_STOP, 'pretend until 3:35', 'wait 2.4s'],
    intent: 'You slipped out to the bus stop. The boss has looked at your empty chair and wonders where you are (your face, ?): he comes out of his office looking for you.',
  },
  {
    name: 'lin-tells',
    cmds: ['goto boss_clock pretend', 'interact'],
    intent: "You step onto the stepladder behind the boss's desk while Lin watches through the glass: she points at you and shouts. The boss is still out at lunch.",
  },
  {
    name: 'lin-tells-the-boss',
    cmds: [...TELL, 'pretend until 3:18', 'wait 1.2s'],
    intent: "The boss has just walked in from lunch; Lin points you out to him (you, and the clock), and he gives you work (paper for your screen).",
  },
  {
    name: 'boss-clock-close',
    cmds: ['pretend until 3:23', 'goto boss_clock pretend'],
    intent: "The boss's clock up close: a real wall clock with a stepladder under it, right behind the boss's chair; Lin's desk is empty.",
  },
  {
    name: 'boss-clock-pushed',
    cmds: [...CLOCK],
    intent: "The boss's clock hangs crooked, red over the half hour it gained, and reads half an hour later than the HUD clock; the boss works on with his back to it.",
  },
  {
    name: 'boss-jumps',
    cmds: [...CLOCK, ...SIT, 'pretend until 3:35', 'wait 0.4s'],
    intent: 'At 3:35 the boss turns to his pushed clock and is surprised (a clock face and 😮 in a thought, beside him, the clock still in view): he believes it is half an hour later. You are back at your desk. No alarm, no red.',
  },
  {
    name: 'boss-suspects',
    cmds: ['pretend until 3:24', 'goto boss_clock pretend', 'interact', 'interact', 'interact', 'pretend until 3:35', 'wait 1.5s', 'wait 1s'],
    intent: "You stayed in the boss's office, by the stepladder, until he turned to his clock: it just jumped, and you are right there. He looks from it to you, suspicious (you, 🤨).",
  },
  {
    name: 'boss-sets-it-right',
    cmds: ['pretend until 3:24', 'goto boss_clock pretend', 'interact', 'interact', 'interact', 'pretend until 3:35', 'wait 1.5s', 'wait 1s', 'move E 1.5s pretend'],
    intent: "Having looked from his jumped clock to you, the boss stands at his clock and sets it right, angry (a clock face and 😠); it hangs straight again. You edge away along his office, on the phone.",
  },
  {
    name: 'boss-reads-the-open-clock-going-out',
    cmds: ['pretend until 3:43', 'wait 1.2s', 'wait 1s'],
    intent: "On his way to the kitchen, the boss walks under the open-plan clock, looks up at it (a clock face) and shrugs (⏳): not home time yet.",
  },
  {
    name: 'boss-pours-a-coffee',
    cmds: ['pretend until 3:47', 'wait 0.5s'],
    intent: 'The boss is on his break: in the kitchen, pouring himself a coffee from the pot.',
  },
  {
    name: 'boss-takes-his-coat',
    cmds: [...CLOCK, ...SIT, 'pretend until 4:22', 'wait 0.3s'],
    intent: "At 4:22 by the HUD the boss has taken his coat from the hallway rack and waves: he is going home, half an hour early; the rack is empty. His office clock behind him is crooked.",
  },
  {
    name: 'bus-arrives',
    cmds: [...CLOCK, ...SIT, 'pretend until 4:23', ...TO_STOP, 'pretend until 4:28'],
    intent: 'The boss has gone home; the bus has pulled up at the stop with its doors open, and you are waiting beside it.',
  },
  {
    name: 'end-clock',
    cmds: [...CLOCK, ...SIT, 'pretend until 4:23', ...TO_STOP, 'pretend until 4:30'],
    intent: 'Win: the boss goes home with his backpack under his crooked clock, waving, while you cheer in the door of the bus.',
  },
  {
    name: 'lin-checks-the-coat',
    cmds: [...HERD, ...SIT, 'pretend until 3:50', 'wait 0.5s'],
    intent: "By the pushed clock it is home time: Lin and Kev stand at their desks and look at the boss's coat on the hallway rack with a grimace (coat, 😬). He is in the kitchen, his coat is still there, so they stay.",
  },
  {
    name: 'boss-reads-the-open-clock',
    cmds: [...HERD, ...SIT, 'pretend until 3:58', 'wait 1.9s'],
    intent: 'Walking back from the kitchen with his coffee, the boss passes under the crooked open-plan clock and is surprised (a clock face and 😮 in a thought, beside him, the clock still in view): home time.',
  },
  {
    name: 'boss-takes-his-coat-early',
    cmds: [...HERD, ...SIT, 'pretend until 4:01', 'wait 0.7s'],
    intent: 'The boss has taken his coat off the hallway rack and put it on, and waves: going home. The rack is empty.',
  },
  {
    name: 'lin-and-kev-follow',
    cmds: [...HERD, ...SIT, 'pretend until 4:09'],
    intent: 'The boss has gone out through the lobby; Lin and Kev are up and follow him out with their bags.',
  },
  {
    name: 'end-herd',
    cmds: [...HERD, ...SIT, 'pretend until 4:09', ...TO_STOP, 'pretend until 4:30'],
    intent: 'Win: the boss, his coffee mug in hand, heads home in his coat under the crooked open-plan clock (surprised), Lin and Kev following him with their backpacks, past the empty coat rack; you cheer in the bus door. Icons: boss, coffee, the clock, 😮.',
  },
  {
    name: 'end-caught',
    cmds: ['pretend until 3:29', 'goto boss_clock pretend', 'interact', 'interact', 'interact', 'wait 1s', 'wait 1s', 'wait 1s'],
    intent: 'Caught: you are up the stepladder at his crooked clock, and the boss below points up at you, angry.',
  },
  {
    name: 'end-caught-in-the-street',
    cmds: [...TO_STOP, 'pretend until 3:20', 'pretend until 3:20'],
    intent: "Caught early, in daylight: you at the bus stop, no bus anywhere; the boss, in his shirtsleeves, stands in the lobby door and points at you, angry. Through the window his coat still hangs on the rack, glowing. Icons: coat, you, boss.",
  },
  {
    name: 'end-blamed',
    cmds: [...HERD, ...SIT, 'pretend until 4:30', 'pretend until 4:30'],
    intent: 'Lost: the boss did go home early (the coat rack is empty, waving in the icons), but you are still at your desk in the empty office; out of the window the bus pulls away.',
  },
  {
    name: 'end-fail',
    cmds: ['pretend until 4:30', 'pretend until 4:30'],
    intent: "Lost: 4:30 on the boss's clock; he is still at his desk in his shirtsleeves, his coat on its rack, so you stay; out of the window your bus drives off.",
  },
  {
    name: 'end-fail-at-the-stop',
    cmds: ['pretend until 4:24', ...TO_STOP, 'pretend until 4:30'],
    intent: "Lost: you went out to the stop while his coat was still on the rack; now you are back at your desk and the boss stands over you, pointing, angry; his coat still glows on the rack behind him and out of the window the bus pulls away. Icons: coat, you, boss.",
  },
];
