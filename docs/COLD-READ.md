# Cold reads: does the level make sense to someone who didn't build it?

The fuzzer proves a level can be won. It cannot prove the level makes sense. Two levels reached the human playtester
with problems any outsider would have caught:
- **"Kev's Hoodie".**
  - The stakes meant nothing: why delete a review the boss would just write again?
  - The solution could only be guessed: nothing ever showed that the IT guy was allowed at the boss's computer.
  - The name only made sense after solving the level.
- **Every level.** Emoji stood in for people, which nobody could read.

A cold read is a review by a fresh reader who sees only what a player would see. A level is not ready for a human
playtest until it passes all three stages. `tools/gate.mjs` enforces this for every level except the fixtures (ids
that start with `fixture`).

## The three stages
| Stage | The reader sees | The reader judges | When |
|---|---|---|---|
| **premise** | Step 1: the card alone. Step 2: the card, step 1's reading, `premise.md` and the level's own source files (not `shots.js`). Its prompt adds the engine rules every level relies on (`tools/cold-read/prompts/engine.md`). | Stakes, motivation, deducibility, consistency, the joke, the name. | At the first playable cut, and whenever the card or premise changes. |
| **pictures** | Step 1: the card and the screenshots from `shots.js`, numbered `01.png`, `02.png`, ... with no names and no intents. Step 2: a second reader compares step 1's reading with the intents. | Whether each picture says what it must. | Before the level goes to a human, and whenever the stage goes stale. |
| **replay** | Step 1: the card and one strip of frames per route check, with captions that give only the clock and what the player knows. Step 2: a second reader compares those readings with what each run really was and with `premise.md`'s ways to win and lose. | Whether a player could tell why each loop ended, and which of their actions caused it. | Before the level goes to a human, and whenever the stage goes stale. |

Each step is a separate fresh reader, so nothing the reader learns later can colour their first read.

The premise reviewer reads the level's files, not the engine's, so `tools/cold-read/prompts/engine.md` gives them the
engine's rules (pretending hides what you carry, a schedule time is when someone sets off, and so on). Keep it to
rules that hold in every level, true to DESIGN.md and the engine, and never a level's solution. Add a rule when a
review reports an engine behaviour as missing or wrong.

Verdicts are `works`, `fixable` or `broken`. A reply whose first line is not a verdict is recorded as `unreadable`,
which the gate treats as a failure. The gate needs `works` from every stage, for the current inputs.

## Setup
The pictures and replay stages draw with `@napi-rs/canvas`. Install it once, into a folder git ignores:
```
npm install --prefix tools/.deps @napi-rs/canvas
```
`BUSYWORK_CANVAS_DIR` points the tools at another copy, if you have one. The premise stage needs no canvas.

## Running it
```
node tools/cold-read.mjs --level <id> --stage premise     # build the bundles, run the readers, record the result
node tools/cold-read.mjs --level <id> --stage pictures
node tools/cold-read.mjs --level <id> --stage replay
node tools/cold-read.mjs --status                         # every non-fixture level: each stage's verdict, fresh or stale
node tools/shots.mjs --level <id>                         # look at the shots yourself: tools/.shots/<id>/
node tools/shots.mjs --level <id> --replay                # and the replay strips: tools/.shots/<id>/replay/
```
- `cold-read.mjs` draws the shots and strips itself. You do not need to run `shots.mjs` first.
- Each step runs through `claude -p` in a new temp folder that holds only that step's bundle. The reader has two tools,
  Read and Glob, and no other access. Steps that do not depend on each other run at the same time.
- Options: `--model <m>` picks the readers' model. `--keep` keeps the bundles after a successful run (a failed run
  always keeps them and says where).
- A `fixable` or `broken` verdict lists its problems. Fix them and run the stage again. Do not argue with the reader:
  if a fresh reader misread it, so will the player.

### Without `claude -p`
1. `node tools/cold-read.mjs --level <id> --stage <stage> --bundle-only` prints each step's folder, its prompt file,
   where its reply goes, and whether it is ready.
2. Run a fresh agent in each ready step's folder with that prompt. Save its reply to the reply file.
3. Run `--bundle-only` again. A step 2 bundle is ready once step 1's reply is saved.
4. When the last step's reply is saved, run `--record <that reply file>`. It writes the section like a normal run.

If the inputs change between these runs, `--bundle-only` starts a new manual run.

## The record: `cold-read.md`
`src/levels/<id>/cold-read.md` has one section per stage. A new run of a stage replaces its section. Each section
holds:
- the verdict (the first line of the last step's reply)
- the date, the commit and the model
- a hash of the stage's inputs, and what went into it
- a table of the steps, with each one's time and cost, and the stage's wall-clock time (steps can run at the same
  time)
- every step's reply, verbatim

A stage is fresh while its inputs still hash to the recorded value. Every stage's inputs include the full text of
the prompts its readers get (`tools/cold-read/prompts/`), so changing a prompt makes the stages that use it stale.
The other inputs are:
- **premise**: the card and `premise.md`
- **pictures**: the card, `shots.js` (names, commands, intents) and the bytes of every rendered shot
- **replay**: the card, `route-checks.js`, `premise.md`'s ways to win and lose, and every frame and caption

The PNG bytes are the same on every run on one machine. Fonts and the canvas version change them, so a stage recorded
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
- `## Card` must hold the card's lines exactly as the level has them. If not, the stage does not run.
- The replay stage needs `## Ways to win` and `## Ways to lose`.

## shots.js (in every level folder)
```js
// Each shot: harness commands from the start of the day, and what the picture must tell a first-time player.
export default [
  { name: 'start', cmds: [], intent: 'Your desk, the boss behind glass, the clock on the wall.' },
  { name: 'kev-fixes', cmds: ['pretend until 3:06'], intent: 'Kev types at the boss\'s computer while the boss watches.' },
  // ...every usable object, each route's key cause and effect, every end card
];
```
- The reader never sees the names or the intents. The comparer does.
- Each shot is drawn at 1280 x 800, the size of a player's window.
- A shot whose commands end the day draws the end card as it looks 2 seconds after it comes up.

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
`node tools/gate.mjs --level <id>` adds one check per stage, `cold-read:premise`, `cold-read:pictures` and
`cold-read:replay`. Each passes only when the record says `works` and the stage is still fresh. A failing check says
why (no cold read yet, the verdict, or what changed since) and gives the command to run. The gate reads only the
record and the current inputs. It never runs a reader. Checking pictures and replay freshness draws the shots and
strips, so it needs the canvas.
