// Shared visual-effect state helpers. Gameplay/sim code calls these; the renderer
// draws game.fx; audio listens to the 'say' event.
//
// game.fx = { bubbles: [], particles: [], shake: { t, amount }, lines: [] }

let bubbleSeq = 0;

export function createFx() {
  return { bubbles: [], particles: [], shake: { t: 0, amount: 0 }, lines: [] };
}

// owner: entity id (string) or a fixed point { x, y } in tile units (for signs).
// icons: array of emoji strings, read left to right.
// opts.kind: 'speech' (babble audio) | 'thought' (silent, cloud style) | 'alert' (big, e.g. ❗) | 'sign'
// opts.ttl: seconds. opts.voice: babble voice id (defaults to owner id).
export function say(game, owner, icons, opts = {}) {
  const kind = opts.kind ?? 'speech';
  const ownerKey = typeof owner === 'string' ? owner : `${owner.x},${owner.y}`;
  game.fx.bubbles = game.fx.bubbles.filter((b) => b.ownerKey !== ownerKey);
  const bubble = {
    id: ++bubbleSeq,
    owner,
    ownerKey,
    icons,
    kind,
    age: 0,
    ttl: opts.ttl ?? 2.5,
  };
  game.fx.bubbles.push(bubble);
  game.events.emit('say', { owner, icons, kind, voice: opts.voice ?? ownerKey });
  return bubble;
}

// kind: 'smoke' | 'sparks' | 'crumbs' | 'paper' | 'zzz' | 'sweat' | 'confetti' | string
export function burst(game, kind, x, y, n = 8, opts = {}) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = (opts.speed ?? 1.5) * (0.4 + Math.random() * 0.8);
    game.fx.particles.push({
      kind,
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - (opts.lift ?? 0),
      age: 0,
      ttl: (opts.ttl ?? 0.8) * (0.7 + Math.random() * 0.6),
    });
  }
}

// A sightline flash: "this NPC is looking at you, from there". Drawn from the NPC's eyes to
// the player (both live positions), fading out over ttl.
// kind: 'notice' (first sight, faint) | 'tattle' (a witness shouts) | 'caught' (the boss)
export function sightline(game, from, kind = 'notice', ttl = 0.8) {
  game.fx.lines = game.fx.lines.filter((l) => l.from !== from);
  game.fx.lines.push({ from, to: 'player', kind, age: 0, ttl });
}

export function shake(game, amount = 0.15, t = 0.3) {
  game.fx.shake.amount = Math.max(game.fx.shake.amount, amount);
  game.fx.shake.t = Math.max(game.fx.shake.t, t);
}

export function updateFx(game, dt) {
  const fx = game.fx;
  for (const b of fx.bubbles) b.age += dt;
  fx.bubbles = fx.bubbles.filter((b) => b.age < b.ttl);
  for (const p of fx.particles) {
    p.age += dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.92 ** (dt * 60); // drag per 1/60 s, whatever the step
    p.vy *= 0.92 ** (dt * 60);
  }
  fx.particles = fx.particles.filter((p) => p.age < p.ttl);
  for (const l of fx.lines) l.age += dt;
  fx.lines = fx.lines.filter((l) => l.age < l.ttl);
  if (fx.shake.t > 0) fx.shake.t = Math.max(0, fx.shake.t - dt);
  else fx.shake.amount = 0;
}
