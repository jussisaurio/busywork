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
// A disguise (disguise.js) changes who you are to them: fooled, they object to nothing; knowing better, they object
// to the disguise itself.
import { SUSPICION_FILL_SEC, SUSPICION_DECAY_SEC, WORK_PENALTY_MIN, NOTICE } from '../config.js';
import { say, shake, sightline } from '../core/fx.js';
import { npcSees, seenVia, findNpc, inZone } from '../game/perception.js';
import { SCREEN_ICON } from '../sim/mechanics/camera.js';
import { npcTakes, npcSayLater } from '../sim/npcs.js';
import { judge } from '../sim/mechanics/index.js';
import { cancelAction, dropHeld } from './interactions.js';
import { setBusy, sendToDesk } from './player.js';
import { DOUBLE_TAKE, updateDisguise, disguiseView, doubleTakeIcons, unmasked } from './disguise.js';

// Module tunables.
export { NOTICE }; // config.js: seconds of continuous sight before a witness reacts
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
// Seen on a screen (sim/mechanics/camera.js): the camera the NPC saw you through, when not with his own eyes. A
// reaction then points at the screen first (its icon leads the bubble, the sightline runs eyes -> screen, lens ->
// you) and its event carries `via: <camera id>`. Without level.cameras, cam is always null and nothing changes.
const camVia = (game, npc) => seenVia(game, npc, game.player.x, game.player.y);
const screenChain = (cam) => (cam ? { screen: cam.monitor, lens: { x: cam.x, y: cam.y } } : undefined);
const withVia = (payload, cam) => (cam ? { ...payload, via: cam.id } : payload);
const pointing = (cam, icons) => (cam ? [cam.icon ?? SCREEN_ICON, ...icons] : icons);
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
// 'disguise' (he knows who's under it) | 'action' (doing something sneaky) | 'scene' (near the scene) |
// 'evidence' (the mark on you) | 'contraband' | null. Fooled by a disguise, he objects to nothing.
function offenceFor(game, s, npc) {
  const p = game.player;
  const r = roles(game);
  const view = disguiseView(game, npc);
  if (view) return view === 'fooled' ? null : 'disguise';
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

// What each NPC has in sight that the rules object to, after this step: game.watch[id] = 'disguise' | 'action' |
// 'scene' | 'evidence' | 'contraband', absent if nothing (and empty while you're caught, the day is decided, or you're
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
  updateDisguise(game); // who knows better, who is fooled for the first time
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
      if (!s.seen[npc.id]) notice(game, s, npc, offence);
      s.seen[npc.id] = (s.seen[npc.id] || 0) + dt;
      if (s.seen[npc.id] >= (offence === 'disguise' ? DOUBLE_TAKE : NOTICE) - 1e-9) {
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
  const idleInView = enforcing(game, boss) && !p.locked && !p.busy && slacking && npcSees(game, boss, p.x, p.y)
    && disguiseView(game, boss) !== 'fooled'; // he sees whoever you're dressed as standing around
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

// First sight of something sneaky: ❓ over the NPC (throttled). A disguise he sees through: a double take, the face
// of whom she passes for, then ❓.
function notice(game, s, npc, offence) {
  const last = s.lastNotice[npc.id];
  if (last !== undefined && game.loopTime - last < NOTICE_BUBBLE_GAP) return;
  s.lastNotice[npc.id] = game.loopTime;
  const cam = camVia(game, npc);
  say(game, npc.id, pointing(cam, offence === 'disguise' ? doubleTakeIcons(game) : ['❓']), { kind: 'thought', ttl: 1.0 });
  sightline(game, npc.id, 'notice', 0.6, screenChain(cam));
  game.events.emit('witness:notice', { by: npc.id });
}

function react(game, s, npc, offence) {
  const r = roles(game);
  const cam = camVia(game, npc);
  if (offence === 'disguise') unmasked(npc); // he objects once; then she is just herself to him
  if (npc.id === r.authority?.id) {
    sightline(game, npc.id, 'caught', 1.6, screenChain(cam));
    caught(game, offence, r.authority.id, cam);
    return;
  }
  const p = game.player;
  // What a late tattle points at (the thing the witness saw you at).
  const icon = offence === 'action' ? p.action.saw ?? undefined : offence === 'scene' ? r.scene.icon
    : offence === 'evidence' ? r.evidence.icon : offence === 'disguise' ? itemFlags(game, p.held)?.icon : undefined;
  if (offence === 'action') cancelAction(game, 'witnessed');
  if (offence === 'scene') s.sceneTold = true;
  if (offence === 'evidence') game.world[r.evidence.knows] = true; // ends her hunt (sim)
  sightline(game, npc.id, 'tattle', 1.2, screenChain(cam));

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
    game.events.emit('witness:tattle', withVia({ by: npc.id, reason: offence, heard: false }, cam));
    return;
  }
  // Caught in the act (or at the scene): they shout and point at you (your face: whom they mean). The authority
  // hears it if he's around.
  say(game, npc.id, pointing(cam, offence === 'evidence' ? [r.evidence.icon, '❗', '👉', '@player'] : ['❗', '👉', '@player']), { kind: 'alert', ttl: 1.6 });
  const heard = authorityHears(game, authorityNpc(game));
  game.events.emit('witness:tattle', withVia({ by: npc.id, reason: offence, heard }, cam));
  if (heard) tattleHeard(game, npc.id, offence);
  else if (!s.grudge) s.grudge = { by: npc.id, icon: icon ?? '❗', reason: offence, t: 0 };
}

// The authority is back: the witness points you out, with what she saw.
function tellLate(game, s, w) {
  const g = s.grudge;
  s.grudge = null;
  sightline(game, w.id, 'tattle', 1.4);
  say(game, w.id, ['👉', '@player', g.icon], { kind: 'alert', ttl: 1.6 });
  game.events.emit('witness:tattle', { by: w.id, reason: g.reason, heard: true, late: true, icon: g.icon });
  tattleHeard(game, w.id, g.reason);
}

// What the authority does on a tattle he hears (level.roles.authority.tattle): 'work' (the default) sends you to your
// desk; 'caught' ends the day on her word; a function (game, { by, reason }) is the level's own answer (he walks
// over and checks, say). Her shout runs to him first, whatever he does (a 'relay' line).
function tattleHeard(game, by, reason) {
  const auth = roles(game).authority;
  const how = auth.tattle ?? 'work';
  if (how === 'work') return assignWork(game, 'tattle', by);
  const boss = findNpc(game, auth.id);
  if (boss && boss.active) sightline(game, by, 'relay', 1.0, undefined, auth.id);
  if (how === 'caught') caught(game, reason, auth.id);
  else how(game, { by, reason });
}

// The authority sends you back to your desk to type for WORK_PENALTY_MIN game minutes. by: the witness who told
// (her shout runs to him as a line: he looks at her, then at you, then gives the order). The order stands from
// this step (forced, locked, workAssigned); you walk to your desk inside that time (player.js sendToDesk).
function assignWork(game, reason, by = null) {
  const s = game.rules;
  const p = game.player;
  const id = roles(game).authority.id;
  const boss = findNpc(game, id);
  const here = boss && boss.active;
  if (by && here) sightline(game, by, 'relay', 1.0, undefined, id);
  // If the authority is off-floor (restroom), the order still lands: shown over the player at once.
  sendToDesk(game, by, here ? id : null);
  // Sent back for standing around (reason 'idle': the only action left then is an idle one, eating): the action
  // ends as 'idle'. Told on (a tattle): 'witnessed'.
  cancelAction(game, reason === 'idle' ? 'idle' : 'witnessed');
  if (!itemFlags(game, p.held)?.keep) dropHeld(game); // whatever you carried stays where you stood (`keep`: in your hand)
  p.locked = true;
  game.clock.forced = WORK_PENALTY_MIN;
  game.clock.ff = false;
  game.suspicion[id] = 0;
  s.working = true;
  s.seen = {};
  s.grudge = null; // you're on your way to your desk: nothing left to tell
  game.events.emit(`${id}:workAssigned`, { reason });
}

// What the mechanics may ask of the rules (src/sim/mechanics/index.js judge).
const JUDGE = { claims, enforcing, caught: (game, reason, by) => caught(game, reason, by) };

// cam: the camera he saw you through (camVia), if only on a screen: he points at it, then at you.
function caught(game, reason, by = roles(game).authority.id, cam = null) {
  if (game.caught) return;
  const p = game.player;
  game.caught = { by, reason, t: 0, via: cam ? cam.id : null }; // via: the camera he saw you on (end scenes)
  cancelAction(game, 'caught');
  p.locked = true;
  setBusy(game, false, null);
  game.clock.ff = false;
  say(game, by, cam ? pointing(cam, ['❗', '👉', '@player']) : ['❗', '😠'], { kind: 'alert' }); // on a screen: whom he means
  game.events.emit('caught', withVia({ by, reason }, cam));
  shake(game, 0.3, 0.4);
}
