// Phase transitions during a day: caught -> end, 4:00 meeting -> outcome + short beat -> end.
// Runs last in tick(), after rules.
//
// Attendance rule: stopping the meeting only counts if you're in the meeting room at 4:00.
// Everyone else is there; the one empty chair is yours. Result 'blamed' (a fail).
import { CAUGHT_DELAY } from '../config.js';
import { say, burst } from '../core/fx.js';
import { spotPos, inZone } from '../game/perception.js';
import { stareAtEmptyChair } from '../sim/npcs.js';
import { cancelAction } from './interactions.js';
import { setBusy, standUp } from './player.js';

export const END_BEAT = 2.0; // sim seconds of in-world beat after the meeting outcome
const CRICKETS_AT = 0.9; // fail beat: 🦗 sign appears at this point

export function updateScenario(game, dt) {
  if (game.phase !== 'day') return;
  const s = game.scenario;

  // Meeting beat in progress.
  if (game.outcome) {
    s.beatT += dt;
    if (game.outcome.result === 'fail' && !s.crickets && s.beatT >= CRICKETS_AT) {
      s.crickets = true;
      const proj = game.level.spots.projector;
      say(game, { x: proj.x + 0.5, y: proj.y + 1.5 }, ['🦗'], { kind: 'sign', ttl: 1.5 });
    }
    if (s.beatT >= END_BEAT) endDay(game);
    return;
  }

  // Busted beat, then the end screen.
  if (game.caught) {
    game.caught.t += dt;
    if (game.caught.t >= CAUGHT_DELAY) {
      game.outcome = makeOutcome(game, 'caught', [], []);
      endDay(game);
    }
    return;
  }

  if (game.clock.minute >= game.level.day.meetingAt) startMeeting(game, s);
}

function makeOutcome(game, result, routes, newRoutes) {
  return { result, routes, newRoutes, loop: game.persist.loop, minute: game.clock.minute };
}

function startMeeting(game, s) {
  const p = game.player;
  const w = game.world;

  // Everything achieved this loop counts (both routes can be true at once).
  const routes = [];
  if (w.bossLockedOut) routes.push('keycard');
  if (w.projector === 'broken') routes.push('projector');
  const present = inZone(game, 'meeting_room', p.x, p.y);
  const result = !routes.length ? 'fail' : present ? 'win' : 'blamed';
  const found = game.persist.routesFound;
  const newRoutes = result === 'win' ? routes.filter((r) => !found.includes(r)) : [];
  found.push(...newRoutes);
  game.outcome = makeOutcome(game, result, routes, newRoutes);

  // Freeze the player for the beat.
  cancelAction(game, 'meeting');
  setBusy(game, false, null);
  game.clock.forced = 0;
  game.clock.ff = false;
  p.locked = true;
  s.beatT = 0;

  if (result === 'fail') {
    // You are now presenting. There are no slides.
    burst(game, 'paper', p.x, p.y, 8);
    const spot = spotPos(game, 'meeting_presenter');
    p.x = spot.x;
    p.y = spot.y;
    p.dir = spot.dir;
    p.moving = false;
    standUp(game);
    burst(game, 'sweat', p.x, p.y, 6, { speed: 0.8 });
    say(game, 'player', ['😅'], { kind: 'speech', ttl: END_BEAT });
  } else if (result === 'blamed') {
    // Wherever you are, the room has noticed.
    stareAtEmptyChair(game);
    burst(game, 'sweat', p.x, p.y, 6, { speed: 0.8 });
    say(game, 'player', ['😰'], { kind: 'thought', ttl: END_BEAT });
  } else {
    burst(game, 'confetti', p.x, p.y, 30, { speed: 2.5, lift: 1.2, ttl: 1.6 });
    say(game, 'player', ['🎉'], { kind: 'speech', ttl: END_BEAT });
  }
}

function endDay(game) {
  game.phase = 'end';
  game.events.emit('day:end', { outcome: game.outcome });
}
