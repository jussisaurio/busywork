// Tests for tools/cold-read.mjs, with a fake reader (no `claude -p`) and a fake canvas (no @napi-rs/canvas): what
// each step's reader can and cannot see, the record and its sections, verdicts, staleness, the gate's checks,
// --status, and a manual run (--bundle-only, then --record). Records go to a temp folder, never into src/levels/.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createFakeCanvas } from './lib/fake-canvas.mjs';
import {
  STAGES, parseVerdict, runStage, stageInputs, stageSteps, stageStatus, coldReadChecks, statusLines, coldReadLevels,
  readRecord, recordFile, levelDir, bundleOnly, recordManual, batchRuns, cardText, parsePremise, isFixture, PROMPTS,
} from './cold-read.mjs';
import { getLevel } from '../src/levels/index.js';
import { renderShot } from './shots.mjs';
import { captureRun } from './lib/replay.mjs';
import { createHarness } from '../src/agent/harness.js';
import { GAME_MIN_PER_SEC } from '../src/config.js';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TMP = mkdtempSync(join(tmpdir(), 'busywork-test-cold-read-'));

// A canvas whose PNG is a hash of what was drawn on it since it was made: each drawing call with the styles in force,
// a drawn canvas standing for its own hash. The same picture gives the same bytes, even when the renderer measures
// text once and caches it, or reuses a cached layer.
const QUERIES = new Set(['measureText', 'getContextAttributes', 'getImageData', 'getLineDash', 'getTransform', 'isPointInPath', 'isPointInStroke', 'createImageData']);
const BASE = ['globalAlpha', 'globalCompositeOperation', 'filter', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY'];
const LINE = ['strokeStyle', 'lineWidth', 'lineCap', 'lineJoin', 'miterLimit', 'lineDashOffset'];
const TEXT = ['font', 'textAlign', 'textBaseline', 'letterSpacing', 'direction'];
const USES = { // the styles each drawing call draws with
  fill: [...BASE, 'fillStyle'], fillRect: [...BASE, 'fillStyle'], stroke: [...BASE, ...LINE], strokeRect: [...BASE, ...LINE],
  fillText: [...BASE, 'fillStyle', ...TEXT], strokeText: [...BASE, ...LINE, ...TEXT],
  drawImage: [...BASE, 'imageSmoothingEnabled', 'imageSmoothingQuality'], clearRect: [], putImageData: [], clip: [],
};
function fakeLib() {
  const ops = new Map(); // canvas label → what was drawn
  const styles = new Map(); // canvas label → { stack, now }
  const content = (label) => createHash('sha256').update((ops.get(label) ?? []).join(';')).digest();
  const str = (a) => (a && typeof a === 'object' ? (a.label ? content(a.label).toString('hex') : 'obj') : String(a));
  const st = (label) => styles.get(label) ?? styles.set(label, { stack: [], now: {} }).get(label);
  const add = (label, s) => { if (!ops.has(label)) ops.set(label, []); ops.get(label).push(s); };
  const fake = createFakeCanvas({
    onCall: (label, m, args) => {
      const s = st(label);
      if (m === 'save') s.stack.push({ ...s.now });
      if (m === 'restore') s.now = s.stack.pop() ?? s.now;
      if (QUERIES.has(m)) return;
      add(label, `${m}(${args.map(str).join(',')})${(USES[m] ?? []).map((k) => ` ${k}=${s.now[k] ?? ''}`).join('')}`);
    },
    onSet: (label, p, v) => { st(label).now[p] = str(v); },
  });
  let n = 0;
  return {
    createCanvas(w, h) {
      const c = fake.makeCanvas(`c${n++}`, w, h);
      c.toBuffer = () => content(c.label);
      return c;
    },
  };
}
const lib = fakeLib();

// A fake reader: notes the files in its folder and its prompt, answers from `replies` (step id → text).
function fakeRunner(replies) {
  const calls = [];
  const runner = async ({ prompt, cwd, step }) => {
    const files = {};
    const walk = (d) => {
      for (const f of readdirSync(d)) {
        const p = join(d, f);
        if (statSync(p).isDirectory()) walk(p);
        else files[relative(cwd, p)] = readFileSync(p);
      }
    };
    walk(cwd);
    calls.push({ step, cwd, prompt, files, order: calls.length });
    const text = typeof replies === 'function' ? replies(step) : replies[step];
    if (text == null) throw new Error(`no canned reply for ${step}`);
    return { text, costUsd: 0.01, ms: 5 };
  };
  return { runner, calls };
}
const files = (call) => Object.keys(call.files).sort();
const text = (call, f) => call.files[f]?.toString('utf8') ?? '';
const silent = () => {};
// A level folder stand-in: a copy of meeting's premise.md, where the record is written.
function tempRoot(name) {
  const root = join(TMP, name);
  execFileSync('mkdir', ['-p', root]);
  copyFileSync(join(levelDir('meeting'), 'premise.md'), join(root, 'premise.md'));
  return root;
}
const fixed = { commit: 'abc1234', now: new Date('2026-11-15T12:00:00Z') };

// Three shots and two route checks stand in for meeting's lists, so the test draws little.
const SHOTS = [
  { name: 'start', cmds: [], intent: 'INTENT-START: the office at 2:30.' },
  { name: 'cup-at-projector', cmds: ['goto coffee_machine busy', 'interact', 'goto projector'], intent: 'INTENT-CUP: the no-coffee sticker.' },
  { name: 'end-fail', cmds: ['busy until 4:00'], intent: 'INTENT-END: the meeting happened.' },
];
const CHECKS = [
  { name: 'SECRET-CHECK-A do nothing → fail', expect: { result: 'fail' }, cmds: ['busy until 4:00'] },
  { name: 'SECRET-CHECK-B pour, sit → fail', expect: { result: 'fail' }, cmds: ['goto coffee_machine busy', 'interact', 'sit busy', 'busy until 4:00'] },
];
const meeting = getLevel('meeting');

try {
  // --- verdicts ---
  ok(parseVerdict('Verdict: works\n\nall good') === 'works', 'verdict: the first line');
  ok(parseVerdict('\n\n  **Verdict: fixable**\nx') === 'fixable', 'verdict: blank lines and bold are forgiven');
  ok(parseVerdict('# Verdict: Broken.') === 'broken', 'verdict: a heading, any case, a full stop');
  ok(parseVerdict('Verdict: works, mostly') === null, 'verdict: more words on the line are not a verdict');
  ok(parseVerdict('The verdict: works') === null, 'verdict: it must start the line');
  ok(parseVerdict("I've read the files; writing the report now.\n\nVerdict: fixable") === 'fixable', 'verdict: a line of chatter first is forgiven');
  ok(parseVerdict('a\nb\nc\nVerdict: works') === null, 'verdict: only the first three lines count');
  ok(parseVerdict('Verdict: great') === null && parseVerdict('') === null, 'verdict: only works, fixable, broken');

  // --- the card ---
  const P = parsePremise(readFileSync(join(levelDir('meeting'), 'premise.md'), 'utf8'));
  const card = cardText(meeting, P.name);
  ok(card.includes('Level name: The 4 PM Meeting') && meeting.title.mission.every((l) => card.includes(l)) && card.includes('📊'),
    'card.txt: the name (premise.md\'s heading), the two lines, the icons');
  ok(!/Ways to win|Kev|keycard|projector/i.test(card), 'card.txt holds nothing from premise.md but the name');

  // --- premise ---
  const root = tempRoot('premise');
  const R1 = '# The 4 PM Meeting: first read\nI have no slides.';
  let fr = fakeRunner({ '1-card': R1, '2-review': 'Verdict: works\n\nREVIEW-ONE' });
  let rec = await runStage('meeting', 'premise', { runner: fr.runner, root, log: silent, ...fixed });
  const [p1, p2] = fr.calls;
  ok(files(p1).join() === 'card.txt', 'premise step 1 sees card.txt and nothing else');
  ok(text(p1, 'card.txt') === card, 'premise step 1: card.txt is the card');
  ok(p1.prompt.startsWith('BUSYWORK is a top-down') && p1.prompt.includes('Read card.txt. It holds the level\'s name'),
    'premise step 1: the prompt is common.md then premise-1-card.md');
  ok(!p1.cwd.startsWith(ROOT) && !existsSync(p1.cwd), 'premise step 1: its folder is outside the repo, and removed afterwards');
  const src = files(p2).filter((f) => f.startsWith('src/'));
  ok(['card.txt', 'first-read.md', 'premise.md'].every((f) => files(p2).includes(f)) && src.includes('src/index.js') && src.includes('src/route-checks.js'),
    'premise step 2 sees the card, step 1\'s reading, premise.md and the level\'s source');
  const engine = readFileSync(join(PROMPTS, 'engine.md'), 'utf8').trim();
  ok(p2.prompt.startsWith('BUSYWORK is a top-down') && p2.prompt.includes(engine) && p2.prompt.indexOf(engine) < p2.prompt.indexOf('Read first-read.md'),
    'premise step 2: the prompt is common.md, then the engine rules, then premise-2-review.md');
  ok(!p1.prompt.includes(engine), 'premise step 1 (the card alone) does not get the engine rules');
  ok(!src.includes('src/shots.js') && files(p2).every((f) => ['card.txt', 'first-read.md', 'premise.md'].includes(f) || f.startsWith('src/')),
    'premise step 2 sees nothing else (not shots.js)');
  ok(text(p2, 'first-read.md') === R1 && p2.cwd !== p1.cwd, 'premise step 2: a new folder; first-read.md is step 1\'s reply verbatim');
  ok(rec.verdict === 'works' && rec.hash && rec.parts.card && rec.parts.premise && rec.parts.prompts, 'premise: the verdict and the inputs\' hashes are recorded');
  let md = readFileSync(recordFile(root), 'utf8');
  ok(md.includes('## premise: works') && md.includes(R1) && md.includes('REVIEW-ONE') && md.includes('abc1234') && md.includes('2026-11-15'),
    'the record holds the verdict, every step\'s reply verbatim, the commit and the date');
  ok(readRecord(root).premise?.meta.hash === rec.hash, 'the record\'s marker carries the hash');
  ok(/\| all \| \| \d+ s \(the steps add up to \d+ s\) \|/.test(md), 'the record gives the stage\'s wall clock and what its steps add up to');

  // --- staleness ---
  let s = await stageStatus('meeting', 'premise', { root });
  ok(s.ok && s.fresh && s.verdict === 'works', 'status: works and fresh right after the run');
  writeFileSync(join(root, 'premise.md'), readFileSync(join(root, 'premise.md'), 'utf8') + '\nOne more line.\n');
  s = await stageStatus('meeting', 'premise', { root });
  ok(!s.ok && s.fresh === false && s.changed.join() === 'premise.md', 'status: an edit to premise.md makes premise stale, and says so');
  writeFileSync(join(root, 'premise.md'), readFileSync(join(root, 'premise.md'), 'utf8').replace('You made none.', 'You made one.'));
  s = await stageStatus('meeting', 'premise', { root });
  ok(!s.ok && /'## Card' must hold the card's lines/.test(s.error ?? ''), 'status: a premise.md whose card is not the level\'s is an error');
  copyFileSync(join(levelDir('meeting'), 'premise.md'), join(root, 'premise.md'));
  ok((await stageStatus('meeting', 'premise', { root })).ok, 'status: fresh again when premise.md is back');
  const prompts = join(TMP, 'prompts');
  cpSync(PROMPTS, prompts, { recursive: true });
  s = await stageStatus('meeting', 'premise', { root, prompts });
  ok(s.ok && s.fresh, 'status: the same prompts in another folder keep it fresh');
  for (const f of ['engine.md', 'common.md', 'premise-2-review.md']) {
    writeFileSync(join(prompts, f), readFileSync(join(PROMPTS, f), 'utf8') + '\nOne more rule.\n');
    s = await stageStatus('meeting', 'premise', { root, prompts });
    ok(!s.ok && s.fresh === false && s.changed.join() === 'the stage\'s prompts', `status: an edit to ${f} makes premise stale, and says so`);
    copyFileSync(join(PROMPTS, f), join(prompts, f));
  }
  writeFileSync(join(prompts, 'pictures-1-read.md'), 'Another prompt.\n');
  s = await stageStatus('meeting', 'premise', { root, prompts });
  ok(s.ok && s.fresh, 'status: an edit to another stage\'s prompt leaves premise fresh');
  copyFileSync(join(PROMPTS, 'pictures-1-read.md'), join(prompts, 'pictures-1-read.md'));

  // --- section replacement ---
  fr = fakeRunner({ '1-card': 'second read', '2-review': '**Verdict: fixable**\n\nREVIEW-TWO' });
  rec = await runStage('meeting', 'premise', { runner: fr.runner, root, log: silent, ...fixed });
  md = readFileSync(recordFile(root), 'utf8');
  ok(rec.verdict === 'fixable' && md.split('<!-- cold-read:premise ').length === 2, 'a rerun replaces the stage\'s section: one premise section');
  ok(md.includes('REVIEW-TWO') && !md.includes('REVIEW-ONE') && md.includes('## premise: fixable'), 'the old replies are gone, the new ones in');
  fr = fakeRunner({ '1-card': 'x', '2-review': 'I think it is fine.' });
  rec = await runStage('meeting', 'premise', { runner: fr.runner, root, log: silent, ...fixed });
  ok(rec.verdict === 'unreadable' && !(await stageStatus('meeting', 'premise', { root })).ok, 'a report without a verdict line is recorded as unreadable, not works');
  const failing = fakeRunner({ '1-card': 'x' });
  let threw = false;
  const before = readFileSync(recordFile(root), 'utf8');
  try { await runStage('meeting', 'premise', { runner: failing.runner, root, log: silent, ...fixed }); } catch { threw = true; }
  ok(threw && readFileSync(recordFile(root), 'utf8') === before, 'a failed reader records nothing');
  ok(existsSync(failing.calls[0].cwd), 'a failed run keeps its bundle to look at');
  for (const c of failing.calls) rmSync(c.cwd, { recursive: true, force: true });

  // --- pictures ---
  fr = fakeRunner({ '1-read': 'PICTURE-READING', '2-compare': 'Verdict: works\nshots read' });
  const before2 = readFileSync(recordFile(root), 'utf8').split('<!-- cold-read:premise ')[1];
  rec = await runStage('meeting', 'pictures', { runner: fr.runner, root, lib, shots: SHOTS, log: silent, ...fixed });
  const [q1, q2] = fr.calls;
  ok(files(q1).join() === 'card.txt,shots/01.png,shots/02.png,shots/03.png', 'pictures step 1 sees the card and the shots, numbered');
  const rendered = (await stageInputs('meeting', 'pictures', { root, lib, shots: SHOTS })).shots;
  ok(rendered.every((r, i) => q1.files[`shots/0${i + 1}.png`].equals(r.png)), 'pictures step 1: the PNGs are the rendered shots');
  ok(!Object.values(q1.files).some((b) => /INTENT-|cup-at-projector|end-fail/.test(b.toString('utf8'))), 'pictures step 1 sees no intents and no shot names');
  ok(files(q2).join() === 'intents.md,reading.md,shots/01.png,shots/02.png,shots/03.png', 'pictures step 2 sees the reading, the intents and the shots');
  ok(text(q2, 'reading.md') === 'PICTURE-READING' && /01\.png \(start\): INTENT-START/.test(text(q2, 'intents.md')) && /03\.png \(end-fail\): INTENT-END/.test(text(q2, 'intents.md')),
    'pictures step 2: step 1\'s reading verbatim; the intents by number and name');
  md = readFileSync(recordFile(root), 'utf8');
  ok(md.indexOf('<!-- cold-read:premise ') < md.indexOf('<!-- cold-read:pictures ') && md.split('<!-- cold-read:premise ')[1].startsWith(before2.slice(0, 200)),
    'a new stage\'s section goes after premise, which is left as it was');
  ok((await stageStatus('meeting', 'pictures', { root, lib, shots: SHOTS })).ok, 'pictures: fresh with the same shots');
  s = await stageStatus('meeting', 'pictures', { root, lib, shots: SHOTS.map((x, i) => (i === 1 ? { ...x, intent: 'changed' } : x)) });
  ok(!s.ok && s.changed.join() === 'shots.js', 'pictures: a changed intent makes it stale (shots.js)');
  s = await stageStatus('meeting', 'pictures', { root, lib, shots: SHOTS.map((x, i) => (i === 1 ? { ...x, cmds: ['goto coffee_machine busy', 'interact', 'goto my_seat'] } : x)) });
  ok(!s.ok && s.changed.includes('the rendered shots'), 'pictures: a changed picture makes it stale (the rendered shots)');
  s = await stageStatus('meeting', 'premise', { root });
  ok(s.verdict === 'unreadable', 'pictures did not touch the premise section');

  // --- replay ---
  const inp = await stageInputs('meeting', 'replay', { root, lib, checks: CHECKS });
  ok(inp.runs.length === 2 && inp.runs.every((r) => r.frames.length >= 2 && r.frames.length <= 20 && !r.err), 'replay: one strip per route check, 2 to 20 frames');
  ok(batchRuns(inp.runs, 1).length === 2 && batchRuns(inp.runs, 1000).length === 1, 'replay: runs are batched whole');
  fr = fakeRunner((step) => (step.startsWith('1-read') ? `READING-${step}` : 'Verdict: broken\nno idea why run 2 won'));
  rec = await runStage('meeting', 'replay', { runner: fr.runner, root, lib, checks: CHECKS, batch: 1, log: silent, ...fixed });
  const reads = fr.calls.filter((c) => c.step.startsWith('1-read'));
  const cmp = fr.calls.find((c) => c.step === '2-compare');
  ok(reads.map((c) => c.step).sort().join() === '1-read-1,1-read-2' && reads.every((c) => c.order < cmp.order), 'replay: one step 1 reader per batch, all before step 2');
  const run1 = files(reads.find((c) => c.step === '1-read-1'));
  ok(run1[0] === 'card.txt' && run1.slice(1).every((f) => f.startsWith('runs/run-01/')) && run1.includes('runs/run-01/captions.md') && run1.includes('runs/run-01/01.png'),
    'replay step 1 sees the card and its own runs: captions and frames');
  const all1 = reads.flatMap((c) => Object.entries(c.files));
  ok(!all1.some(([f, b]) => /runs\.md|ways\.md/.test(f) || /SECRET-CHECK|Ways to win|fail|win/.test(f.endsWith('.md') ? b.toString('utf8') : '')),
    'replay step 1 sees no check names, no outcomes and no ways to win or lose');
  ok(/^01\.png {2}2:\d\d PM\./m.test(text(reads[0], `runs/${reads[0].step === '1-read-1' ? 'run-01' : 'run-02'}/captions.md`)), 'replay step 1: captions give the clock');
  const capB = text(reads.find((c) => c.step === '1-read-2'), 'runs/run-02/captions.md');
  ok(/You used the thing here \(you are at about x \d+, y \d+ in the picture\)/.test(capB) && /The day is over\./.test(capB),
    'replay captions: where you used something, and the day\'s end, nothing more');
  ok(files(cmp).includes('reading.md') && files(cmp).includes('runs.md') && files(cmp).includes('ways.md') && files(cmp).includes('runs/run-02/captions.md'),
    'replay step 2 sees the readings, the check names, the ways to win and lose, and the runs');
  ok(text(cmp, 'reading.md').includes('READING-1-read-1') && text(cmp, 'reading.md').includes('READING-1-read-2'), 'replay step 2: every batch\'s reading');
  ok(text(cmp, 'runs.md').includes('SECRET-CHECK-B') && /## Ways to win/.test(text(cmp, 'ways.md')) && /## Ways to lose/.test(text(cmp, 'ways.md')) && !/## The joke/.test(text(cmp, 'ways.md')),
    'replay step 2: runs.md names each check; ways.md is premise.md\'s ways to win and lose');
  ok(rec.verdict === 'broken' && Object.keys(rec.parts).join() === 'card,checks,ways,frames,prompts', 'replay: the hash covers the card, the checks, the ways, the frames and the prompts');
  s = await stageStatus('meeting', 'replay', { root, lib, checks: [CHECKS[0], { ...CHECKS[1], cmds: ['busy until 4:00'] }] });
  ok(s.changed.join(', ') === 'route-checks.js, the replay strips', 'replay: a changed check makes it stale (the checks and the strips)');

  // --- the gate's checks and --status ---
  fr = fakeRunner((step) => (step.startsWith('2') ? 'Verdict: works' : 'r'));
  const opts = { root, lib, shots: SHOTS, checks: CHECKS, log: silent, ...fixed };
  let checks = await coldReadChecks('meeting', opts);
  ok(checks.map((c) => c.name).join() === 'cold-read:premise,cold-read:pictures,cold-read:replay', 'gate checks: one per stage');
  ok(!checks[0].ok && /^unreadable/.test(checks[0].text) && checks[0].detail[0] === 'run: node tools/cold-read.mjs --level meeting --stage premise',
    'gate checks: a stage without works fails, with the command to run');
  ok(/^broken \(2026-11-15, abc1234\): fix the problems/.test(checks[2].text), 'gate checks: a broken stage says to fix and rerun');
  for (const st of ['premise', 'replay']) await runStage('meeting', st, { runner: fr.runner, ...opts });
  checks = await coldReadChecks('meeting', opts);
  ok(checks.every((c) => c.ok) && checks.every((c) => /^works \(2026-11-15, abc1234\), fresh$/.test(c.text)), 'gate checks: all ok when every stage works and is fresh');
  checks = await coldReadChecks('meeting', { ...opts, shots: SHOTS.slice(0, 2) });
  ok(!checks[1].ok && /works .*, but stale: shots\.js, the rendered shots changed since/.test(checks[1].text), 'gate checks: stale says what changed');
  const other = tempRoot('other');
  checks = await coldReadChecks('meeting', { ...opts, root: other });
  ok(checks.every((c) => !c.ok && c.text === 'no cold read yet'), 'gate checks: missing stages say so');
  rmSync(join(other, 'premise.md'));
  checks = await coldReadChecks('meeting', { ...opts, root: other });
  ok(checks.every((c) => !c.ok && /can't run: no .*premise\.md/.test(c.text)), 'gate checks: no premise.md says it can\'t run');
  const lines = await statusLines(['meeting'], opts);
  ok(lines.join('\n') === ['meeting', ...STAGES.map((st) => `  ok    ${st.padEnd(9)}works (2026-11-15, abc1234), fresh`)].join('\n'), 'status: a line per stage');
  const ids = coldReadLevels();
  ok(ids.includes('meeting') && ids.includes('weekend-shift') && !ids.some(isFixture) && ids.length >= 8, 'status covers every level but the fixtures');
  const cli = execFileSync('node', [join(ROOT, 'tools/cold-read.mjs'), '--status'], { encoding: 'utf8', env: { ...process.env, BUSYWORK_CANVAS_DIR: join(TMP, 'no-canvas') } });
  ok(ids.every((id) => cli.includes(`${id}\n`)) && !cli.includes('fixture') && cli.trim().split('\n').length === ids.length * 4, '--status prints every non-fixture level and its three stages');

  // --- a manual run: --bundle-only, then --record ---
  const man = tempRoot('manual');
  const pointer = join(TMP, 'pointer.json');
  const made = new Set(); // the manual runs' folders, to remove
  const bundle = async () => {
    const r = await bundleOnly('meeting', 'premise', { root: man, pointer, ...fixed });
    [r.work, ...r.steps.map((x) => x.dir)].filter(Boolean).forEach((d) => made.add(d));
    return r;
  };
  let m = await bundle();
  ok(m.steps.map((x) => x.state).join() === 'ready,waiting', 'bundle-only: step 1 ready, step 2 waits');
  ok(readdirSync(m.steps[0].dir).join() === 'card.txt' && readFileSync(m.steps[0].prompt, 'utf8').includes('Read card.txt'), 'bundle-only: step 1\'s folder and prompt');
  ok(!m.steps[0].prompt.startsWith(m.steps[0].dir) && !m.steps[0].replyFile.startsWith(m.steps[0].dir), 'bundle-only: the prompt and reply live outside the reader\'s folder');
  writeFileSync(m.steps[0].replyFile, 'MANUAL-FIRST-READ');
  const work = m.work;
  m = await bundle();
  ok(m.work === work && m.steps.map((x) => x.state).join() === 'replied,ready', 'bundle-only again: the same run; step 2 is ready');
  ok(readFileSync(join(m.steps[1].dir, 'first-read.md'), 'utf8') === 'MANUAL-FIRST-READ' && existsSync(join(m.steps[1].dir, 'src/index.js')), 'bundle-only: step 2\'s folder holds step 1\'s reply');
  const report = join(TMP, 'report.md');
  writeFileSync(report, 'Verdict: works\nMANUAL-REPORT');
  rec = recordManual('meeting', 'premise', report, { root: man, pointer, model: 'some-model', ...fixed });
  md = readFileSync(recordFile(man), 'utf8');
  ok(rec.verdict === 'works' && md.includes('MANUAL-FIRST-READ') && md.includes('MANUAL-REPORT') && md.includes('a manual run') && md.includes('some-model'),
    'record: a manual run\'s replies, verdict and model go in the record');
  ok((await stageStatus('meeting', 'premise', { root: man })).ok, 'record: a manual run is fresh like any other');
  writeFileSync(join(man, 'premise.md'), readFileSync(join(man, 'premise.md'), 'utf8') + '\nchanged\n');
  m = await bundle();
  ok(m.work !== work && m.steps[0].state === 'ready', 'bundle-only: changed inputs start a new run');
  for (const d of made) rmSync(d, { recursive: true, force: true });

  // --- the steps never leak across stages ---
  const steps = stageSteps(await stageInputs('meeting', 'premise', { root }));
  ok(steps.map((x) => x.id).join() === '1-card,2-review' && steps[0].needs.length === 0 && steps[1].needs.join() === '1-card', 'premise: two steps, the second needs the first');
  ok(!existsSync(recordFile(levelDir('meeting'))) || readFileSync(recordFile(levelDir('meeting')), 'utf8').indexOf('REVIEW-') < 0, 'the test wrote nothing to src/levels/meeting/');

  // --- the pictures show bubbles as a player at normal speed sees them ---
  // A canvas whose "PNG" lists the text drawn since the last picture (emoji are text), so a test can see which bubbles
  // a frame shows. Kev waves goodbye (🎒👋, a 2.5 s bubble) at 2:58.
  const textLib = () => {
    let drawn = [];
    const fake = createFakeCanvas({ onCall: (label, m, args) => { if (m === 'fillText') drawn.push(String(args[0])); } });
    let n = 0;
    return {
      createCanvas(w, h) {
        const c = fake.makeCanvas(`t${n++}`, w, h);
        c.toBuffer = () => { const b = Buffer.from(JSON.stringify(drawn)); drawn = []; return b; };
        return c;
      },
    };
  };
  const shows = (png, ch) => JSON.parse(png.toString('utf8')).includes(ch);
  const wave = (cmds) => {
    const h = createHarness({ level: meeting });
    h.begin();
    for (const c of cmds) h.run(c);
    return h.game.fx.bubbles.find((b) => b.icons.includes('👋'));
  };
  const JUST = ['busy until 2:58', 'busy 0.1s']; // 0.6 game seconds after the wave (pretending runs at x6)
  const LATER = ['busy until 2:58', 'busy 0.6s']; // 3.6 game seconds after: more than its 2.5 s
  ok(shows(renderShot(meeting, { name: 'just', cmds: JUST }, textLib()).png, '👋'), 'shots: a bubble that just came up is in the picture');
  const later = wave(LATER);
  ok(later && later.age < later.ttl, 'shots: pretending, the game itself still holds a bubble from more than its life ago (life counted in real seconds)');
  ok(!shows(renderShot(meeting, { name: 'later', cmds: LATER }, textLib()).png, '👋'), 'shots: ... but the picture leaves it out, as a player at normal speed would no longer see it');
  ok(wave(LATER)?.age === later.age, 'shots: drawing the picture changes nothing in the game');
  // A replay strip: take Lin's sandwich, then pretend at your desk until 3:10. Kev waves at 2:58; at 3:03, still
  // pretending, Lin finds her sandwich gone (🥪❓), a few real seconds after the wave: the wave must not be in that frame.
  const minute = (cap) => { const m = /^(\d+):(\d+)/.exec(cap); return (Number(m[1]) % 12 + 12) * 60 + Number(m[2]); };
  const SANDWICH = ['goto fridge busy', 'interact', 'goto my_seat busy', 'sit busy', 'busy until 3:10'];
  const run = captureRun(meeting, { name: 'wave', expect: { result: 'fail' }, cmds: SANDWICH }, { lib: textLib() });
  const waving = run.frames.filter((f) => shows(f.png, '👋'));
  const gone = 14 * 60 + 58 + Math.ceil(2.5 * GAME_MIN_PER_SEC); // 2:58 plus the bubble's life, rounded up to a minute
  ok(waving.length > 0 && waving.every((f) => minute(f.caption) < gone), 'replay: the wave shows when it comes up, and never in a frame after its life is over');
  const lunch = run.frames.find((f) => shows(f.png, '❓') && shows(f.png, '🥪') && minute(f.caption) >= gone);
  ok(lunch && !shows(lunch.png, '👋'), 'replay: Lin\'s 🥪❓ frame, pretending a few real seconds after the wave, leaves the wave out');

  // --- two of the player's actions never share a frame ---
  // Take the keycard and drop it at once (route check 14): each action gets its own frame, the card in hand between.
  const meetingChecks = (await import('../src/levels/meeting/route-checks.js')).default;
  const drop = meetingChecks.find((c) => c.name.startsWith('steal keycard, drop it'));
  const dropRun = captureRun(meeting, drop, { lib: textLib() });
  const used = dropRun.frames.filter((f) => /You used the thing here/.test(f.caption));
  ok(used.length >= 3 && used.every((f) => (f.caption.match(/You used the thing here/g) ?? []).length === 1),
    'replay: taking the keycard and dropping it at once make two frames, one action each');
} catch (e) {
  fails++;
  console.log('FAIL', e.stack);
} finally {
  rmSync(TMP, { recursive: true, force: true });
}

console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
