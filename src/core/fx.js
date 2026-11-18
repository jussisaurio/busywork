// Shared visual-effect state helpers. Gameplay/sim code calls these; the renderer
// draws game.fx; audio listens to the 'say' event.
//
// game.fx = { bubbles: [], particles: [], shake: { t, amount }, lines: [], ripples: [], turns: [] }

let bubbleSeq = 0;

export function createFx() {
  return { bubbles: [], particles: [], shake: { t: 0, amount: 0 }, lines: [], ripples: [], turns: [] };
}

// owner: entity id (string) or a fixed point { x, y } in tile units (for signs).
// icons: array of emoji strings, read left to right.
// opts.kind: 'speech' (babble audio) | 'thought' (silent, cloud style) | 'alert' (spiky star: someone has spotted YOU) |
//   'realize' (round, pale blue, rays: "oh!", a belief changes, a trick works; never alarm) | 'sign'
// opts.ttl: seconds. opts.voice: babble voice id (defaults to owner id). opts.toy: the toy id that said it (toy.js).
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
    voice: opts.voice ?? null, // who speaks from a point (a phone, a voice offstage); the harness names it
  };
  game.fx.bubbles.push(bubble);
  const payload = { owner, icons, kind, voice: opts.voice ?? ownerKey };
  if (opts.toy) { // a toy's (sim/mechanics/toy.js): cosmetic, and the behaviour goldens skip it
    payload.toy = opts.toy;
    bubble.toy = opts.toy;
  }
  game.events.emit('say', payload);
  return bubble;
}

// The burst kinds the renderer draws (render/effects.js); kind: one of them, or a string (the generic dot).
export const BURST_KINDS = ['puff', 'sparks', 'crumbs', 'paper', 'zzz', 'sweat', 'confetti', 'glitter'];
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
// kind: 'notice' (first sight, faint) | 'tattle' (a witness shouts) | 'caught' (the boss) | 'relay' (her shout
// reaching the authority: to = his id, a pulse runs along it) | 'order' (the authority sends you to your desk)
// via: { screen: {x, y}, lens: {x, y} } (tile units) when he saw you on a camera's screen: the line runs from his
// eyes to the screen, then from the camera's lens to you (play/rules.js; sim/mechanics/camera.js).
// to: 'player' or an NPC id. A new line replaces the one with the same from and to.
export function sightline(game, from, kind = 'notice', ttl = 0.8, via, to = 'player') {
  game.fx.lines = game.fx.lines.filter((l) => l.from !== from || l.to !== to);
  const line = { from, to, kind, age: 0, ttl };
  if (via) line.via = via;
  game.fx.lines.push(line);
}

// A sound you can see: rings spreading from (x, y) out to `radius` tiles (a noise's earshot), fading out over ttl
// (default: 1 s, longer for a wide earshot, so the rings visibly travel from the source). opts.color: a CSS colour
// (default the renderer's).
export function ripple(game, x, y, radius, opts = {}) {
  const list = game.fx.ripples ?? (game.fx.ripples = []);
  list.push({ x, y, radius, color: opts.color ?? null, age: 0, ttl: opts.ttl ?? Math.max(1, radius / 12) });
}

// A head turned to a noise: NPC `id` was looking along `from` (rad, his view direction) and turns to (x, y) (tiles).
// The renderer draws the swing, from the old direction to where he looks now, fading out over ttl.
export function turned(game, id, from, x, y, ttl = 1.2) {
  const list = game.fx.turns ?? (game.fx.turns = []);
  for (let i = list.length - 1; i >= 0; i--) if (list[i].id === id) list.splice(i, 1);
  list.push({ id, from, x, y, age: 0, ttl });
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
  if (fx.ripples?.length) {
    for (const r of fx.ripples) r.age += dt;
    fx.ripples = fx.ripples.filter((r) => r.age < r.ttl);
  }
  if (fx.turns?.length) {
    for (const r of fx.turns) r.age += dt;
    fx.turns = fx.turns.filter((r) => r.age < r.ttl);
  }
  if (fx.shake.t > 0) fx.shake.t = Math.max(0, fx.shake.t - dt);
  else fx.shake.amount = 0;
}
