// What the fuzzer and the gate know about The Last Bus (src/levels/meeting/gate.js documents the fields).
export default {
  // The lesson: a clock you pushed. Every win must push one.
  mustUse: [{ id: 'clock', event: 'clock:pushed' }],
  targets: [
    'boss_clock', 'open_clock',
    'boss_desk', 'lin_desk', 'kev_desk', 'boss_office_door', 'kitchen', 'entrance', 'restroom_door', 'bus_stop',
  ],
  interactable: ['boss_clock', 'open_clock'],
  renderEvents: ['clock:pushed', 'clock:jump', 'clock:reset', 'boss:desk', 'boss:hunt', 'boss:suspect', 'boss:herd', 'boss:shrug',
    'boss:coat', 'coat:seen', 'boss:left', 'kev:left', 'boss:workAssigned'],
  milestones: {
    'clock:pushed': (p) => `${p.clock}${p.off}`,
    'clock:jump': (p) => `jump:${p.id}`,
    'clock:reset': (p) => `reset:${p.clock}`,
    'boss:hunt': () => 'hunt',
    'boss:suspect': () => 'suspect',
    'boss:shrug': () => 'shrug',
    'boss:coat': () => 'coat',
    'boss:herd': () => 'herd',
    'boss:left': () => 'bossLeft',
    'lin:left': () => 'linLeft',
    'kev:left': () => 'kevLeft',
    'witness:tattle': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['boss10', 'boss20', 'boss30', 'open10', 'open30', 'open50', 'open60', 'hunt', 'shrug', 'coat', 'herd', 'bossLeft', 'work', 'caught'],
  keyActions: ['boss30', 'open60', 'herd', 'coat', 'bossLeft'],
  goldenPlans: [
    // Raw movement, with and without pretend, then idling in the hallway.
    ['move E 1.5s', 'move N 1s pretend', 'move W 2s', 'wait 3s', 'goto open_clock', 'interact', 'move S 1s', 'wait 5s', 'pretend until 4:30'],
    // Pushing the boss's clock right in front of him.
    ['pretend until 3:20', 'goto boss_clock', 'interact', 'wait until 4:30'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto open_clock pretend', 'interact', 'restart', 'pretend until 3:02', 'goto open_clock pretend', 'interact', 'interact', 'interact', 'interact', 'goto bus_stop pretend', 'pretend until 4:30', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
