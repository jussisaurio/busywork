// Level 1's route checks for tools/routes.mjs: scripted "speedrun" solutions played through the AI-agent harness,
// each ending with the expected outcome. A check is
//   { name, expect: { result, routes? }, play(ctx) }   ctx: { g, run, waitFor, npc, log, transcript } (tools/routes.mjs)
//   { name, expect: { result, routes? }, cmds: [...] }  harness commands, run in order
// expect.routes: routes the outcome must include.
export default [
  {
    name: 'do nothing → fail',
    expect: { result: 'fail' },
    play({ run }) {
      run('busy until 4:00');
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
    name: 'same, mug back on the machine, but back at your desk at 4:00 → blamed (your empty chair)',
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
  {
    name: 'coffee into the typewriter → bang, the boss hears it → caught (typewriter)',
    expect: { result: 'caught' },
    play({ g, run, waitFor }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto typewriter busy');
      run('interact');
      waitFor((gg) => gg.outcome, { maxSec: 10 });
      if (g.outcome?.why !== 'typewriter') throw new Error(`caught for ${g.outcome?.why}, not the typewriter`);
    },
  },
  {
    // The boss is hunting for the cup: finding it in your hand in his office is proof, not a show-out (rules.js react).
    name: 'projector killed, then into the boss\'s office holding the mug, pretending → caught, not shown out',
    expect: { result: 'caught' },
    cmds: ['goto coffee_machine', 'interact', 'wait until 3:10', 'goto projector pretend', 'interact',
      'goto boss_desk pretend', 'pretend 4.5s', 'goto meeting_room pretend', 'wait until 4:00'],
  },
];
