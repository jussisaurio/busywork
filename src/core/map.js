// ASCII tile map parsing. Coordinates: tile (x, y) covers [x, x+1) x [y, y+1).
// Entity positions are floats in tile units; an entity standing "on" tile (x, y)
// has position (x + 0.5, y + 0.5).

// solid: blocks movement. opaque: blocks vision.
const BASE_LEGEND = {
  '#': { kind: 'wall', solid: true, opaque: true },
  'G': { kind: 'glass', solid: true, opaque: false },
  '.': { kind: 'floor', solid: false, opaque: false },
  ':': { kind: 'outside', solid: false, opaque: false },
  'D': { kind: 'door', solid: false, opaque: false },
  'T': { kind: 'desk', solid: true, opaque: false },
  'H': { kind: 'plant', solid: true, opaque: false },
};

const OUT_OF_BOUNDS = { kind: 'wall', solid: true, opaque: true };

// rows: array of equal-length strings.
// legend: extra/override entries. An entry with `interactable: '<type>'` registers
// each occurrence of that char as an interactable of that type (the rows `on` it act on it), with the id `id` if
// the entry has one, else the type: several letters can be one kind of thing (a computer) told apart by id. If the
// char appears more than once, ids are suffixed _0, _1, ... in reading order.
export function parseMap(rows, legend = {}) {
  const defs = { ...BASE_LEGEND, ...legend };
  const h = rows.length;
  const w = rows[0].length;
  rows.forEach((r, i) => {
    if (r.length !== w) throw new Error(`map row ${i} has length ${r.length}, expected ${w}`);
    for (const c of r) if (!defs[c]) throw new Error(`map row ${i}: unknown tile '${c}'`);
  });

  const counts = {};
  for (const r of rows) for (const c of r) counts[c] = (counts[c] || 0) + 1;
  const seen = {};
  const interactables = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = rows[y][x];
      const d = defs[c];
      if (d.interactable) {
        const n = seen[c] = (seen[c] ?? -1) + 1;
        const base = d.id ?? d.interactable;
        const id = counts[c] > 1 ? `${base}_${n}` : base;
        interactables.push({ id, type: d.interactable, char: c, x, y, cx: x + 0.5, cy: y + 0.5 });
      }
    }
  }

  const char = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? '#' : rows[y][x]);
  const tile = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? OUT_OF_BOUNDS : defs[rows[y][x]]);

  return {
    w,
    h,
    rows,
    defs,
    interactables,
    char,
    tile,
    isSolid: (x, y) => tile(x, y).solid,
    isOpaque: (x, y) => tile(x, y).opaque,
    // who: 'player' | 'npc'. Tiles with npcPassable let NPCs through but not the player.
    isWalkable(x, y, who = 'npc') {
      const t = tile(x, y);
      if (!t.solid) return true;
      return who === 'npc' && !!t.npcPassable;
    },
    find(c) {
      const out = [];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (rows[y][x] === c) out.push({ x, y });
      return out;
    },
  };
}
