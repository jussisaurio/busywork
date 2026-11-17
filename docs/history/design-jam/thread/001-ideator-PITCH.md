from: ideator
type: PITCH
re: BRIEF Topic A, Topic L; 000 RUBRIC

# Topic A: coffee evidence

Keycard: agree, no replacement. The only person who can blame you is banging on the glass. That's the joke.

## A1: The Mug (you are holding the murder weapon)
**Hook.** The cup no longer vanishes after the spill. You're holding an empty, dripping mug: evidence.

**On screen.** After the spill, the held-item slot and your hand show an empty mug with a brown rim. When the boss first *sees* the broken projector (fact 2: walking out ≈3:12 or ≈3:37, or at 3:57), he stops: 📽️💥 → ☕❓. Until 4:00 he is on a coffee hunt, Lin's sandwich hunt with a tie. At 4:00 everyone is frozen at the table. They look at the sparking projector, then follow one dashed sightline to the mug in your hand: 📽️💥 → ☕ → 😠👉. BLAMED. The chain of looks is the explanation.

**Rule.**
- `spill_coffee` leaves you holding `empty_cup` (it used to be cleared).
- An NPC who has seen the broken projector treats `empty_cup` in your hand as contraband while you're not pretending. The boss's sight = caught. Lin's sight = tattle ❗👉☕ (heard now, or told late, as today).
- At 4:00 (fact 4: frozen, not pretending): projector broken + boss in the meeting + you hold `empty_cup` → BLAMED. This replaces attendance.
- You get rid of it two ways, both visible and both existing kinds of interact:
  1. **Put it back:** interact with the coffee machine. The mug sits on its plate for the rest of the loop.
  2. **Plant it:** interact with Kev's desk (22,9). At 4:00 the stare chain goes projector → ☕ → Kev's empty meeting chair (15,5): 🪑🔧😠. The empty-chair animation we already have becomes the *win* punchline, not the fail. It's the same outcome (WIN), just funnier, so it's not a trap.

**Learned by.** Win the projector as today; at 4:00 the look chain lands on your hand. Next loop, the mug held to your ear survives the boss at 3:37, and 4:00 shows the phone trick can't follow you into the meeting.

**Interactions / why it's a decision, not a chore.**
- **Geography:** the projector is at (13,2). Both ditch spots are east (machine 22,2; Kev's desk 22,9). The coat rack is far west (2,1). Walking isn't sped up by ×6.
- **Your one free hand (fact 7):** the card needs empty hands. In the double win (fuzz: spill 3:22–3:47, card ≤3:35) you now have to spill → walk 9 tiles east to ditch → cross the whole floor west → hit a boss-glance minute at the rack before he takes the jacket at 3:35. The mug turns the double into a route you plan. Card first doesn't dodge it: the pour is 2:32–2:40 and the spill only sticks after 3:05, so you'd be holding a full cup through the card window. The order is forced, and the trip costs real minutes.
- **Projector only:** spill, ditch, pretend: mildly chore-ish, but a one-time lesson the planting gag pays for.
- **Kev:** spill before he's gone and he reclaims the empty mug (owner logic), looks in, 😢. Free gag.
- **Mustard:** independent. Lin hunts the sandwich and the boss hunts the mug: two hunts, two owners of grievances, one sweater.
- **Keycard + projector:** the boss is locked out, so the mug can't blame you at 4:00; you had to ditch it for the card anyway.

**Exploit check.** Pretending through the hunt is allowed; 4:00 defeats it.

**Cost: S–M.** `rules.js`: spill → `held='empty_cup'`; per-NPC `sawBrokenProjector` flag (copy Lin's hunt flag) gates contraband. `scenario.js`: mug check replaces attendance. Machine and Kev's desk accept `empty_cup`. Art: empty mug, mug on machine; retarget the empty-chair stare.

## A2: Splash-back (the projector spits)
**Hook.** Coffee in electronics goes *everywhere*, including your sweater.

**On screen.** Spill → the projector sputters for ~2 s (rattle, 💨☕ puffs) → 💥 a brown spray fans out south of the lens. Whoever is in the spray gets a coffee splat, drawn like the mustard splat. At 4:00 the gaze chain goes projector → your sweater → 😠👉.

**Rule.** It's the mustard rule with a different owner. The splat lasts the loop and pretend doesn't hide it. It's evidence to anyone who has seen the broken projector (the boss: caught or blamed; Lin: tattle). At 4:00, boss present + projector broken + splat → BLAMED. To avoid it, step out of the 3-tile fan during the sputter.

**Learned by.** Everyone stands still to watch their first spill, and gets splatted; the 4:00 chain ends on the sweater.

**Interactions.** Mustard plus coffee on one sweater: an evidence board. Keycard and Kev's scene rule untouched.

**Honest weakness.** A reflex, not a decision: the cheap floor. A1 is the decision. Don't ship both.

**Cost: S.** Reuse the stain code with a second stain type, a 2 s delay plus a cone check at the spill, and one spray animation.

# Topic L: levels

Arc: **the office learns.** Each level opens with the last trick visibly patched (L1: keycard on a lanyard, gaffer tape and a second ☕🚫 on the projector). Free, and it says "old answer dead" without text. Finale: you're the boss, and a red sweater is at *your* coat rack.

## L1: Weekend Shift (lesson: noise turns heads)
**Mission card:** "📋 5:00 PM. Someone works this Saturday. Make sure it isn't you."

**Setting & cast.** Same floor and cast; new toys: microwave, copier, desk phone. At 5:00 the boss reads the whiteboard roster; the top name (yours) gets Saturday.

**The day (4:00–5:00).**
- 4:10: Lin microwaves fish 🐟 (stink lines).
- 4:20: the boss photocopies.
- 4:30: Kev's on a call by the window.
- 4:40: the boss walks to his desk and checks the roster.
- 4:55: everyone gathers at the whiteboard.

**Routes.**
1. **Rewrite the roster:** the whiteboard is in the boss's glass office. Start the microwave, then be at the board when it DINGs 30 game-seconds later. Every head in earshot snaps toward the kitchen. Trap: start it too late and the ding lands during his 4:40 walk.
2. **Jam the copier:** at 4:20 it beeps 🔊⚠️ until fixed. Kev (the fixer, like the projector) walks over and leaves his desk, where the boss's sign-off sheet sits in his tray. Swap your name off it. Trap: Kev only comes if he's still on the call at 4:30.
3. **Combo:** call the boss's desk phone from yours. He turns to the window to talk for one minute. That's the only time he doesn't see the board through the glass.

**New lesson.** Level 1 taught "wait for a glance." L1 teaches "make one." Sound makes NPCs in earshot turn toward its source for ~1.5 s. The fail that teaches it: you set off the ding and stand *between* the microwave and Lin. Every head turns toward the sound, which is toward you. ❗👉.

**Reuse:** glances (now forced), Kev's repair walk, tattles.

**Why it's funny:** the fish, and a whole office head-snapping like meerkats.

**Cost: M** (the critic's data-driven NPC refactor) + S (a `noise(x,y,r)` event that forces a glance toward its source) + art for the three toys.

## L2: Farewell Card (lesson: the target moves)
**Mission card:** "✉️ You drew something awful in Pat's farewell card. Get it back before she opens it."

**Setting & cast.** Pat (retiring, cardigan, cries easily) and the cast. The card is passed desk to desk on a schedule, each signer holding it for ~5 min. Whoever holds it owns it (owners take things back).

**The day.**
- 2:00: card on Lin's desk.
- 2:10: Kev.
- 2:20: the boss.
- 2:35: on the cake table.
- 3:00: Pat opens it.

**Routes.**
1. **Snatch** it while its holder is at the restroom. Trap: you have to know *who* has it *when*. Go where it was, and it's moved on (✉️ bubble over the new holder).
2. **Swap:** grab a blank card from the supply closet and swap it on the cake table during the cake-cutting crowd's backs-turned moment.
3. **Make Pat leave early:** eat the cake (a mustard-style frosting splat) …so she cries and goes home. A second evidence item.

**New lesson.** The object is on a schedule too. The fail: you arrive at an empty desk, and the ✉️ bubble shows across the room.

**Reuse:** owners, held items, mustard evidence, pretend.

**Why it's funny:** the fail screen: Pat opens your 💩🖍 drawing in front of everyone.

**Cost: M** (held-item ownership that changes on a schedule).

## L3: Employee of the Month (lesson: a witness who copies)
**Mission card:** "🏆 5:00 PM. Employee of the Month. It must not be the intern."

**Setting & cast.** The intern 🧑‍🎓 (lanyard, oversized shirt) is perfect at his job. He doesn't tattle. **He copies your last action at the same object ~3 s later.** He has no phone, so his pretend pose is a banana 🍌 to his ear.

**Routes.**
1. **Frame:** take the boss's stapler while the intern watches. He takes the next stapler in front of the boss and gets caught. Trap: he copies *only what he saw*.
2. **The banana:** stand still in the phone pose near him at 4:30. He copies you all through the boss's walk-by, slacking with fruit.

**New lesson.** Witnesses can be used. The fail: you take the boss's stapler in front of him, and 3 s later he reaches for the empty spot in full view of the boss, who follows his reach to you.

**Why it's funny:** a duckling Mr. Bean, with a banana.

**Cost: L** (a mimic action queue + new NPC art). Build it last.
