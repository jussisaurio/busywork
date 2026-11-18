# How to make a level

A level is one folder in `src/levels/` plus one line in `src/levels/index.js`. A level normally needs no engine change
(`src/sim`, `src/play`, `src/render`, `src/core`, `src/agent`). If it does, make that a separate, deliberate change. The worked example is `src/levels/fixture/`,
"Happy Birthday to Nobody": one room, two people, an owned cake and one lure. Read it end to end first. Every field
is in `CONTRACTS.md`. The game-wide rules are in `DESIGN.md`.

## 1. Copy a folder

```sh
cp -r src/levels/fixture src/levels/stapler
rm src/levels/stapler/golden.json src/levels/stapler/golden-render.json
```

- In `src/levels/stapler/index.js`, set `id: 'stapler'`. The id must equal the folder name: the tools find a level's
  goldens by it.
- In `src/levels/index.js`, add `import stapler from './stapler/index.js';` and `stapler,` in `levels`.
- Run `node tools/test-levels.mjs`: it lists each load problem with its field path.

| File | What it holds |
|---|---|
| `index.js` | map and legend, spots, zones, interactions, items, roles, mechanics, day, meeting, routes, `initialWorld` |
| `cast.js` | the people, their schedules (sorted by `at`) and their behaviour hooks |
| `presentation.js` | the mission card (`TITLE`), decor, looks, end scenes |
| `harness.js` | what the AI harness prints: event lines (`describe`), `landmarks`, names, map key |
| `gate.js` | what the fuzzer and the gate need: targets, milestones, `mustUse`, `renderEvents`, golden plans |
| `route-checks.js` | scripted plays and the outcome each must reach (`tools/routes.mjs`). Rewrite the copied ones. |

`src/levels/fixture-inspection/index.js` is the smallest level, all in one file.

The end scenes (`end-scenes.js`) paint on the shared kit; draw only what is yours. Do not copy a helper from another
level: if two levels need it, it belongs in the kit.
- `src/render/palette.js`: `C` (the named colours) and the seat pairs `[fill, dark]` `OXBLOOD`, `MUSTARD`, `TOMATO`,
  `TEAL`, `OLIVE`, `NAVY`, as chairs and casts take them. Never write these hex values in a level.
- `src/render/tableau.js`: `TAB` (the picture window), `person(t)` (a figure state facing you), `bubble`,
  `floorCarpet`, `floorTiles`, `backWall`, `confetti`.
- `src/render/tableau-furniture.js`: `officeRoom(ctx, wallH)` (carpet plus back wall), `chair(ctx, x, y, colours,
  scale, dir)` (a seat pair at a scale, facing `dir`), `woodDesk(ctx, cx, y, w, h)` (a plain wooden desk, front on),
  `walnutDesk(ctx, x, y, w, { depth, skirt, r, shadow, hi })` (a rounded walnut desk top).

A level needs all of these. The validator rejects a level without them at load:
- `id`, and `title` (two mission lines and a badge).
- `map` of at most 30×17 tiles. There is no camera: a smaller map draws at the top left, a larger one is cut off.
- `spots.player_desk` (you start there; `sit` and `goto my_seat` go there).
- `day.start`, `day.gatherAt`, `day.meetingAt` (the cue times, such as `clockRedAt`, have defaults).
- `cast`, `zones`, `interactions` (`{}` is fine), and `meeting` (its `room` is a zone).
- `routes`, and `outcomeOrder` with every route id in it once.
- `initialWorld()` that returns `items: []` and every world field the level reads.
- an `icon` for each item type (what people say for it), and a `draw` (how it is drawn: DESIGN.md "Visual
  language").

The tools also need `gate` and `route-checks.js`. `roles.authority` is optional: without one, nobody assigns work
and only an inspection can catch you.

## 2. Add a mechanic by data

A mechanic is engine code that a level turns on with data: you name the people, spots and world fields. The
fixture's smoke alarm is a lure (`lures: LURES` in the level object):

```js
const LURES = [{
  npc: 'doreen',                         // only Doreen answers it
  when: (w) => w.popcorn === 'burning',  // the pull: the nuke_popcorn interaction sets it
  override: 'alerted', plan: 'alarm', label: 'smoke alarm',
  spot: 'microwave',                     // she walks here
  react: { wait: 0.5, says: [{ say: ['🚨', '❗'], kind: 'alert' }], event: 'doreen:alerted' },
  work: {                                // and fans it for 4 game minutes
    override: 'fanning', minutes: 4, progress: 'fanProgress',
    start: { set: { popcorn: 'smoking' }, event: 'popcorn:fanning' },
    done: { set: { popcorn: 'binned' }, event: 'popcorn:binned', says: [{ say: ['😮‍💨'] }] },
  },
}];
```

| Mechanic | Level data | Example |
|---|---|---|
| lure | `lures` | `src/levels/fixture/index.js` |
| hunt | `hunts` (a behaviour hook starts it) | `src/levels/meeting/mechanics.js` (Lin's sandwich) |
| door | `doors` | `src/levels/meeting/mechanics.js` (the boss's keycard) |
| put down | `accepts`, `owner`, `found` on a spot | `src/levels/fixture-putdown/index.js` |
| inspection | `inspections` | `src/levels/fixture-inspection/index.js` |
| attention | `noise` on an interaction, `noises` | `src/levels/fixture-attention/index.js` |
| toy (cosmetic only) | `toys` | `src/levels/meeting/toys.js` (the fire door's bar) |

A toy is the cheap kind: a prop that reacts (a bubble, a sound, a pose, its own drawn state) and changes
nothing. Give a dead-end object a toy instead of nothing; the gate checks it shows and stays harmless.

The header of each file in `src/sim/mechanics/` lists its fields. When a mechanic's event matters, add it to
`gate.milestones` (so the fuzzer can tell runs apart), to `gate.renderEvents` if it changes the picture, and give
it a line in `harness.js` `describe`. The put-down and inspection events have engine milestones already.

## 3. Goldens and the gate

```sh
node tools/test-levels.mjs                                      # every level loads
node tools/routes.mjs --level stapler                           # your route checks
node tools/fuzz.mjs --level stapler --json fuzz.json            # about 3 s
node tools/golden.mjs --level stapler --write --from fuzz.json  # writes golden.json
node tools/golden-render.mjs --level stapler --write            # writes golden-render.json
node tools/golden.mjs --level stapler                           # check
node tools/golden-render.mjs --level stapler                    # check
node tools/gate.mjs --level stapler                             # 7 s (fixture) to 103 s (meeting)
node tools/test-smoke.mjs stapler                              # the real index.html entry: title, day, end screen, retry
rm fuzz.json
```

Before you hand work back, run `node tools/check.mjs`: every test, the routes, and both goldens for every level,
in parallel, in about 10 s. It exits 1 on any failure and prints the tail of each. `node tools/check.mjs` adds
`test-cold-read.mjs`. The goldens alone: `node tools/golden.mjs --all`, `node tools/golden-render.mjs --all`
(without `--level` or `--all` they check only `meeting`).

`golden.json` pins a digest of every event and state for a set of plans, and `golden-render.json` pins drawn frames.
A new level needs `--from`: a plain `--write` re-records the plans already in `golden.json`, and there are none yet.
After a change you meant, re-record and say so in the commit. After a change you didn't mean, the check shows the
first divergence.

The gate fuzzes 30000 days and fails (exit 1) on any of these:

| Check | Fails when |
|---|---|
| `routes` | no plan wins one of the routes |
| `easy` | a win takes 3 plan steps or fewer |
| `random` | random plans win more than 1% of days |
| `crash` | a command throws, or a day never ends |
| each `gate.mustUse` lesson | a win skips it. `{ id, cmd }`: a command with that word ran. `{ id, event }`: that event fired. |

A pass ends with `verdict: PASS: level stapler is ready for a human playtest`. Each route should teach one lesson:
name it in `mustUse` (the fixture's list is empty).

## Cold reads (advice, not a gate)

Fresh LLM readers can review a level as a player would see it (`docs/COLD-READ.md`). A level needs two files for it:
- `premise.md`: the card, the situation, the cast, the ways to win and lose, `## Who does what` and `## Things in the
  office`.
- `shots.js`: the screenshots the picture passes read.

`node tools/cold-read.mjs --status` shows each pass: works, fixable, broken, unreadable, stale or not read. The gate
prints the same state after its verdict. It is advisory and never fails the gate. A blocker is a reader's opinion:
weigh it, and do not cut a joke to clear one.

## 4. Play it

- In the browser, add `?level=stapler` to the game URL.
- In the AI harness: `node tools/play.mjs new s1 --level stapler`, then `node tools/play.mjs s1 "goto microwave"
  "interact"`. `node tools/play.mjs help --level stapler` lists the commands.

## Traps

- **A mechanic acts only on the NPCs its data names.** A lure moves its `npc`, a door stops its `npcs`, nobody else.
  Attention is the one exception: a noise turns every head in earshot, unless its `npcs` limits it.
- **Never add a `world` field in engine code.** Level 1 would see it, and its goldens digest its world. Keep a
  level's state in its own `initialWorld()`.
- **Cast order is behaviour.** NPCs update in cast order and their events fire in that order. Each NPC's rng is
  seeded from its id. Reordering or renaming the cast changes the day.
- **A comment can eat code.** A `//` in the middle of a one-line object literal makes the rest of the line a comment.
  Once this silently dropped `sneaky: true`: the level loaded and ran, the action just stopped being sneaky. Put
  comments at the end of a line, and trust the gate and the goldens, not your reading.
- **No `Math.random`, `Date` or `performance.now` in gameplay.** The same inputs must give the same day.
- **Event names and payloads are digested.** Renaming an event changes the goldens.
- **Name each voice after its cast id.** A `say()` with no voice uses the owner's id as the voice name.
- **`at()` counts from 2:30 PM.** Another start: `at('9:30', START)`, with 24-hour times after noon.
- **Templated events go in `gate.renderEvents` by hand** (`<authority>:workAssigned`, `<type>:eaten`, ...).
- **Desk looks depend on `decor.zoneSeeds` names.** A desk in zone `kitchen` is a kitchen table, in `office` an
  executive desk, elsewhere a work desk. With no `decor.deskOwners` spot facing it, it faces a sitter to its south.
- **`decor.props` find their tile by map letter**, not by draw or kind.
- **The harness map shows your map letters**, marks seen floor `*` only on `.`, `:` and `D`, and its default key
  names only the base letters. Explain yours in `harness.mapKey`.

## The design rule

Teach through consequences, not text. The mission card (`TITLE.mission`, two lines, and `TITLE.badge`) is the only
words in a level. When a playtester doesn't get something, make the consequence more visible: a pose, a sound, an
object that changes. Don't add words. See "Design principle: no hand-holding" in `DESIGN.md`.
