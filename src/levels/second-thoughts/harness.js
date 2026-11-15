// Second Thoughts' words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
import { isDark } from '../../game/darkness.js';

const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;

const MACHINE = { brewing: ' is brewing (its green lamp blinking)', brewed: ' has brewed (green lamp, the pot full and steaming)', shorted: ' is scorched (it shorted)', cold: ' is off' };
const LETTER = { tray: 'in his tray 📥', player: 'in your hand', dropped: 'on the floor', boss: "in the boss's pocket", eaten: 'eaten', drawer: 'in your desk drawer' };

export default {
  mission: "MISSION: 3:00 PM. Your angry resignation letter is in the boss's tray. He goes through his tray at 3:40.",

  landmarks: {
    boss_desk: 'boss_desk',
    desk_side: 'desk_side',
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    boss_office_door: 'boss_door',
    coffee_machine: 'coffee_machine',
    kitchen_table: 'kitchen_table',
    restroom_door: 'restroom',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'coffee:flicker', 'coffee:shorted', 'fuse:tripped', 'boss:dark', 'kev:fuse', 'fuse:fixed', 'switch:fixed', 'letter:recovered'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : outside lobby, L entrance, Y the boss's tray,",
    '     S his office light switch, X the fuse box, M coffee machine, F fridge, P your desk, R restroom, E elevator, i item,',
    '     @ you, b boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (he went through his tray and your letter wasn't in it: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (you have the letter, via ${o.routes.join(' + ')}, but you weren't at your desk when he looked up)`
    : 'FAIL: the boss went through his tray and read your letter ✉️😠'),

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
    if (game.level.darkness.torch.when(n, w)) bits.push('holding up a phone torch 📱');
    if (n.id === 'boss' && w.bossAct === 'sigh') bits.push('looking at his tray and sighing 😮‍💨');
    if (n.id === 'boss' && w.bossAct === 'drum') bits.push('drumming his fingers on his desk');
    if (n.id === 'boss' && w.bossAct === 'clock') bits.push('checking his desk clock');
    if (n.id === 'boss' && w.pullAt !== null && !w.trayRead) bits.push('dragging his tray over');
    if (n.override === 'dark') bits.push('walking his torch over to the light switch');
    if (n.override === 'switching') bits.push(`at the light switch, the tubes blinking ${Math.round(w.switchProgress * 100)}%`);
    if (n.override === 'fuse') bits.push('on his way to the fuse box');
    if (n.override === 'fixing') bits.push(`resetting the fuse ${Math.round(w.fixProgress * 100)}%`);
    return bits;
  },

  worldText(game) {
    const w = game.world;
    const lights = w.fuse !== 'on' ? 'the whole floor is dark (the fuse is out) except near the glass entrance'
      : w.officeLight === 'starting' ? "the boss's office tubes are blinking back on; the rest of the floor is lit"
      : w.officeLight !== 'on' ? "the boss's office is dark; the rest of the floor is lit" : 'all the lights are on';
    const floor = w.items.length ? `; on the floor: ${w.items.map((i) => i.type).join(', ')}` : '';
    const machine = MACHINE[w.coffee] ?? '';
    const jug = w.rigged ? 'the water jug lies tipped over it, water down its front and a puddle in front' : 'a full water jug stands beside it';
    return `WORLD: ${lights}; your letter is ${LETTER[w.letter] ?? w.letter}${floor}; the coffee machine${machine}: ${jug}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to the boss 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you ❗👉${p.heard ? ' (the boss heard)' : ''}`;
      case 'meeting:gather': return 'the boss sits down to go through his tray 📥';
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'switch:off': return "clack: the boss's office goes dark 💡";
      case 'switch:on': return "clack: the boss's office light is back on 💡";
      case 'boss:dark': return 'the boss: ❓ He holds up his phone torch 📱 and gets up for the switch';
      case 'switch:starting': return 'the boss flips his switch back on: the tubes blink';
      case 'switch:fixed': return "the boss's office tubes catch: his light is back on 💡 (😠)";
      case 'coffee:rigged': return 'you tip the water jug over the coffee machine 💦: water runs down its front onto the floor';
      case 'coffee:flicker': return 'Lin switches on the coffee machine: the lights flicker (😳), Kev glances down the hall at the fuse box, and the lights steady. It brews';
      case 'coffee:shorted': return 'Lin switches on the soaked coffee machine: it shorts, sparks and smoke (😳), and a spark runs down the wiring toward the fuse box';
      case 'fuse:tripped': return "the spark reaches the fuse box: its door flies open and the whole floor goes dark. Out come the phone torches 📱";
      case 'fuse:pulled': return 'you pulled the main breaker: the whole floor goes dark. Out come the phone torches 📱';
      case 'kev:fuse': return 'Kev: ❓ He heads for the fuse box with his phone torch';
      case 'fuse:fixing': return 'Kev is at the fuse box';
      case 'fuse:fixed': return 'Kev resets the fuse: the lights are back on 💡';
      case 'boss:sigh': return null;
      case 'boss:checksClock': return null;
      case 'boss:chime': return "the boss's desk clock chimes 3:39 🔔";
      case 'boss:pullsTray': return 'the boss sighs 😮‍💨 and drags his tray over';
      case 'letter:taken': return 'you took your letter back ✉️';
      case 'letter:snatched': return null;
      case 'letter:eaten': return 'you ate your resignation letter';
      case 'letter:stashed': return 'you put your letter in your desk drawer and sit down';
      case 'letter:recovered': return 'the boss picks your letter up off the floor ✉️❗';
      default: return undefined;
    }
  },
};
