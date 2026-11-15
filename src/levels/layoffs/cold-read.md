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

<!-- cold-read:sense {"verdict":"fixable","date":"2026-11-15","commit":"928798f","hash":"fc1a3e82d15e162c6db7f46991ac7b38e47e1b9184e9e56c226b47de17705334","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","ways":"86e015389a6da3b2a97c25dba10d76a56506b6ce2572aec1184c1a36d9a8c5df","prompts":"4efae5d3d9191596f5720cdf7e7483eea858a949c44cf5579c3f9b7d49f613b3"},"model":"default","tally":{"sensible":3,"stretch":2,"nonsense":0},"problems":{"blocker":1,"should":3,"nit":1}} -->
## sense: fixable
Recorded 2026-11-15 at commit 928798f, by claude -p (model: default). Inputs fc1a3e82d15e: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 3 sensible, 2 stretch, 0 nonsense.
Problems: 1 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 35 s | $0.09 |
| all | | 35 s (the steps add up to 35 s) | $0.09 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Lin "watches his office all day," but she only reacts if she sees the edit itself. A real coworker who knows you're on the list doesn't need to read the screen. Seeing you kneel behind the boss's desk, then sit in his chair at his computer while he's out, is enough to send her to the kitchen. From her desk she couldn't read the edit anyway; the big red X is only a visual for the player. — Make her trigger "you at his desk or computer," not "the edit." Both routes then have to hide the whole visit (getting in, plugging in, editing), not just the 3 seconds of editing.
- E2 [should] If the boss finds you standing in his office, he just sends you back to your desk. A boss who finds someone from his layoff list in his office, with the list unlocked on his screen, would check the list. — If he finds you there after you've edited, have him look at the screen and see the gap. Or let "sent back to your desk" happen only if you haven't touched the list yet.
- E3 [should] He watched Kev fix the static with the plug at 3:05 and smiled, and at 3:42 he plugs it in himself. So why does he call Kev, bang on the screen and go for coffee at 3:20 instead? — Give him a reason. For example, at 3:05 he was on the phone and only saw that Kev fixed it, not how. Then at 3:42, desperate, he goes looking behind the desk and finds it.
- E4 [should] In Route 2, the call to Kev's desk comes from the boss's phone, and Lin knows Kev went home and the boss is in the kitchen. A real person might wonder who is calling from that office. — Make her look brief and incurious, or have a ringing desk phone be normal there and not tied to the boss's line.

### 1-judge: report.md

Verdict: fixable

- Do nothing (lose): sensible — nothing changed, so a boss who is rushing out on a Friday sends the list as he wrote it.
- Route 1, wait for Lin's phone (win): stretch — a buzzing phone turning her away is real, but she could still see you go into his empty office and sit in his chair.
- Route 2, ring Kev's desk (win): stretch — people do glance at a phone ringing behind them, but she would also see you sitting at the boss's desk.
- Seen by Lin (lose): sensible — someone who just got off the list and fears she'll take your place would tell the boss, and he'd come back, put it right, lock it and send it.
- Caught by the boss (lose): sensible — a boss who catches you crossing yourself off his list fires you on the spot.

## Problems
- blocker: Lin "watches his office all day," but she only reacts if she sees the edit itself. A real coworker who knows you're on the list doesn't need to read the screen. Seeing you kneel behind the boss's desk, then sit in his chair at his computer while he's out, is enough to send her to the kitchen. From her desk she couldn't read the edit anyway; the big red X is only a visual for the player. — Make her trigger "you at his desk or computer," not "the edit." Both routes then have to hide the whole visit (getting in, plugging in, editing), not just the 3 seconds of editing.
- should: If the boss finds you standing in his office, he just sends you back to your desk. A boss who finds someone from his layoff list in his office, with the list unlocked on his screen, would check the list. — If he finds you there after you've edited, have him look at the screen and see the gap. Or let "sent back to your desk" happen only if you haven't touched the list yet.
- should: He watched Kev fix the static with the plug at 3:05 and smiled, and at 3:42 he plugs it in himself. So why does he call Kev, bang on the screen and go for coffee at 3:20 instead? — Give him a reason. For example, at 3:05 he was on the phone and only saw that Kev fixed it, not how. Then at 3:42, desperate, he goes looking behind the desk and finds it.
- should: In Route 2, the call to Kev's desk comes from the boss's phone, and Lin knows Kev went home and the boss is in the kitchen. A real person might wonder who is calling from that office. — Make her look brief and incurious, or have a ringing desk phone be normal there and not tied to the boss's line.
- nit: When the boss gets back, the static he left is gone and the list is open. Even a half-awake boss might pause at that. — Give him a quick shrug (🤷) to show he assumes the plug came back by itself.

<!-- /cold-read:sense -->

<!-- cold-read:motives {"verdict":"fixable","date":"2026-11-15","commit":"928798f","hash":"b984e9b25562c2c036ccc386385e3296cabfd02e0bcf7fa0580dcf72fa21b9f1","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","who":"cc96dad64d7a66582c00d19ac2cc8d61c02489ce441fbc00ed5412b448e4b5e7","prompts":"aa0481bd7d2903c1741f536b834919fec681febf17e0865d79a523b4af6bf462"},"model":"default","tally":{"motivated":0,"binds":1,"thin":2,"unmotivated":1,"contradicts":0,"only-you":0},"problems":{"blocker":2,"should":2,"nit":1}} -->
## motives: fixable
Recorded 2026-11-15 at commit 928798f, by claude -p (model: default). Inputs b984e9b25562: the card, premise.md's who does what, the pass's prompts.
Items: 0 motivated, 1 binds, 2 thin, 1 unmotivated, 0 contradicts, 0 only-you.
Problems: 2 blocker, 2 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 39 s | $0.08 |
| all | | 39 s (the steps add up to 39 s) | $0.08 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Lin reads the layoff list over the boss's shoulder for no shown reason, and a real boss would cover it. Her tip-off route rests on this beat. — Give her an errand that puts her in his office, such as dropping off a signature folder at 3:08. While she's there, the boss gets up to take a call or answer the door and she sees the open list. Then show "Headcount: cut 1" on the screen so the player knows one name has to replace another.
- E2 [blocker] The boss's "long way round" has no reason, yet Kev's unseen exit depends on it. — Put a visible cause on the short path before 3:10: a wet-floor sign, a cleaner's cart, or the boss stopping at the water cooler every time.
- E3 [should] The boss locks his screen because the list is open, then leaves the same list on a dead screen at 3:20 without locking it. — Show him jab the keyboard at the dead screen and shrug, or have him lock it blind with a muttered "can't even lock it". Either keeps his habit consistent.
- E4 [should] Kev's wish to go home and his reason for waiting until the boss is out are never shown. — Before 3:10, show his coat on his chair and him checking the clock. Have him glance at the boss's door, or shrink down when the boss looks up, so sneaking out early is visible.

### 1-judge: report.md

Verdict: fixable
- The boss: thin — Most of what he does has an everyday cause the player sees first: lunch, a dead screen, calling IT, the restroom, coffee, his coat at 3:42. He locks his screen at 3:10 "because the list is open on it", and he fixes the cable himself only after he watched Kev do it. Two beats don't hold up. First, nothing explains "the long way round" to the restroom, yet that walk is why he never sees Kev leave. Second, at 3:20 he leaves the same open list on a dead screen and walks off without locking it, a habit the player has just watched him keep.
- Kev: thin — Calling him, the cable fix and going home on a Friday all have a reason. But "wants to go home" is only stated in the prose and never shown on screen. Nothing shows why he waits for the boss to leave before slipping out. With no glance at the clock and no packed bag, it looks like a scripted exit.
- Lin: unmotivated — Her phone and turning-round habits are ordinary and set up before they matter. The 3:08 beat isn't. She is "at her desk all day", yet she walks into the boss's office and reads a layoff list over his shoulder. No reason is given, and no real boss lets a staff member read that list. Her tip-off depends on this beat. It is also never shown that the list has a fixed number of names, so the player doesn't know her face fills your gap until she acts on it.
- The card's rule: binds — The card sets no rule of conduct, only a deadline.

## Problems
- blocker: Lin reads the layoff list over the boss's shoulder for no shown reason, and a real boss would cover it. Her tip-off route rests on this beat. — Give her an errand that puts her in his office, such as dropping off a signature folder at 3:08. While she's there, the boss gets up to take a call or answer the door and she sees the open list. Then show "Headcount: cut 1" on the screen so the player knows one name has to replace another.
- blocker: The boss's "long way round" has no reason, yet Kev's unseen exit depends on it. — Put a visible cause on the short path before 3:10: a wet-floor sign, a cleaner's cart, or the boss stopping at the water cooler every time.
- should: The boss locks his screen because the list is open, then leaves the same list on a dead screen at 3:20 without locking it. — Show him jab the keyboard at the dead screen and shrug, or have him lock it blind with a muttered "can't even lock it". Either keeps his habit consistent.
- should: Kev's wish to go home and his reason for waiting until the boss is out are never shown. — Before 3:10, show his coat on his chair and him checking the clock. Have him glance at the boss's door, or shrink down when the boss looks up, so sneaking out early is visible.
- nit: Nothing on screen explains why the monitor dies again at 3:20. — Have Kev seat the cable halfway and walk off in a hurry at 3:01, so the second failure is set up.

<!-- /cold-read:motives -->

<!-- cold-read:props {"verdict":"fixable","date":"2026-11-15","commit":"928798f","hash":"23f0ec23cb4e1f22a5df1fcbb029436439957ed414c49049c715edb920958da0","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","things":"3696ca1c4e6c5d22519a37819057b09b79072d2b72667721213bbc3863ee5f9f","prompts":"e4a62e7d4c56bb76d5cc46d69b3c0fd96478427c533f15affaaa5f43d93d7558"},"model":"default","tally":{"fits":9,"odd":4,"pointless":0,"misleading":1},"problems":{"blocker":2,"should":3,"nit":1}} -->
## props: fixable
Recorded 2026-11-15 at commit 928798f, by claude -p (model: default). Inputs 23f0ec23cb4e: the card, premise.md's things in the office, the pass's prompts.
Items: 9 fits, 4 odd, 0 pointless, 1 misleading.
Problems: 2 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 41 s | $0.09 |
| all | | 41 s (the steps add up to 41 s) | $0.09 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The boss's screen faces the open floor and shows the layoff list. No boss shows a confidential list to the people on it. The room has been arranged so the player can read the screen. — Turn the screen toward his chair. The player sees the list only by walking into his office or looking over his shoulder from behind his desk.
- E2 [blocker] The coffee machine looks usable and isn't; it's exactly the "coffee machine you can't use" case. — Either let the player pour a cup (which costs time and does nothing else), or put an "Out of order — boss's pods only" note on it that the player can see.
- E3 [should] The card's icons 📧 📦 suggest an email and a box, and neither exists in the room. Players will hunt for an email program or a cardboard box to use. — Change the icons to things in the room (🖥️ 📞), or add the email and the box as plain scenery that is clearly not usable.
- E4 [should] Kev's desk phone looks just as usable as the boss's phone, and the player is never told it isn't. — Make it usable (a call to the boss's desk could do something), or make it clearly not usable, for example by showing Kev's headset plugged in and the handset missing.
- E5 [should] Your desk has no phone or computer, so the boss's kit is the only working equipment on the floor, which points straight at the solution. — Put a phone and a computer on your desk. If they can't change the list, have them show something like "no access."

### 1-judge: report.md

Verdict: fixable

- The boss's screen: odd — a computer on the boss's desk is normal. But he has it turned outward, through the glass, showing the layoff list to the whole floor, and no real boss would do that. His chair is at the other end of the desk, so the screen isn't even turned toward him.
- The loose cable: odd — a plug that has worked loose is ordinary. A socket that sparks would get someone to call facilities or clear the floor, not sit there on a Friday afternoon. It does look like something you can touch.
- The boss's desk phone: fits — every boss has one, and it looks usable because it is.
- Kev's desk phone: odd — it belongs there, but a desk phone looks usable, and nothing says whether the player can make a call from it.
- Lin's mobile: fits — it's a personal phone that buzzes on her desk, and nobody expects to use a coworker's mobile.
- The boss's chair: fits.
- The coffee machine: misleading — it belongs in the kitchen, but players expect to use a coffee machine, and here only the boss can.
- The kitchen door: fits.
- The restroom: fits.
- The elevator: fits — the way out of the building. Nobody expects to leave mid-mission.
- Kev's bag: fits — leaving early on a Friday, with his bag.
- Your desk: odd — it has no computer or phone of its own, though every real desk has both. That makes it look like the boss's equipment is the only kit in the office.
- The wall clock: fits.
- Set dressing: fits — mugs, a plant and earbuds look like scenery and are scenery. Kev's screen with code on it is fine to look at.

## Problems
- blocker: The boss's screen faces the open floor and shows the layoff list. No boss shows a confidential list to the people on it. The room has been arranged so the player can read the screen. — Turn the screen toward his chair. The player sees the list only by walking into his office or looking over his shoulder from behind his desk.
- blocker: The coffee machine looks usable and isn't; it's exactly the "coffee machine you can't use" case. — Either let the player pour a cup (which costs time and does nothing else), or put an "Out of order — boss's pods only" note on it that the player can see.
- should: The card's icons 📧 📦 suggest an email and a box, and neither exists in the room. Players will hunt for an email program or a cardboard box to use. — Change the icons to things in the room (🖥️ 📞), or add the email and the box as plain scenery that is clearly not usable.
- should: Kev's desk phone looks just as usable as the boss's phone, and the player is never told it isn't. — Make it usable (a call to the boss's desk could do something), or make it clearly not usable, for example by showing Kev's headset plugged in and the handset missing.
- should: Your desk has no phone or computer, so the boss's kit is the only working equipment on the floor, which points straight at the solution. — Put a phone and a computer on your desk. If they can't change the list, have them show something like "no access."
- nit: The cable "sparks." That is a hazard, not an everyday fault. — Make it a plug that has slipped half out of the socket, with the screen flickering instead of sparks.

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

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"928798f","hash":"061a107cf422ec517173acff85492e40264ea2748e7d0eaaba92a61f11da3fa6","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","premise":"092590ab3ffeba8b786bd0d67a281be27ac200435049552e69565fd055d21668","prompts":"f5883160f1d3858e02431a0eee883b8939a1a09664f6e614e9f267258968625e"},"model":"default","problems":{"blocker":1,"should":5,"nit":2}} -->
## premise: fixable
Recorded 2026-11-15 at commit 928798f, by claude -p (model: default). Inputs 061a107cf422: the card, premise.md, the pass's prompts.
Problems: 1 blocker, 5 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 14 s | $0.02 |
| 2-review | report.md | 94 s | $0.57 |
| all | | 108 s (the steps add up to 108 s) | $0.59 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The boss knows how to fix his screen, but only uses that knowledge when the puzzle no longer needs it.** At 3:05 he stands over Kev and watches him push the plug in. At 3:20 the same static comes back. He bangs on the screen, phones Kev, gives up and goes for coffee (`index.js:290-316`). Then at 3:36 he kneels and fixes it himself in one second (`cast.js` selfFix). The player watching the do-nothing loop sees him fix it, and the coffee trip turns into a pretext: the route exists only because he forgets something for 16 minutes. **Fix:** cut selfFix. In the do-nothing loop, at 3:42 he gives up on the dead screen and sends the email from his mobile (📱📧). It's the same file, so the stakes are unchanged, and he never shows a skill he should have used at 3:20.
- E2 [should] The screen dies again at about 3:19 for no visible reason.** Nobody touches the plug (`cast.js` actsUp just sets `glitch = true`). This is the beat that sets up the whole way in, and on screen it is pure bad luck. **Fix:** show him sitting back down from the restroom and his chair or foot catching the cable: a jolt, the plug popping half out with sparks, then the static.
- E3 [should] Lin's 🤷 at 3:23 doesn't fit her.** Later she will walk the length of the floor to report you, yet here she watches her boss phone the missing Kev again and again and keeps quiet about something she saw herself. A real coworker would call out "he went home." The shrug also reads as "I don't know," not "not my business." **Fix:** let her try to tell him, e.g. a 👋🏠 speech bubble aimed at the glass that he can't hear through it while on the phone. Or give her a reason to stay quiet that the player can see, such as Kev giving her a 🤫 as he leaves.
- E4 [should] First-read option 3, "stop it reaching HR", has no answer in the world.** A player at the dead screen will try to keep it dead (yank the plug again, hide the cable, steal the handset) and nothing happens. Nothing visible tells them why that can't work. **Fix:** make one attempt fail on screen. For example, if you pull the plug after the edit, he plugs it straight back in on his return. Or show early on that the email is what gets sent, not the screen.
- E5 [should] The win card leaves out the joke.** It shows the boss sending and you looking smug, the same win any route would get. Lin turned round to Kev's empty, ringing desk (or turned away to her mobile) is the picture that tells the story. **Fix:** draw Lin in the background of each win card, facing the way your route turned her.
- E6 [should] Lin's reason for telling is hard to read.** The 📋 + her face + 😨 bubble lasts 1.8 s, and it shows while the player is watching the X on the screen. Most players will read her as a plain snitch, which goes against her sympathetic glance at 3:10. **Fix:** hold the thought longer and show it in the big list pop-out: her face slides into your empty slot, then the pop-out closes.

### 1-card: first-read.md

**Situation:** It's Friday, 3:00 PM. Someone has made a layoff list and my name is on it. The list reaches HR at 3:45, so I probably have about 45 minutes per loop.

**What I must do:** Get my name off the list. I can read that several ways:
1. Delete or erase my name.
2. Put someone else's name in place of mine.
3. Destroy the list or stop it reaching HR. That isn't strictly "getting off it," but it might count.
4. Change someone's mind so they take me off.

**If I fail:** HR gets the list with my name on it and I'm fired. My guess is the 📦 is me carrying my desk box out.

**Questions:**
- Is the list a paper or an email (📧)? Is there one copy or several?
- Who has it now, and who takes it to HR? A person, the mail, or a scheduled send?
- Is 📦 the losing outcome, a tool or a delivery, or the mailroom?
- Is swapping in a coworker's name allowed, or even the intended solution? That's darker. Is it funnier?
- If the list never arrives, have I won or just bought time?
- "The Layoff List": is it one physical object I can steal? Are other people on it, and should I care about them?

### 2-review: report.md

Verdict: fixable

**Best thing:** You pick up the boss's phone and ring the empty desk of the man who went home. The one person watching turns round to it, and meanwhile a huge red X is drawn across your face on the boss's screen.

## Problems
- **blocker: The boss knows how to fix his screen, but only uses that knowledge when the puzzle no longer needs it.** At 3:05 he stands over Kev and watches him push the plug in. At 3:20 the same static comes back. He bangs on the screen, phones Kev, gives up and goes for coffee (`index.js:290-316`). Then at 3:36 he kneels and fixes it himself in one second (`cast.js` selfFix). The player watching the do-nothing loop sees him fix it, and the coffee trip turns into a pretext: the route exists only because he forgets something for 16 minutes. **Fix:** cut selfFix. In the do-nothing loop, at 3:42 he gives up on the dead screen and sends the email from his mobile (📱📧). It's the same file, so the stakes are unchanged, and he never shows a skill he should have used at 3:20.
- **should: The screen dies again at about 3:19 for no visible reason.** Nobody touches the plug (`cast.js` actsUp just sets `glitch = true`). This is the beat that sets up the whole way in, and on screen it is pure bad luck. **Fix:** show him sitting back down from the restroom and his chair or foot catching the cable: a jolt, the plug popping half out with sparks, then the static.
- **should: Lin's 🤷 at 3:23 doesn't fit her.** Later she will walk the length of the floor to report you, yet here she watches her boss phone the missing Kev again and again and keeps quiet about something she saw herself. A real coworker would call out "he went home." The shrug also reads as "I don't know," not "not my business." **Fix:** let her try to tell him, e.g. a 👋🏠 speech bubble aimed at the glass that he can't hear through it while on the phone. Or give her a reason to stay quiet that the player can see, such as Kev giving her a 🤫 as he leaves.
- **should: First-read option 3, "stop it reaching HR", has no answer in the world.** A player at the dead screen will try to keep it dead (yank the plug again, hide the cable, steal the handset) and nothing happens. Nothing visible tells them why that can't work. **Fix:** make one attempt fail on screen. For example, if you pull the plug after the edit, he plugs it straight back in on his return. Or show early on that the email is what gets sent, not the screen.
- **should: The win card leaves out the joke.** It shows the boss sending and you looking smug, the same win any route would get. Lin turned round to Kev's empty, ringing desk (or turned away to her mobile) is the picture that tells the story. **Fix:** draw Lin in the background of each win card, facing the way your route turned her.
- **should: Lin's reason for telling is hard to read.** The 📋 + her face + 😨 bubble lasts 1.8 s, and it shows while the player is watching the X on the screen. Most players will read her as a plain snitch, which goes against her sympathetic glance at 3:10. **Fix:** hold the thought longer and show it in the big list pop-out: her face slides into your empty slot, then the pop-out closes.
- **nit: The puzzle's edit window is shorter than it looks.** Her 4.2 s ring look, minus the 0.4 s she needs to notice, against a 3 s edit, leaves under a second of slack once the player has walked from the phone to the screen. It is deducible but feels like twitch. **Fix:** make RING_LOOK 5 s, or let the player call Kev's desk while already standing at the screen.
- **nit: The 3:42 self-fix (if it stays) teaches "the plug is the fix" only after the last moment you could use it.** **Fix:** the blocker's fix removes this.

Name, card and badge: "The Layoff List", "Get off it." and 📧📦 all name the trouble without giving away the way out. First-read guessed 📦 and the email correctly. The other gap is that first-read pictured a piece of paper. The list is on a screen, but the 3:08 pop-out shows that before the player needs it, so I've graded that as fine.

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

<!-- cold-read:tells {"verdict":"fixable","date":"2026-11-15","commit":"928798f","hash":"d0ef3b1c877b9fd1715621f7c55106a8191d6756b46cff0381a59b13a74ce1dc","parts":{"card":"dbd1b383a7e3e2d9e135c3fb6f246d5391f04f9fb2a0805c98870e4b58c39d9c","checks":"ce2074cf2ffd9b7c396b69e64aba568c50cce58906f3b7943eced6f9c7582930","tells":"b63079b6b7653a76c3eebc870145fc12faa863364c855668a8e8d5d0b4d929e0","prompts":"f1d914aecdc56ea365960569f2587c9563e9f9a055deb88f13ba995eb473a219"},"model":"default","tally":{"visible":2,"faint":1,"invisible":1},"problems":{"blocker":1,"should":2,"nit":1}} -->
## tells: fixable
Recorded 2026-11-15 at commit 928798f, by claude -p (model: default). Inputs d0ef3b1c877b: the card, route-checks.js, the before and after pictures, the pass's prompts.
Items: 2 visible, 1 faint, 1 invisible.
Problems: 1 blocker, 2 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 28 s | $0.11 |
| 2-judge | report.md | 38 s | $0.14 |
| all | | 66 s (the steps add up to 66 s) | $0.24 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 01, a failed attempt on a locked PC looks like success. The padlock gives way to a lit red/pink screen with an icon, which reads as "unlocked". A player who sees this will think the restroom route worked, then not understand why they can't edit. **Fix:** keep the padlock on screen in AFTER and make the jolt obvious: shake it sideways, flash a red ✖ over the padlock, keep the screen dark. Don't swap the padlock for a lit screen.
- E2 [should] In 02, nothing shows that the cable was unplugged and then plugged in. Only the effect (static turning into the lineup) can be seen. The step this route depends on is "plug his cable in", so before acting a player has to notice that the cable is out. **Fix:** in BEFORE, draw the plug loose on the floor with a small gap and a spark/✖ next to the socket. In AFTER, seat the plug in the socket, add a brief green flash, and make the cable a clean line.
- E3 [should] In 03, Lin doesn't visibly turn toward the ringing phone. Her view cone points the same way in both halves, and her bubble is tiny (the reader saw only "a red item"). The route says the call works *because* Lin turns round, so her turn is what tells the player the distraction worked. **Fix:** have Lin swing her body and cone sharply toward Kev's desk as it rings, and pop a full-size 👀☎️ bubble at once (the size it is in 04), not a small one a beat later.

### 1-read: reading.md

# What changed in each image

**01.png:** The screen on the boss's desk, just above the player, changed from a padlock icon to a lit red/pink screen with a small round icon on it. **I think the player unlocked the boss's computer.** The box in the top bar (what they hold) looks the same. One watcher changed too: the teal-shirted woman at the upper-left open-plan desk now has small tick marks over her head. That probably means she noticed something, and it's the only reaction in the room.

**02.png:** The monitor on the boss's desk changed from TV static to a row of four faces. A faded, larger copy of that row pops up next to the desk. The **E** prompt moved from the "…" box on the left wall to the desk itself. **I think the player used something at the boss desk (probably the "…" box or the computer), and that brought up a staff lineup of four people.** The bald man in the kitchen also changed: in BEFORE his view cone points down into the room, and in AFTER it points up at the coffee machine. That reads as him turning back to the machine, but I can't tell if the player caused it. The woman at the upper-left desk still has her phone thought-bubble, unchanged. The held box is unchanged.

**03.png:** The big four-face lineup (second face, the red-haired one, highlighted red) is open in both halves and doesn't change. Two things do change:
- The phone on the lower-left desk shows a burst of lines, so it's ringing.
- The teal woman at the upper-left desk has a new small speech bubble with a red item in it.

**I think the player used the boss's desk phone to call the lower-left desk phone.** The held box is unchanged.

**04.png:** Several things changed:
- The second face in the lineup (the red-haired one, who looks like the player) is now **crossed out with a big red X**.
- The ringing burst on the lower-left phone has faded to a faint ring.
- The teal woman's "👀 ☎️" bubble is gone.
- The bald man has left the coffee machine. In BEFORE a dashed line ran from him to a corner icon; in AFTER he's standing in the kitchen with his view cone pointed down toward the desks.

**I think the player used the computer to cross someone off the layoff list. That someone is probably the red-haired face, possibly the player themselves.** Meanwhile the phone call drew the woman's attention and ended. The held box is unchanged.

**Overall:** In all four images the box in the top bar never changes, so whatever the player used, they didn't pick anything up or use anything up.

### 2-judge: report.md

Verdict: fixable

- 01.png: invisible — The player tried the boss's PC while it was locked. The padlock jolted and nothing happened. The reader saw the padlock replaced by a lit red/pink screen and concluded the player **unlocked** the computer. That is the opposite of what happened.
- 02.png: faint — The player plugged in the boss's monitor cable at the wall socket. The reader saw the result (static turned into the four-face lineup) but not the cause. They guessed "the '…' box or the computer". In both halves the cable runs from the socket to the desk the same way, so nothing shows that it was ever unplugged.
- 03.png: visible — The player rang Kev's empty desk from the boss phone. The reader read the ringing burst correctly and caught Lin's small bubble. They did not see her turn toward the phone, which is the part this route relies on. Her cone points down-left in both halves.
- 04.png: visible — The player struck a name on the boss PC. The reader saw the red X over the red-haired face and guessed that face is the player's own. Correct.

## Problems
- blocker: In 01, a failed attempt on a locked PC looks like success. The padlock gives way to a lit red/pink screen with an icon, which reads as "unlocked". A player who sees this will think the restroom route worked, then not understand why they can't edit. **Fix:** keep the padlock on screen in AFTER and make the jolt obvious: shake it sideways, flash a red ✖ over the padlock, keep the screen dark. Don't swap the padlock for a lit screen.
- should: In 02, nothing shows that the cable was unplugged and then plugged in. Only the effect (static turning into the lineup) can be seen. The step this route depends on is "plug his cable in", so before acting a player has to notice that the cable is out. **Fix:** in BEFORE, draw the plug loose on the floor with a small gap and a spark/✖ next to the socket. In AFTER, seat the plug in the socket, add a brief green flash, and make the cable a clean line.
- should: In 03, Lin doesn't visibly turn toward the ringing phone. Her view cone points the same way in both halves, and her bubble is tiny (the reader saw only "a red item"). The route says the call works *because* Lin turns round, so her turn is what tells the player the distraction worked. **Fix:** have Lin swing her body and cone sharply toward Kev's desk as it rings, and pop a full-size 👀☎️ bubble at once (the size it is in 04), not a small one a beat later.
- nit: In 01, the reader noticed tick marks over Lin's head and read them as Lin noticing something. That is a reaction to a step where "nothing happens", so a player may think they've been spotted. **Fix:** if she isn't reacting to the player, drop the marks for this beat. If she is, show it with a clear glance toward the boss office.

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
