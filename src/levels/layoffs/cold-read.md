# Cold reads: layoffs
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:title {"verdict":"works","date":"2026-11-15","commit":"500ae5a","hash":"c987ef54fa2f01d0323d9f1f0b0037fb3e6b8eb98bba7b7e967439888cd33fbc","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","ways":"c4d895c4e3faf0bc0ecec65f48dd49e8bde16f8e2e95a311078493e7edc46695","prompts":"71812b7000506aab5e901a48dd63d8aa5d43c7546f39641d13d12179213bd417"},"model":"default","tally":{"miss":4,"near":1,"leak":0},"problems":{"blocker":0,"should":2,"nit":1}} -->
## title: works
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs c987ef54fa2f: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 4 miss, 1 near, 0 leak.
Problems: 0 blocker, 2 should, 1 nit.
Earlier problems: 0 fixed, 2 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-guess | guesses.md | 10 s | $0.02 |
| 2-judge | report.md | 27 s | $0.08 |
| all | | 36 s (the steps add up to 36 s) | $0.10 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: Guess 1 lands near because "Get off it" names the final action. It's mild, because that action is the goal, and the card has to say the goal. Nothing about the boss's screen, the coffee or Lin leaks. Fix: keep "Get off it". If you want it blunter about the stakes instead, try "Make sure your name's not on it." (Guess 1 still lands near, and "Get off it" is the goal, not the method. It's only a should because it's a near. Nothing about the cable, the coffee or Lin gets out. Fix: keep "Get off it", or try "Make sure your name's not on it.")
- E2 still there: 📦 can read as a tool to use (guesses 3 and 5), but no route uses a box. Players may go looking for one. Fix: swap 📦 for an icon of what's at stake, such as 🪪 (your badge), or keep 📦 only if it clearly reads as "clearing out your desk". (📦 still reads as a tool to use: guesses 3 and 4 both build a plan around it. A box only shows up on the lose card, when you carry your desk out. Fix: swap 📦 for 🪪 (your badge), so the icon shows what you could lose.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] Guess 1 lands near because "Get off it" names the final action. It's mild, because that action is the goal, and the card has to say the goal. Nothing about the boss's screen, the coffee or Lin leaks. Fix: keep "Get off it". If you want it blunter about the stakes instead, try "Make sure your name's not on it." (recurring: premise-level?)
- E2 [should] 📦 can read as a tool to use (guesses 3 and 5), but no route uses a box. Players may go looking for one. Fix: swap 📦 for an icon of what's at stake, such as 🪪 (your badge), or keep 📦 only if it clearly reads as "clearing out your desk". (recurring: premise-level?)

### 1-guess: guesses.md

# Guesses

1. **Swap your name for someone else's on the list before it's sent.** Hint: "Layoff List", "Get off it", 📧. The list probably travels by email, so you get to it while it's still a draft.
2. **Stop the email from reaching HR before 3:45.** You might delete it, delay it or misroute it. Hint: "It goes to HR at 3:45", 📧.
3. **Hide in a box or get shipped out.** Hint: 📦. Maybe you can't be cut if nobody can find you. Or the box is the "clear your desk" box, and you use it to look like you've already been let go.
4. **Become indispensable before 3:45.** You might take over a delivery or task that only you can now finish. Hint: 📦, "Get off it". The package could be work you claim as your own.
5. **Get the list's author to pull your name.** You could flatter them or trade a favour. Hint: "Get off it". This is weakly suggested, since the card never says who wrote the list.

Stake: you get laid off. The list reaches HR with your name still on it, and you lose your job.

### 2-judge: report.md

Verdict: works
- Stake: clear. You're on the layoff list, it goes to HR at 3:45, and if your name is still on it you lose your job. A stranger knows the deadline, the threat and the goal.
- Swap your name for someone else's before it's sent: near. The routes do change the list before it goes, but you cross your own face off rather than swap it. The card gives no hint of the key steps: fixing his cable so he goes for coffee, then getting past Lin. Led by "Layoff List", "Get off it" and 📧.
- Stop the email reaching HR: miss. No route touches the email, and he sends it at 3:45 in every outcome. Led by "It goes to HR at 3:45" and 📧.
- Hide in a box or get shipped out: miss. No route uses a box. Led by 📦.
- Become indispensable: miss. No route works this way. Led by 📦 and "Get off it".
- Get the list's author to pull your name: miss. The boss is never persuaded; he's the one you work around. Led by "Get off it". The reader says themselves it's a weak guess.

## Earlier problems
- E1: still there (should). Guess 1 still lands near, and "Get off it" is the goal, not the method. It's only a should because it's a near. Nothing about the cable, the coffee or Lin gets out. Fix: keep "Get off it", or try "Make sure your name's not on it."
- E2: still there (should). 📦 still reads as a tool to use: guesses 3 and 4 both build a plan around it. A box only shows up on the lose card, when you carry your desk out. Fix: swap 📦 for 🪪 (your badge), so the icon shows what you could lose.

## Problems
- nit: 📧 next to "It goes to HR" pushes players toward stopping or redirecting the email (guess 2), and no route does that. It's mild, because the email really is how the list leaves. Fix: drop 📧 and let "It goes to HR at 3:45" carry the deadline, or use 🕒 to stress the time instead of the email.

Read aloud, the card sounds like a person talking. "You're on the layoff list. It goes to HR at 3:45. Get off it." is how a coworker would say it under their breath. Nothing to change there.

<!-- /cold-read:title -->

<!-- cold-read:sense {"verdict":"works","date":"2026-11-15","commit":"3392902","hash":"c75b10f5606c75ca2d71e78ab298532264e9e9180b5037d713488915a3f47dde","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","ways":"c4d895c4e3faf0bc0ecec65f48dd49e8bde16f8e2e95a311078493e7edc46695","prompts":"4efae5d3d9191596f5720cdf7e7483eea858a949c44cf5579c3f9b7d49f613b3"},"model":"default","tally":{"sensible":6,"stretch":1,"nonsense":0},"problems":{"blocker":0,"should":3,"nit":1}} -->
## sense: works
Recorded 2026-11-15 at commit 3392902, by claude -p (model: default). Inputs c75b10f5606c: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 6 sensible, 1 stretch, 0 nonsense.
Problems: 0 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 49 s | $0.11 |
| all | | 49 s (the steps add up to 49 s) | $0.11 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The boss locks the list when he leaves a working screen. Then he leaves the person who is on that list kneeling at his computer. A half-awake boss could miss this because the screen is dead, but nothing shows he thought about it at all. — Have him hesitate and glance at the dead screen before he goes, then shrug it off (😩☕). It reads as a lazy Friday decision, not a gap in the plan.
- E2 [should] Lin watches the boss's office and knows you're on the list. She sees you sit down in his chair at his unlocked computer and does nothing until you actually cross yourself out. A real coworker would at least keep staring, and would hardly turn to her phone casually. — Let her notice you sitting down: a 🤨 and a longer look. She still waits for proof before she tells anyone, and her attention drifts back to her desk after a moment, so Route 1 still works.
- E3 [should] The coffee takes about 9 minutes, from about 3:27 until he leaves the kitchen around 3:36. That's long for one coffee. — Give him a reason to linger: the machine is empty and he has to refill it, or a coworker stops him to chat on a Friday afternoon (shown once in the kitchen).

### 1-judge: report.md

Verdict: works

- Do nothing (lose): sensible — nothing changed, so the boss sends the list as he wrote it.
- Seen by Lin (lose): sensible — Lin has just escaped the list and fears she could take your place, so she tells the boss; he comes back, puts the list right, locks his screen and sends it.
- Caught by the boss (lose): sensible — a boss who finds you crossing yourself off his layoff list throws you out on the spot.
- Shared way in (both wins): stretch — Kev has gone home and the boss is fed up with a dead screen, so walking off to get coffee is believable. But he locked this same list at 3:11, and now he leaves the person he's about to lay off alone with his computer.
- Route 1, wait for Lin's phone (win): sensible — someone reading a buzzing phone isn't watching the boss's office for those few seconds.
- Route 2, ring Kev's phone (win): sensible — a phone ringing at an empty desk behind you makes you turn round, and it has already rung there twice today.
- Sending the edited file (all wins): sensible — at 3:45 on a Friday, with his coat on, a boss sends the email he has open without checking a list he already looked over at 3:08. That HR now has a list without you is the joke, and that's allowed.

## Problems
- should: The boss locks the list when he leaves a working screen. Then he leaves the person who is on that list kneeling at his computer. A half-awake boss could miss this because the screen is dead, but nothing shows he thought about it at all. — Have him hesitate and glance at the dead screen before he goes, then shrug it off (😩☕). It reads as a lazy Friday decision, not a gap in the plan.
- should: Lin watches the boss's office and knows you're on the list. She sees you sit down in his chair at his unlocked computer and does nothing until you actually cross yourself out. A real coworker would at least keep staring, and would hardly turn to her phone casually. — Let her notice you sitting down: a 🤨 and a longer look. She still waits for proof before she tells anyone, and her attention drifts back to her desk after a moment, so Route 1 still works.
- should: The coffee takes about 9 minutes, from about 3:27 until he leaves the kitchen around 3:36. That's long for one coffee. — Give him a reason to linger: the machine is empty and he has to refill it, or a coworker stops him to chat on a Friday afternoon (shown once in the kitchen).
- nit: He tells you "plug it in and get out", so sitting in his chair breaks a direct order. That fits the comedy, but the rule "if he finds you standing around in his office, he sends you back to your desk" says nothing about this order. — Reword it as "if he finds you still in his office", so it plainly follows from what he told you.

<!-- /cold-read:sense -->

<!-- cold-read:motives {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"63d6eb3d105353b42563b15e468176618a030c679847c5857639028719a24a39","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","who":"88b67903778d1ec008248e88d15855edf145281fa45aca8a4d70357305d02bc8","prompts":"aa0481bd7d2903c1741f536b834919fec681febf17e0865d79a523b4af6bf462"},"model":"default","tally":{"motivated":0,"binds":1,"thin":1,"unmotivated":0,"contradicts":2,"only-you":0},"problems":{"blocker":2,"should":5,"nit":1}} -->
## motives: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 63d6eb3d1053: the card, premise.md's who does what, the pass's prompts.
Items: 0 motivated, 1 binds, 1 thin, 0 unmotivated, 2 contradicts, 0 only-you.
Problems: 2 blocker, 5 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 37 s | $0.08 |
| all | | 37 s (the steps add up to 37 s) | $0.08 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The coffee beat breaks the boss's one shown habit. He guards the open list so closely that he locks it for a restroom trip, then leaves a listed employee alone with it for minutes. Nothing shown earlier explains the coffee either, and the main route depends on this beat. — Keep his caution: have him lock the screen before he goes ("plug it in, I'll be back"), and make you work around the lock. Or show the coffee need first: he heads for the kitchen at 3:00 and gets cut off by the dead screen.
- E2 [blocker] Lin's 3:08 shoulder-read contradicts her being at her desk all day, and has no reason. It is the cause of her telling the boss later, which a route depends on. — Give her a job errand: she drops a folder on his desk at 3:08 and glances at the screen. Then remove "at her desk all day."
- E3 [should] The boss sends at 3:45 without looking at the list. He checks it carefully elsewhere, and does check it when Lin warns him. — Have him glance at it, coat on, and make the edit pass a glance (for example, a name swapped, not a gap).
- E4 [should] The screen dying again at 3:26 has no cause on screen. A cable Kev just plugged in falls out by itself. — Show a cause: the boss's chair rolls back over the cable as he sits down after the restroom.
- E5 [should] The 3:11 restroom walk goes "the long way round" with no reason, and Kev's escape window depends on it. — Give it a reason, such as a chat at the water cooler on the way, or a wet-floor sign on the short way.
- E6 [should] Kev's wish to go home is only stated. — Show it: bag packed by 3:00, coat on his chair, checking the clock.
- E7 [should] Lin waved Kev goodbye, then hears the boss ringing Kev's empty desk and says nothing. A real coworker would call out "he's gone home." — Give her a reason to keep quiet. She's on her phone with her back turned at that moment, or she covers for Kev on purpose (they're friends, shown by the wave).

### 1-judge: report.md

Verdict: fixable
- The boss: contradicts — he locks his screen at 3:11 because the list is open on it. At 3:26 he leaves you, a person on that list, alone at his desk with the list still open, and goes for a coffee nobody has seen him want.
- Kev: thin — "wants to go home" is told, not shown. Waiting for the boss to leave before slipping out is a real habit, but nothing on screen sets up why he wants to go, or that he is dodging the boss.
- Lin: contradicts — "at her desk all day" doesn't fit reading the list over the boss's shoulder at 3:08, and no reason is given for that walk. Her phone-buzz and ring-behind-her habits are everyday and kept.
- The card's rule: binds — the card sets no rule (only a deadline). The unspoken "don't leave before the boss" is kept by Kev, who sneaks out, and isn't asked of you.

## Problems
- blocker: The coffee beat breaks the boss's one shown habit. He guards the open list so closely that he locks it for a restroom trip, then leaves a listed employee alone with it for minutes. Nothing shown earlier explains the coffee either, and the main route depends on this beat. — Keep his caution: have him lock the screen before he goes ("plug it in, I'll be back"), and make you work around the lock. Or show the coffee need first: he heads for the kitchen at 3:00 and gets cut off by the dead screen.
- blocker: Lin's 3:08 shoulder-read contradicts her being at her desk all day, and has no reason. It is the cause of her telling the boss later, which a route depends on. — Give her a job errand: she drops a folder on his desk at 3:08 and glances at the screen. Then remove "at her desk all day."
- should: The boss sends at 3:45 without looking at the list. He checks it carefully elsewhere, and does check it when Lin warns him. — Have him glance at it, coat on, and make the edit pass a glance (for example, a name swapped, not a gap).
- should: The screen dying again at 3:26 has no cause on screen. A cable Kev just plugged in falls out by itself. — Show a cause: the boss's chair rolls back over the cable as he sits down after the restroom.
- should: The 3:11 restroom walk goes "the long way round" with no reason, and Kev's escape window depends on it. — Give it a reason, such as a chat at the water cooler on the way, or a wet-floor sign on the short way.
- should: Kev's wish to go home is only stated. — Show it: bag packed by 3:00, coat on his chair, checking the clock.
- should: Lin waved Kev goodbye, then hears the boss ringing Kev's empty desk and says nothing. A real coworker would call out "he's gone home." — Give her a reason to keep quiet. She's on her phone with her back turned at that moment, or she covers for Kev on purpose (they're friends, shown by the wave).
- nit: "She sees her own face filling your gap" is a thought. — Show it: she leans over, sees the list renumber, and her face moves up.

<!-- /cold-read:motives -->

<!-- cold-read:props {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"bea26a197c168879656a5866872394d1e8ba255b590004c3001b02ad17abc49b","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","things":"2ee4e8a66bbc2d3ba732eef7ce45c5e8b342a72d77e142e3dae702ca3f319a9b","prompts":"e4a62e7d4c56bb76d5cc46d69b3c0fd96478427c533f15affaaa5f43d93d7558"},"model":"default","tally":{"fits":12,"odd":0,"pointless":1,"misleading":1},"problems":{"blocker":2,"should":1,"nit":3}} -->
## props: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs bea26a197c16: the card, premise.md's things in the office, the pass's prompts.
Items: 12 fits, 0 odd, 1 pointless, 1 misleading.
Problems: 2 blocker, 1 should, 3 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 34 s | $0.07 |
| all | | 34 s (the steps add up to 34 s) | $0.07 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The boss's screen faces out through the glass so the whole floor can read the layoff list. No boss would show a confidential list to the staff, and the setup exists only for the puzzle. — Make it his ordinary desk monitor facing his chair. The player sees the list by walking behind the desk or sitting in the chair. The static and padlock stay the same.
- E2 [blocker] The coffee machine looks usable, but the player can't use it. — Let the player pour a cup that does nothing (a short "you're not thirsty, you're panicking" beat), or keep the machine out of view in the kitchen so it reads as scenery.
- E3 [should] Kev's screen shows code and looks just as usable as the boss's screen, so players may try to edit the list from it. — Show Kev's screen as off or locked, or as a screensaver after he leaves.

### 1-judge: report.md

Verdict: fixable
- The boss's screen: pointless — a monitor on a boss's desk is normal, but a big screen turned out through the glass "so the floor can read it" has no everyday reason. It only exists so the player can see the list. No real boss would show the layoff list to the open floor.
- The loose cable: fits — plugs work loose, and a boss kneeling to fix one is believable. But a power plug that is half out turns the screen off; it doesn't make static.
- The boss's desk phone: fits — every boss's desk has one.
- Kev's desk phone: fits — normal desk phone, and the ringing reads well.
- Lin's mobile: fits — people check their phones on a Friday afternoon.
- The boss's chair: fits — ordinary, and sitting in it reads as usable.
- The coffee machine: misleading — every office has one, and it's a thing players will try to use. Nothing says the player can. This is exactly the "coffee machine you can't use" case.
- The kitchen door: fits — ordinary.
- The restroom: fits — ordinary, and clearly a place, not a tool.
- The elevator: fits — every office lobby has one; it sits behind glass, so it reads as scenery.
- Kev's bag: fits — on a Friday afternoon, going home with your bag is normal.
- Your desk: fits — where an office worker starts.
- The wall clock: fits — though a real clock doesn't turn red at 3:40.
- Set dressing: fits — mugs, plant, earbuds and a meeting room are ordinary. But Kev's lit screen with code on it looks as usable as the boss's screen.

## Problems
- blocker: The boss's screen faces out through the glass so the whole floor can read the layoff list. No boss would show a confidential list to the staff, and the setup exists only for the puzzle. — Make it his ordinary desk monitor facing his chair. The player sees the list by walking behind the desk or sitting in the chair. The static and padlock stay the same.
- blocker: The coffee machine looks usable, but the player can't use it. — Let the player pour a cup that does nothing (a short "you're not thirsty, you're panicking" beat), or keep the machine out of view in the kitchen so it reads as scenery.
- should: Kev's screen shows code and looks just as usable as the boss's screen, so players may try to edit the list from it. — Show Kev's screen as off or locked, or as a screensaver after he leaves.
- nit: A half-pulled power plug turns a screen off; it doesn't make static. — Show a black screen with a "no power" flicker, or make it the video cable, which really does cause a broken picture.
- nit: The wall clock turning red is a game marker, not something an office clock does. — Keep the clock plain and put the red on the HUD timer, or have Lin glance at the clock instead.
- nit: The card icons 📧 📦 point to an email and a box, and neither is in the room. Players will look for them. — Change the icons to things that exist (📞, 🖥️) or drop them.

<!-- /cold-read:props -->

<!-- cold-read:joke {"verdict":"works","date":"2026-11-15","commit":"500ae5a","hash":"3f9b5afdac7babda49928a4214ab1bbe7835ddc00dc9c635143c2cfda1572f67","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","ways":"c4d895c4e3faf0bc0ecec65f48dd49e8bde16f8e2e95a311078493e7edc46695","prompts":"a4db88684bb737e23a87ca6a38aba544ee72fc48b552bd042e8767ee6f88c0a7"},"model":"default","tally":{"funny":2,"payoff":0,"mild":2,"chore":1,"flat":1,"undescribed":0},"problems":{"blocker":0,"should":4,"nit":1}} -->
## joke: works
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 3f9b5afdac7b: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 2 funny, 0 payoff, 2 mild, 1 chore, 1 flat, 0 undescribed.
Problems: 0 blocker, 4 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 26 s | $0.07 |
| all | | 26 s (the steps add up to 26 s) | $0.07 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The win ending is flat. It shows the list without your face, which is the literal result and nothing more. — End on whose face fills the gap. For example, the boss's email auto-fills the empty slot with Kev, whose name is still on his phone screen. Or the card shows the sheet with three faces and the boss holding up a box for the man who went home early.
- E2 [should] The "do nothing" ending is a chore. Your face flies off and you carry a box out, exactly as you'd expect. — Add one thing that undercuts it. For example, as you walk out with your box, the boss's screen goes to static again and he calls "Kev?" at the empty desk.
- E3 [should] Route 1 (Lin's phone) is mild. Waiting for her phone to buzz is a timing errand. — Give her phone a joke, like a picture you can read from across the floor. For example, she's reading the same layoff news that you're living through, or she's on a job site, which hints that she's scared too.
- E4 [should] The "caught by the boss" card is the obvious picture. — Make the card the coffee instead: he still holds the mug you sent him for while he points you to the door. Or he hands you the box and asks you to plug the cable back in on your way out.

### 1-judge: report.md

Verdict: works
- Fix his computer, then wait for Lin's phone (win): mild — The funny picture is the setup: the boss sees you kneeling behind his desk, points at you and leaves for coffee, and you fix the computer that is about to fire you. The route's own moment is just waiting for her phone to buzz and watching a 4-second timer. That is mostly timing, with only a small joke in it.
- Fix his computer, then ring Kev's desk (win): funny — You use the boss's own phone to make the call he made twice today, to a man who has gone home. Lin turns round to look at an empty, ringing desk while you cross yourself off. Kev being gone is what saves you.
- Do nothing (lose): chore — This is the obvious version. The sheet flies off and you carry your box out. No joke is added.
- Seen by Lin (lose): funny — Lin has just escaped the list. She sees the gap you leave, pictures her own face filling it, and goes to tell the boss to protect herself. He comes back, your face drops back onto the sheet, and he locks it and glares. It's dark office comedy that anyone who has worked in an office will recognise.
- Caught by the boss (lose): mild — He walks in with his coffee and finds you in his chair, crossing yourself off his list. That's a good picture. The card then just shows him pointing to the door, which is what you'd expect.
- The ending: flat — The win card is the sheet with three faces and no yours. That is the obvious version of winning, and nothing tops it.

## Problems
- should: The win ending is flat. It shows the list without your face, which is the literal result and nothing more. — End on whose face fills the gap. For example, the boss's email auto-fills the empty slot with Kev, whose name is still on his phone screen. Or the card shows the sheet with three faces and the boss holding up a box for the man who went home early.
- should: The "do nothing" ending is a chore. Your face flies off and you carry a box out, exactly as you'd expect. — Add one thing that undercuts it. For example, as you walk out with your box, the boss's screen goes to static again and he calls "Kev?" at the empty desk.
- should: Route 1 (Lin's phone) is mild. Waiting for her phone to buzz is a timing errand. — Give her phone a joke, like a picture you can read from across the floor. For example, she's reading the same layoff news that you're living through, or she's on a job site, which hints that she's scared too.
- should: The "caught by the boss" card is the obvious picture. — Make the card the coffee instead: he still holds the mug you sent him for while he points you to the door. Or he hands you the box and asks you to plug the cable back in on your way out.
- nit: In "seen by Lin", your face popping back onto the list is a nice beat, but the loss card is just a copy of "caught by the boss". — Give it its own card. For example, Lin waves at you as you leave, the same way she waved goodbye to Kev.

<!-- /cold-read:joke -->

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"f57dd2aeceed92348d77db3c666e2b8637e312c4581d5d9cdc042559da6c6958","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","premise":"b9ba6f6ea575f143d3b313bc893a6cdfd22bca67b388c6745f80a52c724f7cdc","prompts":"f5883160f1d3858e02431a0eee883b8939a1a09664f6e614e9f267258968625e"},"model":"default","problems":{"blocker":1,"should":3,"nit":3}} -->
## premise: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs f57dd2aeceed: the card, premise.md, the pass's prompts.
Problems: 1 blocker, 3 should, 3 nit.
Earlier problems: 1 fixed, 1 still there, 3 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 13 s | $0.02 |
| 2-review | report.md | 136 s | $0.57 |
| all | | 150 s (the steps add up to 150 s) | $0.59 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 no longer applies: The jacket and hoodie routes are gone, and so is the disguise.
- E2 no longer applies: The "room" is now the whole floor, and the boss no longer counts heads at desks.
- E3 still there: Banging is now shown failing at 3:00, which helps, and the window is now 3:26–3:31, about 8 real seconds. But Kev pushed the plug home on screen, and at 3:26 it is loose again with nothing to cause it. The level needs it, so it happens.
- E4 no longer applies: There is no hoodie any more.
- E5 fixed: The card now says "You're on the layoff list… Get off it", which fits both a list of faces and a list of names.

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] Banging is now shown failing at 3:00, which helps, and the window is now 3:26–3:31, about 8 real seconds. But Kev pushed the plug home on screen, and at 3:26 it is loose again with nothing to cause it. The level needs it, so it happens. (recurring: premise-level?)
- E2 [blocker] **The boss leaves the one person on his list alone at his computer.** The player hits this at 3:26–3:31, when they start on the cable and get "☕ 👉 you, 🔌 🚪". At 3:11 the player watched him lock the list for a restroom trip, so they have seen that he guards it. Now he walks off for 15 minutes and leaves you, a man he is about to fire, to bring that same list back up on his screen. No real boss does that, and it goes against the one thing the player has seen drive him. It is also trial and error. The only fix the player has seen (Kev's, at 3:08) left him sitting happily at his desk. Nothing on screen shows him wanting coffee or suggests that fixing the cable gets rid of him. Players will try it only because the prompt appears. — Have him give up after Kev's phone rings out (about 3:28): a thought of ☕, and he walks to the kitchen and leaves the screen dead. In the default loop he comes back and kneels at the cable himself. Now he never knowingly leaves you alone with it, and the player can work out the plan: dead screen plus empty office means plug it in yourself.
- E3 [should] **Lin watches you dial, then turns to the empty desk anyway.** This happens on the ring route. She is facing the glass office and sees you pick up the boss's handset. A second later Kev's desk rings, and she stares for 3 seconds at a desk she saw Kev leave. At 3:26 she turned only to shrug. — Make it what people really do: after two rings she leans back to answer the phone for Kev, and her back is to the glass for as long as she holds it. It reads better and it is funnier: she says "hello?" to you.
- E4 [should] **The punchline happens off-screen.** The edit happens about ten minutes before the payoff, and at 3:45 the boss sends the email without a look. That beat is just an absence. The joke is the obvious version: distract the watcher, edit the file. — Give the send a picture. For example, he glances at the attached sheet, which now shows three faces, nods (👍), and sends it.

### 1-card: first-read.md

**Situation:** It's Friday at 3:00 PM. My name is on a list of people being laid off, and the list reaches HR at 3:45. So each loop is probably 45 minutes.

**What I must do:** Get my name off the list. There are a few ways to read that:
- erase my name;
- swap in someone else's name;
- stop the list from reaching HR;
- make myself look too valuable to fire.

**If I fail:** HR gets the list with my name on it and I'm fired. The 📦 is probably the cardboard box of desk belongings in the loss picture.

**Questions:**
- Is the list an email (📧) or a printout? Do the two icons mean two copies, or two routes it could take?
- Is 📦 the failure, a tool or a delivery? Are the icons hints or goals?
- Does a late delivery count as a win, or just a stall?
- Is framing a coworker allowed, or is it the intended solution?
- Who wrote the list? Can they be persuaded?
- Does "it" in "get off it" mean the list or the delivery?
- The title "The Layoff List" just restates the card. Is that meant to be the joke?

### 2-review: report.md

Verdict: fixable

**Best thing:** Lin turns round to stare at Kev's empty desk as it rings. Behind her, through the glass, the boss's layoff list blows up to billboard size and a red line crosses out your face.

## Earlier problems
- E1: no longer applies. The jacket and hoodie routes are gone, and so is the disguise.
- E2: no longer applies. The "room" is now the whole floor, and the boss no longer counts heads at desks.
- E3: still there (should). Banging is now shown failing at 3:00, which helps, and the window is now 3:26–3:31, about 8 real seconds. But Kev pushed the plug home on screen, and at 3:26 it is loose again with nothing to cause it. The level needs it, so it happens.
- E4: no longer applies. There is no hoodie any more.
- E5: fixed. The card now says "You're on the layoff list… Get off it", which fits both a list of faces and a list of names.

## Problems
- blocker: **The boss leaves the one person on his list alone at his computer.** The player hits this at 3:26–3:31, when they start on the cable and get "☕ 👉 you, 🔌 🚪". At 3:11 the player watched him lock the list for a restroom trip, so they have seen that he guards it. Now he walks off for 15 minutes and leaves you, a man he is about to fire, to bring that same list back up on his screen. No real boss does that, and it goes against the one thing the player has seen drive him. It is also trial and error. The only fix the player has seen (Kev's, at 3:08) left him sitting happily at his desk. Nothing on screen shows him wanting coffee or suggests that fixing the cable gets rid of him. Players will try it only because the prompt appears. — Have him give up after Kev's phone rings out (about 3:28): a thought of ☕, and he walks to the kitchen and leaves the screen dead. In the default loop he comes back and kneels at the cable himself. Now he never knowingly leaves you alone with it, and the player can work out the plan: dead screen plus empty office means plug it in yourself.
- should: **Lin watches you dial, then turns to the empty desk anyway.** This happens on the ring route. She is facing the glass office and sees you pick up the boss's handset. A second later Kev's desk rings, and she stares for 3 seconds at a desk she saw Kev leave. At 3:26 she turned only to shrug. — Make it what people really do: after two rings she leans back to answer the phone for Kev, and her back is to the glass for as long as she holds it. It reads better and it is funnier: she says "hello?" to you.
- should: **The punchline happens off-screen.** The edit happens about ten minutes before the payoff, and at 3:45 the boss sends the email without a look. That beat is just an absence. The joke is the obvious version: distract the watcher, edit the file. — Give the send a picture. For example, he glances at the attached sheet, which now shows three faces, nods (👍), and sends it.
- nit: **The ring window doesn't match the premise.** premise.md says Lin looks round for "about 4 seconds", but the code gives 3.2 s (`RING_LOOK`). The edit takes 3.0 s and she notices after 0.4 s, so you have about half a second to get from the phone to the screen. — Make RING_LOOK about 4 s, as the premise says.
- nit: **The story says the gap gets filled, but nobody fills it.** Lin's 📋 + her face + 😨 tells the player that a list with a gap gets filled. The win then shows a three-face list going to HR, and nobody fills the gap. — Accept it as comic logic, or show a fourth "?" face in the win card for Monday.
- nit: **first-read expects things the game doesn't allow.** The reader guessed at swapping in another name, stopping the email, or making yourself look valuable. None of these is possible. They also asked whether "it" means the list or the email. The card names only the trouble, so this costs some exploring and misleads nobody. — No change needed. If you want, "Get your face off it" would rule out the idea of stopping the email.

The name, the card and the badge (📧 📦) give nothing away: they name the trouble, not the way out. Everything else the routes need is shown before the player needs it: Kev's plug fix, the padlock, Kev going home, the boss's phone ringing Kev's desk, Lin turning to that ring, and Lin's phone buzzing at uneven times.

<!-- /cold-read:premise -->

<!-- cold-read:verbs {"verdict":"works","date":"2026-11-15","commit":"500ae5a","hash":"8ed703ffb1d9dbea01d8ad047025b06f453923154d6d4dcff53ae4b5f1b6af4a","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","verbs":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","prompts":"061e477a6c379be6b6b5b6834f94ffc76cc7e18374b9322d5658da9920b335c4"},"model":"none","tally":{},"problems":{"blocker":0,"should":0,"nit":0}} -->
## verbs: works
Recorded 2026-11-15 at commit 500ae5a, by the tool (model: none). Inputs 8ed703ffb1d9: the card, the verb sheets, the pass's prompts.
Items: .
Problems: 0 blocker, 0 should, 0 nit.
Earlier problems: 0 fixed, 0 still there, 0 no longer applies.
Recorded works: the level has no items to carry: no verb sheets, nothing to read.

| Step | Reply | Time | Cost |
|---|---|---|---|
| all | | 0 s (the steps add up to -) | - |

### Ledger
The earlier record's open problems, as this run's reader marked them.


### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- none

<!-- /cold-read:verbs -->

<!-- cold-read:faces {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"c6221d26a34b99499671a718036410c5c513a977feb08947f58848fd90515f16","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","checks":"6731fc3e728d4b08d3098c512bb3e3ffa4d83facb473d08bf8d56d99772dfcac","faces":"9915c647a06eb867394f280b80f92f65e4b2de624be9b5733d36c2cfa60a971d","prompts":"7b1353c6de0c5cf6c70013ea3cb8b0b9dfaae148125f1ffbe7155582b0b04938"},"model":"default","tally":{"clear":20,"vague":3,"misread":2},"problems":{"blocker":3,"should":2,"nit":0}} -->
## faces: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs c6221d26a34b: the card, route-checks.js, the bubbles, the pass's prompts.
Items: 20 clear, 3 vague, 2 misread.
Problems: 3 blocker, 2 should, 0 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 58 s | $0.17 |
| 2-judge | report.md | 125 s | $0.52 |
| all | | 184 s (the steps add up to 184 s) | $0.68 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 23 the meaning is reversed. Papers, then a hand pointing at me, reads "give papers to Topknot," but the boss is demanding the papers I'm holding. Getting caught with the printout is a route, so the player misreads why they got caught. — Show my face, then an arrow, then the boss's own face, or open palm 🫴 + 📄 aimed at the boss. Use a darker page with visible lines and a red mark that matches the paper icon over my head.
- E2 [blocker] In 15, X-arms plus Spiky's face reads "Spiky's fired" in a layoffs level, when it most likely means "no need for Spiky / he isn't coming." That misleads the player about what their action did to the repair route. — Replace with 🙅 + ☎️ ("cancel the call") or 👍 + 🖥️ ("screen's fine now"), and keep the X away from a coworker's face.
- E3 [blocker] In 17, "plug + door" has no single reading, and the dead-screen/power route depends on it. — Show the actual thing: plug + 🖥️ + ❓ ("why is my screen unplugged?"). If the door is the point, draw the specific room (server closet) as its own glyph rather than a generic door.
- E4 [should] In 16, the pointing hand is supposed to mean "you, do this," but the hand comes after the object, so it reads as "this goes to you." The same grammar in 20, 22 and 23 makes the player guess each time. — Lead every order with a pointing hand at the face: 👉 + Topknot + ☕ ("you, coffee"). Save object → face for "give to."
- E5 [should] In 13, the coat plus envelope reads as "you're fired" alone, and as a detective. In its frame it says nothing clear about the boss sending the list at 3:45. — Use 📧 + 🏠 (send, then go home), or put a clock showing 3:45 next to the email.

### 1-read: reading.md

# reading.md

There are three drawn character faces I can't name. I've called them:
- **Spiky** has spiky dark hair and a green collar.
- **Topknot** has brown hair tied in a bun on top and a red shirt. Maybe this is me, the player?
- **Glasses** is a woman with a black bun, big glasses and a teal top.

1. Speech, angry face: "I'm angry," or "grr, annoyed at you."
2. Speech, red desk phone + Spiky: "Call Spiky," or "Spiky is on the phone / Spiky called."
3. Speech, thumbs up: "OK, good, yes."
4. Speech, black electrical plug: "Unplug it," or "plug it in." I can't tell which way it goes. Maybe "power"?
5. Thought, face with blue forehead and open mouth: "Oh no, I'm scared or dreading something."
6. Speech, smiling face: "I'm happy" or "nice, thanks."
7. Thought, calm face with closed eyes: "Relieved, phew," or "content."
8. Speech, waving hand + house: "Bye, I'm going home." Or, ominously: "you're being sent home."
9. Speech, waving hand: "Hi" or "bye." I can't tell which.
10. Thought, Spiky + red question mark: "Where's Spiky?" or "Who is Spiky? What's up with him?"
11. Thought, person shrugging: "Dunno, whatever."
12. Speech, tired face with a puff from the mouth: "Sigh, I'm exhausted." Could also be sick.
13. Speech, tan trench coat + envelope with an "E" on it: "Coat and email." Maybe "a detective / HR investigator sent an email," or "grab your coat, you got the email," meaning fired. This was the hardest one to read.
14. Speech, weary face: "Ugh, I can't take this," or "please, no."
15. Speech, person crossing arms in an X + Spiky: "No Spiky," "Spiky's out / gone / fired," or "don't tell Spiky."
16. Speech, coffee cup + finger pointing right + Topknot: "Bring coffee to Topknot," or "Topknot wants coffee."
17. Speech, plug + brown door: "Unplug the thing by the door," or "pull the plug and leave." Ambiguous.
18. Speech, party popper: "Yay, celebration!" It might be a party or a sarcastic "congrats."
19. Thought, clipboard + Glasses + scared face: "Glasses has a list, and I'm afraid I'm on it." Or "afraid of Glasses' checklist / evaluation."
20. Speech, finger pointing right + Topknot + computer monitor: "Topknot's computer," or "go to Topknot's computer," or "Topknot, use the computer."
21. Speech, closed padlock: "Locked," or "it's locked, you can't get in."
22. Speech, pointing finger + Topknot + angry face: "Topknot is angry," or "I'm angry at Topknot."
23. Speech, grey blank sheets of paper + pointing finger + Topknot: "Give the papers to Topknot," or "these papers are for Topknot." The papers are hard to read. They could be documents or a printout.
24. Thought, monitor + question mark: "Where's my computer?" or "What's wrong with the computer?"
25. Alert (spiky starburst), red ! + pointing finger + Topknot: "Hey, it's Topknot!" as an alarm. Either "Topknot is caught" or "look out, Topknot."

**Notes:**
- I can't tell what direction the pointing finger means. It always points right toward the face, so it could mean "give to," "go to" or "it's them."
- The plug is ambiguous: plug in or unplug?
- Thought bubbles (clouds) and speech bubbles are clearly different. The starburst plainly means an alert.
- Read together, the set hints at layoffs: coat + email, house, the X over Spiky, Glasses with a clipboard.

### 2-judge: report.md

Verdict: fixable

- 01: clear — the boss, at a monitor full of static, is angry.
- 02: clear — the boss, still at the dead screen, says "call Spiky."
- 03: clear — Spiky, at his desk phone, says "OK, coming."
- 04: clear — Spiky at the boss's monitor says "plugged in." The plug's direction is unclear alone, but the screen works two minutes later.
- 05: clear — I'm scared. The list on the screen has my face picked out in red.
- 06: clear — the boss is pleased now that his screen works.
- 07: clear — Glasses thinks "phew."
- 08: clear — Spiky says "bye, I'm going home."
- 09: clear — Glasses waves back: "bye."
- 10: clear — the boss, at a dead screen again, thinks "where's Spiky?"
- 11: clear — Glasses shrugs: "dunno."
- 12: clear — the boss sighs, worn out by the dead screen.
- 13: vague — the boss sits alone with the list on screen. Coat plus envelope could mean "email it, then go home," but alone it reads "grab your coat, you got the email," i.e. fired. The trench coat also reads as a detective.
- 14: clear — at 3:45 I've lost: "ugh."
- 15: misread — the boss to me as Spiky walks past. It probably means "no need for Spiky / he isn't coming." In a level about layoffs, an X next to a coworker's face reads as "Spiky's fired."
- 16: vague — the boss to me. Coffee, then a hand pointing at my face, reads "coffee for Topknot." The boss more likely means "you, go get coffee."
- 17: vague — the boss at a dead screen: "plug… door." Plug it in by the door? Pull the plug and leave? Something about power by the door? Nothing in the frame settles it.
- 18: clear — I've won: "yay."
- 19: clear — Glasses thinks "I'm scared I'm on the list."
- 20: clear — Glasses tells the boss "Topknot was at the computer." Bubbles 24 and 25 back this up.
- 21: clear — the boss is locked out of his own computer.
- 22: clear — the boss to me: "I'm mad at you."
- 23: misread — in the frame I'm carrying a paper. The boss means "you, hand over those papers," but the glyphs read "give papers to Topknot," the opposite direction. The grey, nearly blank page is also hard to recognise.
- 24: clear — the boss thinks "what's going on with my computer?"
- 25: clear — the boss, alarmed: "Topknot!" I'm caught at his desk.

## Problems
- blocker: In 23 the meaning is reversed. Papers, then a hand pointing at me, reads "give papers to Topknot," but the boss is demanding the papers I'm holding. Getting caught with the printout is a route, so the player misreads why they got caught. — Show my face, then an arrow, then the boss's own face, or open palm 🫴 + 📄 aimed at the boss. Use a darker page with visible lines and a red mark that matches the paper icon over my head.
- blocker: In 15, X-arms plus Spiky's face reads "Spiky's fired" in a layoffs level, when it most likely means "no need for Spiky / he isn't coming." That misleads the player about what their action did to the repair route. — Replace with 🙅 + ☎️ ("cancel the call") or 👍 + 🖥️ ("screen's fine now"), and keep the X away from a coworker's face.
- blocker: In 17, "plug + door" has no single reading, and the dead-screen/power route depends on it. — Show the actual thing: plug + 🖥️ + ❓ ("why is my screen unplugged?"). If the door is the point, draw the specific room (server closet) as its own glyph rather than a generic door.
- should: In 16, the pointing hand is supposed to mean "you, do this," but the hand comes after the object, so it reads as "this goes to you." The same grammar in 20, 22 and 23 makes the player guess each time. — Lead every order with a pointing hand at the face: 👉 + Topknot + ☕ ("you, coffee"). Save object → face for "give to."
- should: In 13, the coat plus envelope reads as "you're fired" alone, and as a detective. In its frame it says nothing clear about the boss sending the list at 3:45. — Use 📧 + 🏠 (send, then go home), or put a clock showing 3:45 next to the email.

<!-- /cold-read:faces -->

<!-- cold-read:tells {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"b4e5ca3504bd0edddbdd4409172ec20d87e0621c995618317b8bdc552f3132db","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","checks":"6731fc3e728d4b08d3098c512bb3e3ffa4d83facb473d08bf8d56d99772dfcac","tells":"69209e288bf8441f602ac45d19f5f0503f4c11f144c5a2a24b05d0f8acbffe41","prompts":"f1d914aecdc56ea365960569f2587c9563e9f9a055deb88f13ba995eb473a219"},"model":"default","tally":{"visible":1,"faint":2,"invisible":1},"problems":{"blocker":3,"should":3,"nit":1}} -->
## tells: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs b4e5ca3504bd: the card, route-checks.js, the before and after pictures, the pass's prompts.
Items: 1 visible, 2 faint, 1 invisible.
Problems: 3 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 36 s | $0.12 |
| 2-judge | report.md | 55 s | $0.17 |
| all | | 90 s (the steps add up to 90 s) | $0.29 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 01, plugging the cable in changes nothing on screen. The only feedback is an unreadable bubble on the boss, so the player can't learn that the cable causes the Kev branch. **Fix:** draw a visible cable that goes from hanging loose to plugged in, with a spark. Make the monitor flicker on, and enlarge the boss's 🙅 bubble.
- E2 [blocker] In 04, Lin getting up to face the ringing desk was read as a fired worker leaving, so the reader got the cause of the distraction wrong. **Fix:** in 03 AFTER, give Lin a 👀 or ☎️ bubble and turn her head toward Kev's desk right away. Give her a different walk and pose from anyone being sent out (no box of belongings, no path to the exit).
- E3 [blocker] The edit in 04 was read as "firing the highlighted person". If that portrait is the player, they will completely misunderstand why they won. **Fix:** make the highlighted portrait an obvious match for the player's sprite (same hair and shirt). On strike, slide the card off the list, draw a thick red line through it, and show a 😮‍💨 bubble over the player.
- E4 [should] In 02, the boss leaves without the ☕👉 bubble the route depends on, so his exit looks unrelated to the cable. **Fix:** have the boss show a big ☕👉 bubble pointing at the player before he leaves.
- E5 [should] The ring circle in 03 is tiny and already appears in 02's BEFORE frame. **Fix:** show the call only when the player dials. Add a phone-shake animation, a ☎️ bubble over the desk, and a brief line from the player's phone to Kev's phone.
- E6 [should] The strike in 04 is too subtle to notice at play size, and the panel gives no feedback. **Fix:** stamp a large ❌ over the portrait, grey the card out, and make the panel flash.

### 1-read: reading.md

# reading.md

The held-item box (the hand slot in the top bar) is **empty in every BEFORE and every AFTER**. None of these actions picked up or used up an item.

**01 (3:03 → 3:03):** The player is the red-haired woman in the corner office. In BEFORE, the boxy machine on her desk (left end, roughly at 110,165) has a yellow outline and an "E" prompt. In AFTER the outline is gone, and a small white bubble has appeared just above the bald man in the suit, who is standing below her desk. The monitor still shows static and nothing else moved. **My guess:** she used that desk machine and the man reacted. I can't make out the bubble's emoji, so I can't tell what she actually did.

**02 (3:29 → 3:31):** The player is in the same spot and uses the same outlined machine. In AFTER, the static on her monitor is replaced by four faces, and a larger see-through copy of those faces floats next to the desk. The bald man has left the office and is standing in the hallway with a yellow vision cone. The teal worker at the upper-left desk has stood up and is walking. A teal cone now covers the lower-left desk and the lobby, and that desk's monitor looks greyed out. The prompt moved to the next item on the desk. **My guess:** she switched on a staff lineup (a "who goes" screen), and the boss and the teal worker started moving because of it. This is the biggest change of the four.

**03 (3:32 → 3:32):** The player is one step to the right, with the outlined item in the middle of the desk (it looks like a phone). The big four-face panel is open in both halves, with the second face highlighted red. In AFTER the outline and "E" are gone, and the phone on the lower-left desk now has a ringing circle around it. The boss and the teal worker haven't moved. **My guess:** she phoned that desk. Its owner may be the red-highlighted face, but nothing in the picture confirms that.

**04 (3:32 → 3:34):** The player is now in front of the desk (about 179,200), using the monitor (outlined, "E" above it). In BEFORE, a dotted line runs from the teal worker, who is sitting at the upper-left desk, down to the lower-left corner near the lobby door. In AFTER, the player is turned with her back to us, facing the desk. The red-highlighted second face on the big panel looks marked or slashed, but at this size I'm not certain. The teal worker is up and walking again. The bald man has gone to the far right of the hallway. The phone on the lower-left desk is still ringing. **My guess:** she confirmed or "fired" the highlighted person on the computer, and that worker started their walk out. The dotted line in BEFORE looks like a preview of that route. The changes on the panel itself are subtle. If that mark is what's meant to tell me "you just did it," I nearly missed it.

**Overall, as a first-time player:** you can see that something happens in every image, but in 01 and 03 the only clue is a tiny bubble or a ring far from the player. In 02 and 04 people walk away, but nothing clearly links that to what the player pressed.

### 2-judge: report.md

Verdict: fixable

- 01.png: invisible. The player plugged the boss's cable back in while Kev was still in the office, which starts the "🙅 Kev's job" route. The reader saw the outline disappear and a small bubble above the boss, but couldn't read the emoji or tell what she did. The cable looks the same in both halves and the monitor stays static, so nothing shows that the cable is now plugged in.
- 02.png: visible. The player plugged the cable in again. The static became four faces, and the reader correctly read that as the screen being switched on. The boss then walked out into the hallway, but there's no ☕👉 bubble anywhere, so the reader could only guess why he left.
- 03.png: faint. The player called Kev's empty desk. The reader did spot the ringing circle on the lower-left phone and guessed it was a call. But the circle is small and far from the player, nobody reacts to it in AFTER, and a similar circle is already on that phone in 02's BEFORE frame, which weakens it as a sign.
- 04.png: faint, and read as something else. The player struck a name on the boss's PC. The reader wasn't sure the slash on the second portrait was there at all. They took the teal worker getting up as "the fired worker walking out", when it's most likely Lin turning toward the ringing desk. They also read the edit as firing someone. The highlighted portrait has red hair, so it may be the player's own name, which would make the edit a self-rescue, not a firing.

## Problems
- blocker: In 01, plugging the cable in changes nothing on screen. The only feedback is an unreadable bubble on the boss, so the player can't learn that the cable causes the Kev branch. **Fix:** draw a visible cable that goes from hanging loose to plugged in, with a spark. Make the monitor flicker on, and enlarge the boss's 🙅 bubble.
- blocker: In 04, Lin getting up to face the ringing desk was read as a fired worker leaving, so the reader got the cause of the distraction wrong. **Fix:** in 03 AFTER, give Lin a 👀 or ☎️ bubble and turn her head toward Kev's desk right away. Give her a different walk and pose from anyone being sent out (no box of belongings, no path to the exit).
- blocker: The edit in 04 was read as "firing the highlighted person". If that portrait is the player, they will completely misunderstand why they won. **Fix:** make the highlighted portrait an obvious match for the player's sprite (same hair and shirt). On strike, slide the card off the list, draw a thick red line through it, and show a 😮‍💨 bubble over the player.
- should: In 02, the boss leaves without the ☕👉 bubble the route depends on, so his exit looks unrelated to the cable. **Fix:** have the boss show a big ☕👉 bubble pointing at the player before he leaves.
- should: The ring circle in 03 is tiny and already appears in 02's BEFORE frame. **Fix:** show the call only when the player dials. Add a phone-shake animation, a ☎️ bubble over the desk, and a brief line from the player's phone to Kev's phone.
- should: The strike in 04 is too subtle to notice at play size, and the panel gives no feedback. **Fix:** stamp a large ❌ over the portrait, grey the card out, and make the panel flash.
- nit: In 04, the dotted path from Lin's desk to the lobby door looks like a planned exit route, which feeds the "walk-out" misreading. **Fix:** remove it, or point it at Kev's desk.

<!-- /cold-read:tells -->

<!-- cold-read:outcomes {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"63054cbaf957abd025d80faa8aae342be319995853300e243dcaffb46ecc7e79","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","checks":"6731fc3e728d4b08d3098c512bb3e3ffa4d83facb473d08bf8d56d99772dfcac","ways":"c4d895c4e3faf0bc0ecec65f48dd49e8bde16f8e2e95a311078493e7edc46695","ends":"cce087dfe60437382db0ceee05dd29696de91d9a9819c129bc1b2904ab9f2be2","prompts":"2c4a72c45c8e3d7e595f0928af4c2741d3a3e144356d832e05fe3e1263e3a558"},"model":"default","tally":{"clear":4,"unclear":2,"wrong":1},"problems":{"blocker":3,"should":1,"nit":2}} -->
## outcomes: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 63054cbaf957: the card, route-checks.js, premise.md's ways to win and lose, the runs' last frames, the pass's prompts.
Items: 4 clear, 2 unclear, 1 wrong.
Problems: 3 blocker, 1 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 82 s | $0.33 |
| 2-judge | report.md | 69 s | $0.27 |
| all | | 151 s (the steps add up to 151 s) | $0.60 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In run 6 the player shows 🎉 at 3:45 (18.png), then the caught card comes up. The moment before the card says "win," and the card says "caught." — Fix: when the list goes out with the player's face, show 😩 or 😨, the same as runs 1–3. Never show 🎉 unless the player's face is off the saved list.
- E2 [blocker] The loss where Lin tells uses the same card as being caught by the boss: an angry boss pointing, and a box. Lin isn't in the last pictures at all. So the reader blamed the player's spot by the door and never learned that Lin was the step that broke. A player would retry the same edit and only avoid the door. — Fix: give this loss its own card. Put Lin in the background pointing at the player 👉 next to the angry boss, and add Lin's face to the icon row (for example 👀 Lin 👉 📦). Or at 3:44, show the boss glaring with Lin standing beside his office.
- E3 [blocker] Runs 1, 2 and 3 end on the same card, and the last moments look almost the same. In runs 2 and 3 the player is beside their own desk with an E prompt over its computer, and the reader took that computer as the thing that failed. The real failures (being waved off with 🙅 + Kev's face, and the padlock at the restroom) happen much earlier and are never recalled. — Fix: on the loss card, add a small picture or icon for the last step the player got wrong. Show 🙅 + Kev's face for run 2, the 🔒 screen for run 3, and an empty slot for run 1. Don't leave the E prompt lit over the player's own computer during the 3:42–3:45 lead-up.
- E4 [should] In run 6 the boss's 👉 + face + 😠 bubble and his red view cone at 3:44 look like he spots the player at that moment. Yet play goes on to 3:45 and he still sends the list. The reader found this "odd." — Fix: at 3:44, show the 🔒 over his screen and the player's face back on it, so the glare reads as "I know already," not as a fresh catch.

### 1-read: reading.md

# How each loop ended

**Run 1: loss, laid off (not caught)**
- **What tells me:** The clock reaches 3:45 with the player standing at their desk under a 😩 bubble. The end card has a red border. It shows the boss at a monitor with the player's face boxed in red on the list, and the player walking out carrying a box with a plant in it. Below that are the icons 📧 📦 😢, and both slots are empty.
- **Does the card match the last moment?** Yes.
- **What broke:** I can't tell. At 3:42 the player is standing at their own desk, and nothing in the pictures shows them trying anything. The boss's monitor still shows the grid of faces.

**Run 2: loss, laid off**
- **What tells me:** At 3:42 the player is at their own computer, which is highlighted with an "E" prompt. At 3:45 they have a 😩 bubble. The end card is the same red "box and plant" card as run 1.
- **Does the card match the last moment?** Yes.
- **What broke:** Using their own computer didn't help. In the winning runs (4 and 5), the boss's monitor already shows a different screen at 3:43. Here it still shows the grid of faces. So whatever changes that screen didn't happen, but the step itself isn't shown.

**Run 3: loss, laid off**
- **What tells me:** The pictures are almost identical to run 2: the "E" prompt at 3:42, 😩 at 3:45, and the red box-and-plant card.
- **Does the card match the last moment?** Yes.
- **What broke:** The same as run 2. Using their own computer didn't take them off the list, and the boss's screen never changes.

**Run 4: win**
- **What tells me:** At 3:45 the player has a 🎉 bubble, and a red desk phone has appeared in the top bar. The end card has a green border. The list now has only three faces and the player's isn't one of them. The player is sitting at their desk looking smug, and a coffee cup sits on the boss's desk. Below are the icons ☎️ 📧 😏, and the phone fills one slot.
- **Does the card match the last moment?** Yes.

**Run 5: win**
- **What tells me:** This matches run 4, except the item earned is a smartphone instead of a desk phone. Again there's 🎉 at 3:45, then the green card showing three faces and a 😏 player.
- **Does the card match the last moment?** Yes.

**Run 6: caught**
- **What tells me:** At 3:44 the player is just outside the boss's glass office, inside the boss's red view cone. The boss's bubble shows 👉, the player's face, and 😠. The end card has a red border and shows a furious boss (in an angry starburst) pointing at the player, who leaves with the box. The icons are 😠 👉 📦.
- **Does the card match the last moment?** **No.** At 3:45 the player has a 🎉 bubble, as if they had won, but the card says they were caught. It's also odd that the boss seems to spot them at 3:44 and play still goes on to 3:45.
- **What broke:** Hanging around the boss's door while he could see it. I can't tell what the player was trying to do there.

**Run 7: caught early (3:40)**
- **What tells me:** The player is sitting in the boss's chair, and the boss's screen is blown up to show the face list with the player's face boxed. The boss, outside the door, has a thought bubble of a computer and "❓". In the next picture a red starburst shows "! 👉" and the player's face. The end card is the same angry "caught" card.
- **Does the card match the last moment?** Yes. The card shows 3:40, though the caption gives 3:41.
- **What broke:** Editing the list at the boss's computer. The boss came back through the door before the player finished and got away.

### 2-judge: report.md

Verdict: fixable
- Run 1: clear. The player did nothing, and the boss sent the list with their face on it. The reader saw a "laid off" loss with no attempt made, which is right.
- Run 2: unclear. The player tried the boss's cable while Kev was still there and was waved off. The reader saw the right loss but blamed "using their own computer." The last pictures show only the player at their own desk with its E prompt, and nothing of the failed try.
- Run 3: unclear. The player went to the boss's screen while he was in the restroom and found it locked. The reader called it "the same as run 2," again blaming the player's own computer. Nothing at the end points to the locked screen.
- Run 4: clear. A win by ringing Kev's desk. The reader saw 🎉, the green card with three faces and the ☎️ in the slot.
- Run 5: clear. A win by waiting for Lin's mobile. The reader saw the same win with the smartphone in the slot.
- Run 6: wrong. Lin saw the edit and told the boss, and he put the player's face back and sent the list. The reader saw a "caught" loss but blamed "hanging around the boss's door." They also saw the player's 🎉 bubble at 3:45 right before the caught card. I checked 18.png, and the 🎉 really is there.
- Run 7: clear. The boss came back while the player was editing, and the player was caught. The reader read it correctly. The card says 3:40 but the caption says 3:41.

## Problems
- blocker: In run 6 the player shows 🎉 at 3:45 (18.png), then the caught card comes up. The moment before the card says "win," and the card says "caught." — Fix: when the list goes out with the player's face, show 😩 or 😨, the same as runs 1–3. Never show 🎉 unless the player's face is off the saved list.
- blocker: The loss where Lin tells uses the same card as being caught by the boss: an angry boss pointing, and a box. Lin isn't in the last pictures at all. So the reader blamed the player's spot by the door and never learned that Lin was the step that broke. A player would retry the same edit and only avoid the door. — Fix: give this loss its own card. Put Lin in the background pointing at the player 👉 next to the angry boss, and add Lin's face to the icon row (for example 👀 Lin 👉 📦). Or at 3:44, show the boss glaring with Lin standing beside his office.
- blocker: Runs 1, 2 and 3 end on the same card, and the last moments look almost the same. In runs 2 and 3 the player is beside their own desk with an E prompt over its computer, and the reader took that computer as the thing that failed. The real failures (being waved off with 🙅 + Kev's face, and the padlock at the restroom) happen much earlier and are never recalled. — Fix: on the loss card, add a small picture or icon for the last step the player got wrong. Show 🙅 + Kev's face for run 2, the 🔒 screen for run 3, and an empty slot for run 1. Don't leave the E prompt lit over the player's own computer during the 3:42–3:45 lead-up.
- should: In run 6 the boss's 👉 + face + 😠 bubble and his red view cone at 3:44 look like he spots the player at that moment. Yet play goes on to 3:45 and he still sends the list. The reader found this "odd." — Fix: at 3:44, show the 🔒 over his screen and the player's face back on it, so the glare reads as "I know already," not as a fresh catch.
- nit: In run 7 the loss card says 3:40, but the caption for 14.png says 3:41. — Fix: make the clock on the card match the clock at the moment of capture.
- nit: In run 7, 13.png, the boss coming back has no coffee in his hand. The cause (he was back from coffee) is only implied. — Fix: draw the cup in his hand as he comes in the door.

<!-- /cold-read:outcomes -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"aae19a6bed30a1e91a9a85b0e7ae050ac72e99c4cce98811b5a040261907b3d6","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","shots":"5425362f57d7f2ab7229005a400352f1dc5acf6cf028dc3b02f66124693037a4","pictures":"a4b01f174bf908e91d8d1d8d30617090bd7f982f94457f47dc2878f5579b45af","prompts":"373358f2a720c528dbf043178a7e12d5e465c477911cb7d1ae56f78e1d3c10a4"},"model":"default","problems":{"blocker":5,"should":4,"nit":4}} -->
## pictures: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs aae19a6bed30: the card, shots.js, the rendered shots, the pass's prompts.
Problems: 5 blocker, 4 should, 4 nit.
Earlier problems: 1 fixed, 1 still there, 7 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 103 s | $0.55 |
| 2-compare | report.md | 206 s | $0.83 |
| all | | 308 s (the steps add up to 308 s) | $1.38 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 no longer applies: the earlier hot-and-takes-off-the-hoodie beat isn't in this level.
- E2 still there: Lin's wave-back is missing from 09. Kev's leaving no longer depends on her knowing, so it misleads nobody.
- E3 no longer applies: there's no disguise reveal in this level.
- E4 fixed: Lin now acts on what she sees: she walks over and tells the boss (21–22). That beat is misread for other reasons (see 22).
- E5 no longer applies: there's no "passing as the boss" beat.
- E6 no longer applies: there's no hoodie loss card. The told-on route now ends with the list being restored, not a card.
- E7 no longer applies: there's no empty-chair loss card.
- E8 no longer applies: there's no "at your desk in the hoodie" loss.
- E9 no longer applies: there's no "boss saw Kev was you" card.

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The plug, which is the whole way into his computer, is never seen. It's missing at 3:00 (01), drawn as a desktop gadget (03), Kev isn't kneeling at it (04), the bubble hides it (11), and the E sits on the boss's head (13). The reader's story has no plug in it at all. — Draw a floor socket with a cable and a sparking half-out plug from 3:00, and have the screen flicker in step with it. Show Kev crouched at it with a 🔌 bubble at 04, and put the highlight and E on the plug itself at 13.
- E2 [blocker] The reader never learns why the boss walks out and leaves the person on the list alone at his unlocked computer (14). His "coffee, plug it in, get out" bubble is never captured, so it looks like a boss doing what no boss would. — Retake 14 while his ☕👉🔌🚪 bubble is up and he points at you.
- E3 [blocker] Lin's role is backwards in the reading. The phone calls (16, 18) are meant to turn Lin away, but the reader thinks they lure the boss. Her witnessing (20) reads as her own worry, and her telling (22) reads as her stalling him for you. — Draw Lin's look-lines throughout: to the ringing phone (16), down to her mobile (18), and to the big sheet (20). Use a full-size 👉 plus your face plus 🖥 bubble at 22, with the boss turning toward the office.
- E4 [blocker] In 23 you stand at the boss's elbow while he angrily restores the list and ignores you. That breaks the rule shot 25 teaches (he sees you in his office, so you're fired), and the reader concludes "I'm caught." — Retake 23 with you already back at your own desk, and show his hand dragging your face back into the row.
- E5 [blocker] 15 and 17 are taken at the wrong moment. The intent says the boss is at the coffee machine, but at 3:34 he's only at the kitchen doorway, so 17 reads as "he's coming back." — Move both captures to 3:36, or reword the intent to "on his way to the kitchen."
- E6 [should] The third list portrait (dark bun) looks like Lin, so the reader thinks she's on the list. That muddies her relief at 06 and her motive at 20. — Give that portrait a clearly different person (beard, glasses, grey suit), and show Lin's own face in her relief bubble.
- E7 [should] The boss's phone call at 12 reads as "holding a cup, shaking." — Draw a curly-corded handset at his ear and a ☎️ plus Kev's face bubble, the same as in 02.
- E8 [should] The 🧥 at 26 reads as "a figure in a yellow shirt," possibly HR. — Animate him putting the coat on, with a 📧➡️ bubble.
- E9 [should] The win card (27–28) shows him drinking coffee, not sending the list, so the 3:45 send doesn't link to the card's 📧. — Draw his finger on the send button, with a little envelope flying off the screen.

### 1-read: reading.md

# BUSYWORK: The Layoff List, a cold read

**Card:** It's Friday at 3:00, you're on the layoff list, and the list goes to HR at 3:45. The card icons are 📧 📦, which I read as "email, then you're packing a box." The top bar shows a clock, an envelope with a box, an empty hand slot, a loop counter and two empty dashed slots.

**01** It's 3:00 and a big red "loop 1" stamp is on screen. A bald man in a suit sits in the glass corner office with an annoyed bubble, and his monitor shows static. I'm the woman in red at the middle desk. A woman in teal and a man in camo sit at desks on the left. I can't tell what the little "V" marks over people's heads are: antennae, headphones, or a typing sign.

**02** The boss's bubble shows a red phone and the camo guy's face, and the camo guy's desk phone is ringing. So the boss is calling him in. That's clear.

**03** The camo guy answers with a thumbs up. A small device with "…" has appeared on the boss's desk. It might be an intercom, but I can't tell.

**04** At 3:06 the camo guy is in the boss's chair and the boss stands beside the monitor, which now shows a grid of tiles. The teal woman has turned around and seems to be holding something.

**05** A big panel pops up with four portraits: a grey-haired woman, me in a red frame, someone with a dark bun, and a blond man. The boss smiles, and the teal woman and I both have scared thought bubbles. This is the list, and I'm on it. Why is the teal woman scared? She might be the bun.

**06** The boss's bubble is a smug face. The camo guy leaves and the teal woman's bubble turns to relief, so maybe she isn't on the list after all. I can't tell which portrait is hers.

**07–08** The camo guy goes back to his desk. At 3:12 the boss's monitor shows a padlock and he walks out into the open-plan area. The lesson is that the computer locks when he leaves.

**09** The camo guy is carrying a bag, with a wave and a house in his bubble, so he's going home early. The boss is down by the restroom sign. I can't tell if the camo guy leaving matters to me.

**10** At 3:21 the boss walks the bottom corridor and the teal woman's phone glows on her desk.

**11** This is a different loop. At 3:26 the boss is back at his desk looking annoyed, the monitor shows static again, and the teal woman is on her phone.

**12** At 3:29 the boss is shaking or sweating while holding a cup, and the camo guy's empty desk has a ringing phone. I can't read the shake lines: he could be angry, hot, or on a caffeine buzz.

**13** I'm behind the boss's desk while he's still sitting there, and an "E" prompt hangs over his head. That's either a very brave move or something I'm misreading. The fast-forward button is gone in this shot and the next several, and I don't know why.

**14** At 3:31 the desk phone is highlighted with "E" and a faded copy of the list floats nearby. The boss is walking out.

**15** At 3:34 the boss is heading toward the kitchen and I'm still at his desk.

**16** At 3:32 the list panel is open and I'm standing at his monitor.

**17** At 3:34 my portrait has a red X scrawled over it, so I'm editing myself off the list. The boss is coming back down the right side.

**18** I'm at the monitor with an "E" prompt while the list stays up.

**19** At 3:36 the monitor shows something like an email window and the boss is at the kitchen coffee machine. The desk phone is highlighted, but I can't tell whether I'm sending or calling.

**20** An orange progress ring is around me, so an action is taking time. The teal woman's thought bubble has tiny list faces in it, which suggests she's worried about the list too.

**21** At 3:37 my portrait is half crossed out. The teal woman leaves her desk and the boss heads back.

**22** The teal woman stops the boss in the hallway, and her bubble has a cake or a monitor in it. If she's stalling him for me, that's a great gag, but the bubble is too small to read.

**23** At 3:42 the clock is red. The boss is back in his office, right next to me, with an angry bubble. I'm caught.

**24** At 3:44 his bubble is a pointing finger, my face, and an angry face, and I'm walking out. Clear.

**25** At 3:40 a big starburst reads "! 👉 my face" and his vision cone has turned red. Getting spotted is shown well.

**26** At 3:43 I'm back at my own desk with an "E" prompt on my typewriter. The boss's bubble shows a figure in a yellow shirt and an envelope. I can't read the figure. Is it HR, or me?

**27 (win, teal border)** The boss drinks coffee in front of a list that now has three faces and none of them is mine. I sit at my desk looking smug. The icons are ☎️ 📧 😏, and the first slot fills with a red phone. I think the phone stands for the trick I used.

**28 (win)** It's the same picture, but the icons are 📱 📧 😏 and the second slot fills with a mobile phone, so it's a second route to the same win. The two slots look like a tally of routes. There's a note pinned to the back wall that I can't read.

**29 (loss, red border)** My row on the list is highlighted, and I'm carrying a box with a plant, crying. The icons are 📧 📦 😢, and the note on the wall is now marked in red. It matches the card exactly.

**30 (loss at 3:40)** The boss stands up, points and glares while I leave with my box. The icons are 😠 👉 📦, meaning caught and fired early. This is the funniest frame in the set.

**Unclear across the set:** the "V" marks over heads, the static on the monitor, the "…" device, the boss's shaking, the wall note, the small bubbles in 22 and 26, and which portrait is the teal woman.

## The story I think this level tells
The boss calls the camo guy in at 3:00 and shows him the layoff list, and the camo guy goes home early.
I'm on the list, the boss's computer locks whenever he leaves, and he takes trips to the restroom and the coffee machine.
The scheme is to get him away from his desk with a phone call, either from the desk phone or from the teal woman's mobile, then cross my face off before 3:45.
If he catches me in his office, I'm fired early. If I run out of time, the list goes out by email and I pack a box.
If I pull it off, someone else goes in my place and I sit there smirking. Editing yourself off a layoff list is a dark, good joke, and the endings sell it.

### 2-compare: report.md

Done reading all the files and the disputed shots; here's the report.

Verdict: fixable

- **01 partly.**
  - Reading: "his monitor shows static… I can't tell what the little 'V' marks over people's heads are."
  - Intent: the boss is angry at a static screen, and a cable behind his desk runs to a floor socket with the plug half out.
  - Cause: a missing cue. The 3:00 frame has no cable, socket or plug at all. The socket only appears at 03, as a small "··" box on the desktop, not on the floor.
  - Fix: from 3:00, draw a cable that droops off the back edge of the desk to a wall socket on the floor, with the plug visibly sticking out and a small spark at the gap. Have the static flicker in time with the spark.
- **02 reads.**
- **03 partly.**
  - Reading: "A small device with '…' has appeared on the boss's desk. It might be an intercom."
  - Intent: Kev answers with a thumbs up. The reading gets that part.
  - Cause: a glyph used as a prop. The socket is drawn as a two-dot face on the desktop, so it reads as a gadget, not a power point.
  - Fix: same as 01. Show the socket on the floor or wall behind the desk, with a cable and a half-out plug, and keep it there from 3:00.
- **04 misread.**
  - Reading: "the camo guy is in the boss's chair and the boss stands beside the monitor."
  - Intent: Kev kneels at the floor socket and pushes the plug in, with a plug in his bubble.
  - Cause: a missing cue. No plug bubble shows, Kev isn't kneeling, and his sprite sits where the chair would be.
  - Fix: put Kev on the floor beside the desk (a crouched sprite), with his hand on the drawn plug and a 🔌 bubble. Hold the frame on the moment the plug clicks in and the screen goes from static to clean.
- **05 reads.** The reader suspects the dark-bun portrait is Lin (see Problems).
- **06 reads.**
- **07 partly.**
  - Reading: covered together with 08: "The camo guy goes back to his desk."
  - Intent: Lin turns and looks at you, knowing you're on the list.
  - Cause: a missing cue. Lin turns, but nothing says it's toward you or why.
  - Fix: draw a short dotted look-line from Lin to you and give her a 😬 bubble with your face in it.
- **08 reads.**
- **09 reads.** Lin's wave-back is missing from the picture (E2).
- **10 reads.**
- **11 partly.**
  - Reading: "This is a different loop… the monitor shows static again."
  - Intent: the same loop at 3:26. The plug behind his desk has come half out again.
  - Cause: a missing cue. The boss's 😣 bubble covers the socket, so the cause of the static is hidden. The reader also wrongly assumes a reset, even though the counter still shows 1.
  - Fix: place the boss's bubble on the far side of his head, and show the plug popping out (a little spark and a jolt on the cable) at the moment the screen goes back to static.
- **12 partly.**
  - Reading: "shaking or sweating while holding a cup… I can't read the shake lines."
  - Intent: the boss phones Kev's desk again, and nobody answers.
  - Cause: a missing cue, plus cause and effect too far apart. The handset is drawn like a cup, there's no call bubble, and the ringing phone is a whole room away.
  - Fix: give him the same ☎️ plus Kev's face bubble as in 02, add a curly cord from the handset to his desk phone, and add a 🔇 or ❓ when nobody picks up.
- **13 misread.**
  - Reading: "I'm behind the boss's desk while he's still sitting there, and an 'E' prompt hangs over his head. That's either a very brave move or something I'm misreading."
  - Intent: you're at the half-out plug, which lights up as usable, while he's busy calling Kev.
  - Cause: a glyph used as a prop, and a missing cue. The highlight frames an unclear box on the desk, and the E sits on the boss's head, so it looks like you're interacting with him.
  - Fix: highlight the drawn floor plug, with the E beside it, away from the boss. Also give the boss a glance at you with a 🔌❓ bubble so it's clear he expects help.
- **14 partly.**
  - Reading: "the desk phone is highlighted… The boss is walking out."
  - Intent: you fixed the plug, and the boss left you to it ("coffee, then plug it in and get out"). His screen is unlocked with the list on it.
  - Cause: a missing cue. His ☕👉🔌🚪 bubble is never in a shot, so the reader has no idea why he walks off and leaves a doomed employee at his computer.
  - Fix: retake 14 one beat earlier, while the ☕👉🔌🚪 bubble is up, with him pointing at you.
- **15 wrong moment.** The intent puts the boss "in the kitchen… at the coffee machine." At 3:34 he's still at the kitchen doorway on the open floor. He only reaches the machine around 3:36 (see 19). The reader correctly saw him "heading toward the kitchen."
- **16 partly.**
  - Reading: "the list panel is open and I'm standing at his monitor."
  - Intent: you've called Kev's empty desk from the boss's phone, so Lin turns round to it with her back to the office.
  - Cause: a missing cue. You aren't holding a handset, there's no call bubble, and the distant ringing phone and Lin's turn are too small to tie to you.
  - Fix: put the handset at your ear with a ☎️ plus Kev's-desk bubble, and draw a dotted line from Lin's eyes to the ringing phone.
- **17 wrong moment.** The intent says the boss is "still at the coffee machine." At 3:34 he's at the kitchen doorway. The reader took it as "coming back down the right side," which turns a safe moment into a dangerous one. The face-off itself reads.
- **18 misread.**
  - Reading: "I'm at the monitor with an 'E' prompt while the list stays up."
  - Intent: Lin's mobile buzzes on her desk, and she picks it up and turns away to read it.
  - Cause: a missing cue. The buzzing mobile is a tiny glyph, Lin hasn't moved yet, and your E prompt is the only thing that stands out.
  - Fix: retake the shot when Lin lifts the phone. Use a bigger rattle plus glow, and put a 📱 bubble over her as she turns away from the glass.
- **19 partly.**
  - Reading: "something like an email window… I can't tell whether I'm sending or calling."
  - Intent: you struck your face off while Lin was reading her mobile and closed the sheet. She's facing the office again but never saw.
  - Cause: a missing cue. Nothing shows that Lin missed it.
  - Fix: give Lin a calm 😌📱 bubble as she puts the phone down. Leave the desk phone unhighlighted so it doesn't look like the next step.
- **20 partly.**
  - Reading: "The teal woman's thought bubble has tiny list faces in it, which suggests she's worried about the list too."
  - Intent: Lin sees you striking your face off. Her thought is the list plus her own face, frightened.
  - Cause: a missing cue. There's no sight line from her to the big sheet, her face isn't picked out in the bubble, and nothing in it shows you.
  - Fix: draw a solid look-line from Lin to the sheet. Make the bubble show your face being struck, then her own face, then 😨.
- **21 reads.**
- **22 misread.**
  - Reading: "If she's stalling him for me, that's a great gag, but the bubble is too small to read."
  - Intent: Lin tells on you (👉, your face, a screen).
  - Cause: a missing cue. The bubble is unreadable at its size, and the "line from her to him" doesn't come across as pointing back at the office.
  - Fix: use a full-size bubble, make Lin's arm point back at the glass office, and have the boss turn his head and cone toward it.
- **23 misread.**
  - Reading: "The boss is back in his office, right next to me, with an angry bubble. I'm caught."
  - Intent: he puts your face back on the list.
  - Cause: a missing cue, plus staging. You're still standing at his elbow, and his 😠 is aimed at no one.
  - Fix: retake the shot with you already back at your own desk. Show his finger dragging your face back into the row, with the red strike line peeling off.
- **24 reads.**
- **25 reads.** No coffee cup is visible. The HUD shows 3:40 against the engine's 3:41 because the HUD truncates; that's a nit.
- **26 partly.**
  - Reading: "a figure in a yellow shirt and an envelope. I can't read the figure. Is it HR, or me?"
  - Intent: he's packing up for the weekend (a coat and an email).
  - Cause: a glyph used as a prop. 🧥 at this size reads as a person.
  - Fix: show him putting the coat on, with arms in sleeves, and a 📧➡️ bubble. Or swap the coat glyph for a hat on a coat hook.
- **27 reads.** The card shows him drinking coffee, not sending the list.
- **28 reads.**
- **29 reads.**
- **30 reads.**

## Earlier problems
- E1: no longer applies — the earlier hot-and-takes-off-the-hoodie beat isn't in this level.
- E2: still there (nit) — Lin's wave-back is missing from 09. Kev's leaving no longer depends on her knowing, so it misleads nobody.
- E3: no longer applies — there's no disguise reveal in this level.
- E4: fixed — Lin now acts on what she sees: she walks over and tells the boss (21–22). That beat is misread for other reasons (see 22).
- E5: no longer applies — there's no "passing as the boss" beat.
- E6: no longer applies — there's no hoodie loss card. The told-on route now ends with the list being restored, not a card.
- E7: no longer applies — there's no empty-chair loss card.
- E8: no longer applies — there's no "at your desk in the hoodie" loss.
- E9: no longer applies — there's no "boss saw Kev was you" card.

## Problems
- blocker: The plug, which is the whole way into his computer, is never seen. It's missing at 3:00 (01), drawn as a desktop gadget (03), Kev isn't kneeling at it (04), the bubble hides it (11), and the E sits on the boss's head (13). The reader's story has no plug in it at all. — Draw a floor socket with a cable and a sparking half-out plug from 3:00, and have the screen flicker in step with it. Show Kev crouched at it with a 🔌 bubble at 04, and put the highlight and E on the plug itself at 13.
- blocker: The reader never learns why the boss walks out and leaves the person on the list alone at his unlocked computer (14). His "coffee, plug it in, get out" bubble is never captured, so it looks like a boss doing what no boss would. — Retake 14 while his ☕👉🔌🚪 bubble is up and he points at you.
- blocker: Lin's role is backwards in the reading. The phone calls (16, 18) are meant to turn Lin away, but the reader thinks they lure the boss. Her witnessing (20) reads as her own worry, and her telling (22) reads as her stalling him for you. — Draw Lin's look-lines throughout: to the ringing phone (16), down to her mobile (18), and to the big sheet (20). Use a full-size 👉 plus your face plus 🖥 bubble at 22, with the boss turning toward the office.
- blocker: In 23 you stand at the boss's elbow while he angrily restores the list and ignores you. That breaks the rule shot 25 teaches (he sees you in his office, so you're fired), and the reader concludes "I'm caught." — Retake 23 with you already back at your own desk, and show his hand dragging your face back into the row.
- blocker: 15 and 17 are taken at the wrong moment. The intent says the boss is at the coffee machine, but at 3:34 he's only at the kitchen doorway, so 17 reads as "he's coming back." — Move both captures to 3:36, or reword the intent to "on his way to the kitchen."
- should: The third list portrait (dark bun) looks like Lin, so the reader thinks she's on the list. That muddies her relief at 06 and her motive at 20. — Give that portrait a clearly different person (beard, glasses, grey suit), and show Lin's own face in her relief bubble.
- should: The boss's phone call at 12 reads as "holding a cup, shaking." — Draw a curly-corded handset at his ear and a ☎️ plus Kev's face bubble, the same as in 02.
- should: The 🧥 at 26 reads as "a figure in a yellow shirt," possibly HR. — Animate him putting the coat on, with a 📧➡️ bubble.
- should: The win card (27–28) shows him drinking coffee, not sending the list, so the 3:45 send doesn't link to the card's 📧. — Draw his finger on the send button, with a little envelope flying off the screen.
- nit: The unexplained "V" marks over every head. — Drop them, or make them a recognisable 💤 or typing sign.
- nit: The fast-forward button disappears in 13–22 with no explanation. — Grey it out instead of hiding it, with a small 🚫👀 badge.
- nit: The note pinned to the back wall of the end cards can't be read even when it turns red. — Enlarge it to a readable mini copy of the list with your face on it.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"broken","date":"2026-11-15","commit":"500ae5a","hash":"3236c2ba7423810cd6e593512d55b8adf1760e23325d3f8d610cdc98abee495e","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","checks":"6731fc3e728d4b08d3098c512bb3e3ffa4d83facb473d08bf8d56d99772dfcac","ways":"c4d895c4e3faf0bc0ecec65f48dd49e8bde16f8e2e95a311078493e7edc46695","frames":"f9972df9650a62ab79501eabee02a0fec9465dc8102c5d64744ce6fcacf69436","prompts":"9e3c9df1ce09f69e814a3665f47fd26f19cf1da4d95956302759c3b798c0d63d"},"model":"default","problems":{"blocker":7,"should":4,"nit":1}} -->
## replay: broken
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 3236c2ba7423: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the pass's prompts.
Problems: 7 blocker, 4 should, 1 nit.
Earlier problems: 0 fixed, 0 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 123 s | $0.60 |
| 1-read-2 | reading.md | 110 s | $0.47 |
| 1-read-3 | reading.md | 52 s | $0.21 |
| 2-compare | report.md | 159 s | $0.58 |
| all | | 282 s (the steps add up to 444 s) | $1.86 |

### Ledger
The earlier record's open problems, as this run's reader marked them.


### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] the edit, the act that wins the level, can't be seen.**
- E2 [blocker] Lin turning away, the core of both win routes, goes unseen.**
- E3 [blocker] the boss's "☕👉 you, 🔌🚪" reaction reads as routine.**
- E4 [blocker] the cable fix itself is invisible, and the prompt points at the wrong thing.**
- E5 [blocker] the 🙅 in run 2 reads as "a sheet of paper."**
- E6 [blocker] touching the locked screen in run 3 gives no feedback.**
- E7 [blocker] you show 🎉 at 3:45 in run 6, while the boss points at you and sends the list with your face on it** (`run-06/18.png`).
- E8 [should] the "orange object" and the E prompt over your own desk.**
- E9 [should] Lin's "📋 her face 😨" thought was read as your face** (`run-06/12.png`).
- E10 [should] the boss's 🧥📧 was read as "person + 📧."** The coat doesn't read as a coat, so the "he's leaving, he'll send what's on screen" beat is lost. Fix: draw the boss putting his coat on, and make the 🧥 bigger with a hanger.
- E11 [should] your call to Kev's desk sounds like the boss's 3:27 call.** The reader wondered if the 3:32 ringing was "the boss's call still going." Fix: the boss's ring stops when he hangs up, shown by the handset dropping. Your call starts with the handset at your ear and a dashed line to the phone at Kev's desk.

### 1-read-1: reading.md

# Reading: The Layoff List

## Run 1: loss

- **3:00** I'm seated at the middle desk. The bald man in the corner office has an angry bubble, and his screen shows static.
- **3:02** Bald man: phone + a coworker's face. The man in the olive jacket gives a 👍.
- **3:08** A big popup shows four faces, with mine boxed in red. Both the woman in teal and I think 😨. Olive man goes to the bald man's desk, and a faint plug bubble appears.
- **3:09–3:16** Olive man waves and shows a 🏠 bubble, then leaves. The bald man walks off to the bottom right, and his screen shows a padlock.
- **3:26–3:32** The screen is back to static. A phone rings on olive man's empty desk. Bald man thinks of olive man's face + ?, sighs, walks to the wall and shows a plug bubble. His screen shows the list again.
- **3:42** Bald man: person + 📧.
- **3:45** I look upset, and his screen shows an email being sent.

**Ending:** a loss. The end picture shows the list with me boxed, the bald man making a V sign, and me carrying a box. The icons are 📧 📦 😢, the same two as the card plus 😢.

**Cause:** I did nothing all loop, so the default result happened.

**Not reactions:** The 3:08 popup and both 😨 bubbles happen with no input from me. They are scripted.

## Run 2: loss

- **3:00–3:02** I stand up at once and walk to the corner office door.
- **3:04** I use something inside the office, near the left end of his desk. The bald man is up beside his screen with a bubble: a sheet of paper (unclear) + olive man's face.
- **3:06** I walk back. Olive man is at the bald man's desk with a plug bubble.
- **3:08 onward** I sit at my desk holding a small orange object, and an **E** prompt shows over my desk. From here everything matches Run 1 minute for minute: popup, 🏠, padlock, static, ringing phone, plug at 3:32, 📧 at 3:42.
- **3:45** Same ending picture and icons.

**Ending:** the same loss as Run 1.

**Cause:** I can't tell what the 3:04 action was. Probably I picked up the orange object, but nothing visible changed because of it. I never used the E prompt.

**Maybe not reactions:**
- The 3:04 bubble came while I was in the room, but olive man was walking in too, so it may be about him.
- The plug bubble also shows faintly at 3:08 in Runs 1 and 3, so it's part of the routine.

## Run 3: loss

- **3:00–3:16** Same as Run 1, and I stay at my desk.
- **3:26** I'm suddenly standing, holding the orange object, with the **E** prompt over my desk. **No "used the thing" caption is recorded**, and I can't see what happened between 3:16 and 3:26.
- **3:27–3:45** Same as Run 1.

**Ending:** the same loss.

**Cause:** The orange object changed nothing.

**Note:** Either the recorder missed an action, or the object turns up by itself. I can't tell which. In both runs where I had the object, I never used it at the E prompt.

### 1-read-2: reading.md

I read all three runs: two wins and one loss. The main unknown is which action actually takes the player off the list. In runs 4 and 5 the player does the same things at the boss's desk while it's empty, and I can't see what each "used the thing" did.

**Shared opening (3:00–3:29, the same in every run).** I've written it out once so each run stays under 200 words.
- 3:00 Bald boss at his desk, angry bubble, screen showing static.
- 3:02 Boss shows a desk phone and a face. The man in the green jacket at the bottom-left desk gives a thumbs-up.
- 3:08 Green-jacket man is in the boss's office. A big list of four faces pops up with the player's face boxed in red. The player and the woman in teal at the left desk both get scared thought bubbles.
- 3:09 The teal woman's bubble turns relieved. Green-jacket man leaves.
- 3:16 Green-jacket man waves with a house icon and goes. The boss's screen shows a padlock. The boss is out at the bottom right.
- 3:26 Boss is back at his desk, angry. The player has left their desk.
- 3:27 Boss shows a phone and a face. The phone on the empty bottom-left desk rings.
- 3:29 Boss shows coffee and a pointing face, then a plug and a door. He leaves.

---

## Run 4: WIN
- 3:31 Player is at the boss's empty desk, with the boss's desk phone highlighted. Used the thing. The list pops up.
- 3:32 Used the thing at the same desk. The bottom-left desk phone rings again.
- 3:34 Used the thing from the chair side of the desk. The boss is near the kitchen. The phone is still ringing.
- 3:43 Player is back at their own desk. Boss is back, with a bubble showing a person and an envelope.
- 3:45 Player shows a party bubble.
- End: the boss's screen shows three faces and the player's isn't one of them. Icons: desk phone, envelope, smirk. Desk phone is the one icon collected.

**Why it was won:** the player's face is gone from the list when it's sent.
**Cause:** something done at the boss's desk between 3:31 and 3:34. Which of the three uses did it, I can't tell.
**Might not be the player:** the bottom-left phone was already ringing at 3:27, before the player did anything. The 3:32 ringing may be the player's call or the boss's call still going.

## Run 5: WIN
- 3:31 Same as run 4: used the thing at the boss's phone.
- 3:34 Used the thing from the chair side. This time no phone rings.
- 3:43–3:45 Same as run 4: boss shows person and envelope, player shows party bubble.
- End: the same three-face list. Icons: **mobile phone**, envelope, smirk. The mobile phone fills the second icon slot.

**Why it was won:** the same as run 4.
**Cause:** the 3:31 or 3:34 action. The only visible difference from run 4 is skipping the 3:32 action, and that changes the winning icon from desk phone to mobile. I can't see a mobile phone being used anywhere, so why the icon is a mobile is unclear to me.

## Run 6: LOSS
- 3:31 Used the thing at the boss's phone, the same as before.
- 3:35 Player is still at the boss's desk. The teal woman is back at her desk facing the office, and her bubble shows a list, the player's face and fear. Boss is in the kitchen.
- 3:37 Used the thing at the desk again. Teal woman walks off toward the boss.
- 3:38 She points (bubble: pointing hand, player's face, computer). A red dashed line runs to the player. Player is near their own desk.
- 3:42 Boss is back at his desk, angry. The list is showing again with four faces, the player's boxed in red.
- 3:43 Padlock bubble over the boss.
- 3:44 Boss shows pointing hand, player's face, angry face.
- 3:45 Player shows a party bubble. They think they won.
- End: the list has the player boxed in red. Angry boss is pointing at the player, who is carrying a box with a plant. Icons: angry face, pointing hand, box. No icon collected.

**Why it was lost:** the teal woman saw the player at the boss's computer and told the boss.
**Cause:** staying at the desk until 3:37. In runs 4 and 5 the player left by 3:34, which was before she was back at her desk facing that way.
**Might not be the player:** her walk at 3:37 could just be part of her routine, but her bubble names the player, so I count it as a reaction. The party bubble at 3:45, after the player had already been caught, is misleading.

### 1-read-3: reading.md

I've read the mission card and all 14 pictures from the only recorded loop (run-07). Here is my reading.

# reading.md

## run-07 — LOSS at 3:40

**Beats**
- **3:00** Bald boss at his desk, frowning. You (red top) sit at the middle desk.
- **3:02** Boss bubble: ☎️ + bearded man's face. Bearded man at the bottom-left desk answers 👍.
- **3:08** Bearded man goes into the boss's office. A big screen pops up showing four faces, and yours is boxed in red. Scared-face thoughts appear over you and over the teal woman.
- **3:09** You get up from your desk. Teal woman's thought changes to relief.
- **3:16** Boss's monitor shows a padlock, and the boss walks to the bottom-right restroom. Bearded man and teal woman wave; his bubble is 👋🏠.
- **3:26–3:27** Boss is back and angry. The bearded man is gone. A desk phone pulses. Boss repeats ☎️ + bearded man. You walk toward his office.
- **3:29** You're beside the boss. His bubbles: ☕👉 + a brown-haired woman's face, then 🔌🚪, with a dashed line to the left wall.
- **3:31** You use something at the boss's desk while he walks out. A faded copy of the four-face list floats over his monitor.
- **3:40** You're still at his desk. He comes back, thinks "monitor ?", sees you and shouts "! 👉 you". The list still has you boxed in red.

**Why it ended:** In the end picture the boss is shouting and pointing, and you're holding a box with a plant: 😠👉📦. You got caught.

**Cause:** You stayed at his desk for 9 minutes after using it at 3:31. I can't tell whether the 3:31 action changed anything, because the list looks the same.

**Might not be reactions to you:**
- The 3:08 scared faces appeared when the list popped up, not after anything you did.
- The boss left at 3:31 and also at 3:16, so his walks may just be routine.
- I can't tell whether the 3:29 face is yours.
- The "?" at 3:40 could be about the screen, not about you.

### 2-compare: report.md

Verdict: broken

## Runs

- **Run 1 (do nothing → fail): `explained`.** "I did nothing all loop, so the default result happened." That is right.
- **Run 2 (tried his cable while Kev was still there → 🙅 → fail): `unexplained`.**
  - The reader wrote: "I can't tell what the 3:04 action was. Probably I picked up the orange object, but nothing visible changed because of it."
  - What happened: you reached for the boss's cable while Kev was still in the building, and the boss waved you off (🙅, then Kev's face).
  - Visual cause: a bubble that reads wrong, plus a reaction that could belong to someone else. At bubble size the 🙅 reads as "a sheet of paper (unclear)". Kev walks in during the same frame, so the reader thought the bubble "may be about him." Nothing shows you kneeling at the cable.
  - Fix: the boss turns toward you, holds up a flat palm, and you take a step back. Make 🙅 the only thing in its bubble, then a second bubble shows Kev's face. Draw you kneeling while you work on the cable.
- **Run 3 (tried his screen while he was in the restroom → locked → fail): `unexplained`.**
  - The reader wrote: "I'm suddenly standing, holding the orange object… I can't see what happened between 3:16 and 3:26… The orange object changed nothing."
  - What happened: you tried the boss's computer while it was locked, and nothing happened.
  - Visual cause: a missing cue. Touching a locked screen leaves no trace. The recording has no "used the thing" line and no frame of it (`runs/run-03/captions.md`), and the game shows no feedback either.
  - Fix: when you touch the locked screen, the padlock jolts and flashes red, and you get a 🔒 bubble with a 🤷 shrug.
- **Run 4 (plug the cable in, ring Kev's desk, edit → win): `partly`.**
  - The reader wrote: "something done at the boss's desk between 3:31 and 3:34. Which of the three uses did it, I can't tell." They read the 3:31 use as "the boss's desk phone highlighted". They also said the 3:32 ringing "may be… the boss's call still going."
  - What happened: you plugged the cable in, which sent the boss for coffee. You rang Kev's empty desk, and Lin turned round to look at it. You crossed your face off while her back was turned.
  - Visual causes:
    - The cable fix can't be seen. The E highlight sits on the phone, not on what you used.
    - Lin's turn is shown only by her sight cone swinging, and the reader never noticed it.
    - Your ring sounds the same as the boss's 3:27 ring.
    - The edit looks just like the 3:08 list popup.
  - The reader could see that you won but not why. By your rule, that makes the level broken.
  - Fix: show Lin's head turn with a "?" bubble aimed at the ringing desk, and draw a dashed ☎️ line from you to Kev's phone. The other fixes are listed under Problems.
- **Run 5 (plug the cable in, wait for Lin's mobile, edit → win): `partly`.**
  - The reader wrote: "I can't see a mobile phone being used anywhere, so why the icon is a mobile is unclear to me."
  - What happened: Lin's mobile buzzed and she turned away to read it. You crossed your face off during those seconds.
  - Visual cause: a missing cue. In `runs/run-05/12.png` she sits there with no phone in her hands, no buzz and no bubble. The 📱 icon on the end card names a beat the player never saw.
  - Fix: draw buzz lines around the phone on her desk. Show it in her hand with a 📱 bubble while she turns away, and keep it there until she turns back.
- **Run 6 (edit while Lin was looking → she tells the boss → caught): `explained`.** "The teal woman saw the player at the boss's computer and told the boss." That is the cause and your part in it. The lesson the reader drew from it is wrong, though; see the Lin problem below.
- **Run 7 (edited too late → the boss saw you at his screen → caught): `partly`.**
  - The reader wrote: "You stayed at his desk for 9 minutes after using it at 3:31. I can't tell whether the 3:31 action changed anything, because the list looks the same."
  - What happened: the boss came back while you were in his chair crossing your face off, and caught you doing it.
  - Visual cause: a missing cue. In `runs/run-07/12.png` the edit looks like the list just sitting open. No red line can be seen and there is no progress, so the reader learned that loitering gets you fired. The design says the opposite: loitering only gets you sent back to your desk.
  - Fix: the edit draws a thick red stroke across your face that grows over time, and you hunch over the keyboard with a ✏️ bubble.

## Problems

- **blocker: the edit, the act that wins the level, can't be seen.**
  - When you edit, the sheet that pops out looks the same as the 3:08 popup that scares everyone (`run-04/13.png`, `run-07/12.png`). The red line is too thin to read, and your face never visibly drops out.
  - The reader never names the edit in any run. They put the win down to "something at the desk."
  - Fix: a thick red X draws itself across your face over the 3 seconds. Your portrait then falls out of the row and the remaining three faces slide together. Show a small ✏️ over you in the chair the whole time.
- **blocker: Lin turning away, the core of both win routes, goes unseen.**
  - Her only sign of turning is a cone that swings. The reader never notices it, and in run 6 they invent a different rule: she "is back at her desk" by 3:35, so you must "leave by 3:34". She never left.
  - Fix: turn her whole body and add a bubble: 📱 for the phone route, or a "?" pointing at the ringing desk for the call route. Put a large ⏳ over her head that drains for the 4 seconds she is away.
- **blocker: the boss's "☕👉 you, 🔌🚪" reaction reads as routine.**
  - It is a real reaction to you starting on the cable. The reader filed it under the "shared opening (3:00–3:29, the same in every run)" and in run 7 wrote "I can't tell whether the 3:29 face is yours."
  - Two things cause this. The face in the bubble is a generic brown-haired portrait, so an emoji is standing in for you and failing. The bubble also shows at 3:29, before the 3:31 "used" moment, so the effect comes before its cause.
  - Fix: give your face in every bubble your red top and a red frame, the same as your on-floor marker. Fire the bubble on the first frame of the kneel, with the boss turning to look down at you.
- **blocker: the cable fix itself is invisible, and the prompt points at the wrong thing.**
  - At 3:31 you stand at the desk while the E highlight sits on the desk phone (`run-04/11.png`), so the reader wrote "boss's desk phone highlighted. Used the thing."
  - Kev's fix is just as hard to see: a "faint plug bubble" that the reader only half caught.
  - Fix: draw you on your knees behind the desk with a plug in your hand. When it goes in, the static on the screen clears with a pop. Don't show the E prompt on another object while an action is running.
- **blocker: the 🙅 in run 2 reads as "a sheet of paper."**
  - Kev enters in the same frame, so the one real reaction to you gets credited to him.
  - Fix: as in the run 2 note, a flat-palm gesture aimed at you, you stepping back, and a large 🙅 alone in its bubble before Kev's face.
- **blocker: touching the locked screen in run 3 gives no feedback.**
  - It is one of the designer's listed losses, and it leaves nothing on screen.
  - Fix: the padlock jolts and flashes red, and you get a 🔒🤷 bubble.
- **blocker: you show 🎉 at 3:45 in run 6, while the boss points at you and sends the list with your face on it** (`run-06/18.png`).
  - Nobody celebrates while being fired. The reader wrote "They think they won."
  - Fix: at the send in a loss, show 😰 or 😨, and use 🎉 only when your face is really off the list.
- **should: the "orange object" and the E prompt over your own desk.**
  - When you stand up, something orange shows by you and an E prompt hovers over your desk. In runs 2 and 3 the reader spent their notes guessing what item they had picked up and why they never used it.
  - Fix: tuck the chair in so nothing orange hangs off you. Don't show E prompts on things that do nothing.
- **should: Lin's "📋 her face 😨" thought was read as your face** (`run-06/12.png`).
  - Her motive, saving herself, is lost. The reader thought she was worried for you, then told on you anyway.
  - Fix: frame her face in her teal and show it sliding into the gap your face left on a small sheet.
- **should: the boss's 🧥📧 was read as "person + 📧."** The coat doesn't read as a coat, so the "he's leaving, he'll send what's on screen" beat is lost. Fix: draw the boss putting his coat on, and make the 🧥 bigger with a hanger.
- **should: your call to Kev's desk sounds like the boss's 3:27 call.** The reader wondered if the 3:32 ringing was "the boss's call still going." Fix: the boss's ring stops when he hangs up, shown by the handset dropping. Your call starts with the handset at your ear and a dashed line to the phone at Kev's desk.
- **nit: the 3:08 popup and the edit popup take the same spot and the same size.** Even once the red X is added, open the edit sheet over the boss's desk and not over the meeting table, so the two can't be confused.

<!-- /cold-read:replay -->
