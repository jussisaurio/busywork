#!/usr/bin/env node
// Cold reads (docs/COLD-READ.md): fresh readers who see only what a player sees judge a level, in passes. Each pass
// is a small spec (PASSES, below): what its readers get, its prompts, the answer it wants per item, and its verdict
// rule. Narrow passes ask one question each and tell the reader to ignore everything else; the broad ones (premise,
// pictures, replay) ask what a first-time player makes of the whole. In order:
//   text passes (prose only: cheap, and they catch design errors before a picture is drawn)
//     title     the card (with the level's name). Step 1 guesses the way out; step 2 checks the guesses against
//               premise.md's ways to win: does the name or card hint at a route?
//     sense     the card and premise.md's ways to win and lose: would every route get past a real, half-awake boss?
//     motives   the card and premise.md's '## Who does what': does every NPC act for a reason shown first, keep his
//               own rules, and does the card's rule bind the coworkers too?
//     props     the card and premise.md's '## Things in the office': why is each thing here, does it look usable?
//     joke      the card and the ways to win and lose: what is the joke in each route, is any a chore, is there a payoff?
//     premise   (broad) step 1: the card alone. Step 2: the card, step 1's reading, premise.md and the level's sources.
//   picture passes (drawn by the tool: tools/shots.mjs, tools/lib/verbs.mjs, tools/lib/replay.mjs)
//     verbs     the verb sheets alone (one per item), numbered; step 2 gets them labelled with the engine's account.
//     faces     every distinct bubble across the route checks, drawn alone; step 2 sees each in its frame.
//     tells     for each thing the player does in a route check, the picture before and after it.
//     outcomes  the last frames and the end card of every route check, against what each run really was.
//     pictures  (broad) step 1: the card and the shots (src/levels/<id>/shots.js), numbered, not named. Step 2: that
//               reading, what each shot must say (with the clock it landed on), the shots. Two shots that render
//               pixel-identical stop the pass (tools/shots.mjs).
//     replay    (broad) step 1: the card and a strip of frames per route check, numbered, not named. Step 2: those
//               readings, which check each run was, and premise.md's ways to win and lose.
// Each step is a fresh `claude -p` (tools: Read and Glob) whose working folder is a new temp folder that holds only
// that step's bundle. Its reply is captured from stdout. A step's prompt is a preamble (prompts/text.md for the text
// passes, prompts/focus.md for the narrow picture passes, prompts/common.md for the broad ones), then the step's own
// prompt (tools/cold-read/prompts/); the premise review also gets prompts/engine.md.
//
// The result goes in src/levels/<id>/cold-read.md, one section per pass, replaced when the pass runs again: the
// verdict, the date, the commit, a hash of the pass's inputs, the tally of the item answers and the graded problems,
// the ledger, the open problems, and every step's reply verbatim. The last step's report lists every problem, graded
// blocker, should or nit (prompts/grades.md: no quota), and the verdict counts blockers only: `works` with none,
// `fixable` with any, `broken` when the reader says so. A narrow pass's bad item (a nonsense route, a leaking title)
// is a blocker. When the pass has an earlier record, its open problems go to the last step as earlier.md (the
// ledger); the reader marks each fixed, still there or no longer applies, and one still there becomes a blocker,
// tagged recurring. A report without its verdict line, its '## Problems' or (narrow) its item lines is `unreadable`.
// A pass is fresh while its inputs hash to the recorded value; every pass's
// inputs include the card and the full text of every prompt its readers get, and what else it reads (PASSES).
// The PNGs are the same bytes on every run on one machine, but fonts and the canvas version change them: a pass
// recorded on another machine can show as stale. tools/gate.mjs requires every pass `works` and fresh.
//
//   node tools/cold-read.mjs --level <id> --pass <pass>[,<pass>...|text|all] [--model <m>] [--keep]  run and record
//   node tools/cold-read.mjs --level <id> --pass <pass> --bundle-only           build the bundles for a manual run
//   node tools/cold-read.mjs --level <id> --pass <pass> --record <report.md>    record a manual run's report
//   node tools/cold-read.mjs --level <id> --pass <pass> --calibrate             a run on a reference level, read cold,
//                                                                               recorded in tools/.shots/<id>/calibrate.md
//   node tools/cold-read.mjs --status                                            every non-fixture level's passes
// --stage is the same as --pass. Several passes run at the same time; the drawings they share are made once.
//
// Without `claude -p`: --bundle-only prints each step's folder, prompt file and where its reply goes. Run a fresh
// agent in that folder with that prompt, save the reply, and run --bundle-only again for the next step (a step 2
// bundle holds step 1's reply). Then --record <the last step's reply> writes the section.
// The picture passes draw with @napi-rs/canvas: npm install --prefix tools/.deps @napi-rs/canvas
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getLevel, levels } from '../src/levels/index.js';
import { loadShots, renderShots, shotWhen } from './shots.mjs';
import { captureRuns, captureTells, captionsText, distinctFaces, runEnds, runsIndex, tellsCaptions } from './lib/replay.mjs';
import { loadChecks } from './lib/route-ctx.mjs';
import { loadCanvas, SHOTS_DIR } from './lib/draw.mjs';
import { captureVerbs, verbsIntents } from './lib/verbs.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const PROMPTS = join(ROOT, 'tools', 'cold-read', 'prompts');
export const VERDICTS = ['works', 'fixable', 'broken'];
export const REPLAY_BATCH = 60; // frames per replay step 1 reader: runs are kept whole, so one reader may get more
export const isFixture = (id) => id.startsWith('fixture');
export const levelDir = (id) => join(ROOT, 'src', 'levels', id);
export const recordFile = (root) => join(root, 'cold-read.md');
export const runCommand = (id, stage) => `node tools/cold-read.mjs --level ${id} --pass ${stage}`;
const pad2 = (n) => String(n).padStart(2, '0');
const rel = (p) => relative(ROOT, p) || '.';

// What a hash part is, for "stale: <what> changed".
const PART_NAMES = {
  card: 'the card', premise: 'premise.md', shots: 'shots.js', pictures: 'the rendered shots', verbs: 'the verb sheets',
  checks: 'route-checks.js', ways: 'premise.md\'s ways to win and lose', frames: 'the replay strips',
  who: 'premise.md\'s who does what', things: 'premise.md\'s things in the office', faces: 'the bubbles',
  tells: 'the before and after pictures', ends: 'the runs\' last frames', prompts: 'the pass\'s prompts',
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

// --- the passes ---

// The premise.md sections a text pass reads, by input name. A level without one gets a clear "can't run" from the
// pass (and from --status and the gate), never a crash.
export const SECTIONS = {
  ways: ['Ways to win', 'Ways to lose'],
  who: ['Who does what'],
  things: ['Things in the office'],
};
const SECTION_FILE = { ways: 'ways.md', who: 'who.md', things: 'things.md' };

// A narrow pass's item answers: good, meh (the reader weighs them) and bad (the pass can't work with one).
const words = (a) => [...a.good, ...a.meh, ...a.bad];

// A text pass of one step: the card and the named premise.md sections, one prompt, one report.
function textPass(id, needs, answers, about) {
  return {
    id, kind: 'text', needs, answers, about,
    steps: (inp) => [{
      id: '1-judge', base: 'text.md', prompt: `${id}.md`, reply: 'report.md', needs: [],
      files: () => ({ 'card.txt': inp.card, ...Object.fromEntries(needs.map((n) => [SECTION_FILE[n], inp[n]])) }),
    }],
  };
}

// Every pass, in the order they run and are listed: the cheap text passes first.
// A pass: { id, kind: 'text' | 'pictures', broad (asks about the whole, not one question), needs (its inputs, in
// hash order: see stageInputs), answers (null: the reader's verdict stands), about, steps(inp) → the steps }.
// A step: { id, prompt (file in PROMPTS), base (the preamble: common.md by default), extra (more files, put before
// the prompt), reply (what its reply is called), needs: [step ids], files(replies) → { bundle path: string | Buffer } }.
export const PASSES = [
  {
    id: 'title', kind: 'text', needs: ['ways'], about: 'does the name or the card hint at the way out?',
    answers: { good: ['miss'], meh: ['near'], bad: ['leak'] },
    steps: (inp) => [
      { id: '1-guess', base: 'text.md', prompt: 'title-1-guess.md', reply: 'guesses.md', needs: [], files: () => ({ 'card.txt': inp.card }) },
      {
        id: '2-judge', base: 'text.md', prompt: 'title-2-judge.md', reply: 'report.md', needs: ['1-guess'],
        files: (r) => ({ 'card.txt': inp.card, 'guesses.md': r['1-guess'], 'ways.md': inp.ways }),
      },
    ],
  },
  textPass('sense', ['ways'], { good: ['sensible'], meh: ['stretch'], bad: ['nonsense'] },
    'would every route, winning and losing, get past a real, half-awake boss?'),
  textPass('motives', ['who'], { good: ['motivated', 'binds'], meh: ['thin'], bad: ['unmotivated', 'contradicts', 'only-you'] },
    'does every NPC act for a reason shown first, keep his own rules, and does the card\'s rule bind coworkers too?'),
  textPass('props', ['things'], { good: ['fits'], meh: ['odd'], bad: ['pointless', 'misleading'] },
    'why is each thing in this office, and does it look usable when it is (and only then)?'),
  // Unfunny is a should, not a blocker (grades.md): no answer of the joke pass is a blocker by itself.
  textPass('joke', ['ways'], { good: ['funny', 'payoff'], meh: ['mild', 'chore', 'flat', 'undescribed'], bad: [] },
    'what is the joke in each route, is any a dull chore, is there a payoff at the end?'),
  {
    id: 'premise', kind: 'text', broad: true, needs: ['premise'], answers: null,
    about: 'the card alone, then the whole premise and the level\'s source files',
    steps: (inp) => [
      { id: '1-card', prompt: 'premise-1-card.md', reply: 'first-read.md', needs: [], files: () => ({ 'card.txt': inp.card }) },
      {
        id: '2-review', prompt: 'premise-2-review.md', extra: ['engine.md'], reply: 'report.md', needs: ['1-card'],
        files: (r) => ({ 'card.txt': inp.card, 'first-read.md': r['1-card'], 'premise.md': inp.premise, ...prefixed('src/', inp.src) }),
      },
    ],
  },
  {
    id: 'verbs', kind: 'pictures', needs: ['verbs'], about: 'does each verb make sense for its item, and look like it?',
    answers: { good: ['fits'], meh: ['odd'], bad: ['wrong'] },
    // Numbered, not named: step 1 gets the sheets with panel numbers only, step 2 the labelled ones.
    steps: (inp) => [
      { id: '1-read', base: 'focus.md', prompt: 'verbs-1-read.md', reply: 'reading.md', needs: [], files: () => sheetFiles(inp.verbs, 'png') },
      {
        id: '2-judge', base: 'focus.md', prompt: 'verbs-2-judge.md', reply: 'report.md', needs: ['1-read'],
        files: (r) => ({ 'reading.md': r['1-read'], 'intents.md': verbsIntents(inp.verbs), ...sheetFiles(inp.verbs, 'labelled') }),
      },
    ],
  },
  {
    id: 'faces', kind: 'pictures', needs: ['checks', 'faces'], about: 'what does each bubble say, alone and in its frame?',
    answers: { good: ['clear'], meh: ['vague'], bad: ['misread'] },
    steps: (inp) => [
      {
        id: '1-read', base: 'focus.md', prompt: 'faces-1-read.md', reply: 'reading.md', needs: [],
        files: () => Object.fromEntries(inp.faces.map((f, i) => [`bubbles/${pad2(i + 1)}.png`, f.solo])),
      },
      {
        id: '2-judge', base: 'focus.md', prompt: 'faces-2-judge.md', reply: 'report.md', needs: ['1-read'],
        files: (r) => ({
          'reading.md': r['1-read'], 'card.txt': inp.card, 'frames.md': facesIndex(inp.faces),
          ...Object.fromEntries(inp.faces.flatMap((f, i) => [[`bubbles/${pad2(i + 1)}.png`, f.solo], [`frames/${pad2(i + 1)}.png`, f.png]])),
        }),
      },
    ],
  },
  {
    id: 'tells', kind: 'pictures', needs: ['checks', 'tells'], about: 'can you see what each of the player\'s actions changed?',
    answers: { good: ['visible'], meh: ['faint'], bad: ['invisible'] },
    steps: (inp) => {
      const pics = Object.fromEntries(inp.tells.map((t) => [`tells/${t.file}`, t.png]));
      return [
        { id: '1-read', base: 'focus.md', prompt: 'tells-1-read.md', reply: 'reading.md', needs: [], files: () => ({ 'captions.md': tellsCaptions(inp.tells), ...pics }) },
        {
          id: '2-judge', base: 'focus.md', prompt: 'tells-2-judge.md', reply: 'report.md', needs: ['1-read'],
          files: (r) => ({ 'reading.md': r['1-read'], 'tells.md': tellsIndex(inp.tells), ...pics }),
        },
      ];
    },
  },
  {
    id: 'outcomes', kind: 'pictures', needs: ['checks', 'ways', 'ends'], about: 'does each run\'s end look like what happened?',
    answers: { good: ['clear'], meh: ['unclear'], bad: ['wrong'] },
    steps: (inp) => {
      const runs = runFiles(inp.ends, inp.ends);
      return [
        { id: '1-read', base: 'focus.md', prompt: 'outcomes-1-read.md', reply: 'reading.md', needs: [], files: () => ({ 'card.txt': inp.card, ...runs }) },
        {
          id: '2-judge', base: 'focus.md', prompt: 'outcomes-2-judge.md', reply: 'report.md', needs: ['1-read'],
          files: (r) => ({ 'reading.md': r['1-read'], 'runs.md': runsIndex(inp.ends), 'ways.md': inp.ways, ...runs }),
        },
      ];
    },
  },
  {
    id: 'pictures', kind: 'pictures', broad: true, needs: ['shots'], answers: null,
    about: 'the shots, numbered, then against what each must say',
    steps: (inp) => {
      // Numbered, not named: a shot's name ('lin-sees-theft') would tell the reader what to see.
      const shots = Object.fromEntries(inp.shots.map((s, i) => [`shots/${pad2(i + 1)}.png`, s.png]));
      // Each intent is a builder's words; the clock the shot landed on is the engine's, so a shot taken at another
      // moment than its intent describes shows up here rather than as a puzzling misread.
      const intents = ['What each screenshot in shots/ must tell a first-time player, and the game clock it was taken at.', '',
        ...inp.shots.map((s, i) => `- ${pad2(i + 1)}.png (${s.name}, ${shotWhen(s)}): ${s.intent}`), ''].join('\n');
      return [
        { id: '1-read', prompt: 'pictures-1-read.md', reply: 'reading.md', needs: [], files: () => ({ 'card.txt': inp.card, ...shots }) },
        { id: '2-compare', prompt: 'pictures-2-compare.md', reply: 'report.md', needs: ['1-read'], files: (r) => ({ 'reading.md': r['1-read'], 'intents.md': intents, ...shots }) },
      ];
    },
  },
  {
    id: 'replay', kind: 'pictures', broad: true, needs: ['checks', 'ways', 'frames'], answers: null,
    about: 'a strip of frames per route check: can you tell why each loop ended?',
    steps: (inp, { batch = REPLAY_BATCH } = {}) => {
      const batches = batchRuns(inp.runs, batch);
      const reads = batches.map((b, k) => ({
        id: `1-read-${k + 1}`, prompt: 'replay-1-read.md', reply: 'reading.md', needs: [], runs: b.map((r) => r.dir),
        files: () => ({ 'card.txt': inp.card, ...runFiles(inp.runs, b) }),
      }));
      const reading = (r) => (reads.length === 1 ? r[reads[0].id]
        : reads.map((s) => `# Runs ${s.runs[0]} to ${s.runs[s.runs.length - 1]}\n\n${r[s.id].trim()}\n`).join('\n'));
      return [...reads, {
        id: '2-compare', prompt: 'replay-2-compare.md', reply: 'report.md', needs: reads.map((s) => s.id),
        files: (r) => ({ 'reading.md': reading(r), 'runs.md': runsIndex(inp.runs), 'ways.md': inp.ways, ...runFiles(inp.runs, inp.runs) }),
      }];
    },
  },
];
export const STAGES = PASSES.map((p) => p.id);
export const passOf = (id) => {
  const p = PASSES.find((x) => x.id === id);
  if (!p) throw new Error(`no pass '${id}' (${STAGES.join(', ')})`);
  return p;
};
// A --pass argument: one pass, a comma list, 'text' (the narrow text passes) or 'all'.
export function passList(arg) {
  if (arg === 'all') return [...STAGES];
  if (arg === 'text') return PASSES.filter((p) => p.kind === 'text' && !p.broad).map((p) => p.id);
  const list = String(arg ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  for (const id of list) passOf(id);
  return list;
}

const prefixed = (pre, obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [pre + k, v]));
const sheetFiles = (sheets, which) => Object.fromEntries((sheets ?? []).map((s) => [`verbs/${s.file}`, s[which]]));
// runs/<dir>/NN.png and captions.md for each run in `list`, numbered by its place in `all`.
const runFiles = (all, list) => Object.assign({}, ...list.map((run) => {
  const n = all.indexOf(run) + 1;
  return {
    [`runs/${run.dir}/captions.md`]: captionsText(n, run),
    ...Object.fromEntries(run.frames.map((f) => [`runs/${run.dir}/${f.file}`, f.png])),
  };
}));
// What the faces judge is told about each bubble: where it came up, when, and how often. Never what it means.
function facesIndex(faces) {
  return ['Each bubble in bubbles/ came up in the picture with the same number in frames/.', '',
    ...faces.map((f, i) => `- ${pad2(i + 1)}: a ${f.kind} bubble, ${f.clock}, over the person at about x ${f.x ?? '?'}, y ${f.y ?? '?'} in the frame. Seen ${f.count} time${f.count === 1 ? '' : 's'} in the runs.`), ''].join('\n');
}
// What the tells judge is told about each pair: what the engine says the player did, and in which route.
function tellsIndex(tells) {
  return ['What the player really did between BEFORE and AFTER in each picture in tells/, from the engine.', '',
    ...tells.map((t) => `- ${t.file} (${t.clock}): ${t.label}. In the route "${t.check}".`), ''].join('\n');
}

// Everything the pass's readers see, built once: { id, stage, pass, card, hash, parts, ... }. root: where premise.md
// and cold-read.md live (the level's folder). shots, checks: stand-ins for shots.js and route-checks.js. lib: the
// canvas. prompts: the folder the prompts come from (tests only). cache: a Map shared by the passes of one run, so
// the strips and sheets several passes read are drawn once.
// The hash parts go in the order of the pass's needs, after the card and before the prompts.
export async function stageInputs(id, stage, { root = levelDir(id), lib, shots, checks, prompts = PROMPTS, cache = new Map(), batch } = {}) {
  const pass = passOf(stage);
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
  const inp = { id, stage, pass, level, root, card, premise, parts, prompts };
  const memo = (key, fn) => {
    const k = `${id}:${key}`;
    if (!cache.has(k)) cache.set(k, fn());
    return cache.get(k);
  };
  const canvas = () => lib ?? loadCanvas();
  for (const need of pass.needs) {
    if (need === 'premise') {
      parts.premise = sha(premise);
      inp.src = levelSources(id);
    } else if (SECTIONS[need]) {
      const missing = SECTIONS[need].filter((k) => !P.sections[k]);
      if (missing.length) throw new Error(`${rel(pf)} has no ${missing.map((k) => `'## ${k}'`).join(' or ')} section, which the ${stage} pass reads (docs/COLD-READ.md says what goes in it)`);
      // The prose under the headings: the reader gets the words, not the file's layout.
      inp[need] = SECTIONS[need].map((k) => P.sections[k]).join('\n\n') + '\n';
      parts[need] = sha(inp[need]);
    } else if (need === 'shots') {
      const list = shots ?? (await loadShots(id));
      inp.shots = await renderShots(id, { lib: canvas(), shots: list });
      parts.shots = sha(JSON.stringify(list.map((s) => ({ name: s.name, cmds: s.cmds, intent: s.intent, beat: s.beat }))));
      parts.pictures = sha(...inp.shots.map((s) => s.png));
    } else if (need === 'verbs') {
      inp.verbs = memo('verbs', () => captureVerbs(level, { lib: canvas() }).sheets);
      parts.verbs = sha(...inp.verbs.flatMap((s) => [s.png, s.labelled, s.intent]));
    } else if (need === 'checks') {
      const list = checks ?? (await memo('checks', () => loadChecks(level)));
      if (!list?.length) throw new Error(`no route checks in src/levels/${id}/route-checks.js`);
      inp.checks = list;
      parts.checks = sha(...list.map((c) => JSON.stringify({ name: c.name, expect: c.expect, cmds: c.cmds }) + String(c.play ?? '')));
    } else if (need === 'frames' || need === 'ends' || need === 'faces') {
      const runs = memo('runs', () => captureRuns(level, inp.checks, { lib: canvas() }));
      if (need === 'frames') {
        inp.runs = runs;
        parts.frames = sha(...runs.flatMap((r) => r.frames.flatMap((f) => [f.png, f.caption])));
      } else if (need === 'ends') {
        inp.ends = runEnds(runs);
        parts.ends = sha(...inp.ends.flatMap((r) => [runsIndex([r]), ...r.frames.flatMap((f) => [f.png, f.caption])]));
      } else {
        inp.faces = distinctFaces(runs);
        if (!inp.faces.length) throw new Error(`no bubble comes up in any route check of ${id}`);
        parts.faces = sha(...inp.faces.flatMap((f) => [f.solo, f.png, facesIndex([f])]));
      }
    } else if (need === 'tells') {
      inp.tells = memo('tells', () => captureTells(level, inp.checks, { lib: canvas() }));
      if (!inp.tells.length) throw new Error(`the route checks of ${id} use nothing (no interaction, put or sit)`);
      parts.tells = sha(...inp.tells.flatMap((t) => [t.png, tellsIndex([t])]));
    } else throw new Error(`pass ${stage}: no input '${need}'`);
  }
  // Every prompt the pass's readers get, so a prompt change makes the pass stale too.
  parts.prompts = sha(...new Set(stageSteps(inp, { batch }).map((s) => stepPrompt(s, prompts))));
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

// The pass's steps, in order (PASSES says what a step is). The last step writes the report, so it is graded: its
// prompt ends with grades.md (the problem grades and the ledger of earlier problems, the same for every pass).
export const stageSteps = (inp, opts = {}) => {
  const steps = (inp.pass ?? passOf(inp.stage)).steps(inp, opts);
  return steps.map((s, i) => (i === steps.length - 1 ? { ...s, graded: true } : s));
};

// A step's full prompt: its preamble (common.md unless the step names another), any extra files (the engine rules),
// then its own.
export const promptText = (file, extra = [], dir = PROMPTS, base = 'common.md', after = []) =>
  [base, ...extra, file, ...after].map((f) => readFileSync(join(dir, f), 'utf8').trim()).join('\n\n') + '\n';
export const stepPrompt = (s, dir = PROMPTS) => promptText(s.prompt, s.extra, dir, s.base, s.graded ? ['grades.md'] : []);

// The item lines of a narrow pass's report: `- <item>: <answer> — <why>`, answer one of the pass's words.
// Returns [{ item, answer, why }].
export function parseItems(text, answers) {
  const alt = words(answers).map((w) => w.replace(/[-]/g, '\\-')).join('|');
  const re = new RegExp(`^\\s*[-*]\\s+(.+?)\\s*:\\s*[*_\`]*(${alt})[*_\`]*(?=[\\s.,;:—–-]|$)[\\s.,;:—–-]*(.*)$`, 'i');
  const out = [];
  for (const line of String(text ?? '').split('\n')) {
    const m = re.exec(line);
    if (m) out.push({ item: m[1].replace(/[*_`]/g, '').trim(), answer: m[2].toLowerCase(), why: m[3].trim() });
  }
  return out;
}

// --- grades and the ledger ---
// Every report ends with its problems, each graded (grades.md): there is no quota, and the verdict counts blockers
// only. When the pass has an earlier record, the reader first marks that record's open problems (the ledger); one
// still there is promoted to a blocker, as recurring.
export const GRADES = ['blocker', 'should', 'nit'];
export const MARKS = ['fixed', 'still there', 'no longer applies'];
export const RECURRING = 'recurring: premise-level?';
const LEDGER_FILE = 'earlier.md';

// The lines under a '## <name>' heading (any level, bold forgiven), up to the next heading; null without one.
function sectionLines(text, name) {
  const lines = String(text ?? '').split('\n');
  const head = new RegExp(`^#{1,4}\\s*${name}\\s*:?$`, 'i');
  const i = lines.findIndex((l) => head.test(l.replace(/[*_`]/g, '').trim()));
  if (i < 0) return null;
  const out = [];
  for (const l of lines.slice(i + 1)) {
    if (/^#{1,4}\s/.test(l.trim())) break;
    out.push(l);
  }
  return out;
}

// '- <grade>: <problem> — <fix>' lines under '## Problems' (a wrapped line joins the one before). null: no section.
export function parseProblems(text) {
  const lines = sectionLines(text, 'Problems');
  if (!lines) return null;
  const out = [];
  for (const l of lines) {
    const m = /^\s*[-*]\s+[*_`]*(blocker|should|nit)[*_`]*\s*[:—–-]\s*(.+)$/i.exec(l);
    if (m) out.push({ grade: m[1].toLowerCase(), text: m[2].trim() });
    else if (out.length && /^\s+\S/.test(l) && !/^\s*[-*]\s/.test(l)) out[out.length - 1].text += ` ${l.trim()}`;
  }
  return out;
}

// '- E<n>: fixed|still there|no longer applies — <why>' lines under '## Earlier problems'. { E1: { mark, why } }.
export function parseLedger(text) {
  const out = {};
  for (const l of sectionLines(text, 'Earlier problems') ?? []) {
    const m = /^\s*[-*]\s+[*_`]*(E\d+)[*_`]*\s*[:—–-]?\s*[*_`]*(fixed|still there|no longer applies)[*_`]*[\s.,;:—–-]*(.*)$/i.exec(l);
    if (m) out[m[1].toUpperCase()] = { mark: m[2].toLowerCase(), why: m[3].trim() };
  }
  return out;
}

// What the next reader of a pass gets from its earlier record section: { items: [{ id, grade, text }], raw }.
// A record written since the grades has an '### Open problems' list; an older one gives its last report (raw),
// whose problems the reader numbers. null: no earlier record, or nothing open.
export function earlierFrom(section) {
  const text = section?.text;
  if (!text) return null;
  const open = sectionLines(text, 'Open problems');
  if (open) {
    const items = open.map((l) => /^- (E\d+) \[(blocker|should)\] (.+)$/.exec(l)).filter(Boolean).map((m) => ({ id: m[1], grade: m[2], text: m[3] }));
    return items.length ? { items, raw: null } : null;
  }
  const lines = text.split('\n').filter((l) => !l.startsWith('<!-- '));
  const last = lines.map((l, i) => (/^### [\w-]+: /.test(l) ? i : -1)).filter((i) => i >= 0).pop();
  const raw = last == null ? '' : lines.slice(last + 1).join('\n').trim();
  return raw ? { items: [], raw } : null;
}

// earlier.md, for the last step's bundle.
export function ledgerText(earlier) {
  if (earlier.raw) {
    return `# An earlier report\nAn earlier reader's report on an earlier version of this level. Number the problems it lists E1, E2, ... in its order.\n\n${earlier.raw}\n`;
  }
  return `# Earlier problems\nFound by an earlier reader, on an earlier version of this level.\n\n${earlier.items.map((e) => `- ${e.id} [${e.grade}] ${e.text}`).join('\n')}\n`;
}

// A pass's verdict, from its last report. { verdict, tally (items, narrow passes), problems ({ blocker, should, nit }),
// ledger ([{ id, text, mark, why }] or null), open ([{ id, grade, text }]: carried to the next run), note }.
// - The reader's verdict line must be there (else unreadable). `broken` stands.
// - Otherwise the verdict counts blockers: `works` with none, `fixable` with any, whatever the reader said. The
//   blockers are the '## Problems' blockers, every earlier problem still there (promoted, as recurring), and, in a
//   narrow pass, every item with a bad answer (nonsense, leak...).
// - A report with no '## Problems' section, or a narrow one with no item lines, is unreadable.
// - The open list is every blocker and should (not nits), renumbered E1...; it is what the next run's reader marks.
export function passVerdict(pass, text, earlier = null) {
  const said = parseVerdict(text);
  const items = pass?.answers ? parseItems(text, pass.answers) : null;
  const tally = items && Object.fromEntries(words(pass.answers).map((w) => [w, items.filter((i) => i.answer === w).length]));
  const problems = parseProblems(text);
  const marks = parseLedger(text);
  let ledger = null;
  if (earlier?.raw) ledger = Object.entries(marks).map(([id, m]) => ({ id, text: m.why || id, ...m }));
  else if (earlier?.items?.length) ledger = earlier.items.map((e) => ({ id: e.id, text: e.text, ...(marks[e.id] ?? { mark: 'still there', why: 'not marked by the reader' }) }));
  const still = (ledger ?? []).filter((e) => e.mark === 'still there');
  const recurring = still.map((e) => ({ grade: 'blocker', text: `${e.text.replace(` (${RECURRING})`, '')} (${RECURRING})` }));
  const listed = problems ?? [];
  const bad = items ? items.filter((i) => pass.answers.bad.includes(i.answer)) : [];
  // A bad item is a blocker; it joins the list only when the reader listed no blocker for it.
  const fromItems = listed.some((p) => p.grade === 'blocker') ? [] : bad.map((b) => ({ grade: 'blocker', text: `${b.item}: ${b.answer}${b.why ? ` — ${b.why}` : ''}` }));
  const all = [...recurring, ...listed, ...fromItems];
  const count = Object.fromEntries(GRADES.map((g) => [g, all.filter((p) => p.grade === g).length]));
  const open = all.filter((p) => p.grade !== 'nit').map((p, i) => ({ id: `E${i + 1}`, ...p }));
  const out = { tally, problems: problems ? count : null, ledger, open, note: null };
  if (!said) return { ...out, verdict: 'unreadable' };
  if (said === 'broken') return { ...out, verdict: 'broken' };
  if (items && !items.length) return { ...out, verdict: 'unreadable', note: `the report has no item lines ('- <item>: ${words(pass.answers).join(' | ')} — why')` };
  if (!problems) return { ...out, verdict: 'unreadable', note: "the report has no '## Problems' section ('- blocker|should|nit: <problem> — <fix>', or '- none')" };
  const verdict = count.blocker ? 'fixable' : 'works';
  if (verdict !== said) {
    const why = [];
    if (listed.some((p) => p.grade === 'blocker')) why.push(`listed ${listed.filter((p) => p.grade === 'blocker').length} blocker(s)`);
    if (fromItems.length) why.push(`marked ${bad.map((b) => `"${b.item}" ${b.answer}`).join(', ')}: a ${pass.answers.bad.join(' or ')} item is a blocker`);
    if (recurring.length) why.push(`${recurring.length} earlier problem(s) still there, promoted to blockers`);
    out.note = verdict === 'works' ? `the reader said ${said}, but listed no blocker: the verdict counts blockers only` : `the reader said ${said}, but ${why.join('; ')}`;
  }
  return { ...out, verdict };
}

// The verdict on a report's first line: 'works' | 'fixable' | 'broken', or null when the line is not a verdict.
// Markdown emphasis around it (**Verdict: works**) is forgiven; anything else on the line is not.
// The verdict line opens the reply. Reviewers sometimes put one or two lines of chatter first ("I've read the files;
// writing the report now."), so the first VERDICT_LINES non-empty lines may hold it; a verdict further down (a quote
// in the report) doesn't count.
const VERDICT_LINES = 3;
export function parseVerdict(text) {
  const lines = String(text ?? '').split('\n').filter((l) => l.trim()).slice(0, VERDICT_LINES);
  for (const line of lines) {
    const m = /^verdict:\s*(works|fixable|broken)\.?$/i.exec(line.replace(/[*_`#>]/g, '').trim());
    if (m) return m[1].toLowerCase();
  }
  return null;
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

// The commit the inputs come from: HEAD, plus "+dirty" when files other than the cold-read records have changed
// (a record written by an earlier stage changes nothing a reader sees).
export function gitCommit() {
  try {
    const head = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
    const dirty = execFileSync('git', ['status', '--porcelain', '--', '.', ':(exclude,glob)src/levels/*/cold-read.md'], { cwd: ROOT, encoding: 'utf8' }).trim();
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
  // The ledger: the open problems of the pass's earlier record, for the last step. Not an input (not hashed): the
  // record it comes from changes with every run. A calibration run (ledger: false) reads cold.
  const earlier = opts.ledger === false ? null : earlierFrom(readRecord(inp.root)[stage]);
  const replies = {};
  const results = {};
  const dirs = [];
  let done = false;
  const t0 = Date.now();
  try {
    while (Object.keys(results).length < steps.length) {
      const ready = steps.filter((s) => !results[s.id] && s.needs.every((n) => n in replies));
      await Promise.all(ready.map(async (s) => {
        const cwd = bundleDir(id, stage, s.id);
        dirs.push(cwd);
        writeFiles(cwd, stepFiles(s, replies, earlier));
        log(`cold-read: ${id} ${stage} step ${s.id}: reading ${cwd}`);
        const t0 = Date.now();
        const out = await runner({ prompt: stepPrompt(s, inp.prompts), cwd, model, step: s.id });
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
    wallMs: Date.now() - t0, earlier,
  });
  writeSection(opts.recordTo ?? recordFile(inp.root), id, rec);
  return rec;
}

// A step's bundle: its own files, and earlier.md (the ledger) for the graded last step.
const stepFiles = (s, replies, earlier) => ({ ...s.files(replies), ...(s.graded && earlier ? { [LEDGER_FILE]: ledgerText(earlier) } : {}) });

export function makeRecord(inp, results, { model, by, commit, now, wallMs = null, earlier = null }) {
  const last = results[results.length - 1];
  const v = passVerdict(passOf(inp.stage), last.text, earlier);
  return {
    stage: inp.stage, verdict: v.verdict, tally: v.tally, problems: v.problems, ledger: v.ledger, open: v.open, note: v.note,
    date: now.toISOString().slice(0, 10), commit, hash: inp.hash, parts: inp.parts, model, by, steps: results, wallMs,
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
  if (rec.tally) meta.tally = rec.tally;
  if (rec.problems) meta.problems = rec.problems;
  const inputs = Object.keys(rec.parts).map((k) => PART_NAMES[k] ?? k).join(', ');
  const total = (k) => (rec.steps.every((s) => s[k] == null) ? null : rec.steps.reduce((a, s) => a + (s[k] ?? 0), 0));
  const lines = [
    `<!-- cold-read:${rec.stage} ${JSON.stringify(meta)} -->`,
    `## ${rec.stage}: ${rec.verdict}`,
    `Recorded ${rec.date} at commit ${rec.commit}, by ${rec.by} (model: ${rec.model}). Inputs ${rec.hash.slice(0, 12)}: ${inputs}.`,
    ...(rec.tally ? [`Items: ${Object.entries(rec.tally).map(([w, n]) => `${n} ${w}`).join(', ')}.`] : []),
    ...(rec.problems ? [`Problems: ${GRADES.map((g) => `${rec.problems[g]} ${g}`).join(', ')}.`] : []),
    ...(rec.ledger ? [`Earlier problems: ${MARKS.map((m) => `${rec.ledger.filter((e) => e.mark === m).length} ${m}`).join(', ')}${rec.ledger.some((e) => e.mark === 'still there') ? ' (now blockers)' : ''}.`] : []),
    ...(rec.note ? [`Recorded ${rec.verdict}: ${rec.note}.`] : []),
    '',
    '| Step | Reply | Time | Cost |',
    '|---|---|---|---|',
    ...rec.steps.map((s) => `| ${s.id} | ${s.reply} | ${secs(s.ms)} | ${usd(s.costUsd)} |`),
    // Steps can run at the same time: the stage's own time is its wall clock, when known.
    rec.wallMs != null
      ? `| all | | ${secs(rec.wallMs)} (the steps add up to ${secs(total('ms'))}) | ${usd(total('costUsd'))} |`
      : `| all | | ${secs(total('ms'))} | ${usd(total('costUsd'))} |`,
    '',
  ];
  if (rec.ledger) {
    lines.push('### Ledger', 'The earlier record\'s open problems, as this run\'s reader marked them.', '');
    lines.push(...rec.ledger.map((e) => `- ${e.id} ${e.mark}: ${e.text}${e.why && e.why !== e.text ? ` (${e.why})` : ''}`), '');
  }
  if (rec.open) {
    lines.push('### Open problems', 'The blockers and shoulds, carried to the next run\'s reader as earlier.md.', '');
    lines.push(...(rec.open.length ? rec.open.map((p) => `- ${p.id} [${p.grade}] ${p.text}`) : ['- none']), '');
  }
  for (const s of rec.steps) lines.push(`### ${s.id}: ${s.reply}`, '', s.text.trim(), '');
  lines.push(`<!-- /cold-read:${rec.stage} -->`, '');
  return lines.join('\n');
}

// Writes rec's section into the record file, replacing the pass's old section. Sections stay in PASSES order.
export function writeSection(file, id, rec) {
  const old = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const sections = parseRecord(old);
  sections[rec.stage] = { meta: null, text: renderSection(rec) };
  let head = old.split('<!-- cold-read:')[0].trimEnd();
  if (!head) head = `# Cold reads: ${id}\nWritten by tools/cold-read.mjs (docs/COLD-READ.md). Each pass's section is replaced when the pass runs again.`;
  const body = STAGES.filter((s) => sections[s]).map((s) => sections[s].text.trimEnd()).join('\n\n');
  writeFileSync(file, `${head}\n\n${body}\n`);
}

// --- status ---

// One pass of a level: { stage, verdict (null: never run), date, commit, fresh, changed: [what], error, ok }.
// Building the inputs draws what a picture pass shows (opts.cache shares the drawings between passes).
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

// The gate's checks for a level's cold reads: one { name, ok, text, detail } per pass.
export async function coldReadChecks(id, opts = {}) {
  const out = [];
  const cache = opts.cache ?? new Map();
  for (const stage of STAGES) {
    const s = await stageStatus(id, stage, { ...opts, cache });
    out.push({ name: `cold-read:${stage}`, ok: s.ok, text: statusText(id, s), detail: s.ok ? [] : [`run: ${runCommand(id, stage)}`] });
  }
  return out;
}

// Every level the gate requires cold reads of.
export const coldReadLevels = () => Object.keys(levels).filter((l) => !isFixture(l));

// The --status report: for each level, one line per pass.
export async function statusLines(ids = coldReadLevels(), opts = {}) {
  const lines = [];
  for (const id of ids) {
    lines.push(id);
    const cache = new Map();
    for (const stage of STAGES) {
      const s = await stageStatus(id, stage, { ...opts, cache });
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
  if (s.verdict !== 'works') return `${s.verdict}${when}: fix the problems ${file} lists, then run the pass again${s.fresh ? '' : ' (and its inputs changed since)'}`;
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
      earlier: opts.ledger === false ? null : earlierFrom(readRecord(inp.root)[stage]),
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
        writeFiles(m.dir, stepFiles(s, replies, man.earlier));
        writeFileSync(m.prompt, stepPrompt(s, inp.prompts));
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
    earlier: man.earlier ?? null,
  });
  writeSection(recordFile(opts.root ?? levelDir(id)), id, rec);
  return rec;
}

// --- CLI ---

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const arg = (name) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };
  const has = (name) => argv.includes(`--${name}`);
  const usage = `usage: node tools/cold-read.mjs --level <id> --pass <pass>[,<pass>...] | text | all [--model <m>] [--keep]
       node tools/cold-read.mjs --level <id> --pass <pass> --bundle-only | --record <report.md>
       node tools/cold-read.mjs --level <reference id> --pass <pass>[,...] --calibrate [--model <m>]
       node tools/cold-read.mjs --status
passes: ${STAGES.join(', ')}`;
  try {
    if (has('status')) {
      // One write, and exit once it is flushed: process.exit right after console.log cuts a piped stdout short
      // (the gate and the tests read --status through a pipe, and 13 passes x 8 levels is past the pipe's buffer).
      const out = (await statusLines()).join('\n') + '\n';
      await new Promise((done) => process.stdout.write(out, done));
      process.exit(0);
    }
    const id = arg('level');
    const which = arg('pass') ?? arg('stage');
    if (!id || !which) { console.error(usage); process.exit(2); }
    const list = passList(which);
    getLevel(id);
    const one = () => {
      if (list.length !== 1) throw new Error('--bundle-only and --record take one pass');
      return list[0];
    };
    if (has('record')) {
      const stage = one();
      const file = arg('record');
      if (!file || !existsSync(file)) throw new Error(`--record needs the last step's reply file (${file ?? 'none given'})`);
      const rec = recordManual(id, stage, file, { model: arg('model') });
      console.log(`cold-read: ${id} ${stage}: Verdict: ${rec.verdict}${rec.note ? ` (${rec.note})` : ''}. Recorded in ${recordFile(levelDir(id))}`);
    } else if (has('bundle-only')) {
      const stage = one();
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
      if (last.state === 'ready') console.log(`then: node tools/cold-read.mjs --level ${id} --pass ${stage} --record ${last.replyFile}`);
      else console.log(`then run this command again: the next step's bundle needs those replies`);
    } else {
      // Every pass at once: the readers are independent, and the drawings they share are made once (cache).
      // --calibrate: a run on a reference level (one the user is happy with), read cold (no ledger), recorded in
      // tools/.shots/<id>/calibrate.md, not the level's record. A reference level that can't get works means the
      // prompt is wrong, not the level.
      const cal = has('calibrate') ? { ledger: false, recordTo: join(SHOTS_DIR, id, 'calibrate.md') } : {};
      if (cal.recordTo) mkdirSync(dirname(cal.recordTo), { recursive: true });
      const cache = new Map();
      const t0 = Date.now();
      const recs = await Promise.all(list.map(async (stage) => {
        try {
          return await runStage(id, stage, { model: arg('model'), keep: has('keep'), cache, ...cal });
        } catch (e) {
          console.error(`cold-read: ${id} ${stage}: ${e.message}`);
          return { stage, verdict: 'not run', steps: [] };
        }
      }));
      for (const rec of recs) {
        const cost = rec.steps.reduce((a, s) => a + (s.costUsd ?? 0), 0);
        console.log(`cold-read: ${id} ${rec.stage}: Verdict: ${rec.verdict}${rec.note ? ` (${rec.note})` : ''}${rec.steps.length ? ` ($${cost.toFixed(2)})` : ''}`);
        if (cal.recordTo) for (const p of (rec.open ?? []).filter((x) => x.grade === 'blocker')) console.log(`  blocker: ${p.text}`);
      }
      console.log(`cold-read: ${list.length} pass${list.length === 1 ? '' : 'es'} in ${Math.round((Date.now() - t0) / 1000)} s. Recorded in ${cal.recordTo ?? recordFile(levelDir(id))}`);
      if (cal.recordTo) console.log('cold-read: a calibration run. A reference level that gets a blocker means the prompt is wrong: read each blocker, and fix the prompt if a real office would shrug at it.');
      if (recs.some((r) => r.verdict === 'unreadable' || r.verdict === 'not run')) process.exitCode = 1;
    }
  } catch (e) {
    console.error(`cold-read: ${e.message}`);
    process.exit(1);
  }
}
