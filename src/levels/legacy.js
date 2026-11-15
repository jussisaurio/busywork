// The legacy list: levels that still draw objects in the world as emoji (DESIGN.md "Visual language": people speak
// emoji, the world is drawn). A level on this list keeps drawing as before, but it is not ready for a human
// playtest: tools/gate.mjs fails it (the `drawn` check), and the validator does not hold it to the rules below.
//
// To migrate a level, then delete its id from this list:
//   1. items: give each item a `draw`, the name of an engine thing (src/render/things.js THINGS) or a painter
//      function (ctx, x, y, size, t, game) of the level's. Its `icon` stays: it is what people say about it.
//   2. decor.props: no `draw: 'icon'`. Use a renderer painter (render/world.js PROP_PAINTERS) or the level's own
//      function, and draw the state that decides the outcome on the object (DESIGN.md rule 3).
//   3. poses: an arms rule's `item` is a '#<thing>' (an item type, a decor.things name or an engine thing), never
//      an emoji. Pointing is `arms: 'point'` with no item.
//   4. interactions: no `icon` on a row. The object lights up with the key cap instead.
//   5. end scenes: a scene's draw() draws objects, not emoji; its icons row stays speech.
//   6. Re-record the render goldens (node tools/golden-render.mjs --level <id> --write) and check the sim goldens
//      did not move (node tools/golden.mjs --level <id>).
// The validator (src/levels/validate.js) checks 1 to 4. The runtime check (render/util.js worldEmoji, read by
// tools/golden-render.mjs and tools/gate.mjs) catches any emoji still drawn on the map or in a hand.
// Leaving the list also turns on presentation that legacy levels keep off, so their render goldens stay put: the
// lit target with the E key cap (no focus icon), the pointing hand for tattles, judgement signs placed off people,
// and drawn engine objects (clock, page, muted speaker, restroom sign, no-coffee sticker, plant). Look at the level
// after migrating.
export const LEGACY_LEVELS = ['early-bus', 'interview', 'layoffs', 'audit'];

export const isLegacyLevel = (level) => !!level && LEGACY_LEVELS.includes(level.id);
