# BUSYWORK (prototype)

BUSYWORK is a deterministic office stealth comedy. Each level is one afternoon at the office that replays like
Groundhog Day. You never do real work. You have one goal and a deadline, and you reach it by learning the day.

This file holds the rules that hold in every level. A level's own cast, schedule, routes, jokes and playtest notes
live next to its code: level 1 is `src/levels/meeting/LEVEL.md`. To build a level, read `src/levels/README.md`. For
the data shapes, read `CONTRACTS.md`.

## The loop
- Every level starts at 2:30 PM, with you seated at your desk. The day ends at the level's deadline
  (`day.meetingAt`, called "the meeting" in the code whatever it is). Game time runs at 0.6 game minutes per real
  second, so a 90-minute afternoon takes 2.5 real minutes.
- Each loop is identical. The same inputs give the same day, so the player can learn what happens and when.
- Only the player's knowledge, the loop counter and the routes found carry over. Each level keeps its own routes.

## The only words: the mission card
The only text in a level is its mission card: two typed lines on the title screen, plus a badge of icons. Everything
else is pictures, motion and sound.

## Design principle: no hand-holding
In the spirit of Jonathan Blow's games, the game explains nothing beyond the mission card. Figuring out how it works
*is* the game: the time loop, the office rules, what each object is for, and how many ways there are to win.
- **The world shows its state.** A broken machine sparks and smokes. Someone fixing it is seen at work on it. The HUD
  never lists solutions or progress toward them.
- **Hints are environmental**: a sticker on a machine, a thing in reach on a hook. Never tooltips or text.
- **Feedback is fine, exposition is not.** The ❓ meter over the authority's head, a coworker pointing ❗👉 with a
  dashed sightline, being marched to your desk: these are consequences you can see. A strike counter or "you were
  seen!" text explains a rule, so it is out.
- **When a playtester asks for an explanation, make the consequence more visible instead of adding words.**
- **The AI harness follows the same rule.** It reports only what a player would see on screen.

## Tone / feel
- Goose energy, office edition. Think Mr. Bean in a tomato-red sweater: one strong silhouette in a muted mid-century
  office (mustard, teal, walnut, beige carpet).
- Coworkers are tattletales. Only the authority (the boss) can end your day.
- Speech is pictograms in bubbles plus Sims-style gibberish babble. Each NPC has a voice.
- Every ending gets a short in-world beat and an end card with a picture, never a paragraph.

## Camera and controls
There is no camera: the whole office is on screen (30×17 tiles), with the HUD band above it.

| Key | Verb |
|---|---|
| WASD / arrows | walk |
| E / Space | interact (the nearest valid target shows a ✋ hint) |
| **Shift (hold)**, or P | **PRETEND**: the HONK button |
| R | restart the loop (give up) |
| Esc, or the ⏸ button (top right) | pause; any click, or Esc again, resumes. Losing window focus pauses too |
| M / V | mute / toggle vision cones |

A key legend is always on screen: a key cap and one word for each control ("do", "pretend", "restart", "pause",
"mute", "vision"). It is on the title screen, and in play on a blank wall block. Held keys show pushed down. Naming
a control is not a hint, so this is the only text in play besides the mission card.

The player always has a tomato ring under their feet. At the start of each loop, rings ping out from it ("you are
here").

## Pretending
**PRETEND** depends on what you are doing:
- Seated at your desk: you type furiously, and time runs ×6 (fast-forward).
- Walking: you stride with a folder, slower than a walk. Time runs normally.
- Standing still: you take a phone call, and time runs ×6 here too, so you can wait for a window anywhere. If you
  hold an item, you hold it to your ear like a phone. This hides contraband and other people's things.

Pretending never hides a mark on you (see Evidence), and it never covers a sneaky action in progress.

## Vision and suspicion
- **Vision cones.** Each NPC sees a cone (default 90° and 7 tiles; each cast member can differ). Walls block sight;
  glass does not. V shows the cones.
- **Seated NPCs glance around.** Every 5–9 s (each cast member can differ) they turn their head 60–125° to one side
  for 1.3 s. The head turn is the telegraph. Each NPC's glance timing comes from its own seeded RNG, so it is
  learnable.
- **Suspicion.** If the authority can see you and you are not looking busy (pretending, or doing an action; an idle
  action like eating doesn't count), his ❓ meter fills over 1.6 s. Otherwise it drains over 3 s. Full, he assigns
  you work: you are sent to your desk and type for 20 game minutes, and time runs ×8 while you suffer.
- **Sneaky actions** take a second or two. If an NPC sees you for 0.3 s during one, it fails. The authority: you are
  caught, and the loop ends. Anyone else: they tattle.
- **Tattling.** A witness shouts and points ❗👉 with a dashed sightline. If the authority is on the floor, he hears
  it and assigns you work. If he is away, the witness keeps a grudge and points you out 👉 (plus what they saw) as
  soon as he is back. An authority gone for good never hears it.
- **Owners.** An action on someone's thing is sneaky only to that owner. To everyone else it is harmless (but still
  slacking if it is idle). Owners take their things back on sight unless you pretend. Just carrying it is no tattle.
- **Contraband.** The authority seeing you hold his thing (and not pretending) means caught.
- **Evidence.** Some acts leave a mark on you for the rest of the loop. One witness, at one moment, reads it as guilt,
  and pretending doesn't hide it.
- **The scene.** After some events, one witness blames whoever he sees at the scene (a room, or near its door unless
  you pretend), once per event.
- **Noise.** Some actions and events make a noise. Everyone in earshot turns to look for a moment. Walls don't stop
  sound.

## Outcomes
At the deadline the game picks the first result that applies:
1. **Caught** earlier: you were fired. (The day ends a moment after the catch.)
2. **Fail**: no route achieved. You stand at the front of the room with nothing to show. 🦗
3. **Blamed**: a route achieved, but you are not in the room. Everyone stares at your empty chair 🪑❓ and points
   😠👉. The loop doesn't count and no route is recorded.
4. **Win**: every route achieved this loop is recorded.

Attendance is a rule in every level: being in the right place at the deadline is part of winning, so nobody wins from
their desk.

## Routes and HUD (icons only)
- A level has a small number of routes (ways to win). Each has an icon and a slot. A found route shows its icon; an
  unfound one is a blank slot. The slots show on the HUD, the title and the end card.
- The clock is big and always visible. It turns red near the deadline (when is the level's choice).
- Mission badge icons only. **No route status chips.** Objects show their state in the world.
- Held item, loop number (⟳ 3) and ⏩ while fast-forwarding.
- The authority's ❓ suspicion meter shows above his head when it is above 0.

## Lessons that hold for every level
These came from playtests of level 1 (details in its `LEVEL.md`).
- **Show the motive.** An NPC who grabs something from you must have shown first, on screen, why he wants it.
  Otherwise he looks like a thief.
- **No deliberate red herrings.** In a 2.5-minute loop with two or three routes, a dead end costs a whole loop.
  Toys that react visibly and teach NPC behaviour are fine.
- **Move the risk to where the play is.** If a setup step is trivially safe, give it a cost that bites later.
- **Each route teaches one lesson** (timing, a sightline, a distraction), and the gate checks that a win uses it.
- **Fast-forward only in place.** ×6 movement is uncontrollable, so the folder stride runs at normal time.
