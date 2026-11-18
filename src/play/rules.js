// Office rules: witnesses and tattling, contraband, the authority's suspicion, assigned work, getting caught.
// Runs after updateNpcs, so it sees this step's NPC positions and glances. Who plays which part comes from
// level.roles (authority, evidence, scene) and the item flags in level.items (owner, contraband).
//
// Witnesses (everyone but the authority) don't punish you themselves: they shout and point ❗👉. If the
// authority is on the floor he hears it and sends you to your desk. While he's out (restroom, smoke break) the
// shout lands on nobody, but the witness remembers: the moment he's back on the floor she points you out
// (👉 + what she saw) and you go to your desk then. Only an authority off duty for good (locked out), or the
// 4:00 meeting, ends the grudge.
// Owners take their things back on sight, but only while they know it's theirs (the owner's `when`): a
// coworker her sandwich (to anyone else, taking or eating it is just lunch), or the day's only cup of coffee once
// he's been to the pot and found it empty (☕❓😩). Before that, a colleague with a coffee is nothing.
// A disguise (disguise.js) changes who you are to them: fooled, they object to nothing; knowing better, they object
// to the disguise itself.
import { SUSPICION_FILL_SEC, SUSPICION_DECAY_SEC, WORK_PENALTY_MIN, NOTICE } from '../config.js';
import { say, shake, sightline } from '../core/fx.js';
import { npcSees, seenVia, findNpc, inZone } from '../game/perception.js';
import { SCREEN_ICON } from '../sim/mechanics/camera.js';
import { npcSayLater } from '../sim/npcs.js';
import { takesBack } from '../sim/take.js';
import { judge } from '../sim/mechanics/index.js';
import { startClaim, claimDue } from '../sim/mechanics/claim.js';
import { cancelAction, dropHeld } from './interactions.js';
import { setBusy, sendToDesk, showOut } from './player.js';
import { DOUBLE_TAKE, updateDisguise, disguiseView, doubleTakeIcons, unmasked } from './disguise.js';

// Module tunables.
export { NOTICE }; // config.js: seconds of continuous sight before a witness reacts
const NOTICE_BUBBLE_GAP = 1.0; // min seconds between ❓ bubbles from the same NPC
const SHOW_OUT_STARE = 1.6; // seconds he keeps facing you as he points you out
const TRESPASS_NOTICE = 0.6; // seconds an owner looks at you in his private place (🤨) before he shows you out
const TELL_DELAY = 1.2; // seconds after the authority is back on the floor before a witness tells on you
// The scene's investigator blames whoever he sees in its zone, or within this many tiles of its door (unless
// you're pretending: just someone on a call). A level's scene may set its own `radius`.
export const SCENE_RADIUS = 3.5;

const NO_ROLE = {};
const roles = (game) => game.level.roles ?? NO_ROLE;
// Seen on a screen (sim/mechanics/camera.js): the camera the NPC saw you through, when not with his own eyes. A
// reaction then points at the screen first (its icon leads the bubble, the sightline runs eyes -> screen, lens ->
// you) and its event carries `via: <camera id>`. Without level.cameras, cam is always null and nothing changes.
const camVia = (game, npc) => seenVia(game, npc, game.player.x, game.player.y);
const screenChain = (cam) => (cam ? { screen: cam.monitor, lens: { x: cam.x, y: cam.y } } : undefined);
const withVia = (payload, cam) => (cam ? { ...payload, via: cam.id } : payload);
const CAUGHT_ICONS = ['❗', '👉', '@player'];
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
export function enforcing(game, npc) {
  return !!npc && npc.active && !(roles(game).authority?.offDuty ?? []).includes(npc.override);
}

// The authority hears a witness shout if he's on the floor (not away, not in the zone he's deaf in).
// `from`: the shouting witness. With `authority.earshot` (tiles) he hears her only that close; default the whole floor.
function authorityHears(game, boss, from) {
  const { deafIn, earshot } = roles(game).authority ?? {};
  if (!enforcing(game, boss) || (deafIn && inZone(game, deafIn, boss.x, boss.y))) return false;
  return earshot == null || !from || Math.hypot(from.x - boss.x, from.y - boss.y) <= earshot;
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
  // The evidence role's witness, on her hunt, spots the mark on you (player.smeared). Pretending doesn't hide a stain.
  const ev = r.evidence;
  if (ev && npc.id === ev.by && [].concat(ev.while).includes(npc.override) && p[ev.mark] && !game.world[ev.knows]) return 'evidence';
  if (!p.busy) { // phone call / folder stride hides contraband
    const held = itemFlags(game, p.held);
    if (npc.id === held?.contraband && enforcing(game, npc) && (!held.contrabandIn || inZone(game, held.contrabandIn, p.x, p.y))) return 'contraband';
    if (claims(game, npc, p.held)) return 'contraband';
  }
  if (trespassing(game, npc)) return 'trespass'; // a phone call in his office is still "why are you in my office"
  return null;
}

// Private places (level.roles.private: [{ zone, owner, offDuty? }]): the player is in a zone this NPC owns, and he
// minds right now (on the floor, not in one of the entry's offDuty overrides; the authority also enforcing and not
// helpless). Returns the entry, or null.
function trespassing(game, npc) {
  const list = roles(game).private;
  if (!list || !npc.active) return null;
  const p = game.player;
  const auth = roles(game).authority;
  for (const e of list) {
    if (e.owner !== npc.id || !inZone(game, e.zone, p.x, p.y)) continue;
    if ((e.offDuty ?? []).includes(npc.override)) continue;
    if (npc.id === auth?.id && (!enforcing(game, npc) || (auth.helpless ?? []).includes(npc.override))) continue;
    return e;
  }
  return null;
}

// Are the office rules live right now? The one answer for every caller: null when they are, else the first reason
// they are not:
//   'over'     not the day, or the day is decided (game.outcome)
//   'caught'   someone caught you: the catch's beat is playing out
//   'leaving'  gone for the day (scenario.js leaveDay): nobody sees you
//   'hidden'   out of sight (player.hidden: in a cubicle): nobody sees you
//   'out'      shown out of someone's office (player.js showOut): on your way back to your desk
//   'working'  serving assigned work (rules.working)
// Witnesses, suspicion, the cones (game.watch) and a level's show-out want null. A catch also lands while you are
// shown out or serving assigned work (canCatch): evidence doesn't wait, and a walk to your desk is no alibi.
export function rulesOff(game) {
  if (game.phase !== 'day' || game.outcome) return 'over';
  if (game.caught) return 'caught';
  if (game.scenario?.leave) return 'leaving';
  if (game.player.hidden) return 'hidden';
  if (game.rules.out) return 'out';
  if (game.rules.working) return 'working';
  return null;
}
const canCatch = (off) => off === null || off === 'out' || off === 'working';

export function updateRules(game, dt) {
  rulesStep(game, dt);
  publishWatch(game);
}

// What each NPC has in sight that the rules object to, after this step: game.watch[id] = 'disguise' | 'action' |
// 'scene' | 'evidence' | 'contraband' | 'trespass', absent if nothing (and empty whenever the rules are off: rulesOff).
// Published every step for the renderer (cones.js), so
// a cone glows exactly when its owner would react. Read-only: nothing in the sim reads it, and it's not in world.
function publishWatch(game) {
  const watch = {};
  if (rulesOff(game) === null) {
    const p = game.player;
    for (const npc of game.npcs) {
      const offence = offenceFor(game, game.rules, npc);
      if (offence && npcSees(game, npc, p.x, p.y)) watch[npc.id] = offence;
    }
  }
  game.watch = watch;
}

function rulesStep(game, dt) {
  if (rulesOff(game) === 'over') return;
  claimsDue(game); // even in a catch's beat: he walks over for his thing (sim/mechanics/claim.js)
  if (!canCatch(rulesOff(game))) return;
  const s = game.rules;
  const p = game.player;
  updateDisguise(game); // who knows better, who is fooled for the first time
  // Mechanics with a say (what lies on your desk: putdown.js; a failed inspection: inspection.js) judge first,
  // even while you serve assigned work: evidence doesn't wait.
  if (judge(game, JUDGE)) return;

  // Being shown out of someone's office: nothing else applies until you're back at your desk (player.js).
  if (s.out) {
    s.seen = {};
    decaySuspicion(game, dt);
    return;
  }

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
    if (w && w.active && authorityHears(game, boss, w)) {
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
    const coming = offence === 'contraband' && npc._claim && !npc._claim.done && !npc._claim.at && npc._claim.item === p.held; // on his way already
    if (offence && !coming && npcSees(game, npc, p.x, p.y)) {
      if (!s.seen[npc.id]) notice(game, s, npc, offence);
      s.seen[npc.id] = (s.seen[npc.id] || 0) + dt;
      if (s.seen[npc.id] >= (offence === 'disguise' ? DOUBLE_TAKE : offence === 'trespass' ? TRESPASS_NOTICE : NOTICE) - 1e-9) {
        s.seen[npc.id] = 0;
        react(game, s, npc, offence);
        if (game.caught || s.working || s.out) return;
      }
    } else {
      s.seen[npc.id] = 0;
    }
  }

  // Contraband on the floor where its confiscator sees it: he walks over and pockets it (sim/mechanics/fetch.js).
  const auth = roles(game).authority;
  if (!auth) return;

  // The authority's suspicion: he sees you standing around (not busy, not doing anything).
  const id = auth.id;
  const slacking = !p.action || p.action.idle; // eating at work is not working
  const idleInView = enforcing(game, boss) && !p.locked && !p.busy && slacking && npcSees(game, boss, p.x, p.y)
    && disguiseView(game, boss) !== 'fooled' // he sees whoever you're dressed as standing around
    && !trespassing(game, boss) // in his own office the question is a different one (🤨 👉🚪)
    && !(auth.idleOkIn && inZone(game, auth.idleOkIn, p.x, p.y)); // a break spot (roles.authority.idleOkIn): standing about is what it's for
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

// What the witness saw you at (a picture), for his ❓ and a late tattle's 👉: the act's `saw`, the scene's or the
// evidence's icon, or the item in your hand (a disguise's, an owner's contraband). Undefined: just you.
function seenIcon(game, offence) {
  const p = game.player;
  const r = roles(game);
  if (offence === 'action') return p.action.saw ?? undefined;
  if (offence === 'scene') return r.scene.icon;
  if (offence === 'evidence') return r.evidence.icon;
  if (offence === 'disguise' || offence === 'contraband') return itemFlags(game, p.held)?.icon;
  return undefined;
}

// First sight of something sneaky (throttled): a thought cloud with WHAT he noticed, then ❓ (just your face when
// it's only you). On a screen, the screen first (📺 what ❓). A disguise he sees through: a double take, the face
// of whom she passes for, then ❓.
function notice(game, s, npc, offence) {
  const last = s.lastNotice[npc.id];
  if (last !== undefined && game.loopTime - last < NOTICE_BUBBLE_GAP) return;
  s.lastNotice[npc.id] = game.loopTime;
  const cam = camVia(game, npc);
  const icons = offence === 'disguise' ? doubleTakeIcons(game) : offence === 'trespass' ? ['@player', '🤨'] : [seenIcon(game, offence) ?? '@player', '❓'];
  say(game, npc.id, pointing(cam, icons), { kind: 'thought', ttl: 1.0 });
  sightline(game, npc.id, 'notice', 0.6, screenChain(cam));
  game.events.emit(offence === 'trespass' ? 'trespass:notice' : 'witness:notice', { by: npc.id });
}

function react(game, s, npc, offence) {
  const r = roles(game);
  const cam = camVia(game, npc);
  if (offence === 'disguise') unmasked(npc); // he objects once; then she is just herself to him
  // The authority finds you in his office holding a thing of his he knows is his (an owner's `when`: the mug he is
  // hunting for): that is proof, not a stray visitor. A catch, as it is anywhere else. His contraband (the keycard)
  // he only takes back, and other owners only show you out.
  const his = game.player.held;
  const proof = offence === 'trespass' && npc.id === r.authority?.id && his
    && itemFlags(game, his).contraband !== npc.id && claims(game, npc, his);
  if (proof) offence = 'contraband';
  else if (offence === 'trespass') return showOutOf(game, s, npc, trespassing(game, npc), cam);
  if (npc.id === r.authority?.id) {
    caught(game, offence, r.authority.id, cam);
    return;
  }
  const p = game.player;
  const icon = offence === 'contraband' ? undefined : seenIcon(game, offence); // what a late tattle points at
  if (offence === 'action') cancelAction(game, 'witnessed');
  if (offence === 'scene') s.sceneTold = true;
  if (offence === 'evidence') game.world[r.evidence.knows] = true; // ends her hunt (sim)
  sightline(game, npc.id, 'tattle', 1.2, screenChain(cam));

  // Owners take their things back, whatever else you were up to: at arm's length, so he walks over for it first
  // (sim/mechanics/claim.js; claimsDue takes it when he gets there, with his word when that was all you did).
  const held = p.held;
  if (claims(game, npc, held)) comeFor(game, npc, held, null, offence === 'contraband');

  // Just carrying their thing: he comes for it and that's the end of it (his word when he takes it).
  if (offence === 'contraband') {
    game.events.emit('witness:tattle', withVia({ by: npc.id, reason: 'contraband', heard: false }, cam));
    return;
  }
  // Caught in the act (or at the scene): they shout and point at you (your face: whom they mean). The authority
  // hears it if he's around.
  say(game, npc.id, pointing(cam, offence === 'evidence' ? [r.evidence.icon, '❗', '👉', '@player'] : ['❗', '👉', '@player']), { kind: 'alert', ttl: 1.6 });
  const heard = authorityHears(game, authorityNpc(game), npc);
  game.events.emit('witness:tattle', withVia({ by: npc.id, reason: offence, heard }, cam));
  if (heard) tattleHeard(game, npc.id, offence);
  else if (!s.grudge) s.grudge = { by: npc.id, icon: icon ?? '❗', reason: offence, t: 0 };
}

// He comes for his thing (in your hand, it = null; or the world item `it`, on your desk): he walks over and takes
// it at arm's length (sim/mechanics/claim.js), or now if he is there already. word: he says his piece (the owner's
// `says`) as he takes it.
function comeFor(game, npc, type, it, word) {
  if (!startClaim(game, npc, type, { at: it, word })) takeBack(game, npc, type, it, word);
}

// His owner or confiscator takes it back (sim/take.js), with his word if `word` (the owner's `says`).
function takeBack(game, npc, type, it, word) {
  takesBack(game, npc, type, it);
  if (!word) return;
  for (const line of itemFlags(game, type)?.owner?.says ?? []) {
    if (line.after) npcSayLater(npc, line.after, line.say, line.kind ?? 'speech', line.ttl);
    else say(game, npc.id, line.say, { kind: line.kind ?? 'speech', ttl: line.ttl });
  }
}

// Owners on their way over for their thing (comeFor, sim/mechanics/claim.js): there, and it is still where he
// is going for it (your hand, your desk), he takes it. A catch's claim (a level's startClaim, onCatch): the level
// does the take, on 'claim:done'.
function claimsDue(game) {
  for (const npc of game.npcs) {
    const c = npc._claim;
    if (!c || c.done || !c.started || !claimDue(game, npc)) continue;
    c.done = true;
    if (c.onCatch) {
      game.events.emit('claim:done', { by: npc.id, item: c.item });
      continue;
    }
    takeBack(game, npc, c.item, c.at ?? null, c.word);
  }
}

// For a level hook: the owner knows you're in his private place without seeing you (he's in there with you, about to
// go out) and shows you out now. True if he did (you're in a zone he owns and he minds right now).
export function showOutNow(game, npcId) {
  const s = game.rules;
  const npc = findNpc(game, npcId);
  const entry = npc && rulesOff(game) === null && trespassing(game, npc);
  if (!entry) return false;
  showOutOf(game, s, npc, entry, null);
  return true;
}

// For a level hook: a catch the level decides (the boss you let in sees his own keycard in your hand; a drowned
// typewriter, so loud it needs no witness). why: a string
// the outcome carries (outcome.why: its end scene). False if no catch can land now (rulesOff, canCatch): the day is
// over, someone already caught you, or you are gone or hidden.
export function catchNow(game, reason, by, icons = CAUGHT_ICONS, why = null) {
  if (!canCatch(rulesOff(game))) return false;
  caught(game, reason, by, null, icons);
  if (why) game.caught.why = why;
  return true;
}

// He finds you in his private place: 👉 you 🚪, and you walk back to your desk (player.js showOut). Not a catch and
// not assigned work: it costs you the walk and where you were. Whatever you were doing there stops. Holding his own
// thing (his contraband, or an item he owns), he comes after you for it (comeFor: he follows you out and takes it
// at arm's length), pretend phone call or not; anything else you keep. Nobody but the owner minds: a witness doesn't tell on you for being in the boss's office.
function showOutOf(game, s, npc, entry, cam) {
  const p = game.player;
  cancelAction(game, 'trespass');
  const held = p.held;
  const flags = itemFlags(game, held);
  const his = held && claims(game, npc, held); // his, and he knows it right now (an owner's when)
  if (held && (flags.contraband === npc.id || his)) comeFor(game, npc, held, null, false);
  if (!cam) { // he turns to you while he says it (a stare, as the sim's lookAt, without stopping him), then back
    const dir = Math.atan2(p.y - npc.y, p.x - npc.x);
    npc._stare = { t: SHOW_OUT_STARE, dir, back: npc._stare ? npc._stare.back : npc._faceTarget };
    npc._faceTarget = dir;
  }
  sightline(game, npc.id, 'order', 1.6, screenChain(cam));
  say(game, npc.id, pointing(cam, ['👉', '@player', '🚪']), { kind: 'speech', ttl: 1.8 });
  const id = roles(game).authority?.id;
  if (id) game.suspicion[id] = 0;
  s.seen = {};
  showOut(game, npc.id);
  game.events.emit('trespass', withVia({ by: npc.id, zone: entry.zone }, cam));
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
// (her shout has its beat, then runs to him as a line: he looks at her, then at you, then gives the order; player.js).
// s.stoppedBy: who stopped you this loop (the witness, else the authority), for the outcome. The order stands from
// this step (forced, locked, workAssigned); you walk to your desk inside that time (player.js sendToDesk).
function assignWork(game, reason, by = null) {
  const s = game.rules;
  const p = game.player;
  const id = roles(game).authority.id;
  const boss = findNpc(game, id);
  const here = boss && boss.active;
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
  s.stoppedBy = by ?? id;
  s.stoppedFor = reason;
  s.seen = {};
  s.grudge = null; // you're on your way to your desk: nothing left to tell
  game.events.emit(`${id}:workAssigned`, { reason });
}

// What the mechanics may ask of the rules (src/sim/mechanics/index.js judge).
const JUDGE = { claims, enforcing, comeFor, caught: (game, reason, by, icons) => caught(game, reason, by, null, icons) };

// The catch, the only one: every catch (a reaction, a mechanic's judge, a heard tattle, a level's catchNow) comes here
// and looks the same. His red sightline to you (through the screen, with cam), a spiky alert (CONTRACTS "Bubbles":
// the star means someone has spotted YOU), ❗👉 and your face by default. cam: the camera he saw you through (camVia), if only on a screen: he points at it first. icons: what
// he says instead (a mechanic's own words, e.g. a fetch's `alert`).
function caught(game, reason, by = roles(game).authority.id, cam = null, icons = CAUGHT_ICONS) {
  if (game.caught) return;
  const p = game.player;
  game.caught = { by, reason, t: 0, via: cam ? cam.id : null, minute: game.clock.minute }; // via: the camera he saw you on (end scenes); minute: when (the card's and the HUD's)
  cancelAction(game, 'caught');
  p.locked = true;
  setBusy(game, false, null);
  game.clock.ff = false;
  sightline(game, by, 'caught', 1.6, screenChain(cam));
  say(game, by, pointing(cam, icons), { kind: 'alert' });
  game.events.emit('caught', withVia({ by, reason }, cam));
  shake(game, 0.3, 0.4);
}
