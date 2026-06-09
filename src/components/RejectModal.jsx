import React, { useState } from 'react';

const ISSUES = [
  {
    id: 'clinically-implausible',
    label: 'Clinically implausible',
    description: 'The vignette contains medically unrealistic or incorrect clinical information.',
  },
  {
    id: 'unclear-correct-answer',
    label: 'Correct answer unclear',
    description: 'The intended answer is ambiguous or not sufficiently supported.',
  },
  {
    id: 'missing-key-information',
    label: 'Key information missing',
    description: 'Essential diagnostic information is missing from the vignette.',
  },
  {
    id: 'answer-too-obvious',
    label: 'Answer too obvious',
    description: 'The answer is given away too directly by the vignette.',
  },
  {
    id: 'distractors-too-easy',
    label: 'Distractors too easy',
    description: 'The incorrect options are too easy to rule out.',
  },
  {
    id: 'distractors-debatable',
    label: 'Distractors clinically debatable',
    description: 'One or more distractors could also be reasonable.',
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
          <span>Others <small>optional</small></span>
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
