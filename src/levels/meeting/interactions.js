// The meeting's player actions (level.interactions). The engine adds, after these, eat_sandwich (the sandwich is
// edible, items.js) and the generic sit, drop, pick_up and put (the empty mug: on the coffee machine, Kev's desk or
// your own; map.js SPOTS).
// Each row, keyed by verb:
//   on        the target that offers it: an interactable type, 'item' (a floor item) or 'self' (what is in hand)
//   text      the harness's words for it. No icon: the target lights up with the E key cap (DESIGN.md
//             "Visual language" rule 4)
//   duration  real seconds. sneaky: witnesses matter while in progress. owner: only that NPC minds (a sandwich
//             is just a sandwich to everyone but Lin). idle: the authority reads it as slacking (his ❓ fills).
//   saw       the icon a witness's grudge bubble shows for it
//   pose, held  optional, a timed row on a target: the player's arm pose while doing it (render/characters.js
//             ARM_POSES; default 'reach') and the glyph in that hand ('#name': a level thing), e.g. 'phone' and a
//             receiver while she is on a line
//   instant   (instead of duration) done at once, never seen in progress. noise: { radius, at?, npcs? } a noise
//             when done (sim/mechanics/attention.js)
//   can(p, w, item)  offered only while this holds; a timed action is cancelled ('invalid') once it stops
//   done(game, a)    the result, applied right after 'action:done'
// For one target the first possible row wins.
import { say, burst, shake } from '../../core/fx.js';
import { findNpc, inZone } from '../../game/perception.js';
import { setOverride } from '../../sim/override.js';
import { leaving } from '../../sim/npcs.js';
import { leaveDay } from '../../play/scenario.js';
import { catchNow } from '../../play/rules.js';
import { RESTROOM_ROWS } from './restroom.js';
import { BALCONY_ROWS, openDoor } from './balcony.js';

// Out through the entrance (L, 4,13) and across the lobby to the elevator (E): tile units, straight legs.
const HOME_PATH = [{ x: 4.5, y: 12.5 }, { x: 4.5, y: 14.5 }, { x: 2.5, y: 15.5 }];
const WITH_KEV = 6; // tiles: Kev on his way out (3:00) this close, and you leave together

export const INTERACTIONS = {
  brew_coffee: {
    on: 'coffee_machine', text: 'pour a coffee', duration: 1.0, sneaky: false,
    can: (p, w) => !p.held && w.coffee === 'pot', // the day's only cup; Kev may get there first (2:38)
    done(game, a) {
      game.player.held = 'coffee';
      game.world.coffee = 'taken';
      game.events.emit('coffee:taken', { by: 'player' });
      burst(game, 'puff', a.x, a.y, 5, { speed: 0.4, lift: 0.8, ttl: 1.0 }); // steam
    },
  },
  spill_coffee: {
    on: 'projector', text: 'spill coffee on it', duration: 1.2, sneaky: true, saw: '📽️',
    can: (p, w) => p.held === 'coffee' && w.projector === 'ok',
    done(game, a) {
      game.player.held = 'mug'; // the cup stays in your hand, empty: the evidence (items.js)
      game.world.mug = 'player';
      game.world.projector = 'broken';
      burst(game, 'sparks', a.x, a.y, 16, { speed: 2.5, ttl: 0.6 });
      burst(game, 'puff', a.x, a.y, 10, { speed: 0.6, lift: 0.9, ttl: 1.6 });
      shake(game, 0.12, 0.25);
      say(game, 'player', ['😇'], { kind: 'thought', ttl: 1.5 });
      game.events.emit('projector:broken', {});
    },
  },
  take_keycard: {
    on: 'coat_rack', text: 'take the keycard from the jacket', duration: 1.0, sneaky: true, saw: '🪪',
    can: (p, w) => !p.held && w.keycard === 'rack', // the boss may grab his jacket mid-steal
    done(game) {
      game.player.held = 'keycard';
      game.world.keycard = 'player';
      game.events.emit('keycard:taken', {});
    },
  },
  // The Good Samaritan: he's been pounding on the fire door, so you push the bar and let him in. It undoes the
  // lock-out (no keycard win today), and he is so glad he hugs you (clocks.js bossLetIn), and sees what's in your hand.
  let_boss_in: {
    on: 'fire_door', text: 'let the boss in', duration: 0.6, sneaky: false,
    can: (p, w) => w.bossLockedOut,
    done(game) {
      const w = game.world;
      const boss = findNpc(game, 'boss');
      w.bossLockedOut = false;
      w.letIn = game.loopTime;
      openDoor(game, 2.4); // wide, until he's through (balcony.js doorClock)
      if (boss) {
        boss._bangLine = null;
        setOverride(boss, 'grateful'); // off duty (roles.js); no mechanic owns it, so he walks his day: in through the door
      }
      game.events.emit('boss:letIn', {});
    },
  },
  ...BALCONY_ROWS, // out onto the balcony and back in (balcony.js): after let_boss_in, which the same push is while he pounds
  // Just go home. Any time: you walk out to the elevator, and you lose (scenario.js leaveDay; outcome.why 'home', the
  // bus with your phone buzzing, end-scenes.js). With Kev on his way out at 3:00 you ride down together, both waving
  // 👋 (why 'homeKev').
  go_home: {
    on: 'exit', text: 'go home', duration: 0.5, sneaky: false,
    can: () => true,
    done(game) {
      const p = game.player;
      const kev = findNpc(game, 'kev');
      const withKev = !!kev && leaving(kev) && Math.hypot(kev.x - p.x, kev.y - p.y) <= WITH_KEV;
      if (!leaveDay(game, withKev ? 'homeKev' : 'home', HOME_PATH)) return;
      say(game, 'player', withKev ? ['👋'] : ['😌'], { kind: withKev ? 'speech' : 'thought', ttl: 1.8 });
      if (withKev) say(game, 'kev', ['👋', '😄'], { kind: 'speech', ttl: 1.8 });
    },
  },
  ...RESTROOM_ROWS, // the cubicle: go in, wash off the mustard, come out (restroom.js)
  take_sandwich: {
    on: 'fridge', text: 'take the sandwich', duration: 0.8, sneaky: true, owner: 'lin', saw: '🥪',
    can: (p, w) => !p.held && w.sandwich === 'fridge',
    done(game) {
      game.player.held = 'sandwich';
      game.world.sandwich = 'player';
      game.events.emit('sandwich:taken', {});
    },
  },
  // ---- More places for the coffee (the day's only cup; brew_coffee). Each one spends it: no projector today.
  // The boss's ficus (map.js Y), from his doorway: the soil drinks it, a new leaf shoots out (painters-more.js ficus)
  // and on his next look at it the boss is delighted (toys.js ficus). You are left with nothing in your hands.
  water_ficus: waterPlant('ficus'),
  // The hallway ficus (map.js V), the same pour and the same leaf. Nobody minds it.
  water_plant: waterPlant('plant'),
  // The typewriter on the empty desk behind yours (map.js W): the cup goes into its keys. It shorts with a bang and
  // a shower of sparks that the whole floor hears: the boss, anywhere on it, knows exactly who (caught, why
  // 'typewriter'). He has to be on the floor to hear it: locked out on the balcony or off the floor, it just dies.
  drown_typewriter: {
    on: 'typewriter', text: 'pour the coffee into the typewriter', duration: 1.0, sneaky: true, saw: '☕', pose: 'reach',
    can: (p) => p.held === 'coffee',
    done(game, a) {
      game.player.held = null;
      game.world.cup = 'typewriter';
      game.world._typewriterAt = game.loopTime;
      burst(game, 'sparks', a.x, a.y - 0.2, 14, { speed: 2.2, ttl: 0.7 });
      burst(game, 'puff', a.x, a.y - 0.3, 6, { speed: 0.4, lift: 1.0, ttl: 1.6 });
      shake(game, 0.35, 0.4);
      game.events.emit('coffee:typewriter', {});
      const boss = findNpc(game, 'boss');
      const onFloor = boss && boss.active && boss.override !== 'lockedOut' && !inZone(game, 'outside', boss.x, boss.y);
      if (onFloor) catchNow(game, 'action', boss.id, ['⌨️', '💥', '👉', '@player'], 'typewriter');
      else say(game, 'player', ['⌨️', '💀'], { kind: 'thought', ttl: 1.6 });
    },
  },
};

// Pouring the day's cup into a potted plant (`on`: its interactable, ficus or plant): world.cup = on, and
// world._<on>At the moment (painters-more.js ficus draws the leaf from it).
function waterPlant(on) {
  return {
    on, text: 'pour the coffee into the plant', duration: 1.0, sneaky: false, pose: 'reach',
    can: (p) => p.held === 'coffee',
    done(game, a) {
      game.player.held = null;
      game.world.cup = on; // where the day's cup went (unset until then: no golden moves for a day without it)
      game.world[`_${on}At`] = game.loopTime;
      burst(game, 'puff', a.x, a.y - 0.3, 6, { speed: 0.5, lift: 0.9, ttl: 1.0 });
      say(game, 'player', ['🌱'], { kind: 'thought', ttl: 1.4 });
      game.events.emit(`coffee:${on}`, {});
    },
  };
}
