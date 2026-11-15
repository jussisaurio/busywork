# Cold reads: meeting
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:title {"verdict":"works","date":"2026-11-15","commit":"3d6c490","hash":"4b3748037655809d6a8ec36447f6382702ab8de52c9f18c5be63fc56e347fff9","parts":{"card":"000299b29daba06cd706b8d529d379098e6ed736d3aecff62f2ac4462b2b7ce3","ways":"26674eaa161b39d5595e3ead48f998c7daaa361a94df06e0a0d8d4e76a7d04eb","prompts":"dd5bab76ad1fbe5da43d5bff829c95ca85430b34c17e10645da81a3ce6ac4fa1"},"model":"default","tally":{"miss":3,"near":2,"leak":0},"problems":{"blocker":0,"should":3,"nit":1}} -->
## title: works
Recorded 2026-11-15 at commit 3d6c490, by claude -p (model: default). Inputs 4b3748037655: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 3 miss, 2 near, 0 leak.
Problems: 0 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-guess | guesses.md | 12 s | $0.02 |
| 2-judge | report.md | 28 s | $0.08 |
| all | | 40 s (the steps add up to 40 s) | $0.10 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The card opens with "4:00 PM." on its own line. That reads as "it's 4 PM now", but the game starts at 2:30. The player is told the wrong time, and the 90 minutes of afternoon they actually have are hidden. — Change "4:00 PM." to "The meeting's at 4."
- E2 [should] The 📊 icon repeats "slides" and points the player at the projector before they've looked around the room. It's mild, because "slides" alone already hints at it. — Swap 📊 for 😬, which shows the trouble you're in rather than the equipment.
- E3 [should] "Never happens" is open enough that it hints at keeping the boss away. Players would guess this anyway, so it costs little. — Change "Make sure the meeting never happens" to "Get the meeting called off."

### 1-guess: guesses.md

# Guesses

1. **Cancel or move it on the shared calendar** so it drops off everyone's schedule. Suggested by "Make sure the meeting never happens" and the clock time "4:00 PM", which hints at a scheduled slot you could edit.
2. **Break the presentation setup**, such as the projector, screen or laptop, so there's nothing to present on. Suggested by "slides" and the 📊 icon.
3. **Keep the boss or the organizer busy** until 4:00 passes, or get them to leave early. Suggested by "4:00 PM" and "never happens". It's a race against the clock.
4. **Get the meeting room booked or occupied** by someone else first. Suggested by "the meeting never happens", but only loosely.
5. **Get everyone else to skip it** so nobody shows up. Suggested by "never happens" and the ❌ icon.

Nothing on the card points to making the slides as a way to win. "You made none" reads like a fixed fact you have to work around.

Stake: the meeting goes ahead and everyone sees that you promised slides and have nothing. The card only implies this. It never says what actually happens to you afterward, such as getting scolded or fired, or whether the game simply ends.

### 2-judge: report.md

Verdict: works
- Stake: clear. You promised slides and have none, so at 4 you'll be standing there with nothing to show. The card doesn't say who you promised them to or what happens to you after, but any office worker can fill that in.
- Cancel or move it on the calendar: miss. No route edits a calendar.
- Break the presentation setup: near. It points at route 1's target, the projector, because of "slides" and 📊. The real puzzle is getting the coffee, keeping it from Kev and waiting until he's gone, and the guess has none of that.
- Keep the boss busy, or get him to leave early: near. It points at route 2, where the boss goes out and can't get back in, because of "4:00 PM" and "never happens". It doesn't touch the keycard, which is the key step.
- Get the room booked first: miss.
- Get everyone else to skip it: miss.

## Problems
- should: The card opens with "4:00 PM." on its own line. That reads as "it's 4 PM now", but the game starts at 2:30. The player is told the wrong time, and the 90 minutes of afternoon they actually have are hidden. — Change "4:00 PM." to "The meeting's at 4."
- should: The 📊 icon repeats "slides" and points the player at the projector before they've looked around the room. It's mild, because "slides" alone already hints at it. — Swap 📊 for 😬, which shows the trouble you're in rather than the equipment.
- should: "Never happens" is open enough that it hints at keeping the boss away. Players would guess this anyway, so it costs little. — Change "Make sure the meeting never happens" to "Get the meeting called off."
- nit: "You made none" sounds written, not spoken. — Use "You haven't made any." The whole card could read: "The meeting's at 4. You promised slides. You haven't made any. Get it called off."

<!-- /cold-read:title -->

<!-- cold-read:sense {"verdict":"fixable","date":"2026-11-15","commit":"3d6c490","hash":"695f3eeaefd9b2bdb29c5e06086dbe7944733f7747ffcfd7ffe2dabc48ba4bdc","parts":{"card":"000299b29daba06cd706b8d529d379098e6ed736d3aecff62f2ac4462b2b7ce3","ways":"26674eaa161b39d5595e3ead48f998c7daaa361a94df06e0a0d8d4e76a7d04eb","prompts":"016aa683a72d416a002d56cc4d9abc6f52045f2ad4e6f1862e5593ed8c3882bb"},"model":"default","tally":{"sensible":6,"stretch":4,"nonsense":0},"problems":{"blocker":3,"should":3,"nit":1}} -->
## sense: fixable
Recorded 2026-11-15 at commit 3d6c490, by claude -p (model: default). Inputs 695f3eeaefd9: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 6 sensible, 4 stretch, 0 nonsense.
Problems: 3 blocker, 3 should, 1 nit.
Earlier problems: 5 fixed, 3 still there, 1 no longer applies (now blockers).

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 53 s | $0.12 |
| all | | 53 s (the steps add up to 53 s) | $0.12 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: Locked out, the boss stays outside and the meeting dies. In a real office someone hears the banging and lets him in, or he phones someone, or he follows a coworker in. — Leave his phone visibly on his desk. Have the team wait at 4:00, then shrug "he's not coming" and go home. (the boss is still stuck outside with no phone, no buzzer and no colleague to let him in. "Nobody upstairs knows" doesn't hold for 25 minutes.)
- E2 fixed: Kev doesn't notice that a cup held to your ear is coffee. — Drop the disguise. You just keep the cup out of his line of sight, behind a pillar or in the meeting room. (the disguise is gone. Kev asks for the cup and lets you keep it.)
- E3 fixed: Kev snatches the coffee out of a coworker's hand. — Have him ask "is that the last of it? Can I…?" with a 🥺, and give the player a short window to walk away before he takes it. (Kev asks (☕🥺❓) and doesn't take a cup from your hand.)
- E4 fixed: An empty pot means no coffee for the rest of the day. A real person just makes more. — Show the machine out of beans with a "no coffee till Monday" note, visible from 2:30. (the empty coffee bag by the machine is visible.)
- E5 still there: A broken projector cancels the meeting. A real boss says "just show it on your laptop." — Make the absurd result the meeting falling apart into "who broke the projector?", not "no screen, no meeting." Or: you have no laptop and the projector is the only screen in the room. ("a boss with a dead projector cancels". There's still no reason why a laptop or another room won't do.)
- E6 fixed: Lin told → the boss sends you to your desk for 20 minutes. — A real boss takes his card back, angrily, and keeps an eye on you (lose). For the sandwich, Lin confronts you herself and follows you around, which keeps you away from the rack. (the boss takes his card back angrily, and you lose.)
- E7 still there: Kev runs to the projector without being told. — Have the spill make a pop and a smell, or have the boss shout for "Kev!" while Kev is still there. (Kev still runs to the projector (🔧❗) without being called and without any noise.)
- E8 fixed: One empty mug counts as evidence, but every desk in an office has a mug. — Make it a distinctive office mug (the boss's own "#1 Boss" mug) or the coffee-pot cup itself. (there's only one cup of coffee in the office this afternoon, so the freshly emptied mug is the guilty one.)
- E9 no longer applies: The card says "the meeting never happens", but in route 1 everyone sits down at 4:00. — Reword it to "Make sure there's no presentation" or something similar. (the boss waves everyone out before anyone presents, so the meeting is cancelled. In plain speech, it never happens.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Locked out, the boss stays outside and the meeting dies. In a real office someone hears the banging and lets him in, or he phones someone, or he follows a coworker in. — Leave his phone visibly on his desk. Have the team wait at 4:00, then shrug "he's not coming" and go home. (recurring: premise-level?)
- E2 [blocker] A broken projector cancels the meeting. A real boss says "just show it on your laptop." — Make the absurd result the meeting falling apart into "who broke the projector?", not "no screen, no meeting." Or: you have no laptop and the projector is the only screen in the room. (recurring: premise-level?)
- E3 [blocker] Kev runs to the projector without being told. — Have the spill make a pop and a smell, or have the boss shout for "Kev!" while Kev is still there. (recurring: premise-level?)
- E4 [should] The boss sees the dead projector at 3:12, but waits until everyone sits down at 4:00 to call the meeting off. A real boss sends "meeting's off" or rebooks right away. — Have him only spot the damage at 4:00 when he switches it on. Or, on his 3:12 walk, have him mutter and pin a "meeting cancelled — projector" note to the door.
- E5 [should] Lin searches the open plan for her sandwich until 3:24. A real person checks the fridge, asks once or twice, sulks and goes to buy lunch. — Have her go down to the shop for a new sandwich from about 3:00 to 3:24. That gets her away from her desk just as well.
- E6 [should] You get fired for having mustard on your sweater. Real people get an angry Lin and an awkward talk, not a box. — Make the mustard catch a loss in its own right: Lin follows you around angrily and blocks you from the rack.

### 1-judge: report.md

Verdict: fixable
- Break the projector (win): stretch — Kev, the cup and the mug all act like real people, but a real boss with a dead projector moves rooms or says "use your laptop". He doesn't cancel.
- Lock the boss out (win): stretch — a boss stuck at the gate phones someone or follows a colleague in. He doesn't stay outside past 4:00.
- Sandwich combo (win): stretch — nobody searches the whole office for a missing sandwich for 25 minutes.
- The meeting happens (lose): sensible — nothing stopped it.
- Caught (lose): sensible — being caught at the boss's jacket, holding his card or holding the mug gets you in trouble.
- Blamed: the mug (lose): sensible — you're holding the only coffee mug of the afternoon.
- Blamed: your empty chair (lose): sensible — the person who promised slides and didn't turn up is the obvious suspect.
- Kev fixed it (lose): stretch — nobody tells Kev the projector is broken, yet he runs to it.
- Kev drank the coffee (lose): sensible — the bag is empty and he got the last cup.
- The keycard went back (lose): sensible — the boss sees his card on the floor and picks it up.

## Earlier problems
- E1: still there — the boss is still stuck outside with no phone, no buzzer and no colleague to let him in. "Nobody upstairs knows" doesn't hold for 25 minutes.
- E2: fixed — the disguise is gone. Kev asks for the cup and lets you keep it.
- E3: fixed — Kev asks (☕🥺❓) and doesn't take a cup from your hand.
- E4: fixed — the empty coffee bag by the machine is visible.
- E5: still there — "a boss with a dead projector cancels". There's still no reason why a laptop or another room won't do.
- E6: fixed — the boss takes his card back angrily, and you lose.
- E7: still there — Kev still runs to the projector (🔧❗) without being called and without any noise.
- E8: fixed — there's only one cup of coffee in the office this afternoon, so the freshly emptied mug is the guilty one.
- E9: no longer applies — the boss waves everyone out before anyone presents, so the meeting is cancelled. In plain speech, it never happens.

## Problems
- should: The boss sees the dead projector at 3:12, but waits until everyone sits down at 4:00 to call the meeting off. A real boss sends "meeting's off" or rebooks right away. — Have him only spot the damage at 4:00 when he switches it on. Or, on his 3:12 walk, have him mutter and pin a "meeting cancelled — projector" note to the door.
- should: Lin searches the open plan for her sandwich until 3:24. A real person checks the fridge, asks once or twice, sulks and goes to buy lunch. — Have her go down to the shop for a new sandwich from about 3:00 to 3:24. That gets her away from her desk just as well.
- should: You get fired for having mustard on your sweater. Real people get an angry Lin and an awkward talk, not a box. — Make the mustard catch a loss in its own right: Lin follows you around angrily and blocks you from the rack.
- nit: Only coffee can break the projector. A real office worker would also think of a water bottle or the flower vase. — Show a "no drinks" sticker, and either give coffee one plain reason to be the only drink at hand (e.g. the water cooler is empty) or say nothing.

<!-- /cold-read:sense -->

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"8b61a4d","hash":"067a4dd548c953d8fb1f99dc236e8b1bc1ecee0120eed3aa31ee4f1efd09446d","parts":{"card":"000299b29daba06cd706b8d529d379098e6ed736d3aecff62f2ac4462b2b7ce3","premise":"062d6e6569df363c835f2972ae93a328eb636fe9b2da0311ae6b622868906f65"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit 8b61a4d, by claude -p (model: default). Inputs 067a4dd548c9: the card, premise.md.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 13 s | $0.04 |
| 2-review | report.md | 97 s | $0.42 |
| all | | 109 s | $0.45 |

### 1-card: first-read.md

**Situation:** I'm an office worker. I promised someone slides for a meeting and didn't make any. "4:00 PM" could mean two things: (a) it's 4:00 now and the meeting is about to start, or (b) the meeting is at 4:00 and the afternoon is the time I have before it.

**What I must do:** Stop the meeting from taking place. That could mean getting it cancelled, clearing the room, removing whoever runs it, or breaking the equipment.

**If I fail:** The meeting happens and everyone sees I have no slides. The loop resets.

**Questions:**
- Is 4:00 the time now or the meeting time? How much time do I actually have?
- Who did I promise the slides to, who is coming, and where is the meeting?
- Does a delay count, or must it be cancelled outright? "Never" sounds absolute.
- Could I just make the slides? Is that a win or a cheat?
- Does 📊❌ mean "no slides" (my problem) or "kill the presentation" (my goal)?
- Name: "The" 4 PM Meeting suggests one specific recurring meeting. In a time loop it happens every time, so "never happens" is either the joke or a contradiction.

### 2-review: report.md

Verdict: fixable

**1. Nothing shows that the entrance needs a keycard before the lockout depends on it.** No one badges in before 3:48. Kev leaves by the elevator, and on a normal loop the boss just comes back in. In the code I read, the door only reacts when he has no card (`mechanics.js` DOORS). A first-time player has no reason to steal the card except that the rack offers a 🪪 prompt, and that is a guess, not a deduction. *Fix:* around 2:50, have Lin come back from a coffee run outside. She taps a card at the glass door, it beeps and shows a green light. Make the boss's 3:48 badge-in visible on every loop too.

**2. Locking the boss out ignores common sense.** He bangs on a glass door for twelve minutes. Lin sits at her desk from 3:37, then walks past to the meeting at 3:54, and nobody lets him in. *Fix:* put the smoking spot on a rooftop or fire-escape door that locks behind him, out of everyone's sight and hearing. Then "nobody heard him" is the joke.

**3. The card misleads in two ways, and first-read.md fell for both.**
- "4:00 PM." reads as the time now, but the loop starts at 2:30.
- The card icons 📊❌ are the start of the fail screen's 📊❌🦗, so the card's icons show the loss, not the goal.

*Fix:* change the first line to "Meeting at 4:00. You promised slides. You made none." and change the icons to 🗓️❌. The name itself is fine.

**4. The premise describes a disguise that isn't in the game.** It says you hide the cup by holding it to your ear like a phone. Nothing in `items.js` or `interactions.js` does that. Kev takes the cup whenever he sees it, once he knows it's his. The player just has to stay out of his sight from 2:38 to 3:00. Also, nothing shows that Kev fixes things until you break the projector early and lose a loop to it. *Fix:* cut the phone claim. In the first minutes, show Kev fixing something small, like the printer: 🔧 then 👍.

**5. Small mismatches between the premise and the schedule, plus one contradictory end card.**
- The premise says the boss is away 3:14–3:28 and Lin is back by 3:12. The code has him away 3:12–3:22 and her back at 3:07.
- With the sandwich combo, Lin hunts until 3:24. That covers the boss's absence only if he really returns at 3:22, so the premise's numbers are wrong.
- `tableauBlamed` draws a meeting with you absent while the boss is locked out, even though the lockout means the meeting never happened.
- Possibly an easier route: from 3:30 to 3:35 Lin is in the restroom and the boss sits with the rack behind him. I can't confirm this without the map.

*Fix:* update the premise's times to match the code, drop the locked-out version of the blamed scene, and test the 3:30 window.

**Stakes and motivation mostly hold.** Every routine has an everyday reason: coffee, lunch, a smoke, leaving early, a boss's rounds. Pausing at the meeting-room door on both restroom walks is a bit convenient but believable for a boss. Winning only postpones the meeting until tomorrow, but within one replayed afternoon that's enough. "Never happens" is fine as comic exaggeration.

**The joke:** The Kev ending is funnier than the obvious one. The plain projector win is just the boss shrugging at a dead projector. In the Kev ending, the boss saw Kev wave goodbye at 2:58 but doesn't know when the projector died. So blaming the empty chair makes sense to the characters, and it's still unfair to Kev, who never even got his coffee. It's on screen as a drawn picture (`end-scenes.js` tableauKev). Making this ending optional, with the shrug as the default win, is the right call.

**Best thing:** Kev is blamed for spilling coffee he never got to drink, and you sit at the table pointing at his empty chair with everyone else.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"8b61a4d+dirty","hash":"56601198695d8286b2232fea37ac2a24efad8e8c2a9fbc18401958305446735e","parts":{"card":"000299b29daba06cd706b8d529d379098e6ed736d3aecff62f2ac4462b2b7ce3","shots":"591e8b271f2e990833290cebf9a43edf866edb2f4bed960122166946a1bb920f","pictures":"be2e735541220a58e866affca6447e29669e57acbb8375da7ad62b8e4f9dd159"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit 8b61a4d+dirty, by claude -p (model: default). Inputs 56601198695d: the card, shots.js, the rendered shots.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 89 s | $0.42 |
| 2-compare | report.md | 95 s | $0.43 |
| all | | 183 s | $0.85 |

### 1-read: reading.md

# Reading: The 4 PM Meeting

**Card:** It's 4:00 PM, you promised slides and made none, so stop the meeting. Clear and funny. The 📊❌ icons back it up.

1. **01, 2:30.** You (red sweater) are at your desk. The boss (bald, braces) sits in the top-left office. A teal woman and a green guy work at desks. There's a projector on the meeting table. The orange cones look like sight lines. The empty dashed hand slot means I can carry one thing.
2. **02, 2:37.** You're at the meeting table holding a cup, with a water-drops bubble over the projector. Coffee spilled on the projector? That's the first clear verb.
3. **03, 2:40.** You're back at your desk with a ⬇ bubble ("put down"?). The green guy stands at the coffee machine thinking "☕?". So someone took his coffee, and that someone was you.
4. **04, 2:40.** Same clock, but you're at the machine with a "😌☕" bubble and an empty hand. These shots aren't in time order. From here on I'm reading them as separate moments.
5. **05, 2:58.** "Pretend" is lit. You're at your desk holding papers. The green guy has a "🎒👋" bubble, so he's leaving? There's a fast-forward icon top right that I can't read.
6. **06, 3:11.** The projector is smoking. You're next to it with a 😇 halo thought: the innocent act. The boss has squiggle lines by his head. Heard it? Those squiggles come back later and I never learned what they mean.
7. **07, 2:48.** The boss is out walking with a big cone. You're "pretending" at your desk under a screen-ish bubble (looking busy). The green guy stands at the projector, but why?
8. **08, 3:16.** The boss is at the meeting-room door thinking "📽💥". A red trapezoid runs from the screen down to you. Is that the boss's sight, or the projector beam? Can't tell.
9. **09, 3:20.** You grab coffee (✋). The boss is at the kitchen door with a "☕🧑‍🍳" bubble. Does he want someone to fetch him coffee? The second glyph is unclear.
10. **10, 3:19.** The boss bursts out "☕!" while you're taking a cup off the green guy's desk. Caught stealing coffee, I think.
11. **11, 3:04.** A sandwich is in your hand and you have a 😋 bubble. The teal woman is at the fridge under a grey cloud. So you stole her lunch? The green guy is at the exit with his bag.
12. **12, 3:20.** You're at the coat stand in the boss's office. The teal woman points at you with "!👉" and a red dashed line. She snitches. Good, readable.
13. **13, 3:22.** A badge is in your hand and the jacket is still on the stand. The boss is out on his floor walk.
14. **14, 3:49.** The coat stand is bare. The boss is in the grey lobby wearing the jacket, saying "😠🚪🪪": no badge, door won't open. The badge is in your hand, though you have a ⬇ bubble at the table.
15. **15, end.** You celebrate with confetti while the boss is stuck behind glass, angry. Icons are 🪪✅🎉. **A clear win.**
16. **16, end.** The projector is dead with a 🚫 sign. The boss shrugs "📽💥🤷". No ✅ or ❌, and a teal border like the win. Is this a win too? I can't tell. It's the projector "trophy" card.
17. **17, end.** Teal border and a projector card, but the boss points at you angrily, and the woman thinks "☕🔧", suspecting you. Icons are ☕👉🪑. Did I win and get blamed anyway? The two signals contradict each other.
18. **18, end.** A plain room with a white screen and nothing on it. Silence squiggles, a cricket. Icons 📊❌🦗. **Loss**: you had to present. Funny.
19. **19, 3:03.** You walk to the lift carrying a box with a plant, while the boss points 😠👉📦. **Fired.** What got me fired at 3:03? Nothing in the shots shows it.
20. **20, end.** An empty yellow chair with ripples, the woman pointing, the boss furious. Icons 🪑👉😠. You were absent and she ratted you out?
21. **21, end.** You sit sweating with a coffee. The boss says "☕😠👉". You broke the projector with coffee and the cup gives you away.

**Unreadable overall:** the squiggle lines (hearing? shock?), the fast-forward icon, the "🧑‍🍳" glyph, and the red trapezoid in 08. The red vs teal borders make sense, but 16 and 17 break the rule by having no verdict icon.

## The story I think it tells
You have nothing to present at 4. There are two tricks. One is to pour coffee into the projector so the room has nothing to show. The other is to lift the boss's badge from his jacket so he gets locked out of the office. Either way, the coffee or your absence can point straight back at you, and the teal woman always snitches. As far as I can tell, the badge route is the only clean win. The projector route "works", but the endings never make clear whether you got away with it.

### 2-compare: report.md

Verdict: fixable

**01 · start: reads**
The player found the rooms, the boss, both colleagues, the projector and the hand slot. They didn't mention the jacket on the coat rack, but they found it on their own by 12–13.

**02 · cup-at-projector: reads**
"Coffee spilled on the projector? That's the first clear verb." They took the point that coffee and the projector don't mix. Minor note: they never saw the "no coffee" sticker. The water-drop bubble did that job instead. The sticker is too small to see in play.

**03 · pot-empty: reads**
"Someone took his coffee, and that someone was you." This matches the intent.

**04 · kev-grabs-cup: misread**
- **Reading:** "You're at the machine with a '😌☕' bubble and an empty hand. These shots aren't in time order."
- **Intent:** Kev takes the cup out of your hand, delighted (🤤☕). If he sees the cup, he takes it.
- **Cause:** A missing cue, and an emoji standing in for a person. Kev is hidden under the player's sprite, so the only actor you can see is you. The 😌☕ bubble reads as your own satisfied sigh. The empty hand slot looks like you put the cup down. This lesson sets up the whole projector route, and the player read it as a continuity error instead.
- **Fix:** Stand Kev clearly beside the player, facing them, with the cup drawn in his hand. Add a short motion arc from your hand to his, and put the 🤤 bubble on him.

**05 · kev-leaves: reads**
"The green guy has a '🎒👋' bubble, so he's leaving?" Correct. The fast-forward icon top right confused them, but that's cosmetic.

**06 · spill: reads**
Smoke, the 😇 thought and the empty mug all landed. Side note: the boss has squiggle lines by his head that nothing in the intent explains. The player flagged them and "never learned what they mean". Either give them a payoff or remove them.

**07 · kev-fixes: misread**
- **Reading:** "The green guy stands at the projector, but why?"
- **Intent:** You broke the projector too early. Kev (IT) is repairing it, so it only stays broken once he has gone.
- **Cause:** A missing cue. Kev just stands at the table with no tool and no bubble. At this size the projector doesn't look broken or half-fixed. Nothing anywhere says Kev is the IT guy. This is a route rule (wait for Kev to leave), and it doesn't come across.
- **Fix:** Give Kev a 🔧 bubble and a wrench in hand. Show sparks or smoke on the projector that shrink across the shot, ending in a small ✅ when he finishes.

**08 · boss-sees-projector: partly**
- **Reading:** "A red trapezoid runs from the screen down to you. Is that the boss's sight, or the projector beam? Can't tell."
- **Intent:** The boss looks in, sees the broken projector (📽💥), and is about to go hunting for the culprit.
- **Cause:** A glyph used as a prop. The boss's red sight cone points up through the door and lines up exactly with the screen, so it reads as a projector beam. The player is also standing inside the cone, so the shot could mean "you're seen". Nothing hints at the hunt that comes next.
- **Fix:** Keep the player out of the cone in this shot. Draw the cone from the boss's eyes so it clearly ends at the projector. Add a 🔍 to his bubble (📽💥🔍) to set up the search.

**09 · mug-on-machine: misread**
- **Reading:** "You grab coffee (✋). The boss is at the kitchen door with a '☕🧑‍🍳' bubble. Does he want someone to fetch him coffee?"
- **Intent:** You put the empty mug back on the machine. The boss finds it there and shrugs (☕🤷): no one to blame.
- **Cause:** The cause and effect are too far apart, plus a glyph misread. The player is still at the machine with ✋, which reads as taking, not returning. The boss is a room's width away, not at the mug. At bubble size, 🤷 reads as 🧑‍🍳.
- **Fix:** Show the player gone, back at their desk. Draw the boss at the machine holding the mug, arms up in a drawn shrug instead of a tiny emoji. Use a ⬇ "put down" bubble in the shot before this one, not ✋.

**10 · mug-on-kevs-desk: misread**
- **Reading:** "The boss bursts out '☕!' while you're taking a cup off the green guy's desk. Caught stealing coffee, I think."
- **Intent:** The boss finds the mug on Kev's desk and concludes Kev did it. Kev has gone home and can't deny it.
- **Cause:** An emoji standing in for a person, and cause and effect too far apart. Kev is the person being blamed, but he isn't in the shot. The only person you can see is the player, red-ringed at the desk with a ✋, right next to an angry burst. Of course it reads as "you're caught". This is the frame-Kev route, and it reads as its opposite.
- **Fix:** Move the player well away. Show the boss holding the mug, turned toward Kev's empty olive chair. Make the bubble ☕👉🪑 with the chair drawn in Kev's olive colour.

**11 · sandwich-missing: reads**
"So you stole her lunch?" Right. They didn't infer that Lin will now search the office, but 13 ("Lin looks away") covers that well enough.

**12 · lin-sees-theft: reads**
"She snitches. Good, readable."

**13 · keycard-taken: reads**
Badge in hand, boss away, no alarm. Correct.

**14 · boss-locked-out: reads**
"No badge, door won't open." Correct. The ⬇ bubble at the table is a stray cue, but harmless.

**15 · end-keycard: reads**
"A clear win."

**16 · end-projector: partly**
- **Reading:** "No ✅ or ❌, and a teal border like the win. Is this a win too? I can't tell."
- **Intent:** A win: the projector is dead, so the meeting can't go ahead.
- **Cause:** A missing cue. The keycard win ends its icon row with ✅🎉, and this one doesn't. The teal border alone isn't enough for the player to learn the win/loss rule. A red-framed stamp in the trophy slot muddles it further.
- **Fix:** Use the same win grammar on every win card: end the row with ✅ and draw the player celebrating somewhere in the frame, even if it's just a small fist-pump in the doorway.

**17 · end-kev-blamed: misread**
- **Reading:** "The boss points at you angrily, and the woman thinks '☕🔧', suspecting you… Did I win and get blamed anyway?"
- **Intent:** A win: everyone stares at Kev's empty chair and blames him.
- **Cause:** An emoji standing in for a person. "Kev" is only 🔧, a link the game never set up because 07 failed. The player is drawn front and centre, right under the boss's pointing finger. Kev's empty chair is the same yellow as yours in 20, so this card and the loss card look nearly the same.
- **Fix:** Take the player off the line of the finger and give them a relieved 😌 at the edge. Draw the empty chair in Kev's olive colour with his hoodie or 🎒 on it. Make the icon row ☕👉🎒 ✅.

**18 · end-fail: reads**
"Loss: you had to present. Funny."

**19 · end-caught: partly**
- **Reading:** "Fired. What got me fired at 3:03? Nothing in the shots shows it."
- **Intent:** The boss caught you at it, and you're fired.
- **Cause:** The cause and effect are too far apart. The card shows only the result. The catch happened behind the card: on the map underneath, you're at the coat rack with the boss at his desk. The icon row 😠👉📦 never names the crime.
- **Fix:** Put the crime in the picture and the row: the boss pointing with a 🪪 in his hand, and the row 🪪👀😠📦.

**20 · end-blamed-chair: reads**
"You were absent and she ratted you out?" That's the intent. The colour clash with 17 is covered under 17.

**21 · end-blamed-mug: reads**
"The cup gives you away." Correct.

**Pattern:** The badge route reads cleanly from start to finish. The projector route breaks every time Kev matters (04, 07, 10, 17). Kev is missing from the frame or hidden under the player, and the player sprite sits in his place, so each Kev beat reads as "you got caught". Draw Kev visibly in his own beats, and keep the player out of the spot where the blame lands.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"230f14f+dirty","hash":"a75e2be2f9f20cf06b2bc854451a470eb5ecc9cb3fd19e287134c6756d7be090","parts":{"card":"000299b29daba06cd706b8d529d379098e6ed736d3aecff62f2ac4462b2b7ce3","checks":"aaaa348d6b34a91488c263c051e8394c299b6ab8d4206454d2e12009192acefb","ways":"480c6172b8156147b3265d4b18ecae7182d606220e36c3bdf7ac796254868f35","frames":"6247a88bd1a4c142ad87b104c9960ca5975a65db04234058ae57980365082224"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit 230f14f+dirty, by claude -p (model: default). Inputs a75e2be2f9f2: the card, route-checks.js, premise.md's ways to win and lose, the replay strips.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 153 s | $0.72 |
| 1-read-2 | reading.md | 122 s | $0.58 |
| 1-read-3 | reading.md | 176 s | $0.73 |
| 1-read-4 | reading.md | 155 s | $0.64 |
| 2-compare | report.md | 186 s | $0.64 |
| all | | 792 s | $3.30 |

### 1-read-1: reading.md

I've read all five runs. Here is reading.md:

---

# Reading: The 4 PM Meeting

**This applies to every run.** All five loops end on the same picture. The woman in red (you, marked by the red ring) stands at a blank white screen. The woman in teal and the bald boss stare at a cricket on the floor, and the boss thinks "📊?". The icons are 📊 ❌ 🦗. I read all five as losses: the meeting happened and there were no slides. But the screen never says "lost". The first two icons, 📊❌, are the same as the mission card's icons. A player could read this ending as "mission accomplished". The loop counter also says 1 in every run.

## Run 1
- 2:58: You sit at the middle desk. The man in green at the right desk shows 🎒👋.
- 3:33: The boss thinks "📄?". The teal woman walks past carrying food.
- 4:00: Everyone is in the meeting room. The boss shows 📊👀 and you look nervous (😅). A cricket is highlighted on the table. Crumpled paper sits on the floor by your desk.
- 4:01: Loss.

**Why:** The meeting happened. **Your cause:** None. You did nothing.
**Possibly not about you:** The crumpled paper shows up in every run, wherever you were standing just before 4:00. It looks like a "she was here" mark, not something you dropped.

## Run 2
- 2:34: At the kitchen coffee machine you take something, and a cup appears in your item slot.
- 2:40: In the meeting room you look 💦. In the kitchen the green man thinks "☕?".
- 2:41: You leave a smoking black pot on the meeting table and do the "pretend" move, with a 😇 thought. The green man shouts 🔧❗.
- 2:42: The green man walks out, thinking 😫☕.
- 2:46: You do something at your desk, and a bubble appears over your monitor. The green man is in the meeting room. The boss walks the floor.
- 2:52: The pot is gone. The green man shows 👍.
- 2:55 to 3:02: He thinks 😫☕ again, shows 🎒👋, then walks toward the bottom exit.
- 4:00 and 4:01: Same scene as Run 1, same cricket. Loss.

**Why:** The meeting still happened. **Your cause:** None that I can see. The pot moved the green man around but had no effect on 4:00. The cup is still in your slot at the end.
**Possibly not about you:** His 🎒👋 at 2:58 also happens in Run 1, so it's part of his routine.

## Run 3
- 2:34 to 2:42: Same as Run 2 (the pot, 😇, 🔧❗).
- 2:45: At the meeting-room door you bump into the green man, and he thinks "?". Moments later you're at your desk and a stack of paper has appeared beside it. A red dashed line runs from the green man to you, and he shouts ❗👉. The boss says 📄📄👉🖥. A paper meter appears at the top right.
- 2:46 to 3:02: The meter drains. The stack shrinks to one sheet. The green man goes through the same 👍 / 😫☕ / exit routine as in Run 2.
- 3:33: The stack and the meter are gone.
- 4:00 and 4:01: Same scene. Loss.

**Why:** The meeting happened. **Your cause:** I can't tell. The paper stack and the red line arrive with no "you used the thing" caption. I can't say whether you caused them, whether you were caught, or whether the boss handed you work. None of it changed the ending.

## Run 4
- 2:34: At the coffee machine you take the item.
- 2:40: The green man arrives and thinks "?". Your slot is now empty and you're doing "pretend". He shows 😌☕.
- 2:41: He shows 😩, then 😌.
- 2:58: He's back at his desk with 🎒👋. You're still standing at the machine.
- 3:33: You're still at the machine.
- 4:00: The crumpled paper is in the kitchen, where you were standing. Same meeting scene. Loss.

**Why:** The meeting happened. **Your cause:** None visible. I can't tell whether you gave him the coffee or put it back.
**Possibly not about you:** His mood changes at 2:40 and 2:41 might just be him using the machine.

## Run 5
- 2:58: You sit at your desk. The green man shows 🎒👋, the same as Run 1.
- 3:33: You're standing at the coffee machine with no action logged. The boss thinks "📄?".
- 4:00: The crumpled paper is in the kitchen. Same scene.
- 4:01: Loss.

**Why:** The meeting happened. **Your cause:** None. You walked to the kitchen and that's all.

---

**Editor's note:** In five loops, nothing the player did changed even one frame of the ending. A cold player would learn that "the cricket meeting always happens", and nothing about why.

### 1-read-2: reading.md

# Reading: The 4 PM Meeting

## Run 6: **Loss**

- 2:34 Player (red top) uses the coffee machine in the kitchen. A cup appears in the top-bar slot.
- 2:40 Player at the middle desk. Green-shirt man at the machine thinks ☕❓, then 😩 (2:41), then 😪☕ (2:42).
- 2:46–2:57 Bald man in a tie leaves the corner office, walks around the room and reaches the coat rack.
- 2:58 Green-shirt shows 🎒👋. By 3:04 he has gone out the bottom-left door. Teal woman goes to the kitchen.
- 3:10 Player uses the projector in the meeting room and shows a halo bubble. The projector smokes.
- 3:15 Bald man at the door thinks 📽️💥, then ☕❓ at 3:16.
- 3:59–4:00 Bald man (coat now on) and teal woman come to the meeting room. Player is seated, still holding the cup.
- End picture: bald man shouts ☕😠👉 at the player, and teal woman points at the player too. Red frame.

**Why it lost:** The player was caught holding the missing coffee next to a broken projector.

**Caused by:** taking the coffee at 2:34, then keeping it.

**Might not be a reaction:** The bald man's walk and his coat look like his normal routine. Green-shirt's exit could be because of the coffee or just his schedule. I can't tell which.

## Run 7: **Win**

- Same as Run 6 until 3:15, projector broken.
- 3:16 Player puts the cup back at the machine. The slot now shows an empty hand.
- 3:20 Bald man is in the kitchen with a ☕ bubble and a second icon I can't read. He's back in his office by 3:33.
- 4:00 Bald man in the meeting room with 📽️💥🤷. The player shows 🎉.
- End picture: smoking projector, bald man shrugs. Teal frame, and a projector stamp fills the first slot.

**Why it won:** The projector was broken and nobody was blamed.

**Caused by:** breaking the projector at 3:10 and getting rid of the cup at 3:16.

**Might not be a reaction:** The 3:20 kitchen trip might be routine. It also happens in Run 8, where the cup never went back.

## Run 8: **Probably a win**

- Same as Run 6 until 3:10, projector broken.
- 3:15 Player leaves the cup on green-shirt's empty desk.
- 3:18 Bald man sees it: ☕❗.
- 3:19 At that desk he shows 😠🔧.
- 4:00 Bald man and teal woman both think ☕🔧. The player shows 🎉.
- End picture: bald man is angry and points at an empty chair with a coffee in front of it. Icons are ☕👉🪑. Teal frame, same projector stamp as Run 7.

**Why:** The broken projector got blamed on the absent coworker. The frame color and stamp match Run 7, so I read this as a win. An angry boss on a win picture is easy to mistake for a loss, though.

**Caused by:** breaking the projector at 3:10 and leaving the cup on that desk at 3:15.

**Might not be a reaction:** Green-shirt leaving at 2:58 happened in every run, before the cup was planted.

**Note:** I skimmed the frames before 3:10 in Runs 7 and 8. The captions match Run 6 and my spot-checks matched too.

### 1-read-3: reading.md

# Reading: The 4 PM Meeting

---

## Run 9: loss (fired), 3:25 PM

- **2:34** You're at the kitchen coffee machine. A coffee cup appears in your hand slot, so you took the coffee.
- **2:40** You're at the middle desk. Nothing visible changes except that the "pretend" key lights up. The man in the green shirt reaches the coffee machine and thinks "☕?".
- **2:41–2:42** Green shirt looks upset, then sleepy with "☕". The bald boss in the corner office turns, and his sight cone sweeps the room.
- **2:46–2:57** The boss walks a loop through the open office and goes back to his desk.
- **2:58–3:04** Green shirt says "🎒👋" and walks out through the bottom glass door.
- **3:05** You're in the meeting room at the projector, with a halo bubble 😇.
- **3:10** You're back at your desk. The projector is grey and smoking. Your hand is empty and a cup sits on your desk.
- **3:15** The boss stands in the meeting room doorway thinking "projector 💥".
- **3:16** The boss thinks "☕?".
- **3:24** You're standing at the meeting room door, not pretending. A red line runs from the boss to you, with "!😠".
- **3:25** End picture: the boss points while you carry a box with a plant into the elevator. Icons: 😠 👉 📦.

**Why it ended:** The boss saw you.

**Cause:** Being seen at 3:24. I can't tell what he blamed you for. It could be standing near the broken projector, the cup on your desk, or both.

**Might not be a reaction:** Green shirt leaving. In run 11 he says "🎒👋" at 2:58 too, and nobody complains about coffee before that. The boss's 2:46 walk is probably also part of his routine.

---

## Run 10: loss (missed the meeting), 4:01 PM

- **2:34–3:04** Same as run 9: you take the coffee and sit at the desk, and green shirt leaves.
- **3:10** You're at the projector with a halo bubble 😇, and it's already smoking.
- **3:15** You're in the kitchen. The boss thinks "projector 💥".
- **3:16** You use the coffee machine and your hand empties, so you put the coffee back. The boss thinks "☕?".
- **3:20** You're at your desk. The boss stands at the kitchen door saying "☕ + a person with a tool?".
- **3:33** The boss is at his desk thinking "card?". The projector gives off a spark.
- **3:59** The boss is in the meeting room in his coat, saying "projector 💥 + tool person". The woman in teal is seated.
- **4:00** Both of them think "🪑?", then both go "😠👉". You sit at your desk sweating.
- **4:01** End picture: the meeting goes ahead with the projector marked 🚫. The teal woman points at an empty chair in a spotlight. Icons: 🪑 👉 😠.

**Why it ended:** The meeting happened anyway, and your chair was empty.

**Cause:** Staying at your desk at 4:00. Breaking the projector didn't stop the meeting.

**Might not be a reaction:** The boss's "card?" at 3:33. The same bubble shows up in run 11, so it doesn't respond to anything you did.

---

## Run 11: win, 4:01 PM

- **2:58** Green shirt says "🎒👋" and leaves. You haven't done anything yet.
- **3:22** You're at the coat rack in the boss's office while he's away in the bottom-right corner. An ID card appears in your hand slot.
- **3:33** The boss is at his desk thinking "card?". You sit in the meeting room, pretending.
- **3:49–3:58** The coat rack is empty. The boss is in his coat outside the lower glass door, cycling through "😠🚪card", "card?" and "👊🚪".
- **3:55–3:58** The teal woman walks to the meeting room and sits by you.
- **4:00** You show 🎉. The card fills a slot at the top of the screen.
- **4:01** End picture: you cheer in confetti while the boss sulks behind the glass. Icons: card ✅ 🎉.

**Why it ended:** The boss couldn't get back in, so the meeting never started.

**Cause:** Taking the card from the coat at 3:22. He seems to step out every day; in run 10 he came back wearing his coat.

**Might not be a reaction:** His "card?" at 3:33, which also appears in run 10. The teal woman's walk is the same as in run 10.

**Editor's note:** The card says to stop the meeting, but in the winning run you're sitting in it. That's a good joke. It also contradicts the card.

### 1-read-4: reading.md

# Reading: The 4 PM Meeting

The game is consistent: the same afternoon replays the same way every run. A few problems turn up across runs and are listed at the end.

## Run 12: Loss

- **2:50** In the kitchen by the fridge (the player is the red-haired woman with the red ring). A sandwich shows in the hand slot. 😋
- **2:51** Hand slot empty, 😛 thought bubble. She ate the sandwich.
- **2:58** Uses something at her own desk; I can't tell what. The man at the right desk says 🎒👋. The bald man sits down in the corner office.
- **3:03–3:04** The teal woman opens the fridge: "🥪 ?", then 😠.
- **3:07** The teal woman walks out, her sight cone lands on the player: "?", then 😤 and a red dotted line. Straight away the bald man says 📄📄👉🖥 and a stack of paper appears on the player's desk.
- **3:33** Bald man: "📄 ?"
- **4:00** Meeting room. The bald man shows 📊👀 and the player sweats. A cricket icon pops up.
- **End:** The player stands at a blank screen. Icons: 📊 ❌ 🦗.

**Why it's a loss:** The meeting happened with no slides. That's the default ending. Run 14 ends the same way without the sandwich.

**Player's cause:** None. Eating the sandwich got her caught and landed the paper stack on her desk, but that changed nothing about the ending.

**Might not be a reaction:** The "📄 ?" at 3:33 shows up in every run, so it's routine. The papers on the floor at 4:00 also show up in run 14.

## Run 13: Win

- **2:50** Takes the sandwich from the fridge and keeps it in her hand. 😋
- **2:54** Uses something at her desk while still holding the sandwich. 😋 What she did isn't clear.
- **2:58–3:04** Same routines as run 12. The teal woman finds the sandwich gone, but no one catches the player.
- **3:21** At the coat rack in the corner office, which is empty. Afterwards her hand slot is empty, so she may have left the sandwich in the coat. I can't confirm that.
- **3:22** Second use at the rack. Now she's holding an ID badge. The bald man is off by the bottom-right door.
- **3:24** Walks out. The teal woman 😤 across the room.
- **3:33** She waits at the meeting table. Bald man: "📄 ?"
- **3:49–4:01** The coat is gone from the rack. The bald man, wearing it, is stuck outside the glass front door, cycling 😠🚪🪪, "🪪 ?", 👊🚪.
- **End:** Confetti for the player, a fuming bald man behind the glass. Icons: 🪪 ✅ 🎉. The badge goes into a reward slot.

**Why it's a win:** The bald man couldn't get back in, so the meeting never started.

**Player's cause:** Taking the badge from the coat at 3:22.

**Might not be a reaction:** The teal woman's 😤 at 3:24 is far away and aimed at no one in particular. It may just be leftover anger about the sandwich. It's unclear whether the sandwich mattered at all.

## Run 14: Loss

- **2:58** At her desk. The right-desk man says 🎒👋.
- **3:22** Uses the coat rack twice. Bubble ✋, hand slot still empty. She came away with nothing.
- **3:26** The bald man comes back to his office: "🪪 !". The player uses something at her desk.
- **3:33** The teal woman eats her sandwich. Bald man: "📄 ?"
- **4:00–4:01** Exactly the same as run 12. Icons: 📊 ❌ 🦗.

**Why it's a loss:** The meeting happened with no slides.

**Player's cause:** Nothing she did changed the outcome. Getting nothing from the coat meant no lockout.

**Unclear:** Why the coat gave nothing this time when it gave the badge in run 13. The only visible difference is that she isn't holding a sandwich. I can't tell if that's the reason.

**Might not be a reaction:** The bald man's "🪪 !" at 3:26 could mean he noticed something, or could be part of his own routine. It didn't happen in run 13.

## Run 15: Loss (fired)

- **2:58** Gets up from her desk. 🪑
- **3:03** At the coat rack while the bald man is sitting at his desk. His sight cone turns red: "?", then a spiky "! 😠".
- **3:04** End: the bald man, furious, points 👉 at the player, who carries a box of her things into the lift. Icons: 😠 👉 📦.

**Why it's a loss:** The boss caught her at his coat.

**Player's cause:** Going for the coat at 3:03, while he was there. No action had finished, since there's no "used" caption. Being seen at the rack was enough.

## Problems across runs

- **The loop counter shows ⟳1 in every run,** even though these are runs 12 to 15. Either it's broken or it means something I can't read.
- **The 🦗 in the loss ending is the strongest joke here,** because a cricket means awkward silence. But it shows up in a row of three icons next to the card's 📊 ❌, so it reads as a mystery item, not as the punchline.
- **The win depends on something the player can't see.** In run 13 the coat gave a badge, in run 14 it gave nothing, and I can't tell why.

### 2-compare: report.md

Verdict: fixable

## Runs

| Run | Real cause (runs.md) | Ending | Mark |
|---|---|---|---|
| 1 | Did nothing, so the meeting happened | fail | **explained** |
| 2 | Broke the projector while Kev was in the building, and Kev fixed it | fail | **unexplained** |
| 3 | Broke it too early and stayed nearby. Kev told on her (desk work) and also fixed it | fail | **unexplained** |
| 4 | Poured early and stood at the machine with the cup. Kev took it | fail | **unexplained** |
| 5 | Went for coffee after Kev, who had already drunk it | fail | **partly** |
| 6 | Kept the empty mug, so she was blamed | blamed | **explained** |
| 7 | Mug back on the machine; the boss shrugs | win | **explained** |
| 8 | Mug planted on Kev's desk; Kev blamed | win | **explained** |
| 9 | Mug hidden on her own desk; the boss found it | caught | **partly** |
| 10 | Mug back on the machine, but she was at her desk at 4:00, so her empty chair was blamed | blamed | **partly** |
| 11 | Took the keycard during the boss's restroom trip, while Lin looked away | win | **explained** |
| 12 | Ate the sandwich at the fridge. Lin saw the mustard and told, so desk work | fail | **unexplained** |
| 13 | Sandwich sent Lin hunting, eaten in the boss's corner, then the keycard | win | **explained** (with a false side theory, see beat 10) |
| 14 | Dropped the keycard on the boss's floor, and he pocketed it | fail | **unexplained** |
| 15 | Went for the keycard while the boss looked back | caught | **explained** |

The reader explains every win. Five of the 11 losses are unexplained (2, 3, 4, 12, 14), just short of "most". The whole Kev and coffee half of the level does not come across. The reader's own summary of runs 1 to 5 was: "nothing the player did changed even one frame of the ending." In fact three of those five loops were lost because of what the player did.

### Run 2: unexplained
- **Reading:** "You leave a smoking black pot on the meeting table… The pot is gone. The green man shows 👍… The pot moved the green man around but had no effect on 4:00."
- **What really happened:** She spilled the coffee on the projector at 2:41. Kev ran over (🔧❗), repaired it, and gave a thumbs up (👍) at 2:52. Because the projector worked again, the meeting went ahead.
- **Visual cause:** A missing cue. In `run-02/03.png` the broken projector is a grey lump with smoke and looks like a cooking pot. No repair is ever shown: by `06.png` the smoke is simply gone, and the 👍 floats over Kev with nothing pointing at the projector.
- **Fix:** Draw the dead projector with a brown coffee puddle and a dark lens. While Kev repairs it, show him bent over the projector with a wrench and sparks. At 👍, switch the projector's beam back on so the screen lights up.

### Run 3: unexplained
- **Reading:** "The paper stack and the red line arrive with no 'you used the thing' caption. I can't say whether you caused them, whether you were caught…"
- **What really happened:** Kev bumped into her near the broken projector, put it together ("makes the leap"), pointed her out, and the boss gave her desk work. Kev then fixed the projector anyway, as in run 2, so the meeting happened.
- **Visual cause:** A bubble that doesn't say what it is about. In `run-03/06.png` Kev's bubble is a generic ❗👉. Nothing in it names the projector, so it reads as "caught for something". The repair is invisible here too.
- **Fix:** Make Kev's accusing bubble 📽️💥👉, so the projector itself is the subject. Show the repair as described for run 2.

### Run 4: unexplained
- **Reading:** "I can't tell whether you gave him the coffee or put it back… His mood changes at 2:40 and 2:41 might just be him using the machine."
- **What really happened:** Kev found the pot empty (☕❓😩), saw her cup, took it, and drank it (😌☕). With no coffee left, there was no way to break the projector.
- **Visual cause:** A missing cue. In `run-04/03.png` the two sprites overlap at the machine. The cup simply vanishes from her slot and Kev shows 😌☕. The designed "delighted grab" beat (🤤☕) is not visible, and there is no line from Kev to the cup.
- **Fix:** Before the grab, show Kev's 🤤☕ with a dashed line to her cup. Then show the cup moving in an arc from her hand to his.

### Run 5: partly
- **Reading:** "None. You walked to the kitchen and that's all."
- **What really happened:** Kev drank the only coffee at 2:38. When she arrived the pot was empty, so the plan was dead before she started.
- **Visual cause:** A missing cue. The coffee pot looks the same full or empty, so "there is one cup and it's gone" can't be seen.
- **Fix:** Draw the pot visibly full (dark brown) or empty (clear glass, one drip). When she uses an empty pot, show 🫗❌ over her head.

### Run 9: partly
- **Reading:** "Cause: Being seen at 3:24. I can't tell what he blamed you for. It could be standing near the broken projector, the cup on your desk, or both."
- **What really happened:** The boss went looking for the mug and found it on her desk. That evidence is why she was fired.
- **Visual cause:** The cause and its effect sit in different places. In `run-09/16.png` the boss stands by her desk with the mug inside his cone, but the red line runs from him to her, 100 px away. The bubble is ❗😠 and doesn't mention the mug.
- **Fix:** Have the boss hold up the mug with a ☕👉 bubble, and draw the red line from the mug to her.

### Run 10: partly
- **Reading:** "The meeting happened anyway, and your chair was empty… Breaking the projector didn't stop the meeting."
- **What really happened:** The projector stayed dead. She was blamed for it because she was the one person missing at 4:00.
- **Visual cause:** The end card misleads. A 🚫 on the projector, next to people sitting at the table, reads as "the meeting ran without slides" rather than "who did this?".
- **Fix:** On the end card, have the table point from the smoking projector to her empty chair, and make the icon row 📽️💥 👉 🪑.

### Run 12: unexplained
- **Reading:** "Player's cause: None. Eating the sandwich got her caught and landed the paper stack on her desk, but that changed nothing about the ending."
- **What really happened:** Lin, out hunting for her sandwich, saw mustard on the sweater and told the boss. The desk work kept the player at her desk past the boss's 3:35 jacket pick-up, so the keycard plan was impossible.
- **Visual cause:** A missing cue. In `run-12/07.png` there is no mustard on the sweater. Lin's bubble is 😤, not the 🥪❗👉 that ways.md describes, so it reads as general annoyance and not "it was you".
- **Fix:** Draw a yellow mustard smear on her sweater after she eats, and give Lin's catch the bubble 🥪❗👉.

### Run 14: unexplained
- **Reading:** "She came away with nothing… Why the coat gave nothing this time when it gave the badge in run 13. The only visible difference is that she isn't holding a sandwich."
- **What really happened:** She took the keycard and dropped it on the boss's floor. At 3:26 he found it (🪪❗) and put it in his pocket.
- **Visual cause:** A missing cue. The take and the drop happen inside one picture (`run-14/02.png`, two uses at the same spot). The keycard never shows in her slot or on the floor. The boss's 🪪❗ in `03.png` is read as possibly routine.
- **Fix:** Draw a dropped keycard as a glinting object on the floor. When the boss reaches it, show him bending down, with 🪪❗ and then a pocket icon.

## Beats that misled the reader

1. **The broken projector reads as a "pot", and the repair is invisible** (runs 2 and 3). See run 2 above. This one beat hides the whole "Kev fixes it" fail.

2. **Kev's ☕❓ then 😩 isn't read as "you took the last cup"** (runs 4, 5, 6, 9, 10).
   - Reading (run 6): "Green-shirt man at the machine thinks ☕❓, then 😩… then 😪☕."
   - The reader reports it but never ties it to the cup in their own slot.
   - Visual cause: a missing cue. The pot never shows a full or empty state.
   - Fix: when Kev finds it empty, have him hold the pot upside down.

3. **The boss's 3:33 🚬❓ is misread as paper or a card** (runs 1, 5, 12, 13, 14: "📄?"; runs 10 and 11: "card?").
   - What really happened: he is thinking about a cigarette, which sets up the 3:35 jacket grab and the lockout.
   - Reading (run 11): "He seems to step out every day." The reader has no idea why, so the keycard plan can't be worked out ahead of time.
   - Visual cause: the emoji doesn't read at that size.
   - Fix: show a cigarette with a curl of smoke, and have him pat his jacket pocket.

4. **The boss's ☕🤷 reads as an unknown figure** (runs 7 and 10).
   - Reading (run 7): "a ☕ bubble and a second icon I can't read". Reading (run 10): "☕ + a person with a tool?" and "projector 💥 + tool person".
   - What really happened: he shrugged because the mug on the machine proves nothing.
   - Visual cause: an emoji standing in for a person. 🤷 is read as a separate character, possibly Kev.
   - Fix: drop the 🤷 glyph and show the boss's own sprite with arms raised in a shrug.

5. **The boss's search for the mug reads as routine** (runs 7 and 8).
   - Reading: "The 3:20 kitchen trip might be routine. It also happens in Run 8, where the cup never went back."
   - What really happened: seeing the dead projector at 3:15 sent him on a mug hunt in both runs. It is a real reaction to the player.
   - Visual cause: the cause (projector broken at 3:10) and the effect (his search) are far apart, and nothing marks his walk as a search.
   - Fix: give him a 🔍☕ bubble for the whole hunt, and tick or cross each spot he checks.

6. **The fail end card can be read as success** (runs 1 to 5).
   - Reading: "The first two icons, 📊❌, are the same as the mission card's icons. A player could read this ending as 'mission accomplished'."
   - Visual cause: the icon row repeats the goal instead of showing the result. The red frame alone isn't enough, and 🦗 "reads as a mystery item, not as the punchline".
   - Fix: make the row 📊👀 😬 🦗, with sound lines drawn around the cricket in the picture.

7. **An angry boss on a win card** (run 8).
   - Reading: "Probably a win… An angry boss on a win picture is easy to mistake for a loss."
   - Fix: put the player's grin or 🎉 in the foreground of every win card.

8. **Kev's ❗👉 is too vague** (run 3). See run 3 above.

9. **The mug on her own desk is missed as the evidence** (run 9). See run 9 above.

10. **Sandwich and Lin's hunt** (runs 13 and 14).
    - Reading (run 13): "she may have left the sandwich in the coat… The teal woman's 😤 at 3:24… may just be leftover anger about the sandwich. It's unclear whether the sandwich mattered at all."
    - Reading (run 14) then makes this a false rule: no sandwich, no badge.
    - What really happened: she ate the sandwich in the boss's corner, and Lin's search kept Lin away from her desk while the keycard was taken.
    - Visual cause: a missing cue. Eating happens in the same picture as the rack use, and Lin's hunting bubble is just 😤.
    - Fix: give Lin a 🔍🥪 bubble while she hunts, and leave crumbs where the player ate.

11. **Lin's watching is never noticed** (run 11).
    - The winning run depended on timing Lin's glance, but the reader never mentions Lin.
    - Visual cause: a missing cue. Her cone doesn't stand out against the floor where it covers the rack.
    - Fix: when her cone covers the rack, tint the rack's prompt red, and turn it green when she looks away.

12. **The paper stack's meaning is unclear** (runs 3 and 12).
    - The reader sees the stack and the paper meter, but not that desk work costs them the 3:35 window.
    - Fix: show the meter as a clock arc running to about 3:55, with the boss's jacket icon marked on it.

13. **Minor noise:**
    - The loop counter reads ⟳1 in every run, so the reader thinks it is broken.
    - The crumpled paper by the player's 4:00 position is unexplained.
    - The reader worked out that both are not about them, but each cost some trust. Make the counter go up each loop, and remove the paper or give it a meaning.

<!-- /cold-read:replay -->
