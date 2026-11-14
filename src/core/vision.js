// Vision: cone test + grid line of sight. All coordinates in tile units (floats).
//
// viewer: { x, y, dir, fov, radius }  dir in radians (0 = +x/east, PI/2 = +y/south),
//         fov = full cone angle in radians, radius in tiles.

const TAU = Math.PI * 2;

export function angleDiff(a, b) {
  let d = (a - b) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}

export function inCone(viewer, tx, ty) {
  const dx = tx - viewer.x;
  const dy = ty - viewer.y;
  const dist = Math.hypot(dx, dy);
  if (dist > viewer.radius) return false;
  if (dist < 0.35) return true; // touching distance: always noticed
  return Math.abs(angleDiff(Math.atan2(dy, dx), viewer.dir)) <= viewer.fov / 2;
}

// Amanatides & Woo grid traversal. Opaque cells between the two endpoints block.
// The start and end cells themselves never block. When the ray passes exactly
// through a corner, either neighbouring opaque cell blocks (no peeking through
// diagonal wall gaps).
export function hasLineOfSight(map, ax, ay, bx, by) {
  let x = Math.floor(ax);
  let y = Math.floor(ay);
  const ex = Math.floor(bx);
  const ey = Math.floor(by);
  const dx = bx - ax;
  const dy = by - ay;
  const stepX = Math.sign(dx);
  const stepY = Math.sign(dy);
  const tDeltaX = stepX !== 0 ? Math.abs(1 / dx) : Infinity;
  const tDeltaY = stepY !== 0 ? Math.abs(1 / dy) : Infinity;
  let tMaxX = stepX > 0 ? (x + 1 - ax) / dx : stepX < 0 ? (ax - x) / -dx : Infinity;
  let tMaxY = stepY > 0 ? (y + 1 - ay) / dy : stepY < 0 ? (ay - y) / -dy : Infinity;
  const blocks = (cx, cy) => !(cx === ex && cy === ey) && map.isOpaque(cx, cy);
  const EPS = 1e-9;

  // Exactly |ex-x| + |ey-y| unit moves reach the end cell; a corner move counts as two.
  let n = Math.abs(ex - x) + Math.abs(ey - y);
  while (n > 0) {
    const needX = x !== ex;
    const needY = y !== ey;
    if (needX && needY && Math.abs(tMaxX - tMaxY) < EPS) {
      if (blocks(x + stepX, y) || blocks(x, y + stepY)) return false;
      x += stepX;
      y += stepY;
      tMaxX += tDeltaX;
      tMaxY += tDeltaY;
      n -= 2;
    } else if (needX && (!needY || tMaxX < tMaxY)) {
      x += stepX;
      tMaxX += tDeltaX;
      n -= 1;
    } else {
      y += stepY;
      tMaxY += tDeltaY;
      n -= 1;
    }
    if (blocks(x, y)) return false;
  }
  return true;
}

export function canSee(map, viewer, tx, ty) {
  return inCone(viewer, tx, ty) && hasLineOfSight(map, viewer.x, viewer.y, tx, ty);
}

export const DIRS = { E: 0, S: Math.PI / 2, W: Math.PI, N: -Math.PI / 2 };
