// Fixture "attention": the smallest level that needs a noise (sim/mechanics/attention.js) to win. Not a real
// level: a test bed for the mechanic, in the meeting frame (src/levels/meeting/index.js has the field docs).
//
// The boss sits facing the last donut and never glances away. Nothing turns a manager's head like a printer that
// works on the first try: send a print job from the workstation in your cubicle, and while he stares at the
// printer (1.5 s) run through the doorway and eat the donut. Strolling (pretend) is too slow. Then look busy
// until 2:40: the meeting was only ever about the donut.
//
//   0123456789012
//   #############  0
//   #.........X.#  1   X printer (the noise comes from the spot below it)
//   #...........#  2
//   #.O....Tb...#  3   O the donut, T the boss's desk, b where he sits (facing W, at the donut)
//   #...........#  4
//   ##.##########  5   the doorway (2,5): the wall hides the cubicle from him
//   #..........Q#  6   Q a water cooler (a decoy)
//   #........P..#  7   P your desk (you sit below it)
//   #W..........#  8   W the workstation
//   #############  9
import { at, deg } from '../../config.js';

const MAP = [
  '#############',
  '#.........X.#',
  '#...........#',
  '#.O....T....#',
  '#...........#',
  '##.##########',
  '#..........Q#',
  '#........P..#',
  '#W..........#',
  '#############',
];

const LEGEND = {
  O: { kind: 'donut_box', solid: true, opaque: false, interactable: 'donut' },
  W: { kind: 'workstation', solid: true, opaque: false, interactable: 'workstation' },
  X: { kind: 'printer', solid: true, opaque: false },
  Q: { kind: 'water_cooler', solid: true, opaque: false, interactable: 'water_cooler' },
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
};

const SPOTS = {
  player_desk: { x: 9, y: 8, face: 'N' },
  boss_chair: { x: 8, y: 3, face: 'W' },
  printer: { x: 10, y: 2, face: 'N' },
  doorway: { x: 2, y: 5, face: 'N' },
  meeting_presenter: { x: 5, y: 2, face: 'S' }, // where a failed meeting puts you
  meeting_player: { x: 4, y: 4, face: 'N' }, // the empty chair he stares at if you're blamed
};

const s = (time, entry) => ({ at: at(time), ...entry });

const NPC_DEFS = [
  {
    id: 'boss',
    icon: '👔',
    color: '#2b3a55',
    voice: 'boss',
    meetingSpot: 'boss_chair', // the meeting is where he already sits
    vision: { fov: deg(100), radius: 9 },
    glanceEvery: [9999, 9999], // he never glances away: only a noise turns him
    coneTint: [255, 160, 82],
    schedule: [s('2:30', { do: 'sit', spot: 'boss_chair' })],
  },
];

const INTERACTIONS = {
  print: {
    on: 'workstation', icon: '🖨️', text: 'send 40 pages to the printer', duration: 0.5, sneaky: false,
    can: () => true,
    noise: { at: 'printer', radius: 5 }, // the printer across the room whirs into life
    done() {},
  },
  drink_water: {
    on: 'water_cooler', icon: '🚰', text: 'drink some water', duration: 0.8, sneaky: false,
    can: () => true,
    done() {},
  },
  eat_donut: {
    on: 'donut', icon: '🍩', text: 'eat the last donut', duration: 0.6, sneaky: true, saw: '🍩',
    can: (p, w) => w.donut === 'box',
    done(game) {
      game.world.donut = 'eaten';
      game.events.emit('donut:eaten', {});
    },
  },
};

const NAME = { boss: 'the boss', player: 'you' };

export default {
  id: 'fixture-attention',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: { meeting_room: { x0: 1, y0: 1, x1: 12, y1: 5 } }, // the boss's room: be in it at 2:40
  meeting: { override: 'meeting', room: 'meeting_room', chair: 'meeting_player', presenter: 'meeting_presenter' },
  patrols: {},
  cast: NPC_DEFS,
  day: {
    start: 14 * 60 + 30,
    gatherAt: at('2:39'),
    meetingAt: at('2:40'),
    clockRedAt: at('2:38'),
    clockTickAt: at('2:38'),
    tockAt: at('2:39'),
    halfMinuteAt: at('2:39'),
    beamAt: at('2:39'),
  },
  interactions: INTERACTIONS,
  roles: { authority: { id: 'boss', offDuty: ['meeting'], helpless: [] } },
  routes: [{ id: 'donut', icon: '🍩', achieved: (w) => w.donut === 'eaten' }],
  outcomeOrder: ['donut'],
  initialWorld: () => ({ donut: 'box', items: [] }),
  harness: {
    mission: 'MISSION: the 2:40 meeting is the boss and the last donut. Eat it. He has not blinked since 2:30.',
    landmarks: { my_seat: 'player_desk', boss: 'boss_chair', printer: 'printer', doorway: 'doorway', meeting_room: 'meeting_presenter' },
    stops: { hard: ['boss:workAssigned'], soft: ['boss:suspicious'] },
    names: NAME,
    mapKey: ['MAP (# wall, T desk, O the donut, X printer, W workstation, Q water cooler, P your desk, @ you, b boss, * floor he can see right now):'],
    outcomeText: (o) => (o.result === 'win' ? 'WIN 🎉 (no donut, no meeting)'
      : o.result === 'caught' ? 'CAUGHT with your hand in the donut box 😠'
      : o.result === 'blamed' ? 'BLAMED 🪑👉 (the donut is gone and so were you)'
      : 'FAIL: the meeting happened. He ate the donut. You watched.'),
    statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),
    worldText: (game) => `WORLD: the donut is ${game.world.donut === 'box' ? 'in its box' : 'gone'}`,
    describe(e) {
      switch (e.name) {
        case 'donut:eaten': return 'you ate the last donut 🍩';
        case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
        case 'boss:workAssigned': return `the boss assigned you work 📄 (${e.payload?.reason})`;
        default: return undefined;
      }
    },
  },
  gate: {
    mustUse: [{ id: 'noise', event: 'noise' }],
    targets: ['workstation', 'donut', 'water_cooler', 'printer', 'doorway', 'boss', 'meeting_room'],
    interactable: ['workstation', 'donut', 'water_cooler'],
    milestones: { 'donut:eaten': () => 'ate', 'boss:workAssigned': () => 'work', caught: () => 'caught' },
    binKeys: ['ate', 'work', 'caught'],
    keyActions: ['noise', 'ate'],
    goldenPlans: [
      // Strolling to the donut: too slow, he turns back mid-bite.
      ['move W 0.5s', 'goto workstation', 'interact', 'goto donut pretend', 'interact', 'pretend until 2:40'],
      // A win, then the next day without the printer.
      ['goto workstation', 'interact', 'goto donut', 'interact', 'pretend until 2:40', 'continue', 'goto donut', 'interact'],
    ],
  },
  decor: {
    chairs: [
      { spot: 'boss_chair', face: 'W', color: ['#6b2f24', '#4e2019'] },
      { spot: 'player_desk', face: 'N', color: ['#d6a23a', '#a97b22'] },
    ],
  },
};
