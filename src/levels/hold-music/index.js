// "Hold Music": Lin's interview for your job is a phone call at 3:30. She must miss it.
//
// The office switchboard has one button per phone: Lin's desk, the boss's office, Kev's desk and the kitchen.
// A ring is a noise (every head in earshot turns to the phone) and a lure: the phone's owner answers if he hears
// it, else whoever is nearest in earshot. Whoever answers walks over, picks up, gets the hold music and stands
// facing the phone until he gives up. The lesson: you can move people.
//
// The 3:30 call is the meeting frame: at day.gatherAt everyone on the floor heads for Lin's desk (Lin to take her
// call, the boss to hover over her) and the first to arrive settles it (cast.js pickUp):
//   - Lin's cord is out: the phone never rings              route 'unplugged'
//   - someone is on Lin's line: the interviewer gets busy    route 'busy'
//   - Lin arrives: she takes her call                        fail
//   - Lin is stuck on another phone: the boss answers ("she's very motivated")   route 'answered'
//   - nobody gets there by 3:33                              route 'ringout'
// Be back at your desk by 3:33 (meeting.room): an empty chair during the call for your job looks bad.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { say } from '../../core/fx.js';
import { spotPos } from '../../game/perception.js';
import { CAST, BEHAVIOURS, START, PHONES, onPhone } from './cast.js';
import { DECOR, LOOKS, TITLE, END_SCENES, VOICES, SOUNDS } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

//   Y the boss's wall phone   Z the kitchen wall phone   L Lin's desk phone (its cord unplugs)   V Kev's desk phone
//   1 2 3 4 the switchboard: Lin, the boss, Kev, the kitchen   P your desk   F fridge   C coffee machine
const MAP = [
  '###Y#####################Z####', // 0
  '#.......G.....#.....F..C.....#', // 1
  '#.......G.....#..............#', // 2
  '#.TTT...G.....#....TT........#', // 3
  '#.......G.....#..............#', // 4
  '#GGGGGGD#.....###D############', // 5
  '#............................#', // 6
  '#.TLT.....TPT.........TTV....#', // 7
  '#............................#', // 8
  '#............................#', // 9
  '#............................#', // 10
  '#H..........................H#', // 11
  '##############D###############', // 12
  '#########.......##############', // 13
  '#########.......##############', // 14
  '##########1234################', // 15
  '##############################', // 16
];

const button = (phone) => ({ kind: 'switchboard', solid: true, opaque: true, draw: 'wall', interactable: `ring_${phone}` });
const LEGEND = {
  Y: { kind: 'wall_phone', solid: true, opaque: true, draw: 'wall' },
  Z: { kind: 'wall_phone', solid: true, opaque: true, draw: 'wall' },
  L: { kind: 'desk', solid: true, opaque: false, draw: 'desk', interactable: 'lin_phone' },
  V: { kind: 'desk', solid: true, opaque: false, draw: 'desk' },
  1: button('lin'),
  2: button('boss'),
  3: button('kev'),
  4: button('kitchen'),
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  F: { kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' },
  C: { kind: 'coffee_machine', solid: true, opaque: false },
};

const SPOTS = {
  player_desk: { x: 11, y: 8, face: 'N' }, // your seat; you start here
  boss_desk: { x: 3, y: 2, face: 'S' }, // behind his desk, watching the office through the glass
  boss_phone: { x: 3, y: 1, face: 'N' }, // his wall phone: back to the room
  lin_desk: { x: 3, y: 8, face: 'N' },
  lin_side: { x: 3, y: 6, face: 'S' }, // anyone else picking up Lin's phone, right in front of her
  kev_desk: { x: 23, y: 8, face: 'N' },
  kev_side: { x: 25, y: 7, face: 'W' },
  kitchen_phone: { x: 25, y: 1, face: 'N' },
  kitchen_lin: { x: 20, y: 2, face: 'N' }, // the kettle, by the fridge
  kitchen_kev: { x: 23, y: 2, face: 'N' }, // the coffee machine, next to the phone
  cable_lin: { x: 4, y: 8, face: 'N' }, // Kev's cable round: under Lin's desk
  cable_you: { x: 12, y: 8, face: 'N' },
  boss_hover: { x: 5, y: 8, face: 'W' }, // the boss, hovering over Lin's call
  switchboard: { x: 12, y: 14, face: 'S' },
};

const ZONES = {
  my_desk: { x0: 9, y0: 8, x1: 14, y1: 11 }, // be here at 3:33
  office: { x0: 1, y0: 6, x1: 29, y1: 12 },
};

// --- The phones ----------------------------------------------------------------------------------
// Earshot of a ring (tiles, straight line), from the phone's spot (PHONES[p].at).
const RING_RADIUS = 6;
const dist = (n, p) => Math.hypot(n.x - p.x, n.y - p.y);

// Who picks up phone p: its owner if he hears it and is free, else the nearest free NPC in earshot, else nobody.
function answerer(game, p) {
  const where = spotPos(game, PHONES[p].at);
  const free = (n) => n.active && !n._gone && !onPhone(n);
  const hears = (n) => dist(n, where) <= RING_RADIUS;
  const owner = game.npcs.find((n) => n.id === PHONES[p].owner);
  if (owner && free(owner) && hears(owner)) return owner.id;
  let best = null;
  for (const n of game.npcs) if (free(n) && hears(n) && (!best || dist(n, where) < dist(best, where))) best = n;
  return best ? best.id : null;
}

const ring = (p, icon, whose) => ({
  on: `ring_${p}`, icon, text: `ring ${whose}`, duration: 0.6, sneaky: true, saw: '☎️',
  noise: { radius: RING_RADIUS, at: PHONES[p].at },
  can: (pl, w) => !w[`call_${p}`] && (p !== 'lin' || w.cord === 'in'),
  done(game) {
    const by = answerer(game, p);
    game.world[`call_${p}`] = by;
    say(game, 'player', ['☎️'], { kind: 'thought', ttl: 0.8 });
    game.events.emit('switchboard:ring', { phone: p, by });
  },
});

const INTERACTIONS = {
  ring_lin: ring('lin', '👓', "Lin's desk"),
  ring_boss: ring('boss', '👔', "the boss's office"),
  ring_kev: ring('kev', '🔧', "Kev's desk"),
  ring_kitchen: ring('kitchen', '☕', 'the kitchen'),
  unplug: {
    on: 'lin_phone', icon: '🔌', text: "unplug Lin's phone", duration: 2.5, sneaky: true, saw: '🔌', // longer than a glance
    can: (p, w) => w.cord === 'in' && !w.line_lin && !w.call_lin,
    done(game) {
      game.world.cord = 'out';
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.2 });
      game.events.emit('cord:out', {});
    },
  },
};

// --- Answering: one lure per (person, phone) ---------------------------------------------------------
// The phone's ringing pulls him to it; he picks up, gets the hold music and stays on the line `minutes`.
//   HOLD[npc][phone]: game minutes on hold. Lin hangs up on her own line at once (she's waiting for a call);
//   the boss loves the hold music.
const HOLD = {
  boss: { boss: 6, lin: 3, kev: 4, kitchen: 4 },
  lin: { lin: 0.3, boss: 6, kev: 6, kitchen: 6 },
  kev: { kev: 4, lin: 4, boss: 4, kitchen: 4 },
};
const STAND = { // where each answers each phone
  boss: { boss: 'boss_phone', lin: 'lin_side', kev: 'kev_side', kitchen: 'kitchen_phone' },
  lin: { lin: 'lin_desk', boss: 'boss_phone', kev: 'kev_side', kitchen: 'kitchen_phone' },
  kev: { kev: 'kev_desk', lin: 'lin_side', boss: 'boss_phone', kitchen: 'kitchen_phone' },
};
const HUNG_UP = { // his line on putting the phone down
  boss: [{ say: ['🎵', '😌'] }],
  lin: [{ say: ['😒'] }],
  kev: [{ say: ['🤷'] }],
};

const LURES = [];
for (const npc of ['boss', 'lin', 'kev']) {
  for (const p of Object.keys(PHONES)) {
    LURES.push({
      npc,
      when: (w) => w[`call_${p}`] === npc,
      override: `to_${p}_phone`,
      plan: `phone_${p}`,
      label: `answer the ${p} phone`,
      spot: STAND[npc][p],
      react: { wait: 0.4, says: [{ say: ['☎️', '❗'], ttl: 0.9 }], event: `${npc}:answering` },
      work: {
        override: `on_${p}_phone`,
        minutes: HOLD[npc][p],
        progress: `hold_${npc}`,
        start: {
          set: { [`line_${p}`]: npc },
          event: `${npc}:onHold`,
          says: [{ say: ['📞', '❓'], ttl: 1 }, { say: ['🎵'], after: 1.2, ttl: 1.4 }, { say: ['🎵', '🎶'], after: 3.2, ttl: 1.6 }],
        },
        done: { set: { [`line_${p}`]: null, [`call_${p}`]: null }, event: `${npc}:hungUp`, says: HUNG_UP[npc] },
      },
    });
  }
}

const ROLES = {
  authority: { id: 'boss', offDuty: [], helpless: [], deafIn: null },
};

export default {
  id: 'hold-music',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START,
    gatherAt: at('3:30', START), // the interview call: everyone heads for Lin's desk
    meetingAt: at('3:33', START), // whoever picked up has said his piece
    clockRedAt: at('3:25', START),
    clockTickAt: at('3:25', START),
    tockAt: at('3:28', START),
    halfMinuteAt: at('3:29', START),
  },
  interactions: INTERACTIONS,
  items: {},
  roles: ROLES,
  lures: LURES,
  hunts: [],
  doors: [],
  behaviours: BEHAVIOURS,
  meeting: { override: 'interview', room: 'my_desk', chair: 'player_desk', presenter: 'player_desk' },
  routes: [
    { id: 'answered', icon: '👔', achieved: (w) => w.interview === 'boss' },
    { id: 'busy', icon: '📵', achieved: (w) => w.interview === 'busy' },
    { id: 'unplugged', icon: '🔌', achieved: (w) => w.interview === 'dead' || (w.interview === 'due' && w.cord === 'out') },
    { id: 'ringout', icon: '🔕', achieved: (w) => w.interview === 'due' && w.cord === 'in' },
  ],
  outcomeOrder: ['unplugged', 'busy', 'answered', 'ringout'],
  initialWorld: () => ({
    interview: 'due', // 'due' | 'lin' (she took it) | 'boss' (he did) | 'busy' | 'dead' (unplugged)
    cord: 'in', // Lin's phone cord: 'in' | 'out'
    // Per phone: call_<p> who is answering its ring (null: not ringing, or nobody heard); line_<p> who is on it
    call_lin: null, call_boss: null, call_kev: null, call_kitchen: null,
    line_lin: null, line_boss: null, line_kev: null, line_kitchen: null,
    hold_boss: 0, hold_lin: 0, hold_kev: 0, // time on hold, 0..1 (the lures' progress)
    items: [],
  }),
  harness,
  gate,
  title: TITLE,
  decor: DECOR,
  looks: LOOKS,
  endScenes: END_SCENES,
  voices: VOICES,
  sounds: SOUNDS,
};
