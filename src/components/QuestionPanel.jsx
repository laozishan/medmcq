import React, { useState } from 'react';
import { phrasesFromGraph } from '../lib/graph.js';
import { highlightText } from '../lib/text.js';
import { cloneQuestion } from '../lib/questions.js';

export function QuestionPanel({
  question,
  activeEvidenceId,
  onEvidenceHover,
  onSave,
  onAccept,
  onReject,
  onRegenerate,
  onReset,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(question);

  function startEditing() {
    setDraft(cloneQuestion(question));
    setEditing(true);
  }

  function saveDraft() {
    onSave(draft);
    setEditing(false);
  }

  function updateDraftOption(optionId, text) {
    setDraft((current) => ({
      ...current,
      options: current.options.map((option) => (option.id === optionId ? { ...option, text } : option)),
    }));
  }

  const displayQuestion = editing ? draft : question;
  const displayPhrases = phrasesFromGraph(displayQuestion.graph);
  const activeEvidenceIds = Array.isArray(activeEvidenceId)
    ? activeEvidenceId
    : activeEvidenceId
      ? [activeEvidenceId]
      : [];
  const displaySegments = highlightText(
    displayQuestion.vignette,
    displayPhrases,
    activeEvidenceIds,
  );

  return (
    <section className="question-panel">
      <div className="card">
        <div className="card-label">Clinical vignette</div>
        {editing ? (
          <textarea
            className="inline-vignette-editor"
            value={draft.vignette}
            onChange={(event) => setDraft((current) => ({ ...current, vignette: event.target.value }))}
            aria-label="Edit vignette"
          />
        ) : (
          <p className="vignette">
            {displaySegments.map((segment, index) =>
              segment.type === 'highlight' ? (
                <mark
                  key={`${segment.id}-${index}`}
                  className={segment.active ? 'active' : ''}
                  onMouseEnter={(event) => onEvidenceHover(segment.id, event)}
                  onMouseMove={(event) => onEvidenceHover(segment.id, event)}
                  onMouseLeave={() => onEvidenceHover(null)}
                >
                  {segment.text}
                </mark>
              ) : (
                <span key={index}>{segment.text}</span>
              ),
            )}
          </p>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-label">Question</div>
            {editing ? (
              <textarea
                className="inline-stem-editor"
                value={draft.stem}
                onChange={(event) => setDraft((current) => ({ ...current, stem: event.target.value }))}
                aria-label="Edit question stem"
              />
            ) : (
              <h1>{displayQuestion.stem}</h1>
            )}
          </div>
          <span className={`difficulty ${displayQuestion.difficulty}`}>{displayQuestion.difficulty}</span>
        </div>

        <div className="options">
          {displayQuestion.options.map((option) => (
            <div
              key={option.id}
              className={option.id === displayQuestion.correctOptionId ? 'option correct' : 'option'}
            >
              <span className="option-letter">{option.id}</span>
              {editing ? (
                <input
                  className="inline-option-editor"
                  value={option.text}
                  onChange={(event) => updateDraftOption(option.id, event.target.value)}
                  aria-label={`Edit option ${option.id}`}
                />
              ) : (
                <span>{option.text}</span>
              )}
              {option.id === displayQuestion.correctOptionId ? <strong>Correct</strong> : null}
            </div>
          ))}
        </div>

        <div className="action-row">
          <button className="accept" type="button" onClick={onAccept}>Accept</button>
          <button className="reject" type="button" onClick={onReject}>Reject</button>
          {editing ? (
            <>
              <button type="button" className="accept" onClick={saveDraft}>Save</button>
              <button type="button" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button type="button" onClick={startEditing}>Edit</button>
          )}
          {onRegenerate ? <button type="button" onClick={onRegenerate}>Regenerate</button> : null}
          <button type="button" onClick={onReset}>Reset</button>
        </div>
      </div>
    </section>
  );
}
