// Meeting's cast in motion: what render/characters.js draws them doing, and what makes a cone flare. (How they look is
// office/looks.js, shared with the levels that borrow the cast.)
import { WHYS } from './endings.js';

// level.poses: what render/characters.js draws the cast doing, beyond sitting, walking and standing.
//   arms   the first rule whose when(npc, world, game) holds sets the arms: { when, arms, item?, angry?, crank? }
//          arms: a characters.js computeHands pose ('bang' fists on a door, 'point', 'reach', 'shrug', 'puff' hand to mouth,
//          'carry' in both hands, ...) or a function of the npc; item: a '#<thing>' in hand (an item type with a
//          draw, or an engine thing, render/things.js: never an emoji); crank: a wrench turning.
//          No rule holds: 'desk' sitting, 'walk' walking, else idle. What an NPC carries (npc.carry) is drawn in
//          hand while his hands are free, else set down beside him.
//   marks  every rule that holds sets its flags: angry (a scowl), badge (a tag on a 'suit' torso),
//          jacket: false (a look with a `shirt` is drawn in it). The authority scowls on his own when he catches you.
const VERDICT_ARMS = [...new Set(Object.values(WHYS).map((v) => v.boss).filter(Boolean))];
const calledOff = (n, w) => n.id === 'boss' && n.override === 'meeting' && w.projector !== 'ok' && !n.moving;

export const POSES = {
  arms: [
    // Locked out on the balcony (mechanics.js DOORS): fists on the fire door, except where his line says otherwise
    // (patting his pockets, a fuming cigarette).
    { when: (n) => n.override === 'lockedOut' && n._bangLine?.arms === 'puff', arms: 'puff', item: '#cigarette', angry: true },
    { when: (n) => n.override === 'lockedOut', arms: (n) => n._bangLine?.arms ?? 'bang', angry: true },
    // Let back in (clocks.js bossLetIn): both arms round you.
    { when: (n, w) => n.id === 'boss' && w.hugAt != null && !w.hugDone, arms: 'box' },
    { when: (n) => n.override === 'fixing', arms: 'reach', item: '#wrench', crank: true },
    // No projector, no slides (behaviours.js presenter): facing the dead projector, the boss puts a hand over his face,
    // throws his hands up as he says there are no slides (📊❌), then the hand goes back over his face. Never a point:
    // a point is blame, and on a plain projector win nobody is blamed.
    // At 4:00 a verdict's own arms (endings.js WHYS boss): blaming someone else (Kev's chair, Lin), he points; the
    // cup on his own desk, his hands go up, protesting.
    ...VERDICT_ARMS.map((arms) => ({ when: (n, w, g) => calledOff(n, w) && WHYS[g.outcome?.why]?.boss === arms, arms })),
    { when: (n, w, g) => calledOff(n, w) && n._offAt != null && g.loopTime - n._offAt >= 1.3 && g.loopTime - n._offAt < 2.6,
      arms: 'shrug' },
    { when: calledOff, arms: 'facepalm' },
    { when: (n) => !n.override && n.anim === 'smoking', arms: (n) => (n.moving ? 'walk' : 'puff'), item: '#cigarette' },
    { when: (n, w) => n.id === 'lin' && w.sandwich === 'lin', arms: 'carry', item: '#sandwich' },
  ],
  marks: [
    { when: (n) => n.override === 'hunting' || (n.id === 'boss' && n.override === 'alerted'), angry: true },
    { when: (n, w) => n.id === 'boss' && w.keycard === 'boss' && !n.pocketing, badge: true }, // (not while it's in his hands)
    { when: (n, w) => n.id === 'boss' && w.jacket !== 'boss', jacket: false }, // in shirt and suspenders until he fetches it
  ],
};

// level.cones: what makes an NPC's vision cone flare red (render/cones.js), besides being caught by him, the
// authority's suspicion and anything the rules object to in his sight (game.watch: a sneaky action, the scene,
// the evidence, contraband or his own thing in your hands, published by play/rules.js).
//   alert   overrides during which he's on alert
export const CONES = { alert: ['alerted', 'hunting'] };
