// Office rules: witnesses and tattling, contraband, the authority's suspicion, assigned work, getting caught.
// Runs after updateNpcs, so it sees this step's NPC positions and glances. Who plays which part comes from
// level.roles (authority, evidence, scene) and the item flags in level.items (owner, contraband).
//
// Witnesses (everyone but the authority) don't punish you themselves: they shout and point ❗👉. If the
// authority is on the floor he hears it and sends you to your desk. While he's out (restroom, smoke break) the
// shout lands on nobody, but the witness remembers: the moment he's back on the floor she points you out
// (👉 + what she saw) and you go to your desk then. Only an authority off duty for good (locked out), or the
// 4:00 meeting, ends the grudge.
// Owners take their things back on sight, but only while they know it's theirs (the owner's `when`): level 1's
// Lin her sandwich (to anyone else, taking or eating it is just lunch), and Kev the day's only cup of coffee,
// once he's been to the pot and found it empty (☕❓😩). Before that, a colleague with a coffee is nothing.
import { SUSPICION_FILL_SEC, SUSPICION_DECAY_SEC, WORK_PENALTY_MIN } from '../config.js';
import { say, burst, shake, sightline } from '../core/fx.js';
import { npcSees, findNpc, inZone } from '../game/perception.js';
import { npcTakes, npcSayLater } from '../sim/npcs.js';
import { judge } from '../sim/mechanics/index.js';
import { cancelAction, dropHeld, actionRow } from './interactions.js';
import { setBusy, sitAtDesk } from './player.js';

// Module tunables.
export const NOTICE = 0.3; // seconds of continuous sight before a witness reacts
const NOTICE_BUBBLE_GAP = 1.0; // min seconds between ❓ bubbles from the same NPC
const TELL_DELAY = 1.2; // seconds after the authority is back on the floor before a witness tells on you
// The scene's investigator blames whoever he sees in its zone, or within this many tiles of its door (unless
// you're pretending: just someone on a call). A level's scene may set its own `radius`.
export const SCENE_RADIUS = 3.5;

const NO_ROLE = {};
// The level's items that are contraband and tracked in world (cached per level: updateRules runs every step).
const contrabandCache = new WeakMap();
function contrabandItems(level) {
  let list = contrabandCache.get(level);
  if (!list) {
    list = Object.entries(level.items ?? {}).filter(([, item]) => item.contraband && item.place);
    contrabandCache.set(level, list);
  }
  return list;
}
const roles = (game) => game.level.roles ?? NO_ROLE;
const itemFlags = (game, type) => (type ? game.level.items?.[type] : undefined);
// The authority's NPC, or null.
const authorityNpc = (game) => (roles(game).authority ? findNpc(game, roles(game).authority.id) : null);

// Who takes what back (the item's owner), and whether they know it's theirs right now.
function claims(game, npc, item) {
  const owner = itemFlags(game, item)?.owner;
  if (!owner || owner.id !== npc.id) return false;
  return !owner.when || owner.when(npc);
}

// Does this NPC (the authority) currently enforce suspicion/contraband?
function enforcing(game, npc) {
  return !!npc && npc.active && !(roles(game).authority?.offDuty ?? []).includes(npc.override);
}

// The authority hears a witness shout if he's on the floor (not away, not in the zone he's deaf in).
function authorityHears(game, boss) {
  const deafIn = roles(game).authority?.deafIn;
  return enforcing(game, boss) && !(deafIn && inZone(game, deafIn, boss.x, boss.y));
}

// The scene's investigator is on it and the player is where the culprit would be.
function atScene(game, s, npc) {
  const scene = roles(game).scene;
  const p = game.player;
  if (!scene || npc.id !== scene.by || s.sceneTold) return false;
  if (!scene.while.includes(npc.override)) return false;
  if (inZone(game, scene.zone, p.x, p.y)) return true;
  const door = scene.door;
  return !p.busy && Math.hypot(p.x - door.x, p.y - door.y) <= (scene.radius ?? SCENE_RADIUS);
}

// What this NPC would object to right now, if it saw the player:
// 'action' (doing something sneaky) | 'scene' (near the scene) | 'evidence' (the mark on you) | 'contraband' | null.
function offenceFor(game, s, npc) {
  const p = game.player;
  const r = roles(game);
  if (p.action && p.action.sneaky && (!p.action.owner || p.action.owner === npc.id)) {
    // A locked-out boss is outside banging on the glass: he can't do anything about it.
    if (npc.id === r.authority?.id && (r.authority.helpless ?? []).includes(npc.override)) return null;
    return 'action';
  }
  if (atScene(game, s, npc)) return 'scene';
  // Lin hunting for her sandwich spots the mustard down your sweater. Pretending doesn't hide a stain.
  const ev = r.evidence;
  if (ev && npc.id === ev.by && npc.override === ev.while && p[ev.mark] && !game.world[ev.knows]) return 'evidence';
  if (p.busy) return null; // phone call / folder stride hides contraband
  if (npc.id === itemFlags(game, p.held)?.contraband && enforcing(game, npc)) return 'contraband';
  if (claims(game, npc, p.held)) return 'contraband';
  return null;
}

export function updateRules(game, dt) {
  rulesStep(game, dt);
  publishWatch(game);
}

// What each NPC has in sight that the rules object to, after this step: game.watch[id] = 'action' | 'scene' |
// 'evidence' | 'contraband', absent if nothing (and empty while you're caught, the day is decided, or you're
// serving assigned work: the rules react to nothing then). Published every step for the renderer (cones.js), so
// a cone glows exactly when its owner would react. Read-only: nothing in the sim reads it, and it's not in world.
function publishWatch(game) {
  const watch = {};
  const s = game.rules;
  if (game.phase === 'day' && !game.caught && !game.outcome && !s.working) {
    const p = game.player;
    for (const npc of game.npcs) {
      const offence = offenceFor(game, s, npc);
      if (offence && npcSees(game, npc, p.x, p.y)) watch[npc.id] = offence;
    }
  }
  game.watch = watch;
}

function rulesStep(game, dt) {
  if (game.phase !== 'day' || game.caught || game.outcome) return;
  const s = game.rules;
  const p = game.player;
  // Mechanics with a say (what lies on your desk: putdown.js; a failed inspection: inspection.js) judge first,
  // even while you serve assigned work: evidence doesn't wait.
  if (judge(game, JUDGE)) return;

  // Serving assigned work: nothing else applies until it's done.
  if (s.working) {
    if (game.clock.forced > 0) {
      s.seen = {};
      decaySuspicion(game, dt);
      return;
    }
    s.working = false;
    p.locked = false;
    game.events.emit('work:done', {});
  }

  const boss = authorityNpc(game);
  const scene = roles(game).scene;
  if (scene && scene.fresh(game.world)) s.sceneTold = false; // a fresh breakage is a fresh scene

  // A witness who shouted at an empty office tells the authority once he's back within earshot.
  if (s.grudge) {
    const w = findNpc(game, s.grudge.by);
    if (w && w.active && authorityHears(game, boss)) {
      s.grudge.t += dt;
      if (s.grudge.t >= TELL_DELAY) {
        tellLate(game, s, w);
        return;
      }
    } else {
      s.grudge.t = 0;
    }
  }

  // Witnesses (sneaky actions, the scene, the evidence) and contraband.
  for (const npc of game.npcs) {
    const offence = offenceFor(game, s, npc);
    if (offence && npcSees(game, npc, p.x, p.y)) {
      if (!s.seen[npc.id]) notice(game, s, npc);
      s.seen[npc.id] = (s.seen[npc.id] || 0) + dt;
      if (s.seen[npc.id] >= NOTICE - 1e-9) {
        s.seen[npc.id] = 0;
        react(game, s, npc, offence);
        if (game.caught || s.working) return;
      }
    } else {
      s.seen[npc.id] = 0;
    }
  }

  // Contraband lying where its confiscator can see it goes straight back into his pocket (the keycard).
  for (const [type, item] of contrabandItems(game.level)) {
    if (game.world[item.place] !== 'dropped') continue;
    const by = findNpc(game, item.contraband);
    if (!enforcing(game, by)) continue;
    const it = game.world.items.find((i) => i.type === type);
    if (it && npcSees(game, by, it.x, it.y)) {
      game.world.items = game.world.items.filter((i) => i !== it);
      game.world[item.place] = by.id;
      say(game, by.id, [item.icon, '❗'], { kind: 'speech', voice: by.voice });
      game.events.emit(`${type}:recovered`, {});
    }
  }
  const auth = roles(game).authority;
  if (!auth) return;

  // The authority's suspicion: he sees you standing around (not busy, not doing anything).
  const id = auth.id;
  const slacking = !p.action || p.action.idle; // eating at work is not working
  const idleInView = enforcing(game, boss) && !p.locked && !p.busy && slacking && npcSees(game, boss, p.x, p.y);
  if (idleInView) {
    if (game.suspicion[id] === 0) game.events.emit(`${id}:suspicious`, {});
    game.suspicion[id] = Math.min(1, game.suspicion[id] + dt / SUSPICION_FILL_SEC);
    if (game.suspicion[id] >= 1) assignWork(game, 'idle');
  } else {
    decaySuspicion(game, dt);
  }
}

function decaySuspicion(game, dt) {
  const id = roles(game).authority?.id;
  if (id) game.suspicion[id] = Math.max(0, game.suspicion[id] - dt / SUSPICION_DECAY_SEC);
}

// First sight of something sneaky: ❓ over the NPC (throttled).
function notice(game, s, npc) {
  const last = s.lastNotice[npc.id];
  if (last !== undefined && game.loopTime - last < NOTICE_BUBBLE_GAP) return;
  s.lastNotice[npc.id] = game.loopTime;
  say(game, npc.id, ['❓'], { kind: 'thought', ttl: 1.0 });
  sightline(game, npc.id, 'notice', 0.6);
  game.events.emit('witness:notice', { by: npc.id });
}

function react(game, s, npc, offence) {
  const r = roles(game);
  if (npc.id === r.authority?.id) {
    sightline(game, npc.id, 'caught', 1.6);
    caught(game, offence);
    return;
  }
  const p = game.player;
  // What a late tattle points at (the thing the witness saw you at).
  const icon = offence === 'action' ? actionRow(game, p.action.type)?.saw : offence === 'scene' ? r.scene.icon : offence === 'evidence' ? r.evidence.icon : undefined;
  if (offence === 'action') cancelAction(game, 'witnessed');
  if (offence === 'scene') s.sceneTold = true;
  if (offence === 'evidence') game.world[r.evidence.knows] = true; // ends her hunt (sim)
  sightline(game, npc.id, 'tattle', 1.2);

  // Owners take their things back, whatever else you were up to.
  const held = p.held;
  const owner = itemFlags(game, held)?.owner;
  if (claims(game, npc, held)) {
    p.held = null;
    if (owner.reclaim) owner.reclaim(game, npc);
    else {
      npcTakes(npc, held);
      game.events.emit(`${held}:confiscated`, { by: npc.id });
    }
  }

  // Just carrying their thing: they take it and that's the end of it, with a word (the owner's `says`).
  if (offence === 'contraband') {
    for (const line of owner?.says ?? []) {
      if (line.after) npcSayLater(npc, line.after, line.say, line.kind ?? 'speech', line.ttl);
      else say(game, npc.id, line.say, { kind: line.kind ?? 'speech', ttl: line.ttl });
    }
    game.events.emit('witness:tattle', { by: npc.id, reason: offence, heard: false });
    return;
  }
  // Caught in the act (or at the scene): they shout and point. The authority hears it if he's around.
  say(game, npc.id, offence === 'evidence' ? [r.evidence.icon, '❗', '👉'] : ['❗', '👉'], { kind: 'alert', ttl: 1.6 });
  const heard = authorityHears(game, authorityNpc(game));
  game.events.emit('witness:tattle', { by: npc.id, reason: offence, heard });
  if (heard) assignWork(game, 'tattle');
  else if (!s.grudge) s.grudge = { by: npc.id, icon: icon ?? '❗', reason: offence, t: 0 };
}

// The authority is back: the witness points you out, with what she saw.
function tellLate(game, s, w) {
  const g = s.grudge;
  s.grudge = null;
  sightline(game, w.id, 'tattle', 1.4);
  say(game, w.id, ['👉', g.icon], { kind: 'alert', ttl: 1.6 });
  game.events.emit('witness:tattle', { by: w.id, reason: g.reason, heard: true, late: true, icon: g.icon });
  assignWork(game, 'tattle');
}

// The authority sends you back to your desk to type for WORK_PENALTY_MIN game minutes.
function assignWork(game, reason) {
  const s = game.rules;
  const p = game.player;
  const id = roles(game).authority.id;
  const boss = findNpc(game, id);
  // If the authority is off-floor (restroom), the order still lands: show it over the player.
  say(game, boss && boss.active ? id : 'player', ['📄', '📄', '👉', '🖥️'], { kind: 'speech' });
  // Sent back for standing around (reason 'idle': the only action left then is an idle one, eating): the action
  // ends as 'idle'. Told on (a tattle): 'witnessed'.
  cancelAction(game, reason === 'idle' ? 'idle' : 'witnessed');
  dropHeld(game); // whatever you carried stays where you stood
  burst(game, 'paper', p.x, p.y, 10, { speed: 1.8 });
  sitAtDesk(game);
  burst(game, 'paper', p.x, p.y, 10, { speed: 1.8 });
  setBusy(game, true, 'typing');
  p.locked = true;
  game.clock.forced = WORK_PENALTY_MIN;
  game.clock.ff = false;
  game.suspicion[id] = 0;
  s.working = true;
  s.seen = {};
  s.grudge = null; // you're at your desk already: nothing left to tell
  game.events.emit(`${id}:workAssigned`, { reason });
}

// What the mechanics may ask of the rules (src/sim/mechanics/index.js judge).
const JUDGE = { claims, enforcing, caught: (game, reason, by) => caught(game, reason, by) };

function caught(game, reason, by = roles(game).authority.id) {
  if (game.caught) return;
  const p = game.player;
  game.caught = { by, reason, t: 0 };
  cancelAction(game, 'caught');
  p.locked = true;
  setBusy(game, false, null);
  game.clock.ff = false;
  say(game, by, ['❗', '😠'], { kind: 'alert' });
  game.events.emit('caught', { by, reason });
  shake(game, 0.3, 0.4);
}
