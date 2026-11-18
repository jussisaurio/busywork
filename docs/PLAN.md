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
| 4 | Jussi ticks pitches, with a few words of why where he has a reaction | **next: waiting on Jussi** |
| 5 | Build the ticked pitches in Meeting | waiting on 3 and 4 |
| 6 | Jussi plays Meeting for ten minutes | waiting on 5 |

Decided: the typing penalty stays. Levels add punishments specific to the mistake on top of it.

Open: whether a complete set of endings gets a tick. Whether the HUD's blank route slots go, now that the shelf shows
endings without blanks.

How it is run: one overseer, one Opus lead, fresh Opus agents per task. The lead reports branches; merging is
`tools/merge.mjs`.
