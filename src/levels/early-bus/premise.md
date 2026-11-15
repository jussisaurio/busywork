# Early Bus

## Card
3:00 PM. The last bus leaves at 4:30. The boss leaves at 4:50.
Nobody leaves before him.

## Name
"Early Bus": your bus leaves at 4:30, twenty minutes before the boss does, and nobody leaves before him. The name and
the card say what you want and why it is a problem. They say nothing about how you get out of it.

## The situation
You work in an open-plan office. The last bus home stops outside the lobby's glass door at 4:30. The boss goes home at
4:50 sharp, every day, and the office rule is that nobody leaves before him. His coat hangs on a stand in his glass
office: while it hangs there, he is in. If nothing changes, at 4:30 the boss is still at his desk, so you stay at yours
and watch your bus drive away. If he has gone home by 4:30, nothing keeps you, and you get on the bus if you are at the
stop. The day is a time loop: when you lose, it is 3:00 again.

## The rules
- **Everyone lives by the clock of the room he is in.** There are two wall clocks: the boss's clock in his office
  (behind his chair) and the open-plan clock on the hallway wall (over Kev's desk, on the boss's way to the kitchen).
  A person looks up at the clock of the room he stands in, thinks of its time (a clock face) and from then on believes
  it. Nobody acts against a clock he has just read, and whoever reads a clock stands near it. Every time below is what
  the person believes.
- **Nobody leaves before the boss.** He takes his coat only when he goes home. At their 4:50, Lin and Kev stand at
  their desks and look at his coat; while it hangs on its stand they think of him with a grimace (his face, gritted
  teeth) and stay. When it has gone, they wave and follow him out.
- **He checks your desk.** After each look at his clock the boss looks out through the glass at your desk. If your
  chair is empty he wonders where you are (your face, ?) and comes looking for you: his office, the open plan, the
  lobby, the bus stop. If he sees you on the phone inside, he lets it go. If he sees you out in the street while he is
  still at work, you are caught.

## Cast
- **The boss** (navy suit, shirtsleeves until he goes home; glass office top left). He sits with his back to his clock,
  facing the glass and the open plan.
  - 3:00 to 3:15: out at a long lunch. He comes back along the street, past the bus stop and in through the lobby, and
    sits down at about 3:22. The first thing he does is turn round to his clock, then he looks at your desk.
  - He turns round to his clock again at 3:30, at 3:40, back from his break at about 4:02, at 4:10 and at 4:25, each
    time followed by a look at your desk.
  - 3:40 to 3:55: his break. He walks to the kitchen and pours himself a coffee from the pot (3:47). Walking back he
    passes under the open-plan clock (about 3:58) and reads it: if it does not say home time, he shrugs.
  - 4:50: he takes his coat off the stand, waves, and goes home through the lobby and over the zebra crossing.
  - When Lin or Kev goes out of sight while he is in his office, he turns to that desk and wonders where they are
    (their face, ?). Nothing comes of it.
  - Told about a stepladder, he sends you to your desk with 20 minutes of work and, before he sits down again, climbs
    up and sets his clock right (the time, angry).
- **Lin** (teal cardigan, the desk below the boss's glass wall, five steps from the open-plan clock). She sits facing
  the glass and sees the boss's stepladder through it. Anyone who climbs it gets told on.
  - She looks up at the open-plan clock at 3:12, 3:20, 3:50, 4:10 and 4:25, and each time she sits down.
  - 3:20: she goes to the restroom (bottom right). She is out of sight from about 3:25 to 3:30 and back at her desk at
    about 3:34.
  - 4:50: she checks the boss's coat (see the rules).
- **Kev** (olive hoodie, the desk right under the open-plan clock, facing it). Anyone on that stepladder is in front of
  his eyes.
  - 3:01 to about 3:10: a coffee from the pot in the kitchen (top right). He goes again at 3:25, back at about 3:34.
  - He looks up at the open-plan clock at 3:01, 3:20, 3:55, 4:10 and 4:25, and each time he sits down.
  - 4:50: he checks the boss's coat, the same as Lin.
- **You** (red jumper, the middle desk). You can climb the stepladder under either clock and push the clock 10 minutes
  forward. Each push takes a moment, moves the hands on 10 minutes and makes the clock hang a little more crooked.
  Walking about you take a phone call ('pretend'); at your desk you type.
  - If the boss turns round to his clock while you are on its stepladder, you are caught.
  - If Lin or Kev sees you on a stepladder, they shout and point at you (!, finger, you). If the boss is in, he sends
    you back to your desk with 20 minutes of work and the push you were doing does not count. If he is out, they point
    you out to him when he comes back (finger, clock).

## Ways to win
You win when the boss has gone home before 4:30 and you are at the bus stop at 4:30. The bus pulls in at 4:26 and you
get on. You see the stop at the start (a bus stop sign by the road, outside the lobby's glass door) and the bus at the
kerb (shot `bus-arrives`).

### 1. Push the boss's clock (route icon: clock)
Steps:
1. At about 3:23, while Lin walks off to the restroom, leave your desk on the phone and walk into the boss's office.
2. Climb the stepladder behind his chair and push his clock three times (+30), done before he turns round at 3:30.
3. Stay on the phone. At 3:30 he turns round, sees 4:00 and starts (!); he looks at your empty chair and gets up to
   look for you, sees you on the phone and lets it go.
4. Go back to your desk. From now on he lives half an hour early: he skips his coffee, takes his coat at 4:20 and
   walks out through the lobby; he is over the crossing by about 4:28.
5. Follow him out, behind him, and wait at the stop.

The facts, and when you see them:
- **The boss goes by his wall clock.** At 3:22 he turns round to it with a clock thought (shot
  `boss-back-from-lunch`).
- **You can push a clock forward.** At the start you see a stepladder under each clock (shot `start`). Up close each
  is a real wall clock with a stepladder under it (shots `boss-clock-close`, `open-clock-close`). After you push it,
  the hands read later than the HUD clock and it hangs crooked (shots `open-clock-pushed`, `boss-clock-pushed`).
- **His back is to his clock.** His chair faces away from the stepladder and his vision cone points away from it
  (shots `boss-back-from-lunch`, `boss-clock-pushed`).
- **Lin watches his stepladder.** Her vision cone reaches through the glass to it (shot `start`). Try while she is at
  her desk and she points at you and shouts (shot `lin-tells`); he sets the clock right when he hears.
- **Lin is away from 3:20.** You see her get up and walk off to the restroom (shot `lin-goes-to-the-restroom`). At 3:25
  the boss turns to her empty desk and wonders where she is (shot `boss-misses-lin`).
- **He turns round at 3:30.** Too late on the stepladder, and he catches you there at 3:31 (shot `end-caught`). In
  time, he starts at his clock (shot `boss-jumps`).
- **His coat means he is in.** It hangs on its stand all afternoon (shot `start`); he puts it on when he goes (shot
  `boss-takes-his-coat`).
- **+30 is enough and +20 is not.** The card gives the sums: he leaves at 4:50 by his clock and your bus goes at 4:30,
  and he needs a few minutes to walk out. With +20 he is still at his desk at 4:30.
- **Don't go before him.** Leave your desk while he is in and he finds your chair empty and comes looking (shot
  `boss-hunts`); out in the street, he catches you (shot `end-caught-in-the-street`).

### 2. Push the open-plan clock (route icon: coffee)
Steps:
1. At 3:01, when Kev gets up for his coffee, climb the stepladder over his desk.
2. Push the open-plan clock six times (+60). You are done by about 3:08, before Kev comes back.
3. Go back to your desk.

Kev sits down at 3:10, looks up and starts (!): he thinks it is 4:10. Lin looks at 3:12 and starts too (she skips the
restroom today). At 3:50, when the open-plan clock says 4:50, they stand and look at the boss's coat (his face,
gritted teeth): it still hangs there, because he is in the kitchen on his break, so they stay. At about 3:58 the boss
walks back under the open-plan clock, reads 4:58 and starts (!). He takes his coat at 4:01 and waves; Lin and Kev see
the stand empty, wave and follow him out. All three are gone by about 4:09. Go out to the stop after them.

The facts, and when you see them:
- **Lin and Kev go by the open-plan clock.** At 3:01 Kev looks up at it with a clock thought before he gets up (shot
  `kev-checks-the-clock`). At 3:12 Lin looks up at it too (shot `lin-checks-the-open-clock`).
- **Kev is away at 3:01.** You see him walk off to the kitchen and pour a coffee (shots `open-clock-close`,
  `kev-pours-a-coffee`). His start when he comes back shows that the push took (shot `kev-jumps`).
- **They will not go before him.** At their 4:50 they look at his coat and stay (shot `lin-checks-the-coat`).
- **The boss reads the open-plan clock after his coffee.** Every day he pours a coffee at 3:47 (shot
  `boss-pours-a-coffee`) and, walking back under the open-plan clock, reads it and shrugs (shot `boss-shrugs`).
- **At 4:50 or later he goes, and they follow.** He starts under the clock (shot `boss-reads-the-open-clock`), takes
  his coat (shot `boss-takes-his-coat-early`), and Lin and Kev follow him out (shot `lin-and-kev-follow`).
- **+60 is enough and +50 is not.** At 3:58 +50 shows 4:48, and he shrugs.

## Ways to lose
- **The boss is still in at 4:30, and you are at your desk.** The end card: 4:30 on the boss's clock; he is at his desk
  in his shirtsleeves with his coat on its stand, so you stay; out of the window your bus drives off (shot `end-fail`).
- **The boss is still in at 4:30, and you are at the stop.** You cannot get on while he is in, and he fetches you back.
  The end card: the bus pulls away without you, and the boss in his shirtsleeves points at you from the lobby door;
  through the window his coat still hangs on its stand by his clock (shot `end-fail-at-the-stop`).
- **Caught on the stepladder.** He turns round to his clock while you are up it. The end card: you up the stepladder
  at his crooked clock, and the boss below pointing up at you, angry (shot `end-caught`).
- **Caught in the street.** Out at the stop while he is still at work: he passes it on his way back from lunch, or
  comes looking for you after seeing your empty chair. The end card: you at the stop with no bus, the boss in his
  shirtsleeves pointing at you from the lobby door, his coat still on its stand through the window (shot
  `end-caught-in-the-street`).
- **The boss went home early, but you were not at the stop at 4:30.** The end card: the bus pulls away from the empty
  stop as you run out of the door, too late (shot `end-blamed`).
- **Told on.** Not a loss by itself. Lin or Kev points at you, the boss sends you to your desk with 20 minutes of work
  and sets his clock right, and usually the window has closed when you are free.

## The joke
3:50 to 4:09 on the open-plan route. Two grown adults stand up at their desks, stare at a coat on a stand, grimace and
sit down again. Eight minutes later the boss, whose rule keeps them there, strolls back from his coffee, glances at the
hallway clock, starts, and fetches his coat in a hurry. He is not out of the office before they are up and following
him to the door.
