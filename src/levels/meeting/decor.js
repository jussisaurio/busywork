// Set dressing for level 1, "The 4 PM Meeting" (level.decor): where the renderer puts chairs, wall decor, desk
// clutter and the key legend. Data only (palette colours, no logic); render/world.js and render/hud.js read it.
// Positions are tiles unless noted; facings are 'N', 'S', 'E' or 'W'; colours are [seat, back] pairs.
import { C } from '../../render/palette.js';

const OXBLOOD = ['#6b2f24', '#4e2019']; // leather
const MUSTARD = ['#d6a23a', '#a97b22'];
const TEAL = ['#2f8f83', '#22675f'];
const OLIVE = ['#5f6b3a', '#47512a'];

export const DECOR = {
  // Static chairs in draw order, at a spot or a tile.
  chairs: [
    { spot: 'boss_desk', face: 'S', color: OXBLOOD },
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { x: 13, y: 12, face: 'N', color: MUSTARD },
    { x: 22, y: 12, face: 'N', color: TEAL },
    { spot: 'meeting_head', face: 'E', color: OXBLOOD },
    // meeting table, south side; your seat is the odd one out: mustard, like your desk chair
    { x: 12, y: 5, face: 'N', color: TEAL },
    { x: 14, y: 5, face: 'N', color: TEAL },
    { x: 15, y: 5, face: 'N', color: TEAL },
    { spot: 'meeting_player', face: 'N', color: MUSTARD },
    // meeting table, north side
    { x: 12, y: 2, face: 'S', color: TEAL },
    { x: 14, y: 2, face: 'S', color: TEAL },
    { x: 15, y: 2, face: 'S', color: TEAL },
    // kitchen table
    { x: 24, y: 4, face: 'N', color: MUSTARD },
    { x: 25, y: 4, face: 'N', color: MUSTARD },
    { x: 26, y: 4, face: 'N', color: MUSTARD },
    { x: 25, y: 2, face: 'S', color: MUSTARD },
  ],
  // Wall decor on the front face of wall row y.
  windows: [
    { x0: 2, x1: 6, y: 0 }, // office
    { x0: 10, x1: 12, y: 0 }, // meeting room
    { x0: 25, x1: 27, y: 0 }, // kitchen
  ],
  paintings: [
    { x: 10, y: 6, variant: 0 },
    { x: 25, y: 6, variant: 1 },
    { x: 2, y: 0, variant: 1 },
  ],
  cabinets: { x0: 21, x1: 23, y: 0 }, // kitchen upper cabinets over the counter
  screen: { x: 15, y: 0, w: 3 }, // projection screen on the meeting room's north wall
  clock: { x: 17, y: 6 }, // hallway wall clock showing the game time
  // Furniture with moving parts, drawn every frame in this order on the first map tile with char `tile`, by the
  // renderer's painter `draw`, showing what state(world, game) returns:
  //   slideProjector  { state: 'ok' | 'broken' | 'fixing', fix: 0..1, beam }  (the beam lights `screen`)
  //   carafe          { full }
  //   coatRack        { coat, tag }  (a jacket on the rack; a badge clipped to it)
  //   icon            { icon, size? }  (any level: one emoji on the tile, 18 px by default)
  props: [
    {
      tile: 'J',
      draw: 'slideProjector',
      state: (w, game) => ({
        state: w.projector || 'ok',
        fix: w.fixProgress || 0,
        // on from day.beamAt, and for a failed meeting's end beat (you are presenting)
        beam: w.projector === 'ok' && ((game.clock ? game.clock.minute : 0) >= game.level.day.beamAt
          || (game.phase === 'end' && game.outcome && game.outcome.result === 'fail')),
      }),
    },
    { tile: 'C', draw: 'carafe', state: (w) => ({ full: w.coffee !== 'taken' }) }, // full until the one cup is taken
    { tile: 'K', draw: 'coatRack', state: (w) => ({ coat: w.jacket === 'rack', tag: w.keycard === 'rack' }) },
  ],
  // Meeting table notepads by tile column; the north ones get a water glass.
  notepads: { north: [12, 14, 15], south: [12, 13, 14, 15] },
  // Workstations whose sitter's spot is <owner>_desk (personal screen, mug and prop). The spot's face points at
  // the desk and turns the workstation to it; here both sit south of their desks, facing N.
  deskOwners: ['lin_desk', 'kev_desk'],
  // Per-owner workstation clutter ('player' is the desk with the P tile); other workstations get the
  // renderer's default (dark screen, mustard mug, a sheet of paper). screenArt: 'code' | 'grid' | 'blankSlide';
  // prop: 'plant' | 'earbuds' | 'paper' | null.
  desks: {
    player: { screen: '#f4f1e6', screenArt: 'blankSlide', mug: C.tomato, prop: null },
    kev: { screen: '#1f3d2a', screenArt: 'code', mug: C.olive, prop: 'earbuds' },
    lin: { screen: '#cfe2ee', screenArt: 'grid', mug: C.teal, prop: 'plant' },
  },
  // Lobby ashtray, on the tile east of this spot.
  ashtray: { spot: 'smoke' },
  // The lift doors (the map's elevator tiles) open as an active NPC comes within 1.6 tiles of this spot.
  elevator: { spot: 'elevator' },
  // Floor zones flooded from one tile in each room (walls, glass and doors stop the flood).
  zoneSeeds: [
    { zone: 'office', x: 4, y: 2 },
    { zone: 'meeting', x: 13, y: 2 },
    { zone: 'kitchen', x: 20, y: 2 },
    { zone: 'lobby', x: 4, y: 14 },
  ],
  // Centre of the key legend (HUD), on the blank wall block under the open office, east of the lobby
  // (map rows 14-16).
  legendAt: { x: 20, y: 15.5 },
};
