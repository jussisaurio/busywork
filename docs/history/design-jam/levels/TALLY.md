# Level ideas: mechanics tally and decisions (designer-in-chief, 2026-11-14)

Sources:
- 24 sketches: `same-office.md`, `new-workplaces.md`, `mechanic-first.md`
- 3 pitched levels and "The Mug": `../thread/001-ideator-PITCH.md`

The three ideators worked independently. **Three of them each wrote a level called "Lights Out".** When ideas
converge like that, it is a signal worth acting on.

## What the ideas need

| Mechanic | Uses | Already in level 1 as… |
|---|---|---|
| **Put down an item on a spot** (the spot's owner then acts on it) | ~10: The Mug, The Audit, Out by 3:30, Surprise Party, Staff Room, Coat on the Chair, Yellow Sticker, museum Lights Out, Fire Door wedge, Robo-Vac, Farewell Card swap | nothing; dropping only happens via hooks |
| **Inspection** (an NPC checks a list of item-on-spot or person-in-place targets and shows ✔️/❌ over each; a ❌ changes their schedule) | ~7: Fire Drill, The Audit, Late Again, Out by 3:30, Staff Room count, call-centre tally, The Mug's 4:00 check | the 4:00 meeting check |
| **Lure** (a world event pulls one NPC over to deal with it for N minutes, then they resume) | ~7: Hold Music, the three Lights Outs (walk to the switch), The Monitor (static), copier jam, hospital buzzer | **Kev's projector repair** |
| **Hunt** (an NPC searches for a missing item or person until a set time) | ~5: The Mug, Walk-In chef, Fire Drill sweep, Print Queue ream, Farewell Card | **Lin's sandwich hunt** |
| **Doors** (closed doors block sight; keyed or timed; anyone can follow through) | ~6: Fire Door, Late Again, Walk-In swing door, Going Down, Lights Out corridor | **the boss's keycard lockout** |
| **Attention / noise** (NPCs in earshot turn toward a sound for about 1.5 s) | ~6: Weekend Shift, door thunk, Robo-Vac, phone ring, C-stand crash, light-switch clack | glances (rng-timed only) |
| **Darkness** (sight radius shrinks; a torch is a long narrow cone) | 3 | nothing |
| **Camera / remote eye** (what a camera sees counts as seen by whoever watches its monitor, live or later) | 4: The Monitor, Yellow Sticker, Extra #4, Moustache Day | nothing |
| **Disguise** (a worn item changes who you are to everyone except people who know better) | 3: Handover, Kev's Hoodie, Extra #4 | nothing |
| Decoy, hide spot | 2 each | nothing |
| Clock tampering, small talk, elevator, print queue, mimic, moving robot | 1 each | nothing |

## Decisions

**Tier 1: engine mechanics, built before any new level.**
1. **Lure, hunt and doors** are generalised *during the refactor* (P3).
   - Each one replaces a level-1 behaviour that already exists, so the golden traces prove the generic version
     behaves identically.
   - This reverses the earlier plan, which kept Kev's repair, Lin's hunt and the keycard gate as level-only
     hooks. The data says they get reused.
2. **Put down, inspection and attention** are built *right after the refactor*. Each gets:
   - a fixture-level test;
   - a gate check.

   The Mug is the first user of put down and inspection (it changes the 4:00 check anyway, as an intended
   behaviour change).

**Tier 2: built by the first level that needs it.** Darkness, camera, disguise, decoy, hide spot. Exactly one
level builder owns each one, so parallel builders never write the same engine code.

**Tier 3: level-only hooks** unless a second level reuses them. Clock tampering, small talk, elevator, print
queue, mimic, robot.

## First prototype batch (after tier 1)

The batch is chosen for variety and cheap mechanics, not because these are the "best" ideas. We find the best
by playing. Each level is its own folder, so these build **in parallel**, one agent and one worktree per level,
and each must pass `tools/gate.mjs`.

| Level | Source | Tests | Owns tier-2 mechanic |
|---|---|---|---|
| The Mug (level 1 update) | pitch A1 | put down + inspection | none |
| The Audit | same-office | inspection order: one laptop counted twice | none |
| Hold Music | mechanic-first | lure as a player tool | none |
| Office Time | mechanic-first | clock tampering (level hook): cheat time inside a time loop | none |
| Lights Out (merge of the three) | all three | darkness, torch cones | darkness |
| The Monitor | mechanic-first | seeing yourself on the guard's screen | camera |
| Kev's Hoodie | same-office | disguise on the familiar cast | disguise |
| Weekend Shift | pitch L1 | attention: "make a glance, don't wait for one" | none |

The second batch draws on the rest: Late Again, Out by 3:30 / Coat on the Chair, Extra #4, Final Call,
Moustache Day, Farewell Card, Surprise Party, Walk-In, Handover, Staff Room, Yellow Sticker, Fire Door,
Robo-Vac, Print Queue, Fire Drill, Employee of the Month, Going Down.
