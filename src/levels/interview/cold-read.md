# Cold reads: interview
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"a19db65+dirty","hash":"dea162406d0d93969bc675b5a64b9d1660d219bd03c7555f4edef86e7e07ca67","parts":{"card":"c27b93544267d1f41c424590839b4209ebfc25b9a430f7eaef4ce8cdddd8a18e","premise":"5928293c07ad8c6127b7a78fa0bb61699ea9ab673164e532c492c5c0f75d60ba","prompts":"e810e9318a4aa5a21d9654564c23dd898975d90252af2744b888b19de97df7bd"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit a19db65+dirty, by claude -p (model: default). Inputs dea162406d0d: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 14 s | $0.02 |
| 2-review | report.md | 114 s | $0.59 |
| all | | 128 s (the steps add up to 128 s) | $0.62 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM. Lin wants my job, and her phone interview is at 3:30. Reading A: Lin is a coworker going for my position, maybe a promotion, and the interview could get me replaced. Reading B: Lin is an outside candidate, but then why is she somewhere I can reach her?

**Goal:** Make sure she misses the 3:30 call, which gives me 30 minutes. Does she have to miss it completely, or is it enough if she's late, interrupted or the call goes badly?

**If I fail:** She takes the call. Does she get my job right away, or does the loop just reset? The card doesn't say.

**Questions:**
- Who is Lin, and where is she? I don't know her face, desk or phone.
- Whose phone does she use: hers, a desk phone or a meeting room?
- What does "#interview ❌" mean? Is the ❌ my goal (interview cancelled) or a failure mark? Is "#interview" a room, a channel or a tag?
- Can the call itself fail, or only her part in it?
- The name: whose interview is it? Hers? Mine? Or the game interviewing me?

### 2-review: report.md

I've read all the files and am writing the report now.

Verdict: fixable

**1. Kev's trip to the socket exists only for the puzzle.** At about 3:06 the player watches Kev leave the coffee machine and walk the whole length of the office, about 27 tiles or 6–7 game minutes, to Lin's socket. He charges his mobile there for about one minute (3:12–3:13), then walks all the way back for more coffee. He has his own desk. Nothing on screen explains why he needs her socket, and the trip only exists to put the plug back in. *Fix:* give the reason as a picture. Kev's desk socket has a visible "broken" sticker with a spark, and he arrives early and stays 5+ minutes, scrolling on his phone while it charges.

**2. Lin drops her one habit right when the dead-phone route needs her to.** Before her tea she lifts the receiver every 2.6 minutes. After she gets back her checks stop, because the code only runs them before 3:21 (`m < BACK_AT`). That cutoff falls in 3:26–3:30, when she should be most nervous. Her cable also lies on the floor next to her chair, and she never notices it. The player has just learned she checks, so she should find the dead line. *Fix:* show the change on screen. She comes back holding notes up to her face and mouthing her lines (📝), with her back to the socket. Or keep one last check at 3:26, so the unplug has to come after it.

**3. The boss shows he cares about the call, then shrugs it off.** From 3:30 he keeps glancing at your chair, so the player sees the call matters to him. In route 1 he answers the interviewer, goes 💼 @lin ❓, and shrugs, even though Lin is one room away. In route 4 he hears the ring (❗) and stays with his hold music. *Fix:* in route 1, let him glance at the kitchen door and give up because it's shut. In route 4, show him waving at the ring for it to wait.

**4. The busy-line timing in premise.md doesn't match the movement numbers.** The boss walks about 9 tiles to Lin's phone, picks up roughly 2.5 minutes after the ring, and stays on 9 minutes. Ring at 3:17 and he hangs up around 3:28–3:29, before the call. So the "3:17–3:24" window is really about 3:19–3:22, minus the moment Lin walks past at 3:23. Players will hit failures they can't read. *Fix:* make his hold 11 minutes, or retest the window and state it correctly.

**5. The card and first-read.** The name and card only describe the trouble, which is right. But first-read reads "#interview ❌" as either the goal or a failure mark. The ❌ looks like an instruction, as if cancelling the interview were the task. *Fix:* use a badge that names the threat, for example 💼 📞 @lin, and let the end cards carry the ❌. First-read's other question, "where is Lin?", is answered by the face cards on the switchboard and her phone checks at 3:00, so that part works.

**Also checked and fine:** the stakes (the fail card puts her in your chair with your mug), how far each ring carries, Lin hoping the red kitchen ring is her interviewer (💼❓), and the boss's back turned while he's on his own phone. Each route can be worked out from what's on screen, mostly through a matching teaching fail. Route 4 needs route 1 first to learn that the boss picks up Lin's phone. That's a fair build-up, not trial and error.

**Best thing:** Lin rushes back for the call that would get her your job and finds the boss in her spot, eyes half shut, swaying to hold music on her teal phone. At 3:30 the interviewer gets a busy line and she glares at her own boss.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"a19db65+dirty","hash":"a45173f57df1ffc07f49a5e1145121d9d1597ca67c1230f9b54670b7e3b0d4e6","parts":{"card":"c27b93544267d1f41c424590839b4209ebfc25b9a430f7eaef4ce8cdddd8a18e","shots":"fbd11832561fff2a7a8dba507ff18328670f0f61505bfba17320b4fe81ac425b","pictures":"d150f4cdf1f81ba1dd5e3e69a647fb8dfd9accca2dd6b6064acad35b6ccea534","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit a19db65+dirty, by claude -p (model: default). Inputs a45173f57df1: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 82 s | $0.47 |
| 2-compare | report.md | 119 s | $0.42 |
| all | | 201 s (the steps add up to 201 s) | $0.89 |

### 1-read: reading.md

# Reading: The Interview

**01** (3:00) Open-plan office. A bald man in a suit sits in a glass corner office. A woman with a bun and glasses (teal top) sits at a desk on the left, and her phone cord runs to a wall socket. I'm the red figure at the middle desk. A spiky-haired man in green is at the kitchen coffee machine. At the top there's a board with five pictures (briefcase, bun woman, bald man, spiky man, red phone), each with a jack and a cable. The HUD shows a clock next to the bun woman with ❌, so she must be Lin. I can't read the empty "hand" slot or the four empty slots.

**02** (3:01) Lin's thought bubble is a clock. She's waiting.

**03** Me at the board, with an E prompt over the bald man's jack. So the board is a phone switchboard I can rewire. Good hook.

**04** (3:09) Lin takes her mug to the kitchen. The spiky man is walking around holding something. I'm at my desk holding papers with the "pretend" key lit, so I'm faking work.

**05** (3:12) The spiky man is at Lin's wall socket and his bubble shows a green thing. A battery? A can? I can't read it. Lin is still in the kitchen.

**06** (3:19) I patch into the red-phone jack. Green rings spread from the spiky man's desk phone, and he shows "!" in the kitchen. I made his phone ring.

**07** (3:23) He's back at his desk with a 😑 face and the phone ringing. Nobody was on the line. Cheap gag, and it works.

**08** (3:21) Lin is at the red kitchen wall phone with a bubble of briefcase and "?". Her interview seems to have been sent to the wrong phone.

**09** (3:15) The boss has a phone to his ear with blue music notes and a 😌 face. A brown pot/stool has appeared next to him, and I can't tell what it is. I put him on hold music.

**10** (3:18) The boss is still on hold. Lin and the spiky man sit together in the kitchen. Lin's cord looks loose at the wall.

**11** (3:12) The spiky man at Lin's socket shows "!" and there's a spark. Did he unplug her phone? Probably to charge his own thing, which would explain the battery in 05.

**12** (3:04) I ring Lin's line. She shows 😠 and shakes. She's irritated, nothing more.

**13** (3:23) Rings spread from Lin's phone while she walks away, and the boss comes out of his office.

**14** (3:31, clock goes red) Lin is on her phone with a bubble of briefcase and 😊. A red cable on the board links the briefcase jack to hers. The interview is happening.

**15** (3:30) Lin is on the kitchen phone with red notes. The boss shows "!" with red rings. Who's ringing whom?

**16** (3:30) Lin's bubble is clock and "?". Her cord is unplugged and the call never came.

**17** (3:31) The boss is beside Lin with a bubble of his own face and 😠. It's unclear who is angry at whom.

**18** (3:30) Same as 15, but the boss is also on blue hold music. Too much happening to read.

**19** End, teal frame. The boss holds Lin's phone with a bubble of briefcase, Lin and "?". The interviewer got her boss. Funniest picture here. The slot icon is a shrugging man and I can't read it.

**20** End, teal. The boss sits happily on hold music on her line. Lin stands by with a bubble of briefcase, clock and 😠. It reads clearly.

**21** End, teal. The plug is on the floor and Lin's bubble is clock and "?". Clear, but flat.

**22** End, teal. The boss is on hold with "!", Lin's desk phone is ringing, and she's on the kitchen phone with music. The icons are notes, a bell and notes. Muddy, I can't say what happened.

**23** End, red frame. Lin is happy on the phone, and I'm sitting in a cardboard box holding a plant. She got my job. Very clear.

**24** End, red (3:15). The boss points angrily at me while I hold her plug. Caught. Clear.

**25** End, red. The boss points at my empty chair and I'm wandering off. Caught away from my desk. Clear.

I'm guessing teal means win and red means loss. Nothing confirms it.

**Story:** Lin is after your job and has a phone interview at 3:30. You sit beside a switchboard that connects every phone in the office. You can unplug her, ring the kitchen phone, put the boss on hold, or best of all, send the interviewer's call to the boss. Do it while looking busy, because if the boss sees you at her socket or away from your desk, you're fired. If you do nothing, she gets the job and you leave with a box.

**Editor's notes:**
- 19 and 23 are the strongest pictures.
- 22, 15 and 18 have two phones ringing at once, too many to follow.
- The spiky man's battery bubble and the brown pot never pay off.

### 2-compare: report.md

Verdict: fixable

**01 — partly** (minor)
- Reading: "A woman with a bun and glasses (teal top) sits at a desk on the left, and her phone cord runs to a wall socket… At the top there's a board with five pictures… each with a jack and a cable."
- Intent: Lin has her receiver at her ear, listening. The board is a switchboard with a dark red lamp over the outside line.
- Cause: missing cue. The receiver at Lin's ear is too small to see, so the player doesn't learn yet that she is waiting on a call. They pick it up in 02 instead. The board was read as "pictures with jacks", which is close enough.
- Fix: show a small teal wavy line from Lin's receiver to her ear, so "on the phone" reads at a glance.

**02 — reads**

**03 — reads.** The player understands that the board connects the phones and they can rewire it. The colour coding of the lamps wasn't mentioned, but nothing depends on it yet.

**04 — partly**
- Reading: "The spiky man is walking around holding something."
- Intent: Kev walks towards Lin's desk carrying his mobile.
- Cause: a prop too small to read. The mobile is a few pixels in his hand. This is where the charging thread starts, and it's lost.
- Fix: draw a bigger phone with a lit screen and a red low-battery sliver, held out in front of him.

**05 — partly**
- Reading: "his bubble shows a green thing. A battery? A can? I can't read it."
- Intent: Kev plugs his charger into Lin's socket, under her phone's plug. Her socket is his charging spot.
- Cause: a glyph used as a prop. The green battery emoji looks like a soda can, and there is no charger cable from his mobile to the socket. The thought bubble is doing all the work and it fails. The player's own note says this thread "never pays off".
- Fix: drop the bubble. Draw a white charger cable from his mobile into the socket under Lin's teal plug, so both plugs are visibly in the same socket.

**06 — partly**
- Reading: "I patch into the red-phone jack. Green rings spread from the spiky man's desk phone."
- Intent: you plugged into Kev's jack, his olive lamp lights, and his olive phone rings.
- Cause: a missing cue. The yellow E cursor still sits on the red (kitchen) jack next to his, and no patch cable is shown in Kev's jack. The gag works, but the player now thinks the red jack belongs to Kev. That confusion will hurt in 08, 15 and 18.
- Fix: draw the patch cable seated in Kev's jack with the olive lamp glowing, and move the cursor off once the plug is in.

**07 — partly**
- Reading: "He's back at his desk with a 😑 face and the phone ringing. Nobody was on the line."
- Intent: Kev holds the receiver to his ear and gets hold music.
- Cause: a missing cue. The olive notes are thin and sit right where the ring lines were, so they read as the phone still ringing. "Nobody on the line" is close, but "hold music" is the mechanic later routes depend on (09, 17, 20, 22).
- Fix: draw bigger, separate notes rising from the receiver at his ear, and stop all ring lines once he picks up.

**08 — partly**
- Reading: "Lin is at the red kitchen wall phone with a bubble of briefcase and '?'. Her interview seems to have been sent to the wrong phone."
- Intent: Kev has left to answer his own phone, so Lin is the only free person near the ringing kitchen phone. She answers hoping it's her interviewer.
- Cause: cause and effect too far apart. No red rings are drawn on the kitchen phone, and Kev is off at the right edge of the frame. The chain "Kev leaves, kitchen phone rings, Lin is the only one left" isn't visible. The player has to make up a reason for her being there.
- Fix: put red rings on the wall phone and have Lin rise from the table with "!", with Kev visible walking away towards his olive rings.

**09 — partly** (matters for the route)
- Reading: "The boss has a phone to his ear… A brown pot/stool has appeared next to him, and I can't tell what it is. I put him on hold music."
- Intent: the boss stands at his window with his back to the room, and his sight cone points out of the window. Hold music blinds him.
- Cause: a missing cue, plus an unclear prop. The "pot" is his empty desk chair, but top-down it looks like a stool. His faint cone doesn't clearly point away from the office. The player got "on hold" and missed "not watching". Their summary only says "do it while looking busy". They never learned that this is the moment to sneak.
- Fix: draw the chair with a back, turned to face the window. Draw his sight cone clearly through the window glass, and grey out the office side.

**10 — partly** (matters for the route)
- Reading: "Lin's cord looks loose at the wall."
- Intent: you pulled the plug. Her cable lies on the floor, the plug is out, and the socket is empty.
- Cause: a missing cue. The loose plug is a few pixels at the end of a cable that is already coiled on the floor in every shot. The player doesn't realise they did it. They also missed that the boss's turned back is what made it safe.
- Fix: draw the plug clearly apart from the wall with a visible gap, and give the empty socket two dark holes. Have Lin's teal lamp on the switchboard go dark at the same moment.

**11 — misread** (matters for the route)
- Reading: "The spiky man at Lin's socket shows '!' and there's a spark. Did he unplug her phone? Probably to charge his own thing."
- Intent: you pulled her plug too early. Kev comes to charge his mobile, finds her plug in his way and jams it back in.
- Cause: a missing cue, plus the cause and the effect are too far apart. We never see the plug lying on the floor before he arrives, and the "!" plus a spark reads as him doing the sabotage. The player learns the opposite lesson: Kev is a saboteur, not a timing hazard who undoes your work.
- Fix: show Kev holding Lin's plug up at arm's length with a 😠 bubble before the spark, so the plug visibly goes from floor to wall.

**12 — partly**
- Reading: "She shows 😠 and shakes. She's irritated, nothing more."
- Intent: you rang her while she was at her desk. She picked up, got hold music and slammed the receiver down.
- Cause: a missing cue. There are no notes from her receiver and no visible slam, so it isn't clear why she's angry. "Ringing her while she's sitting there just wastes the trick" doesn't come across.
- Fix: show a moment of hold notes from her receiver, then the receiver landing on the cradle, then 😠.

**13 — reads.** The ring, Lin walking away and the boss coming out are all seen. The player doesn't spell out "he's coming to answer it", but 19 makes up for that.

**14 — reads**

**15 — misread** (matters for the route)
- Reading: "Lin is on the kitchen phone with red notes. The boss shows '!' with red rings. Who's ringing whom?"
- Intent: at 3:30 Lin's empty desk phone rings red. Lin is on hold at the kitchen phone. The boss, the only free person nearby, gets up to answer.
- Cause: colour overload, plus a missing cue. Red is used for the outside line's rings, the kitchen phone, Lin's hold music, the 3:30 clock and the loss frame. The rings are so big that their centre (Lin's phone) is lost, and they look like they come from the boss. His "!" doesn't point at the source. The player's "two phones ringing at once" note is really this: one ring and one tune, both red.
- Fix: keep red only for the outside call. Make hold music a single neutral colour everywhere, such as white or grey notes. Draw tight rings that shake Lin's handset, and put a teal phone icon next to the boss's "!".

**16 — reads**

**17 — misread** (matters for the route)
- Reading: "The boss is beside Lin with a bubble of his own face and 😠. It's unclear who is angry at whom."
- Intent: the boss is still on Lin's phone at her desk with hold music. Lin, back from her tea, glares at him. Her line is busy.
- Cause: an emoji standing in for a person, plus a missing cue. The bubble's tail lands between them, so "boss face + 😠" reads as the boss being angry. There are no notes from the receiver, so "he's tying up her line" is invisible. This is the setup for win 20, and it doesn't come across.
- Fix: point the bubble clearly at Lin and change it to her teal phone, the boss's face and 😠. Draw hold notes rising from the receiver at the boss's ear.

**18 — misread** (matters for the route)
- Reading: "Same as 15, but the boss is also on blue hold music. Too much happening to read."
- Intent: Lin's empty phone rings, Lin is on hold in the kitchen, and the boss turns to the ring but stays with his tune. Kev is too far away. Nobody answers.
- Cause: a missing cue. It is nearly the same frame as 15: same red rings, same "!" on the boss. The only difference is a few blue notes. The point is "the boss notices but doesn't move", and nothing shows the not-moving.
- Fix: replace the boss's "!" with a bubble of a ringing phone and 😌, keep him seated facing the window, and draw Kev's sight cone stopping well short of the rings.

**19 — reads.** The player calls it the funniest picture here. The shrug icon in the slot is cosmetic.

**20 — reads**

**21 — reads.** The player says it's "clear, but flat". That's a comedy note, not a reading failure. Something like Lin tapping the dead receiver would help.

**22 — misread**
- Reading: "The boss is on hold with '!', Lin's desk phone is ringing, and she's on the kitchen phone with music. The icons are notes, a bell and notes. Muddy, I can't say what happened."
- Intent: win. Lin's phone rings with nobody at it, because the boss and Lin are each on hold.
- Cause: a missing cue, plus the colour overload from 15. The boss's "!" says he's about to act, which goes against "nobody comes". The ringing phone is small and in the middle distance. The icon row (boss, notes, bell, Lin, notes) reads as a list, not a result. The player didn't even register the two faces.
- Fix: move the ringing teal phone and Lin's empty chair to the front and centre. Drop the boss's "!". Change the icons to bell and empty chair, so they say "unanswered".

**23 — partly** (minor)
- Reading: "I'm sitting in a cardboard box holding a plant. She got my job."
- Intent: Lin sits at your desk (your red mug, your nameplate) while you stand nearby holding your things in a box.
- Cause: a prop drawn in the wrong place. The box is drawn in front of your body, so you look like you're sitting in it. The player also didn't notice that it's your desk she's at. They still got the outcome.
- Fix: draw you standing, holding the box at your chest with the plant sticking out, and make the red mug and your nameplate next to Lin's elbow larger.

**24 — reads**

**25 — reads**

**Across all shots:** "I'm guessing teal means win and red means loss. Nothing confirms it." The frame colour is the only signal, and red already does five other jobs. Put a smug-you face as the first icon on every win card and a 😟 you on every loss card.

**Summary:** The main idea (the switchboard, rerouting the interview, don't get caught) reads, and so do the best pictures (14, 19, 20, 23, 24). Five shots are misread, and four of them set up routes or teach a rule needed to win. In 11 the plug thread runs backwards. In 15 and 18 the colours mix up the 3:30 call. In 17 the busy-line win isn't set up. 22 is also misread, but it only muddies an end card. Smaller misses weaken the Kev charging thread (04, 05) and the boss's back being turned (09, 10). These fixes are about props, colour and bubble contents, not about how the level is built.

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
