# Kaizen log

This log is about how we work, not about any one level. Every entry ends in a change to a prompt, a brief, a check,
a tool or a doc. A promise to try harder is not a change.

## When to run a pass

- After every round of work: a fix round, a cold-read sweep, a merge batch or a playtest.
- When the same kind of problem shows up a second time.
- When a check misses a bug that a playtest or a later check found.

## What a pass does

1. **Measure.** Record blockers per level per round, problems that come back next round, rounds until a level
   passes, cost, and how many times a check missed something.
2. **Find the root cause.** Take the biggest waste and ask "why" until the answer is about our process: "our
   pipeline never asked X", not "level Y was wrong".
3. **Make one small change.** Prefer a check or a tool over a rule that someone has to remember.
4. **Write it down here.** At the next pass, say whether each change worked. If a change didn't help, revert it.

## Standing rules (from earlier passes)

- **A check that never passes is suspect.** If a check passes nothing across 10 or more verdicts, run it on a level
  we trust before we fix any more levels against it.
- **Sense comes before the build.** A new premise gets a `sense` read (`--pass sense`, about $0.11) before anyone
  builds it. Its blockers are fixed in the prose first, because a believability problem in the idea itself only
  costs more later.
- **A problem that recurs is a premise problem.** If the same problem comes back in two rounds, stop fixing it
  locally. Change or cut the idea behind it.
- **Run the tests after every merge.** Do this before the next merge or commit, even for a prompt-only branch.
- **A test must not read the live repo's state.** Records and levels change, so a test reads fixtures or temp
  roots, never the live repo.

## Passes

### 2026-11-15, pass 1: a whole day where no level passed

**Measures:**

- 42 old-style stage verdicts, 0 of them `works`, Meeting included.
- First `sense` sweep: 8 of 8 levels `fixable`, with 21 blockers (1 to 5 per level).
- One problem came back in 3 rounds: Saturday's boss accepting his own face.

| Waste | Root cause | Change |
|---|---|---|
| Hours of fix rounds against a verdict that could never pass | The review prompt had a quota ("up to 5 problems"), and any problem at all made the verdict fixable. No one asked why nothing ever passed. | Graded blockers, a ledger and calibration (tools, merged). The rule "a check that never passes is suspect". |
| Every level failed on believability once we checked it | Believability was never checked. Levels were built first and judged on pictures and legibility, and builders treated a view cone as the reason people don't notice. | The `sense` pass. Three believability rules in DESIGN.md. The rule "sense comes before the build". |
| One problem patched locally for three rounds | Each fix round handled findings one at a time, with no memory across rounds. | The ledger promotes recurring problems to blockers. The rule "a problem that recurs is a premise problem". |
| main broke on a prompt-only merge | I merged without running tests, and one test read the live repo's records. | The rules "run the tests after every merge" and "a test must not read the live repo's state". The test is fixed (b57960b). |
| Stale stall alarms, and an agent's ID lost after a context summary | The watch script read its agent list only at start. Agent IDs lived only in conversation history. | The watch script now rereads its list from a roster file every loop. A fleet roster file is kept beside it. |

**Next pass checks:**

- Did the ledger keep sense blockers from coming back?
- How many rounds does a level now take to reach `works` on sense?
