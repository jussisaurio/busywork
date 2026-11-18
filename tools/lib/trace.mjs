// The behaviour trace behind tools/golden.mjs (and the gate's toy-neutral check, lib/toys.mjs): replays a harness
// plan and digests, command by command, every event (name, exact minute, payload) and a snapshot of the
// contract-level state (player, NPCs, world, suspicion, clock).
// Toys (level.toys, src/sim/mechanics/toy.js) are cosmetic: their events (`toy:<id>`, and a 'say' that carries `toy`)
// are left out, and their state (game.toys) is not in the snapshot, so adding a toy moves no golden.
import { createHash } from 'node:crypto';
import { createHarness } from '../../src/agent/harness.js';

const MAX_DRAIN_FRAMES = 60 * 60 * 5;

const r6 = (v) => (typeof v === 'number' ? v : v);
function snapshot(g) {
  const p = g.player;
  const prim = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v === null || typeof v !== 'object'));
  return {
    phase: g.phase,
    loop: g.persist.loop,
    routesFound: g.persist.routesFound,
    clock: { minute: g.clock.minute, forced: g.clock.forced, ff: g.clock.ff },
    player: { x: p.x, y: p.y, held: p.held, busy: p.busy, busyPose: p.busyPose, seated: p.seated, smeared: p.smeared, locked: p.locked },
    npcs: g.npcs.map((n) => ({ id: n.id, x: n.x, y: n.y, dir: r6(n.dir), active: n.active, pose: n.pose, override: n.override, carry: n.carry, wants: n.wants })),
    world: { ...prim(g.world), items: g.world.items.map((i) => ({ type: i.type, x: i.x, y: i.y })) },
    suspicion: g.level.roles?.authority ? g.suspicion[g.level.roles.authority.id] : null, // level 1: boss; none without an authority
    outcome: g.outcome ? { result: g.outcome.result, routes: g.outcome.routes } : null,
    caught: g.caught ? g.caught.reason : null,
  };
}

function safeJson(v) {
  const seen = new WeakSet();
  return JSON.stringify(v, (k, x) => {
    if (typeof x === 'function') return undefined;
    if (x && typeof x === 'object') {
      if (seen.has(x)) return '[cycle]';
      seen.add(x);
    }
    return x;
  });
}

const digest = (s) => createHash('sha1').update(s).digest('hex').slice(0, 16);

// Replays one plan; returns one digest per command plus a final one after the day ends.
// onFrame(game): after every frame (createHarness); the toy-neutral check fires toys from it.
export function trace(cmds, level, { onFrame } = {}) {
  const h = createHarness({ level, onFrame });
  h.begin();
  const g = h.game;
  let from = 0;
  const step = () => {
    const evs = h.log.slice(from);
    from = h.log.length;
    const s = evs.filter((e) => !isToyEvent(e)).map((e) => `${e.loop} ${e.minute} ${e.name} ${safeJson(e.payload)}`).join('\n') + '\n' + safeJson(snapshot(g));
    return { d: digest(s), evs };
  };
  const steps = [];
  for (const cmd of cmds) {
    const r = h.run(cmd);
    steps.push({ cmd, ...step(), text: r.text });
  }
  for (let i = 0; i < MAX_DRAIN_FRAMES && g.phase === 'day'; i++) h.frame();
  steps.push({ cmd: '(to end of day)', ...step(), text: '' });
  const o = g.outcome;
  return { digests: steps.map((s) => s.d), steps, summary: o ? `${o.result}${o.routes?.length ? ' ' + [...o.routes].sort().join('+') : ''}` : g.phase };
}


// A toy's event: cosmetic, never part of a behaviour digest.
export const isToyEvent = (e) => e.name.startsWith('toy:') || (e.name === 'say' && !!e.payload?.toy);
