// The Layoff List in words, for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
import { OFFICE_NAMES as NAME } from '../office/cast.js';
const name = (id) => NAME[id] ?? id;

export default {
  mission: "MISSION: Friday, 3:00 PM. You're on the layoff list. At 3:45 it goes to HR.",

  landmarks: {
    boss_desk: 'boss_desk',
    his_chair: 'boss_desk',
    behind_his_desk: 'cable', // where the floor socket is: the cable is reached from here
    his_screen: 'screen', // in front of it: it faces the floor
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    boss_office_door: 'boss_door',
    coffee: 'coffee',
    entrance: 'door_in',
    restroom_door: 'restroom',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'lin:sees', 'lin:tells'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : outside lobby, L entrance,",
    "     Q the boss's screen (it faces the floor), W the floor socket behind his desk his cable plugs into, F his desk phone,",
    "     M Lin's desk with her mobile, V Kev's desk with his desk phone, C coffee machine, P your desk, R restroom,",
    '     E elevator, @ you, b boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (the list went to HR without you, via: ${o.routes.join(' + ')})`
    : o.result === 'caught' && o.why === 'told' ? 'CAUGHT: Lin told him; he put your face back, locked it and sent it 📧 (you leave with a box 📦)'
    : o.result === 'caught' ? 'CAUGHT by the boss 😠 (fired on the spot: you leave with a box 📦)'
    : 'FAIL: the boss sent the list to HR with you on it 📧; you leave with a box 📦'),

  playerText: () => [],

  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const w = game.world;
    const bits = [];
    if (n.id === 'kev' && w.kevCall) bits.push('on the phone');
    if (n.id === 'kev' && w.pc === 'kev') bits.push("kneeling behind the boss's desk at the plug");
    if (n.id === 'kev' && w.kevUp) bits.push('carrying his bag');
    if (n.id === 'boss' && w.coffee === 'done') bits.push('holding a coffee');
    if (n.id === 'lin' && n.override === 'toTell') bits.push('getting up to go and tell the boss');
    if (n.id === 'lin' && w.linPhone === 'hand') bits.push('reading her mobile, turned away');
    return bits;
  },

  // Only what is visible on screen.
  worldText(game) {
    const w = game.world;
    const people = w.list === 'off' ? 'three faces; yours is gone'
      : w.struck ? 'a row of four faces, yours framed in red and half crossed out' : 'a row of four faces, yours framed in red';
    const screen = w.glitch ? 'black, the monitor off (its power light dark); behind his desk, a plug hangs half out of the floor socket'
      : w.locked ? 'a lock screen with a padlock' : `the layoff list: ${people}`;
    const bits = [`WORLD: the boss's screen shows ${screen}`];
    if (w.ringing) bits.push("Kev's desk phone is ringing");
    if (w.kevGone) bits.push("Kev's screen is off");
    return bits.join('; ');
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'lin:sees': return 'Lin sees you crossing your face out and shouts ❗👉; she thinks of the list with her own face on it 😨';
      case 'lin:tells': return 'Lin points you out to the boss 👉🖥️';
      case 'meeting:gather': return 'the boss goes back to his desk to pack up for the weekend 📧';
      case 'boss:packsUp': return 'the boss puts his coat on at his desk, the email to HR open 🧥📧';
      case 'boss:checks': return 'the boss checks his screen and puts your face back on the list 😠';
      case 'boss:checked': return 'the boss locks his screen and turns round on you 🔒';
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'boss:coffee': return 'the boss gives up waiting for Kev and goes for a coffee, his screen still black ☕';
      case 'pc:triedLocked': return "the boss's screen is locked: the padlock jolts 🔒";
      case 'boss:hasCoffee': return 'the boss has his coffee and heads back';
      case 'phone:ring': return "Kev's desk phone rings ☎️";
      case 'phone:called': return "you call Kev's desk from the boss's phone and leave the handset lying off its cradle on his desk while it rings";
      case 'pc:fixed': return "Kev pushes the plug home: the boss's screen comes back with the list on it";
      case 'pc:fixedByYou': return "you push the plug home: the boss's screen comes back with the list on it";
      case 'pc:pulled': return "you pull the boss's plug half out: his monitor goes black";
      case 'pc:actsUp': return "back at his desk, the boss types his password into the black screen (✱✱✱✱✱ then a hard ⏎), stares at it 🖥️❓ and thumps it 😠";
      case 'boss:headCount': return p.on ? "the boss counts the list's faces and ticks yours ✔️" : "the boss counts the list's faces: one short? he shrugs 📋🤨🤷";
      case 'pc:locked': return 'the boss locks his screen and leaves for the restroom';
      case 'kev:fixing': return "Kev kneels behind the boss's desk at the plug, the boss standing over him";
      case 'kev:up': return 'Kev picks up his bag';
      case 'kev:left': return 'Kev has gone home';
      case 'lin:buzz': return "Lin's mobile buzzes on her desk";
      case 'lin:reads': return 'Lin picks up her mobile and turns away to read it';
      case 'list:edited': return 'you take your face off the list';
      case 'kev:bye': case 'lin:looksAtYou': return null; // the lines people say show it
      default: return undefined;
    }
  },
};
