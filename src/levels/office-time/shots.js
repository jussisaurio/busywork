// Office Time's cold-read shots (see the cold-read framework): harness commands from the start of the day, and what
// each picture must tell a first-time player who has read only the card.
const CLOCK = ['pretend until 3:20', 'goto boss_clock pretend', 'interact', 'interact', 'interact']; // +30, Lin away
const HERD = ['goto open_clock pretend', 'interact', 'interact', 'interact', 'interact']; // +40 while Kev gets coffee
const TO_STOP = ['goto bus_stop pretend'];

export default [
  {
    name: 'start',
    cmds: ['wait 1.5s'],
    intent: "3:00: you at your desk; the boss's glass office (empty, he is at lunch) with a wall clock and a stepladder under it; a second clock and stepladder over Kev's desk; the lobby, the elevator, and outside, a bus stop by the road.",
  },
  {
    name: 'kev-checks-the-clock',
    cmds: ['pretend until 3:01'],
    intent: 'Kev turns to the open-plan clock and thinks of the time, then gets up for coffee: people here go by the wall clock.',
  },
  {
    name: 'open-clock-close',
    cmds: ['goto open_clock pretend'],
    intent: 'The open-plan clock up close: a real wall clock with a stepladder under it that you can climb; Kev has just walked off for coffee.',
  },
  {
    name: 'open-clock-pushed',
    cmds: [...HERD],
    intent: 'After four pushes the open-plan clock hangs crooked and reads 40 minutes later than the HUD clock; you whistle.',
  },
  {
    name: 'kev-jumps',
    cmds: [...HERD, 'goto player_desk pretend', 'pretend until 3:09', 'wait 1.2s'],
    intent: 'Back at his desk Kev looks up at the pushed clock and starts (!): he believes it is 40 minutes later.',
  },
  {
    name: 'lin-checks-the-open-clock',
    cmds: ['pretend until 3:12', 'wait 0.5s'],
    intent: "Lin sits facing the glass of the boss's office (his stepladder in her view), but for the time she turns to the open-plan clock.",
  },
  {
    name: 'boss-back-from-lunch',
    cmds: ['pretend until 3:19', 'pretend 0.1s'],
    intent: 'The boss is back from lunch: he sits with his back to his clock and turns round to check it.',
  },
  {
    name: 'lin-goes-to-the-restroom',
    cmds: ['pretend until 3:23'],
    intent: 'At 3:20 Lin leaves her desk and walks off to the restroom, so nobody faces the boss\'s clock now.',
  },
  {
    name: 'boss-misses-lin',
    cmds: ['pretend until 3:25', 'pretend 0.5s'],
    intent: "Lin is out of sight in the restroom; the boss turns to her empty desk and wonders where she is (her face, ?).",
  },
  {
    name: 'lin-tells',
    cmds: ['goto boss_clock pretend', 'interact'],
    intent: 'You step onto the stepladder while Lin watches through the glass: she points at you and shouts.',
  },
  {
    name: 'boss-clock-close',
    cmds: ['pretend until 3:20', 'goto boss_clock pretend'],
    intent: "The boss's clock up close: a real wall clock with a stepladder under it, right behind the boss's chair.",
  },
  {
    name: 'boss-clock-pushed',
    cmds: [...CLOCK, 'wait 2s'],
    intent: "The boss's clock hangs crooked and reads half an hour later than the HUD clock; the boss works on with his back to it.",
  },
  {
    name: 'boss-jumps',
    cmds: [...CLOCK, 'goto player_desk pretend'],
    intent: 'At 3:30 the boss turns to his pushed clock and starts (!): he believes it is half an hour later.',
  },
  {
    name: 'boss-goes-home-early',
    cmds: [...CLOCK, ...TO_STOP, 'pretend until 4:18'],
    intent: 'At 4:18 by the HUD the boss waves goodbye and gets up to go home, half an hour early, under his crooked clock.',
  },
  {
    name: 'bus-arrives',
    cmds: [...CLOCK, ...TO_STOP, 'pretend until 4:28'],
    intent: 'The bus has pulled up at the stop with its doors open, and you are waiting beside it.',
  },
  {
    name: 'end-clock',
    cmds: [...CLOCK, ...TO_STOP, 'pretend until 4:30', 'wait 5s'],
    intent: 'Win: the boss goes home under his crooked clock, waving, while you cheer in the door of the bus.',
  },
  {
    name: 'lin-and-kev-go-home',
    cmds: [...HERD, 'goto player_desk pretend', 'pretend until 4:10'],
    intent: 'At 4:10 by the HUD (4:50 on the pushed clock) Lin and Kev wave goodbye and get up to go home.',
  },
  {
    name: 'boss-sees-empty-desks',
    cmds: [...HERD, 'goto player_desk pretend', 'pretend until 4:17'],
    intent: "Lin and Kev have gone; the boss turns to Kev's empty desk, the second one, and wonders where he is.",
  },
  {
    name: 'boss-follows-the-herd',
    cmds: [...HERD, 'goto player_desk pretend', 'pretend until 4:18', 'pretend 0.3s'],
    intent: 'With both desks empty the boss decides it is home time: he waves and heads out after them, half an hour early.',
  },
  {
    name: 'end-herd',
    cmds: [...HERD, ...TO_STOP, 'pretend until 4:30', 'wait 5s'],
    intent: 'Win: Lin and Kev go home with their backpacks, the boss trails after them past their empty chairs, and you cheer in the bus door.',
  },
  {
    name: 'end-caught',
    cmds: ['pretend until 3:25', 'goto boss_clock pretend', 'interact', 'interact', 'interact', 'wait 5s'],
    intent: 'Caught: you are up the stepladder at the clock, and the boss turns round and points at you, angry.',
  },
  {
    name: 'end-blamed',
    cmds: [...HERD, 'sit', 'pretend until 4:30', 'wait 5s'],
    intent: 'Lost: the boss did go home early, but you were not at the stop: he waves from your bus as you run out too late.',
  },
  {
    name: 'end-fail',
    cmds: ['pretend until 4:30', 'wait 5s'],
    intent: 'Lost: 4:30 on the boss\'s clock and he is still at his desk, so you stay; out of the window your bus drives off.',
  },
  {
    name: 'end-fail-at-the-stop',
    cmds: [...TO_STOP, 'pretend until 4:30', 'wait 5s'],
    intent: 'Lost: you went out to the stop, but the boss is still at his desk in the window, so you cannot get on; the bus leaves.',
  },
];
