// Disguise: an item worn as someone else changes who the player is to the people watching. The office rules
// (rules.js) ask it who each NPC thinks the player is.
//
// While the player holds an item with a `disguise` flag (level.items[type].disguise), she is its `as` cast member
// to every NPC that doesn't know better. A fooled NPC objects to nothing (no sneaky action, scene, evidence or
// contraband, and the authority's suspicion doesn't fill), and says its `greet` line the first time it sees her.
// An NPC knows better if it is the `as` NPC himself, if it saw him walk out for the day (a schedule 'leave' entry,
// its preludes included: sim/npcs.js leaving), or if it saw her put the item on or take it off. A knowing NPC
// who sees her in it does a double take, [the as NPC's icon, ❓], and after DOUBLE_TAKE seconds of sight objects
// with the 'disguise' offence (rules.js react: a witness shouts and points ❗👉, the authority catches her). Each
// NPC objects once; after that it sees her as herself and the other rules apply.
//
// Item data: disguise: { as, look?, greet? }
//   as     cast id: who she passes for
//   look   look fields drawn over the player's look while she wears it (render/characters.js); the item isn't
//          drawn in her hand
//   greet  lines a fooled NPC says on first sight, once per loop: [{ say, kind?, ttl?, after? }]
// Events (only in a level with a disguise item): disguise:knows { by, as, how: 'left' | 'saw' } when an NPC learns
// better; disguise:fooled { by, as } on a fooled NPC's first sight of her.
// State: NPC fields _knowsAs (as id -> true) and _greeted / _unmasked (once per loop); game.rules.worn (the disguise
// item type she wore last step, so putting it on or taking it off is seen).
import { DOUBLE_TAKE } from '../config.js';
import { npcSees, findNpc } from '../game/perception.js';
import { leaving } from '../sim/npcs.js';
import { speak } from '../sim/override.js';

export { DOUBLE_TAKE }; // config.js: seconds of sight before a knowing NPC objects (rules.js uses it for 'disguise')

// The cast ids the level's disguise items pass for (cached per level: the rules ask every step).
const asCache = new WeakMap();
function disguiseIds(level) {
  let ids = asCache.get(level);
  if (!ids) {
    ids = [...new Set(Object.values(level.items ?? {}).map((it) => it.disguise?.as).filter(Boolean))];
    asCache.set(level, ids);
  }
  return ids;
}

// The disguise the player wears right now, or null.
export function wornDisguise(game) {
  const held = game.player.held;
  return held ? game.level.items?.[held]?.disguise ?? null : null;
}

function knows(npc, as) {
  return npc.id === as || !!npc._knowsAs?.[as];
}

function learn(game, npc, as, how) {
  if (knows(npc, as)) return;
  (npc._knowsAs ??= {})[as] = true;
  game.events.emit('disguise:knows', { by: npc.id, as, how });
}

// Who this NPC takes the player for: 'fooled' (the disguise works on him), 'unmask' (he knows better and hasn't
// objected yet: the 'disguise' offence), or null (no disguise, or he already objected: she is herself).
export function disguiseView(game, npc) {
  const d = wornDisguise(game);
  if (!d) return null;
  if (!knows(npc, d.as)) return 'fooled';
  return npc._unmasked ? null : 'unmask';
}

// The double take, before the offence: the face of the NPC she passes for, then ❓.
export function doubleTakeIcons(game) {
  const as = wornDisguise(game)?.as;
  return [findNpc(game, as) ? `@${as}` : '❓', '❓'];
}

// The NPC objected (rules.js react): from now on he sees her as herself.
export function unmasked(npc) {
  npc._unmasked = true;
}

// Every step of the day, before the witnesses (rules.js): who learns better, and who is fooled for the first time.
export function updateDisguise(game) {
  const ids = disguiseIds(game.level);
  if (!ids.length) return; // no disguise in this level: nothing to track
  const p = game.player;

  // Whoever sees him walk out for the day knows he's gone.
  for (const as of ids) {
    const real = findNpc(game, as);
    if (!real || !leaving(real)) continue;
    for (const npc of game.npcs) if (npc !== real && npcSees(game, npc, real.x, real.y)) learn(game, npc, as, 'left');
  }

  // Whoever sees her put it on or take it off knows it's her.
  const worn = wornDisguise(game) ? p.held : null;
  const s = game.rules;
  if (worn !== (s.worn ?? null)) {
    const as = game.level.items[worn ?? s.worn].disguise.as;
    for (const npc of game.npcs) if (npcSees(game, npc, p.x, p.y)) learn(game, npc, as, 'saw');
    s.worn = worn;
  }

  // A fooled NPC's first sight of her: his greeting, once per loop.
  if (!worn) return;
  const d = game.level.items[worn].disguise;
  for (const npc of game.npcs) {
    if (npc._greeted || knows(npc, d.as) || !npcSees(game, npc, p.x, p.y)) continue;
    npc._greeted = true;
    speak(game, npc, d.greet);
    game.events.emit('disguise:fooled', { by: npc.id, as: d.as });
  }
}
