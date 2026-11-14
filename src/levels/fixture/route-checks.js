// The fixture's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js).
export default [
  { name: 'do nothing → fail', expect: { result: 'fail' }, cmds: ['wait until 3:00'] },
  { name: 'move your birthday on the calendar in plain sight → caught', expect: { result: 'caught' }, cmds: ['goto calendar pretend', 'interact', 'wait until 3:00'] },
  {
    name: 'microwave lure, move your birthday, wait by the cake → win',
    expect: { result: 'win', routes: ['calendar'] },
    cmds: ['goto microwave pretend', 'interact', 'goto calendar pretend', 'interact', 'goto cake_stand pretend', 'pretend until 3:00'],
  },
  {
    name: 'same, but back at the calendar at 3:00 → blamed',
    expect: { result: 'blamed', routes: ['calendar'] },
    cmds: ['goto microwave pretend', 'interact', 'goto calendar pretend', 'interact', 'pretend until 3:00'],
  },
  {
    name: 'eat the cake while Gus is away → win',
    expect: { result: 'win', routes: ['cake'] },
    cmds: ['pretend until 2:44', 'goto cake_stand pretend', 'interact', 'interact', 'pretend until 3:00'],
  },
  {
    name: 'both: the calendar, then the cake → win',
    expect: { result: 'win', routes: ['cake', 'calendar'] },
    cmds: ['goto microwave pretend', 'interact', 'goto calendar pretend', 'interact', 'goto cake_stand pretend', 'interact', 'interact', 'interact', 'wait until 3:00'],
  },
];
