# Audit: sim-play-core (2026-11-14, read-only, independent subagent)

Line numbers refer to commit ab07216.

BUSYWORK audit (core, game, data, sim, play, agent, tools). Read-only: no project files were changed. Paths are relative to /Users/jussi/projects/busywork.

## Findings, ranked by payoff

**1. Per-loop rule and scenario state lives in WeakMaps keyed by `game.player`.** rules.js:38, scenario.js:18. State resets only because resetLoop builds a new player object. That is an implicit dependency, the state is hidden from the harness and debugger, and the same pattern appears twice.
Fix: create `game.rules = {...}` and `game.scenario = {...}` in resetLoop (state.js) and delete both WeakMaps and their get-or-create helpers. Effort S. Risk low: the initial values must be the same and must be set at the same point in resetLoop.

**2. The game and tests each re-implement the tick.**
- main.js:84 and harness.js:63 compute the same frame multiplier: `(forced>0 ? FORCED_MULT : ff ? FF_MULT : 1) * debug.speed`.
- The canonical clock advance is loop.js:25-28. test-sim.mjs `runDay` (~29-88) re-implements it, and test-play.mjs `step()` (~100-117) re-implements tick and leaves out updateNpcs.
- test-play `newDay` re-implements startLoop.
If tick order or clock rules change, the tests keep passing against stale copies.
Fix: export `frameMult(game)` and `advanceClock(game, dt)` from loop.js and use them in main, harness, test-sim and test-play. test-play's step() can keep skipping NPCs on purpose, but it should still call advanceClock. Effort S/M. Risk none.

**3. Play code reaches into private sim fields, and the sim defends against test fakes.**
- rules.js:204 pushes onto `npc._sayQ`.
- stareAtEmptyChair (npcs.js:513-522) has `if (n._gl)` and `(n._sayQ ??= [])`, while every other `_sayQ` push in npcs.js (482, 501) assumes the field exists. The guards are there only because test-play `fakeNpc` (~64) builds NPCs without `_sayQ`/`_gl`.
- test-play:679 asserts on `kev._sayQ`.
Fix: export `npcSayLater(npc, t, icons, kind)` from npcs.js and use it in rules. Make fakeNpc build through a small exported NPC factory, or spread a template from createNpcs, so the guards can go. Effort S. Risk none.

**4. Two copies of the "outside" rule.** npcs.js:28 has `OUTSIDE_Y = 14` (used at :297). rules uses `inZone(ZONES.outside)`, and ZONES.outside.y0 = 14 in level.js. test-sim also hard-codes `y >= 14`. If the map changes, these drift silently.
Fix: use `ZONES.outside.y0` or `inZone` everywhere. Effort S. Risk low: keep the `Math.floor(y) >=` semantics.

**5. Interaction predicates are duplicated, and the harness reads private fields.**
- verbFor (interactions.js:33-50) and stillValid (142-161) encode the same per-target conditions.
- Line 147 uses `game.world.coffee` where the rest of the function uses `w`.
- The focus object carries `_action` and `_item` (62, 70, 76), and the action carries `_x`, `_y`, `_item` (135-137).
- harness.js:353 reads `f._action`, and harness VERBS (:346) duplicates FOCUS_ICONS.
Fix: one `targetAction(game, target)` table that both functions use. Rename the fields to public `action`/`item` (they are already part of the harness contract). Derive VERBS from the same table. Effort S. Risk none if the predicate order is kept.

**6. Dead code.** All confirmed by grep. Effort S, risk none.
- state.js:28: `game.rng = createRng(SEED)` is never read. Only per-NPC rng is used, at npcs.js:559-561. Removing it changes no rng draws, because it is a separate stream.
- config.js:10: `DAY_END` is unused. MEETING_AT is the live constant.
- harness.js:358-362: WORLD_TEXT.keycard and .sandwich are unused. Only .projector is read, at :427.
- fx.js:55, :77: `fx.lines` guards for a field that does not exist.
- player.js:57: `!(game.clock.forced > 0)` can never be false at that point.
- test-core.mjs:22: the assertion is vacuous (`|| true`).
- Exports used only inside their own module: BASE_LEGEND, clearLine, standUp, moveWithCollision, resolveCircle, ITEM_RADIUS, FOCUS_ICONS, findFocus, assignWork, caught, focusText, renderMap, and fuzz's planToCmds and evaluate. Remove `export` unless they are kept as test seams.

**7. Stale comments and contract drift.** Effort S. Risk none, except for the last item.
- schedules.js:18 says "At 3:55", but :73 is `MEETING_GATHER_AT = at('3:54')`. CONTRACTS.md also says 3:55.
- npcs.js:41-42: the "only 5 min before" comment is stale.
- npcs.js:227 says "3:02 entry", but the entry is at 3:04.
- CONTRACTS.md lists the action:cancel reasons as moved|witnessed|caught. The code also emits `'locked'` (interactions.js:86), `'invalid'` (:95) and `'meeting'` (scenario.js:77). Update the contract.
- rules.js:237: assignWork always cancels with `'witnessed'`, even for the idle path (eating in view). The label is wrong, but changing it changes the golden trace, so do that separately and on purpose.

**8. Fuzz time math and reproducibility.**
- fuzz.mjs:60-63: `fmt` hard-codes 150.
- fuzz.mjs:154-157: re-parses "until H:MM" with `-150`. Both re-derive at() and formatClock from config.
- fuzz.mjs:30: `LAST_MINUTE=89` is a magic constant.
- fuzz.mjs:291: `BATCH = nWorkers*24`, with nWorkers from availableParallelism() (:240). The same seed gives different archives on machines with different core counts.
- fuzz.mjs:172: a convoluted `used` Set.
Fix: import at/formatClock and use a fixed BATCH, or derive it from a flag rather than the core count. Effort S. Risk: changes the fuzz output only. The game trace is not affected.

**9. Three fake Input implementations.** agent/scripted-input.js, test-play createFakeInput (~29-56), and the input in test-sim. Fix: make the tests use scripted-input. It may need hold/steer helpers added. Effort M. Risk none.

**10. scenario.js:87-95 inlines the presenter snap and the `player:stand` emit.** This duplicates player.js standUp and sitAtDesk. Fix: call standUp, but keep the emit order relative to the other scenario events. Effort S. Risk low: the trace order must stay the same.

**11. Inconsistent `voice` on say events.** rules' say() leaves out `voice`, while the sim passes `voice: npc.voice`. The result is the same only because voice === id for every NPC. Fix: always pass it, or derive it in say(). Effort S. Risk low: if voice is added to rules' payloads, the logged event payloads change. Decide whether the golden trace compares payloads.

**12. harness.js is 523 lines and mixes four jobs:** commands, BFS navigation, observe() text, and event narration. It also has a hard-coded 'time ×6' at :393, which should come from FF_MULT. Fix: split it into harness/commands.js and harness/observe.js. Effort M. Risk none.

**13. Determinism and hidden order dependencies.** Note these in comments. Do not change the behaviour.
- fx.js:6: module-level `let bubbleSeq` persists across games and harness instances in one process, so bubble ids depend on what ran before. Move it to game.fx. Effort S. Risk low: only ids change. Check whether the trace logs bubble ids.
- main.js:69/87: ad-hoc `game._endedAt`. Declare it in state.js. Risk none.
- rules.js:128: the early return makes the result depend on game.npcs order (boss, kev, lin, from NPC_DEFS order).
- npcs.js:189: the say queue releases only from the head, so a short delay queued behind a long one waits for it.
- rules.js:213 re-finds the boss that it already has in scope. This is harmless.
- npcs.js:89: `_schedule: sched` shares the NPC_DEFS arrays. test-sim (~319-323) temporarily mutates that schedule, which also changes it for every other test in the run. Clone it in createNpcs (risk none) or restore it in a `finally`.
- fx burst uses Math.random. This is visual only: gameplay and observe() never read particles. Leave it, or move it to a seeded fx rng for screenshot determinism.

**14. tools/routes.mjs repeats its predicates.** The `npc` helper at :28 re-implements findNpc. The boss-out-of-office predicate is repeated at :131, :169 and :186, and the Lin-glance predicate at :135 and :189. Fix: import findNpc and name the two predicates. Effort S. Risk none.

## Looks messy but leave it

- **Harness BFS (harness.js:118-150) next to A* findPath.** BFS is unweighted and its tie-breaking differs from A*. Swapping it changes the harness paths and the route and fuzz outcomes. Risk high.
- **The glance timer draws rng even when no glance is shown.** This keeps each NPC's rng stream independent of what the player does. Gating it would shift every later draw.
- **test-sim's own day loop.** It exists to drive the sim without play rules. Share only advanceClock (finding 2) and do not merge it into tick.
- **planKey strings and spot-name or id special cases in buildPlan, entryFlags and coffeeArrive** ('fridge', 'smoke', 'coffee', 'boss', 'kev'). This is level-1 content wiring. It is ugly but contained and reads clearly.
- **dropHeld's sandwich branch.** It looks dead, but assignWork reaches it.
- **The boss sneaky-action check does not exempt 'meeting'** (rules.js:50 exempts only for presence). This matches the contract.
- **NPC_DEFS order.** It sets update, vision and rule order (finding 13). Do not reorder it or sort it by id.
- **`_gathered` once-flag on NPCs (npcs.js:117).** It could move to game.scenario. It works, and moving it is risky for little gain.
