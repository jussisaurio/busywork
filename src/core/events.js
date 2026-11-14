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
