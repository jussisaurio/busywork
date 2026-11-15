// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
// The switch: flip his office lights at the hallway panel, walk off to his door before he comes out, wait for him to
// pass on his way to the panel (route-checks.js waits for him; here, four seconds), then take it from his empty desk.
const FLIP = ['goto office_switch pretend', 'interact'];
const OUT = [...FLIP, 'goto boss_office_door', 'wait 4s'];
const TAKE_SWITCH = [...OUT, 'goto tray', 'goto tray', 'interact'];
// The blackout: pour the jug down the back of the machine from beside it (by the fridge, out of Kev's sight), back to
// your seat;
// at 3:10 Lin switches it on, it shorts (a stop), and its spark trips the fuse (another stop).
const RIG = ['goto 20,2 pretend', 'interact', 'goto my_seat'];
const SHORT = [...RIG, 'pretend until 3:11'];
const TRIP = [...SHORT, 'pretend 5s'];
// In any blackout the boss goes out to the fuse box with his phone torch: wait out of his way till he is there.
const TAKE_BLACKOUT = [...TRIP, 'wait 3s', 'goto desk_side pretend', 'goto desk_side pretend', 'wait 1s', 'interact'];
// The breaker: pull it, get clear of the box (he'd know it was you), and wait by Lin's desk till he is out at it.
const BREAKER_OUT = ['goto fuse_box pretend', 'interact', 'goto lin_desk pretend', 'wait 2s', 'wait 2s', 'wait 2s', 'wait 1s'];
const TAKE_BREAKER = [...BREAKER_OUT, 'goto desk_side pretend', 'goto desk_side pretend', 'interact'];
// Eat it: take it in the breaker's dark, step off your desk (at it, E is the drawer) and hold E: you chew, gag
// and spit it out.
const EAT = [...TAKE_BREAKER, 'goto my_seat pretend', 'goto my_seat pretend', 'move S 0.4s', 'eat'];
const SIT_TILL_3_41 = ['sit pretend', 'sit pretend', 'sit pretend', 'wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'];

export default [
  { name: 'start', cmds: [], intent: 'You at your desk on the open floor; the boss behind glass, sitting facing his desk, your white envelope lying in the wire tray right in front of him; the clock says 3:00.' },
  { name: 'tray', cmds: ['goto desk_side pretend'], intent: 'Up close: your letter in his tray within his reach, and he is looking straight at it and at you, so you cannot just take it in the light.' },
  { name: 'boss-sighs', cmds: ['wait until 3:01', 'wait 0.6s'], intent: 'The boss does no work: he looks at the tray in front of him and sighs (😮‍💨), shrugging, dreading it.' },
  { name: 'boss-drums', cmds: ['wait until 3:03'], intent: 'The boss drums his fingers on his desk, eyes on his tray: still not working.' },
  { name: 'boss-clock', cmds: ['wait until 3:05'], intent: 'The boss reaches for the little brass alarm clock on the end of his desk and checks it: a glint off its face, its hands just past 3:00.' },
  { name: 'tray-pulled', cmds: ['wait until 3:39', 'wait until 3:39', 'wait until 3:39', 'wait 0.3s'], intent: "3:39: the desk clock rings, the boss sighs and drags his tray over to go through it; your letter is still in it." },
  { name: 'switch', cmds: ['goto office_switch pretend'], intent: 'Out in the hallway, on the meeting-room wall well away from his glass office, a lighting panel of switches: you stand at it, outside his view.' },
  { name: 'fuse-box', cmds: ['goto fuse_box pretend', 'goto fuse_box pretend'], intent: 'A grey fuse box on the end wall of the hallway, door shut and green lamp on, around the corner where the boss cannot see it.' },
  { name: 'lin-coffee', cmds: ['wait until 3:05', 'wait 1s'], intent: 'At 3:05 Lin gets up from her desk thinking of coffee (☕) and heads for the old coffee machine in the kitchen.' },
  { name: 'switch-flipped', cmds: [...FLIP, 'move S 0.3s'], intent: 'You flipped a switch on the hallway panel and stepped off it: the panel shows an amber lamp and only his glass office down the hall has gone dark; the floor and the hallway stay lit.' },
  { name: 'boss-out', cmds: OUT, intent: 'The boss has left his dark office: he walks down the hallway with his phone toward the lighting panel, his back to you by his door; his desk and the tray sit unattended behind him.' },
  { name: 'boss-at-panel', cmds: [...OUT, 'wait 1.5s'], intent: 'The boss stands at the hallway panel trying one unlabelled switch after another (the panel lamp blinks), far from his office.' },
  { name: 'switch-take', cmds: [...TAKE_SWITCH, 'wait 0.5s'], intent: 'In his dark, empty office you stand at his desk with the envelope in your hand and the tray empty; he is still out in the hallway at the panel.' },
  { name: 'stash', cmds: [...TAKE_SWITCH, 'goto my_seat', 'goto my_seat', 'interact', 'wait 0.3s'], intent: 'Back at your own desk with the envelope, you slide it into your desk drawer and sit down: the drawer is open, the envelope going in.' },
  { name: 'stashed', cmds: [...TAKE_SWITCH, 'goto my_seat', 'goto my_seat', 'interact', 'wait 2s'], intent: 'The drawer is shut, a corner of your envelope sticking out of it; your hands are empty.' },
  { name: 'panel-finds-you', cmds: [...FLIP, 'wait 30s'], intent: 'If you stay at the panel, the boss comes out of his office to it and finds you standing there: he points at you (❗👉), a line from him to you.' },
  { name: 'flicker', cmds: ['pretend until 3:11', 'wait 0.4s'], intent: '3:10, nobody touched it: Lin switches on the old coffee machine and the lights all over the floor flicker; Lin startled, Kev at his desk turns to look down the hall at the fuse box. The lights steady and it brews, its green lamp blinking.' },
  { name: 'rig', cmds: [...RIG.slice(0, 2), 'wait 0.3s'], intent: 'Before 3:10 you stand beside the coffee machine, by the fridge, and pour the water jug down its back onto its wall socket: the jug stands empty, a dark wet streak shows behind the machine and nothing shows on its front. From his desk, Kev sees the front of the machine through the kitchen door, but not you here.' },
  { name: 'rig-seen', cmds: ['goto 21,2 pretend', 'interact'], intent: 'Try it from in front of the machine and Kev, at his desk, sees you through the kitchen door: he points you out to the boss, who sends you to your desk with a pile of work.' },
  { name: 'surge', cmds: [...SHORT, 'wait 0.6s'], intent: '3:10, after you soaked it: Lin switches the coffee machine on and it shorts with a burst of sparks and grey smoke; a spark runs out of the kitchen and along the wiring toward the fuse box at the end of the hallway.' },
  { name: 'blackout', cmds: [...TRIP, 'wait 0.3s'], intent: 'The spark reaches the fuse box: its door flies open with a blinking red lamp and the whole floor goes dark; everyone holds up a phone as a torch (the boss at his desk, Kev at his).' },
  { name: 'boss-goes-out', cmds: [...TRIP, 'wait 3s'], intent: 'In the blackout the boss gets up from his desk and walks out of his office with his phone torch, heading for the fuse box down the hallway; his desk and the tray are left behind in the dark.' },
  { name: 'blackout-take', cmds: TAKE_BLACKOUT, intent: 'In the blackout you stand at his empty desk in his dark office with the envelope in your hand; out in the hallway the boss holds his phone torch on the open fuse box.' },
  { name: 'breaker-pulled', cmds: ['goto fuse_box pretend', 'interact', 'wait 1s'], intent: 'You pulled the breaker yourself: the fuse box door hangs open with its red lamp blinking, and the whole floor goes dark with phones up.' },
  { name: 'boss-at-box', cmds: [...BREAKER_OUT, 'goto desk_side pretend', 'goto desk_side pretend'], intent: 'The boss stands at the open fuse box holding his phone torch on it while Kev works at the breakers; you are at the boss\'s empty desk in his dark office, the envelope in the tray in front of you.' },
  { name: 'boss-finds-you', cmds: ['goto fuse_box pretend', 'interact', 'wait 2s', 'wait 2s', 'wait 2s', 'wait 1s'], beat: true, intent: 'If you hang about at the fuse box you pulled, the boss comes round the corner with his torch and finds you standing at it: he points at you (❗👉), a line from him to you.' },
  { name: 'spat', cmds: [...EAT, 'wait 1s'], intent: 'You chewed up your letter, gagged (🤢) and spat it out: a soggy grey wad of chewed paper lies on the floor at your feet, nothing on it readable; your hands are empty.' },
  { name: 'end-switch', cmds: [...TAKE_SWITCH, ...SIT_TILL_3_41], intent: 'Win by the switch, 3:40 with the lights on: he holds up his empty tray, baffled, glancing out through the glass at the hallway lighting panel; you stand at your desk outside his glass office, smug, the envelope in your hand.' },
  { name: 'end-blackout', cmds: [...TAKE_BLACKOUT, ...SIT_TILL_3_41], intent: 'Win by the blackout, 3:40 with the lights on: he holds up his empty tray, baffled; you at your desk with the envelope; behind you the coffee machine you soaked, scorched black up the wall, a wet streak behind it, the water jug empty beside it.' },
  { name: 'end-breaker', cmds: [...TAKE_BREAKER, ...SIT_TILL_3_41], intent: 'Win by the breaker, 3:40 with the lights on: he holds up his empty tray, baffled; you at your desk with the envelope; behind you the fuse box, shut again.' },
  { name: 'end-fail', cmds: ['wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'], intent: 'Loss at 3:40: he went through his tray, read your letter and holds it up, furious; you stand in front of his desk, sweating.' },
  { name: 'end-deskwork', cmds: ['goto 21,2 pretend', 'interact', 'wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'], intent: 'Loss at 3:40 after Kev saw you tip water into the coffee machine and told on you: the boss holds your letter up, furious; you sit at your desk behind a tall pile of paperwork. Icons: Kev, pointing, paperwork, the letter.' },
  { name: 'end-eaten', cmds: [...EAT, 'wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'], intent: 'Win, the letter chewed up and spat out as pulp: at 3:40 he holds up his empty tray, baffled; you sit at your desk outside his glass office, still green in the face.' },
  { name: 'end-caught', cmds: ['goto desk_side pretend', 'interact', 'wait 5s', 'wait 5s'], intent: 'Loss: you took the letter while he could see you; the lights on, he points at you holding it beside his desk.' },
  { name: 'end-panel', cmds: [...FLIP, 'wait 30s', 'wait 5s', 'wait 5s'], intent: 'Loss: out in the lit hallway he found you at the lighting panel, its switch still off: he points at you, sweating.' },
  { name: 'coffee-poured', cmds: ['wait until 3:20', 'wait until 3:20', 'wait until 3:20', 'goto coffee_machine', 'interact', 'move S 1.2s'], intent: 'Nobody soaked it, so the coffee machine brewed after its flicker: its lamp glows green, the pot is full and steaming, and you hold a cup you just poured.' },
];
