// Camera: a remote vision cone. Whoever watches its monitor sees what the camera sees, so every office rule that
// asks "does he see you?" (witnesses, contraband, the authority's suspicion: play/rules.js) also counts what is on
// his screen. Unplug the monitor (live() false: static) or turn the camera to face a wall, and the screen shows
// nothing.
//
// Not an override mechanic (not one of mechanics/index.js KINDS): perception asks it (game/perception.js npcSees,
// seenVia), and only when the level has level.cameras, so a level without cameras never reaches this file. What a
// watcher does about a dead screen is the level's business (a lure on the world field its live() or aim() reads).
//
// Level data (level.cameras, a list):
//   id        its name (event payloads: `via`, the harness)
//   x, y      the lens, in tile units (floats: a wall camera sits just inside the floor tile in front of its wall)
//   dir       where it points (radians: 0 east, PI/2 south): the middle of its sweep
//   sweep     optional { arc, period, phase? }: it pans dir ± arc/2 and back every `period` sim seconds, as a sine
//             (so it lingers at both ends). phase: 0..1 of a period at loop time 0 (default 0: at dir, turning
//             toward dir + arc/2). Without a sweep it holds dir.
//   aim(world)  optional: a fixed direction (radians) that replaces the sweep while it returns a number (the
//             camera pushed round to face the wall: its cone then ends at the wall), null otherwise
//   fov, radius  its cone, as an NPC's vision (full angle in radians, tiles)
//   live(world)  optional: the picture reaches the monitor (default true). False: static, nobody sees through it
//   monitor   { x, y }: the screen, in tile units
//   npcs      the cast ids who watch it. One of them sees through the camera while he is on the floor (active),
//             within `reach` tiles of the monitor, with the monitor in his own cone and line of sight: a glance
//             away, or getting up and walking off, breaks it
//   reach     tiles (default REACH)
//   icon      what he points at when he sees you on the screen (default '📺')
//
// The sweep is a pure function of game.loopTime: no state on the game, nothing in world. Events: none of its own;
// the office rules add `via: <camera id>` to 'caught' and 'witness:tattle' when the reacting NPC saw you only on a
// screen.
import { canSee, angleDiff } from '../../core/vision.js';

// --- Tunables ------------------------------------------------------------------
export const REACH = 1.5; // tiles from a watcher to his monitor
export const SCREEN_ICON = '📺';
const BLIND = 1.2; // tiles: a camera whose every ray ends nearer than this shows a wall (feed: 'wall')
const BLIND_RAYS = 9; // rays cast across the cone to decide that

const TAU = Math.PI * 2;

// Where the camera points right now.
export function cameraDir(game, cam) {
  const fixed = cam.aim ? cam.aim(game.world) : null;
  if (typeof fixed === 'number') return fixed;
  const s = cam.sweep;
  if (!s) return cam.dir;
  return cam.dir + (s.arc / 2) * Math.sin(TAU * (game.loopTime / s.period + (s.phase ?? 0)));
}

// The camera as a viewer (core/vision.js canSee's shape).
export function cameraViewer(game, cam) {
  return { x: cam.x, y: cam.y, dir: cameraDir(game, cam), fov: cam.fov, radius: cam.radius };
}

// The picture reaches the monitor.
export const isLive = (game, cam) => !cam.live || !!cam.live(game.world);

// `npc` is watching `cam`'s monitor right now. v: his own viewer (game/perception.js viewerOf).
export function watches(game, npc, cam, v) {
  if (!npc.active || !cam.npcs.includes(npc.id)) return false;
  const m = cam.monitor;
  if (Math.hypot(m.x - npc.x, m.y - npc.y) > (cam.reach ?? REACH)) return false;
  return canSee(game.map, v, m.x, m.y);
}

// The level's camera through which `npc` (viewer v) sees point (x, y) on a screen, or null. His own eyes are the
// caller's business (perception.js).
export function feedFor(game, npc, v, x, y) {
  for (const cam of game.level.cameras) {
    if (isLive(game, cam) && watches(game, npc, cam, v) && canSee(game.map, cameraViewer(game, cam), x, y)) return cam;
  }
  return null;
}

// Distance from (ox, oy) along angle a to the first opaque tile, capped at max (a coarse ray march: render and
// harness only, never rules).
function rayLength(map, ox, oy, a, max) {
  const dx = Math.cos(a) * 0.1;
  const dy = Math.sin(a) * 0.1;
  let x = ox;
  let y = oy;
  for (let d = 0; d < max; d += 0.1) {
    x += dx;
    y += dy;
    if (map.isOpaque(Math.floor(x), Math.floor(y)) && !(Math.floor(x) === Math.floor(ox) && Math.floor(y) === Math.floor(oy))) return d;
  }
  return max;
}

// What the camera's screen shows right now, for painters and the harness (read-only):
//   { id, x, y, dir, fov, radius, live, feed, watcher, blips }: x .. radius is the camera as a viewer right now
//   feed     'static' (not live) | 'wall' (every ray ends at a wall within BLIND tiles) | 'live'
//   watcher  the id of whoever is watching it (`watcherId`, from perception.js), or null
//   blips    who is in its view, nearest last: [{ id, u, v, color }]: u -1..1 across the picture (left to right as
//            the camera looks), v 0..1 near to far. id 'player' is you
export function cameraFeed(game, cam, watcherId = null) {
  const view = cameraViewer(game, cam);
  const live = isLive(game, cam);
  let open = 0;
  for (let i = 0; i < BLIND_RAYS; i++) {
    const a = view.dir - view.fov / 2 + (view.fov * i) / (BLIND_RAYS - 1);
    open = Math.max(open, rayLength(game.map, view.x, view.y, a, view.radius));
  }
  const feed = !live ? 'static' : open < BLIND ? 'wall' : 'live';
  const blips = [];
  if (feed === 'live') {
    const add = (id, x, y, color) => {
      if (!canSee(game.map, view, x, y)) return;
      const d = Math.hypot(x - view.x, y - view.y);
      const u = angleDiff(Math.atan2(y - view.y, x - view.x), view.dir) / (view.fov / 2);
      blips.push({ id, u: Math.max(-1, Math.min(1, u)), v: Math.min(1, d / view.radius), color });
    };
    for (const n of game.npcs) if (n.active) add(n.id, n.x, n.y, n.color);
    const p = game.player;
    if (p) add('player', p.x, p.y, null);
    blips.sort((a, b) => b.v - a.v);
  }
  return { id: cam.id, x: cam.x, y: cam.y, dir: view.dir, fov: view.fov, radius: view.radius, live, feed, watcher: watcherId, blips };
}
