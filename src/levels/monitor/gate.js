// What the fuzzer and the gate know about Discreet Packaging (the level's id is still 'monitor'; src/levels/meeting/
// gate.js documents the fields).
export default {
  // The lesson: you can be seen from somewhere else. A win that takes the parcel or relabels it never does so on
  // camera, so it blinds the camera first (unplugged, or poked into the plant).
  mustUse: [{ id: 'camera', event: 'camera:blind' }],
  targets: [
    'socket', 'pigeonholes', 'camera', 'label_printer', 'broom_stand', 'own_desk',
    'bob_desk', 'lin_desk', 'corridor', 'mailroom', 'lobby', 'mail_call',
  ],
  interactable: ['socket', 'pigeonholes', 'camera', 'label_printer', 'broom_stand', 'own_desk'],
  renderEvents: [
    'camera:unplugged', 'camera:pushed', 'bob:static', 'bob:whacking', 'camera:replugged',
    'parcel:collected', 'parcel:missing', 'parcel:spotted', 'parcel:found', 'parcel:snatched', 'parcel:handed',
  ],
  milestones: {
    'camera:unplugged': () => 'unplugged',
    'camera:pushed': () => 'pushed',
    'broom:taken': () => 'broom',
    'label:printed': () => 'label',
    'parcel:taken': () => 'parcel',
    'parcel:relabelled': () => 'relabelled',
    'parcel:stashed': () => 'stashed',
    'camera:replugged': () => 'replugged',
    'parcel:found': (p) => `found@${p.by}`,
    'parcel:snatched': () => 'snatched',
    'parcel:missing': () => 'missing',
    'parcel:handed': () => 'handed',
    'witness:tattle': () => 'tattle',
    'bob:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['unplugged', 'pushed', 'parcel', 'relabelled', 'stashed', 'replugged', 'found@lin', 'found@bob', 'snatched',
    'missing', 'work', 'caught'],
  keyActions: ['unplugged', 'pushed', 'parcel', 'relabelled', 'stashed'],
  goldenPlans: [
    // Raw movement into the back office, idling on camera, then taking the parcel in plain view of it.
    ['move E 1.5s', 'move S 1s', 'wait 2s', 'goto pigeonholes', 'wait 2s', 'interact', 'wait until 4:00'],
    // Pull the plug, grab the parcel, stuff it in the drawer.
    ['goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact', 'goto own_desk pretend', 'interact', 'sit', 'wait until 4:00'],
    // The broom: poke the camera into the plant, then relabel.
    ['goto broom_stand', 'interact', 'goto camera pretend', 'interact', 'goto broom_stand', 'interact', 'goto label_printer', 'interact', 'goto pigeonholes pretend', 'interact', 'sit', 'wait until 4:00'],
    // The parcel dropped in the corridor: someone finds it.
    ['goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact', 'goto corridor pretend', 'interact', 'goto own_desk pretend', 'sit', 'wait until 4:00'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto socket pretend', 'interact', 'restart', 'goto label_printer', 'interact', 'goto pigeonholes pretend', 'interact', 'pretend until 4:00', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
