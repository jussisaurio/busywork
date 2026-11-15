// The Layoff List in words, for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;

const WORN = { hoodie: "Kev's hoodie, hood up", jacket: "the boss's suit jacket" };
const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);

export default {
  mission: "MISSION: 3:00 PM. At 3:45 the boss emails HR the layoff list. You're on it. Get your name off it.",

  landmarks: {
    boss_desk: 'boss_desk',
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    boss_office_door: 'boss_door',
    entrance: 'door_in',
    restroom_door: 'restroom',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'boss:stepsAside', 'boss:impatient'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : outside lobby, L entrance, K coat rack,",
    "     Q the boss's computer, F fridge, C coffee machine, P your desk, R restroom, E elevator, i item,",
    '     @ you, b boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (the list went to HR without you, via: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠 (fired on the spot: you leave with a box 📦)'
    : o.result === 'blamed' ? `BLAMED 🪑 (your name came off via ${o.routes.join(' + ')}, but your chair was empty at 3:45, so he put you back on)`
    : 'FAIL: the boss sent the list to HR with you on it 📧; you leave with a box 📦'),

  playerText: (game) => (WORN[game.player.held] ? [`wearing ${WORN[game.player.held]}`] : []),

  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.id === 'kev' && game.world.hoodie !== 'kev') bits.push('in a T-shirt, no hoodie');
    if (n.id === 'boss') bits.push('in shirtsleeves');
    if (n.override === 'stepAside' || n.override === 'watching') bits.push("standing beside his desk, watching \"Kev\" at his computer");
    if (n.id === 'kev' && game.world.pc === 'kev') bits.push("typing at the boss's computer while the boss watches");
    return bits;
  },

  // Only what is visible on screen.
  worldText(game) {
    const w = game.world;
    const people = w.list === 'on' ? 'four faces, yours marked in red' : 'three faces; yours is gone';
    const screen = w.glitch ? 'static (it is acting up)' : `the layoff list: ${people}`;
    const rack = w.jacket === 'rack' ? "the boss's suit jacket" : 'nothing';
    const chair = w.hoodie === 'chair' ? "; Kev's hoodie is on his chair" : '';
    const floor = w.items.filter((i) => !(i.type === 'hoodie' && w.hoodie === 'chair'));
    const floorText = floor.length ? `; on the floor: ${floor.map((i) => `${i.type}@(${f1(i.x)},${f1(i.y)})`).join(', ')}` : '';
    return `WORLD: the boss's screen shows ${screen}; coat rack holds ${rack}${chair}${floorText}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to the boss 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you ❗👉${p.heard ? ' (the boss heard)' : ''}`;
      case 'meeting:gather': return 'the boss sits down at his computer to send the list 📧';
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'boss:stepsAside': return 'the boss gets up and lets "Kev" at his computer';
      case 'boss:impatient': return 'the boss has waited long enough and takes his chair back';
      case 'jacket:taken': return "you put on the boss's suit jacket 👔";
      case 'jacket:hung': return 'you hang his jacket back on the rack';
      case 'pc:asked': return 'you offer to fix his computer';
      case 'list:edited': return p.as === 'kev' ? 'you take your name off the list 🗑️ (to the boss, "Kev" is fixing it)'
        : p.as === 'boss' ? 'you take your name off the list 🗑️ (to anyone looking in, the boss is at his own computer)'
        : 'you take your name off the list 🗑️';
      case 'kev:fixing': return "the boss's screen is static; he waves Kev over, and Kev types at it while the boss stands aside and watches";
      case 'pc:fixed': return "Kev fixed it: the boss's screen shows the list again, and he takes his chair back 😊";
      case 'pc:actsUp': return "the boss's screen goes to static again; he waves for Kev 👋";
      case 'pc:thumped': return 'nobody came: the boss thumps his monitor and it works again 😠';
      case 'kev:hoodieOff': return 'Kev takes off his hoodie and leaves it on his chair';
      case 'kev:left': return 'the elevator doors close behind Kev';
      case 'disguise:fooled': case 'disguise:knows': case 'kev:bye': case 'pc:free': return null; // the lines people say show it
      default: return undefined;
    }
  },
};
