// Door: a door listed NPCs must open to come in from a zone. Whoever can't open it is stuck outside it for the
// rest of the day, knocking. Level 1: the boss without his keycard at the glass entrance.
// (Who may walk through which tile is the map's business: the legend's npcPassable. Seeing through it too: opaque.)
//
// Level data (level.doors, a list; their preludes run in this order):
//   spot      where you stand to open it (facing it: spot.face)
//   zone      the side it shuts you out on: an NPC in this zone whose plan leads out of it goes to `spot` first
//   npcs      the cast ids who have to open it (anyone else's plans pass through untouched)
//   opens(game, npc)  he can open it now (keyed: he holds the key item; timed: the clock)
//   override  his override once shut out. plan, label: its plan key (no sequence: it lasts the day) and debug label
//   locked    { set?, event? } applied when it doesn't open
//   bang      { first, lines: [{ say, next }], event?, shake?: [amount, t] }: `first` s after, then each `next` s,
//             he says the next line (cycled), emits the event and shakes the screen
// The gather leaves him where he is.
import { shake } from '../../core/fx.js';
import { inZone } from '../../game/perception.js';
import { setOverride, speak, applyEffect, spotLeg } from '../override.js';

export const keepsThroughMeeting = true;

export const owns = (door, npc) => npc.override === door.override && door.npcs.includes(npc.id);

export const key = (door) => door.plan;

export function build(game, npc, plan, door) {
  plan.done = true; // he stays put
  plan.label = door.label;
}

// Heading out of the zone: the door first. (Walking into the zone through it never stops anyone.)
export function prelude(game, npc, plan, door) {
  if (!door.npcs.includes(npc.id) || !inZone(game, door.zone, npc.x, npc.y)) return;
  if (plan.legs.length && !inZone(game, door.zone, plan.legs[0].x, plan.legs[0].y)) {
    plan.legs.unshift(spotLeg(game, door.spot, { arrive: (g, n) => tryDoor(g, n, door) }));
  }
}

// At the door (already turned to face it: spotLeg).
function tryDoor(game, npc, door) {
  if (door.opens(game, npc)) return; // through, carry on
  setOverride(npc, door.override);
  npc.pose = 'stand';
  npc._bangT = door.bang?.first ?? 0;
  applyEffect(game, door.locked);
}

export function tick(game, npc, dt, door) {
  const b = door.bang;
  if (!b) return;
  npc._bangT -= dt;
  if (npc._bangT > 0) return;
  const line = b.lines[npc._bangI++ % b.lines.length];
  speak(game, npc, [line]);
  if (b.event) game.events.emit(b.event, {});
  if (b.shake) shake(game, ...b.shake);
  npc._bangT += line.next;
}
