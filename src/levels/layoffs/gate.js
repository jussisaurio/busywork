// What the fuzzer and the gate know about The Layoff List (src/levels/meeting/gate.js documents the fields).
export default {
  mustUse: [{ id: 'cable', event: 'pc:fixedByYou' }], // every win plugs his cable back in and gets him out
  targets: ['boss_pc', 'boss_cable', 'boss_phone', 'behind_his_desk', 'his_screen', 'his_chair', 'lin_desk', 'kev_desk', 'boss_office_door', 'coffee', 'restroom_door'],
  interactable: ['boss_pc', 'boss_cable', 'boss_phone'],
  renderEvents: ['pc:fixed', 'pc:fixedByYou', 'boss:coffee', 'phone:ring', 'lin:reads', 'list:edited', 'boss:headCount', 'kev:bye', 'boss:checks'],
  milestones: {
    'pc:fixedByYou': () => 'fixed',
    'boss:wavesOff': () => 'wavedOff',
    'phone:called': () => 'called',
    'list:edited': (p) => (p.via === 'unseen' ? 'editedUnseen' : 'edited'),
    'witness:tattle': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['fixed', 'called', 'edited', 'editedUnseen', 'work', 'caught'],
  keyActions: ['fixed', 'called', 'edited'],
  goldenPlans: [
    // Raw movement, then his cable while Kev is still here (waved off).
    ['move W 1.5s', 'move N 2s pretend', 'wait 2s', 'goto behind_his_desk', 'interact', 'wait until 3:45'],
    // The ring route.
    ['pretend until 3:25.5', 'goto behind_his_desk pretend', 'interact', 'wait 4.5s', 'goto boss_phone', 'interact', 'goto his_screen', 'interact', 'goto my_seat', 'wait until 3:45'],
    // Edit in front of Lin.
    ['pretend until 3:25.5', 'goto behind_his_desk pretend', 'interact', 'wait 4.5s', 'goto his_screen', 'interact', 'wait until 3:45'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto behind_his_desk pretend', 'interact', 'restart', 'pretend until 3:13', 'goto boss_pc', 'interact', 'goto my_seat pretend', 'pretend until 3:45', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
