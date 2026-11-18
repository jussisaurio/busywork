# CONTRACTS: how the modules fit together

DESIGN.md says what the game is. This file says the shapes everyone relies on. Most of it is
the level object, field by field. To build a level, start with `src/levels/README.md`; come back here for a field.
Level 1's own story (cast, routes, jokes) is in `src/levels/meeting/LEVEL.md`.

## Determinism traps (read these first)
The game is deterministic. The golden files digest every event and the state after every command, so a small
change in order changes the digest. These are the usual ways to break it:
- **Cast order is behaviour.** NPCs update, witness and emit events in `level.cast` order, and the snapshot
  lists them in that order. Don't reorder a cast once its goldens are recorded.
- **Per-NPC rng.** Each NPC's rng is `createRng((SEED ^ fnv1a(id)) >>> 0)`. A glance draws from it at every
  expiry, shown or not. Keep the draw order and the `range(...glanceEvery)` call.
- **Plan keys are exact strings.** When the key changes, the NPC re-plans. Schedule: `e<i>`, plus `+<hook>` for
  each prelude still pending (when a `pending()` flips, the plan is rebuilt). Lure, hunt and inspection:
  `<plan>#<seq>`. The meeting: `<meeting.override>#<seq>`. A door: its bare `plan`. Gone for the day: `'gone'`.
- **Never add engine fields to `world`.** `world` is the level's own (`initialWorld()`), and every digest
  includes it. An engine field there changes level 1's goldens. Put engine state on `game` or on the NPC
  (a leading underscore).
- **Event names and payloads are digested.** Rename nothing once recorded.
- **Tick order:** `updatePlayer → updateInteractions → updateNpcs → updateRules → updateScenario → advanceClock`.
  Mechanics run in check order: lures, hunts, doors, spot owners (put down), inspections, fetches, each list in
  level order.
- **The harness paths with BFS.** A* would change every path.
- **No wall-clock time, no `Math.random` in gameplay.** No `Date`, no `performance.now`. Only `input.js` reads
  real time (press expiry). `Math.random` is for visual-only things (particles, wobble).
- **Schedules are sorted by `at`.** The sim takes the latest entry whose time has passed.

## Conventions
- Vanilla JS ES modules, no dependencies, no build step. Serve with `node tools/serve.mjs` (port 8642, caching off, so a plain reload runs the files on disk).
  Node 22 runs the headless tests (`node tools/test-*.mjs`). Before handing work back run `node tools/check.mjs`:
  every test, the routes and both goldens for every level, in parallel.
- **No DOM access at module import time.** Only `createInput(window)`, `createRenderer(canvas)`, `createAudio()` and
  `src/main.js` may touch browser APIs, and only inside functions. Everything else must import cleanly in node.
- Units: positions are floats in **tile units**. Tile (x,y) covers [x,x+1)×[y,y+1); its centre is (x+0.5, y+0.5).
  Angles are radians: 0 = east, π/2 = south (canvas convention). `dt` is **real seconds per sim step** (1/60).
  Game time is `game.clock.minute`, minutes since the level's `day.start`.
  Write a time with config.js `at()`. `at('3:10')` counts from 2:30 PM (`DAY_START`). A day that starts at
  another time passes its start, and writes times after noon in 24-hour form: `at('9:30', START)`,
  `at('13:15', START)`.
- **Engine code names no level.** Every `src/` file outside `src/levels/` reads level things from `game.level`.
  `node tools/test-engine-clean.mjs` fails on a level-1 name in engine code.
- **Engine code is shared by every level.** An engine change must keep every level's tests and goldens green, or
  re-record them deliberately and say why. Private fields on entities start with an underscore (`npc._path`).
  Put module-local tunables at the top of the file.
- Keep code readable, commented where non-obvious, and prototype-quality (no over-engineering).

## Engine modules
- `src/config.js`: shared tunables (clock, speeds, reach, action times, vision, glances, suspicion, the witness's
  `NOTICE` and `DOUBLE_TAKE`), `SEED`,
  `DAY_START`, `at()`, `formatClock()`, `clockArg()`, `dayCue()`, `DAY_CUES`, `deg()`.
- `src/core/map.js`: `parseMap(rows, legend)` returns `{ w, h, rows, defs, char(x,y), tile(x,y), isSolid, isOpaque,
  isWalkable(x,y,who), interactables[], find(c) }`. `isWalkable(x,y,'npc')` also passes `npcPassable` tiles.
- `src/core/vision.js`: `canSee(map, viewer, tx, ty)`, `inCone`, `hasLineOfSight`, `angleDiff`, `DIRS`.
- `src/core/fx.js`: `say(game, owner, icons, {kind, ttl, voice})`, `burst(game, kind, x, y, n, opts)`, `shake(game, amount, t)`,
  `sightline(game, from, kind='notice', ttl=0.8, via, to='player')` (a dashed line from an NPC to the player, or to
  the NPC `to`: 'notice' ❓ | 'tattle' ❗👉 | 'caught' | 'relay', a witness's shout reaching the authority |
  'order', his order to your desk), `ripple(game, x, y, radius, opts)` (a burst at the source, rings out to
  `radius`; ttl default `max(1, radius / 12)` s), `turned(game, id, from, x, y, ttl)` (a head swung from `from` to a
  noise: render draws the arc).
  **Use `say()` for every speech, thought or alert bubble.** It also emits `'say'` for audio. Without a `voice`
  it uses the owner's id as the voice name.
  **Bubbles: one shape per meaning.** Engine and levels use the same vocabulary:
  | kind | shape | means | engine examples |
  |---|---|---|---|
  | `speech` | box with tail | said aloud | owners' words, orders |
  | `thought` | cloud | private, routine, a doubt | notice: `[what, '❓']` (what he saw you at: the act's `saw`, the scene's or evidence's icon, the item in your hand; else your face) |
  | `alert` | spiky star | someone has spotted YOU, never anything else | tattle `❗👉@player`, caught `❗👉@player` (a fetch's `alert` replaces it) |
  | `realize` | round, pale blue, rays | "oh!": a belief changes, a trick works; no alarm | early-bus Kev and the boss reading a pushed clock `[clock, '😮']` |
  | `sign` | board on a post | a thing's verdict, not a person's | inspection ✔️❌ |
  Seen on a screen, the bubble starts with the screen: `['📺', what, '❓']` noticed on it, `['📺', '❗', '👉',
  '@player']` caught on it. A bare `['📺', '❓']` (no subject) is free for a level's "the screen went odd" (static).
  Anger (😠) is an emotion a level may say; the engine never uses it for a catch.
  A clock emoji (🕐..🕧) in a bubble draws as the wall clock (`things.js` `drawClock`) at that time, a bit larger.
- `src/core/rng.js`: `createRng(seed)` returns `{ next, range, int, pick, chance }`.
- `src/core/events.js`: `game.events.on(name, fn)` (`'*'` gets every event) and `game.events.emit(name, payload)`.
- `src/levels/index.js`: the registry `levels`, `defaultLevel` (level 1, `meeting`) and `getLevel(id)` (throws on an
  unknown id and lists the registry). It validates every level as it loads (`src/levels/validate.js`, see "Errors").
- `src/game/perception.js`: `viewerOf(npc)`, `npcSees(game, npc, x, y)`, `witnesses(game, x, y)`, `spotPos(game, name)`
  (throws on an unknown spot), `inZone(game, name, x, y)` (false for an unknown zone), `findNpc(game, id)`.
- `src/state.js`: `createGame({ events, input, level })` and `resetLoop(game)`. They build the state below.
- `src/game/loop.js`: `startLoop(game)`, `tick(game, dt)`, `advanceClock`, `frameMult`, `runFrame(game, dt)` (one
  real-time frame: `frameMult` ticks, ending early when the day or the forced work ends). The sim step order; the
  harness uses it too.
- `src/sim/override.js`: override plumbing shared by the sim, its mechanics and level hooks (`setOverride`,
  `endOverride`, `holdFor`, `speak`, `applyEffect`, `spotLeg`).
- `src/sim/mechanics/*`: the generic NPC mechanics (lure, hunt, door, put down, inspection, attention). Each file's
  header documents its level data in full. `index.js` lists the kinds and their hooks.

## The level object
A level is one folder, `src/levels/<id>/`, whose `index.js` default-exports one object. Engine code reads it as
`game.level` and never imports level files. The folder name must equal `id`: the tools find the goldens at
`src/levels/<id>/golden.json` and `golden-render.json`, and the route checks at `route-checks.js` (see Tools).
Every level but the fixtures also has `premise.md`, `shots.js` and `cold-read.md`, for its cold reads
(`docs/COLD-READ.md`). `premise.md` holds, besides the card, the situation, the cast and the ways to win and lose, two
prose sections the narrow text passes read: `## Who does what` (each person's afternoon and why) and `## Things in
the office` (each prop and why it is there). Register the level with one line in `src/levels/index.js`.

Examples used below:
- `fixture`: `src/levels/fixture/` ("Happy Birthday to Nobody"): one room, an authority, an owner, one lure.
- `fixture-inspection`: the smallest working level, in one file.
- `fixture-putdown`, `fixture-attention`: one mechanic each, in one file.
- `meeting`: level 1 (`src/levels/meeting/`). Each of its files documents its fields in a header comment.

### Fields at a glance
| Field | Needed | Read by | Example |
|---|---|---|---|
| `id` | yes | registry, tools | every level |
| `title` | yes | render (title card) | `fixture/presentation.js` `TITLE` |
| `map: { rows, legend }` | yes | `core/map.js`, render | fixture `MAP`, `LEGEND` |
| `spots` | yes | everything | fixture `SPOTS` |
| `zones` | yes | rules, scenario, mechanics | fixture `ZONES` |
| `patrols` | for `patrol` entries and hunts | sim | meeting `map.js` `ROUTES` |
| `cast` | yes | sim, rules, render | `fixture/cast.js` |
| `day` | yes | sim, scenario, HUD, audio, tools | fixture `day` |
| `meeting` | yes | sim, scenario | fixture `meeting` |
| `routes`, `outcomeOrder` | yes | scenario, HUD, tools | fixture `routes` |
| `initialWorld()` | yes | `state.js` | fixture `initialWorld` |
| `interactions` | yes (`{}` is fine) | `play/interactions.js` | fixture `INTERACTIONS` |
| `items` | no | interactions, rules, render | fixture `ITEMS` |
| `roles` | no | rules | fixture `ROLES` |
| `lures`, `hunts`, `doors`, `inspections`, `fetches` | no | `sim/mechanics/*` | fixture `LURES`, meeting `mechanics.js`, fixture-inspection, discreet-packaging `FETCHES` |
| `noises` | no | `mechanics/attention.js` | (none yet) |
| `behaviours` | if the cast names a hook | sim | `fixture/cast.js` `BEHAVIOURS` |
| `failSign` | no | scenario | meeting `index.js` |
| `decor`, `looks`, `poses`, `cones`, `endScenes` | no | render | `fixture/presentation.js` |
| `sounds`, `voices` | no | audio | `meeting/sounds.js`, `office/voices.js` |
| `harness` | no | `src/agent/harness.js` | `fixture/harness.js` |
| `gate` | for fuzz, gate and golden | `tools/fuzz.mjs`, `tools/golden-render.mjs` | `fixture/gate.js` |

"Needed" means the level fails to load without it (or, for `gate`, the tools fail). The validator checks the
whole object at load: see "Errors" below.

### Map and legend
- `map.rows`: equal-length strings, one char per tile. A row of the wrong length, or a char the legend lacks, is a
  load error. There is no camera: the screen shows 30×17 tiles (`render/util.js` `PLAY_W`, `PLAY_H`). A smaller
  map draws in the top-left corner; a larger one is cut off.
- `map.legend`: `{ [char]: { kind, solid, opaque, interactable?, npcPassable?, draw? } }`, merged over the base
  legend: `#` wall, `G` glass, `.` floor, `:` outside, `D` door, `T` desk, `H` plant. `solid` blocks walking,
  `opaque` blocks sight, `npcPassable` lets NPCs (not the player) through a solid tile. `interactable: '<type>'`
  makes each tile of that char an interactable of that type (ids `<type>`, or `<type>_0`, `<type>_1`, ... when the
  char repeats). `draw` is what the tile looks like (below); without it, the renderer uses `kind`.
- The generic `sit` row targets the interactable type `own_desk`. A level without one never lets you sit back down.
- Example: fixture `LEGEND` (calendar, microwave, cake stand, `own_desk`, and `F` with `draw: 'refrigerator'`).

The renderer draws a tile as its legend `draw`, else its `kind`. The draws are `render/world.js` `TILE_DRAWS`:
`wall`, `glass`, `entrance` (a glass door), `door`, `restroom` (a wall with a restroom door), `elevator` (a wall with
lift doors), `floor`, `outside` (lobby floor), `desk`, `own_desk`, `meeting_table`, `coffee_machine`, `plant`,
`coat_rack`, `refrigerator`. The base letters' kinds are draws already. A `draw` not in the list is a load error.
Any other kind draws only floor. To show something there, add a `decor.props` entry with a painter (fixture: `B`,
`M`, `W`, drawn in `fixture/painters.js`).
- Desk tiles (`desk`, `own_desk`, `meeting_table`, `coffee_machine`) that touch make one piece. A piece with
  `own_desk` is your desk, with `meeting_table` the meeting table, with `coffee_machine` the kitchen counter.
  Any other piece is drawn by the floor zone at its top-left tile: `kitchen` a kitchen table, `office` an
  executive desk, anything else a work desk. Floor zones are the names in `decor.zoneSeeds`, not `level.zones`.
- A piece faces the `decor.deskOwners` spot that faces into it (your desk: `player_desk`). A piece with no such
  spot is drawn for a sitter south of it (face `'N'`). Each `deskOwners` spot must face a desk tile.
- The lift doors open as an active NPC comes within 1.6 tiles of `decor.elevator.spot`.

### Spots and zones
- `spots`: `{ [name]: { x, y, face, accepts?, owner?, found? } }`. Whole tile coords, on the map, on a tile an NPC
  can stand on; `face` is `'N'|'E'|'S'|'W'`. `spotPos(game, name)` gives the tile centre and the facing angle.
  `accepts`, `owner` and `found` make a put-down spot (see Mechanics).
- Spots the engine needs: `player_desk` (you start there, and `sit` and assigned work snap you there), each
  cast member's `meetingSpot`, `meeting.chair`, `meeting.presenter`, and every spot a schedule entry, mechanic,
  `noises` entry, `failSign` or `decor` names. An unknown one is a load error. A spot a hook names in its own code
  throws only when the hook runs.
- `zones`: `{ [name]: { x0, y0, x1, y1 } }`, half-open (`x0 <= x < x1`, `y0 <= y < y1`), in tile units, inside the
  map. A zone the level data names but `zones` lacks is a load error.
- `patrols`: `{ [name]: [[x, y], ...] }`, tile points walked in order (a `patrol` entry, a hunt's `route`).
- Example: fixture `SPOTS` and `ZONES`; meeting `map.js` has all three.

### Cast and schedule entries
- `cast`: a list, and **its order is behaviour** (see the traps). Each entry:
  `{ id, icon, color, voice?, meetingSpot, meetingArrive?, vision?, glanceEvery?, coneTint?, schedule }`.
  - `vision`: `{ fov, radius }` (default config `VISION_DEFAULT`). `glanceEvery`: `[min, max]` real seconds between
    seated glances (default `GLANCE_EVERY`; `[9999, 9999]` never glances, as in fixture-attention).
  - `coneTint`: `[r, g, b]` of the drawn cone; one in the red-to-orange band is drawn amber (red is reserved for
    a cone that sees you: `render/cones.js` `coneTint`). `voice`: a name in `level.voices` or the engine's.
  - `meetingArrive`: a hook run when he sits down at the meeting.
- `schedule`: entries sorted by `at` (a game minute; write `at('2:45')`). Each runs until the next starts.

| `do` | Fields | Meaning |
|---|---|---|
| `sit` | `spot` | walk there, face `spot.face`, sit (seated glances) |
| `visit` | `spot` | walk there, face it, stand |
| `patrol` | `route` | walk `patrols[route]` in order, stand at the end |
| `away` | `spot` | walk there and vanish until the next entry; reappear there |
| `leave` | `spot`, `gone?` | walk there and vanish for the day; `gone: { set?, event? }` applies then |
| `say` | `icons`, `kind` | a bubble, once; does not change what he is doing |

- Any moving entry may add `prelude` (a hook name or a list), `arrive` (a hook name) and `anim` (copied to
  `npc.anim` for render). See "Behaviours".
- The first entry with a `spot` is where he starts. A vanished NPC's `say` entries are dropped, not delayed.
- Example: `fixture/cast.js` (Gus goes `away` for candles, then `arrive: 'checkCake'`).

### Day and meeting frame
- `day`: game minutes, except `start`.
  - `start`: the minute of the day the clock starts at (`14 * 60 + 30` is 2:30 PM). The HUD, the wall clock, the
    end card and the tools show times from it. Write the other times with `at(hhmm, start)`.
  - `gatherAt` (at most `meetingAt`): every NPC still on the floor gets the meeting override and walks to his
    `meetingSpot` (event `meeting:gather`). The gather skips an NPC gone for the day, and one whose mechanic keeps
    him (a lure job, a door, an inspection). Those still go when the mechanic ends, except a door. A hunt is
    interrupted. Away NPCs are included.
  - `meetingAt`: the outcome (`play/scenario.js`): no route achieved is `'fail'`; a route and you in zone
    `meeting.room` is `'win'`; a route and you elsewhere is `'blamed'`. A catch before this ends the day `'caught'`.
  - Cosmetic cues, all optional. Each defaults to `meetingAt` or a few minutes before (config.js `dayCue`):
    `clockRedAt` (HUD clock turns red; −5), `clockTickAt` (wall clock starts ticking; with `clockRedAt`),
    `tockAt` (tick-tock; −2), `halfMinuteAt` (a tick every half minute; −1), `beamAt` (the projector beam in
    level 1's `decor.js`; −5), `deadlineAt` (the time on the `'#clock'` face of the mission panel and the title
    screen; `meetingAt`). Read a cue with `dayCue(day, name)`, not `day[name]`. Once the outcome is set the HUD
    clock shows its minute, as the end card does.
- `meeting`: `{ override, room, chair, presenter? }`. `override` is the NPCs' override name at the meeting;
  `room` the zone you must be in at `meetingAt`; `chair` the spot the room stares at when you are blamed;
  `presenter` the spot a failed meeting puts you at (none: the fail plays where you stand). The event `meeting:gather` and the cancel reason `'meeting'`
  are engine words, the same in every level. `where?`: names, in order, of zones or of places you go inside
  (`player.inside`, `play/player.js goInside`); the first one you are in at `meetingAt` is `outcome.where` and the
  verdict's `where`, for an end scene that depends on where you were (meeting: the restroom). Inside, you come out.
- Leaving the day (`play/scenario.js leaveDay(game, why, path)`): a level's way out, at any time. You walk `path`,
  you are gone (`player.hidden`), and after a beat the day ends: `fail`, `outcome.why = why`. Events `player:leave`,
  `player:gone`. Going inside (`goInside(game, name, at)`, `comeOut(game)`): hidden, not moving, the rules see
  nothing; pretending still fast-forwards. Events `player:in`, `player:out`. Through a door the map calls solid
  (`play/player.js walkThrough(game, path)`): you walk `path` straight, at a walk, no collision, and can't act
  until you're through (`player.through`).
- `failSign`: `{ spot, offset: [dx, dy] }`, where a failed meeting's 🦗 sign appears (offset in tiles from the
  spot's corner). Absent: no sign.
- `routes`: `[{ id, icon, achieved(world) }]` in route-slot order (HUD, title, end card). `achieved` is checked at
  `meetingAt`.
- `outcomeOrder`: the order `outcome.routes` lists achieved routes in. It lists every route id exactly once, and
  no other id.
- `initialWorld()`: a fresh `world` for each loop. Must include `items: []` (floor items). Every other field is
  the level's own.
- Example: fixture `day`, `meeting`, `routes`, `outcomeOrder`, `initialWorld`.

### Interactions and items
- `interactions`: the player's actions, `{ [verb]: row }` (`{}` for none). The engine appends `eat_<type>` for each
  edible item, then `sit`, `drop`, `pick_up` and `put`. A level row of the same verb replaces the engine's. For one
  target the first row whose `can` holds wins; the nearest target wins; `'self'` rows apply only when nothing else
  does.
- Of the `'self'` rows, a tap of E does the first possible one without `hold` (a level's own, else `drop`). Holding
  E for `HOLD_TIME` (0.35 s) while standing still does the first possible `hold: true` row (`eat_<type>`); moving
  starts the hold over. So eating never takes the drop key. With no tap row (an item with `keep`), a tap eats.

| Row field | Meaning |
|---|---|
| `on` | what offers it: an interactable type on the map, `'self'` (what you hold), `'item'` (a floor item), `'spot'` (a put-down spot) |
| `preview` | `'self'` rows (required): the player's arm pose (`render/characters.js` `ARM_POSES`) while it is what E would do, and while doing it. `drop` holds the arm out over the floor (`'holdout'`), eating lifts the item to the mouth (`'lift'`), drinking lifts it and tips it at the lips (`'sip'`). `'facepalm'` puts the free hand flat over the face (dismay; usable by NPC `poses` too). The validator refuses a `'self'` row without one |
| `hold` | `'self'` rows: `true` = holding E does it, a tap does the others |
| `text` | the harness's words for it. A player sees the target light up with the E key cap |
| `duration` | real seconds; `instant: true` instead does it at once (never seen in progress) |
| `sneaky` | witnesses matter while it runs |
| `owner` | only this cast id minds (to anyone else it's harmless) |
| `idle` | the authority reads it as slacking (his ❓ fills) |
| `saw` | the icon a witness's late 👉 shows for it |
| `noise` | `{ radius, at?, npcs? }`: a noise when done (see Attention) |
| `can(p, w, item)` | offered while true; a running action is cancelled `'invalid'` when it turns false |
| `done(game, a)` | the result, right after `action:done`; `a` has `x, y` (the target) and `item` |

- `items`: `{ [type]: { icon, draw, tint?, place?, edible?, contraband?, contrabandIn?, pockets?, owner?, keep?, bulky? } }`.
  - `icon` (required): the emoji people say for it, in bubbles (😠🥪).
  - `draw` (required): how it is drawn on the floor, in a hand, in the HUD's held slot
    and in a pose: an engine thing's name (`render/things.js` `THINGS`) or the level's painter. See Things below.
  - `tint`: a colour, or `'owner'` (the owner's `look.body`; needs an `owner`). The painter gets it as `opts.tint`.
  - `place`: the `world` field that says where it is: `'player'` held, `'dropped'`, `'eaten'`, a spot name, or a
    cast id.
  - `edible`: `{ leaves }` (required, no default): the engine offers `eat_<type>` (a hold row; sneaky to its owner;
    `idle`; event `<type>:eaten`). `leaves`: what eating leaves on you, a `config.js` `MARKS` name (the renderer
    paints its colours on the player's front, the harness says its `words`) stored in `player.smeared`, or `null`
    for nothing. The validator refuses an edible item that doesn't say. `icon` (default `😋`): the row's and your
    thought's face, e.g. `🤢` for a letter. `burst` (default `'crumbs'`): an `fx.burst` kind, e.g. `'paper'`.
  - `contraband`: the cast id who catches you holding it (if he is the authority: caught) and goes for it if he
    sees it on the floor while on duty (an implicit fetch, `fetch.js`): a double take (`[icon, '❗']`, realize),
    he walks over, picks it up (`world[place]` = his id, `<type>:recovered {by, type, from}`), holds it up a beat
    (`npc.pocketing`) and pockets it with a face (`pockets`: lines, default a huff `😤`), then back to his day.
    Taken from under his nose on the way: he stops, `[icon, '❓']`, looks round. Needs a `place`. `contrabandIn` (a zone): in your hand he knows it
    only while you are in that zone (an envelope is anyone's envelope away from his desk).
  - `owner`: `{ id, when?(npc), says?, reclaim?(game, npc) }`. He takes it back on sight while `when` holds.
    `says`: his lines on catching you carrying it (lines as in Mechanics). `reclaim`: what taking it back does,
    instead of the default (he carries it, `<type>:recovered {by, type, from}`); the hook emits its own events. On
    the floor: if he sees it (while `when` holds) he walks over and picks it up, an implicit fetch. A level fetch
    naming that item and npc replaces it.
  - Taking back (`sim/take.js` `takesBack`, the one take for every owner and confiscator): he always walks over
    first and takes it at arm's length, from your hand, your desk, the floor, or as he shows you out of his office
    (`claim.js`; the floor is `fetch.js`). With no path to it he waits, turned to it; he never takes it from across
    the room. An owner's `reclaim` replaces the take; a confiscator pockets it (`world[place]` = his id); anyone
    else carries it. Event `<type>:recovered {by, type, from}`, `from`: `'player'`, `'floor'`, or the spot name.
    Any other NPC take (a level's own beat) is `npcTakes(game, npc, type, item?)`, and the player's hand is
    `playerHolds` / `playerLetsGo` (they keep `world[place]` in step).
  - `bulky`: it fills your arms: no pretending (the busy button does nothing) while you hold it, so you can't
    hide it behind a folder or a phone call.
- Example: fixture `INTERACTIONS` and `ITEMS` (the cake is edible and Gus owns it); meeting `items.js`.

**Things** (DESIGN.md "Visual language": the world is drawn). A thing is an object drawn in the world by a painter
`(ctx, x, y, size, t, game, opts)`: centred on (x, y), about `size` px tall, shapes only (`box(ctx, x, y, size)` from
`render/things.js` sets up a 16-unit box). `opts`: `{ held, tint, type }`: `held` in a hand, `tint` the item's colour
or null, `type` the item type or null. A name resolves to `items[name].draw`, then `decor.things[name]`, then the
engine's `THINGS[name]` (cup, mug, card, wrench, cigarette, paper, note, laptop, clipboard, plant, clock, muted). A
thing shows up:
- as an item: on the floor, in your hand, in the HUD's held slot, carried by the person who took it;
- in a pose: `poses.arms[i].item: '#<name>'`;
- in an end scene: `drawThing(ctx, game, name, x, y, size, held)` (false if nothing draws it);
- as the glyph `'#<name>'` anywhere `render/util.js` `emoji()` draws (bubbles too, but people speak emoji).
An emoji a painter or a scene draws in the world is recorded by the runtime check (`render/util.js` `worldEmoji`).

### Roles
`roles` says who plays which part in the office rules (`play/rules.js`). Every cast member who is not the
authority is a witness: he shouts and points ❗👉 at a sneaky action he sees.
- `authority`: `{ id, offDuty?, helpless?, deafIn?, earshot?, idleOkIn? }`. `idleOkIn`: a zone where he doesn't
  count you standing about (a break spot: meeting's balcony). His sighting of a sneaky action, or of his contraband in
  your hands, means caught. He owns the suspicion meter (`game.suspicion[id]`) and assigns work. `offDuty`: his
  overrides during which he enforces nothing. `helpless`: overrides during which he can't act even on what he
  sees. `deafIn`: a zone where he can't hear a shout (or a noise). `earshot`: tiles; he hears a shout only from that close (default: the whole floor). Out of earshot the witness keeps a grudge and tells him when he comes near. `tattle`: what a tattle he hears costs:
  `'work'` (default: he sends you to your desk), `'caught'` (reason: the witness's), or a hook
  `(game, { by, reason })` (he walks over and checks, say). The witness's shout runs to him first in every case
  (a `'relay'` line). `roles` and `authority` are optional. Without an authority nobody assigns work and only an
  inspection can catch you.
- `evidence`: `{ by, while, mark, knows, icon }`. A player field (`mark`) that pretending doesn't hide. The witness
  `by`, in override `while` (one value, or a list), reads it as guilt; telling sets `world[knows]`. Reason `'evidence'`.
- `scene`: `{ by, while, zone, door, radius?, fresh(world), icon }`. While `by` is in one of the `while`
  overrides (a list), he blames whoever he sees in `zone`, or within `radius` (default 3.5) of the point `door`
  (`{ x, y }`) unless pretending. Once per scene; `fresh(world)` holding makes the next one fresh. Reason `'scene'`.
- `private`: `[{ zone, owner, offDuty? }]`. `zone` is the owner's own place. If the owner (active; the authority only
  while enforcing and not helpless; not in an `offDuty` override) sees you in it for 0.6 s, pretending or not, he
  shows you out: 🤨 `@player`, then 👉 `@player` 🚪, and you walk to `player_desk` (`rules.out`, locked). He takes
  back a held item that is his (contraband, or owned while his `when` holds). Ranked below the other offences; not caught, no tattle.
  Reason `'trespass'`. A level hook can trigger it without sight: `showOutNow(game, npcId)` (play/rules.js).
- Example: fixture `ROLES` (authority only); meeting `roles.js` (all three, plus `private`).

### Mechanics
A mechanic is data that gives one NPC a scripted moment. Each acts **only on the NPCs its data names**
(`npc`, or the list `npcs`); attention is the exception. Each file in `src/sim/mechanics/` documents its fields
in full. Lines in level data are `{ say: icons, kind?, ttl?, after? }`: `after` delays the line by that many
seconds, and `kind` and `ttl` apply to a delayed line too. Effects are `{ set?: { field: value },
event? }`: fields go into `world` first, then the event fires with `{}`.

**Lure** (`level.lures`, `lure.js`): a world condition pulls one NPC to a spot to deal with it.
`{ npc, when(world), override, plan, label, spot, react: { wait, says?, event? }, work: { override, minutes,
progress, start: { set?, event?, says? }, done: { set?, event?, says? } } }`. He gives up if a field `start.set`
set changes. It takes over from any override but another lure's, the meeting included; the gather lets him
finish. Example: fixture `LURES` (the smoke
alarm), meeting `LURES` (Kev and the projector).

**Hunt** (`level.hunts`, `hunt.js`): an NPC walks a patrol back and forth, looking around at each point, until
she finds it or gives up. `{ npc, override, plan, label, route, look: { angle, time }, start: { event?, says?,
wait? }, until?, found(game, npc), end: { says? } }`. Only a hook starts it (`sim.startHunt`); `startHunt` throws
if the level has no hunt for that NPC. The gather interrupts it. Example: meeting `HUNTS`.

**Door** (`level.doors`, `door.js`): listed NPCs coming in from `zone` must open it, or they are shut out for the
day, knocking. `{ spot, zone, npcs, opens(game, npc), override, plan, label, locked: { set?, event? }, bang:
{ first, lines: [{ say, next }], event?, shake?: [amount, t] } }`. Whether the tile blocks walking or sight is the
legend's (`npcPassable`, `opaque`). Example: meeting `DOORS` (the boss without his keycard).

**Put down** (spot fields, `putdown.js`): the player sets what she holds on a spot that `accepts` it, one item at
a time. It lies on the tile the spot faces, as `{ type, x, y, spot }` in `world.items` (`itemOn(spots, name,
type)` builds one for `initialWorld`), and `world[place]` becomes the spot's name. `owner: 'player'`: the rules
judge it as if you held it, even while you pretend. `owner: <cast id>`: he reacts once to each item he sees
there within 2 tiles: `found: 'take'` (default) or a hook name, run as `arrive(game, npc, sim, { type, spot,
item })`. No owner: nobody minds. `shown: { dx, dy }` (tiles): draw what lies there that far off where it lies,
render only (meeting: the cup beside the coffee machine, on the counter). `lies: { dx, dy }` (whole tiles): it
really lies that far off the faced tile, for reach and sight too, and the harness `put` stands that far along (meeting:
a desk's free end, so the computer in front of the chair is a target of its own). Events `item:put {type, spot}`, `item:found {type, spot, by}`. Example:
fixture-putdown (`player_desk` is yours, `box` is the boss's with `found: 'readNote'`).

**Inspection** (`level.inspections`, `inspection.js`): from minute `at` one NPC walks an ordered list of checks.
`{ npc, at, override, plan, label, look?, checks, pass?, fail? }`. A check is `{ item, spot, from? }` or
`{ who, zone, from }` (`who`: `'player'` or a cast id). Each is judged when he gets there: ✔️ or ❌, then he stands
`look` s (default 1). All ✔️: `pass: { set?, event?, says? }`. The first ❌ ends it: `fail: { set?, event?, says?,
then? }`, with `then` one of `'caught'` (reason `'inspection'`, by him), `'stare'`, `'hunt'`, a hook name
(`arrive(game, npc, sim, { index })`), or none. He starts only when on the floor with no override; never after
the gather; once a loop. A lure drops it; the gather lets him finish. Example: fixture-inspection.

**Fetch** (`level.fetches`, `fetch.js`): whoever sees a certain item lying loose on the floor walks over and
picks it up. `{ item, npcs, override, plan, label, react: { wait, says?, event? }, found: { says?, event?, set? },
caught?, reason?, alert? }`. He goes for it when on the floor with no override but the meeting's, on seeing it with his
own eyes or on a screen he watches; he gives up if it is gone before he gets there. On pickup he carries it
(`world[place]` = his id if the item has a place), then `found`. With `caught`, the rules catch the player
`caught` s later (reason `reason`, default `'found'`, by him; he says `alert`, a list of icons, in the alert star
instead of the rules' `❗👉@player`). `npc._fetch = { t }` while he holds it; an owner's
`reclaim` may set it to start the same clock. Example: discreet-packaging `FETCHES` (the pink parcel).

**Attention** (`attention.js`): a noise turns heads. Two sources: an interaction row's `noise: { radius, at?,
npcs? }` (at `at`, else where the action was aimed), and `level.noises: { [event]: { at, radius, npcs? } }`
(whenever that event fires; not `noise` or `npc:heard`). `at` is a spot, or a point `{ x, y }` in tile units
anywhere on the map, a desk or a wall too (a phone rings from the phone). Everyone within `radius` (straight line; walls don't
stop sound), active and not gone, faces it for 1.5 s; a second noise retargets him. `npcs` limits who hears it.
`ripple` (true or `ripple()` opts) draws it; at a spot named after a machine (an interactable whose type or id is
`at`, within 1.6 tiles) the rings start on the machine (`makeNoise`'s `from`). Every head it turns shows the swing
(`fx.turned`), ripple or not.
The authority hears nothing in his `deafIn` zone. With no override he turns his body and waits; in any
override only his head turns and his plan goes on. Glances due meanwhile still draw from the rng. Events
`noise {x, y, radius}`, then `npc:heard {id}` per listener in cast order. Example: fixture-attention (the printer).

**Toy** (`level.toys`, `toy.js`): a prop with a cosmetic reaction, for a laugh that changes nothing. `{ id, at,
on, npcs?, radius?, sees?, when?, every?, state?, text?, line?, react, try }`. `at`: a spot or a tile `{x, y}`.
`on`: `'press'` (E next to it; it takes E focus only when no route target or held item has it), `'pass'` (an NPC
in `npcs` walks within `radius`, default 2) or `'near'` (an NPC in `npcs` within `radius` of you, `sees` to need
sight). `when(world, state, game, npc)` reads only. `every`: seconds between firings per person (default 1 for
press, 3 otherwise). `react: { say, sfx, pose: { arms, angry, face, for }, set, burst }`: a bubble (`say: [icons]`
or `{ icons, kind, ttl, who: 'by' | 'prop' | id }`), an `SFX` sound at the prop, a pose for `for` s (default 1.5),
`set` merged into the toy's own state, `add` (`{ key: n }`) added to it, `reset` (toy ids) puts those toys' state back to the start (with a `stand` walk, `toyState` shows the old state until he arrives), a burst at the prop. Toy state lives in `game.toys`, never in `world`;
painters read `toyState(game, id)` (`{ ...state, n, by, since }`, `since` null until it fires). Event
`toy:<id> {id, by, x, y}`. `text`/`line`: the harness's focus text and event line (`<by>` = who). `try`: harness
commands after which it has fired. The behaviour golden skips toy events and toy bubbles, so adding a toy moves
no behaviour golden; the gate's `toys` check plays `try` and needs the firing frame to draw differently, and
`toy-neutral` replays every winning golden plan with every toy fired over and over and needs the same trace.
`stand` (pass / near, optional, `{ x, y }`): where a person stands to do it. He is drawn walking over, doing the
pose there and hurrying back along his real track (`game/toy-walk.js`); the sim body walks on, so it stays
neutral. Only when he is on his feet, in no override and within 3.5 tiles of it; cut at once by a sightline from
him, a notice, an override or 7 s.
Example: meeting `toys.js` (the fire door's bar).

### Behaviours (hooks) and the sim API
`behaviours`: `{ [name]: { spot?, pending?(npc), arrive(game, npc, sim, extra?) } }`, small level-only scripts
the cast and the mechanics name.
- A schedule entry's `prelude`: a leg to the hook's `spot` before the entry's own, while `pending(npc)` holds
  (absent: always). A prelude to the entry's own spot replaces its leg. `arrive` runs on reaching it.
- A schedule entry's `arrive`: runs on reaching the entry's spot. A cast member's `meetingArrive`: runs on
  sitting down at the meeting.
- A put-down spot's `found` and an inspection's `fail.then` may name a hook; it gets the `extra` argument.
- `sim` (the sim's `HOOK_API`): `holdFor(npc, s)`, `speak(game, npc, lines)`, `want(npc, item)` (he knows it's his
  and daydreams of it), `faceSpot(game, npc, spot)`, `startHunt(game, npc)`.
- A hook keeps its state on the NPC with a leading underscore (`npc._checked`); a new loop builds new NPCs.
- A hook name the level lacks is a load error.
- Example: `fixture/cast.js` `BEHAVIOURS`; meeting `behaviours.js` (preludes with `pending`).

### Presentation
Render and audio read these; the sim never does. All optional except `title`.
- `title` (required): `{ mission: [line1, line2], badge: [icon, overlay] }`, the typed mission lines and the emoji
  under 🕓. Example: `fixture/presentation.js` `TITLE`.
- `decor`: set dressing (`chairs`, `windows`, `paintings`, `clock`, `screen`, `props`, `desks`, `deskOwners`,
  `zoneSeeds`, `elevator`, `legendAt` (where the pause screen shows the keys), ...), documented in `meeting/decor.js`. `props: [{ tile, draw,
  state(world, game) }]` draws on the first tile whose map letter is `tile` (the letter, not a draw or kind name);
  `draw` is a `render/world.js` `PROP_PAINTERS` name or the level's painter `(ctx, info, at, shown, t)` in map
  pixels (`at`: the tile; `shown`: what `state` returned). Draw the state that decides the outcome on the object.
  `things: { [name]: painter | thing name }`
  names things that are no item (Things, above). Example: fixture `DECOR` and `fixture/painters.js`.
- `looks`: `{ [id]: look }` per person and `player` (fields in `office/looks.js`); anyone without one gets a
  generic look in his `color`.
- `poses`: `{ arms: [{ when(npc, world, game), arms, item?, angry?, crank? }], marks: [{ when, angry?, badge?,
  jacket? }] }`. The first `arms` rule that holds wins; every `marks` rule that holds applies. `item` is the
  `'#<thing>'` in the hand; `arms: 'point'` with no item points with the bare hand, as does
  anyone telling on you or catching you.
- `cones`: `{ alert: [override] }`: overrides during which a cone glows red. A cone also glows while its NPC sees
  something the rules react to (`game.watch`) and when he catches you; the authority's also while his suspicion
  is above 0. Every cone is drawn as plainly as the authority's; its edge firms up while he has you in sight.
- A seated NPC with no `arms` pose types (keystroke ticks, silent, no paper flurry) unless he is in an override,
  on a schedule `anim`, `heeding` a noise or a stare, or glancing 0.3 rad or more aside.
- `endScenes`: `{ kindOf(outcome), scenes: { [kind]: { win, icons, draw(ctx, game, t, e, outcome) } } }`.
  `kindOf` must map every outcome to a scene. Absent: `render/screens.js` `DEFAULT_END_SCENES`, a plain scene per
  result. `draw` paints a scene: people, furniture and things (`drawThing`, the level's painters), never an emoji
  object; speech bubbles in it are fine. `icons` is the punchline row, in speech. Example: fixture `END_SCENES`.
- `sounds`: what actions, events, signs, drops and repeats sound like (`meeting/sounds.js`). Absent: engine sounds
  only.
- `voices`: `{ [name]: params }` (fields: `audio/babble.js` `VOICES`), added to the engine's `player` and `generic`.
  An unknown name speaks with `generic`. Some engine bubbles pass no voice and use the speaker's id as the name,
  so name each voice after its cast id.

### Harness and gate data
- `harness` (`src/agent/harness.js`; fields in `meeting/harness.js`): `mission`, `landmarks` (extra `goto` names
  → spot names), `stops: { hard, soft }` (level events that end a command early), `names`, `mapKey`, and text
  hooks `outcomeText(o)`, `playerText(game)`, `statusText(game)`, `npcText(game, n)`, `worldText(game)`,
  `describe(event, memo)` (a line; `null` for silence; `undefined` for the harness's own text). All optional.
  `sit` runs `goto my_seat`. `my_seat` is built in (`validate.js` `ENGINE_LANDMARKS`: your `player_desk`).
  Example: `fixture/harness.js`.
  The harness's own line for `meeting:gather` is "everyone gathers for the meeting". A level names the place in
  `describe` (level 1: "everyone heads to the meeting room"; the fixture: "everyone gathers round the cake").
  The harness's ASCII map prints the map letters as written. It marks floor someone sees (`*`) only on `.`, `:`
  and `D`, and its default key names only the base letters. Explain your own letters in `mapKey`.
- `gate` (`tools/fuzz.mjs` `levelData`; fields in `meeting/gate.js`). The fuzzer throws without it.
  - `mustUse`: lessons a win must use: `{ id, cmd }` (a command that ran contains the word) or `{ id, event }`.
  - `targets`: `goto` targets for fuzz plans; `interactable`: the ones a plan may `interact` at. Order is
    behaviour (the fuzzer's rng picks by index).
  - `milestones`: `{ [event]: (payload) => name | null }`; `binKeys`: milestones that define an outcome bin;
    `keyActions`: milestones whose time span the report lists.
  - `goldenPlans`: hand-written harness plans for the golden corpus (raw movement, several loops).
  - `renderEvents`: events `tools/golden-render.mjs` also draws at (and 20 frames after), besides the engine's
    own (`caught`, `work:done`, `item:drop`, `item:pickup`, `witness:tattle`, `meeting:gather`, `day:end`,
    `loop:start`, `player:sit`). List the level's visible beats. Nothing adds the templated events
    (`<authority>:workAssigned`, `<type>:eaten`, `<type>:recovered`): list them by hand.
  - A level with put-down spots also gets `put <spot>` fuzz steps.
  The engine adds milestones for its own events (`tools/fuzz.mjs` `ENGINE_MILESTONES`): `noise` → `'noise'`,
  `npc:heard` → `'heard:<id>'`, `item:put` → `'put@<spot>'`, `inspect:pass` / `inspect:fail` → `'tick<i>'` /
  `'cross<i>'`, `inspect:done` → `'inspected'` or `'flunked'`, `inspect:moved` → `'moved'`. Only `'noise'` is a
  bin key; add the others to `binKeys` to bin on them. A level's own milestone for the same event wins.
- Example: `fixture/gate.js`.

### Goldens
`src/levels/<id>/golden.json` and `golden-render.json` are written by the tools, never by hand. `golden.json` holds
one plan per outcome the fuzzer found, plus `gate.goldenPlans`, and a digest of every event and of the state after
each command. `golden-render.json` digests drawn frames. A new level records them once (see
`src/levels/README.md`); after that, re-record only for an intended change, and say so in the commit.

### Errors
`src/levels/index.js` runs `validateLevel(level, key)` (`src/levels/validate.js`) on every registered level at
load. A broken level throws one error, `level '<key>' is broken:`, with one line per problem, each starting with
the field path (`cast[1] (kev).meetingSpot: no spot 'x'`). The header of `validate.js` lists every rule: required
fields and shapes, and every spot, zone, patrol, cast id, item type, hook, voice, tile draw and prop painter the
data names. `node tools/test-levels.mjs` checks every registered level, and a set of broken ones.

The validator checks names and shapes, not play. These still surface late:
- Mid-day: a bad name inside a hook's own code (`spotPos` throws on an unknown spot); `startHunt` from a hook
  when the level has no hunt for that NPC; a rule function (`can`, `achieved`, `when`) that throws.
- Never: a misspelt optional field (the validator skips fields it doesn't know); a route no plan can win. Run
  the gate: it plays thousands of days. Run `tools/routes.mjs`: it plays your scripted wins.

## Game state (`game`)
```js
game = {
  // --- persistent (survive loops) ---
  events,                     // event bus
  level,                      // the level object (createGame({ level }); default: the registry's defaultLevel)
                              // the browser picks it with ?level=<id>; an unknown id shows getLevel's error
  map,                        // parsed map
  persist: { loop: 0, routesFoundBy: { [level.id]: [] } },   // found route ids per level
  // persist.routesFound: accessor for routesFoundBy[game.level.id] (read, push or assign; created empty on first read)
  // persist.endingsBy: { [level.id]: [{ key, o }] }, the endings shelf (game/endings.js, render/shelf.js): each distinct
  //   ending seen, in the order found; key = the end scene's kind, plus ':' + outcome.why when there is one
  //   (screens.js endScene). Noted by main.js when a day ends (not by the renderer), kept in localStorage
  //   ('busywork.endings.v1', try/catch: without it, this session only). persist.endingNew: the key the current end
  //   card found (it stamps in), else null. The sim never reads either.
  phase: 'title',             // 'title' | 'day' | 'end'
  settings: { showCones: true, muted: false },
  debug: { speed: 1 },        // integer sim multiplier ([ and ] keys)
  time: 0,                    // real seconds since boot (animation clock for render/audio)
  input,                      // set by main.js (see Input)

  // --- per loop (rebuilt by resetLoop) ---
  fx: { bubbles, particles, shake, lines, ripples, turns },   // lines: [{ from: npcId, to: 'player' | npcId, kind, age, ttl, via? }]
  loopTime: 0,                // real (sim) seconds since loop start
  paused: false,              // main.js only: nothing ticks while true
  clock: { minute: 0, ff: false, forced: 0 },
      // minute: game minutes since level.day.start.
      // ff: true while fast-forwarding (pretending in place at the desk). Set by player.js.
      // forced: game minutes of assigned work left. Set by rules.js; advanceClock decrements it.
  player: {
    id: 'player', x, y, dir,
    moving: false,            // moved this step
    held: null,               // null | an item type (level.items)
    busy: false,              // pretend button held (and allowed)
    busyPose: null,           // null | 'typing' | 'folder' | 'phone'
    seated: true,             // at own desk (snapped to spot player_desk)
    smeared: false,           // false | the MARKS name eating left on you; a role's evidence `mark` can name it
    action: null,             // null | { type, targetId, t, duration, sneaky, owner, idle, x, y, item }
    locked: false,            // can't move or act (forced work, caught, end beat)
    focus: null,              // null | { kind: 'interactable'|'item'|'self'|'spot', id, x, y, icon, action, item }
                              //   'self' adds preview, hold (the verb holding E does), holdPreview
    hold: null,               // null | { verb, t }: E down on a 'self' focus with a hold verb (decided on release / HOLD_TIME)
  },
  npcs: [],                   // createNpcs(game), in cast order. See NPC shape.
  world: {                    // level.initialWorld(): the level's own fields, plus
    items: [],                // floor items: { type, x, y, spot? } (spot: lying on a put-down spot)
  },
  suspicion: { [authorityId]: 0 },   // 0..1; {} without an authority
  watch: {},                  // { [npcId]: 'action'|'scene'|'evidence'|'contraband'|'trespass' }: what each NPC sees that the
                              // rules react to, after each step (rules.js; render/cones.js reads it). Empty while
                              // caught, after the outcome and during assigned work.
  caught: null,               // null | { by, reason: 'action'|'scene'|'evidence'|'contraband'|'inspection'|
                              //   a fetch's reason, t, via, minute, why? } (via: the camera id he saw you on, or null;
                              //   why: a level catch's reason (rules.js catchNow), copied to outcome.why;
                              //   minute: the clock when caught. The outcome's minute, so card and HUD agree)
  outcome: null,              // null | { result: 'win'|'fail'|'caught'|'blamed', routes, newRoutes, loop, minute, stopped? }
                              //   stopped: { by, reason, working } on a lost day you were sent to your desk (by: who
                              //   told, else the authority; working: still at it). End card: screens.js STOPPED_SCENE.
  rules: { seen, lastNotice, working, sceneTold, grudge, worn, sent, out, workFrom, stackAt, stoppedBy, stoppedFor },
      // out: null | { t, by, walk }: shown out of a private zone, walking back to your desk (player.js).
      // sent: null | { t, by, auth, look, said, walk }: sent to your desk and not there yet (look: whom the
      //   authority faces, null | witness id | 'player').
      // workFrom: clock.forced when you sat down (the stack's full height); stackAt: loopTime it landed (you sat).
  scenario: { beatT, crickets, walk, arrivedAt, endAt },      // private to scenario.js (the end beat; walk: where it
                                                              // makes you go, to the front or your desk)
}
```

## NPC shape (created and owned by the sim; everyone else reads it)
```js
{
  id, icon, color, voice, meetingSpot,   // copied from the cast entry
  x, y, dir,                 // dir = body facing (radians)
  glance: { offset: 0 },     // extra head angle (added to dir for vision and head drawing)
  vision: { fov, radius },   // the cast entry's (config VISION_DEFAULT if absent)
  coneTint: [r, g, b],       // render only
  active: true,              // false = vanished (away or gone): not drawn, sees nothing
  pose: 'sit',               // 'sit' | 'stand' | 'walk'
  moving: false,
  override: null,            // null | a mechanic's override | meeting.override | a name a hook set
  carry: null,               // null | the item type he carries
  wants: null,               // null | an item type he knows is his and misses (sim want()); he daydreams of it
                             // every ~6 s unless busy at a lure's job; cleared when he gets it
  label: '',                 // debug string of the current activity
  anim: null,                // null | the current schedule entry's `anim` (none under an override)
  heeding: false,            // render only: a noise or a stare holds his eyes (a seated NPC stops typing)
  rng,                       // per-NPC (see the traps)
}
```

## Module APIs
### Sim (`src/sim/*`)
- `createNpcs(game)` returns one NPC per `level.cast` entry, in cast order, at each one's first schedule spot.
- `updateNpcs(game, dt)`: the gather, then per NPC: schedule `say`s, delayed bubbles, wants, mechanic checks,
  planning, walking, glances, attention.
- `findPath(map, from, to, who='npc')` returns a `[{x,y}...]` tile path or `null` (BFS).
- `away` entries emit `npc:vanish {id}` and later `npc:appear {id}`; `leave` vanishes for good.
- Seated, still NPCs glance (config `GLANCE_*`, turn tweened over `GLANCE_TURN_TIME`). Walking NPCs face where they
  go, offset 0. NPCs walk at `NPC_SPEED` and pass through the player.
- Walking to the meeting, an NPC speeds up (at most ×1.3) to be seated by `meetingAt`.

### Gameplay (`src/play/*`)
- `createInput(target=window)` returns the **Input** interface:
  `{ isDown(action), pressed(action), axis() → {x,y} (normalised or 0), destroy() }`.
  Actions: `up down left right interact busy restart pause mute cones slower faster start`.
  `pressed()` is consume-on-read, and an unconsumed press expires after 0.2 s.
  Keys: WASD/arrows; E = interact (E/Space/Enter = start); Shift or P = busy (shown as "pretend");
  R; Esc = pause; M; V; `[` `]`. Arrows and space don't scroll the page. Any object with the same interface works
  in tests (`src/agent/scripted-input.js`).
- `updatePlayer(game, dt)`: movement with tile collision (circle `PLAYER_RADIUS`, sliding along walls), pretend
  poses, seating, `clock.ff`. Any movement input while seated stands you up.
- `updateInteractions(game, dt)`: picks `player.focus`, starts, runs and cancels timed actions, and applies `done`
  right after `action:done` (the table: see "Interactions and items"; `actionRow(game, verb)`). Movement input
  cancels a running action (`'moved'`).
- `updateRules(game, dt)`: mechanics that judge (put down, inspection) first; then assigned work; witnesses
  (❓ at first sight, a reaction after 0.3 s of continuous sight), tattling and grudges, owners, contraband, the
  authority's suspicion (fills in 1.6 s of seeing you idle, decays in 3 s), work assignment and caught.
  - An action with an `owner` is sneaky only to that NPC. An `idle` action still counts as slacking.
  - The authority seeing a sneaky action, or his contraband in your hands, means caught.
  - A witness who sees a sneaky action cancels it (`'witnessed'`) and shouts ❗👉 `@player` (`witness:tattle`). If the
    authority is on the floor (enforcing, not in `deafIn`) he hears it: work assigned (`'tattle'`). If not, the
    witness keeps a grudge and points you out (👉 `@player` + the row's `saw`) 1.2 s after he is back (`late: true`).
  - Evidence and scene (roles): the same shout and tattle, with reason `'evidence'` or `'scene'`.
  - Owners take their thing back on sight (unless you pretend), while `when` holds. Carrying it is reason
    `'contraband'`: his `says`, no tattle.
  - Work: `clock.forced = WORK_PENALTY_MIN` (20) from the order, held items drop, events
    `<authority>:workAssigned {reason}` and later `work:done`. A running action is cancelled `'idle'` (sent for
    slacking) or `'witnessed'` (a tattle). Then `player.js` plays it out (`rules.sent`): told on, he looks at the
    witness, then at you, and gives the order; you walk to your desk (the walk counts against the 20 minutes), sit
    and type. Time runs ×8 (`FORCED_MULT`) only while you type. What a heard tattle costs: `roles.authority.tattle`.
- `updateScenario(game, dt)`: phase changes. After a catch, `CAUGHT_DELAY` s, then outcome `'caught'`. At
  `day.meetingAt`: the outcome, `persist.routesFound` updated (wins only), a 2 s in-world beat, then `phase='end'`
  and `day:end {outcome}`. Blamed: the room stares at `meeting.chair` (🪑❓ then 😠👉 `@player`). A verdict's
  `stare: { at?, think?, say?, line?, by? }` (`sim/npcs.js stareAt`) changes where and what; `by: { [npcId]: stare }`
  gives one NPC his own (the one being stared at looks back). Fail: you walk to
  `meeting.presenter` (none: you stay put), and the 🦗 sign shows at `failSign`. Sent to your desk and not there yet: you walk there. The
  outcome is decided at `meetingAt`; the beat waits for the walk.

### Render (`src/render/*`)
- `createRenderer(canvas)` returns `{ render(game) }`. It owns canvas sizing (fit the window, crisp on HiDPI) and
  draws title / day / end screens from `game.phase` and `game.outcome`. It never mutates gameplay state.
- Level painters may import `render/things.js` (`box`, `THINGS`, `drawThing`) and the drawing helpers of
  `render/util.js`, `render/characters.js`, `render/palette.js` (`C` and the seat pairs `OXBLOOD`, `MUSTARD`, `TOMATO`,
  `TEAL`, `OLIVE`, `NAVY`), `render/tableau.js` (the end-card picture kit: `TAB`, `person`, `bubble`, `floorCarpet`,
  `floorTiles`, `backWall`, `confetti`) and `render/tableau-furniture.js` (`officeRoom`, `chair`, `woodDesk`,
  `walnutDesk`).
- The view: `effects.js` `FULL_VIEW` `{ x0, y0, x1, y1 }` (map px). While the end beat zooms in, the renderer passes
  the smaller rect to `drawBubbles`, `drawSuspicion`, `drawWitnesses` and `drawFocusHint` (last param), and they
  keep inside it; with no room above a head, a bubble goes beside it with its tail on the speaker.
- Gaze lines (`cones.js` `drawGazes`, drawn with or without V): when a still NPC's view settles a new way (more
  than 0.35 rad), a dotted line from his eyes to the first solid tile on it (or the `fx.turns` noise point), with a
  viewfinder bracket, for 1.6 s. Render memory only.
- Assigned work shows at your desk (`world.js` `drawWorkStack`: one tidy stack lands at `rules.stackAt`, shrinks with
  `clock.forced / rules.workFrom`) and over your head (`characters.js` `drawWorkMeter`), not in the HUD. A witness's eye (`drawWitnesses`) reads `game.watch`,
  `rules.seen` (against `NOTICE`, `DOUBLE_TAKE`) and `rules.grudge`.

### Audio (`src/audio/*`)
- `createAudio()` returns `{ attach(game), unlock(), update(game, realDt), setMuted(bool), setPaused(bool) }`.
  `unlock()` runs on the first user gesture. `attach(game)` subscribes to `game.events` once (the bus is
  persistent). `update()` runs once per frame. All sounds are synthesized with WebAudio (no asset files).

## Events (name → payload, emitter)
These are the engine's events. A level adds its own through data (`react.event`, `start.event`, `locked.event`,
`bang.event`, `gone.event`, `pass.event`, ...) and through `emit` in its rows and hooks; level 1's are listed in
`src/levels/meeting/LEVEL.md`. All are digested by the goldens.

| Event | Payload | Emitter |
|---|---|---|
| `loop:start` | `{loop}` | loop.js |
| `say` | `{owner, icons, kind, voice}` | fx.say (anyone) |
| `action:start` / `action:done` | `{type, targetId}` | interactions |
| `action:cancel` | `{type, targetId, reason: 'moved'\|'invalid'\|'locked'\|'witnessed'\|'idle'\|'caught'\|'meeting'}` | interactions / rules / scenario |
| `item:drop` / `item:pickup` | `{type}` | interactions |
| `item:put` | `{type, spot}` | put down |
| `item:found` | `{type, spot, by}` | put down (a spot's cast owner found it) |
| `<type>:eaten` | `{}` | interactions (an edible item) |
| `<type>:recovered` | `{by, type, from}` | take (`takesBack`: an owner with no `reclaim`, or the confiscator, took it back; `from` `'player'`, `'floor'` or a spot) |
| `inspect:start` | `{by}` | inspection |
| `inspect:pass` / `inspect:fail` | `{by, index}` | inspection (check `index` judged on arrival) |
| `inspect:done` | `{by, failed}` | inspection (`failed`: the ❌ check's index, or null) |
| `inspect:moved` | `{by, index}` | inspection (a ticked-off item left its spot; once per check) |
| `player:sit` / `player:stand` | `{}` | player |
| `busy:start` / `busy:end` | `{pose}` | player |
| `witness:notice` | `{by}` | rules (❓, first sight) |
| `witness:tattle` | `{by, reason: 'action'\|'scene'\|'contraband'\|'evidence', heard, late?, icon?}` | rules / put down |
| `<authority>:suspicious` | `{}` | rules (his meter starts filling from 0) |
| `<authority>:workAssigned` | `{reason: 'idle'\|'tattle'}` | rules |
| `work:done` | `{}` | rules |
| `caught` | `{by, reason}` | rules / put down / inspection |
| `trespass:notice` | `{by}` | rules (🤨, first sight of you in his private zone; not a harness stop) |
| `trespass` | `{by, zone, via?}` | rules (shown out of a private zone; stops a harness goto/move; the next command waits out the walk) |
| `trespass:out` | `{by}` | player (back at your desk after being shown out) |
| `npc:vanish` / `npc:appear` | `{id}` | sim |
| `meeting:gather` | `{}` | sim |
| `noise` | `{x, y, radius}` | attention |
| `npc:heard` | `{id}` | attention (after `noise`, once per listener, cast order) |
| `day:end` | `{outcome}` | scenario |

## Frame / step order (src/main.js + src/game/loop.js)
```
per animation frame (realDt capped at 0.1):
  game.time += realDt
  title: input start → startLoop
  day:   accumulate realDt; per FIXED_DT step:
           runFrame(game, FIXED_DT): mult = frameMult(game) =
             (clock.forced>0 && !rules.sent ? FORCED_MULT : clock.ff ? FF_MULT : 1) * debug.speed
           repeat mult times: tick(game, FIXED_DT), stopping after the tick that ends the day or the forced work
         R → startLoop
         Esc / ⏸ click (PAUSE_BTN in render/hud.js) / window blur → game.paused = true: no ticks, the
           accumulator is dropped, fx frozen (updateFx dt 0), audio.setPaused(true) suspends the
           AudioContext. resetLoop clears game.paused. Pausing only applies mid-day (no outcome, not caught).
  end:   input start → startLoop
  updateFx(game, realDt); audio.update(game, realDt); renderer.render(game)

tick(game, dt):  updatePlayer → updateInteractions → updateNpcs → updateRules → updateScenario
                 → advanceClock: clock.minute += dt*GAME_MIN_PER_SEC; clock.forced decrements by the same; loopTime += dt
```

## Tools
**One command: `node tools/check.mjs`** (about 10 s) runs every `tools/test-*.mjs`, `routes.mjs`,
and `golden.mjs` and `golden-render.mjs` for every level, in parallel (about 10 s). It exits 1 on any failure and
prints the tail of each failing piece. `--fast` skips `test-cold-read.mjs`, the slowest piece; `tools/merge.mjs` runs the
full check after merging. The tools below also run singly.

The level tools take `--level <id>` (default `meeting`; `routes.mjs` without it checks every level; `golden.mjs` and
`golden-render.mjs` take `--all` for every level, and without `--level` or `--all` check only `meeting` and say so);
an unknown id exits 2 and lists the registry.
- **Levels** (`tools/test-levels.mjs`): runs the validator on every registered level, and checks that a set of
  broken levels fail with the right line. It takes no `--level`.
- **Harness** (`src/agent/harness.js`, `tools/play.mjs`): an LLM agent or a script plays the real game headlessly.
  `createHarness({ level, onFrame })` (a level object or id) builds a game with a scripted Input. `onFrame(game)`,
  if given, is called after every frame the harness steps (the replay strips use it to watch; it must not change the
  game). `run('<command>')` runs
  human-level commands (`look`, `goto`, `move`, `interact` (a tap of E), `eat` (holds E), `put [spot] [pretend]`,
  `sit`, `pretend`, `wait`, `continue`, `restart`) by pressing virtual keys frame by frame, like main.js. Commands stop early on notable
  events. `observe()` returns only what a human can see. `node tools/play.mjs new <session> --level <id>` starts a
  session (the level id is the first line of `.agent-sessions/<session>.jsonl`); later calls replay the log.
  `help --level <id>` prints the commands and that level's `goto` targets (with the built-in `my_seat`). Times in
  commands (`wait until 3:00`) are read with `at(hhmm, day.start)`.
- **Fuzz** (`tools/fuzz.mjs`): searches harness plans for surprising outcomes (MAP-Elites over bins of result,
  routes and milestones; wins shrunk to a minimum, with timing windows). `[--budget 6000] [--seed 1]
  [--batch 288] [--workers N] [--verbose] [--json out.json]`. The output depends only on level, seed, budget and
  batch. A report for a designer, not a test.
- **Gate** (`tools/gate.mjs`): the pass/fail filter a level must pass before a human plays it. It fuzzes
  (`--budget 30000`; 7 s on fixture, 36 s on weekend-shift, 103 s on meeting; without `--budget`, the level's `gate.budget` when it has one, so a level whose
  rarest win needs more days needs no flag) and exits 1 on any failed check:
  - `routes`: a route no plan wins.
  - `easy`: a win in 3 plan steps or fewer (the final stance held until the meeting is not a step).
  - `random`: random plans win more than 1% of the time.
  - `crash`: a command threw, or a day never ended.
  - `<lesson id>`: a win that skips a `mustUse` lesson.
  - `drawn`: its winning plans draw an emoji as an
    object in the world (`tools/lib/drawn.mjs`; DESIGN.md "Visual language").
  - `contraband`: on the do-nothing day or a winning plan, a coworker carries an item marked `contraband` for the
    authority where the authority, enforcing, sees him (`tools/lib/contraband.mjs`): the rule would be one-sided.
  - `stray`: a picture file at the repo root, where no tool writes one (`tools/lib/stray.mjs`).
  These checks alone decide the verdict and the exit status. After the verdict the gate prints an advisory cold-read
  report (per pass: its recorded status and open blockers; `docs/COLD-READ.md`) that never changes either.
  `tools/test-gate.mjs` tests the verdict logic.
- **Shots** (`tools/shots.mjs`): `--level <id>` draws the level's `shots.js` to `tools/.shots/<id>/NN-name.png`
  and prints the game clock each shot landed on next to its intent (the pictures cold read's `intents.md` has it
  too); two shots that render pixel-identical are an error. A shot whose commands stop at a catch or at the deadline
  draws its end card; `beat: <seconds>` in `shots.js` draws that beat instead, that many seconds in (`beat: true`: a
  catch's beat 0.8 s in). `Ns` in harness commands is real seconds, so
  `pretend 5s` lands about 18 game minutes on: time a shot with `pretend until 3:20` or `pretend 2m`, then
  `wait Ns` (`docs/COLD-READ.md`). `--replay` draws a frame strip per route check to `tools/.shots/<id>/replay/`; `--shelf` draws the endings shelf (title empty, one, many; end card first and many) to `tools/.shots/<id>/shelf/`; `--verbs` draws a verb sheet per
  item (`tools/lib/verbs.mjs`: the item in hand, every generic verb on it) to `tools/.shots/<id>/verbs/`. Bubbles,
  sightlines and ripples are drawn as a player at normal speed sees them at that clock time, even after pretending
  (`playerView`, `tools/lib/draw.mjs`); the game's own fx are untouched. Needs `@napi-rs/canvas`:
  `npm install --prefix tools/.deps @napi-rs/canvas` (or `BUSYWORK_CANVAS_DIR`; `none` means no canvas, no fallback).
- **Cold read** (`tools/cold-read.mjs`): fresh `claude -p` readers who see only what a player sees judge the
  level in many narrow passes (`PASSES`: the cheap text passes first, then the picture passes) and three broad ones
  (premise, pictures, replay), and record a verdict and input hash per pass in `cold-read.md`. `--pass` takes one
  pass, a list, `text` or `all`; several run at the same time. `--status` lists every level's passes. Every report
  lists all its problems graded blocker, should or nit (`tools/cold-read/prompts/grades.md`, no quota); the verdict counts blockers
  only. A rerun's reader first marks the earlier record's open problems (the ledger), and one still there becomes a
  blocker. `--calibrate` runs a pass on a reference level without touching its record. `tools/test-cold-read.mjs`
  tests it with a fake reader; `tools/test-verb-sheet.mjs` tests that the sheets cover
  every item and verb. See `docs/COLD-READ.md`.
- **Crop** (`tools/crop.mjs`): zooms into part of a picture, with named, checked arguments; it never writes into the
  repo except `tools/.shots/`. `tools/test-stray.mjs` tests it and the gate's `stray` check.
- **Golden** (`tools/golden.mjs`): replays `golden.json` and compares every event and the state after each command.
  `--write` re-records the existing corpus (it throws if there is no file); `--write --from f.json` builds the
  corpus from a `fuzz.mjs --json` dump plus `gate.goldenPlans`. `--all` checks (or, with `--write`, re-records) every level.
  Both golden files are one JSON plan per line (`tools/lib/golden-file.mjs`), so a change touches only its plan's line.
  `tools/merge.mjs` resolves a conflict in them by re-recording the union of both sides' plans, and exits 1 if a
  plan's outcome after that is one neither side had.
- **Golden render** (`tools/golden-render.mjs`): the same for drawing, into a recording fake canvas. `--all` as above; `--write`
  re-records (plans from the file, or picked from the golden corpus). It also fails when a level draws an emoji
  as an object in the world.
- **Routes** (`tools/routes.mjs`): scripted speedruns that must end with the expected outcome, from each level's
  `route-checks.js` (the format is in `meeting/route-checks.js`). A check is `{ name, expect: { result, routes? },
  cmds: [...] }` (harness commands) or the same with `play(ctx)` in place of `cmds`. `expect.routes` lists routes the
  outcome must include. `[--level <id>] [--verbose]`; without `--level` it checks every registered level, and a
  level with no `route-checks.js` fails.
- **Engine clean** (`tools/test-engine-clean.mjs`): engine code names no level-1 thing.
- **Smoke** (`tools/test-smoke.mjs`): boots the unmodified `src/main.js` per registered level (`?level=<id>`) against a stub DOM,
  a manual `requestAnimationFrame` queue and a recording fake canvas, and plays it with real key events: title card, day,
  fast-forward to the end screen, retry. Fails on any exception, `console.error`, bad canvas call, or undrawn frame.
  Known failures go in `KNOWN_FAILURES` at its top; one that starts passing fails the test.
- **Perf** (`tools/perf.mjs [--level <id> | --all] [--json] [--write]`): per level, the median of a few runs of sim cost (ms per 1000
  harness frames over the golden plans), render cost (ms per frame through the fake canvas) and the golden replay's wall time, against
  `tools/perf-budget.json` (`--write` records it); exit 1 when a number is over 2.5x its budget. The gate prints the same as one advisory line.
  Not a `test-*.mjs`: timing under the parallel runner would be flaky.
- **Round** (`tools/round.mjs [--session <uuid>] [--since <ISO | 3h | 45m>] [--json]`): read-only report on a round of agent
  work, from the Claude Code transcripts in `~/.claude/projects/` (default: the newest session) and from git. One row per agent
  (wall time, turns, tokens, tool calls, check/gate/golden runs, waiting gaps, parent), concurrency of subagents, unmerged
  branches, and a few flags. It prints numbers and agent descriptions, never message text; what the files do not say
  prints `unknown`. Use `--since` for one round: a session can span days. Not a `test-*.mjs`.
- **`BUSYWORK_JOBS=<n>`** (`tools/lib/jobs.mjs`): one cap on parallelism for check/merge, `--all`, the fuzzer's workers and cold-read's readers; unset, each keeps its own default.

A refactor must leave both golden tools passing. Re-record only for an intended behaviour change, and say so in
the commit.
