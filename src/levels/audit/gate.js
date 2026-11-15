// What the fuzzer and the gate know about the audit (src/levels/meeting/gate.js documents the fields).
export default {
  // A win counts one laptop twice: it moves on after he has ticked it off (inspect:moved), by being put down.
  mustUse: [{ id: 'put', event: 'item:put' }, { id: 'recount', event: 'inspect:moved' }],
  targets: [
    'coffee_machine', 'boss_desk', 'lin_desk', 'kev_desk', 'your_desk', 'hallway_west', 'hallway_mid', 'office_door',
    'my_seat', 'entrance', 'kitchen',
  ],
  interactable: ['coffee_machine', 'boss_desk', 'lin_desk', 'kev_desk', 'your_desk', 'hallway_west', 'hallway_mid'],
  renderEvents: [
    'inspect:start', 'inspect:pass', 'inspect:fail', 'inspect:done', 'audit:fired', 'audit:passed', 'laptop:reclaimed',
    'laptop:missing', 'laptop:home', 'laptop:drawer', 'kev:packed', 'kev:forgot', 'kev:fetched', 'coffee:taken', 'auditor:workAssigned',
  ],
  milestones: {
    'item:pickup': (p) => `took:${p.type.slice(7)}`,
    'laptop:reclaimed': () => 'reclaimed',
    'witness:tattle': (p) => (p.reason === 'contraband' ? null : 'tattle'),
    'auditor:workAssigned': () => 'work',
    'laptop:missing': () => 'missed',
    'laptop:drawer': () => 'drawer',
    'coffee:taken': () => 'coffee',
    caught: () => 'caught',
  },
  binKeys: [
    'took:boss', 'took:lin', 'took:kev', 'put@boss_desk', 'put@lin_desk', 'put@your_desk', 'put@kev_desk',
    'tick0', 'tick1', 'tick2', 'tick3', 'moved', 'reclaimed', 'missed', 'drawer', 'work', 'caught',
  ],
  keyActions: ['took:boss', 'took:lin', 'took:kev', 'put@your_desk', 'put@kev_desk'],
  goldenPlans: [
    // Raw movement, with and without pretend; standing at Lin's desk while everyone's routine runs past.
    ['move W 1.5s', 'move N 1s pretend', 'wait 3s', 'goto lin_desk', 'wait until 3:20', 'pretend until 3:50'],
    // Lin's laptop held in plain view as she comes back from the restroom: she takes it back.
    ['goto hallway_west pretend', 'pretend until 3:14', 'interact', 'wait until 3:26', 'wait until 3:26', 'wait until 3:26', 'pretend until 3:50'],
    // A coffee from the hallway pot: hands full, Kev's laptop out of reach; drunk, then picked up.
    ['goto hallway_coffee', 'interact', 'pretend until 3:24', 'goto kev_desk pretend', 'interact', 'interact', 'interact', 'pretend until 3:50'],
    // Several loops: Kev's laptop picked up, restart, Lin's route to a win, continue into the next day.
    ['pretend until 3:24', 'goto kev_desk pretend', 'interact', 'restart', 'goto hallway_west pretend', 'pretend until 3:36.4', 'interact', 'put your_desk pretend', 'goto my_seat pretend', 'pretend until 3:50', 'continue', 'move E 1s', 'wait 2s'],
  ],
};
