// What the fuzzer and the gate know about the Monitor (src/levels/meeting/gate.js documents the fields).
export default {
  // The camera: no win without blinding it (unplugged, or shoved round to face the wall).
  mustUse: [{ id: 'camera', event: 'camera:blind' }],
  targets: [
    'socket', 'pigeonholes', 'camera', 'label_printer', 'broom_stand', 'own_desk',
    'bob_desk', 'lin_desk', 'corridor', 'mailroom', 'lobby',
  ],
  interactable: ['socket', 'pigeonholes', 'camera', 'label_printer', 'broom_stand', 'own_desk'],
  renderEvents: ['camera:unplugged', 'camera:pushed', 'bob:static', 'bob:whacking', 'camera:replugged', 'parcel:collected'],
  milestones: {
    'camera:unplugged': () => 'unplugged',
    'camera:pushed': () => 'pushed',
    'broom:taken': () => 'broom',
    'label:printed': () => 'label',
    'parcel:taken': () => 'parcel',
    'parcel:relabelled': () => 'relabelled',
    'parcel:stashed': () => 'stashed',
    'camera:replugged': () => 'replugged',
    'witness:tattle': () => 'tattle',
    'bob:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['unplugged', 'pushed', 'broom', 'label', 'parcel', 'relabelled', 'stashed', 'replugged', 'work', 'caught'],
  keyActions: ['unplugged', 'pushed', 'parcel', 'relabelled', 'stashed'],
  goldenPlans: [
    // Raw movement into the back office, idling on camera, then the teaching fail.
    ['move E 1.5s', 'move S 1s', 'wait 2s', 'goto pigeonholes', 'wait 2s', 'interact', 'wait until 4:00'],
    // Pull the plug, grab the parcel, carry it home.
    ['goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact', 'goto own_desk pretend', 'interact', 'wait until 4:00'],
    // The broom: shove the camera round, then relabel.
    ['goto broom_stand', 'interact', 'goto camera pretend', 'interact', 'goto label_printer', 'interact', 'goto pigeonholes pretend', 'interact', 'sit', 'wait until 4:00'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto socket pretend', 'interact', 'restart', 'goto label_printer', 'interact', 'goto pigeonholes pretend', 'interact', 'pretend until 4:00', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
