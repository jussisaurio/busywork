// Level 1's screenshots for the pictures cold read (docs/COLD-READ.md): tools/shots.mjs plays each shot's harness
// commands from the start of the day and draws one frame. The intents say what each picture must tell a first-time
// player. The step 1 reader never sees them; the step 2 comparer does.
// Frame-exact waits ('busy 0.67s') land a bubble after it has popped in: found by stepping frames. The picture shows
// bubbles as a player at normal speed sees them: one lasts 2.5 game seconds, which is about 0.4 s of pretending (the
// clock runs at x6), so the wait must land inside that. A wait stops early when someone notices something
// ('wait 2s', 'wait 2s' steps past two such stops).
const POUR = ['goto coffee_machine busy', 'interact']; // 2:34: the day's only cup, before Kev's 2:38 coffee run
const SPILL = [...POUR, 'sit busy', 'busy until 3:06', 'goto projector busy', 'interact']; // after Kev has gone home
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
    intent: 'Kev has come to the coffee machine and finds the pot empty (☕❓): you poured the only cup, and it is in ' +
      'your hand.',
  },
  {
    name: 'kev-grabs-cup',
    cmds: [...POUR, 'goto kev_desk busy', 'goto coffee_machine', 'wait until 2:40', 'wait 2s', 'wait 2s', 'wait 0.3s'],
    intent: 'You stand openly by the coffee machine with the cup. Kev, who wanted that coffee, takes it out of your ' +
      'hand, delighted (🤤☕). Lesson: Kev takes the cup if he sees it, so it has to be hidden from him.',
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
    cmds: [...SPILL, 'put coffee busy', 'busy until 3:19', 'busy 0.4s'],
    intent: 'The boss, hunting for the culprit, finds the empty mug back on the coffee machine and shrugs (☕🤷): no ' +
      'one to blame. You put it back there.',
  },
  {
    name: 'mug-on-kevs-desk',
    cmds: [...SPILL, 'put kev_desk busy', 'busy until 3:17', 'busy 0.67s'],
    intent: 'The boss finds the empty mug on Kev\'s desk (☕❗): he concludes Kev spilled coffee on the projector. ' +
      'Kev has gone home and can\'t deny it.',
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
    name: 'boss-locked-out',
    cmds: [...KEYCARD, 'busy 0.42s', 'interact', 'goto meeting_seat busy', 'busy until 3:48', 'busy 0.45s'],
    intent: 'The boss went out to the lobby for a smoke. Without his keycard he can\'t get back in through the glass ' +
      'entrance, and he is outside, angry (😠🚪🪪), while the meeting time comes.',
  },
  {
    name: 'end-keycard',
    cmds: [...KEYCARD, 'busy 0.42s', 'interact', 'goto meeting_seat busy', 'busy until 4:00'],
    intent: 'End card, a win: the boss is locked out, so the meeting never happens (🪪✅🎉).',
  },
  {
    name: 'end-projector',
    cmds: [...SPILL, 'put coffee busy', 'goto meeting_seat busy', 'busy until 4:00'],
    intent: 'End card, a win: at 4:00 the projector is dead, so the meeting can\'t go ahead (📽️💥🤷).',
  },
  {
    name: 'end-kev-blamed',
    cmds: [...SPILL, 'put kev_desk busy', 'goto meeting_seat busy', 'busy until 4:00'],
    intent: 'End card, a win: the projector is dead and everyone at the table stares at Kev\'s empty chair: they ' +
      'blame him, and he has gone home.',
  },
  {
    name: 'end-fail',
    cmds: ['busy until 4:00'],
    intent: 'End card, a loss: the meeting happened, and you stood in front of a blank screen with no slides (📊❌🦗).',
  },
  {
    name: 'end-caught',
    cmds: ['busy 7.8s', 'goto boss_office_door busy', 'goto coat_rack busy', 'busy 0.17s', 'interact'],
    intent: 'End card, a loss: the boss caught you at it, and you are fired, carrying your things out in a box.',
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
];
