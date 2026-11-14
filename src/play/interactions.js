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

export const ITEM_RADIUS = 1.0; // pick-up reach for floor items

// Emoji hints for the renderer (player.focus.icon).
export const FOCUS_ICONS = {
  brew_coffee: '☕',
  spill_coffee: '💦',
  take_keycard: '🪪',
  take_sandwich: '🥪',
  sit: '🪑',
  eat_sandwich: '😋',
  drop: '⬇️',
  pick_up: '✋',
};

// The action an interactable offers right now, or null.
function verbFor(game, type) {
  const p = game.player;
  const w = game.world;
  switch (type) {
    case 'coffee_machine':
      return !p.held && w.coffee === 'pot' ? 'brew_coffee' : null;
    case 'projector':
      return p.held === 'coffee' && w.projector === 'ok' ? 'spill_coffee' : null;
    case 'coat_rack':
      return !p.held && w.keycard === 'rack' ? 'take_keycard' : null;
    case 'fridge':
      return !p.held && w.sandwich === 'fridge' ? 'take_sandwich' : null;
    case 'own_desk':
      return !p.seated ? 'sit' : null;
    default:
      return null;
  }
}

export function findFocus(game) {
  const p = game.player;
  let best = null;
  let bestD = Infinity;
  for (const it of game.map.interactables) {
    const verb = verbFor(game, it.type);
    if (!verb) continue;
    const d = Math.hypot(it.cx - p.x, it.cy - p.y);
    if (d <= INTERACT_RADIUS && d < bestD) {
      bestD = d;
      best = { kind: 'interactable', id: it.id, x: it.cx, y: it.cy, icon: FOCUS_ICONS[verb], _action: verb };
    }
  }
  if (!p.held) {
    for (const item of game.world.items) {
      const d = Math.hypot(item.x - p.x, item.y - p.y);
      if (d <= ITEM_RADIUS && d < bestD) {
        bestD = d;
        best = { kind: 'item', id: item.type, x: item.x, y: item.y, icon: FOCUS_ICONS.pick_up, _action: 'pick_up', _item: item };
      }
    }
  }
  if (!best && p.held) {
    const verb = p.held === 'sandwich' ? 'eat_sandwich' : 'drop';
    best = { kind: 'self', id: 'self', x: p.x, y: p.y, icon: FOCUS_ICONS[verb], _action: verb };
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
  const verb = focus._action;
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
    _x: focus.x,
    _y: focus.y,
    _item: focus._item ?? null,
  };
  game.events.emit('action:start', { type: verb, targetId: focus.id });
}

function stillValid(game, a) {
  const p = game.player;
  const w = game.world;
  switch (a.type) {
    case 'brew_coffee':
      return !p.held && game.world.coffee === 'pot'; // Kev may get there first
    case 'spill_coffee':
      return p.held === 'coffee' && w.projector === 'ok';
    case 'take_keycard':
      return !p.held && w.keycard === 'rack'; // the boss may grab his jacket mid-steal
    case 'take_sandwich':
      return !p.held && w.sandwich === 'fridge';
    case 'eat_sandwich':
      return p.held === 'sandwich';
    case 'pick_up':
      return !p.held && w.items.includes(a._item);
    default:
      return true;
  }
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
      burst(game, 'smoke', a._x, a._y, 5, { speed: 0.4, lift: 0.8, ttl: 1.0 }); // steam
      break;
    case 'spill_coffee':
      p.held = null;
      w.projector = 'broken';
      burst(game, 'sparks', a._x, a._y, 16, { speed: 2.5, ttl: 0.6 });
      burst(game, 'smoke', a._x, a._y, 10, { speed: 0.6, lift: 0.9, ttl: 1.6 });
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
      const item = a._item;
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
