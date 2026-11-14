// Programmatic implementation of the Input interface (see CONTRACTS.md) for headless play.
// The harness drives it; gameplay code can't tell it from a keyboard.

const DIR_ACTIONS = ['up', 'down', 'left', 'right'];

export function createScriptedInput() {
  const down = new Set();
  let queue = [];
  let ax = { x: 0, y: 0 };

  function syncDirKeys() {
    for (const a of DIR_ACTIONS) down.delete(a);
    if (ax.x < -0.38) down.add('left');
    if (ax.x > 0.38) down.add('right');
    if (ax.y < -0.38) down.add('up');
    if (ax.y > 0.38) down.add('down');
  }

  return {
    // --- Input interface ---
    isDown: (a) => down.has(a),
    pressed(a) {
      const i = queue.indexOf(a);
      if (i < 0) return false;
      queue.splice(i, 1);
      return true;
    },
    axis: () => ({ x: ax.x, y: ax.y }),
    destroy() {},

    // --- harness controls ---
    setAxis(x, y) {
      const l = Math.hypot(x, y);
      ax = l > 1e-6 ? { x: x / l, y: y / l } : { x: 0, y: 0 };
      syncDirKeys();
    },
    hold(action, on = true) {
      if (on) down.add(action);
      else down.delete(action);
    },
    press(action) {
      queue.push(action);
    },
    clearPresses() {
      queue = [];
    },
    releaseAll() {
      down.clear();
      queue = [];
      ax = { x: 0, y: 0 };
    },
  };
}
