// Hold Music's end cards (WIP placeholder: floor only; drawn scenes next).
import { TAB, floorCarpet } from '../../render/tableau.js';

const plain = (ctx) => floorCarpet(ctx, TAB.x, TAB.y, TAB.w, TAB.h);

export const END_SCENES = {
  kindOf: (o) => (o?.result === 'win' ? o.routes[0] : o?.result ?? 'fail'),
  scenes: {
    answered: { win: true, icons: ['@boss', '💼', '🤷'], draw: plain },
    busy: { win: true, icons: ['@boss', '🎵', '😌'], draw: plain },
    unplugged: { win: true, icons: ['@lin', '🕞', '❓'], draw: plain },
    ringout: { win: true, icons: ['🔔', '🔔', '🤷'], draw: plain },
    fail: { win: false, icons: ['@lin', '💼', '😊'], draw: plain },
    caught: { win: false, icons: ['@boss', '👉', '@player'], draw: plain },
    blamed: { win: false, icons: ['@boss', '👉', '🪑'], draw: plain },
  },
};
