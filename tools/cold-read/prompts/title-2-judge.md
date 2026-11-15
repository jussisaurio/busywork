Read card.txt (the game's name and its mission card), guesses.md (a first reader's guesses at how to win, from the
card alone) and ways.md (every way the player really wins and loses).

Your question: do the name or the card give away a way to win?
The card should name the trouble (what goes wrong at the deadline, the rule you live under), never the way out. A
guess that names a real route's key step, and quotes the name or the card for it, is a leak. The name is held
tighter: it may restate the trouble, but if a word of the name echoes what a route does or makes happen (a word the
ways to win would use for the trick or its effect), the guess that quotes it is a leak, even when the card alone
also implies that outcome. Undoing the trouble is fine when the guess rests on the card's words only.

Reply with your report. Your reply is saved as report.md.
- The first line is exactly `Verdict: works`, `Verdict: fixable` or `Verdict: broken`.
  - `broken`: the name or the card spells out a whole route.
- Then one line per guess: `- <guess>: miss|near|leak — <the route it matches, and the words that led to it>`.
  `near` means it points at a route's area (the right person or thing) but not its key step.
- Then the problems, graded as below. A leak is a blocker; a near is a `should`. Each fix gives the words to change
  and one replacement that names the trouble instead.
Under 350 words.
