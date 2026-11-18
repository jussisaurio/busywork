// Where a toy's walk draws a person (sim/mechanics/toy.js `stand`: the walk, its bounds and why the sim never knows).
// Read only: the sim records the walk in game.toys.walks; the renderer asks here where to draw him.
import { NPC_SPEED } from '../config.js';

const WALK_BACK = 1.8; // x his speed, hurrying back along his own track

export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Where the drawing of a walker is at game.loopTime: { x, y, dir, moving, fixing } or null (back on him).
export function walkAt(game, w) {
  const k = game.loopTime - w.t0;
  const go = dist(w.from, w.stand) / NPC_SPEED;
  if (k < go) {
    const f = k / go;
    return { x: w.from.x + (w.stand.x - w.from.x) * f, y: w.from.y + (w.stand.y - w.from.y) * f,
      dir: Math.atan2(w.stand.y - w.from.y, w.stand.x - w.from.x), moving: true, fixing: false };
  }
  if (k < go + w.fix) return { x: w.stand.x, y: w.stand.y, dir: Math.atan2(w.at.y - w.stand.y, w.at.x - w.stand.x), moving: false, fixing: true };
  let s = (k - go - w.fix) * NPC_SPEED * WALK_BACK;
  let a = w.stand;
  for (const b of [w.from, ...w.trail]) {
    const d = dist(a, b);
    if (s < d) {
      const f = s / d;
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, dir: Math.atan2(b.y - a.y, b.x - a.x), moving: true, fixing: false };
    }
    s -= d;
    a = b;
  }
  return null;
}

// For the renderer: where person `n` is drawn while a toy has him walk to a prop (header), or null (where he is).
export function toyWalkAt(game, n) {
  const w = game.toys?.walks?.[n.id];
  return w ? walkAt(game, w) : null;
}

