# Cold reads: weekend-shift
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:title {"verdict":"works","date":"2026-11-15","commit":"62feb3e","hash":"050b224ed261a6d371c645cf4760cfbadb92beeb50f6e05a531f23f03e017993","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","ways":"f94f71fca0abba05ab5e134721c75933bc54c34471ad0c9b89e5e55109bd3638","prompts":"65af9fd3df57210df8f56eeb50b577a184ee047ae364b9cf3e029849f7c0f685"},"model":"default","tally":{"miss":2,"near":3,"leak":0},"problems":{"blocker":0,"should":3,"nit":0}} -->
## title: works
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs 050b224ed261: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 2 miss, 3 near, 0 leak.
Problems: 0 blocker, 3 should, 0 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-guess | guesses.md | 9 s | $0.02 |
| 2-judge | report.md | 33 s | $0.09 |
| all | | 42 s (the steps add up to 42 s) | $0.11 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The card shows the board as a picture board with faces on it ("Your face is on…"). From there, drawing someone else's face over yours is one step away, so guess 2 lands on the shared ending. Fix: change "Your face is on Saturday's board." to "You're down for Saturday."
- E2 [should] "the boss reads it out" makes the boss the one to deal with, which points guess 3 at distracting him. The 5:00 reading is the real trouble, so the line can stay. Fix: if you want it further from the boss, change "At 5:00 the boss reads it out." to "At 5:00 it's read out."
- E3 [should] Guess 1 lands on the board, the right area, only by undoing the trouble. That's allowed. No change needed beyond the first fix above.

### 1-guess: guesses.md

# Guesses: how you win "Saturday"

1. **Get your face off the board before 5:00.** You might erase it, cover it or take it down. Hints: "Your face is on Saturday's board", "@player".
2. **Put a coworker's face where yours is.** Swap the photos so the boss reads out someone else's name for the shift. Hints: "Your face", "board", "reads it out".
3. **Keep the boss from reading the board at 5:00.** You could distract them, delay them or get them out of the office. Hints: "At 5:00 the boss reads it out."
4. **Be gone when it's read out.** If you aren't there to hear it at 5:00, maybe it doesn't count. Hints: "At 5:00", "reads it out".
5. **Change what day the board is for.** Swap the board or flip the calendar so it isn't Saturday's board anymore. Hints: "Saturday's board", 🗓️.

### 2-judge: report.md

Verdict: works

- Get your face off the board before 5:00: near. This matches the ending both routes share: you scribble a face over yours. It comes from "Your face is on Saturday's board". It only undoes the trouble and says nothing about how to write without being seen, which is the key step in both routes (the microwave ding and the phone call).
- Put a coworker's face where yours is: near. This is the shared ending, writing Kev's face into the box. It comes from "Your face", "board" and "reads it out". It still rests on the card's statement of the trouble, and it doesn't touch the key step of either route: turning the watchers away from the board.
- Keep the boss from reading the board at 5:00: near. It picks the right person (the boss) and the right kind of move (distract him). It comes from "At 5:00 the boss reads it out." But it aims the distraction at the 5:00 reading. The routes distract him earlier so you can write. Nothing stops the reading itself.
- Be gone when it's read out: miss. This is the "Blamed" loss, not a win. It comes from "At 5:00" and "reads it out".
- Change what day the board is for: miss. No route does this. It comes from "Saturday's board" and 🗓️.

The name "Saturday" only restates the trouble. No route's trick or effect is described with that word, so the name leaks nothing.

## Problems
- should: The card shows the board as a picture board with faces on it ("Your face is on…"). From there, drawing someone else's face over yours is one step away, so guess 2 lands on the shared ending. Fix: change "Your face is on Saturday's board." to "You're down for Saturday."
- should: "the boss reads it out" makes the boss the one to deal with, which points guess 3 at distracting him. The 5:00 reading is the real trouble, so the line can stay. Fix: if you want it further from the boss, change "At 5:00 the boss reads it out." to "At 5:00 it's read out."
- should: Guess 1 lands on the board, the right area, only by undoing the trouble. That's allowed. No change needed beyond the first fix above.

<!-- /cold-read:title -->

<!-- cold-read:sense {"verdict":"fixable","date":"2026-11-15","commit":"a9fdf89","hash":"b133f2adfe1337eb8a0e4d7a62470c1e7eb94da724005589cb20b683084cc579","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","ways":"5af38ce1645ff4ef568b37d80144b36cc26422d772c77b5240cfc348c535c66e","prompts":"016aa683a72d416a002d56cc4d9abc6f52045f2ad4e6f1862e5593ed8c3882bb"},"model":"default","tally":{"sensible":6,"stretch":2,"nonsense":1},"problems":{"blocker":2,"should":4,"nit":1}} -->
## sense: fixable
Recorded 2026-11-15 at commit a9fdf89, by claude -p (model: default). Inputs b133f2adfe13: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 6 sensible, 2 stretch, 1 nonsense.
Problems: 2 blocker, 4 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 57 s | $0.12 |
| all | | 57 s (the steps add up to 57 s) | $0.12 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The ending's own reasoning works against it. "He's reading out what he expects" means he would read out *your* name, and "he knows what it says" means a different face would surprise him. On top of that, his sight cone "lies on the board" all afternoon, yet he "hasn't looked at it since 4:00." — Fix: he filled the board in on Monday, and on a Friday afternoon he honestly doesn't remember who he put down, so he reads whatever face is in the box. Make it clear his cone is watching for *people* at the board, not reading what's on it.
- E2 [blocker] The boss reading out his own face as a win. A real boss looks at his own face, says "Very funny. Who did this?" and puts yours back. — Fix: make the boss's face a loss (he wipes it, draws yours back and glares). Or drop it, and make the second write land on Kev.
- E3 [should] The six-second look at the ding has no real reason behind it. — Fix: give it one people actually have. Nobody comes for the noodles, so heads stay turned, wondering whose they are ("Whose is that? Lin?"). An unclaimed ding holds attention. A ding someone is answering doesn't.
- E4 [should] "Stay near the board until 5:00". After a ding at 4:05, that means standing at the board for nearly an hour. A real boss whose cone is on the board would say "Don't you have work?" — Fix: only require being in the empty chair between Lin and Kev when everyone sits down at 4:55. Hanging around near the board should draw the boss's attention.
- E5 [should] Kev at 5:00. A real Kev hears his name and says "I wasn't on it." — Fix: show the protest and have the boss wave it off ("The board says Kev"), which fits "the board decides".
- E6 [should] Told on. Once Lin reports someone tampering with the Saturday board, a real boss checks the board and keeps an eye on it. Here he lets you try again with nothing changed. — Fix: after a tell, his cone stays on the board for the rest of the level, or Lin keeps a closer watch on it.

### 1-judge: report.md

Verdict: fixable

- The ding (win): stretch. Real people look up at a ding for a second, not six, and the reason given ("everyone thinks of food") is not something a person would keep staring for.
- The phone (win): sensible. Anyone answers their own ringing phone and faces the window while saying hello to a dead line. Lin is away on her own lunch errand.
- The trap (not a win): sensible. Seen from his desk, the copier is right behind the board, so looking at it means looking at you.
- Shared ending, boss's face (win): nonsense. No boss reads out his own face for Saturday without stopping.
- Shared ending, Kev's face (win): stretch. The boss "knows what it says", and Kev is sitting right there and would object.
- Fail (lose): sensible. The boss reads the list as written.
- Caught (lose): sensible. The boss sees you scribbling on the rota.
- Told on (lose): sensible. Lin has a reason to tell: if you get off, she might be next. After that, though, the boss acts as if nothing happened.
- Blamed (lose): sensible. "If you're not here, you volunteered" is a real boss move.

## Problems
- blocker: The ending's own reasoning works against it. "He's reading out what he expects" means he would read out *your* name, and "he knows what it says" means a different face would surprise him. On top of that, his sight cone "lies on the board" all afternoon, yet he "hasn't looked at it since 4:00." — Fix: he filled the board in on Monday, and on a Friday afternoon he honestly doesn't remember who he put down, so he reads whatever face is in the box. Make it clear his cone is watching for *people* at the board, not reading what's on it.
- blocker: The boss reading out his own face as a win. A real boss looks at his own face, says "Very funny. Who did this?" and puts yours back. — Fix: make the boss's face a loss (he wipes it, draws yours back and glares). Or drop it, and make the second write land on Kev.
- should: The six-second look at the ding has no real reason behind it. — Fix: give it one people actually have. Nobody comes for the noodles, so heads stay turned, wondering whose they are ("Whose is that? Lin?"). An unclaimed ding holds attention. A ding someone is answering doesn't.
- should: "Stay near the board until 5:00". After a ding at 4:05, that means standing at the board for nearly an hour. A real boss whose cone is on the board would say "Don't you have work?" — Fix: only require being in the empty chair between Lin and Kev when everyone sits down at 4:55. Hanging around near the board should draw the boss's attention.
- should: Kev at 5:00. A real Kev hears his name and says "I wasn't on it." — Fix: show the protest and have the boss wave it off ("The board says Kev"), which fits "the board decides".
- should: Told on. Once Lin reports someone tampering with the Saturday board, a real boss checks the board and keeps an eye on it. Here he lets you try again with nothing changed. — Fix: after a tell, his cone stays on the board for the rest of the level, or Lin keeps a closer watch on it.
- nit: Nothing says where Kev is looking during the phone route, and a coworker who sees his own face going onto the board would speak up. — Fix: state that Kev has his headphones on and his back to the board at 4:30.

<!-- /cold-read:sense -->

<!-- cold-read:motives {"verdict":"fixable","date":"2026-11-15","commit":"62feb3e","hash":"1b2d619ddaa8f5d541734823d95f28bab36e4b18bf6f377e7a572b3b9ae70619","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","who":"5be3e2aa497f77c98069f76b353d710c97c1e761af9e6221f3063c98c68bdeb5","prompts":"de65490055224495e93ea04458e83c9e5c1b4baff7b2b1d4d94d558a758094f4"},"model":"default","tally":{"motivated":0,"binds":1,"thin":2,"unmotivated":0,"contradicts":1,"only-you":0},"problems":{"blocker":1,"should":3,"nit":2}} -->
## motives: fixable
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs 1b2d619ddaa8: the card, premise.md's who does what, the pass's prompts.
Items: 0 motivated, 1 binds, 2 thin, 0 unmotivated, 1 contradicts, 0 only-you.
Problems: 1 blocker, 3 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 50 s | $0.11 |
| all | | 50 s (the steps add up to 50 s) | $0.11 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] At 5:00 the boss trusts the board over his own memory, but when Lin tells, he remembers exactly whose face belongs there. The route depends on his trust in the board, and a player would read it as a cheat rather than a habit. — Show the habit before it pays off. For example, at 4:00 Kev asks about the weekend and the boss, without looking up, points at the board (👈🗓️) instead of answering. Also change the tell so he redraws from the rota in his folder (📄), not from memory.
- E2 [should] The boss goes to the copier at 4:20 with no prompt, and the game doesn't say what he does during a jam: stand there cross, fetch Kev, or go back to his desk. Players will guess at the length of their window. — Give him a 📄 thought at 4:19, and have him wait at the copier, tapping his foot (😠), until Kev has fixed it.
- E3 [should] Lin has no reason on screen to tell on you. — Give her an early beat where she glances at the board, sees your face and looks relieved (😌), so her tell is clearly self-protection. Also say whether she tells while the boss sits at the board with his back to it.
- E4 [should] Kev's job as the office fixer isn't shown before the jam needs it. — At about 4:05, have him fix something small (a flickering lamp, 🔧), or put a toolbox on his desk.

### 1-judge: report.md

Verdict: fixable
- The boss: contradicts — Most of what he does has a visible reason: watching the office from 4:00 (his job), the phone (it rings), and the head-down walk to the board (📄). The problem is what he remembers. When Lin tells on you, he knows the Saturday face is yours and draws it back. But at 5:00, if the box says Kev, he reads out Kev and wins the argument by pointing at the board. A real boss who drew the face himself would say "hang on, I put you down." The 4:20 copier trip also comes with no reason on screen.
- Lin: thin — The fish lunch is shown before it happens (🐟), and she faces the board all afternoon. But nothing on screen gives her a reason to tell on you, for example that she might end up on the Saturday shift herself. The game also doesn't say whether she tells when the boss is merely "busy" (copier, phone) or when he's sitting at the board with his back to it.
- Kev: thin — The ❗ fits someone hearing a beep, but nothing shows him as "the one who fixes the machines" before the copier first jams. The player only learns it when it pays off. His 🤢 and 🙅 are fair reactions.
- The card's rule: binds — The card sets no rule. The 4:55 gathering is kept by everyone, and your empty chair is the only thing that costs anything (❓).

## Problems
- blocker: At 5:00 the boss trusts the board over his own memory, but when Lin tells, he remembers exactly whose face belongs there. The route depends on his trust in the board, and a player would read it as a cheat rather than a habit. — Show the habit before it pays off. For example, at 4:00 Kev asks about the weekend and the boss, without looking up, points at the board (👈🗓️) instead of answering. Also change the tell so he redraws from the rota in his folder (📄), not from memory.
- should: The boss goes to the copier at 4:20 with no prompt, and the game doesn't say what he does during a jam: stand there cross, fetch Kev, or go back to his desk. Players will guess at the length of their window. — Give him a 📄 thought at 4:19, and have him wait at the copier, tapping his foot (😠), until Kev has fixed it.
- should: Lin has no reason on screen to tell on you. — Give her an early beat where she glances at the board, sees your face and looks relieved (😌), so her tell is clearly self-protection. Also say whether she tells while the boss sits at the board with his back to it.
- should: Kev's job as the office fixer isn't shown before the jam needs it. — At about 4:05, have him fix something small (a flickering lamp, 🔧), or put a toolbox on his desk.
- nit: Sitting with his back to the board is an odd way to guard it, even though it fits "he watches people, not the board." — Give him a line or icon as he sits, eyes on the room (👀), so the posture reads as a choice.
- nit: Fish at 4:30 is a late lunch. — Show a 🕓 "missed lunch" beat, or make it an afternoon snack.

<!-- /cold-read:motives -->

<!-- cold-read:props {"verdict":"fixable","date":"2026-11-15","commit":"62feb3e","hash":"88cf8e7351d7c4d9a3400949d312405c3ea1a9cbc074f1779b887b219bec5ff4","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","things":"df2f74c69388e07a26a332617cf08f54bbf1cf74bb21f9ce357f45a6a32f76ec","prompts":"44c578552ef10b14806eacb8d2981fafa6587dfde947dd84849f73f8112dbba6"},"model":"default","tally":{"fits":6,"odd":2,"pointless":0,"misleading":1},"problems":{"blocker":2,"should":4,"nit":1}} -->
## props: fixable
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs 88cf8e7351d7: the card, premise.md's things in the office, the pass's prompts.
Items: 6 fits, 2 odd, 0 pointless, 1 misleading.
Problems: 2 blocker, 4 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 37 s | $0.08 |
| all | | 37 s (the steps add up to 37 s) | $0.08 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The fridge and sink look usable and aren't, and they sit right next to the microwave, which is. Players will click them and decide the kitchen is broken or that they're missing something. — Either give each one a one-line reaction ("Fridge: someone's yoghurt from March. You close it."), or draw them as flat counter fronts with no handle or tap, so they read as background.
- E2 [blocker] You can jam the copier with a paper clip, but no paper clip appears in the office. Nothing tells the player the copier can be jammed, or with what. — Add a visible paper clip pot on your desk or by the copier tray, and list it as a thing.
- E3 [should] The boss's phone is on a side table under the window, and his desk has none. That reads as staged. — Put the phone on his desk with a long coiled cord, and have him get up to stand at the window while he talks. People really do that.
- E4 [should] An internal phone in a supply room has no everyday reason to be there. — Make it a wall extension labelled "Orders / Facilities", or a phone on a shelf by the stationery order form, so it has a job of its own.
- E5 [should] The red marker lies in the tray beside the black one, but only the black one is said to be used. If the red one can't be picked up, it misleads the player. — Either let the player write with the red one (with a reaction), or leave only the black marker in the tray and draw the red line as already dry.
- E6 [should] Kev fixes the copier with a spanner. Real paper jams get cleared by opening a panel by hand, so the spanner is odd. — Have him open the side door and pull the sheet out, or use the copier's green release lever.

### 1-judge: report.md

Verdict: fixable

- The Saturday board: fits — offices do put the weekend rota on a whiteboard. A face in a box instead of a name is a little odd, but it reads well.
- The noodle cup: fits — an ordinary afternoon snack, and it gives you a plain reason to use the microwave.
- The microwave: fits — it's in an office kitchen, it looks usable, and it is. The lit window and countdown make that clear.
- The sink and the fridge: misleading — they sit right under a microwave you can use, so a player will try the fridge. It's the "coffee machine you can't use" case.
- The copier: fits — every office has one, and it looks usable. But the paper clip used to jam it isn't anywhere in the room (see Problems).
- The supply room's phone: odd — store rooms rarely have a phone. Its only job here is to let you call the boss without being seen, which points at the solution.
- The boss's phone: odd — a boss whose desk has no phone, and whose only phone sits under the window so he faces away from the office, is clearly set up for the plan.
- Lin's lunch box: fits — reheated fish in the office microwave is ordinary office life. It reads as a clue, not as something to pick up.
- The desks, chairs and plants: fits — chairs set out round the board for a 5:00 reading are a normal meeting setup.

## Problems
- blocker: The fridge and sink look usable and aren't, and they sit right next to the microwave, which is. Players will click them and decide the kitchen is broken or that they're missing something. — Either give each one a one-line reaction ("Fridge: someone's yoghurt from March. You close it."), or draw them as flat counter fronts with no handle or tap, so they read as background.
- blocker: You can jam the copier with a paper clip, but no paper clip appears in the office. Nothing tells the player the copier can be jammed, or with what. — Add a visible paper clip pot on your desk or by the copier tray, and list it as a thing.
- should: The boss's phone is on a side table under the window, and his desk has none. That reads as staged. — Put the phone on his desk with a long coiled cord, and have him get up to stand at the window while he talks. People really do that.
- should: An internal phone in a supply room has no everyday reason to be there. — Make it a wall extension labelled "Orders / Facilities", or a phone on a shelf by the stationery order form, so it has a job of its own.
- should: The red marker lies in the tray beside the black one, but only the black one is said to be used. If the red one can't be picked up, it misleads the player. — Either let the player write with the red one (with a reaction), or leave only the black marker in the tray and draw the red line as already dry.
- should: Kev fixes the copier with a spanner. Real paper jams get cleared by opening a panel by hand, so the spanner is odd. — Have him open the side door and pull the sheet out, or use the copier's green release lever.
- nit: Weekend rotas list names, not faces. A big photo box is unusual. — Show a name with a small staff-ID photo, so it still reads at a glance.

<!-- /cold-read:props -->

<!-- cold-read:joke {"verdict":"works","date":"2026-11-15","commit":"62feb3e","hash":"6e4a288399ed1ff49a3a2ad8460280768f40ef1b153673cb8f72be43a9ebaadf","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","ways":"f94f71fca0abba05ab5e134721c75933bc54c34471ad0c9b89e5e55109bd3638","prompts":"39a4e09d8b3832eea31c810e253657f2e01c7a60d02f3c780781dad0673463df"},"model":"default","tally":{"funny":4,"payoff":1,"mild":4,"chore":0,"flat":0,"undescribed":0},"problems":{"blocker":0,"should":5,"nit":1}} -->
## joke: works
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs 6e4a288399ed: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 4 funny, 1 payoff, 4 mild, 0 chore, 0 flat, 0 undescribed.
Problems: 0 blocker, 5 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 36 s | $0.11 |
| all | | 36 s (the steps add up to 36 s) | $0.11 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] the win has no end card. premise.md doesn't describe the end card, so the payoff stops on the map while every losing route gets its Saturday picture — Give it a mirror of the Fail card: Saturday, sun in the window, Kev alone at a desk with the pile of work, glaring at your face on a framed photo or the board beside him.
- E2 [should] the phone route is mild, and the 4:30 wait is a chore — Make the fish land: as it heats, green smell-lines drift across the office and people wrinkle their noses. The window you're waiting for then has its own gag, and the boss's slammed phone caps it.
- E3 [should] Caught is mild — Make the half-drawn face a picture: the top half is Kev and the bottom half is still you. The end card shows that hybrid on the board while the boss points at you.
- E4 [should] Fail is the obvious picture — Add one twist to the end card. For example, the boss has left you a sticky note on the board ("Thanks for volunteering!"), or Kev's out-of-office auto-reply is pinned up beside you.
- E5 [should] Told on is mild — Have Lin go back to her fish straight after pointing at you, eating with a smug look while your papers fly. Then the picture has a character in it, not just a penalty.

### 1-judge: report.md

Verdict: works
- The ding (win): funny — the whole office turns to stare at noodles nobody comes for, a 🍜❓ over every head, while behind them you scribble Kev's face over your own. The noodles are yours, steaming and untouched.
- The phone (win): mild — you prank-call your boss from the supply room and he goes "Hello? … Hello?" and slams it down. That's a small gag. Waiting for Lin's fish is the errand part, and the fish itself gets no joke.
- The trap (lose, leads to Caught): funny — you set up a distraction, and it points every eye in the office straight at you, marker in hand.
- Fail (lose): mild — you alone in the office on a sunny Saturday is the obvious picture. Nothing twists it.
- Caught (lose): mild — an angry boss and a half-drawn face. The half-drawn face is a joke that isn't used yet.
- His own face (lose): funny — the boss finds himself on his own weekend rota, red to the ears with his hands spread. He's the one person who knows for sure he didn't write it.
- Told on (lose): mild — Lin points, papers fly, then 20 minutes of typing. Telling on you is real office behaviour, but the picture is plain.
- Blamed (lose): funny — your empty chair, outlined in red on the floor like a crime scene, with everyone turned to look at it.
- The ending: payoff — Kev protests, and the boss points at the board: "the board says Kev, and he wrote the board." The boss backs your forgery with his own authority. That beats the obvious version, where Kev just gets Saturday. But premise.md doesn't describe the end card for the win; only the losing routes have one.

## Problems
- should: the win has no end card. premise.md doesn't describe the end card, so the payoff stops on the map while every losing route gets its Saturday picture — Give it a mirror of the Fail card: Saturday, sun in the window, Kev alone at a desk with the pile of work, glaring at your face on a framed photo or the board beside him.
- should: the phone route is mild, and the 4:30 wait is a chore — Make the fish land: as it heats, green smell-lines drift across the office and people wrinkle their noses. The window you're waiting for then has its own gag, and the boss's slammed phone caps it.
- should: Caught is mild — Make the half-drawn face a picture: the top half is Kev and the bottom half is still you. The end card shows that hybrid on the board while the boss points at you.
- should: Fail is the obvious picture — Add one twist to the end card. For example, the boss has left you a sticky note on the board ("Thanks for volunteering!"), or Kev's out-of-office auto-reply is pinned up beside you.
- should: Told on is mild — Have Lin go back to her fish straight after pointing at you, eating with a smug look while your papers fly. Then the picture has a character in it, not just a penalty.
- nit: the Blamed end card is set on Friday, while every other losing card is set on Saturday — Keep the red chair outline but add a small inset of your Saturday desk, so all the losing cards land on the same day.

<!-- /cold-read:joke -->

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"62feb3e","hash":"39c18e973968ad86534c37e3ce8db02c9bf9f8465d28cb3f1f2f371bab6f2d90","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","premise":"b686271e546d8e8a88dcd1157cd278bd0bcee959789ece82df8b6a8a74a0bb18","prompts":"5c58393913b7e65b2a850883ba5b76b503def8cbf364881b227f2fbc1d473e20"},"model":"default","problems":{"blocker":1,"should":4,"nit":4}} -->
## premise: fixable
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs 39c18e973968: the card, premise.md, the pass's prompts.
Problems: 1 blocker, 4 should, 4 nit.
Earlier problems: 5 fixed, 0 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 13 s | $0.02 |
| 2-review | report.md | 134 s | $0.62 |
| all | | 147 s (the steps add up to 147 s) | $0.64 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 fixed: At 4:50 he walks out reading his folder (📄, `cast.js:28-30`) and takes the marker without looking. (His drawn cone still passes over the board as he walks. That is listed below.)
- E2 fixed: The call now lasts 3 game minutes, about 5 seconds: ❓, ❓❓, then he slams it down (😠) (`index.js:31`, `:290`).
- E3 fixed: The name is now "Saturday", which names the trouble, and the card is the one the earlier reader suggested.
- E4 fixed: In the blamed ending the boss wipes the slot, draws your face back (✏️), then points at your chair. The board still decides (`index.js:172-176`).
- E5 fixed: After the ding the noodles go back on the counter, so the microwave is free for Lin's fish (`props.js:11-12`).

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] **The board goes dead at about 4:51 for a reason you can't see.** The boss's arrival at the board sets `rosterLocked` (`cast.js:114`), and it is never cleared. He sits facing east with the board behind him, out of his cone. A player who has learned "stay out of the cone" walks up behind him, and the board doesn't light up. Worse: ring his phone at 4:52 and he walks back to his office, ding the noodles too, and every watcher looks away. The board still does nothing, and the red marker still lies in its tray (`props.js:171`). The level's own rule (sight decides) breaks exactly where the player tests it. **Fix:** make the lock something you can see. Have him take both markers (an empty tray), and unlock the board whenever he isn't sitting beside it. Or drop the lock and let the gather's seating and cones guard the board.
- E2 [should] **The own-face ending shows that he remembers.** When he finds his own face, he redraws yours and glares at you. So he knew it was you all along, which undercuts why he accepts Kev's face without a blink. **Fix:** have him wipe the slot and look round the room, then pick whoever is standing nearest the board. Or have him redraw yours only when Lin tells him who wrote it.
- E3 [should] **You can start your noodles while Lin's fish is in the microwave.** `start_microwave` only checks `noodles === 'cold'` (`index.js:100`). Both foods then turn in one lit window while she stands in front of it. **Fix:** block the microwave while `linHeatsFish`, or have her wait her turn (⏳).
- E4 [should] **His cone sweeps the board as he walks out at 4:50**, even though he is "reading his folder". A player sees the cone pass over the new face and assumes he saw it. **Fix:** narrow or dim his cone while the `folder` animation plays.
- E5 [should] **The win depends on the board picking Kev for you.** E always writes Kev, never Lin, and nothing on screen says why Kev and not Lin. **Fix:** let the first write pick whoever is nearest the board, or show one beat that marks Kev as the easy target (a 😴 at his desk).

### 1-card: first-read.md

**Situation:** There's a board, probably a whiteboard roster, listing who works Saturday. My photo is on it. At 5:00 the boss announces the roster, and then it's official.

**Must do:** Get my face off the board before 5:00. Either remove it, swap in someone else's, or stop the boss from reading it out.

**If I fail:** I work the weekend.

**Questions:**
- You can't "read out" a face. Are there names too, or does the boss just point at photos?
- "Saturday's board" could mean the weekend roster. It could also mean a board owned by someone or something called Saturday.
- Is being on it bad? It might be weekend duty, or it might be an honor like Employee of the Month, or a wall of shame.
- The level is named "Saturday", but the loop is presumably a Friday afternoon. Is that confusing on purpose?
- Does swapping in a coworker count as a win, or is that a sabotage reading?
- The card icon reads literally "@player". Is that an unfilled placeholder?

### 2-review: report.md

Verdict: fixable

**Best thing:** from 4:50 the boss sits with his back to the board, holding its marker, smug (😏). Then he turns, looks (🧐), points at Kev's face, and when Kev says 🙅 he points back at the board (👈🗓️).

## Earlier problems
- E1: fixed. At 4:50 he walks out reading his folder (📄, `cast.js:28-30`) and takes the marker without looking. (His drawn cone still passes over the board as he walks. That is listed below.)
- E2: fixed. The call now lasts 3 game minutes, about 5 seconds: ❓, ❓❓, then he slams it down (😠) (`index.js:31`, `:290`).
- E3: fixed. The name is now "Saturday", which names the trouble, and the card is the one the earlier reader suggested.
- E4: fixed. In the blamed ending the boss wipes the slot, draws your face back (✏️), then points at your chair. The board still decides (`index.js:172-176`).
- E5: fixed. After the ding the noodles go back on the counter, so the microwave is free for Lin's fish (`props.js:11-12`).

**Deducibility check:**
- **Ding route:** everything is visible. The noodle cup is on the counter, and the microwave counts down. Every head (🍜❓) and every cone swings east for 6 seconds. The board is about 4 seconds' walk from the microwave, and you have 10.
- **Phone route:** everything is visible. You see the dotted line to his phone and his walk to the corner, and Lin leaves with her lunch box at 4:30. She is gone from 4:30 to 4:37, about 12 seconds, and walking from the supply room to the board and writing takes about 5.

## Problems
- blocker: **The board goes dead at about 4:51 for a reason you can't see.** The boss's arrival at the board sets `rosterLocked` (`cast.js:114`), and it is never cleared. He sits facing east with the board behind him, out of his cone. A player who has learned "stay out of the cone" walks up behind him, and the board doesn't light up. Worse: ring his phone at 4:52 and he walks back to his office, ding the noodles too, and every watcher looks away. The board still does nothing, and the red marker still lies in its tray (`props.js:171`). The level's own rule (sight decides) breaks exactly where the player tests it. **Fix:** make the lock something you can see. Have him take both markers (an empty tray), and unlock the board whenever he isn't sitting beside it. Or drop the lock and let the gather's seating and cones guard the board.
- should: **The own-face ending shows that he remembers.** When he finds his own face, he redraws yours and glares at you. So he knew it was you all along, which undercuts why he accepts Kev's face without a blink. **Fix:** have him wipe the slot and look round the room, then pick whoever is standing nearest the board. Or have him redraw yours only when Lin tells him who wrote it.
- should: **You can start your noodles while Lin's fish is in the microwave.** `start_microwave` only checks `noodles === 'cold'` (`index.js:100`). Both foods then turn in one lit window while she stands in front of it. **Fix:** block the microwave while `linHeatsFish`, or have her wait her turn (⏳).
- should: **His cone sweeps the board as he walks out at 4:50**, even though he is "reading his folder". A player sees the cone pass over the new face and assumes he saw it. **Fix:** narrow or dim his cone while the `folder` animation plays.
- should: **The win depends on the board picking Kev for you.** E always writes Kev, never Lin, and nothing on screen says why Kev and not Lin. **Fix:** let the first write pick whoever is nearest the board, or show one beat that marks Kev as the easy target (a 😴 at his desk).
- nit: **First-read asks how you can "read out" a face.** The card's verb doesn't match a board of photos. **Fix:** "At 5:00 the boss points it out."
- nit: **"Saturday's board" can read as a board that belongs to someone called Saturday**, and first-read wondered whether being on it might be an honour. Nothing on the card says the face means weekend work. **Fix:** "Your face is in Saturday's box."
- nit: **First-read plans to wipe the board or stop the reading.** Neither is possible: the board only accepts a new face, and nothing delays the boss. That is fair, but the first loop is wasted on it. **Fix:** none needed if the loss card makes it clear early that the board decides. Otherwise, make wiping the slot and leaving it blank a visible failure.
- nit: **The boss waits out a jammed copier.** At 4:20 he shows 😠 and then stands at it for 5 minutes while it beeps. **Fix:** have him walk back to his desk after the 😠.

<!-- /cold-read:premise -->

<!-- cold-read:verbs {"verdict":"unreadable","date":"2026-11-15","commit":"62feb3e","hash":"40ea31ab24dc93f37b2a94ce149409b42b6d27e7f99d585c794f7bdceff1969e","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","verbs":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","prompts":"5fe4336fa322fe7dfc35aa29c73709d12968a9dc9a9d8840c49fb28658c28d72"},"model":"default","tally":{"fits":0,"odd":0,"wrong":0},"problems":{"blocker":1,"should":0,"nit":0}} -->
## verbs: unreadable
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs 40ea31ab24dc: the card, the verb sheets, the pass's prompts.
Items: 0 fits, 0 odd, 0 wrong.
Problems: 1 blocker, 0 should, 0 nit.
Recorded unreadable: the report has no item lines ('- <item>: fits | odd | wrong — why').

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 16 s | $0.03 |
| 2-judge | report.md | 16 s | $0.03 |
| all | | 32 s (the steps add up to 31 s) | $0.06 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] There was nothing to review. `verbs/` is missing from both the reader's folder and mine, and `intents.md` is empty, so nobody checked whether any verb suits its object or looks like it. — Copy the labelled verb sheets into `verbs/` and the engine's verb list into `intents.md`, then run the read and this check again.

### 1-read: reading.md

I couldn't read any panels: there are no images to look at.

- The `verbs/` folder doesn't exist in my working directory (`/private/var/folders/1h/pz7vtr096cb9dbbnxyvqtpxh0000gn/T/busywork-cold-read-weekend-shift-verbs-1-read-6XvzTp`). Trying to open it returns "File does not exist."
- A search for every file (`**/*`) in that directory found nothing. A search for `**/*.png` also found nothing. The whole folder is empty.
- I'm only allowed to read inside this folder, so I couldn't look for the images anywhere else.

I have nothing to describe, and I won't guess at what the panels might show. To get a real reading, put the `verbs/` images into this folder (or point me at the folder they're actually in) and run it again.

### 2-judge: report.md

Verdict: fixable

**I could not check any verbs. This verdict covers the missing inputs only, not the verbs.**

- My folder has just two files: `reading.md` and `intents.md`. There is no `verbs/` folder, no sheets and no `earlier.md`.
- `reading.md` says the earlier reader had the same problem. Their folder (`…-verbs-1-read-…`) was empty too, so they described no panels.
- `intents.md` is empty, so there are no verbs, objects or engine changes to check against.

I can't write any `<object> / <verb>` lines. There are no objects, verbs or panels to judge, and guessing would only invent results. I didn't choose `works`, because that would claim the verbs passed, and no verb was checked. I didn't choose `broken`, because that means most verbs fail, and I have no evidence of that. I chose `fixable` because of the blocker below, which is about the missing inputs, not the game design. Please treat this report as "not judged", not as a result for this level.

## Problems
- blocker: There was nothing to review. `verbs/` is missing from both the reader's folder and mine, and `intents.md` is empty, so nobody checked whether any verb suits its object or looks like it. — Copy the labelled verb sheets into `verbs/` and the engine's verb list into `intents.md`, then run the read and this check again.

<!-- /cold-read:verbs -->

<!-- cold-read:faces {"verdict":"fixable","date":"2026-11-15","commit":"62feb3e","hash":"8c1b5cac3ba669b8601b05b20f4f7d0b7b6064632acee80538ce7264c485f845","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","checks":"a23ebdc22d95c48afbe1d5c6382842cf7e6e8357ed030108e6dc166dbe063b8b","faces":"9c72e405197df23126ea95fb6536942ce2195a86594a9c9f1d266ab75ac8bcb1","prompts":"792806ed867741690fdd3c5e6bba660e7ed4f69549357d096c5a1537a2f5f7df"},"model":"default","tally":{"clear":29,"vague":7,"misread":0},"problems":{"blocker":2,"should":4,"nit":2}} -->
## faces: fixable
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs 8c1b5cac3ba6: the card, route-checks.js, the bubbles, the pass's prompts.
Items: 29 clear, 7 vague, 0 misread.
Problems: 2 blocker, 4 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 77 s | $0.23 |
| 2-judge | report.md | 210 s | $0.81 |
| all | | 287 s (the steps add up to 287 s) | $1.04 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The document glyph (04, 30) is a pale grey page that turns into an unnameable smudge in the frame. 04 came up 16 times and drives the boss at 4:50. 30 is the phone call's whole message. A player can't tell what the boss wants or what the call was about. — Use a page with dark text lines (📄 instead of a blank 📃). In 30, add a figure to make the action clear, e.g. 📄 ➡️ 🖨️ for "print it."
- E2 [blocker] The pencil (22, 34) is the cause of a loss, and it doesn't say whether the boss saw tampering or is writing Bun in. A player won't know what got them caught. — For tampering, show the board with a ✏️ scribble, or ✏️ + ❗. For writing Bun in, show ✏️ + Bun's face.
- E3 [should] 🧐 (08) reads as either "reading" or "suspicious." If suspicion is meant, the player misses the warning. — Use 👀 for reading, or 🧐❓ (or 🤨) for suspicion.
- E4 [should] The bare pointer (10) says nobody's name. — Always pair the hand with the face of the person meant, as in 09 and 16.
- E5 [should] Nothing ties Spiky's 🤢 (03) to Teal's fish. — Use 🐟 + 🤢, or put a smell line (💨/🦨) beside the face.
- E6 [should] "📅!" (31) doesn't say what the boss remembered. — Use 📅 + Bun's face, or show the board itself instead of a calendar.

### 1-read: reading.md

I read all 36 bubbles. They come in three shapes: a **cloud** (a thought), a **rounded box with a tail** (spoken aloud) and a **yellow starburst** (an alert or shout). Three characters show up: a person with a brown bun and a red top ("Bun"), a person with spiky dark hair and a green top ("Spiky"), and a bald older man with a moustache ("Baldy").

1. Thinking: "Fish." Hungry for fish, or thinking about a pet fish.
2. "Fish, yum 😊." Either "I like fish" or "I enjoyed the fish."
3. "I feel sick." Green, queasy face. Bad fish?
4. Thinking about a blank sheet of paper with a folded corner: a document or report.
5. Smirk: "Heh, I know something," or "I got away with it."
6. Thinking: "Huh?" Confused.
7. A grey megaphone: "Announcement!" or "Listen up!"
8. Thinking, with a monocle face: "Hmm, suspicious." Inspecting someone.
9. "It's her/them, Bun." The hand here is drawn from the back. In other bubbles the hand looks different and I can't tell if that changes the meaning.
10. Pointing alone: "Over there," "You," or "Go that way."
11. Teeth-clenched grimace: "Yikes," "Awkward," or "Oops."
12. Weary, anguished face: "Ugh, I'm exhausted," or "Noooo."
13. Thinking: "When? What day?" (calendar plus question mark). Or "Did I forget a date?"
14. Starburst: "Hey! It's Bun!" Calling them out or accusing them, or warning that Bun is coming.
15. Thinking: "Noodles? Lunch?" (steaming bowl of noodles plus question mark).
16. "It's Spiky." Back-of-hand pointer.
17. "It's Spiky." Front-facing pointer. Same as 16 except for the hand. If that's meant to matter, I couldn't read it.
18. Party popper: "Celebration!" "Yay!" Or "Party time," maybe a birthday.
19. Person with arms crossed in an X: "No," "Not allowed," or "Stop."
20. "Look at the calendar," or "It's on the schedule." Maybe "A deadline."
21. "Baldy?! 😳" Shocked or embarrassed about the bald man, or "The boss is here!"
22. Pencil: "Write it down," "Sign this," or "I'm working on it."
23. "I'm angry at Bun," or "Bun made me angry."
24. "!": "Oh!" Surprise, or "I noticed something."
25. Thinking: "Printer." Need to print, or the printer is on their mind.
26. Starburst: "The phone is ringing!" or "Urgent call!"
27. "?": "What?" or "Huh?"
28. "??": "What?!" Very confused, or "What do you want?"
29. Angry face: "I'm mad."
30. "The document goes to Bun," "Bun has the papers," or "Give it to Bun." Also possibly "Bun did this paperwork."
31. Starburst: "The date! Deadline!" or "Today's the day!" The calendar seems to say JUL.
32. Thinking: "Bun? Where's Bun?" or "Who is Bun?"
33. Thinking, anxious and sweating: "Uh-oh, I'm nervous," or "I'm in trouble."
34. "It's Bun." Front-facing pointer, unlike the back-of-hand one in 9.
35. Wrench: "Something's broken, fix it," or "I'm fixing it."
36. Smile: "Happy," "Thanks," or "OK, good."

**What confused me:** there are two different pointing hands, one drawn from the back (9, 10, 16, 20) and one from the front (14, 17, 23, 30, 34). I can't tell what the difference means; 16 and 17 differ only in the hand. With the pointer, I also can't tell whether "👉 + person" means "it's them," "go to them," or "they did it."

### 2-judge: report.md

Verdict: fixable

- 01: clear — Teal is thinking about fish for lunch.
- 02: clear — Teal is enjoying their fish.
- 03: vague — Spiky feels sick. It's unclear whether the smell of Teal's fish or bad food caused it.
- 04: vague — The boss is thinking about something, but the pale grey page is a smudge at frame size (it even looks like a boot). Nobody can name it.
- 05: clear — The boss is at the board, smirking: "heh, got you."
- 06: clear — Teal is confused by the crowd at the board.
- 07: clear — The boss announces the board.
- 08: vague — The boss is inspecting the board. It could mean "reading it" or "I suspect it's been changed," and that changes the cause.
- 09: clear — The boss points left at the board: "the board says Bun."
- 10: vague — A pointer with nobody in it. It means "that one" without saying who, and the face on the board is too small to read.
- 11: clear — Bun grimaces: caught out.
- 12: clear — Bun's misery: they've been named.
- 13: clear — "Who's on the schedule?" The card's 🗓️ makes the calendar mean the board.
- 14: clear — The boss shouts: "Hey! Bun!" He has caught them at the board.
- 15: clear — Everyone smells noodles from the microwave.
- 16: clear — The boss points at the board: "it says Spiky."
- 17: clear — The boss points at Spiky: "it's you."
- 18: clear — Bun celebrates escaping.
- 19: clear — Spiky: "No, not me!"
- 20: clear — The boss: "It's on the schedule."
- 21: clear — The boss sees his own face on the board: "Me?!"
- 22: vague — The boss's pencil could mean "someone wrote on this," "I'll write you in" or "sign here." Bun loses on it.
- 23: clear — The boss is angry at Bun.
- 24: clear — Spiky spots Bun at the copier.
- 25: clear — The boss heard the printer.
- 26: clear — The boss's phone is ringing.
- 27: clear — Nobody is on the line.
- 28: clear — Still nobody: "What?!"
- 29: clear — Angry about the prank call.
- 30: vague — On the phone, the boss says "📄 → Bun." The page is the same unreadable smudge as in 04, and it could mean "Bun's paperwork," "send it to Bun" or "the list says Bun."
- 31: vague — Right after that call: "📅!" Is it "I just remembered the board" or "the deadline"? The calendar says JUL, not Saturday.
- 32: clear — "Where's Bun?"
- 33: clear — Bun is hiding and nervous.
- 34: clear — Coworkers point toward the kitchen: "Bun's over there." Alone it read "it's Bun." In the frame it means where Bun is, and both readings lead to the same result.
- 35: clear — Spiky is fixing the jammed copier.
- 36: clear — Spiky: "Fixed, good."

## Problems
- blocker: The document glyph (04, 30) is a pale grey page that turns into an unnameable smudge in the frame. 04 came up 16 times and drives the boss at 4:50. 30 is the phone call's whole message. A player can't tell what the boss wants or what the call was about. — Use a page with dark text lines (📄 instead of a blank 📃). In 30, add a figure to make the action clear, e.g. 📄 ➡️ 🖨️ for "print it."
- blocker: The pencil (22, 34) is the cause of a loss, and it doesn't say whether the boss saw tampering or is writing Bun in. A player won't know what got them caught. — For tampering, show the board with a ✏️ scribble, or ✏️ + ❗. For writing Bun in, show ✏️ + Bun's face.
- should: 🧐 (08) reads as either "reading" or "suspicious." If suspicion is meant, the player misses the warning. — Use 👀 for reading, or 🧐❓ (or 🤨) for suspicion.
- should: The bare pointer (10) says nobody's name. — Always pair the hand with the face of the person meant, as in 09 and 16.
- should: Nothing ties Spiky's 🤢 (03) to Teal's fish. — Use 🐟 + 🤢, or put a smell line (💨/🦨) beside the face.
- should: "📅!" (31) doesn't say what the boss remembered. — Use 📅 + Bun's face, or show the board itself instead of a calendar.
- nit: The calendar glyph reads JUL, but the mission is about Saturday. — Use a blank calendar header or a weekday mark.
- nit: The two pointer styles (pointing left at the board, pointing right at a person) only make sense inside the frame. Seen alone, they looked like a random art difference. — Keep the directions consistent, and when the pointer means the board, put the board's icon in the bubble.

<!-- /cold-read:faces -->

<!-- cold-read:tells {"verdict":"works","date":"2026-11-15","commit":"62feb3e","hash":"2bf7e7257ae815961c90e6866785908a8a18a3f5a02690c153f2351dadc787c7","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","checks":"a23ebdc22d95c48afbe1d5c6382842cf7e6e8357ed030108e6dc166dbe063b8b","tells":"1c1ba256f5d56c43603dafff3c7082fb53eb09a47b792bf9b3ac779664bcdc44","prompts":"2ee413d617c04a2edfddb0e81f46ebbb716599de516b98587c40b1ff1ea308b8"},"model":"default","tally":{"visible":4,"faint":1,"invisible":0},"problems":{"blocker":0,"should":3,"nit":1}} -->
## tells: works
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs 2bf7e7257ae8: the card, route-checks.js, the before and after pictures, the pass's prompts.
Items: 4 visible, 1 faint, 0 invisible.
Problems: 0 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 30 s | $0.12 |
| 2-judge | report.md | 46 s | $0.17 |
| all | | 77 s (the steps add up to 77 s) | $0.29 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] In 05 neither phone looks like a phone. The player's handset is read as a speaker, and the dotted arc suggests a thrown object rather than a call. The boss's phone is hidden under the noise burst. A player who doesn't know it's a phone call can't plan the "ring the boss while Lin heats her fish" route. Fix: lift the handset off its cradle when used, with a coiled cord. Replace the arc with a 📞 bubble over the player and ringing waves around the boss's phone. Shake the boss's phone visibly and don't let the burst cover it.
- E2 [should] In 02 the ding ends in the same frame the face is put on the board. The rings and all three "🍜?" bubbles vanish at that moment, so a player may conclude that touching the board makes people stop watching. The actual lesson is that the ding is your window. Fix: let the rings fade over a beat after the ding. Show each head turning back from the microwave one at a time with a small arrow, separately from the board interaction.
- E3 [should] In 04 only the right-hand worker visibly turns toward the copier. The boss gets just an ambiguous orange line, and the middle worker shows nothing. The "every head turned toward it" mirror fail needs the player to see that everyone is looking away from the board. Fix: give every watcher who hears the copier the same "!" and a head turn toward it, with matching lines. Make the boss's reaction a clear turn behind the glass, not a stray line.

### 1-read: reading.md

**01** (player at about 877,363): The player turns to face the wall appliance that was highlighted with the E prompt. It looks like a microwave. Before, it is dark. After, it looks lit or open, with a food-like icon inside. The hand box is empty in both halves, so nothing was put in from inventory. Nobody reacts. My guess is the player started the microwave.

**02** (player at about 340,360): The portrait on the easel board changes. Before, it shows a red-haired woman, who looks like the player. After, it shows a dark-haired man, probably the worker at the right desk. Before, the boss and both desk workers have "🍜?" thought bubbles with arrows, and the microwave is giving off big pulsing rings. After, the bubbles and the rings are gone. I think the player switched the face on the board. I can't tell whether that also cleared the bubbles or whether the microwave just finished on its own.

**03** (player at about 340,360): The board's portrait changes again, from the dark-haired man to a bald man who looks like the boss. Nothing else is visibly different. The player cycled the portrait to the next person.

**04** (player at about 240,492): The photocopier was highlighted with E. After, it is spitting out paper with a burst or spark effect. A red dashed line runs from it to the right-hand desk worker, who now has a "!" over their head. An orange dashed line runs toward the boss's office. The player jammed or messed with the copier, and the right-hand worker noticed. The boss may be linked to it as well.

**05** (player at about 140,233): The black object next to the player was highlighted with E. It might be a speaker or a radio. After, it is tilted. A dotted arc runs from it to the matching object in the top-right corner of the boss's office, and that one now shows a big burst of noise lines. The boss gets a red "!" burst and has turned. The worker at the bottom-right desk seems to stir too. The hand box is still empty. I think the player set off a noise in the boss's office from a distance, but I can't tell how: by throwing something, aiming the object, or using it as a remote.

### 2-judge: report.md

Verdict: works

- 01.png: visible. The player started the microwave. The reader saw it go from dark to lit with food inside, saw the hand box stayed empty, and guessed "started the microwave." That's right.
- 02.png: visible. The player put Kev's face on the roster board, and the reader saw the portrait switch from the player to the dark-haired man at the right desk. In the same frame the microwave's pulsing rings and everyone's "🍜?" bubbles disappear. The reader couldn't tell whether the board caused that or the microwave finished on its own.
- 03.png: visible. The player put the boss's face on the board. The reader saw it change from the dark-haired man to the bald man and matched it to the boss. Reading it as "cycling to the next person" amounts to the same thing.
- 04.png: visible. The player jammed the copier. The reader saw it spit paper with a spark, saw the right-hand worker look over with a "!", and saw an orange line running toward the boss's office. The reader was only unsure whether the boss was involved.
- 05.png: faint. The player rang the boss's desk phone from the phone next to them. The reader got the effect: a noise in the boss's office, and the boss reacting with a "!". But the reader called the object "a speaker or a radio" and couldn't say if it was thrown, aimed or used as a remote. The dotted arc looks like something being thrown.

## Problems
- should: In 05 neither phone looks like a phone. The player's handset is read as a speaker, and the dotted arc suggests a thrown object rather than a call. The boss's phone is hidden under the noise burst. A player who doesn't know it's a phone call can't plan the "ring the boss while Lin heats her fish" route. Fix: lift the handset off its cradle when used, with a coiled cord. Replace the arc with a 📞 bubble over the player and ringing waves around the boss's phone. Shake the boss's phone visibly and don't let the burst cover it.
- should: In 02 the ding ends in the same frame the face is put on the board. The rings and all three "🍜?" bubbles vanish at that moment, so a player may conclude that touching the board makes people stop watching. The actual lesson is that the ding is your window. Fix: let the rings fade over a beat after the ding. Show each head turning back from the microwave one at a time with a small arrow, separately from the board interaction.
- should: In 04 only the right-hand worker visibly turns toward the copier. The boss gets just an ambiguous orange line, and the middle worker shows nothing. The "every head turned toward it" mirror fail needs the player to see that everyone is looking away from the board. Fix: give every watcher who hears the copier the same "!" and a head turn toward it, with matching lines. Make the boss's reaction a clear turn behind the glass, not a stray line.
- nit: The microwave in 01 and the faces on the board in 02 and 03 are only a few pixels across. The reader read them correctly, but only by reasoning it out. Fix: briefly enlarge or pop each one when it changes, e.g. a puff of steam when the microwave starts and a flash on the board when the face changes.

<!-- /cold-read:tells -->

<!-- cold-read:outcomes {"verdict":"fixable","date":"2026-11-15","commit":"62feb3e","hash":"fdbba28619af4c452e0ba1a8270ecdde41832413eeda318d284dec316e263fcf","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","checks":"a23ebdc22d95c48afbe1d5c6382842cf7e6e8357ed030108e6dc166dbe063b8b","ways":"f94f71fca0abba05ab5e134721c75933bc54c34471ad0c9b89e5e55109bd3638","ends":"cd7cb1a8ce957413cb9a8c506e8ebf8ebe3c896e34d1b3675003d0d3388a875f","prompts":"4674acc3564ead9bed4c64f3dc5f4cd4a107d973bb46df050932f3d48c8d188c"},"model":"default","tally":{"clear":7,"unclear":1,"wrong":3},"problems":{"blocker":2,"should":1,"nit":1}} -->
## outcomes: fixable
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs fdbba28619af: the card, route-checks.js, premise.md's ways to win and lose, the runs' last frames, the pass's prompts.
Items: 7 clear, 1 unclear, 3 wrong.
Problems: 2 blocker, 1 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 126 s | $0.52 |
| 2-judge | report.md | 73 s | $0.29 |
| all | | 199 s (the steps add up to 199 s) | $0.81 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In runs 8 and 10 the end card shows the told-on punishment (Lin ❗👉, paper pile) instead of the ending that just played. The 5:00 picture builds up the Saturday board loss, and the card contradicts it. A player learns that "Lin" is a separate kind of loss, and never learns that her face on the board is what lost. — Show the red Saturday card (sunny window, her face on the board) in every board loss. Put Lin's 👉 face in the card's cause row. For run 10, also show a small strip on the board of Kev's face wiped off and hers drawn back.
- E2 [blocker] Run 4's "own face" ending reads as "caught". The card's icon row starts with ✏️ and then the angry boss, which is the same vocabulary as the caught card in runs 2, 5 and 6. The boss's face never appears on the board in the final pictures or on the card. A player won't learn that writing a second time is what broke it. — In the card scene, show the boss's own face in the Saturday box, half wiped, with the boss red-faced 😳. Lead the icon row with that board (board with the boss's face → ✏️ → her face), and keep the pencil-plus-angry-boss pairing for "caught" only.
- E3 [should] In run 6 the trap's cause doesn't read. The boss's 🖨️ dashed line to the copier passes right through her at the board, but against his red cone it looks like he was simply watching her the whole time. — Draw his look as a bright orange line that stops on her. Pop a 🖨️→😳 beat over his head as she comes into view. On the card, put the copier directly behind her in the boss's line of sight.

### 1-read: reading.md

# reading.md: how each loop ended

**A few things that hold for all runs.** A red-bordered end card means a loss and a green-bordered one means a win. The player is the woman in red with her hair in a bun. In runs 1, 8, 10 and 11, she is at a desk in one picture and standing at the board in the next, with the clock reading 5:00 in both. It looks like the boss calls her up to the board for the reading.

---

**Run 1: Caught? No. Lost to the board (the Saturday shift).**
At her desk (bottom-left) she has a toothy grin, with a small yellow object at her feet. Next she's at the easel board with her own face on it, wearing a miserable face, while the bald boss points. The end card shows her stuck at a desk while the sun shines outside, with her face on the board.
**Match:** yes.
**What broke:** her face never left the board. Whatever the yellow object was for, I can't see it doing anything.

**Run 2: Caught.**
At 4:01 she's standing at the board inside the boss's red view cone. He can see through the glass wall. He bursts out with "! 👉 her". The end card shows the board with her face scribbled over with marker, an angry boss and a pencil icon.
**Match:** yes. The caption says 4:02 but the clocks show 4:01.
**What broke:** she drew on the board where the boss could see her through the glass.

**Run 3: Win.**
The board shows the face of the spiky-haired man in the green jacket. She has a party bubble, and he has a crying bubble. The end card is green-bordered and shows him at the Saturday desk. Her item slot is filled with a glowing badge/ID card.
**Match:** yes. The board already shows his face in the 5:00 pictures.

**Run 4: Caught.**
At 5:00 she's at the board. The boss's bubble is a pencil, and then "😠 👉 her". The end card shows the angry boss and a pencil, then the boss's face, then hers. The board on the card shows her clean, unmarked face.
**Match:** mostly. The card says she was caught with a pencil, but no scribble shows on the board, which is unlike run 2.
**What broke:** she was still at the board when the boss arrived to read it. I can't tell whether he caught her in the act or spotted pencil marks.

**Run 5: Caught.**
This is the same as run 2 at 4:11. She stands just right of the board inside the boss's red cone, he gives the "!" burst, and the end card shows the scribbled face, the angry boss and a pencil. Something glows by the microwave, but she never used it.
**Match:** yes.
**What broke:** she tampered with the board in plain view of the boss's office.

**Run 6: Caught.**
The copier gives off sound rings and then a red starburst, as if it jammed. The coworkers' dotted lines turn toward it. The boss's red cone stays on her at the board, and he gives the "!" burst. The end card is the same scribbled-face, angry-boss card.
**Match:** yes. However, the "!" burst already shows in the 4:02 picture, before the caption's "you hear a sound" at 4:03. Both pictures read 4:02.
**What broke:** the copier distraction. It pulled the coworkers but not the boss, or it went off too late.

**Run 7: Win.**
This is the same as run 3. The man in the green jacket is on the board and on the green-bordered card, with a crying face, while she has a party bubble. This time the filled slot holds a dark boxy object, like the black chairs/heaters in the corners, not the badge.
**Match:** yes.

**Run 8: Something else (paperwork).**
The game pictures are nearly identical to run 1: her face is on the board and the boss points at her. But the end card shows no board and no Saturday window. Instead, the woman with glasses and a black bun in a teal top points at her, "! 👉", while she's buried under a tower of paper.
**Match:** no. In the last moments, the teal woman just stands near the boss. Nothing shows her turning on the player.
**What broke:** I can't tell.

**Run 9: Something else (absent from the 5:00 meeting).**
She's off by the microwave/fridge with a worried thought bubble. An empty yellow chair has a red dashed outline, and the boss and both coworkers have "👉 her" bubbles. The end card shows the empty chair in dashes, the boss pointing at the board with her face, and a city skyline outside, not a sunny Saturday.
**Match:** yes.
**What broke:** she wasn't in her seat for the reading, and her face was still on the board.

**Run 10: Something else (paperwork).**
At 4:59 she's at her desk while the boss says "👈 her". There's a dashed red chair outline near the teal woman. At 5:00 she's at the board, miserable. The end card is the same as run 8's: the teal woman points at her under the pile of paper.
**Match:** no. The 5:00 picture sets up the board, and the card shows something else.
**What broke:** possibly something to do with the dashed chair near the teal woman, but I can't tell.

**Run 11: Lost to the board (the Saturday shift).**
She grins at the green-jacket man's desk (right). Then she's at the board, miserable, with her own face on it. The end card is the red-bordered Saturday card with her at the desk.
**Match:** yes. All three clocks show 5:00, but the captions say 5:00, 5:01 and 5:02.
**What broke:** whatever she was doing at his desk didn't swap the faces. Her face stayed on the board.

### 2-judge: report.md

Verdict: fixable
- Run 1: clear — She did nothing and lost to the board. The reader saw her face still on the board and the Saturday card.
- Run 2: clear — She wrote on the board in plain sight and got caught. The reader saw the boss's "!" burst through the glass and the scribbled-face card.
- Run 3: clear — She won with the ding. The reader saw Kev's face on the board, Kev crying, and the green card.
- Run 4: wrong — She wrote twice, so the boss found his own face on the board, wiped it and drew hers back. The reader saw the boss's ✏️ bubble, then "😠👉 her", then a card led by a pencil, which they read as "caught". Nothing on screen or on the card shows his face on the board or his 😳.
- Run 5: clear — She wrote before the ding and got caught. The reader read it right.
- Run 6: unclear — The copier trap: the boss looked at the copier and saw her at the board in front of it. "Caught" reads right. But the reader decided the copier "pulled the coworkers but not the boss, or went off too late", which is the wrong cause.
- Run 7: clear — She won with the phone. The reader read it right.
- Run 8: wrong — She rang the phone while Lin was at her desk, Lin told on her, and her face was still on the board at 5:00, so she lost. The 5:00 pictures set up the board ending, with the boss pointing at her face. Then the card shows Lin pointing and a paper pile, the told-on punishment, which ways.md says is not an ending. The reader: "Match: no … I can't tell."
- Run 9: clear — She was away from the board at 5:00 and got blamed. The reader saw the red-dashed empty chair and the board showing her face again.
- Run 10: wrong — She wrote Kev's face at the ding, wrote again while Lin watched, and was told on. The boss put her face back. It ends the same way as run 8: the 5:00 board scene, then Lin's paper-pile card. The reader couldn't tell what broke. Kev's face being wiped off is never shown.
- Run 11: clear — Nobody wrote on the board, so she lost to it. The reader saw her own face still on the board.

## Problems
- blocker: In runs 8 and 10 the end card shows the told-on punishment (Lin ❗👉, paper pile) instead of the ending that just played. The 5:00 picture builds up the Saturday board loss, and the card contradicts it. A player learns that "Lin" is a separate kind of loss, and never learns that her face on the board is what lost. — Show the red Saturday card (sunny window, her face on the board) in every board loss. Put Lin's 👉 face in the card's cause row. For run 10, also show a small strip on the board of Kev's face wiped off and hers drawn back.
- blocker: Run 4's "own face" ending reads as "caught". The card's icon row starts with ✏️ and then the angry boss, which is the same vocabulary as the caught card in runs 2, 5 and 6. The boss's face never appears on the board in the final pictures or on the card. A player won't learn that writing a second time is what broke it. — In the card scene, show the boss's own face in the Saturday box, half wiped, with the boss red-faced 😳. Lead the icon row with that board (board with the boss's face → ✏️ → her face), and keep the pencil-plus-angry-boss pairing for "caught" only.
- should: In run 6 the trap's cause doesn't read. The boss's 🖨️ dashed line to the copier passes right through her at the board, but against his red cone it looks like he was simply watching her the whole time. — Draw his look as a bright orange line that stops on her. Pop a 🖨️→😳 beat over his head as she comes into view. On the card, put the copier directly behind her in the boss's line of sight.
- nit: Runs 1, 8 and 11 jump from her at the desk to her at the board with the clock reading 5:00 in both. She seems to teleport. — Show the boss's 👈 summons and her walk to the board as their own beat.

<!-- /cold-read:outcomes -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"62feb3e","hash":"3341652c47299264ef0e2395f5ad764f05993876e69c18961227e8f37c50e957","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","shots":"c2cf6fe3515b9ff8a36c32045996331249cb0df281628138d3d8b3c1bba90b16","pictures":"649d1c81ee742715eb1d7a64d09a67404c4c470bc4e8532fb3343bacce803eba","prompts":"aec8b0ca52d55d25507aa446688ac6e291c8dfe1eb20aaa1f1a815b25a9d1c44"},"model":"default","problems":{"blocker":14,"should":7,"nit":1}} -->
## pictures: fixable
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs 3341652c4729: the card, shots.js, the rendered shots, the pass's prompts.
Problems: 14 blocker, 7 should, 1 nit.
Earlier problems: 10 fixed, 9 still there, 0 no longer applies (now blockers).

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 104 s | $0.62 |
| 2-compare | report.md | 269 s | $1.07 |
| all | | 373 s (the steps add up to 373 s) | $1.69 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 fixed: The noodle cup is a clear red-and-white cup on the counter, and both phones are drawn as matching black phones.
- E2 still there: The markers in the tray are still specks, and the black meter still has no fill. The reader asks about it again.
- E3 fixed: The microwave has a door window and a plate, and the reader names it at once.
- E4 still there: The rings are gone, but the boss's cone toward the copier is still too pale to notice.
- E5 fixed: Noodles turn in the lit window, and the counter is empty.
- E6 still there: Lin's cone over the player in 07 is still neutral teal.
- E7 still there: The coffee carry-over is gone, but the reader still asks what the fast-forward icon means (08).
- E8 still there: The round portrait still reads as a picker (10).
- E9 still there: The same round frame comes back in 11 and 17.
- E10 still there: In 13, Lin's cone over the player has no red and no "?", so the reader thinks the window is open.
- E11 still there: The fish now shows in the window, but Kev's wavy lines (09, 15) are still unexplained.
- E12 still there: The half-drawn face still reads as "a half-drawn mess" (18) and "scribbled" (33).
- E13 fixed: The reader sees "fixing the copier".
- E14 fixed: The chair has a red dashed circle, both coworkers have a ❓, and the reader sees "that empty seat is mine".
- E15 fixed: When you're away at 4:59 there is no blush gag, and your chair is outlined.
- E16 fixed: The badge shows the new microwave.
- E17 fixed: Kev cries, and 😢 is in the row.
- E18 fixed: The boss points with a bare finger, with no mug.
- E19 fixed: The icon is now a whole dashed chair, and the reader reads "dotted chair".

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The markers in the tray are still specks, and the black meter still has no fill. The reader asks about it again. (recurring: premise-level?)
- E2 [blocker] The rings are gone, but the boss's cone toward the copier is still too pale to notice. (recurring: premise-level?)
- E3 [blocker] Lin's cone over the player in 07 is still neutral teal. (recurring: premise-level?)
- E4 [blocker] The coffee carry-over is gone, but the reader still asks what the fast-forward icon means (08). (recurring: premise-level?)
- E5 [blocker] The round portrait still reads as a picker (10). (recurring: premise-level?)
- E6 [blocker] The same round frame comes back in 11 and 17. (recurring: premise-level?)
- E7 [blocker] In 13, Lin's cone over the player has no red and no "?", so the reader thinks the window is open. (recurring: premise-level?)
- E8 [blocker] The fish now shows in the window, but Kev's wavy lines (09, 15) are still unexplained. (recurring: premise-level?)
- E9 [blocker] The half-drawn face still reads as "a half-drawn mess" (18) and "scribbled" (33). (recurring: premise-level?)
- E10 [blocker] 21 tells the player the copier route works. The boss's cone and meter don't react, and the dashed line says he looks away. The reader's story lists the copier as a working distraction. — In 21, turn his cone red on the player, fill his meter, and move his "?" from the copier to the player.
- E11 [blocker] 17 was taken at 4:39, after the phone window it should show. Lin is already walking back, and 18 at the same 4:39 shows her catching you. — Retake 17 at about 4:36, while Lin is at the microwave.
- E12 [blocker] Writing the boss's face in (28 → 31) reads as being caught. The reader can't tell 31 from 33, so they'll keep trying that route more sneakily. — In 31, draw the boss jabbing at his own face, then at you, with a "boss face + ❌" icon. Give 33 a 👁 icon.
- E13 [blocker] In 25–28 the player stands touching the board beside the boss, so 27 reads as "swap at the last second". He holds the only marker, so that route doesn't exist. — Seat the player in the outlined meeting chair in 25–28.
- E14 [blocker] In 22 the boss's full cone sweeps the board, but the intent says he is head-down in his folder and not looking. The player will skip a window the builder meant to teach. — While he reads, shrink his cone to a stub over the folder.
- E15 [should] 23 hides the marker in the boss's hand, so the player doesn't learn that the board is locked from 4:52. — Draw an oversized marker in his raised hand and an empty slot in the tray.
- E16 [should] 20 puts the player at Kev's desk, which suggests a desk interaction. — Retake with the player at their own desk or at the board.
- E17 [should] Lin's pulled-out chair is drawn tipped on its side (14, 15, 24). — Draw it upright, pulled out and turned.
- E18 [should] 34's city window is the only sign of "Friday", so the reader asks if it's the same day. — Light Friday's box on the board and use a dusk sky.
- E19 [should] 33's half-drawn face is Kev's, but the intent says the boss's. — Retake with the boss's face, or correct the intent.
- E20 [should] The red down-arrow jumps from your desk (01) to the copier (04) and means nothing the player can learn. — Remove it, or make it one consistent marker that is explained once.
- E21 [should] In 29 the boss still points at Kev's face while you're away. 34 then shows your face back on the board with no visible beat. — When your chair is empty at 4:59, have the boss turn from the board to the outlined chair.

### 1-read: reading.md

# Reading: "Saturday"

**Card:** My face is on Saturday's board, and the boss reads the board out at 5:00. So I have to get my face off it, or get someone else's onto it.

**Cast as drawn:** me (red top, brown bun), a bald boss in a navy suit, a coworker in a teal top with a black bun, and a man with spiky hair in a green jacket.

**01 (4:00):** I'm at my desk, bottom left. The board on the easel in the middle of the floor shows my face. Yellow and teal cones show who is looking where. *Can't read:* the red down-arrow over my keyboard. Does it mean "your desk"?

**02 (4:01):** I'm at the board with an E prompt. The boss has a "?" over a small upright bar. *Meaning:* he can see the board, so touching it in front of him is risky. *Can't read:* the bar. It looks like a suspicion meter.

**03 (4:06):** E prompt at the microwave in the kitchenette on the right.

**04 (4:00):** E prompt at the copier. The red down-arrow is now over the copier. *Can't read:* why the "my desk" arrow moved here.

**05 (4:03):** E prompt at a black phone in the small room on the left.

**06 (4:07):** The microwave is glowing, so it's running. I'm standing there.

**07 (4:10):** Microwave still running. I'm at the board and the boss's "?" bar is up again.

**08 (4:13):** Ding rings come off the microwave. All three of them think "cup of noodles ?" and arrows turn them to the right. *Meaning:* noise turns heads. The lesson is clear. *Can't read:* the fast-forward button, top right.

**09 (4:19):** A steaming noodle cup sits on the counter. The green-jacket man has wavy lines over his head. *Can't read:* the lines. Is he smelling it or annoyed?

**10 (4:15):** Everyone faces the microwave and I'm at the board. A large round bubble shows the green man's face, and so does the board. *Meaning:* pressing E cycles through faces and I can put his on.

**11 (4:16):** Same action, but the face is the boss's. His "?" bar is back up because he has turned around.

**12 (4:04):** I'm using the left phone. A dotted line runs to the boss's office and he gets a starburst bubble: phone plus "!". *Meaning:* I can phone the boss.

**13 (4:06):** The boss is on the phone in the top-right corner of his office with a "?" (nobody's there). His chair is empty and I'm at the board. Clear and funny.

**14 (4:30):** The teal woman leaves her desk with a fish container and a fish thought bubble. Her chair is knocked over.

**15 (4:35):** She's heating the fish in the microwave and I'm at my desk. *Can't read:* the white object in my hand. Is it a mug?

**16 (4:34):** The boss is on the phone again with a grey "?" while she's at the microwave. That's two distractions stacked.

**17 (4:39):** The board shows the green man and the teal woman is walking back toward me.

**18 (4:39):** I'm caught. Her cone turns red, she has a "board ?" bubble, and there's a ring at my feet. The board shows a half-drawn mess. Lesson: the boss isn't the only one watching.

**19 (4:02):** The copier is jamming, with red rings. The boss and the teal woman think "copier". The green man gets an "!" and gets up. Dotted lines show who heard it.

**20 (4:07):** The green man is fixing the copier while I'm standing by his desk. *Can't read:* why I'm at his desk. Am I swapping something there?

**21 (4:02):** Same jam, but I'm using the board while it happens.

**22 (4:50):** The clock turns red. The boss leaves his office with a paper in his thought bubble.

**23 (4:52):** The boss stands by the board with a smug 😏.

**24 (4:57):** The other two walk over with "?" bubbles. A yellow chair has a red dotted circle. *Meaning:* that empty seat is mine.

**25–26 (4:58–4:59):** It's a meeting. The boss points at the board and his bubble shows a pointing hand and my face. I'm right beside the board.

**27 (4:59):** I swap the board to the green man at the last second and the boss's pointer follows to his face. That's a strong joke.

**28 (4:59):** The board shows the boss, and his bubble is his own face plus 😳. That's the best gag here, but no ending is shown for it.

**29 (4:59):** The board shows the green man, my chair is empty, and I'm at the microwave.

**30 (end, green border):** The green man works Saturday in tears under a sunny window. Icons: pencil, his face, 😢. A microwave card fills one of the two slots. *Meaning:* that's a win, and the microwave trick is "banked". *Can't read:* the pencil. I'd guess it means "board edited".

**31 (end, red):** The boss is angry and points at me at my desk. Icons: pencil, boss, angry, me. *Meaning:* I swapped the board but he saw it.

**32 (end, red):** I work Saturday, 😩. Icons: calendar, me. This is the default loss.

**33 (end, red, 4:01):** My face is scribbled with a marker. Icons: pencil, angry, me. I was caught at the board a minute into the loop. This one matches 31 too closely and reads as the same loss.

**34 (end, red):** Meeting room with a city window and a clock at 5. The boss points at me and my chair is empty. Icons: dotted chair, pointing hand, me. *Meaning:* skipping the meeting doesn't save me. *Can't read:* why this room has a city view when the others show a sunny park. Is it the same day?

**Open questions:** the red down-arrow, the upright bar, the pencil, the two HUD slots, and what happens when the boss names himself. That last one is the funniest setup in the set and it has no ending.

**Story (five lines):**
The boss has picked me for Saturday duty, and at 5:00 he'll announce it from the board.
Noises pull people away: a microwave ding, a jammed copier, a fake phone call. That gives me windows to change the face on the board.
Anyone can catch me, not only the boss, and if I skip the meeting he picks me anyway.
The win is to frame the guy in the green jacket. He ends up working the sunny Saturday in tears.
The lesson is that noise turns heads, and the joke is office scapegoating done with a microwave.

### 2-compare: report.md

Verdict: fixable

The microwave reads now, and so do the gather chair, Kev's cost and the end-card icons. Two routes are still told wrong. The copier trap reads as a working distraction (21). Lin watching during the phone call still doesn't show (13, 07). Losing by writing the boss's face reads as just being caught (31 vs 33), and 17 was taken at the wrong moment. I checked 01–34 myself.

## Shots

- **01: partly.** Reading: "*Can't read:* the red down-arrow over my keyboard." Intent: a quiet start, with a noodle cup on the counter, two phones and Lin's lunch box. Cause: a glyph used as a prop. The arrow is the only coloured mark on the floor, so it pulls the eye, and the reader never mentions the noodles, the phones or the lunch box. Fix: drop the arrow, or keep it only where the player is told what it means.
- **02: partly.** Reading: "*Can't read:* the bar. It looks like a suspicion meter." Intent: you could *write* on the board. Cause: missing cue. The markers in the tray are specks, so nothing says "write". The meter is still a black bar with no fill. Fix: lift a big marker out of the tray when the player is close, and fill the meter red under the "?".
- **03: reads.**
- **04: partly.** Reading: "why the 'my desk' arrow moved here." Intent: the copier works, you could jam it, and the boss's cone reaches it across the board. Cause: missing cue, plus the same arrow glyph as 01. The cone is a pale wash and the reader never notices it, though it is the shot's point. Fix: draw the boss's cone with a solid tinted edge out to the copier, and take the arrow away.
- **05: reads.**
- **06: reads.**
- **07: partly.** Reading: "the boss's '?' bar is up again." Intent: both the boss's cone and Lin's cone cover you. Cause: missing cue. Lin's cone stays neutral teal over the player. Fix: turn any cone red when it covers the player, the same way the boss's does.
- **08: reads.** The noise lesson lands. The fast-forward icon is still unexplained (see E7).
- **09: reads.**
- **10: partly.** Reading: "pressing E cycles through faces." Intent: the face pops up big off the Saturday box and settles in, as ink. Cause: missing cue. A round floating portrait reads as a selection picker, and no marker stroke is shown. Fix: grow the face straight out of the red box with no frame, with the marker making a stroke.
- **11: reads.**
- **12: reads.**
- **13: misread.** Reading: "nobody's there… Clear and funny." Intent: Lin, at her desk, faces the board and her cone covers you, so the window is shut. Cause: missing cue. Lin's cone over the player stays a calm teal, with no red and no "?". Fix: turn her cone red on the player and start a "?" over her.
- **14: partly.** Reading: "Her chair is knocked over." Intent: her chair is pushed out and turned, because she'll be back. Cause: a glyph used as a prop. The sprite is a chair on its side, which nobody leaves behind in a real office, and it stays tipped through 24. Fix: draw it upright, pulled out and turned about 30°.
- **15: reads.**
- **16: reads.**
- **17: wrong moment.** The intent says "with nobody looking", but at 4:39 Lin is already walking back with her fish. 18 is taken at the same 4:39 and shows her catching you. The window this shot should show (Lin at the microwave, boss on the phone) is over by then. Fix: retake at about 4:36.
- **18: partly.** Reading: "a half-drawn mess." Intent: Kev's face half drawn over yours, line by line from the top. Cause: missing cue. The partial drawing doesn't read as a face in progress. The catch itself reads well. Fix: draw Kev's face cleanly down to a hard line, with your face still showing below it and the marker on that line.
- **19: reads.**
- **20: partly.** Reading: "*Can't read:* why I'm at his desk. Am I swapping something there?" Intent: Kev kneels at the copier, front open, spanner in hand. Cause: missing cue in the shot's staging. The player standing at Kev's desk suggests a desk interaction that isn't in the intent. Fix: retake with the player at their own desk or at the board.
- **21: misread.** Reading: "Same jam, but I'm using the board while it happens." The story then lists the copier as a working distraction. Intent: the boss looks at the copier *through* the board, so you're in plain view, and this route fails. Cause: missing cue. The boss's cone and meter don't react to the player. The dashed line points at the copier, which says "he looks away". Fix: turn the boss's cone red on the player in this beat, fill his meter, and move his "?" from the copier to the player.
- **22: partly.** Reading: "The boss leaves his office with a paper in his thought bubble." Intent: head down in a folder, so he isn't looking at the board. Cause: missing cue. His full yellow cone still sweeps across the board, which says the opposite. Fix: while he reads, shrink his cone to a short stub over the folder.
- **23: partly.** Reading: "The boss stands by the board with a smug 😏." Intent: he sits with his back to the board, holding its marker (gone from the tray). Cause: missing cue. The marker in his hand is invisible, so the player doesn't learn that the board is now locked. Fix: draw an oversized black marker in his raised hand and an empty slot in the tray.
- **24: reads.**
- **25: reads.**
- **26: reads.**
- **27: partly.** Reading: "I swap the board to the green man at the last second and the boss's pointer follows." Intent: Kev's face is on the board and the boss points at it (written earlier). Cause: missing cue. The player stands against the board beside the boss, outside the meeting chairs, which invites a last-second swap he would never allow. He holds the only marker. Fix: seat the player in their meeting chair for 25–28.
- **28: reads.**
- **29: reads.**
- **30: reads.** The reader's guess for the pencil, "board edited", is right.
- **31: partly.** Reading: "I swapped the board but he saw it." Intent: you wrote *him* in, and he knew, because he never put himself down. Cause: a cause and effect too far apart. His shock in 28 never appears on the card, and the row (pencil, boss, angry, you) reads as "caught". Fix: draw the boss jabbing at his own face on the board, then at you, and put a "boss face + ❌" icon in the row.
- **32: reads.**
- **33: partly.** Reading: "This one matches 31 too closely and reads as the same loss." Intent: caught, with the *boss's* face half drawn over yours. Cause: missing cue. The half-drawn face has Kev's spiky hair, not the boss's bald head, and the card differs from 31 by one icon. Fix: give "caught" its own 👁 icon. Retake with the boss's face, or correct the intent to Kev's face.
- **34: partly.** Reading: "why this room has a city view when the others show a sunny park. Is it the same day?" Intent: Friday 5:00, and the boss points at your empty chair. Cause: missing cue. The only hint for "Friday" is a change of window. Fix: light Friday's box on the board's day row and draw a dusk sky.

## Earlier problems
- E1: fixed. The noodle cup is a clear red-and-white cup on the counter, and both phones are drawn as matching black phones.
- E2: still there. The markers in the tray are still specks, and the black meter still has no fill. The reader asks about it again.
- E3: fixed. The microwave has a door window and a plate, and the reader names it at once.
- E4: still there. The rings are gone, but the boss's cone toward the copier is still too pale to notice.
- E5: fixed. Noodles turn in the lit window, and the counter is empty.
- E6: still there. Lin's cone over the player in 07 is still neutral teal.
- E7: still there. The coffee carry-over is gone, but the reader still asks what the fast-forward icon means (08).
- E8: still there. The round portrait still reads as a picker (10).
- E9: still there. The same round frame comes back in 11 and 17.
- E10: still there. In 13, Lin's cone over the player has no red and no "?", so the reader thinks the window is open.
- E11: still there. The fish now shows in the window, but Kev's wavy lines (09, 15) are still unexplained.
- E12: still there. The half-drawn face still reads as "a half-drawn mess" (18) and "scribbled" (33).
- E13: fixed. The reader sees "fixing the copier".
- E14: fixed. The chair has a red dashed circle, both coworkers have a ❓, and the reader sees "that empty seat is mine".
- E15: fixed. When you're away at 4:59 there is no blush gag, and your chair is outlined.
- E16: fixed. The badge shows the new microwave.
- E17: fixed. Kev cries, and 😢 is in the row.
- E18: fixed. The boss points with a bare finger, with no mug.
- E19: fixed. The icon is now a whole dashed chair, and the reader reads "dotted chair".

## Problems
- blocker: 21 tells the player the copier route works. The boss's cone and meter don't react, and the dashed line says he looks away. The reader's story lists the copier as a working distraction. — In 21, turn his cone red on the player, fill his meter, and move his "?" from the copier to the player.
- blocker: 17 was taken at 4:39, after the phone window it should show. Lin is already walking back, and 18 at the same 4:39 shows her catching you. — Retake 17 at about 4:36, while Lin is at the microwave.
- blocker: Writing the boss's face in (28 → 31) reads as being caught. The reader can't tell 31 from 33, so they'll keep trying that route more sneakily. — In 31, draw the boss jabbing at his own face, then at you, with a "boss face + ❌" icon. Give 33 a 👁 icon.
- blocker: In 25–28 the player stands touching the board beside the boss, so 27 reads as "swap at the last second". He holds the only marker, so that route doesn't exist. — Seat the player in the outlined meeting chair in 25–28.
- blocker: In 22 the boss's full cone sweeps the board, but the intent says he is head-down in his folder and not looking. The player will skip a window the builder meant to teach. — While he reads, shrink his cone to a stub over the folder.
- should: 23 hides the marker in the boss's hand, so the player doesn't learn that the board is locked from 4:52. — Draw an oversized marker in his raised hand and an empty slot in the tray.
- should: 20 puts the player at Kev's desk, which suggests a desk interaction. — Retake with the player at their own desk or at the board.
- should: Lin's pulled-out chair is drawn tipped on its side (14, 15, 24). — Draw it upright, pulled out and turned.
- should: 34's city window is the only sign of "Friday", so the reader asks if it's the same day. — Light Friday's box on the board and use a dusk sky.
- should: 33's half-drawn face is Kev's, but the intent says the boss's. — Retake with the boss's face, or correct the intent.
- should: The red down-arrow jumps from your desk (01) to the copier (04) and means nothing the player can learn. — Remove it, or make it one consistent marker that is explained once.
- should: In 29 the boss still points at Kev's face while you're away. 34 then shows your face back on the board with no visible beat. — When your chair is empty at 4:59, have the boss turn from the board to the outlined chair.
- nit: The player holds an unexplained white mug at their desk in 15 and 23. — Show it only while waiting or fast-forwarding, next to the fast-forward icon.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"62feb3e","hash":"bb3a02defdaea6e4b171a0d6790c2ea388b95a2ca727500854b07ecca744090f","parts":{"card":"bfff257f8b131dcb1153ee09488f5dad957d123415042910b62ede71063905d4","checks":"a23ebdc22d95c48afbe1d5c6382842cf7e6e8357ed030108e6dc166dbe063b8b","ways":"f94f71fca0abba05ab5e134721c75933bc54c34471ad0c9b89e5e55109bd3638","frames":"e454aed9fe0c7e1fa4686c093d43bdfcf76ee12429a4c45f5a0d8bc84c4ba972","prompts":"0db7babf26b7e22cba9cf647ea9ac480e87974eae7044717d0a6d0d4a5059fc0"},"model":"default","problems":{"blocker":3,"should":4,"nit":3}} -->
## replay: fixable
Recorded 2026-11-15 at commit 62feb3e, by claude -p (model: default). Inputs bb3a02defdae: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the pass's prompts.
Problems: 3 blocker, 4 should, 3 nit.
Earlier problems: 0 fixed, 0 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 161 s | $0.79 |
| 1-read-2 | reading.md | 171 s | $0.77 |
| 1-read-3 | reading.md | 122 s | $0.56 |
| 2-compare | report.md | 153 s | $0.57 |
| all | | 324 s (the steps add up to 607 s) | $2.69 |

### Ledger
The earlier record's open problems, as this run's reader marked them.


### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Run 3 win is only partly explained. The 🍜❓ bubble clears before the heads turn back, so the reader can't tell the ding made the write possible. — Keep 🍜❓ up exactly as long as each cone stays turned, and fade it out as the cone swings back.
- E2 [blocker] The "👢 👉 you" order is given mid-call with the handset at the boss's ear, and 👢 is also his routine "getting up" thought. The reader reads it as phone talk and thinks the forced trip to the desk was their own choice (runs 8, 10). — Boss hangs up first, then gives a 👉 you → 🖥️ order, and the player's walk follows a dotted path from it.
- E3 [blocker] The boss's check of the board after Lin's report is drawn with a contented 😊 and no 🧐/😠, so it reads as routine. A real manager told about rota tampering wouldn't stroll over smiling (runs 8, 10). — Draw a dashed line from Lin's report to the board, then 🧐 on arrival, then 😠 + ✏️ when he finds Kev's face.
- E4 [should] When Lin's report stops a write, nothing shows that it was stopped. The reader thinks the swap happened and was reverted (run 8). — Drop the marker back into the tray and erase the half-stroke with a puff when Lin's ❗ fires.
- E5 [should] In run 3 the player stands beside the board in plain view from 4:30 to 4:58 and is never sent to their desk. This contradicts the "idle in view gets you sent to your desk" rule, and it is odd office behaviour right after doctoring the rota. — Either have the boss send idlers off, or show the player visibly pretending to work (papers or a mug in hand) while they wait there.
- E6 [should] Caught end cards show marker scribble, but the marker is never seen in the player's hand (runs 2, 5). — Hold the marker in the player's hand at the board in the caught freeze frame.
- E7 [should] The 4:50 deadline sound ring comes from off-screen at the upper right, and the reader logs it as an unknown event (run 11). — Send the ring out from the wall clock and pulse the clock face red.

### 1-read-1: reading.md

# Reading: Saturday

The mission card says the player's face is on Saturday's board and the boss reads it out at 5:00. In every run the player is the red-haired person with the red ring.

## Run 1: loss (5:01)
- 4:30–4:40: The player sits at the left desk the whole loop. Teal coworker shows fish and smile bubbles. Bearded coworker shows a green-face bubble.
- 4:50–4:51: The boss gets a boot bubble, stands and walks out of the glass office.
- 4:52–4:55: The boss stands by the board with a smirk.
- 4:57–4:58: Both coworkers walk over with "?" bubbles. The boss looks at the board.
- 4:59–5:00: The boss points at the player's face. The player walks over looking upset.
- End: The player's face is on the board. They're sweating at a desk with a stack of paper and sun outside. Icons: calendar, player, tired face.

**Why it ended:** Nothing changed, so the player gets the Saturday shift. **Cause:** doing nothing. **Possible non-reactions:** none of the bubbles or walks involve the player. This looks like the boss's normal routine.

## Run 2: loss (4:01)
- 4:01: The player is at the board, and a swirl under them shows they're doing something to it. The boss and the teal coworker have "board ?" bubbles. The boss's view cone is red and covers the board through the glass.
- 4:01: The boss shows a "!" and points at the player.
- End: The player's face on the board is scribbled over in marker. The boss is angry. Icons: pencil, angry face, player.

**Why it ended:** The boss saw the player tampering through the glass. **Cause:** touching the board while it was in the boss's view. There's no "used the thing" marker, so I think the action was interrupted. I can't tell whether the player scribbled or tried to swap the photo. **Note:** The captions say 4:02, but the clock shows 4:01.

## Run 3: win (5:01)
- 4:06: The player uses the microwave.
- 4:12: A sound plays. The boss and both coworkers turn toward the kitchen with "bowl ?" bubbles. The player is already at the board, and an "E" key prompt shows.
- 4:14: The player uses the board. It now shows the bearded coworker's face. The bubbles are gone, but the boss's cone still points right.
- 4:30–4:58: The same routine as run 1. The player stands next to the board, in plain sight, the whole time.
- 5:00: The boss points at the bearded coworker. The player shows a party bubble, and the bearded coworker looks upset.
- End: The bearded coworker gets the Saturday shift. Icons: pencil, bearded coworker, crying face. The player earns a framed-photo badge.

**Cause:** swapping the board photo to the coworker's face. **Unclear:** The swap happened after the bubbles had cleared. The boss still seemed turned toward the kitchen, but I can't confirm the microwave was needed.

## Run 4: loss (5:01)
- 4:06–4:14: Same as run 3: microwave, sound, then the photo is swapped to the bearded coworker.
- 4:16: The player uses the board again. It now shows the boss's own face.
- 4:30–4:58: The normal routine. The boss stands at the board with a smirk.
- 5:00: The player steps away. The boss shows a pencil bubble, then an angry face pointing at the player.
- End: The player's face is back on the board, and the boss is angry. Icons: pencil, boss, angry face, player.

**Why it ended:** The boss found his own face and blamed the player. **Cause:** the second swap at 4:16. **Possible non-reaction:** The player walking off at 5:00 might be scripted, not a reaction to anything.

## Run 5: loss (4:11)
- 4:06: The player uses the microwave.
- 4:11: The player tampers at the board before any sound plays. The boss and teal coworker show "board ?" bubbles, and the boss's cone turns red.
- 4:11: The boss shows a "!" and points at the player.
- End: The same scribbled-face picture as run 2.

**Why it ended:** The player was seen at the board. **Cause:** going to the board one minute before the microwave went off. There's no marker, so I think the action was interrupted again. **Note:** The ending picture shows marker scribble, but nothing in the pictures shows the player using a marker.

## Run 6: loss (4:02)
- 4:01: The player uses the copier, and paper flies out. The bearded coworker shows a "!", which could be about the copier or about the player.
- 4:02: The copier makes a sound. The boss and teal coworker show copier bubbles. The boss turns left, toward the copier, which is right next to the board.
- 4:02: The player is at the board. Both show "board ?" bubbles, and the boss's cone turns red.
- 4:02: The boss shows a "!" and points at the player. The copier jams with a red burst. The captions say this sound is at 4:03, but the clock shows 4:02.
- End: The same scribbled-face picture.

**Why it ended:** The noise drew the boss's eyes toward the board's corner of the room. **Cause:** using the copier as the distraction, then tampering in the area everyone was looking at.

### 1-read-2: reading.md

# Saturday — cold read of runs 7–9

**Card:** "Your face is on Saturday's board. At 5:00 the boss reads it out." I play the red-haired woman. The board is the flip-chart stand on the left side of the open office.

---

## Run 7: win (teal-framed end card; I'm reading the frame colour as the result)

- **4:30** Teal woman has a fish thought bubble. Boss is at his desk, and his yellow view cone covers the board.
- **4:34** I use the small phone in the left room. The phone at the top right rings with a 📞! burst. Teal woman is at the kitchen microwave.
- **4:35–4:37** Boss walks to the ringing phone and shows "?" then "??".
- **4:38** I use the board. My face becomes the face of the spiky-haired man in green. Nobody's cone is on me.
- **4:40** Boss is back at his desk.
- **4:52–5:00** Boss parks by the board and points: 👉 green man. Green man shows 😩. I show 🎉.
- **End:** Green man is crying at a desk under a stack of paper. Icons: ✏️, green man, 😢. A phone icon fills one of the two slots.

**Why it ended this way:** the board named the green man, so he takes Saturday.
**Cause:** the phone call pulled the boss away, and then I swapped the photo.
**Might not be a reaction to me:** teal woman's trip to the microwave. She had the fish bubble before my call and does the same thing in run 9. That trip is also the only reason she didn't see the swap. I can't tell what the ✏️ icon means.

---

## Run 8: loss (red frame)

- **4:03** Same phone trick. Boss walks off at 4:04–4:05 with "?".
- **4:06** I use the board. Teal woman is sitting at her desk facing the board. Her cone turns red, she thinks 🗓️?, then bursts "! 👉 me".
- **4:07** Boss, still at the far phone, shows a grey boot icon 👉 me.
- **4:08** I'm back at my desk with paper on it, and the board shows my face again.
- **4:11** Boss stands at the board. My desk now has a tall paper stack.
- **4:30–4:59** The usual routine plays out.
- **5:00** Boss points 👉 at the board. I show 😩.
- **End:** Teal woman pointing, me buried in paper. Icons: teal woman, 👉, paper stack.

**Why it ended this way:** teal woman saw the swap and told on me. The board went back to my face.
**Cause:** swapping at 4:06, while she was still at her desk. In run 7 she was at the microwave by then.
**Unclear:** whether the boss's 4:11 visit to the board was a reaction to me or part of his routine. I also can't tell what the boot icon means.

---

## Run 9: loss (red frame)

- **4:06** I use the kitchen microwave.
- **4:12** The microwave rings. Boss, teal woman and green man all think 🍜? and their cones swing toward the kitchen. I'm already standing at the board.
- **4:14** I use the board, and it now shows the green man's face. Nobody sees it.
- **4:30–4:59** I stay in the kitchen the whole time. Others follow the same routine as in runs 7 and 8. A yellow chair in the meeting area gets an orange ring.
- **5:00** Everyone thinks "me?". I show a worried face. Boss shows ✏️, the board goes back to my face, and everyone points 👉 me.
- **End:** Empty chair (dashed red outline) 👉 me.

**Why it ended this way:** I wasn't at the 5:00 meeting, so the boss put my face back on the board.
**Cause:** staying away from the meeting. The microwave distraction worked, and the swap itself was never seen.
**Unclear:** why I stayed in the kitchen. The pictures don't show it.
**Might not be a reaction to me:** the orange ring on the yellow chair. In run 8 it was there while I sat at my desk and gone once I walked over. In run 7 I didn't see it while I was near the board. So it probably marks my empty seat, not anything I did.

**Not reactions, in any run:** the "?" from green man and teal woman at 4:57–4:58, and the chair being moved at 4:55. These happen in every loop.

### 1-read-3: reading.md

I've read both runs (run-10 and run-11 are the only folders) and lost on both. Here is reading.md:

---

# Saturday: cold read

**Card:** "Your face is on Saturday's board. At 5:00 the boss reads it out." So the goal is to get my face off the easel board by 5:00.

## Run 10: LOSS

- 4:06: I use the microwave on the right wall.
- 4:12: The microwave dings. The boss and both coworkers think "bowl ?". I walk to the easel board.
- 4:14: I use the board. My red-bun face changes to the bearded green-jacket coworker's face.
- 4:18: I use the phone on the left wall. The phone by the boss's office rings and the boss shows "☎️!".
- 4:20: The boss goes to that phone. I'm back at the board. The teal coworker's view cone turns red, she thinks "calendar ?", then shouts "! 👉 my face".
- 4:21: On the phone, the boss's bubble reads "white boot-shape, 👉, my face".
- 4:23: I sit at the left desk. The boss shows "calendar !".
- 4:26 to 4:30: The boss walks to the board, smiles, and my face is back on it.
- 4:51 to 4:59: Everyone gathers at the board. The boss says "👉 my face".
- 5:00: End picture: the teal coworker pointing at me, buried behind a paper stack. Icons: her, 👉, paper.

**Why I lost:** She caught me at the board, and the boss put my face back.

**What caused it:** The 4:14 swap worked. Going back to the board at 4:20, inside her view cone, got me reported. I can't tell what I was doing there; no "used" mark.

**Might not be a reaction to me:** The 4:21 phone bubble. I'd hung up, so who is the boss talking to? Also the fish and food bubbles at 4:30 and 4:40, and everyone gathering from 4:51. Run 11 shows the same things at the same times.

## Run 11: LOSS

- 4:06 and 4:12: Same microwave action and "bowl ?" bubbles as run 10.
- 4:30 to 4:40: Fish and food bubbles. I wander.
- 4:43: I use the copier. It sprays paper. The green-jacket coworker shouts "!" and dotted lines run from him and the boss to the copier.
- 4:44 to 4:45: The copier keeps making noise. The boss and the teal coworker think "copier".
- 4:47: The green coworker fixes it with a wrench. I sit at his empty desk.
- 4:51: A big red sound ring comes from the upper right. Source unknown.
- 4:52 to 4:59: Everyone gathers at the board. My face is still on it.
- 5:00: End picture: the board shows my face, and I'm stuck at a desk with paperwork while it's sunny outside. Icons: calendar, my face, 😩.

**Why I lost:** The board never changed.

**What caused it:** Nothing I did touched the board. The copier pulled him away but led nowhere.

**Might not be a reaction to me:** The 4:51 sound, and all the gathering at the board, which matches run 10.

### 2-compare: report.md

Verdict: fixable

## Runs
- Run 1 (do nothing → fail): **explained**. The reader saw that nothing changed and that the boss's walk and the coworkers' bubbles are routine.
- Run 2 (write in plain sight → caught): **explained**. "The boss saw the player tampering through the glass."
- Run 3 (ding, write Kev → win): **partly**. The reader named the swap but not the ding that kept it unseen.
- Run 4 (write twice, boss's own face → fail): **explained**. "The boss found his own face and blamed the player… the second swap at 4:16."
- Run 5 (write before the ding → caught): **explained**. "going to the board one minute before the microwave went off."
- Run 6 (copier trap → caught): **explained**. "The noise drew the boss's eyes toward the board's corner of the room."
- Run 7 (phone while Lin heats fish → win): **explained**. "the phone call pulled the boss away, and then I swapped the photo… That trip is also the only reason she didn't see the swap."
- Run 8 (phone with Lin at her desk → told on → fail): **explained**. "swapping at 4:06, while she was still at her desk." The reader still missed two real reactions, listed below.
- Run 9 (write at the ding, away at 5:00 → blamed): **explained**. "I wasn't at the 5:00 meeting, so the boss put my face back on the board."
- Run 10 (Kev at the ding, second write while Lin watches → told on → fail): **explained**. "Going back to the board at 4:20, inside her view cone, got me reported." The reader missed the sent-to-desk reaction.
- Run 11 (nobody wrote → fail): **explained**. "The board never changed… Nothing I did touched the board."

### Run 3: partly (win)
- **Reading:** "The swap happened after the bubbles had cleared. The boss still seemed turned toward the kitchen, but I can't confirm the microwave was needed."
- **What really happened:** The ding turned every head toward the kitchen. The cones were still swung east when the player wrote at 4:14. In `runs/run-03/03.png` all three cones point at the kitchen. That turn is the only reason the write went unseen.
- **Visual cause:** A missing cue, plus cause and effect too far apart. The 🍜❓ bubbles vanish while the heads are still turned. Once the "why" is gone, the turned cones look like they're just pointing somewhere. Nothing ties the open time to the ding.
- **Fix:** Keep the 🍜❓ bubble up for exactly as long as each head stays turned. Fade it out at the moment the cone swings back. Then "the bubble is up, so they aren't looking" can be read at a glance.

## Misleading beats
1. **Runs 8 and 10: the boss's "👢 👉 you" is read as phone talk or as a mystery, and being sent to the desk is read as the player's own move.**
   - **Reading:** Run 8: "I also can't tell what the boot icon means." Run 10: "The 4:21 phone bubble. I'd hung up, so who is the boss talking to?" and "4:23: I sit at the left desk."
   - **What really happened:** Lin reported the player. The boss, standing at his phone, ordered the player back to their desk to type for 20 minutes. The sit-down and the paper stack are the punishment, not the player's choice.
   - **Visual cause:** A bubble that reads as a reaction to the wrong thing. The order is drawn while the boss holds a handset with the call line still up, so it reads as part of the call. The 👢 glyph is also the boss's routine "I'm getting up" thought at 4:50 in run 1 (`runs/run-01/03.png`), so one icon means both "I'm walking" and "you, go".
   - **Fix:** Have the boss put the handset down before he gives the order. Draw the order as 👉 you → 🖥️ (desk/typewriter), not 👢. Have the player's walk to the desk follow a dotted path from the bubble.
2. **Run 8, 4:11 (and run 10, 4:26): the boss checking the board is read as routine.**
   - **Reading:** "whether the boss's 4:11 visit to the board was a reaction to me or part of his routine." Run 10: "The boss walks to the board, smiles."
   - **What really happened:** Lin's report sent him to check the board. In run 10 he found Kev's face and put the player's back.
   - **Visual cause:** A missing cue. He arrives with a contented 😊 thought (`runs/run-08/08.png`, `runs/run-10/10.png`), not 🧐, and no 😠 shows when he finds Kev's face. A manager told that someone was messing with his rota doesn't stroll over smiling.
   - **Fix:** Draw an orange dashed line from Lin's report to the board as he walks. Show 🧐 while he reads it. In run 10, show 😠 + ✏️ as he wipes the slot.
3. **Run 8: the reader believes the swap happened and was undone.**
   - **Reading:** "the board shows my face again."
   - **What really happened:** The write Lin saw never happened. The board never changed.
   - **Visual cause:** A missing cue. Nothing shows the write being cut off.
   - **Fix:** When Lin's ❗ fires, show the marker dropping back into the tray and the half-stroke vanishing with a small puff.
4. **Runs 2 and 5: the marker is never seen.**
   - **Reading:** "nothing in the pictures shows the player using a marker."
   - **What really happened:** The player was mid-write when caught.
   - **Visual cause:** A missing cue. The marker lift and the line-by-line scribble described in ways.md don't show at the moment of capture.
   - **Fix:** Keep the marker visibly in the player's hand, at the board, through the ❗😠 freeze frame.
5. **Run 11, 4:51: a big red ring "from the upper right. Source unknown."**
   - **What really happened:** This is the 4:50 clock tick or deadline cue. It is not a reaction to anything the player did.
   - **Visual cause:** A missing cue. The ring comes from off-screen, so it looks like an unexplained event.
   - **Fix:** Send the ring out from the wall clock, and pulse the clock face in red at the same moment.
6. **Run 6, 4:01: Kev's "!"**
   - **Reading:** "could be about the copier or about the player."
   - **What really happened:** It was about the copier.
   - **Visual cause:** A bubble that reads as a reaction. In run 11 the same "!" comes with dotted lines to the copier. In run 6 it doesn't.
   - **Fix:** Always draw the dotted line from Kev to the copier with this "!".

## Problems
- blocker: Run 3 win is only partly explained. The 🍜❓ bubble clears before the heads turn back, so the reader can't tell the ding made the write possible. — Keep 🍜❓ up exactly as long as each cone stays turned, and fade it out as the cone swings back.
- blocker: The "👢 👉 you" order is given mid-call with the handset at the boss's ear, and 👢 is also his routine "getting up" thought. The reader reads it as phone talk and thinks the forced trip to the desk was their own choice (runs 8, 10). — Boss hangs up first, then gives a 👉 you → 🖥️ order, and the player's walk follows a dotted path from it.
- blocker: The boss's check of the board after Lin's report is drawn with a contented 😊 and no 🧐/😠, so it reads as routine. A real manager told about rota tampering wouldn't stroll over smiling (runs 8, 10). — Draw a dashed line from Lin's report to the board, then 🧐 on arrival, then 😠 + ✏️ when he finds Kev's face.
- should: When Lin's report stops a write, nothing shows that it was stopped. The reader thinks the swap happened and was reverted (run 8). — Drop the marker back into the tray and erase the half-stroke with a puff when Lin's ❗ fires.
- should: In run 3 the player stands beside the board in plain view from 4:30 to 4:58 and is never sent to their desk. This contradicts the "idle in view gets you sent to your desk" rule, and it is odd office behaviour right after doctoring the rota. — Either have the boss send idlers off, or show the player visibly pretending to work (papers or a mug in hand) while they wait there.
- should: Caught end cards show marker scribble, but the marker is never seen in the player's hand (runs 2, 5). — Hold the marker in the player's hand at the board in the caught freeze frame.
- should: The 4:50 deadline sound ring comes from off-screen at the upper right, and the reader logs it as an unknown event (run 11). — Send the ring out from the wall clock and pulse the clock face red.
- nit: In run 6, Kev's "!" at the copier has no line to the copier, unlike in run 11, so it could be about the player. — Always draw Kev's dotted line to the copier with that "!".
- nit: The captions' timestamps and the on-screen clock are a minute apart in runs 2 and 6 (4:02 vs 4:01, 4:03 vs 4:02). — Stamp captions from the same clock the HUD shows.
- nit: The win card is told apart only by its teal frame colour. The run 7 reader had to guess ("I'm reading the frame colour as the result"). — Add a clear win mark such as 🎉 or a check to the icon row of win cards.

<!-- /cold-read:replay -->
