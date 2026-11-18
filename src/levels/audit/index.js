// "The Audit": 3:00 PM. Laptop audit at 3:30. You sold yours.
// An auditor comes up in the lift and ticks the desks off in order: the boss's, Lin's, yours, Kev's. Twice he leaves
// his list for a moment, every loop: his pen runs dry at Lin's desk and he fetches one from the meeting room, and his
// phone rings after your desk and he takes the call in there. And twice he stands head down over a dry pen, blind
// past his clipboard: at Lin's desk, and at yours, where Kev strolls up beside him for his laptop. Each desk is judged when he gets to it, so a laptop he has already ticked off can run ahead of his clipboard to the next desk
// and be counted twice. Move one too early and the desk it left gets the ❌. A ❌ doesn't stop him: he finishes his
// list, then fires you at the sign-off.
//
// Same office as level 1 (its LOOKS and SOUNDS are imported read-only; the map is a copy, see MAP). The level
// object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { itemOn } from '../../sim/mechanics/putdown.js';
import { npcSees } from '../../game/perception.js';
import { speak, holdFor, spotLeg } from '../../sim/override.js';
import { COFFEE_CUP, pourCoffee } from '../office/coffee.js';
import { CAST, BEHAVIOURS, START, KEV_GO } from './cast.js';
import { SPOTS, LAPTOPS } from './spots.js';
import { laptop } from './things.js';
import { DECOR, LOOKS, POSES, TITLE, END_SCENES, VOICES, SOUNDS, PEN_LOOK, PEN_LOOK_YOU, penBeat, headDown } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';
import { OWN_DESK, FRIDGE, COAT_RACK, COFFEE_POT, ENTRANCE, RESTROOM, ELEVATOR } from '../office/legend.js';

// Level 1's floor (meeting/map.js), with the projector a plain meeting table and the coat rack and fridge set
// dressing only. Both coffee machines have a full pot and pour (office/coffee.js): the auditor, Lin and Kev drink
// from them all afternoon. Your desk keeps its P (you can still sit at it), but your laptop is gone: what you put
// on it lies on its east end (spot your_desk).
const MAP = [
  '##############################', // 0
  '#K......G..........#FTCT.....#', // 1   C the kitchen's coffee machine
  '#.......G..........#.........#', // 2
  '#..TTT..G..TTTTTT..#....TTT..#', // 3   the boss's desk (x3-5): he sits south of it, facing his window
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG..........#.........#', // 5
  '#GGGGGDGG##M##D#######DD######', // 6   glass: Lin, at her desk, looks into the boss's office; M the hallway's pot
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
  K: COAT_RACK,
  F: FRIDGE,
  C: COFFEE_POT,
  // The hallway's machine: a letter of its own, so DECOR draws its pot too (a prop draws on its letter's first tile).
  M: COFFEE_POT,
  P: OWN_DESK,
  L: ENTRANCE,
  R: RESTROOM,
  E: ELEVATOR,
};

const ZONES = {
  desk: { x0: 10, y0: 7, x1: 17, y1: 11 }, // at your desk when he signs off (meeting.room)
  boss_office: { x0: 1, y0: 1, x1: 8, y1: 6 }, // the boss's glass office (roles private)
};

// Owned laptops go straight back on their owner's desk, or into his drawer if something lies there: never into his
// hands, where the auditor could see him carry it (cast.js homeLaptop).
const backTo = (type, spot) => (game, npc) => {
  const w = game.world;
  if (w.items.some((i) => i.spot === spot)) {
    w[type] = 'drawer';
  } else {
    w.items.push(itemOn(SPOTS, spot, type));
    w[type] = spot;
  }
  game.events.emit('laptop:reclaimed', { type, by: npc.id });
};

// A laptop: drawn (things.js), its lid in its owner's colour, so whose it is shows in any hand and on any desk.
const laptopItem = (owner, spot) => ({
  icon: '💻',
  draw: laptop,
  tint: 'owner',
  place: `laptop_${owner}`,
  contraband: 'auditor', // company property on audit day: seen carrying one, you're caught
  bulky: true, // two hands: no phone or folder to hide it behind, standing or seated (player.js)
  owner: { id: owner, says: [{ say: ['😠', '💻'] }], reclaim: backTo(`laptop_${owner}`, spot) },
});

const ITEMS = {
  laptop_boss: laptopItem('boss', 'boss_desk'),
  laptop_lin: laptopItem('lin', 'lin_desk'),
  laptop_kev: laptopItem('kev', 'kev_desk'),
  // A coffee: your hands are full till you drink it (keep: it never lands on the floor, where the laptop row would
  // offer to take it). The cost shows at once: no laptop while you hold a cup.
  coffee: { ...COFFEE_CUP, keep: true },
};

// Whose desk each check is (the end card names the first ❌: end-scenes.js).
const WHY = ['boss', 'lin', 'you', 'kev'];
// The four records: whose laptop he ticked off on each desk (null: not reached, or crossed).
const RECORDS = ['atBoss', 'atLin', 'atYou', 'atKev'];
// Four desks passed, so one laptop was counted on two of them.
const twice = (w, type) => RECORDS.every((r) => w[r]) && RECORDS.filter((r) => w[r] === type).length >= 2;

// Taking a laptop (unplugging it from a desk, or off the floor where it fell) is sneaky: anyone who sees you at it minds (the auditor catches you). Replaces
// the generic pick_up row (play/interactions.js), whose pick-up anyone may watch. Laptops only (a cup never lies
// about: ITEMS.coffee keep).
const INTERACTIONS = {
  pick_up: {
    on: 'item', text: 'take the laptop', duration: 0.5, sneaky: true, saw: '💻',
    can: (p, w, item) => !p.held && w.items.includes(item) && LAPTOPS.includes(item.type),
    done(game, a) {
      const p = game.player;
      const w = game.world;
      w.items = w.items.filter((i) => i !== a.item);
      p.held = a.item.type;
      w[game.level.items[a.item.type].place] = 'player';
      game.events.emit('item:pickup', { type: a.item.type });
    },
  },
  pour_coffee: pourCoffee(),
  drink_coffee: {
    on: 'self', text: 'drink the coffee', duration: 1.2, sneaky: false, hold: true, preview: 'lift', // hold E, as for eating; a tap too (the cup keeps: no drop)
    can: (p) => p.held === 'coffee',
    done(game) {
      game.player.held = null;
      game.events.emit('coffee:drunk', {});
    },
  },
};

const ROLES = {
  authority: { id: 'auditor', offDuty: ['signoff'], helpless: [] },
  // The boss's glass office: if he finds you in it, he shows you out (👉 you 🚪) and keeps his laptop if you hold it.
  // Empty while he smokes in the lobby.
  private: [{ zone: 'boss_office', owner: 'boss' }],
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
    // At Lin's desk his pen runs dry: he shakes it, scribbles on the clipboard's corner, shakes it again
    // (presentation.js POSES), then goes for a pen (errands, below). Every loop.
    { item: LAPTOPS, spot: 'lin_desk', from: 'audit_lin', look: PEN_LOOK, record: 'atLin' },
    // At your desk the new pen is dry too: the same fight, till it writes. Then his phone rings.
    { item: LAPTOPS, spot: 'your_desk', from: 'audit_you', look: PEN_LOOK_YOU, record: 'atYou' },
    { item: LAPTOPS, spot: 'kev_desk', from: 'audit_kev', look: 2, record: 'atKev' },
  ],
  // A ❌: angry, and on down his list (cast.js auditGoesOn). He fires you at the sign-off (cast.js signOff).
  fail: { then: 'auditGoesOn', says: [{ say: ['😠'] }] },
}];

// The boss, his laptop gone, looks for it back and forth along the hallway (C: a tattle costs something you can
// see). Seen on your desk, he says so (😠👀) and goes and takes it, in plain view (cast.js bossFetches); next to him
// anywhere else (on Lin's desk, on the floor), he just picks it up. He gives up at 3:22, so that a laptop he takes
// back is behind his office door before the auditor, out of the lift at 3:25, can see the hallway (3:25.6): nobody
// carries a laptop in the auditor's view (DESIGN.md: the card's rule binds everyone). Lin is back only at 3:24:
// she misses hers and stays put (cast.js linCheck).
const PATROLS = {
  bossHunt: [[6, 5], [6, 7], [11, 7]], // out of his office to the hallway coffee machine: your desk in reach
};
const SEES_REACH = 4.5; // tiles: near enough to know it's his, lying on your desk
const ARM_REACH = 2.2; // tiles: near enough to pick it up where he stands
const foundLaptop = (type, home) => (game, npc) => {
  const w = game.world;
  if (npc.carry === type || npc._fetch || w.items.some((i) => i.type === type && i.spot === home)) return true;
  const it = w.items.find((i) => i.type === type);
  if (!it || !npcSees(game, npc, it.x, it.y)) return false;
  const d = Math.hypot(it.x - npc.x, it.y - npc.y);
  if (it.spot === 'your_desk' && d <= SEES_REACH) {
    npc._fetch = type; // cast.js bossFetches walks him to it
    npc._faceTarget = Math.atan2(it.y - npc.y, it.x - npc.x);
    speak(game, npc, [{ say: ['😠', '👀', '💻'] }]);
    holdFor(npc, 0.6);
    game.events.emit('laptop:spotted', { type, by: npc.id });
    return true;
  }
  if (d > ARM_REACH) return false;
  w.items = w.items.filter((i) => i !== it);
  npc.carry = type;
  w[type] = npc.id;
  speak(game, npc, [{ say: ['😠', '💻'] }]);
  game.events.emit('laptop:reclaimed', { type, by: npc.id });
  return true;
};
const HUNTS = [
  {
    npc: 'boss', override: 'hunt', plan: 'bossHunt', label: 'looking for his laptop', route: 'bossHunt',
    look: { angle: 1.1, time: 1.0 }, start: { wait: 0.8 }, until: at('3:22.5', START),
    found: foundLaptop('laptop_boss', 'boss_desk'),
  },
];

// The auditor's two errands, both in the meeting room with his back to its door, every loop. They go into his
// inspection plan (sim/mechanics/inspection.js build) as extra legs: the pen before your desk, the call before
// Kev's. A plan rebuilt after a ❌ (cast.js auditGoesOn) gets the ones still to come.
//   pens  his pen ran dry at Lin's desk (presentation.js PEN_BEATS): he takes one from the pot on the meeting table.
//   call  after your desk's tick his phone rings (📱): he takes it at the meeting room window.
const PEN_FETCH = 3; // s at the pen pot: the first pen he tries is dry too
const CALL = 3.2; // s on the phone (short: the longer pen fight at your desk eats into his hour)
const errandLegs = {
  audit_you: (game) => spotLeg(game, 'pens', {
    arrive(g, n) {
      n._penDone = true;
      n._reaching = true;
      holdFor(n, PEN_FETCH);
      speak(g, n, [{ say: ['🖊️'], kind: 'thought', ttl: PEN_FETCH, after: 0.9 }]);
    },
  }),
  audit_kev: (game) => spotLeg(game, 'call', {
    arrive(g, n) {
      n._callDone = true;
      holdFor(n, CALL);
      speak(g, n, [{ say: ['💬'], ttl: 1.6 }, { say: ['💬'], ttl: 1.6, after: 1.9 }]);
      g.events.emit('auditor:call', {});
    },
  }),
};
const ERRAND_DONE = { audit_you: '_penDone', audit_kev: '_callDone' };
function errands(game, npc) {
  const plan = npc._plan;
  const insp = game.level.inspections[0];
  if (npc.override !== insp.override || !npc._insp || !plan || plan._errands || !plan.key?.startsWith(`${insp.plan}#`)) return;
  plan._errands = true;
  for (const [before, leg] of Object.entries(errandLegs)) {
    if (npc[ERRAND_DONE[before]]) continue;
    const j = plan.legs.findIndex((l, k) => k >= plan.li && l.name === before);
    if (j < 0) continue;
    plan.legs.splice(j, 0, leg(game));
    if (j === plan.li) plan.path = null;
  }
}
// His errands as they show: the pen in his reach at the pot, the phone ringing as he sets off for the call (📱) and
// at his ear till it's over.
function errandsShow(game, npc, sim) {
  const plan = npc._plan;
  if (npc._reaching && !(npc._wait > 0)) npc._reaching = false;
  if (!npc._rang && npc._insp && plan?.legs[plan.li]?.name === 'call' && !(npc._wait > 0)) {
    npc._rang = true;
    npc._phone = true;
    sim.speak(game, npc, [{ say: ['📱'], ttl: 1.4 }]);
    game.events.emit('auditor:phone', {});
  }
  if (npc._phone && npc._callDone && !(npc._wait > 0)) npc._phone = false;
}

// The minute each schedule reads (npcs.js clockFor).
//   The boss and Lin skip the sign-off: it is the auditor's business at your desk, and they keep to their smoke
//   and their coffee (back at their desks they would look for their laptops, cast.js).
//   Kev finishes his coffee at KEV_GO and walks back to his desk; if his laptop lies on yours he goes on for it,
//   and gets there as the auditor, ticking your desk, fights his second dry pen head down. The clock holds him at
//   KEV_GO till the auditor has his new pen (out of sight in the meeting room), so the two stay in step every loop.
//   The auditor wonders at his dry pen (🖊️❓, then 🖊️😤 at your desk) as he starts to shake it, and runs his
//   errands. Head down over the pen, he sees only his clipboard (HEAD_DOWN): a hand at his elbow goes unseen.
const HEAD_DOWN = { fov: (70 * Math.PI) / 180, radius: 1 }; // tiles: the clipboard, and nothing past it
const PEN_SAYS = { 2: ['🖊️', '❓'], 3: ['🖊️', '😤'] };
function clockFor(game, npc, sim) {
  const now = game.clock.minute;
  if (npc.id === 'auditor') {
    const fight = headDown(npc);
    npc._eyes ??= npc.vision;
    npc.vision = fight ? HEAD_DOWN : npc._eyes;
    if (fight && npc._penDry !== fight && penBeat(npc) === 'shake') {
      npc._penDry = fight;
      sim.speak(game, npc, [{ say: PEN_SAYS[fight], kind: 'thought', ttl: 1.6 }]);
    }
    errands(game, npc);
    errandsShow(game, npc, sim);
  }
  if ((npc.id === 'boss' || npc.id === 'lin') && npc.override === 'signoff') npc.override = null;
  if (npc.id !== 'kev') return now;
  const w = game.world;
  npc._mineOnYours = w.items.some((i) => i.spot === 'your_desk' && i.type === 'laptop_kev'); // cast.js kevStopsAgain
  npc._mineHome = w.laptop_kev === 'kev_desk' || w.laptop_kev === 'kev' || w.laptop_kev === 'drawer'; // kevLooks
  if (npc._released || now < KEV_GO) return now;
  const auditor = game.npcs.find((n) => n.id === 'auditor');
  if (auditor?._penDone || now >= game.level.day.gatherAt) npc._released = true;
  return npc._released ? now : KEV_GO - 1e-6;
}

export default {
  id: 'audit',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: PATROLS,
  cast: CAST,
  day: {
    start: START,
    gatherAt: at('3:57.8', START), // he signs off at your desk
    meetingAt: at('4:00.4', START), // he's back at your desk to sign off
    clockRedAt: at('3:30', START),
    clockTickAt: at('3:30', START),
    tockAt: at('3:55.8', START),
    halfMinuteAt: at('3:57.8', START),
  },
  clockFor,
  interactions: INTERACTIONS,
  items: ITEMS,
  roles: ROLES,
  lures: [],
  hunts: HUNTS,
  doors: [],
  inspections: INSPECTIONS,
  behaviours: BEHAVIOURS,
  meeting: {
    override: 'signoff', room: 'desk', chair: 'player_desk', presenter: 'player_desk',
    // A ❌ anywhere: fired at the sign-off. why: whose desk got the first ❌ (end-scenes.js).
    verdict: (game, { result }) => (result === 'fail' ? { why: WHY[game.world.crossed[0]] ?? 'you' } : null),
  },
  // A route: whose laptop he counted twice.
  routes: [
    { id: 'boss', icon: '@boss', achieved: (w) => twice(w, 'laptop_boss') },
    { id: 'lin', icon: '@lin', achieved: (w) => twice(w, 'laptop_lin') },
    { id: 'kev', icon: '@kev', achieved: (w) => twice(w, 'laptop_kev') },
  ],
  outcomeOrder: ['boss', 'lin', 'kev'],
  initialWorld: () => ({
    laptop_boss: 'boss_desk', // where each laptop is: a spot, 'player', 'dropped', or who carries it
    laptop_lin: 'lin_desk',
    laptop_kev: 'kev_desk',
    atBoss: null, // whose laptop he ticked off on each desk (RECORDS)
    atLin: null,
    atYou: null,
    atKev: null,
    crossed: [], // the desks (check indexes) he gave a ❌
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
