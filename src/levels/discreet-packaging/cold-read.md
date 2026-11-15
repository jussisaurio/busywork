# Cold reads: discreet-packaging
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:title {"verdict":"works","date":"2026-11-15","commit":"ed5d617","hash":"c7a08c2ab2bc3ee39b1c19b7f490d0c9b336fe63a9f2e731802b7ddcb36c92d9","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","ways":"29edd1f1b864f0abcf5d82810671de146e085d5addab10d55f423943c9ecd045","prompts":"dd5bab76ad1fbe5da43d5bff829c95ca85430b34c17e10645da81a3ce6ac4fa1"},"model":"default","tally":{"miss":3,"near":2,"leak":0},"problems":{"blocker":0,"should":1,"nit":2}} -->
## title: works
Recorded 2026-11-15 at commit ed5d617, by claude -p (model: default). Inputs c7a08c2ab2bc: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 3 miss, 2 near, 0 leak.
Problems: 0 blocker, 1 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-guess | guesses.md | 13 s | $0.02 |
| 2-judge | report.md | 26 s | $0.08 |
| all | | 39 s (the steps add up to 39 s) | $0.10 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] "hands out the mail" makes it sound like a private delivery to your desk. What actually goes wrong is Lin holding the box up for the room to see, and the card doesn't say so. The danger is weaker than it should be. — Change "Lin hands out the mail at 4:00." to "Lin calls out the post at 4:00."

### 1-guess: guesses.md

1. **Rewrap it in plain packaging.** You hide the pink and the hearts by covering or swapping the box for something dull. Suggested by "**Discreet Packaging**" and "**pink, covered in hearts**".
2. **Get the parcel before Lin does.** You have 40 minutes to take it from the mail pile or mailroom before the round starts. Suggested by "**3:20 PM**" and "**Lin hands out the mail at 4:00**".
3. **Do the mail round yourself, or keep Lin away from it.** You offer to hand out the mail or distract Lin so they never walk it across the office. Suggested by "**Lin hands out the mail**".
4. **Hide it once you have it.** You put it in a drawer, bag or bin so no one catches sight of it. Suggested by "**Don't let anyone see it**".
5. **Time the delivery for when nobody's around.** You get it handed to you while the office is empty or everyone is busy elsewhere. Suggested by "**anyone**" and "**at 4:00**".

Stake: Coworkers see the pink heart parcel from your mum and you're embarrassed. The card only implies this through "Don't let anyone see it" and the 😳 icon. It doesn't say whether anything worse happens, like teasing or a nickname that sticks.

### 2-judge: report.md

Verdict: works
- Stake: clear — a pink, heart-covered parcel from Mum is about to be seen by the whole office (😳). The first reader understood this. What's missing is how public the handover is: "hands out" could mean Lin drops it quietly on your desk, but in the game she holds it up in front of everyone.
- Rewrap it in plain packaging: miss — no route covers or swaps the box. The level name "Discreet Packaging" points you to a dead end, which costs the player nothing.
- Get the parcel before Lin does: near — this is the area of route 2 (take the box from the pigeonholes), led by "Lin hands out the mail at 4:00". It misses the key step: blinding Bob's camera.
- Do the mail round yourself, or keep Lin away from it: miss — no route does this.
- Hide it once you have it: near — this is route 2's drawer or store-room step, led by "Don't let anyone see it". It doesn't touch the camera or the label swap.
- Time the delivery for when nobody's around: miss.

Neither the name nor the card mentions the camera, the plug, the broom or the label swap, so the method stays hidden.

## Problems
- should: "hands out the mail" makes it sound like a private delivery to your desk. What actually goes wrong is Lin holding the box up for the room to see, and the card doesn't say so. The danger is weaker than it should be. — Change "Lin hands out the mail at 4:00." to "Lin calls out the post at 4:00."
- nit: "Mum" and "parcel" are British, but "mail" is American. A British office worker would say "post", so the line reads like it was written by two different people. — Use "post" (this is covered by the fix above).
- nit: the level name is a pun on how embarrassing online orders get shipped, and it nudges players to look for wrapping paper that doesn't exist. That's harmless misdirection and it's funny, so keep it. If you'd rather not send players looking, "Return to Sender" is an alternative that hints at route 1 without giving it away.

<!-- /cold-read:title -->

<!-- cold-read:sense {"verdict":"fixable","date":"2026-11-15","commit":"ed5d617","hash":"8c6007da61fc88fa7ce242cca2530f3b8095675f2cbf95586d951dc846d0ba8c","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","ways":"29edd1f1b864f0abcf5d82810671de146e085d5addab10d55f423943c9ecd045","prompts":"016aa683a72d416a002d56cc4d9abc6f52045f2ad4e6f1862e5593ed8c3882bb"},"model":"default","tally":{"sensible":9,"stretch":2,"nonsense":0},"problems":{"blocker":1,"should":2,"nit":1}} -->
## sense: fixable
Recorded 2026-11-15 at commit ed5d617, by claude -p (model: default). Inputs 8c6007da61fc: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 9 sensible, 2 stretch, 0 nonsense.
Problems: 1 blocker, 2 should, 1 nit.
Earlier problems: 7 fixed, 0 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 57 s | $0.14 |
| all | | 57 s (the steps add up to 57 s) | $0.14 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 fixed: Lin takes the box off you when she sees you carrying it. It's your own parcel, and she'd never take it. — Have her react out loud instead ("Ooh, hearts! From your mum?"), so heads turn and you go red. That way you lose by being seen, which fits the theme. (Lin now asks about the box out loud. She doesn't take it.)
- E2 fixed: In "Hidden, and you're not there," Lin and Bob point at your empty chair. The ways say nobody misses a parcel they didn't know about. And if Lin did know about it, the obvious reading is that you picked it up. — Cut this loss, so being away with the box hidden simply wins. Or, if a lose is needed: Lin, who signed for the parcel, phones your desk and announces "your pink parcel" across the office. (if you're away and the box is hidden, Lin just shrugs at your empty chair. That's a win.)
- E3 fixed: After the poke, Bob is happy that his camera shows only a leaf all day. Someone paid to watch the pigeonholes would at least grumble. — He grumbles, finds the camera is too high to reach, and leaves it for facilities "tomorrow." It stays in the plant for the same reason, but the motive is real. (Bob is cross, tugs at the camera, can't free it and leaves it for facilities.)
- E4 fixed: Bob's role is unclear. He's "a real guard" in the camera section, but he sets you work and his reaction to the swap reads as a boss's. — Make him plainly the boss who keeps the pigeonhole monitor on his counter. (Bob is now plainly the boss and manager.)
- E5 fixed: Pulling a plug right behind a seated Bob. — Put the power strip under the counter's far end, or have him turned to his monitor with headphones on. (Bob faces the lobby, and easing a plug out makes no sound.)
- E6 fixed: "Nobody ever goes into the mailroom," yet the mail clerk's broom hangs there. — Make it a supply cupboard Lin has no reason to open before 4:00. (the broom is in a store room that nobody opens before 6.)
- E7 fixed: Lin, a mail clerk, "tells on you" for sneaking. — Have her mention it to Bob in passing ("Your lot are acting odd today"), which fills his ❓ meter. (Lin now calls out in surprise and Bob overhears. She no longer goes and tells on you.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] When the monitor's plug is pulled, it goes dark. A dark screen says "monitor", and the plug is right by Bob's counter, so no real boss walks to the back office to thump the camera first. — Make the plug the camera's: its power runs from the strip by the counter. The monitor then shows "no signal"/static, and blaming the camera is the natural guess. Also cut the thumping to about a minute. Three and a half minutes is longer than anyone keeps hitting a camera.
- E2 [should] In "Bob gets it", Bob was expecting his brown box. At the mail call he'd see Lin hand it to you and say "that's mine". — Have Lin call Bob's name first, so he's lost in the hearts box while she hands the brown one to you. Or have him expecting nothing today, so the brown box is an unplanned delivery.
- E3 [should] Lin's `empty-pigeonhole` shot (pink box, ?) shows she knew about the parcel. But the route's reasoning is "nobody misses a parcel they never knew about". A post person who knew about it would at most think "must have collected it". — Show her thinking that (box, tick), not a question mark. Or drop the thought bubble so she never knew.

### 1-judge: report.md

Verdict: fixable

- Pull the plug (blind, both routes) (win): stretch — a monitor with its plug pulled goes black, not static, and the plug is at Bob's own feet, so a real boss checks there first.
- Poke the camera into the plant (blind, both routes) (win): sensible — a knocked camera stuck near the ceiling that the manager can't free gets left for facilities.
- 1. Bob gets it (win): stretch — swapping labels is just paperwork, but Bob is waiting for his own brown box and would see it handed to you.
- 2. No parcel today (win): sensible — you quietly take your own parcel. The post person has nothing for you and shrugs.
- The mail call (lose): sensible — Lin holds up a pink heart box with your name on it. That's exactly what she'd do.
- The mail call, and you're not there (lose): sensible — she holds it up by your empty chair and the whole office looks.
- Caught on camera (lose): sensible — the boss sees you on his monitor with the hearts box, or with a broom aimed at his camera.
- Caught in person (lose): sensible.
- Found (lose): sensible — a box in the corridor gets picked up and its label read.
- Spotted (lose): sensible — a coworker who sees a pink heart parcel says something out loud.
- Twenty minutes of work (lose): sensible — a boss gives work to someone hanging about doing nothing.

## Earlier problems
- E1: fixed — Lin now asks about the box out loud. She doesn't take it.
- E2: fixed — if you're away and the box is hidden, Lin just shrugs at your empty chair. That's a win.
- E3: fixed — Bob is cross, tugs at the camera, can't free it and leaves it for facilities.
- E4: fixed — Bob is now plainly the boss and manager.
- E5: fixed — Bob faces the lobby, and easing a plug out makes no sound.
- E6: fixed — the broom is in a store room that nobody opens before 6.
- E7: fixed — Lin now calls out in surprise and Bob overhears. She no longer goes and tells on you.

## Problems
- blocker: When the monitor's plug is pulled, it goes dark. A dark screen says "monitor", and the plug is right by Bob's counter, so no real boss walks to the back office to thump the camera first. — Make the plug the camera's: its power runs from the strip by the counter. The monitor then shows "no signal"/static, and blaming the camera is the natural guess. Also cut the thumping to about a minute. Three and a half minutes is longer than anyone keeps hitting a camera.
- should: In "Bob gets it", Bob was expecting his brown box. At the mail call he'd see Lin hand it to you and say "that's mine". — Have Lin call Bob's name first, so he's lost in the hearts box while she hands the brown one to you. Or have him expecting nothing today, so the brown box is an unplanned delivery.
- should: Lin's `empty-pigeonhole` shot (pink box, ?) shows she knew about the parcel. But the route's reasoning is "nobody misses a parcel they never knew about". A post person who knew about it would at most think "must have collected it". — Show her thinking that (box, tick), not a question mark. Or drop the thought bubble so she never knew.
- nit: In the start shot, Bob smiles when the plant drifts into his picture. That's an odd thing for a real boss to like, and it clashes with how cross he gets after the poke. — Give him a neutral glance, or have him nod at the plant he waters.

<!-- /cold-read:sense -->

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"a19db65+dirty","hash":"7904e871082adf6dafb9c1f63c1865a4c06646882de2076c4b78b4b07a446ab8","parts":{"card":"abb950f8c65866c2b72031087db59793a7a513180c067b8ebc3a8e8c4dbab235","premise":"bb3907c05b2cb6f97d9b1da50962f8641195d44950ec295c662b4c88cc39f944","prompts":"e810e9318a4aa5a21d9654564c23dd898975d90252af2744b888b19de97df7bd"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit a19db65+dirty, by claude -p (model: default). Inputs 7904e871082a: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 13 s | $0.02 |
| 2-review | report.md | 74 s | $0.39 |
| all | | 87 s (the steps add up to 87 s) | $0.41 |

### 1-card: first-read.md

**Situation:** It's 3:20 PM. A loud pink parcel covered in hearts, sent by my mum, is at my office now or on its way. At 4:00 a coworker named Lin hands out the mail, probably in front of everyone. 😳 says the problem is embarrassment, not danger.

**Goal:** "Don't be the one who gets it" can be read two ways:
1. Literal: make sure someone else receives it, for example by swapping labels or framing a coworker.
2. Looser: just don't be seen receiving it. Grab it, hide it or rewrap it before 4:00.

**Failure:** Lin hands me the parcel and everyone sees.

**Questions:**
- Is the parcel already in the building? Where?
- Does giving it to a coworker count as a win, or as cruelty the game punishes?
- Is the title ironic, or an instruction to make the parcel discreet?
- Does it matter what's inside?
- Does Lin hand it over in public or just leave it on my desk?
- Can I skip work so I'm not there at 4:00?
- Is the loop exactly 40 minutes?
- Does destroying the parcel count as a win?

### 2-review: report.md

Verdict: fixable

1. **The card gives away Route 1.** "Don't be the one who gets it" doesn't just name the trouble. It tells the player to make someone else get the box. The first reader worked out "swap labels" from the card alone. Fix: change line 2 to "Lin hands out the mail at 4:00, in front of everyone." The 😳 badge already carries the stakes.

2. **The spare label with Bob's face appears only because the puzzle needs it.** It sits in the mailroom printer, but nothing on screen explains why it's there. Bob never gets post in the normal loop, so the player has no reason to think a label decides who receives a box. Bob's walk to the mail call at 3:56 also has no visible reason. The code even says his eyes stay on "the lobby and the screen, never anywhere else," yet he leaves both for a mail call with nothing for him. Fix: put Bob's own plain brown parcel on the shelf every loop. Lin hands it to him every day, so his trip is motivated and the player learns that boxes go to the face on the label. The route then becomes swapping the two labels. As a bonus, you end up holding his dull box while he hugs yours.

3. **The drawer win contradicts the level's own rule.** A pink box seen loose makes anyone drop everything and read its label. But at 4:00 Lin stands at `mail_call` (7,4) facing your desk, and the pink corner sticking out of your drawer goes unnoticed. The win card even draws that corner. The player has learned that pink means found, so this win feels like the game forgot its rule. Fix: either the drawer shuts fully, or Lin gives the corner a double take that the player can avoid. For example, the corner shows only from the front, and you wedge your chair in.

4. **Being blamed for missing the mail call has no visible cause, and one loss card shows the wrong scene.** The card never says you have to be at the mail call. When you win by hiding the box, Lin just shrugs at empty post, so an empty chair isn't suspicious. When Bob gets the box, your absence doesn't matter at all. And if you skip 4:00 without doing either route, the `mail` card still draws you standing in the office going red. The first reader asked "Can I skip work?", and the answer they get on screen contradicts itself. Fix: at the mail call, Lin looks at your empty chair and then the empty shelf and puts it together (📭 → @player ❓). Also give the no-show loss its own card: the box held up over your empty chair.

5. **The leaf can't be predicted.** Static sends Bob over to the camera, but a screen showing one giant leaf makes him content. Nothing before the poke tells the player he won't come check it too, so the broom route is a guess. Fix: before 3:20, let the player see Bob happily watching the plant drift in and out of frame on his monitor (🪴😊) while the camera sweeps.

**Checks that hold up:** The plug route can be worked out from what's on screen. Static, then the thump, then (plug, !) are all shown, and the window lasts about 3.5 game minutes, roughly six real minutes. Lin's 3:50 trip for the post is her job and clearly visible. Leaving the box on the mailroom floor can be learned by watching that nobody ever goes in there.

**Best thing:** Big, stern Security Bob in his navy uniform hugs a pink heart-covered box with his own face on the label, in tears, while confetti falls.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"a19db65+dirty","hash":"6d77d12ec30c138a495ba3cf42575bd65e4c617e58a2656637d841944fcfbb5e","parts":{"card":"abb950f8c65866c2b72031087db59793a7a513180c067b8ebc3a8e8c4dbab235","shots":"95fa3d5365de1898a5d3f6bf85550a18fee853b2d8038887a96d98bbf08d3647","pictures":"45414f03cc8c349f477ca11a682e9c6dbc9cbbf64b763c1bd2603077c4f6d1b7","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit a19db65+dirty, by claude -p (model: default). Inputs 6d77d12ec30c: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 91 s | $0.49 |
| 2-compare | report.md | 86 s | $0.35 |
| all | | 177 s (the steps add up to 177 s) | $0.84 |

### 1-read: reading.md

# Reading: Discreet Packaging

**Card:** It's 3:20. A pink parcel covered in hearts from Mum is coming. Lin hands out the mail at 4:00, and the goal is not to be the one who gets it.

**01** The player (red sweater, hair bun, red ring) sits at a desk on the top left. A woman with glasses and a bun sits at a desk on a mustard rug, so she's probably Lin. A big guard sits at the reception counter with a monitor. There's a wall camera and a pigeonhole shelf with a pink box on it. A side room holds a grey box showing a face, and a broom. *Can't read:* the grey box with the portrait. Photo booth? Sticker printer?

**02** The player is at the shelf and an E prompt highlights the pink box. The camera's cone seems to reach the shelf. The Shift "pretend" key glows, though I never learn what pretending does.

**03** The player is at a power strip on the floor, cabled to the guard's monitor.

**04** The monitor shows static. The guard turns with a bubble: TV ❓. The player whistles (🎵). Unplugging blinds the guard, and the whistle reads as an innocent act. Good gag.

**05** The guard leaves his seat and heads for the camera. The player slips into the top hallway.

**06** The guard stands over the strip with a bubble: plug ❗. He found it, so this trick buys only seconds.

**07–08** The player picks up the broom. The item slot shows it. They take it to the camera and get an E prompt.

**09** The camera now points at the plant, and the monitor shows a leaf. The guard thinks 🪴😊. Very funny and very readable.

**10** The player uses the grey portrait box (E).

**11** The player is at their own desk at the white machine (typewriter?). The face on the parcel on the shelf has changed to a dark-haired man, apparently the guard. *Can't read:* which object changed the label, the grey box or the typewriter. My guess is you stick a new face on the parcel to change who gets it.

**12** The pink box is now on the player's desk and the shelf is empty.

**13** At 3:54 Lin is at the shelf holding the parcel, with the thought 💝 + player face.

**14** In a different loop the parcel sits on the player's desk. Lin is at the empty shelf thinking mailbox ❓.

**15** At 3:59 Lin says mailbox + 🤷. The guard walks beside her. *Can't read:* the shrugging figure looks like a little statue or genie.

**16** The parcel lies dropped in the top hallway. Lin thinks 💝❗

**17** Lin picks it up and says player face ❗. Dropping it doesn't hide whose it is.

**18** At 3:59 the guard carries the pink box and thinks 🥹. Lin says 💝 + guard face.

**19 (green border, win)** The guard hugs the hearts box with his own face on it, teary, under confetti. The player grins. Icons: 💝 guard 🥹. The guard's portrait fills one of two slots. It's sweet, and he's the butt of the joke without being humiliated.

**20 (green, win)** Lin shrugs. The parcel is tucked on the player's desk and the player whistles. Icons: Lin 🤷 player 🎵. Lin's portrait fills slot two. So the two slots mean two different solutions.

**21 (red, loss)** Lin holds the box high and the player blushes 😳. This is the basic failure.

**22–24 (red)** The guard points at CCTV of the player taking the parcel. In 23 they're also holding the guard sticker. In 24 they're swinging the broom at the camera. Icons: 📺 👉 player. Being seen by the camera fails the loop right away.

**25 (red)** The guard catches the player in person, holding the box. Icons: 😠 👉 player.

**26 (red)** At 3:54 Lin opens the box early and sees the player's face on it.

**27 (red)** At 4:01 the player is away in the side room. Lin stands at the empty desk thinking player ❓. Icons: 🪑❓. Being absent when the mail comes also loses. *Can't read:* why the parcel on the desk here doesn't count as hidden, as it did in 20.

## The story
The face on the parcel is the address, so whoever's face is on it gets it. Get past the guard's camera with the plug or the broom and the plant. Then either relabel Mum's gift so the guard gets it and loves it, or quietly take it and be at your desk, whistling, when Lin finds the shelf empty. Being seen, dropping it, or being away from your desk gets you the pink box held up in front of everyone. The lesson seems to be that labels are identity, a mail version of "clothes are identity." My two complaints: what "pretend" does is never shown, and frames 20 and 27 look like the same situation with opposite results.

### 2-compare: report.md

Verdict: fixable

**01 — partly**
- Reading: "A side room holds a grey box showing a face, and a broom. *Can't read:* the grey box with the portrait. Photo booth? Sticker printer?"
- Intent: there is a label printer in the mailroom. Bob sits with his back to the back office, so the camera is the only thing watching the pigeonholes.
- Cause: a glyph is standing in for a prop. At this size the printer is a grey lump with a face pasted on it. Nothing shows that it prints labels. The reader also never notices which way Bob faces.
- Fix: put a paper tab in the printer's front slot, drawn in the same white-and-face style as the label on the pink box. Then the printer and the box share one visual "address label" shape.

**02 — partly**
- Reading: "an E prompt highlights the pink box. The camera's cone seems to reach the shelf. The Shift 'pretend' key glows, though I never learn what pretending does."
- Intent: up close, the box is covered in hearts and carries your face on its label. You stand inside the cone, and Bob's monitor shows you.
- Cause: a missing cue. The face on the label is a few pixels, and the monitor is too small to show you on it. This shot is supposed to set up "the face is the address," and the reader learns that only later, at 11. The glowing Shift key is a stray cue that pulls the eye to a mechanic this level never pays off.
- Fix: when the box is highlighted, pop up an enlarged label beside it with your face on it, and flash a tiny red figure on Bob's monitor. Don't light Shift here.

**03 — reads**

**04 — reads**

**05 — partly** (cosmetic)
- Reading: "The guard leaves his seat and heads for the camera."
- Intent: Bob stands under the camera and thumps it. His monitor still shows static.
- Cause: a missing cue. He just stands there, so the "he thinks the camera is broken" beat doesn't land.
- Fix: draw a raised fist with an impact star on the camera, and make the camera wobble.

**06 — reads**

**07–08 — reads**

**09 — reads**

**10 — misread**
- Reading: "The player uses the grey portrait box (E)."
- Intent: a label printer with a spare label sticking out, Bob's face on that label, which you can take.
- Cause: a glyph is standing in for a prop, and the cue is missing. The face is printed on the machine's body, not on a separate label coming out of it. The reader never sees that this face is Bob's, and the item slot stays empty, so nothing shows you took a label.
- Fix: draw a white label clearly sticking out of the printer with Bob's face on it. When you take it, show that same label in the item slot.

**11 — misread** (this one is route-critical)
- Reading: "The player is at their own desk at the white machine (typewriter?)… *Can't read:* which object changed the label, the grey box or the typewriter."
- Intent: back at the shelf, the pink box now carries Bob's face instead of yours.
- Cause: the cause and effect are too far apart, and the focus is on the wrong thing. The shot shows you at your desk with an E prompt glowing on the typewriter. The relabelled box is a tiny sprite across the map. The reader is left to choose between two machines, and the one that is highlighted is the wrong one.
- Fix: take this shot at the shelf, right after the stick-on: you beside the box, the label slot empty again, and the box's label showing Bob's face with a small "slap" puff. Remove the typewriter's E prompt from this frame.

**12 — partly**
- Reading: "The pink box is now on the player's desk and the shelf is empty."
- Intent: the box is stuffed in your desk drawer, which sticks open on a pink corner.
- Cause: a missing cue. The box sits whole on the desktop, so no drawer is visible. That makes "hidden" look like "placed on desk," and it sets up the 20/27 confusion.
- Fix: draw a drawer that is pulled half open below the desktop, with a pink corner poking out of it. Show no box on top of the desk.

**13 — reads**

**14 — partly**
- Reading: "the parcel sits on the player's desk."
- Intent: there is a pink corner in your drawer, and you sit at your desk.
- Cause: same as 12.
- Fix: same as 12.

**15 — partly**
- Reading: "*Can't read:* the shrugging figure looks like a little statue or genie."
- Intent: Lin shrugs (empty mailbox, shrug) at the mail call.
- Cause: an emoji is standing in for a person. The 🤷 glyph is a gold-tinted figure that doesn't look like anyone in the cast. The meaning comes only from Lin's pose.
- Fix: use a shrug drawn in Lin's own style, either her face with both palms up or simply two open palms.

**16 — reads**

**17 — reads**

**18 — reads**

**19 — reads**

**20 — reads.** The reader takes the parcel to be "on the desk" rather than in the drawer. The fix at 12 covers this.

**21 — reads**

**22 — partly**
- Reading: "The guard points at CCTV of the player taking the parcel."
- Intent: on the monitor you stand empty-handed, and the box is still on its shelf beside you. Just being seen there loses.
- Cause: a missing cue. In the monitor's tiny picture, the box sits right at your hand, so you look as if you're holding it. The lesson the reader takes away ("seen = caught") is still correct.
- Fix: in the CCTV picture, put clear space between the figure and the shelf, give the figure empty hands at its sides, and keep the box at shelf height.

**23–24 — reads**

**25 — reads**

**26 — misread**
- Reading: "At 3:54 Lin opens the box early and sees the player's face on it."
- Intent: in the corridor, Lin holds out the box she picked up off the floor. Your face is on it, and you go red.
- Cause: the cause and effect are too far apart. The background is the same office wall, window and clock as the other end cards. The floor is bare. The 3:54 timestamp matches 13. Nothing in the picture says "dropped in the corridor," so the reader invents a new rule: Lin opens parcels early.
- Fix: use the corridor tiles for the background, and draw a scuff mark or dust puff on the floor where the box landed. Add a "dropped box" icon (a box with fall lines) to the icon row.

**27 — partly**
- Reading: "*Can't read:* why the parcel on the desk here doesn't count as hidden, as it did in 20."
- Intent: the mail call happened, but your chair is empty, and Lin and Bob look at it.
- Cause: a missing cue. The desk art, with the pink box on the drawer, is identical to 20. The only difference is that you aren't drawn, and the chair sits hidden behind the desk. So the picture tells the reader to look at the parcel, not at your absence.
- Fix: draw the chair pulled out in front of the desk, empty and spotlit. Have Lin and Bob point at it, and leave the pink corner out of the drawer in this card.

**Summary:** The camera and plant route reads cleanly, and so do the gags (static and whistle, the leaf on the monitor, Bob in tears). The relabel route doesn't. 10 and 11 never show the label going from the printer onto the box, and they highlight the typewriter instead. The player guesses the right story, but not how to carry it out. 26 teaches a rule that doesn't exist. The drawer is never drawn, and that is why 20 and 27 look like the same situation with opposite results.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"a19db65+dirty","hash":"303bf1bc41464f53feb8e8464e0c182cf7c0e5fe0eadb3567bef51e04ec3bbd5","parts":{"card":"abb950f8c65866c2b72031087db59793a7a513180c067b8ebc3a8e8c4dbab235","checks":"94ce4231caa89722e42393aa73660c875d75320767a18507012689e719a640f1","ways":"b50eccde3fcfd60c49a74875ac411301b13e2a77a70efc1ac79ed4e9e331f2ce","frames":"f49afa5ed5ef4a906d9b7db8beeffcf22a0ddb9031a4dcd341ba39664331240e","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit a19db65+dirty, by claude -p (model: default). Inputs 303bf1bc4146: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 204 s | $0.88 |
| 1-read-2 | reading.md | 83 s | $0.30 |
| 2-compare | report.md | 90 s | $0.32 |
| all | | 294 s (the steps add up to 378 s) | $1.50 |

### 1-read-1: reading.md

# Discreet Packaging: cold read

**Cast, as they look on screen:** the player is the red-sweater person sitting at the top-left desk. Lin wears teal, has her hair in a bun and glasses, and starts at the rug desk. A man in a dark suit sits at a long desk watching a monitor. A wall camera is wired to a power socket on the right. The pink heart box sits on a shelf, and its label shows the player's face.

---

## Run 1: LOSS (3:53–4:01)
- **3:53** Lin picks the box up off the shelf. Her bubble shows heart-gift plus the player's face.
- **3:59** Lin walks to the player's desk. The suited man leaves his monitor and follows her.
- **4:00** Lin and the man both show 💝. The player shows 😅, with white bits flying around them.
- **4:00** Lin and the man both show the player's face with "!".
- **4:01** End picture: Lin holds the box up high, the man watches, the player is red-faced. Icons: 💝 player 😳.

**Why:** Lin delivered the box to the player in front of the man.
**Player's cause:** none. No actions were recorded, so this is the default ending.
**Might not be a reaction:** the man walking over with Lin is his routine. It happens in runs 3, 4 and 6 too.

## Run 2: LOSS (3:25–3:26)
- **3:25** The player is at the shelf with a progress ring around them, inside the camera's red cone. The man shows monitor + "?".
- **3:25** The man shows a spiky monitor + "!" + 👉 + the player's face.
- **3:26** End picture: the man points at a monitor that shows the player at the shelf. Icons: monitor 👉 player.

**Why:** the camera saw the player taking the box.
**Player's cause:** taking the box while in the camera's view.
**Note:** the captions never say "you used the thing" in this run, even though a progress ring is visible.

## Run 3: WIN
- **3:25** The player pulls the plug at the socket, then whistles 🎵 while holding the pretend key. The monitor turns to static and the man shows monitor + "?".
- **3:27** The player takes the box. The man walks off to the wall camera.
- **3:29** The player carries the box through the top corridor. The man, standing at the camera, shows plug + "!".
- **3:31** The player puts the box at their desk (it's still visible on the drawer unit). The man shows 😊 and the monitor works again.
- **3:31** The player sits down.
- **3:53** Lin stands at the empty shelf and shows mailbox + "?".
- **4:00** Lin shows mailbox + 🤷. The player shows 🎉 with confetti.
- **4:01** End picture: Lin shrugs, the player whistles, and the box sits openly on the desk. Icons: Lin 🤷 player 🎵.

**Why:** Lin found nothing on the shelf to deliver.
**Player's cause:** blinding the camera, taking the box, putting it at the desk.
**Might not be a reaction:** Lin's head turns toward the corridor at 3:29, but she does the same in run 6. **Odd:** the box is in plain view in the win picture, yet Lin sees nothing.

## Run 4: WIN
- **3:24** At the grey machine in the right room, the player gets a label showing the suited man's face.
- **3:29** The player pulls the plug while whistling. Monitor static, and the man shows monitor + "?".
- **3:31** The player sticks the label on the box, which now shows the man's face. The man walks to the camera.
- **3:32** The man shows plug + "!".
- **3:34** The player sits down. The man shows 😊.
- **3:53** Lin picks up the box. Her bubble shows heart-gift plus the man's face.
- **4:00** Lin hands the box to the man, who shows 🥹. The player shows 🎉.
- **4:01** End picture: the man hugs the box, touched, under falling confetti. Icons: 💝 man 🥹.

**Why:** the box went to the man instead.
**Player's cause:** the label swap. The unplug presumably kept the camera from seeing it.

## Run 5: LOSS
- **3:24–3:32** Same as run 4: label, unplug, swap. At 3:32 the player passes right next to the man while holding the pretend key.
- **3:34** The player goes into the right room and stays there.
- **3:53** Lin picks up the box with the man's face on it. The player fast-forwards.
- **3:59** At the player's desk, Lin gives the box to the man, who shows 🥹.
- **4:00** Lin and the man show chair + "?", then 😠 👉 player. The player, far away, shows 😰.
- **4:01** End picture: the man holds the box, Lin shows player + "?", the chair is empty. Icons: chair ?

**Why:** the player wasn't at their desk.
**Player's cause:** not going back to the seat.
**Confusing:** the swap clearly worked (🥹), but the loss picture shows the man holding the box. A player could easily blame the box.

## Run 6: WIN
- **3:23** The player takes a broom from the far-right corner.
- **3:28** The player pokes the wall camera so it points at the potted plant, and the monitor shows the plant.
- **3:29** The man shows plant + 😊.
- **3:30** The player puts the broom back.
- **3:34** The player takes the box.
- **3:37** The player puts it at their desk.
- **3:38** The player sits down.
- **3:53 → 4:01** Same as run 3: Lin finds the empty shelf, shrugs, and the end picture is the same.

**Why:** the shelf was empty and nobody saw the box being taken.
**Player's cause:** turning the camera, taking the box, sitting down.

## Run 7: LOSS (3:23–3:30)
- **3:23** The player takes the broom.
- **3:29** The player pokes the camera from the same spot as in run 6, with a progress ring and the red cone on them. The man shows monitor + "?".
- **3:29** The man shows a spiky monitor + "!" 👉 player.
- **3:30** End picture: the monitor shows the player holding the broom. Icons: monitor 👉 player.

**Why:** the camera caught the player.
**What I can't tell:** why the same move worked at 3:28 in run 6 and failed at 3:29 here. The pictures don't show it. It might be the timing, or something else.

## Run 8: LOSS (3:25–3:54)
- **3:25** The player pulls the plug and whistles. The man shows monitor + "?".
- **3:27** The player takes the box.
- **3:29** The player drops the box on the floor of the top corridor. The man shows plug + "!".
- **3:30** The man shows 😊 and the monitor works again.
- **3:32** The player sits down.
- **3:50** At the corridor door, Lin shows heart-gift + "!".
- **3:52** Lin picks up the box and shows gift + "?".
- **3:53** Lin shows player + "!", then a spiky "!" with 😠.
- **3:54** End picture: Lin holds the box with the player's face on it, and the player is red-faced. Icons: Lin 💝 player ��.

**Why:** Lin found the box in the corridor and recognized whose it was.
**Player's cause:** leaving the box somewhere Lin walks past.

---

## Across runs
- Lin's 3:29 head turn and the man going with Lin at 4:00 happen whether or not the player does anything, so they're routine, not reactions.
- The monitor + "?" bubble means two different things. In runs 3, 4, 5 and 8 it follows the unplug, and nothing bad happens. In runs 2 and 7 it comes right before a bust.

### 1-read-2: reading.md

# Reading: Discreet Packaging (runs 9–10)

## Run 9 — Win

**Beats**
- 3:25 Red-haired player stands by the floor plug near the desk guy's monitor, with a ♪ bubble. The monitor shows static and the guy thinks "TV ?". It looks like the player unplugged it.
- 3:27 The guy walks off to the grey gadget on the top wall. The player takes the pink heart parcel from the shelf behind his desk.
- 3:29 The player carries the parcel up the top corridor. The guy shows "plug !".
- 3:30 The player drops the parcel on the floor of the right-hand room.
- 3:30 The guy plugs the cable back in and smiles 😊.
- 3:53 Lin (teal, glasses, bun) checks the empty shelf and shows "mailbox ?".
- 4:00 Lin, back in her office, shows a mailbox and a shrug to the guy. The player shows 🎉.
- 4:01 Green-framed end picture: Lin shrugging, the guy, the player humming. Icons: Lin, shrug figure, player, ♪.

**Why it ended:** Lin found no parcel on the shelf by 4:00, so nobody received it.

**Cause:** Moving the parcel off the shelf. Unplugging the monitor seems to be what got the guy away from his desk first.

**Might not be reactions:** The 😊 at 3:30 is about the fixed plug, not the player. The ♪ at 3:25 may just be the player's idle look. The parcel sat in plain view on a floor for half an hour and nobody noticed. The win depends on Lin only ever checking the shelf, which feels thin.

## Run 10 — Loss

**Beats**
- 3:25 and 3:27 are the same as run 9: unplug, then grab the parcel.
- 3:29 The player goes up the top corridor and then turns left.
- 3:30 The player walks into Lin's office still holding the parcel. Lin is at her desk. The guy fixes the plug and smiles 😊, as in run 9.
- 3:32 Lin shows "?" and a dotted line runs between her and the player.
- 3:32 Lin is now holding the parcel and shows "heart-gift !". There was no "used" caption, so the player didn't hand it over. Lin seems to have taken it.
- 3:33 Lin shows the player's face and "!".
- 3:33 A big angry 😠 burst comes from Lin and the room turns red.
- 3:34 Red-framed end picture: Lin holding the heart parcel, the player blushing. Icons: Lin, heart-gift, player, 😳. These match the card's 😳 icon.

**Why it ended:** Lin saw the player carrying the parcel, took it, and recognised it as theirs.

**Cause:** Carrying the parcel into Lin's line of sight.

**Might not be reactions:**
- Lin turns her head around 3:29 in both runs, so that glance is part of her routine.
- Her "?" at 3:32 could be about the player or could just be her routine.
- The angry 😠 doesn't fit the joke, which is about the player's embarrassment, not Lin being cross. I can't tell what made her angry.
- I also can't tell how the parcel got from the player to Lin.

### 2-compare: report.md

Verdict: fixable

## Runs

- **Run 1 (do nothing → mail call): `explained`.** "Lin delivered the box to the player in front of the man… No actions were recorded, so this is the default ending." Correct. The reader also correctly read the suited man walking over as his routine.
- **Run 2 (take the box on camera → caught): `explained`.** "The camera saw the player taking the box." Correct.
- **Run 3 (unplug, take, drawer → win, hidden): `explained`.** The reader named the empty shelf and the unplug-take-stash chain. But the drawer beat misled them (beat A below).
- **Run 4 (label, unplug, relabel → Bob gets it): `explained`.** "The box went to the man instead… the label swap. The unplug presumably kept the camera from seeing it." Correct.
- **Run 5 (same, but away at 4:00 → blamed): `explained`.** "The player wasn't at their desk." Correct. The reader warned that the end picture shows Bob holding the box, so "a player could easily blame the box." That's a real risk, but this reader wasn't fooled by it.
- **Run 6 (broom poke while the camera looks away → win, hidden): `explained`** as an ending. But the reader never saw the timing that made the poke safe, and that is what breaks run 7.
- **Run 7 (poke while the camera looks at you → caught): `partly`.**
  - Reading: "why the same move worked at 3:28 in run 6 and failed at 3:29 here. The pictures don't show it. It might be the timing, or something else."
  - What happened: the poke landed while the camera's sweep was pointing at the player. In run 6 it was pointing away.
  - Visual cause: missing cue. I checked the pictures. In run-06/02.png the cone is a faint grey wedge pointing down-left into the lobby, almost invisible against the floor. In run-07/02.png it's a bold red wedge right over the player. The cone only becomes readable at the moment it catches you, so the safe state never registers. The reader even wrote "the red cone on them" in run 7 and still didn't connect it to the outcome.
  - Fix: draw the camera's cone in a steady colour at all times, in Bob's colour as ways.md promises, and give the lens a visible "eye" that sweeps. Then a frame where it points away from the player under the camera reads as "now".
- **Run 8 (drop the box in the corridor → found): `explained`.** "Lin found the box in the corridor and recognized whose it was… leaving the box somewhere Lin walks past." Correct.
- **Run 9 (drop the box in the mailroom → win, hidden): `partly`.** The reader got the ending, but not why the scheme was safe (beats B and C below).
  - Reading: "The parcel sat in plain view on a floor for half an hour and nobody noticed. The win depends on Lin only ever checking the shelf, which feels thin." Also: "Unplugging the monitor seems to be what got the guy away from his desk first."
  - What happened: the unplug blinded the camera, so taking the box wasn't seen. Then the box was safe because nobody ever enters the mailroom. That is the contrast with run 8.
  - The reader credits the win to luck and gives the unplug the wrong job. A win the player thinks they got by luck hasn't taught the level.
- **Run 10 (carry the box into the office → Lin takes it): `explained`.** "Lin saw the player carrying the parcel, took it, and recognised it as theirs." Correct. But how the box changed hands, and Lin's "?", were both lost (beats D and E below).

## Beats that misled the reader

**A. Run 3: the drawer reads as "on the desk".**
- Reading: "the box is in plain view in the win picture, yet Lin sees nothing."
- What happened: the box was stuffed in the desk drawer, which hides it.
- Visual cause: the win card (run-03/08.png) draws the pink box sitting on top of the drawer unit, lid and hearts fully showing. It contradicts the mechanic it is rewarding.
- Fix: draw the drawer shut on a thin pink corner, with the box itself not visible. In play, add a "stuffed in" squash frame.

**B. Run 9: the unplug read as a distraction, not as blinding the camera.**
- Reading: "Unplugging the monitor seems to be what got the guy away from his desk."
- What happened: the point was static on the monitor, so the shelf grab wasn't seen. Bob leaving is a side effect.
- Visual cause: cause and effect too far apart. The run never shows the camera's view of the shelf at the moment of the grab.
- Fix: when the player takes the box during static, put a tiny static inset beside the monitor, or keep the camera cone visible but grey. "The camera couldn't see this" should be on screen at the moment of the grab.

**C. Run 9: the mailroom being safe was a missing cue.**
- Reading: "nobody noticed… feels thin."
- What happened: nobody ever walks into the mailroom. In the corridor (run 8), Lin's route passes the box.
- Visual cause: missing cue. Lin's 3:29 head turn and her 3:51 walk never show a path that skips the mailroom.
- Fix: around 3:50, show Lin's walking path or her cone sweeping the corridor and passing the mailroom door without entering. The box should sit just outside her cone.

**D. Run 10: the box jumps to Lin between frames.**
- Reading: "I also can't tell how the parcel got from the player to Lin."
- What happened: Lin took it off the player.
- Visual cause: missing cue. In run-10/05.png the player holds the box. In 06.png, the same minute, Lin has it at her desk. The only link is a dotted sight line.
- Fix: add a grab frame. Lin reaches out with a ✋ bubble and the box arcs from the player's hands to hers.

**E. Run 10: Lin's "?" was a real reaction the reader dismissed.**
- Reading: "Her '?' at 3:32 could be about the player or could just be her routine."
- What happened: her cone caught the player carrying the box. The "?" is the moment she sees them.
- Visual cause: a bubble that reads like routine. Lin uses an identical bare "?" on her own errands (mailbox + "?").
- Fix: make it the player's face + "?" (or box + "?") so it points at its cause, the way her later "player + !" does.

**F. Run 10: the 😠 burst reads as the wrong emotion.**
- Reading: "The angry 😠 doesn't fit the joke… I can't tell what made her angry."
- What happened: this is the "found" loss. The joke is the player's embarrassment, and the end card already says so with 😳.
- Visual cause: the bubble points the joke at Lin being cross. The same burst appears in run 8.
- Fix: replace 😠 with a delighted 💝 + 😍 (or 😏) from Lin, so the burst sets up the player's 😳 instead of making Lin look offended.

## Across runs
- The monitor + "?" bubble comes before both "nothing happens" (after an unplug) and a bust (runs 2 and 7). The reader worked it out, but the bubble is doing two jobs. Use static + "?" for the unplug, and keep a spiky monitor + "!" for being seen.

<!-- /cold-read:replay -->
