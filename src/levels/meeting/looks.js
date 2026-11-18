// How level 1's people and items look. level.looks: how render/characters.js draws each cast member and the
// player, by id; anyone without an entry gets a generic look in their n.color.
//   body/bodyDark, skin/skinDark, hair, legs   colours
//   hairStyle  'tuft' | 'horseshoe' | 'bun' | 'spiky' | 'cap'
//   wide, tall, head   body width and height factors, head radius (px)
//   torso      chest detail: 'sweater' (trim collar, ribbed hem) | 'suit' (shirt, tie; suspenders without
//              the jacket; a keycard tag when it has one) | 'cardigan' (trim placket) | 'hoodie' (pocket, strings)
//   trim, shirt/shirtDark, tie   colours the torso detail uses
//   mustache, glasses, hood      extras
//   bubbleDy / eyeDy   px from a person's tile position up to their speech-bubble anchor / their eyes (headY)
import { C } from '../../render/palette.js';

export const LOOKS = {
  player: {
    body: C.tomato, bodyDark: C.tomatoDark, skin: '#f1c9a2', skinDark: '#d9a47c', hair: '#7a3b1e',
    hairStyle: 'tuft', legs: '#3a3946', wide: 1, tall: 1, head: 6.6, torso: 'sweater', trim: '#f3e6c8',
    bubbleDy: 30, eyeDy: 12,
  },
  boss: {
    body: C.navy, bodyDark: C.navyDark, torso: 'suit', shirt: '#d7e4ee', shirtDark: '#a9bccb', tie: '#9c2a22',
    skin: '#ebb792', skinDark: '#cf9670', hair: '#a19c95', hairStyle: 'horseshoe', mustache: true,
    legs: '#1c2232', wide: 1.25, tall: 1.12, head: 7.4, bubbleDy: 36, eyeDy: 14,
  },
  lin: {
    body: C.teal, bodyDark: C.tealDark, skin: '#d9a77c', skinDark: '#bb875e', hair: '#1f1a1a',
    hairStyle: 'bun', glasses: true, legs: '#4a3b33', wide: 0.95, tall: 1, head: 6.4, torso: 'cardigan',
    trim: '#f3e6c8', bubbleDy: 30, eyeDy: 12,
  },
  kev: {
    body: C.olive, bodyDark: C.oliveDark, skin: '#c98d62', skinDark: '#a8714a', hair: '#3a2a1c',
    hairStyle: 'spiky', hood: true, legs: '#2f3340', wide: 1.05, tall: 1, head: 6.6, torso: 'hoodie',
    bubbleDy: 30, eyeDy: 12,
  },
};

// level.poses: what render/characters.js draws the cast doing, beyond sitting, walking and standing.
//   arms   the first rule whose when(npc, world, game) holds sets the arms: { when, arms, item?, angry?, crank? }
//          arms: a characters.js computeHands pose ('bang' fists on a door, 'point', 'reach', 'shrug', 'puff' hand to mouth,
//          'carry' in both hands, ...) or a function of the npc; item: a '#<thing>' in hand (an item type with a
//          draw, or an engine thing, render/things.js: never an emoji); crank: a wrench turning.
//          No rule holds: 'desk' sitting, 'walk' walking, else idle. What an NPC carries (npc.carry) is drawn in
//          hand while his hands are free, else set down beside him.
//   marks  every rule that holds sets its flags: angry (a scowl), badge (a tag on a 'suit' torso),
//          jacket: false (a look with a `shirt` is drawn in it). The authority scowls on his own when he catches you.
const BLAMES = new Set(['kev', 'lin', 'linHungry']);
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
    // At 4:00 a verdict that blames someone else (verdict.js: Kev's chair, Lin): now he points. The cup on his own
    // desk: his hands go up, protesting.
    { when: (n, w, g) => calledOff(n, w) && BLAMES.has(g.outcome?.why), arms: 'point' },
    { when: (n, w, g) => calledOff(n, w) && g.outcome?.why === 'bossMug', arms: 'shrug' },
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
