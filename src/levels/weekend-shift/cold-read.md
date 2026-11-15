# Cold reads: weekend-shift
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"40e4c6bf186b4592f0090a1e21a0f743dd0f19e162d8763edbab20465153a53c","parts":{"card":"02e298b66d250af2d55a4381267037f50bae8e0ed05c635d43176646d1a6a326","premise":"522e38b550c905c3be9b72fdb477cb8bb13a9d5a22f149d12f2f931eefc10a18","prompts":"c2886f589c84ff30cad9e05d737f4d22d2f634d9aba125f62e9ac2a88edc579e"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs 40e4c6bf186b: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 14 s | $0.02 |
| 2-review | report.md | 102 s | $0.52 |
| all | | 116 s (the steps add up to 116 s) | $0.55 |

### 1-card: first-read.md

**Situation:** It's 5:00 PM, probably Friday since "this Saturday" is still ahead. Somebody will be stuck working tomorrow. The icons (🗓️ @player) suggest one of two things: either the calendar already has my name on it, or I'm just the obvious pick.

**What I must do:** Make sure someone else gets Saturday. That could mean swapping my name on the schedule, making a coworker look like the better pick, or being gone or looking busy when the boss chooses.

**If I fail:** I work Saturday. I'd expect the loss picture to show me alone at my desk with weekend clues around me.

**Questions:**
- Is 5:00 PM when the loop starts, or the deadline? The game says loops are "afternoons," which makes this unclear.
- Does it have to be a specific person, or can it be anyone? Can I get the shift cancelled so nobody works?
- What exactly does 🗓️ @player mean?
- Who decides who works: the boss, a sign-up sheet, or whoever is still in the office last?
- The name: does "Shift" mean a work shift, or shifting the shift onto someone else? Is that pun deliberate?

### 2-review: report.md

I've read all the level files; writing the report now.

Verdict: fixable

**1. The joke depends on the boss obeying a forgery of his own name, and the Blamed ending shows he can spot one.** At 5:00 the boss reads out his own face. He made this roster, so he knows he never put himself on it. Yet if you're away from the board, the Blamed card shows the change crossed out and your face put back (`end-scenes.js:198`). So he can spot a forgery, but only when you're not there to watch. A player who wins the boss route will ask why he didn't just wipe it. *Fix:* make the slot a stack of photo magnets that the boss filled in "fairly" at 4:00 by drawing one blind from a mug on the stand. Show that draw on screen. Swapping the magnet then works by the board's own rule, and he can't argue with it in front of everyone.

**2. The ding is learned only by trying it.** No one else's microwave ever dings. Lin's fish turns for minutes, and the code gives it no sound (`cast.js:70`, and `NOISES` has no entry for it). premise.md says players learn the ding "the first time they heat their noodles, so the trick is a restart away". That is trial and error. *Fix:* have Kev heat popcorn at about 4:22, while the boss is at the copier facing west. The ding turns every head east, so the player sees it work. The boss's turn points him straight at the board, so it doesn't give away a free window.

**3. The boss's phone sits in a corner only because the puzzle needs his back turned.** The code removes the phone from his desk and leaves a folder there (`props.js:537`). The player also has no way to learn that he answers standing at the window before ringing it for the first time. *Fix:* give him one real call at about 4:08: his corner phone rings, he paces to the window with his back to the room, and he talks for a while. That gives him a habit, and it shows the player the route before they need it.

**4. The card's "5:00 PM" reads as the start time.** The loop starts at 4:00, and 5:00 is the deadline. The first reader stumbled on exactly this. *Fix:* "Friday, 4:00. At 5:00 the boss picks who works Saturday." It still names only the trouble, and it tells you who decides, which the first reader also asked.

**5. The name half-hints at the way out.** "Weekend Shift" invites the reading "shift it onto someone else", and the first reader guessed it. That leads straight to "write a different name". It's mild, but it counts. *Fix:* "Saturday", or "Weekend Duty".

Smaller issues:
- The boss's photocopy break (4:20–4:25) is a dead window, because Lin still watches the board. That's fine, but keep it only if it teaches Lin, which the 4:00 phone attempt already does.
- Heating fish at 4:30 is believable office crime. The smell wisps and the 🐟😊 back at her desk are a good, small character beat.

**Checks that pass.**
- Sightlines: the boss at (13,3) sees the board at (9,9) at 7.2 tiles, inside his 50° half-cone and 9-tile range. Lin at 5.4 tiles is inside hers. Kev at 10.3 tiles is out of his.
- Phone timing: the boss walks about 1.5 game minutes to the corner, then talks for 5. Lin faces away from the board from about 4:30 to 4:37. The overlap gives you enough time to walk 9 tiles and write.
- The copier trap matches its geometry: the board stands between the copier and both watchers.
- The ding radius of 20 reaches everyone.
- The route checks agree that ringing at 4:00 cancels the write rather than leaving it on the board.

**Best thing:** the boss steps up with 📢, finds his own face in the slot and goes red. Then the end card shows a sunny Saturday and him alone at a desk with the pile of work. Keep that picture.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"43b036b0d3f3033ebeb4448422b64c6ec9e3ef64c7b904df301597db7430b80f","parts":{"card":"02e298b66d250af2d55a4381267037f50bae8e0ed05c635d43176646d1a6a326","shots":"8d2c69bdde8502474e9f5217c56e1ed915f34280fc04f29b75f380f310d358c1","pictures":"adc92fc9e29c2572952a96b34befc81c104a86226247889615c9c9d85dd5efde","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs 43b036b0d3f3: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 97 s | $0.53 |
| 2-compare | report.md | 143 s | $0.68 |
| all | | 240 s (the steps add up to 240 s) | $1.21 |

### 1-read: reading.md

# Weekend Shift: cold read

**01** (4:00) Open-plan office. A bald man in a suit sits behind a glass wall on an orange rug, looking down over the room, with a pale cone showing what he sees. I'm the woman in red with a bun, at the bottom-left desk. Two coworkers (teal shirt, green shirt) sit at their desks. On a whiteboard stand in the middle is a red-framed portrait of me. It matches the calendar-plus-my-face icon on the card, so it reads "you're working Saturday". The boss's view covers the whole board.

**02** (4:01) I'm at the board with a pencil bubble. The boss's cone turns red and a black bar with a red "?" appears over him. Clear message: he's starting to notice me.

**03** (4:06) I'm at the microwave with a bowl-of-noodles bubble.

**04** (4:02) I'm at the copier with a paperclip bubble. I can't tell what this does.

**05** (4:00) A "↻1" stamp marks the loop start. I'm at my desk with a phone bubble and red rings around me. Noise? Or just a "you are here" pulse?

**06** (4:07) The microwave is running and has a green display.

**07** (4:10) Back at the board with the pencil. His cone is red and the "?" is back, so the microwave alone didn't distract him.

**08** (4:13) I'm holding Pretend (Shift), and a fast-forward icon appears. Big thin arcs spread out, and the boss and the teal coworker turn right, toward the kitchen. The microwave chimed, so noise turns heads.

**09–10** (4:15–4:16) I'm at the board with a ♪ thought bubble, which I take as innocent whistling. The portrait seems to change, but it's too small to read. In 10 his gaze swings back with the "?". The chime only buys a few seconds.

**11** (4:02) I lift my desk phone, and a dotted line runs to a phone in the boss's back corner. He gets a spiky "☎️!". There's a tiny pencil glyph on the maroon chair by the board, and I can't tell what it means.

**12** (4:04) The boss walks over to the ringing phone with a "?", and his chair is empty. I'm editing the board freely. This looks like the intended route.

**13–15** (4:35) The boss is stuck on that phone (or back at his desk in 13). Teal coworker is microwaving, green coworker has scribble lines over his head (annoyed?), and I'm at the board whistling. I can't tell why 13 shows the boss at his desk at the same timestamp.

**16** (4:04) A "🖨️!" burst over the green coworker. I seem to have triggered the copier from across the room.

**17** (4:09) He's at the copier, and I'm at his empty desk holding Pretend. What am I doing there? Nothing shows it.

**18** (4:04) Copier trick plus board edit, but the boss's red cone still covers me. The copier pulls the coworker away, not the boss.

**19** (4:56) The clock turns red. The boss walks to the board and everyone gathers.

**20** (4:58) Boss with a megaphone bubble: announcement time.

**21–23** (4:59) Boss says 👉 + whoever's face is on the board. Me (21). **His own face, with 😳 (22)**. The green coworker, who answers 😩 (23). Best gag in the level.

**24 / 29** (identical) Red border, so a loss. On the board the boss's face is crossed out and mine is back. I'm at my desk 😩 while the sun shines outside. Icons: chair, pencil, me. The chair is the clue and I can't read it. Did he see me from his chair? Did somebody fix the board?

**25** Teal border: win. The boss works Saturday, scowling. Icons: pencil, boss, beach umbrella. One slot fills with a noodle bowl. A bonus for the microwave? Nothing told me.

**26** Win, with the green coworker stuck instead. Same bowl in the slot.

**27** Loss: board untouched. Icons: calendar, me, 😩. The default ending.

**28** (4:02) Loss: caught. The boss storms over angry while I'm 😳 at my desk. Icons: pencil, 😠, me.

**Unclear overall:** the black "?" bar, the red rings in 05, the paperclip, the chair icon in 24, the noodle-bowl slot, and what I did at the green coworker's desk.

## Story
At 4:00 your face is on the weekend rota and your boss can see the board.
Make noise (microwave, copier, a call to his phone) to turn his head or pull him away. Then swap the face on the board.
At 4:59 he reads out whatever name is up there.
You can stick a coworker with it (a little cruel), or the boss himself, who has to own it.
The lesson is that noises pull eyes, and a phone call pulls the whole person.

### 2-compare: report.md

Verdict: fixable

The player gets the core idea: noise turns heads, a call pulls the boss away, you swap the face, and he reads it out. They miss two rules a route depends on. First, Lin also watches the board, so the phone call alone isn't enough. Second, you must be standing at the board at 5:00. They also never clearly see the face change on the board. Those are misreads that matter to a route, not unreadable art.

- **01 start**: reads.
- **02 board**: reads. The seven-day row and red line are too small to pick out, but that's cosmetic.
- **03 microwave**: reads.
- **04 copier**: **misread**
  - Reading: "I'm at the copier with a paperclip bubble. I can't tell what this does."
  - Intent: the copier is working, and you could jam it.
  - Cause: a glyph used as a prop. A paperclip means "attach", not "jam".
  - Fix: make the prompt a crumpled sheet stuck in a copier mouth, or a copier with a red ✕.
- **05 phone**: **partly**
  - Reading: "Noise? Or just a 'you are here' pulse?"
  - Intent: you could ring the boss's corner phone from here.
  - Cause: a missing cue. Nothing links your phone to his phone until 11. Also, the red loop-start rings use the same red ring language as noise.
  - Fix: when you're in range, show a faint dashed preview line to the corner phone. Draw the loop-start pulse as a white down-arrow, not red rings.
- **06 noodles-cooking**: **partly**
  - Reading: "The microwave is running and has a green display."
  - Intent: the display counts down to a ding.
  - Cause: a missing cue. The timer is a few green pixels, so the delay never registers, and that causes the 07 misread.
  - Fix: put a shrinking ⏳ ring bubble over the microwave while it runs.
- **07 too-early**: **misread**
  - Reading: "The microwave alone didn't distract him."
  - Intent: it's too early because the noodles are still cooking. Both the boss's and Lin's cones cover you.
  - Cause: cause and effect too far apart. The timer is across the room and unreadable, and Lin's cone isn't tinted, so only the boss seems to watch.
  - Fix: show the ⏳ ring from 06. Tint every cone that covers you red, not just the boss's.
- **08 ding**: reads. The arcs come in from off-screen rather than spreading out from the microwave, and the fast-forward icon is noise.
- **09 written-boss**: **misread**
  - Reading: "The portrait seems to change, but it's too small to read."
  - Intent: the Saturday box now shows the boss's face.
  - Cause: a missing cue. The pencil prompt bubble sits right on top of the Saturday box, and the face is tiny anyway.
  - Fix: put the prompt beside the board. When a face is written, pop it up from the board as a large face bubble for a second.
- **10 written-kev**: **misread**
  - Reading: "In 10 his gaze swings back with the '?'. The chime only buys a few seconds."
  - Intent: you wrote over the box again, and now it shows Kev's face.
  - Cause: the same covered, tiny box as 09. The returning "?" takes all the attention.
  - Fix: same as 09.
- **11 phone-ring**: reads. Separately, there's a stray pencil glyph on the maroon chair that the reader flags and no intent explains. Remove it, or turn it into a real prop.
- **12 lin-watches**: **misread**
  - Reading: "I'm editing the board freely. This looks like the intended route."
  - Intent: Lin, at her desk, faces the board, and her cone covers you.
  - Cause: a missing cue. Lin's cone is a pale wash with no red and no "?", while the boss's ripples take over the frame. The player concludes the phone call alone wins.
  - Fix: give any watcher whose cone covers you the same red cone and "?" bar the boss gets.
- **13 lin-fish**: **partly**
  - Reading: "Teal coworker is microwaving … I can't tell why 13 shows the boss at his desk at the same timestamp."
  - Intent: it's 4:35. Lin has her back to the room with a fish in the microwave, and she's been there since 4:30. That's your window.
  - Cause: a missing cue. The fish is unreadable, and nothing marks this as a routine with a start time.
  - Fix: give Lin a 🐟 bubble and a ⏳ ring over the microwave when she starts it. Draw smell lines so the long wait reads.
- **14 phone-window**: reads. Kev's scribble lines ("annoyed?") are unexplained noise. Either drop them or make them mean one thing.
- **15 written-phone**: **partly**
  - Reading: "I'm at the board whistling."
  - Intent: with nobody looking, the box now shows the boss's face.
  - Cause: the same covered, tiny box as 09.
  - Fix: same as 09.
- **16 copier-jam**: **misread**
  - Reading: "I seem to have triggered the copier from across the room."
  - Intent: the copier is jammed, with crumpled paper, a red light and red beeping ripples. Heads turn to it and Kev gets up.
  - Cause: cause and effect too far apart. The big "🖨️!" burst is on Kev at the bottom right, and the copier next to you shows no jam.
  - Fix: put the ripples, red light and paper on the copier itself. Give Kev only a small "!".
- **17 kev-fixing**: **partly**
  - Reading: "He's at the copier, and I'm at his empty desk … What am I doing there?"
  - Intent: Kev kneels at the copier with a spanner, fixing it.
  - Cause: a missing cue. Kev is standing with no spanner, and the player standing at Kev's desk pulls focus.
  - Fix: draw Kev kneeling with a 🔧 bubble, and take this shot without the player at his desk.
- **18 mirror-fail**: **misread**
  - Reading: "The copier pulls the coworker away, not the boss."
  - Intent: every cone turns toward the copier behind the board, so you at the board are in plain view.
  - Cause: cause and effect too far apart, same as 16. The burst on Kev hides that the boss's cone did turn, toward the copier and onto you.
  - Fix: same as 16. Ripples drawn out from the copier, passing over the board, make the line of sight obvious.
- **19 gather**: **partly**
  - Reading: "The boss walks to the board and everyone gathers."
  - Intent: one spot in front of the board waits for you.
  - Cause: a missing cue. There's no marker for your place. This is the hidden rule behind 24 and 29.
  - Fix: show a pulsing outline of your figure on the floor in front of the board from 4:55.
- **20 reading-points**: **partly** (cosmetic)
  - Reading: "Boss with a megaphone bubble: announcement time."
  - Intent: the Saturday box glows red round your face.
  - Cause: the glow isn't visible. 21 makes the point anyway.
  - Fix: a strong red pulse on the box.
- **21 reading-you**: reads.
- **22 reading-boss**: reads.
- **23 reading-kev**: reads.
- **24 away-at-five**: **misread**
  - Reading: "Identical [to 29] … The chair is the clue and I can't read it."
  - Intent: the in-room moment where everyone stares at your empty spot.
  - Cause: a missing cue. The shot is the end card, not the in-room beat, so the moment the rule depends on never appears.
  - Fix: show the 4:59 room with all three facing the empty outline from 19, and the boss's bubble showing 👉 plus a dotted empty silhouette.
- **25 end-win-boss**: reads. The noodle-bowl slot isn't covered by any intent and the reader can't explain it. Clarify it or cut it.
- **26 end-win-kev**: reads.
- **27 end-fail**: reads.
- **28 end-caught**: reads.
- **29 end-blamed**: **misread**
  - Reading: "Did he see me from his chair? Did somebody fix the board?"
  - Intent: you weren't there at 5:00, so the board went back to your face.
  - Cause: a glyph used as a prop. The chair icon reads as the boss's chair, not your empty place.
  - Fix: replace the chair with the dotted empty-silhouette icon from 19 and 24. In the picture, show the boss pointing at that empty spot.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"c36a533","hash":"8d8769c2373e8680c1cec215b4293c47773c76ca6ec8ebc716ec22f9ec0201ea","parts":{"card":"02e298b66d250af2d55a4381267037f50bae8e0ed05c635d43176646d1a6a326","checks":"7eeb024a26c5c3997eb968c8ca7e15f66ee5ce73eba3f98ac09e9ffdcc126ca8","ways":"ac1ed343bf5e84837140ad25392f7c5d4b27f6a40f32d11d289740e203bb91c9","frames":"983ac45ad4dd1a3419f753a4522c4745834411a79000ab818a193a2052698619","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit c36a533, by claude -p (model: default). Inputs 8d8769c2373e: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 193 s | $0.82 |
| 1-read-2 | reading.md | 90 s | $0.36 |
| 2-compare | report.md | 112 s | $0.41 |
| all | | 305 s (the steps add up to 395 s) | $1.59 |

### 1-read-1: reading.md

# Weekend Shift: cold read

Card: "5:00 PM. Someone works this Saturday. Make sure it isn't you." At the start, the whiteboard in the main room shows the player's face (red top, hair bun).

## Run 1: LOSS
- 4:41 Player sits at their desk. A phone bubble shows over the desk phone. Teal coworker: 🐟😊.
- 4:58 Bald boss stands at the whiteboard with a 📢 bubble. The two coworkers come over.
- 4:59 Boss points at the face on the board.
- 5:00 Player walks over to the board. Boss 👉, player 😅.
- End picture: the player at a desk with a paper stack, 😩. Icons: 🗓️, player, 😩.

**Why it ended:** the board still had the player's face at 5:00.
**Cause:** the player did nothing. The loss is the default.
**Maybe not reactions:** the 4:41 🐟😊, the 📢 and the gathering all happen in every run. They're routine.

## Run 2: LOSS (caught, 4:02)
- 4:01 Player is at the board holding a pencil, with E lit. The boss in his glass office and the teal coworker both show "?".
- 4:01 Boss shows a red "!😠" and draws a red line to the player.
- End picture: the angry boss beside the player. Icons: ✏️ 😠 player.

**Why it ended:** the boss saw the player drawing on the board.
**Cause:** drawing on the board while the boss's view cone covered it.
**Maybe not reactions:** none. The "?" bubbles came at the moment the player started drawing.

## Run 3: WIN
- 4:06 Player uses the microwave in the kitchen corner. Food shows inside.
- 4:12 A sound plays. The boss turns toward the lower right, away from the board, and the teal coworker twitches.
- 4:14 Player draws on the board with a ♪ bubble over them. The face on the board turns into the boss.
- 4:41 Teal coworker: 🐟😊 (the same as every run).
- 4:58 The 📢 meeting starts.
- 5:00 Boss: 😳 at his own face. Player: 🎉. A bowl badge fills the first slot.
- End picture: the boss at the desk, 😩. Icons: ✏️, boss, 🏖️.

**Cause:** starting the microwave, then drawing while its 4:12 sound had the boss facing away.
**Maybe not reactions:** I can't tell if the ♪ means the player is acting innocent or is just flavour.

## Run 4: WIN, with a different target
- 4:06, 4:12 and 4:14 go exactly as in Run 3: the board shows the boss.
- 4:16 Player uses the board again. The face changes to the coworker in the green sweater with spiky hair.
- 4:41 🐟😊. 4:58 📢.
- 5:00 Green coworker: 😩. Player: 🎉. Bowl badge.
- End picture: the green coworker works Saturday.

**Cause:** the same as Run 3. Using the board a second time changes which face it shows.
**Maybe not reactions:** none. The green coworker's 😩 at 5:00 clearly reacts to his own face.

## Run 5: LOSS (caught, 4:12)
- 4:06 Player starts the microwave.
- 4:11 Player starts drawing on the board, with E lit and a progress ring around them. Boss and teal coworker: "?".
- 4:11 Boss: "!😠".
- End picture: caught (✏️ 😠 player).

**Cause:** the player started drawing at 4:11, one minute before the 4:12 microwave sound. The boss was still facing the board.

## Run 6: LOSS (caught, 4:04)
- 4:03 Player uses the copier at the far left, with a ♪ bubble. A "🖨️!" burst appears over the green coworker's desk. The boss turns his head toward the left.
- 4:03 A sound plays. Player walks to the board.
- 4:04 Player draws at the left side of the board. The boss now faces left, with his view cone right over the board. Boss and teal coworker: "?". Green coworker gets up.
- 4:04 Boss: "!😠". Green coworker walks toward the copier.
- End picture: caught.

**Cause:** the copier's noise turned the boss's head toward the board, not away from it.
**Maybe not reactions:** the green coworker walking toward the copier looks like a reaction, but it could be his routine. No other run shows 4:04.

## Run 7: WIN
- 4:31 Player uses their desk phone. A phone rings in the top-right corner of the boss's office ("☎️!"). A chair-icon bubble shows over the player's desk. I can't tell what it means.
- 4:32 Boss gets up and walks to that corner phone. The teal coworker is away in the kitchen.
- 4:33 Boss picks up the corner phone and shows "?". Player walks to the board.
- 4:35 Player draws (♪). The board changes to the boss.
- 4:38 Boss: 😠 as he heads back. The teal coworker walks back from the microwave.
- 4:41 🐟😊. 4:58 📢.
- 5:00 Boss: 😳. Player: 🎉. A phone badge fills the second slot.
- End picture: the boss works Saturday.

**Cause:** a call from the player's desk phone pulled the boss to the corner phone, and the player drew on the board while he was there.
**Maybe not reactions:** the teal coworker's trip to the kitchen may be their routine at that hour. If so, the player was lucky to have no witness.

## Run 8: LOSS (scheduled, not caught)
- 4:02 Same phone call as Run 7. The boss gets up.
- 4:03 Boss walks to the corner phone.
- 4:04 Boss at the corner phone: "?". Player at the board with a pencil. The teal coworker, at their desk, turns their head.
- 4:05 Teal coworker turns around facing the board and shows "?".
- 4:05 Teal coworker: "!👉" with a red dashed line to the player, who is now back at their desk. A paper stack appears on the player's desk. Boss: 📄📄👉🖥️. A paper icon with a red bar appears at the top right of the screen.
- 4:09 Boss walks back: 😠.
- 4:41 The player sits at the desk. The stack and the top-right paper bar are gone.
- 4:53 Boss at the board: 📄📄👉🖥️. The stack and the bar are back.
- 4:58 📢. 4:59 Boss points at the player's face on the board. 5:00 Player walks over: 😅.
- End picture: the same as Run 1 (🗓️ player 😩).

**Why it ended:** the board still showed the player's face at 5:00. The drawing never finished.
**Cause:** the teal coworker saw the player at the board and reported them. In Run 7 that coworker was away in the kitchen.
**Unclear:** how the player got back to their desk within the same minute. I also can't tell what the paper stack and the bar mean, why they vanished at 4:41 and came back at 4:53, or why the player didn't try the board again. The teal coworker's 4:04 head turn could have been caused by the phone ringing, by their routine, or by seeing the player. I can't tell which.

### 1-read-2: reading.md

# Weekend Shift: reading of runs 9 and 10

Both loops are losses, and both end on the same picture: the player stuck at a desk on a sunny day. Only the icons under it differ.

## Run 9: loss

- **4:06** You use the coffee machine or microwave on the right wall. I couldn't see any change.
- **4:12** You're at the easel, which shows your face, and a marker bubble appears over you. The teal worker turns her head, with motion lines.
- **4:14** The easel now shows the bald boss's face. You have a ♪ bubble, like whistling innocently.
- **4:41** You're back at the right wall. The teal worker shows 🐟😋.
- **4:58** The boss leaves his office for the easel with a megaphone bubble. The workers sit down around it. One yellow chair stays empty.
- **4:59** The boss shows his own face plus 😳.
- **5:00** All three show "🪑?", then turn angry and point at you. You show 😰.
- **5:01** Loss. The end picture crosses out the boss's face and circles yours. Icons: 🪑 ✏️ you.

**Why it ended:** The boss caught the swapped picture, and you weren't at the meeting. The chair icon suggests your empty seat gave you away. That fits, but I can't confirm it.

**Your actions that caused it:** Redrawing the easel (4:14), then staying away from the meeting.

**Might not be about you:**
- The 4:12 head-turn happens at the same time in run 10, when you weren't near her.
- 🐟😋 shows up at 4:41 in both runs.
- The 4:58 meeting starts the same way in both runs.

## Run 10: loss

- **4:06** You use the right-wall machine again (same as run 9).
- **4:12** You're still there. The teal worker turns her head again.
- **4:41** You use the photocopier. The olive worker shouts 🖨️❗. You whistle ♪. The teal worker shows 🐟😋.
- **4:43–4:48** The olive worker walks to the copier, which spits out paper. You stand at the olive worker's empty desk. Your captions don't mark any action there.
- **4:50** At the copier, the olive worker smiles 😊.
- **4:58** The meeting gathers again and the boss shows the megaphone bubble. The easel still has your face.
- **4:59** The boss shows 👉 plus your face.
- **5:00** Suddenly you're standing at the meeting, sweating, without being shown walking there. Papers lie on the floor by the olive worker's desk.
- **5:01** Loss. Icons: 🗓️ you 😩.

**Why it ended:** The easel was never changed, so the boss picked you.

**Your actions that caused it:** You did nothing that changed the outcome. The copier trick pulled the olive worker away, but nothing came of it.

**Unclear:**
- I can't tell who scattered the papers or why.
- I can't tell why you jumped to the meeting.
- The olive worker's 🖨️❗ came at the same moment you used the copier and didn't happen in run 9, so it's probably a reaction to you.

### 2-compare: report.md

I've read the three files and checked the disputed frames for runs 8, 9 and 10. Here is the report.

Verdict: fixable

## Runs

- **Run 1: explained.** The reader saw that doing nothing leaves the player's face on the board at 5:00. They also correctly called the 🐟😊, 📢 and gathering routine.
- **Run 2: explained.** Drawing in the boss's view cone gets the player caught.
- **Run 3: explained (win).** The reader named the cause: the microwave, then drawing while the 4:12 ding had the boss facing away.
- **Run 4: explained (win).** The reader named the ding, and saw that drawing a second time switches the face to the green coworker.
- **Run 5: explained.** "started drawing at 4:11, one minute before the 4:12 microwave sound." The teaching loss works.
- **Run 6: explained.** "the copier's noise turned the boss's head toward the board, not away from it." The trap works.
- **Run 7: explained (win), but only just.** The reader named the phone pulling the boss to his corner phone. They noticed Lin was away, but filed it as luck: "If so, the player was lucky to have no witness." Ringing at 4:30 so that Lin's microwave trip lines up with the call is the whole skill of this route, and the reader doesn't see it as the player's choice. They only work it out by comparing with run 8 ("In Run 7 that coworker was away in the kitchen"). That's enough to count as explained, but see beat 4.
- **Run 8: explained.** The reader says the teal coworker saw the player at the board and reported them, and that in run 7 she was away. That matches "ring the phone with Lin at her desk." The punishment that follows is not understood at all (beats 5 and 6).
- **Run 9: partly.** This is the blamed loss.
  - The reading: "The boss caught the swapped picture, and you weren't at the meeting. The chair icon suggests your empty seat gave you away. That fits, but I can't confirm it."
  - What happened: the swap itself was safe. The ding covered it, and in run 3 the boss shows the same 😳 at his own face and the player wins. The only cause was that the player was at the microwave, not in the empty spot, at 5:00.
  - The reader puts "caught the swap" first and offers the real cause only as a guess they can't confirm.
  - Visual cause: a bubble that reads as a reaction (the 😳, see beat 2), and an emoji standing in for a person. In 07.png, three "🪑?" thought bubbles stand in for "where is she?", and nothing on the floor marks her empty spot.
  - Fix: draw the player's empty spot in the half-circle as a red-outlined footprint or floor marker, and have all three heads turn to look at it, before any "?" appears. Put the same marker on the end card, so the 🪑 icon has a picture to match.
- **Run 10: explained.** "The easel was never changed, so the boss picked you." The reader also read Kev's 🖨️❗ correctly as a reaction to the copier.

## Beats that misled the reader

1. **The ding head-turn was dismissed as routine (runs 9 and 10).** This is the beat that makes the verdict fixable.
   - The reading: "The 4:12 head-turn happens at the same time in run 10, when you weren't near her." Also: "4:06 You use the coffee machine or microwave… I couldn't see any change."
   - What happened: the player started the microwave at 4:06 in both runs, so both runs had a ding at 4:12. The head-turn is a reaction to the player. The reader compared two runs where the player did the same thing and decided it was routine. As a result, the run-9 reader never learns why their redraw went unseen, which is the lesson of this level.
   - Visual cause: cause and effect too far apart (6 minutes, with no picture in between), plus a missing cue. In 01.png and 02.png the microwave shows nothing a reader can point to. There's no visible countdown, no lit door, and no ripple. Lin's motion lines don't point at anything, and the boss's cone moving is easy to miss.
   - Fix: when the ding fires, draw a ring spreading out from the microwave. Have every turned head show a small 🍜 or 🔔 bubble pointing back at it. Keep the countdown digits big and visible on the microwave from the moment you press it.

2. **The boss's 😳 at his own face reads as being caught (run 9).**
   - The reading: "The boss caught the swapped picture."
   - What happened: the 😳 is the boss reacting to his own face on the board. He does it in the win (run 3) too. It isn't detection.
   - Visual cause: a bubble that reads as a reaction to the player. 😳, followed by everyone pointing at you, looks like the plot being discovered.
   - Fix: in run 9, have him look for the player in her empty spot first. Show the empty spot, then 😳. Or give a win a different reaction from a loss: in a win, the player stands beside him grinning when he blushes.

3. **The chair bubble over the player's desk (run 7, 4:31).**
   - The reading: "A chair-icon bubble shows over the player's desk. I can't tell what it means."
   - What happened: it's the same 🪑 that decides run 9, meaning an empty seat gets noticed. It's a real cue, and the reader missed it.
   - Visual cause: an emoji standing in for a person. It's an icon floating over furniture, and nobody in the picture is noticing anything.
   - Fix: drop the floating icon. Leave the chair visibly pushed back and empty, and have a coworker who walks past glance at it with "?".

4. **Lin's 4:30 microwave trip read as luck (run 7).**
   - The reading: "the player was lucky to have no witness."
   - What happened: it's her fixed routine, and the phone route only works if you ring when she leaves.
   - Visual cause: cause and effect too far apart. She leaves at 4:30, but the first picture is at 4:31 and she is already gone, so the reader never sees her leave.
   - Fix: keep a mug or fish-box prop on Lin's desk that she visibly picks up when she stands, and leave the desk visibly empty while she's away. Show her standing up in the 4:30 frame.

5. **The "teleport" back to the desk (run 8, 4:05) and to the meeting (run 10, 5:00).**
   - The reading: "how the player got back to their desk within the same minute." Also: "Suddenly you're standing at the meeting… without being shown walking there."
   - What happened: these are forced moves, the told-on punishment and the 5:00 roll-call. Neither is something the player did.
   - Visual cause: a missing cue. In run 8 05.png, the dashed red line runs from Lin to the player, who is already back at their desk.
   - Fix: show the boss marching the player back by the collar in one frame, and the boss waving the player into the half-circle with a 👉 at 5:00.

6. **The paper stack and the red bar (run 8, 4:05 / 4:41 / 4:53).**
   - The reading: "I also can't tell what the paper stack and the bar mean, why they vanished at 4:41 and came back at 4:53, or why the player didn't try the board again."
   - What happened: it's the 20-minute typing punishment. The stack and bar returning at 4:53, when the boss repeats 📄📄👉🖥️ by the board, looks like a second sending-back that happens off screen.
   - Visual cause: a missing cue. The top-right bar doesn't shrink in any frame you could read it from, and the second offence isn't shown at all.
   - Fix: make the stack shrink sheet by sheet as the player types, with the bar draining beside it. If the boss sends the player back again, show what the player did wrong in its own frame.

7. **Kev walking to the copier (run 6, 4:04).**
   - The reading: "it could be his routine."
   - What happened: it's a real reaction to the jam. He's on his way to fix it.
   - Visual cause: a missing cue. His "🖨️!" burst sits over his desk, not over him, so the bubble and the walk don't look linked.
   - Fix: attach the 🖨️❗ to Kev's own head, and give him a 🔧 bubble as he sets off.

8. **The scattered papers by Kev's desk (run 10, 5:00).**
   - The reading: "I can't tell who scattered the papers or why."
   - Visual cause: a missing cue. The papers appear with no source, right after the player stood at that desk, so they read as the player's doing. A reader will go looking for a mechanic here that the designer's ways don't describe.
   - Fix: if the player caused them, show it. If they're just set dressing, remove them.

9. **The ♪ bubble (runs 3, 6, 7, 9).**
   - The reading: "I can't tell if the ♪ means the player is acting innocent or is just flavour."
   - This doesn't change any cause, but it looks like a mechanic (the "pretend" key) that the reader can't work out.
   - Fix: show ♪ only while pretend is held, and in that state draw a softened outline on the player's sprite.

## Why fixable and not worse

Both win routes (runs 3, 4 and 7) were explained. Every loss was explained except run 9, which was partly. But beat 1 misled the reader about the main cause in this level: they decided the ding head-turn was routine and not a reaction to the player.

<!-- /cold-read:replay -->
