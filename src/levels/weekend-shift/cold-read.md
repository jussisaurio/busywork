# Cold reads: weekend-shift
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"d5523f0","hash":"d67e33d4971595cc595fa88b84db40b2a6f0b99887f3f3374523bd19edd46dcd","parts":{"card":"6bbe39894349922c7da06f1f9dd932cd451275ef244d85537d6a2051ccd5f4b5","premise":"9e00aea63379fbbffc109481daeeef84e01e29bbd1172586083373ebd9c93fc8","prompts":"e810e9318a4aa5a21d9654564c23dd898975d90252af2744b888b19de97df7bd"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit d5523f0, by claude -p (model: default). Inputs d67e33d49715: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 8 s | $0.03 |
| 2-review | report.md | 82 s | $0.41 |
| all | | 90 s (the steps add up to 90 s) | $0.44 |

### 1-card: first-read.md

**Situation:** It's Friday at 4 PM. At 5 PM the boss chooses someone to work Saturday. So I have one hour, and that's probably the length of the loop.

**What I must do:** Not be the one picked. Two readings:
1. Avoid getting picked: hide, leave, or look too busy.
2. Make sure someone else gets picked: frame a coworker or make them stand out.

**If I fail:** I work Saturday. I lose my weekend, and the loop restarts.

**Questions:**
- How does the boss pick? Visibility? Who looks busy? Who's still in the building? Random?
- Is just leaving early allowed, or is that a loss?
- Does a coworker have to take the shift, or can nobody get picked?
- Is pushing it onto someone else a win, or a sneaky loss?
- What do the icons mean? Calendar plus me sounds like "you on the calendar," which reads like the loss.
- The name "Weekend Shift": is it the Saturday shift itself, or me shifting the weekend onto someone else? Is there a pun I'm missing?

### 2-review: report.md

Verdict: fixable

**1. The card makes it sound like the boss chooses, but the board has already chosen.** "At 5:00 the boss picks" points at hiding, leaving or looking busy, and that is where first-read.md went. In the game the boss doesn't pick anyone. At 4:00 your face is already in Saturday's box, and at 5:00 he just reads it out. Players will spend their first loops typing at their desks to look busy, which does nothing. *Fix:* "Friday, 4:00 PM. You're down for Saturday. At 5:00 the boss reads it out." It names the trouble and gives away no tool.

**2. The boss reads out his own face and accepts it.** He wrote the roster, and the game shows no rule that makes the board binding. A real boss would wipe it. It's worse because from 4:50 he stands right beside the board "checking" it (`cast.js:23`, `checkRoster`) and still only notices at 5:00. The player sees him look at the board for ten minutes and then act surprised. *Fix:* from 4:50, have him stand with his back to the board, facing the room, and turn only to read. When he reads his own face, Lin and Kev clap 👏 straight away, so he's stuck with it in public.

**3. You prank-call the boss in plain view.** Your desk phone (Q, 7,13) sits in his line of sight through the glass. You stand up, lift the handset, his phone rings, nobody is on the line, and he never connects it to the one person standing at a phone. It's also odd that his phone is on a side table in the corner, away from his desk. That only exists because the puzzle needs it. *Fix:* put the phone next to the coffee machine, out of his view, or show his desk phone missing and him walking to the corner phone because "his" line rings there. Better still, let ringing him from your desk be something he could notice.

**4. The ding route depends on knowing the noodles exist.** Nothing on screen makes you want to heat noodles: no hunger, no bowl on your desk. The premise admits players find the route by trying it ("a restart away"). Once found, the countdown digits and the turning heads make it readable, but the first step is a guess. *Fix:* put a noodle cup on your desk at 4:00, and have Lin's 4:30 trip show the microwave being used before the player needs it.

**5. The name hints at the way out.** "Shift" suggests shifting the weekend onto someone else, and first-read.md picked up on it. That's a mild hint at the frame-a-coworker route. *Fix:* use something like "Saturday" or "Rota", which names the trouble only.

**Smaller issues:**
- The fish stinks: green wisps come off it and nobody reacts. That's a gag going to waste.
- The copier trap counts as the "ding" route in `write()` (`index.js:137`), so a fluke write during the beeping would show the microwave icon.
- Writing a second time cycles to Kev's face, and the player can't know that before trying.

**The joke:** at 5:00 the boss turns to read the board, goes red at his own face, and the end card shows him alone at a desk on a sunny Saturday. That beats framing Kev, but it only lands once problem 2 is fixed.

**Best thing:** two people stare at the board, and you clear their sightlines by making noise on the far side of the room: a ripple goes out, every view cone swings east, and you're at the board with six seconds to write.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"d5523f0","hash":"11cbaf7510ce7a8acd67ac1540115633af5f5a78570d6cd9e6cf4163f56f6c1b","parts":{"card":"6bbe39894349922c7da06f1f9dd932cd451275ef244d85537d6a2051ccd5f4b5","shots":"054265162c0666fa28503e32185ee40b1f4ffb81b587f4b13635200030919428","pictures":"54a725aa4cddc0d47efb1407b558c1548488ecea660c6615ad0a0d57b8bbb704","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit d5523f0, by claude -p (model: default). Inputs 11cbaf7510ce: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 98 s | $0.56 |
| 2-compare | report.md | 125 s | $0.60 |
| all | | 223 s (the steps add up to 223 s) | $1.15 |

### 1-read: reading.md

# Weekend Shift: cold read

**01** It's 4:00. A bald boss in a suit sits in a glass office. Three workers sit at desks below, one of them a red-haired woman with a red ring (me). An easel whiteboard shows *my* face in red, so I'm already the pick. The HUD has a calendar-plus-my-face icon, an empty hand slot and two empty slots I can't read.
**02** I'm at the easel with an E prompt. The boss gets a red "?" over a dark bar, and his orange view cone floods the floor. Touching the board is watched. I can't tell if the dark bar is a meter.
**03** I'm at the microwave with an E prompt. I don't know yet what it's for.
**04** I'm at the copier with an E prompt.
**05** A big "loop 1" stamp. I'm at my desk phone with red rings around me. Is that noise, or just the start-of-loop flourish?
**06** The microwave is running and glowing, showing 08. I read it as a countdown.
**07** The microwave shows 03 and I'm at the easel. The boss's "?" is back, so the microwave hasn't pulled him away yet.
**08** Everyone, the boss included, looks down at something in their hands, and his cone swings off the easel. The pretend key is lit and a fast-forward icon appears. My guess is the microwave went off, but I can't actually see that.
**09** I'm "whistling" (a ♪ thought bubble) while the board flips to the boss's face. A big boss portrait in a spiky red ring pops up. Is it a warning or a confirmation? I can't tell.
**10** The board now shows the green-jacket guy, but the boss has his "?" and his cone back on me. Too slow.
**11** I knocked my phone off the hook. A dotted line runs to the phone on the boss's side table, and he gets a ☎️! burst. Clear and funny.
**12** The boss walks over to his phone and leaves his red chair empty. I'm at the easel, out of his sight.
**13** 4:31. The teal coworker carries a lunch box toward the microwave. The boss has scratch lines, maybe confusion.
**14** Teal is at the microwave. I'm sipping a mug (pretend). Green has squiggle lines I can't read: a smell, annoyance?
**15** 4:35. The boss is on his side phone and I'm at my desk. So the call happens on its own? Seems like a routine, not my doing.
**16** Same moment. I'm at the easel swapping in the boss's face, ♪ again.
**17** The copier spits paper with a warning sign. Green shows "!" and leaves his desk.
**18** Green is at the copier. I'm at *his* desk, pretending (on his phone?). Why I'm there is unclear.
**19** The copier is jammed and I'm at the easel, but the boss's cone and "?" catch me. Green alone isn't enough cover.
**20** 4:56, red clock. The boss sits in a brown chair by the easel and the others walk over. A yellow chair has a dashed red outline. I'm still at my desk.
**21** 4:58. Everyone is gathered, and the boss's bubble shows a megaphone. Announcement time.
**22** Boss bubble: 👉 + my face. The board is half-hidden, so I can't tell which face it shows.
**23** The board shows the boss's face. His bubble: his own face + 😳. Good gag.
**24** The board shows green. The boss 👉 green, and green 😩.
**25** The board shows the boss's face, but I'm off at the microwave and the dashed chair is empty. Does skipping the meeting matter here?
**26 (win, green frame)** The boss is stuck at his desk on a sunny day, 😩. Icons: ✏️, boss, ⛱️. The filled slot shows a microwave "03" badge, so the microwave is the credited trick? That's odd when the board did the work.
**27 (win)** Same picture with green stuck. ✏️, green, ⛱️, and the microwave badge again.
**28 (loss, red frame)** I'm the one working Saturday. 🗓️, me, 😩. This is the default ending.
**29 (loss at 4:02)** The boss catches me at the board, 😠 burst, and I go 😳. ✏️, 😠, me. Caught editing means an instant loss.
**30 (loss)** I missed the meeting. The dashed empty chair, 👉, me. Absent means picked.

**Unclear overall:** the ⛱️ (my weekend, or theirs?), the dark bar under "?", the spiky portrait popup, the microwave badge in the win slots, and green's squiggles.

**Story:** The boss's whiteboard already says you're working Saturday. Rewrite it, but the boss watches the board, so you need him looking elsewhere: a phone call, a microwave ding, a jammed copier. Then show up to the 4:58 meeting like nothing happened. Skipping it gets you picked, and so does getting caught. The best ending is the boss reading his own name off the board and stewing through Saturday. The lesson seems to be "make the boss look away," but the microwave badge in the wins blurs which trick actually counted.

### 2-compare: report.md

Verdict: fixable

The player worked out the scheme and every ending. But three route-critical shots (08, 12, 19) teach the wrong lesson about who is watching and why, and two shots aren't clear about what the player caused (05, 15). I checked the images for every disagreement below.

- **01 start**: `reads`. Minor: the two empty HUD slots and the calendar-plus-face icon mean nothing yet, which is fine at 4:00.
- **02 board**: `reads`. The reading says "Touching the board is watched", which is right. Small issue: "I can't tell if the dark bar is a meter." The suspicion meter is an empty black capsule, so it looks like a prop. **Fix:** give the bar a visible outline and a sliver of red fill that grows.
- **03 microwave**: `partly` (cosmetic). Reading: "I don't know yet what it's for." Intent: you could heat noodles. **Cause: missing cue.** There are no noodles anywhere, and the hand slot is empty. **Fix:** put a noodle cup on the counter beside the microwave (or show one in the hand slot as you approach), so the action is clear before you press E.
- **04 copier**: `partly` (cosmetic). Reading: "I'm at the copier with an E prompt." Intent: you could jam it. **Cause: missing cue.** Nothing hints at "jam". **Fix:** a paper stack sitting crooked in the copier's tray when it's highlighted.
- **05 phone**: `partly`. Reading: "Is that noise, or just the start-of-loop flourish?" Intent: this phone can ring the boss's phone. **Cause:** the "loop 1" stamp lands on the same frame, and the player's red selection ring merges with the red ripple. There's also nothing linking this phone to the boss's phone. **Fix:** keep the stamp off interaction frames. When the phone is highlighted, draw a faint dotted preview line to the phone in the boss's corner.
- **06 noodles-cooking**: `reads`.
- **07 too-early**: `partly`. Reading: "The boss's '?' is back." Intent: both the boss's cone and Lin's cone cover you. **Cause: missing cue.** Lin's cone is a near-invisible grey wash, so the player only learns about the boss. **Fix:** draw coworker cones in a clear tint (e.g. teal for Lin) with an edge line, like the boss's.
- **08 ding**: `misread`. Reading: "Everyone, the boss included, looks down at something in their hands… My guess is the microwave went off, but I can't actually see that." Intent: DING, a ripple from the microwave, and every head and cone snaps east. **Cause: cause and effect too far apart, plus a misleading pose.** The ripple is a faint giant arc centred off-screen, and the microwave itself shows no burst. The turned sprites read as heads bowed over phones. Only the boss's cone visibly moves. **Fix:** put a bright 🔔 burst and tight concentric rings on the microwave itself. Give each person a small ❗ and an east-facing profile pose, and swing every cone visibly toward the kitchen. This is the level's core lesson, so it needs the most work.
- **09 written-boss**: `partly`. Reading: "Is it a warning or a confirmation? I can't tell." Intent: freshly written, and you whistle. **Cause:** the spiky red ring around the portrait uses the same language as the boss's ☎️! alarm burst and the 😠 burst. **Fix:** a soft white or gold ring with a pencil-scribble flourish, then the portrait shrinks into the Saturday box. Keep red spikes for danger only.
- **10 written-kev**: `partly`. Reading: "The board now shows the green-jacket guy, but… Too slow." Intent: the board was rewritten again with Kev's face. **Cause:** the success pop and the boss's returning "?" and cone are in the same frame, so the player reads failure. **Fix:** show the pop before the cone swings back, or have the "?" meter visibly start empty so it reads as "just turning back".
- **11 phone-ring**: `reads`. The reading calls it "Clear and funny."
- **12 lin-watches**: `misread`. Reading: "I'm at the easel, out of his sight." Intent: the boss is away, but Lin's cone covers you. **Cause: missing cue.** Lin's cone is grey and barely there, and Lin shows no reaction. **Fix:** a tinted cone for Lin (as in 07), and a "?" over Lin when you step into it. Without this, the phone route looks safe when it isn't.
- **13 lin-up**: `reads`. The boss's scratch lines are noise; drop them or make them mean something.
- **14 lin-fish**: `reads`. Note: Kev's squiggles ("a smell, annoyance?") are unreadable. If they're the fish smell, colour them green and have them drift from the microwave toward Kev.
- **15 phone-window**: `partly`. Reading: "So the call happens on its own? Seems like a routine, not my doing." Intent: the boss takes the call facing the window while Lin is at the microwave, so no cone touches the board. **Cause: cause and effect too far apart.** Your handset is back on its hook and there's no dotted line, so the window isn't credited to you. The reader also never notices that the board is unwatched. **Fix:** keep your handset off the hook with the dotted line live for the whole call. Briefly brighten the board while no cone covers it.
- **16 written-phone**: `reads`. The popup has the same red-spike problem as 09.
- **17 copier-jam**: `reads`.
- **18 kev-fixing**: `partly` (cosmetic). Reading: "Green is at the copier… Why I'm there [at his desk] is unclear." Intent: Kev kneels at the open copier, cranking a spanner. **Cause: missing cue.** Kev is shown standing with his back to us, with no open panel and no spanner, so it doesn't read as "busy for a while". **Fix:** a kneeling pose, an open front panel, a 🔧 bubble and the amber light.
- **19 mirror-fail**: `misread`. Reading: "Green alone isn't enough cover." Intent: the copier is behind the board, so a noise there pulls every eye *onto* the board. **Cause: cause and effect too far apart.** In top-down view the copier sits in a corner away from the board, so the player doesn't see that the boss's line of sight to it crosses the board. The player learns "more distractions", not "distract *away* from the board". **Fix:** draw the boss's gaze as a line from his eyes to the copier, passing over the board and flashing it. Or move the copier directly behind the easel so they line up on screen.
- **20 gather**: `reads`. The boss sits in a chair rather than standing, and the dashed outline is on a chair rather than the floor. Neither hurts.
- **21 reading-points**: `reads`.
- **22 reading-you**: `partly` (cosmetic). Reading: "The board is half-hidden, so I can't tell which face it shows." Intent: your face was on it. **Cause:** the boss's bubble covers the board. **Fix:** anchor the bubble on the side away from the board.
- **23 reading-boss**: `reads`. The reading calls it a "Good gag."
- **24 reading-kev**: `reads`.
- **25 away-at-five**: `partly`. Reading: "Does skipping the meeting matter here?" Intent: your chair is empty, outlined red, and that will be noticed. **Cause: missing cue.** Nobody reacts to the empty chair, so it looks harmless next to a winning board. **Fix:** Lin or Kev glances at the dashed chair with a small "?", so the absence clearly registers before the result.
- **26 end-win-boss**: `partly`. Reading: "The filled slot shows a microwave '03' badge, so the microwave is the credited trick? That's odd when the board did the work." They also can't tell whose weekend the ⛱️ is. Intent: a win, with the boss stuck working Saturday. **Cause: a glyph used as a prop, and the wrong frame.** The badge shows the microwave counting down, not the ding that actually covered you. The ⛱️ is a free-floating emoji with no owner. **Fix:** make the badge the microwave mid-DING with its ripple. Replace ⛱️ with your face under a parasol, so the row reads "pencil, boss, me at the beach".
- **27 end-win-kev**: `partly`. Same badge and ⛱️ problems as 26, same fix.
- **28 end-fail**: `reads`.
- **29 end-caught**: `reads`.
- **30 end-blamed**: `reads`.

**Biggest misreads to fix first:** 08 (the ding is the level's lesson and it's invisible), 12 and 07 (Lin's cone can't be seen, so the player doesn't know Lin is watching), and 19 (it teaches "pile on distractions" instead of "pull eyes away from the board"). Next, fix the red spiky "written!" popup (09, 10, 16) and the ownerless ⛱️ and ding badge in the wins.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"d5523f0","hash":"a12b80bbe4890cafcad8687bf7aa6743d875557c4a8aaab645f480248a1f04b3","parts":{"card":"6bbe39894349922c7da06f1f9dd932cd451275ef244d85537d6a2051ccd5f4b5","checks":"7eeb024a26c5c3997eb968c8ca7e15f66ee5ce73eba3f98ac09e9ffdcc126ca8","ways":"4dc666834a1820f5aac4bfcc6d40e04fbaad8911ebdd56cdf0d0f28ae4404fa7","frames":"71442768d072bf8dcd224fb9a0032c8e9a30400b02f974b2d3ba4d2a09f83a86","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit d5523f0, by claude -p (model: default). Inputs a12b80bbe489: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 181 s | $0.81 |
| 1-read-2 | reading.md | 83 s | $0.34 |
| 2-compare | report.md | 114 s | $0.41 |
| all | | 296 s (the steps add up to 378 s) | $1.55 |

### 1-read-1: reading.md

# Weekend Shift: reading

The card says: Friday 4:00, the boss picks who works Saturday at 5:00, and it mustn't be you. The whiteboard in the middle of the room has the player's red-haired face circled from the start of every loop.

## Run 1 (loss)
- 4:41: The player sits at the left desk. The teal coworker shows 🐟😊.
- 4:58: The boss is at the whiteboard and shows 📢. The others gather round.
- 4:59: The boss shows 👉 and the player's face.
- 5:00: The player walks over. The boss points 👉 and the player shows 😅.
- 5:01: The end picture shows the player at a desk with a paper stack, sunshine outside, and 😩. Icons: 🗓️ player 😩.

**Why it ended:** The board still had the player's face at 5:00. **Player's actions:** None recorded. Doing nothing loses.
**Might not be a reaction:** 🐟😊 and 📢 happen in every run, so they're routine.

## Run 2 (loss)
- 4:01: The player stands at the board. The **E do** prompt is lit, but the caption doesn't record a use. The boss and the teal coworker both show ❓. The boss's red view cone covers the board through the glass wall.
- 4:02: The boss shows a ❗😠 burst, with a red line to the player.
- End picture: the boss points angrily at the player. Icons: ✏️ 😠 player.

**Why:** The boss saw the player at the board. **Player's actions:** Walking into the boss's view. I can't tell whether they changed anything on the board.
**Might not be a reaction:** The teal coworker's ❓. They face the board all day.

## Run 3 (WIN)
- 4:06: The player uses the microwave on the right wall. A "10" timer starts.
- 4:12: There's a sound, probably the microwave finishing. The boss's head is turned to the side, and his cone points down-right, away from the board. The player is at the board.
- 4:14: The player uses the board, and it now shows the boss. The player has a ♪ bubble, which looks like whistling innocently.
- 4:41: 🐟😊 again.
- 4:58: 📢.
- 5:00: The boss shows his own face and 😳. The bearded green-shirt coworker shows 🎉, and the player dances. A microwave badge fills the first slot.
- End picture: the boss at the desk, 😩. Icons: ✏️ boss 🏖️.

**Why:** The board named the boss. **Player's actions:** The board swap, done while the boss was looking away.
**Might not be a reaction:** I can't confirm the ding turned the boss. He also faces other ways at other times, though run 5 suggests the timing mattered. The badge suggests the game counted the microwave.

## Run 4 (WIN)
This matches run 3 up to 4:14, when the board shows the boss.
- 4:16: The player uses the board again, and it now shows the bearded coworker.
- 4:41: 🐟😊. 4:58: 📢.
- 5:00: The boss points 👉 at the bearded coworker, who shows 😩. The player shows 🎉. The microwave badge appears.
- End picture: the bearded coworker at the desk. Icons: ✏️ bearded coworker 🏖️.

**Why:** The board named the bearded coworker. **Player's actions:** The microwave, then two board uses. Each use moves the board to the next face.
**Might not be a reaction:** Same doubt about the boss's turn as in run 3.

## Run 5 (loss)
- 4:06: The player starts the microwave.
- 4:11: The player is at the board while the microwave still reads 03. The boss faces the room through the glass and shows ❓. The teal coworker also shows ❓.
- 4:11: ❗😠, with a red line to the player.
- End picture (4:12): the same angry boss picture as run 2.

**Why:** The player was seen at the board. **Player's actions:** Going to the board before the microwave finished. This is the clearest evidence that the ding matters, but it's still timing, not proof.

## Run 6 (loss)
- 4:02: The player uses the top-left photocopier. A ♪ bubble appears near it. The bearded coworker already shows ❗.
- 4:03: There's a sound. The copier spews paper and shows a grey ♪ bubble. The boss turns his head left.
- 4:03: The player is at the board. The boss's cone now points down-left, toward the copier, and covers the board. The boss and the teal coworker show ❓. The bearded coworker walks toward the copier with ❗.
- 4:04: ❗😠, with a red line to the player.
- 4:04: There's a second sound with no source I can see.
- End picture (4:05): the angry boss picture.

**Why:** The board sits between the boss and the copier. The noise turned his eyes straight onto the player, and that's funny. **Player's actions:** Using the copier, then standing at the board.
**Might not be a reaction:** The bearded coworker's ❗ at 4:02 comes before the recorded sound.

## Run 7 (WIN)
- 4:32: The player lifts the receiver on their own desk phone. The boss's office phone rings (☎️❗). The teal coworker is carrying a dish.
- 4:33: Another ring. The boss walks to the phone.
- 4:34: The boss is at the phone with ❓. The teal coworker is at the microwave. The player is at the board.
- 4:35: The player uses the board, and it shows the boss. ♪ bubble.
- 4:39: The boss walks back with 😠.
- 4:41: 🐟😊.
- 4:58: 📢.
- 5:00: The boss shows 😳 and his own face. The bearded coworker shows 🎉. A phone badge fills the second slot.
- End picture: the boss at the desk. Icons: ✏️ boss 🏖️.

**Why:** The board named the boss. **Player's actions:** The fake call, then the board swap.
**Might not be a reaction:** The teal coworker away at the microwave is probably their own lunch routine, since 🐟😊 follows in every run. Their being out of the way may have helped.

## Run 8 (loss)
- 4:01: The player makes the fake call. Ringing.
- 4:02: The boss walks to the phone. Another sound.
- 4:02: The player is at the board, inside a red cone coming from the seated teal coworker. The teal coworker shows ❓, and the boss at the phone shows a small ❓.
- 4:03: The teal coworker bursts "❗👉 player", with a red dashed line to the player, who is now back at their desk. Paper flutters at the board. A paper stack appears on the player's desk, and a red paper bar appears top right. The boss's bubble shows 📄📄👉🖥️.
- 4:08: The boss walks back with 😠.
- 4:41 to 5:00: Same as run 1. The board still shows the player.
- End picture: same as run 1.

**Why:** The board still named the player at 5:00. **Player's actions:** No board use is recorded, so the swap apparently never happened. The teal coworker reported the player, and that seems to have sent the player back to the desk with extra work. I can't tell whether the player walked back or was sent.
**Might not be a reaction:** The boss's 📄📄👉🖥️ might be the phone call itself rather than a reaction to the report.

### 1-read-2: reading.md

# Weekend Shift: cold read

Card: it's Friday at 4:00 PM, and at 5:00 the boss picks who works Saturday. The goal is to not be picked. The whiteboard in the open office already shows **the player's face** at 4:06 in both runs.

## Run 9: LOSS

- **4:06** The player uses the coffee machine. Its display reads "10".
- **4:12** Sound. The teal-shirt coworker has squiggle lines (a sneeze or scratch). The player stands at the whiteboard and an "E" prompt appears.
- **4:14** The player uses the whiteboard, and it now shows **the boss's face**. The player shows a 🎵 bubble.
- **4:41** The player is back at the coffee machine, which reads "00". The teal coworker shows 🐟😊.
- **4:58** The boss holds a meeting at the whiteboard (📢). Both coworkers sit down. The yellow chair is empty and outlined in dashes. The player is still at the coffee machine.
- **4:59** The boss shows a bubble with his own face and 😳.
- **5:00** Everyone shows a "player-face ?" bubble, then points 👉 at the player's face. The player shows 😰 from across the room.
- **5:01** End card: the empty chair is circled, the boss is pointing, and the icons read: empty chair, 👉, player.

**Why it was lost:** the player missed the meeting, and the empty seat got picked. **Cause:** the player stayed at the coffee machine through 4:58–5:00. Swapping the whiteboard face flustered the boss but didn't change who he picked.

**Possibly not reactions:** the 4:12 squiggle and the 4:41 🐟😊 both happen again in Run 10, so they're routines. I can't tell what the coffee machine's 10→00 countdown does. Nothing visible came of it.

## Run 10: LOSS

- **4:06** The player uses the coffee machine ("10").
- **4:12** Sound: the same teal squiggle as Run 9.
- **4:41** The player uses the copier. Paper sprays out and a ⚠ icon appears on it. The olive-jacket coworker shows ❗ and the player shows 🎵.
- **4:42–4:48** The olive coworker walks to the copier, which gives off red sound rings. The player sits at the olive coworker's empty desk.
- **4:50** The copier is back to normal and the olive coworker shows 😊.
- **4:58** The meeting starts and the yellow chair is empty. The player is still at the olive coworker's desk.
- **4:59** The boss points 👉 at the player's face. The whiteboard still shows the player.
- **5:00** The player is suddenly standing next to the chair with 😅. Loose papers lie under the olive coworker's desk.
- **5:01** End card: the player at a desk with a paper stack, sun outside, 😩. Icons: 🗓️, player, 😩.

**Why it was lost:** the boss picked the player. I can't tell whether the face on the whiteboard decided it, or arriving late, or both. **Cause:** the pick came at 4:59, while the player was away from the meeting.

**Possibly not reactions:** the olive coworker's ❗ and the walk to the copier look caused by the jam, since there was no ❗ in Run 9. I can't tell what the papers on the floor at 5:00 mean, or how the player got across the room in one minute.

### 2-compare: report.md

Verdict: fixable

# Weekend Shift: cold-read report (runs 1–10)

## Runs

**Run 1 (fail: your face is still on the board): explained.**
The reader saw the board still showing the player at 5:00 and the empty-desk Saturday picture: "Doing nothing loses." They were also right to set aside 🐟😊 and 📢 as routine.

**Run 2 (caught writing in plain sight): partly.**
- **Reading:** "The boss saw the player at the board… I can't tell whether they changed anything on the board."
- **What happened:** The player started writing inside the boss's cone and was caught for writing, not for standing there.
- **Visual cause (missing cue):** The 2.5-second write is never drawn. The board looks the same between 4:01 and 4:02. Only the ✏️ on the end card hints at it, and the reader didn't link the two.
- **Fix:** While a write is in progress, draw a half-scribbled face on the board with a pen at it. If the player is caught, freeze that scribble into the ❗😠 frame and the end picture.

**Run 3 (win via the ding): partly.**
- **Reading:** "There's a sound, probably the microwave finishing. The boss's head is turned to the side… I can't confirm the ding turned the boss."
- **What happened:** The ding turned every head and cone east for about 6 seconds, and the player wrote the boss's face while all of them were turned away. The ding is the whole scheme.
- **Visual cause (missing cue):** At 4:12 I checked `runs/run-03/02.png`. There is no ripple from the microwave, and nothing at the microwave says "ding". Only the boss's cone has visibly swung. Lin's turn is drawn as a few squiggle lines.
- **The reader still knows why they won:** the board named the boss, and the player swapped it while he looked away. That is why this is partly, not broken.
- **Fix:** In the ding frame, draw rings spreading from the microwave with a 🔔 burst on it. Give every cone a dashed arrow from its old direction to the microwave.

**Run 4 (win via the ding, written twice → Kev): partly.**
- **What the reader got right:** "Each use moves the board to the next face." That is correct.
- **What they doubted:** "Same doubt about the boss's turn as in run 3."
- **Visual cause and fix:** The same as run 3.

**Run 5 (caught writing before the ding): explained.**
The reader saw the microwave still at 03, the board in the boss's view, and ❗😠. They called it "the clearest evidence that the ding matters." This failure teaches its lesson.

**Run 6 (copier trap, caught): explained.**
"The noise turned his eyes straight onto the player, and that's funny." The reader got the joke the designer intended.

**Run 7 (win via the phone): explained.**
The reader named the fake call and the board swap. Lin's part is only half seen; see beat 4.

**Run 8 (told on by Lin, then fail): explained.**
The reader named all of it: "The teal coworker reported the player," the swap never happened, and the board still named the player at 5:00. What happened to the player in between is muddy; see beat 5.

**Run 9 (blamed, away from the board at 5:00): explained.**
"The player missed the meeting, and the empty seat got picked… stayed at the coffee machine through 4:58–5:00." This is correct. The reader also read the boss's 😳 at his own face correctly.

**Run 10 (fail: nobody wrote on the board): partly.**
- **Reading:** "The boss picked the player. I can't tell whether the face on the whiteboard decided it, or arriving late, or both. **Cause:** the pick came at 4:59, while the player was away from the meeting."
- **What happened:** The player never wrote on the board, so their face stayed on it. Being late had nothing to do with it.
- **Visual cause (an effect with no visible cause):** At 4:58 the player is at Kev's desk. At 5:00 they are standing in their place at the board (`runs/run-10/12.png`), with no walk and no summons drawn. The reader concluded that "away" mattered and gave the board second place. The boss's 👉 at 4:59 is aimed while the player's place is empty, which makes it look like it's about the absence.
- **Fix:** Don't move the player at 5:00. Have the boss's 👉 draw a line to the face on the board, and have the board's Saturday box glow red on that face, so the pick is plainly read off the board. Keep the red outline on the empty place for the blamed ending only.

## Beats that misled the reader

**1. The ding turns heads, but it reads as a sneeze (runs 3, 4, 9, 10).**
- **Reading (runs 9–10):** "Sound. The teal-shirt coworker has squiggle lines (a sneeze or scratch)." Also: "I can't tell what the coffee machine's 10→00 countdown does. Nothing visible came of it."
- **What happened:** This is the microwave ding, and Lin's head snaps toward it. It's the core mechanic of the level, and the reader of runs 9–10 never found it. That reader also took the microwave for a coffee machine.
- **Visual cause:** The turn is drawn as a twitch, not as a cone moving, and nothing on the microwave says "ding". There is also no picture link between the microwave and the noodles.
- **Fix:** Use the rings, 🔔 and cone arrows from run 3. Also give the microwave a 🍜 with steam above it while it counts down, so it can't be read as a coffee machine.

**2. Kev's ❗ at the jam was doubted as a reaction (run 6).**
- **Reading:** "The bearded coworker's ❗ at 4:02 comes before the recorded sound."
- **What happened:** It's a real reaction. The jam beeps at once and Kev heads off to fix it.
- **Visual cause (a cue that can be read the wrong way):** The first beep isn't drawn. The only mark near the copier is the player's own ♪ bubble, which the reader took for the copier's sound ("A ♪ bubble appears near it").
- **Fix:** In the jam frame, draw red beep arcs coming off the copier, and give Kev's ❗ a short dashed line to the copier. Don't show the player's ♪ "innocent whistle" while they are standing at the thing they just broke.

**3. A "sound with no source" (run 6, and runs 8 and 10 the same way).**
- **Reading:** "There's a second sound with no source I can see."
- **What happened:** It's the copier's repeat beep, every 2 seconds.
- **Visual cause (missing cue):** The beep arcs don't appear in every frame where the caption says "you hear a sound".
- **Fix:** Draw the source arcs in every frame that has a sound, with the copier's light flashing red.

**4. Lin's lunch trip read as background, not as the window (run 7).**
- **Reading:** "The teal coworker away at the microwave is probably their own lunch routine… Their being out of the way may have helped."
- **What happened:** Lin's 4:30–4:37 trip to the microwave is half of the phone route. Run 8 shows she reports the player if she's at her desk.
- **Visual cause (missing cue):** The two runs are compared only in the player's head. Nothing shows that Lin's cone has left the board.
- **Fix:** When Lin stands at the microwave, draw her cone pointing at the wall, plainly off the board. Leave a faded "cone ghost" over her empty desk so its absence can be seen.

**5. The boss's order read as phone talk, and the player was moved with no cue (run 8).**
- **Reading:** "The boss's 📄📄👉🖥️ might be the phone call itself rather than a reaction to the report." Also: "I can't tell whether the player walked back or was sent."
- **What happened:** It's the boss's reaction to Lin's ❗👉. He sends the player back to type for 20 minutes.
- **Visual cause (a bubble that reads as part of the call):** The bubble appears in the far corner while the boss holds the handset. The player is already back at their desk in the same frame, with no walk drawn.
- **Fix:** Have the boss turn toward the office, with a dashed line from his 📄📄👉🖥️ to the player. Show the player walking back with a 😞, and have the paper stack drop onto their desk.

**6. The teleport at 5:00 (run 10).**
- **Reading:** "How the player got across the room in one minute."
- **What happened and why it matters:** This is the main reason run 10 is only partly explained. See the fix under run 10.

**7. Loose papers under Kev's desk at 5:00 (run 10).**
- **Reading:** "I can't tell what the papers on the floor at 5:00 mean."
- **What happened:** They're left over from the jam: Kev's cleared sheets, or debris from the player's visit. They don't affect the ending.
- **Visual cause:** A leftover object that looks like a clue.
- **Fix:** Either clear the jam paper when Kev fixes the copier, or keep it at the copier, where the reader can trace it.

<!-- /cold-read:replay -->
