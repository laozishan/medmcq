import React from 'react';

export function QuestionEditor({ draft, onDraftChange, onSave, onCancel }) {
  return (
    <div className="card editor-card">
      <div className="card-label">Edit JSON-backed question fields</div>
      <label className="field">
        <span>Stem</span>
        <textarea
          value={draft.stem}
          onChange={(event) => onDraftChange({ ...draft, stem: event.target.value })}
        />
      </label>
      <label className="field">
        <span>Vignette</span>
        <textarea
          value={draft.vignette}
          onChange={(event) => onDraftChange({ ...draft, vignette: event.target.value })}
        />
      </label>
      <div className="option-editor-grid">
        {draft.options.map((option, index) => (
          <label className="field" key={option.id}>
            <span>Option {option.id}</span>
            <input
              value={option.text}
              onChange={(event) => {
                const options = [...draft.options];
                options[index] = { ...option, text: event.target.value };
                onDraftChange({ ...draft, options });
              }}
            />
          </label>
        ))}
      </div>
      <label className="field">
        <span>Correct option</span>
        <select
          value={draft.correctOptionId}
          onChange={(event) => onDraftChange({ ...draft, correctOptionId: event.target.value })}
        >
          {draft.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.id}
            </option>
          ))}
        </select>
      </label>
      <div className="action-row">
        <button className="accept" type="button" onClick={onSave}>
          Save revision
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
