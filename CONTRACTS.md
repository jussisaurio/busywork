# CONTRACTS: how the modules fit together

Read DESIGN.md first for what we are building. This file defines **who owns what** and **the shapes
everyone relies on**.

## Conventions
- Vanilla JS ES modules, no dependencies, no build step. Served with `python3 -m http.server` from the repo root.
  Node 22 runs headless tests (`node tools/test-*.mjs`).
- **No DOM access at module import time.** Only `createInput(window)`, `createRenderer(canvas)`, `createAudio()` and
  `src/main.js` may touch browser APIs, and only inside functions. Everything else must import cleanly in node.
- Units: positions are floats in **tile units**. Tile (x,y) covers [x,x+1)×[y,y+1), and its centre is (x+0.5, y+0.5).
  Angles are radians: 0 = east, π/2 = south (canvas convention). `dt` is **real seconds per sim step** (1/60).
  Game time is `game.clock.minute` = minutes since 2:30 PM. Use `at('3:10')` from config.js to compare.
- Randomness that affects gameplay must be deterministic. Use the per-NPC rng (see Sim) or `game.rng`.
  `Math.random` is allowed only for visual-only things (particles, wobble).
- **Only edit files you own.** If you need a contract change, implement against the contract as written,
  work around it locally, and say so in your final report. You may add private fields to entities with a
  leading underscore (`npc._path`). Put module-local tunables at the top of your own file.
- Keep code readable, commented where non-obvious, and prototype-quality (no over-engineering).

## File ownership
| Owner | Files |
|---|---|
| coordinator | `index.html`, `src/main.js`, `src/state.js`, `src/game/*`, `src/config.js`, `src/core/*`, `src/data/*`, `src/agent/*` (AI-agent harness), `tools/test-core.mjs`, `tools/play.mjs`, `tools/routes.mjs`, `tools/fuzz.mjs`, `tools/golden.mjs`, `*.md` |
| sim agent | `src/sim/nav.js`, `src/sim/npcs.js`, `tools/test-sim.mjs` |
| gameplay agent | `src/play/input.js`, `src/play/player.js`, `src/play/interactions.js`, `src/play/rules.js`, `src/play/scenario.js`, `tools/test-play.mjs` |
| render agent | `src/render/*.js`, `tools/test-render.mjs` |
| audio agent | `src/audio/audio.js`, `tools/test-audio.mjs` |

## Existing shared modules (read these, don't edit)
- `src/config.js`: all shared tunables (clock, speeds, actions, vision, glances, rules). `at()`, `formatClock()`.
- `src/core/map.js`: `parseMap(rows, legend)` returns a map with `w, h, char(x,y), tile(x,y), isSolid, isOpaque, isWalkable(x,y,who), interactables[], find(c)`.
  `isWalkable(x,y,'npc')` lets NPCs through `L` (the entrance). `'player'` does not.
- `src/core/vision.js`: `canSee(map, viewer, tx, ty)`, `inCone`, `hasLineOfSight`, `angleDiff`, `DIRS`.
- `src/core/fx.js`: `say(game, owner, icons, {kind, ttl, voice})`, `burst(game, kind, x, y, n, opts)`, `shake(game, amount, t)`,
  `sightline(game, from, kind='notice', ttl=0.8)` (a dashed line from an NPC to the player: 'notice' ❓ | 'tattle' ❗👉 | 'caught').
  **Use `say()` for every speech, thought or alert bubble.** It also emits the `'say'` event for audio.
- `src/core/rng.js`: `createRng(seed)` returns `{ next, range, int, pick, chance }`.
- `src/core/events.js`: `game.events.on(name, fn)` and `game.events.emit(name, payload)`.
- `src/data/level.js`: `MAP`, `LEGEND`, `SPOTS` (named tile positions + facing), `ROUTES`, `ZONES` + `inZone(name, x, y)`
  ('meeting_room': cols 9–18, rows 1–5; 'outside': the lobby, rows ≥ 14). `SPOTS.meeting_player` is your (empty, mustard) chair.
- `src/data/schedules.js`: `NPC_DEFS` (id, icon, color, voice, meetingSpot, schedule[]) and `MEETING_GATHER_AT`.
- `src/game/perception.js`: `viewerOf(npc)`, `npcSees(game, npc, x, y)`, `witnesses(game, x, y)`, `spotPos(name)`, `findNpc(game, id)`.
- `src/state.js`: `createGame()` and `resetLoop(game)`. These hold the state shape below.
- `src/game/loop.js`: `startLoop(game)` and `tick(game, dt)`. This is the sim step order. The headless harness uses it too.

## Game state (`game`)
```js
game = {
  // --- persistent (survive loops) ---
  events,                     // event bus
  map,                        // parsed map
  persist: { loop: 0, routesFound: [] },   // routesFound: subset of ['projector','keycard']
  phase: 'title',             // 'title' | 'day' | 'end'
  settings: { showCones: true, muted: false },
  debug: { speed: 1 },        // integer sim multiplier ([ and ] keys)
  time: 0,                    // real seconds since boot (animation clock for render/audio)
  input,                      // set by main.js (see Input)

  // --- per loop (rebuilt by resetLoop) ---
  rng,                        // createRng(SEED)
  fx: { bubbles, particles, shake, lines },   // lines: [{ from: npcId, to: 'player', kind, age, ttl }]
  loopTime: 0,                // real (sim) seconds since loop start
  paused: false,              // main.js only: nothing ticks while true (see Frame / step order)
  clock: { minute: 0, ff: false, forced: 0 },
      // ff: true while fast-forwarding (pretending in place: typing at the desk or a phone call; not the folder stride). Set by player.js.
      // forced: game minutes of assigned work remaining. Set by rules.js; main/loop decrements it.
  player: {
    id: 'player', x, y, dir,
    moving: false,            // moved this step
    held: null,               // null | 'coffee' | 'keycard' | 'sandwich'
    busy: false,              // look-busy button held (and allowed)
    busyPose: null,           // null | 'typing' | 'folder' | 'phone'
    seated: true,             // at own desk (snapped to SPOTS.player_desk)
    smeared: false,           // ate the sandwich: mustard down the sweater (drawn; hunting Lin recognizes it)
    action: null,             // null | { type, targetId, t, duration, sneaky, owner, idle, x, y, item }   (t counts up, seconds; owner/idle copied from ACTIONS; x/y/item from the focus)
    locked: false,            // can't move or act (forced work, caught, end beat)
    focus: null,              // null | { kind: 'interactable'|'item'|'self', id, x, y, icon, action, item }  (✋ hint target; item: the floor item)
  },
  npcs: [],                   // created by the sim's createNpcs(game). See NPC shape.
  world: {
    projector: 'ok',          // 'ok' | 'broken' | 'fixing'
    fixProgress: 0,           // 0..1 while Kev fixes
    keycard: 'rack',          // 'rack' | 'player' | 'dropped' | 'boss'
    jacket: 'rack',           // 'rack' | 'boss'   (render draws the jacket on the rack)
    bossLockedOut: false,
    sandwich: 'fridge',       // 'fridge' | 'player' | 'dropped' | 'eaten' | 'lin'
    coffee: 'pot',            // 'pot' | 'taken': one cup per loop, poured by you or by Kev (2:38). No refills.
    items: [],                // dropped items on the floor: { type, x, y }
    kevGone: false,           // Kev has vanished into the elevator
    linKnows: false,          // hunting Lin saw the mustard on you: her hunt ends
  },
  suspicion: { boss: 0 },     // 0..1
  caught: null,               // null | { by: 'boss', reason: 'action'|'contraband', t }
  outcome: null,              // null | { result: 'win'|'fail'|'caught'|'blamed', routes: [...], newRoutes: [...], loop, minute }
                              // 'blamed': a route was achieved but you weren't in the meeting room at 4:00 (newRoutes empty)
  rules: { seen, lastNotice, working, sceneTold, grudge },   // private to rules.js
  scenario: { beatT, crickets },                              // private to scenario.js (the end beat)
}
```

## NPC shape (created and owned by the sim; everyone else reads it)
```js
{
  id: 'boss'|'lin'|'kev', icon, color, voice, meetingSpot,   // copied from NPC_DEFS
  x, y, dir,                 // dir = body facing (radians)
  glance: { offset: 0 },     // extra head angle in radians (added to dir for vision and head drawing)
  vision: { fov, radius },   // from VISION[id] (config)
  active: true,              // false = vanished (restroom/elevator): not drawn, sees nothing
  pose: 'sit',               // 'sit' | 'stand' | 'walk'
  moving: false,
  override: null,            // null | 'alerted' | 'fixing' | 'hunting' | 'lockedOut' | 'meeting'
  hasJacket: false,          // boss only: wearing the jacket (after 3:35)
  carry: null,               // null | 'coffee': Kev holding the day's cup (poured it, or took it off you)
  wants: null,               // null | 'coffee': Kev found the pot empty (☕❓😩); cleared when he gets the cup
  label: 'sit boss_desk',    // debug string of the current activity
  rng,                       // createRng(SEED ^ hash(id)): per-NPC, so glances don't depend on player actions
}
```

## Module APIs
### Sim (`src/sim/npcs.js`, `src/sim/nav.js`)
- `createNpcs(game)` returns the NPC array (the coordinator assigns it to `game.npcs`). Positions start at each NPC's first schedule spot.
- `updateNpcs(game, dt)`: runs schedules, walking, glances and the sim overrides below.
- `findPath(map, from, to, who='npc')` returns `[{x,y}...]` tile path or `null`. Nav details are up to the sim agent.

**Sim overrides (the sim owns these behaviours):**
1. **Kev repairs.** On `'projector:broken'`, if Kev is `active` and not gone: `override='alerted'`, `say` 🔧❗,
   he walks to `SPOTS.projector`, then `override='fixing'`, `world.projector='fixing'`, and `fixProgress` goes 0→1 over
   `KEV_FIX_MIN` game minutes. Then `world.projector='ok'`, emit `'projector:fixed'`, `say` 👍, and he resumes his schedule
   (this delays his leaving if needed). If he is walking out to the elevator, he turns back.
   When he vanishes at the elevator: `world.kevGone = true`, emit `'kev:left'`.
2. **Jacket and keycard.** When the boss starts his 3:35 entry (he is at his desk): he walks to the coat rack first, takes the jacket
   (`world.jacket='boss'`, `hasJacket=true`, emit `'boss:jacket'`). If `world.keycard==='rack'`, it becomes `'boss'`.
   Then he goes to smoke.
3. **Lockout.** When the boss walks back from outside (3:48), if `world.keycard !== 'boss'` he stops at `SPOTS.door_out`, facing N:
   `override='lockedOut'`, `world.bossLockedOut=true`, emit `'boss:lockedOut'`. Then every ~2.5 s he `say`s one of 😠🚪🪪 / 🪪❓ / 👊🚪
   (kind 'speech'), emits `'boss:bang'` and does a small `shake`. He stays there for the rest of the day.
4. **Lin's sandwich (stretch).** On arrival at the fridge (3:00): if `world.sandwich==='fridge'`, she takes it
   (`'lin'`) and eats at the kitchen table as scheduled. Otherwise: emit `'sandwich:missing'`, say 🥪❓ then 😠,
   `override='hunting'`. She walks `ROUTES.lin_hunt` back and forth (glancing often) until `at('3:24')` (or until she has it back, `world.sandwich === 'lin'`, or `world.linKnows`), then 😤, and resumes the schedule.
5. **Meeting.** At `MEETING_GATHER_AT` (3:55), every active NPC that isn't `lockedOut` gets `override='meeting'` and walks to its
   `meetingSpot`. When the boss arrives: if the projector is broken, `say` 📽️💥🤷. Otherwise `say` 📊👀 (looks at the player's spot).
   Emit `'meeting:gather'` once.
- `away` entries: walk to the spot, then `active=false` until the next entry starts (emit `'npc:vanish' {id}`). Reappear at that
  spot (`'npc:appear' {id}`). `leave` vanishes for good.
- Glances: seated (and standing still) NPCs use the GLANCE_* tunables, with the turn tweened over GLANCE_TURN_TIME. Walking NPCs face their direction of travel (turning
  smoothly), with offset 0.
- NPCs walk at `NPC_SPEED` and pass through the player (no NPC–player collision).

### Gameplay (`src/play/*`)
- `createInput(target=window)` returns the **Input** interface:
  `{ isDown(action), pressed(action), axis() → {x,y} (normalised or 0), destroy() }`.
  Actions: `up down left right interact busy restart pause mute cones slower faster start`.
  `pressed()` is consume-on-read, and an unconsumed press expires after 0.2 s.
  Keys: WASD/arrows; E/Space/Enter = interact (Enter/Space/E also = start); Shift or P = busy (shown to the player as "pretend"); R; Esc = pause; M; V; `[` `]`.
  Prevent default on arrows/space so the page doesn't scroll.
  For node tests, any object with the same interface works (write a scripted fake in the test).
- `updatePlayer(game, dt)`: movement with tile collision (circle radius PLAYER_RADIUS vs solid tiles, sliding along walls),
  busy/pose logic, seated logic, sets `clock.ff`. Locked during forced work (seated, typing).
  Any movement input while seated stands you up.
- `updateInteractions(game, dt)`: finds `player.focus`, starts, progresses and cancels timed actions (ACTIONS in config),
  and applies their results to `world`. Interaction table (`TARGET_ACTIONS`; an action is cancelled `'invalid'` once it stops being offered):
  - coffee_machine + empty hands, coffee 'pot' → brew_coffee → held 'coffee', coffee 'taken', emit 'coffee:taken' {by:'player'}
  - projector + coffee, projector 'ok' → spill_coffee (sneaky) → projector 'broken', held null, emit 'projector:broken', sparks/smoke burst
  - coat_rack + empty hands, keycard 'rack' → take_keycard (sneaky) → held 'keycard', keycard 'player', emit 'keycard:taken'
  - fridge + empty hands, sandwich 'fridge' → take_sandwich (sneaky) → held 'sandwich', sandwich 'player', emit 'sandwich:taken'
  - own_desk → sit (snap to SPOTS.player_desk, seated)
  - holding the sandwich with no other valid target → eat_sandwich (sneaky) → sandwich 'eaten', crumbs, emit 'sandwich:eaten'
  - holding something else with no other valid target → drop it at the player's feet (keycard→'dropped', sandwich→'dropped')
  - empty hands near a dropped item (≤1.0 tiles) → pick_up
  The nearest valid target wins. Movement input during an action cancels it (`'action:cancel' {reason:'moved'}`).
- `updateRules(game, dt)`: witnesses (NOTICE 0.3 s of continuous sight, ❓ at first sight), tattling, owners taking things back,
  contraband, boss suspicion, work assignment (sets `clock.forced = WORK_PENALTY_MIN`, snaps the player to the desk, emits
  `'boss:workAssigned' {reason}`; emits `'work:done'` when it is over), and caught.
  - An action with an `owner` (take/eat sandwich: 'lin') is sneaky only to that NPC. To everyone else it's just lunch.
    An `idle` action (eating) still counts as slacking for the boss's suspicion.
  - The boss seeing a sneaky action, or the keycard in your hand, means caught.
  - Lin/Kev seeing a sneaky action cancel it and shout ❗👉 (`'witness:tattle'`). If the boss is on the floor (active, enforcing,
    not in the 'outside' zone) he hears it: work assigned ('tattle'). If not, the witness keeps a grudge and points you out
    (👉 + what they saw) TELL_DELAY s after the boss is back on the floor (`late: true`).
  - Lin, while hunting, seeing `player.smeared` (even pretending) is reason 'evidence': 🥪❗👉, tattle as for an action
    (heard / grudge 👉🥪), and `world.linKnows = true`, which ends her hunt (sim). Once per loop.
  - Kev, from the projector breaking until it's fixed, tattles once on whoever he sees in the meeting room (always) or within
    SCENE_RADIUS (3.5) tiles of its door (unless pretending). Reason 'scene'.
  - Owners take their thing back on sight (unless you're pretending): Lin the sandwich (→ fridge, or 'lin' if she's
    hunting for it; `'sandwich:returned'`), Kev the coffee, only once `npc.wants === 'coffee'` (→ `npc.carry`,
    `'coffee:confiscated'`). Carrying it is reason 'contraband': Lin 😠🥪 (grumble), Kev 🤤☕ then 😌 via his say queue
    (slurp), no tattle. While `wants === 'coffee'` Kev thinks 🥱☕ every 6 sim seconds (first after 4), skipped while fixing.
  Suspicion and contraband are ignored while the boss's override is 'lockedOut' or 'meeting'.
- `updateScenario(game, dt)`: all phase transitions during a day. After a catch: after CAUGHT_DELAY, the outcome is 'caught'.
  At MEETING_AT: the outcome is decided (see DESIGN.md), `persist.routesFound` is updated (wins only), there is a 2 s in-world beat
  (player locked), then `phase='end'` and emit `'day:end' {outcome}`. Attendance: a route achieved while the player is outside the
  'meeting_room' zone is 'blamed' (the room stares at your empty chair: 🪑❓ then 😠👉).

### Render (`src/render/*`)
- `createRenderer(canvas)` returns `{ render(game) }`. It owns canvas sizing (fit the window, crisp on HiDPI) and draws
  title / day / end screens from `game.phase` and `game.outcome`. It must never mutate gameplay state (fx aging is done elsewhere).

### Audio (`src/audio/audio.js`)
- `createAudio()` returns `{ attach(game), unlock(), update(game, realDt), setMuted(bool) }`.
  `unlock()` is called from the first user gesture (keydown). `attach(game)` subscribes to `game.events` once. The bus is persistent,
  so don't re-subscribe per loop. `update()` runs once per frame (loops/ambience that depend on state, e.g. typing while busy, ⏩ pitch).
  All sounds are synthesized with WebAudio (no asset files).

## Events (name → payload, emitter)
| Event | Payload | Emitter |
|---|---|---|
| `loop:start` | `{loop}` | loop.js |
| `say` | `{owner, icons, kind, voice}` | fx.say (anyone) |
| `action:start` / `action:done` | `{type, targetId}` | interactions |
| `action:cancel` | `{type, reason: 'moved'\|'witnessed'\|'caught'}` | interactions / rules |
| `item:drop` / `item:pickup` | `{type}` | interactions |
| `player:sit` / `player:stand` | `{}` | player / interactions |
| `busy:start` / `busy:end` | `{pose}` | player |
| `witness:notice` | `{by}` | rules (❓, first sight of something sneaky) |
| `witness:tattle` | `{by, reason: 'action'\|'scene'\|'contraband'\|'evidence', heard, late?, icon?}` | rules (❗👉; late = told the boss on his return) |
| `boss:suspicious` | `{}` | rules (the meter starts filling from 0) |
| `boss:workAssigned` | `{reason: 'idle'\|'tattle'}` | rules |
| `work:done` | `{}` | rules |
| `caught` | `{by, reason}` | rules |
| `projector:broken` | `{}` | interactions |
| `kev:alerted`, `projector:fixing`, `projector:fixed` | `{}` | sim |
| `keycard:taken` | `{}` | interactions |
| `keycard:recovered` | `{}` | rules (the boss saw the dropped card; keycard → 'boss') |
| `sandwich:taken` / `sandwich:eaten` / `sandwich:returned` | `{}` | interactions / rules |
| `sandwich:missing` | `{}` | sim |
| `coffee:taken` | `{by: 'player'\|'kev'}` | interactions / sim (the pot is empty now) |
| `coffee:missing` | `{by}` | sim (Kev finds the pot empty: ☕❓ then 😩) |
| `coffee:confiscated` | `{by}` | rules (Kev took it off you) |
| `boss:jacket`, `boss:lockedOut`, `boss:bang` | `{}` | sim |
| `kev:left` | `{}` | sim (elevator ding) |
| `npc:vanish` / `npc:appear` | `{id}` | sim |
| `meeting:gather` | `{}` | sim |
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

## AI-agent harness (`src/agent/*`, `tools/play.mjs`)
An LLM agent (or a script) can play the real game headlessly. `createHarness()` builds a game with a
scripted Input (same interface as the keyboard), and `run('<command>')` executes human-level commands
(`goto`, `interact`, `busy`, `wait`, `move`, `sit`, `continue`, `restart`) by pressing virtual keys frame by frame,
mirroring main.js (fast-forward and forced-work multipliers included). Commands stop early on notable events.
`observe()` returns a text view limited to what a human can see: map, watched tiles, people, bubbles, HUD.
NPC schedules are hidden unless `{debug:true}`. The CLI replays a session's command log on every call
(the game is deterministic), so no server is needed.
`tools/fuzz.mjs` searches over harness plans for surprising outcomes (MAP-Elites over outcome bins keyed by
result, routes and milestones; winning plans are shrunk to a minimum; each timed wait of a minimal win is slid
across the day to measure the real windows). `node tools/fuzz.mjs [--budget 20000] [--seed N] [--verbose]
[--json out.json]`, ~1 ms per day per core, worker_threads. Its report is for a designer, not a pass/fail test.
`tools/golden.mjs` is the refactor safety net: it replays a fixed corpus (`tools/golden.json`: one plan per outcome
the fuzzer found, plus hand-written ones with raw movement and several loops) and compares a digest of every event
and of the contract-level state after each command. A refactor must leave it passing. Re-record (`--write`) only
for an intended behaviour change, and say so in the commit.
**Implication for everyone:** gameplay must not read wall-clock time (`performance.now`, `Date`) or `Math.random`.
Only `input.js` may use real time, for press expiry.
