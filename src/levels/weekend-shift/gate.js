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
    'roster:changed': (p) => (p.to === 'kev' ? 'kev' : p.to === 'boss' ? 'boss' : 'reset'), // reset: the boss's check
    'board:checked': () => 'checked',
    'witness:tattle': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['noodles', 'jammed', 'fixed', 'rang', 'answered', 'kev', 'boss', 'tattle', 'work', 'checked', 'reset', 'caught'],
  keyActions: ['noodles', 'jammed', 'rang', 'kev', 'boss'],
  goldenPlans: [
    // Raw movement, idling in the boss's view, then the board in plain sight.
    ['move E 1.5s', 'move N 2s pretend', 'wait 3s', 'goto roster', 'interact', 'wait until 5:00'],
    // The teaching fail: writing before the ding, with everyone still facing the board.
    ['goto microwave pretend', 'interact', 'goto roster pretend', 'interact', 'pretend until 5:00'],
    // The playtester's day: noodles, Lin's fish, the copier, Kev's desk; the board still shows your face.
    ['goto microwave pretend', 'interact', 'pretend until 4:38', 'goto copier pretend', 'interact', 'goto kev_desk pretend', 'pretend until 5:00'],
    // The mirror fail: the board while the copier beeps.
    ['goto copier pretend', 'interact', 'goto roster pretend', 'interact', 'pretend until 5:00'],
    // The ding, written once: Kev's face on the board, his protest at the reading, waved off, and his Saturday.
    ['goto microwave pretend', 'interact', 'goto roster pretend', 'interact', 'goto player_desk pretend', 'pretend until 4:55', 'goto meeting_player pretend', 'pretend until 5:00', 'wait 3s'],
    // Kev at the ding, then the boss's own face during his call, which he knows is wrong: he wipes it, draws yours, glares.
    ['goto microwave pretend', 'interact', 'goto roster pretend', 'interact', 'goto player_desk pretend', 'pretend until 4:31', 'goto desk_phone pretend', 'interact', 'goto board pretend', 'interact', 'goto meeting_player pretend', 'pretend until 5:00', 'wait 3s'],
    // Kev's face at the ding, then a write Lin sees: told on, the boss checks the board and puts your face back.
    ['goto microwave pretend', 'interact', 'goto roster pretend', 'interact', 'goto desk_phone pretend', 'interact', 'goto board pretend', 'interact', 'pretend until 4:45'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto copier pretend', 'interact', 'restart', 'pretend until 4:31', 'goto desk_phone pretend', 'interact', 'goto board pretend', 'interact', 'pretend until 5:00', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
