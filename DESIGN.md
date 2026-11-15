# BUSYWORK (prototype)

BUSYWORK is a deterministic office stealth comedy. Each level is one afternoon at the office that replays like
Groundhog Day. You never do real work. You have one goal and a deadline, and you reach it by learning the day.

This file holds the rules that hold in every level. A level's own cast, schedule, routes, jokes and playtest notes
live next to its code: level 1 is `src/levels/meeting/LEVEL.md`. To build a level, read `src/levels/README.md`. For
the data shapes, read `CONTRACTS.md`.

## The loop
- Every level is one short stretch of a workday. It starts with you seated at your desk, at the level's start time
  (`day.start`, 2:30 PM by default), and ends at the level's deadline (`day.meetingAt`, called "the meeting" in the
  code whatever it is). Game time runs at 0.6 game minutes per real second, so a 90-minute afternoon takes 2.5 real
  minutes. Keep a loop at 90 game minutes or less: the player replays it many times.
- Each loop is identical. The same inputs give the same day, so the player can learn what happens and when.
- Only the player's knowledge, the loop counter and the routes found carry over. Each level keeps its own routes.

## The only words: the mission card
The only text in a level is its mission card: two typed lines on the title screen, plus a badge of icons. Everything
else is pictures, motion and sound.

**The level's name, card and badge name the trouble, never the way out.** Name the stakes or the day's event (The
Audit, Layoff List, Weekend Shift). Never name a mechanic, a tool or a route. A name like "Lights Out" for a level you
win by turning the lights off gives away the solution before the first move. Test: if knowing the name narrows down
how to win, rename it. The level's folder and id are its name too, because the level picker shows them.

**The first time on the card is now**: the loop's start time. A card that opens with the deadline ("5:00 PM. …") is
read as the current time.

## Design principle: no hand-holding
In the spirit of Jonathan Blow's games, the game explains nothing beyond the mission card. Figuring out how it works
*is* the game: the time loop, the office rules, what each object is for, and how many ways there are to win.
- **The world shows its state.** A broken machine sparks and smokes. Someone fixing it is seen at work on it. The HUD
  never lists solutions or progress toward them.
- **Hints are environmental**: a sticker on a machine, a thing in reach on a hook. Never tooltips or text.
- **Feedback is fine, exposition is not.** The ❓ meter over the authority's head, a coworker pointing ❗👉 with a
  dashed sightline, being marched to your desk: these are consequences you can see. A strike counter or "you were
  seen!" text explains a rule, so it is out.
- **Nothing lights up on the first frame.** No interaction is in reach of the seat you start in. A target lit before
  the player has moved points at it, and the player reads it as the way to play.
- **When a playtester asks for an explanation, make the consequence more visible instead of adding words.**
- **The AI harness follows the same rule.** It reports only what a player would see on screen.

## Tone / feel
- Goose energy, office edition. Think Mr. Bean in a tomato-red sweater: one strong silhouette in a muted mid-century
  office (mustard, teal, walnut, beige carpet).
- Coworkers are tattletales. Only the authority (the boss) can end your day.
- Speech is pictograms in bubbles plus Sims-style gibberish babble. Each NPC has a voice.
- Every ending gets a short in-world beat and an end card with a picture, never a paragraph.
- **The end card shows the day as it ended**: what you hold and wear, where each person is. A card that contradicts
  the last thing the player saw makes them distrust every card.

## Visual language: people speak emoji, the world is drawn
**Characters can speak emoji, but emoji are never objects in the level.** A glyph on a tile makes the player guess
what it is: a playtester won a level on "a heat emoji" without knowing it was a microwave. Speech never had that
problem: when Kev says 🔧, he means he will fix something.
1. **Speech is free.** Speech bubbles, thought bubbles and the end card's icon row may use any emoji.
   - When a character means a person, they show that person's face (`'@<castId>'`, `'@player'`), never a stand-in
     (👔 read as a shirt, not as the boss). The engine's bubbles do too: a tattle is ❗👉 and your face, a double
     take is the face of whom you pass for, an inspection's who-check sign is the face it checked.
   - A reaction shows what it is about: the bubble names it, or the speaker faces it at that moment.
   - Speech never carries a fact on its own. The world or a body shows the fact; speech comments on it.
2. **The world is drawn.** Every object on the map or in a hand is drawn as the real object: furniture, devices,
   documents, what people carry. No emoji stands on a tile or in a hand. Level painters
   (`src/levels/<id>/painters.js`) make this cheap.
3. **The state that decides the outcome is drawn on the object.** Every world fact a win or a loss depends on changes
   how something looks on the map (the calendar shows whose face is circled; the burning microwave glows and smokes).
4. **To show you can use something, the object lights up, with the E key cap on its far side from you.** No icon
   hovers over it: an icon over a tile reads as the object. What E does to what you hold shows on you: the held
   thing lights up, and your pose previews the verb before you press (arm held out over the floor: drop; the thing
   lifted toward your mouth: eat).
5. **End cards are drawn scenes.** The icon row under the scene is the punchline, in speech emoji and faces.

How it is held:
- The validator (`src/levels/validate.js`) refuses emoji in the fields that draw the world: an item without a `draw`,
  a prop drawn as `'icon'`, an emoji in a hand (`poses`), an icon on an interaction.
- A runtime check (`render/util.js` `worldEmoji`) records any emoji drawn on the map, in a hand or in an end card's
  scene. `tools/golden-render.mjs` and the gate's `drawn` check fail on it.
- Speech is not checked. (`'#<thing>'` draws the object in a bubble too, but people speak emoji: no level uses it.)
- Levels not yet migrated are on the legacy list (`src/levels/legacy.js`, with the migration steps). They draw as
  before, and the gate fails them.

## Camera and controls
There is no camera: the whole office is on screen (30×17 tiles), with the HUD band above it.

| Key | Verb |
|---|---|
| WASD / arrows | walk |
| E | interact (the nearest valid target lights up, with the E key cap beside it). Holding food: tap drops it, hold E eats it |
| E, Space or Enter | move past the mission card and the end card |
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
  glass does not. V shows the cones. Every cone is as plain as the authority's, since anyone can tell on you; its
  edge firms up while he has you in sight.
- **Seated NPCs work.** At a desk in his own routine a coworker types, silently. His hands stop when he glances,
  turns to a noise or is busy with something else, so a glance reads as a break.
- **Seated NPCs glance around.** Every 5–9 s (each cast member can differ) they turn their head 60–125° to one side
  for 1.3 s. The head turn is the telegraph. Each NPC's glance timing comes from its own seeded RNG, so it is
  learnable.
- **Suspicion.** If the authority can see you and you are not looking busy (pretending, or doing an action; an idle
  action like eating doesn't count), his ❓ meter fills over 1.6 s. Otherwise it drains over 3 s. Full, he assigns
  you work: he points, his order runs to you as a line, you walk to your desk, and a paper stack lands on it. You type until the stack is gone, with
  time ×8. The work is 20 game minutes from his order, the walk included. Progress shows only in the stack.
- **Sneaky actions** take a second or two. If an NPC sees you for 0.3 s during one, it fails. The authority: you are
  caught, and the loop ends. Anyone else: they tattle.
- **Who saw you.** A coworker who sees you do something reportable opens an eye beside her head, its pupil on you.
  The eye widens while she keeps looking. Wide open, she tells, with a hop. A grudge (below) keeps the eye red until
  she has told.
- **Tattling.** A witness shouts and points ❗👉 at your face (whom she means) with a dashed sightline. If the
  authority is on the floor, he hears it: a red line runs from her to him, he turns to her, then to you, and assigns
  you work. A level may set another cost for a heard tattle (you are caught, or its own). If he is away, the
  witness keeps a grudge and points you out 👉 and your face (plus what they saw) as soon as he is back. An
  authority gone for good never hears it.
- **Owners.** An action on someone's thing is sneaky only to that owner. To everyone else it is harmless (but still
  slacking if it is idle). Owners take their things back on sight unless you pretend. Just carrying it is no tattle.
- **Contraband.** The authority seeing you hold his thing (and not pretending) means caught.
- **Evidence.** Some acts leave a mark on you for the rest of the loop. One witness, at one moment, reads it as guilt,
  and pretending doesn't hide it.
- **The scene.** After some events, one witness blames whoever he sees at the scene (a room, or near its door unless
  you pretend), once per event.
- **Noise.** Some actions and events make a noise. It bursts at its source (a machine, a phone on a desk) and
  ripples out to its earshot. Everyone in earshot turns toward it for a moment, and each head's swing shows. Walls
  don't stop sound.
- **On screen.** Bubbles, signs and meters stay inside the view. With no room above a head, the bubble goes beside
  it, and its tail points at the speaker.

## Outcomes
At the deadline the game picks the first result that applies:
1. **Caught** earlier: you were fired. (The day ends a moment after the catch.)
2. **Fail**: no route achieved. You walk to the front of the room with nothing to show. 🦗
3. **Blamed**: a route achieved, but you are not in the room. Everyone stares at your empty chair 🪑❓ and points
   😠👉 and your face. The loop doesn't count and no route is recorded.
4. **Win**: every route achieved this loop is recorded.

The result is decided at the deadline. If it moves you (to the front, or to your desk if you were sent there), you
walk there; the picture never cuts.

Attendance is a rule in every level: being in the right place at the deadline is part of winning, so nobody wins from
their desk.

## Routes and HUD (icons only)
- A level has a small number of routes (ways to win). Each has an icon and a slot. A found route shows its icon; an
  unfound one is a blank slot. The slots show on the HUD, the title and the end card.
- The clock is big and always visible. It turns red near the deadline (when is the level's choice). Once the day
  is decided it stops at the minute the end card shows. The mission badge's clock face shows the deadline.
- Mission badge icons only. **No route status chips.** Objects show their state in the world.
- Held item, loop number (⟳ 3) and ⏩ while fast-forwarding.
- The authority's ❓ suspicion meter shows above his head when it is above 0.

## Lessons that hold for every level
These came from playtests of level 1 (details in its `LEVEL.md`).
- **Every solution would work in a real office.** The game is a comedy about real offices, so a route is only good
  if a real person would believe it might work. Putting on a coworker's shirt does not make you that coworker, and a
  boss fooled by it makes the whole game look like it is cheating. Absurd results are welcome; an absurd method is
  not. Test every route with this question: "would this get past a real, half-awake boss?"
- **Show the motive.** An NPC who grabs something from you must have shown first, on screen, why he wants it.
  Otherwise he looks like a thief.
- **Red herrings are welcome; every failure shows its cause.** A thing that leads nowhere stops the player from
  winning by trying everything, and it makes the office feel real. A plan may even look right and fail only at the
  deadline: loops are short, Pretend speeds them up, and working out why is the game. What is out is a failure the
  player cannot explain from what they saw: the last beat or the end card shows which step broke. The best toys (the
  cup is just a cup) teach an NPC rule on the way.
- **The authority catches the crime the level is about.** If the trouble invites a nasty act (moving laptops in an
  audit), the authority seeing you at it ends your day, and a witness telling on you costs you something you can see.
  An act that is nasty in the story but free in the rules reads as broken, not clever.
- **The card's rule binds everyone, on screen.** If the card says nobody leaves before the boss, the coworkers keep
  that rule where the player can see it, and whoever breaks it pays for it on screen. A rule that binds only the
  player, enforced by nothing in the world, reads as the game cheating.
- **An NPC keeps his rules.** Once the player has seen what drives someone (the boss lives by his clock), nothing
  else overrides it. A boss who goes home while his own clock says 4:00 reads as random, however clever the reason
  in the code.
- **A thing that looks usable is usable, in every level.** What a thing looks like is a promise the player carries
  from level to level: level 1's full coffee pot pours a cup, so every full pot pours one. Usable is not useful: the
  cup may lead nowhere. A thing kept only as set dressing is drawn spent: an empty coat rack, an empty pot.
- **Every verb the engine gives an item makes sense for that item, and looks like it.** A generic verb (eat, drop,
  put, carry) brings nothing from the level it was made for: what eating leaves behind belongs to the item, never to
  level 1's sandwich. Before the player presses E, the held item shows what E will do to it. And the words a check
  reads come from the same field the picture draws, so no check can pass on words the screen contradicts.
- **Move the risk to where the play is.** If a setup step is trivially safe, give it a cost that bites later.
- **Each route teaches one lesson** (timing, a sightline, a distraction), and the gate checks that a win uses it.
- **Fast-forward only in place.** ×6 movement is uncontrollable, so the folder stride runs at normal time.
