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
// State a hook keeps goes on the NPC (fields with a leading underscore; a new loop builds new NPCs). `state` lists
// those fields with their start values: every NPC gets them when it is built.

// The boss looks in on the meeting room on his way past (his 3:12 and 3:22 walks: cast.js), once per walk. A dead
// projector: he sees the coffee on it, and the cup it came from is somewhere in this office. He knows (items.js
// mug: the cup in your hand is proof now) and goes looking for it (mechanics.js HUNTS: 📽️💥 … ☕❓).
const peek = (flag) => ({
  spot: 'meeting_door',
  state: { _knows: false, [flag]: false },
  pending: (npc) => !npc._knows && !npc[flag],
  arrive(game, npc, sim) {
    npc[flag] = true;
    if (game.world.projector !== 'broken') return;
    npc._knows = true;
    sim.startHunt(game, npc);
  },
});

export const BEHAVIOURS = {
  peekOut: peek('_peekOut'), // on his way to the restroom
  peekBack: peek('_peekBack'), // on his way back

  // Lin opens the fridge, even if her 3:04 entry starts while she's still walking there (both entries name this).
  checkFridge: {
    spot: 'fridge',
    state: { _fridgeChecked: false },
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
    state: { _jacket: false },
    pending: (npc) => !npc._jacket,
    arrive(game, npc, sim) {
      const w = game.world;
      w.jacket = npc.id; // he's wearing it now (poses.js POSES)
      npc._jacket = true;
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

  // The boss takes his seat at the head of the table (once). A dead projector: no slides, no meeting. He faces it,
  // a hand over his face, throws his hands up (no slides) and waves everyone out (the end card: his despair over the
  // smoking box). Not a point: that is blame, and nobody here is blamed (looks.js; Jussi's playtest, 2026-11-18).
  // _offAt: when he gave up on it (loopTime), for the poses. Otherwise he looks to the presenter.
  presenter: {
    state: { _presented: false, _offAt: null },
    arrive(game, npc, sim) {
      if (npc._presented) return;
      npc._presented = true;
      if (game.world.projector !== 'ok') {
        sim.faceSpot(game, npc, 'projector');
        npc._offAt = game.loopTime;
        sim.speak(game, npc, [{ say: ['📽️', '💥'] }, { say: ['📊', '❌'], after: 1.3 }, { say: ['👋', '🚪'], after: 2.6 }]);
        game.events.emit('meeting:calledOff', {});
      } else {
        sim.faceSpot(game, npc, 'meeting_presenter');
        sim.speak(game, npc, [{ say: ['📊', '👀'] }]);
      }
    },
  },
};
