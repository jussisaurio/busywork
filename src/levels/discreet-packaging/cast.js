// Discreet Packaging's two people and their hooks (cast.js and behaviours.js in
// level 1 document the fields).
import { at, deg } from '../../config.js';
import { say } from '../../core/fx.js';

export const START = 15 * 60 + 20; // 3:20 PM: the day's start (level.day.start), what at() counts from
export const t = (time) => at(time, START);
const s = (time, entry) => ({ at: t(time), ...entry });

export const CAST = [
  {
    id: 'bob',
    icon: '@bob',
    color: '#2f3d5c', // navy uniform
    voice: 'bob',
    meetingSpot: 'bob_mail', // he comes over for the mail call like everyone else
    meetingArrive: 'bobAtMailCall',
    vision: { fov: deg(100), radius: 8 },
    glanceEvery: [9999, 9999], // eyes on the lobby and the screen, never anywhere else
    coneTint: [130, 170, 245],
    schedule: [
      s('3:20', { do: 'sit', spot: 'bob_desk', arrive: 'bobAtDesk' }),
      // The camera's sweep brings the plant's fronds into his picture (painters.js monitorState): his favourite bit.
      { at: t('3:21') + 0.5, do: 'say', icons: ['🪴', '😊'], kind: 'thought' },
    ],
  },
  {
    id: 'lin',
    icon: '@lin',
    color: '#2f8f8a', // teal cardigan
    voice: 'lin',
    meetingSpot: 'mail_call', // 4:00: she hands out the mail in your office
    meetingArrive: 'linAtMailCall',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [120, 220, 200],
    schedule: [
      s('3:20', { do: 'sit', spot: 'lin_desk' }),
      s('3:50', { do: 'visit', spot: 'pigeonholes', arrive: 'collectMail' }), // she fetches the mail
    ],
  },
];

const npc = (game, id) => game.npcs.find((n) => n.id === id);
// You, in your office for the mail call (not off hiding in the store room).
const youHere = (game) => {
  const p = game.player;
  const m = game.level.spots.mail_call;
  return p && Math.hypot(p.x - m.x, p.y - m.y) < 7;
};

// At the mail call, once Lin and Bob are both there, each box goes to the face on its label: Bob gets his (the brown
// one, or the pink one if you swapped the labels), and Lin turns to you with whatever is left.
function handOver(game, sim) {
  const w = game.world;
  const lin = npc(game, 'lin');
  const bob = npc(game, 'bob');
  if (!lin?._atMail || !bob?._atMail || lin._handed) return;
  lin._handed = true;
  sim.faceSpot(game, lin, 'bob_mail');
  sim.faceSpot(game, bob, 'mail_call');
  if (w.parcel === 'lin' && w.parcelFor === 'bob') {
    w.parcel = 'bob'; // he hugs it; the dull brown one is yours
    sim.speak(game, lin, [{ say: ['💝', '@bob'] }, { say: ['#brownbox', '@player'], after: 1.2 }]);
    sim.speak(game, bob, [{ say: ['🥹'], kind: 'thought' }]); // at once: the day's verdict comes 0.2 s later
    if (youHere(game)) say(game, 'player', ['😏'], { kind: 'thought', ttl: 2 }); // and you, smug, right beside him
  } else if (w.brown === 'lin') {
    w.brown = 'bob';
    sim.speak(game, bob, [{ say: ['🙂'], kind: 'thought' }]);
    if (w.mailEmpty) {
      sim.speak(game, lin, [{ say: ['📭', '@player'] }]); // nothing for you today (and a shrug: presentation.js)
      if (youHere(game)) say(game, 'player', ['🎵'], { kind: 'thought', ttl: 2 }); // you hum, all innocence
    }
  }
  game.events.emit('parcel:handed', {});
}

// At the mail call people stand (the meeting would sit them down).
function stand(npc) {
  npc.pose = 'stand';
  npc._atMail = true;
}

export const BEHAVIOURS = {
  // Lin at the pigeonholes, 3:50: she takes what is on the parcel shelf and reads the labels. Bob's box is always
  // there. With no pink box on the shelf she just takes Bob's: she never knew there was another.
  collectMail: {
    arrive(game, lin, sim) {
      if (lin._collected) return;
      lin._collected = true;
      const w = game.world;
      if (w.brown === 'shelf') w.brown = 'lin';
      if (w.parcel !== 'shelf') {
        w.mailEmpty = true;
        // Bob's box, as every day; nothing else, and she never knew there was. Crickets.
        sim.speak(game, lin, [{ say: ['#brownbox', '✔️'], kind: 'thought' }, { say: ['🦗'], kind: 'thought', after: 1.4 }]);
        game.events.emit('parcel:missing', {});
        return;
      }
      w.parcel = 'lin';
      sim.speak(game, lin, [{ say: ['💝', w.parcelFor === 'bob' ? '@bob' : '@player'], kind: 'thought' }]);
      game.events.emit('parcel:collected', { for: w.parcelFor });
    },
  },
  // Lin at the mail call: your parcel goes up over her head for the whole office to see; then the hand-over.
  linAtMailCall: {
    arrive(game, lin, sim) {
      stand(lin);
      const w = game.world;
      if (w.parcel === 'lin' && w.parcelFor !== 'bob') sim.speak(game, lin, [{ say: ['💝', '@player'] }]);
      handOver(game, sim);
    },
  },
  // Back at his counter after giving up on the camera: his screen is all leaf now, and he finds he rather likes it.
  bobAtDesk: {
    arrive(game, bob, sim) {
      if (!game.world.camReported || bob._fondLeaf) return;
      bob._fondLeaf = true;
      sim.speak(game, bob, [{ say: ['🪴', '😊'], kind: 'thought', after: 0.6 }]);
    },
  },
  bobAtMailCall: {
    arrive(game, bob, sim) {
      stand(bob);
      handOver(game, sim);
    },
  },
};
