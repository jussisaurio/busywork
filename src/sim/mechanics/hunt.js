// Hunt: an NPC searches for something (an item, the player, ...): she walks a route back and forth, stopping to
// look around at each point, until she finds it or gives up. Level 1: Lin hunting her sandwich.
// Something else starts it (a level behaviour hook calls startHunt, mechanics/index.js); the hunt ends itself.
//
// Level data (level.hunts, a list, checked in order every step, after the lures):
//   npc       the cast id who hunts
//   override  her override while hunting
//   plan, label  the plan key prefix (`${plan}#${seq}`) and the plan's debug label
//   route     a level patrol, walked back and forth
//   look      { angle, time }: at each point she stops `time` s and sweeps her head `angle` rad right, left, back
//   start     { event?, says?, wait? } on starting: the event, her bubbles, then she stands `wait` s before setting off
//   until     game minute she gives up (default: never)
//   found(game, npc)  she has found it: the hunt ends
//   end       { says? } her bubbles when it ends (found or given up); then endOverride
// The gather interrupts a hunt (she goes to the meeting).
import { setOverride, endOverride, holdFor, speak } from '../override.js';

export const keepsThroughMeeting = false;

export const owns = (hunt, npc) => npc.id === hunt.npc && npc.override === hunt.override;

export function start(game, npc, hunt) {
  const s = hunt.start ?? {};
  if (s.event) game.events.emit(s.event, {});
  speak(game, npc, s.says);
  setOverride(npc, hunt.override);
  holdFor(npc, s.wait ?? 0);
}

export function check(game, npc, hunt, now) {
  if (!owns(hunt, npc)) return;
  if (now < (hunt.until ?? Infinity) && !hunt.found(game, npc)) return;
  speak(game, npc, hunt.end?.says);
  endOverride(npc);
}

export const key = (hunt, npc) => `${hunt.plan}#${npc._ovSeq}`;

export function build(game, npc, plan, hunt) {
  const look = (g, n) => {
    n._look = { t: 0, angle: hunt.look.angle }; // npcs.js updateGlance sweeps the head while _look is set
    holdFor(n, hunt.look.time);
  };
  plan.legs = game.level.patrols[hunt.route].map(([x, y]) => ({ x, y, arrive: look }));
  plan.loop = true; // back and forth until the override ends
  plan.label = hunt.label;
}
