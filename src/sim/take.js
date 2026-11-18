// Taking things: who holds an item, and where the level's `place` field says it is. Every path that moves an item
// into or out of a hand goes through here, so the same act does the same thing wherever it happens.
//
// The place field (items[type].place, optional): the world field that says where the item is. 'player' in your
// hand, 'dropped' on the floor, 'eaten', a spot name on a spot, or a cast id with him. An item without a `place`
// keeps no such field (a level may keep its own state instead).
//
// The NPC takes:
//   npcTakes   the plain take: he picks it up as part of his day (off his own desk, a free cup, what he finds on his
//              spot). He carries it; it is no longer what he wants; place = his id.
//   takesBack  its owner or its confiscator takes his thing back (from your hand, your desk, the floor, when he
//              shows you out). The owner's `reclaim` hook, if he has one, is what taking it back does, instead of
//              all of the below. Else the confiscator pockets it (place = his id, nothing in his hand) and the
//              owner carries it (as npcTakes). Event `<type>:recovered { by, type, from }`, from: 'player' (your
//              hand), a spot name (it lay there), 'floor'.
//   npcPockets into his pocket, nothing in his hand (place = his id). takesBack's confiscator, and a level's own
//              beat that pockets a thing with events of its own (meeting: the boss snatching his keycard back).
// Each takes it from where it is: `it`, a world item (removed from world.items), else your hand.

// world[place] = where, if the item keeps a place.
export function setPlace(game, type, where) {
  const place = game.level.items?.[type]?.place;
  if (place) game.world[place] = where;
}

// The player now holds `type` (picked up, taken off a stand).
export function playerHolds(game, type) {
  game.player.held = type;
  setPlace(game, type, 'player');
}

// What the player holds leaves her hand for `where` ('dropped', 'eaten', a spot name, a level's own word).
// Returns the type, or null if she held nothing.
export function playerLetsGo(game, where) {
  const p = game.player;
  const type = p.held;
  if (!type) return null;
  p.held = null;
  setPlace(game, type, where);
  return type;
}

// Out of where it is: the world item `it`, else your hand (if it's in it).
function lift(game, type, it) {
  if (it) game.world.items = game.world.items.filter((i) => i !== it);
  else if (game.player.held === type) game.player.held = null;
}

export function npcTakes(game, npc, type, it = null) {
  lift(game, type, it);
  npc.carry = type;
  if (npc.wants === type) npc.wants = null;
  setPlace(game, type, npc.id);
}

export function npcPockets(game, npc, type, it = null) {
  lift(game, type, it);
  setPlace(game, type, npc.id);
}

export function takesBack(game, npc, type, it = null) {
  const flags = game.level.items?.[type];
  const from = it ? it.spot ?? 'floor' : 'player';
  if (flags?.owner?.id === npc.id && flags.owner.reclaim) {
    lift(game, type, it);
    flags.owner.reclaim(game, npc);
    return;
  }
  if (flags?.contraband === npc.id) npcPockets(game, npc, type, it);
  else npcTakes(game, npc, type, it);
  game.events.emit(`${type}:recovered`, { by: npc.id, type, from });
}
