// The Monitor's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
export default [
  { name: 'do nothing → fail', expect: { result: 'fail' }, cmds: ['wait until 4:00'] },
  {
    name: 'take the parcel with Bob\'s back turned → caught on his monitor',
    expect: { result: 'caught' },
    cmds: ['goto pigeonholes pretend', 'interact', 'wait until 4:00'],
  },
  {
    name: 'pull the plug, take the parcel, drawer → win',
    expect: { result: 'win', routes: ['drawer'] },
    cmds: ['goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact', 'goto own_desk pretend', 'interact', 'wait until 4:00'],
  },
  {
    name: 'label, pull the plug, relabel → win',
    expect: { result: 'win', routes: ['bob'] },
    cmds: ['goto label_printer', 'interact', 'goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact', 'sit', 'wait until 4:00'],
  },
];
