// The Interview's words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;
const PHONE = { lin: "Lin's phone", boss: "the boss's phone", kev: "Kev's phone", kitchen: 'the kitchen phone' };
const ANSWER = { // the interview's state, for the WORLD line
  due: 'due at 3:30',
  ringing: "ringing on Lin's phone",
  lin: 'Lin took it',
  other: 'someone else answered it, puzzled, and hung up',
  busy: 'the interviewer got a busy line',
  dead: "Lin's phone never rang (unplugged)",
  rangOut: 'it rang out: nobody answered',
};

export default {
  mission: "MISSION: 3:00 PM. Lin wants your job. Her phone interview is at 3:30. She must miss it.",

  landmarks: {
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    boss_office: 'boss_front',
    kitchen: 'kitchen_lin',
    switchboard: 'switchboard',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'cord:in', 'meeting:gather'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, G glass, D door, T desk/table, H plant, P your desk, L/B/V Lin's, the boss's and Kev's desk phones,",
    "     W the kitchen wall phone, O the wall socket of Lin's phone cord, 5 1 2 3 4 the switchboard (outside line, then",
    "     jacks for Lin, the boss, Kev, the kitchen), F fridge, C coffee machine, @ you, b the boss, l Lin, k Kev,",
    '     * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (Lin missed her interview: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (Lin missed it, via ${o.routes.join(' + ')}, but you weren't at your desk)`
    : 'FAIL: Lin took her interview call 📞😊'),

  playerText: (game) => (game.world.youOn ? [`on ${PHONE[game.world.youOn]}: ${
    game.world.tookJob === 'player' && game.world.youOn === 'lin' ? 'her interviewer asking for Lin 💼❓'
    : game.world.youOn === 'kitchen' ? '"please hold for HR" 🎵' : 'Gary asking for the boss ⛳'}`] : []),

  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    if (n.override === 'to_job') return ["going to answer the interview call on Lin's phone ❗"];
    if (n.override === 'on_job') return ["on the interview call on Lin's phone 💼"];
    if (n.id === 'lin' && game.world.linCheck) return ['holding her receiver to her ear, listening (checking her phone)'];
    const m = /^(to|on)_(\w+)_phone$/.exec(n.override ?? '');
    if (!m) return [];
    if (m[1] === 'to') return [`going to answer ${PHONE[m[2]]} ☎️`];
    return [`on ${PHONE[m[2]]} ${m[2] === 'kitchen' ? 'holding for HR 🎵' : 'with Gary ⛳'} ${Math.round((game.world[`hold_${n.id}`] ?? 0) * 100)}%`];
  },

  worldText(game) {
    const w = game.world;
    const phones = Object.keys(PHONE).map((p) => {
      const st = w[`line_${p}`] ? `${name(w[`line_${p}`])} on the line`
        : w[`ring_${p}`] === 'job' ? 'ringing (the interview)'
        : w[`call_${p}`] ? `ringing, ${name(w[`call_${p}`])} answering`
        : w[`ring_${p}`] ? 'ringing, nobody coming yet'
        : p === 'lin' && w.cord === 'out' ? 'unplugged (the cord lies on the floor)' : 'quiet';
      return `${PHONE[p]}: ${st}`;
    });
    return `WORLD: the interview: ${ANSWER[w.interview] ?? w.interview}; ${phones.join('; ')}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to the boss 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you ❗👉${p.heard ? ' (the boss heard)' : ''}`;
      case 'meeting:gather': return '3:30: the interview is due';
      case 'interview:ringing': return "Lin's phone rings: the interview 💼🔔 (the outside lamp on the switchboard blinks red)";
      case 'job:answering': return `${name(p.by)} goes to answer the interview call ❗`;
      case 'interview:other': return 'someone other than Lin answers the interview call: 💼❓ 🤷';
      case 'interview:rangOut': return 'the interview call rings out: nobody answered 🔔🤷';
      case 'interview:hungUp': return 'the interview call is over';
      case 'phone:answering': return `${name(p.by)} heard ${PHONE[p.phone]} ring and goes to answer it ❗`;
      case 'phone:unanswered': return `${PHONE[p.phone]} stops ringing: nobody heard it`;
      case 'lin:checks': return 'Lin lifts her receiver and listens (checking her line)';
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'switchboard:ring': return `you plugged into the jack for ${PHONE[p.phone]}: it rings 🔔`;
      case 'boss:onHold': case 'lin:onHold': case 'kev:onHold': return `${name(e.name.split(':')[0])} picks up: Gary ⛳ on an inside line, HR's hold queue 🎵 on the kitchen phone`;
      case 'boss:hungUp': case 'lin:hungUp': case 'kev:hungUp': return `${name(e.name.split(':')[0])} hangs up`;
      case 'cord:out': return "you pulled Lin's phone cord out of the wall 🔌 (it lies on the floor)";
      case 'cord:in': return p.by === 'kev'
        ? "Kev found Lin's plug loose in the way of his charger and jammed it back in ❗ (a spark)"
        : "Lin found her line dead and pushed her plug back into the wall";
      case 'lin:deadLine': return "Lin's receiver is silent: her line is dead ❓ (she goes to the socket)";
      case 'interview:lin': return 'Lin takes her interview call 📞😊';
      case 'interview:busy': return `the interviewer gets a busy line: ${name(p.by)} is on Lin's phone ⛳`;
      case 'interview:dead': return "Lin's phone never rings: its cord is out 🔌";
      default: return undefined;
    }
  },
};
