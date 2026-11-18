// Level validation: the registry (src/levels/index.js) runs validateLevel once per level as it builds, so a level
// that names something it doesn't have fails at load, with every problem listed, instead of misbehaving mid-day
// (an NPC walking to nowhere, a silent generic voice, a prop that never draws).
//
//   validateLevel(level, key)  throws one Error: "level '<key>' is broken:" and one line per problem, each
//                              starting with the field path (e.g. "cast[1] (kev).meetingSpot: no spot 'x'")
//   levelProblems(level, key)  the same lines as a list (empty: the level is fine)
//
// The rules, by field (a field marked optional is checked only when present):
//   id          a string equal to the registry key
//   title       { mission: [line, line], badge: [icon, overlay] }
//   map         { rows, legend? }: parseMap accepts it (equal row lengths, every letter in the legend); each legend
//               entry has a kind and boolean solid/opaque; its `draw` (optional) one of render/world.js TILE_DRAWS
//   spots       each { x, y } inside the map on a tile an NPC can stand on, face (optional) N/E/S/W; player_desk
//               present (the engine's: you start there, `sit` and the harness's my_seat go there)
//   zones       each { x0, y0, x1, y1 } with x0 < x1, y0 < y1, inside the map
//   patrols     optional; each a list of [x, y] inside the map
//   cast        a list; ids unique strings, not 'player'; schedule non-empty with `at` in order, `do` one of sit,
//               visit, patrol, away, leave, say; sit/visit/away/leave name a spot, patrol a patrols route, say
//               icons; some entry names a spot (the start); prelude (a name or a list) and arrive name behaviours,
//               a prelude's with a spot; meetingSpot a spot; meetingArrive a behaviour; voice (optional) a name
//               in the engine's voices or level.voices
//   behaviours  optional; each { arrive(), spot?, pending()? }, spot a spot
//   day         start (a minute-of-day: the clock shows it), gatherAt, meetingAt numbers, gatherAt <= meetingAt;
//               the cosmetic cue times (config.js DAY_CUES) numbers if present; absent ones default (dayCue)
//   meeting     { override, room (a zone), chair (a spot), presenter? (a spot; none: a fail plays where you stand), verdict? (a function),
//               where? (names: zones, or places you go inside; scenario.js outcome.where) }
//   interactions  an object of rows; `on` an interactable type on the map, or 'self', 'item' or 'spot';
//               noise.at (optional) a spot or an { x, y } on the map; no `icon` (*: the target lights up with the E key cap instead);
//               a 'self' row's preview one of render/characters.js ARM_POSES (the player's pose while it is what E
//               would do: nothing else shows it), its hold (optional) a boolean
//   noise timing  (a row's noise and level.noises', each optional) delay >= 0, every > 0, turn > 0 numbers; while
//               a function; ripple true or { color? (a string) }; sfx a recipe name in audio/sfx.js
//   items       optional; each an icon (the emoji people say for it, in bubbles); a draw (*: required): how it is
//               drawn on the floor, in a hand and in the HUD, an engine thing's name (render/things.js THINGS) or
//               a painter function; tint (optional) a colour, or 'owner' with an owner; owner.id and contraband
//               cast ids; put seconds; keep and bulky booleans; edible { leaves, icon?, burst? } with leaves a config.js MARKS name
//               or null, said out loud (no default: what eating leaves on you is the item's); disguise { as (a cast id), look? (an object of look
//               fields), greet? (a list of lines) } (src/play/disguise.js)
//   roles       optional; authority.id, evidence.by, scene.by cast ids; authority.deafIn and scene.zone zones; authority.earshot > 0;
//               authority.tattle 'work', 'caught' or a function (src/play/rules.js tattleHeard); private a list of
//               { zone, owner (a cast id), offDuty? (a list) }
//   lures, hunts, doors, inspections, fetches, noises, spots' put-down fields: every npc, spot, zone, route, item type
//               and behaviour they name exists (src/sim/mechanics/* documents each); an inspection that fails
//               into 'hunt' needs a hunt for its npc; an inspection's sign is 'mark' or 'item', a check's icon an
//               icon or a list, its absent true or false; a count check a whole count >= 1 with a non-empty spots
//               list or a zone (then a from); its look a number, its record (on an item or count check) a field of
//               initialWorld(); a noise is not 'noise' or 'npc:heard'; a fetch has an override, a plan and a
//               caught time >= 0 (if any)
//   darkness    optional; rooms a list of { zone (a zone or a list of zones), lit() }; near.radius a number;
//               torch { when(), fov, radius }; controls a list of { tile (a legend letter on the map), kind (one of
//               game/darkness.js CONTROL_KINDS), on() } (src/game/darkness.js)
//   failSign    optional; spot a spot
//   cameras     optional (src/sim/mechanics/camera.js); ids unique strings; x, y (the lens) on the map; dir, fov,
//               radius numbers; sweep { arc, period > 0 }; aim, live functions; monitor an { x, y } on the map;
//               npcs a non-empty list of cast ids; reach positive
//   routes      a non-empty list of { id, icon, achieved() }, ids unique
//   outcomeOrder  every route id exactly once
//   initialWorld  a function returning an object with an `items` list
//   harness     optional; landmarks name spots (my_seat is built in: ENGINE_LANDMARKS)
//   gate        optional; targets are interactable ids, landmarks (the level's or the engine's) or "x,y";
//               interactable targets; mustUse (routes: route ids)
//               { id, cmd | event }; milestones functions; renderEvents (optional) a list of event names;
//               budget (optional) a whole number of days of 1 or more: what tools/gate.mjs fuzzes without --budget
//   decor       optional; chairs, deskOwners, ashtray, elevator name spots; a deskOwners spot faces onto a desk
//               tile (render/world.js DESK_DRAWS); props draw with a renderer painter
//               (render/world.js PROP_PAINTERS) or a painter function of the level's, on a legend letter
//               that is on the map (*: not the 'icon' painter, an emoji on a tile); things (optional) the level's
//               '#<name>' things, each an engine thing's name or a painter function (render/things.js)
//   poses       optional; arms and marks lists of rules with a when() (*: an arms rule's item a '#<thing>' that
//               draws: an item type with a draw, a decor.things name or an engine thing, never an emoji)
//   sounds      optional; every spec's spot a spot, `who` 'player' or a cast id; murmur and elevator spots
//   endScenes   optional (default: render/screens.js DEFAULT_END_SCENES); kindOf() maps every possible outcome to a
//               scene in scenes, each { win, icons, draw() }; a lost outcome with `stopped` (sent to your desk) may
//               give 'stopped' without one (the engine's card: screens.js STOPPED_SCENE)
//   voices      optional; an object of voice objects
// (*) The visual language (DESIGN.md "Visual language": people speak emoji, the world is drawn). These rules hold
// for every level; speech (bubbles, says, sightings' `saw`, end-card
// icon rows) is never checked.
import { parseMap } from '../core/map.js';
import { DAY_CUES, MARKS } from '../config.js';
import { DIRS } from '../core/vision.js';
import { voicesFor } from '../audio/babble.js';
import * as SFX from '../audio/sfx.js';
import { DESK_DRAWS, PROP_PAINTERS, TILE_DRAWS } from '../render/world.js';
import { THINGS } from '../render/things.js';
import { ARM_POSES } from '../render/characters.js';
import { CONTROL_KINDS } from '../game/darkness.js';
import { BURST_KINDS as BURSTS } from '../core/fx.js';

const DOS = new Set(['sit', 'visit', 'patrol', 'away', 'leave', 'say']);
const SPOT_DOS = new Set(['sit', 'visit', 'away', 'leave']);
const ROW_TARGETS = new Set(['self', 'item', 'spot']); // besides the map's interactable types
const FAIL_THEN = new Set(['caught', 'stare', 'hunt']);
const SCENE_RESULTS = ['caught', 'fail'];

// goto names every level has, on top of its harness.landmarks (agent/harness.js): your own desk.
export const ENGINE_LANDMARKS = { my_seat: 'player_desk' };

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isFn = (v) => typeof v === 'function';
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isStr = (v) => typeof v === 'string' && v.length > 0;
const q = (v) => `'${v}'`;

export function levelProblems(level, key) {
  const out = [];
  const bad = (path, msg) => out.push(`${path}: ${msg}`);
  if (!isObj(level)) return ['level: not an object'];
  const thingNames = Object.keys(THINGS).join(', ');
  const painter = (path, d, what) => { // an engine thing's name or a painter function
    if (!isFn(d) && !(isStr(d) && Object.hasOwn(THINGS, d))) bad(path, `${what} (an engine thing: ${thingNames}; or a painter function)`);
  };

  // --- names the rest refers to -----------------------------------------------------------------
  const spots = isObj(level.spots) ? level.spots : {};
  const zones = isObj(level.zones) ? level.zones : {};
  const patrols = isObj(level.patrols) ? level.patrols : {};
  const behaviours = isObj(level.behaviours) ? level.behaviours : {};
  const items = isObj(level.items) ? level.items : {};
  const cast = Array.isArray(level.cast) ? level.cast : [];
  const castIds = new Set(cast.map((c) => c?.id));
  const has = (o, name) => isStr(name) && Object.hasOwn(o, name);
  const spot = (path, name) => { if (!has(spots, name)) bad(path, `no spot ${q(name)}`); };
  const zone = (path, name) => { if (!has(zones, name)) bad(path, `no zone ${q(name)}`); };
  const npc = (path, id) => { if (!castIds.has(id) || !isStr(id)) bad(path, `no cast member ${q(id)}`); };
  const behaviour = (path, name) => { if (!has(behaviours, name)) bad(path, `no behaviour ${q(name)} in level.behaviours`); };
  const route = (path, name) => { if (!has(patrols, name)) bad(path, `no route ${q(name)} in level.patrols`); };
  const itemType = (path, type) => { if (!has(items, type)) bad(path, `no item type ${q(type)} in level.items`); };
  const list = (path, v) => { if (!Array.isArray(v)) { bad(path, 'not a list'); return []; } return v; };
  const itemTypes = (path, v) => { // one item type or a non-empty list of them
    if (!Array.isArray(v)) return itemType(path, v);
    if (!v.length) bad(path, 'empty');
    for (const [k, t] of v.entries()) itemType(`${path}[${k}]`, t);
  };
  const icons = (path, v) => { if (!isStr(v) && !(Array.isArray(v) && v.every(isStr))) bad(path, 'not an icon or a list of icons'); };
  const noiseTiming = (path, n) => {
    if (!isObj(n)) return;
    if (n.delay !== undefined && !(isNum(n.delay) && n.delay >= 0)) bad(`${path}.delay`, 'not a number >= 0 (s)');
    for (const k of ['every', 'turn']) if (n[k] !== undefined && !(isNum(n[k]) && n[k] > 0)) bad(`${path}.${k}`, 'not a number > 0 (s)');
    if (n.while !== undefined && !isFn(n.while)) bad(`${path}.while`, 'not a function (world) -> bool');
    if (n.sfx !== undefined && !(isStr(n.sfx) && isFn(SFX[n.sfx]))) bad(`${path}.sfx`, `no sound ${q(n.sfx)} in audio/sfx.js`);
    const rp = n.ripple;
    if (rp !== undefined && rp !== true && !(isObj(rp) && (rp.color === undefined || isStr(rp.color)))) bad(`${path}.ripple`, 'not true or { color? }');
  };

  // --- identity and title -----------------------------------------------------------------------
  if (!isStr(level.id)) bad('id', 'missing');
  else if (key !== undefined && level.id !== key) bad('id', `${q(level.id)} differs from its registry key ${q(key)}`);
  const t = level.title;
  if (!isObj(t)) bad('title', 'missing ({ mission: [line, line], badge: [icon, overlay] })');
  else {
    if (!Array.isArray(t.mission) || t.mission.length !== 2 || !t.mission.every((s) => typeof s === 'string')) bad('title.mission', 'not two lines');
    if (!Array.isArray(t.badge)) bad('title.badge', 'not a list of icons');
  }

  // --- map --------------------------------------------------------------------------------------
  let map = null;
  if (!isObj(level.map) || !Array.isArray(level.map.rows) || !level.map.rows.length) bad('map.rows', 'missing');
  else {
    const legend = level.map.legend ?? {};
    for (const [c, d] of Object.entries(legend)) {
      const path = `map.legend[${q(c)}]`;
      if (c.length !== 1) bad(path, 'not one letter');
      if (!isObj(d)) { bad(path, 'not an object'); continue; }
      if (!isStr(d.kind)) bad(`${path}.kind`, 'missing');
      if (typeof d.solid !== 'boolean') bad(`${path}.solid`, 'not true or false');
      if (typeof d.opaque !== 'boolean') bad(`${path}.opaque`, 'not true or false');
      if (d.draw !== undefined && !TILE_DRAWS.includes(d.draw)) bad(`${path}.draw`, `no tile draw ${q(d.draw)} (${TILE_DRAWS.join(', ')})`);
    }
    try {
      map = parseMap(level.map.rows, legend);
    } catch (e) {
      bad('map', e.message);
    }
  }
  const inMap = (x, y) => !map || (x >= 0 && y >= 0 && x < map.w && y < map.h);
  // A noise's `at`: a spot, or a point { x, y } (tile units) anywhere on the map (sim/mechanics/attention.js).
  const noiseAt = (path, at) => {
    if (!isObj(at)) spot(path, at);
    else if (!isNum(at.x) || !isNum(at.y) || !inMap(at.x, at.y)) bad(path, 'not a spot or an { x, y } on the map');
  };
  const interTypes = new Set((map?.interactables ?? []).map((i) => i.type));
  const interIds = new Set((map?.interactables ?? []).map((i) => i.id));

  // --- spots, zones, patrols --------------------------------------------------------------------
  if (!isObj(level.spots)) bad('spots', 'missing');
  else if (!has(spots, 'player_desk')) bad('spots.player_desk', "missing (you start there; `sit` and my_seat walk there)");
  for (const [name, s] of Object.entries(spots)) {
    const path = `spots.${name}`;
    if (!isObj(s) || !Number.isInteger(s.x) || !Number.isInteger(s.y)) { bad(path, 'not { x, y } in whole tiles'); continue; }
    if (!inMap(s.x, s.y)) bad(path, `(${s.x}, ${s.y}) is off the map`);
    else if (map && !map.isWalkable(s.x, s.y, 'npc')) bad(path, `(${s.x}, ${s.y}) is a solid tile`);
    if (s.face !== undefined && DIRS[s.face] === undefined) bad(`${path}.face`, `${q(s.face)} is not N, E, S or W`);
    if (s.accepts !== undefined) {
      for (const [i, type] of list(`${path}.accepts`, s.accepts).entries()) itemType(`${path}.accepts[${i}]`, type);
      if (s.owner !== undefined && s.owner !== null && s.owner !== 'player') npc(`${path}.owner`, s.owner);
      if (s.found !== undefined && s.found !== 'take') behaviour(`${path}.found`, s.found);
      if (s.unseen !== undefined && s.unseen !== 'take' && s.unseen !== 'leave') behaviour(`${path}.unseen`, s.unseen);
      if (s.lies !== undefined && !(isObj(s.lies) && Number.isInteger(s.lies.dx ?? 0) && Number.isInteger(s.lies.dy ?? 0))) bad(`${path}.lies`, 'not { dx, dy } in whole tiles');
      if (s.shown !== undefined &&!(isObj(s.shown) && isNum(s.shown.dx ?? 0) && isNum(s.shown.dy ?? 0))) bad(`${path}.shown`, 'not { dx, dy } in tiles');
    }
  }
  if (!isObj(level.zones)) bad('zones', 'missing');
  for (const [name, z] of Object.entries(zones)) {
    const path = `zones.${name}`;
    if (!isObj(z) || ![z.x0, z.y0, z.x1, z.y1].every(isNum)) { bad(path, 'not { x0, y0, x1, y1 }'); continue; }
    if (!(z.x0 < z.x1 && z.y0 < z.y1)) bad(path, 'empty (needs x0 < x1 and y0 < y1)');
    if (map && (z.x0 < 0 || z.y0 < 0 || z.x1 > map.w || z.y1 > map.h)) bad(path, 'reaches off the map');
  }
  if (level.patrols !== undefined && !isObj(level.patrols)) bad('patrols', 'not an object');
  for (const [name, pts] of Object.entries(patrols)) {
    for (const [i, pt] of list(`patrols.${name}`, pts).entries()) {
      if (!Array.isArray(pt) || !isNum(pt[0]) || !isNum(pt[1]) || !inMap(pt[0], pt[1])) bad(`patrols.${name}[${i}]`, 'not an [x, y] on the map');
    }
  }

  // --- behaviours, cast -------------------------------------------------------------------------
  if (level.behaviours !== undefined && !isObj(level.behaviours)) bad('behaviours', 'not an object');
  for (const [name, b] of Object.entries(behaviours)) {
    if (!isObj(b) || !isFn(b.arrive)) bad(`behaviours.${name}`, 'needs arrive(game, npc, sim)');
    else if (b.spot !== undefined) spot(`behaviours.${name}.spot`, b.spot);
  }
  if (!Array.isArray(level.cast)) bad('cast', 'missing (a list)');
  const voices = voicesFor(isObj(level.voices) ? level.voices : null);
  const seenIds = new Set();
  for (const [i, def] of cast.entries()) {
    const path = `cast[${i}]${isStr(def?.id) ? ` (${def.id})` : ''}`;
    if (!isObj(def)) { bad(path, 'not an object'); continue; }
    if (!isStr(def.id)) bad(`${path}.id`, 'missing');
    else if (def.id === 'player') bad(`${path}.id`, "'player' is the player's");
    else if (seenIds.has(def.id)) bad(`${path}.id`, 'used twice');
    seenIds.add(def.id);
    spot(`${path}.meetingSpot`, def.meetingSpot);
    if (def.meetingArrive !== undefined) behaviour(`${path}.meetingArrive`, def.meetingArrive);
    if (def.voice !== undefined && !(isStr(def.voice) && Object.hasOwn(voices, def.voice))) {
      bad(`${path}.voice`, `no voice ${q(def.voice)} (engine voices or level.voices)`);
    }
    const sched = list(`${path}.schedule`, def.schedule);
    if (!sched.length) bad(`${path}.schedule`, 'empty');
    else if (!sched.some((e) => e?.spot)) bad(`${path}.schedule`, 'no entry names a spot (where he starts)');
    let last = -Infinity;
    for (const [k, e] of sched.entries()) {
      const ep = `${path}.schedule[${k}]`;
      if (!isObj(e)) { bad(ep, 'not an object'); continue; }
      if (!isNum(e.at)) bad(`${ep}.at`, 'not a game minute');
      else if (e.at < last) bad(`${ep}.at`, 'earlier than the entry before it');
      else last = e.at;
      if (!DOS.has(e.do)) { bad(`${ep}.do`, `${q(e.do)} is not one of ${[...DOS].join(', ')}`); continue; }
      if (SPOT_DOS.has(e.do) || e.spot !== undefined) spot(`${ep}.spot`, e.spot);
      if (e.do === 'patrol') route(`${ep}.route`, e.route);
      if (e.do === 'say' && !Array.isArray(e.icons)) bad(`${ep}.icons`, 'not a list');
      if (e.prelude !== undefined) {
        for (const name of [].concat(e.prelude)) {
          behaviour(`${ep}.prelude`, name);
          if (has(behaviours, name) && isObj(behaviours[name]) && behaviours[name].spot === undefined) {
            bad(`${ep}.prelude`, `behaviour ${q(name)} has no spot to walk to`);
          }
        }
      }
      if (e.arrive !== undefined) behaviour(`${ep}.arrive`, e.arrive);
    }
  }

  // --- the day and its frame --------------------------------------------------------------------
  const day = level.day;
  if (!isObj(day)) bad('day', 'missing');
  else {
    for (const f of ['start', 'gatherAt', 'meetingAt']) if (!isNum(day[f])) bad(`day.${f}`, 'not a number');
    if (isNum(day.start) && !(day.start >= 0 && day.start < 24 * 60)) bad('day.start', `${day.start} is not a minute-of-day (0..1439; 2:30 PM is 870)`);
    for (const f of DAY_CUES) if (day[f] !== undefined && !isNum(day[f])) bad(`day.${f}`, 'not a number');
    if (isNum(day.gatherAt) && isNum(day.meetingAt) && day.gatherAt > day.meetingAt) bad('day.gatherAt', 'after day.meetingAt');
  }
  const m = level.meeting;
  if (!isObj(m)) bad('meeting', 'missing');
  else {
    if (!isStr(m.override)) bad('meeting.override', 'missing');
    zone('meeting.room', m.room);
    spot('meeting.chair', m.chair);
    if (m.presenter != null) spot('meeting.presenter', m.presenter);
    if (m.verdict !== undefined && typeof m.verdict !== 'function') bad('meeting.verdict', 'not a function (game, { result, routes, present, where })');
    if (m.where !== undefined && !(Array.isArray(m.where) && m.where.every(isStr))) bad('meeting.where', 'not a list of names (zones, or places you go inside)');
  }

  // --- the player's actions, items, roles ---------------------------------------------------------
  if (!isObj(level.interactions)) bad('interactions', 'missing (an object, maybe {})');
  else {
    for (const [verb, row] of Object.entries(level.interactions)) {
      const path = `interactions.${verb}`;
      if (!isObj(row)) { bad(path, 'not an object'); continue; }
      if (!ROW_TARGETS.has(row.on) && !interTypes.has(row.on)) bad(`${path}.on`, `no interactable ${q(row.on)} on the map`);
      if (row.noise?.at !== undefined) noiseAt(`${path}.noise.at`, row.noise.at);
      if (row.noise !== undefined) noiseTiming(`${path}.noise`, row.noise);
      if (row.icon !== undefined) bad(`${path}.icon`, 'an icon over the target reads as the object: drop it (the target lights up with the key cap)');
      if (row.pose !== undefined && !ARM_POSES.includes(row.pose)) bad(`${path}.pose`, `no arm pose ${q(row.pose)} (one of ${ARM_POSES.join(', ')})`);
      if (row.on === 'self') {
        if (!ARM_POSES.includes(row.preview)) bad(`${path}.preview`, `${row.preview === undefined ? 'missing' : `no arm pose ${q(row.preview)}`}: the pose that shows what E does to what you hold (one of ${ARM_POSES.join(', ')})`);
        if (row.hold !== undefined && typeof row.hold !== 'boolean') bad(`${path}.hold`, 'not true or false (true: holding E does it, a tap does the others)');
      }
    }
  }
  if (level.items !== undefined && !isObj(level.items)) bad('items', 'not an object');
  for (const [type, it] of Object.entries(items)) {
    if (!isObj(it)) { bad(`items.${type}`, 'not an object'); continue; }
    if (!isStr(it.icon)) bad(`items.${type}.icon`, 'missing (the emoji people say for it)');
    if (it.draw !== undefined) painter(`items.${type}.draw`, it.draw, `no thing ${q(it.draw)}`);
    else bad(`items.${type}.draw`, 'missing: how it is drawn, not an emoji');
    if (it.tint !== undefined && !isStr(it.tint)) bad(`items.${type}.tint`, "not a colour or 'owner'");
    if (it.tint === 'owner' && !it.owner) bad(`items.${type}.tint`, "'owner' but the item has no owner");
    if (it.owner !== undefined) npc(`items.${type}.owner.id`, it.owner?.id);
    if (it.contraband !== undefined) npc(`items.${type}.contraband`, it.contraband);
    if (it.contrabandIn !== undefined) zone(`items.${type}.contrabandIn`, it.contrabandIn);
    if (it.pockets !== undefined && !(Array.isArray(it.pockets) && it.pockets.every((l) => isObj(l) && Array.isArray(l.say)))) bad(`items.${type}.pockets`, 'not a list of lines ({ say: icons, after?, kind?, ttl? })');
    if (it.pockets !== undefined && it.contraband === undefined) bad(`items.${type}.pockets`, 'only contraband is pocketed off the floor: give it a contraband too, or drop this');
    if (it.disguise !== undefined) {
      if (!isObj(it.disguise)) bad(`items.${type}.disguise`, 'not an object');
      else {
        npc(`items.${type}.disguise.as`, it.disguise.as);
        if (it.disguise.look !== undefined && !isObj(it.disguise.look)) bad(`items.${type}.disguise.look`, 'not an object (look fields)');
        if (it.disguise.greet !== undefined && !Array.isArray(it.disguise.greet)) bad(`items.${type}.disguise.greet`, 'not a list of lines');
      }
    }
    if (it.put !== undefined && !(isNum(it.put) && it.put > 0)) bad(`items.${type}.put`, 'not a time in seconds (putting it down takes that long)');
    if (it.keep !== undefined && typeof it.keep !== 'boolean') bad(`items.${type}.keep`, 'not true or false (true: it leaves your hand only by a put)');
    if (it.bulky !== undefined && typeof it.bulky !== 'boolean') bad(`items.${type}.bulky`, 'not true or false (true: no pretending while you hold it)');
    if (it.edible !== undefined) {
      const marks = Object.keys(MARKS).map(q).join(', ');
      if (!isObj(it.edible) || !('leaves' in it.edible)) bad(`items.${type}.edible`, `not { leaves }: say what eating leaves on you (${marks}, or null for nothing)`);
      else if (it.edible.leaves !== null && !Object.hasOwn(MARKS, it.edible.leaves)) bad(`items.${type}.edible.leaves`, `no mark ${q(it.edible.leaves)} (config.js MARKS: ${marks}; or null for nothing)`);
      if (isObj(it.edible) && it.edible.icon !== undefined && !isStr(it.edible.icon)) bad(`items.${type}.edible.icon`, 'not an icon (string)');
      if (isObj(it.edible) && it.edible.burst !== undefined && !BURSTS.includes(it.edible.burst)) bad(`items.${type}.edible.burst`, `not a burst kind (${BURSTS.join(', ')})`);
    }
  }
  const roles = level.roles;
  if (roles !== undefined) {
    if (!isObj(roles)) bad('roles', 'not an object');
    else {
      if (roles.authority) {
        npc('roles.authority.id', roles.authority.id);
        if (roles.authority.deafIn != null) zone('roles.authority.deafIn', roles.authority.deafIn);
        const es = roles.authority.earshot;
        if (es != null && !(typeof es === 'number' && es > 0)) bad('roles.authority.earshot', 'not a positive number of tiles');
        const tt = roles.authority.tattle;
        if (tt !== undefined && tt !== 'work' && tt !== 'caught' && !isFn(tt)) bad('roles.authority.tattle', "not 'work', 'caught' or a function (what a heard tattle costs)");
      }
      if (roles.evidence) npc('roles.evidence.by', roles.evidence.by);
      if (roles.scene) {
        npc('roles.scene.by', roles.scene.by);
        if (roles.scene.zone !== undefined) zone('roles.scene.zone', roles.scene.zone);
      }
      if (roles.private !== undefined) {
        if (!Array.isArray(roles.private)) bad('roles.private', 'not a list of { zone, owner, offDuty? }');
        else for (const [i, e] of roles.private.entries()) {
          zone(`roles.private[${i}].zone`, e?.zone);
          npc(`roles.private[${i}].owner`, e?.owner);
          if (e?.offDuty !== undefined && !Array.isArray(e.offDuty)) bad(`roles.private[${i}].offDuty`, 'not a list of overrides');
        }
      }
    }
  }

  // --- mechanics (src/sim/mechanics/*) --------------------------------------------------------------
  for (const [i, l] of (level.lures ?? []).entries()) {
    npc(`lures[${i}].npc`, l?.npc);
    spot(`lures[${i}].spot`, l?.spot);
    if (!isFn(l?.when)) bad(`lures[${i}].when`, 'not a function');
  }
  for (const [i, h] of (level.hunts ?? []).entries()) {
    npc(`hunts[${i}].npc`, h?.npc);
    route(`hunts[${i}].route`, h?.route);
  }
  for (const [i, d] of (level.doors ?? []).entries()) {
    spot(`doors[${i}].spot`, d?.spot);
    zone(`doors[${i}].zone`, d?.zone);
    for (const [k, id] of list(`doors[${i}].npcs`, d?.npcs).entries()) npc(`doors[${i}].npcs[${k}]`, id);
  }
  for (const [i, f] of (level.fetches ?? []).entries()) {
    itemTypes(`fetches[${i}].item`, f?.item);
    for (const [k, id] of list(`fetches[${i}].npcs`, f?.npcs).entries()) npc(`fetches[${i}].npcs[${k}]`, id);
    if (!isStr(f?.override) || !isStr(f?.plan)) bad(`fetches[${i}]`, 'needs an override and a plan (strings)');
    if (f?.caught !== undefined && !(isNum(f.caught) && f.caught >= 0)) bad(`fetches[${i}].caught`, 'not a time in seconds');
    if (f?.alert !== undefined && !(Array.isArray(f.alert) && f.alert.length && f.alert.every(isStr))) bad(`fetches[${i}].alert`, 'not a list of icons');
  }
  // Toys (sim/mechanics/toy.js): a prop and a cosmetic reaction. The reaction is data, so it can touch nothing else.
  const toyIds = new Set();
  for (const [i, t] of list('toys', level.toys ?? []).entries()) {
    const path = `toys[${i}]`;
    if (!isObj(t)) { bad(path, 'not an object'); continue; }
    if (!isStr(t.id) || toyIds.has(t.id)) bad(`${path}.id`, 'missing or not unique');
    toyIds.add(t.id);
    if (isStr(t.at)) spot(`${path}.at`, t.at);
    else if (!(isObj(t.at) && isNum(t.at.x) && isNum(t.at.y))) bad(`${path}.at`, 'not a spot name or a tile { x, y }');
    if (!['press', 'pass', 'near'].includes(t.on)) bad(`${path}.on`, "not 'press', 'pass' or 'near'");
    if (t.on !== 'press') for (const [k, id] of list(`${path}.npcs`, t.npcs).entries()) npc(`${path}.npcs[${k}]`, id);
    if (t.when !== undefined && !isFn(t.when)) bad(`${path}.when`, 'not a function (world, state, game, npc) -> bool');
    for (const k of ['radius', 'every']) if (t[k] !== undefined && !(isNum(t[k]) && t[k] > 0)) bad(`${path}.${k}`, 'not a number > 0');
    if (t.state !== undefined && !isObj(t.state)) bad(`${path}.state`, 'not an object');
    const r = t.react;
    if (!isObj(r)) bad(`${path}.react`, 'not an object (say, sfx, pose, set, burst)');
    else {
      const extra = Object.keys(r).filter((k) => !['say', 'sfx', 'pose', 'set', 'burst'].includes(k));
      if (extra.length) bad(`${path}.react`, `unknown ${extra.join(', ')}: a reaction is only say, sfx, pose, set, burst`);
      if (r.say !== undefined) icons(`${path}.react.say`, Array.isArray(r.say) ? r.say : r.say?.icons);
      if (r.sfx !== undefined && !(isStr(r.sfx) && isFn(SFX[r.sfx]))) bad(`${path}.react.sfx`, `no sound ${q(r.sfx)} in audio/sfx.js`);
      if (r.pose !== undefined && r.pose.arms !== undefined && !ARM_POSES.includes(r.pose.arms)) bad(`${path}.react.pose.arms`, `no arm pose ${q(r.pose.arms)}`);
      if (r.set !== undefined && !isObj(r.set)) bad(`${path}.react.set`, 'not an object');
      if (r.burst !== undefined && !BURSTS.includes(r.burst?.kind)) bad(`${path}.react.burst.kind`, `not one of ${BURSTS.join(', ')}`);
    }
    if (!(Array.isArray(t.try) && t.try.length && t.try.every(isStr))) bad(`${path}.try`, 'not a list of harness commands after which it has fired (the gate plays it)');
  }
  const records = []; // [path, world field] (checked against initialWorld() below)
  for (const [i, insp] of (level.inspections ?? []).entries()) {
    const path = `inspections[${i}]`;
    npc(`${path}.npc`, insp?.npc);
    for (const [k, c] of list(`${path}.checks`, insp?.checks).entries()) {
      const cp = `${path}.checks[${k}]`;
      if (c?.count !== undefined) {
        itemTypes(`${cp}.item`, c.item);
        if (!Number.isInteger(c.count) || c.count < 1) bad(`${cp}.count`, 'not a whole number of 1 or more');
        if (c.zone !== undefined) zone(`${cp}.zone`, c.zone);
        else {
          const ss = list(`${cp}.spots`, c.spots);
          if (Array.isArray(c.spots) && !ss.length) bad(`${cp}.spots`, 'empty');
          for (const [j, n] of ss.entries()) spot(`${cp}.spots[${j}]`, n);
        }
        if (c.absent !== undefined) bad(`${cp}.absent`, 'a count is never absent');
      } else if (c?.item !== undefined) {
        itemTypes(`${cp}.item`, c.item);
        spot(`${cp}.spot`, c.spot);
      } else {
        if (c?.who !== 'player') npc(`${cp}.who`, c?.who);
        zone(`${cp}.zone`, c?.zone);
      }
      // He stands at `from`: needed where nothing else says where (a who check, a count over a zone).
      if (c?.from !== undefined || c?.item === undefined || (c?.count !== undefined && c.zone !== undefined)) spot(`${cp}.from`, c?.from);
      if (c?.icon !== undefined) icons(`${cp}.icon`, c.icon);
      if (c?.absent !== undefined && typeof c.absent !== 'boolean') bad(`${cp}.absent`, 'not true or false');
      if (c?.look !== undefined && !(isNum(c.look) && c.look >= 0)) bad(`${cp}.look`, 'not a number of seconds');
      if (c?.record !== undefined) {
        if (c.item === undefined || c.absent) bad(`${cp}.record`, 'only an item or count check records');
        else records.push([`${cp}.record`, c.record]);
      }
    }
    if (insp?.sign !== undefined && insp.sign !== 'mark' && insp.sign !== 'item') bad(`${path}.sign`, `${q(insp.sign)} is not 'mark' or 'item'`);
    const then = insp?.fail?.then;
    if (then !== undefined && !FAIL_THEN.has(then)) behaviour(`${path}.fail.then`, then);
    if (then === 'hunt' && !(level.hunts ?? []).some((h) => h?.npc === insp.npc)) bad(`${path}.fail.then`, `no hunt for ${q(insp.npc)} in level.hunts`);
  }
  if (level.noises !== undefined) {
    for (const [name, n] of Object.entries(level.noises)) {
      const path = `noises[${q(name)}]`;
      if (name === 'noise' || name === 'npc:heard') bad(path, 'would make a noise forever');
      noiseAt(`${path}.at`, n?.at);
      for (const [k, id] of (n?.npcs ?? []).entries()) npc(`${path}.npcs[${k}]`, id);
      noiseTiming(path, n);
    }
  }
  if (level.darkness !== undefined) {
    const d = level.darkness;
    for (const [i, r] of list('darkness.rooms', d?.rooms).entries()) {
      for (const [k, z] of (Array.isArray(r?.zone) ? r.zone : [r?.zone]).entries()) zone(`darkness.rooms[${i}].zone${Array.isArray(r?.zone) ? `[${k}]` : ''}`, z);
      if (!isFn(r?.lit)) bad(`darkness.rooms[${i}].lit`, 'not a function');
    }
    if (d?.near !== undefined && !isNum(d.near?.radius)) bad('darkness.near.radius', 'not a number');
    if (d?.torch !== undefined) {
      if (!isFn(d.torch?.when)) bad('darkness.torch.when', 'not a function');
      if (!isNum(d.torch?.fov) || !isNum(d.torch?.radius)) bad('darkness.torch', 'fov and radius not numbers');
    }
    for (const [i, c] of (d?.controls === undefined ? [] : list('darkness.controls', d.controls)).entries()) {
      const path = `darkness.controls[${i}]`;
      if (!CONTROL_KINDS.includes(c?.kind)) bad(`${path}.kind`, `no control ${q(c?.kind)} (${CONTROL_KINDS.join(', ')})`);
      if (map && !(typeof c?.tile === 'string' && c.tile.length === 1 && level.map.rows.some((r) => r.includes(c.tile)))) {
        bad(`${path}.tile`, `${q(c?.tile)} is not on the map`);
      }
      if (!isFn(c?.on)) bad(`${path}.on`, 'not a function');
    }
  }
  if (level.failSign !== undefined) spot('failSign.spot', level.failSign?.spot);
  if (level.cameras !== undefined) {
    const camIds = new Set();
    for (const [i, c] of list('cameras', level.cameras).entries()) {
      const path = `cameras[${i}]`;
      if (!isStr(c?.id)) bad(`${path}.id`, 'not a string');
      else if (camIds.has(c.id)) bad(`${path}.id`, `duplicate ${q(c.id)}`);
      else camIds.add(c.id);
      for (const f of ['x', 'y', 'dir', 'fov', 'radius']) if (!isNum(c?.[f])) bad(`${path}.${f}`, 'not a number');
      if (isNum(c?.x) && isNum(c?.y) && !inMap(c.x, c.y)) bad(path, `lens (${c.x}, ${c.y}) is off the map`);
      if (c?.sweep !== undefined && (!isNum(c.sweep?.arc) || !(c.sweep?.period > 0))) bad(`${path}.sweep`, 'not { arc, period > 0 }');
      for (const f of ['aim', 'live']) if (c?.[f] !== undefined && !isFn(c[f])) bad(`${path}.${f}`, 'not a function');
      if (!isNum(c?.monitor?.x) || !isNum(c?.monitor?.y) || !inMap(c.monitor.x, c.monitor.y)) bad(`${path}.monitor`, 'not an { x, y } on the map');
      const watchers = list(`${path}.npcs`, c?.npcs);
      if (Array.isArray(c?.npcs) && !watchers.length) bad(`${path}.npcs`, 'empty: nobody watches it');
      for (const [k, id] of watchers.entries()) npc(`${path}.npcs[${k}]`, id);
      if (c?.reach !== undefined && !(c.reach > 0)) bad(`${path}.reach`, 'not a positive number');
    }
  }

  // --- routes and the world ---------------------------------------------------------------------
  const routes = list('routes', level.routes);
  if (Array.isArray(level.routes) && !routes.length) bad('routes', 'empty');
  const routeIds = [];
  for (const [i, r] of routes.entries()) {
    if (!isStr(r?.id)) bad(`routes[${i}].id`, 'missing');
    else if (routeIds.includes(r.id)) bad(`routes[${i}].id`, `${q(r.id)} used twice`);
    else routeIds.push(r.id);
    if (!isStr(r?.icon)) bad(`routes[${i}].icon`, 'missing');
    if (!isFn(r?.achieved)) bad(`routes[${i}].achieved`, 'not a function');
  }
  const order = list('outcomeOrder', level.outcomeOrder);
  for (const id of routeIds) {
    const n = order.filter((o) => o === id).length;
    if (n !== 1) bad('outcomeOrder', `lists route ${q(id)} ${n} times (needs 1)`);
  }
  for (const id of order) if (!routeIds.includes(id)) bad('outcomeOrder', `no route ${q(id)}`);
  if (!isFn(level.initialWorld)) bad('initialWorld', 'not a function');
  else {
    let w;
    try { w = level.initialWorld(); } catch (e) { bad('initialWorld()', `throws: ${e.message}`); }
    if (w !== undefined && !(isObj(w) && Array.isArray(w.items))) bad('initialWorld()', 'returns no { items: [] }');
    else if (w !== undefined) for (const [path, f] of records) if (!isStr(f) || !Object.hasOwn(w, f)) bad(path, `${q(f)} is no field of initialWorld()`);
  }

  // --- tools: harness and gate ------------------------------------------------------------------
  const own = isObj(level.harness?.landmarks) ? level.harness.landmarks : {};
  for (const [name, s] of Object.entries(own)) spot(`harness.landmarks.${name}`, s);
  const landmarks = { ...ENGINE_LANDMARKS, ...own };
  const gate = level.gate;
  if (gate !== undefined) {
    const targets = list('gate.targets', gate.targets);
    for (const [i, tg] of targets.entries()) {
      if (!interIds.has(tg) && !has(landmarks, tg) && !/^\d+,\d+$/.test(tg)) bad(`gate.targets[${i}]`, `${q(tg)} is no interactable id, landmark or x,y`);
    }
    for (const [i, tg] of (gate.interactable ?? []).entries()) if (!targets.includes(tg)) bad(`gate.interactable[${i}]`, `${q(tg)} is not in gate.targets`);
    for (const [i, u] of (gate.mustUse ?? []).entries()) {
      if (!isStr(u?.id) || !(isStr(u?.cmd) || isStr(u?.event))) bad(`gate.mustUse[${i}]`, 'needs { id, cmd } or { id, event }');
      for (const [j, r] of (u?.routes ?? []).entries()) if (!(level.routes ?? []).some((x) => x.id === r)) bad(`gate.mustUse[${i}].routes[${j}]`, `no route ${q(r)} in level.routes`);
    }
    for (const [name, f] of Object.entries(gate.milestones ?? {})) if (!isFn(f)) bad(`gate.milestones[${q(name)}]`, 'not a function');
    if (gate.renderEvents !== undefined && !(Array.isArray(gate.renderEvents) && gate.renderEvents.every(isStr))) bad('gate.renderEvents', 'not a list of event names');
    if (gate.budget !== undefined && !(Number.isInteger(gate.budget) && gate.budget >= 1)) bad('gate.budget', 'not a whole number of days of 1 or more');
  }

  // --- presentation -----------------------------------------------------------------------------
  const decor = level.decor;
  if (decor !== undefined) {
    for (const [i, c] of (decor.chairs ?? []).entries()) {
      if (c?.spot !== undefined) spot(`decor.chairs[${i}].spot`, c.spot);
      else if (!isNum(c?.x) || !isNum(c?.y)) bad(`decor.chairs[${i}]`, 'needs a spot or x, y');
      if (DIRS[c?.face] === undefined) bad(`decor.chairs[${i}].face`, `${q(c?.face)} is not N, E, S or W`);
    }
    const STEP = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
    for (const [i, s] of (decor.deskOwners ?? []).entries()) {
      spot(`decor.deskOwners[${i}]`, s);
      const sp = has(spots, s) ? spots[s] : null;
      const step = sp && STEP[sp.face];
      if (!map || !step) continue;
      const t = map.tile(sp.x + step[0], sp.y + step[1]);
      if (!DESK_DRAWS.includes(t.draw ?? t.kind)) bad(`decor.deskOwners[${i}]`, `spot ${q(s)} faces ${sp.face} onto no desk`);
    }
    if (decor.ashtray !== undefined) spot('decor.ashtray.spot', decor.ashtray?.spot);
    if (decor.elevator !== undefined) spot('decor.elevator.spot', decor.elevator?.spot);
    for (const [i, pr] of (decor.props ?? []).entries()) {
      const path = `decor.props[${i}]`;
      if (!isFn(pr?.draw) && !Object.hasOwn(PROP_PAINTERS, pr?.draw)) {
        bad(`${path}.draw`, `no painter ${q(pr?.draw)} (a function, or one of ${Object.keys(PROP_PAINTERS).join(', ')})`);
      }
      if (map && !(level.map.rows.some((r) => r.includes(pr?.tile)) && typeof pr?.tile === 'string' && pr.tile.length === 1)) {
        bad(`${path}.tile`, `${q(pr?.tile)} is not on the map`);
      }
      if (!isFn(pr?.state)) bad(`${path}.state`, 'not a function');
    }
    for (const [i, s] of (decor.zoneSeeds ?? []).entries()) if (!inMap(s?.x, s?.y)) bad(`decor.zoneSeeds[${i}]`, 'off the map');
    if (decor.things !== undefined) {
      if (!isObj(decor.things)) bad('decor.things', 'not an object');
      else for (const [name, d] of Object.entries(decor.things)) painter(`decor.things.${name}`, d, 'not a thing');
    }
  }
  const poses = level.poses;
  if (poses !== undefined) {
    if (!isObj(poses)) bad('poses', 'not an object');
    else {
      for (const field of ['arms', 'marks']) {
        if (poses[field] === undefined) continue;
        for (const [i, r] of list(`poses.${field}`, poses[field]).entries()) {
          const path = `poses.${field}[${i}]`;
          if (!isFn(r?.when)) bad(`${path}.when`, 'not a function (npc, world, game)');
          if (field !== 'arms' || r?.item === undefined) continue;
          const name = isStr(r.item) && r.item.startsWith('#') ? r.item.slice(1) : null;
          const things = isObj(decor?.things) ? decor.things : {};
          const draws = name && ((has(items, name) && items[name]?.draw !== undefined) || has(things, name) || Object.hasOwn(THINGS, name));
          if (!draws) bad(`${path}.item`, `${q(r.item)} is not a '#<thing>' that draws (an item type with a draw, a decor.things name or an engine thing)`);
        }
      }
    }
  }
  const sounds = level.sounds;
  if (sounds !== undefined) {
    const spec = (path, sp) => {
      if (!isObj(sp)) return;
      if (sp.spot !== undefined) spot(`${path}.spot`, sp.spot);
      if (sp.who !== undefined && sp.who !== 'player') npc(`${path}.who`, sp.who);
    };
    for (const kind of ['start', 'done']) for (const [k, sp] of Object.entries(sounds.actions?.[kind] ?? {})) spec(`sounds.actions.${kind}.${k}`, sp);
    for (const field of ['events', 'signs', 'contraband', 'repeats']) for (const [k, sp] of Object.entries(sounds[field] ?? {})) spec(`sounds.${field}[${q(k)}]`, sp);
    if (sounds.murmur !== undefined) spot('sounds.murmur.spot', sounds.murmur?.spot);
    if (sounds.elevator !== undefined) spot('sounds.elevator.spot', sounds.elevator?.spot);
  }
  const ends = level.endScenes;
  if (ends !== undefined) {
    if (!isObj(ends) || !isFn(ends.kindOf) || !isObj(ends.scenes)) bad('endScenes', 'needs kindOf(outcome) and scenes');
    else {
      for (const [name, sc] of Object.entries(ends.scenes)) {
        if (!isObj(sc) || typeof sc.win !== 'boolean' || !Array.isArray(sc.icons) || !isFn(sc.draw)) bad(`endScenes.scenes.${name}`, 'needs { win, icons, draw() }');
      }
      const lost = (o) => o.result === 'fail' || o.result === 'blamed';
      const outs = possibleOutcomes(order.filter((id) => routeIds.includes(id)));
      for (const o of [...outs, ...outs.filter(lost).map((o) => ({ ...o, stopped: { by: roles?.authority?.id ?? null, reason: 'tattle', working: true } }))]) {
        let kind;
        try { kind = ends.kindOf(o); } catch (e) { bad('endScenes.kindOf', `throws for ${outcomeText(o)}: ${e.message}`); continue; }
        if (!has(ends.scenes, kind) && !(o.stopped && kind === 'stopped')) bad('endScenes.kindOf', `${outcomeText(o)} gives ${q(kind)}, which is not in scenes`);
      }
    }
  }
  if (level.voices !== undefined) {
    if (!isObj(level.voices)) bad('voices', 'not an object');
    else for (const [name, v] of Object.entries(level.voices)) if (!isObj(v)) bad(`voices.${name}`, 'not an object');
  }
  return out;
}

// Every outcome scenario.js can make, by result and routes (routes in outcomeOrder order): win and blamed with each
// non-empty set of routes (each one alone and all together, past six routes), caught and fail with none.
function possibleOutcomes(order) {
  const sets = [];
  if (order.length <= 6) {
    for (let mask = 1; mask < 1 << order.length; mask++) sets.push(order.filter((_, i) => mask & (1 << i)));
  } else {
    sets.push(...order.map((id) => [id]), order);
  }
  const out = [];
  for (const routes of sets) for (const result of ['win', 'blamed']) out.push({ result, routes, newRoutes: [] });
  for (const result of SCENE_RESULTS) out.push({ result, routes: [], newRoutes: [] });
  return out;
}
const outcomeText = (o) => `${o.result}${o.routes.length ? ` [${o.routes.join(', ')}]` : ''}`;

export function validateLevel(level, key) {
  const problems = levelProblems(level, key);
  if (problems.length) throw new Error(`level '${key ?? level?.id}' is broken:\n  ${problems.join('\n  ')}`);
  return level;
}
