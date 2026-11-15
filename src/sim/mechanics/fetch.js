// Fetch: whoever sees a certain item lying loose on the floor walks over and picks it up. Discreet Packaging: anyone who
// spots the pink parcel where you dropped it goes and gets it, reads the label, and that's you found out.
//
// Level data (level.fetches, a list, checked every step after the other mechanics):
//   item      the item type (level.items) it is about. Loose: in world.items and not on a spot (putdown.js)
//   npcs      the cast ids who go for it
//   override  his override on the way (plan key `${plan}#${seq}`, debug label `label`)
//   plan, label
//   react     { wait, says?, event? }: on spotting it he stands `wait` s, then walks over. Event payload { by }
//   found     { says?, event?, set? } on picking it up: npc.carry = the item (world[place] = his id when the item
//             has a `place`), then the world fields `set`, his bubbles, the event (payload { by, type })
//   caught    s after he picked it up, the office rules catch the player (play/rules.js caught, by him). Absent:
//             he just keeps it and goes back to his day
//   reason    the caught reason (default 'found')
//   alert     icons the catcher says as he catches you (an alert bubble), instead of the rules' ❗👉 and your
//             face, e.g. ['#parcel', '👉', '@player']: what he found, and whose it is
// Owned items (items[type].owner) get a fetch of their own (entries): the owner who sees his thing on the floor
// (while his `when` holds) walks over and picks it up: his owner.reclaim if he has one, else he carries it. Event
// item:reclaimed { by, type }. A level fetch naming the same item and npc replaces it.
// He goes for it while on the floor (active, not gone) with no override but the meeting's: a lure's job comes
// first. He sees it with his own eyes or on a screen he watches (perception.js npcSees). If it is gone when he
// gets there (the player took it back, someone else was quicker) he gives up (endOverride).
// npc._fetch: { t } once he holds it (t: the loopTime he picked it up), the clock for `caught`. A level hook that
// hands him the item another way (an owner's reclaim) may set it too, to start the same clock.
import { npcSees } from '../../game/perception.js';
import { setOverride, endOverride, holdFor, speak } from '../override.js';

export const keepsThroughMeeting = true; // the gather doesn't stop him picking it up

// The level's fetches, plus one per owned item the level does not fetch itself.
export function entries(level) {
  const list = [...(level.fetches ?? [])];
  for (const [type, flags] of Object.entries(level.items ?? {})) {
    const id = flags?.owner?.id;
    if (!id || id === 'player' || list.some((f) => f.item === type && f.npcs.includes(id))) continue;
    list.push({ item: type, npcs: [id], override: 'picking_up', plan: `pickup_${type}`, label: `picking up his ${type}`, when: flags.owner.when, reclaim: flags.owner.reclaim, found: { event: 'item:reclaimed' } });
  }
  return list;
}

export const owns = (f, npc) => npc.override === f.override && f.npcs.includes(npc.id);

// The loose item of type `type` on the floor, or undefined.
function loose(w, type) {
  for (const it of w.items) if (it.type === type && !it.spot) return it;
  return undefined;
}

export function check(game, npc, f) {
  if (!npc.active || npc._gone || npc._fetch || owns(f, npc)) return;
  if (npc.override && npc.override !== game.level.meeting.override) return; // busy with something else
  const it = loose(game.world, f.item);
  if (!it || (f.when && !f.when(npc)) || !npcSees(game, npc, it.x, it.y)) return;
  setOverride(npc, f.override);
  holdFor(npc, f.react?.wait ?? 0);
  speak(game, npc, f.react?.says);
  if (f.react?.event) game.events.emit(f.react.event, { by: npc.id });
}

export const key = (f, npc) => `${f.plan}#${npc._ovSeq}`;

export function build(game, npc, plan, f) {
  const it = loose(game.world, f.item);
  plan.label = f.label;
  if (!it) return; // gone already: tick ends the override
  plan.legs.push({ x: Math.floor(it.x), y: Math.floor(it.y), arrive: (g, n) => arrive(g, n, f) });
}

function arrive(game, npc, f) {
  const w = game.world;
  const it = loose(w, f.item);
  if (!it) return endOverride(npc);
  w.items = w.items.filter((i) => i !== it);
  if (f.reclaim) f.reclaim(game, npc); // an owner's own way of taking it back (items[type].owner.reclaim)
  else {
    npc.carry = f.item;
    const place = game.level.items?.[f.item]?.place;
    if (place) w[place] = npc.id;
  }
  npc._fetch = { t: game.loopTime };
  if (f.found?.set) Object.assign(w, f.found.set);
  speak(game, npc, f.found?.says);
  if (f.found?.event) game.events.emit(f.found.event, { by: npc.id, type: f.item });
  if (f.caught === undefined) endOverride(npc);
  else holdFor(npc, f.caught + 1); // he stands there with it until the rules catch the player
}

// On his way and the item is gone (picked up by someone else, or by the player): he gives up.
export function tick(game, npc, dt, f) {
  if (!npc._fetch && !loose(game.world, f.item)) endOverride(npc);
}

// The office rules (play/rules.js) ask every step: someone has held a found item long enough.
export function judge(game, rules) {
  for (const f of game.level.fetches ?? []) {
    if (f.caught === undefined) continue;
    for (const npc of game.npcs) {
      if (!npc._fetch || !f.npcs.includes(npc.id)) continue;
      if (game.loopTime - npc._fetch.t < f.caught - 1e-9) continue;
      rules.caught(game, f.reason ?? 'found', npc.id, f.alert);
      return true;
    }
  }
  return false;
}
