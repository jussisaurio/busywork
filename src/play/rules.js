// Office rules: witnesses and tattling, contraband, boss suspicion, assigned work, getting caught.
// Runs after updateNpcs, so it sees this step's NPC positions and glances.
//
// Witnesses (Lin, Kev) don't punish you themselves: they shout and point ❗👉. If the boss is on
// the floor he hears it and sends you to your desk. While he's out (restroom, smoke break) the
// shout lands on nobody, but the witness remembers: the moment he's back on the floor she points
// you out (👉 + what she saw) and you go to your desk then. Only a boss locked out for good, or
// the 4:00 meeting, ends the grudge.
// Owners take their things back on sight: Lin her sandwich (only she knows it's hers: to anyone
// else, taking or eating it is just lunch), and Kev the day's only cup of coffee, but only once
// he's been to the pot and found it empty (☕❓😩). Before that, a colleague with a coffee is nothing.
import { SUSPICION_FILL_SEC, SUSPICION_DECAY_SEC, WORK_PENALTY_MIN } from '../config.js';
import { say, burst, shake, sightline } from '../core/fx.js';
import { npcSees, findNpc, inZone } from '../game/perception.js';
import { npcTakes, npcSayLater } from '../sim/npcs.js';
import { cancelAction, dropHeld } from './interactions.js';
import { setBusy, sitAtDesk } from './player.js';

// Module tunables.
export const NOTICE = 0.3; // seconds of continuous sight before a witness reacts
const NOTICE_BUBBLE_GAP = 1.0; // min seconds between ❓ bubbles from the same NPC
const TELL_DELAY = 1.2; // seconds after the boss is back on the floor before a witness tells on you
// What a late tattle points at (the thing the witness saw you at).
const SAW_ICON = { take_keycard: '🪪', take_sandwich: '🥪', eat_sandwich: '🥪', spill_coffee: '📽️', scene: '📽️', evidence: '🥪' };
// Kev, once the projector breaks, blames whoever he sees at the scene: anywhere in the meeting
// room, or within SCENE_RADIUS of its door, the level's sceneDoor (unless you're pretending: just
// someone on a call).
export const SCENE_RADIUS = 3.5;
// Who takes what back (the level's owns), and whether they know it's theirs right now.
function claims(game, npc, item) {
  if (!item || game.level.owns[npc.id] !== item) return false;
  return npc.id !== 'kev' || npc.wants === 'coffee';
}

// Does the boss currently enforce suspicion/contraband?
function bossEnforcing(boss) {
  return !!boss && boss.active && boss.override !== 'lockedOut' && boss.override !== 'meeting';
}

// The boss hears a witness shout if he's on the floor (not away, not outside in the lobby).
function bossHears(game, boss) {
  return bossEnforcing(boss) && !inZone(game, 'outside', boss.x, boss.y);
}

// Kev's projector just broke and the player is where the culprit would be.
function atScene(game, s, npc) {
  const p = game.player;
  if (npc.id !== 'kev' || s.sceneTold) return false;
  if (npc.override !== 'alerted' && npc.override !== 'fixing') return false;
  if (inZone(game, 'meeting_room', p.x, p.y)) return true;
  const door = game.level.sceneDoor;
  return !p.busy && Math.hypot(p.x - door.x, p.y - door.y) <= SCENE_RADIUS;
}

// What this NPC would object to right now, if it saw the player:
// 'action' (doing something sneaky) | 'scene' (Kev: near his broken projector) | 'contraband' | null.
function offenceFor(game, s, npc, boss) {
  const p = game.player;
  if (p.action && p.action.sneaky && (!p.action.owner || p.action.owner === npc.id)) {
    // A locked-out boss is outside banging on the glass: he can't do anything about it.
    if (npc.id === 'boss' && npc.override === 'lockedOut') return null;
    return 'action';
  }
  if (atScene(game, s, npc)) return 'scene';
  // Lin hunting for her sandwich spots the mustard down your sweater. Pretending doesn't hide a stain.
  if (npc.id === 'lin' && npc.override === 'hunting' && p.smeared && !game.world.linKnows) return 'evidence';
  if (p.busy) return null; // phone call / folder stride hides contraband
  if (npc.id === 'boss' && p.held === 'keycard' && bossEnforcing(boss)) return 'contraband';
  if (claims(game, npc, p.held)) return 'contraband';
  return null;
}

export function updateRules(game, dt) {
  if (game.phase !== 'day' || game.caught || game.outcome) return;
  const s = game.rules;
  const p = game.player;

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

  const boss = findNpc(game, 'boss');
  if (game.world.projector === 'ok') s.sceneTold = false; // a fresh breakage is a fresh scene

  // A witness who shouted at an empty office tells the boss once he's back within earshot.
  if (s.grudge) {
    const w = findNpc(game, s.grudge.by);
    if (w && w.active && bossHears(game, boss)) {
      s.grudge.t += dt;
      if (s.grudge.t >= TELL_DELAY) {
        tellLate(game, s, w);
        return;
      }
    } else {
      s.grudge.t = 0;
    }
  }

  // Witnesses (sneaky actions, Kev's crime scene) and contraband.
  for (const npc of game.npcs) {
    const offence = offenceFor(game, s, npc, boss);
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

  // A keycard lying where the boss can see it goes straight back into his pocket.
  if (game.world.keycard === 'dropped' && bossEnforcing(boss)) {
    const card = game.world.items.find((i) => i.type === 'keycard');
    if (card && npcSees(game, boss, card.x, card.y)) {
      game.world.items = game.world.items.filter((i) => i !== card);
      game.world.keycard = 'boss';
      say(game, 'boss', ['🪪', '❗'], { kind: 'speech', voice: boss.voice });
      game.events.emit('keycard:recovered', {});
    }
  }

  // Boss suspicion: he sees you standing around (not busy, not doing anything).
  const slacking = !p.action || p.action.idle; // eating at work is not working
  const idleInView = bossEnforcing(boss) && !p.locked && !p.busy && slacking && npcSees(game, boss, p.x, p.y);
  if (idleInView) {
    if (game.suspicion.boss === 0) game.events.emit('boss:suspicious', {});
    game.suspicion.boss = Math.min(1, game.suspicion.boss + dt / SUSPICION_FILL_SEC);
    if (game.suspicion.boss >= 1) assignWork(game, 'idle');
  } else {
    decaySuspicion(game, dt);
  }
}

function decaySuspicion(game, dt) {
  game.suspicion.boss = Math.max(0, game.suspicion.boss - dt / SUSPICION_DECAY_SEC);
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
  if (npc.id === 'boss') {
    sightline(game, 'boss', 'caught', 1.6);
    caught(game, offence);
    return;
  }
  const p = game.player;
  const what = offence === 'action' ? p.action?.type : offence;
  if (offence === 'action') cancelAction(game, 'witnessed');
  if (offence === 'scene') s.sceneTold = true;
  if (offence === 'evidence') game.world.linKnows = true; // ends her hunt (sim)
  sightline(game, npc.id, 'tattle', 1.2);

  // Owners take their things back, whatever else you were up to.
  const own = game.level.owns[npc.id];
  if (claims(game, npc, p.held)) {
    p.held = null;
    if (own === 'sandwich') {
      // Before lunch she puts it back in the fridge; mid-hunt she has found it, and that's the end of the hunt.
      game.world.sandwich = npc.override === 'hunting' ? 'lin' : 'fridge';
      game.events.emit('sandwich:returned', {});
    } else {
      npcTakes(npc, own);
      game.events.emit('coffee:confiscated', { by: npc.id });
    }
  }

  // Just carrying their thing: they take it and that's the end of it.
  // Lin is cross (😠🥪: her lunch). Kev is a desperate man who has just seen a coffee (🤤☕ … 😌).
  if (offence === 'contraband') {
    if (own === 'coffee') {
      say(game, npc.id, ['🤤', '☕'], { kind: 'speech' });
      npcSayLater(npc, 1.3, ['😌'], 'speech');
    } else {
      say(game, npc.id, ['😠', '🥪'], { kind: 'speech' });
    }
    game.events.emit('witness:tattle', { by: npc.id, reason: offence, heard: false });
    return;
  }
  // Caught in the act (or at the scene): they shout and point. The boss hears it if he's around.
  say(game, npc.id, offence === 'evidence' ? ['🥪', '❗', '👉'] : ['❗', '👉'], { kind: 'alert', ttl: 1.6 });
  const boss = findNpc(game, 'boss');
  const heard = bossHears(game, boss);
  game.events.emit('witness:tattle', { by: npc.id, reason: offence, heard });
  if (heard) assignWork(game, 'tattle');
  else if (!s.grudge) s.grudge = { by: npc.id, icon: SAW_ICON[what] ?? '❗', reason: offence, t: 0 };
}

// The boss is back: the witness points you out, with what she saw.
function tellLate(game, s, w) {
  const g = s.grudge;
  s.grudge = null;
  sightline(game, w.id, 'tattle', 1.4);
  say(game, w.id, ['👉', g.icon], { kind: 'alert', ttl: 1.6 });
  game.events.emit('witness:tattle', { by: w.id, reason: g.reason, heard: true, late: true, icon: g.icon });
  assignWork(game, 'tattle');
}

// The boss sends you back to your desk to type for WORK_PENALTY_MIN game minutes.
function assignWork(game, reason) {
  const s = game.rules;
  const p = game.player;
  const boss = findNpc(game, 'boss');
  // If the boss is off-floor (restroom), the order still lands: show it over the player.
  say(game, boss && boss.active ? 'boss' : 'player', ['📄', '📄', '👉', '🖥️'], { kind: 'speech' });
  cancelAction(game, 'witnessed');
  dropHeld(game); // whatever you carried stays where you stood
  burst(game, 'paper', p.x, p.y, 10, { speed: 1.8 });
  sitAtDesk(game);
  burst(game, 'paper', p.x, p.y, 10, { speed: 1.8 });
  setBusy(game, true, 'typing');
  p.locked = true;
  game.clock.forced = WORK_PENALTY_MIN;
  game.clock.ff = false;
  game.suspicion.boss = 0;
  s.working = true;
  s.seen = {};
  s.grudge = null; // you're at your desk already: nothing left to tell
  game.events.emit('boss:workAssigned', { reason });
}

function caught(game, reason) {
  if (game.caught) return;
  const p = game.player;
  game.caught = { by: 'boss', reason, t: 0 };
  cancelAction(game, 'caught');
  p.locked = true;
  setBusy(game, false, null);
  game.clock.ff = false;
  say(game, 'boss', ['❗', '😠'], { kind: 'alert' });
  game.events.emit('caught', { by: 'boss', reason });
  shake(game, 0.3, 0.4);
}
