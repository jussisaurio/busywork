// What the fuzzer and the gate know about The Interview (src/levels/meeting/gate.js documents the fields).
const PEOPLE = ['boss', 'lin', 'kev'];
const PHONES = ['lin', 'boss', 'kev', 'kitchen'];
// Who answered which ring: 'lin@kitchen'.
const ANSWERS = PEOPLE.flatMap((who) => PHONES.map((p) => `${who}@${p}`));

export default {
  // ring: the lesson is that you can move people, and the switchboard is how.
  mustUse: [{ id: 'ring', event: 'switchboard:ring' }],
  targets: [
    'ring_lin', 'ring_boss', 'ring_kev', 'ring_kitchen', 'lin_socket',
    'phone_lin', 'phone_boss', 'phone_kev', 'phone_kitchen',
    'lin_desk', 'kev_desk', 'boss_office', 'kitchen', 'switchboard', 'my_seat',
  ],
  interactable: ['ring_lin', 'ring_boss', 'ring_kev', 'ring_kitchen', 'lin_socket', 'phone_lin', 'phone_boss', 'phone_kev', 'phone_kitchen'],
  renderEvents: ['switchboard:ring', 'phone:answering', 'cord:out', 'cord:in', 'lin:checks', 'lin:deadLine', 'interview:ringing',
    'interview:lin', 'interview:other', 'interview:busy', 'interview:dead', 'interview:rangOut', 'boss:workAssigned',
    'player:answers', 'lin:jolted', 'job:snatched'],
  milestones: {
    'phone:answering': (p) => `${p.by}@${p.phone}`,
    'phone:unanswered': (p) => `none@${p.phone}`,
    'cord:out': () => 'unplugged',
    'cord:in': () => 'replugged',
    'interview:lin': () => 'linTook',
    'interview:other': (p) => (p.by === 'player' ? 'youTook' : 'otherTook'),
    'player:answers': (p) => `you@${p.phone}`,
    'lin:jolted': () => 'jolted',
    'interview:busy': () => 'busy',
    'interview:dead': () => 'dead',
    'interview:rangOut': () => 'rangOut',
    'witness:tattle': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: [...ANSWERS, ...PHONES.map((p) => `none@${p}`), ...PHONES.map((p) => `you@${p}`), 'youTook', 'jolted', 'unplugged', 'replugged', 'linTook', 'otherTook', 'busy',
    'dead', 'rangOut', 'work', 'caught'],
  keyActions: ['lin@kitchen', 'kev@kev', 'boss@lin', 'boss@boss', 'unplugged'],
  goldenPlans: [
    // Raw movement through the office and up to the switchboard, with and without pretend.
    ['move E 1.5s', 'move S 2s pretend', 'move W 1s', 'wait 3s', 'goto switchboard', 'move W 0.5s', 'interact', 'move S 2s', 'wait until 3:22', 'pretend until 3:33'],
    // Unplugging in plain view of Lin and the boss.
    ['goto lin_socket', 'interact', 'wait until 3:34'],
    // Unplugging before Kev's charging stop: he jams it back in (or Lin, checking her line, finds it dead).
    ['wait until 3:05', 'goto lin_socket', 'interact', 'goto my_seat', 'sit', 'pretend until 3:34'],
    // Several loops: restart mid-day, the busy line, continue into the next day and ring out.
    ['goto ring_kitchen', 'interact', 'restart', 'pretend until 3:22', 'goto ring_lin', 'interact', 'goto my_seat', 'sit pretend', 'pretend until 3:34', 'pretend until 3:34', 'wait 3s', 'continue',
      'pretend until 3:17', 'goto ring_kev', 'interact', 'goto ring_kitchen', 'interact', 'pretend until 3:25', 'goto ring_boss', 'interact', 'goto my_seat', 'sit', 'pretend until 3:34', 'pretend until 3:34', 'wait 3s'],
  ],
};
