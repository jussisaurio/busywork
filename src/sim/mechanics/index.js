// The level's NPC mechanics, in check order: level.lures, then level.hunts, then level.doors, then the spots a
// cast member owns (putdown.js), then level.inspections, each in level order.
// A mechanic kind (lure.js, hunt.js, door.js, putdown.js, inspection.js) exports, each optional except owns/key/build:
//   entries(level)            its data list, if not level[field]
//   owns(data, npc)           npc.override is this mechanic's (for this NPC)
//   check(game, npc, data, now, sim)  every step, before planning (lure: the pull; hunt: the end); sim: HOOK_API
//   key(data, npc) / build(game, npc, plan, data)   the plan while it owns the override
//   tick(game, npc, dt, data)  every step while it owns the override, before walking
//   label(game, npc, data)     a debug label instead of the plan's (null: the plan's)
//   working(data, npc)         busy at the job: no daydreaming about wants (npcs.js crave)
//   prelude(game, npc, plan, data)  may add legs in front of any plan that isn't finished at birth
//   keepsThroughMeeting        the gather doesn't send its NPC to the meeting
//   judge(game, rules)         every step, from the office rules (play/rules.js): true if it caught the player
// A mechanic only ever acts on the NPCs its data names (`npc`, or the list `npcs`): the sim asks each NPC's own
// list (mechanicsFor), so every hook above may assume the NPC is one of its own.
import * as lure from './lure.js';
import * as hunt from './hunt.js';
import * as door from './door.js';
import * as putdown from './putdown.js';
import * as inspection from './inspection.js';

const KINDS = [['lures', lure], ['hunts', hunt], ['doors', door], ['spots', putdown], ['inspections', inspection]];
const cache = new WeakMap();

export function mechanics(level) {
  let list = cache.get(level);
  if (!list) {
    list = KINDS.flatMap(([field, kind]) => (kind.entries?.(level) ?? level[field] ?? []).map((data) => ({ kind, data })));
    cache.set(level, list);
  }
  return list;
}

// The level's mechanics that name this NPC, in check order (cached per level and NPC id).
const byNpc = new WeakMap();
export function mechanicsFor(level, id) {
  let map = byNpc.get(level);
  if (!map) byNpc.set(level, (map = new Map()));
  let list = map.get(id);
  if (!list) {
    list = mechanics(level).filter(({ data }) => data.npc === id || (data.npcs ?? []).includes(id));
    map.set(id, list);
  }
  return list;
}

// The mechanic that owns the NPC's current override, or null (none, the meeting, or a level hook's).
export function mechanicOf(game, npc) {
  if (!npc.override) return null;
  for (const m of mechanicsFor(game.level, npc.id)) if (m.kind.owns(m.data, npc)) return m;
  return null;
}

// Start the NPC's hunt (the first in level.hunts for her). Called by level behaviour hooks.
export function startHunt(game, npc) {
  const h = (game.level.hunts ?? []).find((d) => d.npc === npc.id);
  if (!h) throw new Error(`no hunt for '${npc.id}' in level.hunts`);
  hunt.start(game, npc, h);
}

// The mechanics' say in the office rules (play/rules.js calls this every step; rules: its helpers, see putdown.js
// judge). True if one caught the player.
const JUDGES = KINDS.map(([, kind]) => kind).filter((kind) => kind.judge);
export function judge(game, rules) {
  for (const kind of JUDGES) if (kind.judge(game, rules)) return true;
  return false;
}
