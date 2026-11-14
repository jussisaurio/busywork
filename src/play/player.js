// The player: movement with tile collision, the busy button ("pretend" on screen), sitting at the desk.
//
// Runs first in tick(). Reads game.input (any object with the Input interface; null = no input).
// Sets player.{x, y, dir, moving, busy, busyPose, seated} and game.clock.ff.
import { PLAYER_SPEED, PLAYER_BUSY_SPEED, PLAYER_RADIUS } from '../config.js';
import { spotPos } from '../game/perception.js';

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

  // Forced work: glued to the desk, typing, nothing else.
  if (game.clock.forced > 0 && !game.caught && !game.outcome) {
    sitAtDesk(game);
    setBusy(game, true, 'typing');
    game.clock.ff = false;
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
  const busyHeld = input.isDown('busy');

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
  game.clock.ff = p.busy && p.busyPose !== 'folder' && !p.action && !(game.clock.forced > 0);
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
  const s = spotPos('player_desk');
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

// --- Collision ------------------------------------------------------------------
// Circle (radius r) vs solid tiles. Moves in sub-steps no longer than r/2 (no tunnelling),
// pushing out of overlapped tiles along the contact normal, which slides along walls
// and rounds corners.
export function moveWithCollision(map, x, y, dx, dy, r) {
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

export function resolveCircle(map, x, y, r) {
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
