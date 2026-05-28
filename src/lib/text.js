export function highlightText(text, phrases, activeIds = []) {
  const active = new Set(activeIds);
  const matches = phrases
    .map((item) => {
      const index = text.toLowerCase().indexOf(item.phrase.toLowerCase());
      return index >= 0 ? { ...item, index, end: index + item.phrase.length } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index);

  const segments = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index < cursor) continue;
    if (match.index > cursor) {
      segments.push({ type: 'text', text: text.slice(cursor, match.index) });
    }
    segments.push({
      type: 'highlight',
      id: match.id,
      text: text.slice(match.index, match.end),
      active: active.has(match.id),
    });
    cursor = match.end;
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', text: text.slice(cursor) });
  }

  return segments;
}
