export function getDomains(questions) {
  return unique(activeQuestions(questions).map((question) => question.domain).filter(Boolean));
}

export function getTopicsForDomain(questions, domain) {
  return unique(
    activeQuestions(questions)
      .filter((question) => question.domain === domain)
      .map((question) => question.topic)
      .filter(Boolean),
  );
}

export function filterQuestions(questions, filters) {
  return activeQuestions(questions).filter(
    (question) =>
      question.domain === filters.domain &&
      question.topic === filters.topic &&
      question.difficulty === filters.difficulty,
  );
}

function activeQuestions(questions) {
  return questions.filter((question) => !question.archived);
}

function unique(items) {
  return [...new Set(items)];
}
