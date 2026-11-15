# Cold reads: early-bus
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"2decb7fad42aa638e70ded0daa21493f3e3f2e2dc56cd23510a42285d835f40b","parts":{"card":"df9447296fa542448a9afb7fdfcaf51861a7d7528c08b72bd612fbc880fc6b6e","premise":"e8841bcead6572c7f2f8076a3c0db2fa28aa5dc08abdf40a7219401dc8be20f0","prompts":"c2886f589c84ff30cad9e05d737f4d22d2f634d9aba125f62e9ac2a88edc579e"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs 2decb7fad42a: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 13 s | $0.02 |
| 2-review | report.md | 149 s | $0.56 |
| all | | 162 s (the steps add up to 162 s) | $0.58 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM in an office. I want to catch a bus at 4:30. The boss leaves at 4:50, and there's a rule, or maybe just office culture, that nobody leaves before him.

**What I must do:** Get onto the 4:30 bus. I see two ways to read that:
1. Sneak out unseen before the boss leaves.
2. Get the boss to leave before 4:30, so I leave "after him."

**If I fail:** Either I miss the bus, or I get caught leaving early. I can't tell which counts as the loss, or whether it's both.

**Questions:**
- Who enforces "nobody leaves"? The boss, coworkers who'd tell on me, or a door or sign-out sheet?
- Is it a rule or just a habit? What happens to someone who breaks it?
- If I get caught but still make the bus, is that a win?
- How far away is the bus stop? Does it take time to get there?
- Is 4:30 the last bus? Is there a later one?
- Name: "Early Bus" suggests a later bus exists. Why not just take that one?
- Does 🚌 mean the goal, or the win?
- Does the clock run in real time?

### 2-review: report.md

Verdict: fixable

**1. Nobody enforces the rule, and the loss at the bus stop contradicts what the player sees.** The first reader's obvious plan is to sneak out. The game blocks it with nothing visible. The boss sits in a top-left office with walls between him and the stop. Yet the `end-fail-at-the-stop` card shows him in a window right behind you. In the herd route, Lin and Kev walk out before him in plain view and nothing happens. He also never notices that *your* desk is empty, though he puts a ❓ on Lin's after five minutes.
- **When it hits:** the first loop where you walk to the stop at 4:30 and lose for no reason you can see.
- **Fix:** make the rule happen on screen. If the boss is still in, walking out the lobby door gets you tattled on, and he marches down and sends you back. Add your desk to the desks he checks.

**2. A tattle doesn't undo the clock push.** You can push his clock +30 during lunch, right in front of Lin. She tattles when he comes back, you type for 20 minutes, and you still win at 4:20. The boss is literally told "finger, clock" and still trusts the clock. The 3:20 restroom window, the heart of the timing puzzle, becomes optional.
- **When it hits:** the first loop where Lin points at you and nothing bad follows.
- **Fix:** a clock tattle makes the boss reset and straighten that clock.

**3. The herd route can't be deduced.** The loop ends at 4:30, so on a normal day nobody ever leaves. premise.md says you see them leave after any push, but that's false. With +10 they wave at 4:40. With +20 they wave at 4:30, exactly as the loop ends. The player first sees "he follows them out" only after pushing +30 on a guess. The ❓ at 3:25 only shows that he notices an empty desk.
- **When it hits:** route 2 is found by trial and error.
- **Fix:** move Kev's coffee break so it overlaps Lin's restroom break and both desks are empty for a moment, around 3:36–3:38. The boss starts (❗) and begins packing up, then sits back down sheepishly when they return.

**4. Lin leaves for no good reason, and the clock she reads makes no sense.** She sits facing the glass and sees the boss at his desk, then walks out anyway, breaking the card's only rule in front of him. The code says his clock is "too far" to read. But it is 9 tiles straight ahead of her, and the open-plan clock is about 15 tiles away to the side.
- **When it hits:** the player assumes Lin reads the clock she faces, and the 4:10 walkout looks like a bug.
- **Fixes:**
  - At "4:50", Lin and Kev stand up with their coats on and stare at him (🧥👀). He looks at his untouched clock, then at them, starts (❗) and leaves. This version is funnier and keeps the rule.
  - Move Lin's desk so the open-plan clock is the nearer one.

**5. Two moments contradict the rest of the game.**
- **The whistle:** you whistle 🎵 one tile behind the boss's head, and he doesn't turn, in a series where noise turns heads.
- **The blamed card:** it shows the boss waving from your bus, but he left by the elevator. Also, why does a ground-floor lobby that opens onto the street have an elevator people leave by?
- **Fixes:**
  - Cut the whistle.
  - Redraw the blamed card as an empty stop with the bus pulling away.

**Stakes, card and name:**
- **Stakes:** a missed bus is mild. The first reader asks why you can't just take a later one, and nothing answers that. Make it the last bus.
- **Card and name:** the card, the name and 🚌 name the trouble, not the way out. Good.
- **The obvious version:** the clock route is the obvious joke.
- **The real joke:** the herd route.

**Best thing:** the boss turns to Lin's empty desk (❓), then Kev's (❓), starts (❗), and flees his own rule while his own clock, which nobody touched, still says 4:17. Keep that.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"93264e5963617222e34b84f5d0c8d3322b702cf97fc06172367564aef11dded2","parts":{"card":"df9447296fa542448a9afb7fdfcaf51861a7d7528c08b72bd612fbc880fc6b6e","shots":"0cbe89780870c725f6064eff9a5bd49f4a04f04289da35f60e13bc61500516f6","pictures":"e75c05c80a6308624a352fbbe1c1c2c045823ce774c281ddab822eafc3162b13","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs 93264e596361: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 81 s | $0.45 |
| 2-compare | report.md | 119 s | $0.57 |
| all | | 200 s (the steps add up to 199 s) | $1.02 |

### 1-read: reading.md

# Early Bus: cold read

**01 (3:00).** The player, in a red sweater with a red ring under her, sits at the middle desk. A teal-shirted coworker sits on the left and a spiky-haired coworker in green on the right. The boss's office in the top-left is empty. Wall clocks sit above two stepladders, one in his office and one over Green's desk. The bus stop is bottom-centre, with a dashed bay on the road. *Can't read:* the dashed hand slot and the two empty slots in the top bar.

**02 (3:01).** The player is holding a paper and a red ripple spreads from her. The "pretend" key is lit, so I take it she's faking work. Green has a cloud thought with a clock in it. *Meaning:* I read the cloud as a thought and the round bubble as speech, but I'm guessing.

**03 (3:01).** The player is on Green's stepladder at the clock, with a clock speech bubble. Green is half-turned in his chair. Messing with clocks looks like the scheme.

**04 (3:05).** She's still at the clock and her bubble now has a small music note. Green is at the coffee machine. So his coffee run is the window to work unseen. *Can't read:* the note. Humming? A ticking sound?

**05 (3:09).** Green is back, and a big red "!" bursts above the clock. The player is at her desk under a chair bubble. Green seems to have noticed the changed clock. *Can't read:* the chair bubble keeps coming back and I never worked it out. "Seated"? "I never left"?

**06 (3:12).** Teal has a clock thought and her sight cone is visible. Everyone is checking the time.

**07 (3:19).** The boss has arrived and has a clock thought too. Green has twitch lines, which could mean restless or startled.

**08 (3:23).** Teal wanders the floor and the boss's orange cone covers his doorway. Quiet routine.

**09 (3:26).** Nothing happens. Teal's chair is empty and she isn't in view. The bathroom, maybe?

**10 (3:03, another loop).** The player is on the boss's ladder before he arrives. Teal has a "!" with a little yellow shape inside, maybe a pointing hand. She saw.

**11–12 (3:23–3:27).** The player is still on the ladder with the boss sitting right under her, and he doesn't react. Behind his head counts as hidden, apparently. That's funny, but it strains belief.

**13 (3:30).** The boss gets a "!" at his clock while the player sits at her desk. He spotted the change, though she isn't at the scene.

**14 (4:18).** The player is already at the bus stop. A sparkle sits on the boss's clock.

**15 (4:28).** The HUD clock turns red. The boss's office is empty, so he left early, and the bus pulls in.

**16 (win).** The boss waves goodbye under a clock that reads late. The player cheers on the bus under confetti. The first slot fills with a clock. *Clear:* setting his clock forward made him leave early.

**17 (4:10, another loop).** Teal and Green both have wave bubbles. The player sits under the chair bubble.

**18–19 (4:17–4:19).** The coworkers are gone and the boss walks out across the floor, cone forward.

**20 (win).** The boss, Green and Teal all leave, and Green waves. The icons go: coworkers, wave, boss, "?", "!", bus. The second slot gets a wave. *Meaning:* everyone else leaving makes the boss leave too. I can't see what the player did to start the coworkers leaving.

**21 (loss, 3:31).** The boss points angrily at the player on his ladder. Caught. Very clear.

**22 (loss).** The bus drives off with the **boss on it, waving**, while the player runs after it, flustered. *Confusing:* does he ride her bus? Did her own scheme work and she just dawdled? It's the best joke here, but I can't tell what I did wrong.

**23 (loss).** The boss sits at his desk with papers and the player watches the bus go through the window. She waited like a good employee and lost.

**24 (loss).** The player is at the stop as the bus leaves, and the boss is visible at his desk through the window. **It has the same icon row as 23**, so I can't tell what separates the two. Did she get there late, or did she leave and get noticed?

## The story
You can't leave before the boss, and the boss leaves at 4:50.
You can sneak to the wall clocks during coffee runs and set them forward. Fix his clock and he leaves early, but get caught on the ladder and he'll be pointing at you.
Or get your coworkers to leave first, and he follows the crowd.
The idea it teaches: people trust the clock and the crowd more than the real time.
My weak spots as a reader: the chair bubble, how the wave scheme starts, and how 23 differs from 24.

### 2-compare: report.md

Verdict: fixable

# Early Bus: cold-read check

The player still pieced together both routes: set the clocks forward, or get everyone else to leave. But several shots the routes depend on were misread or missing a cue. **08, 09 and 18** show the timing windows and the follow-the-crowd trigger, and those cues aren't on screen. **24** can't be told apart from 23. The level can be followed, but the player is guessing at the parts that matter.

Problems that show up in several shots:
- **Shots labelled "close-up" are wide shots.** 03 and 11 are the same full-map view as every other shot, so at map scale nobody can see the clock hanging crooked (04, 12) or how far it was pushed.
- **"!" sits on the clock, not the person** (05, 13). That reads as "he noticed the tampering" when it should read as "he believes it's later." The joke flips into a near-miss.
- **The player's chair bubble** (05, 13, 17–19) was never understood. It's noise in every shot it appears in.
- **The player's bubble is cut off by the top edge** when she's on the boss's ladder (10–12).

## Shots

**01 — reads.** Desks, empty boss office, both clocks and ladders, bus stop. The empty HUD slots are cosmetic.

**02 — partly.**
- Reading: "Green has a cloud thought with a clock in it."
- Intent: Kev checks the open-plan clock, *then gets up for coffee*. People here go by the wall clock.
- Cause: missing cue. The thought is there, but nothing says "coffee next," so the clock-then-coffee routine isn't taught. The player's red ripple and paper also pull the eye away.
- Fix: follow the clock thought with a ☕ bubble while Kev stands up, both in the same shot.

**03 — partly.**
- Reading: "Green is half-turned in his chair."
- Intent: an up-close view of a real clock with a climbable ladder, while Kev has just walked off for coffee.
- Cause: it isn't a close-up, and Kev in mid-step reads as sitting. Nothing tells you he's leaving, so the reader only worked out the coffee window from the next shot.
- Fix: give Kev a ☕ bubble and a clear walking pose pointed at the kitchen door.

**04 — partly.**
- Reading: "Can't read: the note. Humming? A ticking sound?"
- Intent: the clock hangs crooked, reads 40 minutes ahead of the HUD, and you whistle.
- Cause: missing cue. At map scale the clock is about 20 px, so the tilt and the jump in time can't be seen. A single ♪ is too vague for whistling.
- Fix: draw the pushed clock clearly tilted, with a faint trail showing the minute hand's sweep. Show the whistle as two or three notes coming from puckered lips.

**05 — partly.**
- Reading: "Green seems to have noticed the changed clock."
- Intent: Kev starts because he believes it's 40 minutes later.
- Cause: the cause and the effect are in the wrong place. The "!" bursts out of the clock, so it looks like an alarm or a tampering alert, not Kev being fooled.
- Fix: move the "!" onto Kev's head in a jolted pose, with a small clock showing the later time inside it.

**06 — partly.**
- Reading: "Teal has a clock thought… Everyone is checking the time."
- Intent: Lin faces the glass of the boss's office (his ladder is in her view) but turns to the open-plan clock to check the time.
- Cause: missing cue. The shot only shows her looking at the open clock. The important fact, that she normally watches the boss's ladder, isn't shown, so 10 comes as a surprise and not a lesson.
- Fix: in her resting pose, draw her sight cone clearly over the boss's ladder through the glass. When she checks the time, show the cone swinging away.

**07 — reads.** The boss is back and checks his clock. Green's twitch lines confused the reader; they aren't in the intent and are cosmetic.

**08 — misread.**
- Reading: "Teal wanders the floor… Quiet routine."
- Intent: at 3:20 Lin goes to the restroom, so nobody is facing the boss's clock.
- Cause: missing cue. She has no bubble and no destination, and the restroom sign is a small glyph far away in the corner. This is the safe window for the boss-clock route, and it reads as background.
- Fix: put a 🚻 bubble over Lin as she gets up, and make her sight cone disappear the moment she leaves.

**09 — misread.**
- Reading: "Nothing happens. Teal's chair is empty."
- Intent: the boss turns to Lin's empty desk and wonders where she is (her face, ?).
- Cause: missing cue. The boss's bubble isn't in the shot at all. Without it the setup for the crowd route ("he notices who isn't here") is lost.
- Fix: show the bubble (Lin's face + ?), with the boss's cone pointed at her empty chair.

**10 — reads.** "She saw." The yellow pointing hand inside the "!" works. The player's own bubble is cut off at the top of the screen.

**11 — reads.** The reader saw the ladder right behind the boss's chair. Comedy note: "strains belief" is a real risk. Make it a deliberate gag: the boss buried in papers, or wearing headphones, while she works above his head.

**12 — partly.**
- Reading: "he doesn't react. Behind his head counts as hidden."
- Intent: the clock hangs crooked and reads half an hour later than the HUD, while the boss works on.
- Cause: missing cue. The size of the change isn't visible (same scale problem as 04).
- Fix: the same tilted clock with a minute-hand sweep, plus a small ghost "+30" style dial next to it, drawn as a picture rather than text.

**13 — partly.**
- Reading: "He spotted the change, though she isn't at the scene."
- Intent: the boss believes it's half an hour later.
- Cause: the cause and the effect are in the wrong place again, because the "!" is on the clock. The reader took it as the boss discovering the tampering.
- Fix: put the "!" on the boss with a late-time clock inside it, then a 🏠 thought.

**14 — partly.**
- Reading: "A sparkle sits on the boss's clock."
- Intent: the boss waves goodbye and gets up to go home half an hour early.
- Cause: missing cue. The boss is still seated with no wave, so he only seems to leave between 14 and 15.
- Fix: show a 👋 bubble and a standing pose with his bag, under the crooked clock.

**15 — reads.**

**16 — reads.** "Setting his clock forward made him leave early." Clean.

**17 — partly.**
- Reading: "Teal and Green both have wave bubbles."
- Intent: at 4:10 by the HUD (4:50 on the pushed clock) they go home.
- Cause: the cause is too far from the effect. Nothing ties the waves to the pushed open-plan clock, which is why the reader asks in 20 what started it.
- Fix: one beat before the waves, give both of them a clock-thought showing 4:50 (or a 🏠), aimed at the open-plan clock.

**18 — misread.**
- Reading: "The coworkers are gone and the boss walks out."
- Intent: the boss turns to Kev's empty desk and wonders where he is.
- Cause: missing cue. The boss sits still with no bubble. The key step of the crowd route ("he notices they're gone") isn't drawn.
- Fix: show the boss's cone on Kev's empty chair, with a bubble of Kev's face + ?.

**19 — partly.**
- Reading: "the boss walks out across the floor."
- Intent: he decides it's home time, waves, and follows them out.
- Cause: missing cue. There's no wave and no sign of a decision.
- Fix: a 👋 bubble, or a 🏠 thought, as he stands up.

**20 — partly.**
- Reading: "I can't see what the player did to start the coworkers leaving."
- Intent: the crowd win, triggered by pushing the open-plan clock.
- Cause: missing cue. The icon row starts with the coworkers and leaves out the clock, even though the drawn picture includes it.
- Fix: start the row with the clock: 🕓 → Lin, Kev → 👋 → boss ? ! → 🚌.

**21 — reads.** "Caught. Very clear."

**22 — partly.**
- Reading: "does he ride her bus? Did her own scheme work and she just dawdled?"
- Intent: the boss did go home early, but you weren't at the stop.
- Cause: missing cue. The guess is right but unsure, because nothing shows *why* she was late. This is the best joke in the set, and right now it lands as confusion.
- Fix: keep the boss waving from the bus. Add her bursting out of the lobby door, and put a late clock (the HUD time) next to her face in the icon row.

**23 — reads.** "She waited like a good employee and lost."

**24 — misread.**
- Reading: "It has the same icon row as 23, so I can't tell what separates the two."
- Intent: you went to the stop, but the boss is still at his desk in the window, so you can't get on.
- Cause: missing cue. The icon rows are identical, and nothing shows that the boss being in view is what blocks her.
- Fix: a different row, e.g. her → 🚏 → boss in the window 👀 → 🚫 → 🚌💨. In the picture, have the boss's eyes on her and put a 🚫 on the bus door.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"c36a533","hash":"fa6695a8ab6267c58bbd113c356e2e7180e84d07fb39614ff1c084cead706866","parts":{"card":"df9447296fa542448a9afb7fdfcaf51861a7d7528c08b72bd612fbc880fc6b6e","checks":"f0710f3789c237c132901ec89e8fe46c3a114af360d5efb05b20fc987a28c358","ways":"949edaca124b3ca31f7d636646f94c76bc736fd52bcf611aa154878a1cf22192","frames":"5fad25a2cc5b03805675ba257ab1da4b072dc34f1daea03d466e74533ea6f56f","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit c36a533, by claude -p (model: default). Inputs fa6695a8ab62: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 129 s | $0.59 |
| 1-read-2 | reading.md | 187 s | $0.86 |
| 1-read-3 | reading.md | 149 s | $0.73 |
| 2-compare | report.md | 104 s | $0.36 |
| all | | 291 s (the steps add up to 569 s) | $2.54 |

### 1-read-1: reading.md

# Reading: Early Bus

## Run 1: loss at 4:31

- 3:01: I'm at the middle desk in red. A coworker in olive on the right has a clock bubble. The boss's chair is empty and I can't see him anywhere.
- 3:12: The woman in teal on the left has a clock bubble.
- 3:19–3:20: The boss is at his chair, under a wall clock with a stepladder below it, with a clock bubble.
- 3:25: The teal woman's seat is empty. The boss has a bubble with a person and a "?".
- 3:30: The teal woman is at the restroom door.
- 3:38: The olive coworker is at the coffee machine.
- 3:43–3:55: The boss walks down to the lobby, stands near the front door, and is back by 3:59.
- 4:25: The clock turns red.
- 4:30: The bus pulls up. I have a sweaty grin.
- 4:31: End picture: the boss at his desk, me at the window, the bus leaving. Icons: boss, clock, me, 😩, 🚌, 💨.

**Why it ended:** the bus left while the boss was still in.

**What caused it:** I did nothing all loop. Staying put was the cause.

**Might not be about me:** the boss's person-"?" bubble came up just as the teal woman left her seat, so it's probably about her. All the clock bubbles show up on a fixed schedule.

## Run 2: loss at 4:31

This run is the same as Run 1 frame for frame. The only differences are that the "pretend" key is lit the whole time and fast-forward is on. My character fidgets at the desk, like typing or shuffling papers.

**Why it ended:** the same missed bus, with the same end picture.

**What caused it:** again, I never left. Pretending changed nothing anyone reacted to, and no bubble or turned head pointed at me.

**Might not be about me:** everything here matches Run 1, so none of it was a reaction to me.

## Run 3: loss at 3:31

- 3:01–3:20: Same as before, with me at my desk.
- 3:25: I'm walking left, toward the boss's office. The boss shows his person-"?" bubble.
- 3:30: I used the thing while standing on the stepladder at the boss's wall clock, right behind his chair. The "do" key is lit.
- 3:30: The boss shows a "?", then his sight cone turns red toward me.
- 3:30: The boss shows a "!" burst.
- 3:31: End picture: me on the ladder with my hand on the clock, and the boss pointing at me, angry. Icons: boss, 👉, me, clock, 😠.

**Why it ended:** the boss caught me touching his clock.

**What caused it:** I climbed his ladder and used the clock while he was sitting about a step away. From the pictures I can't tell whether the hands actually moved.

**Might not be about me:** the 3:25 "?" happens in every run, so it isn't about me walking over. The boss is away from 3:43 to 3:58, and that may be the window to do this. A second clock with a ladder hangs on the open-office wall, and nobody touched it.

### 1-read-2: reading.md

# Early Bus: cold read of runs 4–6

## Run 4: LOSS

- 3:01 I'm standing in the open office. A man in a green jacket has a clock bubble.
- 3:03–3:04 I'm on the ladder under the boss's wall clock. The teal coworker shows "?", then "!" and points at me. No "used" mark here.
- 3:06 Used something at the middle desk and sat down.
- 3:16 Teal points at me again with a clock icon. A bald man in a suit comes in from the lobby with a "papers → computer" bubble. A paper stack lands on my desk and a red paper meter appears.
- 3:19–3:38 I work at the desk and the meter drains to empty. The bald man sits under his clock checking it. Teal leaves toward the exit sign and comes back.
- 3:43–3:59 The bald man walks to the lobby and comes back.
- 4:30 The bus arrives while I'm still at my desk with a grimace bubble.

**Why it ended:** I wasn't at the bus stop at 4:30. The end picture shows the bus pulling away.

**Cause:** I sat at the desk all loop. The paper pile is the likely reason I was stuck there, but I can't tell if leaving was blocked or just not tried.

**Unclear:** The bald man walks in at about the same time in run 6, so his arrival is probably scheduled. Only the papers seem tied to teal's report. His lobby trip at 3:43 happens only in this run, and I can't say why.

## Run 5: WIN

- 3:01–3:19 I'm at the desk. The bald man arrives by 3:19.
- 3:24–3:26 Used the thing three times on the boss's clock, with a ♪ bubble, while the bald man sits right under the ladder.
- 3:30 I walk out to the lobby. The bald man shows "!".
- 3:35–4:25 I wait at the bus stop.
- 4:18 The bald man shows a waving bubble and he's gone by 4:25.
- 4:30 I board the bus with a party bubble. A clock icon fills the first empty slot in the top bar.

**Why it ended:** He left before the bus came, which seems to be the point of the mission card.

**Cause:** Changing his clock.

**Might not be a reaction:** His "!" at 3:30. He did nothing after it.

**Editor note:** I sat at the bus stop in plain view for an hour before he left and nothing happened. "Nobody leaves before him" doesn't seem to be checked until 4:30.

## Run 6: WIN

- 3:02 Used the clock above the green-jacket man's desk while he was in the kitchen, with a ♪ bubble.
- 3:09 Green Jacket comes back and shows "!".
- 3:12 Teal shows "?" at me on the boss's ladder.
- 3:13–3:14 Used the boss's clock three times. Teal walks off toward the exit sign.
- 3:18 The bald man arrives. He shows a bubble with teal's face and "?", because teal's seat is empty.
- 3:19–3:20 I leave for the bus stop. The bald man shows "!".
- He's still there at 4:20 and gone at 4:30. The bus comes and the end picture is identical to run 5.

**Cause:** Changing the boss's clock.

**Unclear:** The 3:02 clock change seems to do nothing; the ending is the same without it. Green Jacket's "!" could be about his own clock or about me. Teal's walk happens in every run.

### 1-read-3: reading.md

# Early Bus: cold read

## Run 7: WIN
- 3:01: Teal woman and green-shirt man are at their desks. Green-shirt man has a clock thought bubble. The boss's office is empty.
- 3:02–3:05: I use the wall clock above green-shirt man's desk four times, humming (🎵). Green-shirt man walks to the kitchen coffee machine. Afterwards a stepladder stands under that clock.
- 3:09: I walk out through the lobby door. Green-shirt man, back at his desk, shows a big ❗.
- 3:12: I'm at the bus stop and stay there for the rest of the loop.
- 3:15–3:19: The bald boss comes out of the elevator and goes to his office.
- 3:45: The boss walks through the lobby, close to me. No reaction from either of us.
- 4:10: Both coworkers wave 👋. By 4:14 they're walking out.
- 4:14: The boss shows a coworker face with ❓.
- 4:17: The boss waves 👋 and leaves.
- 4:30: The bus arrives. 🎉

**Why it ended:** I was at the stop when the bus came, and nobody was left in the office.

**Cause:** Probably the four uses of the clock, which seem to make everyone leave about half an hour early. The pictures don't make that certain (see run 9).

**Might not be about me:** The coffee walk, the 3:09 ❗ and the clock bubbles all happen the same way in every run. The 3:09 ❗ came while I was gone, so he may have reacted to the clock, or it may be his normal routine.

## Run 8: LOSS
- 3:02–3:05: I use the wall clock four times, the same as run 7.
- 3:06: I use my own desk (middle top) and sit there holding a paper.
- 3:09: Green-shirt man shows ❗.
- 3:12: Teal woman shows ❗.
- 3:15: The boss comes out of the elevator.
- 3:30–4:11: Clock thought bubbles from all three. The boss walks through the lobby at 3:45.
- 4:14: The coworkers leave. The boss shows a face with ❓.
- 4:16: The boss heads out.
- 4:30: I'm still at my desk with a worried bubble 😰, and the bus is at the stop.

**Ending picture:** The boss waves from the bus while I run after it. 💨

**Why it ended:** I wasn't at the stop. The boss caught my bus.

**Cause:** I sat at my desk and never got up, even after the boss left at 4:16. I can't tell if that was a choice or if something kept me there.

**Might not be about me:** Teal woman's ❗ at 3:12 happened while I sat in plain view. It also happens in run 9 while I'm outside, so it's probably not about me.

## Run 9: LOSS
- 3:02–3:04: I use the wall clock only three times.
- 3:09: I'm in the lobby. Green-shirt man shows ❗.
- 3:11–3:12: Green-shirt man walks away with a clock bubble, then teal woman shows ❗.
- 3:19: The boss is already in his office. There's no elevator scene this time.
- 3:55: The boss walks through the lobby.
- 4:10: Nobody waves. This is later than in run 7.
- 4:20: The coworkers wave 👋. By 4:25 they're leaving, and the clock turns red.
- 4:26: The boss shows a face with ❓. The bus pulls in while I'm still at the stop.
- 4:30: I'm back at my desk with a nervous grin 😬. The boss is walking out through the office. The bus is at the stop without me.

**Ending picture:** The bus leaves without me. The boss looks out the window at a clock.

**Why it ended:** I wasn't on the bus.

**Cause:** I can't tell. The pictures don't show why I left the stop between 4:26 and 4:30. Because I used the clock one fewer time, everyone left about ten minutes later. That's the only difference from run 7 I can see, and it may be why the boss was still around at 4:30.

**Might not be about me:** The 4:26 ❓ came right after the coworkers left, not when I moved.

### 2-compare: report.md

Verdict: fixable

## Runs

**Run 1 (do nothing → fail): explained.** The reader says the bus left while the boss was still in, and that they had stayed at their desk all loop. They also put the boss's person-"?" at 3:25 down to the teal woman's empty seat, which is correct.

**Run 2 (normal day, pretending → fail): explained.** The reader says it was the same missed bus and that "pretending changed nothing anyone reacted to." That's right.

**Run 3 (boss's clock pushed too near 3:30 → caught): partly.**
- Reading: *"I climbed his ladder and used the clock while he was sitting about a step away."* The next window they plan to try is *"The boss is away from 3:43 to 3:58."*
- What really happened: the boss turns round to his clock on a schedule, at 3:19, 3:30 and 3:38. The player was on the stepladder at 3:30, so he looked at the clock and found them there. Being close had nothing to do with it. Run 5 proves it: the player pushes the same clock at 3:24–3:26 while he sits *"right under the ladder"*, and nothing happens.
- Visual cause: a missing cue. His 3:19 turn shows a clock bubble, but nothing shows that he turns *away* again or that another turn is coming. The reader also says *"I can't tell whether the hands actually moved,"* so the crooked, pushed clock doesn't read at this zoom.
- Fix: draw his chair swiveling. Whenever he turns back to his desk, his vision cone should swing visibly away from the ladder. Before each scheduled turn (3:29, 3:37), give him a one-second "neck crick" wind-up so the player learns there's a rhythm to his turns.

**Run 4 (Lin sees the push → tells → work → fail): partly.**
- Reading: *"I wasn't at the bus stop at 4:30 … The paper pile is the likely reason I was stuck there, but I can't tell if leaving was blocked or just not tried."* They also write: *"Only the papers seem tied to teal's report."*
- What really happened: Lin caught the player before any push landed. That's why there's no "used" mark. So the boss's clock was never moved, and he was always going to be in at 4:30. The papers were the punishment for being told on, but the boss staying in is what lost the run. The reader also doesn't recognise the "bald man in a suit" as the boss.
- Visual cause: cause and effect are far apart. Lin points at 3:04, but the papers don't land until 3:16, when the boss arrives. The papers also hide the real cause. The end card does show the boss at his desk, but the reader reads only "bus gone."
- Fix: let Lin's report come out as a picture. At 3:16, show a bubble from her to the boss containing *ladder + player face + clock*. Then make the papers fly from his hand to the player's desk. On the end card, put a small "clock unchanged" icon (clock with a ✕) in the icon row.

**Run 5 (boss's clock +30 while Lin's away → win): explained.** The reader names the cause (*"Changing his clock"*) and the outcome (*"He left before the bus came"*). See beats A and B.

**Run 6 (open-plan +10 sends Lin off early, boss's clock +30 → win): partly.**
- Reading: *"The 3:02 clock change seems to do nothing; the ending is the same without it."* They also write: *"Teal's walk happens in every run."*
- What really happened: the +10 is what made Lin read 3:22 at 3:12 and leave for the restroom eight minutes early. Without that, she'd have been at her desk watching the boss's ladder at 3:13 and would have told on the player, as in run 4. The reader got the boss's-clock half of the win and dismissed the half that made it possible.
- Visual cause: a missing cue, plus a bubble that reads as a reaction. The 3:12 frame shows Lin's "?" with a dotted line to the player on the ladder. The reader took it as suspicion (*"Teal shows '?' at me"*). Her glance at the open-plan clock, which is what actually got her up, isn't shown at all.
- Fix: at 3:12, have Lin turn to the open-plan clock and show a clock bubble with the *pushed* time and a 🚻 / "hurry" sweat drop. Then she leaves. Keep the suspicion "?" for when her cone actually lands on the player, and use a different shape for it (an eye bubble, say).

**Run 7 (open-plan +40 → Lin and Kev leave → boss follows the herd → win): partly.**
- Reading: *"Probably the four uses of the clock, which seem to make everyone leave about half an hour early."*
- What really happened: the open-plan clock only moves Lin and Kev. The boss leaves because both desks are empty: 4:14 ❓ at Lin's desk, 4:16 at Kev's, 4:17 ❗ and out. The reader wrote down the 4:14 face-❓ and didn't connect it to his leaving. Their model says the boss reads the open-plan clock, which is wrong, and it will mislead them later.
- Visual cause: an emoji standing in for a person. A small face-❓ doesn't read as "where is everyone?" Nothing visible links it to his decision to leave.
- Fix: after he looks at the second empty desk, show a single bubble with *two empty chairs → 👋 → ❗*. Then have him grab his coat at speed. Give the herd route its own end-card icon (empty chairs) so it isn't confused with the clock route.

**Run 8 (herd, but player at desk → blamed): explained.** The reader says *"I wasn't at the stop. The boss caught my bus,"* and that they sat at their desk. They are also right that Lin's 3:12 ❗ wasn't about them.

**Run 9 (open-plan only +30 → they leave 4:21, boss too late → fail): unexplained.**
- Reading: *"Cause: I can't tell. The pictures don't show why I left the stop between 4:26 and 4:30."* There's a hedged secondary guess: *"Because I used the clock one fewer time, everyone left about ten minutes later … it may be why the boss was still around."*
- What really happened: the player stayed at the stop. With only +30, Lin and Kev left at 4:21, and the boss checked the empty desks at 4:26 and was still walking out at 4:30. You can't board while he's in. That's the "at the stop" loss.
- Visual cause: a missing cue, made worse by frames that contradict each other. I checked the frames:
  - 18.png (4:26) shows the player at the stop.
  - 19.png (4:30) shows the player back at their desk with 😬 and the boss walking through the open office.
  - The end card (20.png) puts the player at the stop and the boss *at his desk* in the window.
  
  So the 4:30 frame moves the player back to their desk (probably a reset) with no explanation. The card also shows the boss somewhere he wasn't. Nothing shows "you can't board while he's inside." The reader's right guess was buried under the confusion.
- Fix: at 4:30, leave the player at the stop. When the bus doors open, the player looks over their shoulder at the office window and sees the boss in it (🙅 / 🚫🚌). Then the bus goes. On the end card, draw the boss *walking out*, coat half on, rather than at his desk. That shows "too late by a few minutes," which is the lesson of this run.

## Beats that misled the reader

**A. Run 5, 3:30: the boss's ❗ written off as not a reaction.**
- Reading: *"Might not be a reaction: His '!' at 3:30. He did nothing after it."*
- What really happened: this is the payoff. He turns round, sees 4:00 on his clock and starts. He just doesn't act on it until 4:18.
- Visual cause: cause and effect are far apart, about 48 minutes.
- Fix: make the ❗ a bubble with a clock showing the pushed time and a sweat drop. After it, add a visible change in his routine, such as packing a briefcase or putting his coat on the chair back, so the rest of the loop shows that the start had an effect.

**B. Run 5, editor note: "nobody leaves before him" looks unenforced.**
- Reading: *"I sat at the bus stop in plain view for an hour before he left and nothing happened."*
- What really happened: the rule is enforced only at boarding (see run 9). Waiting at the stop is allowed.
- Visual cause: a missing cue. The constraint never appears until it costs you the run, and even then it's hidden (run 9).
- Fix: while the boss is still inside, have the boarding spot by the stop show a faint boss-face "🚫" ghost that disappears when he leaves. The player then learns the rule in every winning run.

**C. Run 6, 3:12: Lin's "?" read as suspicion of the player, and her early walk read as routine.** Covered under run 6. Because the bubble looks like a reaction to the player, the reader missed the real reaction, which was to the clock.

**D. Runs 6, 7, 8: Kev's ❗ on returning from coffee read as routine or ambiguous.**
- Reading (run 7): *"The coffee walk, the 3:09 ❗ and the clock bubbles all happen the same way in every run."* Run 6 says *"could be about his own clock or about me."*
- What really happened: Kev starts *only* when his clock has been pushed. He shows no ❗ in runs 1–5. It's the confirmation that the push worked.
- Visual cause: a bubble that reads as a reaction to the player, made worse because the ❗ carries no content.
- Fix: put the pushed clock face inside Kev's ❗ bubble (🕓❗) and have him look up at the wall clock, not toward the player.

**E. Run 4: the boss's 3:43 lobby trip called "only in this run."**
- Reading: *"His lobby trip at 3:43 happens only in this run, and I can't say why."*
- What really happened: it's part of his daily routine. It also happens in run 1, and in run 7 at 3:45. In run 3, the reader took this trip as the safe window for the clock.
- Visual cause: a missing cue. The trip has no purpose the player can see, so it looks like a response to something.
- Fix: give the trip a visible purpose, such as a mail bubble ✉️ on the way out and returning with a parcel. Then it reads as a scheduled errand.

**F. Run 9 end card: the boss shown at his desk when he was walking out.** Covered under run 9. The end card contradicts the final frame, so the reader couldn't use it to work out the cause.

<!-- /cold-read:replay -->
