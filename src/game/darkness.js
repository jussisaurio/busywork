// Darkness: rooms whose lights are off, and what anyone can see in them. Sight only: the dark moves nobody by
// itself (an NPC who walks to a light switch is a lure; a light switch's clack is a noise).
//
// Level data (level.darkness, optional; absent: nothing is ever dark, and sight and render take their plain path):
//   rooms   [{ zone, lit(world) }]: a zone name (level.zones) or a list of names, dark while lit(world) is false.
//           A point in no room is always lit (daylight by a glass front). Overlapping rooms: dark if any is dark.
//   near    { radius, fov? }: how far anyone sees into the dark without a torch (default NEAR_RADIUS); fov
//           (radians, default the viewer's own) of that near sight
//   torch   { when(npc, world), fov, radius }: whether this NPC's torch is on right now, and its beam: a cone
//           along his gaze (his glance included, so a glance sweeps it). Optional: no torch, no beams.
//   controls  [{ tile, kind, on(world) }], optional: the light switches and breaker panels, drawn as the real thing
//           on their wall tile (render/darkness.js), on the side that faces the room. tile: a map letter (its
//           first tile, as decor.props); kind: one of CONTROL_KINDS ('switch' a wall switch, 'breaker' a breaker
//           panel); on(world): whether it is in its on position. Its little lamp glows while it is off, so you can
//           find it in the dark. Drawing only: flipping it is the level's interaction.
//
// Sight (perception.js npcSees): a lit point is seen as ever, through the viewer's own cone and line of sight,
// whether he stands in the light or the dark. A dark point is seen only within `near`, or in his torch beam (line
// of sight either way). Rules, witnesses, put-down finds and the harness all see through npcSees, so all of them
// see the dark the same way. Render: render/cones.js (cones in the light, near sight in the dark) and
// render/darkness.js (the dark itself, torch beams, eyes in the dark).
import { canSee } from '../core/vision.js';

export const NEAR_RADIUS = 1.5; // tiles: you see into the dark about an arm's length
export const CONTROL_KINDS = ['switch', 'breaker']; // darkness.controls kinds (render/darkness.js draws each)

const NONE = [];
const roomZones = new WeakMap(); // room -> its zone names as a list (cached: sight asks this per point)
function zonesOf(room) {
  let z = roomZones.get(room);
  if (!z) roomZones.set(room, (z = Array.isArray(room.zone) ? room.zone : [room.zone]));
  return z;
}
const within = (z, x, y) => !!z && x >= z.x0 && x < z.x1 && y >= z.y0 && y < z.y1;

// The zones (rects, tile units) that are dark right now; [] when the level has no darkness or every light is on.
export function darkZones(game) {
  const d = game.level.darkness;
  if (!d) return NONE;
  const out = [];
  for (const room of d.rooms) {
    if (room.lit(game.world)) continue;
    for (const name of zonesOf(room)) out.push(game.level.zones[name]);
  }
  return out;
}

// Is the point (x, y) dark right now?
export function isDark(game, x, y) {
  const d = game.level.darkness;
  if (!d) return false;
  const zones = game.level.zones;
  for (const room of d.rooms) {
    if (room.lit(game.world)) continue;
    for (const name of zonesOf(room)) if (within(zones[name], x, y)) return true;
  }
  return false;
}

// What `viewer` (perception.js viewerOf(npc)) reaches into the dark without a torch.
export function nearViewer(game, viewer) {
  const near = game.level.darkness?.near;
  return { ...viewer, radius: near?.radius ?? NEAR_RADIUS, fov: near?.fov ?? viewer.fov };
}

// His torch beam as a viewer (along his gaze), or null if he has no torch on.
export function torchViewer(game, npc, viewer) {
  const torch = game.level.darkness?.torch;
  if (!torch || !npc.active || !torch.when(npc, game.world)) return null;
  return { ...viewer, fov: torch.fov, radius: torch.radius };
}

// Does this viewer see the dark point (x, y)? (The caller already knows it is dark.)
export function seesInDark(game, npc, viewer, x, y) {
  if (canSee(game.map, nearViewer(game, viewer), x, y)) return true;
  const beam = torchViewer(game, npc, viewer);
  return !!beam && canSee(game.map, beam, x, y);
}
