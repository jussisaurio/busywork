// The verb sheets (docs/COLD-READ.md): every item of a level, every generic verb on it, drawn by the tool. shots.js
// holds the pictures a builder chose, and builders shoot their routes: nobody pictured what the engine's own verbs
// (play/interactions.js, sim/mechanics/putdown.js) look like on a level's items. A level 1 mustard stain once
// reached a playtester that way, after eating a resignation letter.
//
// For each item in level.items, the item goes straight into the player's hand at an empty tile nobody watches (no
// plan search: this is about what a verb looks like, not a route), and each sequence is a fresh day:
//   carry     walking with it; pretending with it, standing (held to your ear) and walking
//   E         what a tap of E does with it in hand, nothing else in reach, whatever verb wins (a level 'self' row,
//             else drop): before (the prompt), during (an action of MID_MIN seconds or more), after (after a
//             drop, a step off the item, so it shows on the floor and not under you)
//   hold E    when holding E does something else (eating; play/interactions.js): before, E held (the preview pose),
//             during, after
//   <verb>    each other 'self' verb that takes it, which neither reaches there: its result (the row's done)
//   pick_up   it on the floor after the drop (or on the first spot after a put, for an item you can't drop), then in
//             your hand again
//   put       on each spot that takes it: before, during, after
// A panel is a close-up around the player (CROP tiles, drawn at K times the game's view), with the top bar's hand
// slot in its corner. An item's panels make one image, numbered. The labelled copy (each panel's verb) and the
// engine's account of each panel (the verb's row and what it changed) are for the step 2 comparer only.
//
// The same level gives the same bytes: each sequence seeds Math.random from its name (tools/lib/draw.mjs withDom).
import { createHarness } from '../../src/agent/harness.js';
import { createRenderer } from '../../src/render/renderer.js';
import { HUD_H, T, VIEW_W, VIEW_H, UI_FAMILY } from '../../src/render/util.js';
import { actionRow, rowApplies } from '../../src/play/interactions.js';
import { putSpots } from '../../src/sim/mechanics/putdown.js';
import { npcSees } from '../../src/game/perception.js';
import { isDark } from '../../src/game/darkness.js';
import { FIXED_DT, INTERACT_RADIUS, HOLD_TIME, MARKS } from '../../src/config.js';
import { withDom, playerView } from './draw.mjs';

export const K = 2.5; // the drawing's scale over the game's view (VIEW_W x VIEW_H logical px)
export const CROP = { w: 5, h: 4 }; // a panel, in tiles
const PW = CROP.w * T * K; // 400
const PH = CROP.h * T * K; // 320
const COLS = 4;
const GAP = 8;
const CAP = 26; // a panel's caption strip
const HEAD = 34; // the labelled sheet's title strip
const SLOT = { x: 286, y: 6, s: 44 }; // the top bar's hand slot (render/hud.js drawHeld), logical px
const WARM = 2.5; // seconds of the day before a sequence starts: the day-start rings (render/characters.js) are gone
const WALK = 0.3; // seconds of walking before a walking panel
const STEP = 0.2; // seconds of walking away from a dropped item: still within reach to pick it up
const PRETEND = 0.5; // real seconds of pretending before the pretend panel
export const MID_MIN = 0.5; // seconds: an action this long or longer gets a 'during' panel
const AFTER = 0.4; // seconds after an action before its 'after' panel: crumbs and thoughts are up
const CLEAR = INTERACT_RADIUS + 0.5; // tiles: nothing to interact with this near the empty tile
const TRIES = 6; // empty tiles tried per item, when someone sees the player at one
const TROUBLE = new Set(['caught', 'witness:notice', 'witness:tattle', 'trespass:notice', 'trespass']);
const QUIET = new Set(['action:start', 'action:done', 'busy:start', 'busy:end', 'player:stand', 'player:sit', 'say']);
const SOUTH = Math.PI / 2; // facing the camera: what you wear is in view
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // a walk's direction, in order of preference (side views first)

// Every 'self' verb a level can have: its own rows, an eat row per edible item, the generic ones (interactions.js).
function selfVerbs(game) {
  const L = game.level;
  const names = [...Object.keys(L.interactions ?? {}), ...Object.entries(L.items ?? {}).filter(([, i]) => i.edible).map(([t]) => `eat_${t}`), 'sit', 'drop', 'pick_up', 'put'];
  return [...new Set(names)].filter((v) => actionRow(game, v)?.on === 'self');
}

// The spots that take `type` (putdown.js putSpots), in the level's order.
const spotsFor = (level, type) => putSpots(level).filter((e) => e.accepts.includes(type));

// A fresh day of `level`, warmed up: { h, g }.
function freshDay(level, onFrame) {
  const h = createHarness({ level, onFrame });
  h.begin();
  return { h, g: h.game };
}
const run = (h, sec) => { for (let i = 0; i < Math.round(sec / FIXED_DT) && h.game.phase === 'day'; i++) h.frame(); };

// The empty tiles to carry items on, best first: walkable and lit, nothing to interact with within CLEAR tiles, room
// to walk two tiles, nobody seeing it after the warm-up, as far from people as can be. [{ x, y, dir: [dx, dy] }].
export function emptyTiles(level, n = TRIES) {
  const { h, g } = freshDay(level);
  run(h, WARM);
  const map = g.map;
  const walk = (x, y) => map.isWalkable(x, y, 'player');
  const near = [...map.interactables.map((i) => [i.cx, i.cy]), ...putSpots(level).map((e) => [e.x, e.y]), ...g.world.items.map((i) => [i.x, i.y])];
  const out = [];
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const cx = x + 0.5;
      const cy = y + 0.5;
      if (!walk(x, y) || near.some(([ax, ay]) => Math.hypot(ax - cx, ay - cy) < CLEAR)) continue;
      if (level.darkness && isDark(g, cx, cy)) continue;
      if (g.npcs.some((m) => npcSees(g, m, cx, cy))) continue;
      const dir = DIRS.find(([dx, dy]) => walk(x + dx, y + dy) && walk(x + 2 * dx, y + 2 * dy));
      if (!dir) continue;
      const far = Math.min(Infinity, ...g.npcs.filter((m) => m.active).map((m) => Math.hypot(m.x - cx, m.y - cy)));
      out.push({ x, y, dir, far });
    }
  }
  // Far from people first; among equals, the top-left one (the same order every run).
  out.sort((a, b) => b.far - a.far || a.y - b.y || a.x - b.x);
  return out.slice(0, n).map(({ x, y, dir }) => ({ x, y, dir }));
}

// What a verb can change, to tell before from after: the player's own state, the world's flags, the items lying about.
function snapshot(g) {
  const prim = (o, skip) => Object.fromEntries(Object.entries(o).filter(([k, v]) => !skip.has(k) && (v === null || typeof v !== 'object')));
  return {
    player: prim(g.player, new Set(['x', 'y', 'dir', 'moving', 'busy', 'busyPose', 'focus', 'action'])),
    world: prim(g.world, new Set()),
    items: g.world.items.map((i) => (i.spot ? `the ${i.type} on ${i.spot}` : `the ${i.type} on the floor`)),
  };
}
const GLOSS = {
  held: (a, b) => `your hand: ${a ? `the ${a}` : 'empty'} → ${b ? `the ${b}` : 'empty'}`,
  smeared: (a, b) => `player.smeared: ${a} → ${b}${b ? ` (drawn as ${MARKS[b]?.words ?? 'a mark on you'}, for the rest of the loop)` : ''}`,
};
// What changed from snapshot a to b, and what happened in the events between, in words: a list of phrases.
function effect(a, b, events) {
  const out = [];
  for (const k of new Set([...Object.keys(a.player), ...Object.keys(b.player)])) {
    if (a.player[k] !== b.player[k]) out.push(GLOSS[k]?.(a.player[k], b.player[k]) ?? `player.${k}: ${a.player[k]} → ${b.player[k]}`);
  }
  for (const k of new Set([...Object.keys(a.world), ...Object.keys(b.world)])) {
    if (a.world[k] !== b.world[k]) out.push(`world.${k}: ${a.world[k]} → ${b.world[k]}`);
  }
  const gone = a.items.filter((s) => !b.items.includes(s));
  const added = b.items.filter((s) => !a.items.includes(s));
  if (gone.length) out.push(`no longer lying there: ${gone.join(', ')}`);
  if (added.length) out.push(`now lying there: ${added.join(', ')}`);
  const names = [...new Set(events.filter((e) => !QUIET.has(e.name)).map((e) => e.name))];
  if (names.length) out.push(`events: ${names.join(', ')}`);
  for (const e of events.filter((x) => x.name === 'say')) {
    const who = e.payload.owner === 'player' ? 'you' : typeof e.payload.owner === 'string' ? e.payload.owner : 'something';
    out.push(`${who} ${e.payload.kind === 'thought' ? 'think' : 'say'} ${e.payload.icons.join('')}`);
  }
  return out.length ? out : ['nothing'];
}

// A row in words: "eat_letter, 'eat the letter' (😋), an action of 2 s".
function rowText(verb, row, timed = null) {
  const r = timed ?? row;
  const how = row.instant && !timed ? 'instant' : `an action of ${r.duration} s${r.sneaky ? ', sneaky' : ''}`;
  return `${verb}${row.text ? `, '${row.text}'` : ''}${row.icon ? ` (${row.icon})` : ''}, ${how}`;
}

// Puts `type` straight into the player's hand at tile (x, y), standing, facing the camera; any copy of it lying
// about is gone, and its place (items.js `place`) says the player has it, as after picking it up.
function hand(g, type, x, y) {
  const p = g.player;
  Object.assign(p, { x, y, dir: SOUTH, seated: false, moving: false, held: type });
  g.world.items = g.world.items.filter((i) => i.type !== type);
  const place = g.level.items[type].place;
  if (place) g.world[place] = 'player';
}

// One sequence: a fresh day, drawn at K times the view, Math.random seeded from `seed`. fn(S) drives it and
// S.shoot(meta, at) adds a panel (at: the point the close-up centres on, default the player). Returns
// { panels, trouble: [event names], log }.
function sequence(level, lib, seed, fn) {
  const w = VIEW_W * K;
  const hh = VIEW_H * K;
  return withDom(lib, seed, () => {
    let view = null;
    const { h, g } = freshDay(level, () => view.note());
    view = playerView(g);
    const canvas = lib.createCanvas(w, hh);
    const r = createRenderer(canvas, { strict: true });
    r.render(g); // the renderer sees the day start, as a player's screen does
    run(h, WARM);
    const from = h.log.length;
    const panels = [];
    let told = h.log.length; // reactions to the player up to here are in an earlier panel's meta
    const S = {
      h, g, input: g.input, run: (sec) => run(h, sec),
      mark: () => ({ snap: snapshot(g), at: h.log.length }),
      since: (m) => effect(m.snap, snapshot(g), h.log.slice(m.at)),
      shoot(meta, at = null) {
        view.draw(() => r.render(g));
        const p = g.player;
        const cx = at ? (p.x + at.x) / 2 : p.x;
        const cy = (at ? (p.y + at.y) / 2 : p.y) - 0.5; // room above the head for the prompt and bubbles
        const sx = Math.max(0, Math.min(w - PW, Math.round((cx * T - (CROP.w * T) / 2) * K)));
        const sy = Math.max(HUD_H * K, Math.min(hh - PH, Math.round((cy * T + HUD_H - (CROP.h * T) / 2) * K)));
        const pc = lib.createCanvas(PW, PH);
        const c = pc.getContext('2d');
        c.drawImage(canvas, sx, sy, PW, PH, 0, 0, PW, PH);
        // The top bar's hand slot, small, in the corner: what the game says you hold.
        const s = Math.round(SLOT.s * K * 0.6);
        c.fillStyle = 'rgba(20,16,12,0.85)';
        c.fillRect(0, 0, s + 6, s + 6);
        c.drawImage(canvas, SLOT.x * K, SLOT.y * K, SLOT.s * K, SLOT.s * K, 3, 3, s, s);
        const reacted = [...new Set(h.log.slice(told).filter((e) => TROUBLE.has(e.name)).map((e) => (e.payload?.by ? `${e.name} by ${e.payload.by}` : e.name)))];
        told = h.log.length;
        panels.push({ ...meta, canvas: pc, held: p.held, smeared: !!p.smeared, pose: p.busyPose, caught: !!g.caught, reacted });
      },
    };
    fn(S);
    S.input.releaseAll();
    const trouble = [...new Set(h.log.slice(from).filter((e) => TROUBLE.has(e.name)).map((e) => (e.payload?.by ? `${e.name} by ${e.payload.by}` : e.name)))];
    return { panels, trouble };
  }, { w, h: hh });
}

// Runs the timed action the player just started (E pressed): a 'during' panel half way through when it is MID_MIN
// seconds or longer, then waits until it is done.
function finishAction(S, verb, label) {
  const { g, h } = S;
  const a = g.player.action;
  if (!a) return;
  if (a.duration >= MID_MIN) {
    for (let i = 0; i < 6000 && g.player.action && g.player.action.t < a.duration / 2; i++) h.frame();
    if (g.player.action) S.shoot({ verb, phase: 'during', label, intent: `${verb} in progress, ${(g.player.action.t).toFixed(1)} of ${a.duration} s: the action ring fills.` });
  }
  for (let i = 0; i < 6000 && g.player.action && g.phase === 'day'; i++) h.frame();
}

// Presses E on the current focus and shoots before (the prompt), during and after. Returns the focus verb, or null
// when there was no prompt.
function pressE(S, { verb: want = null, at = null, before, after, note = '', away = null }) {
  const { g, h } = S;
  const f = g.player.focus;
  if (!f || (want && f.action !== want)) return null;
  const verb = f.action;
  const row = actionRow(g, verb);
  const target = at ?? (f.kind === 'self' ? null : { x: f.x, y: f.y });
  const alt = f.hold ? ` Holding E instead runs ${rowText(f.hold, actionRow(g, f.hold))}.` : '';
  S.shoot({ verb, phase: 'before', label: `${before ?? verb} · before`, intent: `${note}The E prompt ${f.kind === 'self' ? 'over you' : `on ${f.kind === 'spot' ? `spot ${f.id}` : `the ${f.id}`}`}: a tap of E runs ${rowText(verb, row, f.timed)}.${alt}` }, target);
  const m = S.mark();
  S.input.press('interact');
  h.frame();
  finishAction(S, verb, `${verb} · during`);
  S.run(AFTER);
  const off = verb === 'drop' && away ? stepOff(S, away) : null;
  S.shoot({ verb, phase: 'after', label: `${after ?? verb} · after`, intent: `${verb} done. It changed: ${S.since(m).join('; ')}.${off?.said ?? ''}`, apart: off?.apart }, off?.item ?? target);
  return verb;
}

// Holds E on a focus whose hold runs another verb (f.hold: eating) and shoots before, E held (half of HOLD_TIME: the
// preview pose), during and after. Returns the hold's verb.
function holdE(S, before) {
  const { g, h } = S;
  const f = g.player.focus;
  const verb = f.hold;
  const row = actionRow(g, verb);
  S.shoot({ verb, phase: 'before', label: `${before} · before`, intent: `The E prompt over you: holding E (${HOLD_TIME} s, standing still) runs ${rowText(verb, row)}; a tap runs ${f.action}.` });
  const m = S.mark();
  S.input.press('interact');
  S.input.hold('interact', true);
  S.run(HOLD_TIME / 2);
  S.shoot({ verb, phase: 'holding', label: `${before} · E held`, intent: `E held ${(HOLD_TIME / 2).toFixed(2)} of ${HOLD_TIME} s: the pose previews ${verb} (${f.holdPreview ?? 'no preview'}).` });
  for (let i = 0; i < 600 && !g.player.action && g.phase === 'day'; i++) h.frame();
  finishAction(S, verb, `${verb} · during`);
  S.input.hold('interact', false);
  S.input.releaseAll();
  S.run(AFTER);
  S.shoot({ verb, phase: 'after', label: `${before} · after`, intent: `${verb} done. It changed: ${S.since(m).join('; ')}.` });
  return verb;
}

// A drop leaves the item at the player's feet, where his own figure hides it, so the 'drop · after' panel showed
// nothing dropped. Steps away (still in reach) before that panel, so the item shows on the floor beside him.
// { apart: tiles between him and it, item: where it lies (the panel centres between the two), said: for the intent }.
function stepOff(S, dir) {
  const it = S.g.world.items.at(-1);
  S.input.setAxis(dir[0], dir[1]);
  S.run(STEP);
  S.input.releaseAll();
  S.h.frame();
  const p = S.g.player;
  if (!it) return { apart: 0, item: null, said: '' };
  return { apart: Math.hypot(p.x - it.x, p.y - it.y), item: { x: it.x, y: it.y }, said: ` You stepped off it: the ${it.type} lies on the floor beside you.` };
}

// After a drop and the step off it: picks it up again.
function pickUpAgain(S) {
  const type = S.g.player.focus?.id;
  return pressE(S, { verb: 'pick_up', before: 'on the floor, pick_up', note: `The dropped ${type} on the floor, a step away. ` });
}

// The panels of one item that start from empty tile `tile` (emptyTiles): carrying it, E, the other 'self' verbs,
// picking it up again after a drop. Returns { panels, trouble: [event names], missing: [what wasn't drawn], selves,
// eVerb }.
function tilePanels(level, lib, type, tile) {
  const flags = level.items[type];
  const at = { x: tile.x + 0.5, y: tile.y + 0.5 };
  const seed = (s) => `verbs:${type}:${s}`;
  const out = { panels: [], trouble: new Set(), missing: [], selves: [], eVerb: null, holdVerb: null };
  const add = (res) => { out.panels.push(...res.panels); for (const t of res.trouble) out.trouble.add(t); };

  // Carrying it: walking, pretending standing, pretending walking.
  add(sequence(level, lib, seed('carry'), (S) => {
    hand(S.g, type, at.x, at.y);
    S.h.frame();
    out.selves = selfVerbs(S.g).filter((v) => rowApplies(S.g, actionRow(S.g, v)));
    S.input.setAxis(tile.dir[0], tile.dir[1]);
    S.run(WALK);
    S.shoot({ verb: 'carry', phase: 'walking', label: 'carry · walking', intent: `You walk holding the ${type}.` });
    S.input.releaseAll();
    S.input.hold('busy', true);
    S.run(PRETEND);
    const bulky = flags.bulky ? ' It is bulky (items.js): no pretending while you carry it (player.js).' : '';
    S.shoot({ verb: 'pretend', phase: 'standing', label: 'pretend · standing', intent: `You pretend, standing still, holding the ${type}: pose ${S.g.player.busyPose ?? 'none'} (DESIGN.md: an item you hold goes to your ear like a phone; pretending hides what you carry).${bulky}` });
    S.input.setAxis(-tile.dir[0], -tile.dir[1]);
    S.run(WALK);
    S.shoot({ verb: 'pretend', phase: 'walking', label: 'pretend · walking', intent: `You pretend while walking, holding the ${type}: pose ${S.g.player.busyPose ?? 'none'} (DESIGN.md: walking, you stride with a folder).${bulky}` });
  }));

  // E with it in hand, nothing else in reach: whatever wins.
  add(sequence(level, lib, seed('e'), (S) => {
    hand(S.g, type, at.x, at.y);
    S.h.frame();
    const f = S.g.player.focus;
    if (!f) {
      S.shoot({ verb: 'E', phase: 'none', label: 'E · no prompt', intent: `No prompt: with the ${type} in hand and nothing in reach, E does nothing (no 'self' row takes it).` });
      return;
    }
    if (f.kind !== 'self') {
      out.missing.push(`E: something is in reach at tile ${tile.x},${tile.y} (${f.action} on ${f.id})`);
      return;
    }
    out.holdVerb = f.hold ?? null;
    out.eVerb = pressE(S, { before: `E → ${f.action}`, away: tile.dir });
    if (out.eVerb === 'drop') pickUpAgain(S);
  }));

  // Holding E, when that runs another verb (eating): a fresh day.
  if (out.holdVerb) {
    add(sequence(level, lib, seed('hold'), (S) => {
      hand(S.g, type, at.x, at.y);
      S.h.frame();
      if (S.g.player.focus?.hold !== out.holdVerb) { out.missing.push(`hold E: the ${out.holdVerb} prompt is gone after a frame`); return; }
      holdE(S, `hold E → ${out.holdVerb}`);
    }));
  }

  // The other 'self' verbs that take it, which neither a tap nor a hold of E reaches here: their result.
  for (const verb of out.selves.filter((v) => v !== out.eVerb && v !== out.holdVerb)) {
    add(sequence(level, lib, seed(verb), (S) => {
      hand(S.g, type, at.x, at.y);
      S.h.frame();
      const p = S.g.player;
      const row = actionRow(S.g, verb);
      if (!rowApplies(S.g, row)) { out.missing.push(`${verb}: no longer possible after a frame`); return; }
      const m = S.mark();
      row.done(S.g, { type: verb, targetId: 'self', kind: 'self', id: 'self', x: p.x, y: p.y, item: null });
      S.run(AFTER);
      const off = verb === 'drop' ? stepOff(S, tile.dir) : null;
      const by = out.eVerb ? `E does not reach it here: a tap runs ${out.eVerb}${out.holdVerb ? `, a hold ${out.holdVerb}` : ''}` : 'E does not reach it here';
      S.shoot({ verb, phase: 'after', label: `${verb} · after (not on E)`, intent: `${rowText(verb, row)}; ${by}, so the sheet shows its result only. It changed: ${S.since(m).join('; ')}.${off?.said ?? ''}`, apart: off?.apart }, off?.item ?? null);
      if (verb === 'drop') pickUpAgain(S);
    }));
  }
  return { ...out, trouble: [...out.trouble] };
}

// The panels of one item on the spots that take it: put on each, from the nearest tile in reach that nobody watches
// (else the nearest); and, for an item that can't be dropped, picked up again from the first. { panels, trouble,
// missing }.
function spotPanels(level, lib, type, dropped) {
  const out = { panels: [], trouble: new Set(), missing: [] };
  for (const [k, e] of spotsFor(level, type).entries()) {
    const res = sequence(level, lib, `verbs:${type}:put-${e.name}`, (S) => {
      const { g } = S;
      const tiles = [];
      for (let y = Math.floor(e.y - INTERACT_RADIUS); y <= e.y + INTERACT_RADIUS; y++) {
        for (let x = Math.floor(e.x - INTERACT_RADIUS); x <= e.x + INTERACT_RADIUS; x++) {
          const d = Math.hypot(x + 0.5 - e.x, y + 0.5 - e.y);
          if (d > INTERACT_RADIUS - 0.05 || !g.map.isWalkable(x, y, 'player')) continue;
          tiles.push({ x, y, d, seen: g.npcs.some((m) => npcSees(g, m, x + 0.5, y + 0.5)) ? 1 : 0 });
        }
      }
      tiles.sort((a, b) => a.seen - b.seen || a.d - b.d || a.y - b.y || a.x - b.x);
      const taken = g.world.items.find((i) => i.spot === e.name && i.type !== type);
      if (taken) { out.missing.push(`put on ${e.name}: the ${taken.type} lies there at day start, and a spot holds one item`); return; }
      const t = tiles.find((c) => {
        hand(g, type, c.x + 0.5, c.y + 0.5);
        S.h.frame();
        return g.player.focus?.action === 'put' && g.player.focus.id === e.name;
      });
      if (!t) { out.missing.push(`put on ${e.name}: no tile in reach of it gives the put prompt`); return; }
      pressE(S, { verb: 'put', at: { x: e.x, y: e.y }, before: `put on ${e.name}`, after: `put on ${e.name}` });
      if (!dropped && k === 0) {
        S.h.frame();
        pressE(S, { verb: 'pick_up', at: { x: e.x, y: e.y } });
      }
    });
    out.panels.push(...res.panels);
    for (const t of res.trouble) out.trouble.add(t);
  }
  return { ...out, trouble: [...out.trouble] };
}

// Lays out panels as one image: numbered captions (labels: each panel's label too, and a title strip). Returns PNG.
function sheetPng(lib, panels, { title = null, labels = false } = {}) {
  const rows = Math.max(1, Math.ceil(panels.length / COLS));
  const head = title ? HEAD : 0;
  const w = COLS * PW + (COLS + 1) * GAP;
  const h = head + rows * (CAP + PH + GAP) + GAP;
  const cv = lib.createCanvas(w, h);
  const c = cv.getContext('2d');
  c.fillStyle = '#1e1a16';
  c.fillRect(0, 0, w, h);
  c.textBaseline = 'middle';
  c.textAlign = 'left';
  if (title) {
    c.fillStyle = '#f3e6c8';
    c.font = `bold 18px ${UI_FAMILY}`;
    c.fillText(title, GAP, GAP + HEAD / 2 - 2);
  }
  panels.forEach((p, i) => {
    const x = GAP + (i % COLS) * (PW + GAP);
    const y = head + GAP + Math.floor(i / COLS) * (CAP + PH + GAP);
    c.fillStyle = '#f3e6c8';
    c.font = `bold 15px ${UI_FAMILY}`;
    const cap = labels ? `${i + 1}  ${p.label}` : String(i + 1);
    c.fillText(cap.length > 46 ? `${cap.slice(0, 45)}…` : cap, x + 2, y + CAP / 2);
    c.drawImage(p.canvas, x, y + CAP, PW, PH);
  });
  return cv.toBuffer('image/png');
}

// What the item is, from items.js, in words: "✉️; edible; contraband: boss; place: world.letter". icon: false for
// the drawn title (the UI font has no emoji).
function itemText(type, flags, { icon = true } = {}) {
  const out = [icon ? flags.icon ?? '' : ''];
  if (flags.edible) out.push('edible');
  if (flags.keep) out.push('keep (no drop)');
  if (flags.bulky) out.push('bulky');
  if (flags.put) out.push(`put: a ${flags.put} s sneaky action`);
  if (flags.disguise) out.push('disguise');
  if (flags.contraband) out.push(`contraband: ${flags.contraband}`);
  if (flags.owner?.id) out.push(`owner: ${flags.owner.id}`);
  if (flags.place) out.push(`place: world.${flags.place}`);
  return out.filter(Boolean).join('; ');
}

// The verb sheets of `level`: one per item in level.items, in its order. items: the item types to draw (default all).
// Returns { tile, sheets: [{ file, name, type, png (numbers only, for step 1), labelled (for step 2), panels:
// [{ verb, phase, label, intent, held, smeared, pose, caught, reacted }], intent (markdown), trouble, missing, eVerb (a
// tap of E), holdVerb (holding E, or null) }] }.
export function captureVerbs(level, { lib, items = Object.keys(level.items ?? {}) } = {}) {
  const tiles = emptyTiles(level);
  const sheets = [];
  for (const [i, type] of items.entries()) {
    if (!level.items?.[type]) throw new Error(`verb sheet: no item '${type}' in level.items`);
    // The first empty tile where nobody reacts to the player carrying it (else the first).
    let best = null;
    for (const tile of tiles) {
      const res = { tile, ...tilePanels(level, lib, type, tile) };
      res.troubled = res.trouble.length > 0 || res.panels.some((p) => p.caught);
      if (!best || (best.troubled && !res.troubled)) best = res;
      if (!res.troubled) break;
    }
    if (!best) throw new Error(`verb sheet: no empty tile to carry the ${type} on`);
    const spots = spotPanels(level, lib, type, best.selves.includes('drop'));
    const all = [...best.panels, ...spots.panels];
    const trouble = [...new Set([...best.trouble, ...spots.trouble])];
    const missing = [...best.missing, ...spots.missing];
    const n = String(i + 1).padStart(2, '0');
    const flags = level.items[type];
    const panels = all.map(({ canvas, ...meta }) => meta);
    const intent = [
      `### verbs/${n}.png: the ${type} (${itemText(type, flags)})`,
      `Carried from tile ${best.tile.x},${best.tile.y}.${trouble.length ? ` Someone reacted to you on this sheet: ${trouble.join(', ')}.` : ''}`,
      ...panels.map((p, k) => `${k + 1}. ${p.label}: ${p.intent}${p.reacted.length ? ` (Someone reacted to you by this panel: ${p.reacted.join(', ')}.)` : ''}${p.caught ? ' (You are caught in this panel.)' : ''}`),
      ...missing.map((m) => `- Not drawn: ${m}.`),
      '',
    ].join('\n');
    sheets.push({
      file: `${n}.png`, name: `${n}-${type}.png`, type, tile: best.tile,
      png: sheetPng(lib, all),
      labelled: sheetPng(lib, all, { title: `the ${type}: ${itemText(type, flags, { icon: false })}`, labels: true }),
      panels, intent, trouble, missing, selves: best.selves, eVerb: best.eVerb, holdVerb: best.holdVerb,
    });
  }
  return { tiles, sheets };
}

// The verb sheets' part of the step 2 intents (markdown).
export function verbsIntents(sheets) {
  if (!sheets.length) return '';
  return ['## Verb sheets', '',
    'Each image in verbs/ is one item of the level, drawn by the tool, not chosen in shots.js: the item put straight into',
    'your hand at an empty tile, then every generic verb on it, each sequence a fresh day. Each panel\'s intent is the',
    'engine\'s: the verb\'s row and what it changed. The box in each panel\'s corner is the top bar\'s hand slot.', '',
    ...sheets.map((s) => s.intent)].join('\n');
}
