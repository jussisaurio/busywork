// The Interview's cold-read shots (docs/COLD-READ.md): harness commands from the start of the day, and what each
// picture must tell a first-time player who has read only the card.
const SEAT = ['goto my_seat', 'sit']; // back to your desk for the call
const END = ['pretend until 3:34', 'pretend until 3:34', 'wait 5s']; // 3:30 stops a pretend; then the day ends
const KEV = ['pretend until 3:18', 'goto ring_kev', 'interact']; // ring Kev's phone while he is at the coffee
const ANSWERED = [...KEV, 'goto ring_kitchen', 'interact']; // then the kitchen phone: Lin is the one free
const BUSY = ['pretend until 3:20', 'goto ring_lin', 'interact']; // Lin's phone, while she is at her tea
const BOSS = ['pretend until 3:12', 'goto ring_boss', 'interact']; // the boss's phone, after Kev's charging stop
const UNPLUG = [...BOSS, 'goto lin_socket', 'interact'];
const RINGOUT = [...ANSWERED, 'pretend until 3:25', 'goto ring_boss', 'interact'];
const CALL = ['pretend until 3:30', 'wait 0.2s']; // to the 3:30 call (it stops one of the two)

export default [
  {
    name: 'start',
    cmds: ['wait 1.5s'],
    intent: "3:00: you at your desk (big red mug); the boss behind the glass of his office, top left, a bright window behind him, facing the open plan; Lin at the desk below it, the receiver of her teal desk phone at her ear, listening; the coiled cable of her phone running down to a wall socket beside her; Kev at the coffee machine in the kitchen, top right, by a small red wall phone; a switchboard in the nook above your desk, patch cables hanging, a dark red lamp over one jack.",
  },
  {
    name: 'lin-checks-the-clock',
    cmds: ['pretend until 3:01', 'wait 1.2s'],
    intent: 'Lin has put her receiver down and looks up at the wall clock (clock thought): she is waiting for a call, and keeps checking her line.',
  },
  {
    name: 'switchboard',
    cmds: ['goto switchboard'],
    intent: "The switchboard up close, lit because you can use it: a row of jacks, each under a card and a dark lamp in its line's colour (Lin's teal, the boss's blue, Kev's olive, the kitchen's red wall phone), patch cables with plugs hanging below, and a dark red lamp over the outside line's jack.",
  },
  {
    name: 'lin-at-her-tea',
    cmds: ['pretend until 3:09'],
    intent: "Lin has left her desk for a tea at the kitchen table; her teal phone sits on her empty desk. Kev ambles across the office towards her desk with his mobile.",
  },
  {
    name: 'kev-at-the-socket',
    cmds: ['pretend until 3:12', 'wait 1s'],
    intent: "Kev crouches at the wall socket beside Lin's empty desk, her phone's plug seated in it, and plugs his mobile's charger in below it (battery thought): her socket is his charging spot.",
  },
  {
    name: 'kev-phone-rings',
    cmds: [...KEV, 'wait 0.4s'],
    intent: "You plugged into Kev's jack: his lamp on the switchboard is lit olive, his olive desk phone rings in olive rings, and Kev, at the coffee machine, hears it and starts (!).",
  },
  {
    name: 'kev-on-hold',
    cmds: [...KEV, 'pretend until 3:23', 'wait 1s'],
    intent: 'Kev stands at his desk with the olive receiver at his ear, hold music coming out of it (notes), staring ahead.',
  },
  {
    name: 'lin-takes-the-kitchen-phone',
    cmds: [...ANSWERED, 'wait 3s'],
    intent: "Kev is on his way to his own ringing phone, so when the red kitchen wall phone rings (red rings round it), Lin, the one free person in earshot, gets up from her tea and answers it, hoping it is her interviewer (briefcase, ?).",
  },
  {
    name: 'boss-on-hold',
    cmds: [...BOSS, 'wait 3s'],
    intent: "You rang the boss's phone: he stands at his window with the blue receiver, his back to the room, happy with the hold music (notes); his sight cone points out of the window, not at the office.",
  },
  {
    name: 'cord-pulled',
    cmds: [...UNPLUG, 'goto my_seat'],
    intent: "You pulled the plug and walked off: Lin's coiled phone cable lies on the floor by her empty desk, its plug out, the wall socket beside it empty; the boss is still on hold at his window with his back to the room.",
  },
  {
    name: 'kev-plugs-it-back',
    cmds: ['pretend until 3:02', 'goto ring_boss', 'interact', 'goto lin_socket', 'wait until 3:06', 'interact', ...SEAT, 'pretend until 3:12', 'wait 0.4s'],
    intent: "Too early: Kev, come to charge his mobile at the socket, finds Lin's plug lying on the floor in his way (!) and jams it back into the wall with a spark, cross.",
  },
  {
    name: 'lin-hangs-up-on-her-own-phone',
    cmds: ['pretend until 3:01', 'goto ring_lin', 'interact', 'wait 2.6s'],
    intent: "You rang Lin's phone while she sits at it (its lamp lit teal on the switchboard): she picked up, got hold music, and slams the receiver down (angry).",
  },
  {
    name: 'boss-on-lins-phone',
    cmds: [...BUSY, 'wait 3.05s'],
    intent: "Lin is at her tea and her teal phone rings on her empty desk (teal rings), so the boss comes out of his office door to answer it (!).",
  },
  {
    name: 'the-call',
    cmds: [...CALL, 'wait 1.5s'],
    intent: "3:30: Lin's phone rings in red rings, the outside line (its red lamp lit on the switchboard); Lin answers at her desk, delighted (briefcase, smile).",
  },
  {
    name: 'the-call-answered',
    cmds: [...ANSWERED, ...SEAT, ...CALL, 'wait 0.5s'],
    intent: "3:30: Lin's empty desk phone rings red while Lin is on hold at the red kitchen wall phone; the boss, the one free person in earshot, starts (!) and gets up to answer it.",
  },
  {
    name: 'the-call-dead',
    cmds: [...UNPLUG, ...SEAT, ...CALL, 'wait 1.5s'],
    intent: "3:30: Lin sits at her silent phone, its coiled cable on the floor with the plug out of the wall, and wonders why her call is late (clock, ?).",
  },
  {
    name: 'the-call-busy',
    cmds: [...BUSY, ...SEAT, ...CALL, 'wait 1.5s'],
    intent: "3:30: the boss is still on Lin's phone at her desk with the hold music; Lin, back from tea, glares at him (his face, angry): her line is busy.",
  },
  {
    name: 'the-call-rings-out',
    cmds: [...RINGOUT, ...SEAT, ...CALL, 'wait 0.5s'],
    intent: "3:30: Lin's empty desk phone rings red; Lin is on hold at the kitchen phone; the boss, on hold at his window, turns to the ring (!) but stays with his tune (notes); Kev sits at his desk across the office: nobody comes.",
  },
  {
    name: 'end-answered',
    cmds: [...ANSWERED, ...SEAT, ...END],
    intent: "Win: at Lin's desk (her chair, plant, mug and nameplate) the boss holds her teal handset, puzzled (briefcase, ?); Lin comes back empty-handed from the kitchen, too late, cross; you smug.",
  },
  {
    name: 'end-busy',
    cmds: [...BUSY, ...SEAT, ...END],
    intent: "Win: at Lin's desk (her chair, plant, mug and nameplate) the boss is on her teal handset, blissful with the hold music (notes); Lin beside him, furious; you smug.",
  },
  {
    name: 'end-unplugged',
    cmds: [...UNPLUG, ...SEAT, ...END],
    intent: "Win: Lin waits at her dead phone at 3:31, its coiled cable on the floor, the plug out of the wall socket, wondering where her call is; you smug.",
  },
  {
    name: 'end-ringout',
    cmds: [...RINGOUT, ...SEAT, ...END],
    intent: "Win: Lin's desk phone rings red with nobody at it; the boss at his window and Lin at the kitchen wall phone are each on hold (notes); Kev sits at his desk, too far off; you smug.",
  },
  {
    name: 'end-fail',
    cmds: [...END],
    intent: "Lost: Lin sits at your desk (your nameplate, your red mug) on the phone, beaming: she got your job; her own desk stands empty behind; you stand by with your things in a box.",
  },
  {
    name: 'end-caught',
    cmds: ['pretend until 3:12', 'goto lin_socket pretend', 'interact', 'wait 5s'],
    intent: "Caught: you stand at the wall socket with Lin's plug in your fist; the boss points at you, angry.",
  },
  {
    name: 'end-blamed',
    cmds: [...ANSWERED, ...END],
    intent: "Lost: the call is gone, but you were away from your desk while it happened: the boss points at your empty chair (red mug) as you hurry in late.",
  },
];
