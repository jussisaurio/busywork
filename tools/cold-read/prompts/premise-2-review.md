Read first-read.md: another reader's take on the card alone. Then read card.txt, premise.md, and the level's source
files in src/. premise.md and the code comments are the designer's claims. Check each claim against the code (the
cast's schedules, the interactions, the routes), the engine rules above, and common sense. Budget: about 12 file
reads, then write.

Judge:
1. **Stakes.** Does the goal follow from the card? By the game's own comic logic, would succeeding actually save you
   from the bad outcome? Is the threat real and immediate?
2. **Motivation.** Does every beat of every routine have a believable everyday reason that the player can SEE? A
   motive written only in premise.md or a code comment is not shown: judge each beat by what is on screen. Flag
   anything a character does only because the puzzle needs it. Once the player has seen what drives someone (the boss
   lives by his clock), does that person ever act against it? That is a finding, however clever the reason in the code.
3. **Deducibility.** For each route, list the facts the player must know. For each fact, find where the player SEES
   it in the world before they need it. Check the schedule for it: a claim in premise.md is not proof. "Trial and
   error" is a failure.
4. **Consistency.** Does any loss happen without a cause the player could see? Does any win or loss contradict what
   the player saw? Does the fiction contradict itself? If the card sets a rule (nobody leaves before the boss), do the
   other characters keep it where the player can see it, and does breaking it cost them something visible? A rule
   that binds only the player is a finding.
5. **The joke.** What is the funny moment? Does it happen on screen as a picture? Is it funnier than the obvious
   version?
6. **Name and card.** Compare first-read.md with the real design. Every gap between the two is a finding. The name,
   the card and the badge (the card's icons) name the trouble, never the way out. Does any of them hint at a route, a
   mechanic or a tool? If so, that is a finding, and the verdict is at best `fixable`.

Reply with the report, under 450 words. Your reply is saved as report.md.
- The first line is exactly `Verdict: works`, `Verdict: fixable` or `Verdict: broken`.
  - `works`: a first-time player would understand the situation and could deduce every route.
  - `fixable`: there are problems, but the premise holds.
  - `broken`: the premise itself does not make sense.
- Up to 5 problems, most serious first. For each: the problem, the moment a player hits it, and one concrete fix.
- The best thing about the level, in one line, so it survives the fixes. It must work on screen without premise.md.
