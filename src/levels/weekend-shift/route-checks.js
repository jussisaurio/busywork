// Weekend Shift's route checks for tools/routes.mjs (format: src/levels/meeting/route-checks.js): each route's
// winning plan, and the fails that teach it. Each also checks the why: who turned to look, who pointed.
const saw = (log, name, pred = () => true) => log.some((e) => e.name === name && pred(e.payload ?? {}));
const must = (ok, why) => {
  if (!ok) throw new Error(why);
};
const play = (cmds, then) => ({ run, log }) => {
  for (const c of cmds) run(c);
  then(log);
};

export default [
  { name: 'do nothing → fail', expect: { result: 'fail' }, cmds: ['pretend until 5:00'] },
  { name: 'write on the board in plain sight → caught', expect: { result: 'caught' }, cmds: ['goto roster pretend', 'interact', 'wait until 5:00'] },
  {
    name: 'microwave, wait at the board for the ding, write → win',
    expect: { result: 'win', routes: ['roster'] },
    play: play(['goto microwave pretend', 'interact', 'goto roster pretend', 'pretend until 4:13', 'interact', 'pretend until 5:00'], (log) => {
      must(saw(log, 'npc:heard', (p) => p.id === 'boss'), 'the boss never turned to the ding');
      must(!saw(log, 'witness:tattle'), 'somebody pointed');
    }),
  },
  {
    name: 'the teaching fail: the sheet at the ding, between the microwave and Lin → Lin ❗👉',
    expect: { result: 'fail' },
    play: play(['goto microwave pretend', 'interact', 'goto tray pretend', 'pretend until 4:13', 'interact', 'goto board pretend', 'pretend until 5:00'], (log) => {
      must(saw(log, 'npc:heard', (p) => p.id === 'lin'), 'Lin never turned to the ding');
      must(saw(log, 'witness:tattle', (p) => p.by === 'lin'), 'Lin never pointed: the ding turned her toward you');
      must(!saw(log, 'sheet:swapped'), 'the swap went through');
    }),
  },
  {
    name: 'jam the copier: Kev leaves his tray, swap the sheet → win',
    expect: { result: 'win', routes: ['sheet'] },
    play: play(['goto copier pretend', 'interact', 'goto tray pretend', 'interact', 'goto board pretend', 'pretend until 5:00'], (log) => {
      must(saw(log, 'kev:alerted'), 'Kev never went for the copier');
      must(saw(log, 'sheet:swapped'), 'no swap');
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
    expect: { result: 'win', routes: ['roster'] },
    play: play(['pretend until 4:31', 'interact', 'goto board pretend', 'interact', 'pretend until 5:00'], (log) => {
      must(saw(log, 'phone:answered'), 'the boss never took the call');
    }),
  },
  {
    name: 'ring the phone with Lin at her desk → Lin ❗👉',
    expect: { result: 'fail' },
    play: play(['pretend 0.5s', 'interact', 'goto board pretend', 'interact', 'pretend until 5:00'], (log) => {
      must(saw(log, 'phone:answered'), 'the boss never took the call');
      must(saw(log, 'witness:tattle', (p) => p.by === 'lin'), 'Lin never pointed');
      must(saw(log, 'boss:workAssigned'), 'the boss never heard her');
    }),
  },
];
