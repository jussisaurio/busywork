// Headless tests for the NPC sim (src/sim/*). Run: node tools/test-sim.mjs [-v]
// Drives the sim directly (no player, interactions, rules or scenario): updateNpcs + updateFx + advanceClock per step.
import { createGame, resetLoop } from '../src/state.js';
import { createNpcs, updateNpcs } from '../src/sim/npcs.js';
import { speak } from '../src/sim/override.js';
import { findPath } from '../src/sim/nav.js';
import { updateFx } from '../src/core/fx.js';
import { advanceClock } from '../src/game/loop.js';
import { FIXED_DT, DAY_START, at, formatClock, clockArg, dayCue } from '../src/config.js';
import { inZone } from '../src/game/perception.js';
import { levels } from '../src/levels/index.js';

const LEVEL = levels.meeting; // createGame()'s default level
const { spots: SPOTS, patrols: ROUTES } = LEVEL;
const { meetingAt: MEETING_AT, gatherAt: MEETING_GATHER_AT } = LEVEL.day;

const VERBOSE = process.argv.includes('-v');
let fails = 0;
const ok = (c, m) => {
  if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m);
};
const fmt = (m) => (m == null ? '--:--' : formatClock(m).replace(' PM', ''));
const fmtS = (m) => { // with seconds-ish precision for close calls
  if (m == null) return '--';
  const whole = Math.floor(m);
  return `${fmt(m)}+${(m - whole).toFixed(2).slice(1)}`;
};

const spotAt = {};
for (const [name, s] of Object.entries(SPOTS)) spotAt[`${s.x},${s.y}`] = name;
const routePts = new Set(Object.values(ROUTES).flat().map(([x, y]) => `${x},${y}`));

// Run one day. hooks: [{ at: minute, fn(game) }] fired once when the clock passes `at`.
// sampleAt: minutes at which to snapshot NPC state. onStep(game) runs after updateNpcs.
function runDay({ hooks = [], until = MEETING_AT + 0.5, sampleAt = [], onStep, game: g0 } = {}) {
  const game = g0 ?? createGame();
  if (g0) resetLoop(game);
  game.npcs = createNpcs(game);
  game.phase = 'day';

  const R = {
    game, counts: {}, first: {}, events: [], says: [], arrivals: {}, snaps: {},
    solidViolations: [], lStuck: [], passes: {}, steps: 0, ms: 0,
  };
  const off = game.events.on('*', (name, p) => {
    R.counts[name] = (R.counts[name] || 0) + 1;
    if (!(name in R.first)) R.first[name] = game.clock.minute;
    if (name === 'say') R.says.push({ m: game.clock.minute, owner: p.owner, icons: p.icons.join(''), kind: p.kind });
    else R.events.push({ m: game.clock.minute, name, p });
  });
  const wasMoving = {};
  const onL = {};
  const lastPass = {};
  for (const n of game.npcs) { R.arrivals[n.id] = []; R.passes[n.id] = []; wasMoving[n.id] = false; onL[n.id] = 0; }
  const pending = hooks.slice().sort((a, b) => a.at - b.at);
  const samples = sampleAt.slice().sort((a, b) => a - b);

  const t0 = performance.now();
  while (game.clock.minute < until) {
    const m = game.clock.minute;
    while (pending.length && pending[0].at <= m) pending.shift().fn(game);
    updateNpcs(game, FIXED_DT);
    updateFx(game, FIXED_DT);
    if (onStep) onStep(game);
    for (const n of game.npcs) {
      // 6. never inside a solid tile (the doors NPCs pass, entrance L and fire door X, only while passing through)
      const tx = Math.floor(n.x), ty = Math.floor(n.y);
      const ch = game.map.char(tx, ty);
      if (game.map.isSolid(tx, ty) && ch !== 'L' && ch !== 'X') R.solidViolations.push(`${n.id} in '${ch}' (${n.x.toFixed(2)},${n.y.toFixed(2)}) at ${fmt(m)}`);
      onL[n.id] = ch === 'L' || ch === 'X' ? onL[n.id] + 1 : 0;
      if (onL[n.id] === 90) R.lStuck.push(`${n.id} on ${ch} for 1.5 s at ${fmt(m)}`);
      // arrivals: moving -> stopped
      if (wasMoving[n.id] && !n.moving && n.active !== false) {
        const name = spotAt[`${tx},${ty}`] ?? `(${tx},${ty})`;
        R.arrivals[n.id].push({ m, spot: name, label: n.label });
      }
      wasMoving[n.id] = n.moving;
      // route points walked through (patrol/hunt legs end exactly on tile centres)
      const k = `${tx},${ty}`;
      const onCentre = Math.abs(n.x - tx - 0.5) < 1e-6 && Math.abs(n.y - ty - 0.5) < 1e-6;
      if (onCentre && routePts.has(k) && lastPass[n.id] !== k) R.passes[n.id].push({ m, pt: `(${k})` });
      lastPass[n.id] = onCentre ? k : (Math.abs(n.x - tx - 0.5) + Math.abs(n.y - ty - 0.5) > 0.5 ? null : lastPass[n.id]);
    }
    while (samples.length && samples[0] <= m) {
      R.snaps[samples.shift()] = game.npcs.map((n) => [n.id, n.x, n.y, n.dir, n.glance.offset, n.active, n.pose, n.label]);
    }
    advanceClock(game, FIXED_DT);
    R.steps++;
  }
  R.ms = performance.now() - t0;
  off();
  return R;
}

const arr = (R, id, spot, from = -1, to = 1e9) => R.arrivals[id].find((a) => a.spot === spot && a.m >= from && a.m <= to)?.m;
const ev = (R, name, pred = () => true) => R.events.filter((e) => e.name === name && pred(e.p));
const evAt = (R, name, pred) => ev(R, name, pred)[0]?.m;
const said = (R, owner, icons) => R.says.filter((s) => s.owner === owner && s.icons === icons);
const npc = (R, id) => R.game.npcs.find((n) => n.id === id);
const atSpot = (n, spot) => Math.abs(n.x - (SPOTS[spot].x + 0.5)) < 0.01 && Math.abs(n.y - (SPOTS[spot].y + 0.5)) < 0.01;
const common = (R, tag) => {
  ok(R.solidViolations.length === 0, `${tag}: no NPC inside a solid tile${R.solidViolations.length ? ' — ' + R.solidViolations.slice(0, 3).join('; ') : ''}`);
  ok(R.lStuck.length === 0, `${tag}: nobody lingers on the entrance tile${R.lStuck.length ? ' — ' + R.lStuck.join('; ') : ''}`);
  ok(R.game.npcs.every((n) => n._navFail === 0), `${tag}: every destination reachable`);
};

// ---------------------------------------------------------------- nav sanity
{
  const g = createGame();
  const p = findPath(g.map, SPOTS.kev_desk, SPOTS.elevator);
  ok(p && p.some((t) => t.x === 4 && t.y === 13), 'nav: kev_desk -> elevator goes through the entrance L');
  ok(findPath(g.map, SPOTS.kev_desk, SPOTS.elevator, 'player') === null, 'nav: player cannot path through L');
  let cut = false;
  for (let i = 1; i < p.length; i++) {
    const a = p[i - 1], b = p[i];
    if (a.x !== b.x && a.y !== b.y && (!g.map.isWalkable(b.x, a.y) || !g.map.isWalkable(a.x, b.y))) cut = true;
  }
  ok(!cut, 'nav: no corner cutting');
  const all = Object.keys(SPOTS);
  const bad = [];
  for (const a of all) for (const b of all) if (!findPath(g.map, SPOTS[a], SPOTS[b])) bad.push(`${a}->${b}`);
  ok(bad.length === 0, `nav: all spots mutually reachable${bad.length ? ' — ' + bad.slice(0, 4).join(', ') : ''}`);
  const badRoute = Object.entries(ROUTES).flatMap(([r, pts]) => pts.filter(([x, y]) => !g.map.isWalkable(x, y)).map((q) => `${r}:${q}`));
  ok(badRoute.length === 0, 'nav: route points are floor');
  // Level 1 writes its times as at('3:10'), which counts from the default start (DAY_START): its day must agree.
  ok(LEVEL.day.start === DAY_START, 'level day.start matches the default start its at() times count from');
  // Clocks read the level's start: an afternoon day (2:30 PM) and a morning one (9:00 AM).
  ok(at('2:30') === 0 && at('4:00') === 90 && formatClock(90) === '4:00 PM' && clockArg(90) === '4:00', 'clock: 2:30 PM day (the default)');
  const AM = 9 * 60;
  ok(at('9:30', AM) === 30 && at('12:15', AM) === 195 && at('13:05', AM) === 245, "clock: 9:00 AM day reads '9:30' as AM, '12:15' as noon, '13:05' as 24-hour");
  ok(formatClock(0, AM) === '9:00 AM' && formatClock(245, AM) === '1:05 PM', 'clock: 9:00 AM day formats');
  ok([0, 30, 179, 180, 245, 600].every((m) => at(clockArg(m, AM), AM) === m) && [0, 89, 90].every((m) => at(clockArg(m)) === m), 'clock: clockArg reads back through at() in both days');
  const bare = { start: DAY_START, gatherAt: 26, meetingAt: 30 };
  ok(dayCue(bare, 'clockRedAt') === 25 && dayCue(bare, 'clockTickAt') === 25 && dayCue(bare, 'tockAt') === 28
    && dayCue(bare, 'halfMinuteAt') === 29 && dayCue(bare, 'beamAt') === 25, 'cues: default to minutes before meetingAt');
  ok(dayCue({ ...bare, clockRedAt: 20 }, 'clockTickAt') === 20 && dayCue({ ...bare, tockAt: 0 }, 'tockAt') === 0,
    'cues: a set time wins, and the wall clock ticks from a set red time');
  const routeIds = LEVEL.routes.map((r) => r.id);
  ok(LEVEL.outcomeOrder.length === routeIds.length && LEVEL.outcomeOrder.every((id) => routeIds.includes(id)), 'level outcomeOrder lists each route once');
}

// ---------------------------------------------------------------- 1. untouched day
const base = runDay({ sampleAt: [5, 20, 33, 47, 64, 80, 88] });
{
  const R = base;
  console.log('\n--- Test 1 timeline (untouched day) ---');
  for (const id of ['boss', 'lin', 'kev']) {
    const items = R.arrivals[id].map((a) => `${fmt(a.m)} ${a.spot}`);
    for (const e of R.events) if (e.p && e.p.id === id) items.push(`${fmt(e.m)} *${e.name.split(':')[1]}`);
    items.sort();
    console.log(`${id.padEnd(4)}: ${items.join(' | ')}`);
  }
  console.log(`events: ${R.events.filter((e) => !e.name.startsWith('npc:')).map((e) => `${fmt(e.m)} ${e.name}`).join(' | ')}`);
  console.log(`(${R.steps} steps in ${R.ms.toFixed(0)} ms)\n`);

  // Kev
  ok(arr(R, 'kev', 'coffee', at('2:38'), at('2:44')) != null, `kev reaches coffee in 2:38–2:44 (${fmt(arr(R, 'kev', 'coffee'))})`);
  ok(arr(R, 'kev', 'kev_desk', at('2:44'), at('2:58')) != null, `kev back at desk before 2:58 (${fmt(arr(R, 'kev', 'kev_desk', at('2:44')))})`);
  ok(said(R, 'kev', '🎒👋').length === 1, 'kev says 🎒👋 once');
  const kevLeft = evAt(R, 'kev:left');
  ok(kevLeft != null && kevLeft > at('3:02') && kevLeft < at('3:08'), `kev vanishes at the elevator ~3:06 (${fmt(kevLeft)})`);
  ok(R.game.world.kevGone === true && R.counts['kev:left'] === 1, 'kevGone true, kev:left once');
  ok(atSpot(npc(R, 'kev'), 'elevator') && !npc(R, 'kev').active, 'kev stays vanished at the elevator');

  // Boss
  const patrol = R.passes.boss.filter((p) => p.m > at('2:44') && p.m < at('2:56'));
  console.log(`  [patrol 2:44–2:56] ${patrol.map((p) => `${fmt(p.m)} ${p.pt}`).join(' ')} (route has ${ROUTES.boss_patrol.length} points)`);
  ok(patrol.length >= 3, `boss patrols the open plan (${patrol.length}/${ROUTES.boss_patrol.length} points before 2:56)`);
  ok(arr(R, 'boss', 'boss_desk', at('2:56'), at('3:12')) != null, `boss back at desk after patrol (${fmt(arr(R, 'boss', 'boss_desk', at('2:56')))})`);
  const bv = evAt(R, 'npc:vanish', (p) => p.id === 'boss');
  ok(bv != null && bv > at('3:12') && bv < at('3:22'), `boss vanishes in restroom 3:12–3:22 (${fmt(bv)})`);
  const ba = evAt(R, 'npc:appear', (p) => p.id === 'boss');
  ok(ba != null && Math.abs(ba - at('3:22')) < 0.05, `boss reappears at 3:22 (${fmt(ba)})`);
  ok(arr(R, 'boss', 'boss_desk', at('3:22'), at('3:33')) != null, `boss at desk before 3:33 (${fmt(arr(R, 'boss', 'boss_desk', at('3:22')))})`);
  ok(said(R, 'boss', '🚬❓').length === 1, 'boss thinks 🚬❓ once');
  const jk = evAt(R, 'boss:jacket');
  ok(jk != null && jk >= at('3:35') && jk < at('3:37'), `boss takes jacket ~3:35 (${fmtS(jk)})`);
  ok(R.game.world.keycard === 'boss' && R.game.world.jacket === 'boss', 'keycard and jacket -> boss');
  const bl = arr(R, 'boss', 'smoke', at('3:35'), at('3:48'));
  ok(bl != null, `boss out on the balcony for a smoke 3:35–3:48 (${fmt(bl)})`);
  const gone = ev(R, 'npc:vanish', (p) => p.id === 'boss').map((e) => e.m).filter((m) => m >= at('3:35') && m < at('3:54'));
  ok(!gone.length, `boss stays on the map through his smoke (no lift)${gone.length ? ` (vanished ${gone.map(fmt)})` : ''}`);
  const bb = evAt(R, 'boss:badge');
  ok(R.counts['boss:badge'] === 1 && bb >= at('3:48') && bb < at('3:51'), `boss badges back in at the fire door once, after 3:48 (${fmt(bb)})`);
  ok(!R.game.world.bossLockedOut && !R.counts['boss:lockedOut'], 'boss NOT locked out');

  // Lin
  ok(arr(R, 'lin', 'fridge', at('2:58'), at('3:04')) != null || R.first['sandwich:missing'] == null, `lin visits fridge`);
  ok(R.game.world.sandwich === 'lin' && !R.counts['sandwich:missing'], 'lin takes her sandwich (world.sandwich = lin)');
  ok(arr(R, 'lin', 'kitchen_table', at('3:00'), at('3:07')) != null, `lin at kitchen table before 3:07 (${fmt(arr(R, 'lin', 'kitchen_table'))})`);
  ok(arr(R, 'lin', 'lin_desk', at('3:07'), at('3:30')) != null, `lin back at desk (${fmt(arr(R, 'lin', 'lin_desk', at('3:07')))})`);
  const lv = evAt(R, 'npc:vanish', (p) => p.id === 'lin');
  ok(lv != null && lv > at('3:30') && lv < at('3:37'), `lin vanishes in restroom 3:30–3:37 (${fmt(lv)})`);
  ok(Math.abs(evAt(R, 'npc:appear', (p) => p.id === 'lin') - at('3:37')) < 0.05, 'lin reappears at 3:37');
  ok(arr(R, 'lin', 'lin_desk', at('3:37'), at('3:54')) != null, `lin back at desk after restroom (${fmt(arr(R, 'lin', 'lin_desk', at('3:37')))})`);

  // Meeting
  ok(R.counts['meeting:gather'] === 1 && Math.abs(R.first['meeting:gather'] - MEETING_GATHER_AT) < 0.05, 'meeting:gather fires once at 3:54');
  const bm = arr(R, 'boss', 'meeting_head', MEETING_GATHER_AT), lm = arr(R, 'lin', 'meeting_lin', MEETING_GATHER_AT);
  ok(bm != null && bm <= MEETING_AT, `boss at meeting_head by 4:00 (${fmtS(bm)})`);
  ok(lm != null && lm <= MEETING_AT, `lin at meeting_lin by 4:00 (${fmtS(lm)})`);
  ok(said(R, 'boss', '📊👀').length === 1 && !said(R, 'boss', '📊❌').length && !R.counts['meeting:calledOff'], 'boss reacts 📊👀 (projector ok)');
  ok(npc(R, 'boss').override === 'meeting' && npc(R, 'lin').override === 'meeting', 'override = meeting');
  common(R, 'day1');
}

// ---------------------------------------------------------------- 2. keycard stolen
{
  let leftOffice = false, reentered = false, lockedAt = null, maxBanged = 0;
  const R = runDay({
    hooks: [{ at: at('3:20'), fn: (g) => { g.world.keycard = 'player'; } }],
    onStep: (g) => {
      const b = g.npcs.find((n) => n.id === 'boss');
      if (inZone(g, 'outside', b.x, b.y)) leftOffice = true;
      if (g.world.bossLockedOut && lockedAt == null) lockedAt = g.clock.minute;
      if (lockedAt != null && !inZone(g, 'outside', b.x, b.y)) reentered = true;
      if (lockedAt != null && b.active && Math.hypot(b.x - g.level.spots.fire_door.x, b.y - g.level.spots.fire_door.y) < 1.2) maxBanged++;
    },
  });
  const b = npc(R, 'boss');
  ok(R.counts['boss:jacket'] === 1 && R.game.world.keycard === 'player', 'stolen: boss takes jacket, keycard stays with player');
  const jacketAt = evAt(R, 'boss:jacket');
  ok(leftOffice && lockedAt != null && lockedAt >= jacketAt, 'stolen: he steps out onto the balcony with his jacket; locked out only on the way back');
  ok(R.game.world.bossLockedOut && R.counts['boss:lockedOut'] === 1, `stolen: boss locked out (${fmtS(lockedAt)})`);
  ok(lockedAt >= at('3:48') && lockedAt < at('3:51'), `stolen: locked out right after his smoke, 3:48–3:51 (${fmtS(lockedAt)})`);
  ok(b.active && b.override === 'lockedOut' && !R.counts['boss:badge'], 'stolen: still on the map, on the balcony (no badge-in)');
  ok(maxBanged > 0, 'stolen: he stands at the fire door');
  const after = R.says.filter((x) => x.owner === 'boss' && x.m > lockedAt);
  ok(after.length >= 4, `stolen: he keeps at it, on screen (${after.length} lines after the lockout)`);
  for (const icon of ['🪪❓', '😠🚪🪪', '👊👊🚪']) ok(said(R, 'boss', icon).length >= 1, `stolen: boss says ${icon}`);
  ok((R.counts['boss:bang'] ?? 0) >= 2 && (R.counts['boss:pound'] ?? 0) >= 1, `stolen: bangs (${R.counts['boss:bang']}) and pounds (${R.counts['boss:pound']}) on the door`);
  ok(!reentered, 'stolen: boss never re-enters');
  ok(R.counts['meeting:gather'] === 1 && arr(R, 'lin', 'meeting_lin', MEETING_GATHER_AT) != null, 'stolen: lin still gathers');
  common(R, 'stolen');
}

// ---------------------------------------------------------------- 3. projector
const breakAt = (m) => ({ at: m, fn: (g) => { g.world.projector = 'broken'; g.events.emit('projector:broken', {}); } });
let projRun = null;
{
  const R = projRun = runDay({ hooks: [breakAt(at('2:50'))] });
  const fixed = evAt(R, 'projector:fixed');
  console.log(`  [2:50 break] alerted ${fmt(evAt(R, 'kev:alerted'))}, fixing ${fmt(evAt(R, 'projector:fixing'))}, fixed ${fmt(fixed)}, kev:left ${fmt(evAt(R, 'kev:left'))}`);
  ok(R.counts['kev:alerted'] === 1 && said(R, 'kev', '🔧❗').length === 1, 'proj 2:50: kev alerted 🔧❗');
  ok(arr(R, 'kev', 'projector') != null && R.counts['projector:fixing'] === 1, 'proj 2:50: kev walks to projector and fixes');
  ok(fixed != null && R.game.world.projector === 'ok' && said(R, 'kev', '👍').length === 1, 'proj 2:50: projector:fixed, back to ok, 👍');
  ok(R.game.world.kevGone && evAt(R, 'kev:left') > fixed, 'proj 2:50: kev still leaves afterwards');
  ok(said(R, 'boss', '📊👀').length === 1, 'proj 2:50: boss sees a working projector');
  common(R, 'proj 2:50');
}
{
  let labelAtBreak = null, movingAtBreak = false, posAtBreak = null;
  const R = runDay({
    hooks: [{ at: at('3:03'), fn: (g) => {
      const k = g.npcs.find((n) => n.id === 'kev');
      labelAtBreak = k.label; movingAtBreak = k.moving; posAtBreak = `(${k.x.toFixed(1)},${k.y.toFixed(1)})`;
    } }, breakAt(at('3:03'))],
  });
  const fixed = evAt(R, 'projector:fixed');
  console.log(`  [3:03 break] kev was '${labelAtBreak}' at ${posAtBreak}; fixed ${fmt(fixed)}, kev:left ${fmt(evAt(R, 'kev:left'))}`);
  ok(labelAtBreak === 'leave elevator' && movingAtBreak, 'proj 3:03: kev was walking out');
  ok(fixed != null && R.game.world.projector === 'ok', 'proj 3:03: kev turns back and fixes it');
  ok(R.game.world.kevGone && evAt(R, 'kev:left') > fixed, `proj 3:03: kev leaves afterwards`);
  common(R, 'proj 3:03');
}
{ // broken while Kev is already outside the glass (lobby): he comes back in through L
  let broke = null;
  const R = runDay({
    onStep: (g) => {
      const k = g.npcs.find((n) => n.id === 'kev');
      if (broke == null && k.active && k.y >= 14.2) {
        broke = `(${k.x.toFixed(1)},${k.y.toFixed(1)}) ${fmt(g.clock.minute)}`;
        g.world.projector = 'broken';
        g.events.emit('projector:broken', {});
      }
    },
  });
  console.log(`  [lobby break] kev at ${broke}; fixed ${fmt(evAt(R, 'projector:fixed'))}, kev:left ${fmt(evAt(R, 'kev:left'))}`);
  ok(broke && R.counts['projector:fixed'] === 1 && R.game.world.kevGone, 'proj lobby: kev turns back from the lobby, fixes, leaves');
  common(R, 'proj lobby');
}
{
  const R = runDay({ hooks: [breakAt(at('3:11'))], until: MEETING_AT + 3 }); // past 4:00: the call-off takes a few seconds
  ok(!R.counts['kev:alerted'] && R.game.world.projector === 'broken', 'proj 3:11 (after kevGone): stays broken');
  ok(said(R, 'boss', '📊❌').length === 1 && said(R, 'boss', '👋🚪').length === 1 && R.counts['meeting:calledOff'] === 1, 'proj 3:11: at 4:00 the boss calls it off 📊❌ 👋🚪');
  common(R, 'proj 3:11');
}
{ // late repairs keep Kev in the building; at 3:54 he finishes first, then joins the meeting
  const hooks = [];
  // re-break the projector every time it gets fixed, until 3:50
  const R = runDay({
    hooks,
    onStep: (g) => { if (g.world.projector === 'ok' && g.clock.minute > at('2:50') && g.clock.minute < at('3:50')) { g.world.projector = 'broken'; g.events.emit('projector:broken', {}); } },
  });
  const k = npc(R, 'kev');
  ok(!R.game.world.kevGone && k.override === 'meeting' && arr(R, 'kev', 'meeting_kev', MEETING_GATHER_AT) != null, `kept busy: kev fixes, then joins the meeting (${R.counts['projector:fixed']} repairs)`);
  common(R, 'kept busy');
}

// ---------------------------------------------------------------- 4. sandwich missing
{
  const R = runDay({ hooks: [{ at: at('2:59'), fn: (g) => { g.world.sandwich = 'player'; } }] });
  const miss = evAt(R, 'sandwich:missing');
  const lin = R.game.npcs.find((n) => n.id === 'lin');
  const huntPts = R.arrivals.lin.filter((a) => a.m > miss && a.m < at('3:24')).map((a) => a.spot);
  const end = said(R, 'lin', '😤')[0]?.m;
  console.log(`  [sandwich] missing ${fmt(miss)}, hunt stops ${fmt(end)}, hunt stops: ${huntPts.join(' ')}`);
  ok(R.counts['sandwich:missing'] === 1 && miss > at('2:58') && miss < at('3:06'), 'sandwich: sandwich:missing fires at the fridge');
  ok(said(R, 'lin', '🥪❓').length === 1 && said(R, 'lin', '😠').length === 1, 'sandwich: lin says 🥪❓ then 😠');
  ok(huntPts.length >= 4, `sandwich: lin walks the hunt route (${huntPts.length} stops)`);
  ok(end != null && Math.abs(end - at('3:24')) < 0.05, 'sandwich: hunt ends at 3:24 with 😤');
  ok(arr(R, 'lin', 'lin_desk', at('3:24'), at('3:30')) != null, `sandwich: lin resumes (desk at ${fmt(arr(R, 'lin', 'lin_desk', at('3:24')))})`);
  ok(evAt(R, 'npc:vanish', (p) => p.id === 'lin') > at('3:30'), 'sandwich: lin still takes her restroom break');
  ok(R.game.world.sandwich === 'player' && lin.override === 'meeting', 'sandwich: world.sandwich untouched by sim');
  common(R, 'sandwich');
}
{ // she spots the mustard at 3:10 (rules set world.linKnows): the hunt is over, back to her desk
  const R = runDay({ hooks: [{ at: at('2:59'), fn: (g) => { g.world.sandwich = 'eaten'; } }, { at: at('3:10'), fn: (g) => { g.world.linKnows = true; } }] });
  const end = said(R, 'lin', '😤')[0]?.m;
  ok(end != null && end >= at('3:10') && end < at('3:11'), `linKnows: hunt ends at once (${fmt(end)})`);
  ok(arr(R, 'lin', 'lin_desk', at('3:10'), at('3:18')) != null, `linKnows: back at her desk (${fmt(arr(R, 'lin', 'lin_desk', at('3:10')))})`);
  common(R, 'linKnows');
}

// ---------------------------------------------------------------- coffee: one cup per loop
{
  const R = base; // untouched day: the pot is Kev's
  const took = ev(R, 'coffee:taken');
  ok(took.length === 1 && took[0].p.by === 'kev' && took[0].m >= at('2:38') && took[0].m <= at('2:44'), `untouched: Kev pours the day's cup (${fmt(took[0]?.m)})`);
  ok(R.game.world.coffee === 'taken' && !ev(R, 'coffee:missing').length, "untouched: pot empty afterwards, no 'missing'");
  ok(npc(R, 'kev').carry === 'coffee' && npc(R, 'kev').wants === null, 'untouched: Kev carries his coffee (npc.carry), wants nothing');
}
{
  const R = runDay({ hooks: [{ at: at('2:33'), fn: (g) => { g.world.coffee = 'taken'; } }], until: at('2:50') });
  const miss = ev(R, 'coffee:missing');
  ok(miss.length === 1 && miss[0].p.by === 'kev' && !ev(R, 'coffee:taken').length, `pot taken earlier: Kev finds it empty (${fmt(miss[0]?.m)})`);
  ok(said(R, 'kev', '☕❓').length === 1 && said(R, 'kev', '😩').length === 1, 'pot taken earlier: Kev ☕❓ then 😩');
  ok(!npc(R, 'kev').carry, 'pot taken earlier: Kev empty-handed');
  ok(npc(R, 'kev').wants === 'coffee', 'pot taken earlier: Kev now craves a coffee (npc.wants)');
  const craves = said(R, 'kev', '🥱☕');
  ok(craves.length >= 3, `pot taken earlier: Kev yawns for coffee 🥱☕ (${craves.length}x, first ${fmt(craves[0]?.m)})`);
  ok(!said(base, 'kev', '🥱☕').length, 'untouched day: no craving');
  ok(arr(R, 'kev', 'kev_desk', at('2:44'), at('2:50')) != null, 'pot taken earlier: Kev still back at his desk on time');
  common(R, 'empty pot');
}

// ---------------------------------------------------------------- speak: an `after` line keeps its kind and ttl
{
  let seen = null;
  const lines = [{ say: ['🧪'], kind: 'thought', ttl: 1.1 }, { say: ['🧫'], kind: 'thought', after: 0.5, ttl: 7 }];
  runDay({
    hooks: [{ at: at('2:33'), fn: (g) => speak(g, g.npcs.find((n) => n.id === 'kev'), lines) }],
    until: at('2:35'),
    onStep: (g) => { seen ??= g.fx.bubbles.find((b) => b.owner === 'kev' && b.icons.join('') === '🧫') ?? null; },
  });
  ok(seen && seen.ttl === 7 && seen.kind === 'thought', `speak: the after line shows with its own ttl and kind (${seen ? `${seen.ttl}, ${seen.kind}` : 'never shown'})`);
}

// ---------------------------------------------------------------- away window too short
{ // Temporarily shorten the boss's restroom window (3:12 -> 3:15): he can't get there in time,
  // so he never vanishes and just carries on with the next entry. Restored right after.
  const entry = LEVEL.cast.find((d) => d.id === 'boss').schedule.find((e) => e.at === at('3:22'));
  entry.at = at('3:15');
  let R;
  try { R = runDay({ until: at('3:30') }); } finally { entry.at = at('3:22'); }
  ok(!ev(R, 'npc:vanish', (p) => p.id === 'boss').length && !ev(R, 'npc:appear').length, 'short away: boss never vanishes or reappears');
  ok(arr(R, 'boss', 'boss_desk', at('3:15'), at('3:28')) != null, `short away: boss continues to the next entry (desk at ${fmt(arr(R, 'boss', 'boss_desk', at('3:15')))})`);
  common(R, 'short away');
}

// ---------------------------------------------------------------- 5. determinism
{
  const SAMPLES = [5, 20, 33, 47, 64, 80, 88];
  const again = runDay({ sampleAt: SAMPLES });
  ok(JSON.stringify(base.snaps) === JSON.stringify(again.snaps) && Object.keys(base.snaps).length === SAMPLES.length,
    'determinism: two fresh runs identical at sampled timestamps');

  // Same game object: play part of a day (with meddling), then restart the loop.
  const g = createGame();
  runDay({ game: g, until: at('3:40'), hooks: [breakAt(at('2:50')), { at: at('2:59'), fn: (gg) => { gg.world.sandwich = 'player'; gg.world.keycard = 'player'; } }] });
  const restarted = runDay({ game: g, sampleAt: SAMPLES });
  ok(JSON.stringify(base.snaps) === JSON.stringify(restarted.snaps), 'determinism: restart (resetLoop + createNpcs) matches a fresh day');

  // Boss glance timing is independent of what happens to Kev / the projector.
  const trace = (hooks) => {
    const out = [];
    runDay({ hooks, onStep: (gg) => { const b = gg.npcs.find((n) => n.id === 'boss'); out.push(`${b.glance.offset.toFixed(6)},${b.x.toFixed(4)},${b.y.toFixed(4)}`); } });
    return out;
  };
  const tA = trace([]);
  const tB = trace([breakAt(at('2:50'))]);
  const tC = trace([{ at: at('2:59'), fn: (gg) => { gg.world.sandwich = 'player'; } }]);
  const glances = tA.filter((s, i) => i > 0 && s.split(',')[0] !== '0.000000' && tA[i - 1].split(',')[0] === '0.000000').length;
  ok(glances >= 8, `determinism: boss glances during the day (${glances})`);
  ok(tA.length === tB.length && tA.every((s, i) => s === tB[i]), 'determinism: boss glances identical with/without projector broken');
  ok(tA.every((s, i) => s === tC[i]), 'determinism: boss glances identical with/without sandwich stolen');
}

// ---------------------------------------------------------------- 5b. level data drives the specials (P3)
{
  // npc.anim follows the schedule entry: the boss smokes from his 3:35 entry (coat-rack walk included) until 3:48.
  const anims = [];
  runDay({ until: at('3:50'), onStep: (g) => {
    const b = g.npcs[0];
    const last = anims[anims.length - 1];
    if (b.anim !== (last?.anim ?? null)) anims.push({ m: g.clock.minute, anim: b.anim, label: b.label });
  } });
  ok(anims.length === 2 && anims[0].anim === 'smoking' && anims[0].label === 'visit smoke' && fmt(anims[0].m) === '3:35'
    && anims[1].anim === null, `anim: boss 'smoking' only during his smoke break, on the balcony (${anims.map((a) => `${fmt(a.m)} ${a.anim} '${a.label}'`).join(', ')})`);

  // A hook name the level doesn't define fails when the NPC is created, not mid-day.
  const badCast = LEVEL.cast.map((d) => (d.id === 'kev'
    ? { ...d, schedule: d.schedule.map((e) => (e.arrive ? { ...e, arrive: 'noSuchHook' } : e)) } : d));
  let msg = '';
  try { createNpcs(createGame({ level: { ...LEVEL, cast: badCast } })); } catch (e) { msg = e.message; }
  ok(/noSuchHook/.test(msg), `hooks: an unknown behaviour name throws at createNpcs (${msg || 'no throw'})`);

  // Without mechanics, hooks, leave effects or a fail sign, a level still runs its day: a cast on plain schedules.
  const strip = ({ prelude, arrive, gone, anim, ...e }) => e;
  const plain = {
    ...LEVEL, lures: undefined, hunts: undefined, doors: undefined, behaviours: undefined, failSign: undefined,
    cast: LEVEL.cast.map(({ meetingArrive, ...d }) => ({ ...d, schedule: d.schedule.map(strip) })),
  };
  const P = runDay({ game: createGame({ level: plain }), hooks: [breakAt(at('2:50'))] });
  const specials = ['kev:alerted', 'boss:jacket', 'boss:lockedOut', 'kev:left', 'coffee:taken', 'sandwich:missing'];
  ok(specials.every((e) => !P.counts[e]) && P.counts['meeting:gather'] === 1 && P.game.npcs.every((n) => !n._navFail),
    `level data: a level without mechanics or hooks runs its day (${specials.filter((e) => P.counts[e]).join(' ') || 'no specials'})`);
}

// ---------------------------------------------------------------- 6. perf (fast-forward headroom)
{
  ok(base.ms < 1000, `perf: full day (${base.steps} steps) in ${base.ms.toFixed(0)} ms`);
}

if (VERBOSE) {
  console.log('\nsays:', base.says.map((s) => `${fmt(s.m)} ${typeof s.owner === 'string' ? s.owner : 'pt'} ${s.icons}`).join(' | '));
}
console.log(fails ? `\n${fails} FAILED` : '\nall passed');
process.exit(fails ? 1 : 0);
