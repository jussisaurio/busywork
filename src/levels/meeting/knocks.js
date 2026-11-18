// A fist on a door, defined once: the restroom door and the fire door, whoever's fist, in the day and on the end
// card. Three strengths, each its own name (a "knock" is only ever the polite one):
//   KNOCK  knuckles, politely: ✊🚪, two thuds, a small shake
//   BANG   a fist, cross: 😠🚪🪪 (only the fire door has a reader to be cross about), three thuds
//   POUND  both fists: 👊👊🚪, four thuds, the door shuddering
// Fields:
//   say    the bubble's icons (a line may add a feeling after them: the boss at the restroom, 👊👊🚪😤)
//   sound  the sounds.js spec, less its spot (sounds.js puts it at the door)
//   shake  [amount, seconds]: the screen, for the fire door, which is the boss's to fight (mechanics.js DOORS)
// Whoever does it holds the fists pose (render/characters.js 'bang'): FISTS, for a toy press (toys.js) and for the
// locked-out boss (poses.js). The end card's rhythm of it is end-set.js bangingOnTheDoor.
export const KNOCK = { say: ['✊', '🚪'], sound: { sfx: 'bang', opts: { hits: 2 } }, shake: [0.05, 0.15] };
export const BANG = { say: ['😠', '🚪', '🪪'], sound: { sfx: 'bang' }, shake: [0.12, 0.25] };
export const POUND = { say: ['👊', '👊', '🚪'], sound: { sfx: 'bang', opts: { hits: 4 } }, shake: [0.2, 0.32] };
export const FISTS = 'bang';

// A toy press at a door with one of these (toys.js knock_*, pound): your fists on it for `secs`, facing it, and the
// bubble (`say`: what you say, or what answers through the door). Its thuds are sounds.js's (toy:<id>), as anyone's.
export const fistsOnTheDoor = (secs, say) => ({ say, pose: { arms: FISTS, face: true, for: secs } });
