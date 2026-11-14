// Keyboard input. No DOM access at import time: listeners are attached by createInput().
//
// Interface (CONTRACTS.md "Gameplay"):
//   isDown(action)  -> bool, key currently held
//   pressed(action) -> bool, consume-on-read; an unconsumed press expires after PRESS_TTL
//   axis()          -> {x, y}, normalised movement vector (or {0, 0})
//   destroy()       -> removes listeners
//
// Actions: up down left right interact busy restart mute cones slower faster start pause

export const PRESS_TTL = 0.2; // seconds an unconsumed press stays valid

// KeyboardEvent.code -> actions. Physical key codes, so WASD works on any layout.
const CODE_MAP = {
  KeyW: ['up'],
  ArrowUp: ['up'],
  KeyS: ['down'],
  ArrowDown: ['down'],
  KeyA: ['left'],
  ArrowLeft: ['left'],
  KeyD: ['right'],
  ArrowRight: ['right'],
  KeyE: ['interact', 'start'],
  Space: ['interact', 'start'],
  Enter: ['interact', 'start'],
  NumpadEnter: ['interact', 'start'],
  ShiftLeft: ['busy'],
  ShiftRight: ['busy'],
  KeyP: ['busy'], // P for 'pretend' (Shift stays primary: a hold under the WASD pinky)
  KeyR: ['restart'],
  Escape: ['pause'],
  KeyM: ['mute'],
  KeyV: ['cones'],
  BracketLeft: ['slower'],
  BracketRight: ['faster'],
};
// Fallback by KeyboardEvent.key (e.g. '[' / ']' live elsewhere on non-US layouts).
const KEY_MAP = { '[': ['slower'], ']': ['faster'], Shift: ['busy'] };

const SHIFT_CODES = ['ShiftLeft', 'ShiftRight', 'key:Shift'];

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;

function keyId(e) {
  if (CODE_MAP[e.code]) return e.code;
  if (KEY_MAP[e.key]) return `key:${e.key}`;
  return null;
}
function actionsOf(id) {
  return CODE_MAP[id] ?? KEY_MAP[id.slice(4)] ?? [];
}

export function createInput(target = window) {
  const down = new Set(); // held key ids
  const presses = new Map(); // action -> timestamp (seconds)

  function onKeyDown(e) {
    // Leave browser shortcuts (Cmd+R, Ctrl+W, ...) alone.
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    syncShift(e);
    const id = keyId(e);
    if (!id) return;
    if (e.preventDefault) e.preventDefault(); // no page scroll on arrows/space, no button activation
    down.add(id);
    if (e.repeat) return; // auto-repeat is not a new press
    const t = now();
    for (const a of actionsOf(id)) presses.set(a, t);
  }

  function onKeyUp(e) {
    syncShift(e);
    const id = keyId(e);
    if (!id) return;
    down.delete(id);
  }

  // Shift keyups get lost sometimes (OS shortcuts, focus changes). Every key event
  // carries the real modifier state, so trust it.
  function syncShift(e) {
    if (e.shiftKey === false) for (const c of SHIFT_CODES) down.delete(c);
  }

  function onBlur() {
    down.clear();
    presses.clear();
  }

  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);
  target.addEventListener('blur', onBlur);

  function isDown(action) {
    for (const id of down) if (actionsOf(id).includes(action)) return true;
    return false;
  }

  return {
    isDown,
    pressed(action) {
      const t = presses.get(action);
      if (t === undefined) return false;
      presses.delete(action);
      return now() - t <= PRESS_TTL;
    },
    axis() {
      const x = (isDown('right') ? 1 : 0) - (isDown('left') ? 1 : 0);
      const y = (isDown('down') ? 1 : 0) - (isDown('up') ? 1 : 0);
      if (!x && !y) return { x: 0, y: 0 };
      const len = Math.hypot(x, y);
      return { x: x / len, y: y / len };
    },
    destroy() {
      target.removeEventListener('keydown', onKeyDown);
      target.removeEventListener('keyup', onKeyUp);
      target.removeEventListener('blur', onBlur);
      down.clear();
      presses.clear();
    },
  };
}
