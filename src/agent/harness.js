// AI-agent harness: lets a program (or an LLM agent via tools/play.mjs) play the real game
// headlessly through the same Input interface a human uses. The game is deterministic, so a
// command log fully reproduces a session.
//
// Observations are deliberately "what a human sees": positions, facing, head turns, who can see
// you (the vision cones), speech bubbles, the HUD. NPC schedules and intent are NOT exposed
// (pass { debug: true } to observe() for that).

import { FIXED_DT, FF_MULT, FORCED_MULT, INTERACT_RADIUS, at, formatClock, MEETING_AT } from '../config.js';
import { createGame } from '../state.js';
import { startLoop, tick } from '../game/loop.js';
import { updateFx } from '../core/fx.js';
import { npcSees } from '../game/perception.js';
import { SPOTS } from '../data/level.js';
import { createScriptedInput } from './scripted-input.js';

// Events that end a waiting/walking command early so the agent can react.
const HARD_STOP = new Set(['caught', 'day:end', 'boss:workAssigned']);
const SOFT_STOP = new Set(['witness:notice', 'witness:tattle', 'boss:suspicious', 'action:cancel', 'sandwich:returned', 'coffee:confiscated']);
const MAX_CMD_FRAMES = 60 * 200; // safety: one command never runs longer than 200 real seconds

// Landmarks the agent can `goto` by name (besides interactable ids and "x,y").
const LANDMARKS = {
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
};

export const HELP = `Commands (one per call or several in a row):
  look                         observe without acting
  goto <target> [pretend]      walk there by the shortest path; 'pretend' = hold PRETEND (Shift) while walking
                               targets: coat_rack fridge coffee_machine projector own_desk
                                        my_seat boss_desk lin_desk kev_desk boss_office_door
                                        kitchen_table entrance restroom_door meeting_room meeting_seat | x,y (tile)
  move <N|S|E|W|NE|NW|SE|SW> <dur> [pretend]   raw walking
  interact                     press E (uses the current ✋ target) and wait for the action to finish
  sit                          goto own_desk and sit down (same as: goto my_seat; interact)
  pretend <dur>                hold PRETEND (Shift) in place
  wait <dur>                   stand/sit idle
  continue                     after a day ends, start the next loop
  restart                      give up and restart the loop now
durations: 5s (real seconds) | 3m (game minutes) | until 3:10 (clock, PM)
Waiting/walking commands stop early when something notable happens.`;

export function createHarness() {
  const input = createScriptedInput();
  const game = createGame({ input });
  const log = []; // { loop, minute, name, payload }
  game.events.on('*', (name, payload) => {
    log.push({ loop: game.persist.loop, minute: game.clock.minute, name, payload });
  });

  // One real-time frame, mirroring main.js (fast-forward / forced-work multipliers).
  function frame() {
    if (game.phase !== 'day') return;
    const mult = (game.clock.forced > 0 ? FORCED_MULT : game.clock.ff ? FF_MULT : 1) * game.debug.speed;
    for (let i = 0; i < mult && game.phase === 'day'; i++) tick(game, FIXED_DT);
    updateFx(game, FIXED_DT);
    game.time += FIXED_DT;
    input.clearPresses(); // a press is only valid for the frame it was made in
  }

  // Run frames until done() or a stop event. Returns { frames, stoppedBy }.
  function runUntil(done, { soft = true, maxFrames = MAX_CMD_FRAMES, onFrame } = {}) {
    const start = log.length;
    let frames = 0;
    while (frames < maxFrames && game.phase === 'day') {
      if (onFrame && onFrame() === false) break;
      frame();
      frames++;
      for (let i = start; i < log.length; i++) {
        const n = log[i].name;
        if (HARD_STOP.has(n) || (soft && SOFT_STOP.has(n))) return { frames, stoppedBy: n };
      }
      if (done()) return { frames, stoppedBy: null };
    }
    return { frames, stoppedBy: game.phase !== 'day' ? 'day over' : frames >= maxFrames ? 'timeout' : null };
  }

  // Forced work (and the caught beat) lock the player: burn time until it's over.
  function waitWhileLocked() {
    if (game.phase !== 'day') return null;
    if (!(game.clock.forced > 0 || game.player.locked)) return null;
    const from = game.clock.minute;
    const working = game.clock.forced > 0;
    input.releaseAll();
    runUntil(() => !(game.clock.forced > 0 || game.player.locked), { soft: false });
    if (game.phase !== 'day') return null; // the meeting/caught beat ran to the end of the day
    return working
      ? `(you were stuck at your desk doing assigned work from ${formatClock(from)} to ${formatClock(game.clock.minute)})`
      : `(you couldn't move from ${formatClock(from)} to ${formatClock(game.clock.minute)})`;
  }

  function parseDuration(tokens) {
    if (tokens[0] === 'until') {
      const target = at(tokens[1] ?? '');
      if (!Number.isFinite(target)) throw new Error(`bad time '${tokens[1]}' (use e.g. until 3:10)`);
      return { done: () => game.clock.minute >= target, label: `until ${tokens[1]}` };
    }
    const m = /^(\d+(?:\.\d+)?)(s|m)$/.exec(tokens[0] ?? '');
    if (!m) throw new Error(`bad duration '${tokens.join(' ')}' (use 5s, 3m or until 3:10)`);
    const v = Number(m[1]);
    if (m[2] === 's') {
      let n = Math.round(v * 60);
      return { done: () => --n <= 0, label: `${v}s` };
    }
    const end = game.clock.minute + v;
    return { done: () => game.clock.minute >= end, label: `${v} game min` };
  }

  // ---- navigation (player-walkable BFS, 8-dir without corner cutting) ----
  function walkable(x, y) {
    return game.map.isWalkable(x, y, 'player');
  }
  function bfs(fromX, fromY, isGoal) {
    const key = (x, y) => y * game.map.w + x;
    const prev = new Map([[key(fromX, fromY), null]]);
    const q = [[fromX, fromY]];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    while (q.length) {
      const [x, y] = q.shift();
      if (isGoal(x, y)) {
        const path = [];
        let k = key(x, y);
        let cur = [x, y];
        while (cur) {
          path.unshift({ x: cur[0], y: cur[1] });
          cur = prev.get(k);
          if (cur) k = key(cur[0], cur[1]);
        }
        return path;
      }
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (!walkable(nx, ny) || prev.has(key(nx, ny))) continue;
        if (dx && dy && (!walkable(x + dx, y) || !walkable(x, y + dy))) continue;
        prev.set(key(nx, ny), [x, y]);
        q.push([nx, ny]);
      }
    }
    return null;
  }

  function resolveTarget(name) {
    const xy = /^(\d+),(\d+)$/.exec(name);
    if (xy) {
      const tx = Number(xy[1]);
      const ty = Number(xy[2]);
      return { label: `${tx},${ty}`, isGoal: (x, y) => x === tx && y === ty };
    }
    const it = game.map.interactables.find((i) => i.id === name);
    if (it) {
      // Any walkable tile from which the interactable is within reach. Prefer standing close.
      const r = INTERACT_RADIUS - 0.1;
      return {
        label: name,
        isGoal: (x, y) => Math.hypot(x + 0.5 - it.cx, y + 0.5 - it.cy) <= Math.min(r, 1.05),
        fallback: (x, y) => Math.hypot(x + 0.5 - it.cx, y + 0.5 - it.cy) <= r,
      };
    }
    const spotName = LANDMARKS[name] ?? (SPOTS[name] ? name : null);
    if (spotName) {
      const s = SPOTS[spotName];
      return { label: name, isGoal: (x, y) => x === s.x && y === s.y };
    }
    throw new Error(`unknown target '${name}'. Try one of: ${game.map.interactables.map((i) => i.id).join(' ')} ${Object.keys(LANDMARKS).join(' ')} or x,y`);
  }

  function goto(name, busy) {
    const t = resolveTarget(name);
    const p = game.player;
    const sx = Math.floor(p.x);
    const sy = Math.floor(p.y);
    let path = bfs(sx, sy, t.isGoal);
    if (!path && t.fallback) path = bfs(sx, sy, t.fallback);
    if (!path) return { text: `no path to ${t.label}` };
    input.hold('busy', !!busy);
    let i = 1;
    let lastProgress = { d: Infinity, frames: 0 };
    const res = runUntil(
      () => i >= path.length,
      {
        onFrame() {
          // Advance waypoint when close; steer toward current waypoint centre.
          while (i < path.length) {
            const wx = path[i].x + 0.5;
            const wy = path[i].y + 0.5;
            const d = Math.hypot(wx - p.x, wy - p.y);
            if (d < 0.15) { i++; lastProgress = { d: Infinity, frames: 0 }; continue; }
            if (d < lastProgress.d - 0.01) lastProgress = { d, frames: 0 };
            else if (++lastProgress.frames > 90) return false; // stuck for 1.5 s
            input.setAxis(wx - p.x, wy - p.y);
            return true;
          }
          input.setAxis(0, 0);
          return true;
        },
      },
    );
    input.setAxis(0, 0);
    input.hold('busy', false);
    frame(); // settle one frame with no input so `moving` clears
    const arrived = i >= path.length;
    return {
      text: arrived
        ? `walked to ${t.label}${busy ? ' (pretending)' : ''}`
        : `stopped on the way to ${t.label}${res.stoppedBy ? ` (${res.stoppedBy})` : ' (blocked)'}`,
    };
  }

  const COMPASS = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0], NE: [1, -1], NW: [-1, -1], SE: [1, 1], SW: [-1, 1] };

  // ---- command execution ----
  function exec(line) {
    const tokens = line.trim().split(/\s+/).filter(Boolean);
    let cmd = (tokens.shift() ?? 'look').toLowerCase();
    const notes = [];

    if (cmd === 'help') return { text: HELP };
    if (cmd === 'look') return { text: '' };
    if (cmd === 'continue' || cmd === 'start') {
      if (game.phase === 'day' && !game.outcome) return { text: 'the day is still going (use restart to give up)' };
      while (game.phase === 'day') frame(); // let the end-of-day beat finish
      startLoop(game);
      return { text: `--- LOOP ${game.persist.loop} begins: 2:30 PM, at your desk ---` };
    }
    if (cmd === 'restart') {
      startLoop(game);
      return { text: `--- gave up. LOOP ${game.persist.loop} begins: 2:30 PM, at your desk ---` };
    }
    if (game.phase !== 'day') return { text: 'the day is over: use continue' };

    const locked = waitWhileLocked();
    if (locked) notes.push(locked);
    if (game.phase !== 'day') return { text: notes.join('\n') };

    // 'pretend' is the player-facing name of the busy button ('busy' still works).
    const PRETEND = (w) => w === 'pretend' || w === 'busy';
    if (cmd === 'pretend') cmd = 'busy';
    let result;
    switch (cmd) {
      case 'goto': {
        if (!tokens[0]) throw new Error('goto what?');
        result = goto(tokens[0], PRETEND(tokens[1]));
        break;
      }
      case 'sit': {
        if (game.player.seated) { result = { text: 'you are already sitting at your desk' }; break; }
        const g = goto('my_seat', PRETEND(tokens[0]));
        if (!/^walked/.test(g.text)) { result = g; break; }
        result = interact();
        break;
      }
      case 'move': {
        const v = COMPASS[(tokens[0] ?? '').toUpperCase()];
        if (!v) throw new Error('move N|S|E|W|NE|NW|SE|SW <duration> [pretend]');
        const busy = PRETEND(tokens[tokens.length - 1]);
        const d = parseDuration(tokens.slice(1, busy ? -1 : undefined));
        input.hold('busy', busy);
        input.setAxis(v[0], v[1]);
        const r = runUntil(d.done);
        input.releaseAll();
        frame();
        result = { text: `walked ${tokens[0].toUpperCase()} ${d.label}${r.stoppedBy ? ` (stopped: ${r.stoppedBy})` : ''}` };
        break;
      }
      case 'interact':
        result = interact();
        break;
      case 'busy':
      case 'wait': {
        const d = parseDuration(tokens);
        input.releaseAll();
        if (cmd === 'busy') input.hold('busy', true);
        const r = runUntil(d.done);
        input.releaseAll();
        result = { text: `${cmd === 'busy' ? 'pretended' : 'waited'} ${d.label}${r.stoppedBy ? ` (stopped: ${r.stoppedBy})` : ''}` };
        break;
      }
      default:
        throw new Error(`unknown command '${cmd}'. Try: help`);
    }
    if (result.text) notes.push(result.text);
    return { text: notes.join('\n') };
  }

  function interact() {
    const p = game.player;
    const focus = p.focus;
    if (!focus) {
      frame();
      return { text: 'nothing to interact with here' };
    }
    const what = focusText(game);
    input.press('interact');
    frame();
    if (!p.action) return { text: `interacted: ${what}` };
    const r = runUntil(() => !p.action);
    if (r.stoppedBy && p.action) {
      const pct = Math.round((p.action.t / p.action.duration) * 100);
      return { text: `paused at ${pct}% of ${what} (${r.stoppedBy}): you are still in the middle of it` };
    }
    return { text: r.stoppedBy ? `tried ${what} (${r.stoppedBy})` : `did ${what}` };
  }

  return {
    game,
    log,
    // Start loop 1 (skips the title screen).
    begin() {
      if (game.phase === 'title') startLoop(game);
    },
    // Execute one text command. Returns { ok, text, events } (events: new log entries).
    run(line) {
      const from = log.length;
      try {
        const { text } = exec(line);
        return { ok: true, text, events: log.slice(from) };
      } catch (e) {
        return { ok: false, text: `error: ${e.message}`, events: log.slice(from) };
      }
    },
    frame,
    observe: (opts) => observe(game, opts),
    describeEvents,
  };
}

// ---------------------------------------------------------------------------------------------
// Observation (text for LLMs) and event summaries.

const COMPASS8 = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];
function compass(rad) {
  const i = Math.round(((rad % (2 * Math.PI)) + 2 * Math.PI) / (Math.PI / 4)) % 8;
  return COMPASS8[i];
}
// The ✋ hint in words (a human sees the target highlighted plus an action icon).
const VERBS = {
  brew_coffee: 'pour a coffee', spill_coffee: 'spill coffee on it', take_keycard: 'take the keycard from the jacket',
  take_sandwich: 'take the sandwich', eat_sandwich: 'eat the sandwich', sit: 'sit down', pick_up: 'pick it up',
};
export function focusText(game) {
  const f = game.player.focus;
  if (!f) return 'none in reach';
  const verb = f._action === 'drop' ? `drop the ${game.player.held}` : VERBS[f._action] ?? f._action ?? 'interact';
  return f.kind === 'self' ? `${f.icon ?? ''} ${verb}` : `${f.icon ?? ''} ${f.id}: ${verb}`;
}
const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);

const WORLD_TEXT = {
  projector: { ok: 'working', broken: 'sparking and smoking 💥', fixing: 'Kev is working on it 🔧' },
  keycard: { rack: "in the boss's jacket on the coat rack", player: 'in YOUR hand', dropped: 'on the floor', boss: 'with the boss' },
  sandwich: { fridge: 'in the fridge', player: 'in YOUR hand', dropped: 'on the floor', eaten: 'eaten (by you)', lin: 'Lin has it' },
};

export function observe(game, { map = true, debug = false } = {}) {
  const out = [];
  const p = game.player;
  // Same as the HUD: one slot per route, blank until found.
  const routes = [['projector', '📽️'], ['keycard', '🪪']].map(([id, icon]) => `[${game.persist.routesFound.includes(id) ? icon : ' ? '}]`).join('');
  out.push(`LOOP ${game.persist.loop} | ${formatClock(game.clock.minute)} (meeting at 4:00 PM, ${Math.max(0, Math.ceil(MEETING_AT - game.clock.minute))} game min left) | route slots: ${routes}`);

  if (game.phase === 'end' && game.outcome) {
    const o = game.outcome;
    const verdict = o.result === 'win' ? `WIN 🎉 (meeting cancelled via: ${o.routes.join(' + ')})`
      : o.result === 'caught' ? 'CAUGHT by the boss 😠 (fired: you leave with a box 📦)'
      : o.result === 'blamed' ? `BLAMED 🪑👉 (the meeting fell apart via ${o.routes.join(' + ')}, but everyone was in the meeting room except you)`
      : 'FAIL: the meeting happened and you presented a blank slide 🦗';
    out.push(`DAY OVER: ${verdict}${o.newRoutes?.length ? ` | NEW route: ${o.newRoutes.join(', ')}` : ''}. Use 'continue' for the next loop.`);
    return out.join('\n');
  }
  if (game.phase !== 'day') {
    out.push(`(phase: ${game.phase})`);
    return out.join('\n');
  }

  const state = [];
  state.push(`at (${f1(p.x)},${f1(p.y)}) facing ${compass(p.dir)}`);
  state.push(p.seated ? 'seated at your desk' : p.moving ? 'walking' : 'standing');
  state.push(`hands: ${p.held ?? 'empty'}`);
  if (p.smeared) state.push('mustard down your sweater');
  if (p.busy) state.push(`PRETENDING (${p.busyPose})`);
  if (p.action) state.push(`doing ${p.action.type} ${Math.round((p.action.t / p.action.duration) * 100)}%`);
  if (game.clock.forced > 0) state.push(`FORCED WORK: ${Math.ceil(game.clock.forced)} game min left`);
  if (game.clock.ff) state.push('time ×6');
  out.push(`YOU: ${state.join(', ')}`);
  // Only what a player would see: the ❓ meter over the boss's head (when it shows).
  const status = [];
  if (game.suspicion.boss > 0) status.push(`a ❓ meter over the boss's head: ${Math.round(game.suspicion.boss * 100)}%`);
  if (game.caught) status.push('CAUGHT!');
  if (status.length) out.push(status.join(' | '));
  out.push(`✋ target: ${focusText(game)}`);

  out.push('PEOPLE:');
  for (const n of game.npcs) {
    if (!n.active) {
      out.push(`  ${n.id.padEnd(4)} not visible (left the floor)`);
      continue;
    }
    const bits = [`(${f1(n.x)},${f1(n.y)})`];
    bits.push(n.pose === 'walk' || n.moving ? `walking ${compass(n.dir)}` : `${n.pose === 'sit' ? 'seated' : 'standing'}, facing ${compass(n.dir)}`);
    const off = n.glance?.offset ?? 0;
    if (Math.abs(off) > 0.2) bits.push(`head turned ${off > 0 ? 'right' : 'left'} → looking ${compass(n.dir + off)}`);
    if (npcSees(game, n, p.x, p.y)) bits.push('👁 CAN SEE YOU');
    if (n.override === 'lockedOut') bits.push('stuck outside the entrance');
    if (n.override === 'fixing') bits.push(`fixing the projector ${Math.round(game.world.fixProgress * 100)}%`);
    if (n.carry) bits.push(`holding ${n.carry === 'coffee' ? 'a coffee ☕' : n.carry}`);
    if (debug) bits.push(`[debug: ${n.label ?? ''} override=${n.override}]`);
    out.push(`  ${n.id.padEnd(4)} ${bits.join(', ')}`);
  }
  const bubbles = game.fx.bubbles.map((b) => `${typeof b.owner === 'string' ? b.owner : 'sign'}: ${b.kind === 'thought' ? '💭' : '💬'} ${b.icons.join('')}`);
  if (bubbles.length) out.push(`BUBBLES: ${bubbles.join(' | ')}`);

  const w = game.world;
  // Only what is visible on screen (the fridge is opaque; pockets are private).
  const rack = w.jacket === 'rack' ? `the boss's jacket${w.keycard === 'rack' ? ' (a keycard clipped to it)' : ''}` : 'nothing';
  const floor = w.items.length ? `; on the floor: ${w.items.map((i) => `${i.type}@(${f1(i.x)},${f1(i.y)})`).join(', ')}` : '';
  const pot = w.coffee === 'pot' ? 'a full pot of coffee' : 'an empty pot';
  out.push(`WORLD: projector ${WORLD_TEXT.projector[w.projector] ?? w.projector}; coffee machine: ${pot}; coat rack holds ${rack}${floor}`);

  if (map) out.push(renderMap(game));
  return out.join('\n');
}

// ASCII map: walls/furniture from the level, '*' = floor some NPC can currently see,
// @ = you, b/l/k = boss/Lin/Kev (only if visible on the floor), letters = interactables.
export function renderMap(game) {
  const m = game.map;
  const grid = m.rows.map((r) => r.split(''));
  const actives = game.npcs.filter((n) => n.active);
  for (let y = 0; y < m.h; y++) {
    for (let x = 0; x < m.w; x++) {
      const c = grid[y][x];
      if ((c === '.' || c === ':' || c === 'D') && actives.some((n) => npcSees(game, n, x + 0.5, y + 0.5))) grid[y][x] = '*';
    }
  }
  for (const it of game.world.items) grid[Math.floor(it.y)][Math.floor(it.x)] = 'i';
  const letters = { boss: 'b', lin: 'l', kev: 'k' };
  for (const n of actives) grid[Math.floor(n.y)][Math.floor(n.x)] = letters[n.id] ?? 'n';
  grid[Math.floor(game.player.y)][Math.floor(game.player.x)] = '@';
  const tens = '    ' + Array.from({ length: m.w }, (_, i) => (i % 10 === 0 ? String(i / 10) : ' ')).join('');
  const ones = '    ' + Array.from({ length: m.w }, (_, i) => String(i % 10)).join('');
  const rows = grid.map((r, y) => `${String(y).padStart(3)} ${r.join('')}`);
  return [
    'MAP (# wall, G glass you can see through, T desk/table, D door, H plant, : outside lobby, L entrance (glass door, staff keycard),',
    '     K coat rack, F fridge, C coffee machine, J projector (sticker on it: ☕🚫), P your desk, R restroom, E elevator, i item,',
    '     @ you, b boss, l Lin, k Kev, * floor someone can see right now):',
    tens,
    ones,
    ...rows,
  ].join('\n');
}

const NAME = { boss: 'the boss', lin: 'Lin', kev: 'Kev', player: 'you' };
export function describeEvents(events, { verbose = false } = {}) {
  const lines = [];
  let lastBang = -Infinity;
  let lastText = null;
  let repeats = 0;
  for (const e of events) {
    const t = formatClock(e.minute);
    const p = e.payload ?? {};
    let s = null;
    switch (e.name) {
      case 'say': {
        const who = typeof p.owner === 'string' ? NAME[p.owner] ?? p.owner : 'a sign';
        const you = p.owner === 'player';
        s = `${who} ${p.kind === 'thought' ? (you ? 'think' : 'thinks') : you ? 'say' : 'says'} ${p.icons.join('')}`;
        break;
      }
      case 'witness:notice': s = `${NAME[p.by] ?? p.by} noticed you ❓`; break;
      case 'witness:tattle': s = p.reason === 'contraband'
        ? `${NAME[p.by] ?? p.by} saw what you're carrying 😠`
        : p.late
          ? `${NAME[p.by] ?? p.by} points you out to the boss 👉${p.icon ?? ''} (seen earlier, told now)`
          : `${NAME[p.by] ?? p.by} shouts and points at you ${p.reason === 'evidence' ? '🥪❗👉' : '❗👉'}${p.heard ? ' (the boss heard)' : ' (the boss is away… for now)'}`; break;
      case 'coffee:taken': s = p.by === 'player' ? 'you poured the coffee ☕ (the pot is empty now)' : `${NAME[p.by] ?? p.by} poured the coffee ☕ (the pot is empty now)`; break;
      case 'coffee:missing': s = `${NAME[p.by] ?? p.by} found the coffee pot empty`; break;
      case 'coffee:confiscated': s = `${NAME[p.by] ?? p.by} took the coffee off you ☕`; break;
      case 'boss:suspicious': s = 'the boss eyes you ❓ (a meter over his head starts filling)'; break;
      case 'boss:workAssigned': s = `the boss assigned you work 📄 (${p.reason})`; break;
      case 'work:done': s = 'forced work finished'; break;
      case 'caught': s = `CAUGHT by ${NAME[p.by] ?? p.by} (${p.reason})`; break;
      case 'action:cancel': s = `your action was interrupted (${p.reason})`; break;
      case 'projector:broken': s = 'the projector is broken 💥'; break;
      case 'kev:alerted': s = 'Kev heard the projector 🔧❗'; break;
      case 'projector:fixing': s = 'Kev is fixing the projector'; break;
      case 'projector:fixed': s = 'the projector is fixed'; break;
      case 'keycard:taken': s = 'you took the keycard 🪪'; break;
      case 'keycard:recovered': s = 'the boss spotted his keycard on the floor and pocketed it 🪪❗'; break;
      case 'sandwich:taken': s = 'you took the sandwich 🥪'; break;
      case 'sandwich:eaten': s = 'you ate the sandwich'; break;
      case 'sandwich:returned': s = 'Lin took her sandwich back'; break;
      case 'sandwich:missing': s = 'Lin found the fridge empty'; break;
      case 'boss:jacket': s = 'the boss put on his jacket and walks off'; break;
      case 'boss:lockedOut': s = 'the boss is locked out at the entrance!'; break;
      case 'boss:bang': if (e.minute - lastBang > 3) { s = 'the boss bangs on the glass'; lastBang = e.minute; } break;
      case 'kev:left': s = 'ding: the elevator doors close behind Kev'; break;
      case 'npc:vanish': s = `${NAME[p.id] ?? p.id} left the floor`; break;
      case 'npc:appear': s = `${NAME[p.id] ?? p.id} is back`; break;
      case 'meeting:gather': s = 'everyone heads to the meeting room'; break;
      case 'day:end': s = `DAY OVER (${p.outcome?.result})`; break;
      case 'loop:start': s = null; break;
      case 'item:drop': s = `you dropped the ${p.type}`; break;
      case 'item:pickup': s = `you picked up the ${p.type}`; break;
      default:
        if (verbose) s = `${e.name} ${JSON.stringify(p)}`;
    }
    if (s && s === lastText) { repeats++; continue; }
    if (repeats) { lines[lines.length - 1] += ` (×${repeats + 1})`; repeats = 0; }
    if (s) { lines.push(`  ${t}  ${s}`); lastText = s; }
  }
  if (repeats) lines[lines.length - 1] += ` (×${repeats + 1})`;
  return lines;
}
