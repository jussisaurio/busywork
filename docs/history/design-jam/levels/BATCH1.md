# Batch 1: build briefs

Eight levels, built in parallel, one agent and one worktree each, after the refactor merges. The batch is chosen
for variety and cheap mechanics, not for quality. We find the good ones by playing.

## Rules for every builder

- **A level is one folder:** `src/levels/<id>/`, plus its line in `src/levels/index.js`. Same-office levels may
  import `../meeting/map.js`, `looks.js` and `sounds.js` read-only. Copy anything you need to change.
- **Maps are at most 30×17 tiles, with no camera.** The whole floor is on screen at once. Design for that.
- **Engine changes** are allowed only for the mechanic your brief says you *own*, or as a small generic seam.
  Each one is its own commit, and level-1 goldens stay identical. Never change another level's folder.
- **Keep the card and the lesson.** Routes, times and traps are sketches. Change them freely when the fuzzer or
  play shows something better.
- **Teach through consequences, not text.** No tutorial text and no explanation on screen. The card is the only
  words. The fail that teaches must be visible: a look, a point, a stare chain.
- **Done means:**
  - `node tools/gate.mjs --level <id>` says PASS;
  - every route in `level.routes` is won by some plan;
  - `mustUse` names the level's mechanic;
  - its own goldens are recorded;
  - level-1 goldens are identical;
  - it loads with `?level=<id>`.
- **Report:** the shortest winning plan for each route, the random-win rate, what surprised you in fuzz results
  (unplanned wins are interesting, not bugs), and the joke that lands best.

## Who owns which engine code

| Level | Owns | Uses as is |
|---|---|---|
| The Mug (level-1 update) | put-down extensions | inspection, hunt |
| The Audit | inspection extensions | put down |
| Hold Music | nothing | lure, attention |
| Office Time | a per-NPC clock seam (`level.clockFor`) | schedule |
| Lights Out | **darkness** (light state per zone, sight radius, torch cones) | lure, attention |
| The Monitor | **camera** (a remote cone that counts as seen by whoever watches its monitor) | lure |
| Kev's Hoodie | **disguise** (a worn item changes who you are, except to people who saw the real owner leave) | witnesses |
| Weekend Shift | attention extensions (delayed and repeating noises, turn time per noise, a ripple and a sound for a noise) | lure, attention |

Known gaps for the owners:
- **The Mug (put down):**
  - `put` is instant today, so you can put evidence down right in front of its owner. Putting down an item that
    is owned or contraband should be a short sneaky action, and witnesses should see it.
  - The spot's owner should react only if they saw who put it there.
- **The Audit (inspection):**
  - Signs should show the item, like 💻✔️, not just ✔️.
  - Two more kinds of check: "item absent" and "count".

## The levels

### The Mug (`meeting`: an intended change to level 1, re-records its goldens)
- **What changes:** after the spill you hold the empty mug, and it is evidence. The boss sees the broken
  projector and goes on a mug hunt.
- **The 4:00 check** becomes an inspection: projector → ☕ → whoever has it. The mug in your hand means BLAMED.
- **Ways out:** put it back on the coffee machine, or plant it on Kev's desk. The stare chain then lands on Kev's
  empty chair, and the empty-chair stare becomes the punchline of a win.
- **Lesson:** evidence outlives the act.
- Source: thread/001-ideator-PITCH.md A1.

### The Audit (`audit`)
- **Card:** 🧾 3:30 laptop audit. There should be four. You sold yours.
- **The day:** an Auditor 🕵️ ticks the desks in order: boss, Lin, you, Kev. One laptop sprints around, always a
  desk ahead of the clipboard.
- **Lesson:** checks run in a fixed order, so one thing can count twice.
- **The fail:** you move Lin's laptop too early, and her desk gets the ❌.
- Source: same-office.md.

### Hold Music (`hold-music`)
- **Card:** 📞 Lin's interview for your job is a phone call at 3:30. She must miss it.
- **The switchboard:** one button per desk, each showing its owner's portrait. Each ring is a lure (the owner
  walks over and talks for a minute, facing the wall) and a noise (heads turn).
- **Lesson:** you can move people.
- **The fail:** you ring the kitchen, Lin ignores it, and Kev answers.
- **Best joke:** the boss telling the interviewer that Lin is "very motivated".
- Source: mechanic-first.md.

### Office Time (`office-time`)
- **Card:** 🚌 Your bus leaves at 4:30. Nobody leaves before the boss.
- **Clocks:** NPCs live by the wall clock in their zone. You push clocks forward (sneaky, standing on a chair),
  and crooked hands give it away.
- **Lesson:** you cheat time inside a time loop.
- **The fail:** the boss looks up 🕐, jumps to his smoke break, and walks right past your chair.
- Source: mechanic-first.md.

### Lights Out (`lights-out`): the office version of the three pitches
- **Card:** 🔌 Your angry resignation letter is in the boss's tray. Get it back.
- **The rules:**
  - Each room has a light switch. Flipping it makes a loud clack, which is a noise.
  - In the dark, sight shrinks to about 1.5 tiles, except along a phone torch, which is long and narrow.
  - An NPC whose room goes dark says 💡❓ and walks to its switch (a lure).
  - Lin's 3:10 microwave trips the fuse for the whole floor.
- **Lesson:** dark shrinks every view, except the torch.
- **The fail:** you stand by the switch you flipped, and he gropes along the wall straight into you.
- **Later:** the museum version is a batch-2 level on the same darkness code.
- Sources: all three pitch files.

### The Monitor (`monitor`)
- **Card:** 📦 Your embarrassing parcel is at the front desk. Lin collects the mail at 4:00.
- **Setting:** a lobby, a mailroom and Guard Bob 💂. The camera sweeps.
- **The monitor:** whoever watches it sees what the camera sees. Unplug it and Bob walks to the camera. Push the
  camera with a broom and it faces the wall.
- **Lesson:** you can be seen from somewhere else.
- **The fail:** a tiny red sweater on Bob's screen. He points ❗👉 at the screen, then at you.
- Source: mechanic-first.md.

### Kev's Hoodie (`hoodie`)
- **Card:** 💻 The boss's screen shows your awful review. Delete it before he sends it.
- **The hoodie:** Kev leaves it on his chair at 3:14. In the hoodie, the boss sees Kev, but Lin waved Kev off,
  so she knows better.
- **Lesson:** clothes are who you are, to people who don't know better.
- **The fail:** Lin's double take, 🔧❓ then ❗👉.
- Source: same-office.md.

### Weekend Shift (`weekend-shift`)
- **Card:** 📋 5:00 PM. Someone works this Saturday. Make sure it isn't you.
- **Toys:** the microwave dings 30 s after you start it, the copier beeps until Kev fixes it (a lure), and the
  desk phone rings.
- **Lesson:** level 1 taught "wait for a glance". This one teaches "make one".
- **The fail:** you stand between the ding and Lin. Every head turns toward the sound, which means toward you.
- **Best joke:** the whole office head-snapping like meerkats.
- Source: thread/001-ideator-PITCH.md L1.
