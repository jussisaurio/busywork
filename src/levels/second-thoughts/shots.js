// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
// The switch: flip it, step into the shadow under his plants while his beam swings east, then take it while he is
// at the switch (route-checks.js waits for him to set off; here, half a second).
const FLIP = ['goto office_switch pretend', 'interact'];
const TAKE_SWITCH = [...FLIP, 'goto 1,4', 'goto 1,4', 'wait 0.5s', 'goto tray', 'goto tray', 'interact'];
const TAKE_BLACKOUT = ['pretend until 3:11', 'goto desk_side pretend', 'interact'];
const TAKE_BREAKER = ['goto fuse_box pretend', 'interact', 'goto desk_side pretend', 'interact'];
const SIT_TILL_3_41 = ['sit pretend', 'sit pretend', 'sit pretend', 'wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'];

export default [
  { name: 'start', cmds: [], intent: 'You at your desk on the open floor; the boss behind glass, sitting facing his desk, your white envelope lying in the wire tray right in front of him; the clock says 3:00.' },
  { name: 'tray', cmds: ['goto desk_side pretend'], intent: 'Up close: your letter in his tray within his reach, and he is looking straight at it and at you, so you cannot just take it in the light.' },
  { name: 'switch', cmds: ['goto office_switch pretend'], intent: 'His office has its own light switch, in the corner behind his chair: you stand at it, lights on, behind his back and outside his view.' },
  { name: 'fuse-box', cmds: ['goto fuse_box pretend', 'goto fuse_box pretend'], intent: 'A grey fuse box on the end wall of the hallway, door shut and green lamp on, around the corner where the boss cannot see it.' },
  { name: 'lin-coffee', cmds: ['wait until 3:08'], intent: 'Lin leaves her desk for the old coffee machine in the kitchen.' },
  { name: 'switch-flipped', cmds: [...FLIP, 'wait 0.3s'], intent: 'You flipped the switch: only his office is dark, the switch shows an amber lamp, and the boss, puzzled, holds up his phone: its beam starts at the glow in his hand.' },
  { name: 'in-shadow', cmds: [...FLIP, 'goto 1,4', 'goto 1,4'], intent: 'You wait in the dark under his plants, just outside the edge of his phone beam, which points down past his desk as he gets up.' },
  { name: 'boss-sweeps', cmds: [...FLIP, 'goto 1,4', 'goto 1,4', 'wait 0.25s'], intent: 'As he gets up and turns for the switch, his beam swings across the east half of his office, away from you in the shadow.' },
  { name: 'switch-take', cmds: TAKE_SWITCH, intent: 'The tray is empty and the envelope is in your hand at his desk, in the dark, while he stands at the switch in the corner with his beam on it and the tubes blink.' },
  { name: 'torch-finds-you', cmds: [...FLIP, 'wait 30s'], intent: 'If you stay at the switch, the boss walks his phone torch over to it and its beam lands on you: in his dark office, whoever is at the switch flipped it.' },
  { name: 'blackout', cmds: ['pretend until 3:11', 'wait 0.3s'], intent: '3:10: Lin switches on the coffee machine, it sparks and smokes, and the whole floor goes dark; everyone holds up a phone as a torch (the boss at his desk, Kev at his), and the fuse box down the hall hangs open with a blinking red lamp.' },
  { name: 'kev-walks', cmds: ['pretend until 3:11', 'wait 3s'], intent: 'In the blackout the boss stays in his chair, sweeping his torch over the front of his desk, while Kev walks his torch down the hallway to the fuse box.' },
  { name: 'blackout-take', cmds: TAKE_BLACKOUT, intent: 'In the blackout you take the letter from the dark end of his desk; his phone beam lies on the front of the desk, not on you.' },
  { name: 'breaker-pulled', cmds: ['goto fuse_box pretend', 'interact', 'wait 1s'], intent: 'You pulled the breaker yourself: the fuse box door hangs open with its red lamp blinking, and the whole floor goes dark with phones up.' },
  { name: 'kev-comes', cmds: ['goto fuse_box pretend', 'interact', 'goto desk_side pretend', 'wait 6s'], intent: 'Kev walks his phone torch down the hallway to the open fuse box to reset it; you are already at the boss\'s desk, out of his way.' },
  { name: 'kev-finds-you', cmds: ['goto fuse_box pretend', 'interact', 'wait 5m'], intent: 'If you wait at the fuse box, Kev arrives with his torch and finds you standing at it: he will tell the boss you pulled it.' },
  { name: 'end-switch', cmds: [...TAKE_SWITCH, ...SIT_TILL_3_41], intent: 'Win by the switch, 3:40 with the lights on: he holds up his empty tray, baffled, glancing at the switch behind him; you stand at your desk outside his glass office, smug, the envelope in your hand.' },
  { name: 'end-blackout', cmds: [...TAKE_BLACKOUT, ...SIT_TILL_3_41], intent: 'Win by the blackout, 3:40 with the lights on: he holds up his empty tray, baffled; you at your desk with the envelope; behind you the coffee machine that blew the fuse, its brew lamp green.' },
  { name: 'end-breaker', cmds: [...TAKE_BREAKER, ...SIT_TILL_3_41], intent: 'Win by the breaker, 3:40 with the lights on: he holds up his empty tray, baffled; you at your desk with the envelope; behind you the fuse box, shut again.' },
  { name: 'end-fail', cmds: ['wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'], intent: 'Loss at 3:40: he went through his tray, read your letter and holds it up, furious; you stand in front of his desk, sweating.' },
  { name: 'end-caught', cmds: ['goto desk_side pretend', 'interact', 'wait 5s', 'wait 5s'], intent: 'Loss: you took the letter while he could see you; the lights on, he points at you holding it beside his desk.' },
  { name: 'end-torch', cmds: [...FLIP, 'wait 30s', 'wait 5s', 'wait 5s'], intent: 'Loss: in his dark office his phone torch is on you right under the switch, and your letter is still in his tray.' },
];
