import React from 'react';

export function QuestionBankModal({ open, bank, onClose, onDelete }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Question bank">
      <section className="modal">
        <div className="modal-head">
          <h2>Question bank</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        {bank.length ? (
          <div className="bank-list">
            {bank.map((item) => (
              <article key={item.id} className="bank-card">
                <h3>{item.title}</h3>
                <p>{item.stem}</p>
                <small>{new Date(item.savedAt).toLocaleString()}</small>
                <button type="button" onClick={() => onDelete(item.id)}>Delete</button>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">No accepted questions yet.</p>
        )}
      </section>
    </div>
  );
}
