# Level 1: The 4 PM Meeting

The mission card:

> **4:00 PM. You promised slides. You made none. Make sure the meeting never happens.**

The day runs from 2:30 to 4:00 PM (2.5 real minutes). There are two routes: break the projector, or lock the boss
out. Breaking the projector leaves you holding the evidence: the empty mug (see Routes). Game-wide rules (pretending, suspicion, tattling, outcomes) are in `DESIGN.md`. Field shapes are in
`CONTRACTS.md`.

## Where things are
| File | What |
|---|---|
| `index.js` | the level object: day times, meeting frame, routes, `initialWorld`, title |
| `map.js` | `MAP`, `LEGEND`, `SPOTS`, `ZONES`, `ROUTES` (the level's `patrols`) |
| `cast.js` | `NPC_DEFS`: the boss, Kev, Lin, in that order (the order is behaviour) |
| `interactions.js`, `items.js`, `roles.js` | the player's actions, the four items, the office rules' cast |
| `mechanics.js` | Kev's repair (a lure), Lin's sandwich hunt and the boss's mug hunt (hunts), the fire door (doors) |
| `clocks.js` | `level.clockFor`: Kev and the cup, the card taken back |
| `behaviours.js` | hooks: `peekOut`, `peekBack`, `checkFridge`, `fetchJacket`, `pourCoffee`, `presenter` |
| `verdict.js` | the 4:00 room's judgement of the mug (`meeting.verdict`) |
| `harness.js`, `gate.js` | the AI harness's words; the gate's lessons, fuzz targets, milestones, golden plans |
| `route-checks.js` | the scripted speedruns `tools/routes.mjs` plays (a win per route, the combo, the near misses) |
| `decor.js`, `looks.js`, `end-scenes.js`, `sounds.js`, `voices.js` | presentation |
| `painters.js` | the level's drawn things: the sandwich, party popper, cricket, empty coffee bag, fire door and balcony |
| `coffee.js` | the office coffee pot as a part other levels borrow: a cup item and a `pour_coffee` row (level 1 keeps its own pot) |
| `shots.js` | the screenshots (with their intents) for the pictures cold read (`docs/COLD-READ.md`) |
| `premise.md`, `cold-read.md` | the card and cast prose the cold readers see; their recorded verdicts |
| `golden.json`, `golden-render.json` | recorded by the tools |

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
| 3:12 | restroom (gone 3:18–3:22), looking in at the meeting-room door on the way (`peekOut`) | | |
| 3:22 | desk (sits ~3:29), looking in again on the way back (`peekBack`) | | |
| 3:30 | | restroom (gone 3:35–3:37) | |
| 3:33 | 🚬❓ (a mug hunt, if one runs, ends 3:34) | | |
| 3:35 | jacket (and keycard) from the rack (`fetchJacket`), then out through the fire door to smoke on the balcony (arrives ~3:44) | | |
| 3:37 | | desk | |
| 3:48 | with the card: 🪪 at the fire door's reader, back in. Without it: locked out on the balcony, banging, until 4:00 | | |
| 3:54 | everyone walks to the meeting room (`day.gatherAt`) | | |
| 4:00 | **MEETING** (`day.meetingAt`) | | |

Schedule times are *departure* times. Walks take 2–6 game minutes, so the windows below were measured in a headless
run, not read off this table.

## The office rules, cast
- **Authority:** the boss. Off duty at the `meeting` and while locked out (`lockedOut`: helpless, deaf on the balcony).
- **Tattling:** Lin or Kev catching you at something sneaky shout ❗👉. The boss on the floor hears it, and a heard
  tattle is a catch (`roles.js` `tattle: 'caught'`). While he is away, they wait and tell him when he is back (👉🪪).
  Caught over the keycard (holding it, or with your hand on it at the jacket), he walks over and takes it back (`world.cardBack`,
  `keycard:takenBack`; the caught beat waits up to 8 s for him); the caught end card shows it on his pocket (😠🪪).
- **Owners.** Only Lin knows the sandwich is hers: taking or eating it is sneaky only to her. To Kev and the boss it
  is just lunch (but eating where the boss sees you fills his ❓). She sees it and comes for it (😠🥪): she walks over and
  takes it at arm's length (items.js `walk`, the engine's claim.js), to the fridge, or, if she is hunting, that ends her hunt.
  Eat it or put it out of her sight before she gets there and she gives up. Kev wants the coffee only after he finds the pot empty (☕❓😩, the coffee
  bag beside the machine is empty). From then on (`clocks.js`): the cup in your hand is yours, and he asks for it
  (☕🥺❓, at most every 20 real seconds, within 4 tiles); set down on the machine or on his desk it looks free, and he
  takes it (🤤☕ … 😌, `coffee:kevTook`); on your desk it is yours and he leaves it alone. Before that, a colleague
  with a cup is nothing to him.
- **Evidence.** Eating the sandwich leaves mustard down your sweater for the loop. If Lin sees it while she hunts
  (pretending doesn't hide a stain), she knows: 🥪❗👉, a tattle like any other, and her hunt ends. Not hunting, she
  doesn't look. Kev and the boss never care.
- **The scene.** From the moment the projector breaks until it's fixed, Kev blames whoever he sees in the meeting room
  (always) or within 3.5 tiles of its door (unless you pretend). Once per break.
- **Evidence that outlives the act.** The spill leaves the empty mug ☕ in your hand. It won't drop (`keep`: not with
  the generic drop, not when the boss marches you to your desk); only a put gets rid of it, at three spots: back on the
  coffee machine, on Kev's desk, or on your own desk. A put takes 0.8 s and is sneaky to everyone.
- **Contraband.** The boss seeing you hold the keycard (not pretending) means caught. A dropped keycard he sees
  is his again: a double take (🪪❗), he walks over, picks it up, holds it up and pockets it with a huff 😤. The
  card lies there until he reaches it: snatch it first in his view and you are caught; snatch it unseen and he
  finds bare floor (🪪❓) and goes back to his day. Seen from the balcony, he heads in for it and the fire door
  locks him out (a card dropped by the fire door is a way to the lockout). Once the boss has seen the dead projector, the mug is his business too: holding it in his
  view (not pretending) means caught, and so does the mug on your own desk (your spot, his find).
- **One cup of coffee per loop.** The pot holds the day's last cup, and the coffee bag beside the machine is empty
  (decor `emptyBag`). Kev pours it at 2:38 if it's still there and carries it around ☕. Pour it first and he finds
  the pot empty. There is no refill.
- **The full cup** is `keep` (only a put gets it out of your hand). Pretend standing and it goes to your ear like a
  phone: Kev, who would ask for it, squints (☕❓) and, if you keep up the act through his squint, decides you're on a
  call (📱🤷) and lets you be (clocks.js). Lower it mid-squint and he sees a cup and asks. Walking (folder) or typing,
  the cup is in plain view.
- **Caught** end card: fired, carrying a box of your things out.

## Routes
1. **Projector** 📽️ (`world.projector === 'broken'`). Pour the coffee (kitchen), carry it to the meeting room and
   spill it on the projector (it has a ☕🚫 sticker). Kev runs over and fixes it if he is still in the building, even
   if he is walking out. After the elevator dings (about 3:06), nobody can fix it. But Kev drinks the only cup at
   2:38, so you must pour it before then and keep it from him until he's gone: in your hand (he asks, never takes) or on your desk.
   Lesson: timing, twice.
   - **The mug** (BATCH1). The spill leaves the empty mug in your hand, and at 4:00 the boss looks from the dead
     projector to the ☕ to whoever has it: in your hand (pretending or not), you're BLAMED, the whole table pointing
     at you. Before that, on his 3:12 and 3:22 walks he looks in at the meeting-room door; a dead projector starts his
     mug hunt (📽️💥 … ☕❓) along the hallway, the coffee machine, Kev's desk and yours, until 3:34.
   - Ways out: put it back on the coffee machine (he shrugs ☕🤷), or plant it on Kev's desk (☕❗, then 😠 and Kev's face;
     at 4:00 the table stares at Kev's empty olive chair: he went home at 3:00). On your own desk: if he sees it there once he knows,
     caught; unseen until 4:00, BLAMED. Lesson: evidence outlives the act.
2. **Keycard** 🪪 (`world.bossLockedOut`). Steal the keycard from the boss's jacket on the coat rack, behind the boss,
   in view of Lin through the glass. The boss takes the jacket at 3:35 and steps out onto the smokers' balcony, but the
   card isn't in it: at 3:48 the fire door won't let him back in. You see and hear him stuck: reader blinking red,
   🪪❓, ✊🚪, 😠🚪🪪, 👊👊🚪, 🚬😤, 🙏🚪, round again from the bang, with bangs, screen shake and a shuddering door. The
   end card shows him pounding on the fire door (🔒🪪👊). With the card, at 3:48 you see him badge in at the fire door
   (🪪, a beep, green light): that teaches the card.
   - Windows: Lin is away ~2:58–3:11 and ~3:30–3:36 (but the boss is at his desk and glances every 3–5.5 s, about
     half of them west at the rack). The boss is out of his office ~3:14–3:28 (but Lin is watching, so wait for her
     to glance away; her glance is about 1.5 s and the action is 1.0 s). A failed try there costs the loop: her shout
     stops your hand, she tells him when he's back (~3:23), and you are caught; he takes his card back.
   - **Combo (stretch):** steal Lin's sandwich before 3:00. When she finds the fridge empty, she hunts for it around
     the open plan until 3:24. That covers the boss's walk to the restroom and gives a clean keycard window. During
     the hunt she must not see the sandwich, in your hands or on your sweater. You can't put it down (with it in hand
     E eats it), and taking the keycard needs empty hands, so you eat it at some point. Eat it early (at the fridge, unseen) and
     you're marked for the whole hunt. Carry it hidden (typing at your desk, folder stride) and eat it late,
     somewhere her hunt doesn't reach (the coat-rack corner), and you're exposed only on the way out.

`outcomeOrder` is `['keycard', 'projector']`: a loop that achieves both lists the keycard first.

The gate's lessons (`gate.js` `mustUse`): every win uses `pretend`; every projector win uses `put` (`routes`).

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
- **The fire door** (`mechanics.js` `DOORS`, the engine's door mechanic). Heading back in from the balcony (the
  `outside` zone), he walks to `fire_door` first. His card in his jacket: 🪪, `boss:badge` (a beep, the reader goes
  green), through. No card: override `lockedOut`, `world.bossLockedOut = true`, `boss:lockedOut` (a rattle), and the
  escalation lines every ~2.5 s with their events (`boss:pockets`, `boss:knock`, `boss:bang`, `boss:pound`,
  `boss:fume`), bang sounds and screen shakes, until the day ends. Only you are near enough to hear.
- **The Good Samaritan** (`interactions.js` `let_boss_in`, `clocks.js` `bossLetIn`). Any other time, pushing the fire
  door's bar is a toy: it opens a crack, the held-door alarm buzzes, the reader blinks red, it swings shut. While he is
  locked out, the same push lets him in: `world.bossLockedOut = false` (the keycard route is gone), `boss:letIn`, the
  door stands open, override `grateful` (off duty, `roles.js`). He comes through and hugs you (`boss:hug`: 🤗, 🙏😊,
  arms round you). Holding his card when he lets go: 🪪❗👉, caught, `outcome.why = 'samaritan'` (end card: you locked
  out on the balcony, he dangles the card inside: 🤗🪪🔒). Not holding it: `world.samaritan`, and at 4:00 a fail with
  `why: 'samaritan'` (end card: his arm round your shoulder at the blank screen: 🚪🤗🦗). The joke: the one kind
  thing you do all day is the thing that sinks you.
- **Just go home** (`interactions.js` `go_home` on the entrance L, interactable `exit`; engine `scenario.js`
  `leaveDay`). Any time, E at the entrance: you walk out through the lobby to the elevator, you are gone
  (`player.hidden`; the rules see nothing), and after a beat the day ends: a fail with `why: 'home'` (end card: on
  the bus, relieved 😌, then the phone in your lap buzzes with the boss's face on it 😬: 🚌📱😠). With Kev on his way
  out (3:00, within 6 tiles) you both wave 👋, `why: 'homeKev'`, and he sits beside you on the bus. The joke: the
  most obvious way out of the meeting works perfectly, and follows you home.
- **The restroom** (`restroom.js`, door R, interactable `restroom`; engine `player.js` `goInside`/`comeOut`,
  meeting `where`). Taken (the boss 3:18–3:22, Lin 3:35–3:37): E knocks (`toys.js` `knock_*`), and they answer
  through the door, cross (🚽😠 / 🚽😤 with their face). Free, hands empty: E goes in; you are hidden (the rules see
  nothing) and pretending still runs the clock. Inside with mustard down you, E washes it off (🧼😌, the tap);
  else E comes out (the flush). Kev, near you while you are smeared, points at his chest and the restroom
  (`mustard`, 👕🟡👉🚽). Inside at 4:00: `outcome.where === 'restroom'`; blamed, the end card is the empty-chair
  table and then you walk in from the right, wiping your hands on your trousers (🪑🚽🙂). The jokes: the boss's
  voice through a toilet door; Kev's helpful mime; and the one place nobody can see you is the one place you can't
  claim you were working.
- **The peeks** (`peekOut`, `peekBack`: the boss's 3:12 and 3:22 preludes). He walks to `meeting_door` and looks in,
  once per walk, even when the projector is fine (a prelude's `pending` sees only the NPC). Projector broken: he
  knows (`_knows`), and his mug hunt starts.
- **The mug hunt** (hunt). 📽️💥 then ☕❓ (`boss:mugHunt`), then he walks `mug_hunt` (meeting door, the coffee
  machine, Kev's desk, your desk) looking around, until 3:34 or until he sees the mug within 3.5 tiles: on Kev's desk
  ☕❗ then 😠 with Kev's face, on the machine ☕🤷 (`mug:found {spot}`). On your desk it's put down's business
  (`my_desk` is yours): caught.
- **The verdict** (`verdict.js`, at the gather, only with the projector broken and the boss in the room). The mug in
  your hand (`why: 'mug'`) or on your desk (`why: 'desk'`): BLAMED, the table staring at you. On Kev's desk with you
  in the room: still a win (`why: 'kev'`), the table staring at Kev's empty chair. End scenes `mug` and `kev`.
- **Meeting** (gather at 3:54). The boss sits at the head (`presenter`): projector broken, he points at it 📽️💥, then
  🙅📊, then 👋🚪 (`meeting:calledOff`); otherwise he looks at `meeting_presenter` 📊👀. A locked-out boss is gone.

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
| `cardBack` | bool: caught over the keycard, the boss took it back |
| `mug` | `null` \| `'player'` (after the spill) \| `'coffee'` \| `'kev_desk'` \| `'my_desk'` (the put spot) |
| `items` | floor and put-down items (engine) |

Level events (all `{}` unless shown): `projector:broken`, `kev:alerted`, `projector:fixing`, `projector:fixed`,
`keycard:taken`, `sandwich:taken`, `sandwich:returned`, `sandwich:missing`, `coffee:taken {by}`,
`coffee:missing {by}`, `coffee:kevTook {spot}`, `coffee:asked`, `boss:jacket`, `boss:lockedOut`, `boss:badge`, `boss:pockets`, `boss:knock`, `boss:bang`, `boss:pound`, `boss:fume`,
`keycard:takenBack`, `kev:left`, `boss:mugHunt`, `mug:found {spot}`, `meeting:calledOff`.
The engine's `item:put {type, spot}` fires for the mug. `outcome.why` carries the verdict's reason. With the boss as authority and these
items, the engine's templated events read `boss:suspicious`, `boss:workAssigned`, `keycard:recovered`,
and `sandwich:eaten`.

## Sightlines
- From the boss's desk (4,2) facing south, the coat rack (1,1) is behind his left shoulder. Only a westward glance sees
  it.
- From Lin's desk (4,9) facing north, the coat-rack spot (2,1) is about 8.3 tiles away, inside her 8.5 radius, through
  the glass.
- The projector is out of everyone's range from their desks. The danger is passers-by (the boss's restroom trip
  along the hallway past the meeting-room door, where he now stops to look in).
- Put spots: `coffee` (22,2) at the machine, `kev_desk` (22,9), `my_desk` (12,9, left of your chair: `sit` wins at P).
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

## Design changes
- **The Mug** (BATCH1, Nov 2026). The projector route's second half: after the spill you hold the evidence. Engine
  seams it needed: timed sneaky puts (`put: s`), `keep` items, a spot owner who ignores what he didn't see put there
  (`unseen`), `meeting.verdict` with `stareAt`, and the gate's `mustUse` `routes`. Kev's empty chair gets the blame:
  the punchline of a win.

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
