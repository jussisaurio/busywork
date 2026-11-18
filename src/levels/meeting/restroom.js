// The restroom (R, 25,13): one cubicle, and the map doesn't show inside it.
//   taken (the boss 3:18–3:22, Lin 3:35–3:37: their 'away restroom'): E knocks (toys.js knock_*), and whoever is in
//     there answers through the door (🚽😠 and his face).
//   free, hands empty: E goes in (play/player.js goInside: hidden, nobody sees you; pretending still runs the clock).
//     Inside, with mustard down your sweater, you think 👕🟡🧼 as you go in and E washes it off at the sink (🧼, the
//     tap runs); else E comes out (the flush). Each fills its meter on the floor at the door (render/characters.js),
//     as any action's does, though you aren't drawn. At 4:00 inside, you come out late: the table already stares at your empty chair, and you walk in
//     drying your hands (meeting.where 'restroom': end-scenes.js).
// It holds one person, you included. An NPC who comes for it while you're in there stops at the door (atTheDoor, every
// step, clocks.js) and knocks ✊🚪.
//   Lin, Kev  wait, and it shows (⌚❓, ✊✊🚪, 😤, round again), until you come out (they go in for what's left of their
//             time) or their time is up (they give up and get on with their day: the schedule never moves).
//   the boss  doesn't wait: a knock, EJECT_AT seconds, then both fists (👊🚪😤) and you're out, stood at the door in
//             plain view, whatever you were doing cut short (mid-wash: the mustard is still on you, 🧼😳). 👉 and he
//             goes in himself. Not a catch: it costs the hiding place, and what he sees on you is the usual rules.
// Who is in there is kept on the player (player._stall, an NPC id or null), set every step by clocks.js: the
// interaction rows read only (player, world).
import { goInside, comeOut } from '../../play/player.js';
import { say } from '../../core/fx.js';
import { cancelAction } from '../../play/interactions.js';
import { holdFor, speak } from '../../sim/override.js';

export const DOOR = { x: 25.5, y: 12.5 }; // where you stand at the door (map.js SPOTS.restroom), and wait inside

// The NPC in the cubicle now: away to the restroom, and through its door.
export function whoInside(game) {
  for (const n of game.npcs) if (!n.active && !n._gone && n._plan?.done && n._plan.label === 'away restroom') return n.id;
  return null;
}

const QUEUE_REACH = 1.3; // tiles from the door: where someone waiting for it stops
const EJECT_AT = 2.6; // seconds the boss gives you after his knock
const POUND_AT = 1.8;
// The wait, by seconds since the knock; from the last line it goes round again from the second.
const WAITING = [
  { t: 0, say: ['✊', '🚪'], event: 'restroom:knock' },
  { t: 1.8, say: ['⌚', '❓'], kind: 'thought' },
  { t: 3.4, say: ['✊', '✊', '🚪'], event: 'restroom:knock' },
  { t: 5.2, say: ['😤'] },
];
const ROUND = 5.2; // (Lin's whole visit is about 5 s: she gets as far as the second knock)

// Every NPC step (clocks.js): on his way to the restroom, at its door, and you're in it.
export function atTheDoor(game, npc) {
  const p = game.player;
  const plan = npc._plan;
  const here = npc.active && plan && !plan.done && plan.label === 'away restroom' && p.inside === 'restroom'
    && !game.caught && !game.outcome && Math.hypot(npc.x - DOOR.x, npc.y - DOOR.y) < QUEUE_REACH;
  if (!here) { npc._queue = null; return; }
  const q = npc._queue ?? (npc._queue = { t0: game.loopTime, i: 0, round: 0, pounded: false });
  const t = game.loopTime - q.t0;
  holdFor(npc, 0.25); // he stands there for as long as this keeps being true
  npc._faceTarget = Math.atan2(DOOR.y + 1 - npc.y, DOOR.x - npc.x); // the door (R, the tile south of the spot)
  if (npc.id === game.level.roles?.authority?.id) return bossAtTheDoor(game, npc, q, t);
  const line = WAITING[q.i];
  if (t < line.t + q.round * ROUND) return;
  knockLine(game, npc, line);
  if (++q.i >= WAITING.length) { q.i = 1; q.round++; }
}

function knockLine(game, npc, line) {
  speak(game, npc, [{ say: line.say, kind: line.kind, ttl: 1.4 }]);
  if (line.event) game.events.emit(line.event, { by: npc.id });
}

function bossAtTheDoor(game, boss, q, t) {
  const p = game.player;
  if (q.i === 0) { knockLine(game, boss, WAITING[0]); q.i = 1; }
  if (!q.pounded && t >= POUND_AT) {
    q.pounded = true;
    speak(game, boss, [{ say: ['👊', '🚪', '😤'], kind: 'alert', ttl: 1.4 }]);
    game.events.emit('restroom:pound', { by: boss.id });
  }
  if (t < EJECT_AT) return;
  const washing = p.action?.type === 'wash_up';
  cancelAction(game, 'ejected');
  comeOut(game);
  p.dir = Math.atan2(boss.y - p.y, boss.x - p.x);
  say(game, 'player', washing || p.smeared ? ['🧼', '😳'] : ['😳'], { kind: 'thought', ttl: 1.8 });
  boss._faceTarget = Math.atan2(p.y - boss.y, p.x - boss.x);
  holdFor(boss, 1.4); // 👉: off you go. Then in he goes.
  speak(game, boss, [{ say: ['👉'], after: 0.3, ttl: 1.1 }]);
  game.events.emit('restroom:ejected', { by: boss.id, washing });
}

export const RESTROOM_ROWS = {
  wash_up: {
    on: 'restroom', text: 'wash off the mustard', duration: 1.6, sneaky: false,
    can: (p) => p.inside === 'restroom' && !!p.smeared,
    done(game) {
      game.player.smeared = null;
      say(game, 'player', ['🧼', '😌'], { kind: 'thought', ttl: 1.8 });
      game.events.emit('restroom:washed', {});
    },
  },
  come_out: {
    on: 'restroom', text: 'come out', duration: 0.4, sneaky: false,
    can: (p) => p.inside === 'restroom',
    done(game) {
      comeOut(game);
    },
  },
  go_in: {
    on: 'restroom', text: 'go in', duration: 0.4, sneaky: false,
    can: (p) => !p.inside && !p.held && !p._stall && p.y < 13.5, // (not through the wall from the balcony)
    done(game) {
      goInside(game, 'restroom', DOOR);
      // With the mustard on you, E washes it before it lets you out: say so as you go in (👕🟡🧼), so the first E
      // press, filling its meter at the door, is not taken for a door that won't open.
      if (game.player.smeared) say(game, 'player', ['👕', '🟡', '🧼'], { kind: 'thought', ttl: 2.4 });
    },
  },
};
