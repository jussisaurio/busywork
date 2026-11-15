# Cold reads: layoffs
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"ac0431ca7d338d6ca37bd718cbd652ed39d8a9621bbf8fa7c27c273f7c70906a","parts":{"card":"3e55d0a01ebabc65e4fff74678c2aeb3e8f968c5d9638790e3c8c6d9b74e3743","premise":"4cc477b471d0a304be2a81f373a7a669daeda57c9d341d8ffe14fc5537879fe1","prompts":"c2886f589c84ff30cad9e05d737f4d22d2f634d9aba125f62e9ac2a88edc579e"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs ac0431ca7d33: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 9 s | $0.02 |
| 2-review | report.md | 96 s | $0.47 |
| all | | 105 s (the steps add up to 105 s) | $0.49 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM. At 3:45 the boss will email HR a list of people being laid off, and I'm on it. I have 45 minutes.

**Goal:** Get my name off the list. I could delete it on the boss's computer (🖥️). I could steal or throw away a printed copy (🗑️). Or I could stop the email from going out at all.

**If I fail:** At 3:45 the email goes out and I'm fired. Or maybe I only fail if I'm caught.

**Questions:**
- Does "off it" mean only my name? Can I put someone else's name in my place? Is that allowed, or is it the joke?
- Does stopping the email count, or does my name have to come off?
- Is 🗑️ a printed list, deleting a file, or a hint that the list goes in the trash?
- Will I know which computer is the boss's?
- Does HR already have a copy?
- Does "The Layoff List" mean there's one list, a paper one, or a computer file?
- Why is there no comedy or tone in the card itself?

### 2-review: report.md

Verdict: fixable

**1. The badge points at the tool.** The card icons are 🖥️ and 🗑️. 🗑️ is the exact icon on "take your name off the list" (`index.js:136`), and 🖥️ is the computer you use it on. So the badge shows the way out, not the trouble. It also sends players the wrong way: first-read.md goes looking for a printed copy to throw away, and none exists. *Fix:* use icons for the threat, like 📧📦 (the email and the cardboard box).

**2. "Kev" can fix a computer that works fine.** `fix_pc` only checks `hoodie && pc==='boss' && fix==='none'`. It never checks `glitch`. From about 3:33 you can offer, and the boss smiles and steps aside even though his screen is fine. The offer also cancels the 3:35 static (`actsUp` returns early), so the beat where "the boss wants Kev" turns into decoration. This is where the hoodie route's logic falls apart. *Fix:* require `w.glitch`. That gives a tight window from 3:35 to 3:37.5, while Lin is away.

**3. The hoodie win card shows something the player didn't do.** To win you have to be in the desk zone at 3:45. The card then shows you hooded at the boss's keyboard as the list goes out. Also, you sit at your desk in Kev's hoodie: to the boss that's "Kev", so your own chair should count as empty, which is the blamed case. *Fix:* make the hoodie leave-able at your desk too, or require hanging it back on Kev's chair. Show the boss's thank-you as a flashback, with you at your desk in the corner of the card.

**4. Kev takes his hoodie off on his way out.** He is heading outside, and he still sweats, strips and leaves it on the chair at 3:23.8. He does this only because the puzzle needs it. *Fix:* he takes it off at 3:06, hot after crouching in the boss's stuffy glass box, drapes it on his chair, and forgets it when he sneaks out.

**5. The timings in premise.md are wrong, and the boss's memory contradicts itself.** At 4 tiles per minute, the restroom is about 7.5 minutes from his desk. That means:
- The boss is crossing the floor from 3:12 to about 3:19.5 and from 3:26 to about 3:33.
- Lin isn't back from the restroom before 3:45.

Separately, he sends a list he wrote and never notices a face is missing. Yet in the blamed case he remembers you right away. *Fix:* correct the table. In the blamed card, have him squint at the three faces, look at your empty chair, and put you back on, so the missing face is the clue.

**Deducibility, otherwise:**
- **You're on the list:** the red frame on his monitor, visible through the glass from 3:06. The monitor is tiny, about 10px per face. Check it at play scale.
- **Kev may touch the boss's PC:** the 3:01 fix.
- **Kev went home:** you see him leave, and the boss is offscreen.
- **Lin sees through disguises:** shown through her double take.
- **The jacket:** works, but it relies on Lin turning her head, so you need to watch her timing.
- **Being at your desk at 3:45:** that's an engine rule, and only first-read.md is unaware of it.

**Name and card:** "Get your name off it" is a fair goal. First-read's guesses that don't exist in the game: stopping the email, swapping in someone else's name, a printed copy. Putting someone else's name in your place is a gag the level could use.

**The joke:** in the hoodie route the boss stands right behind you, smiling, while you delete yourself from his list, and then he thanks "Kev". It happens on screen, and it's funnier than the obvious version where he's out of the room. The jacket route has no matching picture beat. Lin's 😳 is the only gag there.

**Best thing:** the boss contentedly watching "Kev" delete you from his own layoff list, then thanking him for it.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"b69d6dcb602e80a62ad486cca50531ee0b8d265d04f3bb9f0199ee7c34c7bf93","parts":{"card":"3e55d0a01ebabc65e4fff74678c2aeb3e8f968c5d9638790e3c8c6d9b74e3743","shots":"43277fba4e98d2d160c3789bfeecf49cac273cf3e7573b2de9ca931c9f7b31e0","pictures":"275a4908273e9066a92418ad01cbff96a9a12c28360ffea0e38eb3808e05c210","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs b69d6dcb602e: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 74 s | $0.39 |
| 2-compare | report.md | 124 s | $0.47 |
| all | | 198 s (the steps add up to 198 s) | $0.85 |

### 1-read: reading.md

# Reading: The Layoff List

**01 (3:00)**: A bald man in a red tie sits at a desk in the top-left office. His monitor shows grey static and his bubble is 😠. I'm the red-sweater figure with a red ring, at a desk in the middle. A navy jacket hangs on a hook in the corner. It's clear right away that his computer is broken. I can't tell what the HUD icon next to the clock is: a monitor plus what might be a bin.

**02 (3:01)**: The bald man's bubble shows a spiky-haired face and a 👋. He's calling someone over by face. That's a nice, clear piece of language.

**03 (3:05)**: Spiky Hair, in a green jacket, is now at the boss's desk while the boss stands to one side. The jacket on the hook has turned grey. Is it dimmed? Out of reach? I can't tell.

**04 (3:06)**: The monitor now shows four faces in a list and the boss is 😊. Spiky Hair walks away. So he's the computer fixer, and the list is up on screen.

**05 (3:17)**: I'm at the coat hook, and my bubble shows a jacket or shirt-and-tie. The boss is far off near the bottom-right door with a sign on it. That's my window.

**06 (3:20)**: Spiky Hair stands in a doorway, calling the woman with the bun (face + 👋). I don't know why. It looks like a routine beat.

**07 (3:25)**: Spiky Hair's green jacket hangs on his chair, and he's in a white shirt in the grey tiled room at the bottom left. His jacket is free to take.

**08 (3:27)**: I'm wearing the green jacket at his desk, and the hand slot shows it. The boss walks by with his sight cone out. I'm hiding in plain sight.

**09 (3:30)**: The boss is at a door, calling Spiky Hair. I'm the one who'll answer.

**10 (3:35)**: The boss is back at his desk, and the monitor is static again. He calls Spiky Hair. The green jacket sits empty on the chair, I'm at my own desk, and the bun woman is wandering. So the computer breaks a second time, late in the afternoon.

**11 (3:34)**: I'm in the green jacket at the boss's desk. His bubble is 😊🖥️ and mine is 🖥️❓. He thinks I'm the fixer. The ❓ is funny, but does it mean I don't know how to fix it?

**12 (3:37)**: The list now shows three faces. Mine might be gone, but at this size I can't be sure. The boss is 😊 plus Spiky Hair's face. He's thanking the wrong person, which is a good gag.

**13 (3:28)**: I'm leaving the office in the green jacket. The boss's cone is red and the glass has turned pink. The bun woman's thought bubble is Spiky Hair's face + ❓, because she knows he's somewhere else. That reads well.

**14 (3:20)**: I'm wearing the navy jacket, and the hook is now a bare stand. I'm at the boss's monitor with a bin icon over my head. Spiky Hair's bubble is 😳 + bald face. He takes me for the boss? Or he's shocked that the boss is "here"? It's ambiguous.

**15 (3:22)**: Still in the navy jacket at the monitor, which now has red marks on it. A bubble near the bun woman's desk shows Spiky Hair's face + 👋. I can't tell who's speaking.

**16 (loss, red frame)**: The boss, with an angry starburst, points at me in the navy jacket as I carry a box with a plant. Icons: 😠 👉 📦. I was caught and fired on the spot at 3:28.

**17 (win, teal frame, 3:45)**: A green-jacket figure stands at the desk, the boss is 😊, and the list has three faces. Icons: Spiky Hair's face, ✉️, 😏. A Spiky Hair portrait fills the first slot. **Is that me in disguise or the real Spiky Hair?** The portrait says him, but the win says me. Confusing.

**18 (win, 3:45)**: The boss sends the list of three faces. The navy jacket is back on the wall, and I'm smirking at my desk. Icons: bald face, ✉️, 😏. The bald portrait fills slot two. That's a clean win.

**19 (loss, 3:45)**: Four faces, with me boxed in red. I'm crying and carrying a box. Icons: ✉️ 📦 😢. I did nothing, so this is the default ending.

**20**: Same picture as 16.

**21 (loss, 3:45)**: The boss is furious, my yellow chair is empty and glowing, and a printout with me circled is pinned up. Icons: 🪑 😠 ✉️. I think this means I was away from my desk when it counted, but "chair" is the weakest icon of the set.

**Also unclear:** the red ring around me, why "pretend" is sometimes highlighted, and the flying sheet of paper in the endings.

**The story:** The boss's computer breaks, and he summons the IT guy by face. Two disguises get you to his screen: the IT guy's green jacket (wait for him to break again and answer the call) or the boss's own navy jacket. Either way, you delete your face from the list and get back to your chair before 3:45. If you're caught in costume, you're fired early. If you're missing from your desk, the boss is suspicious. If you do nothing, you leave with a box. Clothes are identity, and identity gets you keyboard access.

### 2-compare: report.md

Verdict: fixable

- **01 (start)**: `reads`. The broken computer, the angry boss, you, and the jacket on its rack all land. The HUD icon (clock + monitor/bin) means nothing to the player yet, but that is cosmetic.
- **02 (boss-waves-kev)**: `reads`. "He's calling someone over by face. That's a nice, clear piece of language."
- **03 (kev-fixes)**: `partly` (cosmetic).
  - Reading: "The jacket on the hook has turned grey. Is it dimmed? Out of reach? I can't tell."
  - Intent: Kev is the one person allowed at the computer while the boss stands aside. That part reads.
  - Cause: missing cue. The rack greys out with no visible reason, so it looks like a state change that means something. In the shot Kev also stands at the front of the desk instead of typing at the keyboard.
  - Fix: keep the jacket in full colour unless it can actually be taken. Put Kev behind the desk with typing marks over the keyboard.
- **04 (list-before)**: `partly`.
  - Reading: "The monitor now shows four faces in a list… the list is up on screen." The player never sees that their own face is framed in red. They only notice it at 19.
  - Intent: the red frame shows that *you* are on the list. That is the whole stake of the level.
  - Cause: missing cue. The red frame is a few pixels wide on a tiny monitor.
  - Fix: when the screen comes back, show the sheet zoomed in for a second, or put a red ring on the monitor that pulses in step with your own red ring. Give your character a 😨 + 🖥️ bubble at that moment.
- **05 (coat-rack)**: `reads`.
- **06 (kev-waves-lin)**: `misread`.
  - Reading: "Spiky Hair stands in a doorway, calling the woman with the bun (face + 👋). I don't know why. It looks like a routine beat."
  - Intent: Kev says goodbye and Lin waves back, so she knows he has gone and the boss doesn't. The hoodie route's catch (13) depends on this.
  - Cause: the face + 👋 glyph is the summon glyph from 02 and 10, so it reads as "come here". Lin is shown seated with no wave back, and Kev isn't heading toward the elevator.
  - Fix: give goodbye its own glyph (👋 + 🛗 or 👋 + 🏠). Draw Kev mid-stride toward the exit, and give Lin her own answering 👋 bubble.
- **07 (hoodie-on-chair)**: `partly`.
  - Reading: "he's in a white shirt in the grey tiled room… His jacket is free to take."
  - Intent: Kev is hot, so he takes off the hoodie and is *leaving for the day* by the elevator.
  - Cause: missing cue. There are no sweat drops, and nothing says this is a departure. The grey lobby isn't clearly the way out.
  - Fix: add 💦 to Kev as he takes the hoodie off. Open the elevator doors as he reaches them and add a small 🏠 bubble.
- **08 (hoodie-on)**: `reads`. "I'm hiding in plain sight."
- **09 (boss-greets-kev)**: `partly`.
  - Reading: "The boss is at a door, calling Spiky Hair. I'm the one who'll answer."
  - Intent: the boss *sees you* in the hoodie and greets you as Kev. That is the proof that the disguise works.
  - Cause: the same face + 👋 summon glyph again, with nothing showing who the boss is looking at. He stands in a doorway, not "back at his desk", and his gaze doesn't clearly land on you.
  - Fix: show his sight cone touching you before the bubble appears, and use a greeting glyph (🙂 + Kev's face) instead of the summon wave.
- **10 (acts-up)**: `partly`.
  - Reading: "He calls Spiky Hair… So the computer breaks a second time, late in the afternoon." The player gets the second break.
  - Intent: also that Kev has gone home, so the boss wonders where he is (Kev's face + ❓ thought).
  - Cause: missing cue. The ❓ thought isn't in the capture. Only the summon bubble shows.
  - Fix: after the wave, show the Kev + ❓ thought for a second, with the boss looking at Kev's empty chair. Recapture the shot.
- **11 (kev-asks)**: `partly`.
  - Reading: "mine is 🖥️❓… The ❓ is funny, but does it mean I don't know how to fix it?"
  - Intent: you *offer* to fix it, and the boss steps aside as he did for Kev.
  - Cause: a glyph used as the wrong prop. ❓ means doubt, not an offer. The boss stands behind his chair, not to one side as he did in 03. The clock also says 3:34, one minute *before* the 3:35 breakdown in 10, and a careful player will notice.
  - Fix: change your bubble to 🖥️ + 🔧 (or 🖥️ + 👍). Put the boss in the same spot beside the desk as in 03, so the echo is visible. Make the breakdown time match across loops.
- **12 (list-after)**: `partly`.
  - Reading: "The list now shows three faces. Mine might be gone, but at this size I can't be sure." The thank-the-wrong-guy gag lands.
  - Intent: your face has left the sheet. This is the payoff of the scheme.
  - Cause: missing cue. The removal happens at thumbnail size with no event.
  - Fix: when you edit, have your red-framed face pop off the monitor (a small poof, or a face sliding into a 🗑️). Then zoom in briefly on the three-face sheet.
- **13 (lin-double-take)**: `partly`.
  - Reading: "The boss's cone is red and the glass has turned pink. The bun woman's thought bubble is Spiky Hair's face + ❓… That reads well."
  - Intent: *Lin* is the danger. She saw Kev leave, so she does a double take and points you out. The lesson is to do it while she's away.
  - Cause: cause and effect too far apart. The red cone that turns the glass pink comes from Lin, but the player gives it to the boss, who stands in the middle of the frame. Lin doesn't point, so there's no step from her doubt to your exposure.
  - Fix: draw the cone from Lin's eyes with a clear apex at her head. Add a frame where she stands and points 👉 at you with a ❗, and only then turn the boss's head.
- **14 (lin-greets-boss)**: `misread`.
  - Reading: "Spiky Hair's bubble is 😳 + bald face. He takes me for the boss? Or he's shocked that the boss is 'here'? It's ambiguous."
  - Intent: *Lin*, looking through the glass, takes you for the boss.
  - Cause: the shot shows the wrong speaker. The bubble really does sit over Kev, who stands by Lin's desk, while Lin sits below. 😳 also reads as alarm, not respectful recognition. The 🗑️ prompt over your head is a glyph used as a prop, and it reads as an object in the room.
  - Fix: anchor the bubble on Lin, turned toward the glass. Use a "sitting up straight" glyph (😬 + bald face, or 🫡 + bald face) so it means "the boss is watching". Move the action prompt into the hand slot or the HUD, not over your head.
- **15 (jacket-edit)**: `misread`.
  - Reading: "the monitor, which now has red marks on it. A bubble near the bun woman's desk shows Spiky Hair's face + 👋. I can't tell who's speaking."
  - Intent: your face comes off the sheet while anyone looking in sees the boss at his own computer. This is the payoff of the jacket route.
  - Cause: cause and effect too far apart, plus a missing cue. The edit is invisible at this scale. Meanwhile the Lin–Kev goodbye from 06 plays at the same moment on the other side of the glass and draws the eye. The bubble's tail sits between Lin and Kev.
  - Fix: use the same face-pops-off effect as in 12, plus a brief zoom on the sheet. Move Kev's goodbye out of the 3:20–3:23 window, or keep it out of the edit shot, so the payoff has the frame to itself.
- **16 (caught)**: `reads`. "I was caught and fired on the spot." Note: this file is the same end card as 20, not the in-world moment where the boss stops and points. That beat was never shown to the reader.
- **17 (end-win-hoodie)**: `partly`.
  - Reading: "**Is that me in disguise or the real Spiky Hair?** The portrait says him, but the win says me." The reader also lists "the flying sheet of paper" as unclear.
  - Intent: *you*, in Kev's hoodie, have won, and a copy of the clean list goes to HR.
  - Cause: an emoji standing in for a person. Kev's face is the first icon and the slot portrait, and the figure at the keyboard has its back turned. The flying sheet has no destination.
  - Fix: show your own hair or red-sweater cuff under the hood, and make the first icon your face wearing the hood (or the hoodie itself) instead of Kev's face. Send the sheet into a labelled 🗂️ tray or out of a door so it visibly arrives somewhere.
- **18 (end-win-jacket)**: `reads`. "That's a clean win." (One quibble: the slot shows the bald portrait, which has the same identity problem as 17, but here the reader read it correctly.)
- **19 (end-fail)**: `reads`. "I did nothing, so this is the default ending."
- **20 (end-caught)**: `reads`.
- **21 (end-blamed)**: `reads`. "I was away from my desk when it counted." The lesson lands, and the reader's route summary includes "get back to your chair before 3:45". 🪑 is the weakest icon of the set; an empty chair with a ❗ would carry more.

**Overall.** The level's grammar mostly works: the reader got both routes, the costume-caught loss and the be-at-your-desk rule. The trouble is concentrated in one glyph and one payoff:

- **Face + 👋 does four jobs:** summon (02, 10), greet (09), goodbye (06) and an unattributed bubble (15). Split it into summon, greet and goodbye glyphs, and 06, 09 and part of 15 fix themselves.
- **The edit itself is never visible** (04, 12, 15). The scheme's central action happens on a thumbnail. One shared "your face pops off the sheet" effect would fix three shots.
- **Unexplained general cues:** the red ring under you, "pretend" lighting up, and the flying paper in the endings. Each needs one visible cause the first time it appears.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"247b13c+dirty","hash":"d34c7f5e8327660ce7146ccdf6cd464df19e175d477fa02a7d0ce563c33a1be9","parts":{"card":"3e55d0a01ebabc65e4fff74678c2aeb3e8f968c5d9638790e3c8c6d9b74e3743","checks":"e51e031e7113d0d141db7f528b61923b0de36e4265e9be2242e7f5aa2c0eff34","ways":"b0dad2b5f10d869dd3050ff35ad5eb788855e43c51e10bec47eac29b5493640d","frames":"df84a054d4161501527b2115175de841cfc79ff32099f53b12bfb1828f91d4ca","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit 247b13c+dirty, by claude -p (model: default). Inputs d34c7f5e8327: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 166 s | $0.73 |
| 1-read-2 | reading.md | 120 s | $0.49 |
| 2-compare | report.md | 88 s | $0.32 |
| all | | 255 s (the steps add up to 375 s) | $1.53 |

### 1-read-1: reading.md

# Reading: The Layoff List

## Run 1: Loss
- 3:00: The bald man in the tie is at his desk with an angry face. His screen shows static. You (red top) are at your desk.
- 3:01: Boss bubble: a spiky-haired face and a waving hand.
- 3:06: The spiky-haired coworker in the olive jacket is at the boss's computer. The screen shows four faces. The boss stands beside him and smiles.
- 3:21: The boss is gone. Spiky-hair is at the office door and the teal coworker at their desk, both with face-and-wave bubbles.
- 3:35: The boss is back, angry, and shows the face-and-wave bubble again. The teal coworker walks off to the bottom-right exit.
- 3:37: The boss thinks "face ?", then looks angry. The list is back on the screen.
- 3:45: You are standing in the boss's office. He grins. Papers lie on the floor by your desk.
- 3:46: The list highlights your face and you leave carrying a box. Icons: email, box, crying face.

**Why it ended:** The email went out with you on the list.
**Your cause:** None. No action is marked.
**Maybe not about you:** Every bubble. You end up in the office at 3:45 even though no action is marked. I can't tell if you walked there or the game moved you.

## Run 2: Loss
- 3:00–3:21: Same as Run 1. You walk toward the office.
- 3:23: You are at the boss's empty desk with a document icon. The teal coworker's red view cone shows "?", then "!" and a pointing finger.
- 3:26: You're back at your desk next to a tall stack of paper. Teal's bubble points at a computer. Out in the room, the boss's bubble shows two papers, a pointing finger and a computer. A red meter with a paper icon appears at the top right.
- 3:35–3:37: Same as Run 1.
- 3:45–3:46: You're in the office. The ending is the same as Run 1.

**Why it ended:** You were still on the list.
**Your cause:** Using the boss's desk at 3:23 got you caught and changed nothing I could see.
**Maybe not about you:** The boss's paper bubble. He was nowhere near the teal coworker. The captions don't mark an action, though the E key glows at 3:23.

## Run 3: Win
- 3:00–3:21: Same as Run 1.
- 3:29 (action): At spiky-hair's empty desk, you take the olive jacket and now look olive. The jacket shows in your item slot. The boss is in the hallway with the face-and-wave bubble.
- 3:34 (action): You're in front of the boss's desk with a "computer ?" bubble. The boss smiles at the computer.
- 3:37 (action): You're at his computer. The boss stands aside. Bubble: smile and spiky-hair's face.
- 3:40: You're back at your desk. The teal coworker thinks "face ?".
- 3:41: Teal shows "!" and points. Paper stack, paper meter and boss paper bubble, same as Run 2.
- 3:45: You have a confetti bubble. Spiky-hair's face fills a reward slot.
- 3:46: The list has three faces and yours is gone. You're in the boss's chair while he smirks. Icons: spiky-hair, email, smirk.

**Why it ended:** Your face was off the list when the email went out.
**Your cause:** The jacket made the boss treat you as spiky-hair and let you use his computer. I can't tell whether the 3:34 or the 3:37 use took your name off.
**Maybe not about you:** Spiky-hair never comes back after 3:21. In Runs 1 and 2 he was back by 3:35. The teal coworker reporting you did nothing.

## Run 4: Loss
- 3:00–3:21: Same as Run 1.
- 3:27 (action): You take the jacket at spiky-hair's desk. The boss walks through the open office.
- 3:29: In the jacket, you head for the office. The teal coworker's red cone shows "spiky face ?".
- 3:29: Teal shows "!" and points. You're at your own desk next to a paper stack. The boss's paper bubble and the meter appear.
- 3:35–3:37: Same as Run 1, with "?" and angry faces.
- 3:45: You're in the office, still in the jacket, and the boss grins.
- 3:46: The ending is the same as Run 1. It shows you in the red top, not the jacket.

**Why it ended:** You never reached the computer, so you stayed on the list.
**Your cause:** Teal caught you on your way in. You seem to snap back to your desk within the same minute, but I can't confirm that.
**Maybe not about you:** The boss's 3:37 "?" shows up in every run. The red top in the ending picture contradicts the jacket.

### 1-read-2: reading.md

I've read all three runs and am writing up the reading now.

# reading.md

**What I saw throughout:** The bald boss works in a corner office. A navy suit jacket hangs on a coat rack in the top-left corner. At 3:06 his monitor shows a row of face photos, and the red-haired player with a bun seems to be one of them.

## Run 5: WIN

- 3:00 Boss at his desk, 😠. Player at the middle desk.
- 3:01 Boss bubble: dark-haired face + 👋.
- 3:06 Boss steps right, 😊. Someone in a green jacket walks into his office. Monitor shows faces.
- 3:20 Player takes the jacket off the rack (it shows in the hand slot) and sits at the boss's desk wearing it. Green-jacket person and teal-shirt woman: 😳 + bald face.
- 3:21 Both bubble dark-haired face + 👋.
- 3:22 Player uses the boss's computer.
- 3:23 Player hangs the jacket back on the rack. The monitor now shows fewer faces.
- 3:35 Boss back at his desk. Player at own desk, chair bubble, holding Shift ("pretend").
- 3:37 Boss thinks: dark-haired face + ❓. His monitor shows three faces.
- 3:45 Player bubble 🎉.

**Ending:** The emailed list has three faces and the player's isn't one. End icons: boss, 📧, 😏. One boss-face token fills a slot.

**Cause:** Editing at the computer while wearing the jacket, then putting it back.

**Unclear:** The 3:37 ❓ could be about the list, or about the 3:01 summons. The 👋 bubbles copy the boss's 3:01 bubble, so they may be routine, not reactions to the player.

## Run 6: LOSS

- 3:06 Same opening as Run 5.
- 3:19 Player takes the jacket. A red sight cone comes from the teal-shirt woman, who thinks: bald face + ❓.
- 3:20 Player at the boss's desk, small bin-like bubble. Teal-shirt woman: spiky "❗👉", with a red dashed line to the player.
- 3:21 👋 bubbles again.
- 3:26 Player back at own desk, still in the jacket. Teal-shirt woman: spiky "👉 jacket". A paper stack sits on the player's desk. A paper icon with a red bar appears top-right. Boss at the bottom-right desk: 📄📄👉🖥️.
- 3:35–3:37 Boss at his desk: 😠, 👋, ❓, 😠. Monitor still shows four faces.
- 3:45 Player stands in front of the boss in the jacket. Boss 😅. Papers lie on the floor by the player's desk.

**Ending:** The list has four faces with the player's outlined in red. Icons: 📧 📦 😢.

**Cause:** It looks like the player never used the computer, since there's no "used" mark at 3:20. Being spotted at 3:20 may also have counted, but I can't tell. I also can't explain the paper stack, the red bar, or the papers on the floor.

## Run 7: LOSS at 3:28

- 3:20–3:22 Same as Run 5: jacket, boss's desk, computer used.
- 3:27 Monitor shows fewer faces. Player at own desk, still in the jacket. Boss walks through the open office (he was in about that spot at 3:26 in Run 6). Red sight cone: bald face + ❓, then spiky ❗😠.

**Ending:** The list is back to four faces with the player's outlined in red. Boss is angry. Icons: 😠 👉 📦.

**Cause:** Keeping the jacket on where the boss could see it.

**Unclear:** Was he reacting to the jacket, or to seeing the player at all? In Run 6 the boss saw the player in the jacket at 3:45 and only showed 😅. His walk itself looks like routine, not a reaction to the player.

### 2-compare: report.md

I've read all three files and looked at a few pictures to settle the disagreements. Here is the report.

Verdict: fixable

## Runs

- **Run 1 (do nothing → fail): `explained`.** The reader says "The email went out with you on the list" and names the player's part: "None." That matches the real run.
- **Run 2 (edit the list as yourself → Lin sees you → fail): `explained`.** The reader says "Using the boss's desk at 3:23 got you caught and changed nothing I could see," and "You were still on the list." That is the right cause and the right action. They didn't follow the paperwork part (see beat C).
- **Run 3 (wear Kev's hoodie, "Kev" fixes the computer → win): `explained`.** The reader says "The jacket made the boss treat you as spiky-hair and let you use his computer." That is the real cause, though they call the hoodie a jacket. One gap: "I can't tell whether the 3:34 or the 3:37 use took your name off." In 03/07.png the face does drop off, but it's too small to see. That doesn't change the mark, but it's thin (see beat E).
- **Run 4 (hoodie in front of Lin, who saw Kev go home → fail): `partly`.**
  - Reading: "Teal caught you on your way in… You never reached the computer, so you stayed on the list."
  - What really happened: Lin waved Kev goodbye at 3:21. When she sees "Kev" again, she knows it's a fake. Her "spiky face ?" is a double take: "didn't he leave?" The reader got the ending and who stopped them, but not why the disguise failed. They never saw Kev leave (beats A and B), so to them "Teal caught you" is just bad luck, not a lesson about who saw what.
  - Visual cause: cause and effect too far apart, plus a missing cue. Kev leaving at 3:21 looks exactly like the 3:01 summons, and the double take 8 minutes later points back to a goodbye the reader never registered.
  - Fix: make Kev's goodbye one unmistakable picture. He puts on a backpack or coat, waves "👋🏠", and walks out the bottom-left door while the camera can see it. Then have Lin's double take repeat that picture: "Kev's face 🏠 ❓". That ties her suspicion to the goodbye she saw.
- **Run 5 (wear the boss's jacket, edit as "the boss", hang it back → win): `explained`.** The reader says "Editing at the computer while wearing the jacket, then putting it back." That's right. They logged Lin's "😳 + bald face" but didn't read it as "she thinks you're the boss." The win still holds up.
- **Run 6 (jacket on in front of Lin → double take → desk work → fail): `unexplained`.**
  - Reading: "It looks like the player never used the computer, since there's no 'used' mark at 3:20. Being spotted at 3:20 may also have counted, but I can't tell. I also can't explain the paper stack, the red bar, or the papers on the floor."
  - What really happened: Lin watched the player put the jacket on at 3:19. Her "bald face ❓" is a double take ("that's not the boss, that's you"). Then "❗👉" means she reported them, and the player was sent back to their desk with paperwork before they could edit. The reader's main cause ("never used the computer") describes a symptom, and they only half-suspect the real cause.
  - Visual cause: a missing cue. Nothing shows the player being removed from the computer. Between 3:20 and 3:26 the player simply reappears at their own desk. Being sent away and given work isn't shown as a consequence of being reported.
  - Fix: show the removal. After Lin's "❗👉", the boss's "📄📄👉🖥️" bubble appears right over the player, and the player is visibly walked back to their desk while the paper stack drops onto it. Better still, the player's face on the monitor flashes red at that moment so it reads as "your chance is gone."
- **Run 7 (jacket still on when the boss gets back → caught): `explained`.** The reader says "Keeping the jacket on where the boss could see it." That's right, though they doubt it because the boss's reaction in Run 6 was different (beat G).

## Beats that misled the reader

**A. Kev's goodbye at 3:21 reads as an echo of the boss's summons (every run).**
- Reading (Run 1): "Spiky-hair is at the office door and the teal coworker at their desk, both with face-and-wave bubbles." Run 5: "The 👋 bubbles copy the boss's 3:01 bubble, so they may be routine."
- What really happened: Kev and Lin are saying goodbye to each other. Kev goes home.
- Visual cause: the bubble reads like the boss's summons. "Face + 👋" means "come here" at 3:01 and "bye" at 3:21. The same picture is used for two meanings, and the second one is the key fact for the whole hoodie route.
- Fix: give the goodbye its own icon, such as "👋🏠" or a door icon, and have Kev put a coat or bag on before he walks out.

**B. The reader thinks Kev came back at 3:35 in Runs 1 and 2.**
- Reading (Run 3): "Spiky-hair never comes back after 3:21. In Runs 1 and 2 he was back by 3:35."
- What really happened: Kev is gone in every run. In 01/05.png (3:35) the only olive thing by his desk is the hoodie lying on his chair, which the reader took for Kev himself.
- Visual cause: a missing cue. The hoodie on the chair is drawn like a person in a hoodie. Nothing on screen says "nobody's here."
- Fix: draw the hoodie draped over the chair back with the empty seat visible, and turn Kev's monitor off when he leaves.

**C. The boss's paperwork bubble seems to come from nowhere (Runs 2, 4, 6).**
- Reading (Run 2): "The boss's paper bubble. He was nowhere near the teal coworker." Run 6: "Boss at the bottom-right desk: 📄📄👉🖥️… I can't explain the paper stack, the red bar."
- What really happened: Lin reported the player, the boss handed out desk work as the punishment, and the red meter is the time that work takes.
- Visual cause: an emoji stands in for a person. The boss is far away when he gives the order, so his bubble doesn't read as a response to Lin. The meter has no link to the paper stack.
- Fix: draw Lin's red dashed "report" line from her to the boss first, then from the boss to the player's desk. Then have the stack visibly drop onto the desk, with the meter drawn on the stack itself instead of tucked in the top-right corner.

**D. The 3:45 send cutscene looks like player movement (Runs 1, 2, 4, 6).**
- Reading (Run 1): "You end up in the office at 3:45 even though no action is marked. I can't tell if you walked there or the game moved you."
- What really happened: the ending scene puts the player in front of the boss (01/09.png). The boss's grin is part of that scene, not a reaction. The design doc also lists an empty chair at 3:45 as a separate loss ("Blamed"), so moving the player out of their chair hurts that reading too.
- Visual cause: a missing cue. Nothing marks the start of the cutscene.
- Fix: at 3:45, freeze the player at their desk and zoom in on the boss's monitor for the send. Don't move the player.

**E. The win's key moment is too small to see (Runs 3, 5).**
- Reading (Run 3): "I can't tell whether the 3:34 or the 3:37 use took your name off." Run 5: "The 3:37 ❓ could be about the list."
- What really happened: the face drops off at the 3:37 edit. In 03/07.png the monitor is a few pixels tall. Separately, the boss's 3:37 "face ❓" is his routine "where is Kev?", not a reaction to the edit.
- Visual cause: cause and effect too far apart in scale, plus a bubble that reads as a reaction. The removal happens on a tiny screen, and the boss's next bubble seems to be about it.
- Fix: when the player's face comes off, pop a large copy of the sheet above the monitor for a beat, with the red-framed face struck through and falling off.

**F. Lin reporting the player after a win looks like it mattered (Run 3).**
- Reading: "Teal shows '!' and points… The teal coworker reporting you did nothing."
- What really happened: Lin comes back from the restroom at 3:40, sees the hoodie, and reports it. But the list is already edited, so the punishment can't undo the win. The reader got this right, but it's a scary beat that changes nothing. It teaches "getting caught is harmless," which contradicts Runs 2, 4 and 6.
- Visual cause: a bubble that reads as a reaction, but has no visible consequence.
- Fix: if a report comes after the edit, have it fizzle on screen. For example, the boss glances at the three-face list and waves Lin off with "🤷".

**G. The boss's reaction to his own jacket is inconsistent (Runs 6, 7).**
- Reading (Run 7): "In Run 6 the boss saw the player in the jacket at 3:45 and only showed 😅."
- What really happened: in Run 7 he catches the player at 3:27, during real play. In Run 6 the 3:45 meeting is the ending cutscene (beat D), where no rules apply.
- Visual cause: a missing cue. Nothing separates the cutscene from play.
- Fix: same as beat D. Don't put the player in front of the boss at 3:45. For a jacket loss, show the player in their own clothes on the loss card.

**H. The ending card shows the wrong outfit (Run 4).**
- Reading: "It shows you in the red top, not the jacket."
- What really happened: the player was wearing Kev's hoodie when the day ended. The card draws the default outfit, which makes the reader doubt what they just saw.
- Visual cause: a missing cue. The card doesn't follow the player's actual state, even though the design doc says the "caught" card keeps the boss's jacket.
- Fix: draw the loss card with whatever the player is wearing at 3:45.

## Summary

Both wins are explained, so the level isn't broken. It's `fixable` because of Run 6, a loss the reader couldn't explain, and because beats A, B and C misled the reader about causes. The biggest single fix is beat A: Kev's goodbye needs its own picture. Right now the main fact behind the hoodie route ("Kev left, and Lin saw him go") is drawn the same way as the boss calling Kev over.

<!-- /cold-read:replay -->
