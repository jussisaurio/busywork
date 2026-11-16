// The Last Bus's cold-read shots (see the cold-read framework): harness commands from the start of the day, and what
// each picture must tell a first-time player who has read only the card.
const SIT = ['goto my_seat pretend', 'goto my_seat pretend', 'sit'];
const O30 = ['goto open_clock pretend', 'interact', 'interact', 'interact']; // +30, Kev at the coffee
const Q30 = ['pretend until 3:22', 'wait 1.3s', 'goto boss_clock pretend', 'interact', 'interact', 'interact']; // +30, Lin away, the boss at lunch
const CLOCK = [...O30, ...SIT, ...Q30, ...SIT]; // both clocks +30: they agree
const HERD = ['goto open_clock pretend', 'interact', 'interact', 'interact', 'interact', 'interact', 'interact']; // +60, Kev at the coffee
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
    name: 'kev-doubts',
    cmds: [...HERD, ...SIT, 'pretend until 3:10', 'wait 2s'],
    intent: 'Back at his desk with his coffee, Kev looks up at the pushed clock and frowns (a clock face and 🤨 in a thought, beside him, the clock still in view): he has just seen it say 3:01, so he does not believe it. No alarm, no red.',
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
    name: 'lin-goes-to-the-restroom',
    cmds: ['pretend until 3:21', 'wait 0.6s'],
    intent: "Lin has left her desk and walks off to the restroom (🚻), so nobody faces the boss's clock now.",
  },
  {
    name: 'boss-hunts',
    cmds: ['pretend until 4:00', ...TO_STOP, 'pretend until 4:10', 'wait 2.4s'],
    intent: 'You slipped out to the bus stop. The boss has looked at your empty chair and wonders where you are (your face, ?); he rings you (phone, your face, ?) and your phone buzzes at the stop. He comes out of his office looking for you.',
  },
  {
    name: 'lin-tells',
    cmds: ['goto boss_clock pretend', 'interact'],
    intent: "You step onto the stepladder behind the boss's desk while Lin watches through the glass: she points at you and shouts. The boss is still out at lunch.",
  },
  {
    name: 'lin-tells-the-boss',
    cmds: [...TELL, 'pretend until 3:43', 'wait 1.2s'],
    intent: "The boss is back from lunch; Lin points you out to him (you, and the clock), and he gives you work (paper for your screen).",
  },
  {
    name: 'boss-clock-close',
    cmds: ['pretend until 3:23', 'goto boss_clock pretend'],
    intent: "The boss's clock up close: a real wall clock with a stepladder under it, right behind the boss's chair; Lin's desk is empty.",
  },
  {
    name: 'boss-clock-pushed',
    cmds: [...Q30],
    intent: "The boss's clock hangs crooked, red over the half hour it gained, and reads half an hour later than the HUD clock; his office is empty (he is out at lunch) and Lin's desk is empty too.",
  },
  {
    name: 'boss-back-from-lunch',
    cmds: ['pretend until 3:41', 'wait 0.5s'],
    intent: 'The boss walks in from the street through the lobby, frowning at his phone: it is flat (a phone and an empty battery). The wall clocks are all he has.',
  },
  {
    name: 'boss-pours-a-coffee',
    cmds: ['pretend until 3:48', 'wait 1.6s'],
    intent: 'Back from lunch, the boss fetches a coffee: in the kitchen, pouring himself a cup from the pot.',
  },
  {
    name: 'boss-reads-the-open-clock',
    cmds: ['pretend until 3:53', 'wait 1.8s'],
    intent: "Walking back from the kitchen with his coffee, the boss passes under the open-plan clock and looks up at it (a clock face, beside him, the clock still in view): the first clock he has seen since lunch.",
  },
  {
    name: 'boss-checks-his-clock',
    cmds: ['pretend until 3:57', 'wait 0.8s'],
    intent: 'At his desk he turns round to his own clock (a clock face beside him, the clock still in view): it agrees.',
  },
  {
    name: 'boss-glances-at-your-desk',
    cmds: ['pretend until 3:57', 'wait 1.9s'],
    intent: 'Straight after his clock the boss turns to look out through the glass at your desk, where you sit typing: you, ✔️ (all is well).',
  },
  {
    name: 'boss-frowns-at-his-clock',
    cmds: [...Q30, ...SIT, 'pretend until 3:57', 'wait 0.8s'],
    intent: "You pushed only his clock. He has just read the true time under the open-plan clock; now his own clock says half an hour later. He frowns at it (a clock face and 🤨).",
  },
  {
    name: 'boss-sets-it-right',
    cmds: [...Q30, ...SIT, 'pretend until 3:58', 'wait 1.3s'],
    intent: 'The boss stands at his clock and sets it right, angry (a clock face and 😠); it hangs straight again.',
  },
  {
    name: 'boss-suspects',
    cmds: [...Q30, 'pretend until 3:57', 'wait 1.5s', 'wait 1s', 'wait 0.5s'],
    intent: "You stayed in the boss's office, by the stepladder, until he turned to his clock: it has moved, and you are right there. He looks from it to you, suspicious (you, 🤨).",
  },
  {
    name: 'boss-reads-both',
    cmds: [...CLOCK, 'pretend until 3:53', 'wait 1.8s'],
    intent: 'Both clocks pushed half an hour. Under the crooked open-plan clock the boss looks up, surprised (a clock face and 😮): later than he thought. Lunch ran long.',
  },
  {
    name: 'boss-takes-his-coat',
    cmds: [...CLOCK, 'pretend until 4:21', 'wait 1.6s'],
    intent: "At 4:22 by the HUD the boss has taken his coat from the hallway rack and waves: he is going home, half an hour early; the rack is empty. Both clocks are crooked.",
  },
  {
    name: 'bus-arrives',
    cmds: [...CLOCK, 'pretend until 4:25', ...TO_STOP, 'pretend until 4:29'],
    intent: 'The boss has gone home; the bus has pulled up at the stop with its doors open, and you are waiting beside it.',
  },
  {
    name: 'end-clock',
    cmds: [...CLOCK, 'pretend until 4:25', ...TO_STOP, 'pretend until 4:30'],
    intent: 'Win: the boss goes home with his backpack under his crooked clock, waving, Lin and Kev hurrying after him with theirs, while you cheer in the door of the bus.',
  },
  {
    name: 'boss-reads-home-time',
    cmds: [...HERD, ...SIT, 'pretend until 3:53', 'wait 1.8s'],
    intent: 'Walking back from the kitchen with his coffee, the boss passes under the crooked open-plan clock and is surprised (a clock face and 😮 in a thought, beside him, the clock still in view): home time.',
  },
  {
    name: 'boss-takes-his-coat-early',
    cmds: [...HERD, ...SIT, 'pretend until 3:55', 'wait 1.8s'],
    intent: 'Straight from the hallway the boss has taken his coat off the rack and put it on, and waves: going home. The rack is empty. He never went back into his office.',
  },
  {
    name: 'lin-and-kev-shrug',
    cmds: [...HERD, ...SIT, 'pretend until 3:55', 'wait 3.4s', 'wait 1.3s'],
    intent: "The boss has his coat on and is walking off down the hallway. At their desks Lin and Kev, who frowned at the clock, look at each other and shrug (🤷 each): his coat has gone, so it is home time.",
  },
  {
    name: 'lin-and-kev-follow',
    cmds: [...HERD, ...SIT, 'pretend until 3:59', 'wait 1s'],
    intent: 'The boss is out through the lobby; Lin and Kev are up with their bags, waving, hurrying out after him.',
  },
  {
    name: 'end-herd',
    cmds: [...HERD, ...SIT, 'pretend until 4:05', ...TO_STOP, 'pretend until 4:30'],
    intent: 'Win: the boss, his coffee mug in hand, heads home in his coat under the crooked open-plan clock (surprised), past the empty coat rack, Lin and Kev on his heels with their backpacks (a shrug between them); you cheer in the bus door. Icons: boss, coffee, the clock, 😮, Lin, Kev, 🤷.',
  },
  {
    name: 'end-caught',
    cmds: ['pretend until 3:52', 'goto boss_clock pretend', ...Array(8).fill('interact'), 'wait 1s', 'wait 1s', 'wait 1s'],
    intent: 'Caught: you are up the stepladder at his crooked clock as he walks in with his coffee; the boss below points up at you, angry.',
  },
  {
    name: 'end-caught-in-the-street',
    cmds: [...TO_STOP, 'pretend until 3:45', 'pretend until 3:45'],
    intent: "Caught early, in daylight: you at the bus stop, no bus anywhere; the boss, in his shirtsleeves, stands in the lobby door and points at you, angry. Through the window his coat still hangs on the rack, glowing. Icons: coat, you, boss.",
  },
  {
    name: 'end-blamed',
    cmds: [...HERD, ...SIT, 'pretend until 4:30', 'pretend until 4:30'],
    intent: 'Lost: the boss did go home early (the coat rack is empty), but you are still at your desk in the empty office; out of the window your bus pulls away with the boss in it, waving from the window, Lin and Kev beside him.',
  },
  {
    name: 'end-fail',
    cmds: ['pretend until 4:30', 'pretend until 4:30'],
    intent: "Lost: 4:30 on the boss's clock; he is still at his desk in his shirtsleeves, his coat on its rack, so you stay; out of the window your bus drives off.",
  },
  {
    name: 'boss-rings-you',
    cmds: ['pretend until 4:24', 'goto door_in pretend', 'move S 1s pretend', 'wait 0.3s'],
    intent: "You slipped out at 4:24, past the boss's look at your chair. He is out of his office looking for you and rings you (phone, your face, ?); in the lobby your phone buzzes.",
  },
  {
    name: 'end-fail-at-the-stop',
    cmds: ['pretend until 4:24', ...TO_STOP, 'pretend until 4:30'],
    intent: "Lost: you went out to the stop while his coat was still on the rack, and he rang you; now you are back at your desk and the boss stands over you, pointing, angry; his coat still glows on the rack behind him and out of the window the bus pulls away. Icons: coat, phone, you, boss.",
  },
];
