// Level registry: id -> level object (shape: src/levels/meeting/index.js). createGame() uses defaultLevel.
// Every level is validated here, once, as the registry builds (validate.js): a broken level throws at load.
import meeting from './meeting/index.js';
import fixture from './fixture/index.js';
import fixtureAttention from './fixture-attention/index.js';
import fixturePutdown from './fixture-putdown/index.js';
import fixtureInspection from './fixture-inspection/index.js';
import earlyBus from './early-bus/index.js';
import interview from './interview/index.js';
import discreetPackaging from './discreet-packaging/index.js';
import layoffs from './layoffs/index.js';
import secondThoughts from './second-thoughts/index.js';
import audit from './audit/index.js';
import weekendShift from './weekend-shift/index.js';
import { validateLevel } from './validate.js';

export const levels = {
  meeting,
  fixture, // test level: a level is one folder
  'fixture-attention': fixtureAttention, // test level: attention
  'fixture-putdown': fixturePutdown, // test level: put down
  'fixture-inspection': fixtureInspection, // test level: inspection
  'early-bus': earlyBus, // your bus leaves at 4:30, before the boss (was office-time)
  interview, // Lin's phone interview for your job (was hold-music)
  'discreet-packaging': discreetPackaging, // Discreet Packaging: the camera (was monitor)
  layoffs, // The Layoff List: disguise
  'second-thoughts': secondThoughts, // your angry resignation letter (was lights-out)
  audit, // The Audit: one laptop counted twice
  'weekend-shift': weekendShift, // "make a glance": the noises
};
for (const [key, level] of Object.entries(levels)) validateLevel(level, key);
export const defaultLevel = meeting;

// The level with this id; an unknown id throws an error that lists the registry.
export function getLevel(id) {
  const level = Object.hasOwn(levels, id) ? levels[id] : null;
  if (!level) throw new Error(`unknown level '${id}' (levels: ${Object.keys(levels).join(', ')})`);
  return level;
}
