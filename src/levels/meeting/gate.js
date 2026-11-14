// What the automated tools know about level 1 beyond the level object itself: tools/fuzz.mjs (plan
// language, outcome bins, report), tools/gate.mjs (the lessons a win must use) and tools/golden.mjs
// (hand-written golden plans). The route ids come from level.routes.
//
//   mustUse      the lessons the level exists to teach: the gate fails on a win that skips one. Data, checked
//                by fuzz.mjs usedLessons(): { id, cmd } = a plan command that ran contains the word cmd (it
//                pressed that button); { id, event } = that event fired during the day.
//   targets      where a fuzz plan can `goto` (harness goto targets): interactables first, then landmarks.
//                The order is behaviour: the fuzzer's rng picks by index.
//   interactable the targets a plan can `interact` with (a goto there is often followed by one)
//   milestones   event name -> (payload) => milestone name or null: what a run did (first minute of each)
//   binKeys      the milestones that define an outcome bin (the rest are only reported)
//   keyActions   the milestones whose time span across all wins the report lists
//   goldenPlans  hand-written golden plans that tools/golden.mjs --write --from adds to the fuzzer's: what the
//                fuzzer's plan language never does (raw movement, several loops)

export default {
  // pretend: no win without it in 30k days (design-jam/FUZZ.md); the phone pose hides what you carry.
  mustUse: [{ id: 'pretend', cmd: 'pretend' }],
  targets: [
    'coffee_machine', 'projector', 'coat_rack', 'fridge',
    'boss_desk', 'lin_desk', 'kev_desk', 'boss_office_door', 'kitchen_table', 'entrance',
    'restroom_door', 'meeting_room', 'meeting_seat',
  ],
  interactable: ['coffee_machine', 'projector', 'coat_rack', 'fridge'],
  milestones: {
    'coffee:taken': (p) => (p.by === 'player' ? 'poured' : 'kevPoured'),
    'projector:broken': () => 'broke',
    'projector:fixed': () => 'fixed',
    'keycard:taken': () => 'card',
    'keycard:recovered': () => 'cardLost',
    'boss:lockedOut': () => 'lockout',
    'sandwich:taken': () => 'sandwich',
    'sandwich:eaten': () => 'ate',
    'sandwich:missing': () => 'hunt',
    'sandwich:returned': () => 'sandwichBack',
    'coffee:confiscated': () => 'coffeeBack',
    'witness:tattle': (p) => (p.reason === 'contraband' ? null : 'tattle'),
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['poured', 'broke', 'fixed', 'card', 'cardLost', 'lockout', 'sandwich', 'ate', 'hunt', 'work', 'caught'],
  keyActions: ['poured', 'broke', 'card', 'sandwich', 'ate'],
  goldenPlans: [
    // Raw movement, with and without pretend, around the kitchen and Kev.
    ['move E 1.5s', 'move S 2s pretend', 'move W 1s', 'wait 3s', 'goto coffee_machine', 'interact', 'move N 2s', 'wait until 2:50', 'pretend until 4:00'],
    // Grabbing the keycard in plain view.
    ['goto coat_rack', 'interact', 'wait until 4:00'],
    // Lin's sandwich, eaten, then walking into her hunt.
    ['goto fridge pretend', 'interact', 'interact', 'pretend until 3:10', 'goto lin_desk', 'wait 5s', 'pretend until 4:00'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto coffee_machine', 'interact', 'restart', 'pretend until 2:46', 'goto coat_rack pretend', 'interact', 'goto meeting_seat pretend', 'pretend until 4:00', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
