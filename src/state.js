// Game state construction. Shape documented in CONTRACTS.md.
import { parseMap } from './core/map.js';
import { createEvents } from './core/events.js';
import { createRng } from './core/rng.js';
import { createFx } from './core/fx.js';
import { MAP, LEGEND } from './data/level.js';
import { SEED } from './config.js';
import { spotPos } from './game/perception.js';

export function createGame({ events, input } = {}) {
  const game = {
    events: events ?? createEvents(),
    map: parseMap(MAP, LEGEND),
    persist: { loop: 0, routesFound: [] },
    phase: 'title',
    settings: { showCones: true, muted: false },
    debug: { speed: 1 },
    time: 0,
    input: input ?? null,
  };
  resetLoop(game);
  return game;
}

// Rebuild everything that belongs to a single day. NPCs are created by loop.startLoop.
export function resetLoop(game) {
  const desk = spotPos('player_desk');
  game.rng = createRng(SEED);
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
    smeared: false, // mustard down your sweater: you ate Lin's sandwich, and it shows
    action: null,
    locked: false,
    focus: null,
  };
  game.npcs = [];
  game.world = {
    projector: 'ok',
    fixProgress: 0,
    keycard: 'rack',
    jacket: 'rack',
    bossLockedOut: false,
    sandwich: 'fridge',
    coffee: 'pot', // 'pot' (one full carafe) | 'taken' (no coffee left today)
    items: [],
    kevGone: false,
    linKnows: false, // hunting Lin saw the mustard on you: hunt over, she knows who did it
  };
  game.suspicion = { boss: 0 };
  game.caught = null;
  game.outcome = null;
  game.rules = { seen: {}, lastNotice: {}, working: false, sceneTold: false, grudge: null }; // rules.js only: who saw what, the grudge
  game.scenario = { beatT: 0, crickets: false }; // scenario.js only: the end beat
}
