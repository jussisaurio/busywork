// Second Thoughts' words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
import { isDark } from '../../game/darkness.js';

const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;

const MACHINE = { brewing: ' is brewing (its green lamp blinking)', brewed: ' has brewed (green lamp, the pot full and steaming)', shorted: ' is scorched (it shorted)', cold: ' is off' };
const LETTER = { tray: 'in his tray 📥', player: 'in your hand', dropped: 'on the floor', boss: "in the boss's pocket", eaten: 'eaten (in your stomach)', drawer: 'in your desk drawer', puddle: 'in your sick on the floor', binned: 'in the bin, wiped up with the paper towels' };

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
    lighting_panel: 'office_switch',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'coffee:flicker', 'coffee:shorted', 'fuse:tripped', 'boss:dark', 'boss:blackout', 'kev:fuse', 'fuse:fixed', 'switch:fixed', 'letter:recovered', 'player:sick', 'inspect:start'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : outside lobby, L entrance, Y the boss's tray,",
    '     S the lighting panel (unlabelled switches, one of them his office lights), X the fuse box, M coffee machine, F fridge, P your desk, R restroom, E elevator, i item,',
    '     @ you, b boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (he went through his tray and your letter wasn't in it: ${o.routes.join(' + ')})`
    : o.result === 'caught' && o.why === 'soggy' ? 'CAUGHT: the boss came to see what the retching was and knew his envelope in your sick ✉️😠'
    : o.result === 'caught' ? 'CAUGHT by the boss 😠'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (you have the letter, via ${o.routes.join(' + ')}, but you weren't at your desk when he looked up)`
    : 'FAIL: the boss went through his tray and read your letter ✉️😠'),

  playerText(game) {
    const p = game.player;
    const bits = [];
    if (game.level.darkness && isDark(game, p.x, p.y)) bits.push('standing in the dark');
    if (p.switched) bits.push("you switched the lights off (he'd know it was you if he found you here)");
    const w = game.world;
    if (w.queasy && !w.sick) bits.push('your face has gone green 🤢');
    else if (w.sick) bits.push('you threw up 🤢');
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
    if (n.override === 'dark') bits.push('on his way out to the lighting panel in the hallway');
    if (n.override === 'blackout') bits.push('on his way out to the fuse box with his phone torch');
    if (n.override === 'waiting') bits.push('at the fuse box, holding his phone torch on it, waiting for Kev');
    if (n.override === 'switching') bits.push(`at the lighting panel, trying its unlabelled switches, his office tubes blinking ${Math.round(w.switchProgress * 100)}%`);
    if (n.override === 'retch') bits.push('coming over to see what the retching was');
    if (n.override === 'smoke') bits.push('on his way to the smoking coffee machine');
    if (n.override === 'unplugging') bits.push(`unplugging the coffee machine ${Math.round(w.unplugProgress * 100)}%`);
    if (n.override === 'fuse') bits.push('on his way to the fuse box');
    if (n.override === 'fixing') bits.push(`looking through the unlabelled breakers by phone light ${Math.round(w.fixProgress * 100)}%`);
    if (n.override === 'towels') bits.push('going for the paper towels in the kitchen');
    if (n.override === 'tearing') bits.push('tearing off paper towels');
    if (n.override === 'mopping') bits.push('coming to wipe up your sick');
    if (n.override === 'wiping') bits.push(`wiping up your sick ${Math.round(w.wipeProgress * 100)}%`);
    return bits;
  },

  worldText(game) {
    const w = game.world;
    const lights = w.fuse !== 'on' ? 'the whole floor is dark (the fuse is out) except near the glass entrance'
      : w.officeLight === 'starting' ? "the boss's office tubes are blinking back on; the rest of the floor is lit"
      : w.officeLight !== 'on' ? "the boss's office is dark; the rest of the floor is lit" : 'all the lights are on';
    const floor = w.items.length ? `; on the floor: ${w.items.map((i) => i.type).join(', ')}` : '';
    const machine = MACHINE[w.coffee] ?? '';
    const jug = w.rigged ? 'the empty water jug stands beside it; its wall socket behind it is wet' : 'a full water jug stands beside it';
    const soggy = w.soggy ? ' (soggy: it came back up)' : '';
    const puddle = w.puddle ? '; a green puddle of sick on the floor where you threw up' : '';
    return `WORLD: ${lights}; your letter is ${LETTER[w.letter] ?? w.letter}${soggy}${floor}${puddle}; the coffee machine${machine}: ${jug}`;
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
      case 'switch:off': return "clack: at the panel you switch the boss's office lights off 💡";
      case 'switch:on': return "clack: at the panel you switch the boss's office lights back on 💡";
      case 'boss:blackout': return 'the boss: ❓ He holds up his phone torch 📱 and gets up to go out to the fuse box';
      case 'boss:dark': return 'the boss: ❓ He holds up his phone torch 📱 and gets up to go and see why';
      case 'switch:starting': return 'the boss tries the unlabelled switches on the panel one by one: his office tubes blink';
      case 'switch:fixed': return "the boss finds his switch: his office light is back on 💡 (😠)";
      case 'coffee:rigged': return "you pour the water jug down the back of the coffee machine, onto its wall socket 💦. Nothing shows from the front";
      case 'coffee:flicker': return 'Lin switches on the coffee machine: the lights flicker (😳), Kev glances down the hall at the fuse box, and the lights steady. It brews';
      case 'coffee:shorted': return 'Lin switches on the coffee machine: its wet socket shorts, sparks and smoke (😳), and a spark runs down the wiring toward the fuse box';
      case 'fuse:tripped': return "the spark reaches the fuse box: its door flies open and the whole floor goes dark. Out come the phone torches 📱";
      case 'fuse:pulled': return 'you pulled the main breaker: the whole floor goes dark. Out come the phone torches 📱';
      case 'kev:smoke': return 'Kev: ❓ He heads for the smoking coffee machine with his phone torch';
      case 'coffee:unplugged': return 'Kev unplugs the coffee machine: the smoke stops';
      case 'kev:fuse': return 'Kev: 🔧 He heads for the fuse box with his phone torch';
      case 'fuse:fixing': return 'Kev is at the fuse box, looking through its unlabelled breakers by phone light';
      case 'fuse:fixed': return 'Kev finds the breaker that is down and pushes it back up: the lights are back on 💡';
      case 'boss:sigh': return null;
      case 'boss:checksClock': return null;
      case 'boss:chime': return "the boss's desk clock chimes 3:39 🔔";
      case 'boss:pullsTray': return 'the boss sighs 😮‍💨 and drags his tray over';
      case 'letter:taken': return 'you took your letter back ✉️';
      case 'letter:snatched': return null;
      case 'letter:eaten': return 'you ate your resignation letter';
      case 'player:queasy': return 'your face goes green 🤢';
      case 'player:sick': return 'you throw up: a green puddle at your feet, your letter soggy in it; everyone turns';
      case 'lin:sees': return 'Lin sees the puddle 🤢 and goes for the paper towels';
      case 'lin:towels': return 'Lin tears off a wad of paper towels in the kitchen';
      case 'lin:wipes': return 'Lin wipes up your sick and bins the towels, and whatever was in it';
      case 'inspect:start': return 'the boss gets up to come and see what the retching was';
      case 'inspect:pass': return 'the boss looks at the puddle 🤢 and goes back to his desk';
      case 'inspect:fail': return 'the boss looks at the puddle and knows his envelope in it ✉️';
      case 'inspect:done': return null;
      case 'letter:stashed': return 'you put your letter in your desk drawer and sit down';
      case 'letter:recovered': return 'the boss picks your letter up off the floor ✉️❗';
      default: return undefined;
    }
  },
};
