// fixture-putdown's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
export default [
  { name: 'do nothing → fail', expect: { result: 'fail' }, cmds: ['pretend until 3:00'] },
  { name: 'write the note in his sight → caught', expect: { result: 'caught' }, cmds: ['goto own_desk pretend', 'interact', 'pretend until 3:00'] },
  {
    name: 'write the note while he is away, put it in the box, go to the meeting → win',
    expect: { result: 'win', routes: ['box'] },
    cmds: ['pretend until 2:39', 'interact', 'put box pretend', 'goto meeting_seat pretend', 'wait until 3:00'],
  },
  {
    name: 'same, but stay by the box → blamed',
    expect: { result: 'blamed', routes: ['box'] },
    cmds: ['pretend until 2:39', 'interact', 'put box pretend', 'wait until 3:00'],
  },
];
