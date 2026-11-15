# Cold reads: discreet-packaging
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:title {"verdict":"works","date":"2026-11-15","commit":"7b3f187+dirty","hash":"8e13b64fe5a28f5ee521f2bf2bdee2949af45bed7e3c1d39f5fbf9d7b0f43fe0","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","ways":"28a60883ce2929ad8b4ea2268e4cc77337f1e5d99cecad70566d1853831a6153","prompts":"71812b7000506aab5e901a48dd63d8aa5d43c7546f39641d13d12179213bd417"},"model":"default","tally":{"miss":2,"near":3,"leak":0},"problems":{"blocker":0,"should":3,"nit":2}} -->
## title: works
Recorded 2026-11-15 at commit 7b3f187+dirty, by claude -p (model: default). Inputs 8e13b64fe5a2: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 2 miss, 3 near, 0 leak.
Problems: 0 blocker, 3 should, 2 nit.
Earlier problems: 0 fixed, 1 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-guess | guesses.md | 9 s | $0.02 |
| 2-judge | report.md | 28 s | $0.09 |
| all | | 38 s (the steps add up to 38 s) | $0.11 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 still there: "hands out the mail" makes it sound like a private delivery to your desk. What actually goes wrong is Lin holding the box up for the room to see, and the card doesn't say so. The danger is weaker than it should be. — Change "Lin hands out the mail at 4:00." to "Lin calls out the post at 4:00." (The card still says "Lin hands out the mail at 4:00." That sounds like a quiet drop at your desk, not Lin holding your box up in front of everyone.)

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] "hands out the mail" makes it sound like a private delivery to your desk. What actually goes wrong is Lin holding the box up for the room to see, and the card doesn't say so. The danger is weaker than it should be. — Change "Lin hands out the mail at 4:00." to "Lin calls out the post at 4:00." (recurring: premise-level?)
- E2 [should] The name "Discreet Packaging" pushes players toward fiddling with the packaging (rewrapping, relabelling), and that gets close to the label swap. The joke still works, but it hints at a method instead of naming the trouble. Fix: rename it "Love, Mum".
- E3 [should] "Don't let anyone see it" says what to avoid but not who's watching. The player learns about Bob and his camera only by playing. That's fine for keeping the method hidden, but the 4:00 danger needs the room in it. Fix: change "Lin hands out the mail at 4:00. Don't let anyone see it." to "At 4:00 Lin calls out the post in front of everyone. Don't let anyone see it."

### 1-guess: guesses.md

1. **Get to the parcel before 4:00 and grab it yourself.** Cut Lin out of the handoff, so the parcel never gets passed around in front of people. Suggested by: "Lin hands out the mail at 4:00", "3:20 PM".

2. **Rewrap or hide it.** Put it in a plain box, a bag or a drawer so it no longer looks pink and covered in hearts. Suggested by: "Discreet Packaging", "pink, covered in hearts".

3. **Get Lin away from the mail run.** Distract Lin, or delay them past the time everyone leaves, so the mail goes out with nobody watching. Suggested by: "Lin hands out the mail at 4:00", "Don't let anyone see it."

4. **Clear the room before the handoff.** Pull coworkers away from their desks around 4:00 so no one sees it arrive. Suggested by: "Don't let anyone see it."

5. **Make it look like someone else's.** Swap the label or let it look like it's for another person. This is weak: only "Discreet" hints at it at all.

Stake: you get embarrassed in front of the whole office (the 😳). The card doesn't say whether failing costs you anything beyond that, such as a game over or a lasting nickname.

### 2-judge: report.md

Verdict: works
- Stake: clear. The card says Mum's pink heart parcel will reach you in front of the office, and you have to keep anyone from seeing it. A stranger gets the embarrassment straight away. It's a bit weak only because "hands out" doesn't say Lin will hold the box up for everyone to see (see E1).
- Grab it before 4:00: near. This is step 2 of "No parcel today" (take the box), from "Lin hands out the mail at 4:00" and "3:20 PM". It misses the key step, which is blinding the camera.
- Rewrap or hide it: near. This matches the drawer in "No parcel today", from "Discreet Packaging" and "pink, covered in hearts". Again, nothing about the camera.
- Get Lin away from the mail run: miss. No route keeps Lin from the mail call.
- Clear the room: miss. No route clears the room.
- Make it look like someone else's: near. This is the label swap in "Bob gets it", but the reader admits the words barely support it ("only 'Discreet' hints at it"). Neither the card nor the name mentions Bob, his brown box or the camera that guards both routes.

## Earlier problems
- E1: still there (should). The card still says "Lin hands out the mail at 4:00." That sounds like a quiet drop at your desk, not Lin holding your box up in front of everyone.

## Problems
- should: The name "Discreet Packaging" pushes players toward fiddling with the packaging (rewrapping, relabelling), and that gets close to the label swap. The joke still works, but it hints at a method instead of naming the trouble. Fix: rename it "Love, Mum".
- should: "Don't let anyone see it" says what to avoid but not who's watching. The player learns about Bob and his camera only by playing. That's fine for keeping the method hidden, but the 4:00 danger needs the room in it. Fix: change "Lin hands out the mail at 4:00. Don't let anyone see it." to "At 4:00 Lin calls out the post in front of everyone. Don't let anyone see it."
- nit: "Mum" and "parcel" are British, but "mail" is American, and a British office worker would say "post". Fix: change "the mail" to "the post".
- nit: "sent a parcel to your office" reads a little stiff. Fix: "Mum's sent a parcel to work: pink, covered in hearts."

<!-- /cold-read:title -->

<!-- cold-read:sense {"verdict":"works","date":"2026-11-15","commit":"874a967","hash":"a3b32b4e493ce6d4fb7c92cb6871b7880a74ad6ee2b6f2ce5291f23484ac80cb","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","ways":"28a60883ce2929ad8b4ea2268e4cc77337f1e5d99cecad70566d1853831a6153","prompts":"4efae5d3d9191596f5720cdf7e7483eea858a949c44cf5579c3f9b7d49f613b3"},"model":"default","tally":{"sensible":9,"stretch":2,"nonsense":0},"problems":{"blocker":0,"should":4,"nit":1}} -->
## sense: works
Recorded 2026-11-15 at commit 874a967, by claude -p (model: default). Inputs a3b32b4e493c: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 9 sensible, 2 stretch, 0 nonsense.
Problems: 0 blocker, 4 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 57 s | $0.12 |
| all | | 57 s (the steps add up to 57 s) | $0.12 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] When the monitor goes to static, a real person first jiggles the cables at their own monitor. Walking to the camera only makes sense if Bob can see the camera's light is out from his counter, and ways.md never says he can. — Say the camera's light is visible from the counter, or have Bob check the monitor's own cables first and then go to the camera.
- E2 [should] In the plug route you take the box, and possibly peel and swap two labels, a few steps behind Bob while he's in the same room. A grab-and-go behind someone absorbed in a gadget works. Several seconds of peeling labels behind him is a stretch. — Have Bob hunt for the fault somewhere out of the room (a fuse box, or calling facilities from the lobby), or make sure the shelf is out of his line of sight while he thumps the camera.
- E3 [should] Bob gives up on the camera even though the broom or a chair would free it. — Have him try the broom from the floor or stand on a chair, fail because it's wedged deep in the plant, and mutter "facilities." Or have him call facilities, who say tomorrow. Either way it still stays stuck today.
- E4 [should] Nothing says who put the parcel in the pigeonholes. If Bob, at the counter, signed for it, he has already seen it, and the "she never knew there was a pink one" logic breaks for him. — Say the courier dropped it straight into the back office, or that it was in the morning post that nobody sorted.

### 1-judge: report.md

Verdict: works

- Pull the plug (camera blinder): stretch. Pulling a plug quietly and the camera thump both ring true. But the window only opens while Bob is standing in the back office with his back turned, a few steps from the shelf.
- Poke the camera into the plant (camera blinder): stretch. A knocked camera with nobody watching is believable. A boss giving up without trying a chair, or the broom you just used, is a little convenient.
- 1. Bob gets it (win): sensible. Whoever hands out the post goes by the label. Bob in tears is an absurd result, and the method is ordinary.
- 2. No parcel today (win): sensible. Nobody misses a parcel they didn't know about. The drawer and the store room are both places nobody looks.
- The mail call (lose): sensible. Calling out a parcel at mail call is exactly what happens.
- The mail call, and you're not there (lose): sensible. Lin announcing a parcel for someone who isn't there is normal. Holding it up to an empty chair is just staging.
- Caught on camera (lose): sensible. A boss watching his monitor would point at someone fiddling with parcels or poking his camera.
- Caught in person (lose): sensible. Bob notices a pink box carried right past him.
- Found (lose): sensible. Anyone picks up a stray box in the corridor and reads the label.
- Spotted (lose): sensible. A coworker spotting a box covered in hearts asks about it loudly; that's how people are.
- Twenty minutes of work (setback): sensible. A boss handing busywork to someone loitering is very real.

## Problems
- should: When the monitor goes to static, a real person first jiggles the cables at their own monitor. Walking to the camera only makes sense if Bob can see the camera's light is out from his counter, and ways.md never says he can. — Say the camera's light is visible from the counter, or have Bob check the monitor's own cables first and then go to the camera.
- should: In the plug route you take the box, and possibly peel and swap two labels, a few steps behind Bob while he's in the same room. A grab-and-go behind someone absorbed in a gadget works. Several seconds of peeling labels behind him is a stretch. — Have Bob hunt for the fault somewhere out of the room (a fuse box, or calling facilities from the lobby), or make sure the shelf is out of his line of sight while he thumps the camera.
- should: Bob gives up on the camera even though the broom or a chair would free it. — Have him try the broom from the floor or stand on a chair, fail because it's wedged deep in the plant, and mutter "facilities." Or have him call facilities, who say tomorrow. Either way it still stays stuck today.
- should: Nothing says who put the parcel in the pigeonholes. If Bob, at the counter, signed for it, he has already seen it, and the "she never knew there was a pink one" logic breaks for him. — Say the courier dropped it straight into the back office, or that it was in the morning post that nobody sorted.
- nit: With you not there, Lin would usually just put a parcel on your desk rather than hold it up to an empty chair. — Have her leave it on your desk, pink and plain for everyone to see. That's the same loss and more natural.

<!-- /cold-read:sense -->

<!-- cold-read:motives {"verdict":"works","date":"2026-11-15","commit":"7b3f187+dirty","hash":"8dbc4a51de38b4e02c617fd22a1eb14fb7a5506adaefa3457cda2a146ddf58d9","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","who":"ef93ff1446f2d370e00e74c688be8240bf4791b7ac97be60505859ac11e51f45","prompts":"aa0481bd7d2903c1741f536b834919fec681febf17e0865d79a523b4af6bf462"},"model":"default","tally":{"motivated":2,"binds":1,"thin":1,"unmotivated":0,"contradicts":0,"only-you":0},"problems":{"blocker":0,"should":3,"nit":2}} -->
## motives: works
Recorded 2026-11-15 at commit 7b3f187+dirty, by claude -p (model: default). Inputs 8dbc4a51de38: the card, premise.md's who does what, the pass's prompts.
Items: 2 motivated, 1 binds, 1 thin, 0 unmotivated, 0 contradicts, 0 only-you.
Problems: 0 blocker, 3 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 38 s | $0.08 |
| all | | 38 s (the steps add up to 38 s) | $0.08 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] Nothing on screen explains why the store room is safe. In a real office people pop in for paper or toner, and the player has no way to know nobody will. If a route hides the box there, it rests on a promise the player can't see. Fix: show a reason early, such as a "Cleaning supplies, staff only" sign or a cleaner's rota with "6:00" on the door, or Lin glancing at it and shrugging.
- E2 [should] Bob's 3:56 walk to your office has no cause on screen. Lin is already bringing the post, so a manager who guards his counter all afternoon leaving it looks like a puzzle timing, not a habit. Fix: show it earlier. For example, at 3:20 he calls out "mail at four, I'll come and get mine," or he looks at his watch and a box icon at 3:55.
- E3 [should] Lin shouting and pointing at you for "anything sneaky" reads as snitching, which a friendly coworker rarely does. Fix: make it a curious, loud "What are you doing?" (your face, ?) that Bob overhears, so the cost is the same but the motive is nosiness.

### 1-judge: report.md

Verdict: works
- Bob: motivated. Each thing he does has a shown cause: he smiles when the plant drifts into the picture, which is a habit. Static on his screen (static, ?) takes him to the camera. He thumps it, spots the cable (plug, !) and plugs it back in. When the picture is all leaf (leaf, cross) he tries once, fails, and leaves it for facilities (wrench, calendar). That's a real manager who gives up. He never breaks his "lobby and screen only" habit. One weak spot: nothing shown explains why he walks to your office at 3:56 instead of waiting at his counter.
- Lin: motivated. Handing out the mail is her job, and the card announces the 4:00 mail call. Leaving at 3:50, reading labels, taking only what is on the shelf ("she never knew there was another"), shrugging or looking at an empty chair all follow from that. Lighting up at the heart box fits who she is. Shouting and pointing at "anything else sneaky" is less like a coworker, but it's consistent.
- Anyone: thin. Picking up a loose box and reading the label is ordinary behaviour, and it shows (box, !). But "nobody opens the store room before the cleaner comes at 6" is just stated. Nothing on screen gives a reason, such as a locked door, a sign, or a habit.
- The card's rule: binds. The card sets a goal for you ("don't let anyone see it"), not an office rule that coworkers would have to keep too.

## Problems
- should: Nothing on screen explains why the store room is safe. In a real office people pop in for paper or toner, and the player has no way to know nobody will. If a route hides the box there, it rests on a promise the player can't see. Fix: show a reason early, such as a "Cleaning supplies, staff only" sign or a cleaner's rota with "6:00" on the door, or Lin glancing at it and shrugging.
- should: Bob's 3:56 walk to your office has no cause on screen. Lin is already bringing the post, so a manager who guards his counter all afternoon leaving it looks like a puzzle timing, not a habit. Fix: show it earlier. For example, at 3:20 he calls out "mail at four, I'll come and get mine," or he looks at his watch and a box icon at 3:55.
- should: Lin shouting and pointing at you for "anything sneaky" reads as snitching, which a friendly coworker rarely does. Fix: make it a curious, loud "What are you doing?" (your face, ?) that Bob overhears, so the cost is the same but the motive is nosiness.
- nit: The plant beat is pinned to "about 3:21", but the plant comes into view on every sweep. It's unclear whether he smiles every time. Fix: say he smiles on every sweep, so the player can read it as a pattern.
- nit: Bob plugs the camera back in and smiles without ever wondering who pulled the plug. Fix: a brief look around (?) before he heads back to his counter.

<!-- /cold-read:motives -->

<!-- cold-read:props {"verdict":"works","date":"2026-11-15","commit":"7b3f187+dirty","hash":"53949a76a7a817cbe5a22b3a16f154a6e522537645464b5047fa92876bc1bb89","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","things":"afabf5cd7953649b68db326398bbf12287b701b53f10eee7080d1976062b0e07","prompts":"e4a62e7d4c56bb76d5cc46d69b3c0fd96478427c533f15affaaa5f43d93d7558"},"model":"default","tally":{"fits":9,"odd":2,"pointless":0,"misleading":0},"problems":{"blocker":0,"should":2,"nit":2}} -->
## props: works
Recorded 2026-11-15 at commit 7b3f187+dirty, by claude -p (model: default). Inputs 53949a76a7a8: the card, premise.md's things in the office, the pass's prompts.
Items: 9 fits, 2 odd, 0 pointless, 0 misleading.
Problems: 0 blocker, 2 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 35 s | $0.07 |
| all | | 35 s (the steps add up to 35 s) | $0.07 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The plant next to the camera is there for the puzzle, not for the office. Nothing explains why its leaves reach camera height, and it looks like the decorative corner plants, so the player has no reason to notice it. — Put it on top of a tall filing cabinet or in a hanging basket by the door, and make it visibly a different plant from the corner ones.
- E2 [should] The brown box is described as Bob's "ordinary daily parcel". A daily parcel for one person is unusual, and the explanation openly says it exists to teach the rule. — Give it an everyday reason that works every loop, such as Bob's toner or supplies order arriving today, and drop the word "daily".

### 1-judge: report.md

Verdict: works

- The camera: fits. A security camera over the pigeonholes in the back office is normal, and its fan on the floor shows clearly that it is live.
- The plant: odd. Offices have tall plants by the door, but this one's only stated reason for being there is that it makes the broom trick work. Its leaves reach camera height, and it looks the same as the corner plants, which are only decoration.
- Bob's monitor: fits. Front-desk staff often have the camera feed on their counter, and the screen shows what the camera sees.
- The power strip: fits. A cheap office camera plugged into a floor power strip is believable, and the cable running up the wall connects the strip to the camera.
- The broom: fits. It belongs in a store room for cleaning things, and a broom on a wall clip looks like you can take it.
- The pigeonholes: fits. They belong in a back office where mail is sorted, and the label card you see up close shows they can be used.
- The brown box: odd. A parcel for Bob is fine, but "ordinary daily parcel" means Bob gets a box every day, which is unusual.
- The pink box: fits. The mission card sets it up.
- Your desk: fits. A drawer is the obvious place to hide something, and it looks like it opens.
- Lin's desk, the counter, the lobby's glass door, the store room: fits. These are normal furniture, and their stated positions explain who faces which way.
- The wall clock, windows, paintings and corner plants: fits. They are normal office decoration. In a level with a deadline the clock will draw the eye, but it is just a clock.

## Problems
- should: The plant next to the camera is there for the puzzle, not for the office. Nothing explains why its leaves reach camera height, and it looks like the decorative corner plants, so the player has no reason to notice it. — Put it on top of a tall filing cabinet or in a hanging basket by the door, and make it visibly a different plant from the corner ones.
- should: The brown box is described as Bob's "ordinary daily parcel". A daily parcel for one person is unusual, and the explanation openly says it exists to teach the rule. — Give it an everyday reason that works every loop, such as Bob's toner or supplies order arriving today, and drop the word "daily".
- nit: The store room holds the cleaning things and the cleaner comes at 6, yet it is dusty and full of cobwebs. If the cleaner gets the broom out every evening, the cobwebs don't add up. — Say the cleaner brings their own cart and this cupboard is old overflow storage, or just remove the cobwebs.
- nit: All the cubbies are empty "today", in a room built around mail being handed out. — Put some ordinary letters in a few cubbies so it reads as a working mailroom; they don't need to be usable.

<!-- /cold-read:props -->

<!-- cold-read:joke {"verdict":"works","date":"2026-11-15","commit":"7b3f187","hash":"259b00f4f117b012a36d1c4f0273da050a1888dcdbf85d464f294be088952ed3","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","ways":"28a60883ce2929ad8b4ea2268e4cc77337f1e5d99cecad70566d1853831a6153","prompts":"a4db88684bb737e23a87ca6a38aba544ee72fc48b552bd042e8767ee6f88c0a7"},"model":"default","tally":{"funny":4,"payoff":1,"mild":4,"chore":1,"flat":0,"undescribed":0},"problems":{"blocker":0,"should":5,"nit":1}} -->
## joke: works
Recorded 2026-11-15 at commit 7b3f187, by claude -p (model: default). Inputs 259b00f4f117: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 4 funny, 1 payoff, 4 mild, 1 chore, 0 flat, 0 undescribed.
Problems: 0 blocker, 5 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 33 s | $0.09 |
| all | | 33 s (the steps add up to 33 s) | $0.09 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] "No parcel today" ends flat. A shrug and a hum is the plain way out with no picture — fix: the drawer won't quite shut, and a pink heart-covered corner pokes out behind you while Lin shrugs and you hum.
- E2 [should] The "caught in person" card is just a point, so the loss that should hurt most doesn't use the hearts — fix: Bob takes the box from you and turns it over slowly, holding it up to read Mum's card while you go red.
- E3 [should] In the "caught on camera" card, the frozen frame shows nothing funny — fix: freeze the monitor on the most incriminating frame, with you clutching the pink heart box like a stolen baby.
- E4 [should] "Found" is mild. The finder just holds out the box — fix: Lin finds it and walks it round the office asking whose it is, holding it up at each desk until she reaches yours.
- E5 [should] Twenty minutes of work has no picture, it's only lost time — fix: Bob drops a teetering stack of files on your desk right in front of the drawer, so you're stuck at your desk going through them while the clock ticks towards 4:00.

### 1-judge: report.md

Verdict: works
- Bob gets it (win): funny. Big stern Bob hugs Mum's pink heart box in tears while Lin hands you his dull brown one. The stern boss gets the soppy parcel, which is the best picture in the level.
- No parcel today (win): mild. You hum, the box is in your drawer and Lin shrugs. That is just the obvious way out (hide it) and the relief of getting away with it. Nothing on screen is funny.
- The mail call (lose): funny. Lin holds the pink heart box up high with your face on it, Bob turns to look and you go red. This is the moment the whole level makes you dread.
- The mail call, you're not there (lose): funny. The pink box sits in a spotlight beside your empty chair, so your absence makes it worse.
- Caught on camera (lose): mild. Bob jabs at a frozen monitor frame with you going red behind him. It's a caught card, but what's in the frozen frame isn't the joke.
- Caught in person (lose): mild. Bob points at you. That's a generic caught card, and the hearts play no part in it.
- Found (lose): mild. Someone holds out a box with your face on it. It only works because the box is pink.
- Spotted (lose): funny. Lin lights up and asks out loud, in front of everyone, who sent it.
- Twenty minutes of work (lose): chore. The boss gives you work and time runs out. There's no picture, only a delay.
- The ending: payoff. Stern Bob in tears hugging a pink heart parcel is funnier than the obvious version, where you just hide the box.

## Problems
- should: "No parcel today" ends flat. A shrug and a hum is the plain way out with no picture — fix: the drawer won't quite shut, and a pink heart-covered corner pokes out behind you while Lin shrugs and you hum.
- should: The "caught in person" card is just a point, so the loss that should hurt most doesn't use the hearts — fix: Bob takes the box from you and turns it over slowly, holding it up to read Mum's card while you go red.
- should: In the "caught on camera" card, the frozen frame shows nothing funny — fix: freeze the monitor on the most incriminating frame, with you clutching the pink heart box like a stolen baby.
- should: "Found" is mild. The finder just holds out the box — fix: Lin finds it and walks it round the office asking whose it is, holding it up at each desk until she reaches yours.
- should: Twenty minutes of work has no picture, it's only lost time — fix: Bob drops a teetering stack of files on your desk right in front of the drawer, so you're stuck at your desk going through them while the clock ticks towards 4:00.
- nit: In the Bob route, Bob's tears could use a reason we can see — fix: as Bob hugs it, show the card on the box reading "To my little soldier, love Mum".

<!-- /cold-read:joke -->

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"62eb758","hash":"e66240ab52887d52aa877164631ba84fe41897832928f9dbd1a5d86df37c55e9","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","premise":"e01f4c0f3b10f56cb5ab5866f9a42fd782233ec69bc9412e1c20de2c5eea8e6a","prompts":"f5883160f1d3858e02431a0eee883b8939a1a09664f6e614e9f267258968625e"},"model":"default","problems":{"blocker":2,"should":4,"nit":2}} -->
## premise: fixable
Recorded 2026-11-15 at commit 62eb758, by claude -p (model: default). Inputs e66240ab5288: the card, premise.md, the pass's prompts.
Problems: 2 blocker, 4 should, 2 nit.
Earlier problems: 5 fixed, 0 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 12 s | $0.02 |
| 2-review | report.md | 173 s | $0.68 |
| all | | 186 s (the steps add up to 186 s) | $0.70 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 fixed: The card no longer tells you to make someone else get the box. It now names only the mail call and the box.
- E2 fixed: Bob's brown box now sits on the shelf every loop. Lin hands it to him at every mail call, which teaches "a box goes to the face on its label" and gives Bob a reason to go to the mail call. The new trouble this brings is listed below.
- E3 fixed: The drawer shuts on the box, and the win card draws the drawers closed.
- E4 fixed: If you're absent and did nothing, the `noshow` card shows the box held up over your empty chair. If you're absent after a route, it's a win with an unlit chair.
- E5 fixed: Bob now comes over when his screen shows only leaf, tugs at the camera, fails, and gives up (🔧📅). The player sees all of this the first time they try the broom, at no cost.

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] ** The card says "Don't let anyone see it", but the game never enforces that. Bob has watched the pink box on his monitor since 3:20. Lin looks at it at the shelf at 3:54 (💝 @player), and nothing happens. In the label-swap win, the box is held out in front of everyone at the mail call. A player who takes the card literally rules out the swap and thinks they've already lost by 3:21. The first reader asked exactly this ("noticing the parcel, or knowing it's mine?"). The real rule is that nobody may connect the box to you. — Fix: card line 2: "Lin hands out the mail at 4:00. Nobody can know it's yours."
- E2 [blocker] ** The mail call makes no sense in a real office. At 3:54 Lin picks Bob's daily box off the shelf two tiles behind his chair. Then both of them walk to another room so she can hand it to him there. No one carries a box away from the man it's for, just to give it to him somewhere else. Bob also leaves the lobby and the screen he never looks away from. The puzzle needs this so the handover happens in your office. — Fix: hold the mail call at Bob's counter. Lin brings the post there, Bob is already in his seat, and you walk over at 4:00 like anyone collecting their post.
- E3 [should] ** When Bob catches you, the card shows him angry and jabbing a finger (😠👉 @player, or 📺👉 @player on camera), and the day ends in a firing. But the crime is picking up your own parcel. The trouble is supposed to be embarrassment, not breaking a rule, and this loss card is the only one where nobody even sees the hearts. — Fix: when Bob sees the box in your arms (in person or on the monitor), show him gawping at the pink box (📺 💝 @player 😳), and keep the angry card for the label swap only.
- E4 [should] ** The pressure of "in front of everyone" comes down to two people, Lin and Bob. In the mail-call loss only Bob turns to look. The humiliation is meant to be the whole office laughing, but there is nobody else there to laugh. — Fix: add one or two seated colleagues to your office who just type and glance around, and draw them looking up in the mail and spotted cards.
- E5 [should] ** The name "Discreet Packaging" makes the first reader wonder about re-wrapping the box. No re-wrap route exists. The name also draws your eye to the outside of the box, which is where the label swap happens, so it is close to a hint. — Fix: rename it after the trouble, e.g. "Love, Mum".
- E6 [should] ** After the broom poke, the camera clunks into the plant (sfx `bang`) a few tiles from Bob. He goes to free it but never wonders how it moved, and he never looks round the room. A camera doesn't knock itself into a plant. — Fix: before tugging, have Bob glance round the back office (👀). That gives the player a visible reason to be gone already.

### 1-card: first-read.md

**Situation:** It's 3:20 PM. My mum has posted a loud pink parcel covered in hearts to my office. It's sitting somewhere in the building, probably with Lin. At 4:00 Lin hands out the mail, maybe walking it desk to desk, maybe calling out names in front of everyone.

**Goal:** Get the parcel before 4:00 without anyone seeing it. Or make sure that when it's handed out, nobody sees it.

**If I fail:** Someone sees it and I'm humiliated (😳). Maybe the whole office laughs.

**Questions:**
- Where is the parcel now? Mailroom, Lin's desk, a cart?
- Does Lin count as "anyone"? Lin has presumably seen it already.
- What does "it" mean: the box, or what's inside? Is the box the problem, or the contents?
- Can I open it, re-wrap it, bin it or hide it? Do I have to end up holding it?
- Does seeing it mean noticing the parcel, or knowing it's mine?
- **The name:** is "Discreet Packaging" a joke, since this box is the opposite of discreet? Or is it a hint that I should re-package it to look boring?

### 2-review: report.md

Verdict: fixable

**Best thing:** At the 4:00 mail call, big stern Bob in his suit and tie hugs Mum's pink heart box, his own face on the label and tears running down, while Lin holds his dull brown box out to you.

## Earlier problems
- E1: fixed. The card no longer tells you to make someone else get the box. It now names only the mail call and the box.
- E2: fixed. Bob's brown box now sits on the shelf every loop. Lin hands it to him at every mail call, which teaches "a box goes to the face on its label" and gives Bob a reason to go to the mail call. The new trouble this brings is listed below.
- E3: fixed. The drawer shuts on the box, and the win card draws the drawers closed.
- E4: fixed. If you're absent and did nothing, the `noshow` card shows the box held up over your empty chair. If you're absent after a route, it's a win with an unlit chair.
- E5: fixed. Bob now comes over when his screen shows only leaf, tugs at the camera, fails, and gives up (🔧📅). The player sees all of this the first time they try the broom, at no cost.

## Problems
- **blocker:** The card says "Don't let anyone see it", but the game never enforces that. Bob has watched the pink box on his monitor since 3:20. Lin looks at it at the shelf at 3:54 (💝 @player), and nothing happens. In the label-swap win, the box is held out in front of everyone at the mail call. A player who takes the card literally rules out the swap and thinks they've already lost by 3:21. The first reader asked exactly this ("noticing the parcel, or knowing it's mine?"). The real rule is that nobody may connect the box to you. — Fix: card line 2: "Lin hands out the mail at 4:00. Nobody can know it's yours."
- **blocker:** The mail call makes no sense in a real office. At 3:54 Lin picks Bob's daily box off the shelf two tiles behind his chair. Then both of them walk to another room so she can hand it to him there. No one carries a box away from the man it's for, just to give it to him somewhere else. Bob also leaves the lobby and the screen he never looks away from. The puzzle needs this so the handover happens in your office. — Fix: hold the mail call at Bob's counter. Lin brings the post there, Bob is already in his seat, and you walk over at 4:00 like anyone collecting their post.
- **should:** When Bob catches you, the card shows him angry and jabbing a finger (😠👉 @player, or 📺👉 @player on camera), and the day ends in a firing. But the crime is picking up your own parcel. The trouble is supposed to be embarrassment, not breaking a rule, and this loss card is the only one where nobody even sees the hearts. — Fix: when Bob sees the box in your arms (in person or on the monitor), show him gawping at the pink box (📺 💝 @player 😳), and keep the angry card for the label swap only.
- **should:** The pressure of "in front of everyone" comes down to two people, Lin and Bob. In the mail-call loss only Bob turns to look. The humiliation is meant to be the whole office laughing, but there is nobody else there to laugh. — Fix: add one or two seated colleagues to your office who just type and glance around, and draw them looking up in the mail and spotted cards.
- **should:** The name "Discreet Packaging" makes the first reader wonder about re-wrapping the box. No re-wrap route exists. The name also draws your eye to the outside of the box, which is where the label swap happens, so it is close to a hint. — Fix: rename it after the trouble, e.g. "Love, Mum".
- **should:** After the broom poke, the camera clunks into the plant (sfx `bang`) a few tiles from Bob. He goes to free it but never wonders how it moved, and he never looks round the room. A camera doesn't knock itself into a plant. — Fix: before tugging, have Bob glance round the back office (👀). That gives the player a visible reason to be gone already.
- **nit:** You can swap the labels only if you take your box and then use the shelf a second time while holding it. A player who takes the box and walks off never finds the second action. — Fix: while you hold the pink box near the shelf, highlight the brown box's label.
- **nit:** Bob's counter faces the glass front door and he watches a CCTV feed, so he reads as a receptionist or security guard. That makes him an odd boss to hand you 20 minutes of work. — Fix: give him a name plate with a manager's icon on the counter, or a visible clipboard he checks.

<!-- /cold-read:premise -->

<!-- cold-read:verbs {"verdict":"fixable","date":"2026-11-15","commit":"7b3f187+dirty","hash":"4a37878278d9744618c42251f8b45b7857ee6c440897af64c68d2045b366ae57","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","verbs":"846670528b6830085ebb78a4dcec6277fc83f04895f184b8f7c9e55c73866ba6","prompts":"061e477a6c379be6b6b5b6834f94ffc76cc7e18374b9322d5658da9920b335c4"},"model":"default","tally":{"fits":8,"odd":0,"wrong":2},"problems":{"blocker":2,"should":3,"nit":2}} -->
## verbs: fixable
Recorded 2026-11-15 at commit 7b3f187+dirty, by claude -p (model: default). Inputs 4a37878278d9: the card, the verb sheets, the pass's prompts.
Items: 8 fits, 0 odd, 2 wrong.
Problems: 2 blocker, 3 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 25 s | $0.07 |
| 2-judge | report.md | 36 s | $0.11 |
| all | | 60 s (the steps add up to 60 s) | $0.18 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Pretending with the broom while standing (02 panel 2) shows the broom raised over the head, not held to the ear like a phone. Faking a phone call with a broom makes no sense anyway, and it doesn't hide the broom. — Mark the broom bulky, like the parcel, so pretending is refused. If the broom must stay pretend-able, give it its own pose that makes sense, such as leaning on it.
- E2 [blocker] Pretending with the broom while walking (02 panel 3) uses the folder stride, but the picture is plain carrying. A player can't see that anything happened, and a broom doesn't pass as a folder. — Same fix: refuse pretending for the broom, or draw a pose that actually differs from carrying.
- E3 [should] The rules disagree with each other. A small parcel is "bulky" and can't be hidden, but a two-metre broom can. A player who learns from the parcel that you can't fake it with this in hand will be confused by the broom. — Base bulky on size, which puts the broom in that group.
- E4 [should] Refused pretending gives no feedback (01 panels 2–3). The player presses the key, nothing visibly happens, and they may think the key is broken. — Show a quick ✖️ or a shrug on the player when pretending is refused.
- E5 [should] The E prompt looks the same for drop (panel 4) and pick_up (panel 6) on both sheets. The engine has a ⬇️ icon for drop and ✋ for pick_up, but neither is drawn. — Put the verb's emoji on the prompt.

### 1-read: reading.md

# Reading: verbs/

## 01.png: pink square with hearts and a small brown-haired figure (could be a card, a box, or a photo; I can't tell which)

1. **Carrying.** The player, in red with a brown bun, faces left with the pink square at their chest. It has a yellow ring around it and an "E" key prompt beside it. Corner box: pink square.
2. The player faces down-left and holds the square a little lower. It is still in hand with a ring and an E prompt. I can't tell what action this is. It looks like carrying from a slightly different angle.
3. The player turns away from the camera (back of the head showing) and holds the square on their right. Same ring and E prompt, and it is still held. I can't see anything happening to the object.
4. The player faces the camera and holds the square out to the left. Same ring and E prompt, and it is still held. The pose looks like offering or showing it, but nothing changes about the object.
5. **Put down.** The corner box now shows an empty hand. The pink square lies on the floor to the player's right, drawn larger, with a ring and an E prompt.
6. This looks the same as panel 5 to me: empty hand, square on the floor. I can't find a difference, so I can't tell what this panel adds.
7. **Picked up again.** The corner box shows the pink square again and the player holds it on their right with a ring and an E prompt.

## 02.png: broom (long brown stick, straw head, red band)

1. **Carrying.** The player faces left with the broom held upright at their side, with a ring and an E prompt. Corner box: broom.
2. The player faces the camera and holds the broom straight up so it rises above their head. The ring is at head height with the E prompt beside it. It is still held. It could be a raise or swing, but I can't tell.
3. The player turns away and holds the broom upright on their right side. Ring and E prompt, still held. I can't tell what action this is.
4. The player faces the camera and holds the broom out to the left. Ring and E prompt, still held. I can't tell whether they are sweeping, poking or offering it.
5. **Put down.** The corner box shows an empty hand. The broom lies flat on the floor to the right with a ring and an E prompt.
6. This looks the same as panel 5 to me: empty hand, broom on the floor. I can't see a difference.
7. **Picked up again.** The corner box shows the broom and the player holds it upright on their right.

## What a first-time player would notice

- **The object never changes.** In both sheets, panels 2–4 show nothing happening to it. It stays in hand, unchanged, with the same ring and the same E prompt. The only differences I can see are which way the player faces and where the object sits. If these are meant to be different actions, I can't tell them apart. They read to me as "carrying, seen from four directions."
- **Panels 5 and 6 look identical in both sheets.** If one is "dropped" and the other something else, like "placed" or "thrown," nothing visible shows the difference.
- **The E prompt never changes.** It looks the same in every panel, so it doesn't tell me which action I'm about to do.
- **Both objects follow the same pattern.** Out of 14 panels, the only things I can confidently read are carrying, putting it on the floor, and picking it back up.

### 2-judge: report.md

Verdict: fixable

- parcel / carry: fits — panel 1 shows the parcel held at the chest, and the hand slot matches.
- parcel / pretend (standing): fits — panel 2: a bulky parcel can't be hidden, so the engine refuses and the picture shows plain carrying. That makes sense, but nothing on screen says it was refused.
- parcel / pretend (walking): fits — panel 3 is the same refusal and also looks like plain carrying. The same missing cue applies.
- parcel / drop: fits — from panel 4 to 5 the hand slot goes empty and the parcel is on the floor beside you.
- parcel / pick_up: fits — panel 6 shows it on the floor with a prompt, and in panel 7 it is back in hand and in the slot.
- broom / carry: fits — panel 1 shows the broom upright at the side.
- broom / pretend (standing): wrong — panel 2 is meant to be the "phone to your ear" pose, but the broom is held straight up in front of the face, past the head. It reads as raising or swinging it, not a phone call. Holding a broom to your ear doesn't hide it, and no office worker would do it.
- broom / pretend (walking): wrong — panel 3 is meant to be "stride with a folder", but it looks exactly like carrying. The reader couldn't tell what happened. A broom can't pass for a folder, and the picture doesn't try.
- broom / drop: fits — from panel 4 to 5 the broom is on the floor and the hand is empty.
- broom / pick_up: fits — panels 6 and 7 show it back in hand.

## Problems
- blocker: Pretending with the broom while standing (02 panel 2) shows the broom raised over the head, not held to the ear like a phone. Faking a phone call with a broom makes no sense anyway, and it doesn't hide the broom. — Mark the broom bulky, like the parcel, so pretending is refused. If the broom must stay pretend-able, give it its own pose that makes sense, such as leaning on it.
- blocker: Pretending with the broom while walking (02 panel 3) uses the folder stride, but the picture is plain carrying. A player can't see that anything happened, and a broom doesn't pass as a folder. — Same fix: refuse pretending for the broom, or draw a pose that actually differs from carrying.
- should: The rules disagree with each other. A small parcel is "bulky" and can't be hidden, but a two-metre broom can. A player who learns from the parcel that you can't fake it with this in hand will be confused by the broom. — Base bulky on size, which puts the broom in that group.
- should: Refused pretending gives no feedback (01 panels 2–3). The player presses the key, nothing visibly happens, and they may think the key is broken. — Show a quick ✖️ or a shrug on the player when pretending is refused.
- should: The E prompt looks the same for drop (panel 4) and pick_up (panel 6) on both sheets. The engine has a ⬇️ icon for drop and ✋ for pick_up, but neither is drawn. — Put the verb's emoji on the prompt.
- nit: Panel 6 looks identical to panel 5 on both sheets. — Show the player stepping toward the item, or drop panel 6 and use panel 5 as the "before" picture for pick_up.
- nit: The parcel on the floor (panels 5–6) is drawn noticeably larger than the one in hand. — Draw it at the same size in both places.

<!-- /cold-read:verbs -->

<!-- cold-read:faces {"verdict":"fixable","date":"2026-11-15","commit":"62eb758","hash":"9bce2fc329993474d9df98120484c130634e9c97af4045189438c68aad2d6055","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","checks":"23a634ba8e0c0d62cdfbe73923855560da3239679ba31c32fa6dd0052f134b6e","faces":"5506249ff70fc6959ca1bb0220db1d48a2a17cd4529a1c1c06a524a03c34bcb0","prompts":"7b1353c6de0c5cf6c70013ea3cb8b0b9dfaae148125f1ffbe7155582b0b04938"},"model":"default","tally":{"clear":27,"vague":4,"misread":0},"problems":{"blocker":1,"should":4,"nit":1}} -->
## faces: fixable
Recorded 2026-11-15 at commit 62eb758, by claude -p (model: default). Inputs 9bce2fc32999: the card, route-checks.js, the bubbles, the pass's prompts.
Items: 27 clear, 4 vague, 0 misread.
Problems: 1 blocker, 4 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 35 s | $0.13 |
| 2-judge | report.md | 139 s | $0.55 |
| all | | 174 s (the steps add up to 174 s) | $0.69 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 24, the calendar with JUL 17 is the only thing that tells the player whether the camera route worked, but it reads as a specific date to remember, not "fix it later." The player can't tell if the camera is down and may hunt for a July 17 clue. — Use 🔧 + ⏳ (or 📹 + 🤷) so it says "not now."
- E2 [should] When Lin says 💝 + a face aloud (3, 19), it also reads as Lin confessing a crush, and the boss's touched 🥹 in 20 fits that misreading. The parcel's route stays visible in hand, so nobody is misled about where it went. — Add the box: 📦💝 + face, so the spoken line says "the heart parcel is for…".
- E3 [should] 22's 🌿😤 doesn't connect the plant to the monitor or camera, the sprig doesn't match the 🪴 in 1, and 😤 reads either way. 23 recovers the chain. — Use 🖥️🌿 + 😠, with the same 🪴 glyph as in 1.
- E4 [should] 25's blank paper pointed at the player reads as "mail for you" in a level about mail. — Use 👉 + the player's desk/chair, or 📄💼, so it means "back to work."
- E5 [should] 8 uses a chair to mean "she's gone," but the game uses the player's face for her everywhere else. — Use the player's face + ❓ ("where is she?"), with the empty chair as an optional second glyph.

### 1-read: reading.md

I've viewed all 31 bubbles and am writing up my reading now.

**Key I worked out as I went:** the heart with a yellow ribbon (💝) reads as "gift / present / secret crush". The redhead with a hair bun is a custom face, so probably a specific person, maybe me (the player). The bald man in navy is another person, maybe the boss.

1. (thought) Plant, smile: "I love my plant." Or "a plant would make me happy."
2. (thought) Gift-heart, redhead: "I have a crush on her." Or "I want to give her a present."
3. (speech) Gift-heart, redhead: says it aloud: "This gift is for her." Or "I like her."
4. (thought) Slight smile: content, nothing on my mind.
5. (speech) Weary, groaning face: "Ugh, I'm exhausted / fed up."
6. (thought) Gift-heart: thinking about a gift, or about love.
7. (speech) Redhead, red "!": "Hey, it's her!" Or a warning: "Look out, her!"
8. (thought) Wooden chair, "?": "Where's my chair?" Or "Can I sit down?"
9. (thought) Blue forehead, sweat drop: anxious, nervous sweat.
10. (thought) Old TV, gift-heart, "?": "Is the TV the gift?" Or "Who gave me the TV?"
11. (alert, spiky, **cut off at the frame edge**) Seems to be TV, "!". "The TV!" Something happened to it. Only half of it is visible.
12. (thought) Musical note: humming, relaxed.
13. (thought) Grey monitor full of static, "?": "Why is the screen broken / scrambled?"
14. (thought) Black power plug, "!": "It's unplugged!" Or "plug it in!"
15. (speech) Smile: "Thanks!" Or just a friendly "hi."
16. (speech) Blue mailbox with the flag up, redhead: "She has mail." Or "mail it to her." Or "send it to her."
17. (speech) Party popper: "Yay! Congrats!" Or "it's a party."
18. (thought) Gift-heart, bald man: crush on the bald man, or a gift for him.
19. (speech) Gift-heart, bald man: says it aloud: "This is for him / from him."
20. (thought) Pleading teary face: touched and moved. Or begging.
21. (speech) Cardboard box with a small redhead on a label, then the redhead: "This package is for her." Or "it's from her." Or possibly "she's packing up / leaving."
22. (thought) Green sprig, huffing face: "Annoyed about the plant." Or allergic to it, since the face could be a sneeze.
23. (thought) Camcorder, huffing face: "Angry about being filmed / a camera here."
24. (speech) Wrench, calendar "JUL 17": "Repair is on July 17." Or "maintenance day." I can't tell if the date matters.
25. (speech) Blank paper, pointing hand, redhead: "Give the document to her." Or "she did this paperwork."
26. (thought) TV, camcorder, "?": "Is the TV a camera?" Or "is something hidden in the TV?" Suspicious.
27. (thought) Gift-heart, "!": "The gift!" Remembers it, or realizes it.
28. (alert, spiky, **cropped at the bottom**) "!", pointing hand, redhead: "It's HER! She did it!" An accusation.
29. (thought) Gift-heart, "?": "Where's the gift?" Or "who sent it?"
30. (speech) Gift-heart, heart-eyes face: "I love this gift!"
31. (speech) Redhead, gift-heart, "?": "Is it from her?" Or "is this for her?" Or "does she like me?"

The ribboned heart is the bubble I'm least sure of. It could mean "gift" or "crush", and the right reading changes about ten of these bubbles.

### 2-judge: report.md

Verdict: fixable
- 1: clear — the boss, calm at his monitor, likes his plant.
- 2: clear — Lin is holding the pink parcel: "this pink heart parcel is for her" (the player).
- 3: clear — Lin, at the player's desk, says it out loud: "this one's yours." On its own it also reads as a love confession (see Problems).
- 4: clear — the boss is unbothered, nothing on his mind.
- 5: clear — the player groans because the parcel has arrived in front of everyone.
- 6: clear — Lin and the boss are both thinking about the heart parcel.
- 7: clear — "It's hers!" Both of them name the player.
- 8: vague — the player isn't at the desk: "her seat's empty?" A chair with "?" can also read as "where's my chair?"
- 9: clear — the player, hiding downstairs, sweats.
- 10: clear — the boss sees the pink parcel on his CCTV monitor: "what's that?"
- 11: clear — the boss: "On the monitor! It's her!" The crop cuts the bubble, but the frame shows all of it.
- 12: clear — the player hums, acting casual.
- 13: clear — the boss: "why is my screen static?"
- 14: clear — the boss at the camera: "it's unplugged!"
- 15: clear — the boss is pleased: fixed, all good.
- 16: clear — Lin to the player: "mail for you."
- 17: clear — the player is relieved and celebrates. The safe box came.
- 18: clear — Lin, holding the pink parcel: "it's for him" (the label was swapped).
- 19: clear — Lin hands it over: "for you." The love-confession reading is still possible.
- 20: clear — the boss is touched as he holds the pink parcel.
- 21: clear — Lin gives the player a plain brown box: "your package."
- 22: vague — the boss, looking at a monitor full of leaves: "the camera only shows a plant, grr." The bubble never names the screen or the camera, the sprig differs from the potted plant in 1, and 😤 can read as triumph.
- 23: clear — the boss at the camera, annoyed with it.
- 24: vague — the boss gives up on the camera: "repair later." The dated calendar (JUL 17) reads as a real date and a clue, so a player can't tell whether the camera is now off for good.
- 25: vague — the boss catches the player at the camera: "you, back to your paperwork." In a mail level, blank paper pointed at her reads as "a letter for you."
- 26: clear — the boss: "what's wrong with the camera feed?"
- 27: clear — Lin spots the dropped parcel in the corridor: "the parcel!"
- 28: clear — Lin: "That's hers!" The player is exposed.
- 29: clear — Lin sees the player carrying the parcel: "what's that?"
- 30: clear — Lin says out loud, "Aww, a heart parcel!"
- 31: clear — Lin: "Is that yours?"

## Problems
- blocker: In 24, the calendar with JUL 17 is the only thing that tells the player whether the camera route worked, but it reads as a specific date to remember, not "fix it later." The player can't tell if the camera is down and may hunt for a July 17 clue. — Use 🔧 + ⏳ (or 📹 + 🤷) so it says "not now."
- should: When Lin says 💝 + a face aloud (3, 19), it also reads as Lin confessing a crush, and the boss's touched 🥹 in 20 fits that misreading. The parcel's route stays visible in hand, so nobody is misled about where it went. — Add the box: 📦💝 + face, so the spoken line says "the heart parcel is for…".
- should: 22's 🌿😤 doesn't connect the plant to the monitor or camera, the sprig doesn't match the 🪴 in 1, and 😤 reads either way. 23 recovers the chain. — Use 🖥️🌿 + 😠, with the same 🪴 glyph as in 1.
- should: 25's blank paper pointed at the player reads as "mail for you" in a level about mail. — Use 👉 + the player's desk/chair, or 📄💼, so it means "back to work."
- should: 8 uses a chair to mean "she's gone," but the game uses the player's face for her everywhere else. — Use the player's face + ❓ ("where is she?"), with the empty chair as an optional second glyph.
- nit: In the isolated crops, 11 and 28 are cut off at the edge, though both are whole in their frames. — Keep alert bubbles inside the screen edge so they're never clipped near walls.

<!-- /cold-read:faces -->

<!-- cold-read:tells {"verdict":"fixable","date":"2026-11-15","commit":"7b3f187+dirty","hash":"0bd13a16b6cc54e08e7e44d0a381a1e5f6a440a46a4c2edbbf384b3ab49727e0","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","checks":"23a634ba8e0c0d62cdfbe73923855560da3239679ba31c32fa6dd0052f134b6e","tells":"fad7df15394c668fe0077d4c2bf32e277009e8ff1c775e6d87a406ef7e56f962","prompts":"f1d914aecdc56ea365960569f2587c9563e9f9a055deb88f13ba995eb473a219"},"model":"default","tally":{"visible":5,"faint":0,"invisible":4},"problems":{"blocker":4,"should":2,"nit":1}} -->
## tells: fixable
Recorded 2026-11-15 at commit 7b3f187+dirty, by claude -p (model: default). Inputs 0bd13a16b6cc: the card, route-checks.js, the before and after pictures, the pass's prompts.
Items: 5 visible, 0 faint, 4 invisible.
Problems: 4 blocker, 2 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 53 s | $0.23 |
| 2-judge | report.md | 50 s | $0.23 |
| all | | 103 s (the steps add up to 103 s) | $0.46 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 03, the parcel goes into a drawer, but the reader saw it go into the machine on the desk. The highlight and the E prompt sit on that machine, so it reads as a shredder or typewriter. The "drawer → win (hidden)" route depends on knowing the parcel is still in the desk and safe. — Put the highlight on the desk's front edge. Animate a drawer sliding out, the pink box going in and the drawer closing. Leave a sliver of pink showing at the drawer seam.
- E2 [blocker] In 05, the label swap reads as "put the box back." The hand slot empties and both boxes return, so the only clue is two tiny label icons in the bubble. The "Bob gets the pink box" route can't be found by watching. — Show both boxes enlarged in the bubble, with the labels peeling off and crossing over each other (a ⇄ arrow between them). Also give each label a distinct colour that matches its box before the swap, so the switch is obvious afterwards.
- E3 [blocker] In 07, the camera turns into the plant, but nothing visible changes at the camera. The only change the reader noticed was the bald man's screensaver turning on at the same moment, which pointed them to the wrong cause. — Make the camera visibly swing, with its cone shown before and buried in the leaves after. Add a rustle and falling-leaf puff on the plant. Show the cone in both frames so the player can see it's gone.
- E4 [blocker] In 09, the dropped parcel isn't visible on the floor. The player sprite stands on the spot, and the round brown thing reads as a bin. The route is "someone picks it up and reads the label," so the player has to see a parcel lying in the corridor. — Draw the pink box on the floor tile next to the player, not under the sprite. Remove or restyle the round object so it doesn't look like a wastebasket.
- E5 [should] In 03, the bald man plugs his cord back in and cheers up in the same frame as the stash. The reader couldn't tell whether the player's action fixed his monitor. — Show him walk to the socket and plug it in himself, with a plug emoji then a 😊. That ties his recovery to his own action, not to the drawer.
- E6 [should] In 07, the leaf screensaver and "…" bubble start at the same time as the camera push. They look like an effect of the push. — Delay the screensaver, or make it start on a timer the player has already seen earlier, so it doesn't line up with the push.

### 1-read: reading.md

I read every image in `tells/`. For each one I compared the player, what they're holding (the top bar box), the things near them and the people watching.

**01:** The player was beside the wall socket and unplugged the cord. In BEFORE the plug is in the socket. In AFTER it's lying loose on the floor below. The bald man's monitor changes from a working screen to static, and he gets a puzzled bubble (monitor, "?"). The player now has a music-note bubble, as if whistling innocently. Their hands stay empty.

**02:** The player took the pink box from the bookshelf. Before, the hand slot is empty and their bubble shows two options, a brown box and a pink box. After, the slot shows the pink box, and the shelf and bubble only show the brown one. The man at the top wall doesn't visibly react.

**03:** The player used the machine on the desk (it looks like a typewriter or shredder) and the pink box is gone. The hand slot goes from pink box to empty. At the same time, the bald man goes from an angry cloud (plug, "!") to a smiley bubble. His cord looks plugged back in and his monitor works again. I can't tell from the picture whether the player's action caused his change or it happened on its own.

**04:** The player sat down at the desk with the machine, on the small stool below it. Before, they're standing with the E prompt on the machine. After, the sprite is a seated back-of-head view and the prompt is gone. Nothing else changes, and the bald man keeps the same smiley bubble.

**05:** The player put the pink box back on the bookshelf. The hand slot goes from pink box to empty, and both boxes show on the shelf and in the bubble again. Also, the woman at the rug desk turns away and her vision cone now sweeps up and left, toward the typewriter desk. I'm unsure whether that's a reaction to the player.

**06:** The player took the broom from the corner of the right room. The broom is gone from the wall and the hand slot shows it. Nobody reacts.

**07:** The player poked the ceiling camera with the broom. They're still holding it, now raised at the camera. I can't see a clear change to the camera's view cone. The clearest change is elsewhere: the bald man's monitor switches to a green leaf (a screensaver?) and he gets a small "…" or bored bubble. A fast-forward icon in the top-right corner of BEFORE is gone in AFTER. My guess is the camera was disrupted, but that's weak.

**08:** The player put the broom back in its corner. The hand slot goes from broom to empty, and the broom is back on the wall. The woman at the rug desk turns her head a bit and her cone widens up and left. The man at the top wall and the bald man's leaf monitor stay the same.

**09:** The player got rid of the pink box at a round brown object in the top hallway, probably a wastebasket. The hand slot goes from pink box to empty. The bin is no longer visible on its own, and the player is now standing on its spot, slightly hunched. They may have stuffed the box in or be hiding at the bin. The box isn't back on the shelf (only the brown box is there). Nobody visibly reacts.

General notes from a skeptical player:
- **Picking up, putting down and taking out of hand** read clearly, thanks to the hand slot (02, 05, 06, 08).
- **Where an item ends up when it disappears** is unclear. In 03 and 09 the box just vanishes, and I can't tell if it was shredded, wrapped, binned or hidden.
- **Side effects are easy to miss.** The monitor and bubble changes on the bald man are the strongest clues to what an action did, and they happen far from the player (01, 07).

### 2-judge: report.md

Verdict: fixable

- 01.png: visible — The player pulled the plug. The reader saw the plug on the floor, the bald man's monitor go to static and his puzzled bubble.
- 02.png: visible — The player took the pink parcel from the pigeonholes. The reader saw it move from the shelf and the shelf bubble into the hand slot.
- 03.png: invisible — The player hid the parcel in the drawer of their own desk. The reader thought the "typewriter or shredder" machine destroyed it, and couldn't name a drawer at all.
- 04.png: visible — The player sat down at their own desk. The reader saw the seated sprite and the prompt disappear.
- 05.png: invisible — The player swapped the labels on the two parcels. The reader saw the pink box go back on the shelf and missed the swap completely.
- 06.png: visible — The player took the broom. The reader saw it leave the wall and appear in the hand slot.
- 07.png: invisible — The player pushed the camera with the broom so it faces into the plant. The reader saw no change to the camera's cone and guessed that the bald man's leaf screensaver was the effect.
- 08.png: visible — The player put the broom back. The reader saw it return to the wall and leave the hand slot.
- 09.png: invisible — The player dropped the parcel on the corridor floor. The reader thought it went into a wastebasket, or that the player was hiding at one. No parcel shows on the floor.

## Problems
- blocker: In 03, the parcel goes into a drawer, but the reader saw it go into the machine on the desk. The highlight and the E prompt sit on that machine, so it reads as a shredder or typewriter. The "drawer → win (hidden)" route depends on knowing the parcel is still in the desk and safe. — Put the highlight on the desk's front edge. Animate a drawer sliding out, the pink box going in and the drawer closing. Leave a sliver of pink showing at the drawer seam.
- blocker: In 05, the label swap reads as "put the box back." The hand slot empties and both boxes return, so the only clue is two tiny label icons in the bubble. The "Bob gets the pink box" route can't be found by watching. — Show both boxes enlarged in the bubble, with the labels peeling off and crossing over each other (a ⇄ arrow between them). Also give each label a distinct colour that matches its box before the swap, so the switch is obvious afterwards.
- blocker: In 07, the camera turns into the plant, but nothing visible changes at the camera. The only change the reader noticed was the bald man's screensaver turning on at the same moment, which pointed them to the wrong cause. — Make the camera visibly swing, with its cone shown before and buried in the leaves after. Add a rustle and falling-leaf puff on the plant. Show the cone in both frames so the player can see it's gone.
- blocker: In 09, the dropped parcel isn't visible on the floor. The player sprite stands on the spot, and the round brown thing reads as a bin. The route is "someone picks it up and reads the label," so the player has to see a parcel lying in the corridor. — Draw the pink box on the floor tile next to the player, not under the sprite. Remove or restyle the round object so it doesn't look like a wastebasket.
- should: In 03, the bald man plugs his cord back in and cheers up in the same frame as the stash. The reader couldn't tell whether the player's action fixed his monitor. — Show him walk to the socket and plug it in himself, with a plug emoji then a 😊. That ties his recovery to his own action, not to the drawer.
- should: In 07, the leaf screensaver and "…" bubble start at the same time as the camera push. They look like an effect of the push. — Delay the screensaver, or make it start on a timer the player has already seen earlier, so it doesn't line up with the push.
- nit: In 05 and 08, the woman's vision cone turns toward the player's desk with no clear trigger. The reader wondered whether she was reacting to the player. — If it's just her normal patrol, give her a visible routine, like a glance at the wall clock before she turns.

<!-- /cold-read:tells -->

<!-- cold-read:outcomes {"verdict":"fixable","date":"2026-11-15","commit":"62eb758","hash":"12df9801ace15f42d76c52a5cb54becbc49f7594c0a864dd2174b472d26329e4","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","checks":"23a634ba8e0c0d62cdfbe73923855560da3239679ba31c32fa6dd0052f134b6e","ways":"28a60883ce2929ad8b4ea2268e4cc77337f1e5d99cecad70566d1853831a6153","ends":"d0912526d66ecf6dfa147fb0fb7175771afdd0dbf03820e363e82bb7262879ae","prompts":"2c4a72c45c8e3d7e595f0928af4c2741d3a3e144356d832e05fe3e1263e3a558"},"model":"default","tally":{"clear":11,"unclear":0,"wrong":2},"problems":{"blocker":2,"should":1,"nit":1}} -->
## outcomes: fixable
Recorded 2026-11-15 at commit 62eb758, by claude -p (model: default). Inputs 12df9801ace1: the card, route-checks.js, premise.md's ways to win and lose, the runs' last frames, the pass's prompts.
Items: 11 clear, 0 unclear, 2 wrong.
Problems: 2 blocker, 1 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 144 s | $0.61 |
| 2-judge | report.md | 44 s | $0.17 |
| all | | 187 s (the steps add up to 187 s) | $0.78 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Run 9 ends on the "twenty minutes of work" card, even though ways.md says the work isn't a loss by itself. The player actually lost at the mail call, which was the last thing on screen. The card shows neither the parcel nor Lin, so the player blames Bob's chores instead of the missed step. — Show the mail-call card (Lin holding the box up, Bob turning, the player red) when the loop ends at 4:00. Add a small paper-stack icon as the cause ("you were stuck working"), but don't let the work card replace the mail-call card.
- E2 [blocker] In run 11, the corridor and the card contradict each other. In the corridor, Lin's accusing burst points at an empty floor tile, not at a person. On the card, the player is standing beside her in the corridor while she was actually at her desk. The step that broke, dropping the box, isn't visible. — In the corridor, give Lin a "box ?" then "player-face !" burst aimed at the box itself, with no pointing at a spot. On the card, show Lin in the corridor holding the box up to the label, with the player in a small inset at her desk blushing. Give the icon row a clear "box on floor" glyph: the box tilted on the floor with a drop mark.
- E3 [should] The "found" card's icon for the box on the floor (faint wobbly lines) reads as "broken or fell" and doesn't say "you left it there." — Draw the box sitting on the floor tiles with a down-arrow, or use the same floor-box sprite the player saw.

### 1-read: reading.md

# How each loop ended: Discreet Packaging

**Run 1: caught.** At 4:00 the woman in the teal cardigan (Lin) is holding the pink heart parcel. Both she and the bald man have "!" bubbles aimed at the player, who is sitting at the desk and sweating. The end card has a red border and shows Lin holding the parcel up while the bald man watches. **The card matches.** What broke: nobody touched the parcel, so it got handed out in front of everyone.

**Run 2: caught.** The player is out in the hallway and sweating. At first the two coworkers have "chair ?" bubbles, then their bubbles change to "heart-parcel + player". The red card shows Lin holding up the parcel next to an empty yellow chair. **The card matches.** What broke: leaving the desk didn't help, because the parcel was still delivered and seen.

**Run 3: caught at 3:25.** The player is at the pigeonhole shelf in the checkered room, inside the ceiling camera's red cone. The bald man at the front desk monitor gets a burst of "monitor ! point player". The red card shows the monitor with the player at the shelf and the bald man pointing at her. **The card matches.** What broke: going to the shelf for the parcel while the camera could see her.

**Run 4: win.** At 3:31 the player used something at her own desk. At 4:00 Lin has empty hands and a "mailbox + player" bubble, and the player has a party-popper bubble. The card has a teal border: Lin shrugs, the bald man holds a brown box, the player shows a music note. Lin's portrait fills one of the two empty slots. I'm reading teal as a win, but that's my guess. **The card matches.**

**Run 5: win.** At 4:00 the bald man is holding the pink parcel and looks teary. Lin hands a brown box to the player, whose bubble is a party popper. The teal card has confetti: the bald man hugs a pink box with his own face on it, and Lin holds a brown box with the player's face. It looks like the two parcels were switched. The bald man's portrait fills a slot. **The card matches.**

**Run 6: win.** It's the same parcel switch as run 5. The difference is that the player is in the far-right room, so the card shows her empty chair. **The card matches.**

**Run 7: win.** At 3:31 the player pressed E at her desk computer. At 4:00 she's in the hallway with a party popper, and Lin has a "mailbox + player" bubble. The teal card shows Lin shrugging beside the player's empty chair. **The card matches.**

**Run 8: win.** The player used her desk at 3:40. It ends the same way as run 4: Lin shrugs and the player has a music note. The bald man's monitor shows a leaf, which may mean the camera was turned. **The card matches.**

**Run 9: caught.** The last moments look exactly like run 1: Lin is holding the pink parcel and both coworkers have "!" bubbles. The monitor shows a leaf, so the camera seems to have been turned toward the plant. **The card doesn't match.** The red card shows the bald man pointing at the player behind a huge stack of paper, with icons "bald man, point, papers". There's no parcel and no Lin. So the card blames something other than what I just saw happen. What broke: turning the camera did nothing to stop the parcel being handed out.

**Run 10: caught at 3:28.** The player is holding the broom (it's in her item slot) and standing under the ceiling camera, inside its red cone. The bald man gets a "monitor ! point player" burst. The red card's monitor shows the player with the broom right by the camera. **The card matches.** What broke: she tried to deal with the camera while it could see her.

**Run 11: caught at 3:53, probably, but I can't tell why.** The player is sitting at her desk. Lin is up in the top corridor carrying the pink parcel, inside a red cone, with a "! point player" burst. But the target marker sits on an empty spot in the corridor, not on the player. **The card doesn't fully match.** It shows the player standing in a corridor with doors next to Lin, but she was at her desk. The card's parcel icon has wobbly lines, as if it fell or broke open. I can't tell which step of the plan failed.

**Run 12: win.** At 3:30 the player is in the far-right room and the pink parcel is lying on the floor there. At 4:00 she's back near her desk with a party popper and Lin shrugs. The parcel is still sitting in the open on that floor. It wasn't spotted only because the room was empty. **The card matches** (teal, Lin shrugs).

**Run 13: caught at 3:33.** The player is carrying the pink parcel (it's in her item slot) past Lin's desk. Lin's bubble is "player heart ?", then her cone turns red and she gets a "! point player" burst. The red card shows Lin cheering and the player blushing while holding the parcel. **The card matches.** What broke: she carried the parcel back through the main room while Lin was watching.

### 2-judge: report.md

I've checked the two disputed endings (runs 9 and 11) against their pictures; here's the report.

Verdict: fixable
- Run 1: clear: did nothing, so Lin held the pink box up at the mail call. The reader saw that, with the red card matching.
- Run 2: clear: did nothing and was away at 4:00, so Lin held the box up over the empty chair. The reader read it right.
- Run 3: clear: took the box while the camera was live and Bob saw it on his monitor. The reader read it right.
- Run 4: clear: pulled the plug and put the box in the drawer, so Lin had nothing and shrugged. The reader saw a win. The party popper confirms what teal means.
- Run 5: clear: pulled the plug and swapped the labels, so Bob hugged the pink box. The reader saw the swap.
- Run 6: clear: the same swap, with the player away. The reader saw the empty chair and a win.
- Run 7: clear: pulled the plug, used the drawer, and was away at 4:00. The reader saw a win with Lin shrugging at the empty chair.
- Run 8: clear: poked the camera into the plant, then used the drawer. The reader saw a win and guessed from the leaf on the monitor that the camera had been turned.
- Run 9: wrong: poked the camera, then hung around under it. Bob sent her to her desk with work, so the box stayed on the shelf for the mail call. The last in-game moment is Lin holding up the pink box with "!" from both coworkers (09–10.png). The card (11.png) shows Bob pointing at the player behind a stack of paper, with no parcel and no Lin. The reader saw the card blaming something other than what they had just watched.
- Run 10: clear: poked the camera while it looked at her and Bob saw the broom. The reader read it right.
- Run 11: wrong: dropped the box in the corridor, and Lin found it and read the label. In 10.png Lin's "! point player" burst aims at an empty spot in the corridor while the player sits at her desk. The card (11.png) puts the player standing in the corridor next to Lin. The reader couldn't tell which step failed, and missed the faint "dropped" lines under the box icon.
- Run 12: clear: dropped the box on the store room floor and went back, so Lin shrugged. The reader saw a win and correctly guessed that nobody looks in that room.
- Run 13: clear: carried the box past Lin and she spotted it. The reader read it right.

## Problems
- blocker: Run 9 ends on the "twenty minutes of work" card, even though ways.md says the work isn't a loss by itself. The player actually lost at the mail call, which was the last thing on screen. The card shows neither the parcel nor Lin, so the player blames Bob's chores instead of the missed step. — Show the mail-call card (Lin holding the box up, Bob turning, the player red) when the loop ends at 4:00. Add a small paper-stack icon as the cause ("you were stuck working"), but don't let the work card replace the mail-call card.
- blocker: In run 11, the corridor and the card contradict each other. In the corridor, Lin's accusing burst points at an empty floor tile, not at a person. On the card, the player is standing beside her in the corridor while she was actually at her desk. The step that broke, dropping the box, isn't visible. — In the corridor, give Lin a "box ?" then "player-face !" burst aimed at the box itself, with no pointing at a spot. On the card, show Lin in the corridor holding the box up to the label, with the player in a small inset at her desk blushing. Give the icon row a clear "box on floor" glyph: the box tilted on the floor with a drop mark.
- should: The "found" card's icon for the box on the floor (faint wobbly lines) reads as "broken or fell" and doesn't say "you left it there." — Draw the box sitting on the floor tiles with a down-arrow, or use the same floor-box sprite the player saw.
- nit: The win and caught cards rely on border colour (teal or red) to tell them apart. Without a popper the reader still had to guess. — Put the same win glyph (popper or check) in the icon row of every win card.

<!-- /cold-read:outcomes -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"860ca53","hash":"08f5a9ea8b1302f8fe52ab2708e83f18e9e86d4de84d22d50b507249c839baa8","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","shots":"69a6e1a24bdde25103f02dcf4bd90369820aa5fd0ff2957d6807855e81de1a42","pictures":"e6a35b5067717a73b27ec16d83754f3672fdaffe804e36dac06f319b45613626","prompts":"373358f2a720c528dbf043178a7e12d5e465c477911cb7d1ae56f78e1d3c10a4"},"model":"default","problems":{"blocker":4,"should":5,"nit":2}} -->
## pictures: fixable
Recorded 2026-11-15 at commit 860ca53, by claude -p (model: default). Inputs 08f5a9ea8b13: the card, shots.js, the rendered shots, the pass's prompts.
Problems: 4 blocker, 5 should, 2 nit.
Earlier problems: 4 fixed, 4 still there, 3 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 111 s | $0.58 |
| 2-compare | report.md | 143 s | $0.57 |
| all | | 254 s (the steps add up to 254 s) | $1.15 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 no longer applies: There is no label printer in this version.
- E2 still there: The close-up card exists now and Shift no longer glows, but the label faces are still too small: the reader swaps the owners at 02.
- E3 fixed: Bob thumps the camera with an impact star (05).
- E4 no longer applies: The swap now happens at the shelf, not with a printed label.
- E5 still there: 12 is now taken at the shelf, but the reader sees "the same swap bubble". There is no puff, the card layout matches 02, and the faces are too small to see that they have traded places.
- E6 still there: No drawer is drawn anywhere. 13 highlights the typewriter instead, 15 is credited to the swap, and the hide route is never understood.
- E7 no longer applies: 14 is now the "nobody touched it" shot and it reads. The drawer problem is carried under E6.
- E8 still there: The shrug is now drawn in Lin's style, but together with the 📭 glyph it reads as "mail for Red, hooray" (16, 22, 29). From that the reader invents a disguise route that doesn't exist.
- E9 fixed: The reader no longer thinks Red is holding the box on the CCTV (25).
- E10 fixed: The corridor background and the dust puff are in, and the "Lin opens parcels early" misreading is gone. The new icon is a new problem below.
- E11 fixed: The chair is pulled out and spotlit, with no pink corner, and 24 reads correctly.

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The close-up card exists now and Shift no longer glows, but the label faces are still too small: the reader swaps the owners at 02. (recurring: premise-level?)
- E2 [blocker] 12 is now taken at the shelf, but the reader sees "the same swap bubble". There is no puff, the card layout matches 02, and the faces are too small to see that they have traded places. (recurring: premise-level?)
- E3 [blocker] No drawer is drawn anywhere. 13 highlights the typewriter instead, 15 is credited to the swap, and the hide route is never understood. (recurring: premise-level?)
- E4 [blocker] The shrug is now drawn in Lin's style, but together with the 📭 glyph it reads as "mail for Red, hooray" (16, 22, 29). From that the reader invents a disguise route that doesn't exist. (recurring: premise-level?)
- E5 [blocker] In 13 the typewriter glows with an E prompt during the hide route, and the reader concludes it retypes labels. Remove the typewriter's E prompt in this level, or make it non-interactive.
- E6 [should] A gold ring with an E prompt sits on the player in the top corridor (10, 11) and pays off nothing. Remove it. If it marks a hiding spot, draw a real prop there, such as a door alcove.
- E7 [should] The red ring on Bob in 04 and 09 is unexplained. If it marks "alerted", use the same "?" meter shown at 02. Otherwise drop it.
- E8 [should] The dropped-box icon in 28 reads as a birthday cake. Draw the box tilted, with slanted motion lines and a downward arrow.
- E9 [should] In 16 the reader sees Bob's tan box as pink. Darken the brown box and add a strip of parcel tape so it never shares a colour with the pink box.

### 1-read: reading.md

# Discreet Packaging: cold read

**Cast, named by look:** **Red** is the player: red jumper, hair in a bun on top. **Teal** is a woman with glasses, a black bun and a teal suit. She hands out the mail, so she is probably Lin. **Bald** is a bald man in a navy suit at the long front desk with a monitor. There's also a ceiling camera whose black cable runs to a wall plug in the right-hand room.

**01 (3:21).** Red sits at a top-left desk with a typewriter. Teal works at the rug desk and has a vision cone. Bald sits at his monitor thinking "plant 😊". A shelf of pigeonholes holds a pink box. The camera's cone covers the hall. This is clearly the "watch the routines" opening. Unclear: the HUD panel with a clock next to Red's face with a small 😳 badge. Is that the goal or a status?

**02 (3:25).** Red is at the shelf with an E prompt. Her bubble shows a plain box with her face, then a pink box with Bald's face. The camera cone has turned red, and a small "?" meter has appeared over Bald. So the idea is to swap labels while being filmed. Unclear: which way the swap goes. It could read as "turn mine into his" or "this one, then that one".

**03.** Red is at the wall plug in the right room, with an E prompt. It looks like you can unplug the camera.

**04.** The monitor shows static. Bald thinks "static ?" and Red hums ♪. The camera cone is now purple and dotted, so it seems dead. That's a good gag. Unclear: the red ring around Bald.

**05.** Bald is at the camera and there's a spark, so he's fixing it. Red is in the top corridor.

**06.** Bald is at the plug, thinking "plug !". Unplugging works, but only for a while.

**07.** Red picks up a broom in the right room.

**08.** With the broom in the hand slot, Red has an E prompt under the camera.

**09.** The camera is knocked so it points at a potted plant, and the monitor shows a leaf. Bald thinks "leaf 😤". Shoving it aside seems to beat cutting the power.

**10.** Bald is up at the camera. Red is in the top corridor at a gold ring, with an E prompt. Teal's cone has swung wide, so she's looking around. Unclear: the gold ring. Tape? A coin? A hatch?

**11 (3:33).** Bald walks back saying "🔧📅". The camera still points at the leaf. That reads as "fix it later", which means the leaf trick lasts. The gold ring is still unexplained.

**12 (3:28).** Red is back at the shelf with the same swap bubble while Bald fixes the camera. This is a timing window.

**13.** Red is at her own typewriter with an E prompt. Bald walks past saying "😊". The pink box is gone from the shelf. Unclear: what the typewriter does. Retype the label?

**14 (3:54, clock now red).** Teal empties the shelf holding a pink parcel and thinks "pink heart gift + Red". This is the mail run starting, with Red at her desk.

**15.** Same moment, but Teal holds a plain box and has no bubble. This is probably the version where the swap worked.

**16 (3:59).** Teal is in Red's room saying "mailbox + Red". Bald holds a pink box nearby, thinking 🙂. It's delivery time.

**17 (3:51).** The pink box lies on the floor of the top corridor. Teal, in the doorway, thinks "heart gift !". Hiding it in the open fails.

**18.** Teal holds it up saying "Red !", with a red cone. She has found the owner.

**19 (3:59).** Teal says "heart gift + Bald". Bald hugs the pink box and thinks 🥹. The swap reached him.

**20 (WIN, teal frame, confetti).** Bald clutches the pink box with his face on it, tearful. Teal hands Red a plain box. Red grins. A Bald portrait is stamped into slot 1 of 2. **Funniest beat in the set:** Mum's love parcel adopted by a lonely middle manager.

**21 (WIN).** Same scene, but Red is replaced by an empty yellow chair, and she's off in the right room. Winning while absent is fine here.

**22 (WIN, Teal portrait in slot 2).** Teal cheers "mailbox + Red". Bald carries a *plain* box with Red's face. Red hums ♪. So there's a second route: the parcel stays Red's but goes out disguised. That fits the level's name. Unclear: why Bald is the one carrying it.

**23 (LOSS, red frame).** Teal holds the pink box over her head: "heart gift + Red". Red sweats with 😳. The icons are heart, Red, 😳. It's clear and it's funny.

**24 (LOSS).** Same reveal, but to an empty chair under a spotlight. The icons are heart, Red, chair. Hiding from the moment doesn't save you. Good joke. But next to 21 and 29 it's confusing: the empty chair is fine there and fatal here.

**25 (LOSS, 3:25).** On CCTV, Red is at the shelf. Bald points angrily and Red blushes. The icons are TV, 👉, Red. You were caught on camera.

**26 (LOSS, 3:28).** The CCTV shows Red with the broom at the camera.

**27 (LOSS, 3:38).** The CCTV shows Red carrying the pink box, which is also in her hand slot.

**28 (LOSS, 3:53).** In a corridor with doors, Teal holds the pink box saying "Red !". Grey smudges lie on the floor. Unclear: the first icon, a pink box with three sticks on top and grey blobs. A cake? A box in dust? I can't read it.

**29 (WIN, Teal slot).** This is route 22 with Red replaced by a chair.

**30 (LOSS, 3:33).** Teal throws up her arms: "heart gift 😍 Red ?". Red holds the pink box. Being seen carrying it ends the loop.

**Editor's flags**
- The 02 swap bubble and the gold ring (10–11) are the two biggest gaps for a learner.
- The empty chair means win in 21 and 29 but loss in 24, with no visible cause.
- The red ring on Bald (04, 09) is unexplained.
- Losses 25–27 say "camera", but nothing on the floor says "Bald watches the monitor" until after you've lost.

## The story

At 3:20 Mum's embarrassing pink parcel is sitting in the office pigeonholes, and at 4:00 Teal will hand it out in front of everyone. Bald watches a camera on the shelf, so first you blind it by unplugging it or knocking it toward a plant. Then you either swap the name so a lonely Bald gets Mum's love and weeps for joy, or you disguise it as a plain box. Getting caught holding it, or letting Teal find it lying around, means the box gets held up overhead with your name on it.

### 2-compare: report.md

Verdict: fixable

## Shots

- **01: reads.** The reader gets the cast, the camera watching the pigeonholes, the pink box and Bob smiling at the plant on his monitor. They miss that the store room is dusty and which way Bob faces, but neither matters yet. (The unclear HUD panel is a nit below.)
- **02: partly**
  - Reading: "Her bubble shows a plain box with her face, then a pink box with Bald's face… So the idea is to swap labels… Unclear: which way the swap goes."
  - Intent: a close-up shows whose box is whose. The brown one is Bob's and the pink hearts one is yours. E takes it. You are in the cone and on Bob's monitor.
  - Cause: missing cue. The faces on the labels are about 8 px, and the reader gets the owners the wrong way round. Two boxes side by side in one bubble also read as "this, then that", so it looks like an instruction to swap.
  - Fix: put each label on a background in its owner's colour (navy behind Bob's face, red behind yours) and draw the faces at least twice as big.
- **03: reads.** The reader puts the plug in the "right-hand room". In the shot it is at the right wall of the back office, so this is harmless.
- **04: reads.** The red ring on Bob is listed under Problems.
- **05: reads.** The impact star is there now.
- **06: reads.**
- **07: reads.**
- **08: reads.**
- **09: reads.**
- **10: partly**
  - Reading: "Red is in the top corridor at a gold ring, with an E prompt… Unclear: the gold ring. Tape? A coin? A hatch?"
  - Intent: Bob tugs at the camera, which stays jammed in the plant. You wait in the corridor with the broom.
  - Cause: missing cue, plus a stray one. A gold ring with an E prompt sits on the player in an empty corridor. It takes the eye away from the tug, and the reader only sees Bob "up at the camera".
  - Fix: remove the ring and the E prompt from this spot (see Problems). Draw Bob with both arms up and the camera shaking.
- **11: reads.** The 🔧📅 gag lands. The gold ring is still there (see Problems).
- **12: misread** (carried as E5)
  - Reading: "Red is back at the shelf with the same swap bubble while Bald fixes the camera."
  - Intent: you have just swapped the labels. Your hands are empty, there is a little puff, and the close-up now shows Bob's face on the pink box and yours on the brown one.
  - Cause: missing cue. The new card has the same layout as 02, and only the two tiny faces have changed. No puff is visible. If the puff exists, it has faded by 3:28 and the shot should be taken earlier.
  - Fix: draw a puff over the shelf and two curved arrows on the card that show the faces trading places.
- **13: misread** (cause carried as E6)
  - Reading: "Red is at her own typewriter with an E prompt… Unclear: what the typewriter does. Retype the label?"
  - Intent: you are at your desk, the drawer is shut, nothing pink shows anywhere, and only Bob's brown box is left on the shelf.
  - Cause: the wrong thing is highlighted and a cue is missing. The typewriter glows with E, and no drawer is drawn on the desk. The reader is sent towards a typewriter mechanic that doesn't exist and never learns where the box went.
  - Fix: remove the typewriter's E prompt and draw a drawer face on the desk sprite, with a puff as it closes.
- **14: reads.**
- **15: partly**
  - Reading: "Teal holds a plain box and has no bubble. This is probably the version where the swap worked."
  - Intent: the pink box was hidden, so Lin picks up only Bob's brown box and doesn't miss the pink one.
  - Cause: missing cue. Nothing ever shows the drawer (E6), so an empty shelf gets credited to the swap.
  - Fix: same as E6.
- **16: partly**
  - Reading: "Teal is in Red's room saying 'mailbox + Red'. Bald holds a pink box nearby… It's delivery time."
  - Intent: it is the mail call. Lin has nothing for you and shrugs, and Bob holds his brown box.
  - Cause: an emoji standing in for a prop. The 📭 at bubble size looks like a mailbox with mail in it, and Lin's shrug pose doesn't read. Bob's tan box is small enough to be taken for pink.
  - Fix: show an empty pigeonhole slot with a dust mote in the bubble, give Lin hanging palms-up hands, and make the brown box darker and plainer.
- **17: reads.**
- **18: reads.**
- **19: reads.**
- **20: reads.** This is the funniest beat in the set.
- **21: reads.**
- **22: misread** (carried as E8)
  - Reading: "Teal cheers 'mailbox + Red'. Bald carries a *plain* box with Red's face… a second route: the parcel… goes out disguised."
  - Intent: there is no pink box today. Lin shrugs, empty-handed, Bob holds his own brown box, and you hum by your shut drawer.
  - Cause: an emoji standing in for a prop, and a missing cue. The mailbox emoji with its red flag up means "you've got mail". Lin's arms-out shrug reads as a cheer. The face on Bob's label can't be told apart from yours. The desk drawer gets no emphasis, so the reason you won is not in the picture.
  - Fix: Lin shows two open, empty palms with a small "poof" over them. Use an empty pigeonhole icon instead of 📭. Put a navy-backed Bob face on his label. Draw a tiny pink corner shut inside the desk drawer, behind a closed-lock glint.
- **23: reads.**
- **24: reads.** The chair is pulled out and spotlit.
- **25: reads.**
- **26: reads.**
- **27: reads.**
- **28: partly**
  - Reading: "Unclear: the first icon, a pink box with three sticks on top and grey blobs. A cake? A box in dust?"
  - Intent: the icon shows a dropped box.
  - Cause: missing cue. The fall lines are short, upright and evenly spaced, so they read as candles.
  - Fix: slant the lines and make them uneven, add a small downward arrow, and draw the box tilted with one corner landing in the dust puff.
- **29: misread**
  - Reading: "This is route 22 with Red replaced by a chair."
  - Intent: you win by hiding the box while you are away.
  - Cause: the same as 22, and it inherits the "disguise route" misreading.
  - Fix: same as 22.
- **30: reads.**

No shot was taken at the wrong moment. Every intent clock matches the picture to within the one-minute lag of the end card.

## Earlier problems
- E1: no longer applies. There is no label printer in this version.
- E2: still there (should). The close-up card exists now and Shift no longer glows, but the label faces are still too small: the reader swaps the owners at 02.
- E3: fixed. Bob thumps the camera with an impact star (05).
- E4: no longer applies. The swap now happens at the shelf, not with a printed label.
- E5: still there (blocker). 12 is now taken at the shelf, but the reader sees "the same swap bubble". There is no puff, the card layout matches 02, and the faces are too small to see that they have traded places.
- E6: still there (blocker). No drawer is drawn anywhere. 13 highlights the typewriter instead, 15 is credited to the swap, and the hide route is never understood.
- E7: no longer applies. 14 is now the "nobody touched it" shot and it reads. The drawer problem is carried under E6.
- E8: still there (blocker). The shrug is now drawn in Lin's style, but together with the 📭 glyph it reads as "mail for Red, hooray" (16, 22, 29). From that the reader invents a disguise route that doesn't exist.
- E9: fixed. The reader no longer thinks Red is holding the box on the CCTV (25).
- E10: fixed. The corridor background and the dust puff are in, and the "Lin opens parcels early" misreading is gone. The new icon is a new problem below.
- E11: fixed. The chair is pulled out and spotlit, with no pink corner, and 24 reads correctly.

## Problems
- blocker: In 13 the typewriter glows with an E prompt during the hide route, and the reader concludes it retypes labels. Remove the typewriter's E prompt in this level, or make it non-interactive.
- should: A gold ring with an E prompt sits on the player in the top corridor (10, 11) and pays off nothing. Remove it. If it marks a hiding spot, draw a real prop there, such as a door alcove.
- should: The red ring on Bob in 04 and 09 is unexplained. If it marks "alerted", use the same "?" meter shown at 02. Otherwise drop it.
- should: The dropped-box icon in 28 reads as a birthday cake. Draw the box tilted, with slanted motion lines and a downward arrow.
- should: In 16 the reader sees Bob's tan box as pink. Darken the brown box and add a strip of parcel tape so it never shares a colour with the pink box.
- nit: The HUD panel in 01 (clock, Red's face, 😳) is unclear to the reader. Draw the face blushing under the clock hand at 4:00 so it reads as "don't be embarrassed by 4".
- nit: The end-card icons use the 💝 emoji for the parcel (20, 24), but the parcel is drawn as a pink box with hearts. Use the box drawing as the icon.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"860ca53+dirty","hash":"004e077e49fc4b740d51640e730120779b86e8e3386e016777751c30063c503c","parts":{"card":"0f72f49484f12e3a66f1e4bcbd3a390eafc25540e5d28773447dc323d666ee91","checks":"23a634ba8e0c0d62cdfbe73923855560da3239679ba31c32fa6dd0052f134b6e","ways":"28a60883ce2929ad8b4ea2268e4cc77337f1e5d99cecad70566d1853831a6153","frames":"f48a8586b62fd863586c5b06389b7f0da5d6842697d66f34c05abc0056992ad4","prompts":"9e3c9df1ce09f69e814a3665f47fd26f19cf1da4d95956302759c3b798c0d63d"},"model":"default","problems":{"blocker":2,"should":5,"nit":2}} -->
## replay: fixable
Recorded 2026-11-15 at commit 860ca53+dirty, by claude -p (model: default). Inputs 004e077e49fc: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the pass's prompts.
Problems: 2 blocker, 5 should, 2 nit.
Earlier problems: 7 fixed, 0 still there, 1 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 176 s | $0.77 |
| 1-read-2 | reading.md | 199 s | $0.82 |
| 2-compare | report.md | 144 s | $0.56 |
| all | | 343 s (the steps add up to 519 s) | $2.14 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 fixed: The camera's cone is visible and turns red when it's on you (run-10/04.png). The run-10 reader named the timing correctly.
- E2 fixed: The run-8 win card shows the desk with no box on it.
- E3 fixed: "Unplugging the camera kept the shelf grab off-camera" (run 4). The same idea comes through in runs 11 and 12.
- E4 fixed: "The pink box was still lying in the right-hand room and nobody went in there" (run 12).
- E5 no longer applies: In the spotted loss (run 13), Lin no longer takes the box; you are left holding it.
- E6 fixed: Her bubbles are now 💝 ? and then you 💝 ?, which point at what she saw.
- E7 fixed: The burst is now 💝 😍 and the end card shows her delighted.
- E8 fixed: Static + ? (after an unplug) and monitor + 💝 ❓ (before a bust) now read differently, and neither reader mixed them up.

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In run 9, the end card shows the 20 minutes of work as the loss. The real loss is the mail call, which ways.md and the 4:00 frame both show, so players will learn that hanging about loses on its own. — Use the mail-call end card with a paper stack beside you, and icons 📄 ⏳ 💝 you.
- E2 [blocker] In run 8, nothing at the shelf grab shows that the knocked camera is blind, so the reader can't say whether the poke mattered to the win. — Keep a grey cone stuck in the plant for the rest of the day, and flash a 🌿 inset over Bob's monitor at every shelf action.
- E3 [should] In run 3, the end card's frozen monitor shows you empty-handed beside the shelf, and no grab is marked. The reader can't tell whether taking the box or just standing there got you caught. — Freeze the monitor on the grab with the box in your hands, and add 💝 to the icons.
- E4 [should] The drawer isn't drawn. The highlight sits on the typewriter, so stashing the box reads as "used a machine," possibly a shredder (run 4). — Draw a drawer front and highlight it, then animate it opening, the box sinking in, and the drawer shutting.
- E5 [should] In run 7 you're away at 4:00, but the win card's icons are identical to run 4's and still show you ♪ (humming). ways.md promises a separate `end-hidden-away` card. — Drop the ♪ when you're absent and use the icons 🪑 🤷.
- E6 [should] The win card puts Lin's new portrait in a red frame (run-08/10.png). The second reader couldn't tell what it meant, and red is the loss colour everywhere else. — Frame newly earned portraits in teal or gold.
- E7 [should] At 4:00 in the hidden route, the box handover to Bob is never shown, and Lin's arms-up shrug reads as a cheer. The reader thought Bob was giving her the box (run 8). — Add one frame of the box passing to Bob, and draw the shrug with palms up and arms low.

### 1-read-1: reading.md

I've finished all seven runs and am writing up the reading now.

# Reading: Discreet Packaging

**Who's who:** "you" is the woman in the red sweater with the red ring. "Teal" is the woman in the teal cardigan with glasses; she hands out the mail, so she's probably Lin. "Bald" is the bald man in the suit at the front desk, which has a monitor showing the camera feed. A ceiling camera watches the room with the shelf of mail cubbies. Endings with a red frame are losses; endings with a teal frame are wins and fill a portrait slot.

## Run 1: loss
- 3:21: You're at your desk. Bald thinks 🪴😊. Teal is at the rug desk.
- 3:53: Teal takes the pink parcel from the cubbies and thinks 💝 + your face.
- 3:59: Teal walks to your desk carrying it. Bald follows with a brown box and thinks 😐.
- 4:00: Your bubble shows 😩. Both of them think 💝, then both show your face + ❗ with dotted lines to you.
- **End:** Teal holds the parcel up while Bald watches and you go red. Icons: 💝 you 😳.

**Why:** The parcel was delivered with you there. You did nothing (there are no "used" marks). This is the default afternoon.

## Run 2: loss
- 3:21–3:59: Same as Run 1, except you walk out to the lower hallway.
- 4:00: Teal and Bald both think 🪑❓ while looking at your empty chair, and you think 😨. They then switch to 💝 + your face, with dotted lines to the chair.
- **End:** The parcel is held up next to your empty chair. Icons: 💝 you 🪑.

**Why:** Leaving didn't help, because the parcel was still opened in public. Hiding yourself isn't the answer.

## Run 3: loss at 3:26
- 3:25: You stand at the cubby shelf, and a picture of the cubby contents pops up. The camera's view turns red. Bald thinks 🖥️💝❓.
- 3:25: Bald bursts with 🖥️❗👉 + your face.
- **End:** Bald points at you on the monitor. Icons: 🖥️ 👉 you.

**Why:** The camera saw you at the shelf. The captions have no "used" mark, so I can't tell if you touched anything or were just standing close.

## Run 4: win
- 3:25: You used the wall plug under the camera. Bald's monitor turns to static, Bald thinks 🖥️❓, and your bubble shows ♪.
- 3:27: You used the shelf, and the pink parcel is now in your hand slot. Bald walks to the camera.
- 3:29: You carry the parcel through the top corridor while Bald thinks 🔌❗ at the plug. Teal turns to face the left side of the room.
- 3:31: You used the white machine on your desk, and the parcel leaves your hand slot. You used your chair and sat down. The camera is working again and Bald is back at the desk, 😊.
- 4:00: Teal shows 📭 + your face and shrugs with empty hands. Your bubble shows 🎉.
- **End:** Teal's portrait fills a slot. Icons: Teal 📭 you ♪.

**Why:** The parcel was gone before the mail round. Unplugging the camera kept the shelf grab off-camera. I can't tell whether the desk machine shredded the parcel or just hid it.

**Not clearly a reaction:** Teal turning left at about 3:28–3:29 happens in Runs 4–7 every time, whether or not you're nearby. It may just be routine.

## Run 5: win, different ending
- 3:25 and 3:27: Same as Run 4.
- 3:28: You used the shelf again and your hand is empty. The cubby picture now shows the brown box with your face and the pink box with Bald's face, so the labels look swapped.
- 3:29–3:30: Bald fixes the plug. At 3:28, Teal's dotted line points at your empty chair, but nothing follows from it.
- 3:34: You used your chair and sat down.
- 3:53: Teal takes the pink parcel and thinks 💝 + Bald's face.
- 4:00: Teal brings you the brown box. Bald gets the pink parcel and thinks 🥹.
- **End:** Bald's portrait fills a slot, with confetti. Icons: 💝 Bald 🥹 📦 you.

**Why:** The label swap made Bald the one receiving the pink parcel, and he was touched by it.

## Run 6: win
- Same as Run 5 up to 3:30, but you never sit down. At 3:53 you're in the far-right room, and at 4:00 your bubble there shows 🎉.
- **End:** Same as Run 5, except your chair in the picture is empty. Bald's portrait fills the slot.

**Why:** The label swap. Being away from your desk didn't matter here, unlike Run 2.

## Run 7: win
- Same as Run 4 up to 3:31, including the desk machine, but you skip the chair.
- 4:00: You're in the lower hallway with 🎉. Teal shows 📭 + your face.
- **End:** Teal's portrait fills the slot, and the picture shows your empty chair.

**Why:** Same as Run 4: the parcel was gone before the mail round. Sitting down wasn't needed.

**Possible bug:** The end icons are identical to Run 4's, including you and ♪, even though you're not in the picture.

### 1-read-2: reading.md

# Reading: Discreet Packaging (runs 8–13)

Names used below: **you** = the woman in red. **Teal woman** = the woman in teal with glasses who sits on the yellow rug. She's probably Lin, since she gets the mail at 4:00. **Bald man** = the man in navy at the CCTV monitor desk. **Pink box** = the pink box covered in hearts that starts on the bookshelf, next to a brown box with a face on it.

---

## Run 8 (WIN)

- 3:21 Start, top-right room. The bald man's bubble shows a plant and 😊.
- 3:23 You pick up the broom in the right-hand room.
- 3:30 You poke the wall camera with the broom. The monitor now shows leaves. The bald man's bubble: leaf and 😤.
- 3:33 You put the broom back. The bald man walks to the camera (camera 😤), then shows wrench and calendar and goes back to his desk. The camera stays knocked.
- 3:35 You take the pink box off the shelf.
- 3:39 You use the typewriter desk in the top-left room. The pink box is gone from your hand and isn't visible anywhere.
- 3:40 You sit down below that desk.
- 4:00 The bald man hands the teal woman the brown face box. Her bubble: mailbox and you. Yours: 🎉.

**Why it ended:** At 4:00 the mail handed out was the brown box only. The pink box never appeared.

**Cause:** Taking the pink box and stashing it at the typewriter desk. I can't tell whether knocking the camera mattered.

**Ambiguous:** At about 3:33 the teal woman turns her head left. Runs 11 and 13 show the same turn, so it's her routine, not a reaction to you.

---

## Run 9 (LOSS)

- 3:23 You take the broom.
- 3:30 You knock the camera. The bald man's bubble: leaf and 😤.
- 3:31 The bald man reaches the camera while you're still standing by the broom you dropped there. His bubble: camera, 👉, you. A red-and-white slip appears over your head.
- 3:33 He shows wrench and calendar and goes back to his desk. You go and sit at the top-left desk.
- 3:53 The teal woman takes the pink box off the shelf. Her bubble: 💝 and you.
- 4:00 She and the bald man both show 💝, then "you !".

**Why it ended:** The end picture shows the bald man pointing at you behind a stack of paper: you got written up.

**Cause:** Hanging around the camera with the broom when he arrived.

**Ambiguous:** The pink box was also exposed at 4:00, but the end picture only shows the write-up. Two failures, one picture. A player could easily blame the wrong one.

---

## Run 10 (LOSS, 3:28)

- 3:23 You take the broom.
- 3:27 You stand under the camera holding the broom. The monitor shows you. The bald man's bubble: monitor, camera, ?
- 3:28 A burst bubble: monitor, !, 👉, you.

**Why it ended:** The end picture shows the bald man seeing you on the monitor with the broom.

**Cause:** Walking into the camera's view before you knocked it away. Nothing ambiguous here.

---

## Run 11 (LOSS, 3:53)

- 3:25 You pull the camera's plug. The monitor shows static. The bald man's bubble: static and ?
- 3:27 He walks to the camera. You take the pink box.
- 3:29 You drop the pink box on the floor of the top corridor. The bald man's bubble: plug and !
- 3:30 He plugs it back in. Bubble: 😊.
- 3:32 You sit at the top-left desk.
- 3:50 The teal woman walks into the top corridor. Bubble: 💝 and !
- 3:52 She picks up the box. Bubble: 💝 and you.
- 3:53 Burst bubble: !, 👉, you.

**Why it ended:** The end picture shows her holding the pink box and you looking 😳.

**Cause:** Dropping the box in the corridor.

**Ambiguous:** She walked there at 3:50. That could be her normal route to fetch the mail (in run 9 she reached the shelf at 3:53), or it could be about the box. I can't tell which.

---

## Run 12 (WIN)

- 3:25 You pull the plug. Static.
- 3:27 You take the pink box while the bald man is at the camera.
- 3:29 The bald man's bubble: plug and !
- 3:30 You drop the pink box on the floor of the right-hand room. He plugs the camera back in. Bubble: 😊.
- 4:00 Same ending picture as run 8. You're standing in the teal woman's room, not sitting.

**Why it ended:** The pink box was still lying in the right-hand room and nobody went in there.

**Cause:** Unplugging the camera, taking the box, and dropping it somewhere off the teal woman's path.

**Ambiguous:** The bald man's trip to the camera looks like a reaction to the static. That one seems real.

---

## Run 13 (LOSS, 3:33)

- 3:25 to 3:29 Same as run 12: unplug, grab the box, and the bald man's plug and ! bubble.
- 3:30 You stand next to the teal woman's rug, holding the box.
- 3:32 An eye icon appears and she turns left. Bubble: 💝 and ?, then 💝 😍.
- 3:33 Bubble: you, 💝, ? Then a burst: !, 👉, you.

**Why it ended:** The end picture shows her cheering, with 💝 and 😍 icons, while you hold the box looking 😳.

**Cause:** Carrying the box into her room.

**Ambiguous:** The eye icon looks like she reacted to you. But she makes the same left turn at around 3:29 to 3:33 in runs 8 and 11, with no box anywhere near her. You walked into her routine glance.

---

**Two things every player will be confused by:**
- In the win pictures (runs 8 and 12), the teal woman's portrait is shown with a red frame. I can't tell what that red frame means.
- The guard's write-up loss (run 9) hides a second failure, the exposed pink box.

### 2-compare: report.md

Verdict: fixable

## Runs
- **Run 1 (do nothing → mail call): `explained`.** "The parcel was delivered with you there. You did nothing." This is correct.
- **Run 2 (away at 4:00 → blamed): `explained`.** "Leaving didn't help, because the parcel was still opened in public." This is correct. The box is held up over the empty chair.
- **Run 3 (take on camera → caught): `partly`.** The reader got "caught on camera" but not what the player did to cause it.
  - Reading: "The captions have no 'used' mark, so I can't tell if you touched anything or were just standing close."
  - What happened: the player took the box while the camera was live.
  - Visual cause: missing cue. In run-03/03.png the hand slot is empty and no action is marked. The frozen monitor on the end card (04.png) shows you standing beside the shelf, empty-handed. Nothing shows the grab, so "standing near the shelf" is an equally good reading.
  - Fix: freeze the monitor on the moment of the grab, with the pink box in your hands on screen, and put a 💝 in the icon row (🖥️ 👉 💝 you).
- **Run 4 (plug, take, drawer → win, hidden): `explained`.** "The parcel was gone before the mail round. Unplugging the camera kept the shelf grab off-camera." The reader wasn't sure whether the drawer shredded or hid the box (see Problems).
- **Run 5 (plug, swap labels → Bob gets it): `explained`.** "The label swap made Bob the one receiving the pink parcel."
- **Run 6 (same, away at 4:00 → win via Bob): `explained`.**
- **Run 7 (plug, drawer, away at 4:00 → win, hidden): `explained`.** "Sitting down wasn't needed." The reader flagged the end icons (see Problems).
- **Run 8 (broom poke, then drawer → win, hidden): `partly`.** The reader got the hiding but not the camera's part in the win.
  - Reading: "Cause: Taking the pink box and stashing it at the typewriter desk. I can't tell whether knocking the camera mattered."
  - What happened: the poke left the camera staring into the plant for the rest of the day. That is why the shelf grab at 3:35 went unseen.
  - Visual cause: cause and effect too far apart, plus a missing cue. In run-08/06.png, at the grab, the camera has no cone at all over the shelf. The leaf on the monitor is a small detail in the lobby, and Bob is facing away. Nothing on screen says "the camera can't see this right now." Run 10 shows the live camera catching you, but this reader never linked the two runs.
  - Fix: after the poke, keep drawing the camera's cone as a short grey wedge stuck in the plant leaves. At the moment of any shelf action, flash a small 🌿 inset over Bob's monitor.
- **Run 9 (poke, hang about → sent to work, mail call → fail): `partly`.** The reader got what the player did (hanging about when Bob came over) but credits the loss to the wrong thing.
  - Reading: "The end picture shows the bald man pointing at you behind a stack of paper: you got written up." And: "Two failures, one picture. A player could easily blame the wrong one."
  - What happened: ways.md says the work is "not a loss by itself." The loss is the mail call. Lin collected the box at 3:53 and held it up at 4:00 (run-09/10.png: Lin and Bob both show "you !").
  - Visual cause: the end card shows the wrong cause. run-09/11.png draws the work pile (Bob, 👉, papers) and leaves out the pink box and Lin.
  - Fix: use the mail-call end card (Lin holding up the box, you red-faced at your desk) with a small paper stack beside you. Icons: 📄 ⏳ 💝 you.
- **Run 10 (poke while it looks at you → caught): `explained`.** "Walking into the camera's view before you knocked it away."
- **Run 11 (box dropped in corridor → found): `explained`.** "Dropping the box in the corridor."
- **Run 12 (box dropped in store room → win, hidden): `explained`.** "The pink box was still lying in the right-hand room and nobody went in there." The reader also correctly read Bob's trip to the camera as a reaction to the static.
- **Run 13 (carry box into office → spotted): `explained`.** "Carrying the box into her room." The reader also correctly read her left turn as routine and the eye icon as her actually seeing you.

## Beats that misled the reader
- **Run 9, end card: the work pile reads as the loss.** This is the run-9 problem above, and it is a blocker.
- **Run 8, the camera's role in the win was missed.** This is the run-8 problem above, and it is a blocker.
- **Run 8, 4:00: the handover read backwards.**
  - Reading: "The bald man hands the teal woman the brown face box."
  - What happened: Lin had already handed Bob his box. At 4:00 she has nothing for you and shrugs.
  - Visual cause: missing cue. In run-08/09.png and 10.png, Bob holds the box next to Lin and the handover itself is never shown. Lin's shrug, with both arms up, also reads as a cheer.
  - Fix: show one frame of the box passing from Lin to Bob. Draw her shrug with palms up, shoulders raised and arms low.
- **Run 4, the drawer reads as a machine.**
  - Reading: "You used the white machine on your desk… I can't tell whether the desk machine shredded the parcel or just hid it."
  - What happened: you stuffed the box in your desk drawer.
  - Visual cause: missing cue. In run-04/05.png the highlight frames the typewriter, and no drawer is drawn on the top-down desk.
  - Fix: draw a drawer front on the desk's edge and highlight that. Show it slide open, the box sink in, and the drawer shut.
- **Run 5, 3:28: Lin's sight line to your empty chair reads as a reaction.**
  - Reading: "Teal's dotted line points at your empty chair, but nothing follows from it."
  - What happened: this is only her routine glance. Nothing reacts to your being away.
  - Visual cause: a sight line that looks like noticing. The same dotted line to the empty chair is how she blames you in run 2.
  - Fix: draw dotted sight lines only when someone has actually noticed something.

## Earlier problems
- E1: fixed. The camera's cone is visible and turns red when it's on you (run-10/04.png). The run-10 reader named the timing correctly.
- E2: fixed. The run-8 win card shows the desk with no box on it.
- E3: fixed. "Unplugging the camera kept the shelf grab off-camera" (run 4). The same idea comes through in runs 11 and 12.
- E4: fixed. "The pink box was still lying in the right-hand room and nobody went in there" (run 12).
- E5: no longer applies. In the spotted loss (run 13), Lin no longer takes the box; you are left holding it.
- E6: fixed. Her bubbles are now 💝 ? and then you 💝 ?, which point at what she saw.
- E7: fixed. The burst is now 💝 😍 and the end card shows her delighted.
- E8: fixed. Static + ? (after an unplug) and monitor + 💝 ❓ (before a bust) now read differently, and neither reader mixed them up.

## Problems
- blocker: In run 9, the end card shows the 20 minutes of work as the loss. The real loss is the mail call, which ways.md and the 4:00 frame both show, so players will learn that hanging about loses on its own. — Use the mail-call end card with a paper stack beside you, and icons 📄 ⏳ 💝 you.
- blocker: In run 8, nothing at the shelf grab shows that the knocked camera is blind, so the reader can't say whether the poke mattered to the win. — Keep a grey cone stuck in the plant for the rest of the day, and flash a 🌿 inset over Bob's monitor at every shelf action.
- should: In run 3, the end card's frozen monitor shows you empty-handed beside the shelf, and no grab is marked. The reader can't tell whether taking the box or just standing there got you caught. — Freeze the monitor on the grab with the box in your hands, and add 💝 to the icons.
- should: The drawer isn't drawn. The highlight sits on the typewriter, so stashing the box reads as "used a machine," possibly a shredder (run 4). — Draw a drawer front and highlight it, then animate it opening, the box sinking in, and the drawer shutting.
- should: In run 7 you're away at 4:00, but the win card's icons are identical to run 4's and still show you ♪ (humming). ways.md promises a separate `end-hidden-away` card. — Drop the ♪ when you're absent and use the icons 🪑 🤷.
- should: The win card puts Lin's new portrait in a red frame (run-08/10.png). The second reader couldn't tell what it meant, and red is the loss colour everywhere else. — Frame newly earned portraits in teal or gold.
- should: At 4:00 in the hidden route, the box handover to Bob is never shown, and Lin's arms-up shrug reads as a cheer. The reader thought Bob was giving her the box (run 8). — Add one frame of the box passing to Bob, and draw the shrug with palms up and arms low.
- nit: In run 5, Lin's routine glance draws a dotted sight line to your empty chair. That is the same mark that means "blamed" in run 2. — Draw dotted lines only when someone has actually noticed something.
- nit: In run 11, the reader couldn't tell whether Lin's 3:50 walk was her normal route or a reaction to the box. — Show her path to the shelf as routine (for example, a 📬 bubble as she sets off) before the 💝 ! when she spots the box.

<!-- /cold-read:replay -->
