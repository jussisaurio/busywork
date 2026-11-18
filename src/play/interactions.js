// Interactions: picks player.focus (the ✋ hint target), runs the timed actions and applies their results.
// Runs right after updatePlayer.
//
// The actions are the level's rows (level.interactions, keyed by verb; see levels/meeting/interactions.js for the
// row fields), one per edible item, the generic ones every level has, and the level's press toys
// (sim/mechanics/toy.js):
//   holding an edible item                       -> eat_<type> (a hold row; sneaky to its owner; leaves its mark)
//   own_desk (not seated)                        -> sit (instant)
//   holding anything                             -> drop (instant; not an item with `keep`)
//   empty hands, dropped item within ITEM_RADIUS -> pick_up (an item on a spot: within INTERACT_RADIUS)
//   holding what a free spot takes               -> put (instant, or timed for an item with `put`; putdown.js)
//
// The hand rule (Jussi, 2026-11-18). Every action says, as data, what it needs in your hand (`hand`), apart from
// its other conditions (a row's can, a toy's when):
//   omitted          nothing: it works whatever you hold, and does not use it
//   'empty'          empty hands
//   'any'            something in hand, which it uses (drop, put)
//   '<type>' | [..]  that item in hand, which it uses
// On one target, an action that uses the item in your hand wins (one for that very item before one for any item);
// otherwise an action that needs no held item. Two actions still left on one target in the same rank: the one
// that names the other in its `over` wins. Order in a table never decides: src/levels/validate.js refuses a level
// where two actions could be left on one target in one hand state and neither is `over` the other.
// A target is an interactable (the rows `on` its type, and the press toys on its tile), a press toy's prop on a
// tile of its own, a floor item, a put spot, or yourself ('self'). The nearest target with an action wins; 'self'
// only when no other is in reach. Of the 'self' rows, a tap does the one without `hold` and holding E for HOLD_TIME
// the one with it (eating), so eating never takes the drop key; with no tap row (an item with `keep`) a tap eats.
// Every 'self' row names a `preview`: the arm pose (render/characters.js ARM_POSES) the player strikes while it
// is what E would do, and while doing it.
import { INTERACT_RADIUS, PICK_UP_TIME, EAT_TIME, HOLD_TIME } from '../config.js';
import { say, burst } from '../core/fx.js';
import { inputOf, playerLocked, setBusy, sitAtDesk } from './player.js';
import { actionNoise } from '../sim/mechanics/attention.js';
import { PUT_ROW, putFocus } from '../sim/mechanics/putdown.js';
import { pressToy, toyPos } from '../sim/mechanics/toy.js';
import { playerHolds, playerLetsGo } from '../sim/take.js';

const ITEM_RADIUS = 1.0; // pick-up reach for floor items
const TIE = 0.25; // tiles: two targets this close in distance are about as near (findFocus)

// Generic rows. instant: done at once, no timed action (and so never witnessed in progress).
const GENERIC = {
  sit: { on: 'own_desk', icon: '🪑', text: 'sit down', instant: true, can: (p) => !p.seated, done: sitAtDesk },
  // the harness names what is dropped; preview: the arm held out over the floor
  drop: { on: 'self', hand: 'any', icon: '⬇️', text: null, instant: true, preview: 'holdout', done: dropHeld },
  pick_up: {
    on: 'item', hand: 'empty', icon: '✋', text: 'pick it up', duration: PICK_UP_TIME, sneaky: false,
    can: (p, w, item) => w.items.includes(item),
    done: pickUp,
  },
  put: PUT_ROW, // holding what a free spot in reach takes (mechanics/putdown.js; instant)
};

// Eating an edible item you hold (hold E): the boss reads it as slacking, its owner (if any) as theft, and what
// it leaves on you (edible.leaves, a config.js MARKS name, or null) stays for the loop as player.smeared. Its face
// (edible.icon, default 😋) and its burst (edible.burst, default 'crumbs') say what kind of thing went down.
// preview: the item lifted toward the mouth.
function eatRow(type, item) {
  const owner = item.owner?.id ?? null;
  const leaves = item.edible?.leaves ?? null;
  const face = item.edible?.icon ?? '😋'; // a letter isn't tasty: the level says what eating it looks like
  return {
    on: 'self', icon: face, text: `eat the ${type}`, duration: EAT_TIME, sneaky: !!owner, owner, idle: true, saw: item.icon,
    hold: true, preview: 'lift', hand: type,
    done(game) {
      const p = game.player;
      playerLetsGo(game, 'eaten');
      if (leaves) p.smeared = leaves; // the evidence is now on you
      burst(game, item.edible?.burst ?? 'crumbs', p.x, p.y, 12, { speed: 1.0, ttl: 0.7 });
      say(game, 'player', [face], { kind: 'thought', ttl: 1.5 });
      game.events.emit(`${type}:eaten`, {});
    },
  };
}

// --- The hand rule -------------------------------------------------------------------------------------------
const ITEM = 0; // uses that very item
const ANY = 1; // uses whatever is in hand
const FREE = 2; // needs no held item
// An action's rank for what is in hand (held: an item type or null), or null when the hand rules it out.
export function handRank(hand, held) {
  if (hand === undefined) return FREE;
  if (hand === 'empty') return held ? null : FREE;
  if (!held) return null;
  if (hand === 'any') return ANY;
  return (Array.isArray(hand) ? hand.includes(held) : hand === held) ? ITEM : null;
}

// The action for one target: of its entries ({ verb, hand, over, test }), the one the hand rule picks, or null.
// thing: what test() is asked about (the interactable, floor item or spot; null for 'self').
const left = [];
function pick(game, entries, thing) {
  const held = game.player.held;
  let rank = 3;
  left.length = 0;
  for (const e of entries) {
    const r = handRank(e.hand, held);
    if (r === null || r > rank || !e.test(game, thing)) continue;
    if (r < rank) { rank = r; left.length = 0; }
    left.push(e);
  }
  if (left.length < 2) return left[0] ?? null;
  return left.find((e) => !left.some((o) => o !== e && o.over?.includes(e.verb))) ?? left[0];
}

// An entry for a row, or for a press toy (verb: its id; toy: the toy).
const rowEntry = (verb, row) => ({
  verb, row, hand: row.hand, over: row.over ?? null,
  test: row.can ? (game, thing) => row.can(game.player, game.world, thing) : () => true,
});
const toyEntry = (toy) => ({
  verb: toy.id, toy, hand: toy.hand, over: toy.over ?? null,
  test: toy.when ? (game) => toy.when(game.world, game.toys.byId[toy.id].state, game, game.player) : () => true,
});

// A level's action table: its own rows first, then an eat row per edible item, then the generic rows. A level row
// replaces a generated or generic row of the same verb.
const tables = new WeakMap();
function actionsOf(level) {
  let table = tables.get(level);
  if (!table) {
    table = { ...level.interactions };
    const add = (verb, row) => { if (!(verb in table)) table[verb] = row; };
    for (const [type, item] of Object.entries(level.items ?? {})) if (item.edible) add(`eat_${type}`, eatRow(type, item));
    // An item with `keep` never leaves your hand but by a put: drop takes the others.
    const types = Object.entries(level.items ?? {});
    const drop = types.some(([, item]) => item.keep)
      ? { ...GENERIC.drop, hand: types.filter(([, item]) => !item.keep).map(([type]) => type) } : GENERIC.drop;
    for (const [verb, row] of Object.entries(GENERIC)) add(verb, verb === 'drop' ? drop : row);
    tables.set(level, table);
  }
  return table;
}

// Whether a row could be done now, as far as the row alone says (its hand and its can; not the hand rule's choice
// between rows). thing: as for can.
export function rowApplies(game, row, thing = null) {
  return handRank(row.hand, game.player.held) !== null && (!row.can || row.can(game.player, game.world, thing));
}

// The row for a verb in the current level, or null.
export function actionRow(game, verb) {
  return actionsOf(game.level)[verb] ?? null;
}

// Every target's actions, as hand-rule entries. Built once per level (findFocus runs every tick):
//   on       interactable id -> entries: the rows on its type, then the press toys on its tile
//   props    press toys on a tile with no interactable: [{ x, y, entries }], one per tile
//   item, put, tap, hold   the floor item's, the put spot's, and the 'self' rows (a tap's and a held E's)
// Also used by validate.js (actionTargets), with the level's parsed map.
export function actionTargets(level, interactables) {
  const byType = new Map();
  const add = (key, e) => { if (!byType.has(key)) byType.set(key, []); byType.get(key).push(e); };
  for (const [verb, row] of Object.entries(actionsOf(level))) for (const on of [row.on].flat()) add(on, rowEntry(verb, row));
  const tileOf = (x, y) => `${Math.floor(x)},${Math.floor(y)}`;
  const toysAt = new Map();
  for (const toy of level.toys ?? []) {
    if (toy.on !== 'press') continue;
    const at = toyPos(level, toy);
    const k = tileOf(at.x, at.y);
    if (!toysAt.has(k)) toysAt.set(k, { x: at.x, y: at.y, entries: [] });
    toysAt.get(k).entries.push(toyEntry(toy));
  }
  const on = new Map();
  for (const it of interactables) {
    const k = tileOf(it.cx, it.cy);
    on.set(it.id, [...(byType.get(it.type) ?? NONE), ...(toysAt.get(k)?.entries ?? NONE)]);
    toysAt.delete(k);
  }
  const self = byType.get('self') ?? NONE;
  return {
    on, props: [...toysAt.values()], item: byType.get('item') ?? NONE, put: actionsOf(level).put ?? null,
    tap: self.filter((e) => !e.row.hold), hold: self.filter((e) => e.row.hold),
  };
}
const NONE = [];

// Where order would decide: on each target, in each hand state (empty, or each item type), the pairs of actions
// whose hand puts them in one rank with neither `over` the other. can/when are not run (they read the day), so a
// pair is listed if both could ever be left. validate.js refuses a level with any.
// -> ['<target>: a / b (<hand states>)']
export function handConflicts(level, interactables) {
  const t = actionTargets(level, interactables);
  const groups = [...t.on, ...t.props.map((pr) => [`the toys at ${Math.floor(pr.x)},${Math.floor(pr.y)}`, pr.entries]),
    ['a floor item', t.item], ['self (tap)', t.tap], ['self (hold E)', t.hold]];
  const pairs = new Map();
  for (const held of [null, ...Object.keys(level.items ?? {})]) {
    for (const [where, es] of groups) {
      for (let i = 0; i < es.length; i++) for (let j = i + 1; j < es.length; j++) {
        const a = es[i], b = es[j], r = handRank(a.hand, held);
        if (r === null || r !== handRank(b.hand, held) || a.over?.includes(b.verb) || b.over?.includes(a.verb)) continue;
        const k = `${where}: ${a.verb} / ${b.verb}`;
        if (!pairs.has(k)) pairs.set(k, []);
        pairs.get(k).push(held ?? 'empty');
      }
    }
  }
  return [...pairs].map(([k, hands]) => `${k} (holding ${hands.join(', ')})`);
}
const built = new WeakMap();
function targetsOf(game) {
  let t = built.get(game.level);
  if (!t) built.set(game.level, (t = actionTargets(game.level, game.map.interactables)));
  return t;
}

function findFocus(game) {
  const p = game.player;
  const t = targetsOf(game);
  let best = null;
  let bestD = Infinity;
  const inReach = (x, y, r) => {
    // Out of reach along either axis is out of reach (the distance is never less), and far cheaper to test.
    if (Math.abs(x - p.x) > r || Math.abs(y - p.y) > r) return false;
    const d = Math.hypot(x - p.x, y - p.y);
    if (!(d <= r && d < bestD + TIE)) return false; // test() is pure, so test reach first
    return d;
  };
  // Nearer wins. Two about as near (within TIE: a tile either side of you), a row before a toy: a toy decides
  // nothing, so it never shadows a row it all but touches (the spare desk's keyboard by the exit).
  let bestToy = false;
  const take = (d, toy) => {
    const tie = Math.abs(d - bestD) <= TIE;
    if (tie ? (toy === bestToy ? d >= bestD : toy) : d > bestD) return false;
    bestD = d;
    bestToy = toy;
    return true;
  };
  for (const it of game.map.interactables) {
    const d = inReach(it.cx, it.cy, INTERACT_RADIUS);
    const e = d !== false && pick(game, t.on.get(it.id), it);
    if (!e || !take(d, !!e.toy)) continue;
    best = e.toy ? toyFocusOf(e.toy, it.cx, it.cy)
      : { kind: 'interactable', id: it.id, x: it.cx, y: it.cy, icon: e.row.icon, action: e.verb, item: it };
  }
  for (const prop of t.props) {
    const d = inReach(prop.x, prop.y, INTERACT_RADIUS);
    const e = d !== false && pick(game, prop.entries, null);
    if (!e || !take(d, true)) continue;
    best = toyFocusOf(e.toy, prop.x, prop.y);
  }
  for (const item of game.world.items) {
    const d = inReach(item.x, item.y, item.spot ? INTERACT_RADIUS : ITEM_RADIUS); // (a spot's: on a desk)
    const e = d !== false && pick(game, t.item, item);
    if (!e || !take(d, false)) continue;
    best = { kind: 'item', id: item.type, x: item.x, y: item.y, icon: e.row.icon, action: e.verb, item };
  }
  if (t.put && handRank(t.put.hand, p.held) !== null) best = putFocus(game, bestD, t.put) ?? best;
  return best ?? selfFocus(game, t);
}

// A press toy as the focus: E fires it (pressToy), no timed action.
const toyFocusOf = (toy, x, y) => ({ kind: 'interactable', id: toy.id, x, y, toy: true, action: null });

// What E does to you and what you hold, when nothing else is in reach: action, the tap's row; hold, the row
// holding E does instead (null: none, or the tap is it). preview / holdPreview: their arm poses (the renderer).
function selfFocus(game, t) {
  const p = game.player;
  let tap = pick(game, t.tap, null);
  let hold = pick(game, t.hold, null);
  if (!tap) [tap, hold] = [hold, null];
  if (!tap) return null;
  return {
    kind: 'self', id: 'self', x: p.x, y: p.y, icon: tap.row.icon, action: tap.verb, preview: tap.row.preview ?? null,
    hold: hold?.verb ?? null, holdPreview: hold?.row.preview ?? null,
  };
}

export function updateInteractions(game, dt) {
  const p = game.player;
  const input = inputOf(game);

  if (playerLocked(game)) {
    if (p.action) cancelAction(game, game.caught ? 'caught' : 'locked');
    p.focus = null;
    p.hold = null;
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
  const f = p.focus;
  if (f?.toy && !p.hold && input.pressed('interact')) {
    pressToy(game, f);
    return;
  }
  if (p.hold) {
    // E is down on a target with two verbs: let go for the tap's, keep holding (standing still) for the other.
    input.pressed('interact');
    if (!f || f.hold !== p.hold.verb) p.hold = null; // the target changed under the key: nothing
    else if (!input.isDown('interact')) {
      p.hold = null;
      startAction(game, f);
    } else {
      const ax = input.axis();
      p.hold.t = ax.x || ax.y ? 0 : p.hold.t + dt;
      if (p.hold.t >= HOLD_TIME) {
        p.hold = null;
        startAction(game, { ...f, action: f.hold });
      }
    }
    return;
  }
  if (f && input.pressed('interact')) {
    if (f.hold && input.isDown('interact')) p.hold = { verb: f.hold, t: 0 }; // tap or hold: decided on release
    else startAction(game, f);
  }
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
    // an action on yourself shows its preview pose; a row's own pose (and held: the glyph in that hand) shows how
    // the player does it ('phone' and a receiver: on the line)
    pose: focus.kind === 'self' ? row.preview ?? null : r.pose ?? null,
    held: r.held ?? null,
  };
  game.events.emit('action:start', { type: verb, targetId: focus.id });
}

function stillValid(game, a) {
  const row = actionRow(game, a.type);
  return row ? rowApplies(game, row, a.item) : true;
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
  const w = game.world;
  const item = a.item;
  w.items = w.items.filter((i) => i !== item);
  playerHolds(game, item.type);
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
  playerLetsGo(game, 'dropped');
  game.events.emit('item:drop', { type });
}
