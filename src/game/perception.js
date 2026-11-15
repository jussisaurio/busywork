// Who can see what. Shared by rules (witnesses), sim (reactions) and renderer (cones).
import { canSee, DIRS } from '../core/vision.js';
import { feedFor, watches, cameraFeed as feedOf } from '../sim/mechanics/camera.js';

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

// He sees (x, y): with his own eyes, or on the screen of a camera he is watching (sim/mechanics/camera.js; only
// in a level with level.cameras).
export function npcSees(game, npc, x, y) {
  if (!npc.active) return false;
  const v = viewerOf(npc);
  if (canSee(game.map, v, x, y)) return true;
  return !!game.level.cameras && feedFor(game, npc, v, x, y) !== null;
}

// The camera on whose screen he sees (x, y), when he doesn't see it with his own eyes; null if he does, or doesn't
// see it at all (and always null in a level without cameras).
export function seenVia(game, npc, x, y) {
  if (!npc.active || !game.level.cameras) return null;
  const v = viewerOf(npc);
  if (canSee(game.map, v, x, y)) return null;
  return feedFor(game, npc, v, x, y);
}

// The NPC watching the level's camera `cam` right now (the first of its npcs who is), or null.
export function watcherOf(game, cam) {
  for (const id of cam.npcs) {
    const n = findNpc(game, id);
    if (n && watches(game, n, cam, viewerOf(n))) return n;
  }
  return null;
}

// What the screen of the level's camera `id` shows right now (camera.js cameraFeed), for painters and the harness.
export function cameraFeed(game, id) {
  const cam = (game.level.cameras ?? []).find((c) => c.id === id);
  if (!cam) throw new Error(`no camera '${id}' in level.cameras`);
  return feedOf(game, cam, watcherOf(game, cam)?.id ?? null);
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
