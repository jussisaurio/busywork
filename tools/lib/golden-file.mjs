// The golden files' layout and the merge arithmetic on their plans (no git here, so tools/test-golden-file.mjs can test it).
// A golden file is JSON with one plan per line, so a changed plan is one changed line and two branches that touch
// different plans do not touch the same lines: {"note":...,"plans":[ / one plan per line / ]}.

// The file text for { note, plans }: a header line, one line per plan, a closing line.
export function serializeGolden({ note, plans }) {
  return `{"note":${JSON.stringify(note)},"plans":[\n${plans.map((p) => JSON.stringify(p)).join(',\n')}\n]}\n`;
}

const key = (p) => p.cmds.join(';');

// The corpus after a merge: main's plans, then the branch's plans main does not have (deduplicated by cmds).
export function unionPlans(main, branch) {
  const seen = new Set();
  return [...main, ...branch].filter((p) => !seen.has(key(p)) && seen.add(key(p)));
}

// The plans whose summary after re-recording differs from every side that has the plan (main's and the branch's, by cmds):
// a behaviour change the combination produced that neither side reviewed. `fine` counts the others.
export function unreviewed(main, branch, merged) {
  const m = new Map(main.map((p) => [key(p), p.summary]));
  const b = new Map(branch.map((p) => [key(p), p.summary]));
  const changed = [];
  for (const p of merged) {
    const sides = [m.get(key(p)), b.get(key(p))].filter((s) => s !== undefined);
    if (!sides.includes(p.summary)) changed.push({ cmds: p.cmds, main: m.get(key(p)), branch: b.get(key(p)), merged: p.summary });
  }
  return { changed, fine: merged.length - changed.length };
}
