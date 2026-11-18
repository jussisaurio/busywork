# Current plan: make one level hilarious and full of stuff

The goals are in `DESIGN.md`, "What makes it fun". This file is the work in progress toward them. Update the status
lines when a step moves; delete the file's steps when they are done (the lasting parts belong in DESIGN).

The level is **Meeting**. Nothing rolls out to another level until Jussi has played Meeting and said it is more fun.

Jussi is the only playtester and the only judge of funny. Agents pitch wide; only what Jussi ticks is built.

| # | Step | Status |
|---|---|---|
| 1 | Pitch sheet for Meeting: toys, stupid ways to lose, bigger payoffs. One line each: what you do, what you see, the punchline. In `src/levels/meeting/PITCHES.md`, with a tick box per pitch | done 2026-11-18: 33 pitches plus 5 from blind play |
| 2 | Blind play of Meeting by a fresh agent that has not read the level. Every "tried it, nothing happened" becomes a pitch | done 2026-11-18. It also found things that read wrong (bottom of PITCHES.md); not fixed yet |
| 3a | Engine: the endings shelf. Every distinct ending seen is kept per level and shown as pictures; no blank slots, no count | merged 2026-11-18. Not tried in a real browser. The three meeting-table endings look alike at shelf size |
| 3b | Engine: a toy (a prop plus a reaction, no route effect) costs a few lines and does not upset the gate. First measure what one costs today | measured 2026-11-18: a reaction-only prop is about 20 lines; a hunted item is about 100 and cannot be kept off the routes. Proposal: a `level.toys` field run by its own mechanic, cosmetic only, with a gate check that toys change no outcome. Not built |
| 4 | Jussi ticks pitches | done 2026-11-18. His reasons are in `PITCHES.md`; the patterns are in DESIGN, "Jussi's taste" |
| 5a | Build slice 1 in Meeting (below) | started 2026-11-18 |
| 6 | Jussi plays Meeting for ten minutes | waiting on 5a |
| 5b | Build slice 2, adjusted by what he says after playing | waiting on 6 |

Decided by Jussi:
- The typing penalty stays. Levels add punishments specific to the mistake on top of it.
- No blank slots for unfound routes. A found route may still show its icon.
- You can leave by the elevator at any time. It is always a loss.

Decided by the overseer (say so if wrong):
- "Lin takes the fall" is a win, like the Kev one.
- Coffee can be poured on things. On a person it is slapstick (wet and cross, not hurt) and loses the day.
- The projector should be noticed by someone who sees or hears it, not known at once. It changes the projector
  route's timing, so it is its own change, in slice 2.
- GitHub issues are not used. This file is the tracker, because every agent reads the repo and not the website.

## Slice 1 (engine first, then the cheapest things that add the most)
Engine:
- `level.toys`: a prop plus a cosmetic reaction, a few lines each, with a gate check that no toy changes an outcome.
- Route slots show only what was found.
- An owner who takes his thing back walks over for it (today it leaves your hand from across the room).
- The harness bugs from the blind play.

Meeting:
- The fire door: push it and the reader blinks red. Open it for the locked-out boss: the Good Samaritan loss.
- The elevator: leave at any time, and lose.
- The restroom: knock when it is taken; go in; wash off the mustard, with Kev nudging you to.
- Coffee: into the ficus (toy); into a typewriter (a loss).
- The picture war, with Lin's and Kev's irritation plain to see.
- Kev without coffee dozes off.
- A set of plain fails (shadow puppets is one). "Where were you?" for the restroom and your desk. The bib.
- The campfire: both routes in one loop.

## Slice 2 (after Jussi has played)
Typing on any typewriter; a red stapler; the wall clock (reuse the other level's mechanic); giving things to people
and crowding them; locked out together; the flip chart; Lin takes the fall; soot face, the foam and the noticed
projector; Lin's hunt escalating; panic spill. Desk phones only if they come as a general prop.

## Queued, not started
- **Blind play with pictures, not words** (Jussi agreed, 2026-11-18). Today the harness tells the blind player what
  things are, in words that come from the level's own data, so it cannot find a drawing nobody can read. The harness
  keeps driving; at each stop the agent gets the rendered frame with no caption and says what it thinks it sees.
  `shots.mjs` already renders frames from harness plans. Build it before the next blind play.
- `tools/round.mjs`: the "quiet last third" flag should apply to builders only; dates in the table.

Open: whether a complete set of endings gets a tick.

How it is run: one overseer, one Opus lead, fresh Opus agents per task. The lead reports branches; merging is
`tools/merge.mjs`.
