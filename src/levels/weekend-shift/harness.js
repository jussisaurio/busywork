// Weekend Shift's words for the AI-agent harness (src/levels/meeting/harness.js documents the fields). Text and
// command stops only: nothing here changes what happens in a day.
const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;

const COPIER = { ok: 'working', jammed: 'jammed, beeping ⚠️', fixing: 'Kev is fixing it, still beeping 🔧', fixed: 'working again' };
const PHONE = { idle: 'quiet', ringing: 'ringing ☎️', talking: 'the boss is on it 📞', done: 'quiet' };
const NOISE = { elevatorDing: 'DING! the microwave', machineBeep: 'the copier beeps', phoneRing: "the boss's phone rings" };

export default {
  mission: "MISSION: Friday, 4:00 PM. You're down for Saturday. At 5:00 the boss reads it out.",

  landmarks: {
    boss_desk: 'boss_desk',
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    boss_window: 'boss_window',
    board: 'meeting_presenter',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'kev:alerted', 'boss:phone'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, G glass you can see through, T desk/table, D door, H plant, X copier, R the Saturday roster (whiteboard),",
    '     M microwave, C counter, F fridge, P your desk, Q a phone on a little table in the supply room, L Lin\'s desk (her',
    '     lunch box sits on it), B the boss\'s phone (side table; his desk has none), i item,',
    '     @ you, b boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win'
    ? `WIN 🎉 (Kev's face is on the roster for Saturday: the boss read it out${o.routes.includes('ding') ? '; you wrote it during the DING' : o.routes.includes('phone') ? "; you wrote it during the boss's phone call" : ''})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠 (you work every Saturday now)'
    : o.result === 'blamed' ? "BLAMED 👉 (you weren't round the roster when it was read out: the boss pointed at your empty place, and the Saturday went to you)"
    : o.why === 'boss' ? "FAIL: the boss found his own face on the roster. He never put himself down: he wiped it, drew yours back and glared at you 😠👉"
    : 'FAIL: the boss read out your face on the roster. See you Saturday 👉😩'),

  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.override === 'fixing') bits.push(`fixing the copier ${Math.round(game.world.fixProgress * 100)}%`);
    if (n.override === 'onPhone') bits.push(`on the phone ${Math.round(game.world.callProgress * 100)}%`);
    if (n.id === 'lin' && n.anim === 'fishIn' && !n.override) bits.push(n.moving ? 'carrying her lunch box to the microwave' : 'heating her fish in the microwave 🐟');
    if (n.id === 'lin' && n.anim === 'fish' && !n.override) bits.push('with a plate of microwaved fish 🐟');
    return bits;
  },

  worldText(game) {
    const w = game.world;
    const roster = `${w.roster === 'player' ? 'your' : w.roster === 'boss' ? "the boss's" : "Kev's"} face in Saturday's slot`;
    const left = w.noodles === 'cooking' && w.dingAt !== null ? Math.max(0, w.dingAt - game.clock.minute) : null;
    const micro = w.noodles === 'cold' ? 'empty' : left > 0 ? `your noodles, ${Math.round(left * 10) / 10} min to go ⏲️` : 'your noodles, done 🍜';
    return `WORLD: the Saturday roster has ${roster}${w.rosterLocked ? ' (the boss is guarding it)' : ''}; copier ${COPIER[w.copier] ?? w.copier}; the boss's phone: ${PHONE[w.phone] ?? w.phone}; microwave: ${micro}`;
  },

  describe(e, memo) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to the boss 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you ❗👉${p.heard ? ' (the boss heard)' : ' (the boss is busy… for now)'}`;
      case 'noise': { // the copier and the phone repeat: one line per run of them (npc:heard says who looks)
        const what = NOISE[p.sfx] ?? 'a noise';
        if (p.sfx !== 'elevatorDing' && memo.lastNoise === what && e.minute - memo.lastNoiseAt < 3) {
          memo.lastNoiseAt = e.minute;
          return null;
        }
        memo.lastNoise = what;
        memo.lastNoiseAt = e.minute;
        return what;
      }
      case 'npc:heard': {
        const key = `heard:${p.id}`;
        if (e.minute - (memo[key] ?? -Infinity) < 3) { memo[key] = e.minute; return null; }
        memo[key] = e.minute;
        return `${name(p.id)} snaps round to look`;
      }
      case 'meeting:gather': return 'everyone gathers round the Saturday roster 🗓️';
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'microwave:started': return 'you put your noodles in the microwave ⏲️';
      case 'copier:jammed': return 'you jammed a paper clip in the copier 📎 (it starts beeping)';
      case 'kev:alerted': return 'Kev heard the copier 🖨️❗';
      case 'copier:fixing': return 'Kev is fixing the copier';
      case 'copier:fixed': return 'the copier is fixed (the beeping stops)';
      case 'phone:ringing': return "you rang the boss's phone";
      case 'boss:phone': return 'the boss jumps for his phone ☎️❗';
      case 'phone:answered': return 'the boss takes the call at his phone in the corner, his back to the office 📞';
      case 'phone:hungUp': return 'the boss hangs up 📞🤨';
      case 'roster:changed': return `you wrote ${name(p.to) === 'you' ? 'yourself' : name(p.to)} into Saturday's slot on the roster ✏️`;
      default: return undefined;
    }
  },
};
