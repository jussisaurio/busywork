// Harness command runs that Meeting's plan lists share (shots.js, route-checks.js, toys.js `try`): each opening
// once, so a change to the day (a later coffee run, a moved desk) is fixed in one place. Timings are the day's
// (cast.js); the comments say what each one leans on.
export const POUR = ['goto coffee_machine busy', 'interact']; // 2:34: the day's only cup, before Kev's 2:38 coffee run
export const HIDE = ['goto my_desk_spot busy', 'put my_desk']; // the cup on your own desk, out of Kev's way
export const TO_THE_RACK = ['goto boss_office_door busy', 'goto coat_rack busy']; // through his office to his jacket
// At someone's keyboard, typing (toys.js KEYBOARDS): theirs is free only while they are up.
export const AT_LIN_KEYS = ['pretend until 2:59', 'goto lin_desk busy', 'interact']; // Lin off to the fridge
export const AT_KEV_KEYS = ['pretend until 2:40', 'goto type_kev busy', 'interact']; // Kev on his coffee run
