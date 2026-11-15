// Early Bus's cold-read shots (see the cold-read framework): harness commands from the start of the day, and what
// each picture must tell a first-time player who has read only the card.
const CLOCK = ['pretend until 3:23', 'goto boss_clock pretend', 'interact', 'interact', 'interact']; // +30, Lin away
const HERD = ['goto open_clock pretend', 'interact', 'interact', 'interact', 'interact', 'interact', 'interact']; // +60, Kev at the coffee
const SIT = ['goto my_seat pretend', 'sit'];
const TO_STOP = ['goto bus_stop pretend'];

export default [
  {
    name: 'start',
    cmds: ['wait 1.5s'],
    intent: "3:00: you at your desk; the boss's glass office, empty (he is out), with a wall clock and a stepladder under it and a coat hanging on a stand in its corner; a second clock and stepladder over Kev's desk; the kitchen with a coffee pot; the lobby and, outside, a bus stop by the road.",
  },
  {
    name: 'kev-checks-the-clock',
    cmds: ['pretend until 3:01', 'wait 0.4s'],
    intent: 'Kev looks up at the open-plan clock right over his desk and thinks of the time (a clock face, beside him so the clock stays in view): people here go by the wall clock.',
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
    intent: 'After six pushes the open-plan clock hangs crooked and reads an hour later than the HUD clock.',
  },
  {
    name: 'kev-jumps',
    cmds: [...HERD, ...SIT, 'pretend until 3:10', 'wait 2s'],
    intent: 'Back at his desk with his coffee, Kev looks up at the pushed clock and starts (a clock face and !, beside him, the clock still in view): he believes it is an hour later.',
  },
  {
    name: 'lin-checks-the-open-clock',
    cmds: ['pretend until 3:12', 'wait 0.5s'],
    intent: "Lin, at her desk a few steps from the open-plan clock, looks up at it and thinks of the time (a clock face).",
  },
  {
    name: 'boss-back-from-lunch',
    cmds: ['pretend until 3:22', 'wait 0.6s'],
    intent: 'The boss is back: he sits with his back to his clock and turns round to read it (a clock face beside him, the clock still in view).',
  },
  {
    name: 'boss-glances-at-your-desk',
    cmds: ['pretend until 3:22', 'wait 1.7s'],
    intent: 'Straight after his clock the boss turns to look out through the glass at your desk, where you sit typing.',
  },
  {
    name: 'lin-goes-to-the-restroom',
    cmds: ['pretend until 3:23'],
    intent: "Lin has left her desk and walks off to the restroom, so nobody faces the boss's clock now.",
  },
  {
    name: 'boss-misses-lin',
    cmds: ['pretend until 3:25', 'wait 0.8s'],
    intent: "Lin is out of sight in the restroom; the boss turns to her empty desk and wonders where she is (her face, ?).",
  },
  {
    name: 'boss-hunts',
    cmds: ['pretend until 3:23', ...TO_STOP, 'pretend until 3:31', 'wait 0.6s'],
    intent: 'You slipped out to the bus stop. The boss has seen your empty chair and wonders where you are (your face, ?): angry, he comes out of his office looking for you.',
  },
  {
    name: 'lin-tells',
    cmds: ['goto boss_clock pretend', 'interact'],
    intent: 'You step onto the stepladder behind the boss\'s desk while Lin watches through the glass: she points at you and shouts.',
  },
  {
    name: 'boss-clock-close',
    cmds: ['pretend until 3:23', 'goto boss_clock pretend'],
    intent: "The boss's clock up close: a real wall clock with a stepladder under it, right behind the boss's chair; Lin's desk is empty.",
  },
  {
    name: 'boss-clock-pushed',
    cmds: [...CLOCK],
    intent: "The boss's clock hangs crooked and reads half an hour later than the HUD clock; the boss works on with his back to it.",
  },
  {
    name: 'boss-jumps',
    cmds: [...CLOCK, 'pretend until 3:30', 'wait 0.4s'],
    intent: 'At 3:30 the boss turns to his pushed clock and starts (a clock face and !, beside him, the clock still in view): he believes it is half an hour later. You stand behind him on the phone, just off the stepladder.',
  },
  {
    name: 'boss-pours-a-coffee',
    cmds: ['pretend until 3:47', 'wait 0.5s'],
    intent: 'The boss is on his break: in the kitchen, pouring himself a coffee from the pot.',
  },
  {
    name: 'boss-shrugs',
    cmds: ['pretend until 3:58', 'wait 1.9s'],
    intent: 'Walking back from the kitchen with his coffee, the boss passes under the open-plan clock, reads it (a clock face) and shrugs.',
  },
  {
    name: 'boss-takes-his-coat',
    cmds: [...CLOCK, ...SIT, 'pretend until 4:21', 'wait 0.5s'],
    intent: "At 4:21 by the HUD the boss has his coat on and waves: he is going home, half an hour early, under his crooked clock; the stand in his office is empty.",
  },
  {
    name: 'bus-arrives',
    cmds: [...CLOCK, ...SIT, 'pretend until 4:22', ...TO_STOP, 'pretend until 4:28'],
    intent: 'The boss has gone home; the bus has pulled up at the stop with its doors open, and you are waiting beside it.',
  },
  {
    name: 'end-clock',
    cmds: [...CLOCK, ...SIT, 'pretend until 4:22', ...TO_STOP, 'pretend until 4:30'],
    intent: 'Win: the boss goes home in his coat under his crooked clock, waving, while you cheer in the door of the bus.',
  },
  {
    name: 'lin-checks-the-coat',
    cmds: [...HERD, ...SIT, 'pretend until 3:50', 'wait 0.5s'],
    intent: "By the pushed clock it is home time: Lin and Kev, at their desks, think of the boss with a grimace (his face, gritted teeth). His coat still hangs on its stand in his office (he is in the kitchen), so they stay.",
  },
  {
    name: 'boss-reads-the-open-clock',
    cmds: [...HERD, ...SIT, 'pretend until 3:58', 'wait 1.9s'],
    intent: 'Walking back from the kitchen with his coffee, the boss passes under the crooked open-plan clock and starts (a clock face and !, beside him, the clock still in view).',
  },
  {
    name: 'boss-takes-his-coat-early',
    cmds: [...HERD, ...SIT, 'pretend until 4:02', 'wait 0.6s'],
    intent: 'The boss has taken his coat off the stand and put it on, and waves: going home. The stand is empty.',
  },
  {
    name: 'lin-and-kev-follow',
    cmds: [...HERD, ...SIT, 'pretend until 4:09'],
    intent: 'The boss has gone out through the lobby; Lin and Kev are up and follow him out with their bags.',
  },
  {
    name: 'end-herd',
    cmds: [...HERD, ...SIT, 'pretend until 4:09', ...TO_STOP, 'pretend until 4:30'],
    intent: 'Win: the boss heads home in his coat under the crooked open-plan clock, Lin and Kev following him with their backpacks, past his empty coat stand; you cheer in the bus door.',
  },
  {
    name: 'end-caught',
    cmds: ['pretend until 3:25', 'goto boss_clock pretend', 'interact', 'interact', 'interact'],
    intent: 'Caught: you are up the stepladder at his crooked clock, and the boss below points up at you, angry.',
  },
  {
    name: 'end-caught-in-the-street',
    cmds: [...TO_STOP, 'pretend until 3:20', 'pretend until 3:20'],
    intent: "Caught: out in the street before 4:30, with no bus at the kerb; the boss, in his shirtsleeves, stands in the lobby door and points at you, angry. Through the window his coat still hangs on its stand by his clock.",
  },
  {
    name: 'end-blamed',
    cmds: [...HERD, ...SIT, 'pretend until 4:30', 'pretend until 4:30'],
    intent: 'Lost: the boss did go home early, but you were not at the stop: the bus pulls away from the empty stop as you run out of the door, too late.',
  },
  {
    name: 'end-fail',
    cmds: ['pretend until 4:30', 'pretend until 4:30'],
    intent: "Lost: 4:30 on the boss's clock; he is still at his desk in his shirtsleeves, his coat on its stand, so you stay; out of the window your bus drives off.",
  },
  {
    name: 'end-fail-at-the-stop',
    cmds: ['pretend until 4:24', ...TO_STOP, 'pretend until 4:30'],
    intent: "Lost: you went out to the stop while the boss was still in; the bus pulls away without you, and the boss in his shirtsleeves points at you from the lobby door. Through the window his coat still hangs on its stand by his clock, at 4:30.",
  },
];
