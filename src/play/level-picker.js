// A small corner menu of every registered level, each a link to ?level=<id>. DOM only: the sim never sees it.
export function mountLevelPicker(levels, currentId) {
  const box = document.createElement('details');
  box.id = 'level-picker';
  const summary = document.createElement('summary');
  summary.textContent = 'levels';
  box.append(summary);
  for (const [id, level] of Object.entries(levels)) {
    const a = document.createElement('a');
    a.href = `?level=${encodeURIComponent(id)}`;
    a.textContent = `${level.title?.badge?.[0] ?? '·'} ${id}`;
    const line = document.createElement('small');
    line.textContent = level.title?.mission?.[0] ?? '';
    a.append(line);
    if (id === currentId) a.className = 'current';
    box.append(a);
  }
  // Space and Enter are game keys (the input listens on window), so focus must not stay on the menu.
  box.addEventListener('toggle', () => document.activeElement?.blur());
  document.body.append(box);
}
