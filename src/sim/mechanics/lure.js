// Lure: a world condition (usually one the player causes) pulls one NPC to a spot. He works there for a while,
// then resumes his day (or goes to the meeting, after the gather). Level 1: Kev and the broken projector.
//
// Level data (level.lures, a list, checked in order every step, before the hunts):
//   npc       the cast id who answers it
//   when(world)  the pull. Checked while he is on the floor (active, not gone) and not already on a lure's job:
//             it pre-empts any other override (a hunt, the meeting, ...)
//   override  his override on the way there
//   plan, label  the plan key prefix (`${plan}#${seq}`) and the plan's debug label
//   spot      where he deals with it (a level spot; he faces spot.face)
//   react     { wait, says?, event? }: on noticing he stands `wait` s, then sets off
//   work      on arrival, if when() still holds:
//     override  his override while working (same episode: no new plan)
//     minutes   game minutes of work. progress: the world field that runs 0 -> 1 meanwhile (HUD), reset to 0 after
//     start     { set?, event?, says? } applied on arrival. He gives up (endOverride) as soon as a field that
//               start.set set changes (someone else dealt with it, or undid it)
//     done      { set?, event?, says? } applied when progress reaches 1, then endOverride
//     pose      optional: his pose while working ('sit': down on the floor at it, as if kneeling); default standing
// Debug label while working: `${work.override} N%`. While working he doesn't daydream about what he wants (crave).
// The gather leaves him to finish the job (endOverride sends him to the meeting afterwards).
import { GAME_MIN_PER_SEC } from '../../config.js';
import { setOverride, endOverride, holdFor, speak, applyEffect, spotLeg } from '../override.js';

export const keepsThroughMeeting = true;

// Busy with the job itself (not on his way to it).
export const working = (lure, npc) => npc.override === lure.work.override;

export const owns = (lure, npc) =>
  npc.id === lure.npc && (npc.override === lure.override || npc.override === lure.work.override);

export function check(game, npc, lure) {
  if (npc.id !== lure.npc || !npc.active || npc._gone || !lure.when(game.world)) return;
  if (npc.override && game.level.lures.some((l) => owns(l, npc))) return; // one job at a time
  setOverride(npc, lure.override);
  holdFor(npc, lure.react?.wait ?? 0);
  speak(game, npc, lure.react?.says);
  if (lure.react?.event) game.events.emit(lure.react.event, {});
}

export const key = (lure, npc) => `${lure.plan}#${npc._ovSeq}`;

export function build(game, npc, plan, lure) {
  plan.legs.push(spotLeg(game, lure.spot, { arrive: (g, n) => arrive(g, n, lure) }));
  plan.label = lure.label;
}

function arrive(game, npc, lure) {
  const w = game.world;
  if (!lure.when(w)) return endOverride(npc);
  npc.override = lure.work.override; // same episode: no _ovSeq bump, keep the plan
  if (lure.work.pose && npc._plan) npc._plan.pose = lure.work.pose; // finishPlan, right after this, applies it
  w[lure.work.progress] = 0;
  applyEffect(game, lure.work.start);
  speak(game, npc, lure.work.start?.says);
}

const setEntries = new WeakMap(); // Object.entries(set), cached: tick runs every step while he works
function holds(w, set) {
  if (!set) return true;
  let e = setEntries.get(set);
  if (!e) setEntries.set(set, (e = Object.entries(set)));
  return e.every(([k, v]) => w[k] === v);
}

export function tick(game, npc, dt, lure) {
  const work = lure.work;
  if (npc.override !== work.override) return;
  const w = game.world;
  if (!holds(w, work.start?.set)) return endOverride(npc);
  w[work.progress] = Math.min(1, w[work.progress] + (dt * GAME_MIN_PER_SEC) / work.minutes);
  if (w[work.progress] >= 1 - 1e-9) {
    w[work.progress] = 0;
    applyEffect(game, work.done);
    speak(game, npc, work.done?.says);
    endOverride(npc); // resumes the schedule: he still goes home, just later
  }
}

export const label = (game, npc, lure) => (npc.override === lure.work.override
  ? `${lure.work.override} ${Math.round(game.world[lure.work.progress] * 100)}%`
  : null);
