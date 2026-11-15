# Level 1: The 4 PM Meeting

The mission card:

> **4:00 PM. You promised slides. You made none. Make sure the meeting never happens.**

The day runs from 2:30 to 4:00 PM (2.5 real minutes). There are two routes: break the projector, or lock the boss
out. Game-wide rules (pretending, suspicion, tattling, outcomes) are in `DESIGN.md`. Field shapes are in
`CONTRACTS.md`.

## Where things are
| File | What |
|---|---|
| `index.js` | the level object: day times, meeting frame, routes, `initialWorld`, title |
| `map.js` | `MAP`, `LEGEND`, `SPOTS`, `ZONES`, `ROUTES` (the level's `patrols`) |
| `cast.js` | `NPC_DEFS`: the boss, Kev, Lin, in that order (the order is behaviour) |
| `interactions.js`, `items.js`, `roles.js` | the player's actions, the three items, the office rules' cast |
| `mechanics.js` | Kev's repair (a lure), Lin's sandwich hunt (a hunt), the boss's lockout (a door) |
| `behaviours.js` | hooks: `checkFridge`, `fetchJacket`, `pourCoffee`, `presenter` |
| `harness.js`, `gate.js` | the AI harness's words; the gate's lessons, fuzz targets, milestones, golden plans |
| `decor.js`, `looks.js`, `end-scenes.js`, `sounds.js`, `voices.js` | presentation |
| `golden.json`, `golden-render.json` | recorded by the tools |

`tools/routes.mjs` holds level 1's scripted speedruns (a win per route, the combo, and the near misses).

## The cast
- **Boss** 👔 (navy suit, wide). The authority. His office has glass walls (south and east), top left. His jacket,
  with the keycard in it, hangs on the coat rack behind him. Vision 100°, 8 tiles. He glances every 3–5.5 s, so the
  "Lin is away" windows still carry risk.
- **Kev** 🔧 (IT, olive hoodie). He fixes things. He goes home at 3:00 by elevator.
- **Lin** 👓 (teal cardigan). Her desk is in the open plan, facing north through the boss's glass wall, so she sees
  the coat rack. Her sandwich 🥪 is in the fridge. Vision 100°, 8.5 tiles.

## The schedule
| Time | Boss | Lin | Kev |
|---|---|---|---|
| 2:30 | desk | desk | desk |
| 2:38 | | | coffee in the kitchen (`pourCoffee`) |
| 2:44 | **patrols the open plan** | | desk |
| 2:56 | desk | | |
| 2:58 | | fridge (`checkFridge`) | 🎒👋 |
| 3:00 | | | **leaves** (walks to the elevator, gone ~3:05) |
| 3:04 | | kitchen table (eats) | |
| 3:07 | | desk (sits ~3:12) | |
| 3:12 | restroom (gone 3:18–3:22) | | |
| 3:22 | desk (sits ~3:29) | | |
| 3:30 | | restroom (gone 3:35–3:37) | |
| 3:33 | 🚬❓ | | |
| 3:35 | jacket (and keycard) from the rack (`fetchJacket`), then smokes in the lobby | | |
| 3:37 | | desk | |
| 3:48 | comes back in through the glass entrance | | |
| 3:54 | everyone walks to the meeting room (`day.gatherAt`) | | |
| 4:00 | **MEETING** (`day.meetingAt`) | | |

Schedule times are *departure* times. Walks take 2–6 game minutes, so the windows below were measured in a headless
run, not read off this table.

## The office rules, cast
- **Authority:** the boss. Off duty while `lockedOut` or at the `meeting`; helpless while locked out; deaf in the
  lobby (`outside`).
- **Tattling:** Lin or Kev catching you at something sneaky shout ❗👉. The boss on the floor hears it. While he is in
  the restroom or the lobby, they wait and tell him when he is back (👉🪪).
- **Owners.** Only Lin knows the sandwich is hers: taking or eating it is sneaky only to her. To Kev and the boss it
  is just lunch (but eating where the boss sees you fills his ❓). She takes it back on sight (😠🥪): to the fridge,
  or, if she is hunting, that ends her hunt. Kev claims the coffee only after he finds the pot empty (☕❓😩). From
  then on he yawns 🥱☕ every 6 real seconds (about 4 game minutes) and grabs the cup off you, even on his way out
  (🤤☕ … 😌, with a slurp). Before that, a colleague with a cup is nothing to him.
- **Evidence.** Eating the sandwich leaves mustard down your sweater for the loop. If Lin sees it while she hunts
  (pretending doesn't hide a stain), she knows: 🥪❗👉, a tattle like any other, and her hunt ends. Not hunting, she
  doesn't look. Kev and the boss never care.
- **The scene.** From the moment the projector breaks until it's fixed, Kev blames whoever he sees in the meeting room
  (always) or within 3.5 tiles of its door (unless you pretend). Once per break.
- **Contraband.** The boss seeing you hold the keycard (not pretending) means caught. A dropped keycard he sees goes
  back in his pocket.
- **One cup of coffee per loop.** The pot holds the day's only cup. Kev pours it at 2:38 if it's still there and
  carries it around ☕. Pour it first and he finds the pot empty. There is no refill.
- **Caught** end card: fired, carrying a box of your things out.

## Routes
1. **Projector** 📽️ (`world.projector === 'broken'`). Pour the coffee (kitchen), carry it to the meeting room and
   spill it on the projector (it has a ☕🚫 sticker). Kev runs over and fixes it if he is still in the building, even
   if he is walking out. After the elevator dings (about 3:06), nobody can fix it. But Kev drinks the only cup at
   2:38, so you must pour it before then and keep it hidden (pretend: a cup held to your ear) until he's gone.
   Lesson: timing, twice.
2. **Keycard** 🪪 (`world.bossLockedOut`). Steal the keycard from the boss's jacket on the coat rack, behind the boss,
   in view of Lin through the glass. The boss takes the jacket at 3:35, but the card isn't in it. At 3:48 he is
   locked out at the glass entrance and bangs on it 😠🚪🪪 while the meeting fails to happen.
   - Windows: Lin is away ~2:58–3:11 and ~3:30–3:36 (but the boss is at his desk and glances every 3–5.5 s, about
     half of them west at the rack). The boss is out of his office ~3:14–3:28 (but Lin is watching, so wait for her
     to glance away; her glance is about 1.5 s and the action is 1.0 s). A failed try there costs the loop: she tells
     him when he's back (~3:23), and the 20 minutes at your desk run past his 3:35 jacket pick-up.
   - **Combo (stretch):** steal Lin's sandwich before 3:00. When she finds the fridge empty, she hunts for it around
     the open plan until 3:24. That covers the boss's walk to the restroom and gives a clean keycard window. During
     the hunt she must not see the sandwich, in your hands or on your sweater. You can't put it down (with it in hand
     the ✋ action is eat), and taking the keycard needs empty hands, so you eat it at some point. Eat it early (at the fridge, unseen) and
     you're marked for the whole hunt. Carry it hidden (typing at your desk, folder stride) and eat it late,
     somewhere her hunt doesn't reach (the coat-rack corner), and you're exposed only on the way out.

`outcomeOrder` is `['keycard', 'projector']`: a loop that achieves both lists the keycard first.

The gate's lesson (`gate.js` `mustUse`): every win uses `pretend`.

## The scripted moments
- **Kev repairs** (lure). When `world.projector` is `'broken'` and Kev is on the floor: 🔧❗ (`kev:alerted`), he
  walks to the `projector` spot, works 5 game minutes (`projector:fixing`, `world.fixProgress` 0→1), then
  `projector:fixed` and 👍, and back to his schedule. This can delay his leaving; walking out, he turns back.
- **Kev leaves** (his `leave` entry). At the elevator: `world.kevGone = true`, `kev:left` (the elevator ding).
- **Kev's coffee** (`pourCoffee`). At 2:38, if the pot is full he pours it (`coffee:taken {by:'kev'}`). If not:
  ☕❓ then 😩, he now wants the coffee, `coffee:missing {by:'kev'}`.
- **Lin's lunch** (`checkFridge`, on both her 2:58 and 3:04 entries, so she opens the fridge even if late). Sandwich
  there: she takes it and eats at the kitchen table. Gone: the hunt.
- **Lin's hunt** (hunt). 🥪❓ then 😠 (`sandwich:missing`), then she walks `lin_hunt` back and forth, looking around
  at each point, until 3:24, or until she has it back or saw the mustard. Then 😤 and her schedule.
- **The jacket** (`fetchJacket`, the boss's 3:35 prelude). He walks to the rack, takes the jacket
  (`world.jacket = 'boss'`, `boss:jacket`), and the keycard with it if it is still there. Then he goes to smoke.
- **Lockout** (door). Walking back in at 3:48 without the keycard, he stops at `door_out`: `world.bossLockedOut = true`,
  `boss:lockedOut`, then every ~2.5 s 😠🚪🪪 / 🪪❓ / 👊🚪 with `boss:bang` and a small shake. He stays out all day.
- **Meeting** (gather at 3:54). The boss sits at the head (`presenter`): projector broken, 📽️💥🤷; otherwise he looks
  at `meeting_presenter` 📊👀. A locked-out boss stays outside.

## World and events
`initialWorld()`:

| Field | Values |
|---|---|
| `projector` | `'ok'` \| `'broken'` \| `'fixing'` |
| `fixProgress` | 0..1 while Kev repairs |
| `keycard` | `'rack'` \| `'player'` \| `'dropped'` \| `'boss'` |
| `jacket` | `'rack'` \| `'boss'` |
| `bossLockedOut` | bool |
| `sandwich` | `'fridge'` \| `'player'` \| `'dropped'` \| `'lin'` \| `'eaten'` |
| `coffee` | `'pot'` \| `'taken'` (the poured cup is just held or carried) |
| `kevGone`, `linKnows` | bool |
| `items` | floor items (engine) |

Level events (all `{}` unless shown): `projector:broken`, `kev:alerted`, `projector:fixing`, `projector:fixed`,
`keycard:taken`, `sandwich:taken`, `sandwich:returned`, `sandwich:missing`, `coffee:taken {by}`,
`coffee:missing {by}`, `boss:jacket`, `boss:lockedOut`, `boss:bang`, `kev:left`. With the boss as authority and these
items, the engine's templated events read `boss:suspicious`, `boss:workAssigned`, `keycard:recovered`,
`sandwich:eaten` and `coffee:confiscated`.

## Sightlines
- From the boss's desk (4,2) facing south, the coat rack (1,1) is behind his left shoulder. Only a westward glance sees
  it.
- From Lin's desk (4,9) facing north, the coat-rack spot (2,1) is about 8.3 tiles away, inside her 8.5 radius, through
  the glass.
- The projector is out of everyone's range from their desks. The danger is passers-by (the boss's restroom trip
  along the hallway past the meeting-room door).
- Walking into the boss's office: he sees the doorway. Look busy (folder stride) or his meter fills.

## Map notes
- Zones: `meeting_room` is columns 9–18, rows 1–5 (where you must be at 4:00); `outside` is the lobby, rows 14–16.
- `meeting_player` is your empty mustard chair, the one the room stares at when you are blamed.
- `L` (the glass entrance) is solid for you but `npcPassable`, so NPCs walk through it. `K` coat rack, `F` fridge,
  `C` coffee machine, `J` projector, `P` your desk.

## HUD
- The clock turns red at 3:50 (`clockRedAt`). The wall clock starts ticking at 3:50, tick-tock from 3:55, a tick
  every half minute from 3:57. The projector beam lights the screen from 3:55 (`beamAt`, read by `decor.js`).
- Badge 📊❌. Route slots [📽️][🪪].

## Out of scope for the prototype
Popcorn/fire alarm/evacuation routes, notebook/journal UI, tutorial text, NPC chit-chat systems, the player being
blocked by NPC bodies, save games, mobile controls.

## Playtest log
- **AI playtest 1** (blind agent, text harness, 7 loops). It won the projector route on loop 2, and the keycard route
  on loop 5 via the sandwich combo. Fixes made after it:
  - The NPC arrival pose was overwritten with 'walk', so the boss never looked seated after his first walk.
  - Harness wording: notice → pause → abort, slacking means "not looking busy", the smoke break is announced,
    `continue` at the end of the day, and `sit` when already seated.
  - Not acted on (by design, see "no hand-holding"): requests to explain sticky notes, what counts as slacking and
    what the sandwich is for. The answer is visible consequences, not explanation.
  - Harness made perception-only: notes on your back, the ❓ meter only when it shows, no fridge contents,
    route slots as [📽️][ ? ], and the brief no longer tells the agent that loops are deterministic.
- **Human playtest 1** (Nov 2026). Confusions and what changed:
  - Lin's 📝 reaction (meant: a sticky note on your back, 3 = desk work) read as nothing. Replaced by tattling:
    a visible cause (she points ❗👉, a dashed sightline) and effect (the boss marches you to your desk).
  - The caught end screen's paper stack (meant: buried in paperwork) read as nothing. Now: fired, carrying a box.
  - "How can Lin see through the wall?" The boss's office walls are glass, but they didn't read as glass. Redrawn.
  - Coffee could be brewed endlessly, making the projector route easy. Now one cup per loop (Kev's).
  - Kev saw the projector break and did nothing about the person standing next to it. Now the scene-of-the-crime rule.
  - You could win from your desk. Now attendance: be in the room at 4:00 or be blamed.
  - "Why does Kev steal my coffee?" He reclaimed the day's only cup on sight, but nothing on screen said it was his.
    Now he only claims it after the visible setup (☕❓😩 at the empty pot).
  - "Does Kev know the sandwich is Lin's?" No. Only the owner cares (take and eat are sneaky only to Lin). Eating
    stays useful: it frees your hands for the keycard. No deliberate red herrings: in a 2.5-minute loop with
    two routes, a dead end costs a whole loop. Toys that react visibly and teach NPC behaviour are fine later.
  - "The sandwich is trivial: take it and eat it at the fridge." True: nobody who cares is watching before 3:00, so
    eating erased all risk. Now eating leaves mustard on your sweater, and hunting Lin recognizes it. The risk moves
    from the theft (the setup) to the hunt, which is when the keycard happens.
  - "Kev said he's leaving, then spotted my coffee and stole it. Why?" He was after the day's only cup, but on screen
    he looked like a thief. Now the motive shows: after the empty pot he yawns 🥱☕ every few game minutes, and the
    grab reads as relief, not anger (🤤☕, a slurp, 😌). The grab on his way out stays: it's fair, and it's funny.
  - "I want to fast-forward away from my desk too." The phone pose (pretend, standing still) now runs time ×6
    anywhere. The folder stride doesn't: ×6 movement is uncontrollable.
