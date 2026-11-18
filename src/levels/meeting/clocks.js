// The meeting's per-NPC schedule clock (level.clockFor; src/sim/npcs.js): called once per NPC per step, before
// anything else of his. Everyone reads the game clock; it's the hook where Kev keeps an eye on the cup.
//
// Kev: once he has found the pot empty (behaviours.js pourCoffee: he wants coffee), the day's last cup is on his
// mind. In your hand it's yours: he asks for it (☕🥺❓) and leaves it with you. Held to your ear (pretending), it
// half works: he squints at it (☕❓), and if you keep up the act he decides you're on the phone (📱🤷) and lets you
// be; drop the act while he squints and he sees a cup, and asks. Set down on your own desk (my_desk)
// it's yours too, and out of his way: he never goes looking for it. Set down unattended where a cup is anyone's (on the machine, on his own desk), he takes it as free:
// 🤤☕ … 😌.
//
// The boss let back in through the fire door (interactions.js let_boss_in; override 'grateful', off duty): he comes
// through the door overjoyed and hugs you (🤗, 🙏😊). Over your shoulder he sees his own keycard in your hand: 🪪❗,
// caught (outcome.why 'samaritan': he locks you out on the balcony, end-scenes.js). Without it he lets go, grateful
// (world.samaritan: at 4:00 he has his arm round you, and you still have no slides; verdict.js).
//
// It also listens for the catch: caught over his keycard (holding it, or with your hand on it at the jacket), the boss
// takes it back (world.cardBack).
import { npcSees } from '../../game/perception.js';
import { startClaim } from '../../sim/mechanics/claim.js';
import { endOverride } from '../../sim/override.js';
import { catchNow } from '../../play/rules.js';
import { whoInside } from './restroom.js';
const ASK_GAP = 20; // real seconds between Kev's asks
const ASK_RADIUS = 4; // tiles: how close the cup must be for Kev to ask for it
const TAKE_RADIUS = 3.5; // tiles: how close an unattended cup must be for Kev to spot it
const FREE_SPOTS = ['coffee', 'kev_desk']; // where a set-down cup is anyone's
const SQUINT = 1.5; // real seconds Kev squints at a cup held to your ear before he makes up his mind
const HUG_REACH = 1.15; // tiles: how close he comes before he throws his arms round you
const HUG = 2.6; // real seconds of hug before he lets go (or sees the card)
const HUG_WAIT = 12; // real seconds after the door: if he never reaches you, he gives up looking for you

export function clockFor(game, npc, sim) {
  listen(game);
  game.player._stall = whoInside(game); // the restroom's rows read it (restroom.js)
  const now = game.clock.minute;
  if (npc.id === 'kev') kevAndTheCup(game, npc, sim);
  if (npc.id === 'boss' && (npc.override === 'grateful' || inHug(game.world))) bossLetIn(game, npc, sim); // (the gather may come mid-hug)
  return now;
}

const inHug = (w) => w.letIn != null && !w.hugDone; // let in, not let go yet (whatever the gather says)

function bossLetIn(game, boss, sim) {
  const w = game.world;
  const p = game.player;
  if (w.hugAt == null) {
    const near = Math.hypot(p.x - boss.x, p.y - boss.y) <= HUG_REACH;
    if (!near && game.loopTime - w.letIn < HUG_WAIT) return;
    if (!near) { // you walked off: he goes back to his day
      w.hugDone = true;
      if (boss.override === 'grateful') endOverride(boss);
      return;
    }
    w.hugAt = game.loopTime;
    boss._faceTarget = Math.atan2(p.y - boss.y, p.x - boss.x);
    sim.holdFor(boss, HUG + 0.4);
    sim.speak(game, boss, [{ say: ['🤗'], ttl: 1.2 }, { say: ['🙏', '😊'], after: 1.3, ttl: 1.2 }]);
    game.events.emit('boss:hug', {});
    return;
  }
  if (game.loopTime - w.hugAt < HUG) return;
  w.hugDone = true;
  if (p.held === 'keycard') {
    if (boss.override === 'grateful') endOverride(boss);
    catchNow(game, 'contraband', 'boss', ['🪪', '❗', '👉', '@player'], 'samaritan');
    return;
  }
  w.samaritan = true;
  if (boss.override === 'grateful') endOverride(boss);
}

function kevAndTheCup(game, kev, sim) {
  if (kev.wants !== 'coffee' || !kev.active || kev.override || kev._gone) { kev._squintAt = null; return; }
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
  if (p.held !== 'coffee') { kev._squintAt = null; return; }
  const cup = { x: p.x, y: p.y };
  // Mid-squint at a cup held to your ear: still at it when he's done squinting, it's a call; dropped, it's a cup.
  if (kev._squintAt != null) {
    if (game.loopTime - kev._squintAt < SQUINT) return;
    kev._squintAt = null;
    if (p.busyPose === 'phone') {
      kev._askedAt = game.loopTime;
      sim.speak(game, kev, [{ say: ['📱', '🤷'], ttl: 1.4 }]);
      sim.holdFor(kev, 1.2);
      game.events.emit('coffee:shrug', {});
      return;
    }
    kev._askedAt = null; // ask now, if he still sees it
  }
  if (kev._askedAt != null && game.loopTime - kev._askedAt < ASK_GAP) return;
  if (kev._sayQ?.length || game.fx.bubbles.some((b) => b.owner === kev.id && !b.toy && b.age < 0.9)) return; // let his last line (😩 at the empty pot) land first
  if (Math.hypot(cup.x - kev.x, cup.y - kev.y) > ASK_RADIUS || !npcSees(game, kev, cup.x, cup.y)) return;
  kev._faceTarget = Math.atan2(cup.y - kev.y, cup.x - kev.x);
  if (p.busyPose === 'phone') { // the cup at your ear (pretending, standing): is that... a phone?
    kev._squintAt = game.loopTime;
    kev._craveT = Math.max(kev._craveT ?? 0, SQUINT + 2); // no yawn (npcs.js crave) over the squint and the shrug
    sim.speak(game, kev, [{ say: ['☕', '❓'], ttl: SQUINT }]);
    sim.holdFor(kev, SQUINT + 0.2);
    game.events.emit('coffee:squint', {});
    return;
  }
  kev._askedAt = game.loopTime;
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
  const takeBack = () => {
    if (game.player.held === 'keycard') game.player.held = null;
    game.world.keycard = 'boss';
    game.world.cardBack = true;
    game.events.emit('keycard:takenBack', {});
  };
  // He walks over for it (sim/mechanics/claim.js; the catch's beat waits for him), unless he is at arm's length.
  game.events.on('caught', (e) => {
    if (game.level?.id !== 'meeting') return;
    const reaching = game.world._cardTry != null && game.loopTime - game.world._cardTry < 10;
    if (game.player.held !== 'keycard' && !reaching) return;
    const boss = game.npcs.find((n) => n.id === 'boss');
    if (boss && e?.by === 'boss' && !e?.via && startClaim(game, boss, 'keycard', { onCatch: true, any: true })) return;
    takeBack();
  });
  game.events.on('claim:done', (e) => {
    if (game.level?.id === 'meeting' && e.item === 'keycard') takeBack();
  });
  // Caught over the mustard (hunting Lin saw it on you and told: roles.js evidence): outcome.why 'bib', its own end
  // scene (end-scenes-combo.js tableauBib: you type in a giant paper bib while Lin eats a fresh sandwich at your elbow).
  game.events.on('caught', (e) => {
    if (game.level?.id === 'meeting' && e?.reason === 'evidence' && game.caught && !game.caught.why) game.caught.why = 'bib';
  });
}
