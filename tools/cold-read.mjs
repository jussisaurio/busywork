#!/usr/bin/env node
// Cold reads (docs/COLD-READ.md): fresh readers who see only what a player sees judge a level, in three stages.
//   premise   step 1: the card alone. Step 2: the card, step 1's reading, premise.md and the level's source files.
//   pictures  step 1: the card and the shots (src/levels/<id>/shots.js, drawn by tools/shots.mjs), numbered, not
//             named. Step 2: that reading, what each shot must say (the intents), the shots.
//   replay    step 1: the card and a strip of frames per route check (tools/lib/replay.mjs), numbered, not named.
//             Step 2: those readings, which check each run was, and premise.md's ways to win and lose.
// Each step is a fresh `claude -p` (tools: Read and Glob) whose working folder is a new temp folder that holds only
// that step's bundle. Its reply is captured from stdout. The prompt is prompts/common.md plus the step's own prompt
// (tools/cold-read/prompts/).
//
// The result goes in src/levels/<id>/cold-read.md, one section per stage, replaced when the stage runs again: the
// verdict (the first line of the last step's reply), the date, the commit, a hash of the stage's inputs, and every
// step's reply verbatim. A stage is fresh while its inputs hash to the recorded value:
//   premise   the card and premise.md
//   pictures  the card, the shots list (names, commands, intents) and the PNG bytes of every shot
//   replay    the card, the route checks, premise.md's ways to win and lose, and every frame and caption
// The PNGs are the same bytes on every run on one machine, but fonts and the canvas version change them: a stage
// recorded on another machine can show as stale. tools/gate.mjs requires every stage `works` and fresh.
//
//   node tools/cold-read.mjs --level <id> --stage <stage> [--model <m>] [--keep]  run the readers and record the result
//   node tools/cold-read.mjs --level <id> --stage <stage> --bundle-only           build the bundles for a manual run
//   node tools/cold-read.mjs --level <id> --stage <stage> --record <report.md>    record a manual run's report
//   node tools/cold-read.mjs --status                                              every non-fixture level's stages
//
// Without `claude -p`: --bundle-only prints each step's folder, prompt file and where its reply goes. Run a fresh
// agent in that folder with that prompt, save the reply, and run --bundle-only again for the next step (a step 2
// bundle holds step 1's reply). Then --record <the last step's reply> writes the section.
// The pictures and replay stages draw with @napi-rs/canvas: npm install --prefix tools/.deps @napi-rs/canvas
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getLevel, levels } from '../src/levels/index.js';
import { loadShots, renderShots } from './shots.mjs';
import { captureRuns, captionsText, runsIndex } from './lib/replay.mjs';
import { loadChecks } from './lib/route-ctx.mjs';
import { loadCanvas, SHOTS_DIR } from './lib/draw.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const PROMPTS = join(ROOT, 'tools', 'cold-read', 'prompts');
export const STAGES = ['premise', 'pictures', 'replay'];
export const VERDICTS = ['works', 'fixable', 'broken'];
export const REPLAY_BATCH = 60; // frames per replay step 1 reader: runs are kept whole, so one reader may get more
export const isFixture = (id) => id.startsWith('fixture');
export const levelDir = (id) => join(ROOT, 'src', 'levels', id);
export const recordFile = (root) => join(root, 'cold-read.md');
export const runCommand = (id, stage) => `node tools/cold-read.mjs --level ${id} --stage ${stage}`;
const pad2 = (n) => String(n).padStart(2, '0');
const rel = (p) => relative(ROOT, p) || '.';

// What a hash part is, for "stale: <what> changed".
const PART_NAMES = {
  card: 'the card', premise: 'premise.md', shots: 'shots.js', pictures: 'the rendered shots',
  checks: 'route-checks.js', ways: 'premise.md\'s ways to win and lose', frames: 'the replay strips',
};

// sha256 over parts (strings or Buffers), each length-prefixed so no two lists hash alike.
export function sha(...parts) {
  const h = createHash('sha256');
  for (const p of parts) {
    const b = Buffer.isBuffer(p) ? p : Buffer.from(String(p));
    h.update(`${b.length}:`);
    h.update(b);
  }
  return h.digest('hex');
}

// premise.md: { name: its H1, sections: { heading: text from the '## heading' line to the next '## ' } }.
export function parsePremise(text) {
  const name = /^#\s+(.+?)\s*$/m.exec(text)?.[1] ?? null;
  const sections = {};
  let cur = null;
  for (const line of text.split('\n')) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) sections[(cur = m[1])] = [];
    if (cur) sections[cur].push(line);
  }
  for (const k of Object.keys(sections)) sections[k] = sections[k].join('\n').trim();
  return { name, sections };
}

// The card as a player sees it before the loop: the level's name, the two lines, the badge.
export function cardText(level, name) {
  const lines = [`Level name: ${name}`, '', 'Mission card:', ...level.title.mission];
  const badge = level.title.badge ?? [];
  if (badge.length) lines.push('', `Card icons: ${badge.join(' ')}`);
  return lines.join('\n') + '\n';
}

// The level's own source files, for the premise review: every .js in its folder but shots.js. { name: text }.
export function levelSources(id) {
  const dir = levelDir(id);
  return Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'shots.js').sort()
    .map((f) => [f, readFileSync(join(dir, f), 'utf8')]));
}

// Everything the stage's readers see, built once: { id, stage, card, hash, parts, ... }. root: where premise.md and
// cold-read.md live (the level's folder). shots, checks: stand-ins for shots.js and route-checks.js. lib: the canvas.
export async function stageInputs(id, stage, { root = levelDir(id), lib, shots, checks } = {}) {
  if (!STAGES.includes(stage)) throw new Error(`no stage '${stage}' (${STAGES.join(', ')})`);
  const level = getLevel(id);
  const pf = join(root, 'premise.md');
  if (!existsSync(pf)) throw new Error(`no ${rel(pf)} (docs/COLD-READ.md says what goes in it)`);
  const premise = readFileSync(pf, 'utf8');
  const P = parsePremise(premise);
  if (!P.name) throw new Error(`${rel(pf)} has no '# <Level name>' first heading`);
  const off = level.title.mission.filter((l) => !(P.sections.Card ?? '').includes(l));
  if (off.length) throw new Error(`${rel(pf)}: '## Card' must hold the card's lines exactly as the level has them: ${off.map((l) => JSON.stringify(l)).join(', ')}`);
  const card = cardText(level, P.name);
  const parts = { card: sha(card) };
  const inp = { id, stage, level, root, card, premise, parts };
  if (stage === 'premise') {
    parts.premise = sha(premise);
    inp.src = levelSources(id);
  } else if (stage === 'pictures') {
    const list = shots ?? (await loadShots(id));
    inp.shots = await renderShots(id, { lib: lib ?? loadCanvas(), shots: list });
    parts.shots = sha(JSON.stringify(list.map((s) => ({ name: s.name, cmds: s.cmds, intent: s.intent }))));
    parts.pictures = sha(...inp.shots.map((s) => s.png));
  } else {
    const ways = ['Ways to win', 'Ways to lose'].map((k) => P.sections[k]);
    if (ways.some((w) => !w)) throw new Error(`${rel(pf)} needs '## Ways to win' and '## Ways to lose' sections`);
    inp.ways = ways.join('\n\n') + '\n';
    const list = checks ?? (await loadChecks(level));
    if (!list?.length) throw new Error(`no route checks in src/levels/${id}/route-checks.js`);
    inp.runs = captureRuns(level, list, { lib: lib ?? loadCanvas() });
    parts.checks = sha(...list.map((c) => JSON.stringify({ name: c.name, expect: c.expect, cmds: c.cmds }) + String(c.play ?? '')));
    parts.ways = sha(inp.ways);
    parts.frames = sha(...inp.runs.flatMap((r) => r.frames.flatMap((f) => [f.png, f.caption])));
  }
  inp.hash = sha(...Object.entries(parts).map(([k, v]) => `${k}=${v}`));
  return inp;
}

// Groups replay runs into readers' batches of at most `max` frames, keeping each run whole.
export function batchRuns(runs, max = REPLAY_BATCH) {
  const out = [];
  let cur = [];
  let n = 0;
  for (const r of runs) {
    if (cur.length && n + r.frames.length > max) { out.push(cur); cur = []; n = 0; }
    cur.push(r);
    n += r.frames.length;
  }
  if (cur.length) out.push(cur);
  return out;
}

const prefixed = (pre, obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [pre + k, v]));

// The stage's steps, in order: { id, prompt (file in PROMPTS), reply (what its reply is called), needs: [step ids],
// files(replies) → { path in the bundle: string | Buffer } }.
export function stageSteps(inp, { batch = REPLAY_BATCH } = {}) {
  const { card } = inp;
  if (inp.stage === 'premise') {
    return [
      { id: '1-card', prompt: 'premise-1-card.md', reply: 'first-read.md', needs: [], files: () => ({ 'card.txt': card }) },
      {
        id: '2-review', prompt: 'premise-2-review.md', reply: 'report.md', needs: ['1-card'],
        files: (r) => ({ 'card.txt': card, 'first-read.md': r['1-card'], 'premise.md': inp.premise, ...prefixed('src/', inp.src) }),
      },
    ];
  }
  if (inp.stage === 'pictures') {
    // Numbered, not named: a shot's name ('lin-sees-theft') would tell the reader what to see.
    const shots = Object.fromEntries(inp.shots.map((s, i) => [`shots/${pad2(i + 1)}.png`, s.png]));
    const intents = ['What each screenshot in shots/ must tell a first-time player.', '',
      ...inp.shots.map((s, i) => `- ${pad2(i + 1)}.png (${s.name}): ${s.intent}`), ''].join('\n');
    return [
      { id: '1-read', prompt: 'pictures-1-read.md', reply: 'reading.md', needs: [], files: () => ({ 'card.txt': card, ...shots }) },
      { id: '2-compare', prompt: 'pictures-2-compare.md', reply: 'report.md', needs: ['1-read'], files: (r) => ({ 'reading.md': r['1-read'], 'intents.md': intents, ...shots }) },
    ];
  }
  const runFiles = (list) => Object.assign({}, ...list.map((run) => {
    const n = inp.runs.indexOf(run) + 1;
    return {
      [`runs/${run.dir}/captions.md`]: captionsText(n, run),
      ...Object.fromEntries(run.frames.map((f) => [`runs/${run.dir}/${f.file}`, f.png])),
    };
  }));
  const batches = batchRuns(inp.runs, batch);
  const reads = batches.map((b, k) => ({
    id: `1-read-${k + 1}`, prompt: 'replay-1-read.md', reply: 'reading.md', needs: [], runs: b.map((r) => r.dir),
    files: () => ({ 'card.txt': card, ...runFiles(b) }),
  }));
  const reading = (r) => (reads.length === 1 ? r[reads[0].id]
    : reads.map((s) => `# Runs ${s.runs[0]} to ${s.runs[s.runs.length - 1]}\n\n${r[s.id].trim()}\n`).join('\n'));
  return [...reads, {
    id: '2-compare', prompt: 'replay-2-compare.md', reply: 'report.md', needs: reads.map((s) => s.id),
    files: (r) => ({ 'reading.md': reading(r), 'runs.md': runsIndex(inp.runs), 'ways.md': inp.ways, ...runFiles(inp.runs) }),
  }];
}

// A step's full prompt: the common preamble, then its own.
export const promptText = (file) => `${readFileSync(join(PROMPTS, 'common.md'), 'utf8').trim()}\n\n${readFileSync(join(PROMPTS, file), 'utf8').trim()}\n`;

// The verdict on a report's first line: 'works' | 'fixable' | 'broken', or null when the line is not a verdict.
// Markdown emphasis around it (**Verdict: works**) is forgiven; anything else on the line is not.
export function parseVerdict(text) {
  const first = String(text ?? '').split('\n').find((l) => l.trim()) ?? '';
  const m = /^verdict:\s*(works|fixable|broken)\.?$/i.exec(first.replace(/[*_`#>]/g, '').trim());
  return m ? m[1].toLowerCase() : null;
}

// A new temp folder for one step's bundle, outside the repo.
function bundleDir(id, stage, step) {
  return mkdtempSync(join(tmpdir(), `busywork-cold-read-${id}-${stage}-${step}-`));
}
export function writeFiles(dir, files) {
  for (const [p, data] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, p)), { recursive: true });
    writeFileSync(join(dir, p), data);
  }
}

// The default runner: `claude -p` in the bundle folder, reading only, no session saved, nothing inherited from a
// calling Claude Code session. Returns { text, costUsd, ms }.
export function claudeRunner({ timeoutMs = 30 * 60 * 1000 } = {}) {
  return ({ prompt, cwd, model }) => new Promise((resolve, reject) => {
    const args = ['-p', prompt, '--tools', 'Read,Glob', '--safe-mode', '--restricted', '--strict-mcp-config',
      '--permission-prompts', 'none', '--no-session-persistence', '--output-format', 'json'];
    if (model) args.push('--model', model);
    const env = { ...process.env };
    for (const k of Object.keys(env)) {
      if (k.startsWith('CLAUDE_CODE_') || ['CLAUDECODE', 'CLAUDE_PID', 'CLAUDE_EFFORT', 'AI_AGENT'].includes(k)) delete env[k];
    }
    const child = spawn('claude', args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.on('error', (e) => { clearTimeout(timer); reject(new Error(`claude -p could not start: ${e.message}`)); });
    child.on('close', (code) => {
      clearTimeout(timer);
      let j;
      try { j = JSON.parse(out); } catch {
        return reject(new Error(`claude -p exited ${code} without a JSON reply: ${(err || out).trim().slice(-600)}`));
      }
      if (j.is_error || typeof j.result !== 'string') return reject(new Error(`claude -p failed: ${String(j.result ?? j.subtype ?? 'no result').slice(0, 600)}`));
      resolve({ text: j.result, costUsd: j.total_cost_usd ?? null, ms: j.duration_ms ?? null, denials: j.permission_denials?.length ?? 0 });
    });
  });
}

export function gitCommit() {
  try {
    const head = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
    const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).trim();
    return dirty ? `${head}+dirty` : head;
  } catch {
    return 'unknown';
  }
}

// Runs a stage's readers through `runner` and records the result. Returns the record. Steps whose needs are met run
// together (the replay readers' batches). keep: leave the bundle folders behind (their paths are logged).
export async function runStage(id, stage, opts = {}) {
  const { runner = claudeRunner(), model = null, keep = false, log = (s) => console.error(s), batch } = opts;
  const inp = await stageInputs(id, stage, opts);
  const steps = stageSteps(inp, { batch });
  const replies = {};
  const results = {};
  const dirs = [];
  let done = false;
  try {
    while (Object.keys(results).length < steps.length) {
      const ready = steps.filter((s) => !results[s.id] && s.needs.every((n) => n in replies));
      await Promise.all(ready.map(async (s) => {
        const cwd = bundleDir(id, stage, s.id);
        dirs.push(cwd);
        writeFiles(cwd, s.files(replies));
        log(`cold-read: ${id} ${stage} step ${s.id}: reading ${cwd}`);
        const t0 = Date.now();
        const out = await runner({ prompt: promptText(s.prompt), cwd, model, step: s.id });
        const ms = Date.now() - t0;
        replies[s.id] = out.text;
        results[s.id] = { id: s.id, reply: s.reply, text: out.text, ms, costUsd: out.costUsd ?? null };
        log(`cold-read: ${id} ${stage} step ${s.id}: done in ${(ms / 1000).toFixed(0)} s${out.costUsd != null ? `, $${out.costUsd.toFixed(2)}` : ''}${out.denials ? ` (${out.denials} reads refused)` : ''}`);
      }));
    }
    done = true;
  } finally {
    // A failed run keeps its bundles, to look at.
    if (done && !keep) for (const d of dirs) rmSync(d, { recursive: true, force: true });
    else if (!done) log(`cold-read: ${id} ${stage}: failed; the bundles are kept in ${dirs.join(', ')}`);
  }
  const rec = makeRecord(inp, steps.map((s) => results[s.id]), {
    model: model ?? 'default', by: 'claude -p', commit: opts.commit ?? gitCommit(), now: opts.now ?? new Date(),
  });
  writeSection(recordFile(inp.root), id, rec);
  return rec;
}

export function makeRecord(inp, results, { model, by, commit, now }) {
  const last = results[results.length - 1];
  return {
    stage: inp.stage, verdict: parseVerdict(last.text) ?? 'unreadable', date: now.toISOString().slice(0, 10), commit,
    hash: inp.hash, parts: inp.parts, model, by, steps: results,
  };
}

// --- the record: src/levels/<id>/cold-read.md ---

const OPEN = (stage) => new RegExp(`<!-- cold-read:${stage} (\\{.*?\\}) -->\\n([\\s\\S]*?)<!-- /cold-read:${stage} -->\\n?`);

// { stage: { meta, text } } for every stage section in a record file's text.
export function parseRecord(text) {
  const out = {};
  for (const stage of STAGES) {
    const m = OPEN(stage).exec(text ?? '');
    if (!m) continue;
    let meta;
    try { meta = JSON.parse(m[1]); } catch { meta = { verdict: 'unreadable' }; }
    out[stage] = { meta, text: m[0] };
  }
  return out;
}

export function readRecord(root) {
  const f = recordFile(root);
  return existsSync(f) ? parseRecord(readFileSync(f, 'utf8')) : {};
}

const secs = (ms) => (ms == null ? '-' : `${Math.round(ms / 1000)} s`);
const usd = (c) => (c == null ? '-' : `$${c.toFixed(2)}`);

// One stage's section: a machine-readable marker, a summary, then every step's reply verbatim.
export function renderSection(rec) {
  const meta = { verdict: rec.verdict, date: rec.date, commit: rec.commit, hash: rec.hash, parts: rec.parts, model: rec.model };
  const inputs = Object.keys(rec.parts).map((k) => PART_NAMES[k] ?? k).join(', ');
  const total = (k) => (rec.steps.every((s) => s[k] == null) ? null : rec.steps.reduce((a, s) => a + (s[k] ?? 0), 0));
  const lines = [
    `<!-- cold-read:${rec.stage} ${JSON.stringify(meta)} -->`,
    `## ${rec.stage}: ${rec.verdict}`,
    `Recorded ${rec.date} at commit ${rec.commit}, by ${rec.by} (model: ${rec.model}). Inputs ${rec.hash.slice(0, 12)}: ${inputs}.`,
    '',
    '| Step | Reply | Time | Cost |',
    '|---|---|---|---|',
    ...rec.steps.map((s) => `| ${s.id} | ${s.reply} | ${secs(s.ms)} | ${usd(s.costUsd)} |`),
    `| all | | ${secs(total('ms'))} | ${usd(total('costUsd'))} |`,
    '',
  ];
  for (const s of rec.steps) lines.push(`### ${s.id}: ${s.reply}`, '', s.text.trim(), '');
  lines.push(`<!-- /cold-read:${rec.stage} -->`, '');
  return lines.join('\n');
}

// Writes rec's section into the record file, replacing the stage's old section. Sections stay in STAGES order.
export function writeSection(file, id, rec) {
  const old = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const sections = parseRecord(old);
  sections[rec.stage] = { meta: null, text: renderSection(rec) };
  let head = old.split('<!-- cold-read:')[0].trimEnd();
  if (!head) head = `# Cold reads: ${id}\nWritten by tools/cold-read.mjs (docs/COLD-READ.md). Each stage's section is replaced when the stage runs again.`;
  const body = STAGES.filter((s) => sections[s]).map((s) => sections[s].text.trimEnd()).join('\n\n');
  writeFileSync(file, `${head}\n\n${body}\n`);
}

// --- status ---

// One stage of a level: { stage, verdict (null: never run), date, commit, fresh, changed: [what], error, ok }.
// Building the inputs draws the shots and strips for pictures and replay.
export async function stageStatus(id, stage, opts = {}) {
  const root = opts.root ?? levelDir(id);
  const meta = readRecord(root)[stage]?.meta ?? null;
  const s = { stage, verdict: meta?.verdict ?? null, date: meta?.date ?? null, commit: meta?.commit ?? null, fresh: null, changed: [], error: null };
  try {
    const inp = await stageInputs(id, stage, { ...opts, root });
    if (meta) {
      s.fresh = meta.hash === inp.hash;
      s.changed = Object.keys(inp.parts).filter((k) => meta.parts?.[k] !== inp.parts[k]).map((k) => PART_NAMES[k] ?? k);
    }
  } catch (e) {
    s.error = e.message;
  }
  s.ok = s.verdict === 'works' && s.fresh === true;
  return s;
}

// The gate's checks for a level's cold reads: one { name, ok, text, detail } per stage.
export async function coldReadChecks(id, opts = {}) {
  const out = [];
  for (const stage of STAGES) {
    const s = await stageStatus(id, stage, opts);
    out.push({ name: `cold-read:${stage}`, ok: s.ok, text: statusText(id, s), detail: s.ok ? [] : [`run: ${runCommand(id, stage)}`] });
  }
  return out;
}

// Every level the gate requires cold reads of.
export const coldReadLevels = () => Object.keys(levels).filter((l) => !isFixture(l));

// The --status report: for each level, one line per stage.
export async function statusLines(ids = coldReadLevels(), opts = {}) {
  const lines = [];
  for (const id of ids) {
    lines.push(id);
    for (const stage of STAGES) {
      const s = await stageStatus(id, stage, opts);
      lines.push(`  ${s.ok ? 'ok  ' : 'TODO'}  ${stage.padEnd(9)}${statusText(id, s)}`);
    }
  }
  return lines;
}

export function statusText(id, s) {
  const when = s.date ? ` (${s.date}, ${s.commit})` : '';
  const file = `src/levels/${id}/cold-read.md`;
  if (!s.verdict) return s.error ? `no cold read yet, and it can't run: ${s.error}` : 'no cold read yet';
  if (s.error) return `${s.verdict}${when}, but its freshness can't be checked: ${s.error}`;
  if (s.verdict !== 'works') return `${s.verdict}${when}: fix the problems ${file} lists, then run the stage again${s.fresh ? '' : ' (and its inputs changed since)'}`;
  if (!s.fresh) return `works${when}, but stale: ${s.changed.join(', ')} changed since`;
  return `works${when}, fresh`;
}

// --- a manual run: --bundle-only, then --record ---

export const pointerFile = (id, stage) => join(SHOTS_DIR, id, `cold-read-${stage}.json`);

// Builds the bundles of every step whose needs have replies (reusing the last manual run's folder while the inputs
// are the same). Returns { work, steps: [{ id, dir, prompt, replyFile, state: 'replied' | 'ready' | 'waiting' }] }.
export async function bundleOnly(id, stage, opts = {}) {
  const inp = await stageInputs(id, stage, opts);
  const steps = stageSteps(inp, opts);
  const ptr = opts.pointer ?? pointerFile(id, stage);
  let man = null;
  try {
    man = JSON.parse(readFileSync(join(JSON.parse(readFileSync(ptr, 'utf8')).work, 'manifest.json'), 'utf8'));
  } catch { /* no earlier run */ }
  if (!man || man.hash !== inp.hash || !existsSync(man.work)) {
    const work = mkdtempSync(join(tmpdir(), `busywork-cold-read-${id}-${stage}-`));
    man = {
      level: id, stage, hash: inp.hash, parts: inp.parts, commit: opts.commit ?? gitCommit(), work,
      steps: steps.map((s) => ({ id: s.id, reply: s.reply, dir: null, prompt: join(work, `${s.id}.prompt.md`), replyFile: join(work, `${s.id}.${s.reply}`) })),
    };
  }
  const replies = {};
  for (const m of man.steps) if (existsSync(m.replyFile) && readFileSync(m.replyFile, 'utf8').trim()) replies[m.id] = readFileSync(m.replyFile, 'utf8');
  for (const [i, s] of steps.entries()) {
    const m = man.steps[i];
    if (replies[s.id] != null) m.state = 'replied';
    else if (s.needs.every((n) => n in replies)) {
      if (!m.dir || !existsSync(m.dir)) {
        m.dir = bundleDir(id, stage, s.id);
        writeFiles(m.dir, s.files(replies));
        writeFileSync(m.prompt, promptText(s.prompt));
      }
      m.state = 'ready';
    } else m.state = 'waiting';
  }
  mkdirSync(dirname(ptr), { recursive: true });
  writeFileSync(join(man.work, 'manifest.json'), JSON.stringify(man, null, 2));
  writeFileSync(ptr, JSON.stringify({ work: man.work }));
  return man;
}

// Records a manual run: the last step's reply from `file`, the earlier ones from the --bundle-only folder.
export function recordManual(id, stage, file, opts = {}) {
  const ptr = opts.pointer ?? pointerFile(id, stage);
  if (!existsSync(ptr)) throw new Error(`no manual run of ${id} ${stage}: run --bundle-only first`);
  const man = JSON.parse(readFileSync(join(JSON.parse(readFileSync(ptr, 'utf8')).work, 'manifest.json'), 'utf8'));
  const last = man.steps[man.steps.length - 1];
  if (file !== last.replyFile) writeFileSync(last.replyFile, readFileSync(file, 'utf8'));
  const missing = man.steps.filter((m) => !existsSync(m.replyFile) || !readFileSync(m.replyFile, 'utf8').trim());
  if (missing.length) throw new Error(`no reply yet for step ${missing.map((m) => m.id).join(', ')} (save it as ${missing[0].replyFile})`);
  const results = man.steps.map((m) => ({ id: m.id, reply: m.reply, text: readFileSync(m.replyFile, 'utf8'), ms: null, costUsd: null }));
  const rec = makeRecord({ stage, hash: man.hash, parts: man.parts }, results, {
    model: opts.model ?? 'unknown', by: 'a manual run (--bundle-only)', commit: man.commit, now: opts.now ?? new Date(),
  });
  writeSection(recordFile(opts.root ?? levelDir(id)), id, rec);
  return rec;
}

// --- CLI ---

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const arg = (name) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };
  const has = (name) => argv.includes(`--${name}`);
  const usage = 'usage: node tools/cold-read.mjs --level <id> --stage premise|pictures|replay [--model <m>] [--keep] [--bundle-only | --record <report.md>]\n       node tools/cold-read.mjs --status';
  try {
    if (has('status')) {
      for (const l of await statusLines()) console.log(l);
      process.exit(0);
    }
    const id = arg('level');
    const stage = arg('stage');
    if (!id || !stage || !STAGES.includes(stage)) { console.error(usage); process.exit(2); }
    getLevel(id);
    if (has('record')) {
      const file = arg('record');
      if (!file || !existsSync(file)) throw new Error(`--record needs the last step's reply file (${file ?? 'none given'})`);
      const rec = recordManual(id, stage, file, { model: arg('model') });
      console.log(`cold-read: ${id} ${stage}: Verdict: ${rec.verdict}. Recorded in ${recordFile(levelDir(id))}`);
    } else if (has('bundle-only')) {
      const man = await bundleOnly(id, stage);
      console.log(`cold-read: ${id} ${stage}: a manual run, in ${man.work}`);
      const last = man.steps[man.steps.length - 1];
      for (const m of man.steps) {
        if (m.state === 'replied') console.log(`  step ${m.id}: done (${m.replyFile})`);
        else if (m.state === 'waiting') console.log(`  step ${m.id}: waits for the steps before it`);
        else {
          console.log(`  step ${m.id}: run a fresh agent whose working folder is ${m.dir}, with the prompt in ${m.prompt}.`);
          console.log(`      It may only read the files in that folder. Save its reply as ${m.replyFile}`);
        }
      }
      if (last.state === 'ready') console.log(`then: node tools/cold-read.mjs --level ${id} --stage ${stage} --record ${last.replyFile}`);
      else console.log(`then run this command again: the next step's bundle needs those replies`);
    } else {
      const t0 = Date.now();
      const rec = await runStage(id, stage, { model: arg('model'), keep: has('keep') });
      const cost = rec.steps.reduce((a, s) => a + (s.costUsd ?? 0), 0);
      console.log(`cold-read: ${id} ${stage}: Verdict: ${rec.verdict} (${Math.round((Date.now() - t0) / 1000)} s, $${cost.toFixed(2)}). Recorded in ${recordFile(levelDir(id))}`);
      if (rec.verdict === 'unreadable') process.exitCode = 1;
    }
  } catch (e) {
    console.error(`cold-read: ${e.message}`);
    process.exit(1);
  }
}
