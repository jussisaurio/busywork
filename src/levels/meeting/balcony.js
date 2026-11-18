// The fire door, both ways (map.js X, the balcony '=' beyond it). What the boss can do, you can do:
//   inside   push the bar, any time: it swings open, you walk out onto the balcony, and it swings shut behind you
//            (go_out). With the boss out there pounding, the same push lets him in instead (interactions.js
//            let_boss_in: that row comes first).
//   outside  the reader takes only a keycard. With his card in your hand: a beep, the green light, and you're back in
//            (badge_in). Without it you're locked out, and you know it at once: the reader blinks red at you, 🪪❓,
//            and E pounds on the door (toys.js pound). The door is open only while someone comes through it, and
//            a moment after (SLACK): then it is an open doorway. Walk in through it (playerAtDoor), or E at it
//            (follow_in). Coming back from his smoke, the boss holds it for you, and points: in, now 👉🚪; he
//            waits HOLD seconds, and goes in on your heels. While it stands open for you, time runs at ×1 (no
//            fast-forward: a held door that lasts half a second is no offer).
//   with the boss out there
//            not locked out (his smoke): off the clock. Standing about is what the balcony is for (roles.js
//            idleOkIn): he offers you a cigarette (toys.js smoke_offer).
//            and his card in your hand: he sees it 🪪😤, snatches it, badges in, and the door shuts in your face
//            (world.snatched). Locked out with him, he snatches it the moment he sees it, or at the reader.
// At 4:00 (verdict.js): out here with the boss locked out too, the meeting has no one to hold it: a win (why
// 'together'). Alone out here: blamed, the table stares at you through the door's window (why 'balcony'; after
// the snatch, why 'snatched'). End scenes: end-scenes-balcony.js.
//
// The door's swing (world.fireDoor, an object: the behaviour goldens skip it, it is the door's animation):
//   { at, to, open, shut, beep?, heldTo? }  heldTo: until when the boss holds it for you. beep: loop time your card (his) went to the reader. at: loop time it last swung open; to: when it starts to close; open: it is open now
//   (the rows read it: they get no clock). Anyone on the door tile keeps it open (clocks.js calls doorClock).
import { say } from '../../core/fx.js';
import { findNpc, inZone, npcSees } from '../../game/perception.js';
import { endOverride, speak, holdFor } from '../../sim/override.js';
import { npcPockets } from '../../sim/take.js';
import { walkThrough, inputOf, playerLocked } from '../../play/player.js';

const DOOR_TILE = { x: 27, y: 13 };
const OUT = [{ x: 27.5, y: 12.6 }, { x: 27.5, y: 14.1 }, { x: 28.1, y: 14.6 }]; // up to the door, through, aside
const IN = [{ x: 27.5, y: 14.4 }, { x: 27.5, y: 12.5 }];
const HOLD = 5.0; // seconds the boss holds the door for you, back from his smoke
const SLACK = 2.0; // seconds it stays open behind whoever came through, with you out there to use it
const AFTER_YOU = 0.5; // seconds he still stands there once you're through his held door
// The open doorway, from the balcony: this close to the door, in line with it, and walking at it.
const SILL = { x0: 26.85, x1: 28.15, y: 14.75 };
export const outside = (p) => p.y > 13.5; // past the fire door: the balcony is the only outside you can stand on

// ---- The door's swing ----------------------------------------------------------------------------------------
export function openDoor(game, secs) {
  const w = game.world;
  const now = game.loopTime;
  const d = w.fireDoor ?? (w.fireDoor = { at: null, to: -Infinity, open: false, shut: true });
  if (!(d.to >= now)) d.at = now;
  d.to = Math.max(d.to, now + secs);
  d.open = true;
  d.shut = false;
}

// The painter's `open`: seconds into its swing (painters.js fireDoor: opening 0-0.4, wide to 2.4, shut by 2.9).
export function doorSwing(game) {
  const d = game.world.fireDoor;
  if (!d || d.at == null) return null;
  const now = game.loopTime;
  return now <= d.to ? Math.min(now - d.at, 2.0) : 2.4 + (now - d.to);
}

// Every NPC step (clocks.js): whoever is on the door tile holds it open; the clunk once it shuts.
export function doorClock(game, npc) {
  if (npc.active && Math.floor(npc.x) === DOOR_TILE.x && Math.floor(npc.y) === DOOR_TILE.y) {
    // With you out there and no card, it swings shut slowly enough to follow him (not after the snatch: in your face).
    openDoor(game, waitingOutside(game) && !game.world.snatched ? SLACK : 0.5);
  }
  const d = game.world.fireDoor;
  if (!d) return;
  const open = d.to >= game.loopTime;
  if (d.open !== open) d.open = open;
  if (!open && !d.shut && game.loopTime > d.to + 0.5) {
    d.shut = true;
    game.events.emit('fireDoor:shut', {});
  }
}

// Out on the balcony, on your own feet, free to walk.
const waitingOutside = (game) => {
  const p = game.player;
  return outside(p) && !p.through && !playerLocked(game) && inZone(game, 'balcony', p.x, p.y);
};

// Once a tick (clocks.js, the boss's step): the open door is a doorway for you too. Walk at it from the balcony and
// you're through, the same steps as follow_in. And while it stands open for you, no fast-forward.
export function playerAtDoor(game) {
  const d = game.world.fireDoor;
  const p = game.player;
  if (!d?.open || !waitingOutside(game)) return;
  game.clock.ff = false;
  if (p.action) return;
  const ax = inputOf(game).axis();
  if (ax.y < 0 && p.y <= SILL.y && p.x >= SILL.x0 && p.x <= SILL.x1) comeIn(game);
}

function comeIn(game) {
  const d = game.world.fireDoor;
  const boss = findNpc(game, 'boss');
  openDoor(game, 0.9);
  walkThrough(game, IN);
  if (d.heldTo > game.loopTime && boss) { // he was holding it for you: he follows you in
    boss._wait = Math.min(boss._wait, AFTER_YOU);
    d.heldTo = game.loopTime;
  }
  game.events.emit('fireDoor:in', {});
}

// ---- The rows (interactions.js) ------------------------------------------------------------------------------
export const BALCONY_ROWS = {
  go_out: {
    on: 'fire_door', text: 'push the bar and step out', duration: 0.3, sneaky: false,
    can: (p, w) => !outside(p) && !w.bossLockedOut,
    over: ['pound'], // (never both: outside)
    done(game) {
      const p = game.player;
      openDoor(game, 0.9);
      walkThrough(game, OUT);
      if (p.held !== 'keycard') say(game, 'player', ['🪪', '❓'], { kind: 'thought', ttl: 1.8 }); // ...how do I get back in?
      game.events.emit('fireDoor:out', {});
    },
  },
  badge_in: {
    on: 'fire_door', text: 'hold the keycard to the reader', duration: 0.5, sneaky: false,
    hand: 'keycard', can: (p) => outside(p),
    done(game) {
      const boss = findNpc(game, 'boss');
      if (boss?.override === 'lockedOut') { // right behind you: he sees his card at the reader
        snatch(game, boss);
        return;
      }
      openDoor(game, 0.9);
      game.world.fireDoor.beep = game.loopTime; // the green light (decor.js)
      walkThrough(game, IN);
      game.events.emit('fireDoor:badge', {});
    },
  },
  follow_in: {
    on: 'fire_door', text: 'slip in while it\'s open', duration: 0.2, sneaky: false,
    can: (p, w) => outside(p) && !!w.fireDoor?.open,
    over: ['go_out', 'let_boss_in', 'pound'], // while it's open, you slip in; pounding is for a shut door
    done: comeIn,
  },
};

// ---- The boss and you, out there (clocks.js, his step) -------------------------------------------------------
// His card in your hand, out here, where he sees it: he snatches it back.
export function bossOnBalcony(game, boss) {
  const p = game.player;
  if (game.caught || game.outcome || p.through || p.held !== 'keycard' || !boss.active) return;
  if (!inZone(game, 'balcony', p.x, p.y)) return;
  // Out here with you, or in the open doorway on his way out (else the rules see his card first: a catch).
  const near = inZone(game, 'balcony', boss.x, boss.y)
    || (game.world.fireDoor?.open && Math.hypot(boss.x - p.x, boss.y - p.y) < 3.2);
  if (!near || !npcSees(game, boss, p.x, p.y)) return;
  snatch(game, boss);
}

function snatch(game, boss) {
  const w = game.world;
  const p = game.player;
  npcPockets(game, boss, 'keycard');
  w.snatched = true;
  if (boss.override === 'lockedOut') { // his plan comes back: in through the door, with his card
    w.bossLockedOut = false;
    boss._bangLine = null;
    endOverride(boss);
  }
  boss._faceTarget = Math.atan2(p.y - boss.y, p.x - boss.x);
  holdFor(boss, 1.4);
  boss._sayQ.length = 0;
  speak(game, boss, [{ say: ['🪪', '😤'], ttl: 1.5 }]);
  say(game, 'player', ['😨'], { kind: 'thought', ttl: 1.4 });
  game.events.emit('keycard:snatched', {});
}

// His card opened the door (mechanics.js DOORS opens): with you out there, he holds it and points you in (back to
// work), unless he just snatched his card off you; then it shuts in your face.
export function bossBadgedIn(game, boss) {
  const p = game.player;
  if (!inZone(game, 'balcony', p.x, p.y) || p.through) { openDoor(game, 1.0); return; }
  boss._faceTarget = Math.atan2(p.y - boss.y, p.x - boss.x);
  if (game.world.snatched) {
    openDoor(game, 1.0);
    speak(game, boss, [{ say: ['😏'], after: 0.9, ttl: 1.6 }]);
    return;
  }
  openDoor(game, HOLD + 0.4);
  game.world.fireDoor.heldTo = game.loopTime + HOLD;
  holdFor(boss, HOLD);
  speak(game, boss, [{ say: ['👉', '🚪'], after: 0.4, ttl: HOLD - 0.4 }]);
  game.events.emit('fireDoor:held', {});
}

// ---- 4:00 (verdict.js) ---------------------------------------------------------------------------------------
export function balconyVerdict(game) {
  const p = game.player;
  if (!inZone(game, 'balcony', p.x, p.y)) return null;
  const boss = findNpc(game, 'boss');
  if (game.world.bossLockedOut && boss?.override === 'lockedOut') return { result: 'win', why: 'together' };
  const stare = { at: 'player', think: ['🪑', '❓'], say: ['👀', '🚪', '@player'] };
  return { result: 'blamed', why: game.world.snatched ? 'snatched' : 'balcony', stare };
}
