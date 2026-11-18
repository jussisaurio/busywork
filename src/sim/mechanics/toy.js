// Toys (level.toys): a prop plus a cosmetic reaction. You poke something, or someone passes it, and the office
// answers: a bubble, a sound, a pose for a moment, the prop's own drawn state. A toy never decides anything.
//
// What makes that hold, by construction:
//   - A toy's state lives in game.toys (createToys, a fresh one each loop), never in game.world, a person or the
//     player. Its `when` reads; its reaction is data the engine applies (react below), never a function of the game.
//   - The only things a reaction writes: game.toys, game.fx (a bubble, a burst) and one event, `toy:<id>`. Its bubble's
//     'say' event carries `toy: <id>`, and it never covers a real line still showing (core/fx.js say). The behaviour goldens skip both (tools/lib/trace.mjs), so adding a toy moves no
//     golden; the gate's `toy-neutral` check replays every winning golden plan with every toy fired over and over
//     and requires the same trace.
//   - A pose is drawn only (render/characters.js reads game.toys.poses): arms, a scowl, the head turned to the prop.
//     npc.dir, his path and his override never change.
//   - E: a press toy is an action on its target like a row, under the same hand rule (play/interactions.js): it
//     needs no held item unless it says (`hand`), so on its target any action that uses what you hold wins over it.
//     Sharing a target with a row that needs no held item either, one of the two names the other in `over`.
//
// A toy:
//   id       unique; a harness goto target (you walk up to it) and the event `toy:<id>`
//   at       where the prop is: { x, y } (a tile), or a level spot name
//   on       'press' (you press E within reach of it) | 'pass' (one of `npcs` comes within `radius` of it) |
//            'near' (one of `npcs` comes within `radius` of you)
//   npcs     pass / near: who reacts (cast ids)
//   radius   pass / near: tiles (default 2)
//   sees     pass / near: he must also see the prop (pass) or you (near)
//   when(world, state, game, npc)  optional: only while this holds (read only). state: the toy's own (below);
//            npc: who would react (pass / near), the player for press
//   every    seconds before it can fire again (default: press 1, pass / near 3, per person)
//   state    the toy's own starting state ({ tilted: false }); react.set changes it; painters read it (toyState)
//   text     press: the harness's words for the verb ('push the bar')
//   hand, over  press: what it needs in your hand, and the actions on its target it wins over (as for a row:
//            play/interactions.js). Its target: the interactable on its tile, else its prop
//   line     the harness's line when it fires (`<by>` is replaced by who did it)
//   react    what happens, all optional:
//     say    [icons] or { icons, kind, ttl, who }: a bubble. who: 'by' (default: whoever fired it), 'prop' (from
//            the prop: a voice behind a door), a cast id or 'player'. Skipped while that speaker has a real
//            (non-toy) bubble up: a toy never talks over the sim's line
//     sfx    a recipe in audio/sfx.js, played at the prop (audio/audio.js)
//     pose   { arms?, angry?, face?, slump?, for? }: drawn on whoever fired it for `for` seconds (default 1.5); face:
//            his head turns to the prop (arms: a render/characters.js pose, e.g. 'point', 'reach', 'shrug'); slump:
//            asleep, his head forward on the desk, glances not shown (drawn only: he sees exactly as before)
//     set    { key: value }: the toy's new state
//     add    { key: n }: added to the toy's state (a count: lines typed on a screen)
//     reset  [toy ids]: those toys' state back to how it started (the owner deletes what you typed). With a walk
//            (stand), toyState shows the old state until he arrives
//     burst  { kind, n?, speed?, lift?, ttl? }: particles at the prop (core/fx.js BURST_KINDS)
//   stand    pass / near, optional: { x, y } (tile units), where a person stands to do it, at arm's length from the
//            prop. He is drawn walking over, doing it there (the pose waits for him to arrive) and hurrying back to
//            where he really is (game/toy-walk.js toyWalkAt). Drawn only, like the pose: his body in the sim walks on.
//   try      harness commands after which it has fired (the gate's `toys` check plays them)
//
// The walk to `stand` (game/toy-walk.js): a toy cannot stop or route a person, so the sim never knows. The drawn body
// leaves his path where the toy fired, walks to `stand` (NPC_SPEED), does the pose there, then walks back to where
// it left him and follows his real track (recorded every step in game.toys.walks) at WALK_BACK times his speed until
// it is on him again. Bounded so the picture never lies about something that matters:
//   - only when he is on his feet, not in an override (a hunt, a scene, the meeting) and `stand` is within WALK_MAX
//     tiles of him; otherwise the old reach in passing
//   - it ends at once, snapping the drawing back onto him, the moment he tells on or catches anyone (a sightline
//     from him) or notices someone (game.watch), his override changes, or WALK_CAP seconds pass. Seeing stays where
//     he really is (vision cones are drawn from his sim position), so a sighting is never drawn from the wrong place
//     for longer than the lag (at most about 2 s of his walk).
import { NPC_SPEED } from '../../config.js';
import { walkAt, dist } from '../../game/toy-walk.js';
import { say, burst } from '../../core/fx.js';
import { npcSees } from '../../game/perception.js';

const DEFAULT_EVERY = 3;
const DEFAULT_RADIUS = 2;
const DEFAULT_POSE = 1.5;
const WALK_MAX = 3.5; // tiles: farther from `stand` than this, he reaches in passing (no walk)
const WALK_CAP = 7; // s: a walk still behind him after this snaps back

// A fresh game.toys for a new loop: { byId: { id: { state, firedAt, by, n, last } }, poses: { who: pose } }.
export function createToys(level) {
  const byId = {};
  for (const t of level.toys ?? []) byId[t.id] = { state: { ...t.state }, firedAt: null, landsAt: null, by: null, n: 0, last: {} };
  return { byId, poses: {}, walks: {} };
}

// The prop's centre in tile units.
export function toyPos(level, toy) {
  if (typeof toy.at === 'string') {
    const s = level.spots[toy.at];
    return { x: s.x + 0.5, y: s.y + 0.5 };
  }
  return { x: toy.at.x + 0.5, y: toy.at.y + 0.5 };
}

// What a painter reads: the toy's state, plus `since` (seconds since it last fired, null if never) and `by`. While a
// walk is on its way (stand), the state is still what it was: what he does lands when he gets there (fire, land).
const NO_TOY = { since: null, by: null, n: 0 };
export function toyState(game, id) {
  const t = game.toys?.byId[id];
  if (!t) return NO_TOY;
  const state = t.held && game.loopTime < t.held.until ? t.held.state : t.state; // a change still on its way (fire)
  return { ...state, since: t.firedAt === null ? null : game.loopTime - t.firedAt, by: t.by, n: t.n };
}

const ready = (game, toy, t, who) => {
  const last = t.last[who];
  return last === undefined || game.loopTime - last >= (toy.every ?? (toy.on === 'press' ? 1 : DEFAULT_EVERY));
};

// The player pressed E on the toy focus `f`.
export function pressToy(game, f) {
  const toy = game.level.toys.find((t) => t.id === f.id);
  const t = game.toys.byId[toy.id];
  if (!ready(game, toy, t, 'player')) return;
  fire(game, toy, 'player');
}

// Every step (game/loop.js): pass and near toys.
// The non-press toys of a level with what never changes per step worked out once (position, radius squared, interval).
const ACTIVE = new WeakMap();
function activeToys(level) {
  let list = ACTIVE.get(level);
  if (!list) {
    list = [];
    for (const toy of level.toys) {
      if (toy.on === 'press') continue;
      const r = toy.radius ?? DEFAULT_RADIUS;
      list.push({ toy, at: toyPos(level, toy), r, r2: r * r, pass: toy.on === 'pass', every: toy.every ?? DEFAULT_EVERY });
    }
    ACTIVE.set(level, list);
  }
  return list;
}

export function updateToys(game) {
  const toys = game.level.toys;
  if (!toys || !game.toys) return;
  const p = game.player;
  const walks = game.toys.walks;
  updateWalks(game);
  const npcs = game.npcs;
  for (const { toy, at, r, r2, pass, every } of activeToys(game.level)) {
    const to = pass ? at : p;
    let t = null;
    for (let i = 0; i < npcs.length; i++) {
      const n = npcs[i];
      const dx = to.x - n.x;
      const dy = to.y - n.y;
      const d2 = dx * dx + dy * dy; // Math.hypot is slow: only the razor's edge (within 1e-9 of the radius) needs it
      if (d2 > r2 * (1 + 1e-9) || (d2 >= r2 * (1 - 1e-9) && Math.hypot(dx, dy) > r)) continue;
      if (walks[n.id]) continue; // already off to one: he deals with one thing at a time
      if (!n.active || !toy.npcs.includes(n.id)) continue;
      t = t ?? game.toys.byId[toy.id];
      const last = t.last[n.id];
      if (!(last === undefined || game.loopTime - last >= every)) continue;
      if (toy.when && !toy.when(game.world, t.state, game, n)) continue; // before the sight check: it is the cheap one
      if (toy.sees && !npcSees(game, n, to.x, to.y)) continue;
      fire(game, toy, n.id);
    }
  }
}

// The walks: record each walker's real track, and end the ones caught up or cut short (header).
function updateWalks(game) {
  const walks = game.toys.walks;
  for (const id in walks) {
    const w = walks[id];
    const n = game.npcs.find((m) => m.id === id);
    const cut = !n || !n.active || n.override !== w.override || game.loopTime - w.t0 > WALK_CAP
      || game.fx.lines?.some((l) => l && l.from === id) || (game.watch && Object.hasOwn(game.watch, id));
    if (cut) { land(game, w, id); delete walks[id]; continue; } // he does it from where he is, as with no walk
    const last = w.trail[w.trail.length - 1];
    if (!last || last.x !== n.x || last.y !== n.y) w.trail.push({ x: n.x, y: n.y });
    if (!walkAt(game, w)) delete walks[id];
  }
}

// A walk cut short (updateWalks): what he went to do lands now, from where he is (the pose too), never dropped.
function land(game, w, who) {
  const now = game.loopTime;
  for (const id of [w.toy, ...w.resets]) {
    const b = game.toys.byId[id];
    if (b?.held && b.held.until > now) b.held.until = now;
    if (b && b.landsAt > now) b.landsAt = now;
  }
  const pose = game.toys.poses[who];
  if (pose && pose.from > now) { pose.until = now + (pose.until - pose.from); pose.from = now; }
}

// The reaction. who: 'player' or an NPC id.
export function fire(game, toy, who) {
  const t = game.toys.byId[toy.id];
  const at = toyPos(game.level, toy);
  const r = toy.react ?? {};
  // A walk over to it first (header): the pose, and what he changes, wait until he is there.
  let from = game.loopTime;
  const n = toy.stand && who !== 'player' ? game.npcs.find((m) => m.id === who) : null;
  if (n && n.active && n.pose !== 'sit' && !n.override && !game.toys.walks[who] && dist(n, toy.stand) <= WALK_MAX) {
    const fix = r.pose?.for ?? DEFAULT_POSE;
    game.toys.walks[who] = { t0: game.loopTime, from: { x: n.x, y: n.y }, stand: { ...toy.stand }, at, fix, override: n.override, trail: [],
      toy: toy.id, resets: r.reset ?? [] };
    from += dist(n, toy.stand) / NPC_SPEED;
  }
  const hold = (b) => { b.held = from > game.loopTime ? { state: { ...b.state }, until: from } : null; };
  t.firedAt = game.loopTime;
  t.landsAt = from; // when it shows: on arrival (painters that order toys by time read it, e.g. the picture's tilt)
  t.last[who] = game.loopTime;
  t.by = who;
  t.n += 1;
  if (r.set || r.add) hold(t);
  if (r.set) Object.assign(t.state, r.set);
  if (r.add) for (const k in r.add) t.state[k] = (t.state[k] ?? 0) + r.add[k];
  for (const id of r.reset ?? []) {
    const o = game.level.toys.find((x) => x.id === id);
    const b = o && game.toys.byId[id];
    if (!b) continue;
    hold(b);
    b.state = { ...o.state };
  }
  if (r.pose) game.toys.poses[who] = { ...r.pose, from, until: from + (r.pose.for ?? DEFAULT_POSE), x: at.x, y: at.y };
  if (r.burst) burst(game, r.burst.kind, at.x, at.y, r.burst.n ?? 8, r.burst);
  if (r.say) {
    const s = Array.isArray(r.say) ? { icons: r.say } : r.say;
    const speaker = s.who === undefined || s.who === 'by' ? who : s.who === 'prop' ? { x: at.x, y: at.y } : s.who;
    // A toy never talks over a real line: the sim may wait on that bubble (and it is the one that matters).
    const busy = typeof speaker === 'string' && game.fx.bubbles.some((b) => b.ownerKey === speaker && !b.toy);
    if (!busy) say(game, speaker, s.icons, { kind: s.kind, ttl: s.ttl, toy: toy.id });
  }
  game.events.emit(`toy:${toy.id}`, { id: toy.id, by: who, x: at.x, y: at.y });
}
