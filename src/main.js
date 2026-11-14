// Browser entry point: wires input, renderer, audio and the fixed-step loop.
import { FIXED_DT } from './config.js';
import { createGame } from './state.js';
import { startLoop, tick, frameMult } from './game/loop.js';
import { updateFx } from './core/fx.js';
import { createInput } from './play/input.js';
import { createRenderer } from './render/renderer.js';
import { PAUSE_BTN } from './render/hud.js';
import { VIEW_W, VIEW_H } from './render/util.js';
import { createAudio } from './audio/audio.js';

const SPEEDS = [1, 2, 4, 8];

const canvas = document.getElementById('game');
const input = createInput(window);
const game = createGame({ input });
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
document.addEventListener('visibilitychange', () => document.hidden && pauseIfPlaying());
canvas.addEventListener('pointerdown', (e) => {
  if (game.phase !== 'day') return;
  if (game.paused) {
    game.paused = false;
    return;
  }
  const r = canvas.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * VIEW_W;
  const y = ((e.clientY - r.top) / r.height) * VIEW_H;
  const b = PAUSE_BTN;
  if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) pauseIfPlaying();
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
        const mult = frameMult(game);
        for (let i = 0; i < mult && game.phase === 'day'; i++) tick(game, FIXED_DT);
      }
      if (game.phase === 'end') game._endedAt = game.time;
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
