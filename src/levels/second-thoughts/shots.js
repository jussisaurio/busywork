// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
const TAKE_SWITCH = ['goto office_switch pretend', 'interact', 'goto tray', 'interact'];
const TAKE_BLACKOUT = ['pretend until 3:11', 'goto desk_side pretend', 'interact'];
const TAKE_BREAKER = ['goto fuse_box pretend', 'interact', 'goto desk_side pretend', 'interact'];
const SIT_TILL_3_41 = ['sit pretend', 'sit pretend', 'sit pretend', 'wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'];

export default [
  { name: 'start', cmds: [], intent: 'You at your desk on the open floor; the boss behind glass, sitting facing his desk, your white envelope lying in the wire tray right in front of him; the clock says 3:00.' },
  { name: 'tray', cmds: ['goto desk_side pretend'], intent: 'Up close: your letter in his tray within his reach, and he is looking straight at it and at you, so you cannot just take it in the light.' },
  { name: 'switch', cmds: ['goto office_switch pretend'], intent: 'His office has its own light switch, on its west wall: you stand at it, lights on.' },
  { name: 'fuse-box', cmds: ['goto fuse_box', 'goto fuse_box'], intent: 'A grey fuse box on the end wall of the hallway, door shut and green lamp on, around the corner where the boss cannot see it.' },
  { name: 'lin-coffee', cmds: ['wait until 3:08'], intent: 'Lin leaves her desk for the old coffee machine in the kitchen.' },
  { name: 'switch-flipped', cmds: ['goto office_switch pretend', 'interact', 'wait 1s'], intent: 'You flipped the switch: only his office is dark, the switch shows an amber lamp, and the boss in the dark is puzzled.' },
  { name: 'boss-gropes', cmds: ['goto office_switch pretend', 'interact', 'goto tray', 'wait 1.5s'], intent: 'The boss has left his desk and feels his way along the dark wall toward the switch; you stand at his tray in the dark.' },
  { name: 'switch-take', cmds: [...TAKE_SWITCH, 'goto desk_side pretend'], intent: 'The tray is empty and the envelope is in your hand at the end of his desk while he is still groping for the switch.' },
  { name: 'boss-bumps', cmds: ['goto office_switch pretend', 'interact', 'wait 30s'], intent: 'If you stay at the switch, the boss groping along the wall walks right into you: in the dark, whoever is at the switch flipped it.' },
  { name: 'blackout', cmds: ['pretend until 3:11', 'wait 0.3s'], intent: '3:10: Lin switches on the coffee machine, it sparks and smokes, and the whole floor goes dark; everyone holds up a phone as a torch, and the fuse box down the hall hangs open with a blinking red lamp.' },
  { name: 'blackout-take', cmds: TAKE_BLACKOUT, intent: 'In the blackout you take the letter from the dark end of his desk; his phone beam lies on the front of the desk, not on you.' },
  { name: 'breaker-pulled', cmds: ['goto fuse_box pretend', 'interact', 'wait 1s'], intent: 'You pulled the breaker yourself: the fuse box door hangs open with its red lamp blinking, and the whole floor goes dark with phones up.' },
  { name: 'kev-comes', cmds: ['goto fuse_box pretend', 'interact', 'goto desk_side pretend', 'wait 6s'], intent: 'Kev walks his phone torch down the hallway to the open fuse box to reset it; you are already at the boss\'s desk, out of his way.' },
  { name: 'kev-finds-you', cmds: ['goto fuse_box pretend', 'interact', 'wait 5m'], intent: 'If you wait at the fuse box, Kev arrives with his torch and finds you standing at it: he will tell the boss you pulled it.' },
  { name: 'end-switch', cmds: [...TAKE_SWITCH, ...SIT_TILL_3_41], intent: 'Win by the switch: his light back on, his hand on the switch, fuming; his tray empty; you smug with the envelope.' },
  { name: 'end-blackout', cmds: [...TAKE_BLACKOUT, ...SIT_TILL_3_41], intent: 'Win by the blackout: Lin\'s coffee machine still sparking, the room dark, his torch on the front of his desk, his tray empty, you with the envelope just outside the beam.' },
  { name: 'end-breaker', cmds: [...TAKE_BREAKER, ...SIT_TILL_3_41], intent: 'Win by the breaker: Kev at the open fuse box by his torch, his tray empty, you with the envelope outside the boss\'s beam.' },
  { name: 'end-fail', cmds: ['wait until 3:41', 'wait until 3:41', 'wait until 3:41', 'wait 10s', 'wait 10s'], intent: 'Loss at 3:40: he emptied his tray, read your letter and holds it up, furious; you stand there holding a cardboard box of your things.' },
  { name: 'end-caught', cmds: ['goto desk_side pretend', 'interact', 'wait 5s', 'wait 5s'], intent: 'Loss: you took the letter while he could see you; he points at you holding it beside his tray.' },
  { name: 'end-bumped', cmds: ['goto office_switch pretend', 'interact', 'wait 30s', 'wait 5s', 'wait 5s'], intent: 'Loss: in his dark office his groping hand landed on you right under the switch, and your letter is still in his tray.' },
];
