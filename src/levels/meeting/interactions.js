// The meeting's player actions (level.interactions; the engine adds sit, drop and pick_up after these).
// Each row, keyed by verb:
//   on        the target that offers it: an interactable type, 'item' (a floor item) or 'self' (what is in hand)
//   icon      the ✋ hint (player.focus.icon); text: the harness's words for it
//   duration  real seconds. sneaky: witnesses matter while in progress. owner: only that NPC minds (a sandwich
//             is just a sandwich to everyone but Lin). idle: the authority reads it as slacking (his ❓ fills).
//   saw       the icon a witness's grudge bubble shows for it
//   can(p, w, item)  offered only while this holds; a timed action is cancelled ('invalid') once it stops
//   done(game, a)    the result, applied right after 'action:done'
// For one target the first possible row wins (so eat_sandwich beats the engine's drop).
import { say, burst, shake } from '../../core/fx.js';

export const INTERACTIONS = {
  brew_coffee: {
    on: 'coffee_machine', icon: '☕', text: 'pour a coffee', duration: 1.0, sneaky: false,
    can: (p, w) => !p.held && w.coffee === 'pot', // the day's only cup; Kev may get there first (2:38)
    done(game, a) {
      game.player.held = 'coffee';
      game.world.coffee = 'taken';
      game.events.emit('coffee:taken', { by: 'player' });
      burst(game, 'smoke', a.x, a.y, 5, { speed: 0.4, lift: 0.8, ttl: 1.0 }); // steam
    },
  },
  spill_coffee: {
    on: 'projector', icon: '💦', text: 'spill coffee on it', duration: 1.2, sneaky: true, saw: '📽️',
    can: (p, w) => p.held === 'coffee' && w.projector === 'ok',
    done(game, a) {
      game.player.held = null;
      game.world.projector = 'broken';
      burst(game, 'sparks', a.x, a.y, 16, { speed: 2.5, ttl: 0.6 });
      burst(game, 'smoke', a.x, a.y, 10, { speed: 0.6, lift: 0.9, ttl: 1.6 });
      shake(game, 0.12, 0.25);
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('projector:broken', {});
    },
  },
  take_keycard: {
    on: 'coat_rack', icon: '🪪', text: 'take the keycard from the jacket', duration: 1.0, sneaky: true, saw: '🪪',
    can: (p, w) => !p.held && w.keycard === 'rack', // the boss may grab his jacket mid-steal
    done(game) {
      game.player.held = 'keycard';
      game.world.keycard = 'player';
      game.events.emit('keycard:taken', {});
    },
  },
  take_sandwich: {
    on: 'fridge', icon: '🥪', text: 'take the sandwich', duration: 0.8, sneaky: true, owner: 'lin', saw: '🥪',
    can: (p, w) => !p.held && w.sandwich === 'fridge',
    done(game) {
      game.player.held = 'sandwich';
      game.world.sandwich = 'player';
      game.events.emit('sandwich:taken', {});
    },
  },
  eat_sandwich: {
    on: 'self', icon: '😋', text: 'eat the sandwich', duration: 2.0, sneaky: true, owner: 'lin', idle: true, saw: '🥪',
    can: (p) => p.held === 'sandwich',
    done(game) {
      const p = game.player;
      p.held = null;
      p.smeared = true; // the evidence is now on you
      game.world.sandwich = 'eaten';
      burst(game, 'crumbs', p.x, p.y, 12, { speed: 1.0, ttl: 0.7 });
      say(game, 'player', ['😋'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('sandwich:eaten', {});
    },
  },
};
