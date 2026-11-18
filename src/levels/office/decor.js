// Set dressing the office levels share (level.decor fields: meeting/decor.js documents them). The floor plan the
// office maps have in common has its windows, wall clock, kitchen cabinets, lift and zones here; a level that moves
// one of them writes its own.
import { C } from '../../render/palette.js';

export const OFFICE_WINDOWS = Object.freeze([
  { x0: 2, x1: 6, y: 0 }, // office
  { x0: 10, x1: 12, y: 0 }, // meeting room
  { x0: 25, x1: 27, y: 0 }, // kitchen
]);
export const OFFICE_CABINETS = Object.freeze({ x0: 21, x1: 23, y: 0 }); // kitchen upper cabinets over the counter
export const OFFICE_CLOCK = Object.freeze({ x: 17, y: 6 }); // hallway wall clock showing the game time
export const OFFICE_DESK_OWNERS = Object.freeze(['lin_desk', 'kev_desk']); // workstations (decor.desks), both facing N
export const OFFICE_ELEVATOR = Object.freeze({ spot: 'elevator' });
export const OFFICE_ZONE_SEEDS = Object.freeze([
  { zone: 'office', x: 4, y: 2 },
  { zone: 'meeting', x: 13, y: 2 },
  { zone: 'kitchen', x: 20, y: 2 },
  { zone: 'lobby', x: 4, y: 14 },
]);

// One person's workstation clutter (decor.desks[id]): `over` changes what that level does differently (the screen's
// art, no prop because the level draws something else there).
const DESKS = {
  player: { screen: '#f4f1e6', screenArt: 'grid', mug: C.tomato, prop: null },
  kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: 'earbuds' },
  lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: 'plant' },
};
export const officeDesk = (id, over = {}) => ({ ...DESKS[id], ...over });
