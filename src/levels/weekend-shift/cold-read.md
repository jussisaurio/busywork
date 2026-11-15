# Cold reads: weekend-shift
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

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

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"f83f9fa","hash":"7688953dd2ec17924113029f82b037e19e0addc634436423a93baccb488c9670","parts":{"card":"3137c04ca1f41f001ea870b0d86f4e28b995d5194f3b9c2e7c913db934ba3e9f","premise":"cb7b5e1e4f0d1c971b3554c5203b3a3fe5da70b0303db58e8813c4c4504be908","prompts":"e810e9318a4aa5a21d9654564c23dd898975d90252af2744b888b19de97df7bd"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit f83f9fa, by claude -p (model: default). Inputs 7688953dd2ec: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 13 s | $0.02 |
| 2-review | report.md | 112 s | $0.62 |
| all | | 125 s (the steps add up to 125 s) | $0.65 |

### 1-card: first-read.md

**Situation:** It's Friday at 4:00 PM. Someone has put me on the Saturday rota. At 5:00 the boss reads that rota out, and I take that to make it official. So I have one hour per loop.

**Goal:** Stop my name being read out. I can see three ways: get myself off the list, swap my name for someone else's, or stop the reading altogether.

**Failure:** The boss reads my name, and I work Saturday. Then the afternoon replays.

**Questions:**
- Does "down for Saturday" mean scheduled, or that I volunteered and now want out?
- Who put me down: the boss or a coworker?
- What is "it": a paper list, a whiteboard, an email? Is there only one copy?
- Is it fine for a coworker to take my shift, or does the game want me to keep my hands clean?
- If the reading never happens, do I still win?
- Is 🗓️ an object I should go find, like a wall calendar? Is @player a chat mention, meaning the list is digital?
- In the name, is "Shift" a noun (the shift I'm stuck with) or a verb (shift the weekend onto someone else)? The verb reading is the better joke.

### 2-review: report.md

Verdict: fixable

**1. The boss walks up to the board and doesn't see his own face on it.** At 4:50 he crosses the room toward the board, takes the black marker from its tray and stands guard until 5:00. Nothing checks what the board shows when he arrives (`cast.js:97-101`), but his cone covers the slot on the way in. The whole joke depends on him not having looked, and on screen he plainly looks. A sharp player will say "he would have seen it." **Fix:** have him walk out reading his folder (📄, head down) and take the marker without looking. Or have him come at the board from behind its stand, so the face is out of his view.

**2. The boss stands on a dead line for five minutes.** He shows ❓ when he answers (nobody there), holds the handset for 5 game minutes, then shows 😠 (`index.js:197-207`). A man who just showed he's impatient doesn't stay on a silent line. He's doing it only because the route needs the time. **Fix:** let him hear something he has a reason to wait for. For example, hold music (☎️🎵) under a 👔 "head office" bubble, so he stands up straight and waits.

**3. The name gives away the way out, and the card points at the wrong threat.** First-read noticed that "Shift" works as a verb: shift the weekend onto someone else. That is exactly the winning move. The card also makes the reading the danger ("At 5:00 the boss reads it out"), so first-read plans to "stop the reading altogether". No route does that. Delaying the boss or jamming things just burns loops. **Fix:** rename it to name the trouble only, e.g. "Saturday". Change the card to "Your face is on Saturday's board. At 5:00 the boss reads it out."

**4. The blamed ending contradicts the board.** By then the player has learned that whoever's face is on the board works Saturday. In the blamed ending the board shows the boss's face, yet the boss points at your empty chair and you get the day (`end-scenes.js:253`). Nothing on screen explains why. **Fix:** at 5:00, show the boss wiping the slot and drawing your face in, so the board stays the thing that decides.

**5. Your noodles block Lin's fish.** Once you've heated your noodles, the cooked cup stays in the microwave. If that happens before 4:30, Lin arrives and stands for five minutes at a dark microwave with your noodles in it. Her fish never turns and no smell comes off it (`props.js:415-417`). This is how a player learns her routine, and it breaks it. **Fix:** after the ding, the cup goes back on the counter, so the microwave is free for her.

**Deducibility check:**
- **Ding route:** you can see everything you need. The cup is on the counter, the countdown shows on the microwave, and the cones swing east when it dings. The board sits behind the boss and Lin's cones while they look east. It's 18 tiles from the microwave to the board, about 4 real seconds, against a 10-second countdown.
- **Phone route:** you can see everything you need. The supply-room phone lights up when you reach it, a dotted line runs to his phone, he walks to his corner, and Lin leaves with her lunch box at 4:30.
- **Copier trap:** fair. The copier is lined up behind the board from the boss's desk, so his look at it crosses the board.
- **Kev:** writing a second time to get his face is never shown or hinted. You only find it by accident. Since it's optional, that's acceptable.

**The joke** is a picture: 📢, 👈 at his own face, 😳, two 👏. But it's the obvious version, "write the boss's name." The funnier picture is already in the level: from 4:50 the boss guards the board, sure of what it says. Play that up, with a smug 😏 at the room while he guards it.

**Best thing, to keep through the fixes:** the boss sits with his back to the board, marker in hand, guarding his own sentence. Then he turns, points at his own face, and the room claps him into it.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"0a4e26f","hash":"bd276c94ee6b9387f14107cbd19e704e442783756d8652c7c44117233a9e0596","parts":{"card":"3137c04ca1f41f001ea870b0d86f4e28b995d5194f3b9c2e7c913db934ba3e9f","shots":"496362560c0659c2fc0fe9ca7c18989e15116f9be198a91f0b7b8297610c2390","pictures":"568551bc1ebadf663c07956d5ff10f9de710f19f1064b815f54f6a32172c8635","verbs":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","prompts":"1be891765faa44213b35ae487e17cfde8d5226055a07e5b77c1546cdbe1caa4e"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit 0a4e26f, by claude -p (model: default). Inputs bd276c94ee6b: the card, shots.js, the rendered shots, the verb sheets, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 125 s | $0.64 |
| 2-compare | report.md | 112 s | $0.48 |
| all | | 236 s (the steps add up to 236 s) | $1.12 |

### 1-read: reading.md

# Weekend Shift: cold read

**Card:** "Friday, 4:00 PM. You're down for Saturday. At 5:00 the boss reads it out." Clear setup. The HUD clock, the calendar with your face and the empty hand slot repeat it without words.

## Shots

**01** (4:00): The office from above. A bald boss sits at a desk behind glass, and his pale vision cone reaches into the open-plan area. A whiteboard on an easel shows a calendar and a red-haired face, which is mine (the ringed red figure at the bottom-left desk). There are two coworkers (teal, green), a copier, a phone in a side room, and a coffee machine, microwave and fridge on the right wall. The face on the board is my problem. The hand slot and the two slots next to the "1" are empty, and I can't tell yet what they're for.

**02** (4:01): I'm at the easel with an E prompt. The boss's cone turns red and a red "?" floats over a black bar. I've been spotted. The black bar reads as a thermometer or a dark exclamation mark. I guess it's an alert meter, but nothing shows it filling.

**03** (4:06): I'm at the coffee machine with an E prompt. Something to use.

**04** (4:00): I'm at the copier with an E prompt and red rings around me. The rings are probably noise, but they appear before I've done anything. Is just walking loud?

**05** (4:03): I'm at the phone in the side room. The boss has little tick marks by his head. "He heard something"? It's faint.

**06** (4:07): The coffee machine glows, shows "08" and a cup. A brew timer. Clear.

**07** (4:10): The machine reads "03". I'm at the easel and the boss's cone is red with "?" again. Coffee alone doesn't clear the way.

**08** (4:13): The coffee is done, and big pale arcs ring out across the office. The boss turns toward the kitchen, the coworkers hold something, and the "pretend" key is lit. A fast-forward icon appears top right, and I can't tell what triggers it. The ding turns his head. Good.

**09** (4:15): A large round portrait of the boss pops up over the easel, and the board now shows his face. So the board's face can be swapped, and this looks like a picker.

**10** (4:16): The picker shows the green coworker. The boss has turned back and the red "?" returns. The coffee window is about 2–3 seconds long. Tight.

**11** (4:04): I dial from the side-room phone. A dotted line runs to a phone in the boss's corner, and he shows a "☎!" starburst. The teal coworker jolts. Readable and funny.

**12** (4:06): The boss is at his corner phone with a "?" (nobody's there) and his chair is empty. I'm at the easel, unseen. This is the real window.

**13** (4:31): The teal coworker leaves her desk carrying a blue box. Routine.

**14** (4:35): She's at the microwave, which glows and steams. I'm "pretending" at my desk with something raised to my face, maybe a mug. The green coworker twitches. Smell? Annoyance? I can't tell.

**15** (4:34): I phone again and the boss walks to his phone again. The microwave is running.

**16** (4:39): While he's on the phone I switch the board to the boss. Teal is walking back with her lunch.

**17** (4:39): A progress ring around me, and the board face is a half-scribbled smear. Teal has a small "?" and a red cone pointed at me. A coworker can catch me too, which is new. I can't tell whether she tells on me.

**18** (4:02): The copier jams with a yellow warning triangle and crumpled paper. The green coworker shows "!" and a red dotted line runs to the copier. I'm seated.

**19** (4:07): Green is shaking the copier, and huge red rings cover the whole office. I'm pretending at *his* desk. Why there? The boss's cone points at the copier.

**20** (4:02): The copier is jammed, I'm at the easel, and the boss's red cone catches me anyway, because the copier sits right next to the easel. The noise brings his eyes to me. A good lesson, if a cruel one.

**21** (4:57): The clock is red. The boss has come out to the easel, and the coworkers have pulled up chairs. Green has a thought cloud with "?". I'm at my desk.

**22–23** (4:58–4:59): The boss points: "👈 + my face." I'm doomed.

**24** (4:59): The board shows the boss. His bubble: "his face + 😳." Both coworkers 👏. The best gag in the set.

**25** (4:59): The board shows green. The boss points at him and green goes 😩. I framed a coworker.

**26** (4:59): The same boss win, but I'm at the coffee machine.

**27** (end, green frame): The boss is stuck at his desk under a sunny window, 😩. Icons: ✏️ boss me 🏖️. A badge with the coffee machine fills slot one. This is a win. But why a *coffee* badge? I won by phone in other loops, and the badge doesn't say what I did.

**28** (end, green frame): The same picture with green at the desk. Same icons, same badge. Ruining a coworker's weekend scores exactly like getting the boss. For comedy that's a missed beat. Either let it sting or reward it differently.

**29** (end, red frame): I'm working Saturday. 🗓️ me 😩. No badge. A clean loss.

**30** (end at 4:02, red frame): The boss catches me scribbling, angry starburst, coffee in hand. ✏️ 😠 me. Clear.

**31** (end at 5:00, red frame): The board shows the **boss**, but he points at an empty yellow chair drawn in red dashes. "👉 me." Read as "whoever skipped the meeting gets it." Funny, but it contradicts 26, where I was also at the coffee machine and still won. The first icon, a red dashed arc, looks like a candy cane or a horseshoe, not a missing person. I'd guess you have to be seated when he reads it out, but these shots don't settle it.

## Unreadable or inconsistent

- The black bar under the red "?" over the boss.
- The rings at 04 before any action.
- The fast-forward icon.
- The empty hand slot, unused for the whole level.
- What the badge stands for.
- The dashed-chair icon in 31.
- The 26 vs 31 absence rule.

## The story

It's Friday afternoon and the roster says you're working Saturday. The boss never leaves his glass office, and noise just draws his eyes to you. So you call his own phone from the side room, and while he says "hello?" to no one, you swap the face on the board. At five he reads out his own name, blushes, and the office applauds. Or you write in a coworker, and he loses his weekend so you can go to the beach.

### 2-compare: report.md

Verdict: fixable

The phone route comes through clearly. Three things would mislead a first-time player. The microwave is drawn like a coffee machine, and the coffee reading carries all the way to the win badge. Shot 12 shows a safe window that isn't safe. Shot 26 plays the win gag in a run that ends in a loss. I checked shots 02, 03, 04, 06, 07, 08, 09, 12, 14, 19, 21, 26, 27, 30 and 31 myself. None is taken at the wrong moment: every clock fits its intent.

## Shots

**01: partly.**
- Reading: "a coffee machine, microwave and fridge on the right wall … The hand slot and the two slots … are empty."
- Intent: a cup of noodles on the kitchen counter, a lunch box on Lin's desk, and a second phone in the boss's corner.
- Cause: missing cue. The noodle cup is a few white pixels under the appliance, and the corner phone looks like part of the furniture. Neither the microwave route nor the phone route is set up for the player.
- Fix: draw the noodle cup bigger, with steam lines and a lid, and give each phone a small idle wobble so they read as a pair.

**02: partly.**
- Reading: "Something to use … The black bar reads as a thermometer or a dark exclamation mark."
- Intent: the whiteboard lights up with E, and you could *write* on it.
- Cause: missing cue. The two markers in the tray are too small to see, so nothing says "write". The alert meter is an unlabelled black bar with no visible fill.
- Fix: draw a big marker in the tray that lifts off when you get close. Make the meter a white bar that visibly fills red under the "?".

**03: misread.**
- Reading: "I'm at the coffee machine with an E prompt."
- Intent: the microwave, dark and empty, with a cup of instant noodles under it. You could heat your noodles.
- Cause: a glyph used as a prop. The appliance has a black display panel and a cup underneath, which is a coffee machine's silhouette.
- Fix: draw a wide box with a door window, a turntable plate and a keypad on the side, and put the noodle cup next to it, not under it.

**04: partly.**
- Reading: "The rings are probably noise, but they appear before I've done anything. Is just walking loud?"
- Intent: the copier is working (green light) and you could jam it. The boss's cone reaches toward it across the board.
- Cause: missing cue. The red rings are centred on the player, not the copier, so they look like the player's own noise. The boss's cone, the real point of the shot, is too pale to notice.
- Fix: put the "this can make noise" hint on the copier, as faint pulsing arcs off the machine. Draw the boss's cone edge out to the copier.

**05: reads.**

**06: misread.**
- Reading: "The coffee machine glows, shows '08' and a cup. A brew timer."
- Intent: the noodles are gone from the counter. They turn in the lit microwave, steaming, while the digits count down.
- Cause: a glyph used as a prop. The cup icon in the display window is the same cup that sat under the machine, so it reads as coffee brewing.
- Fix: show the noodle cup through a door window, turning on a plate with steam coming off the door. Leave an empty spot on the counter where the cup was.

**07: partly.**
- Reading: "I'm at the easel and the boss's cone is red with '?' again. Coffee alone doesn't clear the way."
- Intent: both the boss's cone and Lin's cone cover you.
- Cause: missing cue. Lin's cone is a faint wash that hardly shows against the floor, so the player blames only the boss.
- Fix: give every coworker cone a tinted edge, and turn it red when it covers the player, just like the boss's.

**08: partly.**
- Reading: "The coffee is done … A fast-forward icon appears top right, and I can't tell what triggers it."
- Intent: DING. A ripple comes off the microwave and every head snaps east, away from the board.
- Cause: the microwave-as-coffee misread from 03 and 06 carries over. The fast-forward icon is unexplained HUD.
- Fix: the appliance fix above. Also show the fast-forward icon only while the player holds pretend (⇧), so the two are visibly linked.

**09: partly.**
- Reading: "A large round portrait of the boss pops up … this looks like a picker."
- Intent: written. The boss's face pops up big off the Saturday box and settles into it.
- Cause: missing cue. No marker or stroke is shown, and the round floating portrait looks like a UI selection bubble rather than ink on the board.
- Fix: show the marker in the player's hand making a quick scribble stroke. Let the face grow straight out of the red box and shrink back in, without the round UI frame.

**10: partly.** Same picker misread as 09, same fix.

**11: reads.**

**12: misread.** This matters for the route.
- Reading: "I'm at the easel, unseen. This is the real window."
- Intent: the boss is on the phone, but Lin at her desk faces the board and her cone covers you. The window is closed.
- Cause: missing cue. Lin's cone over the board is barely visible and stays neutral, with no red and no "?". The picture tells the player the opposite of the lesson.
- Fix: turn Lin's cone red over the player, with her "?" bubble starting, the same way the boss's cone does in 02.

**13: reads.**

**14: partly** (cosmetic).
- Reading: "She's at the microwave … The green coworker twitches. Smell? Annoyance? I can't tell."
- Intent: Lin waits at the microwave with her back to the room while her fish turns inside. Her desk is empty.
- Cause: the fish is a tiny icon in the display, and Kev's tick marks are unexplained.
- Fix: show a fish through a door window. If the smell matters, draw wavy green stink lines drifting from the microwave to Kev.

**15: reads.**

**16: reads.**

**17: partly.**
- Reading: "the board face is a half-scribbled smear … I can't tell whether she tells on me."
- Intent: the boss's face is half drawn over yours, line by line from the top, with the marker at it. Lin's red cone is on you.
- Cause: missing cue. The half-drawn face doesn't read as a face in progress.
- Fix: draw the boss's face cleanly down to a hard line, with your face still showing below it and the marker sitting on that line.

**18: reads.**

**19: partly** (cosmetic).
- Reading: "Green is shaking the copier."
- Intent: Kev kneels at the copier with its front open and a spanner in his hand. The light is amber and it beeps until he's done.
- Cause: missing cue. The spanner and the open front are too small to see.
- Fix: draw an oversized spanner and a swung-open door panel, and show a small progress pip over Kev.

**20: reads.**

**21: partly.**
- Reading: "Green has a thought cloud with '?'. I'm at my desk."
- Intent: the boss sits by the board with the marker. Lin and Kev each look at the empty chair between them with a ❓, because it's your chair.
- Cause: missing cue. The empty chair is a plain yellow chair with nothing marking it as yours, and only Kev has the ❓.
- Fix: put your red ring, or a small version of your face, on the empty chair. Give both coworkers a ❓ and turn their heads to the chair.

**22–23: reads.**

**24: reads.**

**25: reads.**

**26: misread.** This matters for the route.
- Reading: "The same boss win, but I'm at the coffee machine." Read next to 31, the player calls the rules inconsistent.
- Intent: you're in the kitchen, the boss goes red at his own face, Lin and Kev clap, and your chair is empty.
- Cause: a cause and effect too far apart. The 4:59 beat plays the blush and the applause, which is the win gag, in the same run that 31 shows ending in a loss because you were absent. The empty chair has no cue. The picture shows what the intent describes, but the engine is staging a win beat in a losing run.
- Fix: when your chair is empty at 4:59, skip the blush. Have the boss and both coworkers turn to the empty chair, outline it in red dashes, and give the boss an angry "👉 ?".

**27: partly.**
- Reading: "A badge with the coffee machine fills slot one … why a *coffee* badge?"
- Intent: win. Boss at the desk, then the row pencil, his face, your face, beach.
- Cause: a glyph used as a prop. The badge is the microwave (00 plus the cup), so it inherits the coffee misread, and nothing ties it to what you actually did.
- Fix: redraw the badge with the new microwave art. Better still, award a badge per route (phone, microwave, copier) showing the trick that opened the window.

**28: partly** (comedy).
- Reading: "Ruining a coworker's weekend scores exactly like getting the boss … Either let it sting or reward it differently."
- Intent: win, and Kev is at the desk.
- Cause: identical end card and badge. Framing Kev has no visible cost.
- Fix: put a sad Kev doodle in the row in place of the beach, or a 😬 beach. Or leave the badge slot dashed.

**29: reads.**

**30: partly.**
- Reading: "angry starburst, coffee in hand."
- Intent: the boss stands beside the board, angry and pointing at you, with the marker still on the half-drawn face.
- Cause: a glyph used as a prop. The boss's pointing hand holds a white mug, so he seems to be gesturing with coffee rather than pointing.
- Fix: take the mug out of his hand and draw a clear index-finger point at the player. Keep the marker visibly stuck to the board.

**31: partly.**
- Reading: "The first icon, a red dashed arc, looks like a candy cane or a horseshoe, not a missing person."
- Intent: Friday at 5:00. The board shows the boss's face, but you weren't there, so he points at your empty place and Lin and Kev turn to look.
- Cause: a glyph used as a prop. The icon is a fragment of the dashed outline with no chair shape. Lin and Kev don't turn to the chair.
- Fix: make the icon a whole chair outline in red dashes, with your face's hair tuft above it. Turn both coworkers' heads toward the chair.

## Verb sheets

intents.md has no verb sheets and there is no verbs/ folder, so there are no panels to check.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"0a4e26f","hash":"27ddbc015f019203da350e9f19ac23b245b03fce7b8368289936c9e499fa92c4","parts":{"card":"3137c04ca1f41f001ea870b0d86f4e28b995d5194f3b9c2e7c913db934ba3e9f","checks":"7eeb024a26c5c3997eb968c8ca7e15f66ee5ce73eba3f98ac09e9ffdcc126ca8","ways":"076c8644c4e3aabef516f41542e5dc3bd877a384364543d397b37d5d8e8d5ee8","frames":"e946f6bac9b64005f37e74c0f1273fc859961777436cdf189ea38ba01445b2e6","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit 0a4e26f, by claude -p (model: default). Inputs 27ddbc015f01: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 201 s | $0.85 |
| 1-read-2 | reading.md | 84 s | $0.35 |
| 2-compare | report.md | 106 s | $0.41 |
| all | | 307 s (the steps add up to 391 s) | $1.61 |

### 1-read-1: reading.md

# Weekend Shift: cold read

The card says: it's Friday at 4:00, you're down for Saturday, and the boss reads the rota out at 5:00. The obvious target is the easel board by the boss's office, which shows your face.

## Run 1: loss (I can't see anything the player did)
- 4:40 The player sits at their desk (red top, bottom left). The teal coworker shows 🐟😋 and the olive-jacket coworker shows a green face. The boss is at his desk.
- 4:57 The boss walks out to the board. Teal and olive both show "?".
- 4:58 Everyone gathers at the board. Boss: 📢, then 👉 + your face.
- 5:00 The player is standing at the board grinning 😄 while the boss points at them. Papers are scattered by their empty desk.
- 5:01 End picture: you at the office desk under a sunny window, with a paper stack. Icons: 🗓️ you 😩.

**Why:** your face was still on the board at 5:00.
**Cause:** the player did nothing. This is the default ending.
**Might not be a reaction:** the 4:40 bubbles and the 4:57 "?"s happen in every run, so they're routine. The player walked to the board on their own, and their 😄 while being stuck with Saturday reads as a mistake, not a joke.

## Run 2: loss, caught
- 4:01 The player is at the board and the "do" key prompt is lit. The boss's view cone is red over the board, and he has a "?". Teal also has a "?".
- 4:02 The boss shows "!😠" and a red line runs from him to the player.
- 4:02 End picture: the boss points at a scribbled-out portrait. Icons: ✏️ 😠 you.

**Why:** the boss saw the player at the board.
**Cause:** going to the board at 4:01 while the boss was facing it. "You used the thing here" never appears, so the edit apparently didn't finish.
**Might not be a reaction:** nothing here. Both "?"s point straight at the player.

## Run 3: win
- 4:06 The player uses the microwave (right wall). Its timer shows "10".
- 4:12 A sound. The player is at the board. The microwave now shows a cup, the teal coworker has sound lines, and the boss's cone points down and right, away from the board.
- 4:14 The player uses the board, and the portrait changes to the bald boss.
- 4:40 Routine bubbles.
- 4:58 Gathering. Boss: 📢, then 👉 + his own face.
- 5:00 Teal and olive 👏. The player shows 🎉 and the boss 😳. A microwave badge fills the first slot.
- 5:01 End picture: the boss stuck at the Saturday desk. Icons: ✏️ boss you 🏖️.

**Why:** the boss's face was on the board at 5:00.
**Cause:** the board edit at 4:14. The badge credits the microwave.
**Might not be a reaction:** the boss's cone already pointed down and right at 4:06, before any sound. I can't tell whether the ding turned him or he would have looked away anyway.

## Run 4: win, against a coworker
- 4:06 Microwave, as in run 3.
- 4:12 Sound, as in run 3.
- 4:14 Board: the portrait becomes the boss.
- 4:16 Board again: it becomes the olive-jacket coworker. The microwave shows "00".
- 4:40 Routine.
- 4:58 Boss: 👉 + the olive coworker's face.
- 5:00 Olive shows 😩 instead of 👏. Microwave badge.
- 5:01 End picture: the olive coworker at the Saturday desk. Icons: ✏️ olive you 🏖️.

**Why:** the olive coworker's face was on the board.
**Cause:** the second board use. Each use seems to cycle to the next face.
**Might not be a reaction:** olive's 😩 is a real reaction to being named. Nothing else looks ambiguous.

## Run 5: loss, caught
- 4:06 Microwave, timer "10".
- 4:11 The player is at the board with the prompt lit, but the microwave still reads "03". The boss's red cone covers the board. The boss shows "?", and so does teal.
- 4:11 The boss shows "!😠".
- 4:12 End picture: the same caught scene as run 2.

**Why:** caught at the board.
**Cause:** reaching the board before the microwave finished. This is a useful contrast with run 3, but only one minute separates them.
**Might not be a reaction:** the boss may simply watch the board around 4:01–4:11 as part of his routine.

## Run 6: loss, caught
- 4:01 The player uses the copier. Paper spits out and sound rings appear. Olive shows "!" and a dotted line runs to the copier.
- 4:01 Sound. The player heads for the board.
- 4:02 The boss shows "?" and his cone is red over the board and copier. Teal shows "?". Olive gets up and walks toward the copier.
- 4:02 The boss shows "!😠".
- 4:03 Sound. Olive is still walking.
- 4:03 End picture: the caught scene again.

**Why:** caught at the board.
**Cause:** editing the board while the boss's cone covered it.
**Might not be a reaction:** the boss faced the board in run 2 too, without any copier noise, so I can't tell whether the copier turned him. Olive's walk clearly did come from the copier.

## Run 7: win
- 4:34 The player uses the phone in the left side room. The boss's phone, top-right corner, rings ☎️!
- 4:35 Sound. The boss leaves his desk for that phone.
- 4:36 Sound. The boss is on the phone with a "?". The player goes to the board.
- 4:40 Board: the portrait becomes the boss. Teal and olive show routine bubbles.
- 4:41 The boss shows 😠 at the phone.
- 4:58 Boss: 👉 + his own face.
- 5:00 👏 👏 🎉 😳. A phone badge fills the second slot.
- 5:01 End picture: the boss at the Saturday desk.

**Why:** the boss's face was on the board.
**Cause:** the phone call pulled the boss away from his desk, then the board edit at 4:40.
**Might not be a reaction:** the boss's 😠 at 4:41 is most likely about the empty call, not the player.

## Run 8: loss
- 4:03 Phone call. The boss's phone rings.
- 4:04–4:05 The boss goes to the phone and shows "?". The player goes to the board.
- 4:06 The player is at the board with the prompt lit. A red cone covers the board, but it seems to start from the boss's empty desk. Teal shows "?".
- 4:06 Teal shows "! 👉 you" with a red line to the player. The player is suddenly back at their desk with a paper stack, and a paper meter appears top-right. The boss's bubble shows 📄📄👉🖥️.
- 4:10 The boss shows 😠 at the phone.
- 4:40–4:58 Routine. Boss: 👉 + your face.
- 5:00 / 5:01 The same ending as run 1.

**Why:** your face was still on the board.
**Cause:** the edit never happened. It looks like teal reported the player and the boss handed them paperwork, which sent them back to their desk. I can't confirm that chain from the pictures.
**Might not be a reaction:** I can't tell whose sight cone that is with the boss away from his desk. It might be a bug. The 4:10 😠 is probably about the call.

### 1-read-2: reading.md

# Reading: Weekend Shift

The card shows 🗓️ next to the player's face. I read it as "you're rostered for Saturday; fix that before the boss reads the board at 5:00."

## Run 09: Loss

**Beats**
- 4:06: The player uses the coffee machine on the right wall. Its display reads "10".
- 4:12: A sound. The machine now shows a cup. The player is at the easel board, which shows the player's own face.
- 4:14: The player uses the board. It now shows the bald boss's face.
- 4:40: The player is back at the coffee machine, which reads "00". At their desks, teal says 🐟😋 and green says 🥗.
- 4:57: The boss, teal and green walk to the board and sit. Both coworkers have "?" bubbles.
- 4:58: The boss looks at the board, then points at himself (👉 + his own face).
- 4:59: The boss says "his face + 😳". Both coworkers clap 👏.
- 5:00: Everyone thinks "player's face ?" and then points 👉 at the player. The yellow chair is empty with a red dashed ring. The player, still at the coffee machine, shows 😨.
- 5:01: The end picture is the meeting, with the boss pointing at the empty chair. Icons: empty dashed outline, 👉, player.

**Why it ended:** The player wasn't in their chair at 5:00, and the absent person got picked.

**Cause:** Staying at the coffee machine through 5:00. The board swap worked: the boss read his own name and got applause. Then the empty seat overruled it.

**Might not be reactions:** The 4:12 sound looks like the coffee finishing, not the board. The 🐟 and 🥗 bubbles look like routine. The "?" bubbles at 4:57 show up identically in run 10, so the board swap didn't cause them.

## Run 10: Loss

**Beats**
- 4:06: The player uses the coffee machine ("10").
- 4:12: A sound. The machine reads "00". The player is still there.
- 4:40: The player walks toward the middle of the room. Teal says 🐟😋 and green says 🥗.
- 4:43: The player uses the copier. Paper sprays out, a red dashed line runs to green, and green says "!".
- 4:44 to 4:45: Sounds. Green walks to the copier and passes the player.
- 4:47: Green works on the copier (🔧). The player is now at green's desk.
- 4:51: Green says 😊. The copier is fixed.
- 4:57 to 4:58: The same meeting routine as run 09. The boss points at the board, which still shows the player's face.
- 5:00: The player is at the board looking 😄. The boss points 👉. There's crumpled paper on the floor at green's desk.
- 5:01: The end picture shows the player at a desk under a sunny sky with 😩. Icons: 🗓️, player, 😩.

**Why it ended:** The board was never changed, so the boss read out the player's name.

**Cause:** The board was left alone. The copier jam only pulled green away for about eight minutes.

**Unclear:** I can't tell what the player did at green's desk, or where the crumpled paper came from. I also can't explain the 😄 at 5:00.

### 2-compare: report.md

Verdict: fixable

## Runs

| Run | Real run | Ending | Mark |
|---|---|---|---|
| 1 | Did nothing, so it failed | fail | **explained** |
| 2 | Wrote on the board in plain sight, so caught | caught | **explained** |
| 3 | Microwave ding, then wrote the boss's face | win | **partly** |
| 4 | Ding, then wrote twice to get Kev's face | win | **partly** |
| 5 | Wrote before the ding, so caught | caught | **explained** |
| 6 | Copier trap pulled eyes through the board, so caught | caught | **partly** |
| 7 | Rang the phone while Lin heated her fish, then wrote | win | **partly** |
| 8 | Rang the phone with Lin at her desk, she told on the player, so it failed | fail | **partly** |
| 9 | Wrote at the ding, then wasn't at the board at 5:00, so blamed | blamed | **explained** |
| 10 | Copier and Kev, nobody wrote, so it failed | fail | **explained** |

### Run 3: partly (win)
- **Reading:** "Cause: the board edit at 4:14. The badge credits the microwave." … "the boss's cone already pointed down and right at 4:06, before any sound. I can't tell whether the ding turned him or he would have looked away anyway."
- **What really happened:** The ding turned every head and cone east toward the kitchen. That six-second window is the only reason the 4:14 edit went unseen.
- **Visual cause:** A missing cue, with cause and effect blurred together. I checked `runs/run-03/01.png`: at 4:06 the boss's faint cone already leans down-right, toward the player at the microwave. At 4:12 (`02.png`) it points the same way. So the snap the design promises never shows as a change. The 4:12 frame also has no ripple coming from the microwave. Only teal's small sound lines show the ding landed. The reader could only tell the microwave mattered from the "badge", and by comparing with run 5.
- **Fix:** Keep the boss's cone locked on the board, drawn red, right up to the ding. When it dings, draw a big ripple ring from the microwave and give every head the same 🍜 bubble at once, so the before and after are plainly different.

### Run 4: partly (win)
- **Reading:** "Cause: the second board use. Each use seems to cycle to the next face." "Nothing else looks ambiguous."
- **What really happened:** The cycling is read correctly. But both writes went unseen only because the ding had turned every head, as in run 3. The reader doesn't mention the ding at all, and calls 4:12 just "Sound, as in run 3".
- **Visual cause:** Same as run 3: there's no visible turn of heads, so the distraction never counts as a cause.
- **Fix:** Same as run 3. Also start a six-second countdown arc on the microwave after the ding, so the player can see the window and see that the second write just fits inside it.

### Run 6: partly (loss)
- **Reading:** "the boss faced the board in run 2 too, without any copier noise, so I can't tell whether the copier turned him."
- **What really happened:** The copier noise did turn the boss toward the copier. From his desk the copier sits right behind the board, so his turned cone runs straight through it. This is the level's lesson that distractions pull eyes toward something, and this one pulls them through the board.
- **Visual cause:** A missing cue. The boss watching the copier looks exactly like the boss watching the board, because both cones cover the board. The one beat that teaches the trap can't be told apart from his resting pose.
- **Fix:** When the copier beeps, have the boss show a 🖨️ bubble and draw a dotted gaze line from his eyes to the copier that visibly crosses the board. Give his resting gaze a different bubble, such as 📋, so "looking at the copier" and "looking at the board" look different.

### Run 7: partly (win)
- **Reading:** "Cause: the phone call pulled the boss away from his desk, then the board edit at 4:40."
- **What really happened:** The boss is only half the trick. Lin left her desk at 4:30 to heat her fish, and she was at the microwave with her back to the room from about 4:32 to 4:37. That is why ringing at 4:34 worked here and failed in run 8. The reader never notices Lin leaving. I checked `runs/run-07/01.png` and `03.png`: Lin stands at the microwave and her desk is empty. The reader files her 4:40 🐟😋 under "routine bubbles".
- **Visual cause:** Two things. First, an emoji standing in for a person: the 🐟😋 bubble is all the reader takes from Lin's fish trip, and it reads as flavour, not as "I was away". Second, a missing cue: her empty chair at a desk at the bottom of the frame is easy to miss next to the loud ☎️ beat at the top.
- **Fix:** When Lin leaves, put a ghost outline of her at her empty chair, or a 🐟➡️ bubble over the chair, until she comes back. Mark her return with a 🐟 bubble at the chair, so her absence is a visible state that lasts, not something fleeting.

### Run 8: partly (loss)
- **Reading:** "It looks like teal reported the player and the boss handed them paperwork… I can't confirm that chain from the pictures." "I can't tell whose sight cone that is with the boss away from his desk. It might be a bug."
- **What really happened:** Lin, at her desk, saw the player at the board. She told the boss, and he sent the player back to type for 20 minutes, so the board stayed unchanged. The player's mistake was ringing too early, while Lin was still at her desk. The reader guesses the chain but can't pin down who saw, so they can't name what the player did wrong.
- **Visual cause:** A misleading cue. In `runs/run-08/04.png` the red danger cone starts at the boss's *empty desk*, not from Lin. Lin's own cone isn't drawn in red, so the frame says "the absent boss is watching". Then the tell-on and the paperwork order arrive in the same 4:06 frame (`05.png`), so the step from Lin's tell to the boss's order is crammed into one beat.
- **Fix:** Draw the red cone from whoever actually sees the player, here Lin from her desk. When the boss leaves, his cone must leave with him. Then split the tell into two beats: first Lin ❗👉 with a dotted line to the boss's phone corner, then the boss's 📄📄👉🖥️.

## Beats that misled the reader

1. **Run 3 and 4, the boss's cone at 4:06.** "the boss's cone already pointed down and right at 4:06, before any sound."
   - **What happened:** The cone was following the player at the microwave. The ding's head-snap is the real cause, but it can't be seen.
   - **Visual cause:** The cause and its effect look the same before and after the ding.
   - **Fix:** Pin the boss's cone to the board before the ding (see run 3).
2. **Run 6, the boss's cone over the board.** The reader decided the copier probably didn't turn him.
   - **What happened:** It did. The copier sits directly behind the board.
   - **Visual cause:** A missing cue. Watching the copier and watching the board are drawn the same way.
   - **Fix:** A 🖨️ gaze bubble and a gaze line through the board.
3. **Run 7, Lin's 🐟😋 at 4:40.** The reader dismissed it as "routine bubbles".
   - **What happened:** It is the trace of the absence that made the phone route work.
   - **Visual cause:** An emoji standing in for a person.
   - **Fix:** Show her empty chair (see run 7).
4. **Run 8, the red cone "from the boss's empty desk".** The reader thought it was a bug.
   - **What happened:** The watcher was Lin.
   - **Visual cause:** A misleading cue that points to the wrong person.
   - **Fix:** Draw the cone from the person who actually sees the player.
5. **Run 1 and 10, the player's 😄 at the board at 5:00.** "their 😄 while being stuck with Saturday reads as a mistake, not a joke." "I also can't explain the 😄 at 5:00."
   - **What happened:** The player is gathered to the board for the reading no matter what they did. The grin is not a reaction to the outcome.
   - **Visual cause:** A bubble that reads as a reaction, the wrong one, at the exact moment the loss lands.
   - **Fix:** Have the player show 😬 or 🙏 while the boss reads, then 😩 when they're named. Never show a happy face on a loss.
6. **Run 1 and 10, crumpled paper by a desk at 5:00.** "Papers are scattered by their empty desk." "I can't tell… where the crumpled paper came from."
   - **What happened:** It's Kev's desk (`runs/run-10/12.png`), part of his own routine. Neither the player nor the copier caused it.
   - **Visual cause:** A stray prop that reads as a consequence of the player's actions.
   - **Fix:** Show the crumpling happen early in every run, for example Kev 😤 throwing a ball of paper at 4:20, so it's known background by 5:00. Or remove the papers before the reading.

Minor point: in run 9 the reader calls the microwave a "coffee machine". It didn't change their reading, but the cup icon shown when it finishes looks like coffee. Showing noodle steam in the window would make it read as food.

<!-- /cold-read:replay -->
