// The Monitor's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
export default [
  { name: 'do nothing → fail', expect: { result: 'fail' }, cmds: ['wait until 4:00'] },
  {
    name: "take the parcel with Bob's back turned → caught on his monitor",
    expect: { result: 'caught' },
    cmds: ['goto pigeonholes pretend', 'interact', 'wait until 4:00'],
  },
  {
    name: 'pull the plug, take the parcel, drawer → win',
    expect: { result: 'win', routes: ['drawer'] },
    cmds: ['goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact', 'sit', 'wait until 4:00'],
  },
  {
    name: 'label, pull the plug, relabel → win',
    expect: { result: 'win', routes: ['bob'] },
    cmds: ['goto label_printer', 'interact', 'goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact', 'sit', 'wait until 4:00'],
  },
  {
    name: 'same, but still by the pigeonholes at 4:00 → blamed',
    expect: { result: 'blamed', routes: ['bob'] },
    cmds: ['goto label_printer', 'interact', 'goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact', 'pretend until 4:00'],
  },
  {
    name: 'same, idling there instead: Bob sends you back to your desk → win',
    expect: { result: 'win', routes: ['bob'] },
    cmds: ['goto label_printer', 'interact', 'goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact', 'wait until 4:00', 'wait until 4:00', 'wait until 4:00'],
  },
  {
    name: 'broom: shove the camera round while it looks away, then the drawer → win',
    expect: { result: 'win', routes: ['drawer'] },
    cmds: ['goto broom_stand', 'interact', 'goto 19,6 pretend', 'pretend 1.4s', 'interact', 'goto pigeonholes', 'interact', 'sit', 'wait until 4:00'],
  },
  {
    name: 'broom: shove it while it looks at you → caught',
    expect: { result: 'caught' },
    cmds: ['goto broom_stand', 'interact', 'goto 19,6 pretend', 'interact', 'wait until 4:00'],
  },
];
