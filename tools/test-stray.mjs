// Tests for tools/crop.mjs and tools/lib/stray.mjs: the blank "280" PNG that appeared in the main repo's root.
// It came from an ad-hoc crop script with positional arguments (file x y w h out), called as
// (file out x y w h scale): "out" was 280. crop.mjs takes named arguments only and refuses that call; the stray
// check finds a picture at a repo root by its bytes, with or without an extension.
import { mkdtempSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { parseCropArgs, crop } from './crop.mjs';
import { strayPictures, REPO_ROOT } from './lib/stray.mjs';
import { loadCanvas } from './lib/draw.mjs';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const err = (f) => { try { f(); return ''; } catch (e) { return e.message; } };

const TMP = mkdtempSync(join(tmpdir(), 'busywork-test-stray-'));
try {
  const { createCanvas } = loadCanvas();
  const c = createCanvas(400, 300);
  const g = c.getContext('2d');
  g.fillStyle = '#c33';
  g.fillRect(0, 0, 400, 300);
  const src = join(TMP, 'shot.png');
  writeFileSync(src, c.toBuffer('image/png'));

  // The call that wrote "280": positional, in the wrong order.
  ok(/every argument is named/.test(err(() => parseCropArgs([src, join(TMP, 'c.png'), '300', '360', '400', '280', '2']))),
    'crop: positional arguments are refused (the call that wrote "280")');
  ok(/--x must be a number of pixels, not ".*c\.png"/.test(err(() => parseCropArgs(['--in', src, '--out', '280', '--x', join(TMP, 'c.png'), '--y', '0', '--w', '10', '--h', '10']))),
    'crop: a path where a number belongs is refused');
  ok(/--out must name a \.png file, not ".*280"/.test(err(() => parseCropArgs(['--in', src, '--out', '280', '--x', '0', '--y', '0', '--w', '10', '--h', '10']))),
    'crop: an output that is not a .png (a bare "280") is refused');
  ok(/inside the repo/.test(err(() => parseCropArgs(['--in', src, '--out', join(REPO_ROOT, '280.png'), '--x', '0', '--y', '0', '--w', '10', '--h', '10']))),
    'crop: an output inside the repo is refused');
  ok(/inside the repo/.test(err(() => parseCropArgs(['--in', src, '--out', 'c.png', '--x', '0', '--y', '0', '--w', '10', '--h', '10'], process.cwd())))
    || !process.cwd().startsWith(REPO_ROOT), 'crop: a bare relative output from the repo is refused');
  ok(err(() => parseCropArgs(['--in', src, '--out', join(REPO_ROOT, 'tools/.shots/x/c.png'), '--x', '0', '--y', '0', '--w', '10', '--h', '10'])) === '',
    'crop: tools/.shots/ is allowed');
  ok(/--h is missing/.test(err(() => parseCropArgs(['--in', src, '--out', join(TMP, 'c.png'), '--x', '0', '--y', '0', '--w', '10']))), 'crop: a missing size is refused');
  let msg = '';
  try { await crop(parseCropArgs(['--in', src, '--out', join(TMP, 'big.png'), '--x', '300', '--y', '0', '--w', '200', '--h', '10'])); } catch (e) { msg = e.message; }
  ok(/outside the 400x300 picture/.test(msg) && !existsSync(join(TMP, 'big.png')), 'crop: a box outside the picture is refused, and nothing is written');
  const out = await crop(parseCropArgs(['--in', src, '--out', join(TMP, 'sub/c.png'), '--x', '10', '--y', '20', '--w', '30', '--h', '40', '--scale', '2']));
  const { loadImage } = loadCanvas();
  const img = await loadImage(readFileSync(out));
  ok(img.width === 60 && img.height === 80, 'crop: a good call writes the zoomed crop where it was told');
  let cli = '';
  try { execFileSync('node', [join(REPO_ROOT, 'tools/crop.mjs'), src, '280'], { cwd: TMP, encoding: 'utf8', stdio: 'pipe' }); } catch (e) { cli = String(e.stderr); }
  ok(/crop: unknown argument/.test(cli) && !existsSync(join(TMP, '280')), 'crop CLI: a bad call exits with the usage and writes nothing');

  // The stray check.
  const root = join(TMP, 'repo');
  execFileSync('mkdir', ['-p', join(root, 'tools/.shots')]);
  writeFileSync(join(root, 'README.md'), '# hi\n');
  writeFileSync(join(root, 'tools/.shots/ok.png'), c.toBuffer('image/png'));
  ok(strayPictures(root).length === 0, 'stray: no pictures at the root, none found (pictures in folders are fine)');
  writeFileSync(join(root, '280'), c.toBuffer('image/png'));
  writeFileSync(join(root, 'x.jpg'), Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0]));
  const s = strayPictures(root).map((p) => `${p.file.slice(root.length + 1)}:${p.kind}`).sort().join(' ');
  ok(s === '280:PNG x.jpg:JPEG', `stray: an extensionless PNG and a JPEG at the root are found (${s})`);
  ok(strayPictures().length === 0, `stray: this repo's root holds no pictures (${strayPictures().map((p) => p.file).join(', ')})`);
} finally {
  rmSync(TMP, { recursive: true, force: true });
}
console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
