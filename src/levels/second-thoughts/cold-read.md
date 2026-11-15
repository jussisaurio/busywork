# Cold reads: second-thoughts
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:title {"verdict":"works","date":"2026-11-15","commit":"500ae5a","hash":"81545956fed3b75917ec01e89324f4c26abf5a32d30f1c5774d76d95d4b69cb6","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","ways":"137f5d0de592b20539e5c3f465f533562c29294126979242c4b68beec51ee451","prompts":"71812b7000506aab5e901a48dd63d8aa5d43c7546f39641d13d12179213bd417"},"model":"default","tally":{"miss":3,"near":2,"leak":0},"problems":{"blocker":0,"should":2,"nit":1}} -->
## title: works
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 81545956fed3: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 3 miss, 2 near, 0 leak.
Problems: 0 blocker, 2 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-guess | guesses.md | 12 s | $0.02 |
| 2-judge | report.md | 31 s | $0.09 |
| all | | 42 s (the steps add up to 42 s) | $0.11 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The "@boss" icon, read next to "at 3:40", suggests messaging him or booking a meeting to keep him away at that moment. That puts players on a route that doesn't exist and hints that timing around 3:40 matters, when the real routes work any time. Fix: swap "@boss" for 👔 so the icon shows who he is, not a way to reach him.
- E2 [should] In two guesses the 📦 icon reads as a tool: a box to bury the letter, or a package to distract him. It's really the "clear your desk" box from the losing end card, so it misleads before it pays off. Fix: replace 📦 with 🚪 (shown the door), or drop it.

### 1-guess: guesses.md

1. **Take the letter back out of the tray before 3:40.** Suggested by "Second Thoughts", "in the boss's tray" and "3:40". You change your mind and quietly grab it while he's away.
2. **Swap it for something harmless**, like a decoy envelope or a nicer letter. Suggested by the ✉️ icon and "angry resignation letter". "Second Thoughts" could also mean writing a second, friendlier letter.
3. **Keep the boss away from his tray at 3:40**, for example by sending him a message or setting up a meeting. Suggested by "@boss" and "He goes through his tray at 3:40".
4. **Bury it under other paperwork or a box** so he doesn't reach it or misses it. Suggested by the 📦 icon and "his tray".
5. **Get a package delivered to him to distract him or change his routine.** Suggested by the 📦 icon and "3:40". This is a weak guess.

Stake: If the boss reads my angry letter, he takes it as my resignation and I'm out of a job. "Keep your job" says this, but the card never says outright what happens if he reads it.

### 2-judge: report.md

Verdict: works
- Stake: clear. Your angry resignation letter is sitting where the boss will read it at 3:40, and if he does, you lose your job. A stranger gets this straight away. The card doesn't say what happens if he reads it, but "resignation" plus "Keep your job" covers that.
- Take the letter back out of the tray before 3:40: near. This is the last step of every route, and "in the boss's tray" plus "Second Thoughts" led to it. But it's the goal, not the method. The puzzle is how to get him off his desk, and the guess doesn't say how.
- Swap it for something harmless: miss. No route swaps anything. The ✉️ icon and "angry" led to it.
- Keep the boss away from his tray at 3:40: near. It points at the right area, since every route empties his desk. But it misses the key step, which is killing the lights (the panel, the coffee machine or the breaker), and it gets the timing wrong too. "@boss" and "goes through his tray at 3:40" led to it.
- Bury it under paperwork or a box: miss. The 📦 icon led to it.
- Get a package delivered to distract him: miss. The 📦 icon led to it.

The card reads like a person talking. "Goes through his tray" is how office workers really say it. The name sets up the regret, and the card stays quiet on lights, fuses and the coffee machine. No guess comes near the dark.

## Problems
- should: The "@boss" icon, read next to "at 3:40", suggests messaging him or booking a meeting to keep him away at that moment. That puts players on a route that doesn't exist and hints that timing around 3:40 matters, when the real routes work any time. Fix: swap "@boss" for 👔 so the icon shows who he is, not a way to reach him.
- should: In two guesses the 📦 icon reads as a tool: a box to bury the letter, or a package to distract him. It's really the "clear your desk" box from the losing end card, so it misleads before it pays off. Fix: replace 📦 with 🚪 (shown the door), or drop it.
- nit: "Keep your job." sounds a little flat, like a line out of a manual, after a lively first line. Fix: "You'd quite like to keep your job."

<!-- /cold-read:title -->

<!-- cold-read:sense {"verdict":"works","date":"2026-11-15","commit":"e18dbc1","hash":"a8013d3c69344d8fd95d6a7487b14aaaa1445a8ca8525ba16ab4a4a9e0ebb248","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","ways":"9dcc68539837651a4cf2ff481ca2b885938e6d789ad93dcd4d6f13faa9b39f9c","prompts":"4efae5d3d9191596f5720cdf7e7483eea858a949c44cf5579c3f9b7d49f613b3"},"model":"default","tally":{"sensible":7,"stretch":2,"nonsense":0},"problems":{"blocker":0,"should":3,"nit":3}} -->
## sense: works
Recorded 2026-11-15 at commit e18dbc1, by claude -p (model: default). Inputs a8013d3c6934: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 7 sensible, 2 stretch, 0 nonsense.
Problems: 0 blocker, 3 should, 3 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 55 s | $0.13 |
| all | | 55 s (the steps add up to 55 s) | $0.13 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] Lin walks in at 3:09 and switches the machine on. Her own water jug, the one she makes coffee with, is now empty, and water is dripping off the counter. She doesn't notice either. A real person would stop and wonder before pressing the switch. — Fix: give her a puzzled ❓ at the empty jug. She mutters, refills it at the sink, wipes the counter and fills the machine from the front. Then she switches it on, and the water already in its back still shorts it. The route survives, and she acts like a person.
- E2 [should] "Nobody else cares what you do with a jug" also covers someone pouring water into the back of the office coffee machine. Anyone who can see the kitchen, like Kev at his desk, would call out "uh, what are you doing?" just as Lin would. The loss text also says you can be "seen from the front of the machine" without saying by whom. — Fix: any coworker who can see you pouring reacts the way Lin does. Name who can see the kitchen.
- E3 [should] Getting caught soaking the machine only gets you "20 minutes of assigned work at your desk." A real boss who hears someone poured water into the coffee machine would at least come out and ask what on earth you were doing. — Fix: he comes out, glares, and says "Desk. Now." Then he goes back in. The result is the same, but it reads like a real reaction.

### 1-judge: report.md

Verdict: works

- The switch (win): sensible — a boss whose own lights go out walks to the panel and tries switches, and while he does, nobody is watching his desk.
- The blackout (win): stretch — the short, the dark and the boss holding the torch for Kev all hold up, but Lin finds her water jug empty and a puddle on the counter and doesn't react at all.
- The breaker (win): sensible — the main breaker trips, the boss goes to look, and Kev fixes it while the boss holds the light.
- Eating it (win, finishing step): sensible — chewing paper to pulp is absurd, but anyone could do it, and a wet wad tells nobody anything.
- 3:40, letter still in tray (lose): sensible — he reads an angry resignation letter, and it's accepted.
- Caught with it (lose): sensible — he watched you take something out of his own tray.
- Found at the panel (lose): sensible — the person standing at the switch is the one who flipped it.
- Found at the fuse box (lose): sensible — same reasoning as the panel.
- Seen soaking the coffee machine (lose): stretch — Lin's shout makes sense, but "Nobody else cares what you do with a jug" lets other coworkers watch you pour water into the coffee machine and say nothing.

## Problems
- should: Lin walks in at 3:09 and switches the machine on. Her own water jug, the one she makes coffee with, is now empty, and water is dripping off the counter. She doesn't notice either. A real person would stop and wonder before pressing the switch. — Fix: give her a puzzled ❓ at the empty jug. She mutters, refills it at the sink, wipes the counter and fills the machine from the front. Then she switches it on, and the water already in its back still shorts it. The route survives, and she acts like a person.
- should: "Nobody else cares what you do with a jug" also covers someone pouring water into the back of the office coffee machine. Anyone who can see the kitchen, like Kev at his desk, would call out "uh, what are you doing?" just as Lin would. The loss text also says you can be "seen from the front of the machine" without saying by whom. — Fix: any coworker who can see you pouring reacts the way Lin does. Name who can see the kitchen.
- should: Getting caught soaking the machine only gets you "20 minutes of assigned work at your desk." A real boss who hears someone poured water into the coffee machine would at least come out and ask what on earth you were doing. — Fix: he comes out, glares, and says "Desk. Now." Then he goes back in. The result is the same, but it reads like a real reaction.
- nit: You can chew up the envelope on the open floor, in front of everyone, and spit a grey wad at your feet, and no coworker reacts. People would stare, though nobody would know what it was. — Fix: a nearby coworker gives a disgusted 😬 and goes back to work. Nobody reports it.
- nit: In the switch route the boss uses his phone flash in a glass office in the middle of the afternoon. With the floor still lit outside, he'd hardly need it. — Fix: drop the flash for the switch route and keep it for the blackouts.
- nit: Kev "looks through the unlabelled breakers" to find which one is down. A pulled main breaker is the big, obvious one. — Fix: Kev spots it at once, but fumbles a moment by phone light before he pushes it up.

<!-- /cold-read:sense -->

<!-- cold-read:motives {"verdict":"works","date":"2026-11-15","commit":"e18dbc1","hash":"a2e3ed86486c40c8edf7c5a50dc278909be1d1613a289de592da034f6b7cd1bb","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","who":"4db2fbceae1022279f3729574ea88e48c119cdd06beefdd697f3c436395b7004","prompts":"aa0481bd7d2903c1741f536b834919fec681febf17e0865d79a523b4af6bf462"},"model":"default","tally":{"motivated":4,"binds":1,"thin":0,"unmotivated":0,"contradicts":0,"only-you":0},"problems":{"blocker":0,"should":3,"nit":1}} -->
## motives: works
Recorded 2026-11-15 at commit e18dbc1, by claude -p (model: default). Inputs a2e3ed86486c: the card, premise.md's who does what, the pass's prompts.
Items: 4 motivated, 1 binds, 0 thin, 0 unmotivated, 0 contradicts, 0 only-you.
Problems: 0 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 38 s | $0.07 |
| all | | 38 s (the steps add up to 38 s) | $0.07 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] Nothing on screen shows the machine is Lin's ("her machine and her water"), so when she reports you to the boss it reads like a game trigger, not a person defending her stuff. — Give it a named mug or a "LIN'S — DO NOT TOUCH" sticky note the player can read before tampering.
- E2 [should] Nobody says how Lin reacts when her own machine smokes or the floor goes dark. A real coworker would rush to her machine or at least look up. Without a reaction she seems to stop existing once she sits down at 3:31. — Give her a beat: she stands, looks toward the kitchen and calls "is that my machine?", or she follows Kev and the boss toward the fuse box.
- E3 [should] The boss's punishment, a pile of work "to keep them at their desk", is a reasonable reason, but it's only in the prose, so on screen it looks like a lock. — Have him say it aloud as he drops the pile, e.g. "Since you've got time to play with the coffee machine…".

### 1-judge: report.md

Verdict: works

- The boss: motivated. He comes back from lunch, faces the tray, sighs, drums his fingers and keeps checking the brass clock. The player sees all of this before the clock rings at 3:39 and he gives up at 3:40, so the dread and the deadline are both clear. When his lights go out he goes to the hallway panel, and when the whole floor goes dark he goes to the fuse box. Anyone would do the first, and the second is "the boss has to be seen doing something." Holding the light for Kev fits a boss who can't fix it himself. He never breaks the clock habit he has shown.
- Lin: motivated. Her ☕ shows she wants her afternoon coffee before she walks to the kitchen. The flicker when the machine starts is her own daily habit. Telling the boss when she catches you tipping the jug into it is in character (❗👉). One weak point: nothing on screen shows the machine is hers before she tells on you. Also, nobody says what she does when her own machine smokes or the power goes, even though it's her machine.
- Kev: motivated. At the 3:10 flicker he glances up, which tells the player he notices the electrics before he is needed at the fuse box. Unplugging a smoking machine before resetting the fuse is what a real handyman does. Nothing he does contradicts that.
- You: motivated. You calmed down after lunch and want the letter back before he reads it.
- The card's rule: binds. The card sets no rule for the office, only your goal ("Keep your job") and his 3:40 tray time. Both come from the boss's routine.

## Problems
- should: Nothing on screen shows the machine is Lin's ("her machine and her water"), so when she reports you to the boss it reads like a game trigger, not a person defending her stuff. — Give it a named mug or a "LIN'S — DO NOT TOUCH" sticky note the player can read before tampering.
- should: Nobody says how Lin reacts when her own machine smokes or the floor goes dark. A real coworker would rush to her machine or at least look up. Without a reaction she seems to stop existing once she sits down at 3:31. — Give her a beat: she stands, looks toward the kitchen and calls "is that my machine?", or she follows Kev and the boss toward the fuse box.
- should: The boss's punishment, a pile of work "to keep them at their desk", is a reasonable reason, but it's only in the prose, so on screen it looks like a lock. — Have him say it aloud as he drops the pile, e.g. "Since you've got time to play with the coffee machine…".
- nit: "He does no other work" for forty minutes is thin for a real manager. — Let him put off the tray in other ways too: a phone call, idle email scrolling, straightening pens. That keeps the avoidance and makes him look more like a real boss.

<!-- /cold-read:motives -->

<!-- cold-read:props {"verdict":"works","date":"2026-11-15","commit":"500ae5a","hash":"82239a7f312e798c9e339a1159c1eff7c6d0cf5736c51cd3e6410a0960e2398a","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","things":"8e91be27196532e20f3f490f68615743eeb8d13a3b77b40b58a33ad4cf07cc76","prompts":"e4a62e7d4c56bb76d5cc46d69b3c0fd96478427c533f15affaaa5f43d93d7558"},"model":"default","tally":{"fits":13,"odd":2,"pointless":0,"misleading":0},"problems":{"blocker":0,"should":2,"nit":2}} -->
## props: works
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 82239a7f312e: the card, premise.md's things in the office, the pass's prompts.
Items: 13 fits, 2 odd, 0 pointless, 0 misleading.
Problems: 0 blocker, 2 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 32 s | $0.07 |
| all | | 32 s (the steps add up to 32 s) | $0.07 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The desk clock rings at 3:39 for no everyday reason, and it looks like you could change it. Players will try to wind it back to buy time, and the file doesn't say whether that works. — Make it his desk phone's calendar alert instead. Or keep the clock, say outright that you can't touch it, and give him a reason for the alarm, like a 3:40 "tray" reminder he set himself.
- E2 [should] The elevator and restroom look usable but have no stated use. "Take the elevator and leave" or "hide in the restroom" are things players will try. — Say what happens: the elevator takes you nowhere useful (for example, "You can't leave before five"), and the restroom is a dead end with a one-line reaction.

### 1-judge: report.md

Verdict: works
- His in-tray and your envelope: fits — every boss has an in-tray, and it's in plain view so you know what you're after.
- His desk and brass desk clock: odd — a desk clock fits, but one that rings at 3:39 is strange. A real boss would get a phone or calendar alert. It also looks like you could set it back, and the file doesn't say whether you can.
- His glass office walls: fits — glass-walled manager offices are normal.
- The lighting panel: fits — a row of unlabelled switches on a hallway wall is a real office thing. It's tucked away but easy to read as switches.
- His hallway door and side door: fits — an office that also opens into the meeting room is believable.
- The fuse box: fits — breaker panels sit in back hallways, and nobody labels them.
- The old coffee machine: fits — it belongs in the kitchen. It really brews, so it isn't misleading even though the cup goes nowhere.
- The glass water jug: fits — you'd keep one beside a coffee machine to fill it. It looks usable and it is.
- The fridge: fits — every office kitchen has one. Players will try to open it, though, and the file only uses it as cover.
- The kitchen table: fits — the normal place for a coffee break.
- Your desk and drawer: fits — a desk drawer is the obvious place to hide something.
- Lin's and Kev's desks: fits — ordinary desks.
- Everyone's phone: fits — everyone carries one, and using it as a torch is what people actually do in a blackout.
- Glass lobby, elevator, restroom: odd — they're right for an office floor. But an elevator call button and a restroom door look usable, and the file doesn't say what happens if you use them.
- The spat-out wad: fits — it only exists because of what you did, and it's clearly mess, not a tool.

## Problems
- should: The desk clock rings at 3:39 for no everyday reason, and it looks like you could change it. Players will try to wind it back to buy time, and the file doesn't say whether that works. — Make it his desk phone's calendar alert instead. Or keep the clock, say outright that you can't touch it, and give him a reason for the alarm, like a 3:40 "tray" reminder he set himself.
- should: The elevator and restroom look usable but have no stated use. "Take the elevator and leave" or "hide in the restroom" are things players will try. — Say what happens: the elevator takes you nowhere useful (for example, "You can't leave before five"), and the restroom is a dead end with a one-line reaction.
- nit: The fridge looks like it opens, but it's only described as a spot to stand behind. — Let it open to a shelf of labelled lunches and a joke line, so trying it pays off.
- nit: The boss's office lights are only on the hallway panel, with no switch inside his room. That's possible in big open-plan buildings, but it's unusual. — Add one line: "his office has no switch of its own; the floor is on the central panel." Then his walk out to fix them makes sense.

<!-- /cold-read:props -->

<!-- cold-read:joke {"verdict":"works","date":"2026-11-15","commit":"500ae5a","hash":"ed088f0801a067400561dab2fa82557331a07479742e56ec1d531a2d1b713a09","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","ways":"137f5d0de592b20539e5c3f465f533562c29294126979242c4b68beec51ee451","prompts":"a4db88684bb737e23a87ca6a38aba544ee72fc48b552bd042e8767ee6f88c0a7"},"model":"default","tally":{"funny":3,"payoff":0,"mild":5,"chore":1,"flat":0,"undescribed":1},"problems":{"blocker":0,"should":5,"nit":1}} -->
## joke: works
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs ed088f0801a0: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 3 funny, 0 payoff, 5 mild, 1 chore, 0 flat, 1 undescribed.
Problems: 0 blocker, 5 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 33 s | $0.09 |
| all | | 33 s (the steps add up to 33 s) | $0.09 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] premise.md doesn't describe the end card for the win, so there's no payoff picture after the cover-up — at 3:40 the boss goes through an empty tray and finds a sticky note in your handwriting saying "Great quarter, boss!" while you smile at your desk with grey paper on your teeth.
- E2 [should] The breaker is a chore — Kev finds a breaker labelled "DO NOT TOUCH — BOSS'S AQUARIUM", and the boss's fish tank bubbler stops while he stands there.
- E3 [should] The 3:40 loss is the obvious picture — the boss is calmly marking your angry letter with a red pen, circling the typos, and holding it up to you with "SEE ME" on it.
- E4 [should] Four of the five lose cards are the boss pointing at you — give each loss its own reaction. At the panel, he hands you the switch job for good ("Facilities, then?"). At the fuse box, the torch stays on you as Kev slowly turns round to look too.
- E5 [should] The switch route has no final spike — when he gets back, the switches he tried have left the meeting room dark with a meeting still going on inside, phones held up.

### 1-judge: report.md

Verdict: works

- The switch (win): mild — the picture is the boss alone at an unlabelled panel down the hall, trying switches one by one while his glass office blinks on and off. It's a nice bit, but nobody reacts to the blinking and there's no spike at the end.
- The blackout (win): funny — you kill the office coffee machine in sparks and smoke and black out the whole floor just to get one letter back. Then everyone wanders around in phone-torch beams while the boss holds a light for Kev with his back to his own desk.
- The breaker (win): chore — walk to the box, pull the lever, walk away, fetch the letter. It's the blackout without the coffee machine, so there's nothing in it to laugh at.
- Eating it (win, final step on every route): funny — you cram an envelope in your mouth, chew, gag (🤢) and spit a grey wad at your feet. Hiding it in a drawer or walking it away is just an errand next to this.
- 3:40, still in tray (lose): mild — the boss holds up your letter, furious, while you sweat. That's the obvious picture. The 📦 hint at packing your desk is the only twist.
- Caught with it (lose): mild — he points at you mid-reach or holding the envelope. Nothing more to it.
- Found at the panel (lose): mild — you were "pretending to be busy" at a light switch, and his switch is still off behind you. The setup is there, but the card is just another point.
- Found at the fuse box (lose): mild — his torch lands on you like an interrogation spotlight next to the open box. Good picture, but it's still the same point.
- Seen soaking the coffee machine (lose): funny — your punishment is 20 minutes of your actual job.
- The ending: undescribed — premise.md doesn't describe the end card. ways.md gives no picture for the win; once the letter is out of sight the level just stops.

## Problems
- should: premise.md doesn't describe the end card for the win, so there's no payoff picture after the cover-up — at 3:40 the boss goes through an empty tray and finds a sticky note in your handwriting saying "Great quarter, boss!" while you smile at your desk with grey paper on your teeth.
- should: The breaker is a chore — Kev finds a breaker labelled "DO NOT TOUCH — BOSS'S AQUARIUM", and the boss's fish tank bubbler stops while he stands there.
- should: The 3:40 loss is the obvious picture — the boss is calmly marking your angry letter with a red pen, circling the typos, and holding it up to you with "SEE ME" on it.
- should: Four of the five lose cards are the boss pointing at you — give each loss its own reaction. At the panel, he hands you the switch job for good ("Facilities, then?"). At the fuse box, the torch stays on you as Kev slowly turns round to look too.
- should: The switch route has no final spike — when he gets back, the switches he tried have left the meeting room dark with a meeting still going on inside, phones held up.
- nit: The drawer and walk-away endings are much weaker than chewing it — let Kev glance up (❓) whenever you chew within his sight, so chewing is the risky, funny choice and the drawer is the safe, dull one.

<!-- /cold-read:joke -->

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"e18dbc1","hash":"066c73a27a6ce827399f0ee23d5f161f75a380abef0024a687f9cf5d8f3b1a19","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","premise":"41048e4c400f21f26fac1eeedd8f5279b94665193385327062f70e004ac0e054","prompts":"f5883160f1d3858e02431a0eee883b8939a1a09664f6e614e9f267258968625e"},"model":"default","problems":{"blocker":1,"should":6,"nit":4}} -->
## premise: fixable
Recorded 2026-11-15 at commit e18dbc1, by claude -p (model: default). Inputs 066c73a27a6c: the card, premise.md, the pass's prompts.
Problems: 1 blocker, 6 should, 4 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 14 s | $0.02 |
| 2-review | report.md | 167 s | $0.79 |
| all | | 180 s (the steps add up to 180 s) | $0.81 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] ** The blackout route depends on the player predicting that pouring water into the back of a coffee machine shorts it. In a real office, the back of the machine is where the water tank is, and a jug standing next to it is there to fill it. When the player stands at the machine with the jug, the action looks like filling it, maybe even helping. Nothing on screen says the water will short it. The daily flicker only shows that the machine strains the wiring; it never suggests that water is the danger. So the player finds the short by trial and error, and Lin getting angry at someone topping up her machine makes no sense. **Fix:** move the target to something that looks plainly electrical and plainly not for water. For example, a frayed power strip on the counter under the machine, sparking a little during the 3:10 flicker. The player then tips the jug onto the strip.
- E2 [should] ** The breaker route makes the blackout route pointless. The fuse box is visible from 3:00 with a yellow high-voltage sticker, works at any time, and produces the same blackout with the boss and Kev doing the same things. Lin is away from her desk next to it from 3:05 to 3:31. A player who tries the breaker first has no reason to bother with the coffee machine, and the joke premise.md chose lives in that route. **Fix:** give the breaker a visible cost, such as a padlock whose key Kev carries. Or let Kev reset a pulled breaker in seconds, because nothing is smoking.
- E3 [should] ** The joke says the boss holds his torch on the fuse box "while behind his back you slip out." On screen that isn't what happens. The boss's spot at the fuse box (`fuse_watch` (2,8), facing N) puts him just south of his own glass office, facing it. The player sees him looking toward the robbery, not away from it. **Fix:** put the fuse box where he has to turn his back to his office, for example on the wall opposite it, so the picture matches the gag.
- E4 [should] ** The level is meant to teach "the dark shrinks sight," but in all three routes the boss simply leaves his desk. The dark is incidental: at most it hides you from Lin through the glass. The real lesson is "a power problem lures the boss away." **Fix:** add one route where the boss stays seated in the dark with his phone torch pointed somewhere else, and you take the letter from inside his arm's-length blind zone.
- E5 [should] ** On the blackout route Lin stands at the counter over a fresh puddle dripping off it and switches the machine on without reacting. Anyone would stop. **Fix:** with the power-strip fix the water goes behind the counter, so drop the puddle at her feet.
- E6 [should] ** The "deskwork" loss card shows Lin pointing at you and the jug as what ended your day. But the 20 minutes of assigned work ends around 3:29, which still leaves time for the breaker. If you fail after that, the card blames the wrong thing. **Fix:** use the deskwork card only when the assigned work was still running at 3:39. Otherwise show the plain fail card.
- E7 [should] ** On the switch route, the boss leaves the meeting room into the hallway just as you leave the panel the same way. He passes the one person walking away from the switch seconds after his lights went out, and doesn't react. **Fix:** route him out through his hallway door, or let him give a suspicious ❓ to anyone he passes within a few tiles of the panel.

### 1-card: first-read.md

**Situation:** At 3:00 I've already put an angry resignation letter in the boss's in-tray, and now I regret it. In 40 minutes he goes through the tray and finds it.

**What I must do:** Keep my job. Reading 1: get the letter back, or destroy it, before 3:40. Reading 2: he still reads it, but I make sure he doesn't act on it. I could swap it for something else, make him late or distract him.

**If I fail:** He reads it at 3:40 and I'm out. I'm guessing 📦 is the box of desk stuff you carry out when you leave.

**Questions:**
- Does taking the letter count as a win if someone sees me do it?
- Does "goes through" mean he reads every page or just skims?
- Can I walk up and ask for it back?
- Is 📦 the failure picture, or an object I can use?
- Is "@boss" a place, a person to follow, or an email?
- Is the letter signed? Could a different letter take its place?
- Name: whose second thoughts? Mine, or the boss's, meaning I have to make *him* reconsider?

### 2-review: report.md

Verdict: fixable

**Best thing:** The boss's dread routine works on screen without any explanation. He sighs at his tray, drums his fingers and checks the brass clock. At 3:39 the clock rings and he drags the tray over. That shows the deadline with no text.

## Problems
- **blocker:** The blackout route depends on the player predicting that pouring water into the back of a coffee machine shorts it. In a real office, the back of the machine is where the water tank is, and a jug standing next to it is there to fill it. When the player stands at the machine with the jug, the action looks like filling it, maybe even helping. Nothing on screen says the water will short it. The daily flicker only shows that the machine strains the wiring; it never suggests that water is the danger. So the player finds the short by trial and error, and Lin getting angry at someone topping up her machine makes no sense. **Fix:** move the target to something that looks plainly electrical and plainly not for water. For example, a frayed power strip on the counter under the machine, sparking a little during the 3:10 flicker. The player then tips the jug onto the strip.
- **should:** The breaker route makes the blackout route pointless. The fuse box is visible from 3:00 with a yellow high-voltage sticker, works at any time, and produces the same blackout with the boss and Kev doing the same things. Lin is away from her desk next to it from 3:05 to 3:31. A player who tries the breaker first has no reason to bother with the coffee machine, and the joke premise.md chose lives in that route. **Fix:** give the breaker a visible cost, such as a padlock whose key Kev carries. Or let Kev reset a pulled breaker in seconds, because nothing is smoking.
- **should:** The joke says the boss holds his torch on the fuse box "while behind his back you slip out." On screen that isn't what happens. The boss's spot at the fuse box (`fuse_watch` (2,8), facing N) puts him just south of his own glass office, facing it. The player sees him looking toward the robbery, not away from it. **Fix:** put the fuse box where he has to turn his back to his office, for example on the wall opposite it, so the picture matches the gag.
- **should:** The level is meant to teach "the dark shrinks sight," but in all three routes the boss simply leaves his desk. The dark is incidental: at most it hides you from Lin through the glass. The real lesson is "a power problem lures the boss away." **Fix:** add one route where the boss stays seated in the dark with his phone torch pointed somewhere else, and you take the letter from inside his arm's-length blind zone.
- **should:** On the blackout route Lin stands at the counter over a fresh puddle dripping off it and switches the machine on without reacting. Anyone would stop. **Fix:** with the power-strip fix the water goes behind the counter, so drop the puddle at her feet.
- **should:** The "deskwork" loss card shows Lin pointing at you and the jug as what ended your day. But the 20 minutes of assigned work ends around 3:29, which still leaves time for the breaker. If you fail after that, the card blames the wrong thing. **Fix:** use the deskwork card only when the assigned work was still running at 3:39. Otherwise show the plain fail card.
- **should:** On the switch route, the boss leaves the meeting room into the hallway just as you leave the panel the same way. He passes the one person walking away from the switch seconds after his lights went out, and doesn't react. **Fix:** route him out through his hallway door, or let him give a suspicious ❓ to anyone he passes within a few tiles of the panel.
- **nit:** The boss "tries one unlabelled switch after another," but only his own lights blink, so you never see him trying the wrong ones. **Fix:** blink the meeting room or kitchen lights during his first tries.
- **nit:** After the machine shorts, Lin still sits at the kitchen table from 3:24 to 3:31 with no coffee. **Fix:** send her back to her desk with a 😞.
- **nit:** Lin is startled (😨) by the flicker, a thing that happens every afternoon. **Fix:** make it a weary 🙄, which also shows it's routine.
- **nit:** After the switch route, the boss spends up to half an hour sighing at a tray that has just gone empty and only notices at 3:40. **Fix:** at his first sigh back at the desk, draw his thought bubble with nothing in the tray, and have him shrug.
- **nit (name/card):** Nothing in the name, card or badge gives away a route, so there is no blocker here. The gaps between first-read.md and the real design:
  - The first reader guessed that swapping the letter or letting him read it harmlessly might work. Neither is possible, and that's fine.
  - The reader asked whose "second thoughts" the name means. **Fix:** none needed, the card answers it.
  - Card line 2 suggests he only looks at the tray at 3:40, but he stares at it all afternoon. The opening frame shows this straight away, so no fix is needed.

<!-- /cold-read:premise -->

<!-- cold-read:verbs {"verdict":"fixable","date":"2026-11-15","commit":"e18dbc1","hash":"332dc75fb18e72147b00d7956def1baad691bfd230141f53b06b4804c50a4ce7","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","verbs":"c644da3dc926e44a5e88ba7273d190dad9c0e34309df7a09c8c531161e9e5918","prompts":"061e477a6c379be6b6b5b6834f94ffc76cc7e18374b9322d5658da9920b335c4"},"model":"default","tally":{"fits":6,"odd":0,"wrong":5},"problems":{"blocker":3,"should":2,"nit":1}} -->
## verbs: fixable
Recorded 2026-11-15 at commit e18dbc1, by claude -p (model: default). Inputs 332dc75fb18e: the card, the verb sheets, the pass's prompts.
Items: 6 fits, 0 odd, 5 wrong.
Problems: 3 blocker, 2 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 25 s | $0.08 |
| 2-judge | report.md | 39 s | $0.13 |
| all | | 63 s (the steps add up to 63 s) | $0.21 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Pretend shows nothing. In letter and coffee panels 2–3, the item stays in plain view, ringed, in the carry pose, and no phone or folder appears. The reader took all four panels for carrying while facing different ways. A player will never learn that pretending hides what they carry, so they can't tell why the boss ignores them. — Draw the actual phone and folder props, hide the item (or show it tucked under the folder), and drop the ring and "E" while pretending.
- E2 [blocker] eat_letter's result shows tearing, not eating. Panel 11 leaves paper scraps on the floor next to a 🤢. The engine also sets `world.wad` to `undefined`, so it is unclear whether a wad should exist at all. A player will think the letter was torn up and left on the floor as evidence. — Either make it "tear/shred" with scraps and no 🤢, or show the letter going to the mouth in panel 10, leave nothing on the floor, and show a chewing bubble.
- E3 [blocker] Eating a contraband letter is not something a person does in a real office. — Replace it with an office way of getting rid of it: shredder, bin, or stuffing it in a drawer.
- E4 [should] Eating sits behind a 0.35 s hold of the same E that drops (panels 4, 8). A slightly long tap destroys the letter permanently, and nothing on screen tells drop and eat apart. — Show a different icon for the hold action next to the E prompt, or move it to a separate key or context.
- E5 [should] The coffee's only verbs are drop and pick up. The steam invites drinking, and nothing answers it. — Add a drink, or remove the steam so it reads as a plain prop.

### 1-read: reading.md

# Reading of verbs/

## verbs/01.png: the white envelope (11 panels)

1. Carrying it. The envelope is held to the player's right, with a yellow ring around it and an "E" key prompt beside it. The player has their back half-turned to the viewer.
2. Carrying it while facing up/away. The envelope is ringed, above the player's head, with the "E" prompt to its right.
3. Carrying it while facing left. The envelope is ringed at the left of the player's head, with "E" to its left.
4. Carrying it while facing the viewer. The envelope is ringed and held to the player's left, with "E" beside it.
5. Dropped. The corner box now shows an empty hand. The envelope is lying on the floor to the player's left, ringed, with an "E" prompt over it.
6. Same as 5: empty hand, envelope on the floor, ringed, with "E". I can't see what changed from 5. The player's pose may be slightly different, but the envelope's position and state look the same. As a player I'd read it as a repeat.
7. Picked back up. The corner box shows the envelope again, and it's back in hand on the player's left with "E", facing left.
8. Carrying it while facing the viewer. This looks just like panel 4, so I can't tell which action it's meant to show.
9. Carrying it while facing the viewer, a bit further left. Again it looks like the same carry state, and I can't tell what was done.
10. The player holds the envelope up in front of their chest, with no "E" prompt. A yellow ring, partly filled, wraps around the player's feet over a dark shadow, like a progress meter. It looks like a hold-to-do action in progress, maybe opening or reading. I can't tell which.
11. Result of 10. The corner box is back to an empty hand. White torn-looking scraps lie at the player's feet, and the player has a speech bubble with a green, queasy face. The envelope seems to have been torn up or destroyed, and the player feels sick or disgusted about it. I can't tell whether the scraps are torn paper or an opened letter, or why the reaction is nausea and not something else.

## verbs/02.png: the steaming white mug (7 panels)

1. Carrying it. The mug is held to the player's right, ringed, with "E". The player has their back half-turned.
2. Carrying it while facing up/away. The mug is ringed above the player, with "E".
3. Carrying it while facing left. The mug is ringed at the left, with "E".
4. Carrying it while facing the viewer. The mug is ringed on the player's left, with "E".
5. Dropped or set down. The corner box shows an empty hand. The mug is sitting upright on the floor to the player's left, ringed, with "E". Nothing spilled.
6. Same as 5. I can see no difference in the mug or its position, so it's a repeat as far as I can tell.
7. Picked back up. The corner box shows the mug, and it's in hand at the player's left with "E".

## Overall
- Each sheet starts with four panels that show the same carry state from four facing directions. Those aren't verbs.
- The mug has only drop and pick-up. Nothing in its panels shows drinking, giving, spilling or using it.
- Several envelope panels (6, 8, 9) look like repeats of earlier ones, so I can't see what they're meant to show.
- The only change to an object that I can see is envelope panels 10–11: a hold-meter, then torn scraps and a queasy face.
- The "E" prompt and the yellow ring appear in nearly every panel, whether the object is in hand or on the floor. So they don't tell me what pressing E would do at any moment.

### 2-judge: report.md

Verdict: fixable

- letter / carry: fits. Panel 1 shows the envelope held at your side, and the hand box shows ✉️.
- letter / pretend (standing): wrong. The engine says the letter goes to your ear like a phone. Panel 2 shows the envelope held up in plain view, ringed, with "E". The reader saw "carrying while facing up/away." Holding an envelope to your ear as a phone also makes no sense.
- letter / pretend (walking): wrong. The engine says you stride with a folder. Panel 3 shows the envelope, not a folder, still ringed and in view. The reader saw "carrying while facing left."
- letter / drop: fits. In panels 4–5 the hand empties and the envelope lies on the floor. Panel 6 repeats panel 5, but it is only the "before" state for picking up.
- letter / pick_up: fits. Panel 7 puts it back in your hand.
- letter / eat_letter: wrong. The 🤢 bubble in panel 11 says "ate it," but the picture shows torn white scraps at your feet, which says "tore it up." The reader read it as torn. Panel 10 holds the letter at your chest, never at your mouth. Panel 9's "lift" preview looks the same as carrying (panel 8). Eating a letter is also not something an office worker does.
- coffee / carry: fits. Panel 1.
- coffee / pretend (standing): wrong. Panel 2 shows a steaming mug in plain view, which doesn't read as a phone. The reader saw a plain carry.
- coffee / pretend (walking): wrong. Panel 3 shows the mug, not a folder. The reader saw a plain carry.
- coffee / drop: fits. In panel 5 the mug sits upright on the floor. That reads as setting it down, which is believable.
- coffee / pick_up: fits. Panel 7.

## Problems
- blocker: Pretend shows nothing. In letter and coffee panels 2–3, the item stays in plain view, ringed, in the carry pose, and no phone or folder appears. The reader took all four panels for carrying while facing different ways. A player will never learn that pretending hides what they carry, so they can't tell why the boss ignores them. — Draw the actual phone and folder props, hide the item (or show it tucked under the folder), and drop the ring and "E" while pretending.
- blocker: eat_letter's result shows tearing, not eating. Panel 11 leaves paper scraps on the floor next to a 🤢. The engine also sets `world.wad` to `undefined`, so it is unclear whether a wad should exist at all. A player will think the letter was torn up and left on the floor as evidence. — Either make it "tear/shred" with scraps and no 🤢, or show the letter going to the mouth in panel 10, leave nothing on the floor, and show a chewing bubble.
- blocker: Eating a contraband letter is not something a person does in a real office. — Replace it with an office way of getting rid of it: shredder, bin, or stuffing it in a drawer.
- should: Eating sits behind a 0.35 s hold of the same E that drops (panels 4, 8). A slightly long tap destroys the letter permanently, and nothing on screen tells drop and eat apart. — Show a different icon for the hold action next to the E prompt, or move it to a separate key or context.
- should: The coffee's only verbs are drop and pick up. The steam invites drinking, and nothing answers it. — Add a drink, or remove the steam so it reads as a plain prop.
- nit: Panel 9's "lift" preview can't be told from panel 8. — Raise the letter visibly while E is held.

<!-- /cold-read:verbs -->

<!-- cold-read:faces {"verdict":"fixable","date":"2026-11-15","commit":"e18dbc1","hash":"9ddf8c8815aaf01452beaec1aaa48aa99c607460b208bd5b1fcc9de68f4af6d2","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","checks":"514c50bee4edbda2123d40331d8248dba42a4db862158efe8704db46639c6454","faces":"7def5ce6dfdef30739c8d839a6ffe7313d954283a32b232f6e7f211d76579b64","prompts":"7b1353c6de0c5cf6c70013ea3cb8b0b9dfaae148125f1ffbe7155582b0b04938"},"model":"default","tally":{"clear":13,"vague":4,"misread":2},"problems":{"blocker":3,"should":3,"nit":1}} -->
## faces: fixable
Recorded 2026-11-15 at commit e18dbc1, by claude -p (model: default). Inputs 9ddf8c8815aa: the card, route-checks.js, the bubbles, the pass's prompts.
Items: 13 clear, 4 vague, 2 misread.
Problems: 3 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 45 s | $0.13 |
| 2-judge | report.md | 105 s | $0.41 |
| all | | 151 s (the steps add up to 151 s) | $0.54 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] 12's glyph can't be named, and it carries the cause behind the lights-off route (the boss's office is dark). — Use an unlit grey lightbulb, or a 💡 with a ✖, so the boss's thought means "why are my lights off?"
- E2 [blocker] 18's direction can't be read: does the player have the boss's document, or is someone to fetch one for him? The player only learns whether to run or hand something over if they read it right. — Make the arrow run from the player's face to a document to the boss's own face ("she brings me the paper"). If it's about a printout, use a printer glyph instead of a bare page.
- E3 [blocker] 05 shows panic with no object, so the player can't tie her shock to the coffee machine, which looks like the start of the power-cut route (14, 15). — Use a coffee cup with 💥 or ⚡, or put the fearful face after a smoking-machine glyph.
- E4 [should] 10 uses a lit bulb right after 12 tried to say "dark". The two halves of the lights route speak in two unrelated glyphs, and a lit bulb with an angry face also reads "angry idea". — Pair the same unlit bulb from 12 with the angry face, so the player sees "he's mad that someone turned off the lights."
- E5 [should] 17's pouring vessel suggests a spill, not a missing jug. — Show the upright jug (or the counter's own jug sprite) plus "?".
- E6 [should] 04's lone "?" has no object, so the player can't tell what puzzled the green-shirt coworker. — Add the thing he's looking for next to the "?", as 16 does with the envelope.

### 1-read: reading.md

# Bubble reading

1. **Thought: grey box with a diamond mesh top and a row of slots, plus a weary face.** I think it's a keyboard, but it could be a heater, an air vent or a printer. "This keyboard/machine is wearing me out," or "it's broken and I'm fed up."
2. **Thought: red alarm clock + weary face.** "Ugh, look at the time." Either they're running late or the day is dragging.
3. **Thought: steaming coffee cup.** "I want a coffee." It could also mean "coffee break" or "I'm going for coffee."
4. **Thought: a single red question mark.** "Huh? What's going on?" This person is confused or looking for something.
5. **Speech: blue-topped face, shocked and scared.** "Oh no!" They're horrified or panicking.
6. **Thought: weary face on its own.** "I'm so tired." It's general misery and doesn't say about what.
7. **Speech: envelope + angry face.** "This email/message makes me mad," or "I'm angry at you about the message."
8. **Speech: grimacing face, teeth showing.** "Yikes, awkward." Or a nervous "oops, sorry."
9. **Speech: weary face.** Said out loud this time: "Ugh, I'm exhausted," or a complaint. I can't tell how it differs from #6 except that they're saying it.
10. **Speech: lightbulb + angry face.** Either "the light is out/broken and I'm annoyed," or "someone stole my idea" / "I'm angry about that idea."
11. **Speech: party popper.** "Hooray, we're celebrating!" It could be someone's birthday, or "well done."
12. **Thought: dark navy ball with faint speckles + question mark.** I can't name the ball. It could be a bowling ball, a globe, the moon or a dark button. "Where's my ___?" or "what is this thing?"
13. **Alert (spiky yellow burst): red "!" + finger pointing right + a person with a brown hair bun and red top.** "Hey! It's HER/THAT person!" Either they're calling out the player or ratting someone out. I'm not sure who the person is: me or a coworker?
14. **Thought: wrench.** "I need to fix something," or "I need a tool or the repair person."
15. **Thought: sad, disappointed face.** "That's a letdown." They're quietly sad, which is milder than #6.
16. **Thought: envelope + question mark.** "Where's my letter/email?" or "Did my message arrive?"
17. **Thought: light-blue bucket or mug tipping over with water spilling + question mark.** "Who spilled this?" or "Where's the water / watering can?" It might be about a plant. It's ambiguous.
18. **Speech: grey document with folded corner + pointing finger + the bun-haired person in red.** "Give this paper to her," or "she has the document." It's a handoff instruction, but I can't tell which direction it goes.
19. **Speech: green, nauseated face.** "I feel sick." Something is gross, or they're ill.

**Overall:** #2, #6, #9 and #1 all use the same weary face, so I couldn't tell them apart except by what's paired with it. The ball in #12 and the bucket in #17 are the hardest glyphs to read. In #13 and #18 I don't know if the pointed-at person is me.

### 2-judge: report.md

I've checked each of the 19 bubbles in its frame. Here's the report:

Verdict: fixable
- 01: clear — the boss is at his desk, sick of his own keyboard. The glyph matches the keyboard sprite on his desk, so the frame makes it readable.
- 02: clear — the boss looks at the clock, worn out: "this afternoon is dragging."
- 03: clear — the coworker wants a coffee. Later frames show her at the coffee machine, which confirms it.
- 04: vague — the green-shirt coworker is confused, but the bubble doesn't say what about. Nothing near him explains the "?".
- 05: vague — at the coffee machine the coworker shouts "Oh no!" The fearful face shows panic but not its cause. Four minutes later the office has lost power (14) and the machine is smoking (06), but this bubble doesn't link her alarm to the machine.
- 06: clear — the boss is waiting at his desk, tired.
- 07: clear — the boss has read the letter in his tray and is furious.
- 08: clear — the player, caught near the boss at 3:40: "yikes."
- 09: clear — the player, beside the boss after 3:40: "ugh." It's said aloud where 06 is thought, but the context separates the two.
- 10: vague — the boss stands by the wall switch, angry, with the lights back on. With nothing dark left in the frame, a lit bulb reads as "idea" as easily as "lights".
- 11: clear — the player cheers at 3:40: the job is saved.
- 12: misread — the boss stands outside his darkened office. The navy ball is meant as "dark", but nobody can name it (moon, globe, bowling ball), so "what's that thing?" is the likelier read.
- 13: clear — "Hey! YOU!" The bun-haired face in the red top is plainly the player, who stands right there in the boss's red vision cone.
- 14: clear — a coworker in the dark office with a flashlight: "I'll go fix it."
- 15: clear — a coworker in the dark: let down.
- 16: clear — the green-shirt coworker sees the player at the boss's tray: "Where's the letter?"
- 17: vague — the jug on the counter is gone and the player has it. The tipping, pouring glyph reads "who spilled?" as much as "where's the jug?"
- 18: misread — the boss walks toward the player, who is in the kitchen. "Paper 👉 her" could mean "she has my paper", "take this paper to her" or "she's the one with the letter." Nobody is beside him to receive the order, so the direction can't be settled.
- 19: clear — the player says "I feel sick."

## Problems
- blocker: 12's glyph can't be named, and it carries the cause behind the lights-off route (the boss's office is dark). — Use an unlit grey lightbulb, or a 💡 with a ✖, so the boss's thought means "why are my lights off?"
- blocker: 18's direction can't be read: does the player have the boss's document, or is someone to fetch one for him? The player only learns whether to run or hand something over if they read it right. — Make the arrow run from the player's face to a document to the boss's own face ("she brings me the paper"). If it's about a printout, use a printer glyph instead of a bare page.
- blocker: 05 shows panic with no object, so the player can't tie her shock to the coffee machine, which looks like the start of the power-cut route (14, 15). — Use a coffee cup with 💥 or ⚡, or put the fearful face after a smoking-machine glyph.
- should: 10 uses a lit bulb right after 12 tried to say "dark". The two halves of the lights route speak in two unrelated glyphs, and a lit bulb with an angry face also reads "angry idea". — Pair the same unlit bulb from 12 with the angry face, so the player sees "he's mad that someone turned off the lights."
- should: 17's pouring vessel suggests a spill, not a missing jug. — Show the upright jug (or the counter's own jug sprite) plus "?".
- should: 04's lone "?" has no object, so the player can't tell what puzzled the green-shirt coworker. — Add the thing he's looking for next to the "?", as 16 does with the envelope.
- nit: 01's keyboard only reads because the same sprite sits on the boss's desk. Seen alone it looks like a heater. — Show the keyboard flatter and wider, with visible key rows.

<!-- /cold-read:faces -->

<!-- cold-read:tells {"verdict":"fixable","date":"2026-11-15","commit":"e18dbc1","hash":"c6a6152858c3842f86c9439c9224de6fbd6c18b53d2af63849dbf476f57061a5","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","checks":"514c50bee4edbda2123d40331d8248dba42a4db862158efe8704db46639c6454","tells":"0da467a7445289995505bab6083e8217fd7f7ea29e3543d039e00fd33d2d11fa","prompts":"f1d914aecdc56ea365960569f2587c9563e9f9a055deb88f13ba995eb473a219"},"model":"default","tally":{"visible":3,"faint":0,"invisible":2},"problems":{"blocker":3,"should":3,"nit":1}} -->
## tells: fixable
Recorded 2026-11-15 at commit e18dbc1, by claude -p (model: default). Inputs c6a6152858c3: the card, route-checks.js, the before and after pictures, the pass's prompts.
Items: 3 visible, 0 faint, 2 invisible.
Problems: 3 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 31 s | $0.12 |
| 2-judge | report.md | 50 s | $0.17 |
| all | | 81 s (the steps add up to 81 s) | $0.30 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 03, putting the letter in your own drawer looks like dropping it on top of someone else's desk. A paper sprite appears on the desktop, and nothing marks the desk as the player's. The reader thought the letter had been abandoned. They could not tell this is the hiding place that wins the route. — Show a drawer slide open, the envelope drop in and the drawer shut, with nothing left on top. Give the player's desk an object in the player's red, such as a mug or framed photo, so it reads as "mine" before you use it.
- E2 [blocker] In 03, the coworker's "!" turns into a bigger "?" at the moment the letter is hidden. That reads as "they saw me do it", so a winning move looks like a caught one. — If the coworker didn't see, drop the bubble or have them look away. If they did, have them turn their head toward the desk so the cause is clear.
- E3 [blocker] In 04, rigging the coffee machine reads as brewing coffee. The jug barely changes from blue to pale, and the blue sparkle looks like steam or "fresh coffee". Nothing suggests water got where it shouldn't. Later in this route the machine shorts out at 3:10, and a player who thinks they made coffee won't connect that to what they did. — Animate the jug tipping into the back of the machine. Leave a puddle or drip under it, plus a small flickering yellow spark that keeps going until 3:10.
- E4 [should] In 04, the boss's alarm-clock bubble and the teal coworker turning their view cone both happen on the same frame as the rig. The reader couldn't tell whether those were reactions or just timing, so the cause is murky. — Push unrelated schedule beats a few seconds away from the player's action. If the coworker is reacting to a sound, have them look toward the kitchen, not the opposite way.
- E5 [should] The office light switch (used in 01) and the fuse box (used in 05) look alike until you use them, and the darkness and the boss's "!" afterwards look the same too. The reader said they couldn't tell the two wall objects apart beforehand. The two routes depend on knowing which is which. — Draw the light switch as a small wall plate with a toggle and the breaker as a larger grey cabinet with a lever and a warning stripe. Give the boss a different reaction to each, such as glancing at the hallway panel versus looking up at the ceiling lights.
- E6 [should] In 02, the letter can't be seen in the tray because the office is dark, so the only sign of the theft is the HUD hand box. — Make the envelope glow faintly in the dark tray, or catch it in light from the corridor, and show it leave the tray when taken.

### 1-read: reading.md

**reading.md**

**01:** The boss's office (top left) goes dark. Before, the boss was sitting with a thought bubble showing a keyboard and an annoyed face. After, they stand in the dark holding a flashlight, with a small "!" bubble. Every other room stays lit. The player's hand box is empty both times, and they haven't moved from the small panel on the corridor wall. **What they did:** used a light switch that turned off only the boss's office.

**02:** The hand box goes from empty to an envelope. In BEFORE the player is in the dark boss office with the desk highlighted. In AFTER they stand slightly to the right of it, and a new E prompt sits on a round object beside them. Outside, the boss has left the office and is now in the corridor next to a coworker. **What they did:** took an envelope from the boss's desk while the boss was away.

**03:** The hand box goes from the envelope to empty, and a small paper appears on the middle desk next to the player. The coworker at the right desk had a small "!" bubble before. After, it's a bigger "?" bubble. **What they did:** left the envelope on that desk, and the nearby coworker noticed and is confused.

**04:** The coffee machine changes: before it's highlighted with a dark mug, after there's a white cup and a little blue sparkle, which I take to mean coffee is brewing. In the same moment the boss gets a thought bubble with an alarm clock and an annoyed face. The teal coworker on the left gets motion lines, and their view cone flips to point left and turns green. The hand box stays empty. **What they did:** turned on the coffee machine. I can't tell whether the boss and coworker are reacting to it or it's just timing. The alarm-clock bubble doesn't clearly connect to coffee.

**05:** Almost the whole office goes dark. Only a strip of floor at the bottom left and one doorway stay lit. The boss and the right-hand coworker now hold flashlights, with a "!" and a squiggly or arrow bubble. The wall box changes to a different icon, which looks like a switch thrown. The hand box stays empty and the player stays by the box. **What they did:** flipped the main breaker and cut the power to the whole floor.

**Skeptical note:** 01 and 05 look alike: same darkness, same flashlight cones, same "!" on the boss. The only clue to which wall object darkens one room and which darkens the whole floor is how far the dark spreads after you use it. Before using them, I couldn't tell the two wall objects apart.

### 2-judge: report.md

Verdict: fixable

- tells/01.png: visible. The player flipped the boss's office light switch at the hallway panel. The reader saw that only the boss's office went dark and that the boss picked up a flashlight. That is correct.
- tells/02.png: visible. The player took the letter from the boss's desk tray. The reader saw the envelope appear in the hand box while the boss was out in the corridor. That is correct, though the hand box is the only thing showing it, because the dark office hides the tray.
- tells/03.png: invisible. The player put the letter in the drawer of their own desk, which is the winning step. The reader thought the envelope was left on top of some coworker's desk and that the coworker noticed it and got confused. They missed both "drawer" and "own desk".
- tells/04.png: invisible. The player poured the jug into the coffee machine's back vent to rig it to short out later. The reader thought the player "turned on the coffee machine" to brew coffee. The sabotage reads as normal use.
- tells/05.png: visible. The player pulled the main breaker. The reader saw that the whole floor went dark and the fuse box icon changed. That is correct.

## Problems
- blocker: In 03, putting the letter in your own drawer looks like dropping it on top of someone else's desk. A paper sprite appears on the desktop, and nothing marks the desk as the player's. The reader thought the letter had been abandoned. They could not tell this is the hiding place that wins the route. — Show a drawer slide open, the envelope drop in and the drawer shut, with nothing left on top. Give the player's desk an object in the player's red, such as a mug or framed photo, so it reads as "mine" before you use it.
- blocker: In 03, the coworker's "!" turns into a bigger "?" at the moment the letter is hidden. That reads as "they saw me do it", so a winning move looks like a caught one. — If the coworker didn't see, drop the bubble or have them look away. If they did, have them turn their head toward the desk so the cause is clear.
- blocker: In 04, rigging the coffee machine reads as brewing coffee. The jug barely changes from blue to pale, and the blue sparkle looks like steam or "fresh coffee". Nothing suggests water got where it shouldn't. Later in this route the machine shorts out at 3:10, and a player who thinks they made coffee won't connect that to what they did. — Animate the jug tipping into the back of the machine. Leave a puddle or drip under it, plus a small flickering yellow spark that keeps going until 3:10.
- should: In 04, the boss's alarm-clock bubble and the teal coworker turning their view cone both happen on the same frame as the rig. The reader couldn't tell whether those were reactions or just timing, so the cause is murky. — Push unrelated schedule beats a few seconds away from the player's action. If the coworker is reacting to a sound, have them look toward the kitchen, not the opposite way.
- should: The office light switch (used in 01) and the fuse box (used in 05) look alike until you use them, and the darkness and the boss's "!" afterwards look the same too. The reader said they couldn't tell the two wall objects apart beforehand. The two routes depend on knowing which is which. — Draw the light switch as a small wall plate with a toggle and the breaker as a larger grey cabinet with a lever and a warning stripe. Give the boss a different reaction to each, such as glancing at the hallway panel versus looking up at the ceiling lights.
- should: In 02, the letter can't be seen in the tray because the office is dark, so the only sign of the theft is the HUD hand box. — Make the envelope glow faintly in the dark tray, or catch it in light from the corridor, and show it leave the tray when taken.
- nit: In 05, a strip of floor at the bottom left stays lit for no reason anyone can see. — Make it read as emergency lighting with a green exit glow, or darken it too.

<!-- /cold-read:tells -->

<!-- cold-read:outcomes {"verdict":"fixable","date":"2026-11-15","commit":"e18dbc1","hash":"6a2d9304107d55c0b2845083b25b8e4ec7cc05dc7cf1a4cfd541e0fa3ad58bb4","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","checks":"514c50bee4edbda2123d40331d8248dba42a4db862158efe8704db46639c6454","ways":"9dcc68539837651a4cf2ff481ca2b885938e6d789ad93dcd4d6f13faa9b39f9c","ends":"7173db4afbd6fcc6dbacda637dc3cdeeb9bc6e4cd8c1833f574b277665f23020","prompts":"2c4a72c45c8e3d7e595f0928af4c2741d3a3e144356d832e05fe3e1263e3a558"},"model":"default","tally":{"clear":8,"unclear":1,"wrong":3},"problems":{"blocker":3,"should":3,"nit":1}} -->
## outcomes: fixable
Recorded 2026-11-15 at commit e18dbc1, by claude -p (model: default). Inputs 6a2d9304107d: the card, route-checks.js, premise.md's ways to win and lose, the runs' last frames, the pass's prompts.
Items: 8 clear, 1 unclear, 3 wrong.
Problems: 3 blocker, 3 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 140 s | $0.60 |
| 2-judge | report.md | 103 s | $0.42 |
| all | | 243 s (the steps add up to 243 s) | $1.01 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In Run 8, the end card shows Lin's report at 3:09 instead of the loss that actually happened at 3:40, when the boss read the letter. It contradicts the frame before it, and the player can't tell what ended the day. — Use the standard "boss holds the letter up, 📦" fail card, and add a small inset of Lin pointing (❗👉) as the step that broke.
- E2 [blocker] In Run 7, the person who catches her on the map looks like Kev (beard, olive top, his desk empty), but the card shows the boss. A player would think Kev reports you. — Make sure the boss's own sprite (bald, navy suit) is the one walking back through the doorway. If Kev is the one actually walking there, fix that behaviour so Kev doesn't do the catching.
- E3 [blocker] In Run 5, the card draws her at a desk in front of the kitchen counter while she's at her own desk in the open-plan room. The player would think the win depended on being in the kitchen, which mixes up Run 5 with Run 6's end-in-the-kitchen win. — Draw the scene where she really is at 3:40 (her own desk), and put the burnt coffee machine in the icon row or a small inset.
- E4 [should] In Run 11, the eaten-letter card shows her green but no spat-out wad, so it reads as swallowing. On the map, the grey lump isn't recognisable as chewed paper. — Draw the grey wad at her feet on the card, and give the wad on the map a visible wet, crumpled-paper look (drips, a scrap of envelope corner).
- E5 [should] The route badge (⚡) sits next to an eating story in Run 11, so it reads as part of what happened. — Separate the badge from the story, or show both icons, ⚡ for the breaker and 🤢 for eating, as two steps.
- E6 [should] In Run 4, the card doesn't show that she lingered at the panel after he left his office. The reader took the cause to be "flipped it in front of him". — Add his dark glass office in the background of the card and a footprint trail from his door to the panel.

### 1-read: reading.md

# Reading: how each loop ended (Second Thoughts)

Two colours of end card come up again and again. A **red** frame shows a loss and a **teal** frame shows a win. In several runs the caption clock (3:41, 3:42) is ahead of the HUD clock, which still reads 3:40. I went by the pictures.

### Run 01
- **Outcome: something else. You get fired.** At 3:40 the bald boss in the navy suit has a "✉️😠" bubble. The player walks up to his desk looking upset. The card shows him angrily holding up the envelope, followed by the icons boss, ✉️, 😠, 📦 (packing up your desk).
- **Match:** Yes.
- **What broke:** The letter never left the tray. She is at her own desk at 3:40 and only gets to his desk after he has opened it. I can't see an earlier plan.

### Run 02
Every picture is identical to Run 01: fired, and the end card matches. Nothing shows a plan being tried.

### Run 03
- **Outcome: win.** Teal card. The boss shows "?" next to an empty tray. The player sits at her desk with the envelope in front of her. In the last moment before the card she has a 🎉 bubble and a lightbulb badge lights up.
- **Match:** Mostly. A lightbulb badge suggests something was done to the lights, and I don't see that happen. I also can't tell from the map whether the envelope is on her desk.

### Run 04
- **Outcome: caught.** The boss's office is dark. The player is at a small wall switch in the corridor, with an "E" prompt showing. The boss is right beside her with a red sight cone, a "🌑?" thought bubble, and then "!👉(her face)".
- **Match:** Yes. The card shows a wall switch and the boss pointing at her.
- **What broke:** She turned his office light off while he was standing next to her.

### Run 05
- **Outcome: win.** Teal card, with the boss showing "?". The coffee machine in the kitchen is smoking black, a coffee-cup badge lights up, and she has a 🎉 bubble at her desk.
- **Match:** Only partly. The card puts her at a desk in front of the kitchen counter, but she is at her own desk in the open-plan room. The card's icons (the woman in glasses, ☕, ⚡, ✉️) point to a coffee-machine short. I never see the woman in glasses leave her desk, and the item slot is empty, so I can't confirm that the player has the letter.

### Run 06
- **Outcome: win.** Teal card. The envelope is in the held-item slot and she is at a desk in the kitchen next to the broken coffee machine (🎉). The card shows her holding the envelope, with the boss showing "?".
- **Match:** Yes, the clearest match of all the wins.

### Run 07
- **Outcome: caught at 3:25.** Holding the envelope, she takes it at the boss's desk ("E"). A figure at the office doorway with a red cone and a "✉️?" bubble then points "!👉" at her.
- **Match:** Doubtful. That figure looks like the bearded coworker in the olive top, whose desk is empty. The card shows the bald boss catching her instead.
- **What broke:** Taking the letter from the tray while someone was in the doorway.

### Run 08
- **Outcome: loss of some unclear kind.** Red card.
- **Match: No.** Every in-game picture is identical to Runs 01 and 02 (the boss reads the letter and gets angry). The card shows something else entirely: the woman in glasses pointing at the player, who is buried behind stacks of paper (icons: woman, 👉, papers). I can't explain how one leads to the other.

### Run 09
- **Outcome: win.** Teal card, 🎉, and a ⚡ badge.
- **Match:** I can't confirm it. The card shows the fuse box, the bearded coworker and a 🔧, but the moments before it show no outage, no fuse box and no repair. The bearded coworker stays at his desk the whole time.

### Run 10
- **Outcome: caught at 3:07.** The whole office is dark. The player is at a fuse box on the left wall that is glowing red. The boss, holding a flashlight, has a "🌑?" bubble and then catches her in his light ("!👉").
- **Match:** Yes. The card shows the fuse box, the flashlight beam and the boss.
- **What broke:** She cut the power while the boss was a few steps away, so his flashlight found her.

### Run 11
- **Outcome: win.** Teal card, 🎉. The card shows her green-faced, with the icons ✉️, 🤢, boss, "?", so she seems to have eaten the letter.
- **Match:** Weak. On the map she isn't green. There is a grey lump next to her at an unfamiliar desk that I can't identify. The badge is ⚡, as in Run 09, but nothing in this card's story involves electricity.

### Run 12
- **Outcome: caught at 3:03.** She reaches into the tray while the boss sits at that same desk. He thinks "✉️?", his red cone covers her, and he points "!👉".
- **Match:** Yes. The card shows her grabbing the envelope from the tray right in front of him.
- **What broke:** The very first step. She went for the letter with the boss at his desk.

### 2-judge: report.md

Verdict: fixable

- Run 1: clear. She did nothing. At 3:40 the boss reads the letter in a rage, and the 📦 card shows exactly that.
- Run 2: clear. She did nothing past the 3:11 flicker and lost the same way. The reader saw the same frames and card as Run 1, which is right.
- Run 3: clear. A switch-route win. She's at her desk with 🎉 and the boss is puzzled. The card shows the envelope on her desk and a 💡 badge. The reader saw a win, though they wondered why the badge was about lights.
- Run 4: clear. She flipped the switch and stayed at the panel, so the boss came out and found her there. The reader saw "caught at the panel", but thought she flipped it while he stood beside her.
- Run 5: wrong. A blackout win with her at her own desk. The card puts her at a desk in front of the kitchen counter, which contradicts the frame right before it.
- Run 6: clear. A blackout win spent in the kitchen. The card and the map agree.
- Run 7: wrong. The boss walked back and caught her in his office holding the letter. On the map, the figure in the doorway with the red cone has a beard and an olive top, and Kev's desk is empty, so it reads as Kev. The card shows the bald boss.
- Run 8: wrong. Lin caught her pouring the jug, she was sent to desk work, and at 3:40 the boss read the letter. The frames before the card show the angry boss with the letter. The card shows Lin pointing at her behind piles of paper, which is a 3:09 cause shown with a 3:40 time. The reader couldn't connect the two.
- Run 9: clear. A breaker win. She's at her desk with 🎉, and the card shows the fuse box, Kev and 🔧 with a ⚡ badge. Nothing in the last frames contradicts it. The reader just hadn't seen the earlier steps.
- Run 10: clear. She pulled the breaker and waited at the box, and his torch found her there.
- Run 11: unclear. A breaker win, then she chewed the letter up and spat it out. The card shows her green with 🤢, which reads as swallowing it. The grey wad of chewed paper at her feet on the map goes unrecognised, and the ⚡ badge looks out of place next to a story about eating.
- Run 12: clear. She grabbed it right in front of the boss and he caught her.

## Problems
- blocker: In Run 8, the end card shows Lin's report at 3:09 instead of the loss that actually happened at 3:40, when the boss read the letter. It contradicts the frame before it, and the player can't tell what ended the day. — Use the standard "boss holds the letter up, 📦" fail card, and add a small inset of Lin pointing (❗👉) as the step that broke.
- blocker: In Run 7, the person who catches her on the map looks like Kev (beard, olive top, his desk empty), but the card shows the boss. A player would think Kev reports you. — Make sure the boss's own sprite (bald, navy suit) is the one walking back through the doorway. If Kev is the one actually walking there, fix that behaviour so Kev doesn't do the catching.
- blocker: In Run 5, the card draws her at a desk in front of the kitchen counter while she's at her own desk in the open-plan room. The player would think the win depended on being in the kitchen, which mixes up Run 5 with Run 6's end-in-the-kitchen win. — Draw the scene where she really is at 3:40 (her own desk), and put the burnt coffee machine in the icon row or a small inset.
- should: In Run 11, the eaten-letter card shows her green but no spat-out wad, so it reads as swallowing. On the map, the grey lump isn't recognisable as chewed paper. — Draw the grey wad at her feet on the card, and give the wad on the map a visible wet, crumpled-paper look (drips, a scrap of envelope corner).
- should: The route badge (⚡) sits next to an eating story in Run 11, so it reads as part of what happened. — Separate the badge from the story, or show both icons, ⚡ for the breaker and 🤢 for eating, as two steps.
- should: In Run 4, the card doesn't show that she lingered at the panel after he left his office. The reader took the cause to be "flipped it in front of him". — Add his dark glass office in the background of the card and a footprint trail from his door to the panel.
- nit: The card's clock says 3:40 while the caption says 3:41 (Run 1 and others). That's harmless, but the reader noticed it. — Stop the HUD clock and the card's clock at the same minute.

<!-- /cold-read:outcomes -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"e18dbc1","hash":"29ce530e4dd62d61d5a8516e8169b9d5c69bc7e2b177575a5600cbcf9f159206","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","shots":"17045e69253ef9ef788535955e871220d29fc14ef52244d16426d6ace8f4df9e","pictures":"1cd3058c6cc030113980ff9f9ffbd987ccaf5365cf82933309acb86763c1d7b5","prompts":"373358f2a720c528dbf043178a7e12d5e465c477911cb7d1ae56f78e1d3c10a4"},"model":"default","problems":{"blocker":3,"should":11,"nit":4}} -->
## pictures: fixable
Recorded 2026-11-15 at commit e18dbc1, by claude -p (model: default). Inputs 29ce530e4dd6: the card, shots.js, the rendered shots, the pass's prompts.
Problems: 3 blocker, 11 should, 4 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 125 s | $0.69 |
| 2-compare | report.md | 181 s | $0.62 |
| all | | 306 s (the steps add up to 306 s) | $1.32 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The light-switch route contradicts its own win. At 3:08 (14) and 3:09 (15) the boss shows ✉️❗ with a rising bar, aims an orange cone at the player and searches the meeting room. He knows the letter is gone without ever going back to his desk. Then at 3:40 (28) he picks up the empty tray, baffled. A player would think the theft was spotted. — Keep the boss's bubble to 💡 or 😤 until he gets back to his desk. Nothing about the letter should show before 3:40.
- E2 [blocker] Shots 14 and 15 never show the stash. The player isn't at their desk, no drawer is drawn and the envelope just vanishes from the hand slot. "Hide it at your desk" is the step that finishes every route. — Re-shoot with the player seated at the middle desk: an open drawer with the envelope going in, then a shut drawer with a corner showing.
- E3 [blocker] The coffee-route setup doesn't read. The jug, the pour and the puddle are invisible in 18 and turn into "something red and white" in 19, so the reader infers "overload" rather than "soak". A player wouldn't know to pick up the jug. — Draw the jug tipped and empty, a big blue puddle and a 💧 over the machine. In 19, show a clear water arc from the jug.
- E4 [should] The boss's bubble in 03 shows a keyboard, which says he's working, and the 😩 shows up in 03, 05, 06 and 32 for different reasons. "Dreads the tray" never lands. — Bubble ✉️😩 in 03 and save the 😩 for the tray.
- E5 [should] In 04 the boss drums his fingers, but the shot is identical to 01. — Animate the drumming with tap ticks.
- E6 [should] In 05 the boss only thinks of the clock. The reach, the glint and the hands aren't drawn. — Have him pick up the real desk clock.
- E7 [should] The flicker in 17 reads as a grey mood. This is the shot that teaches "the machine strains the power." — Add a spark at the plug and flicker the ceiling lamps.
- E8 [should] Phone-torch cones in 10, 21 and 22 are as long as daylight cones, so the lesson "the dark shrinks sight" comes out as "the dark changes sight". The reader couldn't say what the torch in 10 even was. — Make torch cones about a third of normal length, and show the phone in his hand.
- E9 [should] The spit-out wad in 27 is unreadable, and the chewing is never shown. That buries the funniest ending. — Show a chewing beat and draw the wad as soggy paper.
- E10 [should] The deskwork loss in 32 shows neither the boss nor the letter, so its cost is unclear. — Add the boss waving the letter and end the strip ✉️😠📦.
- E11 [should] In 33 the ⚡ slot on the eaten win reads as a bug. — Give the slot a 🤢 badge, or lead the strip with the route icon.
- E12 [should] In 30 the strip shows Kev with 🔧, the man who undoes the blackout, on a win. — Swap in ⚡ 🔦boss 🚶 ✉️ (blackout, boss leaves, letter taken), or drop Kev.
- E13 [should] In 36 the cup gets an E prompt and fills the hand slot but has no purpose, so it reads as a plan. — Make it a dead-end sip with no prompt, or give it a visible use.
- E14 [should] The lighting panel (07) is a single blank plate that only reads after it's used. — Draw several toggles with a 💡 above them.

### 1-read: reading.md

# Second Thoughts: a cold read

**Card:** It's 3:00. The player's angry resignation letter is in the boss's tray, and he reads his tray at 3:40. The goal is to keep the job. The card's last icon is a 📦, which gives away the losing ending before the first loop starts.

**01 (3:00).** The player, in red, sits at the middle desk. A bald boss sits in a top-left office behind a desk that holds a tray with an envelope and a small gold alarm clock. Two coworkers sit at desks with vision cones: one in teal with a dark bun, one in green with spiky hair. Across the top are a clock, a clock+envelope+face icon, an empty hand slot, a "1" loop counter and three empty slots. I can't read the grey box with a green light and a yellow sign on the left wall, the small white plate on the corridor wall, or the coloured strips on the walls.

**02 (3:02).** The player stands right beside the boss's desk with an E prompt on the tray. The boss has a red "?" and a half-filled vertical bar, and his cone has turned orange. Walking up and grabbing the letter while he watches gets noticed.

**03 (3:01).** The boss's thought bubble shows a keyboard and a weary face. I read it as "bored of typing," which hints that he might get up. That's a guess.

**04 (3:03).** This is almost the same as 01 and adds nothing new.

**05 (3:05).** The boss thinks of an alarm clock and the weary face. The coworkers now have small motion lines and wider cones. The alarm clock seems to be his 3:40 reminder, but the bubble doesn't say whether he dreads it or is waiting for it.

**06 (3:39).** The clock is red. The alarm clock is shaking, the coffee machine in the kitchen is steaming, and the teal coworker has a cup at her desk. This is the moment of reckoning, and nothing has been stopped.

**07 (3:01).** The player is at the small white plate on the corridor wall with an E prompt. From what follows, it's a light switch.

**08 (3:03).** The player is at the grey left-wall box with an E prompt. It looks like an electrical panel.

**09 (3:05).** The teal coworker leaves her desk thinking ☕. The boss has motion lines. Her cone now sweeps the corridor. She has a coffee routine.

**10 (3:01).** The boss's office is dark and the player is at the switch. The boss has a "?" and a small light cone that I can't explain: a desk lamp or a torch. So the dark only partly works.

**11 (3:05).** The boss has walked out of the dark office toward the big meeting table. The office is empty.

**12 (3:07).** The boss is in the corridor at the switch, so he's going to fix it. The office is still dark. The player waits at the far left.

**13 (3:07).** The player is in the dark office at the tray, and the envelope appears in the hand slot. That's the theft.

**14 (3:08).** The lights are back on. The boss's bubble shows an envelope and "!", his bar is rising and his cone is orange. The player's hand slot is empty, and I can't tell what they did with the letter. He seems to know it's gone, which is confusing: how does he know from the corridor?

**15 (3:09).** The boss searches around the meeting table with the same bubble. Taking the letter clearly isn't the end of it.

**16 (3:05).** The office is dark and the boss, in the corridor, has a starburst with "! 👉 red-hair face" and a red cone. The player is caught, and the meaning is clear.

**17 (3:10).** The whole floor turns grey. The teal coworker at the coffee machine looks scared, the green coworker has a "?" and the boss has motion lines. I can't read what the grey tint means: a power dip, or just a mood?

**18 (3:08).** The player is at the coffee machine. The teal coworker walks the corridor below the switch plate.

**19 (3:09).** Something red and white is stuck in the coffee machine. The teal coworker, at the kitchen door, has a starburst "! 👉 player" and catches the player tampering. That starburst is too small to read in the moment.

**20 (3:10).** The coffee machine gives off black smoke, and a yellow spark runs along the corridor wall. The player is back at their own desk with an E prompt on the keyboard. Overloading the machine leads to a short circuit. That's good cause and effect.

**21 (3:11).** Blackout. The wall panel blinks red. Everyone has a "?" or a scared face, and the boss's small light cone is back. An alibi at your own desk is implied.

**22 (3:13).** Everyone carries a torch with a narrow bright cone. The boss and the green coworker head out. "The dark shrinks sight" works here as a lesson, but the torch cones are huge, so it really reads as "the dark changes sight."

**23 (3:18).** The boss is at the panel with his torch, and the player takes the envelope in the dark office.

**24 (3:04).** The player is at the red panel, so they tripped it directly. The green coworker thinks of a 🔧. The teal coworker has a torch.

**25 (3:10).** The player is at the tray with an E prompt. The boss and the green coworker are at the panel and the teal coworker has a "?". Same plan as 23.

**26 (3:07).** At the panel, the boss's starburst points at the player. Caught at the box.

**27 (3:17).** The lights are on. The player is near a desk with a green, sick face in their bubble and a small grey puff beside them. I can't read the puff. Did they eat something?

**28 (end, teal border).** The boss holds up an empty tray with a "?". The player sits at their desk with the envelope tucked in the desk. The icons are 💡, the boss, ?, ✉️, and the first of three slots fills with a bulb. It's a win: the light-switch route.

**29 (end).** The same scene in front of the coffee machine. The icons are the teal coworker, ☕, ⚡, ✉️, and the second slot fills with a cup. It's a win: the coffee-overload route.

**30 (end).** The same scene in front of the wall panel. The icons are ⚡, the green coworker, 🔧, ✉️, and the third slot fills with lightning. It's a win: the panel route. But the 🔧 coworker is the one who fixes the panel, so why is he in a win strip?

**31 (end, red border).** The boss waves the open letter at the player in rage. The icons are the boss, ✉️, 😠, 📦. Fired, and it's clear.

**32 (end, red).** The teal coworker points at the player, who is buried behind a tower of paper. The icons are the teal coworker, 👉, 📄. Is this a punishment, overtime, or being fired? It's the only loss that doesn't end in 📦, so I can't tell what it costs.

**33 (end, teal).** The player is green and nauseous at their desk, the boss has a "?", and the icons are ✉️, 🤢, boss, ?. My guess is that they ate the letter, which is the funniest ending here. But the third slot shows the lightning icon from 30 again. Either eating is filed under the panel route or the slot is a bug. Either way, it hides the best gag.

**34 (end, red, 3:03).** The boss, at his desk, points at the player, who is reaching for the tray. A direct grab while he watches.

**35 (end, red, 3:05).** The boss, by the wall switch, points at the player. Caught at the light switch.

**36 (3:23).** In the kitchen, the player holds a coffee cup and has an E prompt next to the teal coworker at the steaming machine. Carrying a cup is its own plan, but I can't tell what it's for.

**Editor's notes:** The weary-face bubble shows up three times with three different causes, which waters it down. The vertical "?" bar is never explained. From the corridor, the boss's "envelope!" (14) reads like he can see through walls.

---

**The story:** You quit in a rage at 3:00 and regretted it by 3:01. Now you have to get your own letter back out of the boss's tray before his alarm rings at 3:40. You can't just walk in and take it. You have to empty his office: kill his lights, trip the breaker, or overload the coffee machine until the power goes out, then take the letter in the dark and be back at your desk looking innocent. Get caught and you're packing a box. Get away with it and he stares at an empty tray. The best ending, eating the evidence, is the one these pictures explain least.

### 2-compare: report.md

Verdict: fixable

## Shots

- **01**: reads. The opening scene, the tray, the envelope and 3:00 all come across. The switch plate and the fuse box don't read yet, but 07 and 08 teach them.
- **02**: reads.
- **03**: misread.
  - Reading: "I read it as 'bored of typing,' which hints that he might get up."
  - Intent: he does no work at all. He stares at the tray and dreads it.
  - Cause: a glyph used as a prop. The bubble shows a ⌨️ next to the 😩, which says "work" when it should say "the tray". The shrug isn't drawn either.
  - Fix: put ✉️/🗂️ + 😩 in the bubble instead of the keyboard, and add a two-frame shoulder shrug.
- **04**: misread.
  - Reading: "This is almost the same as 01 and adds nothing new."
  - Intent: he drums his fingers, eyes on the tray.
  - Cause: a missing cue. I checked the image and it matches 01 pixel for pixel near the boss. No hand moves and there's no tapping mark.
  - Fix: animate his hand bouncing on the desktop, with small tap ticks beside it and a 🥁 or "…" bubble.
- **05**: partly.
  - Reading: "the bubble doesn't say whether he dreads it or is waiting for it."
  - Intent: he reaches for the brass clock and checks it. Its face glints and its hands are just past 3:00.
  - Cause: an emoji standing in for an action. He only *thinks* ⏰😩 and never touches the clock on his desk.
  - Fix: drop the bubble. Draw his arm out to the real desk clock, a glint on its face and its hands at about 3:05.
- **06**: reads. The alarm, 3:39 and the letter still in the tray all come across. The tray-drag isn't visible, which is a nit.
- **07**: partly.
  - Reading: "a small white plate… From what follows, it's a light switch."
  - Intent: a lighting panel of switches, out of the boss's sight.
  - Cause: a missing cue. A single blank plate can't be told apart from a sign until it gets used.
  - Fix: draw it as a panel with 3–4 toggles and a tiny 💡 above it.
- **08**: reads.
- **09**: reads.
- **10**: reads. Only his office goes dark. The reader can't explain his small light cone, which I cover under Problems.
- **11**: partly.
  - Reading: "walked out of the dark office toward the big meeting table."
  - Intent: he's heading to the lighting panel, leaving the tray unattended.
  - Cause: a missing cue. His destination isn't shown, and his path runs through the meeting room.
  - Fix: give him a 💡❓ bubble as he leaves, and send him along the wall by the panel instead of across the table.
- **12**: reads.
- **13**: reads.
- **14**: misread.
  - Reading: "I can't tell what they did with the letter. He seems to know it's gone… how does he know from the corridor?"
  - Intent: you're back at your own desk sliding the envelope into an open drawer.
  - Cause: a missing cue, plus an action no real boss would take. The player stands between desks, not at their own desk. No drawer is drawn, and the envelope just disappears from the hand slot. Meanwhile the boss, still at the switch, shows ✉️❗ and an orange cone on the player.
  - Fix: put the player seated at the middle desk with an open drawer and the envelope half in. Keep the boss's bubble to 💡/😤 until he is back at his tray.
- **15**: misread.
  - Reading: "The boss searches around the meeting table with the same bubble."
  - Intent: the drawer is shut with a corner of the envelope showing, and your hands are empty.
  - Cause: a missing cue. There's no drawer and no corner. The player is still standing in the open, and the boss keeps searching for the letter.
  - Fix: show a closed drawer with a white corner sticking out at the player's desk. The boss should walk back to his desk unaware.
- **16**: reads.
- **17**: partly.
  - Reading: "I can't read what the grey tint means: a power dip, or just a mood?"
  - Intent: switching on the old coffee machine makes the lights flicker.
  - Cause: cause and effect too far apart. A flat grey tint across the floor doesn't tie back to the machine in the corner.
  - Fix: add a ⚡ pop at the machine's plug, flicker the ceiling lamps on and off, and draw a brief pulse along the wall wiring.
- **18**: misread.
  - Reading: "The player is at the coffee machine. The teal coworker walks the corridor."
  - Intent: you poured the water jug into the machine's back vent. The jug is empty and a puddle is dripping.
  - Cause: a missing cue. The jug looks the same as in 01, and the puddle is a few pixels, if it's there at all.
  - Fix: tip the jug on its side next to the machine with a clear blue puddle and drips under the counter. Add a 💧 over the machine.
- **19**: partly.
  - Reading: "Something red and white is stuck in the coffee machine… That starburst is too small to read."
  - Intent: Lin walks in on you tipping the jug into her machine and calls you out.
  - Cause: a glyph used as a prop. The jug-in-machine pose reads as a red-and-white object, and the ❗👉 starburst is tiny.
  - Fix: draw a big tilted jug in the player's hands with a water arc into the machine, and make the starburst twice as large.
- **20**: reads. The reader takes it as "overloading", not soaking. That comes from 18 and is covered there.
- **21**: reads.
- **22**: reads.
- **23**: reads.
- **24**: reads.
- **25**: reads.
- **26**: reads.
- **27**: partly.
  - Reading: "a small grey puff beside them. I can't read the puff. Did they eat something?"
  - Intent: you chewed up the letter and spat it out as a soggy wad.
  - Cause: cause and effect too far apart, and a missing cue. Nothing shows the letter going into the mouth, and the wad looks like a rock or a puff of smoke.
  - Fix: show a chewing beat with the envelope at the mouth. Draw the wad as crumpled white-grey paper with a wet sheen and a torn stamp corner.
- **28**: reads.
- **29**: reads.
- **30**: reads. The 🔧 coworker in the win strip is covered under Problems.
- **31**: reads.
- **32**: partly.
  - Reading: "Is this a punishment, overtime, or being fired?… I can't tell what it costs."
  - Intent: the boss read your letter and is furious, and the paperwork is what Lin's report got you.
  - Cause: a missing cue. The boss and the letter don't appear anywhere on the card.
  - Fix: put the boss in the scene waving the open letter, and end the icon strip with ✉️😠📦 after Lin 👉.
- **33**: partly.
  - Reading: "the third slot shows the lightning icon from 30 again… Either eating is filed under the panel route or the slot is a bug."
  - Intent: a win where the letter was chewed up and spat out, with the boss baffled.
  - Cause: a missing cue. The slot tracks the *route* (breaker), but nothing ties 🤢 to that route.
  - Fix: show the slot as ⚡ with a small 🤢 badge, or add ⚡ in front of the strip so it reads ⚡ ✉️ 🤢 boss ?.
- **34**: reads.
- **35**: reads.
- **36**: partly.
  - Reading: "Carrying a cup is its own plan, but I can't tell what it's for."
  - Intent: nobody soaked the machine, so it brewed normally and you poured a cup.
  - Cause: a missing cue. A filled hand slot plus an E prompt promises a use.
  - Fix: if the cup has no use, give the player a 😌 sip animation and let it end the interaction, with no E prompt and no hand-slot item.

None of the shots is a wrong moment. Every intent describes what should be visible at the time the engine landed.

## Problems

- blocker: The light-switch route contradicts its own win. At 3:08 (14) and 3:09 (15) the boss shows ✉️❗ with a rising bar, aims an orange cone at the player and searches the meeting room. He knows the letter is gone without ever going back to his desk. Then at 3:40 (28) he picks up the empty tray, baffled. A player would think the theft was spotted. — Keep the boss's bubble to 💡 or 😤 until he gets back to his desk. Nothing about the letter should show before 3:40.
- blocker: Shots 14 and 15 never show the stash. The player isn't at their desk, no drawer is drawn and the envelope just vanishes from the hand slot. "Hide it at your desk" is the step that finishes every route. — Re-shoot with the player seated at the middle desk: an open drawer with the envelope going in, then a shut drawer with a corner showing.
- blocker: The coffee-route setup doesn't read. The jug, the pour and the puddle are invisible in 18 and turn into "something red and white" in 19, so the reader infers "overload" rather than "soak". A player wouldn't know to pick up the jug. — Draw the jug tipped and empty, a big blue puddle and a 💧 over the machine. In 19, show a clear water arc from the jug.
- should: The boss's bubble in 03 shows a keyboard, which says he's working, and the 😩 shows up in 03, 05, 06 and 32 for different reasons. "Dreads the tray" never lands. — Bubble ✉️😩 in 03 and save the 😩 for the tray.
- should: In 04 the boss drums his fingers, but the shot is identical to 01. — Animate the drumming with tap ticks.
- should: In 05 the boss only thinks of the clock. The reach, the glint and the hands aren't drawn. — Have him pick up the real desk clock.
- should: The flicker in 17 reads as a grey mood. This is the shot that teaches "the machine strains the power." — Add a spark at the plug and flicker the ceiling lamps.
- should: Phone-torch cones in 10, 21 and 22 are as long as daylight cones, so the lesson "the dark shrinks sight" comes out as "the dark changes sight". The reader couldn't say what the torch in 10 even was. — Make torch cones about a third of normal length, and show the phone in his hand.
- should: The spit-out wad in 27 is unreadable, and the chewing is never shown. That buries the funniest ending. — Show a chewing beat and draw the wad as soggy paper.
- should: The deskwork loss in 32 shows neither the boss nor the letter, so its cost is unclear. — Add the boss waving the letter and end the strip ✉️😠📦.
- should: In 33 the ⚡ slot on the eaten win reads as a bug. — Give the slot a 🤢 badge, or lead the strip with the route icon.
- should: In 30 the strip shows Kev with 🔧, the man who undoes the blackout, on a win. — Swap in ⚡ 🔦boss 🚶 ✉️ (blackout, boss leaves, letter taken), or drop Kev.
- should: In 36 the cup gets an E prompt and fills the hand slot but has no purpose, so it reads as a plan. — Make it a dead-end sip with no prompt, or give it a visible use.
- should: The lighting panel (07) is a single blank plate that only reads after it's used. — Draw several toggles with a 💡 above them.
- nit: In 11 the boss's path to the panel goes through the meeting room, so he seems headed for the table. — Add a 💡❓ bubble, or route him along the wall.
- nit: In 06 the alarm rings at 3:39 while the card says he reads his tray at 3:40, and the tray-drag isn't visible. — Ring at 3:40 and slide the tray toward him.
- nit: The vertical "?" suspicion bar (02, 14, 15) is never explained, and the reader flagged it. — Fill it in the same colour as the cone, and flash a ❗ at the top when it fills.
- nit: In 30 the recovered envelope lies face up on the player's desk, in plain view of the glass office. — Tuck it under the keyboard, with just a corner showing.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"e18dbc1","hash":"cdca1274751ac0872616a83d2707e0be5eb6e996a46a0c8e58745024d8dbe13a","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","checks":"514c50bee4edbda2123d40331d8248dba42a4db862158efe8704db46639c6454","ways":"9dcc68539837651a4cf2ff481ca2b885938e6d789ad93dcd4d6f13faa9b39f9c","frames":"fda7618028127f602a3b4b542cbddf79ddd30540455c8d08bdd6e09ba9b25bb2","prompts":"9e3c9df1ce09f69e814a3665f47fd26f19cf1da4d95956302759c3b798c0d63d"},"model":"default","problems":{"blocker":3,"should":2,"nit":2}} -->
## replay: fixable
Recorded 2026-11-15 at commit e18dbc1, by claude -p (model: default). Inputs cdca1274751a: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the pass's prompts.
Problems: 3 blocker, 2 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 119 s | $0.60 |
| 1-read-2 | reading.md | 123 s | $0.53 |
| 1-read-3 | reading.md | 157 s | $0.75 |
| 1-read-4 | reading.md | 26 s | $0.08 |
| 2-compare | report.md | 103 s | $0.41 |
| all | | 260 s (the steps add up to 528 s) | $2.36 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] ** Run 8 shows two causes for one loss. The boss is seen reading the letter at 3:40, but the end card blames Lin's 👉 and the desk work. — Pick one: end the loop at Lin's shout with the 👉📄 card, or use the 📦 letter card with Lin's 👉 as one of its icons.
- E2 [blocker] ** The jug pour can't be seen. The reader saw "the machine sprays" in run 8 and a "grey splat" in run 5, and never learned that water was the cause. — Draw a large tipped jug with a blue stream into the back vent, and a blue dripping puddle afterwards.
- E3 [blocker] ** In run 7 the boss walking back reads as Kev ("spiky dark hair and a green shirt"), so the catcher and the end card don't match. — Make the boss's sprite readable (bald highlight, navy suit) and keep his torch cone attached to him as he returns.
- E4 [should] ** The 3:10 flicker reads as Lin being startled for no reason, so the "machine strains the wiring" clue is lost in runs 1–3. — Add a spark running from the machine to the fuse box and a blinking amber lamp on the box.
- E5 [should] ** The run 9 icons (⚡, Kev, 🔧, ✉️) credit Kev's repair instead of the player's breaker pull. — Use icons for the open fuse box, the empty desk and ✉️.

### 1-read-1: reading.md

# Second Thoughts: a cold read

**Mission card:** It's 3:00 PM and your angry resignation letter is in the boss's tray. He goes through the tray at 3:40, and you want to keep your job.

## Run 1: Loss

- **3:01** The boss sits at his desk with the envelope in his tray. A thought bubble shows a typewriter and a tired face. You (the woman in red) sit at your desk.
- **3:04–3:39** The boss's bubble keeps switching between typewriter + tired and clock + tired. Nobody else goes near him.
- **3:05–3:06** The woman in teal shows a coffee bubble and walks to the kitchen.
- **3:11** At the coffee machine she shows a scared face. The man with spiky hair, sitting at his desk, shows "?".
- **3:14–3:34** The coffee machine steams. She comes back holding a mug at about 3:34.
- **3:36** The clock turns red.
- **3:40** The boss opens the envelope and shows a letter + angry bubble. You stand up with a grin, then appear beside his door with a dread bubble.
- **End picture:** The boss waves the letter and an angry speech burst shows your face. The icons are boss, letter, angry, cardboard box. You were fired.

**Why it ended:** He read the letter at 3:40.

**What you did:** Nothing. You never acted.

**Might not be about you:** The scared face and the "?" at 3:11 happened with no input from you. So did the jump to his door at 3:40, which looked like being called in.

## Run 2: Loss

I looked at 10 of the 20 pictures (01, 05, 06, 10, 15, 17–20). Each one matched Run 1 exactly: same times, bubbles, walks and end picture. You took no action, and the loss had the same cause, the letter being read at 3:40. I can't confirm the 10 pictures I skipped.

## Run 3: Win

I skipped pictures 12, 13 and 15.

- **3:01** You flip the wall switch near the meeting room (you hear a sound). The boss's office goes dark, a lamp comes on, and he shows "?".
- **3:05** He walks out toward the switch. You are near his door.
- **3:07** In the dark office you take the letter from his tray. The hand slot now shows an envelope.
- **3:08** The lights are back on. At the switch he shows a light bulb + angry bubble. You are leaving his office.
- **3:10** At your own desk you use something and the hand slot empties. A small paper item now sits by your desk. The boss walks back.
- **3:14–3:39** Same coffee routine as Run 1. His tray now holds something grey where the envelope was.
- **3:40** You stand with a party bubble.
- **End picture:** The boss shows "?" and your letter is on your own desk. The icons are bulb, boss, "?", envelope. You earned a light bulb badge.

**Why it ended:** At 3:40 his tray no longer held your letter.

**What you did:** Turned off his light, took the letter, then put it at your desk.

**Might not be about you:** The angry bubble at the switch is aimed at the switch, not at you. The scared face and "?" at 3:10–3:11 also happened in Runs 1 and 2. The whole floor looked dim at 3:10, and I can't tell why.

### 1-read-2: reading.md

# Second Thoughts: reading

## Run 4: loss at 3:05

- **3:01** I'm standing at a small wall switch in the corridor and use it. There's a sound, the boss's office goes dark, and his bubble changes to "?".
- **3:05** The boss leaves his office and walks down the corridor toward the switch, with a "🌑?" bubble. The teal-shirt coworker leaves her desk with a "☕" bubble.
- **3:05** The boss's sight cone turns red over me: "! 👉 me".
- **End:** a picture of the boss pointing angrily at me in front of the switch.

**Why I lost:** I was still standing at the switch when he came to check it.
**What caused it:** flipping the switch, then staying put.
**Might not be a reaction to me:** the teal coworker's coffee walk happens at the same time in run 5, before I've touched anything, so it's her routine.

## Run 5: win at 3:40

- **3:04** I use the coffee machine in the kitchen. A grey splat appears under the counter.
- **3:05–3:09** The teal coworker has a "☕" bubble and walks to the kitchen.
- **3:11** At the machine she gets a "😨" bubble. A yellow spark runs along the wall to the panel on the left, and the whole office goes dark. The boss and the green-shirt coworker both show "?".
- **3:14** The boss walks to the panel with a flashlight. The green-shirt coworker shows "🔧".
- **3:15** In the empty boss's office I take the envelope from the tray. It shows up in my hand slot.
- **3:18** At my own desk I use something, and my hand slot goes empty. It looks like I put the envelope away.
- **3:23** The teal coworker at the machine shows "😞".
- **3:29** The lights come back and everyone goes back to their desk.
- **3:40** The boss goes through his tray.
- **End:** the boss holds up an empty tray with "?". I'm smiling, with the envelope on my desk. Icons: teal coworker, ☕, ⚡, ✉️. A coffee badge is earned.

**Why I won:** the tray was empty at 3:40.
**What caused it:** the coffee tampering caused the blackout, which got the boss out of his office, and then I took the envelope. Run 6 shows the 3:18 desk action wasn't needed.
**Might not be a reaction to me:**
- The boss's "⏰😩" / "😩" bubbles switch back and forth in every run from 3:01 onward, so they're routine.
- The "?" bubbles at 3:11 are reactions to the dark, not to me.
- The teal coworker's walk to the coffee machine is her routine. I didn't lure her there.

## Run 6: win at 3:40

Same as run 5 up to taking the envelope at 3:15. After that:

- **3:23** I'm at a desk in the kitchen, still holding the envelope. The teal coworker at the machine shows "😞".
- **3:29** The lights come back. I stay in the kitchen.
- **3:31** The teal coworker walks right past me with the lights on and doesn't react.
- **3:40** I show "🎉".
- **End:** the same picture as run 5, except I'm holding the envelope. Same icons and badge.

**Why I won:** the tray was empty at 3:40 and nobody caught me.
**What caused it:** the 3:04 coffee machine action and taking the envelope at 3:15.
**Note:** the coworker walking past at 3:31 without noticing suggests that only the boss cares about the envelope, or that the kitchen counts as safe. I can't tell which.

## Run 7: loss at 3:25

Same as run 5 up to taking the envelope at 3:15. After that:

- **3:23** I'm still standing at the boss's tray in the dark, holding the envelope.
- **3:25** The lights come back. A figure in the corridor doorway shows "✉️?" with a red cone over me. The figure has spiky dark hair and a green shirt, which looks like the green-shirt coworker, not the bald boss.
- **3:25** The doorway figure then shows "! 👉 me".
- **End:** the boss, not the coworker, points at me while I hold the envelope next to his desk.

**Why I lost:** I was caught in the boss's office with the envelope after the lights came back.
**What caused it:** staying in the office too long after taking the envelope.
**Unclear:** I can't tell who spotted me. The doorway figure looks like the coworker, but the end picture shows the boss. The boss isn't visible anywhere else at 3:25, so it might be him drawn badly. As a player I'd be confused.

### 1-read-3: reading.md

# Second Thoughts: a cold read of runs 8–11

## Run 8: Loss

- **3:01** Boss at his desk thinks "papers 😩". There's an envelope in his tray.
- **3:05–3:06** The player stands at the coffee machine with the E prompt showing. The teal woman thinks ☕ and heads toward the kitchen.
- **3:09** The machine sprays. The teal woman arrives, looks, thinks "🫗?" and then shouts "! 👉 player".
- **3:10** Boss bubble: "📄 👉 player", with a dotted line to the kitchen. Player 😨. Bearded man "?".
- **3:11–3:24** A paper with a red stripe follows the player to the middle desk. Papers fly while they work.
- **3:40** Boss reads the tray: "✉️😠". The player walks to his office: 😬, then 😩.
- **End:** The teal woman points at the player, who is buried behind a paper stack. Icons: woman, 👉, stack.

**Why it was lost:** The picture blames the finger-pointing. The player was punished with paperwork, not fired. But the boss also opened the envelope angrily, so I can't tell which one counted.

**Player's action:** No "used the thing" marks, and the captions say some moments are missing. I can't confirm the player broke the machine.

**Maybe not a reaction:** The teal woman's coffee walk happens in every run. She had a reason to be there anyway.

## Run 9: Win

- **3:03** The player uses the grey wall box at the left. The office goes dark. Boss "?". Bearded man thinks 🔧 and gets a flashlight.
- **3:05** Boss leaves his desk. The teal woman is on her ☕ walk.
- **3:10** Bald and bearded figures, one with a flashlight, are at the wall box. The player is at the boss's desk.
- **3:11** The player takes the envelope; it shows in the hand slot.
- **3:14** Lights back on. At the middle desk the hand empties and a paper sits there.
- **3:40** Boss finds his tray empty. Player 🎉.
- **End:** Boss "?" at a blank tray. The envelope is on the player's desk. Icons: ⚡, bearded man, 🔧, ✉️.

**Why it was won:** The tray was empty at 3:40.

**Player's actions:** The blackout and grabbing the letter.

**Maybe not a reaction:**
- The teal woman's walk happens every run.
- The boss leaving might be his routine, but runs 8, 10 and 11 suggest the dark caused it.
- The bearded man's walk back at 3:14–3:16 was the return from the box, not a reaction to the player.

## Run 10: Loss

- **3:05** The player uses the wall box, two minutes later than in run 9. Lights out, same reactions as run 9.
- **3:07** Still at the box, the player is caught in the flashlight of the bald man (I think it's the boss). "! 👉 player".
- **End:** The bald man, angry, shines a light on the player by the box. Icons: bald man, 👉, player.

**Why it was lost:** Caught standing at the box.

**Player's action:** Flipping it and not leaving.

## Run 11: Win

- **3:03–3:11** Same as run 9: lights out, boss gone, envelope taken.
- **3:16** The player uses something at the lower-middle desk. Paper flies, they show a 🤢 bubble, and a grey crumpled ball appears beside them.
- **3:19–3:39** Nothing happens. The routines repeat.
- **3:40** Empty tray. Player 🎉.
- **End:** Boss "?". The player is green-faced. Icons: ✉️, 🤢, boss, ❓.

**Why it was won:** The tray was empty. The picture says the player ate the letter.

**Player's actions:** The blackout, taking the letter, then eating it.

**Maybe not a reaction:** The grey ball (chewed letter or something else?). The bearded man walking at 3:16 is his return from the box.

### 1-read-4: reading.md

# Reading: Second Thoughts

## Run 12

**Beats**
- **3:01.** I'm in the open-plan area, just below the boss's glass office. The boss sits at his desk, which has a tray with an envelope in it and a desk clock. His bubble shows a typewriter and a fretful face. His sight cone is yellow and points down into the open area. The two coworkers are at their desks.
- **3:03.** I'm inside the boss's office, standing at the right end of his desk, beside the tray. His cone has turned red and covers me. A red "?" is over his head, and his bubble shows an envelope and a "?".
- **3:03.** He shouts: "!", a pointing hand, my face.
- **3:04.** The loop ends in a loss. The picture shows the angry boss at his desk, with the envelope lying between us and me reaching toward it. The icons read boss 👉 me. All three slots are empty.

**Why it lost:** The boss caught me at his desk. It ended at 3:03, long before he goes through his tray at 3:40, so him reading the letter isn't what lost it.

**What caused it:** Walking into his office and up to the tray while he was sitting there. The captions never mark "you used the thing here," so I can't tell whether I touched the envelope. The hand slot in the top bar stays empty all loop.

**Might not be a reaction to me:** The boss's envelope "?" could be his own thought about his tray, not a response to me. His first bubble was already about desk work before I got close.

### 2-compare: report.md

Verdict: fixable

## Runs
- **Run 1 (do nothing → letter read): `explained`.** The reader says "He read the letter at 3:40" and "You never acted."
- **Run 2 (do nothing; the coffee machine only makes the lights flicker): `explained`.** The reader got the loss and its cause: the letter was read at 3:40. They skipped half the pictures and never noticed the flicker that this run is meant to show (see beat B1).
- **Run 3 (switch, walk off, take it → win): `explained`.** "Turned off his light, took the letter, then put it at your desk."
- **Run 4 (switch, stay at the panel → caught): `explained`.** "I was still standing at the switch when he came to check it."
- **Run 5 (blackout via the jug → win): `explained`.** "The coffee tampering caused the blackout, which got the boss out of his office, and then I took the envelope." The reader never learned that water was involved (see B2), but they named the action and the chain of events.
- **Run 6 (blackout, wait in the kitchen → win): `explained`.** "The tray was empty at 3:40 and nobody caught me."
- **Run 7 (blackout, wait in his office → caught): `explained`.** The reader got the cause right, "caught in the boss's office with the envelope after the lights came back," but misread who caught them (B3).
- **Run 8 (Lin catches the pour → desk work → fail): `partly`.** See below.
- **Run 9 (breaker, step away → win): `explained`.** "The blackout and grabbing the letter."
- **Run 10 (breaker, stay at the box → caught): `explained`.** "Caught standing at the box." Flipping it and not leaving.
- **Run 11 (breaker, then eat it → win): `explained`.** "The tray was empty. The picture says the player ate the letter."
- **Run 12 (take it in the light → caught): `explained`.** "The boss caught me at his desk… Walking into his office and up to the tray while he was sitting there."

### Run 8: partly
- **What the reader wrote:** "The picture blames the finger-pointing. The player was punished with paperwork, not fired. But the boss also opened the envelope angrily, so I can't tell which one counted." Also: "I can't confirm the player broke the machine." And at 3:09: "The machine sprays."
- **What really happened:** The player was still pouring the jug into the machine's back when Lin walked in. She pointed them out, they were given desk work, and the loop failed.
- **Visual causes:**
  1. **Two endings overlap.** The loop runs on to 3:40 and the boss is seen reading the letter angrily ("✉️😠", with the player walking to his office 😬/😩). That is the setup for the "letter read" loss, which ways.md says gets its own end card (boss holding up the envelope, 📦). But the end card shows Lin pointing and a paper stack. One loop gives two causes, and the reader can't tell which one lost it.
  2. **The pour never registers as an action.** In 08/05 the player stands at the machine while Lin's shout is already up. The jug and the stream of water can't be seen at this scale, so the pour reads as "the machine sprays": something the machine did, not the player.
- **Fix:** Pick one ending. Either end the loop at Lin's shout with the 👉📄 card, or let it run to 3:40 and show the 📦 letter-read card with Lin's 👉 as one of the icons under it. Also draw the pour as a big tipped jug over the machine with a blue arc of water, held for several frames.

## Beats that misled the reader
- **B1. The 3:10 flicker is missed or read as a scare.**
  - Run 1: "At the coffee machine she shows a scared face. The man with spiky hair… shows '?'." Run 3: "The whole floor looked dim at 3:10, and I can't tell why."
  - **What happened:** Lin switched the old machine on, the floor's lights flickered, and Lin and Kev reacted to the flicker. This is the first-loop clue that the machine strains the wiring.
  - **Visual cause:** A missing cue. One dim frame doesn't read as a flicker, and the "?" gets credited to nobody in particular.
  - **Fix:** Draw a yellow spark that runs from the machine along the wall toward the fuse box, and make the box's lamp blink amber, using the same spark the real short uses in run 5. The ? bubbles then point at the box.
- **B2. "A grey splat appears under the counter"** (run 5, 3:04).
  - **What happened:** The player poured the water jug into the machine's back vent, and the puddle is the leftover water.
  - **Visual cause:** A missing cue, and the water is drawn in the wrong colour. A grey puddle reads as dirt or coffee, and the empty jug isn't noticed. The reader only ever calls it "coffee tampering."
  - **Fix:** Draw the puddle pale blue with drips running off the counter edge, and draw the empty jug tipped over or visibly empty next to the machine.
- **B3. The wrong person seems to catch the player** (run 7, 3:25).
  - The reader wrote: "The figure has spiky dark hair and a green shirt, which looks like the green-shirt coworker, not the bald boss… As a player I'd be confused."
  - **What happened:** The boss walked back from the fuse box (07/10 shows him at the box beside Kev) and saw the envelope in the player's hand.
  - **Visual cause:** The boss's sprite doesn't read as him at this scale while he's holding the phone, and the end card then shows the boss. The reader is left unsure whether coworkers are a threat too, which matters for the run 6 route.
  - **Fix:** Keep the boss's bald head and navy suit readable from every angle, for example a bright scalp highlight and a navy-blue name ring. Keep his torch beam on while he walks back, so the cone visibly comes from him.

## Problems
- **blocker:** Run 8 shows two causes for one loss. The boss is seen reading the letter at 3:40, but the end card blames Lin's 👉 and the desk work. — Pick one: end the loop at Lin's shout with the 👉📄 card, or use the 📦 letter card with Lin's 👉 as one of its icons.
- **blocker:** The jug pour can't be seen. The reader saw "the machine sprays" in run 8 and a "grey splat" in run 5, and never learned that water was the cause. — Draw a large tipped jug with a blue stream into the back vent, and a blue dripping puddle afterwards.
- **blocker:** In run 7 the boss walking back reads as Kev ("spiky dark hair and a green shirt"), so the catcher and the end card don't match. — Make the boss's sprite readable (bald highlight, navy suit) and keep his torch cone attached to him as he returns.
- **should:** The 3:10 flicker reads as Lin being startled for no reason, so the "machine strains the wiring" clue is lost in runs 1–3. — Add a spark running from the machine to the fuse box and a blinking amber lamp on the box.
- **should:** The run 9 icons (⚡, Kev, 🔧, ✉️) credit Kev's repair instead of the player's breaker pull. — Use icons for the open fuse box, the empty desk and ✉️.
- **nit:** The empty wire tray reads as "something grey where the envelope was" (run 3). — Draw the empty tray with visible wire bars and no fill.
- **nit:** At 3:40 in run 1 the player "stands up with a grin" just as their resignation letter is read. — Draw a 😬 grimace with sweat drops.

<!-- /cold-read:replay -->
