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
  STAGES, PASSES, SECTIONS, passList, passVerdict, parseItems, parseVerdict, parseProblems, parseLedger, earlierFrom, GRADES, runStage, stageInputs, stageSteps, stageStatus, coldReadChecks, statusLines, coldReadLevels,
  readRecord, recordFile, levelDir, bundleOnly, recordManual, batchRuns, cardText, parsePremise, isFixture, PROMPTS,
} from './cold-read.mjs';
import { getLevel } from '../src/levels/index.js';
import { renderShot, renderShots, sameShots, sameShotsText, shotWhen, shotsProblems } from './shots.mjs';
import { captureRun, OUTCOME_FRAMES } from './lib/replay.mjs';
import { spawnSync } from 'node:child_process';
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
// A level folder stand-in: a copy of meeting's premise.md, where the record is written. prose: add the sections the
// motives and props passes read (meeting's premise.md has neither yet).
const WHO = '## Who does what\n\nWHO-PROSE: the boss reads his paper until 3:55, then walks to the meeting room.\n';
const THINGS = '## Things in the office\n\nTHINGS-PROSE: a coffee machine, because people drink coffee. You can pour a cup.\n';
function tempRoot(name, prose = false) {
  const root = join(TMP, name);
  execFileSync('mkdir', ['-p', root]);
  // The level's premise.md without its prose sections, whatever the live file has: the test makes its own state.
  const bare = readFileSync(join(levelDir('meeting'), 'premise.md'), 'utf8')
    .replace(/^## (Who does what|Things in the office)\n[\s\S]*?(?=^## |(?![\s\S]))/gm, '').trimEnd();
  writeFileSync(join(root, 'premise.md'), prose ? `${bare}\n\n${WHO}\n${THINGS}` : `${bare}\n`);
  return root;
}
// A reply that passes every pass: a works verdict, and one good item line in each narrow pass's words.
// Every pass's last prompt grades its problems, with no quota and no private works/fixable rule of its own.
{
  const files = readdirSync(PROMPTS);
  const last = PASSES.map((p) => files.find((f) => f === `${p.id}.md`) ?? files.filter((f) => f.startsWith(`${p.id}-`)).sort().at(-1));
  ok(last.every(Boolean), 'grades: every pass has its prompts');
  const bad = last.filter((f) => {
    const t = readFileSync(join(PROMPTS, f), 'utf8');
    return !/graded as below/.test(t) || /`(works|fixable)`:/.test(t) || /up to \d/i.test(t);
  });
  ok(!bad.length, `grades: every pass's last prompt lists its problems graded, no quota, no works/fixable of its own${bad.length ? ` (${bad.join(', ')})` : ''}`);
}
const GOOD = PASSES.filter((p) => p.answers).map((p) => `- item ${p.id}: ${p.answers.good[0]} — fine`).join('\n');
const worksReply = (step) => (/^(2|1-judge)/.test(step) ? `Verdict: works\n\n${GOOD}\n\n## Problems\n- none` : 'r');
const has = (pass) => STAGES.includes(pass);
const preamble = (f) => readFileSync(join(PROMPTS, f), 'utf8').trim();
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
  let fr = fakeRunner({ '1-card': R1, '2-review': 'Verdict: works\n\nREVIEW-ONE\n\n## Problems\n- nit: a typo in the card — fix it' });
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
  ok(p2.prompt.trimEnd().endsWith(preamble('grades.md')) && !p1.prompt.includes('## Grading'), 'premise: the last step\'s prompt ends with grades.md; step 1 is not graded');
  ok(!/up to 5|Up to 5/.test(p2.prompt) && /no quota/i.test(p2.prompt), 'premise: no problem quota');
  ok(md.includes('Problems: 0 blocker, 0 should, 1 nit.') && md.includes('### Open problems\nThe blockers and shoulds') && /### Open problems\n[^\n]*\n\n- none\n/.test(md),
    'the record: the graded tally; a nit is not carried to the next run');
  ok(/\| all \| \| \d+ s \(the steps add up to \d+ s\) \|/.test(md), 'the record gives the stage\'s wall clock and what its steps add up to');

  // --- staleness ---
  let s = await stageStatus('meeting', 'premise', { root });
  ok(s.ok && s.fresh && s.verdict === 'works', 'status: works and fresh right after the run');
  const premise0 = readFileSync(join(root, 'premise.md'), 'utf8'); // as the run read it
  writeFileSync(join(root, 'premise.md'), readFileSync(join(root, 'premise.md'), 'utf8') + '\nOne more line.\n');
  s = await stageStatus('meeting', 'premise', { root });
  ok(!s.ok && s.fresh === false && s.changed.join() === 'premise.md', 'status: an edit to premise.md makes premise stale, and says so');
  writeFileSync(join(root, 'premise.md'), premise0.replace('You made none.', 'You made one.'));
  s = await stageStatus('meeting', 'premise', { root });
  ok(s.ok && s.fresh, 'status: an old card copy in premise.md is filled from the level (the readers see the game\'s card), so it changes nothing');
  writeFileSync(join(root, 'premise.md'), premise0);
  ok((await stageStatus('meeting', 'premise', { root })).ok, 'status: fresh again when premise.md is back');
  const prompts = join(TMP, 'prompts');
  cpSync(PROMPTS, prompts, { recursive: true });
  s = await stageStatus('meeting', 'premise', { root, prompts });
  ok(s.ok && s.fresh, 'status: the same prompts in another folder keep it fresh');
  for (const f of ['engine.md', 'common.md', 'premise-2-review.md']) {
    writeFileSync(join(prompts, f), readFileSync(join(PROMPTS, f), 'utf8') + '\nOne more rule.\n');
    s = await stageStatus('meeting', 'premise', { root, prompts });
    ok(!s.ok && s.fresh === false && s.changed.join() === 'the pass\'s prompts', `status: an edit to ${f} makes premise stale, and says so`);
    copyFileSync(join(PROMPTS, f), join(prompts, f));
  }
  writeFileSync(join(prompts, 'pictures-1-read.md'), 'Another prompt.\n');
  s = await stageStatus('meeting', 'premise', { root, prompts });
  ok(s.ok && s.fresh, 'status: an edit to another stage\'s prompt leaves premise fresh');
  copyFileSync(join(PROMPTS, 'pictures-1-read.md'), join(prompts, 'pictures-1-read.md'));

  // --- section replacement ---
  fr = fakeRunner({ '1-card': 'second read', '2-review': '**Verdict: fixable**\n\nREVIEW-TWO\n\n## Problems\n- blocker: B-ONE, the boss reads his own clock\n  wrongly — fix it\n- should: S-ONE — fix it\n- nit: N-ONE — fix it' });
  rec = await runStage('meeting', 'premise', { runner: fr.runner, root, log: silent, ...fixed });
  md = readFileSync(recordFile(root), 'utf8');
  ok(rec.verdict === 'fixable' && md.split('<!-- cold-read:premise ').length === 2, 'a rerun replaces the stage\'s section: one premise section');
  ok(md.includes('REVIEW-TWO') && !md.includes('REVIEW-ONE') && md.includes('## premise: fixable'), 'the old replies are gone, the new ones in');
  ok(!files(fr.calls[1]).includes('earlier.md'), 'ledger: a run after a record with nothing open gets no earlier.md');
  ok(md.includes('- E1 [blocker] B-ONE, the boss reads his own clock wrongly — fix it\n- E2 [should] S-ONE — fix it\n\n') && !/E\d \[nit\]/.test(md),
    'the record: the open problems, numbered, a wrapped line joined; nits are not carried');

  // --- the ledger: the next run marks the earlier problems; one still there is carried at the grade the reader gives it ---
  fr = fakeRunner({ '1-card': 'third read', '2-review': 'Verdict: works\n\n## Earlier problems\n- E1: fixed — the boss looks now\n- **E2**: still there (blocker) — worse now\n\n## Problems\n- should: S-NEW — fix it' });
  rec = await runStage('meeting', 'premise', { runner: fr.runner, root, log: silent, ...fixed });
  const [l1, l2] = fr.calls;
  ok(!files(l1).includes('earlier.md') && files(l2).includes('earlier.md') && /- E1 \[blocker\] B-ONE[^\n]*\n- E2 \[should\] S-ONE/.test(text(l2, 'earlier.md')),
    'ledger: the last step (only) gets the earlier record\'s open problems as earlier.md');
  ok(rec.verdict === 'fixable' && /the reader said works, but 1 earlier blocker\(s\) still there/.test(rec.note) && rec.problems.blocker === 1 && rec.problems.should === 1,
    `ledger: a should the reader re-grades as a blocker is one, and the verdict follows (${rec.note})`);
  md = readFileSync(recordFile(root), 'utf8');
  ok(md.includes('Earlier problems: 1 fixed, 1 still there, 0 no longer applies.') && md.includes('### Ledger') && md.includes('- E1 fixed: B-ONE')
    && md.includes('- E1 [blocker] S-ONE — fix it (recurring: premise-level?)\n- E2 [should] S-NEW — fix it'), 'ledger: recorded, and the recurring problem is tagged and carried first');
  ok((await stageStatus('meeting', 'premise', { root })).fresh, 'ledger: not an input; the pass stays fresh across rounds');
  {
    // A second read of unchanged inputs is skipped (skipFresh, the CLI default): it is not a new round, and its ledger
    // would promote every open should to a blocker.
    const n = fr.calls.length;
    const again = await runStage('meeting', 'premise', { runner: fr.runner, root, log: silent, skipFresh: true, ...fixed });
    ok(again.skipped && fr.calls.length === n && again.verdict === rec.verdict, 'skipFresh: unchanged inputs are not read again, and the record is kept');
  }
  fr = fakeRunner({ '1-card': 'fourth read', '2-review': 'Verdict: works\n\n## Earlier problems\n- E1: still there — same\n\n## Problems\n- none' });
  rec = await runStage('meeting', 'premise', { runner: fr.runner, root, log: silent, ...fixed });
  ok(rec.verdict === 'fixable' && rec.ledger.find((e) => e.id === 'E2').mark === 'still there' && /not marked/.test(rec.ledger.find((e) => e.id === 'E2').why)
    && rec.open.filter((p) => /recurring: premise-level\?\)$/.test(p.text)).length === 2 && !rec.open.some((p) => /\(recurring.*\(recurring/.test(p.text)),
    'ledger: an earlier problem the reader did not mark counts as still there; the tag is not doubled');
  ok(rec.problems.blocker === 1 && rec.problems.should === 1, 'ledger: a still-there problem with no new grade keeps its earlier one (a should stays a should)');
  fr = fakeRunner({ '1-card': 'fifth read', '2-review': 'Verdict: fixable\n\n## Earlier problems\n- E1: fixed — ok\n- E2: no longer applies — the boss is gone\n\n## Problems\n- nit: N — n' });
  rec = await runStage('meeting', 'premise', { runner: fr.runner, root, log: silent, ...fixed });
  ok(rec.verdict === 'works' && /said fixable, but listed no blocker/.test(rec.note), 'grades: no blocker is works, whatever the reader said (the verdict counts blockers only)');
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
  fr = fakeRunner({ '1-read': 'PICTURE-READING', '2-compare': 'Verdict: works\nshots read\n\n## Problems\n- should: shot 2 is dim — brighten it' });
  const before2 = readFileSync(recordFile(root), 'utf8').split('<!-- cold-read:premise ')[1];
  rec = await runStage('meeting', 'pictures', { runner: fr.runner, root, lib, shots: SHOTS, log: silent, ...fixed });
  const [q1, q2] = fr.calls;
  ok(files(q1).join() === 'card.txt,shots/01.png,shots/02.png,shots/03.png', 'pictures step 1 sees the card and the shots, numbered (the verb sheets are the verbs pass\'s)');
  const pinp = await stageInputs('meeting', 'pictures', { root, lib, shots: SHOTS });
  const rendered = pinp.shots;
  ok(rendered.every((r, i) => q1.files[`shots/0${i + 1}.png`].equals(r.png)), 'pictures step 1: the PNGs are the rendered shots');
  ok(!Object.values(q1.files).some((b) => /INTENT-|cup-at-projector|end-fail/.test(b.toString('utf8'))), 'pictures step 1 sees no intents and no shot names');
  ok(files(q2).join() === 'intents.md,reading.md,shots/01.png,shots/02.png,shots/03.png', 'pictures step 2 sees the reading, the intents and the shots');
  ok(Object.keys(pinp.parts).join() === 'card,shots,pictures,prompts' && !/verb/i.test(q1.prompt + q2.prompt), 'pictures: no verb sheets in its hash or its prompts');
  ok(text(q2, 'reading.md') === 'PICTURE-READING' && /01\.png \(start, landed 2:30 PM\): INTENT-START/.test(text(q2, 'intents.md'))
    && /03\.png \(end-fail, landed 4:00 PM, then the end card\): INTENT-END/.test(text(q2, 'intents.md')),
    'pictures step 2: step 1\'s reading verbatim; the intents by number and name, each with the clock its shot landed on');
  ok(!Object.values(q1.files).some((b) => /landed \d/.test(b.toString('utf8'))), 'pictures step 1 sees no landed clocks either');
  md = readFileSync(recordFile(root), 'utf8');
  ok(md.indexOf('<!-- cold-read:premise ') < md.indexOf('<!-- cold-read:pictures ') && md.split('<!-- cold-read:premise ')[1].startsWith(before2.slice(0, 200)),
    'a new pass\'s section goes after premise, which is left as it was');
  ok((await stageStatus('meeting', 'pictures', { root, lib, shots: SHOTS })).ok, 'pictures: fresh with the same shots');
  s = await stageStatus('meeting', 'pictures', { root, lib, shots: SHOTS.map((x, i) => (i === 1 ? { ...x, intent: 'changed' } : x)) });
  ok(!s.ok && s.changed.join() === 'shots.js', 'pictures: a changed intent makes it stale (shots.js)');
  s = await stageStatus('meeting', 'pictures', { root, lib, shots: SHOTS.map((x, i) => (i === 1 ? { ...x, cmds: ['goto coffee_machine busy', 'interact', 'goto my_seat'] } : x)) });
  ok(!s.ok && s.changed.includes('the rendered shots'), 'pictures: a changed picture makes it stale (the rendered shots)');
  s = await stageStatus('meeting', 'premise', { root });
  ok(s.verdict === 'unreadable', 'pictures did not touch the premise section');
  ok(rec.verdict === 'works' && q2.prompt.trimEnd().endsWith(preamble('grades.md')), 'pictures: a should alone is works; the last step is graded');

  // --- verbs: the verb sheets alone ---
  fr = fakeRunner({ '1-read': 'VERB-READING', '2-judge': 'Verdict: works\n- coffee / pour: fits — a cup fills\n\n## Problems\n- none' });
  const vroot = tempRoot('verbs');
  rec = await runStage('meeting', 'verbs', { runner: fr.runner, root: vroot, lib, log: silent, ...fixed });
  const [v1, v2] = fr.calls;
  const vinp = await stageInputs('meeting', 'verbs', { root: vroot, lib });
  const VERBS = 'verbs/01.png,verbs/02.png,verbs/03.png,verbs/04.png'; // meeting's items: coffee, keycard, mug, sandwich
  ok(files(v1).join() === VERBS && vinp.verbs.every((v, i) => v1.files[`verbs/0${i + 1}.png`].equals(v.png) && !v.png.equals(v.labelled)),
    'verbs step 1 sees the verb sheets alone, with panel numbers only (no card, no shots)');
  ok(v1.prompt.startsWith(preamble('focus.md')) && !v1.prompt.includes(preamble('common.md')), 'verbs: the narrow preamble (focus.md), not common.md');
  ok(files(v2).join() === `intents.md,reading.md,${VERBS}` && vinp.verbs.every((v, i) => v2.files[`verbs/0${i + 1}.png`].equals(v.labelled)) && text(v2, 'reading.md') === 'VERB-READING',
    'verbs step 2 sees the reading, the intents and the labelled sheets');
  ok(/### verbs\/04\.png: the sandwich/.test(text(v2, 'intents.md')) && /eat_sandwich done\. It changed: [^\n]*player\.smeared: false → splat/.test(text(v2, 'intents.md')),
    'verbs step 2: the intents hold each sheet, with the engine\'s account of each panel');
  ok(rec.verdict === 'works' && Object.keys(rec.parts).join() === 'card,verbs,prompts' && rec.tally.fits === 1, 'verbs: the verdict, its hash parts and its tally');
  const vText = readFileSync(recordFile(vroot), 'utf8');
  // A record made from other verb sheets: their part, and so the whole hash, differ.
  writeFileSync(recordFile(vroot), vText.replace(`"verbs":"${vinp.parts.verbs}"`, `"verbs":"${'0'.repeat(64)}"`).replace(`"hash":"${vinp.hash}"`, `"hash":"${'1'.repeat(64)}"`));
  s = await stageStatus('meeting', 'verbs', { root: vroot, lib });
  ok(!s.ok && s.changed.join() === 'the verb sheets', 'verbs: a changed verb sheet makes it stale (the verb sheets)');

  // --- sense: the routes as prose, judged as a real office ---
  // The past failure it must catch: Layoffs' hoodie route (main at 8937f71). A fresh reader given the real bundle
  // answered this (abridged); the record must keep the nonsense.
  const HOODIE = ['Verdict: fixable', '',
    '- Why changing the list saves you (win): sensible — the list goes to HR at 3:45, so editing it first is the obvious fix.',
    '- Route 1, hoodie as Kev (win): **nonsense** — the boss would know Kev left, and a coworker in Kev\'s hoodie is not Kev.',
    '- Route 2, jacket as the boss (win): stretch — it works only if Lin is a bad lookout.',
    '- Lose, caught in the jacket (lose): sensible — the boss recognizes his own jacket.',
    '- Lose, blamed as Kev (lose): stretch — only works if he never looks at your face.', '',
    '## Problems', '- blocker: the hoodie route: the boss knows Kev went home — make the disguise a role, not an identity',
    '- should: Lin is a bad lookout in route 2 — give her a reason to look away'].join('\n');
  const sroot = tempRoot('sense');
  fr = fakeRunner({ '1-judge': HOODIE });
  rec = await runStage('meeting', 'sense', { runner: fr.runner, root: sroot, log: silent, ...fixed });
  const [t1] = fr.calls;
  ok(fr.calls.length === 1 && files(t1).join() === 'card.txt,ways.md', 'sense sees the card and the ways to win and lose: no source, no engine rules, no pictures, no DESIGN.md');
  ok(text(t1, 'card.txt') === card && text(t1, 'ways.md') === `${P.sections['Ways to win']}\n\n${P.sections['Ways to lose']}\n`,
    'sense: card.txt is the card; ways.md is premise.md\'s two sections, as prose');
  ok(!/## (The joke|Cast|The situation|Card)\b/.test(text(t1, 'ways.md')) && !Object.values(t1.files).some((b) => /\bimport |\bexport |=>|function\s*\(|route-checks|\.js\b/.test(b.toString('utf8'))),
    'sense: no other section and no code');
  ok(t1.prompt.startsWith(preamble('text.md')) && t1.prompt.includes(preamble('sense.md')) && !t1.prompt.includes(preamble('common.md')) && !t1.prompt.includes(engine),
    'sense: the prompt is text.md then sense.md; not common.md (its game rules would make an implementer of the reader), not the engine');
  ok(/half-awake boss/.test(t1.prompt) && /sensible\|stretch\|nonsense/.test(t1.prompt) && /Ignore everything outside it/.test(t1.prompt), 'sense: the question, the answers, and the focus');
  ok(rec.verdict === 'fixable' && Object.keys(rec.parts).join() === 'card,ways,prompts' && rec.tally.nonsense === 1 && rec.tally.stretch === 2 && rec.tally.sensible === 2,
    `sense: the hoodie report is recorded fixable, with its tally (${JSON.stringify(rec.tally)})`);
  md = readFileSync(recordFile(sroot), 'utf8');
  ok(md.includes('## sense: fixable') && md.includes('Items: 2 sensible, 2 stretch, 1 nonsense.') && md.includes('Problems: 1 blocker, 1 should, 0 nit.') && md.includes('hoodie as Kev'),
    'sense: the record\'s section, its tally lines and the report verbatim');
  ok(t1.prompt.trimEnd().endsWith(preamble('grades.md')) && /A nonsense route is a blocker/.test(t1.prompt), 'sense: graded like every pass; a nonsense route is a blocker');
  ok((await stageStatus('meeting', 'sense', { root: sroot })).fresh, 'sense: fresh right after');
  writeFileSync(join(sroot, 'premise.md'), readFileSync(join(sroot, 'premise.md'), 'utf8').replace('## The joke', '## The joke\n\nOne more joke line.'));
  ok((await stageStatus('meeting', 'sense', { root: sroot })).fresh, 'sense: an edit outside the ways to win and lose leaves it fresh');
  writeFileSync(join(sroot, 'premise.md'), readFileSync(join(sroot, 'premise.md'), 'utf8').replace('## Ways to lose', '## Ways to lose\n\nOne more way.'));
  s = await stageStatus('meeting', 'sense', { root: sroot });
  ok(s.fresh === false && s.changed.join() === 'premise.md\'s ways to win and lose', 'sense: an edit to the ways makes it stale, and says so');
  // The rule: blockers decide; a nonsense route is a blocker even when the reader lists none; no item lines is unreadable.
  const sp = PASSES.find((x) => x.id === 'sense');
  const unlisted = HOODIE.replace('Verdict: fixable', 'Verdict: works').replace(/## Problems[\s\S]*$/, '## Problems\n- none');
  let pv = passVerdict(sp, unlisted);
  ok(pv.verdict === 'fixable' && /"Route 1, hoodie as Kev \(win\)" nonsense: a nonsense item is a blocker/.test(pv.note) && pv.open.length === 1 && /hoodie/.test(pv.open[0].text),
    'rule: works with a nonsense route and no blocker listed is recorded fixable, and the route joins the open problems');
  pv = passVerdict(sp, HOODIE.replace('Verdict: fixable', 'Verdict: works'));
  ok(pv.verdict === 'fixable' && /listed 1 blocker/.test(pv.note) && pv.open.length === 2, 'rule: works with a listed blocker is fixable; the nonsense item is not listed twice');
  ok(passVerdict(sp, `Verdict: works\n- A (win): sensible — ok\n- B (lose): stretch — a bit${'\n\n## Problems\n- should: B is a stretch — tighten it'}`).verdict === 'works', 'rule: works with only stretches and shoulds stands');
  pv = passVerdict(sp, 'Verdict: works\n- A (win): sensible — ok');
  ok(pv.verdict === 'unreadable' && /no '## Problems' section/.test(pv.note), 'rule: a report without its problems section is unreadable');
  ok(passVerdict(sp, 'Verdict: broken\n- A (win): nonsense — all of it').verdict === 'broken', 'rule: broken stands');
  ok(parseProblems('x\n### Problems\n- **Blocker**: one — a\n* nit - two\n- big: no\n## Next\n- should: three').map((q) => `${q.grade}:${q.text}`).join('|') === 'blocker:one — a|nit:two',
    'problems: graded lines under the heading only; bold and case forgiven; an ungraded line is not one');
  ok(parseProblems('Verdict: works') === null && parseProblems('## Problems\n- none').length === 0, 'problems: no section is null; "- none" is an empty list');
  ok(JSON.stringify(parseLedger('## Earlier problems\n- E3: No longer applies. gone\n- E1 — still there — same')) === '{"E3":{"mark":"no longer applies","why":"gone"},"E1":{"mark":"still there","why":"same"}}',
    'ledger: marks parsed by number');
  const old = earlierFrom({ text: '<!-- cold-read:premise {} -->\n## premise: fixable\n### 1-card: first-read.md\n\nA\n### 2-review: report.md\n\nOLD-REPORT 1. the clock\n<!-- /cold-read:premise -->\n' });
  ok(old?.raw === 'OLD-REPORT 1. the clock' && !old.items.length, 'ledger: a record from before the grades gives its last report, to number');
  pv = passVerdict(PASSES.find((x) => x.id === 'premise'), 'Verdict: works\n## Earlier problems\n- E1: still there — the clock is unreadable\n- E2: fixed — ok\n## Problems\n- none', old);
  ok(pv.verdict === 'fixable' && pv.ledger.length === 2 && /the clock is unreadable \(recurring/.test(pv.open[0].text), 'ledger: from an old report, the reader\'s numbers and words make the ledger');
  pv = passVerdict(sp, 'Verdict: works\nEverything is fine.');
  ok(pv.verdict === 'unreadable' && /no item lines/.test(pv.note), 'rule: a report without item lines is unreadable');
  ok(passVerdict(sp, 'no verdict\n- A: sensible — ok').verdict === 'unreadable', 'rule: no verdict line is unreadable');
  ok(parseItems('- Route 1: **Nonsense.** — why\n- x: sensibly odd', sp.answers).map((i) => `${i.item}=${i.answer}`).join() === 'Route 1=nonsense',
    'items: bold and case are forgiven; a word that only starts with an answer is not one');
  ok(passVerdict(PASSES.find((x) => x.id === 'premise'), 'Verdict: fixable\n## Problems\n- should: x — y').verdict === 'works', 'rule: a broad pass is graded too: shoulds alone are works');

  // --- the other narrow passes: what each reader sees, and the past failure each must keep ---
  if (has('title')) {
    // Early Bus before its fix (1909728): "make someone early" was the way out, and the name said "Early".
    const proot = tempRoot('narrow', true);
    fr = fakeRunner({ '1-guess': 'GUESSES: 1. make someone early ("Early Bus")', '2-judge': 'Verdict: works\n- 1. make someone early: leak — the name says "Early"\n\n## Problems\n- none' });
    rec = await runStage('meeting', 'title', { runner: fr.runner, root: proot, log: silent, ...fixed });
    const [g1, g2] = fr.calls;
    ok(files(g1).join() === 'card.txt' && files(g2).join() === 'card.txt,guesses.md,ways.md' && text(g2, 'guesses.md').startsWith('GUESSES'),
      'title: step 1 guesses from the card alone; step 2 judges the guesses against the ways');
    ok(g1.prompt.startsWith(preamble('text.md')) && !/Ways to win/.test(g1.prompt + text(g1, 'card.txt')), 'title step 1 never sees the ways');
    ok(rec.verdict === 'fixable' && rec.tally.leak === 1 && Object.keys(rec.parts).join() === 'card,ways,prompts', 'title: a leak is recorded at best fixable, even when the reader says works');

    // motives, props, joke: one step each, the card and their own prose.
    const seen = {};
    for (const [pass, file, word, want = 'fixable'] of [['motives', 'who.md', 'contradicts'], ['props', 'things.md', 'pointless'], ['joke', 'ways.md', 'chore', 'works']]) {
      fr = fakeRunner({ '1-judge': `Verdict: works\n- the thing: ${word} — a past failure\n\n## Problems\n- none` });
      rec = await runStage('meeting', pass, { runner: fr.runner, root: proot, log: silent, ...fixed });
      const c = fr.calls[0];
      seen[pass] = c;
      ok(fr.calls.length === 1 && files(c).join() === ['card.txt', file].sort().join() && c.prompt.startsWith(preamble('text.md')) && c.prompt.includes(preamble(`${pass}.md`)),
        `${pass}: the card and ${file} only, with text.md then ${pass}.md`);
      ok(rec.verdict === want && rec.tally[word] === 1, want === 'works' ? `${pass}: a ${word} item alone is a should, not a blocker (works)` : `${pass}: a ${word} item makes it at best fixable`);
    }
    ok(/WHO-PROSE/.test(text(seen.motives, 'who.md')) && !/THINGS-PROSE|Ways to win/.test(text(seen.motives, 'who.md')), 'motives: who.md is the "Who does what" prose alone');
    ok(/THINGS-PROSE/.test(text(seen.props, 'things.md')) && !/WHO-PROSE/.test(text(seen.props, 'things.md')), 'props: things.md is the "Things in the office" prose alone');
    ok(/binds\|only-you/.test(seen.motives.prompt) && /walks under it without looking/.test(seen.motives.prompt), 'motives: asks whether the card\'s rule binds coworkers, and about a man breaking his own rule');
    ok(/looks usable but is not/.test(seen.props.prompt) && /payoff/.test(seen.joke.prompt), 'props asks about things that look usable and aren\'t; joke asks for a payoff');
    ok(/premise\.md doesn't describe the end card/.test(seen.joke.prompt) && /Never say the game has no end card/.test(seen.joke.prompt) && !/are blockers/.test(seen.joke.prompt),
      'joke: an ending prose does not describe is "premise.md doesn\'t describe the end card"; no joke answer is a blocker of its own');
    fr = fakeRunner({ '1-judge': 'Verdict: fixable\n- the route: chore — errands\n- The ending: undescribed — premise.md doesn\'t describe the end card\n\n## Problems\n- should: errands — a joke\n- should: premise.md doesn\'t describe the end card — describe it' });
    rec = await runStage('meeting', 'joke', { runner: fr.runner, root: proot, log: silent, ...fixed });
    ok(rec.verdict === 'works' && rec.tally.undescribed === 1, `joke: chore and undescribed, graded should, are works (${rec.verdict})`);
    ok(passList('text').join() === 'title,sense,motives,props,joke', '--pass text: the five narrow text passes');

    // faces: every bubble alone, then each in its frame.
    fr = fakeRunner({ '1-read': 'FACE-READING', '2-judge': 'Verdict: works\n- 01: misread — a blob\n\n## Problems\n- none' });
    rec = await runStage('meeting', 'faces', { runner: fr.runner, root: proot, lib, checks: CHECKS, log: silent, ...fixed });
    const [f1, f2] = fr.calls;
    const finp = await stageInputs('meeting', 'faces', { root: proot, lib, checks: CHECKS });
    const n = finp.faces.length;
    ok(n > 0 && files(f1).length === n && files(f1).every((f) => /^bubbles\/\d\d\.png$/.test(f)) && finp.faces.every((x, i) => f1.files[`bubbles/${String(i + 1).padStart(2, '0')}.png`].equals(x.solo)),
      `faces step 1: each distinct bubble alone (${n}), nothing else`);
    ok(files(f2).filter((f) => f.startsWith('frames/')).length === n && ['card.txt', 'frames.md', 'reading.md'].every((f) => files(f2).includes(f)), 'faces step 2: each bubble with its frame, the card and where each came up');
    ok(!/SECRET-CHECK|[\u{1F300}-\u{1FAFF}]/u.test(text(f2, 'frames.md')), 'faces: frames.md names no check and no glyph (never what a bubble means)');
    ok(f1.prompt.startsWith(preamble('focus.md')) && rec.verdict === 'fixable' && rec.tally.misread === 1, 'faces: the narrow preamble; a misread bubble is at best fixable');

    // tells: before and after each player action.
    fr = fakeRunner({ '1-read': 'TELL-READING', '2-judge': 'Verdict: works\n- 01.png: invisible — nothing changed\n\n## Problems\n- none' });
    rec = await runStage('meeting', 'tells', { runner: fr.runner, root: proot, lib, checks: CHECKS, log: silent, ...fixed });
    const [e1, e2] = fr.calls;
    ok(files(e1)[0] === 'captions.md' && files(e1).slice(1).every((f) => /^tells\/\d\d\.png$/.test(f)) && files(e1).length >= 2, 'tells step 1: the captions and the before/after pictures');
    ok(!/SECRET-CHECK|interact|coffee_machine/.test(text(e1, 'captions.md')) && /SECRET-CHECK-B/.test(text(e2, 'tells.md')) && files(e2).includes('reading.md'),
      'tells: step 1 is not told what was done; step 2 is, and in which route');
    ok(rec.verdict === 'fixable' && rec.tally.invisible === 1, 'tells: an invisible change is at best fixable');

    // outcomes: the last frames of every run.
    fr = fakeRunner({ '1-read': 'END-READING', '2-judge': 'Verdict: works\n- Run 2: wrong — the win looks like a catch\n\n## Problems\n- none' });
    rec = await runStage('meeting', 'outcomes', { runner: fr.runner, root: proot, lib, checks: CHECKS, log: silent, ...fixed });
    const [o1, o2] = fr.calls;
    const pngs = files(o1).filter((f) => f.endsWith('.png'));
    ok(files(o1)[0] === 'card.txt' && pngs.length <= CHECKS.length * OUTCOME_FRAMES && pngs.length >= CHECKS.length, `outcomes step 1: the card and each run's last ${OUTCOME_FRAMES} frames (${pngs.length})`);
    ok(!Object.entries(o1.files).some(([f, b]) => /runs\.md|ways\.md/.test(f) || (f.endsWith('.md') && /SECRET-CHECK/.test(b.toString('utf8')))) && ['runs.md', 'ways.md', 'reading.md'].every((f) => files(o2).includes(f)),
      'outcomes: step 1 is not told how runs ended; step 2 gets the runs and the ways');
    ok(rec.verdict === 'fixable' && rec.tally.wrong === 1, 'outcomes: a wrong ending is at best fixable');
    ok(STAGES.join() === 'title,sense,motives,props,joke,premise,verbs,faces,tells,outcomes,pictures,replay', 'every pass, in order');
  }

  // --- a pass whose premise.md section is missing says so, and never crashes ---
  const bare = tempRoot('bare'); // meeting's premise.md with its '## Who does what' taken out
  if (has('motives')) {
    s = await stageStatus('meeting', 'motives', { root: bare });
    ok(!s.ok && s.verdict === null && /premise\.md has no '## Who does what' section, which the motives pass reads \(docs\/COLD-READ\.md/.test(s.error ?? ''),
      `missing section: the status says which section and which pass (${s.error})`);
    threw = '';
    try { await runStage('meeting', 'motives', { runner: fakeRunner({}).runner, root: bare, log: silent, ...fixed }); } catch (e) { threw = e.message; }
    ok(/has no '## Who does what' section/.test(threw) && !existsSync(recordFile(bare)), 'missing section: a run stops with that message and records nothing');
    // The command line reads the live level folder, so it is shown an input error the repo is sure to have: the
    // fixture level has no premise.md at all.
    const cliRun = spawnSync('node', [join(ROOT, 'tools/cold-read.mjs'), '--level', 'fixture', '--pass', 'motives', '--bundle-only'], { encoding: 'utf8' });
    ok(cliRun.status === 1 && /^cold-read: .*no \S*premise\.md/m.test(cliRun.stderr) && !/\n\s+at /.test(cliRun.stderr),
      `an input error: the command line prints it in one line, no stack (${cliRun.stderr.trim().split('\n')[0]})`);
  }
  ok(Object.keys(SECTIONS).join() === 'ways,who,things' && SECTIONS.who[0] === 'Who does what' && SECTIONS.things[0] === 'Things in the office', 'the prose sections the text passes read');

  // --- shots: the clock each one landed on, and no two alike ---
  // 'Ns' counts real seconds, and pretending runs the game 6 times faster: 'pretend 5s' lands about 18 game minutes on,
  // 'wait 5s' 3 (docs/COLD-READ.md, shots.js). If the harness changes this, the doc's rule changes with it.
  const landed = (cmds) => renderShot(meeting, { name: 'when', cmds }, lib).at;
  ok(landed(['pretend 5s']) === '2:47 PM' && landed(['wait 5s']) === '2:33 PM' && landed(['pretend 3m']) === '2:33 PM',
    'shots: \'pretend 5s\' lands at 2:47 PM (5 real seconds at 6x), \'wait 5s\' and \'pretend 3m\' at 2:33 PM');
  const TWINS = [...SHOTS, { name: 'start-again', cmds: [], intent: 'the same office' }, { name: 'end-again', cmds: ['busy until 4:00'], intent: 'the same end' }];
  let twinErr = null;
  try { await renderShots('meeting', { lib, shots: TWINS }); } catch (e) { twinErr = e.message; }
  ok(/pixel-identical: 01-start\.png \(landed 2:30 PM\) and 04-start-again\.png \(landed 2:30 PM\); 03-end-fail\.png \(landed 4:00 PM, then the end card\) and 05-end-again\.png/.test(twinErr ?? ''),
    `shots: two shots that render pixel-identical are an error naming both, with their clocks (${twinErr})`);
  const kept = await renderShots('meeting', { lib, shots: TWINS, same: true });
  ok(kept.length === 5 && sameShots(kept).map(([a, b]) => `${a.name}=${b.name}`).join() === 'start=start-again,end-fail=end-again', 'shots: same: true draws them anyway (the command line writes them to look at), and sameShots names the pairs');
  const caughtCard = (file) => ({ file, at: '3:40 PM', phase: 'end', outcome: { result: 'caught' } });
  ok(!/beat: true/.test(twinErr ?? '') && /Both are the caught end card: [^.]*give that shot beat: true/.test(sameShotsText('audit', [[caughtCard('14-cross-you.png'), caughtCard('27-end-caught.png')]])),
    'shots: twin caught end cards: the error says how to draw the caught beat instead (not for other end cards)');
  ok(sameShots(rendered).length === 0, 'shots: the stand-in list has no two alike');
  // A catch: the next command would run its beat out to the end card, so only beat: true can draw the beat.
  const CAUGHT = ['pretend until 3:18', 'goto coat_rack pretend', 'wait until 3:26.6', 'interact']; // meeting's end-caught
  const ended = renderShot(meeting, { name: 'c', cmds: CAUGHT }, lib);
  const beat = renderShot(meeting, { name: 'c', cmds: CAUGHT, beat: true }, lib);
  ok(ended.phase === 'end' && beat.phase === 'day' && beat.beat && !ended.png.equals(beat.png),
    `shots: commands that stop at a catch draw its end card; with beat: true, the caught beat (${ended.phase}, ${beat.phase})`);
  ok(shotWhen(beat) === `landed ${beat.at}, the caught beat` && shotWhen(ended) === `landed ${ended.at}, then the end card`, `shots: the line says which (${shotWhen(beat)}; ${shotWhen(ended)})`);
  let beatErr = null;
  try { renderShot(meeting, { name: 'no-catch', cmds: ['wait 1s'], beat: true }, lib); } catch (e) { beatErr = e.message; }
  ok(/beat: true, but its commands do not stop in a beat \(nobody caught you, and the deadline has not come\)/.test(beatErr ?? ''), `shots: beat: true with no catch and before the deadline is an error (${beatErr})`);
  // The deadline's beat (END_BEAT, 2 s): a wait after the deadline lands in it. Without beat: true the shot jumped to
  // the end card, so a beat at the outcome (Weekend Shift's 5:00 redraw) showed only in the replay strips.
  const ws = getLevel('weekend-shift');
  const IN_BEAT = ['pretend until 5:00', 'wait 0.5s'];
  const outCard = renderShot(ws, { name: 'o', cmds: IN_BEAT }, lib);
  const mid = renderShot(ws, { name: 'o', cmds: IN_BEAT, beat: true }, lib);
  ok(outCard.phase === 'end' && mid.phase === 'day' && mid.beat === 'outcome' && mid.outcome?.result === 'fail' && mid.beatT > 0 && mid.beatT < 2 && !outCard.png.equals(mid.png),
    `shots: commands that stop in the deadline's beat draw its end card; with beat: true, the beat itself (${outCard.phase}, ${mid.phase}, ${mid.beatT?.toFixed(2)} s in)`);
  ok(new RegExp(`^landed ${mid.at}, 0\\.\\d s into the deadline's beat$`).test(shotWhen(mid)), `shots: the line says how far into the deadline's beat (${shotWhen(mid)})`);
  // A command that starts in the beat runs it out (the player is locked), so beat: <s> runs on into it itself.
  const BOSS_WS = ['goto microwave pretend', 'interact', 'goto roster pretend', 'interact', 'pretend until 5:00']; // Saturday's ding: written walking past
  const won = renderShot(ws, { name: 'w', cmds: BOSS_WS, beat: 0.8 }, lib);
  const won2 = renderShot(ws, { name: 'w', cmds: BOSS_WS, beat: 1.5 }, lib);
  ok(won.phase === 'day' && won.beat === 'outcome' && won.outcome?.result === 'win' && Math.abs(won.beatT - 0.8) < 0.05 && !won.png.equals(won2.png),
    `shots: beat: 0.8 draws the deadline's beat 0.8 s in, and 1.5 another moment (${won.beatT?.toFixed(2)}, ${won2.beatT?.toFixed(2)})`);
  const caught2 = renderShot(meeting, { name: 'c', cmds: CAUGHT, beat: 0.3 }, lib);
  ok(caught2.beat === 'caught' && Math.abs(caught2.beatT - 0.3) < 0.05 && !caught2.png.equals(beat.png), `shots: beat: 0.3 draws the caught beat 0.3 s in (${caught2.beatT?.toFixed(2)})`);
  let pastErr = null;
  try { renderShot(ws, { name: 'past', cmds: BOSS_WS, beat: 3 }, lib); } catch (e) { pastErr = e.message; }
  ok(/beat: 3 is past the end of the deadline's beat/.test(pastErr ?? ''), `shots: seconds past the end of the beat are an error (${pastErr})`);
  let lateErr = null;
  try { renderShot(ws, { name: 'late', cmds: ['pretend until 5:00', 'wait 5s'], beat: true }, lib); } catch (e) { lateErr = e.message; }
  ok(/do not stop in a beat \(the day is already over/.test(lateErr ?? ''), `shots: beat: true after the beat has run out is an error (${lateErr})`);
  ok(shotsProblems([{ name: 'x', cmds: [], intent: 'y', beat: 'yes' }]).some((p) => /beat: true, false or seconds/.test(p))
    && shotsProblems([{ name: 'x', cmds: [], intent: 'y', beat: -1 }]).length === 1
    && !shotsProblems([{ name: 'x', cmds: [], intent: 'y', beat: true }, { name: 'z', cmds: [], intent: 'y', beat: 0.8 }]).length,
    'shots: beat is true, false or seconds into the beat');
  s = await stageStatus('meeting', 'pictures', { root, lib, shots: TWINS });
  ok(!s.ok && /pixel-identical/.test(s.error ?? ''), 'pictures: a level whose shots repeat cannot be fresh: the status says why');

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

  // --- the gate's checks and --status: every pass ---
  const full = tempRoot('full', true);
  const opts = { root: full, lib, shots: SHOTS, checks: CHECKS, log: silent, ...fixed };
  const at = (pass) => STAGES.indexOf(pass);
  let checks = await coldReadChecks('meeting', opts);
  ok(checks.map((c) => c.name).join() === STAGES.map((st) => `cold-read:${st}`).join(), `gate checks: one per pass (${STAGES.join(', ')})`);
  ok(checks.every((c) => !c.ok && c.text === 'no cold read yet') && checks[at('sense')].detail[0] === 'run: node tools/cold-read.mjs --level meeting --pass sense',
    'gate checks: a pass never run fails, with the command to run');
  fr = fakeRunner(worksReply);
  for (const st of STAGES) await runStage('meeting', st, { runner: fr.runner, ...opts });
  checks = await coldReadChecks('meeting', opts);
  ok(checks.every((c) => c.ok) && checks.every((c) => /^works \(2026-11-15, abc1234\), fresh$/.test(c.text)), `gate checks: all ok when every pass works and is fresh (${checks.filter((c) => !c.ok).map((c) => `${c.name}: ${c.text}`).join('; ')})`);
  checks = await coldReadChecks('meeting', { ...opts, shots: SHOTS.slice(0, 2) });
  ok(!checks[at('pictures')].ok && /works .*, but stale: shots\.js, the rendered shots changed since/.test(checks[at('pictures')].text)
    && checks.filter((c) => !c.ok).length === 1, 'gate checks: stale says what changed, and only that pass is stale');
  await runStage('meeting', 'replay', { runner: fakeRunner((step) => (step.startsWith('2') ? 'Verdict: broken\nno idea' : 'r')).runner, ...opts });
  checks = await coldReadChecks('meeting', opts);
  ok(/^broken \(2026-11-15, abc1234\): fix the problems/.test(checks[at('replay')].text) && /run the pass again/.test(checks[at('replay')].text), 'gate checks: a broken pass says to fix and rerun');
  await runStage('meeting', 'replay', { runner: fr.runner, ...opts });
  const other = tempRoot('other');
  checks = await coldReadChecks('meeting', { ...opts, root: other });
  ok(checks.every((c) => !c.ok && /^no cold read yet/.test(c.text)), 'gate checks: missing passes say so');
  rmSync(join(other, 'premise.md'));
  checks = await coldReadChecks('meeting', { ...opts, root: other });
  ok(checks.every((c) => !c.ok && /can't run: no .*premise\.md/.test(c.text)), 'gate checks: no premise.md says it can\'t run');
  const lines = await statusLines(['meeting'], opts);
  ok(lines.join('\n') === ['meeting', ...STAGES.map((st) => `  ok    ${st.padEnd(9)}works (2026-11-15, abc1234), fresh`)].join('\n'), 'status: a line per pass');
  const ids = coldReadLevels();
  ok(ids.includes('meeting') && ids.includes('weekend-shift') && !ids.some(isFixture) && ids.length >= 8, 'status covers every level but the fixtures');
  const cli = execFileSync('node', [join(ROOT, 'tools/cold-read.mjs'), '--status'], { encoding: 'utf8', env: { ...process.env, BUSYWORK_CANVAS_DIR: join(TMP, 'no-canvas') } });
  ok(ids.every((id) => cli.includes(`${id}\n`)) && !cli.includes('fixture') && cli.trim().split('\n').length === ids.length * (1 + STAGES.length), '--status prints every non-fixture level and all its passes');
  ok((cli.match(/^ {2}\S+ +sense +/gm) || []).length === ids.length, '--status lists sense for every level');
  ok(STAGES.slice(0, STAGES.indexOf('premise')).every((st) => PASSES.find((x) => x.id === st).kind === 'text'), 'the narrow text passes run and list first');
  ok(passList('sense,replay').join() === 'sense,replay' && passList('all').join() === STAGES.join(), '--pass: a list, or all');
  threw = '';
  try { passList('sense,nope'); } catch (e) { threw = e.message; }
  ok(/no pass 'nope'/.test(threw), '--pass: an unknown pass is an error');

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
  writeFileSync(report, 'Verdict: works\nMANUAL-REPORT\n\n## Problems\n- should: MANUAL-SHOULD — fix');
  rec = recordManual('meeting', 'premise', report, { root: man, pointer, model: 'some-model', ...fixed });
  md = readFileSync(recordFile(man), 'utf8');
  ok(rec.verdict === 'works' && md.includes('MANUAL-FIRST-READ') && md.includes('MANUAL-REPORT') && md.includes('a manual run') && md.includes('some-model'),
    'record: a manual run\'s replies, verdict and model go in the record');
  ok((await stageStatus('meeting', 'premise', { root: man })).ok, 'record: a manual run is fresh like any other');
  writeFileSync(join(man, 'premise.md'), readFileSync(join(man, 'premise.md'), 'utf8') + '\nchanged\n');
  m = await bundle();
  ok(m.work !== work && m.steps[0].state === 'ready', 'bundle-only: changed inputs start a new run');
  writeFileSync(m.steps[0].replyFile, 'R');
  m = await bundle();
  ok(/- E1 \[should\] MANUAL-SHOULD/.test(readFileSync(join(m.steps[1].dir, 'earlier.md'), 'utf8')) && m.earlier.items.length === 1, 'bundle-only: the last step gets the ledger too, kept in the manifest');

  // --- calibrate: a reference level, read cold, recorded elsewhere ---
  const calFile = join(TMP, 'calibrate.md');
  const calBefore = readFileSync(recordFile(man), 'utf8');
  fr = fakeRunner({ '1-card': 'c', '2-review': 'Verdict: works\n\n## Problems\n- none' });
  rec = await runStage('meeting', 'premise', { runner: fr.runner, root: man, log: silent, ledger: false, recordTo: calFile, ...fixed });
  ok(!files(fr.calls[1]).includes('earlier.md') && rec.verdict === 'works' && readFileSync(calFile, 'utf8').includes('## premise: works') && readFileSync(recordFile(man), 'utf8') === calBefore,
    'calibrate: no ledger, and the level\'s own record is left alone');
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
