# BUSYWORK: The 4 PM Meeting (prototype)

The only text in the game is the mission card:

> **4:00 PM. You promised slides. You made none. Make sure the meeting never happens.**

You are an office worker, so you don't do any real work. The day runs from 2:30 to 4:00 PM, in about
2.5 real minutes at normal speed. The day replays like Groundhog Day: each loop starts at 2:30
at your desk and is identical (deterministic), so you can learn what happens and when.
The only things that carry over between loops are your knowledge, the loop counter and the routes you have found.

## Design principle: no hand-holding
In the spirit of Jonathan Blow's games, the game explains nothing beyond the mission card. Figuring out how it works
*is* the game. The time loop, the rules (tattling, suspicion, contraband, attendance), what the sandwich is for and how
many ways there are to win are all left for the player to discover.
- **The world shows its state.** A broken projector sparks and smokes, Kev works it with his wrench, and the keycard
  hangs on the jacket. The HUD never lists solutions or progress toward them.
- **Hints are environmental**, like the ☕🚫 sticker on the projector. Never tooltips or text.
- **Feedback is fine, exposition is not.** The ❓ meter over the boss's head, a coworker pointing ❗👉 at you with a
  dashed sightline, and the boss marching you to your desk are consequences you can see. A strike counter or
  "you were seen!" text explains a rule, so it is out.
- **Playtest suggestions that ask for more explanation get turned around:** make the consequence more visible
  instead of adding words.
- **The AI harness follows the same rule:** it reports only what a player would see on screen (no fridge contents,
  no rule hints).

## Tone / feel
- Goose energy, office edition. Think Mr. Bean in a tomato-red sweater: one strong silhouette in a muted
  mid-century office (mustard, teal, walnut, beige carpet).
- **Coworkers are tattletales.** Lin or Kev catching you at something sneaky shout and point ❗👉. If the boss is on
  the floor, he hears it and sends you to your desk. If he's out, they wait and tell him when he's back (👉🪪).
  Only **the boss** seeing a sneaky act ends the loop: you're fired, and you carry a box of your things out ("caught").
- Speech is pictograms in bubbles plus Sims-style gibberish babble. Each NPC has a voice.

## Controls
| Key | Verb |
|---|---|
| WASD / arrows | walk |
| E / Space | interact (the nearest valid target shows a ✋ hint) |
| **Shift (hold)**, or P | **PRETEND**: the HONK button |
| R | restart the loop (give up) |
| Esc, or the ⏸ button (top right) | pause; any click, or Esc again, resumes. Losing window focus pauses too |
| M / V | mute / toggle vision cones |

A key legend is always on screen: a key cap and one word for each control ("do", "pretend",
"restart", "pause", "mute", "vision"). It is on the title screen, and in play on the blank wall block under
the open office. Held keys show pushed down. Naming a control is not a hint, so this is the only
text in play.

The player always has a tomato ring under their feet. At the start of each loop, rings ping out
from it ("you are here").

**PRETEND** depends on what you are doing:
- Seated at your desk: you type furiously, and time runs ×6 (fast-forward).
- Walking: you stride with a folder, at a slower speed. Time runs normally.
- Standing still: you take a phone call, and time runs ×6 here too, so you can wait for a window anywhere.
  If you are holding an item, you hold it to your ear like a phone.
  This hides contraband: a keycard or sandwich held to your ear looks like a call.

## Core rules
- **Suspicion:** if the boss can see you and you are not looking busy (and not doing an action; eating doesn't count), his ❓ meter
  fills over 1.6 s. When it is full, he assigns you work. You are sent to your desk and forced to type for 20 game minutes
  (time runs ×8 while you suffer).
- **Sneaky actions** (spill coffee, take keycard, take or eat the sandwich) take 1–2 s. If an NPC sees you for
  0.3 s during the action, it fails. Boss: caught, and the loop ends. Lin or Kev: they tattle ❗👉.
  - **Only Lin knows the sandwich is hers.** To Kev and the boss, taking or eating it is just lunch. Eating where the
    boss can see you is slacking, though: his ❓ fills.
  - Boss on the floor: he hears it. 20 game minutes of desk work.
  - Boss away (restroom, smoking in the lobby): nobody hears. The witness points you out 👉 + what they saw as soon
    as he is back on the floor, and you go to your desk then. A boss locked out for good never hears it.
- **The scene of the crime:** from the moment the projector breaks until it's fixed, Kev blames whoever he sees in the
  meeting room (always) or near its door (within 3.5 tiles, unless you're pretending). Once per break.
- **Owners take their things back:** Lin her sandwich (😠🥪), Kev the coffee (🤤☕ … 😌, with a slurp), if they see
  you carrying it and you are not pretending. That alone is no tattle. Kev only wants the cup after he finds the pot
  empty ☕❓😩. From then on he's craving it, a yawn 🥱☕ every ~4 game minutes, and he'll grab it off you even on his
  way out (one for the road). Before that, a colleague with a cup is nothing to him. If hunting Lin catches you with the sandwich, her hunt is over.
- **The evidence shows.** Eating the sandwich leaves a mustard splat down your sweater for the rest of the loop. If Lin
  sees it while she's hunting (pretending doesn't hide a stain), she knows: 🥪❗👉, a tattle like any other (heard, or
  told late), and her hunt ends. Not hunting, she doesn't look. Kev and the boss never care.
- **Contraband:** if the boss sees you holding the keycard (and you are not looking busy), you are caught.
- **One cup of coffee per loop.** The pot holds the day's only cup. Kev pours it at 2:38 if it's still there (and
  carries it around ☕). Pour it first and he finds the pot empty ☕❓ 😩. There is no refill.
- **Attendance:** if you achieved a route but aren't in the meeting room at 4:00, everyone stares at your empty mustard
  chair 🪑❓ and points 😠👉. You're BLAMED: the loop doesn't count and no route is recorded.
- **Seated NPCs glance around.** Every 5–9 s (the boss: 3–5.5 s) they turn their head 60–125° to one side for 1.3 s.
  The head turn is the telegraph. Glance timings come from a per-NPC seeded RNG, so they are learnable.

## The cast
- **Boss** 👔 (navy suit, wide). Office with glass walls (south and east), top left. His jacket with the keycard hangs on the coat rack behind him.
- **Lin** 👓 (teal cardigan). Her desk is in the open plan. She faces north through the boss's glass wall,
  so she has a clear view of the coat rack. Her sandwich 🥪 is in the fridge.
- **Kev** 🔧 (IT, olive hoodie). He fixes things. He goes home at 3:00 (by elevator).

## The schedule (deterministic)
| Time | Boss | Lin | Kev |
|---|---|---|---|
| 2:30 | desk | desk | desk |
| 2:38 | | | coffee in the kitchen |
| 2:44 | **patrols the open plan** | | desk |
| 2:56 | desk | | |
| 2:58 | | fridge → kitchen table (eats sandwich) | 🎒👋 |
| 3:00 | | | **leaves** (walks to the elevator, ~3:05 gone) |
| 3:07 | | desk (sits ~3:12) | |
| 3:12 | restroom (gone 3:18–3:22) | | |
| 3:22 | desk (sits ~3:29) | | |
| 3:30 | | restroom (gone 3:35–3:37) | |
| 3:33 | 🚬❓ | | |
| 3:35 | takes his **jacket (and keycard)**, smokes in the lobby (🚬 in hand on the way, smoke curling above his head) | | |
| 3:37 | | desk | |
| 3:48 | comes back in through the entrance | | |
| 3:54 | everyone walks to the meeting room | | |
| 4:00 | **MEETING** | | |

Schedule times are *departure* times. Walks take 2–6 game minutes, so the windows under Routes are
measured in a headless run, not read off this table.

## Routes (two ways to win)
1. **Projector** 📽️. Pour the coffee (kitchen), carry it to the meeting room and spill it on the projector
   (it has a ☕🚫 sticker). Kev runs over and fixes it if he is still in the building, even if he is
   walking out. After the elevator dings (about 3:06), nobody can fix it. But Kev drinks the only cup at 2:38,
   so you must pour it before then and keep it hidden (pretend: a cup held to your ear) until he's gone.
   Lesson: timing, twice.
2. **Keycard** 🪪. Steal the keycard from the boss's jacket on the coat rack, behind the boss, in view of Lin
   through the glass. The boss takes the jacket at 3:35, but the card isn't in it. At 3:48 he is locked
   out at the glass entrance and bangs on it 😠🚪🪪 while the meeting fails to happen.
   - Windows: Lin is away ~2:58–3:11 and ~3:30–3:36 (but the boss is at his desk and glances every 3–5.5 s,
     about half of them west at the rack). The boss is out of his office ~3:14–3:28 (but Lin is watching, so wait
     for her to glance away; her glance is about 1.5 s and the action is 1.0 s). A failed try there costs the loop:
     she tells him when he's back (~3:23), and the 20 minutes at your desk run past his 3:35 jacket pick-up.
   - **Combo (stretch):** steal Lin's sandwich before 3:00. When she finds the fridge empty, she hunts for it
     around the open plan until 3:24. That covers the boss's walk to the restroom and gives a clean keycard window.
     During the hunt she must not see the sandwich, in your hands or on your sweater. You can't put it down, and taking
     the keycard needs empty hands, so you have to eat it at some point. Eat it early (at the fridge, unseen) and you're
     marked for the whole hunt. Carry it hidden (typing at your desk, folder stride) and eat it late, somewhere her
     hunt doesn't reach (the coat-rack corner), and you're exposed only on the way out.

At 4:00 the game picks the first result that applies:
- Caught earlier: CAUGHT (fired; you leave carrying a cardboard box).
- Neither route achieved: FAIL. You stand in front of a blank slide with your coworkers staring at you. 🦗
- A route achieved, but you're not in the meeting room: BLAMED (see Attendance).
- Otherwise: WIN, with every route achieved this loop (keycard: boss locked out; projector: projector broken).

The routes you find persist across loops and show as two slots [📽️][🪪] on the HUD and on the title.

## Sightlines (the level is built for these; verify and tune in integration)
- From the boss's desk (4,2) facing south, the coat rack (1,1) is behind his left shoulder. Only a westward glance sees it.
- From Lin's desk (4,9) facing north, she sees the coat-rack spot at about 8.3 tiles, inside her 8.5 radius, through the glass.
- The projector is out of everyone's range from their desks. The danger comes from passers-by (the boss's restroom trip
  along the hallway past the meeting-room door).
- Walking into the boss's office: he sees the doorway. Look busy (folder stride) or his meter fills.

## HUD (icons only)
- The clock is big and always visible. It turns red after 3:50.
- Mission icons only (🕓 📊❌). **No route status chips.** The projector and the keycard show their state in the world.
- Held item, loop number (⟳ 3) and ⏩ while fast-forwarding.
- Route slots: one per route. A found route shows its icon (📽️ / 🪪); an unfound one is a blank slot. They show on the HUD and the title.
- The boss's ❓ suspicion meter appears above his head when it is above 0.

## Out of scope for the prototype
Popcorn/fire alarm/evacuation routes, notebook/journal UI, tutorial text, NPC chit-chat systems,
the player being blocked by NPC bodies, save games, multiple scenarios, mobile controls.

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
