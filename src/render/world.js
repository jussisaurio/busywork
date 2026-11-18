// The office: a static layer (floors, walls, glass, furniture) cached in an offscreen
// canvas, plus dynamic props drawn every frame (jacket on the rack, projector state,
// wall clock, coffee carafe, dropped items, elevator doors).
import {
  T, hash, rrect, circle, ellipse, fillCircle, fillEllipse, emoji, clamp, fin, clockHands, drawScreen,
} from './util.js';
import { C } from './palette.js';
import { itemGlyph } from './characters.js';
import { WORK_PENALTY_MIN } from '../config.js';

const FRONT = 14; // px of visible wall front face (3/4 depth)

// What a map tile draws as: its legend entry's `draw`, else its kind (core/map.js; off the map: 'wall'). The base
// legend's kinds are draws already; a level's own letters say which one they look like. The draws:
//   wall            a wall block                        floor      the floor of its room (decor.zoneSeeds)
//   glass           a glass partition                   outside    the lobby's tiled floor
//   entrance        a glass door in a glass wall, doormats either side
//   door            a doorway in a wooden frame         restroom   a wall with a 🚻 door in it
//   elevator        a wall with lift doors; they open as an active NPC nears decor.elevator.spot
//   desk            a desk or table tile: touching desk tiles make one piece of furniture, drawn by what it holds
//   own_desk        a desk tile that makes its piece the player's workstation
//   meeting_table   a desk tile that makes its piece the meeting table (rug, notepads; a slideProjector prop on it)
//   coffee_machine  a desk tile with a coffee machine on it: its piece is the kitchen counter
//   plant           a potted plant                      coat_rack  a coat-rack stand (the coatRack prop hangs things)
//   refrigerator    a tall fridge
// Any other draw is plain floor (a decor prop can stand on it). The level validator (src/levels/validate.js)
// rejects a legend `draw` not in TILE_DRAWS.
export const TILE_DRAWS = [
  'wall', 'glass', 'entrance', 'door', 'restroom', 'elevator', 'floor', 'outside', 'desk', 'own_desk',
  'meeting_table', 'coffee_machine', 'plant', 'coat_rack', 'refrigerator',
];
const WALLISH = new Set(['wall', 'restroom', 'elevator']);
const STRUCT = new Set([...WALLISH, 'glass', 'entrance', 'door']); // glass arms connect to these
// Draws that join into one desk piece; a decor.deskOwners spot faces one of these.
export const DESK_DRAWS = ['desk', 'own_desk', 'meeting_table', 'coffee_machine'];
const DESKISH = new Set(DESK_DRAWS);
const STEP = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }; // a spot's face as a tile step

// The draw at tile (x, y), from a grid built once per map.
const drawGrids = new WeakMap();
function drawAt(map, x, y) {
  if (x < 0 || y < 0 || x >= map.w || y >= map.h) return 'wall';
  let grid = drawGrids.get(map);
  if (!grid) {
    grid = [];
    for (let ty = 0; ty < map.h; ty++) for (let tx = 0; tx < map.w; tx++) {
      const t = map.tile(tx, ty);
      grid.push(t.draw ?? t.kind);
    }
    drawGrids.set(map, grid);
  }
  return grid[y * map.w + x];
}
// Every tile with draw `name`, in reading order.
function findDraw(map, name) {
  const out = [];
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) if (drawAt(map, x, y) === name) out.push({ x, y });
  return out;
}

const FACE = { N: -Math.PI / 2, S: Math.PI / 2, E: 0, W: Math.PI };

// Set dressing comes from the level (level.decor, e.g. src/levels/meeting/decor.js). Every field is optional.
const NO_DECOR = {};
const NO_PADS = {};
const NONE = [];
const decorOf = (level) => level.decor || NO_DECOR;
// A workstation whose owner has no decor.desks entry.
const DESK_STYLE = { screen: '#37494c', screenArt: null, mug: C.ochre, prop: 'paper' };

// --- map analysis (cached per map) ------------------------------------------
const infoCache = new WeakMap();
function mapInfo(map, level) {
  const SPOTS = level.spots;
  let info = infoCache.get(map);
  if (info) return info;
  const decor = decorOf(level);
  const w = map.w;
  const h = map.h;
  const zone = new Array(w * h).fill(null);
  const barrier = (d) => STRUCT.has(d);
  const flood = (sx, sy, name) => {
    const stack = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const i = y * w + x;
      if (zone[i] || barrier(drawAt(map, x, y))) continue;
      zone[i] = name;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  };
  for (const s of decor.zoneSeeds || []) flood(s.x, s.y, s.zone);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = drawAt(map, x, y);
      if (d === 'outside') zone[y * w + x] = 'lobby';
      else if (!zone[y * w + x] && !barrier(d)) zone[y * w + x] = 'carpet';
    }
  }

  // Desk components (connected desk-like tiles: DESKISH).
  const seen = new Set();
  const desks = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!DESKISH.has(drawAt(map, x, y)) || seen.has(y * w + x)) continue;
      const comp = { x0: x, y0: y, x1: x, y1: y, draws: new Set() };
      const stack = [[x, y]];
      seen.add(y * w + x);
      while (stack.length) {
        const [cx, cy] = stack.pop();
        comp.draws.add(drawAt(map, cx, cy));
        comp.x0 = Math.min(comp.x0, cx);
        comp.x1 = Math.max(comp.x1, cx);
        comp.y0 = Math.min(comp.y0, cy);
        comp.y1 = Math.max(comp.y1, cy);
        for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (!DESKISH.has(drawAt(map, nx, ny)) || seen.has(ny * w + nx)) continue;
          seen.add(ny * w + nx);
          stack.push([nx, ny]);
        }
      }
      const z = zone[comp.y0 * w + comp.x0];
      if (comp.draws.has('own_desk')) comp.kind = 'player';
      else if (comp.draws.has('meeting_table')) comp.kind = 'meeting';
      else if (comp.draws.has('coffee_machine')) comp.kind = 'counter';
      else if (z === 'kitchen') comp.kind = 'kitchenTable';
      else if (z === 'office') comp.kind = 'exec';
      else comp.kind = 'work';
      // The sitter: a decor.deskOwners spot (at the player's desk, player_desk) whose face points into this
      // piece. Its face turns the workstation (comp.face; no sitter: 'N', sat at from the south).
      const facesIn = (s) => {
        const step = s && STEP[s.face];
        if (!step) return false;
        const tx = s.x + step[0];
        const ty = s.y + step[1];
        return tx >= comp.x0 && tx <= comp.x1 && ty >= comp.y0 && ty <= comp.y1 && DESKISH.has(drawAt(map, tx, ty));
      };
      comp.owner = null;
      comp.face = 'N';
      for (const spot of decor.deskOwners || []) {
        if (facesIn(SPOTS[spot])) {
          comp.owner = spot.replace(/_desk$/, '');
          comp.face = SPOTS[spot].face;
        }
      }
      if (comp.kind === 'player') {
        comp.owner = 'player';
        if (facesIn(SPOTS.player_desk)) comp.face = SPOTS.player_desk.face;
      }
      desks.push(comp);
    }
  }
  const find1 = (c) => map.find(c)[0] || null;
  const sc = decor.screen;
  info = {
    zone,
    zoneAt: (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? null : zone[y * w + x]),
    desks,
    playerDesk: desks.find((d) => d.kind === 'player') || null,
    props: (decor.props || NONE).map((pr) => find1(pr.tile)), // decor.props' tiles, in order (null: not on the map)
    entrance: findDraw(map, 'entrance')[0] || null,
    elevator: findDraw(map, 'elevator'),
    screen: sc ? { x: sc.x * T + 2, y: frontY(sc.y) - 1, w: sc.w * T - 6, h: 28 } : null,
  };
  infoCache.set(map, info);
  return info;
}

// =============================================================================
// Static layer
// =============================================================================
export function drawStaticLayer(ctx, map, level) {
  const SPOTS = level.spots;
  const decor = decorOf(level);
  const info = mapInfo(map, level);
  ctx.fillStyle = C.wallVoid;
  ctx.fillRect(0, 0, map.w * T, map.h * T);

  // 1. floors
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) drawFloorTile(ctx, map, info, x, y);
  // 2. rugs and mats
  drawRugs(ctx, map, info);
  // 3. soft shadow at the foot of walls
  for (let y = 1; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      if (WALLISH.has(drawAt(map, x, y))) continue;
      if (!WALLISH.has(drawAt(map, x, y - 1))) continue;
      ctx.fillStyle = 'rgba(30,18,10,0.10)';
      ctx.fillRect(x * T, y * T, T, 7);
      ctx.fillRect(x * T, y * T, T, 3);
    }
  }
  // 4. walls
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) if (WALLISH.has(drawAt(map, x, y))) drawWall(ctx, map, x, y);
  // 5. glass, doors, entrance, restroom, elevator
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const d = drawAt(map, x, y);
      if (d === 'glass') drawGlass(ctx, map, x, y, false);
      else if (d === 'entrance') drawGlass(ctx, map, x, y, true);
      else if (d === 'door') drawDoor(ctx, map, x, y);
      else if (d === 'restroom') drawRestroom(ctx, x, y);
    }
  }
  if (info.elevator.length) drawElevator(ctx, info.elevator);
  // 6. wall decorations
  drawWallDecor(ctx, map, info, decor);
  // 7. chairs (under desks), 8. desks
  for (const c of decor.chairs || []) {
    const p = c.spot ? SPOTS[c.spot] : c;
    if (p) drawChair(ctx, p.x * T + T / 2, p.y * T + T / 2, FACE[c.face], c.color[0], c.color[1]);
  }
  for (const d of info.desks) drawDesk(ctx, d, decor);
  // 9. appliances and props
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const d = drawAt(map, x, y);
      if (d === 'plant') drawPlant(ctx, x * T + T / 2, y * T + T / 2);
      else if (d === 'refrigerator') drawFridge(ctx, x * T, y * T);
      else if (d === 'coffee_machine') drawCoffeeMachine(ctx, x * T, y * T);
      else if (d === 'coat_rack') drawRackBase(ctx, x * T + T / 2, y * T + T / 2);
    }
  }
  // ashtray on the tile east of a spot
  const ash = decor.ashtray && SPOTS[decor.ashtray.spot];
  if (ash) {
    const ax = (ash.x + 1) * T + 10;
    const ay = (ash.y) * T + 8;
    fillEllipse(ctx, ax, ay + 6, 6, 2.5, 'rgba(0,0,0,0.2)');
    fillCircle(ctx, ax, ay, 5, C.steelDark);
    fillCircle(ctx, ax, ay, 3.6, '#d9cfb4');
    fillCircle(ctx, ax + 1, ay - 0.5, 0.9, '#6d6156');
  }
}

// --- floors ------------------------------------------------------------------
function floorKindForGlassSide(info, x, y) {
  return info.zoneAt(x, y) || 'carpet';
}

function drawFloorTile(ctx, map, info, x, y) {
  const d = drawAt(map, x, y);
  if (WALLISH.has(d)) return;
  if (isGlass(d)) {
    // Split the tile between the floors on either side of the glass.
    const horiz = STRUCT.has(drawAt(map, x - 1, y)) || STRUCT.has(drawAt(map, x + 1, y));
    if (horiz) {
      clipPaint(ctx, x, y, x * T, y * T, T, T / 2, floorKindForGlassSide(info, x, y - 1));
      clipPaint(ctx, x, y, x * T, y * T + T / 2, T, T / 2, floorKindForGlassSide(info, x, y + 1));
    } else {
      clipPaint(ctx, x, y, x * T, y * T, T / 2, T, floorKindForGlassSide(info, x - 1, y));
      clipPaint(ctx, x, y, x * T + T / 2, y * T, T / 2, T, floorKindForGlassSide(info, x + 1, y));
    }
    return;
  }
  const kind = d === 'door' ? 'carpet' : info.zoneAt(x, y) || 'carpet';
  paintFloor(ctx, kind, x, y);
}

function clipPaint(ctx, x, y, sx, sy, sw, sh, kind) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(sx, sy, sw, sh);
  ctx.clip();
  paintFloor(ctx, kind, x, y);
  ctx.restore();
}

function paintFloor(ctx, kind, x, y) {
  const px = x * T;
  const py = y * T;
  if (kind === 'lobby') {
    ctx.fillStyle = (x + y) & 1 ? C.lobbyA : C.lobbyB;
    ctx.fillRect(px, py, T, T);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(px + 4, py + T);
    ctx.lineTo(px + 14, py + T);
    ctx.lineTo(px + T, py + 12);
    ctx.lineTo(px + T, py + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = C.grout;
    ctx.fillRect(px, py, T, 1);
    ctx.fillRect(px, py, 1, T);
    return;
  }
  if (kind === 'kitchen') {
    for (let qy = 0; qy < 2; qy++) {
      for (let qx = 0; qx < 2; qx++) {
        ctx.fillStyle = (qx + qy) & 1 ? C.kitchenB : C.kitchenA;
        ctx.fillRect(px + qx * 16, py + qy * 16, 16, 16);
      }
    }
    ctx.fillStyle = 'rgba(80,70,50,0.05)';
    for (let i = 0; i < 4; i++) ctx.fillRect(px + hash(x, y, i) * 30, py + hash(x, y, i + 9) * 30, 2, 2);
    return;
  }
  const office = kind === 'office';
  const block = ((x >> 1) + (y >> 1)) & 1;
  ctx.fillStyle = office ? (block ? C.officeA : C.officeB) : block ? C.carpetA : C.carpetB;
  ctx.fillRect(px, py, T, T);
  // carpet-tile grain, alternating direction per 2x2 block
  ctx.strokeStyle = C.carpetGrain;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const o = 3.5 + i * 6.5;
    if (block) {
      ctx.moveTo(px + o, py);
      ctx.lineTo(px + o, py + T);
    } else {
      ctx.moveTo(px, py + o);
      ctx.lineTo(px + T, py + o);
    }
  }
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = hash(x, y, i) < 0.55 ? C.carpetDark : C.carpetLight;
    ctx.fillRect(px + hash(x, y, i + 20) * 31, py + hash(x, y, i + 40) * 31, 1.4, 1.4);
  }
  ctx.fillStyle = C.carpetSeam;
  if ((x & 1) === 0) ctx.fillRect(px, py, 1, T);
  if ((y & 1) === 0) ctx.fillRect(px, py, T, 1);
}

function drawRugs(ctx, map, info) {
  // Executive office: mustard rug with teal border under the desk.
  const bd = info.desks.find((d) => d.kind === 'exec');
  if (bd) {
    const x = (bd.x0 - 1) * T + 8;
    const y = (bd.y0 - 1) * T + 6;
    const w = (bd.x1 - bd.x0 + 3) * T - 16;
    const h = 2.6 * T;
    ctx.fillStyle = C.rugBorder;
    rrect(ctx, x, y, w, h, 3);
    ctx.fill();
    ctx.fillStyle = C.rug;
    rrect(ctx, x + 4, y + 4, w - 8, h - 8, 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,240,200,0.35)';
    ctx.lineWidth = 1;
    rrect(ctx, x + 8, y + 8, w - 16, h - 16, 2);
    ctx.stroke();
  }
  // Meeting room rug.
  const md = info.desks.find((d) => d.kind === 'meeting');
  if (md) {
    const x = (md.x0 - 1) * T + 14;
    const y = (md.y0 - 1) * T + 10;
    const w = (md.x1 - md.x0 + 3) * T - 28;
    const h = (md.y1 - md.y0 + 3) * T - 20;
    ctx.fillStyle = C.meetingRug;
    rrect(ctx, x, y, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(230,210,160,0.35)';
    ctx.lineWidth = 2;
    rrect(ctx, x + 5, y + 5, w - 10, h - 10, 4);
    ctx.stroke();
  }
  // Doormats at the entrance.
  if (info.entrance) {
    const { x, y } = info.entrance;
    ctx.fillStyle = C.mat;
    rrect(ctx, x * T + 3, (y + 1) * T + 2, T - 6, 12, 2);
    ctx.fill();
    rrect(ctx, x * T + 3, (y - 1) * T + T - 12, T - 6, 10, 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 4; i++) ctx.fillRect(x * T + 6 + i * 6, (y + 1) * T + 4, 2, 8);
  }
}

// --- walls -------------------------------------------------------------------
function drawWall(ctx, map, x, y) {
  const px = x * T;
  const py = y * T;
  const wall = (cx, cy) => WALLISH.has(drawAt(map, cx, cy));
  const front = y + 1 < map.h && !wall(x, y + 1);
  const enclosed = wall(x - 1, y) && wall(x + 1, y) && wall(x, y - 1) && wall(x, y + 1) &&
    wall(x - 1, y - 1) && wall(x + 1, y + 1) && wall(x - 1, y + 1) && wall(x + 1, y - 1);
  const topH = front ? T - FRONT : T;
  ctx.fillStyle = enclosed ? C.wallVoid : C.wallTop;
  ctx.fillRect(px, py, T, topH);
  if (!enclosed) {
    // faint pattern on the wall cap
    ctx.fillStyle = 'rgba(255,230,200,0.03)';
    ctx.fillRect(px, py + (x & 1) * 6, T, 3);
    ctx.fillStyle = C.wallRim;
    if (y > 0 && !wall(x, y - 1)) ctx.fillRect(px, py, T, 2);
    if (!wall(x - 1, y)) ctx.fillRect(px, py, 2, topH);
    if (!wall(x + 1, y)) ctx.fillRect(px + T - 2, py, 2, topH);
    if (!front && y + 1 < map.h && !wall(x, y + 1)) ctx.fillRect(px, py + T - 2, T, 2);
  }
  if (front) {
    const fy = py + T - FRONT;
    ctx.fillStyle = C.wallFront;
    ctx.fillRect(px, fy, T, FRONT);
    // walnut paneling grooves
    ctx.fillStyle = C.wallGroove;
    for (let gx = 7; gx < T; gx += 8) ctx.fillRect(px + gx, fy + 2, 1, FRONT - 4);
    ctx.fillStyle = C.wallShade;
    ctx.fillRect(px, fy, T, 2);
    ctx.fillStyle = 'rgba(255,220,180,0.10)';
    ctx.fillRect(px, fy + 2, T, 1);
    ctx.fillStyle = C.baseboard;
    ctx.fillRect(px, py + T - 3, T, 3);
  }
}

// --- glass -------------------------------------------------------------------
const isGlass = (d) => d === 'glass' || d === 'entrance';

// Glass partitions must read as windows at a glance: a tall translucent pane with the floor
// showing through, thin frame rails, a mullion between panes and diagonal reflection streaks.
// Horizontal runs show the pane's face (3/4 view); vertical runs are a wide framed strip.
const GLASS_TOP = 4; // horizontal pane: top rail, px below the tile top
const GLASS_BOT = 28; // horizontal pane: sill
const GLASS_HW = 7; // vertical strip: half width

function drawGlass(ctx, map, x, y, entrance) {
  const px = x * T;
  const py = y * T;
  const cx = px + T / 2;
  const n = STRUCT.has(drawAt(map, x, y - 1));
  const s = STRUCT.has(drawAt(map, x, y + 1));
  const w = STRUCT.has(drawAt(map, x - 1, y));
  const e = STRUCT.has(drawAt(map, x + 1, y));
  const horiz = w || e || !(n || s);
  const vert = n || s;
  const frame = entrance ? C.entranceFrame : C.glassFrame;
  const top = py + GLASS_TOP;
  const bot = py + GLASS_BOT;

  if (vert) {
    // A corner tile only carries the strip down to the horizontal pane's top rail.
    const y0 = n ? py : py + T / 2 - GLASS_HW;
    const y1 = horiz ? top : s ? py + T : py + T / 2 + GLASS_HW;
    glassPane(ctx, cx - GLASS_HW, y0, GLASS_HW * 2, y1 - y0, hash(x, y, 5), false);
    ctx.fillStyle = frame;
    ctx.fillRect(cx - GLASS_HW - 1, y0, 2.5, y1 - y0);
    ctx.fillRect(cx + GLASS_HW - 1.5, y0, 2.5, y1 - y0);
    ctx.fillStyle = C.glassFrameHi;
    ctx.fillRect(cx - GLASS_HW - 1, y0, 1, y1 - y0);
    ctx.fillStyle = C.glassPost;
    if (n && isGlass(drawAt(map, x, y - 1))) ctx.fillRect(cx - GLASS_HW - 1, py - 1, GLASS_HW * 2 + 2, 2); // mullion
    else if (n) ctx.fillRect(cx - GLASS_HW - 1, py, GLASS_HW * 2 + 2, 3); // head rail against the wall
  }

  if (horiz) {
    const x0 = w ? px : cx - GLASS_HW;
    const x1 = e ? px + T : cx + GLASS_HW;
    // contact shadow on the floor in front of the sill
    ctx.fillStyle = 'rgba(30,18,10,0.13)';
    ctx.fillRect(x0, bot + 1, x1 - x0, 3);
    glassPane(ctx, x0, top, x1 - x0, bot - top, hash(x, y, 3), true);
    ctx.fillStyle = frame;
    ctx.fillRect(x0, top - 1, x1 - x0, 3); // top rail, seen from above
    ctx.fillRect(x0, bot - 2, x1 - x0, 3.5); // sill
    ctx.fillStyle = C.glassFrameHi;
    ctx.fillRect(x0, top - 1, x1 - x0, 1);
    ctx.fillRect(x0, bot - 2, x1 - x0, 1);
    // mullion between neighbouring panes; a heavier post where the run meets a wall or door
    ctx.fillStyle = C.glassPost;
    if (w && isGlass(drawAt(map, x - 1, y))) ctx.fillRect(px - 1, top, 2, bot - top);
    else if (w) ctx.fillRect(px, top - 1, 3, bot - top + 3);
    if (e && !isGlass(drawAt(map, x + 1, y))) ctx.fillRect(px + T - 3, top - 1, 3, bot - top + 3);
  }

  if (horiz && vert) {
    // corner post where the two runs meet
    ctx.fillStyle = C.glassPost;
    ctx.fillRect(cx - 4, top - 2, 8, bot - top + 4);
    ctx.fillStyle = C.glassFrameHi;
    ctx.fillRect(cx - 4, top - 2, 1.5, bot - top + 4);
  }

  if (entrance) {
    // double glass door: heavy jambs, centre split, a push bar on each leaf
    const mid = (top + bot) / 2;
    ctx.fillStyle = C.entranceFrame;
    ctx.fillRect(px, top - 2, 3.5, bot - top + 4);
    ctx.fillRect(px + T - 3.5, top - 2, 3.5, bot - top + 4);
    ctx.fillRect(cx - 1, top, 2, bot - top);
    ctx.fillStyle = C.steel;
    rrect(ctx, cx - 6, mid - 6, 2.5, 12, 1);
    ctx.fill();
    rrect(ctx, cx + 3.5, mid - 6, 2.5, 12, 1);
    ctx.fill();
  }
}

// One pane: pale-blue tint over whatever floor is underneath, a brighter "sky" band and a pair
// of diagonal glints (wide + thin), clipped to the pane.
function glassPane(ctx, x, y, w, h, seed, horizontal) {
  if (!(w > 0) || !(h > 0)) return;
  ctx.fillStyle = C.glass;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C.glassSky;
  if (horizontal) ctx.fillRect(x, y, w, h * 0.38);
  else ctx.fillRect(x, y, w * 0.4, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (horizontal) {
    const slant = h * 0.7;
    const sx = x + 3 + seed * Math.max(1, w - slant - 14);
    streak(ctx, sx, y + h, sx + slant, y, 5.5, C.glassHi);
    streak(ctx, sx + 9, y + h, sx + 9 + slant, y, 2, C.glassHiSoft);
  } else {
    const slant = w * 1.1;
    for (let k = 0; k < 2; k++) {
      const sy = y + 4 + ((seed + k * 0.5) % 1) * Math.max(1, h - slant - 4);
      streak(ctx, x, sy + slant, x + w, sy, k ? 2 : 4, k ? C.glassHiSoft : C.glassHi);
    }
  }
  ctx.restore();
}

// A slanted band of light from (x0, y0) to (x1, y1), `thick` px wide along x.
function streak(ctx, x0, y0, x1, y1, thick, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x1 + thick, y1);
  ctx.lineTo(x0 + thick, y0);
  ctx.closePath();
  ctx.fill();
}

function drawDoor(ctx, map, x, y) {
  const horiz = STRUCT.has(drawAt(map, x - 1, y)) || STRUCT.has(drawAt(map, x + 1, y));
  const px = x * T;
  const py = y * T;
  if (horiz) {
    ctx.fillStyle = C.oakEdge;
    ctx.fillRect(px, py + T / 2 - 3, T, 6);
    ctx.fillStyle = C.oak;
    ctx.fillRect(px, py + T / 2 - 3, T, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(px, py + T / 2 - 3, T, 1);
    ctx.fillStyle = C.walnutEdge;
    if (drawAt(map, x - 1, y) !== 'door') ctx.fillRect(px, py + 4, 3, T - 6);
    if (drawAt(map, x + 1, y) !== 'door') ctx.fillRect(px + T - 3, py + 4, 3, T - 6);
  } else {
    ctx.fillStyle = C.oakEdge;
    ctx.fillRect(px + T / 2 - 3, py, 6, T);
    ctx.fillStyle = C.oak;
    ctx.fillRect(px + T / 2 - 3, py, 4, T);
    ctx.fillStyle = C.walnutEdge;
    if (drawAt(map, x, y - 1) !== 'door') ctx.fillRect(px + 4, py, T - 8, 3);
    if (drawAt(map, x, y + 1) !== 'door') ctx.fillRect(px + 4, py + T - 3, T - 8, 3);
  }
}

function drawRestroom(ctx, x, y) {
  const px = x * T;
  const py = y * T;
  // door panel set into the wall + 🚻 plate
  ctx.fillStyle = C.walnutEdge;
  ctx.fillRect(px + 3, py + 1, T - 6, T - 4);
  ctx.fillStyle = '#4f8a84';
  ctx.fillRect(px + 5, py + 3, T - 10, T - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(px + 5, py + 3, T - 10, 2);
  fillCircle(ctx, px + T - 9, py + 18, 1.6, C.steel);
  ctx.fillStyle = C.white;
  rrect(ctx, px + 8, py + 4, 16, 12, 2);
  ctx.fill();
  restroomFigures(ctx, px + 16, py + 10.5);
}

// The pictogram on the restroom door: a man in blue and a woman in red, side by side, centred on (x, y).
function restroomFigures(ctx, x, y) {
  for (const [dx, col, skirt] of [[-3.4, '#2f6fb0', false], [3.4, '#c8453a', true]]) {
    const cx = x + dx;
    fillCircle(ctx, cx, y - 3.2, 1.4, col);
    ctx.fillStyle = col;
    if (skirt) {
      ctx.beginPath();
      ctx.moveTo(cx - 1.1, y - 1.4);
      ctx.lineTo(cx + 1.1, y - 1.4);
      ctx.lineTo(cx + 2.2, y + 2.2);
      ctx.lineTo(cx - 2.2, y + 2.2);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(cx - 1, y + 2.2, 0.8, 2.2);
      ctx.fillRect(cx + 0.2, y + 2.2, 0.8, 2.2);
    } else {
      ctx.fillRect(cx - 1.5, y - 1.4, 3, 3.8);
      ctx.fillRect(cx - 1.4, y + 2.4, 1.1, 2.4);
      ctx.fillRect(cx + 0.3, y + 2.4, 1.1, 2.4);
    }
  }
  ctx.fillStyle = 'rgba(42,33,27,0.5)';
  ctx.fillRect(x - 0.3, y - 4.5, 0.6, 9);
}

function drawElevator(ctx, tiles) {
  const xs = tiles.map((t) => t.x);
  const x0 = Math.min(...xs) * T;
  const x1 = (Math.max(...xs) + 1) * T;
  const py = tiles[0].y * T;
  ctx.fillStyle = C.steelDark;
  ctx.fillRect(x0 + 2, py + 1, x1 - x0 - 4, T - 4);
  ctx.fillStyle = C.steel;
  ctx.fillRect(x0 + 5, py + 6, x1 - x0 - 10, T - 11);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  for (let i = x0 + 9; i < x1 - 6; i += 6) ctx.fillRect(i, py + 7, 1, T - 13);
  ctx.fillStyle = C.steelDark;
  ctx.fillRect((x0 + x1) / 2 - 0.75, py + 6, 1.5, T - 11);
  fillCircle(ctx, (x0 + x1) / 2, py + 3.5, 1.8, '#f0b24a'); // floor indicator
  // call buttons beside the doors
  ctx.fillStyle = C.steelDark;
  rrect(ctx, x1 + 3, py + 6, 6, 12, 1.5);
  ctx.fill();
  fillCircle(ctx, x1 + 6, py + 10, 1.4, '#f6e7b0');
  fillCircle(ctx, x1 + 6, py + 14.5, 1.4, '#f6e7b0');
}

// --- wall decorations (front faces) ------------------------------------------
function frontY(y) {
  return y * T + T - FRONT;
}

function hasFront(map, x, y) {
  return WALLISH.has(drawAt(map, x, y)) && !WALLISH.has(drawAt(map, x, y + 1));
}

function drawWindow(ctx, map, x0, x1, y) {
  for (let x = x0; x <= x1; x++) if (!hasFront(map, x, y)) return;
  const fy = frontY(y);
  const px = x0 * T + 4;
  const w = (x1 - x0 + 1) * T - 8;
  ctx.fillStyle = C.walnutEdge;
  ctx.fillRect(px - 1, fy + 1, w + 2, FRONT - 3);
  ctx.fillStyle = '#b9d6de';
  ctx.fillRect(px, fy + 2, w, FRONT - 5);
  ctx.fillStyle = 'rgba(240,232,210,0.85)'; // venetian blinds
  for (let i = 0; i < 4; i++) ctx.fillRect(px, fy + 2.5 + i * 2.4, w, 1.2);
}

function drawPainting(ctx, map, x, y, variant) {
  if (!hasFront(map, x, y) || !hasFront(map, x + 1, y)) return;
  const fy = frontY(y);
  const px = x * T + 10;
  const w = 2 * T - 20;
  ctx.fillStyle = '#1f1814';
  ctx.fillRect(px - 1, fy + 1, w + 2, FRONT - 4);
  ctx.fillStyle = C.cream;
  ctx.fillRect(px, fy + 2, w, FRONT - 6);
  if (variant === 0) {
    fillCircle(ctx, px + 12, fy + 6, 3.2, C.ochre);
    ctx.fillStyle = C.teal;
    ctx.fillRect(px + 18, fy + 3, 10, 5);
    ctx.fillStyle = C.tomato;
    ctx.fillRect(px + 32, fy + 5, 6, 3);
  } else {
    ctx.fillStyle = C.olive;
    ctx.fillRect(px + 4, fy + 3, 14, 5);
    fillCircle(ctx, px + 26, fy + 6, 3, C.teal);
    ctx.fillStyle = C.ochre;
    ctx.fillRect(px + 32, fy + 3, 4, 5);
  }
}

function drawWallDecor(ctx, map, info, decor) {
  for (const w of decor.windows || []) drawWindow(ctx, map, w.x0, w.x1, w.y);
  for (const p of decor.paintings || []) drawPainting(ctx, map, p.x, p.y, p.variant);
  const cab = decor.cabinets;
  if (cab) {
    for (let x = cab.x0; x <= cab.x1; x++) {
      if (!hasFront(map, x, cab.y)) continue;
      const fy = frontY(cab.y);
      ctx.fillStyle = C.tealDark;
      ctx.fillRect(x * T + 1, fy - 2, T - 2, FRONT);
      ctx.fillStyle = C.teal;
      ctx.fillRect(x * T + 3, fy, T - 6, FRONT - 4);
      fillCircle(ctx, x * T + T / 2, fy + FRONT - 6, 1.2, C.cream);
    }
  }
  // projection screen (rolled down, unlit)
  const sc = info.screen;
  if (sc) drawScreen(ctx, sc.x, sc.y + 1, sc.w, sc.h, {
    shadow: 'rgba(0,0,0,0.25)', bar: [3, 3, 4, 2], face: '#e8e6de', hem: '#c9c5b8',
  });
}

// --- furniture ---------------------------------------------------------------
export function drawChair(ctx, cx, cy, dir, seat, back) {
  const fx = Math.cos(dir);
  const fy = Math.sin(dir);
  fillEllipse(ctx, cx, cy + 6, 9, 3.5, 'rgba(30,20,10,0.18)');
  ctx.strokeStyle = '#3b3430';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    ctx.moveTo(cx, cy + 2);
    ctx.lineTo(cx + Math.cos(a) * 7, cy + 2 + Math.sin(a) * 4);
  }
  ctx.stroke();
  ctx.fillStyle = back;
  rrect(ctx, cx - 7, cy - 5, 14, 13, 4);
  ctx.fill();
  ctx.fillStyle = seat;
  rrect(ctx, cx - 7, cy - 6, 14, 11, 4);
  ctx.fill();
  ctx.save();
  ctx.translate(cx - fx * 8, cy - fy * 7 - 2);
  ctx.rotate(dir + Math.PI / 2);
  ctx.fillStyle = back;
  rrect(ctx, -8, -3, 16, 6, 3);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(-6, -2, 12, 1);
  ctx.restore();
}

function deskBase(ctx, px, py, w, h, top, edge, r = 4) {
  ctx.fillStyle = 'rgba(40,25,15,0.25)';
  rrect(ctx, px + 2, py + 4, w, h, r);
  ctx.fill();
  ctx.fillStyle = edge;
  rrect(ctx, px, py, w, h, r);
  ctx.fill();
  ctx.fillStyle = top;
  rrect(ctx, px, py, w, h - 5, r);
  ctx.fill();
  ctx.fillStyle = C.walnutHi;
  ctx.fillRect(px + r, py + 1, w - 2 * r, 1);
}

function grain(ctx, px, py, w, h, seed) {
  ctx.strokeStyle = C.walnutGrain;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const yy = py + 4 + hash(seed, i) * (h - 10);
    const x0 = px + 4 + hash(seed, i, 1) * w * 0.3;
    ctx.moveTo(x0, yy);
    ctx.quadraticCurveTo(x0 + w * 0.3, yy + 1.5, x0 + w * 0.6, yy);
  }
  ctx.stroke();
}

function drawDesk(ctx, d, decor) {
  const px = d.x0 * T + 2;
  const py = d.y0 * T + 3;
  const w = (d.x1 - d.x0 + 1) * T - 4;
  const h = (d.y1 - d.y0 + 1) * T - 5;
  const seed = d.x0 * 31 + d.y0;
  if (d.kind === 'counter') {
    ctx.fillStyle = C.tealDark;
    ctx.fillRect(d.x0 * T, d.y0 * T, (d.x1 - d.x0 + 1) * T, T - 2);
    ctx.fillStyle = C.laminate;
    ctx.fillRect(d.x0 * T, d.y0 * T, (d.x1 - d.x0 + 1) * T, T - 10);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(d.x0 * T, d.y0 * T + T - 11, (d.x1 - d.x0 + 1) * T, 1);
    for (let x = d.x0; x <= d.x1; x++) fillCircle(ctx, x * T + T / 2, d.y0 * T + T - 6, 1.2, C.cream);
    // kettle + mugs at the left end, sink at the right end
    const lx = d.x0 * T + 16;
    const ly = d.y0 * T + 11;
    fillCircle(ctx, lx - 4, ly, 5, '#d9d4c8');
    fillCircle(ctx, lx - 4, ly, 3, '#b8b2a5');
    fillCircle(ctx, lx + 7, ly + 3, 3, C.ochre);
    fillCircle(ctx, lx + 7, ly + 3, 1.8, '#5b3a20');
    const sx = d.x1 * T + 4;
    ctx.fillStyle = C.steelDark;
    rrect(ctx, sx, d.y0 * T + 4, 24, 15, 3);
    ctx.fill();
    ctx.fillStyle = '#d5dade';
    rrect(ctx, sx + 2, d.y0 * T + 6, 20, 11, 2);
    ctx.fill();
    fillCircle(ctx, sx + 12, d.y0 * T + 4, 1.8, C.steelDark);
    return;
  }
  if (d.kind === 'kitchenTable') {
    deskBase(ctx, px + 4, py + 4, w - 8, h - 6, C.oak, C.oakEdge, 10);
    const cx = px + w / 2;
    const cy = py + h / 2 - 1;
    fillEllipse(ctx, cx, cy, 8, 5, C.teal);
    fillCircle(ctx, cx - 3, cy - 1, 2.5, '#e98a2e');
    fillCircle(ctx, cx + 2, cy - 1.5, 2.5, '#b8c64a');
    fillCircle(ctx, cx + 0.5, cy + 1.5, 2.3, '#e98a2e');
    ctx.fillStyle = C.white;
    ctx.fillRect(px + 14, py + 8, 7, 5);
    ctx.fillRect(px + w - 22, py + 9, 7, 5);
    return;
  }
  if (d.kind === 'meeting') {
    deskBase(ctx, px, py, w, h, C.walnutTop, C.walnutEdge, 14);
    grain(ctx, px, py, w, h, seed);
    // notepads + water glasses at the seats
    const pads = decor.notepads || NO_PADS;
    for (const sx of pads.north || []) {
      ctx.fillStyle = C.paper;
      ctx.fillRect(sx * T + 10, py + 4, 11, 8);
      fillCircle(ctx, sx * T + 25, py + 7, 2.5, 'rgba(200,230,240,0.85)');
    }
    for (const sx of pads.south || []) {
      ctx.fillStyle = C.paper;
      ctx.fillRect(sx * T + 10, py + h - 17, 11, 8);
    }
    return;
  }
  deskBase(ctx, px, py, w, h, C.walnutTop, C.walnutEdge);
  grain(ctx, px, py, w, h, seed);
  const midX = ((d.x0 + d.x1 + 1) / 2) * T;
  if (d.kind === 'exec') {
    // The executive sits north of the desk facing south: monitor back at the south edge.
    ctx.fillStyle = '#29453a';
    rrect(ctx, midX - 14, py + 4, 28, 13, 2); // leather blotter
    ctx.fill();
    ctx.fillStyle = C.monitorDark;
    rrect(ctx, midX - 11, py + h - 17, 22, 7, 2);
    ctx.fill();
    ctx.fillStyle = C.monitor;
    rrect(ctx, midX - 11, py + h - 19, 22, 6, 2);
    ctx.fill();
    ctx.fillStyle = '#c9a43a'; // brass name plate
    ctx.fillRect(midX - 7, py + h - 9, 14, 3);
    // desk lamp (mustard shade)
    fillCircle(ctx, px + w - 12, py + 9, 5.5, C.ochre);
    fillCircle(ctx, px + w - 12, py + 9, 2.5, '#fff1c2');
    // phone + mug
    ctx.fillStyle = '#2f2b29';
    rrect(ctx, px + 6, py + 5, 12, 8, 2);
    ctx.fill();
    fillCircle(ctx, px + 12, py + 18, 3.3, C.navyLight);
    fillCircle(ctx, px + 12, py + 18, 2, '#4a2e1a');
    return;
  }
  // Workstation. Screen, mug and prop come from the owner's decor.desks style; d.face is the sitter's face.
  const st = (decor.desks && decor.desks[d.owner]) || DESK_STYLE;
  if (d.face === 'N' || !TURN[d.face]) {
    drawWorkstation(ctx, px, py, w, h, midX, d.x0 * T + 14, d.x1 * T + 16, st);
    return;
  }
  // Any other face: the same workstation drawn in a frame turned about the desk's centre, its long side across
  // the sitter's line of sight.
  const across = d.face === 'S' ? d.x1 - d.x0 + 1 : d.y1 - d.y0 + 1;
  const along = d.face === 'S' ? d.y1 - d.y0 + 1 : d.x1 - d.x0 + 1;
  const lw = across * T - 4;
  const lh = along * T - 5;
  ctx.save();
  ctx.translate(px + w / 2, py + h / 2);
  ctx.rotate(TURN[d.face]);
  drawWorkstation(ctx, -lw / 2, -lh / 2, lw, lh, 0, -lw / 2 + 12, lw / 2 - 14, st);
  ctx.restore();
}

// A canvas turn that takes the 'N' workstation (sitter at local +y) to a sitter facing this way.
const TURN = { N: 0, E: Math.PI / 2, S: Math.PI, W: -Math.PI / 2 };

// A workstation sat at from the south (+y), facing north: monitor at the top edge, keyboard at the bottom, the
// owner's mug left and prop right. midX: the monitor's centre; leftX, rightX: the mug's and the prop's x.
function drawWorkstation(ctx, px, py, w, h, midX, leftX, rightX, st) {
  const monTopY = py + 3;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  rrect(ctx, midX - 11, monTopY + 3, 24, 17, 2);
  ctx.fill();
  ctx.fillStyle = C.monitor;
  rrect(ctx, midX - 12, monTopY, 24, 7, 2); // box top
  ctx.fill();
  ctx.fillStyle = C.bezel;
  rrect(ctx, midX - 12, monTopY + 6, 24, 11, 2); // screen face (faces the sitter)
  ctx.fill();
  ctx.fillStyle = st.screen;
  ctx.fillRect(midX - 10, monTopY + 8, 20, 7);
  if (st.screenArt === 'code') {
    ctx.fillStyle = '#7fe08a';
    for (let i = 0; i < 3; i++) ctx.fillRect(midX - 9, monTopY + 9 + i * 2, 4 + hash(i, 7) * 12, 1);
  } else if (st.screenArt === 'grid') {
    ctx.fillStyle = 'rgba(40,90,120,0.6)';
    for (let i = 0; i < 3; i++) ctx.fillRect(midX - 9, monTopY + 9 + i * 2, 18, 0.8);
    for (let i = 0; i < 3; i++) ctx.fillRect(midX - 9 + i * 6, monTopY + 8, 0.8, 7);
  } else if (st.screenArt === 'blankSlide') {
    ctx.fillStyle = '#c9c3b3'; // a blank slide titled nothing
    ctx.fillRect(midX - 6, monTopY + 9.5, 12, 1.2);
  }
  // keyboard + mouse
  const kbY = py + h - 13;
  ctx.fillStyle = '#9d978b';
  rrect(ctx, midX - 10, kbY + 1, 20, 7, 1.5);
  ctx.fill();
  ctx.fillStyle = C.keyboard;
  rrect(ctx, midX - 10, kbY, 20, 6, 1.5);
  ctx.fill();
  ctx.fillStyle = '#a9a294';
  for (let r = 0; r < 2; r++) for (let k = 0; k < 6; k++) ctx.fillRect(midX - 8 + k * 3, kbY + 1.3 + r * 2.2, 2, 1.2);
  fillEllipse(ctx, midX + 15, kbY + 3, 2.4, 3, C.keyboard);
  // personal items
  const mug = st.mug;
  fillCircle(ctx, leftX, py + 15, 3.6, mug);
  fillCircle(ctx, leftX, py + 15, 2.2, '#4a2e1a');
  ctx.strokeStyle = mug;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(leftX + 4, py + 15, 1.8, -1.2, 1.2);
  ctx.stroke();
  if (st.prop === 'plant') {
    fillCircle(ctx, rightX, py + 13, 4.5, C.pot);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      fillEllipse(ctx, rightX + Math.cos(a) * 3, py + 12 + Math.sin(a) * 2.5, 2.6, 1.6, C.plantB);
    }
  } else if (st.prop === 'earbuds') {
    fillCircle(ctx, rightX - 2, py + 12, 3, '#9aa45a');
    fillCircle(ctx, rightX - 2, py + 12, 1.6, '#c8ccd0');
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightX - 12, py + 20);
    ctx.bezierCurveTo(rightX - 4, py + 12, rightX + 4, py + 24, rightX + 8, py + 16);
    ctx.stroke();
  } else if (st.prop === 'paper') {
    ctx.fillStyle = C.white;
    ctx.save();
    ctx.translate(rightX, py + 13);
    ctx.rotate(0.12);
    ctx.fillRect(-6, -5, 12, 10);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(-4, -3, 8, 0.8);
    ctx.fillRect(-4, -1, 8, 0.8);
    ctx.fillRect(-4, 1, 6, 0.8);
    ctx.restore();
  }
}

function drawPlant(ctx, cx, cy) {
  fillEllipse(ctx, cx + 1, cy + 11, 10, 4, 'rgba(30,20,10,0.22)');
  ctx.fillStyle = C.potDark;
  ctx.beginPath();
  ctx.moveTo(cx - 9, cy + 1);
  ctx.lineTo(cx + 9, cy + 1);
  ctx.lineTo(cx + 6.5, cy + 12);
  ctx.lineTo(cx - 6.5, cy + 12);
  ctx.closePath();
  ctx.fill();
  fillEllipse(ctx, cx, cy + 1, 9, 3.5, C.pot);
  fillEllipse(ctx, cx, cy + 1, 7, 2.5, '#4a3424');
  const leaves = [[-0.4, 13, C.plantA], [0.5, 12, C.plantB], [1.6, 11, C.plantA], [2.6, 12, C.plantB], [3.6, 13, C.plantA], [4.6, 11, C.plantB], [5.5, 12, C.plantA]];
  for (const [a, len, col] of leaves) {
    ctx.save();
    ctx.translate(cx, cy - 4);
    ctx.rotate(a);
    fillEllipse(ctx, len * 0.55, 0, len * 0.55, 3.2, col);
    ctx.restore();
  }
  fillCircle(ctx, cx, cy - 4, 3, C.plantB);
}

function drawFridge(ctx, px, py) {
  fillEllipse(ctx, px + 16, py + 30, 14, 3, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = C.mintDark;
  rrect(ctx, px + 3, py - 6, 26, 36, 4);
  ctx.fill();
  ctx.fillStyle = '#e4f0e8';
  rrect(ctx, px + 3, py - 6, 26, 10, 4); // top face
  ctx.fill();
  ctx.fillStyle = C.mint;
  ctx.fillRect(px + 4, py + 4, 24, 24);
  ctx.fillStyle = C.mintDark;
  ctx.fillRect(px + 4, py + 12, 24, 1.2);
  ctx.fillStyle = C.steel;
  rrect(ctx, px + 23, py + 6, 2.5, 5, 1);
  ctx.fill();
  rrect(ctx, px + 23, py + 15, 2.5, 9, 1);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(px + 6, py + 5, 1.5, 22);
}

function drawCoffeeMachine(ctx, px, py) {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rrect(ctx, px + 7, py + 6, 20, 20, 3);
  ctx.fill();
  ctx.fillStyle = '#2f2926';
  rrect(ctx, px + 6, py + 1, 20, 22, 3);
  ctx.fill();
  ctx.fillStyle = '#6a625c';
  rrect(ctx, px + 6, py + 1, 20, 6, 3);
  ctx.fill();
  // brew bay + warming plate; the carafe itself is dynamic (drawCarafe)
  ctx.fillStyle = '#1c1816';
  rrect(ctx, px + 8, py + 8, 13, 14, 2);
  ctx.fill();
  ctx.fillStyle = '#4a433e';
  ctx.fillRect(px + 10.5, py + 8, 8, 2);
  fillEllipse(ctx, px + CARAFE_DX, py + 21, 6, 1.8, '#0e0c0b');
  fillCircle(ctx, px + 23.5, py + 11, 1.4, '#e5432f');
}

// The coffee pot, legible at gameplay zoom: a full pot is a brown disc in a bright glass rim
// (with a wisp of steam), an empty one is clear glass with a dried ring at the bottom.
const CARAFE_DX = 14.5;
function drawCarafe(ctx, px, py, full, t) {
  const x = px + CARAFE_DX;
  const y = py + 16.5;
  const rx = 5.8;
  const ry = 6.2;
  ctx.save();
  ellipse(ctx, x, y, rx, ry);
  ctx.clip();
  if (full) {
    ctx.fillStyle = 'rgba(214,234,240,0.9)';
    ctx.fillRect(x - rx, y - ry, rx * 2, ry * 2);
    ctx.fillStyle = '#4a2a14';
    ctx.fillRect(x - rx, y - 2, rx * 2, ry + 2);
    fillEllipse(ctx, x, y - 2, rx, 1.6, '#7a4a26'); // coffee surface
  } else {
    ctx.fillStyle = 'rgba(214,236,243,0.8)';
    ctx.fillRect(x - rx, y - ry, rx * 2, ry * 2);
    fillEllipse(ctx, x, y + ry - 1.2, rx * 0.8, 1.4, 'rgba(110,66,30,0.6)'); // dregs
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillRect(x + 1.5, y - 4, 1, 4);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillRect(x - rx + 1.6, y - 3, 1.4, 6); // glint
  ctx.restore();
  ctx.strokeStyle = 'rgba(235,245,248,0.9)';
  ctx.lineWidth = 1;
  ellipse(ctx, x, y, rx, ry);
  ctx.stroke();
  // black collar + handle
  ctx.fillStyle = '#141110';
  rrect(ctx, x - 4.5, y - ry - 1.5, 9, 3.2, 1.2);
  ctx.fill();
  rrect(ctx, x + rx - 0.5, y - 3, 2.6, 7, 1.2);
  ctx.fill();
  if (full) {
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.45 + i / 3) % 1;
      ctx.globalAlpha = 0.32 * Math.sin(ph * Math.PI);
      fillCircle(ctx, x + Math.sin(t * 1.7 + i * 2.1) * (1 + ph * 2), y - ry - 3 - ph * 11, 1.3 + ph * 1.8, '#f4efe6');
    }
    ctx.globalAlpha = 1;
  }
}

function drawRackBase(ctx, cx, cy) {
  fillEllipse(ctx, cx, cy + 10, 9, 3.5, 'rgba(30,20,10,0.25)');
  ctx.strokeStyle = C.walnutEdge;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const a of [0.4, 1.4, 2.6, 3.6]) {
    ctx.moveTo(cx, cy + 9);
    ctx.lineTo(cx + Math.cos(a) * 8, cy + 9 + Math.sin(a) * 3);
  }
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.walnutTop;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 9);
  ctx.lineTo(cx, cy - 13);
  ctx.stroke();
  ctx.strokeStyle = C.walnutEdge;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (const s of [-1, 1]) {
    ctx.moveTo(cx, cy - 11);
    ctx.quadraticCurveTo(cx + s * 7, cy - 14, cx + s * 6, cy - 9);
  }
  ctx.stroke();
  ctx.lineCap = 'butt';
  fillCircle(ctx, cx, cy - 14, 2.5, C.walnutTop);
}

// =============================================================================
// Dynamic props (every frame)
// =============================================================================
export function drawWorldDynamic(ctx, game, t) {
  const map = game.map;
  const SPOTS = game.level.spots;
  const info = mapInfo(map, game.level);
  const world = game.world || {};
  const minute = game.clock ? game.clock.minute : 0;

  const decor = decorOf(game.level);
  drawWallClock(ctx, map, minute, decor.clock, game.level.day.start);

  // Furniture with moving parts (decor.props), in order, each showing what its state(world, game) says. Its draw
  // names a painter below, or is the level's own painter function, called the same way.
  const props = decor.props || NONE;
  for (let i = 0; i < props.length; i++) {
    const at = info.props[i];
    const draw = props[i].draw;
    const paint = at && (typeof draw === 'function' ? draw : PROP_PAINTERS[draw]);
    if (paint) paint(ctx, info, at, props[i].state(world, game), t);
  }

  if (info.playerDesk) drawWorkStack(ctx, game, info.playerDesk, t);

  // Items in the world: dropped on the floor, or set down on a spot (putdown.js), drawn where they lie.
  const items = world.items || [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const x = it.x * T;
    const y = it.y * T;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    fillEllipse(ctx, x, y + 6, 7, 2.5, 'rgba(0,0,0,0.22)');
    emoji(ctx, itemGlyph(game.level.items, it.type), x, y + Math.sin(t * 3 + i) * 1, 14);
    if ((t + i * 0.7) % 2.4 < 0.25) sparkle(ctx, x + 6, y - 6, 3.5, '#fff');
  }

  // Elevator doors open while someone is right in front of them (at decor.elevator's spot).
  const lift = decor.elevator && SPOTS[decor.elevator.spot];
  if (info.elevator.length && lift) {
    const ex = lift.x + 0.5;
    const ey = lift.y + 0.5;
    let near = 99;
    for (const n of game.npcs || []) if (n.active) near = Math.min(near, Math.hypot(n.x - ex, n.y - ey));
    const open = clamp(1.6 - near, 0, 1);
    if (open > 0) {
      const xs = info.elevator.map((e) => e.x);
      const mx = ((Math.min(...xs) + Math.max(...xs) + 1) / 2) * T;
      const py = info.elevator[0].y * T;
      const g = 11 * open;
      ctx.fillStyle = '#1b1715';
      ctx.fillRect(mx - g, py + 6, 2 * g, T - 11);
      ctx.fillStyle = 'rgba(255,230,170,0.35)';
      ctx.fillRect(mx - g + 2, py + 7, 2 * g - 4, T - 13);
    }
  }
}

// A tiny cup under a red circle and slash, centred on (x, y): the projector's "no coffee" sticker.
function noCoffeeSticker(ctx, x, y) {
  ctx.fillStyle = '#6b3f1d';
  ctx.fillRect(x - 1.3, y - 1, 2.4, 2.4);
  ctx.strokeStyle = '#6b3f1d';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.arc(x + 1.3, y + 0.2, 0.8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.strokeStyle = '#d23a2a'; // (not C.tomato: that red is the end card's losing border)
  ctx.lineWidth = 0.8;
  circle(ctx, x, y, 2.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 1.8, y - 1.8);
  ctx.lineTo(x + 1.8, y + 1.8);
  ctx.stroke();
}

// The decor.props painters, by name: (ctx, info, tile, shown, t). `shown` is the prop's state(world, game).
// Exported for the level validator (src/levels/validate.js): a prop names one of these, or brings its own function
// with the same signature (tile: the prop's legend letter on the map, in tile units; draw in map pixels, T a tile).
export const PROP_PAINTERS = {
  // { state: 'ok' | 'broken' | 'fixing', fix: 0..1, beam }: a beam lights decor.screen.
  slideProjector(ctx, info, at, shown, t) {
    if (shown.beam && info.screen) drawBeam(ctx, info, at, t);
    drawProjector(ctx, at.x * T + T / 2, at.y * T + T / 2, shown.state, shown.fix, t);
  },
  // { full }: a full pot, or clear glass with dregs.
  carafe(ctx, info, at, shown, t) {
    drawCarafe(ctx, at.x * T, at.y * T, shown.full, t);
  },
  // { coat, tag }: a jacket on the rack, a badge clipped to it.
  coatRack(ctx, info, at, shown, t) {
    drawRackItems(ctx, at.x * T + T / 2, at.y * T + T / 2, shown.coat, shown.tag, t);
  },
  // { minute, start?, tilt? }: an analog clock on the wall tile's front face, showing `minute` (game minutes since
  // `start`, a minute-of-day; default DAY_START), hung `tilt` radians askew (0: straight).
  wallClock(ctx, info, at, shown) {
    const cx = at.x * T + T / 2;
    const cy = frontY(at.y) + FRONT / 2 - 1;
    const tilt = shown.tilt || 0;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    fillCircle(ctx, 0, 0, 6.5, '#1f1814');
    fillCircle(ctx, 0, 0, 5.3, C.cream);
    fillCircle(ctx, 0, -4.2, 0.6, C.ink); // the 12, so a crooked clock reads as crooked
    clockHands(ctx, 0, 0, shown.minute, 3, 1.4, 4.6, 0.9, C.tomatoDark, shown.start);
    ctx.restore();
  },
  // A camera's screen on the tile: shown is game/perception.js cameraFeed(game, id) (feed 'static' | 'wall' |
  // 'live', blips). The picture is what the watcher sees: you are the tiny red sweater.
  monitor(ctx, info, at, shown, t) {
    drawMonitor(ctx, at.x * T + T / 2, at.y * T + T / 2 - 5, shown, t);
  },
  // The camera itself, at its lens (shown.x, shown.y, tile units; the tile is only where it is listed), turned to
  // shown.dir, its red light blinking while the feed is live. shown: cameraFeed(game, id).
  cctv(ctx, info, at, shown, t) {
    drawCctv(ctx, shown.x * T, shown.y * T, shown.dir, shown.live, t);
  },
};

// A little CRT: 24 x 18 px body, 18 x 12 picture, centred on (cx, cy).
function drawMonitor(ctx, cx, cy, shown, t) {
  const bw = 24;
  const bh = 18;
  const x = Math.round(cx - bw / 2);
  const y = Math.round(cy - bh / 2);
  fillEllipse(ctx, cx, y + bh + 2, 11, 2.5, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = '#3d3a3a';
  rrect(ctx, x, y, bw, bh, 3);
  ctx.fill();
  ctx.fillStyle = '#2b2828';
  ctx.fillRect(cx - 4, y + bh, 8, 2);
  const sx = x + 3;
  const sy = y + 3;
  const sw = 18;
  const sh = 12;
  if (shown.feed === 'static') {
    const f = Math.floor(t * 14);
    for (let j = 0; j < sh; j += 2) {
      for (let i = 0; i < sw; i += 2) {
        const g = Math.round(70 + 150 * hash(i, j, f));
        ctx.fillStyle = `rgb(${g},${g},${g})`;
        ctx.fillRect(sx + i, sy + j, 2, 2);
      }
    }
  } else if (shown.feed === 'wall') {
    ctx.fillStyle = '#6d6a66';
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = '#55524f';
    for (let j = 0; j < sh; j += 3) {
      ctx.fillRect(sx, sy + j, sw, 1);
      for (let i = (j / 3) % 2 ? 2 : 6; i < sw; i += 8) ctx.fillRect(sx + i, sy + j, 1, 3);
    }
  } else {
    ctx.fillStyle = '#1d3a33';
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = 'rgba(160,230,200,0.10)';
    ctx.fillRect(sx, sy + sh - 4, sw, 4); // the floor
    for (const b of shown.blips || []) {
      const bx = Math.round(sx + sw / 2 + b.u * (sw / 2 - 2));
      const by = Math.round(sy + sh - 3 - b.v * (sh - 6));
      if (b.id === 'player') {
        // the tiny red sweater: body and two sleeves
        ctx.fillStyle = C.tomato;
        ctx.fillRect(bx - 1, by - 2, 3, 4);
        ctx.fillRect(bx - 2, by - 2, 5, 1);
        ctx.fillStyle = C.tomatoDark;
        ctx.fillRect(bx - 2, by - 1, 1, 2);
        ctx.fillRect(bx + 2, by - 1, 1, 2);
      } else {
        ctx.fillStyle = b.color || '#c8d8d0';
        ctx.fillRect(bx - 1, by - 2, 2, 4);
      }
    }
  }
  ctx.fillStyle = `rgba(255,255,255,${(0.05 + 0.04 * Math.sin(t * 9)).toFixed(3)})`;
  ctx.fillRect(sx, sy + ((t * 20) % sh), sw, 1);
  fillCircle(ctx, x + bw - 3, y + bh - 2, 1, shown.feed === 'static' ? '#5a2a22' : '#7be08a');
}

// A wall camera: a mount, a box turned to `dir`, a lens and its light.
function drawCctv(ctx, lx, ly, dir, live, t) {
  ctx.save();
  ctx.translate(lx, ly);
  ctx.rotate(dir);
  ctx.fillStyle = '#5b5755';
  ctx.fillRect(-9, -1.5, 6, 3); // the arm, back toward the wall
  ctx.fillStyle = '#d9d4cb';
  rrect(ctx, -5, -3.5, 10, 7, 2);
  ctx.fill();
  ctx.fillStyle = '#2a2726';
  ctx.fillRect(4, -2.5, 2.5, 5); // the lens hood
  ctx.restore();
  const on = live && Math.floor(t * 2) % 2 === 0;
  fillCircle(ctx, lx - Math.cos(dir) * 2, ly - Math.sin(dir) * 2 - 1, 1.2, on ? '#ff3b2a' : '#5a2a22');
}

export function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r * 0.25, y - r * 0.25);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x + r * 0.25, y + r * 0.25);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r * 0.25, y + r * 0.25);
  ctx.lineTo(x - r, y);
  ctx.lineTo(x - r * 0.25, y - r * 0.25);
  ctx.closePath();
  ctx.fill();
}

// The paper stack of assigned work on the player's desk (game.clock.forced). It drops onto the desk as you sit down
// to it (game.rules.stackAt, play/player.js) and goes down a sheet at a time while you type: what is left on it is the
// work left. One tidy stack: nothing is left lying about once it is done.
const STACK_SHEETS = 12;
const STACK_FALL = 0.22; // s for the stack to drop onto the desk
function drawWorkStack(ctx, game, d, t) {
  const r = game.rules;
  const forced = game.clock ? fin(game.clock.forced) : 0;
  if (!(forced > 0) || !r || r.sent || r.stackAt == null) return;
  const left = clamp(forced / (fin(r.workFrom) || WORK_PENALTY_MIN), 0, 1);
  const sx = d.x1 * T + 16;
  const sy = d.y0 * T + 22;
  const age = fin(game.loopTime) - r.stackAt;
  const fall = age < STACK_FALL ? -48 * (1 - age / STACK_FALL) ** 2 : 0;
  const thud = age >= STACK_FALL && age < STACK_FALL + 0.2 ? Math.sin(((age - STACK_FALL) / 0.2) * Math.PI) : 0;
  const todo = Math.max(1, Math.ceil(STACK_SHEETS * left - 1e-9));
  if (age < STACK_FALL) fillEllipse(ctx, sx, sy + 9, 8 * (0.5 + (0.5 * age) / STACK_FALL), 2.5, 'rgba(0,0,0,0.18)');
  const h = 1.6 * (1 - 0.35 * thud);
  for (let i = 0; i < todo; i++) {
    const x = sx - 7.75 + hash(i, 3) * 1.5;
    const y = sy + fall - i * h;
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.fillRect(x, y + 9, 14, 1.2);
    ctx.fillStyle = i % 2 ? '#e9e4d6' : C.white;
    ctx.fillRect(x, y, 14, 10);
  }
}

function drawWallClock(ctx, map, minute, clock, start) {
  // Analog wall clock showing the game time.
  if (!clock) return;
  const { x, y } = clock;
  if (!hasFront(map, x, y)) return;
  const cx = x * T + T / 2;
  const cy = frontY(y) + FRONT / 2 - 1;
  fillCircle(ctx, cx, cy, 6.5, '#1f1814');
  fillCircle(ctx, cx, cy, 5.3, C.cream);
  clockHands(ctx, cx, cy, minute, 3, 1.4, 4.6, 0.9, C.tomatoDark, start);
}

function drawBeam(ctx, info, p, t) {
  const lx = p.x * T + T / 2;
  const ly = p.y * T + T / 2 - 8;
  const sc = info.screen;
  const flick = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 7.7);
  ctx.fillStyle = `rgba(255,250,225,${(0.13 * flick).toFixed(3)})`;
  ctx.beginPath();
  ctx.moveTo(lx - 2, ly);
  ctx.lineTo(sc.x + 2, sc.y + sc.h);
  ctx.lineTo(sc.x + sc.w - 2, sc.y + sc.h);
  ctx.lineTo(lx + 2, ly);
  ctx.closePath();
  ctx.fill();
  drawScreen(ctx, sc.x, sc.y + 1, sc.w, sc.h, { glow: ['rgba(255,255,240,0.25)', 4, 3, 3], face: '#ffffff' });
}

export function drawProjector(ctx, cx, cy, state, fix, t) {
  const broken = state === 'broken';
  const fixing = state === 'fixing';
  if (broken || fixing) {
    // scorch + coffee puddle on the table
    fillEllipse(ctx, cx + 1, cy + 3, 14, 7, 'rgba(25,15,8,0.35)');
    fillEllipse(ctx, cx + 9, cy + 6, 6, 3, 'rgba(95,58,28,0.85)');
    fillEllipse(ctx, cx + 4, cy + 8, 4, 2, 'rgba(95,58,28,0.85)');
  }
  fillEllipse(ctx, cx + 1, cy + 7, 11, 3, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = broken ? '#4d4640' : '#a9a397';
  rrect(ctx, cx - 10, cy - 4, 20, 11, 2); // front face
  ctx.fill();
  ctx.fillStyle = broken ? '#5e5650' : '#d9d3c6';
  rrect(ctx, cx - 10, cy - 7, 20, 8, 2); // top
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (let i = 0; i < 4; i++) ctx.fillRect(cx - 7 + i * 3, cy - 5, 1.5, 4);
  // lens toward the screen
  fillCircle(ctx, cx + 5, cy - 7, 3.4, '#2b2826');
  fillCircle(ctx, cx + 5, cy - 7, 2, broken ? '#3a2a20' : '#7fb3c8');
  // "no coffee" sticker
  ctx.fillStyle = C.white;
  rrect(ctx, cx - 9, cy, 9, 6, 1);
  ctx.fill();
  noCoffeeSticker(ctx, cx - 4.5, cy + 3);
  if (fixing) {
    // lid propped open
    ctx.save();
    ctx.translate(cx, cy - 7);
    ctx.rotate(-0.5 + Math.sin(t * 6) * 0.05);
    ctx.fillStyle = '#bfb8aa';
    ctx.fillRect(-10, -6, 20, 5);
    ctx.restore();
    if ((t * 3) % 1 < 0.3) sparkle(ctx, cx - 3 + Math.sin(t * 17) * 4, cy - 9, 3, '#ffe27a');
  }
  if (broken || fixing) {
    const puffs = broken ? 4 : 1;
    for (let i = 0; i < puffs; i++) {
      const ph = (t * 0.55 + i / puffs) % 1;
      const r = 3 + ph * 8;
      ctx.fillStyle = `rgba(80,76,72,${(0.5 * (1 - ph)).toFixed(3)})`;
      circle(ctx, cx + Math.sin(t * 1.3 + i * 2) * 3 + ph * 5, cy - 8 - ph * 28, r);
      ctx.fill();
    }
    if (broken && Math.sin(t * 7.3) + Math.sin(t * 3.1) > 1.5) {
      ctx.strokeStyle = '#ffd34d';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = -Math.PI / 2 + (i - 1.5) * 0.6 + Math.sin(t * 11 + i) * 0.2;
        ctx.moveTo(cx + 5 + Math.cos(a) * 3, cy - 7 + Math.sin(a) * 3);
        ctx.lineTo(cx + 5 + Math.cos(a) * 9, cy - 7 + Math.sin(a) * 9);
      }
      ctx.stroke();
    }
  }
}

function drawRackItems(ctx, cx, cy, jacket, keycard, t) {
  const ty = cy - 12; // shoulder line
  if (jacket) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.moveTo(cx - 9, ty + 3);
    ctx.lineTo(cx + 11, ty + 3);
    ctx.lineTo(cx + 12, ty + 23);
    ctx.lineTo(cx - 8, ty + 23);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = C.navy;
    ctx.beginPath();
    ctx.moveTo(cx - 5, ty);
    ctx.quadraticCurveTo(cx - 9, ty + 1, cx - 9.5, ty + 5);
    ctx.lineTo(cx - 10.5, ty + 21);
    ctx.lineTo(cx + 10.5, ty + 21);
    ctx.lineTo(cx + 9.5, ty + 5);
    ctx.quadraticCurveTo(cx + 9, ty + 1, cx + 5, ty);
    ctx.lineTo(cx, ty + 3);
    ctx.closePath();
    ctx.fill();
    // sleeves
    ctx.fillStyle = C.navyDark;
    ctx.fillRect(cx - 10.5, ty + 6, 3, 14);
    ctx.fillRect(cx + 7.5, ty + 6, 3, 14);
    // lapels + shirt-less V
    ctx.fillStyle = C.navyLight;
    ctx.beginPath();
    ctx.moveTo(cx - 5, ty);
    ctx.lineTo(cx - 1, ty + 11);
    ctx.lineTo(cx - 3, ty + 4);
    ctx.closePath();
    ctx.moveTo(cx + 5, ty);
    ctx.lineTo(cx + 1, ty + 11);
    ctx.lineTo(cx + 3, ty + 4);
    ctx.closePath();
    ctx.fill();
    fillCircle(ctx, cx + 0.5, ty + 15, 0.9, '#c9c2b0');
    fillCircle(ctx, cx + 0.5, ty + 18, 0.9, '#c9c2b0');
    // pocket
    ctx.fillStyle = C.navyDark;
    ctx.fillRect(cx - 8, ty + 14, 5.5, 1.2);
    // hanger hook
    ctx.strokeStyle = C.walnutEdge;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, ty - 1, 1.6, Math.PI, 0);
    ctx.stroke();
  }
  if (keycard) {
    // card peeking out of the jacket pocket (or hanging alone on a hook)
    const kx = jacket ? cx - 5.5 : cx + 5;
    const ky = jacket ? ty + 10 : ty + 6;
    ctx.strokeStyle = C.teal;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(kx, ky);
    ctx.quadraticCurveTo(kx + 2, ky - 6, jacket ? cx - 1 : cx + 1, ty - 1);
    ctx.stroke();
    ctx.fillStyle = C.white;
    ctx.fillRect(kx - 2.5, ky, 5, 6.5);
    ctx.fillStyle = C.teal;
    ctx.fillRect(kx - 2.5, ky, 5, 1.8);
    ctx.fillStyle = '#c9a43a';
    ctx.fillRect(kx - 1.5, ky + 3, 2, 1.6);
    if (jacket) {
      ctx.fillStyle = C.navy; // pocket lip covers the bottom of the card
      ctx.fillRect(kx - 3.5, ty + 14, 6, 3);
      ctx.fillStyle = C.navyDark;
      ctx.fillRect(kx - 3.5, ty + 14, 6, 1.2);
    }
    if (t % 2.6 < 0.3) sparkle(ctx, kx + 3, ky, 3 + Math.sin((t % 2.6) * 10) * 0.8, '#ffffff');
  }
}
