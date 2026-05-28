import React from 'react';

export function RejectModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Reject question">
      <section className="modal">
        <div className="modal-head">
          <h2>Reject with feedback</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <div className="issue-list">
          {[
            'Too obvious',
            'Distractor too weak',
            'Missing key information',
            'Explanation unclear',
          ].map((issue) => (
            <label key={issue}>
              <input type="checkbox" />
              <span>{issue}</span>
            </label>
          ))}
        </div>
        <div className="action-row">
          <button className="reject" type="button" onClick={onClose}>Submit feedback</button>
        </div>
      </section>
    </div>
  );
}
