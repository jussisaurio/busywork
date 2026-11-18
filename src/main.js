// Browser entry point: wires input, renderer, audio and the fixed-step loop.
import { FIXED_DT } from './config.js';
import { createGame } from './state.js';
import { loadEndings } from './game/endings.js';
import { startLoop, runFrame } from './game/loop.js';
import { updateFx } from './core/fx.js';
import { createInput } from './play/input.js';
import { createRenderer } from './render/renderer.js';
import { PAUSE_BTN } from './render/hud.js';
import { playButton } from './render/screens.js';
import { noteEndCard } from './render/shelf.js';
import { VIEW_W, VIEW_H } from './render/util.js';
import { createAudio } from './audio/audio.js';
import { getLevel, levels, defaultLevel } from './levels/index.js';
import { mountLevelPicker } from './play/level-picker.js';

const SPEEDS = [1, 2, 4, 8];

const canvas = document.getElementById('game');

// ?level=<id> picks the level; without it, the registry's default. An unknown id replaces the canvas with
// getLevel's error (which lists the levels), so a typo is visible, not a silent level 1.
function pickLevel() {
  const id = new URLSearchParams(location.search).get('level');
  if (id === null) return undefined;
  try {
    return getLevel(id);
  } catch (err) {
    const note = document.createElement('pre');
    note.textContent = `BUSYWORK: ${err.message}`;
    note.style.cssText = 'color:#f3e6c8;font:18px/1.5 monospace;padding:24px;white-space:pre-wrap;';
    canvas.replaceWith(note);
    throw err;
  }
}

const levelParam = new URLSearchParams(location.search).get('level');
mountLevelPicker(levels, levelParam ?? Object.keys(levels).find((k) => levels[k] === defaultLevel));

const input = createInput(window);
const game = createGame({ input, level: pickLevel() });
loadEndings(game); // the endings shelf: what earlier sessions found (localStorage)
const renderer = createRenderer(canvas);
const audio = createAudio();
audio.attach(game);

// Audio needs a user gesture.
const unlock = () => audio.unlock();
window.addEventListener('keydown', unlock);
window.addEventListener('pointerdown', unlock);

// Pause: Esc, the ⏸ button (top right), or losing focus mid-day. Esc, the button or any click resumes.
const pauseIfPlaying = () => {
  if (game.phase === 'day' && !game.outcome && !game.caught) game.paused = true;
};
window.addEventListener('blur', pauseIfPlaying);
// Tab is not a game key: left alone it moves focus to the page's own controls and then out of the window, and the
// blur above pauses the day. Swallow it while a day runs.
window.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && game.phase === 'day') e.preventDefault();
});
document.addEventListener('visibilitychange', () => document.hidden && pauseIfPlaying());
const PAD = 6; // forgiving hit area around drawn buttons
const viewPoint = (e) => {
  const r = canvas.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * VIEW_W, y: ((e.clientY - r.top) / r.height) * VIEW_H };
};
const inRect = (p, b) => !!b && p.x >= b.x - PAD && p.x <= b.x + b.w + PAD && p.y >= b.y - PAD && p.y <= b.y + b.h + PAD;
// Anything drawn as a button is a button: the ⏸ mid-day, the ▶ on the mission and end cards.
const buttonAt = (p) =>
  game.phase === 'day' ? (inRect(p, PAUSE_BTN) ? 'pause' : null) : inRect(p, playButton.rect) ? 'play' : null;
canvas.addEventListener('pointerdown', (e) => {
  const p = viewPoint(e);
  if (game.phase === 'title' || game.phase === 'end') {
    if (buttonAt(p) === 'play') {
      input.pressed('interact'); // as with the keys: starting the day uses nothing
      startLoop(game);
    }
    return;
  }
  if (game.phase !== 'day') return;
  if (game.paused) {
    game.paused = false;
    return;
  }
  if (buttonAt(p) === 'pause') pauseIfPlaying();
});
canvas.addEventListener('pointermove', (e) => {
  canvas.style.cursor = buttonAt(viewPoint(e)) ? 'pointer' : '';
});
let audioPaused = false;

// Debug handle for the console / browser smoke tests.
window.__game = game;

let last = performance.now();
let acc = 0;

function frame(now) {
  const realDt = Math.min(0.1, (now - last) / 1000);
  last = now;
  game.time += realDt;

  // Global toggles.
  if (input.pressed('mute')) {
    game.settings.muted = !game.settings.muted;
    audio.setMuted(game.settings.muted);
  }
  if (input.pressed('cones')) game.settings.showCones = !game.settings.showCones;
  if (input.pressed('faster')) game.debug.speed = SPEEDS[Math.min(SPEEDS.length - 1, SPEEDS.indexOf(game.debug.speed) + 1)];
  if (input.pressed('slower')) game.debug.speed = SPEEDS[Math.max(0, SPEEDS.indexOf(game.debug.speed) - 1)];

  if (game.phase === 'title' || game.phase === 'end') {
    acc = 0;
    // E is both 'start' and 'interact': the key that starts the day must not also use whatever is in front of you on
    // its first frame (Saturday: you start seated, so it rang the boss's phone).
    input.pressed('interact');
    // Short guard so the key that ended the day doesn't skip the end screen.
    if (input.pressed('start') && (game.phase === 'title' || game.time - (game._endedAt ?? 0) > 0.6)) startLoop(game);
  } else if (game.phase === 'day') {
    if (input.pressed('pause')) {
      if (game.paused) game.paused = false;
      else pauseIfPlaying();
    }
    if (input.pressed('restart')) {
      startLoop(game); // also unpauses (resetLoop)
    } else if (game.paused) {
      acc = 0;
      input.pressed('interact'); // a press made while paused doesn't fire on resume
    } else {
      acc += realDt;
      while (acc >= FIXED_DT && game.phase === 'day') {
        acc -= FIXED_DT;
        runFrame(game, FIXED_DT);
      }
      if (game.phase === 'end') {
        game._endedAt = game.time;
        noteEndCard(game); // the endings shelf (render/shelf.js)
      }
    }
  }

  const frozen = game.phase === 'day' && game.paused;
  if (frozen !== audioPaused) audio.setPaused((audioPaused = frozen));
  updateFx(game, frozen ? 0 : realDt);
  audio.update(game, realDt);
  renderer.render(game);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
