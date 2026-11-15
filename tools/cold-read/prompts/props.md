Read card.txt (the game's name and its mission card) and things.md: every item and piece of furniture in the
office, why it is there, and what the player can do with it.

Your question: does each thing belong in this office, and look as usable as it is?
For every thing in things.md, ask:
- Why is it in an ordinary office, today? A thing with no everyday reason to be there points at the solution.
- Does it look usable? A thing that looks usable but is not (a coffee machine you can't use) misleads the player;
  so does a usable thing that looks like scenery.
Do not judge the routes, the people or the jokes.

Reply with your report. Your reply is saved as report.md.
- The first line is exactly `Verdict: works`, `Verdict: fixable` or `Verdict: broken`.
  - `broken`: the room is a set of puzzle pieces, not an office.
- Then one line per thing: `- <thing>: fits|odd|pointless|misleading — <why>`.
  `pointless`: no everyday reason to be there. `misleading`: it looks usable and isn't, or the other way round.
- Then the problems, graded as below. A pointless or misleading thing is a blocker; an odd one is a `should` or a
  `nit`.
Under 450 words.
