# Cold reads: audit
Written by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.

<!-- cold-read:sense {"verdict":"fixable","date":"2026-11-15","commit":"a9fdf89","hash":"7d7eef6e4217286b58e549191ff82728d6e2cc624df8c699d42b005489262b1b","parts":{"card":"b56071d2cde4a317ffe83d32db69fbe14abe0c6986c2f60fd2101491fe967647","ways":"878d1148ede4d2e399aefd6e9f4833c6d49bfea3d549fbdc73d96b6189acf9d7","prompts":"016aa683a72d416a002d56cc4d9abc6f52045f2ad4e6f1862e5593ed8c3882bb"},"model":"default","tally":{"sensible":3,"stretch":3,"nonsense":1},"problems":{"blocker":2,"should":4,"nit":1}} -->
## sense: fixable
Recorded 2026-11-15 at commit a9fdf89, by claude -p (model: default). Inputs 7d7eef6e4217: the card, premise.md's ways to win and lose, the pass's prompts.
Items: 3 sensible, 3 stretch, 1 nonsense.
Problems: 2 blocker, 4 should, 1 nit.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-judge | report.md | 49 s | $0.11 |
| all | | 49 s (the steps add up to 49 s) | $0.11 |

### Open problems
The blockers and shoulds, carried to the next run's reader as earlier.md.

- E1 [blocker] In the Lin route, the auditor is sorting her paper pile and doesn't notice you unplugging the laptop from the same desk, right beside him. Only his view cone makes this work. Your hand and the cable are about 30 cm from his clipboard. — Give him a real reason to turn away. For example, his phone rings and he steps into the kitchen doorway to take it, or the boss calls him into the office. Lift the laptop then.
- E2 [blocker] In the Kev route, Kev has no reason to hide his laptop "behind his back." If he thinks he left it on your desk, as he does every loop, he'd just pick it up openly. Hiding it makes him an accomplice who never agreed to anything. The auditor is also looking at your desk the whole time, so a laptop disappearing from under his eyes would get noticed. — Have Kev pick it up openly while the auditor is turned away. For example, the auditor walks to the printer or Lin's desk to borrow a pen. Kev just mumbles "mine" and carries it home.
- E3 [should] When Lin's or the boss's desk gets the cross, the auditor points at you, but nothing ties you to it. Players won't know why they lost. — Have the owner do it: Lin, or the boss coming back, says "that's mine on his desk," and then the auditor points.
- E4 [should] Getting seen "carrying" a laptop leads to an outburst, but carrying a laptop is ordinary. — Make only the suspicious moments fail: unplugging one from a desk that isn't yours, or walking out of the boss's office with one. If he just sees you carrying one, he asks "whose is that?" and you lose time, not the game.
- E5 [should] In the Lin route, she comes back from the kitchen to an empty desk. A real coworker would say something loudly before the sign-off at 3:47.7. — Keep her in the kitchen until after the sign-off (for example, she's chatting by the coffee machine), or let her notice and blame the IT cart.
- E6 [should] Kev puts his laptop on your desk at 3:11.7 and takes it back at 3:21.9 every loop, with no visible reason. — Give him one: he's showing you a video, or he's asking you to watch it while he runs to the printer.

### 1-judge: report.md

Verdict: fixable

- The boss's laptop (win): sensible — the boss walks off to the lobby once his desk is ticked, and Lin is in the kitchen, so nobody sees you lift an unattended laptop.
- Lin's laptop (win): nonsense — you unplug a laptop from the desk the auditor is standing over, right at his elbow. Nobody misses someone reaching across the desk they're working at.
- Kev's laptop (win): stretch — Kev sneaks his own laptop off your desk "behind his back" for no reason he has, and the auditor standing over that desk doesn't see it go.
- A desk has no laptop (lose): stretch — fine when it's your desk. When it's Lin's or the boss's, the auditor blames you without a reason to.
- He sees you with a laptop (lose): stretch — people carry laptops around offices all day. Carrying one alone isn't suspicious.
- Away at sign-off (lose): sensible — an empty chair when the auditor needs your signature is an obvious fail.
- Witness / told on / owner takes it back (lose): sensible — these are ordinary coworker reactions.

## Problems
- blocker: In the Lin route, the auditor is sorting her paper pile and doesn't notice you unplugging the laptop from the same desk, right beside him. Only his view cone makes this work. Your hand and the cable are about 30 cm from his clipboard. — Give him a real reason to turn away. For example, his phone rings and he steps into the kitchen doorway to take it, or the boss calls him into the office. Lift the laptop then.
- blocker: In the Kev route, Kev has no reason to hide his laptop "behind his back." If he thinks he left it on your desk, as he does every loop, he'd just pick it up openly. Hiding it makes him an accomplice who never agreed to anything. The auditor is also looking at your desk the whole time, so a laptop disappearing from under his eyes would get noticed. — Have Kev pick it up openly while the auditor is turned away. For example, the auditor walks to the printer or Lin's desk to borrow a pen. Kev just mumbles "mine" and carries it home.
- should: When Lin's or the boss's desk gets the cross, the auditor points at you, but nothing ties you to it. Players won't know why they lost. — Have the owner do it: Lin, or the boss coming back, says "that's mine on his desk," and then the auditor points.
- should: Getting seen "carrying" a laptop leads to an outburst, but carrying a laptop is ordinary. — Make only the suspicious moments fail: unplugging one from a desk that isn't yours, or walking out of the boss's office with one. If he just sees you carrying one, he asks "whose is that?" and you lose time, not the game.
- should: In the Lin route, she comes back from the kitchen to an empty desk. A real coworker would say something loudly before the sign-off at 3:47.7. — Keep her in the kitchen until after the sign-off (for example, she's chatting by the coffee machine), or let her notice and blame the IT cart.
- should: Kev puts his laptop on your desk at 3:11.7 and takes it back at 3:21.9 every loop, with no visible reason. — Give him one: he's showing you a video, or he's asking you to watch it while he runs to the printer.
- nit: Nobody in any route checks asset tags. A half-awake auditor might plausibly skip that, but a single line would help, e.g. "he never checks the serials" or him yawning at the clipboard. — Have him glance at the screen instead of the sticker, as a visible sign he's sloppy.

<!-- /cold-read:sense -->

<!-- cold-read:premise {"verdict":"fixable","date":"2026-11-15","commit":"789698c","hash":"070040541872dc9db3fbe76e70cd55ea330b6ee1e11c9559918d8ee06165b8e5","parts":{"card":"b56071d2cde4a317ffe83d32db69fbe14abe0c6986c2f60fd2101491fe967647","premise":"6defb3b8e96e42ba4d168396f28c3be394724a2834c812b90ab1cc1b3d5c4159","prompts":"e810e9318a4aa5a21d9654564c23dd898975d90252af2744b888b19de97df7bd"},"model":"default"} -->
## premise: fixable
Recorded 2026-11-15 at commit 789698c, by claude -p (model: default). Inputs 070040541872: the card, premise.md, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-card | first-read.md | 16 s | $0.02 |
| 2-review | report.md | 145 s | $0.64 |
| all | | 160 s (the steps add up to 160 s) | $0.67 |

### 1-card: first-read.md

**Situation:** It's 3:00 PM. At 3:30 there's a laptop audit, and I no longer have my laptop because I sold it. Two readings of "yours":
1. It was my company laptop, which I had no right to sell.
2. It was my personal laptop, and the audit wants one anyway. This is less likely, but the card doesn't rule it out.

**Must do:** Have a laptop when the audit happens. I could get mine back, steal someone else's, fake one, or make the audit not happen.

**If I fail:** It's never stated. I'm guessing caught or fired.

**Questions:**
- Does any laptop pass, or does it have to be *mine*, matched by asset tag or serial number?
- Does the audit only count laptops, or does it look at what's on them?
- Who did I sell it to? Someone in this office? Can I buy it back? Do I still have the money?
- Who runs the audit, and where? At my desk or in a room?
- Is the loop exactly 30 minutes long?
- **Name:** Does "The Audit" mean this laptop check, or is it about me, for example a money audit that finds the sale?
- **Icons:** Is 📋 the auditor, a checklist I could steal, or just "audit"?

### 2-review: report.md

Verdict: fixable

**1. Kev stands next to his own laptop and doesn't take it.** At lunch (3:21.9) Kev sees his laptop on your desk and grabs it at once with a facepalm. At 3:36.5 he walks back to the same spot, stands one tile from the same laptop for up to 3.5 minutes, and only takes it 0.3 minutes after the tick (`index.js:186-203`). Nothing on screen explains the wait. It goes against the one trait the level spent a whole beat teaching us. A player thinking ahead will expect him to grab it at about 3:37, before the tick, and will rule out the Kev route. So the route is found by trying it, not by working it out.
*Fix:* drop `kev_wait`. Time his walk back from the kitchen so he reaches your desk at about 3:40.5, during the dry-pen moment, and grabs the laptop straight away, as at lunch.

**2. Nothing shows that any laptop counts on any desk.** The first reader's first question is whether the laptop has to be *yours*. In the default loop every tick lands on the owner's own laptop. Kev's laptop is gone from your desk before 3:30. Whether a borrowed laptop passes is only learned by trying it.
*Fix:* show it once in the default loop. For example, Lin is working on the boss's navy laptop and the boss on her teal one (seen through the glass at 3:00), and both desks get ticks.

**3. Getting fired for carrying a laptop comes out of nowhere.** He's an outside auditor counting desks. Someone carrying a laptop down the hallway is normal office life. Nobody is ever stopped for it. Worse, in the Kev route Kev walks right past him with a laptop and nothing happens. The first time anyone learns the rule is the caught screen.
*Fix:* at 3:25 the auditor sees Kev heading out with his laptop and points him back to his desk (💻❗👉) before any of his trips.

**4. The Lin route breaks common sense.** He stands over her desk at (3,7). The laptop at (4,8) sits exactly on the 45° edge of his view cone, and it disappears from under his elbow. Going through her pile of papers has no reason we can see. A laptop auditor reading a colleague's papers looks like puzzle padding.
*Fix:* put her laptop at the far east end of the desk, clearly outside the cone. Give the pile a reason: he digs his per-desk form out of it.

**5. Small gaps between the card and the world.**
- The card says "at 3:30", but the real deadline is the sign-off at 3:47.7. The first reader expected a 30-minute loop.
- Lin finds her laptop gone minutes before a laptop audit and just sits there.
- Lin and the boss walk away from their desks just as their own desks are being checked.

*Fixes:*
- Have Lin tap the auditor and show her missing laptop (💻❓) at 3:25.
- Leave the card alone. The walk he takes past the desks is something to discover, not a hint.

**Name and card:** "The Audit" and the icons 📋 💻 name the trouble only. They don't give away the double count, the dry pen or any route. No finding here.

**Stakes and joke:** these hold. If he counts four laptops he signs off and you're safe, which works by the game's own logic. The funny moment happens on screen: Kev facepalms over a mistake he didn't make, then hums as he carries home the laptop that was just counted on your desk, while the auditor shakes a dead pen. That's better than the obvious version of the joke, where you rush one laptop ahead of the auditor yourself, because the victim does the trick for you. Fix 1 makes it land cleanly.

**Best thing:** an auditor who ticks a desk once and never looks back, so one laptop can run ahead of his clipboard and get counted twice. The ticks and crosses stay stuck to the desks, so the player can see this without any text.

<!-- /cold-read:premise -->

<!-- cold-read:pictures {"verdict":"fixable","date":"2026-11-15","commit":"789698c","hash":"779a2ec8b6cca6f1da1dbe18f8b7221b23970f8d79273cd615ef5e2effaab375","parts":{"card":"b56071d2cde4a317ffe83d32db69fbe14abe0c6986c2f60fd2101491fe967647","shots":"1749344d3e13266d0bad53a4c8643e8a388cd52b260bc03b5dc99284005f3ea2","pictures":"add8dcc4b19a03d863418d9ed94350841fab47c497f9ccb722f437534bfaa0a3","verbs":"aa43cfac02c318e17252aaa1576ef66dad1b7a59e64492023ee58423e73152b6","prompts":"1be891765faa44213b35ae487e17cfde8d5226055a07e5b77c1546cdbe1caa4e"},"model":"default"} -->
## pictures: fixable
Recorded 2026-11-15 at commit 789698c, by claude -p (model: default). Inputs 779a2ec8b6cc: the card, shots.js, the rendered shots, the verb sheets, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read | reading.md | 129 s | $0.90 |
| 2-compare | report.md | 193 s | $0.80 |
| all | | 322 s (the steps add up to 322 s) | $1.70 |

### 1-read: reading.md

# The Audit: reading

## Shots

1. **3:00.** A "1" stamp in a red loop. Red-shirt (me) sits at the middle desk. A bald man in navy sits in the corner office on a gold rug. A teal-shirt woman and a camo guy sit at side desks, each with a laptop. The HUD's empty hand slot and three empty frames are unexplained.
2. **3:10.** Bald man has walked to the grey-tiled lobby. Camo guy walks toward me holding something. There's a black squiggle (a cable?) on my desk. The "pretend" key is lit, but I can't tell why.
3. **3:11.** Camo guy waves 👋 and leaves a laptop on my desk (gold ring, E). He's lending me his laptop? Bald man stands by a round grey object in the lobby. I can't tell what that object is.
4. **3:12.** Camo guy walks off waving at teal woman. She turns her head.
5. **3:13.** Teal woman gets up. Camo guy heads toward the lobby.
6. **3:22.** Bald man is back at his desk. Camo guy stands at my desk with a bubble: laptop + a blond face. **I can't read this.** Is the laptop "for him"? Or is he asking for it back? Teal woman is beside me.
7. **3:19.** I'm holding a grey laptop. Bald man thinks "💻?", so I've taken his. Nobody else has noticed.
8. **3:23.** Bald man is out in the corridor 😠💻 with an orange cone over my desk. His desk shows only a cable. Clear: he's hunting it.
9. **3:24.** I'm holding a teal laptop. Teal woman thinks "💻?". Her desk is bare.
10. **3:12.** I'm reaching for the bald man's laptop. Teal woman fires a starburst (! + pointing hand + small red ring). The red ring in it is unreadable.
11. **3:25.** I'm sitting in the bald man's chair. Teal woman's starburst: 👉 + my face + laptop. She's snitching, and it reads well. A grey-suited man with a clipboard and glasses enters from the lobby. That's the auditor.
12. **3:01.** I'm holding coffee at the machine.
13. **3:27.** I'm at camo guy's desk with the coffee, E prompt. He's in the kitchen. Bald man has wiggle lines. Snoring? Muttering?
14. **3:27.** I'm holding camo's green laptop. His desk shows only a cable. Did the coffee do anything? I can't tell.
15. **3:29.** Auditor at the coffee machine. I'm at my desk, hand empty.
16. **3:32.** The clock turns red. Auditor at the bald man's desk holds up a "💻✓" sign, and a green check stays on the desk.
17. **3:34.** Bald man leaves his office. Auditor lingers.
18–20. **3:36–3:37.** Teal woman's desk gets ✓. She wanders to the kitchen. The order of checks is readable: boss, teal, me, camo.
21. **3:40.** My desk gets "💻✗" and a 😠. Camo guy waves 👋 nearby. Is that a joke or a hint?
22. **3:35.** I'm putting the grey laptop back on the bald man's *already-checked* desk. That's the trick: grab it after it's been checked.
23. **3:40.** My desk ✓. The bald man's desk is bare but still checked. Funny once you get it.
24–25. The same trick with the teal laptop. It works.
26–27. **3:39–3:40.** Camo's lent laptop sits on my desk and passes ✓.
28. Auditor thinks "🖊️?". **Unreadable.** Did he lose a pen? It's a pen/stylus glyph with nothing to connect it to. Camo repeats the laptop + blond-face bubble.
29. **3:41.** Camo walks off with his laptop (still the blond-face bubble). My desk keeps its check.
30. **3:44.** Camo's desk ✓ with the same laptop. One laptop counted twice.
31. **3:47.** Auditor 😊. The clock panel glows red. Win state?
32. **3:47.** Same spot, auditor thinks "💻✗", my desk ✗. Same time, different loop. I can't tell what went wrong. Was the laptop taken back too early?
33. **WIN.** I'm smug at my desk with the grey laptop. Auditor's clipboard is all checked. Bald man smokes outside. Icons: bald face, 🚬, 💻, ✓, ✓. His portrait fills frame 1. Clear and funny. But I never saw him smoke in any shot; was it the lobby object?
34. **WIN.** Teal laptop. Teal woman sips coffee, humming ♪. Icons: her face, ☕, 💻, ✓✓. Frame 2.
35. **WIN.** My desk shows only a cable. Camo strolls off with his laptop, ♪. Icons: 💻 ✓ ✓ camo ♪. Frame 3. The icon order flips (laptop first), which reads as "checked, *then* he took it". Good.
36. **LOSS.** My desk (yellow chair) has a "💻✗" sign. The auditor points me into the elevator with a box and a plant. Icons: me, 💻, ✗, 👉, 📦. Clear: fired.
37. **LOSS.** Teal chair and teal mug on the desk, her face in the icons, but **I'm** the one boxed out. Confusing. Did I get fired for her empty desk? I'd guess the auditor traced it, but nothing shows that.
38. **LOSS.** Same, with the bald man's maroon chair and blue mug. Same confusion: his face, my box.
39. **3:33.** Caught at the bald man's desk inside the auditor's red cone: ❗😠. The bald man walks in too.
40. **LOSS.** The auditor spots a laptop in my hands ("💻❗"), the laptop drops, I'm out. Icons: auditor, 👀, 💻, 👉, 📦. Clear.
41. **LOSS.** Laptop on my desk, chair empty. Auditor: "my face ?" 😠, 🪑, 📦. Clear: you have to be sitting there.

## Verbs

**01 – grey laptop**
1–4. Carrying it, facing four ways, E shown. **Panels 2–4 aren't actions**, just turns. If E does something different by facing, the pictures don't show it.
5. Ring on me, hand empty, laptop not visible. Unclear: hidden? dropped?
6. Laptop on the floor beside me. Drop. Reads fine.
7. Progress ring, sparkle on the floor laptop. Pick-up in progress. OK.
8. Holding it again. Picked up. OK.
9. At my desk, cable circled, holding it. Prompt to plug in.
10. Laptop on my desk, hand empty. Placed. Clear.
11. At the bald man's desk in a red cone, small "?". Returning while watched?
12. Laptop back on his desk, big "?" cloud. **Whose question is it?** Nobody's visible thinking it.

**02 – teal laptop.** 1–10 are the same as above, same issues. 11–12: I return it while she's seated beside me, and she doesn't react. Odd. She snitched in shot 11.

**03 – green laptop.** Same as 02. Camo sits right there while I put his laptop back. No reaction, which reads as either "he doesn't care" or a bug.

**04 – coffee.** 1–4: carrying, four facings (same non-actions). 5: drinking, progress ring at mouth. 6: hand empty, cup gone. Fine, but that's all coffee does here. Shot 13's coffee-at-camo's-desk prompt is never explained.

## Story

You sold your laptop and the auditor's coming. He checks desks in a fixed order (boss, teal, you, camo), and a check stays put once it's given. So you borrow a laptop that's already been checked, or one that's about to be. You can lift the boss's while he's out smoking or teal's while she's on her coffee run, or just let camo lend you his and take it back. Get seen holding one, leave your chair empty, or leave any desk bare, and you're carrying a box to the elevator.

### 2-compare: report.md

Verdict: fixable

## Shots

**01 · reads.** The four desks, the three laptops and your bare desk all read. Having the HUD hand slot and the empty frames unexplained is cosmetic.

**02 · partly.**
- Reading: "Camo guy walks toward me holding something. There's a black squiggle (a cable?) on my desk."
- Intent: Kev leaves for lunch carrying his olive laptop, and his desk is bare.
- Cause: missing cue. The laptop in his arms is a few pixels and doesn't read as a laptop. The bare cable on your desk is noise in this shot.
- Fix: draw the laptop large in Kev's arms with the olive lid facing the camera, so it's clearly the thing that was on his desk.

**03 · partly.**
- Reading: "He's lending me his laptop? … a round grey object in the lobby. I can't tell what that object is."
- Intent: Kev forgets his laptop on your desk, waves goodbye and leaves. The boss is out smoking.
- Cause: the 👋 is aimed at you as the laptop lands on your desk, so it reads as handing it over, not forgetting it. The boss has no cigarette and no smoke, so the ashtray stand is a glyph used as a prop.
- Fix: have Kev set the laptop down while looking at his watch, then wave toward the lift with his back to you. Give the boss a lit cigarette and grey puffs of smoke.

**04 · partly.**
- Reading: "Camo guy walks off waving at teal woman. She turns her head."
- Intent: the boss smokes in the lobby. Lin looks through the glass into his empty office. Kev's laptop is lit as takeable.
- Cause: cause and effect in the wrong place. Kev's 👋 sits right next to Lin's head turn, so her look reads as a reply to him, not as watching the office. Still no smoke on the boss. This matters because Lin watching the office is the threat in shot 10.
- Fix: drop Kev's wave from this beat. Give Lin a 👀 bubble angled at the glass office, and add smoke puffs to the boss.

**05 · reads.**

**06 · misread.**
- Reading: "a bubble: laptop + a blond face. I can't read this. Is the laptop 'for him'? Or is he asking for it back?"
- Intent: Kev slaps his forehead (💻🤦): silly him.
- Cause: an emoji standing in for a gesture. At bubble size 🤦 renders as a blond face.
- Fix: animate the slap on Kev's sprite (hand to forehead, a small red mark) and keep only 💻 in the bubble.

**07 · reads.**

**08 · partly.**
- Reading: "Bald man is out in the corridor 😠💻 … Clear: he's hunting it."
- Intent: he has already found it on your desk and snatched it back, and is carrying it to his office.
- Cause: missing cue. The navy laptop in his hands can't be seen, and 😠💻 reads as "where is my laptop".
- Fix: draw the navy laptop clutched big against his chest, and change the bubble to 😠 alone (or 😤 hugging 💻).

**09 · reads.**

**10 · partly.**
- Reading: "starburst (! + pointing hand + small red ring). The red ring in it is unreadable."
- Intent: Lin sees you through the glass and points at you (❗👉 you).
- Cause: the "you" face in the starburst is too small to read. Shot 11 draws it at a size that works.
- Fix: use shot 11's large red-shirt face in this starburst.

**11 · wrong moment.**
- The intent describes a later beat: the auditor sends you to your desk (📄📄👉 screen) and you sit typing.
- At 3:25 the picture still shows you in the boss's chair, Lin's snitch starburst, and the auditor only just stepping in from the lobby. The snitch beat itself reads well.
- Fix the commands: retake once you are back at your desk typing, with the paperwork bubble up.

**12 · reads.**

**13 · partly.**
- Reading: "I'm at camo guy's desk with the coffee, E prompt… Did the coffee do anything? I can't tell."
- Intent: with the cup in hand, Kev's laptop does *not* light up. The only thing E does is drink.
- Cause: missing cue. The E chip and ring sit right at the desk edge, so they read as a desk action. Nothing says your hands are full.
- Fix: put a ☕ icon inside the E chip and float it above your head, not beside the desk. Draw Kev's laptop dimmed with a small ✋ mark.

**14 · reads.**

**15 · reads.**

**16 · reads.**

**17 · reads.**

**18 · reads.**

**19 · partly.** The reading lumps 18–20 together and never sees the search.
- Intent: the auditor digs through Lin's paper pile looking for her laptop.
- Cause: missing cue. He stands beside the desk in the same pose as in shot 18. Shot 24's route depends on him being head-down in the pile.
- Fix: give him a digging pose: bent over the pile, papers flying, his view cone pointed down into the pile.

**20 · reads.**

**21 · partly (cosmetic).**
- Reading: "Camo guy waves 👋 nearby. Is that a joke or a hint?"
- Intent: Kev just walks past.
- Cause: a stray 👋 bubble suggests a hint that doesn't exist.
- Fix: remove Kev's bubble here.

**22 · wrong moment.**
- Intent: the boss is out smoking, Lin is at the coffee machine, and you unplug the already-ticked laptop.
- At 3:35 the picture shows the boss still walking out of the open office, Lin at her own desk, and the auditor in the glass-office doorway right next to you.
- The HUD hand slot already holds a laptop, which is why it reads as "putting the grey laptop back".
- Fix the commands: retake once the boss is in the lobby, and before the pickup completes, so the hand slot is still empty.

**23 · reads.**

**24 · partly.**
- Reading: "The same trick with the teal laptop. It works."
- Intent: you can take it only because the auditor is head-down in the pile and doesn't see you.
- Cause: same missing digging pose as shot 19. You stand right beside a standing auditor, so the reason it worked is invisible.
- Fix: the digging pose from shot 19, with his cone visibly aimed down at the pile and away from you.

**25 · reads.**

**26 · reads.**

**27 · reads.**

**28 · misread.**
- Reading: "Auditor thinks '🖊️?'. Unreadable. Did he lose a pen? … Camo repeats the laptop + blond-face bubble."
- Intent: his pen has run dry, so he shakes it head-down. Kev blames himself again (💻🤦).
- Causes:
  - A glyph used as a prop: at this size the pen is a hairline.
  - The auditor isn't drawn shaking the pen.
  - 🤦 again renders as a blond face.
- Fix: draw a fat pen with a dry nib and shake lines on his sprite, and use the sprite facepalm from shot 06.

**29 · partly.**
- Reading: "Camo walks off with his laptop… My desk keeps its check." The gist lands.
- Missing: the pale scrawl and the dry-pen distraction, which is why Kev gets away. The pen thought is a grey cloud with a hairline glyph, and no scrawl shows on the clipboard.
- Fix: a visible zigzag scribble on the clipboard corner, and the auditor's cone tipped down at it.

**30 · reads.**

**31 · reads.**

**32 · reads.** The cross reads correctly. The player can't see why it happened, but that happened earlier in the loop, not in this picture.

**33 · reads.** "I never saw him smoke" is caused by shots 03/04, not this card. Fix it there.

**34 · reads.**

**35 · reads.**

**36 · reads.**

**37 · partly.**
- Reading: "her face in the icons, but I'm the one boxed out. Confusing. Did I get fired for her empty desk?"
- Intent: you took Lin's laptop too early, so her desk got the first cross.
- Cause: missing cue. The icon row leads with her face, which reads as "her fault". Nothing links you to her laptop, and nothing says "too early".
- Fix: draw her teal laptop sticking out of your box, and put a ✗ sticker on her bare desk in the scene.

**38 · partly.** Same cause as shot 37, with the boss. Same fix, with the navy laptop in your box.

**39 · reads.**

**40 · reads.**

**41 · reads.**

## Verb sheets

**01 laptop_boss**
- **Panels 2, 3 (pretend standing / walking):**
  - Cause: the phone-to-ear and folder poses aren't drawn. The laptop is held exactly as in panel 1 carry, so pretending shows no visible change (reading: "aren't actions, just turns").
  - Fix: draw the item at the ear while standing and as a tucked folder while striding, with a clearly different silhouette from carry.
- **Panel 5 (drop · after):**
  - Cause: the dropped laptop is hidden under your sprite and the gold ring, so it reads as "hidden? dropped?".
  - Fix: drop the item one tile in front of you, or draw floor items above your feet.
- **Panels 11, 12 (put on boss_desk):**
  - Cause: the witness, the boss, is off-panel. The "?" bubble hangs over the desk, then over the laptop, and is anchored to nobody ("Whose question is it?").
  - Fix: widen the crop to include the boss, or anchor the thought to an edge-of-frame boss marker with a tail.

**02 laptop_lin**
- **Panels 2, 3:** same pretend-pose failure as sheet 01. Same fix.
- **Panel 5:** same hidden-drop failure. Same fix.
- **Panels 11, 12:**
  - Cause: Lin sits facing the desk while her laptop reappears in front of her, with no reaction. On sheet 01 an off-screen boss notices the same action, so this reads as a bug.
  - Fix: give the owner a reaction when their laptop comes back (💻❓ then 😌). If she truly can't see it, draw her cone so it clearly excludes the desk.

**03 laptop_kev**
- **Panels 2, 3:** same pretend-pose failure. Same fix.
- **Panel 5:** same hidden-drop failure. Same fix.
- **Panels 11, 12:** Kev sits beside you, gets his laptop back and doesn't react. Same cause and fix as sheet 02.

**04 coffee**
- **Panels 2, 3:** same pretend-pose failure. The cup stays at chest height and never goes to the ear or becomes a folder. Same fix.
- Panels 1, 4, 5 and 6 read. Shot 13's unexplained coffee prompt is covered under shot 13.

<!-- /cold-read:pictures -->

<!-- cold-read:replay {"verdict":"fixable","date":"2026-11-15","commit":"789698c","hash":"facd0ddd0ad8f5946a3584ce2d8dc31559b63f20f814a8143d575851b4dcf512","parts":{"card":"b56071d2cde4a317ffe83d32db69fbe14abe0c6986c2f60fd2101491fe967647","checks":"88315c1d1235d8c017d86700dbba9cd2d86c8fc152e133c4959a27008bceb30b","ways":"878d1148ede4d2e399aefd6e9f4833c6d49bfea3d549fbdc73d96b6189acf9d7","frames":"f92e4315d8801cb893b6e5d417678400f6a0312b9322979e195122836e92dfba","prompts":"667b5b463b93916700d4d0057e9b03a51bc8a6e8c76023b597de4e97eb66e589"},"model":"default"} -->
## replay: fixable
Recorded 2026-11-15 at commit 789698c, by claude -p (model: default). Inputs facd0ddd0ad8: the card, route-checks.js, premise.md's ways to win and lose, the replay strips, the stage's prompts.

| Step | Reply | Time | Cost |
|---|---|---|---|
| 1-read-1 | reading.md | 171 s | $0.78 |
| 1-read-2 | reading.md | 181 s | $0.77 |
| 1-read-3 | reading.md | 63 s | $0.23 |
| 2-compare | report.md | 134 s | $0.45 |
| all | | 315 s (the steps add up to 549 s) | $2.23 |

### 1-read-1: reading.md

# Reading — The Audit

All five runs are read. Runs 1 and 5 were losses, and runs 2, 3 and 4 were wins. Who's who: **you** (red top, red ring), **Glasses** (grey suit, clipboard, the auditor), **Bald** (the man in the corner office), **Bun** (teal top, desk on the left) and **Spiky** (green camo).

## Run 1 — Loss
- 3:11 You're at your desk. Spiky stands beside you with 👋.
- 3:22 Spiky shows a bubble of a laptop and a yellow figure. Bun walks past you.
- 3:32 Glasses checks Bald's laptop: ✓. Spiky is in the kitchen.
- 3:36 Glasses checks Bun's desk: ✓. Bun heads for the coffee machine.
- 3:40 Glasses checks your desk: ✗, with 😠, then a thought bubble of a pen and "?". Spiky shows 👋 again.
- 3:45 Glasses checks Spiky's desk: ✓.
- 3:47 Glasses comes back with a thought bubble of a laptop and ✗, then 😠👉 at you. You show 😅.
- **End:** You walk out holding a box. The icons are you, laptop, ✗, 👉, 📦.

**Why it ended:** Your desk had no laptop, so you were fired. **Your actions:** None are marked, so you just sat there. **Might not be reactions to you:** Spiky's 👋 and laptop bubbles, and Glasses' pen bubble. They show up at the same times in every run.

## Run 2 — Win
- 3:11 You go into Bald's office while it's empty and stand at his desk (E prompt).
- 3:22 Bald comes back. You're still at his desk.
- 3:32 Glasses checks Bald's laptop (✓) with you standing right there.
- 3:35 **Used:** You take Bald's laptop. Bald has left for the grey room.
- 3:38 **Used:** You put it on your desk.
- 3:40 **Used** (at your chair; probably you sit down, but I can't tell). Glasses checks your desk: ✓.
- 3:47 Glasses 😊, you 🎉.
- **End:** Bald smoking. The icons are Bald, 🚬, laptop, ✓✓.

**Why it ended:** A laptop that had already passed was checked again at your desk. **Your actions:** The 3:35 grab and the 3:38 put-down. **Unclear:** Nobody reacted to you standing next to Bald and Glasses during the check. That's either a stealth rule or a bug.

## Run 3 — Win
- 3:11–3:32 You stand behind Bun's desk (E prompt).
- 3:36 Glasses ✓s Bun's desk. **Used:** You take her laptop as she leaves for coffee.
- 3:39 Glasses has a red "?" thought bubble, a meter appears, and his view cone points at you.
- 3:39 **Used:** You put the laptop on your desk. **Used:** at your chair.
- 3:40 Your desk: ✓.
- 3:47 Glasses 😊, you 🎉.
- **End:** Bun with coffee, ♪. The icons are Bun, ☕, laptop, ✓✓.

**Why it ended:** Same as run 2, using Bun's laptop. **Might not be a reaction:** The 3:39 "?" looks like suspicion of you, but nothing came of it.

## Run 4 — Win
- 3:22 Spiky shows his laptop-and-figure bubble.
- 3:26 **Used:** You take something from Spiky's desk while he's in the kitchen. A laptop appears in your hands.
- 3:28 **Used:** You put it on your desk. **Used:** at your chair. Glasses comes in at the top.
- 3:32–3:36 Glasses ✓s Bald's desk, then Bun's.
- 3:40 Glasses ✓s your desk. Spiky stands next to you with the laptop bubble.
- 3:45 Glasses ✓s Spiky's desk, and something still looks like it's on it.
- 3:47 Glasses 😊, you 🎉.
- **End:** Spiky walking away with a green laptop, ♪. Both desks show only cables. The icons are laptop, ✓, ✓, Spiky, ♪.

**Why it ended:** It looks like one laptop was counted twice. **I can't tell how:** Either Spiky took it back after your check, or he had a second one. The pictures don't settle it. His bubbles at 3:22 and 3:40 also appear in runs 1 and 2, so they aren't reactions to you.

## Run 5 — Loss
- 3:14 **Used:** You take Bun's laptop while she's away. Its icon stays in your hands for the rest of the loop.
- 3:16 **Used:** at your chair. Nothing visible changes, and the laptop stays in your hands.
- 3:24 Bun has a thought bubble of a laptop and "?".
- 3:36 Glasses checks Bun's desk: ✗, with 😠.
- 3:40 Your desk: ✗, with the pen bubble.
- 3:47 Glasses shows the laptop ✗ thought, then 😠👉 at you. You show 😅.
- **End:** The scene has Bun's teal desk and you leaving with a box. The icons are Bun, laptop, ✗, 👉, 📦.

**Why it ended:** You never put the laptop on your desk, so it failed, and Bun's failed too. **Your actions:** Grabbing it before the audit and not putting it down. **Confusing:** The end picture blames you over Bun's desk. I can't tell whether Glasses connected her missing laptop to you or whether this is just your own ✗. Bun's 3:24 "?" is about her own desk, not a sign she saw you.

### 1-read-2: reading.md

# Reading: The Audit

**Who's who (by look):** I play the red-haired woman in a red top, marked with a red ring. Her desk is the middle one, with a yellow chair. The others are a bald man in a navy suit who has the glass office, a woman in teal with a hair bun (left desk), a bearded man in green (right desk), and a grey figure with glasses and a clipboard who arrives around 3:30 and stamps desks.

**Things that happen in every run, so they aren't reactions to me:**
- 3:11: the bearded man waves 👋.
- 3:22: the bearded man shows a "💻 + gold thing" bubble.
- 3:32: the bald man's desk gets 💻✓.
- 3:40: my desk gets 💻✗, and the clipboard figure thinks "stick/pen ?".
- 3:44–45: the bearded man's desk gets 💻✓.
- 3:47: the clipboard figure thinks 💻✗, then points 😠👉 at me, and I sweat-smile 😅.

---

## Run 6: Loss
- 3:11: I'm at my own desk.
- 3:15: At the teal woman's desk while she's away. Afterwards a laptop shows in my hand slot.
- 3:22: At the bearded man's desk. My hand slot is empty, so I seem to have left the laptop there.
- 3:24: Both the teal woman and the bearded man think "💻?".
- 3:36: The teal woman's desk gets 💻✗ and the clipboard figure looks angry 😠. She is in the kitchen.
- 3:40: My desk gets 💻✗.
- 3:45: The bearded man's desk gets 💻✓.
- 3:47: The clipboard figure points at me. The end picture shows me leaving with a box.

**Why it ended:** My desk had no laptop at the check. I took one and then left it on the wrong desk, the bearded man's.

**Possible non-reactions:** The two "💻?" bubbles at 3:24 do look like reactions to the missing and the extra laptop.

**Flag:** The end picture shows a teal chair, a teal mug and a dark-haired bun face icon, which is the teal woman's desk. But I'm the one carrying the box. The picture doesn't match what happened.

## Run 7: Loss
- 3:16: At the bald man's desk while he's in the lobby. Afterwards a laptop is in my hand.
- 3:19: The bald man is back and thinks "💻?". I use something at my own desk, but still hold the laptop. I can't tell what this action did.
- 3:22: At my desk again. Hand empty, so the laptop now seems to be on my desk.
- 3:23: The bald man walks past the coffee machine with a "😠💻" bubble. The laptop seems to be gone from my desk.
- 3:32: The bald man's desk gets 💻✓.
- 3:36: The teal woman's desk gets 💻✓.
- 3:40: My desk gets 💻✗.
- 3:47: The clipboard figure points at me. The end picture shows me leaving with a box.

**Why it ended:** My desk had no laptop at 3:40.

**Unclear:** Where the laptop went between 3:22 and 3:32. I never saw anyone take it. The bald man's desk passing at 3:32 suggests it went back to him, but I can't tell how.

## Run 8: Loss
I skipped pictures 01, 09 and 11. The others are almost identical to run 7.
- 3:16: I take the bald man's laptop.
- 3:19: I use something at my desk and still hold the laptop.
- 3:22: Still holding it.
- 3:23: I put it down at my desk. The bald man shows "😠💻" at the same moment.
- 3:32 and 3:36: The bald man's and the teal woman's desks get 💻✓.
- 3:40: My desk gets 💻✗.
- 3:44: The bearded man's desk gets 💻✓.
- 3:47: The clipboard figure points at me. The end picture shows me leaving with a box.

**Why it ended:** Same as run 7, and just as unexplained. Putting the laptop down a minute later changed nothing I could see.

**Non-reaction:** The bald man's "😠💻" at 3:23 also appears in run 7, where I'd put the laptop down a minute earlier. So it's tied to his missing laptop, not to my putting it down.

## Run 9: Loss
- 3:12: I'm in the bald man's glass office and the walls tint pink. The teal woman thinks "?", then shouts "❗👉me".
- 3:22: Still in the office with the "E" prompt over his laptop. A red eye icon appears near the teal woman.
- 3:25: The teal woman shouts again, "👉me💻". The clipboard figure comes in from the lobby.
- 3:26: The clipboard figure shows "📄📄👉💻", and a stack of paper appears on my desk.
- 3:32: I'm back at my desk.
- 3:40: My desk gets 💻✗.
- 3:47: The clipboard figure points at me. The end picture shows me leaving with a box.

**Why it ended:** No laptop on my desk. My hand stayed empty all loop, so I never took anything.

**Unclear:** Being spotted twice had no consequence I could see. The paper stack doesn't appear in any other run, and I can't tell what caused it or what it means.

### 1-read-3: reading.md

# Reading: The Audit

The mission card says: "3:00 PM. Laptop audit at 3:30. You sold yours." There is only one folder in runs/, run-10.

## Run 10: loss

**Beats**
- 3:01: The player uses the coffee machine. The hand slot now shows a mug.
- 3:11: The man in the camo shirt shows a 👋 bubble near the player's desk. The bald boss walks through the grey lobby.
- 3:22: The camo man shows a 💻🏆 bubble. He seems to be carrying something.
- 3:27: The camo man is in the kitchen. The player uses his empty desk, and the mug leaves their hand.
- 3:28: The player picks up a laptop from his desk. Moments later their hand is empty again and a laptop is back on his desk.
- 3:32: The clock is red. The player sits at the middle desk with "pretend" lit. A grey man with glasses and a clipboard shows the boss a 💻✓ card.
- 3:36: He shows 💻✓ at the top-left desk.
- 3:40: He reaches the player's desk and shows 💻✗, a red ⊗ mark, a 😠 bubble, then a thought bubble with a pen and "?".
- 3:45: The camo man's desk gets 💻✓.
- 3:47: The grey man shows 😠👉 and the player's face. The player shows 😅.
- End picture: the player walks to the lift holding a box. The icons under it are face, 💻, ✗, 👉, 📦.

**Why it was lost:** There was no laptop at the player's desk when the clipboard man checked it, and the player was walked out with a box.

**What caused it:** The player put the laptop back at 3:28. Pretending at the desk did not save them. I can't tell where the coffee ended up or whether it did anything.

**Might not be reactions:** The camo man's 👋 and 💻🏆 bubbles and his trip to the kitchen all came before the player went near him. At 3:28 the clipboard man was standing near the coffee machine, which may be why the laptop went back, but I can't confirm that. I don't know what the pen bubble means.

### 2-compare: report.md

Verdict: fixable

The two wins that rely on the board's rules (runs 2 and 3) read clearly. The third win (run 4) is only half understood: the reader can't say how Kev's laptop got counted twice. Two losses are unexplained (runs 8 and 9), because the thing that took the laptop away or stopped the player is never shown. The beats behind run 4, Kev's laptop drop and the auditor's dry pen, were both written off as background.

## Runs

- **Run 1 (loss): explained.** "Your desk had no laptop, so you were fired… you just sat there." That's correct. But the reader dismissed Kev's 👋 and 💻🤦 as background (see Beat A).
- **Run 2 (win, boss): explained.** "A laptop that had already passed was checked again at your desk", plus the 3:35 grab and the 3:38 put-down. The reader asks whether standing beside the boss and the auditor unnoticed is "a stealth rule or a bug". Nothing tells them that only *holding* a laptop is suspicious. That's a small missing cue, but it doesn't affect the cause.
- **Run 3 (win, Lin): explained.** "Same as run 2, using Bun's laptop", with the 3:36 grab. They correctly saw the 3:39 "?" meter as a near-miss.
- **Run 4 (win, Kev): partly.**
  - The reading: "It looks like one laptop was counted twice. **I can't tell how:** Either Spiky took it back after your check, or he had a second one."
  - What happened: you put Kev's laptop on your desk. At 3:40 Kev waited one step past your desk. While the auditor's pen ran dry, Kev took the laptop home behind his back, and it was ticked again at 3:44.9.
  - Visual cause: cause and effect are too far apart, and the cue is missing. The carry happens between the 3:40 and 3:45 frames. At 3:40 Kev's 💻👱 bubble looks like his everyday bubble. At 3:45 he's already sitting down. The reader had already ruled out his bubbles as "not reactions to you". The end picture (Kev walking off with a green laptop, ♪) is the only hint.
  - Fix: at the moment of the tick on your desk, give Kev his own bubble showing *your desk → his desk* (💻➡️🪑 in green). Draw him mid-carry under the auditor's 🖊️? bubble, the auditor's cone pinned to the clipboard. The end picture can then repeat that exact pose.
- **Run 5 (loss): explained.** The reading: "You never put the laptop on your desk, so it failed, and Bun's failed too", with the right action. Their "Confusing" note comes from the end picture (Beat F), not from a wrong cause.
  - Rules gap the reader didn't catch: at 3:36 and 3:47 the hand slot still shows Lin's laptop, and you sit inside the auditor's cone, yet the "seen with a laptop" bust doesn't fire. Either hide the laptop when you sit, or make the bust fire. As it stands, this loop teaches that a held laptop is invisible.
- **Run 6 (loss): partly.**
  - The reading: "I took one and then left it on the wrong desk, the bearded man's." They also flag: "The end picture… is the teal woman's desk… doesn't match what happened."
  - What happened: Kev came back with his own laptop and put Lin's in his drawer (💻❓). Lin's desk got the ✗ at 3:36, and that ✗ is what the end picture blames. The reader got the ending and their own action, but not that Kev removed the laptop, and they rejected the real cause the picture showed.
  - Visual cause: the cue is missing. The drawer move isn't drawn, and the end picture reads as a mistake (Beat F).
  - Fix: show a drawer sliding shut on Kev's desk, with the 💻❓ bubble attached to it and a teal sticker on the laptop as it goes in.
- **Run 7 (loss): partly.**
  - The reading: "Where the laptop went between 3:22 and 3:32. I never saw anyone take it. … suggests it went back to him, but I can't tell how."
  - What happened: the boss hunted for it (😠💻) and took it back from your desk.
  - Visual cause: the cue is missing. The take-back happens off-camera, and the only trace is a bubble he shows while walking *away* by the coffee machine.
  - Fix: let the boss stop at your desk, show 😠👉💻 at it, and walk back to his office holding the laptop up, so a frame catches it.
- **Run 8 (loss): unexplained.**
  - The reading: "Same as run 7, and just as unexplained… [😠💻] is tied to his missing laptop, not to my putting it down."
  - What happened: you put it down at 3:23.7, just before he gave up. He saw it and took it home before the auditor saw the hallway. The reader explicitly ruled out the real cause.
  - Visual cause: the bubble reads as routine. 😠💻 looks the same whether he is hunting or has *found* it.
  - Fix: use two different bubbles. Use 😠💻❓ while he's searching. Use 😠👀💻 aimed at your desk, with a line to it, when he finds it.
- **Run 9 (loss): unexplained.**
  - The reading: "Being spotted twice had no consequence I could see. The paper stack… I can't tell what caused it."
  - What happened: Lin saw you through the glass and told the auditor at 3:25. He put you on paperwork (the stack), so you never got a laptop. They named the wrong cause chain.
  - Visual cause: the cue is missing, and you're shown as an emoji. The auditor's 📄📄👉💻 doesn't show *you*. The stack just appears on your desk with no link to his bubble or to Lin's tip-off.
  - Fix: make his bubble 📄📄👉 + your face. Have him walk over and drop the stack with a thump. While it's there, grey out your hand slot with the stack drawn in it, so it reads as "your hands are busy".
- **Run 10 (loss): explained.** The reading: "The player put the laptop back at 3:28", which is right. They misread the coffee (Beat G), but that's not the cause of the loss.

## Misleading beats

- **A. Kev's 3:11 👋 and 3:22 💻🤦 (runs 1, 4, 10).**
  - The reading: "They show up at the same times in every run" and "aren't reactions to you".
  - What happened: they aren't reactions, but they're the level's key demonstration. Kev leaves his laptop on *your* desk and fetches it. That teaches both that laptops move and that Kev comes back for his. The reader saw a wave and a "laptop and yellow figure"/"🏆". They never noticed a laptop sitting on their desk.
  - Visual cause: an emoji stands in for the action (🤦 reads as a trophy or a figure), and the cue is missing.
  - Fix: catch the laptop on your desk in a frame, with Kev's green sticker on it and a highlight. Draw the 🤦 bigger, with Kev slapping his forehead while he grabs it.
- **B. The auditor's pen "?" at 3:40 (every run).**
  - The reading: "I don't know what the pen bubble means."
  - What happened: his pen runs dry, his cone stays on the clipboard, and that blind window is how the Kev win works.
  - Visual cause: a bubble with no visible effect.
  - Fix: show his cone shrinking to a narrow strip on the clipboard while he shakes the pen, with ink spatter. In the first loop, frame Kev walking behind him at that moment.
- **C. The boss's 😠💻 at 3:23 (runs 7 and 8).** The reader called it a non-reaction, but it's the take-back. See runs 7 and 8.
- **D. Kev's 💻❓ at 3:24 (run 6).** The reader correctly took it as a reaction, but read it as "the extra laptop is still there". In fact it went into his drawer. See run 6.
- **E. Lin's "❗👉me" and the paper stack (run 9).** These are real reactions whose consequence was missed. See run 9.
- **F. End pictures that show someone else's desk (runs 5 and 6).**
  - The reading: "The end picture blames you over Bun's desk" and "doesn't match what happened."
  - What happened: the picture is right. Lin's desk failed because you kept her laptop.
  - Visual cause: the picture shows a teal chair and mug while *you* carry the box, and nothing ties you to that desk.
  - Fix: draw a dotted line or footprints from Lin's crossed-out desk to the box in your arms. Even better, show her laptop sticking out of the box.
- **G. The coffee (run 10).**
  - The reading: "I can't tell where the coffee ended up or whether it did anything."
  - What happened: with the mug in your hand, the laptop wouldn't come. Drinking the coffee freed your hand.
  - Visual cause: the cue is missing. Nothing shows the refused grab.
  - Fix: when you press E with full hands, show a ✋☕✗ bubble over you. Show the drink as a gulp with steam and an empty mug left on the desk.

<!-- /cold-read:replay -->
