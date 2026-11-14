// Recording fake 2D canvas and window/document stubs for headless renderer tools (no browser).
// Every ctx member is checked against the real CanvasRenderingContext2D API; bad arguments and styles
// land in fake.errors, tagged with fake.scene. Optional hooks see every call and property set:
//   onCall(canvasLabel, method, args)   also gradient addColorStop, as method 'addColorStop'
//   onSet(canvasLabel, prop, value)
export const METHODS = new Set(('arc arcTo beginPath bezierCurveTo clearRect clip closePath createConicGradient createImageData ' +
  'createLinearGradient createPattern createRadialGradient drawFocusIfNeeded drawImage ellipse fill fillRect fillText ' +
  'getContextAttributes getImageData getLineDash getTransform isPointInPath isPointInStroke lineTo measureText moveTo ' +
  'putImageData quadraticCurveTo rect reset resetTransform restore rotate roundRect save scale setLineDash setTransform ' +
  'stroke strokeRect strokeText transform translate').split(' '));
export const ENUMS = {
  textAlign: ['left', 'right', 'center', 'start', 'end'],
  textBaseline: ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'],
  lineCap: ['butt', 'round', 'square'],
  lineJoin: ['round', 'bevel', 'miter'],
  globalCompositeOperation: ['source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in',
    'destination-out', 'destination-atop', 'lighter', 'copy', 'xor', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
};
export const badStr = (s) => /NaN|undefined|Infinity|\[object/.test(s);
export function validColor(v) {
  if (v && typeof v === 'object') return !!v.__fake;
  if (typeof v !== 'string' || badStr(v)) return false;
  if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return true;
  const m = v.match(/^rgba?\(([^)]*)\)$/);
  if (m) {
    const parts = m[1].split(',').map((s) => s.trim());
    if (parts.length < 3 || parts.length > 4) return false;
    if (!parts.every((p) => /^-?\d+(\.\d+)?%?$/.test(p))) return false;
    const a = parts.length === 4 ? Number(parts[3]) : 1;
    return a >= 0 && a <= 1 && parts.slice(0, 3).every((p) => Number(p) >= 0 && Number(p) <= 255);
  }
  return /^[a-z]+$/i.test(v);
}

export function createFakeCanvas({ onCall, onSet } = {}) {
  const fake = {
    errors: [],
    scene: 'setup',
    calls: 0,
    dashCalls: 0, // dashed strokes started (HUD slots, sightlines)
    contexts: [],
    listeners: {},
    created: 0, // canvases made through document.createElement
    fail,
    makeCanvas,
    installDom,
  };
  function fail(msg) {
    if (fake.errors.length < 60) fake.errors.push(`[${fake.scene}] ${msg}`);
  }
  const gradient = (label) => ({
    __fake: true,
    addColorStop(off, color) {
      if (!Number.isFinite(off) || off < 0 || off > 1) fail(`addColorStop offset ${off}`);
      if (!validColor(color)) fail(`addColorStop color ${color}`);
      if (onCall) onCall(label, 'addColorStop', [off, color]);
    },
  });

  function makeCanvas(label, w = 300, h = 150) {
    const canvas = { width: w, height: h, style: {}, label };
    const state = { depth: 0, underflow: 0, label };
    const props = {
      canvas, globalAlpha: 1, fillStyle: '#000000', strokeStyle: '#000000', lineWidth: 1, lineCap: 'butt',
      lineJoin: 'miter', miterLimit: 10, lineDashOffset: 0, font: '10px sans-serif', textAlign: 'start',
      textBaseline: 'alphabetic', direction: 'inherit', shadowBlur: 0, shadowColor: 'rgba(0,0,0,0)', shadowOffsetX: 0,
      shadowOffsetY: 0, globalCompositeOperation: 'source-over', imageSmoothingEnabled: true, imageSmoothingQuality: 'low',
      filter: 'none', letterSpacing: '0px', fontKerning: 'auto',
    };
    const special = {
      save() { state.depth++; },
      restore() { if (state.depth === 0) state.underflow++; else state.depth--; },
      measureText(s) { return { width: String(s).length * 8 }; },
      createLinearGradient: () => gradient(label),
      createConicGradient: () => gradient(label),
      createRadialGradient(x0, y0, r0, x1, y1, r1) {
        if (r0 < 0 || r1 < 0) fail(`createRadialGradient negative radius ${r0} ${r1}`);
        return gradient(label);
      },
      createPattern() { return { __fake: true, setTransform() {} }; },
      arc(x, y, r) { if (r < 0) fail(`arc negative radius ${r}`); },
      arcTo(x1, y1, x2, y2, r) { if (r < 0) fail(`arcTo negative radius ${r}`); },
      ellipse(x, y, rx, ry) { if (rx < 0 || ry < 0) fail(`ellipse negative radius ${rx} ${ry}`); },
      roundRect(x, y, w, h, r) { if (typeof r === 'number' && r < 0) fail(`roundRect negative radius ${r}`); },
      drawImage(img) {
        if (!img || !(img.width > 0) || !(img.height > 0)) fail('drawImage with empty source');
      },
      fillText(txt) {
        if (typeof txt !== 'string' && typeof txt !== 'number') fail(`fillText non-string ${typeof txt}`);
        else if (badStr(String(txt))) fail(`fillText "${txt}"`);
      },
      setLineDash(arr) {
        if (!Array.isArray(arr) || arr.some((v) => !Number.isFinite(v) || v < 0)) fail(`setLineDash ${arr}`);
        else if (arr.length) fake.dashCalls++;
      },
      getLineDash() { return []; },
      getTransform() { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }; },
    };
    const fns = {};
    const ctx = new Proxy({}, {
      get(_, key) {
        if (key === '__state') return state;
        if (typeof key === 'symbol') return undefined;
        if (Object.prototype.hasOwnProperty.call(props, key)) return props[key];
        if (!fns[key]) {
          if (!METHODS.has(key)) fail(`unknown ctx member read: ${key}`);
          fns[key] = (...args) => {
            fake.calls++;
            for (let i = 0; i < args.length; i++) {
              const a = args[i];
              if (typeof a === 'number' && !Number.isFinite(a)) fail(`${key} arg ${i} = ${a}`);
              if (a === undefined) fail(`${key} arg ${i} undefined`);
            }
            const sp = special[key];
            const r = sp ? sp(...args) : undefined;
            if (onCall) onCall(label, key, args);
            return r;
          };
        }
        return fns[key];
      },
      set(_, key, value) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) fail(`unknown ctx property set: ${String(key)}`);
        if (value === undefined || value === null) fail(`${String(key)} = ${value}`);
        else if (typeof value === 'number' && !Number.isFinite(value)) fail(`${String(key)} = ${value}`);
        else if (key === 'fillStyle' || key === 'strokeStyle' || key === 'shadowColor') {
          if (!validColor(value)) fail(`${key} = ${value}`);
        } else if (typeof value === 'string' && badStr(value)) fail(`${String(key)} = ${value}`);
        if (key === 'font' && !/(^|\s)\d+(\.\d+)?px\s/.test(value)) fail(`font = ${value}`);
        if (key === 'globalAlpha' && (value < 0 || value > 1)) fail(`globalAlpha out of range ${value}`);
        if (key === 'lineWidth' && !(value > 0)) fail(`lineWidth ${value}`);
        if (key === 'shadowBlur' && value < 0) fail(`shadowBlur ${value}`);
        if (ENUMS[key] && !ENUMS[key].includes(value)) fail(`${key} = ${value}`);
        if (onSet) onSet(label, key, value);
        props[key] = value;
        return true;
      },
    });
    fake.contexts.push(ctx);
    canvas.getContext = (type) => (type === '2d' ? ctx : null);
    return canvas;
  }

  // Installs globalThis.window/document. Call it after importing the renderer, which must not touch the DOM
  // at import time.
  function installDom({ innerWidth = 1280, innerHeight = 800, devicePixelRatio = 2 } = {}) {
    globalThis.window = {
      innerWidth, innerHeight, devicePixelRatio,
      addEventListener(type, fn) { (fake.listeners[type] ||= []).push(fn); },
      removeEventListener() {},
    };
    globalThis.document = {
      createElement(tag) {
        if (tag !== 'canvas') throw new Error(`unexpected createElement(${tag})`);
        fake.created++;
        return makeCanvas(`offscreen${fake.created}`);
      },
    };
    return globalThis.window;
  }

  return fake;
}
