import React, { useState } from 'react';

const ISSUES = [
  {
    id: 'clinically-inaccurate',
    label: 'Clinically inaccurate',
    description: 'Incorrect, unrealistic, or contradictory vignette information.',
  },
  {
    id: 'key-information-missing',
    label: 'Key information missing',
    description: 'Essential diagnostic details are absent.',
  },
  {
    id: 'answer-ambiguous',
    label: 'Answer ambiguous',
    description: 'The correct answer is unclear or one or more distractors could reasonably be correct.',
  },
  {
    id: 'distractors-too-easy',
    label: 'Distractors too easy',
    description: 'Incorrect options are implausible or trivial to eliminate.',
  },
];

export function RejectModal({ open, onClose, onSubmit }) {
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [otherFeedback, setOtherFeedback] = useState('');
  if (!open) return null;

  function toggleIssue(issue) {
    setSelectedIssues((current) => (
      current.includes(issue)
        ? current.filter((item) => item !== issue)
        : [...current, issue]
    ));
  }

  function submit() {
    const trimmedOther = otherFeedback.trim();
    onSubmit?.([
      ...selectedIssues,
      ...(trimmedOther ? [`Other: ${trimmedOther}`] : []),
    ]);
    setSelectedIssues([]);
    setOtherFeedback('');
  }

  function close() {
    setSelectedIssues([]);
    setOtherFeedback('');
    onClose?.();
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Reject question">
      <section className="modal">
        <div className="modal-head">
          <h2>Reject with feedback</h2>
          <button type="button" onClick={close}>Close</button>
        </div>
        <div className="issue-list">
          {ISSUES.map((issue) => (
            <label key={issue.id} className="issue-card">
              <input
                type="checkbox"
                checked={selectedIssues.includes(issue.label)}
                onChange={() => toggleIssue(issue.label)}
              />
              <span>
                <strong>{issue.label}</strong>
                <small>{issue.description}</small>
              </span>
            </label>
          ))}
        </div>
        <label className="optional-feedback">
          <span>Other <small>optional</small></span>
          <textarea
            value={otherFeedback}
            onChange={(event) => setOtherFeedback(event.target.value)}
            placeholder="Add any other reason for rejection..."
            rows={3}
          />
        </label>
        <div className="action-row">
          <button className="reject" type="button" onClick={submit}>Submit feedback</button>
        </div>
      </section>
    </div>
  );
}
