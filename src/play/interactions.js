// Interactions: picks player.focus (the ✋ hint target), runs the timed actions and applies their results.
// Runs right after updatePlayer.
//
// The actions are the level's (level.interactions, keyed by verb; see levels/meeting/interactions.js for the
// row fields), then one per edible item, then the generic ones every level has:
//   holding an edible item                       -> eat_<type> (sneaky to its owner; leaves player.smeared)
//   own_desk (not seated)                        -> sit (instant)
//   holding anything, no level 'self' row valid  -> drop (instant)
//   empty hands, dropped item within ITEM_RADIUS -> pick_up
// The nearest valid target wins; 'self' targets only apply when nothing else is valid.
import { INTERACT_RADIUS, PICK_UP_TIME, EAT_TIME } from '../config.js';
import { say, burst } from '../core/fx.js';
import { inputOf, playerLocked, setBusy, sitAtDesk } from './player.js';

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
};

// Deprecated: every action row seen so far, keyed by verb (the harness reads its hint text from here).
// Use actionRow(game, verb).
export const TARGET_ACTIONS = { ...GENERIC };

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
    for (const [verb, row] of Object.entries(GENERIC)) add(verb, row);
    tables.set(level, table);
    Object.assign(TARGET_ACTIONS, table);
  }
  return table;
}

// The row for a verb in the current level, or null.
export function actionRow(game, verb) {
  return actionsOf(game.level)[verb] ?? null;
}

// The action a target offers right now, or null. target: an interactable type, 'self', or 'item' (with the item).
function targetAction(game, target, item = null) {
  for (const [verb, row] of Object.entries(actionsOf(game.level))) {
    if (row.on === target && row.can(game.player, game.world, item)) return verb;
  }
  return null;
}

function findFocus(game) {
  const p = game.player;
  let best = null;
  let bestD = Infinity;
  for (const it of game.map.interactables) {
    const verb = targetAction(game, it.type);
    if (!verb) continue;
    const d = Math.hypot(it.cx - p.x, it.cy - p.y);
    if (d <= INTERACT_RADIUS && d < bestD) {
      bestD = d;
      best = { kind: 'interactable', id: it.id, x: it.cx, y: it.cy, icon: actionRow(game, verb).icon, action: verb };
    }
  }
  for (const item of game.world.items) {
    if (!targetAction(game, 'item', item)) continue;
    const d = Math.hypot(item.x - p.x, item.y - p.y);
    if (d <= ITEM_RADIUS && d < bestD) {
      bestD = d;
      best = { kind: 'item', id: item.type, x: item.x, y: item.y, icon: actionRow(game, 'pick_up').icon, action: 'pick_up', item };
    }
  }
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

  if (row.instant) {
    row.done(game);
    p.focus = findFocus(game);
    return;
  }

  // The action replaces the busy pose for its duration.
  setBusy(game, false, null);
  game.clock.ff = false;
  p.action = {
    type: verb,
    targetId: focus.id,
    t: 0,
    duration: row.duration,
    sneaky: !!row.sneaky,
    owner: row.owner ?? null,
    idle: !!row.idle,
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
  actionRow(game, a.type)?.done?.(game, a);
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
