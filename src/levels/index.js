// Level registry: id -> level object (shape: src/levels/meeting/index.js). createGame() uses defaultLevel.
import meeting from './meeting/index.js';
import fixtureAttention from './fixture-attention/index.js';

export const levels = { meeting, 'fixture-attention': fixtureAttention };
export const defaultLevel = meeting;

// The level with this id; an unknown id throws an error that lists the registry.
export function getLevel(id) {
  const level = Object.hasOwn(levels, id) ? levels[id] : null;
  if (!level) throw new Error(`unknown level '${id}' (levels: ${Object.keys(levels).join(', ')})`);
  return level;
}
