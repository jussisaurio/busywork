// Grid navigation for NPCs: A* over the tile map plus string-pulling.
//
// findPath()   -> raw tile path (8-directional, never cuts a corner past a solid tile)
// smoothPath() -> float waypoints (tile centres) with redundant points removed where a
//                 straight walk keeps the NPC's body box clear of non-walkable tiles.
//
// Everything here is pure (no module state); paths are computed once per destination change.

const SQRT2 = Math.SQRT2;
// 8 neighbours: dx, dy, cost
const NEIGHBOURS = [
  [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
  [1, 1, SQRT2], [1, -1, SQRT2], [-1, 1, SQRT2], [-1, -1, SQRT2],
];

// Octile distance: exact cost on an empty 8-connected grid.
function octile(ax, ay, bx, by) {
  const dx = Math.abs(ax - bx);
  const dy = Math.abs(ay - by);
  return dx + dy + (SQRT2 - 2) * Math.min(dx, dy);
}

// Tiny binary min-heap of cell indices ordered by f, then h (prefer nodes nearer the goal),
// then insertion order, so results are fully deterministic.
function createHeap() {
  const items = [];
  const less = (a, b) => a.f < b.f || (a.f === b.f && (a.h < b.h || (a.h === b.h && a.n < b.n)));
  return {
    get size() { return items.length; },
    push(it) {
      items.push(it);
      let i = items.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (!less(items[i], items[p])) break;
        [items[i], items[p]] = [items[p], items[i]];
        i = p;
      }
    },
    pop() {
      const top = items[0];
      const last = items.pop();
      if (items.length) {
        items[0] = last;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1;
          const r = l + 1;
          let m = i;
          if (l < items.length && less(items[l], items[m])) m = l;
          if (r < items.length && less(items[r], items[m])) m = r;
          if (m === i) break;
          [items[i], items[m]] = [items[m], items[i]];
          i = m;
        }
      }
      return top;
    },
  };
}

// from/to: {x, y} in tile units (floats are floored to their tile).
// Returns [{x, y}, ...] tile coords from start to goal inclusive, or null if unreachable.
// If the start tile isn't walkable (shouldn't happen), the search starts from the nearest
// walkable neighbour.
export function findPath(map, from, to, who = 'npc') {
  const { w, h } = map;
  const ok = (x, y) => map.isWalkable(x, y, who);
  let sx = Math.floor(from.x);
  let sy = Math.floor(from.y);
  const gx = Math.floor(to.x);
  const gy = Math.floor(to.y);
  if (!ok(gx, gy)) return null;
  if (!ok(sx, sy)) {
    const alt = NEIGHBOURS.map(([dx, dy]) => [sx + dx, sy + dy]).find(([x, y]) => ok(x, y));
    if (!alt) return null;
    [sx, sy] = alt;
  }

  const idx = (x, y) => y * w + x;
  const g = new Float64Array(w * h).fill(Infinity);
  const parent = new Int32Array(w * h).fill(-1);
  const closed = new Uint8Array(w * h);
  const heap = createHeap();
  let seq = 0;
  const start = idx(sx, sy);
  const goal = idx(gx, gy);
  g[start] = 0;
  heap.push({ i: start, f: octile(sx, sy, gx, gy), h: octile(sx, sy, gx, gy), n: seq++ });

  while (heap.size) {
    const { i } = heap.pop();
    if (closed[i]) continue;
    if (i === goal) break;
    closed[i] = 1;
    const x = i % w;
    const y = (i - x) / w;
    for (const [dx, dy, cost] of NEIGHBOURS) {
      const nx = x + dx;
      const ny = y + dy;
      if (!ok(nx, ny)) continue;
      // No corner cutting: a diagonal step needs both orthogonal neighbours free.
      if (dx !== 0 && dy !== 0 && (!ok(x + dx, y) || !ok(x, y + dy))) continue;
      const ni = idx(nx, ny);
      if (closed[ni]) continue;
      const ng = g[i] + cost;
      if (ng < g[ni] - 1e-9) {
        g[ni] = ng;
        parent[ni] = i;
        const hh = octile(nx, ny, gx, gy);
        heap.push({ i: ni, f: ng + hh, h: hh, n: seq++ });
      }
    }
  }

  if (g[goal] === Infinity) return null;
  const path = [];
  for (let i = goal; i !== -1; i = parent[i]) path.push({ x: i % w, y: Math.floor(i / w) });
  return path.reverse();
}

// Is the straight walk a->b clear for a body box of half-size r? (positions in tile units)
// Samples every 0.1 tiles; with r >= 0.1 the centre point can never enter a blocked tile.
function clearLine(map, ax, ay, bx, by, who = 'npc', r = 0.3) {
  const dist = Math.hypot(bx - ax, by - ay);
  const n = Math.max(1, Math.ceil(dist / 0.1));
  const ok = (x, y) => map.isWalkable(Math.floor(x), Math.floor(y), who);
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const x = ax + (bx - ax) * t;
    const y = ay + (by - ay) * t;
    if (!ok(x - r, y - r) || !ok(x + r, y - r) || !ok(x - r, y + r) || !ok(x + r, y + r)) return false;
  }
  return true;
}

// Tile path -> float waypoints (tile centres), string-pulled from the walker's current
// position (sx, sy). The first raw point is the walker's own tile centre, which is always
// reachable in a straight line (tiles are convex); consecutive raw points are adjacent and
// corner-safe, so every emitted segment is walkable.
export function smoothPath(map, tiles, sx, sy, who = 'npc', r = 0.3) {
  const pts = tiles.map((t) => ({ x: t.x + 0.5, y: t.y + 0.5 }));
  const out = [];
  let ax = sx;
  let ay = sy;
  let i = 0;
  while (i < pts.length) {
    let j = i;
    while (j + 1 < pts.length && clearLine(map, ax, ay, pts[j + 1].x, pts[j + 1].y, who, r)) j++;
    out.push(pts[j]);
    ax = pts[j].x;
    ay = pts[j].y;
    i = j + 1;
  }
  return out;
}
