// The Interview's cold-read shots (docs/COLD-READ.md): harness commands from the start of the day, and what each
// picture must tell a first-time player who has read only the card.
const SEAT = ['goto my_seat', 'sit']; // back to your desk for the call
const END = ['pretend until 3:34', 'pretend until 3:34', 'wait 5s']; // 3:30 stops a pretend; then the day ends
const KEV = ['pretend until 3:18', 'goto ring_kev', 'interact']; // ring Kev's phone while he is at the coffee
const ANSWERED = [...KEV, 'goto ring_kitchen', 'interact']; // then the kitchen phone: Lin is the one free
const BUSY = ['pretend until 3:20', 'goto ring_lin', 'interact']; // Lin's phone, while she is at her tea
const BOSS = ['pretend until 3:14', 'goto ring_boss', 'interact']; // the boss's phone, as Kev's charging stop ends
const UNPLUG = [...BOSS, 'goto lin_socket', 'interact'];
const RINGOUT = [...ANSWERED, 'pretend until 3:25', 'goto ring_boss', 'interact'];
const CALL = ['pretend until 3:30', 'wait 0.2s']; // to the 3:30 call (it stops one of the two)

export default [
  {
    name: 'start',
    cmds: ['wait 1.5s'],
    intent: "3:00: you at your desk (big red mug); the boss behind the glass of his office, top left, in a high-backed chair, a bright window behind him, facing the open plan; Lin at the desk below it, the receiver of her teal desk phone at her ear, a teal wavy tone line beside her head: she is listening on the phone; the coiled cable of her phone running down to a wall socket beside her; Kev at the coffee machine in the kitchen, top right, by a small red wall phone; a switchboard in the nook above your desk, patch cables hanging, a dark red lamp over one jack.",
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
    cmds: ['pretend until 3:08'],
    intent: "Lin has left her desk for a tea at the kitchen table; her teal phone sits on her empty desk. Kev ambles across the office towards her desk, his mobile held out in front of him, big, its screen lit with a red low-battery sliver.",
  },
  {
    name: 'kev-at-the-socket',
    cmds: ['pretend until 3:11', 'wait 1s'],
    intent: "Kev stands at the wall socket beside Lin's empty desk, scrolling on his mobile; a white charger cable runs from his mobile into the socket's bottom outlet, under her phone's black power adapter in the top one: her socket is his charging spot. (His own wall socket, by his desk on the far right, is taped off with a yellow-and-black cross and sparks.)",
  },
  {
    name: 'kev-phone-rings',
    cmds: [...KEV, 'wait 0.4s'],
    intent: "You plugged into Kev's jack: the patch plug is seated in it and his lamp on the switchboard is lit olive; his olive desk phone rings, its handset hopping, an olive burst on it and olive rings spreading out to its earshot, and Kev, at the coffee machine, hears it and starts (his olive handset, !).",
  },
  {
    name: 'kev-on-hold',
    cmds: [...KEV, 'pretend until 3:24', 'wait 1s'],
    intent: 'Kev stands at his desk with the olive receiver at his ear, white talk marks pouring out of it (Gary talking golf at him: a golf flag, then glum), no rings: stuck on it.',
  },
  {
    name: 'lin-takes-the-kitchen-phone',
    cmds: [...ANSWERED, 'wait 0.8s'],
    intent: "Kev is walking off to his own ringing olive phone, so when the red kitchen wall phone rings (a red burst on it, red rings spreading out), Lin, the one free person in earshot, gets up from her tea to answer it (the red handset, !).",
  },
  {
    name: 'boss-on-hold',
    cmds: [...BOSS, 'wait 3s'],
    intent: "You rang the boss's phone: he stands at his window with the blue receiver, his back to the room, laughing with his golf buddy (golf flag, white talk marks pouring from the receiver); his empty high-backed chair has turned to the window too; his sight cone points out of the window, not at the office.",
  },
  {
    name: 'cord-pulled',
    cmds: [...UNPLUG, 'goto my_seat'],
    intent: "You pulled the plug and walked off: Lin's black phone adapter lies on the floor well clear of the wall, big, its brass prongs bare; the socket's top outlet shows two dark holes; Lin's lamp on the switchboard has gone black; the boss is still on the phone with Gary at his window, his back to the room.",
  },
  {
    name: 'kev-plugs-it-back',
    cmds: ['pretend until 3:02', 'goto ring_boss', 'interact', 'goto lin_socket', 'wait until 3:06', 'interact', ...SEAT, 'pretend until 3:09', 'wait until 3:10', 'wait 0.7s'],
    intent: "Too early: Kev, come to charge his mobile at the socket, has picked Lin's loose adapter up off the floor and holds it up at arm's length towards her empty chair, cross (angry), its cable hanging down to the coil; the socket's top outlet is empty. (A moment later he jams it back in with a spark.)",
  },
  {
    name: 'lin-hangs-up-on-her-own-phone',
    cmds: ['pretend until 3:01', 'goto ring_lin', 'interact', 'wait 3.1s'],
    intent: "You rang Lin's phone while she sits at it: she picked up, Gary asked for the boss (golf flag, the boss's face), and she has just slammed the receiver down: it rattles on the cradle and she is angry.",
  },
  {
    name: 'boss-on-lins-phone',
    cmds: [...BUSY, 'wait 3.05s'],
    intent: "Lin is at her tea and her teal phone rings on her empty desk (a teal burst on it and teal rings spreading out, its handset hopping), so the boss comes out of his office door to answer it (Lin's teal handset, !).",
  },
  {
    name: 'the-call',
    cmds: [...CALL, 'wait 1.5s'],
    intent: "3:30: Lin's phone rings, red rings spreading from it: the outside line (its red lamp lit on the switchboard); Lin answers at her desk, delighted (briefcase, smile).",
  },
  {
    name: 'the-call-answered',
    cmds: [...ANSWERED, ...SEAT, ...CALL, 'wait 0.5s'],
    intent: "3:30: Lin's empty desk phone rings, red rings spreading from it, its teal handset hopping; Lin is on hold for HR at the red kitchen wall phone (white notes); the boss, the one free person in earshot, starts (Lin's teal handset, !) and gets up to answer it.",
  },
  {
    name: 'the-call-dead',
    cmds: [...UNPLUG, ...SEAT, ...CALL, 'wait 1.5s'],
    intent: "3:30: Lin sits at her silent phone, its coiled cable on the floor with its adapter out of the wall, and wonders why her call is late (clock, ?).",
  },
  {
    name: 'the-call-busy',
    cmds: [...BUSY, ...SEAT, ...CALL, 'wait 1.5s'],
    intent: "3:30: the boss is still on Lin's phone at her desk, laughing with Gary, white talk marks pouring from the receiver; Lin, back from tea with her notes, has turned to him: her teal handset, his face, angry: her line is busy.",
  },
  {
    name: 'the-call-rings-out',
    cmds: [...RINGOUT, ...SEAT, ...CALL, 'wait 0.5s'],
    intent: "3:30: Lin's empty desk phone rings red; Lin is on hold for HR at the kitchen phone (white notes); the boss, on the phone with Gary at his window with his back to the room (white talk marks), holds up a hand at the ring (bell, hand: not now) and talks on; Kev sits at his desk across the office, far off: nobody comes.",
  },
  {
    name: 'end-answered',
    cmds: [...ANSWERED, ...SEAT, ...END],
    intent: "Win: at Lin's desk (her chair, plant, mug and nameplate) the boss holds her teal handset, puzzled (briefcase, ?); Lin comes back empty-handed from the kitchen, too late, cross; you smug.",
  },
  {
    name: 'end-busy',
    cmds: [...BUSY, ...SEAT, ...END],
    intent: "Win: at Lin's desk (her chair, plant, mug and nameplate) the boss is on her teal handset, roaring with laughter at his golf buddy (white talk marks); Lin beside him, furious; you smug.",
  },
  {
    name: 'end-unplugged',
    cmds: [...UNPLUG, ...SEAT, ...END],
    intent: "Win: Lin waits at her dead phone at 3:31, its coiled cable on the floor, its adapter out of the wall socket, wondering where her call is; you smug.",
  },
  {
    name: 'end-ringout',
    cmds: [...RINGOUT, ...SEAT, ...END],
    intent: "Win: front and centre, Lin's desk phone rings red and her teal chair stands empty; at the back the boss on the phone at his window (white talk marks) and Lin on hold at the kitchen wall phone (white notes); you smug. Icons: bell, empty chair.",
  },
  {
    name: 'end-fail',
    cmds: [...END],
    intent: "Lost: Lin sits at your desk on the phone, beaming, your big nameplate and big red mug at her elbows: she got your job; her own desk stands empty behind; you stand beside her holding a cardboard box at your chest, your plant sticking out of it.",
  },
  {
    name: 'end-caught',
    cmds: ['pretend until 3:12', 'goto lin_socket pretend', 'interact', 'wait 5s'],
    intent: "Caught: you stand at the wall socket with Lin's phone adapter in your fist; the boss points at you, angry.",
  },
  {
    name: 'end-blamed',
    cmds: [...ANSWERED, ...END],
    intent: "Lost: the call is gone, but you were away from your desk while it happened: the boss points at your empty chair (red mug) as you hurry in late.",
  },
];
