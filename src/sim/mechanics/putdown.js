// Put down: the player sets what she holds on a spot that takes it (a desk, an in-tray, a shelf). It lies there in
// plain view until someone picks it up, and everyone judges it where it lies.
//
// Level data (on level.spots; a spot without `accepts` takes nothing):
//   accepts   the item types it takes, e.g. ['laptop', 'mug'] (one item at a time)
//   owner     whose spot it is (optional):
//             'player'   what lies on it is yours: the office rules judge it as if you held it. An enforcing
//                        authority who sees contraband there catches you; an owner who knows it's his (items.js
//                        `owner`) takes it back, with his `says`. Pretending doesn't hide a desk.
//             a cast id  he reacts once to each item he finds on it (sees it from within FIND_RADIUS tiles)
//   found     what the cast owner does (default 'take'):
//             'take'     he picks it up (npc.carry; world[place] = his id)
//             a name     a behaviour hook: level.behaviours[found].arrive(game, npc, sim, { type, spot, item, seen });
//                        what the hook leaves on the spot stays there
//   unseen    what the cast owner does instead when he didn't see who put it there (default: as `found`):
//             'leave'    nothing: it isn't his business how it got there (it stays; he reacts to it no more)
//             'take', or a hook name, as for `found` (seen: false)
//             Who saw it put there: every NPC who saw her when it landed (item.seenBy, a list of ids).
// The item lies on the tile the spot faces (the desk in front of the chair; the spot's own tile without a face).
// A world item on a spot carries `spot: name` (itemOn() builds one for initialWorld); picking it up frees the
// spot. An item with a `place` sets world[place] = the spot's name while it lies there.
//
// The player's action is the generic 'put' row (instant; play/interactions.js): the nearest free spot that takes
// what she holds, within INTERACT_RADIUS of where the item would lie. Harness: `put [spot] [pretend]`.
// An item (items.js) with `put: s` is evidence you don't set down in front of people: putting it down is a timed
// sneaky action of s seconds instead (to everyone: the authority who sees it catches her, anyone else tells and
// stops it; moving stops it too). The focus carries the timing (focus.timed; interactions.js startAction).
// Events: item:put { type, spot }; item:found { type, spot, by } when a cast owner finds it (on a spot with
// `unseen`: { type, spot, by, seen }, seen: whether he saw who put it there).
import { INTERACT_RADIUS } from '../../config.js';
import { DIRS } from '../../core/vision.js';
import { sightline } from '../../core/fx.js';
import { npcSees } from '../../game/perception.js';
import { speak } from '../override.js';

export const FIND_RADIUS = 2; // tiles: how close a cast owner must be to notice what's on his spot

// Where an item on spot s lies: the centre of the tile the spot faces (its own tile if it has no face).
export function restOf(s) {
  const d = DIRS[s.face];
  if (d === undefined) return { x: s.x + 0.5, y: s.y + 0.5 };
  return { x: s.x + 0.5 + Math.round(Math.cos(d)), y: s.y + 0.5 + Math.round(Math.sin(d)) };
}

// A world item lying on a spot, for a level's initialWorld().
export const itemOn = (spots, name, type) => ({ type, ...restOf(spots[name]), spot: name });

// The level's spots that take items: [{ name, accepts, owner, found, unseen, x, y }] (x, y: where the item lies).
// Cached.
const cache = new WeakMap();
export function putSpots(level) {
  let list = cache.get(level);
  if (!list) {
    // (src/levels/validate.js checks at load that accepts, owner and found name what exists.)
    list = Object.entries(level.spots ?? {}).filter(([, s]) => s.accepts?.length)
      .map(([name, s]) => ({ name, accepts: s.accepts, owner: s.owner ?? null, found: s.found ?? 'take', unseen: s.unseen ?? null, ...restOf(s) }));
    cache.set(level, list);
  }
  return list;
}

const itemAt = (w, name) => w.items.find((i) => i.spot === name);

// --- The player's action (play/interactions.js) ---------------------------------------------

// The put row's test: she holds something this spot takes, and nothing lies on it.
export const canPut = (p, w, e) => !!p.held && e.accepts.includes(p.held) && !itemAt(w, e.name);

// The row (interactions.js adds it to every level's table as 'put'). done(game, focus): focus.item is the spot.
export const PUT_ROW = {
  on: 'spot', icon: '📥', text: 'put it down', instant: true, can: canPut,
  done: (game, a) => putHeld(game, a.item),
};

// The ✋ target for putting down: the nearest free spot in reach that takes what she holds, if nearer than
// `than`; else null. row: the level's 'put' row. An item with `put: s` makes it a timed sneaky action (focus.timed).
export function putFocus(game, than, row) {
  const p = game.player;
  if (!p.held || !row) return null;
  let best = null;
  for (const e of putSpots(game.level)) {
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (!(d <= INTERACT_RADIUS && d < than) || !row.can(p, game.world, e)) continue;
    than = d;
    best = { kind: 'spot', id: e.name, x: e.x, y: e.y, icon: row.icon, action: 'put', item: e };
  }
  const flags = best && game.level.items?.[p.held];
  if (flags?.put) best.timed = { duration: flags.put, sneaky: true, owner: null, saw: flags.icon };
  return best;
}

// Put what she holds on spot entry e (putSpots).
export function putHeld(game, e) {
  const p = game.player;
  const type = p.held;
  if (!type) return;
  // Who saw it land: anyone who sees her now (a spot's owner who didn't may react differently: `unseen`).
  const seenBy = game.npcs.filter((n) => npcSees(game, n, p.x, p.y)).map((n) => n.id);
  game.world.items.push({ type, x: e.x, y: e.y, spot: e.name, seenBy });
  const place = game.level.items?.[type]?.place;
  if (place) game.world[place] = e.name;
  p.held = null;
  game.events.emit('item:put', { type, spot: e.name });
}

// --- A cast owner finds it (an NPC mechanic: mechanics/index.js) -----------------------------

// Mechanic entries: one per spot with a cast owner.
export const entries = (level) => putSpots(level).filter((e) => e.owner && e.owner !== 'player').map((e) => ({ npc: e.owner, spot: e }));

export const owns = () => false; // finding is instant: no override of its own

export function check(game, npc, { spot: e }, now, sim) {
  if (!npc.active) return;
  const it = itemAt(game.world, e.name);
  if (!it || it.foundBy) return;
  if (Math.hypot(it.x - npc.x, it.y - npc.y) > FIND_RADIUS || !npcSees(game, npc, it.x, it.y)) return;
  it.foundBy = npc.id;
  // Did he see who put it there? (An item that started the day there: nobody did.)
  const seen = !!it.seenBy?.includes(npc.id);
  const does = e.unseen && !seen ? e.unseen : e.found;
  game.events.emit('item:found', { type: it.type, spot: e.name, by: npc.id, ...(e.unseen ? { seen } : {}) });
  if (does === 'leave') return;
  if (does === 'take') take(game, npc, it);
  else game.level.behaviours[does].arrive(game, npc, sim, { type: it.type, spot: e.name, item: it, seen });
}

function take(game, npc, it) {
  const w = game.world;
  w.items = w.items.filter((i) => i !== it);
  npc.carry = it.type;
  if (npc.wants === it.type) npc.wants = null;
  const place = game.level.items?.[it.type]?.place;
  if (place) w[place] = npc.id;
}

// --- The office rules for the player's own spots (play/rules.js, via mechanics/index.js judge) -------

const mineCache = new WeakMap();
const playerSpots = (level) => {
  let list = mineCache.get(level);
  if (!list) mineCache.set(level, (list = putSpots(level).filter((e) => e.owner === 'player')));
  return list;
};

// What lies on her spots, judged as if she held it, by whoever sees it there (at once, unlike a held item): the
// authority catches her; an owner takes it back, with his `says`; anyone else who minds it tells (unheard).
// rules: { claims, enforcing, caught } from play/rules.js. Returns true if she was caught.
export function judge(game, rules) {
  const mine = playerSpots(game.level);
  if (!mine.length) return false;
  const w = game.world;
  for (const e of mine) {
    const it = itemAt(w, e.name);
    if (!it) continue;
    const flags = game.level.items?.[it.type];
    for (const npc of game.npcs) {
      const claims = rules.claims(game, npc, it.type);
      if (!claims && !(npc.id === flags?.contraband && rules.enforcing(game, npc))) continue;
      if (it.toldBy?.includes(npc.id) || !npcSees(game, npc, it.x, it.y)) continue;
      if (npc.id === game.level.roles?.authority?.id) {
        sightline(game, npc.id, 'caught', 1.6);
        rules.caught(game, 'contraband');
        return true;
      }
      (it.toldBy ??= []).push(npc.id);
      sightline(game, npc.id, 'tattle', 1.2);
      if (claims) {
        w.items = w.items.filter((i) => i !== it);
        if (flags.owner.reclaim) flags.owner.reclaim(game, npc);
        else {
          npc.carry = it.type;
          if (npc.wants === it.type) npc.wants = null;
          game.events.emit(`${it.type}:confiscated`, { by: npc.id });
        }
        speak(game, npc, flags.owner.says);
      }
      game.events.emit('witness:tattle', { by: npc.id, reason: 'contraband', heard: false });
      if (claims) break; // it's gone
    }
  }
  return false;
}
