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
// Contraband (items[type].contraband, with a place) gets one too: its confiscator, on duty (not in one of the
// authority's offDuty overrides), who sees it on the floor does a double take (the item, ❗: a realize bubble, turned
// to it), walks over, picks it up and holds it a beat (npc.pocketing: render bends him over it, the item in his
// hands), pockets it with a face (the item's `pockets` lines, default a huff) and goes back to his day.
// world[place] = his id from the pick-up; event `<type>:recovered { by, type }`. Snatched from under his nose on
// the way, he stops dead: the item, ❓, and a look round (`missed`). If he watched you take it, the office rules
// see it in your hand as usual. Drop it again later and he goes for it again.
// Optional fields for any fetch: react.face (turn to it on spotting), pocket { hold } (the beat with it in his
// hands before he goes back to his day; npc.pocketing meanwhile), missed { says } (on finding it gone: he stops,
// says it, looks round), again (he may fetch it again once he's back to his day).
// He goes for it while on the floor (active, not gone) with no override but the meeting's: a lure's job comes
// first. He sees it with his own eyes or on a screen he watches (perception.js npcSees). If it is gone when he
// gets there (the player took it back, someone else was quicker) he gives up (endOverride).
// npc._fetch: { t } once he holds it (t: the loopTime he picked it up), the clock for `caught`. A level hook that
// hands him the item another way (an owner's reclaim) may set it too, to start the same clock.
import { npcSees } from '../../game/perception.js';
import { findPath } from '../nav.js';
import { setOverride, endOverride, holdFor, speak } from '../override.js';

// Contraband reclaims (the implicit fetch above).
const SPOT_WAIT = 0.8; // s of double take before he sets off
const POCKET_HOLD = 1.1; // s he holds it up, then pockets it
const MISSED_HOLD = 1.4; // s he stands and looks round when it's gone
const LOOK_ANGLE = 0.9; // rad of the look round
// A face as he pockets it, unless the item says (items[type].pockets): hmph.
const POCKET_SAYS = [{ say: ['😤'], after: 0.45, ttl: 1.0 }];

export const keepsThroughMeeting = true; // the gather doesn't stop him picking it up

// The level's fetches, plus one per owned item the level does not fetch itself.
export function entries(level) {
  const list = [...(level.fetches ?? [])];
  for (const [type, flags] of Object.entries(level.items ?? {})) {
    const id = flags?.owner?.id;
    if (!id || id === 'player' || list.some((f) => f.item === type && f.npcs.includes(id))) continue;
    list.push({ item: type, npcs: [id], override: 'picking_up', plan: `pickup_${type}`, label: `picking up his ${type}`, when: flags.owner.when, reclaim: flags.owner.reclaim, found: { event: 'item:reclaimed' } });
  }
  for (const [type, flags] of Object.entries(level.items ?? {})) {
    const by = flags?.contraband;
    if (!by || !flags.place || list.some((f) => f.item === type && f.npcs.includes(by))) continue;
    list.push({
      item: type,
      npcs: [by],
      override: 'reclaiming',
      plan: `reclaim_${type}`,
      label: `going for his ${type}`,
      when: onDuty,
      pocketed: true, // to his pocket (world[place] = his id), not his hand
      react: { wait: SPOT_WAIT, face: true, says: [{ say: [flags.icon, '❗'], kind: 'realize', ttl: 1.2 }] },
      pocket: { hold: POCKET_HOLD, says: flags.pockets ?? POCKET_SAYS },
      found: { event: `${type}:recovered` },
      missed: { says: [{ say: [flags.icon, '❓'], kind: 'thought', ttl: 1.4 }] },
      again: true,
    });
  }
  return list;
}

// On duty for contraband: not in one of the authority's offDuty overrides (play/rules.js enforcing).
function onDuty(npc, game) {
  const auth = game.level.roles?.authority;
  return !(auth && auth.id === npc.id && (auth.offDuty ?? []).includes(npc.override));
}

// Can he walk to the tile it lies on (findPath, cached per NPC and tile: asked every step he sees it)?
function reachable(game, npc, it) {
  const tile = `${Math.floor(it.x)},${Math.floor(it.y)},${Math.floor(npc.x)},${Math.floor(npc.y)}`;
  if (npc._fetchPath?.tile !== tile) npc._fetchPath = { tile, ok: !!findPath(game.map, npc, it, 'npc') };
  return npc._fetchPath.ok;
}

export const owns = (f, npc) => npc.override === f.override && f.npcs.includes(npc.id);

// The loose item of type `type` on the floor, or undefined.
function loose(w, type) {
  for (const it of w.items) if (it.type === type && !it.spot) return it;
  return undefined;
}

export function check(game, npc, f) {
  if (npc.pocketing?.type === f.item && !owns(f, npc)) { // pulled away mid-beat (a lure): it's in his pocket
    npc.pocketing = null;
    if (f.again) npc._fetch = undefined;
  }
  if (npc._fetchMissed === f.item && !owns(f, npc)) npc._fetchMissed = null;
  if (!npc.active || npc._gone || npc._fetch || owns(f, npc)) return;
  if (npc.override && npc.override !== game.level.meeting.override) return; // busy with something else
  const it = loose(game.world, f.item);
  if (!it || (f.when && !f.when(npc, game)) || !npcSees(game, npc, it.x, it.y)) return;
  if (!reachable(game, npc, it)) return; // he sees it, but there's no way to it
  setOverride(npc, f.override);
  holdFor(npc, f.react?.wait ?? 0);
  if (f.react?.face) npc._faceTarget = Math.atan2(it.y - npc.y, it.x - npc.x);
  speak(game, npc, f.react?.says);
  if (f.react?.event) game.events.emit(f.react.event, { by: npc.id });
}

export const key = (f, npc) => `${f.plan}#${npc._ovSeq}`;

export function build(game, npc, plan, f) {
  const it = loose(game.world, f.item);
  plan.label = f.label;
  if (!it) return; // gone already: tick ends the override
  const leg = { x: Math.floor(it.x), y: Math.floor(it.y) };
  npc._fetchAt = leg;
  plan.legs.push({ ...leg, arrive: (g, n) => arrive(g, n, f) });
}

// The loose item, if it still lies on the tile he is heading for.
function stillThere(game, npc, f) {
  const it = loose(game.world, f.item);
  const at = npc._fetchAt;
  return it && at && Math.floor(it.x) === at.x && Math.floor(it.y) === at.y ? it : undefined;
}

function arrive(game, npc, f) {
  const w = game.world;
  const it = stillThere(game, npc, f);
  if (!it) return f.missed ? missed(game, npc, f) : endOverride(npc);
  w.items = w.items.filter((i) => i !== it);
  const place = game.level.items?.[f.item]?.place;
  if (f.reclaim) f.reclaim(game, npc); // an owner's own way of taking it back (items[type].owner.reclaim)
  else if (f.pocketed) w[place] = npc.id;
  else {
    npc.carry = f.item;
    if (place) w[place] = npc.id;
  }
  npc._fetch = { t: game.loopTime };
  if (f.found?.set) Object.assign(w, f.found.set);
  speak(game, npc, f.found?.says);
  if (f.found?.event) game.events.emit(f.found.event, { by: npc.id, type: f.item });
  if (f.pocket) {
    npc._faceTarget = Math.atan2(it.y - npc.y, it.x - npc.x);
    npc.pocketing = { type: f.item, at: game.loopTime }; // render: bent over it, then holding it up
    speak(game, npc, f.pocket.says);
    holdFor(npc, f.pocket.hold);
  } else if (f.caught === undefined) endOverride(npc);
  else holdFor(npc, f.caught + 1); // he stands there with it until the rules catch the player
}

// Every step of the fetch, before walking. The beat with it in his hands over: back to his day. On his way and the
// item is gone (picked up by someone else, or by the player): without `missed` he gives up at once. With it, he
// gives up when he sees it's gone (he sees the empty spot, or you with it), else on arriving at the empty floor;
// moved somewhere he can see, he heads there instead.
export function tick(game, npc, dt, f) {
  if (npc.pocketing) {
    if (npc._wait > 0) return;
    npc.pocketing = null;
    if (f.again) npc._fetch = undefined;
    return endOverride(npc);
  }
  if (npc._fetch) return;
  if (npc._fetchMissed === f.item) {
    if (npc._wait > 0) return;
    npc._fetchMissed = null;
    return endOverride(npc);
  }
  if (!f.missed) {
    if (!loose(game.world, f.item)) endOverride(npc);
    return;
  }
  if (stillThere(game, npc, f)) return;
  const it = loose(game.world, f.item);
  if (it && npcSees(game, npc, it.x, it.y)) return setOverride(npc, f.override); // moved: a new plan, to where it is now
  const at = npc._fetchAt;
  const p = game.player;
  if ((at && npcSees(game, npc, at.x + 0.5, at.y + 0.5)) || (p.held === f.item && npcSees(game, npc, p.x, p.y))) missed(game, npc, f);
}

// It's gone: he stops dead where he is with his ❓, and looks round, or turns to you if he watched you take it (the
// office rules take it from there, if that's a catch). Then back to his day (tick).
function missed(game, npc, f) {
  npc._fetchMissed = f.item;
  npc._wait = 0;
  holdFor(npc, MISSED_HOLD);
  const p = game.player;
  if (p.held === f.item && npcSees(game, npc, p.x, p.y)) npc._faceTarget = Math.atan2(p.y - npc.y, p.x - npc.x);
  else npc._look = { t: 0, angle: LOOK_ANGLE };
  npc._plan.path = null;
  npc._plan.legs = [];
  npc._plan.li = 0;
  speak(game, npc, f.missed.says);
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
