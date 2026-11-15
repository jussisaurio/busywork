// Who can see what. Shared by rules (witnesses), sim (reactions) and renderer (cones).
import { canSee, DIRS } from '../core/vision.js';
import { isDark, seesInDark } from './darkness.js';

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

// A dark point (level.darkness: game/darkness.js) is seen only up close or in a torch beam.
export function npcSees(game, npc, x, y) {
  if (!npc.active) return false;
  if (!game.level?.darkness || !isDark(game, x, y)) return canSee(game.map, viewerOf(npc), x, y);
  return seesInDark(game, npc, viewerOf(npc), x, y);
}

// All NPCs that can currently see point (x, y).
export function witnesses(game, x, y) {
  return game.npcs.filter((n) => npcSees(game, n, x, y));
}

// Spot centre in tile units + facing in radians. Spots belong to the level (game.level.spots).
export function spotPos(game, name) {
  const s = game.level.spots[name];
  if (!s) throw new Error(`unknown spot '${name}'`);
  return { x: s.x + 0.5, y: s.y + 0.5, dir: DIRS[s.face] };
}

// Is (x, y) inside the level's zone `name`? Zones are half-open: x0 <= x < x1, y0 <= y < y1.
export function inZone(game, name, x, y) {
  const z = game.level.zones[name];
  return !!z && x >= z.x0 && x < z.x1 && y >= z.y0 && y < z.y1;
}

export function findNpc(game, id) {
  return game.npcs.find((n) => n.id === id);
}
