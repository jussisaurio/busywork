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
const LET_IN = [...KEYCARD, 'busy 0.42s', 'interact', 'goto meeting_seat busy', 'busy until 3:49', 'goto fire_door busy',
  'interact']; // the keycard taken, the boss locked out, and you push the door open for him

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
  // ---- The plain fails with a cause (end-scenes-fails.js; verdict.js verdictFull), one block.
  {
    name: 'end-fail-sip',
    cmds: [...POUR, 'sit busy', 'busy until 4:00', 'wait 8s'],
    intent: 'End card, a loss: no slides, and you had the day\'s last cup of coffee in your hand. Up front by the ' +
      'blank screen you held up one finger (☝️) and are now drinking it, tipped right back, while the boss and Lin ' +
      'wait (😐).',
  },
  {
    name: 'end-fail-call',
    cmds: ['goto kitchen_table busy', 'busy until 4:00', 'wait 8s'],
    intent: 'End card, a loss: no slides, and you were pretending to be on the phone when 4:00 came. Up front by ' +
      'the blank screen you keep the call going, phone at your ear, one finger up at the room (☝️📱: one sec). The ' +
      'boss taps his wrist (⌚), then gets cross.',
  },
  {
    name: 'end-fail-puppets',
    cmds: ['goto meeting_seat busy', 'busy until 3:59', 'wait until 4:00', 'wait 8s'],
    intent: 'End card, a loss: no slides, and you were already in the meeting room. You stand in the projector beam, ' +
      'back to us, hands up, and your shadow on the white screen is a duck, its beak opening and shutting. The boss ' +
      'stares (😐); Lin covers her mouth, trying not to laugh (🤭).',
  },
  {
    name: 'fire-door-push',
    cmds: ['goto fire_door', 'interact', 'wait 0.3s'],
    intent: 'You stand at the fire door in the lobby corner, arms out, pushing its bar. It opens a crack (daylight in ' +
      'the gap) and the card reader by the handle blinks red: the held-door alarm, with a buzz you cannot see. You ' +
      'let it swing shut. The balcony is outside, behind it.',
  },
  {
    name: 'boss-let-in',
    cmds: [...LET_IN, 'busy until 4:00', 'busy 0.2s'],
    intent: 'The boss was locked out on the balcony. You pushed the fire door open for him (it stands open, daylight ' +
      'in the doorway), and he has come through and thrown his arms round you, overjoyed (🤗). The keycard in your ' +
      'hand is his.',
  },
  {
    name: 'end-samaritan-caught',
    cmds: [...LET_IN, 'busy until 4:00', 'wait 8s'],
    intent: 'End card, a loss: you let him in, he hugged you and saw his keycard in your hand. Now it is the other way ' +
      'round: you are locked out on the balcony pounding the fire door, and inside the boss dangles his card at you, ' +
      'smug, then waves bye.',
  },
  {
    name: 'end-samaritan',
    cmds: [...KEYCARD, 'busy 0.42s', 'interact', 'goto meeting_seat busy', 'busy until 3:49', 'interact', 'goto fire_door busy',
      'interact', 'busy until 4:00', 'busy until 4:00'],
    intent: 'End card, a loss: you let the locked-out boss in without his card on you. He is so grateful he stands at ' +
      'the blank screen with his arm round your shoulder, beaming (🤗, then 👏 at you). No slides; the cricket hops.',
  },
  {
    name: 'go-home',
    cmds: ['goto exit pretend', 'pretend until 3:03', 'interact'],
    beat: 0.9, // walking out
    intent: 'You give up and go home: through the glass entrance into the lobby, towards the elevator. Kev, who leaves ' +
      'at 3:00 every day, is right behind you: you both wave (👋, 👋😄).',
  },
  {
    name: 'end-home',
    cmds: ['goto exit', 'interact', 'wait 8s'],
    intent: 'End card, a loss: you just went home. You sit on the bus by the window, the town sliding past, relieved ' +
      '(😌); then the phone in your lap buzzes and buzzes, the boss\'s angry face on its screen (😬).',
  },
  {
    name: 'end-home-kev',
    cmds: ['goto exit pretend', 'pretend until 3:03', 'interact', 'wait 8s'],
    intent: 'End card, a loss: you went home with Kev at 3:00. You sit side by side on the bus; Kev is untroubled (😌), ' +
      'while the phone in your lap buzzes with the boss\'s angry face on it (😬).',
  },
  {
    name: 'knock-boss',
    cmds: ['goto restroom_door', 'pretend until 3:19', 'interact', 'wait 0.6s'],
    intent: 'The restroom is taken (the boss, 3:18): you knock on its door, and he answers through it, cross (🚽😠 and ' +
      'his face).',
  },
  {
    name: 'kev-mustard',
    cmds: ['goto fridge pretend', 'interact', 'eat', 'goto kev_desk', 'wait 0.8s'],
    intent: 'You ate Lin\'s sandwich and the mustard is down your front. Kev, near you, points at his own chest and at ' +
      'the restroom (👕🟡👉🚽).',
  },
  {
    name: 'restroom-wash',
    cmds: ['goto fridge', 'interact', 'eat', 'goto restroom_door', 'interact', 'interact', 'wait 0.5s'],
    intent: 'You went into the restroom (you vanish: nobody can see you in there) and washed the mustard off at the ' +
      'sink (🧼😌 over the door).',
  },
  {
    name: 'picture-tilt',
    cmds: ['goto picture', 'interact', 'wait 1s'],
    intent: 'The picture war, 1: you knock the hallway picture by the kitchen door crooked; it hangs askew on its nail.',
  },
  {
    name: 'picture-kev',
    cmds: ['goto picture', 'interact', 'goto my_desk_spot', 'pretend until 2:39.3'],
    intent: 'The picture war, 2: Kev, on his coffee run, has stepped out of his way to stand right under the crooked ' +
      'picture, and reaches up to it, scowling (😒), to tilt it the other way.',
  },
  {
    name: 'picture-lin',
    cmds: ['goto picture', 'interact', 'goto my_desk_spot', 'pretend until 3:03.3'],
    intent: 'The picture war, 3: Lin, on her way to the fridge, has stepped over to stand right under it, and ' +
      'reaches up, cross (😤), to straighten it.',
  },
  // Typing on any keyboard (toys.js type_*): a toy, not a way to look busy.
  {
    name: 'type-lin',
    cmds: ['pretend until 2:59', 'goto lin_desk busy', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.2s'],
    intent: 'Typing on someone else\'s keyboard: Lin is off to the fridge, and you stand at her desk (left, the teal ' +
      'chair) mashing her keyboard. Her screen shows a white document filling with lines of gibberish.',
  },
  {
    name: 'type-lin-sees',
    cmds: ['pretend until 3:06', 'goto lin_desk busy', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact',
      'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.3s'],
    intent: 'Lin, coming back along the hallway, sees you at her keyboard: she points at you, cross (😠⌨️).',
  },
  {
    name: 'type-lin-reads',
    cmds: ['pretend until 2:59', 'goto lin_desk busy', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot busy',
      'pretend until 3:12.5'],
    intent: 'Lin sits down at her desk and finds your gibberish on her screen: 😳⌨️. You sit at your desk.',
  },
  {
    name: 'type-lin-wipes',
    cmds: ['pretend until 2:59', 'goto lin_desk busy', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot busy',
      'pretend until 3:13.6'],
    intent: 'Lin hammers delete, cross (😤): her screen is her own grid again.',
  },
  {
    name: 'type-kev-reads',
    cmds: ['pretend until 2:40', 'goto type_kev busy', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot busy',
      'pretend until 2:46.5'],
    intent: 'Kev, back with his coffee, sits down and reads the gibberish you typed on his screen, and nods: 🤔👍. ' +
      'It stays there, under his code.',
  },
  // The hallway clock pushed fast (toys.js clock_*), The Last Bus's clock: drawn only, nobody acts on it.
  {
    name: 'clock-pushed',
    cmds: ['goto clock pretend', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'wait 0.8s'],
    intent: 'You have pushed the hallway clock on half an hour: it hangs crooked, a red wedge where the minutes ' +
      'jumped. Kev, at his desk, looks up at it, hopeful, then at his watch: 🤩🕔⌚😞.',
  },
  {
    name: 'clock-lin',
    cmds: ['goto clock pretend', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot', 'pretend until 3:01.4'],
    intent: 'Lin, on her way down the hallway, glances up at the fast clock and panics, then checks her watch and ' +
      'scowls: 😱🕔⌚😒.',
  },
  {
    name: 'clock-boss',
    cmds: ['goto clock pretend', 'interact', 'wait 0.6s', 'interact', 'wait 0.6s', 'interact', 'goto my_desk_spot', 'pretend until 3:24.5'],
    intent: 'The boss, passing, has stepped over under the crooked clock and reaches up to set it right, with a ' +
      'look (🤨).',
  },
  {
    name: 'end-restroom',
    cmds: ['goto coffee_machine busy', 'interact', 'sit busy', 'busy until 3:10', 'goto projector busy', 'interact',
      'put coffee busy', 'goto restroom_door busy', 'busy until 3:40', 'interact', 'busy until 4:00', 'wait 8s'],
    intent: 'End card, blamed: the projector died, but at 4:00 you were in the restroom. The table stares at your ' +
      'empty chair in its pool of light; then you walk in from the right, wiping your wet hands on your trousers (🚽🙂).',
  },
  {
    name: 'end-caught',
    cmds: ['pretend until 3:18', 'goto coat_rack pretend', 'wait until 3:26.6', 'interact'], // he walks back in from the restroom (🤨) as you reach
    intent: 'End card, a loss: the boss caught you at his jacket, reaching for his keycard (😠🪪). The card is on his ' +
      'pocket, and you are fired, carrying your things out in a box.',
  },
  {
    name: 'end-blamed-chair',
    cmds: [...SPILL, 'put coffee busy', 'busy until 4:00'],
    intent: 'End card, a loss: the meeting fell apart, but you were the only one not in the meeting room, so everyone ' +
      'points at your empty chair: blamed.',
  },
  {
    name: 'end-where-desk',
    cmds: [...SPILL, 'put coffee busy', 'sit busy', 'busy until 4:00', 'wait 8s'],
    intent: 'End card, blamed ("where were you?"): the projector died, and at 4:00 you were at your own desk, typing. ' +
      'You sit in the foreground hammering at the keyboard (⌨️💨); behind you, crowded in the meeting-room doorway, ' +
      'the boss, Lin and Kev stare at the one person in the office working (🪑❓, then 👀⌨️❓).',
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
  {
    name: 'typewriter-bang',
    cmds: [...POUR, 'goto typewriter busy', 'interact'],
    beat: 0.5,
    intent: 'You stand at the empty desk behind yours: you just poured the coffee into its typewriter. The screen is ' +
      'dead and cracked, coffee pools on the keys and drips off the desk, smoke rises and sparks fly. The boss, in his ' +
      'office, heard the bang: he points at you (⌨️💥👉 and your face).',
  },
  {
    name: 'end-typewriter',
    cmds: [...POUR, 'goto typewriter busy', 'interact'],
    intent: 'End card, a loss: the typewriter you poured the coffee into sparks, smokes and drips on its desk. You ' +
      'stand beside it blackened with soot, hair on end. The boss points at it, then holds out an empty box for your ' +
      'things: fired.',
  },
  {
    name: 'end-campfire',
    cmds: ['goto coffee_machine busy', 'interact', 'sit busy', 'busy until 3:06', 'goto projector', 'interact', 'put coffee',
      'goto my_seat busy', 'sit busy', 'busy until 3:18.75', 'goto coat_rack', 'busy until 3:21.6', 'interact',
      'goto meeting_seat busy', 'busy until 4:00', 'busy until 4:00', 'busy until 4:00'],
    intent: 'End card, a win by both routes at once: the projector is dead and the boss is locked out on the balcony. ' +
      'The meeting room with the lights down, lit orange by the smoking projector on the table. You and Lin stand at ' +
      'the table and warm your hands at it (😌); she toasts a marshmallow over it on a straightened paperclip, and it ' +
      'browns (😋).',
  },
  {
    name: 'end-bib',
    cmds: ['busy until 2:47', 'goto fridge busy', 'interact', 'eat', 'goto my_seat busy', 'sit', 'busy until 4:00', 'busy until 4:00', 'busy until 4:00'],
    intent: 'End card, a loss: you ate Lin\'s sandwich and she saw the mustard on you. You sit typing at your desk in a ' +
      'giant white paper bib tied round your neck, a blob of mustard already on it. Lin stands at your elbow eating a ' +
      'fresh sandwich, slowly, staring at you (👀 and your face, then 😋). Now and then you glance at it (🥪🥺).',
  },
  {
    name: 'kev-dozing',
    cmds: [...POUR, ...HIDE, 'sit busy', 'busy until 2:53.4'],
    intent: 'Kev (olive hoodie, right) never got his afternoon coffee: you poured the last cup, and it sits on your ' +
      'desk. He has nodded off at his desk, his head down on the keyboard (💤), and on his screen a line of the same ' +
      'letter runs across under his code. You type at your desk.',
  },
];
