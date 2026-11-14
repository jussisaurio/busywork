// Level 1's words for the AI-agent harness (src/agent/harness.js reads them as game.level.harness): the goto
// landmarks, the events that interrupt a command, and the text a human would read off the screen. Text and
// command stops only: nothing here changes what happens in a day.
//
//   mission      the line tools/play.mjs prints before the help
//   landmarks    extra `goto` names (besides interactable ids and "x,y") -> spot names. `sit` walks to my_seat.
//   stops        level events that end a waiting/walking command early, on top of the harness's own
//                (caught, day:end; soft: witness:notice, witness:tattle, action:cancel)
//   names        how event lines name people (default: the id)
//   mapKey       the legend lines printed above the ASCII map
//   outcomeText(outcome)  the DAY OVER verdict
//   playerText(game)      extra YOU bits, after "hands"
//   statusText(game)      what a human reads over people's heads
//   npcText(game, npc)    extra bits for a visible NPC, after "CAN SEE YOU"
//   worldText(game)       the WORLD line: only what is visible on screen
//   describe(event, memo) one line for a level event, null to say nothing, undefined for the harness's own
//                         text. memo: a scratch object, fresh for each describeEvents() call.

const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
const name = (id) => NAME[id] ?? id;

const PROJECTOR = { ok: 'working', broken: 'sparking and smoking 💥', fixing: 'Kev is working on it 🔧' };
const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);

export default {
  mission: 'MISSION: 4:00 PM. You promised slides. You made none. Make sure the meeting never happens.',

  landmarks: {
    my_seat: 'player_desk',
    boss_desk: 'boss_desk',
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    boss_office_door: 'boss_door',
    kitchen_table: 'kitchen_table',
    entrance: 'door_in',
    restroom_door: 'restroom',
    meeting_room: 'meeting_presenter',
    meeting_seat: 'meeting_player',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'sandwich:returned', 'coffee:confiscated'],
  },

  names: NAME,

  mapKey: [
    'MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : outside lobby, L entrance (glass door, staff keycard),',
    '     K coat rack, F fridge, C coffee machine, J projector (sticker on it: ☕🚫), P your desk, R restroom, E elevator, i item,',
    '     @ you, b boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (meeting cancelled via: ${o.routes.join(' + ')})`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠 (fired: you leave with a box 📦)'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (the meeting fell apart via ${o.routes.join(' + ')}, but everyone was in the meeting room except you)`
    : 'FAIL: the meeting happened and you presented a blank slide 🦗'),

  playerText: (game) => (game.player.smeared ? ['mustard down your sweater'] : []),

  // Only what a player would see: the ❓ meter over the boss's head (when it shows).
  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.override === 'lockedOut') bits.push('stuck outside the entrance');
    if (n.override === 'fixing') bits.push(`fixing the projector ${Math.round(game.world.fixProgress * 100)}%`);
    if (n.carry) bits.push(`holding ${n.carry === 'coffee' ? 'a coffee ☕' : n.carry}`);
    return bits;
  },

  // Only what is visible on screen (the fridge is opaque; pockets are private).
  worldText(game) {
    const w = game.world;
    const rack = w.jacket === 'rack' ? `the boss's jacket${w.keycard === 'rack' ? ' (a keycard clipped to it)' : ''}` : 'nothing';
    const floor = w.items.length ? `; on the floor: ${w.items.map((i) => `${i.type}@(${f1(i.x)},${f1(i.y)})`).join(', ')}` : '';
    const pot = w.coffee === 'pot' ? 'a full pot of coffee' : 'an empty pot';
    return `WORLD: projector ${PROJECTOR[w.projector] ?? w.projector}; coffee machine: ${pot}; coat rack holds ${rack}${floor}`;
  },

  describe(e, memo) {
    const p = e.payload ?? {};
    switch (e.name) {
      case 'witness:tattle': return p.reason === 'contraband'
        ? `${name(p.by)} saw what you're carrying 😠`
        : p.late
          ? `${name(p.by)} points you out to the boss 👉${p.icon ?? ''} (seen earlier, told now)`
          : `${name(p.by)} shouts and points at you ${p.reason === 'evidence' ? '🥪❗👉' : '❗👉'}${p.heard ? ' (the boss heard)' : ' (the boss is away… for now)'}`;
      case 'coffee:taken': return p.by === 'player' ? 'you poured the coffee ☕ (the pot is empty now)' : `${name(p.by)} poured the coffee ☕ (the pot is empty now)`;
      case 'coffee:missing': return `${name(p.by)} found the coffee pot empty`;
      case 'coffee:confiscated': return `${name(p.by)} took the coffee off you ☕`;
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'projector:broken': return 'the projector is broken 💥';
      case 'kev:alerted': return 'Kev heard the projector 🔧❗';
      case 'projector:fixing': return 'Kev is fixing the projector';
      case 'projector:fixed': return 'the projector is fixed';
      case 'keycard:taken': return 'you took the keycard 🪪';
      case 'keycard:recovered': return 'the boss spotted his keycard on the floor and pocketed it 🪪❗';
      case 'sandwich:taken': return 'you took the sandwich 🥪';
      case 'sandwich:eaten': return 'you ate the sandwich';
      case 'sandwich:returned': return 'Lin took her sandwich back';
      case 'sandwich:missing': return 'Lin found the fridge empty';
      case 'boss:jacket': return 'the boss put on his jacket and walks off';
      case 'boss:lockedOut': return 'the boss is locked out at the entrance!';
      case 'boss:bang': // one line per 3 game minutes of banging
        if (e.minute - (memo.lastBang ?? -Infinity) > 3) {
          memo.lastBang = e.minute;
          return 'the boss bangs on the glass';
        }
        return null;
      case 'kev:left': return 'ding: the elevator doors close behind Kev';
      case 'meeting:gather': return 'everyone heads to the meeting room';
      default: return undefined;
    }
  },
};
