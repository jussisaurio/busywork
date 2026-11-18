// The meeting level's end screens: which scene an outcome gets, the icon row under it and its hand-drawn
// picture. src/render/screens.js reads this as level.endScenes:
//   kindOf(outcome)  -> a key of scenes (outcome may be null, outcome.routes may not be an array)
//   scenes[kind]     -> { win, icons, draw }
//     win            -> card border: teal when true, tomato when false
//     icons          -> emoji row under the picture, centred (any count): the punchline, speech
//     draw(ctx, game, t, e, outcome) -> paints the picture inside TAB (screen space, already clipped);
//                       e = seconds since the card came up. Objects in it are drawn (drawThing, painters.js), never
//                       emoji; only bubbles speak emoji (DESIGN.md "Visual language" rule 5)
// Which scene each outcome gets is endings.js endKind. The sets the scenes stand on (the meeting room, the table, the
// balcony) are end-set.js; each scene here draws its set, then only what is its own.
import { clamp, easeOutBack, easeOutCubic, rrect, fillEllipse, hash } from '../../render/util.js';
import { TOMATO } from '../../render/palette.js';
import { drawPerson } from '../../render/characters.js';
import { TAB, person, bubble, confetti } from '../../render/tableau.js';
import { chair, walnutDesk, officeRoom, drawLift, walkWithBox } from '../../render/tableau-furniture.js';
import { endKind, WHYS } from './endings.js';
import { bossJacket, kevHere, meetingRoom, presenting, AUDIENCE, atTheTable, brokenProjector, balconySet,
  bangingOnTheDoor, youNodding } from './end-set.js';
import { BANG, POUND } from './knocks.js';
import { tableauBib, tableauCampfire } from './end-scenes-combo.js';
import { FAIL_SCENES } from './end-scenes-fails.js';
import { popper, cricket } from './painters.js';
import { tableauComputer } from './end-scenes-more.js';
import { tableauLin, tableauBossMug } from './end-scenes-desks.js';
import { BALCONY_SCENES } from './end-scenes-balcony.js';

const B_ANGRY = ['😠'];
const B_POINT_YOU = ['👉', '@player'];
const B_WHAT = ['❓'];
const B_BLAME_YOU = ['😠', '👉', '@player'];
const B_PROJ = ['📽️', '💥'];
const B_NO_SLIDES = ['📊', '❌'];
const B_OUT = ['👋', '🚪'];
const B_DOTS = ['📊', '❓'];

// The keycard win, either side of the fire door. Inside (left) you cheer in the empty office. Outside (right), on
// the smokers' balcony, the boss pounds on the fire door, its card reader blinking red, butts ground out at his feet.
const B_LOCKED = [BANG.say, POUND.say];
function tableauKeycard(ctx, game, t, e) {
  balconySet(ctx);
  confetti(ctx, TAB.x, 280, TAB.y, TAB.h, e, 36);
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = p.dir + Math.sin(t * 4) * 0.25;
  p.arms = 'cheer';
  p.smug = true;
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, 340, 280 - Math.abs(Math.sin(t * 6)) * 8);
  const { beat, hit } = bangingOnTheDoor(ctx, game, 'boss', t, { angry: true });
  if (hit) { // impact rings off the steel
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2;
    for (let r = 0; r < 2; r++) {
      ctx.beginPath();
      ctx.arc(494, 222, 8 + r * 7 + beat * 20, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    }
  }
  bubble(ctx, B_LOCKED[Math.floor(e / 1.6) % 2], 560, 196, e % 1.6, 'alert');
  const pe = clamp((e - 0.3) / 0.3, 0, 1);
  if (pe > 0) {
    ctx.save();
    ctx.translate(250, 140);
    ctx.scale(easeOutBack(pe), easeOutBack(pe));
    ctx.rotate(Math.sin(t * 3) * 0.12);
    popper(ctx, 0, 0, 44, t);
    ctx.restore();
  }
}

// The projector win: no projector, no slides. The boss stands over the smoking projector, a hand over his face, then
// throws his hands up (📽️💥, 📊❌) and waves everyone out (👋🚪); Lin gets up. You sit at your place,
// the picture of patience. Nobody is blamed, so nobody points (Jussi's playtest: a point read as blaming Kev).
function tableauProjector(ctx, game, t, e) {
  meetingRoom(ctx, t, 'dead');
  const out = e > 3; // the room empties
  const l = person(t);
  l.dir = out ? Math.PI * 0.9 : 0;
  l.head = out ? Math.PI * 0.9 : Math.sin(t * 1.5) * 0.3 + 0.2;
  l.pose = out ? 'stand' : 'sit';
  l.arms = out ? 'folder' : 'desk';
  l.scale = 2;
  drawPerson(ctx, game.level.looks.lin, l, out ? 250 : 270, 222);
  // the boss, right behind the projector, facing the room over it
  const b = person(t);
  b.dir = Math.PI / 2;
  b.head = b.dir;
  b.arms = e < 0.8 ? 'facepalm' : 'shrug'; // a hand over his face, then his hands thrown up
  b.jacket = bossJacket(game);
  b.scale = 2.3;
  drawPerson(ctx, game.level.looks.boss, b, 540, 224);
  // the table, close up, the dead projector on it, big
  walnutDesk(ctx, 256, 228, 440, { depth: 76, skirt: 86, r: 30, shadow: { color: 'rgba(0,0,0,0.25)', dx: 6, dy: 10, h: 86 } });
  brokenProjector(ctx, t, 470, 268, 3);
  // you, in your tomato chair in front of the table, hands folded
  chair(ctx, 640, 330, TOMATO, 2.4, -Math.PI / 2);
  const p = person(t);
  p.dir = -Math.PI / 2;
  p.head = -Math.PI / 2 + Math.sin(t * 0.8) * 0.2;
  p.pose = 'sit';
  p.arms = 'desk';
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, 640, 322);
  const says = out ? B_OUT : e > 1.5 ? B_NO_SLIDES : B_PROJ;
  bubble(ctx, says, 600, 140, out ? e - 3 : e > 1.5 ? e - 1.5 : e);
}

// The plain fail: you hurry in, sweating, to the blank screen; the room stares; the lone cricket.
function tableauFail(ctx, game, t, e) {
  presenting(ctx, game, t, { kev: { glance: 1 }, lin: { glance: 1 }, boss: { head: Math.PI + 0.15, glance: 1 } });
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = p.dir + Math.sin(t * 2.6) * 0.5;
  p.sweat = true;
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, 480, 262);
  bubble(ctx, B_DOTS, AUDIENCE.boss[0], 180, e, 'thought');
  const hop = Math.abs(Math.sin(e * 5));
  cricket(ctx, 480 + Math.sin(e * 0.9) * 80, 322 - hop * 14, 22);
}

// The Good Samaritan, caught: you let him in, he hugged you, and over your shoulder saw his card in your hand. The
// keycard win the other way round: you on the balcony, fists on the fire door; he, inside, dangles his card at you.
const B_LET_ME_IN = [['🙏', '🚪'], POUND.say];
function tableauSamaritanCaught(ctx, game, t, e) {
  balconySet(ctx);
  const b = person(t);
  b.dir = 0; // facing the door, and you behind it
  b.head = Math.sin(t * 1.6) * 0.12;
  b.arms = 'holdout';
  b.item = '#keycard';
  b.smug = true;
  b.jacket = bossJacket(game);
  b.scale = 2.3;
  drawPerson(ctx, game.level.looks.boss, b, 380, 276);
  bubble(ctx, e < 2.4 ? ['🪪', '😏'] : ['👋'], 380, 186, e < 2.4 ? e : e - 2.4);
  bangingOnTheDoor(ctx, game, 'player', t, { sweat: true });
  bubble(ctx, B_LET_ME_IN[Math.floor(e / 1.6) % 2], 560, 196, e % 1.6, 'alert');
}

// The Good Samaritan, not caught: you let him in and he's so grateful he presents with you, his arm round your
// shoulder, beaming at the room, in front of the blank screen. The cricket hops.
function tableauSamaritan(ctx, game, t, e) {
  presenting(ctx, game, t, { kev: { glance: 1 }, lin: { glance: 1 }, boss: false }); // he is up front, with you
  const p = person(t);
  p.dir = Math.PI / 2;
  p.head = p.dir + Math.sin(t * 2.6) * 0.5;
  p.sweat = true;
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, 456, 266);
  const b = person(t);
  b.dir = Math.PI / 2;
  b.head = Math.PI / 2 - 0.5 + Math.sin(t * 1.2) * 0.15; // beaming at you, then the room
  b.smug = true;
  b.jacket = bossJacket(game);
  b.scale = 2.3;
  const squeeze = Math.max(0, Math.sin(t * 3)) * 2;
  drawPerson(ctx, game.level.looks.boss, b, 516 - squeeze, 262);
  // his arm, round your shoulder: a sleeve from his shoulder across your back to a hand on your far shoulder
  const sleeve = bossJacket(game) ? game.level.looks.boss.body : game.level.looks.boss.shirt;
  ctx.strokeStyle = sleeve;
  ctx.lineCap = 'round';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(502 - squeeze, 257);
  ctx.quadraticCurveTo(474, 246, 444 + squeeze, 256);
  ctx.stroke();
  fillEllipse(ctx, 442 + squeeze, 257, 5.5, 5, game.level.looks.boss.skin);
  const { think, say } = WHYS.samaritan.stare; // what the room thinks in the day, on the card too
  bubble(ctx, e < 2.6 ? think : say, 530, 180, e < 2.6 ? e : e - 2.6);
  const hop = Math.abs(Math.sin(e * 5));
  cricket(ctx, 600 + Math.sin(e * 0.9) * 60, 322 - hop * 14, 22);
}

// You went home. On the bus, by the window, the town sliding past; the phone in your lap buzzes, and buzzes, the boss's
// face on its screen. With Kev (you left together at 3:00) he sits beside you, untroubled.
const BUS_SEATS = [300, 410, 520, 630];
const BUS_BLUE = ['#3f6d9e', '#2b4e74'];
function tableauHome(ctx, game, t, e, o) {
  const withKev = o?.why === 'homeKev';
  busInside(ctx, t);
  for (const x of BUS_SEATS) chair(ctx, x, 268, BUS_BLUE, 2.6, Math.PI / 2);
  const buzz = e > 1.2 && (e % 1.4) < 0.7; // the phone buzzes in bursts, from a beat after the card comes up
  // Kev beside you (he left at 3:00 as always; today you went with him), smug, eyes out of the window
  if (withKev) {
    const k = person(t);
    k.pose = 'sit';
    k.arms = 'desk';
    k.smug = true;
    k.head = Math.PI / 2 - 0.5 + Math.sin(t * 0.7) * 0.15;
    k.scale = 2.3;
    drawPerson(ctx, game.level.looks.kev, k, BUS_SEATS[2], 252);
  }
  // you, eyes down on the phone; the guilt shows once it buzzes
  const p = person(t);
  p.pose = 'sit';
  p.arms = 'desk';
  p.head = Math.PI / 2 + (buzz ? Math.sin(t * 9) * 0.2 : 0);
  p.sweat = buzz;
  p.scale = 2.3;
  drawPerson(ctx, game.level.looks.player, p, BUS_SEATS[1], 252);
  phoneWithBoss(ctx, game, t, BUS_SEATS[1] + 2, 286, buzz);
  bubble(ctx, e < 1.2 ? ['😌'] : ['😬'], BUS_SEATS[1], 178, e < 1.2 ? e : e - 1.2, 'thought', 1.2);
  if (withKev) bubble(ctx, ['😌'], BUS_SEATS[2], 178, e, 'thought', 1.2);
}

// The inside of a city bus: a panelled side under a band of windows, the town scrolling past, a yellow grab rail,
// and a ribbed grey floor.
const TOWN = ['#c98a6a', '#9fb2a0', '#d8c69a', '#a89cb8'];
function busInside(ctx, t) {
  ctx.fillStyle = '#596067';
  ctx.fillRect(TAB.x, TAB.y, TAB.w, TAB.h); // floor
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let y = TAB.y + 130; y < TAB.y + TAB.h; y += 9) ctx.fillRect(TAB.x, y, TAB.w, 3);
  ctx.fillStyle = '#d5dbdf'; // the side panel
  ctx.fillRect(TAB.x, TAB.y, TAB.w, 124);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(TAB.x, TAB.y + 124, TAB.w, 6);
  const top = TAB.y + 10;
  const h = 78;
  const scroll = (t * 70) % 1840;
  for (const [x, w] of [[TAB.x + 16, 170], [TAB.x + 204, 170], [TAB.x + 392, 172]]) {
    ctx.save();
    ctx.beginPath();
    rrect(ctx, x, top, w, h, 8);
    ctx.clip();
    ctx.fillStyle = '#bfe0ee';
    ctx.fillRect(x, top, w, h);
    // the town going by: houses, and a lamp post now and then
    for (let i = 0; i < 40; i++) {
      let bx = TAB.x + i * 46 - scroll;
      if (bx < TAB.x - 60) bx += 1840;
      if (bx + 50 < x || bx > x + w) continue;
      const bh = 26 + hash(i, 7) * 40;
      ctx.fillStyle = TOWN[i % 4];
      ctx.fillRect(bx, top + h - bh, 42, bh);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      for (let wy = top + h - bh + 6; wy < top + h - 8; wy += 12) {
        ctx.fillRect(bx + 8, wy, 8, 6);
        ctx.fillRect(bx + 26, wy, 8, 6);
      }
      if (i % 3 === 0) {
        ctx.fillStyle = '#3e4448';
        ctx.fillRect(bx + 44, top + 10, 3, h);
        ctx.fillRect(bx + 36, top + 10, 14, 3);
      }
    }
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; // glare
    ctx.fillRect(x, top + 6, w, 6);
    ctx.restore();
    ctx.strokeStyle = '#3c4247';
    ctx.lineWidth = 5;
    rrect(ctx, x, top, w, h, 8);
    ctx.stroke();
  }
  ctx.fillStyle = '#e8b830'; // the grab rail along the side
  ctx.fillRect(TAB.x, TAB.y + 104, TAB.w, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(TAB.x, TAB.y + 104, TAB.w, 1.5);
}

// Your phone, in your lap: the boss's face on the screen, and when it buzzes it shivers, with buzz marks either side.
function phoneWithBoss(ctx, game, t, x, y, buzz) {
  const jx = buzz ? Math.sin(t * 70) * 1.6 : 0;
  ctx.save();
  ctx.translate(x + jx, y);
  ctx.fillStyle = '#22262a';
  rrect(ctx, -13, -20, 26, 40, 5);
  ctx.fill();
  ctx.fillStyle = buzz ? '#f2f7fb' : '#c9d6df';
  rrect(ctx, -10, -16, 20, 30, 3);
  ctx.fill();
  ctx.beginPath();
  rrect(ctx, -10, -16, 20, 30, 3);
  ctx.clip();
  const b = person(t);
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 1.1;
  drawPerson(ctx, game.level.looks.boss, b, 0, 4);
  ctx.restore();
  if (!buzz) return;
  ctx.strokeStyle = 'rgba(40,40,40,0.75)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    for (const r of [19, 25]) {
      ctx.beginPath();
      ctx.arc(x, y, r, side < 0 ? Math.PI - 0.5 : -0.5, side < 0 ? Math.PI + 0.5 : 0.5);
      ctx.stroke();
    }
  }
}

// Fired: you shuffle off to the lift with your desk in a box; the boss points the way.
const LIFT = { x: 612, y: TAB.y, w: 104, h: 104 };
function tableauCaught(ctx, game, t, e) {
  officeRoom(ctx, 92);
  drawLift(ctx, t, LIFT, { shine: true });
  walkWithBox(ctx, game.level.looks.player, t, e, 350, LIFT.x + LIFT.w / 2); // the walk of shame, to the open doors
  // the boss, rooted to the spot, pointing the way out
  const b = person(t);
  b.dir = 0.08;
  b.head = 0.08 + Math.sin(t * 2.4) * 0.08;
  b.arms = 'point';
  b.angry = true;
  b.jacket = bossJacket(game);
  b.scale = 2.6;
  const jab = Math.max(0, Math.sin(t * 5)) * 3; // little jabs at the door
  b.badge = !!game.world?.cardBack; // caught with his keycard: it's back on his pocket
  drawPerson(ctx, game.level.looks.boss, b, 262 + jab, 282);
  bubble(ctx, game.world?.cardBack ? ['😠', '🪪'] : B_ANGRY, 276, 206, e, 'alert');
}

// Blamed: the meeting fell apart, but you weren't there. Everyone glares at your empty tomato chair.
// routes add their scars: 'projector' leaves it smoking on the table; 'keycard' leaves the boss's place empty
// (he is locked out on the smokers' balcony).
function tableauBlamed(ctx, game, t, e, o) {
  const routes = Array.isArray(o.routes) ? o.routes : [];
  const smoke = routes.includes('projector');
  const lockedOut = routes.includes('keycard');
  const kev = kevHere(game);
  atTheTable(ctx, game, t, e, {
    screen: smoke ? 'dead' : 'blank',
    boss: lockedOut ? null : { arms: 'bang', angry: true }, // behind the table, fists on it
    smoke: smoke ? 420 : null,
    lin: { dir: 0.42, head: 0.42, arms: 'point', angry: true }, // Lin and Kev at the table ends, turned to the chair
    kev: { head: Math.PI - 0.3 + Math.sin(t * 1.7) * 0.2, glance: 1 },
  });
  // what they're saying
  bubble(ctx, lockedOut && !kev ? B_BLAME_YOU : B_POINT_YOU, 272, 206, e, 'speech', 1.4);
  if (!lockedOut) bubble(ctx, B_ANGRY, 476, 168, e, 'alert');
  if (kev) bubble(ctx, B_WHAT, 680, 206, e, 'thought', 1.4);
}

// Blamed, from the restroom (o.where): the same table staring at your empty chair, and then, after the flush, you
// walk in from the right, wiping your wet hands on your trousers. Everyone turns.
const B_LOO = ['🚽', '🙂'];
function tableauRestroom(ctx, game, t, e, o) {
  tableauBlamed(ctx, game, t, e, o);
  const k = clamp((e - 0.9) / 1.1, 0, 1);
  if (k <= 0) return;
  const p = person(t);
  const walking = k < 1;
  p.dir = Math.PI;
  p.head = Math.PI;
  p.pose = walking ? 'walk' : 'stand';
  p.moving = walking;
  p.phase = t * 7;
  p.arms = walking ? 'walk' : 'pat';
  p.scale = 2.4;
  drawPerson(ctx, game.level.looks.player, p, 800 - easeOutCubic(k) * 60, 282);
  if (!walking) bubble(ctx, B_LOO, 740, 222, e - 2, 'speech', 1.2);
}

// Blamed by the mug (verdict.js why 'mug'/'desk'): the projector smokes on the table, and the empty mug is in your
// hand (or, found on your desk, back on the table in front of you). The boss pounds the table; the room points.
function tableauMug(ctx, game, t, e, o) {
  const inHand = o.why !== 'desk';
  atTheTable(ctx, game, t, e, {
    boss: { arms: 'bang', angry: true },
    smoke: 380,
    spot: inHand ? null : { light: [560, 252], mug: [560, 248] },
    lin: { dir: 0.42, head: 0.42, arms: 'point', angry: true },
    kev: { arms: 'point' },
    // you, in front of the table, caught with it: eyes darting, the empty mug in your hands
    you: { dir: Math.PI / 2, head: Math.PI / 2 + Math.sin(t * 3.1) * 0.5, sweat: true, ...(inHand ? { arms: 'mug', item: '#mug' } : {}) },
    youLit: true,
  });
  bubble(ctx, WHYS[o.why].stare.say, 476, 150, e, 'alert');
  bubble(ctx, B_POINT_YOU, 272, 206, e, 'speech', 1.4);
}

// The win the mug buys (verdict.js why 'kev'): the boss found it on Kev's desk. Kev went home at 3:00, so the whole
// table turns on his empty chair, the empty mug in front of it. You stand among them, nodding along.
function tableauKev(ctx, game, t, e) {
  const { think, say } = WHYS.kev.stare;
  atTheTable(ctx, game, t, e, {
    boss: { dir: 0.35, head: 0.35, arms: WHYS.kev.boss, angry: true },
    smoke: 400,
    spot: { light: [682, 290], mug: [620, 246], pop: true }, // Kev's place: his chair, the evidence in front of it
    kevAway: true,
    lin: { dir: 0, head: 0, arms: 'point', angry: true },
    you: youNodding(t, -0.3), // turned to the chair with everyone else
  });
  bubble(ctx, say, 476, 150, e, 'alert');
  bubble(ctx, think, 272, 206, e, 'thought', 1.4);
}

export const END_SCENES = {
  kindOf: endKind, // endings.js: which scene each outcome gets
  scenes: {
    bib: { win: false, icons: ['🥪', '🟡', '⌨️'], draw: tableauBib }, // Lin saw the mustard: you type in a bib (end-scenes-combo.js)
    campfire: { win: true, icons: ['📽️', '🔥', '🔒'], draw: tableauCampfire }, // both routes: marshmallows at the projector
    keycard: { win: true, icons: ['🔒', '🪪', '👊'], draw: tableauKeycard }, // locked out: his card is in your pocket
    projector: { win: true, icons: ['📽️', '💥', '🚫'], draw: tableauProjector }, // the projector died; no meeting
    fail: { win: false, icons: ['📊', '❌', '🦗'], draw: tableauFail },
    ...FAIL_SCENES, // the plain fails with a cause, and "where were you?" (end-scenes-fails.js)
    caught: { win: false, icons: ['😠', '👉', '📦'], draw: tableauCaught }, // fired: box of desk stuff, pointed at the lift
    blamed: { win: false, icons: ['🪑', '👉', '😠'], draw: tableauBlamed }, // the meeting happened; your chair was empty
    restroom: { win: false, icons: ['🪑', '🚽', '🙂'], draw: tableauRestroom }, // blamed, and in walks you, hands wet
    mug: { win: false, icons: ['☕', '👉', '😠'], draw: tableauMug }, // the empty mug was yours: in your hand, on your desk
    kev: { win: true, icons: ['☕', '👉', '🪑'], draw: tableauKev }, // the empty mug was on Kev's desk; Kev went home
    samaritan: { win: false, icons: ['🚪', '🤗', '🦗'], draw: tableauSamaritan }, // let him in: grateful, and no slides
    samaritanCaught: { win: false, icons: ['🤗', '🪪', '🔒'], draw: tableauSamaritanCaught }, // let him in, holding his card
    home: { win: false, icons: ['🚌', '📱', '😠'], draw: tableauHome }, // you just went home; the boss is calling
    homeKev: { win: false, icons: ['👋', '🚌', '📱'], draw: tableauHome }, // you went home with Kev at 3:00
    computer: { win: false, icons: ['☕', '💻', '💥'], draw: tableauComputer }, // the coffee went into a computer (end-scenes-more.js)
    // end-scenes-desks.js: the empty mug on Lin's desk (she takes the fall; ate her lunch too: tears), on the boss's own
    lin: { win: true, icons: ['☕', '👉', '😨'], draw: tableauLin },
    linHungry: { win: true, icons: ['☕', '😭', '🥪'], draw: tableauLin },
    bossMug: { win: true, icons: ['☕', '🤨', '😳'], draw: tableauBossMug },
    ...BALCONY_SCENES, // out on the balcony at 4:00: alone, snatched, together (end-scenes-balcony.js)
  },
};
