// Level 1's route checks for tools/routes.mjs: scripted "speedrun" solutions played through the AI-agent harness,
// each ending with the expected outcome. A check is
//   { name, expect: { result, routes? }, play(ctx) }   ctx: { g, run, waitFor, npc, log, transcript } (tools/routes.mjs)
//   { name, expect: { result, routes? }, cmds: [...] }  harness commands, run in order
// expect.routes: routes the outcome must include.
// ---- The cup into a computer: one event, the same on every machine on the floor (interactions.js drownComputer;
// map.js COMPUTER_OWNERS). One check a machine: with the full cup in hand E at it pours (never the typing toy, toys.js
// type_*, never a put), the same event, the same dead machine on that desk, the same catch and end scene.
//   id: its interactable; owner: whose (null: an empty desk's); to: the commands that take you to it, cup in hand
const MACHINES = [
  { id: 'spare_computer_0', owner: null, to: ['goto 4,12 busy'] }, // the empty desk behind Lin's
  { id: 'spare_computer_1', owner: null, to: ['goto spare_desk busy'] }, // behind yours (the mustard chair)
  { id: 'spare_computer_2', owner: null, to: ['goto 22,12 busy'] }, // behind Kev's
  { id: 'own_desk', owner: 'player', to: ['sit busy'] }, // yours, once seated
  { id: 'lin_computer', owner: 'lin', to: ['busy until 3:00', 'goto 4,7 busy'] }, // Lin off to the fridge; behind her monitor
  { id: 'kev_computer', owner: 'kev', to: ['goto 22,7 busy'] }, // behind his monitor, Kev at his desk
  { id: 'boss_computer', owner: 'boss', to: ['busy until 2:46', 'goto 4,4 busy'] }, // he is out on his 2:44 walk round the floor
];
const EVERY_COMPUTER = MACHINES.map((m) => ({
  name: `the full cup at ${m.id} (${m.owner ?? 'nobody'}'s) → E pours it in: BANG ⌨️💥, the boss hears it → caught (why computer)`,
  expect: { result: 'caught' },
  play({ run, g, log, waitFor }) {
    run('goto coffee_machine busy');
    run('interact');
    for (const cmd of m.to) run(cmd);
    const f = g.player.focus;
    if (f?.id !== m.id || f?.action !== 'drown_computer') throw new Error(`with the cup E is ${f?.toy ? 'a toy' : f?.action}@${f?.id}, not the pour`);
    run('interact');
    const pours = log.filter((e) => e.name === 'coffee:computer');
    if (pours.length !== 1 || pours[0].payload.id !== m.id || pours[0].payload.owner !== m.owner) throw new Error(`pours: ${JSON.stringify(pours.map((e) => e.payload))}`);
    if (log.some((e) => e.name.startsWith('toy:type_'))) throw new Error('E typed on the keyboard');
    if (g.player.held) throw new Error(`still holding ${g.player.held}`);
    if (g.world.cup !== 'computer' || g.world.drowned?.id !== m.id) throw new Error(`world.drowned ${JSON.stringify(g.world.drowned)}`);
    waitFor((gg) => gg.outcome, { maxSec: 10 });
    if (g.outcome?.why !== 'computer') throw new Error(`why ${g.outcome?.why}, not computer`);
  },
}));

// A drowned computer is dead (map.js deadAt): what you typed on it before is gone from its screen, and its keys
// type nothing after (Jussi saw a typed document drawn over the dead screen, 2026-11-18).
const DEAD_COMPUTER = {
  name: 'type on the spare computer, then pour the cup into it → its screen is dead, not your document; its keys type nothing',
  expect: { result: 'caught' },
  play({ run, g, log }) {
    run('goto spare_desk busy');
    run('interact');
    if (!log.some((e) => e.name === 'toy:type_mustard')) throw new Error('never typed on it');
    run('goto coffee_machine busy');
    run('interact');
    run('goto spare_desk busy');
    run('interact');
    if (g.world.drowned?.id !== 'spare_computer_1') throw new Error(`drowned ${JSON.stringify(g.world.drowned)}`);
    const screen = g.level.decor.props.find((pr) => pr.state && pr.draw?.name === 'typedScreen' && pr.state(g.world, g).x === 13);
    const keys = screen.state(g.world, g).keys;
    if (keys > 0) throw new Error(`the dead screen still shows ${keys} typed lines`);
    const kb = g.level.toys.find((t) => t.id === 'type_mustard');
    if (kb.when(g.world, g.toys.byId[kb.id].state, g, g.player)) throw new Error('the dead keyboard can still be typed on');
  },
};

export default [
  DEAD_COMPUTER,
  {
    name: 'do nothing → fail',
    expect: { result: 'fail' },
    play({ run }) {
      run('busy until 4:00');
    },
  },
  // ---- The plain fails with a cause (verdict.js verdictFull; end-scenes-fails.js), one block.
  {
    name: 'typing at your desk at 4:00 → the plain fail: you hurry in to the blank screen (no why)',
    expect: { result: 'fail' },
    play({ run, g }) {
      run('busy until 4:00');
      if (g.outcome?.why != null) throw new Error(`why ${g.outcome.why}, not the plain fail`);
    },
  },
  {
    name: 'the last cup still in your hand at 4:00 → you drink it up front (why sip)',
    expect: { result: 'fail' },
    play({ run, g }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      run('busy until 4:00');
      if (g.outcome?.why !== 'sip') throw new Error(`why ${g.outcome?.why}, not sip`);
    },
  },
  {
    name: 'on the phone (pretending, standing) at 4:00 → you keep the call going up front (why call)',
    expect: { result: 'fail' },
    play({ run, g }) {
      run('goto kitchen_table busy');
      run('busy until 4:00');
      if (g.outcome?.why !== 'call') throw new Error(`why ${g.outcome?.why}, not call`);
    },
  },
  {
    name: 'already in the meeting room at 4:00, hands empty → a duck in the beam (why puppets)',
    expect: { result: 'fail' },
    play({ run, waitFor, g }) {
      run('goto meeting_seat busy');
      run('busy until 3:59');
      run('wait until 4:00');
      waitFor((g) => g.outcome, { busy: false, maxSec: 20 });
      if (g.outcome?.why !== 'puppets') throw new Error(`why ${g.outcome?.why}, not puppets`);
    },
  },
  {
    name: 'projector too early, slip out pretending → Kev fixes it → fail',
    expect: { result: 'fail' },
    play({ run, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto projector busy');
      run('interact');
      run('sit busy');
      run('busy until 4:00');
      if (!log.some((e) => e.name === 'projector:fixed')) throw new Error('Kev never fixed it');
      if (log.some((e) => e.name === 'witness:tattle')) throw new Error('Kev tattled on a pretending player');
    },
  },
  {
    name: 'projector too early, hang around the room → Kev makes the leap → the boss hears → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto projector busy');
      run('interact');
      try { run('goto meeting_seat busy'); } catch { /* Kev may stop us on the way */ }
      waitFor((g) => g.outcome, { maxSec: 60 }); // pretending doesn't help in the room
      const t = log.find((e) => e.name === 'witness:tattle');
      if (!(t && t.payload.by === 'kev' && t.payload.reason === 'scene' && t.payload.heard)) throw new Error('no scene tattle from Kev');
    },
  },
  {
    name: 'pour early, carry it openly past the empty pot → Kev asks ☕🥺❓, never takes it → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, g, log }) {
      run('goto coffee_machine busy');
      run('interact');
      if (g.player.held !== 'coffee') throw new Error('no coffee poured');
      run('goto kev_desk busy'); // walk right past him: he doesn't care yet
      if (log.some((e) => e.name === 'coffee:asked')) throw new Error('Kev asked before he knew the pot was empty');
      run('goto coffee_machine busy');
      waitFor(() => log.some((e) => e.name === 'coffee:asked'), { busy: false, maxSec: 40 });
      if (!log.some((e) => e.name === 'coffee:missing')) throw new Error('Kev never found the pot empty');
      if (g.player.held !== 'coffee') throw new Error('Kev took the cup out of your hand');
      run('busy until 4:00');
      if (log.some((e) => e.name === 'coffee:kevTook')) throw new Error('Kev took a cup you never set down');
    },
  },
  {
    // The cup held to your ear half works: he squints at it, then decides you're on the phone.
    name: 'pour early, hold it to your ear like a phone at Kev\'s desk → he squints ☕❓, decides you\'re on a call 📱🤷 → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, g, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto kev_desk busy');
      waitFor(() => log.some((e) => e.name === 'coffee:shrug'), { busy: true, maxSec: 60 });
      const squint = log.find((e) => e.name === 'coffee:squint'), shrug = log.find((e) => e.name === 'coffee:shrug');
      if (!squint || shrug.minute - squint.minute < 0.6) throw new Error('Kev should squint at the cup before he shrugs');
      if (log.some((e) => e.name === 'coffee:asked')) throw new Error('Kev asked for a cup he took for a phone');
      if (g.player.held !== 'coffee') throw new Error('the cup should still be in your hand');
      run('busy until 4:00');
    },
  },
  {
    name: 'same, but lower the cup while he squints → it\'s a cup after all: ☕🥺❓',
    expect: { result: 'fail' },
    play({ run, waitFor, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto kev_desk busy');
      waitFor(() => log.some((e) => e.name === 'coffee:squint'), { busy: true, maxSec: 60 });
      waitFor(() => log.some((e) => e.name === 'coffee:asked'), { busy: false, maxSec: 4 });
      if (log.some((e) => e.name === 'coffee:shrug')) throw new Error('Kev shrugged off a cup in plain view');
      run('busy until 4:00');
    },
  },
  {
    name: 'pour early, leave the cup on the machine → Kev finds it there, takes it as free 🤤☕ → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, g, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('put coffee');
      run('sit busy');
      waitFor(() => log.some((e) => e.name === 'coffee:kevTook'), { busy: true, maxSec: 120 });
      if (g.world.items.some((i) => i.type === 'coffee')) throw new Error('the cup is still on the machine');
      run('busy until 4:00');
    },
  },
  {
    name: 'pour early, set it down on your own desk, type → Kev leaves it be, goes home → spill → blamed (mug in hand)',
    expect: { result: 'blamed', routes: ['projector'] },
    play({ run, waitFor, g, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto my_desk_spot busy');
      run('put my_desk');
      run('sit busy');
      waitFor((g) => g.world.kevGone, { busy: true });
      if (log.some((e) => e.name === 'coffee:asked' || e.name === 'coffee:kevTook')) throw new Error('Kev went for the cup on your desk');
      if (log.some((e) => e.name === 'boss:workAssigned')) throw new Error('typing with the cup set down still drew desk work');
      run('goto my_desk_spot busy');
      run('interact');
      if (g.player.held !== 'coffee') throw new Error(`picked up ${g.player.held}, not the cup`);
      run('goto projector busy');
      run('interact');
      run('goto meeting_seat busy');
      run('busy until 4:00');
    },
  },
  {
    name: 'wait for Kev to leave, then go for coffee → he drank it → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, g }) {
      waitFor((g) => g.world.kevGone);
      run('goto coffee_machine busy');
      if (g.world.coffee !== 'taken') throw new Error(`pot should be empty, is ${g.world.coffee}`);
      try { run('interact'); } catch { /* nothing to do here */ }
      if (g.player.held === 'coffee') throw new Error('poured from an empty pot');
      run('busy until 4:00');
    },
  },
  {
    // The teaching fail: the act is over, the evidence isn't. The boss looks in on his 3:12 walk.
    name: 'pour before Kev\'s coffee run, set it on your desk, spill after he leaves, keep the empty mug → the boss sees the projector 📽️💥☕❓ → ☕😠👉 at you, blamed',
    expect: { result: 'blamed', routes: ['projector'] },
    play({ run, waitFor, g, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      waitFor((g) => g.world.kevGone);
      if (!log.some((e) => e.name === 'coffee:missing' && e.payload.by === 'kev')) throw new Error('Kev never found the pot empty');
      run('goto projector busy');
      run('interact');
      if (g.player.held !== 'mug') throw new Error(`the spill left ${g.player.held} in your hand, not the mug`);
      run('goto meeting_seat busy');
      run('busy until 4:00');
      waitFor((g) => g.outcome, { maxSec: 10 });
      if (!log.some((e) => e.name === 'boss:mugHunt')) throw new Error('the boss never went looking for the mug');
      if (g.outcome?.why !== 'mug') throw new Error(`blamed for ${g.outcome?.why}, not the mug in your hand`);
    },
  },
  {
    name: 'same, but put the mug back on the coffee machine → the hunting boss shrugs ☕🤷 → win',
    expect: { result: 'win', routes: ['projector'] },
    play({ run, waitFor, g, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      waitFor((g) => g.world.kevGone);
      run('goto projector busy');
      run('interact');
      run('put coffee busy');
      run('goto meeting_seat busy');
      run('busy until 4:00');
      waitFor((g) => g.outcome, { maxSec: 10 });
      if (!log.some((e) => e.name === 'mug:found' && e.payload.spot === 'coffee')) throw new Error('the boss never saw the mug back on the machine');
      if (g.outcome?.why) throw new Error(`a plain win expected, got why ${g.outcome.why}`);
    },
  },
  {
    name: 'same, but plant the mug on Kev\'s desk → ☕❗, 😠 at Kev, and at 4:00 the table stares at Kev\'s empty chair → win',
    expect: { result: 'win', routes: ['projector'] },
    play({ run, waitFor, g, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      waitFor((g) => g.world.kevGone);
      run('goto projector busy');
      run('interact');
      run('put kev_desk busy');
      run('goto meeting_seat busy');
      run('busy until 4:00');
      waitFor((g) => g.outcome, { maxSec: 10 });
      if (!log.some((e) => e.name === 'mug:found' && e.payload.spot === 'kev_desk')) throw new Error('the boss never found the mug on Kev\'s desk');
      if (g.outcome?.why !== 'kev') throw new Error(`the table should stare at Kev's chair, why ${g.outcome?.why}`);
    },
  },
  // ---- The mug on Lin's desk, on the boss's, and the cup into a computer (verdict.js verdictDesks; interactions.js
  // drownComputer: EVERY_COMPUTER above). The spill comes after the boss's last look into the meeting room (3:22 walk): he never hunts, so
  // the mug in your hand is just a mug. The put waits for 3:35, when he goes for his jacket and Lin for the restroom.
  ...[
    { why: 'lin', eat: false, name: 'spill after the boss\'s last look in, plant the mug on Lin\'s desk while she and the boss are out (3:36) → the boss points at Lin 😠👉, she shrinks 😨 → win' },
    { why: 'linHungry', eat: true, name: 'same, but you ate her sandwich first (washed off in the restroom) → she is in tears 😭🥪 → win' },
  ].map(({ why, eat, name }) => ({
    name,
    expect: { result: 'win', routes: ['projector'] },
    play({ run, waitFor, g }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto my_desk_spot busy');
      run('put my_desk');
      if (eat) {
        run('goto fridge busy');
        run('interact');
        run('eat');
        run('goto restroom_door busy');
        run('interact'); // in
        run('interact'); // wash
        run('interact'); // out
        run('goto my_seat busy');
      }
      run('sit busy');
      run('busy until 3:25');
      run('goto my_desk_spot busy');
      run('interact');
      run('goto projector');
      run('interact');
      run('goto 6,10');
      run('busy until 3:36');
      run('put lin_desk');
      run('goto meeting_seat busy');
      run('busy until 4:00');
      waitFor((g) => g.outcome, { maxSec: 10 });
      if (g.world.mug !== 'lin_desk') throw new Error(`the mug is at ${g.world.mug}, not Lin's desk`);
      if (g.outcome?.why !== why) throw new Error(`why ${g.outcome?.why}, expected ${why}`);
    },
  })),
  {
    name: 'same, but plant it on the boss\'s own desk once he is off for his smoke (3:38) → Lin looks at him 🤨👉, he sputters 😳☕❓ → win',
    expect: { result: 'win', routes: ['projector'] },
    play({ run, waitFor, g }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto my_desk_spot busy');
      run('put my_desk');
      run('sit busy');
      run('busy until 3:25');
      run('goto my_desk_spot busy');
      run('interact');
      run('goto projector');
      run('interact');
      run('goto 9,7');
      run('busy until 3:38');
      run('put boss_desk'); // stands at the desk's free end, in his empty office
      run('goto meeting_seat busy');
      run('busy until 4:00');
      waitFor((g) => g.outcome, { maxSec: 10 });
      if (g.outcome?.why !== 'bossMug') throw new Error(`why ${g.outcome?.why}, expected bossMug`);
    },
  },
  {
    name: 'at Kev\'s desk with the cup: his keyboard is one target, the desk\'s free end another (the put)',
    expect: { result: 'fail' },
    play({ run, g }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto 23,9 busy');
      if (g.player.focus?.action !== 'put' || g.player.focus?.id !== 'kev_desk') throw new Error(`at the free end the target is ${g.player.focus?.action}@${g.player.focus?.id}`);
      run('goto 22,7 busy');
      if (g.player.focus?.id !== 'kev_computer') throw new Error(`behind his monitor the target is ${g.player.focus?.id}`);
      run('busy until 4:00');
    },
  },
  {
    name: 'same, but leave the mug on your own desk while he hunts elsewhere → back from his smoke he sees it there → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, npc, g }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto my_desk_spot busy');
      run('put my_desk'); // on your desk while you type
      run('sit busy');
      waitFor((g) => g.world.kevGone, { busy: true }); // done before the boss's 3:12 walk
      run('goto my_desk_spot busy');
      run('interact');
      run('goto projector busy');
      run('interact');
      run('goto kitchen_table busy'); // out of the way of the boss's 3:12 walk
      waitFor(() => g.world.jacket === 'boss' && npc('boss').x > 24, { busy: true, maxSec: 120 }); // past you, off to the balcony for his smoke
      run('goto my_desk_spot busy');
      run('put my_desk busy');
      run('goto meeting_seat busy');
      run('busy until 4:00');
      if (g.world.mug !== 'my_desk') throw new Error(`the mug is at ${g.world.mug}, not your desk`);
    },
  },
  {
    name: 'same, mug back on the machine, but still by the machine at 4:00 → blamed (your empty chair)',
    expect: { result: 'blamed', routes: ['projector'] },
    play({ run, waitFor, g }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      waitFor((g) => g.world.kevGone);
      run('goto projector busy');
      run('interact');
      run('put coffee busy');
      run('busy until 4:00');
      waitFor((g) => g.outcome, { maxSec: 10 });
      if (g.outcome?.why) throw new Error(`blamed for the empty chair expected, got why ${g.outcome.why}`);
    },
  },
  {
    name: 'same, mug back on the machine, but in the restroom at 4:00 → blamed, and you walk in drying your hands (where restroom)',
    expect: { result: 'blamed', routes: ['projector'] },
    play({ run, waitFor, g }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      waitFor((g) => g.world.kevGone);
      run('goto projector busy');
      run('interact');
      run('put coffee busy');
      run('goto restroom_door busy');
      run('busy until 3:40');
      run('interact');
      if (g.player.inside !== 'restroom') throw new Error('not inside the restroom');
      run('busy until 4:00');
      waitFor((g) => g.outcome, { maxSec: 10 });
      if (g.outcome?.where !== 'restroom') throw new Error(`where ${g.outcome?.where}, not the restroom`);
    },
  },
  // ---- "Where were you?" at your desk (verdict.js verdictWhere; end-scenes-fails.js tableauWorking), one block.
  {
    name: 'same, mug back on the machine, but typing at your own desk at 4:00 → blamed, the room stares at the one person working (why working)',
    expect: { result: 'blamed', routes: ['projector'] },
    play({ run, waitFor, g }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      waitFor((g) => g.world.kevGone);
      run('goto projector busy');
      run('interact');
      run('put coffee busy');
      run('sit busy');
      run('busy until 4:00');
      waitFor((g) => g.outcome, { maxSec: 10 });
      if (g.outcome?.why !== 'working') throw new Error(`why ${g.outcome?.why}, not working`);
    },
  },
  {
    name: 'eat the sandwich, go into the restroom, wash off the mustard, come out clean; then knock while the boss is in there → 🚽😠 through the door',
    expect: { result: 'fail' },
    play({ run, g, log }) {
      run('goto fridge');
      run('interact');
      run('eat');
      run('goto restroom_door');
      run('interact');
      if (g.player.inside !== 'restroom' || !g.player.hidden) throw new Error('did not go in');
      run('interact');
      if (g.player.smeared) throw new Error('still smeared');
      if (!log.some((e) => e.name === 'restroom:washed')) throw new Error('no wash');
      run('interact');
      if (g.player.inside || g.player.hidden) throw new Error('did not come out');
      run('pretend until 3:19');
      run('interact');
      if (g.player.inside) throw new Error('walked into an occupied restroom');
    },
  },
  {
    name: 'keycard during boss restroom, timing Lin\'s glance → win',
    expect: { result: 'win', routes: ['keycard'] },
    play({ run, waitFor, npc }) {
      run('busy until 3:11');
      waitFor(() => !npc('boss').active || (npc('boss').label?.startsWith('away') && npc('boss').y > 8)); // boss out of his office
      run('goto boss_office_door busy');
      run('goto coat_rack busy');
      // wait until Lin is not looking (head turned well away) or not at her desk
      waitFor(() => { const l = npc('lin'); return !l.active || Math.abs(l.glance.offset) > 1.15; }, { busy: true, maxSec: 30 });
      run('interact');
      run('goto meeting_seat busy');
      run('busy until 4:00');
    },
  },
  {
    name: 'both routes in one loop: spill after Kev leaves, mug back on the machine, the card while the boss hunts the kitchen → locked out and no projector → win (the campfire)',
    expect: { result: 'win', routes: ['keycard', 'projector'] },
    play({ run, waitFor, npc, g }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      waitFor((g) => g.world.kevGone);
      run('goto projector');
      run('interact');
      run('put coffee');
      run('goto my_seat busy');
      run('sit busy');
      waitFor(() => npc('boss').x > 19, { maxSec: 120 }); // he has gone to the kitchen, looking for the cup
      run('goto coat_rack');
      waitFor(() => { const l = npc('lin'); return !l.active || Math.abs(l.glance.offset) > 1.15; }, { busy: true, maxSec: 30 });
      run('interact');
      if (g.player.held !== 'keycard') throw new Error('no keycard: ' + g.world.keycard);
      run('goto meeting_seat busy');
      run('busy until 4:00');
      waitFor((g) => g.outcome, { maxSec: 10 });
      if (g.outcome?.result !== 'win' || !g.outcome.routes.includes('keycard') || !g.outcome.routes.includes('projector')) {
        throw new Error(`both routes expected, got ${g.outcome?.result} ${g.outcome?.routes}`);
      }
    },
  },
  {
    name: 'combo, but eat it at the fridge and sit at your desk → hunting Lin sees the mustard 🥪❗👉, the boss hears → caught (the bib)',
    expect: { result: 'caught' },
    play({ run, waitFor, npc, g, log }) {
      waitFor(() => g.clock.minute >= 16);
      run('goto fridge busy');
      run('interact');
      run('eat'); // eat it right there: nobody who cares is watching...
      if (!g.player.smeared) throw new Error('no mustard after eating');
      run('goto my_seat busy');
      run('sit');
      waitFor(() => g.world.linKnows, { maxSec: 60 });
      const t = log.find((e) => e.name === 'witness:tattle' && e.payload.reason === 'evidence');
      if (!t) throw new Error('Lin never spotted the mustard');
      if (npc('lin').override === 'hunting') throw new Error('Lin kept hunting after she knew');
      run('busy until 4:00');
      if (g.outcome?.why !== 'bib') throw new Error(`caught over the mustard, but why ${g.outcome?.why}, not the bib`);
    },
  },
  {
    name: 'combo: sandwich before 3:00, keep it in your lap at your desk, eat it in the boss\'s corner → keycard in the gap → win',
    expect: { result: 'win', routes: ['keycard'] },
    play({ run, waitFor, npc, g }) {
      waitFor(() => g.clock.minute >= 16); // after Kev's coffee run (2:38–2:44) is over
      run('goto fridge busy');
      run('interact');
      run('goto my_seat busy');
      run('sit busy'); // seated and typing, the sandwich is in your lap under the desk
      waitFor(() => npc('lin').override === 'hunting');
      waitFor(() => !npc('boss').active || (npc('boss').label?.startsWith('away') && npc('boss').y > 8));
      run('goto boss_office_door busy');
      run('goto coat_rack busy');
      run('eat'); // eat it in the corner, out of the hunt's reach
      if (!g.player.smeared || g.player.held) throw new Error('did not eat');
      run('interact'); // the keycard
      if (g.player.held !== 'keycard') throw new Error('no keycard: ' + g.world.keycard);
      waitFor(() => { const l = npc('lin'); return l.override !== 'hunting' || l.x > 15; }, { maxSec: 40 });
      run('goto meeting_seat busy');
      run('busy until 4:00');
    },
  },
  {
    name: 'steal keycard, drop it on the boss\'s floor → he pockets it → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, npc, g, log }) {
      run('busy until 3:11');
      waitFor(() => !npc('boss').active || (npc('boss').label?.startsWith('away') && npc('boss').y > 8));
      run('goto boss_office_door busy');
      run('goto coat_rack busy');
      waitFor(() => { const l = npc('lin'); return !l.active || Math.abs(l.glance.offset) > 1.15; }, { busy: true, maxSec: 30 });
      run('interact');
      if (g.world.keycard !== 'player') throw new Error('theft failed: ' + g.world.keycard);
      run('interact'); // drop it right there
      run('goto my_seat busy');
      run('sit');
      run('busy until 4:00');
      if (!log.some((e) => e.name === 'keycard:recovered')) throw new Error('boss never recovered the card');
    },
  },
  {
    name: 'take the keycard while Lin looks this way → she shouts ❗👉, the boss hears → caught, and he takes his card back',
    expect: { result: 'caught' },
    play({ g, run, waitFor, npc }) {
      run('busy until 3:11');
      waitFor(() => !npc('boss').active || (npc('boss').label?.startsWith('away') && npc('boss').y > 8));
      run('goto boss_office_door busy');
      run('goto coat_rack busy');
      waitFor(() => { const l = npc('lin'); return l.active && Math.abs(l.glance.offset) < 0.3; }, { busy: true, maxSec: 30 });
      run('interact');
      run('wait 10s');
      waitFor(() => g.world.cardBack || !!g.outcome, { maxSec: 10 }); // he walks over for it (items.js walk)
      if (!g.world.cardBack) throw new Error('caught at the jacket, but the boss did not take his card back');
    },
  },
  {
    name: 'keycard in the gap, then let the locked-out boss in → he hugs you 🤗, sees his card 🪪❗ → caught (samaritan)',
    expect: { result: 'caught' },
    play({ run, waitFor, npc, g, log }) {
      run('busy until 3:11');
      waitFor(() => !npc('boss').active || (npc('boss').label?.startsWith('away') && npc('boss').y > 8));
      run('goto boss_office_door busy');
      run('goto coat_rack busy');
      waitFor(() => { const l = npc('lin'); return !l.active || Math.abs(l.glance.offset) > 1.15; }, { busy: true, maxSec: 30 });
      run('interact');
      run('goto meeting_seat busy');
      waitFor(() => g.world.bossLockedOut, { busy: true, maxSec: 400 });
      run('goto fire_door busy');
      run('interact');
      waitFor(() => !!g.outcome, { maxSec: 30 });
      if (!log.some((e) => e.name === 'boss:hug')) throw new Error('no hug');
      if (g.outcome.why !== 'samaritan') throw new Error('why: ' + g.outcome.why);
    },
  },
  {
    name: 'keycard in the gap, leave it on the floor, let the boss in → he hugs you 🤗 → at 4:00 a blank slide (samaritan fail)',
    expect: { result: 'fail' },
    play({ run, waitFor, npc, g, log }) {
      run('busy until 3:11');
      waitFor(() => !npc('boss').active || (npc('boss').label?.startsWith('away') && npc('boss').y > 8));
      run('goto boss_office_door busy');
      run('goto coat_rack busy');
      waitFor(() => { const l = npc('lin'); return !l.active || Math.abs(l.glance.offset) > 1.15; }, { busy: true, maxSec: 30 });
      run('interact');
      run('goto meeting_seat busy');
      waitFor(() => g.world.bossLockedOut, { busy: true, maxSec: 400 });
      run('interact'); // nothing else in reach: a tap drops it
      if (g.player.held) throw new Error('still holding ' + g.player.held);
      run('goto fire_door busy');
      run('interact');
      run('busy until 4:00'); // the hug stops it
      run('busy until 4:00');
      if (!log.some((e) => e.name === 'boss:hug')) throw new Error('no hug');
      if (g.outcome?.why !== 'samaritan') throw new Error('why: ' + g.outcome?.why);
    },
  },
  {
    name: 'just go home at 2:31 → out to the elevator, gone, the day lost (home: the bus, the phone buzzing)',
    expect: { result: 'fail' },
    play({ run, g }) {
      run('goto exit');
      run('interact');
      run('wait 5s');
      if (g.outcome?.why !== 'home') throw new Error('why: ' + g.outcome?.why);
      if (!g.player.hidden) throw new Error('you are still on the floor');
    },
  },
  {
    name: 'go home with Kev at 3:03 → both wave 👋👋 (homeKev)',
    expect: { result: 'fail' },
    play({ run, g }) {
      run('goto exit pretend');
      run('pretend until 3:03');
      run('interact');
      run('wait 5s');
      if (g.outcome?.why !== 'homeKev') throw new Error('why: ' + g.outcome?.why);
    },
  },
  {
    // His office is his (roles private): he sees you come in at his door, 🤨, and shows you out before the rack.
    name: 'walk in for the keycard while he sits there → 🤨, 👉 you 🚪, back at your desk without it',
    expect: { result: 'fail' },
    play({ run, waitFor, npc, g, log }) {
      waitFor(() => npc('lin').label?.startsWith('visit') || npc('lin').override === 'hunting' || npc('lin').x > 15); // Lin off to the kitchen (3:00)
      run('goto boss_office_door busy');
      run('goto coat_rack busy');
      waitFor(() => log.some((e) => e.name === 'trespass:out'), { maxSec: 20 });
      if (!log.some((e) => e.name === 'trespass')) throw new Error('the boss never showed you out');
      if (g.player.held) throw new Error('you left his office holding ' + g.player.held);
    },
  },
  // ---- More places for the coffee, more endings (one block: a parallel builder appends too).
  {
    name: 'coffee into the boss\'s ficus → 🌿😍, no cup for the projector → fail',
    expect: { result: 'fail' },
    play({ run, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto boss_doorway busy');
      run('interact');
      run('busy until 4:00');
      if (!log.some((e) => e.name === 'coffee:ficus')) throw new Error('the coffee never went into the plant');
    },
  },
  ...EVERY_COMPUTER,
  {
    // The boss is hunting for the cup: finding it in your hand in his office is proof, not a show-out (rules.js react).
    name: 'projector killed, then into the boss\'s office holding the mug, pretending → caught, not shown out',
    expect: { result: 'caught' },
    cmds: ['goto coffee_machine', 'interact', 'wait until 3:10', 'goto projector pretend', 'interact',
      'goto boss_desk pretend', 'pretend 4.5s', 'goto meeting_room pretend', 'wait until 4:00'],
  },

  // ---- The restroom holds one (restroom.js atTheDoor): you in it, they knock.
  {
    name: 'in the restroom when the boss comes for it at 3:18 → ✊🚪, 👊🚪😤, and you are out at the door, not caught; he goes in himself and is back on time',
    expect: { result: 'fail' },
    play({ run, waitFor, npc, g, log }) {
      run('goto restroom_door busy');
      run('busy until 3:12');
      run('interact');
      if (g.player.inside !== 'restroom') throw new Error('not inside');
      waitFor(() => log.some((e) => e.name === 'restroom:ejected'), { busy: true, maxSec: 60 });
      if (g.player.inside || g.player.hidden) throw new Error('still in there');
      if (!log.some((e) => e.name === 'restroom:knock' && e.payload.by === 'boss') || !log.some((e) => e.name === 'restroom:pound')) throw new Error('no knock, or no pounding');
      const from = log.length;
      run('goto my_seat busy');
      if (g.caught) throw new Error('caught: ' + g.caught.reason);
      run('busy until 3:30');
      if (!log.slice(from).some((e) => e.name === 'npc:vanish' && e.payload.id === 'boss')) throw new Error('the boss never went in');
      if (!npc('boss').active || !npc('boss').label?.endsWith('boss_desk')) throw new Error('the boss is not back at his desk at 3:30: ' + npc('boss').label);
      run('busy until 4:00');
    },
  },
  {
    name: 'mustard on you, in the restroom, the boss pounding: start washing → out mid-wash 🧼😳, the mustard still on you, into Lin\'s hunt: 🥪❗👉 (caught, by the usual rules)',
    expect: { result: 'caught' },
    play({ run, waitFor, g, log }) {
      run('goto fridge');
      run('interact');
      run('eat');
      run('goto restroom_door busy');
      run('interact'); // in, well before Lin misses it: her hunt never finds you in here
      waitFor(() => log.some((e) => e.name === 'restroom:pound'), { busy: true, maxSec: 60 });
      run('interact'); // the tap runs... not for long
      const out = log.find((e) => e.name === 'restroom:ejected');
      if (!out?.payload.washing) throw new Error('not put out mid-wash');
      if (!g.player.smeared) throw new Error('the mustard came off');
      if (log.some((e) => e.name === 'restroom:washed')) throw new Error('the wash went through');
      run('goto my_seat busy');
      run('busy until 4:00');
    },
  },
  {
    name: 'in the restroom when Lin comes for it at 3:35 → she knocks and waits, ⌚❓; you stay in: she gives up on time and is at her desk as ever',
    expect: { result: 'fail' },
    play({ run, waitFor, npc, g, log }) {
      run('goto restroom_door busy');
      run('busy until 3:31');
      run('interact');
      waitFor(() => log.some((e) => e.name === 'restroom:knock' && e.payload.by === 'lin'), { busy: true, maxSec: 60 });
      const from = log.length;
      run('busy until 3:45');
      if (log.filter((e) => e.name === 'restroom:knock' && e.payload.by === 'lin').length < 2) throw new Error('Lin knocked only once');
      if (log.slice(from).some((e) => e.name === 'npc:vanish' && e.payload.id === 'lin')) throw new Error('Lin went in with you');
      if (g.player.inside !== 'restroom') throw new Error('put out by someone');
      if (!npc('lin').active || !npc('lin').label?.endsWith('lin_desk')) throw new Error('Lin is not back at her desk at 3:45: ' + npc('lin').label);
      run('interact'); // out
      run('goto my_seat busy');
      run('busy until 4:00');
    },
  },
  {
    name: 'same, but you come out while Lin waits → she goes in for what is left of her time',
    expect: { result: 'fail' },
    play({ run, waitFor, npc, g, log }) {
      run('goto restroom_door busy');
      run('busy until 3:31');
      run('interact');
      waitFor(() => log.some((e) => e.name === 'restroom:knock' && e.payload.by === 'lin'), { busy: true, maxSec: 60 });
      run('interact'); // out
      if (g.player.inside) throw new Error('still inside');
      const from = log.length;
      run('goto my_seat busy');
      run('busy until 3:45');
      if (!log.slice(from).some((e) => e.name === 'npc:vanish' && e.payload.id === 'lin')) throw new Error('Lin never went in');
      if (!npc('lin').active || !npc('lin').label?.endsWith('lin_desk')) throw new Error('Lin is not back by 3:45: ' + npc('lin').label);
      run('busy until 4:00');
    },
  },

  // ---- The fire door, both ways (balcony.js). The card is taken in the gap while the boss is away (3:11).
  {
    name: 'out onto the balcony with his keycard, and back in on it → beep, inside; at 4:00 he is the one locked out (keycard win)',
    expect: { result: 'win', routes: ['keycard'] },
    play({ run, waitFor, npc, g }) {
      stealCard({ run, waitFor, npc });
      run('goto fire_door busy');
      run('interact'); // push the bar
      run('wait 1s');
      if (!(g.player.y > 14)) throw new Error('not out on the balcony: y ' + g.player.y);
      run('interact'); // the card to the reader
      run('wait 1s');
      if (!(g.player.y < 13)) throw new Error('not back in: y ' + g.player.y);
      if (g.player.held !== 'keycard') throw new Error('holding ' + g.player.held);
      run('goto meeting_seat busy');
      run('busy until 4:00');
    },
  },
  {
    name: 'out onto the balcony without the card at 2:31 → locked out; you stay out when he holds the door → 4:00 the table stares through the glass (balcony)',
    expect: { result: 'blamed' },
    play({ run, g, log }) {
      run('goto fire_door');
      run('interact');
      run('wait 1s');
      run('interact'); // pound: nobody comes
      if (!log.some((e) => e.name === 'toy:pound')) throw new Error('no pounding');
      run('busy until 4:00');
      run('busy until 4:00');
      if (!log.some((e) => e.name === 'fireDoor:held')) throw new Error('the boss never held the door');
      if (g.outcome?.why !== 'balcony') throw new Error('why: ' + g.outcome?.why);
    },
  },
  {
    name: 'out without the card, slip back in when the boss holds the door at 3:48 → inside again (plain fail)',
    expect: { result: 'fail' },
    play({ run, waitFor, g, log }) {
      run('goto fire_door');
      run('interact');
      run('busy until 3:47');
      waitFor(() => log.some((e) => e.name === 'fireDoor:held'), { busy: true, maxSec: 60 });
      run('interact'); // slip in
      run('wait 1s');
      if (!(g.player.y < 13)) throw new Error('not back in: y ' + g.player.y);
      run('goto meeting_seat busy');
      run('busy until 4:00');
    },
  },
  // The same, the way a person does it (the 2026-11-18 playtest: "when he opens the door to leave, i cant leave with
  // him"): no E, a person's reaction time, on foot through the open doorway. Both of his passes.
  {
    name: 'out without the card, waiting by the railing holding PRETEND; he comes out for his smoke → a beat later, walk in through the door still swinging (plain fail)',
    expect: { result: 'fail' },
    play({ run, waitFor, npc, g, log }) {
      run('goto fire_door');
      run('interact');
      run('wait 1s');
      run('move S 0.3s'); // off to the railing
      run('pretend until 3:42');
      waitFor(() => g.world.fireDoor?.open, { busy: true, maxSec: 60 }); // still holding PRETEND as it opens
      waitFor(() => npc('boss').y > 14.05, { maxSec: 5 }); // he steps out past you
      run('wait 0.7s'); // a person notices
      run('goto 27,14');
      run('move N 0.5s'); // W, at the doorway
      run('wait 1s');
      if (!(g.player.y < 13)) throw new Error('not back in: y ' + g.player.y);
      if (!log.some((e) => e.name === 'fireDoor:in')) throw new Error('no fireDoor:in');
      run('goto meeting_seat busy');
      run('busy until 4:00');
    },
  },
  {
    name: 'out without the card, holding PRETEND at the railing; he badges back in and holds the door → 2.5 s later, walk in past him; he follows (plain fail)',
    expect: { result: 'fail' },
    play({ run, waitFor, npc, g, log }) {
      run('goto fire_door');
      run('interact');
      run('wait 1s');
      run('move SE 0.4s'); // the far corner of the balcony
      run('pretend until 3:47');
      waitFor(() => log.some((e) => e.name === 'fireDoor:held'), { busy: true, maxSec: 60 });
      run('pretend 0.6s'); // still holding PRETEND: time must not run away with the door
      run('wait 1.9s'); // reads the 👉🚪
      if (!g.world.fireDoor?.open) throw new Error('the door shut on a person\'s reaction time');
      run('goto 27,14');
      run('move N 0.5s');
      run('wait 1s');
      if (!(g.player.y < 13)) throw new Error('not back in: y ' + g.player.y);
      run('wait 2s');
      if (!(npc('boss').y < 13.2)) throw new Error('the boss did not follow you in: y ' + npc('boss').y);
      run('goto meeting_seat busy');
      run('busy until 4:00');
    },
  },
  {
    name: 'card dropped in the kitchen, out on the balcony before his smoke → he is locked out with you → 4:00 nobody to hold it (together)',
    expect: { result: 'win', routes: ['keycard'] },
    play({ run, waitFor, npc, g }) {
      stealCard({ run, waitFor, npc });
      run('goto kitchen_table busy');
      run('interact'); // drop it, where he won't pass
      if (g.player.held) throw new Error('still holding ' + g.player.held);
      run('goto fire_door busy');
      run('interact');
      run('busy until 4:00');
      run('busy until 4:00');
      if (g.outcome?.why !== 'together') throw new Error('why: ' + g.outcome?.why);
    },
  },
  {
    name: 'out on the balcony holding his card when he comes for his smoke → he snatches it 🪪😤, badges in 😏 → 4:00 locked out (snatched)',
    expect: { result: 'blamed' },
    play({ run, waitFor, npc, g, log }) {
      stealCard({ run, waitFor, npc });
      run('goto fire_door busy');
      run('interact');
      run('busy until 4:00');
      run('busy until 4:00');
      if (!log.some((e) => e.name === 'keycard:snatched')) throw new Error('no snatch');
      if (g.outcome?.why !== 'snatched') throw new Error('why: ' + g.outcome?.why);
    },
  },
];

// The keycard in the gap: the boss away to the restroom (3:11), Lin looking the other way.
function stealCard({ run, waitFor, npc }) {
  run('busy until 3:11');
  waitFor(() => !npc('boss').active || (npc('boss').label?.startsWith('away') && npc('boss').y > 8));
  run('goto boss_office_door busy');
  run('goto coat_rack busy');
  waitFor(() => { const l = npc('lin'); return !l.active || Math.abs(l.glance.offset) > 1.15; }, { busy: true, maxSec: 30 });
  run('interact');
}
