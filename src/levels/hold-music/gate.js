// What the fuzzer and the gate know about Hold Music (src/levels/meeting/gate.js documents the fields).
const PEOPLE = ['boss', 'lin', 'kev', 'none'];
const PHONES = ['lin', 'boss', 'kev', 'kitchen'];
// Who answered which ring: 'lin@kitchen' (none@...: nobody heard it).
const ANSWERS = PEOPLE.flatMap((who) => PHONES.map((p) => `${who}@${p}`));

export default {
  // ring: the lesson is that you can move people, and the switchboard is how.
  mustUse: [{ id: 'ring', event: 'switchboard:ring' }],
  targets: [
    'ring_lin', 'ring_boss', 'ring_kev', 'ring_kitchen', 'lin_phone',
    'lin_desk', 'kev_desk', 'boss_office', 'kitchen', 'switchboard', 'my_seat',
  ],
  interactable: ['ring_lin', 'ring_boss', 'ring_kev', 'ring_kitchen', 'lin_phone'],
  renderEvents: ['switchboard:ring', 'cord:out', 'cord:in', 'interview:lin', 'interview:boss', 'interview:busy', 'interview:dead', 'boss:workAssigned'],
  milestones: {
    'switchboard:ring': (p) => `${p.by ?? 'none'}@${p.phone}`,
    'cord:out': () => 'unplugged',
    'cord:in': () => 'replugged',
    'interview:lin': () => 'linTook',
    'interview:boss': () => 'bossTook',
    'interview:busy': () => 'busy',
    'interview:dead': () => 'dead',
    'witness:tattle': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: [...ANSWERS, 'unplugged', 'replugged', 'linTook', 'bossTook', 'busy', 'dead', 'work', 'caught'],
  keyActions: ['lin@kitchen', 'kev@kev', 'boss@lin', 'boss@boss', 'unplugged'],
  goldenPlans: [
    // Raw movement through the office and down to the switchboard, with and without pretend.
    ['move E 1.5s', 'move S 2s pretend', 'move W 1s', 'wait 3s', 'goto switchboard', 'move W 0.5s', 'interact', 'move N 2s', 'wait until 3:22', 'pretend until 3:33'],
    // Unplugging in plain view of Lin and the boss.
    ['goto lin_phone', 'interact', 'wait until 3:33'],
    // Unplugging before Kev's cable round: he plugs it back in.
    ['wait until 3:08', 'goto ring_boss', 'interact', 'goto lin_phone', 'wait until 3:11', 'interact', 'sit', 'pretend until 3:33'],
    // Several loops: restart mid-day, the busy line, continue into the next day and ring out.
    ['goto ring_kitchen', 'interact', 'restart', 'pretend until 3:25', 'goto ring_lin', 'interact', 'sit pretend', 'pretend until 3:33', 'pretend until 3:33', 'wait 3s', 'continue',
      'pretend until 3:21', 'goto ring_kev', 'interact', 'pretend until 3:23', 'goto ring_kitchen', 'interact', 'pretend until 3:27', 'goto ring_boss', 'interact', 'sit', 'pretend until 3:33', 'pretend until 3:33', 'wait 3s'],
  ],
};
