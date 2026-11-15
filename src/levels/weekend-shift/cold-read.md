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

<!-- cold-read:faces {"verdict":"fixable","date":"2026-11-15","commit":"d22f387","hash":"e0f10158d98962db8b4de6f25cb2ae910d03e1b55fae6ca169857c6b75e28c09","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","checks":"69ad3ba43d5cfd8bed529d25ce051f55d13e27475a87edae3ec5ffbd5be037ee","faces":"9e5d161895913b7e0a263a2cdf05a4e1a2a95747919832eaa42592590794b7f3","prompts":"7b1353c6de0c5cf6c70013ea3cb8b0b9dfaae148125f1ffbe7155582b0b04938"},"model":"default","tally":{"clear":27,"vague":5,"misread":1},"problems":{"blocker":3,"should":5,"nit":1}} -->
## faces: fixable
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs e0f10158d989: the card, route-checks.js, the bubbles, the pass's prompts.
Items: 27 clear, 5 vague, 1 misread.
Problems: 3 blocker, 5 should, 1 nit.
Earlier problems: 0 fixed, 6 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 75 s | $0.22 |
| 2-judge | report.md | 151 s | $0.63 |
| all | | 226 s (the steps add up to 226 s) | $0.85 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: The document glyph (04, 30) is a pale grey page that turns into an unnameable smudge in the frame. 04 came up 16 times and drives the boss at 4:50. 30 is the phone call's whole message. A player can't tell what the boss wants or what the call was about. — Use a page with dark text lines (📄 instead of a blank 📃). In 30, add a figure to make the action clear, e.g. 📄 ➡️ 🖨️ for "print it." (28 still uses a blank grey page that turns into a smudge in the frame. It is the whole message of the phone call.)
- E2 still there: The pencil (22, 34) is the cause of a loss, and it doesn't say whether the boss saw tampering or is writing Bun in. A player won't know what got them caught. — For tampering, show the board with a ✏️ scribble, or ✏️ + ❗. For writing Bun in, show ✏️ + Bun's face. (24's lone pencil still doesn't say why you lost: "writing you in" or "caught you tampering.")
- E3 still there: 🧐 (08) reads as either "reading" or "suspicious." If suspicion is meant, the player misses the warning. — Use 👀 for reading, or 🧐❓ (or 🤨) for suspicion. (06 still uses 🧐, but in its frame both readings land on "checking the board.")
- E4 still there: The bare pointer (10) says nobody's name. — Always pair the hand with the face of the person meant, as in 09 and 16. (08 is still a bare hand with no face.)
- E5 still there: Nothing ties Spiky's 🤢 (03) to Teal's fish. — Use 🐟 + 🤢, or put a smell line (💨/🦨) beside the face. (03 shows only 🤢. Only the timing links it to Teal's fish, which is 220 px away.)
- E6 still there: "📅!" (31) doesn't say what the boss remembered. — Use 📅 + Bun's face, or show the board itself instead of a calendar. (29 is still just "📅!" with no subject.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The document glyph (04, 30) is a pale grey page that turns into an unnameable smudge in the frame. 04 came up 16 times and drives the boss at 4:50. 30 is the phone call's whole message. A player can't tell what the boss wants or what the call was about. — Use a page with dark text lines (📄 instead of a blank 📃). In 30, add a figure to make the action clear, e.g. 📄 ➡️ 🖨️ for "print it." (recurring: premise-level?)
- E2 [blocker] The pencil (22, 34) is the cause of a loss, and it doesn't say whether the boss saw tampering or is writing Bun in. A player won't know what got them caught. — For tampering, show the board with a ✏️ scribble, or ✏️ + ❗. For writing Bun in, show ✏️ + Bun's face. (recurring: premise-level?)
- E3 [should] The bare pointer (10) says nobody's name. — Always pair the hand with the face of the person meant, as in 09 and 16. (recurring: premise-level?)
- E4 [should] Nothing ties Spiky's 🤢 (03) to Teal's fish. — Use 🐟 + 🤢, or put a smell line (💨/🦨) beside the face. (recurring: premise-level?)
- E5 [should] "📅!" (31) doesn't say what the boss remembered. — Use 📅 + Bun's face, or show the board itself instead of a calendar. (recurring: premise-level?)
- E6 [should] In 07 and 14 the hand points left, away from the face in the bubble, while 12, 15, 22, 23, 25 and 28 point at the face. This reads as "not her" / "not him" until you see the board in the frame. — Keep the hand pointing at the face inside the bubble, and let the boss's arm do the in-world pointing. Or use board + face (🗒️ + face) for "on the board."
- E7 [should] 05's grey megaphone on a white bubble can't be named at frame size. — Use the orange 📣.
- E8 [blocker] 28: misread — The grey page is a smudge at frame size. The caller's message reads only as "…her" (E1).

### 1-read: reading.md

I've looked at all 33 bubbles and am writing up what each one says.

# Reading of bubbles/

**Bubble shapes as I read them:** a cloud is a private thought, a rounded box is speech, and a spiky starburst is an alarm or a shout.

1. Thought: "Fish…" They want fish, or they're daydreaming about lunch. Or someone's fish is on their mind.
2. Speech: "Fish! 😊" They love fish, or they're happy about a fish lunch.
3. Speech: green, queasy face. "I feel sick." Maybe it's the fish, or a smell.
4. Thought: red "?" They're confused or wondering about something.
5. Speech: megaphone. "Announcement!" or "Listen up, everyone."
6. Thought: monocle face. "Hmm, suspicious…" They're watching someone closely.
7. Speech: pointing hand, then the brown-bun woman in a red top. The hand seems to point *left, away from* her, unlike 15/22/23. It could be "It was her" or "Go to her." Or, if the direction matters, "Not her," "Away from her."
8. Speech: lone hand pointing left. "Over there," "That way," or "Go."
9. Speech: teeth-baring grimace. "Yikes," "Awkward," "Oops."
10. Speech: weary, anguished face. "Ugh, I'm so tired," or "This is too much."
11. Thought: calendar plus "?" "What day is it?" "When is it due?" or "Is there a meeting?"
12. Starburst: "!" plus a hand pointing at the bun woman. "HER!" They're accusing or alerting about her: "Look, it's her!"
13. Thought: surprised "oh" face plus a steaming noodle bowl. "Ooh, noodles!" Either they want some, or they're shocked about someone's noodles.
14. Speech: hand plus a dark spiky-haired person in green. The hand matches 7, so it seems to point away from him: "Him / go to him." Or maybe "not him."
15. Speech: hand clearly pointing *at* the spiky-haired man. "It's him," or "Go see him." The only change from 14 is the hand, and I can't tell whether that's meant to change the meaning.
16. Speech: party popper. "Celebrate!" "Yay!" Could also be a party or birthday.
17. Starburst: red phone plus "!" "The phone's ringing!" or "Urgent call!"
18. Speech: "?" "Huh? What?"
19. Speech: "? ?" "Huh?? What on earth?" Stronger confusion than 18.
20. Speech: eye-roll. "Ugh, whatever." Annoyed or unimpressed.
21. Speech: bald man with a mustache, then a flushed, wide-eyed face. "The boss!" They're embarrassed or alarmed about the bald guy, or they've got a crush on him.
22. Speech: eyes, then pointing at the bun woman. "Watch her," "I saw her," or "Look at her."
23. Speech: pointing at the bun woman. "Her," "Go to her," or "It's her."
24. Speech: pencil. "Write it down," "Sign this," or "I need a pencil."
25. Speech: angry face, then pointing at the bun woman. "I'm mad at her," or "She's angry."
26. Speech: "!" "Oh!" "Hey!" They noticed something.
27. Thought: printer. "I need to print," or "the printer…" maybe worried about it.
28. Speech: a gray page with a folded corner (a document), then pointing at the bun woman. "Give the papers to her," or "She has the document."
29. Starburst: calendar plus "!" "Deadline!" "The meeting is now!"
30. Thought: bun woman plus "?" "Where is she?" or "Who is she?"
31. Thought: anxious face, blue forehead, sweat drop. They're dreading something and nervous.
32. Speech: wrench. "Fix it," "I'll fix it," or "Something's broken."
33. Speech: smile. "Thanks," "Nice," or "All good."

**Ambiguities a player would trip on:**
- In 7 and 14 the hand seems to point the other way from 15, 22, 23 and 28. I can't tell whether that means something.
- In 23, "Her" can mean "she did it," "go to her," or "it's for her."
- In 21, the flushed face can read as fear or as a crush.

### 2-judge: report.md

Verdict: fixable
- 01: clear — Teal is thinking about fish for lunch.
- 02: clear — Teal is happy about her fish.
- 03: vague — Spiky feels sick. Nothing in the bubble ties it to Teal's fish (E5).
- 04: clear — Teal is confused as the boss comes out.
- 05: vague — The boss is about to announce something, but the grey megaphone on a white bubble is a blur at frame size.
- 06: clear — The boss is looking over the board.
- 07: clear — The boss points left at the board showing your face: "It's her." Alone, the hand looks like it points away from her.
- 08: vague — A bare hand points toward the board. It doesn't say who is meant (E4).
- 09: clear — You: "Yikes."
- 10: clear — You, at the board: "Ugh, no."
- 11: clear — The boss and Teal wonder what's on the calendar.
- 12: clear — The boss has caught you in his office: "Her!"
- 13: clear — Three people smell noodles from the microwave.
- 14: clear — The boss points at the board, which now shows Spiky: "Him." Alone it could read "not him."
- 15: clear — The boss points at Spiky himself: "You."
- 16: clear — You celebrate.
- 17: clear — The boss: "The phone's ringing!"
- 18: clear — The boss answers and hears nobody: "Huh?"
- 19: clear — "What on earth?"
- 20: clear — The boss rolls his eyes at a prank call.
- 21: clear — The boss sees his own face on the board: "Me?!" In the frame it reads as shock, not a crush.
- 22: clear — Teal tells on you: "I saw her."
- 23: clear — Spiky: "It was her."
- 24: vague — The boss's pencil doesn't say whether he's writing you in or noting that you tampered with the board. This run is a loss (E2).
- 25: clear — The boss is angry at you.
- 26: clear — Spiky spots you at the printer.
- 27: clear — The boss and Teal think about the noisy printer.
- 28: misread — The grey page is a smudge at frame size. The caller's message reads only as "…her" (E1).
- 29: vague — The boss is alarmed about the calendar but it doesn't say why (E6).
- 30: clear — "Where is she?"
- 31: clear — You, hiding, are dreading it.
- 32: clear — Spiky: "I'll fix the printer."
- 33: clear — Spiky is pleased he fixed it.

## Earlier problems
- E1: still there (blocker) — 28 still uses a blank grey page that turns into a smudge in the frame. It is the whole message of the phone call.
- E2: still there (blocker) — 24's lone pencil still doesn't say why you lost: "writing you in" or "caught you tampering."
- E3: still there (nit) — 06 still uses 🧐, but in its frame both readings land on "checking the board."
- E4: still there (should) — 08 is still a bare hand with no face.
- E5: still there (should) — 03 shows only 🤢. Only the timing links it to Teal's fish, which is 220 px away.
- E6: still there (should) — 29 is still just "📅!" with no subject.

## Problems
- should: In 07 and 14 the hand points left, away from the face in the bubble, while 12, 15, 22, 23, 25 and 28 point at the face. This reads as "not her" / "not him" until you see the board in the frame. — Keep the hand pointing at the face inside the bubble, and let the boss's arm do the in-world pointing. Or use board + face (🗒️ + face) for "on the board."
- should: 05's grey megaphone on a white bubble can't be named at frame size. — Use the orange 📣.

<!-- /cold-read:faces -->

<!-- cold-read:tells {"verdict":"fixable","date":"2026-11-15","commit":"d22f387","hash":"4150387f1f77024be6281a53bbd72e1f448e8fed4b8612c397e7b52c92e99bc1","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","checks":"69ad3ba43d5cfd8bed529d25ce051f55d13e27475a87edae3ec5ffbd5be037ee","tells":"9f7944aa85a5a65dcaeffe427e3e877ccc44d12020c604660050035f22051d7b","prompts":"f1d914aecdc56ea365960569f2587c9563e9f9a055deb88f13ba995eb473a219"},"model":"default","tally":{"visible":3,"faint":1,"invisible":1},"problems":{"blocker":3,"should":4,"nit":1}} -->
## tells: fixable
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs 4150387f1f77: the card, route-checks.js, the before and after pictures, the pass's prompts.
Items: 3 visible, 1 faint, 1 invisible.
Problems: 3 blocker, 4 should, 1 nit.
Earlier problems: 0 fixed, 3 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 34 s | $0.13 |
| 2-judge | report.md | 49 s | $0.18 |
| all | | 83 s (the steps add up to 83 s) | $0.32 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: In 05 neither phone looks like a phone. The player's handset is read as a speaker, and the dotted arc suggests a thrown object rather than a call. The boss's phone is hidden under the noise burst. A player who doesn't know it's a phone call can't plan the "ring the boss while Lin heats her fish" route. Fix: lift the handset off its cradle when used, with a coiled cord. Replace the arc with a 📞 bubble over the player and ringing waves around the boss's phone. Shake the boss's phone visibly and don't let the burst cover it. (The handset only tilts a little. The arc still looks like something thrown, and the burst still covers the boss's phone. The reader read the call as "fired something", and two routes depend on knowing it is a call. That is a misread cause, so it is now a blocker.)
- E2 still there: In 02 the ding ends in the same frame the face is put on the board. The rings and all three "🍜?" bubbles vanish at that moment, so a player may conclude that touching the board makes people stop watching. The actual lesson is that the ding is your window. Fix: let the rings fade over a beat after the ding. Show each head turning back from the microwave one at a time with a small arrow, separately from the board interaction. (In 02, the rings and all three 😮🍜 bubbles vanish on the same frame as the roster write. The reader said outright that they couldn't tell whether the board cleared them.)
- E3 still there: In 04 only the right-hand worker visibly turns toward the copier. The boss gets just an ambiguous orange line, and the middle worker shows nothing. The "every head turned toward it" mirror fail needs the player to see that everyone is looking away from the board. Fix: give every watcher who hears the copier the same "!" and a head turn toward it, with matching lines. Make the boss's reaction a clear turn behind the glass, not a stray line. (Now in 05. Only the green worker gets a "!". The boss gets a stray orange line, which the reader read as "perhaps", and the middle (teal) worker shows no reaction at all.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 05 neither phone looks like a phone. The player's handset is read as a speaker, and the dotted arc suggests a thrown object rather than a call. The boss's phone is hidden under the noise burst. A player who doesn't know it's a phone call can't plan the "ring the boss while Lin heats her fish" route. Fix: lift the handset off its cradle when used, with a coiled cord. Replace the arc with a 📞 bubble over the player and ringing waves around the boss's phone. Shake the boss's phone visibly and don't let the burst cover it. (recurring: premise-level?)
- E2 [should] In 02 the ding ends in the same frame the face is put on the board. The rings and all three "🍜?" bubbles vanish at that moment, so a player may conclude that touching the board makes people stop watching. The actual lesson is that the ding is your window. Fix: let the rings fade over a beat after the ding. Show each head turning back from the microwave one at a time with a small arrow, separately from the board interaction. (recurring: premise-level?)
- E3 [should] In 04 only the right-hand worker visibly turns toward the copier. The boss gets just an ambiguous orange line, and the middle worker shows nothing. The "every head turned toward it" mirror fail needs the player to see that everyone is looking away from the board. Fix: give every watcher who hears the copier the same "!" and a head turn toward it, with matching lines. Make the boss's reaction a clear turn behind the glass, not a stray line. (recurring: premise-level?)
- E4 [blocker] The roster portrait isn't tied to any coworker. The reader couldn't tell whom the swap "is aimed at", but the win depends on the boss reading *Kev's* face, and the player has to know that face is Kev. — Draw the portrait in the person's own colours and hair (green shirt, dark hair). When the face goes up, have Kev glance at the board for a beat.
- E5 [blocker] In 04 nothing shows the boss is on the phone. The dotted line is still there, but he just stands there with a "?". The fail route is "during his call", so the call is the window, and the player can't see it. — Show the handset at the boss's ear, a 📞 bubble over him and the cord stretched. Have him put it down when the call ends.
- E6 [should] The cup in 01 just disappears while the hand box stays empty, so the reader wondered whether it went into the microwave at all. — Show the cup inside the lit microwave window, or flash it in the hand box for a moment before it goes in.
- E7 [should] The board is drawn as an easel with a portrait, so the reader called it a "poster". Nothing says it is a duty roster that the boss checks. — Add rows of small face slots or a weekend calendar strip on the board. Have the boss glance at it on his rounds so its job can be learned by watching.

### 1-read: reading.md

# Reading: what changed in each image

The held box at the top (the hand icon) is empty in both halves of all five images. The two slots next to the "↻1" counter are also empty throughout. Nothing was picked up or used up in any of these moments.

**01:** The microwave the player was facing (it had the yellow outline and the E prompt) is lit up in AFTER, so it seems to be running. The red-and-white cup that sat just above it on the counter seems to be gone. The player has turned to face the counter. Nobody reacts: there are no bubbles or "!" marks. I think the player switched the microwave on, maybe after putting the cup in it.

**02:** The picture on the easel next to the player changed from a red-haired woman to a dark-haired man. In BEFORE, the boss and both desk workers had 😮🍜 thought bubbles, and the microwave was smoking and giving off rings. In AFTER, all three bubbles are gone, and the microwave is still smoking. I think the player swapped the face on the easel poster. I can't tell whether that is what cleared the bubbles or whether they just ran out on their own.

**03:** The black object in the small left room (it looks like a chair or speaker) was outlined with an E. In AFTER, it is aimed toward the top right. A dotted arc runs from it to the matching black object in the corner of the boss's office, and there is a burst/impact mark there. A red "!" splash appears above the boss's head. The green-shirt worker at the bottom desk seems to react a little. I think the player fired or switched on something that set off a noise across the room at the other device, which startled the boss.

**04:** The easel picture changed again, from the dark-haired man to the bald boss. In BEFORE, the boss was standing by the top-right device with a "?" bubble. In AFTER, the "?" is gone and the boss is still there. The teal-shirt worker moved from near the microwave to the green worker's desk and seems to be carrying something (this may have nothing to do with the player). I think the player swapped the poster to show the boss's face.

**05:** The copier the player was facing (outlined, with the E prompt) is spitting out paper in AFTER and has a warning icon. A red dashed line runs from the copier to the green-shirt worker, who now has a "!" bubble. An orange dashed line runs from the copier up to the boss's desk. I think the player jammed or started the copier, which got the green worker's attention and perhaps the boss's.

What confused me as a player:
- The two easel swaps (02 and 04) look identical. Only the face changes. I can't tell what swapping the poster does or who it's aimed at.
- In 01 the only feedback is the microwave glowing, and the cup going missing is easy to overlook. Because the hand box never fills, it looks like I never held the cup. So did it go into the microwave, or did it simply disappear?

### 2-judge: report.md

Verdict: fixable

- tells/01.png: visible — The player started the microwave. The reader saw it light up and guessed it was switched on. The red-and-white cup vanishing was noticed but not understood, because the hand box never filled.
- tells/02.png: faint — The player wrote Kev's name on the roster. The reader saw a face swap on an "easel poster" but could not tell it was a duty roster or whose face it was. They also couldn't separate the swap from the bubbles and rings stopping in the same frame.
- tells/03.png: invisible — The player rang the boss from the desk phone. The reader saw a "chair or speaker" firing something along an arc, with an impact burst at the far end. They read it as a launched noise that startled the boss, not as a phone call.
- tells/04.png: visible — The player drew the boss's face on the roster. The reader saw the face change to the bald boss. They did not see that the boss was on a call, only "standing by the device with a ?".
- tells/05.png: visible — The player jammed the copier. The reader saw paper, a warning icon and the green worker's "!". The boss's reaction was only "perhaps", and the middle worker showed nothing.

## Earlier problems
- E1: still there (blocker) — The handset only tilts a little. The arc still looks like something thrown, and the burst still covers the boss's phone. The reader read the call as "fired something", and two routes depend on knowing it is a call. That is a misread cause, so it is now a blocker.
- E2: still there (should) — In 02, the rings and all three 😮🍜 bubbles vanish on the same frame as the roster write. The reader said outright that they couldn't tell whether the board cleared them.
- E3: still there (should) — Now in 05. Only the green worker gets a "!". The boss gets a stray orange line, which the reader read as "perhaps", and the middle (teal) worker shows no reaction at all.

## Problems
- blocker: The roster portrait isn't tied to any coworker. The reader couldn't tell whom the swap "is aimed at", but the win depends on the boss reading *Kev's* face, and the player has to know that face is Kev. — Draw the portrait in the person's own colours and hair (green shirt, dark hair). When the face goes up, have Kev glance at the board for a beat.
- blocker: In 04 nothing shows the boss is on the phone. The dotted line is still there, but he just stands there with a "?". The fail route is "during his call", so the call is the window, and the player can't see it. — Show the handset at the boss's ear, a 📞 bubble over him and the cord stretched. Have him put it down when the call ends.
- should: The cup in 01 just disappears while the hand box stays empty, so the reader wondered whether it went into the microwave at all. — Show the cup inside the lit microwave window, or flash it in the hand box for a moment before it goes in.
- should: The board is drawn as an easel with a portrait, so the reader called it a "poster". Nothing says it is a duty roster that the boss checks. — Add rows of small face slots or a weekend calendar strip on the board. Have the boss glance at it on his rounds so its job can be learned by watching.
- nit: In 04 the teal worker carries something across the room in the same frame as the write. The reader flagged it as possibly connected. — Keep unrelated walks out of the moment the player acts, or give them their own obvious purpose bubble (☕).

<!-- /cold-read:tells -->

<!-- cold-read:outcomes {"verdict":"fixable","date":"2026-11-15","commit":"d22f387","hash":"e24b863ceb32b6080b7894294ce55696d943e08639beff0e93403a7b1d61e137","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","checks":"69ad3ba43d5cfd8bed529d25ce051f55d13e27475a87edae3ec5ffbd5be037ee","ways":"f3020a30329cbc3c48e43c84d4ce54912272129e4f4c5a994c816893f772a60f","ends":"19adeb1ce034bf754b3a7b502384496710549797da6a266349e8e0e59b3c867a","prompts":"2c4a72c45c8e3d7e595f0928af4c2741d3a3e144356d832e05fe3e1263e3a558"},"model":"default","tally":{"clear":8,"unclear":1,"wrong":3},"problems":{"blocker":5,"should":2,"nit":1}} -->
## outcomes: fixable
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs e24b863ceb32: the card, route-checks.js, premise.md's ways to win and lose, the runs' last frames, the pass's prompts.
Items: 8 clear, 1 unclear, 3 wrong.
Problems: 5 blocker, 2 should, 1 nit.
Earlier problems: 0 fixed, 3 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 137 s | $0.59 |
| 2-judge | report.md | 73 s | $0.34 |
| all | | 210 s (the steps add up to 210 s) | $0.93 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: In runs 8 and 10 the end card shows the told-on punishment (Lin ❗👉, paper pile) instead of the ending that just played. The 5:00 picture builds up the Saturday board loss, and the card contradicts it. A player learns that "Lin" is a separate kind of loss, and never learns that her face on the board is what lost. — Show the red Saturday card (sunny window, her face on the board) in every board loss. Put Lin's 👉 face in the card's cause row. For run 10, also show a small strip on the board of Kev's face wiped off and hers drawn back. (In runs 8 and 10 the end card is still the told-on scene with Lin 👉 and papers, at 5:00, right after the frames that build up the Saturday reading. The card contradicts the moment before it, and run 10 still shows no Kev→her swap.)
- E2 still there: Run 4's "own face" ending reads as "caught". The card's icon row starts with ✏️ and then the angry boss, which is the same vocabulary as the caught card in runs 2, 5 and 6. The boss's face never appears on the board in the final pictures or on the card. A player won't learn that writing a second time is what broke it. — In the card scene, show the boss's own face in the Saturday box, half wiped, with the boss red-faced 😳. Lead the icon row with that board (board with the boss's face → ✏️ → her face), and keep the pencil-plus-angry-boss pairing for "caught" only. (In run 4 the boss's face never appears, there is no 😳, and the icon row is still ✏️ + boss + 😠 + her. The card does show her full face, not a half-drawn one, but a player can't tell that apart from caught. The Lin/Kev 👀👉 tell is only dotted lines in frame 18.)
- E3 still there: In run 6 the trap's cause doesn't read. The boss's 🖨️ dashed line to the copier passes right through her at the board, but against his red cone it looks like he was simply watching her the whole time. — Draw his look as a bright orange line that stops on her. Pop a 🖨️→😳 beat over his head as she comes into view. On the card, put the copier directly behind her in the boss's line of sight. (In run 6 the starburst is already up before the beep frame. There is no orange 🖨️ line that stops on her and no 🖨️→😳 beat, so the reader blamed the copier for failing to pull the boss. It isn't a blocker: the outcome reads right and the lesson (the boss still saw the board) isn't false. It just misses the "looking through the board" point.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In runs 8 and 10 the end card shows the told-on punishment (Lin ❗👉, paper pile) instead of the ending that just played. The 5:00 picture builds up the Saturday board loss, and the card contradicts it. A player learns that "Lin" is a separate kind of loss, and never learns that her face on the board is what lost. — Show the red Saturday card (sunny window, her face on the board) in every board loss. Put Lin's 👉 face in the card's cause row. For run 10, also show a small strip on the board of Kev's face wiped off and hers drawn back. (recurring: premise-level?)
- E2 [blocker] Run 4's "own face" ending reads as "caught". The card's icon row starts with ✏️ and then the angry boss, which is the same vocabulary as the caught card in runs 2, 5 and 6. The boss's face never appears on the board in the final pictures or on the card. A player won't learn that writing a second time is what broke it. — In the card scene, show the boss's own face in the Saturday box, half wiped, with the boss red-faced 😳. Lead the icon row with that board (board with the boss's face → ✏️ → her face), and keep the pencil-plus-angry-boss pairing for "caught" only. (recurring: premise-level?)
- E3 [should] In run 6 the trap's cause doesn't read. The boss's 🖨️ dashed line to the copier passes right through her at the board, but against his red cone it looks like he was simply watching her the whole time. — Draw his look as a bright orange line that stops on her. Pop a 🖨️→😳 beat over his head as she comes into view. On the card, put the copier directly behind her in the boss's line of sight. (recurring: premise-level?)
- E4 [should] In run 9 (blamed), the boss's wipe-and-redraw (✏️) doesn't show in the last frames or on the card. The reader concluded her write never happened, so the player can't tell that the write worked and only being away broke it. — On the 5:00 frame, show the boss's ✏️ bubble at the board with Kev's face half-wiped. On the card, lead the icon row with Kev's face crossed out → empty seat → her face.
- E5 [blocker] Run 4: wrong — She wrote twice and put the boss's own face on the board. The reader saw "caught, unclear how". The boss's face never shows on the board, there is no 😳 beat, and the icons are ✏️ + boss + 😠 + her, which reads as the caught card.
- E6 [blocker] Run 8: wrong — Lin told on her earlier, and at 5:00 her face was still on the board, so she lost the Saturday reading. The 5:00 frames build up that loss, but the end card is the told-on scene (Lin ❗👉, paper pile) instead.
- E7 [blocker] Run 10: wrong — She wrote Kev's face, then Lin saw a second write, and the boss put her face back. The reader saw run 8's told-on card. The last frames never show Kev's face being wiped and hers drawn back.

### 1-read: reading.md

# How each loop of BUSYWORK "Saturday" ended

**Overall:** 2 wins, 7 plain losses and 3 runs where I can't say for sure. Runs 8 and 10 have end pictures that don't match what came before them. In several runs the caption times don't match the clock shown in the pictures.

Here is how I'm naming things. The player is the woman in the red top with a hair bun, marked by a red ring. The boss is bald, in a dark suit. The two coworkers are a spiky-haired man in a green shirt and a woman with glasses and a bun in a teal shirt. The board is the whiteboard on an easel with a face on it.

---

### Run 1: loss (put on the Saturday shift)
- **What tells me:** At 5:00 the player stands at the board, which still shows her face. The boss points and she makes a 😩 face. The end picture has a red border and shows her at a desk under a sunny window with a stack of papers. The icons read 🗓️ + her face + 😩.
- **Does the end match?** Yes.
- **What broke:** The pictures don't show any plan. The board was never changed.

### Run 2: caught
- **What tells me:** At 4:01 the player is at the board inside the boss's red viewing area. A starburst appears over the boss: "! 👉 her face". The end picture has a red border: the boss is angry and pointing, and a marker is scribbling on the board. The icons read ✏️😠 + her face, then the Saturday desk.
- **Does the end match?** Yes.
- **What broke:** She changed the board while the boss could see her through the glass wall.
- **Mismatch:** The captions say 4:02 but the clock in the pictures shows 4:01.

### Run 3: win
- **What tells me:** At 5:00 the board shows the green-shirt man's face. The boss points at him and he goes 😩, while the player has a 🎉 bubble. The end picture has a green border and shows the green-shirt man crying at the Saturday desk. An item that looks like a ticket or ID badge fills the first slot.
- **Does the end match?** Yes.

### Run 4: caught, though it's unclear how
- **What tells me:** At 5:00 the board seems to show her face, and I can't read the small marks on it. The boss's bubble is ✏️, then "😠 👉 her face". The end picture is the same as the caught picture in run 2, but with a fourth icon of the boss's face.
- **Does the end match?** Yes.
- **What broke:** The boss seems to have spotted a pencil edit when he read the board at 5:00. Nothing in the pictures shows him seeing her do it. I can't tell whether the edit was left half-done or was visible.

### Run 5: caught
- **What tells me:** At 4:16 she is at the board inside the boss's red viewing area, and the "! 👉 her face" starburst appears. The end picture is the same as in run 2.
- **Does the end match?** Yes.
- **What broke:** Same as run 2: she changed the board in the boss's line of sight.
- **Mismatch:** The caption says 4:17 but the picture shows 4:16.

### Run 6: caught
- **What tells me:** The photocopier at the bottom left gives off rings, then a red burst. The caption says "You hear a sound." The green-shirt man reacts with "!", but the boss's starburst ("! 👉 her face") is already showing in the first picture. The end picture is the same caught picture.
- **Does the end match?** Yes.
- **What broke:** The distraction at the copier drew in the green-shirt man, not the boss. The boss's red viewing area still covered the board.
- **Mismatch:** The caption says 4:03 but the picture shows 4:02.

### Run 7: win
- **What tells me:** This is the same as run 3. The board shows the green-shirt man, he goes 😩 and the player 🎉. The end picture has a green border with him at the Saturday desk. The item gained looks like a dark office chair.
- **Does the end match?** Yes.

### Run 8: loss, but the end picture doesn't fit
- **What tells me:** The last two moments look the same as run 1: the board shows her face, the boss points, she goes 😩. The end picture has a red border but is a different scene. The teal-shirt woman points at the player, with an "! 👉 her face" bubble, while the player sits buried under a stack of papers. The icons read: the teal woman's face 👉 papers.
- **Does the end match?** No. The teal-shirt woman never pointed at or noticed anything in the frames shown.
- **What broke:** I can't tell.

### Run 9: loss (she wasn't at the meeting)
- **What tells me:** At 5:00 the player is in the kitchen by the microwave, with a worried thought bubble. The boss and both coworkers have "👉 her face" bubbles. The end picture has a red border and a different setting: a meeting room with a city-view window and a clock. The board shows her, and the others point at an empty yellow chair outlined in red dashes. The icons read: empty seat 👉 her face.
- **Does the end match?** Yes.
- **What broke:** She was away in the kitchen at 5:00, and the board was never changed.

### Run 10: loss, but the end picture doesn't fit
- **What tells me:** The pictures are the same as run 8: the last moments look like run 1, but the end picture is the teal-woman-and-papers scene.
- **Does the end match?** No. This is the same problem as run 8.
- **What broke:** I can't tell.

### Run 11: loss (put on the Saturday shift)
- **What tells me:** First she is grinning next to the teal-shirt woman. Then she is at the board, which still shows her face, and goes 😩. The end picture is the same Saturday-desk loss as run 1.
- **Does the end match?** Yes.
- **What broke:** I can't tell what she was doing with the teal-shirt woman. Whatever it was, the board didn't change.

### Run 12: loss (put on the Saturday shift)
- **What tells me:** She is grinning by the green-shirt man's desk. Then she is at the board, which still shows her face, and goes 😩. The end picture is the same Saturday-desk loss as run 1.
- **Does the end match?** Yes.
- **What broke:** I can't tell what she was doing at his desk, and the board was never changed.
- **Mismatch:** The captions say 5:01 and 5:02, but every picture shows 5:00.

### 2-judge: report.md

Verdict: fixable

- Run 1: clear. She did nothing and stayed on the board. The reader saw her face read out at 5:00, then the Saturday desk card.
- Run 2: clear. She wrote in plain sight and was caught. The reader saw the starburst, then the caught card with the half-drawn face.
- Run 3: clear. She won through the microwave ding. The reader saw Kev's face read out, Kev 😩, her 🎉, and the green card.
- Run 4: wrong. She wrote twice and put the boss's own face on the board. The reader saw "caught, unclear how". The boss's face never shows on the board, there is no 😳 beat, and the icons are ✏️ + boss + 😠 + her, which reads as the caught card.
- Run 5: clear. She wrote after the ding had passed and was caught. The reader saw the same starburst and caught card as run 2.
- Run 6: unclear. This was the copier trap: looking toward the copier, the boss looked straight through the board. The reader got "caught" but read the cause as "the copier pulled Kev, not the boss; his cone was on the board anyway."
- Run 7: clear. She won through the phone. The reader saw the same win as run 3.
- Run 8: wrong. Lin told on her earlier, and at 5:00 her face was still on the board, so she lost the Saturday reading. The 5:00 frames build up that loss, but the end card is the told-on scene (Lin ❗👉, paper pile) instead.
- Run 9: clear. She wrote at the ding but was in the kitchen at 5:00, so she was blamed. The reader got "she wasn't at the meeting" but thought the board was never changed.
- Run 10: wrong. She wrote Kev's face, then Lin saw a second write, and the boss put her face back. The reader saw run 8's told-on card. The last frames never show Kev's face being wiped and hers drawn back.
- Run 11: clear. She stood idle and stayed on the board. The reader saw the Saturday desk card.
- Run 12: clear. She did everything except write on the board. The reader saw the Saturday desk card.

## Earlier problems
- E1: still there (blocker). In runs 8 and 10 the end card is still the told-on scene with Lin 👉 and papers, at 5:00, right after the frames that build up the Saturday reading. The card contradicts the moment before it, and run 10 still shows no Kev→her swap.
- E2: still there (blocker). In run 4 the boss's face never appears, there is no 😳, and the icon row is still ✏️ + boss + 😠 + her. The card does show her full face, not a half-drawn one, but a player can't tell that apart from caught. The Lin/Kev 👀👉 tell is only dotted lines in frame 18.
- E3: still there (should). In run 6 the starburst is already up before the beep frame. There is no orange 🖨️ line that stops on her and no 🖨️→😳 beat, so the reader blamed the copier for failing to pull the boss. It isn't a blocker: the outcome reads right and the lesson (the boss still saw the board) isn't false. It just misses the "looking through the board" point.

## Problems
- should: In run 9 (blamed), the boss's wipe-and-redraw (✏️) doesn't show in the last frames or on the card. The reader concluded her write never happened, so the player can't tell that the write worked and only being away broke it. — On the 5:00 frame, show the boss's ✏️ bubble at the board with Kev's face half-wiped. On the card, lead the icon row with Kev's face crossed out → empty seat → her face.
- nit: On run 4's frame 18, two dotted lines run from Lin's and Kev's desks to a frame at the glass wall. They read as sight lines, not as "they told him", so the run is cluttered for no gain. — Replace them with 👀👉 her bubbles over Lin and Kev, as the design describes.

<!-- /cold-read:outcomes -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"d22f387","hash":"61e32f01c32dbfefd9783ce353cd14bb4c7fe46afd289e3aebe9c103ccf6ceb3","parts":{"card":"cb6c1cffc263704dae616f6456b879413fb4e95f1d6d147e02dd70603b3d3c8e","shots":"ec89136eb35ec7c93d3aeeeae668db479c24f8211b3cd3f8eebf7224296feea1","pictures":"cef48bd71f72337f7f93fffef6119398838f85a668b2f3c548695f692caecb51","prompts":"373358f2a720c528dbf043178a7e12d5e465c477911cb7d1ae56f78e1d3c10a4"},"model":"default","problems":{"blocker":5,"should":9,"nit":4}} -->
## pictures: fixable
Recorded 2026-11-15 at commit d22f387, by claude -p (model: default). Inputs 61e32f01c32d: the card, shots.js, the rendered shots, the pass's prompts.
Problems: 5 blocker, 9 should, 4 nit.
Earlier problems: 6 fixed, 14 still there, 1 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 111 s | $0.59 |
| 2-compare | report.md | 191 s | $0.87 |
| all | | 302 s (the steps add up to 302 s) | $1.46 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: The markers in the tray are still specks, and the black meter still has no fill. The reader asks about it again. (recurring: premise-level?) (The vertical meter now fills and the reader reads it. The two markers in the tray are still specks nobody mentions, so "marker gone from the tray" (17, 21) never registers.)
- E2 fixed: The rings are gone, but the boss's cone toward the copier is still too pale to notice. (recurring: premise-level?) (20 now shows the boss's cone gone orange and his bar filling on you, and the reader concludes "the copier noise doesn't pull the boss away.")
- E3 still there: Lin's cone over the player in 07 is still neutral teal. (recurring: premise-level?) (In 12, Lin's cone covers you at the board in plain neutral teal, and the reader reads it as a free window.)
- E4 fixed: The coffee carry-over is gone, but the reader still asks what the fast-forward icon means (08). (recurring: premise-level?) (In 14 the reader reads the fast-forward button as "waiting is allowed.")
- E5 still there: The round portrait still reads as a picker (10). (recurring: premise-level?) (The round pop-up still reads as a picker ("faces cycle"), but what it implies, writing over the board again, is right.)
- E6 still there: The same round frame comes back in 11 and 17. (recurring: premise-level?) (It's the same round frame in 09, 10 and 16; this is the same problem as E5.)
- E7 still there: In 13, Lin's cone over the player has no red and no "?", so the reader thinks the window is open. (recurring: premise-level?) (In 12, 16 and 10, Lin's cone sits on you with no colour change and no "?" until the frame where she's already caught you (17), so the reader takes those moments as safe.)
- E8 still there: The fish now shows in the window, but Kev's wavy lines (09, 15) are still unexplained. (recurring: premise-level?) (Lin's motion lines (06, 08) and Kev's (14) are still unexplained ("the teal woman has little motion lines"), but they mislead nobody about a route.)
- E9 still there: The half-drawn face still reads as "a half-drawn mess" (18) and "scribbled" (33). (recurring: premise-level?) (The writing in progress reads as "a scribbled-out head" (17, 30). The player never learns that writing takes time, so they'll try it in windows that are too short.)
- E10 fixed: 21 tells the player the copier route works. The boss's cone and meter don't react, and the dashed line says he looks away. The reader's story lists the copier as a working distraction. — In 21, turn his cone red on the player, fill his meter, and move his "?" from the copier to the player. (20 reads as a failure.)
- E11 still there: 17 was taken at 4:39, after the phone window it should show. Lin is already walking back, and 18 at the same 4:39 shows her catching you. — Retake 17 at about 4:36, while Lin is at the microwave. (This is now 16 (and 10). At 4:39 the "nobody looking" shot has Lin's cone on you. Retake at about 4:35–4:36.)
- E12 fixed: Writing the boss's face in (28 → 31) reads as being caught. The reader can't tell 31 from 33, so they'll keep trying that route more sneakily. — In 31, draw the boss jabbing at his own face, then at you, with a "boss face + ❌" icon. Give 33 a 👁 icon. (The reader tells 28 (pencil, boss, angry, me, after the witnesses in 25) apart from 30 (caught early).)
- E13 fixed: In 25–28 the player stands touching the board beside the boss, so 27 reads as "swap at the last second". He holds the only marker, so that route doesn't exist. — Seat the player in the outlined meeting chair in 25–28. (In 22–25 the player sits in the meeting chair.)
- E14 no longer applies: In 22 the boss's full cone sweeps the board, but the intent says he is head-down in his folder and not looking. The player will skip a window the builder meant to teach. — While he reads, shrink his cone to a stub over the folder. (22 no longer claims the boss is head-down in his folder.)
- E15 still there: 23 hides the marker in the boss's hand, so the player doesn't learn that the board is locked from 4:52. — Draw an oversized marker in his raised hand and an empty slot in the tray. (The boss's marker in 22–26 is a tiny white stub, and nothing shows the tray empty, so "the board is locked once he has the marker" is never taught.)
- E16 still there: 20 puts the player at Kev's desk, which suggests a desk interaction. — Retake with the player at their own desk or at the board. (In 19 the player stands at Kev's desk.)
- E17 still there: Lin's pulled-out chair is drawn tipped on its side (14, 15, 24). — Draw it upright, pulled out and turned. (Lin's chair is drawn tipped over (13, 14, 16, 21), and the reader reads it as "knocked over.")
- E18 fixed: 34's city window is the only sign of "Friday", so the reader asks if it's the same day. — Light Friday's box on the board and use a dusk sky. (31's wall clock at 5:00 and city view tell Friday's meeting apart from the Saturday cards, and the reader places it correctly.)
- E19 still there: 33's half-drawn face is Kev's, but the intent says the boss's. — Retake with the boss's face, or correct the intent. (In 30 the half-drawn face has Kev's spiky hair, but the intent says the boss's face.)
- E20 still there: The red down-arrow jumps from your desk (01) to the copier (04) and means nothing the player can learn. — Remove it, or make it one consistent marker that is explained once. (The red down-triangle sits over your desk (01) and over the copier (04), and the reader asks about it twice.)
- E21 still there: In 29 the boss still points at Kev's face while you're away. 34 then shows your face back on the board with no visible beat. — When your chair is empty at 4:59, have the boss turn from the board to the outlined chair. (In 26 the boss points at Kev while you're away, and then 31 shows your face. The reader flags this as a contradiction ("when does absence matter?"). Fix: at 4:59, with your chair empty, have the boss turn from the board to the dashed chair with a "?" and have your face flip back onto the board on screen.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The markers in the tray are still specks, and the black meter still has no fill. The reader asks about it again. (recurring: premise-level?)
- E2 [blocker] Lin's cone over the player in 07 is still neutral teal. (recurring: premise-level?)
- E3 [blocker] In 13, Lin's cone over the player has no red and no "?", so the reader thinks the window is open. (recurring: premise-level?)
- E4 [should] The fish now shows in the window, but Kev's wavy lines (09, 15) are still unexplained. (recurring: premise-level?)
- E5 [blocker] The half-drawn face still reads as "a half-drawn mess" (18) and "scribbled" (33). (recurring: premise-level?)
- E6 [blocker] 17 was taken at 4:39, after the phone window it should show. Lin is already walking back, and 18 at the same 4:39 shows her catching you. — Retake 17 at about 4:36, while Lin is at the microwave. (recurring: premise-level?)
- E7 [should] 23 hides the marker in the boss's hand, so the player doesn't learn that the board is locked from 4:52. — Draw an oversized marker in his raised hand and an empty slot in the tray. (recurring: premise-level?)
- E8 [should] 20 puts the player at Kev's desk, which suggests a desk interaction. — Retake with the player at their own desk or at the board. (recurring: premise-level?)
- E9 [should] Lin's pulled-out chair is drawn tipped on its side (14, 15, 24). — Draw it upright, pulled out and turned. (recurring: premise-level?)
- E10 [should] 33's half-drawn face is Kev's, but the intent says the boss's. — Retake with the boss's face, or correct the intent. (recurring: premise-level?)
- E11 [should] The red down-arrow jumps from your desk (01) to the copier (04) and means nothing the player can learn. — Remove it, or make it one consistent marker that is explained once. (recurring: premise-level?)
- E12 [blocker] In 29 the boss still points at Kev's face while you're away. 34 then shows your face back on the board with no visible beat. — When your chair is empty at 4:59, have the boss turn from the board to the outlined chair. (recurring: premise-level?)
- E13 [should] In 06 Lin's cone has already swung east onto the player at 4:09, so the board looks partly unwatched before the ding. That weakens the before/after in 07, which is the level's cleanest beat. — Keep every cone, Lin's included, on the board until the ding, and put the folder in the player's hand.
- E14 [should] In 08 the noodle cup reads as coffee ("a prop, a lure, or just me having coffee?"), so the noodle that sets up the ding has no visible payoff. — Draw an open noodle cup with noodles and chopsticks showing, steaming, with the player standing at it.

### 1-read: reading.md

# Saturday: cold read

**Card:** It's Friday at 4:00. I'm stuck working Saturday, the boss makes it official at 5:00, and I have to get out of it. Clear and funny. The card icons are a calendar and me.

**01 (4:00).** A bald boss in a suit sits in a glass office on a gold rug, and his view cone spills into the open-plan floor. On a whiteboard on an easel there's a portrait of me (red top, hair bun). Two coworkers sit at desks: a woman in teal and a spiky-haired guy in green. There's a kitchen top right, a side room with a phone top left, and a microwave and coffee on the right wall. *Means:* my face on the board is the problem. *Unclear:* the red down-triangle over my desk, the empty hand slot in the HUD, and the two dashed slots next to the "1".

**02 (4:01).** I'm at the whiteboard with an E prompt. The boss shows a red "?" and a small vertical bar fills up. His cone turns orange. *Means:* he can see the board from his desk. Touching it in front of him is risky.

**03 / 04 / 05.** E prompts at the microwave, the copier and the side-room phone. *Means:* these are my tools. *Unclear:* the red down-arrow on the copier. Is it the same mark as the one on my desk?

**06 (4:09).** The microwave glows. I'm in the middle of the floor and the boss's "?" bar is up again. *Means:* it runs on a timer, so I should get moving.

**07 (4:10).** The microwave dings with big sound rings. All three people think 😮🍜 and turn toward it, and I slip over to the board. *Means:* noise turns heads. This is the cleanest beat in the set.

**08 (4:16).** I'm at the coffee/microwave counter, and a steaming cup sits on the shelf. The teal woman has little motion lines. *Unclear:* what the cup is for. Is it a prop, a lure, or just me having coffee?

**09 (4:13).** At the board, a portrait of the green guy pops up. Smoke drifts from the microwave. *Means:* I can swap whose name goes up. That's a nasty, good joke.

**10 (4:39).** The boss has left his desk for a phone in the top-right corner, with a 😑 bubble. The portrait choice at the board is now the boss himself. The teal woman walks past carrying a mug. *Means:* faces cycle, and the boss can be the pick.

**11 (4:04).** I use the side-room phone. A dotted line arcs to the corner phone and the boss gets a ☎️! burst. *Means:* I can make his phone ring.

**12 (4:06).** He's at the corner phone with a "?" (nobody's there), and I'm at the board. *Means:* a prank call buys me time at the board.

**13 (4:30).** The teal woman walks off thinking 🐟, and her chair is knocked over. The blue fish thing has gone from her desk. *Means:* her routine is to heat fish at 4:30.

**14 (4:35).** She's at the microwave with the fish, and I'm at my desk drinking. A fast-forward button appears. *Means:* waiting is allowed.

**15 (4:34).** Boss on the phone with "?", teal at the microwave, me in the phone room. *Means:* I can stack distractions.

**16 (4:39).** I'm swapping in the green guy while she walks back with her plate. The boss is 😑 in the corner.

**17 (4:39).** The board shows a scribbled-out head. The teal woman's cone turns red, and her bubble is a board with a "?". The boss shows "? ?". A ring sits under me. *Means:* she caught me. *Unclear:* whether the scribble is a mistake or a choice I made.

**18 (4:02).** The copier is pulsing red rings. The boss and the teal woman both think of the copier, and the green guy gets up with a "!". *Means:* I jammed it and he's the one who goes to fix it.

**19 (4:07).** He's fixing the copier, and I'm standing at his empty desk. *Unclear:* why I'm at his desk. Am I sabotaging something, or hiding?

**20 (4:02).** The copier is noisy and I'm at the board, but the boss's orange cone and bar are on me. *Means:* the copier noise doesn't pull the boss away.

**21 (4:57).** The clock turns red. The boss walks out to the board, the coworkers come over thinking "?", and my yellow chair is empty with a dashed red circle. *Means:* the 5:00 meeting gathers by the board.

**22 / 23 (4:58–4:59).** Meeting. The boss points at the board, bubble 👈 + my face.

**24 (4:59).** The board shows the green guy and the boss's bubble points at him. *Means:* the swap holds if nobody objects.

**25 (4:59).** The board shows the boss. He shows himself plus 😳. Green says 👉 me, and teal says 👀👉 me. *Means:* if I go too far, the witnesses rat me out. Funny.

**26 (4:59).** The board shows green, the boss points at green, and I'm off at the microwave with my chair dashed. Odd: it works even though I'm absent?

**27: WIN.** The green guy sits at his desk on a sunny day, 😢, next to a stack of paper. Icons: pencil, green guy, 😢. A microwave stamp fills a HUD slot. *Unclear:* does the pencil mean "edited board"? What is the stamp? A badge for the method?

**28: LOSS.** My face is on the board and the boss is angry and pointing. I'm 😳. Icons: pencil, boss, 😠, me. *Means:* he caught the edit. Pencil-boss is readable.

**29: LOSS.** I'm working Saturday, 😩. Icons: calendar, me, 😩. The default ending, clear.

**30: LOSS (4:01).** The board shows a scribbled head, and the boss is angry. Ending at 4:01 means getting caught cuts the loop short. Good.

**31: LOSS (5:00).** At the meeting my chair is empty and dashed, and the boss points 👉 at me. Icons: dashed chair, 👉, me. *Means:* skip the meeting and you get picked. This seems to contradict 26.

**The story**
The boss is about to put my name on the Saturday whiteboard. Everyone has a routine: a fish lunch at 4:30, the green guy fixes the copier, the boss answers his phone. I use noise (microwave, copier, a prank call) to turn heads and empty the room, then write a coworker's name on the board instead. I have to be back in my chair by 5:00, and I can't be greedy (the boss's own face gets me ratted out).
The joke is office cowardice: you win by dumping your weekend on the guy in green, and he cries in the sunshine.

**Editor notes:** 07 and 25 are the laughs. The worst readability problems are 26 vs 31 (when does absence matter?), the pencil icon, the red triangles, and the HUD slots.

### 2-compare: report.md

Verdict: fixable

## Shots
- 01: reads. (The red triangle over the desk is carried as E20.)
- 02: reads
- 03: reads
- 04: partly. The reading is "these are my tools. *Unclear:* the red down-arrow on the copier." The intent is that you could jam the copier, and that the boss's cone reaches toward it across the board. The cue is too faint: the pale yellow cone stops short of the copier, so the reader never notices it. A red arrow sits where the reader's eye goes instead. Fix: in this shot, tint the edge of the boss's cone where it crosses the board, and drop the arrow.
- 05: reads
- 06: partly. The reading is "it runs on a timer, so I should get moving." The intent is that every sight cone still covers the board. The picture contradicts the intent: Lin's cone has swung east onto you, so the board looks half open at 4:09. There is also no folder in your hand. Fix: keep Lin facing the board with her cone on it, and put the folder in your hand.
- 07: reads
- 08: partly. The reading is "*Unclear:* what the cup is for. Is it a prop, a lure, or just me having coffee?" The intent is that the noodles are done and back on the counter, and the microwave is empty. A glyph is standing in for the prop: the small red-and-white cup reads as coffee, and you aren't next to it. Fix: draw it as a noodle cup with the lid peeled back and noodles and chopsticks showing, and stand the player at it.
- 09: reads
- 10: partly. The reading is "The portrait choice at the board is now the boss himself... faces cycle." The intent is that you wrote over the board again. The round pop-up reads as a selector (E5). The 4:39 framing also puts you inside Lin's teal cone as she walks back, with no reaction from her (E7). Fix: take the shot during the 4:35 microwave window.
- 11: reads
- 12: misread. The reading is "a prank call buys me time at the board." The intent is that the boss is on the phone but Lin, at her desk, is facing the board and her cone covers you. The cue is missing: her cone stays neutral teal, with no colour change and no "?", so the reader thinks the coast is clear (E3).
- 13: partly. The reading is "her chair is knocked over." The intent is that the chair is pushed out and turned, meaning she'll be back. The chair is drawn tipped on its side (E17).
- 14: reads
- 15: reads
- 16: wrong moment. The intent is "with nobody looking", but at 4:39 Lin is walking back and her cone covers you and the board. The reader reads it as "swapping in the green guy while she walks back", so they learn that writing in her view is safe. Retake at about 4:35–4:36, while she's at the microwave (E11).
- 17: partly. The reading is "*Unclear:* whether the scribble is a mistake or a choice I made." The intent is that you're halfway through writing: your face wiped off and Kev's face half drawn, line by line. The half-drawn face reads as a scribble, and the marker isn't visible at the board (E9, E1).
- 18: reads
- 19: partly. The reading is "*Unclear:* why I'm at his desk." The intent is about Kev kneeling and fixing the copier, and says nothing about you. A stray position is the cause: the player standing at Kev's desk suggests a desk interaction (E16).
- 20: reads. The orange cone and the filling bar on you make the failed route clear.
- 21: partly. The reading gets the gathering and the empty chair, but not the marker in the boss's hand or the empty tray (E15). Kev is also mostly hidden behind the stacked "?" bubbles.
- 22: reads
- 23: reads
- 24: reads
- 25: reads
- 26: misread. The reading is "it works even though I'm absent?" The intent is that you're away just before 5:00 and your chair is empty, which leads to 31. Cause and effect are too far apart: the boss is still pointing at Kev, and the flip to your face happens off-screen between 4:59 and the card (E21).
- 27: reads. The pencil and the stamp are only guessed at; see the nit below.
- 28: reads
- 29: reads
- 30: partly. The reading is "the board shows a scribbled head." The intent is your face wiped off and the boss's face half drawn in its place. The half-drawn face reads as a scribble (E9), and the spiky hair is Kev's, not the bald boss's (E19).
- 31: reads. The card on its own is clear; the contradiction is with 26.

## Earlier problems
- E1: still there (should). The vertical meter now fills and the reader reads it. The two markers in the tray are still specks nobody mentions, so "marker gone from the tray" (17, 21) never registers.
- E2: fixed. 20 now shows the boss's cone gone orange and his bar filling on you, and the reader concludes "the copier noise doesn't pull the boss away."
- E3: still there (blocker). In 12, Lin's cone covers you at the board in plain neutral teal, and the reader reads it as a free window.
- E4: fixed. In 14 the reader reads the fast-forward button as "waiting is allowed."
- E5: still there (nit). The round pop-up still reads as a picker ("faces cycle"), but what it implies, writing over the board again, is right.
- E6: still there (nit). It's the same round frame in 09, 10 and 16; this is the same problem as E5.
- E7: still there (blocker). In 12, 16 and 10, Lin's cone sits on you with no colour change and no "?" until the frame where she's already caught you (17), so the reader takes those moments as safe.
- E8: still there (should). Lin's motion lines (06, 08) and Kev's (14) are still unexplained ("the teal woman has little motion lines"), but they mislead nobody about a route.
- E9: still there (blocker). The writing in progress reads as "a scribbled-out head" (17, 30). The player never learns that writing takes time, so they'll try it in windows that are too short.
- E10: fixed. 20 reads as a failure.
- E11: still there (blocker). This is now 16 (and 10). At 4:39 the "nobody looking" shot has Lin's cone on you. Retake at about 4:35–4:36.
- E12: fixed. The reader tells 28 (pencil, boss, angry, me, after the witnesses in 25) apart from 30 (caught early).
- E13: fixed. In 22–25 the player sits in the meeting chair.
- E14: no longer applies. 22 no longer claims the boss is head-down in his folder.
- E15: still there (should). The boss's marker in 22–26 is a tiny white stub, and nothing shows the tray empty, so "the board is locked once he has the marker" is never taught.
- E16: still there (should). In 19 the player stands at Kev's desk.
- E17: still there (should). Lin's chair is drawn tipped over (13, 14, 16, 21), and the reader reads it as "knocked over."
- E18: fixed. 31's wall clock at 5:00 and city view tell Friday's meeting apart from the Saturday cards, and the reader places it correctly.
- E19: still there (should). In 30 the half-drawn face has Kev's spiky hair, but the intent says the boss's face.
- E20: still there (should). The red down-triangle sits over your desk (01) and over the copier (04), and the reader asks about it twice.
- E21: still there (blocker). In 26 the boss points at Kev while you're away, and then 31 shows your face. The reader flags this as a contradiction ("when does absence matter?"). Fix: at 4:59, with your chair empty, have the boss turn from the board to the dashed chair with a "?" and have your face flip back onto the board on screen.

## Problems
- should: In 06 Lin's cone has already swung east onto the player at 4:09, so the board looks partly unwatched before the ding. That weakens the before/after in 07, which is the level's cleanest beat. — Keep every cone, Lin's included, on the board until the ding, and put the folder in the player's hand.
- should: In 08 the noodle cup reads as coffee ("a prop, a lure, or just me having coffee?"), so the noodle that sets up the ding has no visible payoff. — Draw an open noodle cup with noodles and chopsticks showing, steaming, with the player standing at it.
- nit: The empty hand slot and the two dashed slots in the HUD are never explained, and in 27 the microwave stamp that fills one reads only as "a badge for the method?" — On the win card, animate the stamp flying from the drawn microwave into its slot so the slot reads as "routes found."
- nit: In 21 the two stacked "?" bubbles cover Kev, so the gathering shows only two people looking at the chair. — Offset the bubbles so Kev's head and turn toward the chair are visible.

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
