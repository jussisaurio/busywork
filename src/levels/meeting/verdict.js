// The 4:00 verdict (level.meeting.verdict; play/scenario.js): with the projector dead and the boss at the head of
// the table, the room looks from the projector to the coffee cup, and from the cup to whoever has it.
//   the cup in your hand, or on your desk  -> blamed, whatever else you did: the table turns on you (📽️💥 ☕😠👉 and your face)
//   the cup on Kev's desk (you're in the room) -> the win stands, and the table stares at Kev's empty chair
//   anywhere else (back on the machine) -> the rule as before
// Locked out, the boss isn't there to ask: the rule as before.
import { findNpc } from '../../game/perception.js';

export function verdict(game, { routes, present }) {
  const w = game.world;
  if (!routes.includes('projector')) return null;
  const boss = findNpc(game, 'boss');
  if (!boss?.active || boss.override !== game.level.meeting.override) return null;
  if (w.mug === 'player' || w.mug === 'my_desk') {
    return { result: 'blamed', why: w.mug === 'player' ? 'mug' : 'desk', stare: { at: 'player', think: ['📽️', '💥'], say: ['☕', '😠', '👉', '@player'], line: 'tattle' } };
  }
  if (w.mug === 'kev_desk' && present) return { why: 'kev', stare: { at: 'meeting_kev', think: ['☕', '@kev'], say: ['😠', '👉', '@kev'] } };
  return null;
}
