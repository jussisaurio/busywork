// Early Bus's words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
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
    "     O the open-plan wall clock (a stepladder under each), F fridge, C coffee machine, P your desk, R restroom, E elevator,",
    '     , pavement, B the bus stop sign (the road runs along the bottom edge), @ you, b boss, l Lin, k Kev,',
    '     * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (you caught your bus 🚌: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠 (fiddling with the clock)'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (the boss left via ${o.routes.join(' + ')}, but you weren't at the bus stop: the bus left without you)`
    : o.why === 'stop' ? "FAIL: 4:30, you are at the stop but the boss is still in, so you can't get on; the bus leaves 🚌💨"
    : 'FAIL: 4:30, the boss is still in, and your bus leaves without you 🚌💨'),

  playerText: () => [],

  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.anim === 'leaving') bits.push('going home');
    if (n.anim === 'smoking' && !n.override) bits.push('on a smoke break, smoking');
    return bits;
  },

  worldText(game) {
    const w = game.world;
    return `WORLD: the boss's clock (Q) says ${shows(game, w.bossClock)}; the open-plan clock (O) says ${shows(game, w.openClock)}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to the boss 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you ❗👉${p.heard ? ' (the boss heard)' : ' (the boss is away… for now)'}`;
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'clock:pushed': return `you pushed ${CLOCK_NAME[p.clock]} forward: it runs ${p.off} minutes fast 🕐`;
      case 'clock:look': return `${name(p.id)} looks up at ${CLOCK_NAME[p.clock]} 🕐`;
      case 'clock:jump': return `${name(p.id)} believes it: ❗ (now ${p.off} minutes ahead)`;
      case 'boss:frown': return `the boss turns to ${name(p.at)}'s empty desk: where is ${name(p.at)}? ❓${p.gone ? ' (gone home)' : ''}`;
      case 'boss:herd': return 'the boss sees the empty desks ❗ and packs up';
      case 'boss:left': return 'ding: the elevator doors close behind the boss';
      case 'lin:left': return 'ding: the elevator doors close behind Lin';
      case 'kev:left': return 'ding: the elevator doors close behind Kev';
      case 'meeting:gather': return "it's 4:30: the bus at the stop outside closes its doors 🚌";
      default: return undefined;
    }
  },
};
