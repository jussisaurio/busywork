// Tiny synchronous event bus. Systems subscribe once at boot; events persist across loops.
export function createEvents() {
  const handlers = new Map();
  return {
    on(name, fn) {
      if (!handlers.has(name)) handlers.set(name, new Set());
      handlers.get(name).add(fn);
      return () => handlers.get(name)?.delete(fn);
    },
    emit(name, payload) {
      const set = handlers.get(name);
      if (set) for (const fn of [...set]) fn(payload);
      const any = handlers.get('*');
      if (any) for (const fn of [...any]) fn(name, payload);
    },
  };
}

// A setup that subscribes to a game's events once per game object (events persist across loops, so a clock that
// called `game.events.on` every step would stack handlers). `const listen = oncePerGame((game) => {...})`, then call
// listen(game) as often as you like.
export function oncePerGame(setup) {
  const done = new WeakSet();
  return (game) => {
    if (done.has(game.events)) return;
    done.add(game.events);
    setup(game);
  };
}

// A level's own listeners: subscribed once per game (oncePerGame), and live only while the game's level is the one
// they belong to. The bus outlives a level (a test swaps game.level, a game moves on to the next), so the setup gets
// `on(name, fn)`, which subscribes through the gate `mine(game.level)`, instead of an id check in every handler.
//   const listen = levelListeners((level) => level?.clockFor === clockFor, (game, on) => { on('caught', ...) });
export function levelListeners(mine, setup) {
  return oncePerGame((game) => setup(game, (name, fn) => game.events.on(name, (p) => { if (mine(game.level)) fn(p); })));
}
