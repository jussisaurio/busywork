// What the fuzzer and the gate know about the fixture (src/levels/meeting/gate.js documents the fields).
export default {
  mustUse: [],
  targets: ['microwave', 'calendar', 'cake_stand', 'doreen_desk', 'gus_desk', 'door', 'party'],
  interactable: ['microwave', 'calendar', 'cake_stand'],
  milestones: {
    'popcorn:burning': () => 'popcorn',
    'popcorn:binned': () => 'binned',
    'calendar:changed': () => 'swapped',
    'cake:taken': () => 'cake',
    'cake:eaten': () => 'ate',
    'cake:returned': () => 'cakeBack',
    'witness:tattle': () => 'tattle',
    'doreen:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['popcorn', 'binned', 'swapped', 'cake', 'ate', 'cakeBack', 'work', 'caught'],
  keyActions: ['popcorn', 'swapped', 'cake', 'ate'],
  goldenPlans: [
    // Raw movement, idling in Doreen's view, then the calendar without the alarm.
    ['move E 1.5s', 'move N 2s pretend', 'wait 2s', 'goto calendar', 'interact', 'wait until 3:00'],
    // Taking the cake while Gus is still at his desk.
    ['goto cake_stand pretend', 'interact', 'wait 5s', 'pretend until 3:00'],
    // Holding the cake at your desk when Gus comes back.
    ['pretend until 2:44', 'goto cake_stand pretend', 'interact', 'goto my_seat pretend', 'interact', 'wait until 3:00'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto microwave pretend', 'interact', 'restart', 'pretend until 2:44', 'goto cake_stand pretend', 'interact', 'eat', 'goto party pretend', 'pretend until 3:00', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
