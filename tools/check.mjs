#!/usr/bin/env node
// "Did I break anything?": every tools/test-*.mjs, routes.mjs, and the sim and render goldens for every level, in
// parallel. Exits 1 if anything fails.
//
//   node tools/check.mjs --fast   skip test-cold-read.mjs (about 90 s alone); the usual before-handback run, under a minute
//   node tools/check.mjs          everything
import { runChecks } from './lib/run-checks.mjs';

process.exit((await runChecks({ fast: process.argv.includes('--fast') })) ? 0 : 1);
