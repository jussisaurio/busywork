# Audit: render-audio (2026-11-14, read-only, independent subagent)

Line numbers refer to commit ab07216.

## Presentation-layer audit (render, audio, fx): findings ranked by payoff

I changed no project files. `node tools/test-render.mjs` and `node tools/test-audio.mjs` both pass as the code is now.

**Determinism: no problems found.** Nothing in src/render, src/audio or src/core/fx.js references `game.rng`. `Math.random` appears only in fx.js `burst` (visual) and in audio. I grepped for assignments to game, world, npc or player fields in render and found none; the only writes are to the local cache objects in `mapInfo`. No sim or play code reads `game.fx`. The one outside reader is agent/harness.js:419, which reads bubbles to build observation text, and it runs `updateFx` with `FIXED_DT`.

### 1. Particle colour and rotation flicker. This is a real bug.
- **Where:** effects.js:182 `seed = hash(Math.floor(ttl * 100003), i)`, where `i` is the particle's position in the array.
- **What's wrong:** `updateFx` (fx.js:76) filters out dead particles. Every surviving particle after a dead one moves to a new index, so its seed changes and it flips colour or rotation mid-flight. This affects smoke shade, spark colour and confetti.
- **Fix:** use `hash(Math.floor(ttl * 100003))`. `ttl` is already random per particle and does not change.
- **Effort:** S. **Risk:** none (it removes the flicker).

### 2. Map-specific geometry: this blocks a second level
The office layout is hardcoded in several places:
- **util.js:7-8:** `MAP_W` and `MAP_H` come from the imported level-1 `MAP`, not from `game.map`. Canvas size, the static-layer size, the renderer clip and the bubble clamp all depend on them.
- **world.js:17-36 `chairList`:** literal chair positions (13,12), (22,12), the meeting rows at y=5 and y=2, (24-26,4) and (25,2), plus the fallback `{x:13,y:5}` and the `mine.y !== 5` check.
- **world.js:594-622:** literal positions for windows, paintings and cabinets.
- **world.js:121:** projection screen at `x: 15*T`.
- **world.js:730-738:** meeting notepads at literal x positions.
- **world.js:1076-1102:** wall clock at (17,6).
- **world.js:40-60 `mapInfo`:** flood-fills zones starting from the global `SPOTS`, even though level.js:66 already defines `ZONES`.
- **hud.js:136:** the key legend sits on "map rows 14-16".
- **audio.js:21-22:** `MAP_W = 30` and `LOBBY_Y = 13.5`, which repeat level.js:68 `ZONES.outside`. audio.js:28 also re-implements `perception.spotPos`.

**Fix:**
- Add a `DECOR` block to the level data (chairs, windows, paintings, cabinets, clock, screen, notepads) and have world.js iterate it.
- Derive view size from `game.map.w/h`, or pass it to `createRenderer`.
- In audio, use `inZone('outside', …)` and the `spotPos` from perception.
- Before the change, record a ctx-call log with the recording fake ctx that test-render already uses, then diff it afterwards to prove the drawing is unchanged.

**Effort:** L overall (the audio and util parts are S). **Risk:** low, given the ctx diff.

### 3. Boss smoke pose depends on the sim's debug label
- **Where:** characters.js:831 `n.id === 'boss' && !ov && n.label === 'visit smoke'`. The label string is built at npcs.js:293 as `` `${e.do} ${e.spot ?? e.route}` ``. Rewording that label silently breaks the pose.
- **Fix:** have the sim also write a field nobody reads back, e.g. `npc.doing = { do, spot }`, next to the label, and test `n.doing?.spot === 'smoke'`.
- **Effort:** S. **Risk:** low (gameplay is unchanged because the sim never reads the field).

### 4. Cone "notice" glow disagrees with the actual rules
- **Where:** cones.js:39-53 `noticeLevel` versus rules.js:69-82 `offenceFor`.
- **What's wrong:** the cone glows in cases where the rules ignore the player:
  - an owner-scoped sneaky action seen by someone who is not the owner (the rules require `!owner || owner === npc.id`);
  - a locked-out boss;
  - Lin seeing the sandwich while the player is busy (the rules let busy hide contraband).
- It also never glows in cases where the rules do react: `scene`, `evidence` (the smear), the boss and the keycard, and Kev's claims.
- It runs an extra `npcSees` raycast per NPC per frame and hardcodes `'boss'` and `'lin'`.
- The rules keep their per-NPC timers in a WeakMap (rules.js:39-46), so render cannot read them.
- **Fix:** have rules publish a read-only copy each tick, e.g. `game.watch[id] = { offence, k: seen/NOTICE }`, and have cones draw from it.
- **Effort:** M. **Risk:** low (the visual change is a fix, and gameplay is unchanged because nothing reads the copy).

### 5. Two copies of the "reset person" code, already out of sync
- **Where:** screens.js:13-19 `person()` duplicates characters.js:775-779 `resetState`. Both `person()` and `personState()` (characters.js:49-55) leave out `mustard`.
- **Fix:** add `mustard` to `personState`, export `resetState`, and have screens call it and then set `dir`/`head` to π/2.
- **Effort:** S. **Risk:** none.

### 6. NPC lookup and head-height numbers repeated
- **NPC-by-id loops:** effects.js:26-31, 283, 399; renderer.js:118-126; screens.js:366-370; audio.js:113-119. `perception.findNpc` already exists, and render may import it (test-render bans only sim/ and play/; cones already imports perception).
- **Literal head offsets:**
  - effects.js:31 bubble anchor: boss 36, others 30, +3 when sitting.
  - effects.js:293 eyes: boss 14, others 12.
  - effects.js:403-404 suspicion meter: +17 and -46.
  - These are the boss's `tall: 1.12` from `LOOKS` written out by hand.
- **Fix:** add per-look fields (`bubbleDy`, `eyeDy`) to `LOOKS` with exactly the current values, plus a `headY(n)` helper, and use `findNpc` everywhere.
- **Effort:** S-M. **Risk:** none if the values are kept exactly.

### 7. Duplicated drawing code
- **Projection screen, four versions:** world.js (decor and beam); screens.js:429-434 `tableauProjector` (dead screen, 386/100/188, scanlines every 11 px); screens.js:472-481 (fail slide); screens.js:684-699 `meetingScreen` (the same shape with 104/62 and 10 px scanlines).
- **Clock hands:** world.js:1076-1102 and hud.js:166-168.
- **Confetti colours:** effects.js:168 `CONFETTI` and screens.js:351 (the screens copy is missing olive).
- **Sweat drop:** characters.js:404-416 and effects.js:227-236.
- **Paper flurry:** characters.js:420-436 and effects.js:208-221.
- **Star:** world.js:1061 `sparkle` versus util `starPath`.
- **Fix:** shared helpers that take the current sizes as parameters: `drawScreen(x, y, w, h, {dead, scan})`, `clockHands`, a `CONFETTI` constant in palette, and `drawDrop`/`drawPaper` in util.
- **Effort:** M. **Risk:** low (keep both sets of numbers as parameters).

### 8. Dead code and stale comments (one batch)
**Effort:** S. **Risk:** none.
- world.js:600 `drawPainting(...) || null;`: drop the `|| null`.
- world.js:809 `if (owner !== 'player' || true)`: always true, so remove the condition.
- Dead `fillStyle` assignments, immediately overwritten: world.js:1222 and screens.js:402.
- Exports nobody uses anywhere:
  - `dropShadow` (effects.js:459) and `lerp` (util.js:68).
  - palette `chipOk`, `chipBad`, `chipWarn`, `chipNeutral`.
- Palette duplicates:
  - `cream` and `hudText` have the same value (#f3e6c8).
  - Literal copies of palette colours: `'#3d7a72'` (= `meetingRug`) in screens, and `'#2a211b'` (= `ink`) in util `keycap`.
- audio.js:125: the regex fallback in `posOf` can never run. Its only caller (audio.js:191) passes `p.owner`, which is the object for point owners (fx.js:30).
- fx.js:2: the comment mentions "'fx:*' events", but none are ever emitted.
- sfx.js:194: the comment "❓ Soft 'hm?' blip" sits above `slurp`; it belongs to `notice()` at line 203.
- Unused `t` parameter in `drawBubble` (effects.js:50) and `drawVignette` (effects.js:448).
- characters.js:783: `itemIcon` handles an object `held`, but `held` is always a string.
- Exported but only used inside their own module: `mapInfo`, `castRay`, `noticeLevel`, synth `flat`.

### 9. Schedule times scattered across modules
- **Where:** world.js:1000 beam at `at('3:55')`; audio.js:23-25 at 3:50, 3:55 and 3:57; hud.js:14 `RED_AT` at 3:50. The sim gathers for the meeting at **3:54** (schedules.js:73), so none of these follow from a rule. They are separate cosmetic times.
- **Fix:** name them in config or level data so a second level can retime them.
- **Effort:** S. **Risk:** none.

### 10. Particle slowdown depends on frame rate
- **Where:** fx.js:73-74, `p.vx *= 0.92` once per frame, not scaled by `dt`. On a 120 Hz display, particles travel noticeably less far.
- **Fix:** multiply by `Math.pow(0.92, dt * 60)`. This is identical at 60 Hz.
- **Effort:** S. **Risk:** low (visual only; the coordinator owns fx.js).

### 11. Audio guessing game content
- audio.js:194 plays crickets by looking for the 🦗 icon in sign bubbles.
- audio.js:225 hardcodes `kev → slurp`.
- audio.js:325 hardcodes the meeting murmur voices `['boss','lin','kev']`.
- sfx.js:204, 211 and 224 have per-id pitch tables.
- **Fix:**
  - Scenario emits an explicit event, or `say` gets an `sfx` option, for the crickets.
  - The meeting murmur iterates the active NPCs in `game.npcs`.
  - Pitch is derived from `VOICES[id].f0`.
- **Effort:** S-M. **Risk:** low (audio only).

### Looks messy, but leave it
- **Module-level scratch objects** in characters.js (`HAND`, `G`, `S`, `order`) and the `BUBBLE`/`P` objects in screens: they avoid allocating per frame. `G` is shared implicitly with `drawHeldItem`, but that is fine.
- **The `fin()` guards everywhere, and the font and text-width caches:** cheap, and they keep the fake-ctx tests stable.
- **`castRay` overlapping vision.js:** the cones need ray distances, which `canSee` does not return.
- **Hardcoded HUD and tableau pixel positions:** relative to the view, not the map.
- **renderer.js:191 calling `ctx.restore()` 32 times in the error path:** crude but it works, and it keeps the animation loop running.
- **renderer.js:99 `minute >= MEETING_AT` for the end beat:** it only triggers a camera move.
- **Code that branches on which `LOOKS` entry a character uses:** only four characters, and readable.
- **sfx.js recipes that build their audio nodes by hand** (`creak`, `scratch`, `rewind`, `sadTrombone`, `crickets`): each one is a different sound, so a shared builder would not save anything.
- **renderer.js:62-78 `ensureLayer` caching on `kx` only while sizing the height with `ky`:** harmless as long as `fit()` keeps the aspect ratio.
