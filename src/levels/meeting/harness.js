// Level 1's words for the AI-agent harness (src/agent/harness.js reads them as game.level.harness): the goto
// landmarks, the events that interrupt a command, and the text a human would read off the screen. Text and
// command stops only: nothing here changes what happens in a day.
//
//   mission      the line tools/play.mjs prints before the help
//   landmarks    extra `goto` names (besides interactable ids and "x,y") -> spot names. my_seat (-> player_desk,
//                where `sit` walks) is built in (levels/validate.js ENGINE_LANDMARKS).
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
const SPOT = { coffee: 'the coffee machine', kev_desk: 'Kev\'s desk', my_desk: 'your desk' }; // put spots (map.js)

export default {
  mission: 'MISSION: 4:00 PM. You promised slides. You made none. Make sure the meeting never happens.',

  landmarks: {
    boss_desk: 'boss_desk',
    lin_desk: 'lin_desk',
    kev_desk: 'kev_desk',
    my_desk_spot: 'my_desk', // beside your seat: where you set things down on your desk
    boss_office_door: 'boss_door',
    kitchen_table: 'kitchen_table',
    entrance: 'door_in',
    restroom_door: 'restroom',
    fire_door: 'fire_door', // the balcony side: NPCs only (goto walks you as close as you get)
    meeting_room: 'meeting_presenter',
    meeting_seat: 'meeting_player',
  },

  stops: {
    hard: ['boss:workAssigned'],
    soft: ['boss:suspicious', 'sandwich:returned', 'coffee:kevTook'],
  },

  names: NAME,

  mapKey: [
    'MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : outside lobby, L entrance (glass door, staff keycard),',
    '     K coat rack, F fridge, C coffee machine, J projector (sticker on it: ☕🚫), P your desk, R restroom, X fire door (staff keycard) onto = the smokers\' balcony (outside), E elevator, i item,',
    '     @ you, b boss, l Lin, k Kev, * floor someone can see right now):',
  ],

  // o.why: the verdict's reason (verdict.js): 'mug' you held the cup, 'desk' it sat on your desk, 'kev' it sat on his.
  outcomeText: (o) => (o.result === 'win' ? `WIN 🎉 (meeting cancelled via: ${o.routes.join(' + ')})${o.why === 'kev' ? '; the whole table stares at Kev\'s empty chair ☕👉' : ''}`
    : o.result === 'caught' ? 'CAUGHT by the boss 😠 (fired: you leave with a box 📦)'
    : o.result === 'blamed' && o.why === 'mug' ? 'BLAMED ☕👉 (the projector died of coffee, and the empty mug is in your hand)'
    : o.result === 'blamed' && o.why === 'desk' ? 'BLAMED ☕👉 (the projector died of coffee, and the empty mug is on your desk)'
    : o.result === 'blamed' ? `BLAMED 🪑👉 (the meeting fell apart via ${o.routes.join(' + ')}, but everyone was in the meeting room except you)`
    : 'FAIL: the meeting happened and you presented a blank slide 🦗'),

  // Only what a player would see: the ❓ meter over the boss's head (when it shows).
  statusText: (game) => (game.suspicion.boss > 0 ? [`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`] : []),

  npcText(game, n) {
    const bits = [];
    if (n.override === 'lockedOut') bits.push('locked out on the balcony, behind the fire door');
    if (n.override === 'fixing') bits.push(`fixing the projector ${Math.round(game.world.fixProgress * 100)}%`);
    if (n.override === 'hunting' && n.id === 'boss') bits.push('searching the office, peering at every desk');
    if (n.carry) bits.push(`holding ${n.carry === 'coffee' ? 'a coffee ☕' : n.carry}`);
    return bits;
  },

  // Only what is visible on screen (the fridge is opaque; pockets are private).
  worldText(game) {
    const w = game.world;
    const rack = w.jacket === 'rack' ? `the boss's jacket${w.keycard === 'rack' ? ' (a keycard clipped to it)' : ''}` : 'nothing';
    const loose = w.items.filter((i) => !i.spot);
    const floor = loose.length ? `; on the floor: ${loose.map((i) => `${i.type}@(${f1(i.x)},${f1(i.y)})`).join(', ')}` : '';
    const put = w.items.filter((i) => i.spot).map((i) => `; ${i.type === 'coffee' ? 'a full cup of coffee' : `the empty ${i.type}`} ☕ sits on ${SPOT[i.spot] ?? i.spot}`).join('');
    const pot = `${w.coffee === 'pot' ? 'one last cup in the pot' : 'an empty pot'}, an empty coffee bag beside it`;
    return `WORLD: projector ${PROJECTOR[w.projector] ?? w.projector}; coffee machine: ${pot}; coat rack holds ${rack}${floor}${put}`;
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
      case 'coffee:kevTook': return `Kev spots the cup on ${SPOT[p.spot] ?? p.spot}, unattended, and takes it 🤤☕ … 😌`;
      case 'coffee:asked': return 'Kev eyes the cup in your hand ☕🥺❓ (he asks; he doesn\'t grab)';
      case 'keycard:takenBack': return 'the boss takes his keycard back off you 🪪';
      case 'boss:badge': return 'beep: the boss holds his keycard to the fire door\'s reader and comes back in 🪪';
      case 'meeting:calledOff': return 'the boss points at the dead projector 📽️💥🙅 and waves everyone out 👋🚪';
      case 'boss:suspicious': return 'the boss eyes you ❓ (a meter over his head starts filling)';
      case 'boss:workAssigned': return `the boss assigned you work 📄 (${p.reason})`;
      case 'projector:broken': return 'the projector is broken 💥';
      case 'kev:alerted': return 'Kev heard the projector 🔧❗';
      case 'projector:fixing': return 'Kev is fixing the projector';
      case 'projector:fixed': return 'the projector is fixed';
      case 'keycard:taken': return 'you took the keycard 🪪';
      case 'keycard:recovered': return 'the boss spotted his keycard on the floor, walked over and picked it up 🪪❗';
      case 'sandwich:taken': return 'you took the sandwich 🥪';
      case 'sandwich:eaten': return 'you ate the sandwich';
      case 'sandwich:returned': return 'Lin took her sandwich back';
      case 'sandwich:missing': return 'Lin found the fridge empty';
      case 'boss:jacket': return 'the boss put on his jacket and walks off';
      case 'boss:lockedOut': return 'the boss tries the fire door: the reader blinks red, the handle rattles. No keycard on him: he\'s locked out on the balcony!';
      case 'boss:pockets': return null; // his 🪪❓ says it
      case 'boss:knock': case 'boss:bang': case 'boss:pound': case 'boss:fume': { // one line per 3 game minutes
        if (e.minute - (memo.lastBang ?? -Infinity) <= 3) return null;
        memo.lastBang = e.minute;
        return { 'boss:knock': 'knock knock: the boss at the fire door ✊🚪', 'boss:bang': 'the boss bangs on the fire door 😠🚪🪪',
          'boss:pound': 'the boss pounds on the fire door with both fists 👊👊🚪', 'boss:fume': 'the boss lights another cigarette, fuming 🚬😤' }[e.name];
      }
      case 'kev:left': return 'ding: the elevator doors close behind Kev';
      case 'boss:mugHunt': return 'the boss stares at the dead projector 📽️💥, then around the office ☕❓ (he goes looking for the cup)';
      case 'mug:found': return p.spot === 'kev_desk' ? 'the boss spots the empty mug on Kev\'s desk ☕❗, then glares at Kev 😠'
        : `the boss spots the empty mug on ${SPOT[p.spot] ?? p.spot} ☕🤷`;
      case 'item:put': return `you put the ${p.type} down on ${SPOT[p.spot] ?? p.spot}`;
      case 'meeting:gather': return 'everyone heads to the meeting room';
      default: return undefined;
    }
  },
};
