// The fixture's words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
const NAME = { doreen: 'Doreen', gus: 'Gus', player: 'you' };
const name = (id) => NAME[id] ?? id;

const POPCORN = { bag: 'a bag of popcorn next to it', burning: 'popcorn burning 🔥', smoking: 'smoking, alarm going 🚨', binned: 'empty, smells burnt' };

export default {
  mission: "MISSION: 3:00 PM. It's your birthday. Nobody was supposed to know. Make sure nobody sings.",

  landmarks: {
    my_seat: 'player_desk',
    doreen_desk: 'doreen_desk',
    gus_desk: 'gus_desk',
    door: 'door',
    party: 'birthday_chair',
  },

  stops: {
    hard: ['doreen:workAssigned'],
    soft: ['doreen:suspicious', 'cake:returned', 'doreen:alerted'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, T desk/table, D door, H plant, W Doreen's birthday calendar, M microwave, F fridge, B the cake on its stand,",
    '     P your desk, i item, @ you, d Doreen, g Gus, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (nobody sang: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by Doreen 😠'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (no song, via ${o.routes.join(' + ')}, but you skipped your own party)`
    : 'FAIL: the whole office sang Happy Birthday to you 🎶😅'),

  playerText: (game) => (game.player.smeared ? ['frosting on your chin'] : []),

  statusText: (game) => (game.suspicion.doreen > 0 ? [`a ❓ meter over Doreen's head: ${Math.round(game.suspicion.doreen * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.override === 'fanning') bits.push(`fanning the smoke alarm ${Math.round(game.world.fanProgress * 100)}%`);
    return bits;
  },

  worldText(game) {
    const w = game.world;
    const cake = w.cake === 'stand' ? 'a cake 🎂' : 'an empty plate';
    const floor = w.items.length ? `; on the floor: ${w.items.map((i) => i.type).join(', ')}` : '';
    return `WORLD: the stand holds ${cake}; microwave: ${POPCORN[w.popcorn] ?? w.popcorn}; the calendar says it's ${w.birthday === 'gus' ? "Gus's" : 'your'} birthday${floor}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to Doreen 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you ❗👉${p.heard ? ' (Doreen heard)' : ''}`;
      case 'meeting:gather': return 'everyone gathers round the cake 🎂';
      case 'doreen:suspicious': return 'Doreen eyes you ❓ (a meter over her head starts filling)';
      case 'doreen:workAssigned': return `Doreen assigned you work 📄 (${p.reason})`;
      case 'popcorn:burning': return 'the popcorn is burning 🔥';
      case 'doreen:alerted': return 'the smoke alarm goes off 🚨 Doreen jumps up';
      case 'popcorn:fanning': return 'Doreen fans the smoke alarm with her clipboard';
      case 'popcorn:binned': return 'the alarm stops; Doreen bins the popcorn';
      case 'calendar:changed': return "you moved your birthday to Gus's 📅";
      case 'cake:taken': return 'you took the cake 🎂';
      case 'cake:eaten': return 'you ate the whole cake';
      case 'cake:returned': return 'Gus put his cake back on its stand';
      default: return undefined;
    }
  },
};
