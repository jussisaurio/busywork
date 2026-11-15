// Discreet Packaging's cold-read shots (docs/COLD-READ.md): harness commands from
// the start of the day, and what each picture must tell a first-time player who has read only the card.
const UNPLUG = ['goto socket pretend', 'interact'];
const TAKE = [...UNPLUG, 'goto pigeonholes pretend', 'interact'];
const DRAWER = [...TAKE, 'goto own_desk pretend', 'interact'];
const RELABEL = ['goto label_printer', 'interact', ...UNPLUG, 'goto pigeonholes pretend', 'interact'];
const BROOM = ['goto broom_stand', 'interact', 'goto camera pretend'];
const CORRIDOR_DROP = [...TAKE, 'goto corridor pretend', 'interact', 'goto own_desk pretend', 'sit'];
// To the end card: a notice or a catch stops a pretend early, the next one goes on; 4:00 stops the last, and the day
// ends about a game minute later.
const END = ['pretend until 4:00', 'pretend until 4:00', 'pretend until 4:00', 'wait 5s'];

export default [
  {
    name: 'start',
    cmds: ['wait 1.5s'],
    intent: "3:20: you at your desk in your office, Lin at hers; Security Bob behind the counter, facing the lobby, his back to the back office, a monitor in front of him; in the back office a camera on the wall watches the pigeonholes, a pink box on the bottom shelf; a mailroom beside it.",
  },
  {
    name: 'parcel-on-the-shelf',
    cmds: ['goto pigeonholes pretend', 'pretend 0.3s'],
    intent: "Up close the pink box on the pigeonholes' bottom shelf is covered in red hearts with your face on its label, and it lights up (E) to take. You stand inside the camera's cone; Bob's monitor shows the back office with you on it.",
  },
  {
    name: 'power-strip',
    cmds: ['goto socket pretend', 'pretend 0.3s'],
    intent: "Out of the camera's cone, by the counter, a power strip with the monitor's plug in it; it lights up (E) to pull.",
  },
  {
    name: 'static',
    cmds: [...UNPLUG, 'wait 0.8s'],
    intent: "The plug hangs out of the power strip. Bob's monitor shows grey static; Bob frowns at it (screen, ?) and gets up.",
  },
  {
    name: 'bob-thumps-the-camera',
    cmds: [...UNPLUG, 'goto corridor pretend', 'wait until 3:28'], // he thumps it 3:27 to 3:29
    intent: 'Bob has left his counter and stands right under the camera, facing it, giving it a thump. His monitor still shows static. You wait in the corridor, out of his way.',
  },
  {
    name: 'bob-plugs-it-back',
    cmds: [...UNPLUG, 'goto corridor pretend', 'wait until 3:30', 'wait 0.4s'], // the plug goes back in at 3:30.5
    intent: 'Bob has given up on the camera and walks to the power strip: he has worked it out (plug, !). The monitor still shows static, but not for long.',
  },
  {
    name: 'broom-on-its-clip',
    cmds: ['goto broom_stand', 'pretend 0.3s'],
    intent: 'In the mailroom a broom hangs on a wall clip; it lights up (E) to take.',
  },
  {
    name: 'under-the-camera',
    cmds: [...BROOM],
    intent: "You stand under the camera with the broom in your hands. The camera on its bracket points into the room; the leafy plant stands right beside it. Bob's monitor shows the back office.",
  },
  {
    name: 'poked-into-the-plant',
    cmds: [...BROOM, 'interact', 'wait 1.4s'],
    intent: "The camera now points sideways, into the leafy plant beside it, and stays there. Bob's monitor shows one giant green leaf; Bob, at his counter, is content with it (plant, smile). The broom is still in your hands.",
  },
  {
    name: 'label-printer',
    cmds: ['goto label_printer', 'pretend 0.3s'],
    intent: "In the mailroom a label printer with a spare address label sticking out of it: Bob's face on the label. It lights up (E) to take.",
  },
  {
    name: 'relabelled',
    cmds: [...RELABEL, 'goto own_desk pretend'],
    intent: "Back on the shelf, the pink box now carries Bob's face on its label instead of yours.",
  },
  {
    name: 'drawer',
    cmds: [...DRAWER, 'pretend 0.3s'],
    intent: 'The pink box is stuffed in your desk drawer, which sticks open on a pink corner. The shelf in the pigeonholes is empty.',
  },
  {
    name: 'lin-collects-the-mail',
    cmds: ['pretend until 3:53', 'wait 1.7s'], // she reaches the shelf at 3:53.8
    intent: 'Nobody touched the box: at the pigeonholes Lin has it in her hands and reads the label (box, your face).',
  },
  {
    name: 'empty-pigeonhole',
    cmds: [...DRAWER, 'sit', 'pretend until 3:53', 'wait 1.7s'],
    intent: 'Lin finds the parcel shelf empty (empty mailbox, ?) and stands there empty-handed. A pink corner sticks out of your desk drawer; you sit at your desk.',
  },
  {
    name: 'mail-call-shrug',
    cmds: [...DRAWER, 'sit', 'pretend until 3:59', 'wait 1.4s'],
    intent: "4:00: Lin and Bob stand in your office for the mail call. Lin has nothing to hand out (empty mailbox, shrug) and shrugs. You sit at your desk.",
  },
  {
    name: 'dropped-box-spotted',
    cmds: [...CORRIDOR_DROP, 'pretend until 3:51', 'wait 0.4s'],
    intent: "The pink box lies on the corridor floor where you dropped it. Lin, on her way from the office to the pigeonholes, spots it (box, !). You sit at your desk.",
  },
  {
    name: 'dropped-box-found',
    cmds: [...CORRIDOR_DROP, 'pretend until 3:51', 'wait 3.5s'],
    intent: 'Lin has picked up the pink box in the corridor and read the label: your face (@you, !).',
  },
  {
    name: 'handover',
    cmds: [...RELABEL, 'sit', 'pretend until 3:59', 'wait 1.45s'], // the handover at 1.3 s, the day's verdict at 1.5 s
    intent: "At the mail call in your office Lin hands Bob the pink box (box, Bob's face); big stern Bob holds it, moved (tears). You sit at your desk.",
  },
  // The end cards.
  {
    name: 'end-bob',
    cmds: [...RELABEL, 'sit', ...END],
    intent: "Win: Bob hugs the pink heart box with his face on the label, moved (tears); Lin stands by; confetti; you grin. Icons: box, Bob's face, tears.",
  },
  {
    name: 'end-hidden',
    cmds: [...DRAWER, 'sit', ...END],
    intent: 'Win: no parcel today. Lin shrugs, arms up, empty-handed (empty mailbox, shrug); Bob stands by; you hum (a note) beside your desk, a pink corner poking out of its drawer. Icons: Lin, shrug, you, a note.',
  },
  {
    name: 'end-mail',
    cmds: [...END],
    intent: "Lose: Lin holds the pink box up high (box, your face), Bob turns to look, you go red. Icons: box, your face, blush.",
  },
  {
    name: 'end-caught-camera',
    cmds: ['goto pigeonholes pretend', 'interact', ...END],
    intent: "Lose: Bob, at his counter, jabs a finger past his monitor, which shows you at the pigeonholes with the pink box, at you (angry, @you); you go red. Icons: screen, pointing, you.",
  },
  {
    name: 'end-caught',
    cmds: [...TAKE, 'goto 25,7 pretend', 'pretend until 3:33', 'goto lobby pretend', ...END], // Bob back at his counter
    intent: 'Lose: Bob, back at his counter, saw you carry the pink box past it; he points at you (angry, pointing); you hold the box and go red. Icons: angry, pointing, you.',
  },
  {
    name: 'end-found',
    cmds: [...CORRIDOR_DROP, ...END],
    intent: 'Lose: in the corridor Lin holds out the pink box she picked up off the floor, your face on the label (@you, !); you go red. Icons: Lin, box, you, blush.',
  },
  {
    name: 'end-blamed',
    cmds: [...DRAWER, 'goto mailroom pretend', ...END],
    intent: "Lose: the mail call went off, but your chair is empty: Lin and Bob look at it (@you, ?). Icons: chair, ?.",
  },
];
