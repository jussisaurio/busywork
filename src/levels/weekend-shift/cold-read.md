# Cold reads: weekend-shift
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:title {"verdict":"works","date":"2026-11-15","commit":"d22f387","hash":"f5324422bd61b6e9a43b8abe46f314b3616f342d14d28ad43b33a0add9b35c99","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","ways":"f3020a30329cbc3c48e43c84d4ce54912272129e4f4c5a994c816893f772a60f","prompts":"71812b7000506aab5e901a48dd63d8aa5d43c7546f39641d13d12179213bd417"},"model":"default","tally":{"miss":3,"near":2,"leak":0},"problems":{"blocker":0,"should":1,"nit":1}} -->
## title: works
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs f5324422bd61: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 3 miss, 2 near, 0 leak.
Problems: 0 blocker, 1 should, 1 nit.
Earlier problems: 0 fixed, 2 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-guess | guesses.md | 12 s | $0.02 |
| 2-judge | report.md | 26 s | $0.09 |
| all | | 38 s (the steps add up to 38 s) | $0.11 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: The 🗓️ icon, with "official," sends guess 3 straight to editing the schedule. That's the shared ending, though not how to pull it off. Fix: replace "Card icons: 🗓️ @player" with "Card icons: ☀️ @player" (the lost sunny Saturday), which names what's at stake instead of the thing you change. (recurring: premise-level?) (The card still has "Card icons: 🗓️ @player", and guess 3 still goes straight to editing the schedule. The fix still works: change it to "Card icons: ☀️ @player" so the icon shows the lost Saturday, not the thing you change.)
- E2 still there: Guess 2 gets to "put it on a coworker" from "stuck working Saturday." That's the stake itself, and it's hard to say less without losing the stake. Fix: leave the line. The ☀️ swap above takes away the extra hint that pushes the guess toward the board. (recurring: premise-level?) (Guess 1 now makes the "put it on a coworker" leap. It comes from the stake itself, and you can't remove it without losing the stake.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The 🗓️ icon, with "official," sends guess 3 straight to editing the schedule. That's the shared ending, though not how to pull it off. Fix: replace "Card icons: 🗓️ @player" with "Card icons: ☀️ @player" (the lost sunny Saturday), which names what's at stake instead of the thing you change. (recurring: premise-level?)

### 1-guess: guesses.md

# Guesses

1. **Get a coworker put on the Saturday shift instead of you before 5:00.** Words: "You're stuck working Saturday", "Get out of it", and the icon "@player". You're the one tagged, so swap the tag onto someone else.
2. **Keep the boss from making it official.** Avoid them, slip out early, or throw off their 5:00 routine so the announcement never happens. Words: "The boss makes it official at 5:00".
3. **Change the schedule itself.** Edit the calendar or roster entry so your name isn't on Saturday. Words: the "🗓️" icon, "makes it official".
4. **Remove the reason for Saturday work.** Finish or get rid of whatever task needs doing, so nobody has to come in. Words: "working Saturday", "Friday, 4:00 PM" (an hour to get it done).
5. **Come up with a believable excuse or conflict for Saturday** before the boss locks it in. Words: "Get out of it", "stuck".

Stake: you give up your weekend and spend Saturday at the office. The card says this outright ("You're stuck working Saturday"), but it doesn't say anything worse happens than that.

### 2-judge: report.md

Verdict: works
- Stake: clear. You lose your Saturday and spend it at the office. "You're stuck working Saturday" says so plainly, and anyone who's had a weekend shift dumped on them feels it. The first reader says nothing worse happens, but nothing worse needs to. Losing a weekend is enough reason to care.
- Get a coworker put on the shift instead: near. This is the ending both routes share (Kev's face goes in the box), but it doesn't touch the key step of either route, which is the noodle boil-over or the fake phone call. It came from "stuck working Saturday" and "@player".
- Keep the boss from making it official: miss. The 5:00 reading always happens; both routes depend on it. It came from "makes it official at 5:00".
- Change the schedule itself: near. It points at the board, which both routes end at, but not at how you get a moment nobody's watching. It came from "🗓️" and "official".
- Remove the reason for Saturday work: miss. No route does this. It came from "working Saturday" and "4:00 PM".
- Come up with an excuse: miss. No route does this. It came from "Get out of it".

The card reads like a coworker talking. "You're stuck working Saturday," "makes it official" and "Get out of it" are all things people actually say. It gives the time, the trouble and the goal, and says nothing about microwaves, phones or Lin. Both of the real tricks are still left for the player to find.

## Earlier problems
- E1: still there (should). The card still has "Card icons: 🗓️ @player", and guess 3 still goes straight to editing the schedule. The fix still works: change it to "Card icons: ☀️ @player" so the icon shows the lost Saturday, not the thing you change.
- E1, more detail: this hint only gets the player to the shared ending. The key step of each route is still hidden, so it isn't a blocker.
- E2: still there (nit). Guess 1 now makes the "put it on a coworker" leap. It comes from the stake itself, and you can't remove it without losing the stake.
- E2, fix: keep "You're stuck working Saturday" as it is. Once the ☀️ swap is made, the card stops pushing this guess toward the board.

## Problems
- none

<!-- /cold-read:title -->

<!-- cold-read:sense {"verdict":"works","date":"2026-11-15","commit":"995a3cc","hash":"e2452c98bb65ab74bb5c3bde8a90f9a5b55a8f7a88c4cdae12fb24d050ebb01a","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","ways":"f3020a30329cbc3c48e43c84d4ce54912272129e4f4c5a994c816893f772a60f","prompts":"4efae5d3d9191596f5720cdf7e7483eea858a949c44cf5579c3f9b7d49f613b3"},"model":"default","tally":{"sensible":7,"stretch":1,"nonsense":0},"problems":{"blocker":0,"should":2,"nit":2}} -->
## sense: works
Recorded 2026-11-15 at commit 995a3cc, by claude -p (model: default). Inputs e2452c98bb65: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 7 sensible, 1 stretch, 0 nonsense.
Problems: 0 blocker, 2 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 42 s | $0.11 |
| all | | 42 s (the steps add up to 42 s) | $0.11 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] Lin's desk faces the board all afternoon, and the board shows a drawn face, not small text. A real person looking at a board in front of her desk would notice when the face in the Saturday box changes from yours to Kev's, especially just after she turned back from the steam. "Nobody reads the weekend schedule" covers reading, not glancing at a picture. Fix: give Lin a reason not to look at the board after a write, such as her monitor or a stack of folders blocking her view of the Saturday box. Or let her notice and shrug, because she's not on it and it's none of her business. A real coworker would do that.
- E2 [should] In "His own face", Kev points at you (👉 you), but the win section says he was "too far off to see the board… never saw anyone at it." A real person doesn't accuse someone of something they didn't see. Fix: have Kev go along for his own sake instead. He's afraid the slot will land on him, so he nods along ("yeah, must've been") rather than acting as a second witness. Or leave him out.

### 1-judge: report.md

Verdict: works

- The ding (win): sensible. When food boils over in the microwave, everyone stares at the steam and nobody gets up. A boss who filled in the schedule on Monday reads out whatever face is there, and Kev groans and takes it.
- The phone (win): sensible. People answer their own ringing phone, say hello twice to nobody and hang up. Lin standing with her back to the room while her fish heats is ordinary office behaviour.
- The trap (lose, not a win): sensible. You look at a noise and see whatever is between you and it.
- Fail (lose): sensible. The boss reads out the face he finds on the board.
- Caught (lose): sensible. A boss who sees you erasing the weekend schedule stops you.
- His own face (lose): stretch. The boss's reaction is right: nobody believes he put himself down. But Kev backs Lin up even though the text says he saw nothing.
- Told on (lose): sensible. A coworker who sees someone rewriting the schedule tells the boss, and he goes to check.
- Blamed (lose): sensible. "Whoever's not at the meeting gets the job nobody wants" is something real bosses do. Overruling his own board to do it is an absurd result, not an absurd method.

## Problems
- should: Lin's desk faces the board all afternoon, and the board shows a drawn face, not small text. A real person looking at a board in front of her desk would notice when the face in the Saturday box changes from yours to Kev's, especially just after she turned back from the steam. "Nobody reads the weekend schedule" covers reading, not glancing at a picture. Fix: give Lin a reason not to look at the board after a write, such as her monitor or a stack of folders blocking her view of the Saturday box. Or let her notice and shrug, because she's not on it and it's none of her business. A real coworker would do that.
- should: In "His own face", Kev points at you (👉 you), but the win section says he was "too far off to see the board… never saw anyone at it." A real person doesn't accuse someone of something they didn't see. Fix: have Kev go along for his own sake instead. He's afraid the slot will land on him, so he nods along ("yeah, must've been") rather than acting as a second witness. Or leave him out.
- nit: When Kev says "again?!", a real coworker would usually add "I did last Saturday!", and even a half-awake boss would pause at that. Fix: make it clear Kev is the office's usual weekend patsy and always gets it. Then "again?!" is a resigned groan, not an objection.
- nit: In the ding route, after the steam "the noodles are back on the counter, open and steaming," but nobody got up to take them out. Fix: leave them in the microwave until you come back for them, or have them still sitting in the fogged window.

<!-- /cold-read:sense -->

<!-- cold-read:motives {"verdict":"fixable","date":"2026-11-15","commit":"d22f387","hash":"cd27c2d023493072b5dfb22d866c14f091b0c1dc62619aa8c2af9cf7bcfa4eb0","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","who":"b9bc24cfb5781ea92192c3af3733b12ce7b91da939f3f5a4c23fdf965c165bcb","prompts":"aa0481bd7d2903c1741f536b834919fec681febf17e0865d79a523b4af6bf462"},"model":"default","tally":{"motivated":1,"binds":1,"thin":2,"unmotivated":0,"contradicts":0,"only-you":0},"problems":{"blocker":1,"should":5,"nit":1}} -->
## motives: fixable
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs cd27c2d02349: the card, premise.md's who does what, the pass's prompts.
Items: 1 motivated, 1 binds, 2 thin, 0 unmotivated, 0 contradicts, 0 only-you.
Problems: 1 blocker, 5 should, 1 nit.
Earlier problems: 0 fixed, 4 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 42 s | $0.11 |
| all | | 42 s (the steps add up to 42 s) | $0.11 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: At 5:00 the boss trusts the board over his own memory, but when Lin tells, he remembers exactly whose face belongs there. The route depends on his trust in the board, and a player would read it as a cheat rather than a habit. — Show the habit before it pays off. For example, at 4:00 Kev asks about the weekend and the boss, without looking up, points at the board (👈🗓️) instead of answering. Also change the tell so he redraws from the rota in his folder (📄), not from memory. (The contradiction is fixed: he no longer redraws from memory, he punishes you for messing with the board. But nothing before 5:00 shows that he trusts the board, not his memory. "He hasn't looked since Monday" is only in the prose, and the 🧐 comes at the moment of the reading, not before it.)
- E2 still there: The boss goes to the copier at 4:20 with no prompt, and the game doesn't say what he does during a jam: stand there cross, fetch Kev, or go back to his desk. Players will guess at the length of their window. — Give him a 📄 thought at 4:19, and have him wait at the copier, tapping his foot (😠), until Kev has fixed it. (Nothing prompts him to go to the copier at 4:20. If it's jammed he's cross (😠), but we're never told whether he waits for Kev, stays the full five minutes or goes back to his desk. Players can't judge how long their window is.)
- E3 still there: Lin has no reason on screen to tell on you. — Give her an early beat where she glances at the board, sees your face and looks relieved (😌), so her tell is clearly self-protection. Also say whether she tells while the boss sits at the board with his back to it. (Lin still has no reason on screen to tell on you, and the route depends on writing where she can't see you. I now grade it a blocker: a real coworker tells on you to save herself, not because she likes the boss. It's also still unclear whether she tells while the boss sits at the board with his back to it, and when she tells: as soon as she sees you, mid-phone call, or at 5:00.)
- E4 still there: Kev's job as the office fixer isn't shown before the jam needs it. — At about 4:05, have him fix something small (a flickering lamp, 🔧), or put a toolbox on his desk. (There's still no toolbox and no small repair before the jam, so Kev's fixer role first appears at the moment the route needs it.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] At 5:00 the boss trusts the board over his own memory, but when Lin tells, he remembers exactly whose face belongs there. The route depends on his trust in the board, and a player would read it as a cheat rather than a habit. — Show the habit before it pays off. For example, at 4:00 Kev asks about the weekend and the boss, without looking up, points at the board (👈🗓️) instead of answering. Also change the tell so he redraws from the rota in his folder (📄), not from memory. (recurring: premise-level?)
- E2 [should] The boss goes to the copier at 4:20 with no prompt, and the game doesn't say what he does during a jam: stand there cross, fetch Kev, or go back to his desk. Players will guess at the length of their window. — Give him a 📄 thought at 4:19, and have him wait at the copier, tapping his foot (😠), until Kev has fixed it. (recurring: premise-level?)
- E3 [blocker] Lin has no reason on screen to tell on you. — Give her an early beat where she glances at the board, sees your face and looks relieved (😌), so her tell is clearly self-protection. Also say whether she tells while the boss sits at the board with his back to it. (recurring: premise-level?)
- E4 [should] Kev's job as the office fixer isn't shown before the jam needs it. — At about 4:05, have him fix something small (a flickering lamp, 🔧), or put a toolbox on his desk. (recurring: premise-level?)
- E5 [should] Lin's tell is set to "while the boss is busy", but the boss is only busy at the copier or on a phone call that lasts about five seconds. It isn't clear whether she interrupts him, waits for him, or saves it for the reading. A player can't tell what caused the punishment. — Have her get up and tap the glass or walk to him at once (❗👉), or hold it until 5:00 and say so on screen.
- E6 [should] Lin would only tell if the face you wrote hurts her, but she tells whatever you write. — Make the tell conditional: she tells only when her own Saturday is at stake (your face out of the box, hers in), and stays quiet or smirks (😏) when you write Kev's face.

### 1-judge: report.md

Verdict: fixable
- The boss: motivated — the copier, the phone and the reading all have everyday reasons. At the tell he now punishes you for touching the board instead of remembering whose face was there, so he no longer contradicts himself. What's still thin: the 4:20 copier trip has no prompt on screen, and nothing before 5:00 shows that he trusts the board over his memory.
- Lin: thin — her late Friday fish is shown well: the lunch box sits on her desk from the start and she has a 🐟 thought at 4:30. Her tell has no reason on screen. That matters most if you put Kev's face in the box, because a real coworker has no reason to report that.
- Kev: thin — he gets up for the jammed copier because fixing machines is his job, but that job is only in the prose until the jam happens. His 🤢 and 😩 reactions are fine.
- The card's rule: binds — the card sets no rule, and the 4:55 gathering, where everyone looks at your empty chair (❓), applies to everyone.

## Earlier problems
- E1: still there (should) — The contradiction is fixed: he no longer redraws from memory, he punishes you for messing with the board. But nothing before 5:00 shows that he trusts the board, not his memory. "He hasn't looked since Monday" is only in the prose, and the 🧐 comes at the moment of the reading, not before it.
- E2: still there (should) — Nothing prompts him to go to the copier at 4:20. If it's jammed he's cross (😠), but we're never told whether he waits for Kev, stays the full five minutes or goes back to his desk. Players can't judge how long their window is.
- E3: still there (blocker) — Lin still has no reason on screen to tell on you, and the route depends on writing where she can't see you. I now grade it a blocker: a real coworker tells on you to save herself, not because she likes the boss. It's also still unclear whether she tells while the boss sits at the board with his back to it, and when she tells: as soon as she sees you, mid-phone call, or at 5:00.
- E4: still there (should) — There's still no toolbox and no small repair before the jam, so Kev's fixer role first appears at the moment the route needs it.

## Problems
- should: Lin's tell is set to "while the boss is busy", but the boss is only busy at the copier or on a phone call that lasts about five seconds. It isn't clear whether she interrupts him, waits for him, or saves it for the reading. A player can't tell what caused the punishment. — Have her get up and tap the glass or walk to him at once (❗👉), or hold it until 5:00 and say so on screen.
- should: Lin would only tell if the face you wrote hurts her, but she tells whatever you write. — Make the tell conditional: she tells only when her own Saturday is at stake (your face out of the box, hers in), and stays quiet or smirks (😏) when you write Kev's face.
- nit: When the phone rings while he's at the board, he puts the marker back on the tray, which looks like it's done for the player. — Give it a reason: he needs both hands, or he sets it down to pick up the phone, shown in one beat.

<!-- /cold-read:motives -->

<!-- cold-read:props {"verdict":"works","date":"2026-11-15","commit":"d22f387","hash":"25e518621ddedd8bea9a3c92a72cc8991c3c845aef2ec89beddf31797df4c539","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","things":"3182dabc747e99d8f0bb41629a78414a29e1d0fb9103a0529393c67ebc5d6842","prompts":"e4a62e7d4c56bb76d5cc46d69b3c0fd96478427c533f15affaaa5f43d93d7558"},"model":"default","tally":{"fits":7,"odd":2,"pointless":0,"misleading":0},"problems":{"blocker":0,"should":5,"nit":2}} -->
## props: works
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs 25e518621dde: the card, premise.md's things in the office, the pass's prompts.
Items: 7 fits, 2 odd, 0 pointless, 0 misleading.
Problems: 0 blocker, 5 should, 2 nit.
Earlier problems: 2 fixed, 4 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 29 s | $0.08 |
| all | | 29 s (the steps add up to 29 s) | $0.08 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 fixed: The fridge and sink look usable and aren't, and they sit right next to the microwave, which is. Players will click them and decide the kitchen is broken or that they're missing something. — Either give each one a one-line reaction ("Fridge: someone's yoghurt from March. You close it."), or draw them as flat counter fronts with no handle or tap, so they read as background. (the fridge and sink are gone. The counter is described as bare, with the microwave as the only usable thing on it.)
- E2 fixed: You can jam the copier with a paper clip, but no paper clip appears in the office. Nothing tells the player the copier can be jammed, or with what. — Add a visible paper clip pot on your desk or by the copier tray, and list it as a thing. (a pot of paper clips now sits on the copier's lid.)
- E3 still there: The boss's phone is on a side table under the window, and his desk has none. That reads as staged. — Put the phone on his desk with a long coiled cord, and have him get up to stand at the window while he talks. People really do that. (the phone is still on a side table under the window and his desk still has none.)
- E4 still there: An internal phone in a supply room has no everyday reason to be there. — Make it a wall extension labelled "Orders / Facilities", or a phone on a shelf by the stationery order form, so it has a job of its own. (the supply room phone still has no everyday job. It exists only to ring the boss without being seen.)
- E5 still there: The red marker lies in the tray beside the black one, but only the black one is said to be used. If the red one can't be picked up, it misleads the player. — Either let the player write with the red one (with a reaction), or leave only the black marker in the tray and draw the red line as already dry. (the red marker still lies in the tray, but only the black marker and the eraser are ever used.)
- E6 still there: Kev fixes the copier with a spanner. Real paper jams get cleared by opening a panel by hand, so the spanner is odd. — Have him open the side door and pull the sheet out, or use the copier's green release lever. (Kev still clears a paper jam with a spanner.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The boss's phone is on a side table under the window, and his desk has none. That reads as staged. — Put the phone on his desk with a long coiled cord, and have him get up to stand at the window while he talks. People really do that. (recurring: premise-level?)
- E2 [should] An internal phone in a supply room has no everyday reason to be there. — Make it a wall extension labelled "Orders / Facilities", or a phone on a shelf by the stationery order form, so it has a job of its own. (recurring: premise-level?)
- E3 [should] The red marker lies in the tray beside the black one, but only the black one is said to be used. If the red one can't be picked up, it misleads the player. — Either let the player write with the red one (with a reaction), or leave only the black marker in the tray and draw the red line as already dry. (recurring: premise-level?)
- E4 [should] Kev fixes the copier with a spanner. Real paper jams get cleared by opening a panel by hand, so the spanner is odd. — Have him open the side door and pull the sheet out, or use the copier's green release lever. (recurring: premise-level?)
- E5 [should] The noodle cup goes into the microwave with its lid on and no water, then boils over. Anyone who has made instant noodles will find that odd. — Add a kettle or water cooler, or describe it as a microwave noodle bowl already filled with water and "vent lid slightly".

### 1-judge: report.md

Verdict: works

- Saturday board: fits — a weekend rota on a whiteboard is ordinary, and the markers and eraser in the tray say "write here".
- Noodle cup: fits — an afternoon snack is a normal reason to use the microwave. A lidded cup boiling over with no water added is a little odd.
- Microwave: fits — every office kitchen has one, and the lit window and digits show it works.
- Kitchen counter: fits — it's described as bare and reads as background. An office counter with no kettle or sink looks a bit staged.
- Copier: fits — the paper-clip pot on the lid is now visible, and it's ordinary office clutter.
- Supply room's phone: odd — internal phones exist, but this one is described only by what it does for the trick: hidden, rings the boss's phone, unseen. It has no job of its own.
- Boss's phone: odd — it sits on a side table under the window while his desk has none, so his back faces the office. It reads as arranged for the route.
- Lin's lunch box: fits — fish reheated at 4:30 is painfully real.
- Desks, chairs, plants: fits — ordinary furniture with a clear purpose. The chairs set up for the reading make sense.

## Earlier problems
- E1: fixed — the fridge and sink are gone. The counter is described as bare, with the microwave as the only usable thing on it.
- E2: fixed — a pot of paper clips now sits on the copier's lid.
- E3: still there (should) — the phone is still on a side table under the window and his desk still has none.
- E4: still there (should) — the supply room phone still has no everyday job. It exists only to ring the boss without being seen.
- E5: still there (should) — the red marker still lies in the tray, but only the black marker and the eraser are ever used.
- E6: still there (should) — Kev still clears a paper jam with a spanner.

## Problems
- should: The noodle cup goes into the microwave with its lid on and no water, then boils over. Anyone who has made instant noodles will find that odd. — Add a kettle or water cooler, or describe it as a microwave noodle bowl already filled with water and "vent lid slightly".
- nit: The kitchen counter is completely bare, which looks like a stage set. — Draw a kettle, a mug tree or a dish rack as flat background art, clearly not usable.
- nit: The board entry says "the boss holds it while he sits beside the board". It's unclear whether "it" means the marker, the eraser or the tray. — Say "holds the black marker".

<!-- /cold-read:props -->

<!-- cold-read:joke {"verdict":"works","date":"2026-11-15","commit":"d22f387","hash":"ec8a07b538f55996ef554a730b24979f27bfede4d44c66d5830f428b26c156a3","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","ways":"f3020a30329cbc3c48e43c84d4ce54912272129e4f4c5a994c816893f772a60f","prompts":"a4db88684bb737e23a87ca6a38aba544ee72fc48b552bd042e8767ee6f88c0a7"},"model":"default","tally":{"funny":3,"payoff":0,"mild":5,"chore":0,"flat":0,"undescribed":1},"problems":{"blocker":0,"should":7,"nit":1}} -->
## joke: works
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs ec8a07b538f5: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 3 funny, 0 payoff, 5 mild, 0 chore, 0 flat, 1 undescribed.
Problems: 0 blocker, 7 should, 1 nit.
Earlier problems: 0 fixed, 5 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 29 s | $0.10 |
| all | | 29 s (the steps add up to 29 s) | $0.10 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: the win has no end card. premise.md doesn't describe the end card, so the payoff stops on the map while every losing route gets its Saturday picture — Give it a mirror of the Fail card: Saturday, sun in the window, Kev alone at a desk with the pile of work, glaring at your face on a framed photo or the board beside him. (ways.md still describes no end card for the win. The last thing described is Kev's 😩 on the map.)
- E2 still there: the phone route is mild, and the 4:30 wait is a chore — Make the fish land: as it heats, green smell-lines drift across the office and people wrinkle their noses. The window you're waiting for then has its own gag, and the boss's slammed phone caps it. (Lin's fish is still only a 🐟 thought, so the window you wait for at 4:30 has no gag of its own.)
- E3 still there: Caught is mild — Make the half-drawn face a picture: the top half is Kev and the bottom half is still you. The end card shows that hybrid on the board while the boss points at you. (the eraser wipes your face off before the marker draws, so the half-drawn face is not a hybrid and has no picture.)
- E4 still there: Fail is the obvious picture — Add one twist to the end card. For example, the boss has left you a sticky note on the board ("Thanks for volunteering!"), or Kev's out-of-office auto-reply is pinned up beside you. (the Fail end card hasn't changed: sun in the window, pile of work, your face on the board.)
- E5 still there: Told on is mild — Have Lin go back to her fish straight after pointing at you, eating with a smug look while your papers fly. Then the picture has a character in it, not just a penalty. (Told on still has no character beat. Lin points and the boss punishes you.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] the win has no end card. premise.md doesn't describe the end card, so the payoff stops on the map while every losing route gets its Saturday picture — Give it a mirror of the Fail card: Saturday, sun in the window, Kev alone at a desk with the pile of work, glaring at your face on a framed photo or the board beside him. (recurring: premise-level?)
- E2 [should] the phone route is mild, and the 4:30 wait is a chore — Make the fish land: as it heats, green smell-lines drift across the office and people wrinkle their noses. The window you're waiting for then has its own gag, and the boss's slammed phone caps it. (recurring: premise-level?)
- E3 [should] Caught is mild — Make the half-drawn face a picture: the top half is Kev and the bottom half is still you. The end card shows that hybrid on the board while the boss points at you. (recurring: premise-level?)
- E4 [should] Fail is the obvious picture — Add one twist to the end card. For example, the boss has left you a sticky note on the board ("Thanks for volunteering!"), or Kev's out-of-office auto-reply is pinned up beside you. (recurring: premise-level?)
- E5 [should] Told on is mild — Have Lin go back to her fish straight after pointing at you, eating with a smug look while your papers fly. Then the picture has a character in it, not just a penalty. (recurring: premise-level?)
- E6 [should] the trap is only mild, a clever idea with a plain picture — While everyone stares at the beeping copier, show the copier spit out one last sheet as you're spotted: a copy of your face mid-wipe.
- E7 [should] Kev's "again?!" is the best line in the win, but it's one emoji and could pass unnoticed — Give it a beat: Kev looks up from his code, sees his face, and pulls out a calendar showing every Saturday already crossed off with his face. That could also be the win's end card.

### 1-judge: report.md

Verdict: works
- The ding (win): funny — your noodles boil over, steam everywhere, and the whole office just stares at it with nobody getting up. Meanwhile you calmly swap your face for Kev's behind their backs. Kev's groan of "again?!" caps it.
- The phone (win): mild — the boss's "Hello? ... Hello? 🙄" is a small, familiar laugh, but the route is mostly waiting until 4:30 and walking.
- The trap (lose): mild — the beeping copier draws every eye straight through you at the board. The irony is neat, but the picture is just "seen".
- Fail (lose): mild — you alone at a desk on Saturday is exactly what the card promised, with no twist.
- Caught (lose): mild — a half-drawn face in a wiped box. Since the wipe finishes first, it's only part of a face, not a joke.
- His own face (lose): funny — the boss finds himself on the weekend shift and goes red to the ears, hands spread, and then the whole room points at you.
- Told on (lose): mild — Lin points, papers fly. It's a penalty with no character beat.
- Blamed (lose): funny — your empty chair is outlined in red on the floor like a crime scene, and the boss points at it. Everyone knows the absent person gets the job.
- The ending: undescribed — premise.md doesn't describe the end card. The win stops on the map with Kev groaning, while every loss gets its Saturday picture.

## Earlier problems
- E1: still there (should) — ways.md still describes no end card for the win. The last thing described is Kev's 😩 on the map.
- E2: still there (should) — Lin's fish is still only a 🐟 thought, so the window you wait for at 4:30 has no gag of its own.
- E3: still there (should) — the eraser wipes your face off before the marker draws, so the half-drawn face is not a hybrid and has no picture.
- E4: still there (should) — the Fail end card hasn't changed: sun in the window, pile of work, your face on the board.
- E5: still there (should) — Told on still has no character beat. Lin points and the boss punishes you.

## Problems
- should: the trap is only mild, a clever idea with a plain picture — While everyone stares at the beeping copier, show the copier spit out one last sheet as you're spotted: a copy of your face mid-wipe.
- should: Kev's "again?!" is the best line in the win, but it's one emoji and could pass unnoticed — Give it a beat: Kev looks up from his code, sees his face, and pulls out a calendar showing every Saturday already crossed off with his face. That could also be the win's end card.
- nit: the phone call's 🙄 hang-up is a weak ending for a whole route — Have the boss glare round the office suspiciously after hanging up, straight past you at the board, because he's looking at people, not the board.

<!-- /cold-read:joke -->

<!-- cold-read:premise {"verdict":"works","date":"2026-11-15","commit":"d22f387","hash":"5c54ee5096fb686d31b7df4246d92902f9f43b86b64cfc0dc4e953ea27452b37","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","premise":"42fd0c723a58c6669f0e0abd6ef22ad691b9a8af05edac8766f84e2b76ce131e","prompts":"f5883160f1d3858e02431a0eee883b8939a1a09664f6e614e9f267258968625e"},"model":"default","problems":{"blocker":0,"should":5,"nit":5}} -->
## premise: works
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs 5c54ee5096fb: the card, premise.md, the pass's prompts.
Problems: 0 blocker, 5 should, 5 nit.
Earlier problems: 1 fixed, 4 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 14 s | $0.03 |
| 2-review | report.md | 145 s | $0.75 |
| all | | 158 s (the steps add up to 158 s) | $0.78 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: **The board goes dead at about 4:51 for a reason you can't see.** The boss's arrival at the board sets `rosterLocked` (`cast.js:114`), and it is never cleared. He sits facing east with the board behind him, out of his cone. A player who has learned "stay out of the cone" walks up behind him, and the board doesn't light up. Worse: ring his phone at 4:52 and he walks back to his office, ding the noodles too, and every watcher looks away. The board still does nothing, and the red marker still lies in its tray (`props.js:171`). The level's own rule (sight decides) breaks exactly where the player tests it. **Fix:** make the lock something you can see. Have him take both markers (an empty tray), and unlock the board whenever he isn't sitting beside it. Or drop the lock and let the gather's seating and cones guard the board. (The lock now matches what you see: the boss holds the black marker and the board opens again when he gets up for the phone. But `props.js:171` still draws the red marker in the tray. At 4:56 a player sets off the ding, all three heads turn east, a marker sits right there, and the board still does nothing.)
- E2 fixed: **The own-face ending shows that he remembers.** When he finds his own face, he redraws yours and glares at you. So he knew it was you all along, which undercuts why he accepts Kev's face without a blink. **Fix:** have him wipe the slot and look round the room, then pick whoever is standing nearest the board. Or have him redraw yours only when Lin tells him who wrote it. (Lin points at you (👀👉) before he draws your face back in, so he has a reason that isn't memory. There is one rare case left: if `linSawYou` is false, `punchline()` still draws your face in and glares at you with nobody pointing. It's a nit.)
- E3 still there: **You can start your noodles while Lin's fish is in the microwave.** `start_microwave` only checks `noodles === 'cold'` (`index.js:100`). Both foods then turn in one lit window while she stands in front of it. **Fix:** block the microwave while `linHeatsFish`, or have her wait her turn (⏳). (`start_microwave` still only checks `noodles === 'cold'` (`index.js:102`). Start your noodles at 4:34 and they go round in the window with Lin's fish while she stands in front of it.)
- E4 still there: **His cone sweeps the board as he walks out at 4:50**, even though he is "reading his folder". A player sees the cone pass over the new face and assumes he saw it. **Fix:** narrow or dim his cone while the `folder` animation plays. (The folder walk is gone, but at 4:55 he walks from his door to his chair beside the board, and his cone sweeps the new face. Nothing comes of it, but a player braces for a catch that never comes.)
- E5 still there: **The win depends on the board picking Kev for you.** E always writes Kev, never Lin, and nothing on screen says why Kev and not Lin. **Fix:** let the first write pick whoever is nearest the board, or show one beat that marks Kev as the easy target (a 😴 at his desk). (The write always puts Kev in, and nothing on screen says why Kev. You never choose, so nobody is misled, but "poor Kev" lands by luck. Nothing set him up as the obvious fall guy.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] **The board goes dead at about 4:51 for a reason you can't see.** The boss's arrival at the board sets `rosterLocked` (`cast.js:114`), and it is never cleared. He sits facing east with the board behind him, out of his cone. A player who has learned "stay out of the cone" walks up behind him, and the board doesn't light up. Worse: ring his phone at 4:52 and he walks back to his office, ding the noodles too, and every watcher looks away. The board still does nothing, and the red marker still lies in its tray (`props.js:171`). The level's own rule (sight decides) breaks exactly where the player tests it. **Fix:** make the lock something you can see. Have him take both markers (an empty tray), and unlock the board whenever he isn't sitting beside it. Or drop the lock and let the gather's seating and cones guard the board. (recurring: premise-level?)
- E2 [should] **You can start your noodles while Lin's fish is in the microwave.** `start_microwave` only checks `noodles === 'cold'` (`index.js:100`). Both foods then turn in one lit window while she stands in front of it. **Fix:** block the microwave while `linHeatsFish`, or have her wait her turn (⏳). (recurring: premise-level?)
- E3 [should] **The boss stares at a wall for six seconds.** From his desk (13,3), his line to the microwave (27,9) runs into the solid corner at (20,6). At the ding his cone snaps east into his own wall and he thinks 😮🍜 about steam he can't see. Premise.md says "everyone stares at the steam", which isn't true for him, and the player sees exactly that: a cone pointed at plaster for six seconds. **Fix:** make the north-east wall of his office glass, or move his desk so the kitchen is in his line through the glass.
- E4 [should] **Lin guards the board but never notices it changed.** On the ding route she turns back at the end of the steam and is looking straight at a fresh face. On the phone route she comes back at 4:37 and eats her fish facing it. She says nothing either way. Yet when the boss's face shows up she remembers you were near the board. A watcher who tattles on a write but ignores what was written is a rule that only binds the player. **Fix:** when Lin looks back at the new face, give her a beat of 🤔 then a shrug (🤷). That puts "nobody reads this board" on screen.
- E5 [should] **The win picture is the obvious version.** "Swap the name on the roster" is the first idea anyone has. The funny part, the whole office frozen by a boiling cup of noodles, never reaches the end card: its row is ✏️ @kev 😢. **Fix:** on the ding route, put the steaming open noodle cup on the desk next to the crying Kev in the end card, or use #microwave as the row's cause icon.

### 1-card: first-read.md

**Situation:** It's Friday at 4:00 PM. I've already been picked to work Saturday, but it isn't official yet. At 5:00 the boss will make it official, so I have one hour.

**What I must do:** Stop it from becoming official. I can read that several ways:
- (a) Stop the boss from making the announcement at all.
- (b) Get someone else picked instead.
- (c) Be gone or unfindable at 5:00.
- (d) Make the boss believe I can't work.

**If I fail:** At 5:00 it becomes official and I work Saturday. That's probably the loss picture.

**Questions:**
- Name: the whole level happens on Friday. Is "Saturday" the threat, or is the loss picture Saturday itself?
- What does "makes it official" mean in practice? A meeting, a sign-up sheet, a calendar entry, an email? What should I be watching for?
- Does pushing it onto a coworker count as a win, or only getting everyone out of it?
- If I just walk out early, is that a win or a loss?
- Why am I the one stuck? Do I need to know?
- The icons are 🗓️ @player. Is that a calendar item I can find, or just "assigned to you"?
- Can I lose before 5:00, for example by getting caught?

### 2-review: report.md

Verdict: works

**Best thing:** your noodles boil over in the microwave, every head in the office turns to the steam, and you quietly swap the face on the Saturday board behind their backs.

## Earlier problems
- E1: still there (should). The lock now matches what you see: the boss holds the black marker and the board opens again when he gets up for the phone. But `props.js:171` still draws the red marker in the tray. At 4:56 a player sets off the ding, all three heads turn east, a marker sits right there, and the board still does nothing.
- E2: fixed. Lin points at you (👀👉) before he draws your face back in, so he has a reason that isn't memory. There is one rare case left: if `linSawYou` is false, `punchline()` still draws your face in and glares at you with nobody pointing. It's a nit.
- E3: still there (should). `start_microwave` still only checks `noodles === 'cold'` (`index.js:102`). Start your noodles at 4:34 and they go round in the window with Lin's fish while she stands in front of it.
- E4: still there (nit). The folder walk is gone, but at 4:55 he walks from his door to his chair beside the board, and his cone sweeps the new face. Nothing comes of it, but a player braces for a catch that never comes.
- E5: still there (nit). The write always puts Kev in, and nothing on screen says why Kev. You never choose, so nobody is misled, but "poor Kev" lands by luck. Nothing set him up as the obvious fall guy.

## Problems
- should: **The boss stares at a wall for six seconds.** From his desk (13,3), his line to the microwave (27,9) runs into the solid corner at (20,6). At the ding his cone snaps east into his own wall and he thinks 😮🍜 about steam he can't see. Premise.md says "everyone stares at the steam", which isn't true for him, and the player sees exactly that: a cone pointed at plaster for six seconds. **Fix:** make the north-east wall of his office glass, or move his desk so the kitchen is in his line through the glass.
- should: **Lin guards the board but never notices it changed.** On the ding route she turns back at the end of the steam and is looking straight at a fresh face. On the phone route she comes back at 4:37 and eats her fish facing it. She says nothing either way. Yet when the boss's face shows up she remembers you were near the board. A watcher who tattles on a write but ignores what was written is a rule that only binds the player. **Fix:** when Lin looks back at the new face, give her a beat of 🤔 then a shrug (🤷). That puts "nobody reads this board" on screen.
- should: **The win picture is the obvious version.** "Swap the name on the roster" is the first idea anyone has. The funny part, the whole office frozen by a boiling cup of noodles, never reaches the end card: its row is ✏️ @kev 😢. **Fix:** on the ding route, put the steaming open noodle cup on the desk next to the crying Kev in the end card, or use #microwave as the row's cause icon.
- nit: **The card and the fiction disagree on "official".** The card says the boss "makes it official at 5:00". What actually happens is that he reads out a board he filled in on Monday. The first reader asked what "official" means. **Fix:** "The boss reads out the Saturday board at 5:00. Get out of it." That names the event without giving away the way out.
- nit: **Being absent makes him ignore the board.** In the blamed ending, Kev's face is on the board and Kev is in his chair, yet the boss wipes it and draws you in. That undercuts "he reads out whatever face is there", which the win depends on. **Fix:** draw nothing new. Just have him point at the empty chair while Kev 😮‍💨 looks relieved, and let the card show you at the desk.
- nit: **Lin eats lunch at 4:30 PM.** It shows as hunger (🐟), but a cold reader just finds it odd. **Fix:** make it a reheated mid-afternoon snack: a smaller tub and a ☕ beside it.

<!-- /cold-read:premise -->

<!-- cold-read:verbs {"verdict":"works","date":"2026-11-15","commit":"3347b98+dirty","hash":"c5686faf9978bf37c9cb875a81c21ca721d186e29fce3180b3ab07a7d7f373ab","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","verbs":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","prompts":"061e477a6c379be6b6b5b6834f94ffc76cc7e18374b9322d5658da9920b335c4"},"model":"none","tally":{},"problems":{"blocker":0,"should":0,"nit":0}} -->
## verbs: works
Recorded 2026-11-15 at commit 3347b98+dirty, by the tool (model: none). Inputs c5686faf9978: the card, the verb sheets, the pass's prompts.
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

<!-- cold-read:faces {"verdict":"fixable","date":"2026-11-15","commit":"fca016b","hash":"d49e3f0e2b4bdfbe74057534ba88b62beef25520e88afbf3e86039ea01ad36b8","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","checks":"69ad3ba43d5cfd8bed529d25ce051f55d13e27475a87edae3ec5ffbd5be037ee","faces":"fe4be21c0e9559c62e1e0981f4f9b95f9557abfb0ff54a91716a4c79a7f1eb4f","prompts":"7b1353c6de0c5cf6c70013ea3cb8b0b9dfaae148125f1ffbe7155582b0b04938"},"model":"default","tally":{"clear":30,"vague":3,"misread":0},"problems":{"blocker":1,"should":3,"nit":2}} -->
## faces: fixable
Recorded 2026-11-15 at commit fca016b, by claude -p (model: default). Inputs d49e3f0e2b4b: the card, route-checks.js, the bubbles, the pass's prompts.
Items: 30 clear, 3 vague, 0 misread.
Problems: 1 blocker, 3 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 69 s | $0.21 |
| 2-judge | report.md | 167 s | $0.69 |
| all | | 236 s (the steps add up to 236 s) | $0.90 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 28 the document glyph is a pale grey blob that nobody can name. It is the payoff of a phone call, and a player can't tell what the boss learned about Bun or why he then panics in 29 — use a high-contrast 📄 or 📋. If it means "Bun is on the roster," use 🗓️ 👉 Bun-face to match the card's icons.
- E2 [should] In 26 the bare "!" doesn't say whether Spiky saw Bun or heard the printer, so a player can't tell if being seen at the printer is risky — use 👀 👉 Bun-face like 22 if he saw her, or 🖨️ ! if it's the noise.
- E3 [should] 4 is a bare "?" thought that adds nothing in its frame — say what she's looking at, e.g. the boss's face plus "?".
- E4 [should] The same 👉 Bun-face glyph means "she's assigned" in 7, "she did it" in 23 and "for her" in 28. The frames mostly save it, but the hand is overloaded — add the speaker's mood to blame bubbles (😠 👉 Bun-face, as 25 already does).

### 1-read: reading.md

# BUSYWORK bubble reading

Cloud-shaped bubbles read as thoughts, square-ish ones as speech, and yellow starbursts as alarms. Two cartoon portraits keep showing up. "Bun" is a woman with a brown hair bun and a red top. "Spiky" is a man with dark spiky hair and a green top. I'm guessing Bun is me, the player.

1. Thought: "Fish…" They're thinking about fish, maybe lunch or a pet.
2. "Fish, yum 😊." They like fish, or they're happy about the fish.
3. A green, sick face: "I feel sick," or "that's gross." Maybe the fish went off.
4. Thought: "Huh? I'm confused."
5. Megaphone: an announcement, "Listen up!" Or "turn it down."
6. Thought, face with a monocle: "Hmm, suspicious," or "let me look at this closely."
7. Pointing at Bun: "Her," or "you, go."
8. Teeth-gritted grimace: "Yikes, awkward," or "uh-oh."
9. Weary, anguished face: "Ugh, I'm exhausted," or "this is too much."
10. Thought, calendar plus "?": "What day is it?" or "when's the deadline or meeting?"
11. Alarm, "! pointing at Bun": "Hey, YOU!" Bun is in trouble or urgently needed.
12. Thought, surprised face plus noodle bowl: "Ooh, noodles!" or "who took my noodles?"
13. Hand pointing at Spiky: "Him," or "go see him."
14. Same as 13. The hand looks very slightly different, but I can't tell what that changes. If it's meant to differ, I missed it.
15. Party popper: "Celebrate!" There's a party, or "well done."
16. Phone handset: "Phone call," "I'm on the phone," or "call someone."
17. Alarm, red desk phone plus "!": "The phone's ringing! Answer it!"
18. Phone plus "?": "Who's calling?" or "did anyone call?"
19. Phone plus "??": a stronger 18. "Why is nobody answering?" or "where's that call?"
20. Eye-roll: "Ugh, whatever," or "here we go again."
21. Bald old man plus flushed, wide-eyed face: "The (old) boss! Eek," or "that guy is embarrassing."
22. Eyes, then a hand pointing at Bun: "I'm watching you," or "look at her."
23. Pointing at Bun again, same as 7: "Her," or "your turn."
24. Pencil plus Bun: "Bun, write this down or sign it," or "assign it to her."
25. Angry face pointing at Bun: "I'm mad at you," or "it's her fault."
26. Plain "!": "Oh!" "Hey!" or "I just noticed something."
27. Thought, printer: "I need to print something," or "the printer…"
28. A document (or papers) pointing at Bun: "Give this paper to her," or "she has the paper."
29. Alarm, calendar plus "!": "The deadline is now!" or "I forgot the meeting!"
30. Thought, Bun plus "?": "Where's Bun?" or "who is she?"
31. Thought, anxious sweating face: "Nervous, worried, in trouble."
32. Wrench: "It needs fixing," "I'm fixing it," or "get maintenance."
33. Smile: "Thanks, all good."

## Main confusions
- I can't tell the two hands in 13 and 14 apart in meaning.
- A hand pointing at a face could mean "go to her," "give it to her," or "blame her."
- Repeated "?" in 19 seems to mean more urgency, but I'm guessing.
- 28: the grey page icon is hard to read at this size.

### 2-judge: report.md

Verdict: fixable
- 1: clear — the teal coworker at her desk is thinking about her fish lunch.
- 2: clear — the teal coworker is happily eating her fish.
- 3: clear — Spiky, at the next desk, is sickened by the fish smell.
- 4: vague — the teal coworker thinks "?" as the boss comes out. A bare "?" doesn't say what puzzles her.
- 5: clear — the boss uses a megaphone: "Gather round, announcement."
- 6: clear — the boss checks the board with a monocle face: "Let me look closely."
- 7: clear — the boss points at Bun next to the board: "She works Saturday."
- 8: clear — Bun grimaces as she is named: "Uh-oh."
- 9: clear — Bun is defeated at the board.
- 10: clear — the boss and the teal coworker wonder who is on the Saturday roster. The calendar matches the card's icon.
- 11: clear — the boss catches Bun at the board: "Hey, YOU!"
- 12: clear — three people smell noodles from the microwave and head over.
- 13: clear — the boss points at Spiky's face on the board: "He works Saturday."
- 14: clear — same meaning as 13. The hand is a different emoji, but in its frame it means the same thing.
- 15: clear — Bun celebrates escaping.
- 16: clear — Bun makes a call from the side-room phone.
- 17: clear — the boss is alarmed: "The phone's ringing!"
- 18: clear — the boss answers: "Hello?"
- 19: clear — the boss gets no answer: "Hello?? Anyone?"
- 20: clear — the boss rolls his eyes at the dead line.
- 21: clear — the boss sees his own photo on the board and is embarrassed.
- 22: clear — the teal coworker says "I saw her," eyes then pointing at Bun.
- 23: clear — Spiky says "It was her." This is the same glyph as 7 but means blame here. The surrounding bubbles make that clear.
- 24: clear — the boss writes Bun back onto the board.
- 25: clear — the boss angrily blames Bun.
- 26: vague — Spiky says "!" with a sightline to Bun at the printer. It's unclear whether he spotted her or reacts to the printer.
- 27: clear — the boss and the teal coworker think about the printer that is acting up.
- 28: vague — the boss on the phone says "[grey blob] → Bun." Nobody can name the first glyph, so the bubble could mean "a paper for Bun," "Bun's paperwork" or "Bun is down for it." This is the phone route's payoff, so it matters.
- 29: clear — the boss is alarmed: "The roster!"
- 30: clear — the crowd at the board wonders where Bun is.
- 31: clear — Bun is nervous, hiding in the kitchen.
- 32: clear — Spiky fixes the printer.
- 33: clear — Spiky says the printer is fixed and all is good.

## Problems
- blocker: In 28 the document glyph is a pale grey blob that nobody can name. It is the payoff of a phone call, and a player can't tell what the boss learned about Bun or why he then panics in 29 — use a high-contrast 📄 or 📋. If it means "Bun is on the roster," use 🗓️ 👉 Bun-face to match the card's icons.
- should: In 26 the bare "!" doesn't say whether Spiky saw Bun or heard the printer, so a player can't tell if being seen at the printer is risky — use 👀 👉 Bun-face like 22 if he saw her, or 🖨️ ! if it's the noise.
- should: 4 is a bare "?" thought that adds nothing in its frame — say what she's looking at, e.g. the boss's face plus "?".
- should: The same 👉 Bun-face glyph means "she's assigned" in 7, "she did it" in 23 and "for her" in 28. The frames mostly save it, but the hand is overloaded — add the speaker's mood to blame bubbles (😠 👉 Bun-face, as 25 already does).
- nit: 13 and 14 draw the pointing hand differently but mean the same thing, and a first reader noticed and wondered why — use one hand glyph everywhere.
- nit: In 12, 😮 with 🍜 could also read as "who took my noodles?" — 🤤 🍜 reads only as "want noodles."

<!-- /cold-read:faces -->

<!-- cold-read:tells {"verdict":"fixable","date":"2026-11-15","commit":"fca016b","hash":"974c24fa92cbb03a7916438b3439923d378186c800262d29f3fe4642fb928e97","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","checks":"69ad3ba43d5cfd8bed529d25ce051f55d13e27475a87edae3ec5ffbd5be037ee","tells":"c6f7158ea822738f651e9873d90b55db6625acf298b458c7d9baf089b1a1578f","prompts":"f1d914aecdc56ea365960569f2587c9563e9f9a055deb88f13ba995eb473a219"},"model":"default","tally":{"visible":3,"faint":2,"invisible":0},"problems":{"blocker":1,"should":3,"nit":1}} -->
## tells: fixable
Recorded 2026-11-15 at commit fca016b, by claude -p (model: default). Inputs 974c24fa92cb: the card, route-checks.js, the before and after pictures, the pass's prompts.
Items: 3 visible, 2 faint, 0 invisible.
Problems: 1 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 32 s | $0.13 |
| 2-judge | report.md | 45 s | $0.16 |
| all | | 78 s (the steps add up to 78 s) | $0.29 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 05, the copier jam's real effect is that every head turns toward it, and that is the cause of the mirror fail. It reads as something else. The red line and the "!" on one worker look like blame aimed at Kev. The boss's line is faint, the teal worker gets nothing, and nobody's body or face actually turns. A player won't learn that the copier draws every eye, which is why writing on the board during the beep gets you caught. — Turn every head and body toward the copier. Give everyone in range the same 👀 or ❗ bubble pointing at it, and draw every sightline in one colour and weight. Then the board, lying inside those turned gazes, reads as "watched".
- E2 [should] The board change itself in 02 and 04 is a swap of a roughly 20 px face, with no motion or sound shown. Both routes depend on it, and the reader said they'd miss it during play. — Animate the write: marker strokes, a wipe puff and a scribble burst, with the board briefly highlighted. Draw the new portrait larger, or blow it up as a short-lived callout above the board.
- E3 [should] In 02, the coworkers' 😮🍜 bubbles clear on the same frame as the write. The player can't tell whether writing broke the microwave cover or the smell simply ended, and the cover is what this route depends on. — Let the bubbles linger on after the write. Better, show the heads still turned toward the microwave while the player writes, then fade them on their own schedule a beat later.
- E4 [should] In 04, the teal worker's walk and the boss's "?" disappearing happen in the same window as the write, so they look like reactions to the boss's face. — Don't let unrelated idle moves start in the same second as a player action. If the boss's "?" ends because the line is dead, show it as the boss hanging up (receiver down, 😤), not as a silent pop.

### 1-read: reading.md

# Reading: what changed

In all five images, the box in the top bar shows the same empty dashed hand before and after. The player never visibly picks anything up or carries anything away.

**01:** The microwave on the right wall had the highlight and E prompt in BEFORE. In AFTER it glows, something orange (food?) shows in its window, and the highlight is gone. Nobody reacts: no bubbles, and the coworkers and boss haven't moved. My guess is the player switched the microwave on, maybe after putting food in it. Nothing in the hand box says what went in.

**02:** At the whiteboard, the portrait changes from the red-haired woman to a darker-haired face, the same one that's still up in 03. In BEFORE, the boss and both desk workers have 😮🍜 thought bubbles, and the microwave is smoking with a target ripple on it. In AFTER, all three bubbles are gone and the microwave is still smoking. The player swapped whose face is on the board. I can't tell whether the swap cleared the bubbles or the smell just faded. The 😮🍜 bubbles look like a reaction to the microwave from 01, not to the board.

**03:** The player is in the small top-left room, at a black object (a phone?) that had the E prompt. In AFTER, a dotted trail of ring arcs runs from it to the phone on the boss office's top-right wall, which is shaking with a starburst. A red "!" burst sits above the boss. A small clock bubble appears over the player, and the bearded worker at the bottom desk turns slightly. The player rang the boss's phone from the far room.

**04:** The player is back at the whiteboard. In BEFORE, the boss has left the desk and is at that phone with a "📞 ?" bubble (nobody on the line). The board shows the bearded worker's face, and the teal worker is walking right. In AFTER, the board shows the boss's own bald face. The boss's "?" bubble is gone, but the boss is still at the phone. The teal worker is now standing next to the bearded worker's desk. The player swapped the portrait again, this time to the boss, while the phone call kept the boss away. Whether the teal worker moved because of the new face or was already heading there, I can't tell.

**05:** The player is at the copier, which had the E prompt in BEFORE. In AFTER, it's spewing paper with a red/orange flash. An orange dashed line runs from it to the boss, and a red dashed line runs to the bearded worker, who now has a "!" bubble. The boss's and teal worker's view cones also shift. The player jammed or overloaded the copier, and it pulls attention: the red line seems to mark the bearded worker as the one blamed or alerted. The orange line to the boss is fainter, maybe meaning heard but not reacting yet.

**Overall:** each use shows a clear effect at the object: a glow, smoke, ringing or paper. The board swaps are the subtlest change, just a different small face, with no reaction pinned to them. Without the side-by-side, I'd have missed 02 and 04.

### 2-judge: report.md

Verdict: fixable

- 01.png: visible. The player started the microwave. The reader saw it glow with food in the window and guessed it had been switched on. Correct.
- 02.png: faint. The player wrote Kev's name on the roster board, and the small portrait changed from the red-haired face to Kev's. The reader caught the swap only in the side-by-side and said they'd have missed it in play. In the same moment all three 😮🍜 bubbles cleared, so the reader couldn't tell whether the write or the fading smell cleared them.
- 03.png: visible. The player rang the boss's desk phone from the far room. The reader read the ring trail, the shaking phone and the boss's "!" correctly.
- 04.png: faint. The player wrote the boss's own face on the board while the boss was on the dead call. The reader saw the portrait become the bald face, but again only side by side. The teal worker walked off at the same time and the boss's "?" disappeared, which added noise. The reader couldn't tell whether those were caused by the write.
- 05.png: visible, but the reaction was misread. The player jammed the copier and, per the engine, every head turned toward it. The reader saw the paper spray but read the red dashed line to the bearded worker, and his "!", as him being blamed or alerted. They read the fainter orange line to the boss as "heard, not reacting yet". Nobody visibly turns their head. Only the view cones shift.

## Problems
- blocker: In 05, the copier jam's real effect is that every head turns toward it, and that is the cause of the mirror fail. It reads as something else. The red line and the "!" on one worker look like blame aimed at Kev. The boss's line is faint, the teal worker gets nothing, and nobody's body or face actually turns. A player won't learn that the copier draws every eye, which is why writing on the board during the beep gets you caught. — Turn every head and body toward the copier. Give everyone in range the same 👀 or ❗ bubble pointing at it, and draw every sightline in one colour and weight. Then the board, lying inside those turned gazes, reads as "watched".
- should: The board change itself in 02 and 04 is a swap of a roughly 20 px face, with no motion or sound shown. Both routes depend on it, and the reader said they'd miss it during play. — Animate the write: marker strokes, a wipe puff and a scribble burst, with the board briefly highlighted. Draw the new portrait larger, or blow it up as a short-lived callout above the board.
- should: In 02, the coworkers' 😮🍜 bubbles clear on the same frame as the write. The player can't tell whether writing broke the microwave cover or the smell simply ended, and the cover is what this route depends on. — Let the bubbles linger on after the write. Better, show the heads still turned toward the microwave while the player writes, then fade them on their own schedule a beat later.
- should: In 04, the teal worker's walk and the boss's "?" disappearing happen in the same window as the write, so they look like reactions to the boss's face. — Don't let unrelated idle moves start in the same second as a player action. If the boss's "?" ends because the line is dead, show it as the boss hanging up (receiver down, 😤), not as a silent pop.
- nit: In 01 the microwave's glow and the food in its window are small next to the dimmed counter. — Add a light hum or ripple and a bit of light spilling onto the floor while it runs. That also sets up the later ding.

<!-- /cold-read:tells -->

<!-- cold-read:outcomes {"verdict":"fixable","date":"2026-11-15","commit":"fca016b","hash":"df95742211cd3278db88981d371d8966d78eef044c712a21ec998bd7b2525e65","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","checks":"69ad3ba43d5cfd8bed529d25ce051f55d13e27475a87edae3ec5ffbd5be037ee","ways":"af1a3c923726e64f9b0a6f882f4c18f24be9ba168da5e661de35f968653006aa","ends":"18f656123f0f035060d65450523a82ed0a228c81682ad283c447044a7e550650","prompts":"2c4a72c45c8e3d7e595f0928af4c2741d3a3e144356d832e05fe3e1263e3a558"},"model":"default","tally":{"clear":8,"unclear":1,"wrong":3},"problems":{"blocker":2,"should":1,"nit":1}} -->
## outcomes: fixable
Recorded 2026-11-15 at commit fca016b, by claude -p (model: default). Inputs df95742211cd: the card, route-checks.js, premise.md's ways to win and lose, the runs' last frames, the pass's prompts.
Items: 8 clear, 1 unclear, 3 wrong.
Problems: 2 blocker, 1 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 138 s | $0.58 |
| 2-judge | report.md | 79 s | $0.32 |
| all | | 217 s (the steps add up to 217 s) | $0.90 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Getting told on (runs 8 and 10) leads the end card with "Lin 👉 you", but nothing on the map near 5:00 ties Lin to the loss. She is just walking around when the boss reads the board. The player decides the card is wrong, never learns that ringing the phone while Lin was at her desk was the mistake, and in run 10 doesn't learn that Kev's face was wiped. — Fix: put a small picture of the moment she told at the front of the card's row: Lin at her desk with 👀, the board with the marker at it, and the boss's phone shaking. In run 10, add a close-up of Kev's face crossed out by the eraser.
- E2 [blocker] The copier trap's end card (run 6) is the same as a plain catch, so the reader blames timing instead of where the copier stands. They will try the copier earlier and fail again. — Fix: on the copier-trap card, draw the boss's orange dashed line through the board to the copier behind it, and add a copier icon to the row before 😠.
- E3 [should] In run 4, the boss never discovers his own face where the player can see it. The last map pictures go straight to the redrawn face and the glare, and Lin and Kev never point. The only evidence is a tiny icon on the card. — Fix: keep the board close-up with the boss's face and his 😳 on the map at 5:00 before he wipes it. Also show Lin's "👀👉 you" and Kev's "👉 you" bubbles there, and lead the card's row with the boss's face on the board.

### 1-read: reading.md

I read all 12 runs. Two wins, ten losses. The losses split into three kinds: caught changing the board early (4), plain loss at 5:00 (5), and assigned while out of the room (1).

Two things showed up more than once:
- **The end picture doesn't always match.** In runs 8 and 10 it shows the teal coworker blaming the player, but she never does anything like that in the pictures before it.
- **Captions and the on-screen clock disagree in runs 2, 6 and 12.** The captions say 4:02, 4:03 and 5:01–5:02; the clock still shows 4:01, 4:02 and 5:00.

# Reading: how each loop ended

**Run 1: Loss, assigned the shift (not caught).** At 5:00 the bald boss points at the whiteboard, which shows the player's face (red top, hair bun). The player is moved from the bottom-left desk to the board, looking miserable (😩). End picture: the player alone at a desk under a sunny Saturday window, with the board showing their face. Icons: calendar, player, 😩. **Matches.** Which step broke: the pictures don't show one. Nothing was changed on the board, so it still named the player.

**Run 2: Loss, caught.** At 4:01 the player is at the board, and a red cone from the boss's office reaches them. A spiky "! 👉 player" burst appears, and a teal coworker has a "calendar ?" thought. End picture: the board now shows the spiky-haired coworker in the green jacket, with a marker on it. The boss is angry and points at the player, who is at their desk. **Matches.** Which step broke: changing the board to the green coworker's face while the boss could see it.

**Run 3: Win.** At 4:59 the board shows the green-jacket coworker. At 5:00 the boss points at that face. The player shows 🎉 and the green coworker shows 😩. End picture: the green coworker at the Saturday desk, crying. The card has a teal border instead of red. Icons: pencil, green coworker, 😢. An item that looks like a buzzing ticket or pass fills the first slot. **Matches.**

**Run 4: Loss, caught at 5:00 (no red cone).** The boss's bubble is "✏️ player", then "😠 👉 player". The player is at the board looking miserable. End picture: the board shows the player's face again, and the angry boss points at them. Icons: a small board with the bald boss's face and a marker, 😳, 👉, player. **Mostly matches.** The field pictures never clearly show the boss's face on the board. Which step broke: the board change itself. The icon suggests the player put the boss's own face up and he noticed. I can't fully confirm that.

**Run 5: Loss, caught.** This is the same as run 2, at 4:16. The player is at the board inside the boss's red cone. The board changes to the green coworker's face, and the "! 👉 player" burst appears. The end picture is the same as run 2: angry boss, swapped board. **Matches.** Which step broke: changing the board in the boss's view.

**Run 6: Loss, caught.** Caption: "You hear a sound." A red ringing object bursts near the copier, and the green coworker shows "!". But at 4:02 the boss is already looking at the player at the board with "! 👉 player". The end picture is the same as run 2. **Matches.** Which step broke: the noise distraction. It didn't pull the boss's gaze away, or it came too late. The captions say 4:03 but the clock says 4:02.

**Run 7: Win.** This is the same as run 3. The board shows the green coworker and the player shows 🎉. End picture: the green coworker crying at the Saturday desk, with a teal border. A black desk phone fills the second slot. **Matches.**

**Run 8: Loss, assigned the shift.** The field pictures look the same as run 1. End picture: the player at the Saturday desk, but the icons are teal coworker (glasses, bun), 👉, player, 😩. That reads as "she blamed the player." **Doesn't match.** In the last moments the teal coworker is just walking toward the glass wall and never points at the player. Which step broke: I can't tell.

**Run 9: Loss, assigned while away.** At 5:00 the player is far off by the kitchen microwave, with a worried thought. The board shows the player's face. The boss and both coworkers have "👉 player" bubbles, and a dashed red empty-chair outline is near them. End picture: a different scene, with a city window and a wall clock near 5. The boss points at the dashed empty chair while the two coworkers sit and watch. Icons: dashed chair, 👉, player. **Matches.** Which step broke: staying away from the meeting. Being absent didn't help, and the board still had the player's face.

**Run 10: Loss, assigned the shift.** The field pictures and end picture are the same as run 8, including the "teal coworker 👉 player" icons. **Doesn't match**, for the same reason as run 8. Which step broke: I can't tell.

**Run 11: Loss, assigned the shift.** At 5:00 the player is next to the teal coworker in the middle of the room (😬). Then they are moved to the board (😩), still with their own face on it. End picture: same as run 1 (calendar, player, 😩). **Matches.** Which step broke: none shown. The board was never changed.

**Run 12: Loss, assigned the shift.** At 5:00 the player is at the green coworker's desk (bottom right, 😬). Then they are moved to the board, still with their own face on it. The end picture is the same as run 1. **Matches.** Which step broke: maybe something at the green coworker's desk didn't happen in time. The pictures don't show what it was. The captions say 5:01 and 5:02, but the clock reads 5:00 in all three pictures.

### 2-judge: report.md

Verdict: fixable

- Run 1: clear. Did nothing, so the player's face stayed on the board. The reader saw a plain fail with the board unchanged.
- Run 2: clear. Wrote on the board in the boss's sight and got caught. The reader saw the red cone, "! 👉 player" and the angry boss on the end card.
- Run 3: clear. Won with the noodle ding. The reader saw the boss read out Kev's face, 🎉, and Kev crying at the Saturday desk.
- Run 4: unclear. Wrote twice and put the boss's own face up, so he redrew the player and glared. The reader guessed this right from the end card's icon row. But the last map pictures show only "✏️ player" and "😠 👉 player". Neither the boss's face on the board nor his 😳 is ever on the map.
- Run 5: clear. Wrote after the ding had passed and got caught. The reader read it as caught.
- Run 6: wrong. The copier trap: the boss's line to the beeping copier runs straight through the board. The reader saw the right outcome (caught) but the wrong cause: "the noise didn't pull his gaze away, or came too late." The end card looks exactly like a plain catch, with no copier in it.
- Run 7: clear. Won with the phone. The reader read it like run 3.
- Run 8: wrong. Rang the boss's phone while Lin was at her desk; she told on the player and the write never happened. The reader saw "Lin 👉 player" on the end card but nothing like it on the map before it, so they called it a mismatch and couldn't tell which step broke.
- Run 9: clear. Changed the board, then was away at 5:00 and got blamed. The reader saw the dashed empty chair, the board showing the player again, and the right cause.
- Run 10: wrong. Kev's face went up at the ding, then a second write while Lin watched; she told, and the boss put the player's face back. The reader saw the same end card as run 8 and the same mismatch. Nothing shows that Kev's write was undone.
- Run 11: clear. Stood at the empty chair at 4:55 without ever writing, and failed. The reader saw the board unchanged.
- Run 12: clear. Busy all day but never wrote on the board, and failed. The reader saw the plain-fail end card. They wondered whether something at Kev's desk mattered, but the card itself is right.

## Problems
- blocker: Getting told on (runs 8 and 10) leads the end card with "Lin 👉 you", but nothing on the map near 5:00 ties Lin to the loss. She is just walking around when the boss reads the board. The player decides the card is wrong, never learns that ringing the phone while Lin was at her desk was the mistake, and in run 10 doesn't learn that Kev's face was wiped. — Fix: put a small picture of the moment she told at the front of the card's row: Lin at her desk with 👀, the board with the marker at it, and the boss's phone shaking. In run 10, add a close-up of Kev's face crossed out by the eraser.
- blocker: The copier trap's end card (run 6) is the same as a plain catch, so the reader blames timing instead of where the copier stands. They will try the copier earlier and fail again. — Fix: on the copier-trap card, draw the boss's orange dashed line through the board to the copier behind it, and add a copier icon to the row before 😠.
- should: In run 4, the boss never discovers his own face where the player can see it. The last map pictures go straight to the redrawn face and the glare, and Lin and Kev never point. The only evidence is a tiny icon on the card. — Fix: keep the board close-up with the boss's face and his 😳 on the map at 5:00 before he wipes it. Also show Lin's "👀👉 you" and Kev's "👉 you" bubbles there, and lead the card's row with the boss's face on the board.
- nit: In runs 2, 5 and 6 the end card's board shows a whole, finished face with the marker at it. The design says the face should be half-drawn, which would show "caught mid-write" rather than "swap done". — Fix: draw only the top half of the face, with the bottom of the box still wiped clean.

<!-- /cold-read:outcomes -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"fca016b","hash":"b1427edb0af0237b148b78a3332e1b811da2cd53eb6e55329af49aa305558212","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","shots":"c7474a18a8698e5f34e22aa9e1310e9bcd8285c903c62bb992040e4784b0da8a","pictures":"a4e474355bc094a886840825e887467ff93a0fcac4f95513e0e869e685ea79e4","prompts":"373358f2a720c528dbf043178a7e12d5e465c477911cb7d1ae56f78e1d3c10a4"},"model":"default","problems":{"blocker":3,"should":8,"nit":4}} -->
## pictures: fixable
Recorded 2026-11-15 at commit fca016b, by claude -p (model: default). Inputs b1427edb0af0: the card, shots.js, the rendered shots, the pass's prompts.
Problems: 3 blocker, 8 should, 4 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 117 s | $0.58 |
| 2-compare | report.md | 160 s | $0.57 |
| all | | 277 s (the steps add up to 277 s) | $1.15 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Shot 12. Lin's cone covers the player at the board, but nothing changes. The player concludes the prank call alone is "a clean method", which is the opposite of what the shot is for. Fix: any cone touching the player at the board turns orange and starts that person's "?" bar, exactly like the boss's in 02.
- E2 [blocker] Shot 20. The copier jam is supposed to fail because the boss looks *through* the board. The player instead reads "attention split", so they would keep trying a route that can't work. Fix: flash the player red where the boss's sight line crosses them, and point a 👀 bubble at the player.
- E3 [blocker] Shot 06. The boss's suspicion bar fills while I just walk across the open floor. No boss gets suspicious of someone walking to the kitchen, and it teaches the player that being seen anywhere is dangerous, when only the board is. Fix: the bar fills only when the player is at the board (or holding the marker), and the folder from the intent should be in my hand.
- E4 [should] The noodle cup reads as coffee in 01, 03 and 08, and as fish in 06 and in the 27 slot card. The player never learns that *their* lunch is the microwave tool, and mixes it up with Lin's fish routine. Fix: draw one clear noodle bowl (paper bowl, lid flap, chopsticks) and use it on the counter, in the window, in the 07 bubble and on the slot card.
- E5 [should] In 07 the level's idea, "noises turn heads", reads as "smell turns heads": the big steam, the food bubble, and rings that look like a smell spreading. Fix: put 🔔 first in the bubble, make the rings crisp sound arcs, and cut the steam down.
- E6 [should] Lin's chair lies on its side whenever she's up (10, 13, 17, 21). It reads as "knocked over", not pushed out, and it stays on the floor through the meeting. Fix: draw the chair upright, rolled back and turned 45° from the desk.
- E7 [should] Shot 21 was taken at the wrong moment: people are still walking in, not seated with the boss holding the marker. Shots 22–26 and 31 carry the meeting, so it misleads nobody. Fix: retake the shot at about 4:58, once everyone is seated.
- E8 [should] Shot 17. The half-drawn face is a black blot and the progress ring under the player isn't explained, so "half-done swap" doesn't read. Fix: finished lines on the top half, blank bottom, marker at the edge of the drawing, and a ring that fills like a pie.
- E9 [should] Shot 28. The icon row has no pencil and no anger, and the picture shows my face on the board, so the "you wrote the boss in" joke is gone. Fix: ✏️, boss face, 😠, me in the row, and the boss's face crossed out on the board in the picture.
- E10 [should] Shot 30. The board shows Kev's finished face while I'm the one working Saturday, which contradicts both the intent (the boss's face, half drawn) and the outcome. Fix: show a half-drawn face over a smeared one, with a real marker in my hand instead of the cursor-like arrow.
- E11 [should] Shot 04 doesn't show the copier can be jammed, and nobody notices the boss's cone covering both the copier and the board, which is the setup shot 20 needs. Fix: a crumpled-paper icon in the E bubble, and a bright cone edge where it crosses the board and the copier.

### 1-read: reading.md

# Reading: "Saturday"

**Card:** it's Friday at 4:00. At 5:00 the boss announces who works Saturday, and the board already has my face on it. Icons: 🗓️ and me.

**01** (4:00) A bald boss in a suit sits behind a desk on a gold rug in a glass office. A whiteboard on an easel in the open office shows my face (red shirt, hair bun) in a red frame. I'm at the far-left desk, under a red triangle. A teal coworker and a green spiky-haired coworker type, and everyone has a view cone. There's a kitchen top right, a microwave and coffee cup on the right wall, and phones in the top-left room and the boss's corner. *I can't read the HUD: clock + calendar + my face, an empty hand slot, "⟳1" and two empty slots.*

**02** (4:01) I'm at the easel with an E prompt. The boss shows "?" and a vertical bar starts filling, and his cone turns orange. *He can see the board from his desk. Is the bar suspicion?*

**03** (4:06) I'm at the microwave with an E prompt. It's usable.

**04** (4:00) I'm at the copier with an E prompt, and the copier now has the red triangle. *The triangle seems to mark the nearest usable thing, not me.*

**05** (4:03) I'm at the black phone in the empty top-left room with an E prompt.

**06** (4:09) The microwave glows with a fish inside. The boss shows "?" with the bar, and I'm walking across the open floor. *I started the fish.*

**07** (4:10) The microwave gives off rings and steam. The boss and both coworkers think 😮 plus a bowl, and arrows show them turning toward it. I'm near the easel. *Smell turns heads. That's the distraction.*

**08** (4:16) A steaming coffee cup sits by the microwave and I'm next to it. The teal coworker's head turns. *Did I make coffee? Why? It isn't clear.*

**09** (4:13) The microwave is smoking and every cone points away. A portrait pop-up of the green coworker sits over the easel: I'm putting his face on the board. *So that's the scheme: swap the name.*

**10** (4:39) The pop-up shows the boss's own face as the board option. The boss stands by his phone looking 😳/😒. The teal coworker walks off with a cup, and her chair is knocked over. *Putting the boss's face up is a choice. Is it a joke or a trap?*

**11** (4:04) I'm on the top-left phone. The boss's phone gives off a huge ☎️! burst, and a dotted wave line runs between the two phones. *A prank call pulls him out of his chair.*

**12** (4:06) The boss holds the receiver with "📞?" while I swap the board, unseen. *A clean method.*

**13** (4:30) The teal coworker leaves her desk carrying a fish and thinking 🐟, and her chair is tipped over. *A daily routine: she brings fish lunch at 4:30.*

**14** (4:35) She's at the microwave with the fish. I'm at my desk raising a cup. A fast-forward button appears. *I'm waiting for her routine to make the noise for me.*

**15** (4:34) I call again. The boss is on the phone while the teal coworker heats her fish. Two distractions overlap.

**16** (4:37) I swap the board to the green coworker while the boss is on the phone and she walks back with her plate.

**17** (4:39) The board shows a black scribble or splat over the face. I stand on a gold ring, and a red cone from the teal coworker covers me. She thinks "📄?" and the boss shows "📞??". *The red cone means I'm caught. I can't tell what the scribble is: a defaced photo or a half-done swap?*

**18** (4:02) The copier jams with red rings. The boss and the teal coworker think of a copier icon, and the green coworker gets up with "!". *I jammed it, and he's the one who fixes it.*

**19** (4:07) The green coworker fixes the copier. I'm down at his desk. *What am I doing there?*

**20** (4:02) The copier jams while I swap the board. The boss's bar rises, but his attention is split.

**21** (4:57) The clock turns red. The boss walks out of his office, the coworkers move toward chairs and show "?", and one chair has a dashed red outline. *The 5:00 meeting is forming.*

**22–23** (4:58–4:59) The meeting happens at the easel. The boss points 👈 at my face in a bubble while the coworkers and I sit.

**24** (4:59) Same scene, but the board shows the green coworker and the boss points at him. *The swap worked.*

**25** (4:59) The board shows the boss himself. He goes 👴😳, and both coworkers point at me: "👀👉 her." *They tell on me. Funny.*

**26** (4:59) The green coworker is on the board, but I'm away at the microwave and my seat has a dashed outline. *Skipping the meeting is a risk.*

**27 – WIN (teal border).** The green coworker sits crying 😢 at a desk stacked with paper on a sunny day. Icons: ✏️ green coworker 😢. A glowing fish-microwave card fills one of the two slots. *The slots seem to collect methods. Two slots suggests there are two ways to win.*

**28 – LOSS (red border).** I'm on the board, the boss is furious 💢 and pointing, and I'm 😳. Icons: the board with the boss's photo, 😳, 👉, me. *Putting his face up gets me punished. Good gag, but the icons only make sense if you already know what happened.*

**29 – LOSS.** I'm working Saturday, 😩. Icons: calendar, me, 😩. *The default ending, and it reads clearly.*

**30 – LOSS (4:01).** The board shows the green coworker with a hand cursor stuck mid-swap, the boss angry, and me 😳. *Caught in the act. The icon (a hand on the photo) works.*

**31 – LOSS.** The meeting goes on without me. Dashed empty chair 👉 me, with a 5:00 clock and a city view. *You can't skip the meeting. Nice "absent = volunteered" joke.*

**Things I couldn't read:** the calendar+face glyph in the HUD, the "?" bar, the gold ring under me in 17, the steaming coffee in 08, the bowl in the 07 bubbles (fish or soup?), the red triangle, the dashed chair, the scribble in 17, and what I was doing at the green coworker's desk in 19.

## Story

The boss's board says I'm working Saturday. To get out of it I have to put someone else's face up without being seen.
The office gives me ways to pull eyes off the board: a prank call to the boss's phone, a jammed copier, fish in the microwave. My coworker heats her fish at 4:30 anyway, so I can just wait for it.
Getting caught at the board, putting up the boss's own face, or skipping the 5:00 meeting all end with the boss pointing at me.
The win is the green coworker crying over a pile of paperwork on a sunny Saturday. It's funny and mean.
Lesson: smells and rings turn heads, and turned heads leave the board unwatched.

### 2-compare: report.md

Verdict: fixable

## Shots

- **01 — partly.** Reading: "a microwave and coffee cup on the right wall… I'm at the far-left desk, under a red triangle." Intent: nothing is lit yet; a cup of noodles sits on the counter and Lin has a lunch box on her desk. Cause: **a glyph used as a prop**. The red-and-white noodle cup is drawn like a coffee cup. Also a **missing cue**: the red triangle over my keyboard looks like a highlight in a shot that should have nothing lit. Fix: draw the noodles as a wide paper bowl with a fold-back lid and a fork in it, and don't draw the interact triangle until something is actually in reach.
- **02 — partly.** Reading: "I'm at the easel with an E prompt… Is the bar suspicion?" Intent: you could *write* on it, with seven day boxes, Saturday in red and two markers in the tray. Cause: **missing cue**. At this size the markers and day boxes don't show, so the player sees "usable" but not "writable". Fix: draw the tray markers bigger in black and red, and have the black one lift slightly while the prompt is up.
- **03 — partly.** Reading: "I'm at the microwave with an E prompt. It's usable." Intent: you could heat your noodles, with the cup right next to it. Cause: **a glyph used as a prop**, the same coffee-cup problem as 01, so nothing links the cup to the microwave. Fix: when the prompt is up, show a small noodle-bowl icon going into the microwave inside the E bubble.
- **04 — partly.** Reading: "the copier now has the red triangle… seems to mark the nearest usable thing." Intent: you could *jam* it, and the boss's cone reaches toward it across the board. Cause: **missing cue**. Nothing says "jam", and the player doesn't notice the boss's cone running over the board to the copier, even though shot 20 depends on it. Fix: show a crumpled-paper icon in the E bubble, and draw the boss's cone edge brighter where it crosses both the board and the copier.
- **05 — reads.**
- **06 — misread.** Reading: "The microwave glows with a fish inside. The boss shows '?' with the bar… *I started the fish.*" Intent: your noodles are cooking, and you're walking back with a folder while every cone still covers the board. Causes: **a glyph used as a prop**, because the tiny lit window plus Lin's fish lunch box sitting in view adds up to "fish". And a **missing cue**: there is no folder in hand. The boss's suspicion bar is also filling just because I'm walking across the floor. Fix: show a noodle bowl turning in the window with steam curling up, draw the folder in my hand, and keep the boss's bar empty when I'm not at the board.
- **07 — partly.** Reading: "😮 plus a bowl… *Smell turns heads.*" Intent: the DING, a sound, turns every head. Causes: **a glyph used as a prop** and a **missing cue**. The big steam cloud and the food-bowl bubble say smell, and the rings read as a smell spreading. Nothing in the picture says "sound". Fix: put a bell (🔔) in the bubble before the bowl, make the rings sharp sound arcs, and shrink the steam.
- **08 — misread.** Reading: "A steaming coffee cup… *Did I make coffee? Why?*" Intent: the noodles are done and back on the counter, and the microwave is empty. Cause: **a glyph used as a prop**, the coffee-cup look again. Fix: use the same noodle-bowl drawing as 01 and 06, with the lid open and chopsticks sticking out.
- **09 — reads.**
- **10 — partly.** Reading: "The pop-up shows the boss's own face as the board option… a choice." Intent: it's already written over. Cause: **missing cue**. The big portrait reads as a menu choice, not as something that just happened. Fix: animate the portrait sliding down into the Saturday box and stamping there, with a marker squiggle.
- **11 — reads.**
- **12 — misread.** Reading: "The boss holds the receiver… while I swap the board, unseen. *A clean method.*" Intent: Lin is facing the board and her cone covers you, so the phone alone isn't enough. Cause: **missing cue**. Lin's cone is a faint teal over a beige floor, it doesn't change colour, and she shows no "?" or bar. The player decides they're safe. Fix: turn Lin's cone orange and start her "?" bar as soon as it touches the player at the board, the same way the boss's does in 02.
- **13 — reads.** Her chair falls over; see Problems.
- **14 — reads.**
- **15 — reads.**
- **16 — reads.**
- **17 — partly.** Reading: "a black scribble or splat over the face… a defaced photo or a half-done swap?" and "I can't read the gold ring." Intent: my face wiped off and Kev's half drawn from the top down, with the marker at it. Cause: **missing cue**. The half-drawn face is a black blot, and the progress ring under me isn't explained. Fix: draw Kev's spiky hair and eyes in finished lines on the top half, leave the bottom blank, put the black marker at the edge of the drawing, and make the ring a pie that fills.
- **18 — reads.**
- **19 — reads.** I'm parked at Kev's desk for no reason; see Problems.
- **20 — misread.** Reading: "The boss's bar rises, but his attention is split." Intent: looking at the copier means looking straight through the board, so you're in plain view and this method fails. Cause: **cause and effect too far apart**. The dashed line passes by the player, but nothing marks the player as seen, so "rising bar" reads as half a success. Fix: where the boss's sight line crosses the player, flash the player red and pop a 👀 over the boss aimed at the player, not at the copier.
- **21 — wrong moment.** The intent describes everyone already seated at 4:57: the boss beside the board with the marker, Lin and Kev in their chairs. The picture at 4:57 shows the boss and Kev still walking in and Lin standing. Change the shot's commands so it's taken once everyone is seated (around 4:58).
- **22 — reads.**
- **23 — reads.**
- **24 — reads.**
- **25 — reads.**
- **26 — reads.**
- **27 — reads.**
- **28 — partly.** Reading: "Icons: the board with the boss's photo, 😳, 👉, me… only make sense if you already know." Intent: a row of pencil, the boss's face, an angry face, your face, meaning "you wrote him in, and he knew." Cause: **missing cue**. The row has no pencil and no angry face, and the 😳 reads as my embarrassment. The picture itself is just the plain Saturday loss with the boss added. Fix: start the row with ✏️, swap 😳 for 😠, and in the picture show the boss's face on the board crossed out with an X and my face written back in a hurry.
- **29 — reads.**
- **30 — partly.** Reading: "The board shows the green coworker with a hand cursor stuck mid-swap." Intent: your face wiped off and the *boss's* face half drawn. Cause: **missing cue**. The picture shows a finished Kev face, and a marker that looks like a mouse cursor. It also contradicts itself: I'm the one working Saturday, but Kev's face stays on the board. Fix: draw a half-finished face with the old face smeared under it, and draw a real marker held in my hand.
- **31 — reads.**

## Problems

- blocker: Shot 12. Lin's cone covers the player at the board, but nothing changes. The player concludes the prank call alone is "a clean method", which is the opposite of what the shot is for. Fix: any cone touching the player at the board turns orange and starts that person's "?" bar, exactly like the boss's in 02.
- blocker: Shot 20. The copier jam is supposed to fail because the boss looks *through* the board. The player instead reads "attention split", so they would keep trying a route that can't work. Fix: flash the player red where the boss's sight line crosses them, and point a 👀 bubble at the player.
- blocker: Shot 06. The boss's suspicion bar fills while I just walk across the open floor. No boss gets suspicious of someone walking to the kitchen, and it teaches the player that being seen anywhere is dangerous, when only the board is. Fix: the bar fills only when the player is at the board (or holding the marker), and the folder from the intent should be in my hand.
- should: The noodle cup reads as coffee in 01, 03 and 08, and as fish in 06 and in the 27 slot card. The player never learns that *their* lunch is the microwave tool, and mixes it up with Lin's fish routine. Fix: draw one clear noodle bowl (paper bowl, lid flap, chopsticks) and use it on the counter, in the window, in the 07 bubble and on the slot card.
- should: In 07 the level's idea, "noises turn heads", reads as "smell turns heads": the big steam, the food bubble, and rings that look like a smell spreading. Fix: put 🔔 first in the bubble, make the rings crisp sound arcs, and cut the steam down.
- should: Lin's chair lies on its side whenever she's up (10, 13, 17, 21). It reads as "knocked over", not pushed out, and it stays on the floor through the meeting. Fix: draw the chair upright, rolled back and turned 45° from the desk.
- should: Shot 21 was taken at the wrong moment: people are still walking in, not seated with the boss holding the marker. Shots 22–26 and 31 carry the meeting, so it misleads nobody. Fix: retake the shot at about 4:58, once everyone is seated.
- should: Shot 17. The half-drawn face is a black blot and the progress ring under the player isn't explained, so "half-done swap" doesn't read. Fix: finished lines on the top half, blank bottom, marker at the edge of the drawing, and a ring that fills like a pie.
- should: Shot 28. The icon row has no pencil and no anger, and the picture shows my face on the board, so the "you wrote the boss in" joke is gone. Fix: ✏️, boss face, 😠, me in the row, and the boss's face crossed out on the board in the picture.
- should: Shot 30. The board shows Kev's finished face while I'm the one working Saturday, which contradicts both the intent (the boss's face, half drawn) and the outcome. Fix: show a half-drawn face over a smeared one, with a real marker in my hand instead of the cursor-like arrow.
- should: Shot 04 doesn't show the copier can be jammed, and nobody notices the boss's cone covering both the copier and the board, which is the setup shot 20 needs. Fix: a crumpled-paper icon in the E bubble, and a bright cone edge where it crosses the board and the copier.
- nit: The HUD's calendar+face glyph, the "⟳1" and the red interact triangle went unread, and the triangle showing over my desk at the start looks like a highlight. Fix: show the triangle only over something in reach, and pulse the calendar+face glyph when the board changes.
- nit: Shots 09 and 10. The big portrait pop-up reads as a menu of choices, not as something just written. Fix: animate it sliding into the Saturday box with a marker squiggle.
- nit: Shot 19. I'm standing at Kev's desk for no reason, and the player wonders whether it's part of the route. Fix: leave the player at the board, or somewhere off to the side, for this shot.
- nit: Shot 02. The markers and day boxes are too small to say "you can write here". Fix: draw bigger black and red markers, and lift the black one while the prompt is up.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"d22f387","hash":"0e86abeeb872268a6dbfc2f183b8e94cf13dad5dc28bd8a233435c2399cfce1d","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","checks":"69ad3ba43d5cfd8bed529d25ce051f55d13e27475a87edae3ec5ffbd5be037ee","ways":"f3020a30329cbc3c48e43c84d4ce54912272129e4f4c5a994c816893f772a60f","frames":"70aa30cf7159cb3eed5e25404d140daa4cf3a9596d64b10cb1465044d3327cb3","prompts":"9e3c9df1ce09f69e814a3665f47fd26f19cf1da4d95956302759c3b798c0d63d"},"model":"default","problems":{"blocker":5,"should":10,"nit":4}} -->
## replay: fixable
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs 0e86abeeb872: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the pass's prompts.
Problems: 5 blocker, 10 should, 4 nit.
Earlier problems: 0 fixed, 7 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 154 s | $0.73 |
| 1-read-2 | reading.md | 154 s | $0.65 |
| 1-read-3 | reading.md | 137 s | $0.64 |
| 2-compare | report.md | 134 s | $0.53 |
| all | | 288 s (the steps add up to 578 s) | $2.55 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: Run 3 win is only partly explained. The 🍜❓ bubble clears before the heads turn back, so the reader can't tell the ding made the write possible. — Keep 🍜❓ up exactly as long as each cone stays turned, and fade it out as the cone swings back. (not marked by the reader)
- E2 still there: The "👢 👉 you" order is given mid-call with the handset at the boss's ear, and 👢 is also his routine "getting up" thought. The reader reads it as phone talk and thinks the forced trip to the desk was their own choice (runs 8, 10). — Boss hangs up first, then gives a 👉 you → 🖥️ order, and the player's walk follows a dotted path from it. (not marked by the reader)
- E3 still there: The boss's check of the board after Lin's report is drawn with a contented 😊 and no 🧐/😠, so it reads as routine. A real manager told about rota tampering wouldn't stroll over smiling (runs 8, 10). — Draw a dashed line from Lin's report to the board, then 🧐 on arrival, then 😠 + ✏️ when he finds Kev's face. (not marked by the reader)
- E4 still there: When Lin's report stops a write, nothing shows that it was stopped. The reader thinks the swap happened and was reverted (run 8). — Drop the marker back into the tray and erase the half-stroke with a puff when Lin's ❗ fires. (not marked by the reader)
- E5 still there: In run 3 the player stands beside the board in plain view from 4:30 to 4:58 and is never sent to their desk. This contradicts the "idle in view gets you sent to your desk" rule, and it is odd office behaviour right after doctoring the rota. — Either have the boss send idlers off, or show the player visibly pretending to work (papers or a mug in hand) while they wait there. (not marked by the reader)
- E6 still there: Caught end cards show marker scribble, but the marker is never seen in the player's hand (runs 2, 5). — Hold the marker in the player's hand at the board in the caught freeze frame. (not marked by the reader)
- E7 still there: The 4:50 deadline sound ring comes from off-screen at the upper right, and the reader logs it as an unknown event (run 11). — Send the ring out from the wall clock and pulse the clock face red. (not marked by the reader)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Run 3 win is only partly explained. The 🍜❓ bubble clears before the heads turn back, so the reader can't tell the ding made the write possible. — Keep 🍜❓ up exactly as long as each cone stays turned, and fade it out as the cone swings back. (recurring: premise-level?)
- E2 [blocker] The "👢 👉 you" order is given mid-call with the handset at the boss's ear, and 👢 is also his routine "getting up" thought. The reader reads it as phone talk and thinks the forced trip to the desk was their own choice (runs 8, 10). — Boss hangs up first, then gives a 👉 you → 🖥️ order, and the player's walk follows a dotted path from it. (recurring: premise-level?)
- E3 [blocker] The boss's check of the board after Lin's report is drawn with a contented 😊 and no 🧐/😠, so it reads as routine. A real manager told about rota tampering wouldn't stroll over smiling (runs 8, 10). — Draw a dashed line from Lin's report to the board, then 🧐 on arrival, then 😠 + ✏️ when he finds Kev's face. (recurring: premise-level?)
- E4 [should] When Lin's report stops a write, nothing shows that it was stopped. The reader thinks the swap happened and was reverted (run 8). — Drop the marker back into the tray and erase the half-stroke with a puff when Lin's ❗ fires. (recurring: premise-level?)
- E5 [should] In run 3 the player stands beside the board in plain view from 4:30 to 4:58 and is never sent to their desk. This contradicts the "idle in view gets you sent to your desk" rule, and it is odd office behaviour right after doctoring the rota. — Either have the boss send idlers off, or show the player visibly pretending to work (papers or a mug in hand) while they wait there. (recurring: premise-level?)
- E6 [should] Caught end cards show marker scribble, but the marker is never seen in the player's hand (runs 2, 5). — Hold the marker in the player's hand at the board in the caught freeze frame. (recurring: premise-level?)
- E7 [should] The 4:50 deadline sound ring comes from off-screen at the upper right, and the reader logs it as an unknown event (run 11). — Send the ring out from the wall clock and pulse the clock face red. (recurring: premise-level?)
- E8 [blocker] The "told on" beat is used as the end card for a plain "face still on the board" loss (runs 8 and 10).**
- E9 [blocker] Lin's report to the boss is never drawn. The boss's 👉-the-player bubble sits on the phone's dotted line, so it reads as the call being traced (runs 8 and 10).**
- E10 [should] An interrupted write snaps back with nothing shown (run 8, 4:08).**
- E11 [should] The boss's hang-up face lands right as his own portrait pops up on the board (run 4, 4:39).**
- E12 [should] The moment Lin saw the player at the board is never shown (run 4).**
- E13 [should] The noodle boil-over reads as smoke and a bang (runs 3 and 9) or as a ping (runs 10 and 12).** "The microwave puffs smoke", "It bangs and smokes." A smoking microwave that nobody gets up to deal with is not how a real office behaves, and it undercuts the stated reason the heads stay turned.
- E14 [should] Kev's "!" when the copier jams reads as Kev spotting the player (runs 6 and 12).** "It could be a reaction to the player at the copier, or to the copier jamming by itself." "I can't tell whether the '!' at 4:43 means the player was spotted."
- E15 [should] The ❓ at 4:57 over the empty chair is a real reaction, but the reader took it for routine (runs 8 and 12).** "They might mean people are looking for the player, but they might be routine."

### 1-read-1: reading.md

# Saturday: what the six runs show

**The setup, from the pictures.** A whiteboard on an easel in the open office shows one face in a red circle. At the start of every run, that face is the player's. At 5:00 the bald boss stands at the board, gives a "point + face" bubble, and whoever is on the board gets the Saturday shift.

## Run 1: Loss
- 4:30: The player sits at their desk. The woman in teal has a fish thought bubble.
- 4:40: Teal shows "fish 😊". The man in green shows "🤢".
- 4:57: The boss leaves his office. The boss and Teal both get "?" bubbles near the meeting chairs.
- 4:58: The boss shows a megaphone bubble, then a thinking bubble.
- 4:59: The boss gives a "👈 player face" bubble.
- 5:00: The player walks to the board, looking "😬" then "😩".
- **End picture:** the player at a desk with a stack of paper. Icons: 🗓️, player, 😩.
- **Cause:** the player did nothing, so their face stayed on the board.
- **Could be mistaken for a reaction:** the 4:57 "?" bubbles and a dotted line from Teal to the glass wall. The player did nothing, so these must be part of the routine.

## Run 2: Loss
- 4:01: The player is at the board. Both the boss and Teal think "calendar ?".
- 4:01: The boss's sight cone turns red, with a "! 👉 player" burst.
- 4:02: Loss.
- **End picture:** the boss angrily points at the player. The board is half-erased, with someone's spiky dark hair drawn in. Icons: ✏️, 😠, player.
- **Cause:** the boss's cone already covered the board when the player started changing it.
- **Odd:** the captions never say "used the thing" here. Probably the player was caught before the action finished.

## Run 3: Win
- 4:06: The player uses the microwave in the kitchen corner.
- 4:10: A sound. The microwave puffs smoke. The boss, Teal and Green all think "😮 + bowl", and arrows show them turning toward it.
- 4:12: The player uses the board, which now shows Green's face (spiky hair, green shirt). Nobody reacts.
- 4:30 and 4:40: The player is back at their desk. Teal and Green show the same bubbles as in Run 1.
- 4:58–4:59: The boss shows a megaphone, then a thinking bubble, then "👈 Green face".
- 5:00: The player shows a 🎉 bubble. Green shows 😩.
- **End picture:** Green at the desk with the paper stack. Icons: ✏️, Green, 😢. A microwave badge fills one of the two empty slots.
- **Cause:** the smoking microwave turned everyone's heads, which gave the player time to put Green's face on the board.

## Run 4: Loss
- 4:06–4:12: Same as Run 3: microwave, then Green's face on the board.
- 4:34: A sound. The player uses a phone in the top-left room. The boss's office phone gets a "☎️ !" burst.
- 4:35–4:36: More ringing. The boss walks to the phone and shows "?".
- 4:37: The board's circle is blank, and the player stands at it. The boss shows "??".
- 4:38: The player uses the board again.
- 4:39: The boss's portrait pops up over the board. The boss shows "😬".
- 4:40: The boss is back at his desk, still "😬".
- 4:58–4:59: The boss reads the board and shows "boss face 😳". Teal shows "👀👉 player". Green shows "👉 player".
- 5:00: The boss gets a ✏️ bubble, then an angry "👉 player".
- **End picture:** the player at the desk. Icons: ✏️, boss, 😠, player.
- **Cause:** the player swapped Green's face for the boss's. The boss rejected it and wrote the player's name in.
- **Unclear:** whether Teal and Green actually saw the player at the board. Teal walked across the room around 4:38. Their pointing could also just be blame, since the player was standing right there.

## Run 5: Loss
- 4:06: The player uses the microwave.
- 4:10: Sound and smoke, the same reactions as in Run 3. This time the player is still crossing the room, not at the board.
- 4:16: The player is at the board. The boss and Teal think "calendar ?". The boss's cone turns red, with a "! 👉 player" burst.
- **End picture:** the same as in Run 2.
- **Cause:** the player reached the board six minutes after the smoke. By then the heads had turned back.

## Run 6: Loss
- 4:01: The player uses the copier. It shoots paper. Green shows "!", with a red dashed line from the copier to him.
- 4:02: A sound, and red rings spread from the copier. The boss and Teal think "copier". The player hurries to the board.
- 4:02: The boss and Teal now think "calendar ?". The boss's cone turns red, with a "! 👉 player" burst.
- 4:03: A sound. The copier gives off a red spiky burst.
- **End picture:** the same as in Run 2.
- **Cause:** the copier noise did turn heads, but toward the copier. The board stands between the boss and the copier, so the player was caught at the board while everyone was looking that way.
- **Unclear:** Green's "!" at 4:01. It could be a reaction to the player at the copier, or to the copier jamming by itself.

### 1-read-2: reading.md

# Reading: Saturday

## Run 7: win

- **4:30** You (red-haired) are at your desk. The teal woman has a 🐟 thought.
- **4:34** You use the left-room phone. A dotted line runs to the phone in the boss's corner and it rings ☎️❗. The teal woman is over at the microwave.
- **4:35–4:37** The bald boss walks to the ringing phone and gets "?" then "??". You go to the whiteboard and scribble on the face that's on it (yours).
- **4:40** You use the board again. It now shows the spiky-haired man in the green sweater. The boss is back at his desk. Bubbles: 🐟😊 from the teal woman, 🥦 from the green man.
- **4:58–4:59** Meeting at the board. The boss points 👉 at the green man's face.
- **5:00** The green man shows 😩 and you show 🎉.
- **End:** The green man sits alone at a desk on a sunny day. Icons: ✏️, his face, 😢. A phone icon is lit in a slot.

**Why it ended:** the boss read whatever face was on the board. **Cause:** the face swap. The phone call got the boss away from it.

**Might not be a reaction:** the teal woman leaving her desk. Her 🐟 thought comes at 4:30 in every run, so that's routine. It was lucky timing, not something the phone did.

## Run 8: loss

- **4:03** You use the phone and it rings ☎️❗.
- **4:04–4:06** The boss goes to answer it, "?". You scribble on the board.
- **4:06** The teal woman, still at her desk, looks your way. Her vision cone turns red, she thinks 📅❓, then shouts ❗👉(you).
- **4:07** The boss, still by the phone, shows a bubble with a symbol I couldn't read, then 👉(you).
- **4:08** Your face is back on the board, but I didn't see anyone restore it. The boss shows 📅❗. You're at your desk and papers are piling up.
- **4:11–4:12** The boss checks the board, 😠👉(you).
- **4:40** Same routine bubbles as Run 7.
- **4:57–4:58** The others gather; one chair (probably yours) is outlined in red dots. There are "?" bubbles.
- **4:59–5:00** The boss points at your face. You stand up, 😩.
- **End:** The teal woman points at you buried in paper. Icons: her, 👉, paper stack.

**Why it ended:** she caught you editing the board. **Cause:** editing the board at 4:04–4:06 while her desk faced it.

**Doesn't add up:** the end picture shows paperwork, not Saturday, even though the card is about Saturday. I can't tell if you also got Saturday. The "?" at 4:57 might be about your empty seat, or just the meeting starting.

## Run 9: loss

- **4:06** You use the microwave on the right wall.
- **4:10** It bangs and smokes. All three think 😮🍜, and arrows show them turning toward it.
- **4:12** With everyone looking away, you swap the board to the green man's face.
- **4:30–5:00** You stand at the microwave the whole time. Routine bubbles at 4:30 and 4:40.
- **4:57–4:59** The meeting starts and your chair is outlined in red dots. The boss points at the green man's face.
- **5:00** Everyone thinks "(you)?". You think 😨. The boss shows ✏️ and your face is back on the board. The other two point toward your desk.
- **End:** Your empty chair is outlined in red dots. The boss points at your face. Icons: empty chair, 👉, you.

**Why it ended:** you missed the meeting, so the boss rewrote the board with your face. **Cause:** staying at the microwave past 5:00. The swap itself worked.

**Might not be a reaction:** I can't tell why you stayed at the microwave. It could have been your choice, or you could have been stuck there. Nothing on screen explains it.

### 1-read-3: reading.md

# Reading: "Saturday"

**Card:** It's Friday at 4:00 PM. The player is down to work Saturday, the boss makes it official at 5:00, and the goal is to get out of it. The card icons are 🗓️ and the player's face.

## Run 10: Loss

- **4:06** Player uses the microwave on the right wall.
- **4:10** The microwave pings. Boss and both coworkers show 😮🍜. Nobody gets up.
- **4:12** Player uses the whiteboard. The face on it changes from the player (red top, auburn hair) to a dark-haired face.
- **4:16** Player uses the phone in the left room. The phone by the kitchen door rings (☎️!).
- **4:17–4:19** The boss walks to that phone and answers it: "?", then "??". Player goes back to the whiteboard.
- **4:18–4:19** The teal coworker with glasses looks at the player: 🗓️?, then "! 👉 [player]".
- **4:20** Boss, still on the phone, shows "[white object] 👉 [player]".
- **4:21** Boss hangs up: 🗓️!. Player is at the left desk.
- **4:24–4:25** Boss walks to the board, shows "😠 👉 [player]", and the player's face is back on it.
- **4:57–5:00** Everyone gathers at the board. Boss: 😏, then 👉 at the player. Player: 😩.

**Why it ended:** The board showed the player at 5:00. The end picture shows the teal coworker pointing at the player buried in paper, with the icons 👩‍🦱 👉 📄.

**Cause:** The player was seen at the board at 4:18–4:19, and the swap got undone.

**Might not be a reaction:** The teal coworker never walked to the boss, so I can't see how the boss learned. The boss's 4:20 bubble could mean the call was traced to the player, not that the coworker told on them. Nobody acted on the 🍜 bubbles.

## Run 11: Loss

- **4:30** Teal coworker gets up 🐟, and the teal chair ends up on the floor.
- **4:40** Teal coworker: 🐟😋. Green-jacket coworker: 🥗.
- **4:58** Everyone, the player included, gathers at the board, which shows the player. Boss: 📠?, then 😏.
- **4:59–5:00** Boss: 👉 [player]. Player: 😬, then 😩.

**Why it ended:** The board still showed the player. End picture: the player at a desk stacked with paper, sunny window behind. Icons: 🗓️ [player] 😩.

**Cause:** None. The player never used anything, so this is the default loss.

**Might not be a reaction:** Nothing. The fish and salad bubbles and the knocked-over chair look like routine, because they repeat in all three runs.

## Run 12: Loss

- **4:06** Player uses the microwave.
- **4:10** The microwave pings and everyone shows 😮🍜. Nobody moves. A steaming cup sits on the counter from 4:30.
- **4:30 / 4:40** Same fish and salad bubbles as run 11.
- **4:43** Player uses the copier. A red dashed line runs to the green-jacket coworker, who shows "!".
- **4:44** The copier sounds an alarm. Boss and teal coworker: 📠.
- **4:45–4:51** The green-jacket coworker walks to the copier: 🔧, then 😊. Player sits at the green-jacket coworker's empty desk.
- **4:57** Others gather near an empty yellow chair, with "?" bubbles.
- **4:58–5:00** Boss: 😏, then 👉. Player at the borrowed desk: 😬. Then the player appears at the board: 😩.

**Why it ended:** Same picture and icons as run 11. The board never changed.

**Cause:** None of the player's actions seem to have mattered. The copier jam got the green-jacket coworker out of their seat, but sitting in it changed nothing I can see.

**Might not be a reaction:** I can't tell whether the "!" at 4:43 means the player was spotted, because nothing followed from it. The "?" bubbles at 4:57 showed up when the player was away from the gathering (runs 10 and 12) and weren't captured in run 11, where the player was there. They might mean people are looking for the player, but they might be routine.

### 2-compare: report.md

Verdict: fixable

## Runs
- **Run 1 (do nothing): explained.** "the player did nothing, so their face stayed on the board."
- **Run 2 (write in plain sight): explained.** The reader saw the boss's red cone over the board and the half-drawn face.
- **Run 3 (ding win): explained.** "the smoking microwave turned everyone's heads, which gave the player time to put Green's face on the board."
- **Run 4 (second write: the boss's own face): explained.** "the player swapped Green's face for the boss's. The boss rejected it and wrote the player's name in." The reader wasn't sure where Lin's accusation came from (see problems below).
- **Run 5 (wrote after the ding): explained.** "By then the heads had turned back."
- **Run 6 (copier trap): explained.** "the board stands between the boss and the copier."
- **Run 7 (phone win): explained.** The reader named the swap, the phone pulling the boss away, and Lin being away at the microwave. They called her absence "lucky timing", but they read it correctly as her routine and not a reaction to the phone. That routine is exactly what the player timed the call around.
- **Run 8 (phone with Lin at her desk): partly.** The reader got the cause: Lin saw the write. They could not say what the loss actually was: "the end picture shows paperwork, not Saturday … I can't tell if you also got Saturday." What really happened: Lin told on the player, so the write never happened, the player's face stayed on the board, and the player got Saturday. Visual cause: the end card shows the "told on" beat (Lin 👉 the player buried in paper), which is not an ending, instead of the real loss. Fix: below, first blocker.
- **Run 9 (left the board before 5:00, blamed): explained.** "you missed the meeting, so the boss rewrote the board with your face."
- **Run 10 (Kev at the ding, then a second write that Lin saw): explained.** "The player was seen at the board at 4:18–4:19, and the swap got undone." The reader couldn't see how the boss found out (second blocker).
- **Run 11 (stood at the gathering, did nothing): explained.** Default loss.
- **Run 12 (noodles, copier, Kev fixing it, no write): explained.** "The board never changed."

## Problems
- **blocker: The "told on" beat is used as the end card for a plain "face still on the board" loss (runs 8 and 10).**
  - The end card shows Lin pointing at the player buried in paper, with the icons Lin 👉 📄. That says Lin's report was the ending. In fact the report only cost the player their write, and the real loss was Saturday. The reader couldn't tell whether the player got Saturday at all.
  - Visual cause: a cause and its effect too far apart. The end card shows a 4:06 event and leaves out the 5:00 outcome.
  - Fix: every loss where the player's face is still on the board ends on the Saturday card (sunny window, the player at a desk, 🗓️ player 😩). If you want the history on the card, draw Lin's 👉 as a small badge in an empty slot.
- **blocker: Lin's report to the boss is never drawn. The boss's 👉-the-player bubble sits on the phone's dotted line, so it reads as the call being traced (runs 8 and 10).**
  - The reader said: "The teal coworker never walked to the boss, so I can't see how the boss learned. The boss's 4:20 bubble could mean the call was traced to the player."
  - What really happened: Lin told him. In run-10/09.png, the boss stands at his phone with the handset cord and the supply-room dotted line still up, and his bubble reads "[object] 👉 [player]". In run-08/07.png the "symbol I couldn't read" is the same.
  - Visual cause: a missing cue, plus a bubble that reads as a reaction to the wrong thing. This breaks the phone route's own logic, since the design says his old phone can't show who called.
  - Fix: have Lin's ❗👉 bubble fly along a dashed line from her desk to the boss. He turns toward her and shows 👂 before his 😠👉. Drop the object icon from his bubble.
- **should: An interrupted write snaps back with nothing shown (run 8, 4:08).**
  - The reader said: "Your face is back on the board, but I didn't see anyone restore it."
  - What really happened: Lin's report cancelled the half-done write. Visual cause: a missing cue.
  - Fix: when the write is stopped, the player drops the eraser back on the tray and the wiped rows redraw in a quick puff, in the same frame as Lin's ❗👉.
- **should: The boss's hang-up face lands right as his own portrait pops up on the board (run 4, 4:39).**
  - The reader saw "The boss's portrait pops up over the board. The boss shows 😬 … still 😬." It reads as if he noticed the swap at 4:39 and then did nothing for 20 minutes.
  - What really happened: it is his 🙄 at the dead line, from the corner with his back to the room. Visual cause: a bubble that reads as a reaction.
  - Fix: make the hang-up bubble "☎️🙄", draw the handset going back on its base in the same frame, and keep the board pop-up and his bubble at least a beat apart.
- **should: The moment Lin saw the player at the board is never shown (run 4).**
  - The reader asked: "whether Teal and Green actually saw the player at the board … Their pointing could also just be blame."
  - At 4:38 (run-04/09.png) Lin is walking back past Kev's desk, facing away. Her 👀👉 at 4:58 has no source on screen. Visual cause: a cause and its effect too far apart, with the cause missing.
  - Fix: the moment Lin's cone crosses the player near the board, give her a small 👀 bubble with a dotted glance line, so 4:58 can pay it off.
- **should: The noodle boil-over reads as smoke and a bang (runs 3 and 9) or as a ping (runs 10 and 12).** "The microwave puffs smoke", "It bangs and smokes." A smoking microwave that nobody gets up to deal with is not how a real office behaves, and it undercuts the stated reason the heads stay turned.
  - Fix: draw white steam with foam running down a fogged window, and make the bubble 🍜💨 instead of a grey cloud.
- **should: Kev's "!" when the copier jams reads as Kev spotting the player (runs 6 and 12).** "It could be a reaction to the player at the copier, or to the copier jamming by itself." "I can't tell whether the '!' at 4:43 means the player was spotted."
  - Visual cause: a bubble that reads as a reaction to the player. A red dashed line plus "!" is the same language as "caught".
  - Fix: make Kev's bubble 📠🔧 and draw his line in neutral grey, not red.
- **should: The ❓ at 4:57 over the empty chair is a real reaction, but the reader took it for routine (runs 8 and 12).** "They might mean people are looking for the player, but they might be routine."
  - Fix: draw a dotted glance line from each ❓ to the empty chair, and outline the chair at the same moment.
- **nit: The boss's 📢 at 4:58 is read as 📠 (run 11),** which suggests a copier link that doesn't exist. Fix: a bigger megaphone with sound lines coming out of it.
- **nit: Kev's 4:40 food bubble is read three ways (🤢, 🥦, 🥗).** As 🤢 right after Lin's fish, it looks like a reaction to the smell. Fix: one clear, large 🥗 with a fork.
- **nit: Lin's chair, pushed out while she's away, is read as knocked over** ("the teal chair ends up on the floor"). Fix: draw it upright and rotated away from the desk.
- **nit: The boss's phone is placed "by the kitchen door"** in one reading. Fix: give the corner phone table a clearer position inside the boss's office, away from the doorway.

<!-- /cold-read:replay -->
