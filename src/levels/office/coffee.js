// The office coffee pot, for levels that borrow level 1's kitchen (DESIGN.md: "A thing that looks usable is usable").
// A full pot pours a cup, as in level 1. Elsewhere the cup leads nowhere: you carry it (your hands are full while you
// do) or put it down. Level 1 keeps its own pot (interactions.js brew_coffee: the day's only cup, which Kev wants).
//
// Use it in a level:
//   items:        { coffee: COFFEE_CUP, ... }
//   interactions: { pour_coffee: pourCoffee(), ... }
//   legend:       C: { kind: 'coffee_machine', ..., interactable: 'coffee_machine' }
//   decor:        the carafe stays full ({ tile: 'C', draw: 'carafe', state: () => ({ full: true }) }): this pot is
//                 refilled all day, and the coworkers you see fetch coffee pour from it too.
import { burst } from '../../core/fx.js';

// The poured cup: drawn full and steaming. No owner, not contraband, not edible.
export const COFFEE_CUP = { icon: '☕', draw: 'cup' };

// Pour a cup into empty hands. As often as you like: each cup you put down stays where you left it.
export function pourCoffee(on = 'coffee_machine') {
  return {
    on, text: 'pour a coffee', duration: 1.0, sneaky: false,
    can: (p) => !p.held,
    done(game, a) {
      game.player.held = 'coffee';
      game.events.emit('coffee:taken', { by: 'player' });
      burst(game, 'puff', a.x, a.y, 5, { speed: 0.4, lift: 0.8, ttl: 1.0 }); // steam
    },
  };
}
