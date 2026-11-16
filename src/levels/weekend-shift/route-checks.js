// Weekend Shift's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js): each route's
// winning plan, and the fails that teach it. Each also checks the why: whose face is on the board, who turned to
// look, who pointed.
const saw = (log, name, pred = () => true) => log.some((e) => e.name === name && pred(e.payload ?? {}));
const must = (ok, why) => {
  if (!ok) throw new Error(why);
};
const play = (cmds, then) => ({ run, log, g }) => {
  for (const c of cmds) run(c);
  then(log, g.world);
};
const DING = ['goto microwave pretend', 'interact', 'goto roster pretend'];

export default [
  {
    name: 'do nothing → fail: your face is still on the board',
    expect: { result: 'fail' },
    play: play(['pretend until 5:00'], (log, w) => must(w.roster === 'player', 'the board changed by itself')),
  },
  {
    name: 'write on the board in plain sight → caught',
    expect: { result: 'caught' },
    cmds: ['goto roster pretend', 'interact', 'wait until 5:00'],
  },
  {
    name: "microwave, walk back past the board as it dings, write Kev's name, back to your desk, the chair at 4:55 → win (the boss reads Kev's face; Kev protests, the boss taps the board)",
    expect: { result: 'win', routes: ['ding'] },
    play: play([...DING, 'interact', 'goto player_desk pretend', 'pretend until 4:55', 'goto meeting_player pretend', 'pretend until 5:00'], (log, w) => {
      must(saw(log, 'npc:heard', (p) => p.id === 'boss'), 'the boss never turned to the ding');
      must(saw(log, 'npc:heard', (p) => p.id === 'lin'), 'Lin never turned to the ding');
      must(!saw(log, 'witness:tattle'), 'somebody pointed');
      must(w.roster === 'kev', "the board doesn't show Kev");
    }),
  },
  {
    name: "Kev at the ding, then the boss's own face during his call → win (he reads it out to the room, goes red, Lin and Kev clap)",
    expect: { result: 'win', routes: ['phone'] },
    play: play([...DING, 'interact', 'goto player_desk pretend', 'pretend until 4:31', 'goto desk_phone pretend', 'interact', 'goto board pretend', 'interact', 'goto meeting_player pretend', 'pretend until 5:00'], (log, w) => {
      must(w.roster === 'boss', "the board doesn't show the boss");
      must(!saw(log, 'witness:tattle'), 'somebody pointed');
    }),
  },
  {
    name: 'the teaching fail: the ding has been and gone, every head back on the board, then the write → caught',
    expect: { result: 'caught' },
    play: play([...DING, 'pretend until 4:16', 'interact', 'pretend until 5:00'], (log) => {
      must(saw(log, 'noise', (p) => p.sfx === 'elevatorDing'), 'the microwave never dinged');
    }),
  },
  {
    name: 'the mirror fail: the board while the copier beeps, every head turned toward it → caught',
    expect: { result: 'caught' },
    play: play(['goto copier pretend', 'interact', 'goto roster pretend', 'interact', 'pretend until 5:00'], (log) => {
      must(saw(log, 'npc:heard', (p) => p.id === 'boss'), 'the boss never turned to the beeping');
    }),
  },
  {
    name: "ring the boss's phone while Lin heats her fish, write on the board → win",
    expect: { result: 'win', routes: ['phone'] },
    play: play(['pretend until 4:31', 'goto desk_phone pretend', 'interact', 'goto board pretend', 'interact', 'pretend until 5:00'], (log, w) => {
      must(saw(log, 'phone:answered'), 'the boss never took the call');
      must(w.roster === 'kev', "the board doesn't show Kev");
    }),
  },
  {
    name: 'ring the phone with Lin at her desk → Lin ❗👉, the boss hears',
    expect: { result: 'fail' },
    play: play(['goto desk_phone pretend', 'interact', 'goto board pretend', 'interact', 'pretend until 5:00'], (log) => {
      must(saw(log, 'phone:answered'), 'the boss never took the call');
      must(saw(log, 'witness:tattle', (p) => p.by === 'lin'), 'Lin never pointed');
      must(saw(log, 'boss:workAssigned'), 'the boss never heard her');
    }),
  },
  {
    name: "write at the ding, then away from the board at 5:00 → blamed",
    expect: { result: 'blamed' },
    play: play([...DING, 'interact', 'goto microwave pretend', 'pretend until 5:00'], (log, w) => {
      must(w.roster === 'kev', "the board doesn't show Kev");
    }),
  },
  {
    name: "Kev's name at the ding, then a second write while Lin watches → told on: the boss checks the board, puts your face back → fail",
    expect: { result: 'fail' },
    play: play([...DING, 'interact', 'goto desk_phone pretend', 'interact', 'goto board pretend', 'interact', 'pretend until 5:00'], (log, w) => {
      must(saw(log, 'witness:tattle', (p) => p.heard), 'nobody told the boss');
      must(saw(log, 'board:checked'), 'the boss never checked the board');
      must(saw(log, 'roster:changed', (p) => p.to === 'player'), 'the boss never put your face back');
      must(w.roster === 'player', "the board doesn't show you");
    }),
  },
  {
    // A playtest escape: early for the meeting is not slacking. Once everyone gathers (4:55), the boss is waiting for
    // the meeting, not watching who works: walking up and standing there, not pretending, never fills his meter.
    name: 'the gather: walk to your chair at 4:55 and just stand there → the boss never gets suspicious (fail: your face)',
    expect: { result: 'fail' },
    play: ({ run, log, g }) => {
      run('pretend until 4:55');
      const from = log.length;
      for (const c of ['goto meeting_player', 'wait until 5:00']) run(c);
      must(!log.slice(from).some((e) => e.name === 'boss:suspicious' || e.name === 'boss:workAssigned'), 'the boss got suspicious of you waiting for the meeting');
      must((g.suspicion?.boss ?? 0) === 0, 'his meter is not empty');
    },
  },
  {
    name: "the playtester's day: noodles, Lin's fish, the copier, Kev fixing it → fail: nobody wrote on the board",
    expect: { result: 'fail' },
    play: play(['goto microwave pretend', 'interact', 'pretend until 4:38', 'goto copier pretend', 'interact', 'goto kev_desk pretend', 'pretend until 5:00'], (log, w) => {
      must(saw(log, 'kev:alerted'), 'Kev never went for the copier');
      must(w.roster === 'player', 'the board changed without you writing on it');
    }),
  },
];
