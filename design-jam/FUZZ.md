# Fuzzer data on level 1 (from the coordinator)

Facts, not a proposal. Use them, or rerun: `node tools/fuzz.mjs --budget 20000` (~20 s, prints this report;
`--verbose` lists every outcome bin with its simplest plan, `--json out.json` dumps everything). It searches
over harness plans (MAP-Elites over outcome bins, then shrinks each win to a minimal plan and slides each
timed wait across the day to measure the real windows). Plans are harness commands; "pretend" = hold Shift.

## Report (seed 1, 30k days)
```
fuzz: 30267 days in 30.3 s (12 workers, seed 1), 159 distinct outcomes
outcome bins by result: fail 46, caught 49, blamed 34, win 30
random plans that win: 4/3000 (0.13%)

WIN keycard+projector: 176 winning days found, 0 of them from random plans
  key actions seen in wins: poured 2:33–2:37, broke 3:22–3:47, card 3:05–3:35, sandwich 2:34–2:35, ate 2:36–2:36
  minimal plan (8 steps):
    goto coffee_machine pretend
    interact
    goto projector pretend
    pretend until 3:25
    interact
    goto coat_rack pretend
    interact
    goto projector pretend
    wait until 4:00
  window for step 4 (pretend until 3:25): wins when it ends at 3:07, 3:14, 3:17, 3:25–3:26

WIN keycard: 2577 winning days found, 3 of them from random plans
  key actions seen in wins: poured 2:33–2:39, card 2:39–3:35, sandwich 2:33–3:02, ate 2:34–3:27, broke 2:39–2:44
  minimal plan (4 steps):
    pretend until 2:46
    goto coat_rack pretend
    interact
    goto meeting_seat pretend
    pretend until 4:00
  window for step 1 (pretend until 2:46): wins when it ends at 2:34, 2:46, 2:54–2:55, 3:00, 3:03–3:07, 3:11, 3:14, 3:21, 3:26, 3:28–3:30

WIN projector: 1357 winning days found, 1 of them from random plans
  key actions seen in wins: poured 2:33–2:40, broke 3:06–3:56, sandwich 2:33–2:39, ate 2:34–3:35, card 3:33–3:35
  minimal plan (5 steps):
    goto coffee_machine
    interact
    pretend until 3:33
    goto projector pretend
    interact
    pretend until 4:00
  window for step 3 (pretend until 3:33): wins when it ends at 2:59–3:05, 3:07–3:47, 3:49

flags (0):
```

## Observations
- **Win vs blamed is one step.** The keycard plan `pretend until 2:46 ; goto coat_rack pretend ; interact ;
  pretend until 4:00` ends BLAMED; insert `goto meeting_seat pretend` and it WINS. 34 of 159 outcome bins are
  "blamed" (a route achieved, you elsewhere at 4:00): the most common way to fail after doing the hard part.
- **After the pour / grab, nothing can go wrong while you hold pretend.** In every minimal win, the step after
  getting the item is `pretend until …` (the phone pose, now ×6 time), anywhere: the cup or card held to your
  ear is invisible to Kev and the boss. Kev's 🥱☕ craving never fires against a player who knows this.
- **No win without pretend** was found in 30k days.
- **Random plans win 0.13%** of the time (4/3000): discovery is not trivial; execution, once known, is short.
- **Pour window** is 2:32–2:40 (Kev pours at ~2:40). **Spill** works ~2:59–3:49 (pretend-until end time; the
  spill lands ~1 min later). **Keycard grab** works only in scattered single minutes 2:34–3:30 (the boss's
  glance cadence), not the clean "Lin away" windows DESIGN.md describes.
