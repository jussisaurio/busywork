// fixture-attention's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
export default [
  { name: 'do nothing → fail', expect: { result: 'fail' }, cmds: ['wait until 2:40'] },
  { name: 'eat the donut in his sight → caught', expect: { result: 'caught' }, cmds: ['goto donut pretend', 'interact', 'wait until 2:40'] },
  {
    name: 'printer noise turns his head, eat the donut, pretend → win',
    expect: { result: 'win', routes: ['donut'] },
    cmds: ['goto workstation pretend', 'interact', 'goto donut', 'interact', 'pretend until 2:40'],
  },
  {
    name: 'same, but idle by the plate → blamed',
    expect: { result: 'blamed', routes: ['donut'] },
    cmds: ['goto workstation pretend', 'interact', 'goto donut', 'interact', 'wait until 2:40'],
  },
];
