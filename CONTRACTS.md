# CONTRACTS: how the modules fit together

DESIGN.md says what the game is. This file says who owns what, and the shapes everyone relies on. Most of it is
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
  Mechanics run in check order: lures, hunts, doors, spot owners (put down), inspections, each list in level order.
- **The harness paths with BFS.** A* would change every path.
- **No wall-clock time, no `Math.random` in gameplay.** No `Date`, no `performance.now`. Only `input.js` reads
  real time (press expiry). `Math.random` is for visual-only things (particles, wobble).
- **Schedules are sorted by `at`.** The sim takes the latest entry whose time has passed.

## Conventions
- Vanilla JS ES modules, no dependencies, no build step. Serve with `python3 -m http.server` from the repo root.
  Node 22 runs the headless tests (`node tools/test-*.mjs`).
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
- **Only edit files you own.** If you need a contract change, implement against the contract as written, work
  around it locally, and say so in your report. You may add private fields to entities with a leading underscore
  (`npc._path`). Put module-local tunables at the top of your own file.
- Keep code readable, commented where non-obvious, and prototype-quality (no over-engineering).

## File ownership
| Owner | Files |
|---|---|
| coordinator | `index.html`, `src/main.js`, `src/state.js`, `src/game/*`, `src/config.js`, `src/core/*`, `src/levels/index.js`, `src/levels/validate.js`, `src/agent/*`, `tools/test-core.mjs`, `tools/test-levels.mjs`, `tools/play.mjs`, `tools/routes.mjs`, `tools/fuzz.mjs`, `tools/gate.mjs`, `tools/test-gate.mjs`, `tools/golden.mjs`, `tools/golden-render.mjs`, `tools/test-engine-clean.mjs`, `tools/lib/*`, `*.md` |
| sim agent | `src/sim/nav.js`, `src/sim/npcs.js`, `src/sim/override.js`, `src/sim/mechanics/*`, `tools/test-sim.mjs`, `tools/test-attention.mjs` |
| gameplay agent | `src/play/*`, `tools/test-play.mjs` |
| render agent | `src/render/*`, `tools/test-render.mjs` |
| audio agent | `src/audio/*`, `tools/test-audio.mjs` |
| level author | one folder `src/levels/<id>/` (its goldens are written by the tools), plus one line in `src/levels/index.js` |

## Engine modules (read these, don't edit)
- `src/config.js`: shared tunables (clock, speeds, reach, action times, vision, glances, suspicion), `SEED`,
  `DAY_START`, `at()`, `formatClock()`, `clockArg()`, `dayCue()`, `DAY_CUES`, `deg()`.
- `src/core/map.js`: `parseMap(rows, legend)` returns `{ w, h, rows, defs, char(x,y), tile(x,y), isSolid, isOpaque,
  isWalkable(x,y,who), interactables[], find(c) }`. `isWalkable(x,y,'npc')` also passes `npcPassable` tiles.
- `src/core/vision.js`: `canSee(map, viewer, tx, ty)`, `inCone`, `hasLineOfSight`, `angleDiff`, `DIRS`.
- `src/core/fx.js`: `say(game, owner, icons, {kind, ttl, voice})`, `burst(game, kind, x, y, n, opts)`, `shake(game, amount, t)`,
  `sightline(game, from, kind='notice', ttl=0.8)` (a dashed line from an NPC to the player: 'notice' ❓ | 'tattle' ❗👉 | 'caught').
  **Use `say()` for every speech, thought or alert bubble.** It also emits `'say'` for audio. Without a `voice`
  it uses the owner's id as the voice name.
- `src/core/rng.js`: `createRng(seed)` returns `{ next, range, int, pick, chance }`.
- `src/core/events.js`: `game.events.on(name, fn)` (`'*'` gets every event) and `game.events.emit(name, payload)`.
- `src/levels/index.js`: the registry `levels`, `defaultLevel` (level 1, `meeting`) and `getLevel(id)` (throws on an
  unknown id and lists the registry). It validates every level as it loads (`src/levels/validate.js`, see "Errors").
- `src/game/perception.js`: `viewerOf(npc)`, `npcSees(game, npc, x, y)`, `witnesses(game, x, y)`, `spotPos(game, name)`
  (throws on an unknown spot), `inZone(game, name, x, y)` (false for an unknown zone), `findNpc(game, id)`.
- `src/state.js`: `createGame({ events, input, level })` and `resetLoop(game)`. They build the state below.
- `src/game/loop.js`: `startLoop(game)`, `tick(game, dt)`, `advanceClock`, `frameMult`. The sim step order; the
  harness uses it too.
- `src/sim/override.js`: override plumbing shared by the sim, its mechanics and level hooks (`setOverride`,
  `endOverride`, `holdFor`, `speak`, `applyEffect`, `spotLeg`).
- `src/sim/mechanics/*`: the generic NPC mechanics (lure, hunt, door, put down, inspection, attention). Each file's
  header documents its level data in full. `index.js` lists the kinds and their hooks.

## The level object
A level is one folder, `src/levels/<id>/`, whose `index.js` default-exports one object. Engine code reads it as
`game.level` and never imports level files. The folder name must equal `id`: the tools find the goldens at
`src/levels/<id>/golden.json` and `golden-render.json`, and the route checks at `route-checks.js` (see Tools).
Register the level with one line in `src/levels/index.js`.

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
| `lures`, `hunts`, `doors`, `inspections` | no | `sim/mechanics/*` | fixture `LURES`, meeting `mechanics.js`, fixture-inspection |
| `noises` | no | `mechanics/attention.js` | (none yet) |
| `behaviours` | if the cast names a hook | sim | `fixture/cast.js` `BEHAVIOURS` |
| `failSign` | no | scenario | meeting `index.js` |
| `decor`, `looks`, `poses`, `cones`, `endScenes` | no | render | `fixture/presentation.js` |
| `sounds`, `voices` | no | audio | `meeting/sounds.js`, `meeting/voices.js` |
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
`wall`, `glass`, `entrance` (a glass door), `door`, `restroom` (a wall with a 🚻 door), `elevator` (a wall with
lift doors), `floor`, `outside` (lobby floor), `desk`, `own_desk`, `meeting_table`, `coffee_machine`, `plant`,
`coat_rack`, `refrigerator`. The base letters' kinds are draws already. A `draw` not in the list is a load error.
Any other kind draws only floor. To show something there, add a `decor.props` entry with `draw: 'icon'`
(fixture: `B`, `M`, `W`).
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
  - `coneTint`: `[r, g, b]` of the drawn cone. `voice`: a name in `level.voices` or the engine's.
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
  - Cosmetic cues, all optional. Each defaults to a few minutes before `meetingAt` (config.js `dayCue`):
    `clockRedAt` (HUD clock turns red; −5), `clockTickAt` (wall clock starts ticking; with `clockRedAt`),
    `tockAt` (tick-tock; −2), `halfMinuteAt` (a tick every half minute; −1), `beamAt` (the projector beam in
    level 1's `decor.js`; −5). Read a cue with `dayCue(day, name)`, not `day[name]`.
- `meeting`: `{ override, room, chair, presenter }`. `override` is the NPCs' override name at the meeting;
  `room` the zone you must be in at `meetingAt`; `chair` the spot the room stares at when you are blamed;
  `presenter` the spot a failed meeting puts you at. The event `meeting:gather` and the cancel reason `'meeting'`
  are engine words, the same in every level.
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

| Row field | Meaning |
|---|---|
| `on` | what offers it: an interactable type on the map, `'self'` (what you hold), `'item'` (a floor item), `'spot'` (a put-down spot) |
| `icon`, `text` | the ✋ hint, and the harness's words for it |
| `duration` | real seconds; `instant: true` instead does it at once (never seen in progress) |
| `sneaky` | witnesses matter while it runs |
| `owner` | only this cast id minds (to anyone else it's harmless) |
| `idle` | the authority reads it as slacking (his ❓ fills) |
| `saw` | the icon a witness's late 👉 shows for it |
| `noise` | `{ radius, at?, npcs? }`: a noise when done (see Attention) |
| `can(p, w, item)` | offered while true; a running action is cancelled `'invalid'` when it turns false |
| `done(game, a)` | the result, right after `action:done`; `a` has `x, y` (the target) and `item` |

- `items`: `{ [type]: { icon, place?, edible?, contraband?, owner? } }`.
  - `icon` (required): the emoji it draws as, held, carried or on the floor.
  - `place`: the `world` field that says where it is: `'player'` held, `'dropped'`, `'eaten'`, a spot name, or a
    cast id.
  - `edible`: the engine offers `eat_<type>` (sneaky to its owner, `idle`, sets `player.smeared`, event
    `<type>:eaten`).
  - `contraband`: the cast id who catches you holding it (if he is the authority: caught) and pockets it if he
    sees it on the floor (`<type>:recovered`). Needs a `place`.
  - `owner`: `{ id, when?(npc), says?, reclaim?(game, npc) }`. He takes it back on sight while `when` holds.
    `says`: his lines on catching you carrying it (lines as in Mechanics). `reclaim`: what taking it back does
    (default: he carries it, `<type>:confiscated {by}`).
- Example: fixture `INTERACTIONS` and `ITEMS` (the cake is edible and Gus owns it); meeting `items.js`.

### Roles
`roles` says who plays which part in the office rules (`play/rules.js`). Every cast member who is not the
authority is a witness: he shouts and points ❗👉 at a sneaky action he sees.
- `authority`: `{ id, offDuty?, helpless?, deafIn? }`. His sighting of a sneaky action, or of his contraband in
  your hands, means caught. He owns the suspicion meter (`game.suspicion[id]`) and assigns work. `offDuty`: his
  overrides during which he enforces nothing. `helpless`: overrides during which he can't act even on what he
  sees. `deafIn`: a zone where he can't hear a shout (or a noise). `roles` and `authority` are optional. Without
  an authority nobody assigns work and only an inspection can catch you.
- `evidence`: `{ by, while, mark, knows, icon }`. A player field (`mark`) that pretending doesn't hide. The witness
  `by`, in override `while` (one value), reads it as guilt; telling sets `world[knows]`. Reason `'evidence'`.
- `scene`: `{ by, while, zone, door, radius?, fresh(world), icon }`. While `by` is in one of the `while`
  overrides (a list), he blames whoever he sees in `zone`, or within `radius` (default 3.5) of the point `door`
  (`{ x, y }`) unless pretending. Once per scene; `fresh(world)` holding makes the next one fresh. Reason `'scene'`.
- Example: fixture `ROLES` (authority only); meeting `roles.js` (all three).

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
item })`. No owner: nobody minds. Events `item:put {type, spot}`, `item:found {type, spot, by}`. Example:
fixture-putdown (`player_desk` is yours, `box` is the boss's with `found: 'readNote'`).

**Inspection** (`level.inspections`, `inspection.js`): from minute `at` one NPC walks an ordered list of checks.
`{ npc, at, override, plan, label, look?, checks, pass?, fail? }`. A check is `{ item, spot, from? }` or
`{ who, zone, from }` (`who`: `'player'` or a cast id). Each is judged when he gets there: ✔️ or ❌, then he stands
`look` s (default 1). All ✔️: `pass: { set?, event?, says? }`. The first ❌ ends it: `fail: { set?, event?, says?,
then? }`, with `then` one of `'caught'` (reason `'inspection'`, by him), `'stare'`, `'hunt'`, a hook name
(`arrive(game, npc, sim, { index })`), or none. He starts only when on the floor with no override; never after
the gather; once a loop. A lure drops it; the gather lets him finish. Example: fixture-inspection.

**Attention** (`attention.js`): a noise turns heads. Two sources: an interaction row's `noise: { radius, at?,
npcs? }` (at spot `at`, else where the action was aimed), and `level.noises: { [event]: { at, radius, npcs? } }`
(whenever that event fires; not `noise` or `npc:heard`). Everyone within `radius` (straight line; walls don't
stop sound), active and not gone, faces it for 1.5 s; a second noise retargets him. `npcs` limits who hears it.
The authority hears nothing in his `deafIn` zone. With no override he turns his body and waits; in any
override only his head turns and his plan goes on. Glances due meanwhile still draw from the rng. Events
`noise {x, y, radius}`, then `npc:heard {id}` per listener in cast order. Example: fixture-attention (the printer).

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
  `zoneSeeds`, `elevator`, `legendAt`, ...), documented in `meeting/decor.js`. `props: [{ tile, draw,
  state(world, game) }]` draws on the first tile whose map letter is `tile` (the letter, not a draw or kind name);
  `draw: 'icon'` with state `{ icon, size? }` works in any level. Example: fixture `DECOR`.
- `looks`: `{ [id]: look }` per person and `player` (fields in `meeting/looks.js`); anyone without one gets a
  generic look in his `color`.
- `poses`: `{ arms: [{ when(npc, world, game), arms, item?, angry?, crank? }], marks: [{ when, angry?, badge?,
  jacket? }] }`. The first `arms` rule that holds wins; every `marks` rule that holds applies.
- `cones`: `{ alert: [override] }`: overrides during which a cone glows red. A cone also glows while its NPC sees
  something the rules react to (`game.watch`) and when he catches you; the authority's also while his suspicion
  is above 0.
- `endScenes`: `{ kindOf(outcome), scenes: { [kind]: { win, icons, draw(ctx, game, t, e, outcome) } } }`.
  `kindOf` must map every outcome to a scene. Absent: `render/screens.js` `DEFAULT_END_SCENES`, a plain scene per
  result. Example: fixture `END_SCENES` (one big emoji per outcome).
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
    (`<authority>:workAssigned`, `<type>:eaten`, `<type>:recovered`, `<type>:confiscated`): list them by hand.
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
  phase: 'title',             // 'title' | 'day' | 'end'
  settings: { showCones: true, muted: false },
  debug: { speed: 1 },        // integer sim multiplier ([ and ] keys)
  time: 0,                    // real seconds since boot (animation clock for render/audio)
  input,                      // set by main.js (see Input)

  // --- per loop (rebuilt by resetLoop) ---
  fx: { bubbles, particles, shake, lines },   // lines: [{ from: npcId, to: 'player', kind, age, ttl }]
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
    smeared: false,           // ate an edible item; a role's evidence `mark` can name it
    action: null,             // null | { type, targetId, t, duration, sneaky, owner, idle, x, y, item }
    locked: false,            // can't move or act (forced work, caught, end beat)
    focus: null,              // null | { kind: 'interactable'|'item'|'self'|'spot', id, x, y, icon, action, item }
  },
  npcs: [],                   // createNpcs(game), in cast order. See NPC shape.
  world: {                    // level.initialWorld(): the level's own fields, plus
    items: [],                // floor items: { type, x, y, spot? } (spot: lying on a put-down spot)
  },
  suspicion: { [authorityId]: 0 },   // 0..1; {} without an authority
  watch: {},                  // { [npcId]: 'action'|'scene'|'evidence'|'contraband' }: what each NPC sees that the
                              // rules react to, after each step (rules.js; render/cones.js reads it). Empty while
                              // caught, after the outcome and during assigned work.
  caught: null,               // null | { by, reason: 'action'|'scene'|'evidence'|'contraband'|'inspection', t }
  outcome: null,              // null | { result: 'win'|'fail'|'caught'|'blamed', routes, newRoutes, loop, minute }
  rules: { seen, lastNotice, working, sceneTold, grudge },   // private to rules.js
  scenario: { beatT, crickets },                              // private to scenario.js (the end beat)
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
  Keys: WASD/arrows; E/Space/Enter = interact (Enter/Space/E also = start); Shift or P = busy (shown as "pretend");
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
  - A witness who sees a sneaky action cancels it (`'witnessed'`) and shouts ❗👉 (`witness:tattle`). If the
    authority is on the floor (enforcing, not in `deafIn`) he hears it: work assigned (`'tattle'`). If not, the
    witness keeps a grudge and points you out (👉 + the row's `saw`) 1.2 s after he is back (`late: true`).
  - Evidence and scene (roles): the same shout and tattle, with reason `'evidence'` or `'scene'`.
  - Owners take their thing back on sight (unless you pretend), while `when` holds. Carrying it is reason
    `'contraband'`: his `says`, no tattle.
  - Work: `clock.forced = WORK_PENALTY_MIN` (20), you are snapped to your desk typing, held items drop, events
    `<authority>:workAssigned {reason}` and later `work:done`. A running action is cancelled `'idle'` (sent for
    slacking) or `'witnessed'` (a tattle).
- `updateScenario(game, dt)`: phase changes. After a catch, `CAUGHT_DELAY` s, then outcome `'caught'`. At
  `day.meetingAt`: the outcome, `persist.routesFound` updated (wins only), a 2 s in-world beat, then `phase='end'`
  and `day:end {outcome}`. Blamed: the room stares at `meeting.chair` (🪑❓ then 😠👉). Fail: you stand at
  `meeting.presenter`, and the 🦗 sign shows at `failSign`.

### Render (`src/render/*`)
- `createRenderer(canvas)` returns `{ render(game) }`. It owns canvas sizing (fit the window, crisp on HiDPI) and
  draws title / day / end screens from `game.phase` and `game.outcome`. It never mutates gameplay state.

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
| `<type>:recovered` | `{}` | rules (contraband pocketed off the floor) |
| `<type>:confiscated` | `{by}` | rules / put down (an owner took it back, no `reclaim`) |
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
           mult = frameMult(game) = (clock.forced>0 ? FORCED_MULT : clock.ff ? FF_MULT : 1) * debug.speed
           repeat mult times: tick(game, FIXED_DT)
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
The level tools take `--level <id>` (default `meeting`; `routes.mjs` without it checks every level); an unknown id
exits 2 and lists the registry.
- **Levels** (`tools/test-levels.mjs`): runs the validator on every registered level, and checks that a set of
  broken levels fail with the right line. It takes no `--level`.
- **Harness** (`src/agent/harness.js`, `tools/play.mjs`): an LLM agent or a script plays the real game headlessly.
  `createHarness({ level })` (a level object or id) builds a game with a scripted Input. `run('<command>')` runs
  human-level commands (`look`, `goto`, `move`, `interact`, `put [spot] [pretend]`, `sit`, `pretend`, `wait`,
  `continue`, `restart`) by pressing virtual keys frame by frame, like main.js. Commands stop early on notable
  events. `observe()` returns only what a human can see. `node tools/play.mjs new <session> --level <id>` starts a
  session (the level id is the first line of `.agent-sessions/<session>.jsonl`); later calls replay the log.
  `help --level <id>` prints the commands and that level's `goto` targets (with the built-in `my_seat`). Times in
  commands (`wait until 3:00`) are read with `at(hhmm, day.start)`.
- **Fuzz** (`tools/fuzz.mjs`): searches harness plans for surprising outcomes (MAP-Elites over bins of result,
  routes and milestones; wins shrunk to a minimum, with timing windows). `[--budget 6000] [--seed 1]
  [--batch 288] [--workers N] [--verbose] [--json out.json]`. The output depends only on level, seed, budget and
  batch. A report for a designer, not a test.
- **Gate** (`tools/gate.mjs`): the pass/fail filter a level must pass before a human plays it. It fuzzes
  (`--budget 30000`, about 30 s) and exits 1 on any failed check:
  - `routes`: a route no plan wins.
  - `easy`: a win in 3 plan steps or fewer (the final stance held until the meeting is not a step).
  - `random`: random plans win more than 1% of the time.
  - `crash`: a command threw, or a day never ended.
  - `<lesson id>`: a win that skips a `mustUse` lesson.
  `tools/test-gate.mjs` tests the verdict logic.
- **Golden** (`tools/golden.mjs`): replays `golden.json` and compares every event and the state after each command.
  `--write` re-records the existing corpus (it throws if there is no file); `--write --from f.json` builds the
  corpus from a `fuzz.mjs --json` dump plus `gate.goldenPlans`.
- **Golden render** (`tools/golden-render.mjs`): the same for drawing, into a recording fake canvas. `--write`
  re-records (plans from the file, or picked from the golden corpus).
- **Routes** (`tools/routes.mjs`): scripted speedruns that must end with the expected outcome, from each level's
  `route-checks.js` (the format is in `meeting/route-checks.js`). A check is `{ name, expect: { result, routes? },
  cmds: [...] }` (harness commands) or the same with `play(ctx)` in place of `cmds`. `expect.routes` lists routes the
  outcome must include. `[--level <id>] [--verbose]`; without `--level` it checks every registered level, and a
  level with no `route-checks.js` fails.
- **Engine clean** (`tools/test-engine-clean.mjs`): engine code names no level-1 thing.

A refactor must leave both golden tools passing. Re-record only for an intended behaviour change, and say so in
the commit.
