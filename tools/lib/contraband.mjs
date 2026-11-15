// The gate's `contraband` check: the rules catch YOU carrying a thing marked `contraband: <authority id>` in his
// view, so a coworker carrying one in plain view of him (enforcing) makes the rule look one-sided. Replays each
// plan (harness commands; the gate passes the winning plans and the do-nothing day) and looks every frame.
//   contrabandSeen(levelId, plans, prep?)  [{ npc, item, minute, plan }] (at most one per npc and item)
//   contrabandCheck(found)          { name, ok, text, detail }
import { getLevel } from '../../src/levels/index.js';
import { createHarness } from '../../src/agent/harness.js';
import { npcSees } from '../../src/game/perception.js';
import { enforcing } from '../../src/play/rules.js';

const MAX_DRAIN_FRAMES = 60 * 60 * 5;

export function contrabandSeen(levelId, plans, prep = null) { // prep(game): after begin (tests)
  const level = getLevel(levelId);
  const boss = level.roles?.authority?.id;
  const marked = new Set(Object.entries(level.items ?? {}).filter(([, f]) => boss && f?.contraband === boss).map(([t]) => t));
  if (!marked.size) return [];
  const found = [];
  const once = new Set();
  for (const cmds of plans) {
    const h = createHarness({ level });
    const g = h.game;
    const look = () => {
      const a = g.npcs.find((n) => n.id === boss);
      if (g.phase !== 'day' || g.outcome || !enforcing(g, a)) return;
      for (const n of g.npcs) {
        if (n === a || !n.active || !marked.has(n.carry) || !npcSees(g, a, n.x, n.y)) continue;
        const key = `${n.id}:${n.carry}`;
        if (once.has(key)) continue;
        once.add(key);
        found.push({ npc: n.id, item: n.carry, minute: g.clock.minute, plan: cmds });
      }
    };
    const clear = g.input.clearPresses;
    g.input.clearPresses = () => { clear(); look(); };
    h.begin();
    prep?.(g);
    for (const cmd of cmds) h.run(cmd);
    for (let i = 0; i < MAX_DRAIN_FRAMES && g.phase === 'day'; i++) h.frame();
  }
  return found;
}

export function contrabandCheck(found) {
  if (!found) return { name: 'contraband', ok: true, text: 'not checked', detail: [] };
  if (!found.length) return { name: 'contraband', ok: true, text: 'no coworker carries the authority\'s contraband in his view', detail: [] };
  return {
    name: 'contraband', ok: false,
    text: `a coworker carries the authority's contraband in his view (he'd catch you for it): ${found.map((f) => `${f.npc} with ${f.item}`).join(', ')}`,
    detail: found.map((f) => `${f.npc} carries ${f.item} at minute ${f.minute.toFixed(2)}; plan: ${f.plan.join(' ; ') || '(do nothing)'}`),
  };
}
