// The level's NPC mechanics, in check order: level.lures, then level.hunts, then level.doors, each in level order.
// A mechanic kind (lure.js, hunt.js, door.js) exports, each optional except owns/key/build:
//   owns(data, npc)           npc.override is this mechanic's (for this NPC)
//   check(game, npc, data, now)  every step, before planning (lure: the pull; hunt: the end)
//   key(data, npc) / build(game, npc, plan, data)   the plan while it owns the override
//   tick(game, npc, dt, data)  every step while it owns the override, before walking
//   label(game, npc, data)     a debug label instead of the plan's (null: the plan's)
//   working(data, npc)         busy at the job: no daydreaming about wants (npcs.js crave)
//   prelude(game, npc, plan, data)  may add legs in front of any plan that isn't finished at birth
//   keepsThroughMeeting        the gather doesn't send its NPC to the meeting
import * as lure from './lure.js';
import * as hunt from './hunt.js';
import * as door from './door.js';

const KINDS = [['lures', lure], ['hunts', hunt], ['doors', door]];
const cache = new WeakMap();

export function mechanics(level) {
  let list = cache.get(level);
  if (!list) {
    list = KINDS.flatMap(([field, kind]) => (level[field] ?? []).map((data) => ({ kind, data })));
    cache.set(level, list);
  }
  return list;
}

// The mechanic that owns the NPC's current override, or null (none, the meeting, or a level hook's).
export function mechanicOf(game, npc) {
  if (!npc.override) return null;
  for (const m of mechanics(game.level)) if (m.kind.owns(m.data, npc)) return m;
  return null;
}

// Start the NPC's hunt (the first in level.hunts for her). Called by level behaviour hooks.
export function startHunt(game, npc) {
  const h = (game.level.hunts ?? []).find((d) => d.npc === npc.id);
  if (!h) throw new Error(`no hunt for '${npc.id}' in level.hunts`);
  hunt.start(game, npc, h);
}
