# Kaizen log

This is about how we work, not about any one level. The aim is to let every agent, me included, do good work with
its own judgment. Most failures come from something that got in the way of that judgment: missing context, a
misleading doc, a bad tool, or a rule that told someone what to do instead of what we're after. A pass finds that
obstacle and removes it.

## When to run a pass

After a round of work, when a problem keeps coming back, and when a check missed something a person found.

## What a pass does

1. **Look at what happened.** Blockers per level and round, problems that came back, rounds until a level passes,
   tokens spent (including on work we threw away and on agents woken with nothing to do), and what checks missed.
2. **Find what got in the way.** Ask why until the answer is about our setup: what did the agent not know, not see,
   or get pushed toward?
3. **Remove it.** Give better context, fix the doc or the tool, or delete the rule. Things that have to happen
   every time (tests after a merge) belong in a tool, not in anyone's memory. Don't add a rule.
4. **Write it down here,** and next pass say whether it helped.

## Passes

### 2026-11-15, pass 1: a whole day where no level passed

- 42 stage verdicts, none `works`, Meeting included. The review prompt had a quota ("up to 5 problems") and any
  problem made the verdict fixable, so nothing could pass. Changed: graded problems, a ledger across rounds,
  calibration on a level we trust.
- Every level failed on believability once we checked it. Nothing had asked builders to think about a real office.
  Changed: the `sense` pass, and DESIGN now explains what makes a route believable.
- Saturday's own-face problem came back three rounds running. Patching it locally never worked; cutting the idea did.
- Tokens: about ten messages only acknowledged agents, roughly 1.3M tokens for nothing.

### 2026-11-15, pass 2: the title screens were wrong in five levels

The user found it in seconds: cards with no goal ("At 5:00 the boss reads it out." So what?). The cause was ours.
DESIGN only said what a card must not do ("never the way out"), and the title check only looked for leaks. Doing
less satisfies a ban, so cards drifted toward saying nothing. I never read the cards side by side myself.

The bigger lesson: I answered each failure today with a new rule, and the rules made agents comply instead of think.
Changed:
- The standing rules are gone. DESIGN's card, naming, no-hand-holding and believability sections now say what we're
  after and why, with examples.
- The title check asks whether a player would know what they're playing for, not whether a rule was broken.
- Every card rewritten; tools/cards.mjs prints them side by side.
- tools/merge.mjs trial-merges, merges and runs every test, so "test after merge" is a tool, not a rule.
- Also found: re-running a pass on unchanged inputs inflated its blockers (Saturday sense 1 -> 4). Now a pass with
  unchanged inputs is skipped; `--again` re-reads it cold.

**Next pass:** did the rewritten DESIGN produce better first drafts? Are builders making good calls the docs didn't
spell out?

## Pass 3 notes (in progress)
- Saturday's builder ran the sense read twice and kept the "works". A cold read on main (--again, no history) said fixable, 2 blockers. One read is a sample, not a verdict, and the ledger read is anchored on the old list (it checks old problems, finds fewer new ones). Change: builders report a --again read, once, whatever it says. Watch whether ledger reads and cold reads keep disagreeing; if they do, the ledger is hiding problems.
- Fix rounds keep adding explanations (Kev protests, so Lin must stay quiet, so...). Each beat added to answer a reader creates the next problem. Cutting the beat that needs explaining is usually the fix.
- The verbs read came back "unreadable" with a blocker on Saturday, a level with nothing to carry: the tool sent the reader an empty folder and the reader, rightly, said so. A blocker that no level change can fix just teaches everyone to ignore blockers. Change: a level with no items gets a "nothing to read" record from the tool, with no reader asked.
- Layoffs, two rounds in a row: the reader's fix for a fix ("he gives up hunting before 3:45") was replaced next round by cutting the hunt. Same lesson as above, seen again: ask "what can go?" before "what can be added?".
