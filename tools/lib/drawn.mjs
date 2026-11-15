// The visual language's gate check (DESIGN.md "Visual language": people speak emoji, the world is drawn).
//   drawnCheck(r)                 the gate's `drawn` check on a fuzz result: fails a level on the legacy list
//                                 (src/levels/legacy.js) and any emoji r.glyphs saw drawn as an object
//   worldGlyphs(levelId, plans)   renders each plan (a list of harness commands) into the fake canvas, every few
//                                 frames and over the end card, and returns the emoji drawn as objects in the
//                                 world: [{ glyph, level }] (render/util.js worldEmoji). Speech is not checked.
// The validator (src/levels/validate.js) catches emoji in the level's fields; this catches what slips past it: an
// emoji a painter or an end scene draws.
import { getLevel } from '../../src/levels/index.js';
import { isLegacyLevel } from '../../src/levels/legacy.js';
import { createRenderer } from '../../src/render/renderer.js';
import { createHarness } from '../../src/agent/harness.js';
import { updateFx } from '../../src/core/fx.js';
import { worldEmoji } from '../../src/render/util.js';
import { createFakeCanvas } from './fake-canvas.mjs';

const EVERY = 6; // frames between renders
const END_STEPS = [0, 0.4, 1.5, 6];
const MAX_DRAIN_FRAMES = 60 * 60 * 5;

let fake = null;
export function worldGlyphs(levelId, plans) {
  const level = getLevel(levelId);
  if (!fake) {
    fake = createFakeCanvas();
    fake.installDom({ innerWidth: 960, innerHeight: 600, devicePixelRatio: 1 });
  }
  const seen = worldEmoji.length;
  for (const cmds of plans) {
    const h = createHarness({ level });
    const g = h.game;
    const renderer = createRenderer(fake.makeCanvas('drawn'), { strict: true });
    let frame = 0;
    const clear = g.input.clearPresses;
    g.input.clearPresses = () => {
      clear();
      if (++frame % EVERY === 0) renderer.render(g);
    };
    h.begin();
    renderer.render(g);
    for (const cmd of cmds) {
      h.run(cmd);
      renderer.render(g);
    }
    for (let i = 0; i < MAX_DRAIN_FRAMES && g.phase === 'day'; i++) h.frame();
    for (const dt of END_STEPS) {
      g.time += dt;
      updateFx(g, dt);
      renderer.render(g);
    }
  }
  return worldEmoji.slice(seen).filter((v) => v.level === level.id);
}

// The gate's `drawn` check: { name, ok, text, detail }. r.glyphs: worldGlyphs() of the level's winning plans (the
// gate sets it after fuzzing; absent, only the legacy list is checked).
export function drawnCheck(r) {
  if (isLegacyLevel({ id: r.level })) {
    return { name: 'drawn', ok: false, text: 'on the legacy list: it draws objects as emoji (migrate it: src/levels/legacy.js)', detail: [] };
  }
  const glyphs = r.glyphs ?? [];
  if (glyphs.length) {
    return { name: 'drawn', ok: false, text: `emoji drawn as objects in the world: ${glyphs.map((v) => v.glyph).join(' ')}`, detail: ['draw them (render/things.js; DESIGN.md "Visual language")'] };
  }
  return { name: 'drawn', ok: true, text: r.glyphs ? 'the world is drawn: no emoji objects in the winning plans' : 'the world is drawn (not on the legacy list)', detail: [] };
}
