// The restroom (R, 25,13): one cubicle, and the map doesn't show inside it.
//   taken (the boss 3:18–3:22, Lin 3:35–3:37: their 'away restroom'): E knocks (toys.js knock_*), and whoever is in
//     there answers through the door (🚽😠 and his face).
//   free, hands empty: E goes in (play/player.js goInside: hidden, nobody sees you; pretending still runs the clock).
//     Inside, with mustard down your sweater, you think 👕🟡🧼 as you go in and E washes it off at the sink (🧼, the
//     tap runs); else E comes out (the flush). Each fills its meter on the floor at the door (render/characters.js),
//     as any action's does, though you aren't drawn. At 4:00 inside, you come out late: the table already stares at your empty chair, and you walk in
//     drying your hands (meeting.where 'restroom': end-scenes.js).
// Who is in there is kept on the player (player._stall, an NPC id or null), set every step by clocks.js: the
// interaction rows read only (player, world).
import { goInside, comeOut } from '../../play/player.js';
import { say } from '../../core/fx.js';

export const DOOR = { x: 25.5, y: 12.5 }; // where you stand at the door (map.js SPOTS.restroom), and wait inside

// The NPC in the cubicle now: away to the restroom, and through its door.
export function whoInside(game) {
  for (const n of game.npcs) if (!n.active && !n._gone && n._plan?.done && n._plan.label === 'away restroom') return n.id;
  return null;
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
    can: (p) => !p.inside && !p.held && !p._stall,
    done(game) {
      goInside(game, 'restroom', DOOR);
      // With the mustard on you, E washes it before it lets you out: say so as you go in (👕🟡🧼), so the first E
      // press, filling its meter at the door, is not taken for a door that won't open.
      if (game.player.smeared) say(game, 'player', ['👕', '🟡', '🧼'], { kind: 'thought', ttl: 2.4 });
    },
  },
};
