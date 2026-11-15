# Cold reads: second-thoughts
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"463973422a5d3ccac1bc5e306a3a0e864f41ab4e3e1d79b9392c31887bc11fc1","parts":{"card":"bcd8da4442cdc1bec486c22381ba8a48078066eb3f7cd42564b319fd130a8858","premise":"4e8c6e0dfa2769484b869272c6e3d034041628f2474d366b5445655345614663","prompts":"c2886f589c84ff30cad9e05d737f4d22d2f634d9aba125f62e9ac2a88edc579e"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs 463973422a5d: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 12 s | $0.02 |
| 2-review | report.md | 83 s | $0.40 |
| all | | 96 s (the steps add up to 96 s) | $0.42 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM. I wrote an angry resignation letter and put it in my boss's tray. Now I regret it.

**What I must do:** Take the letter out of the tray before 3:40, when the boss empties it.

**If I fail:** He reads it, and I've either quit or been fired. Another reading: "empties" might mean the tray gets dumped into a bin or shredder. In that case it's unclear how I lose at all.

**Questions:**
- Does "empties" mean he reads the tray, files it, or throws it out?
- Where is the tray? On his desk, in his office, or by the door? Is he sitting there?
- Can I spot my letter among the others? Is it in an envelope?
- Do I have to destroy it, or is holding it enough? Could I swap in a fake?
- Does "first" mean before 3:40, or before he gets to it, if he might come early?
- What do the icons "✉️ @boss" mean? That the letter is at the boss, or that it's addressed to him?
- The name "Second Thoughts" clearly means regret. Could it also hint at a second letter, or at the second loop?

### 2-review: report.md

Verdict: fixable

**1. In the switch route, the boss watches you turn off his light.** His cone is 150° and 8 tiles, facing south (`cast.js:18`). The switch spot (1,4) is about 56° off his facing and 3.6 tiles away, so he sees you walk in and hear the clack. Then the rules have him blame only whoever he bumps into in the dark. A player who flips it and walks off unpunished will feel the game is fudging. He also feels his way along the wall for minutes, although he holds up a phone torch in the other blackout (`index.js:218`, torch only when the fuse is out). And his office has glass walls onto a fully lit floor, so it should barely be dark. **Fix:** put the switch outside his office, on the hallway wall by his door and out of his cone. Have him reach for his phone, find it dead or on charge, and grope instead. Show this as a ❓ over the phone.

**2. The switch win picture shows the loss.** `sceneSwitch` has the light back on and him angry with his hand on the switch, facing you while you hold the envelope in plain view. The premise says exactly that gets you caught. **Fix:** draw him squinting at the switch with his back to you, with the empty tray between you, and you at your own desk.

**3. The card says "empties", and the first reader guessed shredder.** If he dumps the tray, why is that a loss? The fail picture (he reads it, you hold a box) answers that only after you lose. **Fix:** "He goes through it at 3:40." That names the threat without hinting at a way out.

**4. The boss stares at a fresh envelope for 40 minutes and doesn't read it.** The premise says "nothing on his desk escapes him" (`premise.md:20`) but also has him wait until 3:40. Sitting still facing the tray is the puzzle's need, not an everyday reason. Watching him teaches the player nothing either. **Fix:** give him a visible task, like a long phone call with ☎️ and 💬 bubbles, facing the desk. At 3:40 he hangs up and reaches for the tray. That also makes his torch pointing at the front of the desk read as "back to the paperwork."

**5. The blackout route needs no scheme.** At 3:10 the dark just happens, on loop one, with no input. The level's one idea is handed over before the player has used it. The breaker and switch routes are the actual deductions. The breaker route works: at 3:10 the box's door flies open, Kev walks to it, and the player sees him arrive. **Fix:** keep the blackout but make it partial. Lin's machine trips only the kitchen circuit, so the player has to see why it matters, or move it to her desk circuit.

**Card and badge:** "Second Thoughts" with ✉️ @boss names the trouble and hints at no tool or route. Nothing to fix there, apart from "empties" in #3.

**Joke:** The blackout picture works on screen. The boss sweeps his torch over a desk with an empty tray, you stand smug just outside the beam, and Lin's coffee machine sparks in the background. It's a little better than the obvious "sneak in the dark" version. It would get funnier if his beam visibly passes over the empty tray and he doesn't notice.

**Best thing:** the wire tray you can see through. From the first frame, the player sees their own white envelope sitting there, and the win is that same mesh, empty.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"a959bb2e89df9d482a67a594a763045a1a5531c367fe2f4dcc17f5c909239c7e","parts":{"card":"bcd8da4442cdc1bec486c22381ba8a48078066eb3f7cd42564b319fd130a8858","shots":"65c222bcf4a985b0ba7ef995d6302270b308317508782c287233d7ce9734cfc9","pictures":"b76a10b1bde9afd25fd62508d8004d9e291a5290059a07d8e704d6fc575f4ea6","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs a959bb2e89df: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 72 s | $0.39 |
| 2-compare | report.md | 103 s | $0.49 |
| all | | 175 s (the steps add up to 175 s) | $0.87 |

### 1-read: reading.md

I've looked at the card and all 20 shots. Here is the reading.

# Reading: Second Thoughts

**Card:** It's 3:00. My angry resignation letter is in the boss's tray, he empties it at 3:40, and I have to get it back first. Clear, and funny.

**01 (3:00):** A bald boss in a suit sits behind a desk in the top-left office. A pink envelope is on the desk. I'm the red shirt with a red ring at a desk in the middle. A teal coworker sits on the left and a green, spiky-haired one on the right. There's a kitchen at top right. The top of the screen shows a clock, a clock + envelope + boss face, an empty slot with a hand, a loop counter and three empty slots. *I can't tell what the three slots are for yet.*

**02 (3:02):** I'm right beside the boss's desk with an envelope bubble. His cone has turned red and covers me. Above him is a black vertical bar with a red "?". *I think the bar is his suspicion. Grabbing the letter in front of him won't work.*

**03 (3:03):** I'm at a small white box on the left wall with a lightbulb bubble. *It looks like a light switch.*

**04 (3:01):** I'm at a grey box with a yellow warning triangle in the hallway, and a lightning bubble is showing. The boss's bar is partly orange. *A fuse box, so maybe all the power?*

**05 (3:08):** The teal coworker walks the hallway with a clock bubble, and her seat is empty. *A routine, maybe a coffee break.*

**06 (3:04):** The boss's office is dark blue. He has a "?" thought cloud, and I'm by the switch. *Turning off the lights confuses him.*

**07 (3:05):** The boss has moved to the top-left corner with a faint grey cloud I can't read. I'm at his desk with the envelope bubble. The green coworker has shake lines. *He's going to fix the light, which leaves the desk open.*

**08 (3:06):** The hand slot now holds the envelope, and I have a smiley thought bubble. The boss is at the switch. *Got it.*

**09 (3:06):** Another dark office. The boss has "?" and a red "?" bar, and I'm back at the switch. A red cone reaches through the glass door. *He's coming to the switch, and I'm standing at it.*

**10 (3:10):** The whole office is dark. Flashlight cones come from the boss at his desk, from the teal coworker at the smoking coffee machine, and from the green coworker, who has a "?". The fuse box glows red. *Power cut. I can't tell if I caused it at the fuse box or the coffee machine did.*

**11 (3:14):** It's dark and I'm next to the boss with a white-and-yellow bubble. *It looks like a fried egg, and I can't read it.* I'm holding the envelope. A dark figure with a flashlight is near the fuse box, and someone with a beard is in the kitchen. *Who is that? It's a new person or a coworker I can't recognise.*

**12 (3:04):** It's dark and I'm at the fuse box. The teal coworker is beside me with shake lines, and green has a "?". *Again, the shake lines could be startled or could be noticing me.*

**13 (3:09):** It's dark, and I'm reaching across the boss's desk while he sits there with his flashlight. Green is at the fuse box. *Apparently the dark lets me take it right under his nose. That's funny if true, but it's confusing.*

**14 (3:07):** It's dark and I'm at the fuse box. A figure at the glass door has a "?" and a red cone on me. *Spotted.*

**15 (win, 3:41):** The boss slaps the light switch with an angry burst while I grin holding the envelope. The icons are bulb, boss, angry, envelope. Slot 1 fills with a bulb. *Solution 1 is the light switch.*

**16 (win):** The teal coworker's coffee machine sparks while she holds a flashlight. The boss is lit by his own flashlight, and I have the envelope. The icons are teal, coffee, explosion, envelope, and slot 2 is coffee. *The coffee machine blows the power.*

**17 (win):** The green coworker fixes the red fuse box. The icons are lightning, green guy, wrench, envelope, and slot 3 is lightning. *Solution 3 is the fuse box. The three slots are three solutions.*

**18 (loss, 3:41, red border):** The boss holds up my letter with an angry burst showing my face. I leave carrying a box with a plant. *Too late, I've resigned. It's the best gag in the set.*

**19 (loss, 3:04):** The boss points at me while I sweat holding the envelope. *Caught red-handed.*

**20 (loss, 3:07):** In a dark office the boss grabs me at the switch. The envelope is still on the desk. *Caught before I got it.*

**What confused me:**
- The wins show 3:41 on the clock, but the card says 3:40.
- I can't tell whether the slot icons match what I did or just name the method.
- In 16 and 17 the boss sits there with a flashlight while I take the letter. "The dark shrinks sight" needs one clear shot of his cone not reaching the tray.
- I can't tell what the "pretend" key does.

## The story
I quit in a rage and regret it. The boss sits guarding the tray, so I have to make him look away. Darkness is the tool: flip his office light, overload the coffee machine, or trip the fuse box. Each one sends someone off to fix it while I sneak through the gloom. If I'm slow, I walk out with a box of my stuff and a plant.

### 2-compare: report.md

Verdict: fixable

I checked every shot against the images. One shot that matters is misread: 04 tells the player the fuse box is in the boss's view, which works against the whole breaker route. Several more get the gist but miss the one idea this level teaches: the dark shrinks sight, so a torch beam that doesn't reach you means you're safe. Shots 16 and 17 come closest to showing it, but the player says outright that it didn't land.

## Shots

**01 (start): partly (cosmetic)**
- Reading: "A pink envelope is on the desk."
- Intent: your white envelope sits in the wire tray right in front of him.
- Cause: the boss's sight cone tints the envelope pink, and the tray is a small grey rectangle that reads as desk clutter. "Tray" is a word on the mission card, so the picture should show a tray.
- Fix: draw a raised wire tray with a visible rim. Keep the envelope white by drawing it above the cone tint, or give it a slight glow.

**02 (tray): reads.** The red cone, the "?" bar and the reading "Grabbing the letter in front of him won't work" all match.

**03 (switch): reads.**

**04 (fuse box): misread**
- Reading: "The boss's bar is partly orange." The player concludes he can half-see you there.
- Intent: the fuse box is around the corner where the boss cannot see it, with its door shut and a green lamp on.
- Cause: a missing cue, plus a cue that contradicts the intent. The boss's cone runs through his glass wall into the hallway and covers the player at the box, and his suspicion bar rises. There is no green lamp. A yellow warning triangle stands in for the box's state.
- Fix: block his cone at the wall, or move the box so it is clearly outside the cone, and leave his bar empty in this shot. Put a lit green lamp on the closed box door so it can later flip to a red, blinking one.

**05 (Lin to the coffee machine): partly**
- Reading: "A routine, maybe a coffee break."
- Intent: Lin leaves her desk for the old coffee machine in the kitchen.
- Cause: the shot catches her mid-hallway with a clock bubble, so the cause (it's 3:08) shows but the destination doesn't. The kitchen is off to the side, too far from her to connect.
- Fix: give her a coffee-cup bubble, or a clock-plus-cup pair, or take the shot as she reaches the machine.

**06 (switch flipped): reads.**

**07 (boss gropes): reads.** The player got "He's going to fix the light, which leaves the desk open."
- His grey thought cloud can't be read, and the green coworker's shake lines are noise.
- He also stands at the top wall rather than visibly moving along it. A trail of hand-on-wall marks pointing toward the switch would help.

**08 (switch take): reads.**

**09 (boss bumps): partly**
- Reading: "He's coming to the switch, and I'm standing at it."
- Intent: he walks right into you. In the dark, whoever is at the switch must have flipped it.
- Cause: the cause and the effect are too far apart. The shot is taken before the bump, and the boss is still a tile away. A stray red cone coming through the glass door pulls the eye to the wrong place.
- Fix: take the shot at the moment of contact. Show his outstretched hand on your shoulder and a small impact star, with the switch's amber lamp between you.

**10 (blackout): partly. It matters to the coffee route.**
- Reading: "I can't tell if I caused it at the fuse box or the coffee machine did."
- Intent: Lin switches on the coffee machine, it sparks, and the whole floor goes dark. As a result, the fuse box hangs open.
- Cause: the cause and the effect sit at opposite ends of the map. The machine only smokes faintly, while the red fuse box is the brightest thing on screen, so the effect looks like the cause.
- Fix: put a bright spark burst and a lightning bubble on the machine, plus a thin flicker line or wire running from the kitchen to the box. Or play it as two frames: the spark first, then the lights go out.

**11 (blackout take): partly**
- Reading: "It looks like a fried egg, and I can't read it." Also: "someone with a beard is in the kitchen… a new person or a coworker I can't recognise."
- Intent: you take the letter from the dark end of his desk while his phone beam lies on the front of the desk, not on you.
- Cause:
  - A muddled bubble glyph.
  - In the dark, people are drawn as small faces. Lin's darkened face reads as a stranger with a beard.
  - The boss's beam points up-left, away from the desk front, so the safe gap between beam and tray isn't shown.
- Fix:
  - Use the plain envelope bubble.
  - Keep each person's shirt colour visible in the dark, for example with a coloured rim light.
  - Aim his beam down across the front of the desk, so the dark tray end beside it is obvious.

**12 (breaker pulled): partly**
- Reading: "the shake lines could be startled or could be noticing me."
- Intent: you pulled the breaker yourself. The door hangs open, its red lamp blinks, and the whole floor goes dark.
- Cause:
  - The open door isn't legible as open.
  - Lin, standing right next to you, has shake lines and her torch puts you in a pool of light. That reads as being caught, not as a clean sabotage.
- Fix: draw the box door swung open with a red lamp, and have Lin's shake lines and torch point toward her own desk, away from you.

**13 (Kev comes): partly**
- Reading: "Apparently the dark lets me take it right under his nose… it's confusing."
- Intent: Kev walks his torch down the hallway to the open fuse box, and you're already at the boss's desk, out of Kev's way.
- Cause:
  - Kev is already standing at the box, so his trip down the hallway isn't shown.
  - The boss's beam points down, and the player standing just outside it at the desk end isn't read as safe.
- Fix: take the shot with Kev partway down the hallway, his beam pointing toward the box. Mark the edge of the boss's beam clearly against the desk, with the player in visible shadow.

**14 (Kev finds you): reads.** "Spotted" matches.
- He's only "a figure" to the player. In the dark, Kev should keep his green shirt and spiky hair.
- Nothing hints that he will tell the boss. A bubble pairing the boss's face with a pointing finger would.

**15 (win by switch): reads.**
- The HUD shows 3:41 while the card shows 3:40. Freeze the HUD clock at 3:40 on the end card.

**16 (win by blackout): partly**
- Reading: "the boss sits there with a flashlight while I take the letter. 'The dark shrinks sight' needs one clear shot of his cone not reaching the tray."
- Intent: his torch lights the front of the desk, and you hold the envelope just outside the beam.
- Cause: a missing cue. The beam stops short of you, but nothing points that out, so the gap reads as luck.
- Fix: run the beam's edge right up against your feet, with a hard shadow line on your side. Show the empty tray inside the dark half of the desk.

**17 (win by breaker): partly.** Same as 16. The player got the route ("Solution 3 is the fuse box"), but the reason it's safe doesn't come across. Same fix as 16.

**18 (loss at 3:40): reads.** The player called it "It's the best gag in the set." Agreed.

**19 (caught): reads.**

**20 (bumped): reads.**
- This end card uses the same icon row as 19 (boss, pointing finger, you). A bump or hand icon would separate the two ways to lose.

## Other notes
- The three empty slots and the "pretend" key mean nothing to the player until the end cards. Slot 3 only made sense once 17 showed it.
- The HUD's clock, envelope and boss-face goal icon read fine.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"broken","date":"2026-11-15","commit":"a864132","hash":"ed0107392619089ff5c56805eb5e45d4cd1d2b2c4287f4c592fcfe4ae1af8754","parts":{"card":"bcd8da4442cdc1bec486c22381ba8a48078066eb3f7cd42564b319fd130a8858","checks":"eb88df5a683525135aae13bd0644a07460c2326977284979b0d0afa9f19723de","ways":"48d4fc8ac2f525a1bd8b783801996aae038fa29c785bb7c7e1413e615a83eb17","frames":"30e70bf33d0eb19940cd52f008692e52c8aae438b6532f5b2e73c36cddcd2a0a","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: broken
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs ed0107392619: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 165 s | $0.73 |
| 2-compare | report.md | 81 s | $0.27 |
| all | | 246 s (the steps add up to 246 s) | $0.99 |

### 1-read-1: reading.md

# Reading: Second Thoughts

**The card says:** at 3:00 your angry resignation letter is in the boss's tray. He empties the tray at 3:40, so get the letter back before then.

---

## Run 1: loss

- **3:10** The whole office goes dark. A coworker at a right-hand desk shows a "?" bubble. The boss works by a desk lamp. A woman at the smoking coffee machine shows 😩.
- **3:38** The lights are back on. The boss shows ✉️😠. The player is still at their own desk.
- **3:40** The player is standing by the boss's desk, showing 😅. Crumpled paper lies on the floor by the player's desk.
- **3:41** End picture: the boss waves the letter and is furious. The player leaves holding a box. Icons: boss, ✉️, 😠, 📦.

**Why it ended:** The boss read the letter.

**What the player did that caused it:** The player did nothing. No action is marked.

**Might not be a reaction to the player:** The blackout, the "?", and the 😩 all happen with the player sitting still, so they're scheduled. I can't tell who threw the crumpled paper, or whether the player walked to the boss at 3:40 or the game moved them there.

---

## Run 2: win

- **3:04** The player uses a switch on the left wall, and a sound plays. The boss's office goes dark and the boss shows "?".
- **3:06** The player is at the boss's desk. A letter appears in the hand slot, and the player shows 😊. The boss has walked to the wall in the dark.
- **3:09** The player is back at their own desk. The office lights are on again. The boss stands in the corner showing 😠.
- **3:10** The scheduled blackout happens.
- **3:40** Confetti, and the player shows 🎉. A 💡 icon is earned.
- **End picture:** the boss is angry at the light switch, and the player holds the letter.

**Why it ended:** The player had the letter at 3:40.

**What the player did that caused it:** Flipping the switch drew the boss away from his desk, then the player took the letter.

**Unclear:** I can't tell what the player did at their desk at 3:09. The letter stayed in the hand slot.

---

## Run 3: loss (3:07)

- **3:04** The player flips the switch and stays next to it. The boss shows "?".
- **3:06** The boss walks to the switch and runs into the player. The boss shows "!😠".
- **End picture:** the boss grabs the player at the switch. Icons: boss 👉 player.

**Why it ended:** The boss caught the player at the switch.

**What the player did that caused it:** The player stayed where the boss was always going to walk.

**Might not be a reaction to the player:** At 3:06, a red sight cone points from the office door toward a walking coworker. I can't tell whose cone it is or whether it mattered.

---

## Run 4: win

- **3:10** The blackout happens. The player shows a 🪑 bubble. The coffee machine is smoking.
- **3:15** The player is at the boss's desk in the dark and takes the letter (😊). The boss is out by the door with a flashlight.
- **3:17** The player is back at their own desk. The boss is at a panel on the left wall.
- **3:40** Confetti, and a ☕ icon is earned.
- **End picture:** the woman at the sparking coffee machine, the boss with his flashlight, and the player holding the letter. Icons: woman, ☕, 💥, ✉️.

**Why it ended:** The player had the letter.

**What the player did that caused it:** Taking the letter while the boss was away fixing the power.

**Might not be a reaction to the player:** The blackout comes from the coffee machine, not the player, even though the end picture gives the player a ☕ icon as if they caused it.

---

## Run 5: win

- **3:10** The blackout happens, the same as in run 4.
- **3:15** The player takes the letter from the boss's desk.
- **3:40** The player celebrates in the kitchen (🎉). A ☕ icon is earned.
- **End picture:** the same as in run 4.

**Why it ended:** The player had the letter.

**What the player did that caused it:** Taking the letter at 3:15.

**What this shows:** Going back to your own desk, as in runs 2 and 4, isn't needed.

---

## Run 6: loss (3:14)

- **3:10** The blackout happens.
- **3:13** The player is in the boss's office while the boss is still at his desk, inside the lamp's light. The boss shows "?" and then "!😠", and a red line runs from him to the player. The "E" key is highlighted, but no action is marked. The hand slot is empty.
- **End picture:** the boss points at the player, who is holding the letter. Icons: boss 👉 player.

**Why it ended:** The boss saw the player.

**What the player did that caused it:** Going in before the boss left, which he did by 3:15 in runs 4 and 5.

**Odd:** The end picture shows the letter in the player's hand, but the hand slot was empty.

---

## Run 7: win

- **3:03** The player uses a red-lit box on the left wall. The whole office goes dark.
- **3:07** The player takes the letter (😊) while the boss is still sitting at his desk. The player is beside the desk, outside the lamp's light. Two coworkers walk around with flashlights.
- **3:10** The player is back at their own desk. A spiky-haired coworker is at the box on the wall. The woman at the coffee machine shows "?".
- **3:40** Confetti, and a ⚡ icon is earned.
- **End picture:** the spiky-haired coworker fixing the box with a wrench. Icons: ⚡, spiky-haired coworker, 🔧, ✉️.

**Why it ended:** The player had the letter.

**What the player did that caused it:** Cutting the power and then taking the letter.

**Puzzle:** The boss was at his desk here and didn't react, unlike run 6. My guess is that standing outside his lamp's light is what mattered, but I can't confirm it.

**Might not be a reaction to the player:** The woman's "?" at the coffee machine is probably about the dead machine, not about the player.

---

## Run 8: loss

- **3:03** The player cuts the power at the box.
- **3:07** The player waits by the box. The spiky-haired coworker approaches with a flashlight, showing "?".
- **3:08** The player is at their own desk. The spiky-haired coworker shows "!👉" with a red dashed line to the player. A paper icon with a red bar appears in the top right. The boss shows 📄📄👉🖥️.
- **3:10** The spiky-haired coworker fixes the box.
- **3:38** The boss shows ✉️😠.
- **3:40** The player is by the boss showing 😅, with crumpled paper on the floor again.
- **End picture:** the same as in run 1.

**Why it ended:** The player never took the letter.

**What the player did that caused it:** Leaving the letter in the tray.

**Might not be a reaction to the player:** Getting spotted at 3:08 had no visible effect on how the loop ended. I can't tell what the red bar or the boss's bubble mean.

---

## Run 9: loss (3:04)

- **3:03** The lights are on. The player walks to the tray while the boss sits at his desk. The boss shows "?", and so does the woman in the open office. Both of their red sight cones cover the player.
- **3:03** The boss shows "!😠".
- **End picture:** the boss points at the player, who is holding the letter. The hand slot was empty.

**Why it ended:** The boss saw the player.

**What the player did that caused it:** Walking in with the lights on.

**Might not be a reaction to the player:** The woman's "?" may also be a reaction to the player, but she has no effect on how the loop ends.

---

## Editor's notes

- **3:10 blackout:** It happens on its own every run, and that isn't obvious the first time. The ☕ win icon claims credit the player didn't earn.
- **"Caught" end pictures:** They show the letter in the player's hand even when they never took it (runs 6 and 9).
- **Rules that conflict:** The boss is blind at his desk in run 7 but sharp-eyed in run 6. It reads as a contradiction unless the edge of the lamp light is clearer.

### 2-compare: report.md

Verdict: broken

## Runs

- **Run 1, do nothing: loss.** `explained`. The reader says "The boss read the letter" and "The player did nothing." That matches the run.
- **Run 2, switch: win.** `explained`. The reader says "Flipping the switch drew the boss away from his desk, then the player took the letter." That matches the run.
- **Run 3, switch and stay by it: caught.** `explained`. The reader says "The player stayed where the boss was always going to walk." That matches the run.
- **Run 4, blackout, take it from beside the desk: win.** `unexplained`. This is a win with the wrong cause.
  - **Reading:** "Taking the letter while the boss was away fixing the power." Also: "The boss is out by the door with a flashlight… The boss is at a panel on the left wall."
  - **What happened:** The boss never left his desk. I checked `run-04/03.png` and `04.png`: at 3:15 and 3:17 he is seated at his desk with his phone beam on the floor. The flashlight figure by the door, later at the fuse box, is Kev. The win came from taking the letter in the dark, at the east end of the desk, outside his beam.
  - **Visual cause:** In the dark, the boss and Kev look the same. Both are dark silhouettes holding a phone light, so Kev reads as the boss. Nothing marks the boss in the blackout, and nothing shows that the dark plus his narrow beam is what protected the player.
  - **Fix:** Give the boss something that stays visible in the dark, such as a lit tie, a bald-head highlight or his name-plate colour on his torch beam. Keep his chair visibly occupied. In the 3:15 frame, the player should be clearly standing in shadow right beside the beam's edge. That shows "he's here, he just can't see me."
- **Run 5, blackout, then the kitchen: win.** `partly`.
  - **Reading:** "Taking the letter at 3:15." The reader rightly worked out that going back to your desk isn't needed.
  - **What happened:** Same as run 4. The darkness and staying out of the beam won it. The reader still believes the boss had left, so they know what the player did but not why it worked.
  - **Visual cause and fix:** Same as run 4.
- **Run 6, blackout, take it from in front of the desk: caught.** `partly`.
  - **Reading:** "Going in before the boss left, which he did by 3:15 in runs 4 and 5."
  - **What happened:** The reader is right that the boss saw the player and that the player was in his light. The player's mistake was where they stood, not when they went in. They walked into the front of the desk, where his phone beam points. The boss stays seated in every blackout run.
  - **Visual cause:** The run 4 mix-up carries over and becomes a false timing rule. The reader also calls the beam "the lamp's light", which makes it seem fixed. In fact it is a hand-held phone beam that swings.
  - **Fix:** Draw the beam starting at a small phone glow in the boss's raised hand, and let it visibly sweep. On the catch frame, put the player's feet inside the beam's edge with a brief white flash. That makes "you stepped into his beam" the readable cause.
- **Run 7, breaker, take it from beside the desk: win.** `explained`. The reader names the action, "Cutting the power and then taking the letter." They also guess the right rule: "standing outside his lamp's light is what mattered." That guess holds, but it rests on a hedge the reader can't confirm, and it fights their model from runs 4 to 6.
- **Run 8, breaker and linger at the box: loss.** `partly`.
  - **Reading:** "The player never took the letter… Getting spotted at 3:08 had no visible effect on how the loop ended. I can't tell what the red bar or the boss's bubble mean."
  - **What happened:** Kev found the player at the fuse box and told the boss. The boss sent the player to their desk for assigned work (📄📄👉🖥️, plus the paper-and-bar meter). That used up the dark, so the letter stayed in the tray. Being spotted *was* the cause.
  - **Visual cause:** The cause and effect are in the wrong order and too far apart. In `run-08/03.png` the player is *already* at their desk when Kev's "!👉" appears, so the punishment shows up before the catch is understood. The top-right meter has no link to anything on screen. The blackout keeps going after the player is stuck, but nothing shows the player being locked out of it.
  - **Fix:** At the box, hold one frame where Kev's beam lands on the player with the "!". Then show the boss's 📄📄👉🖥️ bubble pointing at the player. Then show the player trudging to their desk with a paper stack in their arms. Anchor the work meter over the player's head, not in the HUD corner, and have it fill as the lights come back.
- **Run 9, take it in the light: caught.** `explained`. The reader says "Walking in with the lights on," and that the boss saw the player. That matches the run.

## Misleading beats

1. **Kev taken for the boss in runs 4 and 5.** This is the core failure.
   - **Reading:** "The boss is out by the door with a flashlight." Also: "The boss is at a panel on the left wall."
   - **What happened:** That figure is Kev going to the fuse box. The boss sat still the whole time.
   - **Visual cause:** In the dark, every character is the same silhouette with a phone torch.
   - **Fix:** Give characters looks that still read in the dark. Kev's spiky hair should catch the light (the reader *did* spot "spiky-haired" in the lit run 7). The boss gets a lit marker that stays on.
2. **The ☕ win icon reads as false credit.**
   - **Reading:** "The ☕ win icon claims credit the player didn't earn."
   - **What happened:** The icon names the route, not something the player caused. The reader took it as the game praising an action the player never did.
   - **Visual cause:** The icon claims to be a reaction to the player, but it isn't one.
   - **Fix:** Show the coffee-machine icon dimmed, or with a 🕒 clock badge, as the "lucky moment" the player used. Make the earned icon the player's own move: a 🌑 or a 👣-beside-the-beam icon.
3. **The "caught" end picture shows the letter in the player's hand when it was never taken (runs 6 and 9).**
   - **Reading:** "The end picture shows the letter in the player's hand, but the hand slot was empty."
   - **What happened:** The HUD is correct. The end picture contradicts it, so the reader starts to distrust the end pictures.
   - **Fix:** Draw the end picture from the actual state. If the player wasn't holding it, show the player's hand reaching toward the tray with the envelope still in it.
4. **The 3:10 blackout isn't clearly scheduled on first sight (run 1).**
   - The reader worked it out ("they're scheduled"), but only because the player sat still. In run 4, the player's 🪑 bubble at 3:10 is a waiting idle bubble. It can read as the player doing something.
   - **Fix:** Before 3:10, show Lin's 3:05 walk to the coffee machine and a ☕💦 bubble from the machine. In the blackout, add a spark-to-fuse-box flash so the cause is on screen. Drop the 🪑 idle bubble during scripted events.
5. **The ending pose in run 1 and run 8.**
   - **Reading:** "I can't tell who threw the crumpled paper, or whether the player walked to the boss at 3:40 or the game moved them there."
   - **What happened:** This is the scripted end pose.
   - **Visual cause:** The player gets moved with no transition. It didn't mislead the reader about the cause, but it adds noise.
   - **Fix:** Show the boss's 👉 summoning bubble, then the player walking in.
6. **Background beats the reader flagged and rightly set aside.** They don't affect any ending, so they need no fix.
   - The run 3 sight cone toward a coworker.
   - The woman's "?" in runs 7 and 9.

## Summary

Nine runs:

- **Explained (5):** runs 1, 2, 3, 7 and 9.
- **Partly (3):** runs 5, 6 and 8.
- **Unexplained (1):** run 4.

The verdict is `broken` because of run 4. The reader thinks they know why they won, but their reason is wrong ("the boss left"). That same wrong idea gives run 6 a false lesson and makes run 7 feel like the rules contradict each other. The game's central idea, "the dark shrinks sight to the beam", is never learned. Instead the reader believes "wait for the boss to leave."

It is one root problem, telling the boss and Kev apart in the dark. Fixing it, plus the run 8 order of events, would likely bring this up to `fixable` or better.

<!-- /cold-read:replay -->
