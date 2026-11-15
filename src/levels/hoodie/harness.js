// Kev's Hoodie in words, for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;

const WORN = { hoodie: "Kev's hoodie, hood up", jacket: "the boss's suit jacket" };
const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);

export default {
  mission: "MISSION: 3:45 PM. The boss's screen shows your awful review. Delete it before he sends it.",

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

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (the review is gone, via: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠 (fired: you leave with a box 📦)'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (the review is gone via ${o.routes.join(' + ')}, but so were you: your chair was empty at 3:45)`
    : 'FAIL: the boss sent your review 📧 and it is as bad as you feared'),

  playerText: (game) => (WORN[game.player.held] ? [`wearing ${WORN[game.player.held]}`] : []),

  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.id === 'kev' && game.world.hoodie !== 'kev') bits.push('in a T-shirt, no hoodie');
    if (n.id === 'boss') bits.push('in shirtsleeves');
    if (n.override === 'stepAside' || n.override === 'watching') bits.push("standing beside his desk, watching \"Kev\" at his computer");
    return bits;
  },

  // Only what is visible on screen.
  worldText(game) {
    const w = game.world;
    const screen = w.review === 'queued' ? 'an email 📧, ready to send' : 'an empty outbox 🗑️';
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
      case 'meeting:gather': return 'the boss sits down at his computer to send it 📧';
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'boss:stepsAside': return 'the boss gets up and lets "Kev" at his computer';
      case 'boss:impatient': return 'the boss has waited long enough and takes his chair back';
      case 'jacket:taken': return "you put on the boss's suit jacket 👔";
      case 'jacket:hung': return 'you hang his jacket back on the rack';
      case 'pc:asked': return 'you offer to fix his computer';
      case 'review:deleted': return 'you deleted your review 🗑️';
      case 'review:sending': return 'the boss clicks SEND 📧';
      case 'review:missing': return 'the boss looks for your review and shrugs';
      case 'kev:hoodieOff': return 'Kev takes off his hoodie and leaves it on his chair';
      case 'kev:left': return 'the elevator doors close behind Kev';
      case 'disguise:fooled': case 'disguise:knows': case 'kev:bye': case 'pc:free': return null; // the lines people say show it
      default: return undefined;
    }
  },
};
