export function highlightText(text, phrases, activeIds = []) {
  const active = new Set(activeIds);
  const matches = phrases
    .map((item) => {
      const index = text.toLowerCase().indexOf(item.phrase.toLowerCase());
      return index >= 0 ? { ...item, index, end: index + item.phrase.length } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index || b.end - a.end);
  const mergedMatches = mergeEquivalentMatches(matches);

  const segments = [];
  let cursor = 0;

  for (const match of mergedMatches) {
    if (match.index < cursor) continue;
    if (match.index > cursor) {
      segments.push({ type: 'text', text: text.slice(cursor, match.index) });
    }
    segments.push({
      type: 'highlight',
      id: match.ids.length === 1 ? match.ids[0] : match.ids,
      text: text.slice(match.index, match.end),
      active: match.ids.some((id) => active.has(id)),
    });
    cursor = match.end;
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', text: text.slice(cursor) });
  }

  return segments;
}

function mergeEquivalentMatches(matches) {
  const merged = [];
  for (const match of matches) {
    const previous = merged.at(-1);
    if (previous && previous.index === match.index && previous.end === match.end) {
      previous.ids.push(match.id);
    } else {
      merged.push({ ...match, ids: [match.id] });
    }
  }
  return merged;
}
