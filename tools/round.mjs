#!/usr/bin/env node
// Round report: "how did this round of agent work go?" Read-only. Reads the Claude Code transcripts of one session (the main
// session plus its subagents, flat under <session>/subagents/agent-<id>.jsonl with a .meta.json beside each) and git (unmerged
// branches), and prints per agent: wall time, turns, tokens, tool calls, check runs, waiting gaps; then concurrency, branches, flags.
// Prints only derived numbers and each agent's short description, never message text. Anything the files do not say prints "unknown".
//
//   node tools/round.mjs [--session <uuid>] [--since <ISO time | 3h | 45m>] [--json]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const argv = process.argv;
const arg = (n) => { const i = argv.indexOf(`--${n}`); return i > 0 ? argv[i + 1] : undefined; };
const GAP = 120e3;          // a gap over 2 minutes counts as waiting
const HEAVY = 150000;       // flag: input (uncached) + output tokens
const CHECKS_MAX = 5;

const root = process.cwd().includes('/.claude/worktrees/') ? process.cwd().split('/.claude/worktrees/')[0] : process.cwd();
const projDir = join(homedir(), '.claude', 'projects', root.replace(/[/.]/g, '-'));
if (!existsSync(projDir)) { console.error(`round: no transcripts at ${projDir}`); process.exit(2); }

let session = arg('session');
if (!session) {
  const fs = readdirSync(projDir).filter((f) => f.endsWith('.jsonl'));
  if (!fs.length) { console.error('round: no sessions'); process.exit(2); }
  session = fs.map((f) => [f, statSync(join(projDir, f)).mtimeMs]).sort((a, b) => b[1] - a[1])[0][0].replace('.jsonl', '');
}
let since = 0;
const sa = arg('since');
if (sa) {
  const m = /^(\d+(?:\.\d+)?)([hm])$/.exec(sa);
  since = m ? Date.now() - Number(m[1]) * (m[2] === 'h' ? 3600e3 : 60e3) : Date.parse(sa);
  if (Number.isNaN(since)) { console.error(`round: cannot read --since ${sa}`); process.exit(2); }
}

let badLines = 0;
function readJsonl(file) {
  const out = [];
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { out.push(JSON.parse(line)); } catch { badLines++; }
  }
  return out;
}
const readMeta = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return {}; } };
const blocks = (e) => (Array.isArray(e?.message?.content) ? e.message.content : []);

// One agent from its entries: only lines with a readable timestamp count as entries.
function summarize(id, entries, meta) {
  const ts = [];
  const msgs = new Map();   // assistant message id -> usage and tool calls; a message is logged once per content block
  const edits = [];         // times of file edits and git commits
  let tools = 0, check = 0, gate = 0, golden = 0;
  for (const e of entries) {
    const t = Date.parse(e?.timestamp);
    if (Number.isNaN(t) || t < since) continue;
    ts.push(t);
    if (e.type !== 'assistant' || !e.message) continue;
    const key = e.message.id || e.uuid;
    const m = msgs.get(key) || { usage: {}, calls: new Map(), model: e.message.model };
    const u = e.message.usage || {};
    for (const k of ['input_tokens', 'output_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens']) m.usage[k] = Math.max(m.usage[k] || 0, u[k] || 0);
    for (const c of blocks(e)) if (c?.type === 'tool_use') m.calls.set(c.id, { name: c.name, input: c.input, t });
    msgs.set(key, m);
  }
  let tokIn = 0, tokOut = 0, tokAll = 0, model = null;
  for (const m of msgs.values()) {
    const u = m.usage;
    tokIn += u.input_tokens; tokOut += u.output_tokens;
    tokAll += u.input_tokens + u.output_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens;
    model = m.model || model;
    for (const b of m.calls.values()) {
      tools++;
      const cmd = typeof b.input?.command === 'string' ? b.input.command : '';
      if (b.name === 'Bash') {
        if (/tools\/check\.mjs/.test(cmd)) check++;
        if (/tools\/gate\.mjs/.test(cmd)) gate++;
        if (/tools\/golden[\w-]*\.mjs/.test(cmd)) golden++;
        if (/\bgit\b[^|;&\n]*\bcommit\b/.test(cmd)) edits.push(b.t);
      } else if (b.name === 'Edit' || b.name === 'Write' || b.name === 'NotebookEdit') edits.push(b.t);
    }
  }
  ts.sort((a, b) => a - b);
  const start = ts[0] ?? null, end = ts.at(-1) ?? null;
  let maxGap = 0, waiting = 0;
  for (let i = 1; i < ts.length; i++) { const g = ts[i] - ts[i - 1]; maxGap = Math.max(maxGap, g); if (g > GAP) waiting += g; }
  const wall = start == null ? 0 : end - start;
  return {
    id, description: meta.description ?? (id === 'main' ? 'main session' : 'unknown'), model: meta.model ?? model ?? 'unknown',
    parent: null, branch: meta.worktreeBranch ?? null,
    start, end, wallMin: wall / 60e3, turns: msgs.size, tokOut, tokIn, tokAll, tools, check, gate, golden,
    maxGapMin: maxGap / 60e3, waitShare: wall ? waiting / wall : 0, edits: edits.length,
    quietLastThird: wall > 0 && !edits.some((t) => t >= start + wall * 2 / 3),
  };
}

const sessionFile = join(projDir, `${session}.jsonl`);
if (!existsSync(sessionFile)) { console.error(`round: no session ${session}`); process.exit(2); }
const mainEntries = readJsonl(sessionFile);
const agents = [summarize('main', mainEntries, {})];
const owner = new Map();   // Agent tool_use id -> id of the agent whose transcript holds it
const noteOwner = (entries, id) => { for (const e of entries) for (const c of blocks(e)) if (c?.type === 'tool_use' && c.name === 'Agent') owner.set(c.id, id); };
noteOwner(mainEntries, 'main');
const subDir = join(projDir, session, 'subagents');
const metas = {};
if (existsSync(subDir)) {
  for (const f of readdirSync(subDir).filter((f) => f.endsWith('.jsonl')).sort()) {
    const id = f.replace(/^agent-/, '').replace('.jsonl', '');
    const entries = readJsonl(join(subDir, f));
    metas[id] = readMeta(join(subDir, `agent-${id}.meta.json`));
    noteOwner(entries, id);
    const a = summarize(id, entries, metas[id]);
    if (a.start != null) agents.push(a);
  }
}
for (const a of agents) if (a.id !== 'main') a.parent = metas[a.id]?.toolUseId ? (owner.get(metas[a.id].toolUseId) ?? 'unknown') : 'unknown';
agents.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));

// Concurrency: wall time in the window with 0, 1, 2, 3+ subagents active (active = between first and last entry).
const subs = agents.filter((a) => a.id !== 'main');
const span = subs.length ? subs : agents;   // the window is the subagents' span: the main session may stay open for days
const wStart = Math.min(...span.map((a) => a.start ?? Infinity)), wEnd = Math.max(...span.map((a) => a.end ?? -Infinity));
const conc = { 0: 0, 1: 0, 2: 0, '3+': 0 };
if (Number.isFinite(wStart)) {
  const ev = subs.flatMap((a) => [[a.start, 1], [a.end, -1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let n = 0, prev = wStart;
  const add = (t) => { conc[n >= 3 ? '3+' : n] += (t - prev) / 60e3; prev = t; };
  for (const [t, d] of ev) { add(t); n += d; }
  add(wEnd);
}
const windowMin = Number.isFinite(wStart) ? (wEnd - wStart) / 60e3 : 0;

// Git: branches not merged into main.
const git = (...a) => { try { return execFileSync('git', a, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
const branches = [];
const unmerged = git('branch', '--no-merged', 'main', '--format=%(refname:short)');
for (const b of (unmerged ?? '').split('\n').filter(Boolean)) {
  const ts = (git('log', `main..${b}`, '--format=%ct') ?? '').split('\n').filter(Boolean).map((x) => Number(x) * 1000).sort((a, c) => a - c);
  if (!ts.length || ts.at(-1) < since) continue;
  const gaps = ts.slice(1).map((t, i) => (t - ts[i]) / 60e3).sort((a, c) => a - c);
  const h = gaps.length / 2;
  const med = gaps.length ? (gaps.length % 2 ? gaps[h - 0.5] : (gaps[h - 1] + gaps[h]) / 2) : null;
  branches.push({ branch: b, ahead: ts.length, first: ts[0], last: ts.at(-1), medianGapMin: med });
}

const total = { agents: agents.length, subagents: subs.length, windowMin, tokOut: 0, tokAll: 0, tools: 0, check: 0, gate: 0, golden: 0 };
for (const a of agents) for (const k of ['tokOut', 'tokAll', 'tools', 'check', 'gate', 'golden']) total[k] += a[k];

const flags = [];
for (const a of agents) {
  const name = `${a.id.slice(0, 8)} ${a.description}`;
  if (a.tokIn + a.tokOut > HEAVY) flags.push(`${name}: ${(a.tokIn + a.tokOut) / 1000 | 0}k uncached input + output tokens (over ${HEAVY / 1000}k)`);
  if (a.quietLastThird && a.wallMin > 10) flags.push(`${name}: no commits or file edits in the last third of its ${a.wallMin.toFixed(0)} min (possible diminishing returns)`);
  if (a.check > CHECKS_MAX) flags.push(`${name}: ran check.mjs ${a.check} times`);
}
if (subs.length >= 2 && windowMin > 0 && conc[1] / windowMin > 0.5) flags.push(`${(100 * conc[1] / windowMin).toFixed(0)}% of the window had only one subagent running, with ${subs.length} subagents in total`);

if (argv.includes('--json')) {
  console.log(JSON.stringify({ session, since: since || null, badLines, agents, concurrencyMin: conc, branches, total, flags }, null, 1));
  process.exit(0);
}

const hhmm = (t) => (t == null ? '--:--' : new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
const k = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}k` : String(n));
const depthOf = (a) => { let d = 0; for (let p = a; p.parent && p.parent !== 'main' && p.parent !== 'unknown' && d < 9; d++) p = agents.find((x) => x.id === p.parent) ?? { parent: null }; return d; };
console.log(`round: session ${session}${since ? `, since ${new Date(since).toISOString()}` : ''}${badLines ? `, ${badLines} unreadable lines skipped` : ''}`);
console.log('agents (wait% = share of wall time in gaps over 2 min; the main session waits for the human too)');
console.log(`${'agent'.padEnd(36)} ${'model'.padEnd(16)} start  wall  turns   out  total  tools chk gate gold maxgap wait%  parent`);
for (const a of agents) {
  const name = `${'  '.repeat(depthOf(a))}${a.description}`.slice(0, 36).padEnd(36);
  const parent = a.id === 'main' ? '-' : a.parent === 'unknown' || a.parent === 'main' ? a.parent : a.parent.slice(0, 8);
  console.log(`${name} ${String(a.model).slice(0, 16).padEnd(16)} ${hhmm(a.start)} ${(a.wallMin.toFixed(0) + 'm').padStart(5)} ${String(a.turns).padStart(5)} ${k(a.tokOut).padStart(5)} ${k(a.tokAll).padStart(6)} ${String(a.tools).padStart(5)} ${String(a.check).padStart(3)} ${String(a.gate).padStart(4)} ${String(a.golden).padStart(4)} ${(a.maxGapMin.toFixed(1) + 'm').padStart(6)} ${(100 * a.waitShare).toFixed(0).padStart(4)}%  ${parent}`);
}
console.log(`\nconcurrency of subagents over ${windowMin.toFixed(0)} min (${hhmm(wStart)} to ${hhmm(wEnd)}): ` + Object.entries(conc).map(([n, m]) => `${n}: ${m.toFixed(0)}m`).join('  '));
console.log(`\nunmerged branches${branches.length ? '' : ': none'}`);
for (const b of branches) console.log(`  ${b.branch.slice(0, 40).padEnd(40)} ${String(b.ahead).padStart(3)} ahead  ${hhmm(b.first)} to ${hhmm(b.last)}  median ${b.medianGapMin == null ? 'n/a' : b.medianGapMin.toFixed(1) + ' min'} between commits`);
if (unmerged == null) console.log('  git: unknown (could not run git)');
console.log(`\ntotal: ${total.agents} agents, ${k(total.tokOut)} output tokens, ${k(total.tokAll)} tokens processed, ${total.tools} tool calls, check ${total.check}, gate ${total.gate}, golden ${total.golden}`);
if (flags.length) { console.log('\nflags'); for (const f of flags.slice(0, 4)) console.log(`  ! ${f}`); }
