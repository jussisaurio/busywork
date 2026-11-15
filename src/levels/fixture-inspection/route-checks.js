// fixture-inspection's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
export default [
  { name: 'do nothing → the audit catches you', expect: { result: 'caught' }, cmds: ['pretend until 3:00'] },
  {
    name: 'put the laptop on Dave\'s desk, go to the meeting → win',
    expect: { result: 'win', routes: ['audit'] },
    cmds: ['pretend until 2:44', 'interact', 'goto dave_desk', 'interact', 'goto meeting_seat', 'wait until 3:00'],
  },
  {
    name: 'same, but stay by Dave\'s desk → blamed',
    expect: { result: 'blamed', routes: ['audit'] },
    cmds: ['pretend until 2:44', 'interact', 'goto dave_desk', 'interact', 'wait until 3:00'],
  },
];
