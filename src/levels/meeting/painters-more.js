// More of the meeting's drawn things: decor props (render/world.js PROP_PAINTERS signature: ctx, info, at, state, t;
// `at` is the prop's tile). Kept apart from painters.js so builders working in parallel touch different files.
//   ficus      the boss's potted ficus (map.js Y), after you pour the day's only cup into it (interactions.js
//              water_ficus): a dark wet ring in the soil and a new leaf that shoots out and stays. state:
//              { watered, since } (since: seconds since the pour, null before)
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
