export function cloneQuestion(question) {
  return structuredClone(question);
}

export function cloneQuestionList(questions) {
  return questions.map(cloneQuestion);
}

export function replaceQuestion(questions, nextQuestion) {
  return questions.map((question) => (question.id === nextQuestion.id ? nextQuestion : question));
}

export function makeBankItem(question, status = 'accepted', feedback = []) {
  return {
    id: `${question.id}-${Date.now()}`,
    savedAt: new Date().toISOString(),
    status,
    feedback,
    questionId: question.id,
    title: question.title,
    stem: question.stem,
    vignette: question.vignette,
    options: question.options,
    correctOptionId: question.correctOptionId,
    source: question.source,
  };
}

export function removePhraseFromVignette(vignette, phrase) {
  if (!phrase) return vignette;
  return vignette.replace(new RegExp(escapeRegExp(phrase), 'i'), '').replace(/\s{2,}/g, ' ').trim();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
