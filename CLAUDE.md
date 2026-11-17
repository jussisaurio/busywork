# busywork

An office stealth comedy for the browser. You look busy until the 4:00 meeting, and each level hides a few funny
ways to get out of it. Vanilla JS and canvas, no build step, no package.json. The sim is deterministic: the same
inputs give the same day, and the tools depend on that.

## Where things are

| Read | For |
|---|---|
| `DESIGN.md` | what the game is and why: tone, no hand-holding, the visual language, what makes a route believable |
| `src/levels/README.md` | how to build a level, step by step. Start here for level work |
| `CONTRACTS.md` | reference: every level field, engine module and tool flag. Look things up; do not read it end to end |
| `docs/COLD-READ.md` | the LLM read passes over a level, and how to read their reports |
| `docs/KAIZEN.md` | how we work and what went wrong before. Read "What we got wrong" before running a team of agents |
| `docs/history/` | old plans and audits. Not current; do not follow them |

Code: `src/levels/<id>/` is one level. Everything else in `src/` is the engine (`sim`, `play`, `render`, `audio`,
`core`, `game`, `agent`) and names no level. `tools/` is node scripts.

## Commands

```sh
node tools/serve.mjs                      # play it in a browser
node tools/check.mjs                      # every test, route and golden for every level, about 10 s. Run before every commit
node tools/merge.mjs <branch>             # trial-merge into main, merge, run the full check
node tools/gate.mjs --level <id>          # fuzz a level and print the mechanical verdict (minutes)
node tools/golden.mjs --write --level <id>         # re-record after an intended behaviour change
node tools/golden-render.mjs --write --level <id>  # re-record after an intended visual change
node tools/shots.mjs --level <id>         # screenshots, to look at what a player sees
node tools/perf.mjs --all                 # sim, render and replay cost per level against tools/perf-budget.json
```

A tool run without `--level` checks one default level only. Use `--all` or `check.mjs`.
The canvas build lives in `tools/.deps`; `check.mjs` finds it, a single tool needs `BUSYWORK_CANVAS_DIR=$PWD/tools/.deps`.

## Changing things

- **A level:** work inside its folder. Goldens change only when you meant to change behaviour or pictures; say
  which in the commit. If the same problem shows in two levels, the cause is in the engine: fix it there.
- **The engine:** it is shared by every level. Run the full check. A golden that moves in a level you did not mean
  to touch is a finding, not a file to re-record.
- **Goldens are derived files.** Never merge them by hand: `merge.mjs` re-records them on a conflict and flags any
  plan whose outcome neither side had. Look at each flagged plan.
- **A helper two levels need** goes in the shared kit (`src/render/tableau*.js`, `palette.js`), never copied.

## When a level is done

Winnable is not done. A level is done when all of these hold:

1. `gate.mjs` passes. That verdict is mechanical only.
2. You looked at it: the title card, a day in play, every end scene (`shots.mjs`, or play it). A check that read
   only a builder's report has checked nothing.
3. It is funny, and you can say what the joke is on each route. Nothing measures this, so someone has to own it.
   Before cutting a beat to fix a problem, name the joke it carries. If the fix removes the joke, find another fix.
4. Cold reads are advice. Read the blockers and use judgment; never chase twelve clean passes.

`test-smoke.mjs` (part of the check) boots the real page and plays each level with real keys. It catches a level
that will not start or a frozen frame loop; it does not look at pixels, audio or the mouse.

A person playing it is the real test. Say what you could not judge, not "ready".

## Working with subagents

- Give a builder the goal, the files and what done means (the list above). Tell it what you already know is true.
- Start a fresh agent for each round. A long-lived builder carries stale context and costs more every turn.
- Settle a direction before you send it to anyone. A change of mind sent to six builders is six lots of rework.
- Builders work in worktrees and commit there. Merging is one command, `tools/merge.mjs`; do not hand-merge.
- Record a design decision and who made it in the commit or in `docs/KAIZEN.md`, so later blame lands correctly.
- Run few heavy jobs at once. Fuzzers and read passes starve each other, and a timeout then looks like a failure.
  `BUSYWORK_JOBS=<n>` caps every tool's parallelism.
