// What the fuzzer and the gate know about The Layoff List (src/levels/meeting/gate.js documents the fields).
export default {
  mustUse: [{ id: 'disguise', event: 'disguise:fooled' }], // every win passes for someone else
  targets: ['boss_pc', 'coat_rack', 'kev_hoodie', 'boss_desk', 'lin_desk', 'kev_desk', 'boss_office_door', 'restroom_door'],
  interactable: ['boss_pc', 'coat_rack', 'kev_hoodie'],
  milestones: {
    'jacket:taken': () => 'jacket',
    'hoodie:taken': () => 'hoodie',
    'hoodie:left': () => 'hoodieBack', // put back on Kev's chair: the hoodie win needs it (index.js verdict)
    'jacket:hung': () => 'jacketBack',
    'pc:asked': () => 'asked',
    'list:edited': () => 'edited',
    'witness:tattle': () => 'tattle',
    'boss:workAssigned': () => 'work',
    caught: () => 'caught',
  },
  binKeys: ['jacket', 'hoodie', 'asked', 'edited', 'hoodieBack', 'jacketBack', 'work', 'caught'],
  keyActions: ['jacket', 'hoodie', 'asked', 'edited'],
  goldenPlans: [
    // Raw movement, then the boss's computer while he's at it.
    ['move W 1.5s', 'move N 2s pretend', 'wait 2s', 'goto boss_pc', 'interact', 'wait until 3:45'],
    // His jacket in front of Lin, then a walk past her.
    ['goto coat_rack pretend', 'interact', 'goto lin_desk', 'wait until 3:45'],
    // Kev's hoodie, worn back to your desk.
    ['pretend until 3:20', 'goto kev_desk pretend', 'interact', 'goto my_seat', 'wait until 3:45'],
    // Several loops: restart mid-day, a full day, continue into the next one.
    ['goto coat_rack pretend', 'interact', 'restart', 'pretend until 3:13', 'goto boss_pc', 'interact', 'goto my_seat pretend', 'pretend until 3:45', 'continue', 'move S 1s', 'wait 2s'],
  ],
};
