# Cold reads: early-bus
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"1909728","hash":"741bfac5738b7c056180a5400599ef50a732255fa6a00884d755a73b9f9addf3","parts":{"card":"f5a03af78aedb7ba2b47726215e19a90462bcd10e7841831e65ce15545209405","premise":"7e6d1c5c124d08e9e73f1fed64a1e8a8934e6336a64b91385d07740171602c6c","prompts":"e810e9318a4aa5a21d9654564c23dd898975d90252af2744b888b19de97df7bd"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit 1909728, by claude -p (model: default). Inputs 741bfac5738b: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 13 s | $0.03 |
| 2-review | report.md | 122 s | $0.50 |
| all | | 135 s (the steps add up to 135 s) | $0.54 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM in an office. I need the last bus, which leaves at 4:30. The boss leaves at 4:50, twenty minutes after it. Office culture, or the boss, won't let anyone leave before he does.

**Goal, reading A:** Sneak out unseen and catch the 4:30.
**Goal, reading B:** Get the boss to leave before 4:30.

**Failure:** I miss the bus and I'm stranded. Or I'm caught leaving and punished somehow. Or both.

**Questions:**
- Is "Nobody leaves before him" a rule, a threat, or just how things usually go? "Nobody does" and "nobody may" ask different things of me.
- What happens to someone who leaves early? The card doesn't hint.
- Am I the one taking the bus? It's implied, never said.
- Why is the level called "Early Bus"? The 4:30 is the *last* bus. Is it "early" only next to the boss? Or is there an earlier bus I don't know about?
- How far away is the bus stop? Will the bus wait for me?
- Is the 🚌 icon my goal, or just the theme?
- Does "leave" mean leaving the building, or just my desk?

### 2-review: report.md

Verdict: fixable

**1. The name gives away the method.** I checked first-read.md against the design. The other reader stumbled on the name right away: "the 4:30 is the *last* bus, so why 'early'?" Their reading B, "get the boss to leave before 4:30", is the actual design. And "Early" points at the tool: make someone early. The card itself is clean. It names the trouble and the 🚌 badge is fine. The title is the leak. It also hides a question the card never answers: what happens if you leave? (Answer: the boss catches you in the street and fires you.) **Fix:** call it "Last Bus".

**2. Ladders under both clocks with no reason.** At 3:00 the player sees a stepladder under each wall clock. Nobody in the office uses them, so they only exist because the puzzle needs them. A first-time player will read them as "interact here", not as part of the office. **Fix:** at 3:00 show a caretaker on a ladder swapping a clock battery (🔋), who leaves both ladders behind when he goes.

**3. The rule only binds you on screen.** Lin and Kev check the coat at their 4:50. On a normal day the loop ends at 4:30, before that ever happens. So the player never sees a coworker obey "nobody leaves before him". Worse: at 3:25 the boss looks at Lin's empty desk, thinks ❓, and nothing happens. Your empty chair starts a manhunt. **Fix:** add an early beat on screen. For example, at 3:05 Kev picks up his bag, looks at the coat, 😬, and puts the bag back. Also make the boss go and check the restroom door when Lin vanishes.

**4. The boss ignores his own clock.** The player has watched him turn to his clock at 3:22 and 3:30, so they know he lives by it. In route 2 he sees 4:58 on the hallway clock, then walks back into his office. His own straight clock there says 3:58, and he takes his coat without a glance. On the way to his coffee at 3:40 he also walks right under the hallway clock without looking up. **Fix:** move the coat rack to the hallway, under the open-plan clock. He never goes back past his own clock, and Lin and Kev stare at a coat right above Kev's desk.

**5. Route 1 lets you off too easily.** In premise.md's route 1 you are still standing at his clock, "on the phone", when he turns round at 3:30. He starts at a clock that just jumped half an hour, sees you standing right under it, and lets it go. That isn't funny and it doesn't make sense. **Fix:** if he sees you inside his office right after his clock jumps, he gets suspicious (😠) and sets the clock right. That forces you to get back to your desk in time, which makes a better beat.

What holds up: both routes are in the code and the numbers work. In route 1, +30 has him at his coat at 4:20 and out before the bus. In route 2, +60 puts the hallway clock at 4:58 when he passes under it at 3:58, while +50 shows 4:48 and gets a shrug. Every step I checked is shown on screen through the clock-face bubbles, the visible sight cones and the crooked clock. One risk I couldn't confirm from the code: in route 2, Lin sits five tiles from the hallway ladder. Her regular head turns may catch you up there, and premise.md doesn't account for that.

**Best thing:** At 3:50, Lin and Kev stand up, stare at a coat in an empty office, grimace and sit back down. Then the boss strolls back from the kitchen, looks at the clock, startles and bolts.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"1909728","hash":"076182f3f126a281b5dbd2011304c68099e475a491006f664b60cc30e981f750","parts":{"card":"f5a03af78aedb7ba2b47726215e19a90462bcd10e7841831e65ce15545209405","shots":"3473a8b967c92d30561f2446383142cd46337e1f229594efb13ae038b384c671","pictures":"ae5601faac3e0179f1b7f1fe84844f109c1dd5bbfa46c37cbce011331f83f8af","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit 1909728, by claude -p (model: default). Inputs 076182f3f126: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 103 s | $0.58 |
| 2-compare | report.md | 95 s | $0.43 |
| all | | 198 s (the steps add up to 198 s) | $1.01 |

### 1-read: reading.md

# Early Bus: cold read

**01 (3:00)** Me (red sweater, hair bun) at a desk. Teal woman and spiky-haired guy in green also at desks. Corner office empty, navy jacket on a stand. Two wall clocks, each with a stepladder under it. The ladders give away the plan before anything happens.

**02** Green guy thinks of a clock. Red rings pulse around me. *Unclear:* the rings could mean I made a noise, or just mark "you".

**03 (3:05)** Green guy is at the kitchen coffee machine and his chair is empty. So he takes coffee breaks.

**04 (3:02)** I'm at the office-room ladder with an E prompt on the clock. Green guy is walking past with something yellow. *Unclear:* what he's carrying.

**05 (3:07)** I'm up the ladder. Green guy is coming back from the kitchen with a cup.

**06 (3:11)** Green guy is back at his desk with a spiky bubble: clock + red "!". He noticed the clock changed. Changing it while he's out isn't enough.

**07 (3:12)** Teal woman thinks of a clock. Her sight cone covers it. Two people watch this clock.

**08 (3:22)** Bald boss in suspenders is now at his desk, thinking a plain white circle. Teal woman walks east. *Unclear:* that circle. A clock with no hands? A plate?

**09** Green guy has shake lines. Teal woman is still walking. *Unclear:* the shake lines. Typing? Annoyed?

**10** "Pretend" is lit and papers fly off me, so I'm faking work. A fast-forward icon shows up.

**11 (3:25)** Boss thinks teal woman's face + "?". He notices empty desks. A faded bubble sits by green guy. *Unclear:* what the faded bubble is.

**12 (3:31)** Boss's cone turns red and pours through the glass walls. He thinks my face + "?". I'm already at the bus stop. Leaving early gets noticed.

**13 (3:04)** I'm on the boss's ladder. Teal woman bursts out "!" + a pointing hand + something. She's a snitch. *Unclear:* the last glyph.

**14 (3:27)** Still on the ladder, and the boss sits down right under me. Good comic tension.

**15** Boss with shake lines, me still up there.

**16 (3:30)** Boss bursts out clock + "!" and his cone goes red.

**17 (3:47)** Boss gets coffee in the kitchen. So he also leaves his desk.

**18 (3:59)** Boss with a mug, under the office-room clock, thinking clock + a small yellow thing. *Unclear:* that second glyph.

**19 (4:21)** Boss at the coat stand, putting on his jacket, waving. He's leaving at 4:21, so the clock trick worked.

**20 (4:28)** The HUD clock goes red. The bus pulls in and I'm at the stop. The coat stand is empty.

**21 WIN** The boss waves under a clock showing about 4:55. I'm cheering in the bus with confetti. Icons: clock, boss, wave, bus, me. A clock token fills the first slot. Clear and funny.

**22 (3:50)** Boss in the kitchen. Teal and green both think boss-face + 😬. *Unclear:* are they dreading him, or relieved he's gone?

**23 (3:59)** Boss at the office-room clock: clock + "!".

**24 (4:02)** Boss puts his coat on and waves. That's even earlier.

**25 (4:09)** Everyone leaves: teal, green and the boss crossing the street. I'm still at my desk pretending.

**26 WIN** Teal, green and the boss file out past the clock "!". I'm on the bus. A coffee cup token fills the second slot. *Unclear:* why coffee? Nothing in the picture shows coffee causing anything.

**27 LOSS (3:31)** Boss points angrily at me up the ladder. Icons: me 😳 boss 😠. Clear.

**28 LOSS (3:16)** I'm at the stop and the boss comes out of the front door pointing. So he comes in that way and walks right past the stop.

**29 LOSS (4:30)** The bus pulls away and I chase it. Clear.

**30 LOSS** Boss still at his desk, jacket on the stand, me at the window watching the bus go 😩. The funniest card.

**31 LOSS** Same as 28 plus the bus leaving. Too close to 28 to tell apart at a glance.

## The story

Nobody leaves before the boss, and the boss leaves at 4:50, twenty minutes after my last bus. The ladders invite you to push the clocks forward. But coworkers and the boss all watch the clocks, and they notice if you change one in front of them, or if they look at it again after you've changed it. So you sneak it during coffee breaks and bathroom trips, then fake work until the boss reads the wrong time, grabs his coat and sets everyone free. The idea it teaches is roughly "people trust the clock on the wall."

### 2-compare: report.md

I've read both files and checked the disputed screenshots. Here's the report.

Verdict: fixable

The reader understood the overall scheme: push the clocks, fake work, the boss leaves early, the bus wins. But several shots taught them wrong rules. The worst is 06: the reader now believes a coworker seeing a changed clock is bad, when that is exactly what the scheme needs. The boss's clock thought in 08 doesn't read as a clock. And the "left before the boss" loss reads as "the boss arrives through the front door." One more problem cuts across the whole level: at map scale, a pushed clock doesn't look crooked (05, 06, 15, 23, 26). The one visual that shows "I changed this" can't be seen.

- **01** — reads. Everything is visible. The reader didn't mention the kitchen or the stop, but the later shots show they found both.
- **02** — partly (cosmetic). Reading: "the rings could mean I made a noise, or just mark 'you'." Intent: Kev reads the wall clock. The thought bubble works. The cause is a cue that clashes: my "you are here" marker uses red pulsing rings, the same look a noise ring would have in a level built on "noises turn heads." Fix: give the player marker its own steady, non-pulsing style, and save pulsing rings for noises only.
- **03** — reads.
- **04** — partly. Reading: "Green guy is walking past with something yellow. *Unclear:* what he's carrying." Intent: Kev has just left his desk under the clock and is heading to the kitchen. The cause is a tiny, unreadable prop. The empty cup should be the cue that he's off for coffee, but it's a yellow speck. Fix: draw a big white mug in his hand, the same mug as the one on his desk in 06.
- **05** — misread. Reading: "I'm up the ladder. Green guy is coming back from the kitchen with a cup." Intent: after six pushes the clock hangs crooked and reads an hour ahead of the HUD. The cue is missing. The wall clock in the map is about 25px wide and doesn't look tilted or different. The only change shows in the E-prompt icon. Fix: tilt the clock about 15° and add a small swing animation after each push. Even better, draw the extra hour as a red arc on the clock face so the gap from the HUD clock shows at a glance.
- **06** — misread. Reading: "He noticed the clock changed. Changing it while he's out isn't enough." Intent: Kev believes it's an hour later. The trick worked. The cause is a cue that reads as alarm. The spiky white burst with a red "!" is the same "you've been caught" language as 13 and 16. So a success looks like getting caught, and the reader's summary turned it into a rule that blocks the solution ("they notice… if they look at it again after you've changed it"). Fix: use a separate "time flies" belief bubble, a round thought bubble with the clock face, a fast-forward mark and a startled 😮 instead of a red "!". Keep spiky red for "I've spotted you."
- **07** — reads.
- **08** — misread. Reading: "thinking a plain white circle… A clock with no hands? A plate?" Intent: the boss turns round to read his clock. The icon isn't readable as a clock. At this size the clock glyph in the thought bubble loses its hands. It also doesn't match the drawn clock right above him, so the cause (clock) and the thought aren't linked. Fix: reuse the clock sprite from the wall (red rim, black hands) at twice the size in every clock thought. Turn the boss's sprite to face the wall for a beat before the bubble appears.
- **09** — misread. Reading: "Green guy has shake lines… *Unclear:* the shake lines. Typing? Annoyed?" Intent: right after his clock, the boss looks through the glass at your desk while you type. The cue is missing. The boss's cone swinging toward me is faint and gets lost behind the glass. Meanwhile Kev's unexplained shake lines grab the eye. Fix: give the boss a "glance at you" beat: a brighter cone that ends on my desk, plus a small eye or my face in his thought bubble. Drop Kev's shake lines here, or use the same lines on me when I type so the meaning ("busy typing") is learned from my own character.
- **10** — partly. Reading: "'Pretend' is lit and papers fly off me… Teal woman is still walking." Intent: Lin goes to the restroom, so nobody faces the boss's clock. The cause is effect too far from cause. The restroom door is a small sign in the far corner, and Lin is only halfway there. Fix: put a 🚻 thought bubble over Lin as she leaves her desk, or make the restroom door bigger and have it swing as she goes in.
- **11** — partly. Reading: "*Unclear:* what the faded bubble is." Intent: the boss wonders where Lin is. The reader got that part. The faded bubble by Kev is a leftover thought fading out, and it shows as a ghostly scribble. Fix: shrink and fade old bubbles quickly instead of leaving a grey outline.
- **12** — reads.
- **13** — partly. Reading: "'!' + a pointing hand + something… *Unclear:* the last glyph." Intent: Lin points at you and shouts. The cause is an unreadable glyph. The target of the point (my face) is too small inside a small burst. Fix: make the burst bigger and put my face icon in it at the same size as the faces in the boss's "?" bubbles. Also turn Lin's arm toward the ladder.
- **14** — reads.
- **15** — partly. Reading: "Boss with shake lines, me still up there." Intent: the boss's clock hangs crooked, half an hour ahead, and the boss works on with his back to it. The cue is missing, the same crooked-clock problem as 05. The clock is hidden under my sprite and the E highlight. Fix: tilt the clock and draw it on top of the player while it's being pushed, or show the clock face as a large inset beside the ladder.
- **16** — partly. Reading: "Boss bursts out clock + '!' and his cone goes red." Intent: he believes it's half an hour later, and you've stepped off the ladder behind him. The cause is a cue that reads as alarm, as in 06. A red cone means "hunting" in 12 and "caught" in 27, so the reader can't tell this success from being caught. Also, I'm still drawn on the ladder, not "just off" it. Fix: keep the cone its normal colour on belief beats and use the belief bubble from 06. Show me on the floor beside the ladder.
- **17** — reads.
- **18** — partly. Reading: "clock + a small yellow thing. *Unclear:* that second glyph." Intent: he reads the open-plan clock (not pushed this loop) and shrugs. The cause is a glyph standing in for a person's action. The 🤷 emoji at this size is a yellow blob. Fix: animate the boss sprite shrugging (shoulders up, palms out). Put only the clock in the bubble, with a calm "…" or ✓.
- **19** — reads.
- **20** — reads.
- **21** — reads.
- **22** — partly. Reading: "Teal and green both think boss-face + 😬. *Unclear:* dreading him, or relieved he's gone?" Intent: by the pushed clock it's home time, but the boss's coat is still on its stand, so they stay. The cause is effect too far from cause. The coat that holds them back is across the map, and their bubble doesn't mention it. Fix: put the coat in their thought: clock → boss's coat-on-stand → 😬. That draws the rule "nobody leaves while the coat is up."
- **23** — reads.
- **24** — reads.
- **25** — reads.
- **26** — partly. Reading: "A coffee cup token fills the second slot. *Unclear:* why coffee? Nothing in the picture shows coffee causing anything." Intent: the herd win, with the boss under the crooked open-plan clock. The cause is a missing cue in two places. The picture shows no coffee, so the token has nothing to refer to. And the clock in the picture is straight, not crooked. Fix: give the boss his mug in the win picture, tilt the clock, and add a ☕ to the icon row (boss ☕ → clock → !) so the token matches something shown.
- **27** — reads.
- **28** — misread. Reading: "the boss comes out of the front door pointing. So he comes in that way and walks right past the stop." Intent: you left before the boss. His coat is still on its stand (visible through the window), and he catches you outside. The cause is a missing cue in the icon row. The coat in the window is the key fact, but the icons (me 😳 boss 😠) never mention it, so the reader thinks it's about the boss's route. Fix: start the icon row with the coat on its stand → me outside → boss 😠, and highlight the coat in the window with a glow.
- **29** — partly. Reading: "The bus pulls away and I chase it. Clear." Intent: the boss *did* go home early, so the scheme worked, but you weren't at the stop. The cause is a missing cue. Nothing shows the boss has gone, so the reader can't learn "you were right, just slow." Fix: show the empty coat stand through the window and add an empty-stand icon at the start of the row.
- **30** — reads.
- **31** — partly. Reading: "Same as 28 plus the bus leaving. Too close to 28 to tell apart at a glance." Intent: you left while the boss was in, *and* you missed the bus. The cause is two pictures built almost the same way. Fix: make 28 clearly early (no bus, the window clock showing about 3:15, daylight) and make 31 late (bus pulling away, window clock at 4:30, warmer late light). Better still, merge them into one loss so the game isn't teaching two lessons that look the same.

Aside: the keyboard hints on the map ("do", "pretend", "restart", "mute", "vision", "pause") are text. That breaks the brief that the mission card is the only text in the game.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"1909728","hash":"5ab7f867e4f003f0f468dd67954ba71fc5f4a4e759701766d20433be65f7c7ce","parts":{"card":"f5a03af78aedb7ba2b47726215e19a90462bcd10e7841831e65ce15545209405","checks":"9f28480fb7b8141174d5d5d6dc1c8afaf572d5e51a827284a65973fc304f9945","ways":"45fa0ebd454306476fe27b96961125c3154b77190b70b1131080152c243f0269","frames":"4aa9b4ca832fc218a0686bc6e0ea4624c55d0514a653f9d1074ef3ff8599c164","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit 1909728, by claude -p (model: default). Inputs 5ab7f867e4f0: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 154 s | $0.70 |
| 1-read-2 | reading.md | 149 s | $0.70 |
| 1-read-3 | reading.md | 142 s | $0.70 |
| 1-read-4 | reading.md | 89 s | $0.42 |
| 2-compare | report.md | 87 s | $0.37 |
| all | | 241 s (the steps add up to 621 s) | $2.89 |

### 1-read-1: reading.md

# Reading: Early Bus

**About the evidence:** None of the four captions files contains a "You used the thing here" line. So I can't place any player action. I can only go by where the player (red top, red ring) is standing in each picture.

## Run 1

- 3:01: Player at their desk. Man in green has a clock bubble.
- 3:11–3:12: Coworkers have clock bubbles. Player still at desk.
- 3:20: Bald man in a tie walks in on the left side of the office.
- 3:22: He's at the big desk in the corner office. A woman in teal walks past the player.
- 3:25: Bald man's bubble shows a dark-haired person and "?". Teal woman is away near the restroom.
- 3:30–3:55: Man in green gets coffee. Bald man gets coffee in the kitchen. Clock bubbles all round.
- 3:59: Bald man stands under the office wall clock, which has a stepladder below it. His bubble shows a clock and a figure.
- 4:02–4:25: Everyone back in place. The timer turns red.
- 4:30: Bus pulls up. Player at desk with a grinning bubble.
- 4:31: **Loss.** Picture: bald man at his desk, coat on the rack, player at the window as the bus leaves. Icons: bald man, clock, player, weary face, bus, puff of air.

**Why:** The player stayed at their desk and missed the bus. Nobody left early.
**Cause:** The player didn't move. If they did something at the desk, I can't see what.
**Might not be reactions:** Every bubble here, including the "?" at 3:25 and the stop at the ladder at 3:59. The player never left the desk, so these are part of everyone's routine.

## Run 2

Identical to Run 1, frame for frame and time for time. **Loss**, same picture. I can't see any difference in what the player did. If something was used, it changed nothing visible.

## Run 3

- 3:01: Player has already left the desk and is walking left past the man in green.
- 3:11–3:12: Player waiting at the bus stop outside. Clock bubbles inside.
- 3:15: Bald man appears from the right at the bus stop with a "?".
- 3:15: He gets an angry "!" burst and a red sight line to the player.
- 3:16: **Loss.** Picture: bald man coming out of a glass door, pointing. Player blushing at the bus stop. Icons: player, flushed face, bald man, angry face.

**Why:** He saw the player at the bus stop.
**Cause:** Going to the bus stop at 3:11, an hour early.
**Might not be a reaction:** In Runs 1, 2 and 4 his office is empty at 3:01 and he walks in at 3:20. This looks like him arriving for the afternoon through the street door. He wasn't looking for the player; the player was simply in his path.

## Run 4

- 3:01–3:22: Same as Run 1. Player at desk.
- 3:25: Player walking down the left side. Bald man's bubble shows the same dark-haired "?" as in Run 1.
- 3:30: Player at the bus stop.
- 3:31: Bald man's "?" bubble now shows a person with a brown bun, which looks like the player. His sight cone widens over the office.
- 3:35: His office is empty and a red sight cone sweeps the office.
- 3:39: He's in the lobby with a "?", then an angry "!" at the player.
- 3:40: **Loss.** Same picture and icons as Run 3.

**Why:** He came looking and found the player at the stop.
**Cause:** Leaving the desk around 3:25. The 3:31 bubble suggests he noticed the empty desk.
**Might not be a reaction:** The 3:25 "?" happens in every run, even with the player sitting down. It probably means the teal woman, who is away at that point. Only the changed face at 3:31 points to the player, and that icon is small.

## Overall

No run was won. Three things are left unexplained: the ladders under both wall clocks, the bald man's stop at the clock at 3:59, and whatever the player used in Runs 1 and 2.

### 1-read-2: reading.md

# Early Bus: cold read

Mission card: the bus leaves at 4:30 and the boss leaves at 4:50. "Nobody leaves before him." The only icon on the card is 🚌.

---

## Run 5: loss at 3:31

- **3:01** The player (red top, ringed) sits at a middle desk. The glass corner office is empty and a coat hangs on the stand. The green-shirt coworker next to the player has a clock thought bubble.
- **3:12** The teal coworker at the far-left desk also has a clock bubble.
- **3:20** A bald man in a tie (the boss) walks in from the left.
- **3:22** The boss is at his desk with a clock bubble. The teal coworker walks past the player.
- **3:25** The player stands up by their desk and an "E" prompt shows. The boss's bubble is a face and "?".
- **3:30** The player is on the stepladder under the corner-office wall clock, a few steps from the boss. A "?" appears over the player and a spiky clock "!" appears by the boss, followed by an angry "!".
- **3:31** End picture: the boss angrily points at the player on the ladder.

**Why it's a loss:** the boss caught the player at his clock.
**Cause:** the player climbed the ladder and used the boss's clock while the boss was sitting right there.
**Might not be a reaction:**
- The boss's 3:25 face-"?" bubble shows up at 3:25 in all three runs, even with the player seated.
- The teal coworker's walk ends near the restroom sign in run 6 too.
- The green coworker's coffee trip happens in every run.

---

## Run 6: loss at 4:31

- **3:01–3:40** The player stays seated. The others follow the same routines as in run 5.
- **3:50–3:55** The boss goes to the kitchen.
- **3:59** The boss climbs the open-office clock ladder with a clock-and-wrench bubble.
- **4:02** The boss is back at his desk.
- **4:25** The HUD clock turns red. The player is walking left.
- **4:26** The player is near the bottom-left exit. A bus appears on the right. The boss shows the face-"?" bubble.
- **4:30** The player is back at their own desk with a sweaty-grin bubble. The boss stands in the open office and the bus is at the stop.
- **4:31** End picture: the bus pulls away while the boss points angrily at the player, who is standing at the stop.

**Why it's a loss:** I can't tell. The end picture shows the player caught at the bus stop. The last in-game picture shows them back at their desk with the bus still waiting. Either they missed the bus or they were caught leaving, and the two pictures disagree.
**Cause:** walking toward the exit and then turning back. There's no "used the thing" mark in this run.
**Might not be a reaction:** the boss leaving his office at 4:26. It uses the same face-"?" bubble he shows at 3:25 every run, so it could be routine. The 3:59 clock-fixing happened with no player action at all.

---

## Run 7: loss at 4:31

- **3:04** The player is already on the boss's clock ladder and the office is empty. The teal coworker sees them: there's a red sight line, then a "?", then "!" with a hand pointing at the player.
- **3:05–3:08** The teal coworker keeps switching between "?" and pointing "!". Nothing comes of it.
- **3:09** The player uses the boss's wall clock.
- **3:12** The player walks back past the green coworker.
- **3:20** The player is at their desk. A paper stack appears on it, along with a paper meter in the top-right corner. Neither appeared in the other runs and I can't tell why. The boss arrives as usual.
- **3:25** The boss shows the face-"?" bubble.
- **3:35** The meter is empty and the paper is gone.
- **3:55** The boss is in the kitchen.
- **4:02** The boss is back at his desk.
- **4:25** The HUD clock turns red. Everyone is still seated.
- **4:31** End picture: the boss at his desk under the clock while the player watches the bus leave through the window, with a weary face.

**Why it's a loss:** the player missed the bus.
**Cause:** the player stayed at their desk past 4:30. The clock tampering had no visible effect: the boss's day matches run 6 beat for beat. I can't tell whether the change worked or what it was supposed to do.
**Might not be a reaction:** the teal coworker's pointing "!" changed nothing. I can't link the paper stack to anything the player did.

### 1-read-3: reading.md

# Early Bus: reading

## Run 8: Win

- 3:01: You stand by your desk. The man in the green jacket has a clock bubble.
- 3:12: The woman in teal has a clock bubble.
- 3:20: A bald man in a white shirt and tie walks in from the left. Both coworkers have clock bubbles.
- 3:22: He sits at the desk in the corner office, with a clock bubble.
- 3:25: You walk toward his office. He shows a bubble of a person with a "?".
- 3:27, 3:28 and 3:30: You use the wall clock behind his chair three times. At 3:30 he shows a burst with a clock and a "!".
- 3:31: You leave his office. He shows the person-and-"?" bubble again.
- 3:36: You use your desk. I can't tell what that did.
- 3:40 to 4:10: Everyone sits. Clock bubbles come and go.
- 4:21: He puts on his coat and shows a waving hand.
- 4:25: He goes out the bottom-left door. You're still at your desk.
- 4:30: You're at the bus stop, with a party-popper bubble.

**Why it ended:** You caught the bus after the boss had left.

**What caused it:** Changing his clock, as far as I can see. He left at 4:21, but the card says 4:50. The end picture shows his clock and you on the bus, and you got a clock icon.

**Might not be a reaction to you:**
- The coworkers' clock bubbles were already up at 3:01, before you did anything.
- The "?" bubbles may be about you being in his office, not about the clock.
- The man in green going to the kitchen at 3:27 looks like part of his routine.

## Run 9: Win

- 3:03 to 3:07: You use the wall clock above the open office six times. The man in green goes to the kitchen meanwhile.
- 3:11: The man in green shows a clock-"!" burst. You go to your desk.
- 3:12: You use your desk, and the woman in teal shows a clock-"!" burst.
- 3:25: The bald man is already at his desk. I didn't see him arrive.
- 3:50: He's in the kitchen. Both coworkers show a bubble of a bald face and a grimace.
- 3:56: He walks back with a coffee cup.
- 3:59: He passes under the open-office clock and shows a clock-"!" burst.
- 4:01: He goes back to his office.
- 4:06: He leaves wearing his coat. Both coworkers wave and leave too.
- 4:30: You're at the bus stop, cheering.

**Why it ended:** You caught the bus after everyone was gone.

**What caused it:** You changed the open-office clock, and the boss saw it on his coffee walk. This time the reward was a coffee-cup icon.

**Might not be a reaction to you:** The grimace bubbles came up when the boss left his desk. They may be about him walking around, not about anything you did.

## Run 10: Loss

Up to 4:06 this run matches run 9 picture for picture. You changed the same clock the same number of times, and the boss, the man in green and the woman in teal all left at 4:06.

- 4:06: Everyone else leaves. You stay at your desk.
- 4:30: You're still at your desk, with a sweating-face bubble. The bus is at the stop.

**Why it ended:** The bus left without you. The end picture shows the bus driving off and a flustered face.

**What caused it:** You stayed at your desk. The office was empty for 24 minutes and you never walked to the stop.

**Mismatch:** The end picture shows you running at the stop, but the 4:30 picture shows you sitting at your desk.

### 1-read-4: reading.md

# Early Bus: cold read

## Run 11: loss at 4:31

- **3:01** I'm in the middle room under a wall clock on a stepladder. The guy in the green jacket has a clock thought bubble before I've done anything.
- **3:03–3:06** I use the wall clock five times. I can't see the hands move at this size. Green Jacket walks to the kitchen coffee machine.
- **3:12** I use something at the right end of the long desk and sit there. Green Jacket is back with a mug. The woman in teal gets a spiky clock-and-"!" burst.
- **3:20** The boss (bald, tie) comes in from the left. Both coworkers have clock thoughts.
- **3:30–3:40** The boss is at his desk with a clock thought.
- **4:00** The boss stands in the doorway. Both coworkers show bald-head + 😬.
- **4:02–4:22** The boss goes back to his desk. Everyone keeps having clock thoughts.
- **4:27** The HUD clock turns red and the bus pulls up. The coworkers show bald-head + 😬 again.
- **4:30** I'm still at the desk and show a 😬-ish bubble.
- **4:31 end:** the boss sits at his desk, the wall clock shows about 4:30, and I watch the bus through the window. Icons: boss, clock, me, 😩, bus, 💨.

**Why it lost:** The bus left while I was at my desk and the boss was still in. I missed it.

**What caused it:** Staying seated through 4:30. I can't see that the five clock uses did anything. No hands visibly moved and nobody left early.

**Might not be a reaction to me:** The teal woman's 3:12 burst also happens in Run 12 at the same minute. The 4:27 😬 bubbles line up with the bus arriving, not with anything I did.

## Run 12: loss at 3:16

- **3:01** Same start, and Green Jacket has the same clock thought.
- **3:03–3:07** I use the wall clock six times. Green Jacket does his coffee trip.
- **3:11** I'm in the grey lobby. A clock-"!" burst appears between the two coworkers, so I can't tell whose it is.
- **3:12** I'm outside by the bus stop. The teal woman has the clock-"!" burst.
- **3:15** The boss walks in from the right side of the street and shows "?". Then a red sight cone covers me and he shows "!" + 😠.
- **3:16 end:** the boss points at me at the bus stop, and I'm 😳. Icons: me, 😳, boss, 😠.

**Why it lost:** The boss saw me outside before he'd left, which breaks "Nobody leaves before him."

**What caused it:** Walking out to the stop at 3:12, more than an hour before the bus, and standing where the boss could see me.

**Might not be a reaction to me:** The boss being outside at 3:15 looks like his normal routine. In Run 11 he comes back in from the left at about 3:20 without me doing anything. The 3:11–3:12 bursts happen in both runs, so I can't tell whether they're about the clock I tampered with.

### 2-compare: report.md

I've read all three files and checked the run 6, 7, 11 and 12 pictures where the reader and the run log disagreed. Here's the report.

Verdict: fixable

## Runs

| Run | Real story (runs.md) | Mark |
|---|---|---|
| 1 | Do nothing → missed the bus | explained |
| 2 | Normal day; the boss turns to Lin's empty desk while she's in the restroom → missed the bus | explained |
| 3 | Waits at the stop from 3:00; the boss passes it on his way back from lunch → caught in the street | explained |
| 4 | Leaves after the boss is back; he sees the empty chair and comes looking → caught in the street | explained |
| 5 | Pushes the boss's clock too close to 3:30 → he turns round → caught on the stepladder | explained |
| 6 | Leaves at 4:24; he sees the empty chair and is still looking at 4:30 → fails at the stop | **unexplained** |
| 7 | Pushes the boss's clock while Lin watches; she tells on the player, who gets work, and he sets the clock right → missed the bus | **partly** |
| 8 | Win via the boss's clock (+30) | explained |
| 9 | Win via the open-plan clock (+60) | explained |
| 10 | Route 2, but stays at the desk → too late for the bus | explained |
| 11 | Open-plan clock only +50 → he shrugs → missed the bus | **partly** |
| 12 | Route 2, then straight to the stop → caught in the street | explained (see note) |

Both wins are explained, so the game isn't broken. One loss is unexplained, two are partly explained, and several beats misled the reader about causes. That makes it fixable.

**Note on run 12:** runs.md says "his look at your empty chair". But at 3:15 the boss walks in from the street with a "?" (run-12/10.png). He can't have seen the chair, because he was still at lunch. What really happened is run 3's ending: he passes the stop on his way back. The reader's reading, "Walking out to the stop at 3:12… standing where the boss could see me", fits the pictures. The run's label is wrong, not the reader.

## Partly and unexplained runs

### Run 6: unexplained
- **Reading:** "I can't tell. The end picture shows the player caught at the bus stop. The last in-game picture shows them back at their desk with the bus still waiting… the two pictures disagree."
- **What happened:** The player left at 4:24. At 4:26 the boss saw the empty chair (face-"?"), went looking, and brought the player back. At 4:30 the boss is in the open office next to Kev and the player is back at their desk (run-06/17.png). The end card then shows the player at the stop, with the bus leaving and the boss pointing from the lobby door (18.png).
- **Visual cause:** Missing cue, plus an end picture that contradicts the last frame. The boss bringing the player back happens off-camera, between 4:26 and 4:30. So the end card shows a moment the player never sees, and the last real frame says the opposite.
- **Fix:** Make the end card match the last frame. If being brought back is the rule, show the boss arriving at the stop at about 4:28 with "!" and a hand on the player's shoulder, then walking them in while the bus pulls in. Use that as the end picture (player at the desk, bus leaving through the window, boss standing over them). Otherwise, freeze on the player at the stop.

### Run 7: partly
- **Reading:** "The teal coworker keeps switching between '?' and pointing '!'. Nothing comes of it." Also: "A paper stack appears on it, along with a paper meter… I can't tell why." And: "The clock tampering had no visible effect."
- **What happened:** Lin saw the player on the stepladder and told on them. When the boss got back at 3:20, he gave the player 20 minutes of work (the paper stack and meter) and set his clock right. That cancelled the scheme.
- **Visual cause:** Cause and effect too far apart, and a missing cue. Lin points at 3:04, while the boss is out at lunch (run-07/03.png), so there is nobody to point to. The punishment appears 16 minutes later with no hand-over: in 14.png the boss is still walking in from the left, nowhere near the desk, and the paper is already there. The clock being set right is never shown.
- **Fix:** When the boss walks in at 3:20, have Lin stand and point, with a bubble showing the player's face plus the clock. The boss walks to the player's desk and drops the paper stack, and his bubble shows paper plus the player's face. On his way back he climbs the stepladder and straightens the crooked clock (clock + wrench, as he does at 3:59 in run 6). Now each step has someone visibly doing it.

### Run 11: partly
- **Reading:** "I can't see that the five clock uses did anything. No hands visibly moved and nobody left early."
- **What happened:** The push worked, but only +50. At 3:58 the boss read 4:48 under the open-plan clock and shrugged, so he stayed. The coworkers' bald-head + 😬 bubbles at 4:00 and 4:27 are them checking his coat and staying, which proves their clock was ahead.
- **Visual cause:** Missing cue. The shrug falls between the 3:40 and 4:00 frames. The pushed clock's hands can't be read at play size. The reader also took the coworkers' 😬 as a reaction to the bus.
- **Fix:** When anyone reads a clock, show the time it says in their bubble (for example, a clock face at 4:48). Make the shrug a clear bubble: clock + 🤷 + coat crossed out. A near miss then reads as "almost", not "nothing happened".

## Beats that misled the reader

1. **Run 6, 4:26: a real reaction read as routine.** Reading: "the boss leaving his office at 4:26. It uses the same face-'?' bubble he shows at 3:25 every run, so it could be routine." What happened: he saw the player's empty chair and went looking. Visual cause: a bubble that reads as routine, because the same face-"?" is used for "Where's Lin?" every day at 3:25, and the faces are tiny. Fix: give "where's my worker?" its own bubble, an empty chair + "?", tinted in the target's shirt colour (teal for Lin, red for the player).

2. **Runs 4 and 8: the 3:25 "?" is ambiguous.** Run 8 reading: "The '?' bubbles may be about you being in his office." Run 4 reading: "It probably means the teal woman." It is about Lin every time; the reader guessed right once and wrong once. Visual cause: an emoji standing in for a person, since the dark-haired face could be Lin or the player at that size. Fix: same as beat 1, the empty chair in Lin's teal. Also turn the boss's sight cone to her desk at that moment.

3. **Run 8, 3:31: a real reaction with its outcome missed.** The reader saw the second "?" but not what came of it. In fact the boss saw the empty chair, looked for the player, saw them on the phone and let it go. Visual cause: missing cue, because the phone cover isn't shown. Fix: when the boss's sight cone lands on the player, show a ☎️ bubble over the player and a ✔️ or nod over the boss.

4. **Run 9, 3:50, and run 11, 4:00 and 4:27: the coworkers' coat check read as something else.** Run 9 reading: "The grimace bubbles… may be about him walking around." Run 11 reading: "The 4:27 😬 bubbles line up with the bus arriving." What happened: their clock said 4:50 or later, they looked at his coat, saw it still hanging and stayed. Visual cause: an emoji standing in for an object, since the bubble shows his face, not his coat, and the coat stand is far from them. Fix: put the coat in the bubble (coat + 😬), and turn their sight cones to the coat stand for that beat.

5. **Runs 11 and 12, 3:11–3:12: real reactions dismissed as routine.** Reading: "The teal woman's 3:12 burst also happens in Run 12 at the same minute," so the reader marked it "might not be a reaction". What happened: Kev and Lin started at the pushed clock in both runs, because the player pushed it in both. Visual cause: two runs with the same push look like proof of routine. In run 12 the reader also couldn't tell whose burst it was ("between the two coworkers"). Fix: anchor the bubble firmly over the person's head. Draw a short sight line from the person to the clock as they start, so it's clear the burst is about that clock.

6. **Runs 1–2, run 5 and run 8: the stepladders and pushed clocks are unreadable.** Reading: "Three things are left unexplained: the ladders under both wall clocks…" and "I can't see the hands move at this size." Visual cause: missing cue, because the crooked-clock tell is too small. Fix: after a push, the clock hangs visibly crooked with a small "+" tick mark per push. Draw its hands thicker than other decor.

7. **Run 10, 4:30: a frame mismatch.** Reading: "The end picture shows you running at the stop, but the 4:30 picture shows you sitting at your desk." This didn't change the cause, but it's the same problem as run 6. Fix: show the player starting to run at 4:29, or draw the end card from the desk side.

<!-- /cold-read:replay -->
