import React, { useState } from 'react';

export function QuestionBankModal({ open, bank, onClose, onDelete, onSelect }) {
  const [activeStatus, setActiveStatus] = useState('accepted');
  if (!open) return null;

  const accepted = bank.filter((item) => normalizeStatus(item) === 'accepted');
  const rejected = bank.filter((item) => normalizeStatus(item) === 'rejected');
  const activeItems = activeStatus === 'accepted' ? accepted : rejected;
  const activeEmptyText =
    activeStatus === 'accepted' ? 'No accepted questions yet.' : 'No rejected questions yet.';
  const activeTitle =
    activeStatus === 'accepted' ? 'Accepted questions' : 'Rejected questions';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Question bank">
      <section className="modal">
        <div className="modal-head">
          <h2>Question bank</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        {bank.length ? (
          <div className="bank-sections">
            <div className="bank-status-toggle" role="group" aria-label="Question bank status">
              <button
                className={activeStatus === 'accepted' ? 'active' : ''}
                type="button"
                onClick={() => setActiveStatus('accepted')}
              >
                Accepted <span>{accepted.length}</span>
              </button>
              <button
                className={activeStatus === 'rejected' ? 'active' : ''}
                type="button"
                onClick={() => setActiveStatus('rejected')}
              >
                Rejected <span>{rejected.length}</span>
              </button>
            </div>
            <BankSection
              title={activeTitle}
              items={activeItems}
              emptyText={activeEmptyText}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          </div>
        ) : (
          <p className="empty-state">No saved questions yet.</p>
        )}
      </section>
    </div>
  );
}

function BankSection({ title, items, emptyText, onDelete, onSelect }) {
  return (
    <section className="bank-section">
      <h3>{title}</h3>
      {items.length ? (
        <div className="bank-list">
          {items.map((item) => (
            <article
              key={item.id}
              className="bank-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(item.questionId)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect?.(item.questionId);
                }
              }}
            >
              <h4>{item.title}</h4>
              <p>{item.stem}</p>
              {item.feedback?.length ? <small>{item.feedback.join(', ')}</small> : null}
              <div className="bank-card-foot">
                <small>{new Date(item.savedAt).toLocaleString()}</small>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state compact-empty">{emptyText}</p>
      )}
    </section>
  );
}

function normalizeStatus(item) {
  return item.status === 'rejected' ? 'rejected' : 'accepted';
}
