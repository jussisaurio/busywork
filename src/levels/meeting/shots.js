// Level 1's screenshots for the pictures cold read (docs/COLD-READ.md): tools/shots.mjs plays each shot's harness
// commands from the start of the day and draws one frame. The intents say what each picture must tell a first-time
// player. The step 1 reader never sees them; the step 2 comparer does.
// Frame-exact waits ('busy 0.67s') land a bubble after it has popped in: found by stepping frames. The picture shows
// bubbles as a player at normal speed sees them: one lasts 2.5 game seconds, which is about 0.4 s of pretending (the
// clock runs at x6), so the wait must land inside that. A wait stops early when someone notices something
// ('wait 2s', 'wait 2s' steps past two such stops).
const POUR = ['goto coffee_machine busy', 'interact']; // 2:34: the day's only cup, before Kev's 2:38 coffee run
const HIDE = ['goto my_desk_spot busy', 'put my_desk']; // the cup on your own desk, out of Kev's way
const SPILL = [...POUR, ...HIDE, 'sit busy', 'busy until 3:06', 'goto my_desk_spot busy', 'interact', 'goto projector busy',
  'interact']; // after Kev has gone home (3:05)
const KEYCARD = ['busy until 3:11', 'busy 1.35s', 'goto boss_office_door busy', 'goto coat_rack busy']; // the boss is out

export default [
  {
    name: 'start',
    cmds: [],
    intent: 'The office at 2:30 PM, seen from above. You (red sweater, ringed) stand at your desk in the open-plan area. ' +
      'The boss sits behind glass walls in his office, top left, with his jacket on a coat rack behind him. A meeting ' +
      'room with a long table and a projector, top middle. A kitchen with a fridge and a coffee machine, top right. Two ' +
      'colleagues at their desks: Lin (teal) on the left, Kev (olive hoodie) on the right. The HUD: the clock, and a ' +
      'badge saying "no slides".',
  },
  {
    name: 'cup-at-projector',
    cmds: [...POUR, 'goto projector'],
    intent: 'You stand next to the projector on the meeting table holding a cup of coffee (in your hand slot). The ' +
      'projector has a "no coffee" sticker on it: coffee and this projector do not mix.',
  },
  {
    name: 'pot-empty',
    cmds: [...POUR, 'sit busy', 'busy until 2:40', 'wait 1s'],
    intent: 'Kev has come to the coffee machine and finds the pot empty (☕❓): you poured the last cup (the empty ' +
      'coffee bag lies beside the machine), and it is in your hand.',
  },
  {
    name: 'kev-asks',
    cmds: [...POUR, 'goto kitchen_table busy', 'wait until 2:40', 'wait 7.3s'],
    intent: 'You stand by the kitchen table with the cup in your hand. Kev, at the coffee machine with the pot empty, ' +
      'looks at your cup and asks for it (☕🥺❓). He does not take it: it is yours while you hold it.',
  },
  {
    name: 'kev-squints',
    cmds: [...POUR, 'goto kev_desk busy', 'busy until 2:46.2'],
    intent: 'You stand by Kev\'s desk pretending, the full cup held to your ear like a phone. Kev, who wants that ' +
      'cup, squints at it (☕❓): is that a phone?',
  },
  {
    name: 'kev-shrugs',
    cmds: [...POUR, 'goto kev_desk busy', 'busy until 2:47'],
    intent: 'You keep up the act, the cup still at your ear. Kev decides you are on a call (📱🤷) and lets you be.',
  },
  {
    name: 'kev-takes-cup',
    cmds: [...POUR, 'put coffee', 'sit busy', 'busy until 2:40', 'wait 2s', 'wait 0.6s'],
    intent: 'You left the cup on the coffee machine and went back to your desk. Kev, finding it there unattended, ' +
      'takes it as free and is delighted (🤤☕). An unattended cup is anyone\'s.',
  },
  {
    name: 'cup-on-desk',
    cmds: [...POUR, ...HIDE, 'sit busy', 'busy until 2:41'],
    intent: 'You sit typing at your desk, the cup set down beside your keyboard, a room away from the kitchen. Kev at ' +
      'the coffee machine has found the pot empty (☕❓) and has no idea where the last cup went.',
  },
  {
    name: 'kev-leaves',
    cmds: ['busy until 2:58', 'busy 0.1s'],
    intent: 'Kev at his desk with his bag, waving goodbye (🎒👋): he is going home (out by the elevator, bottom left).',
  },
  {
    name: 'spill',
    cmds: [...SPILL, 'wait 0.4s'],
    intent: 'You have spilled the coffee on the projector: it sparks and smokes, broken. You stand next to it, looking ' +
      'innocent (😇), and now hold the empty mug.',
  },
  {
    name: 'kev-fixes',
    cmds: [...POUR, 'goto projector busy', 'interact', 'sit busy', 'busy until 2:48'],
    intent: 'You broke the projector too early, while Kev (IT) was still in the building: he is at the projector ' +
      'repairing it, and will have it working again. Kev fixes things; the projector only stays broken once he has gone.',
  },
  {
    name: 'boss-sees-projector',
    cmds: [...SPILL, 'goto meeting_seat busy', 'busy until 3:14', 'busy 0.57s'],
    intent: 'On his way past, the boss looks in at the meeting room and sees the broken projector (📽️💥). He is ' +
      'about to go looking for whoever did it.',
  },
  {
    name: 'mug-on-machine',
    cmds: [...SPILL, 'put coffee busy', 'goto meeting_seat busy'],
    intent: 'The boss, hunting for the culprit, finds the empty mug back on the coffee machine and shrugs (☕🤷): no ' +
      'one to blame. You put it back there and walked off.',
  },
  {
    name: 'mug-on-kevs-desk',
    cmds: [...SPILL, 'put kev_desk busy', 'goto meeting_seat busy', 'busy 0.4s'],
    intent: 'The boss finds the empty mug on Kev\'s desk and blames Kev (😠 + Kev\'s face), with nobody near it: he concludes Kev spilled coffee ' +
      'on the projector. Kev has gone home and can\'t deny it. You are walking away to the meeting room.',
  },
  {
    name: 'sandwich-missing',
    cmds: ['goto fridge busy', 'interact', 'goto my_seat busy', 'sit busy', 'busy until 3:03', 'busy 0.37s'],
    intent: 'Lin opens the fridge for her lunch and her sandwich is gone (🥪❓): you took it. She will search the ' +
      'office for it, which keeps her away from her desk.',
  },
  {
    name: 'lin-sees-theft',
    cmds: [...KEYCARD, 'interact', 'wait 0.3s'],
    intent: 'You reach for the keycard on the boss\'s jacket while the boss is out, but Lin, at her desk, sees you ' +
      'through the glass wall and points (❗👉): she will tell the boss.',
  },
  {
    name: 'keycard-taken',
    cmds: [...KEYCARD, 'busy 0.42s', 'interact', 'wait 0.3s'],
    intent: 'You stand at the coat rack in the boss\'s empty office with the keycard from his jacket in your hand, ' +
      'while Lin looks away. Nobody saw.',
  },
  {
    name: 'boss-goes-down',
    cmds: ['busy until 3:44', 'busy 0.3s'],
    intent: 'The boss, in his jacket, has stepped out through the red fire door (EXIT sign over it) onto the little ' +
      'smokers\' balcony at the far right, past the restroom, and stands there smoking. You watch from your desk.',
  },
  {
    name: 'boss-badges-in',
    cmds: ['busy until 3:48', 'busy 0.15s'],
    intent: 'Back from his smoke, the boss holds his keycard to the reader by the fire door (🪪) and the light goes ' +
      'green: the door only opens from outside with that card.',
  },
  {
    name: 'boss-locked-out',
    cmds: [...KEYCARD, 'busy 0.42s', 'interact', 'goto my_seat busy', 'sit busy', 'busy until 3:52'],
    intent: 'You took his keycard. Now the boss is stuck out on the balcony: the reader by the fire door blinks red, ' +
      'and he pounds the door with his fists, furious (😠🚪🪪 or 👊👊🚪), the door shuddering. Nobody but you is near ' +
      'enough to hear. It is the card in your pocket that did it.',
  },
  {
    name: 'end-keycard',
    cmds: [...KEYCARD, 'busy 0.42s', 'interact', 'goto meeting_seat busy', 'busy until 4:00'],
    intent: 'End card, a win. On the left you cheer, confetti flying. On the right, through the wall, the boss is ' +
      'locked out on the balcony, pounding on the fire door whose card reader blinks red (😠🚪🪪): his card is ' +
      'gone, and the meeting cannot start without him.',
  },
  {
    name: 'end-projector',
    cmds: [...SPILL, 'put coffee busy', 'goto meeting_seat busy', 'busy until 4:00'],
    intent: 'End card, a win: at 4:00 the projector is dead. You sit at the table, the picture of patience. The boss ' +
      'points at the smoking projector (📽️💥🙅) and then waves everyone out: the meeting is called off.',
  },
  {
    name: 'end-kev-blamed',
    cmds: [...SPILL, 'put kev_desk busy', 'goto meeting_seat busy', 'busy until 4:00', 'busy 3s'],
    intent: 'End card, a win: the projector is dead and everyone at the table stares at Kev\'s empty olive chair: ' +
      'they blame him, and he has gone home. You stand among them.',
  },
  {
    name: 'end-fail',
    cmds: ['busy until 4:00'],
    intent: 'End card, a loss: the meeting happened, and you stood in front of a blank screen with no slides (📊❌🦗).',
  },
  {
    name: 'fire-door-push',
    cmds: ['goto fire_door', 'interact', 'wait 0.05s'],
    intent: 'You stand at the fire door in the lobby corner, arms out, pushing its bar. It will not open: the card ' +
      'reader by the handle blinks red (with a buzz you cannot see). The balcony is outside, behind it.',
  },
  {
    name: 'end-caught',
    cmds: ['pretend until 3:18', 'goto coat_rack pretend', 'wait until 3:26.6', 'interact'], // he walks back in from the restroom (🤨) as you reach
    intent: 'End card, a loss: the boss caught you at his jacket, reaching for his keycard (😠🪪). The card is on his ' +
      'pocket, and you are fired, carrying your things out in a box.',
  },
  {
    name: 'end-blamed-chair',
    cmds: [...SPILL, 'put coffee busy', 'sit busy', 'busy until 4:00'],
    intent: 'End card, a loss: the meeting fell apart, but you were the only one not in the meeting room, so everyone ' +
      'points at your empty chair: blamed.',
  },
  {
    name: 'end-blamed-mug',
    cmds: [...SPILL, 'goto meeting_seat busy', 'busy until 4:00'],
    intent: 'End card, a loss: the projector died of coffee, and you are holding the empty mug, so everyone points at ' +
      'you: blamed.',
  },
  // ---- More coffee, Kev's doze, the plain fails, the bib, the campfire (one block: a parallel builder appends too).
  {
    name: 'ficus-delight',
    cmds: ['goto coffee_machine busy', 'interact', 'goto boss_doorway busy', 'interact', 'wait 0.3s'],
    intent: 'You stand in the boss\'s office doorway, empty-handed: you just poured the day\'s only cup of coffee into ' +
      'his potted plant. A glossy new leaf has shot out of it, the soil is dark and wet, and the boss at his desk ' +
      'looks at the plant, delighted (🌿😍).',
  },
];
