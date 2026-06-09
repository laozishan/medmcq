import React from 'react';

export function ExplanationPanel({ question }) {
  const correct = question.options.find((option) => option.id === question.correctOptionId);
  const distractorEntries = Object.entries(question.explanation.distractors).map(([optionId, reason]) => {
    const option = question.options.find((item) => item.id === optionId);
    const miniGraph = question.miniGraphs?.find((item) => item.optionId === optionId);
    const plausible = [
      ...(miniGraph?.supports ?? []),
      ...(miniGraph?.weakens ?? []),
    ].map((item) => item.label).slice(0, 2);

    return {
      optionId,
      optionText: option?.text ?? optionId,
      plausible,
      reason,
    };
  });

  return (
    <section className="side-panel explanation-panel prototype-text-panel">
      <div className="prototype-correct-box">
        <h2>Why "{correct?.text}" is correct</h2>
        <p>{question.explanation.whyCorrect}</p>
        <ul>
          {question.explanation.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="prototype-distractor-grid">
        {distractorEntries.map((entry) => (
          <article key={entry.optionId} className="prototype-distractor-card">
            <h3>{entry.optionText}</h3>
            {entry.plausible.length ? (
              <p><strong>Looks plausible:</strong> {entry.plausible.join('; ')}.</p>
            ) : null}
            <p><strong>Less likely because:</strong> {entry.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
