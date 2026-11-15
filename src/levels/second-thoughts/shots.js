// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
// The switch: flip it, step into the shadow under his plants while his beam swings east, then take it while he is
// at the switch (route-checks.js waits for him to set off; here, half a second).
const FLIP = ['goto office_switch pretend', 'interact'];
const TAKE_SWITCH = [...FLIP, 'goto 1,4', 'goto 1,4', 'wait 0.5s', 'goto tray', 'goto tray', 'interact'];
// The blackout: tip the jug over the machine from beside it (by the fridge, out of Kev's sight), back to your seat;
// at 3:10 Lin switches it on, it shorts (a stop), and its spark trips the fuse (another stop).
const RIG = ['goto 20,2 pretend', 'interact', 'goto my_seat'];
const SHORT = [...RIG, 'pretend until 3:11'];
const TRIP = [...SHORT, 'pretend 5s'];
const TAKE_BLACKOUT = [...TRIP, 'goto desk_side pretend', 'goto desk_side pretend', 'interact'];
const TAKE_BREAKER = ['goto fuse_box pretend', 'interact', 'goto desk_side pretend', 'interact'];
const SIT_TILL_3_41 = ['sit pretend', 'sit pretend', 'sit pretend', 'wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'];

export default [
  { name: 'start', cmds: [], intent: 'You at your desk on the open floor; the boss behind glass, sitting facing his desk, your white envelope lying in the wire tray right in front of him; the clock says 3:00.' },
  { name: 'tray', cmds: ['goto desk_side pretend'], intent: 'Up close: your letter in his tray within his reach, and he is looking straight at it and at you, so you cannot just take it in the light.' },
  { name: 'boss-sighs', cmds: ['wait until 3:01', 'wait 0.6s'], intent: 'The boss does no work: he looks at the tray in front of him and sighs (😮‍💨), shrugging, dreading it.' },
  { name: 'boss-drums', cmds: ['wait until 3:03'], intent: 'The boss drums his fingers on his desk, eyes on his tray: still not working.' },
  { name: 'boss-clock', cmds: ['wait until 3:05'], intent: 'The boss reaches for the little brass alarm clock on the end of his desk and checks it: a glint off its face, its hands just past 3:00.' },
  { name: 'tray-pulled', cmds: ['wait until 3:39', 'wait until 3:39', 'wait until 3:39', 'wait 0.3s'], intent: "3:39: the desk clock rings, the boss sighs and drags his tray over to go through it; your letter is still in it." },
  { name: 'switch', cmds: ['goto office_switch pretend'], intent: 'His office has its own light switch, in the corner behind his chair: you stand at it, lights on, behind his back and outside his view.' },
  { name: 'fuse-box', cmds: ['goto fuse_box pretend', 'goto fuse_box pretend'], intent: 'A grey fuse box on the end wall of the hallway, door shut and green lamp on, around the corner where the boss cannot see it.' },
  { name: 'lin-coffee', cmds: ['wait until 3:05', 'wait 1s'], intent: 'At 3:05 Lin gets up from her desk thinking of coffee (☕) and heads for the old coffee machine in the kitchen.' },
  { name: 'switch-flipped', cmds: [...FLIP, 'move S 0.3s'], intent: 'You flipped the switch and stepped off it: only his office is dark, the switch shows an amber lamp, and the boss, puzzled, holds up his phone: its beam starts at the glow in his hand.' },
  { name: 'in-shadow', cmds: [...FLIP, 'goto 1,4', 'goto 1,4'], intent: 'You wait in the dark under his plants, just outside the edge of his phone beam, which points down past his desk as he gets up.' },
  { name: 'boss-sweeps', cmds: [...FLIP, 'goto 1,4', 'goto 1,4', 'wait 0.7s'], intent: 'As he gets up and turns for the switch, his beam swings across the east half of his office, away from you in the shadow.' },
  { name: 'switch-take', cmds: [...TAKE_SWITCH, 'wait 0.5s'], intent: 'The tray is empty and the envelope is in your hand at his desk while he stands at the switch in the corner, his beam on it, and his office tubes blink on for a moment.' },
  { name: 'stash', cmds: [...TAKE_SWITCH, 'goto my_seat', 'goto my_seat', 'interact', 'wait 0.3s'], intent: 'Back at your own desk with the envelope, you slide it into your desk drawer and sit down: the drawer is open, the envelope going in.' },
  { name: 'stashed', cmds: [...TAKE_SWITCH, 'goto my_seat', 'goto my_seat', 'interact', 'wait 2s'], intent: 'The drawer is shut, a corner of your envelope sticking out of it; your hands are empty.' },
  { name: 'torch-finds-you', cmds: [...FLIP, 'wait 30s'], intent: 'If you stay at the switch, the boss walks his phone torch over to it and its beam lands on you: in his dark office, whoever is at the switch flipped it.' },
  { name: 'flicker', cmds: ['pretend until 3:11', 'wait 0.4s'], intent: '3:10, nobody touched it: Lin switches on the old coffee machine and the lights all over the floor flicker; Lin startled, Kev at his desk turns to look down the hall at the fuse box. The lights steady and it brews, its green lamp blinking.' },
  { name: 'rig', cmds: [...RIG.slice(0, 2), 'wait 0.3s'], intent: 'Before 3:10 you stand beside the coffee machine, by the fridge, and tip the water jug over it: water runs down its front into a puddle, the jug on its side. From his desk, Kev sees the front of the machine through the kitchen door, but not you here.' },
  { name: 'rig-seen', cmds: ['goto 21,2 pretend', 'interact'], intent: 'Try it from in front of the machine and Kev, at his desk, sees you through the kitchen door: he points you out to the boss, who sends you to your desk with a pile of work.' },
  { name: 'surge', cmds: [...SHORT, 'wait 0.6s'], intent: '3:10, after you soaked it: Lin switches the coffee machine on and it shorts with a burst of sparks and grey smoke; a spark runs out of the kitchen and along the wiring toward the fuse box at the end of the hallway.' },
  { name: 'blackout', cmds: [...TRIP, 'wait 0.3s'], intent: 'The spark reaches the fuse box: its door flies open with a blinking red lamp and the whole floor goes dark; everyone holds up a phone as a torch (the boss at his desk, Kev at his).' },
  { name: 'kev-walks', cmds: [...TRIP, 'wait 3s'], intent: 'In the blackout the boss stays in his chair, his phone torch resting on his hallway door (the front of his desk lit, its side and the side door dark), while Kev walks his torch down the hallway to the fuse box.' },
  { name: 'blackout-take', cmds: TAKE_BLACKOUT, intent: 'In the blackout you take the letter from the dark side of his desk, by the side door; his phone beam lies across the front of the desk to his hallway door, not on you.' },
  { name: 'breaker-pulled', cmds: ['goto fuse_box pretend', 'interact', 'wait 1s'], intent: 'You pulled the breaker yourself: the fuse box door hangs open with its red lamp blinking, and the whole floor goes dark with phones up.' },
  { name: 'kev-comes', cmds: ['goto fuse_box pretend', 'interact', 'goto desk_side pretend', 'wait 6s'], intent: 'Kev walks his phone torch down the hallway to the open fuse box to reset it; you are already at the boss\'s desk, out of his way.' },
  { name: 'kev-finds-you', cmds: ['goto fuse_box pretend', 'interact', 'wait 8s', 'wait 0.5s'], intent: 'If you wait at the fuse box, Kev arrives with his torch and finds you standing at it: he shouts and points at you (❗👉), a line from him to you.' },
  { name: 'end-switch', cmds: [...TAKE_SWITCH, ...SIT_TILL_3_41], intent: 'Win by the switch, 3:40 with the lights on: he holds up his empty tray, baffled, glancing at the switch behind him; you stand at your desk outside his glass office, smug, the envelope in your hand.' },
  { name: 'end-blackout', cmds: [...TAKE_BLACKOUT, ...SIT_TILL_3_41], intent: 'Win by the blackout, 3:40 with the lights on: he holds up his empty tray, baffled; you at your desk with the envelope; behind you the coffee machine you soaked, scorched black up the wall, the jug on its side in a puddle.' },
  { name: 'end-breaker', cmds: [...TAKE_BREAKER, ...SIT_TILL_3_41], intent: 'Win by the breaker, 3:40 with the lights on: he holds up his empty tray, baffled; you at your desk with the envelope; behind you the fuse box, shut again.' },
  { name: 'end-fail', cmds: ['wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'], intent: 'Loss at 3:40: he went through his tray, read your letter and holds it up, furious; you stand in front of his desk, sweating.' },
  { name: 'end-deskwork', cmds: ['goto fuse_box pretend', 'interact', 'wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'], intent: 'Loss at 3:40 after Kev told on you: the boss holds your letter up, furious; you sit at your desk behind a tall pile of paperwork. Icons: Kev, pointing, paperwork, the letter.' },
  { name: 'end-caught', cmds: ['goto desk_side pretend', 'interact', 'wait 5s', 'wait 5s'], intent: 'Loss: you took the letter while he could see you; the lights on, he points at you holding it beside his desk.' },
  { name: 'end-torch', cmds: [...FLIP, 'wait 30s', 'wait 5s', 'wait 5s'], intent: 'Loss: in his dark office his phone torch is on you right under the switch, and your letter is still in his tray.' },
  { name: 'coffee-poured', cmds: ['wait until 3:20', 'wait until 3:20', 'wait until 3:20', 'goto coffee_machine', 'interact', 'move S 1.2s'], intent: 'Nobody soaked it, so the coffee machine brewed after its flicker: its lamp glows green, the pot is full and steaming, and you hold a cup you just poured.' },
];
