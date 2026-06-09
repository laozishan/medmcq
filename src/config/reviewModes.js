export const REVIEW_MODES = {
  text: 'Text',
  kg: 'KG',
};

export function defaultModeForQuestion(question) {
  if (question.defaultMode) return normalizeReviewMode(question.defaultMode);
  if (question.taskLabel === 'Task 1') return 'text';
  return 'kg';
}

export function getAvailableModes(question) {
  return [
    { value: 'text', label: REVIEW_MODES.text },
    { value: 'kg', label: REVIEW_MODES.kg },
  ];
}

export function modeVisibility(mode) {
  const normalizedMode = normalizeReviewMode(mode);
  return {
    showText: normalizedMode === 'text',
    showGraph: normalizedMode === 'kg',
  };
}

export function normalizeReviewMode(mode) {
  return mode === 'both' ? 'kg' : mode;
}
