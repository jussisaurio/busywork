// What the fuzzer and the gate know about Weekend Shift (src/levels/meeting/gate.js documents the fields).
export default {
  // The lesson: make a glance. Every win needs a noise: the ding, the copier's beeping or the boss's phone.
  mustUse: [{ id: 'noise', event: 'noise' }],
  targets: ['microwave', 'copier', 'roster', 'desk_phone', 'boss_desk', 'lin_desk', 'kev_desk', 'boss_window', 'board'],
  interactable: ['microwave', 'copier', 'roster', 'desk_phone'],
  renderEvents: ['boss:workAssigned', 'copier:jammed', 'phone:answered', 'roster:changed'],
  milestones: {
    'microwave:started': () => 'noodles',
    'copier:jammed': () => 'jammed',
    'copier:fixed': () => 'fixed',
    'phone:ringing': () => 'rang',
    'phone:answered': () => 'answered',
    'roster:changed': (p) => (p.to === 'kev' ? 'kev' : 'roster'),
    'witness:tattle': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['noodles', 'jammed', 'fixed', 'rang', 'answered', 'roster', 'kev', 'tattle', 'work', 'caught'],
  keyActions: ['noodles', 'jammed', 'rang', 'roster', 'kev'],
  goldenPlans: [
    // Raw movement, idling in the boss's view, then the board in plain sight.
    ['move E 1.5s', 'move N 2s pretend', 'wait 3s', 'goto roster', 'interact', 'wait until 5:00'],
    // The teaching fail: writing before the ding, with everyone still facing the board.
    ['goto microwave pretend', 'interact', 'goto roster pretend', 'interact', 'pretend until 5:00'],
    // The playtester's day: noodles, Lin's fish, the copier, Kev's desk; the board still shows your face.
    ['goto microwave pretend', 'interact', 'pretend until 4:38', 'goto copier pretend', 'interact', 'goto kev_desk pretend', 'pretend until 5:00'],
    // The mirror fail: the board while the copier beeps.
    ['goto copier pretend', 'interact', 'goto roster pretend', 'interact', 'pretend until 5:00'],
    // The ding, written twice: Kev's face on the board, his groan at the reading, and his Saturday.
    ['goto microwave pretend', 'interact', 'goto roster pretend', 'pretend until 4:13', 'interact', 'interact', 'pretend until 5:00', 'wait 3s'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto copier pretend', 'interact', 'restart', 'pretend until 4:31', 'goto desk_phone pretend', 'interact', 'goto board pretend', 'interact', 'pretend until 5:00', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
