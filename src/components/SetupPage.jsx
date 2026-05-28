import React, { useMemo, useState } from 'react';

export function SetupPage({ questions, selectedQuestionId, onStart }) {
  const [domain, setDomain] = useState(questions[0]?.domain ?? '');
  const [topic, setTopic] = useState(questions[0]?.topic ?? '');
  const [difficulty, setDifficulty] = useState('all');
  const [questionId, setQuestionId] = useState(selectedQuestionId);
  const [mode, setMode] = useState('kg');

  const domains = [...new Set(questions.map((question) => question.domain))];
  const topics = [...new Set(questions.filter((q) => q.domain === domain).map((q) => q.topic))];
  const filteredQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          question.domain === domain &&
          question.topic === topic &&
          (difficulty === 'all' || question.difficulty === difficulty),
      ),
    [difficulty, domain, questions, topic],
  );

  const selectedQuestion = filteredQuestions.find((question) => question.id === questionId) ?? filteredQuestions[0];

  function handleStart() {
    onStart(selectedQuestion.id, mode);
  }

  return (
    <main className="setup-page">
      <section className="setup-shell">
        <div className="brand-lockup">
          <div className="brand">Med<span>MCQ</span></div>
          <p>Data-driven expert review workspace</p>
        </div>

        <div className="setup-grid">
          <div className="setup-panel">
            <h1>Question setup</h1>
            <p className="muted">Choose a question dataset entry. The page, graph, explanation, and review controls are rendered from JSON.</p>

            <label className="field">
              <span>Domain</span>
              <select value={domain} onChange={(event) => setDomain(event.target.value)}>
                {domains.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Topic</span>
              <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                {topics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <div className="field">
              <span>Difficulty</span>
              <div className="segmented">
                {['all', 'easy', 'medium', 'hard'].map((item) => (
                  <button
                    key={item}
                    className={difficulty === item ? 'active' : ''}
                    type="button"
                    onClick={() => setDifficulty(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <label className="field">
              <span>Question</span>
              <select value={selectedQuestion?.id ?? ''} onChange={(event) => setQuestionId(event.target.value)}>
                {filteredQuestions.map((question) => (
                  <option key={question.id} value={question.id}>
                    {question.taskLabel} - {question.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="field">
              <span>Review mode</span>
              <div className="segmented">
                {[
                  ['text', 'Text'],
                  ['kg', 'KG'],
                  ['both', 'Both'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={mode === value ? 'active' : ''}
                    type="button"
                    onClick={() => setMode(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button className="primary-action" type="button" onClick={handleStart} disabled={!selectedQuestion}>
              Start review
            </button>
          </div>

          <aside className="schema-panel">
            <h2>JSON-driven structure</h2>
            <ul>
              <li><strong>Question:</strong> vignette, stem, options, correct answer</li>
              <li><strong>Explanation:</strong> why correct, evidence, distractors</li>
              <li><strong>Graph:</strong> nodes, edges, phrases, tooltips</li>
              <li><strong>Review:</strong> accept, edit, reject, regenerate</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
