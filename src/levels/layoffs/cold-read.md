# Cold reads: layoffs
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:title {"verdict":"works","date":"2026-11-15","commit":"da5b940","hash":"b5a78c184617ba0111ce624035846d8a5fedff15e076feb6038d959df689f914","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","ways":"cd9e47f9d24bf4cdfcdbc1d29b0bf19bf1d298e76609c15d912d928b7d3a1d42","prompts":"dd5bab76ad1fbe5da43d5bff829c95ca85430b34c17e10645da81a3ce6ac4fa1"},"model":"default","tally":{"miss":4,"near":1,"leak":0},"problems":{"blocker":0,"should":2,"nit":2}} -->
## title: works
Recorded 2026-11-15 at commit da5b940, by claude -p (model: default). Inputs b5a78c184617: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 4 miss, 1 near, 0 leak.
Problems: 0 blocker, 2 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-guess | guesses.md | 13 s | $0.02 |
| 2-judge | report.md | 27 s | $0.08 |
| all | | 40 s (the steps add up to 40 s) | $0.10 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] Guess 1 lands near because "Get off it" names the final action. It's mild, because that action is the goal, and the card has to say the goal. Nothing about the boss's screen, the coffee or Lin leaks. Fix: keep "Get off it". If you want it blunter about the stakes instead, try "Make sure your name's not on it."
- E2 [should] 📦 can read as a tool to use (guesses 3 and 5), but no route uses a box. Players may go looking for one. Fix: swap 📦 for an icon of what's at stake, such as 🪪 (your badge), or keep 📦 only if it clearly reads as "clearing out your desk".

### 1-guess: guesses.md

# Guesses: how you win

1. **Change the list itself.** You find the list and take your name off it, or swap in someone else's name. Suggested by "**The Layoff List**", "**Get off it**".
2. **Stop it from reaching HR.** You intercept, delete or redirect the list before it's sent, perhaps as an email. Suggested by "**It goes to HR**", "**3:45**", 📧.
3. **Use the box to move the list.** The 📦 could be a mail package or the list in a box. You hide the list in it, or send it somewhere other than HR. Suggested by 📦, "**goes to HR**".
4. **Make it miss the deadline.** You keep it from leaving before 3:45 so it doesn't count, for example by keeping the sender busy until then. Suggested by "**3:45**", "**Friday**".
5. **Pin the box on someone else.** Someone else ends up holding the "laid-off" box, and their name replaces yours. This is a weak guess. Suggested by 📦, "**Get off it**".

Stake: You lose your job. Once the list reaches HR at 3:45 with your name still on it, you're laid off. The card never says this outright, but "layoff list" makes it clear.

### 2-judge: report.md

Verdict: works
- Stake: clear — "You're on the layoff list" plus "goes to HR at 3:45" means you lose your job on Friday afternoon if your name is still on it when it's sent. The aim is plain too: "Get off it." Nobody would shrug at this.
- Change the list itself: near — this matches the last step of both routes (take your face off the list), from "Get off it" and the name. But that step is just the goal said back. The guess doesn't touch the real puzzle: getting into the boss's chair through the cable fix and the coffee trip, then getting past Lin by waiting for her phone or ringing Kev's.
- Stop it from reaching HR: miss — no route intercepts the send. The guess came from "goes to HR" and 📧.
- Use the box to move the list: miss — 📦 is only the "packing your desk" lose card. The guess came from 📦.
- Make it miss the deadline: miss — he always sends at 3:45. The coffee trip takes him away, but it doesn't stop the send. The guess came from "3:45".
- Pin the box on someone else: miss — there is no swap route. The guess came from 📦 and "Get off it".

## Problems
- should: Guess 1 lands near because "Get off it" names the final action. It's mild, because that action is the goal, and the card has to say the goal. Nothing about the boss's screen, the coffee or Lin leaks. Fix: keep "Get off it". If you want it blunter about the stakes instead, try "Make sure your name's not on it."
- should: 📦 can read as a tool to use (guesses 3 and 5), but no route uses a box. Players may go looking for one. Fix: swap 📦 for an icon of what's at stake, such as 🪪 (your badge), or keep 📦 only if it clearly reads as "clearing out your desk".
- nit: "It goes to HR" leaves out who sends it, and people in an office would name the boss. Fix: "Your boss sends it to HR at 3:45." It also sounds more like a person talking and tells the player who to watch, without giving away how.
- nit: "3:00 PM" reads like a calendar invite. Fix: "Friday, 3 o'clock." or just "Friday, 3pm."

The rest reads like something a coworker would whisper: "You're on the layoff list" and "Get off it" are short and normal, and nothing on the card sounds made up.

<!-- /cold-read:title -->

<!-- cold-read:sense {"verdict":"fixable","date":"2026-11-15","commit":"da5b940","hash":"856f17e55f8b3c8bd09b5b363f5ac7ed72b7ed1883ad5be1115c8a462417c0b5","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","ways":"cd9e47f9d24bf4cdfcdbc1d29b0bf19bf1d298e76609c15d912d928b7d3a1d42","prompts":"016aa683a72d416a002d56cc4d9abc6f52045f2ad4e6f1862e5593ed8c3882bb"},"model":"default","tally":{"sensible":3,"stretch":2,"nonsense":0},"problems":{"blocker":1,"should":2,"nit":1}} -->
## sense: fixable
Recorded 2026-11-15 at commit da5b940, by claude -p (model: default). Inputs 856f17e55f8b: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 3 sensible, 2 stretch, 0 nonsense.
Problems: 1 blocker, 2 should, 1 nit.
Earlier problems: 3 fixed, 1 still there, 0 no longer applies (now blockers).

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 46 s | $0.12 |
| all | | 46 s (the steps add up to 46 s) | $0.12 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 fixed: In "Seen by Lin", the boss is told that someone on his layoff list is editing it on his computer, and he only sends you back to your desk to type. A real boss would come straight back from the kitchen, angry, check the screen and deal with you. This ending is also milder than "Caught by the boss", though the offence is the same. It also isn't clear how he hears Lin from the kitchen. — Have Lin's ❗ bring him back from the kitchen. He checks the screen, puts your face back and points you out, the same as in "Caught by the boss". If that ending feels too harsh, he can still put your face back, then glare at you and send you to your desk. Either way he has to come back and look. (Lin walks to the kitchen and tells him. He comes back, looks, puts your face back, locks the screen and comes for you. This matches "Caught by the boss".)
- E2 still there: Lin has no clear reason to tell on a coworker she has just felt sorry for. Most real coworkers would look away. — Give her a motive she shows on screen, one a real person would have. When your face is crossed out, she worries the empty place will be filled with her (😨, then she looks at the list). That fear makes her speak up. (Lin's only reaction is 😨 *after* she calls out. Nothing shows her afraid of being added to the list in your place, or any other reason, before she speaks up.)
- E3 fixed: At 3:42 the boss checks the list against the people on the floor. He made a four-person list himself, and it now has three faces. He might well notice that someone is missing. — Have him tick the faces that are on the sheet, desk by desk, and never count them. Or make the check a glance from his doorway while he holds his coffee. A sleepy Friday boss who ticks what is in front of him is believable. A boss who doesn't notice a missing name while counting is not. (He ticks the faces that are on the sheet (📋✔️) and does not count heads.)
- E4 fixed: He leaves you alone at his desk with the layoff list on the screen, and you are on that list. — This works only if he doesn't know the list will come back when the screen does. Show that he has forgotten: for example, he grumbles about the static and doesn't glance at the screen as he leaves. Don't show him thinking about the list. (He leaves angry at the static (😤 ☕ 👉 you) while the screen is dead. Nothing shows him thinking about the list, and he had no reason to lock a blank screen.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Lin has no clear reason to tell on a coworker she has just felt sorry for. Most real coworkers would look away. — Give her a motive she shows on screen, one a real person would have. When your face is crossed out, she worries the empty place will be filled with her (😨, then she looks at the list). That fear makes her speak up. (recurring: premise-level?)
- E2 [should] In Route 2, Lin keeps her back to the office for the whole ring (about 6 s) at a desk she watched Kev leave. A real coworker glances at the phone and turns back, or puts up with it while keeping an eye on things. Fix: make it a short glance (about 3–4 s, just long enough for the 3 s edit). Better, give her a reason to keep looking: she half stands, thinking Kev may have come back for something, then sits down again.
- E3 [should] At 3:42 the boss ticks a list that is one face short. The missing face belongs to the person he left alone at his desk 15 minutes earlier. Ticking what is in front of him is believable, but a moment of doubt would be more natural. Fix: when he ticks, he frowns at the sheet for a moment, sips his coffee, shrugs and sends it. He trusts what is on the screen, and nobody has to act like a puzzle piece.

### 1-judge: report.md

Verdict: fixable
- Route 1: wait for Lin's phone (win): sensible. Lin reading a text is not watching the boss's office. The way in also holds up: a boss whose IT man has gone home lets whoever is already working on his cable fix it, and goes for coffee.
- Route 2: ring Kev's desk (win): stretch. Anyone looks round at a ringing phone. But Lin saw Kev leave, so she would glance and turn back, not watch an empty desk for 6 seconds.
- Do nothing (lose): sensible. Nothing changed, so the list goes out as he wrote it.
- Seen by Lin (lose): stretch. The boss's part is now right: he comes back, checks the screen, puts your face back, locks it and comes for you. Lin still has no reason to tell on someone she just felt sorry for.
- Caught by the boss (lose): sensible. Catching someone crossing themselves off his list gets an instant, angry response.

## Earlier problems
- E1: fixed. Lin walks to the kitchen and tells him. He comes back, looks, puts your face back, locks the screen and comes for you. This matches "Caught by the boss".
- E2: still there. Lin's only reaction is 😨 *after* she calls out. Nothing shows her afraid of being added to the list in your place, or any other reason, before she speaks up.
- E3: fixed. He ticks the faces that are on the sheet (📋✔️) and does not count heads.
- E4: fixed. He leaves angry at the static (😤 ☕ 👉 you) while the screen is dead. Nothing shows him thinking about the list, and he had no reason to lock a blank screen.

## Problems
- should: In Route 2, Lin keeps her back to the office for the whole ring (about 6 s) at a desk she watched Kev leave. A real coworker glances at the phone and turns back, or puts up with it while keeping an eye on things. Fix: make it a short glance (about 3–4 s, just long enough for the 3 s edit). Better, give her a reason to keep looking: she half stands, thinking Kev may have come back for something, then sits down again.
- should: At 3:42 the boss ticks a list that is one face short. The missing face belongs to the person he left alone at his desk 15 minutes earlier. Ticking what is in front of him is believable, but a moment of doubt would be more natural. Fix: when he ticks, he frowns at the sheet for a moment, sips his coffee, shrugs and sends it. He trusts what is on the screen, and nobody has to act like a puzzle piece.
- nit: Nothing says what happens if he comes back and finds you sitting in his chair without having edited anything. Being "sent back to your desk" covers standing around, but sitting at his computer is bolder. Fix: he gives you a suspicious look, then sends you back to your desk.

<!-- /cold-read:sense -->

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"a19db65","hash":"b150a998cf1de2e48fc549f2b6fc93718a2f75c653ed8ae4cd675e295d6fd24d","parts":{"card":"e775451aef394da14bbed3b69ae83498d1362b02f6b7e02e296e135da0026054","premise":"d6d4d955bc15ac7e14e7192921ab67b0f8d716043649a0e755a09083db341605","prompts":"e810e9318a4aa5a21d9654564c23dd898975d90252af2744b888b19de97df7bd"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit a19db65, by claude -p (model: default). Inputs b150a998cf1d: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 8 s | $0.02 |
| 2-review | report.md | 100 s | $0.42 |
| all | | 108 s (the steps add up to 108 s) | $0.43 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM. At 3:45 the boss sends HR a layoff list, and my name is on it. That gives me 45 minutes.

**What I must do:** "Get your name off it" can mean several things:
- Change the list before 3:45, by editing it or swapping in a different name.
- Stop the email from being sent at all.
- Make the boss decide to keep me. Is that a valid way to win?

**If I fail:** 📦 probably means I'm carrying my desk out in a box. Or does the loop just reset at 3:45?

**Questions:**
- Is the list a file, a paper or a draft email? Where is it?
- Can I put someone else's name on it? Is that the joke or a loss?
- Does stopping the email count as a win, or does the list just go out later?
- Do I win at 3:45, or only once HR acts on it?
- Do 📧 📦 tell me what to do or just set the scene? Is 📦 also a disguise, since clothes are identity?
- "The Layoff List": is there just one list, or several drafts?

### 2-review: report.md

Verdict: fixable

**1. The jacket route doesn't make sense and gets in the way of the joke.**
- On screen, the boss never wears the jacket. He's in a blue shirt and red tie all day, so nothing tells the player that a navy suit means "the boss."
- Lin watched the boss leave for the restroom. The designer's own winning run puts the jacket on at 3:15, while the real boss is still crossing the floor (he's out of sight only from 3:18.3). Lin then sees "the boss" back at his desk without walking past her, and isn't surprised.
- This route is also easier and earlier than the hoodie, so most players will win this way and never see the hoodie gag.
- **Fix:** cut the jacket route. If you keep it, rebuild it so the boss wears the jacket at 3:00 and hangs it up on screen, and so the person watching the office did not see him leave.

**2. Losing at an empty desk follows a rule nobody sees.**
- The card says nothing about being at your desk at 3:45. first-read asks: "Do I win at 3:45, or only once HR acts on it?"
- In the hoodie case, the boss sees someone sitting in your chair, decides your chair is empty, and puts you back on the list. The player only learns this rule by losing, not by watching.
- **Fix:** at 3:42, have the boss stand and look across the floor, checking each face against the list with a ✔️ per desk. Players see the head count on loop one, and "Kev in your chair ❓" then makes sense.

**3. The second glitch is there only for the puzzle, and its window is tiny.**
- At 3:37.5 a thump on the desk fixes the screen. Then why did he call Kev at 3:00?
- 3:35 to 3:37.5 is about 4 real seconds, so a player who isn't already waiting in his office misses it.
- **Fix:** open the day with a failed thump, then the wave for Kev. That shows thumping doesn't work. At 3:35, let the static last until he gives up and thumps at about 3:41, just before sending.

**4. Kev leaves his hoodie behind for no reason you can see.**
- He picks up his bag and walks right past the hoodie on his way out.
- **Fix:** have him take one step back toward it and fan himself (🥵), then shrug and go. Now leaving it is a choice we watched.

**5. The card's "name" doesn't match the faces on screen.**
- The list is a row of faces, yet the card says "get your name off it." first-read thinks swapping in someone else's name or stopping the email might work. Neither is possible, and the gap costs early loops.
- The 📧 📦 badge names the trouble without hinting at a fix, which is fine. first-read wonders whether 📦 is a disguise item, but no box ever appears as a thing you can pick up, so that confusion clears up on its own.
- **Fix:** "Get your face off it." It matches what's on screen.

**Checked and holds up:**
- Kev's exit, timed to the moment the boss disappears into the restroom, clearly reads as sneaking out.
- Lin's goodbye wave shows she knows Kev is gone, and that sets up her double take.
- Being unmasked when the hoodie comes off in front of the boss is fair and visible.
- Every hoodie fact can be seen before the player needs it.
- An honest edit as yourself is blocked: when the boss is away, Lin is facing his screen.

**Best thing:** you, in Kev's hoodie, crossing your own face off the layoff list while the boss stands beside you smiling and nodding, then thanking "Kev."

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"a19db65","hash":"677d9fd69cac3dcc9daf069291209005917bb1775c73dc398eaab156e9046a93","parts":{"card":"e775451aef394da14bbed3b69ae83498d1362b02f6b7e02e296e135da0026054","shots":"85e7ce4f981a3f57b19212436d2c2ef585dcfe0b2fc52dd25e1f8a108fe8e5d2","pictures":"4acf90f65d274b62a99ecc404314757f0ef27b35447ac6bc0a91f02a66e5d143","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit a19db65, by claude -p (model: default). Inputs 677d9fd69cac: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 83 s | $0.52 |
| 2-compare | report.md | 89 s | $0.36 |
| all | | 173 s (the steps add up to 173 s) | $0.88 |

### 1-read: reading.md

# Reading: The Layoff List

**01** (3:00): A bald boss in a red tie sits at a desk whose monitor shows static, with an angry bubble over him. I'm the red-ringed one at the middle desk. Two coworkers sit to the left: one in teal and one with spiky hair and a green hoodie. A dark jacket hangs in the corner. *Unclear:* the HUD hand slot and the two empty frames.

**02**: The boss's bubble shows the spiky guy's face and a waving hand. He's calling him over.

**03** (3:04): Spiky stands at the boss's desk with a wrench bubble while the boss waits beside him. So Spiky is the computer fixer.

**04** (3:06): A big popup shows four faces, and mine has a red box around it. The boss is happy and I have a 😨 thought bubble. Clear: I'm on the list.

**05** (3:08): Spiky is back at his desk with a red-faced bubble and blue sparks over his head. *Unclear:* hot, sick, or furious?

**06** (3:17): I'm at the coat-rack jacket with an E prompt. The boss walks off toward the bottom-right door with the toilet sign. His office is empty, so this is a window.

**07** (3:22): Spiky is now in a white shirt with a wave+house bubble. He's going home, and his hoodie is left on his chair. Great tell.

**08–09** (3:24–3:26): Spiky leaves through the bottom door. The hoodie stays on the chair. The boss goes to the toilet.

**10** (3:28): I'm wearing the hoodie, which now shows in the hand slot, and I'm using Spiky's computer. The boss walks past.

**11** (3:30): The boss sees me and his bubble shows 😊 plus Spiky's face. The disguise works. Funny.

**12** (3:35): The boss's static monitor and his "Spiky, come here" bubble again. Teal heads to the toilet.

**13** (3:37): I'm at the boss's desk in the hoodie, with a person+wrench bubble: "I'm here to fix it." The boss is happy. Best gag in the set.

**14** (3:40): The list popup now shows three faces. Mine is gone and there's a red smear. The clock has turned red.

**15–16** (3:41): I'm out of the hoodie, in my red, at Spiky's desk. The boss gives a startled !😠? and his red vision cone reaches me. *Unclear:* what did he notice, me at the wrong desk or the missing hoodie?

**17** (3:42): A huge !😠 and the popup shows my face being shoved back onto the list. Caught, so the edit is undone.

**18** (3:29): Teal has a thought bubble with Spiky's face and a ?. Teal knows Spiky left. The disguise fools the boss but not a coworker.

**19** (3:20): I'm in the dark jacket and the rack is empty. I'm at the boss's desk while he's out. Spiky's bubble shows 😲 plus the boss's face, so I pass as the boss.

**20** (3:23): Same jacket, and the list has three faces.

**21** (end, loss, 3:28): The boss angrily points at me while I hold a box with a plant, still wearing his jacket. Icons: 😠 👉 📦. Clear: he caught me in his jacket and fired me early.

**22** (win, 3:45): The happy boss's list has no me. I grin at my desk, with the hoodie chair in the foreground. Icons: Spiky's face, 📧, 😏. The frame's first slot fills with a Spiky portrait. *Unclear:* the photo pinned to the wall.

**23** (win): The jacket hangs on the wall. Icons: boss face, 📧, 😏. The second slot fills. So there are two solutions, and the slots collect them. Nice.

**24** (loss): I'm crying and carrying the box. Icons: 📧 📦 😢. Plain timeout: the email went out.

**25**: The same, but I'm wearing the hoodie. Funny that the disguise doesn't save me.

**26**: Duplicate of 21.

**27** (loss): An empty glowing yellow chair and an angry boss. Icons: 🪑 😠 📧. *Unclear:* did he email because I was away from my desk? Is the chair empty, or yellow?

**28** (loss): I'm sitting in the hoodie. Icons: Spiky's face, 🪑, 📧. *Unclear:* I think I sat at the wrong desk, but I can't tell why that's a loss.

**29** (loss): I'm at my desk in red with the hoodie chair beside me. Icons: Spiky's face, 👀, 📧. *Unclear:* who saw what? Maybe the boss noticed Spiky was gone?

**Overall:** 22–23 read cleanly. 27–29 look alike and I couldn't separate them. 🪑 and 👀 need stronger staging.

## The story

At 3:00 the boss's computer is broken, and Spiky is the guy who fixes it. Later Spiky goes home and leaves his hoodie on his chair, and the boss steps out to the toilet. Put on the hoodie and the boss happily lets "Spiky" at his keyboard. Or put on the boss's own jacket and walk in as him. Either way you take your name off the list. Then you have to be back at your own desk, clothes returned, before he looks up. The lesson: clothes are identity.

### 2-compare: report.md

Verdict: fixable

The player found both winning routes (22–23 read cleanly). Two loss cards are misread, though, and those cards exist to teach the route's last rule: change back where nobody can see you. A few setup beats are also weak. I opened the shots wherever the reading and the intent disagreed.

- **01 reads.** The HUD hand slot and the empty frames are unclear at the start, but 10 and 22–23 explain them. Cosmetic.
- **02 reads.**
- **03 reads.**
- **04 reads.**
- **05 partly.**
  - Reading: "a red-faced bubble and blue sparks over his head. *Unclear:* hot, sick, or furious?"
  - Intent: Kev is hot, so he takes off his hoodie, hangs it on his chair and sits in a T-shirt.
  - Cause: a missing cue, plus the cause and effect are too far apart. The sweat drops look like sparks. The hoodie only shows up as "left on his chair" at 07, so being hot never gets linked to the hoodie coming off. At this size the hoodie on the chair blends into the green chair.
  - Fix: show Kev standing up and pulling the hoodie over his head, with big falling sweat drops and a fanning hand. Then he drapes it over the chair back with a visible hood, so it doesn't read as a green seat.
- **06 reads.**
- **07 partly.**
  - Reading: "Spiky is now in a white shirt with a wave+house bubble. He's going home."
  - Intent: Kev leaves, and Lin waves back. She knows he's gone, and the boss doesn't.
  - Cause: a missing cue. Lin's 👋 bubble is small and sits under Kev's, so it reads as part of his goodbye. This matters, because 18 and 25 depend on Lin knowing.
  - Fix: have Lin turn toward Kev, and draw a dotted sight line from her to him while her 👋 shows. Better still, have her bubble show Kev's face + 🏠 so she clearly knows where he went.
- **08 reads.**
- **09 reads.**
- **10 reads.**
- **11 reads.**
- **12 reads.**
- **13 reads.**
- **14 reads.** The boss's thank-you (😊 + Kev's face) wasn't mentioned, and the struck face reads as a "red smear." But the main point (my face is off) landed.
- **15 reads.**
- **16 partly.**
  - Reading: "The boss gives a startled !😠?… *Unclear:* what did he notice, me at the wrong desk or the missing hoodie?"
  - Intent: he watched "Kev" take off the hoodie and turn into you.
  - Cause: a missing cue. The ❓ in his bubble muddies the moment he works it out. The vision cone shows that he can see you, not what he saw. The hoodie is already on the chair, so you never see the change itself.
  - Fix: freeze on the moment the hoodie comes off, half olive and half red. His bubble should show Kev's face → your face with a ❗, and a solid red line should run from his eyes to you. Drop the ❓.
- **17 reads.**
- **18 partly.**
  - Reading: "Teal knows Spiky left. The disguise fools the boss but not a coworker."
  - Intent: on top of that, Lin points you out, so you should go while she's away.
  - Cause: a missing cue. Her pointing never appears, so the threat stays a thought bubble with no consequence. 25 inherits the same problem.
  - Fix: add a second beat where Lin stands, 👉, with the boss's face in her bubble, and the boss turns.
- **19 partly.**
  - Reading: "Spiky's bubble shows 😲 plus the boss's face, so I pass as the boss."
  - Intent: Lin takes you for the boss.
  - Cause: the picture doesn't match the intent. The bubble belongs to the standing white-shirt man, who is Kev at 3:20, before he leaves. Lin is seated with no bubble. The player read the picture correctly. The point (you pass as the boss) still lands.
  - Fix: recapture with Lin reacting through the glass, or change the intent to say Kev.
- **20 reads.**
- **21 reads.** This is the same image as 26, pixel for pixel. The in-game moment where he stops, angry, and points was never captured. The meaning still reads.
- **22 reads.** The photo pinned to the wall is unclear. Cosmetic.
- **23 reads.**
- **24 reads.**
- **25 partly.**
  - Reading: "The same, but I'm wearing the hoodie. Funny that the disguise doesn't save me."
  - Intent: someone told on you while you were in the hoodie, so you never reached his computer.
  - Cause: a missing cue. The icons are the same as 24's (📧 📦 😢), so the card reads as a plain timeout with a costume change.
  - Fix: put Lin in the picture pointing 👉 at you. Swap 😢 for Lin's face + 👉 in the icon row.
- **26 reads.**
- **27 partly.**
  - Reading: "An empty glowing yellow chair and an angry boss… *Unclear:* did he email because I was away from my desk? Is the chair empty, or yellow?"
  - Intent: your chair is empty, so he blames you and sends the list.
  - Cause: a glyph used as a prop. The 🪑 icon is a brown wooden chair, but the drawn chair is a yellow office seat, so the icon and the picture don't match. The boss faces front, not the chair, so the cause and effect are too far apart.
  - Fix: turn the boss to glare at the chair, with your face + ❓ in his bubble. Draw your plant and mug on that desk so it's clearly yours. Make the icon the same yellow seat, crossed out or with a dotted outline.
- **28 misread.**
  - Reading: "I think I sat at the wrong desk, but I can't tell why that's a loss."
  - Intent: you're at your own desk but still in Kev's hoodie, so to the boss you aren't there. That means the hoodie has to come off.
  - Cause: a missing cue. The intended Kev-face + ❓ bubble is missing (he shows only 😠). Nothing marks the desk as yours, and the sweat isn't there. Kev's face in the icons reads as "Kev's desk."
  - Fix: put your plant on the desk and give the boss a Kev's face + ❓ bubble pointed at the figure. Make the icons Kev's face + your 🪴 desk + 📧, or show the hoodie with a red ✕ beside it.
- **29 misread.**
  - Reading: "Who saw what? Maybe the boss noticed Spiky was gone?"
  - Intent: the boss saw that "Kev" was you.
  - Cause: a missing cue. The Kev-face + ❗ thought isn't in the picture, and 👀 doesn't say who saw whom. In the foreground, the hoodie on the chair looks like a backpack. Nothing links the icons to 16.
  - Fix: add an inset or thought bubble over the boss of the 16 moment (you half out of the hoodie). Make the icons Kev's face → your face + 👀 so they read as "Kev = you."

Overall: the hoodie route lands up to the edit (10–14). It breaks on the last rule: undress where you can't be seen, and don't stay in the hoodie. Shots 16, 28 and 29 are meant to teach it, and none of them say it clearly. Separately, Lin's knowing (07, 18, 25) is never followed by anything, so she doesn't come across as a threat. Both problems are about staging, not structure, so this is fixable.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"a19db65+dirty","hash":"74d275826c2eff18ddd2336cea35117f11f16897e8a11d98bfb3e4705adca781","parts":{"card":"e775451aef394da14bbed3b69ae83498d1362b02f6b7e02e296e135da0026054","checks":"18b791340f291c8f20e3fd93bf2bf4670e8e8108881706b70d63614e0f2ea937","ways":"5f7278340597ac3b89cf3fa19c91a665d949656041cedfea5fc48946f8c8d4b5","frames":"f68ecd38a61407e4bb48a88efabcce1a39e91dc811b2b7594bdd4f1ea3c5ea58","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit a19db65+dirty, by claude -p (model: default). Inputs 74d275826c2e: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 169 s | $0.75 |
| 1-read-2 | reading.md | 151 s | $0.58 |
| 1-read-3 | reading.md | 158 s | $0.62 |
| 2-compare | report.md | 133 s | $0.45 |
| all | | 303 s (the steps add up to 611 s) | $2.40 |

### 1-read-1: reading.md

# Reading: The Layoff List

**Run 1: loss**
- 3:00 Bald boss 😠; his monitor shows static. Player (red-haired, red outfit) sits at the middle desk.
- 3:01 Boss: 👨+👋 (calling someone).
- 3:04 Green-jacket man from the lower-left desk goes to the boss's desk: 🔧.
- 3:06 Monitor shows four faces. A close-up has the player's face boxed in red. Player 😨, boss 😊.
- 3:08 Green-jacket man back at his desk: 😡.
- 3:21 Green-jacket man: 👋🏠, leaving without his green backpack. Teal woman waves 👋. The boss's office is empty.
- 3:35 Boss back; static again, 😠, then 👨👋. Teal woman walks to the lower right.
- 3:37 Boss thinks 👨❓. Then the monitor shows the list again with nobody fixing it. Boss 😠.
- 3:45 Player is suddenly standing in the boss's office. Boss 😅. A paper lies where the player was.
- 3:46 End: player's face boxed on the list, player carrying a box with a plant. Icons 📧📦😢.

**Why it ended:** The list went out with the player on it.
**Player's cause:** Nothing. No action was recorded.
**Might not be a reaction:** Every bubble here is routine. The 3:37 fix with nobody at the desk weakens the idea that the boss needs a repair person.

**Run 2: loss**
- 3:00–3:08 Same as run 1.
- 3:21 Player walks toward the boss's office while the boss is away.
- 3:23 Player is inside, by the boss's desk. Teal woman thinks ❓, with a red sight cone toward the office.
- 3:23 Player stands at the monitor (E prompt; no "used" caption). Teal woman: spiky ❗👉 player's face.
- 3:26 Player back at their desk, with a paper stack beside them and a spiral ring under them. Teal woman: 👉 player 🖥, with a red dashed line to the player. Boss at the lower right: 📄📄👉🖥. A paper icon with a red bar appears top-right.
- 3:35–3:37 Same as run 1.
- 3:45–3:46 Same ending and icons as run 1.

**Why it ended:** The list still had the player on it.
**Player's cause:** I can't tell. The player reached the monitor but no list close-up appeared. The ending screen is identical to run 1, with no icon for being reported. So I can't say whether the edit failed, never happened, or was undone by the teal woman telling on them. The paper stack and the top-right meter are unexplained.
**Might not be a reaction:** The boss's 📄📄👉🖥 could be his own errand.

**Run 3: win**
- 3:00–3:21 Same as run 1.
- 3:29 *Used thing* at the lower-left desk: player picks up the green backpack and now looks like the green-jacket man. Boss at the doorway: 😐👨.
- 3:35 Boss calls 👨👋; the disguised player walks to the office.
- 3:36 *Used thing* at the boss's desk: player 🧑‍🔧🔧, boss 😊🖥.
- 3:39 *Used thing*: list close-up with the player's row scribbled over. Boss 😊👨.
- 3:41 *Used thing* back at the lower-left desk: backpack returned, player red-haired again. Clock turns red early.
- 3:45 Player at their own desk: 🎉.
- 3:46 End: three faces on the list, player not on it. Icons: green-jacket man's face, 📧, 😏. That face also fills a reward slot.

**Why it ended:** The player's name was off the list when it was sent.
**Player's cause:** The 3:39 edit at the boss's desk, done while dressed as the green-jacket man.
**Might not be a reaction:** The 3:29 😐👨 is where the boss always walks back. It may be routine, not a reaction to the disguise.

**Run 4: loss**
- 3:00–3:39 Same as run 3, including the scribbled list.
- 3:42 *Used thing* in the open aisle above the lower-left desk, not at its chair. Player is red-haired again. Boss: spiky ❗😠, with a red sight line to the player.
- 3:45 Boss and teal woman both think 👨❗. Player 😨. Then both show 😠👉 player.
- 3:46 End: four faces on the list, player boxed in red, boss angry. Icons: green-jacket man's face, 👀, 📧.

**Why it ended:** The boss saw the player take off the disguise, and the player's name went back on the list.
**Player's cause:** Taking the backpack off at 3:42 in the boss's line of sight. Run 3 did it at the chair, out of his sight line.
**Might not be a reaction:** The teal woman's 👨❗ came right after the boss's outburst. She may be reacting to him, not to anything she saw.

**Editor's note:** The run 3 / run 4 contrast reads clearly: take off the disguise somewhere the boss can't see. Run 2 doesn't read at all. Being reported, the paper stack, and the red meter go nowhere visible on the ending screen. The 3:37 fix with nobody at the desk also undercuts the setup.

### 1-read-2: reading.md

# Reading: The Layoff List (runs 5–7)

**Opening shared by all three runs (3:00–3:21).** The captions give the same times for these frames in every run. I only looked at run 5's frames, so I'm assuming the other two match.
- 3:00: The boss's screen is static. The boss shows 😠.
- 3:01: The boss shows a bearded face and 👋, as if calling someone.
- 3:04: A bearded man in a green hoodie comes to the boss's desk with a 🔧 bubble.
- 3:06: The screen works again. A pop-up shows four faces, and the brown-haired one (the player's face) has a red box around it. The player has a 😨 thought.
- 3:08: The bearded man is back at his desk with a 😡 bubble.
- 3:21: He leaves with 👋🏠. His green hoodie stays on his chair.

---

## Run 5
- 3:29: The player takes the hoodie and now looks like the bearded man. The boss walks out of his office showing 😊 and a bearded face.
- 3:35: The boss's screen is static again, and he shows 😠 then a bearded face with 👋. Run 6 shows the same bubbles at 3:35, so this is his routine, not a reaction to the player.
- 3:36: The player, disguised, uses the boss's computer. The player's bubble is 🙋🔧 and the boss replies 😊🖥️.
- 3:39: The boss leaves his office. The player uses the computer again and the list pop-up appears. Row 2 may look different, but I can't be sure.
- 3:41: The player sits at their own desk. A teal-shirted woman shows "!" and points at the brown-haired face. The boss's bubble is papers → monitor, and a paper icon appears.
- 3:45: Both the boss and the woman think "bearded face?".
- End card: the boss is angry at the hooded figure sitting at a desk. Row 2 is still boxed. Icons: bearded face, 🪑, 📧.

**Result:** I can't tell if this is a win or a loss. There's no box and no crying icon, unlike runs 6 and 7. But the list looks unchanged and the boss looks angry.

**Likely cause:** Using the computer at 3:36 and 3:39 is the only thing that sets this run apart. I can't say what it actually did.

---

## Run 6
- 3:29: The player takes the hoodie.
- 3:35–3:37: The player stands at the boss's desk and does nothing. The boss thinks "bearded face?", then shows 😠. The screen works again without anyone touching it.
- 3:43: The player goes to their own desk. The woman's "!" and the boss's papers bubble repeat.
- 3:45: The player is at the boss's desk and the boss shows 😅. There's no "you used the thing" marker, so this looks like the player being called in.
- End card: the player, in the hoodie, carries a box out. Icons: 📧📦😢.

**Result:** Loss. The player was fired.

**Cause:** The player didn't act at the computer when the boss was calling for the bearded man.

**Might not be a reaction:** The boss's "bearded face?" thought. It could just be his routine, wondering where the bearded man is.

---

## Run 7
- 3:27: The player takes the hoodie. The boss is already walking around the main office.
- 3:29: The woman thinks "bearded face?" as the player walks past. The player sits at their own desk. The woman shows "!" and points at the brown-haired face, and the boss's papers bubble appears.
- 3:35–3:37: The player stays at their desk. The boss's bubbles are the same as in run 6.
- 3:45: The player is shown at the boss's desk and the boss shows 😅, the same as run 6.
- End card: the same as run 6 (📧📦😢).

**Result:** Loss.

**Cause:** The player never went near the boss's computer.

**Might not be a reaction:** The boss's 😊 + bearded face bubble at 3:29 shows up in every run, wherever the player is. It's probably just his routine.

**Confusing in all runs:** Sitting at your own desk briefly shows the player without the disguise, gets the woman's "!", and leaves a paper meter at the top of the screen. I couldn't tell whether any of that affects the ending.

### 1-read-3: reading.md

# Reading: The Layoff List

Mission card: at 3:45 the boss emails the layoff list, and you're on it. Get off it.

**Same in every run, 3:00–3:08.** The bald boss frowns at a fuzzy monitor and waves over the bearded man, who fixes it with a 🔧. A popup shows the list: four faces, and the red-haired player is highlighted in red. The player shows a scared thought bubble and the boss smiles. The bearded man goes back to his desk with a 😡 bubble.

## Run 8: WIN

- 3:20: The player takes the blazer off the coat stand (it shows up in the hand slot). The next picture shows the player already sitting in the boss's chair, and the boss is nowhere on screen.
- 3:20: The bearded man (😳 + bald face) and the teal-shirted woman (😳 + bald face) both look at the player.
- 3:21: The bearded man waves 👋🏠 and walks toward the exit. The teal woman waves 👋.
- 3:22: The player uses the boss's computer and a faint list popup appears.
- 3:23: The player hangs the blazer back up. The popup now shows the player's face crossed out.
- 3:35: The boss is back, frowning at the fuzzy monitor again, and calls for the bearded man.
- 3:37: The boss's thought bubble shows the bearded man's face with a ❓. Then the monitor shows three faces.
- 3:46: End picture: a three-face list, the boss, 📧, and the player looking smug.

**Why it was won:** the list that went out didn't have the player on it.

**What caused it:** editing the list at 3:22 while wearing the blazer, then putting the blazer back before the boss came back.

**Might not be a reaction:** the bearded man leaving at 3:21 happens in every run. The monitor fixing itself at 3:37 also happens in run 9, where the player never touched the computer.

## Run 9: LOSS

- 3:19: The player takes the blazer. The teal woman's view cone turns red and her thought bubble shows the boss's face with a ❓.
- 3:20: The teal woman pops a burst bubble: ❗👉 the player's face. The player sits in the boss's chair but never uses the computer (no action is marked).
- 3:20–3:22: The same bubbles as run 8: 😳 + bald face, then 👋🏠 and 👋.
- 3:26: The player is back at their own desk, still wearing the blazer. The teal woman jumps up with a burst (👉 the player + 👔) and a red dotted line points at the player. A stack of paper has appeared on the player's desk. The boss is out among the desks with a bubble of 📄📄👉🖥️. A paper icon with a red bar appears in the top-right corner of the screen.
- 3:35–3:37: The same fuzzy-monitor routine as run 8. This time the list comes back with four faces.
- 3:45: The player is standing in front of the boss's desk, and the boss has a 😅 bubble.
- 3:46: End picture: the player is highlighted on the list and carries a box out. Icons: 📧📦😢.

**Why it was lost:** the player was still on the list when it went out.

**What caused it:** the player never edited the list. Being called out by the teal woman didn't end the loop. I can't tell what the red bar, the paper stack or the 3:45 visit to the boss did, if anything.

## Run 10: LOSS

- 3:20–3:22: The same as run 8: blazer, the boss's chair, the same bubbles, and an edit on the computer at 3:22.
- 3:27: The player is back at their own desk, still wearing the blazer. The boss's monitor shows fewer faces than before. The boss walks in from the right with a thought bubble of his own face and a ❓, and his view cone turns red on the player.
- 3:27: The boss pops a burst bubble: ❗😠.
- 3:28: End picture: the angry boss points, and the player leaves with a box. Icons: 😠👉📦.

**Why it was lost:** the boss saw the player wearing his blazer.

**What caused it:** keeping the blazer on after editing the list. Compare run 8, where the blazer went back on the stand at 3:23.

**Odd:** the end picture shows the original four-face list with the player highlighted, even though the boss's monitor had just shown fewer faces. I can't tell whether getting caught undid the edit or the end picture is just a stock image.

### 2-compare: report.md

Verdict: fixable

## Runs

**Run 1: do nothing → Kev goes home → fail.** `explained`
The reader says "The list went out with the player on it" and the player did "Nothing." That is the run.

**Run 2: edit the list as yourself while the boss is away → Lin sees you → fail.** `partly`
- **Reading:** "I can't tell… whether the edit failed, never happened, or was undone by the teal woman telling on them. The paper stack and the top-right meter are unexplained."
- **What happened:** Lin saw the player at the boss's screen before the edit and pointed them out. The player was sent back to their desk with paperwork (the stack and the red-bar meter), so the edit never happened.
- **Visual cause:** a missing cue, and the cause sits too far from the effect. The report happens at 3:23–3:26, the ending at 3:46, and the lose card is the same as "do nothing".
- **Fix:** When Lin points, show the sheet pop out large with the player's face still framed and a 🔒 on it. On the lose card, show Lin's 👉 face in the icon row.

**Run 3: win as "Kev" in the hoodie.** `explained`
The reader says the player edited at 3:39 while dressed as the green-jacket man, then put the hoodie back.

**Run 4: hoodie taken off where the boss can see → blamed, seen.** `explained`
The reader says it "Taking the backpack off at 3:42 in the boss's line of sight", and the player's name went back on the list. They also contrast it correctly with run 3.

**Run 5: hoodie still on at your desk at 3:45 → blamed as Kev.** `unexplained`
- **Reading:** "I can't tell if this is a win or a loss… the list looks unchanged and the boss looks angry." Cause: "I can't say what it actually did."
- **What happened:**
  - The edit at 3:39 worked.
  - At 3:41 Lin saw "Kev" (a Kev face with ❓ in her bubble), pointed, and sent the player to their desk still in the hoodie.
  - At 3:45 the boss saw Kev in the player's chair, so the player counted as absent. He put the player's face back on the list and sent it.
- **Visual cause:**
  - **An emoji standing in for a person.** On the card, the player in the hoodie looks exactly like Kev ("the hooded figure"). The Kev-face and 🪑 icons say "Kev is in your chair" only if you already know the rule.
  - **A missing cue.** The edit pop-out did not read ("Row 2 may look different, but I can't be sure"). The card never shows the face going back on, only a list that is "still boxed".
- **Fix:** On the card, let a tuft of the player's red hair stick out of the hood, and add a thought bubble over the boss's head: Kev's face = 🪑 (empty chair). Animate the player's face dropping back onto the sheet, as in run 4. That way "un-edited" and "never edited" look different.

**Run 6: offers to fix the computer before it acts up → nothing to offer → fail.** `explained` (with a gap)
- The reader says "The player didn't act at the computer when the boss was calling for the bearded man." That is the right lesson: act while the screen shows static.
- The early, empty offer left no trace, though. No "used" caption, no bubble. So the reader could not see that the player tried too soon.
- **Fix:** If the player presses E while the screen works, show 🙋🔧 from the player and 🙅🖥️✅ from the boss.

**Run 7: hoodie in front of Lin → double take → points → desk work → fail.** `partly`
- **Reading:** "Cause: The player never went near the boss's computer."
- **What happened:** Lin had waved Kev goodbye. She saw the player in his hoodie (a Kev face with ❓ in her bubble), pointed (❗👉), and the player was sent to their desk with paperwork. That pinned them there for the window.
- The reader recorded the double take but did not link it to the loss. "Never went near the computer" is the effect, not the player's mistake.
- **Visual cause:** same as run 2. The desk-work penalty doesn't show as a restraint, and the card is the same as doing nothing.
- **Fix:** Draw the paper stack as a heavy pile that holds the player at the desk, with a ⛓️ or 📄 weight over their head until it clears. Put Lin's 👉 face in the icon row of the lose card.

**Run 8: win as "the boss" in the jacket.** `explained`
The reader says the player edited at 3:22 in the blazer and hung it back before the boss returned.
Missed cue: they never say why Lin didn't stop the player putting the jacket on, which was her glancing away. Only the run 9 contrast hints at it.

**Run 9: jacket put on in front of Lin → double take → points → desk work → fail.** `unexplained`
- **Reading:** "the player never edited the list. Being called out by the teal woman didn't end the loop. I can't tell what the red bar, the paper stack or the 3:45 visit to the boss did, if anything."
- **What happened:** Lin saw the player put the jacket on: her cone turned red and her bubble showed the boss's face with ❓. She pointed, and the player was sent to their desk with paperwork, so they could never edit. Being called out is the cause, and the reader explicitly ruled it out.
- **Visual cause:**
  - The cause sits far from the effect: called out at 3:20–3:26, ending at 3:46.
  - A missing cue: the meter and paper stack have no visible meaning.
  - The lose card is the same as doing nothing.
- **Fix:** Same as runs 2 and 7. Lin's face goes in the icon row, and the card's desk shows the paper stack. The red-bar meter should drain visibly, and the boss's office should be greyed out or blocked while it is full.

**Run 10: jacket still on when the boss returns → caught.** `explained`
The reader says "the boss saw the player wearing his blazer… keeping the blazer on after editing."
Side confusion: the card shows the four-face list even though the monitor had just shown three faces. See beat 6.

## Beats that misled the reader

1. **Desk work after being reported reads as nothing (runs 2, 5, 6, 7, 9).**
   - **Reading:** "Being reported, the paper stack, and the red meter go nowhere visible on the ending screen." Also: "Being called out by the teal woman didn't end the loop."
   - **What happened:** Being pointed out sends you to your desk with work, and that blocks the scheme. It is the main way to get stopped in this level.
   - **Visual cause:** a missing cue, and the cause sits too far from the effect. The lose card is the same as "do nothing".
   - **Fix:** Give the "stopped" loss its own card: the player buried at their desk under the paper stack, with the reporter's face and 👉 in the icon row.

2. **The cause and effect of sitting at your desk read backwards (runs 5–7).**
   - **Reading:** "Sitting at your own desk briefly shows the player without the disguise, gets the woman's '!', and leaves a paper meter."
   - **What happened:** Lin's ❗ (prompted by the disguise) sends you to the desk, not the other way round.
   - **Visual cause:** a missing cue. The forced walk to the desk is not shown.
   - **Fix:** Show a red dashed path from Lin's 👉 to the player's chair, and have the boss drop the paper stack on it before the player sits.

3. **The boss's 😊 and Kev's face at 3:29 was dismissed as routine (runs 3, 5, 7).**
   - **Reading:** "probably just his routine," in run 7 and in run 3 ("😐👨… may be routine").
   - **What happened:** It is the real reaction to the hoodie. It only appears when he sees the player wearing it, and it tells the player the disguise works.
   - **Visual cause:** a bubble that reads as routine. The boss keeps walking his usual path while it shows.
   - **Fix:** Make the boss stop, turn to face the player, and give a little wave, with a short green sight line to the player (the mirror of the red "caught" line).

4. **The monitor fixes itself at 3:37 (runs 1, 6, 8, 9).**
   - **Reading:** "The 3:37 fix with nobody at the desk weakens the idea that the boss needs a repair person."
   - **What happened:** This is where the window to offer help closes.
   - **Visual cause:** a missing cue.
   - **Fix:** Have the boss give up and thump the monitor (👊🖥️), so the static clears because of him, not by itself.

5. **The run 5 edit didn't register.**
   - **Reading:** "Row 2 may look different, but I can't be sure."
   - **What happened:** The player's face was struck off the list.
   - **Visual cause:** a missing cue. The strike-through is too faint at this size.
   - **Fix:** Have the struck face visibly fall out of the sheet and leave a gap, and keep the monitor showing three rows.

6. **The run 10 card contradicts the monitor.**
   - **Reading:** "I can't tell whether getting caught undid the edit or the end picture is just a stock image."
   - **What happened:** Getting caught puts your face back on the list.
   - **Visual cause:** a missing cue. The face-back step shown in run 4 is skipped here.
   - **Fix:** On catch, pop the sheet out and drop the player's face back onto it before the card appears.

7. **The 3:45 picture of the player standing in the boss's office (runs 1, 6, 7, 9).**
   - **Reading:** "the player being called in," and "Player is suddenly standing in the boss's office."
   - **What happened:** The boss is firing the player at 3:45, the moment the list is sent.
   - **Visual cause:** a missing cue. The player jumps there with no walk.
   - **Fix:** Show the boss's 👨👋 calling the player in, then the player walking over with 😨.

8. **Lin glancing away goes unread (runs 8, 9).**
   - **Reading:** the reader never says why Lin let the run 8 jacket swap pass. Only run 9 notes her cone turning red.
   - **What happened:** Run 8 put the jacket on during one of Lin's regular glances away. Run 9 did it while she was looking.
   - **Visual cause:** a missing cue. Her cone swinging away is the timing cue, and it is too subtle.
   - **Fix:** When she glances away, give Lin a small 💭☕ or 📱 bubble, and dim her vision cone, so the safe moment is visible.

<!-- /cold-read:replay -->
