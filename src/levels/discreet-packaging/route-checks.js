// Discreet Packaging's route checks for tools/routes.mjs (format:
// src/levels/meeting/route-checks.js).
const UNPLUG = ['goto socket pretend', 'interact'];
const POKE = ['goto broom_stand', 'interact', 'goto camera pretend', 'interact'];
export default [
  { name: 'do nothing → Lin holds up the pink box at the mail call', expect: { result: 'fail' }, cmds: ['wait until 4:00'] },
  {
    name: 'do nothing, out of the office at 4:00 → she holds it up over your empty chair (blamed)',
    expect: { result: 'blamed' },
    cmds: ['goto lobby pretend', 'pretend until 4:00'],
  },
  {
    name: 'take the parcel on camera → caught on Bob\'s monitor',
    expect: { result: 'caught' },
    cmds: ['goto pigeonholes pretend', 'interact', 'wait until 4:00'],
  },
  {
    name: 'pull the plug, take the parcel, drawer → win (hidden)',
    expect: { result: 'win', routes: ['hidden'] },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'goto own_desk pretend', 'interact', 'sit', 'wait until 4:00'],
  },
  {
    name: 'pull the plug, swap the labels → win (Bob gets the pink box)',
    expect: { result: 'win', routes: ['bob'] },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'interact', 'goto own_desk pretend', 'sit', 'wait until 4:00'],
  },
  {
    name: 'same, but in the store room at 4:00 → still a win (nothing is missing, so nobody wonders where you are)',
    expect: { result: 'win', routes: ['bob'] },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'interact', 'goto store_room pretend', 'pretend until 4:00'],
  },
  {
    name: 'pull the plug, drawer, then out of the office at 4:00 → still a win (nobody knew of a parcel to miss)',
    expect: { result: 'win', routes: ['hidden'] },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'goto own_desk pretend', 'interact', 'goto lobby pretend', 'pretend until 4:00'],
  },
  {
    name: 'broom: poke the camera into the plant while it looks away, then the drawer → win (hidden)',
    expect: { result: 'win', routes: ['hidden'] },
    cmds: ['goto broom_stand', 'interact', 'goto camera pretend', 'pretend 0.5s', 'interact', 'goto broom_stand', 'interact', 'goto pigeonholes', 'interact', 'goto own_desk pretend', 'interact', 'sit', 'wait until 4:00'],
  },
  {
    name: 'broom: poke it into the plant, then hang about under it → Bob, coming over, sends you to your desk with work; the parcel waits for the mail call (fail)',
    expect: { result: 'fail' },
    cmds: ['goto broom_stand', 'interact', 'goto camera pretend', 'pretend 0.5s', 'interact', 'wait until 3:45', 'wait until 3:45', 'wait until 3:45'],
  },
  {
    name: 'broom: poke it while it looks at you → caught',
    expect: { result: 'caught' },
    cmds: [...POKE, 'wait until 4:00'],
  },
  {
    name: 'drop the parcel in the corridor → someone picks it up and reads the label',
    expect: { result: 'caught' },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'goto corridor pretend', 'interact', 'goto own_desk pretend', 'sit', 'wait until 4:00'],
  },
  {
    name: 'drop the parcel in the store room, back to your desk → win (hidden: Lin shrugs)',
    expect: { result: 'win', routes: ['hidden'] },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'goto 25,7 pretend', 'interact', 'goto 5,6 pretend', 'wait until 4:00'],
  },
  {
    name: 'carry the parcel into the office → Lin sees it in your arms and exclaims over it (caught)',
    expect: { result: 'caught' },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'goto 5,6 pretend', 'wait until 4:00'],
  },
];
