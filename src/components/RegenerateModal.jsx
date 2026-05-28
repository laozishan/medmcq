import React from 'react';

export function RegenerateModal({ open, question, onClose, onApply }) {
  if (!open) return null;

  const canRegenerate = question.regenerable && question.regenerateTemplate;

  function applyRegeneration() {
    if (!canRegenerate) return;
    onApply({
      ...question,
      vignette: question.regenerateTemplate.vignette,
      stem: question.regenerateTemplate.stem,
      explanation: question.regenerateTemplate.explanation,
      regenerated: true,
      source: `${question.source} - regenerated`,
    });
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Regenerate question">
      <section className="modal wide-modal">
        <div className="modal-head">
          <h2>Regenerate question</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        {canRegenerate ? (
          <>
            <p className="muted">
              This uses a revised JSON template for the same question. You can replace this template with output from a
              model or a manually curated version later.
            </p>
            <h3>Clues marked as too direct</h3>
            <div className="issue-list">
              {(question.clueCandidates ?? []).map((clue) => (
                <label key={clue.id}>
                  <input type="checkbox" defaultChecked />
                  <span>{clue.label}</span>
                </label>
              ))}
            </div>
            <div className="preview-box">
              <strong>Revised vignette</strong>
              <p>{question.regenerateTemplate.vignette}</p>
            </div>
            <div className="action-row">
              <button className="accept" type="button" onClick={applyRegeneration}>Apply regenerated version</button>
            </div>
          </>
        ) : (
          <p className="empty-state">This question does not define a regenerateTemplate in JSON.</p>
        )}
      </section>
    </div>
  );
}
