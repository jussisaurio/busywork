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
const DING = ['goto microwave pretend', 'interact', 'goto roster pretend', 'pretend until 4:13'];

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
    name: "microwave, wait at the board for the ding, write the boss's name → win (the boss reads his own face)",
    expect: { result: 'win', routes: ['ding'] },
    play: play([...DING, 'interact', 'pretend until 5:00'], (log, w) => {
      must(saw(log, 'npc:heard', (p) => p.id === 'boss'), 'the boss never turned to the ding');
      must(saw(log, 'npc:heard', (p) => p.id === 'lin'), 'Lin never turned to the ding');
      must(!saw(log, 'witness:tattle'), 'somebody pointed');
      must(w.roster === 'boss', "the board doesn't show the boss");
    }),
  },
  {
    name: "the ding, write twice: Kev's name → win (Kev groans)",
    expect: { result: 'win', routes: ['ding'] },
    play: play([...DING, 'interact', 'interact', 'pretend until 5:00'], (log, w) => {
      must(w.roster === 'kev', "the board doesn't show Kev");
      must(!saw(log, 'witness:tattle'), 'somebody pointed');
    }),
  },
  {
    name: 'the teaching fail: writing before the ding, everyone still facing the board → caught',
    expect: { result: 'caught' },
    play: play(['goto microwave pretend', 'interact', 'goto roster pretend', 'interact', 'pretend until 5:00'], (log) => {
      must(!saw(log, 'noise', (p) => p.sfx === 'elevatorDing') || saw(log, 'caught'), 'the ding went off first');
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
      must(w.roster === 'boss', "the board doesn't show the boss");
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
      must(w.roster === 'boss', "the board doesn't show the boss");
    }),
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
