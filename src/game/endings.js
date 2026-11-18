// The endings shelf's memory: every distinct ending the player has seen, per level, kept across browser sessions.
// game.persist.endingsBy[levelId] = [{ key, o }] in the order found; o is the outcome trimmed to what an end scene
// reads ({ result, routes, why, stopped }), so the shelf can draw it again on the title card of a later session.
// game.persist.endingNew: the key of the ending the current end card found (it stamps in), else null; not saved.
//
// The key is decided by the end card (render/screens.js endingKey): the scene the card draws, plus outcome.why.
// Nothing here is read by the sim. Storage is localStorage, every access in try/catch: without it (node tools, a
// private window, blocked site data) the shelf remembers only this session, and the game is otherwise the same.
const STORE = 'busywork.endings.v1';

const storage = () => {
  try {
    return globalThis.window?.localStorage ?? null;
  } catch {
    return null;
  }
};

// The current level's list (created empty).
export function endingsOf(game) {
  const by = (game.persist.endingsBy ??= {});
  return (by[game.level.id] ??= []);
}

const trim = (o) => {
  const t = { result: o.result, routes: Array.isArray(o.routes) ? [...o.routes] : [] };
  if (o.why !== undefined) t.why = o.why;
  if (o.stopped) t.stopped = { ...o.stopped };
  return t;
};

// The end card shows `o`, the ending `key`: remember it. Returns true when it is new.
export function noteEnding(game, key, o) {
  const list = endingsOf(game);
  const fresh = !list.some((e) => e.key === key);
  game.persist.endingNew = fresh ? key : null;
  if (fresh) {
    list.push({ key, o: trim(o) });
    saveEndings(game);
  }
  return fresh;
}

// Reads what earlier sessions found into game.persist.endingsBy (browser only; main.js). Bad data is dropped.
export function loadEndings(game) {
  const by = (game.persist.endingsBy ??= {});
  try {
    const raw = storage()?.getItem(STORE);
    const data = raw ? JSON.parse(raw) : null;
    if (!data || typeof data !== 'object') return;
    for (const [id, list] of Object.entries(data)) {
      if (!Array.isArray(list)) continue;
      const ok = list.filter((e) => e && typeof e.key === 'string' && e.o && typeof e.o === 'object');
      const have = (by[id] ??= []);
      for (const e of ok) if (!have.some((h) => h.key === e.key)) have.push({ key: e.key, o: trim(e.o) });
    }
  } catch {
    // no storage, or unreadable: start empty
  }
}

export function saveEndings(game) {
  try {
    storage()?.setItem(STORE, JSON.stringify(game.persist.endingsBy ?? {}));
  } catch {
    // full, blocked or absent: this session still remembers
  }
}
