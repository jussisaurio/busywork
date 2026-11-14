// What the automated tools know about level 1 beyond the level object itself: tools/fuzz.mjs (plan
// language, outcome bins, report) and tools/gate.mjs (the lessons a win must use). The route ids come
// from level.routes.
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
};
