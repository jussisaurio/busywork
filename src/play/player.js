// The player: movement with tile collision, the busy button ("pretend" on screen), sitting at the desk, and the
// walk back to it when the authority sends you there (rules.js assignWork -> game.rules.sent).
//
// Runs first in tick(). Reads game.input (any object with the Input interface; null = no input).
// Sets player.{x, y, dir, moving, busy, busyPose, seated} and game.clock.ff.
import { PLAYER_SPEED, PLAYER_BUSY_SPEED, PLAYER_RADIUS } from '../config.js';
import { say, sightline } from '../core/fx.js';
import { spotPos } from '../game/perception.js';
import { findPath, smoothPath } from '../sim/nav.js';

// Sent to your desk (sim seconds since the order; told on: the witness's shout reaches him first).
//   told on:   0 shout -> RELAY he looks at her -> LOOK_YOU at you -> ORDER 📄📄👉🖥️ (the stack lands) -> GO you walk
//   idle:      the order comes at once (he was watching you already) -> GO_IDLE you walk
// The walk is part of the WORK_PENALTY_MIN: clock.forced runs down from the order, so the work ends on the same tick.
const RELAY = 0.3;
const LOOK_YOU = 0.65;
const ORDER = 0.75;
const GO = 1.15;
const GO_IDLE = 0.5;
export const ORDER_ICONS = ['📄', '📄', '👉', '🖥️'];

const NULL_INPUT = { isDown: () => false, pressed: () => false, axis: () => ({ x: 0, y: 0 }) };
export const inputOf = (game) => game.input ?? NULL_INPUT;

// True while the player can't move or act on their own.
export function playerLocked(game) {
  return !!(game.player.locked || game.clock.forced > 0 || game.caught || game.outcome);
}

export function updatePlayer(game, dt) {
  const p = game.player;
  const input = inputOf(game);
  p.moving = false;

  // Forced work: sent to the desk (the walk there), then glued to it, typing, nothing else.
  if (game.clock.forced > 0 && !game.caught && !game.outcome) {
    game.clock.ff = false;
    if (game.rules.sent) serveOrder(game, game.rules.sent, dt);
    else {
      sitAtDesk(game);
      setBusy(game, true, 'typing');
    }
    return;
  }
  // Caught / end beat / externally locked: frozen.
  if (playerLocked(game)) {
    setBusy(game, false, null);
    game.clock.ff = false;
    return;
  }

  const ax = input.axis();
  const wantsMove = ax.x !== 0 || ax.y !== 0;
  // A bulky thing in your arms (level.items[type].bulky: a big pink box) leaves no hand for a folder or a phone:
  // no pretending while you carry it.
  const busyHeld = input.isDown('busy') && !game.level.items?.[p.held]?.bulky;

  if (wantsMove) {
    if (p.seated) standUp(game);
    // Busy stride only when not in an action (movement cancels the action this tick anyway).
    const speed = busyHeld && !p.action ? PLAYER_BUSY_SPEED : PLAYER_SPEED;
    const r = moveWithCollision(game.map, p.x, p.y, ax.x * speed * dt, ax.y * speed * dt, PLAYER_RADIUS);
    p.moving = Math.hypot(r.x - p.x, r.y - p.y) > 1e-6;
    p.x = r.x;
    p.y = r.y;
    p.dir = Math.atan2(ax.y, ax.x);
  }

  // LOOK BUSY. Starting an action drops the pose for the action's duration.
  const busy = busyHeld && !p.action;
  const pose = !busy ? null : p.seated ? 'typing' : wantsMove ? 'folder' : 'phone';
  setBusy(game, busy, pose);

  // Fast-forward while pretending in place: typing at your desk, or a phone call anywhere. Never while walking
  // (×6 movement is uncontrollable) or during an action.
  game.clock.ff = p.busy && p.busyPose !== 'folder' && !p.action;
}

// Set busy state; emits busy:start / busy:end on toggles (pose changes while busy are silent;
// read player.busyPose for those).
export function setBusy(game, busy, pose) {
  const p = game.player;
  if (busy && !p.busy) game.events.emit('busy:start', { pose });
  else if (!busy && p.busy) game.events.emit('busy:end', { pose: p.busyPose });
  p.busy = busy;
  p.busyPose = busy ? pose : null;
}

// Snap to the player's chair. Emits player:sit if not already seated.
export function sitAtDesk(game) {
  const p = game.player;
  const s = spotPos(game, 'player_desk');
  p.x = s.x;
  p.y = s.y;
  p.dir = s.dir;
  p.moving = false;
  if (!p.seated) {
    p.seated = true;
    game.events.emit('player:sit', {});
  }
}

export function standUp(game) {
  const p = game.player;
  if (!p.seated) return;
  p.seated = false;
  game.events.emit('player:stand', {});
}

// --- Sent to your desk --------------------------------------------------------------
// rules.js assignWork: the order stands from now (clock.forced, locked, workAssigned); the rest plays out here.
// by: the witness whose shout brought him (null: he saw you idling himself). auth: the authority's id, null if he's off the floor
// (the order then shows over you at once). game.rules.sent = { t, by, auth, look, said, walk, stackAt }; look: whom
// he faces (render: null, the witness's id, 'player'); stackAt: loopTime the paper stack landed on your desk.
export function sendToDesk(game, by, auth) {
  const sent = { t: 0, by: auth ? by : null, auth, look: by && auth ? null : 'player', said: false, walk: null, stackAt: null };
  game.rules.sent = sent;
  game.player.moving = false;
  if (!sent.by) giveOrder(game, sent);
}

function giveOrder(game, sent) {
  sent.said = true;
  sent.stackAt = game.loopTime;
  say(game, sent.auth ?? 'player', ORDER_ICONS, { kind: 'speech' }); // render drops the paper stack on your desk now
  if (sent.auth) sightline(game, sent.auth, 'order', 1.6); // his order runs to you (render only)
}

function serveOrder(game, sent, dt) {
  setBusy(game, false, null);
  sent.t += dt;
  const told = !!sent.by;
  if (told) sent.look = sent.t < RELAY - 1e-9 ? null : sent.t < LOOK_YOU - 1e-9 ? sent.by : 'player';
  if (!sent.said && sent.t >= ORDER - 1e-9) giveOrder(game, sent);
  if (sent.t < (told ? GO : GO_IDLE) - 1e-9) return; // you stand there and take it
  if (!sent.walk) {
    const walk = planWalk(game, spotPos(game, 'player_desk'));
    sent.walk = walk && walkLength(game, walk) > 1e-6 ? walk : { path: [], wp: 0 }; // there already, or no way there
    if (sent.walk.path.length) standUp(game);
  }
  if (!stepWalk(game, sent.walk, PLAYER_SPEED, dt)) return;
  game.rules.sent = null;
  game.rules.workFrom = game.clock.forced;
  sitAtDesk(game);
  setBusy(game, true, 'typing');
}

// A walk the player is made to take (to her desk, to the front of the room): the path from where she is to `to`
// ({ x, y } tiles), or null if there is none. stepWalk moves her along it; true once she's there.
export function planWalk(game, to) {
  const p = game.player;
  const tiles = findPath(game.map, p, to, 'player');
  if (!tiles) return null;
  const path = smoothPath(game.map, tiles, p.x, p.y, 'player', PLAYER_RADIUS);
  const last = path[path.length - 1];
  if (!last || Math.hypot(last.x - to.x, last.y - to.y) > 1e-6) path.push({ x: to.x, y: to.y });
  return { path, wp: 0 };
}

export function walkLength(game, walk) {
  let { x, y } = game.player;
  let d = 0;
  for (let i = walk.wp; i < walk.path.length; i++) {
    d += Math.hypot(walk.path[i].x - x, walk.path[i].y - y);
    ({ x, y } = walk.path[i]);
  }
  return d;
}

export function stepWalk(game, walk, speed, dt) {
  const p = game.player;
  let budget = speed * dt;
  while (budget > 1e-9 && walk.wp < walk.path.length) {
    const q = walk.path[walk.wp];
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const d = Math.hypot(dx, dy);
    if (d > 1e-6) p.dir = Math.atan2(dy, dx);
    p.moving = true;
    if (d <= budget) {
      p.x = q.x;
      p.y = q.y;
      budget -= d;
      walk.wp++;
    } else {
      p.x += (dx / d) * budget;
      p.y += (dy / d) * budget;
      budget = 0;
    }
  }
  return walk.wp >= walk.path.length;
}

// --- Collision ------------------------------------------------------------------
// Circle (radius r) vs solid tiles. Moves in sub-steps no longer than r/2 (no tunnelling),
// pushing out of overlapped tiles along the contact normal, which slides along walls
// and rounds corners.
function moveWithCollision(map, x, y, dx, dy, r) {
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (r * 0.5)));
  for (let i = 0; i < steps; i++) {
    x += dx / steps;
    y += dy / steps;
    ({ x, y } = resolveCircle(map, x, y, r));
  }
  return { x, y };
}

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const SKIN = 1e-6;

function resolveCircle(map, x, y, r) {
  for (let iter = 0; iter < 4; iter++) {
    let pushed = false;
    const x0 = Math.floor(x - r);
    const x1 = Math.floor(x + r);
    const y0 = Math.floor(y - r);
    const y1 = Math.floor(y + r);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (map.isWalkable(tx, ty, 'player')) continue;
        const cx = clamp(x, tx, tx + 1);
        const cy = clamp(y, ty, ty + 1);
        const ex = x - cx;
        const ey = y - cy;
        const d2 = ex * ex + ey * ey;
        if (d2 >= r * r) continue;
        if (d2 > 1e-12) {
          const d = Math.sqrt(d2);
          const k = (r - d + SKIN) / d;
          x += ex * k;
          y += ey * k;
        } else {
          // Centre inside the tile (only after a teleport): leave by the shallowest side.
          const l = x - tx;
          const rt = tx + 1 - x;
          const u = y - ty;
          const dn = ty + 1 - y;
          const m = Math.min(l, rt, u, dn);
          if (m === l) x = tx - r - SKIN;
          else if (m === rt) x = tx + 1 + r + SKIN;
          else if (m === u) y = ty - r - SKIN;
          else y = ty + 1 + r + SKIN;
        }
        pushed = true;
      }
    }
    if (!pushed) break;
  }
  return { x, y };
}
