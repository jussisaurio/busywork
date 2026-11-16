// Discreet Packaging's cold-read shots (docs/COLD-READ.md): harness commands from
// the start of the day, and what each picture must tell a first-time player who has read only the card.
const UNPLUG = ['goto socket pretend', 'interact'];
const TAKE = [...UNPLUG, 'goto pigeonholes pretend', 'interact'];
const DRAWER = [...TAKE, 'goto drawer pretend', 'interact'];
const SWAP = [...TAKE, 'interact']; // holding your box at the shelf: swap the labels
const TOOK = [...SWAP, 'interact']; // then the brown box, your face on it now: yours to take
// The broom fills your arms (no pretending): you wait in the corridor by the back office door, and go in once the
// sweep has swung away from the door and the spot under the camera (it sees that spot at 3:27.5 and 3:33.5).
const BROOM = ['goto broom_stand', 'interact', 'goto 17,3', 'wait until 3:27', 'wait 4s', 'goto camera', 'goto camera'];
const POKE_SAFE = [...BROOM, 'interact'];
const POKE_SEEN = ['goto broom_stand', 'interact', 'goto 17,3', 'wait until 3:27', 'goto camera', 'goto camera', 'interact'];
const UNPLUG_TAKE_TO_OFFICE = [...TAKE, 'goto 5,6 pretend']; // Lin sees it
const CORRIDOR_DROP = [...TAKE, 'goto corridor pretend', 'interact', 'goto own_desk pretend', 'sit'];
// To the end card: a notice or a catch stops a pretend early, the next one goes on; 4:00 stops the last, and the day
// ends about a game minute later.
const END = ['pretend until 4:00', 'pretend until 4:00', 'pretend until 4:00', 'wait 5s'];

export default [
  {
    name: 'start',
    cmds: ['wait 2.6s'], // Bob's thought at 3:21.5, the sweep at its plant end
    intent: "3:20: you at your desk in your office, Lin at hers; Bob, the office manager (navy suit, tie, moustache), behind the counter, facing the lobby, his back to the back office, a monitor in front of him. On his monitor the plant's fronds poke in at the edge of the picture and he smiles at it (plant, smile). In the back office a camera on the wall watches the pigeonholes: on the bottom shelf a plain brown box with a pink box stacked on it. A dusty store room beside it.",
  },
  {
    name: 'parcel-on-the-shelf',
    cmds: ['goto pigeonholes pretend', 'wait 0.3s'],
    intent: "You stand at the pigeonholes, inside the camera's cone; Bob's monitor shows the back office with you on it. A close-up card beside the shelf shows its two boxes big: Bob's plain brown one with his face on the label, and your pink one covered in hearts with your face on it. It lights up (E) to take.",
  },
  {
    name: 'power-strip',
    cmds: ['goto socket pretend', 'wait 0.3s'],
    intent: "Out of the camera's cone, by the counter, a power strip on the floor; a cable runs from it up the wall to the camera, and its plug lights up (E) to pull.",
  },
  {
    name: 'static',
    cmds: [...UNPLUG, 'wait 0.8s'],
    intent: "The camera's plug hangs out of the power strip and the camera's red light is out. Bob's monitor shows grey static, its cone a faint dashed grey; Bob frowns at it (a snowy screen, ?) and gets up.",
  },
  {
    name: 'bob-thumps-the-camera',
    cmds: [...UNPLUG, 'goto corridor pretend', 'pretend until 3:28', 'wait 0.3s'], // he thumps it 3:27 to 3:29
    intent: 'Bob has left his counter and stands right under the camera, thumping it: the camera rattles on its bracket under an impact star. His monitor still shows static. You wait in the corridor, out of his way.',
  },
  {
    name: 'bob-plugs-it-back',
    cmds: [...UNPLUG, 'goto corridor pretend', 'pretend until 3:30', 'wait 0.4s'], // the plug goes back in at 3:30.5
    intent: "Bob has spotted the camera's cable (plug, !) and follows it down the wall to the power strip. The monitor still shows static, but not for long.",
  },
  {
    name: 'broom-on-its-clip',
    cmds: ['goto broom_stand', 'wait 0.3s'],
    intent: 'In the dusty store room (cobwebs in the corners, dust on the floor: nobody has been in today) a broom hangs on a wall clip; it lights up (E) to take.',
  },
  {
    name: 'under-the-camera',
    cmds: [...BROOM, 'wait 0.3s'],
    intent: "You stand under the camera with the broom in your hands. The camera's blue eye and its cone point away from you, down into the room; you are outside the cone. The leafy plant stands right beside the camera. Bob's monitor shows the back office.",
  },
  {
    name: 'poked-into-the-plant',
    cmds: [...POKE_SAFE, 'wait 1.4s'],
    intent: "The camera now points sideways, into the leafy plant beside it, and stays there. Bob's monitor shows one giant green leaf; Bob gets up from his counter, fed up with it (screen with the leaf, angry), and turns to come and look. The broom is still in your hands: time to go.",
  },
  {
    name: 'bob-tugs-the-camera',
    cmds: [...POKE_SAFE, 'goto corridor', 'goto corridor', 'wait until 3:32', 'wait 1s'],
    intent: "Bob has left his counter and stands under the camera, reaching up and tugging at it: it rattles on its bracket but stays jammed in the plant's leaves. No impact star. You wait in the corridor, the broom in your hands.",
  },
  {
    name: 'bob-gives-up',
    cmds: [...POKE_SAFE, 'goto corridor', 'goto corridor', 'wait until 3:33', 'wait 1.5s'],
    intent: "Bob gives up on the camera, still jammed in the plant: he says (wrench, shrug): someone will fix it, some time. His monitor still shows the leaf.",
  },
  {
    name: 'bob-fond-of-the-leaf',
    cmds: [...POKE_SAFE, 'goto corridor', 'goto corridor', 'wait until 3:35', 'wait 0.5s'],
    intent: "Bob is back behind his counter. His monitor still shows one giant green leaf, and he smiles at it fondly (plant, smile). You wait in the corridor, the broom in your hands.",
  },
  {
    name: 'labels-swapped',
    cmds: [...SWAP, 'wait 0.3s'],
    intent: "At the pigeonholes, right after you swapped the labels: both boxes back on the shelf, your hands empty, a little puff. The close-up card shows the pink box now has Bob's face on its label, and the brown box has yours.",
  },
  {
    name: 'took-the-brown-box',
    cmds: [...TOOK, 'wait 0.3s'],
    intent: "Right after the swap you took the brown box: it has your face on its label now. You hold the dull brown box at the pigeonholes; on the shelf only the pink box is left, Bob's face on its label.",
  },
  {
    name: 'drawer',
    cmds: [...DRAWER, 'wait 0.3s'],
    intent: "You stand at your desk; its drawer is shut, nothing pink showing anywhere. On the shelf in the pigeonholes only Bob's brown box is left.",
  },
  {
    name: 'lin-collects-the-mail',
    cmds: ['pretend until 3:53', 'wait 1.7s'], // she reaches the shelf at 3:53.8
    intent: 'Nobody touched the boxes: at the pigeonholes Lin holds both (the brown one with the pink one on top) and reads the pink one\'s label (box, your face).',
  },
  {
    name: 'empty-pigeonhole',
    cmds: [...DRAWER, 'sit', 'pretend until 3:53', 'wait 1.7s'],
    intent: "At the pigeonholes Lin picks up only Bob's brown box: no pink box on the shelf today, and she doesn't miss it: a bored thought (brown box, tick), then crickets. You sit at your desk, its drawer shut.",
  },
  {
    name: 'mail-call-shrug',
    cmds: [...DRAWER, 'sit', 'pretend until 3:59', 'wait 1.4s'],
    intent: "4:00: Lin and Bob stand in your office for the mail call. Bob holds his brown box. Lin has nothing for you (empty mailbox, your face) and shrugs, palms up. You sit at your desk and hum (a note).",
  },
  {
    name: 'dropped-box-spotted',
    cmds: [...CORRIDOR_DROP, 'pretend until 3:51', 'wait 0.4s'],
    intent: "The pink box lies on the corridor floor where you dropped it. Lin, on her way from the office to the pigeonholes, spots it (box, !). You sit at your desk.",
  },
  {
    name: 'dropped-box-found',
    cmds: [...CORRIDOR_DROP, 'pretend until 3:51', 'wait 3.5s'],
    intent: 'Lin has picked up the pink box in the corridor and read the label: your face (box, your face; then @you, !).',
  },
  {
    name: 'handover',
    cmds: [...SWAP, 'goto own_desk pretend', 'sit', 'pretend until 3:59', 'wait 1.45s'], // the handover at 1.3 s, the day's verdict at 1.5 s
    intent: "At the mail call in your office Lin hands Bob the pink box (box, Bob's face); big stern Bob hugs it, moved (tears). Lin still has the brown box. You sit at your desk, smug (smirk).",
  },
  // The end cards.
  {
    name: 'end-bob',
    cmds: [...SWAP, 'goto own_desk pretend', 'sit', ...END],
    intent: "Win: Bob hugs the pink heart box with his face on the label, moved (tears); Lin holds the dull brown box out to you, your face on its label (brown box, your face); confetti; you grin. Icons: box, Bob's face, tears, brown box, your face.",
  },
  {
    name: 'end-bob-took',
    cmds: [...TOOK, 'goto own_desk pretend', 'goto own_desk pretend', ...END],
    intent: "Win: Bob hugs the pink heart box with his face on the label, moved (tears); Lin has nothing left for you and shrugs (empty mailbox, your face), because you are already hugging Bob's dull brown box, your face on its label; confetti.",
  },
  {
    name: 'end-bob-away',
    cmds: [...SWAP, 'goto store_room pretend', ...END],
    intent: "Win, though you weren't there: Bob hugs the pink box (tears); Lin holds the brown box out towards your empty chair (brown box, your face). Nobody is cross. Icons: box, Bob's face, tears, brown box, your face.",
  },
  {
    name: 'end-hidden',
    cmds: [...DRAWER, 'sit', ...END],
    intent: "Win: no pink box today. Lin shrugs, palms up, empty-handed (empty mailbox, your face: nothing for you); Bob holds his brown box; you hum (a note) beside your desk, its drawers shut. Icons: Lin, empty mailbox, you, a note.",
  },
  {
    name: 'end-mail',
    cmds: [...END],
    intent: "Lose: Lin holds the pink box up high (box, your face), Bob turns to look, you go red. Icons: box, your face, blush.",
  },
  {
    name: 'end-noshow',
    cmds: ['goto lobby pretend', ...END],
    intent: "Lose: you weren't there, but your parcel was: Lin holds the pink box up high (box, your face) beside your empty chair, pulled out and spotlit. Icons: box, your face, chair.",
  },
  {
    name: 'end-caught-camera',
    cmds: ['goto pigeonholes pretend', 'interact', ...END],
    intent: "Lose: Bob, at his counter, jabs a finger at his monitor (angry, @you). On it you stand empty-handed, arms at your sides, a clear gap between you and the pigeonholes, the boxes still on the shelf. You stand behind him and go red. Icons: screen, pointing, you.",
  },
  {
    name: 'end-caught-broom',
    cmds: [...POKE_SEEN, ...END],
    intent: 'Lose: Bob jabs a finger at his monitor (angry, @you). On it you stand right under the lens with the broom raised at the camera, its bristles big at the top of the picture. You stand behind him and go red, the broom in your hands. Icons: screen, pointing, you.',
  },
  {
    name: 'end-caught',
    cmds: [...TAKE, 'goto 25,7 pretend', 'pretend until 3:33', 'goto lobby pretend', ...END], // Bob back at his counter
    intent: 'Lose: Bob, back at his counter, saw you carry the pink box past it; he points at you (angry, pointing); you hold the box and go red. Icons: angry, pointing, you.',
  },
  {
    name: 'end-found',
    cmds: [...CORRIDOR_DROP, ...END],
    intent: 'Lose: in the corridor (a plain wall with doors, no window) Lin holds out the pink box she picked up off the floor, your face on the label (@you, !); a scuff and a puff of dust where it landed; you go red. Icons: a dropped box, Lin, you, blush.',
  },
  {
    name: 'end-hidden-away',
    cmds: [...DRAWER, 'goto store_room pretend', ...END],
    intent: "Win, though you weren't there: no pink box today. Lin shrugs, empty-handed (empty mailbox, your face); Bob holds his brown box; your chair stands empty and unlit by your desk. Nobody is cross. Icons: Lin, empty mailbox, you, a note.",
  },
  {
    name: 'end-spotted',
    cmds: [...UNPLUG_TAKE_TO_OFFICE, ...END],
    intent: "Lose: in your office Lin, hands up and delighted, asks out loud about the pink box in your arms (box, heart-eyes, your face, ?). You hold it and go red. Icons: Lin, box, heart-eyes, you, blush.",
  },
];
