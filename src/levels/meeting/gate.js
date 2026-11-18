// What the automated tools know about level 1 beyond the level object itself: tools/fuzz.mjs (plan
// language, outcome bins, report), tools/gate.mjs (the lessons a win must use) and tools/golden.mjs
// (hand-written golden plans). The route ids come from level.routes.
//
//   mustUse      the lessons the level exists to teach: the gate fails on a win that skips one. Data, checked
//                by fuzz.mjs usedLessons(): { id, cmd } = a plan command that ran contains the word cmd (it
//                pressed that button); { id, event } = that event fired during the day. routes: [ids] binds
//                only wins that include one of those routes.
//   targets      where a fuzz plan can `goto` (harness goto targets): interactables first, then landmarks.
//                The order is behaviour: the fuzzer's rng picks by index.
//   interactable the targets a plan can `interact` with (a goto there is often followed by one)
//   milestones   event name -> (payload) => milestone name or null: what a run did (first minute of each)
//                (on top of the engine's: tools/fuzz.mjs ENGINE_MILESTONES; a level's own win on a clash)
//   binKeys      the milestones that define an outcome bin (the rest are only reported)
//   keyActions   the milestones whose time span across all wins the report lists
//   renderEvents events that tools/golden-render.mjs also renders at (and 20 frames after), besides the engine's
//                own (caught, work:done, item:drop/pickup, witness:tattle, meeting:gather, day:end, loop:start,
//                player:sit): the level's visible beats
//   goldenPlans  hand-written golden plans that tools/golden.mjs --write --from adds to the fuzzer's: what the
//                fuzzer's plan language never does (raw movement, several loops)

export default {
  // pretend: no win without it (fuzz, 20k days): a slacker on the move gets desk work. It half hides the cup: held
  // to your ear, Kev squints and takes it for a phone (clocks.js), but he asks for it on your folder stride.
  // put: the mug (items.js) leaves your hand only by a put, and at 4:00 it blames whoever holds it (verdict.js).
  // A projector win that never put it down is a bug; the keycard route never touches the mug.
  mustUse: [{ id: 'pretend', cmd: 'pretend' }, { id: 'put', event: 'item:put', routes: ['projector'] }],
  targets: [
    'coffee_machine', 'projector', 'coat_rack', 'fridge',
    'boss_desk', 'lin_desk', 'kev_desk', 'my_desk_spot', 'boss_office_door', 'kitchen_table', 'entrance',
    'restroom_door', 'meeting_room', 'meeting_seat', 'fire_door', 'exit',
    'ficus', 'boss_doorway', 'typewriter', 'plant', 'balcony',
  ],
  interactable: ['coffee_machine', 'projector', 'coat_rack', 'fridge', 'fire_door', 'exit', 'restroom_door', 'ficus', 'typewriter', 'plant'],
  renderEvents: [
    'projector:broken', 'projector:fixing', 'projector:fixed', 'boss:jacket', 'boss:badge', 'boss:lockedOut', 'boss:bang', 'boss:pound',
    'boss:workAssigned',
    'sandwich:eaten', 'sandwich:returned', 'keycard:taken', 'keycard:recovered', 'keycard:takenBack', 'coffee:kevTook',
    'coffee:asked', 'kev:alerted', 'item:put', 'boss:mugHunt', 'mug:found', 'meeting:calledOff', 'boss:letIn', 'boss:hug',
    'player:leave', 'player:in', 'restroom:washed', 'fireDoor:out', 'fireDoor:badge', 'fireDoor:held', 'fireDoor:in',
    'keycard:snatched',
  ],
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
    'coffee:kevTook': () => 'kevTook',
    'coffee:asked': () => 'asked',
    'keycard:takenBack': () => 'cardBack',
    'witness:tattle': (p) => (p.reason === 'contraband' ? null : 'tattle'),
    'boss:workAssigned': () => 'work',
    'boss:mugHunt': () => 'mugHunt',
    'mug:found': (p) => `found@${p.spot}`,
    'boss:letIn': () => 'letIn',
    'player:leave': () => 'home',
    'player:in': () => 'loo',
    'restroom:washed': () => 'washed',
    caught: () => 'caught',
    'coffee:ficus': () => 'ficus',
    'coffee:plant': () => 'ficus',
    'coffee:typewriter': () => 'typewriter',
    'fireDoor:out': () => 'balcony',
    'fireDoor:badge': () => 'badgeIn',
    'keycard:snatched': () => 'snatched',
  },
  binKeys: ['poured', 'broke', 'fixed', 'card', 'cardLost', 'lockout', 'sandwich', 'ate', 'hunt', 'work', 'caught',
    'put@coffee', 'put@kev_desk', 'put@my_desk', 'mugHunt', 'balcony', 'snatched'],
  keyActions: ['poured', 'broke', 'card', 'sandwich', 'ate', 'put@coffee', 'put@kev_desk'],
  goldenPlans: [
    // Raw movement, with and without pretend, around the kitchen and Kev.
    ['move E 1.5s', 'move S 2s pretend', 'move W 1s', 'wait 3s', 'goto coffee_machine', 'interact', 'move N 2s', 'wait until 2:50', 'pretend until 4:00'],
    // Grabbing the keycard in plain view.
    ['goto coat_rack', 'interact', 'wait until 4:00'],
    // Lin's sandwich, eaten, then walking into her hunt.
    ['goto fridge pretend', 'interact', 'eat', 'pretend until 3:10', 'goto lin_desk', 'wait 5s', 'pretend until 4:00'],
    // The mug planted on Kev's desk before the boss's hunt, then raw movement past him with it gone.
    ['goto coffee_machine pretend', 'interact', 'sit', 'pretend until 3:01', 'goto projector pretend', 'interact', 'put kev_desk pretend', 'move S 1s', 'wait until 3:20', 'goto meeting_seat pretend', 'pretend until 4:00'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto coffee_machine', 'interact', 'restart', 'pretend until 2:46', 'goto coat_rack pretend', 'interact', 'goto meeting_seat pretend', 'pretend until 4:00', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
