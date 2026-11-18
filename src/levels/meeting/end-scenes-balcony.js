// The balcony endings (balcony.js balconyVerdict; end-scenes.js reads them into END_SCENES; same draw signature:
// draw(ctx, game, t, e, outcome), inside TAB, screen space). The same set as the keycard win (end-set.js balconySet,
// fireDoor): the office on the left, the fire door end on, the balcony on the right. Objects are drawn, never emoji; only bubbles speak.
//   balcony   blamed: you stepped out without his card and the door shut. Inside, the meeting has started; the boss
//             points at your empty chair, then at you through the door. You, outside, shrug.
//   together  win: the boss locked out, and you with him (his card stashed inside). He pounds, gives up, lights one
//             and offers you one. Inside, the meeting room is empty.
//   snatched  blamed: you were out there with his card. He took it 🪪😤, badged in, and the door shut on you. Now
//             he sits at the table, card in hand, pointing at your empty chair, while you pound on the door.
import { TOMATO } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble, confetti } from '../../render/tableau.js';
import { chair, walnutDesk } from '../../render/tableau-furniture.js';
import { WHYS } from './endings.js';
import { bossJacket, balconySet, knock, bangingOnTheDoor, fireDoor } from './end-set.js';

// The end of the meeting table, inside, with your chair at it: empty.
function tableEnd(ctx) {
  chair(ctx, 300, 300, TOMATO, 2.2, -Math.PI / 2); // yours, pulled out, nobody in it
  walnutDesk(ctx, 190, 214, 210, { depth: 54, skirt: 62, r: 24, shadow: { color: 'rgba(0,0,0,0.25)', dx: 6, h: 60 } });
}

// ---- 'balcony': alone out there at 4:00
const B_WHERE = [WHYS.balcony.stare.think, ['👉', '🚪', '@player']]; // what the room thinks in the day; he points
export function tableauBalcony(ctx, game, t, e) {
  balconySet(ctx);
  tableEnd(ctx);
  const l = person(t);
  l.dir = 0; // looking at the door, like everyone
  l.head = 0.1;
  l.pose = 'sit';
  l.arms = 'desk';
  l.glance = 1;
  l.scale = 2;
  drawPerson(ctx, game.level.looks.lin, l, 236, 196);
  const k = Math.floor(e / 1.8) % 2; // at your chair, then at you
  const b = person(t);
  b.dir = k ? 0 : Math.PI * 0.7;
  b.head = b.dir;
  b.arms = 'point';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.2;
  drawPerson(ctx, game.level.looks.boss, b, 390, 262);
  bubble(ctx, B_WHERE[k], 380, 176, e % 1.8);
  fireDoor(ctx, t);
  const p = person(t);
  p.dir = Math.PI; // at the door, a sheepish shrug
  p.head = Math.PI + Math.sin(t * 1.4) * 0.15;
  p.arms = 'shrug';
  p.sweat = true;
  p.scale = 2.2;
  drawPerson(ctx, game.level.looks.player, p, 556, 272);
  bubble(ctx, ['😬'], 566, 196, e, 'thought');
}

// ---- 'together': locked out, the two of you, and the meeting has no one to hold it
export function tableauTogether(ctx, game, t, e) {
  balconySet(ctx);
  tableEnd(ctx);
  confetti(ctx, TAB.x, 280, TAB.y, TAB.h, e, 24);
  const gaveUp = e > 2.6; // he pounds, then gives up and lights one
  fireDoor(ctx, t, gaveUp ? 0 : knock(t).dx);
  bangingOnTheDoor(ctx, game, 'boss', t, gaveUp ? { dir: 0, head: 0.2, arms: 'puff' } : { angry: true });
  bubble(ctx, gaveUp ? ['🚬', '❓'] : ['👊', '🚪'], 556, 192, gaveUp ? e - 2.6 : e % 1.3, gaveUp ? 'speech' : 'alert');
  const p = person(t);
  p.dir = Math.PI;
  p.head = Math.PI + Math.sin(t * 0.9) * 0.2;
  p.arms = 'idle';
  p.smug = true;
  p.scale = 2.2;
  drawPerson(ctx, game.level.looks.player, p, 640, 286);
  bubble(ctx, gaveUp ? ['👍'] : ['🙂'], 652, 210, gaveUp ? e - 2.6 : e, 'thought');
}

// ---- 'snatched': he took his card back out there and left you to it
export function tableauSnatched(ctx, game, t, e) {
  balconySet(ctx);
  const b = person(t);
  b.dir = 0; // at the table's end, at your chair, at you
  b.head = Math.sin(t * 1.2) * 0.12;
  b.pose = 'sit';
  b.arms = 'point';
  b.item = '#keycard';
  b.smug = true;
  b.jacket = bossJacket(game);
  b.scale = 2.1;
  drawPerson(ctx, game.level.looks.boss, b, 352, 200); // behind the table
  tableEnd(ctx);
  bubble(ctx, e < 2.2 ? ['🪪', '😏'] : ['🪑', '❓', '@player'], 344, 124, e < 2.2 ? e : e - 2.2);
  fireDoor(ctx, t, knock(t).dx);
  bangingOnTheDoor(ctx, game, 'player', t, { sweat: true });
  bubble(ctx, ['👊', '🚪'], 560, 196, e % 1.6, 'alert');
}

export const BALCONY_SCENES = {
  balcony: { win: false, icons: ['🔒', '🪑', '👀'], draw: tableauBalcony }, // stepped out, no card: they start without you
  together: { win: true, icons: ['🔒', '👊', '🚬'], draw: tableauTogether }, // locked out with him: no meeting
  snatched: { win: false, icons: ['🪪', '😏', '🔒'], draw: tableauSnatched }, // he took his card back and went in
};
