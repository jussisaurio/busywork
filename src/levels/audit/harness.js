// The audit's words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
const NAME = { auditor: 'the auditor', boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;

const DESK = ['the boss\'s desk', 'Lin\'s desk', 'your desk', 'Kev\'s desk'];
const WHOSE = { laptop_boss: 'the boss\'s', laptop_lin: 'Lin\'s', laptop_kev: 'Kev\'s' };
const ON = { boss_desk: 'the boss\'s desk', lin_desk: 'Lin\'s desk', your_desk: 'your desk', kev_desk: 'Kev\'s desk' };
const WHY = { boss: 'the boss\'s desk', lin: 'Lin\'s desk', you: 'your desk', kev: 'Kev\'s desk' }; // index.js WHY
const THEIRS = { boss: 'his', lin: 'her', kev: 'his' };

export default {
  mission: 'MISSION: 3:00 PM. Laptop audit at 3:30. You sold yours.',

  landmarks: {
    boss_desk: 'boss_desk',
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    your_desk: 'your_desk',
    office_door: 'office_door',
    hallway_west: 'hallway_west',
    hallway_mid: 'hallway_mid',
    entrance: 'door_in',
    elevator: 'elevator',
    lobby: 'smoke',
    restroom_door: 'restroom',
    kitchen: 'kitchen',
    hallway_coffee: 'coffee',
    kitchen_coffee: 'pot',
  },

  stops: {
    hard: ['auditor:workAssigned'],
    soft: ['auditor:suspicious', 'laptop:reclaimed'],
  },

  names: NAME,

  mapKey: [
    'MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : outside lobby, L entrance, K coat rack, F fridge,',
    '     C M coffee machines (full pots), P your desk, R restroom, E elevator, i item (a laptop 💻 or a cup ☕), @ you,',
    '     a auditor, b boss, l Lin, k Kev,',
    '     * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (four laptops counted: ${o.routes.map((r) => WHOSE[`laptop_${r}`]).join(' + ')} counted twice)`
    : o.result === 'caught' ? 'CAUGHT by the auditor 🕵️❌👉'
    : o.result === 'blamed' ? `BLAMED 🪑 (the audit passed via ${o.routes.join(' + ')}, but you weren't at your desk to sign)`
    : o.why ? `FIRED 📦 at the sign-off (his first ❌: ${WHY[o.why] ?? o.why})`
    : 'FAIL: the audit never finished ⏰'),

  statusText: (game) => (game.suspicion.auditor > 0 ? [`a ❓ meter over the auditor's head: ${Math.round(game.suspicion.auditor * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.override === 'audit') bits.push('auditing, clipboard up 📋');
    if (n.override === 'hunt') bits.push('looking up and down the hallway for a missing laptop 💻❓');
    if (n.carry) bits.push(`holding ${WHOSE[n.carry] ?? n.carry} laptop`);
    return bits;
  },

  // Only what is visible: which desk has a laptop on it.
  worldText(game) {
    const w = game.world;
    const desks = Object.keys(ON).map((spot) => {
      const it = w.items.find((i) => i.spot === spot);
      return `${ON[spot]}: ${it ? 'a laptop 💻' : 'nothing'}`;
    });
    const floor = w.items.filter((i) => !i.spot).map((i) => `a laptop @(${i.x.toFixed(1)},${i.y.toFixed(1)})`);
    // (a cup never lies about: index.js ITEMS.coffee keep)
    return `WORLD: ${desks.join('; ')}${floor.length ? `; on the floor: ${floor.join(', ')}` : ''}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'witness:tattle': return p.reason === 'contraband'
        ? `${name(p.by)} saw what you're carrying 😠`
        : p.late
          ? `${name(p.by)} points you out to the auditor 👉${p.icon ?? ''} (seen earlier, told now)`
          : `${name(p.by)} shouts and points at you ❗👉${p.heard ? ' (the auditor heard)' : ''}`;
      case 'inspect:start': return 'ding: the auditor steps out of the lift, clipboard first 📋';
      case 'inspect:pass': return `the auditor ticks off ${DESK[p.index]} 💻✔️`;
      case 'inspect:fail': return `the auditor marks ${DESK[p.index]} 💻❌ and glares 😠`;
      case 'inspect:moved': return null;
      case 'inspect:done': return p.failed === null ? 'the auditor reaches the end of his list and tucks his clipboard under his arm 📋' : null;
      case 'audit:crossed': return p.index < 3 ? 'he writes it down and goes on down his list' : null;
      case 'audit:passed': return 'at your desk the auditor checks his list and smiles 😊';
      case 'audit:fired': return 'at your desk the auditor checks his list 💻❌, glares, and points you to the door 😠👉';
      case 'auditor:suspicious': return 'the auditor eyes you ❓ (a meter over his head starts filling)';
      case 'auditor:workAssigned': return `the auditor sends you to your desk 📄 (${p.reason})`;
      case 'laptop:spotted': return `${name(p.by)} sees ${WHOSE[p.type]} laptop on your desk 😠👀 and heads over`;
      case 'auditor:phone': return 'the auditor\'s phone rings 📱: he takes it to the meeting room';
      case 'auditor:call': return 'the auditor talks on the phone at the meeting-room window 💬, his back to the door';
      case 'laptop:reclaimed': return `${name(p.by)} took ${WHOSE[p.type]} laptop back 😠💻`;
      case 'kev:packed': return 'Kev unplugs his laptop and takes it under his arm';
      case 'kev:forgot': return 'Kev sets his laptop down on your desk to wave 👋, and walks off without it';
      case 'kev:fetched': return 'Kev finds his laptop on your desk, facepalms 💻🤦 and takes it';
      case 'laptop:missing': return `${name(p.by)} stares at an empty desk 💻❓`;
      case 'laptop:drawer': return `${name(p.by)} finds a laptop on ${THEIRS[p.by] ?? 'the'} desk 💻❓ and puts ${THEIRS[p.by] ?? 'the'} own in a drawer`;
      case 'laptop:home': return `${name(p.by)} puts ${THEIRS[p.by] ?? 'the'} laptop back on ${THEIRS[p.by] ?? 'the'} desk`;
      case 'coffee:taken': return 'you pour a coffee ☕ (your hands are full till you drink it)';
      case 'coffee:drunk': return 'you drink your coffee';
      case 'meeting:gather': return 'the auditor heads to your desk to sign off';
      default: return undefined;
    }
  },
};
