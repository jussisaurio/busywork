// Level registry: id -> level object (shape: src/levels/meeting/index.js). createGame() uses defaultLevel.
import meeting from './meeting/index.js';

export const levels = { meeting };
export const defaultLevel = meeting;
