// The one place the tools pick how many things run at once. BUSYWORK_JOBS=<n> caps every tool that fans out (check and merge,
// --all, the fuzzer's workers, cold-read's readers); unset (or not a positive integer) each keeps its own default.
export const jobs = (fallback) => {
  const n = Number.parseInt(process.env.BUSYWORK_JOBS ?? '', 10);
  return n > 0 ? n : fallback;
};

// A limiter: `const run = limiter(n); await run(() => work())` runs at most n works at a time (n Infinity: no limit).
export function limiter(n) {
  let active = 0;
  const waiting = [];
  return async (fn) => {
    while (active >= n) await new Promise((r) => waiting.push(r));
    active++;
    try { return await fn(); } finally { active--; waiting.shift()?.(); }
  };
}
