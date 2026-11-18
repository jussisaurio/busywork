// Fixture "The Suggestion Box": the boss does whatever the suggestion box says.
// A test level for put down (src/sim/mechanics/putdown.js): the only way to win is to write "cancel the meeting"
// at your desk while the boss is out, and put the note in his suggestion box before he empties it at 2:48.
// Dropped on the floor it's just contraband (he pockets it); left on your own desk it's evidence (caught).
import { at, deg } from '../../config.js';
import { scheduler } from '../office/cast.js';
import { OWN_DESK, RESTROOM } from '../office/legend.js';
import { playerHolds } from '../../sim/take.js';

const MAP = [
  '################', // 0
  '#......#.......#', // 1   boss office | meeting room
  '#......#..TTT..#', // 2
  '#.TTT..#..TTT..#', // 3   the boss's desk
  '#......#.......#', // 4
  '#GGDGGG###D#####', // 5   glass: from his desk the boss watches the open plan
  '#..............#', // 6
  'R....TPT.....T.#', // 7   your desk P, the suggestion box on its stand (x13)
  '#..............#', // 8
  '################', // 9
];

const LEGEND = {
  P: OWN_DESK,
  R: RESTROOM,
};

const SPOTS = {
  player_desk: { x: 6, y: 8, face: 'N', accepts: ['note'], owner: 'player' },
  boss_desk: { x: 3, y: 2, face: 'S' },
  box: { x: 13, y: 8, face: 'N', accepts: ['note'], owner: 'boss', found: 'readNote' },
  restroom: { x: 1, y: 7, face: 'W' },
  meeting_head: { x: 9, y: 2, face: 'E' },
  meeting_player: { x: 11, y: 4, face: 'N' },
  meeting_presenter: { x: 14, y: 2, face: 'W' },
};

const s = scheduler();

export default {
  id: 'fixture-putdown',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: { meeting_room: { x0: 8, y0: 1, x1: 15, y1: 5 } },
  meeting: { override: 'meeting', room: 'meeting_room', chair: 'meeting_player', presenter: 'meeting_presenter' },
  patrols: {},
  cast: [{
    id: 'boss',
    icon: '👔',
    color: '#2b3a55',
    meetingSpot: 'meeting_head',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [3, 5.5],
    schedule: [
      s('2:30', { do: 'sit', spot: 'boss_desk' }),
      s('2:36', { do: 'away', spot: 'restroom' }),
      s('2:44', { do: 'sit', spot: 'boss_desk' }),
      s('2:48', { do: 'visit', spot: 'box' }), // empties the suggestion box
    ],
  }],
  day: { start: 14 * 60 + 30, gatherAt: at('2:56'), meetingAt: at('3:00'), clockRedAt: at('2:55') },
  interactions: {
    write_note: {
      on: 'own_desk', text: 'write "cancel the meeting" on a note', duration: 1.5, sneaky: true, saw: '📝',
      hand: 'empty', can: (p, w) => w.note === 'pad',
      over: ['sit'], // standing at your desk with the pad there: the note, not the chair
      done(game) {
        playerHolds(game, 'note');
        game.events.emit('note:written', {});
      },
    },
  },
  items: { note: { icon: '📝', draw: 'note', place: 'note', contraband: 'boss' } },
  roles: { authority: { id: 'boss', offDuty: ['meeting'], helpless: [] } },
  behaviours: {
    // Whatever is in the box, he does. Today it says to cancel the meeting.
    readNote: {
      arrive(game, npc, sim, { item }) {
        const w = game.world;
        w.items = w.items.filter((i) => i !== item);
        w.note = npc.id;
        w.cancelled = true;
        sim.holdFor(npc, 1.4);
        sim.speak(game, npc, [{ say: ['📝', '👀'], kind: 'thought', ttl: 1.2 }, { say: ['🗓️', '❌', '👍'], after: 1.2 }]);
        game.events.emit('meeting:cancelled', {});
      },
    },
  },
  title: { mission: ['3:00 PM. The boss does whatever the suggestion box says.', 'Suggest there is no meeting.'], badge: ['📝', '❌'] },
  routes: [{ id: 'box', icon: '📝', achieved: (w) => w.cancelled }],
  outcomeOrder: ['box'],
  initialWorld: () => ({ note: 'pad', cancelled: false, items: [] }),
  harness: {
    mission: 'MISSION: 3:00 PM meeting. The boss does whatever the suggestion box says.',
    landmarks: {
      boss_desk: 'boss_desk', box: 'box', restroom_door: 'restroom',
      meeting_room: 'meeting_presenter', meeting_seat: 'meeting_player',
    },
  },
  gate: {
    // The level exists to teach put down: no win without it.
    mustUse: [{ id: 'put', event: 'item:put' }],
    targets: ['own_desk', 'my_seat', 'boss_desk', 'box', 'restroom_door', 'meeting_room', 'meeting_seat'],
    interactable: ['own_desk'],
    renderEvents: ['boss:workAssigned'],
    milestones: {
      'note:written': () => 'wrote',
      'note:recovered': () => 'pocketed',
      'meeting:cancelled': () => 'cancelled',
      'boss:workAssigned': () => 'work',
      caught: () => 'caught',
    },
    binKeys: ['wrote', 'put@box', 'put@player_desk', 'pocketed', 'cancelled', 'work', 'caught'],
    keyActions: ['wrote', 'put@box'],
    goldenPlans: [
      // Evidence: the note left on your own desk, in the boss's view.
      ['pretend until 2:39', 'interact', 'put player_desk', 'wait until 2:46'],
      // Contraband: dropped on the floor, pocketed.
      ['pretend until 2:39', 'interact', 'move E 1s', 'interact', 'pretend until 3:00'],
    ],
  },
};
