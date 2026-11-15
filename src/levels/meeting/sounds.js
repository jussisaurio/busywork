// What level 1's things sound like. audio/audio.js plays these; the recipes are in audio/sfx.js.
//
// A sound spec: { sfx, spot | who, opts, when, rearm }
//   sfx    a recipe name in sfx.js, or a shared deduped sound: 'crickets', 'elevator'
//   spot   play it at this level spot; who: at this entity ('player' or an NPC id); neither: no position
//   opts   extra recipe options ({ gain } replaces the distance gain)
//   when   (payload) => bool: play only when it is true
//   rearm  { repeatName: seconds }: restart that repeat's countdown (see repeats)
//
//   actions.start / actions.done  action type -> spec, on action:start / action:done
//   events      the level's own events: event name -> spec
//   signs       a sign say's icon -> spec (a say that names its own sfx wins)
//   contraband  witness id -> spec for taking their thing back (default: a grumble at their pitch)
//   drops       item type -> what it sounds like dropped (sfx.js drop: 'card', 'soft', 'mug'; else a thud)
//   repeats     name -> { while(world), every: [min, max] seconds, ...spec }: a sound every so often
//   murmur      { spot }: where the meeting murmurs from when everyone gathers (meeting:gather)
//   elevator    { spot, radius }: NPCs leaving or arriving this near the spot ding instead of a door
export const SOUNDS = {
  actions: {
    start: {
      brew_coffee: { sfx: 'gurgle', spot: 'coffee' },
      spill_coffee: { sfx: 'pour', spot: 'projector' },
      take_sandwich: { sfx: 'fridgeOpen', spot: 'fridge' },
      take_keycard: { sfx: 'rustle', spot: 'coat_rack', opts: { gain: 0.6 } },
    },
    done: {
      brew_coffee: { sfx: 'machineBeep', spot: 'coffee' },
    },
  },
  events: {
    'boss:suspicious': { sfx: 'tension', who: 'boss' },
    'boss:workAssigned': { sfx: 'workAssigned' },
    'projector:broken': { sfx: 'splashZap', spot: 'projector' },
    'kev:alerted': { sfx: 'clank', who: 'kev' },
    'projector:fixing': { sfx: 'clank', spot: 'projector', opts: { soft: true }, rearm: { repair: 0.9 } },
    'projector:fixed': { sfx: 'fixed', spot: 'projector' },
    'keycard:taken': { sfx: 'jingle', who: 'player' },
    'sandwich:taken': { sfx: 'fridgeClose', spot: 'fridge' },
    'sandwich:eaten': { sfx: 'munch', who: 'player' },
    'sandwich:returned': { sfx: 'swish', who: 'player' },
    'coffee:kevTook': { sfx: 'slurp', who: 'kev' }, // 🤤☕ … 😌 a cup left out: Kev's at last
    'coffee:taken': { sfx: 'machineBeep', spot: 'coffee', when: (p) => !!(p?.by && p.by !== 'player') }, // someone else got the last cup
    'sandwich:missing': { sfx: 'fridgeOpen', spot: 'fridge', opts: { short: true } },
    'boss:jacket': { sfx: 'rustle', who: 'boss' },
    'boss:badge': { sfx: 'machineBeep', spot: 'door_out' }, // back from his smoke, card to the reader
    // boss:lockedOut is silent on purpose: it happens at the street gate, out of earshot (clocks.js).
    'kev:left': { sfx: 'elevator' },
  },
  // The failed meeting's 🦗 sign gets real crickets.
  signs: { '🦗': { sfx: 'crickets' } },
  drops: { keycard: 'card', sandwich: 'soft', coffee: 'mug' },
  repeats: {
    // Kev's repair: a soft clank every so often.
    repair: { while: (world) => world.projector === 'fixing', every: [1.1, 2.0], sfx: 'clank', spot: 'projector', opts: { soft: true, gain: 0.7 } },
  },
  murmur: { spot: 'projector' },
  elevator: { spot: 'elevator', radius: 2.5 },
};
