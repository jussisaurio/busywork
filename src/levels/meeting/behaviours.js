// The meeting's behaviour hooks (level.behaviours): small level-only scripts the cast names (cast.js).
//   a schedule entry's `prelude: name`  (or a list of names) a leg walked before the entry's own, to the hook's `spot`,
//            while its `pending(npc)` holds. The plan is rebuilt once it stops holding. A prelude to the entry's own
//            spot replaces the entry's leg.
//   a schedule entry's `arrive: name`   run on reaching the entry's spot
//   a cast member's `meetingArrive: name`  run on sitting down at the meeting
// Each runs arrive(game, npc, sim), with sim the sim's helpers for hooks (src/sim/npcs.js HOOK_API):
//   holdFor(npc, s)   stand still at least s seconds
//   speak(game, npc, lines)  bubbles: [{ say: icons, kind?: 'speech', ttl?, after? }]
//   want(npc, item)   npc.wants = item: he knows it's his now, and daydreams about it until he has it
//   faceSpot(game, npc, spot)  turn to look at a spot
//   startHunt(game, npc)  start her hunt (level.hunts)
// State a hook keeps goes on the NPC (fields with a leading underscore; a new loop builds new NPCs).

export const BEHAVIOURS = {
  // Lin opens the fridge, even if her 3:04 entry starts while she's still walking there (both entries name this).
  checkFridge: {
    spot: 'fridge',
    pending: (npc) => !npc._fridgeChecked,
    arrive(game, npc, sim) {
      const w = game.world;
      npc._fridgeChecked = true;
      if (w.sandwich === 'fridge' || w.sandwich === 'lin') {
        w.sandwich = 'lin';
        sim.holdFor(npc, 0.6); // taking it out
        return;
      }
      sim.startHunt(game, npc); // 🥪❓ 😠, then the hunt (mechanics.js HUNTS)
    },
  },

  // The boss collects his jacket (and the keycard in it, if it's still there) on his way out for a smoke.
  fetchJacket: {
    spot: 'coat_rack',
    pending: (npc) => !npc.hasJacket,
    arrive(game, npc, sim) {
      const w = game.world;
      w.jacket = npc.id;
      npc.hasJacket = true;
      if (w.keycard === 'rack') w.keycard = npc.id;
      sim.holdFor(npc, 0.8);
      game.events.emit('boss:jacket', {});
    },
  },

  // The coffee pot holds one cup a day: whoever gets there first has it. Finding it empty, Kev knows someone has his cup.
  pourCoffee: {
    arrive(game, npc, sim) {
      const w = game.world;
      if (w.coffee === 'pot' && !npc.carry) {
        w.coffee = 'taken';
        npc.carry = 'coffee';
        sim.holdFor(npc, 1.0); // pouring
        game.events.emit('coffee:taken', { by: npc.id });
        return;
      }
      if (npc.carry) return;
      sim.want(npc, 'coffee');
      sim.speak(game, npc, [{ say: ['☕', '❓'], kind: 'thought', ttl: 1.2 }, { say: ['😩'], after: 1.2 }]);
      sim.holdFor(npc, 1.6); // staring at the empty pot
      game.events.emit('coffee:missing', { by: npc.id });
    },
  },

  // The boss takes his seat at the head of the table (once): no projector, a shrug. Otherwise he looks to where the
  // presenter stands.
  presenter: {
    arrive(game, npc, sim) {
      if (npc._presented) return;
      npc._presented = true;
      if (game.world.projector !== 'ok') {
        sim.speak(game, npc, [{ say: ['📽️', '💥', '🤷'] }]);
      } else {
        sim.faceSpot(game, npc, 'meeting_presenter');
        sim.speak(game, npc, [{ say: ['📊', '👀'] }]);
      }
    },
  },
};
