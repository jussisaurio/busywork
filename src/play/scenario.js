// Phase transitions during a day: caught -> end, 4:00 meeting -> outcome + short beat -> end.
// Runs last in tick(), after rules.
//
// Attendance rule: stopping the meeting only counts if you're in the meeting room at 4:00.
// Everyone else is there; the one empty chair is yours. Result 'blamed' (a fail).
import { CAUGHT_DELAY, PLAYER_SPEED } from '../config.js';
import { say, burst } from '../core/fx.js';
import { spotPos, inZone } from '../game/perception.js';
import { stareAt } from '../sim/npcs.js';
import { claimPending } from '../sim/mechanics/claim.js';
import { cancelAction } from './interactions.js';
import { setBusy, standUp, sitAtDesk, planWalk, stepWalk, walkLength } from './player.js';

export const END_BEAT = 2.0; // sim seconds of in-world beat after the meeting outcome (after the walk, if any)
const CRICKETS_AT = 0.9; // fail beat: the 🦗 sign appears at this point (where: level.failSign; none if absent)
// A fail sends you to the front (meeting.presenter, if any): you hurry there, at least this fast, and in at most WALK_MAX s.
const HURRY = PLAYER_SPEED * 1.5;
const WALK_MAX = 2.5;
const CLAIM_WAIT = 8; // s at most that a catch's beat waits for a claim (he walks over to take his thing)
const SIT_BEAT = 0.6; // s after you reach your desk (sent there just before the deadline) before the card

export function updateScenario(game, dt) {
  if (game.phase !== 'day') return;
  const s = game.scenario;

  // Meeting beat in progress: the walk you're made to take (to the front, or on to your desk), then the beat.
  if (game.outcome) {
    s.beatT += dt;
    const w = s.walk;
    if (w && stepWalk(game, w, w.speed, dt)) arrive(game, s, w);
    if (game.outcome.result === 'fail' && !s.walk && !s.crickets && s.beatT >= s.arrivedAt + CRICKETS_AT) {
      s.crickets = true;
      const sign = game.level.failSign;
      if (sign) {
        const p = game.level.spots[sign.spot];
        say(game, { x: p.x + sign.offset[0], y: p.y + sign.offset[1] }, ['🦗'], { kind: 'sign', ttl: 1.5 });
      }
    }
    if (!s.walk && s.beatT >= s.endAt) endDay(game);
    return;
  }

  // Busted beat, then the end screen.
  if (game.caught) {
    game.caught.t += dt;
    // A catch's take on its way (sim/mechanics/claim.js: he walks over for his thing): the beat waits for him.
    const waiting = claimPending(game) && game.caught.t < CLAIM_WAIT;
    if (game.caught.t >= CAUGHT_DELAY && !waiting) {
      for (const n of game.npcs) { // out of time on his way over: he takes it as the card comes up
        if (!n._claim?.onCatch || n._claim.done) continue;
        n._claim.done = true;
        game.events.emit('claim:done', { by: n.id, item: n._claim.item });
      }
      game.outcome = makeOutcome(game, 'caught', [], []);
      if (game.caught.why) game.outcome.why = game.caught.why; // a level's catch (rules.js catchNow): its end scene
      endDay(game);
    }
    return;
  }

  if (game.clock.minute >= game.level.day.meetingAt) startMeeting(game, s);
}

// stopped: { by, reason, working } when a lost day had you sent to your desk (rules.js assignWork): by, who stopped
// you (the witness who told, else the authority); working: still at it when the day ended. End scenes show it.
function makeOutcome(game, result, routes, newRoutes) {
  const o = { result, routes, newRoutes, loop: game.persist.loop, minute: game.caught?.minute ?? game.clock.minute }; // caught: the minute it happened, not the end of the beat
  const r = game.rules;
  if (result !== 'win' && result !== 'caught' && r.stoppedBy) {
    o.stopped = { by: r.stoppedBy, reason: r.stoppedFor, working: !!(r.sent || game.clock.forced > 0) };
  }
  return o;
}

function startMeeting(game, s) {
  const p = game.player;
  const w = game.world;
  // On your way to your desk (sent there: player.js sendToDesk) you count as at it: the order stands.
  const sent = game.rules.sent;
  game.rules.sent = null;
  const seat = spotPos(game, 'player_desk');
  const at = sent ? seat : p;

  // Everything achieved this loop counts (both routes can be true at once), in the level's outcomeOrder.
  const level = game.level;
  const routes = level.outcomeOrder.filter((id) => level.routes.find((r) => r.id === id).achieved(w));
  const present = inZone(game, level.meeting.room, at.x, at.y);
  const base = !routes.length ? 'fail' : present ? 'win' : 'blamed';
  // The level can judge the room itself (level.meeting.verdict(game, { result, routes, present })): null keeps
  // the rule above; else { result?, why?, stare? }. why: a string the outcome carries (for end scenes, the
  // harness); stare: where the table looks (npcs.js stareAt; blamed without one: your empty chair).
  const v = level.meeting.verdict?.(game, { result: base, routes, present }) ?? null;
  const result = v?.result ?? base;
  const found = game.persist.routesFound;
  const newRoutes = result === 'win' ? routes.filter((r) => !found.includes(r)) : [];
  found.push(...newRoutes);
  game.outcome = makeOutcome(game, result, routes, newRoutes);
  if (v?.why) game.outcome.why = v.why;

  // Freeze the player for the beat.
  cancelAction(game, 'meeting');
  setBusy(game, false, null);
  game.clock.forced = 0;
  game.clock.ff = false;
  p.locked = true;
  s.beatT = 0;
  s.arrivedAt = 0;
  s.endAt = END_BEAT;
  s.walk = null;

  if (result === 'fail') {
    // You are now presenting. There are no slides. You hurry to the front (the beat waits for you to get there).
    standUp(game);
    // No presenter spot: it happens where you stand.
    const at = game.level.meeting.presenter;
    const spot = at ? spotPos(game, at) : { x: p.x, y: p.y, dir: p.dir };
    const t = walkTo(game, s, spot, HURRY, false);
    burst(game, 'sweat', p.x, p.y, 6, { speed: 0.8 });
    // Never a smile on a loss (😅 reads as 😄 at bubble size): a wince on the way, 😩 up front (arrive).
    if (t > 0) say(game, 'player', ['😬'], { kind: 'speech', ttl: t + 0.3 });
  } else if (result === 'blamed') {
    // Wherever you are, the room has noticed.
    stareAt(game, v?.stare);
    burst(game, 'sweat', p.x, p.y, 6, { speed: 0.8 });
    say(game, 'player', ['😰'], { kind: 'thought', ttl: END_BEAT });
  } else if (result !== 'win') {
    // Any other loss a level's verdict gives (caught: Layoffs' told case): no party.
    burst(game, 'sweat', p.x, p.y, 6, { speed: 0.8 });
    say(game, 'player', ['😨'], { kind: 'thought', ttl: END_BEAT });
  } else {
    burst(game, 'confetti', p.x, p.y, 30, { speed: 2.5, lift: 1.2, ttl: 1.6 });
    say(game, 'player', ['🎉'], { kind: 'speech', ttl: END_BEAT });
  }
  if (v?.stare && result !== 'blamed') stareAt(game, v.stare); // e.g. a win where the table blames someone else
  // Sent to your desk and not there yet: you get there, and the beat waits for you.
  if (sent && result !== 'fail') walkTo(game, s, seat, PLAYER_SPEED, true);
}

// Start the walk the beat makes you take; returns its time in s (0: you're there, or there's no way there and you
// just are). speed: at least this fast, and fast enough to arrive within WALK_MAX. sit: sit down on arrival.
function walkTo(game, s, spot, speed, sit) {
  const p = game.player;
  const walk = planWalk(game, spot);
  const len = walk ? walkLength(game, walk) : 0;
  if (!(len > 1e-6)) {
    arrive(game, s, { spot, sit });
    return 0;
  }
  const v = Math.max(speed, len / WALK_MAX);
  s.walk = { ...walk, speed: v, spot, sit };
  p.moving = false;
  return len / v;
}

// There: the fail beat (crickets, the card) counts from now; at your desk you sit and the card follows shortly.
function arrive(game, s, w) {
  const p = game.player;
  s.walk = null;
  s.arrivedAt = s.beatT;
  s.endAt = Math.max(s.endAt, s.beatT + (w.sit ? SIT_BEAT : END_BEAT));
  p.x = w.spot.x;
  p.y = w.spot.y;
  p.dir = w.spot.dir;
  p.moving = false;
  if (w.sit) sitAtDesk(game);
  else if (game.outcome?.result === 'fail') say(game, 'player', ['😩'], { kind: 'speech', ttl: END_BEAT });
}

function endDay(game) {
  game.phase = 'end';
  game.events.emit('day:end', { outcome: game.outcome });
}
