import React, { useState } from 'react';

const ISSUES = [
  'Too obvious',
  'Distractor too weak',
  'Missing key information',
  'Explanation unclear',
];

export function RejectModal({ open, onClose, onSubmit }) {
  const [selectedIssues, setSelectedIssues] = useState([]);
  if (!open) return null;

  function toggleIssue(issue) {
    setSelectedIssues((current) => (
      current.includes(issue)
        ? current.filter((item) => item !== issue)
        : [...current, issue]
    ));
  }

  function submit() {
    onSubmit?.(selectedIssues);
    setSelectedIssues([]);
  }

  function close() {
    setSelectedIssues([]);
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
            <label key={issue}>
              <input
                type="checkbox"
                checked={selectedIssues.includes(issue)}
                onChange={() => toggleIssue(issue)}
              />
              <span>{issue}</span>
            </label>
          ))}
        </div>
        <div className="action-row">
          <button className="reject" type="button" onClick={submit}>Submit feedback</button>
        </div>
      </section>
    </div>
  );
}
