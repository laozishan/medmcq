import React from 'react';
import { getAvailableModes, normalizeReviewMode } from '../config/reviewModes.js';

export function ReviewTopbar({
  questions,
  question,
  mode,
  bankCount,
  onModeChange,
  onQuestionChange,
  onSetup,
  onOpenBank,
}) {
  const visibleQuestions = questions.filter((item) => item.domain === question.domain);

  return (
    <header className="topbar">
      <button className="brand-button" type="button" onClick={onSetup}>
        Med<span>MCQ</span>
      </button>
      <nav className="question-tabs" aria-label="Question tabs">
        {visibleQuestions.map((item, index) => (
          <button
            key={item.id}
            className={item.id === question.id ? 'active' : ''}
            type="button"
            onClick={() => onQuestionChange(item.id)}
          >
            Task {index + 1}
          </button>
        ))}
      </nav>
      <div className="topbar-actions">
        <select value={normalizeReviewMode(mode)} onChange={(event) => onModeChange(event.target.value)} aria-label="Review mode">
          {getAvailableModes(question).map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={onOpenBank}>
          Question bank <span>{bankCount}</span>
        </button>
        <button type="button" onClick={onSetup}>
          Setup
        </button>
      </div>
    </header>
  );
}
