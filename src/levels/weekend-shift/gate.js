// What the fuzzer and the gate know about Weekend Shift (src/levels/meeting/gate.js documents the fields).
export default {
  // The lesson: make a glance. Every win needs a noise: the ding, the copier's beeping or the boss's phone.
  mustUse: [{ id: 'noise', event: 'noise' }],
  targets: ['microwave', 'copier', 'roster', 'tray', 'boss_desk', 'lin_desk', 'kev_desk', 'boss_window', 'board'],
  interactable: ['microwave', 'copier', 'roster', 'tray'],
  renderEvents: ['boss:workAssigned', 'copier:jammed', 'phone:answered', 'roster:changed', 'sheet:swapped', 'sheet:taken'],
  milestones: {
    'microwave:started': () => 'noodles',
    'copier:jammed': () => 'jammed',
    'copier:fixed': () => 'fixed',
    'phone:ringing': () => 'rang',
    'phone:answered': () => 'answered',
    'roster:changed': () => 'roster',
    'sheet:swapped': () => 'swapped',
    'sheet:taken': () => 'taken',
    'witness:tattle': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['noodles', 'jammed', 'fixed', 'rang', 'answered', 'roster', 'swapped', 'tattle', 'work', 'caught'],
  keyActions: ['noodles', 'jammed', 'rang', 'roster', 'swapped'],
  goldenPlans: [
    // Raw movement, idling in the boss's view, then the board in plain sight.
    ['move E 1.5s', 'move N 2s pretend', 'wait 3s', 'goto roster', 'interact', 'wait until 5:00'],
    // The teaching fail: the sheet at the ding, with Lin looking straight at it.
    ['goto microwave pretend', 'interact', 'goto tray pretend', 'pretend until 4:13', 'interact', 'pretend until 5:00'],
    // The mirror fail: the board while the copier beeps.
    ['goto copier pretend', 'interact', 'goto roster pretend', 'interact', 'pretend until 5:00'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto copier pretend', 'interact', 'restart', 'pretend until 4:31', 'interact', 'goto board pretend', 'interact', 'pretend until 5:00', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
