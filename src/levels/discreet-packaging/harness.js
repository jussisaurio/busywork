// Discreet Packaging's words for the AI-agent harness (src/levels/meeting/
// harness.js documents the fields). Only what a player would see on screen.
import { cameraFeed } from '../../game/perception.js';
import { TITLE } from './presentation.js';

const NAME = { bob: 'Bob', lin: 'Lin', player: 'you' };
const name = (id) => NAME[id] ?? id;
const via = (p) => (p.via ? ' on his monitor 📺' : '');

const SCREEN = { live: 'a live picture of the back office', static: 'static', wall: 'one giant leaf (the camera stares into the plant)' };
const PARCEL = {
  shelf: 'on the parcel shelf of the pigeonholes',
  drawer: 'shut in your desk drawer',
  lin: 'in Lin\'s hands',
  bob: 'in Bob\'s arms',
  found: 'in someone else\'s hands',
  spotted: 'in your arms, and Lin has seen it',
};

export default {
  mission: `MISSION: ${TITLE.mission.join(' ')}`,

  landmarks: {
    camera: 'camera', // under it, on the back office side (the cctv interactable is reachable from the corridor too)
    bob_desk: 'bob_desk',
    lin_desk: 'lin_desk',
    corridor: 'corridor',
    store_room: 'mailroom',
    lobby: 'lobby',
    mail_call: 'mail_call',
  },

  stops: {
    hard: ['bob:workAssigned'],
    soft: ['bob:suspicious', 'bob:static', 'parcel:spotted'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, T desk/counter, D door, H plant, P your desk, Q/S the pigeonholes (S its parcel shelf), C the camera on the wall, F a tall",
    "     potted plant, O the power strip with the camera's plug, M Bob's monitor, B broom, E front door,",
    '     i item, @ you, b Bob, l Lin, * floor someone can see right now, the camera included):',
  ],

  outcomeText: (o) => (o.result === 'win' ? (o.routes.includes('bob')
    ? `WIN 🎉 (Lin hands Bob the pink box, his face on the label; he hugs it, in tears 🥹${o.why === 'away' ? '; nobody wonders where you are' : ''})`
    : `WIN 🎉 (no pink box at the mail call: nothing for you today 📭${o.why === 'away' ? '; nobody wonders where you are' : ''})`)
    : o.result === 'caught' ? 'CAUGHT 😳 (someone has your parcel, or saw you at it)'
    : o.why === 'noshow' ? 'BLAMED 🪑 (Lin holds up the pink box with your face on it over your empty chair)'
    : o.why === 'found' ? 'FAIL 😳 (someone picked up your parcel and read the label: your face)'
    : 'FAIL 😳 (Lin holds up the pink box with your face on it; every head turns)'),

  playerText: () => [],

  statusText: (game) => (game.suspicion.bob > 0 ? [`a ❓ meter over Bob's head: ${Math.round(game.suspicion.bob * 100)}%`] : []),

  npcText(game, n) {
    const w = game.world;
    const bits = [];
    if (n.override === 'whacking') bits.push(`thumping the camera ${Math.round(w.whackProgress * 100)}%`);
    if (n.override === 'tugging') bits.push(`tugging at the camera jammed in the plant ${Math.round(w.tugProgress * 100)}%`);
    if (n.override === 'plugging') bits.push(`plugging the camera back in ${Math.round(w.plugProgress * 100)}%`);
    if (n.override === 'fetching') bits.push('heading for the pink box on the floor');
    if (n.carry === 'parcel') bits.push('holding your pink box, reading the label');
    if (n.id === 'lin' && w.parcel === 'lin') bits.push(`carrying the pink box (${w.parcelFor === 'bob' ? "Bob's" : 'your'} face on the label)`);
    if (n.id === 'lin' && w.brown === 'lin') bits.push(`carrying the brown box (${w.parcelFor === 'bob' ? 'your' : "Bob's"} face on the label)`);
    if (n.id === 'bob' && w.parcel === 'bob') bits.push('hugging the pink box');
    if (n.id === 'bob' && w.brown === 'bob') bits.push('holding his brown box');
    if (n.id === 'lin' && n._atMail && (w.mailEmpty || (w.parcel === 'bob' && w.brown === 'player'))) bits.push('shrugging');
    return bits;
  },

  worldText(game) {
    const w = game.world;
    const f = cameraFeed(game, 'back_office_cam');
    const screen = SCREEN[f?.feed] ?? f?.feed;
    const you = f?.blips?.some((b) => b.id === 'player') ? ' (you are on it)' : '';
    const face = w.parcelFor === 'bob' ? "Bob's face" : 'your face';
    const loose = w.items.find((i) => i.type === 'parcel');
    const where = loose ? 'on the floor' : w.parcel === 'player' ? 'in your hands' : PARCEL[w.parcel] ?? w.parcel;
    const floor = w.items.filter((i) => i.type !== 'parcel').map((i) => i.type);
    const bits = [`Bob's monitor shows ${screen}${you}`];
    if (w.camAim === 'plant') bits.push('the camera is turned into the plant');
    bits.push(`the pink parcel (${face} on the label) is ${where}`);
    if (w.brown === 'shelf') bits.push(`Bob's plain brown parcel (${w.parcelFor === 'bob' ? 'your' : 'his'} face on the label) is on the parcel shelf`);
    if (w.brown === 'player') bits.push(`Bob's brown box, your face on its label, is ${w.items.some((i) => i.type === 'brownbox') ? 'on the floor' : 'in your hands'}`);
    if (w.plug === 'out') bits.push("the camera's plug hangs out of the power strip");
    if (w.broom === 'stand') bits.push('a broom on its wall clip in the store room');
    if (floor.length) bits.push(`on the floor: ${floor.join(', ')}`);
    return `WORLD: ${bits.join('; ')}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'caught': return p.reason === 'found' ? `${name(p.by)} has your parcel and reads the label: your face 😳` : `CAUGHT by Bob${via(p)} (${p.reason})`;
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to Bob 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you${via(p)} ❗👉${p.heard ? ' (Bob heard)' : ''}`;
      case 'meeting:gather': return 'Lin and Bob head to your office for the mail call 📬';
      case 'bob:suspicious': return 'Bob eyes you ❓ (a meter over his head starts filling)';
      case 'bob:workAssigned': return `Bob sat you at your desk with work 📄 (${p.reason})`;
      case 'camera:unplugged': return "you pulled the camera's plug: its light is out and Bob's screen is static";
      case 'camera:pushed': return 'clunk: the camera swivels into the plant and sticks; the monitor shows one giant leaf 🪴';
      case 'camera:blind': return null;
      case 'bob:static': return 'Bob frowns at the static 📺❓ and gets up';
      case 'bob:whacking': return 'Bob thumps the camera';
      case 'bob:leaf': return 'Bob sees one big leaf on his monitor and grumbles';
      case 'bob:tugging': return 'Bob tugs at the camera, jammed in the plant';
      case 'bob:gave_up': return "Bob can't shift it: he leaves it for facilities, tomorrow";
      case 'bob:checked': return 'the camera looks fine to Bob 📹❓';
      case 'bob:tracing': return 'Bob follows the cable to the power strip 🔌';
      case 'camera:replugged': return 'Bob plugged the camera back in 😊';
      case 'broom:taken': return 'you took the broom';
      case 'broom:returned': return 'you put the broom back';
      case 'brown:taken': return 'you take the brown box with your face on it: dull cardboard, nobody minds';
      case 'brown:returned': return 'you put the brown box back on the parcel shelf';
      case 'parcel:swapped': return "you swapped the labels: Bob's face on the pink box, yours on his brown one; both back on the shelf";
      case 'parcel:taken': return 'you took your parcel';
      case 'parcel:stashed': return 'you stuffed the parcel in your desk drawer and slammed it shut';
      case 'parcel:spotted': return `${name(p.by)} spots the pink box on the floor 💝❗`;
      case 'parcel:found': return `${name(p.by)} picks up the pink box and reads the label`;
      case 'parcel:spotted_on_you': return `${name(p.by)} sees the pink box in your arms and exclaims over it out loud`;
      case 'parcel:collected': return !p.brown ? "Lin collects the pink box, Bob's face on it; the brown box is gone from the shelf (you have it)" : p.for === 'bob' ? "Lin collects both boxes: the pink one has Bob's face on it, the brown one yours" : "Lin collects both boxes: Bob's brown one, and the pink one with your face on it";
      case 'parcel:missing': return "Lin collects Bob's brown box; no pink box on the shelf, and she doesn't miss it";
      case 'parcel:handed': return 'Lin hands Bob the box with his face on it';
      default: return undefined;
    }
  },
};
