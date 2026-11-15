# Office Time

## Card
3:00 PM. Your bus leaves at 4:30. The boss leaves at 4:50.
Nobody leaves before him. Catch the bus.

## Name
"Office Time": in this office it is whatever time the office's wall clocks say. Nobody looks at a watch. You see this
before you solve anything: at 3:01 Kev turns to the wall clock over his desk to check the time, and at 3:19 the boss sits
down and turns round to check the clock on his own wall. The start of the day shows both clocks, each high on a wall
with a stepladder under it. The name says that the office keeps its own time, and that is the whole level: change the
office's time and the office goes home early.

## The situation
You work in an open-plan office. Your bus home stops outside the lobby's glass door at 4:30. The boss goes home at 4:50
sharp, every day, and the office rule is that nobody leaves before him. If nothing changes, at 4:30 the boss is still
at his desk, so you stay at yours and watch your bus drive away. If the boss has gone home by 4:30, nothing keeps you,
and you can get on the bus if you are at the stop. The day is a time loop: when you lose, it is 3:00 again.

## Cast
- **The boss** (navy suit, glass office top left). He sits with his back to his clock, facing the glass and the open
  plan. He lives by his clock, and every time below is what his clock says.
  - 3:00 to 3:15: out at a long lunch. He comes back up in the elevator at 3:15 and sits down at about 3:19. The first
    thing he does is turn round to check his clock.
  - He turns round to glance at his clock at 3:30 and 3:38, and again at 4:10 and 4:25.
  - 3:40 to 3:55: a cigarette in the lobby by the glass front. He is back at his desk at about 3:59 and checks the clock.
  - 4:48: he waves goodbye. 4:50: he walks to the elevator and goes home.
  - He watches his staff's desks. When Lin or Kev goes out of sight while he is in his office, he turns to that desk and
    wonders where they are (their face, ?). If both of them have gone home, it must be home time, and he goes too.
- **Lin** (teal cardigan, the desk below the boss's glass wall). She sits facing the glass, so she can see the boss's
  stepladder. Anyone who climbs it gets told on. For the time she goes by the open-plan clock, like everyone in the
  open plan, because the boss's clock is too far away to read through the glass.
  - She turns to the open-plan clock at 3:12, 3:50, 4:10 and 4:25, and each time she sits down.
  - 3:20: she goes to the restroom (bottom right). She is out of sight from about 3:25 to 3:30 and back at her desk at
    about 3:35.
  - 4:50 by her clock: the boss always leaves at 4:50, so it is home time. She waves goodbye and leaves at 4:51.
- **Kev** (olive hoodie, the desk right under the open-plan clock, facing it). Anyone on that stepladder is in front of
  his eyes.
  - 3:01 to about 3:09: he gets a coffee in the kitchen (top right). He goes again from 3:35 to about 3:43.
  - He turns to the open-plan clock at 3:01, at 3:20, at 3:55, at 4:10 and at 4:25, and each time he sits down.
  - 4:50 by his clock: he waves goodbye and leaves at 4:51, the same as Lin.
- **You** (red jumper, the middle desk). You can climb the stepladder under either clock and push the clock 10 minutes
  forward. Each push takes a moment, moves the hands on 10 minutes, and makes the clock hang a little more crooked. You
  whistle as you step down.
  - If the boss sees you on a stepladder, you are caught.
  - If Lin or Kev sees you, they shout and point at you (!, finger). If the boss is in, he sends you back to your desk
    with 20 minutes of work, and the push you were doing does not count. If he is out, they point you out to him when
    he comes back (finger, clock).

## Ways to win
You win when the boss has gone home before 4:30 and you are at the bus stop at 4:30. The bus pulls in at 4:26 and you
get on. You see the stop at the start (a bus stop sign by the road, outside the lobby's glass door) and the bus arriving
at 4:26 (shot `bus-arrives`).

### 1. Push the boss's clock (route icon: clock)
Steps:
1. Wait at your desk until 3:20, when Lin goes to the restroom.
2. Walk into the boss's office (he is at his desk, back to the clock) and climb the stepladder behind his chair.
3. Push his clock three times (+30) before he turns round at 3:30. The walk takes about 4 minutes and the pushes about 3,
   so leave your desk by about 3:21.
4. Go out to the bus stop.

At 3:30 he turns round, sees 4:00 on his clock and starts (!). From then on he lives half an hour early: he waves at
4:18, leaves at 4:20 and is gone by about 4:24.

A variant: push the open-plan clock once (+10) while Kev is at the coffee machine. At 3:12 Lin checks it, thinks it is
3:22 and gets up for the restroom at once. As she turns away, push the boss's clock three times while he is still at
lunch (from the stepladder, done by about 3:15). When he sits down at 3:19 and turns round, he thinks it is 3:49.

The facts, and when you see them:
- **The boss goes by his wall clock.** At 3:19 he sits down and turns round to it with a clock thought. He does it again
  at 3:30 and 3:38 (shot `boss-back-from-lunch`).
- **You can push a clock forward.** At the start you see a stepladder under each clock (shot `start`). Up close it is
  a real wall clock on the wall with a stepladder under it (shots `boss-clock-close`, `open-clock-close`). After you
  push it, the hands read later than the HUD clock and the clock hangs crooked, 10 minutes per push (shots
  `open-clock-pushed`, `boss-clock-pushed`).
- **His back is to his clock.** From 3:19 his chair faces away from the stepladder and his vision cone points away from
  it (shots `boss-back-from-lunch`, `boss-clock-pushed`).
- **Lin watches his stepladder.** Her vision cone reaches through the glass to it all day (shot `start`). If you try
  while she is at her desk, she points at you and shouts (shot `lin-tells`).
- **Lin is away from 3:20.** At 3:20 you see her get up and walk off to the restroom door (shot
  `lin-goes-to-the-restroom`). At 3:25 the boss turns to her empty desk and wonders where she is (shot
  `boss-misses-lin`).
- **He turns round at 3:30.** You see him turn round to the clock at 3:19 and, if you watch, at 3:30 and 3:38. If you
  are too late, he catches you on the stepladder at 3:31 (shot `end-caught`).
- **+30 is enough and +20 is not.** The card gives the sums: he leaves at 4:50 by his clock and your bus goes at 4:30,
  and he needs a few minutes to walk out. With +20 you see him wave at 4:28 and only get up as the bus leaves.
  With +30 he starts and goes (shots `boss-jumps`, `boss-goes-home-early`).

### 2. Empty the office (route icon: wave)
Steps:
1. At 3:01, when Kev gets up for coffee, climb the stepladder over his desk.
2. Push the open-plan clock four times (+40). You are done by about 3:06, before Kev comes back.
3. Go out to the bus stop.

Kev sits down at 3:09, turns to the clock and starts (!): he thinks it is 3:49. Lin checks it at 3:12 and starts too
(she thinks it is 3:52, so she does not go to the restroom today). At 4:10 the open-plan clock says 4:50: they wave
goodbye and go at 4:11. The boss turns to Lin's empty desk at 4:14 (her face, ?) and to Kev's at 4:16 (his face, ?).
At 4:17 he starts (!): if they have all gone, it must be home time. He hurries out and is gone by about 4:21. The
same works from 3:35, while Kev is at his second coffee.

The facts, and when you see them:
- **Lin and Kev go by the open-plan clock.** At 3:01 Kev turns to it with a clock thought before he gets up (shot
  `kev-checks-the-clock`). At 3:12 Lin turns from the glass to the same clock (shot `lin-checks-the-open-clock`).
- **They leave at 4:50 by that clock, right after the boss.** The card says it: he leaves at 4:50 and nobody leaves
  before him. The first time you push the open-plan clock by any amount, you see them wave and go when it shows 4:50
  (shot `lin-and-kev-go-home`).
- **Kev watches that clock, but not at 3:01.** His desk faces it and his vision cone covers the stepladder (shot
  `start`). At 3:01 you see him walk away to the kitchen (shots `kev-checks-the-clock`, `open-clock-close`). His start
  when he comes back shows that the push took (shot `kev-jumps`).
- **The boss cannot stand an empty desk.** Every day at 3:25, when Lin goes out of sight into the restroom, he turns to
  her empty desk and wonders where she is (shot `boss-misses-lin`).
- **With both desks empty he follows them.** You see it the first time they leave: he wonders where each one is and
  then hurries out after them (shots `boss-sees-empty-desks`, `boss-follows-the-herd`). With only +30 they leave at
  4:21 and he packs up at about 4:27, too late, which shows you need ten minutes more.

## Ways to lose
- **The boss is still in at 4:30, and you are at your desk.** The end card: the boss at his desk with his papers under
  his clock, and you at the window watching your bus drive away, unhappy (shot `end-fail`).
- **The boss is still in at 4:30, and you are at the stop.** You cannot get on while he is in. The end card: you at the
  stop as the bus pulls away, and behind you, in the office window, the boss at his desk under his clock (shot
  `end-fail-at-the-stop`).
- **Caught.** He turns round to his clock while you are on the stepladder behind him. The end card: you up the
  stepladder at the clock, and the boss turned round, pointing at you, angry (shot `end-caught`).
- **The boss went home early, but you were not at the stop at 4:30.** The end card: your bus pulls away with the boss
  in it, waving, while you run out of the building too late, embarrassed (shot `end-blamed`). This card dramatises the
  loss: in the level the boss leaves by the elevator.
- **Told on.** Not a loss by itself. Lin or Kev points at you, the boss sends you to your desk with 20 minutes of work,
  and usually the window has closed when you are free.

## The joke
4:14 to 4:17 on the empty-office route. The boss, whose rule keeps everyone at work until he goes, sits in his glass
office as Lin and Kev wave goodbye and walk out. He turns to Lin's empty desk (her face, ?), then to Kev's (his face,
?), starts (!) and hurries out after them at 4:17 by his own clock, which nobody touched. The man who makes everyone
wait cannot bear to be the last one in.
