# Cold reads: second-thoughts
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

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

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"ce498d6","hash":"37a116766a877f3bb2bcfd6145d146d125dd6261cd8afa2117d0a602a99e7f7a","parts":{"card":"12cd9b06c0e80425053b9a559213be241018f2e6ec2bcf8929d4fb6a9c05fabb","premise":"ce1ee358ca3daeb85fb78598f4b0d2c09ce7d237d1a5b029c93101bf5175da47","prompts":"e810e9318a4aa5a21d9654564c23dd898975d90252af2744b888b19de97df7bd"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit ce498d6, by claude -p (model: default). Inputs 37a116766a87: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 13 s | $0.02 |
| 2-review | report.md | 132 s | $0.50 |
| all | | 145 s (the steps add up to 145 s) | $0.52 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM. I wrote an angry resignation letter and it's already in the boss's tray. He goes through his tray at 3:40, so I have 40 minutes.

**My goal:** Get the letter back before 3:40, or destroy it, or swap it for something else. The card never says this. I'm guessing it from the name.

**If I fail:** The boss reads it. Maybe I'm out of a job, or maybe there's a nasty scene.

**Questions:**
- What does "goes through it" refer to? It could mean the tray (he sorts the whole pile) or my letter (he reads it carefully). Those make for different deadlines and risks.
- The name could mean I regret writing the letter, or the boss has doubts, or it's simply my second try.
- What do the icons mean? "✉️ @boss" reads like "send the letter to the boss," which is the opposite of the goal.
- Is just removing it enough, or do I need to put something else in its place?
- Is the tray in his office? Is he there?
- Is 3:40 fixed, or can I make him start earlier or later?
- Is the letter easy to spot, like the only envelope or a giveaway colour?

### 2-review: report.md

Verdict: fixable

**1. The blackout hands you the win on loop one, so the other two routes have no purpose.** At 3:10 Lin's coffee machine blows the fuse in every loop, even if you do nothing (`cast.js:34`). The dark lasts about 8 game minutes. A first-time player sees the lights go out, walks to the side of the desk (`desk_side`) and takes the letter. The light switch and the breaker do nothing the free blackout doesn't already do. The level's idea, that the dark shrinks sight, gets handed over instead of found. *Fix:* when Lin switches the machine on, the lights should only flicker for a second while Kev glances at the fuse box. That shows the link but doesn't give you 8 minutes of dark. The player then has to cause the blackout.

**2. The boss stares at the tray for 40 minutes and never reads the only envelope in it.** He does nothing else all afternoon (`cast.js:21`). His habit of living by the clock is never shown on screen. A player's first question is "why doesn't he read it now?" *Fix:* give him something to do in his chair, like typing or a phone call, with the tray beside him. Mark 3:40 with a visible ritual, such as a desk-clock chime, so the deadline reads as his habit.

**3. In the blackout, his torch guards the tray for no reason the player can see.** He keeps his beam on the front of his desk. That creates a blind spot beside the tray only because the puzzle needs one. It also contradicts `premise.md` ("he never knew it existed"), and the joke relies on him guarding the tray anyway. The joke also isn't in the end picture: the blackout win card shows 3:40 with the lights on, the boss holding an empty tray and you at your desk (`end-scenes.js:269`), which is the obvious version. *Fix:* have him point the torch at the door, looking for whoever did it. Then the dark beside him is a natural blind spot. Make the win card show the tray swept by his torch, empty, with the envelope in your hand just outside the beam.

**4. Taking the letter makes a rustle right next to him, and he never reacts.** `take_letter` plays a rustle at `desk_side`, two tiles from his chair (`presentation.js:83`), but it has no `noise`. Meanwhile, the switch's quieter clack is a noise. Players who have learned that noises turn heads will expect to be caught and will stop trying this. *Fix:* make the take silent, or give it a noise radius smaller than his distance and show it with a small sound icon he doesn't hear.

**5. The card and badge leave the second reader guessing.** "He goes through it" could mean the tray or the letter. The badge "✉️ @boss" reads as "send the letter to the boss", the opposite of the goal. The reader also didn't know whether removing the letter is enough. Nothing on the card points to a route, so the card itself is fine. *Fix:* write "He goes through his tray at 3:40." For the badge, use something like ✉️ @boss 📦, which names the trouble.

Checked and sound: the losses each have a visible cause. The breaker stays out of the boss's sight because the south-west wall blocks it. The win doesn't depend on where you stand, which matches "nobody knew."

**Best thing:** the office goes dark, the boss raises his phone torch, and you lift your envelope from the dark at arm's length from him.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"ce498d6","hash":"700784577ab304c48b0b83deb86024b33145f98dd7413496447c2706f1f604d5","parts":{"card":"12cd9b06c0e80425053b9a559213be241018f2e6ec2bcf8929d4fb6a9c05fabb","shots":"6190981fa3f36516ac578155ec7ac0377435b75b31410647e314712a6c148b78","pictures":"87c60749e0e847afd2715dc960737e81ffb6b77be0ba30d25f9350108067e05f","prompts":"0f4c15900c099f5904f137558b6d30e5162ed82f745deb4d44932fc0b3a61537"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit ce498d6, by claude -p (model: default). Inputs 700784577ab3: the card, shots.js, the rendered shots, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 78 s | $0.43 |
| 2-compare | report.md | 137 s | $0.60 |
| all | | 215 s (the steps add up to 215 s) | $1.03 |

### 1-read: reading.md

I've looked at all 23 shots. Here is the reading.

---

# Second Thoughts: cold read

**01** (3:00): Red-haired woman (me, red ring) sits at the centre desk. A bald boss in a suit sits in the glass office at top-left, with an envelope in his desk tray. A woman in teal and a spiky-haired man in green work at desks. *I'm being told where the letter is and who's watching it.* The HUD shows a clock, an envelope with a face, an empty hand slot and three empty boxes.

**02** (3:02): I'm next to the boss's desk with the tray highlighted and an E prompt, inside his red cone. A tiny "?" floats over a dark bar on the top wall. *Grabbing it right in front of him looks like a bad idea.* I can't read that bar.

**03** (3:04): I'm in the office's top-left corner, at a small highlighted wall plate. The teal woman has motion lines on her head. *The plate is probably a light switch.* I can't tell what the motion lines mean: sneeze? head turn?

**04** (3:03): I'm at a yellow hazard box on the corridor wall, with an E prompt. *Something electrical I can use.*

**05** (3:08): The teal woman leaves her desk and walks up, with a clock bubble. *She has a routine.* The clock bubble could mean "break time" or "late."

**06** (3:04): The boss's office is dark except a desk-lamp cone. The boss has a big "?" bubble, and I'm a red silhouette by the switch. *Darkness narrows his sight. Good.*

**07** (3:05): I'm creeping along the dark office's left wall while the boss stays puzzled under his lamp.

**08** (3:05): The boss turns and sweeps a phone light to the right, with a "?" over a small face. *The dark isn't safe forever.*

**09** (3:07): **The hand slot now shows the envelope.** The boss has walked to the switch, and I'm at his desk. A white bubble with a yellow centre sits over the desk. *His trip to the switch gave me the opening.* The bubble looks like a fried egg or a flower. I can't read it.

**10** (3:05): The boss reaches the switch first, and his red cone catches me there. *Timing loss.*

**11** (3:10): The whole floor is dark, and the hazard box became a red-lit panel. The teal woman is at a steaming coffee machine, the green man has a "?", and the boss uses his phone light. *Killing the power affects everyone.*

**12** (3:12): Still dark. The boss is back under his lamp, and the green man wanders with a light toward me.

**13** (3:14): I have the envelope and I'm beside the boss in the dark, with the egg bubble again. The green man is at the panel with a flashlight. *Power is about to return.*

**14** (3:04): Power is out. I'm at the panel, the teal woman holds up a phone light, and the green man has a "?".

**15** (3:09): The tray is prompted and the boss's lamp points down. The green man is heading to the panel. *The window is closing.*

**16** (3:07): I'm at the panel, glowing red. The green man's cone turns the glass doors red, with a "?". *Nearly spotted.*

**17** (3:41, teal frame = win): The boss is puzzled under his lamp while I sit at my desk holding the envelope. Icons: bulb, boss, ?, envelope. The first box gets a bulb. *Lights-off route.*

**18** (win): Coffee machine. Icons: teal woman, coffee, burst, envelope. The second box gets an **hourglass**. *Coffee route.* The burst and hourglass don't add up for me. Spill? Delay?

**19** (win): Breaker box. Icons: lightning, green man, wrench, envelope. The third box gets lightning. *Power-cut route; he fixes it.*

**20** (3:41, red frame = loss): The boss reads the letter, fuming, with my face in his burst. I'm walking away sweating. Icons: boss, envelope, angry face, cardboard box. *I'm out. Is the box "fired" or "I quit"? Either way, funny.*

**21** (3:04, loss): The boss catches my hand in the tray with an "!". Icons: boss 👉 me.

**22** (3:06, loss): Same icons, but in the dark: his phone light lands on me.

**23** (3:23): I'm holding a coffee cup (hand slot) with E pointed at the teal woman by the machine. *Setting up the coffee route*, but it's unclear what I'm meant to do with her.

---

**Story:** I fired off an angry resignation letter and now regret it. The boss reads his tray at 3:40, so I have to get the letter back unseen. Darkness is my friend: flip his switch, cut the floor's power, or use the coffee somehow. Each trick pulls a different coworker into the scene. Fail, and I'm caught red-handed, or I walk out carrying a cardboard box.

**Editor's flags:** The egg bubble and the hourglass/burst on the coffee win card are unreadable. The coffee route is the only one I couldn't piece together from the shots.

### 2-compare: report.md

Verdict: fixable

The switch route and the breaker route mostly come through. The coffee route doesn't. The player sees the coffee machine and the blackout at 11 but never links the two. The 18 win card can't explain it after the fact, and 23 adds a prompt that points nowhere. Separately, the "caught at the fuse box" loss (16) reads as a near miss. Two shots that matter to a route are misread, so the verdict is fixable, not works. It isn't broken: two of the three routes read from these pictures.

---

**01 — reads.** The player finds the letter, the boss and the clock. The boss facing his desk comes through.

**02 — reads.** "Grabbing it right in front of him looks like a bad idea" is the whole point. One cosmetic problem: the red "?" over the dark bar on the top wall. That bar is unexplained, and it shows up again in 10 and 22. Cut it, or make it a ceiling tube.

**03 — reads.** "The plate is probably a light switch" is right, and the player is behind his chair and outside his cone. The motion lines on Lin's head are noise that the intent doesn't call for. The player asks "sneeze? head turn?" and the shots never answer.

**04 — partly.**
- Reading: "a yellow hazard box on the corridor wall… Something electrical I can use."
- Intent: a grey fuse box with its door shut and a green lamp lit, around a corner where the boss can't see it.
- Cause: a glyph used as a prop. The ⚠ sticker stands in for "fuse box", and there's no green lamp to set up the later change to red. The box also sits right under the boss's glass office, next to the spill of his cone, so "out of his sight" never comes across.
- Fix: draw a grey box with a visible door seam and a bright green lamp. Move it, or the cone, so the box is clearly outside the boss's sight.

**05 — partly.**
- Reading: "She has a routine. The clock bubble could mean 'break time' or 'late.'"
- Intent: Lin leaves her desk *for the old coffee machine in the kitchen*.
- Cause: a missing cue. The ⏰ bubble says "it's time" but not "time for what", and the frame catches her in the corridor, far from the machine.
- Fix: give her a ☕ bubble instead of the clock, and frame her heading through the kitchen doorway toward the machine.

**06 — partly.**
- Reading: "dark except a desk-lamp cone… Darkness narrows his sight."
- Intent: he holds up his phone, and its beam starts at the glow in his hand.
- Cause: the beam is a wide cone pointing down at the desk and the phone is a speck, so it reads as a desk lamp. That matters later: in 07, 12 and 17 the player keeps calling it "his lamp", which hides the fact that the light moves with him. The switch's amber lamp isn't mentioned either.
- Fix: draw a bright white phone held up in a raised hand, with a narrower beam starting at the phone. Give the switch a clear amber dot.

**07 — reads.** The player gets the idea of hiding in the dark outside the beam. One gap: the intent says "as he gets up", but he's still seated in the shot. The "lamp" problem is covered under 06.

**08 — partly.**
- Reading: "The boss turns and sweeps a phone light to the right… The dark isn't safe forever."
- Intent: he gets up and turns *for the switch*, and his beam swings east, *away from you*.
- Cause: the cause and effect are too far apart. The beam points east while the switch is in the west corner, so nothing says where he's going. The player reads a threat, not an opening.
- Fix: have him take a step toward the switch with the beam trailing behind in a swing arc. Or give him a bubble with a small switch icon.

**09 — partly.**
- Reading: "His trip to the switch gave me the opening. The bubble looks like a fried egg or a flower."
- Intent: the tray is empty, the letter is in your hand, he's at the switch with his beam on it, and the tubes blink.
- Cause: the take reads. The white-and-yellow bubble over the desk doesn't. It's an unreadable glyph, and the tube blink doesn't come through at all.
- Fix: remove the egg bubble. Show the blink on the actual ceiling tubes (a flicker flash on the strip lights), and draw the empty wire tray clearly.

**10 — reads.** "His red cone catches me there" is right. "Reaches the switch first" suggests the player thought they were racing him, but the lesson lands.

**11 — misread.**
- Reading: "The teal woman is at a steaming coffee machine… *Killing the power affects everyone.*"
- Intent: Lin switches on the coffee machine, it sparks and smokes, and that blows the fuse for the whole floor.
- Cause: the cause and effect are too far apart, and the cue is wrong. The smoke reads as normal coffee steam, there's no spark, and the machine (far top-right) and the fuse box (far left) are at opposite ends of the screen. The player sees a blackout with no cause. This is the setup for the whole coffee route.
- Fix: put a big ⚡ spark burst and a dark grey puff on the machine, and give Lin a startled bubble (😳⚡). Run a beat of flicker from the machine toward the fuse box as the lights die.

**12 — partly.**
- Reading: "the green man wanders with a light toward me."
- Intent: Kev walks his torch to the fuse box. The boss stays in his chair.
- Cause: a missing cue. Nothing shows where Kev is going, and his beam sweeps toward the player. The player only works it out at 13.
- Fix: give Kev a 🔧 bubble, or one showing the fuse box, and point his beam down the corridor toward the box.

**13 — reads.** The take in the dark, out of the beam, with power about to come back. The egg bubble appears again (see 09).

**14 — reads.**

**15 — reads.** "The window is closing" is right.

**16 — misread.**
- Reading: "The green man's cone turns the glass doors red, with a '?'. *Nearly spotted.*"
- Intent: Kev arrives and *finds you* at the fuse box, and he will tell the boss you pulled it.
- Cause: a missing cue. The red "seen" tint lands on the glass doors, not on the player. The bubble is "?" not "!", and nothing connects Kev to the boss. A loss reads as a near miss.
- Fix: put the red tint and a "!" on the player, and give Kev a 👉 bubble pointing at the boss's office.

**17 — reads.** The player names the lights-off route. Nobody mentions the empty tray, but the joke lands.

**18 — partly.**
- Reading: "Coffee route. The burst and hourglass don't add up for me. Spill? Delay?"
- Intent: the blackout win, with the coffee machine that blew the fuse behind you.
- Cause: glyphs used as props. 💥 doesn't say "short circuit", and the ⌛ slot icon has nothing to do with this route. Because 11 already failed, this card is the last chance to explain the route, and it doesn't.
- Fix: change the icon row to Lin ☕ ⚡ ✉️, using the same ⚡ the breaker route uses. Make the slot icon ☕⚡, and add a scorch mark on the machine in the picture.

**19 — reads.**

**20 — reads.** "Is the box 'fired' or 'I quit'? Either way, funny." Leave it ambiguous.

**21 — reads.**

**22 — reads.**

**23 — partly.**
- Reading: "Setting up the coffee route, but it's unclear what I'm meant to do with her."
- Intent: power is back and the machine works (green lamp, full pot), and you've just poured a cup.
- Cause: a missing cue plus a misleading prompt. The E prompt hangs over Lin, so the player expects to do something with her. The green lamp and full pot are too small to notice.
- Fix: drop the E prompt from Lin, or move it to the machine. Make the brew lamp a big green dot with steam rising from a full pot.

---

**Editor's note:** the player made up a better premise than the cards needed: "I fired off an angry resignation letter and now regret it." The three routes are clear in principle, and the loss jokes (the cardboard box, being caught red-handed) land. The fixes that matter most are 11 and 16. After those, 06 (draw the phone as a phone) and the stray glyphs (the egg bubble, the hourglass, the dark bar) are cheap clean-ups.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"ce498d6","hash":"f091db7afb387c6fa1ae24edb9e8d3e5af455b8fe350e8f82b92705586f8e672","parts":{"card":"12cd9b06c0e80425053b9a559213be241018f2e6ec2bcf8929d4fb6a9c05fabb","checks":"c8beb5ad3e5c254618bd46c6d25b52e35298d3a3895af68939483f54cff785d1","ways":"4a13a3c2427e93d7e9666f19db8911c6889bcf8779c369b521aeef7d3595d9ec","frames":"44df214d81a7e70c9b76689991c4ffeeb1ba684052137a01ee610e298fc765a9","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit ce498d6, by claude -p (model: default). Inputs f091db7afb38: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 159 s | $0.70 |
| 2-compare | report.md | 89 s | $0.31 |
| all | | 248 s (the steps add up to 248 s) | $1.01 |

### 1-read-1: reading.md

# Second Thoughts: cold read

**Patterns seen across runs (these happen whatever the player does):**
- At 3:10 the coffee machine smokes and the whole office goes dark. The kitchen woman shows a 😳 bubble and the man in green shows a "?". This happens even in Run 1, where the player does nothing.
- Some time after a blackout, the man in green walks to the fuse box on the left wall and the lights come back.
- At 3:38 the boss shows a ✉️😠 bubble if the letter is still in his tray.
- At 3:40 in the losing runs, the player is suddenly standing at the boss's desk without having used anything there, and a crumpled paper is lying by the player's desk. I can't tell what that paper is.

---

## Run 1: Loss
- 3:10 Dark office. The man in green has a "?" bubble.
- 3:10 The kitchen woman shows 😳. The boss's desk lamp is on.
- 3:38 Lights are back. The boss shows ✉️😠. The player is at their desk.
- 3:40 The player is at the boss's desk and the boss shows 😅. A crumpled paper is on the floor.
- 3:41 End picture: the boss holds the letter, angry. Icons: boss, ✉️, 😠, 📦.

**Why:** the letter was still in the tray at 3:40, so the boss read it.
**Cause:** the player did nothing. No action is marked in this run.
**Might not be a reaction:** every bubble here is routine. The walk to the boss at 3:40 looks automatic.

## Run 2: Win
- 3:04 The player uses the switch in the boss's office. That room goes dark, there's a sound, and the boss shows "?".
- 3:08 The boss has walked to the switch and shows 😠, and his light is back on. The player is by his desk holding an envelope (it's in the hand slot) and shows 😊.
- 3:10 The player uses their own desk. The office goes dark.
- 3:10 The kitchen woman shows 😳.
- 3:40 Confetti for the player, and a lightbulb icon is earned.
- 3:41 End picture: the boss has nothing to read and shows "?". The player holds the letter.

**Why:** the letter was gone from the tray.
**Cause:** turning off his light sent the boss to the switch, and while he was there the player took the letter.
**Might not be a reaction:** the 3:10 blackout came right as the player used their desk, but Run 1 shows it's scheduled. I can't tell what using the desk did. Also at 3:08, a woman with a clock bubble walks the corridor. That looks like her routine.

## Run 3: Loss
- 3:04 The player turns off the boss's light and makes a sound. The boss shows "?".
- 3:05 The boss walks to the switch carrying a phone light. The player is still standing there.
- 3:05 The boss shows "!😠".
- 3:06 End picture: the boss's phone light is on the player. Icons: boss 👉 player.

**Why:** caught standing at the switch.
**Cause:** the player stayed at the switch instead of leaving.
**Might not be a reaction:** the woman walking the corridor is probably on her routine.

## Run 4: Win
- 3:10 Routine blackout. The player is at their desk.
- 3:15 The player takes the letter in the dark (envelope in hand) and shows 😊. The boss's phone light points away to the left. The man in green walks past with a flashlight.
- 3:17 The player uses their desk. The man in green is at the fuse box.
- 3:40 Confetti and an hourglass icon.
- 3:41 End picture: the boss shows "?". Icons: kitchen woman, ☕, 💥, ✉️.

**Why:** the letter was gone.
**Cause:** taking it at 3:15, while the boss faced away.
**Might not be a reaction:** the end icons credit the coffee blackout, not the player. Run 5 shows the 3:17 desk action wasn't needed.

## Run 5: Win
- 3:10 Routine blackout.
- 3:15 The player takes the letter. Same setup as Run 4.
- 3:40 The player is at a desk in the kitchen, with confetti and an hourglass icon.
- 3:41 The end picture is the same as in Run 4.

**Why/cause:** taking the letter at 3:15. Where the player ends up doesn't seem to matter.

## Run 6: Loss
- 3:10 Routine blackout.
- 3:13 The player reaches the boss's desk. The boss's phone light is pointing at the desk and he shows "?". A red sight line runs from him to the player.
- 3:13 The boss shows "!😠".
- 3:14 End picture: caught at the tray.

**Why:** seen by the boss.
**Cause:** arriving at 3:13 instead of 3:15. In Run 4 his phone light had swung away by 3:15, so the timing seems to matter. No action is marked in this run.

## Run 7: Win
- 3:03 The player uses the fuse box. Everything goes dark.
- 3:07 The player takes the letter (envelope in hand) and shows 😊. The boss is right there with his phone light pointing down, but he doesn't react. The man in green and the woman walk the corridor with flashlights.
- 3:10 The player uses their desk. The man in green is at the fuse box. The coffee machine doesn't smoke this time, and the kitchen woman shows "?".
- 3:40 Confetti and a ⚡ icon.
- 3:41 End picture: the boss shows "?". Icons: ⚡, man in green, 🔧, ✉️.

**Why:** the letter was gone.
**Cause:** cutting the power at the fuse box, then taking the letter.
**Can't tell:** why the boss didn't see the player at 3:07, when they were so close to him.

## Run 8: Loss
- 3:03 The player uses the fuse box. Everything goes dark.
- 3:07 The player is still at the fuse box. The man in green walks toward them with a flashlight and shows "?".
- 3:08 The player is near their desk. The man in green shows "!👉player", with a red line from him to the player. A paper is on the floor at the fuse box, and a red meter appears at the top right. The boss shows 📄📄👉🖥️.
- 3:10 The man in green restores the power. The kitchen woman shows "?".
- 3:38 The boss shows ✉️😠.
- 3:40 The player is at the boss's desk.
- 3:41 End picture: the same as Run 1.

**Why:** the letter was never taken.
**Cause:** the player didn't go for the letter. Being spotted didn't visibly change the ending, which is identical to Run 1. I can't tell what the boss's bubble, the paper or the meter mean.

## Run 9: Loss
- 3:03 Lights are on and the player walks up to the tray. The boss and the teal woman both show "?", and red sight cones cover the player.
- 3:03 The boss shows "!😠".
- 3:04 End picture: caught reaching for the tray.

**Why/cause:** taking the letter in full light, in front of the boss. No action is marked.
**Might not be a reaction:** the teal woman's "?" could be a reaction to the player, but I can't confirm it.

### 2-compare: report.md

I've read all three files and checked the run 6, 7 and 8 pictures and the 3:40 frame from run 1. Here is the report.

Verdict: fixable

## Runs

- **Run 1: do nothing → fail.** `explained`. The reader says the letter was still in the tray at 3:40 and the player did nothing. That is the real cause and the player's part. (The 3:40 frame still misled them; see beat 4.)
- **Run 2: switch → win.** `explained`. "Turning off his light sent the boss to the switch, and while he was there the player took the letter." That is the route as designed.
- **Run 3: switch, stay by it → caught.** `explained`. "The player stayed at the switch instead of leaving."
- **Run 4: blackout, take it beside his desk → win.** `explained`. "Taking it at 3:15, while the boss faced away." The reader linked the theft to where the phone beam pointed, which is the real rule.
- **Run 5: blackout, then the kitchen at 3:40 → win.** `explained`. "Where the player ends up doesn't seem to matter." That matches "nobody knew the letter was there."
- **Run 6: blackout, take it from in front of his desk → caught.** `partly`.
  - Reading: "Cause: arriving at 3:13 instead of 3:15. In Run 4 his phone light had swung away by 3:15, so the timing seems to matter."
  - What happened: the time didn't decide it. Where the player stood did. In 06/03.png the player stands at the front of the desk (≈175,195), right where his beam rests. In run 4 (04/03.png) they stand at the east end by the tray (≈208,172), which his beam doesn't reach.
  - Visual cause: two things changed between the runs, the beam's direction and the player's position. The reader picked the wrong one. Nothing shows that the front of the desk is always lit and the tray end is always dark.
  - Fix: keep the boss's beam fixed on the front of the desk during the blackout, with only a rare, clearly drawn glance to the east end. That way "front = lit, side = dark" looks the same every loop. Also make run 6's end picture show the beam pooled on the player at the front edge of the desk.
- **Run 7: breaker → win.** `partly`.
  - Reading: "Can't tell: why the boss didn't see the player at 3:07, when they were so close to him."
  - What happened: in the dark his sight shrinks to arm's length plus his beam. The player was at the dark east end, off the beam (07/02.png). The reader named the steps (breaker, then take the letter) but not why the theft went unseen. That rule is the whole point of the level.
  - Visual cause: missing cue. His shrunken sight in the dark isn't drawn. Only the beam is, so a player a step away looks like they should be seen.
  - Fix: when the lights go out, draw a small dim ring at arm's length around each person and fade out their daylight sight cone, so the player watches the cone shrink.
- **Run 8: breaker, hang about at the fuse box → desk work → fail.** `unexplained`.
  - Reading: "Cause: the player didn't go for the letter. Being spotted didn't visibly change the ending … I can't tell what the boss's bubble, the paper or the meter mean."
  - What happened: Kev found the player at the fuse box and told the boss. The boss assigned paperwork (📄📄👉🖥️), and the player was sent to their desk with a work meter. They were stuck there until the dark had passed, so they couldn't take the letter. Being spotted is the cause, and the reader explicitly rules it out.
  - Visual cause: cause and effect are too far apart. The catch is at 3:08 and the result at 3:41, and the end picture is identical to run 1's. The 📄📄👉🖥️ bubble is above the boss's desk, away from Kev and the player. Nothing ties it to Kev's "!👉" (both are in 08/03.png). The meter at the top right has no clear owner or meaning.
  - Fix: show the result on the player and in the end picture. Pin a paper stack to the player's desk with the meter above the player's head, draining. Give this loss its own end picture: the player buried in paperwork at their desk while the boss reads the letter, with Kev and 🔧 in the icon row.
- **Run 9: take it in full light → caught.** `explained`. "Taking the letter in full light, in front of the boss."

## Beats that misled the reader

1. **Run 6: "the timing seems to matter."** The real variable was position: front of desk vs. the east end. See Run 6 for the visual cause (two things changed between the runs, and the reader picked the wrong one) and the fix (fix the beam on the desk front so position is the only thing that changes).
2. **Run 7: "the boss is right there … but he doesn't react."** This is a real rule (sight shrinks in the dark) that the reader never sees. It's a missing cue. Fix: draw a shrinking arm's-length ring at the blackout, as above.
3. **Run 8: Kev's catch → paperwork.** A real reaction the reader missed. The reader writes "Being spotted didn't visibly change the ending." The cause is 30 minutes away from its effect, and the boss's bubble reads as his own routine, not a response to Kev. Fix: draw a brief line or speech bubble from Kev to the boss, then the boss's 📄👉 aimed straight at the player, and the paper stack landing on the player's desk.
4. **All losses at 3:40: "the boss shows 😅" / "the player is suddenly standing at the boss's desk" / "a crumpled paper … I can't tell what that paper is."**
   - What happened: the 😅 belongs to the player standing at the tray, sweating as the design says. In 01/04.png its tail points down at the player, not at the boss. The jump to his desk is the player being called in, but there's no walk or summons, so it reads as a glitch. The crumpled paper by the player's desk isn't explained anywhere in ways.md. It's noise that reads like a clue.
   - Visual cause: the emoji's owner is unclear, and a cue is missing (no summons).
   - Fix: at 3:38 show a 👉 bubble from the boss aimed at the player, then show the player walking over. Anchor the 😅 tail clearly on the player. Remove the crumpled paper or make it mean something.
5. **Runs 2, 4, 7: "The player uses their desk … I can't tell what using the desk did."** A player action with no visible result.
   - What happened: this is the "keep it out of his sight" step. In run 5 the letter stayed hidden without it, and the reader rightly called it unneeded there, so the action looks meaningless.
   - Visual cause: missing cue.
   - Fix: when the player uses their desk while holding the letter, show the envelope going into a drawer: the hand slot empties and a drawer icon appears.
6. **Run 9: "the teal woman's '?' could be a reaction to the player."** This is minor and didn't mislead them about the cause. Still, a witness who seems to react and then has no effect is a loose thread. Fix: either keep her routine bubbles away from the theft moment, or give her a visible part, such as turning toward the boss.

<!-- /cold-read:replay -->
