// What the fuzzer and the gate know about Second Thoughts (src/levels/meeting/gate.js documents the fields).
export default {
  mustUse: [{ id: 'dark', event: 'letter:snatched' }], // the letter only ever leaves the tray in the dark
  targets: ['tray', 'office_switch', 'fuse_box', 'desk_side', 'boss_desk', 'boss_office_door', 'lin_desk', 'kev_desk', 'coffee_machine', 'kitchen_table'],
  interactable: ['tray', 'office_switch', 'fuse_box', 'coffee_machine'],
  milestones: {
    'switch:off': () => 'switchOff',
    'fuse:pulled': () => 'breaker',
    'coffee:rigged': () => 'rigged',
    'fuse:tripped': () => 'blackout',
    'fuse:fixed': () => 'fixed',
    'letter:taken': (p) => (p?.how === 'light' ? 'takenLit' : 'taken'),
    'letter:eaten': () => 'ate',
    'letter:recovered': () => 'recovered',
    'witness:tattle': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['switchOff', 'rigged', 'breaker', 'taken', 'takenLit', 'ate', 'recovered', 'work', 'caught'],
  keyActions: ['switchOff', 'rigged', 'breaker', 'taken'],
  renderEvents: ['switch:off', 'coffee:rigged', 'coffee:shorted', 'fuse:tripped', 'fuse:pulled', 'boss:dark', 'fuse:fixed', 'letter:taken'],
  goldenPlans: [
    // Raw movement into his office in the light, idling where he can see you, then the switch.
    ['move N 1s', 'move W 2s pretend', 'wait 2s', 'goto office_switch', 'interact', 'wait 4s', 'goto desk_side', 'wait until 3:12'],
    // The blackout: soak the coffee machine from the side, then straight to the front of his desk, into his torch.
    ['goto 20,2 pretend', 'interact', 'goto my_seat', 'pretend until 3:11', 'pretend 5s', 'goto tray', 'interact', 'wait 5s'],
    // Several loops: the breaker and a restart, then the switch, then into the next day.
    ['goto fuse_box pretend', 'interact', 'wait 3s', 'restart', 'goto office_switch pretend', 'interact', 'goto tray', 'interact', 'goto my_seat', 'pretend until 3:40', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
