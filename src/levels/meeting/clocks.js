// The meeting's per-NPC schedule clock (level.clockFor; src/sim/npcs.js): called once per NPC per step, before
// anything else of his. Everyone reads the game clock; it's the hook where Kev keeps an eye on the cup.
//
// Kev: once he has found the pot empty (behaviours.js pourCoffee: he wants coffee), the day's last cup is on his
// mind. In your hand it's yours: he asks for it (☕🥺❓) and leaves it with you. Set down on your own desk (my_desk)
// it's yours too, and out of his way: he never goes looking for it. Set down unattended where a cup is anyone's (on the machine, on his own desk), he takes it as free:
// 🤤☕ … 😌.
//
// It also listens for the catch: caught over his keycard (holding it, or with your hand on it at the jacket), the boss
// takes it back (world.cardBack).
import { npcSees } from '../../game/perception.js';
const ASK_GAP = 20; // real seconds between Kev's asks
const ASK_RADIUS = 4; // tiles: how close the cup must be for Kev to ask for it
const TAKE_RADIUS = 3.5; // tiles: how close an unattended cup must be for Kev to spot it
const FREE_SPOTS = ['coffee', 'kev_desk']; // where a set-down cup is anyone's

export function clockFor(game, npc, sim) {
  listen(game);
  const now = game.clock.minute;
  if (npc.id === 'kev') kevAndTheCup(game, npc, sim);
  return now;
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
