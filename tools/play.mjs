#!/usr/bin/env node
// Play BUSYWORK from the command line — built for AI agents (and curious humans).
//
//   node tools/play.mjs new <session>                 start a fresh session (loop 1, 2:30 PM)
//   node tools/play.mjs <session> "<cmd>" ["<cmd>"…]  run commands, print what happened + what you see
//   node tools/play.mjs <session> look                just observe
//   node tools/play.mjs help                          command reference
//   flags: --no-map (omit the ASCII map)  --debug (show NPC intents; for developers only)
//
// Sessions are command logs in .agent-sessions/<session>.jsonl. The game is deterministic, so every
// call replays the log from scratch and then runs the new commands; the game is paused between calls.
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHarness, describeEvents, helpText } from '../src/agent/harness.js';
import { defaultLevel } from '../src/levels/index.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, '.agent-sessions');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const rest = args.filter((a) => !a.startsWith('--'));
const obsOpts = { map: !flags.has('--no-map'), debug: flags.has('--debug') };

const MISSION = defaultLevel.harness.mission;

if (!rest.length || rest[0] === 'help') {
  console.log(`${MISSION}\n\n${helpText(defaultLevel)}`);
  process.exit(0);
}

mkdirSync(DIR, { recursive: true });

if (rest[0] === 'new') {
  const name = rest[1];
  if (!name || !/^[\w-]+$/.test(name)) throw new Error('usage: new <session-name>');
  writeFileSync(join(DIR, `${name}.jsonl`), '');
  const h = createHarness();
  h.begin();
  console.log(`${MISSION}\n\n--- LOOP 1 begins: 2:30 PM, at your desk ---\n`);
  console.log(h.observe(obsOpts));
  process.exit(0);
}

const name = rest[0];
const file = join(DIR, `${name}.jsonl`);
if (!existsSync(file)) throw new Error(`no session '${name}' (start one with: new ${name})`);
const past = readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l).cmd);

const h = createHarness();
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
  const ev = describeEvents(r.events, { verbose: obsOpts.debug });
  if (ev.length) console.log(ev.join('\n'));
  if (r.ok && cmd.trim() !== 'look' && cmd.trim() !== 'help') appendFileSync(file, JSON.stringify({ cmd }) + '\n');
  if (!r.ok) break;
}
console.log('');
console.log(h.observe(obsOpts));
