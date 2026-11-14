# Design jam: outcome

The jam ended after the ideator's pitch (`thread/001-ideator-PITCH.md`). From here on, levels are prototyped
and judged by playing them and by the fuzzer gate, not by review rounds.

## Topic A: decided, A1 "The Mug"

Attendance stops being a blame rule. The coffee itself becomes the evidence. The prototype builds on the new
level format, as the first real authoring test after the refactor.

**Rules:**
- `spill_coffee` leaves an empty mug in your hand; it no longer vanishes.
- After an NPC has seen the broken projector, the mug in your hand is contraband to that NPC:
  - the boss seeing it = caught;
  - Lin seeing it = tattle.

  Pretend hides it, as it hides every held item in level 1.
- At 4:00, if the projector is broken, the boss is in the meeting, and you are holding the mug, the stare chain
  runs: projector, then the mug, then 😠👉. You are BLAMED.
- There are two ways to get rid of the mug:
  - put it back on the coffee machine;
  - plant it on Kev's desk. The 4:00 stare then lands on Kev's empty chair, so the existing empty-chair
    animation becomes a win gag.
- No new rule for the keycard route: the boss is locked out, so nobody can blame you.
- A2 (the splash-back stain) is not built. As the ideator says, it is a reflex, not a decision.

**Watch in the playtest:**
- Is ditching the mug a chore on the projector-only route?
- Does the double win become a planned route? The planned order is: spill, ditch east, then cross west to the
  rack before 3:35.

## Level seeds (starting ideas for prototypes; nothing is decided yet)

- **Weekend Shift** (lesson: noise turns heads). The engine needs `noise(x, y, r)`: NPCs who hear it turn
  toward the source. Then the player makes their own windows.
- **Farewell Card** (lesson: the target moves). The engine needs ownership that changes on a schedule.
- **Employee of the Month** (lesson: a witness who copies you). The engine needs a mimic action queue. Expensive
  to build.
- **Arc idea:** "the office learns". Each level opens with the last trick visibly patched (for example, a
  keycard on a lanyard).
