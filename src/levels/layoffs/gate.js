// What the fuzzer and the gate know about The Layoff List (src/levels/meeting/gate.js documents the fields).
export default {
  mustUse: [{ id: 'pull', event: 'pc:pulled' }, { id: 'cable', event: 'pc:fixedByYou' }], // every win pulls his plug while he's in the restroom, and plugs it back in while he's at the coffee
  targets: ['boss_pc', 'boss_cable', 'boss_phone', 'behind_his_desk', 'his_screen', 'his_chair', 'lin_desk', 'kev_desk', 'boss_office_door', 'coffee', 'restroom_door'],
  interactable: ['boss_pc', 'boss_cable', 'boss_phone'],
  renderEvents: ['pc:fixed', 'pc:pulled', 'pc:actsUp', 'pc:fixedByYou', 'boss:coffee', 'pc:triedLocked', 'phone:ring', 'lin:reads', 'list:edited', 'boss:packsUp', 'boss:headCount', 'kev:bye', 'boss:checks', 'lin:sees'],
  milestones: {
    'pc:pulled': () => 'pulled',
    'boss:coffee': () => 'coffee', // your pull sent him for coffee: the step between pulling and plugging back in
    'pc:fixedByYou': (p) => (p.afterCoffee ? 'fixed' : 'replugged'), // the way in, or a pull undone before he's back
    'phone:called': () => 'called',
    'list:edited': (p) => (p.via === 'unseen' ? 'editedUnseen' : 'edited'),
    'lin:tells': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['pulled', 'replugged', 'coffee', 'fixed', 'called', 'edited', 'editedUnseen', 'work', 'caught'],
  keyActions: ['pulled', 'coffee', 'fixed', 'called', 'edited'],
  goldenPlans: [
    // Raw movement, then his cable while he sits there (nothing to do), then his locked screen.
    ['move W 1.5s', 'move N 2s pretend', 'wait 2s', 'goto behind_his_desk', 'interact', 'pretend until 3:13', 'goto his_screen', 'interact', 'wait until 3:45'],
    // The ring route.
    ['pretend until 3:14', 'goto behind_his_desk', 'interact', 'goto my_seat pretend', 'pretend until 3:30.3', 'goto behind_his_desk', 'interact', 'goto boss_phone', 'wait until 3:33', 'interact', 'goto his_screen', 'interact', 'goto my_seat', 'wait until 3:45'],
    // Edit in front of Lin.
    ['pretend until 3:14', 'goto behind_his_desk', 'interact', 'goto my_seat pretend', 'pretend until 3:30.3', 'goto behind_his_desk', 'interact', 'goto his_screen', 'interact', 'wait until 3:45'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto behind_his_desk', 'interact', 'restart', 'pretend until 3:13', 'goto boss_pc', 'interact', 'goto my_seat pretend', 'pretend until 3:45', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
