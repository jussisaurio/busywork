#!/usr/bin/env node
// Route verification: scripted "speedrun" solutions played through the AI-agent harness.
// Each scenario must end with the expected outcome. Run: node tools/routes.mjs [--verbose]
import { createHarness, describeEvents } from '../src/agent/harness.js';
import { formatClock } from '../src/config.js';

const verbose = process.argv.includes('--verbose');

// Helpers usable inside scenarios ------------------------------------------------------------
function makeCtx(h) {
  const g = h.game;
  const transcript = [];
  const run = (cmd) => {
    const r = h.run(cmd);
    transcript.push(`[${formatClock(g.clock.minute)}] > ${cmd} :: ${r.text.replace(/\n/g, ' / ')}`);
    for (const l of describeEvents(r.events)) transcript.push(l);
    if (!r.ok) throw new Error(r.text);
    return r;
  };
  // Tick small slices until pred() is true (pred sees the game). Uses `busy` or `wait` slices.
  const waitFor = (pred, { busy = true, maxSec = 120 } = {}) => {
    for (let i = 0; i < maxSec * 20 && g.phase === 'day'; i++) {
      if (pred(g)) return true;
      run(`${busy ? 'busy' : 'wait'} 0.05s`);
    }
    return pred(g);
  };
  const npc = (id) => g.npcs.find((n) => n.id === id);
  return { g, run, waitFor, npc, transcript, log: h.log };
}

const SCENARIOS = [
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
    name: 'projector too early, hang around the room → Kev makes the leap → desk work → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('goto projector busy');
      run('interact');
      try { run('goto meeting_seat busy'); } catch { /* Kev may stop us on the way */ }
      waitFor(() => log.some((e) => e.name === 'boss:workAssigned'), { maxSec: 30 }); // pretending doesn't help in the room
      run('busy until 4:00');
      const t = log.find((e) => e.name === 'witness:tattle');
      if (!(t && t.payload.by === 'kev' && t.payload.reason === 'scene' && t.payload.heard)) throw new Error('no scene tattle from Kev');
    },
  },
  {
    name: 'pour early, then stand by the empty pot openly → Kev ☕❓😩, spots your cup, takes it back → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, g, log }) {
      run('goto coffee_machine busy');
      run('interact');
      if (g.player.held !== 'coffee') throw new Error('no coffee poured');
      run('goto kev_desk busy'); // walk right past him: he doesn't care yet
      if (g.player.held !== 'coffee') throw new Error('Kev took the coffee before he knew it was gone');
      run('goto coffee_machine busy');
      waitFor((g) => log.some((e) => e.name === 'coffee:confiscated'), { busy: false, maxSec: 40 });
      if (!log.some((e) => e.name === 'coffee:missing')) throw new Error('Kev never found the pot empty');
      if (g.player.held === 'coffee') throw new Error('Kev let you keep his coffee');
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
    name: 'pour before Kev\'s coffee run, hide it, spill after he leaves → win',
    expect: { result: 'win', routes: ['projector'] },
    play({ run, waitFor, log }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      waitFor((g) => g.world.kevGone);
      if (!log.some((e) => e.name === 'coffee:missing' && e.payload.by === 'kev')) throw new Error('Kev never found the pot empty');
      run('goto projector busy');
      run('interact');
      run('goto meeting_seat busy');
      run('busy until 4:00');
    },
  },
  {
    name: 'same, but back at your desk at 4:00 → blamed',
    expect: { result: 'blamed', routes: ['projector'] },
    play({ run, waitFor }) {
      run('goto coffee_machine busy');
      run('interact');
      run('sit busy');
      waitFor((g) => g.world.kevGone);
      run('goto projector busy');
      run('interact');
      run('sit busy');
      run('busy until 4:00');
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
    name: 'combo, but eat it at the fridge and sit at your desk → hunting Lin sees the mustard 🥪❗👉 → fail',
    expect: { result: 'fail' },
    play({ run, waitFor, npc, g, log }) {
      waitFor(() => g.clock.minute >= 16);
      run('goto fridge busy');
      run('interact');
      run('interact'); // eat it right there: nobody who cares is watching...
      if (!g.player.smeared) throw new Error('no mustard after eating');
      run('goto my_seat busy');
      run('sit');
      waitFor(() => g.world.linKnows, { maxSec: 60 });
      const t = log.find((e) => e.name === 'witness:tattle' && e.payload.reason === 'evidence');
      if (!t) throw new Error('Lin never spotted the mustard');
      if (npc('lin').override === 'hunting') throw new Error('Lin kept hunting after she knew');
      run('busy until 4:00');
    },
  },
  {
    name: 'combo: sandwich before 3:00, hide it, eat it in the boss\'s corner → keycard in the gap → win',
    expect: { result: 'win', routes: ['keycard'] },
    play({ run, waitFor, npc, g }) {
      waitFor(() => g.clock.minute >= 16); // after Kev's coffee run (2:38–2:44) is over
      run('goto fridge busy');
      run('interact');
      run('goto my_seat busy');
      run('sit busy'); // typing hides what's in your hands
      waitFor(() => npc('lin').override === 'hunting');
      waitFor(() => !npc('boss').active || (npc('boss').label?.startsWith('away') && npc('boss').y > 8));
      run('goto boss_office_door busy');
      run('goto coat_rack busy');
      run('interact'); // eat it in the corner, out of the hunt's reach
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
    name: 'steal keycard while the boss glances back → caught',
    expect: { result: 'caught' },
    play({ run, waitFor, npc }) {
      waitFor(() => npc('lin').label?.startsWith('visit') || npc('lin').override === 'hunting' || npc('lin').x > 15); // Lin off to the kitchen (3:00)
      run('goto boss_office_door busy');
      run('goto coat_rack busy');
      // boss faces S (π/2); a positive head offset turns him west, toward the rack
      waitFor(() => npc('boss').glance.offset > 1.25, { maxSec: 40 });
      run('interact');
      run('wait 10s');
    },
  },
];

let failed = 0;
for (const sc of SCENARIOS) {
  const h = createHarness();
  h.begin();
  const ctx = makeCtx(h);
  let err = null;
  try {
    sc.play(ctx);
    // make sure the day finishes
    for (let i = 0; i < 60 * 300 && h.game.phase === 'day'; i++) h.frame();
  } catch (e) {
    err = e;
  }
  const o = h.game.outcome;
  const okResult = o && o.result === sc.expect.result;
  const okRoutes = !sc.expect.routes || (o && sc.expect.routes.every((r) => o.routes.includes(r)));
  const pass = !err && okResult && okRoutes;
  if (!pass) failed++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${sc.name}  → ${o ? `${o.result} [${o.routes.join(',')}] @ ${formatClock(o.minute)}` : 'no outcome'}${err ? `  (error: ${err.message})` : ''}`);
  if (verbose || !pass) console.log(ctx.transcript.map((l) => '      ' + l).join('\n'));
}
console.log(failed ? `\n${failed} scenario(s) failed` : '\nall routes verified');
process.exit(failed ? 1 : 0);
