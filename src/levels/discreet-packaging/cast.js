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
    meetingSpot: 'bob_desk', // the mail call is in your office; his box reaches him at his counter
    meetingArrive: 'bobAtDesk',
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
    meetingSpot: 'mail_call', // 4:00: she hands out the mail in your office (collectMail picks where she goes)
    meetingArrive: 'linAtMeeting',
    vision: { fov: deg(90), radius: 7 },
    coneTint: [120, 220, 200],
    schedule: [
      s('3:20', { do: 'sit', spot: 'lin_desk' }),
      s('3:50', { do: 'visit', spot: 'pigeonholes', arrive: 'collectMail' }), // she fetches the mail
    ],
  },
];

const npc = (game, id) => game.npcs.find((n) => n.id === id);
const near = (game, n, spot, r) => {
  const p = game.level.spots[spot];
  return n && Math.hypot(n.x - (p.x + 0.5), n.y - (p.y + 0.5)) <= r;
};

// At the pigeonholes Lin reads the labels and hands Bob the box with his face on it there and then, over his
// counter: his brown one, or the pink one if you swapped the labels. If he is off at the camera she waits there
// with it until he sits back down. Then she takes whatever is left for you to your office for 4:00, or, with nothing
// for you, goes back to her desk.
function giveBob(game, sim) {
  const w = game.world;
  const lin = npc(game, 'lin');
  const bob = npc(game, 'bob');
  if (!lin?._collected || lin._gaveBob) return;
  if (!near(game, lin, 'pigeonholes', 1.2) || !near(game, bob, 'bob_desk', 0.8)) return;
  lin._gaveBob = true;
  sim.faceSpot(game, lin, 'bob_desk');
  sim.faceSpot(game, bob, 'pigeonholes');
  if (w.parcel === 'lin' && w.parcelFor === 'bob') {
    w.parcel = 'bob'; // he hugs it; the dull brown one is yours
    sim.speak(game, lin, [{ say: ['💝', '@bob'] }]);
    sim.speak(game, bob, [{ say: ['🥹'], kind: 'thought', after: 0.5 }]);
  } else if (w.brown === 'lin') {
    w.brown = 'bob';
    sim.speak(game, bob, [{ say: ['🙂'], kind: 'thought', after: 0.4 }]);
  }
  game.events.emit('parcel:handed', {});
  const forYou = w.parcel === 'lin' || w.brown === 'lin';
  lin.meetingSpot = forYou ? 'mail_call' : 'lin_desk';
  if (lin.override === game.level.meeting.override) lin._ovSeq++; // waiting for him at 3:56: off she goes now
}

// Standing where the meeting would sit them down.
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
      lin.meetingSpot = 'pigeonholes'; // until Bob has his box
      const w = game.world;
      if (w.brown === 'shelf') w.brown = 'lin';
      if (w.parcel !== 'shelf') {
        w.mailEmpty = true;
        game.events.emit('parcel:missing', {});
      } else {
        w.parcel = 'lin';
        sim.speak(game, lin, [{ say: ['💝', w.parcelFor === 'bob' ? '@bob' : '@player'], kind: 'thought' }]);
        game.events.emit('parcel:collected', { for: w.parcelFor });
      }
      giveBob(game, sim);
    },
  },
  // Bob back at his counter (after the camera, or at 3:56): if Lin is waiting with his box, he gets it now.
  bobAtDesk: {
    arrive(game, bob, sim) {
      giveBob(game, sim);
    },
  },
  // Lin at 3:56: still waiting at the pigeonholes for Bob, at her desk with nothing for you, or in your office,
  // where your parcel goes up over her head for everyone to see (or Bob's brown box, your face on it, comes to you).
  linAtMeeting: {
    arrive(game, lin, sim) {
      const w = game.world;
      if (lin.meetingSpot === 'lin_desk') return;
      stand(lin);
      if (lin.meetingSpot === 'pigeonholes') return giveBob(game, sim);
      if (w.parcel === 'lin') sim.speak(game, lin, [{ say: ['💝', '@player'] }]);
      else if (w.brown === 'lin') sim.speak(game, lin, [{ say: ['#brownbox', '@player'] }]);
    },
  },
};
