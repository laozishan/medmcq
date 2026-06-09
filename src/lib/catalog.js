export function getDomains(questions) {
  return unique(questions.map((question) => question.domain).filter(Boolean));
}

export function getTopicsForDomain(questions, domain) {
  return unique(
    questions
      .filter((question) => question.domain === domain)
      .map((question) => question.topic)
      .filter(Boolean),
  );
}

export function filterQuestions(questions, filters) {
  return questions.filter(
    (question) =>
      question.domain === filters.domain &&
      question.topic === filters.topic &&
      question.difficulty === filters.difficulty,
  );
}

function unique(items) {
  return [...new Set(items)];
}
