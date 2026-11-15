// Headless tests for the fetch mechanic (src/sim/mechanics/fetch.js), on Discreet Packaging (src/levels/monitor, the
// only level with level.fetches): whoever sees the pink parcel loose on the floor walks over, picks it up, reads the
// label, and the office rules catch you for it (reason 'found').
//
//   node tools/test-fetch.mjs
import { createHarness } from '../src/agent/harness.js';
import { levels } from '../src/levels/index.js';
import { validateLevel } from '../src/levels/validate.js';

const MON = levels.monitor;
let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};

// The level with its parcel fetch changed by `patch` (null: no fetches at all).
const variant = (patch) => ({
  ...MON,
  fetches: patch === null ? [] : MON.fetches.map((f) => (f.item === 'parcel' ? { ...f, ...patch } : f)),
});

function play(level, cmds) {
  const h = createHarness({ level });
  h.begin();
  for (const c of cmds) if (h.game.phase === 'day' && !h.game.outcome && !h.game.caught) h.run(c);
  return { h, g: h.game, ev: (name) => h.log.find((e) => e.name === name) };
}
const finish = (h) => {
  for (let i = 0; i < 60 * 300 && h.game.phase === 'day'; i++) h.frame();
};

// Unplug the monitor (Bob's camera can't see you take it), take the parcel, drop it in the corridor: Lin walks that
// way to the pigeonholes at 3:50.
const TAKE = ['goto socket pretend', 'interact', 'goto pigeonholes pretend', 'interact'];
const DROP_IN_CORRIDOR = [...TAKE, 'goto corridor pretend', 'interact', 'goto own_desk pretend', 'sit'];

// 1. Someone sees it, walks over, picks it up, and you are caught for it.
{
  const { h, g, ev } = play(MON, DROP_IN_CORRIDOR);
  finish(h);
  const spotted = ev('parcel:spotted');
  const found = ev('parcel:found');
  ok(spotted && found && spotted.payload.by === found.payload.by, `spotted, then picked up by the same NPC (${found?.payload.by})`);
  ok(found && h.log.indexOf(spotted) < h.log.indexOf(found), 'spotting comes before picking up');
  ok(g.caught?.reason === 'found' && g.caught.by === found?.payload.by, `caught for it: ${g.caught?.reason} by ${g.caught?.by}`);
  ok(g.caught?.via === null, 'found in person, not on a screen (via null)');
  ok(g.world.parcel === 'found', "the level's found.set ran (world.parcel 'found')");
  const t = h.log.find((e) => e.name === 'caught');
  ok(t && h.log.indexOf(t) > h.log.indexOf(found), 'caught only after the pick-up');
}

// 2. Without `caught`, he keeps it and goes back to his day: no catch.
{
  const { h, g, ev } = play(variant({ caught: undefined }), DROP_IN_CORRIDOR);
  for (let i = 0; i < 60 * 600 && !ev('parcel:found') && g.phase === 'day'; i++) h.frame();
  const found = ev('parcel:found');
  for (let i = 0; i < 60 * 5; i++) h.frame();
  const npc = g.npcs.find((n) => n.id === found?.payload.by);
  ok(found && npc?.carry === 'parcel', `picked up, and ${npc?.id} carries it`);
  ok(!g.caught, 'nobody catches you 5 s later');
  ok(npc && npc.override !== MON.fetches[0].override, `his fetch override ended (${npc?.override})`);
}

// 3. You pick it back up before he gets there: he gives up.
{
  const level = MON;
  // Drop it in the corridor just before Lin comes past, wait for her to spot it, then take it straight back.
  const { h, g, ev } = play(level, [...TAKE, 'goto corridor pretend', 'pretend until 3:50', 'interact']);
  const rows = [];
  for (let i = 0; i < 60 * 120 && !ev('parcel:spotted') && g.phase === 'day'; i++) h.frame();
  const spotted = ev('parcel:spotted');
  const npc = g.npcs.find((n) => n.id === spotted?.payload.by);
  ok(spotted && npc?.override === level.fetches[0].override, `${npc?.id} spots it and sets off (${npc?.override})`);
  h.run('interact'); // pick it up again
  rows.push(g.player.held);
  for (let i = 0; i < 30; i++) h.frame();
  ok(rows[0] === 'parcel', 'it is back in your hands');
  ok(npc && npc.override !== level.fetches[0].override, `he gives up (${npc?.override})`);
  ok(!ev('parcel:found'), 'nobody picked it up');
}

// 4. Nobody fetches without level.fetches: it lies there and the day ends in a shrug (hidden).
{
  const { h, g, ev } = play(variant(null), DROP_IN_CORRIDOR);
  finish(h);
  ok(!ev('parcel:spotted') && !ev('parcel:found'), 'no fetch events');
  ok(g.outcome?.result === 'win' && g.outcome.routes.includes('hidden'), `win, hidden (${g.outcome?.result} ${g.outcome?.routes})`);
}

// 5. The validator rejects a bad fetch.
{
  const bad = (patch) => {
    try { validateLevel({ ...MON, fetches: [{ ...MON.fetches[0], ...patch }] }, 'monitor'); return null; } catch (e) { return e.message; }
  };
  ok(bad({}) === null, 'the level as is validates');
  ok(/fetches\[0\]/.test(bad({ item: 'nope' }) ?? ''), 'an unknown item type is rejected');
  ok(/fetches\[0\]/.test(bad({ npcs: ['nobody'] }) ?? ''), 'an unknown cast id is rejected');
}

console.log(fails ? `\n${fails} failed` : '\nall passed');
process.exit(fails ? 1 : 0);
