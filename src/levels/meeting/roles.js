// Who plays which part in the office rules (level.roles; play/rules.js). Owners and contraband are item flags
// (items.js). Every cast member who is not the authority is a witness: they shout and point at what they see,
// and the authority hears it now, or is told once he is back within earshot.
export const ROLES = {
  // Whoever's sighting means caught. Owns the suspicion meter (game.suspicion[id]) and assigns work.
  //   offDuty   his overrides during which he enforces nothing (suspicion, contraband, hearing shouts)
  //   helpless  his overrides during which he can't act even on a sneaky action he sees (locked out on the balcony)
  //   deafIn    the zone where he can't hear a witness shout (the lobby and the balcony, outside)
  //   tattle    what he does on a tattle he hears: 'caught'. Told you took his keycard (or wrecked the projector),
  //             he takes the card back and you're done (clocks.js listen), not sent to type for twenty minutes.
  //   idleOkIn  the smokers' balcony: standing about is what it's for (balcony.js). He offers you a cigarette.
  // grateful: let back in through the fire door, he hugs you (clocks.js) and has eyes for nothing else.
  authority: { id: 'boss', offDuty: ['lockedOut', 'meeting', 'grateful'], helpless: ['lockedOut', 'grateful'], deafIn: 'outside', idleOkIn: 'balcony', tattle: 'caught' },
  // A mark on the player (a player field) that lasts the loop and that pretending doesn't hide. The witness `by`
  // reads it as guilt while in override `while` (Lin hunting her sandwich sees the mustard); telling on you sets
  // world[knows] (her hunt is over).
  evidence: { by: 'lin', while: 'hunting', mark: 'smeared', knows: 'linKnows', icon: '🥪' },
  // While the investigator `by` is in one of the `while` overrides (Kev going to or fixing his broken projector),
  // he blames whoever he sees in `zone`, or within `radius` (default rules.js SCENE_RADIUS) of `door` unless busy.
  // Once per breakage: `fresh(world)` holding makes the next breakage a fresh scene.
  scene: {
    by: 'kev',
    while: ['alerted', 'fixing'],
    zone: 'meeting_room',
    door: { x: 14.5, y: 6.5 },
    fresh: (w) => w.projector === 'ok',
    icon: '📽️',
  },
  // His glass office: if he finds you in it, he shows you out (👉 you 🚪), keycard back on its hook if you hold it.
  // Empty while he is in the restroom: that is when the coat rack is yours.
  private: [{ zone: 'boss_office', owner: 'boss' }],
};
