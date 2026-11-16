// The Last Bus's words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
import { clockArg } from '../../config.js';
import { START } from './cast.js';

const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;
const CLOCK_NAME = { boss: "the boss's clock", open: 'the open-plan clock', boss_clock: "the boss's clock", open_clock: 'the open-plan clock' };

// What a wall clock shows: the true time plus however fast it runs. A pushed clock hangs crooked.
const shows = (game, fast) => `${clockArg(game.clock.minute + fast, START)}${fast ? ' (hanging crooked)' : ''}`;

export default {
  mission: 'MISSION: 3:00 PM. Your bus leaves at 4:30. The boss leaves at 4:50. Nobody leaves before him. Catch the bus.',

  landmarks: {
    boss_desk: 'boss_desk',
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    boss_office_door: 'boss_door',
    kitchen: 'coffee',
    entrance: 'door_in',
    restroom_door: 'restroom',
    bus_stop: 'bus_stop',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : lobby, L entrance (open), Q the boss's wall clock,",
    "     O the open-plan wall clock (a stepladder under each), K the boss's coat rack, F fridge, C coffee machine, P your desk,",
    '     R restroom, , pavement, B the bus stop sign, = the zebra crossing (the road runs along the bottom edge), @ you,',
    '     b boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (you caught your bus 🚌: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠 (up the stepladder at his clock, or out in the street while he was still in)'
    : o.result === 'blamed' ? `BLAMED (the boss went home: ${o.routes.join(' + ')}; but you weren't at the bus stop, and the bus left without you 🚌💨)`
    : o.why === 'stop' ? "FAIL: 4:30, you are at the stop but the boss is still in, so you can't get on; the bus leaves 🚌💨 and he fetches you back"
    : 'FAIL: 4:30, the boss is still in, and your bus leaves without you 🚌💨'),

  playerText: () => [],

  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.anim === 'leaving') bits.push('going home');
    if (n.carry === 'coffee') bits.push('carrying a coffee');
    return bits;
  },

  worldText(game) {
    const w = game.world;
    const coat = w.coat === 'hook' ? "the boss's coat hangs on the rack (K)" : 'the coat rack (K) is empty';
    return `WORLD: the boss's clock (Q) says ${shows(game, w.bossClock)}; the open-plan clock (O) says ${shows(game, w.openClock)}; ${coat}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      // A clock bubble beside the person instead of over him (clocks.js clockSay): his, by its voice.
      case 'say': return typeof p.owner === 'object' && NAME[p.voice]
        ? `${name(p.voice)} ${p.kind === 'thought' ? 'thinks' : 'says'} ${p.icons.join('')}`
        : undefined;
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to the boss 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you ❗👉${p.heard ? ' (the boss heard)' : ' (the boss is away… for now)'}`;
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'clock:pushed': return `you pushed ${CLOCK_NAME[p.clock]} forward: it runs ${p.off} minutes fast 🕐`;
      case 'clock:look': return `${name(p.id)} looks up at ${CLOCK_NAME[p.clock]}`;
      case 'clock:jump': return `${name(p.id)} believes it 😮 (${p.ahead ? 'later' : 'earlier'} than he thought; he now runs ${p.off} minutes fast)`;
      case 'clock:reset': return `the boss sets ${CLOCK_NAME[p.clock]} right 😠`;
      case 'boss:desk': return `the boss glances at your desk${p.empty ? ': your chair is empty' : ''}`;
      case 'boss:hunt': return 'the boss gets up to look for you ❓';
      case 'boss:suspect': return 'the boss turns from his jumped clock to you, in his office 🤨: he will set it right';
      case 'caretaker:battery': return 'the caretaker swaps the battery in the boss\'s clock 🔋, leaving the stepladders out';
      case 'caretaker:left': return 'the caretaker goes';
      case 'coffee:taken': return `${name(p.by)} pours a coffee from the pot ☕`;
      case 'boss:herd': return `the boss, walking under the open-plan clock, reads ${clockArg(p.shown, START)} 😮: home time`;
      case 'boss:shrug': return `the boss, walking under the open-plan clock, reads ${clockArg(p.shown, START)} and shrugs`;
      case 'boss:coat': return 'the boss takes his coat off the rack 👋';
      case 'coat:seen': return p.follow
        ? `${name(p.by)} sees the boss take his coat off the rack 🧥👀`
        : `${name(p.by)} ${p.early ? 'picks up his laptop to go and ' : 'stands up and '}looks at the coat rack${p.coat ? ": the boss's coat is still there 🧥😬, back to the desk" : ': empty'}`;
      case 'coat:shrug': return `${name(p.by)} looks at ${p.by === 'lin' ? 'Kev' : 'Lin'} and shrugs 🤷`;
      case 'coat:follow': return `${name(p.by)} gets up to follow the boss out`;
      case 'boss:left': return 'the boss goes home over the zebra crossing';
      case 'lin:left': return 'Lin goes home over the zebra crossing';
      case 'kev:left': return 'Kev goes home over the zebra crossing';
      case 'meeting:gather': return "it's 4:30: the bus at the stop outside closes its doors 🚌";
      default: return undefined;
    }
  },
};
