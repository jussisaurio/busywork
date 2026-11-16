// "The Layoff List": the same office as level 1, an hour later. At 3:45 the boss emails HR the layoff list, and you
// are on it: a row of faces on his screen, yours framed in red (list.js). The whole design, in prose, is premise.md.
//
// His screen faces the floor through his glass wall, and Lin, at her desk facing his office, reads it over his
// shoulder. To edit it you need (1) the boss away from a working, unlocked screen, and (2) Lin looking away:
//   - 3:00: his monitor's cable has worked loose (black screen). He phones Kev's desk; Kev kneels at the plug and fixes it while the
//     boss stands over him. The list comes up: your face is on it (😨); Lin's isn't (her 😨, then 😌, then a look at
//     you). At 3:10 he goes to the restroom and locks the screen (try it: the padlock jolts, 🔒). Kev goes home
//     about 3:15 (👋🏠 to Lin).
//   - While he is in the restroom, pull his monitor's plug half out (pull_cable): black. About 3:22 he is back, types his
//     password into the black screen (✱✱✱✱✱ ⏎, so the PC behind it unlocks unseen), thumps it (😠) and phones Kev's desk, but Kev went home:
//     it just rings (❓). He gives up (😮‍💨☕) and goes for a coffee, his screen dead. He walks the length of the
//     floor to the kitchen and is out of sight from about 3:25. Leave his plug alone and he never leaves his desk.
//   - Then kneel at the socket behind his desk and push the plug home: the list comes back on, unlocked.
//     Left dead, he comes back with his coffee and at 3:42 sends the email from his mobile (📱📧).
//   - 3:42, the head count: he pops the sheet open and counts. Your face on it: ✔️. Gone: 📋🤨🤷, and he sends it.
//   - Before he is back on the floor (about 3:36), make Lin look away for the 3 s the edit takes: ring Kev's empty
//     desk from the boss's desk phone (she turns round to it, 👀☎️: the ring route), or wait for her mobile to
//     buzz (she picks it up and turns away, 📱: the phone route). When the edit ends the sheet closes, saved, back
//     to the email to HR: at 3:45 he sends that saved file (list.js drawEmail).
// Seen by Lin: she shouts (❗👉 you). Your face off his list leaves a gap, and the next face in it could be hers: a
// thought (📋, her face, 😨), then she gets up and goes to tell him (linWatch, the linTells lure), at the latest from
// the kitchen door. He leaves his coffee, comes back, checks his screen, puts your face back and locks it. At 3:45 he
// sends it and you are out (meeting.verdict: caught, no hunt: he knows who did it). Seen by the boss himself: caught.
//
// The level object's fields are documented in src/levels/meeting/index.js and CONTRACTS.md.
import { at } from '../../config.js';
import { say, sightline } from '../../core/fx.js';
import { spotPos, findNpc, npcSees } from '../../game/perception.js';
import { endOverride, npcSayLater } from '../../sim/override.js';
import { showOutNow } from '../../play/rules.js';
import { CAST, BEHAVIOURS, START, SECS, ringKev } from './cast.js';
import { TITLE, DECOR, LOOKS, POSES, END_SCENES, VOICES, SOUNDS } from './presentation.js';
import harness from './harness.js';
import gate from './gate.js';

// Level 1's floor (src/levels/meeting/map.js), with the boss's desk turned round and no projector.
//  Boss office (glass S/E walls)  | Meeting room                    | Kitchen
//  ------------------------------ hallway (row 7) --------------------------------------------
//  Open plan: Lin's desk (x3-5, row 8, her mobile M) with Kev's behind it (row 11, his phone V), your desk P (x12-14)
//  Glass wall + entrance L (row 13) | lobby (outside) + elevator E   | restroom door R
// The boss's desk (row 3): F his desk phone, Q his screen, facing the floor. W, behind it on the floor (row 2): the
// socket his cable runs down to. He sits south of the desk (row 4), his back to the glass.
const MAP = [
  '##############################', // 0
  '#.......G..........#TTCT.....#', // 1
  '#.W.....G..........#.........#', // 2
  '#..TFQ..G..TTJTTT..#....TTT..#', // 3
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
  W: { kind: 'boss_cable', solid: true, opaque: false, interactable: 'boss_cable', draw: 'floor' }, // the floor socket behind his desk: the loose plug
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
  cable: { x: 3, y: 2, face: 'W' }, // behind his desk, down at the floor socket: where Kev, you and he plug it back in
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
  kitchen_door: { x: 22, y: 7, face: 'N' }, // in the hallway at the kitchen door: Lin calls him from here
};

const ZONES = {
  desk: { x0: 11, y0: 9, x1: 16, y1: 11 },
  floor: { x0: 0, y0: 0, x1: 30, y1: 14 }, // anywhere in the office: he counts the list against the floor
  boss_office: { x0: 1, y0: 1, x1: 8, y1: 6 }, // his glass office: his private place (ROLES)
  outside: { x0: 0, y0: 14, x1: 30, y1: 17 },
};

// Kev's desk phone, on his desk (V): where it rings from, and where Lin turns to.
const KEV_PHONE = { x: 5.5, y: 11.4 };
const RING_SECS = 6; // your call to Kev's empty desk rings this long, then gives up
const BOSS_RING = 1.8; // the boss's 3:24 call rings this long before he gives up on Kev
const RING_LOOK = 4.2; // Lin looks round at it this long (she turns back about a second after): she saw Kev go
const LIN_NOTICE = 0.4; // seconds of your edit in her sight before she takes it in
const TELL_RANGE = 5.5; // tiles: she tells the boss once she is this close (the kitchen door to his machine is 5)
const EDIT_SECS = 3.0;

// The cable is at the floor behind his desk: you reach it from behind (row 2), not from his chair.
const behindDesk = (p) => p.y < 3;
const inOffice = (p) => p.x < 8 && p.y < 6; // his glass office (map rows 1-5, west of the glass at x 8)
// His screen faces the floor: you work it from in front of or beside his desk, not from behind.
const atScreen = (p) => p.y >= 3;

const INTERACTIONS = {
  // While he is out of his office (the restroom), pull his plug half out of the socket: the monitor goes black, the PC behind it still on.
  // He comes back to it, types his password into it blind, and it is no use (cast.js backAtDesk).
  pull_cable: {
    on: 'boss_cable', text: 'pull his plug out', duration: 1.0, sneaky: false,
    can: (p, w) => !w.glitch && w.pc === 'free' && w.list === 'on' && behindDesk(p),
    done(game) {
      game.world.glitch = true;
      game.world.pulledAt = game.clock.minute;
      game.events.emit('pc:pulled', {});
    },
  },
  // He has gone for coffee and left his screen dead: anyone may push the plug back in. While he sits there, the
  // cable is his business, and you have no reason to be behind his desk (he shows you out of his office).
  fix_cable: {
    on: 'boss_cable', text: 'plug his cable back in', duration: 1.5, sneaky: false,
    can: (p, w) => w.glitch && w.pc === 'free' && behindDesk(p),
    done(game) {
      const w = game.world;
      w.glitch = false;
      w.listUpAt = game.clock.minute; // the list comes up on his screen (list.js pops it out)
      game.events.emit('pc:fixedByYou', { afterCoffee: w.coffee !== 'none' }); // or pulled and pushed straight back
    },
  },
  call_kev: {
    on: 'boss_phone', text: "call Kev's desk", instant: true,
    can: (p, w) => w.pc === 'free' && w.kevGone && !w.ringing,
    done(game) {
      ringKev(game, RING_SECS);
      game.world.ringBy = 'player'; // his handset lies off on the desk while it rings (presentation.js)
      game.events.emit('phone:called', {});
    },
  },
  // His screen locked (the restroom): nothing gets past the padlock; it jolts (list.js).
  try_locked: {
    on: 'boss_pc', text: 'take your face off the list', instant: true,
    can: (p, w) => w.locked && !w.glitch && w.list === 'on' && atScreen(p),
    done(game) {
      game.world.lockJolt = game.clock.minute;
      say(game, 'player', ['🔒'], { kind: 'thought', ttl: 1.4 });
      game.events.emit('pc:triedLocked', {});
    },
  },
  strike_name: {
    on: 'boss_pc', text: 'take your face off the list', duration: EDIT_SECS, sneaky: true, owner: 'boss', saw: '🖥️',
    // owner: only the boss catches you at it in the engine. Lin's reaction is her own (linClock): a shout, then she tells.
    can: (p, w) => w.list === 'on' && w.pc === 'free' && !w.locked && !w.glitch && atScreen(p),
    done(game, a) {
      const w = game.world;
      const lin = game.npcs.find((n) => n.id === 'lin');
      w.list = 'off';
      w.listOffAt = game.clock.minute; // your face drops off his screen (list.js)
      w.offVia = w.linSaw ? 'seen' : lin?._heard ? 'ring' : w.linPhone === 'hand' ? 'phone' : w.ringing ? 'ring' : 'unseen';
      game.events.emit('list:edited', { via: w.offVia, x: a.x, y: a.y });
    },
  },
};

// What Lin's word costs you: he comes back and checks his screen first (the checkList lure), then looks for you.
function toldOn(game) {
  const w = game.world;
  w.told = true;
  w.bossTold = true;
  game.player.named = true; // he knows it was you (cast.js sendList; meeting.verdict: caught)
  if (w.coffee === 'going') w.coffee = 'told'; // he leaves the machine to it
  w.brewing = false;
  const boss = findNpc(game, 'boss');
  if (boss && (boss.override === 'toCoffee' || boss.override === 'brewing')) endOverride(boss);
  const lin = findNpc(game, 'lin');
  if (lin && (lin.override === 'toTell' || lin.override === 'telling')) endOverride(lin); // she's said it: back to her desk
}

const ROLES = {
  // Lin is not an engine witness (strike_name's owner is the boss): she tells him herself (linClock), and toldOn
  // is what her word costs you.
  authority: { id: 'boss', offDuty: ['toCheck', 'checking'], helpless: [], deafIn: null },
  // His office: if he sees you in it, 🤨, then 👉 you 🚪 and you walk back to your desk. Get in while he's away.
  private: [{ zone: 'boss_office', owner: 'boss' }],
};

// Kev didn't answer: he gives up on him and goes for a coffee, his screen still dead (clockFor sets w.coffee). There
// was nothing to lock: the monitor's off. The machine is slow; he walks back with his cup (presentation.js POSES) on his schedule.
const BREW_UNTIL = at('3:37', START);
const LURES = [
  // Told on: he goes straight to his screen (😠), puts your face back (index.js listen: 'boss:checks') and locks it.
  {
    npc: 'boss',
    when: (w) => w.bossTold && w.check === 'none',
    override: 'toCheck',
    plan: 'check',
    label: 'check his screen',
    spot: 'screen',
    react: { wait: 0.3 }, // (her 👉 is still up: no bubble of his own over it)
    work: {
      override: 'checking', minutes: SECS(1.5), progress: 'checkProgress',
      start: { set: { checking: true }, event: 'boss:checks', says: [{ say: ['😠'] }] },
      done: { set: { checking: false, check: 'done', locked: true }, event: 'boss:checked', says: [{ say: ['🔒'] }] },
    },
  },
  // Lin saw you cross your face out: she gets up and goes to tell him. She tells him where she meets him, at the
  // latest from the kitchen door (linClock, within TELL_RANGE of him); toldOn sends her back to her desk.
  {
    npc: 'lin',
    when: (w) => w.linTells === 'go' && !w.bossTold,
    override: 'toTell',
    plan: 'tell',
    label: 'tell the boss',
    spot: 'kitchen_door',
    react: { wait: 1.0 },
    work: {
      override: 'telling', minutes: SECS(2), progress: 'tellProgress',
      start: { set: { telling: true } },
      done: { set: { telling: false, linTells: 'done' } },
    },
  },
  {
    npc: 'boss',
    when: (w) => w.coffee === 'going',
    override: 'toCoffee',
    plan: 'coffee',
    label: 'get a coffee',
    spot: 'coffee',
    // fed up with the black screen and nobody coming: a sigh, and he goes for a coffee while he waits
    react: { wait: 0.6, says: [{ say: ['😮‍💨', '☕'], kind: 'thought' }], event: 'boss:coffee' },
    work: { override: 'brewing', minutes: 60, progress: 'brewProgress', start: { set: { brewing: true } } },
  },
];

const NOISES = {
  // Kev's desk phone ringing: Lin, beside it, turns round to it, sees the empty desk and turns back (ringLook).
  'phone:ring': {
    at: KEV_PHONE, radius: 6, npcs: ['lin'], every: 1.1, turn: 1.4, while: (w) => w.ringLook,
    ripple: { color: '#f3e6c8' }, sfx: 'phoneRing',
  },
};

// Lin's mobile buzzes on her desk at uneven times; a beat later she picks it up and turns away to read it (about
// 4 s). Each buzz is visible (presentation.js: the phone shakes on her desk) before she looks away.
const BUZZ = ['3:04', '3:11.5', '3:17', '3:21', '3:24.5', '3:30.2', '3:33.6', '3:37.5', '3:40', '3:43'].map((t) => at(t, START));
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

// The boss's check as world state.
const listening = new WeakSet();
function listen(game) {
  if (listening.has(game.events)) return;
  listening.add(game.events);
  const ours = () => game.level?.id === 'layoffs' && game.phase === 'day';
  // He puts your face back: the list pops out again with you on it.
  game.events.on('boss:checks', () => {
    if (!ours()) return;
    const w = game.world;
    w.list = 'on';
    w.struck = 0;
    w.offVia = null;
    w.listUpAt = game.clock.minute;
  });
  // Locked: he turns round on you.
  game.events.on('boss:checked', () => {
    const b = ours() && findNpc(game, 'boss');
    if (b) b._faceTarget = Math.atan2(game.player.y - b.y, game.player.x - b.x);
  });
}

function bossClock(game, npc, sim) {
  const w = game.world;
  const now = game.clock.minute;
  const st = (npc._lay ??= {});
  listen(game);
  if (w.ringing && w.ringUntil != null && now >= w.ringUntil) w.ringing = false;
  if (!w.ringing) w.ringFrom = null;
  else if (w.ringFrom == null) w.ringFrom = now;
  w.ringLook = w.ringing && now < w.ringFrom + SECS(RING_LOOK);
  const a = game.player.action;
  if (a?.type === 'strike_name') w.strikeT = Math.min(1, a.t / Math.max(a.duration, 0.001)); // how far you got
  // His blind login (cast.js backAtDesk): a clack per asterisk, then the Enter, hard.
  if (st.keys?.length && now >= st.keys[0]) {
    st.keys.shift();
    game.events.emit('boss:key', {});
  }
  if (st.enterAt != null && now >= st.enterAt) {
    st.enterAt = null;
    game.events.emit('boss:enter', {});
  }
  // About 3:24 (cast.js backAtDesk): a beat after the thump, he phones Kev's desk; it rings out, and he wonders where Kev is.
  if (st.callAt != null && now >= st.callAt) {
    st.callAt = null;
    if (w.glitch && free(npc)) {
      sim.speak(game, npc, [{ say: ['☎️', '@kev'] }]);
      w.bossPhoneUntil = now + SECS(BOSS_RING); // the handset at his ear while it rings out
      ringKev(game, BOSS_RING);
      st.askAt = now + SECS(BOSS_RING + 0.4);
    }
  }
  if (st.askAt != null && now >= st.askAt) {
    st.askAt = null;
    if (w.glitch && free(npc)) {
      sim.speak(game, npc, [{ say: ['@kev', '❓'], kind: 'thought' }]);
      st.goAt = now + SECS(0.8);
    }
    const lin = findNpc(game, 'lin');
    if (free(lin)) say(game, 'lin', ['🤷'], { kind: 'thought', ttl: 1.2 }); // not her business where Kev went
  }
  // Nobody is coming: he leaves the dead screen and goes for a coffee (the coffee lure).
  if (st.goAt != null && now >= st.goAt) {
    st.goAt = null;
    const p = game.player;
    if (w.glitch && w.coffee === 'none' && free(npc) && inOffice(p)) {
      // You're still in his office (pretending behind his desk, say): he won't leave you there. Out first (the
      // engine's private place: 👉 you 🚪, and you walk back to your desk).
      showOutNow(game, 'boss');
      st.goAt = now + SECS(1.0);
    } else if (w.glitch && w.coffee === 'none' && free(npc)) {
      w.coffee = 'going';
      w.pc = 'free';
    }
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
      say(game, 'lin', ['📱'], { kind: 'thought', ttl: READ_FOR * 0.8 }); // her back to his office, reading
      game.events.emit('lin:reads', {});
    }
  }
  if (st.down != null && now >= st.down) {
    st.down = null;
    w.linPhone = 'desk';
  }
  // Your call rings Kev's empty desk: she turns round to it (NOISES), her back to his office.
  if (w.ringLook && w.pc === 'free' && npc._heard && st.rangFor !== w.ringFrom) {
    st.rangFor = w.ringFrom;
    say(game, 'lin', ['👀', '☎️'], { kind: 'thought', ttl: 1.6 });
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
  linWatch(game, npc, now, st, sim);
  return now;
}

// Lin watches his office. If she sees you crossing your face out, she shouts (❗👉 you), and the thought behind it
// follows: your gap on the list could be filled with hers (📋, her face, 😨). Then she gets up and goes to tell him
// (the linTells lure); he is in the kitchen and doesn't hear the shout.
function linWatch(game, npc, now, st, sim) {
  const w = game.world;
  const p = game.player;
  const dt = st.last == null ? 0 : now - st.last;
  st.last = now;
  if (w.linTells === 'none' && !w.bossTold) {
    if (p.action?.type === 'strike_name' && free(npc) && npcSees(game, npc, p.x, p.y)) {
      st.sawFor = (st.sawFor ?? 0) + dt;
      if (st.sawFor >= SECS(LIN_NOTICE)) {
        w.linTells = 'go';
        w.linSaw = true;
        sim.speak(game, npc, [
          { say: ['❗', '👉', '@player'], ttl: 1.2 },
          { say: ['📋', '@lin', '😨'], kind: 'thought', ttl: 2.0, after: 1.2 },
        ]);
        sightline(game, 'lin', 'notice', 1.0);
        game.events.emit('lin:sees', {});
      }
    } else st.sawFor = 0;
  }
  // Up and on her way: she tells him where she meets him.
  if (w.linTells === 'go' && !w.bossTold && (npc.override === 'toTell' || npc.override === 'telling')) {
    const boss = findNpc(game, 'boss');
    if (boss?.active && Math.hypot(boss.x - npc.x, boss.y - npc.y) <= TELL_RANGE) {
      say(game, 'lin', ['👉', '@player', '🖥️'], { kind: 'speech', ttl: 1.6 });
      sightline(game, 'lin', 'tattle', 1.4);
      w.linTells = 'done';
      game.events.emit('lin:tells', {});
      toldOn(game);
    }
  }
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
    gatherAt: at('3:42', START), // back at his desk, coat on
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
  // He sends from his desk wherever you are; the fail plays where you stand. Told on: he put your face back and
  // locked it, and he knows who did it: he sends it, and that's you caught.
  meeting: {
    override: 'send', room: 'floor', chair: 'player_desk',
    verdict: (game) => (game.world.check === 'done' ? { result: 'caught', why: 'told' } : null),
  },
  routes: [
    { id: 'ring', icon: '☎️', achieved: (w) => w.list === 'off' && w.offVia === 'ring' },
    { id: 'phone', icon: '📱', achieved: (w) => w.list === 'off' && w.offVia !== 'ring' && w.offVia !== 'seen' }, // 'unseen': the gate flags it
  ],
  outcomeOrder: ['ring', 'phone'],
  initialWorld: () => ({
    list: 'on', // your face on the layoff list: 'on' | 'off'
    listUpAt: null, // the game minute the list came up on his screen (list.js pops it out)
    linReadAt: null, // the game minute Lin read it over his shoulder (about 3:08, Kev fixed it)
    listOffAt: 0, // the game minute your face came off (list.js animates it)
    offVia: null, // what Lin was doing meanwhile: 'ring' | 'phone' | 'unseen' | 'seen' (she watched: he'll be told)
    glitch: true, // monitor black: its cable has worked loose (3:00 until Kev fixes it; again from your pull until you plug it back in)
    pc: 'boss', // 'boss' (he's at it) | 'kev' (Kev at his cable) | 'free' (he's out)
    locked: false, // he locked it for the restroom (3:10 to 3:22)
    ringing: false, // Kev's desk phone is ringing
    ringBy: null, // who is ringing it: 'player' (from the boss's phone) | null (the boss, or Kev's own calls)
    ringFrom: null, // the game minute it started ringing
    ringLook: false, // Lin is looking round at it (the first RING_LOOK seconds)
    ringUntil: null, // the game minute it gives up (null: until Kev picks up)
    kevCall: false, // Kev has the handset at his ear
    bossPhoneUntil: null, // the game minute the boss puts his handset down
    kevUp: false, // Kev has his bag: going home
    kevGone: false,
    coffee: 'none', // 'none' | 'going' (he gave up on Kev and left his dead screen) | 'done' (he has his cup) | 'told'
    lockJolt: null, // the game minute you tried his locked screen (list.js jolts the padlock)
    brewing: false,
    brewProgress: 0,
    buzzAt: null, // the game minute Lin's mobile last buzzed
    linPhone: 'desk', // 'desk' | 'hand' (she's reading it, turned away)
    linSaw: false, // Lin saw you crossing your face out
    told: false, // ...and she told the boss (where she met him)
    linTells: 'none', // 'none' | 'go' (out of his earshot, she walks to the kitchen to tell him) | 'done'
    telling: false,
    tellProgress: 0,
    bossTold: false, // he heard: he comes back to check his screen (toldOn)
    check: 'none', // 'none' | 'done': he checked his screen, put your face back and locked it
    checking: false,
    checkProgress: 0,
    strikeT: 0, // how far your edit got (0..1)
    struck: 0, // your face half crossed out on his screen: Lin stopped you there (until he checks)
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
