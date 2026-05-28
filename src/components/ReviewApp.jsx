import React, { useState } from 'react';
import { QuestionPanel } from './QuestionPanel.jsx';
import { ExplanationPanel } from './ExplanationPanel.jsx';
import { KnowledgeGraph } from './KnowledgeGraph.jsx';
import { QuestionBankModal } from './QuestionBankModal.jsx';
import { RegenerateModal } from './RegenerateModal.jsx';
import { RejectModal } from './RejectModal.jsx';

export function ReviewApp({
  questions,
  question,
  mode,
  bank,
  onModeChange,
  onQuestionChange,
  onSetup,
  onSaveQuestion,
  onResetQuestion,
  onAccept,
  onDeleteBankItem,
}) {
  const [activeEvidenceId, setActiveEvidenceId] = useState(null);
  const [bankOpen, setBankOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const showText = mode === 'text' || mode === 'both';
  const showGraph = mode === 'kg' || mode === 'both';

  return (
    <main className="review-app">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={onSetup}>
          Med<span>MCQ</span>
        </button>
        <nav className="question-tabs" aria-label="Question tabs">
          {questions.map((item) => (
            <button
              key={item.id}
              className={item.id === question.id ? 'active' : ''}
              type="button"
              onClick={() => onQuestionChange(item.id)}
            >
              {item.taskLabel}
              <small>{item.title}</small>
            </button>
          ))}
        </nav>
        <div className="topbar-actions">
          <select value={mode} onChange={(event) => onModeChange(event.target.value)} aria-label="Review mode">
            <option value="text">Text only</option>
            <option value="kg">KG only</option>
            <option value="both">KG + text</option>
          </select>
          <button type="button" onClick={() => setBankOpen(true)}>
            Question bank <span>{bank.length}</span>
          </button>
          <button type="button" onClick={onSetup}>Setup</button>
        </div>
      </header>

      <div className={`review-layout ${showText && showGraph ? 'three-column' : ''}`}>
        <QuestionPanel
          question={question}
          activeEvidenceId={activeEvidenceId}
          onEvidenceHover={setActiveEvidenceId}
          onSave={onSaveQuestion}
          onAccept={() => onAccept(question)}
          onReject={() => setRejectOpen(true)}
          onRegenerate={() => setRegenerateOpen(true)}
          onReset={() => onResetQuestion(question.id)}
        />

        {showGraph ? (
          <KnowledgeGraph
            graph={question.graph}
            activeEvidenceId={activeEvidenceId}
            onEvidenceHover={setActiveEvidenceId}
          />
        ) : null}

        {showText ? <ExplanationPanel question={question} /> : null}
      </div>

      <QuestionBankModal
        open={bankOpen}
        bank={bank}
        onClose={() => setBankOpen(false)}
        onDelete={onDeleteBankItem}
      />
      <RejectModal open={rejectOpen} onClose={() => setRejectOpen(false)} />
      <RegenerateModal
        open={regenerateOpen}
        question={question}
        onClose={() => setRegenerateOpen(false)}
        onApply={(nextQuestion) => {
          onSaveQuestion(nextQuestion);
          setRegenerateOpen(false);
        }}
      />
    </main>
  );
}
