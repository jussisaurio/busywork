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

<!-- cold-read:sense {"verdict":"works","date":"2026-11-15","commit":"0af7b0a","hash":"ada15b0a9c7e73976cc813c9301cefccbcbea9681ff2da5baf8fb1e86731dd2e","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","ways":"137f5d0de592b20539e5c3f465f533562c29294126979242c4b68beec51ee451","prompts":"4efae5d3d9191596f5720cdf7e7483eea858a949c44cf5579c3f9b7d49f613b3"},"model":"default","tally":{"sensible":7,"stretch":2,"nonsense":0},"problems":{"blocker":0,"should":4,"nit":2}} -->
## sense: works
Recorded 2026-11-15 at commit 0af7b0a, by claude -p (model: default). Inputs ada15b0a9c7e: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 7 sensible, 2 stretch, 0 nonsense.
Problems: 0 blocker, 4 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 47 s | $0.11 |
| all | | 47 s (the steps add up to 47 s) | $0.11 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] In the blackout, one short in the coffee machine trips the whole floor. A real fault trips only the kitchen circuit. The lights flickering at 3:10 earn some belief, but a half-awake player may still shrug. — Have Lin or Kev say the kitchen and the lights "share a circuit, it's ancient," or let the flicker reach the boss's office too so the link is clear.
- E2 [should] Lin switches on a machine with water dripping out behind it. Someone making coffee might see a puddle on the counter and wipe it up first. — Make the drip go down behind the counter or into the drip tray, so there's nothing on the counter for her to notice.
- E3 [should] Kev shouts and reports you to the boss straight away. A real coworker would first say "uh, what are you doing?" and only go to the boss if your answer was odd. Being sent to your desk for 20 minutes is fine as a result. — Kev calls out first, then reports you to the boss, who sends you to your desk.
- E4 [should] In the switch route the boss walks down the hall himself. Some bosses would call out "Kev, my lights are off" instead. — Show that the open floor is busy or Kev is on a call, so going himself is the easy choice.

### 1-judge: report.md

Verdict: works
- The switch (win): sensible — when only your own office goes dark, you go to the panel and try switches, and the dark glass hides you on your way in.
- The blackout (win): stretch — every person in it acts sensibly, but one wet appliance blacking out the whole floor is a lot, even with the flicker shown first.
- The breaker (win): sensible — the main breaker goes, the boss goes to look, and Kev resets it by torchlight while the boss holds the light.
- Chewing it up (win, last step): sensible — the method is just disgusting, not impossible, and a wet grey wad tells nobody anything.
- 3:40, letter still in tray (lose): sensible — he reads his tray and finds it.
- Caught with it (lose): sensible — he watched you take an envelope out of his own tray.
- Found at the panel (lose): sensible — whoever is standing at the switch gets the blame.
- Found at the fuse box (lose): sensible — the same, by torchlight.
- Seen soaking the coffee machine (lose): stretch — a coworker would ask "what are you doing?" before going to the boss.

## Problems
- should: In the blackout, one short in the coffee machine trips the whole floor. A real fault trips only the kitchen circuit. The lights flickering at 3:10 earn some belief, but a half-awake player may still shrug. — Have Lin or Kev say the kitchen and the lights "share a circuit, it's ancient," or let the flicker reach the boss's office too so the link is clear.
- should: Lin switches on a machine with water dripping out behind it. Someone making coffee might see a puddle on the counter and wipe it up first. — Make the drip go down behind the counter or into the drip tray, so there's nothing on the counter for her to notice.
- should: Kev shouts and reports you to the boss straight away. A real coworker would first say "uh, what are you doing?" and only go to the boss if your answer was odd. Being sent to your desk for 20 minutes is fine as a result. — Kev calls out first, then reports you to the boss, who sends you to your desk.
- should: In the switch route the boss walks down the hall himself. Some bosses would call out "Kev, my lights are off" instead. — Show that the open floor is busy or Kev is on a call, so going himself is the easy choice.
- nit: The card line "he's watching it" makes it sound like he knows the letter is there and is guarding it. Someone who knew it was there would just read it. — Change it to "it's in his line of sight" so it's clear he simply hasn't got to his tray yet.
- nit: Kev "looks through the unlabelled breakers" for the main one. A main breaker is usually the big obvious one. — Have him say "which one's the main…" and flip a couple of wrong breakers first, or just let him find it straight away.

<!-- /cold-read:sense -->

<!-- cold-read:motives {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"ff8397050c5654152856b90439f47da5384ba335fd6ac7bc6dff63d372b6f57a","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","who":"467fc58a0719ea2a722d2268e537570289a2bd982d36d33bcfba779f67c15d68","prompts":"aa0481bd7d2903c1741f536b834919fec681febf17e0865d79a523b4af6bf462"},"model":"default","tally":{"motivated":1,"binds":1,"thin":1,"unmotivated":0,"contradicts":1,"only-you":0},"problems":{"blocker":1,"should":2,"nit":1}} -->
## motives: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs ff8397050c56: the card, premise.md's who does what, the pass's prompts.
Items: 1 motivated, 1 binds, 1 thin, 0 unmotivated, 1 contradicts, 0 only-you.
Problems: 1 blocker, 2 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 41 s | $0.08 |
| all | | 41 s (the steps add up to 41 s) | $0.08 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] Kev reports someone for pouring water into the coffee machine before anything has gone wrong. On screen that looks like filling the tank, which is normal, so the player can't see why the report is fair. The boss punishing it looks just as unfair. That is the cause of the tattle-and-pile-of-work route. Fix: Kev reports only after something goes wrong, when the machine smokes or the fuse blows just after someone was at it ("❗ it was them 👉"). Or make the act clearly wrong on screen, such as water poured into the back or the vents rather than the tank.
- E2 [should] Kev's tattling is never shown before it matters. Fix: early on, say around 3:02, he reports something small to the boss, like a coworker leaving early or a dirty mug, so the habit is set up.
- E3 [should] Lin is at the kitchen table from 3:10 to 3:31, but nothing says how she reacts to someone at the machine, or to it smoking or the power going out while it brews. A real coworker would say something, step back, or go and get Kev. Fix: give her one beat for each, for example she backs away saying "not again" and heads back to her desk early.

### 1-judge: report.md

Verdict: fixable

- The boss: motivated. He hates paperwork, so he sighs, drums his fingers and checks the clock, and the player can see all of that. He goes to the hallway panel when his own lights die, and to the fuse box when the whole floor goes dark, because he's in charge. He piles work on whoever messed with the coffee machine, which fits a man who hands off paperwork. He never breaks his clock habit. One weak spot: the 3:39 alarm rings without warning.
- Lin: thin. She goes for her 3:05 coffee by habit, and the ☕ and the lights flickering at 3:10 show it. But the text never says what she does if the machine smokes or the power cuts out while she waits. It also says nothing about her seeing someone at the machine while she sits right there at the kitchen table from 3:10 to 3:31.
- Kev: contradicts. His handyman habit is set up well: at 3:10 he glances up at the flicker, so his trip to the fuse box later is earned. His tattling is not. "Tattletale" is a label, and nothing on screen shows it before he points at someone. What sets him off is someone "pouring water into the coffee machine", and in a real office that's just filling the tank. Nobody reports a colleague for that.
- The card's rule: binds. The card sets no rule. "Keep your job" is only the player's goal.

## Problems
- blocker: Kev reports someone for pouring water into the coffee machine before anything has gone wrong. On screen that looks like filling the tank, which is normal, so the player can't see why the report is fair. The boss punishing it looks just as unfair. That is the cause of the tattle-and-pile-of-work route. Fix: Kev reports only after something goes wrong, when the machine smokes or the fuse blows just after someone was at it ("❗ it was them 👉"). Or make the act clearly wrong on screen, such as water poured into the back or the vents rather than the tank.
- should: Kev's tattling is never shown before it matters. Fix: early on, say around 3:02, he reports something small to the boss, like a coworker leaving early or a dirty mug, so the habit is set up.
- should: Lin is at the kitchen table from 3:10 to 3:31, but nothing says how she reacts to someone at the machine, or to it smoking or the power going out while it brews. A real coworker would say something, step back, or go and get Kev. Fix: give her one beat for each, for example she backs away saying "not again" and heads back to her desk early.
- nit: The boss's clock rings at 3:39 with no warning. Fix: put a visible alarm hand on the brass clock, or have him tap it and mutter "when this rings…" when he first checks it.

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

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"841b4291e91d6b562ecdffe1f2fdfa10d3c4589e43bf8f2803f482aa2ac89220","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","premise":"b5231ced9714951a857b1ee5b18baf5f17dd5fc755f66a984e7f59bcaf73a46d","prompts":"f5883160f1d3858e02431a0eee883b8939a1a09664f6e614e9f267258968625e"},"model":"default","problems":{"blocker":1,"should":6,"nit":2}} -->
## premise: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 841b4291e91d: the card, premise.md, the pass's prompts.
Problems: 1 blocker, 6 should, 2 nit.
Earlier problems: 3 fixed, 2 still there, 0 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 14 s | $0.02 |
| 2-review | report.md | 148 s | $0.74 |
| all | | 162 s (the steps add up to 162 s) | $0.77 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 fixed: Left alone, the machine only flickers the lights and Kev glances up (`cast.js:80-86`). You only get a blackout if you cause one.
- E2 still there: The clock round and the 3:39 chime now show his habit on screen. But the tray holds nothing except your envelope (`things.js:80`), so a man sighing at one envelope for 40 minutes without opening it still reads as staged. Put a thick stack of dull paperwork in the tray, with your envelope on top.
- E3 still there: The torch problem is fixed: he leaves the office entirely. But every win card still shows the obvious version: 3:40, lights on, the boss baffled by an empty tray (`end-scenes.js:327`). The joke from the best moment never gets drawn. Draw the blackout and breaker cards at the moment you leave: the boss torching the fuse box, you behind him with the envelope.
- E4 fixed: Taking the letter makes no world noise; only a jingle plays for the player (`presentation.js:147`).
- E5 fixed: The card now reads "goes through his tray", and the badge is ✉️ @boss 📦. The first reader still wondered whether 📦 is the tray, but that misleads nobody.

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] The clock round and the 3:39 chime now show his habit on screen. But the tray holds nothing except your envelope (`things.js:80`), so a man sighing at one envelope for 40 minutes without opening it still reads as staged. Put a thick stack of dull paperwork in the tray, with your envelope on top. (recurring: premise-level?)
- E2 [should] The torch problem is fixed: he leaves the office entirely. But every win card still shows the obvious version: 3:40, lights on, the boss baffled by an empty tray (`end-scenes.js:327`). The joke from the best moment never gets drawn. Draw the blackout and breaker cards at the moment you leave: the boss torching the fuse box, you behind him with the envelope. (recurring: premise-level?)
- E3 [blocker] ** You pour the jug of water into the coffee machine, and Kev shouts and tattles. In a real office, a full jug next to a coffee maker is how you fill it. From Kev's desk, seven tiles away, "pouring water into the back vent" looks exactly like doing the morning chore. Nobody reports that, and nobody expects it to short the machine. Lin also never fills the machine from the jug, yet it brews, which makes the jug look even more like a refill. A player will either never try this, or try it and be baffled when Kev points at them. **Fix:** use the overload that the 3:10 flicker already teaches. Let the player switch on a second appliance (the kettle or microwave) on the same circuit before Lin switches the machine on. Kev reports someone fiddling with the plug strip.
- E4 [should] ** The level's idea is that the dark shrinks sight, but the dark never does that work. On all three routes the boss gets up and leaves; the dark is just a lure that empties his desk, and a fire drill would work the same way. **Fix:** make one route depend on short sight. For example, on the switch route he stays seated with his phone up while Lin brings a desk lamp, and you take the letter from outside his beam.
- E5 [should] ** The breaker makes the blackout route pointless. Both give the same dark floor and the same trip to the fuse box, but the breaker works at any time, needs no timing and has no witness. Nobody who finds the breaker will bother with the coffee machine. **Fix:** put the breaker inside Lin's view (her desk sits about 3.6 tiles from it), or have Kev keep the box locked.
- E6 [should] ** It's 3 PM and his office has outside windows (`presentation.js:41`), plus glass walls onto a lit floor. Yet turning off the tubes makes it navy-dark. The same goes for the windowed meeting room and kitchen in a blackout. **Fix:** remove the windows or draw closed blinds. Better still, make it a dim winter afternoon and say so in the opening frame.
- E7 [should] ** premise.md says the breaker works "any time". But before 3:05 and after 3:31 Lin sits next to the box, and her side glances can catch you pulling it. That's a tattle the premise doesn't mention. The cause is visible, so nobody is misled, but the claim is wrong. **Fix:** say so in the premise, or rely on it as the breaker's cost (see above).

### 1-card: first-read.md

**Situation:** It's 3:00 PM. Earlier, in a rage, I wrote a resignation letter and put it in the boss's in-tray. Now I regret it. The boss checks the tray at 3:40, so I have 40 minutes.

**My goal:** Make sure he never reads it, so I keep my job. That could mean taking it back, destroying it, swapping it for something else, or keeping him away from the tray.

**If I fail:** He reads it and I'm out, probably carrying a 📦 of my desk stuff to the door. The other reading is that 📦 is just the tray.

**Questions:**
- Does getting caught at his desk also count as losing my job?
- Is the letter in an envelope? Will he notice if the tray is emptier?
- Does he check the tray on time, or can I make him late?
- What does "@boss" mean: the boss himself, or a place?
- Name: is "Second Thoughts" about my regret? Could the boss have second thoughts, so I could win by making him *want* to keep me?

### 2-review: report.md

Verdict: fixable

**Best thing:** the floor goes dark and the boss stands at the fuse box holding his phone torch for Kev, his back to his own dark, empty office, while you walk out of it with the envelope.

## Earlier problems
- E1: fixed. Left alone, the machine only flickers the lights and Kev glances up (`cast.js:80-86`). You only get a blackout if you cause one.
- E2: still there (should). The clock round and the 3:39 chime now show his habit on screen. But the tray holds nothing except your envelope (`things.js:80`), so a man sighing at one envelope for 40 minutes without opening it still reads as staged. Put a thick stack of dull paperwork in the tray, with your envelope on top.
- E3: still there (should). The torch problem is fixed: he leaves the office entirely. But every win card still shows the obvious version: 3:40, lights on, the boss baffled by an empty tray (`end-scenes.js:327`). The joke from the best moment never gets drawn. Draw the blackout and breaker cards at the moment you leave: the boss torching the fuse box, you behind him with the envelope.
- E4: fixed. Taking the letter makes no world noise; only a jingle plays for the player (`presentation.js:147`).
- E5: fixed. The card now reads "goes through his tray", and the badge is ✉️ @boss 📦. The first reader still wondered whether 📦 is the tray, but that misleads nobody.

## Problems
- **blocker:** You pour the jug of water into the coffee machine, and Kev shouts and tattles. In a real office, a full jug next to a coffee maker is how you fill it. From Kev's desk, seven tiles away, "pouring water into the back vent" looks exactly like doing the morning chore. Nobody reports that, and nobody expects it to short the machine. Lin also never fills the machine from the jug, yet it brews, which makes the jug look even more like a refill. A player will either never try this, or try it and be baffled when Kev points at them. **Fix:** use the overload that the 3:10 flicker already teaches. Let the player switch on a second appliance (the kettle or microwave) on the same circuit before Lin switches the machine on. Kev reports someone fiddling with the plug strip.
- **should:** The level's idea is that the dark shrinks sight, but the dark never does that work. On all three routes the boss gets up and leaves; the dark is just a lure that empties his desk, and a fire drill would work the same way. **Fix:** make one route depend on short sight. For example, on the switch route he stays seated with his phone up while Lin brings a desk lamp, and you take the letter from outside his beam.
- **should:** The breaker makes the blackout route pointless. Both give the same dark floor and the same trip to the fuse box, but the breaker works at any time, needs no timing and has no witness. Nobody who finds the breaker will bother with the coffee machine. **Fix:** put the breaker inside Lin's view (her desk sits about 3.6 tiles from it), or have Kev keep the box locked.
- **should:** It's 3 PM and his office has outside windows (`presentation.js:41`), plus glass walls onto a lit floor. Yet turning off the tubes makes it navy-dark. The same goes for the windowed meeting room and kitchen in a blackout. **Fix:** remove the windows or draw closed blinds. Better still, make it a dim winter afternoon and say so in the opening frame.
- **should:** premise.md says the breaker works "any time". But before 3:05 and after 3:31 Lin sits next to the box, and her side glances can catch you pulling it. That's a tattle the premise doesn't mention. The cause is visible, so nobody is misled, but the claim is wrong. **Fix:** say so in the premise, or rely on it as the breaker's cost (see above).
- **nit:** On the win card you stand smugly outside his glass office holding the envelope he's been sighing at all afternoon, while he looks baffled at the empty tray. Fine as comic logic, but it reads as if he should notice. **Fix:** draw the letter in your drawer, or behind your back.
- **nit:** The first reader thought the name might mean winning by giving the boss second thoughts about you. The design never offers that, so the name tempts players toward a route that doesn't exist. **Fix:** accept it, or pick a name that points only at your regret.

<!-- /cold-read:premise -->

<!-- cold-read:verbs {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"066b729b512c5a50a7c0eec3489767558a559dedc2c7865820b74613effabf36","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","verbs":"7a16809a33547249f9b44b563acd254cdb4db834f5d08644ac59fa9c66fb7502","prompts":"061e477a6c379be6b6b5b6834f94ffc76cc7e18374b9322d5658da9920b335c4"},"model":"default","tally":{"fits":6,"odd":0,"wrong":5},"problems":{"blocker":3,"should":2,"nit":1}} -->
## verbs: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 066b729b512c: the card, the verb sheets, the pass's prompts.
Items: 6 fits, 0 odd, 5 wrong.
Problems: 3 blocker, 2 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 25 s | $0.08 |
| 2-judge | report.md | 36 s | $0.12 |
| all | | 61 s (the steps add up to 61 s) | $0.20 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The eat_letter result shows paper scraps on the floor (letter panel 11), so it reads as tearing the letter up, not eating it. A player will think the letter was destroyed by hand and won't connect the 🤢 or the boss's reaction to eating. — Show the paper going into the mouth with a chewing motion over panels 10–11, and leave nothing on the floor. If the wad is needed, make it a spat-out ball that appears after the chewing, clearly coming from the mouth.
- E2 [blocker] The pretend poses don't show what the engine says. Letter and coffee panels 2–3 look like carrying in a new direction, not a phone call or a folder stride. A player can't see that they are pretending, or that pretending hides the item. — Draw the poses to match: hand at the ear with the head tilted for the phone, and the item tucked flat under the arm for the folder. Turn the player toward the camera so the pose can be seen.
- E3 [blocker] The coffee's pretend poses make no sense for a mug. Nobody holds a steaming mug to their ear as a phone, and it can't pass as a folder. — Give items a pretend pose that suits them. For the mug, sip-and-nod while standing and an absent-minded stroll with the mug while walking.
- E4 [should] The eat preview (letter panel 9, "lift") looks the same as panel 8. Holding E shows no change before the ring appears. — Make the lift visible: envelope up to the mouth, mouth open.
- E5 [should] The letter's phone pose (panel 2) is a stretch even if drawn well, because an envelope doesn't pass for a phone. — Use a "reading a memo" pose for paper items while standing.

### 1-read: reading.md

# What each panel shows

## verbs/01.png: white envelope (corner box shows an envelope)

1. The player carries the envelope, facing right or down-right. The envelope has a yellow ring around it and an "E" key prompt sits next to it. Nothing happens to it.
2. Still carrying it, now facing away (up). The envelope is held in front with the ring and "E" prompt. Nothing changes.
3. Still carrying it, facing left or up-left, with the prompt now on the left. Nothing changes.
4. Still carrying it, facing the camera (down), with the prompt on the left. Nothing changes.
5. The envelope is now on the floor to the player's left, still ringed, with "E" next to it. The corner box shows an empty hand. The player put it down or dropped it, and I can't tell which.
6. This looks almost the same as 5: the envelope is on the floor and the hand is empty. The player is a little further right, maybe. I can't see what this panel shows that 5 doesn't. Maybe the player walked away, or maybe the envelope is just sitting there.
7. The envelope is back in the corner box and in the player's hands, facing left. The player picked it back up.
8. Carrying it, facing down. This looks the same as 4. I can't tell what new action this is.
9. Carrying it, facing down-left, near the chairs. This also looks like plain carrying, and I can't tell what's different.
10. Still holding it, but now the envelope is raised up in front of the face. A dark circle sits on the floor around the player with a yellow arc partly filled in, like a progress ring while a key is held down. Something is being charged up or done over time, and I can't tell what.
11. The corner box shows an empty hand. White scraps lie at the player's feet, like torn or crumpled paper, with a small puff or dust cloud next to them. A speech bubble shows a green nauseated face. The envelope seems to have been torn up or destroyed, and the player feels sick or disgusted about it. I'm guessing about the cause.

## verbs/02.png: steaming coffee mug (corner box shows a white mug with steam)

1. The player carries the mug, facing right or down-right. The mug has a yellow ring and an "E" prompt. Nothing happens.
2. Carrying it, facing up. Nothing changes.
3. Carrying it, facing left or up-left, with the prompt on the left. Nothing changes.
4. Carrying it, facing down. Nothing changes.
5. The mug is on the floor to the left with a ring and "E". The corner box shows an empty hand, so it was put down or dropped. It's upright and nothing spilled, as far as I can see.
6. This looks like 5 again: the mug is on the floor and the hand is empty. I can't tell how it differs.
7. The mug is back in hand and in the corner box. The player picked it back up.

## Notes from a first-time player

- The "E" prompt shows in every panel, even ones where nothing happens. So I can't tell which panels are actions and which are just carrying.
- Panels 1–4 in both sheets look like walking in four directions, not actions.
- The envelope sheet has three panels (6, 8, 9) and the mug sheet has one (6) that I couldn't tell apart from their neighbours.
- The only panels where something clearly happens are: dropping, picking up, the hold-to-charge ring (envelope 10), and the torn envelope with the sick face (envelope 11).
- The mug has no special action at all. It can only be dropped and picked back up.

### 2-judge: report.md

Verdict: fixable

- letter / carry: fits — panel 1 shows the envelope held in front while walking.
- letter / pretend (standing, "phone"): wrong — in panel 2 the player faces away with the envelope held at chest height, not at the ear. It looks the same as carrying, and the reader saw only "facing up". Holding an envelope to your ear as a phone is also a stretch.
- letter / pretend (walking, "folder"): wrong — in panel 3 the envelope is raised beside the head while the player walks up-left. It doesn't read as striding with a folder. The reader saw it as just walking in another direction.
- letter / drop: fits — panels 4→5: the hand slot empties and the envelope lies on the floor.
- letter / pick_up: fits — panels 6→7: the envelope goes back into the hand slot.
- letter / eat_letter: wrong — swallowing a note the boss mustn't see is a fair comedy idea, and 🤢 fits it. But the picture doesn't show eating. Panel 9's "lift" preview looks the same as panel 8. Panel 10 brings the envelope only roughly to the face. Panel 11 leaves white scraps and a puff of dust at the feet (the engine sets `world.wad`), and the reader read that as "torn up". If you ate it, there should be nothing on the floor.
- coffee / carry: fits — panel 1 shows the steaming mug held while walking.
- coffee / pretend (standing, "phone"): wrong — nobody holds a hot mug to their ear as a phone. Panel 2 also shows the mug held in front, not at the ear.
- coffee / pretend (walking, "folder"): wrong — a mug can't pass for a folder. Panel 3 shows the mug held near the head, which reads as walking up-left.
- coffee / drop: fits — panels 4→5: the mug is set down upright and unspilled, which reads as "put down".
- coffee / pick_up: fits — panels 6→7: the mug goes back into the hand slot.

## Problems
- blocker: The eat_letter result shows paper scraps on the floor (letter panel 11), so it reads as tearing the letter up, not eating it. A player will think the letter was destroyed by hand and won't connect the 🤢 or the boss's reaction to eating. — Show the paper going into the mouth with a chewing motion over panels 10–11, and leave nothing on the floor. If the wad is needed, make it a spat-out ball that appears after the chewing, clearly coming from the mouth.
- blocker: The pretend poses don't show what the engine says. Letter and coffee panels 2–3 look like carrying in a new direction, not a phone call or a folder stride. A player can't see that they are pretending, or that pretending hides the item. — Draw the poses to match: hand at the ear with the head tilted for the phone, and the item tucked flat under the arm for the folder. Turn the player toward the camera so the pose can be seen.
- blocker: The coffee's pretend poses make no sense for a mug. Nobody holds a steaming mug to their ear as a phone, and it can't pass as a folder. — Give items a pretend pose that suits them. For the mug, sip-and-nod while standing and an absent-minded stroll with the mug while walking.
- should: The eat preview (letter panel 9, "lift") looks the same as panel 8. Holding E shows no change before the ring appears. — Make the lift visible: envelope up to the mouth, mouth open.
- should: The letter's phone pose (panel 2) is a stretch even if drawn well, because an envelope doesn't pass for a phone. — Use a "reading a memo" pose for paper items while standing.
- nit: The coffee steam disappears once the mug is on the floor (coffee panels 5–6), and the ground mug is hard to tell from an empty cup. — Keep the steam wisp on the dropped mug.

<!-- /cold-read:verbs -->

<!-- cold-read:faces {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"dfe128b78cf8b9b0a5f89e43574f0b98294cd1be58e4141659bed94e9a4f5ae4","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","checks":"9e6aea3c435612c3e76fccfe01984201c7bed33ef70d83522bd1861fe34338e5","faces":"58c7dc8f45c6a528d09fa41204d06cce811a3dbb8e72f0e94da92367ca17f343","prompts":"7b1353c6de0c5cf6c70013ea3cb8b0b9dfaae148125f1ffbe7155582b0b04938"},"model":"default","tally":{"clear":11,"vague":7,"misread":1},"problems":{"blocker":3,"should":4,"nit":1}} -->
## faces: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs dfe128b78cf8: the card, route-checks.js, the bubbles, the pass's prompts.
Items: 11 clear, 7 vague, 1 misread.
Problems: 3 blocker, 4 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 55 s | $0.14 |
| 2-judge | report.md | 109 s | $0.39 |
| all | | 163 s (the steps add up to 163 s) | $0.53 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] 12's 💡❓ reads as "any ideas?", and the bulb route (a bulb shows up in the inventory in frame 11) depends on seeing that the boss's light is out. Fix: use a dark or broken bulb, or 💡 followed by 🌑 or ✖, or the boss's desk lamp turned off.
- E2 [blocker] 18 doesn't show which way the paper goes, so the player can't tell whether the boss is asking them to fetch something (the errand that gets him or the player moving). Fix: printer 🖨️ → player's face → boss's own face, so it reads "you bring me the printout."
- E3 [blocker] 17's drops could be water, sweat or a spill. If the outage starts from something at the kitchen counter, the player can't tell what the coworker noticed. Fix: show a puddle on the floor, or 🫗 (pouring liquid), followed by ❓.
- E4 [should] 10's angry face has no target, so the player may think they've been caught when they haven't. Fix: add what he's angry about (e.g. 💡 or ⚡ → 😠), or a 👉 + face if it really is about the player.
- E5 [should] The 😮‍💨 face in 1, 2 and 6 reads as weary or relieved. It only works where the frame gives it away (1 and 6); 2 flips. Fix: use 😩 or 😫 throughout.
- E6 [should] 19's 🤢 next to a spilled mug reads as "gross coffee" rather than "I'm sick." Fix: if the player is faking illness, use 🤒 (thermometer face); if it's about the coffee, ☕ → 🤢.
- E7 [should] 5's flushed face reads as embarrassment for no reason in a dark kitchen. Fix: 😱 or 😨 for shock at the outage.

### 1-read: reading.md

# reading.md

Shapes: cloud with a trail of circles = **thought**, rounded box with a tail = **speech**, jagged yellow starburst = **alert/shout**.

1. **Thought: inbox tray with red down-arrow, then a face sighing out a puff.** "More work just landed, ugh." Or, read the other way: a relieved sigh because the inbox is dealt with. The puff-face could mean weary or relieved.
2. **Thought: red alarm clock, then the same sighing face.** "Out of time / running late, ugh." Or a relieved "finally, the day's over."
3. **Thought: steaming coffee cup.** "I want coffee." It could also be "I'm thinking about my coffee break."
4. **Thought: red question mark.** "Huh? I'm confused." Or "What should I do now?"
5. **Speech: wide-eyed, red-cheeked face.** "Oh!" Embarrassed or shocked, maybe "caught me."
6. **Thought: the sighing puff-face alone.** A tired sigh, or a relieved one. Without context I can't tell which.
7. **Speech: envelope, then angry face.** "I'm mad about this email/letter." Or "I'm angry with you about the mail you sent or didn't send."
8. **Speech: face clenching its teeth.** "Yikes, awkward." Nervous or uncomfortable.
9. **Speech: weary face, mouth open, brows up.** "Ugh, I'm so done." Exhausted or fed up, maybe whining.
10. **Speech: angry red-browed frown.** "I'm angry." Could be at you, or just in general.
11. **Speech: party popper with confetti.** "Hooray! We did it!" Or "There's a party."
12. **Thought: lightbulb, then question mark.** "Any ideas?" or "What was my idea again?" It could also mean "Is the light broken?" since a bulb might be a literal office object here.
13. **Alert: red "!", hand pointing right, then a person with a brown topknot and a red top.** "Hey, HER!" It's either calling attention to that person ("there she is, go to her") or accusing her ("she did it!"). If that's the player character, it means "you've been spotted."
14. **Thought: wrench.** "Something needs fixing." Or "I need a tool / a repair person."
15. **Thought: downcast, disappointed face.** Sad, let down.
16. **Thought: envelope, then question mark.** "Where's my mail / that email?" Or "Did anyone reply?"
17. **Thought: blue droplets, then question mark.** I'm unsure here. The drops could be water ("where's the water? I'm thirsty", or "is something leaking?") or sweat ("why am I sweating / so stressed?").
18. **Speech: grey document, hand pointing right, then the same topknot person.** "Give this paper to her." Or "This document is hers / she wrote it." Could also be blame: "she's responsible for this report."
19. **Speech: green-faced, queasy face.** "I feel sick." Or "Gross, that's disgusting" (maybe bad food or coffee).

**Main confusions:** The puff-face (1, 2, 6) reads as either weary or relieved. That flips the meaning of 1 and 2 entirely. The topknot person in 13 and 18 might be a specific coworker or might be me, and I can't tell which. The droplets in 17 don't clearly mean water or sweat.

### 2-judge: report.md

Status: I've read all the frames and am writing the report now.

Verdict: fixable
- 1: clear — Boss at his desk next to a full tray: "My inbox, ugh." In the frame the sigh reads as weary, not relieved.
- 2: vague — Boss: alarm clock plus the puff-face. It can mean "ugh, the 3:40 deadline" or "phew, time's passing." Cause: the 😮‍💨 face reads as both weary and relieved.
- 3: clear — Coworker heading off: "I want coffee."
- 4: clear — Coworker standing up when the floor goes dim: "Huh?"
- 5: vague — Person in the dark kitchen: flushed, wide-eyed face. It could be shock ("whoa, the lights") or embarrassment ("caught me"). Cause: the blush suggests embarrassment, and nothing in the frame explains that.
- 6: clear — Boss at 3:39, clock red, tray beside him: a weary "time to do the tray."
- 7: clear — Boss: envelope plus angry face. "This letter makes me furious." He has read it.
- 8: clear — Player at 3:40: "Yikes."
- 9: clear — Player after being caught: "I'm done for."
- 10: vague — Boss in the corridor, angry, while the player is at his door holding the letter. Is he angry at you, or at something else? He isn't facing the player. Cause: an angry face alone has no object.
- 11: clear — Player at 3:40: "We did it!"
- 12: misread — Boss next to his dark office: lightbulb plus "?". The frame says "Why's my light out?", but 💡❓ is the standard "idea?" glyph, and that's how it reads alone. The meaning flips.
- 13: clear — Boss's alert, with the player in his red cone: "Hey — YOU!" The face matches the player's sprite.
- 14: clear — Kitchen worker during the outage: "Something needs fixing."
- 15: vague — Same worker, still in the dark: disappointed face. Let down about what? It's probably the outage. Cause: no object glyph.
- 16: clear — Coworker watching the player take the envelope from the boss's tray: "A letter?"
- 17: vague — Coworker with the player in his cone at the kitchen counter: blue drops plus "?". It could be "a spill?", "thirsty?" or "sweating?" Cause: 💦 means water, sweat and splash all at once.
- 18: vague — Boss, with a dotted trail to the player in the kitchen: grey document, pointing hand, player's face. It's an errand, but its direction is unclear: "bring me that printout" or "take this paper to her"? Cause: nothing marks where the paper should go.
- 19: vague — Player next to a spilled coffee mug: queasy face. It could be "I feel sick" (faking it?) or "this coffee is gross." Cause: 🤢 reads as both illness and disgust, and the mug pushes it toward disgust.

## Problems
- blocker: 12's 💡❓ reads as "any ideas?", and the bulb route (a bulb shows up in the inventory in frame 11) depends on seeing that the boss's light is out. Fix: use a dark or broken bulb, or 💡 followed by 🌑 or ✖, or the boss's desk lamp turned off.
- blocker: 18 doesn't show which way the paper goes, so the player can't tell whether the boss is asking them to fetch something (the errand that gets him or the player moving). Fix: printer 🖨️ → player's face → boss's own face, so it reads "you bring me the printout."
- blocker: 17's drops could be water, sweat or a spill. If the outage starts from something at the kitchen counter, the player can't tell what the coworker noticed. Fix: show a puddle on the floor, or 🫗 (pouring liquid), followed by ❓.
- should: 10's angry face has no target, so the player may think they've been caught when they haven't. Fix: add what he's angry about (e.g. 💡 or ⚡ → 😠), or a 👉 + face if it really is about the player.
- should: The 😮‍💨 face in 1, 2 and 6 reads as weary or relieved. It only works where the frame gives it away (1 and 6); 2 flips. Fix: use 😩 or 😫 throughout.
- should: 19's 🤢 next to a spilled mug reads as "gross coffee" rather than "I'm sick." Fix: if the player is faking illness, use 🤒 (thermometer face); if it's about the coffee, ☕ → 🤢.
- should: 5's flushed face reads as embarrassment for no reason in a dark kitchen. Fix: 😱 or 😨 for shock at the outage.
- nit: 15's sad face has no object. Fix: ☕ → 😞, or ⚡ → 😞, so it's clear the outage ruined the break.

<!-- /cold-read:faces -->

<!-- cold-read:tells {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"2efc90b7b5252881f2bf9da6328bc949e466644ce66521b0b17c8d1c401135c5","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","checks":"9e6aea3c435612c3e76fccfe01984201c7bed33ef70d83522bd1861fe34338e5","tells":"f01343f8221cabaacdf3fd3155285d149583d610696a45838374ead740acdb57","prompts":"f1d914aecdc56ea365960569f2587c9563e9f9a055deb88f13ba995eb473a219"},"model":"default","tally":{"visible":3,"faint":1,"invisible":1},"problems":{"blocker":2,"should":3,"nit":2}} -->
## tells: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 2efc90b7b525: the card, route-checks.js, the before and after pictures, the pass's prompts.
Items: 3 visible, 1 faint, 1 invisible.
Problems: 2 blocker, 3 should, 2 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 33 s | $0.13 |
| 2-judge | report.md | 48 s | $0.17 |
| all | | 80 s (the steps add up to 80 s) | $0.29 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In 03, a player can't tell that the desk is theirs or that the letter went into a drawer. It reads as planting evidence on a coworker's desk, so the player misunderstands how the win works ("back to your seat"). — Give the player's desk a clear, permanent mark in the player's red, such as a red chair and a red mug that are always there. Show a drawer sliding out, the letter dropping in, and the drawer shutting, with nothing left on the desktop.
- E2 [blocker] In 04, the boss's ⏰😫 thought appears in the same frame as the coffee rig. Because the timing matches, a player will think the boss reacted to the sabotage. That gives the wrong cause, when in fact Lin and 3:10 are what matter. — Don't let an unrelated bubble start on the same tick as a player action. If the bubble is meant to point at the 3:10 short, show a ⏰ over the machine, not over the boss.
- E3 [should] In 04, nothing shows that the machine is now rigged. All you see is a pale jug and a dimmer machine, which reads as "used it" or "emptied it". — Show the water going into the back vent, then leave a puddle under the machine and a small spark that keeps flickering until 3:10.
- E4 [should] In 04, the desk workers' sight cones shift in the same frame, which adds noise that looks like a reaction to the player. — Keep idle cone changes out of the frames where the player acts, or ease them in over several seconds.
- E5 [should] In 03, the coworker's "?" grows bigger exactly when the player drops the letter. The reader took that as being seen, which could put a player off a correct move. — If the coworker didn't notice, leave their bubble alone. If they did, show a clear witness tell, such as their head turning toward the player and a 👀.

### 1-read: reading.md

**01:** The boss's office (top left) goes dark. In BEFORE the boss has a thought bubble (bed and sleepy face). In AFTER he shows a small "!" and has a flashlight cone pointing down at his desk. His old wide yellow sight cone is gone. Nothing changes in the player's hand slot, and the wall fixture above the player looks a little different. **What I think the player did:** flipped the light switch on the wall outside the boss's office and turned his lights off.

**02:** The hand slot goes from empty to an **envelope**. The highlighted item on the boss's desk is used, and the player moves slightly right of the desk. Outside, the boss has left the dark office and is in the hallway next to the switch, with a teal coworker nearby. **What I think the player did:** took an envelope or letter from the boss's desk while the room was dark and the boss was away.

**03:** The envelope leaves the hand slot, which is empty again, and a small envelope or paper now sits on the desk by the player. The coworker at the right-hand desk already had a small "?" bubble, and it gets noticeably bigger. The boss in the meeting room and the person at the coffee counter don't change. **What I think the player did:** planted the envelope on that empty desk while the coworker watched, confused.

**04:** The player is at the coffee machine in the kitchen (top right). The machine and the jug next to it look different afterwards: dimmer, with the blue jug or cup now pale or empty. The boss, who had no bubble before, now thinks "⏰😫" (alarm clock and tired face). The sight cones of the desk workers also shift: the bottom-left worker turns toward the left wall, and the boss's yellow area changes shape. The hand slot stays empty. **What I think the player did:** used the coffee machine, maybe emptying or breaking it, and the boss now seems to feel it is late or that he is tired. Of the five, this is the one I'm least sure about. I can see that something happened to the machine, but not exactly what.

**05:** The whole office goes dark except the grey lobby at the bottom left. The wall box the player used now looks like a lit keypad. Every worker has a flashlight cone: the boss shows "!", the right-hand desk worker shows a "…" or slashed bubble, and the left desk worker's cone points straight at their own desk. The hand slot stays empty. **What I think the player did:** threw the main breaker or fuse box and cut the power to the whole floor.

### 2-judge: report.md

Verdict: fixable
- tells/01.png: visible — The player flipped the boss's light switch in the hallway. The reader got it: the office went dark and the boss switched to a torch. The switch itself barely changes, and the reader only noticed "the wall fixture looks a little different."
- tells/02.png: visible — The player took the letter from the tray on the boss's desk while he was out at the switch panel. The reader got the envelope, the desk and the boss being away.
- tells/03.png: invisible — The player put the letter in their own desk drawer, which is the last step of the route. The reader thought they had planted the envelope on someone else's desk while a coworker watched. Nothing marks the desk as the player's, and the letter stays visible on the desktop rather than going into a drawer.
- tells/04.png: faint — The player poured the jug into the coffee machine's back vent, so Lin will short it at 3:10. The reader saw the jug go pale and the machine dim, guessed it was emptied or broken, and called it the change they were least sure of. Nothing shows water going into the vent. The boss's new ⏰😫 bubble shows up at the same moment, and the reader read it as a reaction to the coffee machine.
- tells/05.png: visible — The player pulled the main breaker. The reader got it: the whole floor went dark and everyone switched to torches. After the pull, the box looks like "a lit keypad" rather than a breaker with its lever down.

## Problems
- blocker: In 03, a player can't tell that the desk is theirs or that the letter went into a drawer. It reads as planting evidence on a coworker's desk, so the player misunderstands how the win works ("back to your seat"). — Give the player's desk a clear, permanent mark in the player's red, such as a red chair and a red mug that are always there. Show a drawer sliding out, the letter dropping in, and the drawer shutting, with nothing left on the desktop.
- blocker: In 04, the boss's ⏰😫 thought appears in the same frame as the coffee rig. Because the timing matches, a player will think the boss reacted to the sabotage. That gives the wrong cause, when in fact Lin and 3:10 are what matter. — Don't let an unrelated bubble start on the same tick as a player action. If the bubble is meant to point at the 3:10 short, show a ⏰ over the machine, not over the boss.
- should: In 04, nothing shows that the machine is now rigged. All you see is a pale jug and a dimmer machine, which reads as "used it" or "emptied it". — Show the water going into the back vent, then leave a puddle under the machine and a small spark that keeps flickering until 3:10.
- should: In 04, the desk workers' sight cones shift in the same frame, which adds noise that looks like a reaction to the player. — Keep idle cone changes out of the frames where the player acts, or ease them in over several seconds.
- should: In 03, the coworker's "?" grows bigger exactly when the player drops the letter. The reader took that as being seen, which could put a player off a correct move. — If the coworker didn't notice, leave their bubble alone. If they did, show a clear witness tell, such as their head turning toward the player and a 👀.
- nit: In 01, the light switch hardly changes when flipped. — Draw the switch flipping with a contrasting colour, for example a lit green state turning to a dark red one.
- nit: In 05, the pulled breaker looks like a lit keypad. — Draw a door that swings open and a big lever pointing down, with a red indicator light.

<!-- /cold-read:tells -->

<!-- cold-read:outcomes {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"28cf5fdaa9c8e5b1ef64d0d6ea2ed9deb3fcc0590b73e94c92a0991cae3fc13d","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","checks":"9e6aea3c435612c3e76fccfe01984201c7bed33ef70d83522bd1861fe34338e5","ways":"137f5d0de592b20539e5c3f465f533562c29294126979242c4b68beec51ee451","ends":"89631811daa7d7ced79f17f7f08fe1c7590d0358819ce8b03c807e102aa4abbe","prompts":"2c4a72c45c8e3d7e595f0928af4c2741d3a3e144356d832e05fe3e1263e3a558"},"model":"default","tally":{"clear":9,"unclear":2,"wrong":1},"problems":{"blocker":1,"should":2,"nit":1}} -->
## outcomes: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 28cf5fdaa9c8: the card, route-checks.js, premise.md's ways to win and lose, the runs' last frames, the pass's prompts.
Items: 9 clear, 2 unclear, 1 wrong.
Problems: 1 blocker, 2 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 137 s | $0.57 |
| 2-judge | report.md | 75 s | $0.27 |
| all | | 212 s (the steps add up to 212 s) | $0.84 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In run 8 the end card contradicts the moment before it. The last frame on the map shows the boss reading the letter at 3:40. The card instead jumps back to Kev pointing her out, behind a pile of desk work. It also doesn't show the step that actually broke: there's no coffee machine and no water jug on it, just Kev and paper. A player sees two different losses and can't tell which one ended the day. **Fix:** Make the card the 3:40 card (boss holding the letter, 📦). Add a small flashback frame of Kev pointing at her while she pours water into the machine, so the soaking shows as what broke the plan.
- E2 [should] In run 7 you can't tell who caught her. The figure in the doorway is small, dark-haired and green-toned, and Kev has also left his desk. **Fix:** Draw the boss as clearly bald, in his suit and holding his torch, as he comes back through the door. Have the red sight cone start from him in the frame where he points ❗👉.
- E3 [should] In run 11 the chewed letter doesn't look chewed. It's a bright white, sparkly lump, so it reads as a crumpled sheet that could still be read, or as a pickup. Nothing on the map shows her chewing or gagging. **Fix:** Make the pulp a dull, wet grey wad with drips. Show 🤢 over her head when she spits it out, so the map tells the story before the card does.

### 1-read: reading.md

# reading.md: how each loop ended

**Run 1: Caught (the boss read the letter).** At 3:40 the boss's bubble shows ✉️😠 and the envelope is still on his desk. The player walks up to him, sweating. The end card has a red border and shows the boss holding the letter, glaring, then 📦 (packing a box, so she's fired). **Matches.** **Broken step:** she never got the letter out of the tray. She was still at her own desk at 3:40, too late. Odd detail: the clock shows 3:40 in all three pictures, but the captions say 3:41 and 3:42.

**Run 2: Caught, same way.** These pictures look pixel-for-pixel the same as run 1's. **Matches.** **Broken step:** the same as run 1. I can't tell if this was a separate play or a copy.

**Run 3: Win.** At 3:39 the player sits at her desk and the boss looks drowsy. At 3:40 she does a 🎉 dance and a lightbulb badge fills the first slot. The end card has a green border: the boss looks for the letter with a "?" while it sits on her desk. **Matches.** I can't see how she got the letter back.

**Run 4: Caught at 3:05.** The boss's office is dark. The player stands at a wall light switch in the hallway with an "E" prompt. The boss is right next to her, thinking 💡?, and his vision cone is red. Next he points with ❗👉 at her. Red card: the boss points at her under the switch. **Matches.** **Broken step:** switching off his light. He came out to check the switch while she was still standing there.

**Run 5: Win.** The coffee machine in the break room is smoking. She celebrates at her desk and gets the coffee-cup badge. Green card: the woman in glasses, coffee, ⚡, envelope. She's at her desk with the letter and the boss asks "?". **Matches.**

**Run 6: Win.** She has the envelope in hand and is at a desk in the break room. 🎉 and the coffee badge. Green card shows her holding the envelope. **Matches.**

**Run 7: Caught at 3:25.** She's at the boss's desk and the hand slot shows the envelope, so she has the letter. A figure at the office door thinks ✉️? and casts a red cone, then points ❗👉 at her. Red card: the bald boss catches her holding the envelope. **Matches**, mostly. The figure in the doorway is small. The card says it's the boss, but the green-shirted coworker also left his desk, so I can't confirm who it was from the map. **Broken step:** getting away with the letter before someone came back.

**Run 8: Unclear.** The last moments look the same as run 1 (the boss reads the letter, angry). But the red end card shows something else: the spiky-haired coworker in green points ❗👉 at her while she's buried under stacks of paper. **Does NOT match.** That coworker sat at his own desk in every picture and never went near her. **Broken step:** the pictures show the letter being read. They don't show anything for the card's version.

**Run 9: Win.** She celebrates at her desk and the ⚡ badge fills the third slot. Green card: an electrical panel with ⚡, the spiky-haired coworker, a wrench, the envelope. She has the letter. **Matches.**

**Run 10: Caught at 3:07.** The whole office is dark. She's at a red-glowing panel on the left wall. The boss comes out with a flashlight thinking 💡?, his cone turns red, and he points ❗👉. Red card: the flashlight beam on her by the panel. **Matches.** **Broken step:** cutting the power. She was still at the panel when he came to check it.

**Run 11: Win, but a strange one.** She stands by a lower desk next to a white, sparkly crumpled object, then does 🎉. Green card: she's green and nauseous at a desk, with icons ✉️🤢 boss ❓. It looks like she ate the letter. **Partly matches.** The ⚡ badge lights up, but nothing in the pictures involves electricity. I can't see her eat anything.

**Run 12: Caught at 3:03.** She's at the boss's desk, right in his red cone, while he's on a black phone thinking ✉️?. He points ❗👉. Red card: the boss glares as she reaches for the envelope on his desk. **Matches.** **Broken step:** taking the letter while he was sitting right there.

### 2-judge: report.md

Verdict: fixable
- Run 1: clear. You did nothing, he read the letter at 3:40, and you lost. The reader saw him angry with ✉️, and the red card shows him holding the letter with 📦.
- Run 2: clear. You did nothing until 3:11, the coffee machine only flickered the lights, and you lost the same way. The reader saw pictures identical to run 1, which is right, because the ending was the same.
- Run 3: clear. You flipped his lights at the switch panel, took the letter and won. The reader saw 🎉 and a green card with the boss hunting ("?") while the letter sits on her desk.
- Run 4: clear. You flipped the switch and stayed by the panel, so you were caught. The reader saw him point at her by the panel.
- Run 5: clear. You caused the blackout with the coffee machine and won. The reader saw the smoking machine, the coffee badge and the right green card.
- Run 6: clear. You caused the blackout, took the letter and spent 3:40 in the kitchen, and still won. The reader saw her holding the envelope in the kitchen and the boss asking "?" on a green card.
- Run 7: unclear. You took the letter and stayed in his office until the lights came back, and the boss walked in on you. The reader got "caught holding it", but couldn't tell who caught her. In 12.png the figure in the doorway is tiny and dark-haired, and Kev's desk is empty too.
- Run 8: wrong. Kev saw you soaking the machine, you were sent to desk work, and at 3:40 the letter was still in the tray. The last moment shows the boss reading the letter, angry, but the red card shows Kev pointing ❗👉 at her behind stacks of paper. The reader marked it as not matching, and rightly.
- Run 9: clear. You pulled the breaker, took the letter, sat back down and won. The reader saw the ⚡ badge and the card with the fuse box.
- Run 10: clear. You pulled the breaker and stayed by the fuse box, and his torch found you. The reader saw exactly that.
- Run 11: unclear. You used the breaker route, then chewed the letter and spat it out. The reader worked out "she ate it" only from the card (green face, 🤢). On the map the spat-out wad is a white, sparkly lump that looks like a fresh crumpled sheet or a prize, not soggy grey pulp.
- Run 12: clear. You took the letter in front of him and were caught. The reader saw his red sight cone, the pointing, and a card of her reaching for his tray.

## Problems
- blocker: In run 8 the end card contradicts the moment before it. The last frame on the map shows the boss reading the letter at 3:40. The card instead jumps back to Kev pointing her out, behind a pile of desk work. It also doesn't show the step that actually broke: there's no coffee machine and no water jug on it, just Kev and paper. A player sees two different losses and can't tell which one ended the day. **Fix:** Make the card the 3:40 card (boss holding the letter, 📦). Add a small flashback frame of Kev pointing at her while she pours water into the machine, so the soaking shows as what broke the plan.
- should: In run 7 you can't tell who caught her. The figure in the doorway is small, dark-haired and green-toned, and Kev has also left his desk. **Fix:** Draw the boss as clearly bald, in his suit and holding his torch, as he comes back through the door. Have the red sight cone start from him in the frame where he points ❗👉.
- should: In run 11 the chewed letter doesn't look chewed. It's a bright white, sparkly lump, so it reads as a crumpled sheet that could still be read, or as a pickup. Nothing on the map shows her chewing or gagging. **Fix:** Make the pulp a dull, wet grey wad with drips. Show 🤢 over her head when she spits it out, so the map tells the story before the card does.
- nit: In runs 1, 2 and 8 the clock stays at 3:40 while the pictures move on to 3:41 and 3:42, which looks like a freeze or a glitch. **Fix:** Grey out or stop the clock face deliberately at 3:40 once the day is over.

<!-- /cold-read:outcomes -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"ac1759416e63ddb9bec097771d84323a31a64c3668c3ef127be3d571b0538c9a","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","shots":"2e2a1f07fd0378e010dc14c9aa17bf84193ed21f90b3ac9a45152b13ff55a24a","pictures":"41d7c4b6ebfd58e170dd3ce56d33336215acbf7dd173568c8e7f6b608a86bf03","prompts":"373358f2a720c528dbf043178a7e12d5e465c477911cb7d1ae56f78e1d3c10a4"},"model":"default","problems":{"blocker":5,"should":8,"nit":5}} -->
## pictures: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs ac1759416e63: the card, shots.js, the rendered shots, the pass's prompts.
Problems: 5 blocker, 8 should, 5 nit.
Earlier problems: 10 fixed, 2 still there, 1 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 120 s | $0.67 |
| 2-compare | report.md | 212 s | $0.85 |
| all | | 332 s (the steps add up to 332 s) | $1.52 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 fixed: The dark bar with the red "?" is gone from the top wall in 02.
- E2 still there: Lin and Kev still have head-tick lines in 03, 05 and 18. The reader asks about them in 05 and gets no answer.
- E3 fixed: The box is now grey with a green lamp, and the reader names it a fuse box.
- E4 fixed: Lin now heads off with a ☕ bubble (09, 12).
- E5 fixed: The light now comes from the hand and moves with the boss (10, 21, 22).
- E6 no longer applies: The sequence no longer has a "gets up" switch shot.
- E7 fixed: 12 reads as "the boss heads for the switch".
- E8 fixed: The egg bubble is gone.
- E9 fixed: In 20 a spark runs along the wall to the box, and the reader calls it "a nice chain".
- E10 fixed: Kev has a 🔧 bubble (24).
- E11 fixed: 26 reads as a clear catch, with "! 👉 me" on the player.
- E12 fixed: The card's icons are now Lin ☕ ⚡ ✉️.
- E13 still there: In 36 the E prompt floats beside the player at the kitchen door, the mug's purpose is unreadable, and nobody notices the green lamp or the full pot. Drop the prompt, or anchor it on the machine, and draw a full steaming pot.

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [should] In 36 the E prompt floats beside the player at the kitchen door, the mug's purpose is unreadable, and nobody notices the green lamp or the full pot. Drop the prompt, or anchor it on the machine, and draw a full steaming pot. (recurring: premise-level?)
- E2 [blocker] In 14 and 15 the stash isn't drawn, and the boss shows ✉️❗ while hunting. The player concludes that taking the letter gets noticed, which breaks every route and contradicts the "baffled, empty tray" wins. — Draw the player at their own desk with the drawer open, then shut with a corner sticking out. Remove the boss's ✉️❗ bubble.
- E3 [blocker] The boss's routine reads as "napping until the alarm wakes him" (🛏️ and a sleepy face in 03, ⏰😪 in 05, a sleepy face again in 06). A player may try to take the letter while he "sleeps" and get caught. — Remove the bed and the sleepy face. Use a 😮‍💨 with a breath puff, a visible hand on the clock with a glint, and in 06 the tray dragged toward him.
- E4 [blocker] In 17 the harmless 3:10 flicker is drawn identically to the blackout. The player believes the floor goes dark on its own, which hides why the machine needs rigging. — Draw it as a half-dim with strobing tubes and the green lamp lit, or take the shot after the lights steady.
- E5 [blocker] Shot 12 is taken at the wrong moment. The boss is still walking at 3:06, not at the panel. — Take it at 3:07.
- E6 [blocker] Shot 16 is taken at the wrong moment. At 3:05 there's a "?" and a filling bar, not the ❗👉 catch. — Take it at about 3:06, when the starburst fires.
- E7 [should] In 18 the rig action is a squiggle glyph, with no jug and no wet streak. — Draw an empty tipped jug in hand and a dark streak behind the machine.
- E8 [should] In 19 a paper icon and a red bar stand in for the pour, and the boss never enters the snitch beat. — Show the jug pouring, and point Kev's 👉 at the boss's office with the boss reacting.
- E9 [should] The 32 loss card leaves out the boss and the letter, so it doesn't read as losing the job. — Add the furious boss waving the letter and ✉️ 😠 to the icons.
- E10 [should] The three wins (28–30, and 33) reuse one end picture, so the punchline repeats. — Give each route its own sight gag: the boss squinting at the panel, the machine smoking behind the boss, the boss frowning at the reset breaker.
- E11 [should] The 30 icon row credits Kev's wrench and not the player's pull. — Change it to 🖐️⚡ boss ? ✉️.
- E12 [should] In 27 the chewed wad reads as a puff, and the eating is never shown. — Draw a grey crumpled wad with a drip, and add a mouth-and-envelope beat.
- E13 [should] In 33 the eaten win fills the ⚡ slot, which reads as a bug. — Add a 🤢 badge on the slot.

### 1-read: reading.md

# Reading: Second Thoughts

**Card:** It's 3:00 and my angry resignation letter is in the boss's tray. He goes through the tray at 3:40, and I have to keep my job. The card icons are ✉️ @boss 📦. "@boss" reads like a social-media handle, not a face.

**01 (3:00).** A bald boss in a navy suit stands behind a desk in the top-left office. The desk has an alarm clock and a tray with an envelope in it. I'm the red-shirted woman with a bun at the middle desk, marked by a red arrow. A teal-shirted coworker and a spiky-haired one in a green jacket sit at desks, and a kitchen is top-right. The HUD shows clock, envelope and face icons, a hand slot, "↻1" and three empty slots. I can't tell what the three slots are for.

**02 (3:02).** I'm at the tray with an E prompt. The boss shows a red "?" and a filling bar, and his cone turns orange. Walking straight up to the tray gets noticed fast.

**03 (3:01).** The boss's thought bubble shows a bed and a sleepy face. He wants a nap.

**04 (3:03).** The boss stands with no bubble. I can't tell if he's asleep.

**05 (3:05).** His bubble shows an alarm clock and a sleepy face. Both coworkers' cones swing wide, with little lines by their heads. I read it as: he naps and the alarm on his desk wakes him. I can't read the head lines.

**06 (3:39).** The clock is red. The desk alarm is shaking, so it's ringing, and the coffee machine steams with a green light. So the 3:40 check starts when the alarm goes off.

**07 (3:01).** I'm at a small white plate on the corridor wall with an E prompt. It looks like a light switch.

**08 (3:03).** I'm at a grey box with a lightning-bolt sticker on the far-left wall, with an E prompt. It looks like a fuse box.

**09 (3:05).** The boss has jitter lines and the teal coworker walks off with a ☕ bubble. Coffee run, roughly 3:05.

**10 (3:01).** The boss's office is dark and he holds a light with a "?" above him. The switch turned off his lights. That reads clearly.

**11 (3:05).** The dark office is empty and the boss walks out through the meeting room. Darkness gets him out of his office.

**12 (3:06).** The boss heads for the switch while the teal coworker passes me with the ☕ bubble. I have very little time.

**13 (3:07).** I'm at the tray in the dark office with an envelope in the hand slot. The boss is at the switch.

**14 (3:08).** The lights are back on. The boss's bubble shows ✉️ and a red "!", with an orange bar. Taking the letter is noticed: he misses it.

**15 (3:09).** He keeps hunting with the ✉️ "!" bubble. Taking the letter alone isn't enough.

**16 (3:05).** I'm at the switch with his huge red cone right on me. Red seems to mean "caught soon".

**17 (3:10).** The whole floor goes grey. The teal coworker in the kitchen shows a flustered face and the green coworker a "?". It's a power cut.

**18 (3:04).** I'm at the coffee machine and squiggles rise from it. I've done something to it.

**19 (3:03).** At the machine there's a paper icon and a red bar. The green coworker shows a starburst with "!", a pointing hand and my face, so he saw me. I can't read the paper and red-bar glyph.

**20 (3:10).** A yellow spark runs along the wall and black smoke spikes come off the machine. So a broken coffee machine causes the blackout. That's a nice chain.

**21 (3:11).** In the blackout the fuse box shows a red display with sparks. The boss carries a light, and I show up only as a dark outline. Darkness hides me too.

**22 (3:13).** All three wander with flashlights and the boss leaves his office.

**23 (3:18).** I have the envelope while the boss is at the fuse box.

**24 (3:04).** The power is cut early. The green coworker's bubble shows a 🔧, so he's the fixer.

**25 (3:10).** I'm at the tray while the boss and the coworker are at the fuse box.

**26 (3:07).** The boss catches me at the fuse box with the "! 👉 me" starburst.

**27 (3:17).** I'm at another desk with a green sick-face bubble and a white puff next to me. I can't read this until shot 33.

**28: end picture, teal frame.** The boss holds up an empty tray with a "?" while I smirk with the envelope in my drawer. Icons: 💡 boss ? ✉️. A bulb fills slot 1. It's a win, and it looks like each slot is one solution.

**29: end picture, teal frame.** Same scene with the coffee machine behind me. Icons: teal coworker ☕ ⚡ ✉️, and slot 2 gets ☕. This credits the coworker's coffee for the blackout, which is funny.

**30: end picture, teal frame.** Same scene with the fuse box. Icons: ⚡ green coworker 🔧 ✉️, and slot 3 gets ⚡. I can't tell why the wrench guy is in the credit.

**31: end picture, red frame.** The boss waves my letter, furious, and I sweat. Icons: boss ✉️ 😠 📦. I'm fired, and the box matches the card's 📦.

**32: end picture, red frame.** The green coworker points at me while I'm buried under a paper stack, thinking 😩. Icons: coworker 👉 📄. Getting snitched on means a punishment workload? The "loss" is unclear. If I lose, why do I still have a job?

**33: end picture, teal frame.** I'm green at my desk and the boss finds an empty tray. Icons: ✉️ 🤢 boss ?. I ate the letter, which explains 27, and it's the best joke here. But slot 3 lights up ⚡ instead of a new icon. Is that a bug?

**34: end picture, red frame (3:03).** The boss catches me at his tray. Icons: boss 👉 me.

**35: end picture, red frame (3:05).** The boss catches me at the switch, with the same icons.

**36 (3:23).** This is gameplay, not an end picture. I'm holding a coffee mug at the kitchen with an E prompt. I can't tell what the mug does.

**Editor's notes:** The three wins use the same final picture with a different prop, so the punchline repeats. The eating ending (33) is funnier and deserves its own slot. Loss 32 doesn't say "lost the job". "@boss" on the card is noise.

## Story
I rage-quit on paper, then panicked. The boss naps until his alarm rings at 3:40, then checks his tray. I can't just take the letter, because he'll notice it's gone, and walking up to the tray in plain view gets me caught. The lesson is that darkness empties rooms and hides people: kill his light, the fuse, or the coffee machine, and he leaves his desk. In the dark I take the letter back (or eat it), and he finds an empty tray and shrugs.

### 2-compare: report.md

Verdict: fixable

## Shots

- **01 reads.** The player gets their desk, the boss, the tray with the envelope and the clock.
- **02 reads.** "Walking straight up to the tray gets noticed fast" is the point of the shot.
- **03 misread.**
  - Reading: "The boss's thought bubble shows a bed and a sleepy face. He wants a nap."
  - Intent: he stares at the tray and sighs (😮‍💨) because he dreads it.
  - Cause: an emoji standing in for an action. The bubble has a 🛏️ in it, and the sigh face is drawn so it looks sleepy (😌/😪). The body never shrugs.
  - Fix: drop the bed. Show only a big 😮‍💨 with a visible puff of breath, and have the sprite slump its shoulders while facing the tray.
- **04 partly.**
  - Reading: "The boss stands with no bubble. I can't tell if he's asleep."
  - Intent: he drums his fingers on the desk with his eyes on the tray.
  - Cause: a missing cue. At this size the drumming is invisible, and the reader is still carrying the "nap" idea from 03.
  - Fix: add small tap marks on the desk under his hand, plus a tiny repeating 🥁 or "tap" tick, and keep his eyes open with the cone pointed at the tray.
- **05 misread.**
  - Reading: "he naps and the alarm on his desk wakes him."
  - Intent: he reaches for the brass clock and checks it. A glint comes off its face.
  - Cause: an emoji standing in for an action. The ⏰😪 bubble does the work the hand should do, and the sleepy face confirms "nap". The coworkers' head ticks pull the eye away from him.
  - Fix: remove the bubble. Draw his arm out to the desk clock, the clock lifted, and a white glint star on its face.
- **06 partly.**
  - Reading: "The desk alarm is shaking, so it's ringing… the 3:40 check starts when the alarm goes off."
  - Intent: the clock rings, and the boss sighs and drags the tray over with your letter still in it.
  - Cause: a missing cue. The tray hasn't moved and he still shows the "sleepy" face, so the ring reads as a wake-up.
  - Fix: slide the tray visibly toward his chair with a motion streak, and show his hand on it.
- **07 reads.**
- **08 reads.** The grey box with a green lamp now comes across as a fuse box.
- **09 reads.**
- **10 reads.** The switch's amber lamp goes unnoticed, but the cause and effect lands.
- **11 reads.**
- **12 wrong moment.** The intent is the boss standing at the panel trying switches. At 3:06 he is still in the middle of the floor walking toward it, and he only gets there in 13 (3:07). Retake it at about 3:07, once he has arrived.
- **13 reads.**
- **14 misread.**
  - Reading: "The boss's bubble shows ✉️ and a red '!'… Taking the letter is noticed: he misses it."
  - Intent: you're back at your own desk sliding the envelope into an open drawer.
  - Cause: a missing cue plus a contradicting bubble. You're standing on the empty floor away from your desk, no drawer is drawn anywhere, and the boss shows ✉️❗ with an alert bar. The picture says the opposite of the intent.
  - Fix: frame the player seated at their own desk with the drawer pulled open and the envelope half inside. Take the boss's ✉️❗ off; he should show 💡😤 at the panel, or nothing.
- **15 misread.**
  - Reading: "He keeps hunting with the ✉️ '!' bubble. Taking the letter alone isn't enough."
  - Intent: the drawer is shut with an envelope corner sticking out, and your hands are empty.
  - Cause: the same as 14. No drawer is visible, and the ✉️❗ bubble says he knows.
  - Fix: draw the shut drawer with a white corner poking out, and take the ✉️❗ off the boss.
- **16 wrong moment.** The intent is the boss finding you at the panel and pointing (❗👉). At 3:05 he is still approaching with a "?" and a filling bar, and the catch only lands at about 3:06 (see 35). Retake it once the starburst fires.
- **17 misread.**
  - Reading: "The whole floor goes grey… It's a power cut."
  - Intent: an untouched machine makes the lights flicker for a moment, then they steady and it brews.
  - Cause: a missing cue. The flicker frame is drawn exactly like the real blackout grey. The player will believe the floor goes dark at 3:10 every loop for free.
  - Fix: draw the flicker as a half-dim with ceiling tubes strobing and a lit green lamp on the machine, plainly unlike the full blackout. Or take the shot after the lights steady.
- **18 partly.**
  - Reading: "squiggles rise from it. I've done something to it."
  - Intent: you poured the water jug into the back vent. The jug is empty and a wet streak runs behind the machine.
  - Cause: a glyph used as a prop. Squiggles stand in for water, and neither the jug nor the streak can be read.
  - Fix: draw a tipped, empty jug in the player's hand and a dark wet streak down the wall behind the machine. Remove the squiggles.
- **19 partly.**
  - Reading: "I can't read the paper and red-bar glyph."
  - Intent: Kev sees you pouring and points you out to the boss, who sends you to your desk with work.
  - Cause: a glyph used as a prop. A paper icon and a red bar stand in for the jug and the pour, and the boss isn't part of the beat.
  - Fix: show the jug in your hands with water falling. Have Kev's 👉 point toward the boss's office, and give the boss a turned head with a "!".
- **20 reads.** "That's a nice chain."
- **21 reads.**
- **22 reads.**
- **23 reads.**
- **24 partly.**
  - Reading: "The power is cut early."
  - Intent: you pulled the breaker yourself.
  - Cause: a missing cue. Nothing ties the player to the open box.
  - Fix: show the player's hand on the open box door with the handle down.
- **25 reads.**
- **26 reads.**
- **27 partly.**
  - Reading: "a green sick-face bubble and a white puff… I can't read this until shot 33."
  - Intent: a soggy grey wad of chewed paper on the floor at your feet.
  - Cause: a glyph used as a prop. A white sparkle ball reads as a puff, and no shot shows the eating itself.
  - Fix: draw a crumpled grey paper wad with a drip, and add a beat with the envelope going into the player's mouth.
- **28 reads.**
- **29 reads.**
- **30 partly.**
  - Reading: "I can't tell why the wrench guy is in the credit."
  - Intent: a win by the breaker the player pulled.
  - Cause: the icon row credits Kev's repair, not the player's action.
  - Fix: change the icons to 🖐️⚡ boss ? ✉️.
- **31 reads.**
- **32 partly.**
  - Reading: "If I lose, why do I still have a job?"
  - Intent: the boss holds up your letter, furious, while you sit behind the pile. The icons are Kev, pointing, paperwork, the letter.
  - Cause: a missing cue. The boss and the letter are missing from both the picture and the icon row.
  - Fix: put the furious boss waving the letter beside the paper pile, and end the icon row with ✉️ 😠.
- **33 partly.**
  - Reading: "slot 3 lights up ⚡ instead of a new icon. Is that a bug?"
  - Intent: a win where the letter was eaten.
  - Cause: nothing shows that the slots count ways into the dark, so the eating ending looks like it lit the wrong slot.
  - Fix: put a small 🤢 badge on the ⚡ slot when the letter was eaten.
- **34 reads.**
- **35 reads.**
- **36 partly.**
  - Reading: "I can't tell what the mug does."
  - Intent: the machine brewed normally (green lamp, full pot), and you poured a cup.
  - Cause: covered under E13.

## Earlier problems
- E1: fixed. The dark bar with the red "?" is gone from the top wall in 02.
- E2: still there (nit). Lin and Kev still have head-tick lines in 03, 05 and 18. The reader asks about them in 05 and gets no answer.
- E3: fixed. The box is now grey with a green lamp, and the reader names it a fuse box.
- E4: fixed. Lin now heads off with a ☕ bubble (09, 12).
- E5: fixed. The light now comes from the hand and moves with the boss (10, 21, 22).
- E6: no longer applies. The sequence no longer has a "gets up" switch shot.
- E7: fixed. 12 reads as "the boss heads for the switch".
- E8: fixed. The egg bubble is gone.
- E9: fixed. In 20 a spark runs along the wall to the box, and the reader calls it "a nice chain".
- E10: fixed. Kev has a 🔧 bubble (24).
- E11: fixed. 26 reads as a clear catch, with "! 👉 me" on the player.
- E12: fixed. The card's icons are now Lin ☕ ⚡ ✉️.
- E13: still there (should). In 36 the E prompt floats beside the player at the kitchen door, the mug's purpose is unreadable, and nobody notices the green lamp or the full pot. Drop the prompt, or anchor it on the machine, and draw a full steaming pot.

## Problems
- blocker: In 14 and 15 the stash isn't drawn, and the boss shows ✉️❗ while hunting. The player concludes that taking the letter gets noticed, which breaks every route and contradicts the "baffled, empty tray" wins. — Draw the player at their own desk with the drawer open, then shut with a corner sticking out. Remove the boss's ✉️❗ bubble.
- blocker: The boss's routine reads as "napping until the alarm wakes him" (🛏️ and a sleepy face in 03, ⏰😪 in 05, a sleepy face again in 06). A player may try to take the letter while he "sleeps" and get caught. — Remove the bed and the sleepy face. Use a 😮‍💨 with a breath puff, a visible hand on the clock with a glint, and in 06 the tray dragged toward him.
- blocker: In 17 the harmless 3:10 flicker is drawn identically to the blackout. The player believes the floor goes dark on its own, which hides why the machine needs rigging. — Draw it as a half-dim with strobing tubes and the green lamp lit, or take the shot after the lights steady.
- blocker: Shot 12 is taken at the wrong moment. The boss is still walking at 3:06, not at the panel. — Take it at 3:07.
- blocker: Shot 16 is taken at the wrong moment. At 3:05 there's a "?" and a filling bar, not the ❗👉 catch. — Take it at about 3:06, when the starburst fires.
- should: In 18 the rig action is a squiggle glyph, with no jug and no wet streak. — Draw an empty tipped jug in hand and a dark streak behind the machine.
- should: In 19 a paper icon and a red bar stand in for the pour, and the boss never enters the snitch beat. — Show the jug pouring, and point Kev's 👉 at the boss's office with the boss reacting.
- should: The 32 loss card leaves out the boss and the letter, so it doesn't read as losing the job. — Add the furious boss waving the letter and ✉️ 😠 to the icons.
- should: The three wins (28–30, and 33) reuse one end picture, so the punchline repeats. — Give each route its own sight gag: the boss squinting at the panel, the machine smoking behind the boss, the boss frowning at the reset breaker.
- should: The 30 icon row credits Kev's wrench and not the player's pull. — Change it to 🖐️⚡ boss ? ✉️.
- should: In 27 the chewed wad reads as a puff, and the eating is never shown. — Draw a grey crumpled wad with a drip, and add a mouth-and-envelope beat.
- should: In 33 the eaten win fills the ⚡ slot, which reads as a bug. — Add a 🤢 badge on the slot.
- nit: In 24 nothing shows the player pulled the breaker. — Show the player's hand on the open door.
- nit: The card's "@boss" icon reads as a social-media handle. — Use the boss's face icon from the HUD.
- nit: Intents 01 and 03 say "sitting", but the boss sprite always stands behind the desk. — Seat him in the chair.
- nit: In 20 an E prompt hangs over the player's desk during the surge and points at nothing. — Hide prompts while a scripted event plays.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"500ae5a","hash":"676c1854a396805041394ffc15e61e257d3d82eeb0d70d259faca18566e95d51","parts":{"card":"eb57900a4db69b15fb4a603649a85b40f24c5e91f06fd49f05ca071b70db8658","checks":"9e6aea3c435612c3e76fccfe01984201c7bed33ef70d83522bd1861fe34338e5","ways":"137f5d0de592b20539e5c3f465f533562c29294126979242c4b68beec51ee451","frames":"79ae81de007210cbf8c0c281298ff140a84eb09106aadf9e73e05e2dad2f68d4","prompts":"9e3c9df1ce09f69e814a3665f47fd26f19cf1da4d95956302759c3b798c0d63d"},"model":"default","problems":{"blocker":5,"should":7,"nit":0}} -->
## replay: fixable
Recorded 2026-11-15 at commit 500ae5a, by claude -p (model: default). Inputs 676c1854a396: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the pass's prompts.
Problems: 5 blocker, 7 should, 0 nit.
Earlier problems: 2 fixed, 3 still there, 1 no longer applies.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 155 s | $0.77 |
| 1-read-2 | reading.md | 161 s | $0.73 |
| 1-read-3 | reading.md | 161 s | $0.74 |
| 1-read-4 | reading.md | 31 s | $0.09 |
| 2-compare | report.md | 168 s | $0.70 |
| all | | 330 s (the steps add up to 676 s) | $3.03 |

### Ledger
The earlier record's open problems, as this run's reader marked them.

- E1 no longer applies: No run here takes the letter from the front of his desk, and the reader didn't link timing to the theft.
- E2 fixed: The dark now draws a small ring around the boss plus his beam (05/07.png), and the reader never wondered why a nearby theft went unseen.
- E3 still there: The paper stack and Kev's own end card were added, but the reader still writes "Why it was lost: I can't tell." The report doesn't reach the boss, and the end card leaves out the real loss.
- E4 still there: At 3:40 the player still jumps from their desk (😬) to his doorway (😩) with no summons: "the player didn't walk there." It no longer misleads about a cause.
- E5 still there: Using the desk now leaves the letter lying on top of it, not in a drawer, and the reader writes "I can't tell whether putting it on their own desk at 3:10 mattered."
- E6 fixed: The reader now reads Lin's ❓ as being about the dead machine, not the player.

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] The paper stack and Kev's own end card were added, but the reader still writes "Why it was lost: I can't tell." The report doesn't reach the boss, and the end card leaves out the real loss. (recurring: premise-level?)
- E2 [should] At 3:40 the player still jumps from their desk (😬) to his doorway (😩) with no summons: "the player didn't walk there." It no longer misleads about a cause. (recurring: premise-level?)
- E3 [should] Using the desk now leaves the letter lying on top of it, not in a drawer, and the reader writes "I can't tell whether putting it on their own desk at 3:10 mattered." (recurring: premise-level?)
- E4 [blocker] The pour into the coffee machine can't be seen (run 5's 3:04 action leaves no visible change), so the blackout-route win is only partly explained — draw the tipped, empty jug and a drip puddle behind the machine that stay until it shorts.
- E5 [blocker] The flicker in no-pour loops is never seen, so runs 1 and 2 can't show that the machine strains the wiring, and the reader can't tell the pour from the afternoon's schedule — hold the flicker for several seconds with a ⚡ over the machine.
- E6 [blocker] Run 8's pour from the front has no visible action (no jug tipping, no "used" cue), so the reader can't name what Kev saw — draw the jug tipping with a 💦 bubble as Kev's cone turns red.
- E7 [blocker] Kev's dotted report line in run 8 ends at the hallway lighting panel, not the boss, so it reads as Kev blaming the lights — end it on the boss's office and follow it with the boss's 📄👉 to the player.
- E8 [should] Run 7's catch happens at the doorway with the boss and Kev overlapping, so the reader can't tell who caught them — keep Kev at the fuse box a few seconds longer so the boss walks back alone.
- E9 [should] Run 12 has no visible reach, so standing in his view and reaching for the tray look the same — show the arm stretched to the tray with a ✋ in the caught frame.
- E10 [should] The boss's 🛋️😴 bubble suggests he dozes, but his sight never turns off, which points at a route that doesn't exist — use ⏰🥱 and keep his eyes open.
- E11 [should] The chewed letter is drawn as a clean white ball, which reads as a dropped envelope (and a boss would pick that up) — show chewing while E is held, and draw the wad grey and wet.
- E12 [should] Lin ignoring the letter in the player's hand on the open floor looks like a blind spot, not a rule — let her glance at it and go back to her ☕ bubble.

### 1-read-1: reading.md

I've read the card and all three runs. **Run 1 and Run 2 are identical, frame for frame.** In both, the player never acts, and neither captions file has a "used the thing" line.

## Run 1 — Loss

- 3:01 The player (red top, bun) sits at a middle desk. The bald boss is in the top-left office, with a white envelope on his desk. His bubble switches between 🛋️😴 and ⏰😴.
- 3:05–3:09 A woman in teal gets a ☕ bubble and walks to the kitchen.
- 3:11 At the coffee machine she shows 😳. A man in green on the right shows ❓.
- 3:14–3:36 She makes coffee, drifts around and goes back to her desk. The player hasn't moved.
- 3:39 The clock turns red. The boss's bubble changes to 😤.
- 3:40 The boss picks up the envelope and shows ✉️😠. The player shows 😬. Next, the player is standing in the boss's doorway showing 😩.
- End picture: the boss waves the letter, furious, with the player beside him. Icons: boss ✉️ 😠 📦.

**Why it lost:** the boss read the letter at 3:40, as the card said he would.
**Player's cause:** doing nothing.
**Might not be reactions:** the boss's sleepy bubbles, the coffee walk, the 😳 and the ❓ all happen with no input from the player. The move to the boss's doorway happens on its own; the player didn't walk there.

## Run 2 — Loss

Same beats, same times, same bubbles and same end picture as Run 1. The cause is the same (nothing), and so are the possible false reactions. It teaches nothing new.

## Run 3 — Win

- 3:01 The player uses a small white panel on the corridor wall, and a sound plays. The boss's office goes dark and his bubble turns to ❓.
- 3:05 The boss has left his office and is walking through the meeting room toward that panel. The teal woman gets her usual ☕ bubble.
- 3:07 The player is in the dark office at the boss's desk and uses something there. The held-item slot now shows an envelope. The boss is at the wall panel.
- 3:08 The office lights are back on. The boss, still by the panel, shows 😠. The player is at the office door.
- 3:10 The player uses something at their own desk. A paper appears on the desk corner and the slot empties. For this one frame the whole office is greyed out, and I can't tell why. The 😳 and ❓ bubbles appear again.
- 3:14–3:39 The boss goes back to his desk, and the rest of the afternoon runs as in Run 1.
- 3:40 The boss reaches into his tray and gets no ✉️😠 bubble. The player shows 🎉, and a lightbulb fills the first empty slot.
- End picture: the boss at his keyboard with ❓, the player grinning with the envelope on their own desk. Icons: 💡 boss ❓ ✉️.

**Why it won:** the envelope wasn't in the tray at 3:40.
**Player's cause:** taking it at 3:07. That only worked because the 3:01 panel press made the boss leave his office. I can't tell whether putting it on their own desk at 3:10 mattered.
**Might not be reactions:** the boss's 😠 at 3:08 came while he was at the panel, so he could be annoyed at the lights rather than at the player. The 😳 and ❓ at 3:10 happen in every run.

### 1-read-2: reading.md

# Reading: Second Thoughts

Card: it's 3:00 PM and your angry resignation letter is in the boss's tray. He goes through the tray at 3:40. Keep your job.

## Run 4: loss at 3:05
- **3:01** The bald boss sits at his desk with a bubble of a bed and a sleepy face. The player stands at a small wall switch in the hallway.
- **3:01** You used the switch and a sound plays. The boss's office goes dark and his bubble turns to "?".
- **3:05** The boss walks out to the hallway. A woman in teal walks past with a coffee bubble.
- **3:05** The boss sees the player at the switch and points with a "!".
- **End** The picture shows the boss pointing at the player next to the switch, with icons for boss, pointing hand and player.

**Why:** the player was caught standing at the switch. Turning his lights off brought the boss straight out. The player was still there, in his view.

**Maybe not a reaction:** the teal woman's coffee bubble at about 3:05 shows up in every run, so it's her routine. The boss's bubble keeps flipping between a bed and an alarm clock in all runs, so it's a routine too. Small issue: the caption says 3:06, but the picture's clock says 3:05.

## Run 5: win at 3:40
- **3:04** You used the coffee machine in the kitchen.
- **3:05–3:09** The teal woman thinks about coffee and walks to the kitchen. The player goes back to the middle desk.
- **3:11** Sparks run along the wall from the grey box by the left door. The teal woman is at the coffee machine looking shocked.
- **3:11** Blackout. People switch on flashlights, and the boss and the man in green both show "?".
- **3:14** The boss goes to the grey box. The man in green has a wrench bubble. The player slips into the boss's office.
- **3:15** You took the envelope from the tray (it now shows in the hand slot).
- **3:18** You used your own desk and your hand is empty again. The letter seems to be left there.
- **3:23–3:29** The boss and the man in green work at the box. The teal woman looks glum. The lights come back.
- **3:40** The boss wakes up and finds his tray empty.
- **End** The picture shows the boss puzzled ("?") at an empty tray, a smoking coffee machine, and the player with the envelope on their desk. The icons are teal woman, coffee, lightning and envelope.

**Why:** the letter was gone when he checked. The win came from taking it during the blackout. The icons hint that the player's 3:04 move at the coffee machine set off the blackout. But we never see a loop where the player skips the machine and is still around at 3:11. So "she makes coffee and the power trips" could just be the afternoon's schedule.

**Maybe not a reaction:** the teal woman's coffee trip, and the boss's bed/alarm-clock bubbles.

## Run 6: win at 3:40
- **3:01–3:15** Same as run 5: coffee machine at 3:04, blackout at 3:11, letter taken at 3:15.
- **3:23** The player stands by the kitchen-side desk in the dark and keeps the letter in hand.
- **3:29** The lights come back. The player is still in the kitchen.
- **3:31** The teal woman walks right past the player with no reaction.
- **3:34–3:39** The player waits. The boss stirs.
- **3:40** The player cheers.
- **End** Same picture as run 5 (puzzled boss, empty tray), but the player is holding the letter.

**Why:** same as run 5. The tray was empty, and keeping the letter in hand was fine.

**Odd:** the teal woman passes next to someone clearly holding the boss's letter and shows nothing. Maybe the letter just doesn't look suspicious, or maybe her view didn't cover the player. I can't tell which.

## Run 7: loss at 3:25
- **3:01–3:15** Same as runs 5 and 6, and the letter is taken at 3:15.
- **3:23** The player is still in the dark office by the tray, holding the letter. The boss and the man in green are at the grey box.
- **3:25** The lights come back. Someone comes in at the office door with a bubble of an envelope and "?". It looks like the boss.
- **3:25** That person points at the player with a "!".
- **End** The picture shows the boss angrily pointing at the player, who is at his desk holding the envelope. The icons are boss, pointing hand and player.

**Why:** the player stayed in the boss's office after the power came back and was caught there with the letter. Taking the letter wasn't the mistake, since it worked in runs 5 and 6. Staying in the office was.

**Maybe not a reaction:** the envelope-and-"?" bubble came up before the "!". It may be the boss coming back to think about his tray, not a reaction to seeing the player. Also, the two people coming back to the doorway are hard to tell apart.

### 1-read-3: reading.md

# reading.md: Second Thoughts (runs 8–11)

## Run 8: LOSS
- 3:01 You stand in the open office. The boss is at his desk, with an envelope in his tray.
- 3:03 You're at the kitchen coffee machine and a sound ring goes off under you. The spiky-haired man in the green jacket shows "💦?" and an eye.
- 3:04 He shouts a starburst "! 👉 you". A dotted line runs from him to a small panel on the wall.
- 3:05 The boss's bubble shows a paper or phone icon, then 👉 you.
- 3:09–3:36 You sit at your desk next to a tall stack of paper.
- 3:40 The boss reads the envelope (✉️😠). You end up in front of him looking miserable (😩).
- End picture: the green-jacket man points at you, buried in paper. Icons: him 👉 paper stack.

**Why it was lost:** I can't tell. The boss read the letter and looked angry, which fits the card's threat. But the end picture blames the coworker who reported you and the paperwork.

**Your actions:** There is no "used the thing" marker. Whatever made the noise at the coffee machine started all this, but I can't see what it was.

**Maybe not reactions:** The teal woman's ☕ thought and her coffee trip from 3:09 to 3:31 also happen in run 9, so they're her routine. The boss's 😴 bubbles happen every run.

## Run 9: WIN (⚡ slot filled)
- 3:03 You use the wall box by the left door and the lights go out. The boss shows "?". The green-jacket man shows 🔧.
- 3:05 Flashlights come on. The boss leaves his office.
- 3:10 The boss and the green-jacket man are at the wall box. You're at the boss's desk.
- 3:11 You use the tray and the envelope appears in your hand slot.
- 3:14 The lights are back on. You're at your own desk, the envelope is lying on it, and your hand is empty.
- 3:40 The boss checks his tray. Party bubble 🎉 over you.
- End picture: the boss is puzzled (?) and the envelope sits on your desk. Icons: ⚡ green man 🔧 ✉️.

**Why it was won:** The letter wasn't in the tray at 3:40.

**Your actions:** Cutting the power, then taking the envelope.

**Maybe not reactions:** At 3:14 the green-jacket man passes your desk right after you put the envelope down. That's just his walk back from the box; run 11 has the same walk. The teal woman's "?" at the coffee machine is probably about the dead machine.

## Run 10: LOSS at 3:07
- 3:05 You use the wall box and the lights go out. The boss shows "?" and three flashlights appear.
- 3:07 You're still standing at the box. The boss heads there with a "💡?" bubble.
- 3:07 He shouts a starburst "! 👉 you".
- End picture: the boss's flashlight on you next to the box. Icons: boss 👉 you.

**Why it was lost:** The boss found you at the box.

**Your actions:** Staying at the box after cutting the power.

**Maybe not reactions:** He walked over to fix the lights, not to look for you. Run 9 shows him making the same walk.

## Run 11: WIN (⚡)
- 3:03–3:11 Same as run 9: power cut, then you take the envelope.
- 3:16 Below your desk you use the thing. A white crumpled ball appears on the floor, your hand is empty, and your bubble is a green sick face 🤢.
- 3:16–3:40 The ball stays in the aisle and nobody reacts to it.
- 3:40 Party bubble 🎉.
- End picture: the boss is puzzled (?) and you're green-faced. Icons: ✉️ 🤢 boss ❓.

**Why it was won:** The tray was empty at 3:40.

**Your actions:** The power cut, taking the envelope, and getting rid of it.

**Unclear:** Did you eat the letter or crumple and drop it? The green face says you ate it. The ball on the floor says you dropped it. Both wins fill the same ⚡ slot, so the game seems to credit the power cut, not how you got rid of the letter.

### 1-read-4: reading.md

# Reading: Second Thoughts

**Card:** It's 3:00 PM and your angry resignation letter is in the boss's tray. He checks the tray at 3:40, and you have to keep your job.

## Run 12: Loss, 3:03 PM

**Beats**
- **3:01:** The boss sits at his desk in the top-left glass office with a thought bubble showing a bed and a sleepy face. A letter is in his tray. You're in the open office below, already inside the edge of his yellow sight cone, and nothing happens. Two coworkers sit at their desks with yellow cones.
- **3:03:** You're inside his office, right next to the tray. His cone turns red and grows through the glass into the open office. A red "?" appears over his head and his bubble shows an envelope and a "?". Your hand slot is empty, so you never picked up the letter.
- **3:03:** His bubble becomes a starburst with "!", a pointing finger, and your face.
- **3:03:** The end picture shows the boss scowling at his desk with the letter in the tray and you reaching for it. The icons are boss, pointing finger, you. The three slots are empty.

**Why it ended:** The boss caught you at his tray, 37 minutes before he was due to read it. He never got to the letter.

**Which action caused it:** The captions never say "You used the thing here," so I can't confirm you did anything at all. All I can see is that you walked to his desk while he could see you. I can't tell whether walking up was enough or whether reaching for the tray set him off.

**Might not be a reaction to you**
- The envelope "?" could just be him thinking about his tray on his own schedule.
- The sleepy bubble suggested he was dozing, but his cone stayed on the whole time. I can't tell what the bubble meant or whether he actually woke.

### 2-compare: report.md

Verdict: fixable

## Runs
- **Run 1: do nothing → fail.** `explained`. "The boss read the letter at 3:40… Player's cause: doing nothing."
- **Run 2: do nothing, Lin's machine only flickers the lights → fail.** `explained`. The reader names the right loss and cause. But this run was meant to teach that the machine strains the wiring, and the reader saw none of that: "Run 1 and Run 2 are identical, frame for frame." See beat B1.
- **Run 3: switch, walk off, take it → win.** `explained`. "Taking it at 3:07. That only worked because the 3:01 panel press made the boss leave his office."
- **Run 4: switch and stay at the panel → caught.** `explained`. "The player was caught standing at the switch."
- **Run 5: pour into the machine's vent, blackout, take it → win.** `partly`.
  - Reading: "The icons hint that the player's 3:04 move at the coffee machine set off the blackout. But we never see a loop where the player skips the machine and is still around at 3:11. So 'she makes coffee and the power trips' could just be the afternoon's schedule."
  - What happened: at 3:04 the player poured the water jug into the back vent. The water shorted the machine when Lin switched it on at about 3:10. Runs 1 and 2 are the loops the reader asks for: no pour, and the fuse holds.
  - Visual cause: missing cue, plus cause and effect too far apart. In 05/02.png nothing shows a pour: no jug tipping, and the jug isn't visibly empty. The no-pour flicker falls between the 3:09 and 3:11 frames in runs 1 and 2, so its only trace is Lin's 😳 and Kev's ❓.
  - Fix: after the pour, leave the jug lying empty on its side and add a drip puddle behind the machine that stays until 3:10. In no-pour loops, make the flicker last long enough to see, with a ⚡ bubble over the machine itself.
- **Run 6: blackout, take it, wait in the kitchen → win.** `partly`. The reader says "Why: same as run 5", so it inherits run 5's doubt about whether the pour caused the blackout. Same fix. They did get this run's own point right: "keeping the letter in hand was fine."
- **Run 7: blackout, wait in his office with it → caught.** `explained`. "The player stayed in the boss's office after the power came back and was caught there with the letter." The reader still doubts who caught them (beat B4).
- **Run 8: pour from the front of the counter → Kev sees → desk work → fail.** `unexplained`.
  - Reading: "Why it was lost: I can't tell… Whatever made the noise at the coffee machine started all this, but I can't see what it was."
  - What happened: the player poured from the front of the machine, inside Kev's view through the kitchen door. Kev shouted and reported them to the boss. The boss gave them paperwork, so only a splash went in. The machine brewed as usual, nothing blacked out, and the letter was still in the tray at 3:40.
  - Visual cause: a missing cue and a misleading line.
    - The pour can't be seen: no tipping jug, and no "used the thing" line, because the shout cut the action off.
    - Kev's dotted "report" line runs to the hallway lighting panel (08/04.png, ≈557,287), not to the boss or the player.
    - The end card shows only Kev 👉 paperwork. It never shows the loss that actually happened, the boss reading the letter.
  - Fix:
    - Draw the player tipping the jug at the counter, with a 💦 bubble, at the moment Kev's cone turns red.
    - Run Kev's line to the boss's office, then the boss's 📄👉 to the player.
    - On the end card, put the boss reading the letter in the background, with icons Kev 👀 💦 📄 ✉️😠.
- **Run 9: breaker, step away, take it → win.** `explained`. "Cutting the power, then taking the envelope."
- **Run 10: breaker, stay at the box → caught.** `explained`. "Staying at the box after cutting the power."
- **Run 11: breaker, eat the letter → win.** `explained`. "The power cut, taking the envelope, and getting rid of it." The reader can't tell whether it was eaten or dropped (beat B5), but that didn't affect the cause.
- **Run 12: reach for it in the light → caught.** `partly`.
  - Reading: "I can't tell whether walking up was enough or whether reaching for the tray set him off." Also: "already inside the edge of his yellow sight cone, and nothing happens."
  - What happened: reaching for the tray while he can see you is the trigger. Simply standing in his view is not.
  - Visual cause: missing cue. 12/02.png shows no reaching pose or grab marker, and the caption has no "used the thing" line.
  - Fix: in the frame where his cone turns red, draw the player's arm stretched toward the tray with a ✋ over it.

## Beats that misled the reader
- **B1. The flicker that runs 1 and 2 were meant to teach was never seen** (runs 1, 2, 3).
  - Reading: in run 1, "At the coffee machine she shows 😳. A man in green on the right shows ❓", which the reader files as routine with no clear cause. In run 3: "For this one frame the whole office is greyed out, and I can't tell why."
  - What happened: this is the lights flickering when Lin switches on the old machine. It happens every loop and is the key fact behind the blackout route. In run 3 the reader saw it right after the player used their desk, so it could read as caused by the player.
  - Visual cause: missing cue. The flicker is too short to catch, so the 😳 and ❓ look like reactions to nothing.
  - Fix: hold the flicker for a few seconds, and put a ⚡ bubble over the machine as well as Lin's 😳.
- **B2. Run 8: Kev's dotted line points at the lighting panel.**
  - Reading: "A dotted line runs from him to a small panel on the wall."
  - What happened: Kev was reporting the player to the boss.
  - Visual cause: the line ends on the wrong object, so it reads as Kev blaming the lights.
  - Fix: end the line on the boss.
- **B3. Run 8: the end card and the actual ending don't match.**
  - Reading: "The boss read the envelope (✉️😠)… But the end picture blames the coworker who reported you and the paperwork."
  - Visual cause: cause and effect too far apart. See run 8's fix.
- **B4. Run 7: who caught the player?**
  - Reading: "It looks like the boss… the two people coming back to the doorway are hard to tell apart."
  - What happened: the boss walked back with Kev, and the green-jacket shape overlaps him at the door (07/11.png, 07/12.png). The end card shows the boss.
  - Visual cause: an emoji standing in for a person. The ✉️❓ and ❗ bubbles sit over a pile of two people.
  - Fix: have Kev stay at the fuse box for a few seconds, so the boss walks back alone.
- **B5. Run 11: the pulp looks like a dropped letter.**
  - Reading: "Did you eat the letter or crumple and drop it?"
  - What happened: the player chewed the letter and spat it out.
  - Visual cause: missing cue. The pulp is drawn as a white crumpled ball, while ways.md calls for a soggy grey wad, and no chewing is shown.
  - Fix: show a chewing bubble (😬 plus a paper scrap) while E is held, and draw the wad grey and wet with a drip.
- **B6. Run 6: Lin walks past the player holding the letter.**
  - Reading: "Maybe the letter just doesn't look suspicious, or maybe her view didn't cover the player. I can't tell which."
  - What happened: this is the rule that out on the floor an envelope is just an envelope. It's real, but never shown.
  - Visual cause: missing cue.
  - Fix: let her glance at it, then go back to her ☕ bubble, so it's clear she saw it and didn't care.
- **B7. The boss's sleepy bubble** (runs 1 and 12).
  - Reading: "The sleepy bubble suggested he was dozing, but his cone stayed on the whole time."
  - What happened: the bubble only means he's waiting for 3:40. His sight never turns off.
  - Visual cause: a bubble that hints at a route that isn't there (wait for him to doze off).
  - Fix: replace 🛋️😴 with a bored look at the clock (⏰🥱), and keep his eyes visibly open.

## Earlier problems
- E1: no longer applies. No run here takes the letter from the front of his desk, and the reader didn't link timing to the theft.
- E2: fixed. The dark now draws a small ring around the boss plus his beam (05/07.png), and the reader never wondered why a nearby theft went unseen.
- E3: still there (blocker). The paper stack and Kev's own end card were added, but the reader still writes "Why it was lost: I can't tell." The report doesn't reach the boss, and the end card leaves out the real loss.
- E4: still there (should). At 3:40 the player still jumps from their desk (😬) to his doorway (😩) with no summons: "the player didn't walk there." It no longer misleads about a cause.
- E5: still there (should). Using the desk now leaves the letter lying on top of it, not in a drawer, and the reader writes "I can't tell whether putting it on their own desk at 3:10 mattered."
- E6: fixed. The reader now reads Lin's ❓ as being about the dead machine, not the player.

## Problems
- blocker: The pour into the coffee machine can't be seen (run 5's 3:04 action leaves no visible change), so the blackout-route win is only partly explained — draw the tipped, empty jug and a drip puddle behind the machine that stay until it shorts.
- blocker: The flicker in no-pour loops is never seen, so runs 1 and 2 can't show that the machine strains the wiring, and the reader can't tell the pour from the afternoon's schedule — hold the flicker for several seconds with a ⚡ over the machine.
- blocker: Run 8's pour from the front has no visible action (no jug tipping, no "used" cue), so the reader can't name what Kev saw — draw the jug tipping with a 💦 bubble as Kev's cone turns red.
- blocker: Kev's dotted report line in run 8 ends at the hallway lighting panel, not the boss, so it reads as Kev blaming the lights — end it on the boss's office and follow it with the boss's 📄👉 to the player.
- should: Run 7's catch happens at the doorway with the boss and Kev overlapping, so the reader can't tell who caught them — keep Kev at the fuse box a few seconds longer so the boss walks back alone.
- should: Run 12 has no visible reach, so standing in his view and reaching for the tray look the same — show the arm stretched to the tray with a ✋ in the caught frame.
- should: The boss's 🛋️😴 bubble suggests he dozes, but his sight never turns off, which points at a route that doesn't exist — use ⏰🥱 and keep his eyes open.
- should: The chewed letter is drawn as a clean white ball, which reads as a dropped envelope (and a boss would pick that up) — show chewing while E is held, and draw the wad grey and wet.
- should: Lin ignoring the letter in the player's hand on the open floor looks like a blind spot, not a rule — let her glance at it and go back to her ☕ bubble.

<!-- /cold-read:replay -->
