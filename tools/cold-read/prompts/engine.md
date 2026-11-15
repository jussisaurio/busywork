## Engine rules
These rules hold in every level. The engine implements them, so the level's own files use them without restating
them. Never report one of these as missing from the game because the level's code doesn't contain it. The level's
code says "busy" for pretending, "the authority" for the boss, and "the meeting" for the deadline, whatever the
level calls it.

**Time**
- One loop runs from the level's start time to its deadline. Game time runs at 0.6 game minutes per real second.
- Every loop is identical. The same inputs give the same day, including when each seated person glances around.
- A schedule entry's time is when that person sets off, not when he arrives. People walk about 4 tiles per game
  minute; the player walks about 7. Each entry lasts until the next one starts.
- `away`: he walks to the spot, vanishes there until his next entry starts, then reappears there and walks on.
  `leave`: he is gone for the rest of the loop.
- Some events (a lure, a hunt, a door, an inspection) take a person off his schedule until they end. At the
  level's gather time, everyone still on the floor walks to the meeting.

**Pretending** (a held key; the on-screen key legend calls it "pretend". You carry one item at a time.)
- Seated at your desk: you type, and time runs ×6.
- Walking: you stride with a folder, slower than a walk.
- Standing still: you take a phone call, and time runs ×6. If you hold an item, you hold it to your ear like a
  phone.
- Pretending, walking or standing, hides what you carry: contraband and other people's things. It never hides a
  mark on you, and it never covers an action in progress.

**Being seen**
- Each person sees a cone (90° and 7 tiles unless the level says otherwise). Walls block sight, glass does not.
  Seated people turn their heads to one side for about a second every few seconds.
- Only the authority can end your day. Everyone else tattles.
- The authority's ❓ meter fills while he sees you not looking busy. Full, he sends you to your desk to type for
  20 game minutes.
- A sneaky action takes a second or two. Seen during it: by the authority, you are caught and the day ends; by
  anyone else, they point and tattle. A tattle reaches the authority now if he is on the floor, or when he comes
  back.
- An action on someone's thing is sneaky only to its owner. An owner takes his thing back on sight unless you
  pretend. Carrying it is not a tattle.
- The authority seeing you hold his own thing, while you are not pretending, means caught.
- Some acts leave a mark on you for the rest of the loop. Someone who sees it reads it as guilt.
- After some events, one witness blames whoever he sees at the scene (a room, or near its door unless you pretend).
- Noise makes everyone in earshot turn to look. Walls don't stop sound.

**Only where the level's files turn them on**
- Disguise: while you hold an item marked as someone's disguise, you are that person to anyone who doesn't know
  better, and a fooled person objects to nothing. Those who know better (that person, anyone who saw him leave for
  the day, anyone who saw you put it on or take it off) do a double take, then object.
- Dark rooms: anyone sees only about an arm's length into the dark, except along a torch beam.
- Cameras: whoever watches a camera's monitor also sees what the camera sees.
- Put-down spots: a set-down item lies in plain view. On a spot that is yours, it counts as if you held it.

**The deadline**, checked in this order:
1. Caught earlier: fired.
2. No route done: fail.
3. A route done, but you are not in the meeting room: blamed. The loop doesn't count.
4. Otherwise: win.
