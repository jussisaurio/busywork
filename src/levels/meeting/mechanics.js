// The meeting's NPC mechanics: the engine's generic lure, hunt and door (src/sim/mechanics/*, where each field is
// documented) set up as Kev's projector repair, Lin's sandwich hunt, the boss's hunt for the cup and the fire door
// that locks him out on the balcony.
// Order is behaviour: the sim checks each list in this order.

import { at } from '../../config.js';
import { npcSees } from '../../game/perception.js';
import { speak } from '../../sim/override.js';
import { bossBadgedIn } from './balcony.js';

const SEES_CUP = 3.5; // tiles: how close the hunting boss must be to spot the cup on a desk or the machine

// The hunting boss spots the cup where it lies (not in your hand: that's the rules' business, items.js; not on your
// desk: that's put down's, and he catches you). On Kev's desk: Kev did it. On the machine: back where it belongs.
// Not while you stand beside it: then it's anybody's guess whose it is, and he keeps looking.
const NEAR_CUP = 2.5; // tiles
// On his own desk he never looks (his hunt doesn't go there; verdict.js verdictDesks); on Lin's: Lin did it.
function cupFound(game, npc) {
  const it = game.world.items.find((i) => i.type === 'mug');
  if (!it || it.spot === 'my_desk' || it.spot === 'boss_desk') return false;
  const p = game.player;
  if (Math.hypot(it.x - p.x, it.y - p.y) < NEAR_CUP) return false;
  if (Math.hypot(it.x - npc.x, it.y - npc.y) > SEES_CUP || !npcSees(game, npc, it.x, it.y)) return false;
  const who = { kev_desk: '@kev', lin_desk: '@lin' }[it.spot];
  speak(game, npc, who ? [{ say: ['☕', '❗'], kind: 'alert' }, { say: ['😠', who], after: 1.2 }] : [{ say: ['☕', '🤷'] }]);
  game.events.emit('mug:found', { spot: it.spot });
  return true;
}

// Lures (level.lures): a world condition pulls an NPC over to deal with it.
export const LURES = [
  { // Kev repairs a broken projector whenever he is on the floor (even walking out to the elevator: he turns back).
    npc: 'kev',
    when: (w) => w.projector === 'broken',
    override: 'alerted',
    plan: 'fix',
    label: 'fix projector',
    spot: 'projector',
    react: { wait: 0.4, says: [{ say: ['🔧', '❗'], kind: 'alert' }], event: 'kev:alerted' },
    work: {
      override: 'fixing',
      minutes: 5, // game minutes to repair it
      progress: 'fixProgress',
      start: { set: { projector: 'fixing' }, event: 'projector:fixing' },
      done: { set: { projector: 'ok' }, event: 'projector:fixed', says: [{ say: ['👍'] }] },
    },
  },
];

// Hunts (level.hunts): an NPC searches for something until she finds it or gives up. Started by a behaviour hook
// (behaviours.js: Lin finding the fridge empty; the boss looking in on a dead projector).
export const HUNTS = [
  { // Lin walks the kitchen and the open office looking for her sandwich.
    npc: 'lin',
    override: 'hunting',
    plan: 'hunt',
    label: 'hunt sandwich',
    route: 'lin_hunt',
    look: { angle: 1.25, time: 1.4 }, // ~72 deg each side: right, left, back
    start: {
      event: 'sandwich:missing',
      says: [{ say: ['🥪', '❓'], kind: 'thought', ttl: 1.4 }, { say: ['😠'], after: 1.4 }],
      wait: 1.8, // standing at the empty fridge
    },
    until: at('3:24'), // covers the boss's restroom walk
    // She has it back, or she saw the mustard on you and knows who ate it.
    found: (game) => game.world.sandwich === 'lin' || game.world.linKnows,
    end: { says: [{ say: ['😤'] }] },
  },
  { // The boss, having seen the projector (behaviours.js peek), looks for the cup the coffee came from.
    npc: 'boss',
    override: 'hunting',
    plan: 'mughunt',
    label: 'hunt mug',
    route: 'mug_hunt',
    look: { angle: 1.1, time: 1.2 },
    start: {
      event: 'boss:mugHunt',
      says: [{ say: ['📽️', '💥'], kind: 'thought', ttl: 1.3 }, { say: ['☕', '❓'], kind: 'thought', after: 1.3, ttl: 1.4 }],
      wait: 2.4, // staring in at the sparks
    },
    until: at('3:34'), // gives up in time for his smoke
    found: cupFound,
  },
];

// Doors (level.doors): listed NPCs coming in from `zone` must open it, or they're shut out for the day.
// The fire door onto the smokers' balcony, at the far end past the toilets: it swings shut and locks behind you, and
// from outside only a keycard opens it. Nobody sits down that end since Kev went home, and Lin's at the other end:
// only you hear him.
const KNOCK = [0.05, 0.15];
const BANG = [0.12, 0.25];
const POUND = [0.2, 0.32];
export const DOORS = [
  {
    spot: 'fire_door',
    zone: 'outside',
    npcs: ['boss'],
    // His card from his jacket on the reader: a beep, and he's back in. (The player sees what the card is for.)
    // Or you held it open for him from inside (interactions.js let_boss_in): it stays open until he's through and
    // has hugged you (clocks.js bossLetIn), even if the gather replans him on the way.
    opens(game, npc) {
      if (game.world.letIn != null && !game.world.hugDone) return true;
      if (game.world.keycard !== npc.id) return false;
      speak(game, npc, [{ say: ['🪪'], kind: 'thought', ttl: 0.9 }]);
      npc._badgeAt = game.loopTime; // the reader's green blink (decor.js)
      bossBadgedIn(game, npc); // the door swings; with you out there he holds it for you (balcony.js)
      game.events.emit('boss:badge', {});
      return true;
    },
    override: 'lockedOut',
    plan: 'lockout',
    label: 'locked out',
    locked: { set: { bossLockedOut: true }, event: 'boss:lockedOut' },
    // The escalation: pockets, a polite knock, a bang, both fists, a fuming cigarette, begging. Then round again from
    // the bang: he never goes back to polite. arms: his pose for the line (poses.js POSES; default fists on the door).
    bang: {
      first: 0.7,
      lines: [
        { say: ['🪪', '❓'], kind: 'thought', ttl: 1.6, next: 2.0, arms: 'shrug', event: 'boss:pockets', shake: null }, // pats his pockets
        { say: ['✊', '🚪'], ttl: 1.6, next: 2.2, event: 'boss:knock', shake: KNOCK }, // knock knock
        { say: ['😠', '🚪', '🪪'], kind: 'alert', ttl: 1.6, next: 2.4, shake: BANG },
        { say: ['👊', '👊', '🚪'], kind: 'alert', ttl: 1.6, next: 2.6, event: 'boss:pound', shake: POUND },
        { say: ['🚬', '😤'], ttl: 1.6, next: 2.8, arms: 'puff', event: 'boss:fume', shake: null }, // lights another, fuming
        { say: ['🙏', '🚪'], ttl: 1.6, next: 2.4, event: 'boss:knock', shake: KNOCK }, // please?
      ],
      loopFrom: 2,
      event: 'boss:bang',
    },
  },
];
