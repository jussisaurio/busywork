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

// Ticks per real-time frame: fast-forward while pretending, faster still during forced work.
export function frameMult(game) {
  return (game.clock.forced > 0 ? FORCED_MULT : game.clock.ff ? FF_MULT : 1) * game.debug.speed;
}
