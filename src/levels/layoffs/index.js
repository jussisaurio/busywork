// "The Layoff List": the same office as level 1, an hour later. At 3:45 the boss emails HR the layoff list, and you
// are on it: a row of faces on his screen, yours framed in red (list.js). The whole design, in prose, is premise.md.
//
// His screen faces the floor through his glass wall, and Lin, at her desk facing his office, reads it over his
// shoulder. To edit it you need (1) the boss away from a working, unlocked screen, and (2) Lin looking away:
//   - 3:00: his cable has worked loose (static). He phones Kev's desk; Kev kneels at the plug and fixes it while the
//     boss stands over him. The list comes up: your face is on it (😨); Lin's isn't (her 😨, then 😌, then a look at
//     you). At 3:11 he goes to the restroom and locks the screen. Kev goes home about 3:15 (👋🏠 to Lin).
//   - 3:26: the static is back. He phones Kev's desk again, but Kev went home: it just rings (❓). Kneel at his cable
//     and plug it back in while he's there, and he leaves you to it (☕👉 you: fix it, I'm getting coffee). The
//     screen comes back on after he's gone, the list open, unlocked: there was nothing to lock when he left.
//     Left alone, he plugs it back in himself at 3:31 (🔌) and sits there until he sends it.
//   - While he's at the coffee machine, make Lin look away for the 3 s the edit takes: ring Kev's empty desk from
//     the boss's desk phone (she turns round to it: the ring route), or wait for her mobile to buzz (she picks it
//     up and turns away: the phone route).
// Seen by Lin, she shouts it across the floor and the boss hears (the engine's tattle: desk work). Seen by the boss
// on his way back with his coffee: caught.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { say } from '../../core/fx.js';
import { spotPos } from '../../game/perception.js';
import { CAST, BEHAVIOURS, START, SECS, ringKev } from './cast.js';
import { TITLE, DECOR, LOOKS, POSES, END_SCENES, VOICES, SOUNDS } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

// Level 1's floor (src/levels/meeting/map.js), with the boss's desk turned round and no projector.
//  Boss office (glass S/E walls)  | Meeting room                    | Kitchen
//  ------------------------------ hallway (row 7) --------------------------------------------
//  Open plan: Lin's desk (x3-5, row 8, her mobile M) with Kev's behind it (row 11, his phone V), your desk P (x12-14)
//  Glass wall + entrance L (row 13) | lobby (outside) + elevator E   | restroom door R
// The boss's desk (row 3): W the end his cable runs down from to the floor socket behind it, F his desk phone, Q his
// screen, facing the floor. He sits south of it (row 4), his back to the glass.
const MAP = [
  '##############################', // 0
  '#.......G..........#TTCT.....#', // 1
  '#.......G..........#.........#', // 2
  '#..WFQ..G..TTJTTT..#....TTT..#', // 3
  '#.......G..TTTTTT..#.........#', // 4
  '#......HG..........#.........#', // 5
  '#GGGGGDGG#####D#######DD######', // 6
  '#............................#', // 7
  '#..TTM......TPT......TTT.....#', // 8
  '#............................#', // 9
  '#............................#', // 10
  '#..TTV......TTT......TTT.....#', // 11
  '#...........................H#', // 12
  '#GGGLGGGGG###############R####', // 13
  '#:::::::::####################', // 14
  '#:::::::::####################', // 15
  '##EE##########################', // 16
];

const LEGEND = {
  W: { kind: 'boss_cable', solid: true, opaque: false, interactable: 'boss_cable', draw: 'desk' }, // the loose plug: behind the desk
  F: { kind: 'boss_phone', solid: true, opaque: false, interactable: 'boss_phone', draw: 'desk' }, // his desk phone
  Q: { kind: 'boss_pc', solid: true, opaque: false, interactable: 'boss_pc', draw: 'desk' }, // his screen
  M: { kind: 'lin_mobile', solid: true, opaque: false, draw: 'desk' }, // Lin's desk, her mobile on it
  V: { kind: 'kev_phone', solid: true, opaque: false, draw: 'desk' }, // Kev's desk, his desk phone on it
  C: { kind: 'coffee_machine', solid: true, opaque: false },
  J: { kind: 'meeting_table', solid: true, opaque: false },
  P: { kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' },
  L: { kind: 'entrance', solid: true, opaque: false, npcPassable: true },
  R: { kind: 'restroom', solid: true, opaque: true },
  E: { kind: 'elevator', solid: true, opaque: true },
};

const SPOTS = {
  player_desk: { x: 13, y: 9, face: 'N' }, // your seat; you start here
  boss_desk: { x: 3, y: 4, face: 'N' }, // his chair: facing his desk, his back to the glass, his screen up and right
  cable: { x: 3, y: 2, face: 'S' }, // behind his desk, down at the socket: where Kev, you and he plug it back in
  boss_aside: { x: 6, y: 3, face: 'W' }, // where he stands over Kev
  screen: { x: 5, y: 4, face: 'N' }, // in front of his screen
  lin_desk: { x: 4, y: 9, face: 'N' }, // facing his office: she reads his screen through the glass
  kev_desk: { x: 4, y: 12, face: 'N' }, // behind Lin, by the entrance
  kev_bye: { x: 6, y: 9, face: 'W' }, // beside Lin's desk: Kev says goodbye
  boss_door: { x: 6, y: 7, face: 'S' },
  door_in: { x: 4, y: 12, face: 'S' },
  elevator: { x: 2, y: 15, face: 'S' }, // Kev goes home here
  coffee: { x: 22, y: 2, face: 'N' }, // at the coffee machine
  restroom: { x: 25, y: 12, face: 'S' },
  kitchen_table: { x: 25, y: 4, face: 'N' },
};

const ZONES = {
  desk: { x0: 11, y0: 9, x1: 16, y1: 11 },
  floor: { x0: 0, y0: 0, x1: 30, y1: 14 }, // anywhere in the office: he counts the list against the floor
  outside: { x0: 0, y0: 14, x1: 30, y1: 17 },
};

// Kev's desk phone, on his desk (V): where it rings from, and where Lin turns to.
const KEV_PHONE = { x: 5.5, y: 11.4 };
const RING_SECS = 6; // a call to Kev's empty desk rings this long, then gives up
const EDIT_SECS = 3.0;

// The cable is at the floor behind his desk: you reach it from behind (row 2), not from his chair.
const behindDesk = (p) => p.y < 3;
// His screen faces the floor: you work it from in front of or beside his desk, not from behind.
const atScreen = (p) => p.y >= 3;

const INTERACTIONS = {
  // While Kev is still here, the cable is his job: the boss waves you off it.
  try_cable: {
    on: 'boss_cable', text: 'plug his cable back in', instant: true,
    can: (p, w) => w.glitch && !w.kevGone && !w.wavedOff && behindDesk(p),
    done(game) {
      game.world.wavedOff = true;
      say(game, 'boss', ['🙅', '@kev'], { voice: 'boss', ttl: 1.8 }); // no: Kev does that
      game.events.emit('boss:wavesOff', {});
    },
  },
  // Kev has gone home: anyone may push the plug back in. Not sneaky: the boss is glad of it (index.js clockFor).
  fix_cable: {
    on: 'boss_cable', text: 'plug his cable back in', duration: 4.0, sneaky: false,
    can: (p, w) => w.glitch && w.kevGone && behindDesk(p),
    done(game) {
      const w = game.world;
      w.glitch = false;
      w.listUpAt = game.clock.minute; // the list comes up on his screen (list.js pops it out)
      game.events.emit('pc:fixedByYou', {});
    },
  },
  call_kev: {
    on: 'boss_phone', text: "call Kev's desk", instant: true,
    can: (p, w) => w.pc === 'free' && w.kevGone && !w.ringing,
    done(game) {
      ringKev(game, RING_SECS);
      game.events.emit('phone:called', {});
    },
  },
  strike_name: {
    on: 'boss_pc', text: 'take your face off the list', duration: EDIT_SECS, sneaky: true, saw: '🖥️',
    can: (p, w) => w.list === 'on' && w.pc === 'free' && !w.locked && !w.glitch && atScreen(p),
    done(game, a) {
      const w = game.world;
      const lin = game.npcs.find((n) => n.id === 'lin');
      w.list = 'off';
      w.listOffAt = game.clock.minute; // your face drops off his screen (list.js)
      w.offVia = w.ringing || lin?._heard ? 'ring' : w.linPhone === 'hand' ? 'phone' : 'unseen';
      game.events.emit('list:edited', { via: w.offVia, x: a.x, y: a.y });
    },
  },
};

const ROLES = {
  authority: { id: 'boss', offDuty: [], helpless: [], deafIn: null },
};

// You plug his cable back in while he sits there: he leaves you to it and gets a coffee (clockFor sets w.coffee).
// The machine is slow; he walks back with his cup (presentation.js POSES) on his schedule, about 3:42.
const BREW_UNTIL = at('3:35.5', START);
const LURES = [
  {
    npc: 'boss',
    when: (w) => w.coffee === 'asked',
    override: 'toCoffee',
    plan: 'coffee',
    label: 'get a coffee',
    spot: 'coffee',
    react: { wait: 0.4, says: [{ say: ['☕', '👉', '@player'] }], event: 'boss:coffee' }, // fix it, I'm getting coffee
    work: { override: 'brewing', minutes: 60, progress: 'brewProgress', start: { set: { brewing: true } } },
  },
];

const NOISES = {
  // Kev's desk phone ringing: Lin, beside it, turns round to it while it rings.
  'phone:ring': {
    at: KEV_PHONE, radius: 6, npcs: ['lin'], every: 1.1, turn: 1.4, while: (w) => w.ringing,
    ripple: { color: '#f3e6c8' }, sfx: 'phoneRing',
  },
};

// Lin's mobile buzzes on her desk at uneven times; a beat later she picks it up and turns away to read it (about
// 4 s). Each buzz is visible (presentation.js: the phone shakes on her desk) before she looks away.
const BUZZ = ['3:04', '3:11.5', '3:17', '3:21', '3:24.5', '3:29.6', '3:32.4', '3:37', '3:39.5', '3:43'].map((t) => at(t, START));
const PICK_UP = SECS(0.6);
const READ_FOR = 4.0; // s
const AWAY = (3 * Math.PI) / 4; // down and to her left: turned away from his office

const free = (n) => n.active && !n.override;
const seated = (game, n, spot) => {
  const p = spotPos(game, spot);
  return !!n._plan?.done && Math.hypot(n.x - p.x, n.y - p.y) < 0.3;
};

// What lookAt does (sim/npcs.js HOOK_API), at a direction rather than a spot.
function stare(npc, sim, dir, s) {
  npc._stare = { t: s, dir, back: npc._stare ? npc._stare.back : npc._faceTarget };
  npc._faceTarget = dir;
  npc._gl.hold = 0;
  sim.holdFor(npc, s);
}

// The tattle (play/rules.js) as world state: Lin saw you at his screen, and the boss heard.
const listening = new WeakSet();
function listen(game) {
  if (listening.has(game.events)) return;
  listening.add(game.events);
  game.events.on('witness:tattle', (p) => {
    if (game.level?.id !== 'layoffs' || game.phase !== 'day' || p.by !== 'lin') return;
    game.world.linSaw = true;
    if (p.heard || p.late) game.world.told = true;
  });
}

function bossClock(game, npc, sim) {
  const w = game.world;
  const now = game.clock.minute;
  const st = (npc._lay ??= {});
  listen(game);
  if (w.ringing && w.ringUntil != null && now >= w.ringUntil) w.ringing = false;
  // 3:26 (cast.js actsUp): a beat after the static, he phones Kev's desk; it rings out, and he wonders where Kev is.
  if (st.callAt != null && now >= st.callAt) {
    st.callAt = null;
    if (w.glitch && free(npc)) {
      sim.speak(game, npc, [{ say: ['☎️', '@kev'] }]);
      w.bossPhoneUntil = now + SECS(RING_SECS); // the handset at his ear while it rings out
      ringKev(game, RING_SECS);
      st.askAt = now + SECS(RING_SECS + 0.4);
    }
  }
  if (st.askAt != null && now >= st.askAt) {
    st.askAt = null;
    if (w.glitch && free(npc)) sim.speak(game, npc, [{ say: ['@kev', '❓'], kind: 'thought' }]);
  }
  // You kneel at his cable while he sits there with the static: he leaves you to it (the coffee lure).
  if (w.coffee === 'none' && w.glitch && game.player.action?.type === 'fix_cable' && free(npc) && seated(game, npc, 'boss_desk')) {
    w.coffee = 'asked';
    w.pc = 'free';
    st.askAt = null;
    if (w.ringing) w.ringing = false; // he hangs up on Kev's empty desk
    w.bossPhoneUntil = null;
    npc._sayQ.length = 0;
  }
  if (npc.override === 'brewing') {
    st.brewFrom ??= now;
    if (now >= Math.max(BREW_UNTIL, st.brewFrom + SECS(0.6))) {
      w.brewing = false;
      w.coffee = 'done';
      game.events.emit('boss:hasCoffee', {});
    }
  }
  return now;
}

function kevClock(game, npc) {
  if (game.world.kevCall && npc.moving) game.world.kevCall = false; // the handset goes down as he sets off
  return game.clock.minute;
}

function linClock(game, npc, sim) {
  const w = game.world;
  const now = game.clock.minute;
  const st = (npc._lay ??= { buzz: 0, look: null, down: null, read: 0 });
  if (st.buzz < BUZZ.length && now >= BUZZ[st.buzz]) {
    st.buzz++;
    w.buzzAt = now;
    st.look = now + PICK_UP;
    game.events.emit('lin:buzz', {});
  }
  if (st.look != null && now >= st.look) {
    st.look = null;
    if (free(npc) && !npc._heard && !npc._stare && w.linPhone === 'desk') {
      w.linPhone = 'hand';
      st.down = now + SECS(READ_FOR);
      stare(npc, sim, AWAY, READ_FOR);
      game.events.emit('lin:reads', {});
    }
  }
  if (st.down != null && now >= st.down) {
    st.down = null;
    w.linPhone = 'desk';
  }
  // The list comes up (cast.js pcFixed): she reads it over his shoulder. Her face isn't on it (😨, then 😌), and
  // she looks round at you: yours is.
  if (w.linReadAt != null && st.read < 3) {
    const secs = (now - w.linReadAt) / SECS(1);
    if (st.read === 0 && secs >= 0.5) {
      st.read = 1;
      say(game, 'lin', ['😨'], { kind: 'thought', ttl: 1.2 });
    } else if (st.read === 1 && secs >= 1.9) {
      st.read = 2;
      say(game, 'lin', ['😌'], { kind: 'thought', ttl: 1.2 });
    } else if (st.read === 2 && secs >= 4.4) { // once Kev is back in his seat, out of the line between you
      st.read = 3;
      const p = game.player;
      if (free(npc) && !npc._heard) stare(npc, sim, Math.atan2(p.y - npc.y, p.x - npc.x), 2.2);
      game.events.emit('lin:looksAtYou', {});
    }
  }
  return now;
}

const CLOCKS = { boss: bossClock, kev: kevClock, lin: linClock };

export default {
  id: 'layoffs',
  map: { rows: MAP, legend: LEGEND },
  spots: SPOTS,
  zones: ZONES,
  patrols: {},
  cast: CAST,
  day: {
    start: START, // 3:00 PM; at() times count from it
    gatherAt: at('3:42', START), // he turns round in his chair for the head count
    meetingAt: at('3:45', START), // he sends it to HR
    clockRedAt: at('3:40', START),
    clockTickAt: at('3:40', START),
    tockAt: at('3:43', START),
    halfMinuteAt: at('3:44', START),
  },
  clockFor: (game, npc, sim) => CLOCKS[npc.id](game, npc, sim),
  interactions: INTERACTIONS,
  items: {},
  roles: ROLES,
  lures: LURES,
  noises: NOISES,
  hunts: [],
  doors: [],
  behaviours: BEHAVIOURS,
  // Wherever you are on the floor he counts you; the fail beat stands you at your own desk.
  meeting: { override: 'send', room: 'floor', chair: 'player_desk', presenter: 'player_desk' },
  routes: [
    { id: 'ring', icon: '☎️', achieved: (w) => w.list === 'off' && w.offVia === 'ring' },
    { id: 'phone', icon: '📱', achieved: (w) => w.list === 'off' && w.offVia !== 'ring' }, // 'unseen': the gate flags it
  ],
  outcomeOrder: ['ring', 'phone'],
  initialWorld: () => ({
    list: 'on', // your face on the layoff list: 'on' | 'off'
    listUpAt: null, // the game minute the list came up on his screen (list.js pops it out)
    linReadAt: null, // the game minute Lin read it over his shoulder (about 3:08, Kev fixed it)
    listOffAt: 0, // the game minute your face came off (list.js animates it)
    offVia: null, // what Lin was doing meanwhile: 'ring' | 'phone' | 'unseen'
    glitch: true, // static: his cable has worked loose (3:00 until Kev fixes it; again 3:26 until it's plugged in)
    pc: 'boss', // 'boss' (he's at it) | 'kev' (Kev at his cable) | 'free' (he's out)
    locked: false, // he locked it for the restroom (3:10 to 3:19)
    ringing: false, // Kev's desk phone is ringing
    ringUntil: null, // the game minute it gives up (null: until Kev picks up)
    kevCall: false, // Kev has the handset at his ear
    bossPhoneUntil: null, // the game minute the boss puts his handset down
    kevUp: false, // Kev has his bag: going home
    kevGone: false,
    wavedOff: false, // the boss waved you off his cable (Kev's job)
    coffee: 'none', // 'none' | 'asked' (he left you to it) | 'done' (he has his cup)
    brewing: false,
    brewProgress: 0,
    buzzAt: null, // the game minute Lin's mobile last buzzed
    linPhone: 'desk', // 'desk' | 'hand' (she's reading it, turned away)
    linSaw: false, // Lin saw you at his screen and shouted
    told: false, // ...and the boss heard
    items: [],
  }),
  harness,
  gate,
  title: TITLE,
  decor: DECOR,
  looks: LOOKS,
  poses: POSES,
  endScenes: END_SCENES,
  sounds: SOUNDS,
  voices: VOICES,
};
