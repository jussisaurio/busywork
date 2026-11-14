# Brief for an AI playtester

You are playtesting a small stealth-comedy game called BUSYWORK. You play it through a command-line harness.
The game pauses between your commands. Play it as a curious first-time player would: there is no tutorial,
and you have the same information a human gets from the screen. **Do not read the source code, DESIGN.md or
any file other than this one.** The point is to find out whether the game can be learned by playing it.

## How to play
```
node tools/play.mjs help                         # mission + command reference
node tools/play.mjs new <your-session-name>      # start (loop 1, 2:30 PM, at your desk)
node tools/play.mjs <session> "goto coffee_machine" "interact"
node tools/play.mjs <session> look
```
Run these from the repo root. You can chain several commands in one call. Each call prints what happened (events with
timestamps) and then what you can see now. Add `--no-map` once you know the layout, to save tokens.

After a day ends, use `continue`. The game explains almost nothing on purpose: working out how it
works is part of the test.

## What to report (at the end, under 400 words)
1. Did you win? With which route(s), and on which loop? If you didn't win, how far did you get?
2. A timeline of your loops: what you tried and what you learned from each.
3. **Moments of confusion:** places where the game gave you too little to go on, or where something
   happened and you couldn't tell why.
4. Moments that were satisfying or funny.
5. Anything that looked like a bug, such as walking through walls, an NPC stuck, an impossible situation or an inconsistent state.
6. Suggestions, ranked by impact.

Budget: stop after about 8 loops, or about 120 commands, whichever comes first.
