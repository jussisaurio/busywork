// Lights Out's words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
import { isDark } from '../../game/darkness.js';

const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;

const LETTER = { tray: 'in his tray 📨', player: 'in your hand', dropped: 'on the floor', boss: "in the boss's pocket", eaten: 'eaten' };

export default {
  mission: "MISSION: 3:00 PM. 🔌 Your angry resignation letter is in the boss's tray. Get it back.",

  landmarks: {
    boss_desk: 'boss_desk',
    desk_side: 'desk_side',
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    boss_office_door: 'boss_door',
    microwave: 'microwave',
    kitchen_table: 'kitchen_table',
    restroom_door: 'restroom',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'fuse:tripped', 'boss:dark', 'kev:fuse', 'fuse:fixed', 'switch:fixed', 'letter:recovered'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : outside lobby, L entrance, Y the boss's tray,",
    '     S his office light switch, X the fuse box, M microwave, F fridge, P your desk, R restroom, E elevator, i item,',
    '     @ you, b boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (he emptied his tray and your letter wasn't in it: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (you have the letter, via ${o.routes.join(' + ')}, but you weren't at your desk when he looked up)`
    : 'FAIL: the boss emptied his tray and read your letter ✉️😠'),

  playerText(game) {
    const p = game.player;
    const bits = [];
    if (game.level.darkness && isDark(game, p.x, p.y)) bits.push('standing in the dark');
    if (p.switched) bits.push('you flipped his light switch');
    if (p.smeared) bits.push('ink on your chin');
    return bits;
  },

  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    const w = game.world;
    if (w.fuse !== 'on') bits.push('holding up a phone torch 📱');
    if (n.override === 'dark') bits.push('feeling his way to the light switch');
    if (n.override === 'groping') bits.push(`groping for the light switch ${Math.round(w.gropeProgress * 100)}%`);
    if (n.override === 'fuse') bits.push('on his way to the fuse box');
    if (n.override === 'fixing') bits.push(`resetting the fuse ${Math.round(w.fixProgress * 100)}%`);
    return bits;
  },

  worldText(game) {
    const w = game.world;
    const lights = w.fuse !== 'on' ? 'the whole floor is dark (the fuse is out) except near the glass entrance'
      : w.officeLight !== 'on' ? "the boss's office is dark; the rest of the floor is lit" : 'all the lights are on';
    const floor = w.items.length ? `; on the floor: ${w.items.map((i) => i.type).join(', ')}` : '';
    return `WORLD: ${lights}; your letter is ${LETTER[w.letter] ?? w.letter}${floor}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to the boss 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you ❗👉${p.heard ? ' (the boss heard)' : ''}`;
      case 'meeting:gather': return 'the boss sits down to empty his tray 📥';
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'switch:off': return "clack: the boss's office goes dark 💡";
      case 'switch:on': return "clack: the boss's office light is back on 💡";
      case 'boss:dark': return 'the boss: 💡❓ He gets up to find the switch';
      case 'switch:groping': return 'the boss gropes along the wall for the switch';
      case 'switch:fixed': return "the boss finds the switch: his office light is back on 💡";
      case 'fuse:tripped': return "Lin's microwave: ♨️💥 the fuse trips and the whole floor goes dark. Out come the phone torches 📱";
      case 'fuse:pulled': return 'you pulled the main breaker: the whole floor goes dark. Out come the phone torches 📱';
      case 'kev:fuse': return 'Kev: 🔌❓ He heads for the fuse box with his phone torch';
      case 'fuse:fixing': return 'Kev is at the fuse box';
      case 'fuse:fixed': return 'Kev resets the fuse: the lights are back on 💡';
      case 'letter:taken': return 'you took your letter back ✉️';
      case 'letter:snatched': return null;
      case 'letter:eaten': return 'you ate your resignation letter';
      case 'letter:recovered': return 'the boss picks your letter up off the floor ✉️❗';
      default: return undefined;
    }
  },
};
