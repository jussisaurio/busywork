// The meeting's per-NPC schedule clock (level.clockFor; src/sim/npcs.js): called once per NPC per step, before
// anything else of his. Two NPCs use it; everyone else reads the game clock.
//
// The boss: at 3:35 he takes the lift down for a smoke (cast.js), his jacket on and, if it was still in it, the
// keycard. With the card he comes back up at 3:48 and badges in. Without it the street gate won't let him back in:
// once he has his jacket and no card, his clock jumps to his 'leave' entry (cast.js LOCKOUT_AT), the same walk to
// the lift, but out for the day. It all happens downstairs: nobody upstairs sees or hears him stuck.
//
// Kev: once he has found the pot empty (behaviours.js pourCoffee: he wants coffee), the day's last cup is on his
// mind. In your hand it's yours: he asks for it (☕🥺❓) and leaves it with you. Set down on your own desk (my_desk)
// it's yours too, and out of his way: he never goes looking for it. Set down unattended where a cup is anyone's (on the machine, on his own desk), he takes it as free:
// 🤤☕ … 😌.
//
// It also listens for the catch: caught over his keycard (holding it, or with your hand on it at the jacket), the boss
// takes it back (world.cardBack).
import { at } from '../../config.js';
import { npcSees } from '../../game/perception.js';
import { LOCKOUT_AT } from './cast.js';

const BACK_AT = at('3:48'); // the boss's return (cast.js)
const ASK_GAP = 20; // real seconds between Kev's asks
const ASK_RADIUS = 4; // tiles: how close the cup must be for Kev to ask for it
const TAKE_RADIUS = 3.5; // tiles: how close an unattended cup must be for Kev to spot it
const FREE_SPOTS = ['coffee', 'kev_desk']; // where a set-down cup is anyone's

export function clockFor(game, npc, sim) {
  listen(game);
  const now = game.clock.minute;
  if (npc.id === 'boss') return bossClock(game, npc, now);
  if (npc.id === 'kev') kevAndTheCup(game, npc, sim);
  return now;
}

function bossClock(game, npc, now) {
  if (now < at('3:35')) return now;
  const noCard = game.world.keycard !== 'boss';
  // Out for good once his jacket is on and the card isn't in it (or if 3:48 comes and he still has none).
  if (noCard && (npc._jacket || now >= BACK_AT)) return LOCKOUT_AT;
  return now >= BACK_AT ? now : at('3:35');
}

function kevAndTheCup(game, kev, sim) {
  if (kev.wants !== 'coffee' || !kev.active || kev.override || kev._gone) return;
  const w = game.world;
  const p = game.player;
  const it = w.items.find((i) => i.type === 'coffee');
  // Unattended where a cup is free to anyone: he takes it.
  if (it && FREE_SPOTS.includes(it.spot) && Math.hypot(it.x - kev.x, it.y - kev.y) <= TAKE_RADIUS && npcSees(game, kev, it.x, it.y)) {
    w.items = w.items.filter((i) => i !== it);
    kev.carry = 'coffee';
    kev.wants = null;
    kev._faceTarget = Math.atan2(it.y - kev.y, it.x - kev.x);
    sim.speak(game, kev, [{ say: ['🤤', '☕'] }, { say: ['😌'], after: 1.3 }]);
    sim.holdFor(kev, 1.4);
    game.events.emit('coffee:kevTook', { spot: it.spot });
    return;
  }
  // In your hand: yours. He asks, now and then. (On your desk he leaves it be: a man doesn't rummage your desk.)
  if (p.held !== 'coffee') return;
  const cup = { x: p.x, y: p.y };
  if (kev._askedAt != null && game.loopTime - kev._askedAt < ASK_GAP) return;
  if (Math.hypot(cup.x - kev.x, cup.y - kev.y) > ASK_RADIUS || !npcSees(game, kev, cup.x, cup.y)) return;
  kev._askedAt = game.loopTime;
  kev._faceTarget = Math.atan2(cup.y - kev.y, cup.x - kev.x);
  sim.speak(game, kev, [{ say: ['☕', '🥺', '❓'], ttl: 1.6 }]);
  sim.holdFor(kev, 1.6);
  game.events.emit('coffee:asked', {});
}

// Caught over his keycard: with it in your hand, or with your hand on it (Lin's shout stops the take at the jacket).
// Either way he takes it back, onto his pocket, and the end card shows it there.
const listening = new WeakSet();
function listen(game) {
  if (listening.has(game.events)) return;
  listening.add(game.events);
  game.events.on('action:cancel', (e) => {
    if (game.level?.id === 'meeting' && e?.type === 'take_keycard') game.world._cardTry = game.loopTime;
  });
  game.events.on('caught', () => {
    if (game.level?.id !== 'meeting') return;
    const reaching = game.world._cardTry != null && game.loopTime - game.world._cardTry < 10;
    if (game.player.held !== 'keycard' && !reaching) return;
    if (game.player.held === 'keycard') game.player.held = null;
    game.world.keycard = 'boss';
    game.world.cardBack = true;
    game.events.emit('keycard:takenBack', {});
  });
}
