Read card.txt (the game's name and its mission card), guesses.md (a first reader's guesses at how to win, from the
card alone) and ways.md (every way the player really wins and loses).

You are judging the title screen the way a player meets it. A good card makes the player want to start: they know
when it is, what's about to go wrong for them, and what they're trying to do, and they still have to work out how.

Two questions:
1. **Does the player know what they're playing for?** Use the first reader's `Stake:` line and your own read. Would a
   stranger know what they stand to lose and what they're aiming at? A card that leaves them shrugging ("so the boss
   reads it out, so what?") fails the player, however clean it is.
2. **Does the name or the card give the method away?** A guess that names a real route's key step, quoting the name
   or the card for it, takes the puzzle from the player. Knowing the goal is fine; that is what the card is for.

Use your judgment on how much each problem would hurt a real player, and grade it by that.

Reply with your report. Your reply is saved as report.md.
- The first line is exactly `Verdict: works`, `Verdict: fixable` or `Verdict: broken`.
  - `broken`: the name or the card spells out a whole route.
- Then `- Stake: clear|unclear — <what the card says the player loses, or what's missing>`.
- Then one line per guess: `- <guess>: miss|near|leak — <the route it matches, and the words that led to it>`.
  `near` means it points at a route's area (the right person or thing) but not its key step.
- Then the problems, graded as below. A leak is a blocker; a near is a `should`. Each fix gives the words to change
  and one replacement that names the trouble instead.
Under 350 words.
