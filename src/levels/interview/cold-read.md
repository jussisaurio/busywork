# Cold reads: interview
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"a0b1738","hash":"a3f23772b9a44d0b809de956899459072281ddedb9574da90c3cb38d9072ae6b","parts":{"card":"5e41f6d2261204654b3a278642c15d58675e67004861fe07915663d083ee880a","premise":"e0d0f452a22fea7bfd3b3f50408d3fc3ec41dfcb1d10040b75ab43872bec294f","prompts":"c2886f589c84ff30cad9e05d737f4d22d2f634d9aba125f62e9ac2a88edc579e"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit a0b1738, by claude -p (model: default). Inputs a3f23772b9a4: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 14 s | $0.02 |
| 2-review | report.md | 115 s | $0.51 |
| all | | 129 s (the steps add up to 129 s) | $0.54 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM. Lin wants my job and has a phone interview at 3:30. Reading 1: the company is quietly interviewing her to replace me. Reading 2: she's going for a promotion into my role, maybe with another manager. Either way, I'm the one being pushed out.

**Task:** Make sure Lin isn't on that phone call at 3:30.

**If I fail:** She takes the call. Maybe I'm replaced, or maybe the loop just resets. The card doesn't say.

**Questions:**
- Who is Lin? Is she a coworker, an outsider or an intern? How do I recognise her?
- Whose phone is it: a desk line or her mobile? Does it matter where she takes the call?
- Does being late count as missing it? What if someone else answers?
- Do I have 30 real minutes? Is there a visible clock?
- "@lin ❌": does that mean Lin fails, or Lin is eliminated? That second reading is darker than "comedy."
- Does "The Interview" mean only hers, or is someone also judging me?
- Who's on the other end? Is the interviewer in the building?

### 2-review: report.md

Verdict: fixable

**1. Lin's phone habits contradict each other.** Players hit this at 3:01 and at 3:26.
- If her own phone rings and she hears hold music, she hangs up angrily within seconds. If the kitchen phone rings and she hears the same music, she holds for 10 minutes "hoping it's her interviewer." An anxious candidate would hope hardest on her own line.
- The rings also give her away. Your rings show the phone's own colour, and only the interview rings red. She could see the yellow kitchen ring isn't the interview.
- She lifts her receiver to check it every 3.5 minutes. But `phones.js:162` quietly skips the check when the cord is out. So on the unplug route she sits from 3:26 to 3:30 with the cord lying at her feet and never checks it.
- **Fix:** Put the kitchen phone on the shared outside line, so it can ring red and she has a real reason to think it's her interviewer. Once she's back at her desk, show her rehearsing (📝) instead of checking, and do that in every loop so it's a visible routine and not a special case.

**2. Kev's "cable round" exists only for the puzzle.** He walks the length of the office at 3:06 to check one socket, Lin's, and then goes back to coffee. Nothing he does on screen explains why. Players meet him at 3:12 and can only accept it as "Kev checks plugs."
- **Fix:** Make it Kev's charging spot. He comes over to plug in his mobile (🔋) and pushes the loose plug back because it's in his way.

**3. The boss's hold times are tuned per phone and can't be predicted.** He holds 7 minutes on his own phone, 9 on Lin's and 4 on the others. These numbers only fit the solution windows. Nothing the player sees predicts them, so the busy window (3:17–3:24) and the ringout window (3:25–3:29) come down to trial and error.
- **Fix:** Give him one hold length everywhere. Make the tune visibly end (the notes stop, he hangs up 😊), then shift the windows to fit.

**4. The ringout end card shows something that didn't happen.** It draws Kev on hold. But he hung up by about 3:26, before the call came, and was sitting at his far desk at 3:30. premise.md admits this. The picture contradicts what the player just watched.
- **Fix:** Draw Kev at his far desk, sipping coffee and out of earshot.

**5. The badge reads darker than the game, and one rule is unexplained.** The first reader read "@lin ❌" as getting rid of Lin. They also had no idea they had to be back at their own desk by 3:34. The fiction for that rule is weak: the call is Lin's, not yours, so why does your empty chair matter? Separately, premise.md says head office is "filling your position," which means you lose the job either way. The card's "Lin wants your job" is the better stake.
- **Fix:** Change the badge to "@lin 💼 ❌". Make the 3:34 rule follow from the call: when the interviewer asks after you, the boss glances at your chair. Drop "filling your position."

**Stakes:** The card holds by comedy logic: stop the call and Lin doesn't get your job. The fail card makes the threat a picture (Lin in your chair with your red mug, you holding the box).

**Deducibility:** Mostly good.
- The phones carry far enough for every route. Kev is nearer the kitchen phone than Lin is, so that teaching fail works. Walls keep the boss from seeing the switchboard. The boss can see the socket through the glass, and you can watch Kev crouch there at 3:12.
- The rule "the nearest free person who hears it answers" is only taught by the kitchen teaching fail, but that is enough.

**Name and card:** They name only the trouble. "Phone interview" is the threat itself and doesn't point to a tool.

**The joke:** The boss stands at Lin's desk, eyes half shut, happily listening to hold music. Lin hurries back for the call that would get her your job and can only glare at him. It plays on screen, and the end card draws it. It beats the obvious version (you cut the line yourself) because the boss is the one who sinks her interview without knowing it.

**Best thing:** At 3:30 the boss hogs Lin's line just to enjoy the hold music, and the interview gets a busy signal while she glares at him.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"5c30f75","hash":"520361334ef7a0e59ae11dbce75141949a826fe61c0d2784eadbe507a3acafdb","parts":{"card":"5e41f6d2261204654b3a278642c15d58675e67004861fe07915663d083ee880a","shots":"588b64892c7f0ca71a304797846d9085600d41cc9654e5f09da169675a62a02a","pictures":"a26556d04e558af67216f713a2d2cf620701355eb10933cfc9d21373752f919b","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit 5c30f75, by claude -p (model: default). Inputs 520361334ef7: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 77 s | $0.47 |
| 2-compare | report.md | 94 s | $0.39 |
| all | | 171 s (the steps add up to 171 s) | $0.87 |

### 1-read: reading.md

# The Interview: cold read

**01** 3:00. I'm the red figure at a centre desk. A teal woman with a bun (Lin, I assume) is at the far-left desk, her phone cord running to a wall socket. A bald man in a suit sits in a glass office. A man in green is at the kitchen coffee machine. Top-centre is a board with five pictures: briefcase, Lin, bald man, spiky-haired man, mug. *Can't read:* the empty hand slot and the four dashed slots in the HUD.

**02** Lin turns to the wall clock and thinks "clock". She's waiting for her call.

**03** I'm at the board and a hand appears over the bald man's slot. So the board can be used. I can't yet tell whether it's a switchboard or a key rack.

**04** 3:09. Lin is eating in the kitchen. Green man walks toward her desk. I'm at my desk with "pretend" lit and papers flying. *Can't read:* what pretending does here, and the fast-forward icon.

**05** 3:12. Green man crouches at Lin's wall socket with a 👌 bubble. The boss is on his phone. *Can't read:* is he unplugging her phone or plugging something in? It matters a lot.

**06** 3:19. I press the spiky-man button and green rings spread from his desk phone. In the kitchen he shows "!". So the board rings people's desk phones.

**07** He's at his desk with ♪ (on hold?), and Lin is walking back. Ringing someone moves them around.

**08** I ring the mug slot. Yellow rings fill the kitchen and Lin answers the wall phone with ♪♪. The mug means the kitchen phone, which I only learned by trying it.

**09** The boss holds his handset with ♪😌 and a dark-red chair sits beside him. Green man passes Lin's desk.

**10** Lin's cord lies unplugged on the floor. I have a chair bubble and my seat is gone. *Can't read:* did I take my chair, or am I thinking about it?

**11** Green man at Lin's socket gives 👍. The boss enjoys hold music. Is green man my accomplice, or a regular who does this every loop?

**12** 3:03. I ring Lin early and she's at her desk looking 😠. Prank calls annoy her, and that's all I learn.

**13** 3:25, and the clock turns red. The boss is on Lin's phone at her desk, ♪😌, and Lin is walking back. *Can't read:* why he left his office for her phone.

**14** 3:31. A red patch cord connects the briefcase slot to Lin's slot by itself. Lin says 💼😊. That's the interview arriving, and she got it.

**15** 3:30. The cord is in, her desk phone rings red, but she's at the kitchen phone. The boss shows "!".

**16** 3:30. Lin is at her desk with a dead phone, thinking clock+? The unplugging worked.

**17** The boss uses her desk phone while she stands next to him with boss-face 😠. He blocks her line.

**18** The boss is on his own phone, Lin is on the kitchen phone, and the briefcase call goes to her empty desk.

**19** WIN card. The boss holds Lin's phone with a 💼 Lin ? bubble. Lin hears hold music in the kitchen and I grin. A shrugging badge fills slot 1. *Can't read:* the shrug figure.

**20** WIN. The boss is on hold at her desk and she's furious. Note badge, slot 2.

**21** WIN. Plug, Lin, clock, ? Plug badge, slot 3.

**22** WIN. Everyone is on hold and the ringing desk is empty. Bell badge, slot 4. Four slots means four ways to win. Nice.

**23** LOSS (red frame). Lin takes the call, 💼😊, and I'm packing a box. Funny and clear.

**24** LOSS at 3:15. The boss catches *me* at her socket, 😠👉. So green man can do it and I can't? I'd like to see why.

**25** LOSS. The boss points at my empty chair: "me ? 😠". I was away from my desk at 3:34, which explains the chair bubble in 10.

**Story:** Lin's interview call comes in through the switchboard at 3:30. I can't touch her directly, only the phones. I ring the kitchen to pull her away, put people on hold, or get her line cut. The boss guards the desks and wants me in my seat. The idea is that a phone call moves a person. My stumbles were the green man's role, the "pretend" key, and what the mug and briefcase icons meant. I only worked those out by trying them.

### 2-compare: report.md

Verdict: fixable

The player understands the level's main idea: a phone call moves a person. They also understand all four win endings and both losses. But two shots that the unplug route depends on are misread. In 09 the player doesn't see that the boss has turned his back. In 11 they don't see that Kev undoes the unplug. Those two gaps explain the question the player asks at 24: "green man can do it and I can't?" Both can be fixed with art changes. I opened shots 01, 03, 05, 08–11, 13, 14, 21, 23 and 24 to settle disagreements.

**01 — partly.** The reading: "Top-centre is a board with five pictures… *Can't read:* the empty hand slot and the four dashed slots." Intent: Lin lifts her teal receiver to listen, the boss faces the open-plan office, and there is a switchboard in the nook. In the image Lin's receiver is a few pixels at her ear, so the player misses that she is checking for a call. The switchboard looks like a picture board: the jacks are dots too small to see, there are no cables, and no lamp is lit. **Fix:** draw two or three patch cables hanging below the jacks so the board reads as a phone switchboard. Draw Lin's receiver at its full size, raised off the cradle with the cord stretched.

**02 — reads.**

**03 — partly.** The reading: "I can't yet tell whether it's a switchboard or a key rack." Intent: the switchboard up close and lit, with a jack under each face card and a red lamp for the outside line. The outside line is shown by a briefcase card, which the player has to decode. There is no red lamp you can see until 14, and the board is not lit any differently when you are at it. **Fix:** give the board a soft glow when you're in reach. Put a dark red lamp over the briefcase jack from the start, so that when it lights at 14 the player recognises it.

**04 — reads.** "Eating" for "tea" doesn't matter.

**05 — partly.** The reading: "is he unplugging her phone or plugging something in? It matters a lot." Intent: Kev checks the cord, it's plugged in, OK. The 👌 bubble sits over a crouch that looks like tampering, and you can't see whether the plug is in the socket. **Fix:** show the plug seated in a socket with a small green tick or spark, and Kev tapping it rather than gripping it.

**06 — reads.**

**07 — reads.**

**08 — partly.** The reading: "Lin answers the wall phone with ♪♪. The mug means the kitchen phone, which I only learned by trying it." Intent: Kev heads for his own ringing phone, so Lin is the only free person in earshot. She answers hoping it's her interviewer (briefcase, ?). There are two causes:
- **Glyph used as a prop:** a mug card stands for the kitchen wall phone.
- **Cause and effect too far apart:** the yellow rings are centred on the kitchen table, not the wall phone by the fridge. Kev is off at the far right and doesn't look tied to what happens. The bubble shows the end result (♪♪) instead of her hope (💼?).

The "nearest free person answers" rule is the core of routes 13, 15 and 18, and this is where it should first be taught.
**Fix:** replace the mug card with a small yellow wall phone and centre the rings on the handset. Show Lin with 💼? as she reaches for it, before ♪♪ appears.

**09 — misread.** The reading: "The boss holds his handset with ♪😌 and a dark-red chair sits beside him." Intent: he stands at his window with his back to the room, and his sight cone points out of the window. That is the safe moment to pull the plug. The player saw the handset and missed the facing completely. The cone is faint pale orange against the orange carpet, and it points into a thin window strip that doesn't look like a window. The empty chair draws the eye instead. This is a **missing cue**, and it is why the 24 loss feels unfair to the player. **Fix:** draw the window as a big bright pane with a view. Make the boss's cone clearly visible and pointing out of it, and grey out or shade the office floor behind him so "not watching" is plain.

**10 — partly.** The reading: "Lin's cord lies unplugged on the floor. I have a chair bubble and my seat is gone. *Can't read:* did I take my chair, or am I thinking about it?" Intent: you pulled the plug and walked off, and the boss still has his back turned. The loose cord reads. But the 🪑 bubble over the player is **an emoji standing in for a game state** ("you're away from your seat"). It pulls attention away from what the player has just done. Nothing in the frame says "you did this", and the boss's facing isn't noticed. **Fix:** remove the bubble. Show your empty chair at your desk with a faint red outline, and show the loose plug swinging, or a small puff at the socket, as you walk away.

**11 — misread.** The reading: "Green man at Lin's socket gives 👍… Is green man my accomplice, or a regular who does this every loop?" Intent: too early. On his cable round, Kev finds the cord loose and pushes it back in. This frame is nearly identical to 05: same time (3:12), same crouch, same spot. Only 👌 has become 👍. No loose cord is shown before he fixes it, and there's no "!", so the before and after are **too far apart** to see. The player takes the man who undoes their plan for a helper. That breaks the timing of the unplug route. **Fix:** show the cord lying loose on the floor with Kev reacting "!" as he finds it. Then show him jamming it in with a spark at the socket, and use a different pose from 05 (for example standing and pushing hard).

**12 — reads.**

**13 — partly.** The reading: "*Can't read:* why he left his office for her phone." Intent: Lin is having her tea, her teal phone rings, and the boss walks out of his office to answer it. The shot is taken after the cause. Lin is already back beside her desk and no rings are drawn, so the player sees the effect without the trigger (**cause and effect too far apart**). This sets up the busy-line route (17, 20). **Fix:** move the shot earlier: teal rings on Lin's empty desk phone, Lin still at the kitchen table, the boss halfway through his door looking toward the sound.

**14 — reads.**

**15 — reads.**

**16 — reads.**

**17 — reads.**

**18 — reads.**

**19 — reads.** The shrug badge is cosmetic.

**20 — reads.**

**21 — reads.**

**22 — reads.**

**23 — partly.** The reading: "Lin takes the call, 💼😊, and I'm packing a box. Funny and clear." Intent: Lin is sitting at *your* desk with your red mug. She got your job. The player got the loss but missed the punchline. The red mug is a small object at the end of the desk, and nothing else marks the desk as yours, so it looks like Lin at her own desk. **Fix:** put your red chair under her, and show her setting her teal nameplate down beside your red mug. Show your nameplate face-down in the box.

**24 — reads.** The player understands the catch. Their question "why can green man do it?" comes from the misreads in 09 and 11, not from this card.

**25 — reads.**

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"77e0b57","hash":"7bf260521acaf4163e4a82362ce1520a0ed8e99a8e9799eb15b0453ade69ca15","parts":{"card":"5e41f6d2261204654b3a278642c15d58675e67004861fe07915663d083ee880a","checks":"b63484221b6db97b0582eb51e62d499f62c88d2d326e2157e7a377e0ce2c9d63","ways":"3654674b880fc20ddb2d98930e15f5461f1672337fa1cb5ccc1bb40c8fd11b3e","frames":"fc69153ab666781e6dedd0b6420405d4da924b30f7026dff03baded75bb75db8","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit 77e0b57, by claude -p (model: default). Inputs 7bf260521aca: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 148 s | $0.75 |
| 1-read-2 | reading.md | 129 s | $0.62 |
| 1-read-3 | reading.md | 109 s | $0.50 |
| 2-compare | report.md | 98 s | $0.35 |
| all | | 246 s (the steps add up to 483 s) | $2.22 |

### 1-read-1: reading.md

# Reading: The Interview

**Who's who, by appearance:** Lin (teal top, glasses, hair bun; she matches the card icon). A bald man in a suit, in the office with the rug. A curly-haired man in olive green. You, in red, at the middle desk. On the top wall is a panel of buttons, each under a picture: briefcase, Lin, bald man, curly man, mug. Each desk and the kitchen wall have a phone.

**Happens in every run, so it's routine and not a reaction to you:** Lin starts at her desk with a clock bubble. By 3:12 she's sitting in the kitchen, and the curly man is standing at her desk with a 👌 bubble. Lin leaves the kitchen at about 3:22. Her desk phone rings at 3:30.

---

## Run 1: LOSS

- 3:01 – Lin at her desk with a clock bubble. You at your desk.
- 3:12 – Lin in the kitchen. The curly man is at her desk with 👌.
- 3:27 – Lin back at her desk with a clock bubble.
- 3:30 – Lin's phone rings and she shows "!". She answers: 💼😊, then 😊👍.
- 3:34 – You show 😅.
- End picture: Lin on the phone with 💼😊. You are packing a box. Icons: Lin 💼 😊 📦.

**Why it lost:** Lin took her 3:30 call and it went well.
**Your cause:** None. You never acted.
**Might not be a reaction:** Your 😅 at 3:34 is probably just the game's lead-in to the ending.

---

## Run 2: WIN

- 3:19 – You press the button under the curly man. His desk phone rings. He shows "!" in the kitchen.
- 3:20 – You press the mug button. The kitchen wall phone rings. Lin, in the kitchen, shows "!".
- 3:21 – You do something at your own desk; I can't tell what. Lin answers the kitchen phone and gets ♫. The curly man goes to his desk.
- 3:22 – The curly man is on his phone with ♫.
- 3:27 – The curly man hangs up with a hands-up bubble.
- 3:30 – Lin's desk phone rings with nobody there. The bald man shows "!".
- 3:31–3:33 – The bald man goes to Lin's desk and answers: 💼 Lin ?. Lin walks back with 😠.
- 3:34 – You show 🎉 and earn the hands-up icon.
- End picture: The bald man on Lin's phone. Lin stuck on the kitchen phone with ♫. Icons: Lin ♫ bald man 💼 ?.

**Why it won:** Lin was stuck on hold in the kitchen when her interview call came.
**Your cause:** The mug button. The curly-man button probably mattered too: it pulled him to his desk, so the kitchen phone was left for Lin. Run 3 supports this.
**Unclear:** What the 3:21 action at your desk did. ♫ only appears after it, in all three runs where you acted.

---

## Run 3: LOSS

- 3:19 – You press the mug button. The kitchen phone rings, and the curly man shows "!" right next to it.
- 3:20 – You do something at your desk; I can't tell what. The curly man walks to the kitchen phone.
- 3:21 – The curly man answers and gets ♫. Lin stays seated in the kitchen.
- 3:22–3:25 – Lin leaves on her usual schedule. The curly man hangs up with a hands-up bubble.
- 3:27 – Lin is at her desk with a clock bubble.
- 3:30–3:34 – Same as Run 1: Lin answers and is happy. You show 😅.
- End picture: Same as Run 1.

**Why it lost:** Lin was at her desk at 3:30 and took the call.
**Your cause:** You rang the kitchen phone without first sending the curly man away, so he got to it before Lin did.
**Might not be a reaction:** Lin leaving the kitchen at 3:22 is her routine.

---

## Run 4: WIN

- 3:21 – You press the button under Lin's picture. Her empty desk phone rings. The bald man shows "!".
- 3:22 – You do something at your desk; I can't tell what. The bald man heads to Lin's desk, and Lin leaves the kitchen.
- 3:25 – The bald man answers Lin's phone and gets ♫, then 😌. Lin arrives and stands next to him.
- 3:30–3:33 – The bald man is still holding with ♫. Lin shows 🧑‍🦲😠 at him. There's no visible ring at 3:30.
- 3:34 – You show 🎉 and earn the ♫ icon.
- End picture: The bald man on hold at Lin's desk. Lin with 💼 🕒 😠. Icons: bald man ♫ Lin 😠.

**Why it won:** The bald man kept Lin's line busy through 3:30, so her interview couldn't get through.
**Your cause:** Ringing Lin's own phone while she was away.
**Might not be a reaction:** Lin walking back at 3:22 is her routine. She'd have reached her desk anyway; the bald man just got there first.

### 1-read-2: reading.md

I've read all three runs. Run 6 is a win: Lin's phone is unplugged and the 3:30 call never arrives. Runs 5 and 7 are losses: she takes the call.

# reading.md

## Run 5: loss

- 3:01 Lin, at the far-left desk, has a clock thought bubble. I'm in the middle of the room.
- 3:02 I use the wall panel with five portraits on it. A teal light comes on under the woman with glasses (Lin), her phone rings and she shows ❗.
- 3:03 Lin is on the phone with a 🎶 bubble.
- 3:03 I use my own desk. Lin shows 😠, which looks like she's hanging up on a call with nobody on the line.
- 3:12 Lin is at the kitchen table. A man in a green jacket is at her desk with a 👌 thought.
- 3:27 Lin is back at her desk.
- 3:30 A red light comes on the panel, her phone rings and she shows ❗.
- 3:30–3:31 She shows 💼😊, then 😊👍.
- 3:34 I show 😅.
- **End:** Lin takes the call and is happy. I'm drawn sitting in a moving box, so I lost my job.
- **Cause:** None of my actions stopped the call. The prank ring at 3:02 only annoyed her.
- **Might not be about me:** The 😠 at 3:03 could be about the dead call, not about me using my desk. Her walk to the kitchen looks like her normal routine.

## Run 6: win

- 3:01 I'm at my desk.
- 3:12 Lin is in the kitchen. The green-jacket man is at her desk with 👌.
- 3:13 I use the panel at the bald man's portrait. A blue light comes on and the boss's phone rings (❗).
- 3:14–3:21 The boss stands up and turns away to take the call: 🎶, then 🎶😌.
- 3:17 I use the wall socket by Lin's desk. Her phone cord is now lying unplugged on the floor.
- 3:18 I use my own desk.
- 3:30 No ring and no panel light. Lin thinks 🕒❓.
- 3:34 I show 🎉, and a plug icon fills one of the empty icon slots at the top.
- **End:** The interview call never reaches Lin.
- **Cause:** Unplugging the socket at 3:17. The boss call may have been cover, since he faced away the whole time. Nothing shows whether I would have been caught without it.
- **Might not be about me:** The green-jacket man walked right past me at 3:15 without reacting.

## Run 7: loss

- 3:03 I ring the boss from the panel. He shows ❗, then 🎶.
- 3:04 A sound plays and Lin's handset cord shows the same teal line as when she was on the phone in run 5. I can't tell what it means.
- 3:05 My marker overlaps Lin at her desk. She doesn't react.
- 3:06 Lin gets up.
- 3:07 Lin walks off toward the kitchen. I unplug the socket.
- 3:09 I use my own desk.
- 3:11 The green-jacket man reaches Lin's desk and shows ❗ at the loose cord.
- 3:12 He shows 👍. By 3:27 the cord is plugged back in.
- 3:30 The call rings through. Lin shows 💼😊, then 😊👍.
- **End:** Same picture as run 5.
- **Cause:** I unplugged it before the green-jacket man's regular stop at Lin's desk (about 3:11–3:12), and he plugged it back in. In run 6 I unplugged it after he had gone. Timing is the whole difference between these two runs.
- **Might not be about me:** Lin doesn't react while I'm practically on top of her. That could mean she didn't notice me, or that being close doesn't count as being seen.

### 1-read-3: reading.md

# Reading: The Interview

**Mission card:** "3:00 PM. Lin wants your job. Her phone interview is at 3:30. She must miss it." Lin looks like the woman in teal with a black bun and glasses.

## Run 8

- **3:01** Lin is at her desk on the far left, with a round dial-like icon in a thought bubble. The man in green is at the kitchen coffee machine.
- **3:12** Lin is at the kitchen table. The man in green stands at Lin's desk with a 👌 bubble.
- **3:19** You press a button on the wall board, which has five portraits: bag, Lin, bald man, bearded man, mug. The green phone on the far-right desk rings, and the man in green shows a "!".
- **3:20** You press the mug button. The kitchen wall phone rings, and Lin shows a "!".
- **3:22–3:24** Lin is on the wall phone and the man in green is on his desk phone. Both show ♪ bubbles.
- **3:25** You press the button under Lin's portrait. The bald boss shows a "!".
- **3:26–3:27** The boss is on the phone with ♪😌. You do something at your own desk, and nothing visibly changes.
- **3:30–3:31** On the board, the bag and Lin buttons light up with a cable between them. Lin's empty desk phone rings and nobody answers.
- **3:33–3:34** Lin walks back. A 🎉 bubble appears between her and you. I can't tell whose it is.

**Ending:** This looks like a win. The frame is teal, the ringing phone is drawn with nobody answering, the icons are ♪♪♪🔔, and the bell goes into a slot. Nothing actually says "win", though.

**Cause:** Your 3:20 mug press. It kept Lin on the kitchen phone while her interview call rang at her empty desk.

**Might not be reactions:** The man in green walks back to his desk in run 9 too, without any call. Calling him and the boss doesn't seem to have mattered, yet the ending picture shows all three on hold. The 🎉 has no clear owner.

## Run 9

- **3:01–3:12** Same as in run 8.
- **3:27** You press the board button under Lin's portrait. The boss shows a "!" and then goes on hold with ♪😌.
- **3:27** You do something at your own desk, with no visible effect.
- **3:27–3:29** The man in green goes from the coffee machine back to his desk on his own.
- **3:30** Lin is at her own desk. Her phone rings, she shows a "!", answers, and then shows 💼😊 and 😊👍.
- **3:34** You show a 😅 bubble.

**Ending:** A loss. The frame is red, Lin is drawn on the phone, and you are drawn packing a box.

**Cause:** By 3:30 Lin had walked back to her desk and nothing was keeping her away, so she took the call. Your only board press tied up the boss, which did nothing to her.

**Might not be reactions:** Lin's walk back to her desk and the green man's walk look like their routines. A red mug that doesn't appear in the game shows up on Lin's desk in the ending picture. I can't explain it.

### 2-compare: report.md

Verdict: fixable

## Runs

- **Run 1 (do nothing → Lin takes her call, loss): `explained`.** The reader says "Lin took her 3:30 call and it went well" and "You never acted." That is right.
- **Run 2 (answered, win): `explained`.** The reader says "Lin was stuck on hold in the kitchen when her interview call came," that the mug button caused it, and that the curly-man button "pulled him to his desk, so the kitchen phone was left for Lin." They also saw the boss answer her phone. That is all correct.
- **Run 3 (answered teaching fail, loss): `explained`.** The reader says "You rang the kitchen phone without first sending the curly man away, so he got to it before Lin did." That is exactly the lesson.
- **Run 4 (busy, win): `explained`.** The reader says "The bald man kept Lin's line busy through 3:30" and the cause was "Ringing Lin's own phone while she was away." Correct.
- **Run 5 (busy teaching fail, loss): `explained`.** The reader says "The prank ring at 3:02 only annoyed her" and that she hung up "on a call with nobody on the line." They got the action and the result. They did not quite get the rule behind it (she hangs up *because she is sitting there*). See beat 2.
- **Run 6 (unplugged, win): `explained`.** The reader names "Unplugging the socket at 3:17." Under run 7 they also name the timing after Kev's round. They could not tell what the boss call was for ("may have been cover… Nothing shows whether I would have been caught without it"). See beat 4.
- **Run 7 (unplugged teaching fail, loss): `explained`.** The reader says "I unplugged it before the green-jacket man's regular stop… and he plugged it back in… Timing is the whole difference." This is the best reading in the set.
- **Run 8 (ringout, win): `partly`.**
  - **What the reader said:** "Cause: Your 3:20 mug press. It kept Lin on the kitchen phone while her interview call rang at her empty desk." They also wrote: "Calling him and the boss doesn't seem to have mattered, yet the ending picture shows all three on hold."
  - **What really happened:** The win is that *nobody* answered. The 3:25 press rang the **boss**, so he was on his own phone at 3:30 and couldn't come over and pick up Lin's line, which he did in run 2. The Kev press is what made Lin take the kitchen phone at all (run 3 shows this). So two of the three presses the reader dismissed were the cause.
  - **Visual cause:**
    1. The reader thinks they pressed "the button under Lin's portrait." In `run-08/09.png` the ✋ use-glyph sits right over Lin's face card, while the press is really on the boss jack next to it. This is an emoji standing in for a person.
    2. The fact that the boss is the one who answers Lin's phone was taught in another run, and nothing at 3:30 shows his absence. There is no cue for a missing reaction: nobody walks over, and the board shows nothing.
    3. Kev's hold ended at 3:26 and he walked back as he does every day. That makes his call look pointless, while the end card claims all three were on hold.
  - **Fix:** Draw the use-glyph *above the jack being pressed*, not over the neighbouring face card, and light that jack's lamp in the owner's colour. At 3:30, while Lin's phone rings, have the boss on his own phone show a "!" toward the ring, then a ♪ that holds him in place. That beat says "he heard it and couldn't come." Also make the end card match what happened: draw Kev at his far desk, out of earshot, not on hold.
- **Run 9 (ringout teaching fail, loss): `explained`.** The reader says "Lin had walked back to her desk and nothing was keeping her away… Your only board press tied up the boss, which did nothing to her." Correct, even though they again called the boss jack "the button under Lin's portrait."

## Beats that misled the reader

1. **The desk action reads as a mystery cause.**
   - **What the reader said:** In run 2: "What the 3:21 action at your desk did. ♫ only appears after it, in all three runs where you acted." Runs 3, 4, 8 and 9 all have "You do something at your desk; I can't tell what."
   - **What really happened:** This is just going back to your desk, which you must do to win (you have to be there at 3:34). The ♫ comes from the phone you rang a moment before.
   - **Visual cause:** A missing cue, plus cause and effect landing at the same moment. The ♫ appears one beat after the desk press every time, so the desk press looks like what made it.
   - **Fix:** When you sit, show a clear "working" pose: the keyboard bobs, 💻 appears over you, and your chair turns red. When you are away from it, the chair is empty and sits at an angle. A first-timer then learns "be seated" as its own fact, separate from the phones.

2. **Lin's 😠 in run 5 gets credited to the desk press, and the rule is lost.**
   - **What the reader said:** "The 😠 at 3:03 could be about the dead call, not about me using my desk."
   - **What really happened:** She hung up because she was sitting at her phone. The same ring while she is away pulls the boss over (run 4).
   - **Visual cause:** The desk press and the 😠 happen at the same moment (3:03), and her bubble doesn't say what she is angry at.
   - **Fix:** Have her bubble name the phone: handset → 😠, then a slammed-receiver pose. And don't let the desk press land in the same frame. Better still, show the boss starting to rise with a "!", then sitting back down when she answers. That tells the player "if she weren't here, he'd have come."

3. **The 🎉 in run 8 has no owner.**
   - **What the reader said:** "A 🎉 bubble appears between her and you. I can't tell whose it is." Also: "Nothing actually says 'win'."
   - **What really happened:** It is your 🎉, at your desk. Lin's sprite is walking just above it (`run-08/19.png`).
   - **Visual cause:** A bubble overlapping another person's sprite.
   - **Fix:** Pin the player's win/loss bubble on the side away from any nearby NPC. Give the player's own bubbles a red tail or rim so they are always yours.

4. **The boss watching the socket goes unseen, so the boss call reads as decoration.**
   - **What the reader said:** In run 6: "The boss call may have been cover… Nothing shows whether I would have been caught without it."
   - **What really happened:** The boss's sight reaches through the glass to the socket. Ringing him turns him to face the window, and that turn is what makes the unplug safe.
   - **Visual cause:** A missing cue. The blue sight circle around him reads as an aura, not as eyesight aimed at the socket. And the reader never sees what happens if you are caught.
   - **Fix:** Draw the boss's sight as a cone pointed at Lin's desk. Every time you step near the socket in his view, he shows 👀 at it. When he takes his own call, sweep the cone to the window. Then the cover is something the player sees happen.

5. **The power cord looks like a "call in progress" line.**
   - **What the reader said:** In run 7: "Lin's handset cord shows the same teal line as when she was on the phone in run 5. I can't tell what it means."
   - **What really happened:** That line is just the cord running from her phone to the wall socket. It is there all day, and route 3 depends on noticing it.
   - **Visual cause:** The same teal dotted line is used for the always-there cord and for an active call.
   - **Fix:** Draw the cord as a solid coiled cable at floor level that ends in a visible plug. Keep dotted lines only for calls.

6. **The joke in the loss end card is missed in runs 1, 3, 5, 7 and 9.**
   - **What the reader said:** "Lin on the phone with 💼😊. You are packing a box." In run 9: "A red mug that doesn't appear in the game shows up on Lin's desk in the ending picture. I can't explain it."
   - **What really happened:** Lin is in *your* chair at *your* desk with *your* red mug. She got your job.
   - **Visual cause:** A missing cue. In play, your red mug is a few pixels next to your keyboard, so the player never learns it as "mine."
   - **Fix:** Make the red mug big and readable on your desk in play, and have the player sip from it when they sit (☕). In the end card, add your red nameplate to the desk and show Lin's own teal desk empty in the background.

7. **Kev's routine walk gets taken for proof that ringing him is pointless.**
   - **What the reader said:** In run 8: "The man in green walks back to his desk in run 9 too, without any call."
   - **What really happened:** In run 9 he walks back at about 3:27 as part of his day. In run 8 your ring sent him back at 3:19, while Lin was free to take the kitchen phone. That is the whole point of ringing him.
   - **Visual cause:** The forced walk and the routine walk end in the same place and look the same.
   - **Fix:** When a phone ring summons someone, show a "!" and then a hurried run with the handset in their colour drawn over their head. The routine walk stays a slow amble with ☕. Two different gaits make the cause readable.

The bubbles above are all made of emoji, so the game keeps its one rule: the mission card is the only text.

<!-- /cold-read:replay -->
