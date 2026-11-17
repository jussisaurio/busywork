# Audit: level-authoring (2026-11-14, read-only, independent subagent)

Line numbers refer to commit ab07216.

BUSYWORK level-2 audit (read-only; no project files touched)

One thing first: a golden-trace check already exists. `node tools/golden.mjs` replays 163 plans and currently reports all identical in 0.8 s. Its digest covers every event (loop, minute, name, payload) plus a snapshot. That snapshot (tools/golden.mjs `snapshot()`) hard-reads `g.suspicion.boss`, every primitive field of `g.world` plus `items`, `persist.routesFound`, and the NPCs in array order. Harness text is not in the digest. So for level 1 you can freely change the harness text, but you cannot rename or add world fields, the suspicion key or event names without re-recording.

## Findings, ranked by payoff

**1. Level data is imported statically everywhere (b, M). This blocks everything else.**
state.js:6,13 (MAP/LEGEND); perception.js:3,27 (`spotPos` reads global SPOTS); sim/npcs.js:17-18 (SPOTS, ROUTES, NPC_DEFS, MEETING_GATHER_AT); rules.js:15 (inZone); scenario.js:37; harness.js:14; render/world.js:6; audio.js:13. Also render/util.js:3-8, where MAP_W/VIEW_W are computed from the level-1 MAP when the module loads, and main.js uses VIEW_W/VIEW_H to size the canvas and map the mouse.
Change: `createGame({level = level1})` sets `game.level`. `spotPos(game, name)` and `inZone(game, ...)` resolve through it. Keep a fixed 30x17 view for now, or level 2 must re-layout HUD and pause-button pixels (hud.js:52 x:918).

**2. Generic mechanics in sim/npcs.js are wired to one NPC, often by spot name (b, some c, L).**
- npcs.js:67: any NPC whose schedule visits spot `'fridge'` gets Lin's sandwich prelude. npcs.js:93: any NPC visiting `'smoke'` gets the boss's jacket/keycard pickup. npcs.js:289: arriving at `'coffee'` always runs `coffeeArrive`. A level-2 author who reuses these spot names inherits these behaviours without knowing.
- npcs.js:210-216 and 417-437: `npc.id==='kev'` repairs `world.projector`, using config KEV_FIX_MIN. npcs.js:405-408: Kev leaving sets `kevGone`.
- npcs.js:297-298 and 450-469: the boss is gated at door_out by the keycard. Row `OUTSIDE_Y=14` (npcs.js:28) duplicates ZONES.outside.
- npcs.js:218-221, 272, 29: Lin's hunt (`ROUTES.lin_hunt`, HUNT_END 3:24). npcs.js:530-540: the boss presents at the meeting. npcs.js:174-184: craving.
Change: schedule entries name hooks explicitly (`prelude:'raidFridge'`, `arrive:'pourCoffee'`), resolved from a behaviour registry. Add cast traits: `repairs:{device, minutes}`, `gate:{item, zone, door}`, `hunt:{route, until, item}`. Leftovers like the presenter go into level hooks.

**3. rules.js hardcodes roles by id (b, M).**
- `OWNS={lin:'sandwich',kev:'coffee'}` and the Kev special case in `claims` (31-35).
- `SCENE_DOOR={x:14.5,y:6.5}` (29) is a raw coordinate.
- Only Kev investigates the scene (61).
- The boss is the authority: 49-56, 73, 80 (keycard is contraband), 102, 173 (only the boss catches you), 213, 234, 256, 261, plus `suspicion={boss:0}` (state.js:61).
- Lin's mustard evidence (78, 182). Sandwich-vs-coffee return branches (186-197). Emoji tables (201-212).
Change: cast roles `authority`, `owns:{item, when}`, `investigates:{zone, door}`, `evidence:{mark}`. Keep the key `suspicion.boss` for level 1 (golden).

**4. World state and interactions are one hand-written switch (b/c, M).**
- state.js:49-60: world shape.
- interactions.js:33-50 (`verbFor`), duplicated by `stillValid` at 142-161.
- `completeAction` 163-214; item-to-world sync 208-209, 232-233; eat_sandwich at 75.
- config.js:43-50: ACTIONS mixes generic and level actions (`owner:'lin'`).
Change: `level.initialWorld()` plus an interaction table `{on, when(w,p), action, apply(game)}` that both verbFor and stillValid use. Keep level-1 world field names exactly.

**5. Win routes and end screens (a/c, M).**
- scenario.js:66-68: route predicates (`bossLockedOut` gives keycard, broken projector gives projector).
- util.js:19 ROUTE_ICONS, duplicated in harness.js:368. hud.js:42 route slots.
- screens.js:187-209: ROW_ICONS and endKind. 256-260: hand-drawn tableaux. 286: centring assumes exactly 2 slots.
- `persist.routesFound` is global (state.js:14).
Change: `level.routes=[{id, icon, achieved(world)}]` and `level.endScenes` (these stay code). Store found routes per level, with `routesFound` kept as an alias to the current level's array so the golden snapshot is unchanged.

**6. Day and clock constants (a, S-M).**
config.js:9-10, 22 (DAY_START/END, MEETING_AT; `at()` assumes PM); MEETING_GATHER_AT; npcs.js:29-40; world.js:1000 (beam at 3:55, a separate literal from gather at 3:54); hud.js:14-15; audio.js:23-25; scenario.js:54; harness.js:233, 237, 369; screens.js:60 mission text.
Change: `level.day={start, end, gatherAt, meetingAt}`. Copy the literals, don't derive them.

**7. Render art pinned to level-1 tiles (a, M).**
world.js: 17-35 chairs (`add(13,12)`, meeting rows), 58-62 zone flood seeds, 102-104 desk owners `['lin','kev']`, 121 screen, 594-610 windows, paintings and cabinets, 730/735 notepads, 780-830 owner props, 1078 wall clock `x=17`. hud.js:134-136 places the key legend on a known blank wall.
Change: `level.decor={chairs, windows, paintings, clock, screen, legendAt, deskOwners}`. The static-layer cache is already keyed by map, which is good.

**8. Cast looks and perception by id (a/b, S-M).**
characters.js:7-24 LOOKS and 820-852. characters.js:831 picks the boss's smoking pose by reading the sim's debug label string `'visit smoke'`; renaming that label silently breaks the art. Also effects.js:26, 291 (boss height); cones.js:42-49, 75; palette.js:96-101 CONE_TINT; config.js:54-64 VISION and GLANCE_EVERY_BY; babble.js:29-59 VOICES.
Change: the cast def carries look, tall, vision, glance, cone tint and voice. Schedule entries carry `anim:'smoke'`, exposed as `npc.anim`.

**9. Harness and audio tables (a/c, M).**
- harness.js: 19 SOFT_STOP, 23-50 LANDMARKS/HELP, 346-362 VERBS/WORLD_TEXT, 413-427, 446, 453-462, 479-513 describeEvents.
- audio.js: 21-22 MAP_W/LOBBY_Y, 193 (crickets keyed on an emoji), 223-230, 248-261 (sound per action at a spot), 276-334 event handlers, 321 murmur voice list, 445.
Change: `level.harness={landmarks, worldText, describe}` and `level.sounds={actions, events}`. Landmark names are inputs to the golden plans (`goto lin_desk`, `meeting_seat`), so keep them.

**10. Tests are level-1 tests (d, S).**
test-play, test-sim, test-render, test-audio, routes.mjs, fuzz.mjs:33 TARGETS. Keep them on the level-1 default. Add a tiny fixture level to test mechanics on their own.

## Level module shape

```js
export default {
  id: 'l1',
  map: { rows, legend }, spots, zones, patrols,            // from data/level.js
  day: { start, end, gatherAt, meetingAt },
  playerStart: 'player_desk',
  cast: [ // ORDER IS BEHAVIOUR: boss, kev, lin
    { id, look, tall, coneTint, voice, vision, glanceEvery, meetingSpot, schedule,
      roles: { authority, owns, investigates, repairs, gate, hunt, evidence } } ],
  items: { coffee: { icon }, keycard: { icon, contraband }, sandwich: { icon, edible } },
  actions, interactions,                    // table {on, when, action, apply}
  initialWorld: () => ({ projector: 'ok', /* ... */ }),
  behaviours: { raidFridge, takeJacket, pourCoffee, gateDoor, present },   // named hooks
  routes: [{ id: 'keycard', icon, achieved: (w) => w.bossLockedOut }, /* ... */],
  mission, endScenes, decor, harness, sounds,
};
```

Systems read `game.level`; no module imports `src/data/*` except the level-1 assembler.

**Reset per loop:** rng, fx, clock, player, npcs, `world = level.initialWorld()`, suspicion, caught, outcome. The rules and scenario state in WeakMaps keyed on `game.player` resets implicitly because resetLoop creates a new player.
**Kept per level:** `game.level`, the parsed map, renderer layer cache, found routes.
**Kept for the session:** event bus, audio attach.

## Extraction order (run golden.mjs after each step)

0. Add `game.level` (assembled from the existing data files). Nothing reads it yet.
1. Plumbing: spotPos, inZone, ROUTES, NPC_DEFS and MAP go through `game.level`.
2. Copy constants into level 1 as literals: day, timings, VISION/GLANCE, OWNS, SCENE_DOOR, icon tables, LOOKS, CONE_TINT, decor coordinates, harness tables.
3. `initialWorld`, route predicates, one ROUTE_ICONS source.
4. Interaction table (merge verbFor and stillValid).
5. Rules roles.
6. Sim behaviours, one per commit. Replace the spot-name triggers with explicit hooks. Dispatch inside the same per-NPC step, at the exact point where today's `npc.id===` check sits.
7. Render: decor, `anim` instead of label, end scenes.
8. Audio and harness.
9. Per-level found routes behind the `routesFound` alias.

## Determinism fragilities

- Each NPC's rng is seeded by `SEED ^ fnv1a(id)`, so renaming an id changes glance timing. Glances are the only rng consumers: `game.rng` (state.js:28) is created but never drawn (checked with grep). The draw order is the initial timer in createNpcs, then angle, side and timer on each expiry (npcs.js:559-561). They draw whether or not the NPC is visible. Keep the `range(...glanceEvery)` argument shape.
- Cast order (boss, kev, lin) drives updateNpcs, the witness loop in rules (the first witness wins and returns early), meeting gather, the order of `say` calls and events, and the NPC order in the snapshot.
- Plan key strings (`fix#seq`, `hunt#seq`, `meeting#seq`) and leg order (fridge prelude, then jacket prelude, then the main leg) must stay exact.
- Event names and payload shapes are digested. Keep `kev:alerted`, `kev:left`, `sandwich:returned` and the rest as they are for level 1; don't rename them to generic names.
- Any new primitive field on `world` changes every digest. Put level refs on `game`, never on `world`.
- tick order is player, interactions, NPCs, rules, scenario, clock. Don't move hook calls between phases.

## Looks messy but leave it

- core/* (map BASE_LEGEND, vision, rng, events, nav), input.js, player.js (except `spotPos('player_desk')` at line 73).
- The fx.js module-level `bubbleSeq`: never reset, but used only for bubble ids, not in events. `Math.random` in fx.burst only affects visuals.
- The torso-detail drawing code and the `lookFor` fallback in characters.js: move LOOKS, keep the code.
- The sfx recipes (fridgeOpen, slurp). Only the event-to-sound mapping is level data. The sfx.js:204 pitch map has a default.
- End-screen tableaux as hand-drawn code: that is legitimately per-level code (c).
- `at()` being PM-only, unless level 2 happens in the morning.
- The level-1 golden corpus and tests.
