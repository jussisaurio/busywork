# Design jam: BUSYWORK, the 4 PM Meeting

Two agents: **ideator** (pitches) and **critic** (reviews). The coordinator (the main Claude session) set this up
for the game's designer. Everything you need about the game is in `../DESIGN.md` (read it fully first) and
`../CONTRACTS.md`; the code is in `../src` (rules: `src/play/rules.js`, end of day: `src/play/scenario.js`,
NPC behaviour: `src/sim/npcs.js`, schedule: `src/data/schedules.js`, level: `src/data/level.js`).

**Read-only on the project.** Write only inside `design-jam/thread/`. You may run the headless tools
(`node tools/test-sim.mjs`, `node tools/routes.mjs`, or a scratch script using `src/agent/harness.js`) to check a
timing claim, but put any scratch script in `design-jam/scratch/`, never in `src/` or `tools/`.

## Design constraints (non-negotiable)
- No text, no tutorials. Only emoji bubbles, animation and sound. A rule is learned by failing once and *seeing why*
  on screen. "Make the consequence visible" beats "explain it".
- About 2.5 real minutes per loop, deterministic, Groundhog Day: the player learns by replaying.
- Two win routes (projector, keycard) plus a sandwich combo. No deliberate dead ends or red herrings: a dead end
  costs a whole loop. Toys that react visibly and teach NPC behaviour are fine.
- Prefer ideas that reuse the existing systems (witnesses ❗👉, owners taking things back, held items, pretend,
  the mustard evidence rule, the scene-of-the-crime rule) over new systems.
- Already decided (factor it in): holding **pretend while standing still** (the phone pose) will fast-forward time
  ×6 anywhere, not only at your desk. Walking with the folder stays at normal speed.

## Topic A: what gets you blamed at 4:00? (level 1)
Today: if a route is achieved but you're not in the meeting room at 4:00, everyone stares at your empty chair 🪑❓😠👉
and you're BLAMED (a fail). It was added for an "alibi" beat (walk in at 3:50 and look innocent).
The designer's feedback, verbatim:
> One thing I'm not sure of anymore is if it makes sense that you not being present in the meeting room gets you
> blamed for the projector incident. It should probably be related to coffee-specific evidence somehow.

Answer: what coffee-specific evidence blames you for the projector, how the player sees it, how they learn to
avoid it, and whether it's a real decision or a chore. Also decide what happens to the **keycard** route and to
**attendance** (keep, drop, or replace). Note what exists: eating Lin's sandwich leaves mustard on your sweater
(evidence while she hunts); after spilling, the cup currently vanishes from your hands; Kev blames whoever is
at the scene while the projector is broken.

## Topic L: new levels (replaces the old Topic B; ids L1, L2, …)
"The 4 PM Meeting" is level 1. Pitch further levels: each one a new one-line mission card, a new deterministic
office day (or similar workplace), new or returning cast, and 2–3 ways to win. Each level should teach **one**
new idea on top of what level 1 taught (a new kind of witness, a new tool, a new constraint), and it should be
built mostly from the existing engine (schedules, sightlines, witnesses, owners, held items, pretend, evidence).
Per level: **Mission card** (the only text) · **Setting & cast** · **The day** (key schedule beats with times) ·
**Routes** (how each win works, and its timing trap) · **New lesson** (the one new thing, and the fail that teaches
it) · **Reuse** (existing systems) · **Why it's funny** · **Cost** (S/M/L, what's new in code and art). Bonus: how
the levels chain into an arc (does anything carry between levels?).

## Protocol
**Mailbox.** One file per message in `design-jam/thread/`, named `NNN-<from>-<TYPE>.md` (NNN = 000, 001, …, the
next free number). Files are write-once: never edit or delete an earlier message. Before writing, read every
file in `thread/` in order.

**Header.** Every message starts with:
```
from: ideator | critic
type: RUBRIC | PITCH | REVIEW | REVISE | FINAL
re: <message numbers / idea ids this answers, or ->
```

**Message types.**
- `RUBRIC` (critic, once, first): what you will judge on, and the hard constraints you found in the design and code
  (timings, sightlines, rules) that any idea must respect. ≤ 400 words.
- `PITCH` (ideator): up to 3 Topic A ideas (ids A1, A2, …) and up to 3 levels (L1, …, format above). Per A idea:
  **Hook** (one line) · **On screen** (what the player sees, no text) · **Rule** (precise, in terms of existing
  systems) · **Learned by** (the fail that teaches it) · **Interactions** (routes, NPCs, timings, mustard, pretend)
  · **Cost** (S/M/L and what changes in code).
- `REVIEW` (critic): per idea: **Verdict** KEEP / REWORK / KILL · scores 1–5 for fun, readability, discovery
  (no-text fit), systemic fit, cheapness · **Strongest objection** · **Exploit / degenerate strategy** (if any) ·
  **Required fix or question**. Be hard to impress. Check claims against the code and schedule.
- `REVISE` (ideator): answer every REWORK with a changed version, defend at most one KILL with a new argument,
  and add at most one new idea per topic. Keep the ids (A2 → A2′; new ideas get the next id).
- `FINAL` (critic): a ranked shortlist (max 2 for Topic A, max 2 levels). For each: the buildable rule
  spelled out, what changes in code, and the open risks. Then one paragraph each: the recommendation for Topic A, and which level to build next and why.

**Order.** 000 RUBRIC (critic) and 001 PITCH (ideator) are written in parallel. Then: 002 REVIEW → 003 REVISE →
004 REVIEW → 005 FINAL. One more REVISE/REVIEW pair only if the critic asks for it in 004. Then the jam ends.
Each message ≤ 900 words, except PITCH, REVISE and REVIEW: ≤ 1600.

**Doorbell.** After writing a message, ping the other agent with `SendMessage` (load it with ToolSearch
`select:SendMessage` if needed), `to` = their agent id, with a one-line message: `mailbox: NNN-<from>-<TYPE>.md`.
Don't put the content in the ping: the file is the message. Then end your turn. If the ping fails, say so in
your final reply ("PING FAILED: NNN") and the coordinator will ring for you. Don't ping when you're waiting
for nothing (e.g. the critic after 000, if the pitch isn't there yet). After FINAL, the critic pings `main`
instead.
