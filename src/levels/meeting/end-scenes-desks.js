// The end scenes for the cup on someone else's desk (end-scenes.js reads them into
// END_SCENES; same draw signature: draw(ctx, game, t, e, outcome), inside TAB, screen space). Kept apart so builders
// working in parallel touch different files. Objects are drawn, never emoji; only bubbles speak emoji.
//   lin / linHungry  win, verdict.js verdictDesks: the empty mug was on Lin's desk. The boss points at her across the
//                    table; she shrinks. You ate her lunch too: she is in tears. You sit among them, nodding along.
//   bossMug          win: the mug was on the boss's own desk. The table looks at him; he sputters, hands up.
import { clamp, easeOutBack } from '../../render/util.js';
import { drawThing } from '../../render/things.js';
import { C, OLIVE } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble, floorCarpet } from '../../render/tableau.js';
import { chair } from '../../render/tableau-furniture.js';
import { meetingTable, smokingProjector, poolOfLight, meetingScreen, bossJacket } from './end-scenes.js';

const B_BLAME_LIN = ['😠', '👉', '@lin'];
const B_LIN_SCARED = ['😨'];
const B_LIN_CRIES = ['😭', '🥪'];
const B_STARE_BOSS = ['🤨', '👉', '@boss'];
const B_BOSS_SPUTTERS = ['😳', '☕', '❓'];

// The mug lands on the table in front of a place, with a pop (e: seconds since the card came up).
function mugPops(ctx, game, x, y, e) {
  const pe = clamp((e - 0.4) / 0.3, 0, 1);
  if (pe <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(easeOutBack(pe), easeOutBack(pe));
  drawThing(ctx, game, 'mug', 0, 0, 26);
  ctx.restore();
}

// You, in front of the table, turned where everyone looks (dir); now and then a glance at us.
function youNodding(ctx, game, t, dir) {
  const p = person(t);
  p.dir = dir;
  p.head = Math.sin(t * 0.9) > 0.85 ? Math.PI / 2 : dir;
  p.smug = true;
  p.scale = 2.4;
  drawPerson(ctx, game.level.looks.player, p, 476, 312);
}

function kevsEmptyChair(ctx, game) {
  if (game.world && !game.world.kevGone) return;
  chair(ctx, 682, 276, OLIVE, 2.6, Math.PI); // Kev's (decor.js): he went home at 3:00
}

export function tableauLin(ctx, game, t, e, o) {
  const hungry = o?.why === 'linHungry';
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.meetingRug, '#397369');
  meetingScreen(ctx, t, true, 0);
  const b = person(t);
  b.dir = Math.PI - 0.35;
  b.head = Math.PI - 0.35;
  b.arms = 'point';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.5;
  drawPerson(ctx, game.level.looks.boss, b, 476, 222);
  meetingTable(ctx);
  smokingProjector(ctx, t, 560);
  kevsEmptyChair(ctx, game);
  // Lin's place: the evidence in front of her, in a pool of light; she shrinks into her cardigan
  poolOfLight(ctx, 300, 290);
  mugPops(ctx, game, 352, 246, e);
  const l = person(t);
  l.dir = 0.2;
  l.head = hungry ? Math.PI / 2 : 0.2 + Math.sin(t * 7) * 0.08; // a little tremble; in tears, she looks down
  l.arms = hungry ? 'facepalm' : 'shrug';
  l.sweat = true;
  l.scale = 2.4 - clamp(e / 2, 0, 1) * 0.3;
  drawPerson(ctx, game.level.looks.lin, l, 272, 262);
  youNodding(ctx, game, t, Math.PI - 0.3);
  bubble(ctx, B_BLAME_LIN, 476, 150, e, 'alert');
  bubble(ctx, hungry ? B_LIN_CRIES : B_LIN_SCARED, 272, 206, e, 'speech', 1.4);
}

export function tableauBossMug(ctx, game, t, e) {
  floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h, C.meetingRug, '#397369');
  meetingScreen(ctx, t, true, 0);
  const b = person(t);
  b.dir = Math.PI / 2;
  b.head = Math.PI / 2 + Math.sin(t * 2.3) * 0.4; // looking from face to face
  b.arms = 'shrug';
  b.sweat = true;
  b.jacket = bossJacket(game);
  b.scale = 2.5;
  drawPerson(ctx, game.level.looks.boss, b, 476, 222);
  meetingTable(ctx);
  smokingProjector(ctx, t, 380);
  kevsEmptyChair(ctx, game);
  // his place: the evidence in front of him, in a pool of light
  poolOfLight(ctx, 520, 252);
  mugPops(ctx, game, 520, 248, e);
  const l = person(t);
  l.dir = 0.42;
  l.head = 0.42;
  l.arms = 'point';
  l.scale = 2.4;
  drawPerson(ctx, game.level.looks.lin, l, 272, 262);
  youNodding(ctx, game, t, -Math.PI / 2);
  bubble(ctx, B_BOSS_SPUTTERS, 476, 150, e, 'speech');
  bubble(ctx, B_STARE_BOSS, 272, 206, e, 'thought', 1.4);
}
