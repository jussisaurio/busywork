// The simulation step. Shared by the browser main loop and headless harnesses.
import { GAME_MIN_PER_SEC } from '../config.js';
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
  const dm = dt * GAME_MIN_PER_SEC;
  game.clock.minute += dm;
  if (game.clock.forced > 0) game.clock.forced = Math.max(0, game.clock.forced - dm);
  game.loopTime += dt;
}
