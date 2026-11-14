#!/usr/bin/env node
// Play BUSYWORK from the command line — built for AI agents (and curious humans).
//
//   node tools/play.mjs new <session> [--level id]    start a fresh session (loop 1, 2:30 PM) of a level
//   node tools/play.mjs <session> "<cmd>" ["<cmd>"…]  run commands, print what happened + what you see
//   node tools/play.mjs <session> look                just observe
//   node tools/play.mjs help [--level id]             command reference
//   flags: --no-map (omit the ASCII map)  --debug (show NPC intents; for developers only)
//          --level <id> (default: the registry's default level, src/levels/index.js)
//
// Sessions are command logs in .agent-sessions/<session>.jsonl: a { level } line, then one { cmd } line per
// command. The game is deterministic, so every call replays the log from scratch and then runs the new
// commands; the game is paused between calls. A session without a { level } line plays the default level.
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHarness, helpText } from '../src/agent/harness.js';
import { defaultLevel, getLevel } from '../src/levels/index.js';
import { levelArg } from './lib/level-arg.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, '.agent-sessions');

const args = process.argv.slice(2);
const asked = args.includes('--level') ? levelArg('play') : null; // exits 2 on an unknown id
if (asked) args.splice(args.indexOf('--level'), 2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const rest = args.filter((a) => !a.startsWith('--'));
const obsOpts = { map: !flags.has('--no-map'), debug: flags.has('--debug') };

const mission = (level) => level.harness?.mission ?? 'MISSION: make sure the meeting never happens.';

if (!rest.length || rest[0] === 'help') {
  const level = asked ?? defaultLevel;
  console.log(`${mission(level)}\n\n${helpText(level)}`);
  process.exit(0);
}

mkdirSync(DIR, { recursive: true });

if (rest[0] === 'new') {
  const name = rest[1];
  if (!name || !/^[\w-]+$/.test(name)) throw new Error('usage: new <session-name>');
  const level = asked ?? defaultLevel;
  writeFileSync(join(DIR, `${name}.jsonl`), JSON.stringify({ level: level.id }) + '\n');
  const h = createHarness({ level });
  h.begin();
  console.log(`${mission(level)}\n\n--- LOOP 1 begins: 2:30 PM, at your desk ---\n`);
  console.log(h.observe(obsOpts));
  process.exit(0);
}

const name = rest[0];
const file = join(DIR, `${name}.jsonl`);
if (!existsSync(file)) throw new Error(`no session '${name}' (start one with: new ${name})`);
const lines = readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const head = lines.find((l) => 'level' in l);
const level = head ? getLevel(head.level) : defaultLevel;
if (asked && asked !== level) throw new Error(`session '${name}' plays level ${level.id}, not ${asked.id} (start a new one with: new <session> --level ${asked.id})`);
const past = lines.filter((l) => 'cmd' in l).map((l) => l.cmd);

const h = createHarness({ level });
h.begin();
for (const cmd of past) {
  const r = h.run(cmd);
  if (!r.ok) throw new Error(`replay diverged at '${cmd}': ${r.text}`);
}

const cmds = rest.slice(1);
if (!cmds.length) cmds.push('look');
for (const cmd of cmds) {
  const r = h.run(cmd);
  console.log(`> ${cmd}`);
  if (r.text) console.log(r.text);
  const ev = h.describeEvents(r.events, { verbose: obsOpts.debug });
  if (ev.length) console.log(ev.join('\n'));
  if (r.ok && cmd.trim() !== 'look' && cmd.trim() !== 'help') appendFileSync(file, JSON.stringify({ cmd }) + '\n');
  if (!r.ok) break;
}
console.log('');
console.log(h.observe(obsOpts));
