// "The Audit": 3:30 laptop audit. There should be four. You sold yours.
// An auditor comes up in the lift and ticks the desks off in order: the boss's, Lin's, yours, Kev's. Each desk is
// judged when he gets to it, so a laptop he has already ticked off can run ahead of his clipboard to the next desk
// and be counted twice. Move one too early and the desk it left gets the ❌.
//
// Same office as level 1 (its LOOKS and SOUNDS are imported read-only; the map is a copy, see MAP). The level
// object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { itemOn } from '../../sim/mechanics/putdown.js';
import { CAST, BEHAVIOURS, START } from './cast.js';
import { SPOTS, LAPTOPS } from './spots.js';
import { DECOR, LOOKS, POSES, TITLE, END_SCENES, VOICES, SOUNDS } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

// Level 1's floor (meeting/map.js), with the projector a plain meeting table and the coat rack, coffee machine and
// fridge set dressing only. Your desk keeps its P (you can still sit at it), but your laptop is gone: what you put
// on it lies on its east end (spot your_desk).
const MAP = [
  '##############################', // 0
  '#K......G..........#FTCT.....#', // 1
  '#.......G..........#.........#', // 2
  '#..TTT..G..TTTTTT..#....TTT..#', // 3   the boss's desk (x3-5): he sits south of it, facing his window
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG..........#.........#', // 5
  '#GGGGGDGG##C##D#######DD######', // 6   glass: Lin, at her desk, looks straight into the boss's office; C the hallway coffee machine
  '#............................#', // 7   the hallway the auditor walks
  '#..TTT......TPT......TTT.....#', // 8   Lin's desk (x3-5), yours (x12-14), Kev's (x21-23)
  '#............................#', // 9
  '#............................#', // 10
  '#..TTT......TTT......TTT.....#', // 11
  '#...........................H#', // 12
  '#GGGLGGGGG###############R####', // 13
  '#:::::::::####################', // 14
  '#:::::::::####################', // 15
  '##EE##########################', // 16
];

const LEGEND = {
  K: { kind: 'coat_rack', solid: true, opaque: false },
  F: { kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' },
  C: { kind: 'coffee_machine', solid: true, opaque: false },
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  L: { kind: 'entrance', solid: true, opaque: false, npcPassable: true },
  R: { kind: 'restroom', solid: true, opaque: true },
  E: { kind: 'elevator', solid: true, opaque: true },
};

const ZONES = {
  desk: { x0: 10, y0: 7, x1: 17, y1: 11 }, // at your desk when he signs off (meeting.room)
};

// Owned laptops go straight back on their owner's desk (or into his hands if something lies there).
const backTo = (type, spot) => (game, npc) => {
  const w = game.world;
  if (w.items.some((i) => i.spot === spot)) {
    npc.carry = type;
    w[type] = npc.id;
  } else {
    w.items.push(itemOn(SPOTS, spot, type));
    w[type] = spot;
  }
  game.events.emit('laptop:reclaimed', { type, by: npc.id });
};

const laptop = (owner, spot) => ({
  icon: '💻',
  place: `laptop_${owner}`,
  contraband: 'auditor', // company property on audit day: seen carrying one, you're caught
  owner: { id: owner, says: [{ say: ['😠', '💻'] }], reclaim: backTo(`laptop_${owner}`, spot) },
});

// Four desks passed, so one laptop was counted on two of them.
const twice = (w, type) => w.audited && [w.atBoss, w.atLin, w.atYou, w.atKev].filter((t) => t === type).length >= 2;

const ITEMS = {
  laptop_boss: laptop('boss', 'boss_desk'),
  laptop_lin: laptop('lin', 'lin_desk'),
  laptop_kev: laptop('kev', 'kev_desk'),
};

// Unplugging a laptop from a desk is sneaky: anyone who sees you at it minds (the auditor catches you). Replaces
// the generic pick_up row (play/interactions.js), whose pick-up anyone may watch.
const INTERACTIONS = {
  pick_up: {
    on: 'item', icon: '✋', text: 'unplug the laptop', duration: 0.5, sneaky: true, saw: '💻',
    can: (p, w, item) => !p.held && w.items.includes(item),
    done(game, a) {
      const p = game.player;
      const w = game.world;
      w.items = w.items.filter((i) => i !== a.item);
      p.held = a.item.type;
      w[game.level.items[a.item.type].place] = 'player';
      game.events.emit('item:pickup', { type: a.item.type });
    },
  },
};

const ROLES = {
  authority: { id: 'auditor', offDuty: ['signoff'], helpless: [] },
};

const INSPECTIONS = [{
  npc: 'auditor',
  at: at('3:30', START), // as the card says (he's out of the lift at 3:25, at the coffee machine)
  override: 'audit',
  plan: 'audit',
  label: 'laptop audit',
  sign: 'item',
  checks: [
    { item: LAPTOPS, spot: 'boss_desk', from: 'audit_boss', look: 2, record: 'atBoss' },
    { item: LAPTOPS, spot: 'lin_desk', from: 'audit_lin', look: 3.5, record: 'atLin' }, // her desk takes him longer
    { item: LAPTOPS, spot: 'your_desk', from: 'audit_you', look: 2, record: 'atYou' },
    { item: LAPTOPS, spot: 'kev_desk', from: 'audit_kev', look: 2, record: 'atKev' },
  ],
  pass: { set: { audited: true }, event: 'audit:passed', says: [{ say: ['💻', '💻', '💻', '💻', '👍'] }] },
  fail: { then: 'caught', says: [{ say: ['💻', '❓'] }] },
}];

export default {
  id: 'audit',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START,
    gatherAt: at('3:44', START), // he signs off at your desk
    meetingAt: at('3:46.5', START), // he's back at your desk to sign off
    clockRedAt: at('3:30', START),
    clockTickAt: at('3:30', START),
    tockAt: at('3:42', START),
    halfMinuteAt: at('3:44', START),
  },
  interactions: INTERACTIONS,
  items: ITEMS,
  roles: ROLES,
  lures: [],
  hunts: [],
  doors: [],
  inspections: INSPECTIONS,
  behaviours: BEHAVIOURS,
  meeting: { override: 'signoff', room: 'desk', chair: 'player_desk', presenter: 'player_desk' },
  // A route: whose laptop he counted twice.
  routes: [
    { id: 'boss', icon: '👔', achieved: (w) => twice(w, 'laptop_boss') },
    { id: 'lin', icon: '👓', achieved: (w) => twice(w, 'laptop_lin') },
    { id: 'kev', icon: '🔧', achieved: (w) => twice(w, 'laptop_kev') },
  ],
  outcomeOrder: ['boss', 'lin', 'kev'],
  initialWorld: () => ({
    laptop_boss: 'boss_desk', // where each laptop is: a spot, 'player', 'dropped', or who carries it
    laptop_lin: 'lin_desk',
    laptop_kev: 'kev_desk',
    audited: false, // every desk ticked
    atBoss: null, // whose laptop he ticked off on each desk
    atLin: null,
    atYou: null,
    atKev: null,
    items: [itemOn(SPOTS, 'boss_desk', 'laptop_boss'), itemOn(SPOTS, 'lin_desk', 'laptop_lin'), itemOn(SPOTS, 'kev_desk', 'laptop_kev')],
  }),
  harness,
  gate,
  title: TITLE,
  decor: DECOR,
  looks: LOOKS,
  poses: POSES,
  endScenes: END_SCENES,
  sounds: SOUNDS,
  voices: VOICES,
};
