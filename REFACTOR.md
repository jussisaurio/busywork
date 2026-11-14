# Refactor: levels as data

Goal: a new level is **one folder under `src/levels/`** and touches nothing else (except one line in the level
registry). That folder holds the level's data and its own small code hooks. Engine code never names an NPC, spot
or item.

Sources: three independent audits (level authoring, sim/play/core health, render/audio health), 2026-11-14.
The coordinator chose what goes in. Findings left out are listed at the end.

## Rules for every step

- **Behaviour-preserving by default.** After every step, all of these must pass:
  - `node tools/golden.mjs`
  - `node tools/golden-render.mjs` (added in P0)
  - `node tools/test-*.mjs`
  - `node tools/routes.mjs`
- **Intended changes are separate commits.** Each one re-records the golden data (`--write`) and says in the
  commit message what changed and why. The list is fixed in "Intended changes" below. Nothing else re-records.
- **Determinism traps.** Read these before touching sim or rules.
  - Cast order (boss, kev, lin) drives update order, witness order, events and the snapshot. Don't reorder.
  - NPC rng is seeded by `SEED ^ fnv1a(id)`. Glances draw on every expiry, visible or not. Keep the draw order
    and the `range(...glanceEvery)` argument shape.
  - Plan-key strings (`fix#seq`, `hunt#seq`, `meeting#seq`) and leg order (fridge prelude, then jacket prelude,
    then main leg) stay exact.
  - Never add a field to `world`, because every digest changes. Put level references on `game`.
  - Event names and payloads are digested. Level 1 keeps its names (`kev:alerted`, `sandwich:returned`, …).
  - Tick order: player, interactions, NPCs, rules, scenario, clock. A hook runs at exactly the point where
    today's `id ===` check sits.
  - Keep the harness BFS. A* would change every path.
- **Commit after each numbered step**, on branch `refactor/levels` in the worktree `../busywork-refactor`.

## P0: safety nets

1. `tools/lib/fake-canvas.mjs`: move test-render's recording fake ctx and stubbed window/document here, and
   import it from test-render.
2. `tools/golden-render.mjs`: for about 20 golden plans, render frames at fixed points (each command end,
   mid-forced-work, the end screens, pause), digest the ctx call log, and compare with
   `tools/golden-render.json`. Stub `Math.random` with a seeded rng for the run. Bubble ids come from a
   module-level counter, so create a fresh game per plan and exclude ids from the digest if they reach it.
   Supports `--write`.
3. `tools/test-engine-clean.mjs`: fail if any file outside `src/levels/` contains a level-1 identifier as a
   string or property (`'boss'`, `'kev'`, `'lin'`, `'sandwich'`, `'keycard'`, `'projector'`, `'coffee'`,
   `'fridge'`, `'smoke'`, `'mustard'`, raw tile coordinates in render). It starts with an allow-list of the
   current hits, written to a file. Every later step shrinks the list, and P5 ends with it empty.

## P1: hygiene (no level work yet)

1. Per-loop state: replace the `WeakMap`s keyed by `game.player` (rules.js:38, scenario.js:18) with
   `game.rules` and `game.scenario`, created in `resetLoop` with the same initial values.
2. One tick:
   - Export `frameMult(game)` and `advanceClock(game, dt)` from loop.js. Use them in main.js, the harness,
     test-sim and test-play.
   - test-play's `step()` may keep skipping NPCs, but it must call `advanceClock`.
   - The harness's hard-coded `'time ×6'` comes from `FF_MULT`.
3. Encapsulation:
   - Add an `npcSayLater(npc, t, icons, kind)` export and use it in rules.
   - Build test fakes through an exported NPC factory. Then drop the `_sayQ ??=` and `if (n._gl)` guards.
   - `createNpcs` clones schedules, because test-sim mutates the shared ones.
4. Interactions:
   - Build one `targetAction(game, target)` table used by both `verbFor` and `stillValid`. Keep the predicate
     order.
   - Make `_action`, `_item`, `_x` and `_y` public (`action`, `item`, …).
   - Derive the harness `VERBS` from the same table.
5. Shared helpers:
   - `findNpc` everywhere: render, audio and routes.mjs.
   - `ZONES.outside` instead of `OUTSIDE_Y = 14`, audio's `LOBBY_Y` and test-sim's `y >= 14`.
   - `spotPos` from perception instead of audio's copy.
   - Fold screens.js `person()` into an exported `resetState`, and add `mustard` to `personState`.
6. Dead code and stale comments. Delete each item from the sim/core audit's §6–7 and the render/audio audit's
   §8 lists below. Update the contract text (meeting gather is **3:54**; cancel reasons include `locked`,
   `invalid` and `meeting`).
   - Sim/core: `game.rng`, `DAY_END`, `WORLD_TEXT.keycard`/`.sandwich`, the `fx.lines` guards, the vacuous
     test-core assertion, and exports used only in their own module.
   - Render/audio: `|| null`, `|| true`, dead `fillStyle` assignments, unused exports and palette chips, and
     the `posOf` regex fallback.
7. fuzz.mjs:
   - Use `at()` and `formatClock` from config instead of `150` and `89`.
   - Use a fixed `BATCH` (a flag, not the core count), so a seed reproduces on any machine.
8. Fold scenario.js's inline stand-up into `standUp()`, keeping the event order.
9. Shared drawing helpers, with today's sizes as parameters:
   - `drawScreen` (4 copies)
   - `clockHands` (2 copies)
   - the `CONFETTI` constant in palette
   - `drawDrop` and `drawPaper`
   - per-look `bubbleDy` and `eyeDy`, plus `headY(n)`

## P2: the level object

1. Add a `src/levels/meeting/` folder (level 1, "The 4 PM Meeting"):
   - `index.js` assembles the level from `map.js` (today's level.js: rows, legend, spots, zones, patrols) and
     `cast.js` (today's schedules.js).
   - `createGame({ level })` sets `game.level`, and `src/levels/index.js` lists the levels.
   - In this step nothing reads `game.level` yet.
2. Plumbing:
   - `spotPos(game, name)`, `inZone(game, …)`, `ROUTES`, the cast and the map resolve through `game.level`.
   - Render view size comes from `game.map`, not a module-load constant. Keep the 30×17 view, and keep the HUD
     pixel positions relative to the view.
3. Copy constants into the level as literals; don't derive them:
   - `day: { start, end, gatherAt, meetingAt }`
   - the cosmetic times (beam 3:55, audio 3:50/3:55/3:57, HUD red 3:50)
   - `VISION` and `GLANCE_EVERY_BY`
   - looks, cone tints and voices on the cast
   - `OWNS` and `SCENE_DOOR`
   - the icon tables, with one `ROUTE_ICONS` source
4. `level.initialWorld()`, and `level.routes = [{ id, icon, achieved(world) }]`. Store found routes per level
   behind a `persist.routesFound` alias for the current level, so the snapshot doesn't change.

## P3: behaviour, roles and hooks

1. Interactions become level data: `level.interactions = [{ on, when(game), action, apply(game) }]`. Generic
   actions stay in config, and level actions move to the level.
2. Generic rules, with roles on the cast. These are the only engine concepts:
   - **authority**: whoever's sighting means caught. It owns the suspicion meter, keyed by the authority's id,
     so level 1 keeps `suspicion.boss`.
   - **owner**: the item has an owner and a `when`. Owners take items back.
   - **witness**: a non-authority NPC who sees a sneaky action tattles now or later (today's tattle rule).
   - **evidence mark**: something on the player that lasts the loop and that pretend doesn't hide (today's
     mustard).
   - **scene**: whoever is near a zone while a world condition holds gets blamed (today's Kev scene rule).
     Parameters: zone, door, condition and investigator.

   Item flags: `contraband` (to whom), `edible`, and `icon`.
3. Sim hooks. A schedule entry names its hooks explicitly (`prelude: 'raidFridge'`, `arrive: 'pourCoffee'`,
   `anim: 'smoke'`). The level's `behaviours` registry resolves them. No more triggers on spot names.
   - Level-1 hooks live in `src/levels/meeting/behaviours.js`: Kev's projector repair, the boss's keycard gate,
     Lin's hunt, the fridge raid, the coffee pour and the presenter.
   - **A hook moves into the engine only when a second level actually uses it.**
4. `npc.anim` replaces the renderer reading the debug label `'visit smoke'`.

## P4: presentation and tools read the level

1. `level.decor`:
   - chairs, windows, paintings, cabinets, the clock, the screen, the notepads, and `legendAt`
   - `deskOwners`
   - the zone flood seeds, taken from `level.zones`

   `world.js` iterates over it.
2. `level.endScenes`: the tableaux stay hand-drawn code inside the level folder. The screens layer handles any
   number of route slots, not exactly 2.
3. Audio:
   - `level.sounds = { actions, events }`.
   - The crickets come from an explicit `say(…, { sfx })` or a scenario event, not from matching an emoji.
   - The meeting murmur iterates over the active cast.
   - Pitch derives from the voice's `f0`.
4. `level.harness = { landmarks, worldText, describe }`. Landmark names stay the same, because golden plans
   use them.

## P5: tooling for mass-produced levels

1. `--level <id>` on harness, play.mjs, fuzz.mjs, golden.mjs and golden-render.mjs. Each level gets its own
   golden file.
2. `tools/gate.mjs --level <id>` is the automated filter run before a human plays a level. It runs the fuzzer
   and fails on any of these:
   - a route in `level.routes` that no plan wins
   - a win in 3 steps or fewer
   - a random-sampling win rate above 1%
   - any crash or harness error
   - a win that misses one of the level's `mustUse` milestones (the lesson the level exists to teach)

   It prints a one-screen report: routes with minimal plans, timing windows, and EASY flags.
3. The fixture level is the acceptance test. `src/levels/fixture/`: one room, two NPCs (one an authority),
   one owned item, two routes. It must:
   - be written without touching any file outside its folder, apart from the registry line
   - run in the browser, the harness and the fuzzer
   - pass the gate
   - get its own golden

   If it can't be written without touching engine files, the refactor isn't done.
4. `test-engine-clean` allow-list is empty.

## P6: docs

- CONTRACTS.md: the level-module format, roles, hooks and the gate.
- DESIGN.md keeps only game-wide rules. Level-1 specifics move to `src/levels/meeting/LEVEL.md`.
- `src/levels/README.md`: how to author a level, in one page, with the fixture as the example.

## Intended changes (each one its own commit, with a stated re-record)

1. Particle seed uses `hash(ttl)`, not the array index (fixes colour and rotation flicker). Render golden only.
2. Particle drag scaled by dt (`0.92 ** (dt*60)`). The same at 60 Hz. Render golden only.
3. Cone "notice" glow is drawn from a read-only `game.watch[id]` that rules publish every tick, so it matches
   what the rules react to. Render golden only.
4. `assignWork` cancel reason for the idle path: `'idle'`, not `'witnessed'`. Both goldens.

## Left out on purpose

- Harness BFS vs A*, and the glance rng draws when no glance is shown: changing either shifts everything.
- `_gathered` once-flag on NPCs.
- Module-level scratch objects in characters/screens, the `fin()` guards, and sfx recipes building their nodes
  by hand.
- `at()` being PM-only, until a level needs a morning.
- A generic "role" for every level-1 behaviour (repairs, gate, hunt, presenter). These stay level hooks until
  a second level needs them.
- A shared scripted input for tests (three fakes today). Worth doing, but not needed for levels.
