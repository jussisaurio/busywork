// Game state construction. Shape documented in CONTRACTS.md.
import { parseMap } from './core/map.js';
import { createEvents } from './core/events.js';
import { createFx } from './core/fx.js';
import { defaultLevel } from './levels/index.js';
import { spotPos } from './game/perception.js';

export function createGame({ events, input, level = defaultLevel } = {}) {
  const game = {
    events: events ?? createEvents(),
    level,
    map: parseMap(level.map.rows, level.map.legend),
    persist: { loop: 0, routesFoundBy: { [level.id]: [] } },
    phase: 'title',
    settings: { showCones: true, muted: false },
    debug: { speed: 1 },
    time: 0,
    input: input ?? null,
  };
  // persist.routesFound is the current level's list in routesFoundBy (each level keeps its own;
  // a level first played after a switch starts empty).
  Object.defineProperty(game.persist, 'routesFound', {
    get: () => (game.persist.routesFoundBy[game.level.id] ??= []),
    set: (v) => { game.persist.routesFoundBy[game.level.id] = v; },
    enumerable: true,
  });
  resetLoop(game);
  return game;
}

// Rebuild everything that belongs to a single day. NPCs are created by loop.startLoop.
export function resetLoop(game) {
  const desk = spotPos(game, 'player_desk');
  game.fx = createFx();
  game.loopTime = 0;
  game.paused = false; // main.js: Esc / the ⏸ button / losing focus; nothing ticks while true
  game.clock = { minute: 0, ff: false, forced: 0 };
  game.player = {
    id: 'player',
    x: desk.x,
    y: desk.y,
    dir: desk.dir,
    moving: false,
    held: null,
    busy: false,
    busyPose: null,
    seated: true,
    smeared: false, // ate an edible item (play/interactions.js eat_<type>); a role's evidence `mark` may name it
    action: null,
    locked: false,
    focus: null,
  };
  game.npcs = [];
  game.world = game.level.initialWorld();
  const authority = game.level.roles?.authority;
  game.suspicion = authority ? { [authority.id]: 0 } : {}; // the authority's ❓ meter (play/rules.js), keyed by his id
  game.watch = {}; // npc id -> the offence he has in sight; play/rules.js publishes it every step, render reads it
  game.caught = null;
  game.outcome = null;
  game.rules = { seen: {}, lastNotice: {}, working: false, sceneTold: false, grudge: null, worn: null }; // rules.js only: who saw what, the grudge, the disguise worn (disguise.js)
  game.scenario = { beatT: 0, crickets: false }; // scenario.js only: the end beat
}
