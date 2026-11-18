// Set dressing for level 1, "The 4 PM Meeting" (level.decor): where the renderer puts chairs, wall decor, desk
// clutter and the key legend. Data only (palette colours, no logic); render/world.js and render/hud.js read it.
// Positions are tiles unless noted; facings are 'N', 'S', 'E' or 'W'; colours are [seat, back] pairs.
import { C, OXBLOOD, MUSTARD, TOMATO, TEAL, OLIVE } from '../../render/palette.js';
import { dayCue, TILE } from '../../config.js';
import { emptyBag, fireDoor, balcony, hallPicture } from './painters.js';
import { PICTURE, pictureTilt } from './toys.js';
import { ficus, deadTypewriter, kevPage } from './painters-more.js';
import { findNpc } from '../../game/perception.js';
import { toyState } from '../../sim/mechanics/toy.js';
import { outside, doorSwing } from './balcony.js';

// The fire door (mechanics.js DOORS, balcony.js): locked, someone is shut out there without a card (the boss, or
// you: the reader blinks red); hit, seconds since his last go at it or your last pound; beep, since a card opened
// it (his, or his in your hand); open, how far into its swing it is (balcony.js doorSwing).
const since = (game, at) => (at != null ? game.loopTime - at : null);
const recent = (...ts) => ts.filter((t) => t != null).reduce((a, b) => Math.min(a, b), Infinity);
const fireDoorState = (w, game) => {
  const b = findNpc(game, 'boss');
  const out = !!b && b.override === 'lockedOut';
  const p = game.player;
  const youOut = outside(p) && !p.through && p.held !== 'keycard';
  const hit = recent(out ? since(game, b._bangAt) : null, toyState(game, 'pound').since);
  const beep = recent(b ? since(game, b._badgeAt) : null, since(game, w.fireDoor?.beep));
  return { locked: out || youOut, hit: Number.isFinite(hit) ? hit : null, beep: Number.isFinite(beep) ? beep : null,
    open: doorSwing(game) };
};


export const DECOR = {
  // Static chairs in draw order, at a spot or a tile.
  chairs: [
    { spot: 'boss_desk', face: 'S', color: OXBLOOD },
    { spot: 'player_desk', face: 'N', color: TOMATO },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { x: 13, y: 12, face: 'N', color: MUSTARD },
    { x: 22, y: 12, face: 'N', color: TEAL },
    { spot: 'meeting_head', face: 'E', color: OXBLOOD },
    // meeting table, south side; your seat is the odd one out: red, like your desk chair (and Kev's olive, like his)
    { x: 12, y: 5, face: 'N', color: TEAL },
    { x: 14, y: 5, face: 'N', color: TEAL },
    { spot: 'meeting_kev', face: 'N', color: OLIVE },
    { spot: 'meeting_player', face: 'N', color: TOMATO },
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
        // on from day.beamAt (config.js dayCue; default 5 minutes before the meeting), and for a failed meeting's
        // end beat (you are presenting)
        beam: w.projector === 'ok' && ((game.clock ? game.clock.minute : 0) >= dayCue(game.level.day, 'beamAt')
          || (game.phase === 'end' && game.outcome && game.outcome.result === 'fail')),
      }),
    },
    { tile: 'C', draw: 'carafe', state: (w) => ({ full: w.coffee !== 'taken' }) }, // full until the last cup is taken
    { tile: 'C', draw: emptyBag, state: () => ({}) }, // why it's the last: the coffee bag beside the machine is empty
    // The fire door and the smokers' balcony: the reader blinks red and the door shudders under his fists while
    // he's locked out; butts pile up round the ashtray, one per go at the door.
    { tile: 'X', draw: fireDoor, state: fireDoorState },
    { tile: '=', draw: balcony, state: (w, game) => ({ butts: Math.max(0, (findNpc(game, 'boss')?._bangI ?? 0) - 1) }) },
    // The hallway picture by the kitchen door (toys.js picture_*): crooked or straight, whoever touched it last. It
    // is drawn every frame, so it is a prop, not a painting; R (the restroom door) only anchors it, once on the map.
    { tile: 'R', draw: hallPicture, state: (w, game) => ({ x: PICTURE.x - 0.5, y: PICTURE.y, ...pictureTilt(game) }) },
    { tile: 'K', draw: 'coatRack', state: (w) => ({ coat: w.jacket === 'rack', tag: w.keycard === 'rack' }) },
    // The boss's ficus after the coffee (interactions.js water_ficus): wet soil, a new leaf shooting out.
    { tile: 'Y', draw: ficus, state: (w, game) => ({ watered: w.cup === 'ficus', since: since(game, w._ficusAt) }) },
    // The typewriter on the empty desk, after the cup went into its keys (interactions.js drown_typewriter).
    { tile: 'W', draw: deadTypewriter, state: (w, game) => ({ dead: w.cup === 'typewriter', since: since(game, w._typewriterAt) }) },
    // Kev's screen while he dozes on his keyboard (toys.js kev_doze, every 3 s while asleep): seconds asleep so far.
    { tile: 'C', draw: kevPage, state: (w, game) => {
      const d = toyState(game, 'kev_doze');
      // Asleep while the toy's slump pose lasts (it fires every 3 s and lasts 3.4): his head lies on the desk, 💤.
      const pose = game.toys?.poses.kev;
      const kev = findNpc(game, 'kev');
      const head = pose?.slump && game.loopTime < pose.until && kev ? { x: kev.x * TILE, y: kev.y * TILE - 20 } : null;
      return { secs: d.n > 0 ? (d.n - 1) * 3 + Math.min(d.since, 3) : 0, head };
    } },
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
  // The lift doors (the map's elevator tiles) open as an active NPC comes within 1.6 tiles of this spot.
  elevator: { spot: 'elevator' },
  // Floor zones flooded from one tile in each room (walls, glass and doors stop the flood).
  zoneSeeds: [
    { zone: 'office', x: 4, y: 2 },
    { zone: 'meeting', x: 13, y: 2 },
    { zone: 'kitchen', x: 20, y: 2 },
    { zone: 'lobby', x: 4, y: 14 },
  ],
  // Centre of the key legend (HUD, pause screen), on the bottom wall row (16), clear of the lobby (x1-9) and the
  // balcony (x26-28): the row is about 17 tiles wide.
  legendAt: { x: 17, y: 16.5 },
};
