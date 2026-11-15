# Cold reads: does the level make sense to someone who didn't build it?

The fuzzer proves a level can be won. It cannot prove the level makes sense. Two levels reached the human playtester
with problems any outsider would have caught:
- **"Kev's Hoodie".**
  - The stakes meant nothing: why delete a review the boss would just write again?
  - The solution could only be guessed: nothing ever showed that the IT guy was allowed at the boss's computer.
  - The name only made sense after solving the level.
- **Every level.** Emoji stood in for people, which nobody could read.

A cold read is a review by a fresh reader who sees only what a player would see. A level is not ready for a human
playtest until it passes every pass below. `tools/gate.mjs` enforces this for every level except the fixtures (ids
that start with `fixture`).

## The passes
Each pass is one reader (or two, in steps) with one narrow question. Its reader is told to ignore everything outside
that question: other passes check the rest. A pass is a small spec in `PASSES` in `tools/cold-read.mjs`: its inputs,
its steps and prompts, the answer it gives per item, and its verdict rule. Each pass records its own section in
`cold-read.md`, with its own input hash.

The text passes come first. They are cheap (no code, no pictures) and catch design errors before any picture is made.

| Pass | The reader sees | The question | Per item | The past failure it must catch |
|---|---|---|---|---|
| **title** | Step 1: the card alone. Step 2: the card, step 1's guesses, the ways to win and lose. | Does the name or the card hint at the way out? | miss / near / **leak** | Early Bus: "Early" in the name gave away "make someone early". |
| **sense** | The card and the ways to win and lose, as prose. | Would every route, winning and losing, get past a real, half-awake boss? Does every NPC act for a reason a real person would have? | sensible / stretch / **nonsense** | Layoffs' hoodie route: the boss takes you for Kev, who he knows went home. |
| **motives** | The card and `## Who does what`. | Does every NPC act for a reason shown before it happens, and keep his own rules? Does the card's rule bind coworkers too? | motivated, binds / thin / **unmotivated, contradicts, only-you** | The boss walks under his own clock without looking at it. |
| **props** | The card and `## Things in the office`. | Why is each thing in this office? Does it look usable exactly when it is? | fits / odd / **pointless, misleading** | Early Bus: stepladders with no reason to be there; a coffee machine that looked usable and wasn't. |
| **joke** | The card and the ways to win and lose. | What is the joke in each route? Is any a dull chore? Is there a payoff? | funny, payoff / mild, chore, flat, undescribed (all `should`: unfunny is not a blocker; "undescribed": premise.md doesn't describe the end card) | A route that is only fetch, wait, carry. |
| **premise** (broad) | Step 1: the card alone. Step 2: the card, step 1's reading, `premise.md` and the level's own source files (not `shots.js`), with the engine rules (`engine.md`). | Stakes, motivation, deducibility, consistency, the name: is it legible to an implementer? | (none: problems only) | "Kev's Hoodie": the stakes meant nothing. |
| **verbs** | Step 1: the verb sheets alone, panels numbered. Step 2: the reading, the sheets labelled, the engine's account of each panel. | Does each verb make sense for its item, and look like it? | fits / odd / **wrong** | Eating the resignation letter left mustard. |
| **faces** | Step 1: every distinct bubble, cropped, alone. Step 2: the reading, each bubble and its frame, where it came up. | What does each bubble say, alone and in its moment? | clear / vague / **misread** | The clock glyph; 🤷 read as a blob; the face-❓ bubbles. |
| **tells** | Step 1: for each of the player's actions in the route checks, the frame before and after, side by side, captioned with the clock and where the player stands. Step 2: the reading and what the engine says was done. | Can you see what changed without being told? | visible / faint / **invisible** | The crooked clock; the boss's glance. |
| **outcomes** | Step 1: the card and the last 3 frames (with the end card) of every route check. Step 2: the reading, how each run really ended, the ways to win and lose. | Does a win look like a win and a catch like a catch? Does the end card match the last frame? Does a loss show which step broke? | clear / unclear / **wrong** | Early Bus, run 6: the end card did not match what happened. |
| **pictures** (broad) | Step 1: the card and the screenshots from `shots.js`, numbered, no names, no intents. Step 2: the reading against the intents. | Does each picture say what it must? What would you try? | reads / partly / misread (per shot) | |
| **replay** (broad) | Step 1: the card and one strip of frames per route check, captioned with the clock and what the player knows. Step 2: the readings against the runs and the ways to win and lose. | Could a player tell why each loop ended, and which of their actions caused it? | explained / partly / unexplained (per run) | |

- **Preambles.** The text passes start from `text.md`: an ordinary office worker, not a game designer. They never get
  `common.md`, whose game rules ("clothes are identity") would make the reader judge like an implementer, and never
  the engine rules. The narrow picture passes start from `focus.md`; the broad passes from `common.md`.
- **Items.** A narrow pass's reply starts `Verdict: works | fixable | broken`, then one line per item:
  `- <item>: <answer> — <one line why>`. The record keeps the tally. A bold-listed (last column) answer is a blocker.
  A narrow report with no item lines is `unreadable`.
- **The tells limit.** The tells pass shows the player's own actions (interact, put, sit). State changes made by
  NPCs (a lure pulling someone, a glance) are the replay pass's to show.

Each step is a separate fresh reader, so nothing the reader learns later can colour their first read.

The premise reviewer reads the level's files, not the engine's, so `tools/cold-read/prompts/engine.md` gives them the
engine's rules (pretending hides what you carry, a schedule time is when someone sets off, and so on). Keep it to
rules that hold in every level, true to DESIGN.md and the engine, and never a level's solution. Add a rule when a
review reports an engine behaviour as missing or wrong.

Verdicts are `works`, `fixable` or `broken` (see the grades above). A reply without its verdict line or its
`## Problems` is recorded as `unreadable`, which the gate treats as a failure. The gate needs `works` from every pass, for the current inputs.

## Grades and the ledger
Every pass's last step ends its prompt with `prompts/grades.md`, so every pass uses the same scale. (It is a file of
its own, not part of `common.md`, because the text passes never get `common.md`.)
- **No quota.** The reader lists every problem in its question's scope, each graded:
  - `blocker`: a player would misunderstand a route or a cause, a person or thing acts as it never would in a real
    office, or the name or card leaks the way out
  - `should`: it hurts, but misleads nobody
  - `nit`: polish

  The report ends with `## Problems` and one `- <grade>: <problem> — <fix>` line each, or `- none`.
- **The verdict counts blockers only.** `works` when there are none, `fixable` when there are any, whatever the
  reader's verdict line says (the record notes when they differ). `broken` stands when the reader says it. The
  blockers are the listed ones, a narrow pass's bad items, and the earlier problems still there. A report without
  its verdict line or its `## Problems` is `unreadable`.
- **The ledger.** When the pass already has a record, its open problems (every blocker and should, not the nits) go
  to the last step as `earlier.md`, numbered E1, E2, .... The reader marks each `fixed`, `still there` or `no longer
  applies` under `## Earlier problems`, before listing new ones. One still there (or not marked) is promoted to a
  blocker and tagged "recurring: premise-level?": a problem that survives a round of fixes is often in the premise,
  not the pixels. A record from before the grades has no open list; its last report goes in `earlier.md`, and the
  reader numbers its problems. The ledger is not an input: it does not make a pass stale.
- **Calibration.** `--calibrate` runs passes on a reference level (one the user is happy with), with no ledger, and
  records them in `tools/.shots/<id>/calibrate.md`, never the level's record. If that level can't get `works`, the
  prompt is wrong: read each blocker, and fix the prompt when a real office would shrug at it.

## Setup
The picture passes (verbs, faces, tells, outcomes, pictures, replay) draw with `@napi-rs/canvas`. Install it once, into a folder git ignores:
```
npm install --prefix tools/.deps @napi-rs/canvas
```
`BUSYWORK_CANVAS_DIR` points the tools at another copy, if you have one. The text passes need no canvas.

## Running it
```
node tools/cold-read.mjs --level <id> --pass sense         # build the bundles, run the readers, record the result
node tools/cold-read.mjs --level <id> --pass text          # the five narrow text passes, at the same time
node tools/cold-read.mjs --level <id> --pass faces,tells   # a list, at the same time
node tools/cold-read.mjs --level <ref> --pass sense --calibrate   # a reference level, read cold: should come out works
node tools/cold-read.mjs --level <id> --pass all           # every pass, at the same time
node tools/cold-read.mjs --status                          # every non-fixture level: each pass's verdict, fresh or stale
node tools/shots.mjs --level <id>                          # look at the shots yourself: tools/.shots/<id>/ (and each one's clock)
node tools/shots.mjs --level <id> --replay                 # and the replay strips: tools/.shots/<id>/replay/
node tools/shots.mjs --level <id> --verbs                  # and the verb sheets: tools/.shots/<id>/verbs/
node tools/crop.mjs --in <png> --out <scratch>/c.png --x 300 --y 360 --w 400 --h 280   # zoom into part of a picture
```
- Passes share no readers, so several run at the same time. The pictures they share (strips, sheets) are drawn once.
- `--stage` still works as another name for `--pass`.
- To look closely at part of a picture, use `tools/crop.mjs`, not a script of your own. Every argument is named and
  checked, and it refuses to write into the repo (except `tools/.shots/`). A hand-made crop script with positional
  arguments once wrote a blank PNG named `280` into the main repo's root; the gate now fails on any picture at the
  repo root (`stray`).
- `cold-read.mjs` draws the shots, sheets and strips itself. You do not need to run `shots.mjs` first.
- Each step runs through `claude -p` in a new temp folder that holds only that step's bundle. The reader has two tools,
  Read and Glob, and no other access. Steps that do not depend on each other run at the same time.
- Options: `--model <m>` picks the readers' model. `--keep` keeps the bundles after a successful run (a failed run
  always keeps them and says where).
- A `fixable` or `broken` verdict lists its problems. Fix them and run the pass again. Do not argue with the reader:
  if a fresh reader misread it, so will the player.

### Without `claude -p`
1. `node tools/cold-read.mjs --level <id> --pass <pass> --bundle-only` prints each step's folder, its prompt file,
   where its reply goes, and whether it is ready.
2. Run a fresh agent in each ready step's folder with that prompt. Save its reply to the reply file.
3. Run `--bundle-only` again. A step 2 bundle is ready once step 1's reply is saved.
4. When the last step's reply is saved, run `--record <that reply file>`. It writes the section like a normal run.

If the inputs change between these runs, `--bundle-only` starts a new manual run.

## The record: `cold-read.md`
`src/levels/<id>/cold-read.md` has one section per pass. A new run of a pass replaces its section. Each section
holds:
- the verdict (from the blockers, above), the item tally and the problem tally (blocker, should, nit)
- the ledger (each earlier problem and its mark) and the open problems the next run's reader gets
- the date, the commit and the model
- a hash of the pass's inputs, and what went into it
- a table of the steps, with each one's time and cost, and the pass's wall-clock time (steps can run at the same
  time)
- every step's reply, verbatim

A pass is fresh while its inputs still hash to the recorded value. Every pass's inputs include the card and the full
text of the prompts its readers get (`tools/cold-read/prompts/`), so changing a prompt makes the passes that use it
stale. The other inputs are:
- **title**, **sense**, **joke**: `premise.md`'s ways to win and lose
- **motives**: `premise.md`'s `## Who does what`
- **props**: `premise.md`'s `## Things in the office`
- **premise**: `premise.md`
- **verbs**: the bytes of every verb sheet, numbered and labelled, and the panels' intents
- **faces**: `route-checks.js`, and every bubble (alone and in its frame) with where it came up
- **tells**: `route-checks.js`, and every before/after picture with what the engine says was done
- **outcomes**: `route-checks.js`, the ways to win and lose, and each run's last frames and captions
- **pictures**: `shots.js` (names, commands, intents) and the bytes of every rendered shot
- **replay**: `route-checks.js`, the ways to win and lose, and every frame and caption

So an edit to `## The joke` stales none of the narrow passes, and an edit to `## Ways to lose` stales title, sense,
joke, outcomes and replay (and premise, which reads the whole file).

The PNG bytes are the same on every run on one machine. Fonts and the canvas version change them, so a pass recorded
on another machine can show as stale. Run it again there.

## premise.md (in every level folder, kept true to the level)
```
# <Level name>
## Card
The two lines, exactly as in presentation.js.
## Name
The name, and why it is the name. It names the trouble, never the way out.
## The situation
Who you are. What you want. What happens at the deadline if you fail. Why succeeding prevents it.
## Cast
For each person: who they are, then each beat of their routine with its everyday reason (lunch, a smoke, a habit).
## Who does what
Each person's afternoon, in plain prose, as a story: what they do, when, and why, and where the player sees the
reason before the act. Say how the card's rule binds them too. No commands, ids or code: the motives reader is an
ordinary person.
## Things in the office
Every item and piece of furniture the player can see: why it is in an ordinary office today, whether the player can
use it, and what it looks like. Say so when something looks usable and isn't. No ids or code: the props reader is an
ordinary person.
## Ways to win
For each route:
- the steps
- every fact the player must know to find them
- for each fact, when and where the player SEES it in the world: the clock time, and what is on screen
## Ways to lose
Each loss, and the picture that explains it.
## The joke
The funniest moment, described as a picture.
```
- The name, the card and the badge name the trouble, never the way out (DESIGN.md). If any of them hints at a route,
  a mechanic or a tool, the premise review reports it, and the verdict is at best `fixable`.
- The first heading is the level's name. `card.txt`, which every step 1 reader gets, holds that name, the card's two
  lines and the card's icons (the badge). Nothing else from `premise.md` goes in it.
- `## Card` must hold the card's lines exactly as the level has them. If not, no pass runs.
- title, sense, joke, outcomes and replay need `## Ways to win` and `## Ways to lose`; motives needs `## Who does
  what`; props needs `## Things in the office`. Without its section a pass does not run, and `--status` and the gate
  say which section is missing.
- The text passes see the sections as prose, without the rest of the file. Write them so they stand alone.

## shots.js (in every level folder)
```js
// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
// Optional: beat: true or seconds, to draw the beat of a catch or of the deadline, not its end card.
export default [
  { name: 'start', cmds: [], intent: 'Your desk, the boss behind glass, the clock on the wall.' },
  { name: 'kev-fixes', cmds: ['pretend until 3:06'], intent: 'Kev types at the boss\'s computer while the boss watches.' },
  // ...every usable object, each route's key cause and effect, every end card
];
```
- The reader never sees the names or the intents. The comparer does.
- Each shot is drawn at 1280 x 800, the size of a player's window.
- A shot whose commands end the day draws the end card as it looks 2 seconds after it comes up. That includes
  commands that stop at a catch: the harness's next command would run the caught beat out to the end of the day, so
  no command lands in it. To draw the caught beat itself (whoever caught you, the alert up, 0.8 seconds in, before
  the end card), give the shot `beat: true`: `{ name: 'caught', cmds: [...], beat: true, intent: '...' }`.
- The deadline's outcome has a beat of its own too: about 2 seconds of the room reacting, then the end card. No
  command can stop in it either: the player is locked, so a command that starts in a beat runs it out. Give the shot
  `beat: <seconds>`: the shot runs on from where its commands stopped, into the beat that is up or comes up next
  (within 2 seconds), and draws it that many seconds in: `{ name: 'redraw', cmds: ['pretend until 5:00'], beat:
  0.8, intent: '...' }`. The clock line then says how far in (`landed 5:00 PM, 0.8 s into the deadline's beat`).
  `beat: <seconds>` works for a catch's beat too (1.6 seconds long); `beat: true` there means 0.8 seconds in.
- A shot with a `beat` whose commands neither stop in a beat nor reach one within 2 seconds is an error, and so are
  seconds past the end of the beat.
- Each shot reports the game clock its commands landed on, next to its intent: `node tools/shots.mjs --level <id>`
  prints it, and the comparer's `intents.md` has it on each line (`05.png (kev-fixes, landed 3:06 PM): ...`). An
  intent is a builder's words about a moment; the clock says which moment was drawn. The comparer marks a shot whose
  intent describes another moment `wrong moment`, and the fix is the shot's commands.
- Two shots that render pixel-identical are an error: `shots.mjs` writes the PNGs, then names both shots and exits 1,
  and the pictures pass does not run (its status gives the same error). The later shot shows nothing the earlier
  one doesn't, so one of them is not the moment its intent describes. The usual cause: a shot meant to show the
  caught beat, without `beat: true`, comes out as the end card another shot already shows.

### Timing a shot: `pretend until`, then `wait`
In harness commands, `Ns` counts real seconds of play (60 frames each), not game time. Pretending in place (seated at
your desk, or standing with the phone) runs the game 6 times faster (forced work 8 times), so `pretend 5s` from 2:30
lands at 2:47, about 18 game minutes on, where `wait 5s` lands at 2:33. Pretending while walking (`goto <target>
pretend`, the folder) does not fast-forward. So:
- To land on a moment, give it in game time: `pretend until 3:20` (a clock time) or `pretend 2m` (game minutes;
  `0.5m` works).
- Then, to let a beat play out, `wait 1.5s`: real seconds at normal speed, as a player watches it (1 real second is
  0.6 game minutes). `wait` stops pretending, so the picture shows you standing as yourself.
- Use `pretend Ns` only for a short hold where the pretend pose must be in the picture, and give it in game minutes
  when the clock matters: `pretend 0.5m`, not `pretend 5s`.

The harness keeps this meaning. About 300 commands in the goldens (`src/levels/*/golden.json`, `golden-render.json`)
say `pretend Ns` or `busy Ns`, and making `s` mean game time would move every one that pretends in place. Making
`shots.mjs` alone read `pretend 5s` differently would move no golden, but the same command would then mean two
things, and builders copy commands between route checks, goldens and shots. Game time already has its own unit, `m`.

## The verb sheets
`shots.js` holds the pictures a builder chose, and builders shoot their routes. Nobody pictured what the engine's own
verbs look like on a level's items, so a level 1 mustard stain once reached a playtester who ate a resignation letter.
`tools/lib/verbs.mjs` draws one sheet per item in `level.items`, with no plan search. The item goes straight into the
player's hand at an empty tile that nobody watches, and each sequence is a fresh day:
- carrying it: walking, pretending standing (held to your ear), pretending walking
- what a tap of E does with it in hand when nothing else is in reach (a level 'self' row, else drop): before (the
  prompt), during (an action of 0.5 seconds or more), after
- when holding E does something else (eating): before, E held (the preview pose), during, after
- each other 'self' verb that takes it but that E does not reach there: its result only
- it on the floor a step away after a drop, then picked up again
- put on each spot that takes it (`putdown.js`): before, during, after. A spot that holds another item at day start
  is not drawn: a spot holds one item.

Each panel is a close-up around the player, with the top bar's hand slot in its corner. The verbs pass shows them
alone (not with the shots). Step 1 gets each sheet with the panels numbered only. Step 2 gets the same file with each panel's verb on it, and `intents.md` gets the engine's
account of each panel: the verb's row and what it changed (your hand, `player.smeared`, world flags, events, thoughts).
Panels where someone reacts to the player are marked there, not avoided.

## The replay strips
`tools/lib/replay.mjs` plays each route check through the harness and draws a frame when:
- the player finishes an interaction
- a speech or thought bubble comes up (once it has popped in)
- a noise is made, or a lure pulls someone
- the day ends (the end card, 2 seconds after it comes up)

Nobody picks the frames by hand. Moments less than 0.75 seconds apart share a frame, unless that would lose a bubble
or put two of the player's actions in one frame.
A run keeps at most 20 frames: the end card, every one of the player's own moments, then an even spread of the others.
Frames are 960 x 600, the game's own view size, so that a dozen runs fit one reader. Step 1 readers get batches of
about 60 frames (whole runs), and the batches run at the same time.

The captions give only what the player knows: the clock, "You used the thing here" with where the player stands,
"You hear a sound", and the day's end. They never name the interaction.

## What a picture shows: normal speed
In the game, bubbles, sightlines, ripples and particles last a fixed number of real seconds. Pretending runs the
game 6 times faster (forced work 8 times), so in real play a bubble covers 6 times more game time while you pretend.
The harness pretends with no real time at all. Without a fix, a picture taken at 3:29 could show a bubble from 3:24
as if it were a reaction to what is on screen now.

Both `shots.mjs` and the replay strips draw each effect as a player at normal speed sees it at that clock time:
- `playerView` (`tools/lib/draw.mjs`) notes when each effect appears, in game seconds.
- When a frame is drawn, each effect is aged by the game time since it appeared. Effects older than their lifetime are
  left out.
- After the day ends, the end card's real seconds count too.

The game itself is not changed: the harness's own effects age as they always do. The harness gives
`createHarness({ level, onFrame })` a hook that runs after every frame, for this.
## The gate
`node tools/gate.mjs --level <id>` adds one check per pass: `cold-read:title`, `cold-read:sense`, ... ,
`cold-read:replay`. Each passes only when the record says `works` and the pass is still fresh. A failing check says
why (no cold read yet, the verdict, what changed since, or the missing `premise.md` section) and gives the command to
run. The gate reads only the record and the current inputs. It never runs a reader. Checking the picture passes'
freshness draws what they show, so it needs the canvas. The gate also fails on a picture file at the repo root
(`stray`, `tools/lib/stray.mjs`).
