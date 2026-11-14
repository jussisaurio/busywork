// Who can see what. Shared by rules (witnesses), sim (reactions) and renderer (cones).
import { canSee, DIRS } from '../core/vision.js';
import { SPOTS } from '../data/level.js';

// The effective viewer for an NPC, including the current head glance.
export function viewerOf(npc) {
  return {
    x: npc.x,
    y: npc.y,
    dir: npc.dir + (npc.glance ? npc.glance.offset : 0),
    fov: npc.vision.fov,
    radius: npc.vision.radius,
  };
}

export function npcSees(game, npc, x, y) {
  if (!npc.active) return false;
  return canSee(game.map, viewerOf(npc), x, y);
}

// All NPCs that can currently see point (x, y).
export function witnesses(game, x, y) {
  return game.npcs.filter((n) => npcSees(game, n, x, y));
}

// Spot centre in tile units + facing in radians.
export function spotPos(name) {
  const s = SPOTS[name];
  if (!s) throw new Error(`unknown spot '${name}'`);
  return { x: s.x + 0.5, y: s.y + 0.5, dir: DIRS[s.face] };
}

export function findNpc(game, id) {
  return game.npcs.find((n) => n.id === id);
}
