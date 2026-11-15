// Interactions: picks player.focus (the ✋ hint target), runs the timed actions and applies their results.
// Runs right after updatePlayer.
//
// The actions are the level's (level.interactions, keyed by verb; see levels/meeting/interactions.js for the
// row fields), then one per edible item, then the generic ones every level has:
//   holding an edible item                       -> eat_<type> (sneaky to its owner; leaves player.smeared)
//   own_desk (not seated)                        -> sit (instant)
//   holding anything, no level 'self' row valid  -> drop (instant; not an item with `keep`)
//   empty hands, dropped item within ITEM_RADIUS -> pick_up (an item on a spot: within INTERACT_RADIUS)
//   holding what a free spot takes               -> put (instant, or timed for an item with `put`; putdown.js)
// The nearest valid target wins; 'self' targets only apply when nothing else is valid.
import { INTERACT_RADIUS, PICK_UP_TIME, EAT_TIME } from '../config.js';
import { say, burst } from '../core/fx.js';
import { inputOf, playerLocked, setBusy, sitAtDesk } from './player.js';
import { actionNoise } from '../sim/mechanics/attention.js';
import { PUT_ROW, putFocus } from '../sim/mechanics/putdown.js';

const ITEM_RADIUS = 1.0; // pick-up reach for floor items

// Generic rows. instant: done at once, no timed action (and so never witnessed in progress).
const GENERIC = {
  sit: { on: 'own_desk', icon: '🪑', text: 'sit down', instant: true, can: (p) => !p.seated, done: sitAtDesk },
  drop: { on: 'self', icon: '⬇️', text: null, instant: true, can: (p) => !!p.held, done: dropHeld }, // the harness names what is dropped
  pick_up: {
    on: 'item', icon: '✋', text: 'pick it up', duration: PICK_UP_TIME, sneaky: false,
    can: (p, w, item) => !p.held && w.items.includes(item),
    done: pickUp,
  },
  put: PUT_ROW, // holding what a free spot in reach takes (mechanics/putdown.js; instant)
};

// Eating an edible item you hold: the boss reads it as slacking, its owner (if any) as theft, and the mustard
// (player.smeared) stays on you for the loop.
function eatRow(type, item) {
  const owner = item.owner?.id ?? null;
  return {
    on: 'self', icon: '😋', text: `eat the ${type}`, duration: EAT_TIME, sneaky: !!owner, owner, idle: true, saw: item.icon,
    can: (p) => p.held === type,
    done(game) {
      const p = game.player;
      p.held = null;
      p.smeared = true; // the evidence is now on you
      if (item.place) game.world[item.place] = 'eaten';
      burst(game, 'crumbs', p.x, p.y, 12, { speed: 1.0, ttl: 0.7 });
      say(game, 'player', ['😋'], { kind: 'thought', ttl: 1.5 });
      game.events.emit(`${type}:eaten`, {});
    },
  };
}

// A level's action table: its own rows first (in its order), then an eat row per edible item, then the generic
// rows. A level row replaces a generated or generic row of the same verb.
const tables = new WeakMap();
function actionsOf(level) {
  let table = tables.get(level);
  if (!table) {
    table = { ...level.interactions };
    const add = (verb, row) => { if (!(verb in table)) table[verb] = row; };
    for (const [type, item] of Object.entries(level.items ?? {})) if (item.edible) add(`eat_${type}`, eatRow(type, item));
    // An item with `keep` never leaves your hand but by a put: no drop row for it.
    const kept = Object.entries(level.items ?? {}).filter(([, item]) => item.keep).map(([type]) => type);
    const drop = kept.length ? { ...GENERIC.drop, can: (p) => !!p.held && !kept.includes(p.held) } : GENERIC.drop;
    for (const [verb, row] of Object.entries(GENERIC)) add(verb, verb === 'drop' ? drop : row);
    tables.set(level, table);
  }
  return table;
}

// The row for a verb in the current level, or null.
export function actionRow(game, verb) {
  return actionsOf(game.level)[verb] ?? null;
}

// A level's rows grouped by target, each list in table order (built once per level: findFocus runs every tick).
const byTarget = new WeakMap();
function rowsFor(level, target) {
  let groups = byTarget.get(level);
  if (!groups) {
    groups = new Map();
    for (const [verb, row] of Object.entries(actionsOf(level))) {
      if (!groups.has(row.on)) groups.set(row.on, []);
      groups.get(row.on).push([verb, row]);
    }
    byTarget.set(level, groups);
  }
  return groups.get(target) ?? NONE;
}
const NONE = [];

// The action a target offers right now, or null. target: an interactable type, 'self', or 'item' (with the item).
function targetAction(game, target, item = null) {
  for (const [verb, row] of rowsFor(game.level, target)) {
    if (row.can(game.player, game.world, item)) return verb;
  }
  return null;
}

function findFocus(game) {
  const p = game.player;
  let best = null;
  let bestD = Infinity;
  for (const it of game.map.interactables) {
    const d = Math.hypot(it.cx - p.x, it.cy - p.y);
    if (!(d <= INTERACT_RADIUS && d < bestD)) continue; // can() is pure, so test reach first
    const verb = targetAction(game, it.type);
    if (verb) {
      bestD = d;
      best = { kind: 'interactable', id: it.id, x: it.cx, y: it.cy, icon: actionRow(game, verb).icon, action: verb };
    }
  }
  for (const item of game.world.items) {
    const d = Math.hypot(item.x - p.x, item.y - p.y);
    if (!(d <= (item.spot ? INTERACT_RADIUS : ITEM_RADIUS) && d < bestD)) continue; // (a spot's: on a desk)
    if (targetAction(game, 'item', item)) {
      bestD = d;
      best = { kind: 'item', id: item.type, x: item.x, y: item.y, icon: actionRow(game, 'pick_up').icon, action: 'pick_up', item };
    }
  }
  best = putFocus(game, bestD, actionRow(game, 'put')) ?? best;
  if (!best) {
    const verb = targetAction(game, 'self');
    if (verb) best = { kind: 'self', id: 'self', x: p.x, y: p.y, icon: actionRow(game, verb).icon, action: verb };
  }
  return best;
}

export function updateInteractions(game, dt) {
  const p = game.player;
  const input = inputOf(game);

  if (playerLocked(game)) {
    if (p.action) cancelAction(game, game.caught ? 'caught' : 'locked');
    p.focus = null;
    return;
  }

  if (p.action) {
    input.pressed('interact'); // swallow presses during an action (no accidental chaining)
    const ax = input.axis();
    if (ax.x || ax.y) cancelAction(game, 'moved');
    else if (!stillValid(game, p.action)) cancelAction(game, 'invalid');
    else {
      p.action.t += dt;
      if (p.action.t >= p.action.duration) completeAction(game);
    }
    if (p.action) return; // focus stays frozen on the action's target
  }

  p.focus = findFocus(game);
  if (p.focus && input.pressed('interact')) startAction(game, p.focus);
}

function startAction(game, focus) {
  const p = game.player;
  const verb = focus.action;
  const row = actionRow(game, verb);
  if (focus.kind !== 'self') p.dir = Math.atan2(focus.y - p.y, focus.x - p.x);

  // A target can make its row a timed action of its own: { duration, sneaky, owner, saw } (putting down an item
  // with `put`: mechanics/putdown.js).
  const timed = focus.timed ?? null;
  if (row.instant && !timed) {
    row.done(game, focus);
    actionNoise(game, row, focus.x, focus.y); // the row's noise, if it makes one
    p.focus = findFocus(game);
    return;
  }

  // The action replaces the busy pose for its duration.
  setBusy(game, false, null);
  game.clock.ff = false;
  const r = timed ?? row;
  p.action = {
    type: verb,
    targetId: focus.id,
    t: 0,
    duration: r.duration,
    sneaky: !!r.sneaky,
    owner: r.owner ?? null,
    idle: !!r.idle,
    saw: r.saw ?? null, // what a late tattle points at (rules.js)
    x: focus.x,
    y: focus.y,
    item: focus.item ?? null,
  };
  game.events.emit('action:start', { type: verb, targetId: focus.id });
}

function stillValid(game, a) {
  const row = actionRow(game, a.type);
  return row ? row.can(game.player, game.world, a.item) : true;
}

function completeAction(game) {
  const p = game.player;
  const a = p.action;
  p.action = null;
  game.events.emit('action:done', { type: a.type, targetId: a.targetId });
  const row = actionRow(game, a.type);
  row?.done?.(game, a);
  actionNoise(game, row, a.x, a.y); // the row's noise, if it makes one (sim/mechanics/attention.js)
}

function pickUp(game, a) {
  const p = game.player;
  const w = game.world;
  const item = a.item;
  w.items = w.items.filter((i) => i !== item);
  p.held = item.type;
  const place = game.level.items?.[item.type]?.place;
  if (place) w[place] = 'player';
  game.events.emit('item:pickup', { type: item.type });
}

// --- Shared helpers (also used by rules.js / scenario.js) -------------------------

export function cancelAction(game, reason) {
  const a = game.player.action;
  if (!a) return;
  game.player.action = null;
  game.events.emit('action:cancel', { type: a.type, targetId: a.targetId, reason });
}

// Drop whatever the player holds at their feet as a floor item.
export function dropHeld(game) {
  const p = game.player;
  const w = game.world;
  const type = p.held;
  if (!type) return;
  w.items.push({ type, x: p.x, y: p.y });
  const place = game.level.items?.[type]?.place;
  if (place) w[place] = 'dropped';
  p.held = null;
  game.events.emit('item:drop', { type });
}
