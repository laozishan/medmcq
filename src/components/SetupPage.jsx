import React, { useEffect, useMemo, useState } from 'react';
import { DIFFICULTIES } from '../config/difficulties.js';
import { filterQuestions, getDomains, getTopicsForDomain } from '../lib/catalog.js';

const DIFFICULTY_COPY = {
  easy: 'Basic concepts',
  medium: 'Clinical reasoning',
  hard: 'Complex cases',
};

export function SetupPage({ questions, selectedQuestionId, onStart }) {
  const [domain, setDomain] = useState(questions[0]?.domain ?? '');
  const [topic, setTopic] = useState(questions[0]?.topic ?? '');
  const [difficulty, setDifficulty] = useState(questions[0]?.difficulty ?? 'easy');
  const [startMode, setStartMode] = useState('new');

  const domains = useMemo(() => getDomains(questions), [questions]);
  const topics = useMemo(() => getTopicsForDomain(questions, domain), [domain, questions]);
  const filteredQuestions = useMemo(
    () => filterQuestions(questions, { domain, topic, difficulty }),
    [difficulty, domain, questions, topic],
  );

  const domainQuestions = useMemo(
    () => questions.filter((question) => question.domain === domain && question.topic === topic),
    [domain, questions, topic],
  );
  const selectedQuestion = startMode === 'existing'
    ? domainQuestions[0]
    : filteredQuestions[0] ?? domainQuestions[0];

  useEffect(() => {
    if (!domains.includes(domain) && domains[0]) setDomain(domains[0]);
  }, [domain, domains]);

  useEffect(() => {
    if (!topics.includes(topic) && topics[0]) setTopic(topics[0]);
  }, [topic, topics]);

  function handleStart() {
    if (selectedQuestion) onStart(selectedQuestion.id);
  }

  return (
    <main className="setup-page">
      <section className="setup-shell">
        <div className="brand-lockup">
          <div className="brand">Med<span>MCQ</span></div>
          <p>User study prototype - Question setup</p>
        </div>

        <div className="setup-grid">
          <div className="setup-panel">
            <h1>Question setup</h1>
            <p className="muted">Configure the expert review session.</p>

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
              <div className="difficulty-choice-row">
                {DIFFICULTIES.map((item) => (
                  <button
                    key={item}
                    className={difficulty === item ? 'active' : ''}
                    type="button"
                    onClick={() => setDifficulty(item)}
                  >
                    <strong>{item}</strong>
                    <small>{DIFFICULTY_COPY[item]}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-divider" />

            <div className="field">
              <span>Start from</span>
              <div className="mode-choice-row">
                <button
                  type="button"
                  className={startMode === 'new' ? 'active' : ''}
                  onClick={() => setStartMode('new')}
                >
                  <strong>Generate a new question</strong>
                  <small>AI generate MCQ</small>
                </button>
                <button
                  type="button"
                  className={startMode === 'existing' ? 'active' : ''}
                  onClick={() => setStartMode('existing')}
                >
                  <strong>Modify an existing question</strong>
                  <small>Edit from question bank</small>
                </button>
              </div>
            </div>

            <button className="primary-action" type="button" onClick={handleStart} disabled={!selectedQuestion}>
              {startMode === 'existing' ? 'Edit question' : 'Generate question'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
