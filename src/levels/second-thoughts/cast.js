// Second Thoughts' three people and their hooks (level 1's cast.js and behaviours.js document the fields).
// The boss never leaves his desk on his own: only the dark (or the sound of you retching) gets him up. Lin makes her
// afternoon coffee at 3:10: the old machine makes the lights flicker and the fuse holds, unless you poured the water
// jug down its back onto its socket first, and then it shorts and takes the fuse with it. Kev unplugs it and resets
// fuses: lures in index.js.
import { at, deg } from '../../config.js';
import { burst, shake } from '../../core/fx.js';

export const START = 15 * 60; // 3:00 PM
const s = (time, entry) => ({ at: at(time, START), ...entry });

export const CAST = [
  {
    id: 'boss',
    icon: '@boss',
    color: '#2b3a55', // navy suit
    voice: 'boss',
    meetingSpot: 'boss_desk',
    vision: { fov: deg(150), radius: 8 }, // nothing on his desk escapes him in the light
    coneTint: [255, 160, 82],
    schedule: [
      s('3:00', { do: 'sit', spot: 'boss_desk' }), // facing his tray, all afternoon
    ],
  },
  {
    id: 'lin',
    icon: '@lin',
    color: '#2f8f83', // teal cardigan
    voice: 'lin',
    meetingSpot: 'lin_desk',
    vision: { fov: deg(90), radius: 6 },
    coneTint: [120, 220, 205],
    schedule: [
      s('3:00', { do: 'sit', spot: 'lin_desk' }),
      s('3:05', { do: 'visit', spot: 'coffee_machine', arrive: 'brew' }), // her afternoon coffee: there about 3:10
      s('3:23', { do: 'visit', spot: 'coffee_machine', arrive: 'pour' }), // pours herself a cup if it brewed
      s('3:24', { do: 'visit', spot: 'kitchen_table' }), // and drinks it at the kitchen table
      s('3:31', { do: 'sit', spot: 'lin_desk' }),
    ],
  },
  {
    id: 'kev',
    icon: '@kev',
    color: '#5f6b3a', // olive hoodie
    voice: 'kev',
    meetingSpot: 'kev_desk',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [214, 230, 140],
    schedule: [
      s('3:00', { do: 'sit', spot: 'kev_desk' }),
    ],
  },
];

export const BEHAVIOURS = {
  // Lin switches on the coffee machine (about 3:10). An old machine on an old fuse: the lights flicker, she 😳, Kev
  // glances down the hall at the fuse box, and the fuse holds; it brews (index.js). If you poured the jug down its
  // back, the wet socket shorts it: sparks and smoke, and the short runs down the wiring to the fuse box (index.js
  // tick). If the power is already out, nothing happens.
  brew: {
    arrive(game, npc, sim) {
      if (npc._brewed) return;
      npc._brewed = true;
      const w = game.world;
      if (w.fuse !== 'on') { // no power already
        w.coffee = 'cold';
        sim.speak(game, npc, [{ say: ['❓'], kind: 'thought', ttl: 1.4 }]);
        return;
      }
      if (w.rigged) {
        w.coffee = 'shorted';
        w.shortAt = game.loopTime;
        burst(game, 'sparks', 21.5, 1.6, 28, { speed: 3.6, ttl: 1.1 });
        burst(game, 'puff', 21.5, 1.4, 10, { speed: 0.6, ttl: 1.8 });
        shake(game, 0.12, 0.3);
        game.events.emit('coffee:shorted', {});
        sim.speak(game, npc, [{ say: ['😳'], after: 0.8, ttl: 1.6 }]); // after the sparks: her bubble would hide them
        return;
      }
      w.coffee = 'brewing';
      w.brewAt = game.clock.minute;
      w.flickerAt = game.loopTime;
      game.events.emit('coffee:flicker', {});
      sim.speak(game, npc, [{ say: ['😳'], after: 0.3, ttl: 1.4 }]);
      const kev = game.npcs.find((n) => n.id === 'kev');
      if (kev?.active && !kev.override) {
        sim.lookAt(game, kev, 'fuse_box', 2.0);
        sim.speak(game, kev, [{ say: ['❓'], kind: 'thought', after: 0.3, ttl: 1.3 }]);
      }
    },
  },
  // 3:23: if it brewed she pours a cup and carries it off. Shorted, there is nothing to pour.
  pour: {
    arrive(game, npc, sim) {
      const w = game.world;
      if (w.coffee === 'brewed' && w.fuse === 'on') npc.carry = 'coffee';
      else if (w.coffee === 'shorted') sim.speak(game, npc, [{ say: ['😞'], kind: 'thought', ttl: 1.4 }]);
    },
  },
};
