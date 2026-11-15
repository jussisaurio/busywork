// Discreet Packaging's two people and their hooks (cast.js and behaviours.js in
// level 1 document the fields).
import { at, deg } from '../../config.js';

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
      s('3:20', { do: 'sit', spot: 'bob_desk' }),
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

// At the mail call, a parcel with Bob's face goes to Bob, once both of them are there.
function handOver(game, sim) {
  const w = game.world;
  const lin = npc(game, 'lin');
  const bob = npc(game, 'bob');
  if (!lin?._atMail || !bob?._atMail || w.parcel !== 'lin' || w.parcelFor !== 'bob') return;
  w.parcel = 'bob';
  sim.faceSpot(game, lin, 'bob_mail');
  sim.faceSpot(game, bob, 'mail_call');
  sim.speak(game, lin, [{ say: ['💝', '@bob'] }]);
  sim.speak(game, bob, [{ say: ['🥹'], kind: 'thought' }]); // at once: the day's verdict comes 0.2 s later
  game.events.emit('parcel:handed', {});
}

// At the mail call people stand (the meeting would sit them down).
function stand(npc) {
  npc.pose = 'stand';
  npc._atMail = true;
}

export const BEHAVIOURS = {
  // Lin at the pigeonholes, 3:50: she takes whatever is on the parcel shelf and reads the label. Nothing there: she
  // shrugs.
  collectMail: {
    arrive(game, lin, sim) {
      if (lin._collected) return;
      lin._collected = true;
      const w = game.world;
      if (w.parcel !== 'shelf') {
        w.mailEmpty = true; // her shrug (presentation.js POSES)
        sim.speak(game, lin, [{ say: ['📭', '❓'], kind: 'thought' }]);
        game.events.emit('parcel:missing', {});
        return;
      }
      w.parcel = 'lin';
      sim.speak(game, lin, [{ say: ['💝', w.parcelFor === 'bob' ? '@bob' : '@player'], kind: 'thought' }]);
      game.events.emit('parcel:collected', { for: w.parcelFor });
    },
  },
  // Lin at the mail call: your parcel goes up over her head for the whole office to see; Bob's goes to Bob. No
  // parcel: no mail today, she shrugs.
  linAtMailCall: {
    arrive(game, lin, sim) {
      stand(lin);
      const w = game.world;
      if (w.parcel === 'lin' && w.parcelFor !== 'bob') sim.speak(game, lin, [{ say: ['💝', '@player'] }]);
      if (w.mailEmpty) sim.speak(game, lin, [{ say: ['📭', '🤷'] }]);
      handOver(game, sim);
    },
  },
  bobAtMailCall: {
    arrive(game, bob, sim) {
      stand(bob);
      handOver(game, sim);
    },
  },
};
