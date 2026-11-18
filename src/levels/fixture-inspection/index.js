// Fixture "Inventory Day": the auditor counts two laptops, one desk at a time; the office has one.
// A test level for inspection (src/sim/mechanics/inspection.js): he ticks off the laptop on your desk, then you
// (at your desk), then walks round to Dave's desk to tick off Dave's (lost in March). Each check is judged when he
// gets there, so the only way to pass is to carry the laptop to Dave's desk behind his back, by the back
// corridor, before he arrives. Seen carrying company property on inventory day, you're caught; so you are if
// anything on his list is missing, you included.
import { at, deg } from '../../config.js';
import { scheduler } from '../office/cast.js';
import { itemOn } from '../../sim/mechanics/putdown.js';

const MAP = [
  '################', // 0
  '#......#.......#', // 1   the auditor's office | meeting room
  '#..TTT.#..TTT..#', // 2
  '#......#..TTT..#', // 3
  '###D#########D##', // 4
  '#..............#', // 5   front corridor: his way round
  '##D#########D###', // 6
  '#......#.......#', // 7
  '#..TTT.#..TTT..#', // 8   your desk (x4) | Dave's desk (x11)
  '#......#.......#', // 9
  '##D#########D###', // 10
  '#..............#', // 11  back corridor: yours
  '################', // 12
];

const SPOTS = {
  player_desk: { x: 4, y: 9, face: 'N', accepts: ['laptop'] },
  dave_desk: { x: 11, y: 9, face: 'N', accepts: ['laptop'] },
  check_mine: { x: 4, y: 7, face: 'S' }, // where the auditor stands to count your laptop
  check_dave: { x: 11, y: 7, face: 'S' },
  auditor_desk: { x: 4, y: 1, face: 'S' },
  meeting_head: { x: 9, y: 2, face: 'E' },
  meeting_player: { x: 11, y: 1, face: 'S' },
  meeting_presenter: { x: 13, y: 2, face: 'W' },
};

const s = scheduler();

export default {
  id: 'fixture-inspection',
  map: { rows: MAP, legend: {} },
  spots: SPOTS,
  zones: { meeting_room: { x0: 8, y0: 1, x1: 15, y1: 4 }, room_a: { x0: 1, y0: 7, x1: 7, y1: 10 } },
  meeting: { override: 'meeting', room: 'meeting_room', chair: 'meeting_player', presenter: 'meeting_presenter' },
  patrols: {},
  cast: [{
    id: 'auditor',
    icon: '📋',
    color: '#4a4a3a',
    meetingSpot: 'meeting_head',
    vision: { fov: deg(100), radius: 9 },
    schedule: [s('2:30', { do: 'sit', spot: 'auditor_desk' })],
  }],
  inspections: [{
    npc: 'auditor', at: at('2:40'), override: 'audit', plan: 'audit', label: 'inventory',
    checks: [
      { item: 'laptop', spot: 'player_desk', from: 'check_mine' },
      { who: 'player', zone: 'room_a', from: 'check_mine' },
      { item: 'laptop', spot: 'dave_desk', from: 'check_dave' },
    ],
    pass: { set: { audited: true }, event: 'audit:passed', says: [{ say: ['💻', '💻', '👍'] }] },
    fail: { then: 'caught', says: [{ say: ['💻', '❓'] }] },
  }],
  day: { start: 14 * 60 + 30, gatherAt: at('2:56'), meetingAt: at('3:00'), clockRedAt: at('2:55') },
  interactions: {},
  items: { laptop: { icon: '💻', draw: 'laptop', place: 'laptop', contraband: 'auditor' } },
  roles: { authority: { id: 'auditor', offDuty: ['meeting'], helpless: [] } },
  title: { mission: ['3:00 PM. Inventory day: the auditor counts two laptops.', 'The office has one.'], badge: ['💻', '❌'] },
  routes: [{ id: 'audit', icon: '💻', achieved: (w) => w.audited }],
  outcomeOrder: ['audit'],
  initialWorld: () => ({ laptop: 'player_desk', audited: false, items: [itemOn(SPOTS, 'player_desk', 'laptop')] }),
  harness: {
    mission: 'MISSION: 3:00 PM meeting. Inventory day: the auditor counts two laptops. There is one.',
    landmarks: {
      dave_desk: 'dave_desk', auditor_desk: 'auditor_desk',
      meeting_room: 'meeting_presenter', meeting_seat: 'meeting_player',
    },
  },
  gate: {
    // The level exists to teach in-order inspection: the laptop moves after it was counted, or no win.
    mustUse: [{ id: 'put', event: 'item:put' }, { id: 'recount', event: 'inspect:moved' }],
    targets: ['my_seat', 'dave_desk', 'auditor_desk', 'meeting_room', 'meeting_seat'],
    interactable: ['my_seat', 'dave_desk'],
    milestones: {
      'item:pickup': () => 'grabbed',
      'inspect:start': () => 'audit',
      'laptop:recovered': () => 'pocketed',
      'auditor:workAssigned': () => 'work',
      caught: () => 'caught',
    },
    binKeys: ['grabbed', 'put@dave_desk', 'tick0', 'tick1', 'tick2', 'moved', 'pocketed', 'work', 'caught'],
    keyActions: ['grabbed', 'put@dave_desk'],
    goldenPlans: [
      // Picked up while he counts it, in his view: caught with company property.
      ['pretend until 2:42', 'interact', 'wait until 2:44'],
      // Dropped on the floor: he pockets it on his way in, so your desk is ❌.
      ['wait 0.5s', 'interact', 'goto 6,7', 'interact', 'pretend until 3:00'],
      // Not at your desk when he counts you: ❌.
      ['goto meeting_seat pretend', 'pretend until 3:00'],
      // Standing around while he counts: work assigned, and the ❌ at Dave's desk can't reach you at your desk.
      ['wait until 2:50', 'pretend until 3:00'],
    ],
  },
};
