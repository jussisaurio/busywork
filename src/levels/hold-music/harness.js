// Hold Music's words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;
const PHONE = { lin: "Lin's phone", boss: "the boss's phone", kev: "Kev's phone", kitchen: 'the kitchen phone' };
const ANSWER = { // the interview's state, for the WORLD line
  due: 'due at 3:30',
  lin: 'Lin took it',
  boss: 'the boss took it for her',
  busy: 'the interviewer got a busy line',
  dead: "Lin's phone never rang",
};

export default {
  mission: "MISSION: 3:00 PM. Lin's interview for your job is a phone call at 3:30. She must miss it.",

  landmarks: {
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    boss_office: 'boss_desk',
    kitchen: 'kitchen_lin',
    switchboard: 'switchboard',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'cord:in', 'meeting:gather'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, G glass, D door, T desk/table, H plant, P your desk, L Lin's desk phone, V Kev's desk phone, Y/Z wall phones",
    "     (boss's office, kitchen), 1-4 switchboard buttons (Lin, boss, Kev, kitchen), F fridge, C coffee machine, @ you,",
    '     b the boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (Lin missed her interview: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (Lin missed it, via ${o.routes.join(' + ')}, but you weren't at your desk)`
    : 'FAIL: Lin took her interview call 📞😊'),

  playerText: () => [],

  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const m = /^(to|on)_(\w+)_phone$/.exec(n.override ?? '');
    if (!m) return [];
    if (m[1] === 'to') return [`going to answer ${PHONE[m[2]]} ☎️`];
    return [`on hold on ${PHONE[m[2]]} 🎵 ${Math.round((game.world[`hold_${n.id}`] ?? 0) * 100)}%`];
  },

  worldText(game) {
    const w = game.world;
    const phones = Object.keys(PHONE).map((p) => {
      const st = w[`line_${p}`] ? `${name(w[`line_${p}`])} on hold`
        : w[`call_${p}`] ? `ringing, ${name(w[`call_${p}`])} answering`
        : p === 'lin' && w.cord === 'out' ? 'unplugged' : 'quiet';
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
      case 'meeting:gather': return "3:30: Lin's phone rings 🔔 (the interview)";
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'switchboard:ring': return `you rang ${PHONE[p.phone]} 🔔${p.by ? `; ${name(p.by)} goes to answer it` : '; nobody near enough to hear it'}`;
      case 'boss:onHold': case 'lin:onHold': case 'kev:onHold': return `${name(e.name.split(':')[0])} picks up and gets the hold music 🎵`;
      case 'boss:hungUp': case 'lin:hungUp': case 'kev:hungUp': return `${name(e.name.split(':')[0])} hangs up`;
      case 'cord:out': return "you unplugged Lin's phone 🔌";
      case 'cord:in': return "Kev plugged Lin's phone back in 🔌👍";
      case 'interview:lin': return 'Lin takes her interview call 📞😊';
      case 'interview:boss': return 'the boss takes the call for Lin 📞👔 ("very motivated")';
      case 'interview:busy': return "the interviewer gets a busy line: someone's on hold on Lin's phone 📵";
      case 'interview:dead': return "Lin's phone never rings 🔌🦗";
      default: return undefined;
    }
  },
};
