// Interactions: picks player.focus (the ✋ hint target), runs timed actions from ACTIONS,
// and applies their results to game.world. Runs right after updatePlayer.
//
// Interaction table (CONTRACTS.md):
//   coffee_machine + empty hands, coffee 'pot'   -> brew_coffee   -> held 'coffee' (the day's only cup)
//   projector + coffee, projector 'ok'           -> spill_coffee  (sneaky) -> projector 'broken'
//   coat_rack + empty hands, keycard 'rack'      -> take_keycard  (sneaky)
//   fridge + empty hands, sandwich 'fridge'      -> take_sandwich (sneaky)
//   own_desk (not seated)                        -> sit (instant)
//   holding sandwich, nothing else valid         -> eat_sandwich  (sneaky)
//   holding coffee/keycard, nothing else valid   -> drop (instant)
//   empty hands, dropped item within ITEM_RADIUS -> pick_up
// The nearest valid target wins; 'self' targets only apply when nothing else is valid.
import { ACTIONS, INTERACT_RADIUS } from '../config.js';
import { say, burst, shake } from '../core/fx.js';
import { inputOf, playerLocked, setBusy, sitAtDesk } from './player.js';

const ITEM_RADIUS = 1.0; // pick-up reach for floor items

// Every player action: the target that offers it (an interactable type, a floor 'item', or 'self' for what
// is in hand), when it is possible, its ✋ hint icon (player.focus.icon) and the harness's words for it.
// findFocus offers an action only while `can` holds, and a timed action is cancelled ('invalid') as soon as
// it stops holding. For 'self', the first possible row wins.
export const TARGET_ACTIONS = {
  brew_coffee: {
    on: 'coffee_machine', icon: '☕', text: 'pour a coffee',
    can: (p, w) => !p.held && w.coffee === 'pot', // Kev may get there first
  },
  spill_coffee: {
    on: 'projector', icon: '💦', text: 'spill coffee on it',
    can: (p, w) => p.held === 'coffee' && w.projector === 'ok',
  },
  take_keycard: {
    on: 'coat_rack', icon: '🪪', text: 'take the keycard from the jacket',
    can: (p, w) => !p.held && w.keycard === 'rack', // the boss may grab his jacket mid-steal
  },
  take_sandwich: {
    on: 'fridge', icon: '🥪', text: 'take the sandwich',
    can: (p, w) => !p.held && w.sandwich === 'fridge',
  },
  sit: {
    on: 'own_desk', icon: '🪑', text: 'sit down',
    can: (p) => !p.seated,
  },
  eat_sandwich: {
    on: 'self', icon: '😋', text: 'eat the sandwich',
    can: (p) => p.held === 'sandwich',
  },
  drop: {
    on: 'self', icon: '⬇️', text: null, // the harness names what is dropped
    can: (p) => !!p.held,
  },
  pick_up: {
    on: 'item', icon: '✋', text: 'pick it up',
    can: (p, w, item) => !p.held && w.items.includes(item),
  },
};
const ROWS = Object.entries(TARGET_ACTIONS);

// The action a target offers right now, or null. target: an interactable type, 'self', or 'item' (with the item).
function targetAction(game, target, item = null) {
  for (const [verb, row] of ROWS) if (row.on === target && row.can(game.player, game.world, item)) return verb;
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
      best = { kind: 'interactable', id: it.id, x: it.cx, y: it.cy, icon: TARGET_ACTIONS[verb].icon, action: verb };
    }
  }
  for (const item of game.world.items) {
    if (!targetAction(game, 'item', item)) continue;
    const d = Math.hypot(item.x - p.x, item.y - p.y);
    if (d <= ITEM_RADIUS && d < bestD) {
      bestD = d;
      best = { kind: 'item', id: item.type, x: item.x, y: item.y, icon: TARGET_ACTIONS.pick_up.icon, action: 'pick_up', item };
    }
  }
  if (!best) {
    const verb = targetAction(game, 'self');
    if (verb) best = { kind: 'self', id: 'self', x: p.x, y: p.y, icon: TARGET_ACTIONS[verb].icon, action: verb };
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
  if (focus.kind !== 'self') p.dir = Math.atan2(focus.y - p.y, focus.x - p.x);

  if (verb === 'sit') {
    sitAtDesk(game);
    p.focus = findFocus(game);
    return;
  }
  if (verb === 'drop') {
    dropHeld(game);
    p.focus = findFocus(game);
    return;
  }

  const def = ACTIONS[verb];
  // The action replaces the busy pose for its duration.
  setBusy(game, false, null);
  game.clock.ff = false;
  p.action = {
    type: verb,
    targetId: focus.id,
    t: 0,
    duration: def.duration,
    sneaky: def.sneaky,
    owner: def.owner ?? null,
    idle: !!def.idle,
    x: focus.x,
    y: focus.y,
    item: focus.item ?? null,
  };
  game.events.emit('action:start', { type: verb, targetId: focus.id });
}

function stillValid(game, a) {
  const row = TARGET_ACTIONS[a.type];
  return row ? row.can(game.player, game.world, a.item) : true;
}

function completeAction(game) {
  const p = game.player;
  const w = game.world;
  const a = p.action;
  p.action = null;
  game.events.emit('action:done', { type: a.type, targetId: a.targetId });

  switch (a.type) {
    case 'brew_coffee':
      p.held = 'coffee';
      w.coffee = 'taken';
      game.events.emit('coffee:taken', { by: 'player' });
      burst(game, 'smoke', a.x, a.y, 5, { speed: 0.4, lift: 0.8, ttl: 1.0 }); // steam
      break;
    case 'spill_coffee':
      p.held = null;
      w.projector = 'broken';
      burst(game, 'sparks', a.x, a.y, 16, { speed: 2.5, ttl: 0.6 });
      burst(game, 'smoke', a.x, a.y, 10, { speed: 0.6, lift: 0.9, ttl: 1.6 });
      shake(game, 0.12, 0.25);
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('projector:broken', {});
      break;
    case 'take_keycard':
      p.held = 'keycard';
      w.keycard = 'player';
      game.events.emit('keycard:taken', {});
      break;
    case 'take_sandwich':
      p.held = 'sandwich';
      w.sandwich = 'player';
      game.events.emit('sandwich:taken', {});
      break;
    case 'eat_sandwich':
      p.held = null;
      p.smeared = true; // the evidence is now on you
      w.sandwich = 'eaten';
      burst(game, 'crumbs', p.x, p.y, 12, { speed: 1.0, ttl: 0.7 });
      say(game, 'player', ['😋'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('sandwich:eaten', {});
      break;
    case 'pick_up': {
      const item = a.item;
      w.items = w.items.filter((i) => i !== item);
      p.held = item.type;
      if (item.type === 'keycard') w.keycard = 'player';
      if (item.type === 'sandwich') w.sandwich = 'player';
      game.events.emit('item:pickup', { type: item.type });
      break;
    }
  }
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
  if (type === 'keycard') w.keycard = 'dropped';
  if (type === 'sandwich') w.sandwich = 'dropped';
  p.held = null;
  game.events.emit('item:drop', { type });
}
