// The simulation step. Shared by the browser main loop and headless harnesses.
import { GAME_MIN_PER_SEC, FF_MULT, FORCED_MULT } from '../config.js';
import { resetLoop } from '../state.js';
import { createNpcs, updateNpcs } from '../sim/npcs.js';
import { updatePlayer } from '../play/player.js';
import { updateInteractions } from '../play/interactions.js';
import { updateRules } from '../play/rules.js';
import { updateScenario } from '../play/scenario.js';

export function startLoop(game) {
  resetLoop(game);
  game.npcs = createNpcs(game);
  game.persist.loop += 1;
  game.phase = 'day';
  game.events.emit('loop:start', { loop: game.persist.loop });
}

export function tick(game, dt) {
  if (game.phase !== 'day') return;
  updatePlayer(game, dt);
  updateInteractions(game, dt);
  updateNpcs(game, dt);
  updateRules(game, dt);
  updateScenario(game, dt);
  advanceClock(game, dt);
}

// The last part of every tick: game time, forced work running down, loop time.
export function advanceClock(game, dt) {
  const dm = dt * GAME_MIN_PER_SEC;
  game.clock.minute += dm;
  if (game.clock.forced > 0) game.clock.forced = Math.max(0, game.clock.forced - dm);
  game.loopTime += dt;
}

// Ticks per real-time frame: fast-forward while pretending, faster still during forced work at the desk (not
// while you walk there: game.rules.sent).
export function frameMult(game) {
  const typing = game.clock.forced > 0 && !game.rules?.sent;
  return (typing ? FORCED_MULT : game.clock.ff ? FF_MULT : 1) * game.debug.speed;
}

// One real-time frame of the day (main.js and the harness): frameMult(game) ticks, fewer if the day ends or forced
// work runs out meanwhile. Forced work ends on a frame's last tick, so what follows (work:done, the end beat) starts
// on a fresh frame at its own speed.
export function runFrame(game, dt) {
  const mult = frameMult(game);
  const forced = game.clock.forced > 0;
  for (let i = 0; i < mult && game.phase === 'day'; i++) {
    tick(game, dt);
    if (forced && !(game.clock.forced > 0)) break;
  }
}
