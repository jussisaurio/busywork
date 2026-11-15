// AI-agent harness: lets a program (or an LLM agent via tools/play.mjs) play the real game
// headlessly through the same Input interface a human uses. The game is deterministic, so a
// command log fully reproduces a session.
//
// Observations are deliberately "what a human sees": positions, facing, head turns, who can see
// you (the vision cones), speech bubbles, the HUD. NPC schedules and intent are NOT exposed
// (pass { debug: true } to observe() for that).
//
// The level's own words (goto landmarks, stop events, the WORLD line, event lines) come from
// game.level.harness (src/levels/meeting/harness.js documents the shape).

import { ENGINE_LANDMARKS } from '../levels/validate.js';
import { FIXED_DT, FF_MULT, INTERACT_RADIUS, at, formatClock } from '../config.js';
import { createGame } from '../state.js';
import { startLoop, tick, frameMult } from '../game/loop.js';
import { updateFx } from '../core/fx.js';
import { npcSees } from '../game/perception.js';
import { actionRow } from '../play/interactions.js';
import { putSpots, canPut } from '../sim/mechanics/putdown.js';
import { parseMap } from '../core/map.js';
import { createScriptedInput } from './scripted-input.js';
import { getLevel, defaultLevel } from '../levels/index.js';

// Events that end a waiting/walking command early so the agent can react (the level adds its own: harness.stops).
const HARD_STOP = ['caught', 'day:end'];
const SOFT_STOP = ['witness:notice', 'witness:tattle', 'action:cancel'];
const MAX_CMD_FRAMES = 60 * 200; // safety: one command never runs longer than 200 real seconds

// Greedy word wrap for the help's target list.
function wrap(words, width) {
  const lines = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (last !== undefined && last.length + 1 + w.length <= width) lines[lines.length - 1] = `${last} ${w}`;
    else lines.push(w);
  }
  return lines;
}

// The command reference for a level (its goto targets: interactables, then landmarks).
export function helpText(level = defaultLevel) {
  const ids = parseMap(level.map.rows, level.map.legend).interactables.map((i) => i.id);
  const targets = [...wrap(ids, 62), ...wrap(Object.keys({ ...ENGINE_LANDMARKS, ...level.harness?.landmarks }), 62)];
  targets[targets.length - 1] += ' | x,y (tile)';
  return `Commands (one per call or several in a row):
  look                         observe without acting
  goto <target> [pretend]      walk there by the shortest path; 'pretend' = hold PRETEND (Shift) while walking
${targets.map((l, i) => `${' '.repeat(i ? 40 : 31)}${i ? '' : 'targets: '}${l}`).join('\n')}
  move <N|S|E|W|NE|NW|SE|SW> <dur> [pretend]   raw walking
  interact                     press E (uses the current ✋ target) and wait for the action to finish
  put [spot] [pretend]         walk to the nearest free spot (or that one) that takes what you hold, put it down
  sit                          goto own_desk and sit down (same as: goto my_seat; interact)
  pretend <dur>                hold PRETEND (Shift) in place
  wait <dur>                   stand/sit idle
  continue                     after a day ends, start the next loop
  restart                      give up and restart the loop now
durations: 5s (real seconds) | 3m (game minutes) | until 3:10 (clock, PM)
Waiting/walking commands stop early when something notable happens.`;
}

// level: a level id from src/levels/index.js or a level object (default: the registry's default level).
// onFrame(game): called after every real-time frame the harness plays (a watcher, e.g. tools/lib/replay.mjs drawing
// a frame when a bubble appears). It must not change the game.
export function createHarness({ level = defaultLevel, onFrame = null } = {}) {
  const input = createScriptedInput();
  const game = createGame({ input, level: typeof level === 'string' ? getLevel(level) : level });
  const H = game.level.harness ?? {};
  const clock = (minute) => formatClock(minute, game.level.day.start); // "2:30 PM": the level's day, not level 1's
  const LANDMARKS = { ...ENGINE_LANDMARKS, ...H.landmarks }; // my_seat: built in, a level needn't name it
  const hardStop = new Set([...HARD_STOP, ...(H.stops?.hard ?? [])]);
  const softStop = new Set([...SOFT_STOP, ...(H.stops?.soft ?? [])]);
  const log = []; // { loop, minute, name, payload }
  game.events.on('*', (name, payload) => {
    log.push({ loop: game.persist.loop, minute: game.clock.minute, name, payload });
  });

  // One real-time frame, mirroring main.js (fast-forward / forced-work multipliers).
  function frame() {
    if (game.phase !== 'day') return;
    const mult = frameMult(game);
    for (let i = 0; i < mult && game.phase === 'day'; i++) tick(game, FIXED_DT);
    updateFx(game, FIXED_DT);
    game.time += FIXED_DT;
    input.clearPresses(); // a press is only valid for the frame it was made in
    onFrame?.(game);
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
        if (hardStop.has(n) || (soft && softStop.has(n))) return { frames, stoppedBy: n };
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
      ? `(you were stuck at your desk doing assigned work from ${clock(from)} to ${clock(game.clock.minute)})`
      : `(you couldn't move from ${clock(from)} to ${clock(game.clock.minute)})`;
  }

  function parseDuration(tokens) {
    if (tokens[0] === 'until') {
      const target = at(tokens[1] ?? '', game.level.day.start);
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
    const spots = game.level.spots;
    const spotName = LANDMARKS[name] ?? (spots[name] ? name : null);
    if (spotName) {
      const s = spots[spotName];
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

    if (cmd === 'help') return { text: helpText(game.level) };
    if (cmd === 'look') return { text: '' };
    if (cmd === 'continue' || cmd === 'start') {
      if (game.phase === 'day' && !game.outcome) return { text: 'the day is still going (use restart to give up)' };
      while (game.phase === 'day') frame(); // let the end-of-day beat finish
      startLoop(game);
      return { text: `--- LOOP ${game.persist.loop} begins: ${clock(0)}, at your desk ---` };
    }
    if (cmd === 'restart') {
      startLoop(game);
      return { text: `--- gave up. LOOP ${game.persist.loop} begins: ${clock(0)}, at your desk ---` };
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
      case 'put':
        result = put(tokens.find((t) => !PRETEND(t)), tokens.some(PRETEND));
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

  // Put down what you hold on `name` (a spot), or on the nearest free spot that takes it.
  function put(name, busy) {
    const p = game.player;
    const free = putSpots(game.level).filter((e) => (!name || e.name === name) && canPut(p, game.world, e));
    const what = p.held ? `the ${p.held}` : 'empty hands';
    if (!free.length) {
      frame();
      return { text: `nothing to put down here: no free spot${name ? ` ${name}` : ''} takes ${what}` };
    }
    const isTarget = () => p.focus?.action === 'put' && free.some((e) => e.name === p.focus.id);
    if (!isTarget()) {
      const e = free.reduce((a, b) => (Math.hypot(b.x - p.x, b.y - p.y) < Math.hypot(a.x - p.x, a.y - p.y) ? b : a));
      const g = goto(e.name, busy);
      if (!/^walked/.test(g.text)) return g;
      if (!isTarget()) return { text: `${g.text}, but the ✋ target is ${focusText(game)}` };
    }
    return interact();
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
    describeEvents: (events, opts) => describeEvents(events, { level: game.level, ...opts }),
  };
}

// ---------------------------------------------------------------------------------------------
// Observation (text for LLMs) and event summaries.

const COMPASS8 = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];
function compass(rad) {
  const i = Math.round(((rad % (2 * Math.PI)) + 2 * Math.PI) / (Math.PI / 4)) % 8;
  return COMPASS8[i];
}
// The focus hint in words (a human sees the target lit up with the E key cap; a legacy level adds an action icon).
function focusText(game) {
  const f = game.player.focus;
  if (!f) return 'none in reach';
  const verb = f.action === 'drop' ? `drop the ${game.player.held}` : actionRow(game, f.action)?.text ?? f.action ?? 'interact';
  const icon = f.icon ? `${f.icon} ` : '';
  return f.kind === 'self' ? `${icon}${verb}` : `${icon}${f.id}: ${verb}`;
}
const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);

export function observe(game, { map = true, debug = false } = {}) {
  const out = [];
  const p = game.player;
  const H = game.level.harness ?? {};
  // Same as the HUD: one slot per route, blank until found.
  const routes = game.level.routes.map(({ id, icon }) => `[${game.persist.routesFound.includes(id) ? icon : ' ? '}]`).join('');
  const { meetingAt, start } = game.level.day;
  out.push(`LOOP ${game.persist.loop} | ${formatClock(game.clock.minute, start)} (meeting at ${formatClock(meetingAt, start)}, ${Math.max(0, Math.ceil(meetingAt - game.clock.minute))} game min left) | route slots: ${routes}`);

  if (game.phase === 'end' && game.outcome) {
    const o = game.outcome;
    const verdict = H.outcomeText?.(o) ?? `${o.result.toUpperCase()}${o.routes?.length ? ` (routes: ${o.routes.join(' + ')})` : ''}`;
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
  if (H.playerText) state.push(...H.playerText(game));
  if (p.busy) state.push(`PRETENDING (${p.busyPose})`);
  if (p.action) state.push(`doing ${p.action.type} ${Math.round((p.action.t / p.action.duration) * 100)}%`);
  if (game.clock.forced > 0) state.push(`FORCED WORK: ${Math.ceil(game.clock.forced)} game min left`);
  if (game.clock.ff) state.push(`time ×${FF_MULT}`);
  out.push(`YOU: ${state.join(', ')}`);
  // Only what a player would see (the level's statusText: what shows over people's heads).
  const status = H.statusText ? [...H.statusText(game)] : [];
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
    if (H.npcText) bits.push(...H.npcText(game, n));
    else if (n.carry) bits.push(`holding ${n.carry}`);
    if (debug) bits.push(`[debug: ${n.label ?? ''} override=${n.override}]`);
    out.push(`  ${n.id.padEnd(4)} ${bits.join(', ')}`);
  }
  const bubbles = game.fx.bubbles.map((b) => `${typeof b.owner === 'string' ? b.owner : 'sign'}: ${b.kind === 'thought' ? '💭' : '💬'} ${b.icons.join('')}`);
  if (bubbles.length) out.push(`BUBBLES: ${bubbles.join(' | ')}`);

  const items = game.world.items;
  if (H.worldText) out.push(H.worldText(game));
  else if (items.length) out.push(`WORLD: on the floor: ${items.map((i) => `${i.type}@(${f1(i.x)},${f1(i.y)})`).join(', ')}`);

  if (map) out.push(renderMap(game));
  return out.join('\n');
}

// ASCII map: walls/furniture from the level, '*' = floor some NPC can currently see,
// @ = you, an NPC's id initial (only if visible on the floor), letters = interactables.
function renderMap(game) {
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
  for (const n of actives) grid[Math.floor(n.y)][Math.floor(n.x)] = n.id[0].toLowerCase();
  grid[Math.floor(game.player.y)][Math.floor(game.player.x)] = '@';
  const tens = '    ' + Array.from({ length: m.w }, (_, i) => (i % 10 === 0 ? String(i / 10) : ' ')).join('');
  const ones = '    ' + Array.from({ length: m.w }, (_, i) => String(i % 10)).join('');
  const rows = grid.map((r, y) => `${String(y).padStart(3)} ${r.join('')}`);
  return [
    ...(game.level.harness?.mapKey ?? ['MAP (# wall, G glass, T desk/table, D door, H plant, i item, @ you, a letter: a person, * floor someone can see right now):']),
    tens,
    ones,
    ...rows,
  ].join('\n');
}

// One line per event a human would notice. level: whose words (default: the registry's default level);
// its harness.describe() speaks for the level's own events first.
export function describeEvents(events, { verbose = false, level = defaultLevel } = {}) {
  const H = level.harness ?? {};
  const NAME = { player: 'you', ...H.names };
  const memo = {};
  const lines = [];
  let lastText = null;
  let repeats = 0;
  for (const e of events) {
    const t = formatClock(e.minute, level.day.start);
    const p = e.payload ?? {};
    let s = H.describe?.(e, memo);
    if (s === undefined) switch (e.name) {
      case 'say': {
        const who = typeof p.owner === 'string' ? NAME[p.owner] ?? p.owner : 'a sign';
        if (p.kind === 'sign' && typeof p.owner === 'string') { s = `a sign over ${who} says ${p.icons.join('')}`; break; } // an inspection's ✔️
        const you = p.owner === 'player';
        s = `${who} ${p.kind === 'thought' ? (you ? 'think' : 'thinks') : you ? 'say' : 'says'} ${p.icons.join('')}`;
        break;
      }
      case 'witness:notice': s = `${NAME[p.by] ?? p.by} noticed you ❓`; break;
      case 'witness:tattle': s = `${NAME[p.by] ?? p.by} points at you ❗👉`; break;
      case 'work:done': s = 'forced work finished'; break;
      case 'caught': s = `CAUGHT by ${NAME[p.by] ?? p.by} (${p.reason})`; break;
      case 'action:cancel': s = `your action was interrupted (${p.reason})`; break;
      case 'npc:vanish': s = `${NAME[p.id] ?? p.id} left the floor`; break;
      case 'npc:appear': s = `${NAME[p.id] ?? p.id} is back`; break;
      case 'meeting:gather': s = 'everyone gathers for the meeting'; break; // a level's describe() names the place
      case 'day:end': s = `DAY OVER (${p.outcome?.result})`; break;
      case 'loop:start': s = null; break;
      case 'item:drop': s = `you dropped the ${p.type}`; break;
      case 'item:pickup': s = `you picked up the ${p.type}`; break;
      case 'noise': s = 'a noise! heads turn'; break; // (sim/mechanics/attention.js)
      case 'npc:heard': s = `${NAME[p.id] ?? p.id} looks toward the noise`; break;
      case 'item:put': s = `you put the ${p.type} down at ${p.spot}`; break;
      case 'item:found': s = `${NAME[p.by] ?? p.by} found the ${p.type} at ${p.spot}`; break;
      case 'inspect:start': s = `${NAME[p.by] ?? p.by} starts an inspection 📋`; break;
      case 'inspect:pass': s = `${NAME[p.by] ?? p.by} ticks off check ${p.index + 1} ✔️`; break;
      case 'inspect:fail': s = `${NAME[p.by] ?? p.by} marks check ${p.index + 1} ❌`; break;
      case 'inspect:done': s = `${NAME[p.by] ?? p.by} finishes the inspection ${p.failed === null ? '✔️' : '❌'}`; break;
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
