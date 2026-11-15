// Discreet Packaging's route checks for tools/routes.mjs (the level's id is still 'monitor'; format:
// src/levels/meeting/route-checks.js).
const UNPLUG = ['goto socket pretend', 'interact'];
const POKE = ['goto broom_stand', 'interact', 'goto camera pretend', 'interact'];
export default [
  { name: 'do nothing → Lin holds up the pink box at the mail call', expect: { result: 'fail' }, cmds: ['wait until 4:00'] },
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
    name: 'label, pull the plug, relabel → win (Bob gets it)',
    expect: { result: 'win', routes: ['bob'] },
    cmds: ['goto label_printer', 'interact', ...UNPLUG, 'goto pigeonholes pretend', 'interact', 'sit', 'wait until 4:00'],
  },
  {
    name: 'same, but still in the back office at 4:00 → blamed',
    expect: { result: 'blamed', routes: ['bob'] },
    cmds: ['goto label_printer', 'interact', ...UNPLUG, 'goto pigeonholes pretend', 'interact', 'goto mailroom pretend', 'pretend until 4:00'],
  },
  {
    name: 'broom: poke the camera into the plant while it looks away, then the drawer → win (hidden)',
    expect: { result: 'win', routes: ['hidden'] },
    cmds: [...POKE, 'goto broom_stand', 'interact', 'goto pigeonholes', 'interact', 'goto own_desk pretend', 'interact', 'sit', 'wait until 4:00'],
  },
  {
    name: 'broom: poke it while it looks at you → caught',
    expect: { result: 'caught' },
    cmds: ['goto broom_stand', 'interact', 'goto camera pretend', 'pretend 0.5s', 'interact', 'wait until 4:00'],
  },
  {
    name: 'drop the parcel in the corridor → someone picks it up and reads the label',
    expect: { result: 'caught' },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'goto corridor pretend', 'interact', 'goto own_desk pretend', 'sit', 'wait until 4:00'],
  },
  {
    name: 'drop the parcel in the empty mailroom, back to your desk → win (hidden: Lin shrugs)',
    expect: { result: 'win', routes: ['hidden'] },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'goto 25,7 pretend', 'interact', 'goto 5,6 pretend', 'wait until 4:00'],
  },
  {
    name: 'carry the parcel into the office → Lin takes it off you and reads the label',
    expect: { result: 'caught' },
    cmds: [...UNPLUG, 'goto pigeonholes pretend', 'interact', 'goto 5,6 pretend', 'wait until 4:00'],
  },
];
