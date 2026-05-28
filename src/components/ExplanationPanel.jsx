import React from 'react';

export function ExplanationPanel({ question }) {
  const correct = question.options.find((option) => option.id === question.correctOptionId);

  return (
    <section className="side-panel explanation-panel">
      <div className="panel-head">
        <div>
          <span>Explanation</span>
          <h2>{correct?.id}. {correct?.text}</h2>
        </div>
      </div>

      <div className="why-box">
        <h3>Why this is correct</h3>
        <p>{question.explanation.whyCorrect}</p>
      </div>

      <h3>Evidence</h3>
      <ul className="evidence-list">
        {question.explanation.evidence.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h3>Distractors</h3>
      <div className="distractor-list">
        {Object.entries(question.explanation.distractors).map(([optionId, reason]) => (
          <article key={optionId}>
            <strong>{optionId}</strong>
            <p>{reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
