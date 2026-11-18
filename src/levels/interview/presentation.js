// How The Interview looks and sounds: title card, set dressing, people, poses, voices and sounds (level 1's decor.js,
// looks.js, voices.js and sounds.js document the fields). The phones and the switchboard are painters.js.
import { at } from '../../config.js';
import { MUSTARD, TEAL, OLIVE } from '../../render/palette.js';
import { LOOKS as MEETING_LOOKS } from '../office/looks.js';
import { PHONE_PROPS, THINGS } from './painters.js';
import { PHONE_IDS, PHONES, SLAM, BACK_AT, START } from './phones.js';
import { OFFICE_DESK_OWNERS, officeDesk } from '../office/decor.js';

export const TITLE = {
  mission: ['3:00 PM. Lin wants your job. Her phone interview is at 3:30.', 'They only ring once. Make her miss it.'],
  badge: ['#interview', '#call'], // the threat: Lin's interview (her face and its briefcase) and the call (painters.js THINGS)
};


export const DECOR = {
  zoneSeeds: [{ x: 3, y: 2, zone: 'office' }, { x: 20, y: 3, zone: 'kitchen' }],
  chairs: [ // (the boss's high-backed one is painters.js: it turns to his window)
    { spot: 'player_desk', face: 'N', color: MUSTARD },
    { spot: 'lin_desk', face: 'N', color: TEAL },
    { spot: 'kev_desk', face: 'N', color: OLIVE },
    { x: 17, y: 4, face: 'N', color: MUSTARD }, // kitchen table
    { x: 18, y: 4, face: 'N', color: MUSTARD },
  ],
  windows: [{ x0: 24, x1: 27, y: 0 }], // (the boss's is painters.js: a bright one he can face)
  paintings: [{ x: 18, y: 5, variant: 1 }, { x: 23, y: 5, variant: 0 }],
  clock: { x: 7, y: 5 },
  props: PHONE_PROPS,
  things: THINGS,
  deskOwners: OFFICE_DESK_OWNERS,
  desks: {
    player: officeDesk('player'),
    lin: officeDesk('lin', { screenArt: 'blankSlide' }),
    kev: officeDesk('kev', { prop: null }),
  },
  legendAt: { x: 15, y: 14.8 },
};

export const LOOKS = MEETING_LOOKS;

// What the cast are seen doing (level 1's looks.js POSES documents the fields). On a line: the line's handset at
// the ear (Lin slams hers down); someone else's interview gets a shrug. Kev holds Lin's loose plug up at her chair
// and jams it in, crouches to plug in his charger and stands by, scrolling on his mobile. A walk of their own day
// has something in hand (Kev's coffee and mobile, Lin's tea and her notes); a summons (a ring) has them set off
// empty-handed with a ❗.
const m = (game) => (game.clock ? game.clock.minute : 0);
const onLine = (p) => (n, w) => n.override === `on_${p}_phone` && w[`line_${p}`] === n.id;
const own = (n) => !n.override && n.pose !== 'sit';
export const POSES = {
  arms: [
    { when: (n, w) => n.override === 'on_job' && n.id !== 'lin' && w[`job_${n.id}`] > 0.55, arms: 'shrug' },
    { when: (n, w) => n.id === 'lin' && n.override === 'on_lin_phone' && w.hold_lin > SLAM, arms: 'bang', angry: true },
    ...PHONE_IDS.map((p) => ({ when: onLine(p), arms: 'phone', item: `#handset_${p}` })),
    { when: (n) => n.override === 'on_job', arms: 'phone', item: '#handset_lin' },
    { when: (n, w) => n.id === 'lin' && !!w.linCheck, arms: 'phone', item: '#handset_lin' },
    { when: (n, w, game) => n.id === 'lin' && m(game) < w.jolt, arms: 'cheer' }, // a ring in her ear: she jumps
    { when: (n, w, game) => n.id === 'kev' && !n.override && !!w.kevJamAt && m(game) >= w.kevLift, arms: 'reach', item: '#plug', angry: true },
    { when: (n, w, game) => n.id === 'kev' && w.sparkAt >= w.kevAt && m(game) < w.kevJam, arms: 'bang', angry: true },
    { when: (n, w, game) => n.id === 'kev' && m(game) < w.kevReach, arms: 'reach', item: '#mobile' },
    { when: (n, w, game) => n.id === 'kev' && !!w.kevCharge && m(game) >= w.kevCharge && !n.moving, arms: 'carry', item: '#mobile' },
    { when: (n, w, game) => n.id === 'lin' && !n.override && m(game) >= BACK_AT && m(game) < game.level.day.gatherAt, arms: 'carry', item: '#notes' },
    { when: (n, w, game) => n.id === 'lin' && !n.override && n.pose === 'sit' && m(game) >= at('3:03', START) && m(game) < BACK_AT, arms: 'mug', item: '#cup' },
    { when: (n, w, game) => n.id === 'kev' && own(n) && m(game) < at('3:04', START), arms: 'mug', item: '#mug' },
    { when: (n, w, game) => n.id === 'kev' && own(n) && m(game) < at('3:15', START), arms: 'carry', item: '#mobile' },
    { when: (n, w, game) => n.id === 'kev' && own(n) && m(game) < game.level.day.gatherAt, arms: 'mug', item: '#cup' },
  ],
  marks: [],
};

// The bell is the rings' noise (phones.js NOISES, sfx 'phoneRing'); head office's hold queue on the kitchen phone
// plays a little tune until it ends (phones.js tune_kitchen). Gary on the inside lines is heard in the boss's
// laughs (phones.js).
const holdTune = (p) => ({ while: (w) => !!w[`tune_${p}`], every: [1.6, 2.4], sfx: 'jingle', spot: PHONES[p].at, opts: { gain: 0.35 } });

export const SOUNDS = {
  actions: {
    start: { unplug: { sfx: 'rustle', spot: 'lin_side', opts: { gain: 0.6 } } },
    done: { unplug: { sfx: 'pickup', spot: 'lin_side' } },
  },
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'cord:in': { sfx: 'pickup', spot: 'lin_side' },
    'interview:busy': { sfx: 'machineBeep', spot: 'lin_side', opts: { gain: 0.5 } },
    'interview:lin': { sfx: 'pickup', spot: 'lin_side' },
    'interview:other': { sfx: 'pickup', spot: 'lin_side' },
    'player:answers': { sfx: 'pickup', who: 'player' },
  },
  repeats: { hold_kitchen: holdTune('kitchen') },
};
