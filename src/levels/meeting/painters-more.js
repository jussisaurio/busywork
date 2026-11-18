// More of the meeting's drawn things: decor props (render/world.js PROP_PAINTERS signature: ctx, info, at, state, t;
// `at` is the prop's tile). Kept apart from painters.js so builders working in parallel touch different files.
//   ficus      the boss's potted ficus (map.js Y), after you pour the day's only cup into it (interactions.js
//              water_ficus): a dark wet ring in the soil and a new leaf that shoots out and stays. state:
//              { watered, since } (since: seconds since the pour, null before)
//   deadTypewriter  the workstation on the empty desk (map.js W) after the cup went into its keys
//              (interactions.js drown_typewriter): screen dead and cracked, coffee pooled on the keys and dripping
//              off the desk's edge into a puddle, smoke curling up, a spark now and then. state: { dead, since }
//   kevPage    Kev's screen while he dozes on his keyboard (toys.js kev_doze): a growing line of one letter.
//              state: { secs }
import { fillEllipse, fillCircle, clamp, easeOutBack, T } from '../../render/util.js';
import { C } from '../../render/palette.js';

export function ficus(ctx, info, at, state, t) {
  if (!state.watered) return;
  const cx = at.x * T + T / 2;
  const cy = at.y * T + T / 2;
  const s = Number.isFinite(state.since) ? state.since : 99;
  fillEllipse(ctx, cx, cy + 1, 7, 2.5, '#2a1a0e'); // soaked soil, coffee-dark
  fillEllipse(ctx, cx + 2, cy + 0.5, 2, 0.8, 'rgba(255,255,255,0.25)'); // a wet shine
  // The new leaf: out in a fraction of a second, overshooting, then a little sway that never quite stops.
  const k = easeOutBack(clamp(s / 0.45, 0, 1));
  if (k <= 0) return;
  const sway = Math.sin(t * 2.2) * 0.06;
  const leaf = (a, len, w, col) => {
    ctx.save();
    ctx.translate(cx, cy - 4);
    ctx.rotate(a + sway);
    ctx.fillStyle = '#3f6e38';
    ctx.fillRect(0, -0.5, len * 0.9 * k, 1); // the stalk
    fillEllipse(ctx, len * 0.75 * k, 0, len * 0.42 * k, w * k, col);
    fillEllipse(ctx, len * 0.75 * k, -w * 0.3 * k, len * 0.3 * k, 0.6 * k, 'rgba(255,255,255,0.3)');
    ctx.restore();
  };
  leaf(-1.75, 22, 4.2, '#7fbf5f'); // the big one, straight up past the others, glossy and new
  leaf(-0.9, 15, 3.4, C.plantB);
  leaf(-2.6, 14, 3.2, '#8acb68');
  if (s < 1.2) { // a puff of green sparkle as it bursts out
    const a = 1 - s / 1.2;
    for (let i = 0; i < 5; i++) {
      const ang = -1.75 + (i - 2) * 0.5;
      fillCircle(ctx, cx + Math.cos(ang) * 22 * (1 - a * 0.5), cy - 4 + Math.sin(ang) * 22 * (1 - a * 0.5), 1.4 * a + 0.3, `rgba(220,255,200,${a.toFixed(3)})`);
    }
  }
}

// The geometry is render/world.js drawWorkstation's for a three-tile desk sat at from the south, `at` its middle tile.
export function deadTypewriter(ctx, info, at, state, t) {
  if (!state.dead) return;
  const midX = at.x * T + T / 2;
  const py = at.y * T + 3;
  const h = T - 5;
  const monTopY = py + 3;
  const kbY = py + h - 13;
  const s = Number.isFinite(state.since) ? state.since : 99;
  // the screen: dead, a crack across it
  ctx.fillStyle = '#141414';
  ctx.fillRect(midX - 10, monTopY + 8, 20, 7);
  ctx.strokeStyle = 'rgba(220,220,220,0.7)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(midX - 8, monTopY + 9);
  ctx.lineTo(midX - 2, monTopY + 12);
  ctx.lineTo(midX + 1, monTopY + 10);
  ctx.lineTo(midX + 8, monTopY + 14);
  ctx.stroke();
  // coffee over the keys and down the front of the desk
  fillEllipse(ctx, midX, kbY + 3, 12, 4.5, '#4a2a14');
  fillEllipse(ctx, midX - 3, kbY + 2, 4, 1.2, 'rgba(255,255,255,0.22)');
  ctx.fillStyle = '#4a2a14';
  ctx.fillRect(midX + 4, kbY + 5, 2, py + h - kbY - 4);
  const fall = (t * 1.4) % 1; // one drop at a time, off the edge
  fillCircle(ctx, midX + 5, py + h + 1 + fall * 9, 1.3, '#4a2a14');
  fillEllipse(ctx, midX + 5, py + h + 11, 6 + clamp(s / 4, 0, 1) * 4, 2.2, '#3b2212'); // the puddle grows a while
  // smoke from the back of the box
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.45 + i / 3) % 1;
    fillCircle(ctx, midX + Math.sin(t * 1.3 + i * 2) * 3 * k, monTopY - k * 18, 2 + k * 4, `rgba(90,90,90,${(0.45 * (1 - k)).toFixed(3)})`);
  }
  // a spark, every so often
  const sp = (t * 0.8) % 1;
  if (sp < 0.12) {
    ctx.strokeStyle = '#ffe36b';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i - 1.5) * 0.6;
      const r0 = 2 + sp * 30;
      ctx.beginPath();
      ctx.moveTo(midX + Math.cos(a) * r0, kbY + 2 + Math.sin(a) * r0);
      ctx.lineTo(midX + Math.cos(a) * (r0 + 4), kbY + 2 + Math.sin(a) * (r0 + 4));
      ctx.stroke();
    }
    fillCircle(ctx, midX, kbY + 2, 2.5, 'rgba(255,240,150,0.8)');
  }
}

// Kev's screen while he dozes, face on the keyboard (toys.js kev_doze): one key held down, a line of the same letter
// running across under his code, wrapping onto a second line. state: { secs } (seconds asleep so far; 0: nothing).
// `at` is ignored: the prop hangs on another tile (decor.js), Kev's monitor is on his desk's middle tile.
const KEV_DESK = { x: 22, y: 8 };
const PER_SEC = 0.6; // letters a second
export function kevPage(ctx, info, at, state) {
  if (!(state.secs > 0)) return;
  const midX = KEV_DESK.x * T + T / 2;
  const top = KEV_DESK.y * T + 3 + 3; // render/world.js drawWorkstation monTopY
  const n = Math.min(18, Math.floor(state.secs * PER_SEC) + 1);
  ctx.fillStyle = '#1f3d2a'; // his screen (decor.js desks.kev), the lower two lines cleared for it
  ctx.fillRect(midX - 10, top + 10.5, 20, 4.5);
  ctx.fillStyle = '#7fe08a';
  for (let i = 0; i < n; i++) {
    const row = i < 9 ? 0 : 1;
    const x = midX - 9 + (i % 9) * 2;
    const y = top + 11 + row * 2;
    ctx.fillRect(x, y, 0.7, 1.6); // the same letter, over and over: a stem
    ctx.fillRect(x + 0.7, y + 0.6, 0.7, 0.5); // and its arm
  }
}
