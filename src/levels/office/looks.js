// How the office's people look (Meeting and the levels that borrow its cast). level.looks: how render/characters.js draws each cast member and the
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
