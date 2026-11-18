// The office's map tiles (core/map.js legend entries) that every office level draws the same way. A level picks its
// own letter for each: `legend: { P: OWN_DESK, F: FRIDGE, ... }`. A level that differs spreads over it, e.g.
// `{ ...ENTRANCE, solid: false }` (a door you walk through) or `{ ...RESTROOM, interactable: 'restroom' }`.
const tile = (def) => Object.freeze(def);

export const OWN_DESK = tile({ kind: 'own_desk', solid: true, opaque: false, interactable: 'own_desk' });
export const FRIDGE = tile({ kind: 'fridge', solid: true, opaque: true, draw: 'refrigerator' });
export const COAT_RACK = tile({ kind: 'coat_rack', solid: true, opaque: false });
// A coffee machine you can only look at; COFFEE_POT is the one that pours (office/coffee.js pourCoffee).
export const COFFEE_MACHINE = tile({ kind: 'coffee_machine', solid: true, opaque: false });
export const COFFEE_POT = tile({ ...COFFEE_MACHINE, interactable: 'coffee_machine' });
// The glass entrance onto the lobby: solid to you, open to NPCs.
export const ENTRANCE = tile({ kind: 'entrance', solid: true, opaque: false, npcPassable: true });
export const RESTROOM = tile({ kind: 'restroom', solid: true, opaque: true });
export const ELEVATOR = tile({ kind: 'elevator', solid: true, opaque: true });
