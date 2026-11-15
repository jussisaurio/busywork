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
  goldenPlans: [],
};
