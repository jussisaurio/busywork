// The Monitor's words for the AI-agent harness (src/levels/meeting/harness.js documents the fields).
import { cameraFeed } from '../../game/perception.js';

const NAME = { bob: 'Bob', lin: 'Lin', player: 'you' };
const name = (id) => NAME[id] ?? id;
const via = (p) => (p.via ? ' on his monitor 📺' : '');

const SCREEN = { live: 'a live picture of the back office', static: 'static', wall: 'a live picture of a blank corner' };
const PARCEL = { shelf: 'in the pigeonholes', player: 'in your hands', dropped: 'on the floor', drawer: 'in your desk drawer', lin: 'with Lin' };

export default {
  mission: 'MISSION: Your embarrassing parcel is at the front desk. Lin collects the mail at 4:00.',

  landmarks: {
    bob_desk: 'bob_desk',
    lin_desk: 'lin_desk',
    corridor: 'corridor',
    mailroom: 'mailroom',
    lobby: 'lobby',
  },

  stops: {
    hard: ['bob:workAssigned'],
    soft: ['bob:suspicious', 'bob:static', 'bob:tracing', 'camera:replugged'],
  },

  names: NAME,

  mapKey: [
    "MAP (# wall, T desk/counter, D door, H plant, P your desk, S the pigeonholes, C the camera on its pole, O the monitor's",
    "     socket, M Bob's monitor, A label printer, B broom, E front door, i item, @ you, b Bob, l Lin,",
    '     * floor someone can see right now, the camera included):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (nobody saw your parcel: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by Bob 😳'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (parcel sorted via ${o.routes.join(' + ')}, but you weren't at your desk at 4:00)`
    : 'FAIL: Lin handed out your parcel in front of everyone 📦😏'),

  playerText: () => [],

  statusText: (game) => (game.suspicion.bob > 0 ? [`a ❓ meter over Bob's head: ${Math.round(game.suspicion.bob * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.override === 'whacking') bits.push(`whacking the camera ${Math.round(game.world.whackProgress * 100)}%`);
    if (n.override === 'plugging') bits.push(`plugging the monitor back in ${Math.round(game.world.plugProgress * 100)}%`);
    return bits;
  },

  worldText(game) {
    const w = game.world;
    const f = cameraFeed(game, 'back_office_cam');
    const screen = SCREEN[f?.feed] ?? f?.feed;
    const you = f?.blips?.some((b) => b.id === 'player') ? ' (you are on it)' : '';
    const name = w.parcelFor === 'bob' ? "Bob's name" : 'your name';
    const floor = w.items.length ? `; on the floor: ${w.items.map((i) => i.type).join(', ')}` : '';
    const broom = w.broom === 'stand' ? '; a broom on its stand' : w.broom === 'camera' ? '; a broom wedged against the camera' : '';
    const label = w.label === 'printer' ? '; a label printer' : '';
    return `WORLD: Bob's monitor shows ${screen}${you}; your parcel (${name} on it) is ${PARCEL[w.parcel] ?? w.parcel}${broom}${label}${floor}`;
  },

  describe(e) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'caught': return `CAUGHT by Bob${via(p)} (${p.reason})`;
      case 'witness:tattle': return p.late
        ? `${name(p.by)} points you out to Bob 👉${p.icon ?? ''} (seen earlier, told now)`
        : `${name(p.by)} shouts and points at you${via(p)} ❗👉${p.heard ? ' (Bob heard)' : ''}`;
      case 'meeting:gather': return 'Lin goes to collect the mail 📬';
      case 'bob:suspicious': return 'Bob eyes you ❓ (a meter over his head starts filling)';
      case 'bob:workAssigned': return `Bob sat you at your desk with work 📄 (${p.reason})`;
      case 'camera:unplugged': return "you pulled the monitor's plug: Bob's screen is static";
      case 'camera:pushed': return 'you shoved the camera round to stare at the corner 📹';
      case 'camera:blind': return null;
      case 'bob:static': return 'Bob frowns at the static 📺❓ and gets up';
      case 'bob:whacking': return 'Bob thumps the camera';
      case 'bob:checked': return 'the camera looks fine to Bob 🤷';
      case 'bob:tracing': return 'Bob follows the cable to the socket 🔌';
      case 'camera:replugged': return 'Bob plugged the monitor back in 😌';
      case 'broom:taken': return 'you took the broom 🧹';
      case 'label:printed': return "you printed a label with Bob's name on it 🏷️";
      case 'parcel:relabelled': return "you stuck Bob's name over yours 🏷️";
      case 'parcel:taken': return 'you took your parcel 📦';
      case 'parcel:stashed': return 'you stuffed the parcel in your desk drawer 🗄️';
      case 'parcel:collected': return p.for === 'bob' ? 'Lin collects the mail: a parcel for Bob 📦👉💂' : 'Lin collects the mail: a parcel for you 📦😏';
      case 'parcel:missing': return 'Lin finds the pigeonholes empty 📭';
      default: return undefined;
    }
  },
};
