// The 4:00 verdict (level.meeting.verdict; play/scenario.js): with the projector dead and the boss at the head of
// the table, the room looks from the projector to the coffee cup, and from the cup to whoever has it.
//   the cup in your hand, or on your desk  -> blamed, whatever else you did: the table turns on you (📽️💥 ☕😠👉 and your face)
//   the cup on Kev's desk (you're in the room) -> the win stands, and the table stares at Kev's empty chair
//   anywhere else (back on the machine) -> the rule as before
// Locked out, the boss isn't there to ask: the rule as before.
// Nothing cancelled it, but you let him in off the balcony (clocks.js bossLetIn: world.samaritan): the fail, and he's
// beaming at you (why 'samaritan': the end card has his arm round your shoulder and a blank screen).
import { findNpc } from '../../game/perception.js';
import { balconyVerdict } from './balcony.js';

export function verdict(game, { routes, present }) {
  const w = game.world;
  const out = balconyVerdict(game); // on the balcony at 4:00: where you are decides it (balcony.js)
  if (out) return out;
  if (!routes.length && w.samaritan) return { why: 'samaritan', stare: { at: 'player', think: ['🤗'], say: ['👏', '@player'] } };
  if (!routes.includes('projector')) return null;
  const boss = findNpc(game, 'boss');
  if (!boss?.active || boss.override !== game.level.meeting.override) return null;
  if (w.mug === 'player' || w.mug === 'my_desk') {
    return { result: 'blamed', why: w.mug === 'player' ? 'mug' : 'desk', stare: { at: 'player', think: ['📽️', '💥'], say: ['☕', '😠', '👉', '@player'], line: 'tattle' } };
  }
  if (w.mug === 'kev_desk' && present) return { why: 'kev', stare: { at: 'meeting_kev', think: ['☕', '@kev'], say: ['😠', '👉', '@kev'] } };
  return null;
}

// ---- The plain fails (end-scenes-fails.js). The verdict above, then: a fail with nothing else to say gets the
// cause you can see at 4:00 (outcome.why), the first that holds:
//   the day's last cup in your hand          -> 'sip'      you drink it up front, slowly
//   on the phone (pretending, standing)      -> 'call'     you keep the call going up front
//   already in the meeting room              -> 'puppets'  you stand in the beam and make a duck
//   anywhere else                            -> none: the plain fail (you hurry in to the blank screen)
// Not while at work you were sent to (the end card is the order's then: render/screens.js 'stopped').
export function verdictFull(game, a) {
  const v = verdict(game, a);
  if (v) return v;
  const p = game.player;
  if (game.rules.stoppedBy && game.clock.forced > 0) return null;
  if (a.result === 'fail') {
    if (p.held === 'coffee') return { why: 'sip' };
    if (p.busyPose === 'phone') return { why: 'call' };
    if (a.present) return { why: 'puppets' };
  }
  return verdictWhere(game, a);
}

// ---- "Where were you?" (end-scenes-fails.js tableauWorking). Blamed, and at 4:00 you were at your own desk, typing:
// the one person in the office working. The room turns to look (through the wall: your desk is just south of it).
// why 'working'. The restroom is meeting.where (outcome.where), not this.
function verdictWhere(game, a) {
  const p = game.player;
  if (a.result === 'blamed' && p.seated && p.busyPose === 'typing') {
    return { why: 'working', stare: { at: 'player', think: ['🪑', '❓'], say: ['👀', '⌨️', '@player'] } };
  }
  return null;
}
