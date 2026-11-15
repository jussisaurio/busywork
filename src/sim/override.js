// Override plumbing shared by the NPC sim (npcs.js), its mechanics (mechanics/*) and the level's behaviour hooks.
// All state is on the NPC (underscore fields, see npcs.js createNpc).
import { DIRS } from '../core/vision.js';
import { say } from '../core/fx.js';
import { spotPos } from '../game/perception.js';

export function setOverride(npc, ov) {
  npc.override = ov;
  npc._ovSeq++; // a repeated override gets a fresh plan
}

// Leaving an override: resume whatever the schedule says now (or the meeting after the gather).
export function endOverride(npc) {
  if (npc._gathered && !npc._gone) setOverride(npc, npc._gathered); // the meeting's override (npcs.js gather)
  else npc.override = null;
  npc._look = null;
}

// A speech bubble `t` seconds from now, queued behind any already waiting. ttl: how long it shows (say()'s
// default if absent). face: a spot name he turns to look at as it shows (npcs.js tickSayQueue).
export function npcSayLater(npc, t, icons, kind, ttl, face) {
  npc._sayQ.push({ t, icons, kind, ttl, face });
}

// Stand still for at least `s` seconds before going on with the plan.
export function holdFor(npc, s) {
  npc._wait = Math.max(npc._wait, s);
}

// Bubbles from level data, in order. A line: { say: icons, kind?: 'speech', ttl?, after?, face? }. A line with
// `after` is queued that many seconds behind the ones already waiting (npcSayLater), keeping its kind and ttl.
// face: a spot name; he turns to look at it as the line shows (a beat of a scene: "points at the board, then at
// you").
export function speak(game, npc, lines) {
  if (!lines) return;
  for (const l of lines) {
    if (l.after) npcSayLater(npc, l.after, l.say, l.kind ?? 'speech', l.ttl, l.face);
    else {
      if (l.face) faceSpot(game, npc, l.face);
      say(game, npc.id, l.say, { kind: l.kind ?? 'speech', voice: npc.voice, ttl: l.ttl });
    }
  }
}

// Turn to look at a named spot (he keeps facing it until his plan turns him again).
export function faceSpot(game, npc, name) {
  const p = spotPos(game, name);
  npc._faceTarget = Math.atan2(p.y - npc.y, p.x - npc.x);
}

// An effect from level data: { set?: { worldField: value }, event? }. Fields first, then the event ({} payload).
export function applyEffect(game, eff) {
  if (!eff) return;
  if (eff.set) Object.assign(game.world, eff.set);
  if (eff.event) game.events.emit(eff.event, {});
}

// A plan leg to a named spot, facing the spot's face.
export function spotLeg(game, name, extra = {}) {
  const s = game.level.spots[name];
  return { x: s.x, y: s.y, face: DIRS[s.face], name, ...extra };
}
