// What the fuzzer and the gate know about the audit (src/levels/meeting/gate.js documents the fields).
export default {
  // A win counts one laptop twice: it moves on after he has ticked it off (inspect:moved), by being put down.
  mustUse: [{ id: 'put', event: 'item:put' }, { id: 'recount', event: 'inspect:moved' }],
  targets: ['boss_desk', 'lin_desk', 'kev_desk', 'your_desk', 'hallway_west', 'hallway_mid', 'office_door', 'my_seat', 'entrance', 'kitchen'],
  interactable: ['boss_desk', 'lin_desk', 'kev_desk', 'your_desk', 'hallway_west', 'hallway_mid'],
  renderEvents: ['inspect:start', 'inspect:pass', 'inspect:fail', 'inspect:done', 'laptop:reclaimed', 'kev:left', 'auditor:workAssigned'],
  milestones: {
    'item:pickup': (p) => `took:${p.type.slice(7)}`,
    'laptop:reclaimed': () => 'reclaimed',
    'witness:tattle': (p) => (p.reason === 'contraband' ? null : 'tattle'),
    'auditor:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: [
    'took:boss', 'took:lin', 'took:kev', 'put@boss_desk', 'put@lin_desk', 'put@your_desk', 'put@kev_desk',
    'tick0', 'tick1', 'tick2', 'tick3', 'moved', 'reclaimed', 'work', 'caught',
  ],
  keyActions: ['took:boss', 'took:lin', 'took:kev', 'put@your_desk', 'put@kev_desk'],
  goldenPlans: [],
};
