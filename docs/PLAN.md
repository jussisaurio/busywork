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
| 5a | Build slice 1 in Meeting (below) | done 2026-11-18 (see "Slice 1 status"). Gate passes. Not seen in a browser |
| 6 | Jussi plays Meeting | under way since 2026-11-18. His notes: `src/levels/meeting/PLAYTEST.md` (not committed until he says so; the repo is public). Fixes: "Playtest round 1" below |
| 5b | Build slice 2, adjusted by what he says after playing | partly built during the playtest (below). The rest waits for a lead and a full round |

Decided by Jussi:
- The typing penalty stays. Levels add punishments specific to the mistake on top of it.
- No blank slots for unfound routes. A found route may still show its icon.
- You can leave by the elevator at any time. It is always a loss.
- A boss who is looking for the cup and finds it in your hand catches you, in his office as anywhere else.
- The fire door is a real fire door: anyone pushes out from inside; getting back in needs the card or someone coming
  through. If an NPC can do a thing, so can you.
- Every computer can take the coffee. To set the cup down you target the desk, not the computer.
- The wall clock stays a toy: nobody acts on the wrong time.
- Vision cones are drawn to their true reach.
- The boss may force you out of the restroom ("might be funny": on trial).
- Confirmed funny by him in play: the go-home card with the boss ringing, the crickets, coffee into a computer, the
  Samaritan revenge lockout, the stack of work that shows the back-to-your-desk penalty.

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

### Slice 1 status
- Merged: `level.toys` with its gate checks; route slots; two harness bugs; the owner walks over (opt-in per item,
  on for Meeting's sandwich and keycard only, because turning it on everywhere changed outcomes in fixture,
  discreet-packaging and audit); the fire door and both Good Samaritan losses; go home; the restroom (knock, hide,
  wash, Kev's nudge, blamed from the restroom); the picture war.
- Merged later the same day: the ficus, coffee into a typewriter, Kev dozing; the fix for the cup in the boss's
  office (above). `gate.mjs --level meeting` passes.
- Merged last: the plain fails by what you are doing at 4:00 (cup in hand, on the phone, in the room: shadow
  puppets), "where were you" typing at your desk, the bib, the campfire, Kev's doze drawn with rising z's.
- Slice 1 is built. Skipped: "where were you" in the boss's chair (his office is private; needs new player state).

## Playtest round 1 (2026-11-18, all merged)
The game is published at https://jussisaurio.github.io/busywork/ (GitHub Pages from main; every push redeploys).
`PLAYTEST_LEVEL` in `src/config.js` boots Meeting with no level menu; `?dev` gives the menu.

- Engine: Tab no longer pauses; restart is a 1 s hold of R; a toy can make a person walk over (`stand`, drawn only),
  and its change lands when he arrives; `walkThrough`; `authority.idleOkIn`; put spots take `shown` and `lies`.
- Meeting fixes: the restroom hold meter and wash hint; Lin keeps the sandwich she takes back; every plant takes
  coffee; Kev's whole body dozes; the cup sits on the machine and on desks; the projector win blames nobody.
- Meeting additions: the walkable balcony (endings `balcony`, `snatched`, `together`); walking in behind the boss;
  the restroom holds one (Lin knocks and waits, the boss ejects you); typing on any free keyboard; the hallway clock
  (cosmetic); coffee into any computer (`computer`); the mug on Lin's desk (`lin`, `linHungry`) and the boss's
  (`bossMug`).
- Not reproduced: the boss seeing the card from beyond his cone. The sight test matches the cone; the drawn cone
  fades over its last third and may read short. Waiting on Jussi: draw the cone to its true reach, or not.
- Overseer and builder calls he may overrule: "together" counts as the keycard route; seated at your desk with the
  full cup, E pours into your own computer; Lin's and the boss's desks take the empty mug only; the boss never
  notices the mug on his own desk before 4:00; Kev tilts the picture the other way and
  only Lin straightens it; typing at another desk gives no busy credit.

### Known rough edges (prune as they are fixed)
- A late tattle while you are on the balcony teleports you to your desk.
- A toy walk is drawn only: the person's real body, and what it sees, carries on along its route. Unchecked whether
  a catch can come from where the person does not appear to stand.
- The walk-in frame does not show the player; the balcony is small on the map; the pounding bubble covers the reader.
- The wall clock is small; its tilt and wedge are hard to see. No eject pose at the restroom (bubbles only).
- Put-down items bob (an engine fix moved render goldens in four other levels and was backed out).
- Meeting's sim cost is about 1.7x its perf budget after a fix; the budget predates the toys.
- The Samaritan hug is small at map scale. The wash bubble floats over the restroom door.
- `goto kev_desk` / `boss_desk` in the harness stands you inside the seated NPC (shows in the mustard shot). Fixing
  it changes 37 recorded plans; `sit` stopping on soft stops changes 26. Both wait for a decision.
- The shelf's three meeting-table endings look alike at shelf size. The shelf with the new endings is unchecked.
- Nothing new has been seen in a real browser or heard.
- The ficus: your own 🌱 thought covers the plant, and nothing shows the coffee going in.
- The typewriter is drawn as a terminal; the catch is instant and remote (nobody walks over); your face is not
  sooty on the end card; the plant in the fired box could be taken for the ficus.
- The campfire's timing is tight (take the card at about 3:21.6); its shot uses fixed clock times and will break
  first if Lin's glance or the boss's hunt moves. A player may never find it.
- The bib: the sandwich covers Lin's face mid-bite; the ending assumes an 'evidence' catch in Meeting is the mustard.
- The last-cup and phone-call fails are close in spirit. Kev is usually gone by 4:00, so his reactions rarely show.
- Kev's doze is small at map scale (blue z's over his head).
- `play.mjs` help lists some targets twice.
- `check.mjs` in a worktree needs `BUSYWORK_CANVAS_DIR` pointed at main's `tools/.deps`.

## Slice 2 (after Jussi has played)
Built in the playtest round: typing on any keyboard, the wall clock (cosmetic), locked out together, Lin takes the fall.
Left: a red stapler; giving things to people and crowding them;
the flip chart; soot face, the foam and the noticed projector; Lin's hunt escalating; panic spill. Desk phones only
if they come as a general prop.

## Queued, not started
- **Blind play with pictures, not words** (Jussi agreed, 2026-11-18). Today the harness tells the blind player what
  things are, in words that come from the level's own data, so it cannot find a drawing nobody can read. The harness
  keeps driving; at each stop the agent gets the rendered frame with no caption and says what it thinks it sees.
  `shots.mjs` already renders frames from harness plans. Build it before the next blind play.
- `tools/round.mjs`: the "quiet last third" flag should apply to builders only; dates in the table.

Open: whether a complete set of endings gets a tick.

How it is run: one overseer, one Opus lead, fresh Opus agents per task. The lead reports branches; merging is
`tools/merge.mjs`.
