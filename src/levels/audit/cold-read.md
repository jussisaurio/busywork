# Cold reads: audit
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"d101e48805aeed081111ef278f6f5c10dadbfc6ec5a3d445548622100cc85af5","parts":{"card":"4b52a7f6e3554225a82fd8672fef82b64554e3989e1b4f7dcfe4dadfddd8203d","premise":"7e084a22cbfe9d13f93f23c8db965a217c9dbc3e5cd3de26c8e60180aab8d9f3","prompts":"c2886f589c84ff30cad9e05d737f4d22d2f634d9aba125f62e9ac2a88edc579e"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs d101e48805ae: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 13 s | $0.02 |
| 2-review | report.md | 110 s | $0.46 |
| all | | 123 s (the steps add up to 123 s) | $0.48 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM in an office. At 3:30 someone, presumably an auditor ("him"), will count laptops. There should be four, but I sold mine, so there are three.

**What I must do:** Make him count four. Two readings:
1. Actually produce a fourth laptop: borrow, steal or buy one back.
2. Fool the count: move one laptop so it gets counted twice, or pass off a fake (a closed box or tray).

**If I fail:** Not stated. I'd guess I get caught and fired. The icon row might show it.

**Questions:**
- Who is "him"? The auditor, my boss? Will I recognise him?
- Four where: in the room, on four desks, or in my team? Whose are the other three?
- Does he count while walking desk to desk, or in one place? That decides whether double-counting works.
- Would a fake pass, or does he open them or check serial numbers?
- Is the buyer in the building?
- Does the clock run in real time?
- Is "The Audit" a formal audit or just a boss checking on us? The name only restates the card. It adds no joke or hint.

### 2-review: report.md

Still reading the level's source files. I've checked the schedules, routes and end scenes, and now I'm writing the report.

Verdict: fixable

**1. You can't see Kev's second stop before you need it.** The Kev route depends on Kev stopping at your desk again on his way back from coffee, and on his desk being counted after yours. But a missing laptop fails the check (`fail: { then: 'caught' }`, index.js:117) and ends the day at your cross at 3:40.2. Kev reaches your desk at 3:40.7, half a game minute later. In a losing loop you never see that second stop or Kev's desk being counted. Only his lunch wave hints at it, so the level's best route is found by trial and error.
*When:* every failed loop cuts off just before the moment you need to see.
*Fix:* let the auditor finish his whole list and fire you at the sign-off. The first loop then shows the order of all four desks and Kev's second stop.

**2. The card gives away the trick.** "Make him count four" points at fooling the count, and first-read.md suggested "moved so it gets counted twice" from the card alone. "Him" also has no antecedent, and the auditor doesn't appear until 3:25.
*When:* before the first loop starts.
*Fix:* name only the trouble, for example "3:00 PM. Laptop audit at 3:30. Every desk needs one. / You sold yours."

**3. Lin's route steals a laptop from under his eyes.** He looks at Lin's desk for 3.5 s, longer than at any other desk (index.js:112) for no reason you can see. You unplug at 3:36.1, while he is still facing that desk (`audit_lin`, face S). The rules allow it because you are outside his cone, but on screen it looks like the auditor is blind. The longer look is also there only for the puzzle.
*When:* the first time you try the Lin route.
*Fix:* after each tick he bends his head over the clipboard to write. Make that a visible pose, and make it last longer at Lin's desk because her desk has a visible reason (a missing asset tag, say).

**4. People find their laptop gone and say nothing.** At 3:39.7 Lin sits down to an empty desk, thinks 💻❓, and stays quiet while an auditor is a few steps away. On the boss route the boss's laptop sits on your desk during the sign-off and he never looks for it. Winning only lasts as long as people stay oddly calm.
*When:* right after the Lin win; at the sign-off on the boss route.
*Fix:* keep the owners away until after 3:46. Lin could stay at the coffee machine chatting, and the boss could stay in the lobby.

**5. The level breaks an engine rule.** The engine says an action on someone's thing is sneaky only to its owner. Here `pick_up` is sneaky to anyone, and Lin reports you for taking the boss's laptop (route-checks.js:62). A player who learned the engine rule will feel cheated.
*When:* the early boss attempt, 3:08–3:16.
*Fix:* set up the rule change on screen first, for example the auditor's coffee-machine stop where he visibly scans the floor. Or make the 3:08 window blocked for a reason you can see, like the boss smoking while facing his own glass.

**Smaller points:**
- Seven desks are visible; which four count is only clear by watching.
- premise.md says Lin "back at 3:24", but the code sets her off from the restroom at 3:19. She arrives about the same time, so this is a premise wording fix, not a bug.

**Stakes:** the logic holds. Four ticks means the audit passes, and the end picture with the box makes the threat clear.

**Best thing:** Kev, puzzled, carries his own laptop home behind the auditor's back, and it gets counted twice thanks to him. Keep that beat and the humming 🎵 win picture.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"a864132","hash":"6faf68d38c442ed4821980fc5560d162e72d645db72a49548acdb10cad57e984","parts":{"card":"4b52a7f6e3554225a82fd8672fef82b64554e3989e1b4f7dcfe4dadfddd8203d","shots":"b057d82ea233af998a7fff7debeaa59658a69b75ba2e868c3ebc4abf41c3d102","pictures":"6f1d586890a83ccf93b86102b3d60478eed61157d122365993ffad62d5dedbbe","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit a864132, by claude -p (model: default). Inputs 6faf68d38c44: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 84 s | $0.54 |
| 2-compare | report.md | 131 s | $0.57 |
| all | | 215 s (the steps add up to 215 s) | $1.12 |

### 1-read: reading.md

# Reading: The Audit

**Card:** It's 3:00, a laptop audit is at 3:30, there should be four laptops and I sold mine. "Make him count four" tells me the auditor is a man.

1. **3:01.** I'm the person in red at the middle desk, with a red ring under me. A bald man in navy sits in the gold-rug office. A woman in teal and a man in a spiky green jacket sit at desks with small laptops. My desk has only a keyboard. *I'm the one without a laptop.*
2. **3:09.** The bald man walks out, and his cone of sight sweeps the room. Green Jacket waves 👋 at me. I'm holding papers and the "pretend" key is lit. *I fake working while the boss walks past.*
3. **3:12.** The bald man is in a grey tiled room beside a small round thing (an ashtray?). Green Jacket heads that way. *That's his break spot.*
4. **3:15.** Green Jacket is now in the grey room too. Teal walks up to my desk. There's a dark shape in the bottom door. *Can't read why she comes over.*
5. **3:14.** I'm at Green Jacket's empty desk with a ✋ bubble. *An empty desk means I can grab what's on it.*
6. **3:16.** The hand slot shows a laptop and I'm walking with a blue-and-red bubble. **Can't read that glyph:** a bed? An inbox? A scoop of ice cream?
7. **3:22.** Green Jacket comes back waving 👋 while I fake work.
8. **3:22, another loop.** Green Jacket is carrying his laptop with a "💻!" bubble. *Alarm, or "got it back"? Unclear.*
9. **3:24.** A laptop sits on my desk with a ✋ bubble. A thought cloud above Teal's desk reads "💻?" with a small bulb under it. The bald man has lines coming off him. *She's missing hers? Is he hearing something, or asleep?*
10. **3:29.** A grey woman with a bun and glasses comes in by the printer. Green Jacket is in the kitchen with coffee. *Is this the auditor? The card said "him."*
11. **3:32.** The clock turns red. She's at the boss's desk with a sign reading 💻✓, and a green check badge appears on the desk. *Each tick is one laptop counted.*
12. **3:34.** She leaves with a clipboard. The boss walks to Teal's desk.
13. **3:36.** Teal's desk gets ✓. The boss is back in the grey room.
14. **3:41, end card (loss).** Bun Woman points at me as I leave by the elevator holding a box with a plant in it. My desk's sign reads 💻✗. Icons: her, 👉, me, 📦. *I got fired. Clear and funny.*
15. **3:35.** I'm sitting at the boss's desk holding a laptop, with the same mystery glyph. The auditor is at the door.
16. **3:40.** My desk gets 💻✓ while Green Jacket hovers nearby.
17. **3:36.** I'm standing next to Teal's desk holding a laptop while it gets counted. *Am I swapping laptops between desks?*
18. **3:39.** A laptop is on my desk with ✋, Teal is thinking "💻?", and the auditor is arriving.
19. **3:26.** I'm at Green Jacket's desk holding a laptop, mystery glyph again. He's in the kitchen.
20. **3:40.** Same as 16.
21. **3:40.** Green Jacket marches toward the auditor carrying a laptop with "💻!". *He's bringing his own laptop to be counted.*
22. **3:43.** Green Jacket's desk gets ✓. Bun Woman's bubble reads "💻😊" and all four desks have checks.
23. **3:46.** She smiles 😊. The boss heads back.
24. **Win card.** I'm at my desk with a laptop and she's beaming while the boss smokes behind glass. Icons: boss, 🚬, 💻, ✓, ✓. *His laptop got counted twice while he was smoking.* He goes in the first of three slots.
25. **Win card.** Teal walks off with coffee, humming ♪. Icons: her, ☕, 💻, ✓✓. *Second way to win: her laptop counted twice while she got coffee.*
26. **Win card.** Green Jacket carries his laptop over while humming. Icons: 💻 ✓✓, him, ♪. *Third way to win: he carried it to be counted again.*
27. Same picture as 14.
28. **3:37 loss.** The desk has a teal chair and a plant, and the sign reads 💻✗. *Got caught at someone else's desk?*
29. **3:31 loss.** A spiky "💻!" burst, with a laptop on the floor between us. *Caught carrying it.*
30. **3:46 loss.** My desk has a laptop, but she thinks "me?" and looks angry 😠. Icons: her, 😠, 🪑, 📦. *I wasn't sitting at my desk. Very readable.*

**Problems:**
- "Him" on the card doesn't match the auditor, who looks like a woman with a bun.
- I never worked out the blue-and-red glyph.
- The bald man's lines are ambiguous.
- Wins 24 and 26 read in different orders: 24 goes person → laptop → ✓✓, while 26 goes laptop → ✓✓ → person.

**Story:**
I sold my work laptop and an auditor is coming to count them. Everyone has a daily routine: the boss's smoke break, Teal's coffee run, Green Jacket wandering off. I learn to grab a laptop while its owner is away, so the same machine gets counted twice. If she catches me holding it, or finds my chair empty, I'm walked out with a box. If I'm sitting at my desk looking busy when she counts, she leaves happy with four, and nobody notices one was counted twice.

### 2-compare: report.md

Verdict: fixable

The reader worked out the scheme: an owner leaves, you move their laptop, and the auditor counts it twice. They also understood all three wins and every loss. Four shots that teach a route are misread, though. The auditor reads as a woman when the card says "him". The boss's second smoke break reads as him walking to Lin's desk. Lin's restroom trip reads as her coming over to you. And the "caught" moment is never seen in the office, because the end card covers it. The reader also never decoded the put-down/unplug glyph, which appears in 06, 15 and 19.

- **01 start** — `reads`. "My desk has only a keyboard. I'm the one without a laptop." That's the point.
- **02 kev-waves** — `partly`.
  - Reading: "Green Jacket waves 👋 at me… I fake working while the boss walks past."
  - Intent: Kev waves goodbye and leaves for lunch, and his laptop stays on his desk.
  - Cause: missing cue. Kev waves while still seated, so it reads as a greeting rather than "I'm off". And the boss walking through the same frame takes the reader's attention.
  - Fix: have Kev stand up with a jacket or lunch bag, and make his bubble 👋🥪 point toward the lift.
- **03 boss-smokes** — `partly`.
  - Reading: "beside a small round thing (an ashtray?)… That's his break spot."
  - Intent: the boss is smoking in the lobby, and Lin is watching his empty office through the glass.
  - Cause: a glyph used as a prop. The ashtray is a tiny grey dot with no smoke, so "smoking" is only guessed. Lin's view cone into the office is never noticed, yet it is the guard on the boss route. Kev wandering into the lobby in the same frame also muddies whose break spot it is.
  - Fix: give the boss a cigarette with a visible smoke curl. Briefly tint Lin's cone and put a 👀 bubble on her, aimed at the boss's desk.
- **04 lin-restroom** — `misread`.
  - Reading: "Teal walks up to my desk… Can't read why she comes over."
  - Intent: Lin walks off to the restroom, and her laptop stays on her desk.
  - Cause: cause and effect too far apart. The shot catches her mid-route, right beside your desk, while the 🚻 sign sits small in the far corner.
  - Fix: show a 🚻 bubble on Lin as she stands up. Take the screenshot near the restroom door, not at your desk.
- **05 kev-laptop** — `reads`.
- **06 put-down** — `partly`.
  - Reading: "Can't read that glyph: a bed? An inbox? A scoop of ice cream?"
  - Intent: you can put Kev's laptop down on your desk.
  - Cause: a glyph used as a prop. The blue-and-red tray carries no meaning.
  - Fix: replace it with a laptop over a desk edge plus a ⬇ arrow. Use the same family of icons for unplugging (laptop + ⬆), so 15 and 19 read too.
- **07 kev-back-wave** — `reads`.
- **08 kev-takes-it-back** — `partly`.
  - Reading: "Alarm, or 'got it back'? Unclear."
  - Intent: Kev picks his laptop up off your desk and takes it back to his own desk.
  - Cause: cause and effect too far apart. The laptop has already left your desk, so the "from your desk" part is lost, and 💻! alone could mean alarm.
  - Fix: take the screenshot as he lifts it from your desk. Or change the bubble to 💻 + a small "mine" arrow pointing at his own desk.
- **09 lin-misses-it** — `reads`. The boss's motion lines are noise ("hearing something, or asleep?"). That's worth cleaning up, but it doesn't change the reading.
- **10 auditor-arrives** — `misread`.
  - Reading: "A grey woman with a bun and glasses… Is this the auditor? The card said 'him.'"
  - Intent: a man in a grey suit with glasses and a badge is drinking coffee by the machine.
  - Cause: missing cue, plus a contradiction. The topknot reads as a woman's bun. There is no visible badge or coffee, and the machine reads as a printer. This is the one character the card names, and the picture argues with it.
  - Fix: give him short hair or a bald patch, a tie, a visible lanyard badge and a cup in hand. Add steam to the machine so it reads as coffee.
- **11 tick-boss** — `reads`. "Each tick is one laptop counted."
- **12 boss-leaves** — `misread`.
  - Reading: "She leaves with a clipboard. The boss walks to Teal's desk."
  - Intent: the boss goes out for another smoke and leaves his laptop behind, while the auditor moves on to Lin's desk.
  - Cause: cause and effect too far apart. The shot catches the boss on the path that runs past Lin's desk, while the auditor is still in the office. The movements of the two men are swapped in the reader's head. This break is the opening for the boss route.
  - Fix: give the boss a 🚬 bubble as he leaves. Take the screenshot once he's at the lobby door and the auditor is walking toward Lin.
- **13 tick-lin** — `partly`.
  - Reading: "Teal's desk gets ✓. The boss is back in the grey room."
  - Intent: the tick lands while Lin is away at the coffee machine, and her laptop stays behind.
  - Cause: missing cue. Lin's absence goes unnoticed, though it's the opening for the Lin route.
  - Fix: show Lin in frame at the machine with a ☕ bubble. Or show her chair visibly empty, with a dashed outline where she sits.
- **14 cross-you** — `misread`.
  - Reading: the reader describes the end card instead ("I got fired").
  - Intent: in the office, the sign shows 💻✗, the auditor bursts out angry, and his cone turns red on you.
  - Cause: missing cue. The loss card covers the moment of being caught, so the screenshot is identical to 27. The player sees the sentence but not the crime.
  - Fix: hold the in-world beat (💻✗ sign, red cone, angry burst) for about 1.5 s before the card slides in.
- **15 boss-grab** — `partly`.
  - Reading: "sitting at the boss's desk holding a laptop, with the same mystery glyph."
  - Intent: you unplug the boss's laptop, which is already ticked, while nobody is watching.
  - Cause: a glyph used as a prop (the same tray as 06). "Already ticked" also isn't connected to "this is why it's safe".
  - Fix: use the unplug icon (laptop + ⬆). Make the green sticker pulse when you're next to a ticked desk.
- **16 boss-recount** — `partly`.
  - Reading: "My desk gets 💻✓ while Green Jacket hovers nearby." The reader then says 20 is "the same as 16".
  - Intent: the boss's laptop is now on your desk, and his desk keeps its sticker with no laptop on it.
  - Cause: missing cue. All laptops look identical, so whose laptop is being double-counted can't be read. The boss's desk, now empty but ticked, is too small to notice.
  - Fix: give each laptop its owner's colour (a navy lid for the boss, teal for Lin, olive for Kev). Then the boss's laptop sitting on the red desk tells the story by itself.
- **17 lin-grab** — `partly`.
  - Reading: "standing next to Teal's desk holding a laptop while it gets counted. Am I swapping laptops between desks?"
  - Intent: he has just ticked her desk, and you take the laptop behind his back.
  - Cause: missing cue. The auditor isn't visible in the shot, so "behind his back" can't be read. The 💻✓ sign still showing makes it look like you're grabbing during the count.
  - Fix: take the screenshot after the sign has gone, with the auditor in frame walking away and his cone pointing away from you.
- **18 lin-back** — `partly`.
  - Reading: "Teal is thinking '💻?', and the auditor is arriving."
  - Intent: there is also a near miss. The auditor gives a brief "?" because he almost saw you carry it.
  - Cause: missing cue. His "?" isn't in the screenshot, so the near-miss tension doesn't come across.
  - Fix: show a yellow "?" over the auditor, with his cone briefly turning amber where you just were.
- **19 kev-grab** — `reads`. The meaning comes across. The glyph is still unreadable (see 06).
- **20 kev-tick-you** — `partly`.
  - Reading: "Same as 16."
  - Intent: this time it's Kev's laptop on your desk, and Kev is walking back.
  - Cause: identical laptops again, as in 16. This and 16 can't be told apart.
  - Fix: colour-code laptops by owner (see 16).
- **21 kev-fetch** — `partly`.
  - Reading: "Green Jacket marches toward the auditor… bringing his own laptop to be counted."
  - Intent: he takes it back from your desk to his own, unchecked desk.
  - Cause: cause and effect too far apart. He has already left your desk and seems to be heading toward the auditor. The reader's model still produces a win, but it's the wrong mechanism.
  - Fix: take the screenshot at the moment he lifts it from your desk, with an arrow or his gaze pointing at his own desk.
- **22 kev-fourth** — `reads`.
- **23 sign-off** — `partly`.
  - Reading: "She smiles 😊. The boss heads back."
  - Intent: the auditor comes back to your desk to sign it off and smiles at you because you're sitting there.
  - Cause: missing cue. Nothing ties the smile to your being in the chair, so the rule behind loss 30 isn't taught here.
  - Fix: have him tap your desk or nod at you with a 🪑✓ or 👤✓ bubble before 😊.
- **24 end-win-boss** — `reads`.
- **25 end-win-lin** — `reads`.
- **26 end-win-kev** — `partly` (cosmetic).
  - Reading: "24 goes person → laptop → ✓✓, while 26 goes laptop → ✓✓ → person."
  - Intent: the row as written.
  - Cause: the icon grammar is inconsistent across the three wins.
  - Fix: order every win row as person → their exit icon → 💻 → ✓✓.
- **27 end-caught-your-desk** — `reads`. "I got fired. Clear and funny."
- **28 end-caught-lin-desk** — `partly`.
  - Reading: "Got caught at someone else's desk?"
  - Intent: you moved Lin's laptop before her desk was counted.
  - Cause: missing cue. The card is the generic firing picture with a teal chair swapped in, so the icon row says nothing about "too early".
  - Fix: change the row to Lin's desk → 💻✗ → ⏰ (or a clipboard with an unticked line) → 📦.
- **29 end-caught-seen** — `reads`.
- **30 end-blamed** — `reads`. "I wasn't sitting at my desk. Very readable."

**Priorities:**
1. Redraw the auditor as a man (10), so he matches the card.
2. Fix the put-down/unplug glyph (06, 15, 19).
3. Colour-code laptops by owner (16, 20).
4. Retime the screenshots so cause and effect share a frame (04, 08, 12, 17, 21), and hold the caught beat before the loss card (14).

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"c36a533","hash":"dd777ca02a85de9b6f187337efb09681151478dddd5eb07c1ec03a2537146fb3","parts":{"card":"4b52a7f6e3554225a82fd8672fef82b64554e3989e1b4f7dcfe4dadfddd8203d","checks":"c47c3f3370d9d5795435d370ef8f3c8737a9ef4908e581d44d58525ec1f9c420","ways":"a102182309cb65171c78945e29cd5b13aa72015aa7cfe528e2ab1e99d9aa2817","frames":"fac1f6735d27355d550fb3073cdfae3d1fba2eeec6ff1a16f2226627ae7244de","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit c36a533, by claude -p (model: default). Inputs dd777ca02a85: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 229 s | $0.95 |
| 1-read-2 | reading.md | 55 s | $0.17 |
| 2-compare | report.md | 78 s | $0.28 |
| all | | 308 s (the steps add up to 363 s) | $1.40 |

### 1-read-1: reading.md

# The Audit: what I saw in the seven runs

**The card's "him" points at the wrong person.** The card says "Make him count four." The person who walks round with the laptop-and-tick sign has a hair bun and glasses. A first-time player will probably take the bald man in the suit to be "him", and he never counts anything. Below I call the counter "Bun-and-glasses".

**Things that happen in every run, whatever the player does:**
- The man with spiky hair and a green top shows a 👋 bubble at about 3:09, 3:22 and 3:40. He walks past the player's desk at 3:22 and 3:40. It's part of his routine, not a reaction to the player.
- At 3:32 the bald man gets sweat lines while Bun-and-glasses ticks his desk. That happens in every run.
- The count goes in the same order each time: the bald man's corner office (3:32), the desk with the teal chair (3:36), the player's desk (3:40), then Spiky-hair's desk (3:43).

---

## Run 1: Loss
- 3:09 Player sits at their own desk, which has no laptop.
- 3:22 The bald man is back in the corner office. Spiky-hair walks past with 👋.
- 3:32 Corner office laptop ticked.
- 3:36 Teal-chair desk ticked. The bald man walks into the glass room at bottom left.
- 3:40 At the player's desk the sign shows an X, with a "!😠" burst.
- 3:41 End picture: Bun-and-glasses points, and the player leaves carrying a box with a plant in it.

**Why it ended:** the player's desk had no laptop.
**Player's actions behind it:** none. The player did nothing.
**Might not be a reaction:** the 👋 at 3:40 right beside the player is his usual one.

## Run 2: Win
- 3:09–3:32 The player stands at the bald man's desk while he sits there. A ✋ bubble shows over the desk.
- 3:32 His laptop is ticked.
- 3:35 **Player picks up the bald man's laptop.** He has left for the glass room at bottom left.
- 3:38 **Player puts it on their own desk.** The bald man is smoking in the glass room.
- 3:40 Player's desk ticked.
- 3:43 Spiky-hair's desk ticked, with a "💻😊" bubble.
- 3:46 Bun-and-glasses shows 😊 and the player shows 🎉. The bald man walks back toward his office.
- 3:47 End picture: bald man, cigarette, laptop, ✓✓. A bald-man badge fills a slot.

**Why it ended:** the same laptop was counted twice.
**Player's actions behind it:** taking the laptop after its tick, while its owner was off smoking.
**Might not be a reaction:** the bald man walking back at 3:46 may just be his routine. The loop ends before he reaches his empty desk.

## Run 3: Win
- 3:09–3:32 Player waits beside the teal-chair desk with ✋ showing. The woman in teal is seated.
- 3:36 Her desk is ticked while she's away. **Player picks up her laptop.**
- 3:39 **Player puts it on their own desk.** A "?" thought cloud appears near Bun-and-glasses, with a dashed line toward the player.
- 3:40 The woman in teal sits back down and shows a "💻?" thought cloud. Player's desk ticked.
- 3:43 Spiky-hair's desk ticked.
- 3:47 End picture: the woman in teal with coffee, laptop, ✓✓. Her badge fills a slot.

**Why it ended:** the same double count as run 2, using a different desk.
**Player's actions behind it:** taking her laptop after its tick.
**Might not be a reaction:** the "?" at 3:39 seemed to point at the player, and the woman in teal clearly noticed her laptop was gone. Neither led to anything, so the player learns nothing from them.

## Run 4: Win (I can't fully explain this one)
- 3:26 **Player picks up Spiky-hair's laptop** while he's in the kitchen.
- 3:28 **Player puts it on their own desk.**
- 3:32 and 3:36 Corner office and teal-chair desk ticked.
- 3:40 Player's desk ticked. At the same moment Spiky-hair is right beside it, **holding a laptop**, with a "💻!" bubble.
- 3:43 He's back at his desk, which gets ticked with "💻😊".
- 3:47 End picture: laptop, ✓✓, Spiky-hair walking with a laptop, 🎵.

**Why it ended:** most likely the laptop was ticked on the player's desk, he took it straight back, and it was ticked again at his desk. But in the 3:43 and 3:46 pictures I can't tell for sure whether a laptop is still on the player's desk. So I can't rule out a fifth laptop appearing from nowhere.
**Player's actions behind it:** the swap at 3:26–3:28, plus lucky timing.
**Might not be a reaction:** his "!" fits his laptop being taken, but he wasn't there when it was taken.

## Run 5: Loss
- 3:14 **Player picks up the teal-chair laptop** while the woman in teal is out.
- 3:16 **Player puts it on their own desk.**
- 3:24 She's back and shows a "💻?" thought cloud. She stays seated.
- 3:32 Corner office ticked.
- 3:36 X at her desk with a "!😠" burst, and a red line runs to the player.
- 3:37 End picture: her desk (teal chair, plant) with an X, and the player fired.

**Why it ended:** her laptop was taken before its tick, so her desk counted as empty. The red line seems to blame the player. The picture doesn't show how Bun-and-glasses knew it was the player.
**Player's actions behind it:** taking it too early.
**Might not be a reaction:** her "?" at 3:24 looks like it set things off, but nothing follows from it.

## Run 6: Loss (partly unclear)
- 3:09–3:36 Player waits by the teal-chair desk with ✋ showing. Nothing is finished.
- 3:36 Her desk is ticked.
- 3:38 Player is beside Bun-and-glasses with an orange ring around them. That looks like a half-finished grab. A red view cone is showing, and the woman in teal comes back with a "?".
- 3:38 Player is now at their own desk. A paper stack is on it, and a paper icon with a red bar appears at top right of the screen. The woman in teal shows "!👉" with a red line to the player. Bun-and-glasses shows "📄📄👉💻".
- 3:40 X at the player's desk with "!😠".
- 3:41 Same end picture as run 1.

**Why it ended:** no laptop on the player's desk.
**Player's actions behind it:** the grab never finished. I can't explain the papers, the red bar or the "📄📄👉💻" bubble. I can't tell whether the woman in teal pointing at the player affected anything, because the end picture doesn't show it.

## Run 7: Loss
- 3:14 **Player picks up Spiky-hair's laptop.** He's at the glass room door.
- 3:16 **Player puts it on their own desk.**
- 3:22 He walks past the player's desk with a "💻!" bubble, holding a laptop.
- 3:32 The player's desk is empty and his desk has its laptop again.
- 3:40 X at the player's desk with "!😠".
- 3:41 Same end picture as run 1.

**Why it ended:** he took his laptop back from the player's desk on his 3:22 walk past.
**Player's actions behind it:** taking it so early that he passed by before the count. Compared with run 4, this suggests timing alone decides between winning and losing.
**Might not be a reaction:** in other runs his walk past at 3:22 comes with 👋. Here the bubble changes to "💻!", which is the clearest real reaction in the whole set.

### 1-read-2: reading.md

# Reading: The Audit

## Run 08

**Beats**
- **3:09** Red-shirt player is standing in the open office. A bald man in a suit walks toward the grey room at bottom left. The spiky-haired man shows a 👋 bubble.
- **3:12** Player is at the desk in the corner office. A ✋ shows. Through the glass, the teal-shirt woman shows a "?".
- **3:12** A ✋ hovers over the corner-office laptop. The teal woman shows "!👉" at the player, with a red dotted line between them. A fast-forward icon appears.
- **3:22** Player is still at the corner desk. The teal woman walks across the room. The spiky man shows 👋 again.
- **3:25** Player is at the middle desk with a paper stack. The bald man is sitting in the corner office. The teal woman shows "!👉💻" at the player. A grey figure with glasses and a bun shows "📄📄👉💻". A paper-and-bar meter appears.
- **3:32** Clock turns red. The glasses figure puts 💻✓ on the corner desk.
- **3:36** The glasses figure puts 💻✓ on the left desk.
- **3:40** The glasses figure looks angry ("!😠") and puts 💻✗ on the player's desk.
- **3:41** End picture: the glasses figure points while the player carries a box out. Icons: glasses figure, 👉, player, 📦.

**Why it lost:** The player's desk had no laptop when it was counted.

**What caused it:** I can't name an action. The captions have no "used the thing" markers. The ✋ at 3:12 didn't remove or move any laptop that I can see. It looks like the player never put a laptop on their desk.

**Might not be reactions to the player:** the spiky man's 👋 (it repeats), the bald man walking around, the 3:25 papers bubble (I can't read it), and the counter's desk-by-desk route. Being pointed at twice had no visible effect. Also, the card says "him", but the counter isn't the bald man in the suit.

### 2-compare: report.md

Verdict: fixable

## Runs

- **Run 1: `explained`.** Loss. The reader saw no laptop on the player's desk and that the player did nothing. That is the real cause.
- **Run 2: `explained`.** Win. The reader saw the boss's laptop counted twice and that the player took it after its tick while the boss was off smoking.
- **Run 3: `explained`.** Win. The reader saw Lin's laptop counted twice and that the player took it right after her tick. They missed that the player carried it held to their ear, and they misread a reaction to that (see beat B). The core cause and the player's main action are still right.
- **Run 4: `partly`.** Win.
  - Reader: "most likely the laptop was ticked on the player's desk, he took it straight back, and it was ticked again at his desk. But … I can't tell for sure whether a laptop is still on the player's desk. So I can't rule out a fifth laptop appearing from nowhere." They also put it down to "lucky timing."
  - What happened: Kev's laptop was ticked on the player's desk at 3:40. Kev comes back from the kitchen at 3:40.7, takes it, and plugs it in at his own desk before the 3:43 tick. That timing is built in, not luck.
  - Visual cause: cause and effect are squashed into one frame. In 3:40.png the tick sign goes up while Kev is already standing beside the desk holding a laptop, so "ticked, then taken" looks like it all happened at once. There is also a missing cue: in 3:43.png the player's desk still shows its keyboard and monitor, so you can't tell a laptop is gone. Laptops don't stand out from the furniture that's always on the desks.
  - Fix: hold Kev one step outside the desk until the tick sign has gone and the green sticker is on. Then show him lifting the laptop off it, leaving a clear empty laptop-shaped gap or outline next to the sticker.
- **Run 5: `explained`.** Loss. The reader saw Lin's laptop taken too early and her desk counted as empty. They wondered how the auditor knew it was the player, but the red-cone loss rule covers that. It's fine.
- **Run 6: `partly`.** Loss.
  - Reader: "the grab never finished. I can't explain the papers, the red bar or the '📄📄👉💻' bubble. I can't tell whether the woman in teal pointing at the player affected anything, because the end picture doesn't show it."
  - What happened: the player went for Lin's laptop just as she came back with her coffee. She saw it and told the auditor ("!👉" with a red line). The auditor's answer was to pile paperwork on the player's desk ("📄📄👉💻", the paper stack, the paper meter). That kept the player busy, so no laptop got there, and the desk got the cross at 3:40.
  - Visual cause: a missing cue, plus cause and effect too far apart. The tell and the penalty land in the same second as two separate bubbles, with no line or motion from Lin to the auditor to the desk. The end picture is the same one as run 1 ("nothing on your desk"), so the actual cause, being told on, never shows up in the ending.
  - Fix: give "told on" its own ending, or add the cause to the shared one. For example, the box picture gets a paper stack on the desk with a small Lin 👉 icon in the icon row. In-loop, have the auditor walk over and drop the stack on the player's desk, rather than it just appearing.
- **Run 7: `explained`.** Loss. The reader saw Kev take his laptop back on his 3:22 walk past because the player moved it too early. They also correctly called the "💻!" the clearest real reaction in the set.
- **Run 8: `unexplained`.** Loss.
  - Reader: "I can't name an action … The ✋ at 3:12 didn't remove or move any laptop that I can see … Being pointed at twice had no visible effect."
  - What happened: the player went for the boss's laptop while he was out smoking. Lin saw it through the glass ("?", then "!👉"). At 3:25 she told the auditor, and the auditor buried the player in paperwork. The laptop never moved, and the player's desk got the cross.
  - Visual cause:
    - A missing cue: when the grab is interrupted, nothing shows it. The ✋ just goes away.
    - Cause and effect too far apart: Lin sees it at 3:12, but the tell lands at 3:25 with the auditor far away at the bottom left.
    - A bubble standing in for an event: "📄📄👉💻" carries the whole penalty, and the reader couldn't read it.
    - The end picture doesn't mention Lin or the paperwork.
  - Fix: when an owner catches the player mid-grab, let the laptop visibly drop back with a "thunk" puff and Lin's 👉 locked on. When she tells, draw her walking to the auditor, and have the auditor turn and look at the player before the papers arrive. In the end picture, swap the generic icons for Lin, 👉, 📄📄, 📦.

## Misleading beats

- **A. The auditor's "!😠" and red line in run 5.** Reader: "The red line seems to blame the player. The picture doesn't show how Bun-and-glasses knew it was the player." The rule is that any empty desk turns the auditor's cone red on you. Here the line runs from Lin's desk, which looks like a specific accusation. The visual cause is a bubble that reads as a reaction. Fix: at a cross on someone else's desk, draw the auditor's glare as a cone sweep from the desk to the player, not a pointed line.
- **B. The "?" at 3:39 in run 3.** Reader: "the '?' at 3:39 seemed to point at the player … Neither led to anything, so the player learns nothing from them." That was a real reaction that the reader read as noise. The auditor (or Lin) was briefly suspicious, and holding the laptop to the ear like a phone ("pretend" is lit in the HUD) defused it. The reader never mentions the ear trick, which is half of how this win works. The visual cause is a missing cue: the "?" just fades. Fix: when a pretend defuses suspicion, turn the "?" into a small 📞 or 👍 over the watcher before it fades, so the player sees what the disguise bought them.
- **C. Lin's "!👉" in runs 6 and 8.** Reader: "Being pointed at twice had no visible effect." This was the actual cause of both losses, and the reader dismissed it. The visual cause is cause and effect too far apart, plus an emoji standing in for a person: the paper meter at top right stands in for the auditor punishing the player. Fix: the same as for run 8. Draw the tell as Lin walking to the auditor, and have the paperwork arrive in the auditor's hands.
- **D. Kev's "💻!" in run 4.** Reader: "his '!' fits his laptop being taken, but he wasn't there when it was taken." It is a real reaction, but to finding his laptop on the player's desk, not to it being taken. Because it fires in the same frame as the tick, it reads as surprise at the moment it was taken. Same visual cause and fix as run 4: put a beat between the tick and his pickup.
- **E. The card's "him".** Reader: "A first-time player will probably take the bald man in the suit to be 'him', and he never counts anything." The only text in the game points the reader at the wrong character before the loop even starts. The visual cause is a missing cue: nothing ties the card's word to the person with the laptop-and-tick sign. Fix: print a small portrait of the auditor holding the tick sign on the mission card next to the word, or change the card to name the role rather than a pronoun.

The beats the reader correctly dismissed as routine were Kev's 👋 at 3:09, 3:22 and 3:40, the boss's sweat lines at 3:32, and Lin's "💻?" at 3:24 in run 5. Those didn't mislead them.

<!-- /cold-read:replay -->
