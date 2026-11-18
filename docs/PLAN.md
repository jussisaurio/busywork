# Current plan: make one level hilarious and full of stuff

The goals are in `DESIGN.md`, "What makes it fun". This file is the work in progress toward them. Update the status
lines when a step moves; delete the file's steps when they are done (the lasting parts belong in DESIGN).

The level is **Meeting**. Nothing rolls out to another level until Jussi has played Meeting and said it is more fun.

Jussi is the only playtester and the only judge of funny. Agents pitch wide; only what Jussi ticks is built.

| # | Step | Status |
|---|---|---|
| 1 | Pitch sheet for Meeting: toys, stupid ways to lose, bigger payoffs. One line each: what you do, what you see, the punchline. In `src/levels/meeting/PITCHES.md`, with a tick box per pitch | started 2026-11-18 |
| 2 | Blind play of Meeting by a fresh agent that has not read the level. Every "tried it, nothing happened" becomes a pitch | started 2026-11-18 |
| 3a | Engine: the endings shelf. Every distinct ending seen is kept per level and shown as pictures; no blank slots, no count | started 2026-11-18 |
| 3b | Engine: a toy (a prop plus a reaction, no route effect) costs a few lines and does not upset the gate. First measure what one costs today | started 2026-11-18 |
| 4 | Jussi ticks pitches | waiting on 1 and 2 |
| 5 | Build the ticked pitches in Meeting | waiting on 3 and 4 |
| 6 | Jussi plays Meeting for ten minutes | waiting on 5 |

Decided: the typing penalty stays. Levels add punishments specific to the mistake on top of it.

Open: whether a complete set of endings gets a tick.

How it is run: one overseer, one Opus lead, fresh Opus agents per task. The lead reports branches; merging is
`tools/merge.mjs`.
